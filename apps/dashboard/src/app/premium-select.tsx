"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export function PremiumSelect({
  id,
  value,
  options,
  onChange,
  ariaLabel,
  className = "",
}: {
  id?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const activeIndex = Math.min(highlight, Math.max(0, options.length - 1));

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("pointerdown", handleOutside);
      return () => {
        document.removeEventListener("pointerdown", handleOutside);
      };
    }
  }, [open]);
  useEffect(() => {
    if (open) document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listId, open]);

  const choose = (option: SelectOption) => {
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setHighlight(open ? Math.max(0, Math.min(options.length - 1, activeIndex + (event.key === "ArrowDown" ? 1 : -1))) : selectedIndex);
      return;
    }
    if (open && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      setHighlight(event.key === "Home" ? 0 : options.length - 1);
      return;
    }
    if (open && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      if (options[activeIndex]) choose(options[activeIndex]);
    }
  };

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        id={id}
        ref={triggerRef}
        type="button"
        role="combobox"
        disabled={!options.length}
        onClick={() => { setHighlight(selectedIndex); setOpen(!open); }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        className={`flex h-[38px] w-full items-center justify-between gap-2 rounded-xl border bg-[var(--surface)] px-3 text-[13.5px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] cursor-pointer ${
          open ? "border-[var(--focus-ring)]" : "border-[var(--border)]"
        }`}
      >
        <span className="truncate">{current?.label ?? value}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={`size-3.5 shrink-0 text-[var(--text-muted)] transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 z-40 mt-1.5 max-h-64 min-w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[0_8px_24px_rgba(23,23,23,0.08)]"
        >
          {options.map((opt, index) => {
            const selected = opt.value === value;
            return (
              <button
                key={opt.value}
                id={`${listId}-${index}`}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={selected}
                onClick={() => choose(opt)}
                className={`flex h-8.5 w-full items-center justify-between gap-2 rounded-[6px] px-2.5 text-left text-[13.5px] transition-colors cursor-pointer ${
                  selected
                    ? "bg-[var(--surface-selected)] font-medium text-[var(--foreground)]"
                    : index === activeIndex
                      ? "bg-[var(--surface-hover)] text-[var(--foreground)]"
                      : "font-normal text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {selected && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="size-3.5 shrink-0 text-[var(--brand-primary)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3.5 8.5l3 3 6-6.5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

