import prisma from '@/lib/prisma';
import { handler } from '@/lib/guards';
import { back, readBody, validate } from '@/lib/http';
import { currentUser } from '@/lib/auth';
import { putSession } from '@/lib/auth/session';

/** PUT /currency */
export const PUT = handler(async (request) => {
    const codes = ['EUR', 'USD', 'FCFA', 'XOF'];

    const data = await validate(await readBody(request), {
        currency: ['required', 'string', `in:${codes.join(',')}`],
    });

    const user = await currentUser();

    if (user?.id) {
        try {
            await prisma.user.update({
                where: { id: user.id },
                data: { display_currency: data.currency, updated_at: new Date() },
            });
        } catch {}
    }

    await putSession({ display_currency: data.currency });

    return back();
});
