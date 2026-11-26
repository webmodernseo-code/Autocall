"use client";

import { useState } from "react";
import type { Locale } from "./workspace-navigation";

export type NotificationKind = "error" | "success" | "info" | "warning";
type FilterTab = "all" | "error" | "success" | "info";

export interface NotificationEntry {
  id: string;
  kind: NotificationKind;
  read: boolean;
  time: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}

export const initialNotifications: NotificationEntry[] = [
  {
    id: "n1",
    kind: "error",
    read: false,
    time: { fr: "Il y a 15 min", en: "15m ago", es: "Hace 15 min" },
    title: {
      fr: "Échec synchronisation HubSpot — jeton expiré",
      en: "HubSpot Sync failed — auth token expired",
      es: "Error al sincronizar HubSpot — token expirado",
    },
    description: {
      fr: "Le jeton OAuth pour HubSpot a expiré. Reconnectez votre compte pour reprendre la synchronisation.",
      en: "The OAuth token for HubSpot has expired. Re-authenticate to resume syncing.",
      es: "El token OAuth de HubSpot ha expirado. Vuelve a autenticarte para reanudar.",
    },
  },
  {
    id: "n2",
    kind: "success",
    read: false,
    time: { fr: "Il y a 30 min", en: "30m ago", es: "Hace 30 min" },
    title: {
      fr: "Qualification des prospects terminée",
      en: "Lead Scoring Pipeline completed",
      es: "Pipeline de calificación completado",
    },
    description: {
      fr: "284 nouveaux prospects importés et qualifiés avec succès depuis votre base CRM.",
      en: "Successfully processed and scored 284 new leads from your CRM source.",
      es: "Se procesaron y calificaron con éxito 284 nuevos prospectos desde tu CRM.",
    },
  },
  {
    id: "n3",
    kind: "info",
    read: false,
    time: { fr: "Il y a 1 h", en: "1h ago", es: "Hace 1 h" },
    title: {
      fr: "Nouveau modèle : Routeur d’appels IA",
      en: "New template: AI Call Router",
      es: "Nueva plantilla: Enrutador de llamadas IA",
    },
    description: {
      fr: "Un nouveau modèle « Routeur d’appels IA » est maintenant disponible dans votre bibliothèque.",
      en: 'A new community template "AI Call Router" is now available in your library.',
      es: 'La nueva plantilla "Enrutador de llamadas IA" ya está disponible en tu biblioteca.',
    },
  },
  {
    id: "n4",
    kind: "success",
    read: false,
    time: { fr: "Il y a 2 h", en: "2h ago", es: "Hace 2 h" },
    title: {
      fr: "Agent Accueil a traité 47 appels",
      en: "Reception Agent processed 47 calls",
      es: "Agente de recepción procesó 47 llamadas",
    },
    description: {
      fr: "47 appels entrants qualifiés et résumés automatiquement avec prise de rendez-vous.",
      en: "Routed and summarized 47 incoming calls with automated calendar booking.",
      es: "Se enrutaron y resumieron 47 llamadas entrantes con reserva automática.",
    },
  },
  {
    id: "n5",
    kind: "info",
    read: true,
    time: { fr: "Il y a 3 h", en: "3h ago", es: "Hace 3 h" },
    title: {
      fr: "Rapport hebdomadaire planifié",
      en: "Weekly Report Generator scheduled",
      es: "Informe semanal programado",
    },
    description: {
      fr: "La prochaine exécution est prévue lundi à 9 h 00. Le scénario est actif.",
      en: "Next run is scheduled for Monday 9:00 AM. The workflow is currently active.",
      es: "La próxima ejecución está prevista para el lunes a las 9:00. Flujo activo.",
    },
  },
  {
    id: "n6",
    kind: "warning",
    read: true,
    time: { fr: "Il y a 4 h", en: "4h ago", es: "Hace 4 h" },
    title: {
      fr: "Limite de débit WhatsApp atteinte",
      en: "WhatsApp API rate limit hit",
      es: "Límite de tasa de WhatsApp alcanzado",
    },
    description: {
      fr: "La limite API a été brièvement dépassée. 3 messages ont été mis en file d’attente.",
      en: "The API rate limit was briefly exceeded. 3 messages were queued for retry.",
      es: "Se superó brevemente el límite de la API. 3 mensajes quedaron en cola.",
    },
  },
  {
    id: "n7",
    kind: "info",
    read: true,
    time: { fr: "Il y a 5 h", en: "5h ago", es: "Hace 5 h" },
    title: {
      fr: "Scénario « Relance de devis » enregistré",
      en: 'Workflow "Quote Follow-up" saved',
      es: 'Flujo "Seguimiento de presupuestos" guardado',
    },
    description: {
      fr: "Votre brouillon a bien été sauvegardé. 12 étapes configurées.",
      en: "Your draft workflow has been saved. 12 nodes configured.",
      es: "Tu borrador ha sido guardado correctamente. 12 nodos configurados.",
    },
  },
];

