"use client";

import { useEffect, useRef, useState } from "react";
import { type Locale, type NavIconName, SolarIcon } from "./workspace-navigation";

interface Citation {
  label: string;
}

interface ProposedAction {
  id: string;
  title: string;
  detail: string;
  status: "pending" | "approved" | "dismissed";
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  citations?: Citation[];
  action?: ProposedAction;
}

interface TopicChip {
  id: string;
  icon: NavIconName;
  color: string;
  label: Record<Locale, string>;
  prompt: Record<Locale, string>;
  reply: Record<Locale, string>;
  citations: Citation[];
  action?: {
    title: Record<Locale, string>;
    detail: Record<Locale, string>;
  };
}

const topicChips: TopicChip[] = [
  {
    id: "calls",
    icon: "phone",
    color: "var(--channel-phone)",
    label: {
      fr: "Appels & téléphonie",
      en: "Calls & telephony",
      es: "Llamadas y telefonía",
    },
    prompt: {
      fr: "Résume les appels entrants et manqués d’aujourd’hui",
      en: "Summarize today’s inbound and missed calls",
      es: "Resume las llamadas entrantes y perdidas de hoy",
    },
    reply: {
      fr: "Aujourd’hui, 47 appels ont été pris en charge : 39 traités par vos agents IA (taux de résolution 83 %) et 8 appels manqués nécessitant un rappel.",
      en: "Today, 47 calls were handled: 39 resolved by your AI agents (83% resolution rate) and 8 missed calls awaiting callback.",
      es: "Hoy se atendieron 47 llamadas: 39 resueltas por tus agentes IA (83 % de resolución) y 8 llamadas perdidas pendientes.",
    },
    citations: [{ label: "Téléphonie · 47 appels" }, { label: "Journal · Aujourd’hui" }],
    action: {
      title: {
        fr: "Programmer le rappel des 8 appels manqués",
        en: "Schedule callbacks for 8 missed calls",
        es: "Programar devolución de 8 llamadas perdidas",
      },
      detail: {
        fr: "Créneau proposé : 14 h 00 – 16 h 00 · Soumis à votre validation",
        en: "Suggested slot: 2:00 PM – 4:00 PM · Requires your approval",
        es: "Franja propuesta: 14:00 – 16:00 · Requiere tu aprobación",
      },
    },
  },
  {
    id: "crm",
    icon: "crm",
    color: "var(--info)",
    label: {
      fr: "Prospects & CRM",
      en: "Leads & CRM",
      es: "Prospectos y CRM",
    },
    prompt: {
      fr: "Quels prospects chauds doivent être rappelés en priorité ?",
      en: "Which warm leads should be called back first?",
      es: "¿Qué prospectos calientes deben ser llamados primero?",
    },
    reply: {
      fr: "14 prospects sont classés « Chauds » (score 75–100) suite aux échanges des dernières 48 h, dont 5 n’ont pas encore de rendez-vous planifié.",
      en: "14 leads are scored Hot (75–100) from the last 48h, including 5 without a scheduled meeting yet.",
      es: "14 prospectos figuran como Calientes (75–100) en las últimas 48 h, incluidos 5 sin cita programada.",
    },
    citations: [{ label: "CRM · 1 284 contacts" }, { label: "Pipeline · Qualifiés" }],
    action: {
      title: {
        fr: "Créer une liste de rappel prioritaire (5 prospects)",
        en: "Create priority callback list (5 leads)",
        es: "Crear lista prioritaria de llamadas (5 prospectos)",
      },
      detail: {
        fr: "Affectation : File sortante · Aucune action sans approbation",
        en: "Target: Outbound queue · No call placed without approval",
        es: "Destino: Cola saliente · Sin llamadas sin tu aprobación",
      },
    },
  },
  {
    id: "agents",
    icon: "agents",
    color: "var(--ai)",
    label: {
      fr: "Agents IA",
      en: "AI Agents",
      es: "Agentes IA",
    },
    prompt: {
      fr: "Analyse les performances de l’agent Accueil téléphonique",
      en: "Analyze the Reception AI agent performance",
      es: "Analiza el rendimiento del agente de recepción IA",
    },
    reply: {
      fr: "L’agent « Accueil téléphonique » affiche un temps moyen de réponse de 1,4 s, un taux de prise de rendez-vous de 94 % et aucune escalade bloquante sur les 7 derniers jours.",
      en: "The Reception agent averages a 1.4s response time, 94% booking accuracy, and zero blocking escalations over the last 7 days.",
      es: "El agente de recepción tiene un tiempo medio de 1,4 s, 94 % de precisión en citas y cero bloqueos en los últimos 7 días.",
    },
    citations: [{ label: "Agent · Accueil téléphonique" }, { label: "Supervision · 7 j" }],
  },
  {
    id: "campaigns",
    icon: "campaigns",
    color: "var(--channel-acquisition)",
    label: {
      fr: "Campagnes",
      en: "Campaigns",
      es: "Campañas",
    },
    prompt: {
      fr: "Prépare une campagne de relance pour les devis en attente",
      en: "Prepare a follow-up campaign for pending quotes",
      es: "Prepara una campaña de seguimiento para presupuestos pendientes",
    },
    reply: {
      fr: "8 devis envoyés il y a plus de 48 h sont éligibles à une relance (aucune opposition enregistrée, budget conforme).",
      en: "8 quotes sent over 48h ago are eligible for follow-up (no opt-outs, within budget).",
      es: "8 presupuestos enviados hace más de 48 h son elegibles para seguimiento (sin bajas, dentro del presupuesto).",
    },
    citations: [{ label: "Campagnes · Devis" }, { label: "Éligibilité · Vérifiée" }],
    action: {
      title: {
        fr: "Enregistrer le brouillon « Relance devis 48 h »",
        en: "Save draft “48h Quote Follow-up”",
        es: "Guardar borrador “Seguimiento presupuestos 48 h”",
      },
      detail: {
        fr: "8 destinataires · Mode assisté · Envoi manuel requis",
        en: "8 recipients · Assisted mode · Manual launch required",
        es: "8 destinatarios · Modo asistido · Envío manual requerido",
      },
    },
  },
  {
    id: "bookings",
    icon: "chart",
    color: "var(--brand-primary)",
    label: {
      fr: "Rendez-vous",
      en: "Bookings",
      es: "Citas",
    },
    prompt: {
      fr: "Combien de rendez-vous ont été confirmés cette semaine ?",
      en: "How many meetings were confirmed this week?",
      es: "¿Cuántas citas se confirmaron esta semana?",
    },
    reply: {
      fr: "48 rendez-vous ont été confirmés cette semaine sur Google Calendar et Outlook, avec 3 créneaux en attente de confirmation client.",
      en: "48 meetings were confirmed this week across Google Calendar and Outlook, with 3 slots awaiting client confirmation.",
      es: "Esta semana se confirmaron 48 citas entre Google Calendar y Outlook, con 3 horarios pendientes de confirmación.",
    },
    citations: [{ label: "Agenda · 48 confirmés" }, { label: "Synchronisation · Active" }],
  },
  {
    id: "credits",
    icon: "bolt",
    color: "var(--warning)",
    label: {
      fr: "Crédits & quotas",
      en: "Credits & quotas",
      es: "Créditos y cuotas",
    },
    prompt: {
      fr: "Quel est mon solde de crédits et ma consommation du mois ?",
      en: "What is my credit balance and monthly usage?",
      es: "¿Cuál es mi saldo de créditos y consumo mensual?",
    },
    reply: {
      fr: "Vous avez utilisé 891 / 1 000 crédits ce mois-ci (89,1 %). Le seuil d’attention à 80 % est dépassé ; il reste 109 crédits disponibles.",
      en: "You have used 891 / 1,000 credits this month (89.1%). The 80% warning threshold is crossed; 109 credits remain.",
      es: "Has utilizado 891 / 1 000 créditos este mes (89,1 %). Se superó el umbral del 80 %; quedan 109 créditos.",
    },
    citations: [{ label: "Quotas · 891/1000" }, { label: "Facturation · Mensuelle" }],
  },
];

