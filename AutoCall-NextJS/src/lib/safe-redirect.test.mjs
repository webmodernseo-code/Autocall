import assert from 'node:assert/strict';
import test from 'node:test';
import { safeRedirectPath } from './safe-redirect.mjs';

test('accepts local paths and preserves query strings and fragments', () => {
    assert.equal(safeRedirectPath('/app/calls?page=2#recent'), '/app/calls?page=2#recent');
});

test('rejects absolute and protocol-relative destinations', () => {
    assert.equal(safeRedirectPath('https://example.com'), '/app/dashboard');
    assert.equal(safeRedirectPath('//example.com/path'), '/app/dashboard');
});

test('rejects backslash and control-character URL variants', () => {
    assert.equal(safeRedirectPath('/\\example.com'), '/app/dashboard');
    assert.equal(safeRedirectPath('/app/dashboard\nLocation: https://example.com'), '/app/dashboard');
});

test('supports an explicit local fallback', () => {
    assert.equal(safeRedirectPath(null, '/login'), '/login');
});
