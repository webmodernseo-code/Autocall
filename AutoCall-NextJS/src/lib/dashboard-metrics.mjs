export const DASHBOARD_PERIOD_DAYS = Object.freeze({ '7d': 7, '30d': 30, '90d': 90 });

export function dashboardPeriod(value) {
    return Object.hasOwn(DASHBOARD_PERIOD_DAYS, value) ? value : '30d';
}

export function buildActivityBuckets(calls, periodStart, periodEnd, periodDays, locale = 'fr-FR') {
    const bucketDays = periodDays <= 7 ? 1 : periodDays <= 30 ? 3 : 7;
    const bucketMs = bucketDays * 24 * 60 * 60 * 1000;
    const buckets = [];

    for (let startMs = periodStart.getTime(); startMs < periodEnd.getTime(); startMs += bucketMs) {
        const start = new Date(startMs);
        const end = new Date(Math.min(startMs + bucketMs, periodEnd.getTime()));
        const startLabel = start.toLocaleDateString(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' });
        const endLabel = new Date(end.getTime() - 1).toLocaleDateString(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' });

        buckets.push({
            day: bucketDays === 1 ? startLabel : `${startLabel}–${endLabel}`,
            calls: calls.filter((call) => {
                const createdAt = new Date(call.created_at).getTime();
                return createdAt >= startMs && createdAt < end.getTime();
            }).length,
        });
    }

    return buckets;
}
