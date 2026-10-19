import prisma from '@/lib/prisma';
import { gateClient, gatePlanFeature, handler } from '@/lib/guards';
import { back, readBody, validate, validationError } from '@/lib/http';
import { messagingSettings } from '@/lib/services/messaging';
import config from '@/lib/config';
import { encryptString, maybeDecrypt } from '@/lib/crypt';

/** POST /app/messaging/whatsapp/accounts */
export const POST = handler(async (request) => {
    const gate = await gateClient({ routeName: 'client.messaging.whatsapp.accounts.store' });
    if (gate.response) return gate.response;

    const gated = await gatePlanFeature(gate.user, 'messaging');
    if (gated) return gated;

    const data = await validate(await readBody(request), {
        provider: ['required', 'in:meta,whatsway'],
        label: ['nullable', 'string', 'max:255'],
        display_number: ['nullable', 'string', 'max:32'],
        phone_number_id: ['nullable', 'string', 'max:255'],
        waba_id: ['nullable', 'string', 'max:255'],
        access_token: ['nullable', 'string', 'max:4096'],
        code: ['nullable', 'string', 'max:4096'],
        api_key: ['nullable', 'string', 'max:2048'],
        base_url: ['nullable', 'url', 'max:2048'],
    });

    if (data.base_url && new URL(data.base_url).protocol !== 'https:') {
        return back({ error: 'L’URL WhatsWay doit utiliser HTTPS.' });
    }

    let token = data.access_token ?? null;

    // If OAuth code from Meta Embedded Signup is provided, exchange for access token
    if (data.provider === 'meta' && data.code) {
        const s = await messagingSettings();
        const appId = s?.meta_app_id || config.messaging.meta.app_id;
        const appSecret = maybeDecrypt(s?.meta_app_secret) || config.messaging.meta.app_secret;
        if (!appId || !appSecret) {
            return validationError({ code: ['La configuration OAuth Meta est incomplète.'] });
        }
        if (appId && appSecret) {
            try {
                const url = `https://graph.facebook.com/${config.messaging.meta.graph_version}/oauth/access_token`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ client_id: appId, client_secret: appSecret, code: data.code }),
                    signal: AbortSignal.timeout(10000),
                });
                const json = await res.json();
                if (!res.ok || !json.access_token) {
                    return validationError({ code: ['Échec de connexion à Meta.'] });
                }
                token = json.access_token;
            } catch (err) {
                console.warn('Error exchanging Meta Embedded Signup code:', err?.message);
                return validationError({ code: ['Échec de connexion à Meta.'] });
            }
        }
    }

    if (data.provider === 'meta' && !token) {
        return validationError({ access_token: ['Un jeton Meta ou un code OAuth valide est requis.'] });
    }

    await prisma.whatsAppAccount.create({
        data: {
            client_id: BigInt(gate.clientId),
            provider: data.provider,
            label: data.label || (data.display_number ? `WhatsApp (${data.display_number})` : 'WhatsApp Business'),
            display_number: data.display_number ?? null,
            phone_number_id: data.phone_number_id ?? null,
            waba_id: data.waba_id ?? null,
            access_token: token ? encryptString(token) : null,
            api_key: data.api_key ? encryptString(data.api_key) : null,
            base_url: data.base_url ?? null,
            status: 'connected',
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    return back({ success: 'Compte WhatsApp connecté avec succès.' });
});
