'use client';


import { Trans } from 'react-i18next';
import { route } from '@/lib/route';
import { useState } from 'react';
import { Link, usePage } from '@/lib/page-router';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Reveal, Eyebrow, WaveBars, SectionHead, Counter } from '@/components/marketing/ui';
import { FAQ_FLAT } from '@/components/marketing/faqData';
import {
    PhoneCall, ArrowRight, Play, Bot, Megaphone, Target, Check, Star, Minus,
    AudioLines, Languages, FileAudio, Workflow, Cable, ShieldCheck, MessageSquare,
    Gift, ClipboardList, Layers, Users, Plug, KeyRound, BarChart3, Server, Lock,
    Sparkles, Building2, Headphones, Briefcase, Home, Search, Code2, Gauge,
} from 'lucide-react';

/* Shared surface + accent tokens (light + dark) */
const CARD = 'mk-card-lift rounded-2xl border border-neutral-200/80 bg-white/90 backdrop-blur-sm dark:border-white/10 dark:bg-ink-900/60 dark:backdrop-blur-none';
const ACC = {
    brand: { tile: 'bg-brand-500/12 text-brand-600 ring-brand-500/20 dark:text-brand-300', dot: 'bg-brand-500', text: 'text-brand-600 dark:text-brand-300' },
    signal: { tile: 'bg-signal-500/12 text-signal-600 ring-signal-500/20 dark:text-signal-300', dot: 'bg-signal-500', text: 'text-signal-600 dark:text-signal-300' },
    warm: { tile: 'bg-warm/15 text-amber-600 ring-warm/25 dark:text-amber-300', dot: 'bg-warm', text: 'text-amber-600 dark:text-amber-300' },
    cold: { tile: 'bg-cold/12 text-cold ring-cold/25', dot: 'bg-cold', text: 'text-cold' },
};

