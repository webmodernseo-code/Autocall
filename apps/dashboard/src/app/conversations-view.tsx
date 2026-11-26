"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { GmailBrandSvg, OutlookBrandSvg, WhatsAppBrandSvg } from "./brand-icons";
import { EmailTools, PhoneTools, WhatsAppTools } from "./communication-tools";
import { PremiumSelect } from "./premium-select";
import { type Locale, SolarIcon } from "./workspace-navigation";

type ChannelTab = "all" | "phone" | "whatsapp" | "email";
type ConversationStatus = "pending" | "done";
type ComposerMode = "reply" | "note";
type HandlingMode = "manual" | "assisted" | "automatic";
const handlingLabels: Record<HandlingMode, string> = {
  manual: "Manuel",
  assisted: "Assisté",
  automatic: "Automatique",
};

interface ExchangeLine {
  id: string;
  speaker: string;
  speakerRole?: string;
  isAgent: boolean;
  isHumanReply?: boolean;
  isInternalNote?: boolean;
  time: string;
  text: string;
  dateGroup?: string;
  sentiment?: "positive" | "neutral";
}

interface TimelineEvent {
  id: string;
  dateGroup: string;
  time: string;
  actorName: string;
  actorAvatar: string;
  label: string;
  detail?: string;
}

interface ExtractedCriteria {
  surface: string;
  frequency: string;
  budgetEst: string;
  urgency: string;
}

interface ConversationItem {
  id: string;
  contactName: string;
  role: string;
  company: string;
  city: string;
  initials: string;
  phone: string;
  email: string;
  createdAt: string;
  lastSeen: string;
  channel: "phone" | "whatsapp" | "email";
  emailProvider?: "gmail" | "outlook";
  subject?: string;
  callDirection?: "Entrant" | "Sortant";
  preview: string;
  timestamp: string;
  unreadCount?: number;
  score: number;
  tempLabel: "Chaud" | "Tiède";
  agentName: "Thomas" | "Sophie" | "Emma";
  agentRole: string;
  agentAvatar: string;
  initiatedBy: { name: string; avatar: string };
  lastRepliedBy: { name: string; avatar: string };
  status: ConversationStatus;
  handlingMode?: HandlingMode;
  hasRecording: boolean;
  recordingDurationSec?: number;
  aiSummary: string;
  nextAction: string;
  criteria: ExtractedCriteria;
  qualificationTags: string[];
  exchanges: ExchangeLine[];
  timeline: TimelineEvent[];
}

const QUICK_REPLIES = [
  {
    cmd: "/bonjour",
    title: "Accueil & disponibilité",
    label: "Bonjour ! Comment puis-je vous aider aujourd’hui ?",
  },
  {
    cmd: "/devis",
    title: "Envoi du devis sous 24 h",
    label: "Je vous prépare votre proposition chiffrée détaillée et vous l’envoie dans la journée.",
  },
  {
    cmd: "/rdv",
    title: "Proposition de créneaux",
    label: "Nous avons un créneau de visite technique disponible demain à 10 h 30 ou 14 h 30. Qu’en pensez-vous ?",
  },
  {
    cmd: "/contrat",
    title: "Transmission contrat-type",
    label: "Je vous joins notre contrat-type d’entretien annuel ainsi que notre attestation RC Pro.",
  },
];

