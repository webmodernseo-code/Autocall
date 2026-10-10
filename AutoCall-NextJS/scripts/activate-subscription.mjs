import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

for (const file of ['.env.local', '.env']) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) continue;
    for (const line of fs.readFileSync(fullPath, 'utf8').split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!match || process.env[match[1]] !== undefined) continue;
        process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, '$2');
    }
}

const prisma = new PrismaClient();

async function main() {
    console.log('Activating subscription for all clients and users...');
    
    // Find or create Pro plan
    let proPlan = await prisma.plan.findFirst({ where: { slug: 'pro' } });
    if (!proPlan) {
        proPlan = await prisma.plan.findFirst();
    }
    if (!proPlan) {
        console.error('No plan found in database!');
        return;
    }
    console.log('Using Plan:', proPlan.name, '(ID:', proPlan.id.toString(), ')');

    const clients = await prisma.client.findMany();
    console.log(`Found ${clients.length} clients.`);

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    for (const client of clients) {
        // Upsert clientSubscription
        const existing = await prisma.clientSubscription.findFirst({
            where: { client_id: client.id }
        });

        if (existing) {
            await prisma.clientSubscription.update({
                where: { id: existing.id },
                data: {
                    plan_id: proPlan.id,
                    billing_cycle: 'monthly',
                    starts_at: new Date(),
                    ends_at: oneYearFromNow,
                    status: 'active',
                    updated_at: new Date(),
                }
            });
            console.log(`Updated client subscription for client ${client.id.toString()} (${client.name})`);
        } else {
            await prisma.clientSubscription.create({
                data: {
                    client_id: client.id,
                    plan_id: proPlan.id,
                    billing_cycle: 'monthly',
                    starts_at: new Date(),
                    ends_at: oneYearFromNow,
                    status: 'active',
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            });
            console.log(`Created active client subscription for client ${client.id.toString()} (${client.name})`);
        }
    }

    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users.`);
    for (const u of users) {
        const existingSub = await prisma.subscription.findFirst({
            where: { user_id: u.id }
        });
        if (existingSub) {
            await prisma.subscription.update({
                where: { id: existingSub.id },
                data: {
                    plan_id: proPlan.id,
                    status: 'active',
                    ends_at: oneYearFromNow,
                    updated_at: new Date(),
                }
            });
        } else {
            await prisma.subscription.create({
                data: {
                    user_id: u.id,
                    plan_id: proPlan.id,
                    status: 'active',
                    gateway: 'manual',
                    starts_at: new Date(),
                    ends_at: oneYearFromNow,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            });
        }
        console.log(`Updated/created user subscription for user ${u.id.toString()} (${u.email})`);
    }

    console.log('Done! All client and user subscriptions are now active.');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
