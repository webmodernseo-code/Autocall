/**
 * Port of database/seeders/DatabaseSeeder.php and the seeders it runs:
 * PermissionSeeder, RoleSeeder, ClientPermissionSeeder (ClientRbac::seedCatalog),
 * CurrencySeeder, LocaleSeeder, PlanSeeder, EmailTemplateSeeder,
 * AdminUserSeeder, UserSeeder.
 *
 * Keys and values are taken verbatim from those seeders — the admin panel and
 * the guards check these exact permission/role keys.
 *
 * Safe to re-run: every write is a firstOrCreate/updateOrCreate equivalent.
 *
 *   npm run db:seed
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { ensureAppKey } from '../scripts/generate-key.mjs';
import { CLIENT_ROLE_NAMES, rbacCatalog, roleTemplate } from '../src/lib/rbac-catalog.mjs';
import { seedConfiguration } from './seed-policy.mjs';

// `npm run db:seed` executes Node directly, outside the Prisma CLI. Load local
// environment files without ever overriding variables injected by CI/hosting.
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
const seedConfig = seedConfiguration();

const now = () => new Date();
const hash = (plain) => bcrypt.hash(plain, 12);

const ADMIN_EMAIL = seedConfig.admin.email;
const ADMIN_NAME = seedConfig.admin.name;
const ADMIN_PASSWORD = seedConfig.admin.password;

/* --------------------------------------------------------- PermissionSeeder */

const PERMISSIONS = [
    // Admin Management
    ['view_admins', 'View Admins', 'Admin Management', 'View admin users list and details'],
    ['create_admins', 'Create Admins', 'Admin Management', 'Create new admin users'],
    ['update_admins', 'Update Admins', 'Admin Management', 'Edit admin users'],
    ['delete_admins', 'Delete Admins', 'Admin Management', 'Delete admin users'],
    ['view_admin_roles', 'View Admin Roles', 'Admin Management', 'View roles and permissions'],
    ['manage_admin_roles', 'Manage Admin Roles', 'Admin Management', 'Create, update, delete roles and permissions'],
    // Clients
    ['view_clients', 'View Clients', 'Clients', 'View clients list and details'],
    ['create_clients', 'Create Clients', 'Clients', 'Create clients'],
    ['update_clients', 'Update Clients', 'Clients', 'Edit clients'],
    ['delete_clients', 'Delete Clients', 'Clients', 'Delete clients'],
    // Subscriptions
    ['view_subscriptions', 'View Subscriptions', 'Subscriptions', 'View subscriptions'],
    ['manage_subscriptions', 'Manage Subscriptions', 'Subscriptions', 'Manage subscriptions'],
    // Plans
    ['view_plans', 'View Plans', 'Plans', 'View plans'],
    ['create_plans', 'Create Plans', 'Plans', 'Create plans'],
    ['update_plans', 'Update Plans', 'Plans', 'Edit plans'],
    ['delete_plans', 'Delete Plans', 'Plans', 'Delete plans'],
    // Payment Gateways
    ['view_payment_gateways', 'View Payment Gateways', 'Payment Gateways', 'View payment gateways'],
    ['manage_payment_gateways', 'Manage Payment Gateways', 'Payment Gateways', 'Manage payment gateways'],
    // Email
    ['view_email_settings', 'View Email Settings', 'Email', 'View email settings'],
    ['manage_email_settings', 'Manage Email Settings', 'Email', 'Manage email settings'],
    // Currencies
    ['view_currencies', 'View Currencies', 'Currencies', 'View currencies'],
    ['manage_currencies', 'Manage Currencies', 'Currencies', 'Manage currencies'],
    // Languages
    ['view_languages', 'View Languages', 'Languages', 'View languages/locales'],
    ['manage_languages', 'Manage Languages', 'Languages', 'Manage languages/locales'],
    // Website/Landing Pages
    ['view_website_pages', 'View Website Pages', 'Website/Landing Pages', 'View website/landing pages'],
    ['manage_website_pages', 'Manage Website Pages', 'Website/Landing Pages', 'Manage website/landing pages'],
    // Settings
    ['view_settings', 'View Settings', 'Settings', 'View system settings'],
    ['manage_settings', 'Manage Settings', 'Settings', 'Manage system settings'],
];

