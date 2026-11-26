import { parseOnboardingGoals } from "./goals";
import { OnboardingWizard } from "./wizard";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ goals?: string }> }) {
  const { goals } = await searchParams;
  return <OnboardingWizard initialGoals={parseOnboardingGoals(goals)} />;
}
