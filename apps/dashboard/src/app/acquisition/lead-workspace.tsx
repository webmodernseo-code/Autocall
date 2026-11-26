"use client";

import { useRef, useState } from "react";
import { AcquisitionView } from "../acquisition-view";
import { PremiumCheckbox } from "../premium-checkbox";
import { PremiumSelect } from "../premium-select";
import { type Locale, SolarIcon } from "../workspace-navigation";
import { employeeBands, sectors } from "./lead-filters";
import type { LeadCompany, LeadCriteria, LeadList, LeadSearchResult } from "./lead-types";

const tabs = [
  { id: "search", label: "Recherche de leads" },
  { id: "lists", label: "Mes listes" },
  { id: "tools", label: "Outils d’acquisition" },
] as const;
const emptyCriteria: LeadCriteria = { query: "", department: "", activityCode: "" };
const storageKey = "autocall-acquisition-lead-lists-v1";
const action = "rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium hover:bg-[var(--surface-hover)] disabled:opacity-50";
const primary = "rounded-xl bg-[#00775B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00634D] disabled:opacity-50";
const input = "min-w-0 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm";
const filterKeys = ["department", "postalCode", "sector", "activityCode", "employeeBand", "directorName"] as const;

function filterLabels(criteria: LeadCriteria) {
  return [
    criteria.department && `Département ${criteria.department}`,
    criteria.postalCode && `Code postal ${criteria.postalCode}`,
    sectors.find((sector) => sector.value === criteria.sector)?.label,
    criteria.activityCode && `NAF ${criteria.activityCode}`,
    employeeBands.find((band) => band.value === criteria.employeeBand)?.label,
    criteria.directorName && `Dirigeant · ${criteria.directorName}`,
  ].filter(Boolean);
}

function readLists(): LeadList[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    if (Array.isArray(stored)) return stored;
  } catch {
    // Lists can still be used in memory when browser storage is unavailable.
  }
  return [];
}

