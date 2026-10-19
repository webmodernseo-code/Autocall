import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const root = process.cwd();
const sourceRoots = ['src/views', 'src/components', 'src/app'];
const attributeNames = new Set([
    'title', 'placeholder', 'aria-label', 'alt', 'loadingText', 'emptyText',
    'description', 'label', 'confirmText', 'cancelText', 'submitText',
]);

function flatten(value, prefix = '', out = {}) {
    for (const [key, child] of Object.entries(value ?? {})) {
        const full = prefix ? `${prefix}.${key}` : key;
        if (child && typeof child === 'object' && !Array.isArray(child)) flatten(child, full, out);
        else if (typeof child === 'string') out[full] = child;
    }
    return out;
}

function filesIn(directory) {
    const out = [];
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const full = path.join(directory, entry.name);
        if (entry.isDirectory()) out.push(...filesIn(full));
        else if (/\.(jsx|tsx)$/.test(entry.name)) out.push(full);
    }
    return out;
}

const english = flatten(JSON.parse(fs.readFileSync(path.join(root, 'src/locales/en.json'), 'utf8')));
const reverse = new Map();
for (const [key, value] of Object.entries(english)) {
    const normalized = value.replace(/\s+/g, ' ').trim();
    if (!normalized || normalized.length < 2) continue;
    const current = reverse.get(normalized);
    if (!current || (current.startsWith('hardcoded.') && !key.startsWith('hardcoded.'))) reverse.set(normalized, key);
}

let changedFiles = 0;
let replacementsCount = 0;

for (const file of sourceRoots.flatMap((directory) => filesIn(path.join(root, directory)))) {
    const originalSource = fs.readFileSync(file, 'utf8');
    const misplacedDirective = originalSource.match(/^(?<imports>(?:import[^;]+;\s*)+)(?<directive>['"]use client['"];\s*)/s);
    const source = misplacedDirective
        ? `${misplacedDirective.groups.directive}${misplacedDirective.groups.imports}${originalSource.slice(misplacedDirective[0].length)}`
        : originalSource;
    let ast;
    try {
        ast = parser.parse(source, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
    } catch {
        continue;
    }

    const replacements = [];
    let needsTrans = false;
    let needsI18n = false;

    traverse(ast, {
        JSXText(nodePath) {
            const raw = nodePath.node.value;
            const normalized = raw.replace(/\s+/g, ' ').trim();
            const key = reverse.get(normalized);
            if (!key || !/[A-Za-zÀ-ÿ]/.test(normalized)) return;
            const leading = raw.match(/^\s*/)?.[0] ?? '';
            const trailing = raw.match(/\s*$/)?.[0] ?? '';
            replacements.push({ start: nodePath.node.start, end: nodePath.node.end, text: `${leading}<Trans i18nKey="${key}" />${trailing}` });
            needsTrans = true;
        },
        JSXAttribute(nodePath) {
            const name = nodePath.node.name?.name;
            const value = nodePath.node.value;
            if (!attributeNames.has(name) || value?.type !== 'StringLiteral') return;
            const normalized = value.value.replace(/\s+/g, ' ').trim();
            const key = reverse.get(normalized);
            if (!key || !/[A-Za-zÀ-ÿ]/.test(normalized)) return;
            replacements.push({ start: value.start, end: value.end, text: `{translationI18n.t('${key}')}` });
            needsI18n = true;
        },
    });

    if (!replacements.length) {
        if (source !== originalSource) {
            fs.writeFileSync(file, source);
            changedFiles++;
        }
        continue;
    }
    let output = source;
    for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
        output = output.slice(0, replacement.start) + replacement.text + output.slice(replacement.end);
    }

    if (needsTrans && !/from ['"]react-i18next['"]/.test(output)) {
        output = output.startsWith("'use client';") || output.startsWith('"use client";')
            ? output.replace(/^(?:['"]use client['"];\s*)/, (directive) => `${directive}import { Trans } from 'react-i18next';\n`)
            : `import { Trans } from 'react-i18next';\n${output}`;
    } else if (needsTrans) {
        output = output.replace(/import\s*\{([^}]*)\}\s*from\s*(['"]react-i18next['"])/, (all, names, moduleName) => {
            if (/\bTrans\b/.test(names)) return all;
            return `import {${names.trimEnd()}, Trans } from ${moduleName}`;
        });
    }
    if (needsI18n && !/from ['"]@\/i18n['"]/.test(output)) {
        output = output.startsWith("'use client';") || output.startsWith('"use client";')
            ? output.replace(/^(?:['"]use client['"];\s*)/, (directive) => `${directive}import translationI18n from '@/i18n';\n`)
            : `import translationI18n from '@/i18n';\n${output}`;
    }

    fs.writeFileSync(file, output);
    changedFiles++;
    replacementsCount += replacements.length;
}

console.log(JSON.stringify({ changedFiles, replacements: replacementsCount }));
