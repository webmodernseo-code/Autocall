import prisma from '@/lib/prisma';
import { handler } from '@/lib/guards';
import { requireAdminPermissions } from '@/lib/guards-admin';
import { abort } from '@/lib/http';
import { readFile } from '@/lib/storage';

/**
 * GET /admin/kyc/file/{kycDocument}.
 * KYC uploads live on the private disk, so they are streamed, never linked.
 * Sanitizes Content-Disposition to prevent HTTP Header Injection (CWE-113).
 */
export const GET = handler(async (request, { params }) => {
    await requireAdminPermissions('view_clients');

    const { kycDocument: id } = await params;
    const doc = await prisma.kycDocument.findUnique({ where: { id: BigInt(id) } });
    if (!doc?.file_path) return abort(404);

    const body = await readFile(doc.file_path, 'local');
    if (!body) return abort(404);

    // Sanitize filename against CRLF / quote injection
    const rawName = String(doc.original_name ?? 'document').trim();
    const safeName = rawName.replace(/[\r\n\0"\\]/g, '_') || 'document';
    const encodedName = encodeURIComponent(safeName);

    return new Response(body, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${safeName}"; filename*=UTF-8''${encodedName}`,
            'Content-Length': String(body.length),
            'X-Content-Type-Options': 'nosniff',
        },
    });
});
