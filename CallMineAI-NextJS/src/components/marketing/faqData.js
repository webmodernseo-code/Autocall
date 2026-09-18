'use client';

// Shared FAQ content — powers the home preview, the FAQ page, and FAQPage schema.
export const FAQ_GROUPS = [
    {
        group: 'Produit & Fonctionnalités',
        items: [
            { q: 'Qu\'est-ce que CallMindAI ?', a: 'Une plateforme complète d\'appels vocaux par Intelligence Artificielle. Vous configurez des agents vocaux IA capables de passer des appels sortants, mener des conversations naturelles, qualifier les prospects (Chaud / Tiède / Froid) et transmettre les résultats à votre CRM — le tout géré depuis un tableau de bord client moderne, avec une console Super-Admin pour exploiter la solution en SaaS.' },
            { q: 'À qui s\'adresse cette plateforme ?', a: 'Aux équipes commerciales et SDR, aux agences souhaitant revendre des services d\'appels IA à leurs clients en marque blanche, aux recruteurs, aux professionnels de l\'immobilier, aux instituts de sondage, ainsi qu\'à toute entreprise qui qualifie des contacts par téléphone.' },
            { q: 'Dois-je avoir des compétences techniques en IA pour l\'utiliser ?', a: 'Non, aucune compétence technique n\'est requise au quotidien. Vous choisissez une voix, définissez l\'objectif et la personnalité de l\'agent, fournissez votre base de connaissances et lancez votre campagne. L\'agent IA gère la conversation téléphonique de façon fluide et naturelle.' },
            { q: 'Quelles sont les langues prises en charge ?', a: 'La plateforme intègre 29 langues d\'interface et prend en charge les appels multilingues avec reconnaissance et prononciation des accents régionaux pour dialoguer naturellement avec chaque interlocuteur.' },
        ],
    },
    {
        group: 'Installation & Prérequis',
        items: [
            { q: 'Quels sont les prérequis pour héberger la solution ?', a: 'Node.js 20 LTS ou supérieur, npm 10+, et une base de données MySQL 8 ou MariaDB 10.4+. Comme le composeur d\'appels s\'exécute en tâche de fond persistante (worker), vous avez besoin d\'un hébergement autorisant les processus continus (VPS, serveur dédié ou conteneur Docker).' },
            { q: 'Combien de temps prend l\'installation ?', a: 'L\'installation standard s\'effectue en quelques minutes : exécutez npm install, renseignez votre fichier .env, appliquez le schéma de base de données avec Prisma, injectez les données initiales (seed), puis démarrez l\'application et son worker.' },
            { q: 'La solution est-elle 100% auto-hébergée ?', a: 'Oui. Vous possédez et hébergez l\'intégralité du code et de vos données sur votre propre infrastructure. Aucun abonnement tiers obligatoire n\'est imposé : vous connectez directement vos propres comptes de téléphonie et d\'IA.' },
        ],
    },
    {
        group: 'Intégrations & Moteurs IA',
        items: [
            { q: 'Quels fournisseurs de téléphonie et d\'IA sont compatibles ?', a: 'La téléphonie via Twilio et Plivo (ou vos propres trunks SIP), la synthèse vocale ultra-réaliste via ElevenLabs et OpenAI, et les modèles de langage via OpenAI (GPT-4o, GPT-4o-mini). Chaque agent peut utiliser le moteur de votre choix.' },
            { q: 'Puis-je synchroniser la plateforme avec mon CRM ?', a: 'Oui. Les leads qualifiés et les données d\'appels peuvent être envoyés instantanément vers HubSpot, Salesforce, Pipedrive ou n\'importe quel outil via webhooks ou l\'API REST documentée.' },
            { q: 'La plateforme inclut-elle des automatisations de scénarios ?', a: 'Oui — un constructeur visuel de flux (Flows) vous permet de définir des actions selon l\'issue de l\'appel (ex: si le lead est Chaud → envoyer un SMS/WhatsApp, planifier un rendez-vous ou transférer vers un commercial), avec support des formulaires et de Google Sheets.' },
        ],
    },
    {
        group: 'Licence, Mises à jour & Support',
        items: [
            { q: 'Comment fonctionne la licence logicielle ?', a: 'Vous bénéficiez de l\'accès complet au code source non chiffré pour l\'héberger, l\'adapter et le personnaliser selon vos besoins commerciaux.' },
            { q: 'Ai-je accès aux futures mises à jour ?', a: 'Oui. Le projet bénéficie d\'évolutions régulières intégrant de nouvelles fonctionnalités, des optimisations de performances et la compatibilité avec les nouveaux modèles d\'IA.' },
            { q: 'Un support technique est-il assuré ?', a: 'Oui — une assistance est fournie pour vous aider lors de l\'installation et répondre à vos questions techniques. Une documentation détaillée est incluse.' },
            { q: 'Puis-je personnaliser la marque (Marque Blanche) ?', a: 'Totalement. Le nom, le logo, les couleurs, les langues, les devises et les modèles d\'e-mails sont configurables directement depuis le panneau d\'administration.' },
        ],
    },
    {
        group: 'Sécurité & Modèle de Facturation',
        items: [
            { q: 'Comment la sécurité des données est-elle assurée ?', a: 'Chaque compte client bénéficie d\'une isolation stricte de ses données (multi-tenant), les clés d\'API sont chiffrées au repos et un système de permissions par rôles (RBAC) protège les accès sensibles.' },
            { q: 'Comment fonctionne la facturation des clients ?', a: 'Le système comprend une facturation à la consommation de crédits d\'appels, des forfaits d\'abonnement récurrents, plusieurs passerelles de paiement (Stripe, PayPal, Paddle) et l\'émission de factures.' },
            { q: 'La solution est-elle prête pour la production ?', a: 'Oui. L\'application dispose d\'une architecture robuste prête à être déployée avec votre configuration de production, un certificat SSL HTTPS et vos clés API de téléphonie.' },
        ],
    },
];

export const FAQ_FLAT = FAQ_GROUPS.flatMap((g) => g.items);
