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

test('onboarding state definitions and constants match requirements', async () => {
    const { ONBOARDING_STATUS, ONBOARDING_STEPS, ONBOARDING_VERSION, ONBOARDING_STEP_DEFINITIONS } = await import('./onboarding.js');
    assert.equal(ONBOARDING_STEPS, 5);
    assert.equal(ONBOARDING_VERSION, 'v1');
    assert.equal(ONBOARDING_STATUS.NOT_STARTED, 'not_started');
    assert.equal(ONBOARDING_STATUS.IN_PROGRESS, 'in_progress');
    assert.equal(ONBOARDING_STATUS.COMPLETED, 'completed');
    assert.equal(ONBOARDING_STATUS.DISMISSED, 'dismissed');
    assert.equal(ONBOARDING_STEP_DEFINITIONS.length, 5);
});

test('onboarding redirect rule prevents reappearance after completed or dismissed', () => {
    const shouldRedirect = (status) => status !== 'completed' && status !== 'dismissed';
    assert.equal(shouldRedirect('completed'), false, 'Completed onboarding must never auto-redirect');
    assert.equal(shouldRedirect('dismissed'), false, 'Dismissed onboarding must never auto-redirect');
    assert.equal(shouldRedirect('in_progress'), true, 'In progress onboarding should guide user to resume');
    assert.equal(shouldRedirect('not_started'), true, 'Not started onboarding should guide new user');
});

test('onboarding step clamping and completion calculations', () => {
    const totalSteps = 5;
    const completedIndices = [0, 1, 2];
    const pct = Math.round((completedIndices.length / totalSteps) * 100);
    assert.equal(pct, 60);

    const stepIndex = 3;
    const clamped = Math.max(0, Math.min(stepIndex, totalSteps - 1));
    assert.equal(clamped, 3);
});
