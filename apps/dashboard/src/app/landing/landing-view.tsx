"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FacebookBrandSvg,
  GmailBrandSvg,
  GoogleAdsBrandSvg,
  GoogleCalendarBrandSvg,
  GoogleMeetBrandSvg,
  HubSpotBrandSvg,
  InstagramBrandSvg,
  LinkedInBrandSvg,
  MicrosoftTeamsBrandSvg,
  OutlookBrandSvg,
  WhatsAppBrandSvg,
  ZoomBrandSvg,
} from "../brand-icons";
import { LandingAskAI } from "./landing-ask-ai";

const HERO_INTEGRATIONS = [
  { name: "WhatsApp", Icon: WhatsAppBrandSvg },
  { name: "Zoom", Icon: ZoomBrandSvg },
  { name: "Google Meet", Icon: GoogleMeetBrandSvg },
  { name: "Gmail", Icon: GmailBrandSvg },
  { name: "Outlook", Icon: OutlookBrandSvg },
];

const RESOURCE_LINKS = [
  {
    id: "blog",
    label: "Cas d’usage",
    description: "Découvrez les parcours illustrés dans AutoCall.",
    href: "#cas-usage",
  },
  {
    id: "help",
    label: "Centre d’aide",
    description: "Réponses rapides et prise en main pas à pas.",
    href: "/?view=help",
  },
  {
    id: "docs",
    label: "Intégrations",
    description: "Découvrez les outils présentés dans AutoCall.",
    href: "#integrations",
  },
  {
    id: "changelog",
    label: "Questions fréquentes",
    description: "Retrouvez les réponses sur le fonctionnement d’AutoCall.",
    href: "#faq",
  },
];

const CAPABILITIES = [
  {
    id: "support",
    title: "Accueil téléphonique 24/7",
    description:
      "Déployez des agents vocaux qui répondent en moins de 3 secondes, comprennent l’objet de l’appel et orientent chaque client.",
    agentTitle: "Sophie · Agent Accueil",
    userPrompt: "Bonjour, je souhaite déplacer mon rendez-vous de vendredi.",
    userTime: "09:42",
    step1: "Créneau identifié : Vendredi 14 h 30 avec Thomas.",
    step2: "Nouveau créneau confirmé pour Lundi 10 h 00 + SMS envoyé.",
  },
  {
    id: "qualification",
    title: "Qualification & Scoring B2B",
    description:
      "Posez les bonnes questions de cadrage, évaluez le budget et transférez uniquement les prospects qualifiés.",
    agentTitle: "Thomas · Agent Commercial",
    userPrompt: "Nous cherchons un prestataire pour 200 m² de bureaux.",
    userTime: "10:15",
    step1: "Critères extraits : 200 m², 3 passages/semaine, Lyon 3e.",
    step2: "Score prospect 92/100 · Transféré vers le commercial.",
  },
  {
    id: "calendar",
    title: "Prise de rendez-vous",
    description:
      "Consultez vos disponibilités Google Calendar en direct et bloquez le rendez-vous pendant la conversation.",
    agentTitle: "Lucas · Agent Planning",
    userPrompt: "Avez-vous une disponibilité mardi prochain matin ?",
    userTime: "11:08",
    step1: "Agenda vérifié : Mardi 10 h 30 disponible (secteur Nord).",
    step2: "Invitation Google Calendar envoyée à marc@entreprise.fr.",
  },
  {
    id: "multichannel",
    title: "Relances WhatsApp & E-mail",
    description:
      "Enchaînez automatiquement vos campagnes multicanales et reprenez la main en mode humain à tout moment.",
    agentTitle: "Emma · Agent Relance",
    userPrompt: "Pouvez-vous me renvoyer le devis comparatif ?",
    userTime: "14:20",
    step1: "Devis #2026-104 retrouvé dans le CRM et joint au fil.",
    step2: "Réponse envoyée sur WhatsApp Business + alerte conseiller.",
  },
  {
    id: "crm",
    title: "Transcriptions & CRM",
    description:
      "Associez automatiquement l’enregistrement audio, la transcription et le résumé IA à la fiche contact existante.",
    agentTitle: "Thomas · Sync CRM",
    userPrompt: "Résumé de l’appel entrant de Marc Dupont.",
    userTime: "16:05",
    step1: "Transcription complète et enregistrement RGPD archivés.",
    step2: "Fiche CRM mise à jour sans doublon · Tâche créée.",
  },
];

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "Que fait concrètement AutoCall pour mon entreprise ?",
    answer:
      "AutoCall déploie des agents vocaux IA qui décrochent vos appels en moins de 3 secondes 24/7, qualifient chaque prospect, réservent des rendez-vous dans votre agenda et synchronisent la transcription et le résumé IA dans votre CRM.",
  },
  {
    id: "faq-2",
    question: "AutoCall peut-il se connecter à nos outils existants ?",
    answer:
      "Oui. Vous connectez en quelques clics WhatsApp Business, Gmail, Outlook, Google Calendar, HubSpot, Salesforce, Stripe ainsi que vos réseaux sociaux ou webhooks API.",
  },
  {
    id: "faq-3",
    question: "Puis-je reprendre la main sur une conversation en cours ?",
    answer:
      "À tout moment. Sur WhatsApp et par e-mail, vous pouvez passer en mode reprise humaine depuis l’onglet Conversations. Pour les appels téléphoniques, le transfert vers un conseiller humain est géré en direct.",
  },
  {
    id: "faq-4",
    question: "Les enregistrements et données sont-ils conformes au RGPD ?",
    answer:
      "Oui. Les appels peuvent inclure une annonce légale automatique, la durée de conservation des enregistrements est configurable (30, 90 ou 180 jours) et toutes les données sont chiffrées.",
  },
  {
    id: "faq-5",
    question: "Faut-il des compétences techniques pour démarrer ?",
    answer:
      "Aucune. Vous choisissez un modèle d’agent, importez vos documents ou tarifs dans sa base de connaissances et lancez un test vocal en moins de 5 minutes.",
  },
];

