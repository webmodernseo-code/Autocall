import 'server-only';

import prisma from '@/lib/prisma';
import { ensureSystemRoles } from '@/lib/services/client-rbac';

/**
 * Ensures that a client user has an associated Client workspace.
 * If missing, creates a default workspace, initializes system roles,
 * gives starter credits, and links it to the user.
 */
export async function ensureClientWorkspace(user) {
    if (!user) return null;
    if (user.client_id) return user.client_id;

    // Check if an existing Client is registered under the same email
    let client = user.email ? await prisma.client.findFirst({ where: { email: user.email } }) : null;

    if (!client) {
        const workspaceName = user.name ? `${user.name}'s Workspace` : 'Mon Espace';
        client = await prisma.client.create({
            data: {
                name: workspaceName,
                email: user.email ?? null,
                status: 'active',
                kyc_status: 'pending',
                base_currency: user.display_currency || 'EUR',
                currency_symbol: user.display_currency === 'USD' ? '$' : '€',
                currency_position: user.display_currency === 'USD' ? 'before' : 'after',
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        // Initialize system roles
        try {
            await ensureSystemRoles(client.id);
        } catch (e) {
            console.error('[workspace] ensureSystemRoles error:', e?.message || e);
        }

        // Welcome credit grant
        try {
            const existingLedger = await prisma.creditLedger.findFirst({ where: { client_id: client.id } });
            if (!existingLedger) {
                await prisma.creditLedger.create({
                    data: {
                        client_id: client.id,
                        delta: 100,
                        balance_after: 100,
                        reason: 'plan_grant',
                        note: 'Welcome credits',
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
            }
        } catch (e) {
            console.error('[workspace] creditLedger error:', e?.message || e);
        }
    }

    // Link client to user
    await prisma.user.update({
        where: { id: user.id },
        data: {
            client_id: client.id,
            client_role: user.client_role || 'administrator',
            updated_at: new Date(),
        },
    });

    user.client_id = client.id;
    user.client_role = user.client_role || 'administrator';

    return client.id;
}