/* ------------------------------------------------------------- RoleSeeder */

const ROLES = [
    ['SUPER_ADMIN', 'Super Admin', 'Full system access', true],
    ['ADMIN', 'Admin', 'Administrative access', false],
    ['SUPPORT', 'Support', 'View clients and subscriptions only', false],
];

/* ----------------------------------- ClientRbac::MODULES (client permissions) */


/* -------------------------------------------------------- CurrencySeeder */

const CURRENCIES = [
    { code: 'EUR', symbol: '€', decimals: 2, exchange_rate: 1, is_default: true },
    { code: 'USD', symbol: '$', decimals: 2, exchange_rate: 0.9259, is_default: false },
    { code: 'XOF', symbol: 'F CFA', decimals: 0, exchange_rate: 0.00152449, is_default: false },
];

/* ---------------------------------------------------------- LocaleSeeder */

const LOCALES = [
    { code: 'fr', name: 'French', native_name: 'Français', flag: null, is_default: true, is_rtl: false, sort_order: 1 },
    { code: 'en', name: 'English', native_name: 'English', flag: null, is_default: false, is_rtl: false, sort_order: 2 },
];

/* ------------------------------------------------------------ PlanSeeder */

const PLANS = [
    {
        name: 'Découverte', slug: 'free', description: 'Testez la voix IA en direct sans carte bancaire.',
        currency_code: 'EUR', price_cents: 0, interval: 'month',
        monthly_price_cents: 0, yearly_price_cents: 0, ai_credits: 10, websites_limit: 1,
        export_enabled: false, custom_domain_enabled: false, white_label_enabled: false,
        agents_limit: 1, campaigns_limit: 0, contacts_limit: 10, numbers_limit: 0, kb_mb_limit: 10,
        monthly_bonus_credits: 0, priority_support: false, messaging_enabled: false, whatsapp_enabled: false,
        api_enabled: false, team_seats_limit: 1, custom_roles_enabled: false,
        sip_enabled: false, featured: false, popular: false, sort_order: 1, enabled: true,
    },
    {
        name: 'Starter', slug: 'starter', description: 'Idéal pour indépendants, artisans et praticiens solos.',
        currency_code: 'EUR', price_cents: 3900, interval: 'month',
        monthly_price_cents: 3900, yearly_price_cents: 38400, ai_credits: 80, websites_limit: 1,
        export_enabled: true, custom_domain_enabled: false, white_label_enabled: false,
        agents_limit: 1, campaigns_limit: 0, contacts_limit: 500, numbers_limit: 1,
        kb_mb_limit: 50, monthly_bonus_credits: 80, priority_support: false,
        messaging_enabled: true, whatsapp_enabled: false,
        monthly_email_limit: 1000, monthly_whatsapp_limit: 0,
        api_enabled: false, api_keys_limit: 0, team_seats_limit: 1, custom_roles_enabled: false,
        sip_enabled: false, sort_order: 2, enabled: true,
    },
    {
        name: 'Pro', slug: 'pro', description: 'Pour cabinets, PME, commerces et agences.',
        currency_code: 'EUR', price_cents: 8900, interval: 'month',
        monthly_price_cents: 8900, yearly_price_cents: 88800, ai_credits: 250, websites_limit: 10,
        export_enabled: true, custom_domain_enabled: true, white_label_enabled: false,
        agents_limit: 3, campaigns_limit: 20, contacts_limit: 10000, numbers_limit: 2,
        kb_mb_limit: 100, monthly_bonus_credits: 250, priority_support: true,
        messaging_enabled: true, whatsapp_enabled: true,
        monthly_email_limit: 5000, monthly_whatsapp_limit: 2000,
        api_enabled: true, api_keys_limit: 5, api_rate_limit_per_min: 100,
        team_seats_limit: 10, custom_roles_enabled: true,
        sip_enabled: true, sip_trunks_limit: 3, sip_numbers_limit: 20, sip_concurrency_limit: 10,
        featured: true, popular: true, sort_order: 3, enabled: true,
    },
    {
        name: 'Agency / Scale', slug: 'agency', description: 'Pour agences, réseaux d’entreprises et centres d’appels.',
        currency_code: 'EUR', price_cents: 19900, interval: 'month',
        monthly_price_cents: 19900, yearly_price_cents: 199200, ai_credits: 750, websites_limit: 100,
        export_enabled: true, custom_domain_enabled: true, white_label_enabled: true,
        agents_limit: 99999, campaigns_limit: 99999, contacts_limit: 999999, numbers_limit: 20,
        kb_mb_limit: 500, monthly_bonus_credits: 750, priority_support: true,
        messaging_enabled: true, whatsapp_enabled: true,
        monthly_email_limit: 50000, monthly_whatsapp_limit: 20000,
        api_enabled: true, api_keys_limit: 20, api_rate_limit_per_min: 300,
        team_seats_limit: 50, custom_roles_enabled: true,
        sip_enabled: true, sip_trunks_limit: 20, sip_numbers_limit: 200, sip_concurrency_limit: 50,
        sort_order: 4, enabled: true,
    },
];

