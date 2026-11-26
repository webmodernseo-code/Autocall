"use client";

import Link from "next/link";
import {
  findDocumentPlaceholders,
  LEGAL_DOCUMENTS,
  type LegalDocument,
} from "./legal-docs";

function slugifyHeading(heading: string, index: number): string {
  const base = heading
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `section-${index + 1}`;
}

export function LegalPageLayout({ doc }: { doc: LegalDocument }) {
  const version = doc.version ?? "V1.0";
  const status = doc.status ?? "Brouillon";
  const placeholders = findDocumentPlaceholders(doc);
  const showToc = doc.sections.length >= 4;

  return (
    <div className="min-h-dvh bg-[#FAFBFB] text-[#171717]">
      {/* Header sobre fixe */}
      <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-[#FAFBFB]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3.5 sm:px-10">
          <Link
            href="/landing"
            className="inline-flex items-center gap-2 text-[17px] font-bold tracking-tight text-[#171717]"
          >
            <svg
              viewBox="0 0 64 64"
              className="size-7 shrink-0 text-[#184D3B]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
            </svg>
            <span>AutoCall</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href="/legal"
              className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3.5 text-[13.5px] font-medium text-[#171717] transition hover:bg-gray-50"
            >
              Centre juridique
            </Link>
            <Link
              href="/landing"
              className="hidden h-9 items-center rounded-lg border border-gray-200 bg-white px-3.5 text-[13.5px] font-medium text-[#525252] transition hover:bg-gray-50 sm:inline-flex"
            >
              Accueil
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center rounded-lg bg-[#184D3B] px-4 text-[13.5px] font-medium text-white transition hover:bg-[#133D2E]"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-10 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Sommaire latéral des pages juridiques */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
                <Link
                  href="/legal"
                  className="block px-2.5 text-[12px] font-semibold tracking-wide text-[#184D3B] hover:underline"
                >
                  Centre juridique
                </Link>
                <nav aria-label="Documents juridiques" className="mt-2.5 space-y-1">
                  {LEGAL_DOCUMENTS.map((item) => {
                    const active = item.slug === doc.slug;
                    return (
                      <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        className={`block rounded-xl px-3 py-2 text-[13.5px] transition ${
                          active
                            ? "bg-[#184D3B]/10 font-semibold text-[#184D3B]"
                            : "text-[#525252] hover:bg-gray-50 hover:text-[#171717]"
                        }`}
                      >
                        {item.shortTitle}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Contenu du document limité à ~800px pour une lecture éditoriale confortable */}
          <article className="lg:col-span-8 xl:col-span-9">
            <div className="mx-auto max-w-[800px] rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-2xs sm:px-12 sm:py-11">
              <header className="border-b border-gray-200/80 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[12px] font-medium text-[#525252]">
                    <span className="size-1.5 rounded-full bg-[#184D3B]" />
                    {doc.category}
                  </span>
                  <span className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[12px] font-medium text-[#171717]">
                    {version}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[12px] font-medium ${
                      status === "Publié"
                        ? "border-[#184D3B]/25 bg-[#184D3B]/10 text-[#184D3B]"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    }`}
                  >
                    Statut : {status}
                  </span>
                </div>

                <h1 className="mt-4 text-[26px] font-semibold tracking-tight text-[#171717] sm:text-[32px]">
                  {doc.title}
                </h1>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-[#737373]">
                  <span>Dernière mise à jour : {doc.updatedAt}</span>
                  <span>Version : {version}</span>
                  {doc.effectiveDate && (
                    <span>Entrée en vigueur : {doc.effectiveDate}</span>
                  )}
                </div>

                {status === "Brouillon" && placeholders.length > 0 && (
                  <p className="mt-4 border-l-2 border-[#184D3B] pl-3.5 text-[13px] leading-relaxed text-[#525252]">
                    Document en cours de validation juridique et technique ({placeholders.length}{" "}
                    champ{placeholders.length > 1 ? "s" : ""} à compléter avant publication).
                  </p>
                )}

                {doc.intro && (
                  <p className="mt-5 text-[15.5px] leading-relaxed text-[#404040]">
                    {doc.intro}
                  </p>
                )}
              </header>

              {/* Table des matières pour les documents longs */}
              {showToc && (
                <nav
                  aria-label="Table des matières"
                  className="mt-6 border-b border-gray-200/80 pb-6"
                >
                  <p className="text-[12.5px] font-semibold text-[#184D3B]">
                    Table des matières
                  </p>
                  <ol className="mt-2.5 grid grid-cols-1 gap-1.5 text-[13.5px] text-[#525252] sm:grid-cols-2">
                    {doc.sections.map((section, idx) => (
                      <li key={section.heading}>
                        <a
                          href={`#${slugifyHeading(section.heading, idx)}`}
                          className="inline-block py-0.5 transition hover:text-[#184D3B] hover:underline"
                        >
                          {section.heading}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Corps éditorial sans cartes superflues */}
              <div className="mt-8 space-y-8">
                {doc.sections.map((section, idx) => (
                  <section
                    key={section.heading}
                    id={slugifyHeading(section.heading, idx)}
                    className="scroll-mt-24 space-y-3"
                  >
                    <h2 className="text-[18px] font-semibold text-[#171717]">
                      {section.heading}
                    </h2>

                    {section.paragraphs?.map((p) => (
                      <p
                        key={p}
                        className="text-[15px] leading-[1.7] text-[#404040]"
                      >
                        {p}
                      </p>
                    ))}

                    {section.bullets && (
                      <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-[1.7] text-[#404040]">
                        {section.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}

                    {section.table && (
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full min-w-[460px] border-collapse text-left text-[13.5px]">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 text-[#171717]">
                              {section.table.headers.map((h) => (
                                <th key={h} className="px-4 py-2.5 font-semibold">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-[#404040]">
                            {section.table.rows.map((row, rowIdx) => (
                              <tr key={rowIdx}>
                                {row.map((cell, cellIdx) => (
                                  <td key={cellIdx} className="px-4 py-2.5">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
