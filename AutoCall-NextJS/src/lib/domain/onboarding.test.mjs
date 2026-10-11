import test from 'node:test';
import assert from 'node:assert/strict';
import { onboardingMeta, onboardingPrompt } from './onboarding.js';

const input = {
    business_name: 'Cabinet Horizon',
    agent_name: 'Camille',
    goal: 'appointments',
    business_summary: 'Cabinet médical ouvert sur rendez-vous.',
    opening_start: '09:00',
    opening_end: '18:00',
    transfer_rule: 'requested',
    transfer_phone: '+33102030405',
    sector: 'health',
};

test('builds a useful French agent prompt from onboarding answers', () => {
    const prompt = onboardingPrompt(input);
    assert.match(prompt, /Camille/);
    assert.match(prompt, /Cabinet Horizon/);
    assert.match(prompt, /rendez-vous/);
    assert.match(prompt, /09:00 à 18:00/);
});

test('preserves unrelated metadata and records onboarding completion', () => {
    const meta = onboardingMeta({ provider: { id: 'abc' } }, input, true);
    assert.equal(meta.provider.id, 'abc');
    assert.equal(meta.onboarding.sector, 'health');
    assert.ok(meta.onboarding.completed_at);
});
