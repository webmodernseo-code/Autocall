"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import solar from "@iconify-json/solar/icons.json";

export type Locale = "fr" | "en" | "es";

const icons = {
  overview: "widget-2-linear",
  acquisition: "target-linear",
  crm: "users-group-rounded-linear",
  conversations: "chat-round-dots-linear",
  agents: "headphones-round-linear",
  campaigns: "plain-linear",
  social: "share-linear",
  automation: "bolt-linear",
  settings: "settings-linear",
  help: "question-circle-linear",
  appearance: "monitor-linear",
  sun: "sun-2-linear",
  moon: "moon-linear",
  phone: "phone-calling-linear",
  mail: "letter-linear",
  chart: "chart-2-linear",
  bolt: "bolt-linear",
  chevronDown: "alt-arrow-down-linear",
  card: "card-linear",
  logout: "logout-2-linear",
  menu: "hamburger-menu-linear",
  close: "close-circle-linear",
  star: "star-linear",
  starFilled: "star-bold",
  search: "magnifier-linear",
  bell: "bell-linear",
  sparkle: "stars-minimalistic-linear",
  globe: "global-linear",
} satisfies Record<string, keyof typeof solar.icons>;

export type NavIconName = keyof typeof icons;

export interface NavItem {
  id: string;
  labels: Record<Locale, string>;
  icon: NavIconName;
  badge?: string;
  badgeTone?: "blue" | "green";
}

export interface RecentItem {
  id: string;
  labels: Record<Locale, string>;
  icon: NavIconName;
  tintBg: string;
  tintFg: string;
}

export const workspaceItems: NavItem[] = [
  {
    id: "overview",
    labels: { fr: "Dashboard", en: "Dashboard", es: "Dashboard" },
    icon: "overview",
  },
  {
    id: "acquisition",
    labels: {
      fr: "Acquisition client",
      en: "Lead Acquisition",
      es: "Captación",
    },
    icon: "acquisition",
    badge: "28",
    badgeTone: "blue",
  },
  {
    id: "crm",
    labels: { fr: "CRM", en: "CRM", es: "CRM" },
    icon: "crm",
    badge: "35+",
    badgeTone: "green",
  },
  {
    id: "conversations",
    labels: { fr: "Conversations", en: "Conversations", es: "Conversaciones" },
    icon: "conversations",
  },
  {
    id: "agents",
    labels: { fr: "Agents IA", en: "AI Agents", es: "Agentes IA" },
    icon: "agents",
  },
  {
    id: "campaigns",
    labels: { fr: "Campagnes", en: "Campaigns", es: "Campañas" },
    icon: "campaigns",
  },
  {
    id: "social",
    labels: { fr: "Réseaux sociaux", en: "Social Media", es: "Redes sociales" },
    icon: "social",
  },
  {
    id: "automation",
    labels: {
      fr: "Automatisations",
      en: "Automations",
      es: "Automatizaciones",
    },
    icon: "automation",
  },
];

export const managementItems: NavItem[] = [
  {
    id: "settings",
    labels: { fr: "Paramètres", en: "Settings", es: "Configuración" },
    icon: "settings",
  },
  {
    id: "help",
    labels: { fr: "Aide & support", en: "Help & Support", es: "Ayuda y soporte" },
    icon: "help",
  },
];

export const initialRecentItems: RecentItem[] = [
  {
    id: "recent-phone",
    labels: {
      fr: "Accueil téléphonique",
      en: "Inbound Reception",
      es: "Recepción telefónica",
    },
    icon: "phone",
    tintBg: "#FCE7EB",
    tintFg: "#CE5C70",
  },
  {
    id: "recent-quote",
    labels: {
      fr: "Relance de devis",
      en: "Quote Follow-up",
      es: "Seguimiento de presupuestos",
    },
    icon: "automation",
    tintBg: "#FFF0D6",
    tintFg: "#B7791F",
  },
  {
    id: "recent-report",
    labels: {
      fr: "Rapport hebdomadaire",
      en: "Weekly Report",
      es: "Informe semanal",
    },
    icon: "chart",
    tintBg: "#DFF4F8",
    tintFg: "#25859A",
  },
  {
    id: "recent-crm",
    labels: {
      fr: "Synchronisation CRM",
      en: "CRM Sync",
      es: "Sincronización CRM",
    },
    icon: "mail",
    tintBg: "#FFEDE0",
    tintFg: "#C25E28",
  },
];

