import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidPublicEmail, sanitizeFormSubmission, sanitizePublicMessage } from './public-input.mjs';

test('public chat accepts only bounded text', () => {
    assert.equal(sanitizePublicMessage({ message: 'x' }), '');
    assert.equal(sanitizePublicMessage(`  bonjour\0  `), 'bonjour');
    assert.equal(sanitizePublicMessage('a'.repeat(2500)).length, 2000);
});

test('public form keeps only declared scalar fields', () => {
    const fields = [
        { key: 'email', type: 'email' },
        { key: 'message', type: 'textarea' },
    ];
    const clean = sanitizeFormSubmission(fields, {
        email: ' user@example.com ',
        message: 'Bonjour',
        admin: true,
        nested: { role: 'owner' },
    });
    assert.deepEqual(clean, { email: 'user@example.com', message: 'Bonjour' });
    assert.equal(isValidPublicEmail(clean.email), true);
    assert.equal(isValidPublicEmail('not-an-email'), false);
});
