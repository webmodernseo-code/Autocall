"use client";

import { useMemo, useState } from "react";
import { StripeBrandSvg } from "../brand-icons";
import { downloadCsv } from "../download-csv";
import { PremiumSelect } from "../premium-select";
import { type Locale, SolarIcon } from "../workspace-navigation";
import { type SuperAdminSectionNavTarget } from "./super-admin-overview";

type SubscriptionStatus = "active" | "trial" | "past_due" | "cancelled";
type PlanTier = "Starter" | "Pro" | "Business";
type MarketCode = "FR" | "CI";
type OfferInspectorTab =
  | "pricing"
  | "quotas"
  | "features"
  | "markets"
  | "versions";

interface SubscriptionRecord {
  id: string;
  companyName: string;
  initials: string;
  market: MarketCode;
  currency: "EUR" | "XOF";
  plan: PlanTier;
  planVersion: string;
  cycle: "Mensuel" | "Annuel (-5 %)";
  amountDisplay: string;
  status: SubscriptionStatus;
  dueDate: string;
  gateway: "Stripe" | "GeniusPay";
  autoRenew: boolean;
}

interface OfferVersionRecord {
  version: string;
  publishedAt: string;
  status: "Active (Nouveaux clients)" | "Héritée (Contrats existants)" | "Brouillon";
  activeContractsCount: number;
  priceFrEur: number;
  annualDiscountFrPct: number;
  priceCiXof: number;
  note: string;
}

interface OfferDefinition {
  id: PlanTier;
  name: PlanTier;
  tagline: string;
  currentVersion: string;
  priceFrMonthlyEur: number;
  priceFrAnnualMonthlyEqEur: number;
  priceCiMonthlyXof: number;
  trialDays: number;
  quotas: {
    voiceMinutes: string;
    aiAgents: string;
    acquisitionCredits: string;
    aiUnits: string;
    emailsPerMonth: string;
  };
  features: string[];
  markets: {
    code: MarketCode;
    label: string;
    currency: "EUR" | "XOF";
    annualAvailable: boolean;
    gateway: string;
    status: "Actif" | "Conditionnel";
  }[];
  versions: OfferVersionRecord[];
}

interface TransactionRecord {
  id: string;
  date: string;
  companyName: string;
  type: "Abonnement" | "Pack +1 000 min" | "Remboursement";
  gateway: "Stripe" | "GeniusPay";
  currency: "EUR" | "XOF";
  amountDisplay: string;
  status: "Réussi" | "Échoué" | "En attente" | "Remboursé";
  invoiceId: string;
}

interface InvoiceRecord {
  id: string;
  number: string;
  companyName: string;
  issuedAt: string;
  dueAt: string;
  currency: "EUR" | "XOF";
  amountHtDisplay: string;
  amountTtcDisplay: string;
  status: "Payée" | "En attente" | "Impayée" | "Avoir émis";
}

interface PromotionRecord {
  id: string;
  code: string;
  discountLabel: string;
  durationLabel: string;
  eligiblePlan: "Starter" | "Pro" | "Business" | "Toutes les offres";
  market: "France" | "Côte d’Ivoire" | "Tous";
  usedCount: number;
  maxUses: number;
  eligibility: "Nouveaux clients" | "Migration annuelle" | "Tous clients";
  status: "Brouillon" | "Active" | "Expirée";
}

interface RefundRecord {
  id: string;
  transactionId: string;
  invoiceNumber: string;
  companyName: string;
  requestedAt: string;
  currency: "EUR" | "XOF";
  originalAmountDisplay: string;
  refundAmountDisplay: string;
  reason: string;
  ticketRef: string;
  status: "À approuver (MFA)" | "Exécuté" | "Refusé";
}

const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: "sub-01",
    companyName: "Nova Services",
    initials: "N",
    market: "FR",
    currency: "EUR",
    plan: "Pro",
    planVersion: "v2026.2",
    cycle: "Mensuel",
    amountDisplay: "99\u00A0€ HT / mois",
    status: "active",
    dueDate: "12 déc. 2026",
    gateway: "Stripe",
    autoRenew: true,
  },
  {
    id: "sub-02",
    companyName: "Atlas Immobilier",
    initials: "A",
    market: "FR",
    currency: "EUR",
    plan: "Business",
    planVersion: "v2026.2",
    cycle: "Annuel (-5 %)",
    amountDisplay: "170\u00A0€ HT / mois",
    status: "active",
    dueDate: "8 déc. 2026",
    gateway: "Stripe",
    autoRenew: true,
  },
  {
    id: "sub-03",
    companyName: "Clean Studio",
    initials: "C",
    market: "FR",
    currency: "EUR",
    plan: "Starter",
    planVersion: "v2026.2",
    cycle: "Mensuel",
    amountDisplay: "49\u00A0€ HT / mois",
    status: "trial",
    dueDate: "28 nov. 2026",
    gateway: "Stripe",
    autoRenew: true,
  },
  {
    id: "sub-04",
    companyName: "Mondo Services",
    initials: "M",
    market: "FR",
    currency: "EUR",
    plan: "Pro",
    planVersion: "v2026.1 (Héritée)",
    cycle: "Mensuel",
    amountDisplay: "99\u00A0€ HT / mois",
    status: "past_due",
    dueDate: "22 nov. 2026",
    gateway: "Stripe",
    autoRenew: false,
  },
  {
    id: "sub-05",
    companyName: "Studio Horizon",
    initials: "S",
    market: "FR",
    currency: "EUR",
    plan: "Pro",
    planVersion: "v2026.2",
    cycle: "Mensuel",
    amountDisplay: "99\u00A0€ HT / mois",
    status: "cancelled",
    dueDate: "30 nov. 2026",
    gateway: "Stripe",
    autoRenew: false,
  },
  {
    id: "sub-06",
    companyName: "Ivoire Logistique B2B",
    initials: "I",
    market: "CI",
    currency: "XOF",
    plan: "Pro",
    planVersion: "v2026.2",
    cycle: "Mensuel",
    amountDisplay: "30\u00A0000\u00A0XOF HT / mois",
    status: "active",
    dueDate: "2 déc. 2026",
    gateway: "GeniusPay",
    autoRenew: true,
  },
  {
    id: "sub-07",
    companyName: "Lyon Propreté & Services",
    initials: "L",
    market: "FR",
    currency: "EUR",
    plan: "Business",
    planVersion: "v2026.2",
    cycle: "Mensuel",
    amountDisplay: "179\u00A0€ HT / mois",
    status: "active",
    dueDate: "9 déc. 2026",
    gateway: "Stripe",
    autoRenew: true,
  },
];

