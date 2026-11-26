"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IntegrationsCatalog } from "../integrations-catalog";
import { PremiumCheckbox } from "../premium-checkbox";
import {
  Soft3dCalendar,
  Soft3dCards,
  Soft3dHeadset,
} from "../soft-3d-illustrations";
import { type NavIconName, SolarIcon } from "../workspace-navigation";
import { AGENT_AVATAR_LIBRARY } from "./agent-avatars";
import { AgentKnowledgeTab } from "./agent-knowledge-tab";

export type StudioTab =
  | "identity"
  | "voice"
  | "instructions"
  | "scenarios"
  | "knowledge"
  | "tools"
  | "tests";

export interface StudioAgentProp {
  id: string;
  name: string;
  role: string;
  prompt: string;
  voiceName: string;
  avatarUrl?: string;
  status: "active" | "inactive";
  testedRevision: boolean;
}

const permissionLevels = ["Interdit", "Lecture seule", "Sur approbation", "Automatique"] as const;
const tools = [
  { action: "Consulter les contacts CRM", levels: [0, 1] },
  { action: "Créer un contact CRM", levels: [0, 2, 3] },
  { action: "Consulter les disponibilités", levels: [0, 1] },
  { action: "Créer un rendez-vous", levels: [0, 2, 3] },
  { action: "Envoyer un email", levels: [0, 2, 3] },
  { action: "Envoyer un message WhatsApp", levels: [0, 2, 3] },
  { action: "Supprimer un contact", levels: [0] },
];
const testScenarios = {
  "Demande de tarifs": "Consulter le catalogue approuvé ou transmettre la demande à l’équipe si le tarif manque.",
  "Prise de rendez-vous": "Vérifier les disponibilités et attendre une confirmation du service de réservation.",
  "Information confidentielle": "Refuser la demande et proposer un relais humain.",
  "Demande hors périmètre": "Expliquer la limite et transférer la demande à l’équipe.",
};

const voicesList = [
  {
    id: "v-thomas",
    name: "Thomas — Pro Ventes",
    lang: "Français (Paris)",
    tone: "Ton affirmé & chaleureux",
    timbre: "Timbre médium-grave",
  },
  {
    id: "v-alexandre",
    name: "Alexandre — Conseil & Support",
    lang: "Français",
    tone: "Calme & posé",
    timbre: "Usage : SAV, Support N1",
  },
  {
    id: "v-julien",
    name: "Julien — Dynamique & Start-up",
    lang: "Français",
    tone: "Rapide & énergique",
    timbre: "Usage : SDR, Outbound",
  },
  {
    id: "v-marc",
    name: "Marc — Luxe & Prestige",
    lang: "Français",
    tone: "Posé & feutré",
    timbre: "Usage : Hôtellerie, VIP",
  },
];

