"use client";

import Link from "next/link";
import { downloadCsv } from "./download-csv";
import { useState } from "react";
import { GmailBrandSvg, WhatsAppBrandSvg } from "./brand-icons";
import { CrmAppointments } from "./crm/appointments";
import {
  type ContactDetailData,
  ContactDetailView,
} from "./crm/contact-detail-view";
import { type InvoiceDraftPayload, InvoiceEditor } from "./crm/invoice-editor";
import { PremiumCheckbox } from "./premium-checkbox";
import { PremiumSelect } from "./premium-select";
import { type Locale, SolarIcon } from "./workspace-navigation";

type CrmTab = "contacts" | "companies" | "pipeline" | "appointments" | "invoices";
type LeadTemp = "hot" | "warm" | "cold" | "unrated";
type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";
type ContactSource = "acquisition" | "agent" | "csv";
const pageSize = 5;
const pagesFor = (total: number) => Math.max(1, Math.ceil(total / pageSize));

function CrmPagination({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
  const button = "rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--surface-hover)] disabled:opacity-45";
  return (
    <nav aria-label="Pagination des résultats" className="flex flex-wrap items-center justify-center gap-3 border-t border-[var(--border)] p-3 text-sm">
      <button type="button" className={button} disabled={page <= 1} onClick={() => onPage(page - 1)}>← Précédent</button>
      <span aria-live="polite">Page {page} / {pages}</span>
      <button type="button" className={button} disabled={page >= pages} onClick={() => onPage(page + 1)}>Suivant →</button>
    </nav>
  );
}

const DEAL_STAGES = [
  { key: "new", label: "Nouveau" },
  { key: "contacted", label: "Contacté" },
  { key: "qualification", label: "Qualifié" },
  { key: "appointment", label: "Rendez-vous" },
  { key: "proposal", label: "Proposition" },
  { key: "won", label: "Gagné" },
  { key: "lost", label: "Perdu" },
] as const;
type DealStage = (typeof DEAL_STAGES)[number]["key"];
const stageLabel = (key: DealStage) => DEAL_STAGES.find((stage) => stage.key === key)?.label ?? key;

interface PipelineDeal {
  id: string;
  name: string;
  amount: number;
  stage: DealStage;
  stageHistory?: { from: DealStage; to: DealStage; date: string }[];
  followUpDate?: string;
  closingDate: string;
  contactName: string;
  ownerName: string;
  ownerInitials: string;
  ownerColor: string;
}

interface CrmContact {
  id: string;
  initials: string;
  name: string;
  role: string;
  company: string;
  city: string;
  source: ContactSource;
  sourceLabel: string;
  email: string;
  phone: string;
  temp: LeadTemp;
  score: number;
  stage: string;
  pipelineNote: string;
  vip?: boolean;
  rgpdOptIn: boolean;
  assignedTo: string;
}

interface CompanyContactRef {
  id: string;
  initials: string;
  name: string;
  role: string;
  email: string;
  color: string;
}

interface CrmCompany {
  id: string;
  initials: string;
  name: string;
  city: string;
  sector: string;
  contactsCount: number;
  linkedContacts: CompanyContactRef[];
  pipelineAmount: number;
  pipelineValue: string;
  stage: "Proposition" | "RDV programmé" | "Gagné" | "Qualification";
}

interface CrmInvoice {
  id: string;
  number: string;
  kind: "Facture" | "Devis";
  client: string;
  email: string;
  date: string;
  dueDate: string;
  amountTtc: number;
  status: InvoiceStatus;
}

const initialContacts: CrmContact[] = [
  {
    id: "crm-c1",
    initials: "MV",
    name: "Marc Vallet",
    role: "Gérant fondateur",
    company: "Nettoyage Pro Lyon",
    city: "Lyon 3e (69)",
    source: "acquisition",
    sourceLabel: "Acquisition (Lyon)",
    email: "m.vallet@nettoyagepro-lyon.fr",
    phone: "+33 6 42 19 88 02",
    temp: "warm",
    score: 54,
    stage: "En attente campagne",
    pipelineNote: "En attente campagne",
    rgpdOptIn: true,
    assignedTo: "Thomas",
  },
  {
    id: "crm-c2",
    initials: "SM",
    name: "Sophie Martin",
    role: "Associée gérante",
    company: "Cabinet Nexa Lyon",
    city: "Villeurbanne (69)",
    source: "acquisition",
    sourceLabel: "Acquisition (Lyon)",
    email: "s.martin@nexa-avocats.fr",
    phone: "+33 4 78 22 10 00",
    temp: "warm",
    score: 62,
    stage: "En attente relance",
    pipelineNote: "En attente relance",
    rgpdOptIn: true,
    assignedTo: "Emma",
  },
  {
    id: "crm-c3",
    initials: "LB",
    name: "Luc Blanchard",
    role: "Directeur général",
    company: "Transports Blanchard SAS",
    city: "Saint-Priest (69)",
    source: "agent",
    sourceLabel: "Agent Thomas (Inbound)",
    email: "l.blanchard@trans-blanchard.fr",
    phone: "+33 6 11 90 45 12",
    temp: "hot",
    score: 92,
    stage: "Devis 14,5k € (Pipeline)",
    pipelineNote: "RDV confirmé · 29 mars",
    vip: true,
    rgpdOptIn: true,
    assignedTo: "Thomas",
  },
  {
    id: "crm-c4",
    initials: "JR",
    name: "Julie Roux",
    role: "Directrice administrative & fin.",
    company: "Groupe Finaxis",
    city: "Paris 8e (75)",
    source: "csv",
    sourceLabel: "Import CSV Sales",
    email: "j.roux@groupe-finaxis.fr",
    phone: "+33 1 44 80 92 11",
    temp: "hot",
    score: 78,
    stage: "Devis 9,4k €",
    pipelineNote: "RDV le 28 mars (14h)",
    rgpdOptIn: true,
    assignedTo: "Thomas",
  },
  {
    id: "crm-c5",
    initials: "KB",
    name: "Karim Benali",
    role: "Directeur commercial",
    company: "CleanTech Solutions",
    city: "Vénissieux (69)",
    source: "acquisition",
    sourceLabel: "Acquisition (Lyon)",
    email: "k.benali@cleantech-france.com",
    phone: "+33 7 81 22 43 90",
    temp: "hot",
    score: 74,
    stage: "Opportunité créée",
    pipelineNote: "Opportunité créée (manuel)",
    rgpdOptIn: false,
    assignedTo: "Emma",
  },
];

const initialCompanies: CrmCompany[] = [
  {
    id: "crm-e1",
    initials: "NP",
    name: "Nettoyage Pro Lyon",
    city: "Lyon 3e (69)",
    sector: "Nettoyage",
    contactsCount: 3,
    linkedContacts: [
      { id: "cc-1", initials: "MV", name: "Marc Vallet", role: "Gérant", email: "m.vallet@nettoyagepro-lyon.fr", color: "#E0F2FE" },
      { id: "cc-2", initials: "CD", name: "Claire Dubois", role: "Exploitation", email: "c.dubois@nettoyagepro-lyon.fr", color: "#DCFCE7" },
    ],
    pipelineAmount: 14500,
    pipelineValue: "14 500 €",
    stage: "Qualification",
  },
  {
    id: "crm-e2",
    initials: "TB",
    name: "Transports Blanchard SAS",
    city: "Saint-Priest (69)",
    sector: "Logistique",
    contactsCount: 2,
    linkedContacts: [
      { id: "cc-3", initials: "LB", name: "Luc Blanchard", role: "DG", email: "l.blanchard@trans-blanchard.fr", color: "#FEF3C7" },
      { id: "cc-4", initials: "PR", name: "Pauline Rey", role: "Achats", email: "p.rey@trans-blanchard.fr", color: "#F3E8FF" },
    ],
    pipelineAmount: 28400,
    pipelineValue: "28 400 €",
    stage: "RDV programmé",
  },
  {
    id: "crm-e3",
    initials: "GF",
    name: "Groupe Finaxis",
    city: "Paris 8e (75)",
    sector: "Services",
    contactsCount: 4,
    linkedContacts: [
      { id: "cc-5", initials: "JR", name: "Julie Roux", role: "DAF", email: "j.roux@groupe-finaxis.fr", color: "#FCE7F3" },
      { id: "cc-6", initials: "AL", name: "Antoine Lefèvre", role: "DSI", email: "a.lefevre@groupe-finaxis.fr", color: "#E0F2FE" },
      { id: "cc-7", initials: "MG", name: "Marine Girard", role: "Office Mgr", email: "m.girard@groupe-finaxis.fr", color: "#DCFCE7" },
    ],
    pipelineAmount: 42900,
    pipelineValue: "42 900 €",
    stage: "Proposition",
  },
  {
    id: "crm-e4",
    initials: "CN",
    name: "Cabinet Nexa Lyon",
    city: "Villeurbanne (69)",
    sector: "Conseil",
    contactsCount: 2,
    linkedContacts: [
      { id: "cc-8", initials: "SM", name: "Sophie Martin", role: "Associée", email: "s.martin@nexa-avocats.fr", color: "#F3E8FF" },
    ],
    pipelineAmount: 12800,
    pipelineValue: "12 800 €",
    stage: "Gagné",
  },
  {
    id: "crm-e5",
    initials: "CT",
    name: "CleanTech Solutions",
    city: "Vénissieux (69)",
    sector: "Maintenance",
    contactsCount: 3,
    linkedContacts: [
      { id: "cc-9", initials: "KB", name: "Karim Benali", role: "Dir. Com.", email: "k.benali@cleantech-france.com", color: "#FEF3C7" },
      { id: "cc-10", initials: "NS", name: "Nadia Saïd", role: "Qualité", email: "n.said@cleantech-france.com", color: "#E0F2FE" },
    ],
    pipelineAmount: 19200,
    pipelineValue: "19 200 €",
    stage: "Proposition",
  },
];

const initialInvoices: CrmInvoice[] = [
  {
    id: "inv-1",
    number: "FAC-2026-014",
    kind: "Facture",
    client: "Studio Claire",
    email: "claire@studioclaire.example",
    date: "18 nov. 2026",
    dueDate: "18 déc. 2026",
    amountTtc: 3100,
    status: "paid",
  },
  {
    id: "inv-2",
    number: "DEV-2026-029",
    kind: "Devis",
    client: "Horizon Services",
    email: "thomas@horizon.example",
    date: "20 nov. 2026",
    dueDate: "05 déc. 2026",
    amountTtc: 4200,
    status: "sent",
  },
  {
    id: "inv-3",
    number: "FAC-2026-013",
    kind: "Facture",
    client: "Élan Industries",
    email: "compta@elan.example",
    date: "02 nov. 2026",
    dueDate: "17 nov. 2026",
    amountTtc: 1850,
    status: "overdue",
  },
  {
    id: "inv-4",
    number: "FAC-2026-015",
    kind: "Facture",
    client: "Atlas Maintenance",
    email: "s.martin@atlas.example",
    date: "23 nov. 2026",
    dueDate: "23 déc. 2026",
    amountTtc: 2850,
    status: "draft",
  },
];

const tempStyles: Record<LeadTemp, { bg: string; fg: string; label: string }> = {
  hot: { bg: "var(--lead-hot-bg)", fg: "var(--lead-hot)", label: "Chaud" },
  warm: { bg: "var(--lead-warm-bg)", fg: "var(--lead-warm)", label: "Tiède" },
  cold: { bg: "var(--lead-cold-bg)", fg: "var(--lead-cold)", label: "Froid" },
  unrated: { bg: "var(--surface-inset)", fg: "var(--text-muted)", label: "Non évalué" },
};

const invoiceStatusStyles: Record<
  InvoiceStatus,
  { cls: string; label: Record<Locale, string> }
> = {
  paid: {
    cls: "bg-[var(--success-bg)] text-[var(--success)]",
    label: { fr: "Payée", en: "Paid", es: "Pagada" },
  },
  sent: {
    cls: "bg-[var(--info-bg)] text-[var(--info)]",
    label: { fr: "Envoyée", en: "Sent", es: "Enviada" },
  },
  overdue: {
    cls: "bg-[var(--danger-bg)] text-[var(--danger)]",
    label: { fr: "En retard", en: "Overdue", es: "Vencida" },
  },
  draft: {
    cls: "bg-[var(--neutral-bg)] text-[var(--neutral)]",
    label: { fr: "Brouillon", en: "Draft", es: "Borrador" },
  },
};

const tabLabels: Record<Locale, Record<CrmTab, string>> = {
  fr: {
    contacts: "Contacts",
    companies: "Entreprises",
    pipeline: "Pipeline",
    appointments: "Rendez-vous",
    invoices: "Devis & Factures",
  },
  en: {
    contacts: "Contacts",
    companies: "Companies",
    pipeline: "Pipeline",
    appointments: "Appointments",
    invoices: "Quotes & Invoices",
  },
  es: {
    contacts: "Contactos",
    companies: "Empresas",
    pipeline: "Pipeline",
    appointments: "Citas",
    invoices: "Presupuestos y Facturas",
  },
};

const initialPipelineDeals: PipelineDeal[] = [
  {
    id: "deal-1",
    name: "Abonnement annuel — Nettoyage Pro Lyon",
    amount: 14500,
    stage: "qualification",
    closingDate: "8 avr. 2025",
    contactName: "Marc Vallet",
    ownerName: "Tanjim Islam",
    ownerInitials: "TI",
    ownerColor: "#E0F2FE",
  },
  {
    id: "deal-2",
    name: "Déploiement Agents IA — Transports Blanchard",
    amount: 28400,
    stage: "contacted",
    closingDate: "17 avr. 2025",
    contactName: "Luc Blanchard",
    ownerName: "Thomas (Agent IA)",
    ownerInitials: "TH",
    ownerColor: "#DCFCE7",
  },
  {
    id: "deal-3",
    name: "Pack Multi-sites — Groupe Finaxis",
    amount: 42900,
    stage: "contacted",
    closingDate: "21 avr. 2025",
    contactName: "Julie Roux",
    ownerName: "Camille Laurent",
    ownerInitials: "CL",
    ownerColor: "#FEF3C7",
  },
  {
    id: "deal-4",
    name: "Accueil téléphonique 24/7 — Cabinet Nexa",
    amount: 12800,
    stage: "qualification",
    closingDate: "24 avr. 2025",
    contactName: "Sophie Martin",
    ownerName: "Tanjim Islam",
    ownerInitials: "TI",
    ownerColor: "#E0F2FE",
  },
  {
    id: "deal-5",
    name: "Automatisation relances — CleanTech Solutions",
    amount: 19200,
    stage: "qualification",
    closingDate: "28 avr. 2025",
    contactName: "Karim Benali",
    ownerName: "Emma (Agent IA)",
    ownerInitials: "EM",
    ownerColor: "#F3E8FF",
  },
  {
    id: "deal-6",
    name: "Contrat annuel — Horizon Services",
    amount: 16500,
    stage: "won",
    closingDate: "24 mars 2025",
    contactName: "Thomas Dupont",
    ownerName: "Tanjim Islam",
    ownerInitials: "TI",
    ownerColor: "#E0F2FE",
  },
  {
    id: "deal-7",
    name: "Standard vocal — Atlas Maintenance",
    amount: 9600,
    stage: "contacted",
    closingDate: "2 mai 2025",
    contactName: "Sarah Martin",
    ownerName: "Tanjim Islam",
    ownerInitials: "TI",
    ownerColor: "#E0F2FE",
  },
  {
    id: "deal-8",
    name: "Suite CRM & Prospection — Nova Facility",
    amount: 34200,
    stage: "qualification",
    closingDate: "9 mai 2025",
    contactName: "Marc Bernard",
    ownerName: "Emma (Agent IA)",
    ownerInitials: "EM",
    ownerColor: "#F3E8FF",
  },
  {
    id: "deal-9",
    name: "Renouvellement Pro — Lyon Métropole Clean",
    amount: 21800,
    stage: "won",
    closingDate: "19 mars 2025",
    contactName: "Claire Dubois",
    ownerName: "Tanjim Islam",
    ownerInitials: "TI",
    ownerColor: "#E0F2FE",
  },
  {
    id: "deal-10",
    name: "Audit sortant — Alpine Propreté",
    amount: 7400,
    stage: "lost",
    closingDate: "15 mars 2025",
    contactName: "Alex Moreau",
    ownerName: "Camille Laurent",
    ownerInitials: "CL",
    ownerColor: "#FEF3C7",
  },
];

export function CrmView({ locale, onPrepareCampaign }: { locale: Locale; onPrepareCampaign?: (name: string) => void }) {
  const [activeTab, setActiveTab] = useState<CrmTab>("contacts");
  const [contacts, setContacts] = useState<CrmContact[]>(initialContacts);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [contactPage, setContactPage] = useState(1);
  const [companyPage, setCompanyPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>(["crm-c1", "crm-c2", "crm-c3"]);
  const [showImportBanner, setShowImportBanner] = useState(true);
  const [newContactOpen, setNewContactOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [crmToast, setCrmToast] = useState<string | null>(null);
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);
  const [deals, setDeals] = useState<PipelineDeal[]>(initialPipelineDeals);
  const [companies, setCompanies] = useState<CrmCompany[]>(initialCompanies);
  const [companySectorFilter, setCompanySectorFilter] = useState("all");
  const [companySearch, setCompanySearch] = useState("");
  const [companySearchOpen, setCompanySearchOpen] = useState(false);
  const [companySort, setCompanySort] = useState("amount-desc");
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>(["crm-e1", "crm-e3"]);
  const [newCompanyOpen, setNewCompanyOpen] = useState(false);
  const [newCompName, setNewCompName] = useState("");
  const [newCompSector, setNewCompSector] = useState("Nettoyage");
  const [newCompCity, setNewCompCity] = useState("");
  const [newCompContact, setNewCompContact] = useState("");
  const [dealStageFilter, setDealStageFilter] = useState("all");
  const [dealSort, setDealSort] = useState("created");
  const [pipelineViewMode, setPipelineViewMode] = useState<"list" | "kanban">("list");
  const [selectedDealIds, setSelectedDealIds] = useState<string[]>(["deal-3", "deal-6", "deal-7"]);
  const [dealPage, setDealPage] = useState(1);
  const [newDealOpen, setNewDealOpen] = useState(false);
  const [newDealStage, setNewDealStage] = useState<DealStage>("new");
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [newDealName, setNewDealName] = useState("");
  const [newDealAmount, setNewDealAmount] = useState("15000");
  const [newDealContact, setNewDealContact] = useState("");
  const [invoices, setInvoices] = useState<CrmInvoice[]>(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<CrmInvoice | null>(null);
  const [invoiceFilter, setInvoiceFilter] = useState<"all" | InvoiceStatus>("all");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedContact, setSelectedContact] =
    useState<ContactDetailData | null>(null);

  const notifyCrm = (msg: string) => {
    setCrmToast(msg);
    setTimeout(() => {
      setCrmToast((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Formulaire de création de facture/devis
  const [clientName, setClientName] = useState(initialContacts[0].company);
  const [clientEmail, setClientEmail] = useState(initialContacts[0].email);

  const openInvoiceForClient = (company: string, email: string) => {
    setSelectedContact(null);
    setClientName(company);
    setClientEmail(email);
    setActiveTab("invoices");
    setComposerOpen(true);
  };

  const openContactDetail = (ct: CrmContact) => {
    setSelectedContact({
      id: ct.id,
      initials: ct.initials,
      name: ct.name,
      role: ct.role,
      company: ct.company,
      email: ct.email,
      phone: ct.phone,
      city: ct.city,
      source: ct.sourceLabel,
      score: ct.score,
      engagement: ct.score,
      tempLabel: tempStyles[ct.temp].label,
      stage: ct.stage,
      opportunityValue: "14 500 €",
    });
  };

  const handleSaveFromEditor = (payload: InvoiceDraftPayload) => {
    const created: CrmInvoice = {
      id: `inv-${Date.now()}`,
      number: payload.number,
      kind: payload.kind,
      client: payload.client,
      email: payload.email,
      date: payload.issueDate,
      dueDate: payload.dueDate,
      amountTtc: payload.amountTtc,
      status: payload.status,
    };
    setInvoices((prev) => [created, ...prev]);
    setComposerOpen(false);
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
    );
  };

  const filteredContacts = contacts
    .filter((c) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchSource = sourceFilter === "all" || c.source === sourceFilter;
      return matchSearch && matchSource;
    })
    .sort((a, b) => (sortBy === "score" ? b.score - a.score : 0));

  const filteredCompanies = companies
    .filter((co) => {
      const matchSector =
        companySectorFilter === "all" ||
        co.sector === companySectorFilter;
      const q = companySearch.trim().toLowerCase();
      const matchQ =
        !q ||
        co.name.toLowerCase().includes(q) ||
        co.city.toLowerCase().includes(q) ||
        co.linkedContacts.some((lc) =>
          lc.name.toLowerCase().includes(q)
        );
      return matchSector && matchQ;
    })
    .sort((a, b) =>
      companySort === "amount-desc"
        ? b.pipelineAmount - a.pipelineAmount
        : companySort === "amount-asc"
          ? a.pipelineAmount - b.pipelineAmount
          : b.contactsCount - a.contactsCount
    );
  const filteredDeals = deals
    .filter(
      (d) => dealStageFilter === "all" || d.stage === dealStageFilter
    )
    .sort((a, b) =>
      dealSort === "amount-desc"
        ? b.amount - a.amount
        : dealSort === "amount-asc"
          ? a.amount - b.amount
          : 0
    );
  const currentContactPage = Math.min(contactPage, pagesFor(filteredContacts.length));
  const currentCompanyPage = Math.min(companyPage, pagesFor(filteredCompanies.length));
  const currentDealPage = Math.min(dealPage, pagesFor(filteredDeals.length));
  const visibleContacts = filteredContacts.slice((currentContactPage - 1) * pageSize, currentContactPage * pageSize);
  const visibleCompanies = filteredCompanies.slice((currentCompanyPage - 1) * pageSize, currentCompanyPage * pageSize);
  const visibleDeals = filteredDeals.slice((currentDealPage - 1) * pageSize, currentDealPage * pageSize);

  const toggleContactSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddContact = () => {
    if (!newName.trim() || !newCompany.trim()) return;
    const parts = newName.trim().split(" ");
    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : newName.slice(0, 2).toUpperCase();
    const created: CrmContact = {
      id: `crm-c-${Date.now()}`,
      initials,
      name: newName.trim(),
      role: newRole.trim() || "Décideur",
      company: newCompany.trim(),
      city: "Paris (75)",
      source: "acquisition",
      sourceLabel: "Création manuelle",
      email: newEmail.trim() || "contact@entreprise.fr",
      phone: newPhone.trim() || "+33 6 00 00 00 00",
      temp: "warm",
      score: 65,
      stage: "Qualifié",
      pipelineNote: "Nouveau contact ajouté",
      rgpdOptIn: true,
      assignedTo: "Thomas",
    };
    setContacts((prev) => [created, ...prev]);
    setNewContactOpen(false);
    setNewName("");
    setNewRole("");
    setNewCompany("");
    setNewEmail("");
    setNewPhone("");
    notifyCrm("Nouveau contact ajouté au CRM");
  };

  const historyDeal = deals.find((deal) => deal.id === historyId);
  const moveDeal = (id: string, stage: DealStage) => {
    const date = new Date().toISOString();
    setDeals((previous) => previous.map((deal) => deal.id !== id || deal.stage === stage ? deal : {
      ...deal,
      stage,
      stageHistory: [...(deal.stageHistory ?? []), { from: deal.stage, to: stage, date }],
    }));
  };
  const advanceDeal = (deal: PipelineDeal) => {
    const next = DEAL_STAGES[DEAL_STAGES.findIndex((stage) => stage.key === deal.stage) + 1]?.key;
    if (next && deal.stage !== "won") moveDeal(deal.id, next);
  };
  const stageControl = (deal: PipelineDeal) => (
    <div className="flex flex-wrap items-center gap-2">
      <select aria-label={"Étape de " + deal.name} value={deal.stage} onChange={(event) => moveDeal(deal.id, event.target.value as DealStage)} className="max-w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm">
        {DEAL_STAGES.map((stage) => <option key={stage.key} value={stage.key}>{stage.label}</option>)}
      </select>
      <button type="button" className="text-xs underline" onClick={() => setHistoryId(deal.id)}>Historique</button>
    </div>
  );

  const tabs: CrmTab[] = ["contacts", "companies", "pipeline", "appointments"];

  return (
    <div className="w-full p-6">
      {selectedContact && (
        <ContactDetailView
          contact={selectedContact}
          onBack={() => setSelectedContact(null)}
          onCreateInvoice={openInvoiceForClient}
        />
      )}
      {openRowMenuId && (
        <div
          aria-hidden="true"
          onClick={() => setOpenRowMenuId(null)}
          className="fixed inset-0 z-20"
        />
      )}
      {crmToast && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#B8E6D6] bg-[#FFFFFF] px-4 py-3 text-[14px] font-medium text-[#171717] shadow-lg">
          <span className="size-2 rounded-full bg-[#00B489]" />
          {crmToast}
        </div>
      )}
      {/* En-tête */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[24px] leading-[32px] font-semibold tracking-[-0.025em] text-[var(--foreground)]">
            CRM
          </h2>
          <p className="mt-1 text-[14px] leading-[21px] text-[var(--text-secondary)]">
            Contacts, entreprises, pipeline commercial et rendez-vous.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (activeTab === "invoices") {
              setComposerOpen(true);
              return;
            }
            setActiveTab("invoices");
            setComposerOpen(false);
          }}
          disabled={activeTab === "invoices" && composerOpen}
          className="inline-flex h-[38px] items-center rounded-[8px] bg-[#008F6D] px-4 text-[13.5px] font-medium text-white transition-colors hover:bg-[#00775B] cursor-pointer"
        >
          {activeTab === "invoices" ? "+ Nouvelle facture" : tabLabels[locale].invoices}
        </button>
      </div>

      {/* Onglets */}
      <div
        role="tablist"
        aria-label="Sections CRM"
        className="mt-4 flex items-center gap-6 overflow-x-auto border-b border-[var(--border)]"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveTab(tab)}
              className={`relative shrink-0 whitespace-nowrap pb-2.5 text-[14px] transition-colors cursor-pointer ${
                selected
                  ? "font-semibold text-[var(--foreground)]"
                  : "font-normal text-[var(--text-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tabLabels[locale][tab]}
              {selected && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--foreground)]" />
              )}
            </button>
          );
        })}
      </div>

      <div hidden={activeTab !== "appointments"}>
        <CrmAppointments />
      </div>

      {/* CONTACTS */}
      {activeTab === "contacts" && (
        <div className="mt-4 space-y-4">
          {/* 4 KPI cards double-surface ultra-premium */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            {/* KPI 1 : Total contacts */}
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
              <div className="rounded-lg bg-[#F5F5F5] px-3.5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] text-[#171717] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                      <SolarIcon name="crm" className="size-4.5" />
                    </span>
                    <span className="truncate text-[13.5px] font-medium text-[#525252]">
                      Total contacts
                    </span>
                  </div>
                </div>
                <p className="mt-2.5 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
                  {(1415 + contacts.length).toLocaleString("fr-FR")}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1 text-[12.5px]">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F5F0] px-2 py-0.5 font-medium text-[#00775B] whitespace-nowrap">
                  +18 % ce mois
                </span>
                <span className="text-[#737373] whitespace-nowrap">Base unifiée</span>
              </div>
            </div>

            {/* KPI 2 : Origine Acquisition client */}
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
              <div className="rounded-lg bg-[#F5F5F5] px-3.5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#F6DFB0] bg-[#FFFFFF] text-[#D97706] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                      <SolarIcon name="acquisition" className="size-4.5" />
                    </span>
                    <span className="truncate text-[13.5px] font-medium text-[#525252]">
                      Acquisition client
                    </span>
                  </div>
                </div>
                <p className="mt-2.5 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
                  680
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1 text-[12.5px]">
                <span className="inline-flex items-center rounded-full bg-[#FEF6E6] px-2 py-0.5 font-medium text-[#9A6700] whitespace-nowrap">
                  48 % du CRM
                </span>
                <span className="text-[#737373] whitespace-nowrap">Import auto</span>
              </div>
            </div>

            {/* KPI 3 : Agents IA */}
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
              <div className="rounded-lg bg-[#F5F5F5] px-3.5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#DDD6FE] bg-[#FFFFFF] text-[#7C3AED] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                      <SolarIcon name="agents" className="size-4.5" />
                    </span>
                    <span className="truncate text-[13.5px] font-medium text-[#525252]">
                      Agents IA (Thomas / Emma)
                    </span>
                  </div>
                </div>
                <p className="mt-2.5 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
                  412
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1 text-[12.5px]">
                <span className="inline-flex items-center rounded-full bg-[#F3E8FF] px-2 py-0.5 font-medium text-[#6D28D9] whitespace-nowrap">
                  29 % du CRM
                </span>
                <span className="text-[#737373] whitespace-nowrap">Qualifiés</span>
              </div>
            </div>

            {/* KPI 4 : Prêts pour campagne (RGPD) */}
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
              <div className="rounded-lg bg-[#F5F5F5] px-3.5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#B8E6D6] bg-[#FFFFFF] text-[#008F6D] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                      <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                        <path d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6l-7-3Z" strokeLinejoin="round" />
                        <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="truncate text-[13.5px] font-medium text-[#525252]">
                      Prêts pour campagne
                    </span>
                  </div>
                </div>
                <p className="mt-2.5 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
                  894
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1 text-[12.5px]">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F5F0] px-2 py-0.5 font-medium text-[#00775B] whitespace-nowrap">
                  <span className="size-1.5 rounded-full bg-[#00B489]" />
                  Opt-in B2B actif
                </span>
                <span className="text-[#737373] whitespace-nowrap">RGPD</span>
              </div>
            </div>
          </div>

          {/* Clean Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <PremiumSelect
                value={sourceFilter}
                onChange={setSourceFilter}
                ariaLabel="Filtrer les contacts"
                className="min-w-[180px]"
                options={[
                  { value: "all", label: "Tous les contacts" },
                  { value: "acquisition", label: "Acquisition client" },
                  { value: "agent", label: "Agents IA (Thomas/Emma)" },
                  { value: "csv", label: "Import CSV Sales" },
                ]}
              />
              <button
                type="button"
                onClick={() => setShowImportBanner((prev) => !prev)}
                className="inline-flex h-[38px] items-center gap-1.5 rounded-[8px] border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[13.5px] font-medium text-[#404040] transition hover:bg-[#F8F8F8] cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="size-4 text-[#737373]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                  <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
                </svg>
                <span>Filtre</span>
              </button>
              {showImportBanner && (
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un contact..."
                  aria-label="Rechercher un contact"
                  className="h-[38px] w-52 rounded-[8px] border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[14px] text-[#171717] placeholder:text-[#737373] outline-none focus:border-[#00775B]"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-[#737373]">Trier par</span>
              <PremiumSelect
                value={sortBy}
                onChange={setSortBy}
                ariaLabel="Trier les contacts"
                className="min-w-[165px]"
                options={[
                  { value: "recent", label: "Date de création" },
                  { value: "score", label: "Score intention IA" },
                ]}
              />
              <button
                type="button"
                onClick={() => downloadCsv("autocall-contacts.csv", [["Nom", "Entreprise", "Fonction", "Email", "Téléphone", "Source"], ...filteredContacts.map((contact) => [contact.name, contact.company, contact.role, contact.email, contact.phone, contact.sourceLabel])])}
                className="inline-flex h-[38px] items-center gap-1.5 rounded-[8px] border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[13.5px] font-medium text-[#171717] hover:bg-[#F8F8F8] cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="size-4 text-[#525252]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Exporter</span>
              </button>
              <button
                type="button"
                onClick={() => setNewContactOpen(true)}
                className="inline-flex h-[38px] items-center gap-1.5 rounded-[8px] border border-[#E5E5E5] bg-white px-3.5 text-[13.5px] font-medium text-[#171717] transition hover:bg-[#F8F8F8] cursor-pointer"
              >
                + Ajouter un contact
              </button>
            </div>
          </div>

          {/* Clean Contacts Table */}
          <section className="overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-[#FFFFFF]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[13px] font-medium text-[#737373]">
                    <th className="w-11 px-4 py-3">
                      <PremiumCheckbox
                        checked={
                          filteredContacts.length > 0 &&
                          filteredContacts.every((contact) => selectedIds.includes(contact.id))
                        }
                        onChange={(checked) =>
                          setSelectedIds(
                            checked ? filteredContacts.map((c) => c.id) : []
                          )
                        }
                        ariaLabel="Tout sélectionner"
                      />
                    </th>
                    <th className="px-3 py-3">Nom du contact</th>
                    <th className="px-3 py-3">Entreprise</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Téléphone</th>
                    <th className="px-3 py-3">Canal de contact</th>
                    <th className="w-12 px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setNewContactOpen(true)}
                        aria-label="Ajouter un contact"
                        className="inline-flex size-6 items-center justify-center rounded-full bg-[#171717] text-[14px] font-semibold text-white hover:bg-[#262626]"
                      >
                        +
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0] text-[14px]">
                  {visibleContacts.map((ct, index) => {
                    const checked = selectedIds.includes(ct.id);
                    const avatarTints = ["#E0F2FE", "#DCFCE7", "#FEF3C7", "#F3E8FF", "#FCE7F3"];
                    const avatarBg = avatarTints[index % avatarTints.length];
                    return (
                      <tr
                        key={ct.id}
                        onClick={() => openContactDetail(ct)}
                        className="cursor-pointer transition-colors hover:bg-[#FAFAFA]"
                      >
                        <td className="px-4 py-3.5">
                          <PremiumCheckbox
                            checked={checked}
                            onChange={() => toggleContactSelection(ct.id)}
                            ariaLabel={`Sélectionner ${ct.name}`}
                          />
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-3">
                            <span
                              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] text-[12.5px] font-semibold text-[#171717]"
                              style={{ backgroundColor: avatarBg }}
                            >
                              {ct.initials}
                            </span>
                            <span className="font-medium text-[#171717]">{ct.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-[#262626]">{ct.company}</td>
                        <td className="px-3 py-3.5 text-[#525252]">{ct.email}</td>
                        <td className="px-3 py-3.5 text-[#525252] tabular-nums">{ct.phone}</td>
                        <td className="px-3 py-3.5">
                          {index % 3 === 0 ? (
                            <span className="inline-flex items-center gap-2.5 text-[13.5px] font-medium text-[#262626]">
                              <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              Téléphone
                            </span>
                          ) : index % 3 === 1 ? (
                            <span className="inline-flex items-center gap-2.5 text-[13.5px] font-medium text-[#262626]">
                              <WhatsAppBrandSvg className="size-5.5 shrink-0" />
                              WhatsApp
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2.5 text-[13.5px] font-medium text-[#262626]">
                              <GmailBrandSvg className="size-5.5 shrink-0" />
                              Email
                            </span>
                          )}
                        </td>
                        <td
                          className="relative px-4 py-3.5 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenRowMenuId((prev) =>
                                prev === ct.id ? null : ct.id
                              )
                            }
                            aria-label="Actions du contact"
                            aria-expanded={openRowMenuId === ct.id}
                            className="inline-flex size-7 items-center justify-center rounded-md text-[#737373] transition hover:bg-[#EFEFEF] hover:text-[#171717] cursor-pointer"
                          >
                            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                              <circle cx="12" cy="5" r="1.6" />
                              <circle cx="12" cy="12" r="1.6" />
                              <circle cx="12" cy="19" r="1.6" />
                            </svg>
                          </button>

                          {openRowMenuId === ct.id && (
                            <div
                              role="menu"
                              className="absolute right-4 top-11 z-30 w-48 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-1.5 text-left shadow-lg"
                            >
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setOpenRowMenuId(null);
                                  openContactDetail(ct);
                                }}
                                className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                              >
                                Voir la fiche contact
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setOpenRowMenuId(null);
                                  openInvoiceForClient(ct.company, ct.email);
                                }}
                                className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                              >
                                Créer un devis / facture
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setOpenRowMenuId(null);
                                  onPrepareCampaign?.(ct.name);
                                }}
                                disabled={!onPrepareCampaign}
                                className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#00775B] hover:bg-[#F3FAF7] cursor-pointer"
                              >
                                Préparer une campagne
                              </button>
                              <div className="my-1 h-px bg-[#F0F0F0]" />
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setOpenRowMenuId(null);
                                  setContacts((prev) =>
                                    prev.filter((item) => item.id !== ct.id)
                                  );
                                  notifyCrm("Contact supprimé");
                                }}
                                className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
                              >
                                Supprimer
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Clean pagination footer */}
            <CrmPagination page={currentContactPage} pages={pagesFor(filteredContacts.length)} onPage={setContactPage} />
          </section>

          {/* New Contact Modal */}
          {newContactOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
              <div className="w-full max-w-md rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-xl">
                <h3 className="text-[16px] font-bold text-[#171717]">Nouveau contact</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[13px] font-medium text-[#525252]">Nom complet</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Ex: Camille Laurent"
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#171717]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#525252]">Fonction</label>
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="Ex: Directrice des achats"
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#171717]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#525252]">Entreprise</label>
                    <input
                      type="text"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      placeholder="Ex: Groupe Horizon"
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#171717]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-medium text-[#525252]">Email</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="nom@entreprise.fr"
                        className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#171717]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#525252]">Téléphone</label>
                      <input
                        type="tel"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="+33 6 00 00 00 00"
                        className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#171717]"
                      />
                    </div>
                  </div>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] leading-relaxed text-[#525252]">
                    Assurez-vous de disposer d&apos;une base légale valide pour traiter ces données conformément à notre{" "}
                    <Link href="/outreach-policy" className="font-medium text-[#184D3B] hover:underline">
                      Politique de prospection
                    </Link>{" "}
                    et à notre{" "}
                    <Link href="/dpa" className="font-medium text-[#184D3B] hover:underline">
                      Accord DPA
                    </Link>
                    .
                  </p>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewContactOpen(false)}
                    className="h-9 rounded-lg border border-[#E5E5E5] px-3.5 text-[14px] font-medium text-[#525252] hover:bg-[#F5F5F5]"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleAddContact}
                    className="h-9 rounded-lg bg-[#171717] px-4 text-[14px] font-medium text-white hover:bg-[#262626]"
                  >
                    Ajouter le contact
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ENTREPRISES */}
      {activeTab === "companies" && (
        <div className="mt-4 space-y-4">
          {/* 4 KPI cards double-surface */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
              <div className="rounded-lg bg-[#EAF2FF] px-3.5 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#93C5FD] bg-[#FFFFFF] text-[#2563EB] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                    <SolarIcon name="crm" className="size-4.5" />
                  </span>
                  <span className="truncate text-[13.5px] font-medium text-[#525252]">
                    Entreprises suivies
                  </span>
                </div>
                <p className="mt-2.5 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
                  {310 + companies.length}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1 text-[12.5px]">
                <span className="inline-flex items-center rounded-full bg-[#DBEAFE] px-2 py-0.5 font-medium text-[#1D4ED8]">
                  +14 ce mois
                </span>
                <span className="text-[#737373]">Comptes B2B</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
              <div className="rounded-lg bg-[#FEF5DC] px-3.5 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#FCD34D] bg-[#FFFFFF] text-[#D97706] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                    <SolarIcon name="agents" className="size-4.5" />
                  </span>
                  <span className="truncate text-[13.5px] font-medium text-[#525252]">
                    Interlocuteurs actifs
                  </span>
                </div>
                <p className="mt-2.5 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
                  {companies.reduce((acc, co) => acc + co.contactsCount, 0) + 128}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1 text-[12.5px]">
                <span className="inline-flex items-center rounded-full bg-[#FEF0C7] px-2 py-0.5 font-medium text-[#B45309]">
                  2,8 / société
                </span>
                <span className="text-[#737373]">Décideurs</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
              <div className="rounded-lg bg-[#E6F7F0] px-3.5 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#6EE7B7] bg-[#FFFFFF] text-[#008F6D] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                    <SolarIcon name="card" className="size-4.5" />
                  </span>
                  <span className="truncate text-[13.5px] font-medium text-[#525252]">
                    Pipeline cumulé
                  </span>
                </div>
                <p className="mt-2.5 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
                  {companies
                    .reduce((acc, co) => acc + co.pipelineAmount, 0)
                    .toLocaleString("fr-FR")}{" "}
                  €
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1 text-[12.5px]">
                <span className="inline-flex items-center rounded-full bg-[#D1FAE5] px-2 py-0.5 font-medium text-[#00775B]">
                  +22 % vs M-1
                </span>
                <span className="text-[#737373]">En cours</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-2 shadow-2xs">
              <div className="rounded-lg bg-[#F5F5F5] px-3.5 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] text-[#171717] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                    <SolarIcon name="acquisition" className="size-4.5" />
                  </span>
                  <span className="truncate text-[13.5px] font-medium text-[#525252]">
                    Taux de signature
                  </span>
                </div>
                <p className="mt-2.5 text-[26px] font-semibold tracking-tight text-[#171717] tabular-nums">
                  34 %
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1 text-[12.5px]">
                <span className="inline-flex items-center rounded-full bg-[#E6F5F0] px-2 py-0.5 font-medium text-[#00775B]">
                  12 contrats
                </span>
                <span className="text-[#737373]">Ce trimestre</span>
              </div>
            </div>
          </div>

          {/* Clean Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <PremiumSelect
                value={companySectorFilter}
                onChange={setCompanySectorFilter}
                ariaLabel="Filtrer par secteur"
                className="min-w-[180px]"
                options={[
                  { value: "all", label: "Tous les secteurs" },
                  { value: "Nettoyage", label: "Nettoyage" },
                  { value: "Maintenance", label: "Maintenance" },
                  { value: "Services", label: "Services" },
                  { value: "Logistique", label: "Logistique" },
                  { value: "Conseil", label: "Conseil" },
                ]}
              />
              <button
                type="button"
                onClick={() => setCompanySearchOpen((prev) => !prev)}
                className="inline-flex h-9.5 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[14px] font-medium text-[#404040] shadow-2xs transition hover:bg-[#F8F8F8]"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 text-[#737373]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                  <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
                </svg>
                Filtre
              </button>
              {companySearchOpen && (
                <input
                  type="search"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  placeholder="Rechercher entreprise, contact..."
                  aria-label="Rechercher une entreprise"
                  className="h-9.5 w-52 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[14px] text-[#171717] placeholder:text-[#737373] outline-none focus:border-[#171717]"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13.5px] text-[#737373]">Trier par</span>
              <PremiumSelect
                value={companySort}
                onChange={setCompanySort}
                ariaLabel="Trier les entreprises"
                className="min-w-[175px]"
                options={[
                  { value: "amount-desc", label: "Valeur décroissante" },
                  { value: "amount-asc", label: "Valeur croissante" },
                  { value: "contacts", label: "Nombre de contacts" },
                ]}
              />
              <button
                type="button"
                onClick={() => downloadCsv("autocall-entreprises.csv", [["Entreprise", "Secteur", "Ville", "Valeur pipeline", "Étape"], ...filteredCompanies.map((company) => [company.name, company.sector, company.city, company.pipelineAmount, company.stage])])}
                className="inline-flex h-9.5 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[14px] font-medium text-[#171717] shadow-2xs hover:bg-[#F8F8F8]"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 text-[#525252]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Exporter
              </button>
              <button
                type="button"
                onClick={() => setNewCompanyOpen(true)}
                className="inline-flex h-9.5 items-center gap-1.5 rounded-lg bg-[#171717] px-3.5 text-[14px] font-medium text-white shadow-xs transition hover:bg-[#262626]"
              >
                + Ajouter une entreprise
              </button>
            </div>
          </div>

          {/* Clean Companies Table with Linked Contacts */}
          <section className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[13px] font-medium text-[#737373]">
                    <th className="w-11 px-4 py-3">
                      <PremiumCheckbox
                        checked={
                          filteredCompanies.length > 0 &&
                          filteredCompanies.every((company) => selectedCompanyIds.includes(company.id))
                        }
                        onChange={(checked) =>
                          setSelectedCompanyIds(
                            checked ? filteredCompanies.map((co) => co.id) : []
                          )
                        }
                        ariaLabel="Tout sélectionner"
                      />
                    </th>
                    <th className="px-3 py-3">Entreprise</th>
                    <th className="px-3 py-3">Personnes en contact</th>
                    <th className="px-3 py-3">Valeur pipeline</th>
                    <th className="px-3 py-3">Étape</th>
                    <th className="w-12 px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setNewCompanyOpen(true)}
                        aria-label="Ajouter une entreprise"
                        className="inline-flex size-6 items-center justify-center rounded-full bg-[#171717] text-[14px] font-semibold text-white hover:bg-[#262626]"
                      >
                        +
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0] text-[14px]">
                  {visibleCompanies.map((co) => {
                      const checked = selectedCompanyIds.includes(co.id);
                      const stageCls =
                        co.stage === "Gagné"
                          ? "border-[#86EFAC] bg-[#F0FDF4] text-[#15803D]"
                          : co.stage === "Proposition"
                            ? "border-[#FCD34D] bg-[#FFFBEB] text-[#B45309]"
                            : co.stage === "RDV programmé"
                              ? "border-[#C4B5FD] bg-[#F5F3FF] text-[#6D28D9]"
                              : "border-[#93C5FD] bg-[#EFF6FF] text-[#1D4ED8]";
                      return (
                        <tr
                          key={co.id}
                          className="transition-colors hover:bg-[#FAFAFA]"
                        >
                          <td className="px-4 py-3.5">
                            <PremiumCheckbox
                              checked={checked}
                              onChange={() =>
                                setSelectedCompanyIds((prev) =>
                                  prev.includes(co.id)
                                    ? prev.filter((id) => id !== co.id)
                                    : [...prev, co.id]
                                )
                              }
                              ariaLabel={`Sélectionner ${co.name}`}
                            />
                          </td>
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] text-[13px] font-semibold text-[#171717]">
                                {co.initials}
                              </span>
                              <div>
                                <p className="font-medium text-[#171717]">{co.name}</p>
                                <p className="text-[12.5px] text-[#737373]">
                                  {co.sector} · {co.city}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3.5">
                            <div className="flex flex-wrap items-center gap-2">
                              {co.linkedContacts.map((lc) => (
                                <button
                                  key={lc.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedContact({
                                      id: lc.id,
                                      initials: lc.initials,
                                      name: lc.name,
                                      role: lc.role,
                                      company: co.name,
                                      email: lc.email,
                                      score: 82,
                                      engagement: 84,
                                      tempLabel: "Chaud",
                                      stage: co.stage,
                                      opportunityValue: co.pipelineValue,
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] py-0.5 pr-2.5 pl-0.5 text-[13px] transition hover:border-[#008F6D] hover:bg-[#F3FAF7] cursor-pointer"
                                >
                                  <span
                                    className="inline-flex size-6 items-center justify-center rounded-full text-[12px] font-semibold text-[#171717]"
                                    style={{ backgroundColor: lc.color }}
                                  >
                                    {lc.initials}
                                  </span>
                                  <span className="font-medium text-[#171717]">{lc.name}</span>
                                  <span className="text-[12px] text-[#8C8C8C]">· {lc.role}</span>
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-3.5 font-semibold text-[#171717] tabular-nums">
                            {co.pipelineValue}
                          </td>
                          <td className="px-3 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12.5px] font-medium ${stageCls}`}
                            >
                              {co.stage}
                            </span>
                          </td>
                          <td
                            className="relative px-4 py-3.5 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setOpenRowMenuId((prev) =>
                                  prev === co.id ? null : co.id
                                )
                              }
                              aria-label={`Actions ${co.name}`}
                              aria-expanded={openRowMenuId === co.id}
                              className="inline-flex size-7 items-center justify-center rounded-md text-[#737373] transition hover:bg-[#EFEFEF] hover:text-[#171717] cursor-pointer"
                            >
                              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                                <circle cx="12" cy="5" r="1.6" />
                                <circle cx="12" cy="12" r="1.6" />
                                <circle cx="12" cy="19" r="1.6" />
                              </svg>
                            </button>

                            {openRowMenuId === co.id && (
                              <div
                                role="menu"
                                className="absolute right-4 top-11 z-30 w-52 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-1.5 text-left shadow-lg"
                              >
                                {co.linkedContacts[0] && (
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                      const lc = co.linkedContacts[0];
                                      setOpenRowMenuId(null);
                                      setSelectedContact({
                                        id: lc.id,
                                        initials: lc.initials,
                                        name: lc.name,
                                        role: lc.role,
                                        company: co.name,
                                        email: lc.email,
                                        score: 82,
                                        engagement: 84,
                                        tempLabel: "Chaud",
                                        stage: co.stage,
                                        opportunityValue: co.pipelineValue,
                                      });
                                    }}
                                    className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                                  >
                                    Voir l’interlocuteur principal
                                  </button>
                                )}
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setOpenRowMenuId(null);
                                    openInvoiceForClient(
                                      co.name,
                                      co.linkedContacts[0]?.email || "contact@entreprise.fr"
                                    );
                                  }}
                                  className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                                >
                                  Créer un devis / facture
                                </button>
                                <div className="my-1 h-px bg-[#F0F0F0]" />
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setOpenRowMenuId(null);
                                    setCompanies((prev) =>
                                      prev.filter((item) => item.id !== co.id)
                                    );
                                    notifyCrm("Entreprise supprimée");
                                  }}
                                  className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
                                >
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <CrmPagination page={currentCompanyPage} pages={pagesFor(filteredCompanies.length)} onPage={setCompanyPage} />
          </section>

          {/* New Company Modal */}
          {newCompanyOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
              <div className="w-full max-w-md rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-xl">
                <h3 className="text-[16px] font-bold text-[#171717]">
                  Nouvelle entreprise
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[13px] font-medium text-[#525252]">
                      Raison sociale
                    </label>
                    <input
                      type="text"
                      value={newCompName}
                      onChange={(e) => setNewCompName(e.target.value)}
                      placeholder="Ex: Groupe Horizon"
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#171717]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-medium text-[#525252]">
                        Secteur
                      </label>
                      <PremiumSelect
                        value={newCompSector}
                        onChange={setNewCompSector}
                        ariaLabel="Secteur"
                        className="mt-1"
                        options={[
                          { value: "Nettoyage", label: "Nettoyage" },
                          { value: "Maintenance", label: "Maintenance" },
                          { value: "Services", label: "Services" },
                          { value: "Logistique", label: "Logistique" },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#525252]">
                        Ville
                      </label>
                      <input
                        type="text"
                        value={newCompCity}
                        onChange={(e) => setNewCompCity(e.target.value)}
                        placeholder="Ex: Lyon (69)"
                        className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#171717]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#525252]">
                      Interlocuteur principal
                    </label>
                    <input
                      type="text"
                      value={newCompContact}
                      onChange={(e) => setNewCompContact(e.target.value)}
                      placeholder="Ex: Camille Laurent"
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#171717]"
                    />
                  </div>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] leading-relaxed text-[#525252]">
                    Assurez-vous de disposer d&apos;une base légale valide pour traiter ces données conformément à notre{" "}
                    <Link href="/outreach-policy" className="font-medium text-[#184D3B] hover:underline">
                      Politique de prospection
                    </Link>{" "}
                    et à notre{" "}
                    <Link href="/dpa" className="font-medium text-[#184D3B] hover:underline">
                      Accord DPA
                    </Link>
                    .
                  </p>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCompanyOpen(false)}
                    className="h-9 rounded-lg border border-[#E5E5E5] px-3.5 text-[14px] font-medium text-[#525252] hover:bg-[#F5F5F5]"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCompName.trim()) return;
                      const initials = newCompName
                        .trim()
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase() || "")
                        .join("");
                      const contactName = newCompContact.trim() || "Contact principal";
                      const contactInitials = contactName
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase() || "")
                        .join("");
                      const created: CrmCompany = {
                        id: `crm-e-${Date.now()}`,
                        initials: initials || "EN",
                        name: newCompName.trim(),
                        city: newCompCity.trim() || "Paris (75)",
                        sector: newCompSector,
                        contactsCount: 1,
                        linkedContacts: [
                          {
                            id: `cc-${Date.now()}`,
                            initials: contactInitials || "CP",
                            name: contactName,
                            role: "Décideur",
                            email: "contact@entreprise.fr",
                            color: "#E0F2FE",
                          },
                        ],
                        pipelineAmount: 10000,
                        pipelineValue: "10 000 €",
                        stage: "Qualification",
                      };
                      setCompanies((prev) => [created, ...prev]);
                      setNewCompName("");
                      setNewCompCity("");
                      setNewCompContact("");
                      setNewCompanyOpen(false);
                      notifyCrm("Entreprise ajoutée au CRM");
                    }}
                    className="h-9 rounded-lg bg-[#171717] px-4 text-[14px] font-medium text-white hover:bg-[#262626]"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PIPELINE : liste premium + bascule Kanban */}
      {activeTab === "pipeline" && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
            <p><strong>{deals.filter((deal) => deal.stage !== "won" && deal.stage !== "lost").length}</strong> opportunités ouvertes</p>
            <p><strong>{deals.filter((deal) => deal.stage !== "won" && deal.stage !== "lost").reduce((total, deal) => total + deal.amount, 0).toLocaleString("fr-FR")} €</strong> dans le pipeline ouvert</p>
          </div>
          {historyDeal && (
            <section aria-label={"Historique de " + historyDeal.name} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
              <div className="flex justify-between gap-3"><h3 className="font-semibold">{historyDeal.name} · Historique des étapes</h3><button type="button" onClick={() => setHistoryId(null)}>Fermer</button></div>
              {historyDeal.stageHistory?.length ? <ul className="mt-2 space-y-1">{historyDeal.stageHistory.map((entry, index) => <li key={index}>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" }).format(new Date(entry.date))} · {stageLabel(entry.from)} → {stageLabel(entry.to)}</li>)}</ul> : <p className="mt-2">Aucun changement enregistré pendant cette session.</p>}
              <label className="mt-3 grid w-fit gap-1">Date de relance
                <input type="date" value={historyDeal.followUpDate ?? ""} className="rounded-lg border border-[var(--border)] px-2 py-1.5" onChange={(event) => {
                  const followUpDate = event.target.value;
                  setDeals((previous) => previous.map((item) => item.id === historyDeal.id ? { ...item, followUpDate } : item));
                }} />
              </label>
            </section>
          )}
          {/* Top toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <PremiumSelect
                value={dealStageFilter}
                onChange={(v) => {
                  setDealStageFilter(v);
                  setDealPage(1);
                }}
                ariaLabel="Filtrer les opportunités"
                className="min-w-[195px]"
                options={[
                  { value: "all", label: "Toutes les opportunités" },
                  ...DEAL_STAGES.map((stage) => ({ value: stage.key, label: stage.label })),
                ]}
              />
              <button
                type="button"
                onClick={() => {
                  setDealStageFilter("all");
                  setDealPage(1);
                }}
                className="inline-flex h-9.5 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[14px] font-medium text-[#404040] shadow-2xs transition hover:bg-[#F8F8F8]"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 text-[#737373]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                  <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
                </svg>
                Filtre
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13.5px] text-[#737373]">Trier par</span>
              <PremiumSelect
                value={dealSort}
                onChange={setDealSort}
                ariaLabel="Trier les opportunités"
                className="min-w-[170px]"
                options={[
                  { value: "created", label: "Date de création" },
                  { value: "amount-desc", label: "Montant décroissant" },
                  { value: "amount-asc", label: "Montant croissant" },
                ]}
              />
              <div className="inline-flex h-9.5 items-center rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setPipelineViewMode("kanban")}
                  aria-label="Vue Kanban"
                  className={`inline-flex size-8 items-center justify-center rounded-md transition ${
                    pipelineViewMode === "kanban"
                      ? "bg-[#171717] text-white"
                      : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3" y="4" width="7" height="7" rx="1.2" />
                    <rect x="14" y="4" width="7" height="7" rx="1.2" />
                    <rect x="3" y="14" width="7" height="6" rx="1.2" />
                    <rect x="14" y="14" width="7" height="6" rx="1.2" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setPipelineViewMode("list")}
                  aria-label="Vue Liste"
                  className={`inline-flex size-8 items-center justify-center rounded-md transition ${
                    pipelineViewMode === "list"
                      ? "bg-[#171717] text-white"
                      : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <button
                type="button"
                onClick={() => downloadCsv("autocall-pipeline.csv", [["Opportunité", "Montant", "Étape", "Contact", "Responsable"], ...filteredDeals.map((deal) => [deal.name, deal.amount, stageLabel(deal.stage), deal.contactName, deal.ownerName])])}
                className="inline-flex h-9.5 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[14px] font-medium text-[#171717] shadow-2xs hover:bg-[#F8F8F8]"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 text-[#525252]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Exporter
              </button>
              <button
                type="button"
                onClick={() => { setNewDealStage("new"); setNewDealOpen(true); }}
                className="inline-flex h-9.5 items-center gap-1.5 rounded-lg bg-[#171717] px-3.5 text-[14px] font-medium text-white shadow-xs transition hover:bg-[#262626]"
              >
                + Ajouter une opportunité
              </button>
            </div>
          </div>

          {pipelineViewMode === "list" ? (
            <section className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[13px] font-medium text-[#737373]">
                      <th className="w-11 px-4 py-3">
                        <PremiumCheckbox
                          checked={
                            deals.length > 0 && selectedDealIds.length === deals.length
                          }
                          onChange={(checked) =>
                            setSelectedDealIds(checked ? deals.map((d) => d.id) : [])
                          }
                          ariaLabel="Tout sélectionner"
                        />
                      </th>
                      <th className="px-3 py-3">Nom de l’opportunité</th>
                      <th className="px-3 py-3">Montant (€)</th>
                      <th className="px-3 py-3">Étape</th>
                      <th className="px-3 py-3">Date de clôture</th>
                      <th className="px-3 py-3">Contact</th>
                      <th className="px-3 py-3">Responsable</th>
                      <th className="w-12 px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setNewDealOpen(true)}
                          aria-label="Ajouter une opportunité"
                          className="inline-flex size-6 items-center justify-center rounded-full bg-[#171717] text-[14px] font-semibold text-white hover:bg-[#262626]"
                        >
                          +
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0F0] text-[14px]">
                    {visibleDeals.map((deal) => {
                        const checked = selectedDealIds.includes(deal.id);
                        return (
                          <tr
                            key={deal.id}
                            className="transition-colors hover:bg-[#FAFAFA]"
                          >
                            <td className="px-4 py-3.5">
                              <PremiumCheckbox
                                checked={checked}
                                onChange={() =>
                                  setSelectedDealIds((prev) =>
                                    prev.includes(deal.id)
                                      ? prev.filter((id) => id !== deal.id)
                                      : [...prev, deal.id]
                                  )
                                }
                                ariaLabel={`Sélectionner ${deal.name}`}
                              />
                            </td>
                            <td className="px-3 py-3.5 font-medium text-[#171717]">
                              {deal.name}
                            </td>
                            <td className="px-3 py-3.5 font-medium text-[#171717] tabular-nums">
                              {deal.amount.toLocaleString("fr-FR")} €
                            </td>
                            <td className="px-3 py-3.5">
                              {stageControl(deal)}
                            </td>
                            <td className="px-3 py-3.5 text-[#525252]">
                              {deal.closingDate}
                            </td>
                            <td className="px-3 py-3.5 text-[#262626]">
                              {deal.contactName}
                            </td>
                            <td className="px-3 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] text-[12px] font-semibold text-[#171717]"
                                  style={{ backgroundColor: deal.ownerColor }}
                                >
                                  {deal.ownerInitials}
                                </span>
                                <span className="text-[#262626]">{deal.ownerName}</span>
                              </div>
                            </td>
                            <td className="relative px-4 py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenRowMenuId((prev) =>
                                    prev === deal.id ? null : deal.id
                                  )
                                }
                                aria-label={`Actions ${deal.name}`}
                                aria-expanded={openRowMenuId === deal.id}
                                className="inline-flex size-7 items-center justify-center rounded-md text-[#737373] transition hover:bg-[#EFEFEF] hover:text-[#171717] cursor-pointer"
                              >
                                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                                  <circle cx="12" cy="5" r="1.6" />
                                  <circle cx="12" cy="12" r="1.6" />
                                  <circle cx="12" cy="19" r="1.6" />
                                </svg>
                              </button>

                              {openRowMenuId === deal.id && (
                                <div
                                  role="menu"
                                  className="absolute right-4 top-11 z-30 w-52 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-1.5 text-left shadow-lg"
                                >
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                      advanceDeal(deal);
                                      setOpenRowMenuId(null);
                                      notifyCrm("Étape mise à jour");
                                    }}
                                    className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                                  >
                                    Avancer à l’étape suivante
                                  </button>
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                      setOpenRowMenuId(null);
                                      openInvoiceForClient(
                                        deal.name.split("—")[1]?.trim() || deal.name,
                                        "facturation@client.fr"
                                      );
                                    }}
                                    className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                                  >
                                    Créer un devis / facture
                                  </button>
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                      setOpenRowMenuId(null);
                                      setHistoryId(deal.id);
                                    }}
                                    className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#00775B] hover:bg-[#F3FAF7] cursor-pointer"
                                  >
                                    Planifier une relance
                                  </button>
                                  <div className="my-1 h-px bg-[#F0F0F0]" />
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                      setOpenRowMenuId(null);
                                      setDeals((prev) =>
                                        prev.filter((d) => d.id !== deal.id)
                                      );
                                      notifyCrm("Opportunité supprimée");
                                    }}
                                    className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Clean pagination footer */}
              <CrmPagination page={currentDealPage} pages={pagesFor(filteredDeals.length)} onPage={setDealPage} />
            </section>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-3" aria-label="Pipeline Kanban">
              {DEAL_STAGES.filter((stage) => dealStageFilter === "all" || stage.key === dealStageFilter).map((col) => {
                const colDeals = deals
                  .filter((d) => d.stage === col.key)
                  .sort((a, b) =>
                    dealSort === "amount-desc"
                      ? b.amount - a.amount
                      : dealSort === "amount-asc"
                        ? a.amount - b.amount
                        : 0
                  );
                const totalAmount = colDeals.reduce((acc, d) => acc + d.amount, 0);
                const grandTotal = deals.reduce((acc, d) => acc + d.amount, 0) || 1;
                const sharePct = Math.round((totalAmount / grandTotal) * 100);
                return (
                  <div
                    key={col.key}
                    style={{ minWidth: "16rem" }}
                    className="flex flex-col gap-2.5 rounded-xl border border-[#E5E5E5] bg-[#F7F7F8] p-2.5"
                  >
                    {/* Double-surface column header (style Contacts) */}
                    <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-1.5 shadow-2xs">
                      <div className={`rounded-lg bg-[#F5F5F5] px-3 py-2.5`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span
                              className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] text-[#008F6D] shadow-[0_2px_6px_rgba(23,23,23,0.06)]`}
                            >
                              {col.key === "qualification" ? (
                                <SolarIcon name="acquisition" className="size-4.5" />
                              ) : col.key === "contacted" ? (
                                <SolarIcon name="chart" className="size-4.5" />
                              ) : col.key === "won" ? (
                                <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                  <circle cx="12" cy="12" r="9" />
                                  <path d="m8.5 12.5 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <SolarIcon name="close" className="size-4.5" />
                              )}
                            </span>
                            <h3 className="truncate text-[14px] font-medium text-[#525252]">
                              {col.label}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setNewDealStage(col.key); setNewDealOpen(true); }}
                            aria-label={`Ajouter dans ${col.label}`}
                            title={`Ajouter une opportunité dans ${col.label}`}
                            className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] text-[#171717] shadow-2xs transition hover:border-[#008F6D] hover:bg-[#008F6D] hover:text-white cursor-pointer"
                          >
                            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                        <p className="mt-2 text-[21px] font-semibold tracking-tight text-[#171717] tabular-nums">
                          {totalAmount.toLocaleString("fr-FR")} €
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 px-2 pt-2 pb-0.5 text-[12px]">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium tabular-nums bg-[#E6F7F0] text-[#00775B]`}>
                          {colDeals.length} opportunité{colDeals.length > 1 ? "s" : ""}
                        </span>
                        <span className="font-normal text-[#8C8C8C] tabular-nums">
                          {sharePct} % du pipeline
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2.5">
                      {colDeals.map((deal) => {
                        const checked = selectedDealIds.includes(deal.id);
                        return (
                          <div
                            key={deal.id}
                            className={`rounded-xl border bg-[#FFFFFF] p-3.5 shadow-2xs transition ${
                              checked
                                ? "border-[#008F6D] ring-1 ring-[#008F6D]/15"
                                : "border-[#E5E5E5] hover:border-[#D4D4D4]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2.5">
                              <p className="text-[14px] font-medium leading-snug text-[#171717]">
                                {deal.name}
                              </p>
                              <PremiumCheckbox
                                checked={checked}
                                onChange={() =>
                                  setSelectedDealIds((prev) =>
                                    prev.includes(deal.id)
                                      ? prev.filter((id) => id !== deal.id)
                                      : [...prev, deal.id]
                                  )
                                }
                                ariaLabel={`Sélectionner ${deal.name}`}
                              />
                            </div>
                            <p className="mt-1 text-[13px] font-normal text-[#737373]">
                              {deal.contactName}
                            </p>
                            <div className="mt-2.5 flex items-center justify-between text-[13px] tabular-nums">
                              <span className="font-semibold text-[#171717]">
                                {deal.amount.toLocaleString("fr-FR")} €
                              </span>
                              <span className="text-[12px] font-normal text-[#8C8C8C]">
                                {deal.closingDate}
                              </span>
                            </div>

                            <div className="mt-3">{stageControl(deal)}</div>
                            <div className="mt-3 flex items-center gap-2 border-t border-[#F0F0F0] pt-2.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setHistoryId(deal.id)
                                }
                                aria-label="Aperçu"
                                title="Aperçu de l’opportunité"
                                className="inline-flex size-7 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-[#737373] transition hover:border-[#171717] hover:text-[#171717]"
                              >
                                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                  <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                                  <circle cx="12" cy="12" r="2.2" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  advanceDeal(deal);
                                }}
                                aria-label="Avancer l’étape"
                                title="Avancer vers l’étape suivante"
                                className="inline-flex size-7 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-[#737373] transition hover:border-[#171717] hover:text-[#171717]"
                              >
                                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  openInvoiceForClient(
                                    deal.name.split("—")[1]?.trim() || deal.name,
                                    "facturation@client.fr"
                                  )
                                }
                                aria-label="Créer une facture"
                                title="Créer un devis ou une facture"
                                className="inline-flex size-7 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-[#737373] transition hover:border-[#171717] hover:text-[#171717]"
                              >
                                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                  <rect x="3" y="5" width="18" height="14" rx="2" />
                                  <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setHistoryId(deal.id)
                                }
                                aria-label="Planifier"
                                title="Planifier un rendez-vous"
                                className="inline-flex size-7 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-[#737373] transition hover:border-[#171717] hover:text-[#171717]"
                              >
                                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                  <rect x="3" y="4" width="18" height="17" rx="2" />
                                  <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* New Deal Modal */}
          {newDealOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
              <div className="w-full max-w-md rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-xl">
                <h3 className="text-[16px] font-bold text-[#171717]">
                  Nouvelle opportunité
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[13px] font-medium text-[#525252]">
                      Nom de l’opportunité
                    </label>
                    <input
                      type="text"
                      value={newDealName}
                      onChange={(e) => setNewDealName(e.target.value)}
                      placeholder="Ex: Abonnement annuel — Société Alpha"
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#171717]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-medium text-[#525252]">
                        Montant (€)
                      </label>
                      <input
                        type="number"
                        value={newDealAmount}
                        onChange={(e) => setNewDealAmount(e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#171717]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#525252]">
                        Contact
                      </label>
                      <input
                        type="text"
                        value={newDealContact}
                        onChange={(e) => setNewDealContact(e.target.value)}
                        placeholder="Ex: Marc Vallet"
                        className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] outline-none focus:border-[#171717]"
                      />
                    </div>
                  </div>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] leading-relaxed text-[#525252]">
                    Assurez-vous de disposer d&apos;une base légale valide pour traiter ces données conformément à notre{" "}
                    <Link href="/outreach-policy" className="font-medium text-[#184D3B] hover:underline">
                      Politique de prospection
                    </Link>{" "}
                    et à notre{" "}
                    <Link href="/dpa" className="font-medium text-[#184D3B] hover:underline">
                      Accord DPA
                    </Link>
                    .
                  </p>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewDealOpen(false)}
                    className="h-9 rounded-lg border border-[#E5E5E5] px-3.5 text-[14px] font-medium text-[#525252] hover:bg-[#F5F5F5]"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newDealName.trim() || !newDealAmount.trim() || !Number.isFinite(Number(newDealAmount)) || Number(newDealAmount) < 0) return;
                      const created: PipelineDeal = {
                        id: `deal-${Date.now()}`,
                        name: newDealName.trim(),
                        amount: Number(newDealAmount),
                        stage: newDealStage,
                        closingDate: "15 mai 2025",
                        contactName: newDealContact.trim() || "Contact B2B",
                        ownerName: "Tanjim Islam",
                        ownerInitials: "TI",
                        ownerColor: "#E0F2FE",
                      };
                      setDeals((prev) => [created, ...prev]);
                      setNewDealName("");
                      setNewDealContact("");
                      setNewDealOpen(false);
                      notifyCrm("Opportunité ajoutée au pipeline");
                    }}
                    className="h-9 rounded-lg bg-[#171717] px-4 text-[14px] font-medium text-white hover:bg-[#262626]"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEVIS & FACTURES */}
      {activeTab === "invoices" && composerOpen && (
        <div className="mt-6">
          <InvoiceEditor
            initialClient={clientName}
            initialEmail={clientEmail}
            nextNumber={`FAC-2026-0${16 + invoices.length}`}
            onBack={() => setComposerOpen(false)}
            onSave={handleSaveFromEditor}
          />
        </div>
      )}

      {activeTab === "invoices" && !composerOpen && (
        <div className="mt-4 space-y-4">
          {/* 4 KPI Facturation double surface */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2">
              <div className="rounded-lg bg-[var(--surface-inset)] px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="card" className="size-4.5" />
                  </span>
                  <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                    Encaissé ce mois
                  </p>
                </div>
                <p className="mt-1.5 text-[24px] font-semibold text-[var(--foreground)] tabular-nums">
                  3 100 €
                </p>
              </div>
              <p className="px-2 pt-2 pb-0.5 text-[13px] font-medium text-[var(--success)]">
                ↗ +14,2 %
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2">
              <div className="rounded-lg bg-[var(--surface-inset)] px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="mail" className="size-4.5" />
                  </span>
                  <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                    Devis envoyés
                  </p>
                </div>
                <p className="mt-1.5 text-[24px] font-semibold text-[var(--foreground)] tabular-nums">
                  4 200 €
                </p>
              </div>
              <p className="px-2 pt-2 pb-0.5 text-[13px] font-medium text-[var(--text-muted)]">
                En attente de signature
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2">
              <div className="rounded-lg bg-[var(--surface-inset)] px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                    En retard
                  </p>
                </div>
                <p className="mt-1.5 text-[24px] font-semibold text-[var(--foreground)] tabular-nums">
                  1 850 €
                </p>
              </div>
              <p className="px-2 pt-2 pb-0.5 text-[13px] font-medium text-[var(--danger)]">
                1 facture à relancer
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2">
              <div className="rounded-lg bg-[var(--surface-inset)] px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="settings" className="size-4.5" />
                  </span>
                  <p className="text-[13.5px] font-medium text-[var(--text-secondary)]">
                    Brouillons
                  </p>
                </div>
                <p className="mt-1.5 text-[24px] font-semibold text-[var(--foreground)] tabular-nums">
                  {invoices.filter((i) => i.status === "draft").length}
                </p>
              </div>
              <p className="px-2 pt-2 pb-0.5 text-[13px] font-medium text-[var(--text-muted)]">
                Prêts à envoyer
              </p>
            </div>
          </div>

          {/* Barre de filtres Factures */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4 border-b border-[#E5E5E5]">
              {(
                [
                  { id: "all" as const, label: "Toutes", count: invoices.length },
                  {
                    id: "draft" as const,
                    label: "Brouillons",
                    count: invoices.filter((i) => i.status === "draft").length,
                  },
                  {
                    id: "sent" as const,
                    label: "Envoyées",
                    count: invoices.filter((i) => i.status === "sent").length,
                  },
                  {
                    id: "overdue" as const,
                    label: "En retard",
                    count: invoices.filter((i) => i.status === "overdue").length,
                  },
                  {
                    id: "paid" as const,
                    label: "Payées",
                    count: invoices.filter((i) => i.status === "paid").length,
                  },
                ] as const
              ).map((ft) => {
                const active = invoiceFilter === ft.id;
                return (
                  <button
                    key={ft.id}
                    type="button"
                    onClick={() => setInvoiceFilter(ft.id)}
                    className={`relative flex items-center gap-1.5 pb-2.5 text-[14px] transition-colors cursor-pointer ${
                      active
                        ? "font-semibold text-[#171717]"
                        : "font-medium text-[#737373] hover:text-[#171717]"
                    }`}
                  >
                    <span>{ft.label}</span>
                    <span className="rounded-full bg-[#EFEFEF] px-1.5 py-0.5 text-[12px] text-[#525252] tabular-nums">
                      {ft.count}
                    </span>
                    {active && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#008F6D]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="search"
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                placeholder="Rechercher N°, client..."
                aria-label="Rechercher une facture"
                className="h-9 w-56 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[14px] text-[#171717] placeholder:text-[#737373] outline-none focus:border-[#008F6D]"
              />
            </div>
          </div>

          {/* Liste des factures et devis */}
          <section className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA] text-[13px] font-medium text-[#737373]">
                    <th className="px-4 py-3">Numéro</th>
                    <th className="px-3 py-3">Client</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Création &amp; Échéance</th>
                    <th className="px-3 py-3">Montant TTC</th>
                    <th className="px-3 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0] text-[14px]">
                  {invoices
                    .filter((inv) => {
                      const matchStatus =
                        invoiceFilter === "all" || inv.status === invoiceFilter;
                      const q = invoiceSearch.trim().toLowerCase();
                      const matchQ =
                        !q ||
                        inv.number.toLowerCase().includes(q) ||
                        inv.client.toLowerCase().includes(q) ||
                        inv.email.toLowerCase().includes(q);
                      return matchStatus && matchQ;
                    })
                    .map((inv) => {
                      const st = invoiceStatusStyles[inv.status];
                      const iconTint =
                        inv.status === "paid"
                          ? "bg-[#E6F5F0] text-[#008F6D]"
                          : inv.status === "overdue"
                            ? "bg-[#FEF2F2] text-[#DC2626]"
                            : inv.status === "draft"
                              ? "bg-[#EFF6FF] text-[#2563EB]"
                              : "bg-[#F3E8FF] text-[#7C3AED]";
                      const initials = inv.client
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase() || "")
                        .join("");
                      return (
                        <tr
                          key={inv.id}
                          onClick={() => setSelectedInvoice(inv)}
                          className="cursor-pointer transition-colors hover:bg-[#FAFAFA]"
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ${iconTint}`}
                              >
                                <SolarIcon name="card" className="size-4" />
                              </span>
                              <div>
                                <p className="font-semibold text-[#171717] tabular-nums">
                                  #{inv.number}
                                </p>
                                <p className="text-[12px] text-[#737373]">{inv.kind}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F5F5F5] text-[12px] font-semibold text-[#171717]">
                                {initials}
                              </span>
                              <span className="font-medium text-[#171717]">
                                {inv.client}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-3.5">
                            <p className="text-[13.5px] text-[#525252]">{inv.email}</p>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(inv.email);
                                  notifyCrm("Adresse email copiée");
                                } catch {
                                  notifyCrm("Impossible de copier l’adresse email.");
                                }
                              }}
                              className="mt-0.5 text-[12px] font-medium text-[#008F6D] hover:underline cursor-pointer"
                            >
                              Copier
                            </button>
                          </td>
                          <td className="px-3 py-3.5 text-[13.5px] text-[#525252]">
                            {inv.date} – {inv.dueDate}
                          </td>
                          <td className="px-3 py-3.5 font-semibold text-[#171717] tabular-nums">
                            {inv.amountTtc.toLocaleString("fr-FR")} €
                          </td>
                          <td className="px-3 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-md px-2.5 py-1 text-[12.5px] font-medium ${st.cls}`}
                            >
                              {st.label[locale]}
                            </span>
                          </td>
                          <td
                            className="relative px-4 py-3.5 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setOpenRowMenuId((prev) =>
                                  prev === inv.id ? null : inv.id
                                )
                              }
                              aria-label={`Actions ${inv.number}`}
                              className="inline-flex size-7 items-center justify-center rounded-md text-[#737373] transition hover:bg-[#EFEFEF] hover:text-[#171717] cursor-pointer"
                            >
                              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                                <circle cx="12" cy="5" r="1.6" />
                                <circle cx="12" cy="12" r="1.6" />
                                <circle cx="12" cy="19" r="1.6" />
                              </svg>
                            </button>

                            {openRowMenuId === inv.id && (
                              <div
                                role="menu"
                                className="absolute right-4 top-11 z-30 w-48 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-1.5 text-left shadow-lg"
                              >
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setOpenRowMenuId(null);
                                    setSelectedInvoice(inv);
                                  }}
                                  className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                                >
                                  Voir la facture
                                </button>
                                {inv.status === "draft" && (
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                      setOpenRowMenuId(null);
                                      updateInvoiceStatus(inv.id, "sent");
                                      notifyCrm("Envoi simulé dans la démonstration.");
                                    }}
                                    className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                                  >
                                    Envoyer au client
                                  </button>
                                )}
                                {(inv.status === "sent" || inv.status === "overdue") && (
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                      setOpenRowMenuId(null);
                                      updateInvoiceStatus(inv.id, "paid");
                                      notifyCrm("Facture marquée comme payée");
                                    }}
                                    className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#00775B] hover:bg-[#F3FAF7] cursor-pointer"
                                  >
                                    Marquer comme payée
                                  </button>
                                )}
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={async () => {
                                    setOpenRowMenuId(null);
                                    try {
                                      await navigator.clipboard.writeText(inv.number);
                                      notifyCrm("Référence du document copiée");
                                    } catch {
                                      notifyCrm("Impossible de copier la référence.");
                                    }
                                  }}
                                  className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                                >
                                  Copier la référence
                                </button>
                                <div className="my-1 h-px bg-[#F0F0F0]" />
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setOpenRowMenuId(null);
                                    setInvoices((prev) =>
                                      prev.filter((item) => item.id !== inv.id)
                                    );
                                    notifyCrm("Document supprimé");
                                  }}
                                  className="flex h-8 w-full items-center rounded-lg px-2.5 text-[13.5px] font-medium text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
                                >
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Modal Aperçu Facture */}
          {selectedInvoice && (
            <div
              onClick={() => setSelectedInvoice(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[1.5px]"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label={`Aperçu ${selectedInvoice.number}`}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[92dvh] w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-[#E5E5E5] bg-[#FAFAFA] px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[14px] font-semibold text-[#171717]">
                      {selectedInvoice.kind} #{selectedInvoice.number}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-medium ${invoiceStatusStyles[selectedInvoice.status].cls}`}
                    >
                      {invoiceStatusStyles[selectedInvoice.status].label[locale]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => downloadCsv(`${selectedInvoice.number}.csv`, [["Référence", "Type", "Client", "Date", "Échéance", "TTC", "Statut"], [selectedInvoice.number, selectedInvoice.kind, selectedInvoice.client, selectedInvoice.date, selectedInvoice.dueDate, selectedInvoice.amountTtc, invoiceStatusStyles[selectedInvoice.status].label[locale]]])}
                      className="inline-flex h-8 items-center rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[13px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                    >
                      Exporter CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(null)}
                      aria-label="Fermer l’aperçu"
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] text-[#525252] hover:bg-[#F5F5F5] cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[22px] font-bold tracking-tight text-[#171717]">
                        {selectedInvoice.kind}
                      </h3>
                      <p className="mt-0.5 font-mono text-[14px] text-[#737373]">
                        #{selectedInvoice.number}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 96 96"
                        className="size-6 text-[#171717]"
                        fill="currentColor"
                      >
                        <path d="M48 84 A36 36 0 1 1 84 48 L84 84 A22 22 0 0 1 62 62 L62 48 A14 14 0 1 0 48 62 Z" />
                      </svg>
                      <span className="text-[16px] font-bold tracking-tight text-[#171717]">
                        AutoCall
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-6 border-y border-[#F0F0F0] py-4 text-[13.5px]">
                    <div>
                      <p className="text-[12px] text-[#8C8C8C]">Émetteur</p>
                      <p className="mt-1 font-semibold text-[#171717]">AutoCall SAS</p>
                      <p className="text-[#525252]">14 avenue de l’Opéra, 75001 Paris</p>
                      <p className="text-[#525252]">facturation@autocall.ai</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] text-[#8C8C8C]">Client</p>
                      <p className="mt-1 font-semibold text-[#171717]">
                        {selectedInvoice.client}
                      </p>
                      <p className="text-[#525252]">{selectedInvoice.email}</p>
                      <p className="mt-1 text-[12.5px] text-[#737373]">
                        Émise le {selectedInvoice.date} · Échéance {selectedInvoice.dueDate}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-xl border border-[#F0F0F0]">
                    <table className="w-full border-collapse text-left text-[13.5px]">
                      <thead>
                        <tr className="bg-[#FAFAFA] text-[12.5px] font-medium text-[#737373]">
                          <th className="px-4 py-2.5">Prestation</th>
                          <th className="px-3 py-2.5 text-center">Qté</th>
                          <th className="px-4 py-2.5 text-right">Montant TTC</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F5F5F5]">
                        <tr>
                          <td className="px-4 py-3 font-medium text-[#171717]">
                            Suite Agents Vocaux IA &amp; Synchronisation CRM
                          </td>
                          <td className="px-3 py-3 text-center text-[#525252]">1</td>
                          <td className="px-4 py-3 text-right font-semibold text-[#171717] tabular-nums">
                            {selectedInvoice.amountTtc.toLocaleString("fr-FR")} €
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#F0F0F0] pt-4">
                    <span className="text-[13.5px] font-semibold text-[#171717]">
                      Montant total TTC
                    </span>
                    <span className="text-[20px] font-bold text-[#171717] tabular-nums">
                      {selectedInvoice.amountTtc.toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0F0F0] pt-4">
                    <div className="text-[13px] text-[#737373]">
                      IBAN : <span className="font-mono text-[#171717]">FR76 3000 6000 0112 3456 7890 189</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedInvoice.status !== "paid" && (
                        <button
                          type="button"
                          onClick={() => {
                            updateInvoiceStatus(selectedInvoice.id, "paid");
                            setSelectedInvoice({ ...selectedInvoice, status: "paid" });
                            notifyCrm("Facture marquée comme payée");
                          }}
                          className="h-9 rounded-lg bg-[#00B489] px-4 text-[13.5px] font-medium text-white hover:bg-[#009E78] cursor-pointer"
                        >
                          Marquer comme payée
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const client = selectedInvoice.client;
                          const email = selectedInvoice.email;
                          setSelectedInvoice(null);
                          openInvoiceForClient(client, email);
                        }}
                        className="h-9 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 text-[13.5px] font-medium text-[#171717] hover:bg-[#F5F5F5] cursor-pointer"
                      >
                        Dupliquer / Éditer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

