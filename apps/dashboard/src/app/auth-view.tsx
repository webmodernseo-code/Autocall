"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AskAILogo } from "./ask-ai";
import { PremiumCheckbox } from "./premium-checkbox";

type AuthMode = "login" | "signup";

function GoogleLogoSvg() {
  return (
    <svg viewBox="0 0 24 24" className="size-4.5 shrink-0" aria-hidden="true">
      <path
        d="M21.8 12.23c0-.7-.06-1.4-.19-2.06H12v3.9h5.5a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.04-4.4 3.04-7.48Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.75 0 5.06-.91 6.75-2.47l-3.3-2.56c-.91.61-2.08.98-3.45.98-2.65 0-4.9-1.79-5.7-4.2H2.89v2.64A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.3 13.75a6 6 0 0 1 0-3.5V7.61H2.89a10 10 0 0 0 0 8.78l3.41-2.64Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.05c1.5 0 2.84.51 3.9 1.52l2.92-2.92C17.05 3.01 14.74 2 12 2A10 10 0 0 0 2.89 7.61l3.41 2.64c.8-2.41 3.05-4.2 5.7-4.2Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthView({ initialMode }: { initialMode: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState("Tanjim Islam");
  const [company, setCompany] = useState("AutoCall SAS");
  const [email, setEmail] = useState("tanjim@gr8rstudio.com");
  const [password, setPassword] = useState("AutoCall2025!");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [forgotNotice, setForgotNotice] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(isSignup ? "/onboarding" : "/");
  };

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#FAFBFB] text-[#171717]">
      {/* Fond orbital subtil & halo vert AutoCall */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 -right-32 size-[520px] rounded-full bg-[#00B489]/12 blur-[110px]" />
        <div className="absolute -bottom-40 -left-32 size-[460px] rounded-full bg-[#008F6D]/10 blur-[110px]" />
        <svg
          viewBox="0 0 1200 1200"
          className="absolute top-1/2 left-1/2 size-[1300px] -translate-x-1/2 -translate-y-1/2 opacity-75"
        >
          {/* Anneaux concentriques de base */}
          <circle cx="600" cy="600" r="220" fill="none" stroke="#E5EAE8" strokeWidth="1" />
          <circle cx="600" cy="600" r="320" fill="none" stroke="#E5EAE8" strokeWidth="1" />
          <circle cx="600" cy="600" r="430" fill="none" stroke="#E5EAE8" strokeWidth="1" />
          <circle cx="600" cy="600" r="550" fill="none" stroke="#E5EAE8" strokeWidth="1" />

          {/* Arcs verts animés parfaitement enroulés sur leurs cercles */}
          <g style={{ transformOrigin: "600px 600px" }} className="animate-[spin_28s_linear_infinite]">
            <circle
              cx="600"
              cy="600"
              r="220"
              fill="none"
              stroke="#00B489"
              strokeOpacity="0.45"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeDasharray="340 1050"
            />
          </g>
          <g
            style={{ transformOrigin: "600px 600px", animationDirection: "reverse" }}
            className="animate-[spin_42s_linear_infinite]"
          >
            <circle
              cx="600"
              cy="600"
              r="320"
              fill="none"
              stroke="#008F6D"
              strokeOpacity="0.38"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeDasharray="520 1500"
              transform="rotate(140 600 600)"
            />
          </g>
          <g style={{ transformOrigin: "600px 600px" }} className="animate-[spin_56s_linear_infinite]">
            <circle
              cx="600"
              cy="600"
              r="430"
              fill="none"
              stroke="#00B489"
              strokeOpacity="0.3"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="640 2070"
              transform="rotate(35 600 600)"
            />
          </g>
          <g
            style={{ transformOrigin: "600px 600px", animationDirection: "reverse" }}
            className="animate-[spin_72s_linear_infinite]"
          >
            <circle
              cx="600"
              cy="600"
              r="550"
              fill="none"
              stroke="#008F6D"
              strokeOpacity="0.24"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="780 2680"
              transform="rotate(-110 600 600)"
            />
          </g>
        </svg>
      </div>

      {/* Barre supérieure */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/landing"
          className="inline-flex items-center gap-2 text-[17px] font-bold tracking-tight text-[#171717]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 96 96"
            className="size-6 text-[#171717]"
            fill="currentColor"
          >
            <path d="M48 84 A36 36 0 1 1 84 48 L84 84 A22 22 0 0 1 62 62 L62 48 A14 14 0 1 0 48 62 Z" />
          </svg>
          <span>AutoCall</span>
        </Link>

        <div className="flex items-center gap-2.5 text-[14px]">
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#B8E6D6] bg-[#E6F5F0] px-3.5 text-[13.5px] font-medium text-[#00775B] transition hover:bg-[#D1FAE5]"
          >
            Dashboard
          </Link>
          <span className="hidden text-[#737373] sm:inline">
            {isSignup ? "Déjà un compte ?" : "Nouveau sur AutoCall ?"}
          </span>
          <button
            type="button"
            onClick={() => {
              setMode(isSignup ? "login" : "signup");
              setForgotNotice(false);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] px-4 text-[14px] font-medium text-[#171717] shadow-2xs transition hover:border-[#D4D4D4] hover:bg-[#F8F8F8] cursor-pointer"
          >
            <span>{isSignup ? "Se connecter" : "Créer un compte"}</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      {/* Carte centrale d'authentification */}
      <main className="relative z-10 mx-auto flex w-full max-w-[400px] flex-col items-center px-5 py-6">
        <div className="autocall-hub-float relative inline-flex size-12 items-center justify-center">
          <span
            aria-hidden="true"
            className="autocall-hub-ripple pointer-events-none absolute inset-0 rounded-2xl border-2 border-[#00B489]/60 bg-[#00B489]/15"
          />
          <span
            aria-hidden="true"
            className="autocall-hub-ripple-delay pointer-events-none absolute inset-0 rounded-2xl border-2 border-[#00B489]/40 bg-[#00B489]/10"
          />
          <div className="relative inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00B489] to-[#008F6D] text-[#E6F5F0] shadow-[0_10px_28px_rgba(0,143,109,0.34)]">
            <svg
              aria-hidden="true"
              viewBox="0 0 96 96"
              className="autocall-mark-spin size-7"
              fill="currentColor"
            >
              <path d="M48 84 A36 36 0 1 1 84 48 L84 84 A22 22 0 0 1 62 62 L62 48 A14 14 0 1 0 48 62 Z" />
            </svg>
          </div>
        </div>

        <h1 className="mt-5 text-center text-[26px] font-bold tracking-tight text-[#171717]">
          {isSignup ? "Créer votre compte." : "Bon retour."}
        </h1>
        <p className="mt-1.5 text-center text-[13.5px] text-[#737373]">
          {isSignup
            ? "Déployez vos agents vocaux IA et votre CRM en quelques minutes."
            : "Votre espace de travail AutoCall vous attend."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 w-full space-y-3">
          {isSignup && (
            <>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#737373]">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c1.6-3.6 4.5-5.5 8-5.5s6.4 1.9 8 5.5" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nom complet"
                  aria-label="Nom complet"
                  className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] pr-3.5 pl-10 text-[13.5px] text-[#171717] placeholder:text-[#8C8C8C] shadow-2xs outline-none transition focus:border-[#008F6D] focus:ring-3 focus:ring-[#00B489]/15"
                />
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#737373]">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M9 9h2m2 0h2M9 13h2m2 0h2M10 20v-3h4v3" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Nom de l’entreprise"
                  aria-label="Nom de l’entreprise"
                  className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] pr-3.5 pl-10 text-[13.5px] text-[#171717] placeholder:text-[#8C8C8C] shadow-2xs outline-none transition focus:border-[#008F6D] focus:ring-3 focus:ring-[#00B489]/15"
                />
              </div>
            </>
          )}

          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#737373]">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse email professionnelle"
              aria-label="Adresse email professionnelle"
              className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] pr-3.5 pl-10 text-[13.5px] text-[#171717] placeholder:text-[#8C8C8C] shadow-2xs outline-none transition focus:border-[#008F6D] focus:ring-3 focus:ring-[#00B489]/15"
            />
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#737373]">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 1 1 8 0v3" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              aria-label="Mot de passe"
              className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] pr-10 pl-10 text-[13.5px] text-[#171717] placeholder:text-[#8C8C8C] shadow-2xs outline-none transition focus:border-[#008F6D] focus:ring-3 focus:ring-[#00B489]/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8C8C8C] transition hover:text-[#171717] cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                <circle cx="12" cy="12" r="2.5" />
                {showPassword && <path d="M4 4l16 16" strokeLinecap="round" />}
              </svg>
            </button>
          </div>

          {!isSignup ? (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setForgotNotice(true)}
                className="text-[13px] font-medium text-[#525252] hover:text-[#008F6D] hover:underline cursor-pointer"
              >
                Mot de passe oublié ?
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1 text-[13px] text-[#525252]">
              <div className="flex items-start gap-2.5">
                <PremiumCheckbox
                  checked={acceptTerms}
                  onChange={setAcceptTerms}
                  ariaLabel="Accepter les conditions générales d'utilisation"
                />
                <span className="leading-snug">
                  <button
                    type="button"
                    onClick={() => setAcceptTerms((v) => !v)}
                    className="cursor-pointer"
                  >
                    J’accepte les
                  </button>{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-[#008064] underline underline-offset-2 hover:text-[#00664F]"
                  >
                    Conditions générales d’utilisation
                  </Link>
                  .
                </span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-[#6B7280]">
                Pour en savoir plus sur le traitement de vos données, consultez notre{" "}
                <Link
                  href="/privacy"
                  className="text-[#171717] underline underline-offset-2 hover:text-[#008064]"
                >
                  Politique de confidentialité
                </Link>
                .
              </p>
            </div>
          )}

          {forgotNotice && (
            <div className="rounded-xl border border-[#B8E6D6] bg-[#E6F5F0] px-3 py-2 text-[13px] text-[#00775B]">
              Un lien de réinitialisation sera envoyé à votre adresse email professionnelle.
            </div>
          )}

          <button
            type="submit"
            className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00B489] text-[13.5px] font-semibold text-white shadow-[0_6px_18px_rgba(0,180,137,0.28)] transition hover:bg-[#009E78] cursor-pointer"
          >
            <span>{isSignup ? "Créer mon compte" : "Se connecter"}</span>
            <span aria-hidden="true">→</span>
          </button>
        </form>

        {/* Séparateur */}
        <div className="my-5 flex w-full items-center gap-3 text-[13px] text-[#8C8C8C]">
          <span className="h-px flex-1 bg-[#E5E5E5]" />
          <span>ou</span>
          <span className="h-px flex-1 bg-[#E5E5E5]" />
        </div>

        {/* Google uniquement (sans Facebook) */}
        <button
          type="button"
          onClick={() => router.push(isSignup ? "/onboarding" : "/")}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] text-[13.5px] font-medium text-[#171717] shadow-2xs transition hover:border-[#D4D4D4] hover:bg-[#F8F8F8] cursor-pointer"
        >
          <GoogleLogoSvg />
          <span>Continuer avec Google</span>
        </button>

        {/* Micro-réassurance sobre */}
        <p className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-[#737373]">
          <svg viewBox="0 0 24 24" className="size-3.5 text-[#008F6D]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" strokeLinecap="round" />
          </svg>
          Connexion chiffrée SSL 256-bit · Conforme RGPD
        </p>
      </main>

      {/* Pied de page */}
      <footer className="relative z-10 flex flex-col items-center justify-between gap-2 px-6 py-5 text-[13px] text-[#737373] sm:flex-row sm:px-10">
        <span>Votre croissance automatisée commence ici.</span>
        <div className="flex items-center gap-5">
          <Link href="/terms" className="hover:text-[#171717]">
            Conditions
          </Link>
          <Link href="/privacy" className="hover:text-[#171717]">
            Confidentialité
          </Link>
        </div>
      </footer>

      {/* Logo 3D flottant en bas à droite */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-6 bottom-6 z-20 hidden sm:flex items-center justify-center rounded-full border border-[#E1E9E3] bg-white/95 p-2 shadow-[0_10px_28px_rgba(24,77,59,0.14),0_2px_8px_rgba(24,77,59,0.06)] backdrop-blur-xs"
      >
        <div className="size-12 animate-[authLogoFloat_4s_ease-in-out_infinite] drop-shadow-[2px_4px_4px_rgba(82,145,107,0.16)]">
          <AskAILogo />
        </div>
      </div>

      <style>{`
        @keyframes authLogoFloat {
          0%, 100% {
            transform: translateY(0) rotateY(-8deg);
          }
          50% {
            transform: translateY(-4px) rotateY(10deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[authLogoFloat_4s_ease-in-out_infinite\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