const INITIAL_OFFERS: OfferDefinition[] = [
  {
    id: "Starter",
    name: "Starter",
    tagline: "Pour les TPE qui automatisent leur accueil téléphonique et leur CRM.",
    currentVersion: "v2026.2",
    priceFrMonthlyEur: 49,
    priceFrAnnualMonthlyEqEur: 46.55,
    priceCiMonthlyXof: 15000,
    trialDays: 14,
    quotas: {
      voiceMinutes: "300 min vocales IA / mois",
      aiAgents: "1 agent vocal IA (avatar Soft 3D)",
      acquisitionCredits: "150 crédits d’acquisition / mois",
      aiUnits: "500 unités IA (résumés & scoring)",
      emailsPerMonth: "1 500 e-mails transactionnels & campagnes",
    },
    features: [
      "Accueil téléphonique IA 24/7 & transfert humain",
      "CRM natif Contacts, Entreprises & Pipeline",
      "Boîte de réception unifiée (Appels, E-mail, WhatsApp)",
      "Agenda & page publique de prise de rendez-vous",
      "Transcriptions, résumés IA et export CSV",
    ],
    markets: [
      {
        code: "FR",
        label: "France & Zone Euro",
        currency: "EUR",
        annualAvailable: true,
        gateway: "Stripe (CB / SEPA)",
        status: "Actif",
      },
      {
        code: "CI",
        label: "Côte d’Ivoire",
        currency: "XOF",
        annualAvailable: false,
        gateway: "GeniusPay",
        status: "Conditionnel",
      },
    ],
    versions: [
      {
        version: "v2026.2",
        publishedAt: "01 sept. 2026",
        status: "Active (Nouveaux clients)",
        activeContractsCount: 54,
        priceFrEur: 49,
        annualDiscountFrPct: 5,
        priceCiXof: 15000,
        note: "Barème D007 officiel avec 300 min vocales incluses.",
      },
      {
        version: "v2026.1",
        publishedAt: "10 janv. 2026",
        status: "Héritée (Contrats existants)",
        activeContractsCount: 12,
        priceFrEur: 45,
        annualDiscountFrPct: 5,
        priceCiXof: 15000,
        note: "Offre initiale immuable maintenue pour les premiers clients pilotes.",
      },
    ],
  },
  {
    id: "Pro",
    name: "Pro",
    tagline: "La formule recommandée pour prospecter, qualifier et relancer en multicanal.",
    currentVersion: "v2026.2",
    priceFrMonthlyEur: 99,
    priceFrAnnualMonthlyEqEur: 94.05,
    priceCiMonthlyXof: 30000,
    trialDays: 14,
    quotas: {
      voiceMinutes: "1 200 min vocales IA / mois",
      aiAgents: "3 agents vocaux IA (Emma, Alex, Lina)",
      acquisitionCredits: "600 crédits d’acquisition & signaux / mois",
      aiUnits: "2 000 unités IA",
      emailsPerMonth: "10 000 e-mails & séquences J0/J3/J7/J14",
    },
    features: [
      "Tout Starter + Campagnes sortantes Appels, E-mail & WhatsApp",
      "Module Acquisition B2B & alertes signaux de recrutement",
      "Social Studio (Facebook, Instagram, LinkedIn) & calendrier",
      "Automation Studio (React Flow) & 30 modèles prêts à l’emploi",
      "Synchronisation Google Calendar, Outlook & HubSpot CRM",
    ],
    markets: [
      {
        code: "FR",
        label: "France & Zone Euro",
        currency: "EUR",
        annualAvailable: true,
        gateway: "Stripe (CB / SEPA)",
        status: "Actif",
      },
      {
        code: "CI",
        label: "Côte d’Ivoire",
        currency: "XOF",
        annualAvailable: false,
        gateway: "GeniusPay",
        status: "Conditionnel",
      },
    ],
    versions: [
      {
        version: "v2026.2",
        publishedAt: "01 sept. 2026",
        status: "Active (Nouveaux clients)",
        activeContractsCount: 118,
        priceFrEur: 99,
        annualDiscountFrPct: 5,
        priceCiXof: 30000,
        note: "Barème D007 officiel avec remise annuelle 5 % en France uniquement.",
      },
      {
        version: "v2026.1",
        publishedAt: "10 janv. 2026",
        status: "Héritée (Contrats existants)",
        activeContractsCount: 19,
        priceFrEur: 89,
        annualDiscountFrPct: 5,
        priceCiXof: 30000,
        note: "Ancienne révision verrouillée — migration uniquement sur accord explicite.",
      },
    ],
  },
  {
    id: "Business",
    name: "Business",
    tagline: "Pour les équipes à fort volume d’appels, multi-agents et workflows avancés.",
    currentVersion: "v2026.2",
    priceFrMonthlyEur: 179,
    priceFrAnnualMonthlyEqEur: 170.05,
    priceCiMonthlyXof: 60000,
    trialDays: 14,
    quotas: {
      voiceMinutes: "3 500 min vocales IA / mois",
      aiAgents: "10 agents vocaux IA & règles de routage SVI",
      acquisitionCredits: "2 000 crédits d’acquisition / mois",
      aiUnits: "6 000 unités IA",
      emailsPerMonth: "35 000 e-mails & webhooks temps réel",
    },
    features: [
      "Tout Pro + Supervision avancée des agents & garde-fous qualité",
      "Trunks SIP dédiés, portabilité et pool multi-numéros DID",
      "Analytics de rentabilité, cohortes & rapports PDF/CSV planifiés",
      "Conservation RGPD configurable jusqu’à 365 jours",
      "Support prioritaire P1/P2 & accompagnement onboarding",
    ],
    markets: [
      {
        code: "FR",
        label: "France & Zone Euro",
        currency: "EUR",
        annualAvailable: true,
        gateway: "Stripe (CB / SEPA)",
        status: "Actif",
      },
      {
        code: "CI",
        label: "Côte d’Ivoire",
        currency: "XOF",
        annualAvailable: false,
        gateway: "GeniusPay",
        status: "Conditionnel",
      },
    ],
    versions: [
      {
        version: "v2026.2",
        publishedAt: "01 sept. 2026",
        status: "Active (Nouveaux clients)",
        activeContractsCount: 45,
        priceFrEur: 179,
        annualDiscountFrPct: 5,
        priceCiXof: 60000,
        note: "Barème D007 officiel Business.",
      },
    ],
  },
];

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "TRX-9084",
    date: "Aujourd’hui · 11:18",
    companyName: "Nova Services",
    type: "Abonnement",
    gateway: "Stripe",
    currency: "EUR",
    amountDisplay: "99,00\u00A0€ HT",
    status: "Réussi",
    invoiceId: "FAC-2026-1142",
  },
  {
    id: "TRX-9083",
    date: "Aujourd’hui · 09:40",
    companyName: "Lyon Propreté & Services",
    type: "Pack +1 000 min",
    gateway: "Stripe",
    currency: "EUR",
    amountDisplay: "29,00\u00A0€ HT",
    status: "Réussi",
    invoiceId: "FAC-2026-1141",
  },
  {
    id: "TRX-9082",
    date: "Hier · 16:05",
    companyName: "Mondo Services",
    type: "Abonnement",
    gateway: "Stripe",
    currency: "EUR",
    amountDisplay: "99,00\u00A0€ HT",
    status: "Échoué",
    invoiceId: "FAC-2026-1138",
  },
  {
    id: "TRX-9081",
    date: "23 nov. 2026",
    companyName: "Ivoire Logistique B2B",
    type: "Abonnement",
    gateway: "GeniusPay",
    currency: "XOF",
    amountDisplay: "30\u00A0000\u00A0XOF HT",
    status: "Réussi",
    invoiceId: "FAC-2026-1135",
  },
  {
    id: "TRX-9079",
    date: "21 nov. 2026",
    companyName: "Cabinet Nexa Conseil",
    type: "Pack +1 000 min",
    gateway: "Stripe",
    currency: "EUR",
    amountDisplay: "29,00\u00A0€ HT",
    status: "Remboursé",
    invoiceId: "FAC-2026-1129",
  },
];

