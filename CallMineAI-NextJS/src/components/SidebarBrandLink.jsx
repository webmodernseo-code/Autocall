'use client';

import { Link, usePage } from '@/lib/page-router';
import BrandMark, { BrandName } from '@/components/BrandMark';

const imgClass = 'h-7 max-h-7.5 w-auto max-w-[10rem] shrink-0 object-contain object-left';

/**
 * Sidebar header brand. Shows the uploaded site logo if one is set, otherwise a
 * neutral text wordmark built from the app name.
 */
export default function SidebarBrandLink({ href, ariaLabel }) {
    const brand = 'AutoCall';

    return (
        <Link href={href} className="flex min-w-0 items-center group transition-opacity hover:opacity-90 py-1" aria-label={ariaLabel}>
            {/* Version thème clair : texte foncé #0F172A avec ondes bleues */}
            <img
                src="/images/autocall-logo-dark.png"
                alt={brand}
                className="h-4 max-h-[18px] w-auto max-w-[110px] shrink-0 object-contain object-left dark:hidden"
            />
            {/* Version thème sombre : texte blanc avec ondes bleues */}
            <img
                src="/images/autocall-logo.png"
                alt={brand}
                className="h-4 max-h-[18px] w-auto max-w-[110px] shrink-0 object-contain object-left hidden dark:block"
            />
        </Link>
    );
}
