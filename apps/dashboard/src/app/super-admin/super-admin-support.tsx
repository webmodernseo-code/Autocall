"use client";

import { useMemo, useState } from "react";
import {
  ElevenLabsBrandSvg,
  GoogleCalendarBrandSvg,
  StripeBrandSvg,
  TwilioBrandSvg,
  WhatsAppBusinessBrandSvg,
} from "../brand-icons";
import { PremiumSelect } from "../premium-select";
import { type Locale, type NavIconName, SolarIcon } from "../workspace-navigation";
import { type SuperAdminSectionNavTarget } from "./super-admin-overview";

// ---------------------------------------------------------------------------
// 01. TICKETS — Données fictives (TK-1042 à TK-1038) & Grille P1–P4
// ---------------------------------------------------------------------------

type TicketPriority = "P1" | "P2" | "P3" | "P4";
type TicketStatus = "Ouvert" | "En cours" | "En attente" | "Résolu";

interface SupportTicketRecord {
  id: string;
  code: string;
  companyName: string;
  contactName: string;
  title: string;
  priority: TicketPriority;
  status: TicketStatus;
  category:
    | "Configuration des agents IA"
    | "Téléphonie"
    | "Abonnements et crédits"
    | "Intégrations"
    | "Autres";
  createdAt: string;
  businessHoursTarget: string;
  summary: string;
  hasConsentForDiagnostic: boolean;
}

const INITIAL_TICKETS: SupportTicketRecord[] = [
  {
    id: "tk-1042",
    code: "TK-1042",
    companyName: "Nova Services",
    contactName: "Claire Moreau",
    title: "Agent vocal indisponible",
    priority: "P1",
    status: "Ouvert",
    category: "Configuration des agents IA",
    createdAt: "Il y a 14 min",
    businessHoursTarget: "Objectif indicatif : < 1 h ouvrée",
    summary:
      "L’agent d’accueil Réceptionniste IA ne décroche plus les appels entrants sur le numéro principal +33 1 86 95 40 12 depuis une modification de prompt ce matin.",
    hasConsentForDiagnostic: true,
  },
  {
    id: "tk-1041",
    code: "TK-1041",
    companyName: "Atlas Immobilier",
    contactName: "Marc Vasseur",
    title: "Erreur de synchronisation agenda",
    priority: "P2",
    status: "En cours",
    category: "Intégrations",
    createdAt: "Il y a 48 min",
    businessHoursTarget: "Objectif indicatif : < 4 h ouvrées",
    summary:
      "Les visites planifiées par l’Assistant rendez-vous remontent avec un délai de 10 minutes dans Google Calendar depuis le renouvellement du jeton OAuth.",
    hasConsentForDiagnostic: true,
  },
  {
    id: "tk-1040",
    code: "TK-1040",
    companyName: "Clean Studio",
    contactName: "Sophie Garnier",
    title: "Question sur les crédits",
    priority: "P3",
    status: "Ouvert",
    category: "Abonnements et crédits",
    createdAt: "Il y a 2 h 10",
    businessHoursTarget: "Objectif indicatif : < 8 h ouvrées",
    summary:
      "Souhaite savoir comment fonctionne le report ou la recharge manuelle de minutes vocales après avoir atteint 98 % du quota Starter.",
    hasConsentForDiagnostic: false,
  },
  {
    id: "tk-1039",
    code: "TK-1039",
    companyName: "Mondo Services",
    contactName: "Karim Benali",
    title: "Modification des coordonnées",
    priority: "P4",
    status: "Résolu",
    category: "Autres",
    createdAt: "Hier · 16:20",
    businessHoursTarget: "Objectif indicatif : < 24 h ouvrées",
    summary:
      "Demande de mise à jour de l’adresse de facturation et du numéro de TVA intracommunautaire sur les prochaines factures.",
    hasConsentForDiagnostic: false,
  },
  {
    id: "tk-1038",
    code: "TK-1038",
    companyName: "Studio Horizon",
    contactName: "Léa Girard",
    title: "Connexion WhatsApp impossible",
    priority: "P2",
    status: "En attente",
    category: "Intégrations",
    createdAt: "Hier · 11:05",
    businessHoursTarget: "Objectif indicatif : < 4 h ouvrées",
    summary:
      "Échec de validation du numéro WhatsApp Business lors de l’étape de vérification Meta Business Manager (en attente du code SMS côté client).",
    hasConsentForDiagnostic: true,
  },
];

const PRIORITY_DEFINITIONS: {
  priority: TicketPriority;
  level: string;
  example: string;
  targetHours: string;
}[] = [
  {
    priority: "P1",
    level: "Critique",
    example: "Service téléphonique totalement indisponible.",
    targetHours: "< 1 h ouvrée (cible interne)",
  },
  {
    priority: "P2",
    level: "Élevée",
    example: "Impossible d’utiliser une fonctionnalité essentielle.",
    targetHours: "< 4 h ouvrées (cible interne)",
  },
  {
    priority: "P3",
    level: "Normale",
    example: "Question sur un abonnement ou un quota.",
    targetHours: "< 8 h ouvrées (cible interne)",
  },
  {
    priority: "P4",
    level: "Faible",
    example: "Suggestion ou demande d’information.",
    targetHours: "< 24 h ouvrées (cible interne)",
  },
];

// ---------------------------------------------------------------------------
// 02. SUPPORT IA — Supervision de l'assistant AutoCall Support AI
// ---------------------------------------------------------------------------

interface UnansweredAiQuestion {
  id: string;
  question: string;
  occurrences: number;
  targetCategory: string;
  status: "Article à rédiger" | "Couvert par la doc";
}

const INITIAL_UNANSWERED_QUESTIONS: UnansweredAiQuestion[] = [
  {
    id: "uq-1",
    question: "Comment configurer un trunk SIP personnalisé avec un opérateur local en Côte d’Ivoire ?",
    occurrences: 14,
    targetCategory: "Téléphonie",
    status: "Article à rédiger",
  },
  {
    id: "uq-2",
    question: "Peut-on restreindre un invité en lecture seule à une seule campagne d’appels ?",
    occurrences: 9,
    targetCategory: "Sécurité",
    status: "Article à rédiger",
  },
  {
    id: "uq-3",
    question: "Comment exporter le journal des consentements RGPD au format CSV ?",
    occurrences: 6,
    targetCategory: "Sécurité",
    status: "Couvert par la doc",
  },
];

// ---------------------------------------------------------------------------
// 03. DIAGNOSTICS — Vérification automatisée en 7 points (Ex: Nova Services · TK-1042)
// ---------------------------------------------------------------------------

interface DiagnosticCheckItem {
  id: string;
  label: string;
  resultText: string;
  state: "OK" | "Erreur" | "Avertissement";
  technicalDetail: string;
}

