"use client";

import { useState } from "react";

const channels = ["Email", "Appel", "WhatsApp"] as const;
type Channel = (typeof channels)[number];
type Step = { id: string; channel: Channel; delay: number; mode: string; stopOnReply: boolean };
type Sequence = { id: string; name: string; steps: Step[] };
const initialSequences: Sequence[] = [
  { id: "B2B", name: "Prospection B2B", steps: [
    { id: "1", channel: "Email", delay: 0, mode: "Sur approbation", stopOnReply: true },
    { id: "2", channel: "Appel", delay: 3, mode: "Manuel", stopOnReply: true },
  ] },
];
const field = "w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm";
const card = "rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5";
const action = "rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--surface-hover)]";

export function CampaignSequences() {
  const [sequences, setSequences] = useState(initialSequences);
  const [active, setActive] = useState(initialSequences[0].id);
  const selected = sequences.find((sequence) => sequence.id === active) ?? sequences[0];
  const update = (change: (sequence: Sequence) => Sequence) => {
    setSequences((previous) => previous.map((sequence) => sequence.id === selected.id ? change(sequence) : sequence));
  };
  const updateStep = (id: string, patch: Partial<Step>) => update((sequence) => ({
    ...sequence, steps: sequence.steps.map((step) => step.id === id ? { ...step, ...patch } : step),
  }));

  return (
    <section className={`space-y-4 ${card}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Séquences</h2>
        <button type="button" className={action} onClick={() => {
          const id = crypto.randomUUID();
          setSequences((previous) => [...previous, { id, name: "Nouvelle séquence", steps: [] }]);
          setActive(id);
        }}>+ Nouvelle séquence</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">Bibliothèque<select className={field} value={active} onChange={(event) => setActive(event.target.value)}>{sequences.map((sequence) => <option key={sequence.id} value={sequence.id}>{sequence.name || "Sans nom"}</option>)}</select></label>
        <label className="grid gap-1 text-sm">Nom de la séquence<input className={field} value={selected.name} onChange={(event) => update((sequence) => ({ ...sequence, name: event.target.value }))} /></label>
      </div>
      <ol className="space-y-3">
        {selected.steps.map((step, index) => (
          <li key={step.id} className="space-y-3 rounded-xl border border-[var(--border)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Étape {index + 1}</h3>
              <button type="button" className="text-sm underline" onClick={() => update((sequence) => ({ ...sequence, steps: sequence.steps.filter((item) => item.id !== step.id) }))}>Supprimer</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="grid gap-1 text-sm">Canal<select className={field} value={step.channel} onChange={(event) => updateStep(step.id, { channel: event.target.value as Channel })}>{channels.map((channel) => <option key={channel}>{channel}</option>)}</select></label>
              <label className="grid gap-1 text-sm">Délai (jours)<input className={field} type="number" min={0} value={step.delay} onChange={(event) => updateStep(step.id, { delay: Math.max(0, Math.floor(Number(event.target.value) || 0)) })} /></label>
              <label className="grid gap-1 text-sm">Exécution<select className={field} value={step.mode} onChange={(event) => updateStep(step.id, { mode: event.target.value })}><option>Manuel</option><option>Sur approbation</option><option>Automatique</option></select></label>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={step.stopOnReply} onChange={(event) => updateStep(step.id, { stopOnReply: event.target.checked })} /> Arrêter après une réponse</label>
          </li>
        ))}
      </ol>
      <button type="button" className={action} onClick={() => {
        const step: Step = { id: crypto.randomUUID(), channel: "Email", delay: selected.steps.length ? 2 : 0, mode: "Sur approbation", stopOnReply: true };
        update((sequence) => ({ ...sequence, steps: [...sequence.steps, step] }));
      }}>+ Ajouter une étape</button>
      <p className="text-sm text-[var(--text-muted)]">Éditeur de démonstration · Modifications conservées pendant la session.</p>
    </section>
  );
}

const placeholders: Record<string, string> = { prenom: "Sophie", entreprise: "Nova Services", commercial: "Thomas" };
const templates = [
  { id: "intro", name: "Présentation commerciale", channel: "Email" as Channel, body: "Bonjour {{prenom}},\n\nSeriez-vous disponible pour échanger sur les besoins de {{entreprise}} ?\n\n{{commercial}}" },
  { id: "reminder", name: "Confirmation de rendez-vous", channel: "WhatsApp" as Channel, body: "Bonjour {{prenom}}, je vous confirme notre rendez-vous." },
  { id: "call", name: "Qualification commerciale", channel: "Appel" as Channel, body: "Bonjour {{prenom}}, je suis {{commercial}}. Puis-je vous poser quelques questions sur les besoins de {{entreprise}} ?" },
];

export function CampaignTemplates() {
  const [library, setLibrary] = useState(templates);
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("");
  const selected = library.find((item) => item.id === selectedId) ?? library[0];
  const preview = selected.body.replace(/\{\{\s*(\w+)\s*\}\}/g, (token, key: string) => placeholders[key] ?? token);
  const edit = (patch: Partial<(typeof templates)[number]>) => setLibrary((previous) => previous.map((item) => item.id === selected.id ? { ...item, ...patch } : item));
  return (
    <section className={`space-y-4 ${card}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Modèles de communication</h2>
        <button type="button" className={action} onClick={() => {
          const id = crypto.randomUUID();
          setLibrary((previous) => [...previous, { id, name: "Nouveau modèle", channel: "Email", body: "" }]);
          setSelectedId(id); setQuery(""); setChannel("");
        }}>+ Nouveau modèle</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(15rem,1fr)_2fr]">
        <div className="space-y-3">
          <input type="search" className={field} placeholder="Rechercher un modèle" aria-label="Rechercher un modèle" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className={field} aria-label="Filtrer les modèles par canal" value={channel} onChange={(event) => setChannel(event.target.value)}><option value="">Tous les canaux</option>{channels.map((item) => <option key={item}>{item}</option>)}</select>
          <ul className="space-y-2">{library.filter((item) => (!channel || item.channel === channel) && item.name.toLowerCase().includes(query.trim().toLowerCase())).map((item) => <li key={item.id}><button type="button" aria-pressed={selectedId === item.id} className={`w-full text-left aria-pressed:bg-[var(--surface-inset)] ${action}`} onClick={() => setSelectedId(item.id)}>{item.name || "Sans nom"} · {item.channel}</button></li>)}</ul>
        </div>
        <div className="space-y-3">
          <label className="grid gap-1 text-sm">Nom<input className={field} value={selected.name} onChange={(event) => edit({ name: event.target.value })} /></label>
          <label className="grid gap-1 text-sm">Canal<select className={field} value={selected.channel} onChange={(event) => edit({ channel: event.target.value as Channel })}>{channels.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="grid gap-1 text-sm">Texte<textarea className={field} value={selected.body} rows={5} onChange={(event) => edit({ body: event.target.value })} /></label>
          <div className="flex flex-wrap gap-2" aria-label="Insérer une variable">{Object.keys(placeholders).map((key) => <button type="button" className={action} key={key} onClick={() => edit({ body: selected.body + "{{" + key + "}}" })}>{key}</button>)}</div>
          <div className="rounded-lg bg-[var(--surface-inset)] p-3 text-sm"><h3 className="font-semibold">Aperçu avec données fictives</h3><p className="mt-2 whitespace-pre-wrap break-words">{preview || "Le modèle est vide."}</p></div>
        </div>
      </div>
    </section>
  );
}

export function CampaignResults({ campaigns }: { campaigns: { id: string; title: string; planned: number; done: number; totalCalls: number; whatsappStats?: { sent: number; delivered: number }; emailStats?: { sent: number } }[] }) {
  const [selectedId, setSelectedId] = useState("");
  const filtered = campaigns.filter((item) => !selectedId || item.id === selectedId);
  const totals = filtered.reduce((sum, item) => ({
    planned: sum.planned + item.planned,
    done: sum.done + item.done,
    calls: sum.calls + item.totalCalls,
    emails: sum.emails + (item.emailStats?.sent ?? 0),
    whatsAppSent: sum.whatsAppSent + (item.whatsappStats?.sent ?? 0),
    whatsAppDelivered: sum.whatsAppDelivered + (item.whatsappStats?.delivered ?? 0),
  }), { planned: 0, done: 0, calls: 0, emails: 0, whatsAppSent: 0, whatsAppDelivered: 0 });
  return (
    <section className={`space-y-4 ${card}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-xl font-semibold">Résultats</h2><p className="mt-1 text-sm text-[var(--text-muted)]">Indicateurs de démonstration</p></div>
        <select className={`sm:w-auto ${field}`} aria-label="Choisir une campagne" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}><option value="">Toutes les campagnes</option>{campaigns.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Contacts ciblés", totals.planned],
          ["Contacts traités", totals.done],
          ["Taux de traitement", totals.planned ? Math.round(100 * totals.done / totals.planned) + " %" : "—"],
          ["Appels", totals.calls],
          ["Emails envoyés", totals.emails],
          ["WhatsApp livrés / envoyés", totals.whatsAppDelivered + " / " + totals.whatsAppSent],
        ].map(([label, value]) => <div className="rounded-lg bg-[var(--surface-inset)] p-4" key={label}><dt className="text-sm text-[var(--text-muted)]">{label}</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{value}</dd></div>)}
      </dl>
    </section>
  );
}
