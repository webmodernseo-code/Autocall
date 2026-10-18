import assert from 'node:assert/strict';
import test from 'node:test';
import { clientIp, csrfFailureReason } from './request-security.mjs';

function request(url, { method = 'POST', headers = {} } = {}) {
    return new Request(url, { method, headers });
}

test('accepts configured application origins and rejects hostile sibling origins', () => {
    const env = { NODE_ENV: 'production', APP_URL: 'https://autocall.example', APP_CLIENT_URL: 'https://app.autocall.example' };
    assert.equal(csrfFailureReason(request('https://autocall.example/api/password', {
        headers: { origin: 'https://app.autocall.example', 'sec-fetch-site': 'same-site' },
    }), env), null);
    assert.equal(csrfFailureReason(request('https://autocall.example/api/password', {
        headers: { origin: 'https://evil.autocall.example', 'sec-fetch-site': 'same-site' },
    }), env), 'origin-mismatch');
});

test('rejects cross-site browser writes while exempting signed or bearer endpoints', () => {
    const env = { NODE_ENV: 'production', APP_URL: 'https://autocall.example' };
    assert.equal(csrfFailureReason(request('https://autocall.example/api/password', {
        headers: { 'sec-fetch-site': 'cross-site' },
    }), env), 'cross-site');
    assert.equal(csrfFailureReason(request('https://autocall.example/webhooks/twilio/status', {
        headers: { 'sec-fetch-site': 'cross-site' },
    }), env), null);
    assert.equal(csrfFailureReason(request('https://autocall.example/api/v1/calls', {
        headers: { 'sec-fetch-site': 'cross-site' },
    }), env), null);
});

test('uses the right side of the forwarding chain based on trusted proxy count', () => {
    const req = request('https://autocall.example/api/login', {
        headers: { 'x-forwarded-for': '6.6.6.6, 198.51.100.20' },
    });
    assert.equal(clientIp(req, { TRUSTED_PROXY_COUNT: '1' }), '198.51.100.20');
    assert.equal(clientIp(req, { TRUSTED_PROXY_COUNT: '2' }), '6.6.6.6');
});

test('rejects malformed forwarded addresses', () => {
    const req = request('https://autocall.example/api/login', {
        headers: { 'x-forwarded-for': 'attacker-controlled', 'x-real-ip': '203.0.113.8' },
    });
    assert.equal(clientIp(req, { TRUSTED_PROXY_COUNT: '1' }), '203.0.113.8');
});
