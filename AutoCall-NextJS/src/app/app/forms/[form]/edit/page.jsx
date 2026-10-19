import { notFound } from 'next/navigation';
import FormBuilder from '@/views/client/Forms/Builder';
import { renderPage } from '@/lib/render';
import { requireClientPage } from '@/lib/guards';
import prisma from '@/lib/prisma';
import { plain } from '@/lib/serialize';
import { FIELD_TYPES } from '@/lib/domain/forms';

export const dynamic = 'force-dynamic';

/** GET /app/forms/{form}/edit */
export default async function Page({ params }) {
    const { clientId } = await requireClientPage();
    const { form: id } = await params;

    const form = await prisma.form.findUnique({ where: { id: BigInt(id) } });
    let publicToken = form.public_token;
    if (!publicToken) {
        const { randomToken } = await import('@/lib/domain/widget');
        publicToken = randomToken(32);
        await prisma.form.update({
            where: { id: form.id },
            data: { public_token: publicToken },
        });
    }

    const props = {
        form: plain({
            id: form.id,
            name: form.name,
            description: form.description,
            status: form.status,
            fields: form.fields ?? [],
            public_token: publicToken,
        }),
        isNew: false,
        fieldTypes: FIELD_TYPES,
    };

    return renderPage(FormBuilder, 'client/Forms/Builder', props, { url: `/app/forms/${id}/edit` });
}
