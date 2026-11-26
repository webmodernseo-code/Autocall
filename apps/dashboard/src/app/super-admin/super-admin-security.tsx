"use client";

import { useMemo, useState } from "react";
import {
  GmailBrandSvg,
  TwilioBrandSvg,
  WhatsAppBusinessBrandSvg,
} from "../brand-icons";
import { type Locale, SolarIcon } from "../workspace-navigation";
import { type SuperAdminSectionNavTarget } from "./super-admin-overview";

// ---------------------------------------------------------------------------
// 01. AUTHENTIFICATION — 284 / 86 % / 38 / 3 + Courbe 7j + Événements récents
// ---------------------------------------------------------------------------

const AUTH_WEEKLY_ACTIVITY = [
  { day: "Lun.", success: 295, blocked: 6 },
  { day: "Mar.", success: 318, blocked: 5 },
  { day: "Mer.", success: 332, blocked: 8 },
  { day: "Jeu.", success: 310, blocked: 4 },
  { day: "Ven.", success: 340, blocked: 9 },
  { day: "Sam.", success: 185, blocked: 3 },
  { day: "Dim.", success: 162, blocked: 3 },
];

interface AuthSecurityEvent {
  id: string;
  title: string;
  subtitle: string;
  actor: string;
  ipRegion: string;
  severity: "À examiner" | "Protégé" | "Conforme";
  resolved: boolean;
}

const INITIAL_AUTH_EVENTS: AuthSecurityEvent[] = [
  {
    id: "ae-1",
    title: "Nouvel appareil détecté",
    subtitle: "Connexion inhabituelle à examiner",
    actor: "k.benali@mondo-services.fr",
    ipRegion: "Lyon, FR · Chrome macOS",
    severity: "À examiner",
    resolved: false,
  },
  {
    id: "ae-2",
    title: "Tentatives répétées de connexion",
    subtitle: "Limitation automatique appliquée",
    actor: "IP 185.220.101.44 (Compte inconnu)",
    ipRegion: "Rate-limit Redis activé après 5 essais",
    severity: "Protégé",
    resolved: true,
  },
  {
    id: "ae-3",
    title: "Authentification MFA réussie",
    subtitle: "Compte administrateur",
    actor: "root@autocall.fr",
    ipRegion: "Paris, FR · TOTP matériel vérifié",
    severity: "Conforme",
    resolved: true,
  },
];

// ---------------------------------------------------------------------------
// 02. DONNÉES — Isolation multi-tenant RLS & Chiffrement
// ---------------------------------------------------------------------------

interface DataProtectionControl {
  id: string;
  title: string;
  subtitle: string;
  status: "Tests réussis" | "Vérifié" | "À vérifier";
  technicalProof: string;
}

const INITIAL_DATA_CONTROLS: DataProtectionControl[] = [
  {
    id: "dc-rls",
    title: "Isolation des entreprises",
    subtitle: "Contrôles backend et politiques RLS",
    status: "Tests réussis",
    technicalProof:
      "Row-Level Security PostgreSQL (tenant_id obligatoire) + gardes NestJS interdisant tout croisement de contacts, conversations ou agents IA.",
  },
  {
    id: "dc-tls",
    title: "Chiffrement en transit",
    subtitle: "Connexions sécurisées TLS",
    status: "Vérifié",
    technicalProof:
      "TLS 1.3 strict sur les endpoints HTTPS, WebSockets temps réel et trunks SIP/SRTP.",
  },
  {
    id: "dc-rest",
    title: "Chiffrement au repos",
    subtitle: "Bases de données et stockage",
    status: "Vérifié",
    technicalProof:
      "Volumes PostgreSQL Neon et buckets S3 médias chiffrés en AES-256 avec clés managées.",
  },
  {
    id: "dc-secrets",
    title: "Gestion des secrets",
    subtitle: "Clés API et identifiants sensibles",
    status: "Vérifié",
    technicalProof:
      "Coffre serveur en écriture seule (write-only) · Aucun secret complet exposé dans l’UI ou les logs.",
  },
  {
    id: "dc-retention",
    title: "Conservation des données",
    subtitle: "Politiques de rétention",
    status: "À vérifier",
    technicalProof:
      "Validation juridique finale requise sur la durée d’archivage par défaut des enregistrements vocaux.",
  },
  {
    id: "dc-deletion",
    title: "Suppression des données",
    subtitle: "Procédures et contrôles d’effacement",
    status: "À vérifier",
    technicalProof:
      "Purge en cascade des médias S3 et index vectoriels après expiration du délai de grâce.",
  },
];

// ---------------------------------------------------------------------------
// 03. RGPD — Demandes de droits (RGPD-042 à RGPD-039) & 8 rubriques
// ---------------------------------------------------------------------------

interface GdprRequestRecord {
  id: string;
  reference: string;
  requestType: "Accès aux données" | "Effacement" | "Portabilité" | "Rectification";
  companyName: string;
  requesterEmail: string;
  receivedAt: string;
  legalDeadline: string;
  status: "En cours" | "À vérifier" | "Terminée";
}

