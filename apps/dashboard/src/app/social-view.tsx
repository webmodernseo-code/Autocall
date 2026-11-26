"use client";

import { useMemo, useState } from "react";
import { FacebookBrandSvg, InstagramBrandSvg } from "./brand-icons";
import { downloadCsv } from "./download-csv";
import { PremiumSelect } from "./premium-select";
import type { Locale } from "./workspace-navigation";

type SocialTab = "overview" | "create" | "calendar" | "posts" | "accounts" | "media";
type PlatformId = "linkedin" | "instagram" | "facebook" | "tiktok";
type PostStatus = "ready" | "review" | "scheduled" | "published" | "draft";
type ToneId = "commercial" | "rse" | "informative";
type PublishMode = "now" | "schedule" | "draft";

interface SocialPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  platforms: ("linkedin" | "instagram" | "facebook")[];
  status: PostStatus;
  dateLabel: string;
  dayOfMonth: number;
  time: string;
  mediaName: string;
  mediaKind: "office" | "team" | "audit";
  variants?: Partial<Record<SocialPost["platforms"][number], string>>;
  scheduleDate?: string;
  timezone?: string;
  impressions?: string;
  engagement?: string;
}

interface SocialAccount {
  id: PlatformId;
  name: string;
  handle: string;
  typeLabel: string;
  connected: boolean;
  followers: string;
  lastSync: string;
  autoSync: boolean;
}

function getPostDate(post: SocialPost) {
  if (post.status === "draft") return undefined;
  return post.scheduleDate ?? (INITIAL_POSTS.some((item) => item.id === post.id)
    ? "2025-03-" + String(post.dayOfMonth).padStart(2, "0")
    : undefined);
}

const COPY = {
  fr: {
    breadcrumbRoot: "Réseaux sociaux",
    tabs: {
      overview: "Vue d’ensemble",
      create: "Créer une publication",
      calendar: "Calendrier",
      posts: "Publications",
      accounts: "Comptes connectés",
    },
    title: "Réseaux sociaux",
    subtitle:
      "Créez, programmez et gérez toutes vos publications au même endroit avec distribution assistée par IA.",
    brandProfileBtn: "Profil de communication",
    newPostBtn: "+ Nouvelle publication",
    engineActive: "Moteur de publication actif",
    syncAuto: "synchro auto",
    periodOptions: [
      { value: "mar-2025", label: "Ce mois-ci : Mars 2025" },
      { value: "30d", label: "30 derniers jours" },
      { value: "q1-2025", label: "Trimestre en cours" },
    ],
    kpiPublished: "Publications publiées",
    kpiPublishedSub: "vs. mois dernier (21)",
    kpiPublishedRight: "92 % taux succès",
    kpiScheduled: "Publications programmées",
    kpiScheduledBadge: "Prochaine dans 2 h",
    kpiScheduledSub: "Flux validé jusqu’au 31 mars",
    kpiScheduledRight: "3 réseaux",
    kpiDrafts: "Brouillons en attente",
    kpiDraftsBadge: "À finaliser",
    kpiDraftsSub: "2 générés par IA",
    kpiDraftsAction: "Revoir",
    kpiEngagement: "Engagement total",
    kpiEngagementSub: "Interactions cumulées",
    upcomingTitle: "Publications à venir",
    readyCount: "3 prêtes",
    viewAllStream: "Voir tout le flux",
    aiBannerTitle: "Générateur intelligent AutoCall IA",
    aiBannerDesc:
      "Besoin d’inspiration ? L’IA AutoCall peut vous suggérer 5 publications stratégiques alignées avec votre secteur et vos offres B2B.",
    aiBannerBtn: "Générer avec l’IA",
    reachTitle: "Portée hebdomadaire consolidée",
    reachSub: "Évolution des impressions organiques et sponsorisées",
    reachPeriod: "Mars 2025",
    calendarTitle: "Mars 2025",
    legendScheduled: "Programmé",
    legendToday: "Aujourd’hui",
    accountsTitle: "Comptes connectés",
    manageAccounts: "Gérer",
    connected: "Connecté",
    notConfigured: "Non configuré",
    connect: "Connecter",
    disconnect: "Déconnecter",
    quickActions: "Actions rapides",
    qaCreate: "Créer une publication",
    qaGenerate: "Générer du contenu avec l’IA",
    qaCalendar: "Ouvrir le calendrier",
    qaConnect: "Connecter un compte",
    createTitle: "Créer une publication",
    createSubtitle:
      "Rédigez manuellement ou laissez l’IA composer et calibrer vos messages pour chaque canal.",
    cancel: "Annuler",
    saveDraft: "Enregistrer comme brouillon",
    framingBadge: "Cadrage : Propreté & Facility B2B",
    targetPlatforms: "Plateformes cibles",
    activeChannels: "canaux actifs",
    videoRequired: "Format vidéo",
    aiWriterTitle: "Assistant rédactionnel AutoCall",
    aiWriterBadge: "IA Propreté B2B",
    aiPromptLabel: "Idée, objectif ou thématique de campagne :",
    toneLabel: "Tonalité :",
    tones: {
      commercial: "Commercial & Percutant",
      rse: "Professionnel RSE",
      informative: "Informatif & Conseils",
    },
    generatePostBtn: "Générer le post",
    adjustmentsLabel: "Ajustements rapides :",
    adjRegen: "Régénérer",
    adjShorten: "Raccourcir",
    adjExpand: "Développer",
    adjSpell: "Orthographe",
    adjHashtags: "Optimiser hashtags",
    allSynced: "Tous les réseaux (Synchronisé)",
    addImage: "Ajouter image",
    addVideo: "Vidéo",
    genVisualAi: "Générer visuel IA",
    oneMedia: "1 média sélectionné",
    mediaValidated: "Validé LinkedIn / Meta",
    publishOptions: "Options de diffusion",
    recommendedSlot: "Recommandé : Jeu. 09h00 (Pic B2B)",
    modeNow: "Publier maintenant",
    modeNowSub: "Envoi direct sur les réseaux",
    modeSchedule: "Programmer",
    modeScheduleSub: "Définir un créneau optimal",
    modeDraft: "Brouillon interne",
    modeDraftSub: "Revue en équipe",
    publishDate: "Date de diffusion",
    publishTime: "Heure programmée",
    timezone: "Fuseau horaire",
    readyToSchedule: "Prêt pour programmation",
    readyToScheduleSub: "Diffusion planifiée sur les canaux sélectionnés",
    scheduleCta: "Programmer pour le",
    publishNowCta: "Publier maintenant",
    saveDraftCta: "Enregistrer le brouillon",
    livePreview: "Temps réel",
    aiScoreTitle: "Score de performance prédit par l’IA",
    aiScoreBadge: "88/100 · Excellent",
    estImpressions: "Impressions est.",
    estEngagement: "Taux d’engagement",
    estClicks: "Clics site web",
    statuses: {
      ready: "Prêt à publier",
      review: "En validation",
      scheduled: "Programmé",
      published: "Publié",
      draft: "Brouillon",
    },
  },
  en: {
    breadcrumbRoot: "Social Media",
    tabs: {
      overview: "Overview",
      create: "Create post",
      calendar: "Calendar",
      posts: "Posts",
      accounts: "Connected accounts",
    },
    title: "Social Media",
    subtitle:
      "Create, schedule, and manage all your posts in one place with AI-assisted distribution.",
    brandProfileBtn: "Communication profile",
    newPostBtn: "+ New post",
    engineActive: "Publishing engine active",
    syncAuto: "auto sync",
    periodOptions: [
      { value: "mar-2025", label: "This month: March 2025" },
      { value: "30d", label: "Last 30 days" },
      { value: "q1-2025", label: "Current quarter" },
    ],
    kpiPublished: "Published posts",
    kpiPublishedSub: "vs. last month (21)",
    kpiPublishedRight: "92% success rate",
    kpiScheduled: "Scheduled posts",
    kpiScheduledBadge: "Next in 2h",
    kpiScheduledSub: "Queue validated until Mar 31",
    kpiScheduledRight: "3 networks",
    kpiDrafts: "Pending drafts",
    kpiDraftsBadge: "To finalize",
    kpiDraftsSub: "2 AI-generated",
    kpiDraftsAction: "Review",
    kpiEngagement: "Total engagement",
    kpiEngagementSub: "Combined interactions",
    upcomingTitle: "Upcoming posts",
    readyCount: "3 ready",
    viewAllStream: "View full feed",
    aiBannerTitle: "AutoCall AI Smart Generator",
    aiBannerDesc:
      "Need inspiration? AutoCall AI can suggest 5 strategic posts tailored to your industry and B2B services.",
    aiBannerBtn: "Generate with AI",
    reachTitle: "Consolidated weekly reach",
    reachSub: "Organic vs. sponsored impressions trend",
    reachPeriod: "March 2025",
    calendarTitle: "March 2025",
    legendScheduled: "Scheduled",
    legendToday: "Today",
    accountsTitle: "Connected accounts",
    manageAccounts: "Manage",
    connected: "Connected",
    notConfigured: "Not configured",
    connect: "Connect",
    disconnect: "Disconnect",
    quickActions: "Quick actions",
    qaCreate: "Create a post",
    qaGenerate: "Generate content with AI",
    qaCalendar: "Open calendar",
    qaConnect: "Connect an account",
    createTitle: "Create post",
    createSubtitle:
      "Write manually or let AI compose and calibrate your messages for each channel.",
    cancel: "Cancel",
    saveDraft: "Save as draft",
    framingBadge: "Scope: Facility & B2B Services",
    targetPlatforms: "Target platforms",
    activeChannels: "active channels",
    videoRequired: "Video format",
    aiWriterTitle: "AutoCall Writing Assistant",
    aiWriterBadge: "AI B2B Facility",
    aiPromptLabel: "Campaign idea, objective, or theme:",
    toneLabel: "Tone:",
    tones: {
      commercial: "Commercial & Punchy",
      rse: "ESG Professional",
      informative: "Informative & Tips",
    },
    generatePostBtn: "Generate post",
    adjustmentsLabel: "Quick adjustments:",
    adjRegen: "Regenerate",
    adjShorten: "Shorten",
    adjExpand: "Expand",
    adjSpell: "Spelling",
    adjHashtags: "Optimize hashtags",
    allSynced: "All networks (Synced)",
    addImage: "Add image",
    addVideo: "Video",
    genVisualAi: "Generate AI visual",
    oneMedia: "1 media selected",
    mediaValidated: "Validated LinkedIn / Meta",
    publishOptions: "Publishing options",
    recommendedSlot: "Recommended: Thu 09:00 (B2B Peak)",
    modeNow: "Publish now",
    modeNowSub: "Send directly to networks",
    modeSchedule: "Schedule",
    modeScheduleSub: "Pick an optimal time slot",
    modeDraft: "Internal draft",
    modeDraftSub: "Team review",
    publishDate: "Publish date",
    publishTime: "Scheduled time",
    timezone: "Timezone",
    readyToSchedule: "Ready to schedule",
    readyToScheduleSub: "Scheduled distribution across selected channels",
    scheduleCta: "Schedule for",
    publishNowCta: "Publish now",
    saveDraftCta: "Save draft",
    livePreview: "Real-time",
    aiScoreTitle: "AI predicted performance score",
    aiScoreBadge: "88/100 · Excellent",
    estImpressions: "Est. impressions",
    estEngagement: "Engagement rate",
    estClicks: "Website clicks",
    statuses: {
      ready: "Ready to publish",
      review: "In review",
      scheduled: "Scheduled",
      published: "Published",
      draft: "Draft",
    },
  },
  es: {
    breadcrumbRoot: "Redes sociales",
    tabs: {
      overview: "Resumen",
      create: "Crear publicación",
      calendar: "Calendario",
      posts: "Publicaciones",
      accounts: "Cuentas conectadas",
    },
    title: "Redes sociales",
    subtitle:
      "Crea, programa y gestiona todas tus publicaciones en un mismo lugar con distribución asistida por IA.",
    brandProfileBtn: "Perfil de comunicación",
    newPostBtn: "+ Nueva publicación",
    engineActive: "Motor de publicación activo",
    syncAuto: "sincro auto",
    periodOptions: [
      { value: "mar-2025", label: "Este mes: Marzo 2025" },
      { value: "30d", label: "Últimos 30 días" },
      { value: "q1-2025", label: "Trimestre actual" },
    ],
    kpiPublished: "Publicaciones enviadas",
    kpiPublishedSub: "vs. mes pasado (21)",
    kpiPublishedRight: "92 % tasa éxito",
    kpiScheduled: "Publicaciones programadas",
    kpiScheduledBadge: "Próxima en 2 h",
    kpiScheduledSub: "Flujo validado hasta el 31 mar",
    kpiScheduledRight: "3 redes",
    kpiDrafts: "Borradores pendientes",
    kpiDraftsBadge: "Por finalizar",
    kpiDraftsSub: "2 generados por IA",
    kpiDraftsAction: "Revisar",
    kpiEngagement: "Interacción total",
    kpiEngagementSub: "Interacciones acumuladas",
    upcomingTitle: "Próximas publicaciones",
    readyCount: "3 listas",
    viewAllStream: "Ver todo el flujo",
    aiBannerTitle: "Generador inteligente AutoCall IA",
    aiBannerDesc:
      "¿Necesitas inspiración? La IA de AutoCall puede sugerirte 5 publicaciones estratégicas alineadas con tu sector B2B.",
    aiBannerBtn: "Generar con IA",
    reachTitle: "Alcance semanal consolidado",
    reachSub: "Evolución de impresiones orgánicas y promocionadas",
    reachPeriod: "Marzo 2025",
    calendarTitle: "Marzo 2025",
    legendScheduled: "Programado",
    legendToday: "Hoy",
    accountsTitle: "Cuentas conectadas",
    manageAccounts: "Gestionar",
    connected: "Conectado",
    notConfigured: "Sin configurar",
    connect: "Conectar",
    disconnect: "Desconectar",
    quickActions: "Acciones rápidas",
    qaCreate: "Crear una publicación",
    qaGenerate: "Generar contenido con IA",
    qaCalendar: "Abrir el calendario",
    qaConnect: "Conectar una cuenta",
    createTitle: "Crear publicación",
    createSubtitle:
      "Redacta manualmente o deja que la IA componga y calibre tus mensajes para cada canal.",
    cancel: "Cancelar",
    saveDraft: "Guardar como borrador",
    framingBadge: "Enfoque: Limpieza & Facility B2B",
    targetPlatforms: "Plataformas objetivo",
    activeChannels: "canales activos",
    videoRequired: "Formato vídeo",
    aiWriterTitle: "Asistente de redacción AutoCall",
    aiWriterBadge: "IA Facility B2B",
    aiPromptLabel: "Idea, objetivo o temática de campaña:",
    toneLabel: "Tono:",
    tones: {
      commercial: "Comercial & Directo",
      rse: "Profesional RSE",
      informative: "Informativo & Consejos",
    },
    generatePostBtn: "Generar publicación",
    adjustmentsLabel: "Ajustes rápidos:",
    adjRegen: "Regenerar",
    adjShorten: "Acortar",
    adjExpand: "Ampliar",
    adjSpell: "Ortografía",
    adjHashtags: "Optimizar hashtags",
    allSynced: "Todas las redes (Sincronizado)",
    addImage: "Añadir imagen",
    addVideo: "Vídeo",
    genVisualAi: "Generar visual IA",
    oneMedia: "1 archivo seleccionado",
    mediaValidated: "Validado LinkedIn / Meta",
    publishOptions: "Opciones de difusión",
    recommendedSlot: "Recomendado: Jue. 09:00 (Pico B2B)",
    modeNow: "Publicar ahora",
    modeNowSub: "Envío directo a las redes",
    modeSchedule: "Programar",
    modeScheduleSub: "Definir horario óptimo",
    modeDraft: "Borrador interno",
    modeDraftSub: "Revisión en equipo",
    publishDate: "Fecha de difusión",
    publishTime: "Hora programada",
    timezone: "Zona horaria",
    readyToSchedule: "Listo para programar",
    readyToScheduleSub: "Difusión planificada en los canales seleccionados",
    scheduleCta: "Programar para el",
    publishNowCta: "Publicar ahora",
    saveDraftCta: "Guardar borrador",
    livePreview: "Tiempo real",
    aiScoreTitle: "Puntuación de rendimiento predicha por IA",
    aiScoreBadge: "88/100 · Excelente",
    estImpressions: "Impresiones est.",
    estEngagement: "Tasa de interacción",
    estClicks: "Clics sitio web",
    statuses: {
      ready: "Lista para publicar",
      review: "En validación",
      scheduled: "Programada",
      published: "Publicada",
      draft: "Borrador",
    },
  },
} as const;

