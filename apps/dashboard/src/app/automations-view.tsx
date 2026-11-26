"use client";

import { useState } from "react";
import { AutomationEditor, AutomationJournal, type WorkflowConfig, type WorkflowRun } from "./automation-tools";
import {
  Soft3dCalendar,
  Soft3dCards,
  Soft3dHeadset,
} from "./soft-3d-illustrations";
import { type Locale, type NavIconName, SolarIcon } from "./workspace-navigation";

type FlowStatus = "active" | "draft" | "paused";
type FlowFilter = "all" | "active" | "draft" | "paused";
const tabs = [
  { id: "studio", label: "Automation Studio" },
  { id: "templates", label: "Modèles" },
  { id: "journal", label: "Journal d’exécution" },
] as const;

interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  icon: NavIconName;
  tintBg: string;
  tintFg: string;
  eventType: string;
  eventTone: "green" | "blue" | "purple" | "neutral";
  lastRun: string;
  successRate: number;
  status: FlowStatus;
  config?: WorkflowConfig;
}

interface TemplateCard {
  id: string;
  badge: string;
  badgeTone: "green" | "amber" | "blue" | "purple";
  title: string;
  description: string;
  pipeline: string;
  runs: string;
  icon: NavIconName;
}

const initialWorkflows: WorkflowItem[] = [
  {
    id: "wf-1",
    title: "Routage Appel Manqué Hors-Horaires",
    description: "SMS immédiat + Synchro HubSpot + Callback IA Emma lendemain 9 h",
    icon: "phone",
    tintBg: "#FFF0D6",
    tintFg: "#B7791F",
    eventType: "Inbound PBX",
    eventTone: "green",
    lastRun: "Il y a 2 min",
    successRate: 99.4,
    status: "active",
  },
  {
    id: "wf-2",
    title: "Qualification Express & Booking RDV",
    description: "Détection d’intention vocale → Google Calendar & Pipeline B2B",
    icon: "chart",
    tintBg: "#E4EEFE",
    tintFg: "#4073C5",
    eventType: "Agent Vocal IA",
    eventTone: "blue",
    lastRun: "Il y a 14 min",
    successRate: 97.8,
    status: "active",
  },
  {
    id: "wf-3",
    title: "Relance Proactive Devis sans Réponse (J+3)",
    description: "Webhook Devis non signé → Appel sortant Thomas avec pitch sur mesure",
    icon: "automation",
    tintBg: "#F0E8FC",
    tintFg: "#8760C4",
    eventType: "Outbound CRM",
    eventTone: "purple",
    lastRun: "Il y a 1 h 04",
    successRate: 94.6,
    status: "active",
  },
  {
    id: "wf-4",
    title: "Détection Litige & Alerte Superviseur",
    description: "Analyse sentiment temps réel → Alerte Slack #escalade + Transfert humain",
    icon: "agents",
    tintBg: "#FCE7EB",
    tintFg: "#CE5C70",
    eventType: "NLP Stream",
    eventTone: "neutral",
    lastRun: "Il y a 3 h 12",
    successRate: 99.9,
    status: "active",
  },
  {
    id: "wf-5",
    title: "Synthèse Post-Appel & Fiche Commerciale",
    description: "Fin d’appel > 30 s → Génération résumé PDF + Mail avec plan d’action",
    icon: "mail",
    tintBg: "#EEEEEE",
    tintFg: "#525252",
    eventType: "Post-Call Hook",
    eventTone: "neutral",
    lastRun: "Il y a 5 min",
    successRate: 98.2,
    status: "active",
  },
  {
    id: "wf-6",
    title: "Rappel Panier Abandonné & Qualification",
    description: "Webhook e-commerce → Appel sortant sous 15 min",
    icon: "campaigns",
    tintBg: "#DEF5EC",
    tintFg: "#008064",
    eventType: "Outbound CRM",
    eventTone: "purple",
    lastRun: "Brouillon",
    successRate: 0,
    status: "draft",
  },
  {
    id: "wf-7",
    title: "Synchronisation Factures Impayées",
    description: "Relance vocale douce J+7 après échéance",
    icon: "card",
    tintBg: "#FFF0D6",
    tintFg: "#B7791F",
    eventType: "Post-Call Hook",
    eventTone: "neutral",
    lastRun: "En pause",
    successRate: 96.1,
    status: "paused",
  },
];