const INITIAL_CONVERSATIONS: ConversationItem[] = [
  {
    id: "conv-sophie",
    contactName: "Sophie Bernard",
    role: "Gérante associée",
    company: "Cabinet Bernard & Associés",
    city: "Lyon 6e (69)",
    initials: "SB",
    phone: "+33 6 77 31 04 58",
    email: "s.bernard@cabinet-bernard.fr",
    createdAt: "12 mai 2026 · 09:12",
    lastSeen: "Aujourd’hui · 09:19",
    channel: "whatsapp",
    preview: "Oui parfait, pouvez-vous me confirmer le tarif exact par écrit ?",
    timestamp: "09:19",
    unreadCount: 2,
    score: 91,
    tempLabel: "Chaud",
    agentName: "Emma",
    agentRole: "Support & Qualification WhatsApp",
    agentAvatar: "/avatars/agents/agent-4.jpg",
    initiatedBy: { name: "Emma · Agent IA", avatar: "/avatars/agents/agent-4.jpg" },
    lastRepliedBy: { name: "Emma · Agent IA", avatar: "/avatars/agents/agent-4.jpg" },
    status: "pending",
    hasRecording: false,
    aiSummary:
      "Remise en état ponctuelle demandée avant vendredi 9 h pour un cabinet médical de 120 m². Tarif de 190 € HT pré-validé par la cliente.",
    nextAction: "Envoyer le bon d’intervention écrit de 190 € HT pour signature.",
    criteria: {
      surface: "120 m² (Cabinet)",
      frequency: "Ponctuel · Vendredi 7h",
      budgetEst: "190 € HT",
      urgency: "Haute (sous 48 h)",
    },
    qualificationTags: ["Urgent · Vendredi", "Cabinet médical", "Devis validé"],
    exchanges: [
      {
        id: "s1",
        speaker: "Sophie Bernard",
        speakerRole: "Cabinet Bernard & Associés",
        isAgent: false,
        time: "09:15",
        dateGroup: "Hier",
        text: "Bonjour, quels sont vos tarifs pour une remise en état ponctuelle d’un cabinet médical de 120 m² ?",
      },
      {
        id: "s2",
        speaker: "Sophie Bernard",
        speakerRole: "Cabinet Bernard & Associés",
        isAgent: false,
        time: "09:16",
        text: "Auriez-vous une équipe disponible ce vendredi matin avant l’ouverture à 9 h ?",
      },
      {
        id: "s3",
        speaker: "Emma",
        speakerRole: "Agent IA AutoCall",
        isAgent: true,
        time: "09:16",
        text: "Bonjour Sophie. Oui, notre équipe secteur Lyon 6e est disponible ce vendredi entre 6 h 45 et 8 h 45.",
      },
      {
        id: "s4",
        speaker: "Emma",
        speakerRole: "Agent IA AutoCall",
        isAgent: true,
        time: "09:17",
        text: "Pour 120 m² en protocole cabinet médical (désinfection des surfaces et sols), le forfait est de 190 € HT tout compris.",
      },
      {
        id: "s5",
        speaker: "Sophie Bernard",
        speakerRole: "Cabinet Bernard & Associés",
        isAgent: false,
        time: "09:18",
        dateGroup: "Aujourd’hui",
        text: "Parfait, merci pour votre réactivité. Nous validons ce créneau pour vendredi matin.",
        sentiment: "positive",
      },
      {
        id: "s6",
        speaker: "Emma",
        speakerRole: "Agent IA AutoCall",
        isAgent: true,
        time: "09:18",
        text: "C’est bien noté Sophie, je bloque le créneau auprès du responsable d’exploitation et prépare votre confirmation.",
      },
      {
        id: "s7",
        speaker: "Sophie Bernard",
        speakerRole: "Cabinet Bernard & Associés",
        isAgent: false,
        time: "09:19",
        text: "Oui parfait, pouvez-vous me confirmer le tarif exact par écrit ?",
      },
    ],
    timeline: [
      {
        id: "tl-1",
        dateGroup: "Hier",
        time: "09:16",
        actorName: "Emma",
        actorAvatar: "/avatars/agents/agent-4.jpg",
        label: "Qualification WhatsApp instantanée",
        detail: "Surface 120 m² & créneau vendredi détectés",
      },
      {
        id: "tl-2",
        dateGroup: "Hier",
        time: "09:20",
        actorName: "Thomas",
        actorAvatar: "/avatars/agents/agent-1.jpg",
        label: "Estimation chiffrée générée",
        detail: "Forfait 190 € HT cabinet médical",
      },
      {
        id: "tl-3",
        dateGroup: "Aujourd’hui",
        time: "09:18",
        actorName: "Emma",
        actorAvatar: "/avatars/agents/agent-4.jpg",
        label: "Accord client détecté",
        detail: "En attente d’envoi du bon écrit",
      },
    ],
  },
  {
    id: "conv-marc",
    contactName: "Marc Dupont",
    role: "Directeur général",
    company: "Dupont Bureaux & Services",
    city: "Villeurbanne (69)",
    initials: "MD",
    phone: "+33 6 42 18 90 12",
    email: "marc.dupont@dupont-services.fr",
    createdAt: "10 mai 2026 · 14:20",
    lastSeen: "Aujourd’hui · 10:46",
    channel: "phone",
    callDirection: "Entrant",
    preview: "Transcription d’appel : bureaux 200 m², 3 passages/semaine",
    timestamp: "10:42",
    score: 84,
    tempLabel: "Chaud",
    agentName: "Thomas",
    agentRole: "Agent vocal commercial",
    agentAvatar: "/avatars/agents/agent-1.jpg",
    initiatedBy: { name: "Thomas · Agent IA", avatar: "/avatars/agents/agent-1.jpg" },
    lastRepliedBy: { name: "Thomas · Agent IA", avatar: "/avatars/agents/agent-1.jpg" },
    status: "done",
    hasRecording: true,
    recordingDurationSec: 272,
    aiSummary:
      "Appel entrant qualifié en 4 min 32 s. Marc recherche un contrat régulier pour 200 m² de bureaux à raison de 3 passages par semaine après 19 h.",
    nextAction: "Planifier la visite sur site avec un chargé d’affaires cette semaine.",
    criteria: {
      surface: "200 m² (Bureaux)",
      frequency: "3 fois / sem. (> 19h)",
      budgetEst: "890 € HT / mois",
      urgency: "Rappel cette semaine",
    },
    qualificationTags: ["Contrat récurrent", "200 m²", "3x / semaine"],
    exchanges: [
      {
        id: "m1",
        speaker: "Thomas",
        speakerRole: "Agent vocal IA · 00:04",
        isAgent: true,
        time: "10:42",
        dateGroup: "Aujourd’hui",
        text: "Bonjour, vous êtes bien chez AutoCall Propreté, je suis Thomas. Comment puis-je vous accompagner ?",
      },
      {
        id: "m2",
        speaker: "Marc Dupont",
        speakerRole: "Interlocuteur · 00:19",
        isAgent: false,
        time: "10:42",
        text: "Bonjour, je souhaiterais obtenir un devis pour l’entretien régulier de nos nouveaux bureaux à Villeurbanne.",
      },
      {
        id: "m3",
        speaker: "Thomas",
        speakerRole: "Agent vocal IA · 00:34",
        isAgent: true,
        time: "10:43",
        text: "Avec plaisir Monsieur Dupont. Quelle est la surface approximative des locaux et à quelle fréquence souhaitez-vous nos passages ?",
      },
      {
        id: "m4",
        speaker: "Marc Dupont",
        speakerRole: "Interlocuteur · 01:12",
        isAgent: false,
        time: "10:44",
        text: "Nous avons 200 m² de bureaux ouverts et deux salles de réunion. L’idéal serait trois passages par semaine après 19 h.",
        sentiment: "positive",
      },
      {
        id: "m5",
        speaker: "Thomas",
        speakerRole: "Agent vocal IA · 02:05",
        isAgent: true,
        time: "10:45",
        text: "C’est parfaitement clair. J’ai transmis votre cahier des charges à notre chargé de secteur qui vous rappelle jeudi à 14 h 30.",
      },
    ],
    timeline: [
      {
        id: "tlm-1",
        dateGroup: "Aujourd’hui",
        time: "10:42",
        actorName: "Thomas",
        actorAvatar: "/avatars/agents/agent-1.jpg",
        label: "Appel entrant décroché en 1,2 s",
        detail: "Ligne directe +33 4 78 14 22 00",
      },
      {
        id: "tlm-2",
        dateGroup: "Aujourd’hui",
        time: "10:46",
        actorName: "Thomas",
        actorAvatar: "/avatars/agents/agent-1.jpg",
        label: "Transcription & qualification BANT",
        detail: "Score prospect évalué à 84/100",
      },
    ],
  },
  {
    id: "conv-nova",
    contactName: "Hélène Garnier",
    role: "Responsable Achats",
    company: "Nova Logistique SAS",
    city: "Saint-Priest (69)",
    initials: "HG",
    phone: "+33 1 84 19 22 40",
    email: "achats@nova-logistique.fr",
    createdAt: "08 mai 2026 · 11:05",
    lastSeen: "Hier · 16:42",
    channel: "email",
    emailProvider: "gmail",
    subject: "Appel d’offres entretien multi-sites — 2 entrepôts & 400 m² bureaux",
    preview: "Bonjour, nous recherchons un prestataire pour deux entrepôts...",
    timestamp: "Hier",
    unreadCount: 1,
    score: 88,
    tempLabel: "Chaud",
    agentName: "Sophie",
    agentRole: "Assistante commerciale Email",
    agentAvatar: "/avatars/agents/agent-2.jpg",
    initiatedBy: { name: "Hélène Garnier", avatar: "/avatars/agents/agent-2.jpg" },
    lastRepliedBy: { name: "Sophie · Agent IA", avatar: "/avatars/agents/agent-2.jpg" },
    status: "pending",
    hasRecording: false,
    aiSummary:
      "Consultation achats pour un contrat annuel multi-sites à Saint-Priest : 2 entrepôts logistiques + 400 m² de bureaux administratifs.",
    nextAction: "Valider la date de visite technique multi-sites avec le directeur régional.",
    criteria: {
      surface: "2 entrepôts + 400 m²",
      frequency: "Quotidien (5j / 7)",
      budgetEst: "3 450 € HT / mois",
      urgency: "Démarrage 1er juin",
    },
    qualificationTags: ["Compte multi-sites", "Appel d’offres", "Logistique"],
    exchanges: [
      {
        id: "n1",
        speaker: "Hélène Garnier",
        speakerRole: "achats@nova-logistique.fr",
        isAgent: false,
        time: "16:40",
        dateGroup: "Hier",
        text: "Bonjour,\n\nDans le cadre du renouvellement de notre contrat annuel, nous recherchons un prestataire pour deux entrepôts et 400 m² de bureaux à Saint-Priest. Pouvez-vous nous transmettre votre grille tarifaire et vos disponibilités pour une visite technique ?",
      },
      {
        id: "n2",
        speaker: "Sophie",
        speakerRole: "Réponse automatique qualifiée",
        isAgent: true,
        time: "16:42",
        text: "Bonjour Madame Garnier,\n\nNous vous remercions pour votre sollicitation. Votre cahier des charges multi-sites (Saint-Priest) a été transmis à notre directeur d’exploitation grands comptes. Nous vous proposons une visite technique ce jeudi à 10 h 00 ou vendredi à 14 h 00.",
      },
    ],
    timeline: [
      {
        id: "tln-1",
        dateGroup: "Hier",
        time: "16:40",
        actorName: "Sophie",
        actorAvatar: "/avatars/agents/agent-2.jpg",
        label: "Email entrant analysé",
        detail: "Cahier des charges multi-sites extrait",
      },
      {
        id: "tln-2",
        dateGroup: "Hier",
        time: "16:42",
        actorName: "Sophie",
        actorAvatar: "/avatars/agents/agent-2.jpg",
        label: "Accusé de réception & créneaux envoyés",
        detail: "Temps de réponse : 1 min 48 s",
      },
    ],
  },
  {
    id: "conv-claire",
    contactName: "Claire Moreau",
    role: "Gestionnaire de copropriétés",
    company: "Horizon Immobilier",
    city: "Lyon 3e (69)",
    initials: "CM",
    phone: "+33 6 19 84 55 03",
    email: "c.moreau@horizon-immo.fr",
    createdAt: "04 mai 2026 · 15:30",
    lastSeen: "Hier · 14:11",
    channel: "phone",
    callDirection: "Sortant",
    preview: "Validation en conseil syndical mardi — envoyer le contrat-type",
    timestamp: "Hier",
    score: 76,
    tempLabel: "Tiède",
    agentName: "Thomas",
    agentRole: "Agent vocal commercial",
    agentAvatar: "/avatars/agents/agent-1.jpg",
    initiatedBy: { name: "Thomas · Agent IA", avatar: "/avatars/agents/agent-1.jpg" },
    lastRepliedBy: { name: "Thomas · Agent IA", avatar: "/avatars/agents/agent-1.jpg" },
    status: "done",
    hasRecording: true,
    recordingDurationSec: 194,
    aiSummary:
      "Suite à la relance du devis copropriétés, Claire confirme le passage en conseil syndical mardi prochain pour 3 résidences et demande le contrat-type.",
    nextAction: "Envoyer le contrat-type syndic avant lundi 12 h.",
    criteria: {
      surface: "3 résidences (parties comm.)",
      frequency: "2 passages / sem. + vitrerie",
      budgetEst: "1 620 € HT / mois",
      urgency: "Conseil mardi matin",
    },
    qualificationTags: ["Syndic · 3 résidences", "Contrat-type requis"],
    exchanges: [
      {
        id: "c1",
        speaker: "Thomas",
        speakerRole: "Agent vocal IA · 00:03",
        isAgent: true,
        time: "14:10",
        dateGroup: "Hier",
        text: "Bonjour Claire, c’est Thomas d’AutoCall Propreté suite à notre proposition tarifaire envoyée la semaine dernière pour vos trois résidences.",
      },
      {
        id: "c2",
        speaker: "Claire Moreau",
        speakerRole: "Interlocuteur · 00:22",
        isAgent: false,
        time: "14:11",
        text: "Bonjour Thomas, vos tarifs sont bien positionnés. Le conseil syndical se réunit mardi matin pour trancher, pouvez-vous m’envoyer votre contrat-type avant lundi ?",
        sentiment: "positive",
      },
      {
        id: "c3",
        speaker: "Thomas",
        speakerRole: "Agent vocal IA · 00:49",
        isAgent: true,
        time: "14:12",
        text: "C’est noté Madame Moreau. Nous vous faisons parvenir le contrat-type syndic ainsi que nos attestations dès aujourd’hui par e-mail.",
      },
    ],
    timeline: [
      {
        id: "tlc-1",
        dateGroup: "Hier",
        time: "14:10",
        actorName: "Thomas",
        actorAvatar: "/avatars/agents/agent-1.jpg",
        label: "Appel sortant de suivi devis",
        detail: "Campagne Relance Devis Q1",
      },
    ],
  },
];

