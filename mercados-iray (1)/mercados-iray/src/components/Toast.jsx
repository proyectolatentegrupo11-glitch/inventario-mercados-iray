import React from "react";
import { FONTS } from "../lib/theme.js";
import { Icon } from "./ui.jsx";

export function ToastStack({ t, toasts }) {
  const tones = {
    ok: { bg: t.accent, ic: Icon.check },
    info: { bg: t.blue, ic: Icon.info },
    warn: { bg: t.warn, ic: Icon.alert },
    danger: { bg: t.danger, ic: Icon.alert },
  };
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 200,
        width: "min(440px, calc(100vw - 32px))",
      }}
    >
      {toasts.map((to) => {
        const cfg = tones[to.tone] || tones.ok;
        const Ic = cfg.ic;
        return (
          <div
            key={to.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 18px",
              borderRadius: 14,
              background: cfg.bg,
              color: "#fff",
              fontFamily: FONTS.body,
              fontSize: 15,
              fontWeight: 600,
              boxShadow: "0 12px 34px rgba(0,0,0,.28)",
              animation: "irayToastIn .35s cubic-bezier(.34,1.4,.64,1)",
            }}
          >
            <Ic size={22} />
            <span style={{ lineHeight: 1.3 }}>{to.msg}</span>
          </div>
        );
      })}
    </div>
  );
}

// Hook simple para manejar las notificaciones.
export function useToasts() {
  const [toasts, setToasts] = React.useState([]);
  const push = React.useCallback((msg, tone = "ok") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((cur) => [...cur, { id, msg, tone }]);
    setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== id)), 2800);
  }, []);
  return { toasts, push };
}
