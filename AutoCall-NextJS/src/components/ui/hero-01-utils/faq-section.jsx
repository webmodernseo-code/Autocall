'use client';

import React, { useState } from 'react';
import { 
    HelpCircle, 
    ChevronDown, 
    MessageCircle, 
    PhoneCall, 
    Calendar, 
    ShieldCheck, 
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqSection() {
    const categories = [
        { id: 'all', label: "Toutes les questions" },
        { id: 'phone', label: "Numéro & Téléphonie" },
        { id: 'ai', label: "Voix IA & Conversations" },
        { id: 'sync', label: "Agendas & CRM" },
        { id: 'security', label: "Sécurité & RGPD" },
    ];

    const [activeCategory, setActiveCategory] = useState('all');
    const [openIndex, setOpenIndex] = useState(0);

    const questions = [
        {
            category: 'phone',
            q: "Dois-je changer de numéro de téléphone pour utiliser AutoCall ?",
            a: "Non, absolument pas. Vous conservez votre numéro professionnel habituel (fixe, mobile ou VoIP). Il vous suffit d'activer un simple renvoi d'appel (soit systématique, soit uniquement quand vous êtes déjà en ligne ou ne décrochez pas). La manipulation prend moins de 60 secondes auprès de votre opérateur (Orange, SFR, Bouygues, Free, etc.)."
        },
        {
            category: 'ai',
            q: "Les appelants réalisent-ils qu'ils s'entretiennent avec une IA ?",
            a: "Les voix de AutoCall sont ultra-naturelles et intègrent le souffle, les intonations et le rythme d'une véritable conversation humaine. Grâce à une latence imperceptible (< 500 ms), l'échange est fluide, courtois et sans temps mort. L'agent comprend parfaitement les interruptions et s'adapte au vocabulaire spécifique de votre profession."
        },
        {
            category: 'phone',
            q: "Que se passe-t-il si un appel est particulièrement urgent ?",
            a: "Vous définissez vos propres règles de criticité (ex: urgence vitale médicale, garde à vue, fuite d'eau continue). Dès qu'un critère d'urgence est détecté, AutoCall peut soit vous expédier un SMS prioritaire immédiat avec la transcription, soit transférer instantanément la ligne vers votre téléphone personnel."
        },
        {
            category: 'sync',
            q: "Comment s'effectue la synchronisation avec mon agenda ?",
            a: "AutoCall se connecte directement à votre outil d'agenda (Google Calendar, Microsoft Outlook 365, Calendly ou Doctolib). Durant l'appel, il vérifie vos créneaux réellement disponibles en temps réel, propose des options compatibles à l'appelant et bloque le rendez-vous immédiatement pour éliminer tout risque de doublon."
        },
        {
            category: 'security',
            q: "Mes conversations et les données de mes clients sont-elles protégées ?",
            a: "Oui, la confidentialité est notre priorité absolue. Les données sont chiffrées de bout en bout (SSL 256-bit), hébergées sur des serveurs sécurisés en Europe et strictement conformes au RGPD ainsi qu'aux exigences de secret professionnel (médical, juridique)."
        },
        {
            category: 'sync',
            q: "Puis-je personnaliser le scénario et le ton de mon assistant ?",
            a: "Totalement. Depuis votre espace client, vous ajustez en quelques clics le prénom de votre assistant, son niveau de formalité (vouvoiement, chaleur du ton), les questions obligatoires à poser, vos horaires d'ouverture et les consignes d'accès à votre établissement."
        },
        {
            category: 'security',
            q: "Comment fonctionne l'essai gratuit ?",
            a: "L'essai gratuit est sans aucun engagement et ne requiert aucune carte bancaire. Vous bénéficiez de minutes d'appels offertes pour configurer votre assistant, le tester sur votre propre numéro et valider son efficacité en conditions réelles avant de choisir une formule."
        },
        {
            category: 'ai',
            q: "Que se passe-t-il si un appelant a un accent ou parle une autre langue ?",
            a: "AutoCall prend en charge 29 langues et reconnaît les accents régionaux avec une grande précision. Si un client commence à s'exprimer en anglais, espagnol, allemand ou arabe, l'IA détecte la langue et poursuit naturellement l'échange dans la langue de l'interlocuteur."
        }
    ];

    const filteredQuestions = activeCategory === 'all'
        ? questions
        : questions.filter(item => item.category === activeCategory);

    const toggleAccordion = (idx) => {
        setOpenIndex(openIndex === idx ? -1 : idx);
    };

    return (
        <section id="faq" className="relative px-6 py-20 sm:py-28 bg-[#090A0F] text-white border-y border-white/[0.08] scroll-mt-20">
            {/* Halo lumineux d'ambiance */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full blur-[170px] opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-4xl">
                
                {/* 1. ENTÊTE DE SECTION */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md mb-4 shadow-xs">
                        <HelpCircle className="h-3.5 w-3.5 text-white/60" />
                        <span>Foire Aux Questions</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.18]">
                        Tout ce que vous devez savoir avant de{' '}
                        <span className="font-hero-serif italic text-white/95">
                            vous lancer.
                        </span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">
                        Des réponses claires et concrètes aux interrogations les plus fréquentes des professionnels qui nous confient leur standard.
                    </p>

                    {/* 2. FILTRE DE CATÉGORIES RAPIDE */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                        {categories.map((cat) => {
                            const isSelected = cat.id === activeCategory;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setActiveCategory(cat.id);
                                        setOpenIndex(0);
                                    }}
                                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
                                        isSelected
                                            ? 'bg-white text-black font-semibold shadow-sm'
                                            : 'bg-white/[0.04] border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. ACCORDÉON INTERACTIF FLUIDE */}
                <div className="space-y-3">
                    {filteredQuestions.map((item, idx) => {
                        const isOpen = openIndex === idx;

                        return (
                            <div
                                key={idx}
                                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                                    isOpen
                                        ? 'bg-[#10131B] border-white/20 shadow-xl'
                                        : 'bg-[#0E1015]/80 border-white/10 hover:border-white/15 hover:bg-[#10131B]/60'
                                }`}
                            >
                                <button
                                    onClick={() => toggleAccordion(idx)}
                                    className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-sm sm:text-base font-semibold text-white/90">
                                        {item.q}
                                    </span>
                                    <span className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-white text-black' : ''}`}>
                                        <ChevronDown className="h-4 w-4" />
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        >
                                            <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-white/65 leading-relaxed border-t border-white/5 pt-4">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* 4. ENCART CONTACT RASSURANT */}
                <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white">
                            <MessageCircle className="h-5 w-5 text-sky-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white">
                                Vous avez une question spécifique sur votre métier ?
                            </h4>
                            <p className="text-xs text-white/50">
                                Notre équipe technique répond à toutes vos questions en direct.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/register"
                        className="shrink-0 inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-xs font-semibold text-white transition-all hover:bg-white hover:text-black cursor-pointer"
                    >
                        <span>Échanger avec un conseiller</span>
                        <ArrowRight className="h-3 w-3" />
                    </a>
                </div>

            </div>
        </section>
    );
}
