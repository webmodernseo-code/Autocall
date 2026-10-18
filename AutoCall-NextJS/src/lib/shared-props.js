import 'server-only';

import { headers } from 'next/headers';
import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';
import config from '@/lib/config';
import { plain } from '@/lib/serialize';
import { takeFlash } from '@/lib/flash';
import { assetUrl, brandingPayload, DEFAULT_BRANDING, socialLoginPayload } from '@/lib/settings';
import { localesForSwitcher, translationsFor } from '@/lib/i18n-server';
import {
    accessibleTenants,
    clientPermissionKeys,
    creditBalance,
    currentAdmin,
    currentUser,
    adminPermissionKeys,
    tenantAccessibleBy,
} from '@/lib/auth';
import { getSession } from '@/lib/auth/session';
import { detectRegionalPreferences } from '@/lib/regional-preferences.mjs';

const cachedLocalesForSwitcher = unstable_cache(
    localesForSwitcher,
    ['shared-locales'],
    { revalidate: 60 },
);
const cachedBrandingPayload = unstable_cache(
    brandingPayload,
    ['shared-branding'],
    { revalidate: 60 },
);
const cachedSocialLoginPayload = unstable_cache(
    socialLoginPayload,
    ['shared-social-login'],
    { revalidate: 60 },
);
const cachedDefaultCurrencyCode = unstable_cache(
    defaultCurrencyCode,
    ['shared-default-currency'],
    { revalidate: 60 },
);

/**
 * Port of .
 *
 * Every page passes the result to <PageProvider shared={...}> so `usePage().props`
 * carries exactly the keys the ported components already read.
 */
export async function sharedProps({ isAdminRoute = false } = {}) {
    try {
        return await buildShared({ isAdminRoute });
    } catch (e) {
        return fallbackShared();
    }
}

