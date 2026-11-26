"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AskAILogo } from "../ask-ai";
import { type SuperAdminSectionNavTarget } from "./super-admin-overview";

interface AdvisorAction {
  label: string;
  section: SuperAdminSectionNavTarget;
  tab?: string;
}

interface AdvisorMessage {
  role: "user" | "assistant";
  content: string;
  badge?: string;
  action?: AdvisorAction;
}

interface AdvisorSuggestion {
  id: string;
  title: string;
  prompt: string;
}

const SUGGESTIONS_BY_SECTION: Record<
  SuperAdminSectionNavTarget,
  AdvisorSuggestion[]
> = {
  overview: [
    {
      id: "ov-1",
      title: "Quels sont les 3 risques à traiter en priorité aujourd’hui ?",
      prompt: "Quels sont les 3 risques à traiter en priorité aujourd’hui ?",
    },
    {
      id: "ov-2",
      title: "Comment réduire notre dépendance au trunk SIP Twilio Dublin ?",
      prompt: "Comment réduire notre dépendance au trunk SIP Twilio Dublin ?",
    },
    {
      id: "ov-3",
      title: "Simuler l’impact de nos clients déficitaires sur la marge",
      prompt: "Quels clients pèsent sur notre marge contributive et que faire ?",
    },
  ],
  tenants: [
    {
      id: "ten-1",
      title: "Comment gérer Mondo Services (impayé + coût élevé) sans risque ?",
      prompt: "Comment gérer Mondo Services (impayé + coût élevé) sans risque ?",
    },
    {
      id: "ten-2",
      title: "Vérifier la conformité du diagnostic support 30 min",
      prompt: "Quelles précautions prendre avant d’ouvrir un diagnostic support ?",
    },
    {
      id: "ten-3",
      title: "Convertir les 24 entreprises en essai vers l’offre Pro",
      prompt: "Quelle stratégie appliquer pour convertir nos 24 entreprises en essai ?",
    },
  ],
  billing: [
    {
      id: "bil-1",
      title: "Comment modifier un tarif sans casser les contrats existants ?",
      prompt: "Comment modifier un tarif sans casser les contrats existants ?",
    },
    {
      id: "bil-2",
      title: "Évaluer l’impact financier du code promo AUTOCALL20",
      prompt: "Quel est l’impact financier si nous activons la promo AUTOCALL20 ?",
    },
    {
      id: "bil-3",
      title: "Récupérer les 8 paiements en échec ce mois-ci",
      prompt: "Comment récupérer les 8 paiements en échec ce mois-ci ?",
    },
  ],
  consumption: [
    {
      id: "con-1",
      title: "Corriger le double débit de Nova Services (ANO-401)",
      prompt: "Comment corriger proprement le double débit de Nova Services ?",
    },
    {
      id: "con-2",
      title: "Débloquer la réservation de 10 min sur Clean Studio",
      prompt: "Comment débloquer la réservation bloquée de Clean Studio ?",
    },
    {
      id: "con-3",
      title: "Optimiser nos coûts TTS ElevenLabs (62 % des consommations)",
      prompt: "Comment optimiser notre consommation de voix IA et TTS ?",
    },
  ],
  finance: [
    {
      id: "fin-1",
      title: "Pourquoi Mondo Services a une marge négative (-13,1 %) ?",
      prompt: "Pourquoi Mondo Services a une marge négative (-13,1 %) et comment y remédier ?",
    },
    {
      id: "fin-2",
      title: "Quelle décision prendre pour passer de 248 à 1 000 clients ?",
      prompt: "Quels goulots d’étranglement anticiper pour passer à 1 000 clients ?",
    },
    {
      id: "fin-3",
      title: "Analyser notre ratio LTV / CAC (14,6×) et le budget marketing",
      prompt: "Notre ratio LTV/CAC est à 14,6x : devons-nous accélérer en marketing ?",
    },
  ],
  providers: [
    {
      id: "prv-1",
      title: "Anticiper une panne Twilio avec un routage SIP de secours",
      prompt: "Comment anticiper une panne Twilio avec un routage de secours ?",
    },
  ],
  "ai-governance": [
    {
      id: "ai-1",
      title: "Pourquoi la publication de Réceptionniste IA v1.3 est bloquée ?",
      prompt: "Quels tests critiques bloquent l’activation de Réceptionniste IA v1.3 ?",
    },
    {
      id: "ai-2",
      title: "Vérifier l’indépendance Avatar ↔ Identité ↔ Voix et la licence d’Olivia",
      prompt: "Comment régulariser la licence vocale d’Olivia et garantir l’indépendance avatar/voix ?",
    },
    {
      id: "ai-3",
      title: "Comment déployer une version IA sans écraser les agents clients ?",
      prompt: "Comment mettre à jour un modèle officiel sans écraser les personnalisations clients ?",
    },
  ],
  support: [
    {
      id: "sup-1",
      title: "Diagnostiquer le ticket critique P1 TK-1042 (Nova Services)",
      prompt: "Quelle est la cause du ticket P1 TK-1042 de Nova Services ?",
    },
    {
      id: "sup-2",
      title: "Combler les questions sans réponse d’AutoCall Support AI",
      prompt: "Comment éviter que le Support IA n’invente une procédure technique ?",
    },
  ],
  adoption: [
    {
      id: "ado-1",
      title: "Accompagner les 20 entreprises à risque (Studio Horizon : 15/100)",
      prompt: "Comment accompagner Studio Horizon et Mondo Services sans sur-sollicitation ?",
    },
    {
      id: "ado-2",
      title: "Analyser l’écart entre onboarding terminé (65 %) et 1re valeur (48 %)",
      prompt: "Comment convertir les 20 entreprises ayant fini l’onboarding mais sans première valeur ?",
    },
    {
      id: "ado-3",
      title: "Faut-il déployer la Variante B d’onboarding (EXP-001 · +16 pts) ?",
      prompt: "Quelles vérifications faire avant de généraliser l’expérimentation EXP-001 ?",
    },
  ],
  infrastructure: [
    {
      id: "inf-1",
      title: "Résoudre l’incident P2 INC-0024 (Retards de transcription BullMQ)",
      prompt: "Comment résorber les retards de transcription INC-0024 sans risque de doublon ?",
    },
    {
      id: "inf-2",
      title: "Pourquoi ne jamais relancer aveuglément les 2 emails en échec ?",
      prompt: "Pourquoi ne faut-il jamais relancer aveuglément une tâche BullMQ en échec ?",
    },
    {
      id: "inf-3",
      title: "Vérifier la compatibilité SQL avant un rollback de version",
      prompt: "Quelles précautions prendre vis-à-vis des migrations PostgreSQL avant un rollback ?",
    },
  ],
  security: [
    {
      id: "sec-1",
      title: "Gérer l’incident critique SEC-0021 et évaluer la notification 72h",
      prompt: "Comment qualifier l’incident SEC-0021 et vérifier nos obligations RGPD ?",
    },
    {
      id: "sec-2",
      title: "Vérifier l’isolation RLS inter-tenants et les permissions IA backend",
      prompt: "Pourquoi les restrictions des agents IA doivent-elles être imposées côté backend ?",
    },
  ],
  settings: [
    {
      id: "set-1",
      title: "Quels prérequis valider avant d’ouvrir le marché Côte d’Ivoire (XOF) ?",
      prompt: "Quelles validations techniques, juridiques et paiement sont requises pour la Côte d’Ivoire ?",
    },
    {
      id: "set-2",
      title: "Pourquoi un rollback global doit créer une nouvelle révision traçable ?",
      prompt: "Comment fonctionne le cycle en 7 étapes et le rollback des paramètres globaux ?",
    },
  ],
};

