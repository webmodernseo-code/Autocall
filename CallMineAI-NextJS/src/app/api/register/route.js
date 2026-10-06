import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handler } from '@/lib/guards';
import { readBody, validate } from '@/lib/http';
import { hashPassword } from '@/lib/auth';
import { writeSession } from '@/lib/auth/session';
import { sendTemplateMail } from '@/lib/services/mail';
import { verificationUrl } from '@/lib/auth/verification';
import config from '@/lib/config';
import { detectRegionalPreferences } from '@/lib/regional-preferences.mjs';

import { ensureClientWorkspace } from '@/lib/domain/clients';

/**
 * POST /register.
 * Creates the user, fires the "Registered" side effect (verification mail) and
 * logs them straight in.
 */
export const POST = handler(async (request) => {
    const body = await readBody(request);
    const detected = detectRegionalPreferences(request.headers);

    const data = await validate(
        body,
        {
            name: ['required', 'string', 'max:255'],
            email: ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            password: ['required', 'string', 'min:8', 'confirmed'],
        },
        { prisma },
    );

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: String(data.email).toLowerCase(),
            password: await hashPassword(data.password),
            role: 'client',
            status: 'active',
            locale: detected.locale,
            display_currency: detected.currency,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    // Provision default workspace and initial credits for the client
    const clientId = await ensureClientWorkspace(user);

    // event(new Registered($user)) -> SendEmailVerificationNotification
    try {
        await sendTemplateMail('email_verification', user.email, {
            app_name: config.app.name,
            verification_url: await verificationUrl(user),
        });
    } catch (e) {
        console.error('[register] verification mail failed:', e?.message);
    }

    await writeSession({
        uid: Number(user.id),
        client_id: clientId ? Number(clientId) : null,
        current_tenant_id: null,
        locale: user.locale ?? null,
        display_currency: user.display_currency ?? detected.currency,
        theme: 'light',
    });

    return NextResponse.json({ redirect: '/app/dashboard' });
});