const OUTLOOK_CONVERSATION: ConversationItem = {
  id: "conv-outlook-atelier",
  contactName: "Camille Moreau",
  role: "Responsable des opérations",
  company: "Atelier Rivage",
  city: "Nantes",
  initials: "CM",
  phone: "",
  email: "camille@atelier-rivage.example",
  createdAt: "26 nov. 2026 · 10:24",
  lastSeen: "26 nov. 2026 · 10:24",
  channel: "email",
  emailProvider: "outlook",
  subject: "Confirmation de notre rendez-vous",
  preview: "Bonjour, je vous confirme ma disponibilité jeudi à 14 h.",
  timestamp: "10:24",
  unreadCount: 1,
  score: 72,
  tempLabel: "Tiède",
  agentName: "Sophie",
  agentRole: "Assistante commerciale Email",
  agentAvatar: "/avatars/agents/agent-2.jpg",
  initiatedBy: { name: "Camille Moreau", avatar: "/avatars/agents/agent-2.jpg" },
  lastRepliedBy: { name: "Camille Moreau", avatar: "/avatars/agents/agent-2.jpg" },
  status: "pending",
  hasRecording: false,
  aiSummary: "Camille confirme sa disponibilité pour la présentation commerciale.",
  nextAction: "Vérifier le créneau dans l’agenda.",
  criteria: { surface: "—", frequency: "—", budgetEst: "—", urgency: "Cette semaine" },
  qualificationTags: ["Rendez-vous"],
  exchanges: [{
    id: "outlook-1",
    speaker: "Camille Moreau",
    speakerRole: "camille@atelier-rivage.example",
    isAgent: false,
    time: "10:24",
    dateGroup: "26 novembre 2026",
    text: "Bonjour,\n\nJe vous confirme ma disponibilité jeudi à 14 h pour la présentation de vos services.\n\nBien cordialement,\nCamille",
  }],
  timeline: [],
};

// Barres d'onde audio déterministes pour un rendu vectoriel net style Linear/Raycast
const WAVEFORM_BARS = [
  28, 46, 35, 68, 82, 54, 40, 74, 92, 60, 44, 78, 88, 52, 34, 62, 85, 95, 70, 48,
  36, 64, 80, 58, 42, 72, 90, 66, 50, 76, 62, 40, 55, 84, 72, 46, 32, 58, 44, 30,
];

function formatSeconds(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function DoubleCheckSvg({ className = "size-3.5 text-[#8C8C8C]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m2 12 4.5 4.5L15 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m8.5 12 4.5 4.5L21.5 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChannelBadge({
  channel,
  callDirection,
}: {
  channel: ConversationItem["channel"];
  callDirection?: ConversationItem["callDirection"];
}) {
  if (channel === "whatsapp") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E5E5] bg-white px-2.5 py-0.5 text-[13px] font-medium text-[#171717] shadow-2xs">
        <WhatsAppBrandSvg className="size-3.5 shrink-0" />
        <span>WhatsApp Business</span>
      </span>
    );
  }
  if (channel === "email") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E5E5] bg-white px-2.5 py-0.5 text-[13px] font-medium text-[#171717] shadow-2xs">
        <GmailBrandSvg className="size-3.5 shrink-0" />
        <span>E-mail</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E5E5] bg-white px-2.5 py-0.5 text-[13px] font-medium text-[#171717] shadow-2xs">
      <SolarIcon name="phone" className="size-3.5 text-[#008F6D]" />
      <span>Appel {callDirection ? callDirection.toLowerCase() : "vocal"}</span>
    </span>
  );
}

