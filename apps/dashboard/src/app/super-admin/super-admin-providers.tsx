"use client";

import { useMemo, useState } from "react";
import {
  ElevenLabsBrandSvg,
  OpenAIBrandSvg,
  StripeBrandSvg,
  TwilioBrandSvg,
} from "../brand-icons";
import { PremiumSelect } from "../premium-select";
import { type Locale, SolarIcon } from "../workspace-navigation";
import { type SuperAdminSectionNavTarget } from "./super-admin-overview";

type ProviderId = "elevenlabs" | "twilio" | "openai" | "retell" | "neon" | "stripe";
type ProviderConnectionState =
  | "Opérationnel"
  | "Dégradé"
  | "Configuré (Test requis)"
  | "Non connecté";

interface ProviderCardRecord {
  id: ProviderId;
  name: string;
  role: string;
  state: ProviderConnectionState;
  latencyDisplay: string;
  uptimeDisplay: string;
  region: string;
  adapterVersion: string;
  lastTestedAt: string;
  reconciliationNote: string;
}

const INITIAL_PROVIDERS: ProviderCardRecord[] = [
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    role: "Voix et agents IA",
    state: "Opérationnel",
    latencyDisplay: "240 ms",
    uptimeDisplay: "99,98 %",
    region: "EU-West (Francfort / Dublin)",
    adapterVersion: "adapter-elevenlabs@2.5.1",
    lastTestedAt: "Aujourd’hui · 14:10",
    reconciliationNote: "Rapprochement quotidien des secondes TTS consommées.",
  },
  {
    id: "twilio",
    name: "Twilio",
    role: "Téléphonie",
    state: "Opérationnel",
    latencyDisplay: "180 ms",
    uptimeDisplay: "99,99 %",
    region: "Dublin (IE1) · Francfort (DE1)",
    adapterVersion: "adapter-twilio-sip@3.1.0",
    lastTestedAt: "Aujourd’hui · 14:32",
    reconciliationNote: "Webhooks signés HMAC + rapprochement CDR automatique.",
  },
  {
    id: "openai",
    name: "OpenAI",
    role: "Modèles de langage",
    state: "Dégradé",
    latencyDisplay: "1 420 ms",
    uptimeDisplay: "98,80 %",
    region: "EU Data Residency",
    adapterVersion: "adapter-openai@4.2.0",
    lastTestedAt: "Aujourd’hui · 13:45",
    reconciliationNote: "Pic de latence p95 détecté sur le cluster EU · Timeout ajusté.",
  },
  {
    id: "retell",
    name: "Retell AI",
    role: "Agent vocal alternatif",
    state: "Non connecté",
    latencyDisplay: "—",
    uptimeDisplay: "—",
    region: "Non provisionné",
    adapterVersion: "adapter-retell@1.0.0-beta",
    lastTestedAt: "Aucun test validé",
    reconciliationNote:
      "Adaptateur secondaire non activé — nécessite une configuration voix/prompt compatible.",
  },
  {
    id: "neon",
    name: "Neon",
    role: "Base de données",
    state: "Opérationnel",
    latencyDisplay: "32 ms",
    uptimeDisplay: "99,99 %",
    region: "AWS eu-central-1 (Francfort)",
    adapterVersion: "prisma-neon-rls@6.0.0",
    lastTestedAt: "Temps réel",
    reconciliationNote: "PostgreSQL managé avec Row-Level Security (tenant_id) actif.",
  },
  {
    id: "stripe",
    name: "Stripe",
    role: "Paiements",
    state: "Opérationnel",
    latencyDisplay: "210 ms",
    uptimeDisplay: "99,99 %",
    region: "Europe (Paris / Dublin)",
    adapterVersion: "adapter-stripe-billing@2.8.0",
    lastTestedAt: "Temps réel",
    reconciliationNote: "Idempotency keys actives sur tous les prélèvements SEPA/CB.",
  },
];

interface ProviderPricingRecord {
  id: string;
  providerId?: ProviderId;
  providerName: string;
  unit: "Minute" | "Contact" | "1K Tokens";
  currency: "USD ($)" | "EUR (€)";
  previousRateDisplay: string;
  currentRateDisplay: string;
  effectiveDate: string;
  versionTag: string;
  conditions: string;
  monthlyImpactDisplay: string;
}

const INITIAL_PRICING: ProviderPricingRecord[] = [
  {
    id: "rate-1",
    providerId: "elevenlabs",
    providerName: "ElevenLabs",
    unit: "Minute",
    currency: "USD ($)",
    previousRateDisplay: "0,12 $",
    currentRateDisplay: "0,15 $",
    effectiveDate: "01 déc. 2026",
    versionTag: "RATE-EL-2026.4",
    conditions: "Palier Scale Turbo v2.5 · Ancien tarif v2026.3 conservé pour l’historique nov.",
    monthlyImpactDisplay: "+1 340 € / mois est.",
  },
  {
    id: "rate-2",
    providerId: "twilio",
    providerName: "Twilio",
    unit: "Minute",
    currency: "USD ($)",
    previousRateDisplay: "0,020 $",
    currentRateDisplay: "0,025 $",
    effectiveDate: "15 nov. 2026",
    versionTag: "RATE-TW-2026.2",
    conditions: "Terminaison SIP France fixe & mobile + enregistrement trunk.",
    monthlyImpactDisplay: "+220 € / mois est.",
  },
  {
    id: "rate-3",
    providerName: "Acquisition API",
    unit: "Contact",
    currency: "EUR (€)",
    previousRateDisplay: "0,040 €",
    currentRateDisplay: "0,045 €",
    effectiveDate: "01 nov. 2026",
    versionTag: "RATE-ACQ-2026.2",
    conditions: "Enrichissement vérifié B2B (SIREN, e-mail pro, signaux recrutement).",
    monthlyImpactDisplay: "+64 € / mois est.",
  },
  {
    id: "rate-4",
    providerId: "openai",
    providerName: "Transcription API",
    unit: "Minute",
    currency: "USD ($)",
    previousRateDisplay: "0,006 $",
    currentRateDisplay: "0,006 $",
    effectiveDate: "01 janv. 2026",
    versionTag: "RATE-STT-2026.1",
    conditions: "Tarif stable annuel · Facturation à la seconde après filtrage silence.",
    monthlyImpactDisplay: "Stable (0 €)",
  },
];

