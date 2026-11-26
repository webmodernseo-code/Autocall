"use client";

import Link from "next/link";
import { useState } from "react";
import { GmailBrandSvg, WhatsAppBrandSvg } from "./brand-icons";
import { CampaignResults, CampaignSequences, CampaignTemplates } from "./campaign-tools";
import { PremiumCheckbox } from "./premium-checkbox";
import { PremiumSelect } from "./premium-select";
import { type Locale, SolarIcon } from "./workspace-navigation";

type ChannelMode = "phone" | "whatsapp" | "email";
type CampaignInspectorTab = "results" | "structure" | "whatsapp";
const workspaceTabs = [
  { id: "prospecting", label: "Prospection" },
  { id: "sequences", label: "Séquences" },
  { id: "templates", label: "Modèles de communication" },
  { id: "results", label: "Résultats" },
] as const;

interface WaMessage {
  id: string;
  from: "prospect" | "ai" | "human";
  text: string;
  time: string;
}

interface WaThread {
  id: string;
  name: string;
  initials: string;
  color: string;
  company: string;
  email: string;
  phone: string;
  status: "Lu" | "Répondu" | "RDV pris" | "En attente";
  priority: "Haute" | "Normale";
  time: string;
  preview: string;
  messages: WaMessage[];
}

interface SequenceStep {
  id: string;
  day: string;
  title: string;
  detail: string;
  condition: string;
}

interface AutoCampaign {
  id: string;
  title: string;
  file: string;
  channel: ChannelMode;
  progress: number;
  planned: number;
  done: number;
  remaining: number;
  totalCalls: number;
  status: "En cours" | "Terminée" | "En pause" | "Brouillon";
  enabled: boolean;
  steps: SequenceStep[];
  draftPlan?: { budget: number; startDate: string; dailyLimit: number };
  whatsappStats?: { sent: number; delivered: number; readRate: string; replyRate: string };
  emailStats?: { sent: number; openRate: string; clickRate: string; replyRate: string };
}

const INITIAL_WA_THREADS: WaThread[] = [
  {
    id: "wa-1",
    name: "Marc Vallet",
    initials: "MV",
    color: "#E0F2FE",
    company: "Nettoyage Pro Lyon",
    email: "m.vallet@nettoyagepro-lyon.fr",
    phone: "+33 6 42 19 88 02",
    status: "Répondu",
    priority: "Haute",
    time: "09:36",
    preview: "Bonjour, nous avons bien reçu votre message pour nos 3 agences...",
    messages: [
      {
        id: "m1",
        from: "prospect",
        text: "Bonjour, nous avons bien reçu votre message WhatsApp. Est-il possible d’avoir un chiffrage pour nos 3 agences ?",
        time: "09:34",
      },
      {
        id: "m2",
        from: "ai",
        text: "Bonjour Marc, avec plaisir. Pour 3 agences, notre forfait Multi-sites est à 1 190 €/mois avec intégration CRM incluse.",
        time: "09:35",
      },
      {
        id: "m3",
        from: "ai",
        text: "Je vous propose une démonstration en direct demain à 10:00. Cela vous convient-il ?",
        time: "09:36",
      },
    ],
  },
  {
    id: "wa-2",
    name: "Luc Blanchard",
    initials: "LB",
    color: "#FEF3C7",
    company: "Transports Blanchard SAS",
    email: "l.blanchard@trans-blanchard.fr",
    phone: "+33 6 11 90 45 12",
    status: "RDV pris",
    priority: "Haute",
    time: "09:14",
    preview: "Parfait pour jeudi 14h, merci pour le lien Google Meet.",
    messages: [
      {
        id: "m21",
        from: "prospect",
        text: "Parfait pour jeudi 14h, merci pour le lien Google Meet.",
        time: "09:14",
      },
    ],
  },
  {
    id: "wa-3",
    name: "Sophie Martin",
    initials: "SM",
    color: "#F3E8FF",
    company: "Cabinet Nexa Lyon",
    email: "s.martin@nexa-avocats.fr",
    phone: "+33 4 78 22 10 00",
    status: "Lu",
    priority: "Normale",
    time: "Hier",
    preview: "Pouvez-vous me confirmer la conformité RGPD et l’hébergement UE ?",
    messages: [
      {
        id: "m31",
        from: "prospect",
        text: "Pouvez-vous me confirmer la conformité RGPD et l’hébergement des données en Europe ?",
        time: "Hier · 17:10",
      },
    ],
  },
];

const CALL_OUTCOMES = [
  { label: "Appels réussis", color: "#4ADE80", share: 32 },
  { label: "Faux numéro", color: "#A855F7", share: 8 },
  { label: "Sans réponse", color: "#F43F5E", share: 10 },
  { label: "Hors zone", color: "#6366F1", share: 7 },
  { label: "Ligne occupée", color: "#FB923C", share: 7 },
  { label: "Téléphone éteint", color: "#3B82F6", share: 8 },
  { label: "À rappeler", color: "#FACC15", share: 12 },
  { label: "Messagerie vocale", color: "#22D3EE", share: 7 },
  { label: "Numéro absent", color: "#EC4899", share: 5 },
  { label: "RGPD", color: "#34D399", share: 4 },
];

