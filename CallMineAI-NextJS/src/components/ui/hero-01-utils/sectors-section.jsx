'use client';

import React, { useState } from 'react';
import { 
    Stethoscope, 
    Scale, 
    Building2, 
    Wrench, 
    UtensilsCrossed, 
    Briefcase, 
    ShieldCheck, 
    Zap, 
    CalendarCheck, 
    ArrowRight, 
    Clock, 
    CheckCircle2,
    SlidersHorizontal,
    PhoneForwarded,
    Bot,
    Sparkles
} from 'lucide-react';
import { AnimatedAssistantAvatar, AnimatedUserAvatar } from '@/components/ui/chat-messages';

export default function SectorsSection() {
    const sectors = [
        {
            id: 'sante',
            name: "Santé & Médical",
            shortTitle: "Santé",
            icon: Stethoscope,
            headline: "Ne laissez plus le téléphone interrompre vos soins et consultations.",
            description: "Pendant que vous traitez vos patients, AutoCall gère le standard avec empathie : qualification du motif, prise de rendez-vous connectée à votre agenda et filtrage des urgences vitales.",
            badgeColor: "text-emerald-800 bg-emerald-100 border-emerald-300",
            accentColor: "emerald",
            image: '/images/sector-medical.jpg',
            metrics: [
                { label: "Consultations interrompues", value: "0" },
                { label: "Appels répétitifs absorbés", value: "-75%" },
                { label: "Prise en charge du motif", value: "< 1s" }
            ],
            keyPoints: [
                "Synchronisation directe avec Doctolib, Maiia ou Calendly",
                "Filtrage bienveillant avec protocole d'urgence (renvoi vers le 15 si détresse)",
                "Gestion des renouvellements d'ordonnances et consignes pré-opératoires",
                "Secret médical et conformité stricte aux normes RGPD Santé"
            ],
            callSimulation: {
                caller: "Mme Sophie Marchand (Patiente)",
                callerType: "Demande de rendez-vous",
                aiResponse: "« Docteur Moreau est en consultation. J'ai un créneau disponible jeudi à 11h15 pour votre suivi, souhaitez-vous que je vous l'attribue ? »",
                action: "Rendez-vous confirmé dans Doctolib & rappel SMS envoyé à la patiente"
            }
        },
        {
            id: 'avocats',
            name: "Avocats & Droit",
            shortTitle: "Juridique",
            icon: Scale,
            headline: "Confidentialité absolue et qualification immédiate de chaque contentieux.",
            description: "En audience ou en rédaction d'actes, ne perdez aucun dossier stratégique. AutoCall qualifie la nature de la demande, détecte les urgences et alerte l'avocat d'astreinte en temps réel.",
            badgeColor: "text-slate-900 bg-slate-100 border-slate-300 font-bold",
            accentColor: "slate",
            image: '/images/sector-legal.jpg',
            metrics: [
                { label: "Délai de qualification", value: "< 2 min" },
                { label: "Disponibilité d'urgence", value: "24/7" },
                { label: "Secret professionnel", value: "100%" }
            ],
            keyPoints: [
                "Qualification méthodique : pénal, droit du travail, affaires, divorce",
                "Alerte SMS instantanée sur garde à vue ou délai de recours imminent",
                "Collecte structurée des coordonnées et pièces justificatives",
                "Filtrage des démarchages et appels non pertinents"
            ],
            callSimulation: {
                caller: "M. Damien Roux (Client)",
                callerType: "Urgence audience",
                aiResponse: "« Maître Mercier plaide actuellement. S'agit-il d'une garde à vue ou d'une convocation ? Je transmets immédiatement une alerte sur sa ligne d'urgence. »",
                action: "Alerte SMS prioritaire émise & créneau téléphonique réservé à 18h30"
            }
        },
        {
            id: 'immobilier',
            name: "Immobilier & Promoteurs",
            shortTitle: "Immobilier",
            icon: Building2,
            headline: "Captez 100% des acquéreurs et programmez vos visites sans délai.",
            description: "45% des acquéreurs appellent le soir et le week-end. AutoCall répond instantanément, vérifie le budget et le financement, puis planifie la visite directement sur l'agenda du négociateur.",
            badgeColor: "text-sky-900 bg-sky-100 border-sky-300 font-bold",
            accentColor: "sky",
            image: '/images/sector-immo.jpg',
            metrics: [
                { label: "Visites qualifiées", value: "+40%" },
                { label: "Temps de réponse", value: "< 3 sec" },
                { label: "Acquéreurs captés le soir", value: "100%" }
            ],
            keyPoints: [
                "Identification précise du bien recherché ou de la référence de l'annonce",
                "Validation du plan de financement et de l'accord bancaire avant visite",
                "Envoi automatique par SMS de la fiche technique ou visite virtuelle",
                "Synchronisation directe avec votre logiciel immobilier (Apimo, Néo, Hektor)"
            ],
            callSimulation: {
                caller: "Marc & Laura Denis (Acquéreurs)",
                callerType: "Achat T4 490 000€",
                aiResponse: "« Le bien référence FOCH-42 est disponible. Avez-vous déjà un plan de financement validé ? Je peux vous bloquer une visite ce vendredi à 14h00. »",
                action: "Visite programmée sur l'agenda de l'agent & fiche PDF envoyée par SMS"
            }
        },
        {
            id: 'artisans',
            name: "Artisans & BTP",
            shortTitle: "Artisans & BTP",
            icon: Wrench,
            headline: "Restez concentré sur vos chantiers, l'IA décroche et prend l'adresse.",
            description: "Sur un chantier ou les mains prises, impossible de décrocher. Chaque appel manqué est un chantier qui part chez un concurrent. AutoCall recueille l'urgence et planifie votre tournée.",
            badgeColor: "text-amber-900 bg-amber-100 border-amber-300 font-bold",
            accentColor: "amber",
            metrics: [
                { label: "Chantiers interrompus", value: "0" },
                { label: "CA sauvé par an", value: "~25k€" },
                { label: "Prise en charge d'astreinte", value: "24h/24" }
            ],
            keyPoints: [
                "Diagnostic préalable : nature de la fuite, coupure de courant, serrure bloquée",
                "Collecte exacte de l'adresse d'intervention et du numéro de portable",
                "Intégration au planning de tournée sans chevauchement",
                "Envoi d'un récapitulatif clair sur votre téléphone par SMS ou WhatsApp"
            ],
            callSimulation: {
                caller: "Syndic Résidence du Parc",
                callerType: "Fuite d'eau urgente",
                aiResponse: "« L'équipe intervient en urgence. Avez-vous pu fermer la vanne générale ? Je planifie le passage de notre technicien d'astreinte entre 10h et 11h. »",
                action: "Intervention insérée dans la tournée & coordonnées GPS transmises au technicien"
            }
        },
        {
            id: 'restauration',
            name: "Restaurants & Hôtellerie",
            shortTitle: "Restauration",
            icon: UtensilsCrossed,
            headline: "Gérez vos réservations de tables et privatisations en plein coup de feu.",
            description: "En plein service ou en préparation, le bruit et le rythme rendent impossible la prise d'appel. AutoCall réserve les tables en direct selon votre jauge et répond aux questions fréquentes.",
            badgeColor: "text-rose-900 bg-rose-100 border-rose-300 font-bold",
            accentColor: "rose",
            metrics: [
                { label: "Couverts additionnels", value: "+18/sem" },
                { label: "Appels manqués à 19h30", value: "0" },
                { label: "Sync réservations", value: "Temps réel" }
            ],
            keyPoints: [
                "Prise de réservation selon vos capacités réelles (jauge par service)",
                "Questions fréquentes traitées : carte, parking, privatisation, allergènes",
                "Confirmation instantanée par SMS avec lien de modification",
                "Compatible avec vos modules Zenchef, TheFork ou cahier de réservation"
            ],
            callSimulation: {
                caller: "Stéphane Meyer (Client)",
                callerType: "Table 6 personnes ce soir",
                aiResponse: "« Il nous reste une table disponible en salle pour 6 personnes à 20h30. Avez-vous des restrictions alimentaires à signaler au chef ? »",
                action: "Table 6 pers. bloquée dans le cahier & SMS de confirmation expédié"
            }
        },
        {
            id: 'services',
            name: "PME & Cabinets Conseil",
            shortTitle: "PME & Conseil",
            icon: Briefcase,
            headline: "Un accueil digne des plus grands groupes pour votre cabinet ou PME.",
            description: "Finis les transferts perdus et les messages approximatifs sur post-it. AutoCall oriente précisément les interlocuteurs vers le bon collaborateur et rédige des synthèses claires dans votre CRM.",
            badgeColor: "text-blue-900 bg-blue-100 border-blue-300 font-bold",
            accentColor: "blue",
            metrics: [
                { label: "Interruptions inutiles", value: "-80%" },
                { label: "Précision des synthèses", value: "100%" },
                { label: "Routage collaborateur", value: "Intelligent" }
            ],
            keyPoints: [
                "Routage intelligent par département : commercial, comptabilité, support",
                "Synthèse complète envoyée par e-mail ou sur Slack / Teams en 10 secondes",
                "Mise à jour automatique de la fiche client dans HubSpot, Pipedrive ou Salesforce",
                "Horaires et informations d'accès communiqués sans intervention humaine"
            ],
            callSimulation: {
                caller: "Hélène Brossard (Directrice Financière)",
                callerType: "Suivi clôture comptable",
                aiResponse: "« Monsieur Vasseur est en réunion bilan jusqu'à 15h. Je lui transmets votre message avec le récapitulatif des pièces pour qu'il vous rappelle en priorité. »",
                action: "Synthèse détaillée envoyée sur Slack + fiche client actualisée dans le CRM"
            }
        }
    ];

    const [activeSectorId, setActiveSectorId] = useState('sante');
    const activeSector = sectors.find(s => s.id === activeSectorId) || sectors[0];
    const ActiveIcon = activeSector.icon;

    return (
        <section id="secteurs" className="relative px-6 py-20 sm:py-28 bg-[#F8F9FA] text-neutral-900 border-y border-neutral-200/90 scroll-mt-20">
            {/* LUEUR RADIALE D'ARRIÈRE-PLAN SUBTILE */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[1000px] rounded-full blur-[170px] opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl">
                {/* 1. ENTÊTE DE SECTION */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs mb-4">
                        <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-600" />
                        <span>Secteurs d&apos;activité & Métiers</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.18]">
                        Une intelligence vocale qui parle le langage de{' '}
                        <span className="font-hero-serif italic text-neutral-950">
                            votre profession.
                        </span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Chaque métier a son vocabulaire, ses urgences et ses habitudes. AutoCall est préconfiguré pour adopter les protocoles spécifiques à votre domaine sans nécessiter de formation complexe.
                    </p>

                    {/* 2. ONGLETS DE SÉLECTION RAPIDE DES SECTEURS */}
                    <div className="mt-9 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-neutral-200/50 border border-neutral-300/80 max-w-3xl mx-auto">
                        {sectors.map((sector) => {
                            const isSelected = sector.id === activeSectorId;
                            const IconComponent = sector.icon;

                            return (
                                <button
                                    key={sector.id}
                                    onClick={() => setActiveSectorId(sector.id)}
                                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? 'bg-white text-neutral-900 shadow-xs font-bold scale-[1.02]'
                                            : 'text-neutral-700 hover:text-neutral-900 hover:bg-white/80'
                                    }`}
                                >
                                    <IconComponent className={`h-3.5 w-3.5 ${isSelected ? 'text-neutral-900' : 'text-neutral-500'}`} />
                                    <span>{sector.shortTitle}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. VITRINE BENTO DU SECTEUR SÉLECTIONNÉ */}
                <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                        
                        {/* COLONNE GAUCHE : PRÉSENTATION & MÉTRIQUES CLÉS (7 colonnes) */}
                        <div className="lg:col-span-7 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${activeSector.badgeColor}`}>
                                        <ActiveIcon className="h-3.5 w-3.5" />
                                        <span>{activeSector.name}</span>
                                    </span>
                                    <span className="text-xs text-neutral-600 font-mono font-medium">
                                        Protocole Métier Actif
                                    </span>
                                </div>

                                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
                                    {activeSector.headline}
                                </h3>

                                <p className="mt-4 text-sm text-neutral-800 leading-relaxed font-normal">
                                    {activeSector.description}
                                </p>

                                {/* Points clés métier */}
                                <div className="mt-6 space-y-3">
                                    {activeSector.keyPoints.map((point, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                            <span className="text-xs sm:text-sm text-neutral-900 leading-relaxed font-medium">
                                                {point}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3 Métriques percutantes en bas de colonne */}
                            <div className="mt-8 pt-6 border-t border-neutral-200 grid grid-cols-3 gap-4">
                                {activeSector.metrics.map((metric, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="text-xl sm:text-2xl font-extrabold tabular-nums text-neutral-900 tracking-tight">
                                            {metric.value}
                                        </div>
                                        <div className="text-[11px] sm:text-xs text-neutral-600 font-medium leading-tight">
                                            {metric.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* COLONNE DROITE : SIMULATION DE SCÉNARIO EN SITUATION (5 colonnes) */}
                        <div className="lg:col-span-5 flex flex-col justify-between bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-6 sm:p-7">
                            <div>
                                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-5">
                                    <div className="flex items-center gap-2">
                                        <Bot className="h-4 w-4 text-neutral-700" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                                            Exemple d&apos;appel traité
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-mono font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                        En direct
                                    </span>
                                </div>

                                {/* Image d'illustration du secteur d'activité */}
                                {activeSector.image && (
                                    <div className="relative mb-4 overflow-hidden rounded-xl border border-neutral-200 h-32 group shadow-2xs">
                                        <img
                                            src={activeSector.image}
                                            alt={activeSector.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
                                            <span className="font-semibold text-white drop-shadow-sm flex items-center gap-1.5">
                                                <ActiveIcon className="h-3.5 w-3.5 text-blue-400" />
                                                <span>{activeSector.name} · Environnement Pro</span>
                                            </span>
                                            <span className="text-[10px] text-white/90 font-mono bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                                                Standard actif
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Profil de l'appelant */}
                                <div className="rounded-xl border border-neutral-200 bg-white p-3.5 mb-4 shadow-2xs">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2.5 font-bold text-neutral-900">
                                            <AnimatedUserAvatar size="sm" src="/images/avatar-client.jpg" />
                                            <span>{activeSector.callSimulation.caller}</span>
                                        </div>
                                        <span className="text-[11px] font-mono text-neutral-500 font-medium">
                                            Aujourd&apos;hui
                                        </span>
                                    </div>
                                    <div className="text-xs text-neutral-600 mt-1 pl-8.5 font-medium">
                                        Motif : <span className="text-neutral-900 font-bold">{activeSector.callSimulation.callerType}</span>
                                    </div>
                                </div>

                                {/* Réponse vocale de l'IA */}
                                <div className="rounded-xl border border-blue-200/80 bg-blue-50/60 p-4 mb-4">
                                    <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-900 mb-1.5">
                                        <AnimatedAssistantAvatar size="sm" isSpeaking={true} />
                                        <span>Réponse vocale de AutoCall</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-neutral-900 italic leading-relaxed pl-7 font-medium">
                                        {activeSector.callSimulation.aiResponse}
                                    </p>
                                </div>

                                {/* Action automatique déclenchée */}
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                                    <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold mb-1">
                                        <Zap className="h-3.5 w-3.5 text-emerald-600" />
                                        <span>Action automatique exécutée :</span>
                                    </div>
                                    <p className="text-xs text-neutral-800 pl-5.5 font-medium">
                                        {activeSector.callSimulation.action}
                                    </p>
                                </div>
                            </div>

                            {/* Bouton de configuration directe */}
                            <div className="mt-6 pt-4 border-t border-neutral-200">
                                <a
                                    href="/register"
                                    className="inline-flex w-full h-10 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 text-xs font-semibold text-white transition-all hover:bg-black shadow-sm"
                                >
                                    <span>Activer ce modèle pour mon activité</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 4. TROIS GARANTIES ESSENTIELLES POUR TOUS LES MÉTIERS */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center gap-2.5 mb-2 text-neutral-900 font-bold text-sm">
                            <Clock className="h-4 w-4 text-neutral-700" />
                            <span>Déploiement en 5 minutes</span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                            Activez le renvoi d&apos;appel depuis votre ligne actuelle (Orange, SFR, Bouygues, Free ou VoIP) sans changer de numéro.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center gap-2.5 mb-2 text-neutral-900 font-bold text-sm">
                            <ShieldCheck className="h-4 w-4 text-neutral-700" />
                            <span>Confidentialité & RGPD</span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                            Données hébergées en Europe, chiffrées de bout en bout et conformes aux obligations de secret professionnel.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center gap-2.5 mb-2 text-neutral-900 font-bold text-sm">
                            <PhoneForwarded className="h-4 w-4 text-neutral-700" />
                            <span>Reprise en direct à tout moment</span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                            Transférez l&apos;appel en un clic vers votre mobile si vous souhaitez intervenir personnellement sur une conversation.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