interface ApiKeyRecord {
  id: string;
  providerId: ProviderId;
  providerName: string;
  environment: "Production" | "Test";
  maskedSecret: string;
  createdAt: string;
  lastRotatedAt: string;
  scopeSummary: string;
  status: "Active (Prioritaire)" | "En veille (Rotation)";
}

const INITIAL_API_KEYS: ApiKeyRecord[] = [
  {
    id: "key-el-prod",
    providerId: "elevenlabs",
    providerName: "ElevenLabs",
    environment: "Production",
    maskedSecret: "•••• •••• •••• 8f2a",
    createdAt: "12 sept. 2026",
    lastRotatedAt: "Aujourd’hui · 10:21",
    scopeSummary: "tts:stream, voices:read (écriture seule en coffre serveur)",
    status: "Active (Prioritaire)",
  },
  {
    id: "key-tw-prod",
    providerId: "twilio",
    providerName: "Twilio",
    environment: "Production",
    maskedSecret: "•••• •••• •••• 4b7c",
    createdAt: "04 août 2026",
    lastRotatedAt: "15 oct. 2026",
    scopeSummary: "sip:trunk, calls:write, recordings:read",
    status: "Active (Prioritaire)",
  },
  {
    id: "key-oa-test",
    providerId: "openai",
    providerName: "OpenAI",
    environment: "Test",
    maskedSecret: "•••• •••• •••• 9d3e",
    createdAt: "01 nov. 2026",
    lastRotatedAt: "01 nov. 2026",
    scopeSummary: "chat.completions, audio.transcriptions (Bac à sable Agent Studio)",
    status: "Active (Prioritaire)",
  },
  {
    id: "key-oa-prod",
    providerId: "openai",
    providerName: "OpenAI",
    environment: "Production",
    maskedSecret: "•••• •••• •••• 3c19",
    createdAt: "10 janv. 2026",
    lastRotatedAt: "02 oct. 2026",
    scopeSummary: "chat.completions, realtime:session (Cluster EU)",
    status: "Active (Prioritaire)",
  },
  {
    id: "key-st-prod",
    providerId: "stripe",
    providerName: "Stripe",
    environment: "Production",
    maskedSecret: "•••• •••• •••• 7a91",
    createdAt: "10 janv. 2026",
    lastRotatedAt: "18 sept. 2026",
    scopeSummary: "billing:subscriptions, payment_intents, webhooks:verify",
    status: "Active (Prioritaire)",
  },
];

interface RoutingRuleRecord {
  id: string;
  capability: string;
  market: "France (EUR)" | "Côte d’Ivoire (XOF)" | "Global";
  primaryProviderId: ProviderId;
  primaryProvider: string;
  secondaryProviderId: ProviderId;
  secondaryProvider: string;
  failoverReady: boolean;
  criteria: string;
  compatibilityWarning: string;
}

const INITIAL_ROUTING_RULES: RoutingRuleRecord[] = [
  {
    id: "route-voice",
    capability: "Orchestration & Synthèse Agents Vocaux IA",
    market: "Global",
    primaryProviderId: "elevenlabs",
    primaryProvider: "ElevenLabs Turbo v2.5",
    secondaryProviderId: "retell",
    secondaryProvider: "Retell AI (Non connecté — Test préalable requis)",
    failoverReady: false,
    criteria: "Latence p95 < 450 ms · Qualité prosodie FR · Coût/min",
    compatibilityWarning:
      "ElevenLabs et Retell AI ne sont pas automatiquement interchangeables : les empreintes vocales et prompts système doivent être validés avant bascule. Ne reprend pas un appel déjà coupé.",
  },
  {
    id: "route-sip-fr",
    capability: "Téléphonie & Trunks SIP (Entrants / Sortants)",
    market: "France (EUR)",
    primaryProviderId: "twilio",
    primaryProvider: "Twilio SIP EU-Dublin (IE1)",
    secondaryProviderId: "twilio",
    secondaryProvider: "Twilio SIP EU-Francfort (DE1)",
    failoverReady: true,
    criteria: "Disponibilité SIP 99,99 % · Bascule auto sur code 503/504",
    compatibilityWarning:
      "Bascule effective uniquement pour les nouveaux appels entrants/sortants ; les flux RTP déjà établis restent sur la passerelle initiale.",
  },
  {
    id: "route-llm",
    capability: "Qualification commerciale & Résumés post-appel",
    market: "Global",
    primaryProviderId: "openai",
    primaryProvider: "OpenAI GPT-4o (Cluster EU)",
    secondaryProviderId: "openai",
    secondaryProvider: "OpenAI GPT-4o-mini (Mode dégradé rapide)",
    failoverReady: true,
    criteria: "Latence > 1 200 ms pendant 3 min → repli sur modèle compact",
    compatibilityWarning:
      "Schéma JSON de sortie identique vérifié par contrat Zod côté serveur.",
  },
];

interface ProviderHistoryEvent {
  id: string;
  order: number;
  title: string;
  providerId?: ProviderId;
  providerName: string;
  timestamp: string;
  actor: string;
  reason: string;
  outcome: "Succès" | "Alerte" | "Audité";
}

const INITIAL_HISTORY: ProviderHistoryEvent[] = [
  {
    id: "hist-1",
    order: 1,
    title: "Test de connexion réussi",
    providerId: "twilio",
    providerName: "Twilio",
    timestamp: "Aujourd’hui · 14:32",
    actor: "root@autocall.fr",
    reason: "Vérification de la latence SIP EU-Dublin et signature webhook",
    outcome: "Succès",
  },
  {
    id: "hist-2",
    order: 2,
    title: "Latence anormalement élevée",
    providerId: "openai",
    providerName: "OpenAI",
    timestamp: "Aujourd’hui · 13:45",
    actor: "Sonde automatique BullMQ",
    reason: "Pic p95 à 1 420 ms sur les résumés d’appels (seuil d’alerte : 1 000 ms)",
    outcome: "Alerte",
  },
  {
    id: "hist-3",
    order: 3,
    title: "Rotation de clé terminée",
    providerId: "elevenlabs",
    providerName: "ElevenLabs",
    timestamp: "Aujourd’hui · 10:21",
    actor: "root@autocall.fr (MFA vérifié)",
    reason: "Rotation trimestrielle planifiée sans coupure (nouvelle clé •••• 8f2a)",
    outcome: "Audité",
  },
  {
    id: "hist-4",
    order: 4,
    title: "Nouvelle version tarifaire",
    providerId: "twilio",
    providerName: "Twilio",
    timestamp: "Hier · 16:10",
    actor: "root@autocall.fr (MFA vérifié)",
    reason: "Enregistrement de RATE-TW-2026.2 (0,020 $ → 0,025 $ / min) avec conservation historique",
    outcome: "Audité",
  },
  {
    id: "hist-5",
    order: 5,
    title: "Modification du routage",
    providerId: "elevenlabs",
    providerName: "Service vocal",
    timestamp: "Hier · 09:30",
    actor: "root@autocall.fr (MFA vérifié)",
    reason: "Abaissement du seuil de repli SIP Francfort à 2 erreurs 503 consécutives",
    outcome: "Audité",
  },
];

