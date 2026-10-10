import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handler } from '@/lib/guards';
import { currentUser } from '@/lib/auth';
import { emailVerificationHash, hasValidSignature } from '@/lib/auth/verification';
import { redirectWithFlash } from '@/lib/http';
import config from '@/lib/config';

/** GET /verify-email/{id}/{hash} (signed). */
export const GET = handler(async (request, { params }) => {
    const { id, hash } = await params;

    if (!hasValidSignature(request.url)) {
        return NextResponse.redirect(new URL('/verify-email?status=invalid', config.app.url));
    }

    let targetUser = null;
    try {
        targetUser = await prisma.user.findUnique({
            where: { id: BigInt(id) },
        });
    } catch {
        return NextResponse.redirect(new URL('/verify-email?status=invalid', config.app.url));
    }

    if (!targetUser || emailVerificationHash(targetUser.email) !== hash) {
        return NextResponse.redirect(new URL('/verify-email?status=invalid', config.app.url));
    }

    if (!targetUser.email_verified_at) {
        await prisma.user.update({
            where: { id: targetUser.id },
            data: { email_verified_at: new Date(), updated_at: new Date() },
        });
    }

    const user = await currentUser();
    if (!user) {
        return NextResponse.redirect(new URL('/login?verified=1', config.app.url));
    }
    if (String(user.id) !== String(targetUser.id)) {
        return NextResponse.redirect(new URL('/app/dashboard', config.app.url));
    }

    return redirectWithFlash(new URL('/app/dashboard?verified=1', config.app.url), {
        success: 'Votre adresse e-mail a été vérifiée avec succès !',
    });
});
