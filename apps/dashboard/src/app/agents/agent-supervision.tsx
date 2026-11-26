"use client";

import { useState } from "react";

const events = [
  { id: "EXE-00248", agent: "Emma", time: "11:42", task: "Appel entrant traité", status: "Réussi", result: "Demande de prestation annuelle qualifiée. Résumé enregistré dans le CRM fictif." },
  { id: "EXE-00247", agent: "Alex", time: "11:24", task: "Prospect qualifié", status: "Réussi", result: "Le besoin et le délai ont été ajoutés à la fiche de démonstration." },
  { id: "EXE-00246", agent: "Emma", time: "10:58", task: "Rendez-vous créé", status: "Réussi", result: "Le service de réservation fictif a confirmé le créneau." },
  { id: "EXE-00245", agent: "Lina", time: "10:32", task: "Réponse email préparée", status: "Approbation", result: "Le brouillon attend une validation humaine." },
  { id: "EXE-00244", agent: "Emma", time: "10:15", task: "Transfert vers un humain", status: "Transféré", result: "La question contractuelle a été transmise à l’équipe." },
  { id: "EXE-00243", agent: "Alex", time: "09:48", task: "Synchronisation agenda", status: "Échec", result: "Le service de démonstration n’a pas répondu. Aucun rendez-vous confirmé." },
  { id: "EXE-00242", agent: "Lina", time: "09:32", task: "Envoi WhatsApp empêché", status: "Bloqué", result: "Permission d’envoi insuffisante." },
  { id: "EXE-00241", agent: "Emma", time: "09:15", task: "Confirmation fournisseur", status: "Incertain", result: "Le fournisseur fictif n’a pas confirmé le résultat." },
];

export function AgentSupervision() {
  const [agent, setAgent] = useState("");
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [corrections, setCorrections] = useState<Record<string, string>>({});
  const agentEvents = events.filter((event) => !agent || event.agent === agent);
  const filtered = agentEvents.filter((event) => !status || event.status === status);
  const selected = filtered.find((event) => event.id === selectedId);
  const field = "rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2";

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Historique et supervision</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Journal des actions · Données de démonstration</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <label className="grid gap-1">Agent<select className={field} value={agent} onChange={(event) => setAgent(event.target.value)}><option value="">Tous les agents</option>{[...new Set(events.map((event) => event.agent))].map((name) => <option key={name}>{name}</option>)}</select></label>
          <label className="grid gap-1">Résultat<select className={field} value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tous les résultats</option>{[...new Set(events.map((event) => event.status))].map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
        <p><strong>{agentEvents.length}</strong> exécutions</p>
        <p><strong>{agentEvents.filter((event) => event.status === "Réussi").length}</strong> réussites</p>
        <p><strong>{agentEvents.filter((event) => event.status === "Transféré").length}</strong> transferts humains</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="bg-[var(--surface-inset)]"><tr>{["Agent", "Activité", "Heure", "Résultat"].map((label) => <th scope="col" className="px-4 py-3" key={label}>{label}</th>)}</tr></thead>
          <tbody className="divide-y divide-[var(--border)]">{filtered.map((event) => (
            <tr key={event.id}>
              <td className="px-4 py-3">{event.agent}</td>
              <td className="px-4 py-3"><button type="button" onClick={() => setSelectedId(event.id)} className="text-left font-medium underline">{event.task}</button></td>
              <td className="px-4 py-3 tabular-nums">{event.time}</td>
              <td className="px-4 py-3">{event.status}</td>
            </tr>
          ))}</tbody>
        </table>
        {filtered.length === 0 && <p className="p-4 text-sm">Aucune exécution pour ces filtres.</p>}
      </div>
      {selected && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4" aria-label="Détail de l’exécution">
          <div className="flex flex-wrap justify-between gap-3"><h3 className="font-semibold">{selected.agent} · {selected.id}</h3><button type="button" className="text-sm underline" onClick={() => setSelectedId("")}>Fermer</button></div>
          <p className="mt-2 text-sm">{selected.task} · {selected.status}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{selected.result}</p>
          <form key={selected.id} className="mt-4 space-y-2 text-sm" onSubmit={(event) => {
            event.preventDefault();
            const correction = String(new FormData(event.currentTarget).get("correction") ?? "").trim();
            if (correction) setCorrections((previous) => ({ ...previous, [selected.id]: correction }));
          }}>
            <label className="grid gap-1">Correction proposée<textarea className={field} name="correction" rows={3} required defaultValue={corrections[selected.id]} /></label>
            <button type="submit" className={field}>Enregistrer en brouillon</button>
            {corrections[selected.id] && <p role="status">Brouillon enregistré pour cette session.</p>}
          </form>
        </section>
      )}
    </section>
  );
}
