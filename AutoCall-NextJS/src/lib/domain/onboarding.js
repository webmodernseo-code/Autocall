import prisma from '../prisma.js';

export const ONBOARDING_STEPS = 5;
export const ONBOARDING_VERSION = 'v1';

export const ONBOARDING_STATUS = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    DISMISSED: 'dismissed',
};

export const ONBOARDING_STEP_DEFINITIONS = [
    { n: 1, key: 'business', title: 'Votre entreprise', subtitle: 'Informations clés et secteur' },
    { n: 2, key: 'mission', title: 'Mission & Objectifs', subtitle: 'Ce que l’agent doit accomplir' },
    { n: 3, key: 'identity', title: 'Identité & Voix', subtitle: 'Personnalité, langue et message d’accueil' },
    { n: 4, key: 'rules', title: 'Horaires & Transfert', subtitle: 'Disponibilité et règles d’orientation' },
    { n: 5, key: 'test', title: 'Premier test', subtitle: 'Vérification et mise en service' },
];

export function onboardingPrompt(input) {
    const mission = {
        inbound: 'répondre aux appels entrants et renseigner les appelants',
        outbound: 'qualifier des prospects lors d’appels sortants',
        both: 'gérer les appels entrants et qualifier des prospects en appel sortant',
        appointments: 'répondre aux appelants et organiser leurs rendez-vous',
    }[input.goal] || 'accueillir et orienter les appelants';

    const transfer = input.transfer_rule === 'always'
        ? 'Propose un transfert vers un conseiller dès que la demande le justifie.'
        : input.transfer_rule === 'requested'
            ? 'Transfère vers un conseiller uniquement si l’appelant le demande.'
            : 'Ne promets jamais un transfert. Prends un message clair lorsqu’une intervention humaine est nécessaire.';

    return [
        `Tu es ${input.agent_name || 'l’assistant AutoCall'}, l’assistant vocal de ${input.business_name || 'notre entreprise'}.`,
        `Ta mission principale est de ${mission}.`,
        input.business_summary ? `Contexte de l’entreprise : ${input.business_summary}` : null,
        input.opening_start && input.opening_end
            ? `Les horaires habituels sont de ${input.opening_start} à ${input.opening_end}, du lundi au vendredi.`
            : null,
        transfer,
        'Parle naturellement, reste concis, reformule les informations importantes et ne fabrique jamais une réponse inconnue.',
    ].filter(Boolean).join('\n\n');
}

export function onboardingMeta(existing, input, completed = false) {
    const base = existing && typeof existing === 'object' && !Array.isArray(existing) ? existing : {};
    return {
        ...base,
        onboarding: {
            ...(base.onboarding || {}),
            sector: input.sector || null,
            goal: input.goal || null,
            business_summary: input.business_summary || null,
            opening_start: input.opening_start || null,
            opening_end: input.opening_end || null,
            transfer_phone: input.transfer_phone || null,
            transfer_rule: input.transfer_rule || 'requested',
            completed_at: completed ? new Date().toISOString() : (base.onboarding?.completed_at || null),
        },
    };
}

/**
 * Récupère ou initialise l'état persistant d'onboarding pour un client donné.
 * Auto-détecte les comptes déjà configurés pour ne jamais forcer un utilisateur existant.
 */
export async function getOrCreateOnboardingState(clientId) {
    if (!clientId) return null;
    const cid = BigInt(clientId);

    let state = await prisma.clientOnboarding.findUnique({
        where: { client_id: cid },
    });

    if (state) {
        return state;
    }

    // Auto-détection intelligente pour comptes préexistants
    const [existingCall, existingAgent, existingNumbers] = await Promise.all([
        prisma.call.findFirst({ where: { client_id: cid }, select: { id: true } }),
        prisma.agent.findFirst({ where: { client_id: cid }, select: { id: true, meta: true } }),
        prisma.phoneNumber.findFirst({ where: { client_id: cid }, select: { id: true } }),
    ]);

    const isAlreadyActive = Boolean(
        existingCall ||
        (existingAgent && existingAgent.meta?.onboarding?.completed_at) ||
        (existingAgent && existingNumbers)
    );

    const initialStatus = isAlreadyActive ? ONBOARDING_STATUS.COMPLETED : ONBOARDING_STATUS.NOT_STARTED;
    const now = new Date();

    try {
        state = await prisma.clientOnboarding.create({
            data: {
                client_id: cid,
                status: initialStatus,
                current_step: isAlreadyActive ? ONBOARDING_STEPS : 1,
                max_step_reached: isAlreadyActive ? ONBOARDING_STEPS : 1,
                version: ONBOARDING_VERSION,
                started_at: isAlreadyActive ? now : null,
                completed_at: isAlreadyActive ? now : null,
                created_at: now,
                updated_at: now,
            },
        });
    } catch {
        // En cas de course critique concurrente
        state = await prisma.clientOnboarding.findUnique({ where: { client_id: cid } });
    }

    return state;
}

/**
 * Enregistre la progression d'une étape d'onboarding
 */
export async function saveOnboardingProgress(clientId, { step, data = {}, completed = false }) {
    const cid = BigInt(clientId);
    const existing = await getOrCreateOnboardingState(cid);
    const now = new Date();

    const nextStep = Math.min(ONBOARDING_STEPS, Math.max(1, Number(step)));
    const maxStep = Math.max(existing?.max_step_reached || 1, nextStep);
    const mergedData = { ...(existing?.data || {}), ...data };

    const status = completed
        ? ONBOARDING_STATUS.COMPLETED
        : ONBOARDING_STATUS.IN_PROGRESS;

    return await prisma.clientOnboarding.upsert({
        where: { client_id: cid },
        update: {
            status,
            current_step: completed ? ONBOARDING_STEPS : nextStep,
            max_step_reached: maxStep,
            data: mergedData,
            started_at: existing?.started_at || now,
            completed_at: completed ? now : existing?.completed_at,
            updated_at: now,
        },
        create: {
            client_id: cid,
            status,
            current_step: nextStep,
            max_step_reached: maxStep,
            version: ONBOARDING_VERSION,
            data: mergedData,
            started_at: now,
            completed_at: completed ? now : null,
            created_at: now,
            updated_at: now,
        },
    });
}

/**
 * Marque l'onboarding comme ignoré (dismissed) côté serveur
 */
export async function dismissOnboarding(clientId) {
    const cid = BigInt(clientId);
    const now = new Date();

    return await prisma.clientOnboarding.upsert({
        where: { client_id: cid },
        update: {
            status: ONBOARDING_STATUS.DISMISSED,
            dismissed_at: now,
            updated_at: now,
        },
        create: {
            client_id: cid,
            status: ONBOARDING_STATUS.DISMISSED,
            current_step: 1,
            max_step_reached: 1,
            version: ONBOARDING_VERSION,
            dismissed_at: now,
            created_at: now,
            updated_at: now,
        },
    });
}

/**
 * Relance manuellement l'onboarding
 */
export async function restartOnboarding(clientId) {
    const cid = BigInt(clientId);
    const now = new Date();

    return await prisma.clientOnboarding.upsert({
        where: { client_id: cid },
        update: {
            status: ONBOARDING_STATUS.IN_PROGRESS,
            current_step: 1,
            started_at: now,
            completed_at: null,
            dismissed_at: null,
            updated_at: now,
        },
        create: {
            client_id: cid,
            status: ONBOARDING_STATUS.IN_PROGRESS,
            current_step: 1,
            max_step_reached: 1,
            version: ONBOARDING_VERSION,
            started_at: now,
            created_at: now,
            updated_at: now,
        },
    });
}