const copy: Record<
  Locale,
  {
    workspace: string;
    management: string;
    recent: string;
    appearance: string;
    upgradeSubtitle: string;
    upgradeCta: string;
    upgradeReady: string;
    settings: string;
    billing: string;
    logout: string;
  }
> = {
  fr: {
    workspace: "Espace de travail",
    management: "Gestion & support",
    recent: "Récents",
    appearance: "Apparence",
    upgradeSubtitle: "Passez à l’illimité",
    upgradeCta: "Mettre à niveau",
    upgradeReady: "Offre Pro prête",
    settings: "Paramètres",
    billing: "Abonnement",
    logout: "Déconnexion",
  },
  en: {
    workspace: "Workspaces",
    management: "Management",
    recent: "Recent",
    appearance: "Appearance",
    upgradeSubtitle: "Upgrade for unlimited use",
    upgradeCta: "Upgrade",
    upgradeReady: "Pro plan ready",
    settings: "Settings",
    billing: "Billing",
    logout: "Log out",
  },
  es: {
    workspace: "Espacio de trabajo",
    management: "Gestión y soporte",
    recent: "Recientes",
    appearance: "Apariencia",
    upgradeSubtitle: "Pasa a uso ilimitado",
    upgradeCta: "Mejorar plan",
    upgradeReady: "Plan Pro listo",
    settings: "Configuración",
    billing: "Suscripción",
    logout: "Cerrar sesión",
  },
};

export function SolarIcon({
  name,
  active = false,
  className = "size-[18px] shrink-0",
}: {
  name: NavIconName;
  active?: boolean;
  className?: string;
}) {
  const iconName = icons[name];
  const iconSet: Partial<Record<string, { body: string }>> = solar.icons;
  const boldName = iconName.replace(/-linear$/, "-bold");
  const icon = active
    ? (iconSet[boldName] ?? iconSet[iconName])
    : (iconSet[iconName] ?? iconSet[iconName.replace(/-linear$/, "-bold-duotone")]);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={className}
      dangerouslySetInnerHTML={{
        __html:
          icon?.body ??
          '<circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>',
      }}
    />
  );
}

function SidebarToggleSvg({ className = "size-[17px]" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M9 4v16" />
    </svg>
  );
}

function BrandMark() {
  return (
    <span className="inline-flex size-6.5 shrink-0 items-center justify-center text-[#171717]">
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="size-6"
        fill="currentColor"
      >
        <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
      </svg>
    </span>
  );
}

export function UserAvatarSvg({ className = "size-8" }: { className?: string }) {
  return (
    <Image
      src="/avatars/agents/agent-11.jpg"
      alt="Tanjim Islam"
      width={40}
      height={40}
      className={`shrink-0 rounded-full border border-[#E5E5E5] bg-[#E6F5F0] object-cover object-top ${className}`}
    />
  );
}

