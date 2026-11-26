"use client";

import { useMemo, useState } from "react";
import { PremiumSelect } from "../premium-select";
import { type Locale, SolarIcon } from "../workspace-navigation";
import { type SuperAdminSectionNavTarget } from "./super-admin-overview";

// ---------------------------------------------------------------------------
// ICÔNES VECTORIELLES PURES DES BRIQUES TECHNIQUES AUTOCALL
// ---------------------------------------------------------------------------

type TechStackKind =
  | "nextjs"
  | "nestjs"
  | "neon"
  | "redis"
  | "bullmq"
  | "storage";

function TechStackBadge({ kind }: { kind: TechStackKind }) {
  switch (kind) {
    case "nextjs":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#171717] font-mono text-[12px] font-bold text-white shadow-2xs">
          N
        </span>
      );
    case "nestjs":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#E0234E] shadow-2xs">
          <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3L4 7.5v9L12 21l8-4.5v-9L12 3z" />
            <path d="M9 15V9l6 6V9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case "neon":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#171717] text-[#00E599] shadow-2xs">
          <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M5 19V5l14 14V5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case "redis":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#DC382D] shadow-2xs">
          <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <ellipse cx="12" cy="6.5" rx="7.5" ry="3" />
            <path d="M4.5 6.5v5c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-5" />
            <path d="M4.5 11.5v5c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-5" />
          </svg>
        </span>
      );
    case "bullmq":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#8A5A00] shadow-2xs">
          <SolarIcon name="bolt" className="size-4.5" />
        </span>
      );
    case "storage":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#171717] shadow-2xs">
          <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
            <rect x="3" y="4" width="18" height="6" rx="1.5" />
            <rect x="3" y="14" width="18" height="6" rx="1.5" />
            <circle cx="7" cy="7" r="1" fill="currentColor" />
            <circle cx="7" cy="17" r="1" fill="currentColor" />
          </svg>
        </span>
      );
  }
}

// ---------------------------------------------------------------------------
// 01. INFRASTRUCTURE — Les 8 composants techniques
// ---------------------------------------------------------------------------

interface InfraComponentCard {
  id: string;
  name: string;
  tech: string;
  kind: TechStackKind;
  status: "Opérationnel" | "Dégradé";
  region: string;
  detail: string;
}

const INFRA_COMPONENTS: InfraComponentCard[] = [
  {
    id: "cmp-fe-client",
    name: "Frontend client",
    tech: "Next.js",
    kind: "nextjs",
    status: "Opérationnel",
    region: "Edge EU-West",
    detail: "Dashboard client & Agent Studio · TTFB 64 ms",
  },
  {
    id: "cmp-fe-public",
    name: "Site public",
    tech: "Next.js",
    kind: "nextjs",
    status: "Opérationnel",
    region: "CDN Global / EU",
    detail: "Landing page & tunnel d’inscription · Cache 99,2 %",
  },
  {
    id: "cmp-fe-admin",
    name: "Super Admin",
    tech: "Next.js",
    kind: "nextjs",
    status: "Opérationnel",
    region: "Accès isolé MFA",
    detail: "Console d’administration globale AutoCall",
  },
  {
    id: "cmp-api",
    name: "Backend API",
    tech: "NestJS",
    kind: "nestjs",
    status: "Opérationnel",
    region: "Cluster EU-West-1",
    detail: "Monolithe modulaire · 142 ms médiane (p50)",
  },
  {
    id: "cmp-db",
    name: "Base de données",
    tech: "PostgreSQL · Neon",
    kind: "neon",
    status: "Opérationnel",
    region: "Francfort (eu-central-1)",
    detail: "Isolation Row-Level Security · 28 ms SQL",
  },
  {
    id: "cmp-redis",
    name: "Cache et files d’attente",
    tech: "Redis",
    kind: "redis",
    status: "Opérationnel",
    region: "EU-West-1",
    detail: "Verrous atomiques de quotas & pub/sub temps réel",
  },
  {
    id: "cmp-workers",
    name: "Workers",
    tech: "BullMQ",
    kind: "bullmq",
    status: "Dégradé",
    region: "Pool dédié Async",
    detail: "Retards sur la file de transcription (INC-0024)",
  },
  {
    id: "cmp-storage",
    name: "Stockage",
    tech: "Documents et médias",
    kind: "storage",
    status: "Opérationnel",
    region: "S3 Chiffré AES-256",
    detail: "Enregistrements vocaux, factures PDF & avatars",
  },
];

// ---------------------------------------------------------------------------
// 02. PERFORMANCES — Courbe 24h (p50 vs p95) & Core Web Vitals
// ---------------------------------------------------------------------------

const API_LATENCY_24H = [
  { hour: "00h", p50: 112, p95: 220 },
  { hour: "03h", p50: 98, p95: 190 },
  { hour: "06h", p50: 118, p95: 235 },
  { hour: "09h", p50: 156, p95: 320 },
  { hour: "12h", p50: 148, p95: 295 },
  { hour: "15h", p50: 168, p95: 385 },
  { hour: "18h", p50: 142, p95: 280 },
  { hour: "21h", p50: 124, p95: 240 },
];

// ---------------------------------------------------------------------------
// 03. FILES ET WORKERS — Les 7 files d'attente BullMQ
// ---------------------------------------------------------------------------

interface QueueStatusRecord {
  id: string;
  name: string;
  technicalQueue: string;
  waiting: number;
  active: number;
  failed: number;
  idempotencyRule: string;
}

const INITIAL_QUEUES: QueueStatusRecord[] = [
  {
    id: "q-emails",
    name: "Campagnes emails",
    technicalQueue: "campaigns-email-dispatch",
    waiting: 124,
    active: 8,
    failed: 2,
    idempotencyRule:
      "Clé message_id unique requise avant réexécution pour éviter tout double envoi client.",
  },
  {
    id: "q-auto",
    name: "Automatisations",
    technicalQueue: "workflows-runner",
    waiting: 36,
    active: 5,
    failed: 0,
    idempotencyRule: "Exécution journalisée par événement source (call_completed_id).",
  },
  {
    id: "q-stt",
    name: "Transcriptions",
    technicalQueue: "call-transcription-stt",
    waiting: 18,
    active: 4,
    failed: 1,
    idempotencyRule: "Écriture idempotente par call_sid · Sûr à retraiter après vérification audio.",
  },
  {
    id: "q-acq",
    name: "Acquisition",
    technicalQueue: "lead-enrichment-batch",
    waiting: 42,
    active: 3,
    failed: 0,
    idempotencyRule: "Réservation de crédit liée à l’identifiant prospect unique.",
  },
  {
    id: "q-notif",
    name: "Notifications",
    technicalQueue: "transactional-alerts",
    waiting: 8,
    active: 2,
    failed: 0,
    idempotencyRule: "Déduplication sur fenêtre glissante de 15 minutes.",
  },
  {
    id: "q-social",
    name: "Réseaux sociaux",
    technicalQueue: "social-webhooks-sync",
    waiting: 12,
    active: 2,
    failed: 1,
    idempotencyRule:
      "Vérifier l’état côté Meta/WhatsApp avant relance pour ne pas dupliquer la réponse.",
  },
  {
    id: "q-reports",
    name: "Rapports et exports",
    technicalQueue: "analytics-pdf-csv",
    waiting: 4,
    active: 1,
    failed: 0,
    idempotencyRule: "Génération purement analytique sans effet de bord externe.",
  },
];