async function generateAdvisorReply(
  prompt: string,
  activeSectionId: SuperAdminSectionNavTarget,
): Promise<{ content: string; badge: string; action?: AdvisorAction }> {
  await new Promise((resolve) => window.setTimeout(resolve, 420));
  const q = prompt.toLowerCase();

  if (q.includes("priorit") || q.includes("risque") || q.includes("aujourd")) {
    return {
      badge: "Triage stratégique · 3 points critiques",
      content:
        "Voici les 3 décisions prioritaires aujourd’hui :\n1. **Anomalie ANO-401 (Nova Services)** : émettre une écriture de compensation de +4 min (double débit webhook Twilio) sans supprimer l’écriture d’origine.\n2. **Mondo Services (-13,1 % de marge & impayé)** : conserver la suspension sortante jusqu’à régularisation SEPA, puis proposer une migration explicite de v2026.1 vers v2026.2.\n3. **Trunk Twilio Dublin (SIP 503 à 1,8 %)** : préparer la bascule sur le trunk secondaire Francfort si le taux dépasse 2,5 %.",
      action: {
        label: "Traiter les anomalies dans Consommations →",
        section: "consumption",
        tab: "anomalies",
      },
    };
  }

  if (q.includes("mondo") || q.includes("déficit") || q.includes("-13")) {
    return {
      badge: "Analyse de rentabilité & Risque contrat",
      content:
        "**Diagnostic Mondo Services :** ce compte paie 99 € HT (ancienne révision v2026.1) mais génère 112 € de coûts directs (marge −13,1 %) à cause d’appels longs vers mobiles et d’un rejet SEPA.\n\n**Erreur à éviter :** ne modifiez jamais son tarif v2026.1 en base de données (les offres sont immuables).\n**Décision recommandée :** attendez la régularisation de la facture #FAC-2026-1138, maintenez la recharge automatique sur OFF et proposez un upgrade vers Business ou l’achat de packs minutes dédiés.",
      action: {
        label: "Inspecter les comptes déficitaires dans Finance →",
        section: "finance",
        tab: "companies",
      },
    };
  }

  if (q.includes("tarif") || q.includes("contrat") || q.includes("version") || q.includes("immuable")) {
    return {
      badge: "Architecture Facturation · Règle d’immuabilité",
      content:
        "**Règle d’or AutoCall :** un changement de prix sur Starter, Pro ou Business ne doit **jamais** modifier rétroactivement les abonnements actifs.\n\n1. Créez une nouvelle révision (ex. `v2026.3`) à l’état **Brouillon** dans `Facturation > Offres`.\n2. Les nouveaux inscrits prendront `v2026.3` après publication, tandis que les clients actuels restent sur `v2026.2`.\n3. Toute migration d’un client existant doit être explicite, motivée et validée par MFA.",
      action: {
        label: "Gérer les versions d’offres dans Facturation →",
        section: "billing",
        tab: "offers",
      },
    };
  }

  if (q.includes("autocall20") || q.includes("promo")) {
    return {
      badge: "Simulation commerciale · Code AUTOCALL20",
      content:
        "**Analyse du code AUTOCALL20 (−20 % pendant 3 mois sur Pro à 99 €) :**\n- Remise accordée : 19,80 € / mois pendant 3 mois (soit 59,40 € par nouveau client).\n- Avec un coût direct moyen de 30 € sur Pro, votre marge contributive reste positive à **59,20 € / mois** dès le 1er mois.\n- Sur le plafond de 100 entreprises, le manque à gagner temporaire est de 5 940 € pour un gain d’ARR potentiel de **118 800 €**. Vous pouvez publier la campagne en sécurité.",
      action: {
        label: "Publier AUTOCALL20 dans Promotions →",
        section: "billing",
        tab: "promotions",
      },
    };
  }

  if (q.includes("double débit") || q.includes("nova") || q.includes("ano-401") || q.includes("registre")) {
    return {
      badge: "Intégrité du Registre · Écriture corrective",
      content:
        "**Attention :** n’effacez jamais une ligne de débit dans PostgreSQL pour corriger un bug webhook, cela fausserait la réconciliation comptable.\n\nUtilisez le bouton **« + Écriture corrective / Compensation »** dans `Consommations > Registre` ou résolvez directement l’anomalie `ANO-401` : une ligne `+4 min (Compensation)` sera ajoutée avec votre signature MFA et la référence du ticket.",
      action: {
        label: "Ouvrir le Registre des mouvements →",
        section: "consumption",
        tab: "ledger",
      },
    };
  }

  if (q.includes("clean studio") || q.includes("réservation") || q.includes("bloqu")) {
    return {
      badge: "Mécanisme de Réservation Atomique",
      content:
        "Lorsqu’un appel sortant démarre, AutoCall réserve les minutes (état *Estimé*). Si l’opérateur SIP renvoie une erreur 503 et que le worker tombe avant la libération, les minutes restent verrouillées.\n\n**Action :** ouvrez `Consommations > Anomalies`, sélectionnez `ANO-402 (Clean Studio)` et déclenchez la libération/compensation pour restaurer ses 10 minutes.",
      action: {
        label: "Libérer les minutes dans Anomalies →",
        section: "consumption",
        tab: "anomalies",
      },
    };
  }

  if (q.includes("diagnostic") || q.includes("30 min") || q.includes("support") || q.includes("priv")) {
    return {
      badge: "Sécurité & RGPD · Moindre privilège",
      content:
        "**Rappel de sécurité (§7 Super Admin) :** vous n’avez jamais d’accès permanent aux conversations privées des clients.\n\nAvant d’intervenir sur un problème d’agent vocal :\n1. Vérifiez que le propriétaire a coché le **consentement d’assistance**.\n2. Associez le numéro de ticket (`SUP-418`) et le motif technique.\n3. Validez votre code **MFA TOTP** : l’accès est en **lecture seule**, limité à **30 minutes** et révocable à tout instant.",
      action: {
        label: "Ouvrir Entreprises & Fiche 360° →",
        section: "tenants",
        tab: "companies",
      },
    };
  }

  if (q.includes("1 000") || q.includes("1000") || q.includes("croissance") || q.includes("ltv") || q.includes("cac")) {
    return {
      badge: "Conseil Fondateur · Passage à l’échelle",
      content:
        "Avec un ratio **LTV / CAC de 14,6×** (LTV contributive de 1 240 € pour 85 € de CAC) et un seuil de rentabilité atteint dès **8 clients**, votre modèle unitaire est très sain.\n\n**Pour passer à 1 000 clients sans erreur :**\n1. Gardez les recharges automatiques sur **OFF par défaut** pour éviter les contestations de factures.\n2. Surveillez la file `call-postprocess` (transcriptions S3) et négociez un tarif engagé ElevenLabs dès 150 000 min/mois (-18 % sur le poste Voix).",
      action: {
        label: "Ouvrir le Simulateur financier →",
        section: "finance",
        tab: "forecast",
      },
    };
  }

  return {
    badge: `Conseiller Super Admin · Contexte : ${activeSectionId}`,
    content:
      "Je suis votre conseiller stratégique et garde-fou technique Super Admin. Je veille sur :\n- **La viabilité financière** (distinction MRR, Cash encaissé, Revenu reconnu, Coût réel et Contribution).\n- **La prévention des erreurs** (offres immuables, registre sans suppression, quotas réservés avant effet payant).\n- **La conformité sécurité** (diagnostic lecture seule 30 min avec consentement + MFA).\n\nQuelle décision ou anomalie souhaitez-vous analyser ?",
  };
}

