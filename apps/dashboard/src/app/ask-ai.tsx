"use client";

import { useEffect, useId, useRef, useState } from "react";

// ==================================================
// AUTOCALL — ASK AI
// Logo 3D animé + Hover + Assistant conversationnel
// ==================================================

type Message = {
  role: "user" | "assistant";
  content: string;
};

type AskAIProps = {
  onSend?: (message: string) => Promise<string>;
  enableVoice?: boolean;
};

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ==================================================
// 1. LOGO AUTOCALL 3D
// ==================================================

export function AskAILogo() {
  const id = useId();

  const shape =
    "M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z";

  return (
    <svg
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-front`} x1="0%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#A1D3B1" />
          <stop offset="25%" stopColor="#68AC86" />
          <stop offset="60%" stopColor="#408963" />
          <stop offset="100%" stopColor="#347453" />
        </linearGradient>

        <linearGradient id={`${id}-depth`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86BD9B" />
          <stop offset="100%" stopColor="#397F5C" />
        </linearGradient>
      </defs>

      {/* Profondeur du logo */}
      <path d={shape} fill={`url(#${id}-depth)`} transform="translate(2.5 3)" />

      {/* Surface principale */}
      <path
        d={shape}
        fill={`url(#${id}-front)`}
        stroke="#9BC8A9"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/* Reflet lumineux */}
      <path
        d="M15 27C16 18 23 13 31 13"
        stroke="#D3F1DC"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.65"
        fill="none"
      />
    </svg>
  );
}

// ==================================================
// 2. SUGGESTIONS DE QUESTIONS
// ==================================================

const suggestions = [
  {
    icon: PhoneIcon,
    text: "Résumer mes derniers appels",
  },
  {
    icon: UsersIcon,
    text: "Identifier mes prospects chauds",
  },
  {
    icon: BarChart3Fallback,
    text: "Analyser mes performances",
  },
];

function BarChart3Fallback() {
  return <BarChartIcon />;
}

async function defaultReply(prompt: string): Promise<string> {
  await new Promise((resolve) => window.setTimeout(resolve, 450));
  const q = prompt.toLowerCase();
  if (q.includes("appel") || q.includes("résum")) {
    return "Derniers appels : Marc Dupont (10:42 · 4 min 32 s, demande de devis 200 m² traitée par Thomas) et Claire Moreau (relance copropriétés, passage en conseil syndical mardi).";
  }
  if (q.includes("prospect") || q.includes("chaud")) {
    return "3 prospects prioritaires identifiés : Sophie Bernard (WhatsApp · urgent vendredi), Marc Dupont (devis bureaux 200 m²) et Nova Logistique (compte multi-sites 400 m²).";
  }
  if (q.includes("perform") || q.includes("stat")) {
    return "Performance du jour : 847 appels traités, 34,2 % de taux de transfert qualifié et 18,6 % de conversion globale (+18 % ce mois).";
  }
  return `Bien reçu : « ${prompt} ». Votre assistant AutoCall est prêt à analyser vos appels, campagnes et contacts CRM.`;
}

// ==================================================
// 3. COMPOSANT PRINCIPAL
// ==================================================

