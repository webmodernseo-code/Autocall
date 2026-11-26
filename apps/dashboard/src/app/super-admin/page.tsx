"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { DashboardSearch } from "../dashboard-search";
import { type Locale, type NavIconName, SolarIcon } from "../workspace-navigation";
import { SuperAdminAdoption } from "./super-admin-adoption";
import { SuperAdminAdvisor } from "./super-admin-advisor";
import { SuperAdminAiGovernance } from "./super-admin-ai-governance";
import { SuperAdminBilling } from "./super-admin-billing";
import { SuperAdminConsumption } from "./super-admin-consumption";
import { SuperAdminFinance } from "./super-admin-finance";
import { SuperAdminInfrastructure } from "./super-admin-infrastructure";
import { SuperAdminOverview } from "./super-admin-overview";
import { SuperAdminProviders } from "./super-admin-providers";
import { SuperAdminSecurity } from "./super-admin-security";
import { SuperAdminSettings } from "./super-admin-settings";
import { SuperAdminSupport } from "./super-admin-support";
import { SuperAdminTenants } from "./super-admin-tenants";

type SuperAdminSectionId =
  | "overview"
  | "tenants"
  | "billing"
  | "consumption"
  | "finance"
  | "providers"
  | "ai-governance"
  | "support"
  | "adoption"
  | "infrastructure"
  | "security"
  | "settings";

interface SuperAdminNavItem {
  id: SuperAdminSectionId;
  group: "platform" | "governance";
  labels: Record<Locale, string>;
  descriptions: Record<Locale, string>;
  icon: NavIconName;
  badge?: string;
  badgeTone?: "green" | "neutral";
  tabs: { id: string; labels: Record<Locale, string> }[];
}

