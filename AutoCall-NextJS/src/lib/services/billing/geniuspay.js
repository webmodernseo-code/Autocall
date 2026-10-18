import 'server-only';

import crypto from 'node:crypto';
import prisma from '@/lib/prisma';
import { priceCentsForCycle } from '@/lib/plans';
import {
    badSignature,
    cred,
    findSubscription,
    handlerError,
    hmacEquals,
    markCanceled,
    okResponse,
    recordTransaction,
    upsertSubscription,
} from './base';

/**
 * GeniusPay Payment Gateway Driver (Côte d'Ivoire & Afrique de l'Ouest)
 * Supports Mobile Money (Wave, Orange Money, MTN MoMo, Moov) and Bank Cards (Visa/Mastercard).
 * Documentation: https://geniuspay.ci/docs/api
 */
export function createGeniusPayGateway(creds, testMode, successUrl, cancelUrl, webhookUrl) {
    const BASE_URL = 'https://geniuspay.ci/api/v1/merchant';
    const key = 'geniuspay';

    const apiKey = () => cred(creds, 'api_key');
    const apiSecret = () => cred(creds, 'api_secret');
    const webhookSecret = () => cred(creds, 'webhook_secret') || apiSecret();

    const isConfigured = () => apiKey() !== '' && apiSecret() !== '';

    return {
        key,
        name: () => 'GeniusPay',
        isConfigured,

        /**
         * Initialize a checkout session and get the GeniusPay payment/checkout URL.
         */
        async createCheckout(user, plan, billingCycle) {
            if (!isConfigured()) return { error: 'GeniusPay n\'est pas encore configuré.' };

            const rawPriceCents = priceCentsForCycle(plan, billingCycle);
            if (!rawPriceCents || Number(rawPriceCents) <= 0) {
                return { error: 'Ce forfait n\'a pas de montant défini pour ce cycle.' };
            }

            const planCurrency = String(plan.currency_code ?? 'XOF').toUpperCase();
            let amount = 0;
            let currency = planCurrency;

            if (planCurrency === 'XOF') {
                amount = Math.max(200, Math.round(Number(rawPriceCents)));
            } else if (['EUR', 'USD'].includes(planCurrency)) {
                // GeniusPay supporte EUR et USD en montant standard
                amount = Math.max(1, Number(rawPriceCents) / 100);
            } else {
                // Par défaut, convertir en XOF (1 EUR ~ 656 XOF)
                amount = Math.max(200, Math.round((Number(rawPriceCents) / 100) * 656));
                currency = 'XOF';
            }

            try {
                const response = await fetch(`${BASE_URL}/payments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-API-Key': apiKey(),
                        'X-API-Secret': apiSecret(),
                    },
                    body: JSON.stringify({
                        amount,
                        currency,
                        description: `Abonnement AutoCall - ${plan.name} (${billingCycle})`,
                        customer: {
                            name: user.name || 'Client AutoCall',
                            email: user.email,
                            phone: user.phone || undefined,
                        },
                        success_url: successUrl,
                        error_url: cancelUrl,
                        metadata: {
                            user_id: String(user.id),
                            plan_id: String(plan.id),
                            billing_cycle: billingCycle,
                            gateway: 'geniuspay',
                        },
                    }),
                    signal: AbortSignal.timeout(30000),
                });

                const json = await response.json().catch(() => ({}));

                if (!response.ok || !json.success) {
                    console.error('GeniusPay payment initialization error', { status: response.status, json });
                    const msg = json.message || json.detail || json.error || 'Erreur lors de l\'initialisation GeniusPay.';
                    return { error: msg };
                }

                const data = json.data || {};
                const checkoutUrl = data.checkout_url || data.payment_url;

                if (!checkoutUrl) {
                    return { error: 'Aucune URL de redirection retournée par GeniusPay.' };
                }

                return {
                    url: checkoutUrl,
                    reference: data.reference || String(data.id || ''),
                };
            } catch (err) {
                console.error('GeniusPay request failed', err);
                return { error: 'Impossible de joindre le serveur GeniusPay.' };
            }
        },

        /**
         * Verify webhook HMAC-SHA256 signature and process payment status updates.
         */
        async handleWebhook(request) {
            const rawBody = await request.text();
            const signature = request.headers.get('x-webhook-signature');
            const timestamp = request.headers.get('x-webhook-timestamp') || '';
            const secret = webhookSecret();

            if (!signature || !secret) {
                return badSignature(key);
            }

            // Calcul de la signature attendue: HMAC-SHA256(timestamp + "." + rawBody, secret)
            const signedPayload = timestamp ? `${timestamp}.${rawBody}` : rawBody;
            const expectedSignature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');

            if (!hmacEquals(expectedSignature, signature)) {
                // Tentative de vérification fallback sans timestamp
                const fallbackSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
                if (!hmacEquals(fallbackSignature, signature)) {
                    console.warn('GeniusPay webhook signature verification failed');
                    return badSignature(key);
                }
            }

            let payload;
            try {
                payload = JSON.parse(rawBody);
            } catch {
                return new Response('Invalid JSON payload', { status: 400 });
            }

            const data = payload.data || payload;
            const event = String(payload.event || data.status || '');
            const isCompleted = ['payment.completed', 'completed', 'successful', 'paid'].includes(event.toLowerCase());

            try {
                if (isCompleted) {
                    const meta = data.metadata || {};
                    const userId = Number(meta.user_id || 0);
                    const planId = Number(meta.plan_id || 0);
                    const subId = String(data.reference || data.id || '');

                    const model =
                        userId && planId
                            ? await upsertSubscription('geniuspay', { userId, planId, subId, status: 'active' })
                            : await findSubscription('geniuspay', subId);

                    await recordTransaction('geniuspay', model, {
                        txnId: String(data.reference || data.id || ''),
                        amountCents: Math.round(Number(data.amount || 0) * 100),
                        currency: String(data.currency || 'XOF'),
                        status: 'paid',
                        payload: data,
                    });
                } else if (['cancelled', 'failed'].includes(event.toLowerCase())) {
                    await markCanceled(key, String(data.reference || data.id || ''));
                }
            } catch (err) {
                return handlerError(key, err, event);
            }

            return okResponse();
        },

        async cancel(subscription) {
            if (!isConfigured() || !subscription?.gateway_subscription_id) return false;
            await markCanceled(key, subscription.gateway_subscription_id);
            return true;
        },

        async sync() {
            return false;
        },

        async fulfillCheckoutSession() {
            return { ok: false, error: 'Not supported.' };
        },
    };
}
