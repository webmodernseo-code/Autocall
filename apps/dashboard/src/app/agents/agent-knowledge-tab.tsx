"use client";

import { useState } from "react";
import { PremiumSelect } from "../premium-select";
import { SolarIcon } from "../workspace-navigation";

interface KnowledgeFile {
  id: string;
  name: string;
  ext: "PDF" | "DOC";
  chunks: string;
  size: string;
  scope: string;
  syncedAt: string;
}

interface ReflexFaq {
  id: string;
  question: string;
  answer: string;
  triggers: number;
  matchRate: string;
}

const initialFiles: KnowledgeFile[] = [
  {
    id: "kf-1",
    name: "Grille_Tarifaire_AutoCall_2026.pdf",
    ext: "PDF",
    chunks: "Chunk ID : #CHK-801 · 18 segments",
    size: "PDF · 2,4 Mo",
    scope: "Tarifs et abonnements B2B",
    syncedAt: "Dernière synchro il y a 2 h",
  },
  {
    id: "kf-2",
    name: "Guide_Qualification_BANT_Prospects.docx",
    ext: "DOC",
    chunks: "Chunk ID : #CHK-412 · 9 segments",
    size: "Word · 850 Ko",
    scope: "Critères de scoring commercial",
    syncedAt: "Dernière synchro hier",
  },
  {
    id: "kf-3",
    name: "Politique_Confidentialite_RGPD_ARCEP.pdf",
    ext: "PDF",
    chunks: "Chunk ID : #CHK-118 · 12 segments",
    size: "PDF · 1,1 Mo",
    scope: "Mentions légales et refus de démarchage",
    syncedAt: "Dernière synchro il y a 3 jours",
  },
  {
    id: "kf-4",
    name: "Catalogue_Offres_Options_Telephonie.pdf",
    ext: "PDF",
    chunks: "Chunk ID : #CHK-930 · 31 segments",
    size: "PDF · 4,2 Mo",
    scope: "Détail des SDA et Trunks SIP",
    syncedAt: "Dernière synchro il y a 5 jours",
  },
];

const initialFaqs: ReflexFaq[] = [
  {
    id: "faq-1",
    question: "Quel est le délai de déploiement d’un agent ?",
    answer:
      "« Moins de 24 h ouvrées après validation du scénario et attribution de la ligne SIP. »",
    triggers: 214,
    matchRate: "100 %",
  },
  {
    id: "faq-2",
    question: "Puis-je conserver mon numéro de téléphone actuel ?",
    answer:
      "« Oui, par simple transfert d’appel ou portabilité RIO sous 5 jours ouvrés. »",
    triggers: 178,
    matchRate: "100 %",
  },
  {
    id: "faq-3",
    question: "Comment fonctionne la facturation des minutes excédentaires ?",
    answer: "« Au tarif préférentiel de 0,14 €/min sans coupure de service. »",
    triggers: 92,
    matchRate: "99,4 %",
  },
];