const INITIAL_POSTS: SocialPost[] = [
  {
    id: "post-1",
    title: "3 astuces pour déléguer l’accueil téléphonique B2B",
    excerpt: "Ne perdez plus 35 % de vos prospects entrants pendant les pics d’activité...",
    content:
      "3 astuces pour déléguer l’accueil téléphonique B2B sans perdre en qualité :\n\n• Répondre en moins de 3 sonneries grâce au routage intelligent\n• Qualifier automatiquement budget, urgence et secteur\n• Synchroniser chaque compte-rendu dans votre CRM en temps réel\n\nDécouvrez comment nos équipes hybrides libèrent 12 h par semaine.\n\n#RelationClient #B2B #Automatisation #PME #AutoCall",
    platforms: ["linkedin", "instagram"],
    status: "ready",
    dateLabel: "Demain à 09:30",
    dayOfMonth: 26,
    time: "09:30",
    mediaName: "accueil_b2b_2025.jpg",
    mediaKind: "team",
    impressions: "2,4k",
    engagement: "4,6 %",
  },
  {
    id: "post-2",
    title: "Offre Printemps : Audit de propreté & devis sous 24 h",
    excerpt: "Profitez de l’accélération printanière pour tester nos protocoles certifiés...",
    content:
      "Le grand ménage de printemps, c’est aussi (et surtout) au bureau.\n\nOffrez à vos équipes un cadre de travail ultra-propre, sain et stimulant dès ce trimestre :\n• Protocoles d’hygiène rigoureux certifiés ISO\n• Interventions en horaires décalés (zéro impact sur votre activité)\n• Produits écologiques éco-labellisés et démarche RSE\n• Équipes dédiées et formées\n\nProfitez de notre audit propreté offert et d’un devis transparent en moins de 24 h pour vos locaux professionnels en Île-de-France.\n\nDécouvrez nos formules sur mesure : autocall-clean.fr/bureaux-pme\n\n#NettoyageBureau #FacilityManagement #PropretéEntreprise #B2BParis #QualitéDeVieAuTravail #FacilityServices",
    platforms: ["facebook", "linkedin"],
    status: "review",
    dateLabel: "Jeudi 27 mars à 14:00",
    dayOfMonth: 27,
    time: "14:00",
    mediaName: "bureau_clean_premium_spring_2025.jpg",
    mediaKind: "office",
    impressions: "1,8k",
    engagement: "4,2 %",
  },
  {
    id: "post-3",
    title: "Dans les coulisses : Qualité de service et contrôle terrain",
    excerpt: "Retour en images sur nos interventions d’excellence auprès de nos clients...",
    content:
      "Dans les coulisses de nos interventions terrain.\n\nChaque site bénéficie d’une grille de contrôle qualité numérique, vérifiée chaque semaine par nos superviseurs.\n\nTransparence, traçabilité et réactivité au service de vos espaces de travail.\n\n#QualitéService #Terrain #FacilityManagement #AutoCall",
    platforms: ["instagram"],
    status: "scheduled",
    dateLabel: "Lundi 31 mars à 18:00",
    dayOfMonth: 31,
    time: "18:00",
    mediaName: "audit_terrain_visuel.jpg",
    mediaKind: "audit",
    impressions: "1,3k",
    engagement: "5,1 %",
  },
  {
    id: "post-4",
    title: "Bilan Q1 : +18 % de demandes qualifiées via LinkedIn",
    excerpt: "Retour d’expérience sur notre cadence éditoriale hebdomadaire...",
    content:
      "Bilan du premier trimestre : +18 % de demandes de devis qualifiées grâce à une prise de parole régulière et orientée preuves terrain.\n\n#B2B #Croissance #SocialSelling",
    platforms: ["linkedin", "facebook"],
    status: "published",
    dateLabel: "18 mars à 09:00",
    dayOfMonth: 18,
    time: "09:00",
    mediaName: "bilan_q1_2025.jpg",
    mediaKind: "office",
    impressions: "4,9k",
    engagement: "4,8 %",
  },
  {
    id: "post-5",
    title: "Checklist hygiène des espaces partagés (Brouillon IA)",
    excerpt: "5 points de vigilance pour vos salles de réunion et zones d’accueil...",
    content:
      "Checklist hebdomadaire pour des espaces de réunion impeccables :\n• Désinfection des points de contact\n• Qualité de l’air et ventilation\n• Entretien des surfaces vitrées\n\n#HygièneB2B #Bureaux",
    platforms: ["linkedin", "instagram"],
    status: "draft",
    dateLabel: "Non planifié",
    dayOfMonth: 28,
    time: "10:00",
    mediaName: "checklist_espaces_partages.jpg",
    mediaKind: "audit",
  },
];

const INITIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: "linkedin",
    name: "AutoCall SAS",
    handle: "Page entreprise",
    typeLabel: "LinkedIn Pages API",
    connected: true,
    followers: "3 840 abonnés",
    lastSync: "Il y a 4 min",
    autoSync: true,
  },
  {
    id: "instagram",
    name: "@autocall_app",
    handle: "Profil professionnel",
    typeLabel: "Instagram Graph API",
    connected: true,
    followers: "2 190 abonnés",
    lastSync: "Il y a 6 min",
    autoSync: true,
  },
  {
    id: "facebook",
    name: "AutoCall France",
    handle: "Page officielle",
    typeLabel: "Meta Business Suite",
    connected: true,
    followers: "1 640 abonnés",
    lastSync: "Il y a 9 min",
    autoSync: true,
  },
  {
    id: "tiktok",
    name: "TikTok Entreprise",
    handle: "Non configuré",
    typeLabel: "TikTok Content Posting",
    connected: false,
    followers: "—",
    lastSync: "Jamais",
    autoSync: false,
  },
];

const REACH_POINTS = [
  { label: "Lun 17", value: 1120 },
  { label: "Mer 19", value: 1680 },
  { label: "Ven 21", value: 1490 },
  { label: "Dim 23", value: 2690 },
  { label: "Mar 25", value: 2380 },
  { label: "Jeu 27", value: 3340 },
  { label: "Aujourd’hui", value: 3920 },
];

