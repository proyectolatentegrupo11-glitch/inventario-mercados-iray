// theme.js — Motor de temas de Mercados IRAY
// Paleta clara por defecto (pensada para legibilidad y confianza),
// con modo oscuro opcional. Nunca se codifican colores sueltos: todo
// pasa por THEMES[theme].

export const THEMES = {
  light: {
    name: "light",
    bg: "#EEF2F4", // gris claro de fondo
    bg2: "#E3E9ED",
    surface: "#FFFFFF", // tarjetas
    surfaceMuted: "#F6F8FA",
    border: "#DCE3E8",
    borderStrong: "#C4CFD6",
    text: "#16242E", // azul casi negro
    textSoft: "#3C4D58",
    muted: "#6B7C88",
    accent: "#0E9F6E", // verde institucional (frescura, confianza)
    accentSoft: "#E6F6EF",
    accentText: "#0A6B4A",
    blue: "#2563EB", // azul institucional
    blueSoft: "#E7EFFE",
    warn: "#B45309", // ámbar (stock bajo)
    warnSoft: "#FEF3C7",
    warnBorder: "#FCD34D",
    danger: "#C2261B", // rojo (vencido / agotado)
    dangerSoft: "#FEE6E3",
    dangerBorder: "#F7B6AF",
    shadow: "0 1px 2px rgba(16,36,46,.06), 0 8px 24px rgba(16,36,46,.06)",
    shadowLift: "0 10px 30px rgba(16,36,46,.14)",
  },
  dark: {
    name: "dark",
    bg: "#0E161C",
    bg2: "#121E26",
    surface: "#17242D",
    surfaceMuted: "#1D2D38",
    border: "#263A46",
    borderStrong: "#334D5C",
    text: "#EAF1F4",
    textSoft: "#C2D0D8",
    muted: "#8AA0AC",
    accent: "#23C58C",
    accentSoft: "#10342A",
    accentText: "#5FE0B2",
    blue: "#5B91F5",
    blueSoft: "#152339",
    warn: "#F0B65A",
    warnSoft: "#352713",
    warnBorder: "#5C461F",
    danger: "#F2796C",
    dangerSoft: "#3A1A17",
    dangerBorder: "#5E2A24",
    shadow: "0 1px 2px rgba(0,0,0,.4), 0 10px 28px rgba(0,0,0,.35)",
    shadowLift: "0 12px 34px rgba(0,0,0,.5)",
  },
};

export const FONTS = {
  display: "'Sora', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

// Inyecta las fuentes de Google una sola vez.
export function loadFonts() {
  if (document.getElementById("iray-fonts")) return;
  const link = document.createElement("link");
  link.id = "iray-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap";
  document.head.appendChild(link);
}
