import assert from 'node:assert/strict';
import test from 'node:test';
import { detectRegionalPreferences } from './regional-preferences.mjs';

const requestHeaders = (values) => new Headers(values);

test('France defaults to French and euro', () => {
    assert.deepEqual(detectRegionalPreferences(requestHeaders({ 'cf-ipcountry': 'FR' })), {
        country: 'FR', locale: 'fr', currency: 'EUR',
    });
});

test('XOF countries default to French and XOF', () => {
    assert.deepEqual(detectRegionalPreferences(requestHeaders({ 'cf-ipcountry': 'SN' })), {
        country: 'SN', locale: 'fr', currency: 'XOF',
    });
});

test('English-speaking country defaults to English and USD', () => {
    assert.deepEqual(detectRegionalPreferences(requestHeaders({ 'cf-ipcountry': 'US' })), {
        country: 'US', locale: 'en', currency: 'USD',
    });
});

test('browser language is used when a trusted country header is unavailable', () => {
    assert.deepEqual(detectRegionalPreferences(requestHeaders({ 'accept-language': 'fr-FR,fr;q=0.9,en;q=0.8' })), {
        country: null, locale: 'fr', currency: 'EUR',
    });
});
