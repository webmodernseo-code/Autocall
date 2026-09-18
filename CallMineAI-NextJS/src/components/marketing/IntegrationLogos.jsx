'use client';

export default function IntegrationLogos({ className = '' }) {
    const integrations = [
        { name: 'Twilio', type: 'Téléphonie Mondiale' },
        { name: 'HubSpot', type: 'CRM & Pipeline' },
        { name: 'Salesforce', type: 'Enterprise CRM' },
        { name: 'Pipedrive', type: 'Gestion Commerciale' },
        { name: 'ElevenLabs', type: 'Synthèse Vocale HD' },
        { name: 'OpenAI', type: 'Intelligence Conversationnelle' },
        { name: 'Zapier', type: '5 000+ Applications' },
        { name: 'Stripe', type: 'Paiements Sécurisés' },
    ];

    return (
        <div className={`w-full ${className}`}>
            <div className="text-center mb-6">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider">
                    S'INTÈGRE PARFAITEMENT DANS VOTRE ÉCOSYSTÈME EXISTANT
                </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                {integrations.map((item, idx) => (
                    <div
                        key={idx}
                        className="px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        <strong className="text-slate-900 dark:text-white font-semibold">{item.name}</strong>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px] hidden sm:inline">• {item.type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