const panelCopy: Record<
  Locale,
  {
    title: string;
    markAllRead: string;
    close: string;
    tabs: Record<FilterTab, string>;
    badges: Record<NotificationKind, string>;
    empty: string;
  }
> = {
  fr: {
    title: "Notifications",
    markAllRead: "Tout marquer comme lu",
    close: "Fermer les notifications",
    tabs: { all: "Toutes", error: "Erreur", success: "Succès", info: "Info" },
    badges: {
      error: "Erreur",
      success: "Succès",
      info: "Info",
      warning: "Alerte",
    },
    empty: "Aucune notification dans cette catégorie.",
  },
  en: {
    title: "Notifications",
    markAllRead: "Mark all read",
    close: "Close notifications",
    tabs: { all: "All", error: "Error", success: "Success", info: "Info" },
    badges: {
      error: "Error",
      success: "Success",
      info: "Info",
      warning: "Warning",
    },
    empty: "No notifications in this category.",
  },
  es: {
    title: "Notificaciones",
    markAllRead: "Marcar todo como leído",
    close: "Cerrar notificaciones",
    tabs: { all: "Todas", error: "Error", success: "Éxito", info: "Info" },
    badges: {
      error: "Error",
      success: "Éxito",
      info: "Info",
      warning: "Alerta",
    },
    empty: "No hay notificaciones en esta categoría.",
  },
};

function KindIcon({ kind }: { kind: NotificationKind }) {
  const styles: Record<NotificationKind, { bg: string; fg: string }> = {
    error: { bg: "#FEE2E2", fg: "#DC2626" },
    success: { bg: "#DCFCE7", fg: "#15803D" },
    info: { bg: "#DBEAFE", fg: "#1D4ED8" },
    warning: { bg: "#FEF3C7", fg: "#B45309" },
  };
  const { bg, fg } = styles[kind];

  return (
    <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#ECECEC] bg-white shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
      <span
        className="inline-flex size-5 items-center justify-center rounded-full"
        style={{ backgroundColor: bg, color: fg }}
      >
        {kind === "error" && (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M10 6v4.6" />
            <circle cx="10" cy="13.8" r="0.85" fill="currentColor" stroke="none" />
          </svg>
        )}
        {kind === "success" && (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6.5 10.2l2.2 2.2 4.8-4.8" />
          </svg>
        )}
        {kind === "info" && (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M10 9.2v4.6" />
            <circle cx="10" cy="6.4" r="0.85" fill="currentColor" stroke="none" />
          </svg>
        )}
        {kind === "warning" && (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 4.5L3.6 15.5h12.8L10 4.5z" />
            <path d="M10 8.5v3.2" />
            <circle cx="10" cy="13.7" r="0.7" fill="currentColor" stroke="none" />
          </svg>
        )}
      </span>
    </span>
  );
}

const badgeStyles: Record<NotificationKind, string> = {
  error: "bg-[#FEE2E2] text-[#B91C1C]",
  success: "bg-[#DCFCE7] text-[#15803D]",
  info: "bg-[#DBEAFE] text-[#1D4ED8]",
  warning: "bg-[#FEF3C7] text-[#B45309]",
};

