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

// ResourceConfigPanel
import ResourceConfigPanel from './components/panels/ResourceConfigPanel';
import TopMenuBar from './components/panels/TopMenuBar';
import { predefinedModels } from '@/constants'; 
import ExamplesModal from './components/panels/ExamplesModal';

// group nodes
import Account from '@/components/nodes/Groups/Account'
import VPC from '@/components/nodes/Groups/VPC'
import PrivateSubnet from '@/components/nodes/Groups/PrivateSubnet';
import PublicSubnet from './components/nodes/Groups/PublicSubnet';
import StatePanel from './components/panels/StatePanel';
import LambdaFunction from './components/nodes/Resources/Compute/LambdaFunction';
import Bucket from './components/nodes/Resources/Storage/Bucket';
import Instance from './components/nodes/Resources/Compute/Instance';
import MariaDBInstance from './components/nodes/Resources/Database/MariaDBInstance';
import MySQLInstance from './components/nodes/Resources/Database/MySQLInstance';
import PostgreSQLInstance from './components/nodes/Resources/Database/PostgreSQLInstance';

const nodeTypes = {
  account: Account,
  vpc: VPC,
  subnetprivate: PrivateSubnet,
  subnetpublic: PublicSubnet,
  lambdaFunction: LambdaFunction,
  bucket: Bucket,
  instance: Instance,
  mariaDBInstance: MariaDBInstance,
  mySQLInstance: MySQLInstance,
  postgreSQLInstance: PostgreSQLInstance
};

const defaultEdgeOptions = {
  zIndex: 2000,
}


// Gera nodeTypes dinamicamente a partir do componentsList, se necessário
// const nodeTypes = Object.fromEntries(
//   componentsList.flatMap(group =>
//     group.components.map(c => [c.type, ...])
//   )
// );


