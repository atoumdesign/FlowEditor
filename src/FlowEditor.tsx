import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Handle,
  Position,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider
} from '@xyflow/react';

import type { ReactFlowInstance } from '@xyflow/react';
import { flowRefs } from '@/contexts/FlowRefs';


import '@xyflow/react/dist/style.css';
import ResourcesPanel from './components/panels/ResourcesPanel';
import { onDragOver, useOnDrop } from './components/panels/DragAndDrop';


const nodeTypes = {
  input: (props) => (
    <div>
      <Handle type="source" position={Position.Bottom} />
      Input Node
    </div>
  ),
  default: (props) => (
    <div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      Default Node
    </div>
  ),
  output: (props) => (
    <div>
      <Handle type="target" position={Position.Top} />
      Output Node
    </div>
  ),
};

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

  // Atualize os refs sempre que mudarem
  React.useEffect(() => {
    flowRefs.reactFlowInstance = reactFlowInstance ?? null;
    flowRefs.setNodes = setNodes;
    flowRefs.nodeTypes = nodeTypes;
  }, [reactFlowInstance, setNodes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // O hook useOnDrop agora já usa o contexto para acessar nodeTypes, reactFlowInstance e setNodes
  const onDrop = useOnDrop();

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      onDrop(event);
    },
    [onDrop]
  );

  return (
      <div style={{
        width: '100vw',
        height: '100vh',
        flexDirection: 'column',
        display: 'flex'
      }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
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
