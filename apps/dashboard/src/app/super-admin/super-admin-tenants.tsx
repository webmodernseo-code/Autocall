"use client";

import { useMemo, useState } from "react";
import {
  GmailBrandSvg,
  GoogleCalendarBrandSvg,
  HubSpotBrandSvg,
  OutlookBrandSvg,
  StripeBrandSvg,
  TwilioBrandSvg,
  WhatsAppBusinessBrandSvg,
} from "../brand-icons";
import { PremiumSelect } from "../premium-select";
import { type Locale, SolarIcon } from "../workspace-navigation";
import { type SuperAdminSectionNavTarget } from "./super-admin-overview";

type CompanyStatus = "active" | "trial" | "suspended";
type PlanTier = "Starter" | "Pro" | "Business";
type MarketCode = "FR" | "CI";
type Company360Tab =
  | "overview"
  | "users"
  | "subscription"
  | "consumption"
  | "integrations"
  | "activity"
  | "support"
  | "admin";

interface CompanyUser {
  id: string;
  fullName: string;
  email: string;
  companyId: string;
  companyName: string;
  role: "Propriétaire" | "Invité (Lecture seule)";
  status: "Actif" | "Invité" | "Suspendu";
  mfaEnabled: boolean;
  lastLogin: string;
  createdAt: string;
}

interface CompanyInvitation {
  id: string;
  email: string;
  companyId: string;
  companyName: string;
  role: "Invité (Lecture seule)";
  invitedBy: string;
  sentAt: string;
  expiresAt: string;
  status: "Envoyée" | "Acceptée" | "Expirée" | "Révoquée";
}

interface CompanyIntegrationState {
  id: "whatsapp" | "gmail" | "outlook" | "gcal" | "hubspot" | "stripe" | "twilio";
  name: string;
  status: "Opérationnel" | "Connecté (Test requis)" | "Non connecté" | "Erreur OAuth";
  accountLabel: string;
  lastSync: string;
}

interface CompanyTicket {
  id: string;
  priority: "P1" | "P2" | "P3" | "P4";
  subject: string;
  status: "Ouvert" | "En diagnostic" | "Résolu";
  createdAt: string;
  clientConsentGranted: boolean;
}

interface AdminAuditEntry {
  id: string;
  date: string;
  actor: string;
  action: string;
  reason: string;
  ticketRef?: string;
}

interface CompanyRecord {
  id: string;
  initials: string;
  name: string;
  siren: string;
  domain: string;
  sector: string;
  country: string;
  market: MarketCode;
  timezone: string;
  currency: "EUR" | "XOF";
  plan: PlanTier;
  billingCycle: "Mensuel" | "Annuel (-5 %)";
  mrrDisplay: string;
  status: CompanyStatus;
  createdAt: string;
  ownerName: string;
  ownerEmail: string;
  phoneMain: string;
  minutesUsed: number;
  minutesQuota: number;
  aiCreditsUsed: number;
  aiCreditsQuota: number;
  activeAgentsCount: number;
  usersCount: number;
  guestsCount: number;
  paymentStatus: "À jour" | "En essai (J-9)" | "Impayé (Relance J+5)";
  integrations: CompanyIntegrationState[];
  tickets: CompanyTicket[];
  auditHistory: AdminAuditEntry[];
}

