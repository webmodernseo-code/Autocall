import assert from 'node:assert/strict';
import test from 'node:test';
import { isPublicIp } from './outbound-guard-core.mjs';

test('rejects private, loopback, link-local and reserved addresses', () => {
    for (const address of ['127.0.0.1', '10.0.0.1', '172.16.0.1', '192.168.1.1', '169.254.169.254', '::1', 'fd00::1']) {
        assert.equal(isPublicIp(address), false, address);
    }
    assert.equal(isPublicIp('8.8.8.8'), true);
    assert.equal(isPublicIp('2606:4700:4700::1111'), true);
});
