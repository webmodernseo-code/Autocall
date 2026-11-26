"use client";

import Link from "next/link";
import { useState } from "react";
import { PhoneTools } from "./communication-tools";
import { IntegrationsCatalog } from "./integrations-catalog";
import { PremiumCheckbox } from "./premium-checkbox";
import { PremiumSelect } from "./premium-select";
import { BillingPlanPanel } from "./settings/billing-plan-panel";
import { CreditSettings, SecuritySessions } from "./settings/settings-controls";
import { type Locale } from "./workspace-navigation";

type SettingsSection =
  | "profile"
  | "company"
  | "billing"
  | "integrations"
  | "notifications"
  | "security"
  | "telephony"
  | "credits"
  | "preferences"
  | "support";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Administrateur" | "Commercial" | "Superviseur";
  status: "Actif" | "Invité";
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "m1",
    name: "Tanjim",
    email: "tanjim@autocall.fr",
    role: "Administrateur",
    status: "Actif",
  },
  {
    id: "m2",
    name: "Sarah Martin",
    email: "sarah@autocall.fr",
    role: "Commercial",
    status: "Actif",
  },
];

const SETTINGS_TABS: { id: SettingsSection; labelFr: string; labelEn: string }[] = [
  { id: "profile", labelFr: "Profil personnel", labelEn: "My profile" },
  { id: "company", labelFr: "Entreprise et collaborateurs", labelEn: "Company and team" },
  { id: "telephony", labelFr: "Téléphonie", labelEn: "Telephony" },
  { id: "integrations", labelFr: "Intégrations", labelEn: "Integrations" },
  { id: "notifications", labelFr: "Notifications", labelEn: "Notifications" },
  { id: "billing", labelFr: "Abonnement et facturation", labelEn: "Subscription and billing" },
  { id: "credits", labelFr: "Crédits et consommations", labelEn: "Credits and usage" },
  { id: "security", labelFr: "Sécurité et confidentialité", labelEn: "Security and privacy" },
  { id: "preferences", labelFr: "Préférences générales", labelEn: "General preferences" },
];

function SidebarIcon({ id, active }: { id: SettingsSection; active: boolean }) {
  const cls = `size-4 shrink-0 ${active ? "text-gray-900" : "text-gray-400"}`;
  switch (id) {
    case "profile":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c1.6-3.6 4.7-5.5 8-5.5s6.4 1.9 8 5.5" strokeLinecap="round" />
        </svg>
      );
    case "company":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <path d="M3 21h18M5 21V7l8-4v18M13 21V11l6 3v7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "billing":
    case "credits":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <rect x="2" y="5" width="20" height="14" rx="2.5" />
          <path d="M2 10h20" />
        </svg>
      );
    case "integrations":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <path d="M9 3v4M15 3v4M7 7h10v4a5 5 0 0 1-10 0V7zM12 16v5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "telephony":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden="true">
          <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M10 17h4" strokeLinecap="round" />
        </svg>
      );
    case "notifications":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "security":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <path d="M12 3l7 3v5c0 4.5-3 8.4-7 10-4-1.6-7-5.5-7-10V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "preferences":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
        </svg>
      );
    case "support":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5M12 16.5h.01" strokeLinecap="round" />
        </svg>
      );
  }
}

