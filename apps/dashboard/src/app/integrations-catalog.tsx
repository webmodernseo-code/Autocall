"use client";

import { useState } from "react";
import {
  FacebookBrandSvg,
  GmailBrandSvg,
  HubSpotBrandSvg,
  InstagramBrandSvg,
  OutlookBrandSvg,
  StripeBrandSvg,
  WhatsAppBusinessBrandSvg,
} from "./brand-icons";

type IntegrationCategory =
  | "all"
  | "communication"
  | "crm"
  | "productivity"
  | "apis";

interface IntegrationItem {
  id: string;
  name: string;
  category: Exclude<IntegrationCategory, "all">;
  description: string;
  enabled: boolean;
  connected: boolean;
  authMode: "oauth" | "apikey";
  accountLabel: string;
  permissions: string[];
  oauthUrl: string;
}

const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    category: "communication",
    description:
      "Envoyez des relances automatiques et reprenez vos conversations clients en direct.",
    enabled: true,
    connected: true,
    authMode: "oauth",
    accountLabel: "+33 1 89 20 44 00 · Meta Business",
    permissions: [
      "Lire et envoyer des messages WhatsApp Business",
      "Accéder aux modèles de messages approuvés",
      "Recevoir les accusés de lecture en temps réel",
    ],
    oauthUrl: "https://business.facebook.com/v19.0/dialog/oauth",
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "communication",
    description:
      "Synchronisez vos e-mails commerciaux, devis et comptes rendus d’appels.",
    enabled: true,
    connected: true,
    authMode: "oauth",
    accountLabel: "contact@autocall.fr",
    permissions: [
      "Envoyer des e-mails au nom de votre compte",
      "Lire les réponses liées aux prospects CRM",
    ],
    oauthUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  },
  {
    id: "outlook",
    name: "Outlook",
    category: "communication",
    description:
      "Connectez votre messagerie Microsoft 365 et votre calendrier professionnel.",
    enabled: false,
    connected: false,
    authMode: "oauth",
    accountLabel: "Compte Microsoft 365",
    permissions: [
      "Accéder à votre boîte de réception Microsoft 365",
      "Synchroniser les disponibilités de votre calendrier",
    ],
    oauthUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
  },
  {
    id: "gcal",
    name: "Google Calendar",
    category: "productivity",
    description:
      "Planifiez automatiquement les rendez-vous qualifiés par vos agents vocaux.",
    enabled: true,
    connected: true,
    authMode: "oauth",
    accountLabel: "Agenda Commercial · Google Workspace",
    permissions: [
      "Consulter vos créneaux libres en temps réel",
      "Créer et modifier les invitations rendez-vous",
    ],
    oauthUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    category: "crm",
    description:
      "Créez et mettez à jour vos fiches contacts, transactions et notes d’appels.",
    enabled: true,
    connected: true,
    authMode: "oauth",
    accountLabel: "Espace HubSpot #482910",
    permissions: [
      "Lire et écrire les contacts et entreprises",
      "Mettre à jour les transactions du pipeline",
      "Consigner les résumés d’appels IA",
    ],
    oauthUrl: "https://app.hubspot.com/oauth/authorize",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "crm",
    description:
      "Alimentez vos pipelines grands comptes et vos historiques d’interactions.",
    enabled: false,
    connected: false,
    authMode: "oauth",
    accountLabel: "Organisation Salesforce",
    permissions: [
      "Accéder aux objets Leads, Contacts et Opportunités",
      "Synchroniser les activités téléphoniques",
    ],
    oauthUrl: "https://login.salesforce.com/services/oauth2/authorize",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "crm",
    description:
      "Encaissez vos devis, factures clients et abonnements directement en ligne.",
    enabled: true,
    connected: true,
    authMode: "oauth",
    accountLabel: "Compte Stripe · AutoCall SAS",
    permissions: [
      "Créer des liens de paiement pour vos factures",
      "Recevoir le statut des paiements validés",
    ],
    oauthUrl: "https://connect.stripe.com/oauth/authorize",
  },
  {
    id: "slack",
    name: "Slack",
    category: "communication",
    description:
      "Recevez une notification instantanée dans vos canaux à chaque lead chaud.",
    enabled: false,
    connected: false,
    authMode: "oauth",
    accountLabel: "Espace de travail Slack",
    permissions: [
      "Publier des alertes dans les canaux sélectionnés",
      "Afficher les résumés d’appels qualifiés",
    ],
    oauthUrl: "https://slack.com/oauth/v2/authorize",
  },
  {
    id: "zapier",
    name: "Zapier",
    category: "apis",
    description:
      "Déclenchez des automatisations sur mesure vers plus de 5 000 applications.",
    enabled: true,
    connected: true,
    authMode: "oauth",
    accountLabel: "3 Zaps actifs · AutoCall",
    permissions: [
      "Déclencher des Zaps sur nouvel appel ou RDV",
      "Recevoir des webhooks entrants sécurisés",
    ],
    oauthUrl: "https://zapier.com/oauth/authorize",
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "communication",
    description:
      "Publiez vos contenus sociaux et centralisez les demandes issues de vos posts.",
    enabled: false,
    connected: false,
    authMode: "oauth",
    accountLabel: "Compte professionnel Instagram",
    permissions: [
      "Publier des visuels et légendes planifiés",
      "Lire les messages et commentaires entrants",
    ],
    oauthUrl: "https://api.instagram.com/oauth/authorize",
  },
  {
    id: "facebook",
    name: "Facebook",
    category: "communication",
    description:
      "Diffusez vos campagnes et récupérez automatiquement vos formulaires de leads.",
    enabled: false,
    connected: false,
    authMode: "oauth",
    accountLabel: "Page Facebook Entreprise",
    permissions: [
      "Récupérer les leads Facebook Lead Ads",
      "Publier sur vos pages professionnelles",
    ],
    oauthUrl: "https://www.facebook.com/v19.0/dialog/oauth",
  },
  {
    id: "webhooks",
    name: "API & Webhooks",
    category: "apis",
    description:
      "Connectez votre ERP ou outil interne via événements temps réel et clés API.",
    enabled: true,
    connected: true,
    authMode: "apikey",
    accountLabel: "https://api.entreprise.fr/webhooks/autocall",
    permissions: [
      "Signer chaque requête sortante (HMAC-SHA256)",
      "Émettre les événements appel.termine et rdv.confirme",
    ],
    oauthUrl: "",
  },
];

