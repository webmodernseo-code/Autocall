"use client";

import { useState } from "react";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const TYPES = [
  { name: "Appel de découverte", duration: 15, channel: "Téléphone" },
  { name: "Présentation commerciale", duration: 30, channel: "Visioconférence" },
  { name: "Rendez-vous client", duration: 60, channel: "Présentiel" },
  { name: "Suivi commercial", duration: 20, channel: "Téléphone" },
];
const APPOINTMENTS = [
  { day: 0, time: "09:00", title: "Découverte commerciale", contact: "Sophie Martin", source: "Emma · Agent IA" },
  { day: 0, time: "14:00", title: "Suivi client", contact: "Marc Dubois", source: "Manuel" },
  { day: 1, time: "11:00", title: "Présentation des services", contact: "Thomas Bernard", source: "Alex · Agent IA" },
  { day: 2, time: "10:00", title: "Qualification", contact: "Laura Petit", source: "Emma · Agent IA" },
  { day: 2, time: "14:00", title: "Proposition commerciale", contact: "Nova Services", source: "Manuel" },
  { day: 3, time: "09:00", title: "Rendez-vous client", contact: "Studio Horizon", source: "Alex · Agent IA" },
  { day: 4, time: "11:00", title: "Découverte", contact: "Optima Solutions", source: "Emma · Agent IA" },
];

const VIEWS = ["Agenda", "Disponibilités", "Types de rendez-vous", "Aperçu de réservation"] as const;
const fieldStyle = "rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2";