/* --------------------------------------------------- EmailTemplateSeeder */

const TEMPLATES = [
    {
        name: 'Payment Failed', slug: 'payment_failed',
        subject: 'Payment Failed - {{app_name}}',
        content:
            '<p>Hello,</p><p>Your payment could not be processed.</p>' +
            '<p>Please update your payment method or contact support.</p><p>— {{app_name}}</p>',
    },
    {
        name: 'Payment Success', slug: 'payment_success',
        subject: 'Payment Successful - {{app_name}}',
        content:
            '<p>Hello,</p><p>Your payment was successful. Thank you for your subscription.</p>' +
            '<p>— {{app_name}}</p>',
    },
    {
        name: 'Subscription Confirmation', slug: 'subscription_confirmation',
        subject: 'Subscription Confirmed - {{plan_name}}',
        content:
            '<p>Hello,</p><p>Your subscription to {{plan_name}} has been confirmed.</p><p>— {{app_name}}</p>',
    },
    {
        name: 'Password Reset', slug: 'reset_password',
        subject: 'Reset your {{app_name}} password',
        content:
            '<p>Hello,</p><p>You requested a password reset. Click the link below to reset your password:</p>' +
            '<p><a href="{{reset_url}}">{{reset_url}}</a></p>' +
            '<p>If you did not request this, please ignore this email.</p><p>— {{app_name}}</p>',
    },
    {
        name: 'Email Verification', slug: 'email_verification',
        subject: 'Verify your {{app_name}} account',
        content:
            '<p>Hello,</p><p>Please verify your email address by clicking the link below:</p>' +
            '<p><a href="{{verification_url}}">{{verification_url}}</a></p><p>— {{app_name}}</p>',
    },
];

/* ------------------------------------------------------------------ seeds */

async function seedCurrencies() {
    const supportedCodes = CURRENCIES.map((currency) => currency.code);
    await prisma.currency.updateMany({
        where: { code: { notIn: supportedCodes } },
        data: { enabled: false, is_default: false, updated_at: now() },
    });
    for (const c of CURRENCIES) {
        await prisma.currency.upsert({
            where: { code: c.code },
            create: { ...c, enabled: true, created_at: now(), updated_at: now() },
            update: {
                symbol: c.symbol,
                decimals: c.decimals,
                exchange_rate: c.exchange_rate,
                is_default: c.is_default,
                enabled: true,
                updated_at: now(),
            },
        });
    }
    console.log(`  currencies: ${CURRENCIES.length}`);
}

async function seedLocales() {
    const supportedCodes = LOCALES.map((locale) => locale.code);
    await prisma.locale.updateMany({
        where: { code: { notIn: supportedCodes } },
        data: { enabled: false, is_default: false, updated_at: now() },
    });
    for (const l of LOCALES) {
        await prisma.locale.upsert({
            where: { code: l.code },
            create: { ...l, enabled: true, created_at: now(), updated_at: now() },
            update: {
                name: l.name,
                native_name: l.native_name,
                is_rtl: l.is_rtl,
                is_default: l.is_default,
                sort_order: l.sort_order,
                enabled: true,
                updated_at: now(),
            },
        });
    }
    console.log(`  locales: ${LOCALES.length}`);
}

