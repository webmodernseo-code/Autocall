"use client";

import { useMemo, useState } from "react";
import { HubSpotBrandSvg } from "../brand-icons";
import { PremiumSelect } from "../premium-select";
import { type Locale, type NavIconName, SolarIcon } from "../workspace-navigation";
import { type SuperAdminSectionNavTarget } from "./super-admin-overview";

// ---------------------------------------------------------------------------
// 01. ONBOARDING — Tunnel d'activation & Première valeur obtenue
// ---------------------------------------------------------------------------

interface FunnelStageRecord {
  id: string;
  stepNumber: string;
  label: string;
  companiesCount: number;
  ratePct: number;
  dropNote: string;
}

const ONBOARDING_FUNNEL_STAGES: FunnelStageRecord[] = [
  {
    id: "fn-1",
    stepNumber: "01",
    label: "Inscription",
    companiesCount: 120,
    ratePct: 100,
    dropNote: "Création du compte Propriétaire et vérification e-mail.",
  },
  {
    id: "fn-2",
    stepNumber: "02",
    label: "Entreprise configurée",
    companiesCount: 108,
    ratePct: 90,
    dropNote: "12 comptes n’ont pas encore renseigné leurs horaires ou secteur.",
  },
  {
    id: "fn-3",
    stepNumber: "03",
    label: "Outils nécessaires connectés",
    companiesCount: 96,
    ratePct: 80,
    dropNote: "12 entreprises bloquées à l’étape numéro de téléphone ou agenda.",
  },
  {
    id: "fn-4",
    stepNumber: "04",
    label: "Agent IA configuré",
    companiesCount: 86,
    ratePct: 72,
    dropNote: "10 entreprises ont choisi un modèle sans finaliser ses consignes.",
  },
  {
    id: "fn-5",
    stepNumber: "05",
    label: "Onboarding terminé",
    companiesCount: 78,
    ratePct: 65,
    dropNote: "8 agents prêts mais non encore mis en service sur un flux réel.",
  },
  {
    id: "fn-6",
    stepNumber: "06",
    label: "Première valeur obtenue",
    companiesCount: 58,
    ratePct: 48,
    dropNote: "Appel récupéré, prospect qualifié ou rendez-vous effectivement confirmé.",
  },
];

// ---------------------------------------------------------------------------
// 02. FONCTIONNALITÉS — Adoption sur les 30 derniers jours
// ---------------------------------------------------------------------------

interface FeatureAdoptionRecord {
  id: string;
  name: string;
  icon: NavIconName;
  adoptionPct: number;
  eligibleTenants: number;
  activeTenants: number;
  productInsight: string;
  statusTag: "Socle fort" | "Croissance" | "À investiguer";
}

const FEATURE_ADOPTION_LIST: FeatureAdoptionRecord[] = [
  {
    id: "ft-comm",
    name: "Communications",
    icon: "conversations",
    adoptionPct: 86,
    eligibleTenants: 216,
    activeTenants: 186,
    productInsight: "Consultation quotidienne des appels, résumés IA et transcriptions.",
    statusTag: "Socle fort",
  },
  {
    id: "ft-crm",
    name: "CRM",
    icon: "crm",
    adoptionPct: 78,
    eligibleTenants: 216,
    activeTenants: 168,
    productInsight: "Fiches contacts enrichies automatiquement après chaque interaction.",
    statusTag: "Socle fort",
  },
  {
    id: "ft-agents",
    name: "Agents IA",
    icon: "agents",
    adoptionPct: 72,
    eligibleTenants: 216,
    activeTenants: 156,
    productInsight: "156 entreprises ont au moins un agent vocal actif en réception ou relance.",
    statusTag: "Socle fort",
  },
  {
    id: "ft-acq",
    name: "Acquisition",
    icon: "acquisition",
    adoptionPct: 58,
    eligibleTenants: 182,
    activeTenants: 106,
    productInsight: "Forte adoption chez les offres Pro et Business orientées prospection B2B.",
    statusTag: "Croissance",
  },
  {
    id: "ft-camp",
    name: "Campagnes",
    icon: "campaigns",
    adoptionPct: 42,
    eligibleTenants: 182,
    activeTenants: 76,
    productInsight: "Utilisé principalement pour les relances de devis et rappels clients.",
    statusTag: "Croissance",
  },
  {
    id: "ft-rdv",
    name: "Rendez-vous",
    icon: "bell",
    adoptionPct: 39,
    eligibleTenants: 216,
    activeTenants: 84,
    productInsight: "Frein principal identifié : étape d’autorisation OAuth agenda externe.",
    statusTag: "Croissance",
  },
  {
    id: "ft-auto",
    name: "Automatisations",
    icon: "automation",
    adoptionPct: 28,
    eligibleTenants: 182,
    activeTenants: 51,
    productInsight: "Besoin de modèles d’automatisation prêts à l’emploi (SMS post-appel).",
    statusTag: "À investiguer",
  },
  {
    id: "ft-social",
    name: "Réseaux sociaux",
    icon: "social",
    adoptionPct: 16,
    eligibleTenants: 216,
    activeTenants: 35,
    productInsight:
      "À diagnostiquer : fonctionnalité secondaire pour les métiers purement téléphoniques ou visibilité insuffisante dans l’onboarding.",
    statusTag: "À investiguer",
  },
];

// ---------------------------------------------------------------------------
// 03. RÉTENTION — Analyse par cohorte mensuelle (Utilisation vs Abonnement payant)
// ---------------------------------------------------------------------------

interface CohortRowRecord {
  cohort: string;
  clients: number;
  usageRetention: (number | null)[];
  paidRetention: (number | null)[];
}

const COHORT_RETENTION_DATA: CohortRowRecord[] = [
  {
    cohort: "Juillet",
    clients: 42,
    usageRetention: [100, 88, 81, 76, 72],
    paidRetention: [100, 95, 90, 86, 83],
  },
  {
    cohort: "Août",
    clients: 58,
    usageRetention: [100, 91, 84, 78, null],
    paidRetention: [100, 96, 91, 88, null],
  },
  {
    cohort: "Sept.",
    clients: 75,
    usageRetention: [100, 93, 87, null, null],
    paidRetention: [100, 97, 92, null, null],
  },
  {
    cohort: "Oct.",
    clients: 96,
    usageRetention: [100, 94, null, null, null],
    paidRetention: [100, 98, null, null, null],
  },
  {
    cohort: "Nov.",
    clients: 120,
    usageRetention: [100, null, null, null, null],
    paidRetention: [100, null, null, null, null],
  },
];

