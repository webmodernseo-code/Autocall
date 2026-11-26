"use client";

import { useMemo, useState } from "react";
import {
  ElevenLabsBrandSvg,
  OpenAIBrandSvg,
  StripeBrandSvg,
  TwilioBrandSvg,
  WhatsAppBusinessBrandSvg,
} from "../brand-icons";
import { type Locale, SolarIcon } from "../workspace-navigation";

export type SuperAdminSectionNavTarget =
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

type PeriodId = "today" | "7d" | "30d";
type ProviderId = "twilio" | "elevenlabs" | "openai" | "stripe" | "whatsapp";

interface TenantSnapshot {
  id: string;
  name: string;
  market: "FR" | "CI";
  plan: "Starter" | "Pro" | "Business";
  status: "active" | "trial" | "warning" | "suspended";
  users: number;
  activeAgents: number;
  mrrEur: number;
  cashCollectedEur: number;
  recognizedRevenueEur: number;
  estimatedProviderCostEur: number;
  realInvoicedCostEur: number;
  callsToday: number;
  failedCallsToday: number;
  quotaUsedPct: number;
}

const PLATFORM_TENANTS: TenantSnapshot[] = [
  {
    id: "ten-01",
    name: "Lyon Propreté & Services",
    market: "FR",
    plan: "Business",
    status: "active",
    users: 14,
    activeAgents: 5,
    mrrEur: 179,
    cashCollectedEur: 2040,
    recognizedRevenueEur: 228,
    estimatedProviderCostEur: 49.4,
    realInvoicedCostEur: 47.8,
    callsToday: 312,
    failedCallsToday: 2,
    quotaUsedPct: 74,
  },
  {
    id: "ten-02",
    name: "Groupe Finaxis Conseil",
    market: "FR",
    plan: "Pro",
    status: "active",
    users: 8,
    activeAgents: 3,
    mrrEur: 99,
    cashCollectedEur: 157,
    recognizedRevenueEur: 157,
    estimatedProviderCostEur: 31.2,
    realInvoicedCostEur: 30.5,
    callsToday: 194,
    failedCallsToday: 1,
    quotaUsedPct: 68,
  },
  {
    id: "ten-03",
    name: "Immobilier Nexa Paris",
    market: "FR",
    plan: "Business",
    status: "warning",
    users: 19,
    activeAgents: 6,
    mrrEur: 179,
    cashCollectedEur: 266,
    recognizedRevenueEur: 266,
    estimatedProviderCostEur: 88.6,
    realInvoicedCostEur: 91.2,
    callsToday: 428,
    failedCallsToday: 14,
    quotaUsedPct: 96,
  },
  {
    id: "ten-04",
    name: "Bâtiment & Maintenance Sud",
    market: "FR",
    plan: "Pro",
    status: "active",
    users: 6,
    activeAgents: 2,
    mrrEur: 99,
    cashCollectedEur: 99,
    recognizedRevenueEur: 99,
    estimatedProviderCostEur: 22.8,
    realInvoicedCostEur: 21.9,
    callsToday: 146,
    failedCallsToday: 1,
    quotaUsedPct: 54,
  },
  {
    id: "ten-05",
    name: "AutoClean Abidjan",
    market: "CI",
    plan: "Pro",
    status: "trial",
    users: 5,
    activeAgents: 2,
    mrrEur: 46,
    cashCollectedEur: 46,
    recognizedRevenueEur: 46,
    estimatedProviderCostEur: 14.5,
    realInvoicedCostEur: 14.1,
    callsToday: 89,
    failedCallsToday: 4,
    quotaUsedPct: 61,
  },
  {
    id: "ten-06",
    name: "Clinique Dentaire Bellecour",
    market: "FR",
    plan: "Starter",
    status: "active",
    users: 3,
    activeAgents: 1,
    mrrEur: 49,
    cashCollectedEur: 49,
    recognizedRevenueEur: 49,
    estimatedProviderCostEur: 9.2,
    realInvoicedCostEur: 8.9,
    callsToday: 64,
    failedCallsToday: 0,
    quotaUsedPct: 42,
  },
  {
    id: "ten-07",
    name: "Cabinet Médical Saint-Germain",
    market: "FR",
    plan: "Pro",
    status: "active",
    users: 7,
    activeAgents: 2,
    mrrEur: 99,
    cashCollectedEur: 99,
    recognizedRevenueEur: 99,
    estimatedProviderCostEur: 21.0,
    realInvoicedCostEur: 20.4,
    callsToday: 118,
    failedCallsToday: 0,
    quotaUsedPct: 49,
  },
  {
    id: "ten-08",
    name: "Logistique Express Rhône",
    market: "FR",
    plan: "Business",
    status: "active",
    users: 12,
    activeAgents: 4,
    mrrEur: 179,
    cashCollectedEur: 179,
    recognizedRevenueEur: 179,
    estimatedProviderCostEur: 44.0,
    realInvoicedCostEur: 43.2,
    callsToday: 264,
    failedCallsToday: 1,
    quotaUsedPct: 81,
  },
];

