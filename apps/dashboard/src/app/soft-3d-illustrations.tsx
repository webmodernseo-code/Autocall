"use client";

export function Soft3dHeadset({ className = "size-20" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={className}
    >
      <defs>
        <linearGradient id="s3d-band" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E5E7EB" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <radialGradient id="s3d-cup" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#E2E4E8" />
          <stop offset="100%" stopColor="#B8BDC7" />
        </radialGradient>
        <filter id="s3d-shadow-h" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#171717" floodOpacity="0.12" />
        </filter>
      </defs>
      <g filter="url(#s3d-shadow-h)">
        {/* Arceau */}
        <path
          d="M28 62c0-21 14-36 32-36s32 15 32 36"
          fill="none"
          stroke="url(#s3d-band)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* Écouteur gauche */}
        <rect x="20" y="54" width="16" height="32" rx="8" fill="url(#s3d-cup)" />
        <ellipse cx="33" cy="70" rx="6" ry="13" fill="#D1D5DB" />
        {/* Écouteur droit */}
        <rect x="84" y="54" width="16" height="32" rx="8" fill="url(#s3d-cup)" />
        <ellipse cx="87" cy="70" rx="6" ry="13" fill="#D1D5DB" />
      </g>
    </svg>
  );
}

export function Soft3dCards({ className = "size-20" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={className}
    >
      <defs>
        <linearGradient id="s3d-card-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F3F5" />
        </linearGradient>
        <linearGradient id="s3d-card-edge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CBD2D9" />
          <stop offset="100%" stopColor="#9AA5B1" />
        </linearGradient>
        <filter id="s3d-shadow-c" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#171717" floodOpacity="0.12" />
        </filter>
      </defs>
      <g filter="url(#s3d-shadow-c)">
        {/* Carte inférieure (épaisseur + face) */}
        <path
          d="M22 68l38-18 38 18v6L60 92 22 74z"
          fill="url(#s3d-card-edge)"
        />
        <path
          d="M22 66l38-18 38 18-38 18z"
          fill="url(#s3d-card-top)"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        {/* Carte supérieure (épaisseur + face) */}
        <path
          d="M22 50l38-18 38 18v6L60 74 22 56z"
          fill="url(#s3d-card-edge)"
        />
        <path
          d="M22 48l38-18 38 18-38 18z"
          fill="url(#s3d-card-top)"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

export function Soft3dCalendar({ className = "size-20" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={className}
    >
      <defs>
        <linearGradient id="s3d-cal-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#ECEEF2" />
          <stop offset="100%" stopColor="#CFD5DF" />
        </linearGradient>
        <linearGradient id="s3d-cal-ring" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>
        <filter id="s3d-shadow-cal" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#171717" floodOpacity="0.12" />
        </filter>
      </defs>
      <g filter="url(#s3d-shadow-cal)">
        {/* Corps du calendrier */}
        <rect
          x="26"
          y="28"
          width="68"
          height="66"
          rx="14"
          fill="url(#s3d-cal-body)"
          stroke="#D1D5DB"
          strokeWidth="1.5"
        />
        <rect
          x="32"
          y="46"
          width="56"
          height="42"
          rx="9"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth="1"
        />
        {/* Anneaux supérieurs */}
        <rect x="41" y="20" width="8" height="16" rx="4" fill="url(#s3d-cal-ring)" />
        <rect x="71" y="20" width="8" height="16" rx="4" fill="url(#s3d-cal-ring)" />
        {/* Tuiles de dates en relief */}
        {[52, 64, 76].map((y, rIdx) =>
          [38, 54, 70].map((x, cIdx) =>
            rIdx === 2 && cIdx === 2 ? null : (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="10"
                height="8"
                rx="2.5"
                fill="#E2E8F0"
                stroke="#CBD5E1"
                strokeWidth="0.8"
              />
            ),
          ),
        )}
      </g>
    </svg>
  );
}