export function CrmAppointments() {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Agenda");
  const [day, setDay] = useState("all");
  const [days, setDays] = useState(DAYS.slice(0, 5));
  const [opening, setOpening] = useState("09:00");
  const [closing, setClosing] = useState("18:00");
  const [buffer, setBuffer] = useState(15);
  const [bookingDay, setBookingDay] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [previewConfirmed, setPreviewConfirmed] = useState(false);
  const validHours = opening !== "" && closing !== "" && opening < closing;
  const entries = APPOINTMENTS.filter((entry) => day === "all" || String(entry.day) === day);
  const selectedDay = days.includes(bookingDay) ? bookingDay : days[0] ?? "";
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const slots = validHours && selectedDay ? ["09:00", "10:30", "11:00", "14:00", "15:30", "16:00"].filter((time) => {
    const start = toMinutes(time);
    const end = start + TYPES[1].duration;
    return start >= toMinutes(opening) && end <= toMinutes(closing) &&
      APPOINTMENTS.every((entry) => DAYS[entry.day] !== selectedDay ||
        start >= toMinutes(entry.time) + 30 + buffer || end + buffer <= toMinutes(entry.time));
  }) : [];

  return (
    <section className="mt-4 space-y-4" aria-label="Rendez-vous commerciaux">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Vues des rendez-vous">
        {VIEWS.map((item) => (
          <button type="button" key={item} aria-pressed={view === item} onClick={() => setView(item)}
            className={`${fieldStyle} text-sm ${view === item ? "font-semibold ring-1 ring-[var(--primary)]" : ""}`}>
            {item}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        {view === "Agenda" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">Agenda commercial</h3>
                <p className="text-sm text-[var(--text-muted)]">23–29 novembre 2026 · Europe/Paris · Démonstration</p>
              </div>
              <select className={fieldStyle} aria-label="Filtrer les rendez-vous par jour" value={day} onChange={(event) => setDay(event.target.value)}>
                <option value="all">Toute la semaine</option>
                {DAYS.map((name, index) => <option key={name} value={index}>{name}</option>)}
              </select>
            </div>
            <ul className="mt-4 divide-y divide-[var(--border)]">
              {entries.map((entry) => (
                <li key={entry.title} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <div>
                    <p className="font-semibold">{entry.title}</p>
                    <p className="text-[var(--text-muted)]">{entry.contact} · {DAYS[entry.day]} à {entry.time}</p>
                  </div>
                  <p>{entry.source} · <span className="text-[var(--success)]">Confirmé</span></p>
                </li>
              ))}
            </ul>
            {entries.length === 0 && <p className="mt-4 text-sm">Aucun rendez-vous ce jour-là.</p>}
          </>
        )}

        {view === "Disponibilités" && (
          <div className="space-y-4 text-sm">
            <h3 className="text-base font-semibold">Disponibilités de démonstration</h3>
            <fieldset className="flex flex-wrap gap-3">
              <legend className="mb-2 font-medium">Jours ouverts</legend>
              {DAYS.map((name) => (
                <label key={name} className="flex items-center gap-2">
                  <input type="checkbox" checked={days.includes(name)} onChange={(event) => {
                    setDays(event.target.checked ? DAYS.filter((day) => day === name || days.includes(day)) : days.filter((day) => day !== name));
                    setPreviewConfirmed(false);
                  }} /> {name}
                </label>
              ))}
            </fieldset>
            <div className="flex flex-wrap gap-3">
              <label className="grid gap-1">Ouverture <input className={fieldStyle} type="time" value={opening} onChange={(event) => { setOpening(event.target.value); setPreviewConfirmed(false); }} /></label>
              <label className="grid gap-1">Fermeture <input className={fieldStyle} type="time" value={closing} onChange={(event) => { setClosing(event.target.value); setPreviewConfirmed(false); }} /></label>
              <label className="grid gap-1">Battement entre rendez-vous <select className={fieldStyle} value={buffer} onChange={(event) => { setBuffer(Number(event.target.value)); setPreviewConfirmed(false); }}>
                {[0, 5, 10, 15, 30].map((minutes) => <option key={minutes} value={minutes}>{minutes} min</option>)}
              </select></label>
            </div>
            {!validHours && <p role="alert">Choisissez une heure de fermeture après l’ouverture.</p>}
            <p className="text-[var(--text-muted)]">Europe/Paris · Ces paramètres alimentent l’aperçu pendant la session.</p>
          </div>
        )}

        {view === "Types de rendez-vous" && (
          <>
            <h3 className="font-semibold">Types de rendez-vous</h3>
            <ul className="mt-3 divide-y divide-[var(--border)] text-sm">
              {TYPES.map((type) => <li className="flex flex-wrap justify-between gap-2 py-3" key={type.name}>
                <span className="font-medium">{type.name}</span>
                <span>{type.duration} min · {type.channel}</span>
              </li>)}
            </ul>
          </>
        )}

        {view === "Aperçu de réservation" && (
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-base font-semibold">Présentation commerciale</h3>
              <p className="text-[var(--text-muted)]">30 min · Visioconférence · Europe/Paris · Réservation simulée</p>
            </div>
            <label className="grid w-fit gap-1">Jour <select className={fieldStyle} value={selectedDay} onChange={(event) => { setBookingDay(event.target.value); setBookingTime(""); setPreviewConfirmed(false); }}>
              {days.length === 0 && <option value="">Aucun jour ouvert</option>}
              {days.map((name) => <option key={name}>{name}</option>)}
            </select></label>
            <div role="group" aria-label="Créneaux disponibles" className="flex flex-wrap gap-2">
              {slots.map((time) => <button type="button" key={time} aria-pressed={bookingTime === time} className={`${fieldStyle} ${bookingTime === time ? "ring-1 ring-[var(--primary)]" : ""}`} onClick={() => { setBookingTime(time); setPreviewConfirmed(false); }}>{time}</button>)}
              {slots.length === 0 && <p>Aucun créneau disponible.</p>}
            </div>
            <button type="button" className="rounded-lg bg-[var(--primary)] px-3 py-2 text-[var(--primary-foreground)] disabled:opacity-50" disabled={!slots.includes(bookingTime)} onClick={() => setPreviewConfirmed(true)}>Simuler la réservation</button>
            {previewConfirmed && <p role="status">Aperçu confirmé pour {selectedDay.toLowerCase()} à {bookingTime}.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
