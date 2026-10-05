const DEFAULT_ADMIN_EMAIL = 'admin@example.invalid';
const DEFAULT_ADMIN_PASSWORD = 'Local-Demo-Admin-2026!';
const DEFAULT_CLIENT_EMAIL = 'client@example.invalid';
const DEFAULT_CLIENT_PASSWORD = 'Local-Demo-Client-2026!';

const LOCAL_ENVIRONMENTS = new Set(['local', 'development', 'dev', 'test']);
const FORBIDDEN_PASSWORDS = new Set([
    '12345678', 'password', 'password123', 'admin123', 'changeme', 'callmindai', 'callmineai',
]);

const enabled = (value) => ['1', 'true', 'yes', 'on'].includes(String(value ?? '').toLowerCase());
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function assertEmail(name, value, forbidden = []) {
    if (!validEmail(value)) throw new Error(`${name} must contain a valid email address.`);
    if (forbidden.includes(value.toLowerCase())) {
        throw new Error(`${name} uses a bundled demo address and is forbidden outside local development.`);
    }
}

function assertStrongPassword(name, password, email) {
    const normalized = String(password ?? '');
    const emailLocalPart = String(email).split('@')[0].toLowerCase();
    const failures = [];
    if (normalized.length < 16) failures.push('at least 16 characters');
    if (!/[a-z]/.test(normalized)) failures.push('a lowercase letter');
    if (!/[A-Z]/.test(normalized)) failures.push('an uppercase letter');
    if (!/[0-9]/.test(normalized)) failures.push('a number');
    if (!/[^A-Za-z0-9]/.test(normalized)) failures.push('a symbol');
    if (FORBIDDEN_PASSWORDS.has(normalized.toLowerCase())) failures.push('a non-default password');
    if (emailLocalPart.length >= 4 && normalized.toLowerCase().includes(emailLocalPart)) {
        failures.push('a password that does not contain the email name');
    }
    if (failures.length) {
        throw new Error(`${name} is unsafe; required: ${[...new Set(failures)].join(', ')}.`);
    }
}

// Runs before the seed's first database write.
export function seedConfiguration(env = process.env) {
    const appEnvironment = String(env.APP_ENV || env.NODE_ENV || 'production').toLowerCase();
    const isLocal = LOCAL_ENVIRONMENTS.has(appEnvironment) && env.NODE_ENV !== 'production';
    const demoMode = enabled(env.APP_DEMO_MODE);

    if (!isLocal && demoMode) throw new Error('APP_DEMO_MODE must be false outside local development.');

    const adminEmail = String(env.ADMIN_SEED_EMAIL || (isLocal ? DEFAULT_ADMIN_EMAIL : '')).trim().toLowerCase();
    const adminPassword = String(env.ADMIN_SEED_PASSWORD || (isLocal ? DEFAULT_ADMIN_PASSWORD : ''));
    const adminName = String(env.ADMIN_SEED_NAME || 'Super Admin').trim();

    if (!adminEmail || !adminPassword) {
        throw new Error('ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are required outside local development.');
    }
    if (!adminName) throw new Error('ADMIN_SEED_NAME cannot be empty.');
    if (!isLocal) {
        assertEmail('ADMIN_SEED_EMAIL', adminEmail, [DEFAULT_ADMIN_EMAIL, DEFAULT_CLIENT_EMAIL]);
        assertStrongPassword('ADMIN_SEED_PASSWORD', adminPassword, adminEmail);
    } else {
        assertEmail('ADMIN_SEED_EMAIL', adminEmail);
    }

    const seedDemoClient = isLocal && demoMode;
    let client = null;
    if (seedDemoClient) {
        const email = String(env.CLIENT_SEED_EMAIL || DEFAULT_CLIENT_EMAIL).trim().toLowerCase();
        const password = String(env.CLIENT_SEED_PASSWORD || DEFAULT_CLIENT_PASSWORD);
        const name = String(env.CLIENT_SEED_NAME || 'Customer User').trim();
        assertEmail('CLIENT_SEED_EMAIL', email);
        if (!name) throw new Error('CLIENT_SEED_NAME cannot be empty.');
        client = { email, password, name };
    }

    return {
        appEnvironment, isLocal, demoMode, seedDemoClient,
        admin: { email: adminEmail, password: adminPassword, name: adminName },
        client,
    };
}