function resolveProviderIdFromName(name: string): ProviderId | undefined {
  const lower = name.toLowerCase();
  if (lower.includes("elevenlabs")) return "elevenlabs";
  if (lower.includes("twilio")) return "twilio";
  if (lower.includes("openai") || lower.includes("transcription")) return "openai";
  if (lower.includes("retell")) return "retell";
  if (lower.includes("neon")) return "neon";
  if (lower.includes("stripe")) return "stripe";
  return undefined;
}

function ProviderLogo({
  id,
  nameFallback,
  size = "md",
}: {
  id?: ProviderId;
  nameFallback?: string;
  size?: "sm" | "md";
}) {
  const resolvedId = id ?? (nameFallback ? resolveProviderIdFromName(nameFallback) : undefined);
  const boxClass =
    size === "sm"
      ? "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white p-1.5 shadow-2xs"
      : "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-2 shadow-2xs";

  switch (resolvedId) {
    case "elevenlabs":
      return (
        <span className={boxClass}>
          <ElevenLabsBrandSvg className="size-full" />
        </span>
      );
    case "twilio":
      return (
        <span className={boxClass}>
          <TwilioBrandSvg className="size-full" />
        </span>
      );
    case "openai":
      return (
        <span className={`${boxClass} text-[#171717]`}>
          <OpenAIBrandSvg className="size-full" />
        </span>
      );
    case "stripe":
      return (
        <span
          className={
            size === "sm"
              ? "inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E5E5E5] bg-white p-1 shadow-2xs"
              : "inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-2xs"
          }
        >
          <StripeBrandSvg className="size-full rounded-md" />
        </span>
      );
    case "retell":
      return (
        <span className={`${boxClass} text-[#171717]`}>
          <svg
            viewBox="0 0 24 24"
            className={size === "sm" ? "size-4" : "size-5"}
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
      );
    case "neon":
      return (
        <span
          className={
            size === "sm"
              ? "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#171717] text-[#00E599] shadow-2xs"
              : "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#171717] text-[#00E599] shadow-2xs"
          }
        >
          <svg
            viewBox="0 0 24 24"
            className={size === "sm" ? "size-3.5" : "size-5"}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <path d="M5 19V5l14 14V5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    default:
      return (
        <span className={`${boxClass} text-[#171717]`}>
          <SolarIcon name="acquisition" className={size === "sm" ? "size-4" : "size-5"} />
        </span>
      );
  }
}

export function SuperAdminProviders({
  activeTab,
  onSelectTab,
  onNavigate,
}: {
  activeTab: string;
  locale: Locale;
  onSelectTab: (tabId: string) => void;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  const [providers, setProviders] = useState<ProviderCardRecord[]>(INITIAL_PROVIDERS);
  const [pricingList, setPricingList] = useState<ProviderPricingRecord[]>(INITIAL_PRICING);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(INITIAL_API_KEYS);
  const [history, setHistory] = useState<ProviderHistoryEvent[]>(INITIAL_HISTORY);

  // 01. Connexions : fournisseur sélectionné pour voir les détails
  const [selectedProviderId, setSelectedProviderId] = useState<ProviderId | null>(null);

  // 02. Tarifs : modale d'ajout d'une nouvelle version tarifaire
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [newRateProvider, setNewRateProvider] = useState("ElevenLabs");
  const [newRateUnit, setNewRateUnit] = useState<ProviderPricingRecord["unit"]>("Minute");
  const [newRateCurrency, setNewRateCurrency] = useState<ProviderPricingRecord["currency"]>("USD ($)");
  const [newRateOld, setNewRateOld] = useState("0,15 $");
  const [newRateValue, setNewRateValue] = useState("0,16 $");
  const [newRateDate, setNewRateDate] = useState("01 janv. 2027");
  const [newRateConditions, setNewRateConditions] = useState("");

  // 03. Clés API : modale d'écriture seule (write-only)
  const [writeKeyModalOpen, setWriteKeyModalOpen] = useState(false);
  const [writeKeyProvider, setWriteKeyProvider] = useState<ProviderId>("elevenlabs");
  const [writeKeyEnv, setWriteKeyEnv] = useState<"Production" | "Test">("Production");
  const [writeKeySecret, setWriteKeySecret] = useState("");
  const [writeKeyTotp, setWriteKeyTotp] = useState("");
  const [writeKeyError, setWriteKeyError] = useState<string | null>(null);

  // 04. Rotation en 6 étapes sans interruption
  const [rotationProvider, setRotationProvider] = useState("ElevenLabs (Production)");
  const [rotationStep, setRotationStep] = useState<number>(1);
  const [rotationNewSecret, setRotationNewSecret] = useState("");
  const [rotationTotp, setRotationTotp] = useState("");
  const [rotationReason, setRotationReason] = useState(
    "Rotation préventive périodique sans coupure de flux",
  );

  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  const selectedProvider = useMemo(
    () => providers.find((p) => p.id === selectedProviderId) ?? null,
    [providers, selectedProviderId],
  );

  const handleTestProviderConnection = (prov: ProviderCardRecord) => {
    const nextState: ProviderConnectionState =
      prov.id === "retell" ? "Configuré (Test requis)" : "Opérationnel";

    setProviders((prev) =>
      prev.map((item) =>
        item.id === prov.id
          ? {
              ...item,
              state: nextState,
              lastTestedAt: "À l’instant",
              latencyDisplay: item.id === "openai" ? "410 ms" : item.latencyDisplay,
            }
          : item,
      ),
    );

    setHistory((prev) => [
      {
        id: `hist-${Date.now()}`,
        order: prev.length + 1,
        title:
          prov.id === "retell"
            ? "Tentative de test sur fournisseur non connecté"
            : "Test de connexion réussi",
        providerName: prov.name,
        timestamp: "À l’instant",
        actor: "root@autocall.fr",
        reason: `Vérification manuelle de l’adaptateur ${prov.adapterVersion}`,
        outcome: prov.id === "retell" ? "Alerte" : "Succès",
      },
      ...prev,
    ]);

    notify(
      prov.id === "retell"
        ? "Retell AI nécessite d’abord l’enregistrement d’une clé API en écriture seule"
        : `Connexion ${prov.name} testée et opérationnelle`,
    );
  };

  const handleSaveNewRateVersion = () => {
    if (!newRateValue.trim()) return;
    const newEntry: ProviderPricingRecord = {
      id: `rate-${Date.now()}`,
      providerName: newRateProvider,
      unit: newRateUnit,
      currency: newRateCurrency,
      previousRateDisplay: newRateOld,
      currentRateDisplay: newRateValue,
      effectiveDate: newRateDate,
      versionTag: `RATE-${newRateProvider.slice(0, 2).toUpperCase()}-2027.1`,
      conditions:
        newRateConditions.trim() ||
        "Nouvelle version tarifaire enregistrée — anciens tarifs conservés pour l’historique.",
      monthlyImpactDisplay: "Simulé dans Finance",
    };

    setPricingList((prev) => [newEntry, ...prev]);
    setHistory((prev) => [
      {
        id: `hist-${Date.now()}`,
        order: prev.length + 1,
        title: "Nouvelle version tarifaire",
        providerName: newRateProvider,
        timestamp: "À l’instant",
        actor: "root@autocall.fr",
        reason: `Tarif ${newRateOld} → ${newRateValue} (${newRateUnit}) applicable le ${newRateDate}`,
        outcome: "Audité",
      },
      ...prev,
    ]);
    setRateModalOpen(false);
    setNewRateConditions("");
    notify(`Nouvelle version tarifaire créée pour ${newRateProvider} (historique préservé)`);
  };

  const handleSaveWriteOnlyKey = () => {
    if (writeKeySecret.trim().length < 8) {
      setWriteKeyError("Veuillez saisir une clé API valide (au moins 8 caractères).");
      return;
    }
    if (writeKeyTotp.trim().length < 6) {
      setWriteKeyError("Code MFA Super Admin à 6 chiffres requis.");
      return;
    }

    const last4 = writeKeySecret.trim().slice(-4);
    const providerObj = providers.find((p) => p.id === writeKeyProvider);
    const providerName = providerObj?.name ?? "Fournisseur";

    const newKey: ApiKeyRecord = {
      id: `key-${Date.now()}`,
      providerId: writeKeyProvider,
      providerName,
      environment: writeKeyEnv,
      maskedSecret: `•••• •••• •••• ${last4}`,
      createdAt: "À l’instant",
      lastRotatedAt: "À l’instant",
      scopeSummary: "Clé scellée en écriture seule · Secret complet non consultable",
      status: "Active (Prioritaire)",
    };

    setApiKeys((prev) => [newKey, ...prev]);
    // Effacement immédiat du secret en mémoire client (write-only)
    setWriteKeySecret("");
    setWriteKeyTotp("");
    setWriteKeyError(null);
    setWriteKeyModalOpen(false);
    notify(
      `Clé ${providerName} (${writeKeyEnv}) enregistrée en écriture seule (•••• ${last4})`,
    );
  };

  const handleAdvanceRotation = () => {
    if (rotationStep === 1 && rotationNewSecret.trim().length < 6) {
      notify("Saisissez d’abord la nouvelle clé API à l’étape 1");
      return;
    }
    if (rotationStep === 3 && rotationTotp.trim().length < 6) {
      notify("Saisissez votre code MFA à 6 chiffres pour valider l’étape 3");
      return;
    }
    if (rotationStep < 6) {
      const next = rotationStep + 1;
      setRotationStep(next);
      if (next === 6) {
        const last4 = rotationNewSecret.trim().slice(-4) || "9a4d";
        setRotationNewSecret("");
        setRotationTotp("");
        setHistory((prev) => [
          {
            id: `hist-${Date.now()}`,
            order: prev.length + 1,
            title: "Rotation de clé terminée",
            providerName: rotationProvider,
            timestamp: "À l’instant",
            actor: "root@autocall.fr (MFA vérifié)",
            reason: `${rotationReason} (nouvel identifiant •••• ${last4}, ancienne clé révoquée)`,
            outcome: "Audité",
          },
          ...prev,
        ]);
        notify("Rotation en 6 étapes terminée sans interruption · Ancienne clé révoquée");
      }
    } else {
      setRotationStep(1);
    }
  };

  return (
    <div className="mt-7 space-y-7">
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-[#E5E5E5] bg-[#171717] px-4 py-3 text-[13.5px] font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Bandeau de délimitation des rôles (06 Fournisseurs vs 04 Consommations vs 05 Finance vs 10 Infrastructure) */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-2xs lg:flex-row lg:items-center">
        <div className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
          <span className="inline-flex size-2 shrink-0 rounded-full bg-[#008F6D]" />
          <span>
            <strong className="font-semibold text-[var(--foreground)]">
              06 · Fournisseurs :
            </strong>{" "}
            Administration des prestataires externes, tarifs versionnés, clés en écriture seule et routage de continuité.
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("finance", "expenses")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>05 · Dépenses</span>
            <span className="text-[#737373]">→</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("infrastructure", "infrastructure")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>10 · Infrastructure</span>
            <span className="text-[#737373]">→</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          01. SOUS-ONGLET CONNEXIONS (Cartes fournisseurs + Compteurs 4 / 1 / 1)
         ===================================================================== */}
      {activeTab === "connections" && (
        <div className="space-y-6">
          {/* 3 blocs de statistiques double surface style Dashboard Admin Client : Opérationnels 4 / Dégradés 1 / Non connectés 1 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="phone" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Opérationnels
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  4
                </p>
              </div>
              <div className="px-2.5 pt-2.5 pb-1 flex flex-wrap items-center gap-2 text-[12.5px] font-medium text-[#008F6D]">
                <span className="inline-flex items-center gap-1">
                  <ProviderLogo id="elevenlabs" size="sm" />
                  <ProviderLogo id="twilio" size="sm" />
                  <ProviderLogo id="neon" size="sm" />
                  <ProviderLogo id="stripe" size="sm" />
                </span>
                <span>4 connecteurs testés &amp; actifs</span>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Dégradés
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  1
                </p>
              </div>
              <div className="px-2.5 pt-2.5 pb-1 flex items-center gap-2 text-[12.5px] font-medium text-[#8A5A00]">
                <ProviderLogo id="openai" size="sm" />
                <span>OpenAI (Latence 1 420 ms · Repli prêt)</span>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="settings" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Non connectés
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  1
                </p>
              </div>
              <div className="px-2.5 pt-2.5 pb-1 flex items-center gap-2 text-[12.5px] text-[#737373]">
                <ProviderLogo id="retell" size="sm" />
                <span>Retell AI (Adaptateur secondaire en réserve)</span>
              </div>
            </div>
          </div>

          {/* Grille des 6 cartes fournisseurs (double surface) */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((prov) => {
              const isSelected = selectedProviderId === prov.id;
              return (
                <article
                  key={prov.id}
                  className={`flex flex-col justify-between rounded-2xl border bg-[var(--surface)] p-3 shadow-2xs transition ${
                    isSelected
                      ? "border-[#171717] ring-1 ring-[#171717]/10"
                      : "border-[var(--border)]"
                  }`}
                >
                  <div>
                    <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <ProviderLogo id={prov.id} />
                          <div>
                            <h4 className="text-[16px] font-semibold text-[#171717]">
                              {prov.name}
                            </h4>
                            <p className="text-[12.5px] text-[#737373]">{prov.role}</p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold whitespace-nowrap ${
                            prov.state === "Opérationnel"
                              ? "bg-[#DEF5EC] text-[#008064]"
                              : prov.state === "Dégradé"
                                ? "bg-[#F0C869] text-[#5C3D00]"
                                : "bg-[#EFEFEF] text-[#525252]"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              prov.state === "Opérationnel"
                                ? "bg-[#15803D]"
                                : prov.state === "Dégradé"
                                  ? "bg-[#5C3D00]"
                                  : "bg-[#737373]"
                            }`}
                          />
                          {prov.state}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-[#E5E5E5]/80 pt-3.5">
                        <div className="rounded-lg border border-[#E5E5E5] bg-white px-3 py-2">
                          <span className="block text-[11px] text-[#737373]">Latence</span>
                          <span className="mt-0.5 block font-mono text-[15px] font-bold text-[#171717] tabular-nums">
                            {prov.latencyDisplay}
                          </span>
                        </div>
                        <div className="rounded-lg border border-[#E5E5E5] bg-white px-3 py-2">
                          <span className="block text-[11px] text-[#737373]">Disponibilité</span>
                          <span className="mt-0.5 block font-mono text-[15px] font-bold text-[#171717] tabular-nums">
                            {prov.uptimeDisplay}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-2 pt-3 pb-1 text-[12px] text-[#737373]">
                      <p className="truncate">Région : {prov.region}</p>
                      <p className="mt-0.5 font-mono text-[11.5px] text-[#525252]">
                        Dernier test : {prov.lastTestedAt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 px-1 pb-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedProviderId((prev) =>
                          prev === prov.id ? null : prov.id,
                        )
                      }
                      className="h-9 flex-1 rounded-xl border border-[#E5E5E5] bg-white text-[12.5px] font-semibold text-[#171717] transition hover:bg-[#F7F7F8] cursor-pointer"
                    >
                      {isSelected ? "Masquer détails" : "Voir les détails"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTestProviderConnection(prov)}
                      className="h-9 rounded-xl bg-[#171717] px-3 text-[12.5px] font-semibold text-white transition hover:bg-[#2E2E2E] cursor-pointer"
                    >
                      Tester
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Panneau de détails techniques du fournisseur sélectionné */}
          {selectedProvider && (
            <section className="rounded-2xl border border-[#171717] bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3.5">
                  <ProviderLogo id={selectedProvider.id} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[18px] font-semibold text-[#171717]">
                        {selectedProvider.name} — {selectedProvider.role}
                      </h4>
                      <span className="rounded bg-[#EFEFEF] px-2 py-0.5 font-mono text-[11.5px] text-[#171717]">
                        {selectedProvider.adapterVersion}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[13px] text-[#525252]">
                      {selectedProvider.reconciliationNote}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectTab("pricing")}
                    className="h-9 rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[12.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                  >
                    Tarifs versionnés →
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTab("api-keys")}
                    className="h-9 rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[12.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                  >
                    Clés API →
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTab("routing")}
                    className="h-9 rounded-xl bg-[#171717] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
                  >
                    Configurer le routage →
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 text-[13px]">
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                  <span className="block text-[11.5px] text-[#737373]">
                    Distinction Configuré vs Opérationnel
                  </span>
                  <span className="mt-1 block font-semibold text-[#171717]">
                    {selectedProvider.state === "Non connecté"
                      ? "Clé manquante · Test requis avant trafic"
                      : "Flux testé de bout en bout (Ping + Droits OK)"}
                  </span>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                  <span className="block text-[11.5px] text-[#737373]">
                    Région &amp; Résidence des données
                  </span>
                  <span className="mt-1 block font-semibold text-[#171717]">
                    {selectedProvider.region}
                  </span>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5">
                  <span className="block text-[11.5px] text-[#737373]">
                    Latence &amp; Disponibilité (24h)
                  </span>
                  <span className="mt-1 block font-mono font-semibold text-[#171717]">
                    {selectedProvider.latencyDisplay} · SLA {selectedProvider.uptimeDisplay}
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* =====================================================================
          02. SOUS-ONGLET TARIFS (Catalogue tarifaire versionné & historique conservé)
         ===================================================================== */}
      {activeTab === "pricing" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Catalogue tarifaire fournisseurs (Versionné)
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Chaque tarif est versionné avec sa devise, son unité et sa date d’effet. Les anciens tarifs restent verrouillés pour ne jamais fausser les calculs historiques.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRateModalOpen(true)}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
            >
              + Enregistrer une nouvelle version tarifaire
            </button>
          </div>

          <div className="mt-5 overflow-x-auto pb-1">
            <table className="w-full min-w-[840px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                  <th className="py-3 pr-4">Fournisseur</th>
                  <th className="px-4 py-3">Unité &amp; Devise</th>
                  <th className="px-4 py-3 text-right">Ancien tarif</th>
                  <th className="px-4 py-3 text-right">Nouveau tarif</th>
                  <th className="px-4 py-3">Entrée en vigueur</th>
                  <th className="px-4 py-3">Impact estimé</th>
                  <th className="py-3 pl-4">Version &amp; Conditions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {pricingList.map((row) => (
                  <tr key={row.id} className="transition hover:bg-[#FAFAFA]">
                    <td className="py-4 pr-4 font-semibold text-[#171717] whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <ProviderLogo
                          id={row.providerId}
                          nameFallback={row.providerName}
                          size="sm"
                        />
                        <span>{row.providerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="rounded-md bg-[#EFEFEF] px-2.5 py-0.5 font-mono text-[12px] font-medium text-[#171717]">
                        {row.unit} · {row.currency}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-[#737373] line-through whitespace-nowrap tabular-nums">
                      {row.previousRateDisplay}
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-bold text-[#171717] whitespace-nowrap tabular-nums">
                      {row.currentRateDisplay}
                    </td>
                    <td className="px-4 py-4 font-mono text-[12.5px] text-[#525252] whitespace-nowrap">
                      {row.effectiveDate}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`rounded-md px-2.5 py-0.5 font-mono text-[12px] font-semibold ${
                          row.monthlyImpactDisplay.startsWith("+")
                            ? "bg-[#F0C869] text-[#5C3D00]"
                            : "bg-[#DEF5EC] text-[#008064]"
                        }`}
                      >
                        {row.monthlyImpactDisplay}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-[12.5px] text-[#525252]">
                      <span className="mr-2 rounded border border-[#E5E5E5] bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#171717]">
                        {row.versionTag}
                      </span>
                      <span>{row.conditions}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          03. SOUS-ONGLET CLÉS API (Écriture seule · Secrets non consultables · Test vs Production)
         ===================================================================== */}
      {activeTab === "api-keys" && (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Identifiants API (Accès en écriture seule)
                </h3>
                <span className="rounded-md bg-[#171717] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white">
                  WRITE-ONLY VAULT
                </span>
              </div>
              <p className="mt-1 text-[13.5px] text-[#737373]">
                Même le Super Administrateur ne peut jamais relire ou exporter une clé complète déjà enregistrée. Les environnements de Production et de Test sont strictement isolés.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setWriteKeyError(null);
                setWriteKeyModalOpen(true);
              }}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
            >
              + Configurer une clé (Écriture seule)
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {apiKeys.map((keyItem) => (
              <article
                key={keyItem.id}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs"
              >
                <div>
                  <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <ProviderLogo id={keyItem.providerId} />
                        <div>
                          <h4 className="text-[15.5px] font-semibold text-[#171717]">
                            {keyItem.providerName}
                          </h4>
                          <p className="text-[11.5px] text-[#737373]">
                            Rotation : {keyItem.lastRotatedAt}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                          keyItem.environment === "Production"
                            ? "bg-[#171717] text-white"
                            : "bg-[#E4EEFE] text-[#1D4ED8]"
                        }`}
                      >
                        {keyItem.environment}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-lg border border-[#E5E5E5] bg-white px-3.5 py-2.5 font-mono text-[14px] font-bold tracking-wider text-[#171717] shadow-2xs">
                      <span>{keyItem.maskedSecret}</span>
                      <span className="rounded bg-[#F8F8F8] px-1.5 py-0.5 font-sans text-[10.5px] font-medium tracking-normal text-[#737373]">
                        Scellé
                      </span>
                    </div>

                    <p className="mt-2.5 flex items-center gap-1.5 text-[11.5px] font-medium text-[#525252]">
                      <svg
                        viewBox="0 0 24 24"
                        className="size-3.5 shrink-0 text-[#008F6D]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <rect x="4" y="11" width="16" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                      <span>Identifiant masqué · Secret non consultable</span>
                    </p>
                  </div>

                  <p className="px-2 pt-3 pb-1 text-[12px] text-[#737373]">
                    Périmètre : {keyItem.scopeSummary}
                  </p>
                </div>

                <div className="mt-3 px-1 pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRotationProvider(`${keyItem.providerName} (${keyItem.environment})`);
                      setRotationStep(1);
                      onSelectTab("rotation");
                    }}
                    className="h-9 w-full rounded-xl border border-[#E5E5E5] bg-white text-[12.5px] font-semibold text-[#171717] transition hover:bg-[#F7F7F8] cursor-pointer"
                  >
                    Lancer une rotation sans coupure →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          04. SOUS-ONGLET ROTATION (Processus guidé en 6 étapes sans interruption)
         ===================================================================== */}
      {activeTab === "rotation" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Colonne gauche (7 col) : Les 6 étapes du protocole de rotation */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Processus de rotation sans interruption
                </h3>
                <p className="mt-0.5 text-[13.5px] text-[#737373]">
                  Remplacez une clé API critique en 6 étapes contrôlées sans couper les appels ni les webhooks en cours.
                </p>
              </div>
              <span className="rounded-lg bg-[#E6F5F0] px-3 py-1 font-mono text-[12px] font-semibold text-[#00775B]">
                Étape {rotationStep} / 6
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  step: 1,
                  title: "1. Ajout de la nouvelle clé",
                  desc: "L’identifiant est enregistré de manière sécurisée en écriture seule à côté de l’ancien.",
                },
                {
                  step: 2,
                  title: "2. Test de connexion",
                  desc: "Vérification automatique des permissions, des quotas et du fonctionnement de l’adaptateur.",
                },
                {
                  step: 3,
                  title: "3. Validation",
                  desc: "Réauthentification MFA (TOTP) et confirmation explicite du Super Admin.",
                },
                {
                  step: 4,
                  title: "4. Basculement",
                  desc: "La nouvelle clé devient prioritaire pour tous les nouveaux appels et requêtes.",
                },
                {
                  step: 5,
                  title: "5. Surveillance",
                  desc: "Vérification de l’absence d’erreurs HTTP 401/403 après le changement.",
                },
                {
                  step: 6,
                  title: "6. Révocation de l’ancienne clé",
                  desc: "Lorsque la transition est confirmée et que le fournisseur le permet, l’ancien secret est purgé.",
                },
              ].map((item) => {
                const isDone = rotationStep > item.step;
                const isCurrent = rotationStep === item.step;
                return (
                  <div
                    key={item.step}
                    className={`flex items-start gap-3.5 rounded-xl border p-4 transition ${
                      isCurrent
                        ? "border-[#171717] bg-[#F4F8F6]"
                        : isDone
                          ? "border-[#DEF5EC] bg-white"
                          : "border-[#EFEFEF] bg-[#FAFAFA]/70"
                    }`}
                  >
                    <span
                      className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-bold ${
                        isDone
                          ? "bg-[#008F6D] text-white"
                          : isCurrent
                            ? "bg-[#171717] text-white"
                            : "bg-[#E5E5E5] text-[#525252]"
                      }`}
                    >
                      {isDone ? "✓" : item.step}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#171717]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-[#525252]">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Colonne droite (5 col) : Console d'exécution interactive de la rotation */}
          <section className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
            <div>
              <div className="flex items-center gap-3">
                <ProviderLogo nameFallback={rotationProvider} size="md" />
                <div>
                  <h3 className="text-[17px] font-semibold text-[#171717]">
                    Exécution de la rotation
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#737373]">
                    Cible sélectionnée : <strong>{rotationProvider}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Identifiant fournisseur à renouveler
                  </label>
                  <PremiumSelect
                    value={rotationProvider}
                    onChange={(val) => {
                      setRotationProvider(val);
                      setRotationStep(1);
                    }}
                    ariaLabel="Identifiant fournisseur à renouveler"
                    className="mt-1"
                    options={[
                      { value: "ElevenLabs (Production)", label: "ElevenLabs (Production · •••• 8f2a)" },
                      { value: "Twilio (Production)", label: "Twilio (Production · •••• 4b7c)" },
                      { value: "OpenAI (Production)", label: "OpenAI (Production · •••• 3c19)" },
                      { value: "OpenAI (Test)", label: "OpenAI (Test · •••• 9d3e)" },
                      { value: "Stripe (Production)", label: "Stripe (Production · •••• 7a91)" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Nouvelle clé API (Écriture seule · Étape 1)
                  </label>
                  <input
                    type="password"
                    value={rotationNewSecret}
                    onChange={(e) => setRotationNewSecret(e.target.value)}
                    placeholder="Saisissez le nouveau secret fournisseur..."
                    className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 font-mono text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Motif d’audit
                  </label>
                  <input
                    type="text"
                    value={rotationReason}
                    onChange={(e) => setRotationReason(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[13px] text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Code MFA Super Admin (Requis à l’étape 3)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={rotationTotp}
                    onChange={(e) => setRotationTotp(e.target.value)}
                    placeholder="•••••• (ex: 123456)"
                    className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 font-mono text-[14px] tracking-widest text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={handleAdvanceRotation}
                className="h-10 w-full rounded-xl bg-[#171717] text-[13.5px] font-semibold text-white transition hover:bg-[#2E2E2E] cursor-pointer"
              >
                {rotationStep < 6
                  ? `Valider et passer à l’étape ${rotationStep + 1} →`
                  : "Recommencer une nouvelle rotation"}
              </button>
              <p className="text-center text-[11.5px] text-[#737373]">
                Chaque étape est consignée dans le sous-onglet Historique.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          05. SOUS-ONGLET ROUTAGE (Stratégie de continuité & avertissement ElevenLabs ≠ Retell AI)
         ===================================================================== */}
      {activeTab === "routing" && (
        <div className="space-y-6">
          {/* Garde-fou technique : non-interchangeabilité automatique ElevenLabs / Retell AI */}
          <div className="rounded-2xl border border-[#F0C869] bg-[#FFFDF7] p-5 shadow-2xs">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#F0C869] font-mono text-[13px] font-bold text-[#5C3D00]">
                !
              </span>
              <div>
                <h4 className="text-[15px] font-semibold text-[#171717]">
                  Avertissement de continuité : ElevenLabs et Retell AI ne sont pas automatiquement interchangeables
                </h4>
                <p className="mt-1 text-[13px] leading-relaxed text-[#525252]">
                  Un basculement entre fournisseurs vocaux nécessite des configurations compatibles (identifiants de voix, format de streaming audio, outils d’agent) et des tests préalables validés. Le basculement s’applique uniquement aux nouvelles sessions et <strong>ne garantit jamais la reprise à chaud d’un appel téléphonique déjà interrompu</strong>.
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="border-b border-[#EFEFEF] pb-4">
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Règles de routage des fournisseurs (Principal &amp; Secours)
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Critères pris en compte par le moteur de routage : disponibilité, coût, latence p95, qualité audio, marché géographique et capacités vérifiées.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {INITIAL_ROUTING_RULES.map((rule) => (
                <article
                  key={rule.id}
                  className="rounded-2xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-[15.5px] font-semibold text-[#171717]">
                        {rule.capability}
                      </h4>
                      <span className="rounded-md border border-[#E5E5E5] bg-white px-2.5 py-0.5 font-mono text-[11.5px] font-medium text-[#525252]">
                        {rule.market}
                      </span>
                    </div>

                    <span
                      className={`rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                        rule.failoverReady
                          ? "bg-[#DEF5EC] text-[#008064]"
                          : "bg-[#F0C869] text-[#5C3D00]"
                      }`}
                    >
                      {rule.failoverReady
                        ? "✓ Bascule de secours prête"
                        : "Secours bloqué (Test préalable requis)"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 text-[13px]">
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5">
                      <span className="block text-[11.5px] text-[#737373]">
                        1. Fournisseur principal
                      </span>
                      <div className="mt-1.5 flex items-center gap-2">
                        <ProviderLogo id={rule.primaryProviderId} size="sm" />
                        <span className="font-semibold text-[#171717]">
                          {rule.primaryProvider}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5">
                      <span className="block text-[11.5px] text-[#737373]">
                        2. Fournisseur secondaire (Secours)
                      </span>
                      <div className="mt-1.5 flex items-center gap-2">
                        <ProviderLogo id={rule.secondaryProviderId} size="sm" />
                        <span className="font-semibold text-[#525252]">
                          {rule.secondaryProvider}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5">
                      <span className="block text-[11.5px] text-[#737373]">
                        3. Critères d’arbitrage
                      </span>
                      <span className="mt-1.5 block font-mono text-[12px] text-[#171717]">
                        {rule.criteria}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-[12.5px] text-[#525252]">
                    <strong className="font-medium text-[#171717]">Condition technique :</strong>{" "}
                    {rule.compatibilityWarning}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          06. SOUS-ONGLET HISTORIQUE (Journal d'audit des opérations fournisseurs)
         ===================================================================== */}
      {activeTab === "history" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="border-b border-[#EFEFEF] pb-4">
            <h3 className="text-[17px] font-semibold text-[#171717]">
              Activité &amp; Historique des fournisseurs
            </h3>
            <p className="mt-0.5 text-[13.5px] text-[#737373]">
              Traçabilité complète des tests de connexion, alertes de latence, rotations de clés, révisions tarifaires et modifications du routage.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {history.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3.5">
                  <ProviderLogo
                    id={ev.providerId}
                    nameFallback={ev.providerName}
                    size="sm"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[14px] font-semibold text-[#171717]">
                        {ev.title}
                      </p>
                      <span className="rounded bg-[#EFEFEF] px-2 py-0.5 font-mono text-[11.5px] font-semibold text-[#171717]">
                        {ev.providerName}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${
                          ev.outcome === "Succès"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : ev.outcome === "Alerte"
                              ? "bg-[#F0C869] text-[#5C3D00]"
                              : "bg-[#E4EEFE] text-[#1D4ED8]"
                        }`}
                      >
                        {ev.outcome}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-[#525252]">
                      Motif : {ev.reason}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right font-mono text-[12px] text-[#737373] whitespace-nowrap">
                  <p className="font-semibold text-[#171717]">{ev.timestamp}</p>
                  <p>{ev.actor}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          MODALE 1 : NOUVELLE VERSION TARIFAIRE FOURNISSEUR
         ===================================================================== */}
      {rateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              Nouvelle version tarifaire fournisseur
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              L’ancien tarif est conservé en base pour garantir l’exactitude des recalculs de coûts historiques.
            </p>

            <div className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Fournisseur
                  </label>
                  <PremiumSelect
                    value={newRateProvider}
                    onChange={setNewRateProvider}
                    ariaLabel="Fournisseur"
                    className="mt-1"
                    options={[
                      { value: "ElevenLabs", label: "ElevenLabs" },
                      { value: "Twilio", label: "Twilio" },
                      { value: "Acquisition API", label: "Acquisition API" },
                      { value: "Transcription API", label: "Transcription API" },
                      { value: "OpenAI", label: "OpenAI" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Unité de facturation
                  </label>
                  <PremiumSelect
                    value={newRateUnit}
                    onChange={(v) => setNewRateUnit(v as ProviderPricingRecord["unit"])}
                    ariaLabel="Unité de facturation"
                    className="mt-1"
                    options={[
                      { value: "Minute", label: "Minute" },
                      { value: "Contact", label: "Contact" },
                      { value: "1K Tokens", label: "1K Tokens" },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Devise
                  </label>
                  <PremiumSelect
                    value={newRateCurrency}
                    onChange={(v) => setNewRateCurrency(v as ProviderPricingRecord["currency"])}
                    ariaLabel="Devise"
                    className="mt-1"
                    options={[
                      { value: "USD ($)", label: "USD ($)" },
                      { value: "EUR (€)", label: "EUR (€)" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Ancien tarif
                  </label>
                  <input
                    type="text"
                    value={newRateOld}
                    onChange={(e) => setNewRateOld(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[13.5px] text-[#737373] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Nouveau tarif
                  </label>
                  <input
                    type="text"
                    value={newRateValue}
                    onChange={(e) => setNewRateValue(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[13.5px] font-semibold text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Date d’entrée en vigueur
                </label>
                <input
                  type="text"
                  value={newRateDate}
                  onChange={(e) => setNewRateDate(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Conditions contractuelles
                </label>
                <input
                  type="text"
                  value={newRateConditions}
                  onChange={(e) => setNewRateConditions(e.target.value)}
                  placeholder="Ex: Nouveau palier volume Q1 · Facturation à la seconde"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => setRateModalOpen(false)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveNewRateVersion}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Versionner le tarif
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALE 2 : CONFIGURATION D'UNE CLÉ API EN ÉCRITURE SEULE
         ===================================================================== */}
      {writeKeyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              Enregistrer une clé API (Écriture seule)
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              Une fois scellée, seuls les 4 derniers caractères seront visibles. La clé complète ne pourra jamais être affichée ni téléchargée.
            </p>

            <div className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Fournisseur
                  </label>
                  <PremiumSelect
                    value={writeKeyProvider}
                    onChange={(v) => setWriteKeyProvider(v as ProviderId)}
                    ariaLabel="Fournisseur"
                    className="mt-1"
                    options={[
                      { value: "elevenlabs", label: "ElevenLabs" },
                      { value: "twilio", label: "Twilio" },
                      { value: "openai", label: "OpenAI" },
                      { value: "retell", label: "Retell AI" },
                      { value: "stripe", label: "Stripe" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Environnement isolé
                  </label>
                  <PremiumSelect
                    value={writeKeyEnv}
                    onChange={(v) => setWriteKeyEnv(v as "Production" | "Test")}
                    ariaLabel="Environnement"
                    className="mt-1"
                    options={[
                      { value: "Production", label: "Production" },
                      { value: "Test", label: "Test (Bac à sable)" },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Clé secrète du fournisseur (chiffrée immédiatement)
                </label>
                <input
                  type="password"
                  value={writeKeySecret}
                  onChange={(e) => setWriteKeySecret(e.target.value)}
                  placeholder="sk-proj-••••••••••••••••••••••••"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Code MFA Super Admin (6 chiffres)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={writeKeyTotp}
                  onChange={(e) => setWriteKeyTotp(e.target.value)}
                  placeholder="••••••"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[14px] tracking-widest text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              {writeKeyError && (
                <p className="rounded-lg bg-[#FCE7EB] px-3 py-2 text-[12.5px] font-medium text-[#B91C1C]">
                  {writeKeyError}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => {
                  setWriteKeySecret("");
                  setWriteKeyModalOpen(false);
                }}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveWriteOnlyKey}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Sceller la clé en écriture seule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

