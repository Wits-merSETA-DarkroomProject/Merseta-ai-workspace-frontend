import React from "react";

export interface InsigniaEmblemProps {
  code: string;
  themeId?: string | undefined;
  size?: ("xs" | "sm" | "md" | "lg" | "xl" | "2xl") | undefined;
  className?: string | undefined;
  showGlow?: boolean | undefined;
}

export const InsigniaEmblem: React.FC<InsigniaEmblemProps> = ({
  code,
  themeId = "amber-gold",
  size = "md",
  className = "",
  showGlow = false,
}) => {
  // Size dimensions map
  const sizeMap = {
    xs: { box: 20, icon: 14 },
    sm: { box: 28, icon: 18 },
    md: { box: 38, icon: 22 },
    lg: { box: 48, icon: 28 },
    xl: { box: 64, icon: 38 },
    "2xl": { box: 80, icon: 48 },
  };

  const { box } = sizeMap[size] || sizeMap.md;

  // Palette map for dynamic vector fills & gradients
  const getThemeColors = (th: string) => {
    switch (th) {
      case "emerald-teal":
        return {
          primary: "#10B981",
          secondary: "#059669",
          glow: "rgba(16, 185, 129, 0.35)",
          bg: "rgba(16, 185, 129, 0.12)",
          border: "rgba(16, 185, 129, 0.35)",
        };
      case "sapphire-cyan":
        return {
          primary: "#38BDF8",
          secondary: "#0284C7",
          glow: "rgba(56, 189, 248, 0.35)",
          bg: "rgba(56, 189, 248, 0.12)",
          border: "rgba(56, 189, 248, 0.35)",
        };
      case "amethyst-purple":
        return {
          primary: "#A855F7",
          secondary: "#7E22CE",
          glow: "rgba(168, 85, 247, 0.35)",
          bg: "rgba(168, 85, 247, 0.12)",
          border: "rgba(168, 85, 247, 0.35)",
        };
      case "ruby-crimson":
        return {
          primary: "#F43F5E",
          secondary: "#E11D48",
          glow: "rgba(244, 63, 94, 0.35)",
          bg: "rgba(244, 63, 94, 0.12)",
          border: "rgba(244, 63, 94, 0.35)",
        };
      case "slate-navy":
        return {
          primary: "#94A3B8",
          secondary: "#1D3557",
          glow: "rgba(148, 163, 184, 0.35)",
          bg: "rgba(29, 53, 87, 0.4)",
          border: "rgba(148, 163, 184, 0.35)",
        };
      case "amber-gold":
      default:
        return {
          primary: "#D4AF37",
          secondary: "#A86F1C",
          glow: "rgba(212, 175, 55, 0.35)",
          bg: "rgba(212, 175, 55, 0.12)",
          border: "rgba(212, 175, 55, 0.35)",
        };
    }
  };

  const colors = getThemeColors(themeId);
  const gradId = `insignia-grad-${code}-${themeId}`;
  const glowId = `insignia-glow-${code}-${themeId}`;

  // Unique Vector Artworks per Insignia Code (NO generic icons)
  const renderInsigniaSvg = () => {
    switch (code) {
      case "tvet-compass":
        // Precision directional azimuth compass with crosshair & quadrant ticks
        return (
          <g>
            <circle cx="24" cy="24" r="20" fill="none" stroke={colors.primary} strokeWidth="1.5" strokeDasharray="2 3" opacity="0.6" />
            <circle cx="24" cy="24" r="16" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.8" />
            {/* Compass Quadrant Marks */}
            <line x1="24" y1="4" x2="24" y2="8" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="40" x2="24" y2="44" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
            <line x1="4" y1="24" x2="8" y2="24" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="24" x2="44" y2="24" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
            {/* North-South Needle */}
            <polygon points="24,10 27,24 24,22 21,24" fill={colors.primary} />
            <polygon points="24,38 27,24 24,26 21,24" fill={colors.secondary} opacity="0.8" />
            {/* East-West Needle */}
            <polygon points="38,24 24,27 26,24 24,21" fill={colors.primary} opacity="0.85" />
            <polygon points="10,24 24,27 22,24 24,21" fill={colors.secondary} opacity="0.85" />
            {/* Center Core */}
            <circle cx="24" cy="24" r="3" fill="#FFFFFF" />
            <circle cx="24" cy="24" r="1.5" fill={colors.secondary} />
          </g>
        );

      case "energy-horizon":
        // Curved energy trajectory horizon, wind vector arc & solar radiant rays
        return (
          <g>
            <circle cx="24" cy="24" r="19" fill="none" stroke={colors.primary} strokeWidth="1.2" opacity="0.4" />
            {/* Sun crest */}
            <path d="M12,24 A12,12 0 0,1 36,24" fill="none" stroke={colors.primary} strokeWidth="2" />
            <circle cx="24" cy="24" r="6" fill={`url(#${gradId})`} />
            {/* Solar Rays */}
            <line x1="24" y1="11" x2="24" y2="7" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
            <line x1="15" y1="15" x2="12" y2="12" stroke={colors.primary} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="33" y1="15" x2="36" y2="12" stroke={colors.primary} strokeWidth="1.8" strokeLinecap="round" />
            {/* Wave Horizon Lines */}
            <path d="M6,27 Q15,22 24,27 T42,27" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
            <path d="M8,33 Q16,29 24,33 T40,33" fill="none" stroke={colors.secondary} strokeWidth="1.6" opacity="0.8" strokeLinecap="round" />
            <path d="M11,39 Q17,36 24,39 T37,39" fill="none" stroke={colors.primary} strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
          </g>
        );

      case "mechatronic-pulse":
        // Telemetry pulse wave, micro-trace circuit, silicon precision diamond
        return (
          <g>
            <rect x="8" y="8" width="32" height="32" rx="6" fill="none" stroke={colors.primary} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
            {/* Central Microprocessor Diamond */}
            <polygon points="24,12 36,24 24,36 12,24" fill={`url(#${gradId})`} stroke={colors.primary} strokeWidth="1.5" />
            {/* Telemetry Heartbeat Trace */}
            <path d="M4,24 L14,24 L18,17 L22,31 L26,19 L30,27 L34,24 L44,24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Circuit Micro-Trace Nodes */}
            <circle cx="8" cy="8" r="2" fill={colors.primary} />
            <circle cx="40" cy="8" r="2" fill={colors.primary} />
            <circle cx="8" cy="40" r="2" fill={colors.primary} />
            <circle cx="40" cy="40" r="2" fill={colors.primary} />
          </g>
        );

      case "statutory-crest":
        // merSETA institutional shield crest with star pillar & balance scale
        return (
          <g>
            {/* Shield Outline */}
            <path d="M24,5 L39,11 C39,26 32,38 24,43 C16,38 9,26 9,11 Z" fill="none" stroke={colors.primary} strokeWidth="2" />
            <path d="M24,9 L35,14 C35,25 30,34 24,38 C18,34 13,25 13,14 Z" fill={`url(#${gradId})`} opacity="0.6" />
            {/* Star of Governance */}
            <polygon points="24,14 26,19 31,19 27,22 29,27 24,24 19,27 21,22 17,19 22,19" fill="#FFFFFF" />
            {/* Horizontal Alignment Bar */}
            <line x1="16" y1="30" x2="32" y2="30" stroke={colors.primary} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="24" cy="33" r="2" fill={colors.primary} />
          </g>
        );

      case "quantum-lattice":
        // Hexagonal cognitive lattice cluster with neural synaptic nodes
        return (
          <g>
            {/* Outer Hexagon */}
            <polygon points="24,6 38,14 38,30 24,38 10,30 10,14" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.6" />
            {/* Inner Hexagon */}
            <polygon points="24,12 33,17 33,27 24,32 15,27 15,17" fill={`url(#${gradId})`} stroke={colors.primary} strokeWidth="1" />
            {/* Synaptic Lattice Lines */}
            <line x1="24" y1="6" x2="24" y2="12" stroke={colors.primary} strokeWidth="1.5" />
            <line x1="38" y1="14" x2="33" y2="17" stroke={colors.primary} strokeWidth="1.5" />
            <line x1="38" y1="30" x2="33" y2="27" stroke={colors.primary} strokeWidth="1.5" />
            <line x1="24" y1="38" x2="24" y2="32" stroke={colors.primary} strokeWidth="1.5" />
            <line x1="10" y1="30" x2="15" y2="27" stroke={colors.primary} strokeWidth="1.5" />
            <line x1="10" y1="14" x2="15" y2="17" stroke={colors.primary} strokeWidth="1.5" />
            {/* Central Node */}
            <circle cx="24" cy="22" r="3" fill="#FFFFFF" />
            <circle cx="24" cy="22" r="1.5" fill={colors.secondary} />
          </g>
        );

      case "labour-dynamics":
        // Econometric trajectory curves, equilibrium intersection & trade bar metrics
        return (
          <g>
            {/* Coordinate Axis */}
            <line x1="8" y1="40" x2="42" y2="40" stroke={colors.primary} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="40" x2="8" y2="6" stroke={colors.primary} strokeWidth="1.5" strokeLinecap="round" />
            {/* Ascending Demand Vector */}
            <path d="M10,34 Q22,32 38,12" fill="none" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" />
            {/* Supply Curve */}
            <path d="M10,14 Q22,24 38,36" fill="none" stroke={colors.secondary} strokeWidth="2" strokeDasharray="3 2" strokeLinecap="round" />
            {/* Equilibrium Point */}
            <circle cx="23" cy="24" r="4" fill="#FFFFFF" stroke={colors.primary} strokeWidth="1.5" />
            <circle cx="23" cy="24" r="1.8" fill={colors.primary} />
            {/* Variance Pillars */}
            <rect x="12" y="28" width="4" height="11" rx="1" fill={colors.primary} opacity="0.5" />
            <rect x="28" y="16" width="4" height="23" rx="1" fill={colors.primary} opacity="0.8" />
            <rect x="34" y="10" width="4" height="29" rx="1" fill={colors.primary} />
          </g>
        );

      case "policy-prism":
        // Octagonal faceted prism refracting single legislative beam into sector spectra
        return (
          <g>
            {/* Prism Outline */}
            <polygon points="24,6 40,16 40,32 24,42 8,32 8,16" fill={`url(#${gradId})`} stroke={colors.primary} strokeWidth="1.8" />
            {/* Facet Lines */}
            <line x1="24" y1="6" x2="24" y2="42" stroke={colors.primary} strokeWidth="1" opacity="0.6" />
            <line x1="8" y1="16" x2="40" y2="32" stroke={colors.primary} strokeWidth="1" opacity="0.6" />
            <line x1="8" y1="32" x2="40" y2="16" stroke={colors.primary} strokeWidth="1" opacity="0.6" />
            {/* Refracted Core Diamond */}
            <polygon points="24,16 30,24 24,32 18,24" fill="#FFFFFF" opacity="0.9" />
          </g>
        );

      case "chamber-matrix":
        // Interlocking 4-chamber industrial matrix with high-precision bevel gears
        return (
          <g>
            <circle cx="24" cy="24" r="18" fill="none" stroke={colors.primary} strokeWidth="1.5" />
            {/* 4 Chamber Quadrants */}
            <path d="M24,6 A18,18 0 0,1 42,24 L24,24 Z" fill={`url(#${gradId})`} opacity="0.75" />
            <path d="M24,24 L42,24 A18,18 0 0,1 24,42 Z" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.5" />
            <path d="M24,24 L24,42 A18,18 0 0,1 6,24 Z" fill={`url(#${gradId})`} opacity="0.4" />
            <path d="M6,24 A18,18 0 0,1 24,6 L24,24 Z" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.5" />
            {/* Chamber Intersection Cross */}
            <line x1="6" y1="24" x2="42" y2="24" stroke={colors.primary} strokeWidth="1.5" />
            <line x1="24" y1="6" x2="24" y2="42" stroke={colors.primary} strokeWidth="1.5" />
            {/* Center Hub */}
            <circle cx="24" cy="24" r="5" fill="#FFFFFF" stroke={colors.primary} strokeWidth="1.5" />
            <circle cx="24" cy="24" r="2" fill={colors.secondary} />
          </g>
        );

      case "vocational-shield":
        // Academic chevron shield with apprenticeship torch & graduation laurel
        return (
          <g>
            <path d="M24,4 L41,12 L41,26 C41,36 33,42 24,44 C15,42 7,36 7,26 L7,12 Z" fill={`url(#${gradId})`} stroke={colors.primary} strokeWidth="1.8" />
            {/* Torch of Artisanship */}
            <path d="M24,12 C25,15 28,17 26,21 C25,23 23,24 24,27 C22,24 21,21 23,17 C23.5,15 23,13 24,12 Z" fill="#FFFFFF" />
            <polygon points="21,27 27,27 25.5,35 22.5,35" fill={colors.primary} stroke="#FFFFFF" strokeWidth="0.8" />
            {/* Chevron Badge */}
            <path d="M14,24 L24,30 L34,24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case "atomic-catalyst":
      default:
        // Hydrogen orbital electron paths with glowing catalyst nucleus
        return (
          <g>
            {/* Orbit 1 */}
            <ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke={colors.primary} strokeWidth="1.5" transform="rotate(30 24 24)" />
            {/* Orbit 2 */}
            <ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke={colors.primary} strokeWidth="1.5" transform="rotate(-30 24 24)" />
            {/* Orbit 3 */}
            <ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke={colors.secondary} strokeWidth="1.5" transform="rotate(90 24 24)" opacity="0.8" />
            {/* Orbiting Particles */}
            <circle cx="38" cy="16" r="2" fill="#FFFFFF" />
            <circle cx="10" cy="32" r="2" fill="#FFFFFF" />
            <circle cx="24" cy="7" r="2" fill="#FFFFFF" />
            {/* Central Catalyst Nucleus */}
            <circle cx="24" cy="24" r="5" fill={`url(#${gradId})`} stroke={colors.primary} strokeWidth="1.5" />
            <circle cx="24" cy="24" r="2" fill="#FFFFFF" />
          </g>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-300 relative select-none ${className}`}
      style={{
        width: `${box}px`,
        height: `${box}px`,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: showGlow ? `0 0 16px ${colors.glow}` : "none",
      }}
    >
      <svg
        viewBox="0 0 48 48"
        width="100%"
        height="100%"
        className="p-1 overflow-visible"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.4" />
          </linearGradient>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {renderInsigniaSvg()}
      </svg>
    </div>
  );
};
