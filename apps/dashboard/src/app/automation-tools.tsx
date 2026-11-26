"use client";

import { useState } from "react";

const triggers = ["Appel manqué récupéré", "Prospect ajouté au CRM", "Rendez-vous confirmé", "Message reçu"];
const actions = ["Préparer un email", "Créer une opportunité CRM", "Créer une tâche", "Notifier l’équipe"];
const sampleContacts = [
  { name: "Sophie Martin", score: 92 },
  { name: "Marc Dubois", score: 38 },
  { name: "Contact non évalué", score: null },
];
export type WorkflowConfig = { trigger: string; threshold: number; action: string; delayHours: number; approval: boolean; budget: number };
export type WorkflowRun = { id: string; workflow: string; status: string; date: string; steps: { title: string; detail: string }[] };
const field = "w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm";
const button = "rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--surface-hover)] disabled:opacity-50";
const initialConfig: WorkflowConfig = { trigger: triggers[0], threshold: 75, action: actions[0], delayHours: 0, approval: true, budget: 1 };

export function AutomationEditor({ initial, workflowName, onSave, onRun }: {
  initial?: WorkflowConfig;
  workflowName: string;
  onSave: (name: string, config: WorkflowConfig) => void;
  onRun: (run: WorkflowRun) => void;
}) {
  const [name, setName] = useState(workflowName);
  const [config, setConfig] = useState(initial ?? initialConfig);
  const [sample, setSample] = useState(0);
  const [latest, setLatest] = useState<WorkflowRun | null>(null);
  const [saved, setSaved] = useState(false);
  const change = (patch: Partial<WorkflowConfig>) => {
    setConfig((previous) => ({ ...previous, ...patch }));
    setLatest(null);
    setSaved(false);
  };
  const simulate = () => {
    const contact = sampleContacts[sample];
    const condition = contact.score === null ? "Inconnue" : contact.score >= config.threshold ? "Vraie" : "Fausse";
    const cost = 0.05;
    const status = condition === "Inconnue" ? "Condition inconnue"
      : condition === "Fausse" ? "Ignorée"
        : config.budget < cost ? "Budget insuffisant"
          : config.delayHours > 0 ? "En attente"
            : config.approval ? "Approbation requise" : "Simulée";
    const details: Record<string, string> = {
      "Condition inconnue": "Le contact n’a pas de score. L’action est ignorée.",
      Ignorée: "Le score est inférieur au seuil. L’action est ignorée.",
      "Budget insuffisant": "Le coût estimé de 0,05 € dépasse le budget de ce test.",
      "En attente": `Délai configuré de ${config.delayHours} h dans le scénario.`,
      "Approbation requise": "Une validation humaine serait nécessaire avant l’action.",
      Simulée: "L’action a été prévisualisée. Aucune donnée ni intégration n’a été modifiée.",
    };
    const run: WorkflowRun = {
      id: crypto.randomUUID(), workflow: name.trim(), status, date: new Date().toISOString(),
      steps: [
        { title: "Déclencheur", detail: config.trigger + " · " + contact.name },
        { title: "Condition", detail: `${condition} · Score ${contact.score ?? "inconnu"} / seuil ${config.threshold}` },
        { title: config.action, detail: details[status] },
      ],
    };
    setLatest(run);
    onRun(run);
  };
  const canRun = Boolean(name.trim()) && [config.threshold, config.delayHours, config.budget].every(Number.isFinite) && config.threshold >= 0 && config.threshold <= 100 && config.delayHours >= 0 && config.budget >= 0;
  return (
    <form className="mt-6 space-y-4 border-t border-[var(--border)] pt-4" onSubmit={(event) => {
      event.preventDefault();
      if (canRun) { onSave(name.trim(), config); setSaved(true); }
    }}>
      <h3 className="font-semibold">Configuration de démonstration</h3>
      <label className="grid gap-1 text-sm">Nom<input className={field} required value={name} onChange={(event) => { setName(event.target.value); setSaved(false); setLatest(null); }} /></label>
      <ol className="space-y-3 rounded-xl border border-[var(--border)] p-3">
        <li><label className="grid gap-1 text-sm">Déclencheur<select className={field} value={config.trigger} onChange={(event) => change({ trigger: event.target.value })}>{triggers.map((trigger) => <option key={trigger}>{trigger}</option>)}</select></label></li>
        <li><label className="grid gap-1 text-sm">Condition · Score minimal du contact<input className={field} type="number" required min={0} max={100} value={Number.isNaN(config.threshold) ? "" : config.threshold} onChange={(event) => change({ threshold: event.target.valueAsNumber })} /></label></li>
        <li><label className="grid gap-1 text-sm">Action<select className={field} value={config.action} onChange={(event) => change({ action: event.target.value })}>{actions.map((action) => <option key={action}>{action}</option>)}</select></label></li>
      </ol>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">Délai (heures)<input className={field} type="number" min={0} required value={Number.isNaN(config.delayHours) ? "" : config.delayHours} onChange={(event) => change({ delayHours: event.target.valueAsNumber })} /></label>
        <label className="grid gap-1 text-sm">Budget par test (€)<input className={field} type="number" min={0} step="0.01" required value={Number.isNaN(config.budget) ? "" : config.budget} onChange={(event) => change({ budget: event.target.valueAsNumber })} /></label>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.approval} onChange={(event) => change({ approval: event.target.checked })} /> Approbation humaine requise</label>
      <label className="grid gap-1 text-sm">Contact fictif<select className={field} value={sample} onChange={(event) => { setSample(Number(event.target.value)); setLatest(null); }}>{sampleContacts.map((contact, index) => <option key={contact.name} value={index}>{contact.name}</option>)}</select></label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={button} disabled={!canRun} onClick={simulate}>Tester le workflow</button>
        <button type="submit" className={button} disabled={!canRun}>Enregistrer la configuration</button>
      </div>
      {saved && <p role="status" className="text-sm">Configuration enregistrée pour cette session.</p>}
      {latest && <div role="status" className="rounded-lg bg-[var(--surface-inset)] p-3 text-sm"><p className="font-semibold">{latest.status}</p><p>{latest.steps.at(-1)?.detail}</p></div>}
    </form>
  );
}

