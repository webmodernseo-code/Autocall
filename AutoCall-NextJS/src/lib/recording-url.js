const TRUSTED_RECORDING_HOSTS = Object.freeze([
    'api.twilio.com',
    'media.twiliocdn.com',
    'media.plivo.com',
    'storage.plivo.com',
]);

export function trustedRecordingUrl(value) {
    try {
        const url = new URL(String(value ?? ''));
        if (url.protocol !== 'https:') return null;

        const hostname = url.hostname.toLowerCase();
        const trusted = TRUSTED_RECORDING_HOSTS.some(
            (host) => hostname === host || hostname.endsWith(`.${host}`),
        );

        return trusted ? url : null;
    } catch {
        return null;
    }
}