const INITIAL_CAMPAIGNS: AutoCampaign[] = [
  {
    id: "camp-1",
    title: "Campagne #1 — Lyon Propreté B2B",
    file: "campagne_lyon_proprete.csv",
    channel: "phone",
    progress: 17,
    planned: 1230,
    done: 214,
    remaining: 1016,
    totalCalls: 247,
    status: "En cours",
    enabled: true,
    steps: [
      {
        id: "s1",
        day: "Jour 1 · 09:30",
        title: "Appel vocal IA (Agent Thomas)",
        detail: "Accroche B2B multi-sites + proposition d’audit propreté offert.",
        condition: "Si sans réponse → Tentative 2",
      },
      {
        id: "s2",
        day: "Jour 2 · 14:30",
        title: "Rappel automatique (Agent Thomas)",
        detail: "Dépôt de message vocal personnalisé si messagerie.",
        condition: "Si décroché → Qualification BANT",
      },
      {
        id: "s3",
        day: "Jour 4 · 10:30",
        title: "Relance finale (Agent Emma)",
        detail: "Dernier appel de prise de rendez-vous avant clôture.",
        condition: "Fin de séquence",
      },
    ],
  },
  {
    id: "camp-2",
    title: "Campagne #2 — Relance Devis WhatsApp",
    file: "relance_devis_q1.csv",
    channel: "whatsapp",
    progress: 68,
    planned: 640,
    done: 435,
    remaining: 205,
    totalCalls: 0,
    status: "En cours",
    enabled: true,
    steps: [
      {
        id: "s21",
        day: "Jour 1 · 10:00",
        title: "Message WhatsApp d’ouverture",
        detail: "Rappel convivial du devis envoyé avec lien de validation directe.",
        condition: "Si non lu après 24 h → Relance 2",
      },
      {
        id: "s22",
        day: "Jour 3 · 11:00",
        title: "Relance WhatsApp avec créneau démo",
        detail: "Proposition de deux créneaux de démonstration en direct.",
        condition: "Si réponse → Prise en charge IA en direct",
      },
    ],
    whatsappStats: { sent: 435, delivered: 428, readRate: "88 %", replyRate: "36 %" },
  },
  {
    id: "camp-3",
    title: "Campagne #3 — Prospection Email Facility",
    file: "facility_idf_2025.csv",
    channel: "email",
    progress: 42,
    planned: 450,
    done: 189,
    remaining: 261,
    totalCalls: 0,
    status: "En pause",
    enabled: false,
    steps: [
      {
        id: "s31",
        day: "Jour 1 · 08:45",
        title: "Email d’introduction & étude de cas",
        detail: "Présentation des gains sur l’accueil téléphonique B2B.",
        condition: "Si non ouvert sous 48 h → Relance 2",
      },
      {
        id: "s32",
        day: "Jour 4 · 09:15",
        title: "Email comparatif & lien agenda",
        detail: "Comparatif ROI et invitation à un audit de 15 minutes.",
        condition: "Fin de séquence",
      },
    ],
    emailStats: { sent: 189, openRate: "61 %", clickRate: "22 %", replyRate: "13 %" },
  },
];

function ChannelPill({ mode }: { mode: ChannelMode }) {
  if (mode === "phone") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-0.5 text-[12px] font-medium text-[#1D4ED8]">
        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Appel téléphonique
      </span>
    );
  }
  if (mode === "whatsapp") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#86EFAC] bg-[#F0FDF4] px-2.5 py-0.5 text-[12px] font-medium text-[#15803D]">
        <WhatsAppBrandSvg className="size-5 shrink-0" />
        WhatsApp Business
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-0.5 text-[12px] font-medium text-[#DC2626]">
      <GmailBrandSvg className="size-5 shrink-0" />
      Email
    </span>
  );
}

