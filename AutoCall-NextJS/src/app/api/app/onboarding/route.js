import prisma from '@/lib/prisma';
import { gateClient, handler } from '@/lib/guards';
import { readBody, redirectTo, validate, ValidationFailed } from '@/lib/http';
import { defaultEngine } from '@/lib/services/integrations';
import {
    ONBOARDING_STEPS,
    onboardingMeta,
    onboardingPrompt,
    saveOnboardingProgress,
    dismissOnboarding
} from '@/lib/domain/onboarding';

export const POST = handler(async (request) => {
    const gate = await gateClient({ routeName: 'client.onboarding.store' });
    if (gate.response) return gate.response;

    const clientId = BigInt(gate.clientId);
    const body = await readBody(request);

    // Support dismissal via action
    if (body?.action === 'dismiss') {
        await dismissOnboarding(clientId);
        return redirectTo('/app/dashboard', { success: 'Configuration guidée masquée.' });
    }

    const data = await validate(body, {
        step: ['required', 'integer', `between:1,${ONBOARDING_STEPS}`],
        business_name: ['required', 'string', 'max:255'],
        business_email: ['nullable', 'email', 'max:255'],
        business_phone: ['nullable', 'string', 'max:64'],
        business_address: ['nullable', 'string', 'max:1000'],
        sector: ['nullable', 'string', 'max:64'],
        goal: ['nullable', 'string', 'in:inbound,outbound,both,appointments'],
        agent_name: ['nullable', 'string', 'max:255'],
        voice_id: ['nullable', 'exists:voices,id'],
        language: ['nullable', 'string', 'in:fr,en,es,de,it,pt'],
        tone: ['nullable', 'string', 'in:Professional,Friendly,Empathetic,Concise'],
        greeting: ['nullable', 'string', 'max:1000'],
        business_summary: ['nullable', 'string', 'max:3000'],
        opening_start: ['nullable', 'string', 'max:8'],
        opening_end: ['nullable', 'string', 'max:8'],
        transfer_phone: ['nullable', 'string', 'max:64'],
        transfer_rule: ['nullable', 'string', 'in:requested,always,message'],
        test_contact_phone: ['nullable', 'string', 'max:64'],
    }, {
        prisma,
        messages: {
            'business_name.required': 'Indiquez le nom de votre entreprise.',
            'business_email.email': 'Indiquez une adresse e-mail valide.',
            'voice_id.exists': 'La voix sélectionnée n’est plus disponible.',
        },
    });

    const step = Number(data.step);
    const errors = {};
    if (step >= 2 && !data.goal) errors.goal = ['Choisissez la mission principale de votre agent.'];
    if (step >= 3 && !data.agent_name) errors.agent_name = ['Donnez un nom à votre agent.'];
    if (step >= 3 && !data.greeting) errors.greeting = ['Rédigez un message d’accueil.'];
    if (Object.keys(errors).length) throw new ValidationFailed(errors);

    const existing = await prisma.agent.findFirst({ where: { client_id: clientId }, orderBy: { id: 'asc' } });
    const completed = step >= ONBOARDING_STEPS;
    const meta = onboardingMeta(existing?.meta, data, completed);

    await prisma.$transaction(async (tx) => {
        await tx.client.update({
            where: { id: clientId },
            data: {
                name: data.business_name,
                email: data.business_email || null,
                phone: data.business_phone || null,
                address: data.business_address || null,
                updated_at: new Date(),
            },
        });

        const agentData = {
            name: data.agent_name || existing?.name || 'Assistant AutoCall',
            voice_id: data.voice_id ? BigInt(data.voice_id) : (existing?.voice_id || null),
            language: data.language || existing?.language || 'fr',
            tone: data.tone || existing?.tone || 'Professional',
            personality: existing?.personality || 'Helpful',
            greeting: data.greeting || existing?.greeting || `Bonjour, vous êtes bien chez ${data.business_name}. Comment puis-je vous aider ?`,
            system_prompt: onboardingPrompt(data),
            meta,
            updated_at: new Date(),
        };

        if (existing) {
            await tx.agent.update({ where: { id: existing.id }, data: agentData });
        } else {
            await tx.agent.create({
                data: {
                    ...agentData,
                    client_id: clientId,
                    user_id: gate.user.id,
                    engine: defaultEngine(),
                    llm_model: 'gpt-4o-mini',
                    temperature: 0.7,
                    status: 'draft',
                    created_at: new Date(),
                },
            });
        }

        // Si un numéro de contact de test a été fourni à l'étape 5, l'ajouter aux contacts du client
        if (data.test_contact_phone) {
            const existingContact = await tx.contact.findFirst({
                where: { client_id: clientId, phone: data.test_contact_phone },
            });
            if (!existingContact) {
                await tx.contact.create({
                    data: {
                        client_id: clientId,
                        phone: data.test_contact_phone,
                        name: 'Contact de test',
                        source: 'onboarding',
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
            }
        }
    });

    // Enregistrer la progression dans la table dédiée client_onboardings
    await saveOnboardingProgress(clientId, {
        step: completed ? ONBOARDING_STEPS : step + 1,
        data,
        completed,
    });

    if (completed) {
        return redirectTo('/app/dashboard?onboarding=complete', {
            success: 'Félicitations ! Votre premier agent est configuré et prêt pour vos premiers appels.',
        });
    }

    return redirectTo(`/app/onboarding?step=${step + 1}`, { success: 'Étape enregistrée avec succès.' });
});
