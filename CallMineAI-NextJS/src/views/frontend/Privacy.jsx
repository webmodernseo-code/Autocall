'use client';

import LegalDoc from '@/components/marketing/LegalDoc';

const SECTIONS = [
    { h: 'Introduction', body: [
        'La présente Politique de Confidentialité décrit la manière dont la plateforme (« le Service », « nous ») traite, utilise et protège les données lors de votre utilisation. Dans le cadre d\'une solution auto-hébergée, l\'administrateur ou l\'entreprise qui déploie la plateforme agit en qualité de responsable du traitement des données pour ses utilisateurs et contacts.',
    ] },
    { h: 'Données collectées', body: [
        'Les catégories de données suivantes peuvent être traitées :',
        { list: [
            'Données de compte — nom, adresse e-mail, mot de passe haché, rôle et organisation/espace client rattaché.',
            'Données de contacts et prospects — numéros de téléphone, identités, e-mails et champs personnalisés importés ou recueillis par les agents lors des appels.',
            'Données d\'appels — enregistrements audio, retranscriptions textuelles, synthèses d\'appels, analyse de sentiment, score de qualification et durée.',
            'Paramètres & configurations — agents configurés, campagnes, flux automatisés, identifiants API tiers (stockés de manière chiffrée).',
            'Données de facturation — abonnements, solde de crédits et historiques de transactions.',
            'Données techniques — adresse IP, type de navigateur et journaux d\'audit des actions sensibles.',
        ] },
    ] },
    { h: 'Finalités des traitements', body: [
        'Ces informations sont exploitées pour :',
        { list: [
            'Émettre, recevoir et traiter les appels téléphoniques, générer les transcriptions et qualifier les leads.',
            'Authentifier les utilisateurs et assurer le cloisonnement strict des données entre organisations (multi-tenant).',
            'Gérer les abonnements, les recharges de crédits et la facturation.',
            'Fournir des rapports analytiques et un suivi d\'audit aux administrateurs.',
            'Garantir la sécurité du système, prévenir les abus et respecter les obligations légales.',
        ] },
    ] },
    { h: 'Cookies et témoins de connexion', body: [
        'Le Service utilise uniquement des cookies strictement nécessaires à l\'authentification de session, à la sécurité CSRF et à la mémorisation de vos préférences (langue, thème clair/sombre, devise). Aucun traceur publicitaire tiers n\'est actif par défaut.',
    ] },
    { h: 'Services et sous-traitants tiers', body: [
        'Pour assurer ses fonctions vocales, la plateforme s\'interface avec les services tiers que vous configurez avec vos propres clés API (téléphonie Twilio/Plivo, synthèse vocale ElevenLabs, modèles OpenAI, passerelles Stripe/PayPal). Les données transmises à ces prestataires sont régies par leurs politiques de confidentialité respectives.',
    ] },
    { h: 'Sécurité et protection des données', body: [
        'Le Service applique des standards de sécurité exigeants : chiffrement au repos des clés d\'API et secrets, hachage sécurisé des mots de passe (bcrypt), gestion granulaire des rôles (RBAC) et traçabilité par journal d\'audit.',
    ] },
    { h: 'Conservation des données', body: [
        'Les enregistrements d\'appels, transcriptions et coordonnées de contacts sont conservés jusqu\'à leur suppression par l\'administrateur du compte ou selon les règles d\'archivage configurées.',
    ] },
    { h: 'Vos droits (RGPD)', body: [
        'Conformément aux réglementations sur la protection des données personnelles (notamment le RGPD), les personnes concernées disposent d\'un droit d\'accès, de rectification, d\'exportation et de suppression de leurs données.',
    ] },
    { h: 'Contact', body: [
        'Pour toute question relative à la protection de vos données, vous pouvez nous écrire à l\'adresse contact@callmindai.com.',
    ] },
];

export default function Privacy() {
    return (
        <LegalDoc
            eyebrow="Cadre Légal"
            title="Politique de Confidentialité"
            updated="2026"
            metaTitle="Politique de Confidentialité — CallMindAI"
            description="Informations relatives à la collecte, l'utilisation, la sécurité et la conservation des données sur la plateforme d'appels IA."
            intro="La confidentialité et la sécurité de vos données sont au cœur de nos priorités. Découvrez nos engagements en matière de protection des données."
            sections={SECTIONS}
        />
    );
}
