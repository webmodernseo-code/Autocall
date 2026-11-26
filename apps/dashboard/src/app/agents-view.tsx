"use client";

import Image from "next/image";
import { useState } from "react";
import { AgentStudio, type StudioTab } from "./agents/agent-studio";
import { AgentSupervision } from "./agents/agent-supervision";
import { PremiumSelect } from "./premium-select";
import { type Locale, type NavIconName, SolarIcon } from "./workspace-navigation";

type AgentsTab = "list" | "studio" | "knowledge" | "tests";
type AgentStatus = "active" | "inactive";
type ViewMode = "grid" | "list";

interface VoiceAgent {
  id: string;
  initials: string;
  name: string;
  role: string;
  description: string;
  language: string;
  directionLabel: string;
  directionTone: "amber" | "blue" | "purple";
  status: AgentStatus;
  calls: string;
  rdvCount: string;
  avgDuration: string;
  voiceLabel: string;
  voiceActive: boolean;
  lastActivity: string;
  avatarBg: string;
  avatarFg: string;
  avatarUrl: string;
  testedRevision: boolean;
  prompt: string;
  voiceName: string;
}

const initialAgents: VoiceAgent[] = [
  {
    id: "ag-thomas",
    initials: "TH",
    name: "Thomas",
    role: "Agent commercial IA",
    description:
      "Accueille les prospects, identifie leurs besoins et organise des rendez-vous commerciaux.",
    language: "Français",
    directionLabel: "Sortant & Entrant (Polyvalent)",
    directionTone: "amber",
    status: "active",
    calls: "128",
    rdvCount: "17",
    avgDuration: "4,6 min",
    voiceLabel: "Voix configurée",
    voiceActive: true,
    lastActivity: "aujourd’hui à 14:32",
    avatarBg: "#E4EEFE",
    avatarFg: "#4073C5",
    avatarUrl: "/avatars/agents/agent-1.jpg",
    testedRevision: true,
    prompt:
      "Qualifiez le besoin du prospect en 3 questions courtes, vérifiez le budget et proposez un créneau de rendez-vous.",
    voiceName: "Voix FR — Thomas (Pro)",
  },
  {
    id: "ag-sophie",
    initials: "SO",
    name: "Sophie",
    role: "Accueil téléphonique IA",
    description:
      "Répond à chaque appel entrant 24/7, oriente les demandes et planifie les créneaux.",
    language: "Français",
    directionLabel: "Entrant 24/7",
    directionTone: "blue",
    status: "active",
    calls: "94",
    rdvCount: "12",
    avgDuration: "3,4 min",
    voiceLabel: "Voix configurée",
    voiceActive: true,
    lastActivity: "aujourd’hui à 13:15",
    avatarBg: "#DEF5EC",
    avatarFg: "#008064",
    avatarUrl: "/avatars/agents/agent-2.jpg",
    testedRevision: true,
    prompt:
      "Accueillez chaleureusement l’appelant au nom de l’entreprise, identifiez l’objet de l’appel et réservez un créneau ou transférez si urgent.",
    voiceName: "Voix FR — Sophie (Naturelle)",
  },
  {
    id: "ag-emma",
    initials: "EM",
    name: "Emma",
    role: "Support & Service client IA",
    description:
      "Traite les questions courantes depuis la base de connaissances et escalade si besoin.",
    language: "Français",
    directionLabel: "Entrant",
    directionTone: "purple",
    status: "inactive",
    calls: "42",
    rdvCount: "5",
    avgDuration: "3,9 min",
    voiceLabel: "Voix en veille",
    voiceActive: false,
    lastActivity: "il y a 3 jours",
    avatarBg: "#F0E8FC",
    avatarFg: "#8760C4",
    avatarUrl: "/avatars/agents/agent-4.jpg",
    testedRevision: false,
    prompt:
      "Répondez aux questions courantes à partir de la base de connaissances approuvée et escaladez vers un conseiller si nécessaire.",
    voiceName: "Voix FR — Emma (Douce)",
  },
  {
    id: "ag-karim",
    initials: "KA",
    name: "Karim",
    role: "Qualification B2B IA",
    description:
      "Qualifie les prospects issus des campagnes, vérifie le budget et planifie les démonstrations.",
    language: "Français",
    directionLabel: "Sortant",
    directionTone: "amber",
    status: "active",
    calls: "112",
    rdvCount: "19",
    avgDuration: "4,1 min",
    voiceLabel: "Voix configurée",
    voiceActive: true,
    lastActivity: "aujourd’hui à 15:08",
    avatarBg: "#E4EEFE",
    avatarFg: "#4073C5",
    avatarUrl: "/avatars/agents/agent-6.jpg",
    testedRevision: true,
    prompt:
      "Qualifiez les décideurs B2B, identifiez la taille du parc et réservez un créneau de démonstration avec un commercial.",
    voiceName: "Voix FR — Karim (Dynamique)",
  },
  {
    id: "ag-ines",
    initials: "IN",
    name: "Inès",
    role: "Relance & Suivi Devis IA",
    description:
      "Relance les devis en attente par téléphone, lève les objections et confirme les commandes.",
    language: "Français",
    directionLabel: "Sortant",
    directionTone: "blue",
    status: "active",
    calls: "86",
    rdvCount: "14",
    avgDuration: "3,8 min",
    voiceLabel: "Voix configurée",
    voiceActive: true,
    lastActivity: "aujourd’hui à 11:45",
    avatarBg: "#DEF5EC",
    avatarFg: "#008064",
    avatarUrl: "/avatars/agents/agent-8.jpg",
    testedRevision: true,
    prompt:
      "Recontactez les prospects ayant reçu un devis depuis plus de 48 h et proposez une validation ou un ajustement.",
    voiceName: "Voix FR — Inès (Chaleureuse)",
  },
  {
    id: "ag-lucas",
    initials: "LU",
    name: "Lucas",
    role: "Planification & RDV IA",
    description:
      "Organise les visites techniques sur site, synchronise les agendas et confirme les créneaux.",
    language: "Français",
    directionLabel: "Polyvalent",
    directionTone: "purple",
    status: "active",
    calls: "64",
    rdvCount: "21",
    avgDuration: "2,9 min",
    voiceLabel: "Voix configurée",
    voiceActive: true,
    lastActivity: "hier à 17:20",
    avatarBg: "#F0E8FC",
    avatarFg: "#8760C4",
    avatarUrl: "/avatars/agents/agent-7.jpg",
    testedRevision: true,
    prompt:
      "Proposez les créneaux disponibles selon le secteur géographique et confirmez immédiatement l’envoi de l’invitation.",
    voiceName: "Voix FR — Lucas (Posé)",
  },
];

