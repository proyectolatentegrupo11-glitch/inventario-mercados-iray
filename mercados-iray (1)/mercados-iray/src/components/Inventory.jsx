import React from "react";
import { FONTS } from "../lib/theme.js";
import { Icon, Card, Badge, Button } from "./ui.jsx";
import { fmtCOP, fmtFecha, estadoStock, estadoVencimiento } from "../lib/format.js";
import { CATEGORIAS } from "../lib/storage.js";

export function Inventory({ t, productos, diasAlerta, onAdd, onEdit, onDelete, onAdjust, highlightId, searchRef }) {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("Todas");
  const [orden, setOrden] = React.useState("nombre");

  const lista = React.useMemo(() => {
    const txt = q.trim().toLowerCase();
    let arr = productos.filter((p) => {
      const okCat = cat === "Todas" || p.categoria === cat;
      const okTxt = !txt || p.nombre.toLowerCase().includes(txt) || p.codigo.includes(txt);
      return okCat && okTxt;
    });
    arr = [...arr].sort((a, b) => {
      if (orden === "stock") return (a.stock || 0) - (b.stock || 0);
      if (orden === "vence") return (a.vencimiento || "9999").localeCompare(b.vencimiento || "9999");
      if (orden === "precio") return (b.precio || 0) - (a.precio || 0);
      return a.nombre.localeCompare(b.nombre);
    });
    return arr;
  }, [productos, q, cat, orden]);

  const cats = ["Todas", ...CATEGORIAS];

  return (
    <Card t={t} style={{ padding: 0, overflow: "hidden" }}>
      {/* Barra de herramientas */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          padding: 18,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            flex: "1 1 240px",
            background: t.surfaceMuted,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            padding: "10px 14px",
          }}
        >
          <Icon.search size={19} style={{ color: t.muted }} />
          <input
            ref={searchRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o código…"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              fontFamily: FONTS.body,
              fontSize: 15.5,
              color: t.text,
            }}
          />
        </div>

        <Selector t={t} value={cat} onChange={setCat} options={cats} icon={Icon.tag} />
        <Selector
          t={t}
          value={orden}
          onChange={setOrden}
          options={[
            ["nombre", "Orden: Nombre"],
            ["stock", "Orden: Menor stock"],
            ["vence", "Orden: Vence antes"],
            ["precio", "Orden: Mayor precio"],
          ]}
        />
        <Button t={t} icon={Icon.plus} onClick={onAdd}>
          Agregar producto
        </Button>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 880 }}>
          <thead>
            <tr style={{ background: t.surfaceMuted }}>
              {["Código", "Producto", "Categoría", "Stock", "Mínimo", "Precio", "Vence", "Estado", ""].map((h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: i >= 3 && i <= 5 ? "center" : "left",
                    padding: "12px 16px",
                    fontFamily: FONTS.display,
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: t.muted,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: 40, textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: t.muted, fontFamily: FONTS.body }}>
                    <Icon.box size={34} />
                    <span style={{ fontSize: 15 }}>No hay productos que coincidan con la búsqueda.</span>
                  </div>
                </td>
              </tr>
            )}
            {lista.map((p) => {
              const es = estadoStock(p.stock, p.minimo);
              const ev = estadoVencimiento(p.vencimiento, diasAlerta);
              const hl = highlightId === p.id;
              return (
                <tr
                  key={p.id}
                  style={{
                    borderTop: `1px solid ${t.border}`,
                    background: hl ? t.accentSoft : "transparent",
                    transition: "background .6s ease",
                  }}
                >
                  <td style={{ padding: "12px 16px", fontFamily: FONTS.mono, fontSize: 13, color: t.muted, whiteSpace: "nowrap" }}>{p.codigo}</td>
                  <td style={{ padding: "12px 16px", fontFamily: FONTS.display, fontWeight: 600, fontSize: 15.5, color: t.text }}>{p.nombre}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge t={t} tone="muted">{p.categoria}</Badge>
                  </td>
                  <td style={{ padding: "8px 16px" }}>
                    <Stepper t={t} value={p.stock} onMinus={() => onAdjust(p.id, -1)} onPlus={() => onAdjust(p.id, +1)} es={es} />
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center", fontFamily: FONTS.mono, fontSize: 15, color: t.muted }}>{p.minimo}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center", fontFamily: FONTS.mono, fontSize: 15, fontWeight: 600, color: t.text, whiteSpace: "nowrap" }}>{fmtCOP(p.precio)}</td>
                  <td style={{ padding: "12px 16px", fontFamily: FONTS.body, fontSize: 13.5, color: ev.nivel === "ok" ? t.muted : ev.nivel === "vencido" ? t.danger : t.warn, whiteSpace: "nowrap" }}>{fmtFecha(p.vencimiento)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {es.nivel !== "ok" && (
                        <Badge t={t} tone={es.nivel === "agotado" ? "danger" : "warn"}>{es.label}</Badge>
                      )}
                      {(ev.nivel === "vencido" || ev.nivel === "por_vencer") && (
                        <Badge t={t} tone={ev.nivel === "vencido" ? "danger" : "warn"} icon={Icon.clock}>{ev.label}</Badge>
                      )}
                      {es.nivel === "ok" && ev.nivel === "ok" && <Badge t={t} tone="ok" icon={Icon.check}>OK</Badge>}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap", textAlign: "right" }}>
                    <IconBtn t={t} title="Editar" onClick={() => onEdit(p)} icon={Icon.edit} />
                    <IconBtn t={t} title="Eliminar" onClick={() => onDelete(p)} icon={Icon.trash} danger />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Stepper({ t, value, onMinus, onPlus, es }) {
  const color = es.nivel === "agotado" ? t.danger : es.nivel === "bajo" ? t.warn : t.text;
  const btn = {
    width: 34,
    height: 34,
    borderRadius: 9,
    border: `1px solid ${t.border}`,
    background: t.surface,
    color: t.textSoft,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
      <button style={btn} title="Restar 1" onClick={onMinus}>
        <Icon.minus size={16} />
      </button>
      <span style={{ minWidth: 34, textAlign: "center", fontFamily: FONTS.mono, fontWeight: 700, fontSize: 18, color }}>{value}</span>
      <button style={{ ...btn, color: t.accent, borderColor: t.accent + "55" }} title="Sumar 1" onClick={onPlus}>
        <Icon.plus size={16} />
      </button>
    </div>
  );
}

function IconBtn({ t, icon: Ico, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        border: `1px solid ${t.border}`,
        background: t.surface,
        color: danger ? t.danger : t.textSoft,
        cursor: "pointer",
        marginLeft: 6,
        display: "inline-grid",
        placeItems: "center",
        verticalAlign: "middle",
      }}
    >
      <Ico size={18} />
    </button>
  );
}

function Selector({ t, value, onChange, options, icon: Ico }) {
  const opts = options.map((o) => (Array.isArray(o) ? o : [o, o]));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: t.surfaceMuted,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        padding: "0 12px",
      }}
    >
      {Ico && <Ico size={17} style={{ color: t.muted }} />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          padding: "11px 4px",
          fontFamily: FONTS.body,
          fontSize: 14.5,
          fontWeight: 600,
          color: t.text,
          cursor: "pointer",
        }}
      >
        {opts.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
