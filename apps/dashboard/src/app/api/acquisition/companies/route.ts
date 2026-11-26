import type { LeadCompany, LeadSearchResult } from "../../../acquisition/lead-types";
import { employeeBands, sectors } from "../../../acquisition/lead-filters";

type DirectoryResponse = {
  results: {
    siren?: string;
    nom_complet?: string;
    nom_raison_sociale?: string;
    activite_principale?: string;
    tranche_effectif_salarie?: string;
    siege?: { libelle_commune?: string; code_postal?: string };
    dirigeants?: { type_dirigeant?: string; nom?: string; prenoms?: string; qualite?: string }[];
  }[];
  total_results: number;
  page: number;
  total_pages: number;
};

export async function GET(request: Request) {
  const inputs = new URL(request.url).searchParams;
  const query = (inputs.get("q") ?? "").trim();
  const department = (inputs.get("department") ?? "").trim().toUpperCase();
  const activity = (inputs.get("activity") ?? "").trim().toUpperCase();
  const postalCode = (inputs.get("postalCode") ?? "").trim();
  const sector = (inputs.get("sector") ?? "").trim().toUpperCase();
  const employeeBand = (inputs.get("employeeBand") ?? "").trim();
  const directorName = (inputs.get("directorName") ?? "").trim();
  const employeeFilter = employeeBands.find((band) => band.value === employeeBand);
  const page = Number(inputs.get("page") ?? "1");
  const hasFilters = Boolean(department || activity || postalCode || sector || employeeBand || directorName);
  if ((!query && !hasFilters) || (query.length > 0 && query.length < 2) || query.length > 120 ||
      (department && !/^(?:\d{2,3}|2[AB])$/.test(department)) ||
      (activity && !/^\d{2}\.\d{2}[A-Z]$/.test(activity)) ||
      (postalCode && !/^\d{5}$/.test(postalCode)) ||
      (sector && !sectors.some((item) => item.value === sector)) ||
      (employeeBand && !employeeFilter) ||
      (directorName && (directorName.length < 2 || directorName.length > 80)) ||
      !Number.isSafeInteger(page) || page < 1) {
    return Response.json({ error: "Vérifiez les critères saisis. Le code postal doit contenir 5 chiffres et le code NAF doit suivre le format 81.21Z." }, { status: 400 });
  }
  if (hasFilters && /^(?:\d{9}|\d{14})$/.test(query)) {
    return Response.json({ error: "Pour une recherche par SIREN ou SIRET, retirez les autres filtres." }, { status: 400 });
  }

  const url = new URL("https://recherche-entreprises.api.gouv.fr/search");
  url.search = new URLSearchParams({
    page: String(page), per_page: "25", etat_administratif: "A",
    minimal: "true", include: "siege,dirigeants",
  }).toString();
  if (query) url.searchParams.set("q", query);
  if (department) url.searchParams.set("departement", department);
  if (activity) url.searchParams.set("activite_principale", activity);
  if (postalCode) url.searchParams.set("code_postal", postalCode);
  if (sector) url.searchParams.set("section_activite_principale", sector);
  if (employeeFilter) url.searchParams.set("tranche_effectif_salarie", employeeFilter.codes.join(","));
  if (directorName) {
    url.searchParams.set("nom_personne", directorName);
    url.searchParams.set("type_personne", "dirigeant");
  }

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "AutoCall/1.0 (recherche entreprises)" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (response.status === 429) {
      return Response.json({ error: "L’annuaire reçoit trop de demandes. Réessayez dans quelques instants." }, { status: 429 });
    }
    if (!response.ok) throw new Error("Directory unavailable");
    const data = await response.json() as DirectoryResponse;
    const companies: LeadCompany[] = data.results.flatMap((record) => {
      if (!record.siren) return [];
      const contacts = (record.dirigeants ?? []).flatMap((person) => {
        if (person.type_dirigeant === "personne morale" || !person.nom) return [];
        return [{ name: [person.prenoms, person.nom].filter(Boolean).join(" "), role: person.qualite || "Dirigeant déclaré" }];
      });
      return [{
        siren: record.siren,
        name: record.nom_complet || record.nom_raison_sociale || record.siren,
        city: record.siege?.libelle_commune || "",
        postalCode: record.siege?.code_postal || "",
        activityCode: record.activite_principale || "",
        employeeBand: employeeBands.find((band) => band.codes.some((code) => code === record.tranche_effectif_salarie))?.label,
        contacts: [...new Map(contacts.map((person) => [person.name + "|" + person.role, person])).values()],
      }];
    });
    return Response.json({ companies, total: data.total_results, page: data.page, pages: data.total_pages } satisfies LeadSearchResult);
  } catch {
    return Response.json({ error: "L’annuaire public est momentanément indisponible. Réessayez dans un instant." }, { status: 502 });
  }
}
