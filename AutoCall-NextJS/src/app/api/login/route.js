import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handler } from '@/lib/guards';
import { readBody, validate, validationError } from '@/lib/http';
import { verifyPassword } from '@/lib/auth';
import { writeSession } from '@/lib/auth/session';
import { availableIn, clear, hit, throttleKey, tooManyAttempts } from '@/lib/rate-limit';
import { detectRegionalPreferences } from '@/lib/regional-preferences.mjs';
import { safeRedirectPath } from '@/lib/safe-redirect.mjs';

/**
 * POST /login via LoginRequest.
 * Same 5-attempt throttle keyed on email+IP.
 */
export const POST = handler(async (request) => {
    const body = await readBody(request);
    const detected = detectRegionalPreferences(request.headers);
    await validate(body, {
        email: ['required', 'string', 'email'],
        password: ['required', 'string'],
    });

    const key = throttleKey(body.email, request);

    if (await tooManyAttempts(key, 5)) {
        const seconds = await availableIn(key);
        return validationError({
            email: [
                `Trop de tentatives de connexion. Réessayez dans ${seconds} secondes.`,
            ],
        });
    }

    let user = null;
    try {
        user = await prisma.user.findUnique({ where: { email: String(body.email).toLowerCase() } });
    } catch (e) {
        console.error('[login] database unavailable');
    }

    const valid = user && (await verifyPassword(body.password, user.password));
    if (!valid) {
        await hit(key);
        return validationError({ email: ['Ces identifiants ne correspondent pas à nos enregistrements.'] });
    }

    if ((user.status ?? 'active') !== 'active') {
        await hit(key);
        return validationError({ email: ['Votre compte est désactivé.'] });
    }

    await clear(key);

    if (!user.email_verified_at) {
        await writeSession({
            uid: Number(user.id),
            client_id: user.client_id ? Number(user.client_id) : null,
            current_tenant_id: user.tenant_id ? Number(user.tenant_id) : null,
            locale: user.locale ?? null,
            display_currency: user.display_currency ?? detected.currency,
            theme: user.theme ?? 'light',
        });
        return NextResponse.json({ redirect: '/verify-email' });
    }

    let effectiveClientId = user.client_id;
    if (user.role === 'client' && !effectiveClientId) {
        const { ensureClientWorkspace } = await import('@/lib/domain/clients');
        effectiveClientId = await ensureClientWorkspace(user);
    }

    if (user.role === 'client' && effectiveClientId) {
        const { effectiveSubscription, subscriptionIsActive } = await import('@/lib/auth');
        const sub = await effectiveSubscription(user);
        if (!sub || !subscriptionIsActive(sub)) {
            await writeSession({
                uid: Number(user.id),
                client_id: Number(effectiveClientId),
                current_tenant_id: user.tenant_id ? Number(user.tenant_id) : null,
                locale: user.locale ?? null,
                display_currency: user.display_currency ?? detected.currency,
                theme: user.theme ?? 'light',
            });
            return NextResponse.json({ redirect: '/app/pricing?required=1' });
        }

        const url = new URL(request.url);
        const intended = url.searchParams.get('redirect');

        const firstAgent = await prisma.agent.findFirst({
            where: { client_id: BigInt(effectiveClientId) },
            orderBy: { id: 'asc' },
            select: { meta: true },
        });
        if (!intended && (!firstAgent || (firstAgent.meta?.onboarding && !firstAgent.meta.onboarding.completed_at))) {
            await writeSession({
                uid: Number(user.id),
                client_id: Number(effectiveClientId),
                current_tenant_id: user.tenant_id ? Number(user.tenant_id) : null,
                locale: user.locale ?? null,
                display_currency: user.display_currency ?? detected.currency,
                theme: user.theme ?? 'light',
            });
            return NextResponse.json({ redirect: '/app/onboarding' });
        }
    }

    await writeSession({
        uid: Number(user.id),
        client_id: effectiveClientId ? Number(effectiveClientId) : null,
        current_tenant_id: user.tenant_id ? Number(user.tenant_id) : null,
        locale: user.locale ?? null,
        display_currency: user.display_currency ?? detected.currency,
        theme: user.theme ?? 'light',
    });

    const url = new URL(request.url);
    const intended = url.searchParams.get('redirect');
    let target = safeRedirectPath(intended);

    if (user.role === 'client' && (!intended || target === '/app/dashboard')) {
        const { effectiveSubscription, subscriptionIsActive } = await import('@/lib/auth');
        const sub = await effectiveSubscription(user);
        if (!sub || !subscriptionIsActive(sub)) {
            target = '/app/pricing?required=1';
        }
    }

    return NextResponse.json({
        redirect: target,
    });
});
