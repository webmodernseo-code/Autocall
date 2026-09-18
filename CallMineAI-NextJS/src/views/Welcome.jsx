'use client';

import { ArrowRight, Check, Headphones, LockKeyhole, PhoneCall } from 'lucide-react';
import { Link } from '@/lib/page-router';
import { route } from '@/lib/route';
import MarketingLayout from '@/layouts/MarketingLayout';
import CallSimulator from '@/components/marketing/CallSimulator';
import BentoFeatures from '@/components/marketing/BentoFeatures';
import UseCasesTabs from '@/components/marketing/UseCasesTabs';
import RoiCalculator from '@/components/marketing/RoiCalculator';
import PricingSection from '@/components/marketing/PricingSection';
import TestimonialsGrid from '@/components/marketing/TestimonialsGrid';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import IntegrationLogos from '@/components/marketing/IntegrationLogos';

const outcomes = [
    ['24 h / 24', 'Une présence qui ne laisse plus aucun appel sans réponse.'],
    ['320 ms', 'Une latence assez faible pour préserver une conversation naturelle.'],
    ['5 min', 'Le temps nécessaire pour mettre en ligne un premier scénario.'],
];

const steps = [
    ['01', 'Donnez-lui votre manière de travailler', 'Ajoutez vos consignes, vos réponses métier et votre ton. Votre agent apprend le cadre, sans perdre votre identité.'],
    ['02', 'Reliez vos outils quotidiens', 'Téléphonie, agenda et CRM restent synchronisés. Les informations circulent sans ressaisie ni rupture.'],
    ['03', 'Gardez la main sur chaque échange', 'Suivez les conversations, reprenez un appel quand il le faut et améliorez les scénarios à partir de faits concrets.'],
];

