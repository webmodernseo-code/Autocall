'use client';

// Central copy + icon + accent for every feature-page overview banner.
// Supports both French (default) and English cleanly based on active language.
import {
    Bot, BarChart3, KeyRound, ScrollText, CreditCard, PhoneCall, Megaphone, Users, Plug,
    BookOpen, ShieldCheck, Phone, Settings, Network, UsersRound, Building2, AudioLines,
    Gift, TicketPercent, Share2, ListChecks, Coins, DollarSign, Mail, FileCheck, Languages,
    MessageSquare, Bell, Banknote, Layers, Lock, LogIn, RefreshCw, FileText,
    ClipboardList, CalendarClock, Globe, KanbanSquare, PhoneIncoming, Table, Activity,
} from 'lucide-react';

const OVERVIEWS = {
    // ── Client panel ──────────────────────────────────────────────
    'agents': {
        icon: Bot, accent: 'brand',
        fr: { title: 'Agents IA Vocaux', description: 'Assistants vocaux intelligents capables d\'appeler vos prospects et de mener de vraies conversations naturelles.', steps: ['Créer un agent', 'Ajouter connaissances & voix', 'Lancer une campagne'] },
        en: { title: 'AI Voice Agents', description: 'Voice agents that call your leads and hold real, natural conversations.', steps: ['Create an agent', 'Add knowledge & voice', 'Launch in a campaign'] },
    },
    'analytics': {
        icon: BarChart3, accent: 'signal',
        fr: { title: 'Analytique & Performances', description: 'Suivez précisément les volumes d\'appels, taux de conversion et indicateurs clés au fil du temps.', steps: ['Choisir la période', 'Analyser les indicateurs clés', 'Exporter le rapport'] },
        en: { title: 'Analytics & Insights', description: 'Track how your calls, leads and campaigns perform over time.', steps: ['Pick a date range', 'Read key metrics', 'Export the report'] },
    },
    'api-keys': {
        icon: KeyRound, accent: 'cold',
        fr: { title: 'Clés d\'API', description: 'Connectez vos applications et workflows externes à AutoCall via notre API REST sécurisée.', steps: ['Générer une clé secrète', 'La conserver en sécurité', 'Consommer les endpoints'] },
        en: { title: 'API Keys', description: 'Connect your own apps to the platform over our secure REST API.', steps: ['Create a key', 'Store it safely', 'Call the API'] },
    },
    'audit-log': {
        icon: ScrollText, accent: 'warm',
        fr: { title: 'Journal d\'audit', description: 'Historique exhaustif et horodaté de chaque action réalisée sur votre compte.', steps: ['Filtrer par utilisateur ou date', 'Inspecter un événement', 'Garantir la conformité'] },
        en: { title: 'Audit Log', description: 'A full trail of every action taken in your account.', steps: ['Filter by user or date', 'Inspect an event', 'Stay compliant'] },
    },
    'billing': {
        icon: CreditCard, accent: 'signal',
        fr: { title: 'Facturation & Crédits', description: 'Gérez vos forfaits, recharges de crédits téléphoniques et factures en toute simplicité.', steps: ['Recharger des crédits', 'Consulter les factures', 'Mettre à jour le paiement'] },
        en: { title: 'Billing & Credits', description: 'Manage calling credits, invoices and payment methods.', steps: ['Top up credits', 'View invoices', 'Update payment'] },
    },
    'calls': {
        icon: PhoneCall, accent: 'brand',
        fr: { title: 'Historique des appels', description: 'Accédez au journal de tous vos appels avec enregistrements audio, transcriptions et qualifications.', steps: ['Ouvrir un appel', 'Lire transcription & sentiment', 'Écouter l\'enregistrement audio'] },
        en: { title: 'Call History', description: 'Review every call your agents made, with audio recordings and transcripts.', steps: ['Open a call', 'Read transcript & sentiment', 'Play the recording'] },
    },
    'campaigns': {
        icon: Megaphone, accent: 'brand',
        fr: { title: 'Campagnes d\'appels IA', description: 'Programmez et lancez des séquences d\'appels téléphoniques automatisées vers vos listes de contacts.', steps: ['Sélectionner l\'agent & les contacts', 'Planifier le calendrier', 'Lancer & analyser en direct'] },
        en: { title: 'Call Campaigns', description: 'Schedule and launch automated calling campaigns to your contact lists.', steps: ['Pick agent & contacts', 'Set dial schedule', 'Launch & monitor live'] },
    },
    'contacts': {
        icon: Users, accent: 'cold',
        fr: { title: 'Audience & Contacts', description: 'Votre carnet de prospects, automatiquement dédupliqué au format international E.164.', steps: ['Importer un CSV ou ajouter', 'Organiser vos listes', 'Déployer en campagne'] },
        en: { title: 'Contacts & Audience', description: 'Your calling audience, automatically deduped by phone.', steps: ['Import a CSV or add', 'Organize your list', 'Use in campaigns'] },
    },
    'integrations': {
        icon: Plug, accent: 'warm',
        fr: { title: 'Intégrations & Webhooks', description: 'Connectez vos outils métiers et synchronisez les résultats d\'appels en temps réel.', steps: ['Choisir une intégration', 'Autoriser l\'accès', 'Synchroniser vos données'] },
        en: { title: 'Integrations & Webhooks', description: 'Connect external tools and stream call data via webhooks.', steps: ['Choose an integration', 'Authorize access', 'Sync your data'] },
    },
    'knowledge-base': {
        icon: BookOpen, accent: 'signal',
        fr: { title: 'Base de connaissances (RAG)', description: 'Fournissez des documents et informations précises pour ancrer les réponses de vos agents vocaux.', steps: ['Ajouter URL, fichier ou texte', 'Traitement & indexation', 'Lier à vos agents'] },
        en: { title: 'Knowledge Base', description: 'Give agents context so they ground answers during calls.', steps: ['Add a URL, file or text', 'Wait for processing', 'Attach to an agent'] },
    },
    'kyc': {
        icon: ShieldCheck, accent: 'brand',
        fr: { title: 'Vérification d\'entreprise (KYC)', description: 'Validez vos documents professionnels pour débloquer l\'émission d\'appels à fort volume.', steps: ['Téléverser les justificatifs', 'Examen de conformité', 'Activation du compte'] },
        en: { title: 'Business Verification', description: 'Verify your business to unlock outbound calling at scale.', steps: ['Upload your documents', 'Wait for review', 'Get approved'] },
    },
    'phone-numbers': {
        icon: Phone, accent: 'cold',
        fr: { title: 'Numéros de téléphone', description: 'Gérez vos lignes d\'appels sortants et numéros d\'accueil pour vos agents vocaux.', steps: ['Acheter ou lier un numéro', 'Attribuer à un agent', 'Démarrer les appels'] },
        en: { title: 'Phone Numbers', description: 'The phone numbers your agents place and receive calls from.', steps: ['Buy or connect a number', 'Assign to an agent', 'Start calling'] },
    },
    'settings': {
        icon: Settings, accent: 'brand',
        fr: { title: 'Paramètres du compte', description: 'Configurez vos informations personnelles, vos notifications et vos préférences globales.', steps: ['Mettre à jour le profil', 'Définir les préférences', 'Enregistrer les modifications'] },
        en: { title: 'Settings', description: 'Configure your account, profile and preferences.', steps: ['Update your profile', 'Set preferences', 'Save changes'] },
    },
    'sip': {
        icon: Network, accent: 'warm',
        fr: { title: 'Trunks & Lignes SIP', description: 'Connectez votre propre opérateur téléphonique et routez vos appels via SIP.', steps: ['Ajouter un trunk', 'Saisir les identifiants', 'Acheminer vos appels'] },
        en: { title: 'SIP Trunks', description: 'Bring your own carrier and route calls over SIP.', steps: ['Add a trunk', 'Enter credentials', 'Route your calls'] },
    },
    'team': {
        icon: UsersRound, accent: 'signal',
        fr: { title: 'Équipe & Collaborateurs', description: 'Invitez vos collaborateurs et gérez précisément leurs rôles et autorisations.', steps: ['Inviter un membre', 'Attribuer un rôle', 'Gérer les accès'] },
        en: { title: 'Team Management', description: 'Invite teammates and control what each can access.', steps: ['Invite a member', 'Assign a role', 'Manage access'] },
    },
    'tenants': {
        icon: Building2, accent: 'cold',
        fr: { title: 'Espaces de travail', description: 'Cloisonnez vos différents projets, clients ou filiales dans des environnements dédiés.', steps: ['Créer un espace', 'Basculer à tout moment', 'Inviter vos équipes'] },
        en: { title: 'Workspaces', description: 'Separate environments to organize your calling work.', steps: ['Create a workspace', 'Switch anytime', 'Invite your team'] },
    },
    'voices': {
        icon: AudioLines, accent: 'brand',
        fr: { title: 'Catalogue de voix IA', description: 'Écoutez et sélectionnez des voix ultra-réalistes haute fidélité pour vos agents.', steps: ['Écouter un extrait', 'Choisir votre voix favorite', 'Lier à vos agents'] },
        en: { title: 'AI Voices Library', description: 'Browse and preview lifelike AI voices for your agents.', steps: ['Preview a voice', 'Pick a favorite', 'Assign to an agent'] },
    },
    'prompt-templates': {
        icon: FileText, accent: 'signal',
        fr: { title: 'Modèles de prompts', description: 'Directives IA préconfigurées avec variables dynamiques pour créer des agents rapidement.', steps: ['Rédiger les instructions', 'Ajouter des {{variables}}', 'Réutiliser sur vos agents'] },
        en: { title: 'Prompt Templates', description: 'Reusable AI prompts with variables to set up agents fast.', steps: ['Write a prompt', 'Add {{variables}}', 'Reuse across agents'] },
    },
    'flows': {
        icon: Share2, accent: 'brand',
        fr: { title: 'Générateur de flux (Flows)', description: 'Automatisez les actions avant, pendant et après chaque appel téléphonique.', steps: ['Choisir un déclencheur', 'Ajouter conditions & actions', 'Activer le flux'] },
        en: { title: 'Flow Builder', description: 'Automate what happens before, during and after your calls.', steps: ['Pick a trigger', 'Add conditions & actions', 'Activate the flow'] },
    },
    'flow-templates': {
        icon: Layers, accent: 'signal',
        fr: { title: 'Modèles d\'automatisations', description: 'Démarrez depuis un scénario éprouvé pour gagner du temps.', steps: ['Explorer les modèles', 'Sélectionner un modèle', 'Personnaliser & activer'] },
        en: { title: 'Flow Templates', description: 'Start from a proven automation instead of a blank canvas.', steps: ['Browse templates', 'Use one', 'Customize & activate'] },
    },
    'flow-executions': {
        icon: ListChecks, accent: 'cold',
        fr: { title: 'Journaux d\'exécution des flux', description: 'Détail de chaque déclenchement d\'automatisation avec résultat étape par étape.', steps: ['Filtrer par statut', 'Ouvrir une exécution', 'Auditer chaque étape'] },
        en: { title: 'Execution Logs', description: 'Every time a flow ran, with per-step results.', steps: ['Filter by status', 'Open an execution', 'Inspect each step'] },
    },
    'forms': {
        icon: ClipboardList, accent: 'brand',
        fr: { title: 'Formulaires intelligents', description: 'Créez des formulaires pour capturer des prospects et déclencher des appels immédiats.', steps: ['Créer vos champs', 'Partager ou intégrer', 'Consulter les réponses'] },
        en: { title: 'Forms', description: 'Collect data from contacts and leads with custom forms.', steps: ['Build your fields', 'Share or embed', 'Review submissions'] },
    },
    'appointments': {
        icon: CalendarClock, accent: 'signal',
        fr: { title: 'Prise de rendez-vous', description: 'Consultez et gérez les rendez-vous pris par vos agents vocaux au cours des conversations.', steps: ['Voir les rendez-vous', 'Attribuer un agent', 'Suivre le statut'] },
        en: { title: 'Appointments', description: 'Manage bookings made by your AI agents and forms.', steps: ['Add a booking', 'Assign an agent', 'Track its status'] },
    },
    'website-widget': {
        icon: Globe, accent: 'cold',
        fr: { title: 'Widget Web interactif', description: 'Intégrez un assistant vocal directement sur votre site web pour vos visiteurs.', steps: ['Personnaliser le style', 'Choisir l\'agent', 'Copier le code d\'intégration'] },
        en: { title: 'Website Widget', description: 'Embed an AI voice chat widget on your site for visitors.', steps: ['Style the widget', 'Pick an agent', 'Copy the embed code'] },
    },
    'quick-crm': {
        icon: KanbanSquare, accent: 'warm',
        fr: { title: 'Pipeline CRM Rapide', description: 'Pilotez vos opportunités commerciales sur un tableau Kanban interactif.', steps: ['Glisser entre les étapes', 'Qualifier les prospects', 'Conclure les ventes'] },
        en: { title: 'Quick CRM', description: 'Manage your leads on a drag-and-drop pipeline board.', steps: ['Drag between stages', 'Qualify leads', 'Close deals'] },
    },
    'incoming-connections': {
        icon: PhoneIncoming, accent: 'brand',
        fr: { title: 'Connexions entrantes', description: 'Acheminez les appels entrants vers le bon agent vocal selon la ligne composée.', steps: ['Choisir un numéro', 'Définir l\'action', 'Lier à un agent vocal'] },
        en: { title: 'Incoming Connections', description: 'Route inbound callers to the right AI agent.', steps: ['Pick a number', 'Choose an action', 'Connect to an agent'] },
    },
    'google-sheets': {
        icon: Table, accent: 'signal',
        fr: { title: 'Google Sheets', description: 'Synchronisez automatiquement vos formulaires et rendez-vous vers votre tableur Google Sheets.', steps: ['Connecter votre compte', 'Sélectionner les flux', 'Données injectées en direct'] },
        en: { title: 'Google Sheets', description: 'Push form and appointment data to Google Sheets in real time.', steps: ['Connect your account', 'Choose what to sync', 'Data flows in real time'] },
    },
    'gift-cards': {
        icon: Gift, accent: 'warm',
        fr: { title: 'Cartes cadeaux', description: 'Émettez et gérez des cartes cadeaux numériques pour récompenser vos clients.', steps: ['Créer une carte', 'Envoyer au bénéficiaire', 'Suivre les utilisations'] },
        en: { title: 'Gift Cards', description: 'Issue and track branded gift cards for your customers.', steps: ['Create a gift card', 'Send to a recipient', 'Track redemptions'] },
    },
    'vouchers': {
        icon: TicketPercent, accent: 'signal',
        fr: { title: 'Bons de réduction', description: 'Créez des codes promo et maîtrisez précisément leurs conditions d\'application.', steps: ['Définir la réduction', 'Fixer les limites', 'Partager le code'] },
        en: { title: 'Vouchers', description: 'Create discount codes and control how they are used.', steps: ['Set the discount', 'Add usage limits', 'Share the code'] },
    },
    'referral': {
        icon: Share2, accent: 'cold',
        fr: { title: 'Programme de parrainage', description: 'Mettez en place un système de récompenses pour inciter vos clients à vous recommander.', steps: ['Activer le programme', 'Définir les gains', 'Suivre les parrainages'] },
        en: { title: 'Referral Program', description: 'Reward customers who bring you new business.', steps: ['Enable the program', 'Set the rewards', 'Track referrals'] },
    },
};

/** Helper to retrieve localized feature overview based on current language ('fr' or 'en') */
export function getFeatureOverview(key, lang = 'fr') {
    const item = OVERVIEWS[key];
    if (!item) return null;
    const l = (lang || 'fr').startsWith('fr') ? 'fr' : 'en';
    const content = item[l] || item.fr || item.en || {};
    return {
        icon: item.icon,
        accent: item.accent,
        title: content.title,
        description: content.description,
        steps: content.steps || [],
    };
}

/** Legacy backwards compatibility */
export const FEATURE_OVERVIEWS = new Proxy({}, {
    get: (_, prop) => getFeatureOverview(prop, 'fr'),
});
