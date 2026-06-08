import React from "react";
import { FONTS } from "../lib/theme.js";

// ---------------------------------------------------------------------------
// Iconos (SVG en línea, trazo grueso para buena visibilidad)
// ---------------------------------------------------------------------------
const I = (paths, opts = {}) => (props) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill={opts.fill ? "currentColor" : "none"}
    stroke={opts.fill ? "none" : "currentColor"}
    strokeWidth={props.sw || 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={props.style}
    aria-hidden="true"
  >
    {paths}
  </svg>
);

export const Icon = {
  dashboard: I(<><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>),
  box: I(<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></>),
  cash: I(<><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" /></>),
  scan: I(<><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 8v8M10 8v8M13 8v8M17 8v8" /></>),
  search: I(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  plus: I(<><path d="M12 5v14M5 12h14" /></>),
  minus: I(<><path d="M5 12h14" /></>),
  edit: I(<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" /></>),
  trash: I(<><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>),
  alert: I(<><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>),
  clock: I(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  check: I(<><path d="M20 6 9 17l-5-5" /></>),
  x: I(<><path d="M18 6 6 18M6 6l12 12" /></>),
  sun: I(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>),
  moon: I(<><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></>),
  download: I(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></>),
  tag: I(<><path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h7l9.6 8.6a1.4 1.4 0 0 1 0 1.8Z" /><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" /></>),
  arrowUp: I(<><path d="M12 19V5M5 12l7-7 7 7" /></>),
  arrowDown: I(<><path d="M12 5v14M5 12l7 7 7-7" /></>),
  cart: I(<><circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" /><circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" /><path d="M2 3h3l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.2L22 7H6" /></>),
  store: I(<><path d="M3 9 4.5 4h15L21 9M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M3 9h18" /><path d="M9 20v-5h6v5" /></>),
  info: I(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
};

// ---------------------------------------------------------------------------
// Botón con icono grande (pensado para uso en mostrador)
// ---------------------------------------------------------------------------
export function Button({ t, children, icon: Ico, variant = "primary", size = "md", style, ...rest }) {
  const sizes = {
    sm: { padding: "8px 12px", font: 14, gap: 7, ico: 17 },
    md: { padding: "12px 18px", font: 15.5, gap: 9, ico: 20 },
    lg: { padding: "16px 24px", font: 18, gap: 11, ico: 24 },
  }[size];

  const variants = {
    primary: { background: t.accent, color: "#fff", border: `1px solid ${t.accent}` },
    blue: { background: t.blue, color: "#fff", border: `1px solid ${t.blue}` },
    ghost: { background: "transparent", color: t.textSoft, border: `1px solid ${t.border}` },
    soft: { background: t.surfaceMuted, color: t.text, border: `1px solid ${t.border}` },
    danger: { background: t.dangerSoft, color: t.danger, border: `1px solid ${t.dangerBorder}` },
  }[variant];

  return (
    <button
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizes.gap,
        padding: sizes.padding,
        fontFamily: FONTS.display,
        fontWeight: 600,
        fontSize: sizes.font,
        borderRadius: 12,
        cursor: "pointer",
        transition: "transform .15s ease, box-shadow .15s ease, filter .15s ease",
        ...variants,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.filter = "brightness(1.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.filter = "none";
      }}
    >
      {Ico && <Ico size={sizes.ico} />}
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Insignia de estado (semáforo)
// ---------------------------------------------------------------------------
export function Badge({ t, tone = "ok", children, icon: Ico }) {
  const tones = {
    ok: { bg: t.accentSoft, fg: t.accentText, bd: "transparent" },
    info: { bg: t.blueSoft, fg: t.blue, bd: "transparent" },
    warn: { bg: t.warnSoft, fg: t.warn, bd: t.warnBorder },
    danger: { bg: t.dangerSoft, fg: t.danger, bd: t.dangerBorder },
    muted: { bg: t.surfaceMuted, fg: t.muted, bd: t.border },
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: 999,
        background: tones.bg,
        color: tones.fg,
        border: `1px solid ${tones.bd}`,
        fontFamily: FONTS.display,
        fontWeight: 600,
        fontSize: 12.5,
        whiteSpace: "nowrap",
      }}
    >
      {Ico && <Ico size={14} />}
      {children}
    </span>
  );
}

export function Card({ t, children, style }) {
  return (
    <div
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 18,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
