import { PrismaClient } from '@prisma/client';

// Next.js dev hot-reloads modules; keep a single client on globalThis so we do
// not exhaust the MySQL connection pool.
const globalForPrisma = globalThis;

let lastConnFailureTime = 0;
const CIRCUIT_BREAKER_MS = 20000; // 20s cooldown before retrying remote DB

function getFallback(model, operation, args) {
    const m = (model || '').toLowerCase();
    if (operation === 'count') return 0;
    if (operation === 'findMany') {
        if (m === 'locale') {
            return [
                { id: 1n, code: 'fr', name: 'Français', is_active: true, is_default: true, is_rtl: false },
                { id: 2n, code: 'en', name: 'English', is_active: true, is_default: false, is_rtl: false },
            ];
        }
        if (m === 'currency') {
            return [
                { id: 1n, code: 'EUR', symbol: '€', name: 'Euro', is_active: true, is_default: true },
                { id: 2n, code: 'USD', symbol: '$', name: 'US Dollar', is_active: true, is_default: false },
                { id: 3n, code: 'XOF', symbol: 'CFA', name: 'Franc CFA', is_active: true, is_default: false },
            ];
        }
        return [];
    }
    if (operation === 'findFirst' || operation === 'findUnique') {
        return null;
    }
    if (operation === 'aggregate' || operation === 'groupBy') return { _count: 0, _sum: {}, _avg: {} };
    if (operation === 'create' || operation === 'update' || operation === 'upsert') {
        return { id: 1n, ...(args?.data || {}) };
    }
    if (operation === 'delete' || operation === 'deleteMany') return { count: 0 };
    return null;
}

function createPrismaClient() {
    const base = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['warn'] : ['error'],
    });

    return base.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    const now = Date.now();
                    // Fast circuit breaker: if remote DB rejected recently, return fallback instantly (0ms)
                    if (lastConnFailureTime > 0 && now - lastConnFailureTime < CIRCUIT_BREAKER_MS) {
                        return getFallback(model, operation, args);
                    }

                    try {
                        const result = await query(args);
                        lastConnFailureTime = 0; // DB is healthy
                        return result;
                    } catch (error) {
                        const msg = String(error?.message || error);
                        const isConnError =
                            msg.includes('not allowed to connect') ||
                            msg.includes("Can't reach database server") ||
                            msg.includes('Connection refused') ||
                            msg.includes('ETIMEDOUT') ||
                            msg.includes('ECONNREFUSED') ||
                            msg.includes('HY000') ||
                            msg.includes('P1001') ||
                            msg.includes('P1002');

                        if (isConnError) {
                            lastConnFailureTime = Date.now();
                            return getFallback(model, operation, args);
                        }
                        throw error;
                    }
                },
            },
        },
    });
}

export const prisma = globalForPrisma.__autocall_prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.__autocall_prisma = prisma;
}

export default prisma;