const SUPER_ADMIN_NAV: SuperAdminNavItem[] = [
  {
    id: "overview",
    group: "platform",
    labels: {
      fr: "Dashboard",
      en: "Dashboard",
      es: "Dashboard",
    },
    descriptions: {
      fr: "Vue d’ensemble de la plateforme : entreprises, utilisateurs, MRR, coûts et santé globale.",
      en: "Platform overview: companies, users, MRR, costs, and overall system health.",
      es: "Vista general de la plataforma: empresas, usuarios, MRR, costos y salud.",
    },
    icon: "overview",
    tabs: [
      {
        id: "summary",
        labels: { fr: "Synthèse", en: "Summary", es: "Síntesis" },
      },
      {
        id: "economy",
        labels: { fr: "Économie", en: "Economy", es: "Economía" },
      },
      {
        id: "health",
        labels: { fr: "Santé", en: "Health", es: "Salud" },
      },
    ],
  },
  {
    id: "tenants",
    group: "platform",
    labels: {
      fr: "Entreprises & utilisateurs",
      en: "Companies & Users",
      es: "Empresas y Usuarios",
    },
    descriptions: {
      fr: "Centre de gestion des entreprises clientes d’AutoCall, des propriétaires de comptes, des invités en lecture seule et des invitations.",
      en: "Management center for AutoCall customer companies, account owners, read-only guests, and invitations.",
      es: "Centro de gestión de empresas clientes, propietarios, invitados y sus invitaciones.",
    },
    icon: "crm",
    badge: "248",
    badgeTone: "green",
    tabs: [
      {
        id: "companies",
        labels: { fr: "Entreprises", en: "Companies", es: "Empresas" },
      },
      {
        id: "users",
        labels: { fr: "Utilisateurs", en: "Users", es: "Usuarios" },
      },
      {
        id: "invitations",
        labels: { fr: "Invitations", en: "Invitations", es: "Invitaciones" },
      },
    ],
  },
  {
    id: "billing",
    group: "platform",
    labels: {
      fr: "Facturation",
      en: "Billing",
      es: "Facturación",
    },
    descriptions: {
      fr: "Gestion des abonnements, des offres commerciales versionnées, des transactions, factures, promotions et remboursements.",
      en: "Manage subscriptions, versioned plans, transactions, invoices, promotions, and refunds.",
      es: "Gestión de suscripciones, ofertas versionadas, transacciones, facturas, promociones y reembolsos.",
    },
    icon: "card",
    tabs: [
      {
        id: "subscriptions",
        labels: { fr: "Abonnements", en: "Subscriptions", es: "Suscripciones" },
      },
      {
        id: "offers",
        labels: { fr: "Offres", en: "Plans", es: "Ofertas" },
      },
      {
        id: "transactions",
        labels: { fr: "Transactions", en: "Transactions", es: "Transacciones" },
      },
      {
        id: "invoices",
        labels: { fr: "Factures", en: "Invoices", es: "Facturas" },
      },
      {
        id: "promotions",
        labels: { fr: "Promotions", en: "Promotions", es: "Promociones" },
      },
      {
        id: "refunds",
        labels: { fr: "Remboursements", en: "Refunds", es: "Reembolsos" },
      },
    ],
  },
  {
    id: "consumption",
    group: "platform",
    labels: {
      fr: "Consommations",
      en: "Consumption",
      es: "Consumos",
    },
    descriptions: {
      fr: "Surveillance des ressources consommées par entreprise et par service, registre immuable des mouvements, seuils de quotas et détection d’anomalies.",
      en: "Monitor resources consumed by company and service, immutable credit ledger, quota thresholds, and anomaly detection.",
      es: "Supervisión de recursos por empresa y servicio, registro de movimientos, cuotas y anomalías.",
    },
    icon: "bolt",
    tabs: [
      {
        id: "summary",
        labels: { fr: "Synthèse", en: "Summary", es: "Síntesis" },
      },
      {
        id: "companies",
        labels: { fr: "Entreprises", en: "Companies", es: "Empresas" },
      },
      {
        id: "services",
        labels: { fr: "Services", en: "Services", es: "Servicios" },
      },
      {
        id: "ledger",
        labels: { fr: "Registre", en: "Ledger", es: "Registro" },
      },
      {
        id: "quotas",
        labels: { fr: "Quotas", en: "Quotas", es: "Cuotas" },
      },
      {
        id: "anomalies",
        labels: { fr: "Anomalies", en: "Anomalies", es: "Anomalías" },
      },
    ],
  },
  {
    id: "finance",
    group: "platform",
    labels: {
      fr: "Finance",
      en: "Finance",
      es: "Finanzas",
    },
    descriptions: {
      fr: "Pilotage de la performance économique et de la rentabilité d’AutoCall : MRR, ARR, marges contributives, dépenses, CAC/LTV et simulateur de croissance.",
      en: "Steer AutoCall economic performance and profitability: MRR, ARR, contribution margins, expenses, CAC/LTV, and growth simulator.",
      es: "Control del rendimiento económico y rentabilidad: MRR, ARR, márgenes, gastos, CAC/LTV y simulador.",
    },
    icon: "chart",
    tabs: [
      {
        id: "revenues",
        labels: { fr: "Revenus", en: "Revenues", es: "Ingresos" },
      },
      {
        id: "companies",
        labels: { fr: "Entreprises", en: "Companies", es: "Empresas" },
      },
      {
        id: "offers-markets",
        labels: { fr: "Offres et marchés", en: "Plans & Markets", es: "Ofertas y Mercados" },
      },
      {
        id: "features",
        labels: { fr: "Fonctionnalités", en: "Features", es: "Funcionalidades" },
      },
      {
        id: "expenses",
        labels: { fr: "Dépenses", en: "Expenses", es: "Gastos" },
      },
      {
        id: "retention",
        labels: { fr: "Acquisition et rétention", en: "Acquisition & Retention", es: "Adquisición y Retención" },
      },
      {
        id: "forecast",
        labels: { fr: "Prévisions et simulations", en: "Forecasts & Simulations", es: "Previsiones y Simulaciones" },
      },
    ],
  },
  {
    id: "providers",
    group: "platform",
    labels: {
      fr: "Fournisseurs",
      en: "Providers",
      es: "Proveedores",
    },
    descriptions: {
      fr: "Pilotage des prestataires technologiques externes : connexions testées, tarifs versionnés, clés API en écriture seule, rotation en 6 étapes, routage et historique.",
      en: "Manage external technology providers: tested connections, versioned pricing, write-only API keys, 6-step rotation, routing, and audit history.",
      es: "Gestión de proveedores externos: conexiones, tarifas versionadas, claves API, rotación, enrutamiento e historial.",
    },
    icon: "phone",
    tabs: [
      {
        id: "connections",
        labels: { fr: "Connexions", en: "Connections", es: "Conexiones" },
      },
      {
        id: "pricing",
        labels: { fr: "Tarifs", en: "Pricing", es: "Tarifas" },
      },
      {
        id: "api-keys",
        labels: { fr: "Clés API", en: "API Keys", es: "Claves API" },
      },
      {
        id: "rotation",
        labels: { fr: "Rotation", en: "Rotation", es: "Rotación" },
      },
      {
        id: "routing",
        labels: { fr: "Routage", en: "Routing", es: "Enrutamiento" },
      },
      {
        id: "history",
        labels: { fr: "Historique", en: "History", es: "Historial" },
      },
    ],
  },
  {
    id: "ai-governance",
    group: "governance",
    labels: {
      fr: "Gouvernance IA",
      en: "AI Governance",
      es: "Gobernanza IA",
    },
    descriptions: {
      fr: "Contrôle des ressources et comportements IA : supervision, modèles officiels, avatars, voix, qualité, versions, centre de validation et licences.",
      en: "Control AI resources and behaviors: supervision, official models, avatars, voices, quality, versions, validation center, and licenses.",
      es: "Control de recursos y comportamientos IA: supervisión, modelos oficiales, avatares, voces, calidad, versiones, validación y licencias.",
    },
    icon: "agents",
    tabs: [
      {
        id: "supervision",
        labels: { fr: "Supervision", en: "Supervision", es: "Supervisión" },
      },
      {
        id: "official-models",
        labels: { fr: "Modèles officiels", en: "Official Models", es: "Modelos oficiales" },
      },
      {
        id: "avatars",
        labels: { fr: "Avatars", en: "Avatars", es: "Avatares" },
      },
      {
        id: "voices",
        labels: { fr: "Voix", en: "Voices", es: "Voces" },
      },
      {
        id: "quality",
        labels: { fr: "Qualité", en: "Quality", es: "Calidad" },
      },
      {
        id: "versions",
        labels: { fr: "Versions", en: "Versions", es: "Versiones" },
      },
      {
        id: "validation",
        labels: { fr: "Tests et validation", en: "Tests & Validation", es: "Pruebas y Validación" },
      },
      {
        id: "licenses",
        labels: { fr: "Licences", en: "Licenses", es: "Licencias" },
      },
    ],
  },
  {
    id: "support",
    group: "governance",
    labels: {
      fr: "Support",
      en: "Support",
      es: "Soporte",
    },
    descriptions: {
      fr: "Centre d’assistance et de relation client : tickets P1–P4, supervision d’AutoCall Support AI, diagnostics techniques, centre d’aide (14 catégories), réponses types et performances.",
      en: "Customer support center: P1–P4 tickets, AutoCall Support AI supervision, technical diagnostics, help center (14 categories), canned responses, and performance.",
      es: "Centro de soporte: tickets P1–P4, supervisión de Support AI, diagnósticos técnicos, centro de ayuda, respuestas tipo y rendimiento.",
    },
    icon: "help",
    badge: "24",
    badgeTone: "neutral",
    tabs: [
      {
        id: "tickets",
        labels: { fr: "Tickets", en: "Tickets", es: "Tickets" },
      },
      {
        id: "ai-support",
        labels: { fr: "Support IA", en: "AI Support", es: "Soporte IA" },
      },
      {
        id: "diagnostics",
        labels: { fr: "Diagnostics", en: "Diagnostics", es: "Diagnósticos" },
      },
      {
        id: "documentation",
        labels: { fr: "Documentation", en: "Documentation", es: "Documentación" },
      },
      {
        id: "canned-responses",
        labels: { fr: "Réponses types", en: "Canned Responses", es: "Respuestas tipo" },
      },
      {
        id: "performance",
        labels: { fr: "Performances", en: "Performance", es: "Rendimiento" },
      },
    ],
  },
  {
    id: "adoption",
    group: "governance",
    labels: {
      fr: "Adoption",
      en: "Adoption",
      es: "Adopción",
    },
    descriptions: {
      fr: "Pilotage de l’engagement et de la fidélisation : tunnel d’onboarding, première valeur, adoption des fonctionnalités, cohortes de rétention, Health Score, feedback, accompagnement et tests A/B.",
      en: "Engagement and retention steering: onboarding funnel, first value, feature adoption, retention cohorts, Health Score, feedback, coaching, and A/B tests.",
      es: "Control de adopción y fidelización: onboarding, funcionalidades, cohortes de retención, Health Score, feedback, acompañamiento y experimentos.",
    },
    icon: "acquisition",
    tabs: [
      {
        id: "onboarding",
        labels: { fr: "Onboarding", en: "Onboarding", es: "Onboarding" },
      },
      {
        id: "features",
        labels: { fr: "Fonctionnalités", en: "Features", es: "Funcionalidades" },
      },
      {
        id: "retention",
        labels: { fr: "Rétention", en: "Retention", es: "Retención" },
      },
      {
        id: "health",
        labels: { fr: "Santé", en: "Health", es: "Salud" },
      },
      {
        id: "feedback",
        labels: { fr: "Feedback", en: "Feedback", es: "Feedback" },
      },
      {
        id: "coaching",
        labels: { fr: "Accompagnement", en: "Coaching", es: "Acompañamiento" },
      },
      {
        id: "experiments",
        labels: { fr: "Expérimentations", en: "Experiments", es: "Experimentos" },
      },
    ],
  },
  {
    id: "infrastructure",
    group: "governance",
    labels: {
      fr: "Infrastructure",
      en: "Infrastructure",
      es: "Infraestructura",
    },
    descriptions: {
      fr: "Tour de contrôle technique : état des composants Next.js/NestJS/Neon/Redis/BullMQ, performances API & Core Web Vitals, files de workers, logs expurgés, sauvegardes RPO/RTO, déploiements, incidents et status.getautocall.fr.",
      en: "Technical control tower: Next.js/NestJS/Neon/Redis/BullMQ health, API & Core Web Vitals performance, worker queues, sanitized logs, RPO/RTO backups, deployments, incidents, and status.getautocall.fr.",
      es: "Torre de control técnico: estado de componentes, rendimiento, colas BullMQ, logs, copias de seguridad, despliegues, incidentes y página de estado.",
    },
    icon: "appearance",
    tabs: [
      {
        id: "infrastructure",
        labels: { fr: "Infrastructure", en: "Infrastructure", es: "Infraestructura" },
      },
      {
        id: "performance",
        labels: { fr: "Performances", en: "Performance", es: "Rendimiento" },
      },
      {
        id: "queues-workers",
        labels: { fr: "Files et workers", en: "Queues & Workers", es: "Colas y Workers" },
      },
      {
        id: "logs-errors",
        labels: { fr: "Logs et erreurs", en: "Logs & Errors", es: "Logs y Errores" },
      },
      {
        id: "backups",
        labels: { fr: "Sauvegardes", en: "Backups", es: "Copias de seguridad" },
      },
      {
        id: "deployments",
        labels: { fr: "Déploiements", en: "Deployments", es: "Despliegues" },
      },
      {
        id: "incidents",
        labels: { fr: "Incidents", en: "Incidents", es: "Incidentes" },
      },
      {
        id: "status-page",
        labels: { fr: "Page status", en: "Status Page", es: "Página status" },
      },
    ],
  },
  {
    id: "security",
    group: "governance",
    labels: {
      fr: "Sécurité",
      en: "Security",
      es: "Seguridad",
    },
    descriptions: {
      fr: "Centre de protection, conformité RGPD et maîtrise des risques : authentification MFA, isolation multi-tenant RLS, sécurité des agents IA, communications, journal d’audit immuable, matrice de criticité 5×5 et incidents.",
      en: "Security, GDPR compliance, and risk management center: MFA authentication, RLS multi-tenant isolation, AI agent security, communications, immutable audit log, 5×5 risk matrix, and security incidents.",
      es: "Centro de seguridad, cumplimiento RGPD y gestión de riesgos: autenticación MFA, aislamiento RLS, seguridad IA, comunicaciones, auditoría, matriz 5×5 e incidentes.",
    },
    icon: "mail",
    tabs: [
      {
        id: "authentication",
        labels: { fr: "Authentification", en: "Authentication", es: "Autenticación" },
      },
      {
        id: "data",
        labels: { fr: "Données", en: "Data", es: "Datos" },
      },
      {
        id: "gdpr",
        labels: { fr: "RGPD", en: "GDPR", es: "RGPD" },
      },
      {
        id: "ai-security",
        labels: { fr: "Gouvernance IA", en: "AI Security", es: "Seguridad IA" },
      },
      {
        id: "communications",
        labels: { fr: "Communications", en: "Communications", es: "Comunicaciones" },
      },
      {
        id: "audit",
        labels: { fr: "Audit", en: "Audit", es: "Auditoría" },
      },
      {
        id: "risks",
        labels: { fr: "Risques", en: "Risks", es: "Riesgos" },
      },
      {
        id: "security-incidents",
        labels: { fr: "Incidents", en: "Incidents", es: "Incidentes" },
      },
    ],
  },
  {
    id: "settings",
    group: "governance",
    labels: {
      fr: "Paramètres globaux",
      en: "Global Settings",
      es: "Configuración global",
    },
    descriptions: {
      fr: "Configuration générale de la plateforme : préférences par défaut, marchés (France EUR / Côte d’Ivoire XOF), Feature Flags V1, notifications système, branding, modèles officiels, CMS (14 sections), maintenance et historique des révisions.",
      en: "Global platform configuration: default preferences, markets (France EUR / Côte d’Ivoire XOF), V1 Feature Flags, system notifications, branding, official templates, CMS (14 sections), maintenance, and revision history.",
      es: "Configuración global: general, mercados, Feature Flags, notificaciones, branding, plantillas, CMS, mantenimiento e historial.",
    },
    icon: "settings",
    tabs: [
      {
        id: "general",
        labels: { fr: "Général", en: "General", es: "General" },
      },
      {
        id: "markets",
        labels: { fr: "Marchés", en: "Markets", es: "Mercados" },
      },
      {
        id: "flags",
        labels: { fr: "Fonctionnalités et flags", en: "Features & Flags", es: "Funcionalidades y Flags" },
      },
      {
        id: "notifications",
        labels: { fr: "Notifications", en: "Notifications", es: "Notificaciones" },
      },
      {
        id: "branding",
        labels: { fr: "Branding", en: "Branding", es: "Branding" },
      },
      {
        id: "templates",
        labels: { fr: "Modèles", en: "Templates", es: "Plantillas" },
      },
      {
        id: "cms",
        labels: { fr: "CMS", en: "CMS", es: "CMS" },
      },
      {
        id: "maintenance",
        labels: { fr: "Maintenance", en: "Maintenance", es: "Mantenimiento" },
      },
      {
        id: "history",
        labels: { fr: "Historique", en: "History", es: "Historial" },
      },
    ],
  },
];