const knowledgeDocs = [
  {
    id: "kd-1",
    title: "Grille tarifaire & formules AutoCall 2026",
    source: "Document interne validé",
    updatedAt: "20 nov. 2026",
    status: "Approuvé",
    approved: true,
  },
  {
    id: "kd-2",
    title: "Procédure de prise de rendez-vous & buffers",
    source: "Manuel opérations",
    updatedAt: "18 nov. 2026",
    status: "Approuvé",
    approved: true,
  },
  {
    id: "kd-3",
    title: "FAQ Support technique & portabilité",
    source: "Brouillon équipe",
    updatedAt: "23 nov. 2026",
    status: "En attente",
    approved: false,
  },
];

const tabCopy: Record<Locale, Record<AgentsTab, string>> = {
  fr: {
    list: "Mes agents",
    studio: "Agent Studio",
    knowledge: "Connaissances et mémoire",
    tests: "Historique et supervision",
  },
  en: {
    list: "My agents",
    studio: "Agent Studio",
    knowledge: "Knowledge and memory",
    tests: "History and supervision",
  },
  es: {
    list: "Mis agentes",
    studio: "Agent Studio",
    knowledge: "Conocimiento y memoria",
    tests: "Historial y supervisión",
  },
};

export function AgentsView({ locale }: { locale: Locale }) {
  const [activeTab, setActiveTab] = useState<AgentsTab>("list");
  const [studioTab, setStudioTab] = useState<StudioTab>("identity");
  const [agents, setAgents] = useState<VoiceAgent[]>(initialAgents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AgentStatus>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [editingAgentId, setEditingAgentId] = useState<string>(
    initialAgents[0].id,
  );
  const [knowledgeSearch, setKnowledgeSearch] = useState("");
  const [approvedOnly, setApprovedOnly] = useState(false);

  const editingAgent =
    agents.find((a) => a.id === editingAgentId) ?? agents[0];

  const filteredAgents = agents.filter((ag) => {
    if (statusFilter !== "all" && ag.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      ag.name.toLowerCase().includes(q) || ag.role.toLowerCase().includes(q)
    );
  });

  const openStudioForAgent = (agentId: string, tab: StudioTab = "identity") => {
    setEditingAgentId(agentId);
    setStudioTab(tab);
    setActiveTab("studio");
  };

  const toggleAgentStatus = (agent: VoiceAgent) => {
    if (agent.status === "inactive" && !agent.testedRevision) {
      openStudioForAgent(agent.id);
      return;
    }
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agent.id
          ? { ...a, status: a.status === "active" ? "inactive" : "active" }
          : a,
      ),
    );
  };

  const createAgent = () => {
    const id = crypto.randomUUID();
    const agent: VoiceAgent = {
      ...initialAgents[0],
      id,
      name: "Nouvel agent",
      initials: "NA",
      role: "Assistant personnalisé",
      description: "",
      prompt: "",
      status: "inactive",
      testedRevision: false,
      calls: "0",
      rdvCount: "0",
      avgDuration: "—",
      lastActivity: "—",
      voiceActive: false,
    };
    setAgents((previous) => [...previous, agent]);
    setSearch("");
    setStatusFilter("all");
    openStudioForAgent(id);
  };

  const tabs: { id: AgentsTab; icon: NavIconName }[] = [
    { id: "list", icon: "agents" },
    { id: "knowledge", icon: "mail" },
    { id: "tests", icon: "chart" },
  ];

  return (
    <div className="w-full min-w-0 space-y-6 px-4 py-6 sm:px-7">
      {/* Sous-navigation avec icônes */}
      <div
        role="tablist"
        aria-label="Sections Agents IA"
        className="flex items-center gap-6 overflow-x-auto border-b border-[var(--border)]"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id || (tab.id === "list" && activeTab === "studio");
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap pb-2.5 text-[14px] transition-colors cursor-pointer ${
                selected
                  ? "font-semibold text-[var(--foreground)]"
                  : "font-normal text-[var(--text-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <SolarIcon
                name={tab.icon}
                active={selected}
                className="size-4 shrink-0"
              />
              <span>{tabCopy[locale][tab.id]}</span>
              {tab.id === "list" && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-[var(--surface-inset)] px-1.5 text-[13px] font-medium text-[var(--text-secondary)] tabular-nums">
                  {agents.length}
                </span>
              )}
              {selected && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--foreground)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1 : MES AGENTS */}
      {activeTab === "list" && (
        <div className="max-w-[1180px] space-y-5">
          {/* En-tête */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-[24px] leading-[32px] font-semibold tracking-[-0.025em] text-[var(--foreground)]">
                  Mes agents
                </h2>
                <span className="inline-flex items-center rounded-full bg-[var(--brand-soft)] px-2.5 py-0.5 text-[12.5px] font-medium text-[var(--brand-text)]">
                  Automatisés 24/7
                </span>
              </div>
              <p className="mt-1 text-[14px] leading-[21px] text-[var(--text-secondary)]">
                Ajoutez et gérez vos assistants vocaux intelligents.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab("tests")}
                className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3.5 text-[13.5px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
              >
                <SolarIcon
                  name="phone"
                  className="size-4 text-[var(--text-secondary)]"
                />
                <span>Voir la supervision</span>
              </button>
              <button
                type="button"
                onClick={createAgent}
                className="inline-flex h-[38px] items-center rounded-[8px] bg-[#008F6D] px-4 text-[13.5px] font-medium text-white hover:bg-[#00775B] cursor-pointer"
              >
                + Ajouter un agent
              </button>
            </div>
          </div>

          {/* Barre de recherche & vue */}
          <div className="flex flex-col gap-3 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2.5">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un agent par nom ou fonction..."
                aria-label="Rechercher un agent"
                className="h-[38px] min-w-[220px] flex-1 rounded-[8px] border border-[var(--border)] bg-[var(--surface-hover)] px-3 text-[14px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--focus-ring)] focus:bg-[var(--surface)] focus:outline-none"
              />
              <PremiumSelect
                value={statusFilter}
                onChange={(val) => setStatusFilter(val as "all" | AgentStatus)}
                ariaLabel="Filtrer par statut"
                className="min-w-[165px]"
                options={[
                  { value: "all", label: "Tous les statuts" },
                  { value: "active", label: "Actifs" },
                  { value: "inactive", label: "Inactifs" },
                ]}
              />
            </div>

            <div className="inline-flex rounded-[8px] bg-[var(--surface-inset)] p-0.5 text-[13.5px]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`h-[34px] rounded-[6px] px-3 cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[var(--surface)] font-medium text-[var(--foreground)] shadow-2xs"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                Grille
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`h-[34px] rounded-[6px] px-3 cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[var(--surface)] font-medium text-[var(--foreground)] shadow-2xs"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                Liste
              </button>
            </div>
          </div>

          {/* Grille des agents */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-3"
            }
          >
            {filteredAgents.map((ag) => (
              <article
                key={ag.id}
                className="flex flex-col justify-between rounded-[12px] border border-[#E5E5E5] bg-white p-5 transition-colors hover:border-[#D4D4D4]"
              >
                <div>
                  {/* En-tête portrait + identité + menu */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <Image
                        src={ag.avatarUrl}
                        alt={`Avatar de ${ag.name}`}
                        width={56}
                        height={56}
                        className="size-14 shrink-0 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] object-cover object-top"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[16px] leading-[22px] font-semibold tracking-tight text-[#171717]">
                            {ag.name}
                          </h3>
                          <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-medium ${
                              ag.status === "active"
                                ? "bg-[#E6F5F0] text-[#00775B]"
                                : "bg-[#F2F2F2] text-[#525252]"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                ag.status === "active"
                                  ? "bg-[#008F6D]"
                                  : "bg-[#A3A3A3]"
                              }`}
                            />
                            {ag.status === "active" ? "Actif" : "Inactif"}
                          </span>
                        </div>

                        <p className="mt-0.5 text-[13.5px] text-[#525252]">
                          {ag.role}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-[6px] border border-[#E5E5E5] bg-[#FAFAFA] px-2 py-0.5 text-[12px] font-medium text-[#525252]">
                            {ag.language}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-[6px] border border-[#E5E5E5] bg-[#FAFAFA] px-2 py-0.5 text-[12px] font-medium text-[#525252]">
                            {ag.voiceLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAgentStatus(ag)}
                      title={
                        ag.status === "active"
                          ? "Mettre en veille"
                          : "Activer l’agent"
                      }
                      aria-label="Options de l’agent"
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#525252] transition hover:bg-[#F8F8F8] cursor-pointer"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <circle cx="6" cy="12" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="18" cy="12" r="1.5" />
                      </svg>
                    </button>
                  </div>

                  {/* Description courte */}
                  <p className="mt-3.5 text-[14px] leading-[21px] text-[#525252]">
                    {ag.description}
                  </p>

                  {/* 3 mini-cartes métriques */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-[8px] border border-[#EFEFEF] bg-[#FAFAFA] px-2.5 py-2.5 text-center">
                      <p className="font-mono text-[15px] font-semibold text-[#171717] tabular-nums">
                        {ag.calls}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#737373]">appels traités</p>
                    </div>

                    <div className="rounded-[8px] border border-[#EFEFEF] bg-[#FAFAFA] px-2.5 py-2.5 text-center">
                      <p className="font-mono text-[15px] font-semibold text-[#171717] tabular-nums">
                        {ag.rdvCount}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#737373]">RDV pris</p>
                    </div>

                    <div className="rounded-[8px] border border-[#EFEFEF] bg-[#FAFAFA] px-2.5 py-2.5 text-center">
                      <p className="font-mono text-[15px] font-semibold text-[#171717] tabular-nums">
                        {ag.avgDuration}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#737373]">durée moy.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3 border-t border-[#F0F0F0] pt-3.5">
                  <p className="flex items-center justify-between text-[12.5px] text-[#737373]">
                    <span>Dernière activité</span>
                    <span className="font-medium text-[#525252]">{ag.lastActivity}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => openStudioForAgent(ag.id)}
                      className="inline-flex h-[38px] items-center justify-center gap-1.5 rounded-[8px] border border-[#E5E5E5] bg-white text-[13.5px] font-medium text-[#171717] transition hover:bg-[#F8F8F8] cursor-pointer"
                    >
                      <SolarIcon name="settings" className="size-4 text-[#525252]" />
                      <span>Configurer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openStudioForAgent(ag.id, "tests")}
                      className="inline-flex h-[38px] items-center justify-center gap-1.5 rounded-[8px] border border-[#E5E5E5] bg-[#FAFAFA] text-[13.5px] font-medium text-[#171717] transition hover:bg-[#F0F0F0] cursor-pointer"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="size-3.5 text-[#525252]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M7 5v14l12-7-12-7Z" strokeLinejoin="round" />
                      </svg>
                      <span>Tester</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* Carte Ajouter un agent vocal */}
            <button
              type="button"
              onClick={() => openStudioForAgent(agents[0].id)}
              className="flex min-h-[260px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#D4D4D4] bg-[#FAFAFA] p-6 text-center transition-colors hover:border-[#A3A3A3] hover:bg-white cursor-pointer"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[18px] font-medium text-[var(--foreground)] shadow-2xs">
                +
              </span>
              <p className="mt-3.5 text-[14.5px] font-semibold text-[var(--foreground)]">
                + Ajouter un agent vocal
              </p>
              <p className="mt-1 max-w-xs text-[13.5px] text-[var(--text-muted)]">
                Personnalisez son rôle, sa voix et ses connaissances en quelques
                minutes.
              </p>
              <span className="mt-4 inline-flex h-8 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[13.5px] font-medium text-[var(--foreground)]">
                Assistant d’ajout guidé
              </span>
            </button>
          </div>

          {/* Bandeau Routage dynamique */}
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#DEF5EC] text-[#008064]">
                <SolarIcon name="phone" className="size-4.5" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-semibold text-[var(--foreground)]">
                    Routage dynamique des appels
                  </p>
                  <span className="rounded-md bg-[var(--info-bg)] px-2 py-0.5 text-[12.5px] font-medium text-[var(--info)]">
                    SIP Trunk connecté
                  </span>
                </div>
                <p className="mt-0.5 text-[14px] text-[var(--text-secondary)]">
                  Thomas gère le débordement d’appels entrants lorsque Sophie est
                  en communication active.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("studio")}
              className="inline-flex h-9 shrink-0 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
            >
              Modifier les règles
            </button>
          </div>
        </div>
      )}

      {/* TAB 2 : AGENT STUDIO */}
      {activeTab === "studio" && (
        <AgentStudio
          key={editingAgent.id}
          agent={editingAgent}
          initialTab={studioTab}
          onBack={() => setActiveTab("list")}
          onUpdateAvatar={(id, avatarUrl) =>
            setAgents((prev) =>
              prev.map((a) => (a.id === id ? { ...a, avatarUrl } : a)),
            )
          }
          onUpdatePrompt={(id, prompt) =>
            setAgents((prev) =>
              prev.map((a) =>
                a.id === id ? { ...a, prompt, testedRevision: false } : a,
              ),
            )
          }
          onSaveIdentity={(id, name, role) => setAgents((previous) => previous.map((agent) =>
            agent.id === id ? { ...agent, name, role, initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(), testedRevision: false } : agent,
          ))}
        />
      )}

      {/* TAB 3 : BASE DE CONNAISSANCES */}
      {activeTab === "knowledge" && (
        <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border-subtle)] p-4">
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
              Sources &amp; documents approuvés
            </h3>
            <p className="mt-0.5 text-[14px] text-[var(--text-secondary)]">
              Seules les sources approuvées sont accessibles aux agents vocaux.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-b border-[var(--border-subtle)] p-4 text-sm">
            <input type="search" aria-label="Rechercher une source" placeholder="Rechercher une source" value={knowledgeSearch} onChange={(event) => setKnowledgeSearch(event.target.value)} className="min-w-0 rounded-lg border border-[var(--border)] px-3 py-2" />
            <label className="flex items-center gap-2"><input type="checkbox" checked={approvedOnly} onChange={(event) => setApprovedOnly(event.target.checked)} /> Sources approuvées</label>
          </div>
          <ul className="divide-y divide-[var(--border-subtle)]">
            {knowledgeDocs.filter((doc) => (!approvedOnly || doc.approved) && (doc.title + " " + doc.source).toLowerCase().includes(knowledgeSearch.trim().toLowerCase())).map((doc) => (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 text-[13.5px]"
              >
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {doc.title}
                  </p>
                  <p className="text-[13px] text-[var(--text-muted)]">
                    {doc.source} · Mis à jour le {doc.updatedAt}
                  </p>
                </div>
                <span
                  className={`rounded-md px-2.5 py-1 text-[13px] font-medium ${
                    doc.approved
                      ? "bg-[var(--success-bg)] text-[var(--success)]"
                      : "bg-[var(--warning-bg)] text-[var(--warning)]"
                  }`}
                >
                  {doc.status}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-[var(--border-subtle)] p-4">
            <h3 className="font-semibold">Mémoire commerciale · Démonstration</h3>
            <p className="mt-2 text-sm">Sophie Martin recherche une prestation annuelle. Source : appel du 24 novembre.</p>
            <p className="mt-1 text-sm">Elle préfère être recontactée par email. Source : conversation WhatsApp.</p>
          </div>
        </section>
      )}

      {activeTab === "tests" && <AgentSupervision />}
    </div>
  );
}

