import 'server-only';

import prisma from '@/lib/prisma';
import config from '@/lib/config';
import { defaultAiProvider } from '@/lib/services/ai';

/** Port of App\Services\Calling\AgentConversationService. */

function fillVars(text, contact) {
    return String(text)
        .replaceAll('{{name}}', contact?.name ?? 'there')
        .replaceAll('{{company}}', contact?.company ?? '');
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function checkAvailability(agent) {
    const avail = agent?.meta?.availability;
    if (!avail || avail.enabled === false) return { status: 'open', message: null };

    const now = new Date();
    // Heure de Paris pour les entreprises françaises
    const formatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const getPart = (type) => parts.find((p) => p.type === type)?.value;

    const currentYear = getPart('year');
    const currentMonth = getPart('month');
    const currentDay = getPart('day');
    const currentDateStr = `${currentYear}-${currentMonth}-${currentDay}`;

    const currentHour = getPart('hour');
    const currentMin = getPart('minute');
    const currentTimeStr = `${currentHour}:${currentMin}`;

    const dayIndex = now.getDay();
    const currentDayName = DAYS[dayIndex];

    // 1. Vérification des absences temporaires / congés
    if (Array.isArray(avail.absences)) {
        for (const abs of avail.absences) {
            if (abs.start_date && abs.end_date) {
                if (currentDateStr >= abs.start_date && currentDateStr <= abs.end_date) {
                    const retDate = abs.return_date || abs.end_date;
                    const defaultMsg = abs.title && abs.title.trim()
                        ? `Bonjour ! Nos bureaux sont actuellement fermés pour ${abs.title} jusqu'au ${retDate}. Je prends votre message pour que notre équipe vous recontacte dès notre réouverture.`
                        : `Bonjour ! Nos bureaux sont actuellement fermés jusqu'au ${retDate}. Je prends votre message pour que notre équipe vous recontacte dès notre réouverture.`;
                    return {
                        status: 'vacation',
                        title: abs.title || 'Indisponibilité temporaire',
                        returnDate: retDate,
                        message: abs.message || defaultMsg,
                    };
                }
            }
        }
    }

    // 2. Horaires permanents hebdomadaires
    const weekly = avail.weekly;
    if (weekly) {
        const allowedDays = weekly.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        if (!allowedDays.includes(currentDayName)) {
            return {
                status: 'closed',
                message: weekly.closed_greeting || "Bonjour ! Nos bureaux sont actuellement fermés. Je prends votre message pour que notre équipe vous recontacte dès la prochaine ouverture.",
            };
        }

        // 3. Coupure du midi / Pause déjeuner
        if (weekly.lunch_break_enabled && weekly.lunch_start && weekly.lunch_end) {
            if (currentTimeStr >= weekly.lunch_start && currentTimeStr < weekly.lunch_end) {
                return {
                    status: 'lunch_break',
                    lunchEnd: weekly.lunch_end,
                    message: weekly.lunch_greeting || `Bonjour ! Nos bureaux sont actuellement indisponibles jusqu'à ${weekly.lunch_end}. Je prends votre message pour que vous soyez rappelé dès la reprise cet après-midi.`,
                };
            }
        }

        // 4. Heures d'ouverture générales (matin ou après-midi)
        const openStart = weekly.morning_start || '09:00';
        const openEnd = weekly.afternoon_end || '18:00';
        if (currentTimeStr < openStart || currentTimeStr >= openEnd) {
            return {
                status: 'closed',
                message: weekly.closed_greeting || "Bonjour ! Nos bureaux sont actuellement fermés. Je prends votre message pour que notre équipe vous recontacte dès la prochaine ouverture.",
            };
        }
    }

    return { status: 'open', message: null };
}

export function greeting(agent, contact = null) {
    const avail = checkAvailability(agent);
    if (avail.status !== 'open' && avail.message) {
        return fillVars(avail.message, contact);
    }

    const configured = String(agent?.greeting ?? '').trim();
    if (configured !== '') return fillVars(configured, contact);

    return 'Bonjour, comment puis-je vous aider ?';
}

/** The full system prompt: persona, objective, knowledge base and call policy. */
export async function systemPrompt(agent, campaign = null, contact = null) {
    const parts = [];

    parts.push(String(agent?.system_prompt ?? '').trim() || 'You are a helpful AI phone agent.');

    const avail = checkAvailability(agent);
    if (avail.status === 'vacation') {
        parts.push(
            `IMPORTANT HORAIRES : L'entreprise est actuellement indisponible jusqu'au ${avail.returnDate}. ` +
            `Message d'accueil configuré par l'entreprise : "${avail.message}". ` +
            `Respectez scrupuleusement le ton et les indications de ce message (ne divulguez pas de motif si le message se veut neutre ou discret). ` +
            `Accueillez l'appelant poliment, informez-le de la date de reprise (${avail.returnDate}), ` +
            `prenez note de sa demande et de ses coordonnées pour qu'il soit recontacté en priorité dès la reprise.`
        );
    } else if (avail.status === 'lunch_break') {
        parts.push(
            `IMPORTANT HORAIRES : L'appel a lieu pendant la coupure de mi-journée (reprise prévue à ${avail.lunchEnd || 'cet après-midi'}). ` +
            `Message d'accueil configuré par l'entreprise : "${avail.message}". ` +
            `Suivez précisément la consigne de ce message (mentionnez la pause déjeuner ou restez neutre et discret selon ce qui est rédigé). ` +
            `Accueillez l'appelant, notez son besoin et ses coordonnées afin qu'il soit rappelé dès la reprise cet après-midi.`
        );
    } else if (avail.status === 'closed') {
        parts.push(
            `IMPORTANT HORAIRES : L'appel a lieu en dehors des heures d'ouverture (soirée ou week-end). ` +
            `Message d'accueil configuré par l'entreprise : "${avail.message}". ` +
            `Les bureaux sont actuellement fermés. Accueillez l'appelant, recueillez sa demande et confirmez un rappel dès la prochaine ouverture.`
        );
    }

    if (agent?.tone || agent?.personality) {
        parts.push(`Speak in a ${`${agent.tone ?? ''} ${agent.personality ?? ''}`.trim()} manner.`);
    }
    if (campaign?.goal) parts.push(`Call objective: ${campaign.goal}`);

    const kb = await prisma.knowledgeBaseItem.findMany({
        where: { agent_id: agent.id, status: 'ready', content: { not: null } },
        orderBy: { id: 'asc' },
        take: 5,
        select: { content: true },
    });

    const contents = kb.map((k) => k.content).filter(Boolean);
    if (contents.length) {
        parts.push(`Use this knowledge to answer accurately:\n${contents.join('\n---\n').slice(0, 4000)}`);
    }

    if (contact?.name) parts.push(`You are speaking with ${contact.name}.`);

    parts.push(
        'Keep replies short and conversational (1-2 sentences), suitable for a phone call. ' +
            'Ask one question at a time and wait for the answer.',
    );
    parts.push(
        'You are qualifying this lead. A bare "yes" or expression of interest is NOT the end of ' +
            'the call — follow up to learn what matters: their specific need, timeline, budget or team size, ' +
            'and who makes the decision. Acknowledge what they say, then ask the next relevant question. ' +
            'Before ending, confirm a concrete next step (a callback time, a demo, or an email to send) and ' +
            'read back the details you captured.',
    );
    parts.push(
        'Only end the call when the objective is met, the caller declines or asks to stop, or they ' +
            'clearly want to go. To end, finish your reply with the token [END_CALL].',
    );

    return parts.join('\n\n');
}

/** One in-call turn. Never throws — a failure degrades to a re-ask. */
export async function reply(agent, campaign, contact, history, userUtterance) {
    const provider = await defaultAiProvider();

    if (!provider) {
        console.warn(
            'AI provider not configured — agent conversation degraded to a canned goodbye. ' +
                'Add an OpenAI key under Admin → Engines → OpenAI (or set OPENAI_API_KEY).',
            { agent_id: String(agent.id), campaign_id: campaign ? String(campaign.id) : null },
        );
        return { text: 'Thank you, I appreciate your time. Goodbye.', tokens: 0, end: true };
    }

    let prompt = `${await systemPrompt(agent, campaign, contact)}\n\n`;
    for (const turn of history ?? []) {
        prompt += `${turn.role === 'agent' ? 'Agent: ' : 'Caller: '}${turn.text}\n`;
    }
    prompt += `Caller: ${userUtterance}\nAgent:`;

    let result;
    try {
        result = await provider.complete(prompt, {
            temperature: Number(agent.temperature),
            max_tokens: 200,
            timeout: config.calling.reply_timeout,
        });
    } catch (e) {
        console.warn('In-call LLM reply failed:', e?.message, {
            agent_id: String(agent.id),
            campaign_id: campaign ? String(campaign.id) : null,
        });
        return {
            text: "Sorry, I didn't quite catch that — could you say that again?",
            tokens: 0,
            end: false,
            error: e?.message,
        };
    }

    let text = String(result.text ?? '').trim();
    let end = text.includes('[END_CALL]');
    text = text.replaceAll('[END_CALL]', '').trim();

    if (text === '') {
        text = 'Thanks for your time. Goodbye.';
        end = true;
    }

    return { text, tokens: Number(result.tokens_used ?? 0), end };
}
