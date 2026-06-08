import React from "react";
import { THEMES, FONTS, loadFonts } from "./lib/theme.js";
import {
  cargarProductos,
  guardarProductos,
  cargarCaja,
  guardarCaja,
  cargarPrefs,
  guardarPrefs,
  nuevoId,
  exportarCSV,
} from "./lib/storage.js";
import { hoyISO } from "./lib/format.js";
import { Icon, Button } from "./components/ui.jsx";
import { ScannerBar } from "./components/ScannerBar.jsx";
import { Dashboard } from "./components/Dashboard.jsx";
import { Inventory } from "./components/Inventory.jsx";
import { Cash } from "./components/Cash.jsx";
import { ProductModal, SaleConfirm, Confirm } from "./components/ProductModal.jsx";
import { ToastStack, useToasts } from "./components/Toast.jsx";

const TABS = [
  { id: "inicio", label: "Inicio", icon: Icon.dashboard },
  { id: "inventario", label: "Inventario", icon: Icon.box },
  { id: "caja", label: "Caja", icon: Icon.cash },
];

export default function App() {
  const [prefs, setPrefs] = React.useState(() => cargarPrefs());
  const t = THEMES[prefs.theme] || THEMES.light;
  const diasAlerta = prefs.diasAlerta || 30;

  const [productos, setProductos] = React.useState(() => cargarProductos());
  const [caja, setCaja] = React.useState(() => cargarCaja());
  const [tab, setTab] = React.useState("inicio");
  const [show, setShow] = React.useState(false);

  // Modales
  const [editProd, setEditProd] = React.useState(null); // objeto o {nuevo}
  const [venta, setVenta] = React.useState(null);
  const [confirmDel, setConfirmDel] = React.useState(null);
  const [highlightId, setHighlightId] = React.useState(null);

  const { toasts, push } = useToasts();
  const scanRef = React.useRef(null);
  const searchRef = React.useRef(null);

  // --- efectos ---
  React.useEffect(() => {
    loadFonts();
    const tm = setTimeout(() => setShow(true), 40);
    return () => clearTimeout(tm);
  }, []);
  React.useEffect(() => guardarProductos(productos), [productos]);
  React.useEffect(() => guardarCaja(caja), [caja]);
  React.useEffect(() => guardarPrefs(prefs), [prefs]);

  // Atajo: tecla "/" enfoca el lector; Escape cierra modales.
  React.useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") {
        setEditProd(null);
        setVenta(null);
        setConfirmDel(null);
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "SELECT") {
        e.preventDefault();
        scanRef.current?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // --- acciones ---
  const onScan = (code) => {
    const p = productos.find((x) => x.codigo === code);
    if (p) {
      setVenta(p);
    } else {
      push(`Código ${code} no está registrado. Crea el producto.`, "info");
      setEditProd({ codigo: code });
    }
  };

  const flash = (id) => {
    setHighlightId(id);
    setTimeout(() => setHighlightId(null), 1400);
  };

  const guardarProducto = (data) => {
    if (data.id) {
      setProductos((c) => c.map((p) => (p.id === data.id ? { ...p, ...data } : p)));
      push("Producto actualizado.", "ok");
    } else {
      const dup = productos.find((p) => p.codigo === data.codigo);
      if (dup) {
        push("Ya existe un producto con ese código.", "warn");
        return;
      }
      const nuevo = { ...data, id: nuevoId() };
      setProductos((c) => [nuevo, ...c]);
      push("Producto agregado al inventario.", "ok");
      setTab("inventario");
      flash(nuevo.id);
    }
    setEditProd(null);
  };

  const ajustarStock = (id, delta) => {
    setProductos((c) => c.map((p) => (p.id === id ? { ...p, stock: Math.max(0, (Number(p.stock) || 0) + delta) } : p)));
  };

  const eliminarProducto = (p) => setConfirmDel(p);
  const confirmarEliminar = () => {
    setProductos((c) => c.filter((x) => x.id !== confirmDel.id));
    push("Producto eliminado.", "ok");
    setConfirmDel(null);
  };

  const registrarVenta = (cantidad) => {
    const p = venta;
    setProductos((c) => c.map((x) => (x.id === p.id ? { ...x, stock: Math.max(0, x.stock - cantidad) } : x)));
    const mov = {
      id: nuevoId(),
      fecha: hoyISO(),
      tipo: "ingreso",
      concepto: `Venta: ${p.nombre}${cantidad > 1 ? ` × ${cantidad}` : ""}`,
      monto: (Number(p.precio) || 0) * cantidad,
      origen: "venta",
      ts: Date.now(),
    };
    setCaja((c) => [mov, ...c]);
    push(`Venta registrada: ${p.nombre}`, "ok");
    setVenta(null);
    scanRef.current?.focus();
  };

  const agregarMovimiento = (m) => {
    setCaja((c) => [{ ...m, id: nuevoId(), ts: Date.now() }, ...c]);
    push("Movimiento registrado en caja.", "ok");
  };
  const eliminarMovimiento = (id) => setCaja((c) => c.filter((m) => m.id !== id));

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: FONTS.body, color: t.text }}>
      <GlobalStyle t={t} />

      {/* Encabezado */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: t.surface + "F2",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, display: "grid", placeItems: "center", background: t.accent, color: "#fff" }}>
              <Icon.store size={24} />
            </span>
            <div>
              <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 18, lineHeight: 1, color: t.text }}>Mercados IRAY</div>
              <div style={{ fontFamily: FONTS.body, fontSize: 12.5, color: t.muted }}>Inventario y caja</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 6, marginLeft: 8, background: t.surfaceMuted, padding: 5, borderRadius: 13, border: `1px solid ${t.border}` }}>
            {TABS.map((tb) => {
              const active = tab === tb.id;
              const Ic = tb.icon;
              return (
                <button
                  key={tb.id}
                  onClick={() => setTab(tb.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 16px",
                    borderRadius: 9,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: FONTS.display,
                    fontWeight: 600,
                    fontSize: 15,
                    background: active ? t.surface : "transparent",
                    color: active ? t.accent : t.muted,
                    boxShadow: active ? t.shadow : "none",
                    transition: "all .15s ease",
                  }}
                >
                  <Ic size={19} /> {tb.label}
                </button>
              );
            })}
          </nav>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Button t={t} variant="ghost" size="sm" icon={Icon.download} onClick={() => exportarCSV(productos)}>
              Exportar
            </Button>
            <button
              onClick={() => setPrefs((p) => ({ ...p, theme: p.theme === "light" ? "dark" : "light" }))}
              title="Cambiar tema"
              style={{ width: 40, height: 40, borderRadius: 11, border: `1px solid ${t.border}`, background: t.surface, color: t.textSoft, cursor: "pointer", display: "grid", placeItems: "center" }}
            >
              {prefs.theme === "light" ? <Icon.moon size={19} /> : <Icon.sun size={19} />}
            </button>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "22px 20px 64px",
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(18px)",
          transition: "opacity .6s ease, transform .6s cubic-bezier(.34,1.1,.64,1)",
        }}
      >
        {/* Barra de escaneo: siempre visible */}
        <div style={{ marginBottom: 20 }}>
          <ScannerBar t={t} onScan={onScan} scanInputRef={scanRef} />
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 8, color: t.muted, fontFamily: FONTS.body, fontSize: 12.5 }}>
            <Icon.info size={14} />
            Pase el producto por el lector para registrar una venta al instante. Atajo: tecla «/» para escribir un código.
          </div>
        </div>

        {tab === "inicio" && (
          <Dashboard t={t} productos={productos} caja={caja} diasAlerta={diasAlerta} onVerInventario={() => setTab("inventario")} />
        )}
        {tab === "inventario" && (
          <Inventory
            t={t}
            productos={productos}
            diasAlerta={diasAlerta}
            onAdd={() => setEditProd({})}
            onEdit={(p) => setEditProd(p)}
            onDelete={eliminarProducto}
            onAdjust={ajustarStock}
            highlightId={highlightId}
            searchRef={searchRef}
          />
        )}
        {tab === "caja" && <Cash t={t} caja={caja} onAgregar={agregarMovimiento} onEliminar={eliminarMovimiento} />}
      </main>

      {/* Modales */}
      {editProd && (
        <ProductModal t={t} producto={editProd} onClose={() => setEditProd(null)} onSave={guardarProducto} />
      )}
      {venta && (
        <SaleConfirm
          t={t}
          producto={venta}
          diasAlerta={diasAlerta}
          onClose={() => setVenta(null)}
          onConfirm={registrarVenta}
          onEditar={() => {
            const p = venta;
            setVenta(null);
            setEditProd(p);
          }}
        />
      )}
      {confirmDel && (
        <Confirm
          t={t}
          titulo="Eliminar producto"
          mensaje={`¿Seguro que deseas eliminar "${confirmDel.nombre}" del inventario? Esta acción no se puede deshacer.`}
          onClose={() => setConfirmDel(null)}
          onConfirm={confirmarEliminar}
        />
      )}

      <ToastStack t={t} toasts={toasts} />
    </div>
  );
}

function GlobalStyle({ t }) {
  return (
    <style>{`
      * { box-sizing: border-box; }
      html, body, #root { margin: 0; padding: 0; }
      body { background: ${t.bg}; }
      input::placeholder { color: ${t.muted}; opacity: .8; }
      select { -webkit-appearance: none; appearance: none; }
      ::-webkit-scrollbar { width: 11px; height: 11px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${t.borderStrong}; border-radius: 999px; border: 3px solid ${t.bg}; }
      ::-webkit-scrollbar-thumb:hover { background: ${t.muted}; }
      button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid ${t.accent}; outline-offset: 2px; }
      @keyframes irayToastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes irayPop { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      @keyframes irayFade { from { opacity: 0; } to { opacity: 1; } }
      @media (max-width: 720px) {
        nav { width: 100%; order: 3; justify-content: space-between; }
        nav button { flex: 1; justify-content: center; }
        .iray-cash-grid { grid-template-columns: 1fr !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
      }
    `}</style>
  );
}
