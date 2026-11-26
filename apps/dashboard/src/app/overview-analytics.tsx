"use client";

import { useState } from "react";

const categories = ["Commercial", "Communications", "Agents IA", "Campagnes", "Rentabilité"] as const;
type Category = (typeof categories)[number];
type Row = { name: string; values: number[] };

const weeklyData: Record<Category, { labels: string[]; weeks: Row[][] }> = {
  Commercial: { labels: ["Prospects", "Opportunités", "Rendez-vous", "Ventes"], weeks: [
    [{ name: "Acquisition", values: [48, 15, 9, 3] }, { name: "Recommandation", values: [12, 7, 6, 2] }, { name: "Réseaux sociaux", values: [20, 6, 4, 1] }],
    [{ name: "Acquisition", values: [58, 19, 12, 4] }, { name: "Recommandation", values: [15, 8, 6, 3] }, { name: "Réseaux sociaux", values: [22, 8, 5, 2] }],
  ] },
  Communications: { labels: ["Interactions", "Appels récupérés", "Rendez-vous"], weeks: [
    [{ name: "Téléphone", values: [172, 29, 10] }, { name: "Email", values: [85, 0, 5] }, { name: "WhatsApp", values: [63, 0, 4] }],
    [{ name: "Téléphone", values: [193, 34, 12] }, { name: "Email", values: [96, 0, 6] }, { name: "WhatsApp", values: [74, 0, 5] }],
  ] },
  "Agents IA": { labels: ["Interactions", "Missions accomplies", "Évaluations", "Évaluations positives", "Coût (€)"], weeks: [
    [{ name: "Emma", values: [110, 85, 24, 22, 24] }, { name: "Alex", values: [82, 62, 18, 16, 21] }, { name: "Lina", values: [56, 40, 12, 10, 16] }],
    [{ name: "Emma", values: [126, 98, 26, 24, 28] }, { name: "Alex", values: [95, 75, 22, 20, 25] }, { name: "Lina", values: [70, 52, 16, 14, 20] }],
  ] },
  Campagnes: { labels: ["Contacts traités", "Rendez-vous", "Coût (€)", "Ventes attribuées (€)"], weeks: [
    [{ name: "Relance clients", values: [80, 7, 180, 1200] }, { name: "Prospection B2B", values: [140, 8, 310, 1600] }],
    [{ name: "Relance clients", values: [92, 9, 210, 1500] }, { name: "Prospection B2B", values: [165, 10, 360, 2100] }],
  ] },
  Rentabilité: { labels: ["Ventes attribuées (€)", "Coûts directs (€)", "Coûts AutoCall (€)", "Temps économisé estimé (h)"], weeks: [
    [{ name: "Communications", values: [1800, 650, 165, 0] }, { name: "Campagnes", values: [2800, 1100, 490, 0] }, { name: "Automatisations", values: [0, 0, 65, 9] }],
    [{ name: "Communications", values: [2200, 800, 195, 0] }, { name: "Campagnes", values: [3600, 1450, 570, 0] }, { name: "Automatisations", values: [0, 0, 75, 12] }],
  ] },
};