interface ProviderHealthRow {
  id: ProviderId;
  name: string;
  role: string;
  status: "operational" | "degraded" | "outage";
  latencyMs: number;
  errorRatePct: number;
  estimatedCostEur: number;
  reconciledCostEur: number;
  lastReconciledAt: string;
  targetSection: SuperAdminSectionNavTarget;
  targetTab: string;
}

const PROVIDERS_SNAPSHOT: ProviderHealthRow[] = [
  {
    id: "twilio",
    name: "Twilio Voice & SIP EU",
    role: "Téléphonie & Trunks SIP (Dublin / Francfort)",
    status: "degraded",
    latencyMs: 184,
    errorRatePct: 1.8,
    estimatedCostEur: 1840,
    reconciledCostEur: 1812,
    lastReconciledAt: "Il y a 14 min",
    targetSection: "providers",
    targetTab: "pricing",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs Turbo v2.5",
    role: "Synthèse vocale temps réel (TTS)",
    status: "operational",
    latencyMs: 210,
    errorRatePct: 0.2,
    estimatedCostEur: 2690,
    reconciledCostEur: 2645,
    lastReconciledAt: "Il y a 8 min",
    targetSection: "providers",
    targetTab: "connections",
  },
  {
    id: "openai",
    name: "OpenAI GPT-4o / STT",
    role: "Orchestration LLM, qualification & résumés",
    status: "operational",
    latencyMs: 318,
    errorRatePct: 0.3,
    estimatedCostEur: 1920,
    reconciledCostEur: 1905,
    lastReconciledAt: "Il y a 6 min",
    targetSection: "ai-governance",
    targetTab: "official-models",
  },
  {
    id: "stripe",
    name: "Stripe Billing & Webhooks",
    role: "Encaissements SEPA / CB & facturation",
    status: "operational",
    latencyMs: 92,
    errorRatePct: 0.0,
    estimatedCostEur: 412,
    reconciledCostEur: 412,
    lastReconciledAt: "Temps réel",
    targetSection: "billing",
    targetTab: "transactions",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    role: "Messages transactionnels & relances",
    status: "operational",
    latencyMs: 145,
    errorRatePct: 0.4,
    estimatedCostEur: 380,
    reconciledCostEur: 374,
    lastReconciledAt: "Il y a 22 min",
    targetSection: "providers",
    targetTab: "connections",
  },
];