// ---------------------------------------------------------------------------
// 04. LOGS ET ERREURS — Journal technique centralisé (Sans secrets ni données privées)
// ---------------------------------------------------------------------------

type LogSeverity = "ERROR" | "WARN" | "INFO";

interface SystemLogEntry {
  id: string;
  time: string;
  level: LogSeverity;
  service: "Worker" | "API" | "Redis" | "Database" | "Integration";
  message: string;
  requestId: string;
  version: string;
  sanitizedContext: string;
}

const SYSTEM_LOGS: SystemLogEntry[] = [
  {
    id: "lg-1",
    time: "17:42:08",
    level: "ERROR",
    service: "Worker",
    message: "Timeout lors de la transcription",
    requestId: "req_9f42a81c",
    version: "v1.0.4",
    sanitizedContext:
      "queue=call-transcription-stt · duration_ms=30004 · audio_payload=[REDACTED_PRIVACY]",
  },
  {
    id: "lg-2",
    time: "17:41:52",
    level: "INFO",
    service: "API",
    message: "Requête traitée avec succès",
    requestId: "req_8c31b20e",
    version: "v1.0.4",
    sanitizedContext: "POST /v1/agents/availability · status=200 · latency_ms=118",
  },
  {
    id: "lg-3",
    time: "17:40:31",
    level: "WARN",
    service: "Redis",
    message: "Latence supérieure au seuil",
    requestId: "req_7d19f04a",
    version: "v1.0.4",
    sanitizedContext: "op=EVALSHA_QUOTA_LOCK · latency_ms=46 (seuil_alerte=35ms)",
  },
  {
    id: "lg-4",
    time: "17:39:21",
    level: "INFO",
    service: "Database",
    message: "Connexion établie",
    requestId: "req_6a88c51b",
    version: "v1.0.4",
    sanitizedContext: "pool=neon-eu-central-1 · active_conns=42/100 · rls_enforced=true",
  },
  {
    id: "lg-5",
    time: "17:38:10",
    level: "ERROR",
    service: "Integration",
    message: "Échec de synchronisation agenda",
    requestId: "req_5e04d92f",
    version: "v1.0.4",
    sanitizedContext:
      "provider=google_calendar · http_status=504 · oauth_token=[REDACTED_SECRET]",
  },
  {
    id: "lg-6",
    time: "17:37:45",
    level: "INFO",
    service: "Worker",
    message: "Tâche terminée",
    requestId: "req_4b72e18d",
    version: "v1.0.4",
    sanitizedContext: "queue=workflows-runner · job_id=wf_88210 · duration_ms=412",
  },
  {
    id: "lg-7",
    time: "17:35:02",
    level: "WARN",
    service: "API",
    message: "Temps de réponse élevé",
    requestId: "req_3c91a77c",
    version: "v1.0.4",
    sanitizedContext: "GET /v1/analytics/summary · status=200 · latency_ms=640",
  },
];

// ---------------------------------------------------------------------------
// 05. SAUVEGARDES — Ressources protégées & Tests de restauration isolés
// ---------------------------------------------------------------------------

interface BackupResourceRow {
  id: string;
  resource: string;
  frequency: string;
  retentionPolicy: string;
  lastSnapshot: string;
  lastRestoreDrill: string;
  status: "Réussie";
}

const BACKUP_RESOURCES: BackupResourceRow[] = [
  {
    id: "bk-pg",
    resource: "PostgreSQL",
    frequency: "Quotidienne + PITR continu",
    retentionPolicy: "30 jours glissants (Chiffré KMS)",
    lastSnapshot: "Aujourd’hui · 03:00",
    lastRestoreDrill: "22 nov. 2026 (Isolé OK)",
    status: "Réussie",
  },
  {
    id: "bk-media",
    resource: "Documents et médias",
    frequency: "Quotidienne",
    retentionPolicy: "Réplication multi-zone S3 EU",
    lastSnapshot: "Aujourd’hui · 03:15",
    lastRestoreDrill: "22 nov. 2026 (Intégrité SHA-256 OK)",
    status: "Réussie",
  },
  {
    id: "bk-cfg",
    resource: "Configurations",
    frequency: "À chaque modification",
    retentionPolicy: "Versionnage immuable complet",
    lastSnapshot: "Aujourd’hui · 16:40",
    lastRestoreDrill: "22 nov. 2026 (Vérifié)",
    status: "Réussie",
  },
  {
    id: "bk-crit",
    resource: "Données critiques (Registre & Factures)",
    frequency: "Selon stratégie de reprise (Temps réel)",
    retentionPolicy: "Conservation légale 10 ans",
    lastSnapshot: "Continu (WAL)",
    lastRestoreDrill: "22 nov. 2026 (Vérifié)",
    status: "Réussie",
  },
];

// ---------------------------------------------------------------------------
// 06. DÉPLOIEMENTS — Historique des versions AutoCall (v1.0.1 à v1.0.5)
// ---------------------------------------------------------------------------

interface DeploymentReleaseRecord {
  id: string;
  version: string;
  environment: "Production" | "Staging";
  badge: "Déployé" | "En validation" | "Précédente" | "Archivée" | "Échec";
  summary: string;
  branch: string;
  commitHash: string;
  buildDuration: string;
  dbMigrationNote: string;
  deployedAt: string;
}

