"use client";

import { useRef, useState } from "react";
import { type Locale, SolarIcon } from "./workspace-navigation";

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

const askCopy: Record<
  Locale,
  {
    title: string;
    contextLabel: string;
    close: string;
    placeholder: string;
    send: string;
    suggestions: string[];
    citationsLabel: string;
    approve: string;
    dismiss: string;
    approvedStatus: string;
    dismissedStatus: string;
    welcome: string;
    defaultReply: string;
    defaultActionTitle: string;
    defaultActionDetail: string;
  }
> = {
  fr: {
    title: "Ask AutoCall",
    contextLabel: "Contexte",
    close: "Fermer Ask AutoCall",
    placeholder: "Posez une question ou préparez une action...",
    send: "Envoyer",
    suggestions: [
      "Résumer les appels d’aujourd’hui",
      "Préparer une relance devis",
      "Analyser les conversions CRM",
    ],
    citationsLabel: "Sources",
    approve: "Approuver",
    dismiss: "Ignorer",
    approvedStatus: "Action approuvée et exécutée",
    dismissedStatus: "Action ignorée",
    welcome:
      "Posez une question sur vos appels, prospects ou campagnes. Chaque proposition d’action nécessite votre approbation.",
    defaultReply:
      "Voici la synthèse basée sur votre activité récente : 47 appels traités aujourd’hui avec 12 rendez-vous confirmés et 8 devis en attente de relance.",
    defaultActionTitle: "Préparer une campagne de relance devis",
    defaultActionDetail: "8 prospects éligibles · Envoi manuel après validation",
  },
  en: {
    title: "Ask AutoCall",
    contextLabel: "Context",
    close: "Close Ask AutoCall",
    placeholder: "Ask a question or prepare an action...",
    send: "Send",
    suggestions: [
      "Summarize today’s calls",
      "Prepare a quote follow-up",
      "Analyze CRM conversions",
    ],
    citationsLabel: "Sources",
    approve: "Approve",
    dismiss: "Dismiss",
    approvedStatus: "Action approved and executed",
    dismissedStatus: "Action dismissed",
    welcome:
      "Ask a question about your calls, leads, or campaigns. Every proposed action requires your explicit approval.",
    defaultReply:
      "Here is the summary based on recent activity: 47 calls handled today with 12 confirmed bookings and 8 quotes awaiting follow-up.",
    defaultActionTitle: "Prepare a quote follow-up campaign",
    defaultActionDetail: "8 eligible leads · Manual review before sending",
  },
  es: {
    title: "Ask AutoCall",
    contextLabel: "Contexto",
    close: "Cerrar Ask AutoCall",
    placeholder: "Haz una pregunta o prepara una acción...",
    send: "Enviar",
    suggestions: [
      "Resumir las llamadas de hoy",
      "Preparar seguimiento de presupuestos",
      "Analizar conversiones CRM",
    ],
    citationsLabel: "Fuentes",
    approve: "Aprobar",
    dismiss: "Ignorar",
    approvedStatus: "Acción aprobada y ejecutada",
    dismissedStatus: "Acción ignorada",
    welcome:
      "Haz una pregunta sobre tus llamadas, prospectos o campañas. Cada acción propuesta requiere tu aprobación.",
    defaultReply:
      "Resumen según tu actividad reciente: 47 llamadas atendidas hoy, 12 citas confirmadas y 8 presupuestos pendientes de seguimiento.",
    defaultActionTitle: "Preparar campaña de seguimiento",
    defaultActionDetail: "8 prospectos elegibles · Revisión manual previa",
  },
};

