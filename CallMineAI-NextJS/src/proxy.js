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
        const session = await verifyToken(request.cookies.get(USER_COOKIE)?.value);
        if (!session?.uid) {
            const url = new URL('/login', request.url);
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    if (GUEST_ONLY.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
        const session = await verifyToken(request.cookies.get(USER_COOKIE)?.value);
        if (session?.uid) return NextResponse.redirect(new URL('/app/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|storage|images|fonts|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp3|css|js|map)$).*)',
    ],
};

