import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildActivityBuckets,
    dashboardPeriod,
} from './dashboard-metrics.mjs';

test('dashboardPeriod accepts only supported periods', () => {
    assert.equal(dashboardPeriod('7d'), '7d');
    assert.equal(dashboardPeriod('90d'), '90d');
    assert.equal(dashboardPeriod('all'), '30d');
    assert.equal(dashboardPeriod(undefined), '30d');
});

test('activity buckets contain every call exactly once inside the selected period', () => {
    const start = new Date('2026-01-01T00:00:00.000Z');
    const end = new Date('2026-01-08T00:00:00.000Z');
    const calls = [
        { created_at: '2026-01-01T00:00:00.000Z' },
        { created_at: '2026-01-01T23:59:59.999Z' },
        { created_at: '2026-01-07T12:00:00.000Z' },
        { created_at: '2025-12-31T23:59:59.999Z' },
        { created_at: '2026-01-08T00:00:00.000Z' },
    ];

    const buckets = buildActivityBuckets(calls, start, end, 7);
    assert.equal(buckets.length, 7);
    assert.deepEqual(buckets.map((bucket) => bucket.calls), [2, 0, 0, 0, 0, 0, 1]);
    assert.equal(buckets.reduce((sum, bucket) => sum + bucket.calls, 0), 3);
});

test('long periods are grouped into readable buckets', () => {
    const start = new Date('2026-01-01T00:00:00.000Z');
    const end = new Date('2026-03-31T00:00:00.000Z');
    const buckets = buildActivityBuckets([], start, end, 90);

    assert.equal(buckets.length, 13);
    assert.ok(buckets.every((bucket) => bucket.calls === 0));
});