const INITIAL_COMPANIES: CompanyRecord[] = [
  {
    id: "comp-nova",
    initials: "N",
    name: "Nova Services",
    siren: "892 410 332",
    domain: "novaservices.fr",
    sector: "Nettoyage & Propreté B2B",
    country: "France",
    market: "FR",
    timezone: "Europe/Paris (UTC+1)",
    currency: "EUR",
    plan: "Pro",
    billingCycle: "Mensuel",
    mrrDisplay: "99\u00A0€ HT / mois",
    status: "active",
    createdAt: "14 janv. 2026",
    ownerName: "Marc Dupont",
    ownerEmail: "m.dupont@novaservices.fr",
    phoneMain: "+33 1 86 95 40 12",
    minutesUsed: 1840,
    minutesQuota: 2500,
    aiCreditsUsed: 620,
    aiCreditsQuota: 1000,
    activeAgentsCount: 3,
    usersCount: 4,
    guestsCount: 3,
    paymentStatus: "À jour",
    integrations: [
      { id: "twilio", name: "Téléphonie & SIP AutoCall", status: "Opérationnel", accountLabel: "+33 1 86 95 40 12 · Trunk EU", lastSync: "Temps réel" },
      { id: "whatsapp", name: "WhatsApp Business", status: "Opérationnel", accountLabel: "Nova Services · Meta Business", lastSync: "Il y a 3 min" },
      { id: "gmail", name: "Gmail", status: "Opérationnel", accountLabel: "contact@novaservices.fr", lastSync: "Il y a 8 min" },
      { id: "gcal", name: "Google Calendar", status: "Opérationnel", accountLabel: "Planning Interventions", lastSync: "Temps réel" },
      { id: "hubspot", name: "HubSpot CRM", status: "Connecté (Test requis)", accountLabel: "Portal #49281", lastSync: "Il y a 2 h" },
      { id: "stripe", name: "Stripe Billing", status: "Opérationnel", accountLabel: "SEPA actif · Facture #2026-11", lastSync: "Temps réel" },
    ],
    tickets: [
      {
        id: "SUP-418",
        priority: "P2",
        subject: "Agent vocal Emma ne bascule pas vers le numéro d’astreinte après 19h",
        status: "Ouvert",
        createdAt: "Aujourd’hui à 10:42",
        clientConsentGranted: true,
      },
      {
        id: "SUP-372",
        priority: "P3",
        subject: "Vérification de l’import CSV des prospects Lyon 3e",
        status: "Résolu",
        createdAt: "18 nov. 2026",
        clientConsentGranted: false,
      },
    ],
    auditHistory: [
      {
        id: "aud-1",
        date: "24 nov. 2026 · 16:20",
        actor: "root@autocall.fr",
        action: "Activation de l’offre Pro (99 € HT)",
        reason: "Validation fin de période d’essai par le propriétaire",
      },
      {
        id: "aud-2",
        date: "14 janv. 2026 · 09:15",
        actor: "Système",
        action: "Création de l’organisation Nova Services",
        reason: "Onboarding complété (France · EUR)",
      },
    ],
  },
  {
    id: "comp-atlas",
    initials: "A",
    name: "Atlas Immobilier",
    siren: "514 829 104",
    domain: "atlas-immobilier.fr",
    sector: "Immobilier & Gestion locative",
    country: "France",
    market: "FR",
    timezone: "Europe/Paris (UTC+1)",
    currency: "EUR",
    plan: "Business",
    billingCycle: "Annuel (-5 %)",
    mrrDisplay: "170\u00A0€ HT / mois",
    status: "active",
    createdAt: "03 févr. 2026",
    ownerName: "Claire Vance",
    ownerEmail: "c.vance@atlas-immobilier.fr",
    phoneMain: "+33 1 84 20 88 00",
    minutesUsed: 7420,
    minutesQuota: 10000,
    aiCreditsUsed: 2910,
    aiCreditsQuota: 4000,
    activeAgentsCount: 6,
    usersCount: 7,
    guestsCount: 6,
    paymentStatus: "À jour",
    integrations: [
      { id: "twilio", name: "Téléphonie & SIP AutoCall", status: "Opérationnel", accountLabel: "+33 1 84 20 88 00 · 4 numéros DID", lastSync: "Temps réel" },
      { id: "outlook", name: "Microsoft Outlook 365", status: "Opérationnel", accountLabel: "agence@atlas-immobilier.fr", lastSync: "Il y a 5 min" },
      { id: "whatsapp", name: "WhatsApp Business", status: "Opérationnel", accountLabel: "Atlas Visites · Meta", lastSync: "Temps réel" },
      { id: "hubspot", name: "HubSpot CRM", status: "Opérationnel", accountLabel: "Portal #88310", lastSync: "Il y a 4 min" },
      { id: "stripe", name: "Stripe Billing", status: "Opérationnel", accountLabel: "Annuel payé d’avance", lastSync: "Temps réel" },
    ],
    tickets: [
      {
        id: "SUP-409",
        priority: "P3",
        subject: "Question sur la synchronisation bidirectionnelle des agendas courtiers",
        status: "Résolu",
        createdAt: "21 nov. 2026",
        clientConsentGranted: false,
      },
    ],
    auditHistory: [
      {
        id: "aud-3",
        date: "03 févr. 2026 · 11:02",
        actor: "Système",
        action: "Souscription directe Business Annuel",
        reason: "Paiement Stripe validé",
      },
    ],
  },
  {
    id: "comp-clean",
    initials: "C",
    name: "Clean Studio",
    siren: "903 118 447",
    domain: "clean-studio.fr",
    sector: "Beauté, Bien-être & Studios",
    country: "France",
    market: "FR",
    timezone: "Europe/Paris (UTC+1)",
    currency: "EUR",
    plan: "Starter",
    billingCycle: "Mensuel",
    mrrDisplay: "49\u00A0€ HT / mois",
    status: "trial",
    createdAt: "20 nov. 2026",
    ownerName: "Sophie Laurent",
    ownerEmail: "sophie@clean-studio.fr",
    phoneMain: "+33 4 72 19 03 55",
    minutesUsed: 68,
    minutesQuota: 100,
    aiCreditsUsed: 45,
    aiCreditsQuota: 150,
    activeAgentsCount: 1,
    usersCount: 2,
    guestsCount: 1,
    paymentStatus: "En essai (J-9)",
    integrations: [
      { id: "twilio", name: "Téléphonie & SIP AutoCall", status: "Opérationnel", accountLabel: "Renvoi d’appel vérifié", lastSync: "Temps réel" },
      { id: "gcal", name: "Google Calendar", status: "Opérationnel", accountLabel: "Agenda Réservations Studio", lastSync: "Il y a 12 min" },
      { id: "whatsapp", name: "WhatsApp Business", status: "Non connecté", accountLabel: "Non configuré", lastSync: "—" },
    ],
    tickets: [],
    auditHistory: [
      {
        id: "aud-4",
        date: "20 nov. 2026 · 14:30",
        actor: "Système",
        action: "Ouverture de la période d’essai Starter",
        reason: "Agent Emma créé en brouillon puis validé",
      },
    ],
  },
  {
    id: "comp-mondo",
    initials: "M",
    name: "Mondo Services",
    siren: "481 920 773",
    domain: "mondo-services.fr",
    sector: "Bâtiment & Maintenance multi-technique",
    country: "France",
    market: "FR",
    timezone: "Europe/Paris (UTC+1)",
    currency: "EUR",
    plan: "Pro",
    billingCycle: "Mensuel",
    mrrDisplay: "99\u00A0€ HT / mois",
    status: "suspended",
    createdAt: "11 avr. 2026",
    ownerName: "Karim Benali",
    ownerEmail: "k.benali@mondo-services.fr",
    phoneMain: "+33 1 76 44 19 80",
    minutesUsed: 2500,
    minutesQuota: 2500,
    aiCreditsUsed: 980,
    aiCreditsQuota: 1000,
    activeAgentsCount: 0,
    usersCount: 3,
    guestsCount: 2,
    paymentStatus: "Impayé (Relance J+5)",
    integrations: [
      { id: "twilio", name: "Téléphonie & SIP AutoCall", status: "Connecté (Test requis)", accountLabel: "Sortants suspendus (mode secours)", lastSync: "Il y a 5 j" },
      { id: "gmail", name: "Gmail", status: "Erreur OAuth", accountLabel: "Jeton expiré · k.benali@mondo-services.fr", lastSync: "Il y a 7 j" },
      { id: "stripe", name: "Stripe Billing", status: "Connecté (Test requis)", accountLabel: "Échec prélèvement SEPA #INV-882", lastSync: "Il y a 5 j" },
    ],
    tickets: [
      {
        id: "SUP-399",
        priority: "P2",
        subject: "Demande de réactivation suite à mise à jour du mandat SEPA",
        status: "Ouvert",
        createdAt: "Hier à 17:15",
        clientConsentGranted: true,
      },
    ],
    auditHistory: [
      {
        id: "aud-5",
        date: "20 nov. 2026 · 08:00",
        actor: "root@autocall.fr",
        action: "Suspension administrative du compte",
        reason: "Échec de paiement après 3 relances Stripe (#INV-882)",
        ticketRef: "SUP-399",
      },
    ],
  },
  {
    id: "comp-ivoire",
    initials: "I",
    name: "Ivoire Logistique B2B",
    siren: "CI-ABJ-2026-B-148",
    domain: "ivoire-logistique.ci",
    sector: "Services B2B & Transport",
    country: "Côte d’Ivoire",
    market: "CI",
    timezone: "Africa/Abidjan (UTC+0)",
    currency: "XOF",
    plan: "Pro",
    billingCycle: "Mensuel",
    mrrDisplay: "30\u00A0000\u00A0XOF HT / mois",
    status: "active",
    createdAt: "02 sept. 2026",
    ownerName: "Awa Koné",
    ownerEmail: "a.kone@ivoire-logistique.ci",
    phoneMain: "+225 27 22 44 18 90",
    minutesUsed: 1410,
    minutesQuota: 2500,
    aiCreditsUsed: 530,
    aiCreditsQuota: 1000,
    activeAgentsCount: 2,
    usersCount: 4,
    guestsCount: 3,
    paymentStatus: "À jour",
    integrations: [
      { id: "whatsapp", name: "WhatsApp Business", status: "Opérationnel", accountLabel: "+225 07 08 11 22 33 · Meta", lastSync: "Temps réel" },
      { id: "gmail", name: "Gmail", status: "Opérationnel", accountLabel: "direction@ivoire-logistique.ci", lastSync: "Il y a 10 min" },
    ],
    tickets: [],
    auditHistory: [
      {
        id: "aud-6",
        date: "02 sept. 2026 · 10:12",
        actor: "Système",
        action: "Activation marché Côte d’Ivoire (XOF)",
        reason: "Qualification GeniusPay validée",
      },
    ],
  },
  {
    id: "comp-lyon",
    initials: "L",
    name: "Lyon Propreté & Services",
    siren: "812 554 901",
    domain: "lyon-proprete.fr",
    sector: "Nettoyage industriel & Bureaux",
    country: "France",
    market: "FR",
    timezone: "Europe/Paris (UTC+1)",
    currency: "EUR",
    plan: "Business",
    billingCycle: "Mensuel",
    mrrDisplay: "179\u00A0€ HT / mois",
    status: "active",
    createdAt: "09 janv. 2026",
    ownerName: "Thomas Mercier",
    ownerEmail: "t.mercier@lyon-proprete.fr",
    phoneMain: "+33 4 78 92 10 10",
    minutesUsed: 6840,
    minutesQuota: 10000,
    aiCreditsUsed: 2450,
    aiCreditsQuota: 4000,
    activeAgentsCount: 5,
    usersCount: 6,
    guestsCount: 5,
    paymentStatus: "À jour",
    integrations: [
      { id: "twilio", name: "Téléphonie & SIP AutoCall", status: "Opérationnel", accountLabel: "+33 4 78 92 10 10 · Trunk EU", lastSync: "Temps réel" },
      { id: "whatsapp", name: "WhatsApp Business", status: "Opérationnel", accountLabel: "Lyon Propreté · Meta", lastSync: "Temps réel" },
      { id: "hubspot", name: "HubSpot CRM", status: "Opérationnel", accountLabel: "Portal #41092", lastSync: "Il y a 2 min" },
      { id: "gcal", name: "Google Calendar", status: "Opérationnel", accountLabel: "Agenda Devis & Chantiers", lastSync: "Temps réel" },
    ],
    tickets: [],
    auditHistory: [],
  },
];