function SectionHeading({ kicker, title, copy, align = 'left' }) {
    const centered = align === 'center';
    return (
        <div className={`${centered ? 'mx-auto text-center' : ''} max-w-3xl`}>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{kicker}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
                {title}
            </h2>
            {copy && <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">{copy}</p>}
        </div>
    );
}

export default function Welcome({ plans = [] }) {
    return (
        <MarketingLayout>
            <section className="relative overflow-hidden border-b border-slate-200/70 bg-[#fbfaf7] dark:border-slate-800 dark:bg-slate-950">
                <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_72%_25%,rgba(37,99,235,0.10),transparent_34%)]" aria-hidden="true" />
                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-28">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                            Des conversations naturelles, déjà opérationnelles
                        </div>
                        <h1 className="mt-7 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-slate-950 dark:text-white sm:text-5xl lg:text-[4.4rem]">
                            Vos clients appellent. <span className="text-blue-700 dark:text-blue-400">Quelqu’un répond vraiment.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                            CallMind donne à vos équipes un agent vocal fiable pour accueillir, qualifier et organiser les demandes — avec le tact attendu d’un bon standard téléphonique.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link href={route('register')} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Commencer gratuitement <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                            <a href="#demo" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
                                <Headphones className="h-4 w-4" aria-hidden="true" /> Écouter une conversation
                            </a>
                        </div>
                        <div className="mt-6 flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:flex-wrap sm:gap-x-5">
                            {['10 minutes offertes', 'Sans carte bancaire', 'Configuration accompagnée'].map((item) => (
                                <span key={item} className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />{item}</span>
                            ))}
                        </div>
                    </div>

                    <div id="demo" className="scroll-mt-24 rounded-[1.75rem] border border-slate-200/80 bg-white p-2 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.3)] dark:border-slate-800 dark:bg-slate-900">
                        <CallSimulator />
                    </div>
                </div>
            </section>

            <section className="border-b border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
                    <p className="mb-7 text-center text-sm text-slate-500">S’intègre aux outils que vos équipes utilisent déjà</p>
                    <IntegrationLogos />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                    <SectionHeading kicker="Pensé pour le travail réel" title="Moins d’appels manqués. Plus de temps humain là où il compte." copy="CallMind prend en charge le répétitif, puis transmet le contexte aux bonnes personnes. Vos équipes ne disparaissent pas de la relation : elles y reviennent mieux préparées." />
                    <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-3">
                        {outcomes.map(([value, label]) => (
                            <div key={value} className="bg-white p-6 dark:bg-slate-900 sm:p-7">
                                <p className="font-display text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
                                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="scroll-mt-20 border-y border-slate-200/70 bg-[#f6f7f8] py-20 dark:border-slate-800 dark:bg-slate-900/50 md:py-28">
                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                    <SectionHeading align="center" kicker="Une plateforme, pas un gadget" title="Tout ce qu’il faut pour tenir une conversation utile" copy="Téléphonie, qualification, agenda et suivi commercial réunis dans une expérience simple à piloter." />
                    <div className="mt-12"><BentoFeatures /></div>
                </div>
            </section>

            <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-6 md:py-28 lg:px-8">
                <SectionHeading kicker="Simple à adopter" title="Votre méthode, augmentée en trois étapes" />
                <div className="mt-12 grid gap-5 md:grid-cols-3">
                    {steps.map(([number, title, copy]) => (
                        <article key={number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                            <span className="font-mono text-sm font-medium text-blue-700 dark:text-blue-400">{number}</span>
                            <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
                            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{copy}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section id="usecases" className="scroll-mt-20 border-y border-slate-200/70 bg-[#fbfaf7] py-20 dark:border-slate-800 dark:bg-slate-950 md:py-28">
                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                    <SectionHeading align="center" kicker="Adapté à votre métier" title="Un accueil qui comprend votre contexte" copy="Chaque secteur a ses mots, ses urgences et ses règles. L’agent s’y adapte, sans transformer vos clients en tickets." />
                    <div className="mt-12"><UseCasesTabs /></div>
                </div>
            </section>

            <section id="roi" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-6 md:py-28 lg:px-8"><RoiCalculator /></section>

            <section className="border-y border-slate-200/70 bg-[#f6f7f8] py-20 dark:border-slate-800 dark:bg-slate-900/50 md:py-28">
                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                    <SectionHeading align="center" kicker="Ils ont repris le contrôle de leurs appels" title="Des équipes plus disponibles, des clients mieux accueillis" />
                    <div className="mt-12"><TestimonialsGrid /></div>
                </div>
            </section>

            <section id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-6 md:py-28 lg:px-8">
                <SectionHeading align="center" kicker="Tarification claire" title="Commencez petit. Gardez une vision nette." copy="Un forfait lisible, sans infrastructure à acheter ni engagement caché." />
                <div className="mt-12"><PricingSection plans={plans} /></div>
            </section>

            <section id="faq" className="border-t border-slate-200/70 bg-[#fbfaf7] py-20 dark:border-slate-800 dark:bg-slate-950 md:py-28">
                <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
                    <SectionHeading align="center" kicker="Questions fréquentes" title="Avant de confier votre ligne à CallMind" />
                    <div className="mt-10"><FaqAccordion defaultLimit={6} /></div>
                </div>
            </section>

            <section className="bg-slate-950 py-16 text-white md:py-24">
                <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10"><PhoneCall className="h-5 w-5" aria-hidden="true" /></div>
                    <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">La prochaine conversation peut déjà être mieux accueillie.</h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">Créez votre premier agent vocal et testez-le avec votre propre scénario. Aucun déploiement complexe.</p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link href={route('register')} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">Créer mon agent <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                        <Link href={route('login')} className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10">Accéder à mon espace</Link>
                    </div>
                    <p className="mt-6 inline-flex items-center gap-2 text-xs text-slate-400"><LockKeyhole className="h-4 w-4" aria-hidden="true" /> Données chiffrées, hébergement européen et conformité RGPD</p>
                </div>
            </section>
        </MarketingLayout>
    );
}