export function AskAutoCallPanel({
  locale,
  contextLabel,
  onClose,
}: {
  locale: Locale;
  contextLabel: string;
  onClose: () => void;
}) {
  const t = askCopy[locale];
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const nextIdRef = useRef(1);

  const submitPrompt = (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed) return;

    const seq = nextIdRef.current++;
    const userMsg: ChatMessage = {
      id: `u-${seq}`,
      role: "user",
      text: trimmed,
    };

    const assistantMsg: ChatMessage = {
      id: `a-${seq}`,
      role: "assistant",
      text: t.defaultReply,
      citations: [
        { label: "Appels · 47" },
        { label: "CRM · 284" },
      ],
      action: {
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

  return (
    <div
      role="dialog"
      aria-label={t.title}
      className="fixed top-14 right-3 z-40 flex max-h-[calc(100dvh-68px)] w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-xl sm:right-5 sm:w-[400px]"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between border-b border-[#EFEFEF] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#ECECEC] bg-white shadow-[0_1px_3px_rgba(23,23,23,0.06)]">
            <SolarIcon name="sparkle" className="size-4 text-[#171717]" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[13.5px] font-semibold tracking-[-0.01em] text-[#171717]">
              {t.title}
            </h2>
            <p className="truncate text-[12px] text-[#737373]">
              {t.contextLabel} : {contextLabel}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#525252] transition-colors hover:bg-[#F4F4F5] hover:text-[#171717] cursor-pointer"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>

      {/* Corps de conversation */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3 text-[13.5px] leading-5 text-[#525252]">
              {t.welcome}
            </p>
            <div className="space-y-1.5">
              {t.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => submitPrompt(suggestion)}
                  className="flex w-full items-center justify-between rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-left text-[13.5px] text-[#171717] transition-colors hover:bg-[#F7F7F8] cursor-pointer"
                >
                  <span className="truncate">{suggestion}</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="size-3.5 shrink-0 text-[#8C8C8C]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 4l4 4-4 4" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {msg.role === "user" ? (
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#171717] px-3.5 py-2 text-[13.5px] leading-5 text-white">
                  {msg.text}
                </div>
              ) : (
                <div className="w-full space-y-2.5 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3">
                  <p className="text-[13.5px] leading-5 text-[#171717]">
                    {msg.text}
                  </p>

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[12px] font-medium text-[#737373]">
                        {t.citationsLabel} :
                      </span>
                      {msg.citations.map((c) => (
                        <span
                          key={c.label}
                          className="inline-flex items-center rounded-md border border-[#E5E5E5] bg-white px-2 py-0.5 text-[12px] font-medium text-[#525252]"
                        >
                          {c.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {msg.action && (
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-2.5 shadow-2xs">
                      <p className="text-[13px] font-semibold text-[#171717]">
                        {msg.action.title}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#737373]">
                        {msg.action.detail}
                      </p>

                      {msg.action.status === "pending" ? (
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateActionStatus(msg.id, "approved")
                            }
                            className="inline-flex h-7.5 flex-1 items-center justify-center rounded-lg bg-[#171717] px-3 text-[13px] font-medium text-white transition-colors hover:bg-[#2E2E2E] cursor-pointer"
                          >
                            {t.approve}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateActionStatus(msg.id, "dismissed")
                            }
                            className="inline-flex h-7.5 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white px-3 text-[13px] font-medium text-[#525252] transition-colors hover:bg-[#F4F4F5] hover:text-[#171717] cursor-pointer"
                          >
                            {t.dismiss}
                          </button>
                        </div>
                      ) : (
                        <p
                          className={`mt-2 text-[12.5px] font-medium ${
                            msg.action.status === "approved"
                              ? "text-[#15803D]"
                              : "text-[#737373]"
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
          ))
        )}
      </div>

      {/* Zone de saisie */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitPrompt(input);
        }}
        className="border-t border-[#EFEFEF] bg-white p-3"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
            className="h-9 min-w-0 flex-1 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-3 text-[13.5px] text-[#171717] placeholder:text-[#8C8C8C] transition-colors focus:border-[#A3A3A3] focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label={t.send}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl bg-[#171717] px-3 text-[13.5px] font-medium text-white transition-colors hover:bg-[#2E2E2E] disabled:opacity-40 cursor-pointer disabled:cursor-default"
          >
            {t.send}
          </button>
        </div>
      </form>
    </div>
  );
}

