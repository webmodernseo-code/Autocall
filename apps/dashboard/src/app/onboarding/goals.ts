export const onboardingGoals = [
  { id: "calls", title: "Récupérer mes appels manqués", description: "Orienter les appels vers un agent IA ou votre équipe.", action: "Configurer la téléphonie", module: "settings" },
  { id: "leads", title: "Trouver de nouveaux prospects", description: "Identifier les entreprises et les contacts qui correspondent à votre cible.", action: "Rechercher des prospects", module: "acquisition" },
  { id: "appointments", title: "Obtenir plus de rendez-vous", description: "Préparer les créneaux et le suivi dans votre CRM.", action: "Préparer les disponibilités", module: "crm" },
  { id: "messages", title: "Centraliser mes échanges", description: "Retrouver les appels, emails et messages WhatsApp au même endroit.", action: "Explorer la boîte unifiée", module: "conversations" },
  { id: "automation", title: "Automatiser les tâches répétitives", description: "Tester les actions de suivi que vous souhaitez déléguer.", action: "Tester un workflow", module: "automation" },
] as const;

export type OnboardingGoalId = (typeof onboardingGoals)[number]["id"];

export function parseOnboardingGoals(value: string | string[] | undefined): OnboardingGoalId[] {
  const selected = typeof value === "string" ? value.split(",") : [];
  return onboardingGoals.filter((goal) => selected.includes(goal.id)).map((goal) => goal.id);
}
