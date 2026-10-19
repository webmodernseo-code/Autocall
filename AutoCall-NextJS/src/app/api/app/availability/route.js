import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { gateClient, handler } from '@/lib/guards';
import { readBody, validationError } from '@/lib/http';

export const dynamic = 'force-dynamic';

const DEFAULT_AVAILABILITY = {
    enabled: true,
    weekly: {
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        morning_start: '09:00',
        morning_end: '12:00',
        lunch_break_enabled: true,
        lunch_start: '12:00',
        lunch_end: '14:00',
        afternoon_start: '14:00',
        afternoon_end: '18:00',
        lunch_greeting: "Bonjour ! Nos bureaux sont actuellement en pause déjeuner jusqu'à 14h00. Je prends votre message pour que vous soyez rappelé dès cet après-midi.",
        closed_greeting: "Bonjour ! Nos bureaux sont actuellement fermés. Je prends votre message afin que notre équipe vous recontacte dès la prochaine ouverture.",
    },
    absences: [],
};

const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const day = z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
const availabilitySchema = z.object({
    enabled: z.boolean(),
    weekly: z.object({
        days: z.array(day).max(7),
        morning_start: time,
        morning_end: time,
        lunch_break_enabled: z.boolean(),
        lunch_start: time,
        lunch_end: time,
        afternoon_start: time,
        afternoon_end: time,
        lunch_greeting: z.string().trim().max(1000),
        closed_greeting: z.string().trim().max(1000),
    }).strict(),
    absences: z.array(z.object({
        title: z.string().trim().max(120).optional().default(''),
        start_date: date,
        end_date: date,
        return_date: date.optional(),
        message: z.string().trim().max(1000).optional().default(''),
    }).strict().refine((value) => value.end_date >= value.start_date, {
        message: 'La date de fin doit être postérieure ou égale à la date de début.',
    })).max(100),
}).strict();

/** GET /api/app/availability */
export const GET = handler(async () => {
    const gate = await gateClient();
    if (gate.response) return gate.response;

    const clientId = BigInt(gate.clientId);
    const agent = await prisma.agent.findFirst({
        where: { client_id: clientId, deleted_at: null },
        orderBy: { id: 'asc' },
        select: { id: true, meta: true },
    });

    const availability = agent?.meta?.availability || DEFAULT_AVAILABILITY;
    return NextResponse.json({ ok: true, availability });
});

/** POST /api/app/availability */
export const POST = handler(async (request) => {
    const gate = await gateClient();
    if (gate.response) return gate.response;

    const clientId = BigInt(gate.clientId);
    const body = await readBody(request);
    const parsed = availabilitySchema.safeParse(body.availability);
    if (!parsed.success) {
        return validationError({
            availability: parsed.error.issues.map((issue) => issue.message),
        });
    }
    const availability = parsed.data;

    // Récupérer tous les agents actifs du client
    const agents = await prisma.agent.findMany({
        where: { client_id: clientId, deleted_at: null },
        select: { id: true, meta: true },
    });

    for (const agent of agents) {
        const currentMeta = (agent.meta && typeof agent.meta === 'object') ? agent.meta : {};
        const updatedMeta = {
            ...currentMeta,
            availability,
            updated_at: new Date().toISOString(),
        };

        await prisma.agent.update({
            where: { id: agent.id },
            data: {
                meta: updatedMeta,
                updated_at: new Date(),
            },
        });
    }

    return NextResponse.json({ ok: true, success: 'Planning de disponibilité enregistré avec succès.', availability });
});
