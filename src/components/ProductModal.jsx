import React from "react";
import { FONTS } from "../lib/theme.js";
import { Icon, Button, Badge } from "./ui.jsx";
import { fmtCOP, fmtFecha, estadoStock, estadoVencimiento } from "../lib/format.js";
import { CATEGORIAS } from "../lib/storage.js";

function Overlay({ children, onClose }) {
  return (
    <div
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,18,24,.46)",
        backdropFilter: "blur(3px)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 150,
        animation: "irayFade .2s ease",
      }}
    >
      {children}
    </div>
  );
}

function Field({ t, label, children }) {
  return (
    <div>
      <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 13, color: t.muted, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal para crear / editar un producto
// ---------------------------------------------------------------------------
export function ProductModal({ t, producto, onClose, onSave }) {
  const nuevo = !producto?.id;
  const [f, setF] = React.useState({
    codigo: producto?.codigo || "",
    nombre: producto?.nombre || "",
    categoria: producto?.categoria || CATEGORIAS[0],
    stock: producto?.stock ?? 0,
    minimo: producto?.minimo ?? 5,
    precio: producto?.precio ?? 0,
    vencimiento: producto?.vencimiento || "",
  });
  const set = (k, v) => setF((c) => ({ ...c, [k]: v }));

  const inputBase = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 11,
    border: `1px solid ${t.border}`,
    background: t.surfaceMuted,
    fontFamily: FONTS.body,
    fontSize: 15.5,
    color: t.text,
    outline: "none",
  };
  const numInput = { ...inputBase, fontFamily: FONTS.mono, fontSize: 17 };

  const valido = f.nombre.trim() && f.codigo.trim();

  const guardar = () => {
    if (!valido) return;
    onSave({
      ...producto,
      codigo: f.codigo.trim(),
      nombre: f.nombre.trim(),
      categoria: f.categoria,
      stock: Math.max(0, Math.round(Number(f.stock) || 0)),
      minimo: Math.max(0, Math.round(Number(f.minimo) || 0)),
      precio: Math.max(0, Math.round(Number(f.precio) || 0)),
      vencimiento: f.vencimiento || "",
    });
  };

  return (
    <Overlay onClose={onClose}>
      <div
        style={{
          width: "min(560px, 100%)",
          maxHeight: "92vh",
          overflowY: "auto",
          background: t.surface,
          borderRadius: 20,
          border: `1px solid ${t.border}`,
          boxShadow: t.shadowLift,
          padding: 24,
          animation: "irayPop .28s cubic-bezier(.34,1.4,.64,1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: t.accentSoft, color: t.accent }}>
            <Icon.box size={24} />
          </span>
          <h2 style={{ margin: 0, fontFamily: FONTS.display, fontSize: 21, fontWeight: 700, color: t.text }}>
            {nuevo ? "Nuevo producto" : "Editar producto"}
          </h2>
          <button onClick={onClose} style={{ marginLeft: "auto", width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, color: t.muted, cursor: "pointer", display: "grid", placeItems: "center" }}>
            <Icon.x size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field t={t} label="Código de barras">
            <input value={f.codigo} onChange={(e) => set("codigo", e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" placeholder="7702011000000" style={{ ...inputBase, fontFamily: FONTS.mono }} />
          </Field>
          <Field t={t} label="Nombre del producto">
            <input value={f.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej: Arroz Diana 500 g" style={inputBase} autoFocus={nuevo} />
          </Field>
          <Field t={t} label="Categoría">
            <select value={f.categoria} onChange={(e) => set("categoria", e.target.value)} style={{ ...inputBase, cursor: "pointer" }}>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field t={t} label="Stock actual">
              <input value={f.stock} onChange={(e) => set("stock", e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" style={numInput} />
            </Field>
            <Field t={t} label="Stock mínimo (alerta)">
              <input value={f.minimo} onChange={(e) => set("minimo", e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" style={numInput} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field t={t} label="Precio de venta (COP)">
              <input value={f.precio} onChange={(e) => set("precio", e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" style={numInput} />
            </Field>
            <Field t={t} label="Fecha de vencimiento">
              <input type="date" value={f.vencimiento} onChange={(e) => set("vencimiento", e.target.value)} style={inputBase} />
            </Field>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <Button t={t} variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</Button>
          <Button t={t} variant="primary" icon={Icon.check} onClick={guardar} style={{ flex: 1, opacity: valido ? 1 : 0.5, pointerEvents: valido ? "auto" : "none" }}>
            Guardar
          </Button>
        </div>
      </div>
    </Overlay>
  );
}

// ---------------------------------------------------------------------------
// Panel de venta rápida cuando el lector encuentra un producto
// ---------------------------------------------------------------------------
export function SaleConfirm({ t, producto, diasAlerta, onClose, onConfirm, onEditar }) {
  const [cant, setCant] = React.useState(1);
  const es = estadoStock(producto.stock, producto.minimo);
  const ev = estadoVencimiento(producto.vencimiento, diasAlerta);
  const total = (Number(producto.precio) || 0) * cant;
  const suficiente = producto.stock >= cant;

  return (
    <Overlay onClose={onClose}>
      <div
        style={{
          width: "min(460px, 100%)",
          background: t.surface,
          borderRadius: 20,
          border: `1px solid ${t.border}`,
          boxShadow: t.shadowLift,
          overflow: "hidden",
          animation: "irayPop .28s cubic-bezier(.34,1.4,.64,1)",
        }}
      >
        <div style={{ background: t.accent, color: "#fff", padding: "18px 22px", display: "flex", alignItems: "center", gap: 12 }}>
          <Icon.check size={26} />
          <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 17 }}>Producto encontrado</div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "rgba(255,255,255,.2)", border: "none", borderRadius: 9, width: 34, height: 34, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}>
            <Icon.x size={18} />
          </button>
        </div>

        <div style={{ padding: 22 }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 22, color: t.text, marginBottom: 4 }}>{producto.nombre}</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: t.muted, marginBottom: 14 }}>{producto.codigo}</div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            <Badge t={t} tone="info">{producto.categoria}</Badge>
            <Badge t={t} tone={es.nivel === "agotado" ? "danger" : es.nivel === "bajo" ? "warn" : "ok"} icon={Icon.box}>
              {producto.stock} en stock
            </Badge>
            {(ev.nivel === "vencido" || ev.nivel === "por_vencer") && (
              <Badge t={t} tone={ev.nivel === "vencido" ? "danger" : "warn"} icon={Icon.clock}>{ev.label}</Badge>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 14, borderRadius: 13, background: t.surfaceMuted, border: `1px solid ${t.border}`, marginBottom: 16 }}>
            <span style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 15, color: t.textSoft }}>Cantidad a vender</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setCant((c) => Math.max(1, c - 1))} style={qtyBtn(t)}>
                <Icon.minus size={18} />
              </button>
              <span style={{ minWidth: 42, textAlign: "center", fontFamily: FONTS.mono, fontWeight: 700, fontSize: 24, color: t.text }}>{cant}</span>
              <button onClick={() => setCant((c) => c + 1)} style={{ ...qtyBtn(t), color: t.accent, borderColor: t.accent + "55" }}>
                <Icon.plus size={18} />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
            <span style={{ fontFamily: FONTS.body, fontSize: 15, color: t.muted }}>Total de la venta</span>
            <span style={{ fontFamily: FONTS.mono, fontWeight: 800, fontSize: 28, color: t.accent }}>{fmtCOP(total)}</span>
          </div>

          {!suficiente && (
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 14px", borderRadius: 11, background: t.dangerSoft, border: `1px solid ${t.dangerBorder}`, color: t.danger, fontFamily: FONTS.body, fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>
              <Icon.alert size={18} /> No hay stock suficiente ({producto.stock} disponibles).
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <Button t={t} variant="ghost" icon={Icon.edit} onClick={onEditar} style={{ flex: "0 0 auto" }}>
              Editar
            </Button>
            <Button
              t={t}
              variant="primary"
              icon={Icon.cart}
              size="lg"
              onClick={() => onConfirm(cant)}
              style={{ flex: 1, opacity: suficiente ? 1 : 0.5, pointerEvents: suficiente ? "auto" : "none" }}
            >
              Registrar venta
            </Button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

const qtyBtn = (t) => ({
  width: 40,
  height: 40,
  borderRadius: 10,
  border: `1px solid ${t.border}`,
  background: t.surface,
  color: t.textSoft,
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
});

// ---------------------------------------------------------------------------
// Confirmación genérica (eliminar)
// ---------------------------------------------------------------------------
export function Confirm({ t, titulo, mensaje, onClose, onConfirm }) {
  return (
    <Overlay onClose={onClose}>
      <div style={{ width: "min(420px, 100%)", background: t.surface, borderRadius: 18, border: `1px solid ${t.border}`, boxShadow: t.shadowLift, padding: 24, animation: "irayPop .25s cubic-bezier(.34,1.4,.64,1)" }}>
        <span style={{ width: 46, height: 46, borderRadius: 12, display: "grid", placeItems: "center", background: t.dangerSoft, color: t.danger, marginBottom: 14 }}>
          <Icon.alert size={26} />
        </span>
        <h3 style={{ margin: "0 0 6px", fontFamily: FONTS.display, fontSize: 19, fontWeight: 700, color: t.text }}>{titulo}</h3>
        <p style={{ margin: "0 0 20px", fontFamily: FONTS.body, fontSize: 15, color: t.muted, lineHeight: 1.5 }}>{mensaje}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <Button t={t} variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</Button>
          <Button t={t} variant="danger" icon={Icon.trash} onClick={onConfirm} style={{ flex: 1 }}>Eliminar</Button>
        </div>
      </div>
    </Overlay>
  );
}