export function AgentStudio({
  agent,
  initialTab = "identity",
  onBack,
  onUpdateAvatar,
  onUpdatePrompt,
  onSaveIdentity,
}: {
  agent: StudioAgentProp;
  initialTab?: StudioTab;
  onBack: () => void;
  onUpdateAvatar?: (id: string, avatarUrl: string) => void;
  onUpdatePrompt: (id: string, prompt: string) => void;
  onSaveIdentity: (id: string, name: string, role: string) => void;
}) {
  const [tab, setTab] = useState<StudioTab>(initialTab);
  const [name, setName] = useState(agent.name);
  const [role, setRole] = useState(agent.role);
  const [selectedAvatar, setSelectedAvatar] = useState(
    agent.avatarUrl ?? AGENT_AVATAR_LIBRARY[0].src,
  );
  const [direction, setDirection] = useState<"inbound" | "outbound" | "both">(
    "both",
  );
  const [selectedVoice, setSelectedVoice] = useState(voicesList[0].id);
  const [speed, setSpeed] = useState(1.05);
  const [stability, setStability] = useState(78);
  const [clarity, setClarity] = useState(85);
  const [breathing, setBreathing] = useState(true);
  const [hookText, setHookText] = useState(
    `Bonjour {{contact.prenom}}, je suis ${agent.name}, consultant pour {{entreprise.nom}}. J’ai bien reçu votre demande de devis sur notre site et je me permets de vous rappeler comme convenu. Avez-vous deux minutes ?`,
  );
  const [bargeIn, setBargeIn] = useState(true);
  const [hesitation, setHesitation] = useState(true);
  const [amd, setAmd] = useState(true);
  const [simNote, setSimNote] = useState<string | null>(null);
  const [testScenario, setTestScenario] = useState<keyof typeof testScenarios>("Demande de tarifs");
  const [demoPermissions, setDemoPermissions] = useState<Record<string, number>>({});
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const insertVariable = (token: string) => {
    setHookText((prev) => `${prev} ${token}`);
  };

  const handleSaveDraft = () => {
    if (!name.trim() || !role.trim()) {
      setTab("identity");
      setSaveFeedback("Renseignez le nom et le rôle de l’agent.");
      return;
    }
    if (name.trim() !== agent.name || role.trim() !== agent.role) {
      onSaveIdentity(agent.id, name.trim(), role.trim());
    }
    setSaveFeedback("Identité enregistrée pour cette session.");
    window.setTimeout(() => setSaveFeedback(null), 2200);
  };

  const handlePublish = () => {
    setTab("tests");
    setSimNote("Publication indisponible dans la démonstration. La mise en service exige des tests critiques sur la révision et une intégration validée.");
  };

  const studioTabs: {
    id: StudioTab;
    label: string;
    icon: NavIconName;
    badge?: string;
  }[] = [
    { id: "identity", label: "Identité", icon: "crm" },
    { id: "voice", label: "Voix & Débit", icon: "phone" },
    { id: "instructions", label: "Instructions", icon: "sparkle" },
    { id: "scenarios", label: "Scénarios", icon: "automation", badge: "4 flux" },
    { id: "knowledge", label: "Connaissances", icon: "mail", badge: "14 docs" },
    { id: "tools", label: "Outils & Intégrations", icon: "settings", badge: "6/7" },
    { id: "tests", label: "Tests & simulations", icon: "chart" },
  ];

  return (
    <div className="space-y-5">
      {/* Fil d'Ariane */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[14px] text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-[var(--foreground)] cursor-pointer"
          >
            Agents IA
          </button>
          <span>›</span>
          <button
            type="button"
            onClick={onBack}
            className="hover:text-[var(--foreground)] cursor-pointer"
          >
            Mes agents
          </button>
          <span>›</span>
          <span className="font-medium text-[var(--foreground)]">{name}</span>
        </div>

        {saveFeedback && (
          <span className="rounded-lg bg-[var(--brand-soft)] px-3 py-1 text-[13.5px] font-medium text-[var(--brand-text)]">
            {saveFeedback}
          </span>
        )}
      </div>

      {/* En-tête Studio */}
      <div className="flex flex-col gap-4 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={selectedAvatar}
            alt={`Avatar de ${name}`}
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-[10px] border border-[#E5E5E5] bg-[#F5F5F5] object-cover object-top"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[18px] leading-[26px] font-semibold text-[var(--foreground)]">
                {name}
              </h3>
              <span className="rounded-full bg-[var(--success-bg)] px-2.5 py-0.5 text-[12.5px] font-medium text-[var(--success)]">
                ● {agent.status === "active" ? "Actif en production" : "Inactif"}
              </span>
              <span className="rounded-[6px] bg-[var(--surface-inset)] px-2 py-0.5 font-mono text-[12px] font-medium text-[var(--text-secondary)]">
                v2.4.1
              </span>
            </div>
            <p className="mt-0.5 text-[13.5px] text-[var(--text-secondary)]">
              {role} · 94,2 % complétion
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTab("tests")}
            className="inline-flex h-[38px] items-center rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3.5 text-[13.5px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
          >
            Tester l’agent
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex h-[38px] items-center rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3.5 text-[13.5px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
          >
            Enregistrer brouillon
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="inline-flex h-[38px] items-center rounded-[8px] bg-[#008F6D] px-4 text-[13.5px] font-medium text-white hover:bg-[#00775B] cursor-pointer"
          >
            Publier les modifications
          </button>
        </div>
      </div>

      {/* Onglets Studio avec icônes */}
      <div
        role="tablist"
        aria-label="Onglets Agent Studio"
        className="flex w-full min-w-0 flex-nowrap items-center gap-6 overflow-x-auto border-b border-[var(--border)]"
      >
        {studioTabs.map((t) => {
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t.id)}
              className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap pb-2.5 text-[14px] transition-colors cursor-pointer ${
                selected
                  ? "font-semibold text-[var(--foreground)]"
                  : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <SolarIcon
                name={t.icon}
                active={selected}
                className="size-4 shrink-0"
              />
              <span>{t.label}</span>
              {t.badge && (
                <span className="rounded-[6px] bg-[var(--surface-inset)] px-1.5 py-0.5 text-[12px] font-medium text-[var(--text-secondary)]">
                  {t.badge}
                </span>
              )}
              {selected && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--foreground)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB : IDENTITÉ */}
      {tab === "identity" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h4 className="text-[15px] font-semibold text-[var(--foreground)]">
              Informations générales &amp; Persona
            </h4>
            <div>
              <label className="block text-[13.5px] font-medium text-[var(--text-secondary)]">
                Nom de l’agent IA
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 h-9.5 w-full rounded-lg border border-[var(--border)] px-3 text-[13.5px] focus:border-[var(--focus-ring)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[13.5px] font-medium text-[var(--text-secondary)]">
                Fonction affichée &amp; Titre métier
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1.5 h-9.5 w-full rounded-lg border border-[var(--border)] px-3 text-[13.5px] focus:border-[var(--focus-ring)] focus:outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-[13.5px] font-medium text-[var(--text-secondary)]">
                  Photo de profil de l’agent IA
                </label>
                <span className="text-[12.5px] text-[var(--text-muted)]">
                  Bibliothèque ({AGENT_AVATAR_LIBRARY.length} avatars)
                </span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2.5 sm:grid-cols-7">
                {AGENT_AVATAR_LIBRARY.map((av) => {
                  const isSelected = selectedAvatar === av.src;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      title={av.label}
                      aria-label={av.label}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedAvatar(av.src);
                        onUpdateAvatar?.(agent.id, av.src);
                      }}
                      className={`group relative aspect-square overflow-hidden rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? "border-[#00B489] ring-2 ring-[#00B489]/25"
                          : "border-[var(--border)] hover:border-[var(--border-control)]"
                      }`}
                    >
                      <Image
                        src={av.src}
                        alt={av.label}
                        width={64}
                        height={64}
                        className="size-full object-cover object-top"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h4 className="text-[15px] font-semibold text-[var(--foreground)]">
              Type d’agent téléphonique
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  ["inbound", "Entrant", "Appels entrants"],
                  ["outbound", "Sortant", "Campagnes & rappels"],
                  ["both", "Polyvalent", "Entrant & sortant"],
                ] as const
              ).map(([id, title, desc]) => {
                const active = direction === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDirection(id)}
                    className={`rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                      active
                        ? "border-[var(--brand-primary)] bg-[var(--brand-soft)]"
                        : "border-[var(--border)] bg-[var(--surface-hover)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    <p className="text-[13.5px] font-semibold text-[var(--foreground)]">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
                      {desc}
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="rounded-xl bg-[var(--surface-inset)] p-3.5 text-[14px]">
              <p className="font-medium text-[var(--foreground)]">
                Langues prises en charge
              </p>
              <p className="mt-1 text-[var(--text-secondary)]">
                Français (principal) · Anglais · Espagnol
              </p>
            </div>
            <p className="text-[13.5px]">
              <Link
                href="/ai-policy"
                className="font-medium text-[#008064] underline underline-offset-2 hover:text-[#00664F]"
              >
                Consulter notre politique d’intelligence artificielle
              </Link>
            </p>
          </section>
        </div>
      )}

      {/* TAB : VOIX & DÉBIT */}
      {tab === "voice" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-[15px] font-semibold text-[var(--foreground)]">
                Moteur vocal &amp; Bibliothèque
              </h4>
              <span className="text-[13.5px] text-[var(--text-muted)]">
                {voicesList.length} voix disponibles
              </span>
            </div>
            <div className="space-y-2.5">
              {voicesList.map((v) => {
                const active = selectedVoice === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVoice(v.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                      active
                        ? "border-[var(--brand-primary)] bg-[var(--brand-soft)]/50"
                        : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <div>
                      <p className="text-[13.5px] font-semibold text-[var(--foreground)]">
                        {v.name}
                      </p>
                      <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
                        {v.lang} · {v.tone} · {v.timbre}
                      </p>
                    </div>
                    {active && (
                      <span className="rounded-md bg-[var(--brand-soft)] px-2 py-0.5 text-[12.5px] font-medium text-[var(--brand-text)]">
                        Sélectionnée
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h4 className="text-[15px] font-semibold text-[var(--foreground)]">
              Réglages acoustiques &amp; conversationnels
            </h4>
            <div>
              <div className="flex justify-between text-[14px]">
                <span>Vitesse d’élocution</span>
                <strong className="tabular-nums">{speed.toFixed(2)}x</strong>
              </div>
              <input
                type="range"
                min={0.8}
                max={1.4}
                step={0.05}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="mt-1.5 w-full accent-[var(--brand-primary)]"
              />
            </div>
            <div>
              <div className="flex justify-between text-[14px]">
                <span>Stabilité émotionnelle</span>
                <strong className="tabular-nums">{stability} %</strong>
              </div>
              <input
                type="range"
                min={30}
                max={100}
                value={stability}
                onChange={(e) => setStability(Number(e.target.value))}
                className="mt-1.5 w-full accent-[var(--brand-primary)]"
              />
            </div>
            <div>
              <div className="flex justify-between text-[14px]">
                <span>Clarté &amp; similarité</span>
                <strong className="tabular-nums">{clarity} %</strong>
              </div>
              <input
                type="range"
                min={40}
                max={100}
                value={clarity}
                onChange={(e) => setClarity(Number(e.target.value))}
                className="mt-1.5 w-full accent-[var(--brand-primary)]"
              />
            </div>
            <div
              onClick={() => setBreathing((v) => !v)}
              className="flex items-center justify-between rounded-xl bg-[var(--surface-inset)] p-3 text-[14px] cursor-pointer"
            >
              <span>Respiration &amp; micro-silences (250 ms)</span>
              <PremiumCheckbox
                checked={breathing}
                onChange={setBreathing}
                ariaLabel="Respiration et micro-silences"
              />
            </div>
          </section>
        </div>
      )}

      {/* TAB : INSTRUCTIONS & COMPORTEMENT */}
      {tab === "instructions" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-4">
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-[14.5px] font-semibold text-[var(--foreground)]">
                  1. Message d’accroche (Accueil téléphonique)
                </h4>
                <span className="rounded-md bg-[var(--surface-inset)] px-2 py-0.5 text-[13px] text-[var(--text-secondary)]">
                  0 – 4 s
                </span>
              </div>
              <textarea
                rows={4}
                value={hookText}
                onChange={(e) => setHookText(e.target.value)}
                className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-3.5 text-[13.5px] leading-relaxed text-[var(--foreground)] focus:border-[var(--focus-ring)] focus:bg-[var(--surface)] focus:outline-none"
              />
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[13px] text-[var(--text-muted)]">
                  Variables rapides :
                </span>
                {[
                  "{{contact.prenom}}",
                  "{{contact.nom}}",
                  "{{entreprise.nom}}",
                  "{{demande.date}}",
                ].map((tok) => (
                  <button
                    key={tok}
                    type="button"
                    onClick={() => insertVariable(tok)}
                    className="rounded-md bg-[var(--surface-inset)] px-2 py-0.5 text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] cursor-pointer"
                  >
                    + {tok}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-[14.5px] font-semibold text-[var(--foreground)]">
                  2. Rôle et mission principale
                </h4>
                <span className="rounded-md bg-[var(--brand-soft)] px-2 py-0.5 text-[13px] font-medium text-[var(--brand-text)]">
                  Stratégie active
                </span>
              </div>
              <textarea
                rows={4}
                value={agent.prompt}
                onChange={(e) => onUpdatePrompt(agent.id, e.target.value)}
                className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3.5 text-[13.5px] leading-relaxed text-[var(--foreground)] focus:border-[var(--focus-ring)] focus:bg-[var(--surface)] focus:outline-none"
              />
            </section>
          </div>

          <div className="space-y-4">
            <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h4 className="text-[14.5px] font-semibold text-[var(--foreground)]">
                3. Posture &amp; Style d’échange
              </h4>
              {[
                [
                  "Gestion des interruptions (Barge-in)",
                  "L’agent s’arrête net dès que le prospect parle",
                  bargeIn,
                  setBargeIn,
                ],
                [
                  "Hésitations & Incompréhensions",
                  "Reformuler avec bienveillance sans jamais accuser",
                  hesitation,
                  setHesitation,
                ],
                [
                  "Détection de répondeur (AMD)",
                  "Laisser un message vocal personnalisé",
                  amd,
                  setAmd,
                ],
              ].map(([title, desc, checked, setter]) => (
                <div
                  key={title as string}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-inset)] p-3"
                >
                  <div>
                    <p className="text-[14px] font-medium text-[var(--foreground)]">
                      {title as string}
                    </p>
                    <p className="text-[13px] text-[var(--text-muted)]">
                      {desc as string}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked as boolean}
                    onClick={() =>
                      (setter as (fn: (v: boolean) => boolean) => void)(
                        (v) => !v,
                      )
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                      checked ? "bg-[var(--brand-primary)]" : "bg-[#D4D4D4]"
                    }`}
                  >
                    <span
                      className={`inline-block size-4.5 transform rounded-full bg-white shadow-xs transition-transform ${
                        checked ? "translate-x-5.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </section>

            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-[14.5px] font-semibold text-[var(--foreground)]">
                  4. Garde-fous &amp; Sécurité
                </h4>
                <span className="text-[13px] font-medium text-[var(--success)]">
                  100 % Conforme
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-[13.5px] text-[var(--text-secondary)]">
                <li className="rounded-lg bg-[var(--surface-inset)] p-2.5">
                  <strong className="text-[var(--foreground)]">
                    Anti-hallucination tarifaire :
                  </strong>{" "}
                  aucun prix inventé hors documentation approuvée.
                </li>
                <li className="rounded-lg bg-[var(--surface-inset)] p-2.5">
                  <strong className="text-[var(--foreground)]">
                    Escalade humaine instantanée :
                  </strong>{" "}
                  transfert au standard sur demande explicite.
                </li>
              </ul>
            </section>
          </div>
        </div>
      )}

      {/* TAB : SCÉNARIOS */}
      {tab === "scenarios" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              step: "1. Accueil & consentement",
              trigger: "Décroché appel entrant ou sortant",
              detail:
                "Présentation de l’entreprise, annonce d’enregistrement conforme RGPD et détection de la langue.",
              status: "Actif",
              tone: "bg-[var(--success-bg)] text-[var(--success)]",
            },
            {
              step: "2. Qualification BANT",
              trigger: "Accord du prospect pour échanger",
              detail:
                "Collecte du besoin, volume d’appels mensuel, échéance de projet et rôle du décideur.",
              status: "Actif",
              tone: "bg-[var(--success-bg)] text-[var(--success)]",
            },
            {
              step: "3. Prise de rendez-vous",
              trigger: "Score de qualification ≥ 70",
              detail:
                "Lecture temps réel des disponibilités Google Calendar, proposition de 2 créneaux et confirmation double.",
              status: "Actif",
              tone: "bg-[var(--info-bg)] text-[var(--info)]",
            },
            {
              step: "4. Escalade & transfert humain",
              trigger: "Demande explicite ou question hors base",
              detail:
                "Mise en attente musicale et transfert immédiat vers l’équipe commerciale (+33 6 12 34 56 78).",
              status: "Sécurité",
              tone: "bg-[var(--warning-bg)] text-[var(--warning)]",
            },
          ].map((flow) => (
            <section
              key={flow.step}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[14.5px] font-semibold text-[var(--foreground)]">
                  {flow.step}
                </h4>
                <span
                  className={`rounded-md px-2 py-0.5 text-[12.5px] font-medium ${flow.tone}`}
                >
                  {flow.status}
                </span>
              </div>
              <p className="mt-1 text-[13px] font-medium text-[var(--text-muted)]">
                Déclencheur : {flow.trigger}
              </p>
              <p className="mt-2 rounded-lg bg-[var(--surface-inset)] p-3 text-[14px] text-[var(--text-secondary)]">
                {flow.detail}
              </p>
            </section>
          ))}
        </div>
      )}

      {/* TAB : CONNAISSANCES */}
      {tab === "knowledge" && <AgentKnowledgeTab agentName={name} />}

      {/* TAB : OUTILS & INTÉGRATIONS */}
      {tab === "tools" && (
        <div className="space-y-5">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="font-semibold">Permissions de démonstration</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Les sélections servent à prévisualiser le périmètre de l’agent.</p>
            <div className="mt-3 divide-y divide-[var(--border)]">
              {tools.map(({ action, levels }) => (
                <label key={action} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  {action}
                  <select className="rounded-lg border border-[var(--border)] px-3 py-2" value={demoPermissions[action] ?? 0} onChange={(event) => {
                    const value = Number(event.target.value);
                    setDemoPermissions((previous) => ({ ...previous, [action]: value }));
                  }}>
                    {levels.map((level) => <option value={level} key={level}>{permissionLevels[level]}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </section>
          {/* 3 cartes d'illustration Soft 3D monochrome */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
              <div className="flex h-28 w-full items-center justify-center rounded-lg bg-[var(--surface-inset)]">
                <Soft3dHeadset className="size-24" />
              </div>
              <p className="mt-3 text-[14px] font-semibold text-[var(--foreground)]">
                Téléphonie dédiée
              </p>
              <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
                Ligne SIP &amp; routage temps réel
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
              <div className="flex h-28 w-full items-center justify-center rounded-lg bg-[var(--surface-inset)]">
                <Soft3dCards className="size-24" />
              </div>
              <p className="mt-3 text-[14px] font-semibold text-[var(--foreground)]">
                Moteur de scoring B2B
              </p>
              <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
                4 critères BANT &amp; règles dynamiques
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
              <div className="flex h-28 w-full items-center justify-center rounded-lg bg-[var(--surface-inset)]">
                <Soft3dCalendar className="size-24" />
              </div>
              <p className="mt-3 text-[14px] font-semibold text-[var(--foreground)]">
                Prise de rendez-vous
              </p>
              <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
                Synchronisation Google Meet &amp; créneaux live
              </p>
            </div>
          </div>

          <IntegrationsCatalog compact />
        </div>
      )}

      {/* TAB : TESTS & SIMULATIONS */}
      {tab === "tests" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h4 className="text-[15px] font-semibold text-[var(--foreground)]">
              Simulation vocale contrôlée — {name}
            </h4>
            <p className="mt-1 text-[13.5px] text-[var(--text-secondary)]">
              Validez le respect des faits (95 % min.), des règles (98 % min.)
              et la prise de rendez-vous sur la révision exacte.
            </p>

            <div className="mt-4 space-y-2.5 rounded-xl bg-[var(--surface-inset)] p-4 text-[14px]">
              <p>
                <strong className="text-[var(--foreground)]">{name} :</strong>{" "}
                <span className="text-[var(--text-secondary)]">
                  « Bonjour, ici {name} de la société AutoCall. Je vous appelle
                  suite à votre demande de démonstration. Avez-vous deux
                  minutes ? »
                </span>
              </p>
              <p>
                <strong className="text-[var(--foreground)]">Prospect :</strong>{" "}
                <span className="text-[var(--text-secondary)]">
                  « Oui, quel est le tarif mensuel et le délai de mise en
                  service ? »
                </span>
              </p>
              <p>
                <strong className="text-[var(--foreground)]">{name} :</strong>{" "}
                <span className="text-[var(--text-secondary)]">
                  « Nos formules démarrent à 49 € HT/mois et le déploiement
                  prend moins de 24 h ouvrées. Souhaitez-vous réserver un
                  créneau demain à 10 h ? »
                </span>
              </p>
            </div>

            <label className="mt-4 grid gap-1 text-sm">
              Scénario à tester
              <select className="w-fit max-w-full rounded-lg border border-[var(--border)] px-3 py-2" value={testScenario} onChange={(event) => { setTestScenario(event.target.value as keyof typeof testScenarios); setSimNote(null); }}>
                {Object.keys(testScenarios).map((scenario) => <option key={scenario}>{scenario}</option>)}
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                setSimNote(
                  "Résultat illustratif : " + testScenarios[testScenario],
                );
              }}
              className="mt-4 inline-flex h-9.5 items-center rounded-lg bg-[#00B489] px-4 text-[13.5px] font-medium text-white hover:bg-[#009E78] cursor-pointer"
            >
              Lancer le scénario de démonstration
            </button>
            {simNote && (
              <p className="mt-4 rounded-xl border border-[var(--success-border)] bg-[var(--success-bg)] p-3.5 text-[14px] font-medium text-[var(--success)]">
                {simNote}
              </p>
            )}
          </section>

          <aside className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h4 className="text-[14.5px] font-semibold text-[var(--foreground)]">
              Seuils de qualité requis
            </h4>
            <dl className="mt-4 divide-y divide-[var(--border-subtle)] text-[14px]">
              <div className="flex justify-between py-2.5">
                <dt className="text-[var(--text-secondary)]">
                  Exactitude des faits
                </dt>
                <dd className="font-semibold text-[var(--success)] tabular-nums">
                  98 % (min. 95 %)
                </dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-[var(--text-secondary)]">
                  Respect des garde-fous
                </dt>
                <dd className="font-semibold text-[var(--success)] tabular-nums">
                  100 % (min. 98 %)
                </dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-[var(--text-secondary)]">
                  Fiabilité prise de RDV
                </dt>
                <dd className="font-semibold text-[var(--success)] tabular-nums">
                  99 % (min. 98 %)
                </dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-[var(--text-secondary)]">
                  Latence vocale moyenne
                </dt>
                <dd className="font-semibold text-[var(--foreground)] tabular-nums">
                  285 ms
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}