/* ---------- hero signature (kept dark: product panel) ---------- */
function CallConsole() {
    const turns = [
        { who: 'agent', text: 'Bonjour Marcus — ici Ava de AutoCall. Avez-vous 30 secondes ?' },
        { who: 'caller', text: 'Bonjour, oui bien sûr, de quoi s\'agit-il ?' },
        { who: 'agent', text: 'Vous avez consulté notre plateforme la semaine dernière. Évaluez-vous la solution pour votre équipe ?' },
    ];
    return (
        <div className="relative">
            <div className="pointer-events-none absolute -inset-8 -z-10" aria-hidden="true">
                <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-brand-500/25 blur-[90px]" />
                <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-signal-500/20 blur-[90px]" />
            </div>
            <div className="floaty absolute -left-4 top-6 z-20 hidden rounded-xl border border-white/10 bg-ink-900 px-3 py-2 shadow-2xl backdrop-blur sm:block">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Sentiment</p>
                <p className="text-sm font-semibold text-signal-400">Positif · 0.86</p>
            </div>
            <div className="floaty d2 absolute -right-4 bottom-16 z-20 hidden rounded-xl border border-white/10 bg-ink-900 px-3 py-2 shadow-2xl backdrop-blur sm:block">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Résultat</p>
                <p className="text-sm font-semibold text-white">+1 lead qualifié</p>
            </div>
            <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-ink-900 shadow-[0_40px_120px_-30px_rgba(109,63,234,0.5)]">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
                <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/40"><Bot className="h-5 w-5" /></span>
                            <div>
                                <p className="text-sm font-semibold text-white">Ava · Qualification Commerciale</p>
                                <p className="font-mono text-[11px] text-neutral-500">ElevenLabs + Twilio · FR-FR</p>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-500/30 bg-signal-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-signal-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-signal-400 animate-pulse-signal" /> En direct · 00:47
                        </span>
                    </div>
                    <div className="mt-5 rounded-2xl border border-white/5 bg-ink-950/60 p-4"><WaveBars count={48} h="h-14" /></div>
                    <div className="mt-5 space-y-3">
                        {turns.map((t, i) => (
                            <div key={i} className={`flex ${t.who === 'agent' ? '' : 'justify-end'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${t.who === 'agent' ? 'rounded-tl-sm bg-brand-500/12 text-brand-50 ring-1 ring-brand-400/20' : 'rounded-tr-sm bg-white/[0.06] text-neutral-200 ring-1 ring-white/10'}`}>
                                    <span className="mb-0.5 block font-mono text-[9px] uppercase tracking-widest text-neutral-500">{t.who === 'agent' ? 'Ava' : 'Marcus'}</span>
                                    {t.text}
                                    {i === turns.length - 1 && <span className="caret ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 bg-signal-400" />}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 rounded-2xl border border-white/5 bg-ink-950/60 p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Score du prospect</p>
                            <p className="font-mono text-xs font-semibold text-warm">TIÈDE · 72</p>
                        </div>
                        <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                            <div className="sweep h-full rounded-full" style={{ width: '72%', background: 'linear-gradient(90deg,#4fb0ff,#ffb23e 70%,#fb5e5e)' }} />
                            <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-950 bg-white shadow" style={{ left: '72%' }} />
                        </div>
                        <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-wider text-neutral-600"><span className="text-cold">Froid</span><span className="text-warm">Tiède</span><span className="text-hot">Chaud</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const PROVIDERS = ['Twilio', 'Plivo', 'ElevenLabs', 'OpenAI', 'HubSpot', 'Salesforce', 'Pipedrive', 'Zapier'];

const STEPS = [
    { n: '01', icon: Bot, title: 'Concevez votre agent IA', text: 'Sélectionnez une voix, définissez l\'objectif, la personnalité et les connaissances. Rédigez l\'accroche et laissez l\'agent improviser avec brio — ou utilisez un modèle de prompt.', chips: ['Voix naturelle', 'Objectif de vente', 'Base RAG'] },
    { n: '02', icon: Megaphone, title: 'Lancez votre campagne', text: 'Importez votre liste de contacts, choisissez le moteur téléphonique et planifiez les créneaux. Le dialer gère la concurrence, les quotas et les relances automatiquement.', chips: ['Import CSV', 'Planification', 'Auto-relance'] },
    { n: '03', icon: Target, title: 'Récoltez les leads qualifiés', text: 'Chaque appel est enregistré, transcrit et noté Chaud / Tiède / Froid en direct, puis synchronisé instantanément avec votre CRM et vos flux automatisés.', chips: ['Score en direct', 'Transcription IA', 'Sync CRM'] },
];

const CORE = [
    { span: 'lg:col-span-2', icon: Target, title: 'Qualification des leads en direct', text: 'Chaque conversation est évaluée Chaud, Tiède ou Froid en temps réel — avec analyse de sentiment et synthèse IA — pour que vos équipes ciblent les meilleures opportunités en priorité.', viz: (
        <div className="mt-5 flex flex-wrap gap-2">
            {[['Chaud', 'text-hot', 'bg-hot/10 ring-hot/25', '38'], ['Tiède', 'text-warm', 'bg-warm/10 ring-warm/25', '124'], ['Froid', 'text-cold', 'bg-cold/10 ring-cold/25', '291']].map(([l, c, bg, n]) => (
                <span key={l} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ${bg} ${c}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{l}<span className="font-mono text-xs opacity-70">{n}</span></span>
            ))}
        </div>) },
    { span: '', icon: AudioLines, title: 'Voix ultra-naturelles', text: 'Synthèse vocale ultra-réaliste avec gestion du ton, des émotions et des respirations via ElevenLabs et OpenAI.', viz: <div className="mt-5"><WaveBars count={26} h="h-9" /></div> },
    { span: '', icon: Languages, title: '29 langues supportées', text: 'Détectez, échangez et qualifiez dans la langue maternelle et l\'accent spécifique de votre interlocuteur.', viz: (
        <div className="mt-5 flex flex-wrap gap-1.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">{['FR', 'EN', 'ES', 'DE', 'IT', 'PT', 'AR', 'HI', '+21'].map((x) => <span key={x} className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 dark:border-white/10 dark:bg-white/[0.03]">{x}</span>)}</div>) },
    { span: 'lg:col-span-2', icon: FileAudio, title: 'Enregistrements & transcriptions complètes', text: 'Enregistrement audio automatique, transcription textuelle intégrale par IA, synthèses exploitables et historique consultable.', viz: (
        <div className="mt-5 space-y-1.5 rounded-xl border border-neutral-200 bg-neutral-50 p-3 font-mono text-xs dark:border-white/5 dark:bg-ink-950/40">
            <p className="text-brand-600 dark:text-brand-300"><span className="text-neutral-400 dark:text-neutral-600">00:12 </span>Ava: …évaluez-vous la solution pour votre équipe commerciale ?</p>
            <p className="text-neutral-700 dark:text-neutral-300"><span className="text-neutral-400 dark:text-neutral-600">00:15 </span>Marcus: oui tout à fait, nous sommes environ huit collaborateurs.</p>
            <p className="text-signal-600 dark:text-signal-300"><span className="text-neutral-400 dark:text-neutral-600">résumé </span>Équipe de 8 personnes · budget validé · démonstration planifiée</p>
        </div>) },
    { span: '', icon: Workflow, title: 'Créateur de flux visuel (Flows)', text: 'Automatisez les suites d\'appels : envoi de SMS/WhatsApp, prise de rendez-vous ou transfert vers un conseiller.', viz: (
        <div className="mt-5 flex items-center gap-2 font-mono text-[11px]"><span className="rounded-md bg-signal-500/10 px-2 py-1 text-signal-600 dark:text-signal-300">Déclencheur</span><span className="text-neutral-400">→</span><span className="rounded-md bg-warm/10 px-2 py-1 text-amber-600 dark:text-warm">Si Chaud</span><span className="text-neutral-400">→</span><span className="rounded-md bg-brand-500/10 px-2 py-1 text-brand-600 dark:text-brand-300">Rendez-vous</span></div>) },
    { span: '', icon: Cable, title: 'Synchronisation CRM & Webhooks', text: 'Transmettez les prospects qualifiés en temps réel vers tous vos outils métiers.', viz: (
        <div className="mt-5 flex flex-wrap gap-1.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">{['Salesforce', 'HubSpot', 'Pipedrive', 'Webhook'].map((x) => <span key={x} className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 dark:border-white/10 dark:bg-white/[0.03]">{x}</span>)}</div>) },
];

const MODULES = [
    { icon: Bot, cat: 'Agents Vocaux IA', accent: 'brand', desc: 'Créez des agents conversationnels avec un objectif, une personnalité et des connaissances précises — puis laissez-les échanger au téléphone.', items: ['Voix, personnalité et objectifs sur-mesure', 'Bibliothèque de modèles de prompts', 'Ancrage sur base de connaissances (RAG)', 'Choix du moteur d\'appel par agent'] },
    { icon: PhoneCall, cat: 'Appels Sortants & Campagnes', accent: 'signal', desc: 'Contactez des milliers de prospects grâce à un composeur intelligent qui régule sa cadence sans interruption.', items: ['Campagnes massives & planification horaire', 'Dialer avec contrôle de la concurrence', 'Relances automatiques & quotas journaliers', 'Enregistrements audio & transcriptions'] },
    { icon: Target, cat: 'Intelligence des Leads', accent: 'warm', desc: 'Notez et synthétisez chaque conversation dès qu\'elle se termine, sans relecture manuelle.', items: ['Scoring Chaud / Tiède / Froid en direct', 'Analyse fine des sentiments de l\'interlocuteur', 'Synthèse d\'appel générée par l\'IA', 'Rapports statistiques en temps réel'] },
    { icon: Workflow, cat: 'Automatisation & Flux', accent: 'brand', desc: 'Déclenchez des actions concrètes selon l\'issue de l\'appel grâce au créateur visuel de scénarios.', items: ['Constructeur visuel de scénarios par nœuds', 'Embranchements selon le résultat de l\'appel', 'Modèles prêts à l\'emploi & journaux d\'exécution', 'Déclencheurs, conditions & actions connectées'] },
    { icon: MessageSquare, cat: 'Messagerie Multi-canal', accent: 'cold', desc: 'Assurez le suivi de vos contacts par SMS, WhatsApp et Email depuis une boîte de réception unifiée.', items: ['Canaux SMS, WhatsApp & Email centralisés', 'Modèles de messages réutilisables', 'Boîte de réception conversationnelle', 'Relances post-appel automatisées'] },
    { icon: Gift, cat: 'Croissance & Fidélisation', accent: 'warm', desc: 'Boostez vos conversions avec des bons de réduction, des cartes cadeaux et un programme de parrainage.', items: ['Bons d\'achat & codes promotionnels', 'Cartes cadeaux personnalisées à votre marque', 'Programme de parrainage intégré', 'Pipeline CRM Kanban pour vos opportunités'] },
    { icon: ClipboardList, cat: 'Outils de Conversion', accent: 'signal', desc: 'Captez et orientez vos prospects avec des formulaires, un calendrier de rendez-vous et un widget web.', items: ['Générateur de formulaires & réponses en direct', 'Prise de rendez-vous en ligne automatique', 'Widget vocal interactif pour site web', 'Routage intelligent des appels entrants', 'Synchronisation bidirectionnelle Google Sheets'] },
    { icon: Plug, cat: 'Intégrations & API REST', accent: 'cold', desc: 'Connectez n\'importe quel service grâce à l\'API REST complète, aux webhooks et aux trunks SIP personnalisés.', items: ['API REST documentée & clés d\'accès sécurisées', 'Webhooks entrants et sortants en temps réel', 'Synchronisation CRM fluide (HubSpot, Salesforce)', 'Support SIP (Bring Your Own Carrier)'] },
    { icon: Layers, cat: 'Super-Admin & Multi-tenant', accent: 'brand', desc: 'Pilotez l\'ensemble de la plateforme, de vos clients et des appels depuis la console d\'administration.', items: ['Gestion multi-entreprises & connexion impersonation', 'Surveillance des appels en direct', 'Gestion des tâches d\'arrière-plan en lot', 'Rôles, permissions RBAC & journal d\'audit'] },
    { icon: KeyRound, cat: 'Facturation & Abonnements', accent: 'signal', desc: 'Facturez vos clients par crédits ou forfaits récurrents avec plusieurs passerelles de paiement.', items: ['Facturation basée sur la consommation de crédits', 'Gestion des plans d\'abonnement récurrents', 'Passerelles de paiement (Stripe, PayPal, Paddle)', 'Gestion multi-devises & factures automatiques'] },
];

const USE_CASES = [
    { icon: Briefcase, title: 'Prospection & Vente B2B', text: 'Qualifiez vos prospects entrants et sortants à grande échelle, fixez des rendez-vous et transmettez les leads chauds à vos commerciaux instantanément.', line: 'Ava : « Évaluez-vous la solution pour votre équipe ? » — Marcus : « Oui, nous sommes huit collaborateurs. »', outcome: 'Démonstration réservée · Lead chaud', accent: 'brand' },
    { icon: Users, title: 'Recrutement & RH', text: 'Présélectionnez les candidats par téléphone, validez leurs disponibilités et compétences clés avant le premier échange avec un recruteur.', line: 'Léo : « Êtes-vous ouvert à un poste senior en télétravail ? » — « Tout à fait, quand pouvons-nous échanger ? »', outcome: 'Candidat présélectionné', accent: 'signal' },
    { icon: Home, title: 'Immobilier', text: 'Contactez immédiatement les acquéreurs et locataires ayant déposé une demande, cernez leur projet et planifiez les visites 24h/24.', line: 'Sol : « Êtes-vous toujours intéressé par l\'appartement T3 ? » — « Puis-je le visiter ce samedi ? »', outcome: 'Visite programmée', accent: 'warm' },
    { icon: Search, title: 'Sondages & Études', text: 'Réalisez des enquêtes téléphoniques multilingues et recueillez des réponses claires, retranscrites et structurées automatiquement.', line: 'Mia : « Sur une échelle de 1 à 5, comment évaluez-vous notre service ? » — « Je donnerais un cinq. »', outcome: 'Réponse enregistrée', accent: 'cold' },
    { icon: Headphones, title: 'Rappels SAV & Support', text: 'Rappelez automatiquement les appels manqués, effectuez un premier diagnostic et transférez uniquement les demandes prioritaires.', line: 'Nia : « Navrés de vous avoir manqué — un rappel à 15h vous conviendrait-il ? » — « Parfait, merci. »', outcome: 'Rappel programmé', accent: 'brand' },
    { icon: Building2, title: 'Agences & Revendeurs', text: 'Déployez des espaces clients isolés sous votre propre marque et revendez le service d\'appels IA à vos propres tarifs.', line: 'Espace client « Agence Digitale » activé · 3 agents déployés · 100% marque blanche.', outcome: 'Service revendu en marque blanche', accent: 'signal' },
];

const COMPARE_ROWS = [
    ['Délai de lancement', 'Plusieurs mois', 'Plusieurs semaines', 'Le jour même'],
    ['Véritables conversations par IA', false, false, true],
    ['Scoring Chaud / Tiède / Froid', false, false, true],
    ['Cœur SaaS multi-tenant & facturation', false, false, true],
    ['Propriété intégrale du code source', true, false, true],
    ['Liberté totale des fournisseurs IA', true, false, true],
    ['Contrôle et supervision Super-Admin', false, 'Limité', true],
];

const SECURITY = [
    { icon: Lock, title: 'Identifiants chiffrés', text: 'Vos clés d\'API et secrets fournisseurs sont stockés de manière sécurisée et chiffrée, jamais exposés au navigateur.' },
    { icon: ShieldCheck, title: 'Rôles RBAC & Journal d\'audit', text: 'Gestion fine des permissions par rôle avec traçabilité complète de l\'ensemble des actions sensibles.' },
    { icon: Gauge, title: 'Performance & Haute capacité', text: 'Composeur asynchrone piloté par file d\'attente avec répartition de charge sur vos clés vocales.' },
    { icon: Server, title: 'Auto-hébergé & Maîtrisé', text: 'Déployable sur n\'importe quel VPS, serveur dédié ou conteneur. Votre code, vos données, votre souveraineté.' },
];
const STACK = [
    { l: 'Next.js 15 + React 19', d: 'App Router, Server Actions, SSR ultra-rapide', a: 'brand' },
    { l: 'Prisma 6 + MySQL 8', d: 'Modélisation typée, schéma relationnel robuste', a: 'signal' },
    { l: 'Worker & Planificateur', d: 'Dialer intelligent avec gestion des files d\'attente', a: 'warm' },
    { l: 'Moteurs connectés', d: 'Twilio · Plivo · ElevenLabs · OpenAI · SIP', a: 'cold' },
];

const METRICS = [
    { v: '12 000+', l: 'Appels / heure', s: 'dialer optimisé pour la concurrence' },
    { v: '29', l: 'Langues', s: 'avec accents régionaux natifs' },
    { v: '0:47', l: 'Temps moyen de qualification', s: 'par conversation téléphonique' },
    { v: '99.9%', l: 'Disponibilité maximale', s: 'grâce au pool vocal équilibré' },
];

const DELIVERABLES = [
    ['Deux interfaces complètes', 'Espace client moderne + console de gestion Super-Admin.'],
    ['Architecture SaaS multi-tenant', 'Gestion des comptes clients, forfaits, crédits et paiements.'],
    ['Documentation complète', 'Guides pas-à-pas pour l\'installation, la configuration et l\'exploitation.'],
    ['Mises à jour régulières', 'Nouvelles fonctionnalités, correctifs et améliorations continues.'],
    ['Support technique inclus', 'Assistance à l\'installation et résolution rapide des anomalies.'],
    ['Personnalisation en marque blanche', 'Nom, logo, palette graphique, langues et devises modifiables.'],
    ['API REST & Webhooks', 'Intégration immédiate avec l\'ensemble de vos outils existants.'],
];

const TESTIMONIALS = [
    { q: 'Cette solution a remplacé une équipe de 5 téléprospecteurs sur notre prospection sortante. L\'agent IA qualifie les leads pendant que nous dormons, et les contacts arrivent dans HubSpot déjà scorés. Notre première campagne a rentabilisé l\'investissement annuel en 48 heures.', n: 'Dana Reyes', r: 'Directrice de la Croissance · Northwind SaaS', i: 'DR', featured: true },
    { q: 'Nous avons déployé la solution en marque blanche et revendu le service d\'appels IA à douze clients dès le premier mois. L\'interface multi-tenant a rendu l\'onboarding ultra simple.', n: 'Samir Khan', r: 'Fondateur · Agence Dialworks', i: 'SK' },
    { q: 'L\'installation a pris un après-midi. Nous avons renseigné nos clés Twilio et ElevenLabs, importé nos contacts et lancé la première campagne. Tout a fonctionné du premier coup.', n: 'Elena Voss', r: 'Responsable RevOps · Kestrel', i: 'EV' },
];

const PLANS = [
    { name: 'Starter', m: 29, a: 24, blurb: 'Idéal pour démarrer et tester vos premières campagnes.', features: ['1 agent IA dédié', '500 crédits d\'appels', '2 langues supportées', 'Enregistrements & transcriptions'], cta: 'Commencer gratuitement', highlight: false },
    { name: 'Growth', m: 79, a: 66, blurb: 'Pour les équipes en croissance qui prospectent activement.', features: ['5 agents IA configurables', '5 000 crédits d\'appels', 'Les 29 langues incluses', 'Scoring des leads & sync CRM', 'Flux automatisés & webhooks'], cta: 'Essai gratuit', highlight: true },
    { name: 'Scale', m: 199, a: 166, blurb: 'Pour les entreprises et agences à fort volume d\'appels.', features: ['Agents IA illimités', '25 000 crédits d\'appels', 'Dialer prioritaire haute cadence', 'Support SIP & Trunk personnalisé', 'Rôles d\'équipe & journal d\'audit'], cta: 'Nous contacter', highlight: false },
];

/* ---------- interactive: module explorer ---------- */
function ModuleExplorer() {
    const [active, setActive] = useState(0);
    const m = MODULES[active];
    const a = ACC[m.accent];
    return (
        <div className="mt-12 grid gap-4 lg:grid-cols-[300px_1fr]">
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                {MODULES.map((mod, i) => {
                    const on = i === active;
                    const ac = ACC[mod.accent];
                    return (
                        <button key={mod.cat} onClick={() => setActive(i)} aria-pressed={on}
                            className={`group flex shrink-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm transition lg:w-full ${on ? 'border-neutral-300 bg-white shadow-soft dark:border-white/15 dark:bg-white/[0.06] dark:shadow-none' : 'border-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/[0.03]'}`}>
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${ac.tile}`}><mod.icon className="h-4 w-4" /></span>
                            <span className={`font-medium ${on ? 'text-neutral-900 dark:text-white' : ''}`}>{mod.cat}</span>
                        </button>
                    );
                })}
            </div>
            <div className={`relative overflow-hidden ${CARD} p-6 sm:p-8`}>
                <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full ${a.dot} opacity-[0.07] blur-3xl`} />
                <div className="relative flex items-start gap-4">
                    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 ${a.tile}`}><m.icon className="h-7 w-7" /></span>
                    <div>
                        <h3 className="font-display text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{m.cat}</h3>
                        <p className="mt-1.5 max-w-lg text-neutral-600 dark:text-neutral-400">{m.desc}</p>
                    </div>
                </div>
                <div className="relative mt-6 grid gap-2.5 sm:grid-cols-2">
                    {m.items.map((x) => (
                        <div key={x} className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 dark:border-white/5 dark:bg-white/[0.02] dark:text-neutral-300">
                            <Check className={`h-4 w-4 shrink-0 ${a.text}`} />{x}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ---------- interactive: use-case tabs ---------- */
function UseCaseTabs() {
    const [active, setActive] = useState(0);
    const u = USE_CASES[active];
    const a = ACC[u.accent];
    return (
        <div className="mt-12">
            <div className="flex flex-wrap gap-2">
                {USE_CASES.map((uc, i) => {
                    const on = i === active;
                    return (
                        <button key={uc.title} onClick={() => setActive(i)} aria-pressed={on}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${on ? 'border-transparent bg-brand-600 text-white shadow-lg shadow-brand-600/30' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:text-neutral-400 dark:hover:bg-white/[0.04]'}`}>
                            <uc.icon className="h-4 w-4" />{uc.title}
                        </button>
                    );
                })}
            </div>
            <div className={`mt-6 grid items-center gap-8 ${CARD} p-6 sm:p-10 lg:grid-cols-2`}>
                <div>
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${a.tile}`}><u.icon className="h-6 w-6" /></span>
                    <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{u.title}</h3>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">{u.text}</p>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-signal-500/10 px-3 py-1.5 text-sm font-medium text-signal-600 dark:text-signal-300"><Check className="h-4 w-4" /> {u.outcome}</div>
                </div>
                {/* scenario mock */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-white"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700"><Bot className="h-3.5 w-3.5" /></span>Appel en cours</span>
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-signal-300"><span className="h-1.5 w-1.5 rounded-full bg-signal-400 animate-pulse-signal" /> 00:31</span>
                    </div>
                    <div className="mt-4"><WaveBars count={30} h="h-8" /></div>
                    <p className="mt-4 rounded-xl bg-white/[0.05] px-3.5 py-2.5 text-sm text-neutral-200 ring-1 ring-white/10">{u.line}</p>
                    <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-neutral-500"><span className="rounded bg-signal-500/15 px-1.5 py-0.5 text-signal-300">résultat</span> {u.outcome}</div>
                </div>
            </div>
        </div>
    );
}

function FaqPreview() {
    const [open, setOpen] = useState(0);
    const items = FAQ_FLAT.slice(0, 6);
    return (
        <div className={`mx-auto mt-12 max-w-3xl divide-y divide-neutral-200 overflow-hidden ${CARD} dark:divide-white/10`}>
            {items.map((f, i) => (
                <div key={i}>
                    <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left" aria-expanded={open === i}>
                        <span className="font-medium text-neutral-900 dark:text-white">{f.q}</span>
                        <span className={`shrink-0 rounded-md border border-neutral-200 p-1 text-neutral-500 transition dark:border-white/10 dark:text-neutral-400 ${open === i ? 'rotate-45 text-brand-500 dark:text-brand-300' : ''}`}><Sparkles className="h-3.5 w-3.5" /></span>
                    </button>
                    {open === i && <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{f.a}</p>}
                </div>
            ))}
        </div>
    );
}

export default function Welcome() {
    const page = usePage().props;
    const user = page?.auth?.user;
    const brand = page?.branding?.system_title || 'AutoCall';
    const primaryHref = user ? route('client.dashboard') : route('register');
    const primaryLabel = user ? 'Accéder au tableau de bord' : 'Démarrer gratuitement';
    const [annual, setAnnual] = useState(false);

    const schema = {
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: brand, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
        description: 'Agents vocaux par IA pour passer des appels sortants, qualifier les prospects Chaud / Tiède / Froid et les synchroniser avec votre CRM.',
        offers: { '@type': 'Offer', price: '29', priceCurrency: 'EUR' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '127' },
    };

    return (
        <MarketingLayout schema={schema}>
            {/* ===== Hero ===== */}
            <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
                <div className="pointer-events-none absolute inset-x-0 -top-40 z-0 h-[40rem]" aria-hidden="true">
                    <div className="absolute left-1/2 top-0 h-[30rem] w-[54rem] -translate-x-1/2 rounded-full bg-brand-500/25 blur-[120px] dark:bg-brand-600/20" />
                    <div className="absolute left-1/4 top-24 h-72 w-72 rounded-full bg-signal-500/20 blur-[100px] dark:bg-signal-500/15" />
                    <div className="absolute right-1/4 top-10 h-72 w-72 rounded-full bg-cold/15 blur-[110px] dark:bg-transparent" />
                </div>
                <div className="mk-beam grid-mask pointer-events-none absolute inset-x-0 -top-24 z-0 h-[38rem]" aria-hidden="true" />
                <div className="grid-field hero-grid-mask pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
                <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
                    <div>
                        <Reveal><span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1.5 backdrop-blur dark:border-white/10 dark:bg-white/[0.04]"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-400 opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-signal-500" /></span><span className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-300">Opérateur vocal IA · En direct</span></span></Reveal>
                        <Reveal delay={80}><h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.03] tracking-tight text-neutral-900 dark:text-white sm:text-6xl lg:text-[4.1rem]">Des agents IA qui <span className="bg-gradient-to-r from-brand-500 via-brand-400 to-signal-500 bg-clip-text text-transparent dark:from-brand-300 dark:via-brand-400 dark:to-signal-400">appellent, échangent</span> et qualifient vos prospects.</h1></Reveal>
                        <Reveal delay={160}><p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">Configurez votre agent vocal, lancez une campagne massive et laissez l'IA mener de vraies conversations téléphoniques — enregistrées, transcrites et scorées Chaud / Tiède / Froid en direct, puis synchronisées avec votre CRM. Une plateforme tout-en-un, auto-hébergée et multi-tenant.</p></Reveal>
                        <Reveal delay={240}><div className="mt-9 flex flex-wrap items-center gap-3">
                            <Link href={primaryHref} className="sheen group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-brand-600/40 transition hover:bg-brand-500">{primaryLabel} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></Link>
                            <a href="#how" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-800 shadow-soft transition hover:bg-neutral-50 dark:border-white/12 dark:bg-white/[0.04] dark:text-white dark:shadow-none dark:hover:bg-white/[0.08]"><Play className="h-4 w-4 text-signal-500 dark:text-signal-400" /> Découvrir le fonctionnement</a>
                        </div></Reveal>
                        <Reveal delay={320}><div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-neutral-500">
                            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-signal-500 dark:text-signal-400" /> Code source 100% maîtrisé</span>
                            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-signal-500 dark:text-signal-400" /> Vos propres clés API</span>
                            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-signal-500 dark:text-signal-400" /> Déploiement en quelques minutes</span>
                        </div></Reveal>
                    </div>
                    <Reveal delay={200} className="lg:pl-4"><CallConsole /></Reveal>
                </div>
            </section>

            {/* ===== Trust marquee ===== */}
            <section id="integrations" className="scroll-mt-24 border-y border-neutral-200 mk-wash py-8 dark:border-white/5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">Connecté aux outils et plateformes que vous utilisez déjà</p>
                    <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
                        <div className="marq flex w-max items-center gap-14 whitespace-nowrap pr-14">{[...PROVIDERS, ...PROVIDERS].map((p, i) => <span key={i} className="font-display text-xl font-semibold text-neutral-400 dark:text-neutral-500/70">{p}</span>)}</div>
                    </div>
                </div>
            </section>

            {/* ===== Problem → solution ===== */}
            <section className="py-24">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="mx-auto max-w-2xl text-center">
                        <Eyebrow className="justify-center">Pourquoi AutoCall</Eyebrow>
                        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">La majorité des prospects s'évaporent en attendant un rappel.</h2>
                        <p className="mt-4 text-neutral-600 dark:text-neutral-400">Vos équipes commerciales ne peuvent pas composer assez vite. Les relances prennent du retard, les fuseaux horaires se chevauchent et les meilleurs leads refroidissent. Recruter coûte cher — et ne couvre ni les soirs ni les week-ends.</p>
                    </Reveal>
                    <Reveal delay={120}>
                        <div className="relative mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
                            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-white/10 dark:bg-ink-900/40">
                                <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">L'ancienne méthode</p>
                                <ul className="mt-4 space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                                    {['Les prospects attendent des heures avant d\'être recontactés', 'Vos commerciaux perdent leur temps sur des prospects non qualifiés', 'Aucune couverture après 18h ni les week-ends', 'Les relances indispensables passent trop souvent à la trappe'].map((x) => <li key={x} className="flex items-start gap-2.5"><Minus className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-600" />{x}</li>)}
                                </ul>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-signal-500 text-white shadow-lg shadow-brand-600/40"><ArrowRight className="h-5 w-5 lg:rotate-0" /></span>
                            </div>
                            <div className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/[0.08] to-transparent p-6 dark:from-brand-500/10">
                                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-500/20 blur-2xl" />
                                <p className="relative inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-brand-600 dark:text-brand-300"><Sparkles className="h-3.5 w-3.5" /> Avec {brand}</p>
                                <ul className="relative mt-4 space-y-3 text-sm text-neutral-800 dark:text-neutral-200">
                                    {['Chaque prospect est appelé en quelques minutes seulement', 'Seuls les leads chauds et qualifiés sont transmis aux commerciaux', 'Des agents disponibles 24h/24 et 7j/7, dans toutes les langues', 'Des flux de relance et de prise de rendez-vous 100% automatiques'].map((x) => <li key={x} className="flex items-start gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-signal-500 dark:text-signal-400" />{x}</li>)}
                                </ul>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ===== How it works ===== */}
            <section id="how" className="scroll-mt-24 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal><SectionHead eyebrow="Fonctionnement" title="De zéro à des prospects qualifiés en trois étapes." sub="Aucun composeur manuel à surveiller. Aucun script rigide à mémoriser. Définissez votre objectif et laissez l'agent IA mener les échanges téléphoniques." /></Reveal>
                    <div className="relative mt-16">
                        <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent md:block" aria-hidden="true" />
                        <div className="grid gap-6 md:grid-cols-3">
                            {STEPS.map((s, i) => (
                                <Reveal key={s.n} delay={i * 120}>
                                    <div className="relative">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white font-mono text-sm font-bold text-brand-600 shadow-soft dark:border-white/15 dark:bg-ink-900 dark:text-brand-300 dark:shadow-none">{s.n}</div>
                                        <div className={`mt-6 h-full ${CARD} group p-6 transition hover:-translate-y-1`}>
                                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/12 text-brand-600 ring-1 ring-brand-500/20 dark:text-brand-300"><s.icon className="h-5 w-5" /></span>
                                            <h3 className="mt-4 font-display text-lg font-semibold text-neutral-900 dark:text-white">{s.title}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{s.text}</p>
                                            <div className="mt-4 flex flex-wrap gap-1.5">{s.chips.map((c) => <span key={c} className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-400">{c}</span>)}</div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== The calling engine ===== */}
            <section id="features" className="scroll-mt-24 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal><SectionHead eyebrow="Moteur d'appels" title="Une suite téléphonique complète, pas un simple chatbot." /></Reveal>
                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {CORE.map((f, i) => (
                            <Reveal key={f.title} delay={(i % 3) * 90} className={f.span}>
                                <div className={`group relative flex h-full flex-col overflow-hidden ${CARD} p-6 transition hover:border-brand-300 dark:hover:border-white/20`}>
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-signal-500/20 text-brand-600 ring-1 ring-brand-500/20 dark:text-brand-200 dark:ring-white/10"><f.icon className="h-5 w-5" /></span>
                                    <h3 className="mt-4 font-display text-lg font-semibold text-neutral-900 dark:text-white">{f.title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{f.text}</p>{f.viz}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

             {/* ===== Inside the product ===== */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="mx-auto max-w-2xl text-center"><SectionHead center eyebrow="Au cœur du produit" title="Un tableau de bord intuitif que toute votre équipe adoptera." /></Reveal>
                    <Reveal delay={120}>
                        <div className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-ink-900/90 shadow-[0_40px_120px_-40px_rgba(109,63,234,0.5)]">
                            <div className="flex items-center gap-2 border-b border-white/10 bg-ink-950/60 px-4 py-3">
                                <span className="h-3 w-3 rounded-full bg-hot/70" /><span className="h-3 w-3 rounded-full bg-warm/70" /><span className="h-3 w-3 rounded-full bg-signal-500/70" />
                                <span className="ml-3 font-mono text-[11px] text-neutral-500">app / tableau-de-bord</span>
                            </div>
                            <div className="grid gap-4 p-5 sm:grid-cols-4">
                                {[['Appels (30j)', '4 182'], ['Taux de succès', '68%'], ['Qualifiés', '1 204'], ['Durée moyenne', '1:12']].map(([l, v]) => (
                                    <div key={l} className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{l}</p><p className="mt-1 font-display text-2xl font-bold text-white">{v}</p></div>
                                ))}
                                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-3">
                                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Appels de la semaine</p>
                                    <div className="mt-4 flex items-end gap-2">{[40, 62, 48, 80, 68, 92, 74].map((h, i) => <span key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-brand-400" style={{ height: `${h}px` }} />)}</div>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Répartition des leads</p>
                                    <div className="mt-4 space-y-2">{[['Chaud', 'bg-hot', '30%'], ['Tiède', 'bg-warm', '45%'], ['Froid', 'bg-cold', '25%']].map(([l, c, w]) => (<div key={l}><div className="flex justify-between text-[11px] text-neutral-400"><span>{l}</span><span className="font-mono">{w}</span></div><div className="mt-1 h-1.5 rounded-full bg-white/5"><div className={`h-full rounded-full ${c}`} style={{ width: w }} /></div></div>))}</div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ===== Everything included ===== */}
            <section className="border-y border-neutral-200 mk-wash py-24 dark:border-white/5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal><SectionHead center eyebrow="Tout est inclus" title="Dix modules puissants. Une seule plateforme." sub="Découvrez chaque capacité — du premier appel émis jusqu'au lead qualifié dans votre CRM." /></Reveal>
                    <Reveal delay={100}><ModuleExplorer /></Reveal>
                </div>
            </section>

            {/* ===== Use cases ===== */}
            <section id="usecases" className="scroll-mt-24 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal><SectionHead eyebrow="Cas d'usage" title="Une plateforme, une multitude de scénarios métiers." sub="Dès que votre activité nécessite de qualifier des personnes par téléphone, un agent IA prend le relais sur le premier contact." /></Reveal>
                    <Reveal delay={100}><UseCaseTabs /></Reveal>
                </div>
            </section>

            {/* ===== Comparison ===== */}
            <section className="border-y border-neutral-200 mk-wash py-24 dark:border-white/5">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <Reveal><SectionHead center eyebrow="Pourquoi choisir AutoCall" title="La voie royale vers un véritable produit d'appels IA." /></Reveal>
                    <Reveal delay={100}>
                        <div className={`mt-12 overflow-hidden ${CARD}`}>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-white/10">
                                        <th className="px-4 py-4 text-left font-mono text-[11px] uppercase tracking-widest text-neutral-500 sm:px-6"> </th>
                                        <th className="px-4 py-4 text-center font-semibold text-neutral-500 sm:px-6">Développer soi-même</th>
                                        <th className="px-4 py-4 text-center font-semibold text-neutral-500 sm:px-6">Composeur classique</th>
                                        <th className="px-4 py-4 text-center sm:px-6"><span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 font-semibold text-white shadow-lg shadow-brand-600/30">{brand}</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                    {COMPARE_ROWS.map(([label, ...vals]) => (
                                        <tr key={label}>
                                            <td className="px-4 py-3.5 text-neutral-700 dark:text-neutral-300 sm:px-6">{label}</td>
                                            {vals.map((v, i) => (
                                                <td key={i} className={`px-4 py-3.5 text-center sm:px-6 ${i === 2 ? 'bg-brand-500/[0.05] dark:bg-brand-500/[0.08]' : ''}`}>
                                                    {v === true ? <Check className={`mx-auto h-4 w-4 ${i === 2 ? 'text-signal-500 dark:text-signal-400' : 'text-neutral-400'}`} /> : v === false ? <Minus className="mx-auto h-4 w-4 text-neutral-300 dark:text-neutral-700" /> : <span className={`font-mono text-xs ${i === 2 ? 'font-semibold text-signal-600 dark:text-signal-300' : 'text-neutral-500'}`}>{v}</span>}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ===== Admin / multi-tenant ===== */}
            <section className="py-24">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <Reveal>
                        <Eyebrow>Prêt pour le modèle SaaS</Eyebrow>
                        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"><Trans i18nKey="hardcoded.views_welcome_ee84eca392a7" /></h2>
                        <p className="mt-4 text-neutral-600 dark:text-neutral-400"><Trans i18nKey="hardcoded.views_welcome_aa520607f550" /></p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {[['Gestion multi-clients', Users], ['Surveillance des appels en direct', BarChart3], ['Supervision des tâches en lot', Layers], ['Moteurs & fournisseurs IA', Server], ['Paiements & abonnements', KeyRound], ['Rôles, KYC & journal d\'audit', ShieldCheck]].map(([t, Icon]) => (
                                <div key={t} className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-3 shadow-soft dark:border-white/10 dark:bg-ink-900/50 dark:shadow-none"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/12 text-brand-600 dark:text-brand-300"><Icon className="h-4 w-4" /></span><span className="text-sm text-neutral-800 dark:text-neutral-200">{t}</span></div>
                            ))}
                        </div>
                    </Reveal>
                    <Reveal delay={120}>
                        <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 shadow-xl">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3"><p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">Super-Admin · Surveillance des appels</p><span className="inline-flex items-center gap-1 font-mono text-[10px] text-signal-300"><span className="h-1.5 w-1.5 rounded-full bg-signal-400 animate-pulse-signal" /> en direct</span></div>
                            <div className="mt-4 space-y-2">
                                {[['Northwind SaaS', 'Ava', 'en cours', 'text-signal-400'], ['Kestrel', 'Léo', 'sonnerie', 'text-warm'], ['Dialworks', 'Mia', 'terminé', 'text-neutral-400'], ['Peak Immobilier', 'Sol', 'terminé', 'text-neutral-400']].map(([v, ag, s, c], i) => (
                                    <div key={i} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm"><span className="text-neutral-200">{v}</span><span className="font-mono text-xs text-neutral-500">{ag}</span><span className={`font-mono text-[11px] ${c}`}>{s}</span></div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ===== Security & architecture ===== */}
            <section className="border-y border-neutral-200 mk-wash py-24 dark:border-white/5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal><SectionHead eyebrow="Sécurité & Architecture" title="Conçu pour être maîtrisé, personnalisé et sécurisé." sub="Une base technique moderne, robuste et auto-hébergée que vous contrôlez de bout en bout." /></Reveal>
                    <div className="mt-14 grid gap-4 lg:grid-cols-[1.1fr_1.4fr]">
                        <Reveal>
                            <div className={`relative h-full overflow-hidden ${CARD} p-6`}>
                                <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">Stack technique</p>
                                <div className="mt-4 space-y-2.5">
                                    {STACK.map((s, i) => {
                                        const a = ACC[s.a];
                                        return (
                                            <div key={s.l} className="relative flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-white/5 dark:bg-white/[0.02]" style={{ marginLeft: `${i * 10}px` }}>
                                                <span className={`h-2.5 w-2.5 rounded-full ${a.dot}`} />
                                                <div><p className="text-sm font-semibold text-neutral-900 dark:text-white">{s.l}</p><p className="text-xs text-neutral-500">{s.d}</p></div>
                                                {i < STACK.length - 1 && <span className="absolute -bottom-2.5 left-5 h-2.5 w-px bg-neutral-300 dark:bg-white/10" aria-hidden="true" />}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-5 flex items-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/[0.06] px-3.5 py-2.5 text-sm text-brand-700 dark:text-brand-200">
                                    <Layers className="h-4 w-4" /> Isolation multi-tenant stricte sur chaque enregistrement — garantie au niveau des modèles.
                                </div>
                            </div>
                        </Reveal>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {SECURITY.map((s, i) => (
                                <Reveal key={s.title} delay={(i % 2) * 90}>
                                    <div className={`h-full ${CARD} p-6`}>
                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-500/12 text-signal-600 ring-1 ring-signal-500/20 dark:text-signal-300"><s.icon className="h-5 w-5" /></span>
                                        <h3 className="mt-4 font-display text-base font-semibold text-neutral-900 dark:text-white">{s.title}</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{s.text}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Metrics ===== */}
            <section className="px-4 py-14 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-10 shadow-2xl sm:p-14">
                        <div className="grid-field pointer-events-none absolute inset-0 opacity-[0.15]" aria-hidden="true" />
                        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-brand-600/25 blur-[90px]" aria-hidden="true" />
                        <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-signal-500/20 blur-[90px]" aria-hidden="true" />
                        <div className="relative grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
                            {METRICS.map((m) => (<div key={m.l} className="text-center lg:text-left"><Counter value={m.v} className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl" /><p className="mt-2 font-mono text-xs uppercase tracking-widest text-signal-400">{m.l}</p><p className="mt-1 text-sm text-neutral-400">{m.s}</p></div>))}
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* ===== What you get ===== */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal><SectionHead eyebrow="Ce qui est inclus" title="Un produit complet, pas un simple template." sub="Tout ce dont vous avez besoin pour lancer votre service — code source, documentation, mises à jour et support." /></Reveal>
                    <div className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_1.85fr]">
                        <Reveal>
                            <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-xl">
                                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-600/20 blur-3xl" />
                                <div className="relative flex items-center gap-2.5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white"><Code2 className="h-5 w-5" /></span><div><p className="font-semibold text-white">Code source complet</p><p className="font-mono text-[11px] text-neutral-500">auto-hébergez · personnalisez · maîtrisez</p></div></div>
                                <div className="relative mt-5 space-y-1 rounded-xl border border-white/10 bg-ink-950/60 p-4 font-mono text-xs text-neutral-400">
                                    {['src/app/', '  api/admin/', '  api/app/', '  app/', 'src/views/client/', 'src/views/Admin/', 'prisma/schema.prisma'].map((f, i) => <p key={i} className={i % 3 === 0 ? 'text-brand-300' : ''}>{f}</p>)}
                                </div>
                            </div>
                        </Reveal>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {DELIVERABLES.map(([t, d], i) => (
                                <Reveal key={t} delay={(i % 2) * 70}>
                                    <div className={`flex h-full gap-3 ${CARD} p-5`}>
                                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-signal-500 dark:text-signal-400" />
                                        <div><p className="font-semibold text-neutral-900 dark:text-white">{t}</p><p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{d}</p></div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Testimonials ===== */}
            <section className="border-y border-neutral-200 mk-wash py-24 dark:border-white/5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal><SectionHead eyebrow="Recommandé par les équipes commerciales" title="Des résultats mesurables, pas seulement des échanges." /></Reveal>
                    <div className="mt-14 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                        <Reveal>
                            <figure className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/[0.08] to-transparent p-8 dark:from-brand-500/10">
                                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl" />
                                <div className="relative"><div className="flex gap-1 text-warm" aria-hidden="true">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}</div>
                                    <blockquote className="mt-5 font-display text-2xl font-medium leading-snug text-neutral-900 dark:text-white">« {TESTIMONIALS[0].q} »</blockquote></div>
                                <figcaption className="relative mt-8 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-signal-500 font-display font-bold text-white">{TESTIMONIALS[0].i}</span><div><p className="font-semibold text-neutral-900 dark:text-white">{TESTIMONIALS[0].n}</p><p className="font-mono text-[11px] text-neutral-500">{TESTIMONIALS[0].r}</p></div></figcaption>
                            </figure>
                        </Reveal>
                        <div className="grid gap-4">
                            {TESTIMONIALS.slice(1).map((t, i) => (
                                <Reveal key={t.n} delay={i * 100}>
                                    <figure className={`flex h-full flex-col justify-between ${CARD} p-6`}>
                                        <div><div className="flex gap-1 text-warm" aria-hidden="true">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}</div>
                                            <blockquote className="mt-3 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-200">« {t.q} »</blockquote></div>
                                        <figcaption className="mt-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-signal-500 text-sm font-bold text-white">{t.i}</span><div><p className="text-sm font-semibold text-neutral-900 dark:text-white">{t.n}</p><p className="font-mono text-[11px] text-neutral-500">{t.r}</p></div></figcaption>
                                    </figure>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Pricing ===== */}
            <section id="pricing" className="scroll-mt-24 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal><SectionHead center eyebrow="Tarification" title="Démarrez gratuitement. Évoluez selon vos besoins." sub="Facturation à l'usage par crédits — vous ne payez que pour les appels réellement décrochés." /></Reveal>
                    <Reveal delay={80}>
                        <div className="mt-8 flex items-center justify-center gap-3">
                            <span className={`text-sm ${!annual ? 'font-semibold text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>Mensuel</span>
                            <button onClick={() => setAnnual((v) => !v)} role="switch" aria-checked={annual} className={`relative h-6 w-11 rounded-full transition ${annual ? 'bg-brand-600' : 'bg-neutral-300 dark:bg-white/15'}`}>
                                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${annual ? 'left-[22px]' : 'left-0.5'}`} />
                            </button>
                            <span className={`text-sm ${annual ? 'font-semibold text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>Annuel <span className="ml-1 rounded-full bg-signal-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-signal-600 dark:text-signal-300">2 mois offerts</span></span>
                        </div>
                    </Reveal>
                    <div className="mx-auto mt-12 grid max-w-5xl items-start gap-5 lg:grid-cols-3">
                        {PLANS.map((p, i) => (
                            <Reveal key={p.name} delay={i * 100}>
                                <div className={`relative flex h-full flex-col rounded-3xl border p-7 ${p.highlight ? 'border-brand-500/50 bg-gradient-to-b from-brand-500/[0.06] to-white shadow-[0_30px_80px_-30px_rgba(109,63,234,0.35)] dark:from-brand-500/10 dark:to-ink-900/60 dark:shadow-[0_30px_80px_-30px_rgba(109,63,234,0.6)]' : `${CARD}`}`}>
                                    {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">Le plus populaire</span>}
                                    <p className="font-display text-lg font-semibold text-neutral-900 dark:text-white">{p.name}</p>
                                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{p.blurb}</p>
                                    <p className="mt-5 flex items-baseline gap-1"><span className="font-display text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">${annual ? p.a : p.m}</span><span className="font-mono text-sm text-neutral-500">/mois</span></p>
                                    {annual && <p className="mt-1 font-mono text-[11px] text-signal-600 dark:text-signal-300">facturé annuellement</p>}
                                    <ul className="mt-6 space-y-2.5 text-sm">{p.features.map((f) => <li key={f} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300"><Check className="mt-0.5 h-4 w-4 shrink-0 text-signal-500 dark:text-signal-400" />{f}</li>)}</ul>
                                    <Link href={user ? route('client.dashboard') : route('register')} className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${p.highlight ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/40 hover:bg-brand-500' : 'border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]'}`}>{p.cta}</Link>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FAQ preview ===== */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal><SectionHead center eyebrow="Questions fréquentes" title="Tout ce que vous devez savoir pour décider." sub="Réponses directes à vos questions les plus courantes." /></Reveal>
                    <Reveal delay={100}><FaqPreview /></Reveal>
                    <Reveal delay={160}><div className="mt-8 text-center"><Link href={route('frontend.faq')} className="inline-flex items-center gap-1.5 font-semibold text-brand-600 transition hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300">Consulter toutes les questions <ArrowRight className="h-4 w-4" /></Link></div></Reveal>
                </div>
            </section>

            {/* ===== Final CTA ===== */}
            <section className="px-4 pb-24 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 px-8 py-16 text-center sm:px-12">
                        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true"><div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-signal-400/25 blur-[90px]" /><div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-400/30 blur-[90px]" /></div>
                        <div className="relative">
                            <div className="mx-auto mb-6 w-fit"><WaveBars count={30} h="h-8" /></div>
                            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">Déployez votre agent d'appels IA dès aujourd'hui.</h2>
                            <p className="mx-auto mt-4 max-w-xl text-brand-100/90">Configurez votre agent, importez vos contacts et récoltez des prospects qualifiés automatiquement.</p>
                            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                                <Link href={primaryHref} className="sheen inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-brand-800 shadow-xl transition hover:bg-brand-50">{primaryLabel} <ArrowRight className="h-4 w-4" /></Link>
                                {!user && <Link href={route('login')} className="rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Se connecter</Link>}
                            </div>
                            <p className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-brand-100/70"><ShieldCheck className="h-3.5 w-3.5" /> Auto-hébergé · Vos propres clés d'API · Sans engagement</p>
                        </div>
                    </div>
                </Reveal>
            </section>
        </MarketingLayout>
    );
}