function LeadTable({ companies, selection, toggle }: {
  companies: LeadCompany[];
  selection?: Map<string, LeadCompany>;
  toggle?: (company: LeadCompany) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full min-w-[42rem] text-left text-sm">
        <thead className="border-b border-[var(--border)] bg-[var(--surface-inset)] text-[var(--text-secondary)]">
          <tr>
            {selection && <th scope="col" className="w-11 pl-4"><span className="sr-only">Sélection</span></th>}
            <th scope="col" className="px-4 py-3 font-medium">Entreprise</th>
            <th scope="col" className="px-4 py-3 font-medium">Interlocuteurs déclarés</th>
            <th scope="col" className="px-4 py-3 font-medium">Siège et activité</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">
          {companies.map((company) => (
            <tr key={company.siren} className={selection?.has(company.siren) ? "bg-[#F0F8F4]" : undefined}>
              {selection && <td className="pl-4 align-middle"><PremiumCheckbox checked={selection.has(company.siren)} ariaLabel={`Sélectionner ${company.name}`} onChange={() => toggle?.(company)} /></td>}
              <th scope="row" className="px-4 py-4 align-top font-normal">
                <a className="font-semibold text-[#00775B] hover:underline" href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${company.siren}`} target="_blank" rel="noreferrer">{company.name}</a>
                <span className="mt-1 block font-mono text-xs text-[var(--text-muted)]">SIREN {company.siren}</span>
              </th>
              <td className="px-4 py-4 align-top">
                {company.contacts.length ? <ul className="space-y-1.5">{company.contacts.map((contact) => (
                  <li key={contact.name + "|" + contact.role}><span className="font-medium">{contact.name}</span><span className="block text-xs text-[var(--text-muted)]">{contact.role}</span></li>
                ))}</ul> : <span className="text-[var(--text-muted)]">Aucun interlocuteur publié</span>}
              </td>
              <td className="px-4 py-4 align-top text-[var(--text-secondary)]">
                <span className="block">{[company.postalCode, company.city].filter(Boolean).join(" ") || "Siège non renseigné"}</span>
                {company.activityCode && <span className="mt-1 block text-xs text-[var(--text-muted)]">NAF {company.activityCode}</span>}
                {company.employeeBand && <span className="mt-1 block text-xs text-[var(--text-muted)]">{company.employeeBand}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LeadWorkspace({ locale }: { locale: Locale }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("search");
  const [criteria, setCriteria] = useState(emptyCriteria);
  const [applied, setApplied] = useState<LeadCriteria | null>(null);
  const [result, setResult] = useState<LeadSearchResult | null>(null);
  const [selected, setSelected] = useState(new Map<string, LeadCompany>());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [lists, setLists] = useState(readLists);
  const [listSearch, setListSearch] = useState("");
  const [activeListId, setActiveListId] = useState("");
  const [listName, setListName] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);
  // Filters panel visibility controlled by state

  const [destination, setDestination] = useState("new");
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const requestId = useRef(0);
  const activeList = lists.find((list) => list.id === activeListId);
  const displayedLists = lists.filter((list) => list.name.toLowerCase().includes(listSearch.trim().toLowerCase()));
  const activeFilterCount = filterKeys.filter((key) => criteria[key]?.trim()).length;
  const updateCriteria = (key: keyof LeadCriteria, value: string) => {
    setCriteria((previous) => ({ ...previous, [key]: value }));
  };

  const search = async (filters: LeadCriteria, page = 1, resetSelection = true) => {
    const id = ++requestId.current;
    if (resetSelection) {
      setResult(null);
      setSelected(new Map());
    }
    setPending(true);
    setError("");
    const query = new URLSearchParams({
      q: filters.query, department: filters.department, activity: filters.activityCode, page: String(page),
      postalCode: filters.postalCode ?? "",
      sector: filters.sector ?? "",
      employeeBand: filters.employeeBand ?? "",
      directorName: filters.directorName ?? "",
    });
    try {
      const response = await fetch("/api/acquisition/companies?" + query.toString());
      const data = await response.json() as LeadSearchResult | { error: string };
      if (id !== requestId.current) return;
      if ("error" in data) throw new Error(data.error);
      if (!response.ok) throw new Error("Impossible de rechercher les entreprises.");
      setResult(data);
      setApplied(filters);
    } catch (exception) {
      if (id === requestId.current) setError(exception instanceof Error ? exception.message : "Recherche indisponible.");
    } finally {
      if (id === requestId.current) setPending(false);
    }
  };

  const toggle = (company: LeadCompany) => {
    setSelected((previous) => {
      const next = new Map(previous);
      if (next.has(company.siren)) next.delete(company.siren);
      else next.set(company.siren, company);
      return next;
    });
  };
  const selectBatch = (size: number) => {
    if (!result) return;
    setSelected(new Map(result.companies.slice(0, size).map((company) => [company.siren, company])));
  };
  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!applied || !selected.size || (destination === "new" && !listName.trim())) return;
    const existing = lists.find((item) => item.id === destination);
    const saved: LeadList = existing ? {
      ...existing,
      companies: [...new Map([...existing.companies, ...selected.values()].map((item) => [item.siren, item])).values()],
    } : {
      id: crypto.randomUUID(), name: listName.trim(), criteria: applied,
      companies: [...selected.values()], createdAt: new Date().toISOString(),
    };
    const next = existing ? lists.map((item) => item.id === existing.id ? saved : item) : [saved, ...lists];
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      setNotice(`« ${saved.name} » enregistrée dans ce navigateur.`);
    } catch {
      setNotice("Le stockage est indisponible. La liste reste accessible tant que cet écran est ouvert.");
    }
    setLists(next);
    setListSearch("");
    setActiveListId(saved.id);
    setTab("lists");
    dialog.current?.close();
  };

  return (
    <div className="@container w-full min-w-0 space-y-6 px-4 py-6 sm:px-7 sm:py-8">
      <header>
        <h2 className="text-[26px] leading-8 font-semibold tracking-[-0.025em] text-[var(--foreground)]">Acquisition client</h2>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Trouvez des entreprises et organisez les leads de vos prochaines actions commerciales.</p>
      </header>
      <nav className="flex gap-6 overflow-x-auto border-b border-[var(--border)]" aria-label="Espaces Acquisition">
        {tabs.map((item) => <button type="button" key={item.id} aria-current={item.id === tab ? "page" : undefined} onClick={() => setTab(item.id)} className="min-h-10 shrink-0 whitespace-nowrap border-b-2 border-transparent pb-2.5 text-[13.5px] font-medium text-[var(--text-muted)] hover:text-[var(--foreground)] aria-[current=page]:border-[var(--foreground)] aria-[current=page]:font-semibold aria-[current=page]:text-[var(--foreground)]">{item.label}{item.id === "lists" && lists.length > 0 && ` (${lists.length})`}</button>)}
      </nav>
      {tab === "search" && <section className="space-y-4">
        <form id="lead-search-form" onSubmit={(event) => { event.preventDefault(); void search(criteria); }} className="flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xs sm:px-5">
          <label className="grid min-w-0 flex-[1_1_16rem] gap-1.5 text-sm font-medium">Nom, ville ou SIREN
            <span className="relative"><SolarIcon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--text-muted)]" /><input className={input + " pl-10"} type="search" maxLength={120} placeholder="Ex. Nettoyage Lyon" value={criteria.query} onChange={(event) => updateCriteria("query", event.target.value)} /></span>
          </label>
          <button type="button" aria-controls="acquisition-search-filters" aria-expanded={filtersOpen} className={action} onClick={() => setFiltersOpen(!filtersOpen)}>Filtres{activeFilterCount > 0 && ` (${activeFilterCount})`}</button>
          <button type="submit" className={primary} disabled={pending || (!criteria.query.trim() && !activeFilterCount)}>Rechercher</button>
        </form>
        <div className="grid items-start gap-4 @min-[64rem]:grid-cols-[17rem_minmax(0,1rem)]">
          <aside id="acquisition-search-filters" hidden={!filtersOpen} className="min-w-0 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <h3 className="text-sm font-semibold">Filtres de recherche</h3>
              <button type="button" disabled={!activeFilterCount} className="text-xs font-medium text-[#00775B] hover:underline disabled:opacity-45" onClick={() => setCriteria((previous) => ({ ...emptyCriteria, query: previous.query }))}>Réinitialiser</button>
            </div>
            <details open className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3">
              <summary className="cursor-pointer text-sm font-medium">Localisation</summary>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 @min-[64rem]:grid-cols-1">
                <label className="grid gap-1 text-xs font-medium">Département<input form="lead-search-form" className={input} maxLength={3} placeholder="Ex. 69" value={criteria.department} onChange={(event) => updateCriteria("department", event.target.value.toUpperCase())} /></label>
                <label className="grid gap-1 text-xs font-medium">Code postal<input form="lead-search-form" className={input} inputMode="numeric" maxLength={5} placeholder="Ex. 69003" value={criteria.postalCode ?? ""} onChange={(event) => updateCriteria("postalCode", event.target.value)} /></label>
              </div>
            </details>
            <details open className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3">
              <summary className="cursor-pointer text-sm font-medium">Entreprises</summary>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 @min-[64rem]:grid-cols-1">
                <div className="grid min-w-0 gap-1 text-xs font-medium"><label htmlFor="acquisition-sector">Secteur d’activité</label><PremiumSelect id="acquisition-sector" ariaLabel="Secteur d’activité" value={criteria.sector ?? ""} onChange={(value) => updateCriteria("sector", value)} options={[{ value: "", label: "Tous les secteurs" }, ...sectors]} /></div>
                <div className="grid min-w-0 gap-1 text-xs font-medium"><label htmlFor="acquisition-employees">Effectif</label><PremiumSelect id="acquisition-employees" ariaLabel="Effectif" value={criteria.employeeBand ?? ""} onChange={(value) => updateCriteria("employeeBand", value)} options={[{ value: "", label: "Tous les effectifs" }, ...employeeBands]} /></div>
                <label className="grid gap-1 text-xs font-medium">Code NAF<input form="lead-search-form" className={input} maxLength={6} placeholder="Ex. 81.21Z" value={criteria.activityCode} onChange={(event) => updateCriteria("activityCode", event.target.value.toUpperCase())} /></label>
              </div>
            </details>
            <details className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3">
              <summary className="cursor-pointer text-sm font-medium">Contacts{criteria.directorName && " · 1 filtre"}</summary>
              <label className="mt-3 grid gap-1 text-xs font-medium">Nom d’un dirigeant déclaré<input form="lead-search-form" className={input} maxLength={80} placeholder="Ex. Martin" value={criteria.directorName ?? ""} onChange={(event) => updateCriteria("directorName", event.target.value)} /></label>
            </details>
            <button type="submit" form="lead-search-form" className={primary + " w-full"} disabled={pending || (!criteria.query.trim() && !activeFilterCount)}>Appliquer la recherche</button>
          </aside>
          <div className="min-w-0 space-y-4">
        <p className="text-xs text-[var(--text-secondary)]">Annuaire des entreprises · Entreprises françaises actives et dirigeants publiés.</p>
        {applied && result && filterLabels(applied).length > 0 && <div className="flex flex-wrap items-center gap-2 text-xs"><span className="text-[var(--text-muted)]">Filtres appliqués</span>{filterLabels(applied).map((label) => <span key={label} className="rounded-lg bg-[#E6F5F0] px-2.5 py-1.5 font-medium text-[#00775B]">{label}</span>)}</div>}
        {pending && <p role="status" className="text-sm">Recherche en cours…</p>}
        {error && <p role="alert" className="rounded-xl border border-[var(--danger-border)] bg-[var(--danger-bg)] p-3 text-sm text-[var(--danger)]">{error}</p>}
        {!pending && !error && !result && <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm shadow-2xs">Saisissez un mot-clé ou choisissez un filtre pour afficher les entreprises et leurs dirigeants déclarés.</div>}
        {result && <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm">
            <p><strong>{result.total.toLocaleString("fr-FR")}</strong> entreprises trouvées <span className="text-[var(--text-muted)]">· {selected.size} sélectionnée(s)</span></p>
            <div className="flex flex-wrap gap-2">
              {[10, 20].map((size) => <button type="button" key={size} className={action} disabled={pending || result.companies.length < size} onClick={() => selectBatch(size)}>Les {size} premières de cette page</button>)}
              {selected.size > 0 && <button type="button" className={action} onClick={() => setSelected(new Map())}>Effacer la sélection</button>}
              <button type="button" disabled={pending || !selected.size} className={primary} onClick={() => { setDestination("new"); setListName(""); dialog.current?.showModal(); }}>Enregistrer dans une liste</button>
            </div>
          </div>
          {result.companies.length ? <LeadTable companies={result.companies} selection={selected} toggle={toggle} /> : <p className="rounded-xl border border-[var(--border)] p-4 text-sm">Aucune entreprise ne correspond à ces critères.</p>}
          {result.pages > 1 && applied && <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
            <button type="button" className={action} disabled={pending || result.page <= 1} onClick={() => void search(applied, result.page - 1, false)}>Précédente</button>
            <span>Page {result.page} sur {result.pages}</span>
            <button type="button" className={action} disabled={pending || result.page >= result.pages} onClick={() => void search(applied, result.page + 1, false)}>Suivante</button>
          </div>}
        </>}
          </div>
        </div>
      </section>}
      {tab === "lists" && <section className="space-y-4">
        {notice && <p role="status" className="text-sm text-[#00775B]">{notice}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input type="search" aria-label="Rechercher une liste" placeholder="Rechercher une liste" className={input + " max-w-sm"} value={listSearch} onChange={(event) => setListSearch(event.target.value)} />
          <button type="button" className={primary} onClick={() => setTab("search")}>Rechercher des leads</button>
        </div>
        <div className="grid items-start gap-4 xl:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <h3 className="px-2 py-1 text-sm font-semibold">Listes enregistrées</h3>
            {displayedLists.map((list) => <button type="button" key={list.id} aria-pressed={activeListId === list.id} onClick={() => setActiveListId(list.id)} className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--surface-inset)] aria-pressed:bg-[#E6F5F0] aria-pressed:text-[#00775B]"><span className="min-w-0 break-words font-medium">{list.name}</span><span className="tabular-nums">{list.companies.length}</span></button>)}
            {!displayedLists.length && <p className="px-2 py-3 text-sm text-[var(--text-muted)]">{lists.length ? "Aucune liste ne correspond à la recherche." : "Aucune liste enregistrée."}</p>}
          </div>
          {activeList && <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div>
                <h3 className="font-semibold">{activeList.name}</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{activeList.companies.length} entreprises · {activeList.companies.reduce((count, item) => count + item.contacts.length, 0)} interlocuteurs</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{[activeList.criteria.query, ...filterLabels(activeList.criteria)].filter(Boolean).join(" · ")}</p>
              </div>
              <button type="button" className={action} onClick={() => { setCriteria(activeList.criteria); setTab("search"); void search(activeList.criteria); }}>Relancer la recherche initiale</button>
            </div>
            <LeadTable companies={activeList.companies} />
          </div>}
        </div>
      </section>}
      {tab === "tools" && <AcquisitionView locale={locale} />}
      <dialog ref={dialog} aria-labelledby="save-lead-list" className="fixed inset-0 m-auto w-[28rem] max-w-[calc(100%_-_2rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl backdrop:bg-black/35">
        <form onSubmit={save} className="space-y-4">
          <div><h3 id="save-lead-list" className="font-semibold">Enregistrer la sélection</h3><p className="mt-1 text-sm text-[var(--text-secondary)]">{selected.size} entreprise(s) et leurs interlocuteurs publiés.</p></div>
          <PremiumSelect ariaLabel="Liste de destination" value={destination} onChange={setDestination} options={[{ value: "new", label: "Créer une nouvelle liste" }, ...lists.map((item) => ({ value: item.id, label: item.name }))]} />
          {destination === "new" && <label className="grid gap-1 text-sm">Nom de la liste<input value={listName} onChange={(event) => setListName(event.target.value)} maxLength={80} required className={input} placeholder="Ex. Entreprises de nettoyage à Lyon" /></label>}
          <div className="flex justify-end gap-2"><button type="button" className={action} onClick={() => dialog.current?.close()}>Annuler</button><button type="submit" className={primary} disabled={destination === "new" && !listName.trim()}>Enregistrer</button></div>
        </form>
      </dialog>
    </div>
  );
}
