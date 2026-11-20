'use client';

import React from 'react';
import Link from 'next/link';

function GoogleCalendarIcon() {
    return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="17" rx="3" fill="#FFFFFF" stroke="#4285F4" strokeWidth="1.5" />
            <path d="M3 8.5H21" stroke="#4285F4" strokeWidth="1.5" />
            <rect x="7" y="2" width="2" height="3.5" rx="1" fill="#EA4335" />
            <rect x="15" y="2" width="2" height="3.5" rx="1" fill="#EA4335" />
            <text x="12" y="16.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#1A73E8" fontFamily="sans-serif">31</text>
        </svg>
    );
}

function OutlookIcon() {
    return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="13" height="16" rx="2" fill="#0078D4" />
            <circle cx="8.5" cy="12" r="3.2" fill="#FFFFFF" />
            <circle cx="8.5" cy="12" r="1.6" fill="#0078D4" />
            <path d="M12 7L21 4V20L12 17V7Z" fill="#28A8EA" opacity="0.9" />
        </svg>
    );
}

function CalendlyIcon() {
    return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#006BFF" />
            <path d="M14.5 8.5C13.5 7.5 12 7 10.5 7.5C8.5 8.2 7 10.2 7.2 12.3C7.4 14.5 9.2 16.5 11.5 16.5C13.5 16.5 15.2 15 15.8 13.2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
    );
}

function HubSpotIcon() {
    return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
            <path d="M17.5 7.5V5.5C17.5 4.7 16.8 4 16 4C15.2 4 14.5 4.7 14.5 5.5V7.5C13.4 8.1 12.6 9.1 12.2 10.3H7.5V8.5C7.5 7.7 6.8 7 6 7C5.2 7 4.5 7.7 4.5 8.5V15.5C4.5 16.3 5.2 17 6 17C6.8 17 7.5 16.3 7.5 15.5V13.7H12.2C12.6 14.9 13.4 15.9 14.5 16.5V18.5C14.5 19.3 15.2 20 16 20C16.8 20 17.5 19.3 17.5 18.5V16.5C19.2 15.6 20.2 13.9 20.2 12C20.2 10.1 19.2 8.4 17.5 7.5ZM16 14C14.9 14 14 13.1 14 12C14 10.9 14.9 10 16 10C17.1 10 18 10.9 18 12C18 13.1 17.1 14 16 14Z" fill="#FF7A59" />
        </svg>
    );
}

function SalesforceIcon() {
    return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
            <path d="M10 5.5C11.2 4 13.2 3.5 14.9 4.2C16.5 4.8 17.5 6.3 17.7 8C19.2 8.3 20.4 9.6 20.5 11.2C20.6 12.8 19.6 14.3 18.1 14.8C18.2 15.2 18.1 15.6 17.9 16C17.2 17.2 15.9 18 14.5 18H8.5C6.6 18 5 16.4 5 14.5C5 13.1 5.8 11.8 7.1 11.2C6.9 10.5 7 9.7 7.4 9.1C8 8.1 9 7.5 10.1 7.5L10 5.5Z" fill="#00A1E0" />
        </svg>
    );
}

function WhatsAppIcon() {
    return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#25D366" />
            <path d="M17 14.8C16.7 15.6 15.7 16.2 14.8 16.3C14.2 16.4 13.4 16.4 11.1 15.4C8.2 14.2 6.3 11.2 6.1 11C6 10.8 4.9 9.3 4.9 7.8C4.9 6.3 5.7 5.5 6 5.2C6.3 4.9 6.6 4.8 7 4.8C7.1 4.8 7.3 4.8 7.4 4.8C7.8 4.8 8 5.4 8.2 5.9C8.4 6.4 8.8 7.4 8.9 7.5C9 7.7 9 7.9 8.9 8.1C8.8 8.2 8.7 8.4 8.5 8.6C8.4 8.7 8.2 8.9 8.1 9C8 9.1 7.8 9.3 8 9.6C8.2 9.9 8.8 10.9 9.7 11.7C10.8 12.7 11.7 13 12.1 13.2C12.3 13.3 12.6 13.3 12.8 13.1C13 12.9 13.3 12.5 13.6 12.1C13.8 11.8 14 11.8 14.3 11.9C14.6 12 16.2 12.8 16.5 13C16.8 13.1 17 13.2 17.1 13.4C17.2 13.7 17.2 14.2 17 14.8Z" fill="#FFFFFF" />
        </svg>
    );
}