const INITIAL_USERS: CompanyUser[] = [
  {
    id: "usr-1",
    fullName: "Marc Dupont",
    email: "m.dupont@novaservices.fr",
    companyId: "comp-nova",
    companyName: "Nova Services",
    role: "Propriétaire",
    status: "Actif",
    mfaEnabled: true,
    lastLogin: "Aujourd’hui à 11:24",
    createdAt: "14 janv. 2026",
  },
  {
    id: "usr-2",
    fullName: "Julie Garnier",
    email: "j.garnier@novaservices.fr",
    companyId: "comp-nova",
    companyName: "Nova Services",
    role: "Invité (Lecture seule)",
    status: "Actif",
    mfaEnabled: true,
    lastLogin: "Hier à 18:05",
    createdAt: "19 janv. 2026",
  },
  {
    id: "usr-3",
    fullName: "Claire Vance",
    email: "c.vance@atlas-immobilier.fr",
    companyId: "comp-atlas",
    companyName: "Atlas Immobilier",
    role: "Propriétaire",
    status: "Actif",
    mfaEnabled: true,
    lastLogin: "Aujourd’hui à 09:48",
    createdAt: "03 févr. 2026",
  },
  {
    id: "usr-4",
    fullName: "Lucas Morel",
    email: "l.morel@atlas-immobilier.fr",
    companyId: "comp-atlas",
    companyName: "Atlas Immobilier",
    role: "Invité (Lecture seule)",
    status: "Actif",
    mfaEnabled: false,
    lastLogin: "Il y a 2 jours",
    createdAt: "12 févr. 2026",
  },
  {
    id: "usr-5",
    fullName: "Sophie Laurent",
    email: "sophie@clean-studio.fr",
    companyId: "comp-clean",
    companyName: "Clean Studio",
    role: "Propriétaire",
    status: "Actif",
    mfaEnabled: true,
    lastLogin: "Aujourd’hui à 10:15",
    createdAt: "20 nov. 2026",
  },
  {
    id: "usr-6",
    fullName: "Karim Benali",
    email: "k.benali@mondo-services.fr",
    companyId: "comp-mondo",
    companyName: "Mondo Services",
    role: "Propriétaire",
    status: "Suspendu",
    mfaEnabled: false,
    lastLogin: "19 nov. 2026",
    createdAt: "11 avr. 2026",
  },
  {
    id: "usr-7",
    fullName: "Awa Koné",
    email: "a.kone@ivoire-logistique.ci",
    companyId: "comp-ivoire",
    companyName: "Ivoire Logistique B2B",
    role: "Propriétaire",
    status: "Actif",
    mfaEnabled: true,
    lastLogin: "Aujourd’hui à 08:30",
    createdAt: "02 sept. 2026",
  },
  {
    id: "usr-8",
    fullName: "Thomas Mercier",
    email: "t.mercier@lyon-proprete.fr",
    companyId: "comp-lyon",
    companyName: "Lyon Propreté & Services",
    role: "Propriétaire",
    status: "Actif",
    mfaEnabled: true,
    lastLogin: "Aujourd’hui à 12:02",
    createdAt: "09 janv. 2026",
  },
];

const INITIAL_INVITATIONS: CompanyInvitation[] = [
  {
    id: "inv-101",
    email: "compta@novaservices.fr",
    companyId: "comp-nova",
    companyName: "Nova Services",
    role: "Invité (Lecture seule)",
    invitedBy: "Marc Dupont (Propriétaire)",
    sentAt: "Aujourd’hui à 09:30",
    expiresAt: "Dans 6 jours",
    status: "Envoyée",
  },
  {
    id: "inv-102",
    email: "direction.sud@atlas-immobilier.fr",
    companyId: "comp-atlas",
    companyName: "Atlas Immobilier",
    role: "Invité (Lecture seule)",
    invitedBy: "Claire Vance (Propriétaire)",
    sentAt: "21 nov. 2026",
    expiresAt: "Acceptée le 21 nov.",
    status: "Acceptée",
  },
  {
    id: "inv-103",
    email: "accueil@clean-studio.fr",
    companyId: "comp-clean",
    companyName: "Clean Studio",
    role: "Invité (Lecture seule)",
    invitedBy: "Sophie Laurent (Propriétaire)",
    sentAt: "22 nov. 2026",
    expiresAt: "Dans 4 jours",
    status: "Envoyée",
  },
  {
    id: "inv-104",
    email: "audit.externe@mondo-services.fr",
    companyId: "comp-mondo",
    companyName: "Mondo Services",
    role: "Invité (Lecture seule)",
    invitedBy: "Karim Benali (Propriétaire)",
    sentAt: "04 nov. 2026",
    expiresAt: "Expirée le 11 nov.",
    status: "Expirée",
  },
  {
    id: "inv-105",
    email: "supervision@lyon-proprete.fr",
    companyId: "comp-lyon",
    companyName: "Lyon Propreté & Services",
    role: "Invité (Lecture seule)",
    invitedBy: "Thomas Mercier (Propriétaire)",
    sentAt: "15 nov. 2026",
    expiresAt: "Acceptée le 15 nov.",
    status: "Acceptée",
  },
];

function IntegrationIconBadge({ id }: { id: CompanyIntegrationState["id"] }) {
  switch (id) {
    case "whatsapp":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-2xs">
          <WhatsAppBusinessBrandSvg className="size-full" />
        </span>
      );
    case "gmail":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-2xs">
          <GmailBrandSvg className="size-full" />
        </span>
      );
    case "outlook":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-2xs">
          <OutlookBrandSvg className="size-full" />
        </span>
      );
    case "gcal":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-2xs">
          <GoogleCalendarBrandSvg className="size-full" />
        </span>
      );
    case "hubspot":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-2xs">
          <HubSpotBrandSvg className="size-full" />
        </span>
      );
    case "stripe":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-2xs">
          <StripeBrandSvg className="size-full rounded-md" />
        </span>
      );
    case "twilio":
      return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-2xs">
          <TwilioBrandSvg className="size-full" />
        </span>
      );
  }
}

