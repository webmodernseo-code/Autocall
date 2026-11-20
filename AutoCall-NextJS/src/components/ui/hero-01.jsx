'use client';

import React from 'react';
import Header from '@/components/ui/hero-01-utils/header';
import HeroSection from '@/components/ui/hero-01-utils/hero';
import BrandSlider from '@/components/ui/hero-01-utils/brand-slider';
import VoiceDemoSection from '@/components/ui/hero-01-utils/voice-demo';
import CapabilitiesSection from '@/components/ui/hero-01-utils/capabilities-section';
import SectorsSection from '@/components/ui/hero-01-utils/sectors-section';
import IntegrationsSection from '@/components/ui/hero-01-utils/integrations-section';
import PricingSection from '@/components/ui/hero-01-utils/pricing-section';
import FaqSection from '@/components/ui/hero-01-utils/faq-section';
import CtaSection from '@/components/ui/hero-01-utils/cta-section';
import FloatingSupportButton from '@/components/ui/hero-01-utils/floating-support';

export default function AgencyHeroSection() {
    const avatarList = [
        {
            image: 'https://cdn.21st.dev/assets/localized/59a2b5a0dfc1531e2d1ea42d71ae8615f37582e1f8a17e4a1b1aff9afc7ef878.jpg',
        },
        {
            image: 'https://cdn.21st.dev/assets/localized/c7097eeb66ad097b6e5f9dbb95ae857cd6b55c0ad398c1ea84f3ab90a02c631e.jpg',
        },
        {
            image: 'https://cdn.21st.dev/assets/localized/c70d48e47d3a2d79ad07d16bff3aa3cff686580be031b6102cad73a15b47d8fd.jpg',
        },
        {
            image: 'https://cdn.21st.dev/assets/localized/51c9ed392f6e7fce7fd85a78648e3e06bfdcd91999ab5fa48485888231589abf.jpg',
        },
    ];

    const navigationData = [
        { title: 'Fonctionnalités', href: '#fonctionnalites' },
        { title: 'Démonstration', href: '#demo' },
        { title: 'Secteurs', href: '#secteurs' },
        { title: 'Intégrations', href: '#integrations' },
        { title: 'Tarifs', href: '#tarifs' },
        { title: 'Docs', href: '/docs' },
    ];

    return (
        <div className="relative min-h-screen bg-white text-neutral-900 font-sans overflow-x-clip selection:bg-[#2563EB] selection:text-white">
            <Header navigationData={navigationData} />

            <main>
                <HeroSection avatarList={avatarList} />
                <BrandSlider />
                <CapabilitiesSection />
                <VoiceDemoSection />
                <SectorsSection />
                <IntegrationsSection />
                <PricingSection />
                <FaqSection />
                <CtaSection />
            </main>

            <FloatingSupportButton />
        </div>
    );
}
