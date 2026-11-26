"use client";

import { useState } from "react";
import { PremiumSelect } from "./premium-select";
import { type Locale, SolarIcon } from "./workspace-navigation";

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: "open" | "in_progress" | "resolved";
  updatedAt: string;
  description?: string;
}

const guides: {
  id: string;
  icon: "agents" | "phone" | "card" | "crm";
  tintBg: string;
  tintFg: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
}[] = [
  {
    id: "g1",
    icon: "agents",
    tintBg: "#F0E8FC",
    tintFg: "#8760C4",
    title: {
      fr: "Configurer un agent vocal IA",
      en: "Configure an AI voice agent",
      es: "Configurar un agente de voz IA",
    },
    summary: {
      fr: "Voix, consignes, base de connaissances et test avant mise en production.",
      en: "Voice, instructions, knowledge base, and pre-launch testing.",
      es: "Voz, instrucciones, base de conocimientos y pruebas previas.",
    },
  },
  {
    id: "g2",
    icon: "phone",
    tintBg: "#DEF5EC",
    tintFg: "#008064",
    title: {
      fr: "Téléphonie, numéros & routage",
      en: "Telephony, numbers & routing",
      es: "Telefonía, números y enrutamiento",
    },
    summary: {
      fr: "Appels entrants/sortants, horaires d’ouverture et transfert humain.",
      en: "Inbound/outbound calls, business hours, and human handoff.",
      es: "Llamadas entrantes/salientes, horarios y transferencia humana.",
    },
  },
  {
    id: "g3",
    icon: "crm",
    tintBg: "#E4EEFE",
    tintFg: "#4073C5",
    title: {
      fr: "Importer et qualifier vos prospects",
      en: "Import and qualify leads",
      es: "Importar y calificar prospectos",
    },
    summary: {
      fr: "Import CSV, dédoublonnage et synchronisation avec votre CRM.",
      en: "CSV import, deduplication, and CRM synchronization.",
      es: "Importación CSV, deduplicación y sincronización CRM.",
    },
  },
  {
    id: "g4",
    icon: "card",
    tintBg: "#FFF0D6",
    tintFg: "#B7791F",
    title: {
      fr: "Crédits, quotas & facturation",
      en: "Credits, quotas & billing",
      es: "Créditos, cuotas y facturación",
    },
    summary: {
      fr: "Suivi de consommation, recharges et changement de formule.",
      en: "Usage tracking, top-ups, and plan upgrades.",
      es: "Seguimiento de consumo, recargas y cambio de plan.",
    },
  },
];

const initialTickets: SupportTicket[] = [
  {
    id: "TK-1042",
    subject: "Synchronisation OAuth HubSpot expirée",
    category: "Intégrations",
    status: "in_progress",
    updatedAt: "Il y a 2 h",
  },
  {
    id: "TK-1038",
    subject: "Portabilité numéro standard Paris (+33 1)",
    category: "Téléphonie",
    status: "resolved",
    updatedAt: "Hier",
  },
];

const guideDestinations: Record<string, string> = { g1: "agents", g2: "conversations", g3: "crm", g4: "settings" };
const guideSteps: Record<string, string[]> = {
  g1: ["Dans Agents IA, ouvre Mes agents et sélectionne Configurer.", "Renseigne l’identité et les consignes, puis vérifie les connaissances et les permissions.", "Ouvre Tests & simulations pour prévisualiser un scénario."],
  g2: ["Dans Communications, ouvre Appels et téléphonie.", "Ouvre Composer un numéro pour essayer le clavier de démonstration.", "Dans Paramètres, ouvre Téléphonie pour consulter les horaires et tester le routage."],
  g3: ["Dans le CRM, ouvre Contacts et recherche une personne par son nom ou son entreprise.", "Ouvre sa fiche pour consulter sa source, sa qualification et les notes disponibles.", "L’import CSV réel reste à intégrer."],
  g4: ["Dans Paramètres, ouvre Crédits et consommations pour consulter les soldes par ressource.", "Choisis les packs et vérifie le montant indicatif du panier.", "Abonnement et facturation présente les offres et les factures de démonstration."],
};

