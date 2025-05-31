import React from "react";

export default function ExamplesModal({ models, onSelect, onClose }) {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          minWidth: 520,
          minHeight: 320,
          padding: 32,
          boxShadow: "0 8px 32px #0003",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
          }}
          onClick={onClose}
          title="Fechar"
        >
          ×
        </button>
        <h2 style={{ marginBottom: 24 }}>Escolha um exemplo</h2>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {Object.entries(models).map(([key, model]) => (
            <div
              key={key}
              onClick={() => setSelected(key)}
              style={{
                border: selected === key ? "2px solid #0078d4" : "1px solid #ccc",
                borderRadius: 6,
                padding: 8,
                cursor: "pointer",
                background: selected === key ? "#f0f8ff" : "#fafafa",
                width: 120,
                textAlign: "center",
                boxShadow: selected === key ? "0 0 0 2px #0078d4" : undefined,
                transition: "border 0.2s, box-shadow 0.2s",
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 60,
                  background: "#f5f5f5",
                  margin: "0 auto 8px auto",
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#888",
                }}
              >
                {/* Miniatura simples: mostra quantidade de nodes */}
                {model.nodes.length} nodes
              </div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{key}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, textAlign: "right" }}>
          <button
            disabled={!selected}
            style={{
              padding: "8px 24px",
              fontSize: 15,
              background: selected ? "#0078d4" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: selected ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
            onClick={() => selected && onSelect(selected)}
          >
            Abrir
          </button>
        </div>
      </div>
    </div>
  );
}