function SlackIcon() {
    return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
            <path d="M6 10.5C6 11.3 5.3 12 4.5 12C3.7 12 3 11.3 3 10.5C3 9.7 3.7 9 4.5 9H6V10.5Z" fill="#E01E5A" />
            <path d="M7.5 10.5C7.5 9.7 8.2 9 9 9C9.8 9 10.5 9.7 10.5 10.5V15C10.5 15.8 9.8 16.5 9 16.5C8.2 16.5 7.5 15.8 7.5 15V10.5Z" fill="#E01E5A" />
            <path d="M10.5 6C9.7 6 9 5.3 9 4.5C9 3.7 9.7 3 10.5 3C11.3 3 12 3.7 12 4.5V6H10.5Z" fill="#36C5F0" />
            <path d="M10.5 7.5C11.3 7.5 12 8.2 12 9C12 9.8 11.3 10.5 10.5 10.5H6C5.2 10.5 4.5 9.8 4.5 9C4.5 8.2 5.2 7.5 6 7.5H10.5Z" fill="#36C5F0" />
            <path d="M18 13.5C18 12.7 18.7 12 19.5 12C20.3 12 21 12.7 21 13.5C21 14.3 20.3 15 19.5 15H18V13.5Z" fill="#2EB67D" />
            <path d="M16.5 13.5C16.5 14.3 15.8 15 15 15C14.2 15 13.5 14.3 13.5 13.5V9C13.5 8.2 14.2 7.5 15 7.5C15.8 7.5 16.5 8.2 16.5 9V13.5Z" fill="#2EB67D" />
            <path d="M13.5 18C14.3 18 15 18.7 15 19.5C15 20.3 14.3 21 13.5 21C12.7 21 12 20.3 12 19.5V18H13.5Z" fill="#ECB22E" />
            <path d="M13.5 16.5C12.7 16.5 12 15.8 12 15C12 14.2 12.7 13.5 13.5 13.5H18C18.8 13.5 19.5 14.2 19.5 15C19.5 15.8 18.8 16.5 18 16.5H13.5Z" fill="#ECB22E" />
        </svg>
    );
}

function WebhookIcon() {
    return (
        <svg className="h-7 w-7 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
            <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
            <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
        </svg>
    );
}

const INTEGRATIONS = [
    { name: 'Google Calendar', Icon: GoogleCalendarIcon },
    { name: 'Microsoft Outlook', Icon: OutlookIcon },
    { name: 'Calendly', Icon: CalendlyIcon },
    { name: 'HubSpot CRM', Icon: HubSpotIcon },
    { name: 'Salesforce', Icon: SalesforceIcon },
    { name: 'WhatsApp', Icon: WhatsAppIcon },
    { name: 'Slack', Icon: SlackIcon },
    { name: 'Webhooks & API', Icon: WebhookIcon },
];

export default function IntegrationsSection() {
    return (
        <section id="integrations" className="bg-[#F8FAFC] text-neutral-900 py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/80 scroll-mt-20">
            <div className="mx-auto max-w-6xl">
                <div className="rounded-2xl border border-neutral-200/90 bg-white p-8 sm:p-12 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Colonne Gauche */}
                    <div className="lg:col-span-5">
                        <h2 className="font-hero-sans text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-neutral-950">
                            Intégrations natives &amp; fluides
                        </h2>
                        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                            AutoCall se connecte sans friction aux agendas, CRM et outils de messagerie que vos équipes utilisent déjà au quotidien. Synchronisez vos données et automatisez vos workflows sans changer d&apos;opérateur.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Link
                                href="/docs"
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#2563EB] px-5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1D4ED8]"
                            >
                                Explorer les intégrations
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                            >
                                Essayer maintenant
                            </Link>
                        </div>
                    </div>

                    {/* Colonne Droite : Grille 4x2 de tuiles SVG */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {INTEGRATIONS.map((item) => {
                            const IconComp = item.Icon;
                            return (
                                <div
                                    key={item.name}
                                    className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-neutral-200/90 bg-[#F8FAFC]/50 p-5 transition-all hover:border-neutral-300 hover:bg-white hover:shadow-xs"
                                    title={item.name}
                                >
                                    <IconComp />
                                    <span className="text-xs font-medium text-neutral-700 text-center">{item.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
