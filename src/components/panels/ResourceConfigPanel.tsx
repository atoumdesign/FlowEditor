import React, { useEffect, useRef, useState } from "react";
import { useReactFlow, Panel } from "@xyflow/react";
import { Accordion } from '@blendmesh/components-ui'

import {
  defaultLambdaProperties,
  defaultEC2InstanceProperties,
  defaultS3BucketProperties,
  defaultAccountProperties,
  defaultVPCProperties,
  defaultPrivateSubnetProperties,
  defaultPublicSubnetProperties,
  defaultRDSMariaDBInstanceProperties,
  defaultRDSMySQLInstanceProperties,
  defaultRDSPostgresInstanceProperties,
  Runtime,
  Architectures,
} from "@/constants";

// Mapeamento dos defaults por tipo
const defaultPropertiesMap = {
  lambdaFunction: defaultLambdaProperties,
  instance: defaultEC2InstanceProperties,
  bucket: defaultS3BucketProperties,
  account: defaultAccountProperties,
  vpc: defaultVPCProperties,
  subnetprivate: defaultPrivateSubnetProperties,
  subnetpublic: defaultPublicSubnetProperties,
  mariaDBInstance: defaultRDSMariaDBInstanceProperties,
  mySQLInstance: defaultRDSMySQLInstanceProperties,
  postgreSQLInstance: defaultRDSPostgresInstanceProperties,
};

function getEnumOptions(enumObj) {
  return Object.entries(enumObj).map(([key, value]) => (
    <option key={value} value={value}>{value}</option>
  ));
}


const MIN_WIDTH = 280;
const MAX_WIDTH = 540;

