"use client";

import { useState } from "react";
import { GmailBrandSvg, WhatsAppBrandSvg } from "../brand-icons";
import { PremiumCheckbox } from "../premium-checkbox";
import { SolarIcon } from "../workspace-navigation";

export interface ContactDetailData {
  id: string;
  initials: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone?: string;
  city?: string;
  source?: string;
  score: number;
  engagement: number;
  tempLabel: string;
  stage: string;
  opportunityValue: string;
}

type DetailTab = "timeline" | "notes" | "tasks" | "meetings" | "deals";

export function ContactDetailView({
  contact,
  onBack,
  onCreateInvoice,
}: {
  contact: ContactDetailData;
  onBack: () => void;
  onCreateInvoice: (company: string, email: string) => void;
}) {
  const [fullPage, setFullPage] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("timeline");
  const [meetingCompleted, setMeetingCompleted] = useState(false);
  const [notes, setNotes] = useState([
    {
      id: "n1",
      author: "Tanjim Islam",
      date: "Aujourd’hui · 09:45",
      title: "Compte-rendu d’appel de découverte",
      body: "Échange très positif. Le client souhaite déployer nos agents IA sur 3 agences régionales dès le mois prochain et attend le devis détaillé.",
    },
    {
      id: "n2",
      author: "Thomas (Agent IA)",
      date: "Hier · 16:20",
      title: "Qualification BANT validée",
      body: "Budget confirmé, décideur direct identifié, besoin urgent sur la gestion des appels hors horaires.",
    },
  ]);
  const [noteInput, setNoteInput] = useState("");
  const [tasks, setTasks] = useState([
    { id: "t1", label: "Envoyer la proposition tarifaire détaillée", done: true, due: "Hier" },
    { id: "t2", label: "Confirmer le créneau de démonstration", done: false, due: "Demain · 10:00" },
    { id: "t3", label: "Valider le périmètre RGPD & SLA", done: false, due: "29 mars" },
  ]);
  const [taskInput, setTaskInput] = useState("");
  const [taskDueInput, setTaskDueInput] = useState("Demain");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const phoneDisplay = contact.phone ?? "+33 6 42 19 88 02";

  const triggerFeedback = (msg: string) => {
    setActionFeedback(msg);
    window.setTimeout(() => setActionFeedback(null), 2400);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    setTasks((prev) => [
      {
        id: `t-${Date.now()}`,
        label: taskInput.trim(),
        done: false,
        due: taskDueInput.trim() || "À planifier",
      },
      ...prev,
    ]);
    setTaskInput("");
    triggerFeedback("Nouvelle tâche ajoutée");
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setNotes((prev) => [
      {
        id: `n-${Date.now()}`,
        author: "Tanjim Islam",
        date: "À l’instant",
        title: "Note ajoutée manuellement",
        body: noteInput.trim(),
      },
      ...prev,
    ]);
    setNoteInput("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-0 backdrop-blur-[1.5px] sm:p-4"
      onClick={onBack}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Aperçu du prospect ${contact.name}`}
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col overflow-hidden border border-[#E5E5E5] bg-[#FAFAFA] shadow-2xl transition-all duration-200 ${
          fullPage
            ? "h-dvh w-screen rounded-none"
            : "max-h-[92dvh] w-full max-w-[920px] rounded-2xl"
        }`}
      >
        {/* Top Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E5E5E5] bg-[#FFFFFF] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-semibold tracking-tight text-[#171717]">
              Aperçu du prospect
            </h2>
            {actionFeedback && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B8E6D6] bg-[#E6F5F0] px-2.5 py-0.5 text-[12.5px] font-medium text-[#00775B]">
                <span className="size-1.5 rounded-full bg-[#00B489]" />
                {actionFeedback}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFullPage((prev) => !prev)}
              className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[13.5px] font-medium text-[#171717] shadow-2xs transition hover:bg-[#F5F5F5] cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="size-3.5 text-[#525252]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                {fullPage ? (
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m12-6h4a2 2 0 0 1 2 2v4M3 15v4a2 2 0 0 0 2 2h4m12-6v4a2 2 0 0 1-2 2h-4" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
              {fullPage ? "Réduire en fenêtre" : "Ouvrir en plein écran"}
            </button>
            <button
              type="button"
              onClick={onBack}
              aria-label="Fermer l’aperçu"
              className="inline-flex size-8.5 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] text-[#525252] transition hover:bg-[#F5F5F5] hover:text-[#171717] cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Main Profile + 2x3 KPI Card */}
          <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-2xs">
            {/* Top row: Avatar + Name/Location/Phone + Circular Icon Actions */}
            <div className="flex flex-col gap-4 border-b border-[#F0F0F0] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <span className="inline-flex size-13 shrink-0 items-center justify-center rounded-full border border-[#B8E6D6] bg-[#E6F5F0] text-[16px] font-semibold text-[#00775B]">
                  {contact.initials}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[18px] font-bold tracking-tight text-[#171717]">
                      {contact.name}
                    </h3>
                    <span className="rounded-full bg-[#E6F5F0] px-2 py-0.5 text-[12px] font-medium text-[#00775B]">
                      {contact.score}/100 · {contact.tempLabel}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[13.5px] text-[#737373]">
                    <span className="inline-flex items-center gap-1">
                      <svg viewBox="0 0 24 24" className="size-3.5 text-[#737373]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" />
                        <circle cx="12" cy="11" r="2" />
                      </svg>
                      {contact.city ?? "Lyon 3e (69)"}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-[#171717] tabular-nums">
                      <SolarIcon name="phone" className="size-3.5 text-[#008F6D]" />
                      {phoneDisplay}
                    </span>
                  </div>
                </div>
              </div>

              {/* Circular Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerFeedback(`Email prêt pour ${contact.email}`)}
                  title="Envoyer un email"
                  aria-label="Envoyer un email"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-2xs transition hover:border-[#EA4335]/50 hover:bg-[#FEF2F2] cursor-pointer"
                >
                  <GmailBrandSvg className="size-4.5 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => triggerFeedback(`Appel sortant vers ${phoneDisplay}`)}
                  title="Appeler"
                  aria-label="Appeler"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-[#93C5FD] bg-[#EFF6FF] text-[#2563EB] transition hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white cursor-pointer"
                >
                  <SolarIcon name="phone" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => triggerFeedback(`WhatsApp ouvert avec ${contact.name}`)}
                  title="Message WhatsApp"
                  aria-label="Message WhatsApp"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-2xs transition hover:border-[#22C55E]/50 hover:bg-[#F0FDF4] cursor-pointer"
                >
                  <WhatsAppBrandSvg className="size-4.5 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => onCreateInvoice(contact.company, contact.email)}
                  title="Créer un devis ou une facture"
                  aria-label="Créer un devis ou une facture"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#00B489] px-3.5 text-[13.5px] font-medium text-white shadow-2xs transition hover:bg-[#009E78] cursor-pointer"
                >
                  <SolarIcon name="card" className="size-3.5" />
                  Facturer
                </button>
              </div>
            </div>

            {/* Bottom split: Left Details + Right 2x3 KPI Grid */}
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
              {/* Left info (double-surface interactive cards) */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-2.5">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-[12.5px] font-medium text-[#525252]">
                    Coordonnées
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F5F0] px-2 py-0.5 text-[12px] font-medium text-[#00775B]">
                    <span className="size-1.5 rounded-full bg-[#00B489]" />
                    Vérifié
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 rounded-lg border border-[#EFEFEF] bg-[#FFFFFF] px-2.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-[#F5F5F5] text-[#525252]">
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                        <rect x="3" y="7" width="18" height="13" rx="2" />
                        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[#8C8C8C]">Fonction</p>
                      <p className="truncate text-[13.5px] font-medium text-[#171717]">
                        {contact.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-lg border border-[#EFEFEF] bg-[#FFFFFF] px-2.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-[#F5F5F5] text-[#525252]">
                      <SolarIcon name="crm" className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[#8C8C8C]">Entreprise</p>
                      <p className="truncate text-[13.5px] font-medium text-[#171717]">
                        {contact.company}
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-center justify-between gap-2 rounded-lg border border-[#EFEFEF] bg-[#FFFFFF] px-2.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-[#FEF2F2] text-[#EA4335]">
                        <SolarIcon name="mail" className="size-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12px] text-[#8C8C8C]">Email</p>
                        <p className="truncate text-[13px] font-medium text-[#171717]">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerFeedback(`Email ${contact.email} copié`)}
                      title="Copier l’email"
                      aria-label="Copier l’email"
                      className="shrink-0 rounded-md px-1.5 py-1 text-[12px] font-medium text-[#737373] opacity-0 transition group-hover:opacity-100 hover:bg-[#F5F5F5] hover:text-[#171717] cursor-pointer"
                    >
                      Copier
                    </button>
                  </div>

                  <div className="group flex items-center justify-between gap-2 rounded-lg border border-[#EFEFEF] bg-[#FFFFFF] px-2.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB]">
                        <SolarIcon name="phone" className="size-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12px] text-[#8C8C8C]">Téléphone</p>
                        <p className="truncate text-[13.5px] font-medium text-[#171717] tabular-nums">
                          {phoneDisplay}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerFeedback(`Numéro ${phoneDisplay} copié`)}
                      title="Copier le numéro"
                      aria-label="Copier le numéro"
                      className="shrink-0 rounded-md px-1.5 py-1 text-[12px] font-medium text-[#737373] opacity-0 transition group-hover:opacity-100 hover:bg-[#F5F5F5] hover:text-[#171717] cursor-pointer"
                    >
                      Copier
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-lg border border-[#EFEFEF] bg-[#FFFFFF] px-2.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E6F5F0] text-[12px] font-semibold text-[#00775B]">
                      TI
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] text-[#8C8C8C]">Responsable</p>
                      <p className="truncate text-[13px] font-medium text-[#171717]">
                        Tanjim Islam · <span className="text-[#008F6D]">Agent Thomas</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 2x3 KPI Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-start justify-between rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-3.5 transition hover:border-[#D4D4D4]">
                  <div>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-[#737373]">
                      <SolarIcon name="card" className="size-3.5 text-[#525252]" />
                      <span>Opportunité par étape</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[16px] font-semibold text-[#171717] tabular-nums">
                        {contact.opportunityValue}
                      </span>
                      <span className="rounded-md bg-[#DBEAFE] px-2 py-0.5 text-[12px] font-medium text-[#1D4ED8]">
                        {contact.stage}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("deals")}
                    aria-label="Voir les opportunités"
                    className="inline-flex size-6 items-center justify-center rounded-full border border-[#E5E5E5] text-[13px] text-[#737373] hover:bg-[#F5F5F5]"
                  >
                    &rsaquo;
                  </button>
                </div>

                <div className="flex items-start justify-between rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-3.5 transition hover:border-[#D4D4D4]">
                  <div>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-[#737373]">
                      <SolarIcon name="phone" className="size-3.5 text-[#008F6D]" />
                      <span>Dernier contact via</span>
                    </div>
                    <p className="mt-1.5 text-[14px] font-semibold text-[#171717]">
                      Appel entrant IA
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#8C8C8C]">Il y a 2 heures</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("timeline")}
                    aria-label="Voir la chronologie"
                    className="inline-flex size-6 items-center justify-center rounded-full border border-[#E5E5E5] text-[13px] text-[#737373] hover:bg-[#F5F5F5]"
                  >
                    &rsaquo;
                  </button>
                </div>

                <div className="flex items-start justify-between rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-3.5 transition hover:border-[#D4D4D4]">
                  <div>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-[#737373]">
                      <SolarIcon name="chart" className="size-3.5 text-[#525252]" />
                      <span>Devis récent</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[16px] font-semibold text-[#171717] tabular-nums">
                        4 200 €
                      </span>
                      <span className="rounded-md bg-[#E6F5F0] px-1.5 py-0.5 text-[12px] font-medium text-[#00775B]">
                        +18 %
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-[#8C8C8C]">{contact.company}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCreateInvoice(contact.company, contact.email)}
                    aria-label="Ouvrir le devis"
                    className="inline-flex size-6 items-center justify-center rounded-full border border-[#E5E5E5] text-[13px] text-[#737373] hover:bg-[#F5F5F5]"
                  >
                    &rsaquo;
                  </button>
                </div>

                <div className="flex items-start justify-between rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-3.5 transition hover:border-[#D4D4D4]">
                  <div>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-[#737373]">
                      <SolarIcon name="automation" className="size-3.5 text-[#008F6D]" />
                      <span>Séquences actives</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[16px] font-semibold text-[#171717] tabular-nums">
                        3
                      </span>
                      <span className="rounded-md bg-[#E6F5F0] px-1.5 py-0.5 text-[12px] font-medium text-[#00775B]">
                        Actif
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerFeedback("Ajouté à la séquence Relance B2B")}
                      className="mt-1 text-[12.5px] font-medium text-[#008F6D] hover:underline cursor-pointer"
                    >
                      + Ajouter à une séquence
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-3.5 transition hover:border-[#D4D4D4]">
                  <div>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-[#737373]">
                      <SolarIcon name="overview" className="size-3.5 text-[#525252]" />
                      <span>Prochain rendez-vous</span>
                    </div>
                    <p className="mt-1.5 text-[14px] font-semibold text-[#171717]">
                      Demain · 10:00
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[12.5px]">
                      <button
                        type="button"
                        onClick={() => triggerFeedback("Google Calendar synchronisé")}
                        className="font-medium text-[#008F6D] hover:underline cursor-pointer"
                      >
                        Synchro agenda
                      </button>
                      <span className="text-[#D4D4D4]">·</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("meetings")}
                        className="font-medium text-[#008F6D] hover:underline cursor-pointer"
                      >
                        Planifier
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-3.5 transition hover:border-[#D4D4D4]">
                  <div>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-[#737373]">
                      <SolarIcon name="sparkle" className="size-3.5 text-[#008F6D]" />
                      <span>Interactions IA</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[16px] font-semibold text-[#171717] tabular-nums">
                        12
                      </span>
                      <span className="rounded-md bg-[#E6F5F0] px-1.5 py-0.5 text-[12px] font-medium text-[#00775B]">
                        {contact.engagement} % eng.
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-[#8C8C8C]">Opt-in RGPD actif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Score généré par l'IA */}
          <div className="rounded-xl border border-[#B8E6D6] bg-[#FFFFFF] p-4 shadow-2xs">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex size-16 shrink-0 items-center justify-center">
                  <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden="true">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="#E6F5F0"
                      strokeWidth="6"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="#008F6D"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${2 * Math.PI * 26 * (1 - Math.min(100, Math.max(0, contact.score)) / 100)}`}
                    />
                  </svg>
                  <span className="absolute text-[15px] font-semibold text-[#171717] tabular-nums">
                    {contact.score}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#171717]">
                      <SolarIcon name="sparkle" className="size-4 text-[#008F6D]" />
                      Score prospect généré par l’IA
                    </span>
                    <span className="rounded-full bg-[#E6F5F0] px-2.5 py-0.5 text-[12px] font-medium text-[#00775B]">
                      {contact.tempLabel} · {contact.score}/100
                    </span>
                  </div>
                  <p className="mt-1 text-[13.5px] text-[#525252]">
                    {contact.score >= 75
                      ? "Signal d’achat élevé : décideur direct identifié, besoin urgent et créneau confirmé."
                      : "Prospect engagé : relance ciblée recommandée sous 48 h pour verrouiller un créneau."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[430px] lg:shrink-0">
                {[
                  {
                    label: "Intention d’achat",
                    pct: Math.min(98, contact.score + 4),
                  },
                  {
                    label: "Adéquation B2B",
                    pct: Math.min(95, Math.max(62, contact.score - 3)),
                  },
                  {
                    label: "Réactivité canal",
                    pct: Math.min(96, contact.engagement + 6),
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg border border-[#EFEFEF] bg-[#FAFAFA] px-3 py-2"
                  >
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#737373]">{metric.label}</span>
                      <span className="font-semibold text-[#171717] tabular-nums">
                        {metric.pct} %
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                      <div
                        className="h-full rounded-full bg-[#00B489]"
                        style={{ width: `${metric.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap items-center gap-6 border-b border-[#E5E5E5] px-1">
            {(
              [
                { id: "timeline" as const, label: "Chronologie" },
                { id: "notes" as const, label: "Notes", count: notes.length },
                { id: "tasks" as const, label: "Tâches", count: tasks.length },
                { id: "meetings" as const, label: "Rendez-vous", count: 2 },
                { id: "deals" as const, label: "Opportunités", count: 3 },
              ]
            ).map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 pb-2.5 text-[14px] transition-colors cursor-pointer ${
                    selected
                      ? "font-semibold text-[#008F6D]"
                      : "font-medium text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {"count" in tab && tab.count !== undefined && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[12px] tabular-nums ${
                        selected
                          ? "bg-[#E6F5F0] text-[#00775B]"
                          : "bg-[#EFEFEF] text-[#525252]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {selected && (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#008F6D]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content: Timeline */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              {/* Meeting Card */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
                <div className="flex items-center justify-between text-[13px] text-[#737373]">
                  <span>
                    <strong className="font-medium text-[#171717]">Rendez-vous</strong> créé par Agent Emma
                  </span>
                  <span>29 mars 2025 · 10:00</span>
                </div>

                <div className="mt-3 flex items-start gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-[13px] font-semibold text-[#1D4ED8]">
                    EM
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-[#171717]">
                      Présentation finale de la solution AutoCall
                    </p>
                    <p className="mt-0.5 text-[13.5px] text-[#525252]">
                      Réunion avec {contact.name} pour valider le déploiement multi-sites et la grille tarifaire.
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-wrap items-center gap-4 border-t border-[#F0F0F0] pt-3 text-[13px] text-[#737373]">
                  <span>
                    Lieu : <strong className="font-medium text-[#171717]">Visio Google Meet</strong>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    Priorité :
                    <span className="inline-flex items-center gap-1 rounded bg-[#FEF2F2] px-1.5 py-0.5 text-[12px] font-medium text-[#B91C1C]">
                      <span className="size-1.5 rounded-full bg-[#DC2626]" />
                      Haute
                    </span>
                  </span>
                  <span>
                    Assigné : <strong className="font-medium text-[#171717]">Tanjim Islam</strong>
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0F0F0] pt-3">
                  <span className="text-[13px] text-[#737373]">
                    Échéance : <strong className="font-medium text-[#171717]">29 mars 2025</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setMeetingCompleted((prev) => !prev)}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition cursor-pointer ${
                      meetingCompleted
                        ? "border-[#008F6D] bg-[#008F6D] text-white"
                        : "border-[#B8E6D6] bg-[#E6F5F0] text-[#00775B] hover:bg-[#D1FAE5]"
                    }`}
                  >
                    ✓ {meetingCompleted ? "Terminé" : "Marquer comme terminé"}
                  </button>
                </div>
              </div>

              {/* Green-tinted Note Card */}
              <div className="rounded-xl border border-[#B8E6D6] bg-[#F3FAF7] p-4">
                <div className="flex items-center justify-between text-[13px] text-[#525252]">
                  <span>
                    <strong className="font-medium text-[#00775B]">Note</strong> créée par {notes[0]?.author}
                  </span>
                  <span>{notes[0]?.date}</span>
                </div>
                <div className="mt-2.5 flex items-start gap-3">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF] text-[12px] font-semibold text-[#00775B] border border-[#B8E6D6]">
                    TI
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-[#171717]">
                      {notes[0]?.title}
                    </p>
                    <p className="mt-0.5 text-[13.5px] leading-relaxed text-[#404040]">
                      {notes[0]?.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Notes */}
          {activeTab === "notes" && (
            <div className="space-y-3 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Ajouter une note interne sur ce prospect..."
                  className="h-9.5 min-w-0 flex-1 rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#008F6D]"
                />
                <button
                  type="submit"
                  className="h-9.5 rounded-lg bg-[#171717] px-4 text-[14px] font-medium text-white hover:bg-[#262626] cursor-pointer"
                >
                  Ajouter
                </button>
              </form>
              <div className="space-y-2.5">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3.5"
                  >
                    <div className="flex items-center justify-between text-[12.5px] text-[#737373]">
                      <span className="font-medium text-[#171717]">{n.author}</span>
                      <span>{n.date}</span>
                    </div>
                    <p className="mt-1 text-[14px] font-semibold text-[#171717]">{n.title}</p>
                    <p className="mt-0.5 text-[13.5px] text-[#525252]">{n.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Tasks */}
          {activeTab === "tasks" && (
            <div className="space-y-3 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
              <form onSubmit={handleAddTask} className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Créer une tâche (ex: Rappeler pour signature)..."
                  className="h-9.5 min-w-0 flex-1 rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#008F6D]"
                />
                <input
                  type="text"
                  value={taskDueInput}
                  onChange={(e) => setTaskDueInput(e.target.value)}
                  placeholder="Échéance"
                  aria-label="Échéance de la tâche"
                  className="h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#008F6D] sm:w-36"
                />
                <button
                  type="submit"
                  className="h-9.5 rounded-lg bg-[#171717] px-4 text-[14px] font-medium text-white hover:bg-[#262626] cursor-pointer"
                >
                  Ajouter
                </button>
              </form>
              <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() =>
                    setTasks((prev) =>
                      prev.map((item) =>
                        item.id === task.id ? { ...item, done: !item.done } : item
                      )
                    )
                  }
                  className="flex items-center justify-between rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] p-3 cursor-pointer hover:border-[#D4D4D4]"
                >
                  <div className="flex items-center gap-3">
                    <PremiumCheckbox
                      checked={task.done}
                      onChange={(checked) =>
                        setTasks((prev) =>
                          prev.map((item) =>
                            item.id === task.id ? { ...item, done: checked } : item
                          )
                        )
                      }
                      ariaLabel={task.label}
                    />
                    <span
                      className={`text-[14px] ${
                        task.done
                          ? "text-[#8C8C8C] line-through"
                          : "font-medium text-[#171717]"
                      }`}
                    >
                      {task.label}
                    </span>
                  </div>
                  <span className="text-[12.5px] text-[#737373]">{task.due}</span>
                </div>
              ))}
              </div>
            </div>
          )}

          {/* Tab Content: Meetings */}
          {activeTab === "meetings" && (
            <div className="space-y-3 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
              <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3.5">
                <div>
                  <p className="text-[13.5px] font-semibold text-[#171717]">
                    Démonstration AutoCall IA · {contact.company}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#737373]">
                    Demain à 10:00 · Visio Google Meet · Avec Tanjim Islam
                  </p>
                </div>
                <span className="rounded-full bg-[#E6F5F0] px-2.5 py-0.5 text-[12px] font-medium text-[#00775B]">
                  Confirmé
                </span>
              </div>
            </div>
          )}

          {/* Tab Content: Deals */}
          {activeTab === "deals" && (
            <div className="space-y-3 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
              <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3.5">
                <div>
                  <p className="text-[13.5px] font-semibold text-[#171717]">
                    Abonnement annuel — {contact.company}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#737373]">
                    Étape : {contact.stage} · {contact.opportunityValue}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onCreateInvoice(contact.company, contact.email)}
                  className="inline-flex h-8.5 items-center rounded-lg bg-[#00B489] px-3 text-[13px] font-medium text-white hover:bg-[#009E78] cursor-pointer"
                >
                  Éditer le devis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