// Un seul logo par fournisseur (zéro doublon icône + wordmark)
function ProviderLogoBadge({ id }: { id: ProviderId }) {
  switch (id) {
    case "twilio":
      return (
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-2 shadow-2xs">
          <TwilioBrandSvg className="size-full" />
        </span>
      );
    case "elevenlabs":
      return (
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-2.5 shadow-2xs">
          <ElevenLabsBrandSvg className="size-full" />
        </span>
      );
    case "openai":
      return (
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-2 text-[#171717] shadow-2xs">
          <OpenAIBrandSvg className="size-full" />
        </span>
      );
    case "stripe":
      return (
        <span className="inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-2xs">
          <StripeBrandSvg className="size-full rounded-lg" />
        </span>
      );
    case "whatsapp":
      return (
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-2xs">
          <WhatsAppBusinessBrandSvg className="size-full" />
        </span>
      );
  }
}

export function SuperAdminOverview({
  activeTab,
  locale,
  onNavigate,
}: {
  activeTab: string;
  locale: Locale;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  const [period, setPeriod] = useState<PeriodId>("30d");

  const metrics = useMemo(() => {
    const scale = period === "today" ? 1 : period === "7d" ? 7 : 22;
    const totalCompanies = 148;
    const activeCompanies = 134;
    const trialCompanies = 11;
    const suspendedCompanies = 3;
    const totalUsers = 642;

    const sampleMrr = PLATFORM_TENANTS.reduce((sum, t) => sum + t.mrrEur, 0);
    const sampleCash = PLATFORM_TENANTS.reduce((sum, t) => sum + t.cashCollectedEur, 0);
    const sampleRecognized = PLATFORM_TENANTS.reduce((sum, t) => sum + t.recognizedRevenueEur, 0);

    const mrrEur = Math.round(sampleMrr * 16);
    const cashCollectedEur = Math.round(sampleCash * (period === "today" ? 0.35 : period === "7d" ? 2.1 : 6.4));
    const recognizedRevenueEur = Math.round(sampleRecognized * (period === "today" ? 0.65 : period === "7d" ? 4.4 : 14.5));

    const estimatedCostEur = PROVIDERS_SNAPSHOT.reduce((sum, p) => sum + p.estimatedCostEur, 0);
    const realReconciledCostEur = PROVIDERS_SNAPSHOT.reduce((sum, p) => sum + p.reconciledCostEur, 0);
    const costDriftEur = estimatedCostEur - realReconciledCostEur;

    const grossContributionEur = recognizedRevenueEur - realReconciledCostEur;
    const contributionRatePct = ((grossContributionEur / Math.max(recognizedRevenueEur, 1)) * 100).toFixed(1);

    const callsToday = PLATFORM_TENANTS.reduce((sum, t) => sum + t.callsToday, 0) * (period === "today" ? 3 : scale);
    const failedCallsToday = PLATFORM_TENANTS.reduce((sum, t) => sum + t.failedCallsToday, 0) * (period === "today" ? 2 : Math.round(scale * 0.6));
    const failureRatePct = ((failedCallsToday / Math.max(callsToday, 1)) * 100).toFixed(2);

    return {
      totalCompanies,
      activeCompanies,
      trialCompanies,
      suspendedCompanies,
      totalUsers,
      mrrEur,
      arrEur: mrrEur * 12,
      cashCollectedEur,
      recognizedRevenueEur,
      deferredRevenueEur: Math.max(cashCollectedEur - recognizedRevenueEur, 0),
      estimatedCostEur,
      realReconciledCostEur,
      costDriftEur,
      grossContributionEur,
      contributionRatePct,
      callsToday,
      failedCallsToday,
      failureRatePct,
    };
  }, [period]);

  const formatEur = (val: number) => `${val.toLocaleString("fr-FR")}\u00A0€`;

  return (
    <div className="mt-7 space-y-7">
      {/* Barre supérieure de filtre de période + rail horizontal scrollable des adaptateurs (1 seul logo par badge) */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-2xs lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
          <div className="flex shrink-0 items-center gap-2 text-[13.5px] text-[var(--text-secondary)]">
            <span className="inline-flex size-2 shrink-0 rounded-full bg-[#008F6D]" />
            <strong className="font-semibold text-[var(--foreground)] whitespace-nowrap">
              Adaptateurs actifs :
            </strong>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <span className="inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-3 text-[12.5px] font-medium text-[#171717] whitespace-nowrap">
              <TwilioBrandSvg className="size-4 shrink-0" />
              <span>Twilio SIP</span>
            </span>
            <span className="inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-3 text-[12.5px] font-medium text-[#171717] whitespace-nowrap">
              <ElevenLabsBrandSvg className="size-3.5 shrink-0" />
              <span>ElevenLabs</span>
            </span>
            <span className="inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-3 text-[12.5px] font-medium text-[#171717] whitespace-nowrap">
              <OpenAIBrandSvg className="size-4 shrink-0" />
              <span>OpenAI</span>
            </span>
            <span className="inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-3 text-[12.5px] font-medium text-[#171717] whitespace-nowrap">
              <StripeBrandSvg className="size-4 shrink-0 rounded-[4px]" />
              <span>Stripe</span>
            </span>
            <span className="inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-3 text-[12.5px] font-medium text-[#171717] whitespace-nowrap">
              <WhatsAppBusinessBrandSvg className="size-4 shrink-0" />
              <span>WhatsApp Business</span>
            </span>
          </div>
        </div>

        {/* Sélecteur de période */}
        <div className="inline-flex shrink-0 self-start rounded-[8px] border border-[var(--border)] bg-[var(--surface-inset)] p-0.5 lg:self-auto">
          {(
            [
              { id: "today" as const, label: locale === "en" ? "Today" : "Aujourd’hui" },
              { id: "7d" as const, label: "7 j" },
              { id: "30d" as const, label: "30 j" },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`h-[34px] rounded-[6px] px-3 text-[13.5px] font-medium whitespace-nowrap transition cursor-pointer ${period === p.id
                ? "bg-[#171717] text-white"
                : "text-[#525252] hover:text-[#171717]"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          VUE 1 : SYNTHÈSE ("Que se passe-t-il aujourd’hui ?")
         ===================================================================== */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          {/* 4 blocs de stat double surface style Dashboard Admin Client */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stat 1 : Entreprises */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="crm" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                    Entreprises clientes
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  {metrics.totalCompanies}
                </p>
                <p className="mt-1 text-[12.5px] text-[var(--text-muted)] tabular-nums">
                  {metrics.activeCompanies} actives · {metrics.trialCompanies} essais · {metrics.suspendedCompanies} susp.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("tenants", "companies")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[13px] font-medium text-[#008F6D] hover:underline cursor-pointer"
              >
                <span>↗ Ouvrir Entreprises (Fiche 360)</span>
                <span>→</span>
              </button>
            </div>

            {/* Stat 2 : Utilisateurs & Agents IA */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="agents" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                    Utilisateurs &amp; Agents
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  {metrics.totalUsers}
                </p>
                <p className="mt-1 text-[12.5px] text-[var(--text-muted)] tabular-nums">
                  312 agents vocaux actifs · 98 % MFA
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("adoption", "onboarding")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[13px] font-medium text-[#008F6D] hover:underline cursor-pointer"
              >
                <span>↗ Suivre l’adoption &amp; onboarding</span>
                <span>→</span>
              </button>
            </div>

            {/* Stat 3 : Activité Appels */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="phone" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                    Appels traités
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  {metrics.callsToday.toLocaleString("fr-FR")}
                </p>
                <p className="mt-1 text-[12.5px] font-medium text-[#E11D48] tabular-nums">
                  {metrics.failedCallsToday} échecs ({metrics.failureRatePct} %) à inspecter
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("overview", "health")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[13px] font-medium text-[#008F6D] hover:underline cursor-pointer"
              >
                <span>↗ Inspecter la vue Santé</span>
                <span>→</span>
              </button>
            </div>

            {/* Stat 4 : MRR contractuel HT */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="card" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                    MRR contractuel HT
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  {formatEur(metrics.mrrEur)}
                </p>
                <p className="mt-1 text-[12.5px] text-[var(--text-muted)] tabular-nums">
                  Contribution : {formatEur(metrics.grossContributionEur)} ({metrics.contributionRatePct} %)
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("overview", "economy")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[13px] font-medium text-[#008F6D] hover:underline cursor-pointer"
              >
                <span>↗ Détail dans la vue Économie</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Zone principale avec coulissement vertical confortable */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Colonne gauche (7 col) : Points à examiner aujourd'hui */}
            <section className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#171717]">
                    Points à examiner aujourd’hui
                  </h3>
                  <p className="mt-1 text-[13.5px] text-[#737373]">
                    Anomalies détectées nécessitant une vérification dans les modules dédiés.
                  </p>
                </div>
                <span className="rounded-lg bg-[#F0C869]/25 px-3 py-1 font-mono text-[12px] font-semibold text-[#8A5A00] whitespace-nowrap">
                  4 signaux actifs
                </span>
              </div>

              <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1.5">
                {[
                  {
                    id: "sig-1",
                    provider: "twilio" as ProviderId,
                    severity: "danger",
                    badge: "SIP +1,8 %",
                    title: "Hausse des échecs d’appels sur le trunk Twilio EU-Dublin",
                    detail:
                      "14 appels échoués (SIP 503) sur les 45 dernières minutes · Bascule de secours prête.",
                    actionLabel: "Ouvrir Fournisseurs",
                    targetSection: "providers" as SuperAdminSectionNavTarget,
                    targetTab: "connections",
                  },
                  {
                    id: "sig-2",
                    provider: "elevenlabs" as ProviderId,
                    severity: "info",
                    badge: "Écart +45 €",
                    title: "Écart entre coût estimé et coût facturé ElevenLabs TTS",
                    detail:
                      "Coût réservé : 2 690 € vs facturé opérateur : 2 645 € · Rapprochement prêt à valider.",
                    actionLabel: "Ouvrir Finance",
                    targetSection: "finance" as SuperAdminSectionNavTarget,
                    targetTab: "expenses",
                  },
                  {
                    id: "sig-3",
                    provider: "openai" as ProviderId,
                    severity: "warning",
                    badge: "Quota 96 %",
                    title: "Immobilier Nexa Paris approche de son plafond de minutes vocales",
                    detail:
                      "2 400 / 2 500 min consommées · Risque de blocage des campagnes sortantes sans recharge.",
                    actionLabel: "Ouvrir Consommations",
                    targetSection: "consumption" as SuperAdminSectionNavTarget,
                    targetTab: "companies",
                  },
                  {
                    id: "sig-4",
                    provider: "whatsapp" as ProviderId,
                    severity: "neutral",
                    badge: "Support P2",
                    title: "Demande de diagnostic lecture seule (30 min) avec consentement client",
                    detail:
                      "Ticket #SUP-409 · Lyon Propreté & Services · Vérification des relances WhatsApp Business.",
                    actionLabel: "Ouvrir Support",
                    targetSection: "support" as SuperAdminSectionNavTarget,
                    targetTab: "tickets",
                  },
                ].map((sig) => (
                  <div
                    key={sig.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-4 transition hover:border-[#E0E0E0] hover:bg-white sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3.5">
                      <ProviderLogoBadge id={sig.provider} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11.5px] font-semibold whitespace-nowrap ${sig.severity === "danger"
                              ? "bg-[#FCE7EB] text-[#B91C1C]"
                              : sig.severity === "warning"
                                ? "bg-[#F0C869]/25 text-[#8A5A00]"
                                : sig.severity === "info"
                                  ? "bg-[#E4EEFE] text-[#1D4ED8]"
                                  : "bg-[#EFEFEF] text-[#525252]"
                              }`}
                          >
                            {sig.badge}
                          </span>
                          <p className="text-[14px] font-semibold text-[#171717]">
                            {sig.title}
                          </p>
                        </div>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-[#525252]">
                          {sig.detail}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate(sig.targetSection, sig.targetTab)}
                      className="inline-flex h-9 shrink-0 items-center gap-1.5 self-start rounded-lg border border-[#E5E5E5] bg-white px-3.5 text-[13px] font-medium text-[#171717] whitespace-nowrap shadow-2xs transition hover:bg-[#F4F4F5] sm:self-auto cursor-pointer"
                    >
                      <span>{sig.actionLabel}</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Colonne droite (5 col) : Activité par organisation avec coulissement vertical */}
            <section className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
              <div className="flex items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#171717]">
                    Activité par organisation
                  </h3>
                  <p className="mt-1 text-[13.5px] text-[#737373]">
                    Consommation des quotas et appels traités.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("tenants", "companies")}
                  className="text-[13px] font-medium text-[#008F6D] whitespace-nowrap hover:underline cursor-pointer"
                >
                  Tout voir →
                </button>
              </div>

              <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1.5">
                {PLATFORM_TENANTS.map((tenant) => (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/60 px-4 py-3 text-[13.5px] transition hover:bg-white"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-[#171717]">
                          {tenant.name}
                        </p>
                        <span className="shrink-0 rounded bg-[#EFEFEF] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[#525252]">
                          {tenant.market}
                        </span>
                      </div>
                      <p className="mt-1 text-[12.5px] text-[#737373] tabular-nums">
                        Offre {tenant.plan} · {tenant.users} util. · {tenant.callsToday} appels
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 font-mono text-[12px] font-semibold tabular-nums whitespace-nowrap ${tenant.quotaUsedPct >= 90
                          ? "bg-[#FCE7EB] text-[#B91C1C]"
                          : tenant.quotaUsedPct >= 70
                            ? "bg-[#F0C869]/25 text-[#8A5A00]"
                            : "bg-[#DEF5EC] text-[#008064]"
                          }`}
                      >
                        Quota {tenant.quotaUsedPct} %
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* =====================================================================
          VUE 2 : ÉCONOMIE ("Comment se porte l’activité financière ?")
          6 blocs de stat double surface style Dashboard Admin Client
         ===================================================================== */}
      {activeTab === "economy" && (
        <div className="space-y-6">
          {/* 6 KPI double surface strictement différenciés (1 seul logo par bloc, whitespace-nowrap sur montants) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. MRR Contractuel */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                      <SolarIcon name="card" className="size-4.5" />
                    </span>
                    <p className="truncate text-[14px] font-medium text-[var(--text-secondary)]">
                      1. MRR contractuel (HT)
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-white px-2 py-0.5 font-mono text-[11.5px] font-medium text-[#525252] whitespace-nowrap shadow-2xs">
                    ARR {formatEur(metrics.arrEur)}
                  </span>
                </div>
                <p className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  {formatEur(metrics.mrrEur)}
                </p>
              </div>
              <p className="px-3 pt-2.5 pb-1 text-[12.5px] leading-relaxed text-[#525252]">
                Abonnements mensuels normalisés.{" "}
                <strong className="font-medium text-[#171717]">
                  Hors recharges et annuel payé d’avance.
                </strong>
              </p>
            </div>

            {/* 2. Argent encaissé (Cash) avec un seul logo Stripe */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E8E8E8] bg-white p-1 shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                      <StripeBrandSvg className="size-full rounded-[4px]" />
                    </span>
                    <p className="truncate text-[14px] font-medium text-[var(--text-secondary)]">
                      2. Argent encaissé (Cash)
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-[#DEF5EC] px-2 py-0.5 font-mono text-[11.5px] font-medium text-[#008064] whitespace-nowrap">
                    Stripe + SEPA
                  </span>
                </div>
                <p className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  {formatEur(metrics.cashCollectedEur)}
                </p>
              </div>
              <p className="px-3 pt-2.5 pb-1 text-[12.5px] leading-relaxed text-[#525252]">
                Trésorerie réellement encaissée sur la période (inclut l’annuel d’avance et les packs).
              </p>
            </div>

            {/* 3. Revenu reconnu */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                      <SolarIcon name="chart" className="size-4.5" />
                    </span>
                    <p className="truncate text-[14px] font-medium text-[var(--text-secondary)]">
                      3. Revenu reconnu (Acquis)
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-[#E4EEFE] px-2 py-0.5 font-mono text-[11.5px] font-medium text-[#1D4ED8] whitespace-nowrap">
                    Différé : {formatEur(metrics.deferredRevenueEur)}
                  </span>
                </div>
                <p className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  {formatEur(metrics.recognizedRevenueEur)}
                </p>
              </div>
              <p className="px-3 pt-2.5 pb-1 text-[12.5px] leading-relaxed text-[#525252]">
                Prorata mensuel acquis + crédits de recharges effectivement consommés.
              </p>
            </div>

            {/* 4. Coût fournisseurs estimé */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                      <SolarIcon name="bolt" className="size-4.5" />
                    </span>
                    <p className="truncate text-[14px] font-medium text-[var(--text-secondary)]">
                      4. Coût fournisseurs estimé
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-[#F0C869]/25 px-2 py-0.5 font-mono text-[11.5px] font-medium text-[#8A5A00] whitespace-nowrap">
                    Temps réel
                  </span>
                </div>
                <p className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  {formatEur(metrics.estimatedCostEur)}
                </p>
              </div>
              <p className="px-3 pt-2.5 pb-1 text-[12.5px] leading-relaxed text-[#525252]">
                Valorisé à la volée lors des réservations de quotas (Twilio, ElevenLabs, OpenAI).
              </p>
            </div>

            {/* 5. Coût réel facturé (Rapproché) */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                      <SolarIcon name="mail" className="size-4.5" />
                    </span>
                    <p className="truncate text-[14px] font-medium text-[var(--text-secondary)]">
                      5. Coût réel rapproché
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-white px-2 py-0.5 font-mono text-[11.5px] font-medium text-[#525252] whitespace-nowrap shadow-2xs">
                    Écart : +{formatEur(metrics.costDriftEur)}
                  </span>
                </div>
                <p className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  {formatEur(metrics.realReconciledCostEur)}
                </p>
              </div>
              <p className="px-3 pt-2.5 pb-1 text-[12.5px] leading-relaxed text-[#525252]">
                Coût certifié après rapprochement des CDR télécoms et factures API.
              </p>
            </div>

            {/* 6. Contribution directe */}
            <div className="rounded-xl border border-[#008F6D]/30 bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[#E6F5F0]/60 px-4 py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#008F6D]/20 bg-white text-[#008F6D] shadow-2xs">
                      <SolarIcon name="chart" className="size-4.5" />
                    </span>
                    <p className="truncate text-[14px] font-semibold text-[#171717]">
                      6. Contribution ({metrics.contributionRatePct} %)
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-[#DEF5EC] px-2 py-0.5 font-mono text-[11.5px] font-semibold text-[#008064] whitespace-nowrap">
                    ≠ Bénéfice net
                  </span>
                </div>
                <p className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[#008F6D] tabular-nums whitespace-nowrap">
                  {formatEur(metrics.grossContributionEur)}
                </p>
              </div>
              <p className="px-3 pt-2.5 pb-1 text-[12.5px] leading-relaxed text-[#525252]">
                Revenu reconnu ({formatEur(metrics.recognizedRevenueEur)}) moins Coût réel rapproché ({formatEur(metrics.realReconciledCostEur)}).
              </p>
            </div>
          </div>

          {/* Tableau de réconciliation avec coulissement horizontal propre et 1 seul logo par ligne */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EFEFEF] pb-4">
              <div>
                <h3 className="text-[16px] font-semibold text-[#171717]">
                  Réconciliation des coûts par fournisseur (Estimé vs Réel)
                </h3>
                <p className="mt-1 text-[13.5px] text-[#737373]">
                  Cliquez sur un fournisseur pour inspecter ses tarifs versionnés, ses débits ou sa facturation.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate("consumption", "services")}
                  className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-3.5 text-[13px] font-medium text-[#171717] whitespace-nowrap hover:bg-[#F7F7F8] cursor-pointer"
                >
                  Consommations par service →
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("finance", "revenues")}
                  className="h-9 rounded-lg bg-[#171717] px-3.5 text-[13px] font-medium text-white whitespace-nowrap hover:bg-[#2E2E2E] cursor-pointer"
                >
                  Ouvrir Finance complète →
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto pb-1">
              <table className="w-full min-w-[820px] border-collapse text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                    <th className="py-3 pr-5">Fournisseur</th>
                    <th className="px-4 py-3">Poste technique</th>
                    <th className="px-4 py-3 text-right">Coût estimé</th>
                    <th className="px-4 py-3 text-right">Coût réel rapproché</th>
                    <th className="px-4 py-3 text-right">Écart</th>
                    <th className="px-4 py-3">Rapprochement</th>
                    <th className="py-3 pl-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F2F2]">
                  {PROVIDERS_SNAPSHOT.map((prov) => {
                    const diff = prov.estimatedCostEur - prov.reconciledCostEur;
                    return (
                      <tr key={prov.id} className="transition hover:bg-[#FAFAFA]">
                        <td className="py-4 pr-5 whitespace-nowrap">
                          <div className="flex items-center gap-3.5">
                            <ProviderLogoBadge id={prov.id} />
                            <span className="text-[14px] font-semibold text-[#171717]">
                              {prov.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[13px] text-[#525252]">
                          {prov.role}
                        </td>
                        <td className="px-4 py-4 text-right font-mono tabular-nums text-[#525252] whitespace-nowrap">
                          {formatEur(prov.estimatedCostEur)}
                        </td>
                        <td className="px-4 py-4 text-right font-mono font-semibold tabular-nums text-[#171717] whitespace-nowrap">
                          {formatEur(prov.reconciledCostEur)}
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <span className="inline-flex items-center rounded-md bg-[#DEF5EC] px-2.5 py-0.5 font-mono text-[12.5px] font-semibold tabular-nums text-[#008064] whitespace-nowrap">
                            {diff >= 0 ? `+${diff}\u00A0€` : `${diff}\u00A0€`}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[13px] text-[#737373] whitespace-nowrap">
                          {prov.lastReconciledAt}
                        </td>
                        <td className="py-4 pl-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onNavigate(prov.targetSection, prov.targetTab)}
                            className="inline-flex h-8 items-center rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] whitespace-nowrap shadow-2xs hover:bg-[#F4F4F5] cursor-pointer"
                          >
                            Analyser →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          VUE 3 : SANTÉ ("Est-ce que le service fonctionne ?")
         ===================================================================== */}
      {activeTab === "health" && (
        <div className="space-y-6">
          {/* 4 blocs de stat double surface style Dashboard Admin Client */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Incidents actifs
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  1 dégradation
                </p>
                <p className="mt-1 text-[12.5px] text-[var(--text-muted)]">
                  Trunk SIP Twilio Dublin · 0 panne
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("infrastructure", "incidents-status")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[13px] font-medium text-[#008F6D] hover:underline cursor-pointer"
              >
                <span>↗ Incidents &amp; Status Page</span>
                <span>→</span>
              </button>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="phone" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Erreurs d’appels (24h)
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  {metrics.failureRatePct} %
                </p>
                <p className="mt-1 text-[12.5px] text-[var(--text-muted)] tabular-nums">
                  {metrics.failedCallsToday} échecs / {metrics.callsToday.toLocaleString("fr-FR")} appels
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("providers", "connections")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[13px] font-medium text-[#008F6D] hover:underline cursor-pointer"
              >
                <span>↗ Inspecter les trunks SIP</span>
                <span>→</span>
              </button>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="agents" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Latence vocale (p95)
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  712 ms
                </p>
                <p className="mt-1 text-[12.5px] text-[#15803D]">
                  Cible &lt; 850 ms · STT + LLM + TTS
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("ai-governance", "supervision")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[13px] font-medium text-[#008F6D] hover:underline cursor-pointer"
              >
                <span>↗ Ouvrir Gouvernance IA</span>
                <span>→</span>
              </button>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="appearance" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Files BullMQ &amp; Workers
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  99,4 %
                </p>
                <p className="mt-1 text-[12.5px] text-[var(--text-muted)]">
                  18 jobs en file · 2 en quarantaine
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("infrastructure", "queues-workers")}
                className="flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[13px] font-medium text-[#008F6D] hover:underline cursor-pointer"
              >
                <span>↗ Inspecter Files &amp; Workers</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* État des fournisseurs (1 seul logo par ligne) + Files BullMQ avec coulissement vertical */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Fournisseurs externes (7 col) */}
            <section className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <div className="flex items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#171717]">
                    État des fournisseurs critiques
                  </h3>
                  <p className="mt-1 text-[13.5px] text-[#737373]">
                    Disponibilité temps réel, latence p95 et taux d’erreur par adaptateur.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("providers", "connections")}
                  className="text-[13px] font-medium text-[#008F6D] whitespace-nowrap hover:underline cursor-pointer"
                >
                  Module Fournisseurs →
                </button>
              </div>

              <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1.5">
                {PROVIDERS_SNAPSHOT.map((prov) => (
                  <div
                    key={prov.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-4 transition hover:bg-white sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3.5">
                      <ProviderLogoBadge id={prov.id} />
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-[14px] font-semibold text-[#171717]">
                            {prov.name}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold whitespace-nowrap ${prov.status === "operational"
                              ? "bg-[#DEF5EC] text-[#008064]"
                              : "bg-[#F0C869] text-[#5C3D00]"
                              }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${prov.status === "operational" ? "bg-[#15803D]" : "bg-[#5C3D00]"
                                }`}
                            />
                            {prov.status === "operational" ? "Opérationnel" : "Dégradé (SIP 503)"}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-[#737373]">
                          {prov.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 text-right font-mono text-[12.5px] tabular-nums sm:justify-end">
                      <div className="whitespace-nowrap">
                        <p className="text-[11.5px] text-[#737373]">Latence</p>
                        <p className="mt-0.5 font-semibold text-[#171717]">{prov.latencyMs} ms</p>
                      </div>
                      <div className="whitespace-nowrap">
                        <p className="text-[11.5px] text-[#737373]">Erreurs</p>
                        <p
                          className={`mt-0.5 font-semibold ${prov.errorRatePct >= 1 ? "text-[#E11D48]" : "text-[#171717]"
                            }`}
                        >
                          {prov.errorRatePct} %
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate(prov.targetSection, prov.targetTab)}
                        className="h-8 shrink-0 rounded-lg border border-[#E5E5E5] bg-white px-3 font-sans text-[12.5px] font-medium text-[#171717] whitespace-nowrap shadow-2xs hover:bg-[#F4F4F5] cursor-pointer"
                      >
                        Diagnostiquer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Files de traitements & Workers (5 col) */}
            <section className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
              <div className="flex items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#171717]">
                    Traitements &amp; Files BullMQ
                  </h3>
                  <p className="mt-1 text-[13.5px] text-[#737373]">
                    Jobs asynchrones hors chemin critique audio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("infrastructure", "queues-workers")}
                  className="text-[13px] font-medium text-[#008F6D] whitespace-nowrap hover:underline cursor-pointer"
                >
                  Infrastructure →
                </button>
              </div>

              <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1.5">
                {[
                  {
                    queue: "call-postprocess",
                    desc: "Transcriptions, résumés IA & archivage S3",
                    active: 14,
                    waiting: 6,
                    failed: 0,
                  },
                  {
                    queue: "crm-webhooks-sync",
                    desc: "Synchronisation HubSpot, Google Calendar & Webhooks",
                    active: 8,
                    waiting: 9,
                    failed: 2,
                  },
                  {
                    queue: "campaigns-dispatcher",
                    desc: "Ordonnanceur d’appels sortants & fenêtres horaires",
                    active: 21,
                    waiting: 3,
                    failed: 0,
                  },
                  {
                    queue: "billing-ledger-reconcile",
                    desc: "Débits atomiques de quotas & rapprochement CDR",
                    active: 4,
                    waiting: 0,
                    failed: 0,
                  },
                ].map((q) => (
                  <div
                    key={q.queue}
                    className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/60 p-4 transition hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[13px] font-semibold text-[#171717]">
                        {q.queue}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 font-mono text-[11.5px] font-medium whitespace-nowrap ${q.failed > 0
                          ? "bg-[#FCE7EB] text-[#B91C1C]"
                          : "bg-[#DEF5EC] text-[#008064]"
                          }`}
                      >
                        {q.failed > 0 ? `${q.failed} en échec` : "Nominal"}
                      </span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-[#737373]">{q.desc}</p>
                    <p className="mt-2 font-mono text-[12px] text-[#525252] tabular-nums">
                      {q.active} en cours · {q.waiting} en file
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
