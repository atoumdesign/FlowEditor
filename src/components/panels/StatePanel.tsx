import React, { useState } from "react";
import { useReactFlow } from "@xyflow/react";
import "./StatePanel.css"; // Crie um CSS simples para o painel

const StatePanel = () => {
  const { getNodes, getEdges } = useReactFlow();
  const [visible, setVisible] = useState(false);

  return (
    <div className={`state-panel${visible ? "" : " state-panel--hidden"}`}>
      <button
        className="state-panel__toggle"
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? "Ocultar estado" : "Mostrar estado"}
      </button>
      {visible && (
        <div className="state-panel__content">
          <h4>Nodes</h4>
          <pre>{JSON.stringify(getNodes(), null, 2)}</pre>
          <h4>Edges</h4>
          <pre>{JSON.stringify(getEdges(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default StatePanel;