export function SuperAdminAdvisor({
  activeSectionId,
  onNavigate,
}: {
  activeSectionId: SuperAdminSectionNavTarget;
  activeTabId?: string;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  const panelId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentSuggestions =
    SUGGESTIONS_BY_SECTION[activeSectionId] ?? SUGGESTIONS_BY_SECTION.overview;

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

  async function sendPrompt(rawPrompt?: string) {
    const content = (rawPrompt ?? message).trim();
    if (!content || isLoading) return;

    setError("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    if (!rawPrompt) setMessage("");
    setIsLoading(true);

    try {
      const reply = await generateAdvisorReply(content, activeSectionId);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply.content,
          badge: reply.badge,
          action: reply.action,
        },
      ]);
    } catch {
      setError("Impossible de joindre le conseiller Super Admin.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {/* PANNEAU DU CONSEILLER STRATÉGIQUE SUPER ADMIN (100% clair, style Ask AI AutoCall) */}
      {isOpen && (
        <section
          id={panelId}
          role="dialog"
          aria-label="Conseiller stratégique Super Admin AutoCall"
          className="flex w-[min(400px,calc(100vw-32px))] flex-col overflow-hidden rounded-[20px] border border-[#E1E9E3] bg-white shadow-[0_16px_48px_rgba(24,77,59,0.10),0_2px_8px_rgba(24,77,59,0.04)]"
        >
          {/* En-tête clair identique à Ask AI */}
          <header className="flex items-center justify-between border-b border-[#F0F2F0] bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="size-8.5 shrink-0">
                <AskAILogo />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-semibold tracking-[-0.3px] text-[#184D3B]">
                    Conseiller AutoCall
                  </p>
                  <span className="rounded-md bg-[#EAF3ED] px-2 py-0.5 text-[11px] font-semibold text-[#286B4E]">
                    Super Admin
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  title="Réinitialiser la conversation"
                  className="rounded-lg px-2 py-1 text-[12px] text-[#7F8982] transition hover:bg-[#F3F5F3] hover:text-[#202723] cursor-pointer"
                >
                  Effacer
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="Fermer le conseiller"
                className="inline-flex size-8 items-center justify-center rounded-lg text-[#8A938C] transition hover:bg-[#F3F5F3] hover:text-[#202723] cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </header>

          {/* Zone de messages ou d'accueil */}
          <div className="p-5">
            {messages.length === 0 ? (
              <div>
                <h2 className="text-[20px] font-semibold tracking-[-0.5px] leading-[1.3] text-[#202723]">
                  Comment puis-je vous conseiller ?
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#7F8982]">
                  Anticipez les risques, vérifiez vos marges et validez vos décisions avant action.
                </p>

                <div className="mt-4 space-y-2">
                  {currentSuggestions.map((sug) => (
                    <button
                      key={sug.id}
                      type="button"
                      onClick={() => void sendPrompt(sug.prompt)}
                      className="flex w-full items-center justify-between gap-2.5 rounded-[10px] border border-[#E8EDE9] bg-white p-3 text-left text-[13.5px] leading-snug text-[#45524A] transition hover:translate-x-0.5 hover:border-[#D6E5DA] hover:bg-[#F3F8F4] cursor-pointer"
                    >
                      <span>{sug.title}</span>
                      <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-[#408963]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="flex max-h-[320px] flex-col gap-3.5 overflow-y-auto pr-1"
                aria-live="polite"
              >
                {messages.map((item, idx) => (
                  <div
                    key={idx}
                    className={
                      item.role === "user"
                        ? "self-end max-w-[85%] rounded-[16px_16px_4px_16px] bg-[#EAF3ED] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-[#184D3B]"
                        : "self-start w-full py-1 text-[13.5px] leading-[1.65] text-[#36423A]"
                    }
                  >
                    {item.badge && (
                      <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-md bg-[#EAF3ED] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#184D3B]">
                        <span className="size-1.5 rounded-full bg-[#408963]" />
                        <span>{item.badge}</span>
                      </div>
                    )}
                    <div className="whitespace-pre-line">{item.content}</div>

                    {item.action && (
                      <button
                        type="button"
                        onClick={() => {
                          if (item.action) {
                            onNavigate(item.action.section, item.action.tab);
                          }
                        }}
                        className="mt-2.5 inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-[#D6E5DA] bg-[#F3F8F4] px-3 text-[12.5px] font-semibold text-[#184D3B] transition hover:bg-[#EAF3ED] cursor-pointer"
                      >
                        <span>{item.action.label}</span>
                      </button>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-[13px] text-[#408963]">
                    <div className="size-7 animate-pulse">
                      <AskAILogo />
                    </div>
                    <span>AutoCall analyse vos données...</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}

            {/* Formulaire de dialogue clair identique à Ask AI */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendPrompt();
              }}
              className="mt-5 flex items-center gap-1.5 rounded-[12px] border border-[#DFE7E1] bg-white p-1.5 transition focus-within:border-[#68AC86]"
            >
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isListening
                    ? "Écoute en cours..."
                    : "Demandez conseil à AutoCall..."
                }
                aria-label="Message pour le conseiller Super Admin"
                disabled={isLoading}
                className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[13.5px] text-[#202723] placeholder:text-[#9BA49D] focus:outline-none"
              />

              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={isLoading}
                aria-label="Dicter au microphone"
                title="Dicter au microphone"
                className={`inline-flex size-8.5 shrink-0 items-center justify-center rounded-lg transition cursor-pointer ${
                  isListening
                    ? "bg-[#EAF3ED] text-[#184D3B] ring-1 ring-[#68AC86]"
                    : "text-[#6F7B73] hover:bg-[#F3F5F3]"
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
                className="inline-flex size-8.5 shrink-0 items-center justify-center rounded-[8px] bg-[#408963] text-white transition hover:bg-[#347453] disabled:opacity-40 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            {error && (
              <p className="mt-2 text-[12.5px] text-[#B42318]" role="alert">
                {error}
              </p>
            )}

            <p className="mt-3 text-center text-[12px] text-[#9AA49C]">
              Powered by AutoCall
            </p>
          </div>
        </section>
      )}

      {/* BOUTON FLOTTANT CLAIR IDENTIQUE À ASK AI (Pilule blanche + Logo 3D vert) */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={
          isOpen
            ? "Fermer le conseiller AutoCall"
            : "Ouvrir le conseiller AutoCall"
        }
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        className="group flex h-[62px] items-center justify-center rounded-full border border-[#E1E9E3] bg-white/96 px-2 shadow-[0_10px_28px_rgba(24,77,59,0.14),0_2px_8px_rgba(24,77,59,0.06)] backdrop-blur-sm transition-all duration-300 hover:pr-3.5 hover:pl-2 hover:shadow-[0_14px_34px_rgba(24,77,59,0.18)] cursor-pointer"
      >
        <span className="block size-12 shrink-0 drop-shadow-[2px_4px_4px_rgba(82,145,107,0.16)] transition-transform duration-300 group-hover:-translate-y-0.5">
          <AskAILogo />
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[15.5px] font-semibold tracking-[-0.3px] text-[#286B4E] opacity-0 transition-all duration-300 group-hover:ml-1.5 group-hover:max-w-[120px] group-hover:opacity-100">
          Ask AI
        </span>
      </button>
    </div>
  );
}

