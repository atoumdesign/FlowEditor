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
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { OnNodeDrag, ReactFlowInstance } from '@xyflow/react';
import { flowRefs } from '@/contexts/FlowRefs';

// resource panel
import ResourcesPanel from './components/panels/ResourcesPanel';
import { onDragOver, onDrop } from './components/panels/DragAndDrop';

// context menu
import ContextMenu from '@/components/ContextMenu/ContextMenu';


// group nodes
import Account from '@/components/nodes/Groups/Account'
import VPC from '@/components/nodes/Groups/VPC'
import PrivateSubnet from '@/components/nodes/Groups/PrivateSubnet';
import PublicSubnet from './components/nodes/Groups/PublicSubnet';
import StatePanel from './components/panels/StatePanel';
import LambdaFunction from './components/nodes/Resources/LambdaFunction';

const nodeTypes = {
  account: Account,
  vpc: VPC,
  subnetprivate: PrivateSubnet,
  subnetpublic: PublicSubnet,
  lambdaFunction: LambdaFunction,
  input: (props) => (
    <div>
      <Handle type="source" position={Position.Bottom} />
      Input Node
    </div>
  ),
};


// Gera nodeTypes dinamicamente a partir do componentsList, se necessário
// const nodeTypes = Object.fromEntries(
//   componentsList.flatMap(group =>
//     group.components.map(c => [c.type, ...])
//   )
// );

function reorderNodesByType(nodes) {
  // Define a ordem desejada para os tipos
  const typeOrder = {
    account: 0,
    vpc: 1,
    subnetprivate: 2,
    subnetpublic: 2,
  };

  // Ordena os nodes conforme a ordem acima, mantendo os demais no final
  return [...nodes].sort((a, b) => {
    const aOrder = typeOrder[a.type] ?? 99;
    const bOrder = typeOrder[b.type] ?? 99;
    return aOrder - bOrder;
  });
}


export default function FlowEditor({ initialState, componentsList }) {
  const { getIntersectingNodes } = useReactFlow()
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialState.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialState.edges);



  // Atualize os refs sempre que mudarem
  React.useEffect(() => {
    flowRefs.reactFlowInstance = reactFlowInstance ?? null;
    flowRefs.setNodes = setNodes;
    flowRefs.nodeTypes = nodeTypes;
  }, [reactFlowInstance, setNodes, nodes, nodeTypes]);

  // adiciona as ligações entre os nodes no estado 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );


  // ini - context menu /////////////////////////////////////////////////////
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

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

  // fim - context menu /////////////////////////////////////////////////////


  // ini - adicionar node como filho /////////////////////////////////////////////////////

  // Ref para guardar o node sobreposto durante o drag
  const overlappingNodeRef = useRef<Node | null>(null);

  // Ref para guardar o deslocamento do mouse em relação ao topo/esquerda do node
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Captura o deslocamento no início do arrasto
  const onNodeDragStart: OnNodeDrag = useCallback(
    (event, dragNode) => {
      // Calcula o offset do mouse em relação ao topo/esquerda do node
      const nodeRect = event.target.getBoundingClientRect();
      dragOffsetRef.current = {
        x: event.clientX - nodeRect.left,
        y: event.clientY - nodeRect.top,
      };
    },
    []
  );

  // Arrastar: detecta node sobreposto e pode sinalizar visualmente
  const onNodeDrag: OnNodeDrag = useCallback(
    (event, dragNode) => {
      // const overlappingNode = getIntersectingNodes(dragNode)?.[0];
      const overlappingNode = getIntersectingNodes(dragNode)?.pop();
      overlappingNodeRef.current = overlappingNode;

      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === dragNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                // Aqui você pode adicionar lógica visual se quiser
                isOverlapping: !!overlappingNode,
              },
            };
          }
          return node;
        })
      );
    },
    [getIntersectingNodes, setNodes]
  );

  // Soltar: torna filho do node sobreposto (basegroup) ou remove do grupo
  const onNodeDragStop: OnNodeDrag = useCallback(
    (event, dragNode) => {

      if(
        dragNode.type === 'account' ||
        dragNode.type === 'vpc' ||
        dragNode.type === 'subnetprivate' ||
        dragNode.type === 'subnetpublic'
      ){
        return
      }
      const overlappingNode = overlappingNodeRef.current;
      console.log('overlappingNode = > ' + JSON.stringify(overlappingNode, null, 2))
      console.log('dragNode = > ' + JSON.stringify(dragNode, null, 2))


      if (!reactFlowInstance) return; // <-- Adicione esta linha

      if (overlappingNode) {
        setNodes((prevNodes) => {
          const updatedNodes = prevNodes.map((node) => {
            if (node.id === dragNode.id) {
              return {
                ...node,
                parentId: overlappingNode.id,
                extent: 'parent',
              };
            }
            return node;
          });
          return updatedNodes;
        })
      }
       else {
        setNodes((prevNodes) =>
          prevNodes.map((node) => {
            if (node.id === dragNode.id) {
              return {
                ...node,
                parentId: undefined,
                extent: undefined,
              };
            }
            return node;
          })
        );
      }
    },
    [reactFlowInstance, setNodes]
  );

  // fim - adicionar node como filho /////////////////////////////////////////////////////

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      flexDirection: 'column',
      display: 'flex'
    }}>
      <ReactFlow
        ref={ref}
        nodes={nodes} // armazena os nodes dos recursos
        edges={edges} // armazena as ligações entre os recursos
        nodeTypes={nodeTypes} // Tipos de nós personalizados disponíveis em um fluxo.
        onNodesChange={onNodesChange} // Use este manipulador de eventos para adicionar interatividade a um fluxo controlado. Ele é chamado ao arrastar, selecionar e mover um nó.
        onEdgesChange={onEdgesChange} // Use este manipulador de eventos para adicionar interatividade a um fluxo controlado. Ele é chamado na seleção e remoção de arestas.
        onConnect={onConnect} // adiciona as novas ligações entre os nodes em edges
        onInit={setReactFlowInstance} // O onInitretorno de chamada é chamado quando a viewport é inicializada. Nesse ponto, você pode usar a instância para chamar métodos como fitViewou zoomTo.

        onDragOver={(event) => onDragOver(event)} // a dragged item is being dragged over a valid drop target, every few hundred milliseconds.
        onDrop={onDrop} // an item is dropped on a valid drop target

        onNodeDrag={onNodeDrag} // Arrastar: detecta node sobreposto e pode sinalizar visualmente
        onNodeDragStop={onNodeDragStop} // Soltar: torna filho do node sobreposto (basegroup) ou remove do grupo
        onNodeDragStart={onNodeDragStart}

        onPaneClick={onPaneClick} // Este manipulador de eventos é chamado quando o usuário clica dentro do painel.
        onNodeContextMenu={onNodeContextMenu} // Este manipulador de eventos é chamado quando um usuário clica com o botão direito em um nó.


        fitView // o fluxo será ampliado e panorâmico para ajustar todos os nós fornecidos inicialmente
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <ResourcesPanel componentsList={componentsList} />
        <StatePanel />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </div>
  );
}
