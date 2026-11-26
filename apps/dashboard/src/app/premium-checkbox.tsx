"use client";

export function PremiumCheckbox({
  checked,
  onChange,
  ariaLabel,
  id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008F6D] cursor-pointer ${
        checked
          ? "border-[#008F6D] bg-[#008F6D] text-white shadow-[0_1px_2px_rgba(0,143,109,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-[#00775B] hover:border-[#00775B]"
          : "border-[#CBD5E1] bg-white text-transparent shadow-[0_1px_2px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-[#94A3B8]"
      }`}
    >
      <svg
        viewBox="0 0 16 16"
        className={`size-3 transition-transform duration-150 ${
          checked ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        aria-hidden="true"
      >
        <path
          d="M3.5 8.5 6.5 11.5 12.5 4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

