import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = String(process.env.E2E_BASE_URL || 'http://127.0.0.1:3000').replace(/\/+$/, '');

async function request(path, options = {}) {
    return fetch(`${baseUrl}${path}`, { redirect: 'manual', ...options });
}

for (const path of ['/', '/login', '/register', '/faq', '/docs', '/status']) {
    test(`public route ${path} responds successfully`, async () => {
        const response = await request(path);
        assert.equal(response.status, 200);
    });
}

for (const [path, destination] of [
    ['/app/dashboard', '/login'],
    ['/app/agents', '/login'],
    ['/admin', '/admin/login'],
]) {
    test(`protected route ${path} redirects anonymous visitors`, async () => {
        const response = await request(path);
        assert.equal(response.status, 307);
        assert.equal(new URL(response.headers.get('location'), baseUrl).pathname, destination);
    });
}

for (const path of ['/api/v1/credits', '/api/v1/contacts']) {
    test(`protected API ${path} rejects anonymous requests`, async () => {
        const response = await request(path, { headers: { accept: 'application/json' } });
        assert.equal(response.status, 401);
    });
}

test('healthcheck reports the web service as healthy', async () => {
    const response = await request('/api/health');
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(payload.status, 'ok');
    assert.equal(payload.service, 'autocall-web');
});

test('security headers are enabled', async () => {
    const response = await request('/');
    assert.match(response.headers.get('strict-transport-security') || '', /max-age=/);
    assert.match(response.headers.get('content-security-policy') || '', /default-src 'self'/);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
});

test('SEO discovery endpoints use the production origin', async () => {
    const robots = await (await request('/robots.txt')).text();
    const sitemap = await (await request('/sitemap.xml')).text();
    const host = robots.match(/^Host:\s*(\S+)$/m)?.[1];
    const sitemapUrl = robots.match(/^Sitemap:\s*(\S+)$/m)?.[1];

    assert.ok(host, 'robots.txt must declare its canonical host');
    assert.ok(sitemapUrl, 'robots.txt must declare its sitemap URL');
    assert.equal(new URL(sitemapUrl).origin, new URL(host).origin);
    assert.ok(sitemap.includes(`<loc>${new URL(host).origin}/</loc>`));
});