async function seedPlans() {
    for (const p of PLANS) {
        // price_cents is an unsigned BIGINT — Prisma wants a BigInt, not a Number.
        const data = { ...p, price_cents: BigInt(p.price_cents) };
        const existing = await prisma.plan.findUnique({ where: { slug: p.slug } });

        if (existing) {
            await prisma.plan.update({ where: { id: existing.id }, data: { ...data, updated_at: now() } });
        } else {
            await prisma.plan.create({ data: { ...data, created_at: now(), updated_at: now() } });
        }
    }
    console.log(`  plans: ${PLANS.length}`);
}

async function seedPermissions() {
    for (const [key, name, category, description] of PERMISSIONS) {
        const existing = await prisma.permission.findUnique({ where: { key } });
        if (!existing) {
            await prisma.permission.create({
                data: { key, name, category, description, created_at: now(), updated_at: now() },
            });
        }
    }
    console.log(`  admin permissions: ${PERMISSIONS.length}`);
}

async function seedRoles() {
    let superAdmin = null;

    for (const [key, name, description, is_system] of ROLES) {
        let role = await prisma.role.findUnique({ where: { key } });
        if (!role) {
            role = await prisma.role.create({
                data: { key, name, description, is_system, created_at: now(), updated_at: now() },
            });
        }
        if (key === 'SUPER_ADMIN') superAdmin = role;
    }

    // Super Admin holds every permission (RoleSeeder syncs the full set).
    const all = await prisma.permission.findMany({ select: { id: true } });
    await prisma.rolePermission.createMany({
        data: all.map((p) => ({ role_id: superAdmin.id, permission_id: p.id })),
        skipDuplicates: true,
    });

    console.log(`  admin roles: ${ROLES.length} (SUPER_ADMIN has ${all.length} permissions)`);
    return superAdmin;
}

async function seedClientPermissions() {
    const catalog = rbacCatalog();

    for (const perm of catalog) {
        const existing = await prisma.clientPermission.findUnique({ where: { key: perm.key } });
        if (existing) {
            await prisma.clientPermission.update({
                where: { id: existing.id },
                data: { ...perm, updated_at: now() },
            });
        } else {
            await prisma.clientPermission.create({
                data: { ...perm, created_at: now(), updated_at: now() },
            });
        }
    }

    console.log(`  client permissions: ${catalog.length}`);
}

/** ClientRbac::ensureSystemRoles() — the four system roles for one customer. */
async function ensureClientSystemRoles(clientId) {
    for (const [key, name] of Object.entries(CLIENT_ROLE_NAMES)) {
        let role = await prisma.clientRole.findFirst({ where: { client_id: clientId, key } });
        if (!role) {
            role = await prisma.clientRole.create({
                data: {
                    client_id: clientId, key, name, is_system: true,
                    created_at: now(), updated_at: now(),
                },
            });
        }

        const keys = roleTemplate(key);
        const perms = await prisma.clientPermission.findMany({
            where: { key: { in: keys } },
            select: { id: true },
        });

        await prisma.clientRolePermission.deleteMany({ where: { client_role_id: role.id } });
        if (perms.length) {
            await prisma.clientRolePermission.createMany({
                data: perms.map((p) => ({ client_role_id: role.id, client_permission_id: p.id })),
                skipDuplicates: true,
            });
        }
    }
}

async function seedAdmin(superAdminRole) {
    let admin = await prisma.adminUser.findUnique({ where: { email: ADMIN_EMAIL } });

    if (!admin) {
        admin = await prisma.adminUser.create({
            data: {
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: await hash(ADMIN_PASSWORD),
                status: 'ACTIVE',
                created_at: now(),
                updated_at: now(),
            },
        });
    }

    await prisma.adminRole.createMany({
        data: [{ admin_user_id: admin.id, role_id: superAdminRole.id }],
        skipDuplicates: true,
    });

    console.log(`  admin user: ${ADMIN_EMAIL}`);
}