const NOVA_DIAGNOSTIC_CHECKS: DiagnosticCheckItem[] = [
  {
    id: "chk-1",
    label: "Compte entreprise",
    resultText: "Compte actif",
    state: "OK",
    technicalDetail: "Tenant ID ten_nova_01 · Isolation RLS active · Aucun blocage administratif.",
  },
  {
    id: "chk-2",
    label: "Abonnement",
    resultText: "Abonnement valide",
    state: "OK",
    technicalDetail: "Offre Pro v2026.2 (99 € HT/mois) · Dernier paiement Stripe validé.",
  },
  {
    id: "chk-3",
    label: "Quota téléphonique",
    resultText: "Minutes disponibles",
    state: "OK",
    technicalDetail: "450 / 500 min consommées (90 %) · 50 minutes restantes avant plafond 100 %.",
  },
  {
    id: "chk-4",
    label: "Connexion téléphonique",
    resultText: "Connexion opérationnelle",
    state: "OK",
    technicalDetail: "DID +33 1 86 95 40 12 enregistré sur Twilio SIP EU-Dublin (latence 180 ms).",
  },
  {
    id: "chk-5",
    label: "Fournisseur vocal",
    resultText: "Service accessible",
    state: "OK",
    technicalDetail: "ElevenLabs Turbo v2.5 opérationnel (240 ms · disponibilité 99,98 %).",
  },
  {
    id: "chk-6",
    label: "Configuration de l’agent",
    resultText: "Erreur de configuration détectée",
    state: "Erreur",
    technicalDetail:
      "L’outil obligatoire calendar.check_availability référencé dans le prompt système a été décoché dans les permissions de l’agent.",
  },
  {
    id: "chk-7",
    label: "Routage des appels",
    resultText: "Vérification complémentaire nécessaire",
    state: "Avertissement",
    technicalDetail:
      "Le numéro de renvoi humain de secours n’est pas renseigné en cas d’échec de l’agent.",
  },
];

// ---------------------------------------------------------------------------
// 04. DOCUMENTATION — Les 14 catégories officielles du Centre d'aide AutoCall
// ---------------------------------------------------------------------------

interface HelpCenterCategoryRecord {
  id: string;
  name: string;
  icon: NavIconName;
  articlesCount: number;
  aiIndexedCount: number;
  flagshipArticleTitle: string;
  version: string;
  status: "Publié" | "Brouillon en révision";
  lastUpdated: string;
}

const INITIAL_HELP_CATEGORIES: HelpCenterCategoryRecord[] = [
  {
    id: "cat-1",
    name: "Premiers pas",
    icon: "overview",
    articlesCount: 8,
    aiIndexedCount: 8,
    flagshipArticleTitle: "Configurer votre espace AutoCall en 10 minutes",
    version: "v2.4",
    status: "Publié",
    lastUpdated: "Il y a 2 jours",
  },
  {
    id: "cat-2",
    name: "Agents IA",
    icon: "agents",
    articlesCount: 14,
    aiIndexedCount: 14,
    flagshipArticleTitle: "Personnaliser un modèle officiel dans l’Agent Studio",
    version: "v3.1",
    status: "Publié",
    lastUpdated: "Aujourd’hui",
  },
  {
    id: "cat-3",
    name: "Téléphonie",
    icon: "phone",
    articlesCount: 11,
    aiIndexedCount: 11,
    flagshipArticleTitle: "Configuration téléphonique : nouveau numéro ou renvoi d’appel",
    version: "v2.8",
    status: "Publié",
    lastUpdated: "Hier",
  },
  {
    id: "cat-4",
    name: "Acquisition",
    icon: "acquisition",
    articlesCount: 7,
    aiIndexedCount: 7,
    flagshipArticleTitle: "Rechercher et enrichir des prospects B2B qualifiés",
    version: "v1.9",
    status: "Publié",
    lastUpdated: "15 nov. 2026",
  },
  {
    id: "cat-5",
    name: "CRM",
    icon: "crm",
    articlesCount: 9,
    aiIndexedCount: 9,
    flagshipArticleTitle: "Synchroniser vos fiches contacts et pipelines commerciaux",
    version: "v2.0",
    status: "Publié",
    lastUpdated: "12 nov. 2026",
  },
  {
    id: "cat-6",
    name: "Communications",
    icon: "conversations",
    articlesCount: 10,
    aiIndexedCount: 10,
    flagshipArticleTitle: "Superviser la boîte de réception unifiée (Appels, SMS, WhatsApp)",
    version: "v2.2",
    status: "Publié",
    lastUpdated: "10 nov. 2026",
  },
  {
    id: "cat-7",
    name: "Campagnes",
    icon: "campaigns",
    articlesCount: 6,
    aiIndexedCount: 6,
    flagshipArticleTitle: "Planifier une campagne d’appels sortants respectueuse des plages horaires",
    version: "v1.7",
    status: "Publié",
    lastUpdated: "08 nov. 2026",
  },
  {
    id: "cat-8",
    name: "Rendez-vous",
    icon: "bell",
    articlesCount: 8,
    aiIndexedCount: 8,
    flagshipArticleTitle: "Connecter Google Calendar ou Outlook à votre agent de réservation",
    version: "v2.5",
    status: "Publié",
    lastUpdated: "19 nov. 2026",
  },
  {
    id: "cat-9",
    name: "Réseaux sociaux",
    icon: "social",
    articlesCount: 5,
    aiIndexedCount: 5,
    flagshipArticleTitle: "Connecter WhatsApp Business, Instagram et Facebook Messenger",
    version: "v1.4",
    status: "Publié",
    lastUpdated: "05 nov. 2026",
  },
  {
    id: "cat-10",
    name: "Automatisations",
    icon: "automation",
    articlesCount: 7,
    aiIndexedCount: 6,
    flagshipArticleTitle: "Déclencher un SMS de confirmation ou un webhook après un appel",
    version: "v1.8",
    status: "Brouillon en révision",
    lastUpdated: "Hier",
  },
  {
    id: "cat-11",
    name: "Pilotage",
    icon: "chart",
    articlesCount: 6,
    aiIndexedCount: 6,
    flagshipArticleTitle: "Lire vos indicateurs d’appels, taux de décroché et conversions",
    version: "v1.5",
    status: "Publié",
    lastUpdated: "01 nov. 2026",
  },
  {
    id: "cat-12",
    name: "Abonnement",
    icon: "card",
    articlesCount: 9,
    aiIndexedCount: 9,
    flagshipArticleTitle: "Comprendre vos quotas, alertes 80 % / 95 % et recharges ponctuelles",
    version: "v2.3",
    status: "Publié",
    lastUpdated: "18 nov. 2026",
  },
  {
    id: "cat-13",
    name: "Sécurité",
    icon: "settings",
    articlesCount: 8,
    aiIndexedCount: 8,
    flagshipArticleTitle: "Protection RGPD, rôles Propriétaire / Invité et journal de consentement",
    version: "v2.1",
    status: "Publié",
    lastUpdated: "14 nov. 2026",
  },
  {
    id: "cat-14",
    name: "Support",
    icon: "help",
    articlesCount: 5,
    aiIndexedCount: 5,
    flagshipArticleTitle: "Contacter l’assistance humaine ou autoriser un diagnostic 30 minutes",
    version: "v1.6",
    status: "Publié",
    lastUpdated: "20 nov. 2026",
  },
];

