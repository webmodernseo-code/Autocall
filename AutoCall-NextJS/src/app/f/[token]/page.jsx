import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { plain } from '@/lib/serialize';
import PublicFormClient from './PublicFormClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { token } = await params;
    if (!token) return { title: 'Formulaire' };

    const form = await prisma.form.findUnique({
        where: { public_token: token },
        select: { name: true, description: true },
    });

    if (!form) return { title: 'Formulaire introuvable' };

    return {
        title: `${form.name} | AutoCall`,
        description: form.description || 'Formulaire de contact en ligne',
    };
}

export default async function PublicFormPage({ params }) {
    const { token } = await params;
    if (!token) notFound();

    const form = await prisma.form.findUnique({
        where: { public_token: token },
        include: {
            clients: {
                select: { name: true },
            },
        },
    });

    if (!form || form.deleted_at || form.status !== 'active') {
        notFound();
    }

    const serializedForm = plain({
        id: form.id,
        name: form.name,
        description: form.description,
        public_token: form.public_token,
        fields: form.fields ?? [],
    });

    return (
        <PublicFormClient
            form={serializedForm}
            clientName={form.clients?.name || null}
        />
    );
}
