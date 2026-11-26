export interface CompanyRecord {
  id: string;
  name: string;
  city: string;
  country: string;
  size: "11–50" | "51–200" | "201–500";
  sector: string;
  sectorDetail: string;
  signalCount: number;
  score: number;
  activeHiring: boolean;
  tintBg: string;
  tintFg: string;
  decidersCount: number;
  offers: { title: string; location: string }[];
  relevanceNote: string;
}

export interface ContactRecord {
  id: string;
  initials: string;
  name: string;
  role: string;
  department: string;
  companyId: string;
  companyName: string;
  city: string;
  emailStatus: "verified" | "verify" | "enrich";
  emailSample?: string;
  phoneEnriched: boolean;
  linkedinEnriched: boolean;
  score: number;
  avatarBg: string;
  avatarFg: string;
}

export interface OfferRecord {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  city: string;
  contract: string;
  publishedAgo: string;
  isRecent: boolean;
  score: number;
  companyOffersCount: number;
  description: string;
  skills: string[];
  signalObserved: string;
  potentialOpportunity: string;
  unconfirmedInfo: string;
  recommendedRoles: string[];
}

export interface AlertRecord {
  id: string;
  title: string;
  criteria: string;
  frequency: string;
  newMatches: number;
  active: boolean;
  keywordMode?: "all" | "any";
  location?: string;
  inApp?: boolean;
  email?: boolean;
  monthlyLimit?: number;
}

export const companiesData: CompanyRecord[] = [
  {
    id: "comp-horizon",
    name: "Horizon Services",
    city: "Lyon",
    country: "France",
    size: "51–200",
    sector: "Nettoyage",
    sectorDetail: "Nettoyage et services aux entreprises",
    signalCount: 4,
    score: 94,
    activeHiring: true,
    tintBg: "#E4EEFE",
    tintFg: "#4073C5",
    decidersCount: 3,
    offers: [
      { title: "Agent d’entretien", location: "Lyon · Exemple d’annonce" },
      { title: "Responsable de secteur", location: "Lyon · Exemple d’annonce" },
    ],
    relevanceNote:
      "Cette entreprise correspond aux critères de secteur, de localisation et de taille de votre recherche. Son activité de recrutement représente un signal à examiner.",
  },
  {
    id: "comp-atlas",
    name: "Atlas Maintenance",
    city: "Grenoble",
    country: "France",
    size: "11–50",
    sector: "Maintenance",
    sectorDetail: "Maintenance industrielle et équipements",
    signalCount: 2,
    score: 89,
    activeHiring: true,
    tintBg: "#DEF5EC",
    tintFg: "#008064",
    decidersCount: 2,
    offers: [
      { title: "Technicien de maintenance", location: "Grenoble · Exemple d’annonce" },
    ],
    relevanceNote:
      "Entreprise de taille intermédiaire en croissance sur le bassin grenoblois avec des recrutements techniques actifs.",
  },
  {
    id: "comp-nova",
    name: "Nova Facility",
    city: "Paris",
    country: "France",
    size: "201–500",
    sector: "Services",
    sectorDetail: "Facility management et services généraux",
    signalCount: 8,
    score: 86,
    activeHiring: true,
    tintBg: "#F0E8FC",
    tintFg: "#8760C4",
    decidersCount: 4,
    offers: [
      { title: "Commercial B2B", location: "Paris · Exemple d’annonce" },
    ],
    relevanceNote:
      "Forte dynamique commerciale en Île-de-France avec 8 postes ouverts cette semaine.",
  },
  {
    id: "comp-alpine",
    name: "Alpine Propreté",
    city: "Grenoble",
    country: "France",
    size: "11–50",
    sector: "Nettoyage",
    sectorDetail: "Propreté tertiaire et locaux professionnels",
    signalCount: 0,
    score: 82,
    activeHiring: false,
    tintBg: "#DFF4F8",
    tintFg: "#25859A",
    decidersCount: 1,
    offers: [],
    relevanceNote:
      "Correspondance géographique et sectorielle élevée malgré l’absence d’offre active détectée.",
  },
  {
    id: "comp-elan",
    name: "Élan Industries",
    city: "Lyon",
    country: "France",
    size: "51–200",
    sector: "Industrie",
    sectorDetail: "Fabrication mécanique et sous-traitance",
    signalCount: 3,
    score: 76,
    activeHiring: true,
    tintBg: "#FFF0D6",
    tintFg: "#B7791F",
    decidersCount: 2,
    offers: [
      { title: "Ingénieur HSE", location: "Lyon · Exemple d’annonce" },
      { title: "Responsable QHSE", location: "Lyon · Exemple d’annonce" },
    ],
    relevanceNote:
      "Site industriel lyonnais structurant ses équipes HSE et achats.",
  },
  {
    id: "comp-axis",
    name: "Axis Solutions",
    city: "Paris",
    country: "France",
    size: "11–50",
    sector: "Services",
    sectorDetail: "Conseil et services numériques",
    signalCount: 0,
    score: 71,
    activeHiring: false,
    tintBg: "#FCE7EB",
    tintFg: "#CE5C70",
    decidersCount: 2,
    offers: [],
    relevanceNote:
      "Profil PME parisienne compatible avec votre cible de services B2B.",
  },
];

