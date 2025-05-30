import React, { useEffect, useRef, useState } from "react";
import { useReactFlow, Panel } from "@xyflow/react";

const MIN_WIDTH = 280;
const MAX_WIDTH = 540;

export default function ResourceConfigPanel({ nodeId, onClose }) {
  const { getNode, setNodes } = useReactFlow();
  const node = getNode(nodeId);

  // Estado local para as propriedades
  const [localProperties, setLocalProperties] = useState(node?.data?.Properties || {});

  // Estado local para o label
  const [localLabel, setLocalLabel] = useState(node?.data?.label || "");
  const [width, setWidth] = useState(340);
  const resizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(width);

  // Sincroniza o label local ao abrir o painel ou mudar node
  useEffect(() => {
    setLocalLabel(node?.data?.label || "");
    setLocalProperties(node?.data?.Properties || {});
  }, [nodeId, node?.data?.label, node?.data?.Properties]);

  // Atualiza o node apenas ao sair do input ou pressionar Enter
  const commitLabel = () => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, label: localLabel } } : n
      )
    );
  };

  // Atualiza as propriedades no node
  const commitProperties = () => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, Properties: { ...localProperties }  } }
          : n
      )
    );
  };

  // Redimensionamento
  const onMouseDown = (e) => {
    e.preventDefault();
    resizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = "ew-resize";
  };

  // Handler para alteração de propriedades
  const handlePropertyChange = (key, value) => {
    setLocalProperties((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!resizing.current) return;
      const newWidth = Math.min(
        Math.max(startWidth.current + (startX.current - e.clientX), MIN_WIDTH),
        MAX_WIDTH
      );
      setWidth(newWidth);
    };
    const onMouseUp = () => {
      resizing.current = false;
      document.body.style.cursor = "";
    };
    if (resizing.current) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [width]);

  if (!node) return null;

  // Garante que só renderiza as propriedades existentes no node atual
  const propertyKeys = Object.keys(localProperties);

  return (
    <>
      {/* Backdrop para fechar ao clicar fora */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          background: "rgba(0,0,0,0.01)",
        }}
        onClick={onClose}
      />
      <Panel
        position="top-right"
        style={{
          width,
          height: "100vh",
          background: "#fff",
          borderLeft: "1px solid #eee",
          boxShadow: "-2px 0 8px #0001",
          zIndex: 1000,
          padding: 24,
          overflowY: "auto",
          transition: "width 0.2s",
          display: "flex",
          flexDirection: "column",
          userSelect: "none",
        }}
        onClick={e => e.stopPropagation()} // Não fecha ao clicar dentro
      >
        {/* Resizer */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 8,
            height: "100%",
            cursor: "ew-resize",
            zIndex: 1001,
            userSelect: "none",
          }}
          onMouseDown={onMouseDown}
        />
        <button
          style={{
            position: "absolute",
            top: 8,
            right: 8,
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
        <h3>Configurações do recurso</h3>
        <div style={{ margin: "16px 0" }}>
          <label>
            Label:
            <input
              type="text"
              name="label"
              value={localLabel}
              onChange={e => setLocalLabel(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  commitLabel();
                  e.target.blur();
                }
              }}
              style={{ width: "100%", marginTop: 4, userSelect: "auto" }}
            />
          </label>
        </div>
        <div style={{ margin: "16px 0" }}>
          <label style={{ fontWeight: 600 }}>Properties:</label>
          {propertyKeys.length === 0 && (
            <div style={{ color: "#888", fontSize: 13 }}>Nenhuma propriedade definida.</div>
          )}
          {propertyKeys.map((key) => (
            <div key={key} style={{ margin: "6px 0" }}>
              <span style={{ width: 80, display: "inline-block" }}>{key}:</span>
              <input
                type="text"
                value={localProperties[key] ?? ""}
                onChange={e => handlePropertyChange(key, e.target.value)}
                onBlur={commitProperties}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    commitProperties();
                    e.target.blur();
                  }
                }}
                style={{ width: 140, fontSize: 13 }}
              />
            </div>
          ))}
        </div>
        <pre style={{ background: "#f8f8f8", padding: 8, borderRadius: 4 }}>
          {JSON.stringify(node.data, null, 2)}
        </pre>
      </Panel>
    </>
  );
}