const LANGUAGES: { code: Locale; short: string; label: string }[] = [
  { code: "fr", short: "FR", label: "Français" },
  { code: "en", short: "EN", label: "English" },
  { code: "es", short: "ES", label: "Español" },
];

function FlagSvg({ locale }: { locale: Locale }) {
  const clipId = useId();

  if (locale === "fr") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-4 shrink-0 rounded-full ring-1 ring-black/10"
      >
        <clipPath id={clipId}>
          <circle cx="10" cy="10" r="10" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="6.7" height="20" fill="#1D4ED8" />
          <rect x="6.7" y="0" width="6.6" height="20" fill="#FFFFFF" />
          <rect x="13.3" y="0" width="6.7" height="20" fill="#DC2626" />
        </g>
      </svg>
    );
  }

  if (locale === "en") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-4 shrink-0 rounded-full ring-1 ring-black/10"
      >
        <clipPath id={clipId}>
          <circle cx="10" cy="10" r="10" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect width="20" height="20" fill="#1E3A8A" />
          <path d="M0 0L20 20M20 0L0 20" stroke="#FFFFFF" strokeWidth="3.6" />
          <path d="M0 0L20 20M20 0L0 20" stroke="#DC2626" strokeWidth="1.8" />
          <path d="M10 0V20M0 10H20" stroke="#FFFFFF" strokeWidth="5.2" />
          <path d="M10 0V20M0 10H20" stroke="#DC2626" strokeWidth="3" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-4 shrink-0 rounded-full ring-1 ring-black/10"
    >
      <clipPath id={clipId}>
        <circle cx="10" cy="10" r="10" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="20" height="5" fill="#DC2626" />
        <rect x="0" y="5" width="20" height="10" fill="#FACC15" />
        <rect x="0" y="15" width="20" height="5" fill="#DC2626" />
      </g>
    </svg>
  );
}

