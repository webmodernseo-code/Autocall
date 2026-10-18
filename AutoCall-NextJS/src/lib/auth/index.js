import 'server-only';

import { cache } from 'react';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getAdminSession, getSession } from './session';

/* ------------------------------------------------------------- passwords */

/**
 * Passwords are bcrypt hashes; bcryptjs also verifies the `$2y$` prefix,
 * so existing users keep working without a password reset.
 */
export async function verifyPassword(plain, hash) {
    if (!plain || !hash) return false;
    try {
        return await bcrypt.compare(plain, hash);
    } catch {
        return false;
    }
}

export async function hashPassword(plain) {
    return bcrypt.hash(plain, 12);
}

/* ----------------------------------------------------------------- guards */

export const currentUser = cache(async function currentUser() {
    const session = await getSession();
    if (session?.uid) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: BigInt(session.uid) },
                include: { clients: true },
            });
            if (user && (user.status ?? 'active') === 'active') return user;
        } catch (e) {
            console.error('[auth] currentUser lookup error:', e?.message || e);
        }
    }

    // Return null if not authenticated
    return null;
});

/** `$request->user('admin')` — the admin guard. */
export const currentAdmin = cache(async function currentAdmin() {
    const session = await getAdminSession();
    if (!session?.uid) return null;

    try {
        const admin = await prisma.adminUser.findUnique({ where: { id: BigInt(session.uid) } });
        if (admin && admin.status === 'ACTIVE') return admin;
    } catch (e) {
        // Silently fallback
    }
    return null;
});

/* ------------------------------------------------------------ admin RBAC */

export async function adminPermissionKeys(adminId) {
    try {
        const rows = await prisma.adminRole.findMany({
            where: { admin_user_id: BigInt(adminId) },
            include: { roles: { include: { role_permission: { include: { permissions: true } } } } },
        });

        const keys = new Set();
        for (const row of rows) {
            for (const rp of row.roles?.role_permission ?? []) {
                if (rp.permissions?.key) keys.add(rp.permissions.key);
            }
        }
        return [...keys];
    } catch {
        return [];
    }
}

export async function adminIsSuper(adminId) {
    try {
        const row = await prisma.adminRole.findFirst({
            where: { admin_user_id: BigInt(adminId), roles: { key: 'SUPER_ADMIN' } },
        });
        return !!row;
    } catch {
        return false;
    }
}

export async function adminCan(adminId, permissionKey) {
    if (await adminIsSuper(adminId)) return true;
    const keys = await adminPermissionKeys(adminId);
    return keys.includes(permissionKey);
}

/* ----------------------------------------------------------- client RBAC */

export async function clientPermissionKeys(user) {
    if (!user) return [];
    if (user.client_role === 'administrator') return ['*'];

    try {
        const roles = await prisma.clientUserRole.findMany({
            where: { user_id: user.id },
            include: {
                client_roles: {
                    include: { client_role_permission: { include: { client_permissions: true } } },
                },
            },
        });

        if (roles.length === 0) return [];

        const keys = new Set();
        for (const row of roles) {
            for (const rp of row.client_roles?.client_role_permission ?? []) {
                if (rp.client_permissions?.key) keys.add(rp.client_permissions.key);
            }
        }
        return [...keys];
    } catch {
        return [];
    }
}

export async function userCan(user, permissionKey) {
    const keys = await clientPermissionKeys(user);
    return keys.includes('*') || keys.includes(permissionKey);
}

/* --------------------------------------------------------------- helpers */

export async function creditBalance(clientId) {
    if (!clientId) return 0;
    try {
        const row = await prisma.creditLedger.findFirst({
            where: { client_id: BigInt(clientId) },
            orderBy: { id: 'desc' },
            select: { balance_after: true },
        });
        return Number(row?.balance_after ?? 0);
    } catch {
        return 0;
    }
}

export async function accessibleTenants(user) {
    if (!user) return [];
    try {
        const [owned, memberships] = await Promise.all([
            prisma.tenant.findMany({ where: { owner_id: user.id } }),
            prisma.tenantUser.findMany({ where: { user_id: user.id }, include: { tenants: true } }),
        ]);

        const byId = new Map();
        for (const t of owned) byId.set(String(t.id), t);
        for (const m of memberships) if (m.tenants) byId.set(String(m.tenants.id), m.tenants);

        return [...byId.values()];
    } catch {
        return [];
    }
}

export async function tenantAccessibleBy(tenant, user) {
    if (!tenant || !user) return false;
    if (String(tenant.owner_id) === String(user.id)) return true;

    try {
        const membership = await prisma.tenantUser.findFirst({
            where: { tenant_id: tenant.id, user_id: user.id },
            select: { id: true },
        });
        return !!membership;
    } catch (e) {
        console.error('[auth] tenant access lookup failed:', e?.message || e);
        return false;
    }
}

export const effectiveSubscription = cache(async function effectiveSubscription(user) {
    if (!user) return null;

    try {
        const [clientSubscription, subscription] = await Promise.all([
            user.client_id
                ? prisma.clientSubscription.findFirst({
                where: { client_id: user.client_id, status: 'active' },
                orderBy: { id: 'desc' },
                include: { plans: true },
            })
                : Promise.resolve(null),
            prisma.subscription.findFirst({
                where: { user_id: user.id, status: { in: ['active', 'trialing'] } },
                orderBy: { id: 'desc' },
                include: { plans: true },
            }),
        ]);

        if (
            clientSubscription
            && subscriptionIsActive(clientSubscription)
            && Number(clientSubscription.plans?.monthly_price_cents ?? clientSubscription.plans?.price_cents ?? 0) > 0
        ) {
            return { ...clientSubscription, __kind: 'client' };
        }
        if (subscription) return { ...subscription, __kind: 'user' };
        if (clientSubscription && subscriptionIsActive(clientSubscription)) {
            return { ...clientSubscription, __kind: 'client' };
        }
    } catch (e) {
        console.error('[auth] subscription lookup failed:', e?.message || e);
    }

    return null;
});

export function subscriptionIsActive(sub) {
    if (!sub) return false;
    if (!['active', 'trialing'].includes(sub.status)) return false;
    if (sub.ends_at && new Date(sub.ends_at) < new Date()) return false;
    return true;
}
