"use client";

import Link from "next/link";
import { findDocumentPlaceholders, LEGAL_DOCUMENTS } from "./legal-docs";

export default function LegalCenterPage() {
  const categories = Array.from(new Set(LEGAL_DOCUMENTS.map((d) => d.category)));

  return (
    <div className="min-h-dvh bg-[#FAFBFB] text-[#171717]">
      <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-[#FAFBFB]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3.5 sm:px-10">
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
              href="/landing"
              className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3.5 text-[13.5px] font-medium text-[#171717] transition hover:bg-gray-50"
            >
              Retour à l&apos;accueil
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

      <main className="mx-auto w-full max-w-[800px] px-5 py-12 sm:px-8">
        <div className="border-b border-gray-200 pb-6">
          <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[12px] font-medium text-[#525252]">
            <span className="size-1.5 rounded-full bg-[#184D3B]" />
            Centre juridique AutoCall
          </span>
          <h1 className="mt-4 text-[28px] font-semibold tracking-tight text-[#171717] sm:text-[34px]">
            Documents juridiques et conformité
          </h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-[#525252]">
            Retrouvez l&apos;ensemble des documents contractuels, politiques de confidentialité,
            règles d&apos;utilisation de l&apos;intelligence artificielle et engagements de sécurité d&apos;AutoCall.
          </p>
        </div>

        <div className="mt-8 space-y-10">
          {categories.map((category) => {
            const docs = LEGAL_DOCUMENTS.filter((d) => d.category === category);
            return (
              <section key={category}>
                <h2 className="text-[15px] font-semibold text-[#184D3B]">
                  {category}
                </h2>
                <div className="mt-3 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-2xs">
                  {docs.map((doc) => {
                    const version = doc.version ?? "V1.0";
                    const status = doc.status ?? "Brouillon";
                    const missingCount = findDocumentPlaceholders(doc).length;
                    return (
                      <Link
                        key={doc.slug}
                        href={`/${doc.slug}`}
                        className="flex flex-col justify-between gap-2 px-5 py-4 transition hover:bg-gray-50/70 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0">
                          <p className="text-[15px] font-semibold text-[#171717]">
                            {doc.title}
                          </p>
                          <p className="mt-0.5 text-[12.5px] text-[#737373]">
                            /{doc.slug} · Mise à jour : {doc.updatedAt}
                            {missingCount > 0 ? ` · ${missingCount} champ(s) à compléter` : ""}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[12px] font-medium text-[#525252]">
                            {version}
                          </span>
                          <span
                            className={`rounded-lg border px-2.5 py-0.5 text-[12px] font-medium ${
                              status === "Publié"
                                ? "border-[#184D3B]/25 bg-[#184D3B]/10 text-[#184D3B]"
                                : "border-amber-200 bg-amber-50 text-amber-800"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
