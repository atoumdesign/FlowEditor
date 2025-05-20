import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider
} from '@xyflow/react';

import type { ReactFlowInstance } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import ResourcesPanel from './components/panels/ResourcesPanel';
import { onDragOver, onDrop } from './components/panels/DragAndDrop';


// const nodeTypes = {
//   input: (props) => <div style={{ background: '#e0e0e0', padding: 10 }}>Input Node</div>,
//   default: (props) => <div style={{ background: '#fff', padding: 10 }}>Default Node</div>,
//   output: (props) => <div style={{ background: '#e0e0e0', padding: 10 }}>Output Node</div>,
//   // Adicione outros tipos conforme necessário
// };

// Gera nodeTypes dinamicamente a partir do componentsList, se necessário
// const nodeTypes = Object.fromEntries(
//   componentsList.flatMap(group =>
//     group.components.map(c => [c.type, ...])
//   )
// );

export default function FlowEditor({ initialState, componentsList }) {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialState.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialState.edges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      if (!reactFlowInstance) return;
      const newNode = onDrop(event as unknown as DragEvent, reactFlowInstance);
      if (newNode) {
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          onDragOver={(event) => onDragOver(event)}
          onDrop={handleDrop}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          <ResourcesPanel componentsList={componentsList} />
        </ReactFlow>
      </ReactFlowProvider>

    </div>
  );
}
