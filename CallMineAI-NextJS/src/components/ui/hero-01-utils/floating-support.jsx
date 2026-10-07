'use client';

import React, { useState } from 'react';
import { 
    Headphones, 
    X, 
    MessageSquare, 
    PhoneCall, 
    FileText, 
    Send, 
    CheckCircle2, 
    Sparkles, 
    Clock,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingSupportButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('menu'); // 'menu' | 'message' | 'callback'
    const [submitted, setSubmitted] = useState(false);

    // Formulaires
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmitMessage = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setMode('menu');
            setMessage('');
            setEmail('');
            setIsOpen(false);
        }, 2200);
    };

    const handleSubmitCallback = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setMode('menu');
            setPhone('');
            setIsOpen(false);
        }, 2200);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* PANNEAU FLOTTANT DU SUPPORT */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.95 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="mb-3 w-[360px] sm:w-[390px] rounded-3xl border border-white/15 bg-[#0F121A]/95 p-6 shadow-2xl backdrop-blur-2xl text-white overflow-hidden"
                    >
                        {/* En-tête du popup */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300">
                                    <Headphones className="h-4.5 w-4.5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Support CallMind AI</h4>
                                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>En ligne · Réponse &lt; 5 min</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                aria-label="Fermer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* ÉTAT CONFIRMATION */}
                        {submitted ? (
                            <div className="py-8 text-center space-y-2">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 mb-2">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <h5 className="text-sm font-semibold text-white">Demande transmise avec succès !</h5>
                                <p className="text-xs text-white/60">
                                    Un conseiller ou l&apos;IA de test vous contacte immédiatement.
                                </p>
                            </div>
                        ) : mode === 'menu' ? (
                            /* MENU DES ACTIONS */
                            <div className="space-y-2.5">
                                <p className="text-xs text-white/70 mb-3 leading-relaxed">
                                    Une question sur la compatibilité de votre ligne, les tarifs ou la personnalisation ? Choisissez une option :
                                </p>

                                <button
                                    onClick={() => setMode('callback')}
                                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-left transition-all hover:bg-white/[0.07] hover:border-white/20 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300">
                                            <PhoneCall className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-white">Tester un appel IA sur mon mobile</div>
                                            <div className="text-[11px] text-white/50">Recevez un appel test gratuit en 30s</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-white/40" />
                                </button>

                                <button
                                    onClick={() => setMode('message')}
                                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-left transition-all hover:bg-white/[0.07] hover:border-white/20 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                                            <MessageSquare className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-white">Envoyer un message à l&apos;équipe</div>
                                            <div className="text-[11px] text-white/50">Réponse directe par e-mail ou SMS</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-white/40" />
                                </button>

                                <a
                                    href="#faq"
                                    onClick={() => setIsOpen(false)}
                                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-left transition-all hover:bg-white/[0.07] hover:border-white/20 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-white">Consulter la Foire Aux Questions</div>
                                            <div className="text-[11px] text-white/50">Réponses aux 8 questions clés</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-white/40" />
                                </a>
                            </div>
                        ) : mode === 'callback' ? (
                            /* FORMULAIRE DE RAPPEL DE TEST */
                            <form onSubmit={handleSubmitCallback} className="space-y-3">
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="font-semibold text-white">Tester un appel en direct</span>
                                    <button
                                        type="button"
                                        onClick={() => setMode('menu')}
                                        className="text-white/50 hover:text-white text-[11px] cursor-pointer"
                                    >
                                        ← Retour
                                    </button>
                                </div>

                                <p className="text-[11px] text-white/60 leading-relaxed">
                                    Saisissez votre numéro de portable. Notre agent IA vous appelle dans la minute pour vous faire écouter son naturel vocal.
                                </p>

                                <div>
                                    <label className="block text-[11px] text-white/70 mb-1">Votre numéro de mobile</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="06 12 34 56 78"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full h-10 rounded-xl border border-white/15 bg-white/5 px-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/30"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-10 rounded-xl bg-white text-black font-semibold text-xs transition-all hover:bg-neutral-200 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <PhoneCall className="h-3.5 w-3.5" />
                                    <span>Recevoir l&apos;appel test gratuit</span>
                                </button>
                            </form>
                        ) : (
                            /* FORMULAIRE DE MESSAGE DIRECT */
                            <form onSubmit={handleSubmitMessage} className="space-y-3">
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="font-semibold text-white">Poser une question</span>
                                    <button
                                        type="button"
                                        onClick={() => setMode('menu')}
                                        className="text-white/50 hover:text-white text-[11px] cursor-pointer"
                                    >
                                        ← Retour
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-[11px] text-white/70 mb-1">Votre adresse e-mail</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="vous@cabinet.fr"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-10 rounded-xl border border-white/15 bg-white/5 px-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/30"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] text-white/70 mb-1">Votre question</label>
                                    <textarea
                                        rows={3}
                                        required
                                        placeholder="Comment fonctionne le renvoi d'appel avec mon opérateur ?"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/30 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-10 rounded-xl bg-white text-black font-semibold text-xs transition-all hover:bg-neutral-200 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    <span>Envoyer ma demande</span>
                                </button>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BOUTON FLOTTANT DÉCLENCHEUR */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-3 rounded-full border border-white/15 bg-[#0E1015]/90 px-4 py-2.5 text-white shadow-2xl backdrop-blur-xl transition-all hover:bg-[#151822] hover:border-white/25 cursor-pointer"
                aria-label="Support et assistance"
            >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                    <Headphones className="h-4 w-4" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                </div>

                <div className="text-left pr-1">
                    <div className="text-xs font-semibold text-white leading-tight">
                        Support en direct
                    </div>
                    <div className="text-[10px] text-white/50 leading-tight">
                        Une question ?
                    </div>
                </div>
            </motion.button>
        </div>
    );
}
