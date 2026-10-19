import { gateClient, handler } from '@/lib/guards';
import { redirectTo } from '@/lib/http';
import { dismissOnboarding } from '@/lib/domain/onboarding';

export const POST = handler(async (request) => {
    const gate = await gateClient({ routeName: 'client.onboarding.dismiss' });
    if (gate.response) return gate.response;

    const clientId = BigInt(gate.clientId);
    await dismissOnboarding(clientId);

    return redirectTo('/app/dashboard', { success: 'Configuration guidée masquée.' });
});
