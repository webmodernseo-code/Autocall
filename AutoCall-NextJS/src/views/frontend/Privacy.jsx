'use client';

import React from 'react';
import LegalLayout, { LegalArticle, LegalBox } from '@/components/legal/LegalLayout';
import { Head } from '@/lib/page-router';
import { ShieldCheck, Database, Lock, UserCheck, HardDrive, Cpu, AlertCircle } from 'lucide-react';

const TABLE_OF_CONTENTS = [
    { id: 'art-1', title: 'Rôles Juridiques & Cadre RGPD' },
    { id: 'art-2', title: 'Données Collectées & Flux Audio' },
    { id: 'art-3', title: 'Absence de Traitement Biométrique (Art. 9)' },
    { id: 'art-4', title: 'Finalités & Bases Légales' },
    { id: 'art-5', title: 'Sous-traitants & Non-entraînement des LLM' },
    { id: 'art-6', title: 'Hébergement & Transferts Hors UE' },
    { id: 'art-7', title: 'Durées de Conservation & Purge Audio' },
    { id: 'art-8', title: 'Mesures de Sécurité & Chiffrement' },
    { id: 'art-9', title: 'Droits des Personnes Concernées' },
    { id: 'art-10', title: 'Violations de Données Personnelles' },
    { id: 'art-11', title: 'Contact DPO & Réclamation CNIL' },
];