export function ConversationsView({
  locale,
  onOpenCrm,
}: {
  locale: Locale;
  onOpenCrm?: () => void;
}) {
  const isEn = locale === "en";
  const [channelTab, setChannelTab] = useState<ChannelTab>("all");
  const crmDialogRef = useRef<HTMLDialogElement>(null);
  const [crmExpanded, setCrmExpanded] = useState(false);
  const isWhatsApp = channelTab === "whatsapp";
  const isEmail = channelTab === "email";
  const isPhone = channelTab === "phone";
  const [emailProvider, setEmailProvider] = useState<"gmail" | "outlook">("gmail");
  const isOutlook = emailProvider === "outlook";
  const [callDirectionFilter, setCallDirectionFilter] = useState<"all" | "Entrant" | "Sortant">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [agentFilter, setAgentFilter] = useState("all");
  const [mobilePanel, setMobilePanel] = useState<"inbox" | "thread">("inbox");
  const [statusFilter, setStatusFilter] = useState<"all" | ConversationStatus>("all");
  const [conversations, setConversations] = useState<ConversationItem[]>([...INITIAL_CONVERSATIONS, OUTLOOK_CONVERSATION]);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_CONVERSATIONS[0].id);

  const [assignedTeam, setAssignedTeam] = useState("commercial");
  const [assignedAgent, setAssignedAgent] = useState("Emma");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<"1x" | "1.25x" | "1.5x">("1x");
  const [playProgressSec, setPlayProgressSec] = useState(58);
  const [composerMode, setComposerMode] = useState<ComposerMode>("reply");
  const [reply, setReply] = useState({ conversationId: "", body: "" });
  const [rdvOpen, setRdvOpen] = useState(false);
  const [rdvDate, setRdvDate] = useState("Jeudi 27 nov. · 14:30");
  const [toast, setToast] = useState<string | null>(null);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return conversations.filter((c) => {
      if (channelTab !== "all" && c.channel !== channelTab) return false;
      if (channelTab === "email" && c.emailProvider !== emailProvider) return false;
      if (channelTab === "phone" && callDirectionFilter !== "all" && c.callDirection !== callDirectionFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (unreadOnly && !c.unreadCount && c.id !== selectedId) return false;
      if (agentFilter !== "all" && c.agentName !== agentFilter) return false;
      if (!q) return true;
      return (
        c.contactName.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q) ||
        c.aiSummary.toLowerCase().includes(q)
      );
    });
  }, [conversations, channelTab, statusFilter, searchQuery, unreadOnly, selectedId, agentFilter, callDirectionFilter, emailProvider]);

  const activeConversation = useMemo(() => {
    return (
      filteredConversations.find((c) => c.id === selectedId) ??
      filteredConversations[0] ??
      conversations[0]
    );
  }, [filteredConversations, selectedId, conversations]);

  useEffect(() => {
    if (!isPlaying || !activeConversation?.recordingDurationSec) return;
    const total = activeConversation.recordingDurationSec;
    const timer = window.setInterval(() => {
      setPlayProgressSec((prev) => {
        if (prev + 1 >= total) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying, activeConversation?.recordingDurationSec]);

  const replyDraft = reply.conversationId === activeConversation.id ? reply.body : "";
  const setReplyDraft = (body: string) => setReply({ conversationId: activeConversation.id, body });

  const handleSelectConversation = (conv: ConversationItem) => {
    setSelectedId(conv.id);
    setMobilePanel("thread");
    setReply({ conversationId: conv.id, body: "" });
    setAssignedAgent(conv.agentName);
    setIsPlaying(false);
    setPlayProgressSec(conv.hasRecording ? 58 : 0);
    setRdvOpen(false);
    setComposerMode(conv.channel === "phone" ? "note" : "reply");
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: undefined } : c)),
    );
  };

  const handleToggleResolve = (id: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "done" ? "pending" : "done" }
          : c,
      ),
    );
    notify("Statut de la conversation mis à jour");
  };

  const handleSendReply = (overrideText?: string) => {
    const trimmed = (overrideText ?? replyDraft).trim();
    if (!trimmed || !filteredConversations.length) return;
    const isNote = composerMode === "note";
    const newLine: ExchangeLine = {
      id: `reply-${Date.now()}`,
      speaker: isNote ? "Note interne · Tanjim Islam" : "Tanjim Islam",
      speakerRole: isNote ? "Visible uniquement par l’équipe" : "Responsable commercial",
      isAgent: false,
      isHumanReply: !isNote,
      isInternalNote: isNote,
      time: "À l’instant",
      text: trimmed,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              preview: isNote ? `Note : ${trimmed}` : trimmed,
              timestamp: "À l’instant",
              exchanges: [...c.exchanges, newLine],
            }
          : c,
      ),
    );
    setReplyDraft("");
    notify(
      isNote
        ? "Note interne ajoutée au dossier"
        : activeConversation.channel === "whatsapp"
          ? "Message WhatsApp simulé dans le fil"
          : "Réponse simulée dans le fil",
    );
  };

  const handleConfirmRdv = () => {
    if (!activeConversation) return;
    setRdvOpen(false);
    notify(`Rendez-vous simulé avec ${activeConversation.contactName} (${rdvDate})`);
  };

  const handleCopy = (value: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    notify(`${label} copié dans le presse-papiers`);
  };

  const tabs: { id: ChannelTab; label: string; count: number }[] = [
    { id: "all", label: isEn ? "All conversations" : "Toutes les conversations", count: conversations.length },
    {
      id: "phone",
      label: isEn ? "Calls and telephony" : "Appels et téléphonie",
      count: conversations.filter((c) => c.channel === "phone").length,
    },
    {
      id: "email",
      label: isEn ? "Email and messaging" : "Emails et messagerie",
      count: conversations.filter((c) => c.channel === "email").length,
    },
    {
      id: "whatsapp",
      label: isEn ? "WhatsApp and voice notes" : "WhatsApp et notes vocales",
      count: conversations.filter((c) => c.channel === "whatsapp").length,
    },
  ];

  const pendingCount = conversations.filter((c) => c.status === "pending").length;
  const resolvedCount = conversations.filter((c) => c.status === "done").length;
  const totalSec = activeConversation.recordingDurationSec ?? 272;
  const progressPct = Math.min(100, Math.round((playProgressSec / totalSec) * 100));
  const showSlashMenu = replyDraft.startsWith("/");

  return (
    <div className="@container w-full min-w-0 space-y-6 px-4 py-6 sm:px-7 sm:py-8">
      {toast && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-[14px] font-medium text-[#171717] shadow-lg">
          <span className="size-2 rounded-full bg-[#008F6D]" />
          {toast}
        </div>
      )}

      {/* En-tête aligné sur le design system CRM / Acquisition */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-[24px] leading-[32px] font-semibold tracking-[-0.025em] text-[#171717]">
              Communications
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-2.5 py-0.5 text-[12.5px] font-medium text-[#525252]">
              <span className="size-1.5 rounded-full bg-[#008F6D]" />
              {pendingCount} à traiter · {resolvedCount} résolues
            </span>
          </div>
          <p className="mt-1 text-[14px] leading-[21px] text-[#525252]">
            {isEn
              ? "Centralize calls, WhatsApp threads, and emails handled by your AI agents."
              : "Centralisez les appels transcrits, échanges WhatsApp et e-mails traités par vos agents."}
          </p>
        </div>

        {/* Filtres rapides de statut en pilules segmentées sobres */}
        <div className="inline-flex max-w-full flex-wrap gap-1 self-start rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-1 sm:self-auto">
          {(
            [
              { id: "all", label: "Toutes", count: conversations.length },
              { id: "pending", label: "À traiter", count: pendingCount },
              { id: "done", label: "Résolues", count: resolvedCount },
            ] as const
          ).map((st) => {
            const active = statusFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(st.id)}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors motion-reduce:transition-none sm:px-3 ${
                  active
                    ? "border-[#214f40] bg-linear-to-b from-[#2c5949] to-[#183d31] text-white shadow-[inset_0_1px_0_#ffffff24,0_1px_2px_#14382a2e] hover:from-[#346452]"
                    : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs tabular-nums ${
                    active ? "bg-white/15 text-white" : "bg-[var(--surface)] text-[var(--text-secondary)]"
                  }`}
                >
                  {st.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Onglets de canaux */}
      <div
        role="tablist"
        aria-label="Sections Communications"
        className="flex items-center gap-4 overflow-x-auto border-b border-[#E5E5E5] sm:gap-6"
      >
        {tabs.map((tb) => {
          const selected = channelTab === tb.id;
          return (
            <button
              key={tb.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setChannelTab(tb.id);
                setMobilePanel("inbox");
                setReplyDraft("");
                setIsPlaying(false);
                setRdvOpen(false);
              }}
              className={`relative flex shrink-0 items-center gap-2.5 pb-3 text-[14px] transition-colors cursor-pointer ${
                selected
                  ? "font-semibold text-[#171717]"
                  : "font-normal text-[#737373] hover:text-[#171717]"
              }`}
            >
              {tb.id === "all" ? (
                <SolarIcon
                  name="conversations"
                  active={selected}
                  className="size-[17px] shrink-0"
                />
              ) : tb.id === "phone" ? (
                <SolarIcon
                  name="phone"
                  active={selected}
                  className="size-[17px] shrink-0"
                />
              ) : tb.id === "whatsapp" ? (
                <WhatsAppBrandSvg className="size-4 shrink-0" />
              ) : (
                <GmailBrandSvg className="size-4 shrink-0" />
              )}
              <span className="whitespace-nowrap">{tb.label}</span>
              <span className="rounded-[6px] bg-[#F1F2F2] px-1.5 py-0.5 text-[12px] font-medium text-[#525252] tabular-nums">
                {tb.count}
              </span>
              {selected && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#171717]" />
              )}
            </button>
          );
        })}
      </div>

      <div hidden={channelTab !== "phone"}><PhoneTools /></div>
      {isEmail && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Canal de messagerie">
          {(["gmail", "outlook"] as const).map((provider) => (
            <button type="button" key={provider} aria-pressed={emailProvider === provider} onClick={() => {
              setEmailProvider(provider);
              setMobilePanel("inbox");
            }} className="inline-flex items-center gap-2 rounded-xl border border-[#DDE4EF] bg-white px-4 py-2 text-sm aria-pressed:border-[#A8B9D9] aria-pressed:bg-[#E8EDF9] aria-pressed:font-semibold">
              {provider === "gmail" ? <><GmailBrandSvg /> Gmail</> : <><OutlookBrandSvg /> Outlook</>}
            </button>
          ))}
        </div>
      )}
      <div hidden={!isEmail || isOutlook}><EmailTools provider="Gmail" /></div>
      <div hidden={!isEmail || !isOutlook}><EmailTools provider="Outlook" /></div>
      <div hidden={channelTab !== "whatsapp"}><WhatsAppTools /></div>
      {isPhone && (
        <div className="flex flex-wrap items-center gap-2 text-sm" role="group" aria-label="Direction des appels">
          {([{ value: "all", label: "Récents" }, { value: "Entrant", label: "Entrants" }, { value: "Sortant", label: "Sortants" }] as const).map((direction) => (
            <button key={direction.value} type="button" aria-pressed={callDirectionFilter === direction.value} onClick={() => { setCallDirectionFilter(direction.value); setMobilePanel("inbox"); setIsPlaying(false); }} className="rounded-full border border-[#DDE4EA] bg-white px-4 py-2 text-[#28475D] aria-pressed:border-[#AFC4D1] aria-pressed:bg-[#E6EFF5] aria-pressed:font-semibold">{direction.label}</button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={unreadOnly} onChange={(event) => { setUnreadOnly(event.target.checked); setSelectedId(""); setMobilePanel("inbox"); }} /> Non lues ({conversations.filter((conversation) => conversation.unreadCount).length})</label>
        <label className="flex items-center gap-2">Agent <select className="rounded-lg border border-[var(--border)] px-2 py-1" value={agentFilter} onChange={(event) => { setAgentFilter(event.target.value); setMobilePanel("inbox"); }}><option value="all">Tous</option>{[...new Set(conversations.map((conversation) => conversation.agentName))].map((agent) => <option key={agent}>{agent}</option>)}</select></label>
      </div>
      {filteredConversations.length > 0 && (
        <div className="flex flex-wrap gap-2 @min-[65rem]:hidden" role="group" aria-label="Panneaux de la conversation">
          {([{ id: "inbox", label: "Boîte de réception" }, { id: "thread", label: "Conversation" }] as const).map((panel) => (
            <button key={panel.id} type="button" aria-pressed={mobilePanel === panel.id} onClick={() => setMobilePanel(panel.id)} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm aria-pressed:font-semibold">{panel.label}</button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 items-start gap-4 @min-[65rem]:grid-cols-[minmax(260px,28%)_minmax(0,1fr)]">
        {/* COLONNE 1 : File de réception */}
        <aside className={`${mobilePanel === "inbox" || !filteredConversations.length ? "flex" : "hidden"} min-w-0 flex-col overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FCFCFC] @min-[65rem]:flex`}>
          {(isEmail || isPhone) && (
            <h3 className={`flex items-center gap-2.5 px-4 py-3.5 text-sm font-semibold ${isEmail ? "bg-[#F0F2FA] text-[#35436D]" : "bg-[#EAF2F6] text-[#28475D]"}`}>
              {isEmail ? isOutlook ? <OutlookBrandSvg className="size-4" /> : <GmailBrandSvg className="size-4" /> : <SolarIcon name="phone" className="size-4" />}
              {isEmail ? isOutlook ? "Réception Outlook" : "Réception Gmail" : "Journal des appels"}
            </h3>
          )}
          {/* Recherche sobre */}
          <div className="border-b border-[#EFEFEF] p-3">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#737373]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un contact, une société..."
                aria-label="Rechercher un contact ou une société"
                className="h-[38px] w-full rounded-[8px] border border-[#E5E5E5] bg-white pr-3 pl-9 text-[14px] text-[#171717] placeholder:text-[#737373] transition-colors focus:border-[#A3A3A3] focus:outline-none"
              />
            </div>
          </div>

          {/* Liste des fils */}
          <div className="divide-y divide-[#F0F0F0] overflow-y-auto lg:max-h-[680px]">
            {filteredConversations.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-[14px] font-medium text-[#171717]">
                  Aucune conversation
                </p>
                <p className="mt-1 text-[13px] text-[#737373]">
                  Modifiez votre filtre ou votre recherche.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const selected = conv.id === activeConversation.id;
                if (isEmail || isPhone) {
                  return (
                    <button key={conv.id} type="button" aria-pressed={selected} onClick={() => handleSelectConversation(conv)}
                      className={`flex w-full min-w-0 items-center gap-3 px-4 py-4 text-left hover:bg-[#F3F5FA] ${selected ? "bg-[#E9EDF8]" : conv.unreadCount ? "bg-white" : "bg-[#F8FAFC]"}`}>
                      <span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${isEmail ? "bg-[#E4E8F5] text-[#364575]" : "bg-[#E1EFF5] text-[#24536A]"}`} aria-hidden="true">
                        {isEmail ? conv.initials : conv.callDirection === "Sortant" ? "↗" : "↙"}
                      </span>
                      <span className="min-w-0 flex-1 space-y-0.5">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className={`truncate text-sm ${conv.unreadCount || selected ? "font-semibold" : "font-medium"}`}>{conv.contactName}</span>
                          <span className="shrink-0 text-xs text-[var(--text-muted)]">{conv.timestamp}</span>
                        </span>
                        <span className="block truncate text-[13px] font-medium text-[#35435A]">{isEmail ? conv.subject || "Sans objet" : [conv.callDirection, conv.recordingDurationSec ? formatSeconds(conv.recordingDurationSec) : null].filter(Boolean).join(" · ")}</span>
                        <span className="block truncate text-xs text-[var(--text-muted)]">{conv.preview}</span>
                      </span>
                      {conv.unreadCount ? <span className="size-2 shrink-0 rounded-full bg-[#4D63A9]" aria-label="Non lu" /> : null}
                    </button>
                  );
                }
                return (
                  <button
                    key={conv.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleSelectConversation(conv)}
                    className={`group relative flex w-full items-start gap-3.5 px-4 py-4.5 text-left transition-colors cursor-pointer ${
                      selected
                        ? isWhatsApp ? "bg-[#E9F5F1]" : "bg-white"
                        : "hover:bg-white/70"
                    }`}
                  >
                    {/* Indicateur de sélection latéral fin */}
                    {selected && (
                      <span className="absolute inset-y-2.5 left-0 w-0.5 rounded-r bg-[#008F6D]" />
                    )}

                    {/* Avatar + pastille canal */}
                    <div className="relative mt-0.5 shrink-0">
                      <span
                        className={`inline-flex size-10 items-center justify-center rounded-full border text-[13px] font-semibold transition-colors ${
                          selected
                            ? "border-[#171717] bg-[#171717] text-white"
                            : "border-[#E5E5E5] bg-white text-[#171717]"
                        }`}
                      >
                        {conv.initials}
                      </span>
                      <span className="absolute -right-0.5 -bottom-0.5 inline-flex size-4.5 items-center justify-center rounded-full border border-[#E5E5E5] bg-white">
                        {conv.channel === "whatsapp" ? (
                          <WhatsAppBrandSvg className="size-3" />
                        ) : conv.channel === "email" ? (
                          <GmailBrandSvg className="size-3" />
                        ) : (
                          <SolarIcon name="phone" className="size-2.5 text-[#171717]" />
                        )}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[14px] font-semibold text-[#171717]">
                          {conv.contactName}
                        </span>
                        <span className="shrink-0 text-[12.5px] text-[#737373] tabular-nums">
                          {conv.timestamp}
                        </span>
                      </div>

                      <p className="truncate text-[13px] font-medium text-[#525252]">
                        {conv.company}
                      </p>

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="flex min-w-0 items-center gap-1.5 truncate text-[13px] text-[#737373]">
                          {conv.status === "done" && (
                            <DoubleCheckSvg className="size-3.5 shrink-0 text-[#737373]" />
                          )}
                          <span className="truncate">{conv.preview}</span>
                        </p>
                        {conv.unreadCount ? (
                          <span className="inline-flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-[#008F6D] px-1.5 text-[11.5px] font-semibold text-white tabular-nums">
                            {conv.unreadCount}
                          </span>
                        ) : null}
                      </div>

                      {/* Métadonnées discrètes : agent en charge + premier tag */}
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[12.5px] text-[#525252]">
                          <Image
                            src={conv.agentAvatar}
                            alt={conv.agentName}
                            width={18}
                            height={18}
                            className="size-4.5 rounded-full border border-[#E5E5E5] object-cover object-top"
                          />
                          <span>Agent {conv.agentName}</span>
                        </span>
                        {conv.qualificationTags[0] && (
                          <span className="truncate rounded-[6px] border border-[#E5E5E5] bg-[#FAFAFA] px-2 py-0.5 text-[12px] font-medium text-[#525252]">
                            {conv.qualificationTags[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* COLONNE 2 : Fil de conversation / Transcription */}
        {filteredConversations.length > 0 && <section className={`${mobilePanel === "thread" ? "flex" : "hidden"} min-w-0 flex-col overflow-hidden rounded-xl border border-[#E5E5E5] bg-white @min-[65rem]:flex`}>
          {/* En-tête contextuel de la conversation */}
          <div className={`border-b border-[#EFEFEF] px-4 py-3.5 ${isWhatsApp ? "bg-[#F1F8F5]" : isEmail ? "bg-[#F8F9FD]" : isPhone ? "bg-[#F2F7FA]" : "bg-white"}`}>
            <button type="button" aria-haspopup="dialog" onClick={() => crmDialogRef.current?.showModal()} className="mb-3 inline-flex items-center gap-2 rounded-lg border border-[#CBDDD5] bg-white px-3 py-2 text-sm font-medium text-[#075D4C] hover:bg-[#F1F8F5]">
              <SolarIcon name="crm" className="size-4" />
              Contexte CRM
            </button>
            <label className="mb-3 flex flex-wrap items-center gap-2 text-sm">
              Prise en charge
              <select className="rounded-lg border border-[var(--border)] px-2 py-1" value={activeConversation.handlingMode ?? "assisted"} onChange={(event) => {
                const handlingMode = event.target.value as HandlingMode;
                setConversations((previous) => previous.map((conversation) => conversation.id === activeConversation.id ? { ...conversation, handlingMode } : conversation));
                notify(handlingMode === "manual" ? "Relais humain actif dans la simulation" : "Mode " + handlingLabels[handlingMode].toLowerCase() + " sélectionné dans la simulation");
              }}>
                {Object.entries(handlingLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-[16px] font-semibold text-[#171717]">
                    {activeConversation.contactName}
                  </h3>
                  <ChannelBadge
                    channel={activeConversation.channel}
                    callDirection={activeConversation.callDirection}
                  />
                </div>
                <p className="mt-0.5 truncate text-[13px] text-[#525252]">
                  {activeConversation.role} · {activeConversation.company} ({activeConversation.city})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <PremiumSelect
                  value={assignedTeam}
                  onChange={(v) => {
                    setAssignedTeam(v);
                    notify("Équipe assignée mise à jour");
                  }}
                  ariaLabel="Équipe assignée"
                  className="min-w-[116px]"
                  options={[
                    { value: "commercial", label: "Commercial" },
                    { value: "accueil", label: "Accueil" },
                    { value: "support", label: "Exploitation" },
                  ]}
                />
                <PremiumSelect
                  value={assignedAgent}
                  onChange={(v) => {
                    setAssignedAgent(v);
                    notify(`Conversation assignée à ${v}`);
                  }}
                  ariaLabel="Agent assigné"
                  className="min-w-[102px]"
                  options={[
                    { value: "Thomas", label: "Thomas" },
                    { value: "Sophie", label: "Sophie" },
                    { value: "Emma", label: "Emma" },
                  ]}
                />

                <button
                  type="button"
                  onClick={() => handleToggleResolve(activeConversation.id)}
                  className={`inline-flex h-[38px] items-center gap-1.5 rounded-[8px] px-3.5 text-[13.5px] font-medium transition cursor-pointer ${
                    activeConversation.status === "done"
                      ? "border border-[#E5E5E5] bg-[#F8F8F8] text-[#525252] hover:bg-[#F0F0F0]"
                      : "bg-[#171717] text-white hover:bg-[#262626]"
                  }`}
                >
                  <DoubleCheckSvg
                    className={`size-4 ${
                      activeConversation.status === "done" ? "text-[#008F6D]" : "text-white"
                    }`}
                  />
                  <span>
                    {activeConversation.status === "done" ? "Résolue" : "Marquer résolue"}
                  </span>
                </button>
              </div>
            </div>

            {/* Objet d'e-mail si canal email */}
            {activeConversation.channel === "email" && activeConversation.subject && (
              <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-[#EFEFEF] bg-[#FAFAFA] px-3 py-2 text-[13.5px]">
                <span className="font-medium text-[#737373]">Objet :</span>
                <span className="truncate font-medium text-[#171717]">
                  {activeConversation.subject}
                </span>
              </div>
            )}
          </div>

          {/* Lecteur audio vectoriel haute précision si appel enregistré */}
          {activeConversation.channel === "phone" && activeConversation.hasRecording && (
            <div className="border-b border-[#EFEFEF] bg-[#FAFAFA] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? "Mettre en pause" : "Écouter l’enregistrement"}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white shadow-2xs transition hover:bg-[#2E2E2E] cursor-pointer"
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="size-3.5 translate-x-0.5" fill="currentColor" aria-hidden="true">
                      <path d="M6 4.5v15l13-7.5-13-7.5Z" />
                    </svg>
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-[#171717]">
                      Enregistrement d’appel · Agent {activeConversation.agentName}
                    </span>
                    <span className="font-medium text-[#525252] tabular-nums">
                      {formatSeconds(playProgressSec)} / {formatSeconds(totalSec)}
                    </span>
                  </div>

                  {/* Onde vocale vectorielle interactive */}
                  <div
                    role="slider"
                    tabIndex={0}
                    aria-label="Progression de l’enregistrement"
                    aria-valuemin={0}
                    aria-valuemax={totalSec}
                    aria-valuenow={playProgressSec}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      setPlayProgressSec(Math.round(ratio * totalSec));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight") {
                        setPlayProgressSec((p) => Math.min(totalSec, p + 5));
                      } else if (e.key === "ArrowLeft") {
                        setPlayProgressSec((p) => Math.max(0, p - 5));
                      }
                    }}
                    className="mt-1.5 flex h-6 items-center gap-[2px] cursor-pointer"
                  >
                    {WAVEFORM_BARS.map((heightPct, idx) => {
                      const barPct = (idx / WAVEFORM_BARS.length) * 100;
                      const played = barPct <= progressPct;
                      return (
                        <span
                          key={idx}
                          className={`flex-1 rounded-full transition-colors ${
                            played ? "bg-[#171717]" : "bg-[#DCDCDC] hover:bg-[#BDBDBD]"
                          }`}
                          style={{ height: `${Math.max(22, Math.round(heightPct * 0.22))}px` }}
                        />
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPlaySpeed((prev) =>
                      prev === "1x" ? "1.25x" : prev === "1.25x" ? "1.5x" : "1x",
                    )
                  }
                  className="inline-flex h-7.5 shrink-0 items-center rounded-md border border-[#E5E5E5] bg-white px-2.5 text-[13px] font-medium text-[#525252] shadow-2xs transition hover:border-[#D4D4D4] hover:text-[#171717] tabular-nums cursor-pointer"
                >
                  {playSpeed}
                </button>
              </div>
            </div>
          )}

          {/* Fil des échanges (Cartes éditoriales épurées sans bulles vertes criardes) */}
          <div className={`min-h-64 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 @min-[65rem]:max-h-[min(60vh,42rem)] ${isWhatsApp ? "space-y-3 bg-[#F0F6F3] [background-image:radial-gradient(#D4E5DD_1px,transparent_1px)] [background-size:18px_18px]" : isEmail ? "space-y-5 bg-[#F6F7FB]" : isPhone ? "space-y-5 bg-[#F3F7FA]" : "space-y-5 bg-[#FAFAFA]"}`}>
            {activeConversation.exchanges.map((line) => (
              <div key={line.id} className="space-y-3.5">
                {line.dateGroup && (
                  <div className="flex items-center gap-3 py-1">
                    <div className="h-px flex-1 bg-[#EAEAEA]" />
                    <span className="rounded-full border border-[#E5E5E5] bg-white px-3 py-0.5 text-[12.5px] font-medium text-[#737373] shadow-2xs">
                      {line.dateGroup}
                    </span>
                    <div className="h-px flex-1 bg-[#EAEAEA]" />
                  </div>
                )}

                {line.isInternalNote ? (
                  /* Note interne d'équipe */
                  <div className="rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-3">
                    <div className="flex items-center justify-between gap-2 text-[13px]">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#171717]">
                        <svg
                          viewBox="0 0 24 24"
                          className="size-3.5 text-[#525252]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          aria-hidden="true"
                        >
                          <rect x="4" y="11" width="16" height="10" rx="2" />
                          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                        </svg>
                        {line.speaker}
                      </span>
                      <span className="text-[#8C8C8C] tabular-nums">{line.time}</span>
                    </div>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#404040]">
                      {line.text}
                    </p>
                  </div>
                ) : (
                  /* Message client ou agent IA */
                  <div
                    className={`flex ${!isEmail && (line.isAgent || line.isHumanReply) ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`min-w-0 rounded-xl px-4 py-3.5 text-[14.5px] leading-relaxed transition-colors ${isEmail ? "w-full" : "w-fit max-w-[92%]"} ${
                        isEmail
                          ? "border border-[#E1E6F1] bg-white shadow-2xs"
                          : isWhatsApp && (line.isAgent || line.isHumanReply)
                          ? "rounded-br-sm border border-[#BDE3D4] bg-[#DCF3E9] text-[#183B31] shadow-2xs"
                          : isWhatsApp
                            ? "rounded-bl-sm border border-[#DFE9E4] bg-white text-[#171717] shadow-2xs"
                            : line.isAgent
                          ? "border border-[#E5E5E5] bg-[#F4F4F5] text-[#171717]"
                          : "border border-[#E5E5E5] bg-white text-[#171717] shadow-2xs"
                      }`}
                    >
                      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[13px]">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#171717]">
                            {line.speaker}
                          </span>
                          {line.isAgent ? (
                            <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[12px] font-medium text-[#525252] ring-1 ring-[#E5E5E5]">
                              Agent IA
                            </span>
                          ) : line.isHumanReply ? (
                            <span className="text-[#527165]">· Équipe</span>
                          ) : line.speakerRole ? (
                            <span className="text-[#8C8C8C]">· {line.speakerRole}</span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-1 text-[#8C8C8C] tabular-nums">
                          <span>{line.time}</span>
                          {line.isAgent && !isWhatsApp && (
                            <DoubleCheckSvg className="size-3.5 text-[#008F6D]" />
                          )}
                        </div>
                      </div>

                      <p className="whitespace-pre-line break-words leading-relaxed text-[#262626]">
                        {line.text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Zone de saisie + Sélecteur Réponse / Note interne + Modèles rapides */}
          <div className="relative border-t border-[#EFEFEF] bg-white">
            {showSlashMenu && (
              <div className="divide-y divide-[#F0F0F0] border-b border-[#E5E5E5] bg-[#FAFAFA]">
                <div className="flex items-center justify-between px-4 py-2 text-[12.5px] font-medium text-[#737373]">
                  <span>Modèles de réponse rapide</span>
                  <span>Cliquez pour insérer</span>
                </div>
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr.cmd}
                    type="button"
                    onClick={() => setReplyDraft(qr.label)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[14px] transition hover:bg-white cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded border border-[#E5E5E5] bg-white px-1.5 py-0.5 font-mono text-[12.5px] font-medium text-[#171717]">
                          {qr.cmd}
                        </span>
                        <span className="font-medium text-[#171717]">{qr.title}</span>
                      </div>
                      <p className="mt-0.5 truncate text-[13.5px] text-[#737373]">
                        {qr.label}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Barre de mode (Répondre au client vs Note interne) */}
            <div className="flex items-center justify-between border-b border-[#F5F5F5] px-3.5 py-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setComposerMode("reply")}
                  className={`rounded-md px-3 py-1 text-[13.5px] font-medium transition cursor-pointer ${
                    composerMode === "reply"
                      ? "bg-[#F4F4F5] text-[#171717]"
                      : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  {activeConversation.channel === "whatsapp"
                    ? "Répondre sur WhatsApp"
                    : activeConversation.channel === "email"
                      ? "Répondre par e-mail"
                      : "Envoyer un SMS de suivi"}
                </button>
                <button
                  type="button"
                  onClick={() => setComposerMode("note")}
                  className={`rounded-md px-3 py-1 text-[13.5px] font-medium transition cursor-pointer ${
                    composerMode === "note"
                      ? "bg-[#F4F4F5] text-[#171717]"
                      : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  Note interne
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  setReplyDraft(replyDraft.startsWith("/") ? "" : "/")
                }
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium text-[#737373] transition hover:bg-[#F5F5F5] hover:text-[#171717] cursor-pointer"
              >
                <span className="font-mono text-[12.5px] text-[#171717]">/</span>
                <span>Modèles</span>
              </button>
            </div>

            <div className={`flex items-center gap-2.5 p-3 ${isWhatsApp ? "bg-[#F1F8F5]" : ""}`}>
              <input
                type="text"
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendReply();
                }}
                placeholder={
                  composerMode === "note"
                    ? "Ajouter une consigne interne pour l’équipe..."
                    : isWhatsApp ? "Écrire un message…" : "Écrire un message ou taper / pour insérer un modèle..."
                }
                className={`h-10 min-w-0 flex-1 border border-[#E5E5E5] px-3.5 text-sm text-[#171717] placeholder:text-[#737373] focus:border-[#008F6D] focus:bg-white focus:outline-none ${isWhatsApp ? "rounded-full bg-white" : "rounded-lg bg-[#FAFAFA]"}`}
              />

              <button
                type="button"
                onClick={() => handleSendReply()}
                aria-label={composerMode === "note" ? "Enregistrer la note" : "Simuler l’envoi"}
                title={composerMode === "note" ? "Enregistrer la note" : "Simuler l’envoi"}
                className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 text-[13.5px] font-medium text-white transition cursor-pointer ${isWhatsApp ? "size-10 rounded-full bg-[#007C60] hover:bg-[#00654D]" : "rounded-lg bg-[#171717] px-3.5 hover:bg-[#262626]"}`}
              >
                {!isWhatsApp && <span>{composerMode === "note" ? "Enregistrer" : "Simuler l’envoi"}</span>}
                <svg
                  viewBox="0 0 24 24"
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </section>}

        {filteredConversations.length > 0 && (
          <dialog
            ref={crmDialogRef}
            aria-labelledby="crm-context-title"
            onClose={() => setCrmExpanded(false)}
            className={`fixed inset-0 m-auto max-h-[90dvh] max-w-[calc(100%_-_1.5rem)] overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-0 text-[var(--foreground)] shadow-2xl backdrop:bg-black/40 ${crmExpanded ? "w-[72rem]" : "w-[43rem]"}`}
          >
            <div className="flex max-h-[89dvh] flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <h2 id="crm-context-title" className="font-semibold">Contexte CRM</h2>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setCrmExpanded(!crmExpanded)} aria-pressed={crmExpanded} className="hidden rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:bg-[#F5F7F6] sm:inline-flex">{crmExpanded ? "Réduire" : "Agrandir"}</button>
                  <button type="button" onClick={() => crmDialogRef.current?.close()} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[#F5F7F6]">Fermer</button>
                </div>
              </div>
              <div className="min-h-0 overflow-y-auto overscroll-contain">
                <div className="mx-auto max-w-5xl divide-y divide-[#EFEFEF] p-1 sm:p-3">
          {/* En-tête fiche contact + Score */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FAFAFA] text-[14px] font-semibold text-[#171717]">
                  {activeConversation.initials}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-words text-[16px] font-semibold text-[#171717]">
                      {activeConversation.contactName}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#B8E6D6] bg-[#E6F5F0] px-2 py-0.5 text-[12px] font-medium text-[#00775B] tabular-nums">
                      {activeConversation.score}/100 · {activeConversation.tempLabel}
                    </span>
                  </div>
                  <p className="mt-0.5 break-words text-[13px] text-[#525252]">
                    {activeConversation.role} · {activeConversation.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Coordonnées interactives avec bouton Copier au survol */}
            <div className="mt-4 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => handleCopy(activeConversation.phone, "Numéro")}
                className="group flex items-center justify-between gap-2 rounded-lg border border-[#EFEFEF] bg-[#FAFAFA] px-3 py-2.5 text-left transition hover:border-[#DCDCDC] hover:bg-white cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-[12px] text-[#8C8C8C]">Téléphone</p>
                  <p className="break-words text-[13.5px] font-medium text-[#171717] tabular-nums">
                    {activeConversation.phone}
                  </p>
                </div>
                <span className="text-[12px] font-medium text-[#737373] opacity-0 transition group-hover:opacity-100">
                  Copier
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(activeConversation.email, "Adresse e-mail")}
                className="group flex items-center justify-between gap-2 rounded-lg border border-[#EFEFEF] bg-[#FAFAFA] px-3 py-2.5 text-left transition hover:border-[#DCDCDC] hover:bg-white cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-[12px] text-[#8C8C8C]">E-mail</p>
                  <p className="[overflow-wrap:anywhere] text-[13.5px] font-medium text-[#171717]">
                    {activeConversation.email}
                  </p>
                </div>
                <span className="text-[12px] font-medium text-[#737373] opacity-0 transition group-hover:opacity-100">
                  Copier
                </span>
              </button>
            </div>
          </div>

          {/* Synthèse & qualification structurée (Double-surface card) */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[16px] font-semibold text-[#171717]">
                Synthèse &amp; qualification
              </h4>
              <span className="text-[12.5px] text-[#737373]">
                Agent {activeConversation.agentName}
              </span>
            </div>

            <div className="mt-2.5 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] p-3.5">
              <p className="text-[14px] leading-[21px] text-[#262626]">
                {activeConversation.aiSummary}
              </p>

              {/* Grille 2x2 des données extraites */}
              <dl className="mt-3.5 grid grid-cols-1 gap-3 border-t border-[#EAEAEA] pt-3.5 sm:grid-cols-2">
                <div className="rounded-[8px] border border-[#EFEFEF] bg-white px-3 py-2">
                  <dt className="text-[12px] text-[#737373]">Périmètre / Surface</dt>
                  <dd className="mt-0.5 break-words text-[13.5px] font-semibold text-[#171717]">
                    {activeConversation.criteria.surface}
                  </dd>
                </div>
                <div className="rounded-[8px] border border-[#EFEFEF] bg-white px-3 py-2">
                  <dt className="text-[12px] text-[#737373]">Fréquence</dt>
                  <dd className="mt-0.5 break-words text-[13.5px] font-semibold text-[#171717]">
                    {activeConversation.criteria.frequency}
                  </dd>
                </div>
                <div className="rounded-[8px] border border-[#EFEFEF] bg-white px-3 py-2">
                  <dt className="text-[12px] text-[#737373]">Estimation HT</dt>
                  <dd className="mt-0.5 break-words text-[13.5px] font-semibold text-[#008F6D] tabular-nums">
                    {activeConversation.criteria.budgetEst}
                  </dd>
                </div>
                <div className="rounded-[8px] border border-[#EFEFEF] bg-white px-3 py-2">
                  <dt className="text-[12px] text-[#737373]">Échéance</dt>
                  <dd className="mt-0.5 break-words text-[13.5px] font-semibold text-[#171717]">
                    {activeConversation.criteria.urgency}
                  </dd>
                </div>
              </dl>

              {/* Prochaine étape recommandée */}
              <div className="mt-3 flex items-start gap-2 rounded-[8px] border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13.5px]">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#008F6D]" />
                <div>
                  <span className="font-semibold text-[#171717]">Action suggérée : </span>
                  <span className="text-[#525252]">{activeConversation.nextAction}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeConversation.qualificationTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[6px] border border-[#E5E5E5] bg-white px-2.5 py-0.5 text-[12.5px] font-medium text-[#525252]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Journal d'activité avec fil vertical continu */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[16px] font-semibold text-[#171717]">
                Historique de traitement
              </h4>
              <span className="text-[12.5px] text-[#737373]">
                {activeConversation.timeline.length} étape
                {activeConversation.timeline.length > 1 ? "s" : ""}
              </span>
            </div>

            <ol className="relative mt-3.5 ml-2.5 space-y-3 border-l border-[#E5E5E5] pl-4">
              {activeConversation.timeline.map((ev) => (
                <li key={ev.id} className="relative text-[13.5px]">
                  <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border-2 border-white bg-[#171717]" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-[#171717]">{ev.label}</span>
                    <span className="shrink-0 text-[12px] text-[#737373] tabular-nums">
                      {ev.dateGroup} · {ev.time}
                    </span>
                  </div>
                  {ev.detail && (
                    <p className="mt-0.5 text-[12.5px] text-[#737373]">{ev.detail}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Actions rapides & Micro-réassurance RGPD */}
          <div className="mt-auto space-y-3 p-4">
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenCrm) {
                    onOpenCrm();
                  } else {
                    notify(`Fiche CRM de ${activeConversation.contactName} ouverte`);
                  }
                }}
                className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white px-3.5 text-[13.5px] font-medium text-[#171717] transition hover:bg-[#FAFAFA] cursor-pointer"
              >
                <SolarIcon name="crm" className="size-4 text-[#525252]" />
                <span>Ouvrir dans le CRM</span>
              </button>

              <button
                type="button"
                onClick={() => setRdvOpen((v) => !v)}
                className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[8px] bg-[#008F6D] px-3.5 text-[13.5px] font-medium text-white transition hover:bg-[#00775B] cursor-pointer"
              >
                <SolarIcon name="phone" className="size-4" />
                <span>Planifier un RDV</span>
              </button>
            </div>

            {rdvOpen && (
              <div className="space-y-2.5 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3.5">
                <label className="block text-[13.5px] font-medium text-[#171717]">
                  Créneau de visite ou rappel
                </label>
                <input
                  type="text"
                  value={rdvDate}
                  onChange={(e) => setRdvDate(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-[14px] text-[#171717] focus:border-[#A3A3A3] focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRdvOpen(false)}
                    className="h-8.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[13.5px] font-medium text-[#525252] hover:bg-[#F5F5F5] cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRdv}
                    className="h-8.5 rounded-lg bg-[#171717] px-3 text-[13.5px] font-medium text-white hover:bg-[#2E2E2E] cursor-pointer"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            )}

            <p className="flex items-center gap-1.5 text-[12.5px] text-[#8C8C8C]">
              <svg
                viewBox="0 0 24 24"
                className="size-3.5 shrink-0 text-[#8C8C8C]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  d="M12 3 5 6v6c0 4.5 3 8.2 7 9 4-.8 7-4.5 7-9V6l-7-3Z"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Transcriptions et enregistrements de démonstration</span>
            </p>
          </div>
                </div>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}