function ChevronRightSvg() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 shrink-0 text-gray-400">
      <path d="M7.5 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SettingsView({ locale, initialCompany, initialTimezone, initialSection = "profile" }: { locale: Locale; initialCompany?: string; initialTimezone?: string; initialSection?: SettingsSection }) {
  const isEn = locale === "en";
  const [section, setSection] = useState<SettingsSection>(initialSection);
  const [currency, setCurrency] = useState("EUR");
  const [dateFormat, setDateFormat] = useState("day-first");

  // Mon profil
  const [fullName, setFullName] = useState("Tanjim");
  const [userEmail, setUserEmail] = useState("tanjim@autocall.fr");
  const [userRoleLabel, setUserRoleLabel] = useState("Administrateur");

  // Entreprise & Téléphonie
  const [companyName, setCompanyName] = useState(initialCompany || "AutoCall Services");
  const [contactEmail, setContactEmail] = useState("contact@autocall.fr");
  const [timezone, setTimezone] = useState(initialTimezone || "Europe/Paris");
  const [defaultLang, setDefaultLang] = useState("fr");
  const [mainPhone, setMainPhone] = useState("+33 1 86 95 42 10");
  const [callHours, setCallHours] = useState("09:00 - 19:00");
  const [recordCalls, setRecordCalls] = useState(true);
  const [rgpdNotice, setRgpdNotice] = useState(true);
  const [retentionDays, setRetentionDays] = useState("180");

  // Équipe
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Commercial" | "Superviseur">("Commercial");

  // Notifications
  const [notifCampaigns, setNotifCampaigns] = useState(true);
  const [notifWeeklySummary, setNotifWeeklySummary] = useState(true);
  const [notifSecurityAlerts, setNotifSecurityAlerts] = useState(true);

  // Sécurité
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Confidentialité — suppression compte
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteAck, setDeleteAck] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const initials = fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const sectionTitle = SETTINGS_TABS.find((item) => item.id === section);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const handleSave = (msg: string) => {
    notify(msg + (isEn ? " · Demo" : " · Démonstration"));
  };

  const handleInvite = () => {
    const email = inviteEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify("Renseignez une adresse email valide.");
      return;
    }
    if (members.some((member) => member.email.toLowerCase() === email.toLowerCase())) {
      notify("Cette adresse figure déjà dans les collaborateurs.");
      return;
    }
    const invite: TeamMember = { id: crypto.randomUUID(), name: email.split("@")[0], email, role: inviteRole, status: "Invité" };
    setMembers((previous) => previous.some((member) => member.email.toLowerCase() === email.toLowerCase()) ? previous : [...previous, invite]);
    setInviteEmail("");
    setInviteOpen(false);
    notify("Invitation ajoutée à la démonstration. Aucun email envoyé.");
  };

  const handleExportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      account: { fullName, email: userEmail, companyName, timezone, defaultLang },
      telephony: { mainPhone, callHours, recordCalls, retentionDays },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "autocall-export-donnees.json";
    a.click();
    URL.revokeObjectURL(url);
    notify(isEn ? "Data export generated" : "Export de vos données généré");
  };

  return (
    <div className="@container w-full min-w-0 space-y-6 px-4 py-6 sm:px-7 sm:py-8">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-[10px] border border-[#E5E5E5] bg-[#171717] px-4 py-2.5 text-[13.5px] font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* En-tête */}
      <div>
        <h2 className="text-[26px] leading-8 font-semibold tracking-[-0.025em] text-[var(--foreground)]">
          {isEn ? "Settings" : "Paramètres"}
        </h2>
        <p className="mt-1 text-[14px] leading-[21px] text-[#525252]">
          {isEn
            ? "Manage your client workspace."
            : "Administrez votre espace client."}
        </p>
      </div>

      <div className="min-w-0 space-y-6">
        <div className="min-w-0 border-b border-[var(--border)]">
          <nav aria-label="Navigation des paramètres" className="flex w-full flex-nowrap gap-6 overflow-x-auto">
            {SETTINGS_TABS.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setSection(item.id)}
                  className={`relative flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap border-b-2 pb-2.5 text-left text-[13.5px] transition cursor-pointer ${
                    active
                      ? "border-[var(--foreground)] font-semibold text-[var(--foreground)]"
                      : "border-transparent font-medium text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <SidebarIcon id={item.id} active={active} />
                  <span>{isEn ? item.labelEn : item.labelFr}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 shadow-2xs sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5 text-[13px]">
            <span className="size-2 shrink-0 rounded-full bg-[#008F6D]" aria-hidden="true" />
            <div className="min-w-0">
              <p className="break-words font-semibold text-[var(--foreground)]">{companyName || (isEn ? "Client workspace" : "Espace client")}</p>
              <p className="text-[var(--text-muted)]">{isEn ? "Demo workspace · Session settings" : "Espace de démonstration · Réglages de session"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {section !== "security" && <button type="button" onClick={() => setSection("security")} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-[12.5px] font-medium hover:bg-[var(--surface-hover)]">{isEn ? "Security" : "Sécurité"} <span aria-hidden="true">→</span></button>}
            {section !== "support" && <button type="button" onClick={() => setSection("support")} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-[12.5px] font-medium hover:bg-[var(--surface-hover)]">{isEn ? "Support" : "Assistance"} <span aria-hidden="true">→</span></button>}
            {section === "support" && <button type="button" onClick={() => setSection("preferences")} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-[12.5px] font-medium hover:bg-[var(--surface-hover)]">{isEn ? "Back to preferences" : "Retour aux préférences"}</button>}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="min-w-0 flex-1" aria-label={sectionTitle ? isEn ? sectionTitle.labelEn : sectionTitle.labelFr : isEn ? "Support" : "Assistance"}>
          {section === "telephony" && (
            <section className="space-y-4">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="font-semibold">Numéro professionnel</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm">Numéro principal<input type="tel" value={mainPhone} onChange={(event) => setMainPhone(event.target.value)} className="rounded-lg border border-[var(--border)] px-3 py-2" /></label>
                  <label className="grid gap-1 text-sm">Plage d’appels sortants<input value={callHours} onChange={(event) => setCallHours(event.target.value)} className="rounded-lg border border-[var(--border)] px-3 py-2" /></label>
                </div>
              </div>
              <PhoneTools timezone={timezone} />
            </section>
          )}
          <div hidden={section !== "credits"}><CreditSettings /></div>
          {section === "preferences" && (
            <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold">Préférences générales</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid min-w-0 gap-1 text-sm">
                  <label htmlFor="settings-language">Langue préférée</label>
                  <PremiumSelect id="settings-language" value={defaultLang} onChange={setDefaultLang} options={[{ value: "fr", label: "Français" }, { value: "en", label: "English" }, { value: "es", label: "Español" }]} />
                </div>
                <div className="grid min-w-0 gap-1 text-sm">
                  <label htmlFor="settings-currency">Devise</label>
                  <PremiumSelect id="settings-currency" value={currency} onChange={setCurrency} options={["EUR", "USD", "XOF"].map((value) => ({ value, label: value }))} />
                </div>
                <div className="grid min-w-0 gap-1 text-sm">
                  <label htmlFor="settings-timezone">Fuseau horaire</label>
                  <PremiumSelect id="settings-timezone" value={timezone} onChange={setTimezone} options={["Europe/Paris", "Europe/London", "America/New_York", "Africa/Abidjan"].map((value) => ({ value, label: value }))} />
                </div>
                <div className="grid min-w-0 gap-1 text-sm">
                  <label htmlFor="settings-date-format">Format de date</label>
                  <PremiumSelect id="settings-date-format" value={dateFormat} onChange={setDateFormat} options={[{ value: "day-first", label: "JJ/MM/AAAA" }, { value: "iso", label: "AAAA-MM-JJ" }]} />
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)]">Aperçu · {dateFormat === "iso" ? "2026-11-26" : "26/11/2026"} · {timezone} · {new Intl.NumberFormat(defaultLang, { style: "currency", currency }).format(1250)}</p>
              <button type="button" onClick={() => setSection("support")} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">Assistance et prise en main</button>
            </section>
          )}
          {/* 1. Mon profil */}
          {section === "profile" && (
            <div className="grid items-start gap-5 @min-[48rem]:grid-cols-[minmax(0,1fr)_minmax(16rem,0.46fr)]">
              <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xs sm:p-6">
                <h3 className="text-[16px] font-bold text-gray-900">
                  {isEn ? "My profile" : "Mon profil"}
                </h3>
                <p className="mt-1 text-[13px] text-gray-500">
                  {isEn
                    ? "Personal account information and workspace role."
                    : "Informations personnelles de votre compte et rôle dans l'espace de travail."}
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-[var(--surface-inset)] p-4 @min-[40rem]:grid-cols-2">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3.5 text-[14px] text-gray-900 outline-none focus:border-[#008F6D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700">
                      Adresse e-mail professionnelle
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3.5 text-[14px] text-gray-900 outline-none focus:border-[#008F6D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700">
                      Fonction
                    </label>
                    <input
                      type="text"
                      value={userRoleLabel}
                      onChange={(e) => setUserRoleLabel(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3.5 text-[14px] text-gray-900 outline-none focus:border-[#008F6D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700">
                      Langue de l&apos;interface
                    </label>
                    <PremiumSelect
                      value={defaultLang}
                      onChange={setDefaultLang}
                      ariaLabel="Langue de l'interface"
                      className="mt-1"
                      options={[
                        { value: "fr", label: "Français" },
                        { value: "en", label: "English" },
                        { value: "es", label: "Español" },
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSave("Profil mis à jour")}
                    className="h-10 rounded-xl bg-gray-900 px-4 text-[13.5px] font-semibold text-white hover:bg-gray-800 cursor-pointer"
                  >
                    Enregistrer le profil
                  </button>
                </div>
              </div>
              <aside className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xs sm:p-5" aria-label={isEn ? "Account overview" : "Aperçu du compte"}>
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#E6F5F0] text-sm font-semibold text-[#00775B]" aria-hidden="true">{initials || "—"}</span>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold">{fullName || "—"}</p>
                    <p className="break-words text-[13px] text-[var(--text-muted)]">{userRoleLabel || "—"}</p>
                  </div>
                </div>
                <dl className="mt-4 space-y-2 rounded-xl bg-[var(--surface-inset)] p-3 text-[13px]">
                  <div><dt className="text-[var(--text-muted)]">Email</dt><dd className="[overflow-wrap:anywhere] font-medium">{userEmail || "—"}</dd></div>
                  <div><dt className="text-[var(--text-muted)]">{isEn ? "Time zone" : "Fuseau horaire"}</dt><dd className="font-medium">{timezone}</dd></div>
                </dl>
                <button type="button" onClick={() => setSection("preferences")} className="mt-4 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-[13px] font-medium hover:bg-[var(--surface-hover)]">{isEn ? "Change my preferences" : "Modifier mes préférences"}</button>
              </aside>
            </div>
          )}

          {/* 2. Entreprise (incluant téléphonie & équipe) */}
          {section === "company" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
                <h3 className="text-[16px] font-bold text-gray-900">
                  Informations de l&apos;entreprise
                </h3>
                <p className="mt-1 text-[13px] text-gray-500">
                  Identité de votre organisation, fuseau horaire et paramètres téléphoniques.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700">
                      Nom de l&apos;entreprise
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3.5 text-[14px] text-gray-900 outline-none focus:border-[#008F6D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700">
                      E-mail de contact
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3.5 text-[14px] text-gray-900 outline-none focus:border-[#008F6D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700">
                      Fuseau horaire
                    </label>
                    <PremiumSelect
                      value={timezone}
                      onChange={setTimezone}
                      ariaLabel="Fuseau horaire"
                      className="mt-1"
                      options={[
                        { value: "Europe/Paris", label: "Europe/Paris (UTC+1)" },
                        { value: "Europe/London", label: "Europe/London (UTC+0)" },
                        { value: "America/New_York", label: "America/New_York (UTC-5)" },
                        { value: "Africa/Abidjan", label: "Africa/Abidjan" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700">
                      Numéro principal sortant
                    </label>
                    <input
                      type="text"
                      value={mainPhone}
                      onChange={(e) => setMainPhone(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3.5 text-[14px] text-gray-900 outline-none focus:border-[#008F6D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700">
                      Plage horaire d&apos;appel autorisée
                    </label>
                    <input
                      type="text"
                      value={callHours}
                      onChange={(e) => setCallHours(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3.5 text-[14px] text-gray-900 outline-none focus:border-[#008F6D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700">
                      Durée de rétention des appels
                    </label>
                    <PremiumSelect
                      value={retentionDays}
                      onChange={setRetentionDays}
                      ariaLabel="Durée de rétention des appels"
                      className="mt-1"
                      options={[
                        { value: "30", label: "30 jours" },
                        { value: "90", label: "90 jours" },
                        { value: "180", label: "180 jours (recommandé)" },
                        { value: "365", label: "1 an" },
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <span className="mt-0.5 shrink-0">
                      <PremiumCheckbox
                        checked={recordCalls}
                        onChange={setRecordCalls}
                        ariaLabel="Enregistrement automatique des appels"
                      />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-medium text-gray-900">
                        Enregistrement automatique des appels
                      </p>
                      <p className="text-[12px] text-gray-500">
                        Conserver l&apos;audio pour la transcription et le contrôle qualité.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <span className="mt-0.5 shrink-0">
                      <PremiumCheckbox
                        checked={rgpdNotice}
                        onChange={setRgpdNotice}
                        ariaLabel="Annonce légale d'enregistrement en début d'appel"
                      />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-medium text-gray-900">
                        Annonce d&apos;information en début d&apos;appel
                      </p>
                      <p className="text-[12px] text-gray-500">
                        Informe automatiquement l&apos;interlocuteur de l&apos;utilisation d&apos;un assistant IA et de l&apos;enregistrement.{" "}
                        <Link href="/call-recording" className="font-medium text-[#184D3B] hover:underline">
                          Consulter la politique d&apos;enregistrement des appels
                        </Link>
                      </p>
                    </div>
                  </label>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSave("Paramètres entreprise enregistrés")}
                    className="h-10 rounded-xl bg-gray-900 px-4 text-[13.5px] font-semibold text-white hover:bg-gray-800 cursor-pointer"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>

              {/* Équipe & Collaborateurs */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-bold text-gray-900">
                      Membres de l&apos;équipe
                    </h3>
                    <p className="mt-0.5 text-[13px] text-gray-500">
                      Gérez les accès collaborateurs à votre espace AutoCall.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInviteOpen(true)}
                    className="h-9 rounded-xl border border-gray-200 bg-white px-3.5 text-[13px] font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer"
                  >
                    Inviter un membre
                  </button>
                </div>

                <div className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                    >
                      <div>
                        <p className="text-[13.5px] font-semibold text-gray-900">
                          {m.name}
                        </p>
                        <p className="text-[12px] text-gray-500">{m.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[12px] font-medium text-gray-700">
                          {m.role}
                        </span>
                        <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Abonnement */}
          {section === "billing" && <BillingPlanPanel onNotify={notify} />}

          {/* 4. Intégrations */}
          {section === "integrations" && <IntegrationsCatalog compact />}

          {/* 5. Notifications */}
          {section === "notifications" && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
              <h3 className="text-[16px] font-bold text-gray-900">
                Préférences de notifications
              </h3>
              <p className="mt-1 text-[13px] text-gray-500">
                Choisissez les alertes e-mail et événements que vous souhaitez recevoir.
              </p>

              <div className="mt-5 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <span className="mt-0.5 shrink-0">
                    <PremiumCheckbox
                      checked={notifCampaigns}
                      onChange={setNotifCampaigns}
                      ariaLabel="Rapports de fin de campagne"
                    />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-medium text-gray-900">
                      Rapports de campagnes et rendez-vous confirmés
                    </p>
                    <p className="text-[12px] text-gray-500">
                      Recevez un récapitulatif lorsqu&apos;une campagne se termine ou qu&apos;un rendez-vous est pris.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <span className="mt-0.5 shrink-0">
                    <PremiumCheckbox
                      checked={notifWeeklySummary}
                      onChange={setNotifWeeklySummary}
                      ariaLabel="Synthèse hebdomadaire d'activité"
                    />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-medium text-gray-900">
                      Synthèse hebdomadaire d&apos;activité
                    </p>
                    <p className="text-[12px] text-gray-500">
                      Volume d&apos;appels, taux de réponse et consommation de minutes chaque lundi matin.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <span className="mt-0.5 shrink-0">
                    <PremiumCheckbox
                      checked={notifSecurityAlerts}
                      onChange={setNotifSecurityAlerts}
                      ariaLabel="Alertes de sécurité et connexions"
                    />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-medium text-gray-900">
                      Alertes de sécurité et nouvelles connexions
                    </p>
                    <p className="text-[12px] text-gray-500">
                      Notification immédiate en cas de connexion depuis un nouvel appareil.
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSave("Préférences de notifications enregistrées")}
                  className="h-10 rounded-xl bg-gray-900 px-4 text-[13.5px] font-semibold text-white hover:bg-gray-800 cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {/* 6. Sécurité */}
          {section === "security" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
                <h3 className="text-[16px] font-bold text-gray-900">
                  Sécurité du compte
                </h3>
                <p className="mt-1 text-[13px] text-gray-500">
                  Protégez l&apos;accès à votre espace et consultez nos mesures de sécurité techniques.
                </p>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900">
                        Authentification à deux facteurs (2FA)
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-gray-500">
                        Ajoute une vérification supplémentaire lors de chaque connexion.
                      </p>
                    </div>
                    <PremiumCheckbox
                      checked={twoFactorEnabled}
                      onChange={(checked) => {
                        setTwoFactorEnabled(checked);
                        notify(
                          checked
                            ? "Préférence 2FA activée dans la démonstration"
                            : "Préférence 2FA désactivée dans la démonstration"
                        );
                      }}
                      ariaLabel="Activer l'authentification à deux facteurs"
                    />
                  </div>

                  <Link
                    href="/security"
                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:bg-gray-50/60"
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900">
                        Politique de sécurité et hébergement
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-gray-500">
                        Chiffrement, contrôle d&apos;accès, journalisation et gestion des incidents.
                      </p>
                    </div>
                    <ChevronRightSvg />
                  </Link>

                  <Link
                    href="/subprocessors"
                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:bg-gray-50/60"
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900">
                        Liste des sous-traitants et prestataires
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-gray-500">
                        Infrastructure, téléphonie, modèles d&apos;IA et garanties de transfert.
                      </p>
                    </div>
                    <ChevronRightSvg />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 7. Confidentialité */}
          <div hidden={section !== "security"} className="mt-4"><SecuritySessions /></div>
          {section === "security" && (
            <div className="space-y-3">
              <div className="mb-4">
                <h3 className="text-[18px] font-bold text-gray-900">
                  {isEn ? "Privacy" : "Confidentialité"}
                </h3>
                <p className="mt-0.5 text-[13px] text-gray-500">
                  {isEn
                    ? "Manage data retention, recordings, legal documents, cookies, and account deletion."
                    : "Gérez la conservation de vos données, les enregistrements, vos documents juridiques et vos préférences."}
                </p>
              </div>

              <Link
                href="/data-retention"
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-2xs transition hover:border-gray-300 hover:bg-gray-50/50"
              >
                <div>
                  <p className="text-[14.5px] font-semibold text-gray-900">
                    Conservation des données
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-gray-500">
                    Durées de conservation des appels, transcriptions, contacts et journaux.
                  </p>
                </div>
                <ChevronRightSvg />
              </Link>

              <Link
                href="/call-recording"
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-2xs transition hover:border-gray-300 hover:bg-gray-50/50"
              >
                <div>
                  <p className="text-[14.5px] font-semibold text-gray-900">
                    Enregistrement des appels
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-gray-500">
                    Règles d&apos;information des appelés, accès aux fichiers audio et suppression.
                  </p>
                </div>
                <ChevronRightSvg />
              </Link>

              <Link
                href="/legal"
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-2xs transition hover:border-gray-300 hover:bg-gray-50/50"
              >
                <div>
                  <p className="text-[14.5px] font-semibold text-gray-900">
                    Documents juridiques
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-gray-500">
                    CGU, CGV, Politique de confidentialité, DPA, Politique IA et mentions légales.
                  </p>
                </div>
                <ChevronRightSvg />
              </Link>

              <button
                type="button"
                onClick={handleExportData}
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left shadow-2xs transition hover:border-gray-300 hover:bg-gray-50/50 cursor-pointer"
              >
                <div>
                  <p className="text-[14.5px] font-semibold text-gray-900">
                    Exporter mes données
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-gray-500">
                    Télécharger une copie structurée (JSON) des données associées à votre compte.
                  </p>
                </div>
                <ChevronRightSvg />
              </button>

              <Link
                href="/cookies"
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-2xs transition hover:border-gray-300 hover:bg-gray-50/50"
              >
                <div>
                  <p className="text-[14.5px] font-semibold text-gray-900">
                    Préférences de cookies
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-gray-500">
                    Consulter et gérer l&apos;utilisation des cookies et traceurs sur la plateforme.
                  </p>
                </div>
                <ChevronRightSvg />
              </Link>

              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left shadow-2xs transition hover:border-red-200 hover:bg-red-50/30 cursor-pointer"
              >
                <div>
                  <p className="text-[14.5px] font-semibold text-red-600">
                    Supprimer mon compte
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-gray-500">
                    Demander la clôture définitive de votre espace et la suppression de vos données.
                  </p>
                </div>
                <ChevronRightSvg />
              </button>
            </div>
          )}

          {/* 8. Assistance */}
          {section === "support" && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
                <h3 className="text-[16px] font-bold text-gray-900">
                  Assistance et engagements de service
                </h3>
                <p className="mt-1 text-[13px] text-gray-500">
                  Consultez nos engagements de disponibilité, nos conditions de résiliation ou contactez notre équipe.
                </p>

                <div className="mt-5 space-y-3">
                  <Link
                    href="/sla"
                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:bg-gray-50/60"
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900">
                        Accord de niveau de service (SLA)
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-gray-500">
                        Disponibilité cible, délais de réponse du support et maintenance planifiée.
                      </p>
                    </div>
                    <ChevronRightSvg />
                  </Link>

                  <Link
                    href="/refund-policy"
                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:bg-gray-50/60"
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900">
                        Politique de résiliation et remboursement
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-gray-500">
                        Modalités d&apos;annulation d&apos;abonnement, prise d&apos;effet et facturation.
                      </p>
                    </div>
                    <ChevronRightSvg />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal invitation membre */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
            <h3 className="text-[16px] font-bold text-gray-900">
              Inviter un collaborateur
            </h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[13px] font-medium text-gray-700">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="prenom@entreprise.fr"
                  className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3.5 text-[14px] outline-none focus:border-[#008F6D]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700">
                  Rôle
                </label>
                <PremiumSelect
                  value={inviteRole}
                  onChange={(v) => setInviteRole(v as "Commercial" | "Superviseur")}
                  ariaLabel="Rôle du collaborateur"
                  className="mt-1"
                  options={[
                    { value: "Commercial", label: "Commercial" },
                    { value: "Superviseur", label: "Superviseur" },
                  ]}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="h-9 rounded-xl border border-gray-200 px-3.5 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleInvite}
                className="h-9 rounded-xl bg-gray-900 px-4 text-[13.5px] font-semibold text-white hover:bg-gray-800 cursor-pointer"
              >
                Envoyer l&apos;invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression compte */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
            <h3 className="text-[16px] font-bold text-gray-900">
              Supprimer mon compte
            </h3>
            <p className="mt-1.5 text-[13px] text-gray-500">
              Cette action entraînera la résiliation de votre abonnement et la suppression de vos données conformément à notre{" "}
              <Link href="/data-retention" className="text-[#008F6D] underline">
                Politique de conservation des données
              </Link>
              .
            </p>
            <label className="mt-4 flex items-start gap-2.5 cursor-pointer">
              <span className="mt-0.5 shrink-0">
                <PremiumCheckbox
                  checked={deleteAck}
                  onChange={setDeleteAck}
                  ariaLabel="Je confirme vouloir demander la suppression définitive de mon compte"
                />
              </span>
              <span className="text-[12.5px] text-gray-700">
                Je confirme vouloir demander la suppression définitive de mon compte AutoCall.
              </span>
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteAck(false);
                }}
                className="h-9 rounded-xl border border-gray-200 px-3.5 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!deleteAck}
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteAck(false);
                  notify("Simulation de demande terminée. Aucune donnée supprimée.");
                }}
                className="h-9 rounded-xl bg-red-600 px-4 text-[13.5px] font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
