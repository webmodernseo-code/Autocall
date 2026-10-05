import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handler } from '@/lib/guards';
import { readBody, validate, validationError } from '@/lib/http';
import { verifyPassword } from '@/lib/auth';
import { writeAdminSession } from '@/lib/auth/session';
import { availableIn, clear, hit, throttleKey, tooManyAttempts } from '@/lib/rate-limit';

/**
 * POST /admin/login via AdminLoginRequest.
 * Allowed in demo mode, matching EnsureNotDemoMode's explicit exception.
 */
export const POST = handler(async (request) => {
    const body = await readBody(request);
    await validate(body, {
        email: ['required', 'string', 'email'],
        password: ['required', 'string'],
    });

    const key = `admin:${throttleKey(body.email, request)}`;

    if (await tooManyAttempts(key, 5)) {
        const seconds = await availableIn(key);
        return validationError({
            email: [`Too many login attempts. Please try again in ${seconds} seconds.`],
        });
    }

    let admin = null;
    try {
        admin = await prisma.adminUser.findUnique({
            where: { email: String(body.email).toLowerCase() },
        });
    } catch (e) {
        console.error('[admin-login] database unavailable');
    }

    const valid = admin && (await verifyPassword(body.password, admin.password));
    if (!valid) {
        await hit(key);
        return validationError({ email: ['Ces identifiants ne correspondent pas à nos enregistrements.'] });
    }

    if (admin.status !== 'ACTIVE') {
        await hit(key);
        return validationError({ email: ['Votre compte administrateur est inactif.'] });
    }

    await clear(key);
    await writeAdminSession({ uid: Number(admin.id), name: admin.name, email: admin.email });

    return NextResponse.json({ redirect: '/admin' });
});