export default function FlowEditor({ initialState, componentsList }) {
  const { getIntersectingNodes } = useReactFlow()
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialState.nodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialState.edges);

  // Estado para edição do nome da aba
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState<string>("");

  const [configPanelNodeId, setConfigPanelNodeId] = useState<string | null>(null);
  const [showExamples, setShowExamples] = React.useState(false);

  // Estado para múltiplas abas
  const [tabs, setTabs] = useState([
    {
      id: 'tab-1',
      name: 'Fluxo 1',
      nodes: initialState.nodes,
      edges: initialState.edges,
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');



  // Helpers para encontrar e atualizar a aba ativa
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  function updateActiveTabNodes(nodes) {
    setTabs(tabs =>
      tabs.map(tab =>
        tab.id === activeTabId ? { ...tab, nodes } : tab
      )
    );
  }
  function updateActiveTabEdges(edges) {
    setTabs(tabs =>
      tabs.map(tab =>
        tab.id === activeTabId ? { ...tab, edges } : tab
      )
    );
  }



// Hooks do ReactFlow para a aba ativa
  const [nodes, setNodes, onNodesChange] = useNodesState(activeTab?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(activeTab?.edges || []);


  // Sincroniza nodes/edges do ReactFlow com a aba ativa
  React.useEffect(() => {
    setNodes(activeTab?.nodes || []);
    setEdges(activeTab?.edges || []);
    // eslint-disable-next-line
  }, [activeTabId]);

  React.useEffect(() => {
    if (activeTab) {
      updateActiveTabNodes(nodes);
      updateActiveTabEdges(edges);
    }
     
  }, [nodes, edges]);






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
        bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
        onOpenConfig: () => setConfigPanelNodeId(node.id),
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

function handleTest(msg) {
  alert(`Exemplo de alerta: você clicou em ${msg}!`);
}

// Função para exportar o estado atual (nodes e edges)
function handleExport() {
  const exportData = {
    nodes,
    edges,
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "flow-export.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Função para importar um estado e exibir na tela
function handleImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        if (json.nodes && json.edges) {
          setNodes(json.nodes);
          setEdges(json.edges);
        } else {
          alert("Arquivo inválido: não contém nodes e edges.");
        }
      } catch (err) {
        alert("Erro ao importar arquivo: " + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Função para importar um modelo predefinido pelo nome
function handleExample(modelName) {
  const model = predefinedModels[modelName];
  if (!model) {
    alert("Modelo não encontrado!");
    return;
  }
  if (model.nodes && model.edges) {
    setNodes(model.nodes);
    setEdges(model.edges);
  } else {
    alert("Modelo inválido: não contém nodes e edges.");
  }
}

  function handleExampleOpen() {
    setShowExamples(true);
  }

  function handleExampleSelect(modelName) {
    const model = predefinedModels[modelName];
    if (model && model.nodes && model.edges) {
      setNodes(model.nodes);
      setEdges(model.edges);
      setShowExamples(false);
    } else {
      alert("Modelo inválido!");
    }
  }

    // Exporta todas as abas em um único arquivo
  function handleExportAllTabs() {
    const exportData = tabs.map(tab => ({
      id: tab.id,
      name: tab.name,
      nodes: tab.nodes,
      edges: tab.edges,
    }));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "flow-multi-tabs-export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  // Importa várias abas de um arquivo
  function handleImportAllTabs() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const json = JSON.parse(evt.target.result);
          if (Array.isArray(json) && json[0]?.nodes && json[0]?.edges) {
            setTabs(json.map((tab, idx) => ({
              id: tab.id || `tab-${idx + 1}`,
              name: tab.name || `Fluxo ${idx + 1}`,
              nodes: tab.nodes,
              edges: tab.edges,
            })));
            setActiveTabId(json[0].id || 'tab-1');
          } else {
            alert("Arquivo inválido: não contém abas válidas.");
          }
        } catch (err) {
          alert("Erro ao importar arquivo: " + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  // Adiciona uma nova aba
  function handleAddTab() {
    const newId = `tab-${tabs.length + 1}`;
    setTabs([
      ...tabs,
      {
        id: newId,
        name: `Fluxo ${tabs.length + 1}`,
        nodes: [],
        edges: [],
      }
    ]);
    setActiveTabId(newId);
  }

  // Fecha uma aba
  function handleCloseTab(tabId) {
    if (tabs.length === 1) return; // Não fecha a última aba
    const idx = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[Math.max(0, idx - 1)].id);
    }
  }

  // Abrir exemplo em nova aba
  function handleExampleSelect(modelName) {
    const model = predefinedModels[modelName];
    if (model && model.nodes && model.edges) {
      const newId = `tab-${tabs.length + 1}`;
      setTabs([
        ...tabs,
        {
          id: newId,
          name: modelName,
          nodes: model.nodes,
          edges: model.edges,
        }
      ]);
      setActiveTabId(newId);
      setShowExamples(false);
    } else {
      alert("Modelo inválido!");
    }
  }

    // Função para iniciar edição
  function handleStartEditTab(tabId: string, currentName: string) {
    setEditingTabId(tabId);
    setEditingTabName(currentName);
  }

  // Função para salvar novo nome
  function handleSaveTabName() {
    if (!editingTabId) return;
    setTabs(tabs =>
      tabs.map(tab =>
        tab.id === editingTabId ? { ...tab, name: editingTabName.trim() || tab.name } : tab
      )
    );
    setEditingTabId(null);
    setEditingTabName("");
  }

  // Função para cancelar edição
  function handleCancelEditTab() {
    setEditingTabId(null);
    setEditingTabName("");
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      flexDirection: 'column',
      display: 'flex',
      paddingTop: 36,
      boxSizing: 'border-box'
    }}>

      {/* Abas */}
      <div style={{
        display: "flex",
        alignItems: "center",
        background: "#f8f8f8",
        borderBottom: "1px solid #ddd",
        height: 32,
        paddingLeft: 8,
        zIndex: 99,
      }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            style={{
              padding: "6px 18px",
              marginRight: 4,
              background: tab.id === activeTabId ? "#fff" : "#eee",
              border: tab.id === activeTabId ? "1px solid #bbb" : "1px solid #ddd",
              borderBottom: tab.id === activeTabId ? "none" : "1px solid #ddd",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              position: "relative",
              fontWeight: tab.id === activeTabId ? 600 : 400,
            }}
            onClick={() => setActiveTabId(tab.id)}
            onDoubleClick={e => {
              e.stopPropagation();
              handleStartEditTab(tab.id, tab.name);
            }}
          >
            {editingTabId === tab.id ? (
              <input
                autoFocus
                value={editingTabName}
                onChange={e => setEditingTabName(e.target.value)}
                onBlur={handleSaveTabName}
                onKeyDown={e => {
                  if (e.key === "Enter") handleSaveTabName();
                  if (e.key === "Escape") handleCancelEditTab();
                }}
                style={{
                  fontSize: 14,
                  padding: "2px 6px",
                  borderRadius: 4,
                  border: "1px solid #bbb",
                  minWidth: 60,
                }}
              />
            ) : (
              tab.name
            )}
            {tabs.length > 1 && (
              <span
                style={{
                  marginLeft: 8,
                  color: "#888",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
                onClick={e => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }}
                title="Fechar aba"
              >×</span>
            )}
          </div>
        ))}
        <button
          style={{
            marginLeft: 8,
            padding: "2px 10px",
            fontSize: 18,
            border: "none",
            background: "#eee",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={handleAddTab}
          title="Nova aba"
        >+</button>
        <button
          style={{
            marginLeft: 16,
            padding: "2px 10px",
            fontSize: 14,
            border: "none",
            background: "#eee",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={handleExportAllTabs}
          title="Exportar todas as abas"
        >Exportar abas</button>
        <button
          style={{
            marginLeft: 8,
            padding: "2px 10px",
            fontSize: 14,
            border: "none",
            background: "#eee",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={handleImportAllTabs}
          title="Importar abas"
        >Importar abas</button>
      </div>
      {/* Barra de menu superior */}
      <TopMenuBar
          onSave={() => handleTest("onSave")}
          onExport={handleExport}
          onImport={handleImport}
          onExample={handleExampleOpen}
          // onToggleLabels={() => setShowLabels((v) => !v)}
          // labelsVisible={showLabels}
          // onTogglePanels={() => setPanelsVisible((v) => !v)}
          // panelsVisible={panelsVisible}
        />
        {/* ReactFlow da aba ativa */}
      <ReactFlow
        ref={ref}
        nodes={nodes} // armazena os nodes dos recursos
        edges={edges} // armazena as ligações entre os recursos
        defaultEdgeOptions={defaultEdgeOptions}
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
        {configPanelNodeId && (
          <ResourceConfigPanel
            nodeId={configPanelNodeId}
            onClose={() => setConfigPanelNodeId(null)}
          />
        )}
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
        {showExamples && (
        <ExamplesModal
          models={predefinedModels}
          onSelect={handleExampleSelect}
          onClose={() => setShowExamples(false)}
        />
      )}
      </ReactFlow>
      
    </div>
  );
}
