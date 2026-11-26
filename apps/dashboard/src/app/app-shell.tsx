"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LeadWorkspace } from "./acquisition/lead-workspace";
import { AgentsView } from "./agents-view";
import AskAI from "./ask-ai";
import { AskAutoCallPanel } from "./ask-autocall-panel";
import { AutomationsView } from "./automations-view";
import { CampaignsView } from "./campaigns-view";
import { ConversationsView } from "./conversations-view";
import { DashboardSearch } from "./dashboard-search";
import { CrmView } from "./crm-view";
import {
  initialNotifications,
  type NotificationEntry,
  NotificationPanel,
} from "./notification-panel";
import { OverviewView } from "./overview-view";
import { onboardingGoals as goalDefinitions, type OnboardingGoalId } from "./onboarding/goals";
import { SettingsView } from "./settings-view";
import { SupportView } from "./support-view";
import { SocialView } from "./social-view";
import {
  initialRecentItems,
  type Locale,
  managementItems,
  SolarIcon,
  UserAvatarSvg,
  WorkspaceNavigation,
  workspaceItems,
} from "./workspace-navigation";

const allNavItems = [
  ...workspaceItems,
  ...managementItems,
  ...initialRecentItems,
];
const quickAccess = {
  "recent-phone": { module: "settings", section: "telephony" },
  "recent-quote": { module: "automation", workflow: "wf-3" },
  "recent-report": { module: "overview", tab: "reports" },
  "recent-crm": { module: "settings", section: "integrations" },
  "new-run": { module: "automation", workflow: "new" },
  "settings-credits": { module: "settings", section: "credits" },
  "settings-billing": { module: "settings", section: "billing" },
} as const;

function knownView(id: unknown) {
  return typeof id === "string" && (Object.hasOwn(quickAccess, id) || allNavItems.some((item) => item.id === id))
    ? id
    : "overview";
}


const languages: { code: Locale; short: string; label: string }[] = [
  { code: "fr", short: "FR", label: "Français" },
  { code: "en", short: "EN", label: "English" },
  { code: "es", short: "ES", label: "Español" },
];

const headerCopy: Record<
  Locale,
  {
    searchPlaceholder: string;
    askAi: string;
    notifications: string;
  }
> = {
  fr: {
    searchPlaceholder: "Rechercher...",
    askAi: "Ask AutoCall",
    notifications: "Notifications",
  },
  en: {
    searchPlaceholder: "Search...",
    askAi: "Ask AutoCall",
    notifications: "Notifications",
  },
  es: {
    searchPlaceholder: "Buscar...",
    askAi: "Ask AutoCall",
    notifications: "Notificaciones",
  },
};

function FlagSvg({ locale }: { locale: Locale }) {
  const clipId = useId();

  if (locale === "fr") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-4 shrink-0 rounded-full ring-1 ring-black/10"
      >
        <clipPath id={clipId}>
          <circle cx="10" cy="10" r="10" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="6.7" height="20" fill="#1D4ED8" />
          <rect x="6.7" y="0" width="6.6" height="20" fill="#FFFFFF" />
          <rect x="13.3" y="0" width="6.7" height="20" fill="#DC2626" />
        </g>
      </svg>
    );
  }

  if (locale === "en") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-4 shrink-0 rounded-full ring-1 ring-black/10"
      >
        <clipPath id={clipId}>
          <circle cx="10" cy="10" r="10" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect width="20" height="20" fill="#1E3A8A" />
          <path d="M0 0L20 20M20 0L0 20" stroke="#FFFFFF" strokeWidth="3.6" />
          <path d="M0 0L20 20M20 0L0 20" stroke="#DC2626" strokeWidth="1.8" />
          <path d="M10 0V20M0 10H20" stroke="#FFFFFF" strokeWidth="5.2" />
          <path d="M10 0V20M0 10H20" stroke="#DC2626" strokeWidth="3" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-4 shrink-0 rounded-full ring-1 ring-black/10"
    >
      <clipPath id={clipId}>
        <circle cx="10" cy="10" r="10" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="20" height="5" fill="#DC2626" />
        <rect x="0" y="5" width="20" height="10" fill="#FACC15" />
        <rect x="0" y="15" width="20" height="5" fill="#DC2626" />
      </g>
    </svg>
  );
}

