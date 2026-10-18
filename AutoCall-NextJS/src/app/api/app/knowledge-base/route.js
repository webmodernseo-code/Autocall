import prisma from '@/lib/prisma';
import { gateClient, handler } from '@/lib/guards';
import { back, readBody, validate } from '@/lib/http';
import { limitFor } from '@/lib/plans';
import { deleteFile, storeFile } from '@/lib/storage';
import { extractText } from '@/lib/services/document-text';
import { safeFetch } from '@/lib/services/outbound-guard';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
const ALLOWED_EXTENSIONS = ['txt', 'pdf', 'doc', 'docx', 'csv', 'md'];

/** POST /app/knowledge-base */
export const POST = handler(async (request) => {
    const gate = await gateClient({ routeName: 'client.knowledge-base.store' });
    if (gate.response) return gate.response;

    const body = await readBody(request);

    const data = await validate(body, {
        type: ['required', 'string', 'in:url,file,text'],
        title: ['required', 'string', 'max:255'],
        source_url: body.type === 'url' ? ['required', 'url', 'max:2048'] : ['nullable'],
        content: body.type === 'text' ? ['required', 'string', 'max:200000'] : ['nullable'],
    });

    const client_id = BigInt(gate.clientId);
    const limitMb = (await limitFor(gate.clientId, 'kb_mb')) ?? 0;
    const usedAgg = await prisma.knowledgeBaseItem.aggregate({
        where: { client_id },
        _sum: { file_size_bytes: true },
    });
    const usedBytes = Number(usedAgg._sum.file_size_bytes ?? 0);

    // Validate file upload constraints prior to ingestion (AUTOCALL-SEC-002)
    if (body.type === 'file') {
        if (!(body.file instanceof File)) {
            return back({ error: 'Un fichier de document valide est requis.' });
        }
        if (body.file.size > MAX_FILE_SIZE_BYTES) {
            return back({ error: 'La taille du fichier ne doit pas dépasser 10 Mo.' });
        }
        const ext = (body.file.name?.split('.').pop() ?? '').toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return back({ error: 'Format de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX, TXT, CSV, MD.' });
        }
        // Pre-check storage quota before writing to disk
        if (limitMb > 0 && usedBytes + body.file.size > limitMb * 1048576) {
            return back({ error: `La limite d'espace de stockage (${limitMb} Mo) est atteinte.` });
        }
    }

    const [content, filePath, size, status] = await ingest(body, data, gate.clientId);

    if (limitMb > 0 && usedBytes + size > limitMb * 1048576) {
        if (filePath) await deleteFile(filePath);
        return back({ error: `La limite d'espace de stockage (${limitMb} Mo) est atteinte.` });
    }

    await prisma.knowledgeBaseItem.create({
        data: {
            client_id,
            type: data.type,
            title: data.title,
            source_url: data.source_url ?? null,
            file_path: filePath,
            file_size_bytes: size,
            content,
            tokens: content ? Math.ceil(content.length / 4) : null,
            status,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    if (status === 'failed') {
        const what = data.type === 'url' ? 'cette page web' : 'ce fichier';
        return back({
            error: `Impossible d'extraire le texte depuis ${what}. Vérifiez que le document contient du texte lisible et réessayez.`,
        });
    }

    return back({ success: 'Document ajouté à la base de connaissances avec succès.' });
});

/** → [content, filePath, sizeBytes, status] */
async function ingest(body, data, clientId) {
    if (data.type === 'text') {
        const content = String(data.content ?? '');
        return [content, null, Buffer.byteLength(content), 'ready'];
    }

    if (data.type === 'url') {
        try {
            // Hardened SSRF & DNS Rebinding safe fetch
            const res = await safeFetch(String(data.source_url), {
                signal: AbortSignal.timeout(15000),
            });

            if (res.ok) {
                const html = await res.text();
                const text = html
                    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
                    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 100000);
                return [text, null, Buffer.byteLength(text), 'ready'];
            }
        } catch {
            /* fall through to failed */
        }
        return [null, null, 0, 'failed'];
    }

    const file = body.file;
    const path = await storeFile(file, `knowledge-base/${clientId}`, 'local');
    const size = file.size ?? 0;
    const ext = (file.name?.split('.').pop() ?? '').toLowerCase();

    let content = null;
    try {
        content = await extractText(path, ext);
        // Truncate to maximum safe extraction size (200k chars)
        if (content && content.length > 200000) {
            content = content.slice(0, 200000);
        }
    } catch (e) {
        console.error('KB text extraction failed', e);
        await deleteFile(path);
        return [null, null, 0, 'failed'];
    }

    return [content, path, Number(size), content ? 'ready' : 'failed'];
}
