"use client";

import { useState } from "react";
import { PremiumCheckbox } from "./premium-checkbox";
import { PremiumSelect } from "./premium-select";

const field = "rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2";
const primary = "rounded-lg bg-[var(--primary)] px-3 py-2 text-[var(--primary-foreground)] disabled:opacity-50";
const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const connectionMethods = {
  "Nouveau numéro": "Attribuer un numéro professionnel à ce standard.",
  "Renvoi d’appels": "Conserver votre numéro et rediriger ses appels vers le standard.",
  Portage: "Transférer votre numéro existant au fournisseur téléphonique.",
  "Connexion SIP": "Relier votre standard téléphonique au fournisseur via SIP.",
};
const dialLetters: Record<string, string> = { "2": "ABC", "3": "DEF", "4": "GHI", "5": "JKL", "6": "MNO", "7": "PQRS", "8": "TUV", "9": "WXYZ" };
const tones = {
  Professionnel: "Bonjour,\n\nJe reviens vers vous à la suite de notre échange. Je reste à votre disposition pour organiser une présentation.\n\nBien cordialement,",
  Chaleureux: "Bonjour,\n\nMerci pour notre échange ! Je serais ravi de vous présenter nos services et de répondre à vos questions.\n\nÀ bientôt,",
  Direct: "Bonjour,\n\nSeriez-vous disponible cette semaine pour échanger sur vos besoins ?\n\nMerci,",
};

