"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { PremiumSelect } from "../premium-select";
import { onboardingGoals, type OnboardingGoalId } from "./goals";

const steps = ["Objectifs", "Configuration", "Premiers pas"];
const field = "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm";

export function OnboardingWizard({ initialGoals }: { initialGoals: OnboardingGoalId[] }) {
  const router = useRouter();
  const heading = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<OnboardingGoalId[]>(initialGoals);
  const [company, setCompany] = useState("");
  const [timezone, setTimezone] = useState("Europe/Paris");
  const recommendations = onboardingGoals.filter((goal) => goals.includes(goal.id));
  const goTo = (next: number) => {
    setStep(next);
    heading.current?.focus();
  };
  const finish = () => {
    try {
      window.sessionStorage.setItem("autocall-onboarding-workspace", JSON.stringify({
        company: company.trim(),
        timezone,
      }));
    } catch {
      // The checklist remains available via the selected goals in the URL.
    }
    const query = new URLSearchParams({ onboarding: "1", goals: goals.join(",") });
    router.push("/?" + query.toString());
  };

  return (
    <main className="min-h-dvh bg-[#F4F7F5] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-[#171717]">autocall<span className="text-[#008F6D]">.</span></Link>
          <button type="button" onClick={finish} className="rounded-lg px-3 py-2 text-sm font-medium text-[#525252] hover:bg-white">Configurer plus tard</button>
        </header>
        <div className="mt-8 grid items-start gap-5 md:grid-cols-[15rem_minmax(0,1fr)]">
          <aside aria-label="Progression de la configuration" className="rounded-2xl border border-[#D7E8DF] bg-[#EDF6F0] p-4 md:p-5">
            <p className="text-sm font-semibold text-[#214E40]">Configuration initiale</p>
            <ol className="mt-3 flex flex-wrap gap-2 md:flex-col">
              {steps.map((label, index) => (
                <li key={label} aria-current={index === step ? "step" : undefined} className={`flex items-center gap-2 rounded-xl px-2 py-2 text-sm ${index === step ? "bg-[#E6F5F0] font-semibold text-[#00684F]" : "text-[var(--text-secondary)]"}`}>
                  <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs">{index < step ? "✓" : index + 1}</span>{label}
                </li>
              ))}
            </ol>
          </aside>
          <section className="min-w-0 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_12px_35px_-24px_rgba(10,52,40,0.35)] sm:p-8">
            <h1 ref={heading} tabIndex={-1} className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {step === 0 ? "Quels sont vos objectifs ?" : step === 1 ? "Personnalisez votre espace" : "Vos premiers pas"}
            </h1>
            {step === 0 && (
              <>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Sélectionnez les objectifs que vous souhaitez atteindre avec AutoCall.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {onboardingGoals.map((goal) => (
                    <button key={goal.id} type="button" aria-pressed={goals.includes(goal.id)} onClick={() => setGoals((previous) => previous.includes(goal.id) ? previous.filter((id) => id !== goal.id) : [...previous, goal.id])} className="group flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-white p-4 text-left transition hover:bg-[#F5FAF7] aria-pressed:border-[#008F6D] aria-pressed:bg-[#EEF8F3]">
                      <span><span className="block text-sm font-semibold">{goal.title}</span><span className="mt-1 block text-sm text-[var(--text-secondary)]">{goal.description}</span></span>
                      <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-md border border-[#CBD9D2] bg-white text-xs text-transparent group-aria-pressed:border-[#008F6D] group-aria-pressed:bg-[#008F6D] group-aria-pressed:text-white">✓</span>
                    </button>
                  ))}
                </div>
                <p role="status" className="mt-4 text-sm text-[var(--text-secondary)]">{goals.length} {goals.length === 1 ? "objectif sélectionné" : "objectifs sélectionnés"}</p>
                {recommendations.length > 0 && <div className="mt-4 rounded-xl bg-[var(--surface-inset)] p-4"><p className="text-sm font-semibold">Actions recommandées</p><ul className="mt-2 space-y-1 text-sm">{recommendations.map((goal) => <li key={goal.id}>{goal.action}</li>)}</ul></div>}
              </>
            )}
            {step === 1 && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">Nom de l’entreprise <input className={field} value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" /></label>
                <div className="grid gap-1 text-sm"><label htmlFor="onboarding-timezone">Fuseau horaire</label><PremiumSelect id="onboarding-timezone" value={timezone} onChange={setTimezone} options={["Europe/Paris", "Europe/London", "Africa/Abidjan", "America/New_York"].map((value) => ({ value, label: value }))} /></div>
                <p className="text-sm text-[var(--text-muted)] sm:col-span-2">Vous pourrez configurer vos comptes et vos intégrations depuis votre checklist.</p>
              </div>
            )}
            {step === 2 && (
              <ul className="mt-5 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] px-4 text-sm">
                <li className="py-3">Vérifier les paramètres de votre entreprise</li>
                {recommendations.map((goal) => <li key={goal.id} className="py-3">{goal.action}</li>)}
                <li className="py-3">Découvrir votre espace avec la visite guidée</li>
              </ul>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
              {step > 0 && <button type="button" onClick={() => goTo(step - 1)} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium">Retour</button>}
              <button type="button" onClick={step === 2 ? finish : () => goTo(step + 1)} className="rounded-xl bg-[#00775B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#005E48]">{step === 2 ? "Ouvrir mon espace" : "Continuer"}</button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