export const contactsData: ContactRecord[] = [
  {
    id: "ct-1",
    initials: "TD",
    name: "Thomas Dupont",
    role: "Directeur général",
    department: "Direction",
    companyId: "comp-horizon",
    companyName: "Horizon Services",
    city: "Lyon",
    emailStatus: "verified",
    emailSample: "thomas@horizon.example",
    phoneEnriched: false,
    linkedinEnriched: false,
    score: 96,
    avatarBg: "#E4EEFE",
    avatarFg: "#4073C5",
  },
  {
    id: "ct-2",
    initials: "SM",
    name: "Sarah Martin",
    role: "Responsable des opérations",
    department: "Opérations",
    companyId: "comp-atlas",
    companyName: "Atlas Maintenance",
    city: "Grenoble",
    emailStatus: "enrich",
    phoneEnriched: false,
    linkedinEnriched: false,
    score: 92,
    avatarBg: "#FCE7EB",
    avatarFg: "#CE5C70",
  },
  {
    id: "ct-3",
    initials: "MB",
    name: "Marc Bernard",
    role: "Directeur commercial",
    department: "Commercial",
    companyId: "comp-nova",
    companyName: "Nova Facility",
    city: "Paris",
    emailStatus: "verify",
    emailSample: "m.bernard@novafacility.example",
    phoneEnriched: false,
    linkedinEnriched: false,
    score: 88,
    avatarBg: "#DEF5EC",
    avatarFg: "#008064",
  },
  {
    id: "ct-4",
    initials: "SL",
    name: "Sophie Laurent",
    role: "Responsable RH",
    department: "RH",
    companyId: "comp-horizon",
    companyName: "Horizon Services",
    city: "Lyon",
    emailStatus: "enrich",
    phoneEnriched: false,
    linkedinEnriched: false,
    score: 85,
    avatarBg: "#F0E8FC",
    avatarFg: "#8760C4",
  },
  {
    id: "ct-5",
    initials: "AM",
    name: "Alex Moreau",
    role: "Fondateur",
    department: "Direction",
    companyId: "comp-alpine",
    companyName: "Alpine Propreté",
    city: "Grenoble",
    emailStatus: "verified",
    emailSample: "alex@alpineproprete.example",
    phoneEnriched: false,
    linkedinEnriched: false,
    score: 81,
    avatarBg: "#FFF0D6",
    avatarFg: "#B7791F",
  },
  {
    id: "ct-6",
    initials: "CR",
    name: "Camille Robert",
    role: "Responsable achats",
    department: "Achats",
    companyId: "comp-elan",
    companyName: "Élan Industries",
    city: "Lyon",
    emailStatus: "enrich",
    phoneEnriched: false,
    linkedinEnriched: false,
    score: 78,
    avatarBg: "#DFF4F8",
    avatarFg: "#25859A",
  },
];

