import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import { verifyStripeSignature } from './stripe-signature.mjs';

const payload = JSON.stringify({ id: 'evt_test', type: 'checkout.session.completed' });
const secret = 'whsec_test_secret';

function signature(timestamp) {
    return crypto.createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
}

test('accepts a valid Stripe signature', () => {
    const timestamp = Math.floor(Date.now() / 1000);
    assert.equal(verifyStripeSignature(payload, `t=${timestamp},v1=${signature(timestamp)}`, secret).id, 'evt_test');
});

test('accepts any valid v1 signature during secret rotation', () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const header = `t=${timestamp},v1=invalid,v1=${signature(timestamp)}`;
    assert.equal(verifyStripeSignature(payload, header, secret).type, 'checkout.session.completed');
});

test('rejects stale and invalid signatures', () => {
    const stale = Math.floor(Date.now() / 1000) - 600;
    assert.throws(() => verifyStripeSignature(payload, `t=${stale},v1=${signature(stale)}`, secret), /tolerance/);
    const timestamp = Math.floor(Date.now() / 1000);
    assert.throws(() => verifyStripeSignature(payload, `t=${timestamp},v1=invalid`, secret), /mismatch/);
});
