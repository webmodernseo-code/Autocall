import http from 'node:http';
import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose';
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

async function run() {
    const user = await prisma.user.findFirst({ where: { role: 'client' } });
    console.log('Testing with client user:', user.email, 'ID:', user.id.toString());

    const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET);
    const token = await new SignJWT({
        uid: Number(user.id),
        client_id: user.client_id ? Number(user.client_id) : null,
        current_tenant_id: null,
        locale: 'fr',
        display_currency: 'EUR',
        theme: 'dark'
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(secretKey);

    const urls = [
        'http://localhost:3000/app/dashboard',
        'http://localhost:3000/app/agents',
        'http://localhost:3000/app/calls',
        'http://localhost:3000/app/campaigns',
        'http://localhost:3000/app/contacts',
    ];

    console.log('\n--- Client Portal Routes Access Test ---');
    for (const uStr of urls) {
        const u = new URL(uStr);
        const res = await new Promise((resolve) => {
            const req = http.request({
                hostname: u.hostname,
                port: u.port,
                path: u.pathname,
                method: 'GET',
                headers: {
                    'Cookie': `cm_session=${token}`
                }
            }, (res) => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => resolve({
                    status: res.statusCode,
                    location: res.headers.location,
                    length: data.length
                }));
            });
            req.on('error', e => resolve({ error: e.message }));
            req.end();
        });

        console.log(`${uStr} -> HTTP ${res.status}${res.location ? ' (Redirect to: ' + res.location + ')' : ' [UNLOCKED & FUNCTIONAL]'}`);
    }
}

run()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
