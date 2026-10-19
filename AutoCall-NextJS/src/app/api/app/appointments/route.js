import prisma from '@/lib/prisma';
import { gateClient, handler } from '@/lib/guards';
import { back, readBody, validate, validationError } from '@/lib/http';
import { appointmentData, appointmentRules, assertAppointmentRefs } from '@/lib/domain/appointments';

/** POST /app/appointments */
export const POST = handler(async (request) => {
    const gate = await gateClient({ routeName: 'client.appointments.store' });
    if (gate.response) return gate.response;

    const data = await validate(await readBody(request), appointmentRules());

    const refErrors = await assertAppointmentRefs(data, gate.clientId);
    if (refErrors) return validationError(refErrors);

    const appointment = await prisma.appointment.create({
        data: {
            ...appointmentData(data),
            client_id: BigInt(gate.clientId),
            source: 'manual',
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    const { syncToGoogleSheet } = await import('@/lib/domain/google-sheets');
    await syncToGoogleSheet(gate.clientId, 'appointment', {
        id: Number(appointment.id),
        agent_id: data.agent_id ? Number(data.agent_id) : null,
        contact_id: data.contact_id ? Number(data.contact_id) : null,
        scheduled_at: data.scheduled_at,
        notes: data.notes,
        status: data.status || 'scheduled',
    });

    return back({ success: 'Appointment created.' });
});