export function CampaignsView({ locale, initialAudience, onConsumeAudience }: { locale: Locale; initialAudience?: string; onConsumeAudience?: () => void }) {
  const [workspaceTab, setWorkspaceTab] = useState<(typeof workspaceTabs)[number]["id"]>("prospecting");
  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaigns, setCampaigns] = useState<AutoCampaign[]>(INITIAL_CAMPAIGNS);
  const [expandedId, setExpandedId] = useState<string>("camp-2");
  const [inspectorTab, setInspectorTab] = useState<CampaignInspectorTab>("structure");
  const [hoveredOutcome, setHoveredOutcome] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [newModalOpen, setNewModalOpen] = useState(Boolean(initialAudience));
  const [newTitle, setNewTitle] = useState("");
  const [newFile, setNewFile] = useState(initialAudience ? "CRM · " + initialAudience : "prospects_b2b_mars.csv");
  const [newMode, setNewMode] = useState<ChannelMode>("whatsapp");
  const [newPlanned, setNewPlanned] = useState(initialAudience ? "1" : "500");
  const [draftBudget, setDraftBudget] = useState("100");
  const [draftDate, setDraftDate] = useState("");
  const [draftDailyLimit, setDraftDailyLimit] = useState("50");
  const [checkLegalBasis, setCheckLegalBasis] = useState(false);
  const [checkOptOuts, setCheckOptOuts] = useState(false);
  const [checkAiTransparency, setCheckAiTransparency] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [waConnected, setWaConnected] = useState(true);
  const [waThreads, setWaThreads] = useState<WaThread[]>(INITIAL_WA_THREADS);
  const [selectedWaId, setSelectedWaId] = useState<string>("wa-1");
  const [waSearch, setWaSearch] = useState("");
  const [waReply, setWaReply] = useState("");

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const toggleEnabled = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id && c.status !== "Brouillon" && c.status !== "Terminée"
          ? {
            ...c,
            enabled: !c.enabled,
            status: !c.enabled ? "En cours" : c.progress === 100 ? "Terminée" : "En pause",
          }
          : c
      )
    );
  };

  const handleSelectCampaign = (camp: AutoCampaign) => {
    if (expandedId === camp.id) {
      setExpandedId("");
      return;
    }
    setExpandedId(camp.id);
    if (inspectorTab === "whatsapp" && camp.channel !== "whatsapp") {
      setInspectorTab("structure");
    }
  };

  const handleAddStep = (campId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== campId) return c;
        const stepNum = c.steps.length + 1;
        const newStep: SequenceStep = {
          id: `s-${Date.now()}`,
          day: `Jour ${stepNum * 2} · 10:00`,
          title:
            c.channel === "phone"
              ? "Relance téléphonique IA"
              : c.channel === "whatsapp"
                ? "Relance WhatsApp personnalisée"
                : "Email de suivi & documentation",
          detail: "Étape ajoutée à la séquence automatisée.",
          condition: "Suivi automatique selon réponse",
        };
        return { ...c, steps: [...c.steps, newStep] };
      })
    );
    notify("Étape ajoutée à la structure");
  };

  const allComplianceChecked =
    checkLegalBasis && checkOptOuts && checkAiTransparency;
  const draftNumbersValid =
    Number.isSafeInteger(Number(newPlanned)) && Number(newPlanned) > 0 &&
    Number.isSafeInteger(Number(draftDailyLimit)) && Number(draftDailyLimit) > 0 &&
    draftBudget.trim() !== "" && Number.isFinite(Number(draftBudget)) && Number(draftBudget) >= 0;

  const handleAddCampaign = () => {
    const planned = Number(newPlanned);
    if (!newTitle.trim() || !allComplianceChecked || !draftNumbersValid) return;
    const created: AutoCampaign = {
      id: `camp-${Date.now()}`,
      title: newTitle.trim(),
      file: newFile.trim() || "liste_contacts.csv",
      channel: newMode,
      progress: 0,
      planned,
      done: 0,
      remaining: planned,
      totalCalls: 0,
      status: "Brouillon",
      enabled: false,
      draftPlan: { budget: Number(draftBudget), startDate: draftDate, dailyLimit: Number(draftDailyLimit) },
      steps: [
        {
          id: `s-${Date.now()}`,
          day: "Jour 1 · 09:30",
          title:
            newMode === "phone"
              ? "Premier appel IA"
              : newMode === "whatsapp"
                ? "Premier message WhatsApp"
                : "Premier email personnalisé",
          detail: "Étape prévue pour l’audience de démonstration.",
          condition: "Suivi selon engagement",
        },
      ],
      whatsappStats:
        newMode === "whatsapp"
          ? { sent: 0, delivered: 0, readRate: "0 %", replyRate: "0 %" }
          : undefined,
      emailStats:
        newMode === "email"
          ? { sent: 0, openRate: "0 %", clickRate: "0 %", replyRate: "0 %" }
          : undefined,
    };
    setCampaigns((prev) => [created, ...prev]);
    setExpandedId(created.id);
    setInspectorTab("structure");
    setStatusFilter("all");
    setChannelFilter("all");
    setCampaignSearch("");
    setNewTitle("");
    setCheckLegalBasis(false);
    setCheckOptOuts(false);
    setCheckAiTransparency(false);
    setNewModalOpen(false);
    onConsumeAudience?.();
    notify("Campagne enregistrée en brouillon");
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchChannel = channelFilter === "all" || c.channel === channelFilter;
    return matchStatus && matchChannel && (c.title + " " + c.file).toLowerCase().includes(campaignSearch.trim().toLowerCase());
  });

  // Donut calculation
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const outcomeSegments = CALL_OUTCOMES.reduce<
    { label: string; color: string; share: number; length: number; offset: number }[]
  >((acc, item) => {
    const prevSum = acc.reduce((sum, seg) => sum + seg.share, 0);
    const length = (item.share / 100) * circumference;
    const offset = -(prevSum / 100) * circumference;
    acc.push({ ...item, length, offset });
    return acc;
  }, []);

  const title =
    locale === "fr" ? "Campagnes" : locale === "es" ? "Campañas" : "Campaigns";
  const subtitle =
    locale === "fr"
      ? "Préparez vos campagnes et consultez les résultats de démonstration par canal."
      : locale === "es"
        ? "Cada campaña opera en un canal dedicado (Llamada, WhatsApp Business o Email) con su estructura y resultados en vivo."
        : "Each campaign runs on a dedicated channel (Phone Call, WhatsApp Business, or Email) with its own sequence and live results.";

  return (
    <div className="w-full min-w-0 space-y-5 px-4 py-6 sm:px-7">
      <div role="tablist" aria-label="Sections Campagnes" className="flex flex-nowrap gap-6 overflow-x-auto border-b border-[var(--border)]">
        {workspaceTabs.map((tab) => (
          <button key={tab.id} type="button" role="tab" aria-selected={workspaceTab === tab.id} onClick={() => setWorkspaceTab(tab.id)} className="shrink-0 whitespace-nowrap border-b-2 border-transparent pb-3 text-sm aria-selected:border-[var(--foreground)] aria-selected:font-semibold">{tab.label}</button>
        ))}
      </div>
      <div hidden={workspaceTab !== "sequences"}><CampaignSequences /></div>
      <div hidden={workspaceTab !== "templates"}><CampaignTemplates /></div>
      <div hidden={workspaceTab !== "results"}><CampaignResults campaigns={campaigns} /></div>
      <div hidden={workspaceTab !== "prospecting"} className="space-y-5">
      {toast && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#B8E6D6] bg-[#FFFFFF] px-4 py-3 text-[14px] font-medium text-[#171717] shadow-lg">
          <span className="size-2 rounded-full bg-[#00B489]" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[24px] leading-[32px] font-semibold tracking-[-0.025em] text-[#171717]">
            {title}
          </h2>
          <p className="mt-1 text-[14px] leading-[21px] text-[#525252]">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <PremiumSelect
            value={channelFilter}
            onChange={setChannelFilter}
            ariaLabel="Filtrer par canal"
            className="min-w-[175px]"
            options={[
              { value: "all", label: "Tous les canaux" },
              { value: "phone", label: "Appel téléphonique" },
              { value: "whatsapp", label: "WhatsApp Business" },
              { value: "email", label: "Email" },
            ]}
          />
          <PremiumSelect
            value={statusFilter}
            onChange={setStatusFilter}
            ariaLabel="Filtrer les campagnes"
            className="min-w-[160px]"
            options={[
              { value: "all", label: "Tous les statuts" },
              { value: "En cours", label: "En cours" },
              { value: "Terminée", label: "Terminées" },
              { value: "En pause", label: "En pause" },
              { value: "Brouillon", label: "Brouillons" },
            ]}
          />
          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="inline-flex h-[38px] items-center gap-1.5 rounded-[8px] bg-[#008F6D] px-4 text-[13.5px] font-medium text-white transition hover:bg-[#00775B] cursor-pointer"
          >
            + Ajouter une campagne
          </button>
        </div>
      </div>

      {/* 4 KPI cards double-surface */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
          <div className="rounded-lg bg-[#E6F7F0] px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#6EE7B7] bg-[#FFFFFF] text-[#008F6D] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                <SolarIcon name="campaigns" className="size-4.5" />
              </span>
              <span className="text-[13.5px] font-medium text-[#525252]">
                Campagnes actives
              </span>
            </div>
            <p className="mt-2 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
              {campaigns.filter((c) => c.enabled).length}
            </p>
          </div>
          <div className="flex items-center justify-between px-3 pt-2 pb-0.5 text-[12.5px]">
            <span className="rounded-full bg-[#D1FAE5] px-2 py-0.5 font-medium text-[#00775B]">
              En cours
            </span>
            <span className="text-[#737373]">{campaigns.length} au total</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
          <div className="rounded-lg bg-[#EAF2FF] px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#93C5FD] bg-[#FFFFFF] text-[#2563EB] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                <SolarIcon name="phone" className="size-4.5" />
              </span>
              <span className="text-[13.5px] font-medium text-[#525252]">
                Contacts ciblés
              </span>
            </div>
            <p className="mt-2 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
              {campaigns.reduce((acc, c) => acc + c.planned, 0).toLocaleString("fr-FR")}
            </p>
          </div>
          <div className="flex items-center justify-between px-3 pt-2 pb-0.5 text-[12.5px]">
            <span className="rounded-full bg-[#DBEAFE] px-2 py-0.5 font-medium text-[#1D4ED8]">
              Listes CSV
            </span>
            <span className="text-[#737373]">3 canaux</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
          <div className="rounded-lg bg-[#FEF5DC] px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#FCD34D] bg-[#FFFFFF] text-[#D97706] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                <SolarIcon name="mail" className="size-4.5" />
              </span>
              <span className="text-[13.5px] font-medium text-[#525252]">
                Actions exécutées
              </span>
            </div>
            <p className="mt-2 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
              {campaigns.reduce((acc, c) => acc + c.done, 0).toLocaleString("fr-FR")}
            </p>
          </div>
          <div className="flex items-center justify-between px-3 pt-2 pb-0.5 text-[12.5px]">
            <span className="rounded-full bg-[#FEF0C7] px-2 py-0.5 font-medium text-[#B45309]">
              +24 % ce mois
            </span>
            <span className="text-[#737373]">Appels / WA / Email</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
          <div className="rounded-lg bg-[#F5F5F5] px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] text-[#171717] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                <SolarIcon name="agents" className="size-4.5" />
              </span>
              <span className="text-[13.5px] font-medium text-[#525252]">
                RDV générés
              </span>
            </div>
            <p className="mt-2 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
              68
            </p>
          </div>
          <div className="flex items-center justify-between px-3 pt-2 pb-0.5 text-[12.5px]">
            <span className="rounded-full bg-[#E6F5F0] px-2 py-0.5 font-medium text-[#00775B]">
              +19 % conv.
            </span>
            <span className="text-[#737373]">Synchro CRM</span>
          </div>
        </div>
      </div>

      <input type="search" placeholder="Rechercher une campagne" aria-label="Rechercher une campagne" value={campaignSearch} onChange={(event) => setCampaignSearch(event.target.value)} className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm" />
      {/* Expandable Campaigns List */}
      <div className="space-y-3">
        {filteredCampaigns.map((camp) => {
          const isExpanded = expandedId === camp.id;
          return (
            <div
              key={camp.id}
              className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-2xs"
            >
              {/* Campaign Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectCampaign(camp)}
                    className="text-left text-[14.5px] font-semibold text-[#171717] hover:text-[#008F6D] cursor-pointer"
                  >
                    {camp.title}
                  </button>
                  <ChannelPill mode={camp.channel} />
                  <span className="text-[13px] text-[#737373]">
                    {camp.steps.length} étape{camp.steps.length > 1 ? "s" : ""} ·{" "}
                    <strong className="font-medium text-[#008F6D]">{camp.file}</strong>
                  </span>
                  {camp.draftPlan && (
                    <span className="text-[13px] text-[#525252]">
                      {camp.draftPlan.dailyLimit} contacts/jour · {camp.draftPlan.budget.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                      {camp.draftPlan.startDate && " · " + camp.draftPlan.startDate.split("-").reverse().join("/")}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-[#171717] tabular-nums">
                      {camp.progress} %
                    </span>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#EFEFEF]">
                      <div
                        className="h-full rounded-full bg-[#008F6D]"
                        style={{ width: `${camp.progress}%` }}
                      />
                    </div>
                  </div>

                  <span
                    className={`rounded-md px-2.5 py-0.5 text-[12px] font-semibold ${camp.status === "En cours"
                      ? "bg-[#E6F5F0] text-[#00775B]"
                      : camp.status === "Terminée"
                        ? "bg-[#F3F4F6] text-[#525252]"
                        : "bg-[#FEF6E6] text-[#9A6700]"
                      }`}
                  >
                    {camp.status}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={camp.enabled}
                    onClick={() => toggleEnabled(camp.id)}
                    disabled={camp.status === "Brouillon" || camp.status === "Terminée"}
                    className={`relative inline-flex h-5.5 w-10 shrink-0 items-center rounded-full transition-colors cursor-pointer ${camp.enabled ? "bg-[#00B489]" : "bg-[#D4D4D4]"
                      }`}
                  >
                    <span
                      className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${camp.enabled ? "translate-x-5" : "translate-x-1"
                        }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectCampaign(camp)}
                    aria-label="Afficher la structure et les résultats"
                    className="inline-flex size-7 items-center justify-center rounded-md text-[#737373] hover:bg-[#F5F5F5] cursor-pointer"
                  >
                    <SolarIcon
                      name="chevronDown"
                      className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                </div>
              </div>

              {/* Expanded Inspector */}
              {isExpanded && (
                <div className="border-t border-[#EFEFEF] bg-[#FCFCFC]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] bg-[#FFFFFF] px-5 pt-2.5">
                    <div className="flex items-center gap-6 text-[14px]">
                      <button
                        type="button"
                        onClick={() => setInspectorTab("structure")}
                        className={`relative pb-2.5 transition-colors cursor-pointer ${inspectorTab === "structure"
                          ? "font-semibold text-[#171717]"
                          : "text-[#737373] hover:text-[#171717]"
                          }`}
                      >
                        Structure de la séquence ({camp.steps.length})
                        {inspectorTab === "structure" && (
                          <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#008F6D]" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setInspectorTab("results")}
                        className={`relative pb-2.5 transition-colors cursor-pointer ${inspectorTab === "results"
                          ? "font-semibold text-[#171717]"
                          : "text-[#737373] hover:text-[#171717]"
                          }`}
                      >
                        Résultats
                        {inspectorTab === "results" && (
                          <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#008F6D]" />
                        )}
                      </button>
                      {camp.channel === "whatsapp" && (
                        <button
                          type="button"
                          onClick={() => setInspectorTab("whatsapp")}
                          className={`relative flex items-center gap-1.5 pb-2.5 transition-colors cursor-pointer ${inspectorTab === "whatsapp"
                            ? "font-semibold text-[#171717]"
                            : "text-[#737373] hover:text-[#171717]"
                            }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${waConnected ? "bg-[#22C55E]" : "bg-[#A3A3A3]"
                              }`}
                          />
                          WhatsApp Business (En direct)
                          {inspectorTab === "whatsapp" && (
                            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#008F6D]" />
                          )}
                        </button>
                      )}
                    </div>

                    {inspectorTab === "structure" && (
                      <button
                        type="button"
                        onClick={() => handleAddStep(camp.id)}
                        className="mb-2 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 py-1 text-[12.5px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                      >
                        + Ajouter une étape
                      </button>
                    )}
                  </div>

                  {/* TAB STRUCTURE */}
                  {inspectorTab === "structure" && (
                    <div className="p-5">
                      <div className="space-y-3">
                        {camp.steps.map((step, idx) => (
                          <div key={step.id} className="relative flex gap-3.5">
                            {idx < camp.steps.length - 1 && (
                              <span
                                aria-hidden="true"
                                className="absolute top-8 bottom-[-14px] left-[13px] w-px bg-[#E5E5E5]"
                              />
                            )}
                            <span className="relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-[12.5px] font-semibold text-[#171717] shadow-2xs">
                              {idx + 1}
                            </span>
                            <div className="flex flex-1 flex-col justify-between gap-2 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-3.5 sm:flex-row sm:items-center">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <ChannelPill mode={camp.channel} />
                                  <span className="text-[12.5px] font-medium text-[#737373]">
                                    {step.day}
                                  </span>
                                </div>
                                <p className="mt-1.5 text-[13.5px] font-semibold text-[#171717]">
                                  {step.title}
                                </p>
                                <p className="mt-0.5 text-[13px] text-[#525252]">
                                  {step.detail}
                                </p>
                              </div>
                              <span className="shrink-0 rounded-lg border border-[#EFEFEF] bg-[#FAFAFA] px-2.5 py-1 text-[12px] font-medium text-[#525252]">
                                {step.condition}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB RÉSULTATS (adapté au canal unique de la campagne) */}
                  {inspectorTab === "results" && (
                    <div className="p-5">
                      {camp.channel === "phone" && (
                        <div className="grid grid-cols-1 items-center gap-6 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 lg:grid-cols-12">
                          <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4 lg:col-span-3">
                            <p className="text-[13px] text-[#737373]">Appels planifiés :</p>
                            <p className="mt-1 text-[26px] font-bold tracking-tight text-[#171717] tabular-nums">
                              {camp.planned.toLocaleString("fr-FR")}
                            </p>
                            <div className="mt-3 flex items-center gap-2.5">
                              <span className="text-[14px] font-semibold text-[#171717] tabular-nums">
                                {camp.progress} %
                              </span>
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EFEFEF]">
                                <div
                                  className="h-full rounded-full bg-[#008F6D]"
                                  style={{ width: `${camp.progress}%` }}
                                />
                              </div>
                            </div>
                            <div className="mt-4 space-y-1.5 border-t border-[#EFEFEF] pt-3 text-[13px]">
                              <div className="flex items-center justify-between">
                                <span className="text-[#737373]">Effectués</span>
                                <span className="font-semibold text-[#171717] tabular-nums">
                                  {camp.done}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[#737373]">Restants</span>
                                <span className="font-semibold text-[#171717] tabular-nums">
                                  {camp.remaining}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-6 gap-y-2 lg:col-span-5">
                            {CALL_OUTCOMES.map((out) => (
                              <div
                                key={out.label}
                                onMouseEnter={() => setHoveredOutcome(out.label)}
                                onMouseLeave={() => setHoveredOutcome(null)}
                                className={`flex items-center justify-between rounded-lg px-2 py-1 text-[13.5px] transition ${hoveredOutcome === out.label ? "bg-[#F8F8F8]" : ""
                                  }`}
                              >
                                <span className="inline-flex items-center gap-2 text-[#404040]">
                                  <span
                                    className="size-2.5 shrink-0 rounded-sm"
                                    style={{ backgroundColor: out.color }}
                                  />
                                  <span className="truncate">{out.label}</span>
                                </span>
                                <span className="text-[12.5px] font-medium text-[#737373] tabular-nums">
                                  {out.share} %
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col items-center justify-center lg:col-span-4">
                            <div className="relative flex size-40 items-center justify-center">
                              <svg
                                viewBox="0 0 150 150"
                                className="size-40 -rotate-90"
                                role="img"
                                aria-label="Répartition des appels"
                              >
                                {outcomeSegments.map((seg) => (
                                  <circle
                                    key={seg.label}
                                    cx="75"
                                    cy="75"
                                    r={radius}
                                    fill="none"
                                    stroke={seg.color}
                                    strokeWidth={hoveredOutcome === seg.label ? 20 : 16}
                                    strokeDasharray={`${seg.length} ${circumference}`}
                                    strokeDashoffset={seg.offset}
                                    className="transition-all duration-150"
                                  />
                                ))}
                              </svg>
                              <div className="absolute text-center">
                                <p className="text-[18px] font-bold text-[#171717] tabular-nums">
                                  {camp.totalCalls}
                                </p>
                                <p className="text-[12px] text-[#737373]">appels</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {camp.channel === "whatsapp" && (
                        <div className="rounded-xl border border-[#86EFAC] bg-[#FFFFFF] p-5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <ChannelPill mode="whatsapp" />
                            <button
                              type="button"
                              onClick={() => setInspectorTab("whatsapp")}
                              className="text-[13px] font-medium text-[#008F6D] hover:underline cursor-pointer"
                            >
                              Ouvrir les conversations en direct →
                            </button>
                          </div>
                          <div className="mt-4 grid grid-cols-1 gap-3 text-center sm:grid-cols-4">
                            <div className="rounded-lg bg-[#F0FDF4] p-3">
                              <p className="text-[20px] font-bold text-[#171717] tabular-nums">
                                {camp.whatsappStats?.sent ?? camp.done}
                              </p>
                              <p className="text-[12.5px] text-[#737373]">Messages envoyés</p>
                            </div>
                            <div className="rounded-lg bg-[#F0FDF4] p-3">
                              <p className="text-[20px] font-bold text-[#171717] tabular-nums">
                                {camp.whatsappStats?.delivered ?? camp.done}
                              </p>
                              <p className="text-[12.5px] text-[#737373]">Délivrés</p>
                            </div>
                            <div className="rounded-lg bg-[#F0FDF4] p-3">
                              <p className="text-[20px] font-bold text-[#15803D] tabular-nums">
                                {camp.whatsappStats?.readRate ?? "88 %"}
                              </p>
                              <p className="text-[12.5px] text-[#737373]">Taux de lecture</p>
                            </div>
                            <div className="rounded-lg bg-[#F0FDF4] p-3">
                              <p className="text-[20px] font-bold text-[#171717] tabular-nums">
                                {camp.whatsappStats?.replyRate ?? "36 %"}
                              </p>
                              <p className="text-[12.5px] text-[#737373]">Taux de réponse</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {camp.channel === "email" && (
                        <div className="rounded-xl border border-[#FECACA] bg-[#FFFFFF] p-5">
                          <div className="flex items-center justify-between">
                            <ChannelPill mode="email" />
                            <span className="text-[13px] font-medium text-[#DC2626]">
                              Délivrabilité 99,2 %
                            </span>
                          </div>
                          <div className="mt-4 grid grid-cols-1 gap-3 text-center sm:grid-cols-4">
                            <div className="rounded-lg bg-[#FEF2F2] p-3">
                              <p className="text-[20px] font-bold text-[#171717] tabular-nums">
                                {camp.emailStats?.sent ?? camp.done}
                              </p>
                              <p className="text-[12.5px] text-[#737373]">Emails envoyés</p>
                            </div>
                            <div className="rounded-lg bg-[#FEF2F2] p-3">
                              <p className="text-[20px] font-bold text-[#DC2626] tabular-nums">
                                {camp.emailStats?.openRate ?? "61 %"}
                              </p>
                              <p className="text-[12.5px] text-[#737373]">Taux d’ouverture</p>
                            </div>
                            <div className="rounded-lg bg-[#FEF2F2] p-3">
                              <p className="text-[20px] font-bold text-[#171717] tabular-nums">
                                {camp.emailStats?.clickRate ?? "22 %"}
                              </p>
                              <p className="text-[12.5px] text-[#737373]">Taux de clic</p>
                            </div>
                            <div className="rounded-lg bg-[#FEF2F2] p-3">
                              <p className="text-[20px] font-bold text-[#171717] tabular-nums">
                                {camp.emailStats?.replyRate ?? "13 %"}
                              </p>
                              <p className="text-[12.5px] text-[#737373]">Réponses</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB WHATSAPP BUSINESS EN DIRECT (uniquement pour campagnes WhatsApp) */}
                  {inspectorTab === "whatsapp" && camp.channel === "whatsapp" && (
                    <div className="p-4">
                      {!waConnected ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#86EFAC] bg-[#F0FDF4] p-8 text-center">
                          <ChannelPill mode="whatsapp" />
                          <h4 className="mt-3 text-[15px] font-semibold text-[#171717]">
                            Connecter WhatsApp Business API
                          </h4>
                          <p className="mt-1 max-w-md text-[13.5px] text-[#525252]">
                            Reliez votre numéro officiel WhatsApp Business pour suivre et répondre en direct aux conversations de cette campagne.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setWaConnected(true);
                              notify("Compte WhatsApp fictif sélectionné");
                            }}
                            className="mt-4 h-9 rounded-lg bg-[#00B489] px-4 text-[14px] font-medium text-white hover:bg-[#009E78] cursor-pointer"
                          >
                            Connecter WhatsApp Business
                          </button>
                        </div>
                      ) : (
                        (() => {
                          const activeThread =
                            waThreads.find((th) => th.id === selectedWaId) ?? waThreads[0];
                          const filteredThreads = waThreads.filter((th) => {
                            const q = waSearch.trim().toLowerCase();
                            return (
                              !q ||
                              th.name.toLowerCase().includes(q) ||
                              th.company.toLowerCase().includes(q)
                            );
                          });
                          return (
                            <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] lg:grid-cols-[270px_minmax(0,1fr)_240px]">
                              <div className="border-b border-[#E5E5E5] bg-[#FCFCFC] lg:border-r lg:border-b-0">
                                <div className="border-b border-[#EFEFEF] p-3">
                                  <input
                                    type="search"
                                    value={waSearch}
                                    onChange={(e) => setWaSearch(e.target.value)}
                                    placeholder="Rechercher un prospect..."
                                    className="h-8.5 w-full rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[13.5px] outline-none focus:border-[#008F6D]"
                                  />
                                </div>
                                <div className="divide-y divide-[#F0F0F0]">
                                  {filteredThreads.map((th) => {
                                    const selected = th.id === activeThread.id;
                                    return (
                                      <button
                                        key={th.id}
                                        type="button"
                                        onClick={() => setSelectedWaId(th.id)}
                                        className={`flex w-full items-start gap-2.5 p-3 text-left transition cursor-pointer ${selected ? "bg-[#F3FAF7]" : "hover:bg-[#F8F8F8]"
                                          }`}
                                      >
                                        <span
                                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-[#171717]"
                                          style={{ backgroundColor: th.color }}
                                        >
                                          {th.initials}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center justify-between gap-1">
                                            <span className="truncate text-[13.5px] font-semibold text-[#171717]">
                                              {th.name}
                                            </span>
                                            <span className="rounded bg-[#E6F5F0] px-1.5 py-0.5 text-[12px] font-medium text-[#00775B]">
                                              {th.status}
                                            </span>
                                          </div>
                                          <p className="mt-0.5 truncate text-[12.5px] font-medium text-[#525252]">
                                            {th.company} · {th.time}
                                          </p>
                                          <p className="mt-0.5 truncate text-[12.5px] text-[#737373]">
                                            {th.preview}
                                          </p>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="flex flex-col justify-between bg-[#FFFFFF]">
                                <div className="flex items-center justify-between border-b border-[#EFEFEF] px-4 py-2.5 text-[13px]">
                                  <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-[#22C55E]" />
                                    <span className="font-semibold text-[#171717]">
                                      WhatsApp Business · Démonstration
                                    </span>
                                    <span className="text-[#737373]">· +33 1 89 45 22 10</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setWaConnected(false)}
                                    className="text-[12px] font-medium text-[#737373] hover:text-[#DC2626] cursor-pointer"
                                  >
                                    Déconnecter
                                  </button>
                                </div>

                                <div className="space-y-3 p-4">
                                  {activeThread.messages.map((msg) =>
                                    msg.from === "prospect" ? (
                                      <div key={msg.id} className="max-w-[82%]">
                                        <div className="rounded-2xl rounded-tl-sm border border-[#EFEFEF] bg-[#F5F5F5] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-[#171717]">
                                          {msg.text}
                                        </div>
                                        <p className="mt-1 text-[12px] text-[#8C8C8C]">
                                          {msg.time}
                                        </p>
                                      </div>
                                    ) : (
                                      <div key={msg.id} className="ml-auto max-w-[82%] text-right">
                                        {msg.from === "ai" && (
                                          <p className="mb-1 inline-flex items-center gap-1 text-[12px] font-medium text-[#008F6D]">
                                            <SolarIcon name="sparkle" className="size-3" />
                                            AutoCall IA
                                          </p>
                                        )}
                                        <div className="rounded-2xl rounded-tr-sm bg-[#008F6D] px-3.5 py-2.5 text-left text-[13.5px] leading-relaxed text-white">
                                          {msg.text}
                                        </div>
                                        <p className="mt-1 text-[12px] text-[#8C8C8C]">
                                          {msg.time}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>

                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!waReply.trim()) return;
                                    const newMsg: WaMessage = {
                                      id: `m-${Date.now()}`,
                                      from: "human",
                                      text: waReply.trim(),
                                      time: "À l’instant",
                                    };
                                    setWaThreads((prev) =>
                                      prev.map((th) =>
                                        th.id === activeThread.id
                                          ? {
                                            ...th,
                                            preview: newMsg.text,
                                            messages: [...th.messages, newMsg],
                                          }
                                          : th
                                      )
                                    );
                                    setWaReply("");
                                  }}
                                  className="flex items-center gap-2 border-t border-[#EFEFEF] bg-[#FAFAFA] p-3"
                                >
                                  <input
                                    type="text"
                                    value={waReply}
                                    onChange={(e) => setWaReply(e.target.value)}
                                    placeholder="Répondre sur WhatsApp Business..."
                                    className="h-9.5 min-w-0 flex-1 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[13.5px] outline-none focus:border-[#008F6D]"
                                  />
                                  <button
                                    type="submit"
                                    className="inline-flex h-9.5 items-center rounded-xl bg-[#00B489] px-4 text-[13.5px] font-medium text-white hover:bg-[#009E78] cursor-pointer"
                                  >
                                    Envoyer
                                  </button>
                                </form>
                              </div>

                              <div className="border-t border-[#E5E5E5] bg-[#FCFCFC] p-4 text-[13px] lg:border-t-0 lg:border-l">
                                <p className="text-[12px] font-medium text-[#8C8C8C]">
                                  Coordonnées
                                </p>
                                <dl className="mt-2 space-y-2">
                                  <div>
                                    <dt className="text-[#737373]">Nom</dt>
                                    <dd className="font-medium text-[#171717]">
                                      {activeThread.name}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-[#737373]">Email</dt>
                                    <dd className="truncate font-medium text-[#171717]">
                                      {activeThread.email}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-[#737373]">Téléphone</dt>
                                    <dd className="font-medium text-[#171717] tabular-nums">
                                      {activeThread.phone}
                                    </dd>
                                  </div>
                                </dl>

                                <div className="mt-4 border-t border-[#EFEFEF] pt-4">
                                  <p className="text-[12px] font-medium text-[#8C8C8C]">
                                    Informations campagne
                                  </p>
                                  <dl className="mt-2 space-y-2">
                                    <div className="flex justify-between gap-2">
                                      <dt className="text-[#737373]">Statut</dt>
                                      <dd className="font-medium text-[#00775B]">
                                        {activeThread.status}
                                      </dd>
                                    </div>
                                    <div className="flex justify-between gap-2">
                                      <dt className="text-[#737373]">Priorité</dt>
                                      <dd className="font-medium text-[#171717]">
                                        {activeThread.priority}
                                      </dd>
                                    </div>
                                    <div className="flex justify-between gap-2">
                                      <dt className="text-[#737373]">Société</dt>
                                      <dd className="truncate font-medium text-[#171717]">
                                        {activeThread.company}
                                      </dd>
                                    </div>
                                  </dl>
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Nouvelle campagne */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div role="dialog" aria-modal="true" aria-label="Nouvelle campagne" className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-xl">
            <h3 className="text-[16px] font-bold text-[#171717]">
              Nouvelle campagne
            </h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[13px] font-medium text-[#525252]">
                  Nom de la campagne
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Campagne #4 — Prospection Bordeaux"
                  className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#008F6D]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#525252]">
                  Canal de la campagne (choix unique)
                </label>
                <PremiumSelect
                  value={newMode}
                  onChange={(v) => setNewMode(v as ChannelMode)}
                  ariaLabel="Canal de la campagne"
                  className="mt-1"
                  options={[
                    { value: "phone", label: "Appel téléphonique IA" },
                    { value: "whatsapp", label: "WhatsApp Business" },
                    { value: "email", label: "Email" },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-[#525252]">
                    Référence de l’audience (démo)
                  </label>
                  <input
                    type="text"
                    value={newFile}
                    onChange={(e) => setNewFile(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#008F6D]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#525252]">
                    Volume cible
                  </label>
                  <input
                    type="number"
                    value={newPlanned}
                    onChange={(e) => setNewPlanned(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#008F6D]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1 text-[13px]">Début prévu<input type="date" className="min-w-0 rounded-lg border border-[var(--border)] px-2 py-2" value={draftDate} onChange={(event) => setDraftDate(event.target.value)} /></label>
                <label className="grid gap-1 text-[13px]">Contacts par jour<input type="number" min={1} className="min-w-0 rounded-lg border border-[var(--border)] px-2 py-2" value={draftDailyLimit} onChange={(event) => setDraftDailyLimit(event.target.value)} /></label>
                <label className="grid gap-1 text-[13px]">Budget maximal (€)<input type="number" min={0} step="0.01" className="min-w-0 rounded-lg border border-[var(--border)] px-2 py-2" value={draftBudget} onChange={(event) => setDraftBudget(event.target.value)} /></label>
              </div>
              {draftNumbersValid && <p className="text-sm text-[var(--text-muted)]">Admission estimée sur {Math.ceil(Number(newPlanned) / Number(draftDailyLimit))} jour(s), hors délais de relance.</p>}
              {/* Vérification avant lancement */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                <p className="text-[13px] font-semibold text-gray-900">
                  Vérification avant lancement
                </p>
                <p className="mt-0.5 text-[12px] text-gray-500">
                  Assurez-vous que votre campagne respecte les règles de prospection applicables.
                </p>
                <div className="mt-3 space-y-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <span className="mt-0.5 shrink-0">
                      <PremiumCheckbox
                        checked={checkLegalBasis}
                        onChange={setCheckLegalBasis}
                        ariaLabel="Je dispose d'une base légale valide pour contacter ces destinataires"
                      />
                    </span>
                    <span className="text-[12.5px] leading-snug text-gray-700">
                      Je dispose d&apos;une base légale valide pour contacter ces destinataires.
                    </span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <span className="mt-0.5 shrink-0">
                      <PremiumCheckbox
                        checked={checkOptOuts}
                        onChange={setCheckOptOuts}
                        ariaLabel="Les contacts inscrits sur liste d'opposition ou ayant demandé à ne plus être contactés sont exclus"
                      />
                    </span>
                    <span className="text-[12.5px] leading-snug text-gray-700">
                      Les contacts inscrits sur liste d&apos;opposition ou ayant demandé à ne plus être contactés sont exclus.
                    </span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <span className="mt-0.5 shrink-0">
                      <PremiumCheckbox
                        checked={checkAiTransparency}
                        onChange={setCheckAiTransparency}
                        ariaLabel="Les messages et scripts respectent nos exigences d'identification et de transparence IA"
                      />
                    </span>
                    <span className="text-[12.5px] leading-snug text-gray-700">
                      Les messages et scripts respectent nos exigences d&apos;identification et de transparence IA.
                    </span>
                  </label>
                </div>
                <div className="mt-3 border-t border-gray-200/80 pt-2.5">
                  <Link
                    href="/outreach-policy"
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#008F6D] hover:underline"
                  >
                    Consulter la politique de prospection commerciale
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setNewModalOpen(false); onConsumeAudience?.(); }}
                className="h-9 rounded-lg border border-[#E5E5E5] px-3.5 text-[14px] font-medium text-[#525252] hover:bg-[#F5F5F5] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddCampaign}
                disabled={!newTitle.trim() || !allComplianceChecked || !draftNumbersValid}
                className="h-9 rounded-lg bg-[#00B489] px-4 text-[14px] font-medium text-white hover:bg-[#009E78] disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
              >
                Enregistrer le brouillon
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
