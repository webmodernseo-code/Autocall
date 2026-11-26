export type LegalDocumentStatus = "Brouillon" | "Publié";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface LegalDocument {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  updatedAt: string;
  version?: string;
  status?: LegalDocumentStatus;
  effectiveDate?: string;
  intro?: string;
  sections: LegalSection[];
}

export function findDocumentPlaceholders(doc: LegalDocument): string[] {
  const matches = new Set<string>();
  const scan = (text?: string) => {
    if (!text) return;
    const found = text.match(/\[[^\]]+\]/g);
    if (found) {
      for (const item of found) matches.add(item);
    }
  };
  scan(doc.updatedAt);
  scan(doc.intro);
  for (const s of doc.sections) {
    scan(s.heading);
    s.paragraphs?.forEach(scan);
    s.bullets?.forEach(scan);
    s.table?.headers.forEach(scan);
    s.table?.rows.forEach((row) => row.forEach(scan));
  }
  return Array.from(matches);
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: "legal-notice",
    title: "Mentions légales",
    shortTitle: "Mentions légales",
    category: "Informations légales",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Éditeur du site",
        paragraphs: [
          "Le site getautocall.fr et la plateforme AutoCall sont édités par :",
        ],
        bullets: [
          "Dénomination sociale : [Raison sociale]",
          "Nom commercial : AutoCall",
          "Forme juridique : [Forme juridique]",
          "Capital social : [Montant, si applicable]",
          "Siège social : [Adresse complète]",
          "SIREN : [Numéro]",
          "Immatriculation : [Registre et ville, si applicable]",
          "Numéro de TVA intracommunautaire : [Numéro, si applicable]",
          "Adresse électronique : [Email de contact]",
          "Téléphone : [Numéro de contact]",
        ],
      },
      {
        heading: "2. Directeur de la publication",
        paragraphs: [
          "Le directeur de la publication est [Nom et prénom], en qualité de [Fonction].",
        ],
      },
      {
        heading: "3. Hébergement",
        paragraphs: ["Le site et la plateforme sont hébergés par :"],
        bullets: [
          "Société : [Nom de l’hébergeur]",
          "Adresse : [Adresse complète]",
          "Téléphone : [Téléphone]",
          "Site internet : [URL]",
        ],
      },
      {
        heading: "4. Présentation du service",
        paragraphs: [
          "AutoCall est une plateforme logicielle destinée aux professionnels, permettant notamment de gérer leurs communications, leurs agents d’intelligence artificielle, leurs contacts, leurs campagnes commerciales et leurs rendez-vous.",
        ],
      },
      {
        heading: "5. Propriété intellectuelle",
        paragraphs: [
          "Les éléments constitutifs de la plateforme AutoCall, notamment son identité visuelle, ses interfaces, ses textes et ses logiciels, sont protégés par les dispositions applicables en matière de propriété intellectuelle.",
          "Toute reproduction ou exploitation non autorisée est interdite, sous réserve des droits et exceptions prévus par la loi.",
        ],
      },
      {
        heading: "6. Données personnelles",
        paragraphs: [
          "Les modalités de collecte et de traitement des données personnelles sont détaillées dans notre Politique de confidentialité.",
        ],
      },
      {
        heading: "7. Contact",
        paragraphs: [
          "Pour toute question relative au site ou à son utilisation, veuillez contacter [Email de contact].",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Politique de confidentialité",
    shortTitle: "Confidentialité",
    category: "Données & RGPD",
    updatedAt: "[Date]",
    intro:
      "AutoCall accorde une attention particulière à la protection des données personnelles et au respect de la vie privée. La présente politique décrit les traitements réalisés dans le cadre de l’utilisation de notre site et de nos services.",
    sections: [
      {
        heading: "1. Responsable du traitement",
        paragraphs: [
          "[Raison sociale], exploitant la plateforme AutoCall, dont le siège social est situé à [Adresse], agit en qualité de responsable du traitement pour la gestion de son site, de ses comptes utilisateurs, de sa facturation et de ses propres activités commerciales.",
          "Lorsque AutoCall traite des données pour le compte de ses clients professionnels, AutoCall agit généralement en qualité de sous-traitant, conformément à son Accord de traitement des données.",
          "Contact relatif à la protection des données : [Email RGPD].",
          "Délégué à la protection des données : [Coordonnées, si applicable].",
        ],
      },
      {
        heading: "2. Données collectées",
        paragraphs: [
          "Selon les fonctionnalités utilisées, AutoCall peut traiter les catégories suivantes :",
        ],
        bullets: [
          "Données d’identification et coordonnées professionnelles.",
          "Informations relatives à l’entreprise.",
          "Données de connexion et d’utilisation.",
          "Informations relatives aux abonnements et à la facturation.",
          "Numéros de téléphone et métadonnées des communications.",
          "Enregistrements audio, transcriptions et résumés.",
          "Contacts, prospects et informations CRM.",
          "Rendez-vous et informations d’agenda.",
          "Messages électroniques et communications WhatsApp.",
          "Instructions et configurations des agents IA.",
          "Données obtenues auprès de sources autorisées dans le cadre de la prospection.",
        ],
      },
      {
        heading: "3. Finalités et bases légales",
        paragraphs: [
          "AutoCall traite les données pour les finalités et bases légales suivantes :",
        ],
        table: {
          headers: ["Finalité", "Base légale applicable"],
          rows: [
            [
              "Gestion des comptes et abonnements",
              "Exécution du contrat ou intérêt légitime selon la situation",
            ],
            ["Fourniture des services souscrits", "Exécution du contrat"],
            ["Facturation et comptabilité", "Obligation légale"],
            ["Sécurité et prévention des abus", "Intérêt légitime"],
            [
              "Assistance technique",
              "Exécution du contrat ou intérêt légitime",
            ],
            [
              "Prospection réalisée par AutoCall",
              "Intérêt légitime ou consentement selon le canal et le destinataire",
            ],
            ["Mesure d’audience non exemptée", "Consentement"],
          ],
        },
      },
      {
        heading: "4. Intelligence artificielle",
        paragraphs: [
          "AutoCall utilise des technologies d’intelligence artificielle pour automatiser certaines communications, produire des transcriptions, générer des résumés et assister les utilisateurs.",
          "Utilisation des données pour l’entraînement des modèles : [Préciser les pratiques effectives d’AutoCall et de ses fournisseurs].",
          "Les résultats générés peuvent comporter des erreurs et nécessiter une vérification humaine.",
          "Les traitements automatisés et mécanismes de profilage éventuellement utilisés sont décrits dans notre Politique d’intelligence artificielle.",
        ],
      },
      {
        heading: "5. Destinataires des données",
        paragraphs: [
          "Les données peuvent être communiquées, dans la limite de leurs missions, aux :",
        ],
        bullets: [
          "Collaborateurs habilités.",
          "Fournisseurs d’infrastructure et d’hébergement.",
          "Fournisseurs de téléphonie et d’intelligence artificielle.",
          "Prestataires de paiement.",
          "Services tiers connectés par les utilisateurs.",
          "Autorités compétentes lorsque la loi l’exige.",
        ],
      },
      {
        heading: "6. Transferts internationaux",
        paragraphs: [
          "Les données sont traitées dans les régions suivantes : [Pays et régions effectivement utilisés].",
          "Lorsque des données sont transférées hors de l’Espace économique européen, AutoCall met en œuvre les garanties applicables (décisions d’adéquation ou clauses contractuelles types).",
          "Les personnes concernées peuvent demander des informations sur ces garanties auprès de [Email RGPD].",
        ],
      },
      {
        heading: "7. Conservation des données",
        paragraphs: [
          "Les données sont conservées pendant une durée proportionnée aux finalités poursuivies et aux obligations légales applicables.",
        ],
      },
      {
        heading: "8. Sécurité",
        paragraphs: [
          "AutoCall met en œuvre des mesures techniques et organisationnelles adaptées aux risques présentés par les traitements, décrites dans notre Politique de sécurité.",
        ],
      },
      {
        heading: "9. Droits des personnes",
        paragraphs: [
          "Conformément au RGPD, les personnes concernées disposent des droits suivants :",
        ],
        bullets: [
          "Accès aux données personnelles.",
          "Rectification.",
          "Effacement.",
          "Limitation du traitement.",
          "Opposition.",
          "Portabilité.",
          "Retrait du consentement à tout moment.",
          "Garanties relatives aux décisions exclusivement automatisées (article 22 du RGPD).",
        ],
      },
      {
        heading: "10. Cookies & 11. Modification",
        paragraphs: [
          "Les modalités d’utilisation des traceurs sont détaillées dans notre Politique de cookies.",
          "Toute modification significative de la présente politique fait l’objet d’une information appropriée. Réclamations possibles auprès de la CNIL (www.cnil.fr) ou de l’autorité de protection des données compétente dans les pays d’Afrique concernés ([Préciser les pays d’Afrique et autorités locales compétentes]).",
        ],
      },
    ],
  },
  {
    slug: "terms-of-sale",
    title: "Conditions générales de vente (CGV)",
    shortTitle: "CGV",
    category: "Conditions commerciales",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Objet et champ d’application",
        paragraphs: [
          "Les présentes conditions générales de vente encadrent la souscription et l’utilisation commerciale des services AutoCall, édités par [Raison sociale].",
          "Les services sont destinés aux clients agissant dans le cadre de leur activité professionnelle.",
        ],
      },
      {
        heading: "2. Services proposés",
        paragraphs: [
          "AutoCall fournit un accès à une plateforme logicielle en ligne permettant, selon l’offre souscrite :",
        ],
        bullets: [
          "La gestion des communications téléphoniques.",
          "La création et la configuration d’agents IA.",
          "La transcription et la synthèse des conversations.",
          "La gestion des contacts et prospects.",
          "L’automatisation des communications commerciales.",
          "La prise de rendez-vous.",
          "L’intégration de services tiers.",
          "L’accès à des outils d’analyse et de suivi.",
        ],
      },
      {
        heading: "3. Souscription & 4. Tarifs",
        paragraphs: [
          "Le client sélectionne une offre, vérifie les caractéristiques de sa commande et accepte les présentes conditions avant de confirmer son abonnement.",
          "Les tarifs sont exprimés en euros hors taxes, sauf indication contraire. Le montant total, les taxes et la périodicité sont présentés avant confirmation.",
        ],
      },
      {
        heading: "5. Quotas et consommation",
        paragraphs: [
          "Chaque abonnement peut comprendre un volume de minutes, de crédits ou d’autres ressources. Tout dépassement facturable est soumis aux conditions tarifaires communiquées au client.",
        ],
      },
      {
        heading: "6. Paiement",
        paragraphs: [
          "Moyens de paiement acceptés : [Moyens disponibles]. Délais de paiement : [Délais applicables].",
          "En cas de retard de paiement, des pénalités calculées au taux de [Taux conforme à la réglementation] et une indemnité forfaitaire de 40 euros pour frais de recouvrement sont applicables aux clients professionnels.",
        ],
      },
      {
        heading: "7. Durée, 8. Modification des tarifs & 9. Résiliation",
        paragraphs: [
          "L’abonnement est conclu pour la durée indiquée lors de la souscription. Le client est informé des modifications de tarifs avec un préavis de [Durée].",
          "Le client peut demander la résiliation depuis [Emplacement ou procédure].",
        ],
      },
      {
        heading: "10. Disponibilité & 11. Responsabilité",
        paragraphs: [
          "AutoCall met en œuvre les moyens raisonnables nécessaires au fonctionnement du service. Le client est responsable de la configuration de ses agents et de la licéité des données confiées.",
          "Limitations de responsabilité : [Clause à faire valider juridiquement].",
        ],
      },
      {
        heading: "12. Force majeure, 13. Données, 14. Litiges & 15. Contact",
        paragraphs: [
          "Les présentes conditions sont soumises au droit français. En cas de différend, les parties recherchent une solution amiable avant toute procédure judiciaire.",
          "Contact facturation : [Email facturation].",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Conditions générales d’utilisation (CGU)",
    shortTitle: "CGU",
    category: "Conditions commerciales",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Objet & 2. Accès au service",
        paragraphs: [
          "Les présentes conditions définissent les modalités d’accès et d’utilisation de la plateforme AutoCall.",
          "L’accès est réservé aux personnes habilitées à agir pour leur propre activité professionnelle ou pour le compte de leur entreprise.",
        ],
      },
      {
        heading: "3. Sécurité du compte & 4. Utilisation des fonctionnalités",
        paragraphs: [
          "L’utilisateur doit préserver la confidentialité de ses identifiants et signaler toute utilisation non autorisée.",
          "Il configure ses agents IA, ses campagnes et ses intégrations dans le respect des lois applicables et doit disposer des autorisations nécessaires.",
        ],
      },
      {
        heading: "5. Contenus du client & 6. Intelligence artificielle",
        paragraphs: [
          "Le client conserve les droits dont il dispose sur ses données et contenus transmis à AutoCall.",
          "Les résultats générés par les agents IA peuvent être incomplets ou inexacts. AutoCall ne doit pas être utilisé comme unique moyen de gestion des situations d’urgence.",
        ],
      },
      {
        heading: "7. Services tiers & 8. Utilisations interdites",
        paragraphs: [
          "Certaines fonctionnalités reposent sur des services externes soumis à leurs propres conditions.",
          "L’utilisateur s’engage à respecter la Politique d’utilisation acceptable (absence de fraude, spam, usurpation d’identité ou traitement illicite).",
        ],
      },
      {
        heading: "9. Propriété intellectuelle, 10. Suspension & 11. Fermeture",
        paragraphs: [
          "AutoCall accorde au client un droit d’utilisation du service pendant la durée de son abonnement sans transfert de propriété.",
          "AutoCall peut suspendre le service en cas de menace de sécurité, violation grave ou impayé. Pour toute question : [Email support].",
        ],
      },
    ],
  },
  {
    slug: "dpa",
    title: "Accord de traitement des données personnelles (DPA)",
    shortTitle: "DPA (RGPD)",
    category: "Données & RGPD",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Objet & 2. Parties",
        paragraphs: [
          "Le présent accord complète le contrat de fourniture des services AutoCall conformément à l’article 28 du RGPD.",
          "Le client agit en qualité de responsable du traitement ; AutoCall, édité par [Raison sociale], agit en qualité de sous-traitant pour les données traitées sur instruction du client.",
        ],
      },
      {
        heading: "3. Description & 4. Catégories de données",
        paragraphs: [
          "Les traitements comprennent la collecte, la transmission, le stockage, la transcription, l’analyse, l’exportation et la suppression des données pour fournir les services de communication et d’IA.",
        ],
        bullets: [
          "Identité et coordonnées.",
          "Informations professionnelles, contacts et prospects.",
          "Métadonnées téléphoniques, enregistrements, transcriptions et résumés.",
          "Messages, rendez-vous, données CRM et configurations des agents.",
        ],
      },
      {
        heading: "5. Instructions, 6. Confidentialité & 7. Sécurité",
        paragraphs: [
          "AutoCall traite les données uniquement selon les instructions documentées du client, veille à la confidentialité des personnes habilitées et met en œuvre les mesures de l’article 32 du RGPD.",
        ],
      },
      {
        heading: "8. Sous-traitants ultérieurs & 9. Transferts internationaux",
        paragraphs: [
          "AutoCall informe le client de tout ajout ou remplacement de sous-traitant ultérieur avec un préavis de [Durée]. Tout transfert hors EEE respecte le chapitre V du RGPD.",
        ],
      },
      {
        heading: "10. Assistance, 11. Violations, 12. Audit & 13. Fin du contrat",
        paragraphs: [
          "AutoCall assiste le client pour l’exercice des droits, notifie sans retard injustifié toute violation de données, permet les audits proportionnés et restitue ou supprime les données à l’issue du contrat.",
          "Contact DPA : [Email RGPD].",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Politique de cookies",
    shortTitle: "Cookies",
    category: "Données & RGPD",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Introduction & 2. Définition",
        paragraphs: [
          "Le site getautocall.fr et la plateforme AutoCall peuvent utiliser des cookies et technologies similaires afin d’assurer leur fonctionnement et, selon vos préférences, d’améliorer l’expérience utilisateur.",
        ],
      },
      {
        heading: "3. Catégories de traceurs",
        bullets: [
          "Cookies strictement nécessaires : authentification, sessions, sécurité et choix de confidentialité.",
          "Cookies de préférences : langue et apparence de l’interface.",
          "Cookies de mesure d’audience : statistiques soumises au consentement hors exemption.",
          "Cookies marketing : activés uniquement après consentement.",
        ],
      },
      {
        heading: "4. Liste des cookies",
        table: {
          headers: ["Nom", "Fournisseur", "Finalité", "Durée", "Consentement"],
          rows: [
            [
              "[Nom technique]",
              "[Fournisseur]",
              "[Finalité]",
              "[Durée]",
              "[Oui/Non]",
            ],
          ],
        },
      },
      {
        heading: "5. Gestion des préférences & 7. Contact",
        paragraphs: [
          "Vous pouvez accepter, refuser ou modifier vos choix à tout moment depuis le lien « Gérer mes cookies ». Contact : [Email RGPD].",
        ],
      },
    ],
  },
  {
    slug: "acceptable-use",
    title: "Politique d’utilisation acceptable",
    shortTitle: "Utilisation acceptable",
    category: "Conformité & IA",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Objet & 2. Usages autorisés",
        paragraphs: [
          "Les utilisateurs peuvent utiliser AutoCall pour gérer leurs communications, assister leurs clients, qualifier leurs demandes, organiser leurs rendez-vous et réaliser des campagnes commerciales licites.",
        ],
      },
      {
        heading: "3. Usages interdits",
        paragraphs: ["Il est interdit d’utiliser AutoCall pour :"],
        bullets: [
          "Réaliser des activités frauduleuses, du phishing ou usurper une identité.",
          "Imiter ou cloner une voix sans autorisation appropriée.",
          "Diffuser des messages non sollicités en violation de la réglementation.",
          "Harceler, menacer, manipuler des personnes vulnérables ou discriminer.",
          "Falsifier les identifiants d’appelant ou contourner les restrictions opérateurs.",
          "Se substituer aux services d’urgence.",
        ],
      },
      {
        heading: "4. Responsabilité, 6. Signalement & 7. Mesures",
        paragraphs: [
          "Le client doit disposer des autorisations légales et respecter les demandes d’opposition. Tout abus peut être signalé à [Email de signalement]. Contact contestation : [Email support].",
        ],
      },
    ],
  },
  {
    slug: "ai-policy",
    title: "Politique d’intelligence artificielle",
    shortTitle: "Politique IA",
    category: "Conformité & IA",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Notre approche & 2. Fonctionnalités concernées",
        paragraphs: [
          "AutoCall met l’IA au service de l’accueil vocal, de la compréhension des demandes, de la transcription, des résumés, de la qualification et de la prise de rendez-vous, sous supervision humaine.",
        ],
      },
      {
        heading: "3. Transparence & 4. Voix synthétiques",
        paragraphs: [
          "Les interlocuteurs doivent être informés clairement lorsqu’ils interagissent avec un agent d’intelligence artificielle, au plus tard lors de leur première interaction.",
          "Toute voix reproduisant celle d’une personne identifiable nécessite une autorisation explicite.",
        ],
      },
      {
        heading: "5. Exactitude, 6. Supervision humaine & 7. Décisions automatisées",
        paragraphs: [
          "Les réponses IA doivent être vérifiées lorsqu’elles emportent des conséquences importantes. Le scoring est un outil d’assistance et ne doit pas fonder de décision exclusivement automatisée au sens de l’article 22 du RGPD.",
        ],
      },
      {
        heading: "8. Données, entraînement & 10. Signalement",
        bullets: [
          "Entraînement des modèles par AutoCall : [Pratique effective].",
          "Entraînement par les fournisseurs : [Pratique effective].",
          "Conservation par les fournisseurs : [Durées et conditions].",
          "Signalement d’incident IA : [Email de contact].",
        ],
      },
    ],
  },
  {
    slug: "call-recording",
    title: "Politique d’enregistrement et de transcription des appels",
    shortTitle: "Enregistrement d’appels",
    category: "Conformité & IA",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Objet & 2. Finalités",
        paragraphs: [
          "AutoCall permet de traiter, transcrire, résumer et, lorsque l’option est activée, enregistrer des communications téléphoniques pour assurer le suivi client, la prise de RDV et la qualité de service.",
        ],
      },
      {
        heading: "3. Responsabilité du client & 4. Information des interlocuteurs",
        paragraphs: [
          "Avant tout enregistrement, les interlocuteurs doivent être informés de son existence, de sa finalité et de leurs droits conformément à la réglementation applicable (France/UE et pays d’Afrique ciblés : [Préciser les obligations locales applicables]). Lorsque le consentement est requis, il doit être recueilli au préalable.",
        ],
      },
      {
        heading: "5. Configuration, 6. Accès & 7. Conservation",
        paragraphs: [
          "Les options d’enregistrement et de conservation (30, 90 ou 180 jours) sont configurées par le client. Les accès sont limités aux personnes habilitées.",
        ],
      },
      {
        heading: "8. Informations sensibles & 10. Contact",
        paragraphs: [
          "Les clients doivent éviter la collecte non nécessaire de données sensibles, mots de passe ou données bancaires pendant les appels. Contact : [Email RGPD].",
        ],
      },
    ],
  },
  {
    slug: "outreach-policy",
    title: "Politique de prospection commerciale",
    shortTitle: "Prospection commerciale",
    category: "Conformité & IA",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Objet, 2. Collecte & 3. Importation",
        paragraphs: [
          "Les données intégrées à AutoCall doivent provenir de sources licites. Le client doit pouvoir justifier la provenance des listes importées et les bases légales applicables.",
        ],
      },
      {
        heading: "4. Prospection téléphonique, 5. E-mail & 6. WhatsApp",
        paragraphs: [
          "En France, la prospection téléphonique des consommateurs est soumise, en principe, à leur consentement préalable depuis le 11 août 2026, sous réserve des exceptions légales.",
          "Pour les campagnes menées en Afrique, le client s’engage à respecter les lois locales relatives à la protection des données personnelles, au consentement préalable et aux règles télécoms en vigueur dans chaque pays ciblé ([Préciser les pays d’Afrique couverts et règles locales]).",
          "Les messages électroniques et WhatsApp doivent identifier clairement l’expéditeur et respecter les politiques des plateformes tierces.",
        ],
      },
      {
        heading: "7. Oppositions, 8. Transparence & 10. Signalement",
        paragraphs: [
          "Toute demande de désinscription ou d’opposition doit être prise en compte sans retard injustifié via une liste d’exclusion. Signalement : [Email de signalement].",
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "Politique de sécurité",
    shortTitle: "Sécurité",
    category: "Sécurité",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Approche & 2. Infrastructure",
        bullets: [
          "Fournisseur d’hébergement : [Fournisseur].",
          "Régions d’hébergement : [Pays et régions].",
          "Base de données & téléphonie : [Fournisseur].",
        ],
      },
      {
        heading: "3. Protection des données & 4. Contrôle des accès",
        bullets: [
          "Chiffrement des communications et des données stockées : [Protocoles et mécanismes].",
          "Isolation des données entre clients : [Mesures déployées].",
          "Authentification multifacteur : [Disponibilité effective].",
        ],
      },
      {
        heading: "5. Intégrations, 6. Sécurité applicative & 7. Sauvegardes",
        paragraphs: [
          "Les intégrations OAuth demandent uniquement les permissions nécessaires. Les données font l’objet de sauvegardes régulières selon les objectifs validés.",
        ],
      },
      {
        heading: "8. Incidents & 10. Signalement des vulnérabilités",
        paragraphs: [
          "Toute vulnérabilité présumée peut être signalée de manière responsable à [Email sécurité]. Certifications : [Liste ou absence de certification].",
        ],
      },
    ],
  },
  {
    slug: "data-retention",
    title: "Politique de conservation des données",
    shortTitle: "Conservation des données",
    category: "Données & RGPD",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Principes généraux",
        paragraphs: [
          "AutoCall conserve les données pendant une durée adaptée aux finalités de leur traitement, aux instructions des clients et aux obligations légales applicables.",
          "Les données ne doivent pas être conservées au-delà de la durée nécessaire.",
        ],
      },
      {
        heading: "2. Durées de conservation",
        table: {
          headers: ["Catégorie", "Durée ou critère de conservation"],
          rows: [
            ["Données du compte", "Durée du contrat, puis [Durée justifiée]"],
            ["Enregistrements audio", "[Durée par défaut et options]"],
            ["Transcriptions", "[Durée par défaut et options]"],
            ["Résumés des conversations", "[Durée par défaut et options]"],
            ["Métadonnées des appels", "[Durée justifiée]"],
            ["Contacts et prospects", "Selon les instructions licites du client"],
            ["Campagnes et messages", "[Durée justifiée]"],
            ["Journaux de sécurité", "[Durée justifiée]"],
            [
              "Factures et pièces comptables",
              "10 ans lorsque la réglementation française applicable l’exige",
            ],
            ["Sauvegardes", "[Cycle de conservation]"],
            [
              "Preuves de consentement",
              "Durée nécessaire à la démonstration de conformité",
            ],
            [
              "Listes d’opposition",
              "Durée nécessaire au respect des oppositions",
            ],
          ],
        },
      },
      {
        heading: "3. Paramètres, 4. Suppression & 5. Fermeture du compte",
        paragraphs: [
          "Les données arrivées à expiration sont supprimées ou rendues anonymes selon les procédures techniques applicables. En cas de résiliation, les données traitées en sous-traitance sont restituées ou supprimées conformément au DPA.",
          "Contact : [Email RGPD].",
        ],
      },
    ],
  },
  {
    slug: "subprocessors",
    title: "Liste des sous-traitants et prestataires de traitement",
    shortTitle: "Sous-traitants",
    category: "Données & RGPD",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Introduction",
        paragraphs: [
          "Pour fournir ses services, AutoCall peut faire appel à des prestataires spécialisés dans l’infrastructure, la téléphonie, l’intelligence artificielle et les services associés.",
        ],
      },
      {
        heading: "2. Liste des sous-traitants",
        table: {
          headers: [
            "Entité juridique",
            "Service",
            "Données traitées",
            "Pays",
            "Garanties",
          ],
          rows: [
            ["[Entité juridique]", "Hébergement", "[Données]", "[Pays]", "[Garanties]"],
            ["[Entité juridique]", "Base de données", "[Données]", "[Pays]", "[Garanties]"],
            ["[Entité juridique]", "Téléphonie", "[Données]", "[Pays]", "[Garanties]"],
            ["[Entité juridique]", "Intelligence artificielle", "[Données]", "[Pays]", "[Garanties]"],
            ["[Entité juridique]", "Envoi de messages", "[Données]", "[Pays]", "[Garanties]"],
            ["[Entité juridique]", "Surveillance technique", "[Données]", "[Pays]", "[Garanties]"],
          ],
        },
      },
      {
        heading: "3. Sélection, 5. Modifications & 7. Contact",
        paragraphs: [
          "Les clients sont informés des ajouts et remplacements de sous-traitants selon les modalités prévues dans le DPA. Contact : [Email RGPD].",
        ],
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Politique de résiliation et de remboursement",
    shortTitle: "Résiliation & Remboursement",
    category: "Conditions commerciales",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Objet & 2. Résiliation",
        paragraphs: [
          "Le client peut demander la résiliation de son abonnement depuis les paramètres de son compte (Abonnement) ou en contactant [Email support].",
        ],
      },
      {
        heading: "3. Abonnements mensuels, 4. Annuels & 5. Crédits",
        paragraphs: [
          "Abonnements mensuels : [Conditions validées]. Abonnements annuels : [Conditions validées]. Le traitement des minutes non consommées est précisé dans l’offre souscrite.",
        ],
      },
      {
        heading: "6. Demandes de remboursement & 7. Modalités",
        bullets: [
          "Double facturation ou erreur de prélèvement.",
          "Facturation non conforme à l’offre souscrite.",
          "Inexécution contractuelle ouvrant droit à remboursement.",
          "Délai de traitement : [Délai validé]. Contact : [Email facturation].",
        ],
      },
    ],
  },
  {
    slug: "sla",
    title: "Accord de niveau de service (SLA)",
    shortTitle: "SLA",
    category: "Sécurité",
    updatedAt: "[Date]",
    sections: [
      {
        heading: "1. Objet, 2. Périmètre & 3. Disponibilité",
        paragraphs: [
          "AutoCall s’engage sur un objectif de disponibilité mensuelle de [Pourcentage contractuel validé]. Disponibilité = (Temps total éligible - Temps d’indisponibilité éligible) / Temps total éligible × 100.",
        ],
      },
      {
        heading: "5. Assistance technique",
        table: {
          headers: ["Niveau", "Description", "Délai de première réponse"],
          rows: [
            ["P1 - Critique", "Service indisponible", "[Délai]"],
            ["P2 - Majeur", "Fonctionnalité essentielle dégradée", "[Délai]"],
            ["P3 - Modéré", "Dysfonctionnement non bloquant", "[Délai]"],
            ["P4 - Mineur", "Question ou demande d’assistance", "[Délai]"],
          ],
        },
      },
      {
        heading: "8. Compensation & 10. Contact",
        paragraphs: [
          "Barème de compensation : [Barème validé]. Page de statut : [Adresse de la page de statut]. Contact : [Email support].",
        ],
      },
    ],
  },
];

export function getLegalDocument(slug: string): LegalDocument {
  return (
    LEGAL_DOCUMENTS.find((doc) => doc.slug === slug) ?? LEGAL_DOCUMENTS[0]
  );
}

