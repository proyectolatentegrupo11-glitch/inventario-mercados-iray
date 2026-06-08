import React from "react";
import { FONTS } from "../lib/theme.js";
import { Icon, Card, Badge, Button } from "./ui.jsx";
import { fmtCOP, fmtNum, fmtFecha, estadoStock, estadoVencimiento, hoyISO } from "../lib/format.js";

function Kpi({ t, label, value, sub, icon: Ico, tone }) {
  const colors = {
    accent: { ring: t.accent, soft: t.accentSoft },
    blue: { ring: t.blue, soft: t.blueSoft },
    warn: { ring: t.warn, soft: t.warnSoft },
    danger: { ring: t.danger, soft: t.dangerSoft },
  }[tone || "accent"];
  return (
    <Card t={t} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontFamily: FONTS.body, fontSize: 14.5, fontWeight: 600, color: t.muted }}>{label}</span>
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: 11,
            display: "grid",
            placeItems: "center",
            background: colors.soft,
            color: colors.ring,
          }}
        >
          <Ico size={22} />
        </span>
      </div>
      <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 34, lineHeight: 1, color: t.text }}>
        {value}
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: 13.5, color: t.muted }}>{sub}</div>
    </Card>
  );
}

function AlertRow({ t, nombre, codigo, right, tone }) {
  const bd = { warn: t.warnBorder, danger: t.dangerBorder }[tone] || t.border;
  const bg = { warn: t.warnSoft, danger: t.dangerSoft }[tone] || t.surfaceMuted;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "11px 14px",
        borderRadius: 12,
        background: bg,
        border: `1px solid ${bd}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 15, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {nombre}
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: t.muted }}>{codigo}</div>
      </div>
      <div style={{ flexShrink: 0 }}>{right}</div>
    </div>
  );
}

export function Dashboard({ t, productos, caja, diasAlerta, onVerInventario }) {
  const hoy = hoyISO();

  const stats = React.useMemo(() => {
    let valor = 0,
      bajos = 0,
      agotados = 0,
      porVencer = 0,
      vencidos = 0;
    const listaVence = [];
    const listaStock = [];
    for (const p of productos) {
      valor += (Number(p.precio) || 0) * (Number(p.stock) || 0);
      const es = estadoStock(p.stock, p.minimo);
      if (es.nivel === "agotado") agotados++;
      else if (es.nivel === "bajo") bajos++;
      if (es.nivel !== "ok") listaStock.push({ p, es });

      const ev = estadoVencimiento(p.vencimiento, diasAlerta);
      if (ev.nivel === "vencido") vencidos++;
      else if (ev.nivel === "por_vencer") porVencer++;
      if (ev.nivel === "vencido" || ev.nivel === "por_vencer") listaVence.push({ p, ev });
    }
    listaVence.sort((a, b) => (a.ev.dias ?? 999) - (b.ev.dias ?? 999));
    listaStock.sort((a, b) => (a.p.stock || 0) - (b.p.stock || 0));
    return { valor, bajos, agotados, porVencer, vencidos, listaVence, listaStock };
  }, [productos, diasAlerta]);

  const cajaHoy = React.useMemo(() => {
    let ing = 0,
      egr = 0;
    for (const m of caja) {
      if (m.fecha !== hoy) continue;
      if (m.tipo === "ingreso") ing += Number(m.monto) || 0;
      else egr += Number(m.monto) || 0;
    }
    return { ing, egr, saldo: ing - egr };
  }, [caja, hoy]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 14,
        }}
      >
        <Kpi t={t} label="Productos en catálogo" value={fmtNum(productos.length)} sub="Referencias registradas" icon={Icon.box} tone="blue" />
        <Kpi
          t={t}
          label="Por vencer pronto"
          value={fmtNum(stats.porVencer)}
          sub={stats.vencidos ? `${stats.vencidos} ya vencido(s)` : `Próximos ${diasAlerta} días`}
          icon={Icon.clock}
          tone={stats.porVencer || stats.vencidos ? "danger" : "accent"}
        />
        <Kpi
          t={t}
          label="Stock bajo o agotado"
          value={fmtNum(stats.bajos + stats.agotados)}
          sub={stats.agotados ? `${stats.agotados} agotado(s)` : "Necesitan reabastecer"}
          icon={Icon.alert}
          tone={stats.bajos + stats.agotados ? "warn" : "accent"}
        />
        <Kpi t={t} label="Valor del inventario" value={fmtCOP(stats.valor)} sub="Precio de venta × stock" icon={Icon.tag} tone="accent" />
      </div>

      {/* Caja del día */}
      <Card t={t} style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Icon.cash size={20} style={{ color: t.accent }} />
          <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: t.text }}>Caja de hoy</h3>
          <span style={{ marginLeft: "auto", fontFamily: FONTS.body, fontSize: 13, color: t.muted }}>{fmtFecha(hoy)}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {[
            { l: "Ingresos", v: cajaHoy.ing, c: t.accent, ic: Icon.arrowUp },
            { l: "Egresos", v: cajaHoy.egr, c: t.danger, ic: Icon.arrowDown },
            { l: "Saldo del día", v: cajaHoy.saldo, c: t.blue, ic: Icon.cash },
          ].map((b) => {
            const Ic = b.ic;
            return (
              <div key={b.l} style={{ padding: "14px 16px", borderRadius: 13, background: t.surfaceMuted, border: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, color: b.c, marginBottom: 8 }}>
                  <Ic size={17} />
                  <span style={{ fontFamily: FONTS.body, fontSize: 13.5, fontWeight: 600 }}>{b.l}</span>
                </div>
                <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 22, color: t.text }}>{fmtCOP(b.v)}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Listas de alertas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <Card t={t} style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Icon.clock size={20} style={{ color: t.danger }} />
            <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: 17, fontWeight: 700, color: t.text }}>Control de vencimientos</h3>
            <span style={{ marginLeft: "auto" }}>
              <Badge t={t} tone={stats.listaVence.length ? "danger" : "ok"}>{stats.listaVence.length}</Badge>
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {stats.listaVence.length === 0 && <Vacio t={t} texto="Ningún producto próximo a vencer. Todo en orden." />}
            {stats.listaVence.slice(0, 6).map(({ p, ev }) => (
              <AlertRow
                key={p.id}
                t={t}
                nombre={p.nombre}
                codigo={p.codigo}
                tone={ev.nivel === "vencido" ? "danger" : "warn"}
                right={<Badge t={t} tone={ev.nivel === "vencido" ? "danger" : "warn"} icon={Icon.clock}>{ev.label}</Badge>}
              />
            ))}
          </div>
        </Card>

        <Card t={t} style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Icon.alert size={20} style={{ color: t.warn }} />
            <h3 style={{ margin: 0, fontFamily: FONTS.display, fontSize: 17, fontWeight: 700, color: t.text }}>Reabastecer pronto</h3>
            <span style={{ marginLeft: "auto" }}>
              <Badge t={t} tone={stats.listaStock.length ? "warn" : "ok"}>{stats.listaStock.length}</Badge>
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {stats.listaStock.length === 0 && <Vacio t={t} texto="Todos los productos tienen stock suficiente." />}
            {stats.listaStock.slice(0, 6).map(({ p, es }) => (
              <AlertRow
                key={p.id}
                t={t}
                nombre={p.nombre}
                codigo={p.codigo}
                tone={es.nivel === "agotado" ? "danger" : "warn"}
                right={
                  <Badge t={t} tone={es.nivel === "agotado" ? "danger" : "warn"} icon={Icon.box}>
                    {p.stock} / mín {p.minimo}
                  </Badge>
                }
              />
            ))}
          </div>
        </Card>
      </div>

      <div>
        <Button t={t} variant="soft" icon={Icon.box} onClick={onVerInventario}>
          Ver todo el inventario
        </Button>
      </div>
    </div>
  );
}

function Vacio({ t, texto }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 16px",
        borderRadius: 12,
        background: t.accentSoft,
        color: t.accentText,
        fontFamily: FONTS.body,
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      <Icon.check size={18} />
      {texto}
    </div>
  );
}