const DEFAULT_PROMPT =
  "Je veux promouvoir notre service de nettoyage de bureaux pour les PME d’Île-de-France avec l’arrivée du printemps : accent sur l’hygiène certifiée, les horaires décalés sans perturbation et devis rapide en 24h.";

function PlatformBadge({
  platform,
  size = "sm",
}: {
  platform: PlatformId;
  size?: "xs" | "sm" | "md";
}) {
  const dim =
    size === "xs"
      ? "size-5 rounded-[5px]"
      : size === "md"
        ? "size-8 rounded-lg"
        : "size-7 rounded-lg";

  if (platform === "linkedin") {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center bg-[#0A66C2] text-white ${dim}`}
        aria-label="LinkedIn"
      >
        <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
          <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.37 8.22 13.48 9.2 13.02 9.93V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
        </svg>
      </span>
    );
  }
  if (platform === "instagram") {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${dim}`}
        aria-label="Instagram"
      >
        <InstagramBrandSvg className="size-full" />
      </span>
    );
  }
  if (platform === "facebook") {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${dim}`}
        aria-label="Facebook"
      >
        <FacebookBrandSvg className="size-full" />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-[#171717] text-white ${dim}`}
      aria-label="TikTok"
    >
      <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69A4.83 4.83 0 0 1 16.5 5.1V15.5A5.5 5.5 0 1 1 11 10V13.2A2.3 2.3 0 1 0 13.3 15.5V2.5H16.5A4.83 4.83 0 0 0 19.59 6.69Z" />
      </svg>
    </span>
  );
}