export function AppShell({ onboarding = false, onboardingGoals = [], initialView }: { onboarding?: boolean; onboardingGoals?: OnboardingGoalId[]; initialView?: string }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState(() => knownView(initialView));
  const [visitedViews, setVisitedViews] = useState(() => new Set([knownView(initialView)]));
  const shortcut = Object.hasOwn(quickAccess, activeId) ? quickAccess[activeId as keyof typeof quickAccess] : undefined;
  const pageId = shortcut?.module ?? activeId;
  const mobileModules = workspaceItems.filter((item) => ["overview", "crm", "conversations", "agents"].includes(item.id));
  const [tourIndex, setTourIndex] = useState<number | null>(null);
  const [workspaceSetup, setWorkspaceSetup] = useState<{ company?: string; timezone?: string }>({});
  const [campaignAudience, setCampaignAudience] = useState<string>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [darkAppearance, setDarkAppearance] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationEntry[]>(initialNotifications);
  const [locale, setLocale] = useState<Locale>("fr");
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLangOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
        setAskOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelectNav = (id: string) => {
    const view = knownView(id);
    const target = Object.hasOwn(quickAccess, view) ? quickAccess[view as keyof typeof quickAccess].module : view;
    if (target === "settings" && onboarding) {
      try {
        const setup = JSON.parse(window.sessionStorage.getItem("autocall-onboarding-workspace") ?? "{}");
        setWorkspaceSetup({ company: typeof setup.company === "string" ? setup.company : undefined, timezone: typeof setup.timezone === "string" ? setup.timezone : undefined });
      } catch {
        setWorkspaceSetup({});
      }
    }
    const url = new URL(window.location.href);
    if (view === "overview") url.searchParams.delete("view");
    else url.searchParams.set("view", view);
    if (window.location.href !== url.href) window.history.pushState(null, "", url);
    setActiveId(view);
    setVisitedViews((previous) => previous.has(view) ? previous : new Set([...previous, view]));
  };
  const prepareCampaignForContact = (name: string) => {
    setCampaignAudience(name);
    handleSelectNav("campaigns");
  };

  useEffect(() => {
    const restoreView = () => {
      const view = knownView(new URL(window.location.href).searchParams.get("view"));
      setActiveId(view);
      setVisitedViews((previous) => previous.has(view) ? previous : new Set([...previous, view]));
    };
    window.addEventListener("popstate", restoreView);
    return () => window.removeEventListener("popstate", restoreView);
  }, []);
  const tourSteps = [
    { title: "Votre checklist", description: "La Vue d’ensemble rassemble vos premières actions et leur progression.", module: "overview" },
    ...goalDefinitions.filter((goal) => onboardingGoals.includes(goal.id)).map((goal) => ({ title: goal.action, description: goal.description, module: goal.module })),
    { title: "Centre d’aide", description: "Recherchez un guide ou ouvrez un ticket de démonstration.", module: "help" },
  ];
  const tourStep = tourIndex === null ? undefined : tourSteps[tourIndex];
  const nextTourStep = () => {
    const next = (tourIndex ?? -1) + 1;
    if (next >= tourSteps.length) {
      setTourIndex(null);
      handleSelectNav("overview");
      return;
    }
    setTourIndex(next);
    handleSelectNav(tourSteps[next].module);
  };

  const activeItem =
    allNavItems.find((item) => item.id === activeId) ?? allNavItems.find((item) => item.id === pageId) ?? workspaceItems[0];
  const currentLang =
    languages.find((l) => l.code === locale) ?? languages[0];
  const t = headerCopy[locale];

  return (
    <div data-dashboard-theme={darkAppearance ? "dark" : undefined} className="flex min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <WorkspaceNavigation
        activeId={activeId}
        onSelectNav={handleSelectNav}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        locale={locale}
        darkAppearance={darkAppearance}
        onToggleAppearance={() => setDarkAppearance((current) => !current)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barre supérieure */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--topbar)] px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir la navigation"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#171717] transition-colors hover:bg-[#F4F4F5] md:hidden cursor-pointer"
            >
              <SolarIcon name="menu" className="size-4" />
            </button>
            <SolarIcon
              name={activeItem.icon}
              className="size-[18px] shrink-0 text-[#525252]"
            />
            <h1 className="truncate text-[14px] font-medium tracking-[-0.01em] text-[#171717]">
              {activeItem.labels[locale]}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Recherche */}
            <DashboardSearch label={t.searchPlaceholder} empty={locale === "en" ? "No modules or shortcuts found." : locale === "es" ? "No se encontraron resultados." : "Aucun module ou raccourci trouvé."} items={allNavItems.map((item) => ({ id: item.id, icon: item.icon, label: item.labels[locale] }))} onSelect={handleSelectNav} />
            <button type="button" aria-expanded={askOpen} aria-label={t.askAi} onClick={() => setAskOpen(!askOpen)} className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-sm font-medium">
              <SolarIcon name="sparkle" className="size-4 text-[#00775B]" /><span className="hidden lg:inline">{t.askAi}</span>
            </button>

            {/* Sélecteur de langue FR / EN / ES avec drapeaux SVG */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={langOpen}
                aria-label="Langue de l’interface"
                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#E5E5E5] bg-white px-2.5 text-[13.5px] font-medium text-[#171717] transition-colors hover:bg-[#F7F7F8] focus-visible:outline-2 focus-visible:outline-[#00775B] cursor-pointer"
              >
                <FlagSvg locale={currentLang.code} />
                <span>{currentLang.short}</span>
                <SolarIcon
                  name="chevronDown"
                  className={`size-3 text-[#737373] transition-transform duration-150 ${langOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {langOpen && (
                <div
                  role="menu"
                  aria-label="Choisir la langue"
                  className="absolute right-0 z-30 mt-1.5 w-40 rounded-xl border border-[#E5E5E5] bg-white p-1 shadow-lg"
                >
                  {languages.map((lang) => {
                    const selected = lang.code === locale;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        role="menuitemradio"
                        aria-checked={selected}
                        onClick={() => {
                          setLocale(lang.code);
                          setLangOpen(false);
                        }}
                        className={`flex h-8 w-full items-center justify-between rounded-lg px-2.5 text-[13.5px] transition-colors cursor-pointer ${selected
                            ? "bg-[#F3F4F6] font-medium text-[#171717]"
                            : "text-[#525252] hover:bg-[#F7F7F8] hover:text-[#171717]"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <FlagSvg locale={lang.code} />
                          <span>{lang.label}</span>
                        </span>
                        <span className="text-[12px] text-[#8C8C8C]">
                          {lang.short}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-label={t.notifications}
                aria-expanded={notifOpen}
                className="relative inline-flex size-9 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] cursor-pointer"
              >
                <SolarIcon name="bell" className="size-4.5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-[var(--topbar)] bg-[var(--danger)] px-1 text-[11.5px] font-semibold leading-none text-white tabular-nums">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <NotificationPanel
                  locale={locale}
                  onClose={() => setNotifOpen(false)}
                  items={notifications}
                  onMarkAllRead={() =>
                    setNotifications((prev) =>
                      prev.map((item) => ({ ...item, read: true })),
                    )
                  }
                  onMarkOneRead={(id) =>
                    setNotifications((prev) =>
                      prev.map((item) =>
                        item.id === id ? { ...item, read: true } : item,
                      ),
                    )
                  }
                />
              )}
            </div>

            {/* Profil utilisateur (haut droite à côté des notifications) */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((prev) => !prev);
                  setNotifOpen(false);
                  setLangOpen(false);
                }}
                aria-label="Profil utilisateur"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5 transition hover:border-[#A3A3A3] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] cursor-pointer"
              >
                <UserAvatarSvg className="size-full" />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  aria-label="Menu utilisateur"
                  className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-[#E5E5E5] bg-white p-1.5 shadow-lg"
                >
                  <div className="border-b border-[#F0F0F0] px-2.5 py-2">
                    <p className="truncate text-[14px] font-semibold text-[#171717]">
                      Tanjim Islam
                    </p>
                    <p className="truncate text-[12.5px] text-[#737373]">
                      tanjim@gr8rstudio.com
                    </p>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setProfileOpen(false);
                        handleSelectNav("settings");
                      }}
                      className="flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-[13.5px] text-[#171717] transition-colors hover:bg-[#F4F4F5] cursor-pointer"
                    >
                      <SolarIcon name="settings" className="size-4 text-[#525252]" />
                      <span>
                        {locale === "fr"
                          ? "Paramètres"
                          : locale === "es"
                            ? "Configuración"
                            : "Settings"}
                      </span>
                    </button>
                    <Link href="/landing" className="flex h-8 items-center gap-2 rounded-lg px-2.5 text-[13.5px] hover:bg-[#F4F4F5]">{locale === "fr" ? "Site public" : locale === "es" ? "Sitio público" : "Public website"}</Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setProfileOpen(false);
                        handleSelectNav("help");
                      }}
                      className="flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-[13.5px] text-[#171717] transition-colors hover:bg-[#F4F4F5] cursor-pointer"
                    >
                      <SolarIcon name="help" className="size-4 text-[#525252]" />
                      <span>
                        {locale === "fr"
                          ? "Aide & support"
                          : locale === "es"
                            ? "Ayuda y soporte"
                            : "Help & support"}
                      </span>
                    </button>
                    <div className="my-1 h-px bg-[#F0F0F0]" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/login");
                      }}
                      className="flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-[13.5px] text-[#B91C1C] transition-colors hover:bg-[#FEF2F2] cursor-pointer"
                    >
                      <SolarIcon name="logout" className="size-4" />
                      <span>
                        {locale === "fr"
                          ? "Déconnexion"
                          : locale === "es"
                            ? "Cerrar sesión"
                            : "Log out"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Zone de contenu principale */}
        <main className="min-w-0 flex-1 bg-[var(--background)] pb-[calc(3.75rem_+_env(safe-area-inset-bottom))] md:pb-0">
          {tourStep && (
            <section aria-label="Visite guidée" className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#B8E6D6] bg-[#EEF8F3] p-4 sm:mx-7">
              <div role="status">
                <p className="text-xs font-medium text-[#00775B]">Visite guidée · {(tourIndex ?? 0) + 1} sur {tourSteps.length}</p>
                <h2 className="mt-1 text-sm font-semibold">{tourStep.title}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{tourStep.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setTourIndex(null)} className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm">Quitter la visite</button>
                <button type="button" onClick={nextTourStep} className="rounded-lg bg-[#00775B] px-3 py-2 text-sm font-semibold text-white">{tourIndex === tourSteps.length - 1 ? "Terminer" : "Suivant"}</button>
              </div>
            </section>
          )}
          {onboarding && <div hidden={activeId !== "overview"}>
            <OverviewView locale={locale} onNavigate={handleSelectNav} onboardingGoals={onboardingGoals} onStartTour={nextTourStep} />
          </div>}
          {visitedViews.has("acquisition") && <div hidden={pageId !== "acquisition"}><LeadWorkspace locale={locale} /></div>}
          {visitedViews.has("crm") && <div hidden={activeId !== "crm"}><CrmView locale={locale} onPrepareCampaign={prepareCampaignForContact} /></div>}
          {visitedViews.has("conversations") && <div hidden={activeId !== "conversations"}><ConversationsView locale={locale} onOpenCrm={() => handleSelectNav("crm")} /></div>}
          {activeId === "overview" ? (
            onboarding ? null : <OverviewView locale={locale} onNavigate={handleSelectNav} />
          ) : pageId === "overview" ? (
            <OverviewView locale={locale} onNavigate={handleSelectNav} onboardingGoals={onboarding ? onboardingGoals : undefined} initialTab="reports" onStartTour={nextTourStep} />
          ) : pageId === "acquisition" || activeId === "crm" || activeId === "conversations" ? (
            null
          ) : activeId === "agents" ? (
            <AgentsView locale={locale} />
          ) : activeId === "campaigns" ? (
            <CampaignsView locale={locale} initialAudience={campaignAudience} onConsumeAudience={() => setCampaignAudience(undefined)} />
          ) : activeId === "social" ? (
            <SocialView locale={locale} />
          ) : pageId === "automation" ? (
            <AutomationsView key={activeId} locale={locale} initialWorkflow={shortcut && "workflow" in shortcut ? shortcut.workflow : undefined} />
          ) : pageId === "settings" ? (
            <SettingsView key={activeId} locale={locale} initialCompany={workspaceSetup.company} initialTimezone={workspaceSetup.timezone} initialSection={shortcut && "section" in shortcut ? shortcut.section : undefined} />
          ) : activeId === "help" ? (
            null
          ) : (
            <div className="w-full p-6" />
          )}
          <div hidden={activeId !== "help"}>
            <SupportView locale={locale} onNavigate={handleSelectNav} />
          </div>
        </main>
      </div>
      <nav aria-label={locale === "en" ? "Mobile navigation" : locale === "es" ? "Navegación móvil" : "Navigation mobile"} className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-[var(--border)] bg-[var(--surface)] px-1 pb-[env(safe-area-inset-bottom)] md:hidden">
        {mobileModules.map((item) => (
          <button type="button" key={item.id} aria-current={pageId === item.id ? "page" : undefined} onClick={() => handleSelectNav(item.id)} className="flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-xs text-[var(--text-secondary)] aria-[current=page]:font-semibold aria-[current=page]:text-[var(--brand-text)]">
            <SolarIcon name={item.icon} active={pageId === item.id} className="size-5" />
            <span className="max-w-full truncate">{item.id === "overview" ? (locale === "en" ? "Home" : locale === "es" ? "Inicio" : "Accueil") : item.id === "conversations" ? "Messages" : item.labels[locale]}</span>
          </button>
        ))}
        <button type="button" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs text-[var(--text-secondary)]"><SolarIcon name="menu" className="size-5" />{locale === "en" ? "More" : locale === "es" ? "Más" : "Plus"}</button>
      </nav>

      {/* Widget flottant Ask AI en bas à droite */}
      <div className="max-md:[&_.autocall-ask-ai]:!bottom-[calc(4.5rem_+_env(safe-area-inset-bottom))]">
        <AskAI />
      </div>
      {askOpen && <AskAutoCallPanel locale={locale} contextLabel={activeItem.labels[locale]} onClose={() => setAskOpen(false)} />}
    </div>
  );
}