const INITIAL_DEPLOYMENTS: DeploymentReleaseRecord[] = [
  {
    id: "dep-104",
    version: "AutoCall v1.0.4",
    environment: "Production",
    badge: "Déployé",
    summary:
      "Optimisation du traitement des appels et correction des erreurs de synchronisation.",
    branch: "main",
    commitHash: "a84f29c",
    buildDuration: "2 min 34 s",
    dbMigrationNote: "Migration additive rétrocompatible (aucune colonne supprimée).",
    deployedAt: "Aujourd’hui · 08:15",
  },
  {
    id: "dep-105",
    version: "AutoCall v1.0.5",
    environment: "Staging",
    badge: "En validation",
    summary:
      "Ajustement du timeout des workers de transcription et amélioration des alertes quotas.",
    branch: "release/1.0.5",
    commitHash: "e31b904",
    buildDuration: "2 min 18 s",
    dbMigrationNote: "Aucune migration SQL requise.",
    deployedAt: "Aujourd’hui · 15:40",
  },
  {
    id: "dep-103",
    version: "AutoCall v1.0.3",
    environment: "Production",
    badge: "Précédente",
    summary: "Ajout du journal de diagnostic temporaire 30 minutes en lecture seule.",
    branch: "main",
    commitHash: "7c12d8e",
    buildDuration: "2 min 41 s",
    dbMigrationNote: "Table diagnostic_sessions créée — rollback code sûr.",
    deployedAt: "19 nov. 2026",
  },
  {
    id: "dep-102",
    version: "AutoCall v1.0.2",
    environment: "Production",
    badge: "Archivée",
    summary: "Mise en service du catalogue tarifaire versionné par marché (EUR / XOF).",
    branch: "main",
    commitHash: "4d90a11",
    buildDuration: "2 min 29 s",
    dbMigrationNote: "Migration irréversible (historique scellé) — rollback direct interdit.",
    deployedAt: "11 nov. 2026",
  },
  {
    id: "dep-101",
    version: "AutoCall v1.0.1",
    environment: "Production",
    badge: "Échec",
    summary: "Tentative de déploiement interrompue automatiquement par les tests CI.",
    branch: "main",
    commitHash: "1f08b33",
    buildDuration: "1 min 12 s",
    dbMigrationNote: "Déploiement annulé avant mise en trafic (0 impact client).",
    deployedAt: "04 nov. 2026",
  },
];

// ---------------------------------------------------------------------------
// 07. INCIDENTS — Cycle en 7 étapes & Incident INC-0024
// ---------------------------------------------------------------------------

const INCIDENT_LIFECYCLE_STEPS = [
  "Détecté",
  "En investigation",
  "Cause identifiée",
  "Correction en cours",
  "Sous surveillance",
  "Résolu",
  "Retour d’expérience",
] as const;

type IncidentLifecycleStage = (typeof INCIDENT_LIFECYCLE_STEPS)[number];

// ---------------------------------------------------------------------------
// 08. PAGE STATUS — status.getautocall.fr (8 services publics sur 60 jours)
// ---------------------------------------------------------------------------

interface PublicStatusService {
  id: string;
  name: string;
  uptimePct: string;
  degradedToday?: boolean;
}

const PUBLIC_STATUS_SERVICES: PublicStatusService[] = [
  { id: "ps-app", name: "Application AutoCall", uptimePct: "99,99 %" },
  { id: "ps-api", name: "API", uptimePct: "99,98 %" },
  { id: "ps-tel", name: "Téléphonie", uptimePct: "100 %" },
  { id: "ps-ai", name: "Agents IA", uptimePct: "99,99 %" },
  {
    id: "ps-stt",
    name: "Transcription",
    uptimePct: "99,82 %",
    degradedToday: true,
  },
  { id: "ps-auto", name: "Automatisations", uptimePct: "100 %" },
  { id: "ps-acq", name: "Acquisition", uptimePct: "100 %" },
  { id: "ps-pay", name: "Paiements", uptimePct: "100 %" },
];

