import React from "react";
import { FONTS } from "../lib/theme.js";
import { Icon, Card, Badge, Button } from "./ui.jsx";
import { fmtCOP, fmtFecha, hoyISO } from "../lib/format.js";

export function Cash({ t, caja, onAgregar, onEliminar }) {
  const [fecha, setFecha] = React.useState(hoyISO());
  const [tipo, setTipo] = React.useState("ingreso");
  const [concepto, setConcepto] = React.useState("");
  const [monto, setMonto] = React.useState("");

  const delDia = React.useMemo(
    () => caja.filter((m) => m.fecha === fecha).sort((a, b) => (b.ts || 0) - (a.ts || 0)),
    [caja, fecha]
  );
  const tot = React.useMemo(() => {
    let ing = 0,
      egr = 0;
    for (const m of delDia) {
      if (m.tipo === "ingreso") ing += Number(m.monto) || 0;
      else egr += Number(m.monto) || 0;
    }
    return { ing, egr, saldo: ing - egr };
  }, [delDia]);

  const registrar = () => {
    const m = Math.round(Number(monto) || 0);
    if (m <= 0 || !concepto.trim()) return;
    onAgregar({ fecha, tipo, concepto: concepto.trim(), monto: m, origen: "manual" });
    setConcepto("");
    setMonto("");
  };

  const inputBase = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 11,
    border: `1px solid ${t.border}`,
    background: t.surface,
    fontFamily: FONTS.body,
    fontSize: 15.5,
    color: t.text,
    outline: "none",
  };

  return (
    <div className="iray-cash-grid" style={{ display: "grid", gridTemplateColumns: "minmax(300px, 380px) 1fr", gap: 16, alignItems: "start" }}>
      {/* Formulario de registro */}
      <Card t={t} style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Icon.cash size={20} style={{ color: t.accent }} />
          <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: t.text }}>Registrar movimiento</h3>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {[
            ["ingreso", "Ingreso", t.accent, Icon.arrowUp],
            ["egreso", "Egreso", t.danger, Icon.arrowDown],
          ].map(([v, l, c, Ic]) => (
            <button
              key={v}
              onClick={() => setTipo(v)}
              style={{
                flex: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "13px 10px",
                borderRadius: 12,
                cursor: "pointer",
                fontFamily: FONTS.display,
                fontWeight: 700,
                fontSize: 15,
                border: `2px solid ${tipo === v ? c : t.border}`,
                background: tipo === v ? c : t.surface,
                color: tipo === v ? "#fff" : t.textSoft,
                transition: "all .15s ease",
              }}
            >
              <Ic size={19} /> {l}
            </button>
          ))}
        </div>

        <Label t={t}>Fecha</Label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={{ ...inputBase, marginBottom: 12 }} />

        <Label t={t}>Concepto</Label>
        <input
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          placeholder={tipo === "ingreso" ? "Ej: Venta de mostrador" : "Ej: Pago a proveedor"}
          style={{ ...inputBase, marginBottom: 12 }}
        />

        <Label t={t}>Monto (COP)</Label>
        <input
          value={monto}
          onChange={(e) => setMonto(e.target.value.replace(/[^\d]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && registrar()}
          inputMode="numeric"
          placeholder="0"
          style={{ ...inputBase, fontFamily: FONTS.mono, fontSize: 18, marginBottom: 18 }}
        />

        <Button t={t} variant={tipo === "ingreso" ? "primary" : "danger"} icon={Icon.plus} size="lg" style={{ width: "100%" }} onClick={registrar}>
          Registrar {tipo}
        </Button>
      </Card>

      {/* Movimientos del día */}
      <Card t={t} style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: t.text }}>Movimientos del {fmtFecha(fecha)}</h3>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Badge t={t} tone="ok" icon={Icon.arrowUp}>{fmtCOP(tot.ing)}</Badge>
            <Badge t={t} tone="danger" icon={Icon.arrowDown}>{fmtCOP(tot.egr)}</Badge>
            <Badge t={t} tone="info" icon={Icon.cash}>Saldo {fmtCOP(tot.saldo)}</Badge>
          </div>
        </div>

        {delDia.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "44px 0", color: t.muted, fontFamily: FONTS.body }}>
            <Icon.cash size={34} />
            <span style={{ fontSize: 15 }}>No hay movimientos en esta fecha todavía.</span>
            <span style={{ fontSize: 13 }}>Registra una venta con el lector o agrega un ingreso manual.</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {delDia.map((m) => {
              const ing = m.tipo === "ingreso";
              const Ic = ing ? Icon.arrowUp : Icon.arrowDown;
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: t.surfaceMuted,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <span style={{ width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center", background: ing ? t.accentSoft : t.dangerSoft, color: ing ? t.accent : t.danger, flexShrink: 0 }}>
                    <Ic size={18} />
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 15, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.concepto}</div>
                    {m.origen === "venta" && <span style={{ fontFamily: FONTS.body, fontSize: 12, color: t.muted }}>Venta registrada con el lector</span>}
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 16, color: ing ? t.accent : t.danger, whiteSpace: "nowrap" }}>
                    {ing ? "+" : "−"} {fmtCOP(m.monto)}
                  </div>
                  <button onClick={() => onEliminar(m.id)} title="Eliminar" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.border}`, background: t.surface, color: t.muted, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Icon.trash size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function Label({ t, children }) {
  return (
    <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 13, color: t.muted, marginBottom: 6 }}>{children}</div>
  );
}
