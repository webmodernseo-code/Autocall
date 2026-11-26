import { AppShell } from "./app-shell";
import { parseOnboardingGoals } from "./onboarding/goals";

export default async function DashboardHome({ searchParams }: { searchParams: Promise<{ onboarding?: string; goals?: string; view?: string }> }) {
  const query = await searchParams;
  return <AppShell onboarding={query.onboarding === "1"} onboardingGoals={parseOnboardingGoals(query.goals)} initialView={query.view} />;
}