export const offersData: OfferRecord[] = [
  {
    id: "off-1",
    title: "Ingénieur HSE",
    companyId: "comp-elan",
    companyName: "Élan Industries",
    city: "Lyon",
    contract: "CDI",
    publishedAgo: "Il y a 1 j",
    isRecent: true,
    score: 96,
    companyOffersCount: 4,
    description:
      "L’entreprise recherche un ingénieur chargé de la prévention des risques industriels, de la conformité réglementaire et du suivi de ses démarches HSE.",
    skills: [
      "ISO 45001",
      "DUERP",
      "Risques industriels",
      "Audit HSE",
      "Conformité",
    ],
    signalObserved: "Recherche de compétences en prévention des risques.",
    potentialOpportunity:
      "Examiner la pertinence d’une offre de conseil, d’audit ou d’accompagnement QHSE.",
    unconfirmedInfo: "Budget, besoin d’externalisation et intention d’achat.",
    recommendedRoles: [
      "Directeur HSE",
      "Directeur industriel",
      "Responsable achats",
    ],
  },
  {
    id: "off-2",
    title: "Responsable de secteur",
    companyId: "comp-horizon",
    companyName: "Horizon Services",
    city: "Lyon",
    contract: "CDI",
    publishedAgo: "Il y a 2 j",
    isRecent: true,
    score: 92,
    companyOffersCount: 4,
    description:
      "Pilotage de chantiers multisites, encadrement des équipes d’intervention et suivi qualité client sur la métropole lyonnaise.",
    skills: ["Gestion multisite", "Management", "Qualité client", "Planning"],
    signalObserved: "Extension du portefeuille de sites à superviser.",
    potentialOpportunity:
      "Proposer une solution de coordination d’équipes ou de permanence téléphonique.",
    unconfirmedInfo: "Outillage actuel et échéance de déploiement.",
    recommendedRoles: ["Directeur général", "Responsable des opérations"],
  },
  {
    id: "off-3",
    title: "Commercial B2B",
    companyId: "comp-nova",
    companyName: "Nova Facility",
    city: "Paris",
    contract: "CDI",
    publishedAgo: "Il y a 3 j",
    isRecent: true,
    score: 88,
    companyOffersCount: 8,
    description:
      "Développement d’un portefeuille de comptes tertiaires en Île-de-France et qualification des demandes entrantes.",
    skills: ["Prospection B2B", "CRM", "Négociation", "Grands comptes"],
    signalObserved: "Renforcement de l’équipe de prospection commerciale.",
    potentialOpportunity:
      "Outillage de qualification téléphonique et relance automatisée.",
    unconfirmedInfo: "Taille de l’équipe commerciale et CRM utilisé.",
    recommendedRoles: ["Directeur commercial", "Directeur général"],
  },
  {
    id: "off-4",
    title: "Technicien de maintenance",
    companyId: "comp-atlas",
    companyName: "Atlas Maintenance",
    city: "Grenoble",
    contract: "CDD",
    publishedAgo: "Il y a 4 j",
    isRecent: false,
    score: 84,
    companyOffersCount: 2,
    description:
      "Maintenance préventive et curative sur sites clients industriels en Isère avec astreintes planifiées.",
    skills: ["Maintenance préventive", "Astreinte", "GMAO", "Sécurité"],
    signalObserved: "Hausse de charge sur les interventions planifiées.",
    potentialOpportunity:
      "Gestion des appels d’astreinte et prise de rendez-vous terrain.",
    unconfirmedInfo: "Volume d’appels entrants hors horaires.",
    recommendedRoles: ["Responsable des opérations", "Fondateur"],
  },
  {
    id: "off-5",
    title: "Responsable QHSE",
    companyId: "comp-elan",
    companyName: "Élan Industries",
    city: "Lyon",
    contract: "CDI",
    publishedAgo: "Il y a 8 j",
    isRecent: false,
    score: 81,
    companyOffersCount: 4,
    description:
      "Pilotage du système qualité-sécurité-environnement et préparation des audits de certification annuels.",
    skills: ["ISO 9001", "ISO 14001", "Audit interne", "QHSE"],
    signalObserved: "Structuration de la démarche qualité et conformité.",
    potentialOpportunity:
      "Accompagnement réglementaire ou logiciel de suivi d’audits.",
    unconfirmedInfo: "Calendrier des prochains audits.",
    recommendedRoles: ["Directeur industriel", "Responsable achats"],
  },
  {
    id: "off-6",
    title: "Community manager",
    companyId: "comp-axis",
    companyName: "Axis Solutions",
    city: "Paris",
    contract: "Alternance",
    publishedAgo: "Il y a 12 j",
    isRecent: false,
    score: 73,
    companyOffersCount: 1,
    description:
      "Animation des réseaux sociaux LinkedIn et Instagram, rédaction de contenus éditoriaux B2B.",
    skills: ["LinkedIn", "Éditorial B2B", "Calendrier social", "Analytics"],
    signalObserved: "Volonté d’accroître la visibilité sociale.",
    potentialOpportunity:
      "Centralisation des publications et suivi des retombées.",
    unconfirmedInfo: "Budget marketing dédié.",
    recommendedRoles: ["Fondateur", "Responsable marketing"],
  },
];

export const initialAlertsData: AlertRecord[] = [
  {
    id: "al-1",
    title: "Sociétés de nettoyage en région lyonnaise",
    criteria: "Lyon · Nettoyage · 11–200 salariés",
    frequency: "Hebdomadaire",
    newMatches: 4,
    active: true,
  },
  {
    id: "al-2",
    title: "Entreprises qui recrutent (HSE & Commercial)",
    criteria: "Recrutement actif · Score ≥ 80",
    frequency: "Quotidienne",
    newMatches: 6,
    active: true,
  },
];

