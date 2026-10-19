const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizePublicMessage(value, maxLength = 2000) {
    if (typeof value !== 'string') return '';
    return value.replace(/\0/g, '').trim().slice(0, maxLength);
}

export function sanitizeFormSubmission(fields, body) {
    const clean = {};
    const source = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
    for (const field of Array.isArray(fields) ? fields : []) {
        if (!field || typeof field.key !== 'string' || !field.key) continue;
        const raw = source[field.key];
        if (raw === undefined || raw === null) continue;
        if (!['string', 'number', 'boolean'].includes(typeof raw)) continue;
        const type = String(field.type || '').toLowerCase();
        const max = type.includes('textarea') ? 10000 : type.includes('email') ? 320 : 2000;
        clean[field.key] = String(raw).replace(/\0/g, '').trim().slice(0, max);
    }
    return clean;
}

export function isValidPublicEmail(value) {
    return !value || (value.length <= 320 && EMAIL_RE.test(value));
}