const INITIAL_GDPR_REQUESTS: GdprRequestRecord[] = [
  {
    id: "gdpr-42",
    reference: "RGPD-042",
    requestType: "Accès aux données",
    companyName: "Nova Services",
    requesterEmail: "dpo@nova-services.fr",
    receivedAt: "23 nov. 2026",
    legalDeadline: "Dans 27 jours",
    status: "En cours",
  },
  {
    id: "gdpr-41",
    reference: "RGPD-041",
    requestType: "Effacement",
    companyName: "Clean Studio",
    requesterEmail: "contact@clean-studio.fr",
    receivedAt: "21 nov. 2026",
    legalDeadline: "Dans 25 jours",
    status: "À vérifier",
  },
  {
    id: "gdpr-40",
    reference: "RGPD-040",
    requestType: "Portabilité",
    companyName: "Atlas Immobilier",
    requesterEmail: "direction@atlas-immo.fr",
    receivedAt: "18 nov. 2026",
    legalDeadline: "Dans 22 jours",
    status: "En cours",
  },
  {
    id: "gdpr-39",
    reference: "RGPD-039",
    requestType: "Rectification",
    companyName: "Mondo Services",
    requesterEmail: "k.benali@mondo-services.fr",
    receivedAt: "10 nov. 2026",
    legalDeadline: "Clôturée dans les délais",
    status: "Terminée",
  },
];

const GDPR_GOVERNANCE_PILLARS = [
  {
    title: "Demandes de droits",
    desc: "Accès, rectification, effacement, opposition, limitation et portabilité selon leur applicabilité.",
  },
  {
    title: "Consentements",
    desc: "Historique horodaté des consentements lorsqu’ils constituent la base juridique retenue.",
  },
  {
    title: "Conservation",
    desc: "Durées de conservation paramétrées par catégorie de données (audio, transcriptions, factures).",
  },
  {
    title: "Sous-traitants",
    desc: "Liste et DPA des prestataires participant au traitement (Twilio, ElevenLabs, OpenAI, Neon, Stripe).",
  },
  {
    title: "Localisation",
    desc: "Régions d’hébergement EU-West (Francfort / Dublin) et encadrement des transferts.",
  },
  {
    title: "Registre des traitements",
    desc: "Documentation distincte des rôles Responsable de traitement vs Sous-traitant AutoCall.",
  },
  {
    title: "Documents juridiques",
    desc: "Versions, dates d’entrée en vigueur et historique des CGU, CGV et politique de confidentialité.",
  },
  {
    title: "Violations de données",
    desc: "Procédure d’évaluation 72h, documentation et suivi des notifications réglementaires.",
  },
];

// ---------------------------------------------------------------------------
// 04. GOUVERNANCE IA — SÉCURITÉ (Risques de sécurité IA ≠ Qualité Module 07)
// ---------------------------------------------------------------------------

const AI_SECURITY_CONTROLS = [
  {
    id: "ais-perm",
    title: "Respect des permissions (Application Backend)",
    desc: "Empêcher les actions non autorisées : les restrictions d’outils sont imposées par le backend NestJS et jamais uniquement par le prompt système.",
    status: "Actif · 42 blocages ce mois",
  },
  {
    id: "ais-inj",
    title: "Protection contre les injections de prompt",
    desc: "Détecter et neutraliser les instructions malveillantes visant à détourner l’agent vocal ou extraire ses consignes internes.",
    status: "Actif · 12 tentatives bloquées",
  },
  {
    id: "ais-pii",
    title: "Protection des données confidentielles",
    desc: "Interdire toute divulgation massive de la base de contacts ou des informations d’un autre client lors d’un appel.",
    status: "Actif · 0 fuite",
  },
  {
    id: "ais-hitl",
    title: "Validation humaine (Human-in-the-loop)",
    desc: "Soumettre les opérations sensibles ou irréversibles à l’approbation explicite d’un collaborateur autorisé.",
    status: "Actif · Garde-fou obligatoire",
  },
  {
    id: "ais-mem",
    title: "Isolation de la mémoire IA",
    desc: "Cloisonner strictement les contextes RAG et historiques par tenant_id afin d’empêcher toute contamination inter-entreprises.",
    status: "Actif · Vérifié par tests RLS",
  },
];

// ---------------------------------------------------------------------------
// 06. AUDIT — Journal d'audit immuable des opérations sensibles
// ---------------------------------------------------------------------------

interface SecurityAuditEntry {
  id: string;
  time: string;
  action: string;
  resourceModule: string;
  actor: "Administrateur" | "Système";
  actorDetail: string;
  reason: string;
  outcome: "Réussi" | "Bloqué";
}