const askCopy: Record<
  Locale,
  {
    aiBadge: string;
    greeting: string;
    headline: string;
    placeholder: string;
    send: string;
    reset: string;
    contextLabel: string;
    citationsLabel: string;
    approve: string;
    dismiss: string;
    approvedStatus: string;
    dismissedStatus: string;
    defaultReply: string;
    defaultActionTitle: string;
    defaultActionDetail: string;
  }
> = {
  fr: {
    aiBadge: "Assistant IA",
    greeting: "Bonjour Tanjim,",
    headline: "Comment puis-je vous aider ?",
    placeholder: "Posez une question sur vos appels, prospects ou campagnes...",
    send: "Envoyer",
    reset: "Nouvelle conversation",
    contextLabel: "Contexte",
    citationsLabel: "Sources",
    approve: "Approuver et exécuter",
    dismiss: "Ignorer",
    approvedStatus: "Action approuvée et exécutée",
    dismissedStatus: "Action ignorée",
    defaultReply:
      "D’après vos données récentes, 47 appels ont été traités aujourd’hui avec 12 rendez-vous confirmés et 8 devis en attente de relance.",
    defaultActionTitle: "Préparer une relance pour les 8 devis en attente",
    defaultActionDetail:
      "Aucune action ne sera lancée sans votre validation explicite.",
  },
  en: {
    aiBadge: "AI Assistant",
    greeting: "Hello Tanjim,",
    headline: "How can I help you?",
    placeholder: "Ask about your calls, leads, or campaigns...",
    send: "Send",
    reset: "New conversation",
    contextLabel: "Context",
    citationsLabel: "Sources",
    approve: "Approve & execute",
    dismiss: "Dismiss",
    approvedStatus: "Action approved and executed",
    dismissedStatus: "Action dismissed",
    defaultReply:
      "Based on your recent activity, 47 calls were handled today with 12 confirmed bookings and 8 quotes awaiting follow-up.",
    defaultActionTitle: "Prepare follow-up for 8 pending quotes",
    defaultActionDetail:
      "No action will run without your explicit confirmation.",
  },
  es: {
    aiBadge: "Asistente IA",
    greeting: "Hola Tanjim,",
    headline: "¿En qué puedo ayudarte?",
    placeholder: "Pregunta sobre tus llamadas, prospectos o campañas...",
    send: "Enviar",
    reset: "Nueva conversación",
    contextLabel: "Contexto",
    citationsLabel: "Fuentes",
    approve: "Aprobar y ejecutar",
    dismiss: "Ignorar",
    approvedStatus: "Acción aprobada y ejecutada",
    dismissedStatus: "Acción ignorada",
    defaultReply:
      "Según tu actividad reciente, hoy se atendieron 47 llamadas con 12 citas confirmadas y 8 presupuestos pendientes de seguimiento.",
    defaultActionTitle: "Preparar seguimiento de 8 presupuestos",
    defaultActionDetail:
      "No se ejecutará ninguna acción sin tu confirmación explícita.",
  },
};

