import assert from 'node:assert/strict';
import test from 'node:test';
import { trustedRecordingUrl } from './recording-url.js';

test('accepts trusted HTTPS recording providers', () => {
    assert.equal(trustedRecordingUrl('https://api.twilio.com/recording.mp3')?.hostname, 'api.twilio.com');
    assert.equal(trustedRecordingUrl('https://media.plivo.com/recording.mp3')?.hostname, 'media.plivo.com');
});

test('rejects untrusted, deceptive and non-HTTPS recording URLs', () => {
    assert.equal(trustedRecordingUrl('http://api.twilio.com/recording.mp3'), null);
    assert.equal(trustedRecordingUrl('https://api.twilio.com.attacker.example/recording.mp3'), null);
    assert.equal(trustedRecordingUrl('https://127.0.0.1/internal'), null);
    assert.equal(trustedRecordingUrl('javascript:alert(1)'), null);
});
