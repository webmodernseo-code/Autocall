'use client';

import React from 'react';
import LegalLayout, { LegalArticle, LegalBox } from '@/components/legal/LegalLayout';
import { Head } from '@/lib/page-router';
import { Building2, Server, ShieldCheck, Mail, Phone, AlertTriangle } from 'lucide-react';

const TABLE_OF_CONTENTS = [
    { id: 'art-1', title: 'Éditeur de la Plateforme (LCEN Art. 6)' },
    { id: 'art-2', title: 'Directeur de la Publication' },
    { id: 'art-3', title: 'Hébergeur du Site & Infrastructure' },
    { id: 'art-4', title: 'Déclaration Télécoms & Opérateurs' },
    { id: 'art-5', title: 'Propriété Intellectuelle & Marques' },
    { id: 'art-6', title: 'Procédure de Signalement d\'Abus (Abuse)' },
    { id: 'art-7', title: 'Sécurité & Intégrité des Systèmes' },
];

export default function MentionsLegales() {
    return (
        <LegalLayout
            eyebrow="Informations Réglementaires"
            title="Mentions Légales"
            titleSerif="& Cadre Officiel"
            subtitle="Identification officielle de l'éditeur, des prestataires d'hébergement et des coordonnées réglementaires du service AutoCall."
            lastUpdated="1er Mars 2026"
            effectiveDate="Entrée en vigueur immédiate"
            penalNotice={{
                title: "Obligation d'Information Publique Légale",
                description: "Conformément à l'article 6 de la Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), les éléments d'identification de l'éditeur et de l'hébergeur sont mis à la disposition permanente du public ci-dessous."
            }}
            tableOfContents={TABLE_OF_CONTENTS}
        >
            <Head title="Mentions Légales · AutoCall" />

            {/* ART 1 */}
            <LegalArticle id="art-1" number="ARTICLE 01" title="Éditeur de la Plateforme (LCEN Art. 6-I-1)">
                <p>
                    Le site internet <strong>autocall.co</strong> et la plateforme applicative associée sont édités et exploités par :
                </p>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-xs sm:text-sm space-y-2">
                    <p className="text-base font-bold text-white flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-white/80" />
                        <span>AutoCall SAS</span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/70 pt-2 border-t border-white/[0.06]">
                        <p>• <strong>Forme sociale :</strong> Société par Actions Simplifiée (SAS)</p>
                        <p>• <strong>Capital social :</strong> 10 000,00 €</p>
                        <p>• <strong>Siège social :</strong> 128 Rue La Boétie, 75008 Paris, France</p>
                        <p>• <strong>RCS :</strong> Paris B 921 458 712</p>
                        <p>• <strong>Numéro SIREN :</strong> 921 458 712</p>
                        <p>• <strong>Numéro SIRET :</strong> 921 458 712 00018</p>
                        <p>• <strong>Code NAF / APE :</strong> 62.01Z (Programmation informatique)</p>
                        <p>• <strong>Numéro de TVA Intracommunautaire :</strong> FR 84 921458712</p>
                    </div>
                    <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-4 text-xs text-white/80">
                        <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-white/70" />
                            <span>Contact général : <a href="mailto:contact@autocall.co" className="text-white hover:underline font-medium">contact@autocall.co</a></span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-white/70" />
                            <span>Standard téléphonique : +33 (0)1 89 71 22 00</span>
                        </span>
                    </div>
                </div>
            </LegalArticle>

            {/* ART 2 */}
            <LegalArticle id="art-2" number="ARTICLE 02" title="Directeur de la Publication">
                <p>
                    Le Directeur de la publication du site et responsable éditorial des contenus est la <strong>Direction Générale de AutoCall SAS</strong>, joignable à l’adresse électronique : <a href="mailto:direction@autocall.co" className="text-white hover:text-white/80 underline font-medium">direction@autocall.co</a>.
                </p>
            </LegalArticle>

            {/* ART 3 */}
            <LegalArticle id="art-3" number="ARTICLE 03" title="Hébergeur du Site & Infrastructure Cloud">
                <p>
                    Les serveurs hébergeant la plateforme applicative et les données des utilisateurs sont assurés par des prestataires d’infrastructure de premier ordre conformes aux exigences européennes :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-1.5">
                        <div className="flex items-center gap-2 font-semibold text-white">
                            <Server className="h-4 w-4 text-white/80" />
                            <span>Hébergement Cloud &amp; Données UE</span>
                        </div>
                        <p className="text-white/70">
                            <strong>Amazon Web Services (AWS) EMEA SARL</strong><br />
                            38 Avenue John F. Kennedy, L-1855 Luxembourg<br />
                            Centre de données : <strong>Région France (Paris - eu-west-3)</strong><br />
                            Site web : <a href="https://aws.amazon.com/fr/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">aws.amazon.com</a>
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-1.5">
                        <div className="flex items-center gap-2 font-semibold text-white">
                            <Server className="h-4 w-4 text-white/80" />
                            <span>Réseau Edge &amp; Distribution CDN</span>
                        </div>
                        <p className="text-white/70">
                            <strong>Vercel Inc.</strong><br />
                            440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
                            Conformité DPF UE-USA &amp; CCT Commission Européenne<br />
                            Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">vercel.com</a>
                        </p>
                    </div>
                </div>
            </LegalArticle>

            {/* ART 4 */}
            <LegalArticle id="art-4" number="ARTICLE 04" title="Téléphonie VoIP & Opérateurs Déclarés ARCEP">
                <p>
                    L’acheminement des flux de téléphonie vocale, l’attribution des numéros de standard et le raccordement au réseau téléphonique commuté public (RTC/SIP) sont opérés par l’intermédiaire d’opérateurs de télécommunications déclarés auprès de l’<strong>Autorité de Régulation des Communications Électroniques, des Postes et de la Distribution de la Presse (ARCEP)</strong>.
                </p>
                <p>
                    AutoCall veille au respect scrupuleux des plans nationaux de numérotation et des obligations d’authentification des appels (décisions ARCEP n° 2022-1583 et mécanismes d&apos;interopérabilité Stir/Shaken).
                </p>
            </LegalArticle>

            {/* ART 5 */}
            <LegalArticle id="art-5" number="ARTICLE 05" title="Propriété Intellectuelle & Droits Réservés">
                <p>
                    L’intégralité de la plateforme AutoCall, comprenant sa marque, son logo, son identité graphique, ses codes sources, ses architectures d’agents vocaux, ses algorithmes de traitement et sa documentation, constitue une œuvre protégée par les dispositions du <strong>Code de la propriété intellectuelle</strong> (droits d&apos;auteur, brevets, dessins et modèles).
                </p>
                <p>
                    Toute reproduction, représentation, décompilation, ingénierie inverse, extraction non autorisée ou exploitation commerciale totale ou partielle de ces éléments, sans accord préalable écrit de AutoCall SAS, est strictement interdite et est passible des sanctions prévues aux articles L. 335-2 et suivants du Code de la propriété intellectuelle (délit de contrefaçon puni de 3 ans d&apos;emprisonnement et 300 000 € d&apos;amende).
                </p>
            </LegalArticle>

            {/* ART 6 */}
            <LegalArticle id="art-6" number="ARTICLE 06" title="Procédure de Signalement d'Abus & Activités Illicites (LCEN Art. 6-I-5)">
                <p>
                    Conformément à l’article 6-I-5 de la loi LCEN n° 2004-575, toute personne constatant l’utilisation des services de AutoCall à des fins illicites (ex. : démarchage abusif non consenti, tentative d’escroquerie, spoofing de numéro, harcèlement téléphonique) est invitée à effectuer un signalement immédiat :
                </p>
                <div className="rounded-xl border border-white/15 bg-white/[0.03] p-4 text-xs space-y-2">
                    <p className="font-semibold text-white">
                        Cellule d&apos;Urgence &amp; Modération Anti-Abus AutoCall
                    </p>
                    <p className="text-white/80">
                        Adresse e-mail prioritaire : <a href="mailto:abuse@autocall.co" className="text-white font-mono underline font-medium">abuse@autocall.co</a>
                    </p>
                    <p className="text-white/60 text-xs">
                        Merci de préciser dans votre notification : la date et l’heure de l’appel, le numéro appelant et le numéro appelé, ainsi qu’une brève description des faits constatés. Les comptes faisant l’objet d’abus avérés sont suspendus sous 2 heures ouvrées.
                    </p>
                </div>
            </LegalArticle>

            {/* ART 7 */}
            <LegalArticle id="art-7" number="ARTICLE 07" title="Sécurité & Intégrité des Systèmes Informatiques">
                <p>
                    Les accès non autorisés, tentatives d’intrusion, altération de bases de données ou entraves au fonctionnement des serveurs de AutoCall sont réprimés par les <strong>articles 323-1 à 323-7 du Code pénal</strong> (atteintes aux systèmes de traitement automatisé de données) punis de peines pouvant aller jusqu&apos;à 5 ans d&apos;emprisonnement et 150 000 € d&apos;amende.
                </p>
            </LegalArticle>
        </LegalLayout>
    );
}
