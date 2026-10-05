import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (locale) => JSON.parse(fs.readFileSync(new URL(`./${locale}.json`, import.meta.url), 'utf8'));
const flatten = (node, prefix = '', result = {}) => {
    for (const [key, value] of Object.entries(node)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) flatten(value, path, result);
        else result[path] = String(value ?? '');
    }
    return result;
};
const placeholders = (value) => [
    ...value.matchAll(/\{\{[^{}]+\}\}|\$\{[^{}]+\}|:[A-Za-z_][\w-]*/g),
].map((match) => match[0]).sort();

const en = flatten(read('en'));
const fr = flatten(read('fr'));

test('French and English dictionaries expose exactly the same keys', () => {
    assert.deepEqual(Object.keys(fr).sort(), Object.keys(en).sort());
});

test('French translations are populated and preserve interpolation placeholders', () => {
    for (const key of Object.keys(en)) {
        assert.notEqual(fr[key].trim(), '', `${key} has an empty French value`);
        assert.deepEqual(placeholders(fr[key]), placeholders(en[key]), `${key} changed its placeholders`);
    }
});
