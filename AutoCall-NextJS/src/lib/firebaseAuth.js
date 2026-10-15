'use client';

import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const APP_NAME = 'social-login';

/**
 * Initialise (or re-initialise) a dedicated Firebase app from the admin-provided
 * web config. A fixed-name app is used so that when the admin changes the config,
 * we detect the mismatch and re-create it instead of silently reusing a stale
 * app initialised earlier in the same SPA session (a common cause of
 * `auth/internal-error`).
 */
function appForConfig(config) {
    const existing = getApps().find((a) => a.name === APP_NAME);
    if (existing) {
        const same = JSON.stringify(existing.options) === JSON.stringify(config);
        if (same) return existing;
        deleteApp(existing); // config changed → drop the stale app and re-init below
    }
    return initializeApp(config, APP_NAME);
}

/** Map Firebase SDK error codes to actionable, human-readable messages. */
function friendlyMessage(err) {
    const code = err?.code || '';
    switch (code) {
        case 'auth/internal-error':
            return 'La connexion Google a échoué (délai de synchronisation Firebase/Google Cloud en cours). Veuillez patienter 2 minutes et réessayer, ou désactiver puis réactiver Google dans la console Firebase.';
        case 'auth/operation-not-allowed':
            return 'La connexion Google n’est pas activée sur ce projet Firebase. Activez-la sous Authentication → Fournisseurs de connexion.';
        case 'auth/unauthorized-domain':
            return 'Ce domaine n’est pas autorisé dans Firebase. Ajoutez-le sous Authentication → Paramètres → Domaines autorisés.';
        case 'auth/invalid-api-key':
            return 'La clé API Firebase est invalide. Vérifiez les paramètres de connexion sociale.';
        case 'auth/popup-blocked':
            return 'La fenêtre contextuelle Google a été bloquée par le navigateur. Autorisez les pop-ups pour ce site et réessayez.';
        case 'auth/popup-closed-by-user':
            return 'La fenêtre de connexion a été fermée avant la fin.';
        default:
            return err?.message || 'La connexion Google a échoué. Veuillez réessayer.';
    }
}

/**
 * Run a Google sign-in popup and return the Firebase ID token to verify server-side.
 *
 * @param {{ apiKey: string, authDomain: string, projectId: string, appId: string, messagingSenderId?: string, storageBucket?: string }} config
 * @returns {Promise<string>} Firebase ID token
 */
export async function signInWithGoogle(config) {
    if (!config || !config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
        throw new Error('Firebase n’est pas entièrement configuré. Vérifiez les clés dans le panneau d’administration.');
    }

    // Normalise a mistakenly pasted authDomain (e.g. with a scheme or trailing slash).
    const cleaned = {
        ...config,
        authDomain: String(config.authDomain).replace(/^https?:\/\//, '').replace(/\/+$/, ''),
    };

    const app = appForConfig(cleaned);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        return result.user.getIdToken();
    } catch (err) {
        console.error('[Firebase Auth Error Details]', {
            code: err?.code,
            message: err?.message,
            customData: err?.customData,
        });
        // Preserve the code for callers that special-case cancellations.
        const wrapped = new Error(friendlyMessage(err));
        wrapped.code = err?.code;
        throw wrapped;
    }
}
