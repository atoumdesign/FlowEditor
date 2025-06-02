import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

// Tipos esperados
type Tab = {
  id: string;
  name: string;
  nodes: any[];
};

type Project3DMapProps = {
  tabs: Tab[];
  onBack?: () => void;
};

function Floor({ y, nodes, onSelectNode, selectedNodeId }) {
  // Cada node vira um "box" no andar
  return (
    <group position={[0, y, 0]}>
      {nodes.map((node, i) => (
        <mesh
          key={node.id}
          position={[i * 3 - nodes.length, 0, 0]}
          onClick={() => onSelectNode(node)}
        >
          <boxGeometry args={[2, 0.5, 2]} />
          <meshStandardMaterial color={selectedNodeId === node.id ? "#ffb300" : "#2196f3"} />
          <Html center distanceFactor={8}>
            <div style={{ background: "#fff", padding: 2, borderRadius: 3, fontSize: 12 }}>
              {node.data?.label || node.type}
            </div>
          </Html>
        </mesh>
      ))}
    </group>
  );
}

export default function Project3DMap({ tabs, onBack }: Project3DMapProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Lista de tipos únicos
  const allTypes = useMemo(
    () =>
      Array.from(
        new Set(tabs.flatMap(tab => tab.nodes.map(node => node.type)))
      ),
    [tabs]
  );

  // Filtra nodes por tipo e busca
  const filteredTabs = useMemo(() => {
    return tabs.map(tab => ({
      ...tab,
      nodes: tab.nodes.filter(
        node =>
          (!typeFilter || node.type === typeFilter) &&
          (!search ||
            (node.data?.label || "")
              .toLowerCase()
              .includes(search.toLowerCase()))
      ),
    }));
  }, [tabs, typeFilter, search]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc" }}>
      {/* Painel lateral de busca e propriedades */}
      <div style={{ width: 320, padding: 24, borderRight: "1px solid #e5e7eb", background: "#fff" }}>
        <div style={{ marginBottom: 16 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                padding: "6px 18px",
                borderRadius: 4,
                border: "1px solid #bbb",
                background: "#fff",
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              Voltar para Fluxo
            </button>
          )}
        </div>
        <h2 style={{ marginTop: 0 }}>Mapa 3D do Projeto</h2>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 6, borderRadius: 4, border: "1px solid #ddd" }}
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 6, borderRadius: 4, border: "1px solid #ddd" }}
        >
          <option value="">Todos os tipos</option>
          {allTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {selectedNode && (
          <div style={{ marginTop: 24 }}>
            <h4>Propriedades</h4>
            <pre style={{ fontSize: 12, background: "#f3f4f6", padding: 8, borderRadius: 4 }}>
              {JSON.stringify(selectedNode.data?.Properties || selectedNode.data, null, 2)}
            </pre>
          </div>
        )}
        <div style={{ marginTop: 32, fontSize: 12, color: "#888" }}>
          <b>Dica:</b> Clique em um recurso para ver detalhes.<br />
          Cada andar representa uma aba do projeto.
        </div>
      </div>
      {/* Canvas 3D */}
      <div style={{ flex: 1, background: "#e3eaf2" }}>
        <Canvas camera={{ position: [0, 10, 20], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 20, 10]} intensity={0.5} />
          <OrbitControls />
          {/* Gera um "andar" para cada aba */}
          {filteredTabs.map((tab, idx) => (
            <Floor
              key={tab.id}
              y={idx * 3}
              nodes={tab.nodes}
              onSelectNode={setSelectedNode}
              selectedNodeId={selectedNode?.id}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
}