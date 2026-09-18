'use client';

import { Star, Quote, TrendingUp } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: 'Guillaume Deffontaines',
        role: 'Directeur du Développement Commercial',
        company: 'Groupe Horizon Immobilier',
        metric: '+48% de visites concrétisées',
        quote: 'En intégrant CallMindAI sur nos annonces, nous rappelons chaque acquéreur en moins de 90 secondes. La pré-qualification du budget est d’une précision exemplaire, et nos négociateurs ne traitent plus que des dossiers mûrs.',
        initials: 'GD'
    },
    {
        name: 'Dr. Sarah Bensoussan',
        role: 'Médecin Coordinateur',
        company: 'Centre Médical Alliance Paris',
        metric: '4h de secrétariat libérées / jour',
        quote: 'Notre secrétariat était saturé d’appels pour des créneaux et des reports. L’agent téléphonique CallMindAI prend en charge 100% des demandes de rendez-vous avec une chaleur et une écoute qui rassurent les patients.',
        initials: 'SB'
    },
    {
        name: 'Thomas Vaudreuil',
        role: 'Fondateur & Directeur Général',
        company: 'GrowthWave Télémarketing',
        metric: '3.8x plus de RDV démo fixés',
        quote: 'Nous déployons CallMindAI en marque blanche pour nos 25 clients B2B. Le dialer régulé et la synchronisation instantanée avec HubSpot nous ont permis de multiplier par quatre nos volumes sans recruter.',
        initials: 'TV'
    }
];

export default function TestimonialsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
                <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                    <div className="space-y-4">
                        {/* Rating & Metric badge */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                                {t.metric}
                            </span>
                        </div>

                        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                            « {t.quote} »
                        </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs font-mono">
                            {t.initials}
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.role} • <strong className="font-semibold text-slate-700 dark:text-slate-300">{t.company}</strong></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