// ---------------------------------------------------------------------------
// 04. SANTÉ DES ENTREPRISES — Health Score explicable sur 100 points
// ---------------------------------------------------------------------------

type HealthBand = "Bonne santé" | "À accompagner" | "À risque";

interface CompanyHealthRecord {
  id: string;
  companyName: string;
  plan: "Starter" | "Pro" | "Business";
  score: number;
  band: HealthBand;
  observation: string;
  primaryGoal: string;
  breakdown: {
    onboardingPts: number; // /20
    regularityPts: number; // /20
    relevantFeaturesPts: number; // /20
    outcomesPts: number; // /25
    noBlockersPts: number; // /15
  };
  recommendedAction: string;
}

const INITIAL_COMPANY_HEALTH: CompanyHealthRecord[] = [
  {
    id: "hl-nova",
    companyName: "Nova Services",
    plan: "Pro",
    score: 94,
    band: "Bonne santé",
    observation: "Utilisation régulière",
    primaryGoal: "Accueil téléphonique 24/7 & prise de rendez-vous",
    breakdown: {
      onboardingPts: 20,
      regularityPts: 20,
      relevantFeaturesPts: 19,
      outcomesPts: 23,
      noBlockersPts: 12,
    },
    recommendedAction:
      "Aucune relance intrusive — vérifier uniquement la résolution du ticket ponctuel TK-1042.",
  },
  {
    id: "hl-atlas",
    companyName: "Atlas Immobilier",
    plan: "Business",
    score: 88,
    band: "Bonne santé",
    observation: "Agents actifs",
    primaryGoal: "Qualification de prospects acquéreurs & visites",
    breakdown: {
      onboardingPts: 20,
      regularityPts: 18,
      relevantFeaturesPts: 18,
      outcomesPts: 21,
      noBlockersPts: 11,
    },
    recommendedAction:
      "Client très engagé sur Téléphonie + CRM (non pénalisé par la non-utilisation du Social Studio).",
  },
  {
    id: "hl-clean",
    companyName: "Clean Studio",
    plan: "Starter",
    score: 62,
    band: "À accompagner",
    observation: "Configuration incomplète",
    primaryGoal: "Récupération des appels manqués",
    breakdown: {
      onboardingPts: 13,
      regularityPts: 14,
      relevantFeaturesPts: 14,
      outcomesPts: 12,
      noBlockersPts: 9,
    },
    recommendedAction:
      "Proposer un tutoriel court pour finaliser le renvoi d’appel sur horaires fermés.",
  },
  {
    id: "hl-mondo",
    companyName: "Mondo Services",
    plan: "Pro",
    score: 28,
    band: "À risque",
    observation: "Baisse significative d’activité",
    primaryGoal: "Campagnes sortantes & qualification",
    breakdown: {
      onboardingPts: 16,
      regularityPts: 4,
      relevantFeaturesPts: 5,
      outcomesPts: 3,
      noBlockersPts: 0,
    },
    recommendedAction:
      "Organiser un point d’accompagnement humain pour comprendre la chute d’usage avant renouvellement.",
  },
  {
    id: "hl-horizon",
    companyName: "Studio Horizon",
    plan: "Pro",
    score: 15,
    band: "À risque",
    observation: "Aucune première valeur détectée",
    primaryGoal: "Accueil omnicanal & WhatsApp",
    breakdown: {
      onboardingPts: 8,
      regularityPts: 3,
      relevantFeaturesPts: 2,
      outcomesPts: 0,
      noBlockersPts: 2,
    },
    recommendedAction:
      "Débloquer la connexion WhatsApp (TK-1038) et guider vers un premier appel test réussi.",
  },
];

// ---------------------------------------------------------------------------
// 05. FEEDBACK — Demandes clients catégorisées (Non constitutives d'une roadmap engagée)
// ---------------------------------------------------------------------------

type FeedbackCategory =
  | "Nouvelles fonctionnalités"
  | "Demandes d’intégrations"
  | "Suggestions"
  | "Problèmes d’ergonomie"
  | "Retours positifs";

interface ProductFeedbackItem {
  id: string;
  votes: number;
  title: string;
  category: FeedbackCategory;
  status: "À étudier" | "En analyse";
  summary: string;
  brandIcon?: "hubspot";
}

const INITIAL_FEEDBACK_ITEMS: ProductFeedbackItem[] = [
  {
    id: "fb-1",
    votes: 48,
    title: "Application mobile AutoCall",
    category: "Nouvelles fonctionnalités",
    status: "À étudier",
    summary:
      "Recevoir des notifications push lors d’un appel urgent transféré et écouter les synthèses en déplacement.",
  },
  {
    id: "fb-2",
    votes: 32,
    title: "Intégration HubSpot",
    category: "Demandes d’intégrations",
    status: "En analyse",
    summary:
      "Synchronisation bidirectionnelle des contacts, notes d’appels IA et statuts de deals avec HubSpot CRM.",
    brandIcon: "hubspot",
  },
  {
    id: "fb-3",
    votes: 24,
    title: "Personnalisation des rapports",
    category: "Suggestions",
    status: "À étudier",
    summary:
      "Export PDF hebdomadaire personnalisable des indicateurs d’appels et rendez-vous générés.",
  },
  {
    id: "fb-4",
    votes: 19,
    title: "Davantage de voix françaises",
    category: "Suggestions",
    status: "En analyse",
    summary:
      "Ajout de timbres régionaux supplémentaires et de voix masculines posées pour le secteur juridique.",
  },
  {
    id: "fb-5",
    votes: 12,
    title: "Mode sombre",
    category: "Problèmes d’ergonomie",
    status: "À étudier",
    summary:
      "Option d’affichage sombre reposant pour les équipes supervisant le standard en soirée.",
  },
  {
    id: "fb-6",
    votes: 29,
    title: "Clarté de la mise en service vocale Emma",
    category: "Retours positifs",
    status: "En analyse",
    summary:
      "Retour récurrent saluant la rapidité de prise en main du modèle officiel Réceptionniste IA.",
  },
];

