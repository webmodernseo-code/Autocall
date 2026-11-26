"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("root@autocall.fr");
  const [password, setPassword] = useState("AutoCallRoot2026!");
  const [totpCode, setTotpCode] = useState("482 910");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/super-admin");
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
          <circle cx="600" cy="600" r="220" fill="none" stroke="#E5EAE8" strokeWidth="1" />
          <circle cx="600" cy="600" r="320" fill="none" stroke="#E5EAE8" strokeWidth="1" />
          <circle cx="600" cy="600" r="430" fill="none" stroke="#E5EAE8" strokeWidth="1" />
          <circle cx="600" cy="600" r="550" fill="none" stroke="#E5EAE8" strokeWidth="1" />

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
            viewBox="0 0 64 64"
            className="size-7 text-[#171717]"
            fill="currentColor"
          >
            <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
          </svg>
          <span>AutoCall</span>
        </Link>

        <div className="flex items-center gap-2.5 text-[14px]">
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-4 text-[13.5px] font-medium text-[#171717] shadow-2xs transition hover:bg-[#F8F8F8]"
          >
            Espace Client →
          </Link>
        </div>
      </header>

      {/* Carte centrale d'authentification Super Admin */}
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
              viewBox="0 0 64 64"
              className="autocall-mark-spin size-7"
              fill="currentColor"
            >
              <path d="M49 49V30A18 18 0 1 0 31 48V37A7 7 0 1 1 38 30V41Q38 48 49 49Z" />
            </svg>
          </div>
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#B8E6D6] bg-[#E6F5F0] px-3 py-0.5 font-mono text-[11.5px] font-semibold text-[#00775B]">
          <span className="size-1.5 rounded-full bg-[#008F6D]" />
          CONSOLE D’ADMINISTRATION SYSTÈME
        </span>

        <h1 className="mt-3 text-center text-[24px] leading-[32px] font-semibold tracking-tight text-[#171717]">
          Accès Super Admin
        </h1>
        <p className="mt-1 text-center text-[13.5px] text-[#525252]">
          Authentification privilégiée réservée aux opérateurs AutoCall.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 w-full space-y-3">
          <div>
            <label className="mb-1 block text-[12.5px] font-medium text-[#525252]">
              Identifiant opérateur
            </label>
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
                placeholder="root@autocall.fr"
                className="h-10.5 w-full rounded-[8px] border border-[#E5E5E5] bg-white pr-3.5 pl-10 text-[14px] text-[#171717] placeholder:text-[#8C8C8C] shadow-2xs outline-none transition focus:border-[#008F6D]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[12.5px] font-medium text-[#525252]">
              Mot de passe maître
            </label>
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
                className="h-10.5 w-full rounded-[8px] border border-[#E5E5E5] bg-white pr-10 pl-10 text-[14px] text-[#171717] placeholder:text-[#8C8C8C] shadow-2xs outline-none transition focus:border-[#008F6D]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Masquer" : "Afficher"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#737373] transition hover:text-[#171717] cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                  <circle cx="12" cy="12" r="2.5" />
                  {showPassword && <path d="M4 4l16 16" strokeLinecap="round" />}
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[12.5px] font-medium text-[#525252]">
              Code de sécurité 2FA (TOTP / YubiKey)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#737373]">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M12 3 5 6v6c0 4.5 3 8.2 7 9 4-.8 7-4.5 7-9V6l-7-3Z" strokeLinejoin="round" />
                </svg>
              </span>
              <input
                type="text"
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="000 000"
                className="h-10.5 w-full rounded-[8px] border border-[#E5E5E5] bg-white pr-3.5 pl-10 font-mono text-[14px] tracking-wider text-[#171717] placeholder:text-[#8C8C8C] shadow-2xs outline-none transition focus:border-[#008F6D]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#008F6D] text-[14px] font-semibold text-white transition hover:bg-[#00775B] cursor-pointer"
          >
            <span>Ouvrir la console Super Admin</span>
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-[#737373]">
          <svg viewBox="0 0 24 24" className="size-3.5 text-[#008F6D]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" strokeLinecap="round" />
          </svg>
          Accès journalisé (Audit Trail IP &amp; Session 2FA obligatoire)
        </p>
      </main>

      {/* Pied de page */}
      <footer className="relative z-10 flex flex-col items-center justify-between gap-2 px-6 py-5 text-[12.5px] text-[#737373] sm:flex-row sm:px-10">
        <span>AutoCall Core Infrastructure · EU-West-1</span>
        <div className="flex items-center gap-5">
          <Link href="/security" className="hover:text-[#171717]">
            Sécurité
          </Link>
          <Link href="/super-admin" className="hover:text-[#171717]">
            Accès direct démo
          </Link>
        </div>
      </footer>
    </div>
  );
}

