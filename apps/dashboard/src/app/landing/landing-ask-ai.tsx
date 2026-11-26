"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AskAILogo } from "../ask-ai";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const LANDING_SUGGESTIONS = [
  {
    id: "how",
    text: "Comment fonctionne AutoCall pour mon entreprise ?",
  },
  {
    id: "pricing",
    text: "Quels sont vos tarifs et forfaits ?",
  },
  {
    id: "demo",
    text: "Je souhaite être rappelé ou voir une démo",
  },
];

async function generateLandingReply(prompt: string): Promise<string> {
  await new Promise((resolve) => window.setTimeout(resolve, 450));
  const q = prompt.toLowerCase();

  if (q.includes("tarif") || q.includes("prix") || q.includes("forfait") || q.includes("coût")) {
    return "Nos forfaits démarrent avec Découverte (0 €/mois pour tester), puis Pro à 49 €/mois (6 agents IA, 2 500 minutes d’appels) et Scale à 129 €/mois. Vous économisez 20 % en annuel.";
  }
  if (q.includes("fonctionn") || q.includes("comment") || q.includes("entreprise")) {
    return "AutoCall répond à tous vos appels en moins de 3 secondes 24/7 grâce à des agents vocaux IA naturels, qualifie le besoin du client, prend rendez-vous dans votre agenda et enregistre la fiche + le résumé dans votre CRM.";
  }
  if (q.includes("rappel") || q.includes("démo") || q.includes("demo") || q.includes("contact")) {
    return "Avec plaisir ! Indiquez-moi simplement votre prénom, votre entreprise et votre numéro ou e-mail (à l’écrit ou au micro) pour que notre équipe vous recontacte rapidement.";
  }
  if (q.includes("@") || /\d{8,}/.test(q.replace(/\s+/g, ""))) {
    return "Merci, vos coordonnées ont bien été transmises à notre équipe commerciale. Vous serez recontacté très rapidement !";
  }
  return "AutoCall automatise votre accueil téléphonique, vos relances et la prise de rendez-vous 24/7. Souhaitez-vous connaître nos tarifs, voir comment l’installer ou demander un rappel ?";
}

