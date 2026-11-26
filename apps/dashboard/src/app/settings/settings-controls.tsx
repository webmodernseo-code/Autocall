"use client";

import { useState } from "react";

const packs = [
  { id: "voice", label: "Voix et téléphonie", balance: 180, unit: "minutes", pack: 100, price: 15 },
  { id: "acquisition", label: "Acquisition", balance: 260, unit: "crédits", pack: 250, price: 20 },
  { id: "ai", label: "Intelligence artificielle", balance: 840, unit: "crédits", pack: 500, price: 10 },
  { id: "images", label: "Génération d’images", balance: 32, unit: "générations", pack: 25, price: 12 },
  { id: "transcription", label: "Transcription", balance: 120, unit: "minutes", pack: 100, price: 8 },
];
const card = "rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5";
const button = "rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--surface-hover)] disabled:opacity-50";
const input = "min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm";
const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export function CreditSettings() {
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [review, setReview] = useState(false);
  const [budget, setBudget] = useState("100");
  const [warning, setWarning] = useState(true);
  const quantity = (id: string) => Number(quantities[id] ?? 0);
  const validQuantities = packs.every(({ id }) => Number.isSafeInteger(quantity(id)) && quantity(id) >= 0 && quantity(id) <= 100);
  const total = packs.reduce((amount, pack) => amount + quantity(pack.id) * pack.price, 0);
  const budgetValue = Number(budget);

  return (
    <div className="space-y-4">
      <section className={card}>
        <h3 className="font-semibold">Portefeuille de ressources</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Soldes et unités de démonstration.</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {packs.map((pack) => <div key={pack.id} className="rounded-lg bg-[var(--surface-inset)] p-3"><dt className="text-sm">{pack.label}</dt><dd className="mt-1 tabular-nums"><strong className="text-lg">{pack.balance}</strong> <span className="text-sm">{pack.unit}</span></dd></div>)}
        </dl>
      </section>
      <section className={card}>
        <h3 className="font-semibold">Simuler une recharge</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Tarifs indicatifs. La vérification du panier ne déclenche aucun paiement.</p>
        <div className="mt-3 divide-y divide-[var(--border)]">
          {packs.map((pack) => (
            <label key={pack.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <span><span className="block font-medium">{pack.label}</span><span className="text-[var(--text-muted)]">{pack.pack} {pack.unit} par pack · {euro.format(pack.price)}</span></span>
              <span className="flex items-center gap-2">Packs<input aria-label={"Nombre de packs · " + pack.label} className={`w-20 ${input}`} type="number" min={0} max={100} step={1} value={quantities[pack.id] ?? "0"} onChange={(event) => {
                const value = event.target.value;
                setQuantities((previous) => ({ ...previous, [pack.id]: value }));
                setReview(false);
              }} /></span>
            </label>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
          <p className="text-sm">Total indicatif <strong className="ml-2 tabular-nums">{validQuantities ? euro.format(total) : "—"}</strong></p>
          <button type="button" disabled={!validQuantities || total <= 0} className={button} onClick={() => setReview(true)}>Vérifier mon panier</button>
        </div>
        {review && <div className="mt-3 rounded-lg bg-[var(--surface-inset)] p-3 text-sm" role="status">
          <p className="font-semibold">Récapitulatif de démonstration</p>
          <ul className="mt-1 space-y-1">{packs.filter((pack) => quantity(pack.id) > 0).map((pack) => <li key={pack.id}>{pack.label} · {pack.pack * quantity(pack.id)} {pack.unit}</li>)}</ul>
          {warning && budget.trim() !== "" && Number.isFinite(budgetValue) && budgetValue >= 0 && total > budgetValue && <p className="mt-2 font-medium">Le panier dépasse le plafond indicatif de {euro.format(budgetValue)}.</p>}
        </div>}
      </section>
      <section className={card}>
        <h3 className="font-semibold">Limites et alertes de consommation</h3>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <label className="grid gap-1 text-sm">Plafond indicatif (€)<input type="number" min={0} step="0.01" value={budget} onChange={(event) => { setBudget(event.target.value); setReview(false); }} className={`w-36 ${input}`} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={warning} onChange={(event) => { setWarning(event.target.checked); setReview(false); }} /> Signaler un dépassement dans le panier</label>
        </div>
      </section>
    </div>
  );
}

const initialSessions = [
  { id: "windows", name: "Chrome sur Windows", detail: "France · Session actuelle", current: true },
  { id: "iphone", name: "Safari sur iPhone", detail: "Dernière activité hier", current: false },
  { id: "firefox", name: "Firefox sur ordinateur", detail: "Dernière activité il y a 3 jours", current: false },
];

export function SecuritySessions() {
  const [sessions, setSessions] = useState(initialSessions);
  const [feedback, setFeedback] = useState("");
  return (
    <section className={card}>
      <h3 className="font-semibold">Sessions actives</h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Appareils fictifs. La révocation est simulée.</p>
      <ul className="mt-3 divide-y divide-[var(--border)]">{sessions.map((session) => (
        <li key={session.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
          <div><p className="font-medium">{session.name}</p><p className="text-[var(--text-muted)]">{session.detail}</p></div>
          {session.current ? <span className="rounded-md bg-[var(--surface-inset)] px-2 py-1">Session actuelle</span> : (
            <button type="button" className={button} aria-label={"Simuler la révocation de " + session.name} onClick={() => {
              setSessions((previous) => previous.filter((item) => item.id !== session.id));
              setFeedback("Révocation simulée pour " + session.name + ".");
            }}>Révoquer</button>
          )}
        </li>
      ))}</ul>
      {feedback && <p role="status" className="mt-2 text-sm">{feedback}</p>}
    </section>
  );
}