const supportCopy: Record<
  Locale,
  {
    heading: string;
    subheading: string;
    docsTitle: string;
    searchDocs: string;
    noDocs: string;
    ticketsTitle: string;
    newTicket: string;
    cancel: string;
    subjectPlaceholder: string;
    categoryLabel: string;
    messagePlaceholder: string;
    submitTicket: string;
    categories: string[];
    statuses: Record<SupportTicket["status"], string>;
    diagTitle: string;
    diagDesc: string;
    diagActive: string;
    diagInactive: string;
  }
> = {
  fr: {
    heading: "Aide & support technique",
    subheading:
      "Consultez la documentation vérifiée ou ouvrez un ticket auprès de notre équipe technique.",
    docsTitle: "Documentation approuvée",
    searchDocs: "Rechercher dans la documentation...",
    noDocs: "Aucun guide ne correspond à votre recherche.",
    ticketsTitle: "Mes tickets support",
    newTicket: "Nouveau ticket",
    cancel: "Annuler",
    subjectPlaceholder: "Sujet de votre demande",
    categoryLabel: "Catégorie",
    messagePlaceholder: "Décrivez le comportement constaté...",
    submitTicket: "Envoyer le ticket",
    categories: ["Téléphonie", "Agents IA", "Intégrations", "Facturation"],
    statuses: {
      open: "Ouvert",
      in_progress: "En cours",
      resolved: "Résolu",
    },
    diagTitle: "Accès diagnostic temporaire (30 min)",
    diagDesc:
      "Autorise l’équipe support à consulter vos journaux en lecture seule pendant 30 minutes. Révocable à tout moment.",
    diagActive: "Actif — lecture seule autorisée (30 min)",
    diagInactive: "Désactivé par défaut",
  },
  en: {
    heading: "Help & technical support",
    subheading:
      "Browse verified documentation or open a ticket with our technical team.",
    docsTitle: "Approved documentation",
    searchDocs: "Search documentation...",
    noDocs: "No guide matches your search.",
    ticketsTitle: "My support tickets",
    newTicket: "New ticket",
    cancel: "Cancel",
    subjectPlaceholder: "Subject of your request",
    categoryLabel: "Category",
    messagePlaceholder: "Describe the issue you observed...",
    submitTicket: "Submit ticket",
    categories: ["Telephony", "AI Agents", "Integrations", "Billing"],
    statuses: {
      open: "Open",
      in_progress: "In progress",
      resolved: "Resolved",
    },
    diagTitle: "Temporary diagnostic access (30 min)",
    diagDesc:
      "Allows support to inspect your logs in read-only mode for 30 minutes. Revocable at any time.",
    diagActive: "Active — read-only access granted (30 min)",
    diagInactive: "Disabled by default",
  },
  es: {
    heading: "Ayuda y soporte técnico",
    subheading:
      "Consulta la documentación verificada o abre un ticket con nuestro equipo técnico.",
    docsTitle: "Documentación aprobada",
    searchDocs: "Buscar en la documentación...",
    noDocs: "Ninguna guía coincide con tu búsqueda.",
    ticketsTitle: "Mis tickets de soporte",
    newTicket: "Nuevo ticket",
    cancel: "Cancelar",
    subjectPlaceholder: "Asunto de tu solicitud",
    categoryLabel: "Categoría",
    messagePlaceholder: "Describe el problema observado...",
    submitTicket: "Enviar ticket",
    categories: ["Telefonía", "Agentes IA", "Integraciones", "Facturación"],
    statuses: {
      open: "Abierto",
      in_progress: "En curso",
      resolved: "Resuelto",
    },
    diagTitle: "Acceso de diagnóstico temporal (30 min)",
    diagDesc:
      "Permite al soporte consultar tus registros en solo lectura durante 30 minutos. Revocable en cualquier momento.",
    diagActive: "Activo — solo lectura autorizada (30 min)",
    diagInactive: "Desactivado por defecto",
  },
};