const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: "inv-1",
    number: "FAC-2026-1142",
    companyName: "Nova Services",
    issuedAt: "25 nov. 2026",
    dueAt: "25 nov. 2026",
    currency: "EUR",
    amountHtDisplay: "99,00\u00A0€",
    amountTtcDisplay: "118,80\u00A0€",
    status: "Payée",
  },
  {
    id: "inv-2",
    number: "FAC-2026-1141",
    companyName: "Lyon Propreté & Services",
    issuedAt: "25 nov. 2026",
    dueAt: "25 nov. 2026",
    currency: "EUR",
    amountHtDisplay: "29,00\u00A0€",
    amountTtcDisplay: "34,80\u00A0€",
    status: "Payée",
  },
  {
    id: "inv-3",
    number: "FAC-2026-1138",
    companyName: "Mondo Services",
    issuedAt: "22 nov. 2026",
    dueAt: "22 nov. 2026",
    currency: "EUR",
    amountHtDisplay: "99,00\u00A0€",
    amountTtcDisplay: "118,80\u00A0€",
    status: "Impayée",
  },
  {
    id: "inv-4",
    number: "FAC-2026-1135",
    companyName: "Ivoire Logistique B2B",
    issuedAt: "23 nov. 2026",
    dueAt: "23 nov. 2026",
    currency: "XOF",
    amountHtDisplay: "30\u00A0000\u00A0XOF",
    amountTtcDisplay: "30\u00A0000\u00A0XOF",
    status: "Payée",
  },
  {
    id: "inv-5",
    number: "FAC-2026-1129",
    companyName: "Cabinet Nexa Conseil",
    issuedAt: "21 nov. 2026",
    dueAt: "21 nov. 2026",
    currency: "EUR",
    amountHtDisplay: "29,00\u00A0€",
    amountTtcDisplay: "34,80\u00A0€",
    status: "Avoir émis",
  },
];

const INITIAL_PROMOTIONS: PromotionRecord[] = [
  {
    id: "promo-1",
    code: "AUTOCALL20",
    discountLabel: "−20 %",
    durationLabel: "Sur les trois premiers mois",
    eligiblePlan: "Pro",
    market: "France",
    usedCount: 0,
    maxUses: 100,
    eligibility: "Nouveaux clients",
    status: "Brouillon",
  },
  {
    id: "promo-2",
    code: "BIENVENUE10",
    discountLabel: "−10 %",
    durationLabel: "Sur le premier mois",
    eligiblePlan: "Starter",
    market: "France",
    usedCount: 38,
    maxUses: 150,
    eligibility: "Nouveaux clients",
    status: "Active",
  },
  {
    id: "promo-3",
    code: "SCALEQ4",
    discountLabel: "−15 %",
    durationLabel: "Sur les 6 premiers mois",
    eligiblePlan: "Business",
    market: "France",
    usedCount: 25,
    maxUses: 25,
    eligibility: "Migration annuelle",
    status: "Expirée",
  },
];

const INITIAL_REFUNDS: RefundRecord[] = [
  {
    id: "REF-204",
    transactionId: "TRX-9076",
    invoiceNumber: "FAC-2026-1118",
    companyName: "Bâtiment & Maintenance Sud",
    requestedAt: "Aujourd’hui · 10:05",
    currency: "EUR",
    originalAmountDisplay: "29,00\u00A0€ HT",
    refundAmountDisplay: "29,00\u00A0€ HT",
    reason: "Double achat accidentel d’un pack +1 000 minutes (0 min consommée sur le 2e pack)",
    ticketRef: "SUP-415",
    status: "À approuver (MFA)",
  },
  {
    id: "REF-203",
    transactionId: "TRX-9079",
    invoiceNumber: "FAC-2026-1129",
    companyName: "Cabinet Nexa Conseil",
    requestedAt: "21 nov. 2026",
    currency: "EUR",
    originalAmountDisplay: "29,00\u00A0€ HT",
    refundAmountDisplay: "29,00\u00A0€ HT",
    reason: "Avoir commercial suite à test de portabilité SIP",
    ticketRef: "SUP-391",
    status: "Exécuté",
  },
];