export default function AskAI({ onSend, enableVoice = false }: AskAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  const panelId = useId();

  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  function closePanel() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleOpenCustomEvent(event: Event) {
      const custom = event as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      if (custom.detail?.prompt) {
        setMessage(custom.detail.prompt);
      }
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
    window.addEventListener("autocall:open-ask-ai", handleOpenCustomEvent);
    return () => {
      window.removeEventListener("autocall:open-ask-ai", handleOpenCustomEvent);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
    });
  }, [messages, isLoading, isOpen]);

  function handleVoiceInput() {
    setError("");
    const win = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
    };
    const Recognition = win.SpeechRecognition ?? win.webkitSpeechRecognition;
    if (!Recognition) {
      setError("La dictée vocale n’est pas prise en charge par ce navigateur.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) {
        setMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onerror = () => {
      setIsListening(false);
      setError("Impossible d’accéder au microphone.");
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
  }

  async function handleSend() {
    const content = message.trim();
    if (!content || isLoading) return;

    setError("");
    setMessages((previous) => [...previous, { role: "user", content }]);
    setMessage("");
    setIsLoading(true);

    try {
      const responder = onSend ?? defaultReply;
      const response = await responder(content);
      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: response },
      ]);
    } catch {
      setError("Impossible de contacter l’assistant. Réessayez.");
      setMessages((previous) => previous.slice(0, -1));
      setMessage(content);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="autocall-ask-ai">
        {/* PANNEAU DE CONVERSATION */}
        {isOpen && (
          <section
            id={panelId}
            className="ask-ai-panel"
            role="dialog"
            aria-label="Assistant AutoCall"
            aria-modal="false"
          >
            <header className="ask-ai-header">
              <div className="ask-ai-header-brand">
                <div className="ask-ai-header-logo">
                  <AskAILogo />
                </div>
                <span>Ask AI</span>
              </div>

              <button
                type="button"
                className="ask-ai-close"
                onClick={closePanel}
                aria-label="Fermer Ask AI"
              >
                <CloseIcon />
              </button>
            </header>

            <div className="ask-ai-content">
              {messages.length === 0 ? (
                <>
                  <h2 className="ask-ai-title">
                    Comment puis-je vous aider ?
                  </h2>

                  <p className="ask-ai-description">
                    Toute votre activité, à portée de conversation.
                  </p>

                  <div className="ask-ai-suggestions">
                    {suggestions.map(({ icon: Icon, text }) => (
                      <button
                        key={text}
                        type="button"
                        className="ask-ai-suggestion"
                        disabled={isLoading}
                        onClick={() => {
                          setMessage(text);
                          inputRef.current?.focus();
                        }}
                      >
                        <Icon />
                        <span>{text}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="ask-ai-messages" aria-live="polite">
                  {messages.map((item, index) => (
                    <div
                      key={index}
                      className={
                        item.role === "user"
                          ? "ask-ai-message-user"
                          : "ask-ai-message-assistant"
                      }
                    >
                      {item.content}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="ask-ai-thinking">
                      <div className="ask-ai-thinking-logo">
                        <AskAILogo />
                      </div>
                      AutoCall réfléchit...
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              )}

              <form
                className="ask-ai-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSend();
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={
                    isListening
                      ? "Écoute en cours..."
                      : "Demandez à AutoCall..."
                  }
                  aria-label="Votre question"
                  disabled={isLoading}
                  autoComplete="off"
                />

                {enableVoice && (
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    disabled={isLoading}
                    aria-label="Parler à l’assistant"
                    title="Parler à l’assistant (micro)"
                    className={`inline-flex size-8.5 shrink-0 items-center justify-center rounded-lg border transition cursor-pointer ${
                      isListening
                        ? "border-[#008F6D] bg-[#EAF3ED] text-[#184D3B]"
                        : "border-transparent text-[#6F7B73] hover:bg-[#F3F5F3]"
                    }`}
                  >
                    <MicIcon />
                  </button>
                )}

                <button
                  type="submit"
                  className="ask-ai-send"
                  disabled={!message.trim() || isLoading}
                  aria-label="Envoyer le message"
                >
                  <ArrowUpIcon />
                </button>
              </form>

              {error && (
                <p className="ask-ai-error" role="alert">
                  {error}
                </p>
              )}

              <p className="ask-ai-footer">Powered by AutoCall</p>
            </div>
          </section>
        )}

        {/* BOUTON FLOTTANT INTERACTIF */}
        <button
          ref={triggerRef}
          type="button"
          className="ask-ai-trigger"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label={isOpen ? "Fermer Ask AI" : "Ouvrir Ask AI"}
          aria-expanded={isOpen}
          aria-controls={isOpen ? panelId : undefined}
        >
          <span className="ask-ai-logo">
            <AskAILogo />
          </span>
          <span className="ask-ai-label">Ask AI</span>
        </button>
      </div>

      {/* DESIGN SYSTEM ET ANIMATIONS CSS */}
      <style>{`
        .autocall-ask-ai {
          --ask-primary: #184D3B;
          --ask-green: #408963;
          --ask-light: #EAF3ED;
          --ask-border: #E1E9E3;
          --ask-muted: #849087;

          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 50;

          font-family: inherit;
          color: #202723;
          -webkit-font-smoothing: antialiased;
        }

        .autocall-ask-ai *,
        .autocall-ask-ai *::before,
        .autocall-ask-ai *::after {
          box-sizing: border-box;
        }

        .autocall-ask-ai button,
        .autocall-ask-ai input {
          font-family: inherit;
        }

        .ask-ai-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 62px;
          padding: 6px 8px;
          gap: 0;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(8px);
          border: 1px solid #E1E9E3;
          border-radius: 9999px;
          box-shadow:
            0 10px 28px rgba(24, 77, 59, 0.14),
            0 2px 8px rgba(24, 77, 59, 0.06);
          cursor: pointer;
          perspective: 600px;
          transition:
            padding 320ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 300ms ease,
            transform 250ms ease;
          -webkit-tap-highlight-color: transparent;
        }

        .ask-ai-logo {
          display: block;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          animation: askAiFloat 4s ease-in-out infinite;
          filter: drop-shadow(2px 4px 4px rgba(82, 145, 107, 0.16));
          transition: filter 400ms ease;
        }

        .ask-ai-label {
          display: block;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          white-space: nowrap;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.4px;
          line-height: 1.5;
          color: #286B4E;
          transform: translateX(-8px);
          transition:
            max-width 400ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 250ms ease,
            margin-left 300ms ease,
            transform 400ms ease;
        }

        @media (hover: hover) {
          .ask-ai-trigger:hover {
            padding: 6px 14px 6px 8px;
            box-shadow:
              0 14px 34px rgba(24, 77, 59, 0.18),
              0 4px 12px rgba(24, 77, 59, 0.08);
          }

          .ask-ai-trigger:hover .ask-ai-label {
            max-width: 100px;
            margin-left: 6px;
            opacity: 1;
            transform: translateX(0);
          }

          .ask-ai-trigger:hover .ask-ai-logo {
            filter: drop-shadow(0 4px 8px rgba(111, 179, 140, 0.35));
          }
        }

        .ask-ai-trigger:focus-visible .ask-ai-label {
          max-width: 100px;
          margin-left: 6px;
          opacity: 1;
          transform: translateX(0);
        }

        .ask-ai-trigger:focus-visible {
          outline: 2px solid #68AC86;
          outline-offset: 4px;
        }

        .ask-ai-trigger:active .ask-ai-logo {
          animation-play-state: paused;
        }

        @keyframes askAiFloat {
          0%, 100% {
            transform: translateY(0) rotateY(-8deg);
          }
          50% {
            transform: translateY(-4px) rotateY(10deg);
          }
        }

        .ask-ai-panel {
          position: absolute;
          right: 0;
          bottom: 76px;
          width: min(380px, calc(100vw - 48px));
          max-height: calc(100dvh - 120px);
          overflow-y: auto;
          background: #FFFFFF;
          border: 1px solid var(--ask-border);
          border-radius: 20px;
          box-shadow:
            0 16px 48px rgba(24, 77, 59, 0.10),
            0 2px 8px rgba(24, 77, 59, 0.04);
          transform-origin: bottom right;
          animation: askAiPanelOpen 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes askAiPanelOpen {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .ask-ai-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #F0F2F0;
        }

        .ask-ai-header-brand {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.3px;
          color: var(--ask-primary);
        }

        .ask-ai-header-logo {
          width: 34px;
          height: 34px;
        }

        .ask-ai-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          color: #8A938C;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 200ms ease;
        }

        .ask-ai-close:hover {
          background: #F3F5F3;
          color: #202723;
        }

        .ask-ai-content {
          padding: 22px;
        }

        .ask-ai-title {
          margin: 0;
          font-size: 21px;
          font-weight: 600;
          letter-spacing: -0.6px;
          line-height: 1.3;
          color: #202723;
        }

        .ask-ai-description {
          margin: 8px 0 20px;
          font-size: 13.5px;
          line-height: 1.6;
          color: #7F8982;
        }

        .ask-ai-suggestions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ask-ai-suggestion {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          background: #FFFFFF;
          border: 1px solid #E8EDE9;
          border-radius: 10px;
          font-size: 13.5px;
          line-height: 1.4;
          text-align: left;
          color: #45524A;
          cursor: pointer;
          transition:
            background 200ms ease,
            border-color 200ms ease,
            transform 200ms ease;
        }

        .ask-ai-suggestion svg {
          color: var(--ask-green);
          flex-shrink: 0;
        }

        .ask-ai-suggestion:hover {
          background: #F3F8F4;
          border-color: #D6E5DA;
          transform: translateX(2px);
        }

        .ask-ai-messages {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 320px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #D8E6DB transparent;
        }

        .ask-ai-message-user {
          align-self: flex-end;
          max-width: 85%;
          padding: 10px 14px;
          background: var(--ask-light);
          color: var(--ask-primary);
          border-radius: 16px 16px 4px 16px;
          font-size: 13.5px;
          line-height: 1.55;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
        }

        .ask-ai-message-assistant {
          align-self: flex-start;
          max-width: 95%;
          padding: 4px 0;
          color: #36423A;
          font-size: 13.5px;
          line-height: 1.65;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
        }

        .ask-ai-thinking {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--ask-green);
          font-size: 13px;
        }

        .ask-ai-thinking-logo {
          width: 28px;
          height: 28px;
          animation: askAiPulse 1.5s ease-in-out infinite;
        }

        @keyframes askAiPulse {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        .ask-ai-form {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          margin-top: 20px;
          border: 1px solid #DFE7E1;
          border-radius: 12px;
          background: #FFFFFF;
          transition: border-color 200ms ease;
        }

        .ask-ai-form:focus-within {
          border-color: #68AC86;
        }

        .ask-ai-form input {
          flex: 1;
          min-width: 0;
          padding: 8px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 13.5px;
          color: #202723;
        }

        .ask-ai-form input::placeholder {
          color: #9BA49D;
        }

        .ask-ai-send {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          background: var(--ask-green);
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition:
            background 200ms ease,
            opacity 200ms ease;
        }

        .ask-ai-send:hover:not(:disabled) {
          background: #347453;
        }

        .ask-ai-send:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ask-ai-suggestion:focus-visible,
        .ask-ai-close:focus-visible,
        .ask-ai-send:focus-visible {
          outline: 2px solid #68AC86;
          outline-offset: 2px;
        }

        .ask-ai-footer {
          margin: 12px 0 0;
          text-align: center;
          font-size: 12px;
          font-weight: 400;
          color: #9AA49C;
        }

        .ask-ai-error {
          margin: 8px 0 0;
          font-size: 12.5px;
          color: #B42318;
        }

        @media (max-width: 640px) {
          .autocall-ask-ai {
            right: 16px;
            bottom: 16px;
          }

          .ask-ai-logo {
            width: 44px;
            height: 44px;
          }

          .ask-ai-trigger {
            height: 56px;
          }

          .ask-ai-panel {
            width: min(380px, calc(100vw - 32px));
            bottom: 66px;
          }

          .ask-ai-content {
            padding: 18px;
          }

          .ask-ai-title {
            font-size: 19px;
          }

          .ask-ai-form input {
            font-size: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ask-ai-logo,
          .ask-ai-thinking-logo,
          .ask-ai-panel {
            animation: none !important;
          }

          .ask-ai-trigger,
          .ask-ai-logo,
          .ask-ai-label,
          .ask-ai-suggestion {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}

