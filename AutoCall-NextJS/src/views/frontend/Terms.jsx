'use client';

import { Trans } from 'react-i18next';
import React from 'react';
import LegalLayout, { LegalArticle, LegalBox } from '@/components/legal/LegalLayout';
import { Head } from '@/lib/page-router';
import { ShieldAlert, Scale, PhoneCall, AlertOctagon, Check, FileText } from 'lucide-react';

const TABLE_OF_CONTENTS = [
    { id: 'art-1', title: 'Objet et Définitions' },
    { id: 'art-2', title: 'Nature du Service IA & Aléas Techniques' },
    { id: 'art-3', title: 'Enregistrement Téléphonique (Art. 226-1 C. pén.)' },
    { id: 'art-4', title: 'Démarchage Téléphonique & Loi Naegelen' },
    { id: 'art-5', title: 'Interdiction du Spoofing & Règles ARCEP' },
    { id: 'art-6', title: 'Interdiction des Usages Criminels & Vishing' },
    { id: 'art-7', title: 'Gestion des Numéros & Téléphonie VoIP' },
    { id: 'art-8', title: 'Abonnements, Crédits & Tarification' },
    { id: 'art-9', title: 'Renonciation au Droit de Rétractation' },
    { id: 'art-10', title: 'Responsabilités & Plafonnement' },
    { id: 'art-11', title: 'Coopération Judiciaire & Logs Télécoms' },
    { id: 'art-12', title: 'Droit Applicable & Juridiction Compétente' },
];

