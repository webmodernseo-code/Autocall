"use client";

import { useState } from "react";
import {
  BarChart, Button, Card, ConfirmDialog, DataTable, EmptyState, ErrorState, Filters,
  KpiCard, LoadingState, Menu, Pagination, SelectField, Status, TextField, ToastNotice, ToastProvider,
} from "@autocall/ui";

const items = [
  { id: "1", name: "Demande de rappel", channel: "Téléphone", done: true },
  { id: "2", name: "Confirmation de rendez-vous", channel: "Email", done: true },
  { id: "3", name: "Appel hors horaires", channel: "Téléphone", done: false },
  { id: "4", name: "Suivi de rendez-vous", channel: "Email", done: false },
];

type Activity = (typeof items)[number];

const columns = [
  { id: "name", heading: "Activité", cell: (row: Activity) => row.name },
  { id: "channel", heading: "Canal", cell: (row: Activity) => row.channel },
  { id: "status", heading: "État", cell: (row: Activity) => (
    <Status kind={row.done ? "success" : "warning"}>{row.done ? "Confirmé" : "À vérifier"}</Status>
  ) },
];

export function LibraryPreview() {
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [retry, setRetry] = useState(false);

  const filtered = items.filter(({ name, channel: itemChannel }) =>
    name.toLocaleLowerCase("fr").includes(query.trim().toLocaleLowerCase("fr")) && (!channel || channel === itemChannel),
  );
  const pageSize = 2;
  const totalPages = Math.ceil(filtered.length / pageSize);

  function notify(message: string) {
    setNotice(message);
    setToastOpen(true);
  }

  function resetFilters() {
    setQuery("");
    setChannel("");
    setPage(1);
    notify("Filtres réinitialisés.");
  }

  return (
    <ToastProvider>
      <div className="board-grid">
        <Card>
          <h2 className="section-title group-heading">Filtrer et paginer</h2>
          <Filters>
            <TextField label="Rechercher une activité" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
            <SelectField label="Canal" value={channel} onChange={(event) => { setChannel(event.target.value); setPage(1); }}>
              <option value="">Tous les canaux</option>
              <option>Téléphone</option>
              <option>Email</option>
            </SelectField>
          </Filters>
          {filtered.length > 0 ? (
            <>
              <DataTable caption="Activités de démonstration" columns={columns} rows={filtered.slice((page - 1) * pageSize, page * pageSize)} rowKey={(row) => row.id} />
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          ) : (
            <EmptyState title="Aucun résultat" description="Modifie la recherche ou le canal." />
          )}
        </Card>
        <Card>
          <h2 className="section-title group-heading">Actions et confirmations</h2>
          <div className="actions">
            <Menu label="Actions" items={[
              { label: "Réinitialiser les filtres", onSelect: resetFilters },
              { label: "Afficher une notification", onSelect: () => notify("Notification de démonstration.") },
            ]} />
            <ConfirmDialog
              trigger="Ouvrir la confirmation"
              title="Confirmer la simulation"
              description="Cette action affiche une notification de démonstration."
              confirmLabel="Confirmer"
              onConfirm={() => notify("Simulation confirmée.")}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <TextField label="Adresse email" type="email" defaultValue="exemple" error="Saisis une adresse email valide." />
          </div>
        </Card>
        <Card>
          <h2 className="section-title group-heading">Carte KPI et graphique</h2>
          <dl><KpiCard title="Appels récupérés" value="126" /></dl>
          <BarChart data={[{ label: "Lun", value: 12 }, { label: "Mar", value: 18 }]} />
        </Card>
        <Card>
          <h2 className="section-title group-heading">Chargement et erreur</h2>
          <LoadingState label="Chargement des activités…" />
          <div style={{ marginTop: 12 }}>
            {retry ? (
              <EmptyState title="Aucune activité" description="La nouvelle tentative a réussi." />
            ) : (
              <ErrorState
                title="Chargement impossible"
                description="Une erreur de démonstration est survenue."
                action={<Button variant="secondary" onClick={() => setRetry(true)}>Réessayer</Button>}
              />
            )}
          </div>
        </Card>
      </div>
      <ToastNotice message={notice} open={toastOpen} onOpenChange={setToastOpen} />
    </ToastProvider>
  );
}
