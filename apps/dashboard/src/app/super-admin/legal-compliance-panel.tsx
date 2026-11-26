"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  ComplianceState,
  ManagedLegalDocument,
} from "@/lib/compliance-store";
import { PremiumSelect } from "../premium-select";

type SuperAdminTab = "documents" | "acceptances" | "gdpr" | "incidents";

export function LegalCompliancePanel() {
  const [state, setState] = useState<ComplianceState | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SuperAdminTab>("documents");
  const [openMenuSlug, setOpenMenuSlug] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<ManagedLegalDocument | null>(null);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [draftSlug, setDraftSlug] = useState("legal-notice");
  const [draftVersion, setDraftVersion] = useState("V1.1");
  const [draftEffectiveDate, setDraftEffectiveDate] = useState("");
  const [draftSummary, setDraftSummary] = useState("");

  // Incident modal
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [incKind, setIncKind] = useState<"abus" | "sécurité">("abus");
  const [incTitle, setIncTitle] = useState("");
  const [incSeverity, setIncSeverity] = useState<"faible" | "modérée" | "élevée">("modérée");
  const [incDesc, setIncDesc] = useState("");

  // GDPR request modal
  const [gdprModalOpen, setGdprModalOpen] = useState(false);
  const [gdprEmail, setGdprEmail] = useState("");
  const [gdprCompany, setGdprCompany] = useState("");
  const [gdprType, setGdprType] = useState<
    "export" | "suppression" | "opposition" | "rectification"
  >("export");
  const [gdprNotes, setGdprNotes] = useState("");

  const [feedback, setFeedback] = useState<{
    tone: "ok" | "error";
    message: string;
  } | null>(null);

  const notify = (tone: "ok" | "error", message: string) => {
    setFeedback({ tone, message });
    window.setTimeout(() => setFeedback(null), 4500);
  };

  const fetchState = async () => {
    try {
      const res = await fetch("/api/compliance", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as ComplianceState;
        setState(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchState();
  }, []);

  const handlePublish = async (doc: ManagedLegalDocument, notifyClients: boolean) => {
    setOpenMenuSlug(null);
    const res = await fetch("/api/compliance/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "publish",
        slug: doc.slug,
        notifyClients,
      }),
    });
    const data = (await res.json()) as {
      ok: boolean;
      error?: string;
      missingPlaceholders?: string[];
    };
    if (!data.ok) {
      const details = data.missingPlaceholders?.length
        ? ` (${data.missingPlaceholders.slice(0, 3).join(", ")}${
            data.missingPlaceholders.length > 3 ? "…" : ""
          })`
        : "";
      notify("error", `${data.error ?? "Publication impossible"}${details}`);
    } else {
      notify("ok", `${doc.shortTitle} publié en version ${doc.currentVersion}.`);
    }
    await fetchState();
  };

  const handleCreateDraft = async () => {
    const res = await fetch("/api/compliance/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_draft",
        slug: draftSlug,
        version: draftVersion.trim() || "V1.1",
        effectiveDate: draftEffectiveDate || null,
        changeSummary: draftSummary.trim() || "Nouvelle révision en brouillon.",
      }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    if (data.ok) {
      setDraftModalOpen(false);
      setDraftSummary("");
      notify("ok", `Brouillon ${draftVersion} enregistré.`);
      await fetchState();
    } else {
      notify("error", data.error ?? "Impossible de créer le brouillon.");
    }
  };

  const handleCreateGdpr = async () => {
    if (!gdprEmail.trim()) return;
    await fetch("/api/compliance/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "gdpr_request",
        requesterEmail: gdprEmail.trim(),
        companyName: gdprCompany.trim() || "Client AutoCall",
        requestType: gdprType,
        notes: gdprNotes.trim(),
      }),
    });
    setGdprModalOpen(false);
    setGdprEmail("");
    setGdprCompany("");
    setGdprNotes("");
    notify("ok", "Demande RGPD enregistrée.");
    await fetchState();
  };

  const handleUpdateGdprStatus = async (
    id: string,
    status: "En attente" | "En cours" | "Traitée"
  ) => {
    await fetch("/api/compliance/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "gdpr_status", id, status }),
    });
    notify("ok", `Demande RGPD passée à : ${status}`);
    await fetchState();
  };

  const handleCreateIncident = async () => {
    if (!incTitle.trim()) return;
    await fetch("/api/compliance/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "incident",
        incidentKind: incKind,
        title: incTitle.trim(),
        severity: incSeverity,
        description: incDesc.trim(),
      }),
    });
    setIncidentModalOpen(false);
    setIncTitle("");
    setIncDesc("");
    notify("ok", "Incident enregistré dans le registre.");
    await fetchState();
  };

  const docs = state?.documents ?? [];
  const publishedCount = docs.filter((d) => d.status === "Publié").length;
  const gdprCount = state?.gdprRequests.length ?? 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs sm:p-8">
      {feedback && (
        <div
          className={`mb-5 rounded-xl border px-4 py-3 text-[13.5px] font-medium ${
            feedback.tone === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-[#184D3B]/25 bg-[#184D3B]/10 text-[#184D3B]"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
            Juridique et conformité
          </h1>
          <p className="mt-1 text-[13.5px] text-gray-500">
            Gestion centralisée des obligations et documents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDraftModalOpen(true)}
          className="inline-flex h-10 items-center rounded-xl bg-[#184D3B] px-4 text-[13.5px] font-semibold text-white transition hover:bg-[#133D2E] cursor-pointer"
        >
          + Document
        </button>
      </div>

      {/* 3 KPIs */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-[28px] font-bold tracking-tight text-gray-900">
            {docs.length || 15}
          </p>
          <p className="mt-1 text-[13px] text-gray-500">Documents prévus</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-[28px] font-bold tracking-tight text-gray-900">
            {publishedCount > 0 ? publishedCount : "—"}
          </p>
          <p className="mt-1 text-[13px] text-gray-500">Versions publiées</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-[28px] font-bold tracking-tight text-gray-900">
            {gdprCount > 0 ? gdprCount : "—"}
          </p>
          <p className="mt-1 text-[13px] text-gray-500">Demandes RGPD</p>
        </div>
      </div>

      {/* Note de validation juridique UE & Afrique */}
      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3.5 text-[12.5px] leading-relaxed text-gray-600">
        <p className="font-semibold text-gray-900">
          Validation requise avant lancement commercial (Europe &amp; Afrique)
        </p>
        <p className="mt-1">
          Les documents restent en statut <strong>Brouillon</strong> tant que les champs non renseignés subsistent (statut juridique, tarifs/devises, sous-traitants, durées de conservation, obligations télécoms et lois locales applicables dans les pays d&apos;Afrique ciblés : autorités de protection des données, transferts transfrontaliers et règles d&apos;appel).
        </p>
      </div>

      {/* Onglets */}
      <div className="mt-7 border-b border-gray-200">
        <nav aria-label="Onglets Juridique et conformité" className="flex flex-wrap gap-6">
          {(
            [
              { id: "documents", label: "Documents" },
              { id: "acceptances", label: "Acceptations" },
              { id: "gdpr", label: "Demandes RGPD" },
              { id: "incidents", label: "Incidents" },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 pb-3 text-[14px] transition cursor-pointer ${
                  active
                    ? "border-[#184D3B] font-semibold text-[#184D3B]"
                    : "border-transparent font-medium text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[14px] text-gray-500">
          Chargement du registre de conformité…
        </div>
      ) : (
        <>
          {/* Onglet 1 : Documents */}
          {activeTab === "documents" && (
            <div className="mt-4 overflow-visible">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-[12.5px] font-medium text-gray-500">
                      <th className="py-3 pr-4">Document</th>
                      <th className="py-3 px-4">Version</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4">Champs manquants</th>
                      <th className="py-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[14px]">
                    {docs.map((doc) => (
                      <tr key={doc.slug} className="hover:bg-gray-50/50">
                        <td className="py-3.5 pr-4 font-semibold text-gray-900">
                          <Link
                            href={`/${doc.slug}`}
                            className="hover:text-[#184D3B] hover:underline"
                          >
                            {doc.shortTitle}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {doc.currentVersion}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[12px] font-medium ${
                              doc.status === "Publié"
                                ? "border-[#184D3B]/25 bg-[#184D3B]/10 text-[#184D3B]"
                                : "border-gray-200 bg-gray-50 text-gray-600"
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[12.5px] text-gray-500">
                          {doc.missingPlaceholders.length > 0
                            ? `${doc.missingPlaceholders.length} à renseigner`
                            : "Complet"}
                        </td>
                        <td className="relative py-3.5 pl-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuSlug(
                                openMenuSlug === doc.slug ? null : doc.slug
                              )
                            }
                            aria-label={`Actions pour ${doc.shortTitle}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                              <circle cx="4" cy="10" r="1.5" />
                              <circle cx="10" cy="10" r="1.5" />
                              <circle cx="16" cy="10" r="1.5" />
                            </svg>
                          </button>

                          {openMenuSlug === doc.slug && (
                            <div className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-lg">
                              <Link
                                href={`/${doc.slug}`}
                                className="block rounded-lg px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
                              >
                                Consulter le document
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuSlug(null);
                                  setSelectedDoc(doc);
                                }}
                                className="block w-full rounded-lg px-3 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer"
                              >
                                Historique des versions ({doc.history.length})
                              </button>
                              <button
                                type="button"
                                onClick={() => void handlePublish(doc, false)}
                                className="block w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-[#184D3B] hover:bg-[#184D3B]/10 cursor-pointer"
                              >
                                Publier la version
                              </button>
                              <button
                                type="button"
                                onClick={() => void handlePublish(doc, true)}
                                className="block w-full rounded-lg px-3 py-2 text-left text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer"
                              >
                                Publier et notifier les clients
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Onglet 2 : Acceptations */}
          {activeTab === "acceptances" && (
            <div className="mt-5 space-y-6">
              <div>
                <h2 className="text-[15px] font-semibold text-gray-900">
                  Preuves d&apos;acceptation contractuelle et consentements
                </h2>
                <p className="mt-0.5 text-[13px] text-gray-500">
                  Distinction entre acceptation contractuelle, consentement RGPD et information préalable.
                </p>
              </div>

              {state?.acceptances.length ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full min-w-[540px] border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                        <th className="px-4 py-2.5 font-medium">Client</th>
                        <th className="px-4 py-2.5 font-medium">Document</th>
                        <th className="px-4 py-2.5 font-medium">Nature juridique</th>
                        <th className="px-4 py-2.5 font-medium">Contexte</th>
                        <th className="px-4 py-2.5 font-medium">Horodatage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {state.acceptances.map((acc) => (
                        <tr key={acc.id}>
                          <td className="px-4 py-2.5 font-medium text-gray-900">
                            {acc.clientEmail}
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">
                            /{acc.documentSlug} ({acc.documentVersion})
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">
                            {acc.legalBasisType}
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">{acc.context}</td>
                          <td className="px-4 py-2.5 text-gray-500">
                            {new Date(acc.acceptedAt).toLocaleString("fr-FR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center text-[13.5px] text-gray-500">
                  Aucune acceptation enregistrée pour le moment. Les validations effectuées lors de l&apos;inscription, de la souscription ou des campagnes apparaîtront ici.
                </div>
              )}
            </div>
          )}

          {/* Onglet 3 : Demandes RGPD */}
          {activeTab === "gdpr" && (
            <div className="mt-5 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">
                    Demandes d&apos;exercice de droits RGPD
                  </h2>
                  <p className="mt-0.5 text-[13px] text-gray-500">
                    Exportation, suppression, rectification et oppositions à la prospection.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setGdprModalOpen(true)}
                  className="h-9 rounded-xl border border-gray-200 bg-white px-3.5 text-[13px] font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer"
                >
                  + Nouvelle demande RGPD
                </button>
              </div>

              {state?.gdprRequests.length ? (
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
                  {state.gdprRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5"
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-gray-900">
                          {req.requesterEmail} · {req.requestType}
                        </p>
                        <p className="text-[12.5px] text-gray-500">
                          {req.companyName} · {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                          {req.notes ? ` · ${req.notes}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[12px] font-medium text-gray-700">
                          {req.status}
                        </span>
                        {req.status !== "Traitée" && (
                          <button
                            type="button"
                            onClick={() => void handleUpdateGdprStatus(req.id, "Traitée")}
                            className="h-8 rounded-lg bg-[#184D3B] px-3 text-[12px] font-semibold text-white hover:bg-[#133D2E] cursor-pointer"
                          >
                            Marquer traitée
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center text-[13.5px] text-gray-500">
                  Aucune demande RGPD en cours.
                </div>
              )}
            </div>
          )}

          {/* Onglet 4 : Incidents & Sous-traitants */}
          {activeTab === "incidents" && (
            <div className="mt-5 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">
                    Signalements d&apos;abus et incidents de sécurité
                  </h2>
                  <p className="mt-0.5 text-[13px] text-gray-500">
                    Suivi des incidents, mesures correctives et validation des sous-traitants.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIncidentModalOpen(true)}
                  className="h-9 rounded-xl border border-gray-200 bg-white px-3.5 text-[13px] font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer"
                >
                  + Déclarer un incident
                </button>
              </div>

              {state?.incidents.length ? (
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
                  {state.incidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5"
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-gray-900">
                          {inc.title} ({inc.kind})
                        </p>
                        <p className="text-[12.5px] text-gray-500">
                          Gravité : {inc.severity} · {inc.description || "Aucun détail complémentaire"}
                        </p>
                      </div>
                      <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[12px] font-medium text-gray-700">
                        {inc.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center text-[13.5px] text-gray-500">
                  Aucun incident ou signalement d&apos;abus déclaré.
                </div>
              )}

              <div>
                <h3 className="text-[14.5px] font-semibold text-gray-900">
                  Sous-traitants déclarés (à vérifier avant publication)
                </h3>
                <div className="mt-2.5 divide-y divide-gray-100 rounded-xl border border-gray-200">
                  {(state?.subprocessors ?? []).map((sub) => (
                    <div
                      key={sub.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                    >
                      <div>
                        <p className="text-[13.5px] font-semibold text-gray-900">
                          {sub.service} — {sub.entityName}
                        </p>
                        <p className="text-[12px] text-gray-500">
                          Pays : {sub.processingCountry} · Garanties : {sub.transferSafeguards}
                        </p>
                      </div>
                      <span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[12px] font-medium text-amber-800">
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Nouveau brouillon / version */}
      {draftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
            <h3 className="text-[16px] font-bold text-gray-900">
              Créer une version brouillon
            </h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[13px] font-medium text-gray-700">
                  Document
                </label>
                <PremiumSelect
                  value={draftSlug}
                  onChange={setDraftSlug}
                  ariaLabel="Document juridique"
                  className="mt-1"
                  options={docs.map((d) => ({ value: d.slug, label: d.shortTitle }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700">
                    Numéro de version
                  </label>
                  <input
                    type="text"
                    value={draftVersion}
                    onChange={(e) => setDraftVersion(e.target.value)}
                    placeholder="V1.1"
                    className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3 text-[14px] outline-none focus:border-[#184D3B]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700">
                    Entrée en vigueur
                  </label>
                  <input
                    type="date"
                    value={draftEffectiveDate}
                    onChange={(e) => setDraftEffectiveDate(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3 text-[14px] outline-none focus:border-[#184D3B]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700">
                  Résumé des modifications
                </label>
                <input
                  type="text"
                  value={draftSummary}
                  onChange={(e) => setDraftSummary(e.target.value)}
                  placeholder="Ex: Mise à jour des coordonnées et du DPO"
                  className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3 text-[14px] outline-none focus:border-[#184D3B]"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDraftModalOpen(false)}
                className="h-9 rounded-xl border border-gray-200 px-3.5 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void handleCreateDraft()}
                className="h-9 rounded-xl bg-[#184D3B] px-4 text-[13.5px] font-semibold text-white hover:bg-[#133D2E] cursor-pointer"
              >
                Enregistrer le brouillon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historique des versions */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
            <h3 className="text-[16px] font-bold text-gray-900">
              Historique — {selectedDoc.shortTitle}
            </h3>
            <div className="mt-4 max-h-72 space-y-2.5 overflow-y-auto">
              {selectedDoc.history.map((h, i) => (
                <div
                  key={`${h.version}-${i}`}
                  className="rounded-xl border border-gray-200 bg-gray-50/50 p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-semibold text-gray-900">
                      {h.version} · {h.status}
                    </span>
                    <span className="text-[12px] text-gray-500">
                      {h.effectiveDate ? `Effet : ${h.effectiveDate}` : h.updatedAt}
                    </span>
                  </div>
                  <p className="mt-1 text-[12.5px] text-gray-600">{h.changeSummary}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="h-9 rounded-xl border border-gray-200 px-4 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvelle demande RGPD */}
      {gdprModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
            <h3 className="text-[16px] font-bold text-gray-900">
              Nouvelle demande RGPD
            </h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[13px] font-medium text-gray-700">
                  E-mail du demandeur
                </label>
                <input
                  type="email"
                  value={gdprEmail}
                  onChange={(e) => setGdprEmail(e.target.value)}
                  placeholder="contact@entreprise.fr"
                  className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3 text-[14px] outline-none focus:border-[#184D3B]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700">
                  Entreprise
                </label>
                <input
                  type="text"
                  value={gdprCompany}
                  onChange={(e) => setGdprCompany(e.target.value)}
                  placeholder="Nom du client"
                  className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3 text-[14px] outline-none focus:border-[#184D3B]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700">
                  Type de demande
                </label>
                <PremiumSelect
                  value={gdprType}
                  onChange={(v) =>
                    setGdprType(
                      v as "export" | "suppression" | "opposition" | "rectification"
                    )
                  }
                  ariaLabel="Type de demande RGPD"
                  className="mt-1"
                  options={[
                    { value: "export", label: "Exportation des données" },
                    { value: "suppression", label: "Suppression / Effacement" },
                    { value: "opposition", label: "Opposition à la prospection" },
                    { value: "rectification", label: "Rectification" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700">
                  Notes
                </label>
                <input
                  type="text"
                  value={gdprNotes}
                  onChange={(e) => setGdprNotes(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3 text-[14px] outline-none focus:border-[#184D3B]"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setGdprModalOpen(false)}
                className="h-9 rounded-xl border border-gray-200 px-3.5 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void handleCreateGdpr()}
                className="h-9 rounded-xl bg-[#184D3B] px-4 text-[13.5px] font-semibold text-white hover:bg-[#133D2E] cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Déclarer un incident */}
      {incidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
            <h3 className="text-[16px] font-bold text-gray-900">
              Déclarer un incident ou signalement
            </h3>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700">
                    Catégorie
                  </label>
                  <PremiumSelect
                    value={incKind}
                    onChange={(v) => setIncKind(v as "abus" | "sécurité")}
                    ariaLabel="Catégorie d'incident"
                    className="mt-1"
                    options={[
                      { value: "abus", label: "Abus" },
                      { value: "sécurité", label: "Sécurité" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700">
                    Gravité
                  </label>
                  <PremiumSelect
                    value={incSeverity}
                    onChange={(v) =>
                      setIncSeverity(v as "faible" | "modérée" | "élevée")
                    }
                    ariaLabel="Gravité de l'incident"
                    className="mt-1"
                    options={[
                      { value: "faible", label: "Faible" },
                      { value: "modérée", label: "Modérée" },
                      { value: "élevée", label: "Élevée" },
                    ]}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                  placeholder="Ex: Signalement prospection non sollicitée"
                  className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3 text-[14px] outline-none focus:border-[#184D3B]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3 text-[14px] outline-none focus:border-[#184D3B]"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIncidentModalOpen(false)}
                className="h-9 rounded-xl border border-gray-200 px-3.5 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void handleCreateIncident()}
                className="h-9 rounded-xl bg-[#184D3B] px-4 text-[13.5px] font-semibold text-white hover:bg-[#133D2E] cursor-pointer"
              >
                Déclarer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

