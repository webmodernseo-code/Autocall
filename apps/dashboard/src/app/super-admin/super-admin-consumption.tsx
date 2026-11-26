"use client";

import { useMemo, useState } from "react";
import {
  ElevenLabsBrandSvg,
  OpenAIBrandSvg,
  TwilioBrandSvg,
} from "../brand-icons";
import { PremiumSelect } from "../premium-select";
import { type Locale, SolarIcon } from "../workspace-navigation";
import { type SuperAdminSectionNavTarget } from "./super-admin-overview";

type PlanTier = "Starter" | "Pro" | "Business";
type LedgerOperationType =
  | "Attribution mensuelle"
  | "Appel IA terminé"
  | "Réservation de minutes"
  | "Libération de la réservation"
  | "Recharge achetée"
  | "Expiration"
  | "Ajustement"
  | "Compensation";

type AnomalyCategory =
  | "Double débit"
  | "Surconsommation"
  | "Consommation inhabituelle"
  | "Réservation bloquée"
  | "Écart fournisseur"
  | "Consommation non attribuée";

interface DailyVoicePoint {
  date: string;
  minutes: number;
}

const DAILY_VOICE_BARS: DailyVoicePoint[] = [
  { date: "01 nov.", minutes: 1420 },
  { date: "04 nov.", minutes: 1680 },
  { date: "07 nov.", minutes: 1540 },
  { date: "10 nov.", minutes: 1920 },
  { date: "13 nov.", minutes: 2180 },
  { date: "16 nov.", minutes: 1890 },
  { date: "19 nov.", minutes: 2410 },
  { date: "22 nov.", minutes: 2640 },
  { date: "25 nov.", minutes: 2790 },
];

const SERVICE_COST_SHARE = [
  {
    id: "voice",
    label: "Téléphonie et voix IA",
    unitLabel: "Minutes d’appels",
    volumeDisplay: "48 620 minutes",
    companiesCount: 214,
    sharePct: 62,
    estimatedCostEur: 4480,
    confirmedCostEur: 4412,
    verificationState: "Confirmé (CDR rapprochés)",
    color: "#171717",
  },
  {
    id: "acquisition",
    label: "Acquisition",
    unitLabel: "Crédits de recherche et d’enrichissement",
    volumeDisplay: "12 840 crédits",
    companiesCount: 162,
    sharePct: 18,
    estimatedCostEur: 1300,
    confirmedCostEur: 1290,
    verificationState: "Confirmé",
    color: "#008F6D",
  },
  {
    id: "ai-units",
    label: "Intelligence artificielle",
    unitLabel: "Unités IA selon le barème retenu",
    volumeDisplay: "184 500 unités IA",
    companiesCount: 228,
    sharePct: 10,
    estimatedCostEur: 720,
    confirmedCostEur: 714,
    verificationState: "Mesuré (Tokens OpenAI)",
    color: "#1D4ED8",
  },
  {
    id: "transcription",
    label: "Transcription",
    unitLabel: "Minutes audio traitées",
    volumeDisplay: "46 190 minutes audio",
    companiesCount: 214,
    sharePct: 7,
    estimatedCostEur: 505,
    confirmedCostEur: 501,
    verificationState: "Confirmé",
    color: "#8760C4",
  },
  {
    id: "images",
    label: "Génération d’images",
    unitLabel: "Images ou crédits de génération (Social Studio)",
    volumeDisplay: "1 420 visuels générés",
    companiesCount: 74,
    sharePct: 3,
    estimatedCostEur: 215,
    confirmedCostEur: null,
    verificationState: "Estimé (Facture fin de mois)",
    color: "#B7791F",
  },
];

interface CompanyConsumptionRow {
  id: string;
  initials: string;
  companyName: string;
  plan: PlanTier;
  voiceUsed: number;
  voiceQuota: number;
  acquisitionUsed: number;
  acquisitionQuota: number;
  aiUnitsUsed: number;
  aiUnitsQuota: number;
  topupsThisMonth: string;
  autoTopupEnabled: boolean;
  anomaliesCount: number;
}

const INITIAL_COMPANIES_CONSUMPTION: CompanyConsumptionRow[] = [
  {
    id: "c-nova",
    initials: "N",
    companyName: "Nova Services",
    plan: "Pro",
    voiceUsed: 450,
    voiceQuota: 500,
    acquisitionUsed: 410,
    acquisitionQuota: 600,
    aiUnitsUsed: 1480,
    aiUnitsQuota: 2000,
    topupsThisMonth: "1 pack (+100 min)",
    autoTopupEnabled: false,
    anomaliesCount: 1,
  },
  {
    id: "c-atlas",
    initials: "A",
    companyName: "Atlas Immobilier",
    plan: "Business",
    voiceUsed: 680,
    voiceQuota: 1000,
    acquisitionUsed: 1120,
    acquisitionQuota: 2000,
    aiUnitsUsed: 3840,
    aiUnitsQuota: 6000,
    topupsThisMonth: "Aucune",
    autoTopupEnabled: false,
    anomaliesCount: 0,
  },
  {
    id: "c-clean",
    initials: "C",
    companyName: "Clean Studio",
    plan: "Starter",
    voiceUsed: 98,
    voiceQuota: 100,
    acquisitionUsed: 124,
    acquisitionQuota: 150,
    aiUnitsUsed: 460,
    aiUnitsQuota: 500,
    topupsThisMonth: "Aucune",
    autoTopupEnabled: false,
    anomaliesCount: 1,
  },
  {
    id: "c-mondo",
    initials: "M",
    companyName: "Mondo Services",
    plan: "Pro",
    voiceUsed: 220,
    voiceQuota: 500,
    acquisitionUsed: 190,
    acquisitionQuota: 600,
    aiUnitsUsed: 840,
    aiUnitsQuota: 2000,
    topupsThisMonth: "Aucune",
    autoTopupEnabled: false,
    anomaliesCount: 0,
  },
  {
    id: "c-horizon",
    initials: "S",
    companyName: "Studio Horizon",
    plan: "Starter",
    voiceUsed: 100,
    voiceQuota: 100,
    acquisitionUsed: 150,
    acquisitionQuota: 150,
    aiUnitsUsed: 500,
    aiUnitsQuota: 500,
    topupsThisMonth: "Aucune (Bloqué à 100 %)",
    autoTopupEnabled: false,
    anomaliesCount: 1,
  },
];

