"use client";

import { useState } from "react";
import { PremiumCheckbox } from "./premium-checkbox";
import { PremiumSelect } from "./premium-select";
import { type Locale, SolarIcon } from "./workspace-navigation";
import {
  type AlertRecord,
  companiesData,
  type CompanyRecord,
  contactsData,
  initialAlertsData,
  type OfferRecord,
  offersData,
} from "./acquisition/acquisition-data";
import {
  CompanyDetailDrawer,
  ContactDetailDrawer,
  OfferDetailDrawer,
} from "./acquisition/acquisition-drawers";

type AcquisitionTab = "companies" | "contacts" | "offers" | "alerts";

const INITIAL_CREDITS = 850;
const ENRICHMENT_COST = 5;
const normalize = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

const tabLabels: Record<Locale, Record<AcquisitionTab, string>> = {
  fr: {
    companies: "Entreprises",
    contacts: "Contacts",
    offers: "Offres et signaux",
    alerts: "Alertes",
  },
  en: {
    companies: "Companies",
    contacts: "Contacts",
    offers: "Jobs and signals",
    alerts: "Alerts",
  },
  es: {
    companies: "Empresas",
    contacts: "Contactos",
    offers: "Ofertas y señales",
    alerts: "Alertas",
  },
};

export function AcquisitionView({ locale }: { locale: Locale }) {
  const [activeTab, setActiveTab] = useState<AcquisitionTab>("companies");

  // Entreprises state
  const [aiQuery, setAiQuery] = useState("");
  const [queryFeedback, setQueryFeedback] = useState("");
  const [headcountRange, setHeadcountRange] = useState<[number, number] | null>(null);
  const [selection, setSelection] = useState<string[]>([]);
  const [companySearch, setCompanySearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [minScore, setMinScore] = useState(0);
  const [onlyHiring, setOnlyHiring] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyRecord | null>(
    null,
  );
  const [crmAddedIds, setCrmAddedIds] = useState<Record<string, boolean>>({});

  // Contacts state
  const [enrichedIds, setEnrichedIds] = useState<string[]>([]);
  const [pendingEnrichment, setPendingEnrichment] = useState<string | null>(null);
  const credits = INITIAL_CREDITS - enrichedIds.length * ENRICHMENT_COST;
  const contacts = contactsData.map((contact) => enrichedIds.includes(contact.id) ? {
    ...contact,
    emailStatus: "verified" as const,
    emailSample: contact.emailSample ?? normalize(contact.name).replace(/\s+/g, ".") + "@example.invalid",
  } : contact);
  const [contactSearch, setContactSearch] = useState("");
  const [contactCompanyFilter, setContactCompanyFilter] = useState("all");
  const [contactDeptFilter, setContactDeptFilter] = useState("all");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const selectedContact = contacts.find((contact) => contact.id === selectedContactId);

  // Offres state
  const [offerSearch, setOfferSearch] = useState("");
  const [offerCityFilter, setOfferCityFilter] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState<OfferRecord | null>(null);

  // Alertes state
  const [alerts, setAlerts] = useState<AlertRecord[]>(initialAlertsData);
  const [editingAlert, setEditingAlert] = useState<AlertRecord | "new" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertPreview, setAlertPreview] = useState<number | null>(null);
  const [offerSort, setOfferSort] = useState("score");
  const openAlertForm = () => {
    setAlertMessage("");
    setAlertPreview(null);
    setEditingAlert("new");
    setActiveTab("alerts");
  };
  const previewAlert = (form: HTMLFormElement) => {
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const keywords = normalize(String(fields.get("criteria") ?? "")).trim().split(/\s+/).filter(Boolean);
    const location = normalize(String(fields.get("location") ?? "")).trim();
    const matchAll = fields.get("keywordMode") === "all";
    setAlertPreview(offersData.filter((offer) => {
      if (location && location !== "france" && !normalize(offer.city).includes(location)) return false;
      const text = normalize([offer.title, offer.companyName, ...offer.skills].join(" "));
      const matches = (keyword: string) => text.includes(keyword);
      return keywords.length > 0 && (matchAll ? keywords.every(matches) : keywords.some(matches));
    }).length);
  };
  const saveAlert = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const criteria = String(form.get("criteria") ?? "").trim();
    if (!title || !criteria) return;
    const existing = editingAlert === "new" ? null : editingAlert;
    const alert: AlertRecord = {
      id: existing?.id ?? crypto.randomUUID(),
      title,
      criteria,
      frequency: String(form.get("frequency")),
      newMatches: existing?.newMatches ?? 0,
      active: existing?.active ?? true,
      keywordMode: form.get("keywordMode") === "all" ? "all" : "any",
      location: String(form.get("location") ?? "").trim(),
      inApp: form.has("inApp"),
      email: form.has("email"),
      monthlyLimit: Number(form.get("monthlyLimit")),
    };
    setAlerts((previous) => existing
      ? previous.map((entry) => entry.id === alert.id ? alert : entry)
      : [...previous, alert]);
    setEditingAlert(null);
    setAlertMessage("Alerte enregistrée pour cette session de démonstration.");
  };

  const filteredCompanies = companiesData.filter((c) => {
    if (cityFilter !== "all" && c.city !== cityFilter) return false;
    if (sectorFilter !== "all" && c.sector !== sectorFilter) return false;
    if (sizeFilter !== "all" && c.size !== sizeFilter) return false;
    if (headcountRange) {
      const [min, max] = c.size.split("–").map(Number);
      if (max < headcountRange[0] || min > headcountRange[1]) return false;
    }
    if (c.score < minScore) return false;
    if (onlyHiring && !c.activeHiring) return false;
    const q = companySearch.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const filteredContacts = contacts.filter((ct) => {
    if (contactCompanyFilter !== "all" && ct.companyId !== contactCompanyFilter)
      return false;
    if (contactDeptFilter !== "all" && ct.department !== contactDeptFilter)
      return false;
    const q = contactSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      ct.name.toLowerCase().includes(q) ||
      ct.role.toLowerCase().includes(q) ||
      ct.companyName.toLowerCase().includes(q)
    );
  });

  const filteredOffers = offersData.filter((o) => {
    if (offerCityFilter !== "all" && o.city !== offerCityFilter) return false;
    const q = offerSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      o.title.toLowerCase().includes(q) ||
      o.companyName.toLowerCase().includes(q) ||
      o.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  if (offerSort === "score") filteredOffers.sort((a, b) => b.score - a.score);

  const handleAnalyzeQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    const query = normalize(aiQuery);
    const matches = (value: string) => new RegExp("\\b" + normalize(value) + "\\b").test(query);
    const city = companiesData.map((company) => company.city).find(matches);
    const sector = companiesData.map((company) => company.sector).find(matches);
    const range = query.match(/(\d+)\s*(?:et|a|[-–])\s*(\d+)\s*(?:salaries|employes)/);
    const headcount = range ? [Math.min(Number(range[1]), Number(range[2])), Math.max(Number(range[1]), Number(range[2]))] as [number, number] : null;
    const hiring = /\b(?:recrut\w*|embauch\w*)\b/.test(query);
    if (!city && !sector && !headcount && !hiring) {
      setQueryFeedback("Aucun critère reconnu. Essayez la recherche par nom ou les filtres.");
      return;
    }
    setCityFilter(city ?? "all");
    setSectorFilter(sector ?? "all");
    setSizeFilter("all");
    setHeadcountRange(headcount);
    setOnlyHiring(hiring);
    setCompanySearch("");
    setMinScore(0);
    setQueryFeedback("Critères appliqués. Vous pouvez les modifier dans les filtres.");
  };

  const resetCompanyFilters = () => {
    setAiQuery("");
    setQueryFeedback("");
    setHeadcountRange(null);
    setCompanySearch("");
    setCityFilter("all");
    setSectorFilter("all");
    setSizeFilter("all");
    setMinScore(0);
    setOnlyHiring(false);
  };

  const confirmEnrichment = () => {
    if (!pendingEnrichment) return;
    setEnrichedIds((previous) =>
      previous.includes(pendingEnrichment) || (previous.length + 1) * ENRICHMENT_COST > INITIAL_CREDITS
        ? previous
        : [...previous, pendingEnrichment],
    );
    setPendingEnrichment(null);
  };
  const selectedResults = filteredCompanies.filter((company) => selection.includes(company.id) && !crmAddedIds[company.id]);

  const goToDecidersForCompany = (companyId: string) => {
    setSelectedCompany(null);
    setSelectedOffer(null);
    setContactCompanyFilter(companyId);
    setActiveTab("contacts");
  };

  const openCompanyById = (companyId: string) => {
    const found = companiesData.find((c) => c.id === companyId);
    if (!found) return;
    setSelectedOffer(null);
    setActiveTab("companies");
    setSelectedCompany(found);
  };

  const tabs: AcquisitionTab[] = ["companies", "contacts", "offers", "alerts"];

  return (
    <div className="@container w-full min-w-0 px-4 py-6 sm:px-6">
      {/* En-tête + Solde crédits */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[24px] leading-[32px] font-semibold tracking-[-0.025em] text-[var(--foreground)]">
            Acquisition client
          </h2>
          <p className="mt-1 text-[14px] leading-[21px] text-[var(--text-secondary)]">
            {activeTab === "contacts"
              ? "Trouvez les bons interlocuteurs."
              : "Trouvez vos prochaines opportunités commerciales."}
          </p>
        </div>

        <div className="inline-flex items-center gap-2.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2">
          <span className="text-[13px] text-[var(--text-muted)]">
            Crédits démo
          </span>
          <span className="text-[14px] font-semibold text-[var(--foreground)] tabular-nums">
            {credits}
          </span>
        </div>
      </div>

      {/* Onglets Entreprises / Contacts / Offres / Alertes */}
      <div
        role="tablist"
        aria-label="Sections Acquisition client"
        className="mt-4 flex items-center gap-4 overflow-x-auto border-b sm:gap-6 border-[var(--border)]"
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
              className={`relative shrink-0 pb-2.5 text-[14px] transition-colors cursor-pointer ${selected
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

      {/* TAB 1 : ENTREPRISES */}
      {activeTab === "companies" && (
        <div className="mt-4 space-y-4">
          {/* Recherche assistée */}
          <form
            onSubmit={handleAnalyzeQuery}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <label
                htmlFor="assisted-search"
                className="shrink-0 text-[14px] font-semibold text-[var(--foreground)] sm:pr-2"
              >
                Recherche assistée
              </label>
              <input
                id="assisted-search"
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Décrivez les entreprises que vous recherchez..."
                className="h-9 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 text-[13.5px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--focus-ring)] focus:bg-[var(--surface)] focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-[14px] font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)] cursor-pointer"
              >
                Analyser
              </button>
            </div>
            {queryFeedback && <p role="status" className="mt-2 text-sm">{queryFeedback}</p>}
          </form>

          <div className="grid grid-cols-1 gap-4 @min-[60rem]:grid-cols-[minmax(0,1fr)_280px]">
            {/* Tableau des entreprises */}
            <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] p-4">
                <div className="flex items-center gap-4 text-[14px]">
                  <span className="font-semibold text-[var(--foreground)]">
                    Recherche
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("alerts")}
                    className="text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-pointer"
                  >
                    Mes listes
                  </button>
                </div>
                <span className="text-[14px] font-medium text-[var(--text-secondary)]">
                  {filteredCompanies.length} entreprise
                  {filteredCompanies.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 border-b border-[var(--border-subtle)] p-4 sm:flex-row">
                <input
                  type="search"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  placeholder="Nom, secteur ou localisation..."
                  aria-label="Nom, secteur ou localisation"
                  className="h-9.5 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[13.5px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--focus-ring)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={openAlertForm}
                  className="inline-flex h-9.5 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
                >
                  Créer une alerte
                </button>
              </div>

              {selectedResults.length > 0 && (
                <button type="button" className="px-4 py-2 text-sm font-semibold text-[var(--primary)]" onClick={() => {
                  setCrmAddedIds((previous) => ({ ...previous, ...Object.fromEntries(selectedResults.map((company) => [company.id, true])) }));
                  setSelection([]);
                }}>
                  Ajouter {selectedResults.length} au CRM (démo)
                </button>
              )}
              {filteredCompanies.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-[14.5px] font-semibold text-[var(--foreground)]">
                    Aucune entreprise trouvée
                  </p>
                  <p className="mt-1 text-[14px] text-[var(--text-muted)]">
                    Ajustez vos critères dans le panneau de droite.
                  </p>
                  <button
                    type="button"
                    onClick={resetCompanyFilters}
                    className="mt-4 inline-flex h-9 items-center rounded-lg border border-[var(--border)] px-4 text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[580px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] bg-[var(--background)] text-[13.5px] font-medium text-[var(--text-secondary)]">
                        <th className="pl-4" scope="col"><span className="sr-only">Sélection</span></th>
                        <th className="px-4 py-2.5">Entreprise</th>
                        <th className="px-4 py-2.5">Effectif</th>
                        <th className="px-4 py-2.5">Secteur</th>
                        <th className="px-4 py-2.5">Signal</th>
                        <th className="px-4 py-2.5 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)] text-[13.5px]">
                      {filteredCompanies.map((c) => (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedCompany(c)}
                          className="transition-colors hover:bg-[var(--surface-hover)] cursor-pointer"
                        >
                          <td className="pl-4" onClick={(event) => event.stopPropagation()}>
                            <input type="checkbox" aria-label={"Sélectionner " + c.name} disabled={crmAddedIds[c.id]} checked={selection.includes(c.id) && !crmAddedIds[c.id]} onChange={(event) => {
                              const checked = event.target.checked;
                              setSelection((previous) => checked ? [...previous, c.id] : previous.filter((id) => id !== c.id));
                            }} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span
                                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg"
                                style={{
                                  backgroundColor: c.tintBg,
                                  color: c.tintFg,
                                }}
                              >
                                <SolarIcon name="crm" className="size-4" />
                              </span>
                              <div>
                                <button type="button" className="text-left font-medium text-[var(--foreground)] hover:underline" onClick={(event) => { event.stopPropagation(); setSelectedCompany(c); }}>
                                  {c.name}
                                </button>
                                <p className="text-[13px] text-[var(--text-muted)]">
                                  {c.city}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[var(--text-secondary)] tabular-nums">
                            {c.size}
                          </td>
                          <td className="px-4 py-3 text-[var(--text-secondary)]">
                            {c.sector}
                          </td>
                          <td className="px-4 py-3">
                            {c.signalCount > 0 ? (
                              <span className="font-medium text-[var(--warning)]">
                                {c.signalCount} offres
                              </span>
                            ) : (
                              <span className="text-[var(--text-muted)]">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex flex-col items-end">
                              <span className="font-semibold text-[var(--foreground)] tabular-nums">
                                {c.score}
                              </span>
                              <span className="mt-1 h-1 w-10 overflow-hidden rounded-full bg-[var(--surface-inset)]">
                                <span
                                  className="block h-full rounded-full bg-[var(--brand-primary)]"
                                  style={{ width: `${c.score}%` }}
                                />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-4 py-3 text-[13px] text-[var(--text-muted)]">
                <span>
                  {filteredCompanies.length} résultats de démonstration
                </span>
                <span>1 / 1</span>
              </div>
            </section>

            {/* Filtres avancés */}
            <aside className="h-fit rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
                Filtres avancés
              </h3>

              <div className="mt-4 space-y-4 text-[13.5px]">
                <div>
                  <label
                    htmlFor="city-filter"
                    className="block text-[13.5px] font-medium text-[var(--text-secondary)]"
                  >
                    Localisation
                  </label>
                  <PremiumSelect
                    id="city-filter"
                    value={cityFilter}
                    onChange={setCityFilter}
                    ariaLabel="Localisation"
                    className="mt-1.5"
                    options={[
                      { value: "all", label: "Toutes les villes" },
                      { value: "Lyon", label: "Lyon" },
                      { value: "Paris", label: "Paris" },
                      { value: "Grenoble", label: "Grenoble" },
                    ]}
                  />
                </div>

                <div>
                  <label
                    htmlFor="sector-filter"
                    className="block text-[13.5px] font-medium text-[var(--text-secondary)]"
                  >
                    Secteur
                  </label>
                  <PremiumSelect
                    id="sector-filter"
                    value={sectorFilter}
                    onChange={setSectorFilter}
                    ariaLabel="Secteur"
                    className="mt-1.5"
                    options={[
                      { value: "all", label: "Tous les secteurs" },
                      { value: "Nettoyage", label: "Nettoyage" },
                      { value: "Maintenance", label: "Maintenance" },
                      { value: "Services", label: "Services" },
                      { value: "Industrie", label: "Industrie" },
                    ]}
                  />
                </div>

                <div>
                  <label
                    htmlFor="size-filter"
                    className="block text-[13.5px] font-medium text-[var(--text-secondary)]"
                  >
                    Effectif
                  </label>
                  <PremiumSelect
                    id="size-filter"
                    value={headcountRange ? "interpreted" : sizeFilter}
                    onChange={(value) => { if (value !== "interpreted") { setHeadcountRange(null); setSizeFilter(value); } }}
                    ariaLabel="Effectif"
                    className="mt-1.5"
                    options={[
                      { value: "all", label: "Tous les effectifs" },
                      ...(headcountRange ? [{ value: "interpreted", label: headcountRange.join("–") + " salariés" }] : []),
                      { value: "11–50", label: "11–50" },
                      { value: "51–200", label: "51–200" },
                      { value: "201–500", label: "201–500" },
                    ]}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[13.5px]">
                    <label
                      htmlFor="min-score"
                      className="font-medium text-[var(--text-secondary)]"
                    >
                      Pertinence minimale
                    </label>
                    <span className="font-semibold text-[var(--foreground)] tabular-nums">
                      {minScore}/100
                    </span>
                  </div>
                  <input
                    id="min-score"
                    type="range"
                    min={0}
                    max={95}
                    step={5}
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--primary)] cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2.5 text-[13.5px] text-[var(--foreground)]">
                  <PremiumCheckbox
                    checked={onlyHiring}
                    onChange={setOnlyHiring}
                    ariaLabel="Recrutement actif"
                  />
                  <span
                    onClick={() => setOnlyHiring((v) => !v)}
                    className="cursor-pointer"
                  >
                    Recrutement actif
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={resetCompanyFilters}
                    className="flex h-9.5 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[13.5px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                  <div className="flex h-9.5 w-full items-center justify-center rounded-xl bg-[var(--primary)] text-[13.5px] font-medium text-[var(--primary-foreground)]">
                    Voir les résultats ({filteredCompanies.length})
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* TAB 2 : CONTACTS */}
      {activeTab === "contacts" && (
        <section className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="grid grid-cols-1 gap-2.5 border-b border-[var(--border-subtle)] p-4 sm:grid-cols-[1fr_200px_180px]">
            <input
              type="search"
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              placeholder="Nom, fonction ou entreprise..."
              aria-label="Nom, fonction ou entreprise"
              className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 text-[13.5px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--focus-ring)] focus:bg-[var(--surface)] focus:outline-none"
            />
            <PremiumSelect
              value={contactCompanyFilter}
              onChange={setContactCompanyFilter}
              ariaLabel="Filtrer par entreprise"
              options={[
                { value: "all", label: "Toutes les entreprises" },
                ...companiesData.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <PremiumSelect
              value={contactDeptFilter}
              onChange={setContactDeptFilter}
              ariaLabel="Filtrer par département"
              options={[
                { value: "all", label: "Tous les départements" },
                { value: "Direction", label: "Direction" },
                { value: "Opérations", label: "Opérations" },
                { value: "Commercial", label: "Commercial" },
                { value: "RH", label: "RH" },
                { value: "Achats", label: "Achats" },
              ]}
            />
          </div>

          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--background)] px-4 py-2 text-[13.5px] font-medium text-[var(--text-secondary)]">
            <span>
              {filteredContacts.length} contact
              {filteredContacts.length > 1 ? "s" : ""}
            </span>
            <span>Données de démonstration</span>
          </div>

          <ul className="divide-y divide-[var(--border-subtle)]">
              {filteredContacts.map((ct) => (
                <li
                  key={ct.id}
                  onClick={() => setSelectedContactId(ct.id)}
                  className="flex flex-wrap items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-[var(--surface-hover)] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold"
                      style={{
                        backgroundColor: ct.avatarBg,
                        color: ct.avatarFg,
                      }}
                    >
                      {ct.initials}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[var(--foreground)]">
                        {ct.name}
                      </p>
                      <p className="text-[13.5px] text-[var(--text-secondary)]">
                        {ct.role} · {ct.companyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium ${ct.emailStatus === "verified"
                          ? "bg-[var(--success-bg)] text-[var(--success)]"
                          : ct.emailStatus === "verify"
                            ? "bg-[var(--warning-bg)] text-[var(--warning)]"
                            : "bg-[var(--surface-inset)] text-[var(--text-secondary)]"
                        }`}
                    >
                      <SolarIcon name="mail" className="size-3.5" />
                      <span>
                        {ct.emailStatus === "verified"
                          ? "Vérifié"
                          : ct.emailStatus === "verify"
                            ? "À vérifier"
                            : "À enrichir"}
                      </span>
                    </span>

                    <div className="inline-flex flex-col items-end">
                      <span className="text-[13.5px] font-semibold text-[var(--foreground)] tabular-nums">
                        {ct.score}
                      </span>
                      <span className="mt-1 h-1 w-10 overflow-hidden rounded-full bg-[var(--surface-inset)]">
                        <span
                          className="block h-full rounded-full bg-[var(--brand-primary)]"
                          style={{ width: `${ct.score}%` }}
                        />
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
        </section>
      )}

      {/* TAB 3 : OFFRES */}
      {activeTab === "offers" && (
        <section className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="grid grid-cols-1 gap-2.5 border-b border-[var(--border-subtle)] p-4 sm:grid-cols-[1fr_180px_160px]">
            <input
              type="search"
              value={offerSearch}
              onChange={(e) => setOfferSearch(e.target.value)}
              placeholder="Intitulé de poste, entreprise, mots-clés..."
              aria-label="Intitulé de poste, entreprise, mots-clés"
              className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 text-[13.5px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--focus-ring)] focus:bg-[var(--surface)] focus:outline-none"
            />
            <PremiumSelect
              value={offerCityFilter}
              onChange={setOfferCityFilter}
              ariaLabel="Filtrer par ville"
              options={[
                { value: "all", label: "Toutes les villes" },
                { value: "Lyon", label: "Lyon" },
                { value: "Paris", label: "Paris" },
                { value: "Grenoble", label: "Grenoble" },
              ]}
            />
            <button
              type="button"
              onClick={openAlertForm}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
            >
              Créer une alerte
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-2 text-sm">
            <span>Le recrutement indique une opportunité à examiner.</span>
            <select aria-label="Trier les signaux" value={offerSort} onChange={(event) => setOfferSort(event.target.value)}>
              <option value="score">Pertinence</option>
              <option value="default">Ordre de la source</option>
            </select>
          </div>
          {filteredOffers.length === 0 && <p className="p-4 text-sm">Aucun signal ne correspond à ces critères.</p>}
          <ul className="divide-y divide-[var(--border-subtle)]">
              {filteredOffers.map((off) => (
                <li
                  key={off.id}
                  onClick={() => setSelectedOffer(off)}
                  className="flex flex-wrap items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-[var(--surface-hover)] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0D6] text-[#B7791F]">
                      <SolarIcon name="acquisition" className="size-5" />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[var(--foreground)]">
                        {off.title}
                      </p>
                      <p className="text-[13.5px] text-[var(--text-secondary)]">
                        {off.companyName} · {off.city} · {off.contract}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{off.skills.join(" · ")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[13.5px] text-[var(--text-secondary)]">
                        {off.publishedAgo}
                      </p>
                      {off.isRecent && (
                        <span className="text-[12.5px] font-medium text-[var(--info)]">
                          Récente
                        </span>
                      )}
                    </div>
                    <div className="inline-flex flex-col items-end">
                      <span className="text-[13.5px] font-semibold text-[var(--foreground)] tabular-nums">
                        {off.score}
                      </span>
                      <span className="mt-1 h-1 w-10 overflow-hidden rounded-full bg-[var(--surface-inset)]">
                        <span
                          className="block h-full rounded-full bg-[var(--brand-primary)]"
                          style={{ width: `${off.score}%` }}
                        />
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
        </section>
      )}

      {/* TAB 4 : ALERTES */}
      {activeTab === "alerts" && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <p>{alerts.filter((alert) => alert.active).length} alertes actives · {alerts.reduce((total, alert) => total + alert.newMatches, 0)} signaux de démonstration</p>
            <button type="button" onClick={openAlertForm} className="rounded-lg bg-[var(--primary)] px-3 py-2 text-[var(--primary-foreground)]">Créer une alerte</button>
          </div>
          {alertMessage && <p role="status" className="text-sm">{alertMessage}</p>}
          {editingAlert && (
            <form key={editingAlert === "new" ? "new" : editingAlert.id} onSubmit={saveAlert} onChange={() => setAlertPreview(null)} className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
              <h3 className="font-semibold">{editingAlert === "new" ? "Créer une alerte" : "Modifier l’alerte"}</h3>
              <div className="grid gap-3 sm:grid-cols-2 [&_input:not([type=checkbox])]:w-full [&_input:not([type=checkbox])]:rounded [&_input:not([type=checkbox])]:border [&_input:not([type=checkbox])]:px-2 [&_input:not([type=checkbox])]:py-1">
                <label>Nom<input name="title" required defaultValue={editingAlert === "new" ? "" : editingAlert.title} /></label>
                <label>Mots-clés<input name="criteria" required defaultValue={editingAlert === "new" ? (offerSearch || companySearch) : editingAlert.criteria} /></label>
                <label>Zone géographique<input name="location" defaultValue={editingAlert === "new" ? "France" : editingAlert.location ?? "France"} /></label>
                <label>Plafond mensuel (crédits)<input type="number" name="monthlyLimit" required min={10} max={500} defaultValue={editingAlert === "new" ? 100 : editingAlert.monthlyLimit ?? 100} /></label>
                <label>Correspondance <select name="keywordMode" defaultValue={editingAlert === "new" ? "any" : editingAlert.keywordMode ?? "any"}><option value="any">Au moins un mot (OU)</option><option value="all">Tous les mots (ET)</option></select></label>
                <label>Fréquence <select name="frequency" defaultValue={editingAlert === "new" ? "Quotidienne" : editingAlert.frequency}><option>Quotidienne</option><option>Hebdomadaire</option></select></label>
                <label><input type="checkbox" name="inApp" defaultChecked={editingAlert === "new" || editingAlert.inApp !== false} /> Notifications AutoCall</label>
                <label><input type="checkbox" name="email" defaultChecked={editingAlert === "new" || editingAlert.email !== false} /> Récapitulatif par email</label>
              </div>
              <p className="text-[var(--text-muted)]">Les alertes de démonstration sont enregistrées pour cette session. Aucun envoi automatique.</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="rounded-lg border border-[var(--border)] px-3 py-2" onClick={(event) => { if (event.currentTarget.form) previewAlert(event.currentTarget.form); }}>Prévisualiser</button>
                <button type="submit" className="rounded-lg bg-[var(--primary)] px-3 py-2 text-[var(--primary-foreground)]">Enregistrer</button>
                <button type="button" onClick={() => setEditingAlert(null)}>Annuler</button>
              </div>
              {alertPreview !== null && <p role="status">{alertPreview} {alertPreview === 1 ? "signal trouvé" : "signaux trouvés"} dans les offres de démonstration.</p>}
            </form>
          )}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xs">
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
              Recherches sauvegardées et alertes
            </h3>
            <p className="mt-1 text-[13.5px] text-[var(--text-secondary)]">
              Surveillance programmée des nouvelles entreprises et offres
              correspondant à votre ICP.
            </p>

            <ul className="mt-4 divide-y divide-[var(--border-subtle)]">
              {alerts.map((al) => (
                <li
                  key={al.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-[14px] font-medium text-[var(--foreground)]">
                      {al.title}
                    </p>
                    <p className="mt-0.5 text-[13.5px] text-[var(--text-muted)]">
                      {al.criteria}{al.location ? " · " + al.location : ""} · {al.frequency} · {al.newMatches} nouveaux
                      résultats
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <button type="button" aria-label={"Modifier " + al.title} onClick={() => { setAlertMessage(""); setAlertPreview(null); setEditingAlert(al); }}>Modifier</button>
                    <button type="button" aria-label={"Supprimer " + al.title} onClick={() => {
                      if (editingAlert !== "new" && editingAlert?.id === al.id) setEditingAlert(null);
                      setAlerts((previous) => previous.filter((entry) => entry.id !== al.id));
                      setAlertMessage("Alerte de démonstration supprimée.");
                    }}>Supprimer</button>
                    <button
                    type="button"
                    role="switch"
                    aria-checked={al.active}
                    aria-label={al.title}
                    onClick={() =>
                      setAlerts((prev) =>
                        prev.map((item) =>
                          item.id === al.id
                            ? { ...item, active: !item.active }
                            : item,
                        ),
                      )
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${al.active ? "bg-[var(--brand-primary)]" : "bg-[#E5E5E5]"
                      }`}
                  >
                    <span
                      className={`inline-block size-4.5 transform rounded-full bg-white shadow-xs transition-transform ${al.active ? "translate-x-5.5" : "translate-x-1"
                        }`}
                    />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tiroirs de fiches détaillées */}
      {selectedCompany && (
        <CompanyDetailDrawer
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onFindDeciders={goToDecidersForCompany}
          onAddToCrm={(id) =>
            setCrmAddedIds((prev) => ({ ...prev, [id]: true }))
          }
          addedToCrm={Boolean(crmAddedIds[selectedCompany.id])}
        />
      )}

      {selectedContact && (
        <ContactDetailDrawer
          contact={selectedContact}
          onClose={() => { setSelectedContactId(null); setPendingEnrichment(null); }}
          onAddToCrm={(id) =>
            setCrmAddedIds((prev) => ({ ...prev, [id]: true }))
          }
          addedToCrm={Boolean(crmAddedIds[selectedContact.id])}
          onEnrich={setPendingEnrichment}
        />
      )}

      {pendingEnrichment && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/35 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="enrichment-title" className="w-full max-w-sm rounded-xl bg-[var(--surface)] p-5 shadow-xl">
            <h3 id="enrichment-title" className="font-semibold">Confirmer l’enrichissement</h3>
            <p className="mt-2 text-sm">Coût simulé de {ENRICHMENT_COST} crédits. Solde de démonstration de {credits} crédits.</p>
            <div className="mt-4 flex flex-wrap justify-end gap-3 text-sm">
              <button type="button" onClick={() => setPendingEnrichment(null)}>Annuler</button>
              <button type="button" disabled={credits < ENRICHMENT_COST || enrichedIds.includes(pendingEnrichment)} onClick={confirmEnrichment} className="rounded-lg bg-[var(--primary)] px-3 py-2 text-[var(--primary-foreground)] disabled:opacity-50">Confirmer</button>
            </div>
          </section>
        </div>
      )}

      {selectedOffer && (
        <OfferDetailDrawer
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onFindDeciders={goToDecidersForCompany}
          onOpenCompany={openCompanyById}
        />
      )}
    </div>
  );
}