const AUDIT_LOG_ENTRIES: SecurityAuditEntry[] = [
  {
    id: "aud-1",
    time: "17:42",
    action: "Modification des permissions",
    resourceModule: "Entreprise (Nova Services)",
    actor: "Administrateur",
    actorDetail: "root@autocall.fr (MFA)",
    reason: "Vérification des droits outils de l’agent d’accueil suite au ticket TK-1042",
    outcome: "Réussi",
  },
  {
    id: "aud-2",
    time: "16:18",
    action: "Rotation d’une clé API",
    resourceModule: "Fournisseurs (ElevenLabs Production)",
    actor: "Administrateur",
    actorDetail: "root@autocall.fr (MFA)",
    reason: "Rotation préventive trimestrielle sans interruption (•••• 8f2a)",
    outcome: "Réussi",
  },
  {
    id: "aud-3",
    time: "15:32",
    action: "Blocage d’une action non autorisée",
    resourceModule: "Agent IA (Assistant commercial)",
    actor: "Système",
    actorDetail: "PolicyGuard NestJS",
    reason: "Tentative d’extraction de liste de contacts refusée par le contrôleur backend",
    outcome: "Bloqué",
  },
  {
    id: "aud-4",
    time: "14:26",
    action: "Ouverture d’un diagnostic",
    resourceModule: "Support (Session 30 min · TK-1042)",
    actor: "Administrateur",
    actorDetail: "root@autocall.fr (Consentement + MFA)",
    reason: "Diagnostic en lecture seule autorisé par Claire Moreau",
    outcome: "Réussi",
  },
  {
    id: "aud-5",
    time: "11:04",
    action: "Publication d’une offre",
    resourceModule: "Facturation (Catalogue v2026.2)",
    actor: "Administrateur",
    actorDetail: "root@autocall.fr (MFA)",
    reason: "Création d’une version tarifaire immuable sans modifier les contrats existants",
    outcome: "Réussi",
  },
  {
    id: "aud-6",
    time: "09:45",
    action: "Tentative de connexion suspecte",
    resourceModule: "Authentification",
    actor: "Système",
    actorDetail: "RateLimiter Redis",
    reason: "5 échecs consécutifs depuis une IP non reconnue · Verrouillage temporaire",
    outcome: "Bloqué",
  },
];

// ---------------------------------------------------------------------------
// 07. RISQUES — Matrice de criticité QHSE 5×5 & Registre des 7 risques numériques
// ---------------------------------------------------------------------------

interface DigitalRiskRecord {
  id: string;
  title: string;
  probability: number; // 1..5
  severity: number; // 1..5
  mitigation: string;
  residualScore: string;
  owner: string;
}

const DIGITAL_RISKS_REGISTER: DigitalRiskRecord[] = [
  {
    id: "rsk-leak",
    title: "Fuite de données",
    probability: 4,
    severity: 5,
    mitigation: "Chiffrement TLS/AES-256, contrôle des accès, surveillance et masquage des logs.",
    residualScore: "5/25 (Modéré)",
    owner: "Direction Technique & Sécurité",
  },
  {
    id: "rsk-tenant",
    title: "Accès inter-entreprises",
    probability: 3,
    severity: 5,
    mitigation: "Politiques PostgreSQL RLS (tenant_id) et tests d’isolation automatisés en CI.",
    residualScore: "5/25 (Modéré)",
    owner: "Architecte Backend",
  },
  {
    id: "rsk-admin",
    title: "Compromission administrateur",
    probability: 3,
    severity: 5,
    mitigation: "MFA obligatoire, réauthentification TOTP sur actions critiques et journal d’audit.",
    residualScore: "5/25 (Modéré)",
    owner: "Super Admin Root",
  },
  {
    id: "rsk-keys",
    title: "Vol de clés API",
    probability: 3,
    severity: 4,
    mitigation: "Coffre de secrets en écriture seule (write-only) et rotation en 6 étapes sans coupure.",
    residualScore: "4/25 (Faible)",
    owner: "Responsable Infrastructure",
  },
  {
    id: "rsk-ai",
    title: "Actions IA non autorisées",
    probability: 4,
    severity: 4,
    mitigation: "Permissions vérifiées côté backend NestJS et approbation humaine sur actions sensibles.",
    residualScore: "4/25 (Faible)",
    owner: "Gouvernance IA",
  },
  {
    id: "rsk-loss",
    title: "Perte de données",
    probability: 2,
    severity: 5,
    mitigation: "Sauvegardes quotidiennes chiffrées, PITR continu et tests de restauration isolés.",
    residualScore: "5/25 (Modéré)",
    owner: "Responsable Infrastructure",
  },
  {
    id: "rsk-abuse",
    title: "Communications abusives",
    probability: 4,
    severity: 3,
    mitigation: "Quotas atomiques, listes d’opposition (opt-out), vérification SPF/DKIM/DMARC et surveillance.",
    residualScore: "3/25 (Faible)",
    owner: "Conformité Télécom",
  },
];

// ---------------------------------------------------------------------------
// 08. INCIDENTS DE SÉCURITÉ — Cycle en 7 étapes & SEC-0021
// ---------------------------------------------------------------------------

const SECURITY_INCIDENT_STEPS = [
  { step: "Détection", desc: "Identifier l’événement suspect." },
  {
    step: "Qualification",
    desc: "Évaluer la nature, la gravité et les obligations de notification.",
  },
  {
    step: "Confinement",
    desc: "Limiter la propagation et révoquer les accès exposés.",
  },
  {
    step: "Investigation",
    desc: "Identifier les causes racines et le périmètre exact affecté.",
  },
  { step: "Correction", desc: "Traiter les vulnérabilités ou causes identifiées." },
  { step: "Rétablissement", desc: "Restaurer et vérifier l’intégrité des accès." },
  {
    step: "Retour d’expérience",
    desc: "Documenter et renforcer les mesures de maîtrise QHSE.",
  },
] as const;

function getMatrixCellColor(score: number, isSelected: boolean): string {
  const ring = isSelected ? "ring-2 ring-[#171717] scale-[1.03]" : "";
  if (score >= 16) return `bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5] ${ring}`;
  if (score >= 10) return `bg-[#F0C869] text-[#5C3D00] border-[#E5B84B] ${ring}`;
  if (score >= 5) return `bg-[#FEF9C3] text-[#713F12] border-[#FDE047] ${ring}`;
  return `bg-[#DEF5EC] text-[#008064] border-[#B9E8D2] ${ring}`;
}