export function NotificationPanel({
  locale,
  onClose,
  items: controlledItems,
  onMarkAllRead,
  onMarkOneRead,
}: {
  locale: Locale;
  onClose: () => void;
  items?: NotificationEntry[];
  onMarkAllRead?: () => void;
  onMarkOneRead?: (id: string) => void;
}) {
  const [internalItems, setInternalItems] =
    useState<NotificationEntry[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const items = controlledItems ?? internalItems;
  const t = panelCopy[locale];

  const counts: Record<FilterTab, number> = {
    all: items.length,
    error: items.filter((n) => n.kind === "error").length,
    success: items.filter((n) => n.kind === "success").length,
    info: items.filter((n) => n.kind === "info").length,
  };

  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter((item) => item.kind === activeTab);

  const markAllRead = () => {
    if (onMarkAllRead) {
      onMarkAllRead();
    } else {
      setInternalItems((prev) => prev.map((item) => ({ ...item, read: true })));
    }
  };

  const markOneRead = (id: string) => {
    if (onMarkOneRead) {
      onMarkOneRead(id);
    } else {
      setInternalItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
      );
    }
  };

  const tabs: FilterTab[] = ["all", "error", "success", "info"];

  return (
    <div
      role="dialog"
      aria-label={t.title}
      className="fixed top-14 right-3 z-40 flex max-h-[calc(100dvh-68px)] w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-xl sm:right-5 sm:w-[400px]"
    >
      {/* En-tête du panneau */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
        <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-[#171717]">
          {t.title}
        </h2>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={markAllRead}
            className="text-[13px] font-medium text-[#525252] underline underline-offset-2 transition-colors hover:text-[#171717] cursor-pointer"
          >
            {t.markAllRead}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="inline-flex size-7 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#525252] transition-colors hover:bg-[#F4F4F5] hover:text-[#171717] cursor-pointer"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Onglets de filtre */}
      <div className="px-4 pb-3">
        <div
          role="tablist"
          aria-label={t.title}
          className="grid grid-cols-4 gap-1 rounded-xl bg-[#F4F4F5] p-1"
        >
          {tabs.map((tab) => {
            const selected = activeTab === tab;
            const count = counts[tab];
            const formattedCount =
              tab === "all" && count < 10 ? `0${count}` : String(count);
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab)}
                className={`flex h-7.5 items-center justify-center gap-1.5 rounded-lg px-2 text-[13px] transition-all cursor-pointer ${
                  selected
                    ? "bg-white font-medium text-[#171717] shadow-2xs"
                    : "font-normal text-[#525252] hover:text-[#171717]"
                }`}
              >
                <span>{t.tabs[tab]}</span>
                <span
                  className={`inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[12px] font-medium tabular-nums ${
                    selected
                      ? "bg-[#F4F4F5] text-[#171717]"
                      : "bg-[#E5E5E5]/70 text-[#525252]"
                  }`}
                >
                  {formattedCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {filteredItems.length === 0 ? (
          <p className="py-8 text-center text-[13.5px] text-[#737373]">
            {t.empty}
          </p>
        ) : (
          filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => markOneRead(item.id)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                item.read
                  ? "border-[#EFEFEF] bg-white hover:bg-[#FAFAFA]"
                  : "border-[#E5E5E5] bg-[#FAFAFA] hover:bg-[#F4F4F5]/70"
              }`}
            >
              <KindIcon kind={item.kind} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13.5px] font-medium leading-4 text-[#171717]">
                    {item.title[locale]}
                  </p>
                  {!item.read && (
                    <span
                      aria-hidden="true"
                      className="mt-1 size-1.5 shrink-0 rounded-full bg-[#171717]"
                    />
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-[12.5px] leading-4 text-[#737373]">
                  {item.description[locale]}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[12px] text-[#8C8C8C]">
                    {item.time[locale]}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[12px] font-medium ${badgeStyles[item.kind]}`}
                  >
                    {t.badges[item.kind]}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

