// format.js — Formato de moneda, fechas y lógica de estados.

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const fmtCOP = (n) => COP.format(Number(n) || 0);
export const fmtNum = (n) => new Intl.NumberFormat("es-CO").format(Number(n) || 0);

// Fecha de hoy en formato YYYY-MM-DD (zona local).
export function hoyISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function fmtFecha(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${meses[m - 1]} ${y}`;
}

// Días que faltan para una fecha (negativo = ya pasó).
export function diasPara(iso) {
  if (!iso) return null;
  const hoy = new Date(hoyISO());
  const objetivo = new Date(iso);
  return Math.round((objetivo - hoy) / 86400000);
}

// Estado de vencimiento. Umbral: por vencer si faltan <= dias.
export function estadoVencimiento(iso, dias = 30) {
  if (!iso) return { nivel: "sin", label: "Sin fecha" };
  const d = diasPara(iso);
  if (d < 0) return { nivel: "vencido", label: "Vencido", dias: d };
  if (d === 0) return { nivel: "vencido", label: "Vence hoy", dias: d };
  if (d <= dias) return { nivel: "por_vencer", label: `Vence en ${d} día${d === 1 ? "" : "s"}`, dias: d };
  return { nivel: "ok", label: `Vence en ${d} días`, dias: d };
}

// Estado de stock.
export function estadoStock(stock, minimo) {
  const s = Number(stock) || 0;
  const m = Number(minimo) || 0;
  if (s <= 0) return { nivel: "agotado", label: "Agotado" };
  if (s <= m) return { nivel: "bajo", label: "Stock bajo" };
  return { nivel: "ok", label: "Disponible" };
}
