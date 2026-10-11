import { redirect } from 'next/navigation';
import Onboarding from '@/views/client/Onboarding';
import { renderPage } from '@/lib/render';
import { requireClientPage } from '@/lib/guards';
import { agentFormData } from '@/lib/domain/agents';
import { ONBOARDING_STEPS } from '@/lib/domain/onboarding';
import { plain } from '@/lib/serialize';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
    const { user, clientId } = await requireClientPage();
    const params = await searchParams;
    const requestedStep = Math.max(1, Math.min(ONBOARDING_STEPS, Number(params?.step || 1)));

    const [client, agent, formData] = await Promise.all([
        prisma.client.findUnique({ where: { id: BigInt(clientId) } }),
        prisma.agent.findFirst({ where: { client_id: BigInt(clientId) }, orderBy: { id: 'asc' } }),
        agentFormData(clientId),
    ]);

    if (!client) redirect('/app/dashboard');

    const saved = agent?.meta?.onboarding || {};
    if (saved.completed_at && params?.edit !== '1') redirect('/app/dashboard');

    return renderPage(Onboarding, 'client/Onboarding', plain({
        step: requestedStep,
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
        saved,
        voices: formData.voices,
    }), { url: '/app/onboarding', user });
}