export default function Terms() {
    return (
        <LegalLayout
            eyebrow="Contrat Cadre & Conditions Générales"
            title="Conditions Générales"
            titleSerif="d'Utilisation et de Vente (CGVU)"
            subtitle="Régissant l'accès, l'exploitation commerciale et les obligations pénales et réglementaires liées à la plateforme d'agents vocaux intelligents AutoCall."
            lastUpdated="1er Mars 2026"
            effectiveDate="Entrée en vigueur immédiate"
            penalNotice={{
                title: "Avertissement Légal & Responsabilité Pénale de l'Utilisateur",
                description: "L'utilisation d'agents vocaux automatisés pour émettre ou recevoir des appels est soumise à des dispositions pénales strictes (notamment les articles 226-1, 226-4-1 et 313-1 du Code pénal, ainsi que la loi Naegelen et les décisions ARCEP). Toute infraction expose l'auteur à des sanctions pénales (peines d'emprisonnement et amendes substantielles), ainsi qu'à la résiliation sans préavis de son accès aux services AutoCall."
            }}
            tableOfContents={TABLE_OF_CONTENTS}
        >
            <Head title="Conditions Générales (CGVU) · AutoCall" />

            {/* ART 1 */}
            <LegalArticle id="art-1" number="ARTICLE 01" title="Objet et Définitions">
                <p>
                    Les présentes Conditions Générales d’Utilisation et de Vente (ci-après les « <strong>CGVU</strong> ») régissent l’ensemble des relations contractuelles entre la société <strong>AutoCall SAS</strong> (ci-après « <strong><Trans i18nKey="app.name" /></strong> » ou « le Prestataire ») et toute personne physique ou morale professionnelle (ci-après le « <strong><Trans i18nKey="admin.client_label" /></strong> » ou l’« <strong>Utilisateur</strong> ») souscrivant aux services logiciels de standard téléphonique automatisé et d'agents conversationnels vocaux basés sur l'intelligence artificielle (le « <strong>Service</strong> »).
                </p>
                <p>
                    La souscription au Service implique l’adhésion sans réserve et le strict respect des présentes dispositions. Le Client garantit disposer du pouvoir légal nécessaire pour contracter au nom et pour le compte de l’entité qu’il représente.
                </p>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs space-y-1.5 font-mono text-white/80">
                    <p>• <strong>Agent Vocal IA :</strong> Système algorithmique autonome combinant reconnaissance vocale (Speech-to-Text), modèle de langage génératif (LLM) et synthèse vocale haute fidélité (Text-to-Speech) pour interagir téléphoniquement avec des interlocuteurs humains.</p>
                    <p>• <strong>Correspondant :</strong> Tout tiers (prospect, client final, patient, usager) entrant en communication vocale avec un Agent Vocal déployé par le Client.</p>
                    <p>• <strong>Ligne VoIP :</strong> Canal télécomsip numérique acheminant les flux audio bidirectionnels.</p>
                </div>
            </LegalArticle>

            {/* ART 2 */}
            <LegalArticle id="art-2" number="ARTICLE 02" title="Nature du Service IA & Obligation de Moyens">
                <p>
                    AutoCall fournit une solution logicielle innovante d'assistance et de secrétariat vocal. Les réponses fournies par les Agents Vocaux sont générées de manière probabiliste par des modèles d'intelligence artificielle à partir des instructions (« prompts »), documents d'entreprise et bases de connaissances configurés sous la direction exclusive du Client.
                </p>
                <p>
                    <strong>AutoCall est soumise à une stricte obligation de moyens.</strong> Eu égard à la nature probabiliste des modèles de langage et aux aléas inhérents aux réseaux de télécommunications publics :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-white/75">
                    <li>AutoCall ne garantit aucunement que l'Agent Vocal ne produira jamais d'erreur factuelle, d'approximation ou d'« hallucination » sémantique.</li>
                    <li>Il incombe au Client de concevoir et superviser ses scénarios d'appels, de vérifier régulièrement les retranscriptions textuelles et de prévoir une redirection vers un opérateur humain en cas d'ambiguïté ou de situation critique.</li>
                    <li>AutoCall ne saurait être tenue pour responsable des décisions commerciales, médicales, juridiques ou financières prises par le Client ou ses Correspondants sur la base des échanges tenus par les agents vocaux.</li>
                </ul>
            </LegalArticle>

            {/* ART 3 */}
            <LegalArticle id="art-3" number="ARTICLE 03" title="Protection Pénale — Enregistrement Téléphonique (Art. 226-1 du Code Pénal)">
                <p>
                    L’attention du Client est expressément attirée sur les dispositions de l’<strong>Article 226-1 du Code pénal français</strong>, qui réprime de :
                </p>
                <LegalBox type="danger" title="Article 226-1 du Code pénal : Sanction de l'enregistrement illicite">
                    <p className="font-semibold text-white">
                        « Est puni d&apos;un an d&apos;emprisonnement et de 45 000 euros d&apos;amende le fait, au moyen d&apos;un procédé quelconque, volontairement de porter atteinte à l&apos;intimité de la vie privée d&apos;autrui en captant, enregistrant ou transmettant, sans le consentement de leur auteur, des paroles prononcées à titre privé ou confidentiel. »
                    </p>
                    <p className="text-xs text-white/70">
                        La jurisprudence assimile tout enregistrement ou retranscription d&apos;une conversation téléphonique sans avertissement préalable de l&apos;interlocuteur à un délit pénal sanctionné sur ce fondement.
                    </p>
                </LegalBox>

                <p>
                    En conséquence, le Client souscrit à l’<strong>engagement contractuel ferme et irrévocable</strong> suivant :
                </p>
                <div className="space-y-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs text-white/80">
                    <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-white shrink-0 mt-0.5" />
                        <span><strong>Obligation d&apos;Annonce Légale Préalable :</strong> Le Client s&apos;engage à maintenir activé, dès les premières secondes de chaque communication, le message d&apos;avertissement vocal obligatoire informant le Correspondant que l&apos;appel est traité par un agent conversationnel et est susceptible d&apos;être enregistré ou transcrit à des fins de traitement et de qualité.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-white shrink-0 mt-0.5" />
                        <span><strong>Dégagement de Responsabilité du Prestataire :</strong> En cas de modification, désactivation, écrasement ou contournement de ce message par le Client ou ses préposés, le Client assume l&apos;entière et exclusive responsabilité pénale et civile de tout enregistrement non consenti, et garantit expressément AutoCall contre toute poursuite, plainte, citation directe ou condamnation.</span>
                    </div>
                </div>
            </LegalArticle>

            {/* ART 4 */}
            <LegalArticle id="art-4" number="ARTICLE 04" title="Démarchage Téléphonique & Respect de la Loi Naegelen">
                <p>
                    Pour toute campagne d’appels sortants (« Outbound »), le Client est tenu au strict respect de la <strong>Loi n° 2020-901 du 24 juillet 2020 (Loi Naegelen)</strong> et du <strong>Décret n° 2022-1313 du 13 octobre 2022</strong> encadrant les jours, plages horaires et fréquences des appels de prospection commerciale en France :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-1">
                        <strong className="text-white block font-semibold">Plages Horaires Légales</strong>
                        <p className="text-white/70">
                            Appels autorisés uniquement du <strong>lundi au vendredi</strong> de <strong>10h00 à 13h00</strong> et de <strong>14h00 à 20h00</strong> (heure de Paris).
                        </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-1">
                        <strong className="text-white block font-semibold">Interdiction Absolue</strong>
                        <p className="text-white/70">
                            Strictement <strong>interdit les samedis, dimanches et jours fériés</strong> légaux sur le territoire français.
                        </p>
                    </div>
                </div>
                <p>
                    Le Client s&apos;engage en outre à <strong>consulter et expurger systématiquement ses fichiers de prospection contre la liste d&apos;opposition au démarchage téléphonique Bloctel</strong> avant toute émission d&apos;appels vers des consommateurs, conformément aux articles L. 223-1 et suivants du Code de la consommation. Le non-respect de ces dispositions expose le contrevenant à des amendes administratives pouvant atteindre 375 000 € par infraction pour une personne morale.
                </p>
            </LegalArticle>

            {/* ART 5 */}
            <LegalArticle id="art-5" number="ARTICLE 05" title="Interdiction du Spoofing Téléphonique & Décisions ARCEP">
                <p>
                    Le « spoofing » téléphonique (usurpation d’identifiant d’appelant ou affichage d’un faux numéro d’appel) constitue une violation grave de la réglementation des télécommunications et du Code pénal.
                </p>
                <LegalBox type="danger" title="Usurpation d'identité téléphonique & Sanctions Pénales">
                    <p>
                        Aux termes de l’<strong>Article 226-4-1 du Code pénal</strong>, « Le fait d&apos;usurper l&apos;identité d&apos;un tiers ou de faire usage d&apos;une ou plusieurs données de toute nature permettant de l&apos;identifier en vue de troubler sa tranquillité ou celle d&apos;autrui, ou de porter atteinte à son honneur ou à sa considération, est puni d&apos;un an d&apos;emprisonnement et de 15 000 € d&apos;amende ».
                    </p>
                    <p className="text-xs text-white/70">
                        L’utilisation du Service pour afficher un numéro tiers sans autorisation légale certifiée est formellement prohibée et fait l’objet d’un blocage technique automatique via les mécanismes Stir/Shaken et MAN d’authentification de l’ARCEP.
                    </p>
                </LegalBox>
                <ul className="list-disc pl-5 space-y-1 text-white/75 text-xs sm:text-sm">
                    <li>Le Client garantit qu’il est légalement titulaire ou cessionnaire exclusif de tout numéro utilisé comme identifiant d’appelant (« Caller ID »).</li>
                    <li>Il est strictement interdit d’afficher un numéro réservé aux services d’urgence (15, 17, 18, 112), aux services bancaires, aux juridictions ou aux administrations publiques.</li>
                </ul>
            </LegalArticle>

            {/* ART 6 */}
            <LegalArticle id="art-6" number="ARTICLE 06" title="Interdiction des Usages Criminels & Hameçonnage Vocal (Vishing)">
                <p>
                    AutoCall applique une politique de <strong>tolérance zéro</strong> vis-à-vis de tout usage illégal, frauduleux ou malveillant. Il est rigoureusement interdit d’utiliser les agents vocaux pour :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3 space-y-1">
                        <strong className="text-red-300">Escroquerie &amp; Vishing (Art. 313-1 C. pén.)</strong>
                        <p className="text-white/70">Collecte illicite de coordonnées bancaires, codes OTP, mots de passe ou usurpation de conseillers bancaires.</p>
                    </div>
                    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3 space-y-1">
                        <strong className="text-red-300">Harcèlement Téléphonique (Art. 222-16 C. pén.)</strong>
                        <p className="text-white/70">Appels répétés malveillants visant à saturer une ligne ou troubler la tranquillité d&apos;une personne.</p>
                    </div>
                    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3 space-y-1">
                        <strong className="text-red-300">Extorsion &amp; Menaces</strong>
                        <p className="text-white/70">Chantage, intimidation ou menaces proférées envers des correspondants humains.</p>
                    </div>
                    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3 space-y-1">
                        <strong className="text-red-300">Démarchage Énergie &amp; Rénovation</strong>
                        <p className="text-white/70">Toute prospection interdite par la loi dans le secteur de la rénovation énergétique (C. conso. L. 223-1).</p>
                    </div>
                </div>
                <p className="pt-2">
                    En cas de suspicion d&apos;infraction, AutoCall se réserve le droit de <strong>suspendre immédiatement et sans préavis</strong> le compte concerné, de résilier l&apos;abonnement sans indemnité ni remboursement des crédits restants, et d&apos;effectuer un signalement immédiat auprès du Procureur de la République.
                </p>
            </LegalArticle>

            {/* ART 7 */}
            <LegalArticle id="art-7" number="ARTICLE 07" title="Gestion des Numéros & Téléphonie VoIP">
                <p>
                    Les numéros téléphoniques virtuels (SDA) mis à disposition dans le cadre de la plateforme sont attribués sous réserve de conformité aux plans de numérotation de l’ARCEP. Le Client s&apos;engage à fournir tous les justificatifs d’identité et de domiciliation requis (connaissance client / KYC télécoms).
                </p>
                <p>
                    Les flux audio transitent via des opérateurs de télécommunications partenaires agréés ARCEP. AutoCall ne garantit pas l&apos;acheminement des appels vers les services d&apos;urgence (15, 17, 18, 112) ; le Service est un outil de secrétariat professionnel et <strong>ne constitue pas un service téléphonique universel de secours</strong>.
                </p>
            </LegalArticle>

            {/* ART 8 */}
            <LegalArticle id="art-8" number="ARTICLE 08" title="Abonnements, Crédits de Minutes & Tarification">
                <p>
                    L’accès à AutoCall est proposé sous forme d’abonnements forfaitaires périodiques (mensuels ou annuels) complétés le cas échéant par des packs de minutes de communication vocale.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-white/75 text-xs sm:text-sm">
                    <li><strong>Décompte à la seconde :</strong> Les communications sont décomptées à la seconde dès le décroché de l’appel par l’agent ou le correspondant.</li>
                    <li><strong>Reconduction tacite :</strong> Sauf résiliation notifiée avant le terme de la période en cours depuis l’espace client, l’abonnement est tacitement reconduit pour une durée équivalente.</li>
                    <li><strong>Paiement sécurisé :</strong> Les règlements sont effectués par carte bancaire ou prélèvement SEPA via les prestataires certifiés PCI-DSS (Stripe). Tout défaut de paiement entraîne la suspension immédiate du routage des appels.</li>
                </ul>
            </LegalArticle>

            {/* ART 9 */}
            <LegalArticle id="art-9" number="ARTICLE 09" title="Renonciation Expresse au Droit de Rétractation">
                <p>
                    Conformément aux dispositions de l’<strong>Article L. 221-28 du Code de la consommation</strong>, le droit de rétractation ne peut être exercé pour les contrats de fourniture d&apos;un contenu numérique sans support matériel dont l&apos;exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.
                </p>
                <LegalBox type="warning" title="Fourniture de Service Numérique Professionnel B2B">
                    <p>
                        Le Service s’adressant exclusivement aux professionnels et son exécution débutant immédiatement dès la validation du compte et la provision des lignes VoIP et modèles d&apos;IA, <strong>le Client renonce expressément à tout droit de rétractation</strong>. Les montants engagés et les crédits de minutes alloués ne font l’objet d’aucun remboursement au prorata temporis.
                    </p>
                </LegalBox>
            </LegalArticle>

            {/* ART 10 */}
            <LegalArticle id="art-10" number="ARTICLE 10" title="Responsabilités & Plafonnement des Dommages">
                <p>
                    Dans toute la mesure permise par le droit applicable, la responsabilité totale cumulée de AutoCall au titre de tout dommage direct résultant de l’exécution ou de l’inexécution des présentes est <strong>strictement plafonnée au montant total effectivement payé par le Client au cours des douze (12) derniers mois</strong> précédant le fait générateur.
                </p>
                <p>
                    AutoCall ne saurait en aucun cas être tenue responsable des préjudices indirects, tels que perte de chiffre d&apos;affaires, perte de clientèle, atteinte à l&apos;image de marque, perte de données, ou interruption d&apos;activité consécutive à une panne des opérateurs télécoms sous-jacents, d&apos;un hébergeur cloud ou des fournisseurs de modèles de fondation IA.
                </p>
            </LegalArticle>

            {/* ART 11 */}
            <LegalArticle id="art-11" number="ARTICLE 11" title="Coopération Judiciaire & Conservation des Logs Télécoms">
                <p>
                    En application des obligations légales applicables aux prestataires techniques et opérateurs de communications électroniques (notamment l’article L. 34-1 du Code des postes et des communications électroniques et l’article 60-1 du Code de procédure pénale) :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-white/75 text-xs sm:text-sm">
                    <li>AutoCall conserve l’historique des métadonnées de connexion, horodatages, adresses IP sources, identifiants d’appels et numéros composés pendant la durée légale requise (1 an).</li>
                    <li>Sur réquisition des autorités judiciaires, policières, de la DGCCRF ou de l’ARCEP, AutoCall est tenue de transmettre sans délai l’ensemble des éléments d’identification et journaux d’audit relatifs au compte et aux campagnes incriminées.</li>
                </ul>
            </LegalArticle>

            {/* ART 12 */}
            <LegalArticle id="art-12" number="ARTICLE 12" title="Droit Applicable & Attribution de Juridiction">
                <p>
                    Les présentes CGVU sont régies et interprétées conformément au <strong>droit français</strong>, à l’exclusion de toute règle de conflit de lois.
                </p>
                <p>
                    En cas de litige relatif à la validité, l’interprétation ou l’exécution des présentes, et à défaut de résolution amiable dans un délai de trente (30) jours suivant notification écrite, compétence expresse et exclusive est attribuée aux <strong>tribunaux compétents du ressort de la Cour d’Appel de Paris</strong>, nonobstant pluralité de défendeurs ou appel en garantie.
                </p>
            </LegalArticle>
        </LegalLayout>
    );
}