const templates: TemplateCard[] = [
  {
    id: "tpl-1",
    badge: "24/7 Astreinte",
    badgeTone: "green",
    title: "Standard Inbound 24/7",
    description:
      "Filtrage automatique par IA, routage d’urgence vers téléphones de garde.",
    pipeline: "PBX → SMS → Slack",
    runs: "1 420 runs",
    icon: "agents",
  },
  {
    id: "tpl-2",
    badge: "Anti No-Show",
    badgeTone: "amber",
    title: "Séquence Rappel No-Show",
    description:
      "Appel vocal pré-enregistré avec dialogue interactif 15 min avant le RDV.",
    pipeline: "Calendar → WhatsApp",
    runs: "3 890 runs",
    icon: "phone",
  },
  {
    id: "tpl-3",
    badge: "CRM Sync",
    badgeTone: "blue",
    title: "Synchro Voix <> CRM Pro",
    description:
      "Enrichissement automatique du contact HubSpot dès la fin de l’appel.",
    pipeline: "CRM → AutoCall",
    runs: "5 640 runs",
    icon: "crm",
  },
  {
    id: "tpl-4",
    badge: "CSAT Audit",
    badgeTone: "purple",
    title: "Audit CSAT Post-Appel",
    description:
      "Sondage SMS ou vocal micro-enquêtes avec compilation en direct.",
    pipeline: "Voix → SMS → Rapport",
    runs: "912 runs",
    icon: "star",
  },
];

const eventToneClasses = {
  green: "bg-[var(--success-bg)] text-[var(--success)]",
  blue: "bg-[var(--info-bg)] text-[var(--info)]",
  purple: "bg-[var(--ai-bg)] text-[var(--ai)]",
  neutral: "bg-[var(--surface-inset)] text-[var(--text-secondary)]",
} as const;

const templateBadgeClasses = {
  green: "bg-[var(--success-bg)] text-[var(--success)]",
  amber: "bg-[var(--warning-bg)] text-[var(--warning)]",
  blue: "bg-[var(--info-bg)] text-[var(--info)]",
  purple: "bg-[var(--ai-bg)] text-[var(--ai)]",
} as const;

const quickDraft: WorkflowItem = {
  id: "quick-workflow-draft",
  title: "Nouveau workflow",
  description: "Définissez le déclencheur et les conditions de votre scénario.",
  icon: "automation",
  tintBg: "#DEF5EC",
  tintFg: "#008064",
  eventType: "À configurer",
  eventTone: "green",
  lastRun: "—",
  successRate: 0,
  status: "draft",
};

