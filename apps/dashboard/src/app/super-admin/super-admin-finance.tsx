"use client";

import { useMemo, useState } from "react";
import {
  ElevenLabsBrandSvg,
  GeniusPayBrandSvg,
  OpenAIBrandSvg,
  StripeBrandSvg,
  TwilioBrandSvg,
} from "../brand-icons";
import { type Locale, SolarIcon } from "../workspace-navigation";
import { type SuperAdminSectionNavTarget } from "./super-admin-overview";

type PlanTier = "Starter" | "Pro" | "Business";
type ProfitabilityFilter = "all" | "profitable" | "deficit";

interface MonthlyEvolutionPoint {
  month: string;
  revenuesEur: number;
  directCostsEur: number;
  contributionEur: number;
}

const MONTHLY_EVOLUTION: MonthlyEvolutionPoint[] = [
  { month: "Juin", revenuesEur: 14200, directCostsEur: 5100, contributionEur: 9100 },
  { month: "Juil.", revenuesEur: 16400, directCostsEur: 5680, contributionEur: 10720 },
  { month: "Août", revenuesEur: 17900, directCostsEur: 6150, contributionEur: 11750 },
  { month: "Sept.", revenuesEur: 20100, directCostsEur: 6890, contributionEur: 13210 },
  { month: "Oct.", revenuesEur: 22100, directCostsEur: 7540, contributionEur: 14560 },
  { month: "Nov.", revenuesEur: 24850, directCostsEur: 8420, contributionEur: 16430 },
];

const MRR_WATERFALL = [
  { label: "MRR début de mois", amountEur: 22100, tone: "neutral" as const },
  { label: "Nouveaux abonnements (+New)", amountEur: 2480, tone: "positive" as const },
  { label: "Upgrades d’offres (+Expansion)", amountEur: 960, tone: "positive" as const },
  { label: "Downgrades (−Contraction)", amountEur: -190, tone: "negative" as const },
  { label: "Résiliations (−Churn)", amountEur: -500, tone: "negative" as const },
  { label: "MRR fin de mois", amountEur: 24850, tone: "total" as const },
];

interface CompanyProfitabilityRow {
  id: string;
  initials: string;
  name: string;
  plan: PlanTier;
  revenuesEur: number;
  directCostsEur: number;
  contributionEur: number;
  marginPct: number;
  costDriverNote: string;
}

const COMPANIES_PROFITABILITY: CompanyProfitabilityRow[] = [
  {
    id: "prof-nova",
    initials: "N",
    name: "Nova Services",
    plan: "Pro",
    revenuesEur: 99,
    directCostsEur: 24,
    contributionEur: 75,
    marginPct: 75.8,
    costDriverNote: "Utilisation équilibrée (appels entrants + CRM)",
  },
  {
    id: "prof-atlas",
    initials: "A",
    name: "Atlas Immobilier",
    plan: "Business",
    revenuesEur: 199,
    directCostsEur: 68,
    contributionEur: 131,
    marginPct: 65.8,
    costDriverNote: "6 agents vocaux actifs + synchronisation multi-agendas",
  },
  {
    id: "prof-clean",
    initials: "C",
    name: "Clean Studio",
    plan: "Starter",
    revenuesEur: 49,
    directCostsEur: 18,
    contributionEur: 31,
    marginPct: 63.3,
    costDriverNote: "Accueil téléphonique standard",
  },
  {
    id: "prof-mondo",
    initials: "M",
    name: "Mondo Services",
    plan: "Pro",
    revenuesEur: 99,
    directCostsEur: 112,
    contributionEur: -13,
    marginPct: -13.1,
    costDriverNote: "Ancienne révision v2026.1 + fort volume TTS ElevenLabs & appels mobiles",
  },
  {
    id: "prof-horizon",
    initials: "S",
    name: "Studio Horizon",
    plan: "Pro",
    revenuesEur: 99,
    directCostsEur: 42,
    contributionEur: 57,
    marginPct: 57.6,
    costDriverNote: "Campagnes sortantes + enrichissement Acquisition",
  },
];

const OFFERS_PROFITABILITY = [
  {
    plan: "Starter" as const,
    marginPct: 57.1,
    revenuesEur: 4900,
    directCostsEur: 2100,
    contributionEur: 2800,
    activeClients: 66,
    note: "Coût incompressible de numéro DID et d’accueil vocal sur petits forfaits.",
  },
  {
    plan: "Pro" as const,
    marginPct: 70.0,
    revenuesEur: 11900,
    directCostsEur: 3570,
    contributionEur: 8330,
    activeClients: 137,
    note: "Meilleure contribution unitaire grâce au mix appels / WhatsApp / CRM.",
  },
  {
    plan: "Business" as const,
    marginPct: 65.8,
    revenuesEur: 8050,
    directCostsEur: 2750,
    contributionEur: 5300,
    activeClients: 45,
    note: "Forte valeur absolue par compte (117 € de contribution moyenne / client).",
  },
];