export default function ResourceConfigPanel({ nodeId, onClose, tabs }) {
  const { getNode, setNodes } = useReactFlow();
  const node = getNode(nodeId);

  // Estado local para as propriedades
  const [localProperties, setLocalProperties] = useState(node?.data?.Properties || {});

  // Estado para ação de duplo clique
  const initialAction = node?.data?.onDoubleClickAction || { type: "tab", value: "" };
  const [actionType, setActionType] = useState(initialAction.type);
  const [actionValue, setActionValue] = useState(initialAction.value);

  // Função para salvar as propriedades editadas
  const handleSaveProperties = () => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? {
            ...n,
            data: {
              ...n.data,
              Properties: {
                ...n.data?.Properties,
                ...localProperties, // Inclui showCommentIcon e comment
              },
              onDoubleClickAction: actionType === "tab"
                ? { type: "tab", value: actionValue }
                : { type: "url", value: actionValue }
            },
          }
          : n
      )
    );
    onClose(); // Fecha o painel após salvar, se desejar
  };

  // Estado local para o label
  const [localLabel, setLocalLabel] = useState(node?.data?.label || "");
  const [width, setWidth] = useState(340);
  const minWidth = 220
  const maxWidth = 350
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
          ? { ...n, data: { ...n.data, Properties: { ...localProperties } } }
          : n
      )
    );
  };

  // Redimensionamento

  const onMouseDown = (e: React.MouseEvent) => {
    resizing.current = true
    startX.current = e.clientX
    startWidth.current = width
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!resizing.current) return
    let newWidth = startWidth.current - (e.clientX - startX.current)
    if (newWidth < minWidth) newWidth = minWidth
    if (newWidth > maxWidth) newWidth = maxWidth
    setWidth(newWidth)
  }

  const onMouseUp = () => {
    resizing.current = false
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onMouseUp)
  }
  // const onMouseDown = (e) => {
  //   e.preventDefault();
  //   resizing.current = true;
  //   startX.current = e.clientX;
  //   startWidth.current = width;
  //   document.body.style.cursor = "ew-resize";
  // };

  // Handler para alteração de propriedades
  const handlePropertyChange = (key, value) => {
    setLocalProperties((prev) => ({ ...prev, [key]: value }));
  };

  // useEffect(() => {
  //   const onMouseMove = (e) => {
  //     if (!resizing.current) return;
  //     const newWidth = Math.min(
  //       Math.max(startWidth.current + (startX.current - e.clientX), MIN_WIDTH),
  //       MAX_WIDTH
  //     );
  //     setWidth(newWidth);
  //   };
  //   const onMouseUp = () => {
  //     resizing.current = false;
  //     document.body.style.cursor = "";
  //   };
  //   if (resizing.current) {
  //     window.addEventListener("mousemove", onMouseMove);
  //     window.addEventListener("mouseup", onMouseUp);
  //     return () => {
  //       window.removeEventListener("mousemove", onMouseMove);
  //       window.removeEventListener("mouseup", onMouseUp);
  //     };
  //   }
  // }, [width]);

  if (!node) return null;

  // Garante que só renderiza as propriedades existentes no node atual
  // const propertyKeys = Object.keys(localProperties);
  const nodeType = node?.type;
  const defaultProperties = defaultPropertiesMap[nodeType] || {};
  const propertyKeys = Object.keys({ ...defaultProperties, ...localProperties });

  const accordionItems = [
    {
      title: "Configurações do recurso",
      content: <div style={{fontSize: 12}}>
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
          {propertyKeys.map((key) => {
            const defaultValue = defaultProperties[key];
            const value = localProperties[key] ?? defaultValue ?? "";
            const isEnum =
              (nodeType === "lambdaFunction" && key === "Runtime") ||
              (nodeType === "lambdaFunction" && key === "Architectures");
            const isRecord =
              (typeof defaultValue === "object" && defaultValue !== null && !Array.isArray(defaultValue));

            return (
              <div key={key} style={{ display: "flex", alignItems: "center", margin: "6px 0" }}>
                <span style={{ width: "40%", minWidth: 80, fontWeight: 500 }}>{key}:</span>
                <div style={{ width: "60%" }}>
                  {/* Enum: select */}
                  {isEnum && key === "Runtime" && (
                    <select
                      value={value}
                      onChange={e => handlePropertyChange(key, e.target.value)}
                      onBlur={commitProperties}
                      style={{ width: "100%" }}
                    >
                      {getEnumOptions(Runtime)}
                    </select>
                  )}
                  {isEnum && key === "Architectures" && (
                    <select
                      value={value}
                      onChange={e => handlePropertyChange(key, e.target.value)}
                      onBlur={commitProperties}
                      style={{ width: "100%" }}
                    >
                      {getEnumOptions(Architectures)}
                    </select>
                  )}
                  {/* Record<string, string>: pares chave/valor */}
                  {isRecord && !(isEnum) && (
                    <div>
                      {Object.entries(value || {}).map(([k, v]) => (
                        <div key={k} style={{ display: "flex", marginBottom: 2 }}>
                          <input
                            type="text"
                            value={k}
                            disabled
                            style={{ width: "40%", marginRight: 4, background: "#f3f3f3", border: "1px solid #eee", borderRadius: 3, fontSize: 13 }}
                          />
                          <input
                            type="text"
                            value={v}
                            onChange={e => {
                              handlePropertyChange(key, { ...value, [k]: e.target.value });
                            }}
                            onBlur={commitProperties}
                            style={{ width: "60%", fontSize: 13 }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Number */}
                  {!isEnum && !isRecord && typeof defaultValue === "number" && (
                    <input
                      type="number"
                      value={value}
                      onChange={e => handlePropertyChange(key, Number(e.target.value))}
                      onBlur={commitProperties}
                      style={{ width: "100%" }}
                    />
                  )}
                  {/* String */}
                  {!isEnum && !isRecord && typeof defaultValue === "string" && (
                    <input
                      type="text"
                      value={value}
                      onChange={e => handlePropertyChange(key, e.target.value)}
                      onBlur={commitProperties}
                      style={{ width: "100%" }}
                    />
                  )}
                  {/* Boolean */}
                  {!isEnum && !isRecord && typeof defaultValue === "boolean" && (
                    <input
                      type="checkbox"
                      checked={!!value}
                      onChange={e => handlePropertyChange(key, e.target.checked)}
                      onBlur={commitProperties}
                      style={{ transform: "scale(1.2)" }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>,
    },
    {
      title: "Link",
      content: <div>
        <div style={{ marginBottom: 12 }}>
          <label>
            <input
              type="radio"
              checked={actionType === "tab"}
              onChange={() => setActionType("tab")}
            /> Abrir Aba
          </label>
          <label style={{ marginLeft: 16 }}>
            <input
              type="radio"
              checked={actionType === "url"}
              onChange={() => setActionType("url")}
            /> Abrir Link
          </label>
        </div>
        {actionType === "tab" ? (
          <select
            value={actionValue}
            onChange={e => setActionValue(e.target.value)}
            style={{ width: "100%", marginBottom: 12 }}
          >
            <option value="">Selecione uma aba</option>
            {tabs.map(tab => (
              <option key={tab.id} value={tab.id}>{tab.name}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={actionValue}
            onChange={e => setActionValue(e.target.value)}
            placeholder="https://..."
            style={{ width: "100%", marginBottom: 12 }}
          />
        )}
      </div>,
    },
    {
      title: "Comentários",
      content: <div style={{ margin: "16px 0" }}>
        <label>
          <input
            type="checkbox"
            checked={!!localProperties.showCommentIcon}
            onChange={e => setLocalProperties(prev => ({ ...prev, showCommentIcon: e.target.checked }))}
          />
          Exibir ícone de comentário relevante
        </label>
        <textarea
          value={localProperties.comment || ""}
          onChange={e => setLocalProperties(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Comentário relevante..."
          style={{ width: "100%", minHeight: 40, marginTop: 4 }}
        />
        <button onClick={handleSaveProperties}>Salvar</button>
        <button onClick={onClose} style={{ marginLeft: 8 }}>Cancelar</button>
      </div>,
    },
    {
      title: "Resumo stado do node",
      content: <pre
        style={{
          background: "#f8f8f8",
          padding: 8,
          borderRadius: 4,
          fontSize: 12
        }}
      >
        {JSON.stringify(node, null, 2)}
      </pre>,
    },
  ];




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
          borderRadius: '0px',
          width: width,
          height: "100vh",
          background: 'transparent',
          minWidth: minWidth,
          maxWidth: maxWidth,
          // borderLeft: "1px solid #eee",
          // boxShadow: "-2px 0 8px #0001",
          zIndex: 1000,
          padding: 4,
          // overflowY: "auto",
          // transition: "width 0.2s",
          // display: "flex",
          // flexDirection: "column",
          userSelect: "none",
        }}
        onClick={e => e.stopPropagation()} // Não fecha ao clicar dentro
      >

        <Accordion
          items={accordionItems}
          defaultOpenIndexes={[0, 2]}
          scrollable={true}
        // maxHeight={250}   // altura máxima do conteúdo aberto (opcional)
        />
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
        {/* <button
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
        </button> */}




      </Panel>
    </>
  );
}