function AutoCallPetalOrbSvg() {
  return (
    <div className="orb-crystal-group group relative inline-flex size-20 items-center justify-center rounded-full transition-transform duration-300 ease-out hover:scale-108">
      <svg
        aria-hidden="true"
        viewBox="0 0 96 96"
        className="size-20 shrink-0 drop-shadow-[0_6px_16px_rgba(0,143,109,0.16)] transition-[filter] duration-300 group-hover:drop-shadow-[0_10px_24px_rgba(0,143,109,0.28)]"
      >
        <defs>
          <clipPath id="crystal-sphere-clip">
            <circle cx="48" cy="48" r="35" />
          </clipPath>
          <radialGradient id="crystal-shell" cx="35%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="45%" stopColor="#E6F5F0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4776A8" stopOpacity="0.22" />
          </radialGradient>
          <radialGradient id="autocall-orb-core" cx="40%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#008F6D" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4776A8" stopOpacity="0.15" />
          </radialGradient>
          <linearGradient id="autocall-petal-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.68" />
          </linearGradient>
          <linearGradient id="autocall-petal-b" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#008F6D" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="crystal-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.68" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Enveloppe cristalline */}
        <circle cx="48" cy="48" r="35" fill="url(#crystal-shell)" />

        {/* Couches en révolution à l'intérieur de la sphère */}
        <g clipPath="url(#crystal-sphere-clip)">
          <circle
            cx="48"
            cy="48"
            r="34"
            fill="url(#autocall-orb-core)"
            className="orb-layer-breathe"
          />
          <g className="orb-layer-cw">
            <ellipse
              cx="52"
              cy="46"
              rx="32"
              ry="22"
              transform="rotate(-24 52 46)"
              fill="url(#autocall-petal-a)"
            />
          </g>
          <g className="orb-layer-ccw">
            <ellipse
              cx="45"
              cy="51"
              rx="31"
              ry="21"
              transform="rotate(34 45 51)"
              fill="url(#autocall-petal-b)"
            />
          </g>
          <g className="orb-layer-cw">
            <circle cx="37" cy="44" r="14" fill="#A7F3D0" fillOpacity="0.42" />
          </g>
        </g>

        {/* Reflet de verre supérieur et contour fin */}
        <ellipse
          cx="40"
          cy="29"
          rx="18"
          ry="9"
          transform="rotate(-18 40 29)"
          fill="url(#crystal-gloss)"
        />
        <circle
          cx="48"
          cy="48"
          r="34.5"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export function AskAutoCallView({
  locale,
  contextLabel,
}: {
  locale: Locale;
  contextLabel: string;
}) {
  const t = askCopy[locale];
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const nextIdRef = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submitPrompt = (promptText: string, matchedChip?: TopicChip) => {
    const trimmed = promptText.trim();
    if (!trimmed) return;

    const seq = nextIdRef.current++;
    const lower = trimmed.toLowerCase();
    const chip =
      matchedChip ??
      topicChips.find(
        (c) =>
          c.prompt[locale].toLowerCase() === lower ||
          (c.id === "calls" && (lower.includes("appel") || lower.includes("call") || lower.includes("llamada"))) ||
          (c.id === "crm" && (lower.includes("crm") || lower.includes("prospect") || lower.includes("lead"))) ||
          (c.id === "agents" && lower.includes("agent")) ||
          (c.id === "campaigns" && (lower.includes("campagn") || lower.includes("campaign") || lower.includes("devis"))) ||
          (c.id === "bookings" && (lower.includes("rendez") || lower.includes("meeting") || lower.includes("cita"))) ||
          (c.id === "credits" && (lower.includes("crédit") || lower.includes("credit") || lower.includes("quota"))),
      );

    const userMsg: ChatMessage = {
      id: `u-${seq}`,
      role: "user",
      text: trimmed,
    };

    const assistantMsg: ChatMessage = {
      id: `a-${seq}`,
      role: "assistant",
      text: chip ? chip.reply[locale] : t.defaultReply,
      citations: chip
        ? chip.citations
        : [{ label: "Appels · 47" }, { label: "CRM · 1 284" }],
      action: chip
        ? chip.action
          ? {
              id: `act-${seq}`,
              title: chip.action.title[locale],
              detail: chip.action.detail[locale],
              status: "pending",
            }
          : undefined
        : {
            id: `act-${seq}`,
            title: t.defaultActionTitle,
            detail: t.defaultActionDetail,
            status: "pending",
          },
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
  };

  const updateActionStatus = (
    messageId: string,
    status: "approved" | "dismissed",
  ) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.action
          ? { ...msg, action: { ...msg.action, status } }
          : msg,
      ),
    );
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex min-h-[calc(100dvh-52px)] flex-col bg-[var(--surface)]">
      {/* Barre discrète de contexte si une conversation est active */}
      {hasMessages && (
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 px-4 pt-5 sm:px-6">
          <span className="inline-flex h-8 items-center rounded-full border border-[var(--border)] bg-[var(--surface-hover)] px-3.5 text-[14px] font-medium text-[var(--text-secondary)]">
            {t.contextLabel} : {contextLabel}
          </span>
          <button
            type="button"
            onClick={() => setMessages([])}
            className="inline-flex h-8 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 text-[14px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] cursor-pointer"
          >
            {t.reset}
          </button>
        </div>
      )}

      {/* Contenu principal centré */}
      <div
        className={`mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6 ${
          hasMessages ? "justify-between py-6" : "items-center justify-center py-12"
        }`}
      >
        {!hasMessages ? (
          <div className="flex w-full flex-col items-center text-center">
            <AutoCallPetalOrbSvg />

            <h2 className="mt-5 text-[26px] font-semibold leading-[1.22] tracking-[-0.03em] sm:text-[32px]">
              <span className="block text-[var(--brand-text)]">
                {t.greeting}
              </span>
              <span className="block text-[var(--foreground)]">
                {t.headline}
              </span>
            </h2>

            {/* Pastilles de domaines */}
            <div className="mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2.5">
              {topicChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => submitPrompt(chip.prompt[locale], chip)}
                  className="inline-flex h-11 items-center gap-2.5 rounded-full bg-[var(--surface-hover)] px-4.5 text-[14px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-inset)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] cursor-pointer"
                >
                  <span style={{ color: chip.color }} className="inline-flex">
                    <SolarIcon name={chip.icon} className="size-[18px]" />
                  </span>
                  <span>{chip.label[locale]}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-5 overflow-y-auto pb-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[82%] rounded-2xl rounded-br-sm bg-[var(--surface-inset)] px-4 py-3 text-[15px] leading-relaxed text-[var(--foreground)]">
                    {msg.text}
                  </div>
                ) : (
                  <div className="w-full space-y-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xs">
                    <p className="text-[15px] leading-relaxed text-[var(--foreground)]">
                      {msg.text}
                    </p>

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-medium text-[var(--text-muted)]">
                          {t.citationsLabel} :
                        </span>
                        {msg.citations.map((c) => (
                          <span
                            key={c.label}
                            className="inline-flex items-center rounded-lg bg-[var(--brand-soft)] px-2.5 py-1 text-[14px] font-medium text-[var(--brand-text)]"
                          >
                            {c.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {msg.action && (
                      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-4">
                        <p className="text-[14px] font-semibold text-[var(--foreground)]">
                          {msg.action.title}
                        </p>
                        <p className="mt-1 text-[14px] text-[var(--text-muted)]">
                          {msg.action.detail}
                        </p>

                        {msg.action.status === "pending" ? (
                          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateActionStatus(msg.id, "approved")
                              }
                              className="inline-flex h-9 items-center justify-center rounded-xl bg-[var(--accent-action)] px-4 text-[13.5px] font-medium text-white transition-colors hover:bg-[var(--accent-action-hover)] active:bg-[var(--accent-action-pressed)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] cursor-pointer"
                            >
                              {t.approve}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateActionStatus(msg.id, "dismissed")
                              }
                              className="inline-flex h-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-[13.5px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-inset)] hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] cursor-pointer"
                            >
                              {t.dismiss}
                            </button>
                          </div>
                        ) : (
                          <p
                            className={`mt-3 text-[13.5px] font-medium ${
                              msg.action.status === "approved"
                                ? "text-[var(--success)]"
                                : "text-[var(--text-muted)]"
                            }`}
                          >
                            {msg.action.status === "approved"
                              ? t.approvedStatus
                              : t.dismissedStatus}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Barre de saisie en pilule en bas */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitPrompt(input);
          }}
          className={`w-full max-w-2xl ${hasMessages ? "sticky bottom-4" : "mt-10"}`}
        >
          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1.5 pr-1.5 pl-5 shadow-[0_2px_14px_rgba(23,23,23,0.06)] transition-colors focus-within:border-[var(--focus-ring)]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              className="h-10 min-w-0 flex-1 bg-transparent text-[15px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label={t.send}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-action)] text-white transition-colors hover:bg-[var(--accent-action-hover)] active:bg-[var(--accent-action-pressed)] disabled:bg-[var(--border)] disabled:text-[var(--text-disabled)] cursor-pointer disabled:cursor-default"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="size-4.5 translate-x-0.5"
                fill="currentColor"
              >
                <path d="M3.1 2.7a.75.75 0 0 1 .8-.1l13.2 6.6a.75.75 0 0 1 0 1.34L3.9 17.14a.75.75 0 0 1-1.06-.86l1.36-5.12a.75.75 0 0 1 .56-.53L9.8 9.6 4.76 8.57a.75.75 0 0 1-.56-.53L2.84 2.92a.75.75 0 0 1 .26-.22z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