function IntegrationLogo({ id }: { id: string }) {
  if (id === "whatsapp") {
    return (
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xs">
        <WhatsAppBusinessBrandSvg className="size-full" />
      </span>
    );
  }
  if (id === "gmail") {
    return (
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xs">
        <GmailBrandSvg className="size-full" />
      </span>
    );
  }
  if (id === "outlook") {
    return (
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xs">
        <OutlookBrandSvg className="size-full" />
      </span>
    );
  }
  if (id === "instagram") {
    return (
      <span className="inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xs">
        <InstagramBrandSvg className="size-full rounded-lg" />
      </span>
    );
  }
  if (id === "facebook") {
    return (
      <span className="inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xs">
        <FacebookBrandSvg className="size-full" />
      </span>
    );
  }
  if (id === "stripe") {
    return (
      <span className="inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xs">
        <StripeBrandSvg className="size-full rounded-lg" />
      </span>
    );
  }
  if (id === "hubspot") {
    return (
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xs">
        <HubSpotBrandSvg className="size-full" />
      </span>
    );
  }
  if (id === "salesforce") {
    return (
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#00A1E0] text-white shadow-2xs">
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
          <path d="M17.5 17H7.2a3.7 3.7 0 0 1-.4-7.4A4.8 4.8 0 0 1 16 8.2a3.8 3.8 0 0 1 1.5 7.3Z" />
        </svg>
      </span>
    );
  }
  if (id === "gcal") {
    return (
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#2563EB] shadow-2xs">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2.5" />
          <path d="M16 3v4M8 3v4M3 10h18" strokeLinecap="round" />
          <path d="M9.5 15.5h5" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  if (id === "zapier") {
    return (
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FF4F00] text-white shadow-2xs">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  if (id === "slack") {
    return (
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-2xs">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <rect x="10" y="3" width="3" height="8" rx="1.5" fill="#E01E5A" />
          <rect x="13" y="10" width="8" height="3" rx="1.5" fill="#2EB67D" />
          <rect x="11" y="13" width="3" height="8" rx="1.5" fill="#ECB22E" />
          <rect x="3" y="11" width="8" height="3" rx="1.5" fill="#36C5F0" />
        </svg>
      </span>
    );
  }
  return (
    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#171717] text-white shadow-2xs">
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function IntegrationsCatalog({ compact = false }: { compact?: boolean }) {
  const [category, setCategory] = useState<IntegrationCategory>("all");
  const [items, setItems] = useState<IntegrationItem[]>(INITIAL_INTEGRATIONS);
  const [modalItemId, setModalItemId] = useState<string | null>(null);
  const [accountInput, setAccountInput] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const openConnectionDialog = (item: IntegrationItem) => {
    setModalItemId(item.id);
    setAccountInput(
      item.connected
        ? item.accountLabel
        : item.authMode === "apikey"
          ? "https://api.votre-entreprise.fr/webhooks/autocall"
          : "contact@autocall.fr",
    );
  };

  const toggleItem = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    if (!target.connected && !target.enabled) {
      openConnectionDialog(target);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = !item.enabled;
        notify(`${item.name} ${next ? "activé" : "désactivé"}`);
        return { ...item, enabled: next };
      }),
    );
  };

  const handleAuthorizeConnection = () => {
    if (!modalItemId) return;
    const target = items.find((i) => i.id === modalItemId);
    if (!target) return;
    setConnecting(true);
    window.setTimeout(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === modalItemId
            ? {
                ...item,
                connected: true,
                enabled: true,
                accountLabel: accountInput.trim() || item.accountLabel,
              }
            : item,
        ),
      );
      setConnecting(false);
      setModalItemId(null);
      notify(`${target.name} connecté avec succès`);
    }, 550);
  };

  const handleDisconnect = () => {
    if (!modalItemId) return;
    const target = items.find((i) => i.id === modalItemId);
    if (!target) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === modalItemId
          ? { ...item, connected: false, enabled: false }
          : item,
      ),
    );
    setModalItemId(null);
    notify(`${target.name} déconnecté`);
  };

  const modalItem = modalItemId
    ? items.find((i) => i.id === modalItemId) ?? null
    : null;

  const visibleItems =
    category === "all"
      ? items
      : items.filter((item) => item.category === category);

  const categories: { id: IntegrationCategory; label: string }[] = [
    { id: "all", label: "Toutes les intégrations" },
    { id: "communication", label: "Communication" },
    { id: "crm", label: "CRM & Ventes" },
    { id: "productivity", label: "Productivité" },
    { id: "apis", label: "APIs & Webhooks" },
  ];

  return (
    <div className={compact ? "space-y-4" : "w-full space-y-5 p-6"}>
      {toast && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-medium text-gray-900 shadow-lg">
          <span className="size-1.5 rounded-full bg-[#171717]" />
          {toast}
        </div>
      )}

      {/* En-tête */}
      <div>
        <h3
          className={
            compact
              ? "text-[17px] font-semibold tracking-tight text-gray-900"
              : "text-[22px] font-semibold tracking-[-0.025em] text-gray-900"
          }
        >
          Intégrations
        </h3>
        <p className="mt-0.5 text-[13.5px] text-gray-500">
          Connectez vos outils métier et synchronisez vos appels, contacts et rendez-vous.
        </p>
      </div>

      {/* Pilules catégories */}
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-[13.5px] transition-colors cursor-pointer ${
                active
                  ? "bg-gray-100 font-semibold text-gray-900"
                  : "font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grille d'intégrations */}
      <div
        className={
          compact
            ? "grid grid-cols-1 gap-4 md:grid-cols-2"
            : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        }
      >
        {visibleItems.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <IntegrationLogo id={item.id} />

                {/* Interrupteur toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={item.enabled}
                  aria-label={`Activer ${item.name}`}
                  onClick={() => toggleItem(item.id)}
                  className={`relative inline-flex h-5.5 w-10 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    item.enabled ? "bg-[#171717]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block size-4 rounded-full bg-white shadow-2xs transition-transform ${
                      item.enabled ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-[14.5px] font-semibold text-gray-900">
                    {item.name}
                  </h4>
                  {item.connected && (
                    <span
                      className="inline-flex size-1.5 rounded-full bg-[#10B981]"
                      title="Connecté"
                    />
                  )}
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => openConnectionDialog(item)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-[13px] font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-3.5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    d="M7 10h10l-2.5-2.5M17 14H7l2.5 2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item.connected ? "Connexions" : "Connecter"}
              </button>

              <button
                type="button"
                onClick={() => openConnectionDialog(item)}
                title={`Paramètres ${item.name}`}
                aria-label={`Paramètres ${item.name}`}
                className="inline-flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .69.4 1.31 1.01 1.59.31.14.65.21 1 .21H21a2 2 0 1 1 0 4h-.09c-.69 0-1.31.4-1.51 1.2Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Fenêtre d'autorisation OAuth / Connexion fournisseur */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="oauth-dialog-title"
          onClick={() => setModalItemId(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête fenêtre de connexion */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <IntegrationLogo id={modalItem.id} />
                <div>
                  <h4
                    id="oauth-dialog-title"
                    className="text-[15px] font-semibold text-gray-900"
                  >
                    {modalItem.connected
                      ? `Connexion ${modalItem.name}`
                      : `Connecter ${modalItem.name}`}
                  </h4>
                  <p className="text-[13px] text-gray-500">
                    {modalItem.authMode === "oauth"
                      ? "Autorisation sécurisée OAuth 2.0"
                      : "Configuration de point d’accès API"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalItemId(null)}
                aria-label="Fermer"
                className="inline-flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 p-5">
              {modalItem.authMode === "oauth" && (
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-[13px]">
                  <span className="truncate font-mono text-[12px] text-gray-500">
                    {modalItem.oauthUrl}
                  </span>
                  <span className="ml-2 shrink-0 rounded bg-white px-2 py-0.5 text-[12px] font-medium text-gray-700 border border-gray-200">
                    OAuth 2.0
                  </span>
                </div>
              )}

              <div>
                <label className="block text-[13.5px] font-medium text-gray-700">
                  {modalItem.authMode === "apikey"
                    ? "URL de webhook ou clé API"
                    : "Compte à associer"}
                </label>
                <input
                  type="text"
                  value={accountInput}
                  onChange={(e) => setAccountInput(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-[14px] text-gray-900 focus:border-gray-400 focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3.5">
                <p className="text-[13px] font-medium text-gray-700">
                  Permissions demandées par AutoCall
                </p>
                <ul className="mt-2 space-y-1.5 text-[13px] text-gray-600">
                  {modalItem.permissions.map((perm) => (
                    <li key={perm} className="flex items-start gap-2">
                      <svg
                        viewBox="0 0 24 24"
                        className="mt-0.5 size-3.5 shrink-0 text-[#008F6D]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        aria-hidden="true"
                      >
                        <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="flex items-center gap-1.5 text-[12.5px] text-gray-400">
                <svg
                  viewBox="0 0 24 24"
                  className="size-3.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
                </svg>
                <span>Connexion chiffrée SSL · Révocable à tout moment</span>
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-3.5">
              {modalItem.connected ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="h-9 rounded-lg border border-red-200 bg-white px-3 text-[13.5px] font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Déconnecter
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalItemId(null)}
                  className="h-9 rounded-lg border border-gray-200 bg-white px-3.5 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={connecting}
                  onClick={handleAuthorizeConnection}
                  className="inline-flex h-9 items-center rounded-lg bg-[#171717] px-4 text-[13.5px] font-medium text-white transition hover:bg-[#2E2E2E] disabled:opacity-60 cursor-pointer"
                >
                  {connecting
                    ? "Connexion en cours..."
                    : modalItem.connected
                      ? "Mettre à jour"
                      : modalItem.authMode === "oauth"
                        ? "Autoriser et connecter"
                        : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

