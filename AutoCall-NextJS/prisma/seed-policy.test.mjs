import assert from 'node:assert/strict';
import test from 'node:test';
import { seedConfiguration } from './seed-policy.mjs';

test('production rejects missing administrator credentials', () => {
    assert.throws(() => seedConfiguration({ APP_ENV: 'production', APP_DEMO_MODE: 'false' }), /required outside local development/);
});

test('production rejects bundled credentials', () => {
    assert.throws(() => seedConfiguration({ APP_ENV: 'production', ADMIN_SEED_EMAIL: 'admin@example.invalid', ADMIN_SEED_PASSWORD: 'Local-Demo-Admin-2026!' }), /bundled demo address/);
});

test('production rejects demo mode', () => {
    assert.throws(() => seedConfiguration({ APP_ENV: 'production', APP_DEMO_MODE: 'true', ADMIN_SEED_EMAIL: 'owner@example.com', ADMIN_SEED_PASSWORD: 'Correct-Horse-7-Battery!' }), /APP_DEMO_MODE must be false/);
});

test('production accepts strong explicit admin credentials and skips demo client', () => {
    const result = seedConfiguration({ APP_ENV: 'production', APP_DEMO_MODE: 'false', ADMIN_SEED_EMAIL: 'owner@example.com', ADMIN_SEED_PASSWORD: 'Correct-Horse-7-Battery!' });
    assert.equal(result.seedDemoClient, false);
    assert.equal(result.client, null);
    assert.equal(result.admin.email, 'owner@example.com');
});

test('staging is treated as a protected non-local environment', () => {
    assert.throws(() => seedConfiguration({ APP_ENV: 'staging' }), /required outside local development/);
});

test('local demo mode may create the documented demo identities', () => {
    const result = seedConfiguration({ APP_ENV: 'local', APP_DEMO_MODE: 'true' });
    assert.equal(result.seedDemoClient, true);
    assert.equal(result.admin.email, 'admin@example.invalid');
    assert.equal(result.client.email, 'client@example.invalid');
});

test('local mode skips demo client unless explicitly enabled', () => {
    const result = seedConfiguration({ APP_ENV: 'local', APP_DEMO_MODE: 'false' });
    assert.equal(result.seedDemoClient, false);
    assert.equal(result.client, null);
});
