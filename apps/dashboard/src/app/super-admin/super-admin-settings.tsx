"use client";

import { useId, useMemo, useState } from "react";
import { GeniusPayBrandSvg, StripeBrandSvg } from "../brand-icons";
import { PremiumSelect } from "../premium-select";
import { type Locale, SolarIcon } from "../workspace-navigation";
import { type SuperAdminSectionNavTarget } from "./super-admin-overview";

// ---------------------------------------------------------------------------
// DRAPEAUX VECTORIELS SVG (FRANCE & CÔTE D'IVOIRE) — ZÉRO EMOJI
// ---------------------------------------------------------------------------

function MarketFlagSvg({ market }: { market: "FR" | "CI" }) {
  const clipId = useId();
  if (market === "FR") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="size-6 shrink-0 rounded-full ring-1 ring-black/10"
        aria-hidden="true"
      >
        <clipPath id={clipId}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="8" height="24" fill="#1D4ED8" />
          <rect x="8" y="0" width="8" height="24" fill="#FFFFFF" />
          <rect x="16" y="0" width="8" height="24" fill="#DC2626" />
        </g>
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 shrink-0 rounded-full ring-1 ring-black/10"
      aria-hidden="true"
    >
      <clipPath id={clipId}>
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="8" height="24" fill="#F97316" />
        <rect x="8" y="0" width="8" height="24" fill="#FFFFFF" />
        <rect x="16" y="0" width="8" height="24" fill="#16A34A" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 03. FONCTIONNALITÉS ET FLAGS — Les 9 Feature Flags V1
// ---------------------------------------------------------------------------

type FlagRolloutScope =
  | "Global"
  | "Par marché"
  | "Par offre"
  | "Par entreprise"
  | "Bêta"
  | "Progressif";

interface FeatureFlagItem {
  id: string;
  name: string;
  subtitle: string;
  enabled: boolean;
  scope: FlagRolloutScope;
  dependencyNote: string;
}

const INITIAL_FEATURE_FLAGS: FeatureFlagItem[] = [
  {
    id: "ff-voice",
    name: "Agents vocaux IA",
    subtitle: "Agents téléphoniques intelligents",
    enabled: true,
    scope: "Global",
    dependencyNote: "Dépend de Téléphonie Twilio & Voix ElevenLabs.",
  },
  {
    id: "ff-acq",
    name: "Acquisition de prospects",
    subtitle: "Recherche et enrichissement",
    enabled: true,
    scope: "Global",
    dependencyNote: "Alimente directement le module CRM.",
  },
  {
    id: "ff-crm",
    name: "CRM",
    subtitle: "Gestion des contacts et entreprises",
    enabled: true,
    scope: "Global",
    dependencyNote: "Socle central requis par Campagnes et Rendez-vous.",
  },
  {
    id: "ff-camp",
    name: "Campagnes",
    subtitle: "Prospection et diffusion",
    enabled: true,
    scope: "Global",
    dependencyNote: "Vérifie les tâches en cours dans BullMQ avant arrêt.",
  },
  {
    id: "ff-wa",
    name: "WhatsApp",
    subtitle: "Messagerie et notes vocales",
    enabled: true,
    scope: "Global",
    dependencyNote: "Synchronisé avec la boîte de réception Communications.",
  },
  {
    id: "ff-social",
    name: "Réseaux sociaux",
    subtitle: "Publication et planification",
    enabled: true,
    scope: "Global",
    dependencyNote: "Social Studio multi-comptes.",
  },
  {
    id: "ff-auto",
    name: "Automatisations",
    subtitle: "Exécution de workflows",
    enabled: true,
    scope: "Global",
    dependencyNote: "Orchestration post-appel et webhooks.",
  },
  {
    id: "ff-rdv",
    name: "Rendez-vous",
    subtitle: "Agenda et réservation",
    enabled: true,
    scope: "Global",
    dependencyNote: "Connecteurs Google Calendar & Microsoft Outlook.",
  },
  {
    id: "ff-ask",
    name: "Ask AI",
    subtitle: "Assistant métier AutoCall",
    enabled: true,
    scope: "Global",
    dependencyNote: "Copilote contextuel client & conseiller Super Admin.",
  },
];

// ---------------------------------------------------------------------------
// 04. NOTIFICATIONS SYSTÈME — Matrice des 10 événements × 3 canaux
// ---------------------------------------------------------------------------

interface SystemNotificationRule {
  id: string;
  event: string;
  mandatorySecurityOrService: boolean;
  email: boolean;
  inApp: boolean;
  sms: boolean;
}

const INITIAL_NOTIFICATION_RULES: SystemNotificationRule[] = [
  {
    id: "nt-1",
    event: "Bienvenue sur AutoCall",
    mandatorySecurityOrService: true,
    email: true,
    inApp: true,
    sms: false,
  },
  {
    id: "nt-2",
    event: "Vérification du compte",
    mandatorySecurityOrService: true,
    email: true,
    inApp: false,
    sms: true,
  },
  {
    id: "nt-3",
    event: "Paiement réussi",
    mandatorySecurityOrService: true,
    email: true,
    inApp: true,
    sms: false,
  },
  {
    id: "nt-4",
    event: "Paiement échoué",
    mandatorySecurityOrService: true,
    email: true,
    inApp: true,
    sms: true,
  },
  {
    id: "nt-5",
    event: "Quota atteint à 80 %",
    mandatorySecurityOrService: true,
    email: true,
    inApp: true,
    sms: false,
  },
  {
    id: "nt-6",
    event: "Quota atteint à 95 %",
    mandatorySecurityOrService: true,
    email: true,
    inApp: true,
    sms: true,
  },
  {
    id: "nt-7",
    event: "Quota épuisé (100 %)",
    mandatorySecurityOrService: true,
    email: true,
    inApp: true,
    sms: true,
  },
  {
    id: "nt-8",
    event: "Alerte de sécurité",
    mandatorySecurityOrService: true,
    email: true,
    inApp: true,
    sms: true,
  },
  {
    id: "nt-9",
    event: "Maintenance planifiée",
    mandatorySecurityOrService: true,
    email: true,
    inApp: true,
    sms: false,
  },
  {
    id: "nt-10",
    event: "Nouvelle fonctionnalité (Opt-in produit)",
    mandatorySecurityOrService: false,
    email: true,
    inApp: true,
    sms: false,
  },
];

// ---------------------------------------------------------------------------
// 06. MODÈLES DE COMMUNICATION OFFICIELS AUTOCALL (FR / EN)
// ---------------------------------------------------------------------------

interface OfficialCommTemplate {
  id: string;
  title: string;
  domain: "Inscription" | "Authentification" | "Facturation" | "Consommations" | "Infrastructure";
  subjectFr: string;
  bodyFr: string;
  subjectEn: string;
  bodyEn: string;
}

const OFFICIAL_TEMPLATES: OfficialCommTemplate[] = [
  {
    id: "mt-welcome",
    title: "Bienvenue sur AutoCall",
    domain: "Inscription",
    subjectFr: "Bienvenue sur AutoCall !",
    bodyFr:
      "Bonjour {{prenom}},\n\nBienvenue sur AutoCall. Votre espace {{entreprise}} est prêt à être configuré.\n\nDécouvrez vos outils et configurez votre premier agent IA.\n\nL’équipe AutoCall\nAutoCall · getautocall.fr",
    subjectEn: "Welcome to AutoCall!",
    bodyEn:
      "Hello {{prenom}},\n\nWelcome to AutoCall. Your workspace {{entreprise}} is ready to be configured.\n\nExplore your tools and set up your first AI voice agent.\n\nThe AutoCall Team\nAutoCall · getautocall.fr",
  },
  {
    id: "mt-verify",
    title: "Vérification du compte",
    domain: "Authentification",
    subjectFr: "Vérifiez votre adresse e-mail AutoCall",
    bodyFr:
      "Bonjour {{prenom}},\n\nUtilisez le code de vérification sécurisé {{code_verification}} pour confirmer la création de votre compte sur app.getautocall.fr.\n\nCe code expire dans 15 minutes.",
    subjectEn: "Verify your AutoCall email address",
    bodyEn:
      "Hello {{prenom}},\n\nUse the secure verification code {{code_verification}} to confirm your account on app.getautocall.fr.\n\nThis code expires in 15 minutes.",
  },
  {
    id: "mt-payment",
    title: "Confirmation de paiement",
    domain: "Facturation",
    subjectFr: "Votre facture AutoCall {{numero_facture}} est disponible",
    bodyFr:
      "Bonjour {{prenom}},\n\nNous vous confirmons la bonne réception de votre règlement pour l’abonnement {{offre}} de l’espace {{entreprise}}.\n\nVotre facture PDF certifiée est téléchargeable depuis votre espace Facturation.",
    subjectEn: "Your AutoCall invoice {{numero_facture}} is available",
    bodyEn:
      "Hello {{prenom}},\n\nWe confirm receipt of your payment for the {{offre}} subscription of {{entreprise}}.\n\nYour PDF invoice is available in your Billing settings.",
  },
  {
    id: "mt-quota",
    title: "Alerte de consommation",
    domain: "Consommations",
    subjectFr: "Alerte quota : {{seuil_pct}} % atteint sur {{entreprise}}",
    bodyFr:
      "Bonjour {{prenom}},\n\nVotre espace {{entreprise}} a atteint {{seuil_pct}} % de son quota mensuel de minutes vocales.\n\nAucune recharge automatique payante n’est déclenchée sans votre validation explicite.",
    subjectEn: "Quota alert: {{seuil_pct}}% reached on {{entreprise}}",
    bodyEn:
      "Hello {{prenom}},\n\nYour workspace {{entreprise}} has reached {{seuil_pct}}% of its monthly voice minutes quota.\n\nNo paid auto-recharge is triggered without your explicit approval.",
  },
  {
    id: "mt-maint",
    title: "Maintenance planifiée",
    domain: "Infrastructure",
    subjectFr: "Information : maintenance planifiée AutoCall le {{date_maintenance}}",
    bodyFr:
      "Bonjour {{prenom}},\n\nUne opération d’optimisation aura lieu le {{date_maintenance}} sur le créneau {{creneau_horaire}}.\n\nSuivez l’état en temps réel sur status.getautocall.fr.",
    subjectEn: "Notice: AutoCall scheduled maintenance on {{date_maintenance}}",
    bodyEn:
      "Hello {{prenom}},\n\nA scheduled optimization will take place on {{date_maintenance}} during {{creneau_horaire}}.\n\nTrack live status at status.getautocall.fr.",
  },
];

// ---------------------------------------------------------------------------
// 07. CMS — 12 pages publiques & les 14 sections de la Landing Page
// ---------------------------------------------------------------------------

const CMS_PUBLIC_PAGES = [
  { name: "Landing page", desc: "14 sections" },
  { name: "Fonctionnalités", desc: "Présentation produit" },
  { name: "Solutions", desc: "Pages sectorielles" },
  { name: "Tarifs", desc: "Synchronisé avec 03 · Facturation" },
  { name: "Intégrations", desc: "Catalogue public" },
  { name: "Comparatifs", desc: "Pages concurrentielles" },
  { name: "Blog", desc: "Articles et publications" },
  { name: "Nouveautés", desc: "Changelog produit" },
  { name: "FAQ", desc: "Questions fréquentes" },
  { name: "Pages légales", desc: "Politiques et conditions" },
  { name: "À propos", desc: "Présentation AutoCall" },
  { name: "Partenariats", desc: "Relations partenaires" },
];

const LANDING_14_SECTIONS = [
  { num: "01", label: "Hero" },
  { num: "02", label: "Intégrations" },
  { num: "03", label: "Problèmes" },
  { num: "04", label: "Solution" },
  { num: "05", label: "Agents IA" },
  { num: "06", label: "Modules" },
  { num: "07", label: "Onboarding" },
  { num: "08", label: "Secteurs" },
  { num: "09", label: "Calculateur ROI" },
  { num: "10", label: "Tarifs" },
  { num: "11", label: "Comparatif" },
  { num: "12", label: "Recharges" },
  { num: "13", label: "FAQ" },
  { num: "14", label: "CTA et footer" },
];

// ---------------------------------------------------------------------------
// 09. HISTORIQUE DES CONFIGURATIONS GLOBALES
// ---------------------------------------------------------------------------

interface SettingsRevisionRecord {
  id: string;
  title: string;
  moduleRef: string;
  revisionTag: string;
  timestamp: string;
  actor: string;
  reason: string;
}

const INITIAL_SETTINGS_HISTORY: SettingsRevisionRecord[] = [
  {
    id: "rev-24",
    title: "Publication d’une nouvelle version du Hero",
    moduleRef: "CMS",
    revisionTag: "Révision 24",
    timestamp: "Aujourd’hui · 16:42",
    actor: "Administrateur (root@autocall.fr)",
    reason: "Clarification de la proposition de valeur CRM + Appels IA sur getautocall.fr",
  },
  {
    id: "rev-12",
    title: "Modification du modèle de bienvenue",
    moduleRef: "Modèles",
    revisionTag: "Révision 12",
    timestamp: "Aujourd’hui · 14:15",
    actor: "Administrateur (root@autocall.fr)",
    reason: "Ajout du lien direct vers le démarrage rapide Agent Studio (FR/EN)",
  },
  {
    id: "rev-8",
    title: "Mise à jour des paramètres du marché France",
    moduleRef: "Marchés",
    revisionTag: "Révision 8",
    timestamp: "Hier · 11:32",
    actor: "Administrateur (root@autocall.fr)",
    reason: "Confirmation des règles de TVA et prélèvements Stripe EUR",
  },
  {
    id: "rev-16",
    title: "Modification d’un Feature Flag",
    moduleRef: "Fonctionnalités",
    revisionTag: "Révision 16",
    timestamp: "Hier · 09:48",
    actor: "Administrateur (root@autocall.fr)",
    reason: "Passage de l’assistant Ask AI en disponibilité Globale V1",
  },
  {
    id: "rev-5",
    title: "Mise à jour du branding",
    moduleRef: "Branding",
    revisionTag: "Révision 5",
    timestamp: "23 novembre · 15:24",
    actor: "Administrateur (root@autocall.fr)",
    reason: "Verrouillage des jetons Layered Minimalism (#008F6D / #171717 / Geist)",
  },
];

export function SuperAdminSettings({
  activeTab,
  onSelectTab,
  onNavigate,
}: {
  activeTab: string;
  locale: Locale;
  onSelectTab: (tabId: string) => void;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  // 01. Général
  const [defaultLanguage, setDefaultLanguage] = useState("Français");
  const [defaultTimezone, setDefaultTimezone] = useState("Europe/Paris");
  const [publicSignupOpen, setPublicSignupOpen] = useState(true);
  const [emailVerificationRequired, setEmailVerificationRequired] = useState(true);
  const [isolatedDemoAllowed, setIsolatedDemoAllowed] = useState(true);

  // 03. Feature Flags
  const [flags, setFlags] = useState<FeatureFlagItem[]>(INITIAL_FEATURE_FLAGS);

  // 04. Notifications système
  const [notifRules, setNotifRules] =
    useState<SystemNotificationRule[]>(INITIAL_NOTIFICATION_RULES);

  // 06. Modèles de communication
  const [selectedTemplateId, setSelectedTemplateId] = useState("mt-welcome");
  const [templateLang, setTemplateLang] = useState<"FR" | "EN">("FR");

  // 07. CMS (Éditeur des 14 sections de la landing page)
  const [selectedCmsSection, setSelectedCmsSection] = useState("01");
  const [cmsLang, setCmsLang] = useState<"FR" | "EN">("FR");
  const [heroTitleFr, setHeroTitleFr] = useState(
    "La plateforme CRM et de gestion d’appels IA pour les équipes modernes.",
  );
  const [heroDescFr, setHeroDescFr] = useState(
    "Centralisez vos prospects, automatisez vos échanges et ne laissez plus aucune opportunité vous échapper.",
  );
  const [heroTitleEn, setHeroTitleEn] = useState(
    "The AI Call Management & CRM platform for modern teams.",
  );
  const [heroDescEn, setHeroDescEn] = useState(
    "Centralize your leads, automate your conversations, and never miss a business opportunity again.",
  );

  // 08. Maintenance
  const [maintScope, setMaintScope] = useState("Module spécifique (CRM et Acquisition)");
  const [maintStatus, setMaintStatus] = useState<"Brouillon" | "Planifiée">("Brouillon");

  // 09. Historique
  const [historyList, setHistoryList] =
    useState<SettingsRevisionRecord[]>(INITIAL_SETTINGS_HISTORY);

  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const enabledFlagsCount = useMemo(
    () => flags.filter((f) => f.enabled).length,
    [flags],
  );
  const disabledFlagsCount = flags.length - enabledFlagsCount;

  const selectedTemplate = useMemo(
    () =>
      OFFICIAL_TEMPLATES.find((t) => t.id === selectedTemplateId) ??
      OFFICIAL_TEMPLATES[0],
    [selectedTemplateId],
  );

  const handleCopyTemplate = () => {
    const text =
      templateLang === "FR" ? selectedTemplate.bodyFr : selectedTemplate.bodyEn;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    notify(`Modèle « ${selectedTemplate.title} » (${templateLang}) copié`);
  };

  return (
    <div className="mt-7 space-y-7">
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-[#E5E5E5] bg-[#171717] px-4 py-3 text-[13.5px] font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Bandeau du cycle de validation en 7 étapes (Section 12 : Brouillon -> Rollback traçable) */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-2xs lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
          <span className="inline-flex size-2 shrink-0 rounded-full bg-[#008F6D]" />
          <span>
            <strong className="font-semibold text-[var(--foreground)]">
              12 · Paramètres globaux :
            </strong>{" "}
            Cycle contrôlé en 7 étapes (Brouillon → Validation → Analyse d’impact → Approbation → Publication → Surveillance → Rollback par nouvelle révision).
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("billing", "offers")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>03 · Catalogue Tarifs</span>
            <span className="text-[#737373]">→</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("history")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>Révisions &amp; Rollback</span>
            <span className="text-[#737373]">→</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          01. SOUS-ONGLET GÉNÉRAL (Informations plateforme + Préférences + Inscriptions)
         ===================================================================== */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Carte 1 : Informations de la plateforme */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <h3 className="text-[16.5px] font-semibold text-[#171717]">
              Informations de la plateforme
            </h3>
            <p className="mt-0.5 text-[12.5px] text-[#737373]">
              Identité et domaines principaux d’AutoCall.
            </p>

            <div className="mt-4 space-y-3 text-[13px]">
              {[
                { label: "Nom de la plateforme", value: "AutoCall" },
                { label: "Site internet public", value: "getautocall.fr" },
                { label: "Application client", value: "app.getautocall.fr" },
                { label: "Page statut indépendante", value: "status.getautocall.fr" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] px-3.5 py-2.5"
                >
                  <span className="block text-[11.5px] text-[#737373]">{item.label}</span>
                  <span className="mt-0.5 block font-mono font-semibold text-[#171717]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Carte 2 : Préférences générales par défaut */}
          <section className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div>
              <h3 className="text-[16.5px] font-semibold text-[#171717]">
                Préférences générales par défaut
              </h3>
              <p className="mt-0.5 text-[12.5px] text-[#737373]">
                Valeurs initiales proposées aux nouveaux espaces clients.
              </p>

              <div className="mt-4 space-y-3.5 text-[13px]">
                <div>
                  <label className="block font-medium text-[#171717]">
                    Langue par défaut
                  </label>
                  <PremiumSelect
                    value={defaultLanguage}
                    onChange={setDefaultLanguage}
                    ariaLabel="Langue par défaut"
                    className="mt-1"
                    options={[
                      { value: "Français", label: "Français (FR)" },
                      { value: "English", label: "English (EN)" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#171717]">
                    Fuseau horaire par défaut
                  </label>
                  <PremiumSelect
                    value={defaultTimezone}
                    onChange={setDefaultTimezone}
                    ariaLabel="Fuseau horaire par défaut"
                    className="mt-1"
                    options={[
                      { value: "Europe/Paris", label: "Europe/Paris (CET/CEST)" },
                      { value: "Africa/Abidjan", label: "Africa/Abidjan (GMT)" },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3">
                    <span className="block text-[11px] text-[#737373]">
                      Devise de référence
                    </span>
                    <span className="mt-0.5 block font-mono font-semibold text-[#171717]">
                      EUR — Euro
                    </span>
                  </div>
                  <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3">
                    <span className="block text-[11px] text-[#737373]">
                      Langues disponibles
                    </span>
                    <span className="mt-0.5 block font-mono font-semibold text-[#171717]">
                      FR / EN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-3.5 py-2.5 text-[12px] text-[#525252]">
              <strong>Garde-fou :</strong> ces paramètres par défaut n’écrasent jamais les préférences individuelles déjà choisies par les entreprises clientes.
            </p>
          </section>

          {/* Carte 3 : Configuration des inscriptions */}
          <section className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div>
              <h3 className="text-[16.5px] font-semibold text-[#171717]">
                Configuration des inscriptions
              </h3>
              <p className="mt-0.5 text-[12.5px] text-[#737373]">
                Règles d’accès et de création de nouveaux comptes.
              </p>

              <div className="mt-4 space-y-3">
                {[
                  {
                    title: "Inscriptions publiques",
                    desc: "Autoriser la création de nouveaux comptes.",
                    checked: publicSignupOpen,
                    toggle: () => setPublicSignupOpen((v) => !v),
                  },
                  {
                    title: "Vérification des adresses email",
                    desc: "Vérifier les nouveaux comptes avant activation.",
                    checked: emailVerificationRequired,
                    toggle: () => setEmailVerificationRequired((v) => !v),
                  },
                  {
                    title: "Espace de démonstration",
                    desc: "Autoriser l’accès à une démo isolée.",
                    checked: isolatedDemoAllowed,
                    toggle: () => setIsolatedDemoAllowed((v) => !v),
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5"
                  >
                    <div>
                      <p className="text-[13.5px] font-semibold text-[#171717]">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-[#525252]">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        item.toggle();
                        notify(`Paramètre « ${item.title} » mis à jour en brouillon`);
                      }}
                      className={`h-7 w-12 shrink-0 rounded-full p-1 transition cursor-pointer ${
                        item.checked ? "bg-[#408963]" : "bg-[#D4D4D8]"
                      }`}
                      aria-pressed={item.checked}
                    >
                      <span
                        className={`block size-5 rounded-full bg-white shadow-2xs transition-transform ${
                          item.checked ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                notify("Nouvelle révision des paramètres généraux enregistrée dans l’Historique")
              }
              className="mt-4 h-10 w-full rounded-xl bg-[#171717] text-[13px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
            >
              Publier la révision générale
            </button>
          </section>
        </div>
      )}

      {/* =====================================================================
          02. SOUS-ONGLET MARCHÉS (France EUR · Marché de lancement / Côte d'Ivoire XOF · En préparation)
         ===================================================================== */}
      {activeTab === "markets" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* France */}
            <article className="flex flex-col justify-between rounded-2xl border border-[#171717] bg-[var(--surface)] p-3 shadow-2xs">
              <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <MarketFlagSvg market="FR" />
                    <div>
                      <h3 className="text-[17px] font-semibold text-[#171717]">
                        France
                      </h3>
                      <p className="font-mono text-[12px] text-[#525252]">
                        Devise : EUR — Euro
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md bg-[#DEF5EC] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#008064] whitespace-nowrap">
                    ● Marché de lancement
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-[#E5E5E5]/80 pt-3 text-[12.5px]">
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Langues</span>
                    <span className="font-medium text-[#171717]">Français / Anglais</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Tarification locale</span>
                    <span className="font-mono font-semibold text-[#171717]">
                      49 € · 99 € · 179 € HT
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Moyens de paiement</span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#171717]">
                      <StripeBrandSvg className="size-4 rounded-[4px]" />
                      <span>Carte bancaire &amp; SEPA (Stripe)</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Fonctionnalités</span>
                    <span className="font-medium text-[#008F6D]">9/9 modules V1 actifs</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 px-1 pb-1">
                <button
                  type="button"
                  onClick={() => onNavigate("billing", "offers")}
                  className="h-9 w-full rounded-xl border border-[#E5E5E5] bg-white text-[12.5px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                >
                  Inspecter les offres EUR →
                </button>
              </div>
            </article>

            {/* Côte d'Ivoire */}
            <article className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs">
              <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <MarketFlagSvg market="CI" />
                    <div>
                      <h3 className="text-[17px] font-semibold text-[#171717]">
                        Côte d’Ivoire
                      </h3>
                      <p className="font-mono text-[12px] text-[#525252]">
                        Devise : XOF — Franc CFA
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md bg-[#F0C869] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#5C3D00] whitespace-nowrap">
                    ● En préparation
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-[#E5E5E5]/80 pt-3 text-[12.5px]">
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Langues</span>
                    <span className="font-medium text-[#171717]">Français / Anglais</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Tarification locale</span>
                    <span className="font-mono font-semibold text-[#171717]">
                      15 000 · 30 000 · 60 000 XOF
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#737373]">Moyens de paiement</span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#171717]">
                      <GeniusPayBrandSvg className="h-4 w-auto" />
                      <span>Mobile Money &amp; Carte</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Inscriptions</span>
                    <span className="font-medium text-[#8A5A00]">Sur invitation (Bêta)</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 px-1 pb-1">
                <button
                  type="button"
                  onClick={() =>
                    notify(
                      "Checklist d’ouverture Côte d’Ivoire : qualification télécom SIP & Genius Pay requise",
                    )
                  }
                  className="h-9 w-full rounded-xl border border-[#E5E5E5] bg-white text-[12.5px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                >
                  Vérifier les prérequis d’ouverture
                </button>
              </div>
            </article>

            {/* Nouveau marché */}
            <article className="flex flex-col justify-between rounded-2xl border border-dashed border-[#D4D4D8] bg-[#FAFAFA] p-5">
              <div>
                <span className="inline-flex size-10 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#171717] shadow-2xs">
                  <SolarIcon name="globe" className="size-5" />
                </span>
                <h3 className="mt-3 text-[16.5px] font-semibold text-[#171717]">
                  Nouveau marché
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-[#525252]">
                  Préparer l’ouverture d’un autre pays (Sénégal, Belgique, Suisse...). L’ouverture d’un marché exige une validation technique, commerciale et juridique complète : un simple bouton d’activation ne suffit jamais.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  notify("Dossier de qualification nouveau marché initialisé en mode Brouillon")
                }
                className="mt-4 h-9 w-full rounded-xl bg-[#171717] text-[12.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                + Préparer un dossier pays
              </button>
            </article>
          </div>

          {/* Tableau des 11 paramètres configurables par marché */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <h3 className="text-[16.5px] font-semibold text-[#171717]">
              Les 11 paramètres configurables par marché
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-[12.5px]">
              {[
                { p: "1. Pays", ex: "France, Côte d’Ivoire" },
                { p: "2. Devise", ex: "EUR (€), XOF (Franc CFA)" },
                { p: "3. Langues", ex: "Français, Anglais" },
                { p: "4. Moyens de paiement", ex: "Carte bancaire, SEPA, Mobile Money" },
                { p: "5. Prestataires de paiement", ex: "Stripe, Genius Pay selon qualification" },
                { p: "6. Téléphonie", ex: "Trunks SIP et numéros compatibles avec le pays" },
                { p: "7. Offres", ex: "Tarification et quotas locaux dédiés" },
                { p: "8. Fiscalité", ex: "TVA et règles fiscales applicables au marché" },
                { p: "9. Documents juridiques", ex: "Conditions spécifiques au pays" },
                { p: "10. Fonctionnalités", ex: "Disponibilité régionale par module" },
                { p: "11. Inscriptions", ex: "Ouvertes, fermées ou sur invitation" },
              ].map((row) => (
                <div
                  key={row.p}
                  className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3"
                >
                  <p className="font-semibold text-[#171717]">{row.p}</p>
                  <p className="mt-0.5 text-[#525252]">{row.ex}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          03. SOUS-ONGLET FONCTIONNALITÉS ET FLAGS (9 activées / 0 désactivée + 7 niveaux)
         ===================================================================== */}
      {activeTab === "flags" && (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xs sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-xl bg-[#DEF5EC] px-3.5 py-1.5 font-mono text-[13px] font-bold text-[#008064]">
                Fonctionnalités activées : {enabledFlagsCount}
              </span>
              <span className="rounded-xl bg-[#EFEFEF] px-3.5 py-1.5 font-mono text-[13px] font-bold text-[#525252]">
                Fonctionnalités désactivées : {disabledFlagsCount}
              </span>
              <span className="text-[12.5px] text-[#525252]">
                Toutes les fonctionnalités V1 restent prévues (aucun report en V2).
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setFlags(INITIAL_FEATURE_FLAGS);
                notify("Simulation réinitialisée : 9/9 fonctionnalités V1 activées");
              }}
              className="h-9 shrink-0 rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[12.5px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer whitespace-nowrap"
            >
              Réinitialiser la simulation
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flags.map((flg) => (
              <article
                key={flg.id}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs"
              >
                <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-[15.5px] font-semibold text-[#171717]">
                        {flg.name}
                      </h4>
                      <p className="text-[12.5px] text-[#525252]">{flg.subtitle}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFlags((prev) =>
                          prev.map((item) =>
                            item.id === flg.id
                              ? { ...item, enabled: !item.enabled }
                              : item,
                          ),
                        );
                        notify(
                          `Feature Flag « ${flg.name} » ${!flg.enabled ? "activé" : "désactivé en simulation"}`,
                        );
                      }}
                      className={`h-7 w-12 shrink-0 rounded-full p-1 transition cursor-pointer ${
                        flg.enabled ? "bg-[#408963]" : "bg-[#D4D4D8]"
                      }`}
                      aria-pressed={flg.enabled}
                    >
                      <span
                        className={`block size-5 rounded-full bg-white shadow-2xs transition-transform ${
                          flg.enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between border-t border-[#E5E5E5]/80 pt-2.5 text-[11.5px]">
                    <span className="text-[#737373]">Périmètre :</span>
                    <span className="rounded border border-[#E5E5E5] bg-white px-2 py-0.5 font-mono font-semibold text-[#171717]">
                      {flg.scope}
                    </span>
                  </div>
                </div>

                <p className="px-2 pt-2.5 pb-1 text-[11.5px] text-[#737373]">
                  {flg.dependencyNote}
                </p>
              </article>
            ))}
          </div>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xs">
            <h4 className="text-[15px] font-semibold text-[#171717]">
              Les 7 niveaux d’activation contrôlée &amp; Garde-fous Backend
            </h4>
            <p className="mt-0.5 text-[12.5px] text-[#525252]">
              Les Feature Flags ne remplacent jamais les contrôles de permissions du backend NestJS et tiennent compte des appels ou campagnes déjà en cours.
            </p>
            <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7 text-[12px]">
              {[
                { lvl: "Global", desc: "Toutes les entreprises éligibles" },
                { lvl: "Par marché", desc: "Uniquement certains pays" },
                { lvl: "Par offre", desc: "Starter, Pro ou Business" },
                { lvl: "Par entreprise", desc: "Sélection de tenants" },
                { lvl: "Bêta", desc: "Testeurs volontaires" },
                { lvl: "Progressif", desc: "Pourcentage de clients" },
                { lvl: "Urgence", desc: "Arrêt contrôlé (Kill-switch)" },
              ].map((it) => (
                <div
                  key={it.lvl}
                  className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-2.5"
                >
                  <p className="font-semibold text-[#171717]">{it.lvl}</p>
                  <p className="mt-0.5 text-[11px] text-[#737373]">{it.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          04. SOUS-ONGLET NOTIFICATIONS (Matrice 10 événements × Email / In-app / SMS)
         ===================================================================== */}
      {activeTab === "notifications" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="border-b border-[#EFEFEF] pb-4">
            <h3 className="text-[17px] font-semibold text-[#171717]">
              Notifications système de la plateforme AutoCall
            </h3>
            <p className="mt-0.5 text-[13.5px] text-[#737373]">
              Configuration des canaux par événement système. Les notifications obligatoires de sécurité ou de continuité de service sont distinguées des annonces produit facultatives.
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#EFEFEF] text-[12px] font-medium text-[#737373]">
                  <th className="py-3 pr-4">Événement</th>
                  <th className="px-3 py-3">Nature</th>
                  <th className="px-3 py-3 text-center">Email</th>
                  <th className="px-3 py-3 text-center">In-app</th>
                  <th className="py-3 pl-3 text-center">SMS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {notifRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-[#FAFAFA]">
                    <td className="py-3.5 pr-4 font-semibold text-[#171717]">
                      {rule.event}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span
                        className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${
                          rule.mandatorySecurityOrService
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : "bg-[#EFEFEF] text-[#525252]"
                        }`}
                      >
                        {rule.mandatorySecurityOrService
                          ? "Service / Sécurité obligatoire"
                          : "Produit (Opt-in facultatif)"}
                      </span>
                    </td>
                    {(["email", "inApp", "sms"] as const).map((channelKey) => {
                      const active = rule[channelKey];
                      return (
                        <td key={channelKey} className="px-3 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setNotifRules((prev) =>
                                prev.map((r) =>
                                  r.id === rule.id
                                    ? { ...r, [channelKey]: !r[channelKey] }
                                    : r,
                                ),
                              );
                              notify(`Canal ${channelKey} mis à jour pour « ${rule.event} »`);
                            }}
                            className={`inline-flex size-7 items-center justify-center rounded-lg border font-mono text-[12px] font-bold transition cursor-pointer ${
                              active
                                ? "border-[#408963] bg-[#EAF3ED] text-[#184D3B]"
                                : "border-[#E5E5E5] bg-white text-[#A3A3A3]"
                            }`}
                          >
                            {active ? "✓" : "—"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          05. SOUS-ONGLET BRANDING (Logotypes + Palette #008F6D/#171717/#FFFFFF/#F2F2F2 + Geist)
         ===================================================================== */}
      {activeTab === "branding" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Logotypes clair & sombre (5 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Logotypes officiels AutoCall
              </h3>
              <p className="mt-0.5 text-[13px] text-[#737373]">
                Identité graphique de référence (Layered Minimalism).
              </p>

              <div className="mt-4 space-y-3.5">
                <div className="flex items-center justify-between rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex size-8 items-center justify-center rounded-xl bg-[#171717] text-white">
                      <svg viewBox="0 0 64 64" className="size-5" fill="currentColor" aria-hidden="true">
                        <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
                      </svg>
                    </span>
                    <span className="text-[18px] font-bold tracking-tight text-[#171717]">
                      autocall
                    </span>
                  </div>
                  <span className="font-mono text-[11.5px] text-[#737373]">
                    Logo sur fond clair
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[#171717] bg-[#171717] p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex size-8 items-center justify-center rounded-xl bg-white text-[#171717]">
                      <svg viewBox="0 0 64 64" className="size-5" fill="currentColor" aria-hidden="true">
                        <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
                      </svg>
                    </span>
                    <span className="text-[18px] font-bold tracking-tight text-white">
                      autocall
                    </span>
                  </div>
                  <span className="font-mono text-[11.5px] text-[#A3A3A3]">
                    Logo sur fond sombre
                  </span>
                </div>
              </div>
            </section>

            {/* Palette principale & Typographie Geist (7 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Palette principale &amp; Typographie du Design System
              </h3>
              <p className="mt-0.5 text-[13px] text-[#737373]">
                Fondations verrouillées pour préserver la cohérence visuelle sur tous les écrans.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { name: "Accent", hex: "#008F6D", previewClass: "bg-[#008F6D]" },
                  { name: "Graphite", hex: "#171717", previewClass: "bg-[#171717]" },
                  {
                    name: "Surface",
                    hex: "#FFFFFF",
                    previewClass: "bg-white border border-[#E5E5E5]",
                  },
                  {
                    name: "Canvas",
                    hex: "#F2F2F2",
                    previewClass: "bg-[#F2F2F2] border border-[#E5E5E5]",
                  },
                ].map((sw) => (
                  <div
                    key={sw.name}
                    className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3"
                  >
                    <div className={`h-11 w-full rounded-lg ${sw.previewClass}`} />
                    <p className="mt-2 text-[13.5px] font-semibold text-[#171717]">
                      {sw.name}
                    </p>
                    <p className="font-mono text-[12px] text-[#737373]">{sw.hex}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[14.5px] font-semibold text-[#171717]">
                      Geist Sans
                    </span>
                    <span className="font-sans text-[18px] font-bold text-[#171717]">
                      Aa
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#525252]">
                    Typographie principale de l’interface
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[14.5px] font-semibold text-[#171717]">
                      Geist Mono
                    </span>
                    <span className="font-mono text-[16px] font-bold text-[#171717]">
                      01_ID
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#525252]">
                    Identifiants, montants et données techniques
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Ressources complémentaires */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <h4 className="text-[15.5px] font-semibold text-[#171717]">
              Ressources de marque complémentaires
            </h4>
            <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 text-[12.5px]">
              {[
                "Favicon & Icône PWA",
                "Logo des emails transactionnels",
                "Identité des factures PDF",
                "Images de partage social (OpenGraph)",
                "Identité de l’assistant Ask AI",
              ].map((asset) => (
                <div
                  key={asset}
                  className="flex items-center justify-between rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] px-3.5 py-3"
                >
                  <span className="font-medium text-[#171717]">{asset}</span>
                  <span className="rounded bg-[#DEF5EC] px-2 py-0.5 font-mono text-[10.5px] font-semibold text-[#008064]">
                    Actif
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          06. SOUS-ONGLET MODÈLES (5 modèles officiels FR/EN + Distinction 3 bibliothèques)
         ===================================================================== */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Liste des 5 modèles officiels (5 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Modèles de communication officiels
              </h3>
              <p className="mt-0.5 text-[13px] text-[#737373]">
                Emails et messages transactionnels envoyés par la plateforme AutoCall.
              </p>

              <div className="mt-4 space-y-2.5">
                {OFFICIAL_TEMPLATES.map((tpl) => {
                  const isSelected = tpl.id === selectedTemplate.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition cursor-pointer ${
                        isSelected
                          ? "border-[#171717] bg-[#F4F8F6]"
                          : "border-[#EFEFEF] bg-[#FAFAFA] hover:bg-white"
                      }`}
                    >
                      <span className="text-[14px] font-semibold text-[#171717]">
                        {tpl.title}
                      </span>
                      <span className="rounded border border-[#E5E5E5] bg-white px-2 py-0.5 font-mono text-[11px] text-[#525252]">
                        {tpl.domain}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Aperçu bilingue FR / EN du modèle sélectionné (7 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#171717]">
                    Aperçu du modèle — {selectedTemplate.title}
                  </h3>
                  <p className="mt-0.5 text-[12.5px] text-[#737373]">
                    Objet :{" "}
                    <strong>
                      {templateLang === "FR"
                        ? selectedTemplate.subjectFr
                        : selectedTemplate.subjectEn}
                    </strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-0.5">
                    {(["FR", "EN"] as const).map((lng) => (
                      <button
                        key={lng}
                        type="button"
                        onClick={() => setTemplateLang(lng)}
                        className={`h-7 rounded-md px-2.5 font-mono text-[11.5px] font-semibold cursor-pointer ${
                          templateLang === lng
                            ? "bg-[#171717] text-white"
                            : "text-[#525252]"
                        }`}
                      >
                        {lng}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className="h-8 rounded-lg bg-[#171717] px-3 text-[12px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
                  >
                    Copier
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#E5E5E5] bg-[#FAFBFB] p-5">
                <div className="mb-3 flex items-center gap-2 border-b border-[#EFEFEF] pb-3">
                  <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#171717] text-white">
                    <svg viewBox="0 0 64 64" className="size-3.5" fill="currentColor" aria-hidden="true">
                      <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
                    </svg>
                  </span>
                  <span className="text-[14px] font-bold text-[#171717]">autocall</span>
                </div>
                <pre className="font-sans text-[13.5px] leading-relaxed whitespace-pre-wrap text-[#171717]">
                  {templateLang === "FR"
                    ? selectedTemplate.bodyFr
                    : selectedTemplate.bodyEn}
                </pre>
              </div>
            </section>
          </div>

          {/* Distinction des 3 bibliothèques de modèles */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xs">
            <h4 className="text-[15px] font-semibold text-[#171717]">
              Séparation stricte des 3 bibliothèques de modèles
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 text-[12.5px]">
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                <p className="font-semibold text-[#171717]">1. Paramètres globaux (Ici)</p>
                <p className="mt-0.5 text-[#525252]">
                  Communications officielles et transactionnelles d’AutoCall.
                </p>
              </div>
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                <p className="font-semibold text-[#171717]">2. Module 08 · Support</p>
                <p className="mt-0.5 text-[#525252]">
                  Réponses types aux demandes d’assistance technique des clients.
                </p>
              </div>
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                <p className="font-semibold text-[#171717]">3. Campagnes Dashboard Client</p>
                <p className="mt-0.5 text-[#525252]">
                  Communications commerciales propres à chaque entreprise cliente.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          07. SOUS-ONGLET CMS (12 pages publiques + Éditeur des 14 sections Landing FR/EN)
         ===================================================================== */}
      {activeTab === "cms" && (
        <div className="space-y-6">
          {/* Grille des 12 pages publiques */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <h3 className="text-[17px] font-semibold text-[#171717]">
              Gestion des contenus du site public (getautocall.fr)
            </h3>
            <p className="mt-0.5 text-[13px] text-[#737373]">
              Les tarifs affichés sur le site proviennent directement du catalogue officiel du module <strong>03 · Facturation</strong>. Le CMS interdit la saisie de témoignages fictifs ou d’affirmations de conformité non vérifiées.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-[12.5px]">
              {CMS_PUBLIC_PAGES.map((pg) => (
                <div
                  key={pg.name}
                  className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3"
                >
                  <p className="font-semibold text-[#171717]">{pg.name}</p>
                  <p className="mt-0.5 text-[11.5px] text-[#737373]">{pg.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Éditeur interactif des 14 sections de la Landing Page */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Éditeur de la Landing Page — Accueil (14 sections · Brouillon local)
                </h3>
                <p className="mt-0.5 text-[13px] text-[#737373]">
                  Sélectionnez une section et prévisualisez vos modifications en français et en anglais avant publication.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(["FR", "EN"] as const).map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => setCmsLang(lng)}
                    className={`h-8 rounded-lg px-3 font-mono text-[12px] font-semibold cursor-pointer ${
                      cmsLang === lng
                        ? "bg-[#171717] text-white"
                        : "border border-[#E5E5E5] bg-white text-[#525252]"
                    }`}
                  >
                    {lng}
                  </button>
                ))}
              </div>
            </div>

            {/* Barre des 14 sections */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {LANDING_14_SECTIONS.map((sec) => (
                <button
                  key={sec.num}
                  type="button"
                  onClick={() => setSelectedCmsSection(sec.num)}
                  className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition cursor-pointer ${
                    selectedCmsSection === sec.num
                      ? "bg-[#171717] text-white font-semibold"
                      : "border border-[#E5E5E5] bg-[#FAFAFA] text-[#525252] hover:bg-white"
                  }`}
                >
                  <span className="mr-1 font-mono text-[11px] opacity-75">{sec.num}</span>
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Formulaire d'édition (6 col) */}
              <div className="space-y-3.5 lg:col-span-6">
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Titre principal ({cmsLang}) — Section {selectedCmsSection}
                  </label>
                  <input
                    type="text"
                    value={cmsLang === "FR" ? heroTitleFr : heroTitleEn}
                    onChange={(e) =>
                      cmsLang === "FR"
                        ? setHeroTitleFr(e.target.value)
                        : setHeroTitleEn(e.target.value)
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Description ({cmsLang})
                  </label>
                  <textarea
                    rows={3}
                    value={cmsLang === "FR" ? heroDescFr : heroDescEn}
                    onChange={(e) =>
                      cmsLang === "FR"
                        ? setHeroDescFr(e.target.value)
                        : setHeroDescEn(e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-[#E5E5E5] bg-white p-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setHistoryList((prev) => [
                      {
                        id: `rev-${Date.now()}`,
                        title: `Publication d’une mise à jour de la section ${selectedCmsSection}`,
                        moduleRef: "CMS",
                        revisionTag: `Révision ${prev.length + 21}`,
                        timestamp: "À l’instant",
                        actor: "Administrateur (root@autocall.fr)",
                        reason: "Mise à jour éditoriale validée depuis l’éditeur CMS",
                      },
                      ...prev,
                    ]);
                    notify(`Section ${selectedCmsSection} publiée avec création d’une nouvelle révision`);
                  }}
                  className="h-10 rounded-xl bg-[#171717] px-4 text-[13px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
                >
                  Valider et publier la révision CMS
                </button>
              </div>

              {/* Aperçu en direct (6 col) */}
              <div className="rounded-2xl border border-[#E5E5E5] bg-[#FAFBFB] p-6 lg:col-span-6">
                <span className="rounded-md bg-[#EAF3ED] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#184D3B]">
                  Aperçu en direct ({cmsLang})
                </span>
                <h4 className="mt-3 text-[20px] font-semibold leading-snug tracking-tight text-[#171717]">
                  {cmsLang === "FR" ? heroTitleFr : heroTitleEn}
                </h4>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#525252]">
                  {cmsLang === "FR" ? heroDescFr : heroDescEn}
                </p>
                <div className="mt-4">
                  <span className="inline-flex h-9 items-center rounded-xl bg-[#008F6D] px-4 text-[13px] font-semibold text-white">
                    {cmsLang === "FR" ? "Commencer" : "Get started"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          08. SOUS-ONGLET MAINTENANCE (29 nov. 2026 · 02h00–03h00 + Continuité appels)
         ===================================================================== */}
      {activeTab === "maintenance" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
            <div className="flex items-center justify-between rounded-xl border border-[#B9E8D2] bg-[#EAF3ED] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-[#15803D]" />
                <span className="text-[14px] font-semibold text-[#171717]">
                  Fonctionnement normal — Aucune maintenance active
                </span>
              </div>
              <span className="font-mono text-[11.5px] text-[#184D3B]">Production</span>
            </div>

            <div className="mt-5 rounded-2xl border border-[#EFEFEF] bg-[#FAFAFA] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-[11.5px] text-[#737373]">
                    Prochaine maintenance — exemple
                  </span>
                  <h3 className="text-[17px] font-semibold text-[#171717]">
                    Optimisation de la base de données
                  </h3>
                </div>
                <span
                  className={`rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                    maintStatus === "Planifiée"
                      ? "bg-[#DEF5EC] text-[#008064]"
                      : "bg-[#F0C869] text-[#5C3D00]"
                  }`}
                >
                  {maintStatus}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-[12.5px]">
                <div className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                  <span className="block text-[11px] text-[#737373]">Date</span>
                  <span className="font-semibold text-[#171717]">29 novembre 2026</span>
                </div>
                <div className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                  <span className="block text-[11px] text-[#737373]">Créneau</span>
                  <span className="font-mono font-semibold text-[#171717]">02h00 – 03h00</span>
                </div>
                <div className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                  <span className="block text-[11px] text-[#737373]">Périmètre</span>
                  <span className="font-semibold text-[#171717]">CRM et Acquisition</span>
                </div>
                <div className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                  <span className="block text-[11px] text-[#737373]">Environnement</span>
                  <span className="font-semibold text-[#171717]">Production</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[12px] text-[#525252]">
                  Synchronisation automatique avec <strong>status.getautocall.fr</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = maintStatus === "Brouillon" ? "Planifiée" : "Brouillon";
                    setMaintStatus(next);
                    notify(`Intervention du 29 nov. passée au statut « ${next} »`);
                  }}
                  className="h-9 rounded-xl bg-[#171717] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
                >
                  {maintStatus === "Brouillon"
                    ? "Approuver & Planifier"
                    : "Repasser en brouillon"}
                </button>
              </div>
            </div>
          </section>

          {/* Continuité des appels entrants et périmètres possibles (5 col) */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
            <h3 className="text-[16.5px] font-semibold text-[#171717]">
              Périmètres &amp; Continuité des appels entrants
            </h3>
            <div className="mt-3 space-y-3 text-[13px]">
              <div>
                <label className="block font-medium text-[#171717]">
                  Périmètre d’intervention
                </label>
                <PremiumSelect
                  value={maintScope}
                  onChange={setMaintScope}
                  ariaLabel="Périmètre de maintenance"
                  className="mt-1"
                  options={[
                    { value: "Application complète", label: "Application complète" },
                    {
                      value: "Module spécifique (CRM et Acquisition)",
                      label: "Module spécifique (CRM et Acquisition)",
                    },
                    { value: "Marché géographique", label: "Marché géographique" },
                    { value: "Service technique", label: "Service technique" },
                    { value: "Nouvelles inscriptions", label: "Nouvelles inscriptions" },
                  ]}
                />
              </div>

              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4 text-[12.5px] text-[#525252]">
                <p className="font-semibold text-[#171717]">
                  Comportement garanti pendant la fenêtre de maintenance :
                </p>
                <ul className="mt-2 space-y-1.5">
                  <li>
                    • <strong>Appels entrants en cours :</strong> maintenus sans coupure ou redirigés vers le numéro de secours humain du client.
                  </li>
                  <li>
                    • <strong>Prises de rendez-vous :</strong> mises en file d’attente Redis et synchronisées dès la réouverture.
                  </li>
                  <li>
                    • <strong>Automatisations BullMQ :</strong> mises en pause proprement puis reprises sans doublon.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          09. SOUS-ONGLET HISTORIQUE (Révisions 24 / 12 / 8 / 16 / 5 + Rollback par nouvelle révision)
         ===================================================================== */}
      {activeTab === "history" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="border-b border-[#EFEFEF] pb-4">
            <h3 className="text-[17px] font-semibold text-[#171717]">
              Historique des configurations — Journal des modifications globales
            </h3>
            <p className="mt-0.5 text-[13.5px] text-[#737373]">
              Un retour arrière (rollback) ne supprime jamais l’historique : il crée une nouvelle révision traçable restaurant l’état stable précédent.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {historyList.map((rev, idx) => (
              <div
                key={rev.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/80 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3.5">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white font-mono text-[12px] font-bold text-[#171717] shadow-2xs">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[14.5px] font-semibold text-[#171717]">
                        {rev.title}
                      </p>
                      <span className="rounded bg-[#EFEFEF] px-2 py-0.5 font-mono text-[11.5px] font-semibold text-[#171717]">
                        {rev.moduleRef} · {rev.revisionTag}
                      </span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-[#525252]">{rev.reason}</p>
                    <p className="mt-0.5 font-mono text-[11.5px] text-[#737373]">
                      {rev.timestamp} · {rev.actor}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const rollbackEntry: SettingsRevisionRecord = {
                      id: `rev-rb-${Date.now()}`,
                      title: `Rollback contrôlé vers « ${rev.title} »`,
                      moduleRef: rev.moduleRef,
                      revisionTag: `Révision ${historyList.length + 25} (Rollback)`,
                      timestamp: "À l’instant",
                      actor: "Administrateur (root@autocall.fr)",
                      reason: `Restauration de la ${rev.revisionTag} par création d’une nouvelle révision immuable`,
                    };
                    setHistoryList((prev) => [rollbackEntry, ...prev]);
                    notify(
                      `Nouvelle révision créée pour restaurer ${rev.revisionTag} (historique intégral conservé)`,
                    );
                  }}
                  className="h-8.5 shrink-0 rounded-xl border border-[#E5E5E5] bg-white px-3 text-[12px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer whitespace-nowrap"
                >
                  Restaurer via nouvelle révision
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

