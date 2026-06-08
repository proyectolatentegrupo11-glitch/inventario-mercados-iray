import React from "react";
import { FONTS } from "../lib/theme.js";
import { Icon } from "./ui.jsx";

// Barra de escaneo siempre activa. Los lectores físicos "escriben" el código
// y terminan con Enter; este campo escucha ese evento y dispara onScan.
export function ScannerBar({ t, onScan, scanInputRef }) {
  const [val, setVal] = React.useState("");
  const [pulse, setPulse] = React.useState(false);

  const submit = () => {
    const code = val.trim();
    if (!code) return;
    onScan(code);
    setVal("");
    setPulse(true);
    setTimeout(() => setPulse(false), 350);
  };

  // Vuelve el foco al campo cuando se hace clic en una zona vacía,
  // para que el lector físico siempre escriba aquí.
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderRadius: 16,
        background: t.accentSoft,
        border: `2px solid ${pulse ? t.accent : t.accent + "55"}`,
        transition: "border-color .25s ease, box-shadow .25s ease",
        boxShadow: pulse ? `0 0 0 4px ${t.accent}22` : "none",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          background: t.accent,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        <Icon.scan size={26} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 13,
            color: t.accentText,
            letterSpacing: 0.3,
            textTransform: "uppercase",
            marginBottom: 2,
          }}
        >
          Escanear o escribir código
        </div>
        <input
          ref={scanInputRef}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Pase el producto por el lector y presione Enter…"
          inputMode="numeric"
          autoFocus
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            outline: "none",
            fontFamily: FONTS.mono,
            fontWeight: 600,
            fontSize: 19,
            color: t.text,
            letterSpacing: 0.5,
          }}
        />
      </div>
      <button
        onClick={submit}
        title="Buscar código"
        style={{
          flexShrink: 0,
          padding: "12px 20px",
          borderRadius: 12,
          border: "none",
          background: t.accent,
          color: "#fff",
          fontFamily: FONTS.display,
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Icon.search size={18} /> Buscar
      </button>
    </div>
  );
}