export function SuperAdminInfrastructure({
  activeTab,
  onSelectTab,
  onNavigate,
}: {
  activeTab: string;
  locale: Locale;
  onSelectTab: (tabId: string) => void;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  // 03. Files et workers
  const [queueFilter, setQueueFilter] = useState<"Toutes" | "Avec erreurs">("Toutes");
  const [selectedQueueId, setSelectedQueueId] = useState<string>("q-emails");

  // 04. Logs et erreurs
  const [logFilter, setLogFilter] = useState<"Tous" | LogSeverity>("Tous");
  const [selectedLogId, setSelectedLogId] = useState<string>("lg-1");

  // 05. Sauvegardes
  const [lastRestoreTestLabel, setLastRestoreTestLabel] = useState("22 nov. · Vérifié");

  // 07. Incidents
  const [incidentStage, setIncidentStage] =
    useState<IncidentLifecycleStage>("En investigation");
  const [incidentTimeline, setIncidentTimeline] = useState([
    { time: "14:32", text: "Détection d’une augmentation des délais." },
    { time: "14:35", text: "Ouverture de l’incident." },
    { time: "14:42", text: "Identification du service affecté (Workers de transcription)." },
    { time: "14:50", text: "Analyse technique en cours." },
  ]);

  // 08. Page status (status.getautocall.fr)
  const [publicBannerStatus, setPublicBannerStatus] = useState<
    "Perturbation partielle des services" | "Tous les systèmes sont opérationnels"
  >("Perturbation partielle des services");
  const [publicBannerMessage, setPublicBannerMessage] = useState(
    "Des retards de transcription sont actuellement constatés.",
  );
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [maintenanceTitle, setMaintenanceTitle] = useState("");
  const [maintenanceWindow, setMaintenanceWindow] = useState("Dimanche · 02:00 – 02:30 CET");

  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const filteredQueues = useMemo(() => {
    if (queueFilter === "Toutes") return INITIAL_QUEUES;
    return INITIAL_QUEUES.filter((q) => q.failed > 0);
  }, [queueFilter]);

  const selectedQueue = useMemo(
    () => INITIAL_QUEUES.find((q) => q.id === selectedQueueId) ?? INITIAL_QUEUES[0],
    [selectedQueueId],
  );

  const filteredLogs = useMemo(() => {
    if (logFilter === "Tous") return SYSTEM_LOGS;
    return SYSTEM_LOGS.filter((l) => l.level === logFilter);
  }, [logFilter]);

  const selectedLog = useMemo(
    () => SYSTEM_LOGS.find((l) => l.id === selectedLogId) ?? SYSTEM_LOGS[0],
    [selectedLogId],
  );

  const currentStageIndex = INCIDENT_LIFECYCLE_STEPS.indexOf(incidentStage);

  const handleAdvanceIncidentStage = () => {
    const nextIdx = Math.min(
      currentStageIndex + 1,
      INCIDENT_LIFECYCLE_STEPS.length - 1,
    );
    const nextStage = INCIDENT_LIFECYCLE_STEPS[nextIdx];
    setIncidentStage(nextStage);
    setIncidentTimeline((prev) => [
      ...prev,
      {
        time: "À l’instant",
        text: `Passage de l’incident INC-0024 à l’étape « ${nextStage} ».`,
      },
    ]);
    if (nextStage === "Résolu") {
      setPublicBannerStatus("Tous les systèmes sont opérationnels");
      setPublicBannerMessage(
        "Les délais de transcription sont revenus à la normale sur l’ensemble du cluster.",
      );
    }
    notify(`Incident INC-0024 avancé à l’étape : ${nextStage}`);
  };

  return (
    <div className="mt-7 space-y-7">
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-[#E5E5E5] bg-[#171717] px-4 py-3 text-[13.5px] font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Bandeau supérieur : Tour de contrôle technique Production + Raccourcis sur une seule ligne */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-2xs lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#DEF5EC] px-2 py-0.5 font-mono text-[11.5px] font-semibold text-[#008064] shrink-0">
            <span className="size-1.5 rounded-full bg-[#15803D]" />
            Production
          </span>
          <span>
            <strong className="font-semibold text-[var(--foreground)]">
              10 · Tour de contrôle technique :
            </strong>{" "}
            Monolithe modulaire NestJS, frontends Next.js, PostgreSQL Neon, Redis et pool de workers dédiés BullMQ.
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("providers", "connections")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>06 · Fournisseurs</span>
            <span className="text-[#737373]">→</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("status-page")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>status.getautocall.fr</span>
            <span className="text-[#737373]">→</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          01. SOUS-ONGLET INFRASTRUCTURE (99,98 % / 142 ms / 7/8 / 1 P2 + 8 composants)
         ===================================================================== */}
      {activeTab === "infrastructure" && (
        <div className="space-y-6">
          {/* 4 cartes KPI double surface avec badges d'icônes : 99,98 % / 142 ms / 7/8 / 1 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="globe" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Disponibilité
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  {"99,98 %"}
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                Sur les 30 derniers jours (Cluster EU)
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Temps de réponse API
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  142 ms
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[var(--text-muted)]">
                Médiane (p50) sur le backend NestJS
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="appearance" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Services opérationnels
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  7/8
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#8A5A00]">
                ● 1 service dégradé (Workers BullMQ)
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bell" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Incidents ouverts
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  1
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("incidents")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[12.5px] font-medium text-[#8A5A00] hover:underline cursor-pointer"
              >
                <span>● Priorité P2 · INC-0024</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Grille des 8 composants techniques */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-col justify-between gap-3 border-b border-[#EFEFEF] pb-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  État des composants de la plateforme
                </h3>
                <p className="mt-0.5 text-[13.5px] text-[#737373]">
                  Vue synthétique en temps réel des 8 briques fondamentales d’AutoCall.
                </p>
              </div>
              <span className="font-mono text-[12px] text-[#737373]">
                Architecture : Monolithe modulaire + Workers dédiés
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {INFRA_COMPONENTS.map((cmp) => (
                <article
                  key={cmp.id}
                  className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs"
                >
                  <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                    <div className="flex items-start justify-between gap-2">
                      <TechStackBadge kind={cmp.kind} />
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold whitespace-nowrap ${
                          cmp.status === "Opérationnel"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : "bg-[#F0C869] text-[#5C3D00]"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            cmp.status === "Opérationnel"
                              ? "bg-[#15803D]"
                              : "bg-[#5C3D00]"
                          }`}
                        />
                        {cmp.status}
                      </span>
                    </div>

                    <h4 className="mt-3 text-[15px] font-semibold text-[#171717]">
                      {cmp.name}
                    </h4>
                    <p className="font-mono text-[12px] font-medium text-[#525252]">
                      {cmp.tech}
                    </p>
                  </div>

                  <div className="px-2 pt-2.5 pb-1 text-[11.5px] text-[#737373]">
                    <p className="font-medium text-[#525252]">{cmp.detail}</p>
                    <p className="mt-0.5">{cmp.region}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Schéma d'architecture épuré : Frontends -> API NestJS -> PostgreSQL / Redis -> Workers BullMQ */}
            <div className="mt-6 rounded-2xl border border-[#EFEFEF] bg-[#FAFAFA] p-5">
              <p className="text-[12.5px] font-semibold text-[#171717]">
                Topologie d’exécution (Isolation du chemin critique temps réel)
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4 text-[12.5px]">
                <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5">
                  <span className="font-mono text-[11px] text-[#737373]">1. Entrées Web</span>
                  <p className="mt-1 font-semibold text-[#171717]">
                    3 Applications Next.js
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-[#525252]">
                    Site public, Dashboard client et Super Admin isolé.
                  </p>
                </div>
                <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5">
                  <span className="font-mono text-[11px] text-[#737373]">2. Cœur Métier</span>
                  <p className="mt-1 font-semibold text-[#171717]">
                    Backend API NestJS
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-[#525252]">
                    Authentification, orchestration SIP/IA, quotas et facturation.
                  </p>
                </div>
                <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5">
                  <span className="font-mono text-[11px] text-[#737373]">3. Persistance &amp; État</span>
                  <p className="mt-1 font-semibold text-[#171717]">
                    PostgreSQL Neon &amp; Redis
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-[#525252]">
                    RLS par tenant_id, cache rapide et files de messages.
                  </p>
                </div>
                <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5">
                  <span className="font-mono text-[11px] text-[#737373]">4. Asynchrone</span>
                  <p className="mt-1 font-semibold text-[#171717]">
                    Workers BullMQ &amp; S3
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-[#525252]">
                    Campagnes, transcriptions et exports sans jamais bloquer l’UI.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          02. SOUS-ONGLET PERFORMANCES (CPU/RAM/Stockage + Latence p50/p95 + Core Web Vitals)
         ===================================================================== */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          {/* 3 jauges ressources double surface : CPU / Mémoire RAM / Stockage */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: "CPU (Nœuds API & Workers)",
                value: "46 %",
                pct: 46,
                caption: "Marge confortable avant auto-scaling (seuil 75 %)",
              },
              {
                label: "Mémoire RAM",
                value: "62 %",
                pct: 62,
                caption: "9,9 Go / 16 Go alloués sur le pool applicatif",
              },
              {
                label: "Stockage (Base & Médias S3)",
                value: "38 %",
                pct: 38,
                caption: "Croissance maîtrisée · Purge RGPD active",
              },
            ].map((res) => (
              <div
                key={res.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs"
              >
                <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                      {res.label}
                    </p>
                    <span className="font-mono text-[22px] font-bold text-[#171717] tabular-nums">
                      {res.value}
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                    <div
                      style={{ width: `${res.pct}%` }}
                      className="h-full rounded-full bg-[#408963]"
                    />
                  </div>
                </div>
                <p className="px-2.5 pt-2.5 pb-1 text-[12px] text-[var(--text-muted)]">
                  {res.caption}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Temps de réponse API sur 24h : Médiane (p50) vs p95 (7 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#171717]">
                    Temps de réponse API (Dernières 24 heures)
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#737373]">
                    Échelle 0 ms à 450 ms · Comparaison entre la médiane (p50) et le centile p95.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[12px] font-medium text-[#525252]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-[#408963]" />
                    <span>Médiane (p50)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-[#171717]" />
                    <span>p95</span>
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-8 gap-2.5 pt-2">
                {API_LATENCY_24H.map((pt) => {
                  const p50Pct = Math.round((pt.p50 / 450) * 100);
                  const p95Pct = Math.round((pt.p95 / 450) * 100);
                  return (
                    <div key={pt.hour} className="flex flex-col items-center">
                      <span className="mb-1.5 font-mono text-[10.5px] font-semibold text-[#525252] tabular-nums">
                        {pt.p50}ms
                      </span>
                      <div className="flex h-44 w-full items-end justify-center gap-1 rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-1.5 py-2.5">
                        <div
                          style={{ height: `${p50Pct}%` }}
                          className="w-3 rounded-t-sm bg-[#408963]"
                          title={`${pt.hour} · p50 : ${pt.p50} ms`}
                        />
                        <div
                          style={{ height: `${p95Pct}%` }}
                          className="w-3 rounded-t-sm bg-[#171717]"
                          title={`${pt.hour} · p95 : ${pt.p95} ms`}
                        />
                      </div>
                      <span className="mt-2 font-mono text-[11.5px] text-[#525252]">
                        {pt.hour}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-[12px] text-[#737373]">
                Pour les services managés (Neon, Redis Cloud), seules les métriques réellement exposées par les API fournisseurs sont affichées.
              </p>
            </section>

            {/* Indicateurs complémentaires + Objectifs Core Web Vitals Frontend (5 col) */}
            <div className="space-y-6 lg:col-span-5">
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
                <h3 className="text-[16px] font-semibold text-[#171717]">
                  Indicateurs complémentaires temps réel
                </h3>
                <div className="mt-4 divide-y divide-[#F0F0F0] text-[13.5px]">
                  {[
                    { label: "Requêtes API par minute", value: "2 840" },
                    { label: "Taux d’erreurs API", value: "0,12 %" },
                    { label: "Connexions PostgreSQL", value: "42 / 100" },
                    { label: "Latence des requêtes SQL", value: "28 ms" },
                    { label: "Utilisation du cache Redis", value: "84 %" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-2.5"
                    >
                      <span className="text-[#525252]">{row.label}</span>
                      <span className="font-mono font-bold text-[#171717] tabular-nums">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
                <h3 className="text-[16px] font-semibold text-[#171717]">
                  Performance Frontend (Core Web Vitals)
                </h3>
                <div className="mt-3.5 space-y-2.5 text-[13px]">
                  {[
                    {
                      metric: "LCP — Vitesse d’affichage",
                      target: "≤ 2,5 s",
                      observed: "1,4 s",
                    },
                    {
                      metric: "INP — Réactivité aux interactions",
                      target: "≤ 200 ms",
                      observed: "86 ms",
                    },
                    {
                      metric: "CLS — Stabilité visuelle",
                      target: "≤ 0,1",
                      observed: "0,02",
                    },
                  ].map((cwv) => (
                    <div
                      key={cwv.metric}
                      className="flex items-center justify-between rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] px-3.5 py-2.5"
                    >
                      <div>
                        <p className="font-semibold text-[#171717]">{cwv.metric}</p>
                        <p className="text-[11.5px] text-[#737373]">
                          Objectif : {cwv.target}
                        </p>
                      </div>
                      <span className="rounded-md bg-[#DEF5EC] px-2.5 py-0.5 font-mono text-[12px] font-bold text-[#008064] tabular-nums">
                        {cwv.observed}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          03. SOUS-ONGLET FILES ET WORKERS (244 En attente / 25 En exécution / 4 En échec)
         ===================================================================== */}
      {activeTab === "queues-workers" && (
        <div className="space-y-6">
          {/* 3 cartes KPI double surface avec badges d'icônes : 244 / 25 / 4 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="automation" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    En attente
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  244
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[var(--text-muted)]">
                Tâches planifiées dans les 7 files BullMQ
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    En exécution
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  25
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                ● Workers actifs hors chemin critique utilisateur
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bell" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    En échec
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  4
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#B91C1C]">
                ● Placées en quarantaine pour vérification d’idempotence
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Tableau des 7 files d'attente (7 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Files d’attente BullMQ
                </h3>

                <div className="flex items-center gap-1.5">
                  {(["Toutes", "Avec erreurs"] as const).map((flt) => (
                    <button
                      key={flt}
                      type="button"
                      onClick={() => setQueueFilter(flt)}
                      className={`h-8 rounded-xl px-3 text-[12px] font-semibold transition cursor-pointer ${
                        queueFilter === flt
                          ? "bg-[#171717] text-white"
                          : "border border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F7F7F8]"
                      }`}
                    >
                      {flt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse text-left text-[13.5px]">
                  <thead>
                    <tr className="border-b border-[#EFEFEF] text-[12px] font-medium text-[#737373]">
                      <th className="py-3 pr-4">File</th>
                      <th className="px-3 py-3 text-right">Attente</th>
                      <th className="px-3 py-3 text-right">Actives</th>
                      <th className="py-3 pl-3 text-right">Échecs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F2F2]">
                    {filteredQueues.map((q) => {
                      const isSelected = q.id === selectedQueue.id;
                      return (
                        <tr
                          key={q.id}
                          onClick={() => setSelectedQueueId(q.id)}
                          className={`transition cursor-pointer ${
                            isSelected ? "bg-[#F4F8F6]" : "hover:bg-[#FAFAFA]"
                          }`}
                        >
                          <td className="py-3.5 pr-4">
                            <p className="font-semibold text-[#171717]">{q.name}</p>
                            <p className="font-mono text-[11.5px] text-[#737373]">
                              {q.technicalQueue}
                            </p>
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono font-medium text-[#171717] tabular-nums">
                            {q.waiting}
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono font-semibold text-[#008F6D] tabular-nums">
                            {q.active}
                          </td>
                          <td className="py-3.5 pl-3 text-right font-mono tabular-nums">
                            <span
                              className={`inline-flex min-w-[28px] justify-center rounded-md px-2 py-0.5 text-[12px] font-bold ${
                                q.failed > 0
                                  ? "bg-[#FEE2E2] text-[#B91C1C]"
                                  : "bg-[#EFEFEF] text-[#525252]"
                              }`}
                            >
                              {q.failed}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Garde-fou d'idempotence avant toute relance de tâche (5 col) */}
            <section className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs lg:col-span-5">
              <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                <span className="rounded-md bg-[#F0C869] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#5C3D00]">
                  Garde-fou d’idempotence
                </span>
                <h4 className="mt-2.5 text-[16.5px] font-semibold text-[#171717]">
                  {selectedQueue.name}
                </h4>
                <p className="font-mono text-[12px] text-[#737373]">
                  File : {selectedQueue.technicalQueue}
                </p>

                <div className="mt-4 rounded-xl border border-[#E5E5E5] bg-white p-3.5 text-[12.5px] text-[#525252]">
                  <p className="font-semibold text-[#171717]">
                    Règle de sécurité avant réexécution :
                  </p>
                  <p className="mt-1 leading-relaxed">
                    {selectedQueue.idempotencyRule}
                  </p>
                </div>

                <p className="mt-3.5 text-[12px] leading-relaxed text-[#525252]">
                  <strong>Principe strict :</strong> ne relancez jamais aveuglément une tâche dont le résultat externe est incertain, au risque d’envoyer deux e-mails, de réserver deux créneaux ou de déclencher deux prélèvements.
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2 px-1 pb-1">
                <button
                  type="button"
                  onClick={() =>
                    notify(
                      `État d’idempotence vérifié pour « ${selectedQueue.name} » : aucun doublon externe détecté`,
                    )
                  }
                  className="h-9 flex-1 rounded-xl bg-[#171717] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
                >
                  Vérifier l’idempotence avant relance
                </button>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* =====================================================================
          04. SOUS-ONGLET LOGS ET ERREURS (Journal centralisé expurgé de secrets)
         ===================================================================== */}
      {activeTab === "logs-errors" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Logs système — Journal technique centralisé
                </h3>
                <p className="mt-0.5 text-[13px] text-[#737373]">
                  Chaque entrée est reliée à un service, une version et un identifiant de requête traçable.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {(["Tous", "ERROR", "WARN", "INFO"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLogFilter(lvl)}
                    className={`h-8 rounded-xl px-3 font-mono text-[12px] font-semibold transition cursor-pointer ${
                      logFilter === lvl
                        ? "bg-[#171717] text-white"
                        : "border border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F7F7F8]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {filteredLogs.map((log) => {
                const isSelected = log.id === selectedLog.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 font-mono text-[12.5px] transition cursor-pointer ${
                      isSelected
                        ? "border-[#171717] bg-[#F4F8F6]"
                        : "border-[#EFEFEF] bg-[#FAFAFA]/80 hover:bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[#737373] tabular-nums">{log.time}</span>
                      <span
                        className={`inline-flex min-w-[54px] justify-center rounded px-2 py-0.5 text-[11px] font-bold ${
                          log.level === "ERROR"
                            ? "bg-[#FEE2E2] text-[#B91C1C]"
                            : log.level === "WARN"
                              ? "bg-[#F0C869] text-[#5C3D00]"
                              : "bg-[#DEF5EC] text-[#008064]"
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="rounded border border-[#E5E5E5] bg-white px-2 py-0.5 text-[11.5px] font-semibold text-[#171717]">
                        {log.service}
                      </span>
                      <span className="font-sans text-[13.5px] font-medium text-[#171717]">
                        {log.message}
                      </span>
                    </div>

                    <span className="text-[11.5px] text-[#737373]">{log.requestId}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Inspecteur de contexte expurgé (4 col) */}
          <section className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs lg:col-span-4">
            <div className="rounded-xl bg-[var(--surface-inset)] p-4">
              <span className="font-mono text-[11px] font-semibold text-[#737373]">
                Contexte technique de l’événement
              </span>
              <h4 className="mt-1 text-[16px] font-semibold text-[#171717]">
                {selectedLog.message}
              </h4>

              <div className="mt-3 space-y-2 font-mono text-[12px]">
                <div className="flex justify-between rounded-lg border border-[#E5E5E5] bg-white px-3 py-2">
                  <span className="text-[#737373]">Request ID</span>
                  <span className="font-semibold text-[#171717]">{selectedLog.requestId}</span>
                </div>
                <div className="flex justify-between rounded-lg border border-[#E5E5E5] bg-white px-3 py-2">
                  <span className="text-[#737373]">Service &amp; Version</span>
                  <span className="font-semibold text-[#171717]">
                    {selectedLog.service} · {selectedLog.version}
                  </span>
                </div>
                <div className="rounded-lg border border-[#E5E5E5] bg-white p-3 text-[11.5px] leading-relaxed text-[#171717] break-all">
                  {selectedLog.sanitizedContext}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-start gap-2 px-2 pb-1 text-[12px] text-[#525252]">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 size-4 shrink-0 text-[#008F6D]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <span>
                <strong>Filtrage strict :</strong> mots de passe, clés API, jetons OAuth et contenus privés des conversations sont automatiquement masqués avant indexation.
              </span>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          05. SOUS-ONGLET SAUVEGARDES (03:00 Réussie + Test restauration 22 nov. + RPO/RTO)
         ===================================================================== */}
      {activeTab === "backups" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                  Dernière sauvegarde
                </p>
                <p className="mt-2 text-[22px] font-semibold text-[#171717]">
                  Aujourd’hui · 03:00
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                ● Réussie et chiffrée au repos
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                  Dernier test de restauration
                </p>
                <p className="mt-2 text-[22px] font-semibold text-[#171717]">
                  {lastRestoreTestLabel}
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                ● Vérifié dans un environnement isolé
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                  RPO (Perte maximale acceptable)
                </p>
                <p className="mt-2 text-[22px] font-semibold text-[#171717]">
                  &le; 5 minutes
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12px] text-[var(--text-muted)]">
                Point-in-Time Recovery (WAL PostgreSQL)
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                  RTO (Délai cible de rétablissement)
                </p>
                <p className="mt-2 text-[22px] font-semibold text-[#171717]">
                  &le; 30 minutes
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12px] text-[var(--text-muted)]">
                Bascule et restauration vérifiées
              </p>
            </div>
          </div>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Sauvegardes et restauration des données
                </h3>
                <p className="mt-0.5 text-[13.5px] text-[#737373]">
                  Une sauvegarde réussie ne garantit jamais à elle seule la reprise : des exercices réguliers de restauration isolée sont indispensables.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLastRestoreTestLabel("Aujourd’hui · Vérifié");
                  notify(
                    "Exercice de restauration exécuté avec succès sur une branche Neon isolée",
                  );
                }}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#171717] px-4 text-[13px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
              >
                Lancer un test de restauration isolé
              </button>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-[#EFEFEF] text-[12px] font-medium text-[#737373]">
                    <th className="py-3 pr-4">Ressource</th>
                    <th className="px-4 py-3">Fréquence proposée</th>
                    <th className="px-4 py-3">Rétention</th>
                    <th className="px-4 py-3">Dernière exécution</th>
                    <th className="py-3 pl-4 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F2F2]">
                  {BACKUP_RESOURCES.map((bk) => (
                    <tr key={bk.id} className="hover:bg-[#FAFAFA]">
                      <td className="py-4 pr-4 font-semibold text-[#171717]">
                        {bk.resource}
                      </td>
                      <td className="px-4 py-4 text-[#525252]">{bk.frequency}</td>
                      <td className="px-4 py-4 text-[12.5px] text-[#737373]">
                        {bk.retentionPolicy}
                      </td>
                      <td className="px-4 py-4 font-mono text-[12.5px] text-[#525252]">
                        {bk.lastSnapshot}
                      </td>
                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        <span className="rounded-md bg-[#DEF5EC] px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#008064]">
                          ● {bk.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          06. SOUS-ONGLET DÉPLOIEMENTS (3 environnements + v1.0.4 actuelle -> v1.0.1)
         ===================================================================== */}
      {activeTab === "deployments" && (
        <div className="space-y-6">
          {/* Les 3 environnements : Development / Staging / Production */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                env: "Development",
                role: "Développer",
                detail: "Branches locales & revues de code automatisées",
                version: "main (HEAD)",
              },
              {
                env: "Staging",
                role: "Tester",
                detail: "Validation pré-production & migrations à blanc",
                version: "AutoCall v1.0.5",
              },
              {
                env: "Production",
                role: "Exploiter",
                detail: "Cluster client actif · Déploiement sans coupure",
                version: "AutoCall v1.0.4",
              },
            ].map((item) => (
              <div
                key={item.env}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs"
              >
                <div className="rounded-lg bg-[var(--surface-inset)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-[#171717]">
                      {item.env}
                    </span>
                    <span className="rounded-md border border-[#E5E5E5] bg-white px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#171717]">
                      {item.role}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[13px] font-bold text-[#00775B]">
                    {item.version}
                  </p>
                </div>
                <p className="px-2.5 pt-2.5 pb-1 text-[12px] text-[#737373]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="border-b border-[#EFEFEF] pb-4">
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Historique des versions AutoCall
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Traçabilité des builds, commits, durées de compilation et compatibilité des migrations SQL en cas de retour arrière (rollback).
              </p>
            </div>

            <div className="mt-5 space-y-3.5">
              {INITIAL_DEPLOYMENTS.map((dep) => (
                <article
                  key={dep.id}
                  className={`rounded-2xl border p-4 ${
                    dep.badge === "Déployé"
                      ? "border-[#171717] bg-[#FAFBFB]"
                      : "border-[#EFEFEF] bg-[#FAFAFA]/70"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-[15.5px] font-bold text-[#171717]">
                        {dep.version}
                      </span>
                      <span className="rounded border border-[#E5E5E5] bg-white px-2 py-0.5 font-mono text-[11px] font-medium text-[#525252]">
                        {dep.environment}
                      </span>
                      <span
                        className={`rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                          dep.badge === "Déployé"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : dep.badge === "En validation"
                              ? "bg-[#F0C869] text-[#5C3D00]"
                              : dep.badge === "Échec"
                                ? "bg-[#FEE2E2] text-[#B91C1C]"
                                : "bg-[#EFEFEF] text-[#525252]"
                        }`}
                      >
                        {dep.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[12px] text-[#737373]">
                      <span>Branche : {dep.branch} ({dep.commitHash})</span>
                      <span>·</span>
                      <span>Build : {dep.buildDuration}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-[13.5px] text-[#171717]">{dep.summary}</p>

                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#525252]">
                    <span>
                      <strong>Base de données :</strong> {dep.dbMigrationNote}
                    </span>
                    {dep.badge === "Précédente" && (
                      <button
                        type="button"
                        onClick={() =>
                          notify(
                            `Vérification pré-rollback vers ${dep.version} : migrations SQL compatibles`,
                          )
                        }
                        className="h-8 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                      >
                        Simuler un rollback →
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          07. SOUS-ONGLET INCIDENTS (INC-0024 · Retards de transcription + Cycle 7 étapes)
         ===================================================================== */}
      {activeTab === "incidents" && (
        <div className="space-y-6">
          {/* Barre de progression du cycle de gestion d'incident en 7 étapes */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xs">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-[16px] font-semibold text-[#171717]">
                  Cycle normalisé de gestion d’un incident technique
                </h3>
                <p className="text-[12.5px] text-[#737373]">
                  De la détection initiale jusqu’au retour d’expérience post-mortem (RCA).
                </p>
              </div>
              <button
                type="button"
                onClick={handleAdvanceIncidentStage}
                className="h-9 shrink-0 rounded-xl bg-[#171717] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
              >
                Avancer l’étape de INC-0024 →
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {INCIDENT_LIFECYCLE_STEPS.map((step, idx) => {
                const isPastOrCurrent = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <span
                    key={step}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11.5px] font-semibold ${
                      isCurrent
                        ? "bg-[#171717] text-white"
                        : isPastOrCurrent
                          ? "bg-[#DEF5EC] text-[#008064]"
                          : "border border-[#E5E5E5] bg-[#FAFAFA] text-[#737373]"
                    }`}
                  >
                    <span>{idx + 1}.</span>
                    <span>{step}</span>
                  </span>
                );
              })}
            </div>
          </section>

          {/* Fiche détaillée de l'incident INC-0024 */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#EFEFEF] pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#F0C869] px-2.5 py-0.5 font-mono text-[12px] font-bold text-[#5C3D00]">
                    INC-0024 · P2
                  </span>
                  <span className="rounded-md bg-[#EFEFEF] px-2.5 py-0.5 font-mono text-[12px] font-semibold text-[#171717]">
                    {incidentStage}
                  </span>
                </div>
                <h3 className="mt-2 text-[19px] font-semibold text-[#171717]">
                  Retards de transcription
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onSelectTab("status-page")}
                className="h-9 rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[12.5px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer whitespace-nowrap"
              >
                Voir la communication publique →
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                <span className="block text-[11.5px] text-[#737373]">Service affecté</span>
                <span className="mt-1 block font-semibold text-[#171717]">
                  Workers de transcription
                </span>
              </div>
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                <span className="block text-[11.5px] text-[#737373]">
                  Entreprises affectées
                </span>
                <span className="mt-1 block font-mono text-[16px] font-bold text-[#171717]">
                  12
                </span>
              </div>
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                <span className="block text-[11.5px] text-[#737373]">Détection</span>
                <span className="mt-1 block font-mono text-[16px] font-bold text-[#171717]">
                  14:32
                </span>
              </div>
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                <span className="block text-[11.5px] text-[#737373]">Statut actuel</span>
                <span className="mt-1 block font-semibold text-[#8A5A00]">
                  {incidentStage}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-[14.5px] font-semibold text-[#171717]">
                Chronologie de l’incident
              </h4>
              <div className="mt-3 space-y-2.5">
                {incidentTimeline.map((item, i) => (
                  <div
                    key={`${item.time}-${i}`}
                    className="flex items-center gap-3 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 px-4 py-2.5 text-[13px]"
                  >
                    <span className="font-mono text-[12px] font-bold text-[#171717] tabular-nums">
                      {i + 1}. {item.time}
                    </span>
                    <span className="text-[#525252]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          08. SOUS-ONGLET PAGE STATUS (Aperçu fidèle de status.getautocall.fr + Administration)
         ===================================================================== */}
      {activeTab === "status-page" && (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xs sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16.5px] font-semibold text-[#171717]">
                  Administration de la Page Status publique
                </h3>
                <span className="rounded-md border border-[#E5E5E5] bg-[#FAFAFA] px-2.5 py-0.5 font-mono text-[11.5px] font-medium text-[#171717]">
                  status.getautocall.fr
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-[#737373]">
                Hébergée sur une infrastructure indépendante afin de rester consultable même en cas d’indisponibilité générale de l’application principale.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setMaintenanceModalOpen(true)}
                className="h-9 rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[12.5px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer whitespace-nowrap"
              >
                Planifier une maintenance
              </button>
              <button
                type="button"
                onClick={() => {
                  const isHealthy =
                    publicBannerStatus === "Tous les systèmes sont opérationnels";
                  setPublicBannerStatus(
                    isHealthy
                      ? "Perturbation partielle des services"
                      : "Tous les systèmes sont opérationnels",
                  );
                  setPublicBannerMessage(
                    isHealthy
                      ? "Des retards de transcription sont actuellement constatés."
                      : "Tous les services AutoCall fonctionnent nominalement.",
                  );
                  notify("Bandeau public de status.getautocall.fr mis à jour");
                }}
                className="h-9 rounded-xl bg-[#171717] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
              >
                Basculer l’état public
              </button>
            </div>
          </div>

          {/* Aperçu fidèle et épuré de status.getautocall.fr */}
          <section className="mx-auto max-w-4xl rounded-3xl border border-[#E5E5E5] bg-white p-6 shadow-xs sm:p-8">
            {/* En-tête de la page publique */}
            <div className="flex items-center justify-between border-b border-[#EFEFEF] pb-5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-8 items-center justify-center rounded-xl bg-[#171717] text-white">
                  <svg viewBox="0 0 64 64" className="size-5" fill="currentColor" aria-hidden="true">
                    <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
                  </svg>
                </span>
                <div>
                  <span className="text-[16px] font-bold tracking-tight text-[#171717]">
                    autocall
                  </span>
                  <span className="ml-2 rounded-md bg-[#F4F4F5] px-2 py-0.5 font-mono text-[11px] font-medium text-[#525252]">
                    System status
                  </span>
                </div>
              </div>

              <span className="font-mono text-[12px] text-[#737373]">
                status.getautocall.fr
              </span>
            </div>

            {/* Bandeau d'état global */}
            <div
              className={`mt-6 rounded-2xl border p-4 ${
                publicBannerStatus === "Tous les systèmes sont opérationnels"
                  ? "border-[#B9E8D2] bg-[#EAF3ED]"
                  : "border-[#F0C869] bg-[#FFFDF7]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`size-2.5 rounded-full ${
                    publicBannerStatus === "Tous les systèmes sont opérationnels"
                      ? "bg-[#15803D]"
                      : "bg-[#D99B26]"
                  }`}
                />
                <p className="text-[15px] font-semibold text-[#171717]">
                  {publicBannerStatus}
                </p>
              </div>
              <p className="mt-1 pl-5 text-[13px] text-[#525252]">
                {publicBannerMessage}
              </p>
            </div>

            {/* Barres de disponibilité 60 jours des 8 services */}
            <div className="mt-7 space-y-5">
              <div className="flex items-center justify-between text-[13px] font-semibold text-[#171717]">
                <span>Disponibilité des services</span>
                <span className="font-normal text-[#737373]">60 derniers jours</span>
              </div>

              <div className="divide-y divide-[#F2F2F2] rounded-2xl border border-[#EFEFEF] bg-[#FAFAFA]/60 px-5">
                {PUBLIC_STATUS_SERVICES.map((srv) => (
                  <div key={srv.id} className="py-4">
                    <div className="flex items-center justify-between text-[13.5px]">
                      <span className="font-semibold text-[#171717]">{srv.name}</span>
                      <span className="font-mono text-[12.5px] font-semibold text-[#008064] tabular-nums">
                        {srv.uptimePct}
                      </span>
                    </div>

                    {/* 48 bâtonnets illustrant les 60 derniers jours */}
                    <div className="mt-2 flex h-6 items-center gap-[3px]">
                      {Array.from({ length: 48 }).map((_, idx) => {
                        const isLastDegraded =
                          srv.degradedToday &&
                          publicBannerStatus !== "Tous les systèmes sont opérationnels" &&
                          idx >= 46;
                        return (
                          <span
                            key={idx}
                            className={`h-full flex-1 rounded-[2px] ${
                              isLastDegraded ? "bg-[#F0C869]" : "bg-[#408963]"
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="mt-1.5 flex justify-between text-[11px] text-[#737373]">
                      <span>Il y a 60 jours</span>
                      <span>Aujourd’hui</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historique public des incidents */}
            <div className="mt-7 border-t border-[#EFEFEF] pt-5">
              <h4 className="text-[14px] font-semibold text-[#171717]">
                Historique des incidents
              </h4>
              <div className="mt-3 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[13.5px] font-semibold text-[#171717]">
                    25 novembre 2026 — Retards de transcription
                  </span>
                  <span className="rounded-md bg-[#F0C869] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#5C3D00]">
                    {incidentStage}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] text-[#525252]">
                  Nos équipes observent un allongement du délai de livraison des transcriptions post-appel. Les appels téléphoniques en direct et les agents vocaux ne sont pas affectés.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          MODALE : PLANIFIER UNE MAINTENANCE PUBLIQUE SUR STATUS.GETAUTOCALL.FR
         ===================================================================== */}
      {maintenanceModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              Annoncer une maintenance planifiée
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              L’avis sera publié sur <strong>status.getautocall.fr</strong> afin d’informer les entreprises clientes à l’avance.
            </p>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Objet de l’opération
                </label>
                <input
                  type="text"
                  value={maintenanceTitle}
                  onChange={(e) => setMaintenanceTitle(e.target.value)}
                  placeholder="Ex: Mise à niveau mineure du pool PostgreSQL Neon"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Créneau horaire annoncé
                </label>
                <PremiumSelect
                  value={maintenanceWindow}
                  onChange={setMaintenanceWindow}
                  ariaLabel="Créneau de maintenance"
                  className="mt-1"
                  options={[
                    {
                      value: "Dimanche · 02:00 – 02:30 CET",
                      label: "Dimanche · 02:00 – 02:30 CET (Heures creuses)",
                    },
                    {
                      value: "Mercredi · 23:30 – 00:00 CET",
                      label: "Mercredi · 23:30 – 00:00 CET",
                    },
                  ]}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => setMaintenanceModalOpen(false)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setMaintenanceModalOpen(false);
                  setMaintenanceTitle("");
                  notify(
                    `Maintenance planifiée publiée sur status.getautocall.fr (${maintenanceWindow})`,
                  );
                }}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Publier l’avis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

