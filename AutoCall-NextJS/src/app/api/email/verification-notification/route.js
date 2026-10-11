import { NextResponse } from 'next/server';
import config from '@/lib/config';
import { gateUser, handler } from '@/lib/guards';
import { sendTemplateMail } from '@/lib/services/mail';
import { verificationUrl } from '@/lib/auth/verification';
import { hit, throttleKey, tooManyAttempts } from '@/lib/rate-limit';

/** POST /email/verification-notification */
export const POST = handler(async (request) => {
    const gate = await gateUser();
    if (gate.response) return gate.response;

    if (gate.user.email_verified_at) {
        return NextResponse.json({ redirect: '/app/dashboard' });
    }

    const key = `verify|${throttleKey(gate.user.email, request)}`;
    if (await tooManyAttempts(key, 3)) {
        return NextResponse.json(
            { flash: { error: 'Trop de demandes. Réessayez dans 15 minutes.' } },
            { status: 429 },
        );
    }
    await hit(key, 15 * 60);

    const sent = await sendTemplateMail('email_verification', gate.user.email, {
        app_name: config.app.name,
        verification_url: await verificationUrl(gate.user),
    });

    if (!sent) {
        return NextResponse.json(
            { flash: { error: "L'e-mail n'a pas pu être envoyé. Réessayez dans quelques instants." }, status: 'delivery-failed' },
            { status: 503 },
        );
    }

    return NextResponse.json({ flash: { success: 'Un nouveau lien de vérification a été envoyé.' }, status: 'verification-link-sent' });
});