export function PhoneTools({ timezone = "Europe/Paris" }: { timezone?: string }) {
  const [number, setNumber] = useState("");
  const [calling, setCalling] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState<keyof typeof connectionMethods>("Nouveau numéro");
  const [route, setRoute] = useState("human");
  const [delay, setDelay] = useState(20);
  const [opening, setOpening] = useState("09:00");
  const [closing, setClosing] = useState("18:00");
  const [fallback, setFallback] = useState("Agent IA");
  const [openDays, setOpenDays] = useState(days.slice(0, 5));
  const [testDay, setTestDay] = useState(days[0]);
  const [testTime, setTestTime] = useState("10:00");
  const [scenario, setScenario] = useState("");
  const canDial = /^\+?[\d ()-]+$/.test(number) && number.replace(/\D/g, "").length >= 3;
  const validHours = Boolean(opening && closing && opening < closing);
  const validDelay = route !== "human" || (Number.isInteger(delay) && delay >= 5 && delay <= 120);
  const simulateRouting = (day: string, time: string) => {
    if (!validHours || !time || !validDelay) return;
    const duringOpening = openDays.includes(day) && time >= opening && time < closing;
    const destination = !duringOpening
      ? `Hors horaires → ${fallback}.`
      : route === "ai"
        ? "Pendant l’ouverture → l’agent IA répond en premier."
        : `Pendant l’ouverture → l’équipe sonne en premier, puis l’agent IA prend le relais après ${delay} s sans réponse.`;
    setScenario(`${day} à ${time} · ${timezone} · ${destination}`);
  };
  return (
    <details className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
      <summary className="w-fit cursor-pointer rounded-full bg-[#E6EFF5] px-4 py-2 font-semibold text-[#28475D]">Composer un numéro · Démo</summary>
      <div className="mt-4 grid gap-6 xl:grid-cols-2">
        <section className="grid justify-items-center gap-4 rounded-2xl bg-[#F2F7FA] p-5 text-[#28475D]">
          <h3 className="font-semibold">Clavier téléphonique</h3>
          <label className="grid w-full max-w-xs gap-1 text-center"><span className="sr-only">Numéro à composer</span><input className="min-w-0 rounded-xl border border-[#CFDDE6] bg-white px-3 py-3 text-center text-xl tabular-nums" type="tel" placeholder="Numéro" value={number} disabled={calling} onChange={(event) => setNumber(event.target.value)} /></label>
          <div className="grid w-full max-w-[15rem] grid-cols-3 justify-items-center gap-3" role="group" aria-label="Clavier téléphonique">
            {"123456789*0#".split("").map((key) => <button type="button" className="flex size-12 flex-col items-center justify-center rounded-full bg-white shadow-sm hover:bg-[#DDECF3] disabled:opacity-50 sm:size-14" disabled={calling} key={key} aria-label={key} onClick={() => setNumber((current) => current + key)}><span className="text-lg leading-5">{key}</span>{dialLetters[key] && <span aria-hidden="true" className="text-[9px] tracking-wider">{dialLetters[key]}</span>}</button>)}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className={`rounded-full px-4 py-2 text-white disabled:opacity-50 ${calling ? "bg-[#A94141]" : "bg-[#18715D]"}`} disabled={!calling && !canDial} onClick={() => setCalling(!calling)}>{calling ? "Raccrocher" : "Simuler l’appel"}</button>
            <button type="button" className="rounded-full bg-white px-3 py-2 disabled:opacity-50" disabled={calling || !number} onClick={() => setNumber((current) => current.slice(0, -1))}>Effacer un chiffre</button>
          </div>
          {calling && <p role="status">Appel simulé vers {number}.</p>}
        </section>
        <section className="space-y-3">
          <h3 className="font-semibold">Routage et horaires</h3>
          <div className="grid gap-1">
            <span>Connexion du numéro (aperçu)</span>
            <PremiumSelect ariaLabel="Connexion du numéro" value={connectionMethod} onChange={(value) => setConnectionMethod(value as keyof typeof connectionMethods)} options={Object.keys(connectionMethods).map((value) => ({ value, label: value }))} />
            <p className="text-sm text-[var(--text-muted)]">{connectionMethods[connectionMethod]}</p>
          </div>
          <div className="grid gap-1">
            <span>Stratégie de réception</span>
            <PremiumSelect ariaLabel="Stratégie de réception" value={route} onChange={(value) => { setRoute(value); setScenario(""); }} options={[{ value: "human", label: "Équipe en premier" }, { value: "ai", label: "Agent IA en premier" }]} />
          </div>
          {route === "human" && <label className="grid gap-1">Délai de transfert (secondes) <input className={field} type="number" min={5} max={120} value={delay} onChange={(event) => { setDelay(event.target.valueAsNumber || 0); setScenario(""); }} /></label>}
          <fieldset className="flex flex-wrap gap-2">
            <legend className="mb-2">Jours d’ouverture · {timezone}</legend>
            {days.map((day) => (
              <label key={day} className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5">
                <PremiumCheckbox checked={openDays.includes(day)} ariaLabel={day} onChange={(checked) => {
                  setOpenDays((previous) => checked ? [...previous, day] : previous.filter((item) => item !== day));
                  setScenario("");
                }} />
                {day}
              </label>
            ))}
          </fieldset>
          <div className="flex flex-wrap gap-3">
            <label className="grid gap-1">Ouverture <input className={field} type="time" value={opening} onChange={(event) => { setOpening(event.target.value); setScenario(""); }} /></label>
            <label className="grid gap-1">Fermeture <input className={field} type="time" value={closing} onChange={(event) => { setClosing(event.target.value); setScenario(""); }} /></label>
          </div>
          <div className="grid gap-1">
            <span>Hors horaires</span>
            <PremiumSelect ariaLabel="Hors horaires" value={fallback} onChange={(value) => { setFallback(value); setScenario(""); }} options={["Agent IA", "Messagerie vocale"].map((value) => ({ value, label: value }))} />
          </div>
          <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3">
            <h4 className="font-semibold">Simuler un appel entrant</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1">
                <span>Jour du test</span>
                <PremiumSelect ariaLabel="Jour du test" value={testDay} onChange={(value) => { setTestDay(value); setScenario(""); }} options={days.map((day) => ({ value: day, label: day }))} />
              </div>
              <label className="grid gap-1">Heure du test<input className={field} type="time" value={testTime} onChange={(event) => { setTestTime(event.target.value); setScenario(""); }} /></label>
            </div>
            {!validHours && <p role="alert">L’heure de fermeture doit être après l’heure d’ouverture.</p>}
            {!validDelay && <p role="alert">Le délai de transfert doit être compris entre 5 et 120 secondes.</p>}
            {openDays.length === 0 && <p>Tous les appels simulés suivent le routage hors horaires.</p>}
            <div className="flex flex-wrap gap-2">
              <button type="button" className={primary} disabled={!validHours || !validDelay || !testTime} onClick={() => simulateRouting(testDay, testTime)}>Tester ce créneau</button>
              <button type="button" className={field + " disabled:opacity-50"} disabled={!validHours || !validDelay || openDays.length === 0} onClick={() => simulateRouting(days.find((day) => openDays.includes(day)) ?? testDay, opening)}>Tester pendant l’ouverture</button>
              <button type="button" className={field + " disabled:opacity-50"} disabled={!validHours || !validDelay} onClick={() => simulateRouting(testDay, closing)}>Tester hors horaires</button>
            </div>
            {scenario && <p role="status" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">{scenario}</p>}
          </div>
        </section>
      </div>
    </details>
  );
}

export function EmailTools({ provider }: { provider: "Gmail" | "Outlook" }) {
  const [tone, setTone] = useState<keyof typeof tones>("Professionnel");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [drafts, setDrafts] = useState<{ to: string; subject: string; body: string }[]>([]);
  const [activeDraft, setActiveDraft] = useState<number | null>(null);
  return (
    <details className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
      <summary className="w-fit cursor-pointer rounded-xl bg-[#E8EDF9] px-4 py-2.5 font-semibold text-[#35436D]">Nouveau message et brouillons</summary>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <section>
          <h3 className="font-semibold">{provider} · Démonstration</h3>
          <p className="mt-2 text-[var(--text-secondary)]">Les brouillons de cette boîte sont disponibles pendant la session.</p>
          <h3 className="mt-4 font-semibold">Brouillons de la session</h3>
          {drafts.length === 0 && <p className="mt-2 text-[var(--text-muted)]">Aucun brouillon.</p>}
          <ul className="mt-2 space-y-2">{drafts.map((draft, index) => <li key={index}><button type="button" className="text-left underline" onClick={() => { setTo(draft.to); setSubject(draft.subject); setBody(draft.body); setActiveDraft(index); }}>{draft.subject || "Sans objet"}</button></li>)}</ul>
        </section>
        <form className="grid gap-3 rounded-xl border border-[#E1E6F1] bg-[#F8F9FD] p-4" onSubmit={(event) => {
          event.preventDefault();
          const draft = { to, subject: subject.trim(), body: body.trim() };
          setDrafts((previous) => activeDraft === null ? [...previous, draft] : previous.map((item, index) => index === activeDraft ? draft : item));
          setTo(""); setSubject(""); setBody(""); setActiveDraft(null);
        }}>
          <h3 className="border-b border-[#E1E6F1] pb-3 font-semibold text-[#35436D]">{activeDraft === null ? "Nouveau message" : "Modifier le brouillon"}</h3>
          <label className="grid gap-1">Destinataire <input type="email" className={field} value={to} onChange={(event) => setTo(event.target.value)} /></label>
          <label className="grid gap-1">Objet <input className={field} value={subject} onChange={(event) => setSubject(event.target.value)} /></label>
          <label className="grid gap-1">Message <textarea rows={5} className={field} value={body} onChange={(event) => setBody(event.target.value)} /></label>
          <label className="grid gap-1">Ton de l’exemple <select className={field} value={tone} onChange={(event) => setTone(event.target.value as keyof typeof tones)}>{Object.keys(tones).map((value) => <option key={value}>{value}</option>)}</select></label>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={field} onClick={() => setBody((previous) => previous.trim() ? previous + "\n\n" + tones[tone] : tones[tone])}>Insérer un exemple</button>
            <button type="submit" className={primary} disabled={!subject.trim() && !body.trim()}>Enregistrer le brouillon</button>
          </div>
        </form>
      </div>
    </details>
  );
}

const templates = [
  { name: "Confirmation de rendez-vous", status: "Approuvé (démo)", text: "Bonjour {{prenom}}, nous vous confirmons votre rendez-vous le {{date}} à {{heure}}." },
  { name: "Rappel de rendez-vous", status: "Approuvé (démo)", text: "Bonjour {{prenom}}, votre rendez-vous est prévu le {{date}} à {{heure}}." },
  { name: "Suivi commercial", status: "En validation (démo)", text: "Bonjour {{prenom}}, souhaitez-vous échanger sur notre proposition ?" },
];
const voiceNoteAnalysis = {
  Résumé: "Thomas souhaite une proposition pour améliorer la gestion des appels entrants de son agence.",
  Transcription: "Bonjour, nous cherchons une solution pour mieux gérer les appels entrants. Seriez-vous disponible la semaine prochaine ?",
  Traduction: "Hello, we’re looking for a way to manage incoming calls more effectively. Would you be available next week?",
  Actions: "Qualifier le besoin et proposer un rendez-vous après vérification des disponibilités.",
};
const analysisOptions = ["Résumé", "Transcription", "Traduction", "Actions"] as const;

export function WhatsAppTools() {
  const [analysis, setAnalysis] = useState<(typeof analysisOptions)[number]>("Résumé");
  const [template, setTemplate] = useState(0);
  return (
    <details className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
      <summary className="cursor-pointer font-semibold">Notes vocales et modèles WhatsApp · Démo</summary>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h3 className="font-semibold">Note vocale illustrative · 42 s</h3>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Analyse de la note vocale">
            {analysisOptions.map((option) => <button key={option} type="button" className={field} aria-pressed={analysis === option} onClick={() => setAnalysis(option)}>{option}</button>)}
          </div>
          <p>{voiceNoteAnalysis[analysis]}</p>
        </section>
        <section className="space-y-3">
          <h3 className="font-semibold">Modèles de messages</h3>
          <label className="grid gap-1">Choisir un modèle <select className={field} value={template} onChange={(event) => setTemplate(Number(event.target.value))}>{templates.map((item, index) => <option value={index} key={item.name}>{item.name}</option>)}</select></label>
          <p className="text-[var(--text-muted)]">Français · {templates[template].status}</p>
          <blockquote className="rounded-lg bg-[var(--surface-inset)] p-3">{templates[template].text}</blockquote>
        </section>
      </div>
    </details>
  );
}