export function SuperAdminBilling({
  activeTab,
  onNavigate,
}: {
  activeTab: string;
  locale: Locale;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(INITIAL_SUBSCRIPTIONS);
  const [offers, setOffers] = useState<OfferDefinition[]>(INITIAL_OFFERS);
  const [promotions, setPromotions] = useState<PromotionRecord[]>(INITIAL_PROMOTIONS);
  const [refunds, setRefunds] = useState<RefundRecord[]>(INITIAL_REFUNDS);

  // Filtres 01. Abonnements
  const [subSearch, setSubSearch] = useState("");
  const [subStatusFilter, setSubStatusFilter] = useState<"all" | SubscriptionStatus>("all");
  const [subPlanFilter, setSubPlanFilter] = useState<"all" | PlanTier>("all");

  // Modale Migration explicite d'abonnement (avec contrôle devise/montant et MFA)
  const [migrationTarget, setMigrationTarget] = useState<SubscriptionRecord | null>(null);
  const [migrationNewPlan, setMigrationNewPlan] = useState<PlanTier>("Business");
  const [migrationReason, setMigrationReason] = useState("");
  const [migrationTotp, setMigrationTotp] = useState("");
  const [migrationError, setMigrationError] = useState<string | null>(null);

  // Onglet d'inspection unifié pour la vue 02. Offres
  const [offerViewMode, setOfferViewMode] = useState<OfferInspectorTab>("pricing");
  const [offerMarketPreview, setOfferMarketPreview] = useState<MarketCode>("FR");

  // Modale création nouvelle révision versionnée d'une offre
  const [versionModalOffer, setVersionModalOffer] = useState<OfferDefinition | null>(null);
  const [newVersionPriceFr, setNewVersionPriceFr] = useState("");
  const [newVersionNote, setNewVersionNote] = useState("");

  // Filtres 03. Transactions
  const [txStatusFilter, setTxStatusFilter] = useState<
    "all" | "Réussi" | "Échoué" | "En attente" | "Remboursé"
  >("all");

  // Modale création 05. Promotion
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState("−20 %");
  const [newPromoDuration, setNewPromoDuration] = useState("Sur les trois premiers mois");
  const [newPromoPlan, setNewPromoPlan] = useState<PromotionRecord["eligiblePlan"]>("Pro");
  const [newPromoMaxUses, setNewPromoMaxUses] = useState("100");

  // Modale approbation 06. Remboursement (contrôle devise/montant + MFA)
  const [refundTarget, setRefundTarget] = useState<RefundRecord | null>(null);
  const [refundTotp, setRefundTotp] = useState("");
  const [refundError, setRefundError] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      if (subStatusFilter !== "all" && sub.status !== subStatusFilter) return false;
      if (subPlanFilter !== "all" && sub.plan !== subPlanFilter) return false;
      if (subSearch.trim()) {
        const q = subSearch.toLowerCase();
        return (
          sub.companyName.toLowerCase().includes(q) ||
          sub.plan.toLowerCase().includes(q) ||
          sub.planVersion.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [subscriptions, subStatusFilter, subPlanFilter, subSearch]);

  const filteredTransactions = useMemo(() => {
    return INITIAL_TRANSACTIONS.filter((tx) => {
      if (txStatusFilter !== "all" && tx.status !== txStatusFilter) return false;
      return true;
    });
  }, [txStatusFilter]);

  const renderSubscriptionStatus = (status: SubscriptionStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#DEF5EC] px-2.5 py-1 font-mono text-[12px] font-semibold text-[#008064] whitespace-nowrap">
            <span className="size-1.5 rounded-full bg-[#15803D]" />
            Actif
          </span>
        );
      case "trial":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E4EEFE] px-2.5 py-1 font-mono text-[12px] font-semibold text-[#1D4ED8] whitespace-nowrap">
            <span className="size-1.5 rounded-full bg-[#1D4ED8]" />
            En essai
          </span>
        );
      case "past_due":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FCE7EB] px-2.5 py-1 font-mono text-[12px] font-semibold text-[#B91C1C] whitespace-nowrap">
            <span className="size-1.5 rounded-full bg-[#B91C1C]" />
            Impayé
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EFEFEF] px-2.5 py-1 font-mono text-[12px] font-semibold text-[#525252] whitespace-nowrap">
            <span className="size-1.5 rounded-full bg-[#737373]" />
            Résilié
          </span>
        );
    }
  };

  const handleConfirmMigration = () => {
    if (!migrationTarget) return;
    if (!migrationReason.trim()) {
      setMigrationError("Le motif de migration est obligatoire pour le journal de facturation.");
      return;
    }
    if (migrationTotp.trim().length < 6) {
      setMigrationError("Code MFA Super Admin à 6 chiffres requis.");
      return;
    }

    const newPriceDisplay =
      migrationTarget.currency === "XOF"
        ? migrationNewPlan === "Starter"
          ? "15\u00A0000\u00A0XOF HT / mois"
          : migrationNewPlan === "Pro"
            ? "30\u00A0000\u00A0XOF HT / mois"
            : "60\u00A0000\u00A0XOF HT / mois"
        : migrationNewPlan === "Starter"
          ? "49\u00A0€ HT / mois"
          : migrationNewPlan === "Pro"
            ? "99\u00A0€ HT / mois"
            : "179\u00A0€ HT / mois";

    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === migrationTarget.id
          ? {
              ...s,
              plan: migrationNewPlan,
              planVersion: "v2026.2",
              amountDisplay: newPriceDisplay,
            }
          : s,
      ),
    );

    notify(
      `Migration explicite de ${migrationTarget.companyName} vers ${migrationNewPlan} (v2026.2) validée et auditée`,
    );
    setMigrationTarget(null);
    setMigrationReason("");
    setMigrationTotp("");
    setMigrationError(null);
  };

  const handleCreateOfferVersion = () => {
    if (!versionModalOffer) return;
    const parsedPrice = Number(newVersionPriceFr);
    if (!parsedPrice || parsedPrice <= 0) return;

    const nextVerName = "v2026.3 (Brouillon)";
    setOffers((prev) =>
      prev.map((off) =>
        off.id === versionModalOffer.id
          ? {
              ...off,
              versions: [
                {
                  version: nextVerName,
                  publishedAt: "Brouillon non publié",
                  status: "Brouillon",
                  activeContractsCount: 0,
                  priceFrEur: parsedPrice,
                  annualDiscountFrPct: 5,
                  priceCiXof: off.priceCiMonthlyXof,
                  note:
                    newVersionNote.trim() ||
                    "Nouvelle révision tarifaire — les contrats v2026.2 existants restent immuables.",
                },
                ...off.versions,
              ],
            }
          : off,
      ),
    );

    setOfferViewMode("versions");
    notify(
      `Révision ${nextVerName} créée pour l’offre ${versionModalOffer.name} sans impacter les contrats actifs`,
    );
    setVersionModalOffer(null);
    setNewVersionPriceFr("");
    setNewVersionNote("");
  };

  const handleCreatePromotion = () => {
    if (!newPromoCode.trim()) return;
    const code = newPromoCode.trim().toUpperCase();
    setPromotions((prev) => [
      {
        id: `promo-${Date.now()}`,
        code,
        discountLabel: newPromoDiscount,
        durationLabel: newPromoDuration,
        eligiblePlan: newPromoPlan,
        market: "France",
        usedCount: 0,
        maxUses: Number(newPromoMaxUses) || 100,
        eligibility: "Nouveaux clients",
        status: "Brouillon",
      },
      ...prev,
    ]);
    setPromoModalOpen(false);
    setNewPromoCode("");
    notify(`Promotion ${code} créée à l’état Brouillon`);
  };

  const handleApproveRefund = () => {
    if (!refundTarget) return;
    if (refundTotp.trim().length < 6) {
      setRefundError("Code MFA Super Admin à 6 chiffres requis pour exécuter le remboursement.");
      return;
    }
    setRefunds((prev) =>
      prev.map((r) => (r.id === refundTarget.id ? { ...r, status: "Exécuté" } : r)),
    );
    notify(
      `Remboursement ${refundTarget.id} (${refundTarget.refundAmountDisplay}) exécuté pour ${refundTarget.companyName}`,
    );
    setRefundTarget(null);
    setRefundTotp("");
    setRefundError(null);
  };

  return (
    <div className="mt-7 space-y-7">
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-[#E5E5E5] bg-[#171717] px-4 py-3 text-[13.5px] font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Bandeau de délimitation claire des 3 modules financiers (03 Facturation vs 04 Consommations vs 05 Finance) */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-2xs lg:flex-row lg:items-center">
        <div className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
          <span className="inline-flex size-2 shrink-0 rounded-full bg-[#008F6D]" />
          <span>
            <strong className="font-semibold text-[var(--foreground)]">
              03 · Facturation :
            </strong>{" "}
            « Combien nos clients nous doivent-ils et combien ont-ils payé ? » · Offres versionnées immuables.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("consumption", "summary")}
            className="h-8 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-3 text-[12.5px] font-medium text-[#171717] whitespace-nowrap hover:bg-[#EFEFEF] cursor-pointer"
          >
            04 · Consommations (Ressources) →
          </button>
          <button
            type="button"
            onClick={() => onNavigate("finance", "revenues")}
            className="h-8 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-3 text-[12.5px] font-medium text-[#171717] whitespace-nowrap hover:bg-[#EFEFEF] cursor-pointer"
          >
            05 · Finance (Marges &amp; Coûts) →
          </button>
        </div>
      </div>

      {/* =====================================================================
          01. SOUS-ONGLET ABONNEMENTS
         ===================================================================== */}
      {activeTab === "subscriptions" && (
        <div className="space-y-6">
          {/* 4 blocs de statistiques double surface style Dashboard Admin Client : 216 / 24 / 8 / 5 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                id: "active" as const,
                label: "Abonnements actifs",
                value: "216",
                sub: "Renouvellement auto actif · 94 % SEPA/CB",
                icon: "card" as const,
                accent: "text-[#008F6D]",
              },
              {
                id: "trial" as const,
                label: "En période d’essai",
                value: "24",
                sub: "Essais 14 jours · Échéances suivies",
                icon: "acquisition" as const,
                accent: "text-[#1D4ED8]",
              },
              {
                id: "past_due" as const,
                label: "Paiements en échec",
                value: "8",
                sub: "Relances automatiques J+1 / J+3 / J+7",
                icon: "bolt" as const,
                accent: "text-[#E11D48]",
              },
              {
                id: "cancelled" as const,
                label: "Résiliations ce mois",
                value: "5",
                sub: "Fin de période en cours · Numéros conservés",
                icon: "settings" as const,
                accent: "text-[#525252]",
              },
            ].map((stat) => {
              const selected = subStatusFilter === stat.id;
              return (
                <div
                  key={stat.id}
                  className={`rounded-xl border bg-[var(--surface)] p-2.5 shadow-2xs transition ${
                    selected ? "border-[#171717]" : "border-[var(--border)]"
                  }`}
                >
                  <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                        <SolarIcon name={stat.icon} className="size-4.5" />
                      </span>
                      <p className="text-[14px] font-medium leading-tight text-[var(--text-secondary)]">
                        {stat.label}
                      </p>
                    </div>
                    <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                      {stat.value}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSubStatusFilter((prev) => (prev === stat.id ? "all" : stat.id))
                    }
                    className={`flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[12.5px] font-medium cursor-pointer ${stat.accent}`}
                  >
                    <span className="truncate">{stat.sub}</span>
                    <span className="ml-2 shrink-0">
                      {selected ? "● Filtré" : "Filtrer →"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Tableau des abonnements */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-5 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Abonnements
                </h3>
                <p className="mt-0.5 text-[13.5px] text-[#737373]">
                  Gérez les abonnements de vos entreprises, leurs révisions tarifaires immuables et leurs échéances.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1">
                {(
                  [
                    { id: "all" as const, label: "Tous" },
                    { id: "active" as const, label: "Actifs (216)" },
                    { id: "trial" as const, label: "En essai (24)" },
                    { id: "past_due" as const, label: "Impayés (8)" },
                    { id: "cancelled" as const, label: "Résiliés (5)" },
                  ] as const
                ).map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setSubStatusFilter(pill.id)}
                    className={`h-8 rounded-lg px-3 text-[13px] font-medium whitespace-nowrap transition cursor-pointer ${
                      subStatusFilter === pill.id
                        ? "bg-[#171717] text-white shadow-2xs"
                        : "text-[#525252] hover:text-[#171717]"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative flex flex-1 items-center">
                <SolarIcon
                  name="search"
                  className="pointer-events-none absolute left-3.5 size-4 text-[#737373]"
                />
                <input
                  type="search"
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  placeholder="Rechercher une entreprise, une offre ou une version..."
                  className="h-10 w-full rounded-xl border border-[#E5E5E5] bg-white pr-4 pl-10 text-[13.5px] text-[#171717] placeholder:text-[#737373] outline-none focus:border-[#171717]"
                />
              </label>

              <div className="w-48">
                <PremiumSelect
                  value={subPlanFilter}
                  onChange={(val) => setSubPlanFilter(val as "all" | PlanTier)}
                  ariaLabel="Filtrer par offre"
                  options={[
                    { value: "all", label: "Toutes les offres" },
                    { value: "Starter", label: "Starter" },
                    { value: "Pro", label: "Pro" },
                    { value: "Business", label: "Business" },
                  ]}
                />
              </div>
            </div>

            <div className="mt-5 overflow-x-auto pb-1">
              <table className="w-full min-w-[840px] border-collapse text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                    <th className="py-3 pr-4">Entreprise</th>
                    <th className="px-4 py-3">Offre &amp; Révision</th>
                    <th className="px-4 py-3">Montant &amp; Cycle</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Échéance / fin</th>
                    <th className="py-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F2F2]">
                  {filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="transition hover:bg-[#FAFAFA]">
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] text-[13.5px] font-semibold text-[#171717]">
                            {sub.initials}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#171717]">
                                {sub.companyName}
                              </span>
                              <span className="rounded bg-[#EFEFEF] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[#525252]">
                                {sub.market}
                              </span>
                            </div>
                            <p className="text-[12px] text-[#737373]">
                              Passerelle {sub.gateway} ({sub.currency})
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-0.5 text-[12.5px] font-semibold text-[#171717]">
                            {sub.plan}
                          </span>
                          <span className="font-mono text-[11.5px] text-[#737373]">
                            {sub.planVersion}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="font-mono font-semibold text-[#171717]">
                          {sub.amountDisplay}
                        </p>
                        <p className="text-[12px] text-[#737373]">{sub.cycle}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {renderSubscriptionStatus(sub.status)}
                      </td>
                      <td className="px-4 py-4 font-mono text-[13px] text-[#525252] whitespace-nowrap">
                        {sub.dueDate}
                      </td>
                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setMigrationTarget(sub);
                            setMigrationNewPlan(sub.plan === "Pro" ? "Business" : "Pro");
                            setMigrationError(null);
                          }}
                          className="inline-flex h-8 items-center rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs hover:bg-[#F4F4F5] cursor-pointer"
                        >
                          Migrer l’offre →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          02. SOUS-ONGLET OFFRES (Starter / Pro / Business versionnées & immuables)
         ===================================================================== */}
      {activeTab === "offers" && (
        <div className="space-y-6">
          {/* Barre de contrôle unifiée : sélecteur des 5 volets + bascule de marché FR / CI */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xs xl:flex-row xl:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Catalogue des offres commerciales
                </h3>
                <span className="rounded-md bg-[#E6F5F0] px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#00775B]">
                  Offres versionnées &amp; immuables
                </span>
              </div>
              <p className="mt-1 text-[13.5px] text-[#737373]">
                Comparez et administrez Starter, Pro et Business. Modifier un tarif crée une nouvelle version sans altérer les contrats actifs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Bascule Marché FR / CI */}
              <div className="inline-flex rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1">
                {(
                  [
                    { code: "FR" as const, label: "France (EUR)" },
                    { code: "CI" as const, label: "Côte d’Ivoire (XOF)" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.code}
                    type="button"
                    onClick={() => setOfferMarketPreview(m.code)}
                    className={`h-8 rounded-lg px-3 text-[12.5px] font-medium whitespace-nowrap transition cursor-pointer ${
                      offerMarketPreview === m.code
                        ? "bg-white font-semibold text-[#171717] shadow-2xs"
                        : "text-[#525252] hover:text-[#171717]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Sélecteur des 5 volets synchronisé sur les 3 cartes */}
              <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1">
                {(
                  [
                    { id: "pricing" as const, label: "Tarification" },
                    { id: "quotas" as const, label: "Quotas inclus" },
                    { id: "features" as const, label: "Fonctionnalités" },
                    { id: "markets" as const, label: "Marchés & devises" },
                    { id: "versions" as const, label: "Versions de l’offre" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setOfferViewMode(tab.id)}
                    className={`h-8 shrink-0 rounded-lg px-3 text-[12.5px] font-medium whitespace-nowrap transition cursor-pointer ${
                      offerViewMode === tab.id
                        ? "bg-[#171717] text-white shadow-2xs"
                        : "text-[#525252] hover:text-[#171717]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Cartes d'offres double surface : Starter / Pro / Business */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {offers.map((offer) => {
              const isRecommended = offer.id === "Pro";
              const totalActiveContracts = offer.versions.reduce(
                (acc, v) => acc + v.activeContractsCount,
                0,
              );

              return (
                <article
                  key={offer.id}
                  className={`flex flex-col justify-between rounded-2xl border bg-[var(--surface)] p-3 shadow-2xs transition ${
                    isRecommended
                      ? "border-[#171717] ring-1 ring-[#171717]/10"
                      : "border-[var(--border)]"
                  }`}
                >
                  <div>
                    {/* Bloc supérieur double surface (En-tête + Prix principal) */}
                    <div
                      className={`rounded-xl p-5 ${
                        isRecommended ? "bg-[#F4F8F6]" : "bg-[var(--surface-inset)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[19px] font-semibold tracking-tight text-[#171717]">
                            {offer.name}
                          </h4>
                          {isRecommended && (
                            <span className="rounded-md bg-[#171717] px-2 py-0.5 text-[11px] font-semibold text-white">
                              Recommandé
                            </span>
                          )}
                        </div>
                        <span className="rounded-md border border-[#E5E5E5] bg-white px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#171717] shadow-2xs">
                          {offer.currentVersion}
                        </span>
                      </div>

                      <p className="mt-1.5 text-[13px] leading-relaxed text-[#525252]">
                        {offer.tagline}
                      </p>

                      {/* Affichage du tarif selon le marché prévisualisé */}
                      <div className="mt-5 border-t border-[#E5E5E5]/80 pt-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {offerMarketPreview === "FR" ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[30px] font-bold leading-none tracking-tight text-[#171717] tabular-nums whitespace-nowrap">
                                {`${offer.priceFrMonthlyEur} €`}
                              </span>
                              <span className="text-[13px] font-medium text-[#737373] whitespace-nowrap">
                                HT / mois
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[24px] font-bold leading-none tracking-tight text-[#171717] tabular-nums whitespace-nowrap">
                                {`${offer.priceCiMonthlyXof.toLocaleString("fr-FR")} XOF`}
                              </span>
                              <span className="text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                                HT / mois
                              </span>
                            </div>
                          )}

                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1 text-[12px] font-medium text-[#525252] whitespace-nowrap shadow-2xs">
                            <span className="size-1.5 rounded-full bg-[#008F6D]" />
                            <strong className="font-mono font-semibold text-[#171717] tabular-nums">
                              {totalActiveContracts}
                            </strong>
                            <span>contrats actifs</span>
                          </span>
                        </div>

                        <p className="mt-2 text-[12px] text-[#008064]">
                          {offerMarketPreview === "FR"
                            ? `Annuel (-5 %) : ${offer.priceFrAnnualMonthlyEqEur.toFixed(2).replace(".", ",")} € HT / mois`
                            : `Facturation mensuelle · Essai ${offer.trialDays} jours`}
                        </p>
                      </div>
                    </div>

                    {/* Corps de la carte synchronisé sur le volet sélectionné */}
                    <div className="px-2.5 pt-5 pb-2">
                      {offerViewMode === "pricing" && (
                        <div className="space-y-3">
                          <p className="text-[12px] font-semibold tracking-wide text-[#737373]">
                            Grille multi-devises &amp; conditions
                          </p>
                          <div className="divide-y divide-[#F0F0F0] rounded-xl border border-[#EFEFEF] bg-white">
                            <div className="flex items-center justify-between px-3.5 py-2.5 text-[13px]">
                              <span className="text-[#525252]">France (Mensuel)</span>
                              <span className="font-mono font-semibold text-[#171717] whitespace-nowrap">
                                {`${offer.priceFrMonthlyEur},00 € HT`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between px-3.5 py-2.5 text-[13px]">
                              <span className="text-[#525252]">France (Annuel -5 %)</span>
                              <span className="font-mono font-semibold text-[#008064] whitespace-nowrap">
                                {`${offer.priceFrAnnualMonthlyEqEur.toFixed(2).replace(".", ",")} € HT`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between px-3.5 py-2.5 text-[13px]">
                              <span className="text-[#525252]">Côte d’Ivoire (Mensuel)</span>
                              <span className="font-mono font-semibold text-[#171717] whitespace-nowrap">
                                {`${offer.priceCiMonthlyXof.toLocaleString("fr-FR")} XOF HT`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between px-3.5 py-2.5 text-[13px]">
                              <span className="text-[#525252]">Période d’essai</span>
                              <span className="font-mono text-[#171717] whitespace-nowrap">
                                {offer.trialDays} jours (carte vérifiée)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {offerViewMode === "quotas" && (
                        <div className="space-y-3">
                          <p className="text-[12px] font-semibold tracking-wide text-[#737373]">
                            Quotas mensuels inclus dans l’offre
                          </p>
                          <div className="divide-y divide-[#F0F0F0] rounded-xl border border-[#EFEFEF] bg-white">
                            {[
                              { label: "Minutes vocales IA", val: offer.quotas.voiceMinutes },
                              { label: "Agents vocaux IA", val: offer.quotas.aiAgents },
                              { label: "Crédits Acquisition", val: offer.quotas.acquisitionCredits },
                              { label: "Unités IA", val: offer.quotas.aiUnits },
                              { label: "E-mails & séquences", val: offer.quotas.emailsPerMonth },
                            ].map((q) => (
                              <div
                                key={q.label}
                                className="flex items-center justify-between gap-2 px-3.5 py-2.5 text-[13px]"
                              >
                                <span className="text-[#525252]">{q.label}</span>
                                <span className="font-mono text-[12.5px] font-semibold text-[#171717] text-right">
                                  {q.val}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {offerViewMode === "features" && (
                        <div className="space-y-3">
                          <p className="text-[12px] font-semibold tracking-wide text-[#737373]">
                            Modules &amp; capacités débloqués
                          </p>
                          <ul className="space-y-2.5 text-[13px] text-[#171717]">
                            {offer.features.map((feat) => (
                              <li key={feat} className="flex items-start gap-2.5">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="mt-0.5 size-4 shrink-0 text-[#008F6D]"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.3 7.7-5 5a1 1 0 0 1-1.4 0l-2.2-2.2a1 1 0 1 1 1.4-1.4l1.5 1.5 4.3-4.3a1 1 0 1 1 1.4 1.4Z" />
                                </svg>
                                <span className="leading-snug text-[#525252]">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {offerViewMode === "markets" && (
                        <div className="space-y-3">
                          <p className="text-[12px] font-semibold tracking-wide text-[#737373]">
                            Disponibilité par marché &amp; passerelle
                          </p>
                          <div className="space-y-2.5">
                            {offer.markets.map((m) => (
                              <div
                                key={m.code}
                                className="rounded-xl border border-[#EFEFEF] bg-white p-3.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[13.5px] font-semibold text-[#171717]">
                                    {m.label} ({m.currency})
                                  </span>
                                  <span
                                    className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${
                                      m.status === "Actif"
                                        ? "bg-[#DEF5EC] text-[#008064]"
                                        : "bg-[#F0C869] text-[#5C3D00]"
                                    }`}
                                  >
                                    {m.status}
                                  </span>
                                </div>
                                <p className="mt-1.5 text-[12.5px] text-[#525252]">
                                  Passerelle : <strong className="font-medium text-[#171717]">{m.gateway}</strong>
                                </p>
                                <p className="mt-0.5 text-[12px] text-[#737373]">
                                  Cycle annuel : {m.annualAvailable ? "Autorisé (-5 %)" : "Mensuel uniquement"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {offerViewMode === "versions" && (
                        <div className="space-y-3">
                          <p className="text-[12px] font-semibold tracking-wide text-[#737373]">
                            Historique des révisions immuables
                          </p>
                          <div className="space-y-2.5">
                            {offer.versions.map((ver) => (
                              <div
                                key={ver.version}
                                className="rounded-xl border border-[#EFEFEF] bg-white p-3.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-mono text-[13px] font-semibold text-[#171717]">
                                    {ver.version}
                                  </span>
                                  <span
                                    className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${
                                      ver.status.startsWith("Active")
                                        ? "bg-[#DEF5EC] text-[#008064]"
                                        : ver.status === "Brouillon"
                                          ? "bg-[#F0C869] text-[#5C3D00]"
                                          : "bg-[#EFEFEF] text-[#525252]"
                                    }`}
                                  >
                                    {ver.status}
                                  </span>
                                </div>
                                <p className="mt-1.5 font-mono text-[12px] font-medium text-[#171717]">
                                  {`${ver.priceFrEur} € HT · ${ver.priceCiXof.toLocaleString("fr-FR")} XOF · ${ver.activeContractsCount} contrat${ver.activeContractsCount > 1 ? "s" : ""}`}
                                </p>
                                <p className="mt-1 text-[12px] leading-relaxed text-[#737373]">
                                  {ver.note}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pied de carte : bouton de création d'une nouvelle version */}
                  <div className="mt-3 px-2.5 pb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setVersionModalOffer(offer);
                        setNewVersionPriceFr(String(offer.priceFrMonthlyEur));
                        setNewVersionNote("");
                      }}
                      className={`flex h-10 w-full items-center justify-center rounded-xl text-[13px] font-semibold transition cursor-pointer ${
                        isRecommended
                          ? "bg-[#171717] text-white hover:bg-[#2E2E2E]"
                          : "border border-[#E5E5E5] bg-white text-[#171717] hover:bg-[#F7F7F8]"
                      }`}
                    >
                      + Nouvelle révision ({offer.name})
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          03. SOUS-ONGLET TRANSACTIONS
         ===================================================================== */}
      {activeTab === "transactions" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-5 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Journal des transactions
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Suivez les paiements réussis, échoués, en attente et remboursés avec contrôle strict de la devise et du montant.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1">
              {(
                [
                  { id: "all" as const, label: "Toutes" },
                  { id: "Réussi" as const, label: "Réussies" },
                  { id: "Échoué" as const, label: "Échouées" },
                  { id: "Remboursé" as const, label: "Remboursées" },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setTxStatusFilter(st.id)}
                  className={`h-8 rounded-lg px-3 text-[13px] font-medium whitespace-nowrap transition cursor-pointer ${
                    txStatusFilter === st.id
                      ? "bg-[#171717] text-white shadow-2xs"
                      : "text-[#525252] hover:text-[#171717]"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto pb-1">
            <table className="w-full min-w-[800px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                  <th className="py-3 pr-4">ID Transaction</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Nature</th>
                  <th className="px-4 py-3">Passerelle</th>
                  <th className="px-4 py-3 text-right">Montant &amp; Devise</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="py-3 pl-4 text-right">Facture liée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="transition hover:bg-[#FAFAFA]">
                    <td className="py-4 pr-4 font-mono text-[13px] font-semibold text-[#171717] whitespace-nowrap">
                      {tx.id}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#737373] whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#171717] whitespace-nowrap">
                      {tx.companyName}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#525252] whitespace-nowrap">
                      {tx.type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1 text-[12px] font-medium text-[#171717]">
                        {tx.gateway === "Stripe" && (
                          <StripeBrandSvg className="size-3.5 rounded-[3px]" />
                        )}
                        <span>{tx.gateway}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-semibold text-[#171717] whitespace-nowrap">
                      {tx.amountDisplay}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                          tx.status === "Réussi"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : tx.status === "Échoué"
                              ? "bg-[#FCE7EB] text-[#B91C1C]"
                              : "bg-[#EFEFEF] text-[#525252]"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right font-mono text-[12.5px] text-[#525252] whitespace-nowrap">
                      {tx.invoiceId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          04. SOUS-ONGLET FACTURES
         ===================================================================== */}
      {activeTab === "invoices" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="border-b border-[#EFEFEF] pb-4">
            <h3 className="text-[17px] font-semibold text-[#171717]">
              Factures des entreprises
            </h3>
            <p className="mt-0.5 text-[13.5px] text-[#737373]">
              Consultez, téléchargez et suivez le statut comptable des factures et avoirs émis par AutoCall.
            </p>
          </div>

          <div className="mt-5 overflow-x-auto pb-1">
            <table className="w-full min-w-[780px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                  <th className="py-3 pr-4">N° Facture</th>
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Émission</th>
                  <th className="px-4 py-3 text-right">Montant HT</th>
                  <th className="px-4 py-3 text-right">Montant TTC</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="py-3 pl-4 text-right">Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {INITIAL_INVOICES.map((inv) => (
                  <tr key={inv.id} className="transition hover:bg-[#FAFAFA]">
                    <td className="py-4 pr-4 font-mono text-[13px] font-semibold text-[#171717] whitespace-nowrap">
                      {inv.number}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#171717] whitespace-nowrap">
                      {inv.companyName}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#737373] whitespace-nowrap">
                      {inv.issuedAt}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-[#525252] whitespace-nowrap">
                      {inv.amountHtDisplay}
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-semibold text-[#171717] whitespace-nowrap">
                      {inv.amountTtcDisplay}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                          inv.status === "Payée"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : inv.status === "Impayée"
                              ? "bg-[#FCE7EB] text-[#B91C1C]"
                              : "bg-[#EFEFEF] text-[#525252]"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => downloadCsv(`${inv.number}.csv`, [["Facture", "Entreprise", "Date", "HT", "TTC", "Statut"], [inv.number, inv.companyName, inv.issuedAt, inv.amountHtDisplay, inv.amountTtcDisplay, inv.status]])}
                        className="inline-flex h-8 items-center rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs hover:bg-[#F4F4F5] cursor-pointer"
                      >
                        Exporter CSV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          05. SOUS-ONGLET PROMOTIONS (avec l'exemple exact AUTOCALL20)
         ===================================================================== */}
      {activeTab === "promotions" && (
        <div className="space-y-6">
          {/* 3 blocs de stat double surface style Dashboard Admin Client */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Codes promotionnels
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  {promotions.length}
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                1 actif · 1 brouillon prêt (AUTOCALL20) · 1 expiré
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="crm" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Entreprises bénéficiaires
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  63
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[#525252]">
                Plafonds d’utilisation contrôlés côté serveur
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="card" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Remises accordées (30 j)
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums whitespace-nowrap">
                  412 € HT
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[#525252]">
                Impact déduit du revenu reconnu dans Finance
              </p>
            </div>
          </div>

          {/* Barre d'en-tête Promotions */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 shadow-2xs sm:flex-row sm:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Campagnes promotionnelles &amp; Coupons
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Créez des réductions temporaires associées à une offre, un marché et un quota maximal d’entreprises.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPromoModalOpen(true)}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
            >
              + Créer un code promotionnel
            </button>
          </div>

          {/* Cartes de promotions double surface */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {promotions.map((promo) => {
              const usagePct = Math.min(
                Math.round((promo.usedCount / Math.max(promo.maxUses, 1)) * 100),
                100,
              );
              return (
                <article
                  key={promo.id}
                  className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs"
                >
                  <div>
                    {/* En-tête double surface du coupon */}
                    <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] font-medium text-[#737373]">
                          Code promotionnel
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                            promo.status === "Active"
                              ? "bg-[#DEF5EC] text-[#008064]"
                              : promo.status === "Brouillon"
                                ? "bg-[#F0C869] text-[#5C3D00]"
                                : "bg-[#EFEFEF] text-[#525252]"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              promo.status === "Active"
                                ? "bg-[#15803D]"
                                : promo.status === "Brouillon"
                                  ? "bg-[#5C3D00]"
                                  : "bg-[#737373]"
                            }`}
                          />
                          {promo.status}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-lg border border-[#E5E5E5] bg-white px-3 py-1.5 font-mono text-[17px] font-bold tracking-tight text-[#171717] shadow-2xs">
                          {promo.code}
                        </span>
                        <div className="text-right">
                          <span className="block text-[22px] font-bold leading-none text-[#008F6D] tabular-nums">
                            {promo.discountLabel}
                          </span>
                          <span className="mt-1 block text-[11.5px] text-[#737373]">
                            {promo.durationLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Grille 2x2 des paramètres de la promotion */}
                    <div className="mt-3 grid grid-cols-2 gap-2 px-1">
                      <div className="rounded-xl border border-[#EFEFEF] bg-white p-3">
                        <p className="text-[11.5px] text-[#737373]">Offre éligible</p>
                        <p className="mt-0.5 text-[13.5px] font-semibold text-[#171717]">
                          {promo.eligiblePlan}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#EFEFEF] bg-white p-3">
                        <p className="text-[11.5px] text-[#737373]">Marché</p>
                        <p className="mt-0.5 text-[13.5px] font-semibold text-[#171717]">
                          {promo.market}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#EFEFEF] bg-white p-3">
                        <p className="text-[11.5px] text-[#737373]">Éligibilité</p>
                        <p className="mt-0.5 text-[13.5px] font-semibold text-[#171717]">
                          {promo.eligibility}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#EFEFEF] bg-white p-3">
                        <p className="text-[11.5px] text-[#737373]">Plafond</p>
                        <p className="mt-0.5 font-mono text-[13px] font-semibold text-[#171717] tabular-nums">
                          {promo.maxUses} entreprises
                        </p>
                      </div>
                    </div>

                    {/* Jauge d'utilisation */}
                    <div className="mt-3 px-2">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-[#737373]">Utilisation actuelle</span>
                        <span className="font-mono font-semibold text-[#171717] tabular-nums">
                          {promo.usedCount} / {promo.maxUses} ({usagePct} %)
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#EFEFEF]">
                        <div
                          className="h-full rounded-full bg-[#008F6D]"
                          style={{ width: `${usagePct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action en pied de carte */}
                  <div className="mt-4 px-1 pb-1">
                    {promo.status === "Brouillon" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPromotions((prev) =>
                            prev.map((p) =>
                              p.id === promo.id ? { ...p, status: "Active" } : p,
                            ),
                          );
                          notify(`Promotion ${promo.code} publiée et activée`);
                        }}
                        className="h-9.5 w-full rounded-xl bg-[#171717] text-[13px] font-semibold text-white transition hover:bg-[#2E2E2E] cursor-pointer"
                      >
                        Publier &amp; Activer le code
                      </button>
                    ) : promo.status === "Active" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPromotions((prev) =>
                            prev.map((p) =>
                              p.id === promo.id ? { ...p, status: "Expirée" } : p,
                            ),
                          );
                          notify(`Promotion ${promo.code} suspendue`);
                        }}
                        className="h-9.5 w-full rounded-xl border border-[#E5E5E5] bg-white text-[13px] font-semibold text-[#171717] transition hover:bg-[#F7F7F8] cursor-pointer"
                      >
                        Suspendre la campagne
                      </button>
                    ) : (
                      <div className="flex h-9.5 w-full items-center justify-center rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] text-[12.5px] font-medium text-[#737373]">
                        Plafond atteint · Campagne clôturée
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          06. SOUS-ONGLET REMBOURSEMENTS
         ===================================================================== */}
      {activeTab === "refunds" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="border-b border-[#EFEFEF] pb-4">
            <h3 className="text-[17px] font-semibold text-[#171717]">
              Demandes de remboursement
            </h3>
            <p className="mt-0.5 text-[13.5px] text-[#737373]">
              Traitez les demandes de remboursement avec vérification de la devise, du montant initial et réauthentification MFA.
            </p>
          </div>

          <div className="mt-5 space-y-3.5">
            {refunds.map((ref) => (
              <div
                key={ref.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[13px] font-bold text-[#171717]">
                      {ref.id}
                    </span>
                    <span className="text-[14px] font-semibold text-[#171717]">
                      · {ref.companyName}
                    </span>
                    <span className="rounded bg-[#E4EEFE] px-2 py-0.5 font-mono text-[11.5px] font-semibold text-[#1D4ED8]">
                      Ticket {ref.ticketRef}
                    </span>
                    <span
                      className={`rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                        ref.status === "Exécuté"
                          ? "bg-[#DEF5EC] text-[#008064]"
                          : "bg-[#F0C869] text-[#5C3D00]"
                      }`}
                    >
                      {ref.status}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] text-[#525252]">
                    Motif : {ref.reason}
                  </p>
                  <p className="mt-1 font-mono text-[12px] text-[#737373]">
                    Transaction {ref.transactionId} · Facture {ref.invoiceNumber} · Demandé :{" "}
                    {ref.requestedAt}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-right font-mono">
                    <p className="text-[11.5px] text-[#737373]">Montant ({ref.currency})</p>
                    <p className="text-[15px] font-bold text-[#171717] whitespace-nowrap">
                      {ref.refundAmountDisplay}
                    </p>
                  </div>

                  {ref.status === "À approuver (MFA)" && (
                    <button
                      type="button"
                      onClick={() => {
                        setRefundTarget(ref);
                        setRefundError(null);
                      }}
                      className="inline-flex h-9 items-center rounded-xl bg-[#171717] px-3.5 text-[13px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
                    >
                      Approuver avec MFA →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          MODALE 1 : MIGRATION EXPLICITE D'OFFRE
         ===================================================================== */}
      {migrationTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              Migration contrôlée d’abonnement — {migrationTarget.companyName}
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              Offre actuelle : <strong>{migrationTarget.plan}</strong> ({migrationTarget.planVersion}) · Devise verrouillée :{" "}
              <strong className="font-mono">{migrationTarget.currency}</strong>.
            </p>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Nouvelle offre cible (v2026.2)
                </label>
                <PremiumSelect
                  value={migrationNewPlan}
                  onChange={(v) => setMigrationNewPlan(v as PlanTier)}
                  ariaLabel="Nouvelle offre cible"
                  className="mt-1"
                  options={[
                    { value: "Starter", label: "Starter (v2026.2)" },
                    { value: "Pro", label: "Pro (v2026.2)" },
                    { value: "Business", label: "Business (v2026.2)" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Motif de migration &amp; accord client
                </label>
                <input
                  type="text"
                  value={migrationReason}
                  onChange={(e) => setMigrationReason(e.target.value)}
                  placeholder="Ex: Demande d’upgrade propriétaire · Ticket SUP-420"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Code MFA Super Admin (6 chiffres)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={migrationTotp}
                  onChange={(e) => setMigrationTotp(e.target.value)}
                  placeholder="••••••"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[14px] tracking-widest text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              {migrationError && (
                <p className="rounded-lg bg-[#FCE7EB] px-3 py-2 text-[12.5px] font-medium text-[#B91C1C]">
                  {migrationError}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => setMigrationTarget(null)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmMigration}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Valider la migration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALE 2 : CRÉATION D'UNE NOUVELLE VERSION D'OFFRE IMMUABLE
         ===================================================================== */}
      {versionModalOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              Créer une nouvelle version — Offre {versionModalOffer.name}
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              Les abonnements actuels sur <strong>{versionModalOffer.currentVersion}</strong> conserveront leur tarif contractuel tant qu’une migration explicite n’est pas déclenchée.
            </p>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Nouveau tarif mensuel France (€ HT)
                </label>
                <input
                  type="number"
                  value={newVersionPriceFr}
                  onChange={(e) => setNewVersionPriceFr(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[14px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Note de version
                </label>
                <input
                  type="text"
                  value={newVersionNote}
                  onChange={(e) => setNewVersionNote(e.target.value)}
                  placeholder="Ex: Ajustement quota minutes vocales Q1"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => setVersionModalOffer(null)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreateOfferVersion}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Enregistrer en brouillon (v2026.3)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALE 3 : CRÉATION D'UNE PROMOTION
         ===================================================================== */}
      {promoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              Nouveau code promotionnel
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              La promotion est créée à l’état <strong>Brouillon</strong> avant son activation publique.
            </p>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Code promotionnel
                </label>
                <input
                  type="text"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  placeholder="Ex: AUTOCALL20"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[14px] uppercase text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Réduction
                  </label>
                  <input
                    type="text"
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Offre éligible
                  </label>
                  <PremiumSelect
                    value={newPromoPlan}
                    onChange={(v) => setNewPromoPlan(v as PromotionRecord["eligiblePlan"])}
                    ariaLabel="Offre éligible"
                    className="mt-1"
                    options={[
                      { value: "Starter", label: "Starter" },
                      { value: "Pro", label: "Pro" },
                      { value: "Business", label: "Business" },
                      { value: "Toutes les offres", label: "Toutes les offres" },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Durée d’application
                  </label>
                  <input
                    type="text"
                    value={newPromoDuration}
                    onChange={(e) => setNewPromoDuration(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#171717]">
                    Utilisation maximale
                  </label>
                  <input
                    type="number"
                    value={newPromoMaxUses}
                    onChange={(e) => setNewPromoMaxUses(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => setPromoModalOpen(false)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreatePromotion}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Créer en brouillon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALE 4 : APPROBATION MFA D'UN REMBOURSEMENT
         ===================================================================== */}
      {refundTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              Approuver le remboursement {refundTarget.id}
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              Entreprise : <strong>{refundTarget.companyName}</strong> · Montant vérifié :{" "}
              <strong className="font-mono">{refundTarget.refundAmountDisplay}</strong> ({refundTarget.currency}).
            </p>

            <div className="mt-4 space-y-3.5">
              <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5 text-[13px] text-[#525252]">
                Motif : {refundTarget.reason} (Ticket {refundTarget.ticketRef})
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Code MFA Super Admin (6 chiffres)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={refundTotp}
                  onChange={(e) => setRefundTotp(e.target.value)}
                  placeholder="••••••"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[14px] tracking-widest text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              {refundError && (
                <p className="rounded-lg bg-[#FCE7EB] px-3 py-2 text-[12.5px] font-medium text-[#B91C1C]">
                  {refundError}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => setRefundTarget(null)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleApproveRefund}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Exécuter le remboursement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