// ---------------------------------------------------------------------------
// 06. ACCOMPAGNEMENT — Opportunités proactives sans sur-sollicitation
// ---------------------------------------------------------------------------

interface CoachingPlaybookItem {
  id: string;
  title: string;
  subtitle: string;
  companiesCount: number;
  channel: "Notification in-app" | "Tutoriel ciblé" | "E-mail d’accompagnement" | "Session personnalisée";
  exampleCompanies: string;
  dispatched: boolean;
}

const INITIAL_COACHING_PLAYBOOKS: CoachingPlaybookItem[] = [
  {
    id: "cp-1",
    title: "Onboarding incomplet",
    subtitle: "Proposer une aide à la configuration.",
    companiesCount: 12,
    channel: "E-mail d’accompagnement",
    exampleCompanies: "Clean Studio, Atelier Nord, Kéops Conseil...",
    dispatched: false,
  },
  {
    id: "cp-2",
    title: "Agent vocal non activé",
    subtitle: "Accompagner la mise en service.",
    companiesCount: 8,
    channel: "Notification in-app",
    exampleCompanies: "Studio Horizon, Bâtir Plus...",
    dispatched: false,
  },
  {
    id: "cp-3",
    title: "Baisse d’activité",
    subtitle: "Comprendre les difficultés du client.",
    companiesCount: 6,
    channel: "E-mail d’accompagnement",
    exampleCompanies: "Mondo Services, Sud Logistique...",
    dispatched: false,
  },
  {
    id: "cp-4",
    title: "Fonctionnalité mal maîtrisée",
    subtitle: "Proposer un tutoriel adapté.",
    companiesCount: 14,
    channel: "Tutoriel ciblé",
    exampleCompanies: "Synchronisation agenda & règles de transfert humain",
    dispatched: false,
  },
  {
    id: "cp-5",
    title: "Rendez-vous d’accompagnement",
    subtitle: "Organiser une session personnalisée.",
    companiesCount: 3,
    channel: "Session personnalisée",
    exampleCompanies: "Comptes Pro & Business sans première valeur à J+7",
    dispatched: false,
  },
];

// ---------------------------------------------------------------------------
// 07. EXPÉRIMENTATIONS — Tests A/B contrôlés (EXP-001)
// ---------------------------------------------------------------------------

interface ProductExperimentRecord {
  id: string;
  code: string;
  title: string;
  status: "En cours" | "En préparation";
  targetMetric: string;
  variantALabel: string;
  variantARatePct: number;
  variantAParticipants: number;
  variantBLabel: string;
  variantBRatePct: number;
  variantBParticipants: number;
  deltaPoints: number;
  guardrailNote: string;
}

const INITIAL_EXPERIMENTS: ProductExperimentRecord[] = [
  {
    id: "exp-001",
    code: "EXP-001",
    title: "Simplification de l’onboarding",
    status: "En cours",
    targetMetric: "Taux de complétion de l’onboarding initial",
    variantALabel: "Parcours actuel (6 étapes détaillées)",
    variantARatePct: 62,
    variantAParticipants: 150,
    variantBLabel: "Parcours simplifié (Modèle pré-rempli en 3 étapes)",
    variantBRatePct: 78,
    variantBParticipants: 150,
    deltaPoints: 16,
    guardrailNote:
      "Vérification obligatoire avant déploiement : s’assurer que la hausse de complétion (+16 pts) s’accompagne bien d’une hausse de la première valeur réelle à J+7 et non d’agents mal configurés.",
  },
];

function getCohortCellStyle(val: number | null): string {
  if (val === null) return "bg-[#FAFAFA] text-[#A3A3A3]";
  if (val >= 93) return "bg-[#408963] text-white font-bold";
  if (val >= 86) return "bg-[#B9E8D2] text-[#144533] font-semibold";
  if (val >= 78) return "bg-[#DEF5EC] text-[#00775B] font-semibold";
  return "bg-[#EAF3ED] text-[#184D3B] font-medium";
}

