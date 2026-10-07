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
    Bot
} from 'lucide-react';

export default function SectorsSection() {
    const sectors = [
        {
            id: 'sante',
            name: "Santé & Médical",
            shortTitle: "Santé",
            icon: Stethoscope,
            headline: "Ne laissez plus le téléphone interrompre vos soins et consultations.",
            description: "Pendant que vous traitez vos patients, CallMind AI gère le standard avec empathie : qualification du motif, prise de rendez-vous connectée à votre agenda et filtrage des urgences vitales.",
            badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
            accentColor: "emerald",
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
            description: "En audience ou en rédaction d'actes, ne perdez aucun dossier stratégique. CallMind AI qualifie la nature de la demande, détecte les urgences et alerte l'avocat d'astreinte en temps réel.",
            badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
            accentColor: "amber",
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
            description: "45% des acquéreurs appellent le soir et le week-end. CallMind AI répond instantanément, vérifie le budget et le financement, puis planifie la visite directement sur l'agenda du négociateur.",
            badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
            accentColor: "sky",
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
            description: "Sur un chantier ou les mains prises, impossible de décrocher. Chaque appel manqué est un chantier qui part chez un concurrent. CallMind AI recueille l'urgence et planifie votre tournée.",
            badgeColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
            accentColor: "orange",
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
            description: "En plein service ou en préparation, le bruit et le rythme rendent impossible la prise d'appel. CallMind AI réserve les tables en direct selon votre jauge et répond aux questions fréquentes.",
            badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
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
            description: "Finis les transferts perdus et les messages approximatifs sur post-it. CallMind AI oriente précisément les interlocuteurs vers le bon collaborateur et rédige des synthèses claires dans votre CRM.",
            badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
            accentColor: "purple",
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
        <section id="secteurs" className="relative px-6 py-20 sm:py-28 text-white scroll-mt-20">
            {/* LUEUR RADIALE D'ARRIÈRE-PLAN */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[1000px] rounded-full blur-[170px] opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl">
                {/* 1. ENTÊTE DE SECTION */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md mb-4 shadow-xs">
                        <SlidersHorizontal className="h-3.5 w-3.5 text-white/60" />
                        <span>Secteurs d&apos;activité & Métiers</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.18]">
                        Une intelligence vocale qui parle le langage de{' '}
                        <span className="font-hero-serif italic text-white/95">
                            votre profession.
                        </span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">
                        Chaque métier a son vocabulaire, ses urgences et ses habitudes. CallMind AI est préconfiguré pour adopter les protocoles spécifiques à votre domaine sans nécessiter de formation complexe.
                    </p>

                    {/* 2. ONGLETS DE SÉLECTION RAPIDE DES SECTEURS */}
                    <div className="mt-9 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md max-w-3xl mx-auto">
                        {sectors.map((sector) => {
                            const isSelected = sector.id === activeSectorId;
                            const IconComponent = sector.icon;

                            return (
                                <button
                                    key={sector.id}
                                    onClick={() => setActiveSectorId(sector.id)}
                                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? 'bg-white text-black shadow-md font-semibold scale-[1.02]'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <IconComponent className={`h-3.5 w-3.5 ${isSelected ? 'text-black' : 'text-white/60'}`} />
                                    <span>{sector.shortTitle}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. VITRINE BENTO DU SECTEUR SÉLECTIONNÉ */}
                <div className="rounded-3xl border border-white/10 bg-[#0E1015]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                        
                        {/* COLONNE GAUCHE : PRÉSENTATION & MÉTRIQUES CLÉS (7 colonnes) */}
                        <div className="lg:col-span-7 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${activeSector.badgeColor}`}>
                                        <ActiveIcon className="h-3.5 w-3.5" />
                                        <span>{activeSector.name}</span>
                                    </span>
                                    <span className="text-xs text-white/40 font-mono">
                                        Protocole Métier Actif
                                    </span>
                                </div>

                                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                                    {activeSector.headline}
                                </h3>

                                <p className="mt-4 text-sm text-white/70 leading-relaxed">
                                    {activeSector.description}
                                </p>

                                {/* Points clés métier */}
                                <div className="mt-6 space-y-3">
                                    {activeSector.keyPoints.map((point, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                            <span className="text-xs sm:text-sm text-white/80 leading-relaxed">
                                                {point}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3 Métriques percutantes en bas de colonne */}
                            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                                {activeSector.metrics.map((metric, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="text-xl sm:text-2xl font-bold tabular-nums text-white tracking-tight">
                                            {metric.value}
                                        </div>
                                        <div className="text-[11px] sm:text-xs text-white/50 leading-tight">
                                            {metric.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* COLONNE DROITE : SIMULATION DE SCÉNARIO EN SITUATION (5 colonnes) */}
                        <div className="lg:col-span-5 flex flex-col justify-between bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-7">
                            <div>
                                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                                    <div className="flex items-center gap-2">
                                        <Bot className="h-4 w-4 text-white/70" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                                            Exemple d&apos;appel traité
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        En direct
                                    </span>
                                </div>

                                {/* Profil de l'appelant */}
                                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 mb-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="font-semibold text-white">
                                            {activeSector.callSimulation.caller}
                                        </div>
                                        <span className="text-[11px] font-mono text-white/40">
                                            Aujourd&apos;hui
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/50 mt-1">
                                        Motif : <span className="text-white/80 font-medium">{activeSector.callSimulation.callerType}</span>
                                    </div>
                                </div>

                                {/* Réponse vocale de l'IA */}
                                <div className="rounded-xl border border-white/15 bg-white/[0.07] p-4 mb-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-white/90 mb-1.5">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                            IA
                                        </span>
                                        <span>Réponse vocale de CallMind</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/90 italic leading-relaxed pl-7">
                                        {activeSector.callSimulation.aiResponse}
                                    </p>
                                </div>

                                {/* Action automatique déclenchée */}
                                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3.5">
                                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                                        <Zap className="h-3.5 w-3.5" />
                                        <span>Action automatique exécutée :</span>
                                    </div>
                                    <p className="text-xs text-white/80 pl-5.5">
                                        {activeSector.callSimulation.action}
                                    </p>
                                </div>
                            </div>

                            {/* Bouton de configuration directe */}
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <a
                                    href="/register"
                                    className="inline-flex w-full h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-black transition-all hover:bg-neutral-200 active:scale-[0.99]"
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
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                        <div className="flex items-center gap-2.5 mb-2 text-white font-semibold text-sm">
                            <Clock className="h-4 w-4 text-white/70" />
                            <span>Déploiement en 5 minutes</span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                            Activez le renvoi d&apos;appel depuis votre ligne actuelle (Orange, SFR, Bouygues, Free ou VoIP) sans changer de numéro.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                        <div className="flex items-center gap-2.5 mb-2 text-white font-semibold text-sm">
                            <ShieldCheck className="h-4 w-4 text-white/70" />
                            <span>Confidentialité & RGPD</span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                            Données hébergées en Europe, chiffrées de bout en bout et conformes aux obligations de secret professionnel.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                        <div className="flex items-center gap-2.5 mb-2 text-white font-semibold text-sm">
                            <PhoneForwarded className="h-4 w-4 text-white/70" />
                            <span>Reprise en direct à tout moment</span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                            Transférez l&apos;appel en un clic vers votre mobile si vous souhaitez intervenir personnellement sur une conversation.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
