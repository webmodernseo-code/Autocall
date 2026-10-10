import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const config = defineConfig([
    ...nextVitals,
    globalIgnores([
        '.next/**',
        'node_modules/**',
        'coverage/**',
        'public/**',
        'prisma/migrations/**',
    ]),
    {
        rules: {
            // Existing code may report these during progressive cleanup, but
            // correctness, hooks and accessibility errors remain blocking.
            'react/no-unescaped-entities': 'warn',
            '@next/next/no-img-element': 'warn',
            // React 19's newer lint rules expose legacy state synchronization.
            // Keep the debt visible in reports without blocking the framework upgrade.
            'react-hooks/set-state-in-effect': 'warn',
        },
    },
]);

export default config;