interface LedgerEntry {
  id: string;
  timestamp: string;
  companyName: string;
  resourceType: "Minutes vocales" | "Crédits Acquisition" | "Unités IA";
  operation: LedgerOperationType;
  delta: number;
  unit: "min" | "crédits" | "u.";
  balanceAfter: number;
  verificationState: "Confirmé" | "Mesuré" | "Estimé";
  reference: string;
}

const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: "LED-906",
    timestamp: "Aujourd’hui · 11:42",
    companyName: "Nova Services",
    resourceType: "Minutes vocales",
    operation: "Compensation",
    delta: 3,
    unit: "min",
    balanceAfter: 595,
    verificationState: "Confirmé",
    reference: " Écriture corrective #COR-104 (Ticket SUP-418)",
  },
  {
    id: "LED-905",
    timestamp: "Aujourd’hui · 11:15",
    companyName: "Nova Services",
    resourceType: "Minutes vocales",
    operation: "Recharge achetée",
    delta: 100,
    unit: "min",
    balanceAfter: 592,
    verificationState: "Confirmé",
    reference: "Transaction Stripe TRX-9084",
  },
  {
    id: "LED-904",
    timestamp: "Aujourd’hui · 10:50",
    companyName: "Nova Services",
    resourceType: "Minutes vocales",
    operation: "Libération de la réservation",
    delta: 5,
    unit: "min",
    balanceAfter: 492,
    verificationState: "Confirmé",
    reference: "Appel #CALL-8820 (Ligne occupée · 0s facturée)",
  },
  {
    id: "LED-903",
    timestamp: "Aujourd’hui · 10:49",
    companyName: "Nova Services",
    resourceType: "Minutes vocales",
    operation: "Réservation de minutes",
    delta: -5,
    unit: "min",
    balanceAfter: 487,
    verificationState: "Estimé",
    reference: "Pré-autorisation appel sortant #CALL-8820",
  },
  {
    id: "LED-902",
    timestamp: "Aujourd’hui · 10:12",
    companyName: "Nova Services",
    resourceType: "Minutes vocales",
    operation: "Appel IA terminé",
    delta: -8,
    unit: "min",
    balanceAfter: 492,
    verificationState: "Mesuré",
    reference: "Appel #CALL-8814 · Agent Emma (7m 44s)",
  },
  {
    id: "LED-901",
    timestamp: "01 nov. 2026 · 00:00",
    companyName: "Nova Services",
    resourceType: "Minutes vocales",
    operation: "Attribution mensuelle",
    delta: 500,
    unit: "min",
    balanceAfter: 500,
    verificationState: "Confirmé",
    reference: "Renouvellement mensuel Offre Pro (v2026.2)",
  },
];

interface AnomalyRecord {
  id: string;
  category: AnomalyCategory;
  severity: "Critique" | "Élevée" | "Modérée";
  companyName: string;
  detectedAt: string;
  exampleSummary: string;
  technicalDetail: string;
  impactDisplay: string;
  status: "À examiner" | "En investigation" | "Corrigée (Compensation émise)";
}

const INITIAL_ANOMALIES: AnomalyRecord[] = [
  {
    id: "ANO-401",
    category: "Double débit",
    severity: "Critique",
    companyName: "Nova Services",
    detectedAt: "Aujourd’hui · 11:30",
    exampleSummary: "Un même appel est débité deux fois.",
    technicalDetail:
      "Webhook de fin d’appel Twilio reçu deux fois (#CALL-8809) suite à un timeout réseau · 2 débits de 4 min détectés.",
    impactDisplay: "−4 min à recréditer",
    status: "À examiner",
  },
  {
    id: "ANO-402",
    category: "Réservation bloquée",
    severity: "Élevée",
    companyName: "Clean Studio",
    detectedAt: "Aujourd’hui · 10:18",
    exampleSummary: "Des crédits restent réservés après un échec.",
    technicalDetail:
      "Réservation pré-appel de 10 min (#RES-7741) non libérée après erreur SIP 503 opérateur.",
    impactDisplay: "10 min verrouillées",
    status: "À examiner",
  },
  {
    id: "ANO-403",
    category: "Surconsommation",
    severity: "Élevée",
    companyName: "Studio Horizon",
    detectedAt: "Hier · 18:40",
    exampleSummary: "Une entreprise dépasse son quota autorisé.",
    technicalDetail:
      "Appel entrant en cours (#CALL-8712) prolongé de 4 min au-delà du plafond 100/100 min (pas de coupure brutale d’un appel actif).",
    impactDisplay: "104 / 100 min (104 %)",
    status: "À examiner",
  },
  {
    id: "ANO-404",
    category: "Consommation inhabituelle",
    severity: "Modérée",
    companyName: "Atlas Immobilier",
    detectedAt: "Hier · 15:10",
    exampleSummary: "Une augmentation soudaine des appels IA.",
    technicalDetail:
      "Pic de +310 % d’appels sortants en 20 minutes suite au lancement simultané de 3 séquences de relance.",
    impactDisplay: "+185 min / 20 min",
    status: "En investigation",
  },
  {
    id: "ANO-405",
    category: "Écart fournisseur",
    severity: "Modérée",
    companyName: "Plateforme globale (ElevenLabs)",
    detectedAt: "24 nov. 2026",
    exampleSummary: "Les minutes facturées diffèrent des minutes enregistrées.",
    technicalDetail:
      "Écart de 1,6 % entre la durée TTS mesurée par le worker AutoCall et le relevé API ElevenLabs (arrondi par paliers).",
    impactDisplay: "Écart +45 €",
    status: "Corrigée (Compensation émise)",
  },
  {
    id: "ANO-406",
    category: "Consommation non attribuée",
    severity: "Critique",
    companyName: "Orphelin (tenant_id manquant)",
    detectedAt: "23 nov. 2026",
    exampleSummary: "Une consommation ne peut être rattachée à une entreprise.",
    technicalDetail:
      "Appel entrant sur le numéro DID +33 1 86 95 00 99 en cours de portabilité avant rattachement final au tenant.",
    impactDisplay: "2 min non imputées",
    status: "Corrigée (Compensation émise)",
  },
];

