import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { toE164 } from '@/lib/domain/contacts';
import { syncToGoogleSheet } from '@/lib/domain/google-sheets';
import { readBody } from '@/lib/http';
import { enforcePublicLimits } from '@/lib/public-abuse-guard';
import { isValidPublicEmail, sanitizeFormSubmission } from '@/lib/public-input.mjs';

export const dynamic = 'force-dynamic';

/**
 * POST /api/f/[token]/submit
 * Public endpoint to submit a form.
 */
export async function POST(request, { params }) {
    try {
        const { token } = await params;
        if (!token) {
            return NextResponse.json({ error: 'Token manquant.' }, { status: 400 });
        }

        const form = await prisma.form.findUnique({
            where: { public_token: token },
        });

        if (!form || form.deleted_at || form.status !== 'active') {
            return NextResponse.json({ error: 'Ce formulaire n\'est plus actif.' }, { status: 404 });
        }

        const limited = await enforcePublicLimits(request, [
            { scope: `form:${form.id}:minute`, max: 10, seconds: 60 },
            { scope: `form:${form.id}:hour`, max: 80, seconds: 3600 },
            { scope: `client:${form.client_id}:forms-day`, max: 1000, seconds: 86400 },
        ]);
        if (limited) return limited;

        const rawBody = await readBody(request);
        const fields = Array.isArray(form.fields) ? form.fields : [];
        const body = sanitizeFormSubmission(fields, rawBody);

        // Validate required fields
        const validationErrors = {};
        for (const field of fields) {
            const val = body[field.key];
            if (field.required && (val === undefined || val === null || String(val).trim() === '')) {
                validationErrors[field.key] = `Le champ "${field.label || field.key}" est obligatoire.`;
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            return NextResponse.json({ errors: validationErrors }, { status: 422 });
        }

        // Detect contact information (name, phone, email, company)
        let phoneVal = null;
        let emailVal = null;
        let nameVal = null;
        let companyVal = null;

        for (const [key, val] of Object.entries(body)) {
            const lowerKey = key.toLowerCase();
            const strVal = String(val ?? '').trim();
            if (!phoneVal && (lowerKey.includes('phone') || lowerKey.includes('tel') || lowerKey.includes('mobile'))) {
                phoneVal = strVal;
            } else if (!emailVal && lowerKey.includes('mail')) {
                emailVal = strVal;
            } else if (!nameVal && (lowerKey.includes('name') || lowerKey.includes('nom') || lowerKey.includes('prenom'))) {
                nameVal = strVal;
            } else if (!companyVal && (lowerKey.includes('company') || lowerKey.includes('entreprise') || lowerKey.includes('societe'))) {
                companyVal = strVal;
            }
        }

        if (!isValidPublicEmail(emailVal)) {
            return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 422 });
        }

        let contactId = null;
        const normalizedPhone = phoneVal ? toE164(phoneVal) : null;

        if (normalizedPhone) {
            try {
                let contact = await prisma.contact.findFirst({
                    where: {
                        client_id: form.client_id,
                        phone: normalizedPhone,
                    },
                });

                if (contact) {
                    // Public submissions can link to a CRM contact, but cannot
                    // overwrite its trusted fields without an explicit rule.
                    contactId = contact.id;
                } else {
                    contact = await prisma.contact.create({
                        data: {
                            client_id: form.client_id,
                            phone: normalizedPhone,
                            name: nameVal || null,
                            email: emailVal || null,
                            company: companyVal || null,
                            source: 'form',
                            pipeline_stage: 'new',
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    });
                    contactId = contact.id;
                }
            } catch (contactErr) {
                console.error('[PublicForm] Error creating/updating contact:', contactErr?.message);
            }
        }

        // Create form submission record
        const submission = await prisma.formSubmission.create({
            data: {
                client_id: form.client_id,
                form_id: form.id,
                contact_id: contactId,
                data: body,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        // Trigger Google Sheets sync if connected
        await syncToGoogleSheet(form.client_id, 'form', {
            form_id: Number(form.id),
            form_name: form.name,
            contact_name: nameVal,
            contact_phone: normalizedPhone || phoneVal,
            contact_email: emailVal,
            submitted_at: new Date().toISOString(),
            ...body,
        });

        return NextResponse.json({
            success: true,
            submission_id: Number(submission.id),
            message: 'Votre message a bien été envoyé.',
        });
    } catch (err) {
        if (err?.response) return err.response;
        console.error('[PublicForm] Submission error:', err);
        return NextResponse.json(
            { error: 'Une erreur interne est survenue lors de la soumission.' },
            { status: 500 }
        );
    }
}