export function WorkspaceNavigation({
  activeId: controlledActiveId,
  onSelectNav,
  mobileOpen: controlledMobileOpen,
  onMobileOpenChange,
  locale = "fr",
  darkAppearance = false,
  onToggleAppearance,
}: {
  activeId?: string;
  onSelectNav?: (id: string) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  locale?: Locale;
  darkAppearance?: boolean;
  onToggleAppearance?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const [internalActiveId, setInternalActiveId] = useState("overview");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const activeId = controlledActiveId ?? internalActiveId;
  const mobileOpen = controlledMobileOpen ?? internalMobileOpen;
  const setMobileOpen = onMobileOpenChange ?? setInternalMobileOpen;
  const t = copy[locale];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        setCollapsed((prev) => !prev);
      }
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setMobileOpen]);

  const handleSelectNav = (id: string) => {
    if (onSelectNav) {
      onSelectNav(id);
    } else {
      setInternalActiveId(id);
    }
    setMobileOpen(false);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sidebarContent = (isMobileDrawer: boolean) => {
    const isCollapsed = isMobileDrawer ? false : collapsed;

    return (
      <div className="flex h-full flex-col bg-[var(--sidebar)] font-sans select-none">
        {/* En-tête */}
        <div
          className={`flex h-14 shrink-0 items-center border-b border-[var(--border)] px-3 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => handleSelectNav("overview")}
              className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-left transition-colors hover:bg-[#F7F7F8] focus-visible:outline-2 focus-visible:outline-[#00775B] cursor-pointer"
            >
              <BrandMark />
              <span className="text-[15px] font-semibold tracking-[-0.03em] text-[#171717]">
                AutoCall
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              isMobileDrawer
                ? setMobileOpen(false)
                : setCollapsed((prev) => !prev)
            }
            aria-label={
              isMobileDrawer
                ? "Fermer la navigation"
                : isCollapsed
                  ? "Ouvrir la barre latérale"
                  : "Réduire la barre latérale"
            }
            aria-expanded={isMobileDrawer ? mobileOpen : !isCollapsed}
            title={
              isMobileDrawer
                ? "Fermer"
                : isCollapsed
                  ? "Ouvrir (Ctrl+B)"
                  : "Réduire (Ctrl+B)"
            }
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-[#737373] transition-colors hover:bg-[#F4F4F5] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-[#00775B] cursor-pointer"
          >
            {isMobileDrawer ? (
              <SolarIcon name="close" className="size-[17px]" />
            ) : (
              <SidebarToggleSvg className="size-[17px]" />
            )}
          </button>
        </div>

        {/* Navigation scrollable */}
        <nav
          aria-label="Navigation principale"
          className="flex-1 overflow-y-auto px-2.5 pt-1 pb-3"
        >
          {/* Section 1 : Espace de travail */}
          <section aria-labelledby="workspace-heading">
            {!isCollapsed && (
              <div className="mb-1 flex items-center px-2.5 py-1 text-[12px] font-medium text-[#737373]">
                <h2 id="workspace-heading">{t.workspace}</h2>
              </div>
            )}
            <ul className="space-y-0.5">
              {workspaceItems.map((item) => {
                const isActive = activeId === item.id;
                const label = item.labels[locale];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectNav(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      title={label}
                      className={`flex w-full items-center rounded-[8px] text-[14px] leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-[#00775B] cursor-pointer ${
                        isCollapsed
                          ? "h-9 justify-center px-0"
                          : "h-9 justify-between px-2.5"
                      } ${
                        isActive
                          ? "bg-[#EFEFEF] font-medium text-[#171717]"
                          : "font-normal text-[#525252] hover:bg-[#F7F7F8] hover:text-[#171717]"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <SolarIcon
                          name={item.icon}
                          active={isActive}
                          className={`size-[18px] shrink-0 ${
                            isActive
                              ? "text-[#171717] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.95))_drop-shadow(0_2px_2.5px_rgba(23,23,23,0.28))]"
                              : "text-[#666666] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.9))_drop-shadow(0_1.5px_1.5px_rgba(23,23,23,0.16))]"
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{label}</span>
                        )}
                      </span>
                      {!isCollapsed && item.badge && (
                        <span
                          className={`ml-2 inline-flex h-5 items-center rounded-md px-1.5 text-[12px] font-medium tabular-nums ${
                            item.badgeTone === "green"
                              ? "bg-[#E6F5F0] text-[#00775B]"
                              : "bg-[#EFEFEF] text-[#525252]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Section 2 : Gestion & support */}
          <section aria-labelledby="management-heading" className="mt-4">
            {!isCollapsed ? (
              <div className="mb-1 flex items-center px-2.5 py-1 text-[12px] font-medium text-[#737373]">
                <h2 id="management-heading">{t.management}</h2>
              </div>
            ) : (
              <div className="mx-auto my-2 h-px w-6 bg-[#EFEFEF]" />
            )}
            <ul className="space-y-0.5">
              {managementItems.map((item) => {
                const isActive = activeId === item.id;
                const label = item.labels[locale];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectNav(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      title={isCollapsed ? label : undefined}
                      className={`flex w-full items-center rounded-[8px] text-[14px] leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-[#00775B] cursor-pointer ${
                        isCollapsed
                          ? "h-8.5 justify-center px-0"
                          : "h-8.5 gap-2.5 px-2.5"
                      } ${
                        isActive
                          ? "bg-[#EFEFEF] font-medium text-[#171717]"
                          : "font-normal text-[#525252] hover:bg-[#F7F7F8] hover:text-[#171717]"
                      }`}
                    >
                      <SolarIcon
                        name={item.icon}
                        active={isActive}
                        className={`size-[18px] shrink-0 ${
                          isActive
                            ? "text-[#171717] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.95))_drop-shadow(0_2px_2.5px_rgba(23,23,23,0.28))]"
                            : "text-[#666666] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.9))_drop-shadow(0_1.5px_1.5px_rgba(23,23,23,0.16))]"
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="truncate">{label}</span>
                      )}
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={onToggleAppearance}
                  aria-pressed={darkAppearance}
                  aria-label={t.appearance}
                  disabled={!onToggleAppearance}
                  title={isCollapsed ? t.appearance : undefined}
                  className={`flex w-full items-center rounded-[8px] text-[14px] leading-5 text-[#525252] transition-colors hover:bg-[#F7F7F8] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-[#00775B] cursor-pointer ${
                    isCollapsed
                      ? "h-8.5 justify-center px-0"
                      : "h-8.5 justify-between px-2.5"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <SolarIcon
                      name="appearance"
                      className="size-[18px] shrink-0 text-[#666666] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.9))_drop-shadow(0_1.5px_1.5px_rgba(23,23,23,0.16))]"
                    />
                    {!isCollapsed && (
                      <span className="truncate">{t.appearance}</span>
                    )}
                  </span>
                  {!isCollapsed && (
                    <SolarIcon
                      name={darkAppearance ? "moon" : "sun"}
                      className="size-4 shrink-0 text-[#737373]"
                    />
                  )}
                </button>
              </li>
            </ul>
          </section>

          {/* Section 3 : Récents */}
          <section aria-labelledby="recent-heading" className="mt-5">
            {!isCollapsed ? (
              <div className="mb-1 flex items-center justify-between px-2.5 py-1">
                <div className="flex items-center text-[12px] font-medium text-[#737373]">
                  <h2 id="recent-heading">{t.recent}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectNav("new-run")}
                  aria-label="Nouvel accès rapide"
                  className="inline-flex size-5 items-center justify-center rounded border border-[#E5E5E5] bg-white text-[#737373] transition-colors hover:bg-[#F4F4F5] hover:text-[#171717] cursor-pointer"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="size-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  >
                    <path d="M8 3.5v9M3.5 8h9" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="mx-auto my-2 h-px w-6 bg-[#EFEFEF]" />
            )}
            <ul className="space-y-0.5">
              {initialRecentItems.map((item) => {
                const isActive = activeId === item.id;
                const isFav = Boolean(favorites[item.id]);
                const label = item.labels[locale];
                return (
                  <li key={item.id} className="group flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSelectNav(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      title={label}
                      className={`flex min-w-0 flex-1 items-center rounded-lg text-[14px] leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-[#00775B] cursor-pointer ${
                        isCollapsed
                          ? "h-8.5 justify-center px-0"
                          : "h-8.5 gap-2 px-2.5"
                      } ${
                        isActive
                          ? "bg-[#F3F4F6] font-medium text-[#171717]"
                          : "font-normal text-[#525252] hover:bg-[#F7F7F8] hover:text-[#171717]"
                      }`}
                    >
                      <span
                        className="inline-flex size-4.5 shrink-0 items-center justify-center rounded-[5px]"
                        style={{
                          backgroundColor: item.tintBg,
                          color: item.tintFg,
                        }}
                      >
                        <SolarIcon name={item.icon} className="size-3" />
                      </span>
                      {!isCollapsed && (
                        <span className="truncate">{label}</span>
                      )}
                    </button>
                    {!isCollapsed && (
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.id)}
                        aria-label={label}
                        aria-pressed={isFav}
                        className={`inline-flex size-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-[#F4F4F5] cursor-pointer ${
                          isFav
                            ? "text-[#D97706]"
                            : "text-[#A3A3A3] hover:text-[#525252]"
                        }`}
                      >
                        <SolarIcon
                          name={isFav ? "starFilled" : "star"}
                          className="size-3.5"
                        />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </nav>

        {/* Pied de barre latérale : crédits + profil */}
        <div className="mt-auto shrink-0 px-2.5 pt-2 pb-2.5">
          {!isCollapsed ? (
            <div className="rounded-[12px] border border-[#E5E5E5] bg-white p-3">
              <div className="flex items-center justify-between text-[13.5px] font-semibold tracking-[-0.01em] text-[#171717] tabular-nums">
                <span className="flex items-center gap-1.5">
                  <SolarIcon
                    name="bolt"
                    className="size-4 shrink-0 text-[#008F6D]"
                  />
                  <button type="button" className="text-left hover:underline" onClick={() => handleSelectNav("settings-credits")}>{locale === "fr" ? "Crédits et usages" : locale === "es" ? "Créditos y uso" : "Credits and usage"}</button>
                </span>
              </div>
              <p className="mt-0.5 text-[12px] leading-4 text-[#737373]">
                {locale === "fr" ? "Consultez vos ressources par service." : locale === "es" ? "Consulta los recursos por servicio." : "View resources by service."}
              </p>
              <button
                type="button"
                onClick={() => handleSelectNav("settings-billing")}
                className="mt-2.5 flex h-[36px] w-full items-center justify-center rounded-[8px] bg-[#008F6D] text-[13px] font-medium text-white transition-colors hover:bg-[#00775B] focus-visible:outline-2 focus-visible:outline-[#00775B] cursor-pointer"
              >
                {t.upgradeCta}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleSelectNav("settings-credits")}
              title={locale === "fr" ? "Crédits et usages" : locale === "es" ? "Créditos y uso" : "Credits and usage"}
              aria-label={locale === "fr" ? "Crédits et usages" : locale === "es" ? "Créditos y uso" : "Credits and usage"}
              className="mx-auto flex size-9 items-center justify-center rounded-[8px] bg-[#008F6D] text-white transition-colors hover:bg-[#00775B] focus-visible:outline-2 focus-visible:outline-[#00775B] cursor-pointer"
            >
              <SolarIcon name="bolt" className="size-[17px]" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Tiroir mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-[#171717]/30 backdrop-blur-[1px]"
          />
          <aside
            aria-label="Zone de navigation"
            className="relative z-10 h-dvh w-[240px] border-r border-[#E5E5E5] bg-white shadow-xl"
          >
            {sidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Barre latérale desktop */}
      <aside
        aria-label="Zone de navigation"
        className={`sticky top-0 hidden h-dvh shrink-0 overflow-hidden border-r border-[var(--border)] bg-[var(--sidebar)] transition-[width] duration-200 ease-out md:block ${
          collapsed ? "w-[68px]" : "w-[240px]"
        }`}
      >
        {sidebarContent(false)}
      </aside>
    </>
  );
}