const ticketStatusStyles: Record<SupportTicket["status"], string> = {
  open: "bg-[#DBEAFE] text-[#1D4ED8]",
  in_progress: "bg-[#FEF3C7] text-[#B45309]",
  resolved: "bg-[#DCFCE7] text-[#15803D]",
};

export function SupportView({ locale, onNavigate }: { locale: Locale; onNavigate?: (id: string) => void }) {
  const t = supportCopy[locale];
  const [docQuery, setDocQuery] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [formOpen, setFormOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(t.categories[0]);
  const [description, setDescription] = useState("");
  const [diagnosticEnabled, setDiagnosticEnabled] = useState(false);

  const filteredGuides = guides.filter((g) => {
    const q = docQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      g.title[locale].toLowerCase().includes(q) ||
      g.summary[locale].toLowerCase().includes(q)
    );
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    const newItem: SupportTicket = {
      id: `TK-${1043 + tickets.length}`,
      subject: subject.trim(),
      description: description.trim(),
      category,
      status: "open",
      updatedAt: locale === "fr" ? "À l’instant" : locale === "es" ? "Ahora" : "Just now",
    };
    setTickets((prev) => [newItem, ...prev]);
    setSubject("");
    setDescription("");
    setFormOpen(false);
  };

  return (
    <div className="@container w-full min-w-0 px-4 py-6 sm:px-7">
      <div className="mb-6">
        <h2 className="text-[24px] font-semibold tracking-[-0.025em] text-[#171717]">
          {t.heading}
        </h2>
        <p className="mt-1.5 text-[14.5px] text-[#525252]">{t.subheading}</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 @min-[62rem]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Colonne gauche : Documentation */}
        <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-[15px] font-semibold text-[#171717]">
              {t.docsTitle}
            </h3>
            <label className="relative flex items-center">
              <SolarIcon
                name="search"
                className="pointer-events-none absolute left-3 size-4 text-[#8C8C8C]"
              />
              <input
                type="search"
                value={docQuery}
                onChange={(e) => setDocQuery(e.target.value)}
                placeholder={t.searchDocs}
                aria-label={t.searchDocs}
                className="h-9.5 w-full rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] pr-3 pl-9 text-[13.5px] text-[#171717] placeholder:text-[#8C8C8C] focus:border-[#A3A3A3] focus:bg-white focus:outline-none sm:w-60"
              />
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {filteredGuides.length === 0 ? (
              <p className="col-span-full py-6 text-center text-[14px] text-[#737373]">
                {t.noDocs}
              </p>
            ) : (
              filteredGuides.map((guide) => (
                <details
                  key={guide.id}
                  className="rounded-xl border border-[#EFEFEF] bg-white p-4 transition-colors hover:border-[#E5E5E5] hover:bg-[#FAFAFA]"
                >
                  <summary className="cursor-pointer text-sm font-semibold">{guide.title[locale]}</summary>
                  <span className="inline-flex size-8 items-center justify-center rounded-xl border border-[#ECECEC] bg-white shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                    <span
                      className="inline-flex size-5 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: guide.tintBg,
                        color: guide.tintFg,
                      }}
                    >
                      <SolarIcon name={guide.icon} className="size-3.5" />
                    </span>
                  </span>
                  <p className="mt-1 text-[14px] leading-5 text-[#525252]">
                    {guide.summary[locale]}
                  </p>
                  {locale === "fr" && <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">{guideSteps[guide.id].map((step) => <li key={step}>{step}</li>)}</ol>}
                  {onNavigate && <button type="button" className="mt-3 text-sm font-medium text-[#00775B] underline" onClick={() => onNavigate(guideDestinations[guide.id])}>{locale === "fr" ? "Ouvrir le module" : locale === "es" ? "Abrir el módulo" : "Open module"}</button>}
                </details>
              ))
            )}
          </div>
        </section>

        {/* Colonne droite : Tickets + Diagnostic */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[15px] font-semibold text-[#171717]">
                {t.ticketsTitle}
              </h3>
              <button
                type="button"
                onClick={() => setFormOpen((prev) => !prev)}
                aria-expanded={formOpen}
                className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-lg bg-[#171717] px-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#2E2E2E] cursor-pointer"
              >
                {formOpen ? t.cancel : t.newTicket}
              </button>
            </div>
            <p className="mt-2 text-xs text-[#737373]">{locale === "fr" ? "Démonstration · Les tickets restent dans cette session." : locale === "es" ? "Demostración · Los tickets se conservan en esta sesión." : "Demo · Tickets are kept in this session."}</p>

            {formOpen && (
              <form
                onSubmit={handleCreateTicket}
                className="mt-4 space-y-3 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4"
              >
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t.subjectPlaceholder}
                  aria-label={t.subjectPlaceholder}
                  required
                  className="h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-[13.5px] text-[#171717] placeholder:text-[#8C8C8C] focus:border-[#A3A3A3] focus:outline-none"
                />
                <PremiumSelect
                  value={category}
                  onChange={setCategory}
                  ariaLabel={t.categoryLabel}
                  options={t.categories.map((cat) => ({ value: cat, label: cat }))}
                />
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  aria-label={t.messagePlaceholder}
                  required
                  className="w-full rounded-lg border border-[#E5E5E5] bg-white p-3 text-[13.5px] text-[#171717] placeholder:text-[#8C8C8C] focus:border-[#A3A3A3] focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex h-9.5 w-full items-center justify-center rounded-lg bg-[#171717] text-[13.5px] font-medium text-white transition-colors hover:bg-[#2E2E2E] cursor-pointer"
                >
                  {locale === "fr" ? "Créer le ticket de démonstration" : locale === "es" ? "Crear ticket de demostración" : "Create demo ticket"}
                </button>
              </form>
            )}

            <ul className="mt-4 space-y-2.5">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[#EFEFEF] p-3.5"
                >
                  <details className="min-w-0 flex-[1_1_12rem]">
                    <summary className="cursor-pointer break-words text-[14px] font-medium text-[#171717]">
                      {ticket.subject}
                    </summary>
                    <p className="mt-1 text-[13.5px] text-[#737373]">
                      {ticket.id} · {ticket.category} · {ticket.updatedAt}
                    </p>
                    {ticket.description && <p className="mt-2 whitespace-pre-wrap break-words text-sm">{ticket.description}</p>}
                  </details>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-md px-2.5 py-0.5 text-[13px] font-medium ${ticketStatusStyles[ticket.status]}`}
                  >
                    {t.statuses[ticket.status]}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Bloc diagnostic lecture seule 30 min */}
          <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-2xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[14.5px] font-semibold text-[#171717]">
                  {t.diagTitle}
                </h3>
                <p className="mt-1 text-[14px] leading-5 text-[#525252]">
                  {t.diagDesc}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={diagnosticEnabled}
                aria-label={t.diagTitle}
                onClick={() => setDiagnosticEnabled((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                  diagnosticEnabled ? "bg-[var(--brand-primary)]" : "bg-[#E5E5E5]"
                }`}
              >
                <span
                  className={`inline-block size-4.5 transform rounded-full bg-white shadow-xs transition-transform ${
                    diagnosticEnabled ? "translate-x-5.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p
              className={`mt-3 text-[14px] font-medium ${
                diagnosticEnabled ? "text-[#15803D]" : "text-[#737373]"
              }`}
            >
              {diagnosticEnabled ? (locale === "fr" ? "Diagnostic simulé · Aucun accès accordé" : locale === "es" ? "Diagnóstico simulado · Sin acceso concedido" : "Simulated diagnostics · No access granted") : t.diagInactive}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

