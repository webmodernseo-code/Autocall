import { redirect } from 'next/navigation';
import Onboarding from '@/views/client/Onboarding';
import { renderPage } from '@/lib/render';
import { requireClientPage } from '@/lib/guards';
import { agentFormData } from '@/lib/domain/agents';
import {
    ONBOARDING_STEPS,
    ONBOARDING_STATUS,
    getOrCreateOnboardingState,
    restartOnboarding
} from '@/lib/domain/onboarding';
import { plain } from '@/lib/serialize';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
    const { user, clientId } = await requireClientPage();
    const params = await searchParams;
    const cid = BigInt(clientId);

    if (params?.restart === '1') {
        await restartOnboarding(clientId);
        redirect('/app/onboarding?step=1');
    }

    const [client, onboardingState, agent, formData, phoneNumbers, recentContacts] = await Promise.all([
        prisma.client.findUnique({ where: { id: cid } }),
        getOrCreateOnboardingState(clientId),
        prisma.agent.findFirst({ where: { client_id: cid }, orderBy: { id: 'asc' } }),
        agentFormData(clientId),
        prisma.phoneNumber.findMany({ where: { client_id: cid }, take: 5 }),
        prisma.contact.findMany({ where: { client_id: cid }, take: 5, orderBy: { id: 'desc' } }),
    ]);

    if (!client) redirect('/app/dashboard');

    // Si déjà complété ou ignoré, et que l'utilisateur n'a pas explicitement demandé à modifier/recommencer
    const isManualMode = params?.edit === '1' || Boolean(params?.step);
    if ((onboardingState?.status === ONBOARDING_STATUS.COMPLETED || onboardingState?.status === ONBOARDING_STATUS.DISMISSED) && !isManualMode) {
        redirect('/app/dashboard');
    }

    // Reprendre là où l'utilisateur s'est arrêté si aucun step explicite n'est donné
    const effectiveStep = params?.step
        ? Math.max(1, Math.min(ONBOARDING_STEPS, Number(params.step)))
        : (onboardingState?.current_step || 1);

    const saved = {
        ...(agent?.meta?.onboarding || {}),
        ...(onboardingState?.data || {}),
    };

    return renderPage(Onboarding, 'client/Onboarding', plain({
        step: effectiveStep,
        totalSteps: ONBOARDING_STEPS,
        client: { name: client.name, email: client.email, phone: client.phone, address: client.address },
        agent: agent ? {
            id: agent.id,
            name: agent.name,
            voice_id: agent.voice_id,
            language: agent.language,
            tone: agent.tone,
            greeting: agent.greeting,
        } : null,
        onboardingState,
        saved,
        voices: formData.voices || [],
        phoneNumbers: phoneNumbers.map((p) => ({ id: p.id, phone_number: p.phone_number, status: p.status })),
        recentContacts: recentContacts.map((c) => ({ id: c.id, name: c.name, phone: c.phone })),
    }), { url: '/app/onboarding', user });
}