function SidebarToggleSvg({ className = "size-[18px]" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M9 4v16" />
    </svg>
  );
}

function BrandMark() {
  return (
    <span className="inline-flex size-6.5 shrink-0 items-center justify-center text-[#171717]">
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="size-6"
        fill="currentColor"
      >
        <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
      </svg>
    </span>
  );
}

const adminLocationEvent = "autocall-admin-location";
const readAdminLocation = () => window.location.search;
const subscribeAdminLocation = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  window.addEventListener(adminLocationEvent, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(adminLocationEvent, listener);
  };
};

export default function SuperAdminPage() {
  const locationSearch = useSyncExternalStore(subscribeAdminLocation, readAdminLocation, () => "");
  const locationParams = new URLSearchParams(locationSearch);
  const [activeTabBySection, setActiveTabBySection] = useState<
    Record<SuperAdminSectionId, string>
  >({
    overview: "summary",
    tenants: "companies",
    billing: "subscriptions",
    consumption: "summary",
    finance: "revenues",
    providers: "connections",
    "ai-governance": "supervision",
    support: "tickets",
    adoption: "onboarding",
    infrastructure: "infrastructure",
    security: "authentication",
    settings: "general",
  });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("fr");
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const tabsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        setCollapsed((prev) => !prev);
      }
      if (event.key === "Escape") {
        setMobileOpen(false);
        setLangOpen(false);
        setProfileOpen(false);
      }
    }
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const activeSection =
    SUPER_ADMIN_NAV.find((item) => item.id === locationParams.get("section")) ??
    SUPER_ADMIN_NAV[0];
  const currentTabId =
    activeSection.tabs.find((tab) => tab.id === locationParams.get("tab"))?.id ??
    activeTabBySection[activeSection.id] ?? activeSection.tabs[0].id;

  useEffect(() => {
    tabsRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeSection.id, currentTabId]);
  const currentLang =
    LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const platformItems = SUPER_ADMIN_NAV.filter((i) => i.group === "platform");
  const governanceItems = SUPER_ADMIN_NAV.filter(
    (i) => i.group === "governance",
  );

  const handleNavigate = (id: SuperAdminSectionId, tab?: string) => {
    const section = SUPER_ADMIN_NAV.find((item) => item.id === id);
    if (!section) return;
    const nextTab = section.tabs.find((item) => item.id === tab)?.id ?? activeTabBySection[id] ?? section.tabs[0].id;
    setActiveTabBySection((previous) => ({ ...previous, [id]: nextTab }));
    setMobileOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set("section", id);
    url.searchParams.set("tab", nextTab);
    if (url.href !== window.location.href) window.history.pushState(null, "", url);
    window.dispatchEvent(new Event(adminLocationEvent));
  };
  const handleSelectSection = (id: SuperAdminSectionId) => handleNavigate(id);
  const handleSelectTab = (tab: string) => handleNavigate(activeSection.id, tab);
  const adminSearchItems = SUPER_ADMIN_NAV.flatMap((section) => [
    { id: section.id, label: section.labels[locale], icon: section.icon },
    ...section.tabs.map((tab) => ({ id: section.id + ":" + tab.id, label: tab.labels[locale], detail: section.labels[locale], icon: section.icon })),
  ]);

  const renderSidebarContent = (isMobileDrawer: boolean) => {
    const isCollapsed = isMobileDrawer ? false : collapsed;

    return (
      <div className="flex h-full flex-col bg-[var(--sidebar)] font-sans select-none">
        {/* En-tête Sidebar (56px aligné sur la barre du haut) */}
        <div
          className={`flex h-14 shrink-0 items-center border-b border-[var(--border)] px-3 ${isCollapsed ? "justify-center" : "justify-between"
            }`}
        >
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => handleSelectSection("overview")}
              className="flex items-center gap-2 rounded-[8px] px-1.5 py-1 text-left transition-colors hover:bg-[#F7F7F8] cursor-pointer"
            >
              <BrandMark />
              <span className="text-[15px] font-semibold tracking-[-0.03em] text-[#171717]">
                AutoCall
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              isMobileDrawer
                ? setMobileOpen(false)
                : setCollapsed((prev) => !prev)
            }
            aria-label={
              isMobileDrawer
                ? "Fermer la navigation"
                : isCollapsed
                  ? "Ouvrir la barre latérale"
                  : "Réduire la barre latérale"
            }
            title={
              isMobileDrawer
                ? "Fermer"
                : isCollapsed
                  ? "Ouvrir (Ctrl+B)"
                  : "Réduire (Ctrl+B)"
            }
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-[8px] text-[#737373] transition-colors hover:bg-[#F4F4F5] hover:text-[#171717] cursor-pointer"
          >
            {isMobileDrawer ? (
              <SolarIcon name="close" className="size-[18px]" />
            ) : (
              <SidebarToggleSvg className="size-[18px]" />
            )}
          </button>
        </div>

        {/* Navigation scrollable */}
        <nav
          aria-label="Navigation Super Admin"
          className="flex-1 overflow-y-auto px-2.5 pt-2 pb-3"
        >
          {/* Groupe 1 : Plateforme & Opérations */}
          <section aria-labelledby="sa-platform-heading">
            {!isCollapsed && (
              <div className="mb-1.5 flex items-center px-2.5 py-1 text-[12px] font-medium text-[#737373]">
                <h2 id="sa-platform-heading">
                  {locale === "en"
                    ? "Platform & Operations"
                    : locale === "es"
                      ? "Plataforma y Operaciones"
                      : "Plateforme & Opérations"}
                </h2>
              </div>
            )}
            <ul className="space-y-1.5">
              {platformItems.map((item) => {
                const isActive = activeSection.id === item.id;
                const label = item.labels[locale];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSection(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      title={isCollapsed ? label : undefined}
                      className={`flex w-full items-center rounded-[8px] text-[14px] leading-5 transition-colors cursor-pointer ${isCollapsed
                          ? "h-9.5 justify-center px-0"
                          : "h-9.5 justify-between px-2.5"
                        } ${isActive
                          ? "bg-[#EFEFEF] font-medium text-[#171717]"
                          : "font-normal text-[#525252] hover:bg-[#F7F7F8] hover:text-[#171717]"
                        }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <SolarIcon
                          name={item.icon}
                          active={isActive}
                          className={`size-[18px] shrink-0 ${
                            isActive
                              ? "text-[#171717] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.95))_drop-shadow(0_2px_2.5px_rgba(23,23,23,0.28))]"
                              : "text-[#666666] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.9))_drop-shadow(0_1.5px_1.5px_rgba(23,23,23,0.16))]"
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{label}</span>
                        )}
                      </span>
                      {!isCollapsed && item.badge && (
                        <span
                          className={`ml-2 inline-flex h-5 items-center rounded-md px-1.5 font-mono text-[11.5px] font-medium tabular-nums ${item.badgeTone === "green"
                              ? "bg-[#E6F5F0] text-[#00775B]"
                              : "bg-[#EFEFEF] text-[#525252]"
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Groupe 2 : Gouvernance & Système */}
          <section aria-labelledby="sa-governance-heading" className="mt-6">
            {!isCollapsed ? (
              <div className="mb-1.5 flex items-center px-2.5 py-1 text-[12px] font-medium text-[#737373]">
                <h2 id="sa-governance-heading">
                  {locale === "en"
                    ? "Governance & System"
                    : locale === "es"
                      ? "Gobernanza y Sistema"
                      : "Gouvernance & Système"}
                </h2>
              </div>
            ) : (
              <div className="mx-auto my-3 h-px w-6 bg-[#EFEFEF]" />
            )}
            <ul className="space-y-1.5">
              {governanceItems.map((item) => {
                const isActive = activeSection.id === item.id;
                const label = item.labels[locale];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSection(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      title={isCollapsed ? label : undefined}
                      className={`flex w-full items-center rounded-[8px] text-[14px] leading-5 transition-colors cursor-pointer ${isCollapsed
                          ? "h-9.5 justify-center px-0"
                          : "h-9.5 justify-between px-2.5"
                        } ${isActive
                          ? "bg-[#EFEFEF] font-medium text-[#171717]"
                          : "font-normal text-[#525252] hover:bg-[#F7F7F8] hover:text-[#171717]"
                        }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <SolarIcon
                          name={item.icon}
                          active={isActive}
                          className={`size-[18px] shrink-0 ${
                            isActive
                              ? "text-[#171717] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.95))_drop-shadow(0_2px_2.5px_rgba(23,23,23,0.28))]"
                              : "text-[#666666] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.9))_drop-shadow(0_1.5px_1.5px_rgba(23,23,23,0.16))]"
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{label}</span>
                        )}
                      </span>
                      {!isCollapsed && item.badge && (
                        <span className="ml-2 inline-flex h-5 items-center rounded-md bg-[#EFEFEF] px-1.5 font-mono text-[11.5px] font-medium text-[#525252] tabular-nums">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </nav>

        {/* Pied de barre latérale : État infrastructure & bascule espace client */}
        <div className="mt-auto shrink-0 px-2.5 pt-2 pb-2.5">
          {!isCollapsed ? (
            <div className="rounded-[12px] border border-[#E5E5E5] bg-white p-3">
              <div className="flex items-center justify-between text-[13px] font-semibold text-[#171717]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#008F6D]" />
                  <span>Cluster EU-West-1</span>
                </span>
                <span className="font-mono text-[12px] font-medium text-[#00775B] tabular-nums">
                  99,98 %
                </span>
              </div>
              <p className="mt-0.5 text-[12px] leading-4 text-[#737373]">
                SIP PBX &amp; Workers IA opérationnels
              </p>
              <Link
                href="/"
                className="mt-2.5 flex h-[36px] w-full items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-[#FAFAFA] text-[13px] font-medium text-[#171717] transition-colors hover:bg-[#F0F0F0]"
              >
                Ouvrir Dashboard Client
              </Link>
            </div>
          ) : (
            <Link
              href="/"
              title="Ouvrir Dashboard Client"
              aria-label="Ouvrir Dashboard Client"
              className="mx-auto flex size-9 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#171717] transition-colors hover:bg-[#F5F5F5]"
            >
              <SolarIcon name="overview" className="size-[18px]" />
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      {/* Tiroir mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-[#171717]/30 backdrop-blur-[1px]"
          />
          <aside
            aria-label="Navigation Super Admin"
            className="relative z-10 h-dvh w-[240px] border-r border-[#E5E5E5] bg-white shadow-xl"
          >
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Barre latérale gauche desktop (240px) */}
      <aside
        aria-label="Navigation Super Admin"
        className={`sticky top-0 hidden h-dvh shrink-0 overflow-hidden border-r border-[var(--border)] bg-[var(--sidebar)] transition-[width] duration-200 ease-out md:block ${collapsed ? "w-[68px]" : "w-[240px]"
          }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Colonne principale : Barre du haut + En-tête de section & Onglets */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barre supérieure (56px) */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--topbar)] px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir la navigation"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#171717] transition-colors hover:bg-[#F4F4F5] md:hidden cursor-pointer"
            >
              <SolarIcon name="menu" className="size-4" />
            </button>
            <SolarIcon
              name={activeSection.icon}
              className="size-[18px] shrink-0 text-[#525252]"
            />
            <div className="flex min-w-0 items-center gap-2 text-[14px]">
              <span className="hidden text-[#737373] sm:inline">Super Admin</span>
              <span className="hidden text-[#A3A3A3] sm:inline">/</span>
              <h1 className="truncate font-medium tracking-[-0.01em] text-[#171717]">
                {activeSection.labels[locale]}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Recherche globale Super Admin */}
            <DashboardSearch label={locale === "en" ? "Search the console" : locale === "es" ? "Buscar en la consola" : "Rechercher dans la console"} empty={locale === "en" ? "No matching section." : locale === "es" ? "Ninguna sección encontrada." : "Aucune rubrique ne correspond."} items={adminSearchItems} onSelect={(id) => {
              const [section, tab] = id.split(":");
              handleNavigate(section as SuperAdminSectionId, tab);
            }} />

            {/* Sélecteur de langue FR / EN / ES */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={langOpen}
                aria-label="Langue de l’interface"
                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#E5E5E5] bg-white px-2.5 text-[13.5px] font-medium text-[#171717] transition-colors hover:bg-[#F7F7F8] cursor-pointer"
              >
                <FlagSvg locale={currentLang.code} />
                <span>{currentLang.short}</span>
                <SolarIcon
                  name="chevronDown"
                  className={`size-3 text-[#737373] transition-transform duration-150 ${langOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {langOpen && (
                <div
                  role="menu"
                  aria-label="Choisir la langue"
                  className="absolute right-0 z-30 mt-1.5 w-40 rounded-[10px] border border-[#E5E5E5] bg-white p-1 shadow-lg"
                >
                  {LANGUAGES.map((lang) => {
                    const selected = lang.code === locale;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        role="menuitemradio"
                        aria-checked={selected}
                        onClick={() => {
                          setLocale(lang.code);
                          setLangOpen(false);
                        }}
                        className={`flex h-8 w-full items-center justify-between rounded-[6px] px-2.5 text-[13.5px] transition-colors cursor-pointer ${selected
                            ? "bg-[#EFEFEF] font-medium text-[#171717]"
                            : "text-[#525252] hover:bg-[#F7F7F8] hover:text-[#171717]"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <FlagSvg locale={lang.code} />
                          <span>{lang.label}</span>
                        </span>
                        <span className="text-[12px] text-[#737373]">
                          {lang.short}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Profil Super Admin */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((prev) => !prev);
                  setLangOpen(false);
                }}
                aria-label="Profil Super Admin"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5 transition hover:border-[#A3A3A3] cursor-pointer"
              >
                <Image
                  src="/avatars/agents/agent-11.jpg"
                  alt="Tanjim Islam"
                  width={36}
                  height={36}
                  className="size-full rounded-full object-cover object-top"
                />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  aria-label="Menu Super Admin"
                  className="absolute right-0 z-30 mt-2 w-56 rounded-[10px] border border-[#E5E5E5] bg-white p-1.5 shadow-lg"
                >
                  <div className="border-b border-[#F0F0F0] px-2.5 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[14px] font-semibold text-[#171717]">
                        Tanjim Islam
                      </p>
                      <span className="rounded bg-[#E6F5F0] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#00775B]">
                        ROOT
                      </span>
                    </div>
                    <p className="truncate text-[12.5px] text-[#737373]">
                      root@autocall.fr
                    </p>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <Link
                      href="/"
                      className="flex h-8 w-full items-center gap-2 rounded-[6px] px-2.5 text-[13.5px] text-[#171717] transition-colors hover:bg-[#F4F4F5]"
                    >
                      <SolarIcon name="overview" className="size-4 text-[#525252]" />
                      <span>Dashboard Client</span>
                    </Link>
                    <Link
                      href="/landing"
                      className="flex h-8 w-full items-center gap-2 rounded-[6px] px-2.5 text-[13.5px] text-[#171717] transition-colors hover:bg-[#F4F4F5]"
                    >
                      <SolarIcon name="globe" className="size-4 text-[#525252]" />
                      <span>Landing Page</span>
                    </Link>
                    <div className="my-1 h-px bg-[#F0F0F0]" />
                    <Link
                      href="/super-admin/login"
                      className="flex h-8 w-full items-center gap-2 rounded-[6px] px-2.5 text-[13.5px] text-[#B91C1C] transition-colors hover:bg-[#FEF2F2]"
                    >
                      <SolarIcon name="logout" className="size-4 text-[#B91C1C]" />
                      <span>Déconnexion Root</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Zone principale : En-tête de section + Barre d'onglets uniquement */}
        <main className="flex-1">
          <div className="w-full p-6">
            <div>
              <h2 className="text-[24px] leading-[32px] font-semibold tracking-[-0.025em] text-[#171717]">
                {activeSection.labels[locale]}
              </h2>
              <p className="mt-1 text-[14px] leading-[21px] text-[#525252]">
                {activeSection.descriptions[locale]}
              </p>
            </div>

            {/* Barre d'onglets de la section active */}
            <div
              ref={tabsRef}
              role="tablist"
              aria-label={`Onglets ${activeSection.labels[locale]}`}
              className="mt-6 flex min-w-0 flex-nowrap items-center gap-6 overflow-x-auto border-b border-[var(--border)] sm:gap-8"
            >
              {activeSection.tabs.map((tab) => {
                const selected = currentTabId === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    onKeyDown={(event) => {
                      const position = activeSection.tabs.findIndex((item) => item.id === tab.id);
                      const count = activeSection.tabs.length;
                      const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : event.key === "ArrowRight" ? (position + 1) % count : event.key === "ArrowLeft" ? (position + count - 1) % count : -1;
                      if (next < 0) return;
                      event.preventDefault();
                      handleSelectTab(activeSection.tabs[next].id);
                      tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
                    }}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`relative shrink-0 whitespace-nowrap pb-3 text-[14px] transition-colors cursor-pointer ${selected
                        ? "font-semibold text-[var(--foreground)]"
                        : "font-normal text-[var(--text-muted)] hover:text-[var(--foreground)]"
                      }`}
                  >
                    <span>{tab.labels[locale]}</span>
                    {selected && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--foreground)]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Contenu du Module 01 : Dashboard (Vue d'ensemble : Synthèse / Économie / Santé) */}
            {activeSection.id === "overview" && (
              <SuperAdminOverview
                activeTab={currentTabId}
                locale={locale}
                onNavigate={handleNavigate}
              />
            )}

            {/* Contenu du Module 02 : Entreprises & utilisateurs (Entreprises / Fiche 360° / Utilisateurs / Invitations) */}
            {activeSection.id === "tenants" && (
              <SuperAdminTenants
                activeTab={currentTabId}
                locale={locale}
                onSelectTab={handleSelectTab}
                onNavigate={handleNavigate}
              />
            )}

            {/* Contenu du Module 03 : Facturation (Abonnements / Offres / Transactions / Factures / Promotions / Remboursements) */}
            {activeSection.id === "billing" && (
              <SuperAdminBilling
                activeTab={currentTabId}
                locale={locale}
                onNavigate={handleNavigate}
              />
            )}

            {/* Contenu du Module 04 : Consommations (Synthèse / Entreprises / Services / Registre / Quotas / Anomalies) */}
            {activeSection.id === "consumption" && (
              <SuperAdminConsumption
                activeTab={currentTabId}
                locale={locale}
                onSelectTab={handleSelectTab}
                onNavigate={handleNavigate}
              />
            )}

            {/* Contenu du Module 05 : Finance (Revenus / Entreprises / Offres et marchés / Fonctionnalités / Dépenses / Acquisition et rétention / Prévisions et simulations) */}
            {activeSection.id === "finance" && (
              <SuperAdminFinance
                activeTab={currentTabId}
                locale={locale}
                onSelectTab={handleSelectTab}
                onNavigate={handleNavigate}
              />
            )}

            {/* Contenu du Module 06 : Fournisseurs (Connexions / Tarifs / Clés API / Rotation / Routage / Historique) */}
            {activeSection.id === "providers" && (
              <SuperAdminProviders
                activeTab={currentTabId}
                locale={locale}
                onSelectTab={handleSelectTab}
                onNavigate={handleNavigate}
              />
            )}

            {/* Contenu du Module 07 : Gouvernance IA (Supervision / Modèles officiels / Avatars / Voix / Qualité / Versions / Tests et validation / Licences) */}
            {activeSection.id === "ai-governance" && (
              <SuperAdminAiGovernance
                activeTab={currentTabId}
                locale={locale}
                onSelectTab={handleSelectTab}
                onNavigate={handleNavigate}
              />
            )}

            {/* Contenu du Module 08 : Support (Tickets / Support IA / Diagnostics / Documentation / Réponses types / Performances) */}
            {activeSection.id === "support" && (
              <SuperAdminSupport
                activeTab={currentTabId}
                locale={locale}
                onSelectTab={handleSelectTab}
                onNavigate={handleNavigate}
              />
            )}

            {/* Contenu du Module 09 : Adoption (Onboarding / Fonctionnalités / Rétention / Santé / Feedback / Accompagnement / Expérimentations) */}
            {activeSection.id === "adoption" && (
              <SuperAdminAdoption
                activeTab={currentTabId}
                locale={locale}
                onSelectTab={handleSelectTab}
                onNavigate={handleNavigate}
              />
            )}

            {/* Contenu du Module 10 : Infrastructure (Infrastructure / Performances / Files et workers / Logs et erreurs / Sauvegardes / Déploiements / Incidents / Page status) */}
            {activeSection.id === "infrastructure" && (
              <SuperAdminInfrastructure
                activeTab={currentTabId}
                locale={locale}
                onSelectTab={handleSelectTab}
                onNavigate={handleNavigate}
              />
            )}

            {/* Contenu du Module 11 : Sécurité (Authentification / Données / RGPD / Gouvernance IA / Communications / Audit / Risques / Incidents) */}
            {activeSection.id === "security" && (
              <SuperAdminSecurity
                activeTab={currentTabId}
                locale={locale}
                onSelectTab={handleSelectTab}
                onNavigate={handleNavigate}
              />
            )}

            {/* Contenu du Module 12 : Paramètres globaux (Général / Marchés / Fonctionnalités et flags / Notifications / Branding / Modèles / CMS / Maintenance / Historique) */}
            {activeSection.id === "settings" && (
              <SuperAdminSettings
                activeTab={currentTabId}
                locale={locale}
                onSelectTab={handleSelectTab}
                onNavigate={handleNavigate}
              />
            )}
          </div>
        </main>
      </div>

      {/* Agent Conseiller stratégique Super Admin en bas à droite */}
      <SuperAdminAdvisor
        activeSectionId={activeSection.id}
        activeTabId={currentTabId}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
