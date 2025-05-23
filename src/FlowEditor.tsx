import React, { useCallback, useState, useRef } from 'react';
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
import '@xyflow/react/dist/style.css';
import type { ReactFlowInstance } from '@xyflow/react';
import { flowRefs } from '@/contexts/FlowRefs';


// resource panel
import ResourcesPanel from './components/panels/ResourcesPanel';
import { onDragOver, useOnDrop } from './components/panels/DragAndDrop';

// context menu
import ContextMenu from '@/components/ContextMenu/ContextMenu';


const nodeTypes = {
  group: (props) => (
    <div style={{
      background: '#f0f0f0',
      border: '2px dashed #aaa',
      width: '100%',
      height: '100%',
      position: 'relative'
    }}>
      <Handle type="target" position={Position.Top} />
      {props.data?.label || 'Group Node'}
    </div>
  ),
  input: (props) => (
    <div>
      <Handle type="source" position={Position.Bottom} />
      Input Node
    </div>
  ),
  // default: (props) => (
  //   <div>
  //     <Handle type="target" position={Position.Top} />
  //     <Handle type="source" position={Position.Bottom} />
  //     Default Node
  //   </div>
  // ),
  // output: (props) => (
  //   <div style={{width:'32px', height:'32px'}}>
  //     <Handle type="target" position={Position.Top} />
  //     Output Node
  //   </div>
    
  // ),
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
  // context menu
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  // Atualize os refs sempre que mudarem
  React.useEffect(() => {
    flowRefs.reactFlowInstance = reactFlowInstance ?? null;
    flowRefs.setNodes = setNodes;
    flowRefs.nodeTypes = nodeTypes;
  }, [reactFlowInstance, setNodes, nodes, nodeTypes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // drag and drop
  const onDrop = useOnDrop();

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      onDrop(event);
    },
    [onDrop]
  );

  // context menu
  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();
 
      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu],
  );
 
  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
      <div style={{
        width: '100vw',
        height: '100vh',
        flexDirection: 'column',
        display: 'flex'
      }}>
        <ReactFlowProvider>
          <ReactFlow
            ref={ref}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDragOver={(event) => onDragOver(event)}
            onDrop={handleDrop}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
            <ResourcesPanel componentsList={componentsList} />
            {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
          </ReactFlow>
        </ReactFlowProvider>

      </div>

  );
}