function MediaIllustration({
  kind,
  className = "h-12 w-12 rounded-lg",
}: {
  kind: "office" | "team" | "audit";
  className?: string;
}) {
  if (kind === "office") {
    return (
      <svg
        viewBox="0 0 240 130"
        className={`shrink-0 overflow-hidden border border-[#E5E5E5] bg-[#F5F7F6] ${className}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="skyOffice" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E6EFEA" />
            <stop offset="100%" stopColor="#D3E0D9" />
          </linearGradient>
        </defs>
        <rect width="240" height="130" fill="url(#skyOffice)" />
        <rect x="18" y="18" width="204" height="72" rx="4" fill="#FFFFFF" stroke="#D4D4D4" />
        <line x1="86" y1="18" x2="86" y2="90" stroke="#E5E5E5" strokeWidth="2" />
        <line x1="154" y1="18" x2="154" y2="90" stroke="#E5E5E5" strokeWidth="2" />
        <rect x="34" y="96" width="172" height="16" rx="4" fill="#262626" />
        <rect x="52" y="112" width="10" height="14" fill="#525252" />
        <rect x="178" y="112" width="10" height="14" fill="#525252" />
        <rect x="66" y="84" width="14" height="12" rx="3" fill="#404040" />
        <rect x="113" y="84" width="14" height="12" rx="3" fill="#404040" />
        <rect x="160" y="84" width="14" height="12" rx="3" fill="#404040" />
        <circle cx="200" cy="34" r="10" fill="#00B489" fillOpacity="0.18" />
        <path d="M196 34l3 3 5-6" stroke="#008F6D" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "team") {
    return (
      <svg
        viewBox="0 0 120 120"
        className={`shrink-0 overflow-hidden border border-[#E5E5E5] bg-[#F7F7F5] ${className}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect width="120" height="120" fill="#F2F4F3" />
        <rect x="16" y="22" width="88" height="76" rx="10" fill="#FFFFFF" stroke="#E5E5E5" />
        <circle cx="46" cy="50" r="12" fill="#D4D4D4" />
        <path d="M28 84c0-10 8-16 18-16s18 6 18 16" fill="#262626" />
        <rect x="70" y="42" width="24" height="6" rx="3" fill="#00B489" />
        <rect x="70" y="54" width="18" height="5" rx="2.5" fill="#E5E5E5" />
        <rect x="70" y="64" width="22" height="5" rx="2.5" fill="#E5E5E5" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 120 120"
      className={`shrink-0 overflow-hidden border border-[#E5E5E5] bg-[#F7F7F5] ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="120" height="120" fill="#EFF5F2" />
      <rect x="20" y="20" width="80" height="80" rx="10" fill="#FFFFFF" stroke="#D4E5DD" />
      <path d="M36 52h48M36 68h34M36 84h42" stroke="#D4D4D4" strokeWidth="5" strokeLinecap="round" />
      <circle cx="44" cy="36" r="7" fill="#00B489" />
      <path d="M41 36l2 2 4-4" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <rect x="58" y="33" width="26" height="6" rx="3" fill="#171717" />
    </svg>
  );
}

function SparkleSvg({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path
        d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8L12 3Z"
        strokeLinejoin="round"
      />
      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" strokeLinejoin="round" />
    </svg>
  );
}

function StatusPill({
  status,
  label,
}: {
  status: PostStatus;
  label: string;
}) {
  const styles: Record<PostStatus, string> = {
    ready: "bg-[#E6F5F0] text-[#00775B] border-[#B8E6D6]",
    review: "bg-[#FEF6E6] text-[#9A6700] border-[#F6DFB0]",
    scheduled: "bg-[#F3F4F6] text-[#404040] border-[#E5E5E5]",
    published: "bg-[#E6F5F0] text-[#00775B] border-[#B8E6D6]",
    draft: "bg-[#F5F5F5] text-[#525252] border-[#E5E5E5]",
  };
  const dotStyles: Record<PostStatus, string> = {
    ready: "bg-[#008F6D]",
    review: "bg-[#D97706]",
    scheduled: "bg-[#737373]",
    published: "bg-[#008F6D]",
    draft: "bg-[#A3A3A3]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap ${styles[status]}`}
    >
      <span className={`size-1.5 rounded-full ${dotStyles[status]}`} />
      {label}
    </span>
  );
}

export function SocialView({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const [activeTab, setActiveTab] = useState<SocialTab>("posts");
  const [mediaSearch, setMediaSearch] = useState("");
  const [selectedMedia, setSelectedMedia] = useState("");
  const [calendarMonth, setCalendarMonth] = useState("2025-03");
  const [calendarNetwork, setCalendarNetwork] = useState<"all" | SocialPost["platforms"][number]>("all");
  const [calendarView, setCalendarView] = useState<"month" | "week" | "list">("month");
  const [period, setPeriod] = useState("mar-2025");
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(25);
  const [postsFilter, setPostsFilter] = useState<"all" | PostStatus>("all");
  const [postsSearch, setPostsSearch] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [brandSector, setBrandSector] = useState("Propreté & Facility B2B");
  const [toast, setToast] = useState<string | null>(null);

  // Composer state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<("linkedin" | "instagram" | "facebook")[]>([
    "linkedin",
    "instagram",
    "facebook",
  ]);
  const [aiPrompt, setAiPrompt] = useState(DEFAULT_PROMPT);
  const [tone, setTone] = useState<ToneId>("commercial");
  const [composerNetworkTab, setComposerNetworkTab] = useState<"all" | "linkedin" | "instagram" | "facebook">("all");
  const [postContent, setPostContent] = useState(INITIAL_POSTS[1].content);
  const [networkOverrides, setNetworkOverrides] = useState<Partial<Record<"linkedin" | "instagram" | "facebook", string>>>({});
  const [mediaName, setMediaName] = useState("bureau_clean_premium_spring_2025.jpg");
  const [mediaKind, setMediaKind] = useState<"office" | "team" | "audit">("office");
  const [publishMode, setPublishMode] = useState<PublishMode>("schedule");
  const [scheduleDate, setScheduleDate] = useState("2025-03-27");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [previewPlatform, setPreviewPlatform] = useState<"linkedin" | "instagram" | "facebook">("linkedin");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const activeEditorText =
    composerNetworkTab === "all"
      ? postContent
      : networkOverrides[composerNetworkTab] ?? postContent;

  const updateActiveEditorText = (value: string) => {
    if (composerNetworkTab === "all") {
      setPostContent(value);
    } else {
      setNetworkOverrides((prev) => ({ ...prev, [composerNetworkTab]: value }));
    }
  };

  const previewText = networkOverrides[previewPlatform] ?? postContent;

  const togglePlatform = (p: "linkedin" | "instagram" | "facebook") => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(p)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== p);
      }
      return [...prev, p];
    });
  };

  const handleGenerateAiPost = () => {
    const toneSnippet =
      tone === "commercial"
        ? "Profitez de notre audit propreté offert et d’un devis transparent en moins de 24 h."
        : tone === "rse"
          ? "100 % de produits éco-labellisés, traçabilité numérique et bien-être de vos collaborateurs."
          : "3 indicateurs clés pour évaluer la qualité de l’entretien de vos espaces tertiaires.";

    const generated = `${
      tone === "commercial"
        ? "Le grand ménage de printemps, c’est aussi (et surtout) au bureau."
        : tone === "rse"
          ? "Concilier performance opérationnelle et propreté éco-responsable en Île-de-France."
          : "Comment optimiser l’hygiène de vos bureaux sans perturber vos équipes ?"
    }\n\nOffrez à vos équipes un cadre de travail sain, certifié et stimulant :\n• Protocoles d’hygiène rigoureux certifiés ISO\n• Interventions en horaires décalés (zéro impact sur votre activité)\n• Équipes dédiées, formées et supervisées chaque semaine\n\n${toneSnippet}\n\nDécouvrez nos formules sur mesure : autocall-clean.fr/bureaux-pme\n\n#NettoyageBureau #FacilityManagement #PropretéEntreprise #B2BParis #QualitéDeVieAuTravail`;

    setPostContent(generated);
    setNetworkOverrides({});
    notify(
      locale === "fr"
        ? "Publication générée par AutoCall IA"
        : locale === "es"
          ? "Publicación generada por AutoCall IA"
          : "Post generated by AutoCall AI"
    );
  };

  const handleQuickAdjust = (kind: "regen" | "shorten" | "expand" | "spell" | "hashtags") => {
    if (kind === "regen") {
      handleGenerateAiPost();
      return;
    }
    if (kind === "shorten") {
      const shortened =
        "Un cadre de travail sain et certifié pour vos équipes dès ce trimestre.\n\n• Protocoles ISO & produits éco-labellisés\n• Interventions en horaires décalés sans perturbation\n• Audit offert et devis sous 24 h en Île-de-France\n\nEn savoir plus : autocall-clean.fr/bureaux-pme\n\n#FacilityManagement #B2BParis #PropretéEntreprise";
      updateActiveEditorText(shortened);
      notify(locale === "fr" ? "Texte condensé" : "Text shortened");
      return;
    }
    if (kind === "expand") {
      updateActiveEditorText(
        `${activeEditorText}\n\nNos responsables qualité effectuent un suivi hebdomadaire avec rapport photo et indicateurs de conformité disponibles dans votre espace client.`
      );
      notify(locale === "fr" ? "Argumentaire enrichi" : "Text expanded");
      return;
    }
    if (kind === "spell") {
      updateActiveEditorText(activeEditorText.replace(/\s{2,}/g, " ").trim());
      notify(locale === "fr" ? "Orthographe et typographie vérifiées" : "Spelling checked");
      return;
    }
    if (!activeEditorText.includes("#FacilityServices")) {
      updateActiveEditorText(`${activeEditorText.trim()}\n#FacilityServices #RSE #BureauxDurables`);
      notify(locale === "fr" ? "Hashtags optimisés" : "Hashtags optimized");
    }
  };

  const handleEditPost = (post: SocialPost) => {
    setEditingPostId(post.id);
    setSelectedPlatforms(post.platforms);
    setPostContent(post.content);
    setNetworkOverrides(post.variants ?? {});
    setMediaName(post.mediaName);
    setMediaKind(post.mediaKind);
    setPublishMode(post.status === "draft" ? "draft" : "schedule");
    setScheduleTime(post.time || "09:00");
    setScheduleDate(post.scheduleDate ?? getPostDate(post) ?? "2025-03-27");
    setTimezone(post.timezone ?? "Europe/Paris");
    setActiveTab("create");
  };

  const handleDuplicatePost = (post: SocialPost) => {
    const copy: SocialPost = {
      ...post,
      id: `post-${Date.now()}`,
      title: `${post.title} (copie)`,
      status: "draft",
      scheduleDate: undefined,
      impressions: undefined,
      engagement: undefined,
      dateLabel: locale === "fr" ? "Non planifié" : "Unscheduled",
    };
    setPosts((prev) => [copy, ...prev]);
    notify(locale === "fr" ? "Publication dupliquée en brouillon" : "Post duplicated to drafts");
  };

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    notify(locale === "fr" ? "Publication supprimée" : "Post deleted");
  };

  const scheduledDayLabel = scheduleDate
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(scheduleDate + "T12:00:00Z")) + ` · ${scheduleTime} · ${timezone}`
    : "—";

  const handleSubmitComposer = (forcedMode?: PublishMode) => {
    const mode = forcedMode ?? publishMode;
    if (!selectedPlatforms.length || !selectedPlatforms.every((platform) => (networkOverrides[platform] ?? postContent).trim())) {
      notify(locale === "fr" ? "Sélectionnez un réseau et renseignez son contenu." : "Select a platform and enter its content.");
      return;
    }
    if (mode === "schedule" && (!scheduleDate || !scheduleTime)) {
      notify(locale === "fr" ? "Renseignez la date et l’heure." : "Enter a date and time.");
      return;
    }
    const firstLine = postContent.split("\n").find((l) => l.trim().length > 0) || "Nouvelle publication";
    const parsedDay = Number(scheduleDate.split("-")[2]) || 27;
    const status: PostStatus =
      mode === "now" ? "ready" : mode === "draft" ? "draft" : "scheduled";
    const dateLabel =
      mode === "now"
        ? locale === "fr"
          ? "Prêt · Simulation"
          : "Ready · Simulation"
        : mode === "draft"
          ? locale === "fr"
            ? "Non planifié"
            : "Unscheduled"
          : scheduledDayLabel;

    if (editingPostId) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPostId
            ? {
                ...p,
                title: firstLine.slice(0, 56),
                excerpt: postContent.slice(0, 78) + "...",
                content: postContent,
                platforms: selectedPlatforms,
                status,
                dateLabel,
                dayOfMonth: parsedDay,
                time: scheduleTime,
                mediaName,
                mediaKind,
                variants: networkOverrides,
                scheduleDate: mode === "schedule" ? scheduleDate : undefined,
                timezone,
                impressions: undefined,
                engagement: undefined,
              }
            : p
        )
      );
      setEditingPostId(null);
    } else {
      const created: SocialPost = {
        id: crypto.randomUUID(),
        title: firstLine.slice(0, 56),
        excerpt: postContent.slice(0, 78) + "...",
        content: postContent,
        platforms: selectedPlatforms,
        status,
        dateLabel,
        dayOfMonth: parsedDay,
        time: scheduleTime,
        mediaName,
        mediaKind,
        variants: networkOverrides,
        scheduleDate: mode === "schedule" ? scheduleDate : undefined,
        timezone,
      };
      setPosts((prev) => [created, ...prev]);
    }

    notify(
      mode === "now"
        ? locale === "fr"
          ? "Simulation terminée. Publication prête dans le studio."
          : "Simulation complete. Post ready in the studio."
        : mode === "draft"
          ? locale === "fr"
            ? "Brouillon enregistré"
            : "Draft saved"
          : locale === "fr"
            ? `Planification locale : ${scheduledDayLabel}`
            : `Local schedule: ${scheduledDayLabel}`
    );
    if (mode === "schedule") {
      setCalendarMonth(scheduleDate.slice(0, 7));
      setSelectedCalendarDay(parsedDay);
    }
    setActiveTab(mode === "schedule" ? "calendar" : "posts");
  };

  const toggleAccountConnection = (id: PlatformId) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              connected: !acc.connected,
              handle: !acc.connected
                ? id === "tiktok"
                  ? "@autocall_pro"
                  : acc.handle
                : "Non configuré",
              followers: !acc.connected && acc.followers === "—" ? "890 abonnés" : acc.followers,
              lastSync: !acc.connected ? "À l’instant" : "Déconnecté",
              autoSync: !acc.connected,
            }
          : acc
      )
    );
  };

  const upcomingPosts = useMemo(
    () => posts.filter((p) => p.status === "ready" || p.status === "review" || p.status === "scheduled"),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchFilter = postsFilter === "all" || p.status === postsFilter;
      const q = postsSearch.trim().toLowerCase();
      const matchSearch =
        !q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [posts, postsFilter, postsSearch]);

  const scheduledDays = useMemo(() => {
    const set = new Set<number>();
    posts.forEach((p) => {
      if (p.status === "ready" || p.status === "review" || p.status === "scheduled") {
        set.add(p.dayOfMonth);
      }
    });
    return set;
  }, [posts]);

  // SVG chart coordinates
  const chartPath = useMemo(() => {
    const w = 640;
    const h = 128;
    const min = 700;
    const max = 4300;
    const coords = REACH_POINTS.map((pt, i) => {
      const x = 20 + (i * (w - 40)) / (REACH_POINTS.length - 1);
      const y = h - 18 - ((pt.value - min) / (max - min)) * (h - 34);
      return { x, y, ...pt };
    });
    const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
    const area = `${line} L${coords[coords.length - 1].x.toFixed(1)},${h - 10} L${coords[0].x.toFixed(1)},${h - 10} Z`;
    return { coords, line, area, w, h };
  }, []);

  const primaryTabs = [
    { id: "posts", label: t.tabs.posts },
    { id: "calendar", label: { fr: "Planification", en: "Planning", es: "Planificación" }[locale] },
    { id: "media", label: { fr: "Médias et ressources", en: "Media and resources", es: "Medios y recursos" }[locale] },
    { id: "overview", label: { fr: "Performances", en: "Performance", es: "Rendimiento" }[locale] },
  ] as const;
  const mediaAssets = [...new Map(INITIAL_POSTS.concat(posts).map((post) => [post.mediaName, { name: post.mediaName, kind: post.mediaKind }])).values()].filter((asset) => asset.name);
  const asset = mediaAssets.find((item) => item.name === selectedMedia);
  const [calendarYear, calendarMonthNumber] = calendarMonth.split("-").map(Number);
  const monthStart = new Date(Date.UTC(calendarYear, calendarMonthNumber - 1, 1));
  const monthOffset = (monthStart.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(calendarYear, calendarMonthNumber, 0)).getUTCDate();
  const weekStart = Math.floor((selectedCalendarDay + monthOffset - 1) / 7) * 7 - monthOffset + 1;
  const calendarPosts = posts.filter((post) => getPostDate(post)?.startsWith(calendarMonth + "-") && (calendarNetwork === "all" || post.platforms.includes(calendarNetwork)));

  return (
    <div className="w-full min-w-0 space-y-5 px-4 py-6 sm:px-7">
      {/* Toast notification */}
      {toast && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#B8E6D6] bg-[#FFFFFF] px-4 py-3 text-[14px] font-medium text-[#171717] shadow-lg">
          <span className="size-2 rounded-full bg-[#00B489]" />
          {toast}
        </div>
      )}

      {/* Sub-tabs bar */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-[#E5E5E5]" role="tablist" aria-label={t.breadcrumbRoot}>
        {primaryTabs.map(({ id: tab, label }) => {
          const isActive = activeTab === tab || (tab === "posts" && (activeTab === "create" || activeTab === "accounts"));
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              className={`relative shrink-0 whitespace-nowrap pb-3 text-[14px] font-medium transition-colors ${
                isActive ? "text-[#171717]" : "text-[#737373] hover:text-[#171717]"
              }`}
            >
              {label}
              {isActive && (
                <span className="absolute right-0 bottom-0 left-0 h-[2px] rounded-full bg-[#171717]" />
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "media" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-xl font-semibold">Médias et ressources</h2><p className="mt-1 text-sm text-[var(--text-muted)]">Visuels de démonstration réutilisables dans le studio.</p></div>
            <input type="search" aria-label="Rechercher un média" placeholder="Rechercher un média" value={mediaSearch} onChange={(event) => setMediaSearch(event.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mediaAssets.filter((item) => item.name.toLowerCase().includes(mediaSearch.trim().toLowerCase())).map((item) => (
              <button type="button" key={item.name} aria-pressed={item.name === selectedMedia} onClick={() => setSelectedMedia(item.name)} className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-left aria-pressed:ring-2 aria-pressed:ring-[#008F6D]">
                <MediaIllustration kind={item.kind} className="h-32 w-full rounded-lg" />
                <span className="block break-all text-sm font-medium">{item.name}</span>
              </button>
            ))}
          </div>
          {asset && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="min-w-0 break-all text-sm">{asset.name}</p>
              <button type="button" className="rounded-lg bg-[#008F6D] px-3 py-2 text-sm font-medium text-white" onClick={() => { setMediaName(asset.name); setMediaKind(asset.kind); setActiveTab("create"); }}>Utiliser dans l’éditeur</button>
            </div>
          )}
        </section>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[13px] text-[#737373]">
                {t.breadcrumbRoot} <span className="mx-1 text-[#A3A3A3]">&gt;</span>{" "}
                <span className="text-[#404040]">{t.tabs.overview}</span>
              </p>
              <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#171717]">
                {t.title}
              </h1>
              <p className="mt-0.5 text-[14px] text-[#737373]">{t.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 text-[14px] font-medium text-[#171717] shadow-2xs transition hover:bg-[#F8F8F8]"
              >
                <svg viewBox="0 0 24 24" className="size-4 text-[#525252]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4 6h16M4 12h10M4 18h14" strokeLinecap="round" />
                  <circle cx="17" cy="12" r="2" />
                </svg>
                {t.brandProfileBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingPostId(null);
                  setActiveTab("create");
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#171717] px-4 text-[14px] font-medium text-white shadow-xs transition hover:bg-[#262626]"
              >
                {t.newPostBtn}
              </button>
            </div>
          </div>

          {/* Engine status bar */}
          <div className="flex flex-col gap-2.5 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="size-2 rounded-full bg-[#00B489]" />
              <span className="text-[14px] font-medium text-[#171717]">{t.engineActive}</span>
              <span className="rounded-md border border-[#E5E5E5] bg-[#F8F8F8] px-2 py-0.5 font-mono text-[12px] text-[#525252]">
                {t.syncAuto}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PremiumSelect
                value={period}
                onChange={setPeriod}
                options={[...t.periodOptions]}
                ariaLabel="Période"
                className="min-w-[200px]"
              />
              <button
                type="button"
                onClick={() =>
                  notify(locale === "fr" ? "Statistiques synchronisées" : "Stats synced")
                }
                aria-label="Actualiser"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] text-[#525252] transition hover:bg-[#F8F8F8]"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* 4 KPI cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* KPI 1 */}
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13px] font-medium text-[#737373]">{t.kpiPublished}</span>
                <span className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] text-[#525252]">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[28px] font-bold tracking-tight text-[#171717]">
                  {20 + posts.filter((p) => p.status === "published").length * 4}
                </span>
                <span className="rounded-full bg-[#E6F5F0] px-2 py-0.5 text-[12px] font-medium text-[#00775B]">
                  +12 %
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[12px] text-[#737373]">
                <span>{t.kpiPublishedSub}</span>
                <span className="font-medium text-[#404040]">{t.kpiPublishedRight}</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13px] font-medium text-[#737373]">{t.kpiScheduled}</span>
                <span className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] text-[#525252]">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[28px] font-bold tracking-tight text-[#171717]">
                  {upcomingPosts.length + 5}
                </span>
                <span className="rounded-full bg-[#E6F5F0] px-2 py-0.5 text-[12px] font-medium text-[#00775B]">
                  {t.kpiScheduledBadge}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[12px] text-[#737373]">
                <span>{t.kpiScheduledSub}</span>
                <span className="font-medium text-[#404040]">{t.kpiScheduledRight}</span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13px] font-medium text-[#737373]">{t.kpiDrafts}</span>
                <span className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] text-[#525252]">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" strokeLinejoin="round" />
                    <path d="M14 3v6h6M8 13h8M8 17h5" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[28px] font-bold tracking-tight text-[#171717]">
                  {posts.filter((p) => p.status === "draft").length + 2}
                </span>
                <span className="rounded-full border border-[#E5E5E5] bg-[#F5F5F5] px-2 py-0.5 text-[12px] font-medium text-[#525252]">
                  {t.kpiDraftsBadge}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[12px] text-[#737373]">
                <span>{t.kpiDraftsSub}</span>
                <button
                  type="button"
                  onClick={() => {
                    setPostsFilter("draft");
                    setActiveTab("posts");
                  }}
                  className="font-medium text-[#171717] hover:underline"
                >
                  {t.kpiDraftsAction} →
                </button>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13px] font-medium text-[#737373]">{t.kpiEngagement}</span>
                <span className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] text-[#525252]">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M3 17l6-6 4 4 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 8h4v4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[28px] font-bold tracking-tight text-[#171717]">14,8k</span>
                <span className="rounded-full bg-[#E6F5F0] px-2 py-0.5 text-[12px] font-medium text-[#00775B]">
                  +18,4 %
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[12px] text-[#737373]">
                <span>{t.kpiEngagementSub}</span>
                <span className="font-medium text-[#404040]">LI, IG, FB</span>
              </div>
            </div>
          </div>

          {/* 2-column main content */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left column */}
            <div className="space-y-5 lg:col-span-8">
              {/* Upcoming posts */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-[15px] font-semibold text-[#171717]">{t.upcomingTitle}</h2>
                    <span className="rounded-full border border-[#E5E5E5] bg-[#F8F8F8] px-2.5 py-0.5 text-[12px] font-medium text-[#525252]">
                      {upcomingPosts.length} {locale === "fr" ? "prêtes" : locale === "es" ? "listas" : "ready"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPostsFilter("all");
                      setActiveTab("posts");
                    }}
                    className="text-[13px] font-medium text-[#525252] transition hover:text-[#171717]"
                  >
                    {t.viewAllStream} →
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {upcomingPosts.slice(0, 4).map((post) => (
                    <div
                      key={post.id}
                      className="flex flex-col gap-3 rounded-xl border border-[#E5E5E5] bg-[#FCFCFC] p-3.5 transition hover:border-[#D4D4D4] hover:bg-[#FFFFFF] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <MediaIllustration kind={post.mediaKind} className="size-14 rounded-lg" />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {post.platforms.map((pf) => (
                              <PlatformBadge key={pf} platform={pf} size="xs" />
                            ))}
                            <span className="text-[12px] text-[#737373]">· {post.dateLabel}</span>
                          </div>
                          <p className="mt-1 truncate text-[14px] font-semibold text-[#171717]">
                            {post.title}
                          </p>
                          <p className="mt-0.5 truncate text-[13px] text-[#737373]">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                        <StatusPill status={post.status} label={t.statuses[post.status]} />
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditPost(post)}
                            aria-label="Modifier"
                            className="inline-flex size-8 items-center justify-center rounded-lg text-[#737373] transition hover:bg-[#F2F2F2] hover:text-[#171717]"
                          >
                            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicatePost(post)}
                            aria-label="Dupliquer"
                            className="inline-flex size-8 items-center justify-center rounded-lg text-[#737373] transition hover:bg-[#F2F2F2] hover:text-[#171717]"
                          >
                            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                              <rect x="9" y="9" width="11" height="11" rx="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            aria-label="Supprimer"
                            className="inline-flex size-8 items-center justify-center rounded-lg text-[#737373] transition hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                          >
                            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Smart Generator Banner */}
              <div className="flex flex-col justify-between gap-4 rounded-xl bg-gradient-to-r from-[#071F18] via-[#0B3227] to-[#0E4133] p-5 text-white shadow-xs sm:flex-row sm:items-center">
                <div className="flex items-start gap-3.5">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#00B489]/20 text-[#5EEAD4] ring-1 ring-[#00B489]/40">
                    <SparkleSvg className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-[14px] font-semibold text-white">{t.aiBannerTitle}</h3>
                    <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-[#D1FAE5]/85">
                      {t.aiBannerDesc}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPostId(null);
                    setActiveTab("create");
                    handleGenerateAiPost();
                  }}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#00B489] px-4 text-[14px] font-medium text-white shadow-xs transition hover:bg-[#009E78]"
                >
                  <SparkleSvg className="size-4" />
                  {t.aiBannerBtn}
                </button>
              </div>

              {/* Consolidated Weekly Reach Chart */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-2xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-semibold text-[#171717]">{t.reachTitle}</h2>
                    <p className="mt-0.5 text-[13px] text-[#737373]">{t.reachSub}</p>
                  </div>
                  <span className="rounded-md border border-[#E5E5E5] bg-[#F8F8F8] px-2.5 py-1 text-[12px] font-medium text-[#525252]">
                    {t.reachPeriod}
                  </span>
                </div>

                <div className="mt-4">
                  <svg
                    viewBox={`0 0 ${chartPath.w} ${chartPath.h}`}
                    className="h-36 w-full overflow-visible"
                    role="img"
                    aria-label={t.reachTitle}
                  >
                    <defs>
                      <linearGradient id="socialReachGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00B489" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#00B489" stopOpacity="0.01" />
                      </linearGradient>
                    </defs>
                    <line x1="20" y1="30" x2={chartPath.w - 20} y2="30" stroke="#F0F0F0" strokeDasharray="3 3" />
                    <line x1="20" y1="74" x2={chartPath.w - 20} y2="74" stroke="#F0F0F0" strokeDasharray="3 3" />
                    <line x1="20" y1="118" x2={chartPath.w - 20} y2="118" stroke="#E5E5E5" />
                    <path d={chartPath.area} fill="url(#socialReachGrad)" />
                    <path d={chartPath.line} fill="none" stroke="#008F6D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {chartPath.coords.map((c) => (
                      <g key={c.label}>
                        <circle cx={c.x} cy={c.y} r="4" fill="#FFFFFF" stroke="#008F6D" strokeWidth="2.2" />
                      </g>
                    ))}
                  </svg>
                  <div className="mt-1 flex items-center justify-between px-1 text-[12px] text-[#737373]">
                    {REACH_POINTS.map((p) => (
                      <span key={p.label}>{p.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5 lg:col-span-4">
              {/* Mini Calendar */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-[#171717]">{t.calendarTitle}</span>
                    <svg viewBox="0 0 24 24" className="size-4 text-[#737373]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="17" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("calendar")}
                      aria-label="Mois précédent"
                      className="inline-flex size-7 items-center justify-center rounded-md text-[#737373] hover:bg-[#F5F5F5] hover:text-[#171717]"
                    >
                      &lsaquo;
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("calendar")}
                      aria-label="Mois suivant"
                      className="inline-flex size-7 items-center justify-center rounded-md text-[#737373] hover:bg-[#F5F5F5] hover:text-[#171717]"
                    >
                      &rsaquo;
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[12px] font-medium text-[#737373]">
                  {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                    <span key={i} className="py-1">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[13px]">
                  {[
                    { d: 24, muted: true },
                    { d: 25, muted: true },
                    { d: 26, muted: true },
                    { d: 27, muted: true },
                    { d: 28, muted: true },
                    { d: 1, muted: false },
                    { d: 2, muted: false },
                    ...Array.from({ length: 29 }, (_, i) => ({ d: i + 3, muted: false })),
                    { d: 1, muted: true },
                    { d: 2, muted: true },
                    { d: 3, muted: true },
                    { d: 4, muted: true },
                    { d: 5, muted: true },
                    { d: 6, muted: true },
                  ].map((cell, idx) => {
                    const isToday = !cell.muted && cell.d === 25;
                    const isSelected = !cell.muted && cell.d === selectedCalendarDay;
                    const hasScheduled = !cell.muted && scheduledDays.has(cell.d);
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={cell.muted}
                        onClick={() => setSelectedCalendarDay(cell.d)}
                        className={`relative flex h-8 flex-col items-center justify-center rounded-lg text-[13px] transition ${
                          cell.muted
                            ? "cursor-default text-[#D4D4D4]"
                            : isToday
                              ? "bg-[#171717] font-semibold text-white"
                              : isSelected
                                ? "border border-[#171717] bg-[#F5F5F5] font-semibold text-[#171717]"
                                : "text-[#404040] hover:bg-[#F5F5F5]"
                        }`}
                      >
                        <span>{cell.d}</span>
                        {hasScheduled && (
                          <span
                            className={`absolute bottom-1 size-1 rounded-full ${
                              isToday ? "bg-[#00B489]" : "bg-[#008F6D]"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center gap-4 border-t border-[#F0F0F0] pt-3 text-[12px] text-[#737373]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#008F6D]" />
                    {t.legendScheduled}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#171717]" />
                    {t.legendToday}
                  </span>
                </div>
              </div>

              {/* Connected Accounts */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-[#171717]">{t.accountsTitle}</h3>
                    <span className="size-2 rounded-full bg-[#00B489]" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("accounts")}
                    className="text-[13px] font-medium text-[#737373] hover:text-[#171717]"
                  >
                    {t.manageAccounts}
                  </button>
                </div>

                <div className="mt-3 space-y-2.5">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-[#F0F0F0] bg-[#FCFCFC] px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <PlatformBadge platform={acc.id} size="md" />
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-medium text-[#171717]">{acc.name}</p>
                          <p className="truncate text-[12px] text-[#737373]">{acc.handle}</p>
                        </div>
                      </div>
                      {acc.connected ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E6F5F0] px-2.5 py-0.5 text-[12px] font-medium text-[#00775B]">
                          <span className="size-1.5 rounded-full bg-[#008F6D]" />
                          {t.connected}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            toggleAccountConnection(acc.id);
                            notify(`${acc.name} connecté`);
                          }}
                          className="shrink-0 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-2.5 py-1 text-[12px] font-medium text-[#171717] transition hover:bg-[#F5F5F5]"
                        >
                          {t.connect}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
                <h3 className="text-[13px] font-medium text-[#737373]">{t.quickActions}</h3>
                <div className="mt-2.5 space-y-2">
                  {[
                    {
                      label: t.qaCreate,
                      onClick: () => setActiveTab("create"),
                      highlight: false,
                    },
                    {
                      label: t.qaGenerate,
                      onClick: () => {
                        setActiveTab("create");
                        handleGenerateAiPost();
                      },
                      highlight: true,
                    },
                    {
                      label: t.qaCalendar,
                      onClick: () => setActiveTab("calendar"),
                      highlight: false,
                    },
                    {
                      label: t.qaConnect,
                      onClick: () => setActiveTab("accounts"),
                      highlight: false,
                    },
                  ].map((qa) => (
                    <button
                      key={qa.label}
                      type="button"
                      onClick={qa.onClick}
                      className="flex w-full items-center justify-between rounded-lg border border-[#E5E5E5] bg-[#FCFCFC] px-3 py-2 text-left text-[13px] font-medium text-[#171717] transition hover:bg-[#F5F5F5]"
                    >
                      <span className="inline-flex items-center gap-2">
                        {qa.highlight ? (
                          <SparkleSvg className="size-3.5 text-[#008F6D]" />
                        ) : (
                          <span className="size-1.5 rounded-full bg-[#737373]" />
                        )}
                        {qa.label}
                      </span>
                      <span className="text-[#737373]">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CREATE POST */}
      {activeTab === "create" && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[13px] text-[#737373]">
                {t.breadcrumbRoot} <span className="mx-1 text-[#A3A3A3]">&gt;</span>{" "}
                <span className="text-[#404040]">{t.tabs.create}</span>
              </p>
              <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#171717]">
                {t.createTitle}
              </h1>
              <p className="mt-0.5 text-[14px] text-[#737373]">{t.createSubtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingPostId(null);
                  setActiveTab("overview");
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 text-[14px] font-medium text-[#525252] transition hover:bg-[#F8F8F8]"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => handleSubmitComposer("draft")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 text-[14px] font-medium text-[#171717] shadow-2xs transition hover:bg-[#F8F8F8]"
              >
                {t.saveDraft}
              </button>
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] px-3 text-[13px] font-medium text-[#404040] transition hover:bg-[#EFEFEF]"
              >
                {t.framingBadge}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left composer column */}
            <div className="space-y-4 lg:col-span-7">
              {/* Target platforms */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#525252]">{t.targetPlatforms}</span>
                  <span className="text-[12px] text-[#737373]">
                    {selectedPlatforms.length} {t.activeChannels}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  {(["linkedin", "instagram", "facebook"] as const).map((pf) => {
                    const checked = selectedPlatforms.includes(pf);
                    const label =
                      pf === "linkedin" ? "LinkedIn" : pf === "instagram" ? "Instagram" : "Facebook";
                    return (
                      <button
                        key={pf}
                        type="button"
                        onClick={() => togglePlatform(pf)}
                        className={`inline-flex h-10 items-center gap-2.5 rounded-lg border px-3 text-[14px] font-medium transition ${
                          checked
                            ? "border-[#171717] bg-[#FFFFFF] text-[#171717] shadow-2xs"
                            : "border-[#E5E5E5] bg-[#FCFCFC] text-[#737373]"
                        }`}
                      >
                        <PlatformBadge platform={pf} size="xs" />
                        <span>{label}</span>
                        <span
                          className={`inline-flex size-4 items-center justify-center rounded-[4px] border ${
                            checked
                              ? "border-[#171717] bg-[#171717] text-white"
                              : "border-[#D4D4D4] bg-white"
                          }`}
                        >
                          {checked && (
                            <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                              <path d="M3.5 8.5 6.5 11.5 12.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}
                  <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-dashed border-[#E5E5E5] bg-[#FAFAFA] px-3 text-[13px] text-[#A3A3A3]">
                    <PlatformBadge platform="tiktok" size="xs" />
                    <div className="leading-tight">
                      <p className="font-medium text-[#737373]">TikTok</p>
                      <p className="text-[12px]">{t.videoRequired}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Writing Assistant */}
              <div className="rounded-xl border border-[#B8E6D6] bg-[#F7FCFA] p-4 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#E6F5F0] text-[#008F6D]">
                      <SparkleSvg className="size-3.5" />
                    </span>
                    <span className="text-[14px] font-semibold text-[#171717]">{t.aiWriterTitle}</span>
                    <span className="rounded-md bg-[#E6F5F0] px-2 py-0.5 text-[12px] font-medium text-[#00775B]">
                      {t.aiWriterBadge}
                    </span>
                  </div>
                </div>

                <label className="mt-3 block text-[13px] text-[#525252]">{t.aiPromptLabel}</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 py-2 text-[14px] text-[#171717] outline-none transition focus:border-[#008F6D]"
                />

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[13px] text-[#525252]">{t.toneLabel}</span>
                  {(["commercial", "rse", "informative"] as ToneId[]).map((tid) => (
                    <button
                      key={tid}
                      type="button"
                      onClick={() => setTone(tid)}
                      className={`rounded-full px-3 py-1 text-[13px] font-medium transition ${
                        tone === tid
                          ? "bg-[#171717] text-white"
                          : "border border-[#E5E5E5] bg-[#FFFFFF] text-[#525252] hover:bg-[#F5F5F5]"
                      }`}
                    >
                      {t.tones[tid]}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateAiPost}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#00B489] px-4 text-[14px] font-medium text-white shadow-xs transition hover:bg-[#009E78]"
                  >
                    <SparkleSvg className="size-4" />
                    {t.generatePostBtn}
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#E1EFE9] pt-3">
                  <span className="mr-1 text-[12px] text-[#737373]">{t.adjustmentsLabel}</span>
                  {[
                    { id: "regen" as const, label: t.adjRegen },
                    { id: "shorten" as const, label: t.adjShorten },
                    { id: "expand" as const, label: t.adjExpand },
                    { id: "spell" as const, label: t.adjSpell },
                    { id: "hashtags" as const, label: t.adjHashtags },
                  ].map((adj) => (
                    <button
                      key={adj.id}
                      type="button"
                      onClick={() => handleQuickAdjust(adj.id)}
                      className="rounded-md border border-[#E5E5E5] bg-[#FFFFFF] px-2.5 py-1 text-[12px] font-medium text-[#404040] transition hover:bg-[#F5F5F5]"
                    >
                      {adj.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor & Media */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F0F0] pb-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        { id: "all", label: t.allSynced },
                        { id: "linkedin", label: "LinkedIn" },
                        { id: "instagram", label: "Instagram" },
                        { id: "facebook", label: "Facebook" },
                      ] as const
                    ).map((nt) => (
                      <button
                        key={nt.id}
                        type="button"
                        onClick={() => {
                          setComposerNetworkTab(nt.id);
                          if (nt.id !== "all") setPreviewPlatform(nt.id);
                        }}
                        className={`rounded-lg px-2.5 py-1 text-[13px] font-medium transition ${
                          composerNetworkTab === nt.id
                            ? "bg-[#F2F2F2] text-[#171717]"
                            : "text-[#737373] hover:text-[#171717]"
                        }`}
                      >
                        {nt.label}
                      </button>
                    ))}
                  </div>
                  <span className="font-mono text-[12px] text-[#737373]">
                    {activeEditorText.length} / 3000 car.
                  </span>
                </div>

                <textarea
                  value={activeEditorText}
                  onChange={(e) => updateActiveEditorText(e.target.value)}
                  rows={8}
                  className="mt-3 w-full resize-y rounded-lg border border-transparent bg-[#FCFCFC] p-2.5 text-[14px] leading-relaxed text-[#171717] outline-none transition focus:border-[#E5E5E5] focus:bg-[#FFFFFF]"
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0F0F0] pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaKind("team");
                        setMediaName("equipe_terrain_autocall_2025.jpg");
                      }}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-2.5 text-[13px] font-medium text-[#404040] hover:bg-[#F8F8F8]"
                    >
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <circle cx="8.5" cy="9.5" r="1.5" />
                        <path d="m21 15-5-5L5 20" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {t.addImage}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaKind("audit");
                        setMediaName("visite_controle_qualite.mp4");
                      }}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-2.5 text-[13px] font-medium text-[#404040] hover:bg-[#F8F8F8]"
                    >
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <rect x="2" y="5" width="14" height="14" rx="2" />
                        <path d="m16 10 6-3v10l-6-3Z" strokeLinejoin="round" />
                      </svg>
                      {t.addVideo}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaKind("office");
                        setMediaName("bureau_clean_premium_spring_2025.jpg");
                        notify(locale === "fr" ? "Visuel IA généré" : "AI visual generated");
                      }}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#B8E6D6] bg-[#E6F5F0] px-2.5 text-[13px] font-medium text-[#00775B] hover:bg-[#D5EFE6]"
                    >
                      <SparkleSvg className="size-3.5" />
                      {t.genVisualAi}
                    </button>
                  </div>
                  <span className="text-[12px] text-[#737373]">{t.oneMedia}</span>
                </div>

                {/* Attached media card */}
                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-[#E5E5E5] bg-[#FCFCFC] p-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <MediaIllustration kind={mediaKind} className="h-10 w-14 rounded-md" />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[#171717]">{mediaName}</p>
                      <p className="text-[12px] text-[#737373]">1200 × 628 px · 1,4 Mo · {t.mediaValidated}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setMediaKind((prev) =>
                        prev === "office" ? "team" : prev === "team" ? "audit" : "office"
                      )
                    }
                    aria-label="Changer le visuel"
                    className="inline-flex size-8 items-center justify-center rounded-lg text-[#737373] hover:bg-[#EFEFEF] hover:text-[#171717]"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Publishing options */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[14px] font-semibold text-[#171717]">{t.publishOptions}</span>
                  <span className="rounded-full bg-[#E6F5F0] px-2.5 py-0.5 text-[12px] font-medium text-[#00775B]">
                    {t.recommendedSlot}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {(
                    [
                      { id: "now", title: t.modeNow, sub: t.modeNowSub },
                      { id: "schedule", title: t.modeSchedule, sub: t.modeScheduleSub },
                      { id: "draft", title: t.modeDraft, sub: t.modeDraftSub },
                    ] as const
                  ).map((m) => {
                    const selected = publishMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPublishMode(m.id)}
                        className={`rounded-xl border p-3 text-left transition ${
                          selected
                            ? "border-[#171717] bg-[#FFFFFF] shadow-2xs"
                            : "border-[#E5E5E5] bg-[#FCFCFC] hover:bg-[#FFFFFF]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex size-4 items-center justify-center rounded-full border ${
                              selected ? "border-[#171717]" : "border-[#D4D4D4]"
                            }`}
                          >
                            {selected && <span className="size-2 rounded-full bg-[#171717]" />}
                          </span>
                          <span className="text-[14px] font-medium text-[#171717]">{m.title}</span>
                        </div>
                        <p className="mt-1 pl-6 text-[12px] text-[#737373]">{m.sub}</p>
                      </button>
                    );
                  })}
                </div>

                {publishMode === "schedule" && (
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-[12px] font-medium text-[#737373]">{t.publishDate}</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[14px] text-[#171717] outline-none focus:border-[#171717]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#737373]">{t.publishTime}</label>
                      <PremiumSelect
                        value={scheduleTime}
                        onChange={setScheduleTime}
                        options={[
                          { value: "08:30", label: "08:30" },
                          { value: "09:00", label: "09:00" },
                          { value: "12:15", label: "12:15" },
                          { value: "14:00", label: "14:00" },
                          { value: "18:00", label: "18:00" },
                        ]}
                        ariaLabel={t.publishTime}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#737373]">{t.timezone}</label>
                      <PremiumSelect
                        value={timezone}
                        onChange={setTimezone}
                        options={[
                          { value: "Europe/Paris", label: "Europe/Paris (UTC+1)" },
                          { value: "Europe/London", label: "Europe/London (UTC+0)" },
                          { value: "America/New_York", label: "New York (UTC-5)" },
                        ]}
                        ariaLabel={t.timezone}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-3 border-t border-[#F0F0F0] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-[#171717]">{t.readyToSchedule}</p>
                    <p className="text-[12px] text-[#737373]">{t.readyToScheduleSub}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmitComposer()}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 text-[14px] font-medium text-white shadow-xs transition hover:bg-[#262626]"
                  >
                    {publishMode === "now"
                      ? t.publishNowCta
                      : publishMode === "draft"
                        ? t.saveDraftCta
                        : `${t.scheduleCta} ${scheduledDayLabel}`}
                  </button>
                </div>
              </div>
            </div>

            {/* Right preview column */}
            <div className="space-y-4 lg:col-span-5">
              {/* Live preview card */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F0F0] pb-3">
                  <div className="flex items-center gap-1.5">
                    {(
                      [
                        { id: "linkedin", label: "LinkedIn" },
                        { id: "instagram", label: "Instagram Feed" },
                        { id: "facebook", label: "Facebook" },
                      ] as const
                    ).map((pt) => (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => setPreviewPlatform(pt.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-medium transition ${
                          previewPlatform === pt.id
                            ? "bg-[#171717] text-white"
                            : "text-[#525252] hover:bg-[#F5F5F5]"
                        }`}
                      >
                        {previewPlatform === pt.id && (
                          <span className="size-1.5 rounded-full bg-[#00B489]" />
                        )}
                        {pt.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[12px] font-medium text-[#737373]">{t.livePreview}</span>
                </div>

                {/* Simulated social card */}
                <div className="mt-4 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#EFEFEF] text-[14px] font-bold text-[#171717]">
                        AC
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-[#171717]">
                          AutoCall Facility &amp; Propreté
                        </p>
                        <p className="text-[12px] text-[#737373]">
                          3 840 abonnés · {previewPlatform === "instagram" ? "@autocall_app" : "Services aux entreprises"}
                        </p>
                        <p className="text-[12px] text-[#737373]">
                          {publishMode === "schedule" ? `Programmé pour ${scheduledDayLabel}` : "Aperçu en direct"}
                        </p>
                      </div>
                    </div>
                    <PlatformBadge platform={previewPlatform} size="xs" />
                  </div>

                  <div className="mt-3 whitespace-pre-line text-[13.5px] leading-relaxed text-[#262626]">
                    {previewText}
                  </div>

                  <div className="mt-3 overflow-hidden rounded-lg border border-[#E5E5E5]">
                    <MediaIllustration kind={mediaKind} className="h-44 w-full rounded-none border-0" />
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#F0F0F0] pt-2.5 text-[12px] text-[#737373]">
                    <span>AutoCall et 42 autres</span>
                    <span>8 commentaires · 3 partages</span>
                  </div>

                  <div className="mt-2 grid grid-cols-4 gap-1 border-t border-[#F0F0F0] pt-2 text-center text-[13px] font-medium text-[#525252]">
                    <span className="rounded-md py-1 hover:bg-[#F8F8F8]">J’aime</span>
                    <span className="rounded-md py-1 hover:bg-[#F8F8F8]">Commenter</span>
                    <span className="rounded-md py-1 hover:bg-[#F8F8F8]">Republier</span>
                    <span className="rounded-md py-1 hover:bg-[#F8F8F8]">Envoyer</span>
                  </div>
                </div>
              </div>

              {/* AI Performance Prediction */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[#171717]">{t.aiScoreTitle}</span>
                  <span className="rounded-full bg-[#E6F5F0] px-2.5 py-0.5 text-[12px] font-semibold text-[#00775B]">
                    {t.aiScoreBadge}
                  </span>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#EFEFEF]">
                  <div className="h-full w-[88%] rounded-full bg-[#00B489]" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  <div className="rounded-lg border border-[#F0F0F0] bg-[#FCFCFC] p-2.5 text-center">
                    <p className="text-[15px] font-bold text-[#171717]">~1,8k</p>
                    <p className="mt-0.5 text-[12px] text-[#737373]">{t.estImpressions}</p>
                  </div>
                  <div className="rounded-lg border border-[#F0F0F0] bg-[#FCFCFC] p-2.5 text-center">
                    <p className="text-[15px] font-bold text-[#171717]">4,2 %</p>
                    <p className="mt-0.5 text-[12px] text-[#737373]">{t.estEngagement}</p>
                  </div>
                  <div className="rounded-lg border border-[#F0F0F0] bg-[#FCFCFC] p-2.5 text-center">
                    <p className="text-[15px] font-bold text-[#171717]">12–18</p>
                    <p className="mt-0.5 text-[12px] text-[#737373]">{t.estClicks}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CALENDAR */}
      {activeTab === "calendar" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[22px] font-bold text-[#171717]">Planification éditoriale</h1>
              <p className="mt-0.5 text-[14px] text-[#737373]">
                Visualisez et réorganisez vos créneaux éditoriaux sur l’ensemble du mois.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className="inline-flex h-9 items-center rounded-lg bg-[#171717] px-4 text-[14px] font-medium text-white hover:bg-[#262626]"
            >
              {t.newPostBtn}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2">Mois<input type="month" value={calendarMonth} onChange={(event) => { if (event.target.value) { setCalendarMonth(event.target.value); setSelectedCalendarDay(1); } }} className="rounded-lg border border-[var(--border)] px-2 py-1" /></label>
            <label className="flex items-center gap-2">Vue<select value={calendarView} onChange={(event) => setCalendarView(event.target.value as typeof calendarView)} className="rounded-lg border border-[var(--border)] px-2 py-1"><option value="month">Mois</option><option value="week">Semaine</option><option value="list">Liste</option></select></label>
            <label className="flex items-center gap-2">Réseau<select value={calendarNetwork} onChange={(event) => setCalendarNetwork(event.target.value as typeof calendarNetwork)} className="rounded-lg border border-[var(--border)] px-2 py-1"><option value="all">Tous</option><option value="linkedin">LinkedIn</option><option value="instagram">Instagram</option><option value="facebook">Facebook</option></select></label>
            {calendarView === "week" && <label className="flex items-center gap-2">Jour de la semaine affichée<select value={Math.min(selectedCalendarDay, daysInMonth)} onChange={(event) => setSelectedCalendarDay(Number(event.target.value))} className="rounded-lg border border-[var(--border)] px-2 py-1">{Array.from({ length: daysInMonth }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select></label>}
          </div>
          {calendarView === "list" ? (
            <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              {[...calendarPosts].sort((a, b) => (getPostDate(a) + a.time).localeCompare(getPostDate(b) + b.time)).map((post) => <button type="button" key={post.id} onClick={() => handleEditPost(post)} className="flex w-full flex-wrap justify-between gap-2 px-4 py-3 text-left text-sm hover:bg-[var(--surface-hover)]"><span className="font-medium">{post.title}</span><span>{post.dateLabel}</span></button>)}
              {!calendarPosts.length && <p className="p-4 text-sm">Aucune publication pour ce mois et ce réseau.</p>}
            </div>
          ) : (
          <div className="overflow-x-auto rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-2xs">
            <div className="min-w-[42rem]">
            <div className="grid grid-cols-7 border-b border-[#E5E5E5] bg-[#FAFAFA] text-center text-[13px] font-medium text-[#525252]">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                <div key={d} className="border-r border-[#F0F0F0] py-2.5 last:border-r-0">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: calendarView === "week" ? 7 : Math.ceil((monthOffset + daysInMonth) / 7) * 7 }, (_, idx) => {
                const dayNum = calendarView === "week" ? weekStart + idx : idx - monthOffset + 1;
                const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
                const dayPosts = inMonth ? calendarPosts.filter((post) => post.dayOfMonth === dayNum) : [];
                return (
                  <div
                    key={idx}
                    className={`min-h-[104px] border-r border-b border-[#F0F0F0] p-2 ${
                      inMonth ? "bg-[#FFFFFF]" : "bg-[#FAFAFA] text-[#D4D4D4]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {inMonth && <button
                        type="button"
                        onClick={() => setSelectedCalendarDay(dayNum)}
                        className={`inline-flex size-6 items-center justify-center rounded-full text-[13px] font-medium ${
                          dayNum === selectedCalendarDay
                            ? "bg-[#171717] text-white"
                            : inMonth
                              ? "text-[#404040]"
                              : "text-[#D4D4D4]"
                        }`}
                      >
                        {dayNum}
                      </button>}
                    </div>
                    <div className="mt-1.5 space-y-1">
                      {dayPosts.map((dp) => (
                        <button
                          key={dp.id}
                          type="button"
                          onClick={() => handleEditPost(dp)}
                          className="flex w-full items-center gap-1.5 rounded-md border border-[#E5E5E5] bg-[#F8F8F8] px-1.5 py-1 text-left text-[12px] font-medium text-[#171717] transition hover:border-[#008F6D] hover:bg-[#E6F5F0]"
                        >
                          <PlatformBadge platform={dp.platforms[0]} size="xs" />
                          <span className="truncate">{dp.time} · {dp.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* TAB 4: POSTS LIST */}
      {activeTab === "posts" && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[13px] text-[#737373]">
                {t.breadcrumbRoot} <span className="mx-1 text-[#A3A3A3]">&gt;</span>{" "}
                <span className="text-[#404040]">{t.tabs.posts}</span>
              </p>
              <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#171717]">
                {t.tabs.posts}
              </h1>
              <p className="mt-0.5 text-[14px] text-[#737373]">
                Centralisez, filtrez et suivez les performances de tous vos contenus photo et rédactionnels diffusés ou programmés sur vos comptes professionnels.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setActiveTab("accounts")} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">{t.tabs.accounts}</button>
              <button
                type="button"
                onClick={() => downloadCsv("autocall-publications.csv", [["Publication", "Réseaux", "Statut", "Date"], ...filteredPosts.map((post) => [post.title, post.platforms.join(", "), t.statuses[post.status], post.dateLabel])])}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 text-[14px] font-medium text-[#171717] shadow-2xs transition hover:bg-[#F8F8F8]"
              >
                <svg viewBox="0 0 24 24" className="size-4 text-[#525252]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Exporter CSV
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("create")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 text-[14px] font-medium text-[#171717] shadow-2xs transition hover:bg-[#F8F8F8]"
              >
                <svg viewBox="0 0 24 24" className="size-4 text-[#525252]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                </svg>
                Planifier en masse
              </button>
            </div>
          </div>

          {/* 4 KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
              <div className="flex items-start justify-between">
                <span className="text-[13px] font-medium text-[#737373]">Impressions cumulées</span>
                <span className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] text-[#525252]">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[26px] font-bold tracking-tight text-[#171717]">48,2k</span>
                <span className="rounded-full bg-[#E6F5F0] px-2 py-0.5 text-[12px] font-medium text-[#00775B]">
                  +16,4 %
                </span>
              </div>
              <p className="mt-2 text-[12px] text-[#737373]">vs 30 jours précédents (41,4k)</p>
            </div>

            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
              <div className="flex items-start justify-between">
                <span className="text-[13px] font-medium text-[#737373]">Taux d’engagement moyen</span>
                <span className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] text-[#525252]">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 20.5s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[26px] font-bold tracking-tight text-[#171717]">4,6 %</span>
                <span className="rounded-full bg-[#E6F5F0] px-2 py-0.5 text-[12px] font-medium text-[#00775B]">
                  +0,8 pt
                </span>
              </div>
              <p className="mt-2 text-[12px] text-[#737373]">Benchmark B2B SaaS standard : 2,9 %</p>
            </div>

            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
              <div className="flex items-start justify-between">
                <span className="text-[13px] font-medium text-[#737373]">Clics sortants (Site / Démo)</span>
                <span className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] text-[#525252]">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M14 4h6v6M10 14 20 4M20 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="text-[26px] font-bold tracking-tight text-[#171717]">412</span>
                <span className="text-[12px] font-medium text-[#525252]">0,85 % CTR</span>
              </div>
              <p className="mt-2 text-[12px] text-[#737373]">18 RDV téléphoniques générés</p>
            </div>

            <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
              <div className="flex items-start justify-between">
                <span className="text-[13px] font-medium text-[#737373]">Diffusion API directes</span>
                <span className="inline-flex size-8 items-center justify-center rounded-lg border border-[#B8E6D6] bg-[#E6F5F0] text-[#00775B]">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[26px] font-bold tracking-tight text-[#171717]">100 %</span>
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#00775B]">
                  <span className="size-1.5 rounded-full bg-[#00B489]" />
                  24/24 synchro
                </span>
              </div>
              <p className="mt-2 text-[12px] text-[#737373]">Aucun échec de jeton d’authentification</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="space-y-3 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-3.5 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: "all", label: "Toutes", count: posts.length },
                  {
                    id: "published",
                    label: "Publiées",
                    count: posts.filter((p) => p.status === "published").length,
                  },
                  {
                    id: "scheduled",
                    label: "Programmées",
                    count: posts.filter(
                      (p) => p.status === "scheduled" || p.status === "ready" || p.status === "review"
                    ).length,
                  },
                  {
                    id: "draft",
                    label: "Brouillons",
                    count: posts.filter((p) => p.status === "draft").length,
                  },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setPostsFilter(st.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
                    postsFilter === st.id
                      ? "bg-[#171717] text-white"
                      : "border border-[#E5E5E5] bg-[#FFFFFF] text-[#525252] hover:bg-[#F8F8F8]"
                  }`}
                >
                  <span>{st.label}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[12px] ${
                      postsFilter === st.id
                        ? "bg-white/15 text-white"
                        : "bg-[#F2F2F2] text-[#737373]"
                    }`}
                  >
                    {st.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <input
                type="search"
                value={postsSearch}
                onChange={(e) => setPostsSearch(e.target.value)}
                placeholder="Rechercher par mot-clé, accroche ou sujet..."
                className="h-9 flex-1 rounded-lg border border-[#E5E5E5] bg-[#FCFCFC] px-3 text-[14px] text-[#171717] outline-none focus:border-[#171717]"
              />
              <PremiumSelect
                value={period}
                onChange={setPeriod}
                options={[
                  { value: "mar-2025", label: "30 derniers jours" },
                  { value: "q1-2025", label: "Trimestre en cours" },
                ]}
                ariaLabel="Période"
                className="sm:w-48"
              />
            </div>
          </div>

          {/* 2-column content: Table + Right Analytics Sidebar */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-2xs lg:col-span-8">
              <div className="flex items-center justify-between border-b border-[#F0F0F0] bg-[#FAFAFA] px-4 py-2.5 text-[13px] text-[#737373]">
                <span>{filteredPosts.length} publications affichées</span>
                <span>Page 1 sur 1</span>
              </div>

              <div className="divide-y divide-[#F0F0F0]">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col gap-3 p-4 transition hover:bg-[#FCFCFC] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3.5">
                      <MediaIllustration kind={post.mediaKind} className="size-14 rounded-lg" />
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-semibold text-[#171717]">
                          {post.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[13px] text-[#737373]">
                          {post.excerpt}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-md bg-[#E6F5F0] px-2 py-0.5 text-[12px] font-medium text-[#00775B]">
                            IA AutoCall
                          </span>
                          <span className="rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[12px] text-[#525252]">
                            #B2B
                          </span>
                          <span className="rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[12px] text-[#525252]">
                            #Facility
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center gap-1">
                        {post.platforms.map((pf) => (
                          <PlatformBadge key={pf} platform={pf} size="xs" />
                        ))}
                      </div>
                      <div className="text-right">
                        <StatusPill status={post.status} label={t.statuses[post.status]} />
                        <p className="mt-1 text-[12px] text-[#737373]">{post.dateLabel}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEditPost(post)}
                        className="rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 py-1.5 text-[13px] font-medium text-[#171717] hover:bg-[#F5F5F5]"
                      >
                        Éditer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4 lg:col-span-4">
              {/* Channel Breakdown */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-[#171717]">Ventilation canaux</h3>
                  <span className="text-[12px] text-[#737373]">30 j</span>
                </div>
                <div className="mt-3.5 space-y-3">
                  {[
                    { name: "LinkedIn B2B", impr: "29,8k impr.", pct: "62 %", width: "w-[62%]", color: "bg-[#0A66C2]" },
                    { name: "Instagram Pro", impr: "12,1k impr.", pct: "25 %", width: "w-[25%]", color: "bg-[#DD2A7B]" },
                    { name: "Facebook Pages", impr: "6,3k impr.", pct: "13 %", width: "w-[13%]", color: "bg-[#1877F2]" },
                  ].map((ch) => (
                    <div key={ch.name}>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="font-medium text-[#171717]">{ch.name}</span>
                        <span className="text-[#737373]">
                          {ch.impr} <strong className="text-[#171717]">{ch.pct}</strong>
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#EFEFEF]">
                        <div className={`h-full rounded-full ${ch.width} ${ch.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] p-3 text-[12.5px] leading-relaxed text-[#525252]">
                  <strong className="text-[#171717]">Recommandation IA :</strong> Le créneau LinkedIn génère un taux de conversion vers les démonstrations vocales 3,2x supérieur aux autres flux.
                </div>
              </div>

              {/* Optimal Slots */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-[#171717]">Créneaux optimaux</h3>
                  <span className="rounded-md bg-[#E6F5F0] px-2 py-0.5 text-[12px] font-medium text-[#00775B]">
                    Algorithme V2
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    { day: "Mardi", slot: "08h45 – 09h30", boost: "+28 % impact" },
                    { day: "Jeudi", slot: "11h30 – 12h15", boost: "+34 % clics" },
                    { day: "Vendredi", slot: "14h00 – 15h00", boost: "+12 % partages" },
                  ].map((s) => (
                    <div
                      key={s.day}
                      className="flex items-center justify-between rounded-lg border border-[#F0F0F0] bg-[#FCFCFC] px-3 py-2"
                    >
                      <div>
                        <p className="text-[12px] font-semibold text-[#737373]">{s.day}</p>
                        <p className="text-[13.5px] font-medium text-[#171717]">{s.slot}</p>
                      </div>
                      <span className="rounded-md bg-[#E6F5F0] px-2 py-1 text-[12px] font-medium text-[#00775B]">
                        {s.boost}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dark AI Callout */}
              <div className="rounded-xl bg-[#171717] p-4 text-white shadow-xs">
                <div className="flex items-center gap-2 text-[#5EEAD4]">
                  <SparkleSvg className="size-4" />
                  <span className="text-[13.5px] font-semibold text-white">Générateur AutoCall IA</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#D4D4D4]">
                  Transformez un compte-rendu d’appel ou un rapport de conversion en 3 publications optimisées avec visuels B2B.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("create");
                    handleGenerateAiPost();
                  }}
                  className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#00B489] px-3 text-[13.5px] font-medium text-white transition hover:bg-[#009E78]"
                >
                  <SparkleSvg className="size-3.5" />
                  Rédiger depuis un appel client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONNECTED ACCOUNTS */}
      {activeTab === "accounts" && (
        <div className="space-y-4">
          <div>
            <h1 className="text-[22px] font-bold text-[#171717]">{t.tabs.accounts}</h1>
            <p className="mt-0.5 text-[14px] text-[#737373]">
              Gérez vos jetons OAuth, la synchronisation automatique et les pages autorisées.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <PlatformBadge platform={acc.id} size="md" />
                    <div>
                      <p className="text-[15px] font-semibold text-[#171717]">{acc.name}</p>
                      <p className="text-[13px] text-[#737373]">
                        {acc.handle} · {acc.typeLabel}
                      </p>
                    </div>
                  </div>
                  {acc.connected ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F5F0] px-2.5 py-0.5 text-[12px] font-medium text-[#00775B]">
                      <span className="size-1.5 rounded-full bg-[#008F6D]" />
                      {t.connected}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#F5F5F5] px-2.5 py-0.5 text-[12px] font-medium text-[#737373]">
                      {t.notConfigured}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-lg bg-[#F8F8F8] p-3 text-[13px]">
                  <div>
                    <span className="text-[#737373]">Audience</span>
                    <p className="mt-0.5 font-semibold text-[#171717]">{acc.followers}</p>
                  </div>
                  <div>
                    <span className="text-[#737373]">Dernière synchro</span>
                    <p className="mt-0.5 font-semibold text-[#171717]">{acc.lastSync}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-3">
                  <span className="text-[13px] text-[#525252]">
                    {acc.connected ? "Publication automatique autorisée" : "Connexion requise pour publier"}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAccountConnection(acc.id)}
                    className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition ${
                      acc.connected
                        ? "border border-[#E5E5E5] bg-[#FFFFFF] text-[#525252] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                        : "bg-[#171717] text-white hover:bg-[#262626]"
                    }`}
                  >
                    {acc.connected ? t.disconnect : t.connect}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand Communication Profile Drawer/Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-xl">
            <h3 className="text-[16px] font-bold text-[#171717]">{t.brandProfileBtn}</h3>
            <p className="mt-1 text-[13px] text-[#737373]">
              Ce cadrage oriente les suggestions de l’assistant rédactionnel AutoCall IA.
            </p>
            <label className="mt-4 block text-[13px] font-medium text-[#525252]">
              Secteur et positionnement
            </label>
            <input
              type="text"
              value={brandSector}
              onChange={(e) => setBrandSector(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-[14px] text-[#171717] outline-none focus:border-[#171717]"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="h-9 rounded-lg border border-[#E5E5E5] px-3.5 text-[14px] font-medium text-[#525252] hover:bg-[#F5F5F5]"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileModalOpen(false);
                  notify("Profil de communication mis à jour");
                }}
                className="h-9 rounded-lg bg-[#171717] px-4 text-[14px] font-medium text-white hover:bg-[#262626]"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

