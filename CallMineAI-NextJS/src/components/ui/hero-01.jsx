'use client';

import React from 'react';
import HeroSection from "@/components/ui/hero-01-utils/hero";
import Header from "@/components/ui/hero-01-utils/header";
import BrandSlider from "@/components/ui/hero-01-utils/brand-slider";
import VoiceDemoSection from "@/components/ui/hero-01-utils/voice-demo";
import SectorsSection from "@/components/ui/hero-01-utils/sectors-section";
import IntegrationsSection from "@/components/ui/hero-01-utils/integrations-section";
import PricingSection from "@/components/ui/hero-01-utils/pricing-section";

export default function AgencyHeroSection() {
  const avatarList = [
    {
      image:
        "https://cdn.21st.dev/assets/localized/59a2b5a0dfc1531e2d1ea42d71ae8615f37582e1f8a17e4a1b1aff9afc7ef878.jpg",
    },
    {
      image:
        "https://cdn.21st.dev/assets/localized/c7097eeb66ad097b6e5f9dbb95ae857cd6b55c0ad398c1ea84f3ab90a02c631e.jpg",
    },
    {
      image:
        "https://cdn.21st.dev/assets/localized/c70d48e47d3a2d79ad07d16bff3aa3cff686580be031b6102cad73a15b47d8fd.jpg",
    },
    {
      image:
        "https://cdn.21st.dev/assets/localized/51c9ed392f6e7fce7fd85a78648e3e06bfdcd91999ab5fa48485888231589abf.jpg",
    },
  ];

  const navigationData = [
    {
      title: "Accueil",
      href: "#",
      isActive: true,
    },
    {
      title: "Produit",
      href: "#produit",
    },
    {
      title: "Secteurs",
      href: "#secteurs",
    },
    {
      title: "Intégrations",
      href: "#integrations",
    },
    {
      title: "Tarifs",
      href: "#tarifs",
    },
  ];

  const brandList = [
    {
      image:
        "https://cdn.21st.dev/assets/localized/d824c259df6b2b2962fbef96e68a6877cab689b19246e3dc34ac9e7b144d32bd.svg",
      lightimg:
        "https://cdn.21st.dev/assets/localized/15cd724e2a038ed1415820ee25349eac7dfadec7f9359ae3800c13856ecb8b13.svg",
      name: "Brand 1",
    },
    {
      image:
        "https://cdn.21st.dev/assets/localized/266083df0c7d0633f145889af4700d18e62b8f2c068fd8ab73d5a94b87a5a5cb.svg",
      lightimg:
        "https://cdn.21st.dev/assets/localized/ae83ac635485a392bac5c1723e98d6820d3587f762fdbde63cd462d7edea7c0d.svg",
      name: "Brand 2",
    },
    {
      image:
        "https://cdn.21st.dev/assets/localized/91d1c562d12ba69aa7525d3782c6c6223b90e302073d59769dfce665ab9a83b7.svg",
      lightimg:
        "https://cdn.21st.dev/assets/localized/23d52f6aa5bbc765b65d5253b6578ed0e9213956a21be149f679cc79e2b0259e.svg",
      name: "Brand 3",
    },
    {
      image:
        "https://cdn.21st.dev/assets/localized/f50b06ae2b7bf86d199b0ac986a47442f4a198d2f6dd81a9fe83c43022608498.svg",
      lightimg:
        "https://cdn.21st.dev/assets/localized/4cd93b1d1133feffdf8eba4431f93c14b538120c74285f39fe7ad1c6e48f7b53.svg",
      name: "Brand 4",
    },
    {
      image:
        "https://cdn.21st.dev/assets/localized/3ad67ddda671655df765a507c9bcc7b67e4138a1ffe903ace17cef99c5c972a3.svg",
      lightimg:
        "https://cdn.21st.dev/assets/localized/6ee9f831a7c1cb87c14308a9d687fbd5fb2f319abee03d306b78730421410354.svg",
      name: "Brand 5",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#08090C] font-sans text-white overflow-x-clip selection:bg-white selection:text-black">
      {/* HALOS CLIPPÉS DANS LEUR CONTENEUR SANS BLOQUER LE STICKY */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* 1. HALO BLEU OCÉANIQUE PROFOND À GAUCHE */}
        <div
          className="absolute -left-48 top-1/4 h-[750px] w-[750px] rounded-full blur-[140px] opacity-70"
          style={{
            background: 'radial-gradient(circle, rgba(22, 65, 125, 0.45) 0%, rgba(12, 35, 75, 0.2) 45%, transparent 70%)',
          }}
        />

        {/* 2. HALO AMBRÉ / COUCHER DE SOLEIL CHAUD À DROITE */}
        <div
          className="absolute -right-48 top-1/4 h-[750px] w-[750px] rounded-full blur-[140px] opacity-65"
          style={{
            background: 'radial-gradient(circle, rgba(145, 92, 45, 0.42) 0%, rgba(85, 50, 22, 0.18) 45%, transparent 70%)',
          }}
        />

        {/* 3. HALO CENTRAL DIFFUS DERRIÈRE LE TITRE */}
        <div
          className="absolute left-1/2 top-24 -translate-x-1/2 h-[550px] w-[950px] rounded-full blur-[160px] opacity-40"
          style={{
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.08) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="relative z-10">
        <Header navigationData={navigationData} />
        <main>
          <HeroSection avatarList={avatarList} />
          <BrandSlider brandList={brandList} />
          <VoiceDemoSection />
          <SectorsSection />
          <IntegrationsSection />
          <PricingSection />
        </main>
      </div>
    </div>
  );
}
