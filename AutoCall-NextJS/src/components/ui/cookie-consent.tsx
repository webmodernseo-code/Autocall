"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CookieIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// --------------------------------
// Types and Interfaces
// --------------------------------

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  isEssential?: boolean;
}

interface CookiePreferences {
  [key: string]: boolean;
}

// --------------------------------
// Default Configurations
// --------------------------------

const DEFAULT_COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    name: "Cookies Essentiels & Sécurité",
    description: "Requis pour les fonctions fondamentales du site (navigation sécurisée, session client, prévention des attaques CSRF). Ils ne peuvent pas être désactivés.",
    isEssential: true,
  },
  {
    id: "analytics",
    name: "Mesure d'Audience & Performance",
    description: "Mesures statistiques strictement anonymes pour améliorer la réactivité et la qualité de nos services, conformément aux recommandations de la CNIL.",
  },
  {
    id: "marketing",
    name: "Personnalisation & Démonstration",
    description: "Permet de mémoriser vos préférences d'affichage et d'optimiser la présentation des fonctionnalités de démonstration de nos agents vocaux.",
  },
];

const STORAGE_KEY = "cookie_preferences";
const CONSENT_KEY = "cookie_consent_given";

// --------------------------------
// Main Component
// --------------------------------

interface CookieConsentProps {
  className?: string;
  categories?: CookieCategory[];
  cookiePolicyUrl?: string;
  onAccept?: (preferences: boolean[]) => void;
  onDecline?: () => void;
}

function CookieConsent({
  className,
  categories = DEFAULT_COOKIE_CATEGORIES,
  cookiePolicyUrl = "/cookies",
  onAccept,
  onDecline,
}: CookieConsentProps) {
  const [mounted, setMounted] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(false);
  const [showCustomizeDialog, setShowCustomizeDialog] = React.useState(false);
  
  // Simple boolean array - index matches category index
  const [preferences, setPreferences] = React.useState<boolean[]>(() => 
    categories.map(cat => !!cat.isEssential)
  );

  // Check if consent was already given
  React.useEffect(() => {
    setMounted(true);
    
    try {
      const consentGiven = localStorage.getItem(CONSENT_KEY) === "true";
      const storedPrefs = localStorage.getItem(STORAGE_KEY);
      
      if (consentGiven && storedPrefs) {
        const parsedPrefs = JSON.parse(storedPrefs) as boolean[];
        if (Array.isArray(parsedPrefs) && parsedPrefs.length === categories.length) {
          setPreferences(parsedPrefs);
          onAccept?.(parsedPrefs);
          return;
        }
      }
      
      // No valid consent found, show banner
      setShowBanner(true);
    } catch (error) {
      console.error("Error reading cookie preferences:", error);
      setShowBanner(true);
    }
  }, [categories.length, onAccept]);

  const savePreferences = React.useCallback((prefs: boolean[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      localStorage.setItem(CONSENT_KEY, "true");
    } catch (error) {
      console.error("Error saving cookie preferences:", error);
    }
    
    setShowBanner(false);
    setShowCustomizeDialog(false);
    onAccept?.(prefs);
  }, [onAccept]);

  const handleAcceptAll = React.useCallback(() => {
    const allTrue = categories.map(() => true);
    setPreferences(allTrue);
    savePreferences(allTrue);
  }, [categories, savePreferences]);

  const handleRejectAll = React.useCallback(() => {
    const essentialOnly = categories.map(cat => !!cat.isEssential);
    setPreferences(essentialOnly);
    savePreferences(essentialOnly);
    onDecline?.();
  }, [categories, savePreferences, onDecline]);

  const handleSaveCustom = React.useCallback(() => {
    savePreferences(preferences);
  }, [preferences, savePreferences]);

  const handleToggle = React.useCallback((index: number, checked: boolean) => {
    if (categories[index]?.isEssential) return; // Can't toggle essential cookies
    
    setPreferences(prev => {
      const newPrefs = [...prev];
      newPrefs[index] = checked;
      return newPrefs;
    });
  }, [categories]);

  if (!mounted) return null;

  return (
    <>
      <CookieBanner
        isVisible={showBanner}
        onAcceptAll={handleAcceptAll}
        onCustomize={() => setShowCustomizeDialog(true)}
        cookiePolicyUrl={cookiePolicyUrl}
        className={className}
      />
      
      <CookieCustomizeDialog
        open={showCustomizeDialog}
        onOpenChange={setShowCustomizeDialog}
        categories={categories}
        preferences={preferences}
        onToggle={handleToggle}
        onSave={handleSaveCustom}
        onRejectAll={handleRejectAll}
      />
    </>
  );
}