async function buildShared({ isAdminRoute }) {
    const [session, user, adminUser, requestHeaders] = await Promise.all([
        getSession(),
        currentUser(),
        isAdminRoute ? currentAdmin() : Promise.resolve(null),
        headers(),
    ]);

    const detected = detectRegionalPreferences(requestHeaders);
    const locale = user?.locale || session?.locale || detected.locale || config.app.locale;

    const customer = user?.clients ?? null;

    const [
        i18nLocales,
        branding,
        socialLogin,
        translations,
        currencies,
        defaultCurrency,
        clientPerms,
        adminPerms,
        credits,
        notificationsUnread,
        tenantBits,
        flash,
        impersonation,
    ] = await Promise.all([
        cachedLocalesForSwitcher(),
        cachedBrandingPayload(),
        cachedSocialLoginPayload(),
        translationsFor(locale),
        enabledCurrencies(),
        cachedDefaultCurrencyCode(),
        user ? clientPermissionKeys(user) : Promise.resolve([]),
        isAdminRoute && adminUser ? adminPermissionKeys(adminUser.id) : Promise.resolve([]),
        user?.client_id ? creditBalance(user.client_id) : Promise.resolve(null),
        unreadNotifications(user),
        resolveTenants(user, session),
        takeFlash(),
        resolveImpersonation(session),
    ]);

    const rtlCodes = i18nLocales.filter((l) => l.is_rtl).map((l) => l.code);
    const rtl = rtlCodes.length ? rtlCodes : config.locales.rtl;
    const isRtl = rtl.includes(locale);

    const displayCurrency =
        user?.display_currency ??
        tenantBits.currentTenantCurrency ??
        session?.display_currency ??
        detected.currency ??
        defaultCurrency ??
        'EUR';

    const supportedLocales = Object.fromEntries(i18nLocales.map((l) => [l.code, l.native_name]));

    const auth = {
        user: user
            ? plain({
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  status: user.status,
                  client_id: user.client_id,
                  client_role: user.client_role,
                  tenant_id: user.tenant_id,
                  locale: user.locale,
                  display_currency: user.display_currency,
                  theme: user.theme,
                  email_verified_at: user.email_verified_at,
                  notifications_read_at: user.notifications_read_at,
                  created_at: user.created_at,
              })
            : null,
        customer: customer
            ? {
                  id: Number(customer.id),
                  name: customer.name,
                  email: customer.email,
                  status: customer.status,
                  kyc_status: customer.kyc_status,
                  kyc_verified: customer.kyc_status === 'verified',
                  avatar_url: customer.avatar_path ? assetUrl(customer.avatar_path) : null,
              }
            : null,
        adminUser:
            isAdminRoute && adminUser
                ? {
                      id: Number(adminUser.id),
                      name: adminUser.name,
                      email: adminUser.email,
                      status: adminUser.status,
                  }
                : null,
        permissions: adminPerms,
        clientPermissions: clientPerms,
    };

    return {
        flash: { success: flash.success ?? null, error: flash.error ?? null, openEditPlanId: flash.openEditPlanId ?? null },
        errors: {},
        auth,
        impersonation,
        theme: user?.theme ?? session?.theme ?? 'light',
        currentTenant: tenantBits.currentTenant,
        tenants: tenantBits.tenants,
        locale,
        dir: isRtl ? 'rtl' : 'ltr',
        i18n: { locale, isRtl, locales: i18nLocales, translations },
        supportedLocales: Object.keys(supportedLocales).length ? supportedLocales : { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch' },
        rtlLocales: rtl,
        currencies,
        displayCurrency,
        demo_mode: config.app.demo_mode,
        demo_credentials: config.app.demo_mode
            ? {
                  client: { email: config.seed.client_email, password: config.seed.client_password },
                  admin: { email: config.seed.admin_email, password: config.seed.admin_password },
              }
            : null,
        credits,
        notificationsUnread,
        marketing: {
            appStoreUrl: config.frontend.app_store_url,
            googlePlayUrl: config.frontend.google_play_url,
        },
        branding,
        socialLogin,
    };
}

/* -------------------------------------------------------------- fragments */

async function enabledCurrencies() {
    // Exact 3 devises requises : Euro, Dollar et FCFA
    return [
        { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, exchange_rate: 1 },
        { code: 'USD', name: 'Dollar US', symbol: '$', decimals: 2, exchange_rate: 1.08 },
        { code: 'FCFA', name: 'Franc CFA', symbol: 'FCFA', decimals: 0, exchange_rate: 655.957 },
    ];
}

async function defaultCurrencyCode() {
    try {
        const row = await prisma.currency.findFirst({ where: { is_default: true, enabled: true } });
        return row?.code ?? null;
    } catch {
        return null;
    }
}

async function unreadNotifications(user) {
    if (!user?.client_id) return 0;
    try {
        return await prisma.notification.count({
            where: {
                OR: [{ client_id: user.client_id }, { client_id: null }],
                ...(user.notifications_read_at ? { created_at: { gt: user.notifications_read_at } } : {}),
            },
        });
    } catch {
        return 0;
    }
}

async function resolveTenants(user, session) {
    if (!user) return { currentTenant: null, tenants: [], currentTenantCurrency: null };

    let currentTenant = null;
    let currentTenantCurrency = null;

    const tenantId = session?.current_tenant_id ?? user.tenant_id;
    if (tenantId) {
        try {
            const tenant = await prisma.tenant.findUnique({ where: { id: BigInt(tenantId) } });
            if (tenant && (await tenantAccessibleBy(tenant, user))) {
                currentTenant = { id: Number(tenant.id), name: tenant.name };
                currentTenantCurrency = tenant.currency_code ?? null;
            }
        } catch {
            currentTenant = null;
        }
    }

    let tenants = [];
    try {
        tenants = (await accessibleTenants(user)).map((t) => ({ id: Number(t.id), name: t.name }));
    } catch {
        tenants = [];
    }

    return { currentTenant, tenants, currentTenantCurrency };
}

async function resolveImpersonation(session) {
    if (!session?.impersonating || !session?.impersonated_client_id) return null;
    let client = null;
    try {
        client = await prisma.client.findUnique({
            where: { id: BigInt(session.impersonated_client_id) },
            select: { name: true },
        });
    } catch {
        client = null;
    }
    return {
        active: true,
        clientName: client?.name ?? 'Unknown',
        returnUrl: '/admin/impersonation/stop',
    };
}

/** Mirrors the try/catch fallback payload in . */
function fallbackShared() {
    const locale = config.app.locale;
    return {
        flash: { success: null, error: null },
        errors: {},
        auth: { user: null, customer: null, adminUser: null, permissions: [], clientPermissions: [] },
        impersonation: null,
        currentTenant: null,
        tenants: [],
        locale,
        dir: 'ltr',
        i18n: { locale, isRtl: config.locales.rtl.includes(locale), locales: [], translations: {} },
        supportedLocales: { en: 'English' },
        rtlLocales: ['ar'],
        currencies: [],
        displayCurrency: 'USD',
        theme: 'light',
        demo_mode: false,
        demo_credentials: null,
        credits: null,
        notificationsUnread: 0,
        marketing: { appStoreUrl: null, googlePlayUrl: null },
        branding: DEFAULT_BRANDING,
        socialLogin: { enabled: false, google: false, firebase: {} },
    };
}