const FEATURE_COSTS = [
  {
    id: "feat-voice",
    label: "Téléphonie et voix",
    sharePct: 52,
    amountEur: 4378,
    provider: "Twilio SIP + ElevenLabs TTS",
    optimizationNote: "Cache vocal des salutations récurrentes actif (−11 % de coût TTS).",
    color: "#171717",
  },
  {
    id: "feat-acq",
    label: "Acquisition",
    sharePct: 23,
    amountEur: 1937,
    provider: "API Recherche B2B & Signaux emploi",
    optimizationNote: "Déduplication SIREN/domaine inter-recherches en cache 14 jours.",
    color: "#008F6D",
  },
  {
    id: "feat-ai",
    label: "IA générative",
    sharePct: 12,
    amountEur: 1010,
    provider: "OpenAI (Qualification, Ask AutoCall, Social Studio)",
    optimizationNote: "Routage dynamique vers modèle léger pour le tri d’intentions.",
    color: "#1D4ED8",
  },
  {
    id: "feat-trans",
    label: "Transcription",
    sharePct: 8,
    amountEur: 674,
    provider: "STT temps réel & post-appel",
    optimizationNote: "Filtrage des silences et répondeurs avant transcription longue.",
    color: "#8760C4",
  },
  {
    id: "feat-other",
    label: "Autres",
    sharePct: 5,
    amountEur: 421,
    provider: "E-mails transactionnels, WhatsApp & génération d’images",
    optimizationNote: "Coût stable sous les seuils contractuels.",
    color: "#737373",
  },
];

interface ExpenseCategoryRow {
  id: string;
  category: string;
  examples: string;
  costType: "Variable" | "Fixe";
  verificationState: "Confirmé" | "Estimé";
  estimatedEur: number;
  confirmedEur: number | null;
}

const EXPENSE_CATEGORIES: ExpenseCategoryRow[] = [
  {
    id: "exp-1",
    category: "Téléphonie",
    examples: "Twilio, numéros DID, appels entrants/sortants, trunks SIP",
    costType: "Variable",
    verificationState: "Confirmé",
    estimatedEur: 1840,
    confirmedEur: 1812,
  },
  {
    id: "exp-2",
    category: "Intelligence artificielle",
    examples: "ElevenLabs TTS, modèles de langage OpenAI, STT",
    costType: "Variable",
    verificationState: "Confirmé",
    estimatedEur: 4220,
    confirmedEur: 4168,
  },
  {
    id: "exp-3",
    category: "Acquisition",
    examples: "API de recherche d’entreprises, contacts et signaux d’emploi",
    costType: "Variable",
    verificationState: "Confirmé",
    estimatedEur: 1937,
    confirmedEur: 1930,
  },
  {
    id: "exp-4",
    category: "Infrastructure",
    examples: "Hébergement serveurs, PostgreSQL (Neon UE), Redis / BullMQ",
    costType: "Fixe",
    verificationState: "Confirmé",
    estimatedEur: 340,
    confirmedEur: 340,
  },
  {
    id: "exp-5",
    category: "Stockage",
    examples: "Enregistrements audio S3 chiffrés, documents PDF et médias",
    costType: "Variable",
    verificationState: "Confirmé",
    estimatedEur: 145,
    confirmedEur: 142,
  },
  {
    id: "exp-6",
    category: "Paiements",
    examples: "Commissions des prestataires de paiement (Stripe, GeniusPay)",
    costType: "Variable",
    verificationState: "Confirmé",
    estimatedEur: 412,
    confirmedEur: 412,
  },
  {
    id: "exp-7",
    category: "Marketing",
    examples: "Publicités, acquisition commerciale et campagnes",
    costType: "Fixe",
    verificationState: "Estimé",
    estimatedEur: 1200,
    confirmedEur: null,
  },
  {
    id: "exp-8",
    category: "Opérations",
    examples: "Support client, logiciels internes, outillage équipe",
    costType: "Fixe",
    verificationState: "Confirmé",
    estimatedEur: 480,
    confirmedEur: 480,
  },
  {
    id: "exp-9",
    category: "Autres",
    examples: "Frais administratifs, comptabilité et conformité juridique",
    costType: "Fixe",
    verificationState: "Estimé",
    estimatedEur: 310,
    confirmedEur: null,
  },
];

function FlagFranceSvg() {
  return (
    <svg viewBox="0 0 24 16" className="h-4 w-6 shrink-0 rounded-[3px] ring-1 ring-black/10" aria-hidden="true">
      <rect width="8" height="16" fill="#1D4ED8" />
      <rect x="8" width="8" height="16" fill="#FFFFFF" />
      <rect x="16" width="8" height="16" fill="#DC2626" />
    </svg>
  );
}

function FlagCoteDIvoireSvg() {
  return (
    <svg viewBox="0 0 24 16" className="h-4 w-6 shrink-0 rounded-[3px] ring-1 ring-black/10" aria-hidden="true">
      <rect width="8" height="16" fill="#F97316" />
      <rect x="8" width="8" height="16" fill="#FFFFFF" />
      <rect x="16" width="8" height="16" fill="#16A34A" />
    </svg>
  );
}