export function LandingAskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(true);
  const [error, setError] = useState("");

  const panelId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Bulle d'accroche proactive à l'arrivée sur la landing page
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowNudge(true);
    }, 1100);
    return () => window.clearTimeout(timer);
  }, []);

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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto", block: "nearest" });
  }, [messages, isLoading, isOpen]);

  function speakText(text: string) {
    if (!voiceReplyEnabled || typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 1.03;
    window.speechSynthesis.speak(utterance);
  }

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

  async function sendText(rawText?: string) {
    const content = (rawText ?? message).trim();
    if (!content || isLoading) return;

    setError("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    if (!rawText) setMessage("");
    setIsLoading(true);

    try {
      const reply = await generateLandingReply(content);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      speakText(reply);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {/* PANNEAU VISITEUR LANDING PAGE */}
      {isOpen && (
        <section
          id={panelId}
          role="dialog"
          aria-label="Guide visiteur AutoCall"
          className="w-[min(390px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-[0_18px_48px_rgba(24,77,59,0.14)]"
        >
          {/* En-tête */}
          <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="size-8">
                <AskAILogo />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#184D3B]">
                  Assistant AutoCall
                </p>
                <p className="text-[13px] text-gray-500">
                  Posez vos questions à l’écrit ou à l’oral
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setVoiceReplyEnabled((v) => !v);
                  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                }}
                title={
                  voiceReplyEnabled
                    ? "Désactiver la réponse vocale"
                    : "Activer la réponse vocale"
                }
                aria-label="Basculer la réponse vocale"
                className={`inline-flex size-8 items-center justify-center rounded-lg transition cursor-pointer ${
                  voiceReplyEnabled
                    ? "bg-[#EAF3ED] text-[#184D3B]"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
                  {voiceReplyEnabled ? (
                    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" />
                  ) : (
                    <path d="m21 9-6 6M15 9l6 6" strokeLinecap="round" />
                  )}
                </svg>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="Fermer l’assistant"
                className="inline-flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </header>

          {/* Corps */}
          <div className="p-4">
            {messages.length === 0 ? (
              <div>
                <h2 className="text-[19px] font-semibold tracking-tight text-gray-900">
                  Bonjour, je vous guide sur AutoCall.
                </h2>
                <p className="mt-1 text-[14px] leading-relaxed text-gray-500">
                  Posez-moi vos questions par écrit ou cliquez sur le micro pour me parler directement.
                </p>

                <div className="mt-4 space-y-2">
                  {LANDING_SUGGESTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => void sendText(item.text)}
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#E5ECE7] bg-white px-3.5 py-2.5 text-left text-[14px] text-gray-700 transition hover:border-[#C6DDD0] hover:bg-[#F4F9F6] cursor-pointer"
                    >
                      <span>{item.text}</span>
                      <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-[#408963]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto pr-1" aria-live="polite">
                {messages.map((item, idx) => (
                  <div
                    key={idx}
                    className={
                      item.role === "user"
                        ? "self-end max-w-[85%] rounded-2xl rounded-br-xs bg-[#EAF3ED] px-3.5 py-2.5 text-[14px] leading-relaxed text-[#184D3B]"
                        : "self-start max-w-[92%] py-1 text-[14px] leading-relaxed text-gray-700"
                    }
                  >
                    {item.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-[13.5px] text-[#408963]">
                    <div className="size-6 animate-pulse">
                      <AskAILogo />
                    </div>
                    <span>AutoCall répond...</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}

            {/* Barre de saisie + micro */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendText();
              }}
              className="mt-4 flex items-center gap-1.5 rounded-xl border border-[#DCE6DF] bg-white p-1.5 focus-within:border-[#408963]"
            >
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isListening
                    ? "Je vous écoute..."
                    : "Écrivez ou parlez avec le micro..."
                }
                aria-label="Message pour l’assistant AutoCall"
                disabled={isLoading}
                className="min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />

              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={isLoading}
                aria-label="Parler au microphone"
                title="Parler au microphone"
                className={`inline-flex size-8.5 shrink-0 items-center justify-center rounded-lg transition cursor-pointer ${
                  isListening
                    ? "bg-[#EAF3ED] text-[#184D3B] ring-1 ring-[#408963]"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="9" y="3" width="6" height="11" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
                </svg>
              </button>

              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                aria-label="Envoyer"
                className="inline-flex size-8.5 shrink-0 items-center justify-center rounded-lg bg-[#408963] text-white transition hover:bg-[#347453] disabled:opacity-40 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            {error && (
              <p className="mt-2 text-[13px] text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>
        </section>
      )}

      {/* BULLE D'ACCROCHE PROACTIVE POUR ATTIRER L'ATTENTION */}
      {!isOpen && showNudge && (
        <div className="flex items-center gap-2 rounded-2xl border border-[#DCE6DF] bg-white/95 px-3.5 py-2.5 text-[13.5px] text-gray-800 shadow-[0_10px_28px_rgba(24,77,59,0.12)] backdrop-blur-xs animate-[fadeInUp_350ms_ease-out]">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-left hover:text-[#184D3B] cursor-pointer"
          >
            <span className="font-semibold text-[#184D3B]">
              Besoin d’un renseignement ?
            </span>{" "}
            <span className="text-gray-600">
              Parlez ou écrivez à notre assistant.
            </span>
          </button>
          <button
            type="button"
            onClick={() => setShowNudge(false)}
            aria-label="Masquer l’invitation"
            className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* BOUTON FLOTTANT 3D AVEC HALO D'ATTENTION */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setShowNudge(false);
          setIsOpen((v) => !v);
        }}
        aria-label={isOpen ? "Fermer l’assistant" : "Parler à l’assistant AutoCall"}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        className="group relative flex h-15 items-center rounded-full border border-[#E1E9E3] bg-white/95 px-2 shadow-[0_10px_28px_rgba(24,77,59,0.15),0_2px_8px_rgba(24,77,59,0.06)] backdrop-blur-xs transition-all hover:px-3.5 hover:shadow-[0_14px_34px_rgba(24,77,59,0.2)] cursor-pointer"
      >
        {!isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full bg-[#00B489]/20 animate-ping"
            style={{ animationDuration: "2.8s" }}
          />
        )}
        <span className="relative block size-11.5 shrink-0" style={{ perspective: "600px" }}>
          {/* Sphère 3D turquoise striée en révolution continue */}
          <svg
            viewBox="0 0 64 64"
            className="absolute inset-0 size-full animate-[orbPhase_6s_ease-in-out_infinite]"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="landing-orb-grad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#A7F3D0" />
                <stop offset="45%" stopColor="#2DD4BF" />
                <stop offset="85%" stopColor="#0D9488" />
                <stop offset="100%" stopColor="#065F46" />
              </radialGradient>
              <clipPath id="landing-orb-clip">
                <circle cx="32" cy="32" r="28" />
              </clipPath>
            </defs>
            <circle cx="32" cy="32" r="28" fill="url(#landing-orb-grad)" />
            <g clipPath="url(#landing-orb-clip)">
              <g className="animate-[orbRevolution_2.6s_linear_infinite]">
                <ellipse cx="14" cy="32" rx="10" ry="28" fill="none" stroke="#FFFFFF" strokeOpacity="0.34" strokeWidth="1.6" />
                <ellipse cx="32" cy="32" rx="14" ry="28" fill="none" stroke="#FFFFFF" strokeOpacity="0.38" strokeWidth="1.6" />
                <ellipse cx="50" cy="32" rx="10" ry="28" fill="none" stroke="#047857" strokeOpacity="0.30" strokeWidth="1.5" />
                <ellipse cx="68" cy="32" rx="14" ry="28" fill="none" stroke="#FFFFFF" strokeOpacity="0.34" strokeWidth="1.6" />
              </g>
            </g>
            <circle cx="23" cy="21" r="7" fill="#FFFFFF" fillOpacity="0.22" />
          </svg>

          {/* Logo AutoCall 3D qui prend le relais */}
          <span className="absolute inset-0 block size-full animate-[logoPhase_6s_ease-in-out_infinite]">
            <AskAILogo />
          </span>
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[14.5px] font-semibold text-[#184D3B] opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[140px] group-hover:opacity-100">
          Parler à l’IA
        </span>
      </button>

      <style>{`
        @keyframes orbRevolution {
          0% {
            transform: translateX(-18px);
          }
          100% {
            transform: translateX(18px);
          }
        }
        @keyframes orbPhase {
          0%, 38% {
            opacity: 1;
            transform: rotateY(0deg) scale(1);
          }
          48%, 88% {
            opacity: 0;
            transform: rotateY(90deg) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: rotateY(360deg) scale(1);
          }
        }
        @keyframes logoPhase {
          0%, 42% {
            opacity: 0;
            transform: rotateY(-90deg) scale(0.8);
          }
          52%, 84% {
            opacity: 1;
            transform: rotateY(0deg) scale(1);
          }
          95%, 100% {
            opacity: 0;
            transform: rotateY(90deg) scale(0.8);
          }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