export function OverviewAnalytics({ reportMode, empty }: { reportMode: boolean; empty: boolean }) {
  const [category, setCategory] = useState<Category>("Commercial");
  const [period, setPeriod] = useState("current");
  const { labels, weeks } = weeklyData[category];
  const rows: Row[] = empty ? [] : period === "all"
    ? weeks[1].map((row, index) => ({ ...row, values: row.values.map((value, metric) => value + weeks[0][index].values[metric]) }))
    : weeks[period === "previous" ? 0 : 1];
  const totals = labels.map((_, index) => rows.reduce((sum, row) => sum + row.values[index], 0));
  const format = new Intl.NumberFormat("fr-FR");
  const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const valueText = (value: number, label: string) => label.includes("(€)") ? euro.format(value) : format.format(value);
  const ratio = (numerator: number, denominator: number) => denominator ? format.format(Math.round(100 * numerator / denominator)) + " %" : "—";
  const margin = totals[0] - totals[1] - totals[2];
  const extraColumns = category === "Campagnes" ? ["Coût par rendez-vous", "ROI sur dépenses de campagne"] : category === "Agents IA" ? ["Part d’évaluations positives"] : [];
  const extraValues = (values: number[]) => category === "Campagnes"
    ? [values[1] ? euro.format(values[2] / values[1]) : "—", ratio(values[3] - values[2], values[2])]
    : category === "Agents IA" ? [ratio(values[3], values[2])] : [];
  const periodLabel = period === "current" ? "16–22 novembre 2026" : period === "previous" ? "9–15 novembre 2026" : "9–22 novembre 2026";

  const exportCsv = () => {
    const encodeRow = (cells: (string | number)[]) => cells.map((cell) => '"' + String(cell).replaceAll('"', '""') + '"').join(";");
    const csv = [
      ["Période", periodLabel, "Source", "Démonstration"],
      ["Segment", ...labels, ...extraColumns],
      ...rows.map((row) => [row.name, ...row.values, ...extraValues(row.values)]),
    ].map(encodeRow).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "autocall-" + category.toLowerCase().replaceAll(" ", "-") + ".csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{reportMode ? "Rapports" : "Pilotage et performance"}</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{reportMode ? "Exportez les données de démonstration par catégorie et par période." : "Données de démonstration · " + periodLabel}</p>
        </div>
        <label className="grid gap-1 text-sm">Période
          <select className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2" value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option value="current">16–22 novembre 2026</option><option value="previous">9–15 novembre 2026</option><option value="all">9–22 novembre 2026</option>
          </select>
        </label>
      </div>
      <div role="group" aria-label="Catégories d’analyse" className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)} className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm aria-pressed:border-[#008F6D] aria-pressed:bg-[#E6F5F0] aria-pressed:font-semibold">{item}</button>)}
      </div>
      {empty ? <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm">Les analyses apparaîtront après les premières activités de votre espace.</p> : (
        <>
          {!reportMode && <dl className="grid gap-3 @min-[36rem]:grid-cols-2 @min-[70rem]:grid-cols-4">
            {labels.map((label, index) => <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4" key={label}><dt className="text-sm text-[var(--text-secondary)]">{label}</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{valueText(totals[index], label)}</dd></div>)}
            {category === "Rentabilité" && <>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"><dt className="text-sm">Marge après coûts</dt><dd className="mt-1 text-xl font-semibold">{euro.format(margin)}</dd></div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"><dt className="text-sm">ROI AutoCall estimé</dt><dd className="mt-1 text-xl font-semibold">{ratio(margin, totals[2])}</dd></div>
            </>}
          </dl>}
          {reportMode && <button type="button" onClick={exportCsv} className="rounded-lg bg-[#008F6D] px-4 py-2 text-sm font-medium text-white">Télécharger le CSV</button>}
          <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <caption className="sr-only">{category} · {periodLabel}</caption>
              <thead className="bg-[var(--surface-inset)]"><tr>{["Segment", ...labels, ...extraColumns].map((label) => <th scope="col" key={label} className="px-4 py-3">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-[var(--border)]">{rows.map((row) => <tr key={row.name}>
                <th scope="row" className="px-4 py-3 font-medium">{row.name}</th>
                {row.values.map((value, index) => <td className="px-4 py-3 tabular-nums" key={labels[index]}>{valueText(value, labels[index])}</td>)}
                {extraValues(row.values).map((value, index) => <td className="px-4 py-3 tabular-nums" key={extraColumns[index]}>{value}</td>)}
              </tr>)}</tbody>
            </table>
          </div>
          {category === "Rentabilité" && <p className="text-sm text-[var(--text-secondary)]">Le ROI estimé divise la marge après coûts par les coûts AutoCall. Les ventes attribuées sont des estimations et le temps économisé est présenté en heures.</p>}
        </>
      )}
    </section>
  );
}