async function seedClient() {
    if (!seedConfig.seedDemoClient) {
        console.log('  demo client: skipped (disabled or protected environment)');
        return;
    }
    const { email: clientEmail, name: clientName, password: clientPassword } = seedConfig.client;
    let client = await prisma.client.findFirst({ where: { email: clientEmail } });
    if (!client) {
        client = await prisma.client.create({
            data: {
                name: 'Demo Workspace',
                email: clientEmail,
                status: 'active',
                kyc_status: 'verified',
                base_currency: 'EUR',
                currency_symbol: '€',
                currency_position: 'after',
                created_at: now(),
                updated_at: now(),
            },
        });
    }

    await ensureClientSystemRoles(client.id);

    const existing = await prisma.user.findUnique({ where: { email: clientEmail } });
    if (!existing) {
        await prisma.user.create({
            data: {
                name: clientName,
                email: clientEmail,
                password: await hash(clientPassword),
                role: 'client',
                client_id: client.id,
                client_role: 'administrator',
                status: 'active',
                // The /app/* portal requires a verified email.
                email_verified_at: now(),
                locale: 'fr',
                display_currency: 'EUR',
                theme: 'light',
                created_at: now(),
                updated_at: now(),
            },
        });
    }

    // Starting credit balance so the demo workspace can place calls.
    const ledger = await prisma.creditLedger.findFirst({ where: { client_id: client.id } });
    if (!ledger) {
        await prisma.creditLedger.create({
            data: {
                client_id: client.id,
                delta: 1000,
                balance_after: 1000,
                reason: 'plan_grant',
                note: 'Seed credits',
                created_at: now(),
                updated_at: now(),
            },
        });
    }

    // Active subscription so the demo workspace is unlocked and functional.
    const sub = await prisma.clientSubscription.findFirst({ where: { client_id: client.id } });
    if (!sub) {
        const proPlan = await prisma.plan.findFirst({ where: { slug: 'pro' } });
        if (proPlan) {
            const endsAt = new Date();
            endsAt.setFullYear(endsAt.getFullYear() + 1);
            await prisma.clientSubscription.create({
                data: {
                    client_id: client.id,
                    plan_id: proPlan.id,
                    billing_cycle: 'monthly',
                    starts_at: now(),
                    ends_at: endsAt,
                    status: 'active',
                    created_at: now(),
                    updated_at: now(),
                },
            });
        }
    }

    console.log(`  demo client user: ${clientEmail}`);
}

async function seedTemplates() {
    for (const t of TEMPLATES) {
        const existing = await prisma.template.findUnique({ where: { slug: t.slug } });
        if (!existing) {
            await prisma.template.create({
                data: { ...t, type: 'email', enabled: true, created_at: now(), updated_at: now() },
            });
        }
    }
    console.log(`  email templates: ${TEMPLATES.length}`);
}

async function seedGeneralSettings() {
    const existing = await prisma.generalSetting.findFirst();
    if (!existing) {
        await prisma.generalSetting.create({
            data: {
                system_title: process.env.APP_NAME || 'AutoCall',
                company_name: '',
                primary_color: '#6d3fea',
                timezone: 'Europe/Paris',
                default_locale: 'fr',
                default_currency: 'EUR',
                created_at: now(),
                updated_at: now(),
            },
        });
    }
    console.log('  general settings: ok');
}

async function main() {
    console.log('Seeding AutoCall…');
    // APP_KEY encrypts stored provider credentials — a fresh install must have
    // one before the admin panel can save anything.
    ensureAppKey({ quiet: false });
    await seedCurrencies();
    await seedLocales();
    await seedPlans();
    await seedPermissions();
    const superAdmin = await seedRoles();
    await seedClientPermissions();
    await seedAdmin(superAdmin);
    await seedClient();
    await seedTemplates();
    await seedGeneralSettings();
    console.log('Done.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
