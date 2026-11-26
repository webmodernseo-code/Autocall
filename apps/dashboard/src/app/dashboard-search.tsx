"use client";

import { useEffect, useId, useRef, useState } from "react";
import { type NavIconName, SolarIcon } from "./workspace-navigation";

export type DashboardSearchItem = { id: string; label: string; detail?: string; icon: NavIconName };

const normalize = (value: string) => value.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export function DashboardSearch({ label, empty, items, onSelect }: {
  label: string;
  empty: string;
  items: DashboardSearchItem[];
  onSelect: (id: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const resultsId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const matches = items.filter((item) => normalize(item.label + " " + (item.detail ?? "")).includes(normalize(query)));
  const active = Math.min(index, Math.max(0, matches.length - 1));
  const show = () => {
    if (dialog.current?.open) return;
    dialog.current?.showModal();
    setOpen(true);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (open) document.getElementById(`${resultsId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, resultsId, active]);

  const pick = (item?: DashboardSearchItem) => {
    if (!item) return;
    dialog.current?.close();
    onSelect(item.id);
  };

  return (
    <>
      <button ref={trigger} type="button" aria-haspopup="dialog" aria-expanded={open} aria-label={label} onClick={show} className="inline-flex h-9 min-w-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] sm:min-w-40">
        <SolarIcon name="search" className="size-4 shrink-0" />
        <span className="hidden sm:inline">{label}</span>
      </button>
      <dialog ref={dialog} onClose={() => { setOpen(false); setQuery(""); setIndex(0); trigger.current?.focus({ preventScroll: true }); }} aria-label={label} className="fixed inset-0 m-auto w-[32rem] max-w-[calc(100%_-_2rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--foreground)] shadow-xl backdrop:bg-black/40">
        <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); pick(matches[active]); }}>
          <input autoFocus type="search" value={query} className="min-w-0 flex-1 rounded-lg border border-[var(--border-control)] px-3 py-2 text-base sm:text-sm" placeholder={label} aria-label={label} role="combobox" aria-expanded={open} aria-controls={resultsId} aria-activedescendant={matches[active] ? `${resultsId}-${active}` : undefined}
            onChange={(event) => { setQuery(event.target.value); setIndex(0); }}
            onKeyDown={(event) => {
              if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
              event.preventDefault();
              setIndex(Math.max(0, Math.min(matches.length - 1, active + (event.key === "ArrowDown" ? 1 : -1))));
            }} />
          <button type="button" aria-label="Fermer" onClick={() => dialog.current?.close()} className="min-w-10 rounded-lg border border-[var(--border)]">×</button>
        </form>
        <ul id={resultsId} role="listbox" aria-label={label} className="mt-3 max-h-64 overflow-y-auto">
          {matches.map((item, position) => <li key={item.id} role="presentation"><button type="button" id={`${resultsId}-${position}`} role="option" aria-selected={position === active} onClick={() => pick(item)} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)] aria-selected:bg-[var(--surface-selected)]"><SolarIcon name={item.icon} className="size-4 shrink-0" /><span>{item.label}{item.detail && <small className="block text-[var(--text-muted)]">{item.detail}</small>}</span></button></li>)}
        </ul>
        {!matches.length && <p role="status" className="px-3 py-2 text-sm text-[var(--text-muted)]">{empty}</p>}
      </dialog>
    </>
  );
}
