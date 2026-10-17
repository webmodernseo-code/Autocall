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
import { hit, throttleKey, tooManyAttempts } from '@/lib/rate-limit';

import { ensureClientWorkspace } from '@/lib/domain/clients';
import {
    activateFreePlan,
    normalizeBillingCycle,
    postRegistrationTarget,
    resolveRegistrationPlan,
} from '@/lib/registration-plan';

/**
 * POST /register.
 * Creates the user, fires the "Registered" side effect (verification mail) and
 * logs them straight in.
 */
export const POST = handler(async (request) => {
    const body = await readBody(request);
    const detected = detectRegionalPreferences(request.headers);
    const key = `register|${throttleKey('', request)}`;

    if (await tooManyAttempts(key, 5)) {
        return NextResponse.json(
            { errors: { email: ['Trop de tentatives. Réessayez dans une heure.'] } },
            { status: 429 },
        );
    }

    const data = await validate(
        body,
        {
            name: ['required', 'string', 'max:255'],
            email: ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            password: ['required', 'string', 'min:8', 'confirmed'],
            plan_slug: ['required', 'string', 'in:free,starter,pro,agency'],
            billing_cycle: ['required', 'string', 'in:month,year'],
        },
        {
            prisma,
            messages: {
                'name.required': 'Indiquez votre nom ou votre raison sociale.',
                'email.required': 'Indiquez votre adresse e-mail.',
                'email.email': 'Indiquez une adresse e-mail valide.',
                'email.unique': 'Un compte existe déjà avec cette adresse e-mail.',
                'password.required': 'Choisissez un mot de passe.',
                'password.min': 'Le mot de passe doit contenir au moins 8 caractères.',
                'password.confirmed': 'La confirmation du mot de passe ne correspond pas.',
                'plan_slug.required': 'Choisissez un forfait.',
            },
        },
    );
    const selectedPlan = await resolveRegistrationPlan(data.plan_slug);
    if (!selectedPlan) {
        return NextResponse.json(
            { errors: { plan_slug: ['Ce forfait est indisponible. Choisissez une autre offre.'] } },
            { status: 422 },
        );
    }
    const billingCycle = normalizeBillingCycle(data.billing_cycle);
    await hit(key, 60 * 60);

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
    await activateFreePlan(user.id, clientId, selectedPlan);

    // event(new Registered($user)) -> SendEmailVerificationNotification
    let emailSent = false;
    try {
        emailSent = await sendTemplateMail('email_verification', user.email, {
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
        pending_plan_slug: selectedPlan.slug,
        pending_billing_cycle: billingCycle,
    });

    return NextResponse.json({
        redirect: emailSent ? '/verify-email' : '/verify-email?status=delivery-failed',
        next: postRegistrationTarget(selectedPlan.slug, billingCycle),
    });
});