export function AgentKnowledgeTab({ agentName }: { agentName: string }) {
  const [files, setFiles] = useState<KnowledgeFile[]>(initialFiles);
  const [faqs, setFaqs] = useState<ReflexFaq[]>(initialFaqs);
  const [query, setQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState<"all" | "PDF" | "DOC">("all");
  const [faqFormOpen, setFaqFormOpen] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [reindexMsg, setReindexMsg] = useState<string | null>(null);

  const filteredFiles = files.filter((f) => {
    if (formatFilter !== "all" && f.ext !== formatFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      f.name.toLowerCase().includes(q) || f.scope.toLowerCase().includes(q)
    );
  });

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.trim() || !newA.trim()) return;
    setFaqs((prev) => [
      {
        id: `faq-${prev.length + 1}`,
        question: newQ.trim(),
        answer: `« ${newA.trim()} »`,
        triggers: 0,
        matchRate: "100 %",
      },
      ...prev,
    ]);
    setNewQ("");
    setNewA("");
    setFaqFormOpen(false);
  };

  const triggerReindex = (msg: string) => {
    setReindexMsg(msg);
    window.setTimeout(() => setReindexMsg(null), 2400);
  };

  return (
    <div className="space-y-5">
      {/* Bandeau RAG temps réel */}
      <section className="flex flex-col gap-4 rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--brand-primary)] bg-[var(--surface)] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h4 className="text-[15px] font-semibold text-[var(--foreground)]">
              Base de connaissances &amp; Indexation sémantique (RAG temps réel)
            </h4>
            <span className="rounded-md bg-[var(--success-bg)] px-2 py-0.5 text-[12.5px] font-medium text-[var(--success)]">
              Indexation vectorielle (&lt; 120 ms)
            </span>
          </div>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
            {agentName} puise ses réponses factuelles dans ces documents. En cas
            de question hors périmètre, {agentName} bascule sans inventer de
            données non documentées.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-lg bg-[var(--surface-inset)] px-3 py-1.5 text-[13px]">
            <span className="block text-[var(--text-muted)]">
              Espace mémoire vectoriel
            </span>
            <strong className="text-[var(--foreground)] tabular-nums">
              428 Ko / 10 Mo
            </strong>
          </div>
          <button
            type="button"
            onClick={() =>
              triggerReindex("Réindexation vectorielle terminée (110 ms).")
            }
            className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
          >
            {reindexMsg ? "✓ Réindexé" : "Tout réindexer"}
          </button>
        </div>
      </section>

      {/* 4 KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between text-[14px] text-[var(--text-secondary)]">
            <span>Documents &amp; fichiers</span>
            <SolarIcon name="crm" className="size-4 text-[var(--brand-primary)]" />
          </div>
          <p className="mt-2 text-[22px] font-semibold text-[var(--foreground)] tabular-nums">
            {files.length} actifs
          </p>
          <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
            PDF, DOCX, Notion · 428 Ko
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between text-[14px] text-[var(--text-secondary)]">
            <span>Paires FAQ directes</span>
            <SolarIcon name="conversations" className="size-4 text-[var(--info)]" />
          </div>
          <p className="mt-2 text-[22px] font-semibold text-[var(--foreground)] tabular-nums">
            {faqs.length} paires
          </p>
          <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
            Réponses réflexes instantanées
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between text-[14px] text-[var(--text-secondary)]">
            <span>Sources Web &amp; API</span>
            <SolarIcon name="globe" className="size-4 text-[var(--warning)]" />
          </div>
          <p className="mt-2 text-[22px] font-semibold text-[var(--foreground)] tabular-nums">
            2 URL actives
          </p>
          <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
            Synchro auto toutes les 24 h
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between text-[14px] text-[var(--text-secondary)]">
            <span>Taux d’assimilation RAG</span>
            <SolarIcon name="sparkle" className="size-4 text-[var(--ai)]" />
          </div>
          <p className="mt-2 text-[22px] font-semibold text-[var(--foreground)] tabular-nums">
            98,4 %
          </p>
          <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
            0 conflit sémantique détecté
          </p>
        </div>
      </div>

      {/* Barre de recherche & actions */}
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un terme ou un document..."
            aria-label="Rechercher un document"
            className="h-9 min-w-[200px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 text-[14px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--focus-ring)] focus:bg-[var(--surface)] focus:outline-none"
          />
          <PremiumSelect
            value={formatFilter}
            onChange={(val) => setFormatFilter(val as "all" | "PDF" | "DOC")}
            ariaLabel="Filtrer par format"
            className="min-w-[165px]"
            options={[
              { value: "all", label: "Tous les formats" },
              { value: "PDF", label: "PDF" },
              { value: "DOC", label: "DOCX" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFaqFormOpen((prev) => !prev)}
            className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
          >
            + Ajouter une FAQ manuelle
          </button>
          <button
            type="button"
            onClick={() =>
              setFiles((prev) => [
                {
                  id: `kf-${prev.length + 1}`,
                  name: `Guide_Produit_AutoCall_v${prev.length + 1}.pdf`,
                  ext: "PDF",
                  chunks: "Chunk ID : #CHK-992 · 14 segments",
                  size: "PDF · 1,6 Mo",
                  scope: "Présentation produit & cas clients",
                  syncedAt: "À l’instant",
                },
                ...prev,
              ])
            }
            className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-3.5 text-[14px] font-medium text-white hover:bg-[var(--primary-hover)] cursor-pointer"
          >
            + Importer des documents
          </button>
        </div>
      </div>

      {/* Tableau Documents & Fichiers */}
      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
          <div>
            <h4 className="text-[14.5px] font-semibold text-[var(--foreground)]">
              Documents &amp; fichiers de référence importés
            </h4>
            <p className="text-[13px] text-[var(--text-muted)]">
              Vectorisés en segments de 250 tokens pour extraction vocale
              instantanée.
            </p>
          </div>
          <span className="text-[13px] text-[var(--text-muted)]">
            {filteredFiles.length} documents affichés
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--background)] text-[13px] font-medium text-[var(--text-secondary)]">
                <th className="px-4 py-2.5">Document &amp; nom de fichier</th>
                <th className="px-4 py-2.5">Type &amp; poids</th>
                <th className="px-4 py-2.5">Périmètre / Rôle</th>
                <th className="px-4 py-2.5">Statut &amp; synchro</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[14px]">
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className="transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold ${
                          file.ext === "PDF"
                            ? "bg-[var(--danger-bg)] text-[var(--danger)]"
                            : "bg-[var(--info-bg)] text-[var(--info)]"
                        }`}
                      >
                        {file.ext}
                      </span>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {file.name}
                        </p>
                        <p className="text-[12.5px] text-[var(--text-muted)]">
                          {file.chunks}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {file.size}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {file.scope}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--success)]">
                      ● Indexé &amp; Actif
                    </p>
                    <p className="text-[12.5px] text-[var(--text-muted)]">
                      {file.syncedAt}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setFiles((prev) =>
                          prev.filter((item) => item.id !== file.id),
                        )
                      }
                      className="text-[13px] text-[var(--text-muted)] hover:text-[var(--danger)] cursor-pointer"
                    >
                      Retirer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bas de page : FAQ & Réponses réflexes + Sources externes */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr]">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-[1_1_13rem]">
              <h4 className="text-[14.5px] font-semibold text-[var(--foreground)]">
                FAQ &amp; Réponses réflexes
              </h4>
              <p className="text-[13px] text-[var(--text-muted)]">
                Répond en moins de 60 ms aux questions critiques en plein appel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFaqFormOpen((prev) => !prev)}
              aria-expanded={faqFormOpen}
              className="inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
            >
              {faqFormOpen ? "Annuler" : "+ Nouvelle réponse"}
            </button>
          </div>

          {faqFormOpen && (
            <form
              onSubmit={handleAddFaq}
              className="mt-3 space-y-2.5 rounded-xl bg-[var(--surface-inset)] p-3.5"
            >
              <input
                type="text"
                value={newQ}
                onChange={(e) => setNewQ(e.target.value)}
                placeholder="Question fréquente du prospect..."
                required
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[14px]"
              />
              <input
                type="text"
                value={newA}
                onChange={(e) => setNewA(e.target.value)}
                placeholder="Réponse exacte à prononcer..."
                required
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[14px]"
              />
              <button
                type="submit"
                className="inline-flex h-8.5 items-center rounded-lg bg-[#00B489] px-3.5 text-[13.5px] font-medium text-white hover:bg-[#009E78] cursor-pointer"
              >
                Enregistrer la FAQ
              </button>
            </form>
          )}

          <ul className="mt-4 space-y-3">
            {faqs.map((faq) => (
              <li
                key={faq.id}
                className="rounded-xl border border-[var(--border-subtle)] p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[var(--info-bg)] px-2 py-0.5 text-[12px] font-medium text-[var(--info)]">
                      Priorité maximale
                    </span>
                    <p className="text-[13.5px] font-semibold text-[var(--foreground)]">
                      {faq.question}
                    </p>
                  </div>
                </div>
                <p className="mt-2 rounded-lg bg-[var(--surface-inset)] px-3 py-2 text-[13.5px] text-[var(--text-secondary)]">
                  {faq.answer}
                </p>
                <div className="mt-2 flex items-center justify-between text-[12.5px]">
                  <span className="text-[var(--text-muted)]">
                    Déclenché {faq.triggers} fois ce mois-ci
                  </span>
                  <span className="font-medium text-[var(--success)]">
                    {faq.matchRate} de concordance vocale
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div>
            <h4 className="text-[14.5px] font-semibold text-[var(--foreground)]">
              Sources externes &amp; Synchronisation
            </h4>
            <p className="text-[13px] text-[var(--text-muted)]">
              Flux synchronisés en continu pour garder {agentName} à jour.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[13.5px] font-semibold text-[var(--foreground)]">
                Site vitrine &amp; Centre d’aide web
              </p>
              <span className="size-2 rounded-full bg-[var(--success)]" />
            </div>
            <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
              https://autocall.ai/aide · 24 pages indexées
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[13px]">
              <span className="text-[var(--text-secondary)]">
                Synchro quotidienne à 04 h 00
              </span>
              <button
                type="button"
                onClick={() =>
                  triggerReindex("Synchronisation web effectuée.")
                }
                className="rounded-md border border-[var(--border)] px-2.5 py-1 font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
              >
                Synchroniser
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[13.5px] font-semibold text-[var(--foreground)]">
                Base Notion Sales Playbook
              </p>
              <span className="size-2 rounded-full bg-[var(--success)]" />
            </div>
            <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
              Espace commercial / Objections · Connecté via API
            </p>
            <p className="mt-2 text-[13px] font-medium text-[var(--success)]">
              Modifié il y a 14 min · Webhook actif
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

