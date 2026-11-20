'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqSection() {
    const categories = [
        { id: 'all', label: 'Toutes les questions' },
        { id: 'phone', label: 'Numéro & Téléphonie' },
        { id: 'ai', label: 'Voix IA & Conversations' },
        { id: 'sync', label: 'Agendas & CRM' },
        { id: 'security', label: 'Sécurité & RGPD' },
    ];

    const [activeCategory, setActiveCategory] = useState('all');
    const [openIndex, setOpenIndex] = useState(0);

    const questions = [
        {
            category: 'phone',
            q: 'Dois-je changer de numéro de téléphone pour utiliser AutoCall ?',
            a: "Non, absolument pas. Vous conservez votre numéro professionnel habituel (fixe, mobile ou VoIP). Il vous suffit d'activer un simple renvoi d'appel (soit systématique, soit uniquement quand vous êtes déjà en ligne ou ne décrochez pas). La manipulation prend moins de 60 secondes auprès de votre opérateur (Orange, SFR, Bouygues, Free, etc.).",
        },
        {
            category: 'ai',
            q: "Les appelants réalisent-ils qu'ils s'entretiennent avec une IA ?",
            a: "Les voix d'AutoCall sont ultra-naturelles et intègrent le souffle, les intonations et le rythme d'une véritable conversation humaine. Grâce à une latence imperceptible (< 500 ms), l'échange est fluide, courtois et sans temps mort. L'agent comprend parfaitement les interruptions et s'adapte au vocabulaire spécifique de votre profession.",
        },
        {
            category: 'phone',
            q: 'Que se passe-t-il si un appel est particulièrement urgent ?',
            a: "Vous définissez vos propres règles de criticité (ex: urgence vitale médicale, garde à vue, fuite d'eau continue). Dès qu'un critère d'urgence est détecté, AutoCall peut soit vous expédier un SMS prioritaire immédiat avec la transcription, soit transférer instantanément la ligne vers votre téléphone personnel.",
        },
        {
            category: 'sync',
            q: "Comment s'effectue la synchronisation avec mon agenda ?",
            a: "AutoCall se connecte directement à votre outil d'agenda (Google Calendar, Microsoft Outlook 365, Calendly ou Doctolib). Durant l'appel, il vérifie vos créneaux réellement disponibles en temps réel, propose des options compatibles à l'appelant et bloque le rendez-vous immédiatement pour éliminer tout risque de doublon.",
        },
        {
            category: 'security',
            q: 'Mes conversations et les données de mes clients sont-elles protégées ?',
            a: "Oui, la confidentialité est notre priorité absolue. Les données sont chiffrées de bout en bout (SSL 256-bit), hébergées sur des serveurs sécurisés en Europe et strictement conformes au RGPD ainsi qu'aux exigences de secret professionnel (médical, juridique).",
        },
        {
            category: 'sync',
            q: 'Puis-je personnaliser le scénario et le ton de mon assistant ?',
            a: "Totalement. Depuis votre espace client, vous ajustez en quelques clics le prénom de votre assistant, son niveau de formalité (vouvoiement, chaleur du ton), les questions obligatoires à poser, vos horaires d'ouverture et les consignes d'accès à votre établissement.",
        },
        {
            category: 'security',
            q: "Comment fonctionne l'essai gratuit ?",
            a: "L'essai gratuit est sans aucun engagement et ne requiert aucune carte bancaire. Vous bénéficiez de minutes d'appels offertes pour configurer votre assistant, le tester sur votre propre numéro et valider son efficacité en conditions réelles avant de choisir une formule.",
        },
        {
            category: 'ai',
            q: "Que se passe-t-il si un appelant a un accent ou parle une autre langue ?",
            a: "AutoCall prend en charge 29 langues et reconnaît les accents régionaux avec une grande précision. Si un client commence à s'exprimer en anglais, espagnol, allemand ou arabe, l'IA détecte la langue et poursuit naturellement l'échange dans la langue de l'interlocuteur.",
        },
    ];

    const filteredQuestions =
        activeCategory === 'all' ? questions : questions.filter((item) => item.category === activeCategory);

    const toggleAccordion = (idx) => {
        setOpenIndex(openIndex === idx ? -1 : idx);
    };

    return (
        <section id="faq" className="bg-[#F8FAFC] text-neutral-900 py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/80 scroll-mt-20">
            <div className="mx-auto max-w-4xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-xs font-medium text-neutral-600 shadow-2xs mb-4">
                        <HelpCircle className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span>Foire Aux Questions</span>
                    </div>

                    <h2 className="font-hero-sans text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-neutral-950">
                        Questions fréquentes
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Des réponses claires et concrètes avant de connecter votre standard téléphonique.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                        {categories.map((cat) => {
                            const isSelected = cat.id === activeCategory;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => {
                                        setActiveCategory(cat.id);
                                        setOpenIndex(0);
                                    }}
                                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                                            : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:border-neutral-300'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredQuestions.map((item, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={`rounded-xl border transition-all duration-200 overflow-hidden bg-white ${
                                    isOpen ? 'border-blue-300 shadow-xs' : 'border-neutral-200/90 hover:border-neutral-300'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(idx)}
                                    className="flex w-full items-center justify-between gap-4 p-5 text-left cursor-pointer"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-sm sm:text-base font-semibold text-neutral-950">{item.q}</span>
                                    <span
                                        className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full border transition-transform duration-200 ${
                                            isOpen
                                                ? 'rotate-180 bg-[#2563EB] border-[#2563EB] text-white'
                                                : 'border-neutral-200 bg-neutral-50 text-neutral-500'
                                        }`}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                                        >
                                            <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3.5">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 rounded-2xl border border-neutral-200/90 bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                            <MessageCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-neutral-950">
                                Une question spécifique sur votre installation ?
                            </h4>
                            <p className="text-xs text-neutral-500">
                                Créez votre compte gratuit ou consultez la documentation technique.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/register"
                        className="shrink-0 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] cursor-pointer"
                    >
                        <span>Démarrer gratuitement</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