export function SuperAdminTenants({
  activeTab,
  onSelectTab,
  onNavigate,
}: {
  activeTab: string;
  locale: Locale;
  onSelectTab: (tabId: string) => void;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  const [companies, setCompanies] = useState<CompanyRecord[]>(INITIAL_COMPANIES);
  const [users, setUsers] = useState<CompanyUser[]>(INITIAL_USERS);
  const [invitations, setInvitations] = useState<CompanyInvitation[]>(INITIAL_INVITATIONS);

  // Filtres Sous-onglet 1 : Entreprises
  const [companySearch, setCompanySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CompanyStatus>("all");
  const [planFilter, setPlanFilter] = useState<"all" | PlanTier>("all");
  const [marketFilter, setMarketFilter] = useState<"all" | MarketCode>("all");

  // Fiche Entreprise 360° sélectionnée
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [company360Tab, setCompany360Tab] = useState<Company360Tab>("overview");

  // Diagnostic Support (session lecture seule 30 min révocable sous consentement + ticket + motif + reauth MFA)
  const [diagModalOpen, setDiagModalOpen] = useState(false);
  const [diagTicketId, setDiagTicketId] = useState("SUP-418");
  const [diagReason, setDiagReason] = useState(
    "Vérification de la règle de routage SVI et de la plage horaire de l’agent Emma",
  );
  const [diagConsentChecked, setDiagConsentChecked] = useState(true);
  const [diagTotpCode, setDiagTotpCode] = useState("");
  const [diagError, setDiagError] = useState<string | null>(null);
  const [activeDiagSession, setActiveDiagSession] = useState<{
    companyId: string;
    ticketId: string;
    reason: string;
    startedAt: string;
    remainingMinutes: number;
  } | null>(null);

  // Modale Action Administrative critique (Suspension / Réactivation / Résiliation / Fermeture)
  const [adminActionModal, setAdminActionModal] = useState<{
    type: "suspend" | "reactivate" | "terminate";
    companyId: string;
  } | null>(null);
  const [adminActionReason, setAdminActionReason] = useState("");
  const [adminActionTicket, setAdminActionTicket] = useState("");
  const [adminActionTotp, setAdminActionTotp] = useState("");
  const [adminActionError, setAdminActionError] = useState<string | null>(null);

  // Filtres Sous-onglet 2 : Utilisateurs
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | "Propriétaire" | "Invité (Lecture seule)">("all");

  // Filtres Sous-onglet 3 : Invitations
  const [inviteStatusFilter, setInviteStatusFilter] = useState<
    "all" | "Envoyée" | "Acceptée" | "Expirée" | "Révoquée"
  >("all");

  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  const selectedCompany = useMemo(
    () => companies.find((c) => c.id === selectedCompanyId) ?? null,
    [companies, selectedCompanyId],
  );

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (planFilter !== "all" && c.plan !== planFilter) return false;
      if (marketFilter !== "all" && c.market !== marketFilter) return false;
      if (companySearch.trim()) {
        const q = companySearch.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.domain.toLowerCase().includes(q) ||
          c.siren.toLowerCase().includes(q) ||
          c.ownerName.toLowerCase().includes(q) ||
          c.ownerEmail.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [companies, statusFilter, planFilter, marketFilter, companySearch]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (userRoleFilter !== "all" && u.role !== userRoleFilter) return false;
      if (userSearch.trim()) {
        const q = userSearch.toLowerCase();
        return (
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.companyName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [users, userRoleFilter, userSearch]);

  const filteredInvitations = useMemo(() => {
    return invitations.filter((inv) => {
      if (inviteStatusFilter !== "all" && inv.status !== inviteStatusFilter) return false;
      return true;
    });
  }, [invitations, inviteStatusFilter]);

  const openCompany360 = (companyId: string, initialTab: Company360Tab = "overview") => {
    setSelectedCompanyId(companyId);
    setCompany360Tab(initialTab);
  };

  const handleStartDiagnostic = () => {
    if (!selectedCompany) return;
    if (!diagConsentChecked) {
      setDiagError("Le consentement explicite du client est requis pour ouvrir un diagnostic.");
      return;
    }
    if (!diagTicketId.trim() || !diagReason.trim()) {
      setDiagError("Veuillez renseigner la référence du ticket et le motif précis d’intervention.");
      return;
    }
    if (diagTotpCode.trim().length < 6) {
      setDiagError("Veuillez saisir votre code MFA Super Admin à 6 chiffres pour confirmer l’élévation.");
      return;
    }

    const nowLabel = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setActiveDiagSession({
      companyId: selectedCompany.id,
      ticketId: diagTicketId.trim(),
      reason: diagReason.trim(),
      startedAt: nowLabel,
      remainingMinutes: 30,
    });

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selectedCompany.id
          ? {
              ...c,
              auditHistory: [
                {
                  id: `aud-${Date.now()}`,
                  date: `Aujourd’hui · ${nowLabel}`,
                  actor: "root@autocall.fr (MFA vérifié)",
                  action: "Ouverture diagnostic support lecture seule (max 30 min)",
                  reason: diagReason.trim(),
                  ticketRef: diagTicketId.trim(),
                },
                ...c.auditHistory,
              ],
            }
          : c,
      ),
    );

    setDiagError(null);
    setDiagTotpCode("");
    setDiagModalOpen(false);
    setCompany360Tab("support");
    notify(`Session diagnostic lecture seule (30 min) activée et auditée pour ${selectedCompany.name}`);
  };

  const handleRevokeDiagnostic = () => {
    if (!activeDiagSession || !selectedCompany) return;
    const nowLabel = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === activeDiagSession.companyId
          ? {
              ...c,
              auditHistory: [
                {
                  id: `aud-${Date.now()}`,
                  date: `Aujourd’hui · ${nowLabel}`,
                  actor: "root@autocall.fr",
                  action: "Révocation manuelle de la session diagnostic support",
                  reason: `Fin d’inspection sur ticket ${activeDiagSession.ticketId}`,
                  ticketRef: activeDiagSession.ticketId,
                },
                ...c.auditHistory,
              ],
            }
          : c,
      ),
    );
    setActiveDiagSession(null);
    notify("Accès diagnostic révoqué immédiatement · Entrée d’audit enregistrée");
  };

  const handleConfirmAdminAction = () => {
    if (!adminActionModal) return;
    if (!adminActionReason.trim()) {
      setAdminActionError("Le motif d’intervention est obligatoire (journal d’audit immuable).");
      return;
    }
    if (adminActionTotp.trim().length < 6) {
      setAdminActionError("Code MFA Super Admin à 6 chiffres requis pour exécuter cette opération.");
      return;
    }

    const target = companies.find((c) => c.id === adminActionModal.companyId);
    if (!target) return;

    const nowLabel = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const nextStatus: CompanyStatus =
      adminActionModal.type === "suspend" || adminActionModal.type === "terminate"
        ? "suspended"
        : "active";

    const actionLabel =
      adminActionModal.type === "suspend"
        ? "Suspension administrative de l’organisation"
        : adminActionModal.type === "reactivate"
          ? "Réactivation administrative de l’organisation"
          : "Résiliation contractuelle & fermeture des accès";

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === target.id
          ? {
              ...c,
              status: nextStatus,
              activeAgentsCount: nextStatus === "suspended" ? 0 : Math.max(c.activeAgentsCount, 1),
              auditHistory: [
                {
                  id: `aud-${Date.now()}`,
                  date: `Aujourd’hui · ${nowLabel}`,
                  actor: "root@autocall.fr (MFA vérifié)",
                  action: actionLabel,
                  reason: adminActionReason.trim(),
                  ticketRef: adminActionTicket.trim() || undefined,
                },
                ...c.auditHistory,
              ],
            }
          : c,
      ),
    );

    setAdminActionModal(null);
    setAdminActionReason("");
    setAdminActionTicket("");
    setAdminActionTotp("");
    setAdminActionError(null);
    notify(`${actionLabel} enregistrée pour ${target.name}`);
  };

  const renderStatusBadge = (status: CompanyStatus) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#DEF5EC] px-2.5 py-1 font-mono text-[12px] font-semibold text-[#008064] whitespace-nowrap">
          <span className="size-1.5 rounded-full bg-[#15803D]" />
          Active
        </span>
      );
    }
    if (status === "trial") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E4EEFE] px-2.5 py-1 font-mono text-[12px] font-semibold text-[#1D4ED8] whitespace-nowrap">
          <span className="size-1.5 rounded-full bg-[#1D4ED8]" />
          En essai
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FCE7EB] px-2.5 py-1 font-mono text-[12px] font-semibold text-[#B91C1C] whitespace-nowrap">
        <span className="size-1.5 rounded-full bg-[#B91C1C]" />
        Suspendue
      </span>
    );
  };

  return (
    <div className="mt-7 space-y-7">
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-[#E5E5E5] bg-[#171717] px-4 py-3 text-[13.5px] font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Bandeau de session Diagnostic Support active (si ouverte) */}
      {activeDiagSession && (
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#171717] bg-[#171717] px-5 py-3.5 text-white shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 text-[13.5px]">
            <span className="inline-flex size-2.5 shrink-0 animate-pulse rounded-full bg-[#00B489]" />
            <div>
              <span className="font-semibold">
                Diagnostic support lecture seule actif ({activeDiagSession.remainingMinutes} min max)
              </span>
              <span className="ml-2 text-[#A3A3A3]">
                · Ticket {activeDiagSession.ticketId} · Motif : {activeDiagSession.reason} · Aucun accès aux conversations privées brutes
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRevokeDiagnostic}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-white px-3 text-[12.5px] font-semibold text-[#171717] transition hover:bg-[#EFEFEF] cursor-pointer"
          >
            Révoquer l’accès immédiatement
          </button>
        </div>
      )}

      {/* =====================================================================
          SOUS-ONGLET 1 : ENTREPRISES (Liste ou Fiche Entreprise 360°)
         ===================================================================== */}
      {activeTab === "companies" && !selectedCompany && (
        <div className="space-y-6">
          {/* 4 blocs de statistiques double surface style Dashboard Admin Client : Total 248 / Actives 216 / En essai 24 / Suspendues 8 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                id: "all" as const,
                label: "Total entreprises",
                value: "248",
                sub: "234 France · 14 Côte d’Ivoire",
                icon: "crm" as const,
                accent: "text-[#008F6D]",
              },
              {
                id: "active" as const,
                label: "Actives",
                value: "216",
                sub: "87,1 % du parc · Facturation à jour",
                icon: "bolt" as const,
                accent: "text-[#008F6D]",
              },
              {
                id: "trial" as const,
                label: "En essai",
                value: "24",
                sub: "Conversion J+14 suivie dans Adoption",
                icon: "acquisition" as const,
                accent: "text-[#1D4ED8]",
              },
              {
                id: "suspended" as const,
                label: "Suspendues",
                value: "8",
                sub: "5 impayés Stripe · 3 sur demande",
                icon: "settings" as const,
                accent: "text-[#E11D48]",
              },
            ].map((stat) => {
              const isSelectedFilter = statusFilter === stat.id;
              return (
                <div
                  key={stat.id}
                  className={`rounded-xl border bg-[var(--surface)] p-2.5 shadow-2xs transition ${
                    isSelectedFilter ? "border-[#171717]" : "border-[var(--border)]"
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
                    onClick={() => setStatusFilter(stat.id)}
                    className={`flex w-full items-center justify-between px-2.5 pt-2.5 pb-1 text-left text-[12.5px] font-medium cursor-pointer ${stat.accent}`}
                  >
                    <span className="truncate">{stat.sub}</span>
                    <span className="ml-2 shrink-0">
                      {isSelectedFilter ? "● Filtré" : "Filtrer →"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Barre de recherche, filtres par statut / offre / marché */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-5 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Entreprises
                </h3>
                <p className="mt-0.5 text-[13.5px] text-[#737373]">
                  Gérez les entreprises de votre plateforme et cliquez sur une ligne pour ouvrir sa fiche 360°.
                </p>
              </div>

              {/* Filtres rapides par pilules de statut */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1">
                {(
                  [
                    { id: "all" as const, label: "Tous (248)" },
                    { id: "active" as const, label: "Actives (216)" },
                    { id: "trial" as const, label: "En essai (24)" },
                    { id: "suspended" as const, label: "Suspendues (8)" },
                  ] as const
                ).map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setStatusFilter(pill.id)}
                    className={`h-8 rounded-lg px-3 text-[13px] font-medium whitespace-nowrap transition cursor-pointer ${
                      statusFilter === pill.id
                        ? "bg-[#171717] text-white shadow-2xs"
                        : "text-[#525252] hover:text-[#171717]"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Barre de recherche + filtres Offre & Marché */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative flex flex-1 items-center">
                <SolarIcon
                  name="search"
                  className="pointer-events-none absolute left-3.5 size-4 text-[#737373]"
                />
                <input
                  type="search"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  placeholder="Rechercher par entreprise, SIREN, domaine, propriétaire..."
                  className="h-10 w-full rounded-xl border border-[#E5E5E5] bg-white pr-4 pl-10 text-[13.5px] text-[#171717] placeholder:text-[#737373] outline-none focus:border-[#171717]"
                />
              </label>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="w-44">
                  <PremiumSelect
                    value={planFilter}
                    onChange={(val) => setPlanFilter(val as "all" | PlanTier)}
                    ariaLabel="Filtrer par offre"
                    options={[
                      { value: "all", label: "Toutes les offres" },
                      { value: "Starter", label: "Offre Starter" },
                      { value: "Pro", label: "Offre Pro" },
                      { value: "Business", label: "Offre Business" },
                    ]}
                  />
                </div>
                <div className="w-44">
                  <PremiumSelect
                    value={marketFilter}
                    onChange={(val) => setMarketFilter(val as "all" | MarketCode)}
                    ariaLabel="Filtrer par marché"
                    options={[
                      { value: "all", label: "Tous les marchés" },
                      { value: "FR", label: "France (EUR)" },
                      { value: "CI", label: "Côte d’Ivoire (XOF)" },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Tableau des entreprises avec coulissement horizontal propre */}
            <div className="mt-5 overflow-x-auto pb-1">
              <table className="w-full min-w-[880px] border-collapse text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                    <th className="py-3 pr-4">Entreprise</th>
                    <th className="px-4 py-3">Propriétaire</th>
                    <th className="px-4 py-3">Offre</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Consommation voix</th>
                    <th className="px-4 py-3">Utilisateurs</th>
                    <th className="py-3 pl-4 text-right">Fiche 360°</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F2F2]">
                  {filteredCompanies.map((comp) => {
                    const quotaPct = Math.round((comp.minutesUsed / comp.minutesQuota) * 100);
                    return (
                      <tr
                        key={comp.id}
                        onClick={() => openCompany360(comp.id, "overview")}
                        className="group transition hover:bg-[#FAFAFA] cursor-pointer"
                      >
                        <td className="py-4 pr-4 whitespace-nowrap">
                          <div className="flex items-center gap-3.5">
                            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] text-[14px] font-semibold text-[#171717]">
                              {comp.initials}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[14px] font-semibold text-[#171717] group-hover:text-[#008F6D]">
                                  {comp.name}
                                </span>
                                <span className="rounded bg-[#EFEFEF] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[#525252]">
                                  {comp.market}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[12px] text-[#737373]">
                                {comp.country} · {comp.domain}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="font-medium text-[#171717]">{comp.ownerName}</p>
                          <p className="text-[12px] text-[#737373]">{comp.ownerEmail}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1 text-[12.5px] font-semibold text-[#171717]">
                            {comp.plan}
                          </span>
                          <p className="mt-1 font-mono text-[11.5px] text-[#737373]">
                            {comp.mrrDisplay}
                          </p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {renderStatusBadge(comp.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="w-36">
                            <div className="flex items-center justify-between font-mono text-[12px] tabular-nums">
                              <span className="font-medium text-[#171717]">
                                {comp.minutesUsed.toLocaleString("fr-FR")} min
                              </span>
                              <span className="text-[#737373]">{quotaPct} %</span>
                            </div>
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#EFEFEF]">
                              <div
                                className={`h-full rounded-full ${
                                  quotaPct >= 95
                                    ? "bg-[#E11D48]"
                                    : quotaPct >= 75
                                      ? "bg-[#F0C869]"
                                      : "bg-[#008F6D]"
                                }`}
                                style={{ width: `${Math.min(quotaPct, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-mono text-[12.5px] text-[#525252] whitespace-nowrap tabular-nums">
                          1 propriétaire · {comp.guestsCount} invité{comp.guestsCount > 1 ? "s" : ""}
                        </td>
                        <td
                          className="py-4 pl-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => openCompany360(comp.id, "overview")}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs transition hover:bg-[#F4F4F5] cursor-pointer"
                          >
                            <span>Ouvrir Fiche 360°</span>
                            <span>→</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          FICHE ENTREPRISE 360° (8 rubriques complètes sans quitter le module)
         ===================================================================== */}
      {activeTab === "companies" && selectedCompany && (
        <div className="space-y-6">
          {/* En-tête de la Fiche 360° avec bouton retour et actions rapides */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedCompanyId(null)}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[13px] font-medium text-[#171717] shadow-2xs transition hover:bg-[#F7F7F8] cursor-pointer"
                >
                  <span>←</span>
                  <span>Toutes les entreprises</span>
                </button>

                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] text-[18px] font-bold text-[#171717]">
                  {selectedCompany.initials}
                </span>

                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-[20px] font-semibold tracking-tight text-[#171717]">
                      {selectedCompany.name}
                    </h3>
                    {renderStatusBadge(selectedCompany.status)}
                    <span className="rounded-md border border-[#E5E5E5] bg-[#FAFAFA] px-2.5 py-0.5 font-mono text-[12px] font-semibold text-[#171717]">
                      Offre {selectedCompany.plan}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-[#737373]">
                    SIREN / RC : <span className="font-mono text-[#525252]">{selectedCompany.siren}</span> · Domaine :{" "}
                    <span className="font-mono text-[#525252]">{selectedCompany.domain}</span> · Inscrite le{" "}
                    {selectedCompany.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setDiagError(null);
                    setDiagModalOpen(true);
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[13px] font-semibold text-[#171717] shadow-2xs transition hover:bg-[#F7F7F8] cursor-pointer"
                >
                  <SolarIcon name="help" className="size-4" />
                  <span>Diagnostic support (30 min)</span>
                </button>

                {selectedCompany.status === "suspended" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAdminActionError(null);
                      setAdminActionModal({ type: "reactivate", companyId: selectedCompany.id });
                    }}
                    className="inline-flex h-9 items-center rounded-xl bg-[#008F6D] px-3.5 text-[13px] font-semibold text-white transition hover:bg-[#00775B] cursor-pointer"
                  >
                    Réactiver le compte
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAdminActionError(null);
                      setAdminActionModal({ type: "suspend", companyId: selectedCompany.id });
                    }}
                    className="inline-flex h-9 items-center rounded-xl border border-[#FCE7EB] bg-[#FFF5F7] px-3.5 text-[13px] font-semibold text-[#B91C1C] transition hover:bg-[#FCE7EB] cursor-pointer"
                  >
                    Suspendre
                  </button>
                )}
              </div>
            </div>

            {/* Barre des 8 rubriques de la Fiche 360° avec coulissement horizontal */}
            <div className="mt-6 flex items-center gap-6 overflow-x-auto border-t border-[#EFEFEF] pt-4 pb-1">
              {(
                [
                  { id: "overview" as const, label: "Vue d’ensemble" },
                  { id: "users" as const, label: `Utilisateurs (${selectedCompany.usersCount})` },
                  { id: "subscription" as const, label: "Abonnement" },
                  { id: "consumption" as const, label: "Consommations" },
                  { id: "integrations" as const, label: `Intégrations (${selectedCompany.integrations.length})` },
                  { id: "activity" as const, label: "Activité" },
                  { id: "support" as const, label: `Support (${selectedCompany.tickets.length})` },
                  { id: "admin" as const, label: "Administration" },
                ] as const
              ).map((rub) => {
                const active = company360Tab === rub.id;
                return (
                  <button
                    key={rub.id}
                    type="button"
                    onClick={() => setCompany360Tab(rub.id)}
                    className={`relative shrink-0 pb-2 text-[13.5px] whitespace-nowrap transition cursor-pointer ${
                      active
                        ? "font-semibold text-[#171717]"
                        : "font-medium text-[#737373] hover:text-[#171717]"
                    }`}
                  >
                    <span>{rub.label}</span>
                    {active && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#171717]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RUBRIQUE 1 : VUE D'ENSEMBLE */}
          {company360Tab === "overview" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
                <h4 className="text-[16px] font-semibold text-[#171717]">
                  Identité &amp; Coordonnées de l’organisation
                </h4>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { label: "Raison sociale", value: selectedCompany.name },
                    { label: "SIREN / Identifiant légal", value: selectedCompany.siren, mono: true },
                    { label: "Secteur d’activité", value: selectedCompany.sector },
                    { label: "Domaine principal", value: selectedCompany.domain, mono: true },
                    { label: "Pays & Marché de facturation", value: `${selectedCompany.country} (${selectedCompany.currency})` },
                    { label: "Fuseau horaire", value: selectedCompany.timezone },
                    { label: "Propriétaire du compte", value: `${selectedCompany.ownerName} (${selectedCompany.ownerEmail})` },
                    { label: "Numéro principal AutoCall", value: selectedCompany.phoneMain, mono: true },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-3.5"
                    >
                      <p className="text-[12px] font-medium text-[#737373]">{field.label}</p>
                      <p
                        className={`mt-1 text-[13.5px] font-semibold text-[#171717] ${
                          field.mono ? "font-mono" : ""
                        }`}
                      >
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
                <h4 className="text-[16px] font-semibold text-[#171717]">
                  Résumé opérationnel
                </h4>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-3.5">
                    <span className="text-[13px] text-[#525252]">Offre &amp; cycle</span>
                    <span className="font-semibold text-[#171717]">
                      {selectedCompany.plan} · {selectedCompany.billingCycle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-3.5">
                    <span className="text-[13px] text-[#525252]">Situation de paiement</span>
                    <span className="font-mono text-[12.5px] font-semibold text-[#171717]">
                      {selectedCompany.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-3.5">
                    <span className="text-[13px] text-[#525252]">Agents vocaux IA actifs</span>
                    <span className="font-mono text-[13px] font-semibold text-[#171717]">
                      {selectedCompany.activeAgentsCount} agent{selectedCompany.activeAgentsCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-3.5">
                    <span className="text-[13px] text-[#525252]">Accès V1</span>
                    <span className="font-mono text-[12.5px] text-[#171717]">
                      1 Propriétaire · {selectedCompany.guestsCount} Invités (lecture seule)
                    </span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* RUBRIQUE 2 : UTILISATEURS (Propriétaire et invités lecture seule) */}
          {company360Tab === "users" && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h4 className="text-[16px] font-semibold text-[#171717]">
                    Propriétaire &amp; Invités en lecture seule — {selectedCompany.name}
                  </h4>
                  <p className="mt-1 text-[13px] text-[#737373]">
                    Conformément au modèle V1, seul le propriétaire peut modifier la configuration ; les invités disposent d’un accès en lecture seule.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab("invitations")}
                  className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-3.5 text-[13px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                >
                  Voir les invitations →
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left text-[13.5px]">
                  <thead>
                    <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373]">
                      <th className="py-3 pr-4">Utilisateur</th>
                      <th className="px-4 py-3">Rôle V1</th>
                      <th className="px-4 py-3">MFA (TOTP)</th>
                      <th className="px-4 py-3">Dernière connexion</th>
                      <th className="py-3 pl-4 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F2F2]">
                    {users
                      .filter((u) => u.companyId === selectedCompany.id)
                      .map((u) => (
                        <tr key={u.id}>
                          <td className="py-3.5 pr-4">
                            <p className="font-semibold text-[#171717]">{u.fullName}</p>
                            <p className="text-[12px] text-[#737373]">{u.email}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-semibold ${
                                u.role === "Propriétaire"
                                  ? "bg-[#171717] text-white"
                                  : "bg-[#EFEFEF] text-[#525252]"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-[12px]">
                            {u.mfaEnabled ? (
                              <span className="text-[#008064]">● Activé</span>
                            ) : (
                              <span className="text-[#737373]">Facultatif (Non activé)</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-[13px] text-[#525252]">
                            {u.lastLogin}
                          </td>
                          <td className="py-3.5 pl-4 text-right">
                            <span className="rounded-md bg-[#DEF5EC] px-2.5 py-0.5 font-mono text-[12px] font-semibold text-[#008064]">
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* RUBRIQUE 3 : ABONNEMENT */}
          {company360Tab === "subscription" && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h4 className="text-[16px] font-semibold text-[#171717]">
                    Abonnement &amp; Situation de facturation
                  </h4>
                  <p className="mt-1 text-[13px] text-[#737373]">
                    Offre immuable rattachée au marché {selectedCompany.country} ({selectedCompany.currency}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("billing", "subscriptions")}
                  className="h-9 rounded-lg bg-[#171717] px-3.5 text-[13px] font-medium text-white hover:bg-[#2E2E2E] cursor-pointer"
                >
                  Ouvrir dans Module Facturation →
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                  <p className="text-[12.5px] text-[#737373]">Offre actuelle</p>
                  <p className="mt-1 text-[22px] font-semibold text-[#171717]">
                    {selectedCompany.plan} ({selectedCompany.billingCycle})
                  </p>
                  <p className="mt-1 font-mono text-[13px] text-[#008F6D]">
                    {selectedCompany.mrrDisplay}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                  <p className="text-[12.5px] text-[#737373]">Statut des paiements</p>
                  <p className="mt-1 text-[22px] font-semibold text-[#171717]">
                    {selectedCompany.paymentStatus}
                  </p>
                  <p className="mt-1 text-[12.5px] text-[#737373]">
                    Passerelle : {selectedCompany.market === "FR" ? "Stripe Europe" : "GeniusPay CI"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                  <p className="text-[12.5px] text-[#737373]">Recharge automatique</p>
                  <p className="mt-1 text-[22px] font-semibold text-[#171717]">
                    Désactivée par défaut
                  </p>
                  <p className="mt-1 text-[12.5px] text-[#737373]">
                    Alertes seuils 80 % · 95 % · 100 % actives
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* RUBRIQUE 4 : CONSOMMATIONS */}
          {company360Tab === "consumption" && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <div>
                  <h4 className="text-[16px] font-semibold text-[#171717]">
                    Minutes vocales, Crédits IA &amp; Quotas
                  </h4>
                  <p className="mt-1 text-[13px] text-[#737373]">
                    État temps réel du registre de réservations et débits atomiques de l’entreprise.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("consumption", "companies")}
                  className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-3.5 text-[13px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                >
                  Registre détaillé des mouvements →
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-semibold text-[#171717]">
                      Minutes d’appels IA
                    </span>
                    <span className="font-mono text-[13px] font-semibold text-[#171717] tabular-nums">
                      {selectedCompany.minutesUsed.toLocaleString("fr-FR")} /{" "}
                      {selectedCompany.minutesQuota.toLocaleString("fr-FR")} min
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                    <div
                      className="h-full rounded-full bg-[#008F6D]"
                      style={{
                        width: `${Math.min(
                          Math.round((selectedCompany.minutesUsed / selectedCompany.minutesQuota) * 100),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[12.5px] text-[#737373]">
                    Aucune réservation bloquée · Décompte à la seconde après décroché confirmé.
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-semibold text-[#171717]">
                      Unités IA &amp; Enrichissement Acquisition
                    </span>
                    <span className="font-mono text-[13px] font-semibold text-[#171717] tabular-nums">
                      {selectedCompany.aiCreditsUsed.toLocaleString("fr-FR")} /{" "}
                      {selectedCompany.aiCreditsQuota.toLocaleString("fr-FR")} u.
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                    <div
                      className="h-full rounded-full bg-[#171717]"
                      style={{
                        width: `${Math.min(
                          Math.round((selectedCompany.aiCreditsUsed / selectedCompany.aiCreditsQuota) * 100),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[12.5px] text-[#737373]">
                    Résumés post-appel, scoring CRM et signaux de recrutement.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* RUBRIQUE 5 : INTÉGRATIONS (avec les vrais logos SVG et distinction Connecté ≠ Opérationnel) */}
          {company360Tab === "integrations" && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
              <div>
                <h4 className="text-[16px] font-semibold text-[#171717]">
                  État des services connectés
                </h4>
                <p className="mt-1 text-[13px] text-[#737373]">
                  Un service « Connecté » en OAuth n’est marqué « Opérationnel » qu’après validation effective du flux.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-2">
                {selectedCompany.integrations.map((integ) => (
                  <div
                    key={integ.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <IntegrationIconBadge id={integ.id} />
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-[#171717]">
                          {integ.name}
                        </p>
                        <p className="truncate text-[12.5px] text-[#737373]">
                          {integ.accountLabel}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold whitespace-nowrap ${
                          integ.status === "Opérationnel"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : integ.status === "Connecté (Test requis)"
                              ? "bg-[#F0C869] text-[#5C3D00]"
                              : integ.status === "Erreur OAuth"
                                ? "bg-[#FCE7EB] text-[#B91C1C]"
                                : "bg-[#EFEFEF] text-[#525252]"
                        }`}
                      >
                        {integ.status}
                      </span>
                      <p className="mt-1 text-[11.5px] text-[#737373]">
                        Sync : {integ.lastSync}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* RUBRIQUE 6 : ACTIVITÉ (Historique administratif audité) */}
          {company360Tab === "activity" && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
              <h4 className="text-[16px] font-semibold text-[#171717]">
                Historique administratif &amp; Journal d’audit
              </h4>
              <p className="mt-1 text-[13px] text-[#737373]">
                Toutes les interventions Super Admin, changements d’état et sessions de diagnostic sont consignés de manière immuable.
              </p>

              <div className="mt-4 space-y-3">
                {selectedCompany.auditHistory.length === 0 ? (
                  <p className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4 text-[13.5px] text-[#737373]">
                    Aucun événement administratif particulier enregistré.
                  </p>
                ) : (
                  selectedCompany.auditHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-col justify-between gap-2 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[14px] font-semibold text-[#171717]">
                            {entry.action}
                          </span>
                          {entry.ticketRef && (
                            <span className="rounded bg-[#E4EEFE] px-2 py-0.5 font-mono text-[11.5px] font-semibold text-[#1D4ED8]">
                              Ticket {entry.ticketRef}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[13px] text-[#525252]">
                          Motif : {entry.reason}
                        </p>
                      </div>
                      <div className="text-right font-mono text-[12px] text-[#737373] whitespace-nowrap">
                        <p>{entry.date}</p>
                        <p className="text-[#525252]">{entry.actor}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* RUBRIQUE 7 : SUPPORT & DIAGNOSTIC 30 MIN */}
          {company360Tab === "support" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
                <div className="flex items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                  <div>
                    <h4 className="text-[16px] font-semibold text-[#171717]">
                      Tickets d’assistance liés
                    </h4>
                    <p className="mt-1 text-[13px] text-[#737373]">
                      Tickets ouverts par {selectedCompany.name} et état du consentement diagnostic.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {selectedCompany.tickets.length === 0 ? (
                    <p className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4 text-[13.5px] text-[#737373]">
                      Aucun ticket support ouvert pour cette entreprise.
                    </p>
                  ) : (
                    selectedCompany.tickets.map((t) => (
                      <div
                        key={t.id}
                        className="flex flex-col justify-between gap-3 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/70 p-4 sm:flex-row sm:items-center"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded bg-[#171717] px-2 py-0.5 font-mono text-[11.5px] font-semibold text-white">
                              {t.id} · {t.priority}
                            </span>
                            <span className="rounded bg-[#EFEFEF] px-2 py-0.5 text-[12px] font-medium text-[#171717]">
                              {t.status}
                            </span>
                            {t.clientConsentGranted && (
                              <span className="rounded bg-[#DEF5EC] px-2 py-0.5 font-mono text-[11.5px] font-semibold text-[#008064]">
                                ✓ Consentement client actif
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-[14px] font-semibold text-[#171717]">
                            {t.subject}
                          </p>
                          <p className="mt-0.5 text-[12px] text-[#737373]">{t.createdAt}</p>
                        </div>

                        {t.clientConsentGranted && (
                          <button
                            type="button"
                            onClick={() => {
                              setDiagTicketId(t.id);
                              setDiagError(null);
                              setDiagModalOpen(true);
                            }}
                            className="inline-flex h-8 shrink-0 items-center rounded-lg bg-[#171717] px-3 text-[12.5px] font-medium text-white hover:bg-[#2E2E2E] cursor-pointer"
                          >
                            Lancer diagnostic 30 min →
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Encadré de conformité du Diagnostic Support */}
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-5">
                <h4 className="text-[16px] font-semibold text-[#171717]">
                  Protocole de Diagnostic Support (Lecture seule)
                </h4>
                <p className="mt-1 text-[13px] leading-relaxed text-[#525252]">
                  Le Super Admin n’a aucun accès permanent aux conversations privées des clients. Toute ouverture de diagnostic exige :
                </p>
                <ul className="mt-4 space-y-2.5 text-[13px] text-[#171717]">
                  <li className="flex items-center gap-2.5">
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#DEF5EC] text-[12px] font-bold text-[#008064]">
                      1
                    </span>
                    <span>Consentement préalable activé par le client dans ses paramètres</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#DEF5EC] text-[12px] font-bold text-[#008064]">
                      2
                    </span>
                    <span>Ticket d’assistance P1–P4 et motif précis d’intervention</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#DEF5EC] text-[12px] font-bold text-[#008064]">
                      3
                    </span>
                    <span>Réauthentification MFA (TOTP) de l’administrateur</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#DEF5EC] text-[12px] font-bold text-[#008064]">
                      4
                    </span>
                    <span>Durée bornée à 30 minutes maximum, révocable à tout instant</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    setDiagError(null);
                    setDiagModalOpen(true);
                  }}
                  className="mt-5 flex h-10 w-full items-center justify-center rounded-xl bg-[#171717] text-[13.5px] font-semibold text-white transition hover:bg-[#2E2E2E] cursor-pointer"
                >
                  Ouvrir une session de diagnostic (30 min)
                </button>
              </section>
            </div>
          )}

          {/* RUBRIQUE 8 : ADMINISTRATION (Suspension / Réactivation / Fermeture distinctes) */}
          {company360Tab === "admin" && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
              <h4 className="text-[16px] font-semibold text-[#171717]">
                Opérations administratives critiques
              </h4>
              <p className="mt-1 text-[13px] text-[#737373]">
                La suspension, la résiliation contractuelle et la suppression RGPD sont trois opérations distinctes soumises à motif, réauthentification MFA et journal d’audit.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* 1. Suspension / Réactivation */}
                <div className="flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-5">
                  <div>
                    <span className="rounded-md bg-[#F0C869] px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#5C3D00]">
                      Réversible
                    </span>
                    <h5 className="mt-3 text-[15px] font-semibold text-[#171717]">
                      {selectedCompany.status === "suspended"
                        ? "Réactiver l’espace entreprise"
                        : "Suspendre temporairement"}
                    </h5>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#525252]">
                      Met en pause les campagnes sortantes et les agents IA tout en conservant les données et les numéros réservés.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminActionError(null);
                      setAdminActionModal({
                        type: selectedCompany.status === "suspended" ? "reactivate" : "suspend",
                        companyId: selectedCompany.id,
                      });
                    }}
                    className="mt-4 h-9 w-full rounded-lg border border-[#E5E5E5] bg-white text-[13px] font-semibold text-[#171717] shadow-2xs hover:bg-[#F4F4F5] cursor-pointer"
                  >
                    {selectedCompany.status === "suspended" ? "Réactiver avec MFA" : "Suspendre avec MFA"}
                  </button>
                </div>

                {/* 2. Résiliation / Fermeture contractuelle */}
                <div className="flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-5">
                  <div>
                    <span className="rounded-md bg-[#FCE7EB] px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#B91C1C]">
                      Fin de contrat
                    </span>
                    <h5 className="mt-3 text-[15px] font-semibold text-[#171717]">
                      Résilier &amp; fermer le compte
                    </h5>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#525252]">
                      Arrête la facturation récurrente, libère les numéros DID après le délai légal de portabilité et archive les factures.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminActionError(null);
                      setAdminActionModal({
                        type: "terminate",
                        companyId: selectedCompany.id,
                      });
                    }}
                    className="mt-4 h-9 w-full rounded-lg border border-[#FCE7EB] bg-[#FFF5F7] text-[13px] font-semibold text-[#B91C1C] hover:bg-[#FCE7EB] cursor-pointer"
                  >
                    Résilier le contrat
                  </button>
                </div>

                {/* 3. Suppression définitive RGPD */}
                <div className="flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-5">
                  <div>
                    <span className="rounded-md bg-[#EFEFEF] px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#525252]">
                      Purge RGPD (Module Sécurité)
                    </span>
                    <h5 className="mt-3 text-[15px] font-semibold text-[#171717]">
                      Suppression des données personnelles
                    </h5>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#525252]">
                      Purge irréversible des enregistrements vocaux et fiches contacts tout en conservant les pièces comptables légales (10 ans).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("security", "rgpd")}
                    className="mt-4 h-9 w-full rounded-lg border border-[#E5E5E5] bg-white text-[13px] font-semibold text-[#171717] hover:bg-[#F4F4F5] cursor-pointer"
                  >
                    Gérer dans Sécurité &amp; RGPD →
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* =====================================================================
          SOUS-ONGLET 2 : UTILISATEURS (Propriétaires & Invités en lecture seule)
         ===================================================================== */}
      {activeTab === "users" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-5 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Utilisateurs de la plateforme
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Gestion des personnes physiques rattachées aux entreprises : propriétaires de compte et invités en lecture seule (V1).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1">
              {(
                [
                  { id: "all" as const, label: "Tous les rôles" },
                  { id: "Propriétaire" as const, label: "Propriétaires" },
                  { id: "Invité (Lecture seule)" as const, label: "Invités (Lecture seule)" },
                ] as const
              ).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setUserRoleFilter(r.id)}
                  className={`h-8 rounded-lg px-3 text-[13px] font-medium whitespace-nowrap transition cursor-pointer ${
                    userRoleFilter === r.id
                      ? "bg-[#171717] text-white shadow-2xs"
                      : "text-[#525252] hover:text-[#171717]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="relative flex items-center">
              <SolarIcon
                name="search"
                className="pointer-events-none absolute left-3.5 size-4 text-[#737373]"
              />
              <input
                type="search"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Rechercher un utilisateur par nom, adresse e-mail ou entreprise..."
                className="h-10 w-full rounded-xl border border-[#E5E5E5] bg-white pr-4 pl-10 text-[13.5px] text-[#171717] placeholder:text-[#737373] outline-none focus:border-[#171717]"
              />
            </label>
          </div>

          <div className="mt-5 overflow-x-auto pb-1">
            <table className="w-full min-w-[820px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                  <th className="py-3 pr-4">Personne physique</th>
                  <th className="px-4 py-3">Entreprise rattachée</th>
                  <th className="px-4 py-3">Rôle V1</th>
                  <th className="px-4 py-3">MFA (TOTP)</th>
                  <th className="px-4 py-3">Dernière connexion</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="py-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="transition hover:bg-[#FAFAFA]">
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <p className="font-semibold text-[#171717]">{u.fullName}</p>
                      <p className="text-[12px] text-[#737373]">{u.email}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab("companies");
                          openCompany360(u.companyId, "users");
                        }}
                        className="font-semibold text-[#171717] hover:text-[#008F6D] hover:underline cursor-pointer"
                      >
                        {u.companyName} →
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-semibold ${
                          u.role === "Propriétaire"
                            ? "bg-[#171717] text-white"
                            : "bg-[#EFEFEF] text-[#525252]"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-[12px] whitespace-nowrap">
                      {u.mfaEnabled ? (
                        <span className="text-[#008064]">● Activé</span>
                      ) : (
                        <span className="text-[#737373]">Non activé</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#525252] whitespace-nowrap">
                      {u.lastLogin}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[12px] font-semibold ${
                          u.status === "Actif"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : "bg-[#FCE7EB] text-[#B91C1C]"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setUsers((prev) => prev.map((item) => item));
                          notify(`Session active réinitialisée pour ${u.email}`);
                        }}
                        className="inline-flex h-8 items-center rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs hover:bg-[#F4F4F5] cursor-pointer"
                      >
                        Révoquer sessions
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
          SOUS-ONGLET 3 : INVITATIONS (Envoyées, acceptées, expirées)
         ===================================================================== */}
      {activeTab === "invitations" && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
          <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-5 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Suivi des invitations
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Suivi centralisé des invitations d’invités en lecture seule envoyées, acceptées ou expirées.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1">
              {(
                [
                  { id: "all" as const, label: "Toutes" },
                  { id: "Envoyée" as const, label: "Envoyées" },
                  { id: "Acceptée" as const, label: "Acceptées" },
                  { id: "Expirée" as const, label: "Expirées" },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setInviteStatusFilter(st.id)}
                  className={`h-8 rounded-lg px-3 text-[13px] font-medium whitespace-nowrap transition cursor-pointer ${
                    inviteStatusFilter === st.id
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
            <table className="w-full min-w-[780px] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#EFEFEF] text-[12.5px] font-medium text-[#737373] whitespace-nowrap">
                  <th className="py-3 pr-4">E-mail invité</th>
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Rôle attribué</th>
                  <th className="px-4 py-3">Invité par</th>
                  <th className="px-4 py-3">Envoi &amp; Échéance</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="py-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {filteredInvitations.map((inv) => (
                  <tr key={inv.id} className="transition hover:bg-[#FAFAFA]">
                    <td className="py-4 pr-4 font-mono text-[13px] font-medium text-[#171717] whitespace-nowrap">
                      {inv.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab("companies");
                          openCompany360(inv.companyId, "users");
                        }}
                        className="font-semibold text-[#171717] hover:text-[#008F6D] hover:underline cursor-pointer"
                      >
                        {inv.companyName} →
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="rounded-md bg-[#EFEFEF] px-2.5 py-0.5 text-[12px] font-medium text-[#525252]">
                        {inv.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#525252] whitespace-nowrap">
                      {inv.invitedBy}
                    </td>
                    <td className="px-4 py-4 text-[12.5px] text-[#737373] whitespace-nowrap">
                      {inv.sentAt} · {inv.expiresAt}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                          inv.status === "Acceptée"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : inv.status === "Envoyée"
                              ? "bg-[#E4EEFE] text-[#1D4ED8]"
                              : "bg-[#FCE7EB] text-[#B91C1C]"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                      {inv.status === "Envoyée" ? (
                        <button
                          type="button"
                          onClick={() => {
                            setInvitations((prev) =>
                              prev.map((item) =>
                                item.id === inv.id ? { ...item, status: "Révoquée" } : item,
                              ),
                            );
                            notify(`Invitation révoquée pour ${inv.email}`);
                          }}
                          className="inline-flex h-8 items-center rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#B91C1C] hover:bg-[#FFF5F7] cursor-pointer"
                        >
                          Révoquer
                        </button>
                      ) : (
                        <span className="text-[12px] text-[#A3A3A3]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          MODALE 1 : DIAGNOSTIC SUPPORT (Lecture seule · 30 min max · MFA requis)
         ===================================================================== */}
      {diagModalOpen && selectedCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="diag-modal-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-[#EFEFEF] pb-4">
              <div>
                <span className="rounded-md bg-[#E6F5F0] px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#00775B]">
                  Accès encadré · Max 30 minutes
                </span>
                <h3 id="diag-modal-title" className="mt-2 text-[18px] font-semibold text-[#171717]">
                  Diagnostic support — {selectedCompany.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDiagModalOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-lg text-[#737373] hover:bg-[#F4F4F5] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-[13.5px]">
              <label className="flex items-start gap-3 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={diagConsentChecked}
                  onChange={(e) => setDiagConsentChecked(e.target.checked)}
                  className="mt-0.5 size-4 accent-[#171717]"
                />
                <span className="text-[13px] leading-snug text-[#171717]">
                  <strong>Consentement client vérifié :</strong> Le propriétaire ({selectedCompany.ownerName}) a autorisé l’assistance technique temporaire en lecture seule.
                </span>
              </label>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Référence du ticket support associé
                </label>
                <input
                  type="text"
                  value={diagTicketId}
                  onChange={(e) => setDiagTicketId(e.target.value)}
                  placeholder="Ex: SUP-418"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Motif d’intervention (consigné dans le journal d’audit client)
                </label>
                <textarea
                  rows={2}
                  value={diagReason}
                  onChange={(e) => setDiagReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E5E5E5] p-3 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Réauthentification Super Admin — Code MFA (TOTP à 6 chiffres)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={diagTotpCode}
                  onChange={(e) => setDiagTotpCode(e.target.value)}
                  placeholder="•••••• (ex: 123456)"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[14px] tracking-widest text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              {diagError && (
                <p className="rounded-lg bg-[#FCE7EB] px-3 py-2 text-[12.5px] font-medium text-[#B91C1C]">
                  {diagError}
                </p>
              )}
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
                onClick={handleStartDiagnostic}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Valider MFA &amp; Ouvrir (30 min)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALE 2 : CONFIRMATION D'ACTION ADMINISTRATIVE (Suspension / Réactivation / Résiliation)
         ===================================================================== */}
      {adminActionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              {adminActionModal.type === "suspend"
                ? "Confirmer la suspension administrative"
                : adminActionModal.type === "reactivate"
                  ? "Confirmer la réactivation du compte"
                  : "Confirmer la résiliation contractuelle"}
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              Cette opération nécessite un motif explicite, une référence de ticket optionnelle et votre validation MFA Super Admin.
            </p>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Motif obligatoire (journal d’audit)
                </label>
                <input
                  type="text"
                  value={adminActionReason}
                  onChange={(e) => setAdminActionReason(e.target.value)}
                  placeholder="Ex: Régularisation SEPA confirmée / Impayé J+15"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Ticket associé (optionnel)
                </label>
                <input
                  type="text"
                  value={adminActionTicket}
                  onChange={(e) => setAdminActionTicket(e.target.value)}
                  placeholder="Ex: SUP-399"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Code MFA Super Admin (6 chiffres)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={adminActionTotp}
                  onChange={(e) => setAdminActionTotp(e.target.value)}
                  placeholder="•••••• (ex: 123456)"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 font-mono text-[14px] tracking-widest text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              {adminActionError && (
                <p className="rounded-lg bg-[#FCE7EB] px-3 py-2 text-[12.5px] font-medium text-[#B91C1C]">
                  {adminActionError}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => setAdminActionModal(null)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmAdminAction}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Confirmer &amp; Auditer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

