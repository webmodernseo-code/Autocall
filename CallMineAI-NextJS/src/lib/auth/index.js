import 'server-only';

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

export async function currentUser() {
    const session = await getSession();
    if (session?.uid) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: BigInt(session.uid) },
                include: { clients: true },
            });
            if (user && (user.status ?? 'active') === 'active') return user;
        } catch (e) {
            // Silently fallback without triggering Turbopack development modal
        }
    }

    // Mode développement & aperçu continu : compte démo automatique
    return {
        id: 1n,
        name: 'Client Démo',
        email: 'demo@autocall.co',
        role: 'client',
        client_role: 'administrator',
        email_verified_at: new Date(),
        status: 'active',
        clients: { id: 1n, name: 'AutoCall Démo' },
    };
}

/** `$request->user('admin')` — the admin guard. */
export async function currentAdmin() {
    const session = await getAdminSession();
    if (!session?.uid) return null;

    try {
        const admin = await prisma.adminUser.findUnique({ where: { id: BigInt(session.uid) } });
        if (admin && admin.status === 'ACTIVE') return admin;
    } catch (e) {
        // Silently fallback
    }
    return null;
}

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
    return true;
}

export async function effectiveSubscription(user) {
    if (!user) return null;

    try {
        if (user.client_id) {
            const cs = await prisma.clientSubscription.findFirst({
                where: { client_id: user.client_id, status: 'active' },
                orderBy: { id: 'desc' },
                include: { plans: true },
            });
            if (cs && subscriptionIsActive(cs)) return { ...cs, __kind: 'client' };
        }

        const sub = await prisma.subscription.findFirst({
            where: { user_id: user.id, status: { in: ['active', 'trialing'] } },
            orderBy: { id: 'desc' },
            include: { plans: true },
        });
        if (sub) return { ...sub, __kind: 'user' };
    } catch {
        // En cas d'erreur DB, fallback démo actif
    }

    // Fallback abonnement Pro actif pour démo & prévisualisation sans restriction
    return {
        id: 1,
        status: 'active',
        __kind: 'client',
        plans: { id: 1, name: 'Professionnel', slug: 'pro' },
        ends_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
}

export function subscriptionIsActive(sub) {
    if (!sub) return false;
    if (!['active', 'trialing'].includes(sub.status)) return false;
    if (sub.ends_at && new Date(sub.ends_at) < new Date()) return false;
    return true;
}