export function SuperAdminAdoption({
  activeTab,
  onSelectTab,
  onNavigate,
}: {
  activeTab: string;
  locale: Locale;
  onSelectTab: (tabId: string) => void;
  onNavigate: (section: SuperAdminSectionNavTarget, tab?: string) => void;
}) {
  // 03. Rétention : bascule Rétention d'utilisation vs Rétention d'abonnement payant
  const [retentionMode, setRetentionMode] = useState<"usage" | "paid">("usage");

  // 04. Santé : filtre et entreprise inspectée
  const [healthFilter, setHealthFilter] = useState<"Toutes" | HealthBand>("Toutes");
  const [selectedHealthId, setSelectedHealthId] = useState<string>("hl-clean");

  // 05. Feedback : filtre par catégorie et statuts
  const [feedbackItems, setFeedbackItems] =
    useState<ProductFeedbackItem[]>(INITIAL_FEEDBACK_ITEMS);
  const [feedbackFilter, setFeedbackFilter] = useState<"Tous" | FeedbackCategory>("Tous");

  // 06. Accompagnement : suivi des actions lancées
  const [playbooks, setPlaybooks] =
    useState<CoachingPlaybookItem[]>(INITIAL_COACHING_PLAYBOOKS);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>("cp-1");
  const [selectedChannelOverride, setSelectedChannelOverride] = useState<string>(
    "E-mail d’accompagnement",
  );

  // 07. Expérimentations : liste et modale nouvelle expérimentation
  const [experiments, setExperiments] =
    useState<ProductExperimentRecord[]>(INITIAL_EXPERIMENTS);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [newExpTitle, setNewExpTitle] = useState("");
  const [newExpMetric, setNewExpMetric] = useState("Activation du premier agent vocal à J+3");

  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const filteredHealthList = useMemo(() => {
    if (healthFilter === "Toutes") return INITIAL_COMPANY_HEALTH;
    return INITIAL_COMPANY_HEALTH.filter((c) => c.band === healthFilter);
  }, [healthFilter]);

  const selectedHealthCompany = useMemo(
    () =>
      INITIAL_COMPANY_HEALTH.find((c) => c.id === selectedHealthId) ??
      INITIAL_COMPANY_HEALTH[0],
    [selectedHealthId],
  );

  const filteredFeedback = useMemo(() => {
    if (feedbackFilter === "Tous") return feedbackItems;
    return feedbackItems.filter((f) => f.category === feedbackFilter);
  }, [feedbackItems, feedbackFilter]);

  const selectedPlaybook = useMemo(
    () => playbooks.find((p) => p.id === selectedPlaybookId) ?? playbooks[0],
    [playbooks, selectedPlaybookId],
  );

  const handleCreateExperiment = () => {
    if (!newExpTitle.trim()) return;
    const nextNum = String(experiments.length + 1).padStart(3, "0");
    const created: ProductExperimentRecord = {
      id: `exp-${Date.now()}`,
      code: `EXP-${nextNum}`,
      title: newExpTitle.trim(),
      status: "En préparation",
      targetMetric: newExpMetric,
      variantALabel: " Témoin (Interface actuelle)",
      variantARatePct: 48,
      variantAParticipants: 100,
      variantBLabel: "Variante testée (Guidage contextuel)",
      variantBRatePct: 59,
      variantBParticipants: 100,
      deltaPoints: 11,
      guardrailNote:
        "Protocole en préparation : taille d’échantillon minimale requise avant toute conclusion statistique.",
    };
    setExperiments((prev) => [created, ...prev]);
    setNewExpTitle("");
    setExpModalOpen(false);
    notify(`Expérimentation ${created.code} créée en mode Simulation`);
  };

  return (
    <div className="mt-7 space-y-7">
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-[#E5E5E5] bg-[#171717] px-4 py-3 text-[13.5px] font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Bandeau de positionnement du module (Section 10 : Adoption vs Entreprises / Consommations / Finance / Support) */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-2xs lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
          <span className="inline-flex size-2 shrink-0 rounded-full bg-[#008F6D]" />
          <span>
            <strong className="font-semibold text-[var(--foreground)]">
              09 · Adoption :
            </strong>{" "}
            « Utilisent-ils réellement AutoCall et en tirent-ils de la valeur ? » · Score explicable adapté aux objectifs client, sans aucune sanction automatique.
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("support", "tickets")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>08 · Support</span>
            <span className="text-[#737373]">→</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("finance", "retention")}
            className="inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12.5px] font-medium text-[#171717] shadow-2xs whitespace-nowrap transition hover:bg-[#F7F7F8] cursor-pointer"
          >
            <span>05 · Rétention financière</span>
            <span className="text-[#737373]">→</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          01. SOUS-ONGLET ONBOARDING (120 / 65 % / 48 % / 2,4 j + Tunnel 6 étapes)
         ===================================================================== */}
      {activeTab === "onboarding" && (
        <div className="space-y-6">
          {/* 4 cartes KPI double surface avec badges d'icônes : 120 / 65 % / 48 % / 2,4 j */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="crm" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Nouvelles entreprises
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  120
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] text-[var(--text-muted)]">
                Cohorte inscrite sur les 30 derniers jours
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="agents" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Onboarding terminé
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  {"65 %"}
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                78 entreprises ont finalisé leur configuration
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="sparkle" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Première valeur obtenue
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  {"48 %"}
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#8A5A00]">
                ● 58 entreprises avec un résultat concret vérifié
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    Temps médian avant valeur
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  2,4 j
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                Délai médian entre inscription et 1er résultat
              </p>
            </div>
          </div>

          {/* Tunnel d'activation en 6 étapes */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Tunnel d’activation des nouveaux clients
                </h3>
                <p className="mt-0.5 text-[13.5px] text-[#737373]">
                  Parcours orienté mise en service d’un agent vocal (les étapes exactes s’adaptent à l’objectif choisi par chaque entreprise).
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectTab("coaching")}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-[#171717] px-3.5 text-[12.5px] font-semibold text-white whitespace-nowrap hover:bg-[#2E2E2E] cursor-pointer"
              >
                <span>Relancer les 42 onboardings incomplets</span>
                <span>→</span>
              </button>
            </div>

            <div className="mt-5 space-y-3.5">
              {ONBOARDING_FUNNEL_STAGES.map((stage, idx) => {
                const prevCount =
                  idx > 0 ? ONBOARDING_FUNNEL_STAGES[idx - 1].companiesCount : stage.companiesCount;
                const stepDrop = prevCount - stage.companiesCount;

                return (
                  <div
                    key={stage.id}
                    className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA]/80 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-[#E5E5E5] bg-white font-mono text-[11px] font-bold text-[#171717]">
                          {stage.stepNumber}
                        </span>
                        <span className="text-[14.5px] font-semibold text-[#171717]">
                          {stage.label}
                        </span>
                        {stepDrop > 0 && (
                          <span className="rounded-md bg-[#EFEFEF] px-2 py-0.5 font-mono text-[11px] font-medium text-[#525252]">
                            -{stepDrop} à cette étape
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2.5 font-mono tabular-nums">
                        <span className="text-[13px] font-medium text-[#525252]">
                          {stage.companiesCount} entreprises
                        </span>
                        <span className="rounded-md bg-[#EAF3ED] px-2.5 py-0.5 text-[12.5px] font-bold text-[#184D3B]">
                          {`${stage.ratePct} %`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#EAEAEA]">
                      <div
                        style={{ width: `${stage.ratePct}%` }}
                        className="h-full rounded-full bg-[#408963] transition-all"
                      />
                    </div>

                    <p className="mt-2 text-[12.5px] text-[#525252]">{stage.dropNote}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 text-[12.5px] text-[#525252]">
              <SolarIcon name="sparkle" className="size-4 shrink-0 text-[#008F6D]" />
              <span>
                <strong>Définition de la première valeur :</strong> se connecter au tableau de bord ne suffit jamais. AutoCall comptabilise uniquement un résultat métier réel (appel manqué récupéré, prospect qualifié ou rendez-vous confirmé).
              </span>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          02. SOUS-ONGLET FONCTIONNALITÉS (8 modules de 86 % à 16 %)
         ===================================================================== */}
      {activeTab === "features" && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Adoption des fonctionnalités (30 derniers jours)
                </h3>
                <p className="mt-0.5 text-[13.5px] text-[#737373]">
                  Part des entreprises éligibles ayant effectivement utilisé chaque module au cours des 30 derniers jours.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectTab("experiments")}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-white px-3.5 text-[12.5px] font-semibold text-[#171717] whitespace-nowrap hover:bg-[#F7F7F8] cursor-pointer"
              >
                <span>Tester une amélioration UX</span>
                <span>→</span>
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {FEATURE_ADOPTION_LIST.map((feat) => (
                <article
                  key={feat.id}
                  className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs"
                >
                  <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#171717] shadow-[0_2px_6px_rgba(23,23,23,0.06)]">
                          <SolarIcon name={feat.icon} className="size-4" />
                        </span>
                        <div>
                          <h4 className="text-[15px] font-semibold text-[#171717]">
                            {feat.name}
                          </h4>
                          <p className="text-[11.5px] text-[#737373]">
                            {feat.activeTenants} / {feat.eligibleTenants} entreprises éligibles
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-md px-2 py-0.5 font-mono text-[10.5px] font-semibold whitespace-nowrap ${
                            feat.statusTag === "Socle fort"
                              ? "bg-[#DEF5EC] text-[#008064]"
                              : feat.statusTag === "Croissance"
                                ? "bg-[#EFEFEF] text-[#171717]"
                                : "bg-[#F0C869] text-[#5C3D00]"
                          }`}
                        >
                          {feat.statusTag}
                        </span>
                        <span className="font-mono text-[18px] font-bold text-[#171717] tabular-nums">
                          {`${feat.adoptionPct} %`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                      <div
                        style={{ width: `${feat.adoptionPct}%` }}
                        className={`h-full rounded-full ${
                          feat.adoptionPct >= 60
                            ? "bg-[#408963]"
                            : feat.adoptionPct >= 35
                              ? "bg-[#171717]"
                              : "bg-[#D99B26]"
                        }`}
                      />
                    </div>
                  </div>

                  <p className="px-2 pt-2.5 pb-1 text-[12px] leading-relaxed text-[#525252]">
                    {feat.productInsight}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          03. SOUS-ONGLET RÉTENTION (Matrice de cohortes Juil -> Nov + Usage vs Payant)
         ===================================================================== */}
      {activeTab === "retention" && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
            <div className="flex flex-col justify-between gap-4 border-b border-[#EFEFEF] pb-4 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Rétention des entreprises — Analyse par cohorte mensuelle
                </h3>
                <p className="mt-0.5 text-[13.5px] text-[#737373]">
                  Comparez la fidélisation dans le temps en distinguant l’utilisation active de la plateforme et le maintien de l’abonnement payant.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-1">
                <button
                  type="button"
                  onClick={() => setRetentionMode("usage")}
                  className={`h-8 rounded-lg px-3 text-[12.5px] font-semibold whitespace-nowrap transition cursor-pointer ${
                    retentionMode === "usage"
                      ? "bg-[#171717] text-white shadow-2xs"
                      : "text-[#525252] hover:text-[#171717]"
                  }`}
                >
                  Rétention d’utilisation
                </button>
                <button
                  type="button"
                  onClick={() => setRetentionMode("paid")}
                  className={`h-8 rounded-lg px-3 text-[12.5px] font-semibold whitespace-nowrap transition cursor-pointer ${
                    retentionMode === "paid"
                      ? "bg-[#171717] text-white shadow-2xs"
                      : "text-[#525252] hover:text-[#171717]"
                  }`}
                >
                  Abonnements payants
                </button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto pb-1">
              <table className="w-full min-w-[680px] border-separate border-spacing-y-2 text-left text-[13.5px]">
                <thead>
                  <tr className="text-[12px] font-medium text-[#737373]">
                    <th className="py-2 pr-4">Cohorte</th>
                    <th className="px-3 py-2">Clients</th>
                    <th className="px-3 py-2 text-center">M0</th>
                    <th className="px-3 py-2 text-center">M1</th>
                    <th className="px-3 py-2 text-center">M2</th>
                    <th className="px-3 py-2 text-center">M3</th>
                    <th className="px-3 py-2 text-center">M4</th>
                  </tr>
                </thead>
                <tbody>
                  {COHORT_RETENTION_DATA.map((row) => {
                    const series =
                      retentionMode === "usage" ? row.usageRetention : row.paidRetention;
                    return (
                      <tr key={row.cohort}>
                        <td className="rounded-l-xl border-y border-l border-[#EFEFEF] bg-[#FAFAFA] py-3 pr-4 pl-3.5 font-semibold text-[#171717] whitespace-nowrap">
                          {row.cohort}
                        </td>
                        <td className="border-y border-[#EFEFEF] bg-[#FAFAFA] px-3 py-3 font-mono text-[13px] text-[#525252] tabular-nums">
                          {row.clients}
                        </td>
                        {series.map((val, mIdx) => (
                          <td
                            key={mIdx}
                            className={`border-y border-[#EFEFEF] px-2 py-2 text-center font-mono text-[13px] tabular-nums ${
                              mIdx === series.length - 1 ? "rounded-r-xl border-r" : ""
                            }`}
                          >
                            <span
                              className={`inline-flex h-8 w-full min-w-[68px] items-center justify-center rounded-lg ${getCohortCellStyle(
                                val,
                              )}`}
                            >
                              {val !== null ? `${val} %` : "—"}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Légende d'intensité & Note d'analyse */}
            <div className="mt-4 flex flex-col justify-between gap-3 border-t border-[#EFEFEF] pt-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-[12px] text-[#525252]">
                <span>Faible</span>
                <span className="size-4 rounded bg-[#EAF3ED] border border-[#D5E8DC]" />
                <span className="size-4 rounded bg-[#DEF5EC]" />
                <span className="size-4 rounded bg-[#B9E8D2]" />
                <span className="size-4 rounded bg-[#408963]" />
                <span>Élevée</span>
              </div>

              <p className="text-[12.5px] text-[#525252]">
                <strong>Écart stratégique :</strong> sur la cohorte Juillet (M4),{" "}
                <span className="font-mono font-semibold text-[#171717]">83 %</span> paient encore mais{" "}
                <span className="font-mono font-semibold text-[#184D3B]">72 %</span> utilisent activement la plateforme — soit{" "}
                <strong>11 % d’abonnés dormants à accompagner préventivement</strong>.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          04. SOUS-ONGLET SANTÉ (186 Bonne santé / 42 À accompagner / 20 À risque + Barème 100 pts)
         ===================================================================== */}
      {activeTab === "health" && (
        <div className="space-y-6">
          {/* 3 cartes KPI double surface avec badges d'icônes : 186 / 42 / 20 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="chart" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    En bonne santé
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  186
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#008F6D]">
                ● Score ≥ 75/100 · Usage régulier et valeur obtenue
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="help" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    À accompagner
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  42
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#8A5A00]">
                ● Score 40–74/100 · Configuration partielle à finaliser
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-2xs">
              <div className="rounded-lg bg-[var(--surface-inset)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(23,23,23,0.08)]">
                    <SolarIcon name="bolt" className="size-4.5" />
                  </span>
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    À risque
                  </p>
                </div>
                <p className="mt-2.5 text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] tabular-nums">
                  20
                </p>
              </div>
              <p className="px-2.5 pt-2.5 pb-1 text-[12.5px] font-medium text-[#B91C1C]">
                ● Score &lt; 40/100 · Risque de résiliation identifié
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Tableau interactif des entreprises (7 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                <h3 className="text-[17px] font-semibold text-[#171717]">
                  Santé des entreprises (Health Score)
                </h3>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(["Toutes", "Bonne santé", "À accompagner", "À risque"] as const).map(
                    (flt) => (
                      <button
                        key={flt}
                        type="button"
                        onClick={() => setHealthFilter(flt)}
                        className={`h-8 rounded-xl px-3 text-[12px] font-semibold transition cursor-pointer ${
                          healthFilter === flt
                            ? "bg-[#171717] text-white"
                            : "border border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F7F7F8]"
                        }`}
                      >
                        {flt}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse text-left text-[13.5px]">
                  <thead>
                    <tr className="border-b border-[#EFEFEF] text-[12px] font-medium text-[#737373]">
                      <th className="py-3 pr-4">Entreprise</th>
                      <th className="px-3 py-3">Score</th>
                      <th className="px-3 py-3">Observation</th>
                      <th className="py-3 pl-3 text-right">Détail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F2F2]">
                    {filteredHealthList.map((comp) => {
                      const isSelected = comp.id === selectedHealthCompany.id;
                      return (
                        <tr
                          key={comp.id}
                          onClick={() => setSelectedHealthId(comp.id)}
                          className={`transition cursor-pointer ${
                            isSelected ? "bg-[#F4F8F6]" : "hover:bg-[#FAFAFA]"
                          }`}
                        >
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <span className="font-semibold text-[#171717]">
                              {comp.companyName}
                            </span>
                            <span className="ml-2 rounded-md border border-[#E5E5E5] bg-white px-2 py-0.5 font-mono text-[11px] font-medium text-[#525252]">
                              {comp.plan}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[12px] font-bold tabular-nums ${
                                comp.score >= 75
                                  ? "bg-[#DEF5EC] text-[#008064]"
                                  : comp.score >= 40
                                    ? "bg-[#F0C869] text-[#5C3D00]"
                                    : "bg-[#FEE2E2] text-[#B91C1C]"
                              }`}
                            >
                              {comp.score}/100
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-[13px] text-[#525252]">
                            {comp.observation}
                          </td>
                          <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedHealthId(comp.id);
                              }}
                              className="h-8 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[12px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                            >
                              Expliquer
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Décomposition explicable du Health Score sur 100 points (5 col) */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs lg:col-span-5">
              <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                <div className="flex items-start justify-between gap-2 border-b border-[#E5E5E5]/80 pb-3.5">
                  <div>
                    <span className="font-mono text-[11px] font-semibold text-[#737373]">
                      Calcul explicable du Health Score
                    </span>
                    <h4 className="mt-0.5 text-[17px] font-semibold text-[#171717]">
                      {selectedHealthCompany.companyName} ({selectedHealthCompany.plan})
                    </h4>
                    <p className="text-[12px] text-[#525252]">
                      Objectif déclaré : {selectedHealthCompany.primaryGoal}
                    </p>
                  </div>
                  <span className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-1.5 font-mono text-[16px] font-bold text-[#171717] shadow-2xs tabular-nums">
                    {selectedHealthCompany.score} / 100
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-[12.5px]">
                  {[
                    {
                      label: "Configuration et onboarding",
                      earned: selectedHealthCompany.breakdown.onboardingPts,
                      max: 20,
                    },
                    {
                      label: "Régularité d’utilisation",
                      earned: selectedHealthCompany.breakdown.regularityPts,
                      max: 20,
                    },
                    {
                      label: "Utilisation des fonctionnalités pertinentes",
                      earned: selectedHealthCompany.breakdown.relevantFeaturesPts,
                      max: 20,
                    },
                    {
                      label: "Résultats obtenus (Première valeur & volume)",
                      earned: selectedHealthCompany.breakdown.outcomesPts,
                      max: 25,
                    },
                    {
                      label: "Absence de blocages persistants",
                      earned: selectedHealthCompany.breakdown.noBlockersPts,
                      max: 15,
                    },
                  ].map((crit) => {
                    const pct = Math.round((crit.earned / crit.max) * 100);
                    return (
                      <div key={crit.label}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#171717]">{crit.label}</span>
                          <span className="font-mono text-[12px] font-semibold text-[#525252] tabular-nums">
                            {crit.earned} / {crit.max} pts
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full rounded-full bg-[#408963]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-lg border border-[#E5E5E5] bg-white p-3 text-[12px] text-[#525252]">
                  <strong className="text-[#171717]">Recommandation :</strong>{" "}
                  {selectedHealthCompany.recommendedAction}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 px-2 pb-1">
                <span className="text-[11.5px] text-[#737373]">
                  Aucune sanction automatique en cas de score faible.
                </span>
                <button
                  type="button"
                  onClick={() => onSelectTab("coaching")}
                  className="h-8.5 shrink-0 rounded-xl bg-[#171717] px-3.5 text-[12px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
                >
                  Accompagner →
                </button>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* =====================================================================
          05. SOUS-ONGLET FEEDBACK (48 / 32 HubSpot / 24 / 19 / 12 + 5 catégories)
         ===================================================================== */}
      {activeTab === "feedback" && (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:flex-row lg:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Feedback clients &amp; Demandes d’évolution
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Centralisation des suggestions, demandes d’intégrations, irritants ergonomiques et retours positifs. <strong>Ces demandes éclairent la stratégie mais ne constituent pas une feuille de route validée.</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  "Tous",
                  "Nouvelles fonctionnalités",
                  "Demandes d’intégrations",
                  "Suggestions",
                  "Problèmes d’ergonomie",
                  "Retours positifs",
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFeedbackFilter(cat)}
                  className={`h-8 rounded-xl px-3 text-[12px] font-semibold transition cursor-pointer ${
                    feedbackFilter === cat
                      ? "bg-[#171717] text-white"
                      : "border border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F7F7F8]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFeedback.map((fb) => (
              <article
                key={fb.id}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs"
              >
                <div className="rounded-xl bg-[var(--surface-inset)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-xl border border-[#E5E5E5] bg-white shadow-2xs">
                        <span className="font-mono text-[15px] font-bold leading-none text-[#171717] tabular-nums">
                          {fb.votes}
                        </span>
                        <span className="mt-0.5 text-[9.5px] font-medium text-[#737373]">
                          votes
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          {fb.brandIcon === "hubspot" && (
                            <HubSpotBrandSvg className="size-4 shrink-0" />
                          )}
                          <h4 className="text-[15px] font-semibold text-[#171717]">
                            {fb.title}
                          </h4>
                        </div>
                        <span className="mt-1 inline-block rounded border border-[#E5E5E5] bg-white px-2 py-0.5 font-mono text-[10.5px] text-[#525252]">
                          {fb.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold whitespace-nowrap ${
                        fb.status === "En analyse"
                          ? "bg-[#DEF5EC] text-[#008064]"
                          : "bg-[#EFEFEF] text-[#525252]"
                      }`}
                    >
                      {fb.status}
                    </span>
                  </div>

                  <p className="mt-3 text-[12.5px] leading-relaxed text-[#525252]">
                    {fb.summary}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between px-1.5 pb-1">
                  <span className="text-[11.5px] text-[#737373]">Demandes clients</span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextStatus =
                        fb.status === "À étudier" ? "En analyse" : "À étudier";
                      setFeedbackItems((prev) =>
                        prev.map((item) =>
                          item.id === fb.id ? { ...item, status: nextStatus } : item,
                        ),
                      );
                      notify(`Retour « ${fb.title} » passé au statut « ${nextStatus} »`);
                    }}
                    className="h-8 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
                  >
                    {fb.status === "À étudier" ? "Passer en analyse" : "Remettre à étudier"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          06. SOUS-ONGLET ACCOMPAGNEMENT (12 / 8 / 6 / 14 / 3 actions ciblées)
         ===================================================================== */}
      {activeTab === "coaching" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Liste des 5 opportunités d'accompagnement (7 col) */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs lg:col-span-7">
            <div className="border-b border-[#EFEFEF] pb-4">
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Actions d’accompagnement proactif
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Identifiez les blocages réels et aidez chaque entreprise à obtenir de meilleurs résultats sans multiplier les sollicitations inutiles.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {playbooks.map((pb) => {
                const isSelected = pb.id === selectedPlaybook.id;
                return (
                  <article
                    key={pb.id}
                    onClick={() => {
                      setSelectedPlaybookId(pb.id);
                      setSelectedChannelOverride(pb.channel);
                    }}
                    className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition cursor-pointer ${
                      isSelected
                        ? "border-[#171717] bg-[#F4F8F6]"
                        : "border-[#EFEFEF] bg-[#FAFAFA]/80 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white font-mono text-[15px] font-bold text-[#171717] shadow-2xs tabular-nums">
                        {pb.companiesCount}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-[15px] font-semibold text-[#171717]">
                            {pb.title}
                          </h4>
                          <span className="rounded border border-[#E5E5E5] bg-white px-2 py-0.5 font-mono text-[10.5px] text-[#525252]">
                            {pb.channel}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[13px] text-[#525252]">{pb.subtitle}</p>
                        <p className="mt-0.5 text-[11.5px] text-[#737373]">
                          Cible : {pb.exampleCompanies}
                        </p>
                      </div>
                    </div>

                    {pb.dispatched ? (
                      <span className="shrink-0 rounded-md bg-[#DEF5EC] px-2.5 py-1 font-mono text-[11.5px] font-semibold text-[#008064]">
                        ✓ Planifié
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#171717]">
                        Configurer →
                      </span>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {/* Console d'envoi sobre & Garde-fou anti-spam (5 col) */}
          <section className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs lg:col-span-5">
            <div className="rounded-xl bg-[var(--surface-inset)] p-4">
              <span className="rounded-md bg-[#EAF3ED] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#184D3B]">
                Campagne d’aide ciblée
              </span>
              <h4 className="mt-2.5 text-[17px] font-semibold text-[#171717]">
                {selectedPlaybook.title} ({selectedPlaybook.companiesCount} entreprises)
              </h4>
              <p className="mt-1 text-[13px] text-[#525252]">
                {selectedPlaybook.subtitle}
              </p>

              <div className="mt-4 space-y-3.5 text-[13px]">
                <div>
                  <label className="block font-medium text-[#171717]">
                    Canal d’accompagnement privilégié
                  </label>
                  <PremiumSelect
                    value={selectedChannelOverride}
                    onChange={setSelectedChannelOverride}
                    ariaLabel="Canal d’accompagnement"
                    className="mt-1"
                    options={[
                      { value: "Tutoriel ciblé", label: "Tutoriel interactif dans le dashboard" },
                      { value: "Notification in-app", label: "Notification discrète dans l’espace client" },
                      { value: "E-mail d’accompagnement", label: "E-mail d’aide personnalisé" },
                      { value: "Session personnalisée", label: "Proposition de rendez-vous support (15 min)" },
                    ]}
                  />
                </div>

                <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5 text-[12px] text-[#525252]">
                  <p className="font-semibold text-[#171717]">
                    Garde-fou de sobriété relationnelle
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Maximum <strong>1 sollicitation d’accompagnement tous les 7 jours</strong> par entreprise. Si le client a déjà un ticket ouvert au Support, l’envoi automatique est suspendu au profit du suivi humain.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 px-1 pb-1">
              <button
                type="button"
                onClick={() => {
                  setPlaybooks((prev) =>
                    prev.map((item) =>
                      item.id === selectedPlaybook.id
                        ? { ...item, dispatched: true, channel: selectedChannelOverride as CoachingPlaybookItem["channel"] }
                        : item,
                    ),
                  );
                  notify(
                    `Action « ${selectedPlaybook.title} » déclenchée via ${selectedChannelOverride} (${selectedPlaybook.companiesCount} entreprises)`,
                  );
                }}
                className="h-10 w-full rounded-xl bg-[#171717] px-4 text-[13px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Déclencher cet accompagnement ({selectedPlaybook.companiesCount} comptes)
              </button>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          07. SOUS-ONGLET EXPÉRIMENTATIONS (EXP-001 · Variante A 62 % vs Variante B 78 % · +16 pts)
         ===================================================================== */}
      {activeTab === "experiments" && (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs sm:flex-row sm:items-center">
            <div>
              <h3 className="text-[17px] font-semibold text-[#171717]">
                Expérimentations produit &amp; Tests A/B
              </h3>
              <p className="mt-0.5 text-[13.5px] text-[#737373]">
                Testez rigoureusement les simplifications d’onboarding, tutoriels et parcours avant de généraliser un changement à l’ensemble des clients.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setExpModalOpen(true)}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer whitespace-nowrap"
            >
              + Nouvelle expérimentation
            </button>
          </div>

          <div className="space-y-5">
            {experiments.map((exp) => (
              <section
                key={exp.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEFEF] pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-[#171717] px-2.5 py-0.5 font-mono text-[11.5px] font-bold text-white">
                        {exp.code} · Simulation
                      </span>
                      <span
                        className={`rounded-md px-2.5 py-0.5 font-mono text-[11.5px] font-semibold ${
                          exp.status === "En cours"
                            ? "bg-[#DEF5EC] text-[#008064]"
                            : "bg-[#EFEFEF] text-[#525252]"
                        }`}
                      >
                        ● {exp.status}
                      </span>
                    </div>
                    <h4 className="mt-2 text-[18px] font-semibold text-[#171717]">
                      {exp.title}
                    </h4>
                    <p className="text-[13px] text-[#737373]">
                      Indicateur principal observé : {exp.targetMetric}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#DEF5EC] bg-[#EAF3ED] px-4 py-2.5 text-right">
                    <span className="block text-[11px] font-medium text-[#184D3B]">
                      Écart observé
                    </span>
                    <span className="font-mono text-[20px] font-bold text-[#00775B] tabular-nums">
                      +{exp.deltaPoints} points
                    </span>
                  </div>
                </div>

                {/* Comparaison côte à côte Variante A vs Variante B */}
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded border border-[#E5E5E5] bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-[#525252]">
                        Variante A
                      </span>
                      <span className="font-mono text-[12px] text-[#737373]">
                        {exp.variantAParticipants} participants
                      </span>
                    </div>
                    <p className="mt-2 text-[14px] font-semibold text-[#171717]">
                      {exp.variantALabel}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-mono text-[28px] font-bold text-[#171717] tabular-nums">
                        {`${exp.variantARatePct} %`}
                      </span>
                      <span className="text-[12.5px] text-[#737373]">Taux de complétion</span>
                    </div>
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                      <div
                        style={{ width: `${exp.variantARatePct}%` }}
                        className="h-full rounded-full bg-[#737373]"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#B9E8D2] bg-[#F4F9F6] p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-[#184D3B] px-2 py-0.5 font-mono text-[11px] font-semibold text-white">
                        Variante B
                      </span>
                      <span className="font-mono text-[12px] text-[#184D3B]">
                        {exp.variantBParticipants} participants
                      </span>
                    </div>
                    <p className="mt-2 text-[14px] font-semibold text-[#171717]">
                      {exp.variantBLabel}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-mono text-[28px] font-bold text-[#184D3B] tabular-nums">
                        {`${exp.variantBRatePct} %`}
                      </span>
                      <span className="text-[12.5px] font-medium text-[#184D3B]">
                        Taux de complétion
                      </span>
                    </div>
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#DCECE3]">
                      <div
                        style={{ width: `${exp.variantBRatePct}%` }}
                        className="h-full rounded-full bg-[#408963]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 text-[12.5px] text-[#525252] sm:flex-row sm:items-center">
                  <p>{exp.guardrailNote}</p>
                  <button
                    type="button"
                    onClick={() =>
                      notify(
                        `Rapport statistique de ${exp.code} vérifié : aucun effet indésirable sur la qualité d’agent`,
                      )
                    }
                    className="h-8.5 shrink-0 rounded-lg border border-[#E5E5E5] bg-white px-3 text-[12px] font-semibold text-[#171717] hover:bg-[#F7F7F8] cursor-pointer whitespace-nowrap"
                  >
                    Vérifier la significativité →
                  </button>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALE : CRÉER UNE NOUVELLE EXPÉRIMENTATION A/B
         ===================================================================== */}
      {expModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-semibold text-[#171717]">
              Nouvelle expérimentation produit (Test A/B)
            </h3>
            <p className="mt-1 text-[13px] text-[#525252]">
              Définissez l’hypothèse et la métrique principale. Le déploiement général restera soumis à validation statistique et contrôle d’absence de régression.
            </p>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Intitulé de l’expérimentation
                </label>
                <input
                  type="text"
                  value={newExpTitle}
                  onChange={(e) => setNewExpTitle(e.target.value)}
                  placeholder="Ex: Essai vocal guidé dès l’inscription"
                  className="mt-1 h-10 w-full rounded-xl border border-[#E5E5E5] px-3.5 text-[13.5px] text-[#171717] outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#171717]">
                  Métrique de succès observée
                </label>
                <PremiumSelect
                  value={newExpMetric}
                  onChange={setNewExpMetric}
                  ariaLabel="Métrique de succès"
                  className="mt-1"
                  options={[
                    {
                      value: "Activation du premier agent vocal à J+3",
                      label: "Activation du premier agent vocal à J+3",
                    },
                    {
                      value: "Première valeur obtenue à J+7",
                      label: "Première valeur obtenue à J+7",
                    },
                    {
                      value: "Connexion réussie d’un agenda Google / Outlook",
                      label: "Connexion réussie d’un agenda Google / Outlook",
                    },
                  ]}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#EFEFEF] pt-4">
              <button
                type="button"
                onClick={() => setExpModalOpen(false)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] hover:bg-[#F7F7F8] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreateExperiment}
                className="h-10 rounded-xl bg-[#171717] px-4 text-[13.5px] font-semibold text-white hover:bg-[#2E2E2E] cursor-pointer"
              >
                Créer en simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

