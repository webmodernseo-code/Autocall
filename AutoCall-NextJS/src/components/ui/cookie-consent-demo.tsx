"use client";

import * as React from "react";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { Shield, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DemoMain() {
  const handleReset = () => {
    try {
      localStorage.removeItem("cookie_preferences");
      localStorage.removeItem("cookie_consent_given");
      window.location.reload();
    } catch (error) {
      console.error("Error resetting cookies:", error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-center mb-4">
        <Button onClick={handleReset} size="sm">
          Réinitialiser les préférences de cookies
        </Button>
      </div>

      <CookieConsent
        className="custom-cookie-banner"
        cookiePolicyUrl="/cookies"
        categories={[
          {
            id: "essential",
            name: "Cookies Essentiels & Sécurité",
            description: "Requis pour les fonctions fondamentales du site, la sécurité et les sessions. Ils ne peuvent pas être désactivés.",
            icon: <Shield className="h-4 w-4 text-emerald-500" />,
            isEssential: true,
          },
          {
            id: "analytics",
            name: "Mesure d'Audience & Statistiques",
            description: "Nous aide à comprendre l'interaction des visiteurs de manière 100% anonyme sans profilage.",
            icon: <BarChart3 className="h-4 w-4 text-white" />,
          },
          {
            id: "marketing",
            name: "Personnalisation & Démonstration",
            description: "Mémorise vos préférences pour les appels de démonstration et les tests d'agents vocaux.",
            icon: <Target className="h-4 w-4 text-white" />,
          },
        ]}
        onAccept={(preferences) => {
          console.log('🍪 Préférences enregistrées :', preferences);
        }}
        onDecline={() => {
          console.log('🔒 Cookies non-essentiels refusés');
        }}
      />
    </div>
  );
}
