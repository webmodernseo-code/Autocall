import assert from 'node:assert/strict';
import test from 'node:test';
import {
    normalizeBillingCycle,
    normalizeRegistrationPlan,
    postRegistrationTarget,
} from './registration-plan.mjs';

test('registration plans only accept public slugs', () => {
    assert.equal(normalizeRegistrationPlan('PRO'), 'pro');
    assert.equal(normalizeRegistrationPlan('enterprise'), 'free');
});

test('billing cycles reject arbitrary values', () => {
    assert.equal(normalizeBillingCycle('year'), 'year');
    assert.equal(normalizeBillingCycle('weekly'), 'month');
});

test('free registrations continue to onboarding', () => {
    assert.equal(postRegistrationTarget('free', 'month'), '/app/onboarding');
});

test('paid registrations preserve plan and billing cycle', () => {
    assert.equal(
        postRegistrationTarget('starter', 'year'),
        '/app/pricing?plan=starter&billing=year&onboarding=1',
    );
});
