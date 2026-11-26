"use client";

import Link from "next/link";
import { useState } from "react";
import { downloadCsv } from "../download-csv";
import { PremiumCheckbox } from "../premium-checkbox";

type PlanId = "starter" | "pro" | "scale";

interface PlanItem {
  id: PlanId;
  name: string;
  badge?: string;
  badgeAccent?: boolean;
  subtitle: string;
  monthlyPrice: number;
  features: string[];
}

const PLANS: PlanItem[] = [
  {
    id: "starter",
    name: "Découverte",
    subtitle: "Pour démarrer gratuitement",
    monthlyPrice: 0,
    features: [
      "1 agent vocal IA",
      "100 minutes d’appels / mois",
      "CRM & fiches contacts",
      "Transcriptions & résumés IA",
      "Boîte de réception unifiée",
      "Export des données CSV",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Populaire",
    badgeAccent: true,
    subtitle: "Tout pour développer votre activité",
    monthlyPrice: 49,
    features: [
      "Tout le forfait Découverte",
      "6 agents vocaux IA",
      "2 500 minutes d’appels / mois",
      "Campagnes Appels, WhatsApp & E-mail",
      "Sync Google Calendar & HubSpot",
      "Enregistrements audio RGPD (90 j)",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    badge: "Meilleure valeur",
    subtitle: "Pour les équipes à fort volume",
    monthlyPrice: 129,
    features: [
      "Tout le forfait Pro",
      "Agents vocaux IA illimités",
      "10 000 minutes d’appels / mois",
      "Support prioritaire dédié",
      "API REST & Webhooks temps réel",
      "Multi-équipes & permissions avancées",
    ],
  },
];

const ADDONS = [
  {
    id: "addon-minutes",
    title: "Pack +1 000 minutes vocales IA",
    description:
      "Absorbez vos pics d’appels entrants et vos campagnes sortantes sans coupure.",
    price: 29,
    badge: "Recommandé",
  },
  {
    id: "addon-number",
    title: "Numéro local dédié supplémentaire",
    description:
      "Affichez un indicatif régional (01, 04, 06) pour maximiser le taux de décroché.",
    price: 9,
  },
];

const INVOICES = [
  { id: "Facture 10011", plan: "Pro", amount: "49 €", date: "2026-11-01", status: "Payée" },
  { id: "Facture 10010", plan: "Pro", amount: "49 €", date: "2026-10-01", status: "Payée" },
  { id: "Facture 10009", plan: "Pro", amount: "49 €", date: "2026-09-01", status: "Payée" },
];

function CheckCircleSvg({ accent = false }: { accent?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-4 shrink-0 ${
        accent ? "text-[var(--brand-primary)]" : "text-[var(--foreground)]"
      }`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.3 7.7-5 5a1 1 0 0 1-1.4 0l-2.2-2.2a1 1 0 1 1 1.4-1.4l1.5 1.5 4.3-4.3a1 1 0 1 1 1.4 1.4Z" />
    </svg>
  );
}

function MastercardSvg() {
  return (
    <svg viewBox="0 0 36 24" className="h-6 w-9 shrink-0" aria-hidden="true">
      <rect width="36" height="24" rx="4" fill="#171717" />
      <circle cx="14.5" cy="12" r="6" fill="#EB001B" />
      <circle cx="21.5" cy="12" r="6" fill="#F79E1B" fillOpacity="0.9" />
    </svg>
  );
}

function PdfIconSvg() {
  return (
    <svg viewBox="0 0 24 24" className="size-7 shrink-0" fill="none" aria-hidden="true">
      <path
        d="M6 2.5h8.5L19.5 7.5V20a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 20V4A1.5 1.5 0 0 1 6 2.5Z"
        fill="#FFFFFF"
        stroke="#E5E7EB"
        strokeWidth="1.2"
      />
      <path d="M14.5 2.5V7.5H19.5" stroke="#E5E7EB" strokeWidth="1.2" />
      <rect x="3" y="11" width="14" height="7" rx="1.5" fill="#DC2626" />
      <text
        x="10"
        y="16.2"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="5.2"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        PDF
      </text>
    </svg>
  );
}

export function BillingPlanPanel({
  onNotify,
}: {
  onNotify: (message: string) => void;
}) {
  const [annual, setAnnual] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanId>("pro");
  const [acceptedSaleTerms, setAcceptedSaleTerms] = useState(true);
  const [activeAddons, setActiveAddons] = useState<Record<string, boolean>>({});
  const [editingCard, setEditingCard] = useState(false);
  const [cardLast4, setCardLast4] = useState("1234");
  const [cardExpiry, setCardExpiry] = useState("06/2028");

  const getPrice = (monthly: number) => {
    if (monthly === 0) return 0;
    return annual ? Math.round(monthly * 0.8) : monthly;
  };

  const toggleAddon = (id: string, title: string) => {
    setActiveAddons((prev) => {
      const next = !prev[id];
      onNotify(
        next ? `${title} ajouté au forfait` : `${title} retiré du forfait`,
      );
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* CHOISISSEZ VOTRE FORFAIT */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-[var(--foreground)]">
            <span className="size-1.5 rounded-full bg-[var(--brand-primary)]" />
            <span>Choisissez votre forfait</span>
          </div>

          <div className="flex items-center gap-2.5 text-[13.5px]">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`cursor-pointer ${
                !annual
                  ? "font-semibold text-[var(--foreground)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={annual}
              aria-label="Basculer en facturation annuelle"
              onClick={() => setAnnual((v) => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                annual ? "bg-[var(--brand-primary)]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block size-3.5 rounded-full bg-white transition-transform ${
                  annual ? "translate-x-4.5" : "translate-x-1"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`cursor-pointer ${
                annual
                  ? "font-semibold text-[var(--foreground)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              Annuel
            </button>
            <span className="rounded-md bg-[var(--brand-soft)] px-2 py-0.5 text-[12px] font-semibold text-[var(--brand-text)]">
              -20 %
            </span>
          </div>
        </div>

        {/* Bandeau offre annuelle */}
        {!annual && (
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xs sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[14px] font-semibold text-[var(--foreground)]">
                  2 mois offerts avec la facturation annuelle
                </p>
                <span className="rounded-md bg-[var(--brand-soft)] px-2 py-0.5 text-[12px] font-medium text-[var(--brand-text)]">
                  Économisez 20 %
                </span>
              </div>
              <p className="mt-0.5 text-[13.5px] text-[var(--text-secondary)]">
                Passez à l’abonnement annuel dès aujourd’hui et bénéficiez de 2 mois gratuits.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAnnual(true);
                onNotify("Facturation annuelle activée (-20 %)");
              }}
              className="inline-flex h-9 shrink-0 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 text-[13.5px] font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)] cursor-pointer"
            >
              Passer à l’annuel
            </button>
          </div>
        )}

        {/* Grille 3 forfaits */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const price = getPrice(plan.monthlyPrice);
            return (
              <article
                key={plan.id}
                className={`flex flex-col rounded-2xl border bg-[var(--surface)] p-5 shadow-2xs transition-shadow ${
                  isCurrent
                    ? "border-[var(--brand-primary)] ring-1 ring-[#00B489]/20"
                    : "border-[var(--border)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[15px] font-semibold text-[var(--foreground)]">
                        {plan.name}
                      </h4>
                      {plan.badge && (
                        <span
                          className={`rounded-md px-2 py-0.5 text-[12px] font-medium ${
                            plan.badgeAccent
                              ? "bg-[var(--brand-soft)] text-[var(--brand-text)]"
                              : "border border-[var(--border)] bg-[var(--surface-inset)] text-[var(--text-secondary)]"
                          }`}
                        >
                          {plan.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-[13.5px] text-[var(--text-secondary)]">
                    {plan.subtitle}
                  </p>

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-[28px] font-bold tracking-tight text-[var(--foreground)] tabular-nums">
                      {price} €
                    </span>
                    <span className="text-[13.5px] text-[var(--text-muted)]">
                      / mois
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={isCurrent}
                    onClick={() => {
                      if (!acceptedSaleTerms) {
                        onNotify("Veuillez accepter les Conditions générales de vente et le DPA.");
                        return;
                      }
                      setCurrentPlan(plan.id);
                      onNotify(`Forfait ${plan.name} activé`);
                    }}
                    className={`mt-4 inline-flex h-9.5 w-full items-center justify-center rounded-xl text-[14px] font-medium transition ${
                      isCurrent
                        ? "border border-[var(--border)] bg-[var(--surface-inset)] text-[var(--text-secondary)] cursor-default"
                        : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] cursor-pointer"
                    }`}
                  >
                    {isCurrent ? "Votre forfait actuel" : `Passer à ${plan.name}`}
                  </button>
                </div>

                <ul className="mt-5 space-y-2.5 border-t border-[var(--border-subtle)] pt-4 text-[13.5px] text-[var(--text-secondary)]">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5">
                      <CheckCircleSvg accent={isCurrent || plan.badgeAccent} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Consentement CGV + DPA avant souscription */}
        <div className="flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13.5px] text-[var(--text-secondary)]">
          <PremiumCheckbox
            checked={acceptedSaleTerms}
            onChange={setAcceptedSaleTerms}
            ariaLabel="Accepter les Conditions générales de vente et le DPA"
          />
          <span className="leading-snug">
            J’accepte les{" "}
            <Link
              href="/terms-of-sale"
              className="font-medium text-[#008064] underline underline-offset-2 hover:text-[#00664F]"
            >
              Conditions générales de vente
            </Link>{" "}
            et l’
            <Link
              href="/dpa"
              className="font-medium text-[#008064] underline underline-offset-2 hover:text-[#00664F]"
            >
              Accord de traitement des données
            </Link>{" "}
            applicable.
          </span>
        </div>
      </section>

      {/* OPTIONS COMPLÉMENTAIRES (ADD-ONS) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-[var(--foreground)]">
          <span className="size-1.5 rounded-full bg-[var(--brand-primary)]" />
          <span>Options complémentaires</span>
        </div>

        <div className="space-y-3">
          {ADDONS.map((addon) => {
            const added = !!activeAddons[addon.id];
            return (
              <div
                key={addon.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xs sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand-text)]">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[14px] font-semibold text-[var(--foreground)]">
                        {addon.title}
                      </p>
                      {addon.badge && (
                        <span className="rounded-md bg-[var(--brand-soft)] px-2 py-0.5 text-[12px] font-medium text-[var(--brand-text)]">
                          {addon.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[13.5px] text-[var(--text-secondary)]">
                      {addon.description}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
                  <span className="text-[14px] font-semibold text-[var(--foreground)] tabular-nums">
                    +{addon.price} €{" "}
                    <span className="font-normal text-[var(--text-muted)]">
                      / mois
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAddon(addon.id, addon.title)}
                    className={`inline-flex h-9 items-center rounded-lg px-3.5 text-[13.5px] font-medium transition cursor-pointer ${
                      added
                        ? "border border-[var(--brand-primary)] bg-[var(--brand-soft)] text-[var(--brand-text)]"
                        : "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    {added ? "Ajouté" : "Ajouter au forfait"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Consentement CGV + DPA avant souscription */}
        <div className="flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13.5px] text-[var(--text-secondary)]">
          <PremiumCheckbox
            checked={acceptedSaleTerms}
            onChange={setAcceptedSaleTerms}
            ariaLabel="Accepter les Conditions générales de vente et le DPA"
          />
          <span className="leading-snug">
            J’accepte les{" "}
            <Link
              href="/terms-of-sale"
              className="font-medium text-[#008064] underline underline-offset-2 hover:text-[#00664F]"
            >
              Conditions générales de vente
            </Link>{" "}
            et l’
            <Link
              href="/dpa"
              className="font-medium text-[#008064] underline underline-offset-2 hover:text-[#00664F]"
            >
              Accord de traitement des données
            </Link>{" "}
            applicable.
          </span>
        </div>
      </section>

      {/* MOYEN DE PAIEMENT */}
      <section className="space-y-4 border-t border-[var(--border)] pt-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-[14.5px] font-semibold text-[var(--foreground)]">
              Moyen de paiement
            </h3>
            <p className="mt-0.5 text-[13.5px] text-[var(--text-secondary)]">
              Modifiez la carte utilisée pour régler votre abonnement AutoCall.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-2xs sm:min-w-[340px]">
            <div className="flex items-center gap-3">
              <MastercardSvg />
              <div>
                <p className="text-[14px] font-semibold text-[var(--foreground)] tabular-nums">
                  Mastercard se terminant par {cardLast4}
                </p>
                <p className="text-[13px] text-[var(--text-muted)] tabular-nums">
                  Expire le {cardExpiry}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingCard((v) => !v)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-[13px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-3.5 text-[var(--text-muted)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Modifier
            </button>
          </div>
        </div>

        {editingCard && (
          <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xs">
            <div>
              <label className="block text-[13px] font-medium text-[var(--text-secondary)]">
                4 derniers chiffres
              </label>
              <input
                type="text"
                maxLength={4}
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value)}
                className="mt-1 h-9 w-28 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[14px] tabular-nums focus:border-[var(--focus-ring)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[var(--text-secondary)]">
                Expiration (MM/AAAA)
              </label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="mt-1 h-9 w-32 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[14px] tabular-nums focus:border-[var(--focus-ring)] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingCard(false);
                onNotify("Moyen de paiement mis à jour");
              }}
              className="h-9 rounded-lg bg-[var(--primary)] px-4 text-[13.5px] font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] cursor-pointer"
            >
              Enregistrer
            </button>
          </div>
        )}
      </section>

      {/* TABLEAU DES FACTURES */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-inset)] text-[13px] font-medium text-[var(--text-secondary)]">
                <th className="px-4 py-3">Facture</th>
                <th className="px-4 py-3">Forfait</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Date de facturation</th>
                <th className="px-4 py-3 text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-[var(--surface-hover)]">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <PdfIconSvg />
                      <span className="font-medium text-[var(--foreground)]">
                        {inv.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--brand-soft)] px-2 py-0.5 text-[12.5px] font-medium text-[var(--brand-text)]">
                      <span className="size-1.5 rounded-full bg-[var(--brand-primary)]" />
                      {inv.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-bg)] px-2.5 py-0.5 text-[12.5px] font-medium text-[var(--success)]">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-[var(--foreground)] tabular-nums">
                    {inv.amount}
                  </td>
                  <td className="px-4 py-3.5 text-[var(--text-secondary)] tabular-nums">
                    {inv.date}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => downloadCsv(`${inv.id}.csv`, [["Facture", "Offre", "Statut", "Montant", "Date"], [inv.id, inv.plan, inv.status, inv.amount, inv.date]])}
                      aria-label={`Exporter ${inv.id} en CSV`}
                      className="inline-flex size-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-inset)] hover:text-[var(--foreground)] cursor-pointer"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 4v11m0 0-4-4m4 4 4-4M4 18v1a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