const sampleRuns: WorkflowRun[] = [
  { id: "DEMO-104", workflow: "Routage Appel Manqué Hors-Horaires", status: "Simulée", date: "2026-11-26T10:42:00+01:00", steps: [
    { title: "Déclencheur", detail: "Appel manqué récupéré · Événement fictif." },
    { title: "Condition", detail: "Contact reconnu dans le CRM de démonstration." },
    { title: "Action", detail: "Tâche de rappel prévisualisée." },
  ] },
  { id: "DEMO-103", workflow: "Suivi rendez-vous", status: "Approbation requise", date: "2026-11-26T09:30:00+01:00", steps: [
    { title: "Déclencheur", detail: "Rendez-vous confirmé · Événement fictif." },
    { title: "Action", detail: "Un brouillon d’email attendrait l’approbation." },
  ] },
];

export function AutomationJournal({ runs }: { runs: WorkflowRun[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const entries = [...runs, ...sampleRuns];
  const filtered = entries.filter((run) => (!status || run.status === status) && (run.workflow + " " + run.id).toLowerCase().includes(search.trim().toLowerCase()));
  const selected = filtered.find((run) => run.id === selectedId);
  const formatDate = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" });
  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-semibold">Journal d’exécution</h2><p className="mt-1 text-sm text-[var(--text-muted)]">Exemples fictifs et tests lancés pendant cette session.</p></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input type="search" className={field} aria-label="Rechercher une exécution" placeholder="Rechercher une exécution" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select className={field} aria-label="Filtrer par résultat" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tous les résultats</option>{[...new Set(entries.map((run) => run.status))].map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="bg-[var(--surface-inset)]"><tr><th scope="col" className="p-3">Workflow</th><th scope="col" className="p-3">Date</th><th scope="col" className="p-3">Résultat</th></tr></thead>
          <tbody className="divide-y divide-[var(--border)]">{filtered.map((run) => <tr key={run.id}><td className="p-3"><button type="button" className="text-left font-medium underline" onClick={() => { setSelectedId(run.id); setStepIndex(0); }}>{run.workflow}</button></td><td className="p-3">{formatDate.format(new Date(run.date))}</td><td className="p-3">{run.status}</td></tr>)}</tbody>
        </table>
        {!filtered.length && <p className="p-3 text-sm">Aucune exécution pour ces critères.</p>}
      </div>
      {selected && (
        <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex flex-wrap justify-between gap-3"><h3 className="font-semibold">{selected.workflow}</h3><button type="button" className="text-sm underline" onClick={() => setSelectedId("")}>Fermer le détail</button></div>
          <div className="flex flex-wrap gap-2">{selected.steps.map((step, index) => <button type="button" key={index} aria-pressed={stepIndex === index} className={`${button} aria-pressed:bg-[var(--surface-inset)]`} onClick={() => setStepIndex(index)}>{step.title}</button>)}</div>
          <p className="text-sm">{selected.steps[stepIndex]?.detail}</p>
        </section>
      )}
    </section>
  );
}
