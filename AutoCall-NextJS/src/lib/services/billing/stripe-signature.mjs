import crypto from 'node:crypto';

export function verifyStripeSignature(payload, header, secret, toleranceSeconds = 300) {
    if (!header) throw new Error('No signature header');

    const parts = String(header)
        .split(',')
        .map((part) => part.split('=', 2))
        .filter((part) => part.length === 2);
    const timestamp = parts.find(([key]) => key === 't')?.[1];
    const signatures = parts.filter(([key]) => key === 'v1').map(([, value]) => value);
    if (!timestamp || signatures.length === 0) throw new Error('Malformed signature header');

    if (Math.abs(Date.now() / 1000 - Number(timestamp)) > toleranceSeconds) {
        throw new Error('Timestamp outside tolerance');
    }

    const expected = crypto
        .createHmac('sha256', secret)
        .update(`${timestamp}.${payload}`)
        .digest('hex');

    const expectedBytes = Buffer.from(expected);
    const matches = signatures.some((signature) => {
        const receivedBytes = Buffer.from(signature);
        return expectedBytes.length === receivedBytes.length
            && crypto.timingSafeEqual(expectedBytes, receivedBytes);
    });
    if (!matches) throw new Error('Signature mismatch');

    return JSON.parse(payload);
}