// --------------------------------
// Sub-Components
// --------------------------------

interface CookieBannerProps {
  isVisible: boolean;
  onAcceptAll: () => void;
  onCustomize: () => void;
  cookiePolicyUrl: string;
  className?: string;
}

function CookieBanner({
  isVisible,
  onAcceptAll,
  onCustomize,
  cookiePolicyUrl,
  className,
}: CookieBannerProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            "fixed bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 z-50 w-full sm:max-w-md",
            className
          )}
        >
          <div className="m-3 bg-[#0E1015]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white">
            <div className="flex items-center gap-3 p-6 pb-3">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <CookieIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Gestion des cookies & vie privée</h2>
                <span className="text-[11px] text-white/50">Conformité RGPD & CNIL</span>
              </div>
            </div>
            <div className="px-6 pb-4">
              <p className="text-xs text-white/70 leading-relaxed mb-3">
                Nous utilisons des cookies essentiels pour garantir la sécurité et le bon fonctionnement de notre standard téléphonique IA, ainsi que des mesures d&apos;audience anonymes.
              </p>
              <Link
                href={cookiePolicyUrl}
                className="text-xs inline-flex items-center text-white/90 hover:text-white underline underline-offset-4 group font-medium transition-colors"
              >
                Consulter notre politique relative aux cookies
                <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="p-4 flex flex-col sm:flex-row gap-2.5 border-t border-white/10 bg-white/[0.02] rounded-b-2xl">
              <Button
                onClick={onAcceptAll}
                size="sm"
                className="w-full sm:flex-1 h-9 rounded-xl text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer"
              >
                Tout accepter
              </Button>
              <Button
                onClick={onCustomize}
                size="sm"
                variant="outline"
                className="w-full sm:flex-1 h-9 rounded-xl text-xs font-medium border-white/15 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                Personnaliser
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface CookieCustomizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CookieCategory[];
  preferences: boolean[];
  onToggle: (index: number, checked: boolean) => void;
  onSave: () => void;
  onRejectAll: () => void;
}

function CookieCustomizeDialog({
  open,
  onOpenChange,
  categories,
  preferences,
  onToggle,
  onSave,
  onRejectAll,
}: CookieCustomizeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0E1015]/95 backdrop-blur-2xl z-[200] sm:max-w-[520px] p-0 gap-0 border-white/10 shadow-2xl text-white rounded-3xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-white/10 text-left">
          <DialogTitle className="text-lg font-bold text-white tracking-tight">Préférences de confidentialité</DialogTitle>
          <DialogDescription className="text-xs text-white/60 mt-1">
            Personnalisez vos préférences de cookies ci-dessous selon vos souhaits.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-5 space-y-3.5 max-h-[calc(100vh-260px)] overflow-y-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={cn(
                "p-4 border rounded-2xl transition-all duration-200",
                preferences[index] 
                  ? "border-white/20 bg-white/[0.04] shadow-xs" 
                  : "border-white/10 bg-white/[0.01] hover:border-white/15"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    preferences[index] ? "bg-white/10 text-white" : "bg-white/5 text-white/60"
                  )}>
                    {category.icon || <CookieIcon className="h-4 w-4" />}
                  </div>
                  <Label
                    htmlFor={`cookie-${index}`}
                    className="font-semibold text-sm cursor-pointer text-white flex items-center flex-wrap gap-2"
                  >
                    <span>{category.name}</span>
                    {category.isEssential && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white/90 border border-white/10">
                              Obligatoire
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-neutral-900 text-white border-white/20 text-xs">
                            <p>Ces cookies sont indispensables au bon fonctionnement du site et ne peuvent pas être désactivés.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Label>
                </div>
                <Switch
                  id={`cookie-${index}`}
                  checked={preferences[index] || false}
                  onCheckedChange={(checked) => onToggle(index, checked)}
                  disabled={category.isEssential}
                  className="data-[state=checked]:bg-white data-[state=unchecked]:bg-neutral-700"
                />
              </div>
              <p className="text-xs mt-2.5 text-white/60 leading-relaxed">
                {category.description}
              </p>
            </motion.div>
          ))}
        </div>
        <DialogFooter className="p-5 border-t border-white/10 bg-white/[0.02]">
          <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
            <Button 
              variant="outline" 
              onClick={onRejectAll} 
              className="min-w-[120px] h-9 rounded-xl text-xs border-white/15 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Tout refuser
            </Button>
            <Button 
              onClick={onSave} 
              className="min-w-[140px] h-9 rounded-xl text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer"
            >
              Enregistrer mes choix
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --------------------------------
// Exports
// --------------------------------

export { CookieConsent };
export type { CookieCategory, CookieConsentProps, CookiePreferences };
