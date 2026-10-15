const isDevelopment = process.env.NODE_ENV === 'development';
const contentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://apis.google.com https://*.firebaseapp.com https://www.gstatic.com${isDevelopment ? " 'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https: wss:;
    media-src 'self' blob: https:;
    frame-src 'self' https://js.stripe.com https://www.paypal.com https://*.firebaseapp.com https://accounts.google.com;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://www.paypal.com https://accounts.google.com;
    frame-ancestors 'self';
    upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    poweredByHeader: false,
    serverExternalPackages: ['@prisma/client', 'bcryptjs', 'nodemailer'],
    async headers() {
        // Mirrors App\Http\Middleware\SecureHeaders.
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'Content-Security-Policy', value: contentSecurityPolicy },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(self), geolocation=()',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
