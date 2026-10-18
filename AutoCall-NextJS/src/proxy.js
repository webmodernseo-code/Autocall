import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, USER_COOKIE, verifyToken } from '@/lib/auth/jwt';

/**
 * Coarse network guard — the cheap half of the session checks. Server
 * components still re-check the session against the database; this proxy only
 * avoids rendering a portal shell for a request with no valid token at all.
 */
const GUEST_ONLY = ['/login', '/register', '/forgot-password', '/reset-password'];

export async function proxy(request) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Keep the public site on the apex domain and the authenticated product on app.*.
    if (process.env.APP_CLIENT_URL && pathname.startsWith('/app') && !hostname.startsWith('app.')) {
        const url = new URL(pathname.replace(/^\/app/, '') || '/dashboard', process.env.APP_CLIENT_URL);
        url.search = request.nextUrl.search;
        return NextResponse.redirect(url);
    }

    // Gestion intelligente des sous-domaines (app, docs, status, api)
    if (hostname.startsWith('docs.') && !pathname.startsWith('/docs') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
        const url = request.nextUrl.clone();
        url.pathname = pathname === '/' ? '/docs' : `/docs${pathname}`;
        return NextResponse.rewrite(url);
    }

    if (hostname.startsWith('status.') && !pathname.startsWith('/status') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
        const url = request.nextUrl.clone();
        url.pathname = pathname === '/' ? '/status' : `/status${pathname}`;
        return NextResponse.rewrite(url);
    }

    if (hostname.startsWith('app.') && !pathname.startsWith('/app') && !pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
        const url = request.nextUrl.clone();
        url.pathname = pathname === '/' ? '/app/dashboard' : `/app${pathname}`;
        return NextResponse.rewrite(url);
    }

    if (hostname.startsWith('api.') && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
        const url = request.nextUrl.clone();
        url.pathname = pathname === '/' ? '/api/health' : `/api${pathname}`;
        return NextResponse.rewrite(url);
    }

    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const admin = await verifyToken(request.cookies.get(ADMIN_COOKIE)?.value);
        if (!admin?.uid) return NextResponse.redirect(new URL('/admin/login', request.url));
        return NextResponse.next();
    }

    if (pathname === '/admin/login') {
        const admin = await verifyToken(request.cookies.get(ADMIN_COOKIE)?.value);
        if (admin?.uid) return NextResponse.redirect(new URL('/admin', request.url));
        return NextResponse.next();
    }

    if (pathname.startsWith('/app')) {
        const user = await verifyToken(request.cookies.get(USER_COOKIE)?.value);
        if (!user?.uid) return NextResponse.redirect(new URL('/login', request.url));
        return NextResponse.next();
    }

    // Les pages d'authentification (/login, /register, /forgot-password) restent
    // librement accessibles pour permettre la navigation fluide, la déconnexion et les tests.

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|storage|images|fonts|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp3|css|js|map)$).*)',
    ],
};