export function AutomationsView({ locale, initialWorkflow }: { locale: Locale; initialWorkflow?: string }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("studio");
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [templateSearch, setTemplateSearch] = useState("");
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(() => initialWorkflow === "new" ? [quickDraft, ...initialWorkflows] : initialWorkflows);
  const [filter, setFilter] = useState<FlowFilter>("all");
  const [search, setSearch] = useState("");
  const [activatedTemplates, setActivatedTemplates] = useState<
    Record<string, boolean>
  >({});
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<WorkflowItem | null>(() => workflows.find((workflow) => workflow.id === (initialWorkflow === "new" ? quickDraft.id : initialWorkflow)) ?? null);

  const filtered = workflows.filter((wf) => {
    if (filter !== "all" && wf.status !== filter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      wf.title.toLowerCase().includes(q) ||
      wf.description.toLowerCase().includes(q) ||
      wf.eventType.toLowerCase().includes(q)
    );
  });

  const activeCount = workflows.filter((w) => w.status === "active").length;
  const draftCount = workflows.filter((w) => w.status === "draft").length;
  const pausedCount = workflows.filter((w) => w.status === "paused").length;

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id && w.status !== "draft"
          ? { ...w, status: w.status === "active" ? "paused" : "active" }
          : w,
      ),
    );
  };

  const createDraft = (template?: TemplateCard) => {
    const draft: WorkflowItem = {
      id: crypto.randomUUID(),
      title: template?.title ?? "Nouveau workflow",
      description: template?.description ?? "Définissez le déclencheur et les conditions de votre scénario.",
      icon: template?.icon ?? "automation",
      tintBg: "#DEF5EC",
      tintFg: "#008064",
      eventType: template?.badge ?? "À configurer",
      eventTone: "green",
      lastRun: "—",
      successRate: 0,
      status: "draft",
    };
    if (template) setActivatedTemplates((previous) => ({ ...previous, [template.id]: true }));
    setWorkflows((previous) => [draft, ...previous]);
    setSearch("");
    setFilter("all");
    setTab("studio");
    setSelectedWorkflow(draft);
  };

  return (
    <div className="w-full min-w-0 space-y-6 px-4 py-6 sm:px-7">
      <div role="tablist" aria-label="Sections Automatisations" className="flex flex-nowrap items-center gap-6 overflow-x-auto border-b border-[var(--border)]">
        {tabs.map((item) => <button type="button" key={item.id} role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)} className="shrink-0 whitespace-nowrap border-b-2 border-transparent pb-3 text-sm aria-selected:border-[var(--foreground)] aria-selected:font-semibold">{item.label}</button>)}
      </div>
      {tab === "journal" && <AutomationJournal runs={runs} />}
      <div hidden={tab !== "studio"} className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 text-[13px]">
            <span className="rounded-md bg-[var(--surface-inset)] px-2 py-0.5 font-medium text-[var(--text-secondary)]">
              Moteur d’orchestration v2.4
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--success)]">
              <span className="size-1.5 rounded-full bg-[var(--success)]" />
              Données de démonstration
            </span>
          </div>
          <h2 className="mt-2 text-[24px] leading-[32px] font-semibold tracking-[-0.025em] text-[var(--foreground)]">
            {locale === "en"
              ? "Automations & Smart Triggers"
              : locale === "es"
                ? "Automatizaciones y Disparadores"
                : "Automatisations & Déclencheurs intelligents"}
          </h2>
          <p className="mt-1 text-[14px] leading-[21px] text-[var(--text-secondary)]">
            Orchestrez les actions automatiques avant, pendant et après chaque
            interaction vocale.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3 text-[13.5px] font-medium text-[var(--text-secondary)]">
            <SolarIcon name="chart" className="size-4 text-[var(--text-muted)]" />
            <span>23 nov. 2026</span>
          </span>
          <button
            type="button"
            onClick={() => createDraft()}
            className="inline-flex h-[38px] items-center gap-1.5 rounded-[8px] bg-[#008F6D] px-4 text-[13.5px] font-medium text-white transition-colors hover:bg-[#00775B] cursor-pointer"
          >
            <span>+ Nouveau workflow</span>
          </button>
        </div>
      </div>

      {/* 4 KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[var(--text-secondary)]">
              Total exécutions
            </span>
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[var(--surface-inset)] text-[var(--text-secondary)]">
              <SolarIcon name="automation" className="size-4" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            <span className="text-[26px] font-semibold tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
              12 847
            </span>
            <span className="rounded-md bg-[var(--success-bg)] px-2 py-0.5 text-[13px] font-medium text-[var(--success)] tabular-nums">
              ↗ +15,2 %
            </span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--surface-inset)]">
            <div className="h-full w-4/5 rounded-full bg-[var(--brand-primary)]" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[var(--text-secondary)]">
              Taux de succès
            </span>
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[var(--surface-inset)] text-[var(--text-secondary)]">
              <SolarIcon name="settings" className="size-4" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            <span className="text-[26px] font-semibold tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
              98,2 %
            </span>
            <span className="rounded-md bg-[var(--success-bg)] px-2 py-0.5 text-[13px] font-medium text-[var(--success)] tabular-nums">
              1,4 s moy.
            </span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--surface-inset)]">
            <div className="h-full w-[98%] rounded-full bg-[var(--brand-primary)]" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[var(--text-secondary)]">
              Workflows actifs
            </span>
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[var(--surface-inset)] text-[var(--text-secondary)]">
              <SolarIcon name="bolt" className="size-4" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            <span className="text-[26px] font-semibold tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
              23{" "}
              <span className="text-[15px] font-normal text-[var(--text-muted)]">
                / 25
              </span>
            </span>
            <span className="rounded-md bg-[var(--info-bg)] px-2 py-0.5 text-[13px] font-medium text-[var(--info)]">
              Trunk actif
            </span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--surface-inset)]">
            <div className="h-full w-[92%] rounded-full bg-[var(--info)]" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[var(--text-secondary)]">
              Jetons IA &amp; triggers
            </span>
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[var(--surface-inset)] text-[var(--text-secondary)]">
              <SolarIcon name="sparkle" className="size-4" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            <span className="text-[26px] font-semibold tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
              842K
            </span>
            <span className="rounded-md bg-[var(--warning-bg)] px-2 py-0.5 text-[13px] font-medium text-[var(--warning)] tabular-nums">
              84 % alloué
            </span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--surface-inset)]">
            <div className="h-full w-[84%] rounded-full bg-[var(--warning)]" />
          </div>
        </div>
      </div>

      {/* Tableau Flux en temps réel */}
      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex flex-col gap-3 border-b border-[var(--border-subtle)] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
              Flux en temps réel &amp; déclencheurs
            </h3>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-0.5 text-[13px] font-medium text-[var(--text-secondary)] tabular-nums">
              {activeCount} opérationnels
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[var(--surface-inset)] p-1 text-[13.5px]">
              {(
                [
                  ["all", `Tous (${workflows.length})`],
                  ["active", `En production (${activeCount})`],
                  ["draft", `Brouillons (${draftCount})`],
                  ["paused", `En pause (${pausedCount})`],
                ] as [FlowFilter, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${filter === id
                    ? "bg-[var(--surface)] font-medium text-[var(--foreground)] shadow-2xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrer les déclencheurs..."
              aria-label="Filtrer les déclencheurs"
              className="h-8.5 w-48 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 text-[14px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--focus-ring)] focus:bg-[var(--surface)] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--background)] text-[13.5px] font-medium text-[var(--text-secondary)]">
                <th className="px-4 py-3">Workflow &amp; déclencheur</th>
                <th className="px-4 py-3">Type d’événement</th>
                <th className="px-4 py-3">Dernier run</th>
                <th className="px-4 py-3">Taux succès</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[13.5px]">
              {filtered.map((wf) => (
                <tr
                  key={wf.id}
                  className="transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: wf.tintBg,
                          color: wf.tintFg,
                        }}
                      >
                        <SolarIcon name={wf.icon} className="size-4.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--foreground)]">
                          {wf.title}
                        </p>
                        <p className="truncate text-[13.5px] text-[var(--text-muted)]">
                          {wf.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[13px] font-medium ${eventToneClasses[wf.eventTone]}`}
                    >
                      {wf.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[14px] text-[var(--text-secondary)]">
                    <span className="inline-flex items-center gap-1.5">
                      {wf.status === "active" && (
                        <span className="size-1.5 rounded-full bg-[var(--success)]" />
                      )}
                      <span>{wf.lastRun}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-11 text-[14px] font-semibold text-[var(--foreground)] tabular-nums">
                        {wf.successRate > 0 ? `${wf.successRate} %` : "—"}
                      </span>
                      {wf.successRate > 0 && (
                        <span className="h-1.5 w-14 overflow-hidden rounded-full bg-[var(--surface-inset)]">
                          <span
                            className="block h-full rounded-full bg-[var(--brand-primary)]"
                            style={{ width: `${wf.successRate}%` }}
                          />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => wf.status === "draft" ? setSelectedWorkflow(wf) : toggleWorkflowStatus(wf.id)}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium cursor-pointer ${wf.status === "active"
                        ? "bg-[var(--success-bg)] text-[var(--success)]"
                        : "bg-[var(--surface-inset)] text-[var(--text-secondary)]"
                        }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${wf.status === "active"
                          ? "bg-[var(--success)]"
                          : "bg-[var(--text-muted)]"
                          }`}
                      />
                      <span>
                        {wf.status === "active"
                          ? "Actif"
                          : wf.status === "draft"
                            ? "Brouillon"
                            : "En pause"}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedWorkflow(wf)}
                      className="inline-flex h-8 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[13.5px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-inset)] cursor-pointer"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-4 py-3 text-[13.5px] text-[var(--text-muted)]">
          <span>
            Affichage de {filtered.length} sur {workflows.length} déclencheurs
          </span>
          <span>Page 1 / 1</span>
        </div>
      </section>
      </div>

      {/* Modèles prêts à l'emploi */}
      <section hidden={tab !== "templates"} className="space-y-4">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--foreground)]">
            Modèles d’automatisation
          </h3>
          <p className="mt-0.5 text-[13.5px] text-[var(--text-secondary)]">
            Choisissez un modèle pour préparer un brouillon personnalisable.
          </p>
        </div>

        <input type="search" aria-label="Rechercher un modèle" placeholder="Rechercher un modèle" value={templateSearch} onChange={(event) => setTemplateSearch(event.target.value)} className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.filter((tpl) => (tpl.title + " " + tpl.badge + " " + tpl.description).toLowerCase().includes(templateSearch.trim().toLowerCase())).map((tpl) => {
            const activated = Boolean(activatedTemplates[tpl.id]);
            return (
              <div
                key={tpl.id}
                className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="relative flex h-32 items-center justify-center rounded-lg bg-[var(--surface-inset)]">
                  <span
                    className={`absolute top-2.5 right-2.5 rounded-md px-2 py-0.5 text-[12.5px] font-medium ${templateBadgeClasses[tpl.badgeTone]}`}
                  >
                    {tpl.badge}
                  </span>
                  {tpl.id === "tpl-1" ? (
                    <Soft3dHeadset className="size-24" />
                  ) : tpl.id === "tpl-2" ? (
                    <Soft3dCalendar className="size-24" />
                  ) : (
                    <Soft3dCards className="size-24" />
                  )}
                </div>

                <h4 className="mt-3.5 text-[14.5px] font-semibold text-[var(--foreground)]">
                  {tpl.title}
                </h4>
                <p className="mt-1 flex-1 text-[14px] leading-5 text-[var(--text-secondary)]">
                  {tpl.description}
                </p>

                <div className="mt-3.5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-[13px] text-[var(--text-muted)]">
                  <span>{tpl.pipeline}</span>
                  <span className="font-medium text-[var(--foreground)] tabular-nums">
                    {tpl.runs}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => createDraft(tpl)}
                  className={`mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border text-[14px] font-medium transition-colors cursor-pointer ${activated
                    ? "border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                    }`}
                >
                  {activated ? "Créer un autre brouillon" : "Créer un brouillon"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tiroir détail workflow */}
      {selectedWorkflow && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            aria-hidden="true"
            onClick={() => setSelectedWorkflow(null)}
            className="fixed inset-0 bg-[#171717]/25 backdrop-blur-[1px]"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={selectedWorkflow.title}
            className="relative z-10 h-dvh w-full max-w-xl overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[18px] font-semibold text-[var(--foreground)]">
                  {selectedWorkflow.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedWorkflow(null)}
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] cursor-pointer"
                >
                  ×
                </button>
              </div>
              <p className="mt-2 text-[13.5px] text-[var(--text-secondary)]">
                {selectedWorkflow.description}
              </p>
              <dl className="mt-5 divide-y divide-[var(--border-subtle)] text-[14px]">
                <div className="flex justify-between py-2.5">
                  <dt className="text-[var(--text-muted)]">Événement</dt>
                  <dd className="font-medium text-[var(--foreground)]">
                    {selectedWorkflow.eventType}
                  </dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-[var(--text-muted)]">Dernier run</dt>
                  <dd className="font-medium text-[var(--foreground)]">
                    {selectedWorkflow.lastRun}
                  </dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-[var(--text-muted)]">Taux de succès</dt>
                  <dd className="font-medium text-[var(--foreground)] tabular-nums">
                    {selectedWorkflow.successRate} %
                  </dd>
                </div>
              </dl>
            </div>
            <AutomationEditor
              key={selectedWorkflow.id}
              initial={selectedWorkflow.config}
              workflowName={selectedWorkflow.title}
              onRun={(run) => setRuns((previous) => [run, ...previous])}
              onSave={(name, config) => {
                const updated = { ...selectedWorkflow, title: name, eventType: config.trigger, config };
                setWorkflows((previous) => previous.map((workflow) => workflow.id === updated.id ? updated : workflow));
                setSelectedWorkflow(updated);
              }}
            />
            {selectedWorkflow.status !== "draft" && <button
              type="button"
              onClick={() => {
                toggleWorkflowStatus(selectedWorkflow.id);
                setSelectedWorkflow(null);
              }}
              className="mt-4 flex h-9.5 w-full items-center justify-center rounded-lg border border-[var(--border)] text-[13.5px] font-medium hover:bg-[var(--surface-hover)] cursor-pointer"
            >
              {selectedWorkflow.status === "active"
                ? "Simuler la mise en pause"
                : "Simuler la reprise"}
            </button>}
          </aside>
        </div>
      )}
    </div>
  );
}

