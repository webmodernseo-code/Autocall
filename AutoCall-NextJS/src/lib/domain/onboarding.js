export const ONBOARDING_STEPS = 4;

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
        `Tu es ${input.agent_name || 'l’assistant AutoCall'}, l’assistant vocal de ${input.business_name}.`,
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