export function SuperAdminConsumption({
  activeTab,
  onSelectTab,
}: {
  activeTab: string;
  locale: Locale;
  onSelectTab: (tabId: string) => void;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  const [companies] = useState<CompanyConsumptionRow[]>(INITIAL_COMPANIES_CONSUMPTION);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>(INITIAL_ANOMALIES);

  // Filtres 02. Entreprises
  const [companyFilter, setCompanyFilter] = useState<"all" | "warning" | "critical" | "full">("all");
  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Filtres 04. Registre
  const [ledgerOpFilter, setLedgerOpFilter] = useState<"all" | LedgerOperationType>("all");

  // Modale d'écriture corrective traçable (Compensation / Ajustement sans jamais effacer un mouvement)
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionCompany, setCorrectionCompany] = useState("Nova Services");
  const [correctionType, setCorrectionType] = useState<"Compensation" | "Ajustement">("Compensation");
  const [correctionDelta, setCorrectionDelta] = useState("+5");
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionTotp, setCorrectionTotp] = useState("");
  const [correctionError, setCorrectionError] = useState<string | null>(null);

  // Fiche détaillée d'une anomalie (06. Anomalies)
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  const selectedCompany = useMemo(
    () => companies.find((c) => c.id === selectedCompanyId) ?? null,
    [companies, selectedCompanyId],
  );

  const selectedAnomaly = useMemo(
    () => anomalies.find((a) => a.id === selectedAnomalyId) ?? null,
    [anomalies, selectedAnomalyId],
  );

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const pct = Math.round((c.voiceUsed / c.voiceQuota) * 100);
      if (companyFilter === "warning" && (pct < 80 || pct >= 95)) return false;
      if (companyFilter === "critical" && (pct < 95 || pct >= 100)) return false;
      if (companyFilter === "full" && pct < 100) return false;
      if (companySearch.trim()) {
        const q = companySearch.toLowerCase();
        return (
          c.companyName.toLowerCase().includes(q) ||
          c.plan.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [companies, companyFilter, companySearch]);

  const filteredLedger = useMemo(() => {
    return ledger.filter((entry) => {
      if (ledgerOpFilter !== "all" && entry.operation !== ledgerOpFilter) return false;
      return true;
    });
  }, [ledger, ledgerOpFilter]);

  const handleAddCorrectiveEntry = () => {
    const parsedDelta = Number(correctionDelta);
    if (!parsedDelta || Number.isNaN(parsedDelta)) {
      setCorrectionError("Veuillez saisir un nombre de minutes valide (ex: +5 ou -5).");
      return;
    }
    if (!correctionReason.trim()) {
      setCorrectionError("Le motif de l’écriture corrective est obligatoire (traçabilité du registre).");
      return;
    }
    if (correctionTotp.trim().length < 6) {
      setCorrectionError("Code MFA Super Admin à 6 chiffres requis.");
      return;
    }

    const latestBalance = ledger[0]?.balanceAfter ?? 595;
    const nextBalance = latestBalance + parsedDelta;

    const newEntry: LedgerEntry = {
      id: `LED-${907 + ledger.length}`,
      timestamp: "À l’instant",
      companyName: correctionCompany,
      resourceType: "Minutes vocales",
      operation: correctionType,
      delta: parsedDelta,
      unit: "min",
      balanceAfter: nextBalance,
      verificationState: "Confirmé",
      reference: `Opération corrective MFA · ${correctionReason.trim()}`,
    };

    setLedger((prev) => [newEntry, ...prev]);
    setCorrectionModalOpen(false);
    setCorrectionReason("");
    setCorrectionTotp("");
    setCorrectionError(null);
    notify(
      `${correctionType} (${parsedDelta > 0 ? `+${parsedDelta}` : parsedDelta} min) inscrite au registre sans altérer l’historique`,
    );
  };

  const handleResolveAnomalyWithCompensation = (anomaly: AnomalyRecord) => {
    setAnomalies((prev) =>
      prev.map((a) =>
        a.id === anomaly.id
          ? { ...a, status: "Corrigée (Compensation émise)" }
          : a,
      ),
    );
    const latestBalance = ledger[0]?.balanceAfter ?? 595;
    setLedger((prev) => [
      {
        id: `LED-${910 + prev.length}`,
        timestamp: "À l’instant",
        companyName: anomaly.companyName,
        resourceType: "Minutes vocales",
        operation: "Compensation",
        delta: 4,
        unit: "min",
        balanceAfter: latestBalance + 4,
        verificationState: "Confirmé",
        reference: `Résolution anomalie ${anomaly.id} (${anomaly.category})`,
      },
      ...prev,
    ]);
    setSelectedAnomalyId(null);
    notify(
      `Anomalie ${anomaly.id} résolue · Écriture de compensation inscrite dans le Registre`,
    );
  };

  return (
    <div className="mt-7 space-y-7">
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-[#E5E5E5] bg-[#171717] px-4 py-3 text-[13.5px] font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Bandeau de règle métier : unités strictement séparées + registre immuable */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-2xs lg:flex-row lg:items-center">
        <div className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
          <span className="inline-flex size-2 shrink-0 rounded-full bg-[#008F6D]" />
          <span>
            <strong className="font-semibold text-[var(--foreground)]">
              04 · Consommations :
            </strong>{" "}
            Unités suivies séparément (Minutes vocales ≠ Crédits d’acquisition ≠ Unités IA) · Toute correction passe par une écriture de compensation traçable.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCorrectionError(null);
              setCorrectionModalOpen(true);
            }}
            className="h-8 rounded-lg bg-[#171717] px-3 text-[12.5px] font-semibold text-white whitespace-nowrap hover:bg-[#2E2E2E] cursor-pointer"
          >
            + Écriture corrective / Compensation
          </button>
        </div>
      </div>

      {/* =====================================================================
          01. SOUS-ONGLET SYNTHÈSE
         ===================================================================== */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          {/* 4 blocs de statistiques double surface style Dashboard Admin Client :
              48 620 minutes / 12 840 crédits / 18 entreprises proches du quota / 4 anomalies ouvertes */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="phone" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                    Minutes vocales (Ce mois)
                  </p>
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <p className="text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                    48 620
                  </p>
                  <span className="text-[13px] font-medium text-[#737373]">minutes</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("services")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[12.5px] font-medium text-[#008F6D] hover:underline cursor-pointer"
              >
                <span>↗ Détail Téléphonie &amp; voix IA</span>
                <span>→</span>
              </button>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="acquisition" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                    Acquisition (Ce mois)
                  </p>
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <p className="text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                    12 840
                  </p>
                  <span className="text-[13px] font-medium text-[#737373]">crédits</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("services")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[12.5px] font-medium text-[#008F6D] hover:underline cursor-pointer"
              >
                <span>↗ Recherche &amp; enrichissement</span>
                <span>→</span>
              </button>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="crm" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                    Entreprises proches du quota
                  </p>
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <p className="text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                    18
                  </p>
                  <span className="text-[13px] font-medium text-[#737373]">entreprises</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("quotas")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[12.5px] font-medium text-[#171717] hover:text-[#008F6D] hover:underline cursor-pointer"
              >
                <span>Seuils 80 % · 95 % · 100 %</span>
                <span>→</span>
              </button>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                    Anomalies ouvertes
                  </p>
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <p className="text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                    4
                  </p>
                  <span className="text-[13px] font-medium text-[#E11D48]">à examiner</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("anomalies")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[12.5px] font-medium text-[#E11D48] hover:underline cursor-pointer"
              >
                <span>Inspecter les 4 anomalies</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Graphique Évolution des minutes vocales + Répartition des coûts estimés par service */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Colonne gauche (7 col) : Évolution des minutes vocales (01 nov. -> 25 nov.) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#171717]">
                    Évolution des minutes vocales
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#737373]">
                    Consommation quotidienne mesurée en minutes d’appels (01 nov. – 25 nov.)
                  </p>
                </div>
                <span className="rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-2.5 py-1 font-mono text-[12px] font-medium text-[#171717]">
                  Unité : minutes vocales
                </span>
              </div>

              {/* Graphique en barres avec axe Y (550 / 1.1K / 1.6K / 2.2K / 2.8K) */}
              <div className="mt-6 flex gap-3">
                <div className="flex h-52 flex-col justify-between pb-6 text-right font-mono text-[11px] text-[#737373] tabular-nums">
                  <span>2.8K</span>
                  <span>2.2K</span>
                  <span>1.6K</span>
                  <span>1.1K</span>
                  <span>550</span>
                  <span>0</span>
                </div>

                <div className="flex flex-1 items-end justify-between gap-2 border-b border-[#EFEFEF] pb-2">
                  {DAILY_VOICE_BARS.map((pt) => {
                    const heightPct = Math.round((pt.minutes / 2800) * 100);
                    return (
                      <div
                        key={pt.date}
                        className="group flex flex-1 flex-col items-center gap-2"
                      >
                        <div className="relative flex h-44 w-full items-end justify-center">
                          <div
                            className="w-full max-w-[34px] rounded-t-lg bg-[#171717] transition-all group-hover:bg-[#008F6D]"
                            style={{ height: `${heightPct}%` }}
                            title={`${pt.date} : ${pt.minutes.toLocaleString("fr-FR")} min`}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-[#737373] whitespace-nowrap">
                          {pt.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Colonne droite (5 col) : Coûts estimés par service (62% / 18% / 10% / 7% / 3%) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
              <div className="flex items-center justify-between gap-2 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#171717]">
                    Coûts estimés par service
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#737373]">
                    Répartition de la charge fournisseur du mois en cours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab("services")}
                  className="text-[12.5px] font-medium text-[#008F6D] hover:underline cursor-pointer"
                >
                  Détails →
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {SERVICE_COST_SHARE.map((srv) => (
                  <div key={srv.id}>
                    <div className="flex items-center justify-between text-[13.5px]">
                      <span className="font-medium text-[#171717]">{srv.label}</span>
                      <span className="font-mono font-semibold text-[#171717] tabular-nums">
                        {srv.sharePct} %
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EFEFEF]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${srv.sharePct}%`,
                          backgroundColor: srv.color,
                        }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11.5px] text-[#737373]">
                      <span>{srv.volumeDisplay}</span>
                      <span className="font-mono">{srv.estimatedCostEur} € est.</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* =====================================================================
          02. SOUS-ONGLET ENTREPRISES (Suivi des consommations par entreprise)
         ===================================================================== */}
      {activeTab === "companies" && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-5 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Consommations par entreprise
                </h3>
                <p className="mt-0.5 text-[13.5px] text-[#737373]">
                  Identifiez les entreprises qui consomment le plus de ressources et celles qui approchent de leurs plafonds. Cliquez sur une ligne pour inspecter son détail.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1">
                {(
                  [
                    { id: "all" as const, label: "Tous" },
                    { id: "warning" as const, label: "Seuil ≥ 80 %" },
                    { id: "critical" as const, label: "Critique ≥ 95 %" },
                    { id: "full" as const, label: "Quota atteint 100 %" },
                  ] as const
                ).map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setCompanyFilter(pill.id)}
                    className={`h-8 rounded-lg px-3 text-[13px] font-medium whitespace-nowrap transition cursor-pointer ${
                      companyFilter === pill.id
                        ? "bg-[#171717] text-white shadow-2xs"
                        : "text-[#525252] hover:text-[#171717]"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="relative flex items-center">
                <SolarIcon
                  name="search"
                  className="pointer-events-none absolute left-3.5 size-4 text-[#737373]"
                />
                <input
                  type="search"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  placeholder="Rechercher une entreprise ou une offre..."
                  className="h-10 w-full rounded-xl border border-[#E5E5E5] bg-white pr-4 pl-10 text-[13.5px] text-[#171717] placeholder:text-[#737373] outline-none focus:border-[#171717]"
                />
              </label>
            </div>

            <div className="mt-5 overflow-x-auto pb-1">
              <table className="w-full min-w-[840px] border-collapse text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                    <th className="py-3 pr-4">Entreprise</th>
                    <th className="px-4 py-3">Offre</th>
                    <th className="px-4 py-3">Utilisation Minutes vocales</th>
                    <th className="px-4 py-3">Crédits Acquisition</th>
                    <th className="px-4 py-3">Recharges ce mois</th>
                    <th className="py-3 pl-4 text-right">Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F2F2]">
                  {filteredCompanies.map((comp) => {
                    const pct = Math.round((comp.voiceUsed / comp.voiceQuota) * 100);
                    const isSelected = selectedCompanyId === comp.id;
                    return (
                      <tr
                        key={comp.id}
                        onClick={() =>
                          setSelectedCompanyId((prev) => (prev === comp.id ? null : comp.id))
                        }
                        className={`transition cursor-pointer ${
                          isSelected ? "bg-[#F4F8F6]" : "hover:bg-[#FAFAFA]"
                        }`}
                      >
                        <td className="py-4 pr-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] text-[13.5px] font-semibold text-[#171717]">
                              {comp.initials}
                            </span>
                            <div>
                              <span className="font-semibold text-[#171717]">
                                {comp.companyName}
                              </span>
                              {comp.anomaliesCount > 0 && (
                                <span className="ml-2 rounded bg-[#FCE7EB] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#B91C1C]">
                                  {comp.anomaliesCount} anomalie
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1 text-[12.5px] font-semibold text-[#171717]">
                            {comp.plan}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="w-52">
                            <div className="flex items-center justify-between font-mono text-[12.5px] tabular-nums">
                              <span className="font-semibold text-[#171717]">
                                {comp.voiceUsed}/{comp.voiceQuota} min
                              </span>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[11.5px] font-bold ${
                                  pct >= 100
                                    ? "bg-[#FCE7EB] text-[#B91C1C]"
                                    : pct >= 95
                                      ? "bg-[#FCE7EB] text-[#B91C1C]"
                                      : pct >= 80
                                        ? "bg-[#F0C869] text-[#5C3D00]"
                                        : "bg-[#DEF5EC] text-[#008064]"
                                }`}
                              >
                                {pct}%
                              </span>
                            </div>
                            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EFEFEF]">
                              <div
                                className={`h-full rounded-full ${
                                  pct >= 95
                                    ? "bg-[#E11D48]"
                                    : pct >= 80
                                      ? "bg-[#F0C869]"
                                      : "bg-[#008F6D]"
                                }`}
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-mono text-[12.5px] text-[#525252] whitespace-nowrap tabular-nums">
                          {comp.acquisitionUsed} / {comp.acquisitionQuota} crédits
                        </td>
                        <td className="px-4 py-4 text-[13px] text-[#525252] whitespace-nowrap">
                          {comp.topupsThisMonth}
                        </td>
                        <td className="py-4 pl-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCompanyId((prev) =>
                                prev === comp.id ? null : comp.id,
                              );
                            }}
                            className="inline-flex h-8 items-center rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs hover:bg-[#F4F4F5] cursor-pointer"
                          >
                            {isSelected ? "Fermer détail" : "Voir détail →"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Panneau détaillé de l'entreprise sélectionnée */}
          {selectedCompany && (
            <section className="rounded-2xl border border-[#171717] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <span className="rounded-md bg-[#E6F5F0] px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#00775B]">
                    Fiche Consommations Entreprise
                  </span>
                  <h4 className="mt-1.5 text-[18px] font-semibold text-[#171717]">
                    {selectedCompany.companyName} — Offre {selectedCompany.plan}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCorrectionCompany(selectedCompany.companyName);
                      setCorrectionError(null);
                      setCorrectionModalOpen(true);
                    }}
                    className="h-9 rounded-xl bg-[#171717] px-3.5 text-[13px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
                  >
                    + Émettre une compensation
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTab("ledger")}
                    className="h-9 rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[13px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                  >
                    Ouvrir son registre →
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                  <p className="text-[12px] font-medium text-[#737373]">
                    1. Minutes vocales IA
                  </p>
                  <p className="mt-1 font-mono text-[22px] font-bold text-[#171717] tabular-nums">
                    {selectedCompany.voiceUsed} / {selectedCompany.voiceQuota} min
                  </p>
                  <p className="mt-1 text-[12px] text-[#525252]">
                    Recharges ce mois : {selectedCompany.topupsThisMonth}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                  <p className="text-[12px] font-medium text-[#737373]">
                    2. Crédits Acquisition B2B
                  </p>
                  <p className="mt-1 font-mono text-[22px] font-bold text-[#171717] tabular-nums">
                    {selectedCompany.acquisitionUsed} / {selectedCompany.acquisitionQuota} crédits
                  </p>
                  <p className="mt-1 text-[12px] text-[#525252]">
                    Enrichissement contacts &amp; signaux
                  </p>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                  <p className="text-[12px] font-medium text-[#737373]">
                    3. Unités IA (LLM &amp; Résumés)
                  </p>
                  <p className="mt-1 font-mono text-[22px] font-bold text-[#171717] tabular-nums">
                    {selectedCompany.aiUnitsUsed.toLocaleString("fr-FR")} /{" "}
                    {selectedCompany.aiUnitsQuota.toLocaleString("fr-FR")} u.
                  </p>
                  <p className="mt-1 text-[12px] text-[#525252]">
                    Recharge auto : {selectedCompany.autoTopupEnabled ? "Activée" : "Désactivée (défaut)"}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* =====================================================================
          03. SOUS-ONGLET SERVICES (Suivi indépendant de chaque service)
         ===================================================================== */}
      {activeTab === "services" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xs">
            <h3 className="text-[17px] font-semibold text-[#171717]">
              Consommations par service AutoCall
            </h3>
            <p className="mt-0.5 text-[13.5px] text-[#737373]">
              Chaque service est suivi dans son unité propre avec distinction entre coût fournisseur estimé, mesuré et confirmé.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {SERVICE_COST_SHARE.map((srv) => (
              <article
                key={srv.id}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs"
              >
                <div className="rounded-xl bg-[var(--surface-inset)] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-2 shadow-2xs">
                        {srv.id === "voice" ? (
                          <TwilioBrandSvg className="size-full" />
                        ) : srv.id === "transcription" ? (
                          <ElevenLabsBrandSvg className="size-full" />
                        ) : srv.id === "ai-units" ? (
                          <OpenAIBrandSvg className="size-full" />
                        ) : (
                          <SolarIcon
                            name={srv.id === "acquisition" ? "acquisition" : "sparkle"}
                            className="size-5 text-[#171717]"
                          />
                        )}
                      </span>
                      <div>
                        <h4 className="text-[16px] font-semibold text-[#171717]">
                          {srv.label}
                        </h4>
                        <p className="text-[12.5px] text-[#737373]">{srv.unitLabel}</p>
                      </div>
                    </div>

                    <span className="rounded-md border border-[#E5E5E5] bg-white px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#171717] shadow-2xs">
                      {srv.sharePct} % des coûts
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between border-t border-[#E5E5E5]/80 pt-4">
                    <div>
                      <span className="block text-[11.5px] text-[#737373]">
                        Volume consommé (Ce mois)
                      </span>
                      <span className="mt-0.5 block font-mono text-[24px] font-bold tracking-tight text-[#171717] tabular-nums">
                        {srv.volumeDisplay}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="block text-[11.5px] text-[#737373]">
                        Entreprises actives
                      </span>
                      <span className="mt-0.5 block text-[16px] font-semibold text-[#171717] tabular-nums">
                        {srv.companiesCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 px-1 pb-1 text-[12.5px]">
                  <div className="rounded-xl border border-[#EFEFEF] bg-white p-3">
                    <span className="block text-[11.5px] text-[#737373]">Coût estimé</span>
                    <span className="mt-0.5 block font-mono font-semibold text-[#171717]">
                      {srv.estimatedCostEur} €
                    </span>
                  </div>
                  <div className="rounded-xl border border-[#EFEFEF] bg-white p-3">
                    <span className="block text-[11.5px] text-[#737373]">Coût confirmé</span>
                    <span className="mt-0.5 block font-mono font-semibold text-[#008064]">
                      {srv.confirmedCostEur !== null ? `${srv.confirmedCostEur} €` : "En attente"}
                    </span>
                  </div>
                  <div className="rounded-xl border border-[#EFEFEF] bg-white p-3">
                    <span className="block text-[11.5px] text-[#737373]">Statut mesure</span>
                    <span className="mt-0.5 block truncate font-medium text-[#171717]">
                      {srv.verificationState}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          04. SOUS-ONGLET REGISTRE (Relevé immuable de chaque mouvement)
         ===================================================================== */}
      {activeTab === "ledger" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-5 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Registre des mouvements de crédits &amp; minutes
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Journal immuable distinguant les attributions, réservations, débits définitifs, libérations, recharges, expirations, ajustements et compensations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-56">
                <PremiumSelect
                  value={ledgerOpFilter}
                  onChange={(v) => setLedgerOpFilter(v as "all" | LedgerOperationType)}
                  ariaLabel="Filtrer par type d'opération"
                  options={[
                    { value: "all", label: "Toutes les opérations" },
                    { value: "Attribution mensuelle", label: "Attribution mensuelle" },
                    { value: "Appel IA terminé", label: "Appel IA terminé" },
                    { value: "Réservation de minutes", label: "Réservation de minutes" },
                    { value: "Libération de la réservation", label: "Libération de la réservation" },
                    { value: "Recharge achetée", label: "Recharge achetée" },
                    { value: "Compensation", label: "Compensation" },
                    { value: "Ajustement", label: "Ajustement" },
                  ]}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setCorrectionError(null);
                  setCorrectionModalOpen(true);
                }}
                className="inline-flex h-10 items-center rounded-xl bg-[#171717] px-3.5 text-[13px] font-semibold text-white whitespace-nowrap hover:bg-[#2E2E2E] cursor-pointer"
              >
                + Opération corrective
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto pb-1">
            <table className="w-full min-w-[860px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                  <th className="py-3 pr-4">ID &amp; Horodatage</th>
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Opération</th>
                  <th className="px-4 py-3 text-right">Mouvement</th>
                  <th className="px-4 py-3 text-right">Solde disponible</th>
                  <th className="px-4 py-3">État</th>
                  <th className="py-3 pl-4">Référence &amp; Preuve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {filteredLedger.map((row) => (
                  <tr key={row.id} className="transition hover:bg-[#FAFAFA]">
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <p className="font-mono text-[12.5px] font-semibold text-[#171717]">
                        {row.id}
                      </p>
                      <p className="text-[12px] text-[#737373]">{row.timestamp}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#171717] whitespace-nowrap">
                      {row.companyName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[12px] font-semibold ${
                          row.operation === "Compensation" || row.operation === "Ajustement"
                            ? "bg-[#E4EEFE] text-[#1D4ED8]"
                            : row.operation === "Réservation de minutes"
                              ? "bg-[#F0C869] text-[#5C3D00]"
                              : row.delta > 0
                                ? "bg-[#DEF5EC] text-[#008064]"
                                : "bg-[#EFEFEF] text-[#171717]"
                        }`}
                      >
                        {row.operation}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-[14px] font-bold tabular-nums whitespace-nowrap">
                      <span className={row.delta > 0 ? "text-[#008064]" : "text-[#171717]"}>
                        {row.delta > 0 ? `+${row.delta}` : `−${Math.abs(row.delta)}`}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-[13.5px] font-semibold text-[#171717] tabular-nums whitespace-nowrap">
                      {row.balanceAfter} {row.unit}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="rounded bg-[#F8F8F8] px-2 py-0.5 font-mono text-[11.5px] text-[#525252]">
                        {row.verificationState}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-[12.5px] text-[#525252]">
                      {row.reference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          05. SOUS-ONGLET QUOTAS (Surveillance des seuils 45% / 80% / 95% / 100%)
         ===================================================================== */}
      {activeTab === "quotas" && (
        <div className="space-y-6">
          {/* Les 4 paliers officiels de surveillance des seuils */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Consommation normale",
                threshold: "45 %",
                count: "212 entreprises",
                rule: "Aucune intervention nécessaire.",
                barColor: "bg-[#008F6D]",
                badgeClass: "bg-[#DEF5EC] text-[#008064]",
                width: 45,
              },
              {
                title: "Premier seuil d’alerte",
                threshold: "80 %",
                count: "12 entreprises",
                rule: "Informer le client de sa consommation (notification in-app + e-mail).",
                barColor: "bg-[#F0C869]",
                badgeClass: "bg-[#F0C869] text-[#5C3D00]",
                width: 80,
              },
              {
                title: "Seuil critique",
                threshold: "95 %",
                count: "6 entreprises",
                rule: "Prévenir le client avant épuisement et proposer un pack de recharge.",
                barColor: "bg-[#E11D48]",
                badgeClass: "bg-[#FCE7EB] text-[#B91C1C]",
                width: 95,
              },
              {
                title: "Quota atteint",
                threshold: "100 %",
                count: "3 entreprises",
                rule: "Appliquer les règles prévues par son offre (pause campagnes sortantes).",
                barColor: "bg-[#171717]",
                badgeClass: "bg-[#171717] text-white",
                width: 100,
              },
            ].map((tier) => (
              <div
                key={tier.title}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs"
              >
                <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13.5px] font-semibold text-[#171717]">
                      {tier.title}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 font-mono text-[12px] font-bold ${tier.badgeClass}`}
                    >
                      {tier.threshold}
                    </span>
                  </div>

                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                    <div
                      className={`h-full rounded-full ${tier.barColor}`}
                      style={{ width: `${tier.width}%` }}
                    />
                  </div>

                  <p className="mt-3 font-mono text-[13px] font-semibold text-[#171717]">
                    {tier.count}
                  </p>
                </div>

                <p className="px-2 pt-3 pb-1 text-[12.5px] leading-relaxed text-[#525252]">
                  {tier.rule}
                </p>
              </div>
            ))}
          </div>

          {/* Règles de gouvernance des quotas et recharges */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <h3 className="text-[17px] font-semibold text-[#171717]">
              Politique d’application des quotas &amp; recharges automatiques
            </h3>
            <p className="mt-0.5 text-[13.5px] text-[#737373]">
              Règles appliquées côté serveur par le moteur de réservation de crédits AutoCall.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                <p className="text-[13.5px] font-semibold text-[#171717]">
                  1. Réservation avant effet payant
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#525252]">
                  Chaque appel ou enrichissement réserve les crédits nécessaires avant exécution, puis ajuste ou libère le solde réel à la fin.
                </p>
              </div>
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                <p className="text-[13.5px] font-semibold text-[#171717]">
                  2. Recharge automatique OFF par défaut
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#525252]">
                  Aucune recharge payante n’est déclenchée sans activation explicite par le propriétaire et définition d’un plafond mensuel.
                </p>
              </div>
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                <p className="text-[13.5px] font-semibold text-[#171717]">
                  3. Protection des appels entrants actifs
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#525252]">
                  Un appel déjà en cours n’est jamais coupé brutalement à 100 % ; les nouvelles campagnes sortantes sont mises en pause.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          06. SOUS-ONGLET ANOMALIES (Les 6 typologies d'anomalies + fiche de résolution)
         ===================================================================== */}
      {activeTab === "anomalies" && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="border-b border-[#EFEFEF] pb-4">
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Détection des anomalies &amp; incohérences de comptabilisation
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Surveillance continue des doubles débits, surconsommations, pics inhabituels, réservations bloquées, écarts fournisseurs et consommations non attribuées.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {anomalies.map((ano) => {
                const isSelected = selectedAnomalyId === ano.id;
                return (
                  <article
                    key={ano.id}
                    onClick={() =>
                      setSelectedAnomalyId((prev) => (prev === ano.id ? null : ano.id))
                    }
                    className={`flex flex-col justify-between rounded-2xl border p-5 transition cursor-pointer ${
                      isSelected
                        ? "border-[#171717] bg-[#F4F8F6]"
                        : "border-[#EFEFEF] bg-[#FAFAFA]/70 hover:border-[#D4D4D4] hover:bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[12.5px] font-bold text-[#171717]">
                            {ano.id}
                          </span>
                          <span
                            className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${
                              ano.severity === "Critique"
                                ? "bg-[#FCE7EB] text-[#B91C1C]"
                                : ano.severity === "Élevée"
                                  ? "bg-[#F0C869] text-[#5C3D00]"
                                  : "bg-[#E4EEFE] text-[#1D4ED8]"
                            }`}
                          >
                            {ano.severity}
                          </span>
                          <span className="text-[13.5px] font-semibold text-[#171717]">
                            {ano.category}
                          </span>
                        </div>

                        <span
                          className={`rounded-md px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
                            ano.status.startsWith("Corrigée")
                              ? "bg-[#DEF5EC] text-[#008064]"
                              : "bg-white text-[#171717] border border-[#E5E5E5]"
                          }`}
                        >
                          {ano.status}
                        </span>
                      </div>

                      <p className="mt-2 text-[13px] font-medium text-[#171717]">
                        {ano.exampleSummary} —{" "}
                        <span className="text-[#008F6D]">{ano.companyName}</span>
                      </p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-[#525252]">
                        {ano.technicalDetail}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#EFEFEF] pt-3 text-[12px]">
                      <span className="text-[#737373]">Détectée : {ano.detectedAt}</span>
                      <span className="font-mono font-semibold text-[#171717]">
                        Impact : {ano.impactDisplay}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Fiche détaillée de l'anomalie sélectionnée */}
          {selectedAnomaly && (
            <section className="rounded-2xl border border-[#171717] bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <span className="rounded-md bg-[#171717] px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-white">
                    Fiche d’anomalie {selectedAnomaly.id} · {selectedAnomaly.category}
                  </span>
                  <h4 className="mt-2 text-[18px] font-semibold text-[#171717]">
                    {selectedAnomaly.companyName} — {selectedAnomaly.exampleSummary}
                  </h4>
                  <p className="mt-1 text-[13.5px] text-[#525252]">
                    {selectedAnomaly.technicalDetail}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                  {!selectedAnomaly.status.startsWith("Corrigée") && (
                    <button
                      type="button"
                      onClick={() => handleResolveAnomalyWithCompensation(selectedAnomaly)}
                      className="h-10 rounded-xl bg-[#171717] px-4 text-[13px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
                    >
                      Émettre une compensation &amp; Résoudre
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelectTab("ledger")}
                    className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                  >
                    Vérifier dans le Registre →
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* =====================================================================
          MODALE : ÉCRITURE CORRECTIVE TRAÇABLE (Compensation / Ajustement)
         ===================================================================== */}
      {correctionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              Nouvelle écriture corrective au Registre
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              Conformément aux règles du registre, aucun mouvement passé n’est supprimé : la correction génère une nouvelle ligne d’audit traçable.
            </p>

            <div className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Entreprise concernée
                  </label>
                  <PremiumSelect
                    value={correctionCompany}
                    onChange={setCorrectionCompany}
                    ariaLabel="Entreprise concernée"
                    className="mt-1"
                    options={[
                      { value: "Nova Services", label: "Nova Services" },
                      { value: "Atlas Immobilier", label: "Atlas Immobilier" },
                      { value: "Clean Studio", label: "Clean Studio" },
                      { value: "Mondo Services", label: "Mondo Services" },
                      { value: "Studio Horizon", label: "Studio Horizon" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Nature de l’opération
                  </label>
                  <PremiumSelect
                    value={correctionType}
                    onChange={(v) => setCorrectionType(v as "Compensation" | "Ajustement")}
                    ariaLabel="Nature de l'opération"
                    className="mt-1"
                    options={[
                      { value: "Compensation", label: "Compensation (+ crédits)" },
                      { value: "Ajustement", label: "Ajustement (+/- régularisation)" },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Mouvement de minutes vocales (ex: +4 ou -4)
                </label>
                <input
                  type="text"
                  value={correctionDelta}
                  onChange={(e) => setCorrectionDelta(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[14px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Motif &amp; Référence d’anomalie / Ticket
                </label>
                <input
                  type="text"
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="Ex: Correction double débit webhook #CALL-8809 (ANO-401)"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Code MFA Super Admin (6 chiffres)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={correctionTotp}
                  onChange={(e) => setCorrectionTotp(e.target.value)}
                  placeholder="••••••"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[14px] tracking-widest text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              {correctionError && (
                <p className="rounded-lg bg-[#FCE7EB] px-3 py-2 text-[12.5px] font-medium text-[#B91C1C]">
                  {correctionError}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => setCorrectionModalOpen(false)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddCorrectiveEntry}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Inscrire au Registre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

