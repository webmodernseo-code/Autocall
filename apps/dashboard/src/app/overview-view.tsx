"use client";

export function OverviewView({ locale, onNavigate, onboardingGoals, initialTab, onStartTour }: { locale: string; onNavigate: (id: string) => void; onboardingGoals?: string[]; initialTab?: string; onStartTour?: () => void; }) {
  // Simple placeholder implementation respecting ultra‑premium design rules
  return (
    <div className="p-6 text-[var(--foreground)] bg-[var(--surface)]">
      <OverviewHeader />
      <p className="text-[var(--text-secondary)] mt-4">
        Cette page d&rsquo;aperçu a été mise à jour. Les sections détaillées seront ajoutées ici.
      </p>
    </div>
  );
}
  return (
    <div className="p-6 text-[var(--foreground)] bg-[var(--surface)]">
      <h1 className="text-2xl font-semibold mb-4">Vue d'ensemble</h1>
      <p className="text-[var(--text-secondary)]">
        Cette page a été réinitialisée. Ajoutez ici vos sections personnalisées.
      </p>
    </div>
  );
}