const LANDING_PLANS = [
  {
    id: "starter",
    name: "Découverte",
    subtitle: "Pour démarrer gratuitement avec l’IA vocale",
    monthlyPrice: 0,
    limitLabel: "1 agent vocal IA · 100 min / mois",
    featured: false,
    cta: "Démarrer gratuitement",
    features: [
      "1 agent vocal IA",
      "100 minutes d’appels / mois",
      "CRM & fiches contacts",
      "Transcriptions & résumés IA",
      "Boîte de réception unifiée",
      "Export des données CSV",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    subtitle: "Tout pour développer votre activité",
    monthlyPrice: 49,
    limitLabel: "6 agents vocaux IA · 2 500 min / mois",
    featured: true,
    cta: "Démarrer avec Pro",
    features: [
      "Tout le forfait Découverte",
      "6 agents vocaux IA",
      "2 500 minutes d’appels / mois",
      "Campagnes Appels, WhatsApp & E-mail",
      "Sync Google Calendar & HubSpot",
      "Enregistrements audio RGPD (90 j)",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    subtitle: "Pour les équipes à fort volume",
    monthlyPrice: 129,
    limitLabel: "Agents illimités · 10 000 min / mois",
    featured: false,
    cta: "Passer à Scale",
    features: [
      "Tout le forfait Pro",
      "Agents vocaux IA illimités",
      "10 000 minutes d’appels / mois",
      "Support prioritaire dédié",
      "API REST & Webhooks temps réel",
      "Multi-équipes & permissions avancées",
    ],
  },
];

export function LandingView() {
  const [annual, setAnnual] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [activeCapId, setActiveCapId] = useState(CAPABILITIES[0].id);
  const [openFaqId, setOpenFaqId] = useState(FAQ_ITEMS[0].id);
  const resourcesRef = useRef<HTMLDivElement>(null);

  const activeCap =
    CAPABILITIES.find((c) => c.id === activeCapId) ?? CAPABILITIES[0];

  useEffect(() => {
    if (!resourcesOpen) return;
    function handleOutside(e: MouseEvent) {
      if (
        resourcesRef.current &&
        !resourcesRef.current.contains(e.target as Node)
      ) {
        setResourcesOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setResourcesOpen(false);
    }
    window.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [resourcesOpen]);

  const getPrice = (monthly: number) =>
    monthly === 0 ? 0 : annual ? Math.round(monthly * 0.8) : monthly;

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-x-clip bg-[#FAFBFB] text-[#171717]">
      {/* Fond orbital subtil & halo vert AutoCall (identique à la page de connexion) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 -right-32 size-[520px] rounded-full bg-[#00B489]/12 blur-[110px]" />
        <div className="absolute -bottom-40 -left-32 size-[460px] rounded-full bg-[#008F6D]/10 blur-[110px]" />
        <svg
          viewBox="0 0 1200 1200"
          className="absolute top-1/2 left-1/2 size-[1300px] -translate-x-1/2 -translate-y-1/2 opacity-75"
        >
          <circle cx="600" cy="600" r="220" fill="none" stroke="#E5EAE8" strokeWidth="1" />
          <circle cx="600" cy="600" r="320" fill="none" stroke="#E5EAE8" strokeWidth="1" />
          <circle cx="600" cy="600" r="430" fill="none" stroke="#E5EAE8" strokeWidth="1" />
          <circle cx="600" cy="600" r="550" fill="none" stroke="#E5EAE8" strokeWidth="1" />

          <g style={{ transformOrigin: "600px 600px" }} className="animate-[spin_28s_linear_infinite]">
            <circle
              cx="600"
              cy="600"
              r="220"
              fill="none"
              stroke="#00B489"
              strokeOpacity="0.45"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeDasharray="340 1050"
            />
          </g>
          <g
            style={{ transformOrigin: "600px 600px", animationDirection: "reverse" }}
            className="animate-[spin_42s_linear_infinite]"
          >
            <circle
              cx="600"
              cy="600"
              r="320"
              fill="none"
              stroke="#008F6D"
              strokeOpacity="0.38"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeDasharray="520 1500"
              transform="rotate(140 600 600)"
            />
          </g>
          <g style={{ transformOrigin: "600px 600px" }} className="animate-[spin_56s_linear_infinite]">
            <circle
              cx="600"
              cy="600"
              r="430"
              fill="none"
              stroke="#00B489"
              strokeOpacity="0.3"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="640 2070"
              transform="rotate(35 600 600)"
            />
          </g>
          <g
            style={{ transformOrigin: "600px 600px", animationDirection: "reverse" }}
            className="animate-[spin_72s_linear_infinite]"
          >
            <circle
              cx="600"
              cy="600"
              r="550"
              fill="none"
              stroke="#008F6D"
              strokeOpacity="0.24"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="780 2680"
              transform="rotate(-110 600 600)"
            />
          </g>
        </svg>
      </div>

      {/* Navigation supérieure fixe au scroll (Hauteur 76px desktop, 68px mobile, max-w 1240px) */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/70 bg-[#FAFBFB]/85 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center justify-between gap-2 px-4 sm:px-8 lg:h-[76px] lg:px-10">
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu de navigation"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#171717] transition hover:bg-gray-50 sm:size-10 md:hidden cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>
            <Link
              href="/landing"
              aria-label="AutoCall"
              className="inline-flex items-center gap-1 text-[17px] font-bold tracking-tight text-[#171717] sm:gap-2.5 sm:text-[19px]"
            >
              <svg
                viewBox="0 0 64 64"
                className="size-7 shrink-0 text-[#171717] sm:size-8.5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
              </svg>
              <span className="hidden min-[360px]:inline">AutoCall</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 text-[14px] font-medium text-[#525252] md:flex">
            <a href="#produit" className="transition hover:text-[#171717]">
              Produit
            </a>
            <a href="#tarifs" className="transition hover:text-[#171717]">
              Tarifs
            </a>
            <a href="#cas-usage" className="transition hover:text-[#171717]">
              Cas d’usage
            </a>

            <div
              ref={resourcesRef}
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setResourcesOpen((v) => !v)}
                aria-expanded={resourcesOpen}
                className="inline-flex items-center gap-1 py-1 transition hover:text-[#171717] cursor-pointer"
              >
                <span>Ressources</span>
                <svg
                  viewBox="0 0 24 24"
                  className={`size-4 transition-transform ${
                    resourcesOpen ? "rotate-180 text-[#171717]" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {resourcesOpen && (
                <div className="absolute top-full left-0 w-72 pt-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_14px_34px_rgba(17,24,39,0.10)]">
                    {RESOURCE_LINKS.map((item) => (
                      <a
                        key={item.id}
                        href={item.href}
                        onClick={() => setResourcesOpen(false)}
                        className="block rounded-xl px-3 py-2.5 transition hover:bg-gray-50"
                      >
                        <p className="text-[14px] font-semibold text-[#171717]">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-[13px] font-normal text-[#737373]">
                          {item.description}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <Link
              href="/login"
              className="inline-flex h-[42px] items-center whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2.5 text-[13px] font-semibold text-[#171717] shadow-2xs transition hover:bg-gray-50 sm:px-4 sm:text-[14px]"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-[42px] items-center whitespace-nowrap rounded-lg bg-[#171717] px-2.5 text-[13px] font-semibold text-white shadow-2xs transition hover:bg-[#2E2E2E] sm:px-4 sm:text-[14px]"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL EN BANDES ALTERNÉES */}
      <main className="relative z-10 flex w-full flex-1 flex-col">
        {/* BANDE 1 : HERO + APERÇU + PREUVE SOCIALE (fond #FAFBFB orbital) */}
        <div className="mkt-hero-accent relative isolate mx-auto flex w-full max-w-[1240px] flex-col items-center px-6 pt-20 pb-24 text-center sm:px-8 lg:px-10 lg:pt-24 lg:pb-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-text)]/15 bg-[var(--brand-soft)] px-3.5 py-1 text-[14px] font-medium text-[var(--brand-text)]">
            <span className="size-1.5 rounded-full bg-[var(--brand-primary)]" />
            Standard téléphonique &amp; prospection IA 24/7
          </span>

          <h1 className="mt-5 max-w-[760px] text-balance text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#171717] sm:text-[54px]">
            Ne manquez plus jamais un appel client.
          </h1>

          <p className="mt-6 max-w-[680px] text-pretty text-[18px] leading-[1.48] text-[#525252] sm:text-[19px]">
            Vos agents vocaux IA décrochent en moins de 3 secondes, qualifient
            chaque prospect à l’oral, réservent les rendez-vous et centralisent
            tout dans votre&nbsp;CRM.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/signup"
              className="inline-flex h-[46px] items-center rounded-xl bg-[var(--brand-text)] px-6 text-[14px] font-semibold text-white shadow-xs transition hover:bg-[var(--accent-action-pressed)]"
            >
              Créer un compte gratuit
            </Link>
            <Link
              href="/"
              className="inline-flex h-[46px] items-center rounded-xl border border-gray-200 bg-white px-6 text-[14px] font-semibold text-[#171717] shadow-2xs transition hover:bg-gray-50"
            >
              Voir le dashboard
            </Link>
          </div>

          {/* Aperçu en direct sobre sous le Hero */}
          <div
            id="produit"
            className="mt-14 w-full max-w-[680px] rounded-2xl border border-gray-200/90 bg-white/95 p-6 text-left shadow-[0_14px_38px_-10px_rgba(17,24,39,0.10)] backdrop-blur-xs sm:mt-16"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3.5">
                <Image
                  src="/avatars/agents/agent-1.jpg"
                  alt="Thomas — Agent IA"
                  width={44}
                  height={44}
                  className="size-11 rounded-xl border border-gray-200 object-cover object-top"
                />
                <div>
                  <p className="text-[15px] font-semibold text-gray-900">
                    Thomas · Agent commercial IA
                  </p>
                  <p className="mt-0.5 text-[14px] text-gray-500">
                    Appel entrant traité · 4 min 32 s
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[13.5px] font-medium text-[#047857]">
                <span className="size-1.5 rounded-full bg-[#10B981]" />
                RDV confirmé · Jeudi 14 h 30
              </span>
            </div>

            <p className="mt-4 text-[16px] leading-[25px] text-gray-700">
              « Marc Dupont souhaite un devis pour l’entretien de 200 m² de
              bureaux (3 passages par semaine). Fiche associée dans le CRM et
              invitation envoyée. »
            </p>
          </div>

          {/* BANDE PREUVE SOCIALE SOUS LA HERO SECTION */}
          <section
            aria-label="Entreprises utilisatrices et avis"
            className="mt-20 w-full text-left"
          >
            <div className="flex items-center gap-4">
              <p className="shrink-0 text-[14px] font-medium text-[#525252]">
                Connecté à vos outils et canaux du quotidien
              </p>
              <div className="h-px flex-1 bg-gray-200/80" />
            </div>

            <div className="mt-5 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              {/* Avatars empilés + note 4,9 */}
              <div className="flex shrink-0 items-center gap-3.5">
                <div className="flex -space-x-2.5">
                  {[
                    "/avatars/agents/agent-1.jpg",
                    "/avatars/agents/agent-2.jpg",
                    "/avatars/agents/agent-4.jpg",
                    "/avatars/agents/agent-6.jpg",
                  ].map((src, i) => (
                    <Image
                      key={src}
                      src={src}
                      alt={`Client AutoCall ${i + 1}`}
                      width={36}
                      height={36}
                      className="size-9 rounded-full border-2 border-white bg-gray-100 object-cover object-top shadow-2xs"
                    />
                  ))}
                  <span className="inline-flex size-9 items-center justify-center rounded-full border-2 border-white bg-[#171717] text-[12.5px] font-semibold text-white">
                    10k
                  </span>
                </div>

                <div className="h-7 w-px bg-gray-200" />

                <div>
                  <div className="flex items-center gap-0.5 text-[#F97316]">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <svg
                        key={star}
                        viewBox="0 0 24 24"
                        className="size-3.5"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-0.5 text-[14px] text-[#737373] tabular-nums">
                    4,9 / 5 Avis clients
                  </p>
                </div>
              </div>

              <div className="mkt-integration-marquee w-full min-w-0 md:flex-1">
                {[false, true].map((duplicate) => (
                  <ul
                    key={String(duplicate)}
                    aria-label={duplicate ? undefined : "Intégrations"}
                    aria-hidden={duplicate || undefined}
                    className="mkt-integration-marquee-group text-[#262626]"
                  >
                    {HERO_INTEGRATIONS.map(({ name, Icon }) => (
                      <li key={name} className="inline-flex shrink-0 items-center gap-2.5 text-[15.5px] font-semibold whitespace-nowrap tracking-tight">
                        <Icon className="size-7 shrink-0" />
                        {name}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* BANDE 2 : CAPACITÉS / CAS D'USAGE (fond blanc pur) */}
        <section
          id="cas-usage"
          className="w-full scroll-mt-20 border-y border-gray-200/70 bg-white py-20 lg:py-24"
        >
          <div className="mx-auto w-full max-w-[1240px] px-6 text-left sm:px-8 lg:px-10">
            <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1 text-[13px] font-medium text-[#525252] shadow-2xs">
              <span className="h-1.5 w-3 rounded-full bg-[#00B489]" />
              Capacités
            </span>

            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#171717] sm:text-[38px] lg:col-span-7">
                Des agents IA conçus pour chaque{" "}
                <span className="text-[#8C8C8C]">
                  workflow de votre entreprise
                </span>
              </h2>

              <p className="text-[16px] leading-[24px] text-[#6B7280] lg:col-span-5">
                Déployez des agents vocaux spécialisés qui coordonnent vos appels,
                automatisent vos suivis clients et connectent votre CRM à travers
                une couche d’orchestration unifiée.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              {/* Liste verticale à gauche (5 workflows) */}
              <div className="space-y-2 lg:col-span-5">
                {CAPABILITIES.map((cap) => {
                  const isActive = cap.id === activeCap.id;
                  return (
                    <button
                      key={cap.id}
                      type="button"
                      onClick={() => setActiveCapId(cap.id)}
                      className={`w-full rounded-2xl px-5 py-4 text-left transition cursor-pointer ${
                        isActive
                          ? "bg-white shadow-xs ring-1 ring-gray-200/90"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`mt-1.5 h-5 w-0.5 shrink-0 rounded-full transition-colors ${
                            isActive ? "bg-[#00B489]" : "bg-gray-300"
                          }`}
                        />
                        <div>
                          <p
                            className={`text-[18px] font-semibold tracking-tight ${
                              isActive ? "text-[#171717]" : "text-[#525252]"
                            }`}
                          >
                            {cap.title}
                          </p>
                          {isActive && (
                            <p className="mt-1.5 text-[16px] leading-[24px] text-[#737373]">
                              {cap.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Aperçu visuel interactif à droite */}
              <div className="lg:col-span-7">
                <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-gradient-to-br from-[#BAE6FD] via-[#D1FAE5] to-[#A7F3D0] p-5 shadow-[0_18px_45px_-12px_rgba(17,24,39,0.12)] sm:p-7">
                  <div className="rounded-2xl border border-white/80 bg-white/95 p-5 shadow-lg backdrop-blur-xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-[#008F6D]">
                          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                            <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <div>
                          <p className="text-[14.5px] font-semibold text-[#171717]">
                            Agent IA
                          </p>
                          <p className="flex items-center gap-1.5 text-[13px] text-[#737373]">
                            <span>{activeCap.agentTitle}</span>
                            <span className="size-1.5 rounded-full bg-[#10B981]" />
                          </p>
                        </div>
                      </div>
                      <span className="text-[16px] tracking-widest text-gray-400">
                        ···
                      </span>
                    </div>

                    {/* Message prospect */}
                    <div className="mt-4 flex items-start justify-end gap-2.5">
                      <div className="max-w-[78%] rounded-2xl rounded-tr-xs bg-[#008F6D] px-3.5 py-2.5 text-[14px] text-white shadow-2xs">
                        <p className="leading-snug">{activeCap.userPrompt}</p>
                        <p className="mt-1 text-[12.5px] text-white/75 tabular-nums">
                          {activeCap.userTime}
                        </p>
                      </div>
                      <Image
                        src="/avatars/agents/agent-1.jpg"
                        alt="Prospect"
                        width={32}
                        height={32}
                        className="size-8 shrink-0 rounded-full border border-white object-cover object-top shadow-2xs"
                      />
                    </div>

                    {/* Actions automatiques IA */}
                    <div className="mt-3.5 space-y-2.5">
                      {[activeCap.step1, activeCap.step2].map((step) => (
                        <div key={step} className="flex items-start gap-2.5">
                          <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-[#008F6D]">
                            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                              <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <div className="flex-1 rounded-xl border border-gray-200/90 bg-white px-3.5 py-2.5 text-[14px] text-[#171717] shadow-2xs">
                            <p>{step}</p>
                            <p className="mt-1 text-[12.5px] text-[#8C8C8C] tabular-nums">
                              {activeCap.userTime}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Barre de commande */}
                    <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-2 text-[14px] text-gray-400">
                      <span>Posez une question ou lancez une action...</span>
                      <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[#008F6D] text-white">
                        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BANDE 3 : BÉNÉFICES (fond gris/émeraude doux #F4F6F5) */}
        <section
          id="benefices"
          className="w-full scroll-mt-20 bg-[#F4F6F5] py-20 lg:py-24"
        >
          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1 text-[13px] font-medium text-[#525252] shadow-2xs">
                <span className="h-1.5 w-3 rounded-full bg-[#00B489]" />
                Bénéfices
              </span>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#171717] sm:text-[38px]">
                Des résultats qui s’amplifient{" "}
                <span className="block text-[#8C8C8C]">
                  sur chaque échange client
                </span>
              </h2>

              <p className="mt-4 text-[16px] leading-[24px] text-[#6B7280]">
                Réduisez les tâches manuelles, accélérez vos réponses et offrez
                à chaque équipe un suivi commercial automatisé.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Carte 1 : Répondre instantanément */}
              <article className="flex flex-col justify-between">
                <div>
                  <h3 className="text-[22px] font-semibold tracking-tight text-[#171717]">
                    Répondez instantanément
                  </h3>
                  <p className="mt-2 text-[16px] leading-[24px] text-[#6B7280]">
                    Passez de plusieurs heures d’attente à quelques secondes
                    grâce à vos agents vocaux et WhatsApp IA.
                  </p>
                </div>

                <div className="mt-5 overflow-hidden rounded-3xl border border-gray-200/80 bg-gradient-to-br from-[#BAE6FD] via-[#D1FAE5] to-[#A7F3D0] p-4 shadow-sm">
                  <div className="space-y-2.5 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-md backdrop-blur-xs">
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-200/80 bg-white p-3">
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-[#171717]">
                          Demande client
                        </p>
                        <p className="mt-0.5 truncate text-[13px] text-[#6B7280]">
                          Devis nettoyage bureaux 200 m²
                        </p>
                        <p className="mt-1 text-[12px] text-[#8C8C8C]">
                          Reçu · 10:42
                        </p>
                      </div>
                      <Image
                        src="/avatars/agents/agent-4.jpg"
                        alt="Cliente"
                        width={36}
                        height={36}
                        className="size-9 shrink-0 rounded-full border border-gray-200 object-cover object-top"
                      />
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-gray-200/80 bg-white p-3">
                      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#DEF5EC] text-[#008064]">
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                          <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-[#171717]">
                          Agent IA Thomas
                        </p>
                        <p className="truncate text-[13px] text-[#6B7280]">
                          Qualification &amp; vérification agenda...
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-3">
                      <div>
                        <p className="text-[13.5px] font-semibold text-[#065F46]">
                          RDV confirmé
                        </p>
                        <p className="text-[12.5px] text-[#047857]">
                          Traité en 12 sec
                        </p>
                      </div>
                      <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#10B981] text-white">
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true">
                          <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </article>

              {/* Carte 2 : Supprimer les tâches répétitives */}
              <article className="flex flex-col justify-between">
                <div>
                  <h3 className="text-[22px] font-semibold tracking-tight text-[#171717]">
                    Supprimez les tâches répétitives
                  </h3>
                  <p className="mt-2 text-[16px] leading-[24px] text-[#6B7280]">
                    Automatisez les comptes rendus, la mise à jour du CRM et
                    l’envoi des devis sans ressaisie manuelle.
                  </p>
                </div>

                <div className="mt-5 overflow-hidden rounded-3xl border border-gray-200/80 bg-gradient-to-br from-[#BAE6FD] via-[#D1FAE5] to-[#A7F3D0] p-4 shadow-sm">
                  <div className="space-y-3 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-md backdrop-blur-xs">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Envoi e-mail",
                        "Devis PDF",
                        "Sync CRM",
                        "Résumé IA",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-xl border border-gray-200/80 bg-white px-3 py-2.5 text-[13px] font-medium text-[#171717]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center py-0.5">
                      <span className="inline-flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-[#008F6D] shadow-xs">
                        <svg viewBox="0 0 64 64" className="size-5" fill="currentColor" aria-hidden="true">
                          <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
                        </svg>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-200/80 bg-white p-3">
                      <div>
                        <p className="text-[13.5px] font-semibold text-[#171717]">
                          Workflow terminé
                        </p>
                        <p className="text-[12.5px] text-[#6B7280]">
                          Toutes les fiches synchronisées
                        </p>
                      </div>
                      <span className="text-right text-[13.5px] font-bold text-[#008F6D] tabular-nums">
                        24 tâches
                      </span>
                    </div>
                  </div>
                </div>
              </article>

              {/* Carte 3 : Visibilité totale */}
              <article className="flex flex-col justify-between">
                <div>
                  <h3 className="text-[22px] font-semibold tracking-tight text-[#171717]">
                    Pilotez avec une visibilité totale
                  </h3>
                  <p className="mt-2 text-[16px] leading-[24px] text-[#6B7280]">
                    Suivez vos appels, conversations WhatsApp, opportunités et
                    conversions en temps réel depuis un seul espace.
                  </p>
                </div>

                <div className="mt-5 overflow-hidden rounded-3xl border border-gray-200/80 bg-gradient-to-br from-[#BAE6FD] via-[#D1FAE5] to-[#A7F3D0] p-4 shadow-sm">
                  <div className="space-y-3 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-md backdrop-blur-xs">
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div className="rounded-xl border border-gray-200/80 bg-white p-2">
                        <WhatsAppBrandSvg className="mx-auto size-5" />
                        <p className="mt-1 text-[12px] font-medium text-[#171717]">
                          WhatsApp
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-200/80 bg-white p-2">
                        <GmailBrandSvg className="mx-auto size-5" />
                        <p className="mt-1 text-[12px] font-medium text-[#171717]">
                          E-mails
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-200/80 bg-white p-2">
                        <svg viewBox="0 0 24 24" className="mx-auto size-5 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-1 text-[12px] font-medium text-[#171717]">
                          Appels
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-200/80 bg-white p-2">
                        <svg viewBox="0 0 24 24" className="mx-auto size-5 text-[#008F6D]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" />
                        </svg>
                        <p className="mt-1 text-[12px] font-medium text-[#171717]">
                          CRM
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center py-0.5">
                      <span className="inline-flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-[#008F6D] shadow-xs">
                        <svg viewBox="0 0 64 64" className="size-5" fill="currentColor" aria-hidden="true">
                          <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
                        </svg>
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-gray-50/70 p-3">
                      <div>
                        <p className="text-[13.5px] font-semibold text-[#171717]">
                          Centre de pilotage unifié
                        </p>
                        <p className="text-[12.5px] text-[#6B7280]">
                          Toutes vos opérations en direct
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#008F6D]">
                        <span className="size-1.5 rounded-full bg-[#10B981]" />
                        Actif
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* BANDE 4 : ORCHESTRATION BENTO (fond blanc pur) */}
        <section className="w-full border-y border-gray-200/70 bg-white py-20 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Colonne gauche : 2 cartes empilées */}
              <div className="flex flex-col gap-4 lg:col-span-3">
                <article className="flex flex-1 flex-col justify-center rounded-2xl border border-gray-200/80 bg-[#FAFBFB] p-6 text-left">
                  <p className="text-[12.5px] font-semibold tracking-wide text-[#008F6D]">
                    Service client IA
                  </p>
                  <h3 className="mt-2 text-[19px] font-semibold leading-snug text-[#171717]">
                    Support client propulsé par l’IA
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#6B7280]">
                    Répondez aux appels, qualifiez les demandes et informez vos
                    clients automatiquement sur chaque canal.
                  </p>
                </article>

                <article className="flex flex-1 flex-col justify-center rounded-2xl border border-gray-200/80 bg-[#F4F6F5] p-6 text-left">
                  <p className="text-[12.5px] font-semibold tracking-wide text-[#008F6D]">
                    Base de connaissances
                  </p>
                  <h3 className="mt-2 text-[19px] font-semibold leading-snug text-[#171717]">
                    Votre savoir métier actionnable
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#6B7280]">
                    Transformez vos tarifs, scripts et procédures internes en
                    réponses fiables pour chaque agent IA.
                  </p>
                </article>
              </div>

              {/* Colonne centrale : Carte visuelle d'orchestration */}
              <div className="lg:col-span-6">
                <div className="flex h-full items-center justify-center overflow-hidden rounded-3xl border border-gray-200/80 bg-gradient-to-br from-[#BAE6FD] via-[#D1FAE5] to-[#A7F3D0] p-5 shadow-sm sm:p-7">
                  <div className="w-full space-y-4 rounded-2xl border border-white/85 bg-white/95 p-5 shadow-md backdrop-blur-xs">
                    {/* Ligne du haut : 4 actions */}
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
                      <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[14px] font-medium text-[#171717]">
                        <GmailBrandSvg className="size-4.5 shrink-0" />
                        <span>Envoi e-mail</span>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[14px] font-medium text-[#171717]">
                        <svg viewBox="0 0 24 24" className="size-4.5 shrink-0 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                          <path d="M14 3v5h5" />
                        </svg>
                        <span>Devis PDF</span>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[14px] font-medium text-[#171717]">
                        <svg viewBox="0 0 24 24" className="size-4.5 shrink-0 text-[#008F6D]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" />
                        </svg>
                        <span>Mise à jour CRM</span>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[14px] font-medium text-[#171717]">
                        <svg viewBox="0 0 24 24" className="size-4.5 shrink-0 text-[#D97706]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                          <path d="M4 6h16M4 12h10M4 18h14" strokeLinecap="round" />
                        </svg>
                        <span>Résumé IA</span>
                      </div>
                    </div>

                    {/* Étape intermédiaire + Noeud central AutoCall */}
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2 text-[13.5px] font-medium text-[#525252]">
                        <svg viewBox="0 0 24 24" className="size-4 text-[#525252]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9ZM13.7 21a2 2 0 0 1-3.4 0" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Notifier l’équipe</span>
                      </div>

                      <span className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#008F6D] shadow-xs">
                        <svg viewBox="0 0 64 64" className="size-6" fill="currentColor" aria-hidden="true">
                          <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
                        </svg>
                      </span>
                    </div>

                    {/* Ligne du bas : 4 canaux connectés */}
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center">
                        <WhatsAppBrandSvg className="mx-auto size-5" />
                        <p className="mt-1.5 text-[13px] font-semibold text-[#171717]">
                          WhatsApp
                        </p>
                        <p className="mt-0.5 text-[12px] text-[#008F6D]">
                          ● En direct
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center">
                        <GmailBrandSvg className="mx-auto size-5" />
                        <p className="mt-1.5 text-[13px] font-semibold text-[#171717]">
                          E-mails
                        </p>
                        <p className="mt-0.5 text-[12px] text-[#008F6D]">
                          ● En direct
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center">
                        <svg viewBox="0 0 24 24" className="mx-auto size-5 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-1.5 text-[13px] font-semibold text-[#171717]">
                          Appels
                        </p>
                        <p className="mt-0.5 text-[12px] text-[#008F6D]">
                          ● En direct
                        </p>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center">
                        <svg viewBox="0 0 24 24" className="mx-auto size-5 text-[#7C3AED]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                          <rect x="3" y="5" width="18" height="16" rx="2" />
                          <path d="M16 3v4M8 3v4M3 10h18" strokeLinecap="round" />
                        </svg>
                        <p className="mt-1.5 text-[13px] font-semibold text-[#171717]">
                          Agenda
                        </p>
                        <p className="mt-0.5 text-[12px] text-[#008F6D]">
                          ● En direct
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite : 2 cartes empilées */}
              <div className="flex flex-col gap-4 lg:col-span-3">
                <article className="flex flex-1 flex-col justify-center rounded-2xl border border-gray-200/80 bg-[#FAFBFB] p-6 text-left">
                  <p className="text-[12.5px] font-semibold tracking-wide text-[#008F6D]">
                    Automatisation
                  </p>
                  <h3 className="mt-2 text-[19px] font-semibold leading-snug text-[#171717]">
                    Workflows de bout en bout
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#6B7280]">
                    Coordonnez appels, relances et rendez-vous sans ressaisie
                    manuelle ni goulot d’étranglement.
                  </p>
                </article>

                <article className="flex flex-1 flex-col justify-center rounded-2xl border border-gray-200/80 bg-[#F4F6F5] p-6 text-left">
                  <p className="text-[12.5px] font-semibold tracking-wide text-[#008F6D]">
                    Facturation &amp; Suivi
                  </p>
                  <h3 className="mt-2 text-[19px] font-semibold leading-snug text-[#171717]">
                    Devis et encaissements fluides
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#6B7280]">
                    Automatisez la création de devis, l’envoi des factures et le
                    suivi commercial en toute visibilité.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* BANDE 5 : INTÉGRATIONS NATIVES (grille sur fond #F4F6F5) */}
        <section
          id="integrations"
          className="w-full scroll-mt-20 bg-[#F4F6F5] py-20 lg:py-24"
        >
          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1 text-[13px] font-medium text-[#525252] shadow-2xs">
                <span className="h-1.5 w-3 rounded-full bg-[#00B489]" />
                Intégrations
              </span>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#171717] sm:text-[38px]">
                Connecté nativement{" "}
                <span className="block text-[#8C8C8C]">
                  à vos outils du quotidien
                </span>
              </h2>

              <p className="mt-4 text-[16px] leading-[24px] text-[#6B7280]">
                Synchronisez vos appels, messages, agendas et fiches clients en
                un clic avec vos applications existantes.
              </p>
            </div>

            {/* Hub central AutoCall animé sur son orbite */}
            <div className="relative mx-auto mt-10 flex h-32 max-w-2xl items-center justify-center">
              <svg
                viewBox="0 0 640 120"
                className="pointer-events-none absolute inset-x-0 top-3 h-24 w-full text-gray-300/80"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M20 96 Q320 6 620 96"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>

              <div className="autocall-hub-float relative flex size-[68px] items-center justify-center">
                <span
                  aria-hidden="true"
                  className="autocall-hub-ripple pointer-events-none absolute inset-0 rounded-[22px] border-2 border-[#00B489]/60 bg-[#00B489]/15"
                />
                <span
                  aria-hidden="true"
                  className="autocall-hub-ripple-delay pointer-events-none absolute inset-0 rounded-[22px] border-2 border-[#00B489]/40 bg-[#00B489]/10"
                />
                <div
                  className="relative flex size-[68px] items-center justify-center rounded-[22px] bg-gradient-to-br from-[#00B489] to-[#008F6D] text-white shadow-[0_16px_34px_-10px_rgba(0,143,109,0.55)] ring-1 ring-white/30"
                  title="AutoCall Hub"
                >
                  <svg viewBox="0 0 64 64" className="autocall-mark-spin size-9" fill="currentColor" aria-hidden="true">
                    <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <WhatsAppBrandSvg className="size-7 shrink-0" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  WhatsApp
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <GmailBrandSvg className="size-7 shrink-0" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  Gmail
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <OutlookBrandSvg className="size-7 shrink-0" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  Outlook
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <FacebookBrandSvg className="size-7 shrink-0" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  Facebook
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <InstagramBrandSvg className="size-7 shrink-0 rounded-md" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  Instagram
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <LinkedInBrandSvg className="size-7 shrink-0" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  LinkedIn
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <GoogleCalendarBrandSvg className="size-7 shrink-0" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  Google Agenda
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <HubSpotBrandSvg className="size-7 shrink-0" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  HubSpot
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <ZoomBrandSvg className="size-7 shrink-0" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  Zoom
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <GoogleMeetBrandSvg className="h-6 w-auto shrink-0" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  Google Meet
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <MicrosoftTeamsBrandSvg className="size-7 shrink-0" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  Teams
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-5 shadow-2xs">
                <GoogleAdsBrandSvg className="size-7 shrink-0" />
                <span className="text-[15.5px] font-semibold text-[#171717]">
                  Google Drive
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* BANDE 5.5 : COMPARATIF "UN SEUL ESPACE DE TRAVAIL" (Pourquoi multiplier les outils ?) */}
        <section
          id="comparatif"
          className="w-full scroll-mt-20 border-t border-gray-200/70 bg-white py-20 lg:py-24"
        >
          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1 text-[13px] font-medium text-[#525252] shadow-2xs">
                <span className="h-1.5 w-3 rounded-full bg-[#00B489]" />
                Un seul espace de travail
              </span>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#171717] sm:text-[38px]">
                Pourquoi multiplier{" "}
                <span className="text-[#8C8C8C]">les outils ?</span>
              </h2>

              <p className="mt-4 text-[16px] leading-[24px] text-[#6B7280]">
                Retrouvez vos fonctionnalités commerciales essentielles dans une
                seule plateforme unifiée, sans empiler les abonnements.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-[0_14px_38px_-10px_rgba(17,24,39,0.08)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#FAFBFB]">
                      <th className="w-[26%] px-6 py-5 text-[15px] font-semibold text-[#171717]">
                        Fonctionnalités
                      </th>

                      {/* AutoCall */}
                      <th className="w-[14%] px-3 py-5 text-center">
                        <div className="inline-flex flex-col items-center gap-1.5">
                          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00B489] to-[#008F6D] text-white shadow-xs">
                            <svg
                              viewBox="0 0 64 64"
                              className="size-5.5"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
                            </svg>
                          </span>
                          <span className="text-[14px] font-bold text-[#008F6D]">
                            AutoCall
                          </span>
                        </div>
                      </th>

                      {/* Aircall */}
                      <th className="w-[12%] px-3 py-5 text-center">
                        <div className="inline-flex flex-col items-center gap-1.5">
                          <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-b from-[#2AD184] to-[#00965E] text-white shadow-2xs">
                            <svg
                              viewBox="0 0 100 100"
                              className="size-6"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M40.5 24.5C42.2 21.6 45.4 20.5 50 20.5C54.6 20.5 57.8 21.6 59.5 24.5C65.2 34.4 73.6 54.8 77.2 71.2C77.9 74.5 76.2 76.8 73.1 77.4L63.8 78.8C62.6 79 61.9 78.4 61.5 77.2C59.8 72.4 55.8 70.2 50 70.2C44.2 70.2 40.2 72.4 38.5 77.2C38.1 78.4 37.4 79 36.2 78.8L26.9 77.4C23.8 76.8 22.1 74.5 22.8 71.2C26.4 54.8 34.8 34.4 40.5 24.5Z" />
                            </svg>
                          </span>
                          <span className="text-[13.5px] font-medium text-[#525252]">
                            Aircall
                          </span>
                        </div>
                      </th>

                      {/* Retell */}
                      <th className="w-[12%] px-3 py-5 text-center">
                        <div className="inline-flex flex-col items-center gap-1.5">
                          <span className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#171717] shadow-2xs">
                            <svg
                              viewBox="0 0 24 24"
                              className="size-5"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <circle cx="12" cy="5.5" r="1.4" />
                              <circle cx="16.6" cy="7.4" r="1.4" />
                              <circle cx="18.5" cy="12" r="1.4" />
                              <circle cx="16.6" cy="16.6" r="1.4" />
                              <circle cx="12" cy="18.5" r="1.4" />
                              <circle cx="7.4" cy="16.6" r="1.4" />
                              <circle cx="5.5" cy="12" r="1.4" />
                              <circle cx="7.4" cy="7.4" r="1.4" />
                            </svg>
                          </span>
                          <span className="text-[13.5px] font-medium text-[#525252]">
                            Retell
                          </span>
                        </div>
                      </th>

                      {/* Mantiks */}
                      <th className="w-[12%] px-3 py-5 text-center">
                        <div className="inline-flex flex-col items-center gap-1.5">
                          <span className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#5347E8] shadow-2xs">
                            <svg
                              viewBox="0 0 100 100"
                              className="size-5.5"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M11 88V12H22.5L44.8 52.6L39.2 61.5L21.5 29.4V88H11Z" />
                              <path d="M44.6 70.8L77.5 12H89V88H78.5V29.4L53.2 74.6H46.8L44.6 70.8Z" />
                            </svg>
                          </span>
                          <span className="text-[13.5px] font-medium text-[#525252]">
                            Mantiks
                          </span>
                        </div>
                      </th>

                      {/* HighLevel */}
                      <th className="w-[12%] px-3 py-5 text-center">
                        <div className="inline-flex flex-col items-center gap-1.5">
                          <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#111827] text-white shadow-2xs">
                            <svg
                              viewBox="0 0 24 24"
                              className="size-5"
                              fill="none"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M8 17V9m0 0-2 2m2-2 2 2" stroke="#F59E0B" />
                              <path d="M12 17V7m0 0-2 2m2-2 2 2" stroke="#10B981" />
                              <path d="M16 17v-6m0 0-2 2m2-2 2 2" stroke="#3B82F6" />
                            </svg>
                          </span>
                          <span className="text-[13.5px] font-medium text-[#525252]">
                            HighLevel
                          </span>
                        </div>
                      </th>

                      {/* Limova */}
                      <th className="w-[12%] px-3 py-5 text-center">
                        <div className="inline-flex flex-col items-center gap-1.5">
                          <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#171412] shadow-2xs">
                            <svg
                              viewBox="0 0 64 64"
                              className="size-5.5"
                              fill="none"
                              aria-hidden="true"
                            >
                              <defs>
                                <linearGradient
                                  id="limova-vert"
                                  x1="21"
                                  y1="10"
                                  x2="21"
                                  y2="43"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop offset="0%" stopColor="#DEC918" />
                                  <stop offset="100%" stopColor="#EC671A" />
                                </linearGradient>
                                <linearGradient
                                  id="limova-horiz"
                                  x1="15"
                                  y1="40"
                                  x2="51"
                                  y2="52"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop offset="0%" stopColor="#DEC918" />
                                  <stop offset="100%" stopColor="#EC671A" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M15 10C22.2 10 27 14.8 27 22V43C19.8 43 15 37.8 15 30.5V10Z"
                                fill="url(#limova-vert)"
                              />
                              <path
                                d="M15 34.5C15 41.2 20.4 43 27 43H39C46.2 43 51 47.4 51 54H27.5C19.6 54 15 49.2 15 41.5V34.5Z"
                                fill="url(#limova-horiz)"
                              />
                            </svg>
                          </span>
                          <span className="text-[13.5px] font-medium text-[#525252]">
                            Limova
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 text-[14.5px]">
                    {(
                      [
                        {
                          label: "Agents vocaux IA",
                          autocall: true,
                          aircall: true,
                          retell: true,
                          mantiks: false,
                          highlevel: true,
                          limova: true,
                        },
                        {
                          label: "Appels entrants",
                          autocall: true,
                          aircall: true,
                          retell: true,
                          mantiks: false,
                          highlevel: true,
                          limova: true,
                        },
                        {
                          label: "Appels sortants",
                          autocall: true,
                          aircall: true,
                          retell: true,
                          mantiks: false,
                          highlevel: true,
                          limova: false,
                        },
                        {
                          label: "CRM natif",
                          autocall: true,
                          aircall: false,
                          retell: false,
                          mantiks: false,
                          highlevel: true,
                          limova: false,
                        },
                        {
                          label: "Recherche de prospects",
                          autocall: true,
                          aircall: false,
                          retell: false,
                          mantiks: true,
                          highlevel: false,
                          limova: false,
                        },
                        {
                          label: "Signaux de recrutement",
                          autocall: true,
                          aircall: false,
                          retell: false,
                          mantiks: true,
                          highlevel: false,
                          limova: false,
                        },
                        {
                          label: "Campagnes email",
                          autocall: true,
                          aircall: false,
                          retell: false,
                          mantiks: false,
                          highlevel: true,
                          limova: false,
                        },
                        {
                          label: "WhatsApp",
                          autocall: true,
                          aircall: true,
                          retell: false,
                          mantiks: false,
                          highlevel: true,
                          limova: true,
                        },
                        {
                          label: "Prise de rendez-vous",
                          autocall: true,
                          aircall: true,
                          retell: true,
                          mantiks: false,
                          highlevel: true,
                          limova: true,
                        },
                        {
                          label: "Réseaux sociaux",
                          autocall: true,
                          aircall: false,
                          retell: false,
                          mantiks: false,
                          highlevel: true,
                          limova: true,
                        },
                        {
                          label: "Automatisations",
                          autocall: true,
                          aircall: true,
                          retell: true,
                          mantiks: false,
                          highlevel: true,
                          limova: true,
                        },
                      ] as const
                    ).map((row) => (
                      <tr
                        key={row.label}
                        className="transition-colors hover:bg-gray-50/50"
                      >
                        <td className="px-6 py-3.5 font-medium text-[#171717]">
                          {row.label}
                        </td>

                        {/* Colonne AutoCall mise en avant avec pilule vert tendre */}
                        <td className="px-3 py-2.5 text-center">
                          <span className="mx-auto inline-flex h-9 w-24 items-center justify-center rounded-xl bg-[#E6F5F0] text-[#008F6D]">
                            <svg
                              viewBox="0 0 24 24"
                              className="size-4.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="m5 12 4.5 4.5L19 7" />
                            </svg>
                          </span>
                        </td>

                        {(
                          [
                            row.aircall,
                            row.retell,
                            row.mantiks,
                            row.highlevel,
                            row.limova,
                          ] as const
                        ).map((supported, idx) => (
                          <td key={idx} className="px-3 py-3.5 text-center">
                            {supported ? (
                              <svg
                                viewBox="0 0 24 24"
                                className="mx-auto size-4.5 text-[#008F6D]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="m5 12 4.5 4.5L19 7" />
                              </svg>
                            ) : (
                              <span
                                className="mx-auto inline-flex size-6 items-center justify-center rounded-full bg-red-50 text-red-500"
                                aria-label="Non inclus"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  className="size-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* BANDE 6 : TARIFS (fond blanc pur pour alterner) */}
        <section
          id="tarifs"
          className="w-full scroll-mt-20 border-y border-gray-200/70 bg-white py-20 lg:py-24"
        >
          <div className="mx-auto w-full max-w-[1240px] px-6 text-left sm:px-8 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1 text-[13px] font-medium text-[#525252] shadow-2xs">
                <span className="h-1.5 w-3 rounded-full bg-[#00B489]" />
                Tarifs
              </span>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#171717] sm:text-[38px]">
                Des tarifs simples pour chaque{" "}
                <span className="block text-[#8C8C8C]">
                  étape de votre automatisation
                </span>
              </h2>

              <p className="mt-4 text-[16px] leading-[24px] text-[#6B7280]">
                Démarrez avec un premier agent vocal IA et évoluez vers une
                orchestration complète à mesure que votre activité grandit.
              </p>

              <div className="mt-6 flex items-center justify-center gap-2.5 text-[14px]">
                <button
                  type="button"
                  onClick={() => setAnnual(false)}
                  className={`cursor-pointer ${
                    !annual ? "font-semibold text-[#171717]" : "text-[#737373]"
                  }`}
                >
                  Mensuel
                </button>
                <button
                  type="button"
                  role="switch"
                  aria-checked={annual}
                  aria-label="Basculer en facturation annuelle"
                  onClick={() => setAnnual((v) => !v)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                    annual ? "bg-[#00B489]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block size-3.5 rounded-full bg-white transition-transform ${
                      annual ? "translate-x-4.5" : "translate-x-1"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setAnnual(true)}
                  className={`cursor-pointer ${
                    annual ? "font-semibold text-[#171717]" : "text-[#737373]"
                  }`}
                >
                  Annuel
                </button>
                <span className="rounded-md bg-[#DEF5EC] px-2 py-0.5 text-[13px] font-semibold text-[#008064]">
                  -20 %
                </span>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
              {LANDING_PLANS.map((plan) => (
                <article
                  key={plan.id}
                  className={`flex flex-col justify-between rounded-3xl border p-6 ${
                    plan.featured
                      ? "border-[#BAE6FD] bg-gradient-to-b from-[#E0F2FE]/80 via-[#ECFDF5]/60 to-white shadow-[0_14px_38px_-10px_rgba(17,24,39,0.10)]"
                      : "border-gray-200 bg-white shadow-2xs"
                  }`}
                >
                  <div>
                    <div className="rounded-2xl border border-gray-200/80 bg-white/85 p-5 backdrop-blur-xs">
                      <p className="text-[15px] font-semibold tracking-wide text-[#171717]">
                        {plan.name}
                      </p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-[#6B7280]">
                        {plan.subtitle}
                      </p>

                      <div className="mt-5 flex items-baseline gap-1.5">
                        <span className="text-[38px] font-bold tracking-tight text-[#171717] tabular-nums">
                          {getPrice(plan.monthlyPrice)} €
                        </span>
                        <span className="text-[14px] text-[#737373]">
                          / mois
                        </span>
                      </div>
                      <p className="mt-1 text-[13.5px] text-[#6B7280]">
                        {plan.limitLabel}
                      </p>
                    </div>

                    <p className="mt-6 text-[14px] font-semibold text-[#171717]">
                      Ce qui est inclus :
                    </p>

                    <ul className="mt-3.5 space-y-2.5 text-[14px] text-[#525252]">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2.5">
                          <svg
                            viewBox="0 0 24 24"
                            className={`size-4 shrink-0 ${
                              plan.featured
                                ? "text-[#008F6D]"
                                : "text-[#737373]"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.9"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path
                              d="m8.5 12 2.3 2.3 4.7-4.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/signup"
                    className={`mt-7 inline-flex h-[46px] w-full items-center justify-center rounded-full text-[14px] font-semibold transition ${
                      plan.featured
                        ? "bg-[#171717] text-white shadow-xs hover:bg-[#2E2E2E]"
                        : "border border-gray-200 bg-white text-[#171717] hover:bg-gray-50"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>

            <p className="mt-8 text-center text-[14px] text-[#6B7280]">
              Options disponibles : Pack +1 000 minutes vocales IA (29 €) · Numéro local dédié supplémentaire (9 € / mois) · Déploiement sur mesure sur demande.
            </p>
          </div>
        </section>

        {/* BANDE 7 : FAQ (fond #F4F6F5 pour alterner avec Tarifs blanc et Footer blanc) */}
        <section
          id="faq"
          className="w-full scroll-mt-20 bg-[#F4F6F5] py-20 lg:py-24"
        >
          <div className="mx-auto w-full max-w-[1240px] px-6 text-left sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1 text-[13px] font-medium text-[#525252] shadow-2xs">
                  <span className="h-1.5 w-3 rounded-full bg-[#00B489]" />
                  FAQ
                </span>

                <h2 className="mt-4 text-[32px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#171717] sm:text-[38px]">
                  Tout ce que vous devez savoir sur{" "}
                  <span className="text-[#8C8C8C]">l’automatisation IA</span>
                </h2>

                <p className="mt-4 text-[16px] leading-[24px] text-[#6B7280]">
                  Découvrez comment AutoCall aide vos équipes à automatiser
                  leurs appels, suivre chaque conversation et scaler en toute
                  confiance.
                </p>
              </div>

              <div className="space-y-3 lg:col-span-7">
                {FAQ_ITEMS.map((item) => {
                  const isOpen = openFaqId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border transition ${
                        isOpen
                          ? "border-gray-200 bg-white shadow-2xs"
                          : "border-gray-200/70 bg-white/60 hover:bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenFaqId((prev) =>
                            prev === item.id ? "" : item.id,
                          )
                        }
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                      >
                        <span className="text-[16px] font-semibold text-[#171717]">
                          {item.question}
                        </span>
                        <span className="shrink-0 text-[18px] font-medium text-[#525252]">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-[15px] leading-[24px] text-[#6B7280]">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* BANDE 8 : CTA finale */}
        <section className="bg-[#FAFBFB] py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-2xs sm:px-12 sm:py-20">
              {/* Portraits flottants gauche */}
              <div className="pointer-events-none hidden md:block" aria-hidden="true">
                <Image
                  src="/avatars/agents/agent-1.jpg"
                  alt=""
                  width={56}
                  height={56}
                  className="absolute left-8 top-10 size-14 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <Image
                  src="/avatars/agents/agent-2.jpg"
                  alt=""
                  width={48}
                  height={48}
                  className="absolute left-28 top-24 size-12 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <Image
                  src="/avatars/agents/agent-3.jpg"
                  alt=""
                  width={44}
                  height={44}
                  className="absolute bottom-14 left-16 size-11 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <Image
                  src="/avatars/agents/agent-4.jpg"
                  alt=""
                  width={64}
                  height={64}
                  className="absolute bottom-7 left-40 size-16 rounded-full border-2 border-white object-cover shadow-sm"
                />
              </div>

              {/* Portraits flottants droite */}
              <div className="pointer-events-none hidden md:block" aria-hidden="true">
                <Image
                  src="/avatars/agents/agent-5.jpg"
                  alt=""
                  width={56}
                  height={56}
                  className="absolute right-32 top-10 size-14 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <Image
                  src="/avatars/agents/agent-6.jpg"
                  alt=""
                  width={44}
                  height={44}
                  className="absolute right-10 top-7 size-11 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <Image
                  src="/avatars/agents/agent-7.jpg"
                  alt=""
                  width={64}
                  height={64}
                  className="absolute bottom-20 right-12 size-16 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <Image
                  src="/avatars/agents/agent-8.jpg"
                  alt=""
                  width={48}
                  height={48}
                  className="absolute bottom-8 right-44 size-12 rounded-full border-2 border-white object-cover shadow-sm"
                />
              </div>

              <div className="relative z-10 mx-auto max-w-xl">
                <h2 className="text-[32px] font-semibold leading-[1.15] tracking-tight text-[#171717] sm:text-[38px]">
                  Prêt à passer à l&apos;action ?
                </h2>
                <p className="mx-auto mt-3.5 max-w-md text-[16px] leading-[24px] text-[#6B7280]">
                  Déployez votre premier agent vocal IA en quelques minutes et automatisez vos appels, relances et prises de rendez-vous.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/signup"
                    className="inline-flex h-[46px] w-full items-center justify-center rounded-xl bg-[#184D3B] px-6 text-[14px] font-semibold text-white shadow-xs transition hover:bg-[#133D2E] sm:w-auto"
                  >
                    Démarrer gratuitement
                  </Link>
                  <a
                    href="#tarifs"
                    className="inline-flex h-[46px] w-full items-center justify-center rounded-xl border border-[#184D3B]/30 bg-white px-6 text-[14px] font-semibold text-[#184D3B] transition hover:bg-[#184D3B]/5 sm:w-auto"
                  >
                    Voir les tarifs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          aria-labelledby="landing-security-title"
          className="w-full border-t border-gray-200/70 bg-[#F4F6F5] py-20 lg:py-24"
        >
          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl text-left">
                <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1 text-[13px] font-medium text-[#525252] shadow-2xs">
                  <span className="h-1.5 w-3 rounded-full bg-[#00B489]" />
                  Sécurité et confidentialité
                </span>

                <h2
                  id="landing-security-title"
                  className="mt-4 text-[32px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#171717] sm:text-[38px]"
                >
                  Vos conversations méritent{" "}
                  <span className="text-[#8C8C8C]">toute notre attention.</span>
                </h2>

                <p className="mt-4 text-[16px] leading-[24px] text-[#6B7280]">
                  AutoCall vous aide à gérer vos appels tout en vous donnant une
                  information claire sur la protection des données traitées par
                  le service.
                </p>
              </div>

              <Link
                href="/privacy"
                className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 text-[14px] font-semibold text-[#171717] shadow-2xs transition hover:border-gray-300 hover:bg-gray-50 lg:self-auto"
              >
                <span>Découvrir notre approche de la confidentialité</span>
                <svg
                  viewBox="0 0 20 20"
                  className="size-4 text-[#008F6D]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 10h10m0 0-4-4m4 4-4 4" />
                </svg>
              </Link>
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                {
                  badge: "Authentification",
                  title: "Protection des accès",
                  description:
                    "Dans l’interface de démonstration, le mot de passe est masqué par défaut pendant la saisie.",
                  icon: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5zM12 15v2",
                },
                {
                  badge: "Traçabilité",
                  title: "Gestion des conversations",
                  description:
                    "Dans la démonstration, vous pouvez consulter les transcriptions et les résumés d’exemple, puis marquer une conversation comme résolue.",
                  icon: "M20 11a7 7 0 0 1-7 7H8l-4 3v-7a7 7 0 0 1 7-10h2a7 7 0 0 1 7 7ZM8 10h8m-8 4h5",
                },
                {
                  badge: "Conformité RGPD",
                  title: "Transparence sur les données",
                  description:
                    "La politique de confidentialité présente les catégories de données traitées et les droits des personnes au titre du RGPD.",
                  icon: "M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h6",
                },
              ].map(({ badge, title, description, icon }) => (
                <li
                  key={title}
                  className="flex flex-col justify-between rounded-3xl border border-gray-200/90 bg-white p-6 shadow-2xs transition hover:border-gray-300/90"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-[#00B489]/20 bg-[#E6F5F0] text-[#008F6D]">
                        <svg
                          viewBox="0 0 24 24"
                          className="size-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d={icon} />
                        </svg>
                      </span>
                      <span className="rounded-lg border border-gray-200/80 bg-[#FAFBFB] px-2.5 py-1 text-[12px] font-medium text-[#525252]">
                        {badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-[18px] font-semibold tracking-tight text-[#171717]">
                      {title}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-[22px] text-[#6B7280]">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Pied de page style éditorial + montagnes halftone vertes (fond blanc pur) */}
      <footer
        id="ressources"
        className="relative z-10 border-t border-gray-200 bg-white"
      >
        <div className="mx-auto w-full max-w-[1240px] px-6 pt-16 pb-8 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="space-y-4 md:col-span-5">
              <Link
                href="/landing"
                className="inline-flex items-center gap-2.5 text-[19px] font-bold tracking-tight text-[#171717]"
              >
                <svg
                  viewBox="0 0 64 64"
                  className="size-8 shrink-0 text-[#171717]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
                </svg>
                <span>AutoCall</span>
              </Link>
              <p className="max-w-xs text-[14px] leading-[22px] text-[#737373]">
                Rejoignez les entreprises qui automatisent leur accueil
                téléphonique, leurs relances et leur CRM avec AutoCall.
              </p>
              <Link href="/?view=social" className="text-sm font-medium text-[#00775B] hover:underline">Découvrir le studio Réseaux sociaux</Link>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 lg:gap-10">
              <div>
                <p className="text-[13.5px] font-semibold text-[#171717]">Produit</p>
                <ul className="mt-3.5 space-y-2.5 text-[14px] leading-[21px] text-[#525252]">
                  <li>
                    <a href="#produit" className="hover:text-[#171717]">
                      Comment ça marche
                    </a>
                  </li>
                  <li>
                    <a href="#integrations" className="hover:text-[#171717]">
                      Intégrations
                    </a>
                  </li>
                  <li>
                    <a href="#tarifs" className="hover:text-[#171717]">
                      Tarifs
                    </a>
                  </li>
                  <li>
                    <a href="#cas-usage" className="hover:text-[#171717]">
                      Sécurité &amp; RGPD
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[13.5px] font-semibold text-[#171717]">
                  Entreprise
                </p>
                <ul className="mt-3.5 space-y-2.5 text-[14px] leading-[21px] text-[#525252]">
                  <li>
                    <a href="#produit" className="hover:text-[#171717]">
                      À propos
                    </a>
                  </li>
                  <li>
                    <a href="#cas-usage" className="hover:text-[#171717]">
                      Cas d’usage
                    </a>
                  </li>
                  <li>
                    <Link href="/login" className="hover:text-[#171717]">
                      Connexion
                    </Link>
                  </li>
                  <li>
                    <Link href="/super-admin/login" className="hover:text-[#171717]">
                      Accès administration
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[13.5px] font-semibold text-[#171717]">Légal</p>
                <ul className="mt-3.5 space-y-2.5 text-[14px] leading-[21px] text-[#525252]">
                  <li>
                    <Link href="/legal-notice" className="hover:text-[#171717]">
                      Mentions légales
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-[#171717]">
                      Politique de confidentialité
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-[#171717]">
                      Conditions générales
                    </Link>
                  </li>
                  <li>
                    <Link href="/security" className="hover:text-[#171717]">
                      Sécurité
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal" className="hover:text-[#171717]">
                      Centre juridique
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="hover:text-[#171717]">
                      Politique de cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-gray-100 pt-6 text-[13px] text-[#737373] sm:flex-row">
            <span>© 2026 AutoCall SAS. Tous droits réservés.</span>
            <span>Plateforme vocale IA conçue en France</span>
          </div>
        </div>

        {/* Paysage de montagnes en trame halftone vert émeraude */}
        <div className="relative h-36 w-full overflow-hidden sm:h-44" aria-hidden="true">
          <svg
            viewBox="0 0 1200 180"
            preserveAspectRatio="none"
            className="size-full"
          >
            <defs>
              <pattern
                id="footer-dots-light"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.15" fill="#6EE7B7" fillOpacity="0.65" />
              </pattern>
              <pattern
                id="footer-dots-mid"
                width="5"
                height="5"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.35" fill="#10B981" fillOpacity="0.72" />
              </pattern>
              <pattern
                id="footer-dots-deep"
                width="4"
                height="4"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1.8" cy="1.8" r="1.45" fill="#065F46" fillOpacity="0.88" />
              </pattern>
            </defs>

            <path
              d="M0 180 L0 120 Q120 75 240 110 T480 85 T720 115 T960 80 T1200 105 L1200 180 Z"
              fill="url(#footer-dots-light)"
            />
            <path
              d="M0 180 L0 138 Q160 110 310 135 T600 95 T900 135 T1200 105 L1200 180 Z"
              fill="url(#footer-dots-mid)"
            />
            <path
              d="M0 180 L0 150 Q140 118 280 158 T660 142 T1020 112 T1200 145 L1200 180 Z"
              fill="url(#footer-dots-deep)"
            />
          </svg>
        </div>
      </footer>

      {/* Fenêtre latérale gauche (menu mobile) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[82vw] flex-col justify-between border-r border-gray-200 bg-white p-5 shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <Link
                  href="/landing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-[17px] font-bold tracking-tight text-[#171717]"
                >
                  <svg
                    viewBox="0 0 64 64"
                    className="size-7 shrink-0 text-[#171717]"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
                  </svg>
                  <span>AutoCall</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fermer le menu"
                  className="inline-flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <nav className="mt-4 flex flex-col gap-1 text-[15px] font-medium text-[#171717]">
                <a
                  href="#produit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-3 transition hover:bg-gray-50"
                >
                  Produit
                </a>
                <a
                  href="#tarifs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-3 transition hover:bg-gray-50"
                >
                  Tarifs
                </a>
                <a
                  href="#cas-usage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-3 transition hover:bg-gray-50"
                >
                  Cas d’usage
                </a>
                <div className="mt-1 border-t border-gray-100 pt-2">
                  <p className="px-3 py-1 text-[13px] font-semibold text-[#737373]">
                    Ressources
                  </p>
                  {RESOURCE_LINKS.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-[44px] items-center rounded-xl px-3 text-[14px] text-[#525252] transition hover:bg-gray-50 hover:text-[#171717]"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </nav>
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-[14px] font-semibold text-[#171717] hover:bg-gray-50"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-[#171717] text-[14px] font-semibold text-white hover:bg-[#2E2E2E]"
              >
                Essai gratuit
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Assistant visiteur dédié à la landing page (écrit + oral + accroche proactive) */}
      <LandingAskAI />
    </div>
  );
}
