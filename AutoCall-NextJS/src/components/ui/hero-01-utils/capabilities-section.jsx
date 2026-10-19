'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
    Megaphone,
    Target,
    BarChart3,
    Zap,
    Globe,
    PhoneCall,
    PhoneOutgoing,
    PhoneForwarded,
    Users,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    MessageSquare,
    Clock,
    FileText,
    Share2,
    Calendar,
    Send,
    Play,
    Flame,
    Star,
    Layers,
    SlidersHorizontal,
    Radio,
    Headphones,
    Check,
    Monitor,
    Maximize2,
    X,
    Eye
} from 'lucide-react';

export default function CapabilitiesSection() {
    const [activeTab, setActiveTab] = useState('outbound');
    const [viewMode, setViewMode] = useState('screen'); // 'screen' ou 'flow'
    const [lightboxImage, setLightboxImage] = useState(null);

    const capabilities = [
        {
            id: 'outbound',
            tabTitle: 'Campagnes & Prospection',
            icon: Megaphone,
            badge: 'Prospection sortante massive',
            headline: 'Lancez des centaines d’appels de prospection et de relance en un clic',
            description: 'AutoCall ne se limite pas à décrocher le téléphone. Automatisez vos campagnes d’appels sortants : prospection à froid (cold calling), relance de devis non signés, paniers abandonnés ou réactivation de contacts dormants.',
            image: '/images/cap-outbound.jpg',
            imageTitle: 'Console de Campagne & Dialer Automatisé',
            imageCaption: 'Supervision des contacts, progression du lot à 68%, détection de répondeur en temps réel et statut des conversions.',
            stats: [
                { value: '1 000+', label: 'Appels simultanés sans attente' },
                { value: '78%', label: 'Taux de décroché moyen' },
                { value: '< 2s', label: 'Détection intelligente de répondeur' }
            ],
            keyPoints: [
                'Importation fluide de vos listes de contacts en CSV ou via votre CRM',
                'Détection immédiate des boîtes vocales : l’agent raccroche ou dépose un message personnalisé',
                'Personnalisation dynamique : l’agent cite le nom, le secteur et l’historique du prospect',
                'Planification horaire intelligente pour appeler au moment optimal'
            ],
            mockup: (
                <div className="rounded-2xl border border-white/10 bg-[#10131C] p-5 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-white font-hero-sans">Campagne : Relance Devis B2B</span>
                        </div>
                        <span className="rounded-md bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-xs font-semibold text-blue-400">
                            En cours d&apos;exécution
                        </span>
                    </div>

                    {/* Progression bar */}
                    <div>
                        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                            <span>Progression du lot</span>
                            <span className="font-mono text-white font-bold">342 / 500 contacts appelés</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full" style={{ width: '68%' }} />
                        </div>
                    </div>

                    {/* Liste des derniers contacts traités */}
                    <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs">
                            <div className="flex items-center gap-2.5">
                                <span className="h-7 w-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs">ML</span>
                                <div>
                                    <p className="font-semibold text-white">Marc Lefebvre — Directeur Technique</p>
                                    <p className="text-xs text-neutral-400">Devis #4092 · 14 500 €</p>
                                </div>
                            </div>
                            <span className="rounded-md bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-xs font-bold">
                                RDV validé
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs">
                            <div className="flex items-center gap-2.5">
                                <span className="h-7 w-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-xs">SD</span>
                                <div>
                                    <p className="font-semibold text-white">Sophie Dubreuil — Resp. Achats</p>
                                    <p className="text-xs text-neutral-400">Devis #4095 · 8 200 €</p>
                                </div>
                            </div>
                            <span className="rounded-md bg-amber-500/15 text-amber-400 px-2 py-0.5 text-xs font-bold">
                                Rappel vendredi
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs">
                            <div className="flex items-center gap-2.5">
                                <span className="h-7 w-7 rounded-lg bg-neutral-500/15 text-neutral-400 flex items-center justify-center font-bold text-xs">AN</span>
                                <div>
                                    <p className="font-semibold text-neutral-300">Alexandre Niel — Gérant</p>
                                    <p className="text-xs text-neutral-500">Répondeur détecté (0s perdue)</p>
                                </div>
                            </div>
                            <span className="rounded-md bg-white/[0.05] text-neutral-400 px-2 py-0.5 text-xs">
                                Message déposé
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'qualification',
            tabTitle: 'Qualification & Transfert Live',
            icon: Target,
            badge: 'Transfert commercial instantané',
            headline: 'Qualifiez les critères clés et transférez les opportunités chaudes en direct',
            description: 'L’agent vocal interroge le prospect selon votre méthodologie de qualification (BANT, MEDDIC). Dès qu’un prospect est chaud et prêt à acheter, l’appel est instantanément transféré à votre commercial avec un briefing chuchoté.',
            image: '/images/cap-qualification.jpg',
            imageTitle: 'Qualification en Direct & Warm Transfer',
            imageCaption: 'Reconnaissance des variables (Budget 25 000 €, délai 15j), score BANT 96/100 et bascule instantanée vers le commercial.',
            stats: [
                { value: '100%', label: 'Critères de qualification validés' },
                { value: '< 1s', label: 'Bascule vers un humain sans coupure' },
                { value: '+45%', label: 'Taux de conversion sur leads chauds' }
            ],
            keyPoints: [
                'Filtrage rigoureux : budget, calendrier, décideur et besoin précis',
                'Transfert à chaud (Warm Transfer) : l’IA prévient le commercial avant de basculer',
                'Redirection intelligente selon les disponibilités de l’équipe de vente',
                'Si le commercial est occupé : prise automatique de rendez-vous sur l’agenda'
            ],
            mockup: (
                <div className="rounded-2xl border border-white/10 bg-[#10131C] p-5 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-emerald-400" />
                            <span className="text-xs font-bold text-white font-hero-sans">Lead Chaud Détecté</span>
                        </div>
                        <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                            Score 96/100
                        </span>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-xs space-y-2">
                        <div className="flex items-center justify-between text-neutral-400">
                            <span>Prospect :</span>
                            <span className="text-white font-semibold">David Martin (DG, LogiTech)</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-400">
                            <span>Budget confirmé :</span>
                            <span className="text-emerald-400 font-bold">25 000 € / an</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-400">
                            <span>Urgence de déploiement :</span>
                            <span className="text-white font-semibold">Sous 15 jours</span>
                        </div>
                    </div>

                    {/* Action de transfert en direct */}
                    <div className="rounded-xl border border-blue-500/40 bg-gradient-to-r from-blue-900/30 to-[#0A222D]/40 p-3.5 space-y-2">
                        <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold">
                            <PhoneForwarded className="h-4 w-4 text-blue-400 animate-pulse" />
                            <span>Transfert en direct vers votre commercial</span>
                        </div>
                        <p className="text-xs text-neutral-300">
                            « Antoine, j&apos;ai David Martin en ligne, prêt à signer pour l&apos;offre Enterprise. Je vous passe l&apos;appel immédiatement. »
                        </p>
                        <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="text-neutral-400">Ligne commerciale : Antoine Roux</span>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Connecté
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'analytics',
            tabTitle: 'Débriefs & Score de Sentiment',
            icon: BarChart3,
            badge: 'Intelligence conversationnelle',
            headline: 'Transcription mot à mot, résumés exécutifs et analyse du sentiment',
            description: 'Chaque seconde de conversation est analysée. À la fin de chaque appel, recevez un compte-rendu clair en 3 points, une note de satisfaction et la détection précise des objections rencontrées.',
            image: '/images/cap-analytics.jpg',
            imageTitle: 'Intelligence Vocale & Courbe de Sentiment',
            imageCaption: 'Synthèse en 3 points, détection automatique des objections, note 4.9/5 et jauge de satisfaction à 92% favorable.',
            stats: [
                { value: '100%', label: 'Conversations transcrites et enregistrées' },
                { value: '3s', label: 'Génération du résumé exécutif' },
                { value: '5★', label: 'Notation automatique de satisfaction' }
            ],
            keyPoints: [
                'Transcription intégrale en français avec reconnaissance des termes métiers',
                'Synthèse IA immédiate : besoin, objections formulées et action convenue',
                'Analyse du sentiment vocal (ton calme, enthousiaste, hésitant ou irrité)',
                'Bibliothèque d’enregistrements audio réécoutables en 1 clic pour le coaching'
            ],
            mockup: (
                <div className="rounded-2xl border border-white/10 bg-[#10131C] p-5 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <span className="text-xs font-bold text-white font-hero-sans">Débrief IA de l&apos;appel #83042</span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                            <Star className="h-3.5 w-3.5 fill-amber-400" />
                            <span>4.9 / 5.0</span>
                        </div>
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <span className="text-xs font-semibold text-blue-400 normal-case tracking-wider">Résumé exécutif en 3 points</span>
                            <ul className="mt-2 space-y-1.5 text-neutral-300 text-xs">
                                <li className="flex items-start gap-1.5">
                                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>Besoin :</strong> Souhaite automatiser le standard de 3 cliniques dentaires.</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>Objection levée :</strong> L&apos;IA a rassuré sur la conformité RGPD Santé et le secret médical.</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>Action convenue :</strong> Démo fixée le 14 Octobre à 10h30.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                            <span className="text-neutral-400 text-xs">Score de Sentiment :</span>
                            <span className="rounded-md bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-xs font-bold">
                                92% Très Favorable
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'automations',
            tabTitle: 'Automatisations & CRM',
            icon: Zap,
            badge: 'Flux post-appel en temps réel',
            headline: 'Déclenchez des actions immédiates : SMS, emails, mise à jour CRM et Webhooks',
            description: 'Dès que l’agent raccroche, aucune saisie manuelle n’est requise. Le contact est automatiquement créé ou mis à jour dans votre CRM, un SMS de confirmation est expédié au client et votre équipe est notifiée sur Slack.',
            image: '/images/cap-automations.jpg',
            imageTitle: 'Pipeline Automatisé Post-Appel',
            imageCaption: 'Enchaînement ultra-rapide : SMS envoyé à T+0.8s, opportunité HubSpot mise à jour à T+1.2s et alerte d’équipe à T+1.5s.',
            stats: [
                { value: '0s', label: 'Temps de saisie manuelle pour vos équipes' },
                { value: '100%', label: 'Données synchronisées dans le CRM' },
                { value: '1 clic', label: 'Intégration HubSpot, Salesforce, Zapier' }
            ],
            keyPoints: [
                'Envoi immédiat de SMS de confirmation avec le lien de rendez-vous ou le devis',
                'Mise à jour automatique des fiches contacts dans votre CRM (HubSpot, Salesforce, Pipedrive)',
                'Webhooks temps réel pour déclencher des scénarios Make ou Zapier sur mesure',
                'Alertes Slack ou Discord prioritaires dès qu’un accord est conclu au téléphone'
            ],
            mockup: (
                <div className="rounded-2xl border border-white/10 bg-[#10131C] p-5 shadow-2xl space-y-3.5">
                    <span className="text-xs font-bold text-white font-hero-sans block pb-2 border-b border-white/[0.08]">
                        Chronologie des automatisations post-appel
                    </span>

                    <div className="space-y-2.5 text-xs">
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                                <PhoneCall className="h-3.5 w-3.5" />
                            </span>
                            <div className="flex-1">
                                <p className="font-semibold text-white">Appel terminé (durée 3m 12s)</p>
                                <p className="text-xs text-neutral-400">Rendez-vous convenu avec succès</p>
                            </div>
                            <span className="text-xs font-mono text-neutral-400">T+0s</span>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                                <Send className="h-3.5 w-3.5" />
                            </span>
                            <div className="flex-1">
                                <p className="font-semibold text-white">SMS de confirmation expédié</p>
                                <p className="text-xs text-neutral-400">« Bonjour Marc, votre RDV est confirmé pour jeudi 14h »</p>
                            </div>
                            <span className="text-xs font-mono text-neutral-400">T+0.8s</span>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                                <Layers className="h-3.5 w-3.5" />
                            </span>
                            <div className="flex-1">
                                <p className="font-semibold text-white">Mise à jour HubSpot & Salesforce</p>
                                <p className="text-xs text-neutral-400">Statut du deal passé à « Démo programmée »</p>
                            </div>
                            <span className="text-xs font-mono text-neutral-400">T+1.2s</span>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
                                <Radio className="h-3.5 w-3.5" />
                            </span>
                            <div className="flex-1">
                                <p className="font-semibold text-white">Notification Slack commerciale</p>
                                <p className="text-xs text-neutral-400">Alerte envoyée sur le canal #leads-chauds</p>
                            </div>
                            <span className="text-xs font-mono text-neutral-400">T+1.5s</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'telecom',
            tabTitle: 'Numéros & Télécom Mondial',
            icon: Globe,
            badge: 'Infrastructure opérateur mondiale',
            headline: 'Déployez des numéros de téléphone dédiés dans plus de 50 pays en quelques secondes',
            description: 'Aucune installation de matériel ni contrat d’opérateur complexe. Activez des lignes locales avec indicatif français (+33), européen ou international, et laissez AutoCall router les appels avec une latence ultra-faible.',
            image: '/images/cap-telecom.jpg',
            imageTitle: 'Cartographie & Réseau Opérateur Cloud',
            imageCaption: 'Lignes locales en France (+33), UK (+44) et US (+1), latence < 450ms garantie et interconnexion Tier-1.',
            stats: [
                { value: '50+', label: 'Pays couverts avec indicatifs locaux' },
                { value: '< 450ms', label: 'Latence vocale ultra-réaliste' },
                { value: '30+', label: 'Langues et accents maîtrisés' }
            ],
            keyPoints: [
                'Attribution instantanée de numéros géographiques (+33 1, +33 4, etc.) ou nationaux (+33 9)',
                'Portabilité de vos numéros existants sans interruption de service',
                'Support natif multilingue : l’IA s’adapte automatiquement à la langue du correspondant',
                'Conformité stricte aux réglementations télécoms et protocoles de chiffrement TLS/SRTP'
            ],
            mockup: (
                <div className="rounded-2xl border border-white/10 bg-[#10131C] p-5 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <span className="text-xs font-bold text-white font-hero-sans">Vos Lignes Téléphoniques Actives</span>
                        <span className="rounded-md bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-xs font-bold">
                            Opérationnel 24/7
                        </span>
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <div className="flex items-center gap-2.5">
                                <span className="text-base font-semibold text-neutral-300">FR</span>
                                <div>
                                    <p className="font-mono text-white font-bold">+33 1 89 71 20 44</p>
                                    <p className="text-xs text-neutral-400">Ligne Standard & Entrants (Paris)</p>
                                </div>
                            </div>
                            <span className="text-emerald-400 font-semibold text-xs">Prêt</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <div className="flex items-center gap-2.5">
                                <span className="text-base font-semibold text-neutral-300">FR</span>
                                <div>
                                    <p className="font-mono text-white font-bold">+33 4 92 10 33 18</p>
                                    <p className="text-xs text-neutral-400">Ligne Campagnes Sortantes (Lyon)</p>
                                </div>
                            </div>
                            <span className="text-emerald-400 font-semibold text-xs">En cours</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <div className="flex items-center gap-2.5">
                                <span className="text-base font-semibold text-neutral-300">UK</span>
                                <div>
                                    <p className="font-mono text-white font-bold">+44 20 7946 0912</p>
                                    <p className="text-xs text-neutral-400">Support International (Londres)</p>
                                </div>
                            </div>
                            <span className="text-emerald-400 font-semibold text-xs">Prêt</span>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const currentCap = capabilities.find((c) => c.id === activeTab) || capabilities[0];

    return (
        <section id="fonctionnalites" className="relative py-24 sm:py-32 bg-[#090A0F] text-white border-y border-white/[0.08] overflow-hidden">
            {/* Halo d'ambiance bleuté */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full blur-[160px] opacity-25"
                style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.3) 0%, transparent 70%)' }}
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* EN-TÊTE DE SECTION */}
                <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 mb-4 shadow-2xs">
                        <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                        <span>Plateforme Téléphonique Complète</span>
                    </div>
                    <h2 className="font-hero-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Bien plus qu’un répondeur : un véritable copilote commercial autonome
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed">
                        AutoCall gère l’ensemble de votre chaîne de valeur téléphonique : de la prospection sortante en masse jusqu’au débriefing CRM et au transfert en direct vers vos commerciaux.
                    </p>
                </div>

                {/* BARRE DE SÉLECTION D'ONGLETS (Style Apple / Linear) */}
                <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
                    {capabilities.map((cap) => {
                        const Icon = cap.icon;
                        const isActive = activeTab === cap.id;
                        return (
                            <button
                                key={cap.id}
                                type="button"
                                onClick={() => setActiveTab(cap.id)}
                                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                    isActive
                                        ? 'bg-white text-neutral-900 shadow-md scale-102'
                                        : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                                }`}
                            >
                                <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-blue-600' : 'text-neutral-400 group-hover:text-white'}`} />
                                <span>{cap.tabTitle}</span>
                            </button>
                        );
                    })}
                </div>

                {/* CARTE CENTRALE ACTIVE (Grid 2 Colonnes) */}
                <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-[#0F121C] to-[#0A0C13] p-6 sm:p-10 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                        {/* COLONNE GAUCHE (6/12) : EXPLICATIONS & POINTS CLÉS */}
                        <div className="lg:col-span-6 space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
                                <currentCap.icon className="h-3.5 w-3.5 text-blue-400" />
                                <span>{currentCap.badge}</span>
                            </div>

                            <h3 className="font-hero-sans text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                                {currentCap.headline}
                            </h3>

                            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                                {currentCap.description}
                            </p>

                            {/* 3 Métriques clés */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                                {currentCap.stats.map((st, i) => (
                                    <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                                        <p className="font-hero-sans text-xl sm:text-2xl font-bold text-white tabular-nums">{st.value}</p>
                                        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{st.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Points clés avec coches */}
                            <div className="space-y-2.5 pt-2">
                                {currentCap.keyPoints.map((pt, i) => (
                                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>{pt}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Sélecteur de mode de vue (Capture Écran HD vs Flux interactif) */}
                            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('screen')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                            viewMode === 'screen'
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'text-neutral-400 hover:text-white'
                                        }`}
                                    >
                                        <Monitor className="h-3.5 w-3.5" />
                                        <span>Capture Écran HD</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('flow')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                            viewMode === 'flow'
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'text-neutral-400 hover:text-white'
                                        }`}
                                    >
                                        <Layers className="h-3.5 w-3.5" />
                                        <span>Détails Télémétrie</span>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setLightboxImage(currentCap.image)}
                                    className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    <Maximize2 className="h-3.5 w-3.5 text-blue-400" />
                                    <span>Plein écran</span>
                                </button>
                            </div>
                        </div>

                        {/* COLONNE DROITE (6/12) : ILLUSTRATION VISUELLE OU MOCKUP INTERACTIF */}
                        <div className="lg:col-span-6">
                            {viewMode === 'screen' ? (
                                <div className="group relative rounded-2xl border border-white/10 bg-[#10131C] p-3 sm:p-4 shadow-2xl transition-all hover:border-white/20">
                                    {/* Barre de fenêtre style macOS / SaaS épuré */}
                                    <div className="flex items-center justify-between pb-3 px-1 border-b border-white/[0.08]">
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                                            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                                            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                                            <span className="ml-2 text-xs font-mono text-neutral-400 truncate max-w-[200px] sm:max-w-none">
                                                AutoCall · {currentCap.imageTitle}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                Direct
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setLightboxImage(currentCap.image)}
                                                className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                                title="Agrandir l'image"
                                            >
                                                <Maximize2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Conteneur d'image avec hover zoom et bouton d'agrandissement */}
                                    <div
                                        onClick={() => setLightboxImage(currentCap.image)}
                                        className="relative mt-3 overflow-hidden rounded-xl border border-white/[0.08] cursor-zoom-in group/img"
                                    >
                                        {/* Image illustrative générée en haute définition */}
                                        <img
                                            src={currentCap.image}
                                            alt={currentCap.imageTitle}
                                            className="w-full h-auto object-cover transition-transform duration-500 group-hover/img:scale-[1.02]"
                                            loading="lazy"
                                        />

                                        {/* Overlay discret au hover */}
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-4">
                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/80 px-3 py-1 text-xs text-white backdrop-blur-md border border-white/20">
                                                <Eye className="h-3.5 w-3.5 text-blue-400" />
                                                <span>Cliquer pour inspecter les détails en haute résolution</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Légende descriptive sous l'image */}
                                    <div className="mt-3 px-1 flex items-start gap-2 text-xs text-neutral-400">
                                        <Sparkles className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                                        <p className="leading-relaxed">
                                            {currentCap.imageCaption}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                currentCap.mockup
                            )}
                        </div>
                    </div>
                </div>

                {/* 3 PILIERS EN BAS DE SECTION (Avec aperçus visuels miniatures) */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div
                        onClick={() => {
                            setActiveTab('outbound');
                            setViewMode('screen');
                        }}
                        className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3 hover:border-white/20 transition-all cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                <PhoneOutgoing className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-mono text-neutral-500 group-hover:text-blue-400 transition-colors flex items-center gap-1">
                                <span>Voir écran</span>
                                <ArrowRight className="h-3 w-3" />
                            </span>
                        </div>
                        <h4 className="font-hero-sans text-base font-bold text-white">Appels entrants & sortants</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            Standard d’accueil 24/7 et campagnes de téléprospection actives pilotées par le même agent vocal.
                        </p>
                        <div className="h-16 w-full rounded-lg overflow-hidden border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                            <img
                                src="/images/cap-outbound.jpg"
                                alt="Aperçu des campagnes sortantes"
                                className="w-full h-full object-cover object-top"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div
                        onClick={() => {
                            setActiveTab('qualification');
                            setViewMode('screen');
                        }}
                        className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3 hover:border-white/20 transition-all cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                <PhoneForwarded className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-mono text-neutral-500 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                                <span>Voir écran</span>
                                <ArrowRight className="h-3 w-3" />
                            </span>
                        </div>
                        <h4 className="font-hero-sans text-base font-bold text-white">Transfert humain instantané</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            L’IA passe le relais à votre commercial en direct avec les informations déjà recueillies et chuchotées.
                        </p>
                        <div className="h-16 w-full rounded-lg overflow-hidden border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                            <img
                                src="/images/cap-qualification.jpg"
                                alt="Aperçu de la qualification en direct"
                                className="w-full h-full object-cover object-top"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div
                        onClick={() => {
                            setActiveTab('automations');
                            setViewMode('screen');
                        }}
                        className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3 hover:border-white/20 transition-all cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                <Zap className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-mono text-neutral-500 group-hover:text-blue-400 transition-colors flex items-center gap-1">
                                <span>Voir écran</span>
                                <ArrowRight className="h-3 w-3" />
                            </span>
                        </div>
                        <h4 className="font-hero-sans text-base font-bold text-white">Zéro ressaisie manuelle</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            Comptes-rendus rédigés par l’IA, SMS envoyés et fiches CRM synchronisées automatiquement.
                        </p>
                        <div className="h-16 w-full rounded-lg overflow-hidden border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                            <img
                                src="/images/cap-automations.jpg"
                                alt="Aperçu des automatisations CRM"
                                className="w-full h-full object-cover object-top"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* MODAL LIGHTBOX PLEIN ÉCRAN */}
            {lightboxImage && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-8 animate-fadeIn"
                    onClick={() => setLightboxImage(null)}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl border border-white/20 bg-[#0C0E14] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <span className="text-xs font-mono text-neutral-300">Aperçu Haute Définition · AutoCall</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setLightboxImage(null)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                aria-label="Fermer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-2 sm:p-4 overflow-auto max-h-[80vh] flex items-center justify-center">
                            <img
                                src={lightboxImage}
                                alt="Aperçu plein écran"
                                className="max-w-full max-h-[75vh] w-auto h-auto rounded-xl object-contain shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
