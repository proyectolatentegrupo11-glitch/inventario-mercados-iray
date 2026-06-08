// storage.js — Persistencia local (navegador) con respaldo en memoria.
// No requiere internet ni cuenta. Los datos quedan en el equipo.

const KEY_PROD = "iray_productos_v1";
const KEY_CAJA = "iray_caja_v1";
const KEY_PREFS = "iray_prefs_v1";

// Respaldo en memoria por si el navegador bloquea localStorage
// (ej. modo incógnito o vista previa restringida).
let memoria = {};

function leer(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw != null) return JSON.parse(raw);
  } catch (e) {
    if (memoria[key] !== undefined) return memoria[key];
  }
  return fallback;
}

function guardar(key, valor) {
  memoria[key] = valor;
  try {
    localStorage.setItem(key, JSON.stringify(valor));
  } catch (e) {
    /* usamos memoria */
  }
}

// ---- Fechas relativas para la demostración (siempre muestran alertas) ----
function fechaEnDias(d) {
  const f = new Date();
  f.setDate(f.getDate() + d);
  f.setMinutes(f.getMinutes() - f.getTimezoneOffset());
  return f.toISOString().slice(0, 10);
}

let _seq = 1;
const uid = () => `p${Date.now().toString(36)}${(_seq++).toString(36)}`;

// Catálogo inicial: abarrotes típicos de tienda de barrio en Bogotá (precios COP).
function catalogoInicial() {
  const base = [
    ["7702011000013", "Arroz Diana 500 g", "Granos", 28, 10, 2900, 240],
    ["7702011000020", "Aceite Premier 1 L", "Aceites", 14, 6, 11500, 300],
    ["7702011000037", "Panela cuadrada 500 g", "Endulzantes", 9, 8, 3200, 180],
    ["7702011000044", "Lentejas 500 g", "Granos", 6, 8, 4100, 200],
    ["7702011000051", "Atún Van Camps 170 g", "Enlatados", 22, 10, 6800, 365],
    ["7702011000068", "Leche Colanta 1 L", "Lácteos", 18, 12, 4300, 9],
    ["7702011000075", "Huevos AA x 30", "Lácteos", 5, 6, 16500, 4],
    ["7702011000082", "Coca-Cola 1.5 L", "Bebidas", 30, 12, 5200, 120],
    ["7702011000099", "Café Sello Rojo 250 g", "Bebidas", 11, 6, 9800, 210],
    ["7702011000105", "Azúcar Incauca 1 kg", "Endulzantes", 16, 8, 5400, 270],
    ["7702011000112", "Sal Refisal 500 g", "Condimentos", 20, 6, 1800, 365],
    ["7702011000129", "Pasta Doria espagueti 250 g", "Pastas", 4, 10, 2600, 220],
    ["7702011000136", "Chocolate Corona 500 g", "Bebidas", 7, 5, 7300, 150],
    ["7702011000143", "Galletas Ducales x 6", "Mecato", 25, 10, 3900, 90],
    ["7702011000150", "Fríjol cargamanto 500 g", "Granos", 8, 8, 5600, 200],
    ["7702011000167", "Jabón Rey barra", "Aseo", 40, 15, 1700, 730],
    ["7702011000174", "Papel higiénico Familia x 4", "Aseo", 12, 8, 7900, 730],
    ["7702011000181", "Detergente Fab 1 kg", "Aseo", 3, 6, 9200, 540],
    ["7702011000198", "Crema dental Colgate 100 ml", "Aseo", 17, 8, 4600, 480],
    ["7702011000204", "Yogurt Alpina 1 L", "Lácteos", 10, 8, 6200, 12],
  ];
  return base.map(([codigo, nombre, categoria, stock, minimo, precio, venceEnDias]) => ({
    id: uid(),
    codigo,
    nombre,
    categoria,
    stock,
    minimo,
    precio,
    vencimiento: fechaEnDias(venceEnDias),
  }));
}

export function cargarProductos() {
  const existentes = leer(KEY_PROD, null);
  if (existentes && Array.isArray(existentes)) return existentes;
  const inicial = catalogoInicial();
  guardar(KEY_PROD, inicial);
  return inicial;
}

export function guardarProductos(productos) {
  guardar(KEY_PROD, productos);
}

export function cargarCaja() {
  return leer(KEY_CAJA, []);
}

export function guardarCaja(movs) {
  guardar(KEY_CAJA, movs);
}

export function cargarPrefs() {
  return leer(KEY_PREFS, { theme: "light", diasAlerta: 30 });
}

export function guardarPrefs(prefs) {
  guardar(KEY_PREFS, prefs);
}

export function nuevoId() {
  return uid();
}

export const CATEGORIAS = [
  "Granos",
  "Aceites",
  "Endulzantes",
  "Enlatados",
  "Lácteos",
  "Bebidas",
  "Pastas",
  "Mecato",
  "Condimentos",
  "Aseo",
  "Otros",
];

// Exporta el inventario a un archivo CSV (compatible con Excel).
export function exportarCSV(productos) {
  const cols = ["Código", "Producto", "Categoría", "Stock", "Stock mínimo", "Precio", "Vencimiento"];
  const filas = productos.map((p) =>
    [p.codigo, p.nombre, p.categoria, p.stock, p.minimo, p.precio, p.vencimiento]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = "\uFEFF" + [cols.join(","), ...filas].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inventario-mercados-iray-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
