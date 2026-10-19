import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

for (const name of ['.env', '.env.local']) {
    const file = path.resolve(process.cwd(), name);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (!match || process.env[match[1]] !== undefined) continue;
        process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, '$2');
    }
}

const rawKey = String(process.env.APP_KEY || '').trim();
if (!rawKey) throw new Error('APP_KEY is required; refusing to migrate secrets without it.');
const key = decodeKey(rawKey);
if (key.length !== 32) throw new Error(`APP_KEY must decode to 32 bytes (got ${key.length}).`);

function decodeKey(raw) {
    if (raw.startsWith('base64:')) return Buffer.from(raw.slice(7), 'base64');
    const decoded = Buffer.from(raw, 'base64');
    if (decoded.length === 32 && decoded.toString('base64').replace(/=+$/, '') === raw.replace(/=+$/, '')) {
        return decoded;
    }
    return Buffer.from(raw, 'utf8');
}

function isEncrypted(value) {
    if (!value) return true;
    try {
        const json = JSON.parse(Buffer.from(String(value), 'base64').toString('utf8'));
        if (!json.iv || !json.value || !json.mac) return false;
        const expected = crypto.createHmac('sha256', key).update(json.iv + json.value).digest('hex');
        return expected.length === json.mac.length
            && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(json.mac));
    } catch {
        return false;
    }
}

function encrypt(value) {
    if (!value || isEncrypted(value)) return value;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]).toString('base64');
    const ivB64 = iv.toString('base64');
    const mac = crypto.createHmac('sha256', key).update(ivB64 + encrypted).digest('hex');
    return Buffer.from(JSON.stringify({ iv: ivB64, value: encrypted, mac, tag: '' })).toString('base64');
}

const prisma = new PrismaClient();
let updated = 0;

async function migrateRows(rows, update, fields) {
    for (const row of rows) {
        const data = {};
        for (const field of fields) {
            if (row[field] && !isEncrypted(row[field])) data[field] = encrypt(row[field]);
        }
        if (Object.keys(data).length > 0) {
            await update(row.id, data);
            updated++;
        }
    }
}

try {
    await migrateRows(
        await prisma.whatsAppAccount.findMany({ select: { id: true, access_token: true, api_key: true } }),
        (id, data) => prisma.whatsAppAccount.update({ where: { id }, data }),
        ['access_token', 'api_key'],
    );
    await migrateRows(
        await prisma.sipTrunk.findMany({ select: { id: true, password: true } }),
        (id, data) => prisma.sipTrunk.update({ where: { id }, data }),
        ['password'],
    );
    await migrateRows(
        await prisma.elevenLabsKey.findMany({ select: { id: true, api_key: true } }),
        (id, data) => prisma.elevenLabsKey.update({ where: { id }, data }),
        ['api_key'],
    );
    await migrateRows(
        await prisma.messagingSetting.findMany({ select: { id: true, meta_app_secret: true } }),
        (id, data) => prisma.messagingSetting.update({ where: { id }, data }),
        ['meta_app_secret'],
    );
    console.info(`Encrypted ${updated} legacy credential row(s).`);
} finally {
    await prisma.$disconnect();
}