// ---------------------------------------------------------------------------
// 05. RÉPONSES TYPES — Bibliothèque de réponses réutilisables avec variables
// ---------------------------------------------------------------------------

interface CannedResponseTemplate {
  id: string;
  title: string;
  category: "Onboarding" | "Assistance technique" | "Consommations";
  bodyTemplate: string;
}

const INITIAL_CANNED_RESPONSES: CannedResponseTemplate[] = [
  {
    id: "tpl-welcome",
    title: "Bienvenue sur AutoCall",
    category: "Onboarding",
    bodyTemplate:
      "Bonjour {{nom_client}},\n\nBienvenue sur AutoCall ! Nous sommes disponibles pour vous accompagner dans la configuration de votre espace {{entreprise}} et de votre premier agent IA ({{fonctionnalite}}).\n\nN’hésitez pas à répondre directement à ce message (réf. {{numero_ticket}}) si vous souhaitez planifier une vérification avec notre équipe.",
  },
  {
    id: "tpl-more-info",
    title: "Demande d’informations complémentaires",
    category: "Assistance technique",
    bodyTemplate:
      "Bonjour {{nom_client}},\n\nNous avons bien pris en charge votre demande {{numero_ticket}} concernant {{fonctionnalite}} sur l’espace {{entreprise}}.\n\nAfin d’analyser précisément la situation sans accéder à vos conversations privées, pourriez-vous nous préciser l’heure approximative du dernier appel concerné ou activer l’autorisation de diagnostic temporaire (30 min en lecture seule) depuis vos Paramètres ?",
  },
  {
    id: "tpl-quota-reached",
    title: "Quota atteint",
    category: "Consommations",
    bodyTemplate:
      "Bonjour {{nom_client}},\n\nSuite à votre ticket {{numero_ticket}}, nous vous confirmons que l’espace {{entreprise}} a atteint 100 % de son quota mensuel sur le service {{fonctionnalite}}.\n\nPar mesure de sécurité financière, aucune recharge automatique payante n’est déclenchée sans votre accord. Vous pouvez souscrire une recharge ponctuelle ou faire évoluer votre offre depuis votre onglet Abonnement.",
  },
  {
    id: "tpl-resolved",
    title: "Problème résolu",
    category: "Assistance technique",
    bodyTemplate:
      "Bonjour {{nom_client}},\n\nL’anomalie signalée dans le ticket {{numero_ticket}} concernant {{fonctionnalite}} pour {{entreprise}} est désormais résolue.\n\nLes tests de vérification technique sont conformes. Nous restons à votre écoute si vous constatez le moindre écart supplémentaire.",
  },
];

// ---------------------------------------------------------------------------
// 06. PERFORMANCES — Évolution sur 4 semaines & Principaux motifs de contact
// ---------------------------------------------------------------------------

const WEEKLY_TICKETS_CHART = [
  { week: "Sem. 1", received: 42, resolved: 40 },
  { week: "Sem. 2", received: 48, resolved: 46 },
  { week: "Sem. 3", received: 56, resolved: 54 },
  { week: "Sem. 4", received: 49, resolved: 46 },
];

const CONTACT_REASONS_BREAKDOWN = [
  { label: "Configuration des agents IA", sharePct: 34 },
  { label: "Téléphonie", sharePct: 26 },
  { label: "Abonnements et crédits", sharePct: 18 },
  { label: "Intégrations", sharePct: 14 },
  { label: "Autres", sharePct: 8 },
];