export function SuperAdminSecurity({
  activeTab,
  onSelectTab,
  onNavigate,
}: {
  activeTab: string;
  locale: Locale;
  onSelectTab: (tabId: string) => void;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  // 01. Authentification
  const [authEvents, setAuthEvents] = useState<AuthSecurityEvent[]>(INITIAL_AUTH_EVENTS);

  // 02. Données
  const [dataControls, setDataControls] =
    useState<DataProtectionControl[]>(INITIAL_DATA_CONTROLS);

  // 03. RGPD
  const [gdprRequests, setGdprRequests] =
    useState<GdprRequestRecord[]>(INITIAL_GDPR_REQUESTS);

  // 06. Audit
  const [auditFilter, setAuditFilter] = useState<"Tous" | "Réussi" | "Bloqué">("Tous");
  const [auditSearch, setAuditSearch] = useState("");

  // 07. Risques (Matrice 5x5 interactive : par défaut Probabilité 4 x Gravité 5 = 20/25 Fuite de données)
  const [selectedProb, setSelectedProb] = useState<number>(4);
  const [selectedSev, setSelectedSev] = useState<number>(5);

  // 08. Incidents de sécurité (SEC-0021)
  const [secIncidentStepIdx, setSecIncidentStepIdx] = useState<number>(3); // Investigation

  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const filteredAuditLogs = useMemo(() => {
    return AUDIT_LOG_ENTRIES.filter((entry) => {
      const matchesOutcome =
        auditFilter === "Tous" ? true : entry.outcome === auditFilter;
      const q = auditSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        entry.action.toLowerCase().includes(q) ||
        entry.resourceModule.toLowerCase().includes(q) ||
        entry.actorDetail.toLowerCase().includes(q);
      return matchesOutcome && matchesSearch;
    });
  }, [auditFilter, auditSearch]);

  const matchingRisk = useMemo(() => {
    return (
      DIGITAL_RISKS_REGISTER.find(
        (r) => r.probability === selectedProb && r.severity === selectedSev,
      ) ?? DIGITAL_RISKS_REGISTER[0]
    );
  }, [selectedProb, selectedSev]);

  const selectedCriticityScore = selectedProb * selectedSev;

  return (
    <div className="mt-7 space-y-7">
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-[#E5E5E5] bg-[#171717] px-4 py-3 text-[13.5px] font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Bandeau supérieur : Centre de protection, conformité RGPD et maîtrise des risques */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-2xs lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
          <span className="inline-flex size-2 shrink-0 rounded-full bg-[#008F6D]" />
          <span>
            <strong className="font-semibold text-[var(--foreground)]">
              11 · Sécurité, Conformité &amp; Risques :
            </strong>{" "}
            MFA obligatoire pour les administrateurs, isolation multi-tenant RLS, garde-fous IA appliqués côté backend et journal d’audit immuable.
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("ai-governance", "validation")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>07 · Validation IA</span>
            <span className="text-[#737373]">→</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("audit")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>Journal d’audit</span>
            <span className="text-[#737373]">→</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          01. SOUS-ONGLET AUTHENTIFICATION (284 / 86 % / 38 / 3 + Courbe 7j)
         ===================================================================== */}
      {activeTab === "authentication" && (
        <div className="space-y-6">
          {/* 4 cartes KPI double surface avec badges d'icônes : 284 / 86 % / 38 / 3 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="crm" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Sessions actives
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  284
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[var(--text-muted)]">
                Jetons de session chiffrés et révocables à chaud
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="settings" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Comptes protégés par MFA
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  {"86 %"}
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                100 % obligatoire sur Super Admin · Facultatif clients
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Tentatives bloquées
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  38
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[var(--text-muted)]">
                Freinage automatique (Rate-limiting) sur 7 jours
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bell" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Alertes à examiner
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  3
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#8A5A00]">
                ● Connexions depuis un nouvel appareil ou pays
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Activité des connexions Lun -> Dim (7 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#171717]">
                    Activité des connexions (7 derniers jours)
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#737373]">
                    Échelle 0 à 340 · Connexions réussies face aux tentatives bloquées automatiquement.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[12px] font-medium text-[#525252]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-[#408963]" />
                    <span>Connexions réussies</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-[#B91C1C]" />
                    <span>Tentatives bloquées</span>
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-7 gap-3 pt-2">
                {AUTH_WEEKLY_ACTIVITY.map((pt) => {
                  const okPct = Math.round((pt.success / 340) * 100);
                  const blkPct = Math.max(8, Math.round((pt.blocked / 40) * 100));
                  return (
                    <div key={pt.day} className="flex flex-col items-center">
                      <span className="mb-1.5 font-mono text-[11px] font-semibold text-[#525252] tabular-nums">
                        {pt.success} / {pt.blocked}
                      </span>
                      <div className="flex h-44 w-full items-end justify-center gap-1.5 rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-2 py-2.5">
                        <div
                          style={{ height: `${okPct}%` }}
                          className="w-3.5 rounded-t-sm bg-[#408963]"
                          title={`${pt.day} : ${pt.success} connexions réussies`}
                        />
                        <div
                          style={{ height: `${blkPct}%` }}
                          className="w-3.5 rounded-t-sm bg-[#B91C1C]"
                          title={`${pt.day} : ${pt.blocked} tentatives bloquées`}
                        />
                      </div>
                      <span className="mt-2 text-[12.5px] font-medium text-[#525252]">
                        {pt.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Événements récents d'authentification (5 col) */}
            <section className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Événements d’accès récents
                </h3>
                <p className="mt-0.5 text-[13px] text-[#737373]">
                  Détection des nouveaux appareils, freinage anti-brute-force et vérifications MFA.
                </p>

                <div className="mt-4 space-y-3">
                  {authEvents.map((ev) => (
                    <article
                      key={ev.id}
                      className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/80 p-3.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-[14px] font-semibold text-[#171717]">
                              {ev.title}
                            </h4>
                            <span
                              className={`rounded-md px-2 py-0.5 font-mono text-[10.5px] font-semibold ${
                                ev.severity === "À examiner"
                                  ? "bg-[#F0C869] text-[#5C3D00]"
                                  : "bg-[#DEF5EC] text-[#008064]"
                              }`}
                            >
                              {ev.severity}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[12.5px] text-[#525252]">{ev.subtitle}</p>
                          <p className="mt-1 font-mono text-[11.5px] text-[#737373]">
                            {ev.actor} · {ev.ipRegion}
                          </p>
                        </div>

                        {!ev.resolved && (
                          <button
                            type="button"
                            onClick={() => {
                              setAuthEvents((prev) =>
                                prev.map((item) =>
                                  item.id === ev.id
                                    ? { ...item, resolved: true, severity: "Protégé" }
                                    : item,
                                ),
                              );
                              notify("Session inhabituelle révoquée et utilisateur notifié");
                            }}
                            className="h-8 shrink-0 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[11.5px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer whitespace-nowrap"
                          >
                            Révoquer session
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* =====================================================================
          02. SOUS-ONGLET DONNÉES (Isolation multi-tenant RLS + 6 contrôles de protection)
         ===================================================================== */}
      {activeTab === "data" && (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs sm:flex-row sm:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Protection des données &amp; Isolation multi-tenant
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Une entreprise cliente ne doit jamais pouvoir accéder aux contacts, conversations ou agents IA d’une autre entreprise.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setDataControls((prev) =>
                  prev.map((c) => ({
                    ...c,
                    status: c.id === "dc-rls" ? "Tests réussis" : "Vérifié",
                  })),
                );
                notify("6/6 contrôles de protection des données et politiques RLS vérifiés");
              }}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#171717] px-4 text-[13px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
            >
              Valider les contrôles en attente
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dataControls.map((ctrl) => (
              <article
                key={ctrl.id}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs"
              >
                <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#171717] shadow-2xs">
                      <SolarIcon name="settings" className="size-4" />
                    </span>
                    <span
                      className={`rounded-md px-2.5 py-0.5 font-mono text-[11px] font-semibold whitespace-nowrap ${
                        ctrl.status === "À vérifier"
                          ? "bg-[#F0C869] text-[#5C3D00]"
                          : "bg-[#DEF5EC] text-[#008064]"
                      }`}
                    >
                      ● {ctrl.status}
                    </span>
                  </div>

                  <h4 className="mt-3 text-[15.5px] font-semibold text-[#171717]">
                    {ctrl.title}
                  </h4>
                  <p className="text-[12.5px] font-medium text-[#525252]">
                    {ctrl.subtitle}
                  </p>
                </div>

                <p className="px-2 pt-3 pb-1 text-[12px] leading-relaxed text-[#525252]">
                  {ctrl.technicalProof}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          03. SOUS-ONGLET RGPD (4 Demandes ouvertes / 28 Traitées / 3 Contrôles / 0 Hors délai)
         ===================================================================== */}
      {activeTab === "gdpr" && (
        <div className="space-y-6">
          {/* 4 cartes KPI double surface : 4 / 28 / 3 / 0 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Demandes ouvertes",
                value: "4",
                caption: "Droits d’accès, effacement et portabilité en cours",
                tone: "text-[var(--text-muted)]",
              },
              {
                label: "Demandes traitées",
                value: "28",
                caption: "Dossiers clôturés avec preuve d’exécution",
                tone: "text-[#008F6D] font-medium",
              },
              {
                label: "Contrôles à vérifier",
                value: "3",
                caption: "Qualifications juridiques avant commercialisation",
                tone: "text-[#8A5A00] font-medium",
              },
              {
                label: "Demandes hors délai",
                value: "0",
                caption: "Respect à 100 % du délai légal de 30 jours",
                tone: "text-[#008F6D] font-medium",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs"
              >
                <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                  <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                    {item.value}
                  </p>
                </div>
                <p className={`px-2.5 pt-2.5 pb-1 text-[12px] ${item.tone}`}>
                  {item.caption}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Tableau des demandes RGPD-042 à RGPD-039 (6 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-6">
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Demandes relatives aux données personnelles
              </h3>
              <p className="mt-0.5 text-[13px] text-[#737373]">
                Suivi opérationnel des demandes d’exercice de droits RGPD.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[460px] border-collapse text-left text-[13.5px]">
                  <thead>
                    <tr className="border-b border-[#EFEFEF] text-[12px] font-medium text-[#737373]">
                      <th className="py-3 pr-3">Référence</th>
                      <th className="px-3 py-3">Demande &amp; Entreprise</th>
                      <th className="px-3 py-3">Statut</th>
                      <th className="py-3 pl-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F2F2]">
                    {gdprRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[#FAFAFA]">
                        <td className="py-3.5 pr-3 font-mono font-bold text-[#171717] whitespace-nowrap">
                          {req.reference}
                        </td>
                        <td className="px-3 py-3.5">
                          <p className="font-semibold text-[#171717]">{req.requestType}</p>
                          <p className="text-[12px] text-[#737373]">
                            {req.companyName} · {req.legalDeadline}
                          </p>
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span
                            className={`rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                              req.status === "Terminée"
                                ? "bg-[#DEF5EC] text-[#008064]"
                                : req.status === "À vérifier"
                                  ? "bg-[#F0C869] text-[#5C3D00]"
                                  : "bg-[#E4EEFE] text-[#1D4ED8]"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                          {req.status !== "Terminée" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setGdprRequests((prev) =>
                                  prev.map((item) =>
                                    item.id === req.id
                                      ? { ...item, status: "Terminée" }
                                      : item,
                                  ),
                                );
                                notify(`Dossier ${req.reference} traité et attesté`);
                              }}
                              className="h-8 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[12px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                            >
                              Clôturer
                            </button>
                          ) : (
                            <span className="font-mono text-[11.5px] text-[#737373]">
                              Archivé
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Les 8 rubriques de gouvernance RGPD (6 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-6">
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Éléments administrés dans le référentiel RGPD
              </h3>
              <p className="mt-0.5 text-[13px] text-[#737373]">
                Répartition claire des responsabilités entre AutoCall et ses entreprises clientes.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-[12.5px]">
                {GDPR_GOVERNANCE_PILLARS.map((pil) => (
                  <div
                    key={pil.title}
                    className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3"
                  >
                    <p className="font-semibold text-[#171717]">{pil.title}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-[#525252]">
                      {pil.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* =====================================================================
          04. SOUS-ONGLET GOUVERNANCE IA — SÉCURITÉ (42 / 3 / 12 / 0 + 5 contrôles backend)
         ===================================================================== */}
      {activeTab === "ai-security" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Actions non autorisées bloquées",
                value: "42",
                caption: "Refusées par le contrôleur de permissions NestJS",
              },
              {
                label: "Alertes IA à examiner",
                value: "3",
                caption: "Tentatives de contournement de périmètre métier",
              },
              {
                label: "Tentatives d’injection détectées",
                value: "12",
                caption: "Prompt injections neutralisées avant exécution d’outil",
              },
              {
                label: "Violations confirmées",
                value: "0",
                caption: "Aucune fuite inter-tenant ni action financière non autorisée",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs"
              >
                <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                  <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                    {kpi.label}
                  </p>
                  <p className="mt-2 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                    {kpi.value}
                  </p>
                </div>
                <p className="px-2.5 pt-2.5 pb-1 text-[12px] text-[var(--text-muted)]">
                  {kpi.caption}
                </p>
              </div>
            ))}
          </div>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="border-b border-[#EFEFEF] pb-4">
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Contrôles de sécurité des agents IA (Sécurité ≠ Qualité Module 07)
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Exemple concret : si un interlocuteur demande à un agent vocal de lui communiquer toute la base de contacts d’une entreprise, l’action est bloquée par le backend même si le modèle de langage est sollicité.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {AI_SECURITY_CONTROLS.map((ctrl) => (
                <div
                  key={ctrl.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/80 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#171717]">
                      {ctrl.title}
                    </h4>
                    <p className="mt-0.5 text-[13px] text-[#525252]">{ctrl.desc}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-[#DEF5EC] px-2.5 py-1 font-mono text-[11.5px] font-semibold text-[#008064] whitespace-nowrap">
                    ● {ctrl.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          05. SOUS-ONGLET COMMUNICATIONS (Téléphonie, Email SPF/DKIM/DMARC, WhatsApp, Réseaux)
         ===================================================================== */}
      {activeTab === "communications" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {[
            {
              title: "Téléphonie",
              subtitle:
                "Enregistrements, appels frauduleux, accès aux transcriptions et utilisation abusive.",
              controls: [
                "Plafond anti-fraude sur les destinations internationales à surcoût",
                "Annonce d’enregistrement vocal et respect des plages horaires légales",
                "Chiffrement des enregistrements et accès restreint par rôle",
              ],
              badge: "Protégé · Trunk Twilio SIP",
              logo: "twilio",
            },
            {
              title: "Email (SPF · DKIM · DMARC)",
              subtitle:
                "Envois abusifs, réputation des domaines, authentification et désinscription.",
              controls: [
                "Vérification obligatoire des enregistrements DNS SPF, DKIM et DMARC",
                "Lien de désinscription (opt-out) en 1 clic et surveillance du taux de rebond",
                "Blocage automatique des campagnes dépassant le seuil de signalement spam",
              ],
              badge: "DNS Authentifié",
              logo: "gmail",
            },
            {
              title: "WhatsApp",
              subtitle:
                "Permissions, modèles autorisés, opposition et protection des échanges.",
              controls: [
                "Envoi hors fenêtre 24h limité aux modèles (Templates) approuvés",
                "Prise en compte immédiate du mot-clé STOP dans la liste d’opposition",
                "Vérification de signature HMAC sur chaque webhook entrant",
              ],
              badge: "Conforme Meta Business",
              logo: "whatsapp",
            },
            {
              title: "Réseaux sociaux",
              subtitle:
                "Autorisations de publication, comptes connectés et accès aux identifiants.",
              controls: [
                "Jetons OAuth chiffrés au repos et révocables à tout moment par le client",
                "Périmètre de publication limité aux pages explicitement sélectionnées",
                "Journalisation de chaque publication automatisée ou assistée",
              ],
              badge: "OAuth Scellé",
              logo: "social",
            },
          ].map((chan) => (
            <article
              key={chan.title}
              className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs"
            >
              <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-2 text-[#171717] shadow-2xs">
                      {chan.logo === "twilio" ? (
                        <TwilioBrandSvg className="size-full" />
                      ) : chan.logo === "gmail" ? (
                        <GmailBrandSvg className="size-full" />
                      ) : chan.logo === "whatsapp" ? (
                        <WhatsAppBusinessBrandSvg className="size-full" />
                      ) : (
                        <SolarIcon name="social" className="size-4.5" />
                      )}
                    </span>
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#171717]">
                        {chan.title}
                      </h3>
                      <p className="text-[12.5px] text-[#525252]">{chan.subtitle}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-md bg-[#DEF5EC] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#008064] whitespace-nowrap">
                    {chan.badge}
                  </span>
                </div>

                <ul className="mt-4 space-y-1.5 border-t border-[#E5E5E5]/80 pt-3 text-[12.5px] text-[#525252]">
                  {chan.controls.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* =====================================================================
          06. SOUS-ONGLET AUDIT (Journal immuable des opérations sensibles)
         ===================================================================== */}
      {activeTab === "audit" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="flex flex-col justify-between gap-3 border-b border-[#EFEFEF] pb-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Journal d’audit — Traçabilité des opérations sensibles
                </h3>
                <span className="rounded-md bg-[#171717] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white">
                  APPEND-ONLY
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-[#737373]">
                Protégé contre toute modification ou suppression non autorisée, y compris pour les actions du Super Administrateur.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["Tous", "Réussi", "Bloqué"] as const).map((flt) => (
                <button
                  key={flt}
                  type="button"
                  onClick={() => setAuditFilter(flt)}
                  className={`h-8.5 rounded-xl px-3 text-[12px] font-semibold transition cursor-pointer ${
                    auditFilter === flt
                      ? "bg-[#171717] text-white"
                      : "border border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F7F7F8]"
                  }`}
                >
                  {flt}
                </button>
              ))}
              <input
                type="search"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Rechercher une action..."
                className="h-8.5 rounded-xl border border-[#E5E5E5] bg-white px-3 text-[12.5px] text-[#171717] outline-none focus:border-[#171717]"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#EFEFEF] text-[12px] font-medium text-[#737373]">
                  <th className="py-3 pr-3">Heure</th>
                  <th className="px-3 py-3">Action &amp; Ressource</th>
                  <th className="px-3 py-3">Auteur</th>
                  <th className="px-3 py-3">Motif / Contexte</th>
                  <th className="py-3 pl-3 text-right">Résultat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {filteredAuditLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#FAFAFA]">
                    <td className="py-3.5 pr-3 font-mono text-[12.5px] font-semibold text-[#525252] whitespace-nowrap">
                      {entry.time}
                    </td>
                    <td className="px-3 py-3.5">
                      <p className="font-semibold text-[#171717]">{entry.action}</p>
                      <p className="text-[12px] text-[#737373]">{entry.resourceModule}</p>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <p className="font-medium text-[#171717]">{entry.actor}</p>
                      <p className="font-mono text-[11.5px] text-[#737373]">
                        {entry.actorDetail}
                      </p>
                    </td>
                    <td className="px-3 py-3.5 text-[12.5px] text-[#525252]">
                      {entry.reason}
                    </td>
                    <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                      <span
                        className={`rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                          entry.outcome === "Réussi"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : "bg-[#FEE2E2] text-[#B91C1C]"
                        }`}
                      >
                        {entry.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          07. SOUS-ONGLET RISQUES (Matrice de criticité QHSE 5×5 + Registre des 7 risques)
         ===================================================================== */}
      {activeTab === "risks" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Matrice de criticité 5x5 interactive (5 col) */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
            <h3 className="text-[17px] font-semibold text-[#171717]">
              Matrice de criticité 5 × 5 (Approche QHSE)
            </h3>
            <p className="mt-0.5 text-[13px] text-[#737373]">
              Cliquez sur une cellule (Probabilité × Gravité) pour inspecter la criticité.
            </p>

            <div className="mt-5 space-y-2">
              {[5, 4, 3, 2, 1].map((prob) => (
                <div key={prob} className="flex items-center gap-2">
                  <span className="w-6 font-mono text-[12px] font-bold text-[#737373] text-right">
                    P{prob}
                  </span>
                  <div className="grid flex-1 grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((sev) => {
                      const score = prob * sev;
                      const isSelected =
                        prob === selectedProb && sev === selectedSev;
                      return (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => {
                            setSelectedProb(prob);
                            setSelectedSev(sev);
                          }}
                          className={`h-10 rounded-xl border font-mono text-[13px] font-bold transition cursor-pointer tabular-nums ${getMatrixCellColor(
                            score,
                            isSelected,
                          )}`}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <span className="w-6" />
                <div className="grid flex-1 grid-cols-5 gap-2 text-center font-mono text-[11.5px] font-semibold text-[#737373]">
                  <span>G1</span>
                  <span>G2</span>
                  <span>G3</span>
                  <span>G4</span>
                  <span>G5</span>
                </div>
              </div>
            </div>

            {/* Encart Criticité sélectionnée */}
            <div className="mt-5 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#737373]">
                  Criticité sélectionnée
                </span>
                <span className="rounded-md bg-[#171717] px-2.5 py-0.5 font-mono text-[13px] font-bold text-white">
                  {selectedCriticityScore}/25
                </span>
              </div>
              <p className="mt-1.5 text-[14.5px] font-semibold text-[#171717]">
                {matchingRisk.title}
              </p>
              <p className="mt-0.5 font-mono text-[12px] text-[#525252]">
                Probabilité : {selectedProb} · Gravité : {selectedSev} → Résiduel :{" "}
                {matchingRisk.residualScore}
              </p>
            </div>
          </section>

          {/* Registre des 7 risques numériques (7 col) */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
            <h3 className="text-[17px] font-semibold text-[#171717]">
              Registre des risques numériques &amp; Mesures de maîtrise
            </h3>
            <p className="mt-0.5 text-[13px] text-[#737373]">
              Évaluation de la criticité brute, barrières de sécurité en place et criticité résiduelle.
            </p>

            <div className="mt-4 space-y-2.5">
              {DIGITAL_RISKS_REGISTER.map((rsk) => {
                const rawScore = rsk.probability * rsk.severity;
                const isHighlighted =
                  rsk.probability === selectedProb && rsk.severity === selectedSev;
                return (
                  <div
                    key={rsk.id}
                    onClick={() => {
                      setSelectedProb(rsk.probability);
                      setSelectedSev(rsk.severity);
                    }}
                    className={`rounded-xl border p-3.5 transition cursor-pointer ${
                      isHighlighted
                        ? "border-[#171717] bg-[#F4F8F6]"
                        : "border-[#EFEFEF] bg-[#FAFAFA]/80 hover:bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="rounded-md bg-[#FEE2E2] px-2 py-0.5 font-mono text-[11.5px] font-bold text-[#B91C1C]">
                          Brut {rawScore}/25
                        </span>
                        <h4 className="text-[14.5px] font-semibold text-[#171717]">
                          {rsk.title}
                        </h4>
                      </div>
                      <span className="rounded-md bg-[#DEF5EC] px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#008064]">
                        Résiduel : {rsk.residualScore}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[12.5px] text-[#525252]">
                      <strong>Maîtrise :</strong> {rsk.mitigation}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          08. SOUS-ONGLET INCIDENTS DE SÉCURITÉ (3 Ouverts / 1 Critique SEC-0021 / 18 Clôturés)
         ===================================================================== */}
      {activeTab === "security-incidents" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: "Incidents ouverts",
                value: "3",
                caption: "Événements de sécurité en cours d’investigation",
              },
              {
                label: "Critiques",
                value: "1",
                caption: "SEC-0021 · Suspicion de compromission d’un compte",
              },
              {
                label: "Clôturés",
                value: "18",
                caption: "Dossiers documentés avec retour d’expérience",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs"
              >
                <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                  <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                    {item.value}
                  </p>
                </div>
                <p className="px-2.5 pt-2.5 pb-1 text-[12px] text-[var(--text-muted)]">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>

          {/* Fiche incident SEC-0021 */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#EFEFEF] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#FEE2E2] px-2.5 py-0.5 font-mono text-[12px] font-bold text-[#B91C1C]">
                    SEC-0021 · Critique
                  </span>
                  <span className="rounded-md bg-[#EFEFEF] px-2.5 py-0.5 font-mono text-[12px] font-semibold text-[#171717]">
                    {SECURITY_INCIDENT_STEPS[secIncidentStepIdx].step}
                  </span>
                </div>
                <h3 className="mt-2 text-[18px] font-semibold text-[#171717]">
                  Suspicion de compromission d’un compte
                </h3>
                <p className="text-[13px] text-[#737373]">
                  Détection : 14:32 · Périmètre : Authentification · Sessions révoquées préventivement à 14:35.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = Math.min(
                    secIncidentStepIdx + 1,
                    SECURITY_INCIDENT_STEPS.length - 1,
                  );
                  setSecIncidentStepIdx(next);
                  notify(
                    `Incident SEC-0021 avancé à l’étape : ${SECURITY_INCIDENT_STEPS[next].step}`,
                  );
                }}
                className="h-9 rounded-xl bg-[#171717] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
              >
                Passer à l’étape suivante →
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7 text-[12px]">
              {SECURITY_INCIDENT_STEPS.map((st, idx) => {
                const isCurrent = idx === secIncidentStepIdx;
                const isDone = idx < secIncidentStepIdx;
                return (
                  <div
                    key={st.step}
                    className={`rounded-xl border p-3 ${
                      isCurrent
                        ? "border-[#171717] bg-[#F4F8F6]"
                        : isDone
                          ? "border-[#DEF5EC] bg-white"
                          : "border-[#EFEFEF] bg-[#FAFAFA]"
                    }`}
                  >
                    <p className="font-mono text-[11px] font-bold text-[#737373]">
                      0{idx + 1}
                    </p>
                    <p className="mt-0.5 font-semibold text-[#171717]">{st.step}</p>
                    <p className="mt-1 text-[11.5px] text-[#525252]">{st.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border border-[#F0C869] bg-[#FFFDF7] px-4 py-3 text-[12.5px] text-[#525252]">
              <strong>Règle réglementaire :</strong> Les obligations éventuelles de notification aux autorités (CNIL sous 72h) et aux personnes concernées sont évaluées dès l’étape <strong>02. Qualification</strong>, sans attendre la résolution complète de l’incident.
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