export function SuperAdminFinance({
  activeTab,
  onNavigate,
}: {
  activeTab: string;
  locale: Locale;
  onSelectTab: (tabId: string) => void;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  // 02. Filtre Entreprises (Toutes / Rentables / Déficitaires)
  const [profitFilter, setProfitFilter] = useState<ProfitabilityFilter>("all");

  // 05. Filtre Dépenses (Toutes / Variables / Fixes)
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<"all" | "Variable" | "Fixe">("all");

  // 07. États du Simulateur financier interactif (valeurs par défaut : 100 clients, 99 €, 35 €, 500 €)
  const [simClients, setSimClients] = useState<number>(100);
  const [simArpuEur, setSimArpuEur] = useState<number>(99);
  const [simDirectCostEur, setSimDirectCostEur] = useState<number>(35);
  const [simFixedChargesEur, setSimFixedChargesEur] = useState<number>(500);
  const [simScenario, setSimScenario] = useState<"pessimistic" | "realistic" | "optimistic">(
    "realistic",
  );

  const filteredCompanies = useMemo(() => {
    return COMPANIES_PROFITABILITY.filter((c) => {
      if (profitFilter === "profitable" && c.contributionEur < 0) return false;
      if (profitFilter === "deficit" && c.contributionEur >= 0) return false;
      return true;
    });
  }, [profitFilter]);

  const filteredExpenses = useMemo(() => {
    return EXPENSE_CATEGORIES.filter((e) => {
      if (expenseTypeFilter !== "all" && e.costType !== expenseTypeFilter) return false;
      return true;
    });
  }, [expenseTypeFilter]);

  // Calculs du simulateur (07. Prévisions et simulations)
  const simulation = useMemo(() => {
    const monthlyRevenue = simClients * simArpuEur;
    const variableCosts = simClients * simDirectCostEur;
    const totalCharges = variableCosts + simFixedChargesEur;
    const monthlyResultBeforeTax = monthlyRevenue - totalCharges;
    const annualProjection = monthlyResultBeforeTax * 12;

    const unitContribution = simArpuEur - simDirectCostEur;
    const breakEvenClients =
      unitContribution > 0 ? Math.ceil(simFixedChargesEur / unitContribution) : null;

    const contributionMarginPct =
      monthlyRevenue > 0
        ? (((monthlyRevenue - variableCosts) / monthlyRevenue) * 100).toFixed(1)
        : "0.0";

    return {
      monthlyRevenue,
      variableCosts,
      totalCharges,
      monthlyResultBeforeTax,
      annualProjection,
      unitContribution,
      breakEvenClients,
      contributionMarginPct,
    };
  }, [simClients, simArpuEur, simDirectCostEur, simFixedChargesEur]);

  const applyScenarioPreset = (preset: "pessimistic" | "realistic" | "optimistic") => {
    setSimScenario(preset);
    if (preset === "pessimistic") {
      setSimArpuEur(79);
      setSimDirectCostEur(44);
      setSimFixedChargesEur(900);
    } else if (preset === "realistic") {
      setSimArpuEur(99);
      setSimDirectCostEur(35);
      setSimFixedChargesEur(500);
    } else {
      setSimArpuEur(124);
      setSimDirectCostEur(29);
      setSimFixedChargesEur(500);
    }
  };

  return (
    <div className="mt-7 space-y-7">
      {/* Bandeau de cadrage comptable & distinction Contribution vs Bénéfice net */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-2xs lg:flex-row lg:items-center">
        <div className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
          <span className="inline-flex size-2 shrink-0 rounded-full bg-[#008F6D]" />
          <span>
            <strong className="font-semibold text-[var(--foreground)]">
              05 · Finance :
            </strong>{" "}
            « Combien AutoCall gagne-t-il réellement après ses coûts ? » · La marge contributive mesure la contribution directe (≠ bénéfice net comptable).
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("billing", "subscriptions")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>03 · Facturation</span>
            <span className="text-[#737373]">→</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("consumption", "summary")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>04 · Consommations</span>
            <span className="text-[#737373]">→</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          01. SOUS-ONGLET REVENUS
         ===================================================================== */}
      {activeTab === "revenues" && (
        <div className="space-y-6">
          {/* 4 blocs de statistiques double surface style Dashboard Admin Client :
              MRR 24 850 € (+12,4 %) / ARR 298 200 € / Coûts directs 8 420 € / Marge contributive 66,1 % (16 430 €) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="card" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                    MRR (Ce mois)
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  24 850 €
                </p>
              </div>
              <p className="flex items-center justify-between px-2.5 pt-2.5 pb-1 text-[12.5px] font-semibold text-[#008F6D]">
                <span>↗ +12,4 % vs mois dern.</span>
                <span className="font-mono text-[#525252]">Hors recharges</span>
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="chart" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                    ARR
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  298 200 €
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[#525252]">
                Revenus annualisés (MRR × 12)
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                    Coûts directs
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  8 420 €
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[#525252]">
                Coûts mensuels fournisseurs (Voix, IA, Acq.)
              </p>
            </div>

            <div className="rounded-xl border border-[#008F6D]/30 bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[#E6F5F0]/60 px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#008F6D]/20 bg-white text-[#008F6D] shadow-2xs">
                    <SolarIcon name="chart" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-semibold leading-tight text-[#171717]">
                    Marge contributive
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[#008F6D] tabular-nums whitespace-nowrap">
                  66,1 %
                </p>
              </div>
              <p className="flex items-center justify-between px-2.5 pt-2.5 pb-1 text-[12.5px] font-semibold text-[#171717]">
                <span>Contribution : 16 430 €</span>
                <span className="font-mono text-[11.5px] text-[#737373]">≠ Bénéfice net</span>
              </p>
            </div>
          </div>

          {/* Graphique Évolution financière (Juin -> Nov.) + Waterfall du MRR */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Évolution financière (7 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#171717]">
                    Évolution financière (Juin – Nov.)
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#737373]">
                    Comparaison mensuelle entre Revenus, Coûts directs et Contribution.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium text-[#525252]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-[#171717]" />
                    Revenus
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-[#D4D4D4]" />
                    Coûts directs
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-[#008F6D]" />
                    Contribution
                  </span>
                </div>
              </div>

              {/* Graphique barres groupées (0 € / 7K € / 14K € / 21K € / 28K €) */}
              <div className="mt-6 flex gap-3">
                <div className="flex h-52 flex-col justify-between pb-6 text-right font-mono text-[11px] text-[#737373] tabular-nums whitespace-nowrap">
                  <span>28K €</span>
                  <span>21K €</span>
                  <span>14K €</span>
                  <span>7K €</span>
                  <span>0 €</span>
                </div>

                <div className="flex flex-1 items-end justify-between gap-3 border-b border-[#EFEFEF] pb-2">
                  {MONTHLY_EVOLUTION.map((pt) => {
                    const revH = Math.round((pt.revenuesEur / 28000) * 100);
                    const costH = Math.round((pt.directCostsEur / 28000) * 100);
                    const contribH = Math.round((pt.contributionEur / 28000) * 100);
                    return (
                      <div key={pt.month} className="flex flex-1 flex-col items-center gap-2">
                        <div className="flex h-44 w-full items-end justify-center gap-1">
                          <div
                            className="w-3 rounded-t bg-[#171717] sm:w-4"
                            style={{ height: `${revH}%` }}
                            title={`${pt.month} · Revenus : ${pt.revenuesEur.toLocaleString("fr-FR")} €`}
                          />
                          <div
                            className="w-3 rounded-t bg-[#D4D4D4] sm:w-4"
                            style={{ height: `${costH}%` }}
                            title={`${pt.month} · Coûts directs : ${pt.directCostsEur.toLocaleString("fr-FR")} €`}
                          />
                          <div
                            className="w-3 rounded-t bg-[#008F6D] sm:w-4"
                            style={{ height: `${contribH}%` }}
                            title={`${pt.month} · Contribution : ${pt.contributionEur.toLocaleString("fr-FR")} €`}
                          />
                        </div>
                        <span className="font-mono text-[11.5px] font-medium text-[#525252]">
                          {pt.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Waterfall du MRR (5 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
              <div className="border-b border-[#EFEFEF] pb-4">
                <h3 className="text-[16px] font-semibold text-[#171717]">
                  Waterfall du MRR (Ce mois)
                </h3>
                <p className="mt-0.5 text-[13px] text-[#737373]">
                  Décomposition de la variation nette (+2 750 €) du MRR.
                </p>
              </div>

              <div className="mt-4 space-y-2.5">
                {MRR_WATERFALL.map((row) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-[13px] ${
                      row.tone === "total"
                        ? "border-[#171717] bg-[#F4F8F6] font-semibold"
                        : "border-[#EFEFEF] bg-[#FAFAFA]"
                    }`}
                  >
                    <span className="text-[#171717]">{row.label}</span>
                    <span
                      className={`font-mono font-semibold tabular-nums whitespace-nowrap ${
                        row.tone === "positive"
                          ? "text-[#008064]"
                          : row.tone === "negative"
                            ? "text-[#E11D48]"
                            : "text-[#171717]"
                      }`}
                    >
                      {row.amountEur > 0 && row.tone === "positive"
                        ? `+${row.amountEur.toLocaleString("fr-FR")} €`
                        : row.amountEur < 0
                          ? `−${Math.abs(row.amountEur).toLocaleString("fr-FR")} €`
                          : `${row.amountEur.toLocaleString("fr-FR")} €`}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* =====================================================================
          02. SOUS-ONGLET ENTREPRISES (Rentabilité individuelle par client)
         ===================================================================== */}
      {activeTab === "companies" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-5 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Rentabilité par entreprise
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Contribution mensuelle par client : identifiez les comptes rentables et les comptes déficitaires dont les coûts fournisseurs dépassent le forfait.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1">
              {(
                [
                  { id: "all" as const, label: "Toutes" },
                  { id: "profitable" as const, label: "Rentables" },
                  { id: "deficit" as const, label: "Déficitaires" },
                ] as const
              ).map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setProfitFilter(pill.id)}
                  className={`h-8 rounded-lg px-3 text-[13px] font-medium whitespace-nowrap transition cursor-pointer ${
                    profitFilter === pill.id
                      ? "bg-[#171717] text-white shadow-2xs"
                      : "text-[#525252] hover:text-[#171717]"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto pb-1">
            <table className="w-full min-w-[820px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                  <th className="py-3 pr-4">Entreprise</th>
                  <th className="px-4 py-3 text-right">Revenus</th>
                  <th className="px-4 py-3 text-right">Coûts directs</th>
                  <th className="px-4 py-3 text-right">Contribution</th>
                  <th className="px-4 py-3 text-right">Marge</th>
                  <th className="py-3 pl-4">Facteur de coût principal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {filteredCompanies.map((comp) => {
                  const isDeficit = comp.contributionEur < 0;
                  return (
                    <tr
                      key={comp.id}
                      className={`transition ${
                        isDeficit ? "bg-[#FFF5F7]/60 hover:bg-[#FFF5F7]" : "hover:bg-[#FAFAFA]"
                      }`}
                    >
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] text-[13.5px] font-semibold text-[#171717]">
                            {comp.initials}
                          </span>
                          <div>
                            <p className="font-semibold text-[#171717]">{comp.name}</p>
                            <p className="text-[12px] text-[#737373]">Offre {comp.plan}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-mono font-medium text-[#171717] whitespace-nowrap tabular-nums">
                        {comp.revenuesEur} €
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-[#525252] whitespace-nowrap tabular-nums">
                        {comp.directCostsEur} €
                      </td>
                      <td className="px-4 py-4 text-right font-mono font-bold whitespace-nowrap tabular-nums">
                        <span className={isDeficit ? "text-[#E11D48]" : "text-[#008064]"}>
                          {comp.contributionEur < 0
                            ? `${comp.contributionEur} €`
                            : `${comp.contributionEur} €`}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[12px] font-semibold tabular-nums ${
                            isDeficit
                              ? "bg-[#FCE7EB] text-[#B91C1C]"
                              : "bg-[#DEF5EC] text-[#008064]"
                          }`}
                        >
                          {comp.marginPct.toFixed(1)} %
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-[12.5px] text-[#525252]">
                        {comp.costDriverNote}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          03. SOUS-ONGLET OFFRES ET MARCHÉS
         ===================================================================== */}
      {activeTab === "offers-markets" && (
        <div className="space-y-6">
          {/* Rentabilité par offre : Starter (57.1%) / Pro (70.0%) / Business (65.8%) */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {OFFERS_PROFITABILITY.map((off) => (
              <article
                key={off.plan}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs"
              >
                <div className="rounded-xl bg-[var(--surface-inset)] p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[18px] font-semibold text-[#171717]">
                      Offre {off.plan}
                    </h4>
                    <span className="rounded-md bg-[#DEF5EC] px-2.5 py-0.5 font-mono text-[13px] font-bold text-[#008064]">
                      {off.marginPct.toFixed(1)} %
                    </span>
                  </div>

                  {/* Barre de répartition Contribution vs Coûts directs */}
                  <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                    <div
                      className="h-full rounded-full bg-[#008F6D]"
                      style={{ width: `${off.marginPct}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11.5px] text-[#737373]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#008F6D]" />
                      Contribution ({off.contributionEur.toLocaleString("fr-FR")} €)
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#D4D4D4]" />
                      Coûts directs
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-2 px-2 pb-1 text-[13px]">
                  <div className="flex items-center justify-between rounded-xl border border-[#EFEFEF] bg-white px-3.5 py-2.5">
                    <span className="text-[#525252]">Revenus mensuels</span>
                    <span className="font-mono font-semibold text-[#171717]">
                      {off.revenuesEur.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#EFEFEF] bg-white px-3.5 py-2.5">
                    <span className="text-[#525252]">Coûts directs</span>
                    <span className="font-mono font-semibold text-[#525252]">
                      {off.directCostsEur.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                  <p className="pt-1 text-[12px] leading-relaxed text-[#737373]">
                    {off.note}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Performance par marché : France & Côte d'Ivoire (drapeaux SVG purs) */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#EFEFEF] pb-4">
                <div className="flex items-center gap-3">
                  <FlagFranceSvg />
                  <div>
                    <h4 className="text-[16px] font-semibold text-[#171717]">
                      France
                    </h4>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-[#737373]">
                      <span>Marché de lancement · Facturation EUR</span>
                      <StripeBrandSvg className="size-4 rounded-[4px]" />
                    </p>
                  </div>
                </div>
                <span className="rounded-md bg-[#DEF5EC] px-2.5 py-1 font-mono text-[12px] font-semibold text-[#008064]">
                  Marge 66,8 %
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-[13px]">
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                  <span className="block text-[11.5px] text-[#737373]">Revenus (EUR)</span>
                  <span className="mt-1 block font-mono text-[16px] font-bold text-[#171717]">
                    23 410 €
                  </span>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                  <span className="block text-[11.5px] text-[#737373]">Coûts locaux</span>
                  <span className="mt-1 block font-mono text-[16px] font-semibold text-[#525252]">
                    7 770 €
                  </span>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                  <span className="block text-[11.5px] text-[#737373]">Contribution</span>
                  <span className="mt-1 block font-mono text-[16px] font-bold text-[#008F6D]">
                    15 640 €
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#EFEFEF] pb-4">
                <div className="flex items-center gap-3">
                  <FlagCoteDIvoireSvg />
                  <div>
                    <h4 className="text-[16px] font-semibold text-[#171717]">
                      Côte d’Ivoire
                    </h4>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-[#737373]">
                      <span>Marché d’expansion prévu · Facturation XOF</span>
                      <GeniusPayBrandSvg className="h-4 w-auto" />
                    </p>
                  </div>
                </div>
                <span className="rounded-md bg-[#E4EEFE] px-2.5 py-1 font-mono text-[12px] font-semibold text-[#1D4ED8]">
                  Marge 54,9 %
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-[13px]">
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                  <span className="block text-[11.5px] text-[#737373]">Revenus (XOF / EUR)</span>
                  <span className="mt-1 block font-mono text-[16px] font-bold text-[#171717]">
                    1 440 €
                  </span>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                  <span className="block text-[11.5px] text-[#737373]">Coûts télécoms CI</span>
                  <span className="mt-1 block font-mono text-[16px] font-semibold text-[#525252]">
                    650 €
                  </span>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                  <span className="block text-[11.5px] text-[#737373]">Contribution</span>
                  <span className="mt-1 block font-mono text-[16px] font-bold text-[#008F6D]">
                    790 €
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* =====================================================================
          04. SOUS-ONGLET FONCTIONNALITÉS (8 420 € : 52% / 23% / 12% / 8% / 5%)
         ===================================================================== */}
      {activeTab === "features" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Coûts par fonctionnalité
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Exemple de répartition mensuelle des coûts directs (8 420 €) pour identifier les leviers d’optimisation technique ou de barème de crédits.
              </p>
            </div>
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2 text-right font-mono">
              <span className="block text-[11px] text-[#737373]">Total coûts directs</span>
              <span className="text-[18px] font-bold text-[#171717]">8 420 €</span>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {FEATURE_COSTS.map((feat) => (
              <div
                key={feat.id}
                className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[15px] font-semibold text-[#171717]">
                      {feat.label}
                    </span>
                    <span className="ml-2.5 text-[12.5px] text-[#737373]">
                      · {feat.provider}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[14px] font-semibold text-[#171717]">
                      {feat.amountEur.toLocaleString("fr-FR")} €
                    </span>
                    <span className="rounded-md bg-white px-2.5 py-0.5 text-[12.5px] font-bold text-[#171717] shadow-2xs">
                      {feat.sharePct} %
                    </span>
                  </div>
                </div>

                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${feat.sharePct}%`,
                      backgroundColor: feat.color,
                    }}
                  />
                </div>

                <p className="mt-2.5 text-[12.5px] text-[#525252]">
                  <strong className="font-medium text-[#171717]">Piste d’optimisation :</strong>{" "}
                  {feat.optimizationNote}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          05. SOUS-ONGLET DÉPENSES (Les 9 catégories officielles : Fixes vs Variables, Estimés vs Confirmés)
         ===================================================================== */}
      {activeTab === "expenses" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-5 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Dépenses &amp; Charges opérationnelles
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Centralisation des 9 postes de charges avec distinction entre coûts variables, coûts fixes, montants estimés et montants confirmés.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1">
              {(
                [
                  { id: "all" as const, label: "Toutes (9)" },
                  { id: "Variable" as const, label: "Coûts variables" },
                  { id: "Fixe" as const, label: "Coûts fixes" },
                ] as const
              ).map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setExpenseTypeFilter(pill.id)}
                  className={`h-8 rounded-lg px-3 text-[13px] font-medium whitespace-nowrap transition cursor-pointer ${
                    expenseTypeFilter === pill.id
                      ? "bg-[#171717] text-white shadow-2xs"
                      : "text-[#525252] hover:text-[#171717]"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto pb-1">
            <table className="w-full min-w-[820px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                  <th className="py-3 pr-4">Catégorie</th>
                  <th className="px-4 py-3">Exemples &amp; Fournisseurs</th>
                  <th className="px-4 py-3">Nature</th>
                  <th className="px-4 py-3 text-right">Coût estimé</th>
                  <th className="px-4 py-3 text-right">Coût confirmé</th>
                  <th className="py-3 pl-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="transition hover:bg-[#FAFAFA]">
                    <td className="py-4 pr-4 font-semibold text-[#171717] whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {exp.category === "Téléphonie" && <TwilioBrandSvg className="size-4" />}
                        {exp.category === "Intelligence artificielle" && (
                          <ElevenLabsBrandSvg className="size-3.5" />
                        )}
                        {exp.category === "Paiements" && (
                          <StripeBrandSvg className="size-4 rounded-[3px]" />
                        )}
                        {exp.category === "Acquisition" && <OpenAIBrandSvg className="size-4" />}
                        <span>{exp.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#525252]">
                      {exp.examples}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                          exp.costType === "Variable"
                            ? "bg-[#E4EEFE] text-[#1D4ED8]"
                            : "bg-[#EFEFEF] text-[#525252]"
                        }`}
                      >
                        {exp.costType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-[#525252] whitespace-nowrap tabular-nums">
                      {exp.estimatedEur.toLocaleString("fr-FR")} €
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-semibold text-[#171717] whitespace-nowrap tabular-nums">
                      {exp.confirmedEur !== null
                        ? `${exp.confirmedEur.toLocaleString("fr-FR")} €`
                        : "—"}
                    </td>
                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                          exp.verificationState === "Confirmé"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : "bg-[#F0C869] text-[#5C3D00]"
                        }`}
                      >
                        {exp.verificationState}
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
          06. SOUS-ONGLET ACQUISITION ET RÉTENTION (CAC 85€ / LTV 1 240€ / LTV/CAC 14,6x / Churn 3,2% / NRR 108% / GRR 94%)
         ===================================================================== */}
      {activeTab === "retention" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "CAC",
                value: "85 €",
                desc: "Coût d’acquisition d’un client.",
                sub: "Dépenses marketing & ventes / nouveaux clients",
                icon: "acquisition" as const,
                accent: "text-[#171717]",
              },
              {
                label: "LTV",
                value: "1 240 €",
                desc: "Valeur contributive estimée sur la durée de vie du client.",
                sub: "Calculée sur la marge contributive (et non le CA brut)",
                icon: "card" as const,
                accent: "text-[#008F6D]",
              },
              {
                label: "LTV / CAC",
                value: "14,6×",
                desc: "Rapport entre valeur client et coût d’acquisition.",
                sub: "Cible SaaS B2B saine > 3,0×",
                icon: "chart" as const,
                accent: "text-[#008F6D]",
              },
              {
                label: "Churn",
                value: "3,2 %",
                desc: "Taux mensuel de perte de clients.",
                sub: "5 résiliations sur 216 abonnements actifs",
                icon: "bolt" as const,
                accent: "text-[#E11D48]",
              },
              {
                label: "NRR (Net Revenue Retention)",
                value: "108 %",
                desc: "Rétention des revenus avec expansion.",
                sub: "Inclut les upgrades vers Pro / Business",
                icon: "chart" as const,
                accent: "text-[#008F6D]",
              },
              {
                label: "GRR (Gross Revenue Retention)",
                value: "94 %",
                desc: "Rétention des revenus sans expansion.",
                sub: "Plafonnée à 100 % · Mesure la fidélité pure",
                icon: "crm" as const,
                accent: "text-[#171717]",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs"
              >
                <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                      <SolarIcon name={kpi.icon} className="size-4.5" />
                    </span>
                    <p className="text-[14px] font-semibold text-[#171717]">
                      {kpi.label}
                    </p>
                  </div>
                  <p
                    className={`mt-3 text-[29px] font-semibold leading-tight tracking-[-0.03em] tabular-nums whitespace-nowrap ${kpi.accent}`}
                  >
                    {kpi.value}
                  </p>
                  <p className="mt-1 text-[13px] text-[#525252]">{kpi.desc}</p>
                </div>
                <p className="px-3 pt-2.5 pb-1 text-[12px] text-[#737373]">
                  {kpi.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          07. SOUS-ONGLET PRÉVISIONS ET SIMULATIONS (Simulateur financier interactif)
         ===================================================================== */}
      {activeTab === "forecast" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Colonne gauche (7 col) : Contrôles du simulateur */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Simulateur financier
                </h3>
                <p className="mt-0.5 text-[13.5px] text-[#737373]">
                  Projection mensuelle simplifiée — modifiez vos hypothèses ou testez 100, 1 000 ou 10 000 clients.
                </p>
              </div>

              {/* Scénarios Pessimiste / Réaliste / Optimiste */}
              <div className="inline-flex rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1">
                {(
                  [
                    { id: "pessimistic" as const, label: "Pessimiste" },
                    { id: "realistic" as const, label: "Réaliste" },
                    { id: "optimistic" as const, label: "Optimiste" },
                  ] as const
                ).map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => applyScenarioPreset(sc.id)}
                    className={`h-7 rounded-lg px-2.5 text-[12px] font-medium transition cursor-pointer ${
                      simScenario === sc.id
                        ? "bg-[#171717] text-white shadow-2xs"
                        : "text-[#525252] hover:text-[#171717]"
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-5">
              {/* 1. Nombre d'entreprises clientes + paliers rapides 100 / 500 / 1 000 / 5 000 / 10 000 */}
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                <div className="flex items-center justify-between">
                  <label className="text-[13.5px] font-semibold text-[#171717]">
                    Nombre d’entreprises clientes
                  </label>
                  <span className="font-mono text-[18px] font-bold text-[#171717] tabular-nums">
                    {simClients.toLocaleString("fr-FR")}
                  </span>
                </div>

                <input
                  type="range"
                  min={10}
                  max={10000}
                  step={10}
                  value={simClients}
                  onChange={(e) => setSimClients(Number(e.target.value))}
                  className="mt-3 w-full accent-[#171717] cursor-pointer"
                />

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {[100, 500, 1000, 5000, 10000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSimClients(preset)}
                      className={`h-7 rounded-lg border px-2.5 font-mono text-[12px] font-medium transition cursor-pointer ${
                        simClients === preset
                          ? "border-[#171717] bg-[#171717] text-white"
                          : "border-[#E5E5E5] bg-white text-[#525252] hover:text-[#171717]"
                      }`}
                    >
                      {preset.toLocaleString("fr-FR")}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Revenu mensuel moyen, Coût direct moyen, Autres charges mensuelles */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Revenu mensuel moyen / client (€)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={simArpuEur}
                    onChange={(e) => setSimArpuEur(Math.max(0, Number(e.target.value)))}
                    className="mt-1.5 h-10 w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 font-mono text-[14px] font-semibold text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Coût direct moyen / client (€)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={simDirectCostEur}
                    onChange={(e) => setSimDirectCostEur(Math.max(0, Number(e.target.value)))}
                    className="mt-1.5 h-10 w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 font-mono text-[14px] font-semibold text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Autres charges mensuelles (€)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={simFixedChargesEur}
                    onChange={(e) => setSimFixedChargesEur(Math.max(0, Number(e.target.value)))}
                    className="mt-1.5 h-10 w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 font-mono text-[14px] font-semibold text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Colonne droite (5 col) : Résultats simulés en direct */}
          <section className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Résultats de la simulation
              </h3>
              <p className="mt-0.5 text-[13px] text-[#737373]">
                Calcul instantané pour {simClients.toLocaleString("fr-FR")} entreprises clientes.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] px-4 py-3">
                  <span className="text-[13.5px] text-[#525252]">Revenus mensuels</span>
                  <span className="font-mono text-[16px] font-bold text-[#171717] tabular-nums">
                    {simulation.monthlyRevenue.toLocaleString("fr-FR")} €
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] px-4 py-3">
                  <span className="text-[13.5px] text-[#525252]">Charges totales simulées</span>
                  <span className="font-mono text-[16px] font-semibold text-[#525252] tabular-nums">
                    {simulation.totalCharges.toLocaleString("fr-FR")} €
                  </span>
                </div>

                <div className="rounded-xl border border-[#008F6D]/30 bg-[#E6F5F0]/60 p-4">
                  <span className="block text-[12.5px] font-medium text-[#171717]">
                    Résultat mensuel simulé avant impôts
                  </span>
                  <span
                    className={`mt-1 block font-mono text-[28px] font-bold tracking-tight tabular-nums ${
                      simulation.monthlyResultBeforeTax >= 0
                        ? "text-[#008F6D]"
                        : "text-[#E11D48]"
                    }`}
                  >
                    {simulation.monthlyResultBeforeTax.toLocaleString("fr-FR")} €
                  </span>
                  <p className="mt-1 font-mono text-[12.5px] text-[#171717]">
                    Projection annuelle à activité constante :{" "}
                    <strong>{simulation.annualProjection.toLocaleString("fr-FR")} €</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl border border-[#EFEFEF] bg-white p-3.5">
                    <span className="block text-[11.5px] text-[#737373]">
                      Seuil de rentabilité mensuel
                    </span>
                    <span className="mt-1 block font-mono text-[16px] font-bold text-[#171717]">
                      {simulation.breakEvenClients !== null
                        ? `${simulation.breakEvenClients} clients`
                        : "Inatteignable"}
                    </span>
                  </div>
                  <div className="rounded-xl border border-[#EFEFEF] bg-white p-3.5">
                    <span className="block text-[11.5px] text-[#737373]">
                      Marge contributive
                    </span>
                    <span className="mt-1 block font-mono text-[16px] font-bold text-[#008064]">
                      {simulation.contributionMarginPct} %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 border-t border-[#EFEFEF] pt-3 text-[12px] leading-relaxed text-[#737373]">
              Simulateur fonctionnel avec hypothèses modifiables. Ce résultat n’est pas un bénéfice net comptable et suppose des coûts unitaires constants.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