export default function Privacy() {
    return (
        <LegalLayout
            eyebrow="Protection des Données Personnelles"
            title="Politique de Confidentialité"
            titleSerif="& Traitement des Données"
            subtitle="Modalités de traitement, de sécurisation et de confidentialité des données vocales, transcriptions et métadonnées d'appels sur la plateforme AutoCall."
            lastUpdated="1er Mars 2026"
            effectiveDate="Entrée en vigueur immédiate"
            accentColor="blue"
            penalNotice={{
                title: "DPA Intégré : Statut de Sous-traitant au sens de l'Article 28 du RGPD",
                description: "Pour l'ensemble des données vocales et transcriptions d'appels générées par les clients de nos utilisateurs, le Client agit en qualité de Responsable de Traitement et AutoCall en qualité exclusive de Sous-traitant (Data Processor). La présente politique vaut Accord de Traitement des Données (DPA) opposable entre les parties."
            }}
            tableOfContents={TABLE_OF_CONTENTS}
        >
            <Head title="Politique de Confidentialité (RGPD) · AutoCall" />

            {/* ART 1 */}
            <LegalArticle id="art-1" number="ARTICLE 01" title="Rôles Juridiques & Cadre RGPD" accentColor="blue">
                <p>
                    La société <strong>AutoCall SAS</strong> s’engage à protéger la vie privée des utilisateurs et des tiers conformément au <strong>Règlement Général sur la Protection des Données (RGPD 2016/679)</strong> et à la <strong>Loi Informatique et Libertés du 6 janvier 1978 modifiée</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-2xl border border-blue-500/25 bg-blue-50/50 dark:bg-blue-500/5 p-4 space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                            <strong className="text-blue-900 dark:text-blue-200 block font-mono text-xs">1. Données du Compte Client</strong>
                        </div>
                        <p className="text-neutral-600 dark:text-white/70">
                            Pour les données administratives (identité du client, facturation, adresses e-mail des collaborateurs, logs de connexion au dashboard), <strong>AutoCall agit en qualité de Responsable de Traitement</strong>.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-blue-500/25 bg-blue-50/50 dark:bg-blue-500/5 p-4 space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                            <strong className="text-blue-900 dark:text-blue-200 block font-mono text-xs">2. Données des Appels Téléphoniques</strong>
                        </div>
                        <p className="text-neutral-600 dark:text-white/70">
                            Pour les flux audio, enregistrements, numéros des correspondants appelants et retranscriptions de conversations, <strong>le Client est le seul Responsable de Traitement</strong> et <strong>AutoCall agit en qualité de Sous-traitant</strong> (Art. 28 RGPD).
                        </p>
                    </div>
                </div>
            </LegalArticle>

            {/* ART 2 */}
            <LegalArticle id="art-2" number="ARTICLE 02" title="Données Collectées & Flux Audio" accentColor="blue">
                <p>
                    Les catégories de données suivantes font l’objet de traitements techniques stricts et cloisonnés :
                </p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-white/75 text-xs sm:text-sm">
                    <li><strong className="text-neutral-900 dark:text-white">Métadonnées d&apos;appels télécoms :</strong> Numéro de l’appelant (CLI), numéro appelé (DID), horodatage de début et fin de communication, durée totale, statut d’acheminement (décroché, occupé, messagerie vocale).</li>
                    <li><strong className="text-neutral-900 dark:text-white">Flux audio de la voix :</strong> Échantillons sonores captés en temps réel pour permettre le traitement par les briques de reconnaissance vocale et de synthèse vocale.</li>
                    <li><strong className="text-neutral-900 dark:text-white">Retranscriptions textuelles :</strong> Conversion textuelle brute (Speech-to-Text) et synthèses des échanges générées par l’agent conversationnel.</li>
                    <li><strong className="text-neutral-900 dark:text-white">Données de qualification &amp; rendez-vous :</strong> Noms, motifs d’appels, adresses e-mails ou créneaux horaires dictés au cours de l’appel et transférés dans le CRM ou l’agenda du Client.</li>
                </ul>
            </LegalArticle>

            {/* ART 3 */}
            <LegalArticle id="art-3" number="ARTICLE 03" title="Absence de Traitement Biométrique (Art. 9 du RGPD)" accentColor="blue">
                <LegalBox type="warning" title="Précision Juridique Capitale : Données Non-Biométriques" accentColor="blue">
                    <p>
                        Aux termes de l’Article 4 point 14 du RGPD, les « données biométriques » désignent les données personnelles résultant d&apos;un traitement technique spécifique relatives aux caractéristiques physiques permettant d&apos;identifier de manière univoque une personne physique (comme une empreinte vocale d&apos;identification).
                    </p>
                    <p className="font-semibold text-blue-900 dark:text-blue-200">
                        Les technologies déployées par AutoCall ne réalisent AUCUN profilage ni stockage d&apos;empreinte biométrique vocale visant à authentifier ou identifier univoquement un individu.
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-white/70">
                        Le flux audio est uniquement traité comme signal acoustique instantané pour la conversion phonétique en texte et la génération d&apos;une réponse contextuelle.
                    </p>
                </LegalBox>
            </LegalArticle>

            {/* ART 4 */}
            <LegalArticle id="art-4" number="ARTICLE 04" title="Finalités & Bases Légales des Traitements" accentColor="blue">
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] text-xs shadow-2xs">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-blue-500/20 bg-blue-50/70 dark:bg-blue-500/10 text-blue-900 dark:text-blue-200 font-mono">
                                <th className="p-3">Finalité du Traitement</th>
                                <th className="p-3">Base Légale RGPD</th>
                                <th className="p-3">Destinataires</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-white/[0.05] text-neutral-700 dark:text-white/70">
                            <tr>
                                <td className="p-3 font-medium text-neutral-900 dark:text-white">Prise d&apos;appel, qualification et réservation</td>
                                <td className="p-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">Exécution du contrat (Art. 6-1-b)</span></td>
                                <td className="p-3">Espace sécurisé du Client</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-neutral-900 dark:text-white">Enregistrement et transcription des échanges</td>
                                <td className="p-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">Consentement / Intérêt légitime (Art. 6-1-a/f)</span></td>
                                <td className="p-3">Administrateurs habilités du Client</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-neutral-900 dark:text-white">Facturation des minutes et sécurisation paiement</td>
                                <td className="p-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-white/10 dark:text-neutral-300">Obligation légale &amp; contractuelle (Art. 6-1-c)</span></td>
                                <td className="p-3">Passerelle bancaire Stripe</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-neutral-900 dark:text-white">Conservation des logs d&apos;acheminement télécoms</td>
                                <td className="p-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-white/10 dark:text-neutral-300">Obligation légale française (CPCE Art. L. 34-1)</span></td>
                                <td className="p-3">Autorités judiciaires sur réquisition</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </LegalArticle>

            {/* ART 5 */}
            <LegalArticle id="art-5" number="ARTICLE 05" title="Sous-traitants & Non-entraînement des Modèles LLM Publics" accentColor="blue">
                <p>
                    Pour délivrer la performance en temps réel à latence ultra-faible, AutoCall s&apos;appuie sur des partenaires technologiques de pointe rigoureusement sélectionnés et soumis à des accords de confidentialité stricts :
                </p>
                <div className="space-y-2 text-xs">
                    <div className="rounded-2xl border border-blue-500/30 bg-blue-50/60 dark:bg-blue-500/10 p-4 shadow-2xs">
                        <strong className="text-blue-900 dark:text-blue-200 block font-mono">Engagement Solennel : Non-Entraînement des LLM</strong>
                        <p className="text-neutral-700 dark:text-white/70 mt-1 leading-relaxed">
                            AutoCall utilise exclusivement des API d&apos;entreprise (« Enterprise API ») garantissant que <strong>les données vocales, transcriptions et prompts ne sont JAMAIS utilisés pour entraîner, affiner ou améliorer les modèles d&apos;intelligence artificielle publics tiers</strong> (notamment OpenAI, Anthropic ou Deepgram). Vos données professionnelles restent votre propriété exclusive.
                        </p>
                    </div>
                </div>
            </LegalArticle>

            {/* ART 6 */}
            <LegalArticle id="art-6" number="ARTICLE 06" title="Hébergement des Données & Souveraineté" accentColor="blue">
                <p>
                    L’infrastructure principale de stockage des bases de données et des serveurs d’application est hébergée sur le territoire de l’<strong>Union Européenne (Région France / Allemagne)</strong> au sein de centres de données certifiés <strong>ISO/IEC 27001, SOC 2 Type II et HDS</strong>.
                </p>
                <p>
                    Dans les cas où des flux audio transitent temporairement par des réseaux internationaux pour des briques d&apos;optimisation télécoms, ces transferts sont encadrés par les <strong>Clauses Contractuelles Types (CCT)</strong> adoptées par la Commission Européenne et par le Data Privacy Framework UE-USA.
                </p>
            </LegalArticle>

            {/* ART 7 */}
            <LegalArticle id="art-7" number="ARTICLE 07" title="Durées de Conservation & Purge Audio Paramétrable" accentColor="blue">
                <p>
                    Afin de respecter le principe de minimisation des données (Article 5-1-c du RGPD), AutoCall met à disposition du Client un outil de gouvernance et de rétention autonome :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-white/75 text-xs sm:text-sm">
                    <li><strong className="text-neutral-900 dark:text-white">Enregistrements audio (.mp3 / .wav) :</strong> Conservés par défaut pendant trente (30) jours calendaires, durée paramétrable de 0 jour (suppression immédiate après transcription) jusqu’à 90 jours maximum.</li>
                    <li><strong className="text-neutral-900 dark:text-white">Retranscriptions écrites &amp; résumés :</strong> Conservés pendant la durée de vie du compte actif du Client, ou supprimés sur demande explicite.</li>
                    <li><strong className="text-neutral-900 dark:text-white">Données de facturation comptable :</strong> Conservées dix (10) ans conformément aux obligations du Code de commerce français.</li>
                </ul>
            </LegalArticle>

            {/* ART 8 */}
            <LegalArticle id="art-8" number="ARTICLE 08" title="Mesures de Sécurité & Chiffrement" accentColor="blue">
                <p>
                    AutoCall implémente les mesures de sécurité de référence dans l’industrie :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-50/40 dark:bg-blue-500/5 p-4 space-y-2 text-center shadow-2xs">
                        <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                            <Lock className="h-4.5 w-4.5" />
                        </div>
                        <strong className="text-blue-950 dark:text-blue-200 block font-mono">Chiffrement TLS 1.3</strong>
                        <p className="text-neutral-600 dark:text-white/60">Toutes les communications web et flux SIP sont chiffrés de bout en bout en transit.</p>
                    </div>
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-50/40 dark:bg-blue-500/5 p-4 space-y-2 text-center shadow-2xs">
                        <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                            <HardDrive className="h-4.5 w-4.5" />
                        </div>
                        <strong className="text-blue-950 dark:text-blue-200 block font-mono">Chiffrement AES-256</strong>
                        <p className="text-neutral-600 dark:text-white/60">Les données au repos, bases de données et fichiers audio sont chiffrés au repos.</p>
                    </div>
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-50/40 dark:bg-blue-500/5 p-4 space-y-2 text-center shadow-2xs">
                        <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                            <ShieldCheck className="h-4.5 w-4.5" />
                        </div>
                        <strong className="text-blue-950 dark:text-blue-200 block font-mono">Isolation Multi-Tenant</strong>
                        <p className="text-neutral-600 dark:text-white/60">Cloisonnement strict et étanche des environnements entre chaque organisation cliente.</p>
                    </div>
                </div>
            </LegalArticle>

            {/* ART 9 */}
            <LegalArticle id="art-9" number="ARTICLE 09" title="Droits des Personnes Concernées" accentColor="blue">
                <p>
                    Conformément aux Articles 15 à 22 du RGPD, toute personne physique dont les données sont traitées dispose des droits suivants :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-white/75 text-xs sm:text-sm">
                    <li><strong>Droit d&apos;accès et de communication</strong> de l’ensemble des données la concernant.</li>
                    <li><strong>Droit de rectification</strong> des informations inexactes ou incomplètes.</li>
                    <li><strong>Droit à l&apos;effacement (« droit à l&apos;oubli »)</strong> des enregistrements et retranscriptions.</li>
                    <li><strong>Droit à la limitation du traitement</strong> et droit d’opposition légitime.</li>
                    <li><strong>Droit à la portabilité</strong> des données sous format structuré et lisible par machine (.json ou .csv).</li>
                </ul>
                <p className="pt-2 text-xs text-neutral-500 dark:text-white/60">
                    Pour les correspondants ayant échangé avec l’agent vocal d’une entreprise cliente, la demande doit être adressée prioritairement à ladite entreprise (Responsable de Traitement). AutoCall traitera sans délai toute instruction de suppression transmise par ses clients.
                </p>
            </LegalArticle>

            {/* ART 10 */}
            <LegalArticle id="art-10" number="ARTICLE 10" title="Violations de Données Personnelles" accentColor="blue">
                <p>
                    En cas de violation avérée de la sécurité entraînant de manière accidentelle ou illicite la destruction, la perte, l&apos;altération ou la divulgation non autorisée de données personnelles (Art. 33 et 34 du RGPD), AutoCall s&apos;engage à :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-white/75 text-xs sm:text-sm">
                    <li>Notifier le Client sans retard injustifié et au plus tard dans les quarante-huit (48) heures suivant la prise de connaissance de l&apos;incident.</li>
                    <li>Fournir toutes les informations utiles pour permettre au Client d&apos;exécuter sa notification légale auprès de la CNIL dans le délai de 72 heures.</li>
                    <li>Mettre en œuvre immédiatement toutes les mesures correctives raisonnables pour neutraliser l&apos;incident.</li>
                </ul>
            </LegalArticle>

            {/* ART 11 */}
            <LegalArticle id="art-11" number="ARTICLE 11" title="Contact DPO & Réclamation CNIL" accentColor="blue">
                <p>
                    Pour toute question relative à l’application des présentes ou pour exercer vos droits, vous pouvez contacter notre Délégué à la Protection des Données (DPO) :
                </p>
                <div className="rounded-2xl border border-blue-500/25 bg-blue-50/50 dark:bg-blue-500/5 p-4 text-xs space-y-1.5 shadow-2xs">
                    <p>• <strong>DPO AutoCall :</strong> Me. Délégué à la Protection des Données, AutoCall SAS</p>
                    <p>• <strong>Adresse postale :</strong> 128 Rue La Boétie, 75008 Paris, France</p>
                    <p>• <strong>Courrier électronique :</strong> <a href="mailto:dpo@autocall.co" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">dpo@autocall.co</a></p>
                </div>
                <p className="text-xs text-neutral-500 dark:text-white/60 pt-2">
                    Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous disposez de la faculté d’introduire une réclamation auprès de l’autorité de contrôle française : la <strong>Commission Nationale de l’Informatique et des Libertés (CNIL)</strong>, 3 Place de Fontenoy - TSA 80715 - 75334 Paris Cedex 07 (site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">www.cnil.fr</a>).
                </p>
            </LegalArticle>
        </LegalLayout>
    );
}
