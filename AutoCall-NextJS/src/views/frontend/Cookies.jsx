'use client';

import { Trans } from 'react-i18next';
import React from 'react';
import LegalLayout, { LegalArticle, LegalBox } from '@/components/legal/LegalLayout';
import { Head } from '@/lib/page-router';
import { Cookie, ShieldCheck, Check, Settings, EyeOff, Shield } from 'lucide-react';

const TABLE_OF_CONTENTS = [
    { id: 'art-1', title: 'Définition & Cadre Réglementaire CNIL' },
    { id: 'art-2', title: 'Cookies Strictement Nécessaires (Essentiels)' },
    { id: 'art-3', title: 'Cookies de Préférences & Affichage' },
    { id: 'art-4', title: 'Zéro Traceur Publicitaire & Non-Revente' },
    { id: 'art-5', title: 'Durée de Conservation des Traceurs' },
    { id: 'art-6', title: 'Comment Contrôler vos Cookies' },
];

export default function CookiesDoc() {
    return (
        <LegalLayout
            eyebrow="Vie Privée & Traceurs Techniques"
            title="Politique des Cookies"
            titleSerif="& Traceurs Techniques"
            subtitle="Informations transparentes sur les traceurs techniques utilisés pour assurer la sécurité et le bon fonctionnement de votre espace AutoCall."
            lastUpdated="1er Mars 2026"
            effectiveDate="Entrée en vigueur immédiate"
            accentColor="teal"
            penalNotice={{
                title: "Engagement de Transparence & Zéro Surveillance Publicitaire",
                description: "AutoCall n'utilise aucun traceur publicitaire espion, aucun cookie tiers intrusif et ne pratique aucune revente de données de navigation. Seuls les traceurs strictement nécessaires à la sécurité de vos sessions et à la délivrance du service SaaS sont déployés."
            }}
            tableOfContents={TABLE_OF_CONTENTS}
        >
            <Head title="Politique des Cookies · AutoCall" />

            {/* ART 1 */}
            <LegalArticle id="art-1" number="ARTICLE 01" title="Définition & Cadre Réglementaire CNIL" accentColor="teal">
                <p>
                    Un « cookie » (ou traceur) est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou smartphone) lors de la consultation d’un site web ou de l’utilisation d’une application. Il permet à son émetteur d’identifier le terminal pendant sa durée de validité.
                </p>
                <p>
                    La présente politique est rédigée en conformité avec l’<strong>article 82 de la Loi Informatique et Libertés</strong>, la <strong>directive européenne ePrivacy (2002/58/CE modifiée)</strong> et les <strong>lignes directrices de la CNIL</strong> du 17 septembre 2020.
                </p>
            </LegalArticle>

            {/* ART 2 */}
            <LegalArticle id="art-2" number="ARTICLE 02" title="Cookies Strictement Nécessaires au Fonctionnement (Essentiels)" accentColor="teal">
                <p>
                    Ces cookies sont indispensables au fonctionnement technique de la plateforme et à la sécurité de votre compte. Conformément à la réglementation, <strong>ils sont exemptés du recueil préalable de votre consentement</strong> car ils ont pour finalité exclusive de permettre ou faciliter la communication par voie électronique ou sont strictement nécessaires à la fourniture d’un service expressément demandé par l’utilisateur.
                </p>
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] text-xs shadow-2xs">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#1B4654]/30 bg-[#1B4654]/10 text-[#1B4654] dark:text-[#5EC2D7] font-mono">
                                <th className="p-3">Nom du Cookie</th>
                                <th className="p-3">Finalité Technique</th>
                                <th className="p-3"><Trans i18nKey="client.esim_catalog_ui.tbl_type" /></th>
                                <th className="p-3">Durée de Vie</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-white/[0.05] text-neutral-700 dark:text-white/70">
                            <tr>
                                <td className="p-3">
                                    <span className="font-mono text-xs font-semibold text-[#1B4654] dark:text-[#5EC2D7] bg-[#1B4654]/10 dark:bg-[#1B4654]/30 px-2 py-0.5 rounded-md border border-[#1B4654]/30">
                                        autocall_session
                                    </span>
                                </td>
                                <td className="p-3">Maintien sécurisé de la session utilisateur connectée au dashboard</td>
                                <td className="p-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#1B4654]/15 text-[#1B4654] dark:bg-[#1B4654]/30 dark:text-[#5EC2D7]">
                                        Essentiel
                                    </span>
                                </td>
                                <td className="p-3">Session / 14 jours</td>
                            </tr>
                            <tr>
                                <td className="p-3">
                                    <span className="font-mono text-xs font-semibold text-[#1B4654] dark:text-[#5EC2D7] bg-[#1B4654]/10 dark:bg-[#1B4654]/30 px-2 py-0.5 rounded-md border border-[#1B4654]/30">
                                        XSRF-TOKEN
                                    </span>
                                </td>
                                <td className="p-3">Protection contre les attaques de falsification de requêtes intersites (CSRF)</td>
                                <td className="p-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#1B4654]/15 text-[#1B4654] dark:bg-[#1B4654]/30 dark:text-[#5EC2D7]">
                                        Sécurité
                                    </span>
                                </td>
                                <td className="p-3">Session</td>
                            </tr>
                            <tr>
                                <td className="p-3">
                                    <span className="font-mono text-xs font-semibold text-[#1B4654] dark:text-[#5EC2D7] bg-[#1B4654]/10 dark:bg-[#1B4654]/30 px-2 py-0.5 rounded-md border border-[#1B4654]/30">
                                        cf_clearance / __cf_bm
                                    </span>
                                </td>
                                <td className="p-3">Sécurité anti-DDoS et protection contre les attaques de robots malveillants</td>
                                <td className="p-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 dark:bg-white/10 dark:text-neutral-300">
                                        Infrastructure
                                    </span>
                                </td>
                                <td className="p-3">30 min à 1 an</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </LegalArticle>

            {/* ART 3 */}
            <LegalArticle id="art-3" number="ARTICLE 03" title="Cookies de Préférences & Affichage" accentColor="teal">
                <p>
                    Ces traceurs mémorisent vos préférences fonctionnelles pour fluidifier votre expérience utilisateur sur la plateforme :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-2xl border border-[#1B4654]/25 bg-[#1B4654]/5 dark:bg-[#1B4654]/10 p-4 space-y-1.5 shadow-2xs">
                        <strong className="text-[#1B4654] dark:text-[#5EC2D7] block font-mono text-xs">1. Préférence de Langue &amp; Devises</strong>
                        <p className="text-neutral-600 dark:text-white/70">
                            Mémorisation de votre langue (Français, Anglais, Espagnol, Allemand) et de votre devise favorite (EUR, USD, FCFA).
                        </p>
                    </div>
                    <div className="rounded-2xl border border-[#1B4654]/25 bg-[#1B4654]/5 dark:bg-[#1B4654]/10 p-4 space-y-1.5 shadow-2xs">
                        <strong className="text-[#1B4654] dark:text-[#5EC2D7] block font-mono text-xs">2. Mode Sombre / Clair</strong>
                        <p className="text-neutral-600 dark:text-white/70">
                            Conservation persistante de votre choix esthétique de thème sur votre navigateur local.
                        </p>
                    </div>
                </div>
            </LegalArticle>

            {/* ART 4 */}
            <LegalArticle id="art-4" number="ARTICLE 04" title="Zéro Traceur Publicitaire & Non-Revente" accentColor="teal">
                <div className="rounded-2xl border border-[#1B4654]/35 bg-[#1B4654]/10 dark:bg-[#1B4654]/20 p-5 text-xs space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#1B4654] dark:text-[#5EC2D7]" />
                        <p className="font-semibold text-[#1B4654] dark:text-[#5EC2D7] text-sm">
                            Principe Cardinal : Zéro Pistage Publicitaire Tiers
                        </p>
                    </div>
                    <p className="text-neutral-700 dark:text-white/80 leading-relaxed">
                        AutoCall n&apos;intègre aucun pixel publicitaire (aucun tracker Facebook, aucun tag Google Ads, aucun pixel TikTok ou courtier de données). Vos habitudes de navigation et vos flux d&apos;appels téléphoniques ne font l&apos;objet d&apos;aucun profilage commercial ni d&apos;aucune revente ou échange auprès d&apos;annonceurs publicitaires.
                    </p>
                </div>
            </LegalArticle>

            {/* ART 5 */}
            <LegalArticle id="art-5" number="ARTICLE 05" title="Durée de Conservation des Traceurs" accentColor="teal">
                <p>
                    Conformément aux recommandations de la CNIL, la durée de vie des cookies déposés sur votre terminal n’excède pas <strong>treize (13) mois</strong> à compter de leur premier dépôt. À l’issue de cette période, tout cookie persistant est automatiquement purgé.
                </p>
            </LegalArticle>

            {/* ART 6 */}
            <LegalArticle id="art-6" number="ARTICLE 06" title="Comment Contrôler et Désactiver les Cookies" accentColor="teal">
                <p>
                    Vous pouvez à tout moment configurer votre navigateur pour accepter, refuser ou supprimer les cookies. Veuillez noter que la désactivation des cookies strictement nécessaires peut empêcher la connexion à votre espace client sécurisé.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="rounded-2xl border border-[#1B4654]/20 bg-[#1B4654]/5 dark:bg-[#1B4654]/10 p-3.5 space-y-1 shadow-2xs">
                        <strong className="text-[#1B4654] dark:text-[#5EC2D7] block font-semibold">Google Chrome &amp; Brave</strong>
                        <p className="text-neutral-600 dark:text-white/60">Paramètres → Confidentialité et sécurité → Cookies et autres données des sites.</p>
                    </div>
                    <div className="rounded-2xl border border-[#1B4654]/20 bg-[#1B4654]/5 dark:bg-[#1B4654]/10 p-3.5 space-y-1 shadow-2xs">
                        <strong className="text-[#1B4654] dark:text-[#5EC2D7] block font-semibold">Mozilla Firefox</strong>
                        <p className="text-neutral-600 dark:text-white/60">Paramètres → Vie privée et sécurité → Cookies et données de sites.</p>
                    </div>
                    <div className="rounded-2xl border border-[#1B4654]/20 bg-[#1B4654]/5 dark:bg-[#1B4654]/10 p-3.5 space-y-1 shadow-2xs">
                        <strong className="text-[#1B4654] dark:text-[#5EC2D7] block font-semibold">Apple Safari</strong>
                        <p className="text-neutral-600 dark:text-white/60">Réglages → Confidentialité → Bloquer tous les cookies / Supprimer les données de sites.</p>
                    </div>
                    <div className="rounded-2xl border border-[#1B4654]/20 bg-[#1B4654]/5 dark:bg-[#1B4654]/10 p-3.5 space-y-1 shadow-2xs">
                        <strong className="text-[#1B4654] dark:text-[#5EC2D7] block font-semibold">Microsoft Edge</strong>
                        <p className="text-neutral-600 dark:text-white/60">Paramètres → Cookies et autorisations de site → Gérer et supprimer les cookies.</p>
                    </div>
                </div>
            </LegalArticle>
        </LegalLayout>
    );
}