export function SuperAdminSupport({
  activeTab,
  onSelectTab,
  onNavigate,
}: {
  activeTab: string;
  locale: Locale;
  onSelectTab: (tabId: string) => void;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  const [tickets, setTickets] = useState<SupportTicketRecord[]>(INITIAL_TICKETS);
  const [ticketFilter, setTicketFilter] = useState<"Tous" | TicketStatus | "Prioritaires">("Tous");
  const [ticketSearch, setTicketSearch] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string>("tk-1042");

  // 02. Support IA : questions sans réponse documentée
  const [unansweredList, setUnansweredList] =
    useState<UnansweredAiQuestion[]>(INITIAL_UNANSWERED_QUESTIONS);

  // 03. Diagnostics : session révocable 30 min avec MFA
  const [diagTargetTicketCode, setDiagTargetTicketCode] = useState("TK-1042 · Nova Services");
  const [diagChecks, setDiagChecks] = useState<DiagnosticCheckItem[]>(NOVA_DIAGNOSTIC_CHECKS);
  const [diagSessionActive, setDiagSessionActive] = useState(false);
  const [diagModalOpen, setDiagModalOpen] = useState(false);
  const [diagTotp, setDiagTotp] = useState("");
  const [diagReason, setDiagReason] = useState(
    "Vérification configuration d’outils de l’agent Réceptionniste IA (TK-1042)",
  );

  // 04. Documentation : 14 catégories + modale création/édition d'article
  const [categories, setCategories] =
    useState<HelpCenterCategoryRecord[]>(INITIAL_HELP_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("cat-3");
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newArticleCategory, setNewArticleCategory] = useState("Téléphonie");

  // 05. Réponses types : sélection et variables dynamiques
  const [cannedResponses] = useState<CannedResponseTemplate[]>(INITIAL_CANNED_RESPONSES);
  const [selectedCannedId, setSelectedCannedId] = useState<string>("tpl-welcome");
  const [varClientName, setVarClientName] = useState("Claire Moreau");
  const [varCompanyName, setVarCompanyName] = useState("Nova Services");
  const [varTicketCode, setVarTicketCode] = useState("TK-1042");
  const [varFeatureName, setVarFeatureName] = useState("Réceptionniste IA & Téléphonie");

  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) ?? tickets[0],
    [tickets, selectedTicketId],
  );

  const filteredTickets = useMemo(() => {
    return tickets.filter((tk) => {
      const matchesFilter =
        ticketFilter === "Tous"
          ? true
          : ticketFilter === "Prioritaires"
            ? tk.priority === "P1" || tk.priority === "P2"
            : tk.status === ticketFilter;
      const q = ticketSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        tk.title.toLowerCase().includes(q) ||
        tk.code.toLowerCase().includes(q) ||
        tk.companyName.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [tickets, ticketFilter, ticketSearch]);

  const selectedCanned = useMemo(
    () => cannedResponses.find((c) => c.id === selectedCannedId) ?? cannedResponses[0],
    [cannedResponses, selectedCannedId],
  );

  const renderedCannedPreview = useMemo(() => {
    return selectedCanned.bodyTemplate
      .replace(/\{\{nom_client\}\}/g, varClientName || "Bonjour")
      .replace(/\{\{entreprise\}\}/g, varCompanyName || "votre entreprise")
      .replace(/\{\{numero_ticket\}\}/g, varTicketCode || "TK-XXXX")
      .replace(/\{\{fonctionnalite\}\}/g, varFeatureName || "votre agent IA");
  }, [selectedCanned, varClientName, varCompanyName, varTicketCode, varFeatureName]);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) ?? categories[0],
    [categories, selectedCategoryId],
  );

  const handleCopyCannedResponse = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(renderedCannedPreview).catch(() => {});
    }
    notify(`Réponse type « ${selectedCanned.title} » copiée dans le presse-papiers`);
  };

  const handleOpenDiagnosticSession = () => {
    if (diagTotp.trim().length < 6) {
      notify("Veuillez saisir votre code MFA à 6 chiffres pour ouvrir la session de 30 min");
      return;
    }
    setDiagSessionActive(true);
    setDiagTotp("");
    setDiagModalOpen(false);
    notify(
      "Session de diagnostic en lecture seule ouverte pour 30 minutes (Journal d’audit horodaté)",
    );
  };

  const handlePublishArticle = () => {
    if (!newArticleTitle.trim()) return;
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === newArticleCategory
          ? {
              ...cat,
              articlesCount: cat.articlesCount + 1,
              aiIndexedCount: cat.aiIndexedCount + 1,
              flagshipArticleTitle: newArticleTitle.trim(),
              status: "Publié",
              lastUpdated: "À l’instant",
            }
          : cat,
      ),
    );
    setArticleModalOpen(false);
    setNewArticleTitle("");
    notify(
      `Article publié dans « ${newArticleCategory} » et indexé dans les sources autorisées du Support IA`,
    );
  };

  return (
    <div className="mt-7 space-y-7">
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-[#E5E5E5] bg-[#171717] px-4 py-3 text-[13.5px] font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Bandeau du parcours d'assistance (Section 9 : Accès direct au support humain garanti + Boutons côte à côte sans retour à la ligne) */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-2xs lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
          <span className="inline-flex size-2 shrink-0 rounded-full bg-[#008F6D]" />
          <span>
            <strong className="font-semibold text-[var(--foreground)]">
              08 · Support :
            </strong>{" "}
            Accès direct au support humain garanti (sans obligation de passer par l’IA) · Diagnostic privé soumis à consentement, ticket et MFA (30 min).
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("tenants", "companies")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>02 · Entreprises</span>
            <span className="text-[#737373]">→</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("diagnostics")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>Diagnostics</span>
            <span className="text-[#737373]">→</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          01. SOUS-ONGLET TICKETS (24 Ouverts / 12 En cours / 3 Prioritaires / 186 Résolus)
         ===================================================================== */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          {/* 4 blocs KPI double surface style Dashboard Admin Client : 24 / 12 / 3 / 186 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="help" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Ouverts
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  24
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[var(--text-muted)]">
                Demandes clients en attente de prise en charge
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="conversations" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    En cours
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  12
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                ● Suivis par l’équipe support &amp; diagnostic
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Prioritaires
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  3
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#8A5A00]">
                ● 1 critique (P1 · TK-1042) et 2 élevés (P2)
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="chart" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Résolus ce mois
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  186
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                {"96 % de satisfaction sur les avis reçus"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Tableau principal des tickets (7 colonnes) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <div className="flex flex-col justify-between gap-3 border-b border-[#EFEFEF] pb-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(["Tous", "Ouvert", "En cours", "Prioritaires", "Résolu"] as const).map(
                    (flt) => (
                      <button
                        key={flt}
                        type="button"
                        onClick={() => setTicketFilter(flt)}
                        className={`h-8.5 rounded-xl px-3 text-[12.5px] font-semibold transition cursor-pointer ${
                          ticketFilter === flt
                            ? "bg-[#171717] text-white"
                            : "border border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F7F7F8]"
                        }`}
                      >
                        {flt}
                      </button>
                    ),
                  )}
                </div>

                <input
                  type="search"
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  placeholder="Filtrer TK-1042, entreprise..."
                  className="h-9 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 text-[13px] text-[#171717] outline-none focus:border-[#171717] sm:w-52"
                />
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left text-[13.5px]">
                  <thead>
                    <tr className="border-b border-[#EFEFEF] text-[12px] font-medium text-[#737373]">
                      <th className="py-3 pr-4">Ticket</th>
                      <th className="px-3 py-3">Priorité</th>
                      <th className="px-3 py-3">Statut</th>
                      <th className="py-3 pl-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F2F2]">
                    {filteredTickets.map((tk) => {
                      const isSelected = tk.id === selectedTicket.id;
                      return (
                        <tr
                          key={tk.id}
                          onClick={() => setSelectedTicketId(tk.id)}
                          className={`transition cursor-pointer ${
                            isSelected ? "bg-[#F4F8F6]" : "hover:bg-[#FAFAFA]"
                          }`}
                        >
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-2.5">
                              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white p-1.5 text-[#171717] shadow-2xs">
                                {tk.id === "tk-1041" ? (
                                  <GoogleCalendarBrandSvg className="size-full" />
                                ) : tk.id === "tk-1038" ? (
                                  <WhatsAppBusinessBrandSvg className="size-full" />
                                ) : tk.category === "Configuration des agents IA" ? (
                                  <SolarIcon name="agents" className="size-4" />
                                ) : tk.category === "Abonnements et crédits" ? (
                                  <SolarIcon name="bolt" className="size-4" />
                                ) : (
                                  <SolarIcon name="settings" className="size-4" />
                                )}
                              </span>
                              <div>
                                <p className="font-semibold text-[#171717]">{tk.title}</p>
                                <p className="mt-0.5 font-mono text-[12px] text-[#737373]">
                                  {tk.code} ·{" "}
                                  <span className="font-sans text-[#525252]">
                                    {tk.companyName}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <span
                              className={`rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-bold ${
                                tk.priority === "P1"
                                  ? "bg-[#FEE2E2] text-[#B91C1C]"
                                  : tk.priority === "P2"
                                    ? "bg-[#F0C869] text-[#5C3D00]"
                                    : tk.priority === "P3"
                                      ? "bg-[#E4EEFE] text-[#1D4ED8]"
                                      : "bg-[#EFEFEF] text-[#525252]"
                              }`}
                            >
                              {tk.priority}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                                tk.status === "Résolu"
                                  ? "bg-[#DEF5EC] text-[#008064]"
                                  : tk.status === "En cours"
                                    ? "bg-[#E4EEFE] text-[#1D4ED8]"
                                    : tk.status === "Ouvert"
                                      ? "bg-[#F0C869] text-[#5C3D00]"
                                      : "bg-[#EFEFEF] text-[#525252]"
                              }`}
                            >
                              <span>●</span>
                              <span>{tk.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTicketId(tk.id);
                              }}
                              className="h-8 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[12px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                            >
                              Ouvrir
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Détail du ticket sélectionné + Grille de gestion des priorités P1-P4 (5 colonnes) */}
            <div className="space-y-6 lg:col-span-5">
              {selectedTicket && (
                <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs">
                  <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                    <div className="flex items-start justify-between gap-2 border-b border-[#E5E5E5]/80 pb-3.5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[12.5px] font-bold text-[#171717]">
                            {selectedTicket.code}
                          </span>
                          <span
                            className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ${
                              selectedTicket.priority === "P1"
                                ? "bg-[#FEE2E2] text-[#B91C1C]"
                                : selectedTicket.priority === "P2"
                                  ? "bg-[#F0C869] text-[#5C3D00]"
                                  : "bg-[#EFEFEF] text-[#525252]"
                            }`}
                          >
                            {selectedTicket.priority}
                          </span>
                          <span className="rounded-md border border-[#E5E5E5] bg-white px-2 py-0.5 font-mono text-[11px] font-medium text-[#525252]">
                            {selectedTicket.status}
                          </span>
                        </div>
                        <h3 className="mt-1.5 text-[16.5px] font-semibold text-[#171717]">
                          {selectedTicket.title}
                        </h3>
                        <p className="text-[12.5px] text-[#737373]">
                          {selectedTicket.companyName} · Contact : {selectedTicket.contactName} ({selectedTicket.createdAt})
                        </p>
                      </div>
                    </div>

                    <p className="mt-3.5 text-[13px] leading-relaxed text-[#525252]">
                      {selectedTicket.summary}
                    </p>

                    <div className="mt-3.5 rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-[12px] text-[#525252]">
                      <span className="font-semibold text-[#171717]">
                        Cible interne (heures ouvrées) :
                      </span>{" "}
                      {selectedTicket.businessHoursTarget}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 px-1 pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDiagTargetTicketCode(
                          `${selectedTicket.code} · ${selectedTicket.companyName}`,
                        );
                        onSelectTab("diagnostics");
                      }}
                      className="h-9 w-full rounded-xl bg-[#171717] px-3.5 text-[12.5px] font-semibold text-white transition hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
                    >
                      Lancer le diagnostic technique →
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setVarClientName(selectedTicket.contactName);
                          setVarCompanyName(selectedTicket.companyName);
                          setVarTicketCode(selectedTicket.code);
                          setVarFeatureName(selectedTicket.category);
                          onSelectTab("canned-responses");
                        }}
                        className="h-9 rounded-xl border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer whitespace-nowrap"
                      >
                        Réponse type →
                      </button>
                      {selectedTicket.status !== "Résolu" ? (
                        <button
                          type="button"
                          onClick={() => {
                            setTickets((prev) =>
                              prev.map((item) =>
                                item.id === selectedTicket.id
                                  ? { ...item, status: "Résolu" }
                                  : item,
                              ),
                            );
                            notify(`Ticket ${selectedTicket.code} marqué comme Résolu`);
                          }}
                          className="h-9 rounded-xl border border-[#DEF5EC] bg-[#EAF3ED] px-3 text-[12.5px] font-semibold text-[#184D3B] hover:bg-[#DEF5EC] cursor-pointer whitespace-nowrap"
                        >
                          Marquer résolu
                        </button>
                      ) : (
                        <span className="inline-flex h-9 items-center justify-center rounded-xl border border-[#DEF5EC] bg-[#DEF5EC]/50 px-3 font-mono text-[12px] font-semibold text-[#008064]">
                          ✓ Ticket résolu
                        </span>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Référentiel des priorités P1 à P4 en heures ouvrées */}
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xs">
                <h4 className="text-[15px] font-semibold text-[#171717]">
                  Gestion des priorités (Objectifs internes en heures ouvrées)
                </h4>
                <p className="mt-0.5 text-[12px] text-[#737373]">
                  Objectifs opérationnels internes en heures ouvrées — ne constituent pas des engagements contractuels SLA non validés.
                </p>

                <div className="mt-3.5 space-y-2.5 text-[12.5px]">
                  {PRIORITY_DEFINITIONS.map((p) => (
                    <div
                      key={p.priority}
                      className="flex items-start justify-between gap-3 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-[#171717] px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                            {p.priority}
                          </span>
                          <span className="font-semibold text-[#171717]">{p.level}</span>
                        </div>
                        <p className="mt-1 text-[#525252]">{p.example}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] font-medium text-[#737373]">
                        {p.targetHours}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          02. SOUS-ONGLET SUPPORT IA (AutoCall Support AI · Sources approuvées & Transfert humain)
         ===================================================================== */}
      {activeTab === "ai-support" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Colonne gauche (6 col) : Simulation fidèle d'AutoCall Support AI */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[17px] font-semibold text-[#171717]">
                    AutoCall Support AI
                  </h3>
                  <span className="rounded-md bg-[#EAF3ED] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#184D3B]">
                    Assistant d’assistance technique
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-[#737373]">
                  Aperçu d’une conversation assistée par la base documentaire approuvée avec escalade immédiate vers un humain.
                </p>
              </div>
            </div>

            {/* Fil de conversation simulé (style clair aligné sur Ask AI) */}
            <div className="mt-5 space-y-4 rounded-2xl border border-[#EFEFEF] bg-[#FAFBFB] p-4">
              {/* Message client 1 */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#EAF3ED] px-4 py-3 text-[13.5px] font-medium text-[#171717]">
                  Comment connecter mon numéro de téléphone à mon agent IA ?
                </div>
              </div>

              {/* Réponse Support IA avec source documentaire */}
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-2xl rounded-tl-xs border border-[#E5E5E5] bg-white p-4 text-[13.5px] text-[#171717] shadow-2xs">
                  <p className="leading-relaxed">
                    Vous pouvez configurer votre numéro depuis{" "}
                    <strong>Paramètres → Téléphonie</strong>. Selon votre situation, choisissez un nouveau numéro, un renvoi d’appel ou une autre méthode compatible.
                  </p>
                  <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg border border-[#EFEFEF] bg-[#FAFAFA] px-3 py-1.5 text-[11.5px] text-[#525252]">
                    <span>
                      Source illustrative : <strong>Configuration téléphonique (v2.8)</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectTab("documentation")}
                      className="font-semibold text-[#184D3B] hover:underline cursor-pointer"
                    >
                      Voir l’article →
                    </button>
                  </div>
                </div>
              </div>

              {/* Message client 2 */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#EAF3ED] px-4 py-3 text-[13.5px] font-medium text-[#171717]">
                  J’ai déjà essayé, mais cela ne fonctionne pas.
                </div>
              </div>

              {/* Réponse Support IA 2 : Transfert vers le support humain */}
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-2xl rounded-tl-xs border border-[#E5E5E5] bg-white p-4 text-[13.5px] text-[#171717] shadow-2xs">
                  <p className="leading-relaxed">
                    Je peux vous orienter vers l’assistance humaine afin qu’elle examine votre configuration.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#DEF5EC] bg-[#EAF3ED]/70 px-3.5 py-2.5">
                    <span className="text-[12.5px] font-semibold text-[#184D3B]">
                      ✓ Transfert vers le support humain
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectTab("tickets")}
                      className="h-7.5 rounded-lg bg-[#171717] px-3 text-[11.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
                    >
                      Ouvrir le ticket créé →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 text-[12.5px] text-[#525252]">
              <strong>Règle de gouvernance :</strong> Le Support IA s’appuie exclusivement sur les articles approuvés du Centre d’aide et n’invente jamais une procédure technique non documentée.
            </div>
          </section>

          {/* Colonne droite (6 col) : Supervision des lacunes documentaires & garde-fous IA */}
          <section className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-6">
            <div>
              <div className="border-b border-[#EFEFEF] pb-4">
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Supervision des connaissances &amp; Questions sans réponse
                </h3>
                <p className="mt-0.5 text-[13px] text-[#737373]">
                  Questions fréquentes pour lesquelles l’assistant Support IA a préféré transférer à un humain faute de source documentaire approuvée.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3">
                  <span className="block text-[11.5px] text-[#737373]">
                    Résolutions IA confirmées
                  </span>
                  <span className="mt-1 block font-mono text-[20px] font-bold text-[#171717]">
                    {"68 %"}
                  </span>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3">
                  <span className="block text-[11.5px] text-[#737373]">
                    Transferts humains
                  </span>
                  <span className="mt-1 block font-mono text-[20px] font-bold text-[#171717]">
                    {"24 %"}
                  </span>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3">
                  <span className="block text-[11.5px] text-[#737373]">
                    Abandons (Non résolus)
                  </span>
                  <span className="mt-1 block font-mono text-[20px] font-bold text-[#525252]">
                    {"8 %"}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {unansweredList.map((uq) => (
                  <div
                    key={uq.id}
                    className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[13.5px] font-semibold text-[#171717]">
                          « {uq.question} »
                        </p>
                        <p className="mt-1 text-[12px] text-[#737373]">
                          Catégorie cible : <strong>{uq.targetCategory}</strong> · {uq.occurrences} demandes détectées
                        </p>
                      </div>

                      {uq.status === "Article à rédiger" ? (
                        <button
                          type="button"
                          onClick={() => {
                            setUnansweredList((prev) =>
                              prev.map((item) =>
                                item.id === uq.id
                                  ? { ...item, status: "Couvert par la doc" }
                                  : item,
                              ),
                            );
                            setNewArticleCategory(uq.targetCategory);
                            setNewArticleTitle(uq.question);
                            setArticleModalOpen(true);
                          }}
                          className="h-8 shrink-0 rounded-lg bg-[#171717] px-3 text-[12px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
                        >
                          Rédiger l’article →
                        </button>
                      ) : (
                        <span className="rounded-md bg-[#DEF5EC] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#008064] whitespace-nowrap">
                          ✓ Couvert par la doc
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-[12px] text-[#737373]">
              Une conversation abandonnée (8 %) n’est jamais comptabilisée dans les 68 % de résolutions confirmées par l’IA.
            </p>
          </section>
        </div>
      )}

      {/* =====================================================================
          03. SOUS-ONGLET DIAGNOSTICS (7 contrôles automatisés Nova Services · TK-1042 + Session 30 min)
         ===================================================================== */}
      {activeTab === "diagnostics" && (
        <div className="space-y-6">
          {/* Barre de sélection du ticket & Statut de la session révocable 30 min */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:flex-row lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Diagnostic technique — {diagTargetTicketCode}
                </h3>
                <span
                  className={`rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                    diagSessionActive
                      ? "bg-[#DEF5EC] text-[#008064]"
                      : "bg-[#EFEFEF] text-[#525252]"
                  }`}
                >
                  {diagSessionActive
                    ? "● Session lecture seule active (29:45 restantes)"
                    : "Vérification de surface (Sans accès aux données privées)"}
                </span>
              </div>
              <p className="mt-1 text-[13.5px] text-[#737373]">
                Identifiez en un coup d’œil si le blocage provient du compte, de l’abonnement, du quota, de la téléphonie, du fournisseur vocal ou de la configuration de l’agent.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2.5">
              <div className="w-60">
                <PremiumSelect
                  value={diagTargetTicketCode}
                  onChange={setDiagTargetTicketCode}
                  ariaLabel="Sélectionner le ticket à diagnostiquer"
                  options={[
                    { value: "TK-1042 · Nova Services", label: "TK-1042 · Nova Services (P1)" },
                    { value: "TK-1041 · Atlas Immobilier", label: "TK-1041 · Atlas Immobilier (P2)" },
                    { value: "TK-1038 · Studio Horizon", label: "TK-1038 · Studio Horizon (P2)" },
                  ]}
                />
              </div>

              {!diagSessionActive ? (
                <button
                  type="button"
                  onClick={() => setDiagModalOpen(true)}
                  className="h-10 shrink-0 rounded-xl bg-[#171717] px-4 text-[13px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
                >
                  Diagnostic 30 min (MFA)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setDiagSessionActive(false);
                    notify("Session de diagnostic révoquée immédiatement");
                  }}
                  className="h-10 shrink-0 rounded-xl border border-[#B91C1C] bg-[#FEF2F2] px-4 text-[13px] font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] cursor-pointer whitespace-nowrap"
                >
                  Révoquer la session
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Liste des 7 points de contrôle technique (7 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <h4 className="text-[15.5px] font-semibold text-[#171717]">
                Chaîne de vérification automatisée (7 points)
              </h4>

              <div className="mt-4 space-y-3">
                {diagChecks.map((chk) => (
                  <div
                    key={chk.id}
                    className={`flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${
                      chk.state === "Erreur"
                        ? "border-[#FCA5A5] bg-[#FEF2F2]/60"
                        : chk.state === "Avertissement"
                          ? "border-[#F0C869] bg-[#FFFDF7]"
                          : "border-[#EFEFEF] bg-[#FAFAFA]/80"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white p-1.5 text-[#171717] shadow-2xs">
                        {chk.id === "chk-2" ? (
                          <StripeBrandSvg className="size-full rounded-sm" />
                        ) : chk.id === "chk-4" ? (
                          <TwilioBrandSvg className="size-full" />
                        ) : chk.id === "chk-5" ? (
                          <ElevenLabsBrandSvg className="size-full" />
                        ) : chk.id === "chk-6" ? (
                          <SolarIcon name="agents" className="size-4" />
                        ) : chk.id === "chk-3" ? (
                          <SolarIcon name="bolt" className="size-4" />
                        ) : chk.id === "chk-7" ? (
                          <SolarIcon name="phone" className="size-4" />
                        ) : (
                          <SolarIcon name="overview" className="size-4" />
                        )}
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-[#171717]">
                          {chk.label}
                        </p>
                        <p className="mt-0.5 text-[12.5px] text-[#525252]">
                          {chk.technicalDetail}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11.5px] font-semibold whitespace-nowrap ${
                        chk.state === "OK"
                          ? "bg-[#DEF5EC] text-[#008064]"
                          : chk.state === "Erreur"
                            ? "bg-[#FEE2E2] text-[#B91C1C]"
                            : "bg-[#F0C869] text-[#5C3D00]"
                      }`}
                    >
                      <span>{chk.state === "OK" ? "✓" : chk.state === "Erreur" ? "✕" : "!"}</span>
                      <span>{chk.resultText}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Cause potentielle & Garde-fous de confidentialité (5 col) */}
            <div className="space-y-6 lg:col-span-5">
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs">
                <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                  <span className="rounded-md bg-[#F0C869] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#5C3D00]">
                    Cause potentielle identifiée
                  </span>
                  <h4 className="mt-3 text-[16.5px] font-semibold text-[#171717]">
                    La configuration de l’agent nécessite une vérification avant de rétablir le service.
                  </h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#525252]">
                    Les 5 premières couches (compte, abonnement Stripe, quota, trunk Twilio et moteur vocal ElevenLabs) sont 100 % opérationnelles. Le blocage provient uniquement d’une incohérence entre le prompt système de l’agent et ses permissions d’outils, couplée à l’absence de numéro de repli humain.
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2 px-1 pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDiagChecks((prev) =>
                        prev.map((c) => ({
                          ...c,
                          state: "OK",
                          resultText:
                            c.id === "chk-6"
                              ? "Configuration conforme"
                              : c.id === "chk-7"
                                ? "Routage de secours validé"
                                : c.resultText,
                        })),
                      );
                      notify("Vérification relancée : 7/7 points de contrôle opérationnels");
                    }}
                    className="h-9 flex-1 rounded-xl bg-[#171717] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
                  >
                    Re-tester après correction
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiagChecks(NOVA_DIAGNOSTIC_CHECKS)}
                    className="h-9 rounded-xl border border-[#E5E5E5] bg-white px-3 text-[12px] font-medium text-[#525252] hover:bg-[#F7F7F8] cursor-pointer whitespace-nowrap"
                  >
                    Réinitialiser
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 size-4.5 shrink-0 text-[#008F6D]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <div className="text-[12.5px] text-[#525252]">
                    <p className="font-semibold text-[#171717]">
                      Protocole strict d’accès aux données privées
                    </p>
                    <p className="mt-1 leading-relaxed">
                      Conformément à l’architecture de sécurité AutoCall, l’inspection approfondie d’un espace client est soumise à 4 conditions cumulatives :{" "}
                      <strong>
                        consentement actif du client, ticket de support associé ({diagTargetTicketCode.split(" ")[0]}), réauthentification MFA Super Admin et session en lecture seule limitée à 30 minutes
                      </strong>.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          04. SOUS-ONGLET DOCUMENTATION (Centre d'aide AutoCall · 14 catégories officielles)
         ===================================================================== */}
      {activeTab === "documentation" && (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs sm:flex-row sm:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Centre d’aide — Bibliothèque documentaire AutoCall (14 catégories)
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Chaque article publié alimente à la fois le Centre d’aide des clients et la base de connaissances autorisée d’AutoCall Support AI.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setArticleModalOpen(true)}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
            >
              + Nouvel article documentaire
            </button>
          </div>

          {/* Grille des 14 catégories officielles du Centre d'aide */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat, idx) => {
              const isSelected = cat.id === selectedCategory.id;
              return (
                <article
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`flex flex-col justify-between rounded-2xl border bg-[var(--surface)] p-3 shadow-2xs transition cursor-pointer ${
                    isSelected
                      ? "border-[#171717] ring-1 ring-[#171717]/10"
                      : "border-[var(--border)] hover:border-[#A3A3A3]"
                  }`}
                >
                  <div className="rounded-xl bg-[var(--surface-inset)] p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#171717] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                        <SolarIcon name={cat.icon} className="size-4" />
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 font-mono text-[10.5px] font-semibold ${
                          cat.status === "Publié"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : "bg-[#F0C869] text-[#5C3D00]"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-baseline gap-2">
                      <span className="font-mono text-[11px] font-semibold text-[#737373]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h4 className="text-[15.5px] font-semibold text-[#171717]">
                        {cat.name}
                      </h4>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[12px] text-[#525252]">
                      {cat.flagshipArticleTitle}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between px-1.5 text-[11.5px] text-[#737373]">
                    <span>{cat.articlesCount} articles ({cat.version})</span>
                    <span className="font-medium text-[#008F6D]">
                      {cat.aiIndexedCount} sources IA
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Barre de cycle de vie de l'article phare de la catégorie sélectionnée */}
          {selectedCategory && (
            <section className="rounded-2xl border border-[#171717] bg-white p-6 shadow-2xs">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#EAF3ED] px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#184D3B]">
                      Catégorie : {selectedCategory.name}
                    </span>
                    <span className="rounded-md bg-[#EFEFEF] px-2 py-0.5 font-mono text-[11.5px] text-[#171717]">
                      {selectedCategory.version}
                    </span>
                    <span className="text-[12px] text-[#737373]">
                      Mis à jour : {selectedCategory.lastUpdated}
                    </span>
                  </div>
                  <h4 className="mt-2 text-[17px] font-semibold text-[#171717]">
                    {selectedCategory.flagshipArticleTitle}
                  </h4>
                  <p className="mt-0.5 text-[13px] text-[#525252]">
                    Cycle complet : Création → Traduction (FR / EN / ES) → Prévisualisation → Approbation → Publication → Versionnage → Archivage.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      notify(`Aperçu multilingue (FR/EN/ES) ouvert pour « ${selectedCategory.flagshipArticleTitle} »`)
                    }
                    className="h-9 rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[12.5px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                  >
                    Prévisualiser &amp; Traduire
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategories((prev) =>
                        prev.map((c) =>
                          c.id === selectedCategory.id
                            ? {
                                ...c,
                                status: "Publié",
                                lastUpdated: "Approuvé à l’instant",
                              }
                            : c,
                        ),
                      );
                      notify(
                        `Catégorie « ${selectedCategory.name} » approuvée et synchronisée avec AutoCall Support AI`,
                      );
                    }}
                    className="h-9 rounded-xl bg-[#171717] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
                  >
                    Approuver &amp; Publier la version
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* =====================================================================
          05. SOUS-ONGLET RÉPONSES TYPES (Bibliothèque + Variables dynamiques + Copier)
         ===================================================================== */}
      {activeTab === "canned-responses" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Liste des 4 réponses types (5 col) */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
            <h3 className="text-[17px] font-semibold text-[#171717]">
              Bibliothèque de réponses types
            </h3>
            <p className="mt-0.5 text-[13px] text-[#737373]">
              Sélectionnez un modèle standardisé pour accélérer le traitement des tickets récurrents.
            </p>

            <div className="mt-4 space-y-3">
              {cannedResponses.map((tpl) => {
                const isSelected = tpl.id === selectedCanned.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedCannedId(tpl.id)}
                    className={`w-full rounded-xl border p-4 text-left transition cursor-pointer ${
                      isSelected
                        ? "border-[#171717] bg-[#F4F8F6]"
                        : "border-[#EFEFEF] bg-[#FAFAFA] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14.5px] font-semibold text-[#171717]">
                        {tpl.title}
                      </span>
                      <span className="rounded-md border border-[#E5E5E5] bg-white px-2 py-0.5 font-mono text-[11px] font-medium text-[#525252]">
                        {tpl.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Aperçu personnalisable avec variables dynamiques (7 col) */}
          <section className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#171717]">
                    Aperçu de la réponse — {selectedCanned.title}
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#737373]">
                    Variables injectées automatiquement : nom du client, entreprise, numéro de ticket et fonctionnalité.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCannedResponse}
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#171717] px-4 text-[12.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
                >
                  <span>Copier la réponse</span>
                </button>
              </div>

              {/* Champs de variables dynamiques */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-[12.5px]">
                <div>
                  <label className="block font-medium text-[#525252]">
                    Variable {"{{nom_client}}"}
                  </label>
                  <input
                    type="text"
                    value={varClientName}
                    onChange={(e) => setVarClientName(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-[13px] text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#525252]">
                    Variable {"{{entreprise}}"}
                  </label>
                  <input
                    type="text"
                    value={varCompanyName}
                    onChange={(e) => setVarCompanyName(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-[13px] text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#525252]">
                    Variable {"{{numero_ticket}}"}
                  </label>
                  <input
                    type="text"
                    value={varTicketCode}
                    onChange={(e) => setVarTicketCode(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 font-mono text-[13px] text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#525252]">
                    Variable {"{{fonctionnalite}}"}
                  </label>
                  <input
                    type="text"
                    value={varFeatureName}
                    onChange={(e) => setVarFeatureName(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-[13px] text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>
              </div>

              {/* Zone d'aperçu du message final */}
              <div className="mt-4 rounded-2xl border border-[#E5E5E5] bg-[#FAFBFB] p-4">
                <pre className="font-sans text-[13.5px] leading-relaxed whitespace-pre-wrap text-[#171717]">
                  {renderedCannedPreview}
                </pre>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          06. SOUS-ONGLET PERFORMANCES (12 min / 2 h 35 / 96 % / 68 % + Sem. 1-4 + Motifs)
         ===================================================================== */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          {/* 4 cartes KPI double surface avec badges d'icônes : 12 min / 2 h 35 / 96 % / 68 % */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Temps de première réponse
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  12 min
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                Médiane sur les 30 derniers jours
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="help" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Temps de résolution
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  2 h 35
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[var(--text-muted)]">
                Médiane (heures ouvrées)
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="chart" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Satisfaction client
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  {"96 %"}
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                Sur les avis reçus après clôture
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="agents" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Résolutions confirmées par IA
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  {"68 %"}
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[var(--text-muted)]">
                Sur les demandes prises en charge par IA (hors abandons)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Évolution des tickets (Sem. 1 à Sem. 4) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#171717]">
                    Évolution des tickets (30 derniers jours)
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#737373]">
                    Comparaison hebdomadaire entre les tickets reçus et les tickets résolus.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[12px] font-medium text-[#525252]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-[#171717]" />
                    <span>Tickets reçus</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-[#408963]" />
                    <span>Tickets résolus</span>
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-4 pt-2">
                {WEEKLY_TICKETS_CHART.map((wk) => {
                  const recPct = Math.round((wk.received / 64) * 100);
                  const resPct = Math.round((wk.resolved / 64) * 100);
                  return (
                    <div key={wk.week} className="flex flex-col items-center">
                      <span className="mb-1.5 font-mono text-[11.5px] font-semibold text-[#525252] tabular-nums">
                        {wk.received} / {wk.resolved}
                      </span>
                      <div className="flex h-44 w-full items-end justify-center gap-2 rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2.5">
                        <div
                          style={{ height: `${recPct}%` }}
                          className="w-5 rounded-t-md bg-[#171717]"
                          title={`${wk.week} : ${wk.received} reçus`}
                        />
                        <div
                          style={{ height: `${resPct}%` }}
                          className="w-5 rounded-t-md bg-[#408963]"
                          title={`${wk.week} : ${wk.resolved} résolus`}
                        />
                      </div>
                      <span className="mt-2 text-[13px] font-medium text-[#171717]">
                        {wk.week}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 text-[12.5px] text-[#525252]">
                <strong>Règle de mesure :</strong> Une conversation abandonnée par un utilisateur n’est jamais comptabilisée comme une résolution réussie par l’IA.
              </div>
            </section>

            {/* Principaux motifs de contact (34 % / 26 % / 18 % / 14 % / 8 %) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
              <div className="border-b border-[#EFEFEF] pb-4">
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Principaux motifs de contact
                </h3>
                <p className="mt-0.5 text-[13px] text-[#737373]">
                  Répartition des demandes clients par domaine fonctionnel.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {CONTACT_REASONS_BREAKDOWN.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-[13.5px]">
                      <span className="font-medium text-[#171717]">{item.label}</span>
                      <span className="font-mono font-bold text-[#171717] tabular-nums">
                        {`${item.sharePct} %`}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EFEFEF]">
                      <div
                        style={{ width: `${item.sharePct}%` }}
                        className="h-full rounded-full bg-[#408963]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALE 1 : OUVERTURE DE SESSION DE DIAGNOSTIC (LECTURE SEULE 30 MIN · MFA)
         ===================================================================== */}
      {diagModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              Session de diagnostic temporaire (30 min · Lecture seule)
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              Cible : <strong>{diagTargetTicketCode}</strong> · Consentement client vérifié. Aucune modification silencieuse n’est autorisée pendant la session.
            </p>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Motif consigné dans le journal d’audit
                </label>
                <input
                  type="text"
                  value={diagReason}
                  onChange={(e) => setDiagReason(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Code de réauthentification MFA Super Admin (6 chiffres)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={diagTotp}
                  onChange={(e) => setDiagTotp(e.target.value)}
                  placeholder="•••••• (ex: 123456)"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[14px] tracking-widest text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => setDiagModalOpen(false)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleOpenDiagnosticSession}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Autoriser pour 30 minutes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALE 2 : CRÉATION D'UN ARTICLE DOCUMENTAIRE DANS LE CENTRE D'AIDE
         ===================================================================== */}
      {articleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              Nouvel article du Centre d’aide AutoCall
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              Une fois approuvé et publié, cet article sera accessible aux clients et indexé dans les sources autorisées d’AutoCall Support AI.
            </p>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Catégorie officielle (14 rubriques)
                </label>
                <PremiumSelect
                  value={newArticleCategory}
                  onChange={setNewArticleCategory}
                  ariaLabel="Catégorie du centre d’aide"
                  className="mt-1"
                  options={INITIAL_HELP_CATEGORIES.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Titre de la procédure
                </label>
                <input
                  type="text"
                  value={newArticleTitle}
                  onChange={(e) => setNewArticleTitle(e.target.value)}
                  placeholder="Ex: Connecter un numéro par renvoi d’appel opérateur"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => setArticleModalOpen(false)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handlePublishArticle}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Approuver &amp; Publier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

