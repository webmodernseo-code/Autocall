'use client';

import LegalDoc from '@/components/marketing/LegalDoc';

const SECTIONS = [
    { h: 'Acceptation des conditions', body: [
        'En accédant à la plateforme (« le Service ») ou en l\'utilisant, vous acceptez d\'être lié par les présentes Conditions Générales. Si vous utilisez le Service pour le compte d\'une entreprise ou organisation, vous déclarez disposer de l\'autorité nécessaire pour engager celle-ci. Si vous n\'acceptez pas ces conditions, vous ne devez pas utiliser le Service.',
    ] },
    { h: 'Licence et usage autorisé', body: [
        'Le logiciel est concédé selon les termes de la licence acquise. Sous réserve de cette licence, il vous est accordé le droit d\'installer, exécuter, adapter et personnaliser le Service pour vos projets et produits finaux autorisés.',
        'Sauf autorisation expresse, vous ne pouvez pas revendre, redistribuer ou sous-licencier le code source brut tel quel, ni retirer les mentions de propriété intellectuelle.',
    ] },
    { h: 'Comptes et responsabilités', body: [
        'Vous êtes responsable du maintien de la confidentialité de vos identifiants de compte et de toutes les activités effectuées depuis celui-ci. Vous vous engagez à fournir des informations exactes, à maintenir votre environnement sécurisé et à respecter la législation en vigueur.',
    ] },
    { h: 'Politique d\'utilisation acceptable', body: [
        'Vous vous engagez expressément à ne pas utiliser le Service pour :',
        { list: [
            'Émettre des appels ou envoyer des messages en violation des lois relatives au démarchage téléphonique et au consentement (ex. RGPD, ePrivacy, listes d\'opposition Bloctel/TCPA et équivalents locaux).',
            'Harceler, tromper, escroquer des destinataires ou usurper une identité de manière illicite.',
            'Diffuser des contenus illégaux, diffamatoires ou malveillants.',
            'Tenter de compromettre la sécurité, saturer l\'infrastructure ou accéder à des données non autorisées.',
        ] },
        'Vous demeurez seul responsable du recueil des consentements préalables requis pour joindre vos contacts ainsi que du contenu des conversations menées par vos agents IA.',
    ] },
    { h: 'Propriété intellectuelle', body: [
        'Le Service, comprenant son code source, son design et sa documentation, est protégé par les lois sur la propriété intellectuelle. Vos données d\'entreprise, marques, logos et contenus vous appartiennent exclusivement.',
    ] },
    { h: 'Services tiers et clés API', body: [
        'Le Service s\'interface avec des fournisseurs tiers (téléphonie, voix, intelligence artificielle, paiements et CRM) que vous connectez à l\'aide de vos propres comptes. Votre utilisation de ces services est régie par leurs conditions respectives, et les frais de consommation facturés par ces prestataires relèvent de votre responsabilité.',
    ] },
    { h: 'Paiements et facturation', body: [
        'Lorsque les fonctions de facturation sont activées, les transactions, recharges de crédits et abonnements sont traités par les passerelles de paiement configurées. Les coûts de téléphonie et d\'IA facturés par des tiers sont distincts.',
    ] },
    { h: 'Limitation de responsabilité & Garanties', body: [
        'Le Service est fourni « en l\'état ». Les conversations générées par l\'intelligence artificielle et les scores de qualification sont fournis à titre d\'assistance automatisée ; il vous appartient de superviser l\'exactitude et la conformité des échanges.',
    ] },
    { h: 'Contact', body: [
        'Pour toute question concernant les présentes conditions, vous pouvez contacter notre équipe à l\'adresse contact@callmindai.com.',
    ] },
];

export default function Terms() {
    return (
        <LegalDoc
            eyebrow="Cadre Légal"
            title="Conditions Générales d'Utilisation"
            updated="2026"
            metaTitle="Conditions Générales — CallMindAI"
            description="Conditions régissant l'utilisation de la plateforme d'appels IA : licence, règles d'usage, propriété intellectuelle, responsabilité et conformité."
            intro="Veuillez lire attentivement les présentes conditions régissant l'accès et l'utilisation de la plateforme."
            sections={SECTIONS}
        />
    );
}
