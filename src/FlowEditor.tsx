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

import {
  exportFlowToPNG,
  exportFlowToJPG,
  exportFlowToSVG,
  exportFlowToMermaid,
  exportAllTabsToMermaid,
} from './utils/exportUtils';

import { getUniqueTabName } from './utils/tabsUtils';

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

import Styles from "@/styles"
import TabsBar from '@/components/panels/TabsBar';

import { exportTabToDrawioXml, exportAllTabsToDrawioXml } from '@/utils/drawioExport';
import { exportCurrentFlowToPDF, exportAllTabsToPDF } from './utils/exportPdfUtils';
import { togglePanelsAndGrid } from './utils/togglePanelsAndGrid';

import {
  exportFlowState,
  importFlowState,
  exportAllTabs,
  importAllTabs
} from './utils/fileStateUtils';

const defaultEdgeOptions = {
  zIndex: 2000,
  type: 'step'
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

const flowAreaRef = useRef<HTMLDivElement>(null);
const [panelsHidden, setPanelsHidden] = useState(false);

const [statePanelVisible, setStatePanelVisible] = useState(true);

  const [showResourcesPanel, setShowResourcesPanel] = useState(true);
  const [showResourceLabels, setShowResourceLabels] = useState(true);

  // Estado para edição do nome da aba
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState<string>("");

  const [configPanelNodeId, setConfigPanelNodeId] = useState<string | null>(null);
  const [showExamples, setShowExamples] = React.useState(false);
  const [showAlertIcons, setShowAlertIcons] = useState(true);

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


  const nodeTypes = React.useMemo(() => ({
    account: (props) => <Account {...props} iconVisibility={showAlertIcons} />,
    vpc: (props) => <VPC {...props} iconVisibility={showAlertIcons} />,
    subnetprivate: (props) => <PrivateSubnet {...props} iconVisibility={showAlertIcons} />,
    subnetpublic: (props) => <PublicSubnet {...props} iconVisibility={showAlertIcons} />,
    lambdaFunction: (props) => <LambdaFunction {...props} iconVisibility={showAlertIcons} />,
    bucket: (props) => <Bucket {...props} iconVisibility={showAlertIcons} />,
    instance: (props) => <Instance {...props} iconVisibility={showAlertIcons} />,
    mariaDBInstance: (props) => <MariaDBInstance {...props} iconVisibility={showAlertIcons} />,
    mySQLInstance: (props) => <MySQLInstance {...props} iconVisibility={showAlertIcons} />,
    postgreSQLInstance: (props) => <PostgreSQLInstance {...props} iconVisibility={showAlertIcons} />,
  }), [showAlertIcons]);





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


  React.useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const hasInput = edges.some(e => e.target === node.id);
        const hasOutput = edges.some(e => e.source === node.id);
        return {
          ...node,
          data: {
            ...node.data,
            noInputIconVisible: !hasInput,
            noOutputIconVisible: !hasOutput,
          },
        };
      })
    );
  }, [edges, setNodes]);


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
  const refExport = useRef<HTMLDivElement>(null);

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

      if (
        dragNode.type === 'account' ||
        dragNode.type === 'vpc' ||
        dragNode.type === 'subnetprivate' ||
        dragNode.type === 'subnetpublic'
      ) {
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

// Para exportar o fluxo atual
function handleExport() {
  exportFlowState(nodes, edges);
}

// Para importar um fluxo
function handleImport() {
  importFlowState(setNodes, setEdges);
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

// Para exportar todas as abas
function handleExportAllTabs() {
  exportAllTabs(tabs);
}

// Para importar todas as abas
function handleImportAllTabs(importedTabs) {
  const updatedTabs = [...tabs];
  const newTabs = importedTabs.map((tab, idx) => {
    const uniqueName = getUniqueTabName(tab.name, updatedTabs);
    const newTab = {
      ...tab,
      name: uniqueName,
      id: `tab-${Date.now()}-${Math.random()}-${idx}` // Garante unicidade
    };
    updatedTabs.push(newTab);
    return newTab;
  });
  setTabs([...tabs, ...newTabs]);
  if (newTabs.length > 0) {
    setActiveTabId(newTabs[0].id);
  }
}

  // Adiciona uma nova aba
function handleAddTab() {
  const desiredName = `Fluxo ${tabs.length + 1}`;
  const uniqueName = getUniqueTabName(desiredName, tabs);
  const newId = `tab-${Date.now()}-${tabs.length + 1}`; // Garante unicidade
  setTabs([
    ...tabs,
    {
      id: newId,
      name: uniqueName,
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

  // Função utilitária para ocultar/exibir painéis e grid temporariamente durante exportação
async function exportWithPanelsHidden(exportFn: () => void) {
  // Oculta painéis/grid e ResourcesPanel
  togglePanelsAndGrid(true);
  setShowResourcesPanel(false);

  // Aguarda o DOM atualizar (pode ajustar o delay se necessário)
  await new Promise(resolve => setTimeout(resolve, 100));

  // Executa a exportação
  exportFn();

  // Aguarda exportação terminar (ajuste se necessário)
  setTimeout(() => {
    // Restaura painéis/grid e ResourcesPanel
    togglePanelsAndGrid(false);
    setShowResourcesPanel(true);
  }, 500);
}

  // Funções de exportação
function handleExportPNG() {
  if (flowAreaRef.current) {
    exportWithPanelsHidden(() =>
      exportFlowToPNG(flowAreaRef.current, `${activeTabId}.png`)
    );
  }
}
function handleExportJPG() {
  if (flowAreaRef.current) {
    exportWithPanelsHidden(() =>
      exportFlowToJPG(flowAreaRef.current, `${activeTabId}.jpg`)
    );
  }
}
function handleExportSVG() {
  if (flowAreaRef.current) {
    exportWithPanelsHidden(() =>
      exportFlowToSVG(flowAreaRef.current, `${activeTabId}.svg`)
    );
  }
}
  function handleExportMermaid() {
    exportFlowToMermaid(nodes, edges, `${activeTabId}.mmd`);
  }
  function handleExportAllMermaid() {
    exportAllTabsToMermaid(tabs, "flow-multitabs.mmd");
  }
  function handleExportTabToDrawio() {
    const tab = tabs.find(tab => tab.id === activeTabId);
    if (tab) exportTabToDrawioXml(tab, `${tab.name}.drawio.xml`);
  }
  function handleExportAllTabsToDrawio() {
    exportAllTabsToDrawioXml(tabs, "flow-multitabs.drawio.xml");
  }

  // Função para alternar todos os painéis e o grid, incluindo o ResourcesPanel
function handleTogglePanelsAndGrid() {
  togglePanelsAndGrid(!panelsHidden);
  setPanelsHidden(h => !h);
  setShowResourcesPanel(v => !v); // Oculta/exibe o ResourcesPanel via estado
  setStatePanelVisible(v => !v);
}

function handleExportPDF() {
  if (flowAreaRef.current) {
    exportWithPanelsHidden(() =>
      exportCurrentFlowToPDF(flowAreaRef.current, `${activeTabId}.pdf`)
    );
  }
}

function handleExportAllPDF() {
  if (flowAreaRef.current) {
    exportWithPanelsHidden(() =>
      exportAllTabsToPDF(tabs, flowAreaRef.current)
    );
  }
}

function handleNodeDoubleClick(event, node) {
  const action = node.data?.onDoubleClickAction;
  if (!action) return;
  if (action.type === "tab") {
    setActiveTabId(action.value);
  } else if (action.type === "url") {
    window.open(action.value, "_blank");
  }
}

  return (
    <div style={Styles.Global.Background}>

      {/* Abas */}
      <TabsBar
        tabs={tabs}
        activeTabId={activeTabId}
        editingTabId={editingTabId}
        editingTabName={editingTabName}
        onTabClick={setActiveTabId}
        onTabDoubleClick={handleStartEditTab}
        onTabClose={handleCloseTab}
        onAddTab={handleAddTab}
        onEditTabNameChange={setEditingTabName}
        onSaveTabName={handleSaveTabName}
        onCancelEditTab={handleCancelEditTab}
      />
      {/* Barra de menu superior */}
      <TopMenuBar
        onSave={() => handleTest("onSave")}
        onExport={handleExport}
        onImport={handleImport}
        onExample={handleExampleOpen}
        onToggleIcons={() => setShowAlertIcons(v => !v)}
        iconsVisible={showAlertIcons}
        onExportAllTabs={handleExportAllTabs}
        onImportAllTabs={handleImportAllTabs}
        onExportPNG={handleExportPNG}
        onExportJPG={handleExportJPG}
        onExportSVG={handleExportSVG}
        onExportPDF={handleExportPDF}
        onExportAllPDF={handleExportAllPDF}
        onExportMermaid={handleExportMermaid}
        onExportAllMermaid={handleExportAllMermaid}
        onExportDrawio={handleExportTabToDrawio}
        onExportAllDrawio={handleExportAllTabsToDrawio}
        onToggleResourcesPanel={() => setShowResourcesPanel(v => !v)}
        resourcesPanelVisible={showResourcesPanel}
        onToggleResourceLabels={() => setShowResourceLabels(v => !v)}
        resourceLabelsVisible={showResourceLabels}
        handleTogglePanelsAndGrid={handleTogglePanelsAndGrid}
        panelsHidden={panelsHidden}
        onToggleStatePanel={() => setStatePanelVisible(v => !v)}
        statePanelVisible={statePanelVisible}
      // onToggleLabels={() => setShowLabels((v) => !v)}
      // labelsVisible={showLabels}
      // onTogglePanels={() => setPanelsVisible((v) => !v)}
      // panelsVisible={panelsVisible}
      />
      {/* Wrapper dedicado apenas ao fluxo */}
      <div className="flow-area" ref={flowAreaRef} style={{ width: "100%", height: "100%", position: "relative", flex: 1 }}>
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
        onNodeDoubleClick={handleNodeDoubleClick}

        fitView // o fluxo será ampliado e panorâmico para ajustar todos os nós fornecidos inicialmente
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        {/* Renderiza o ResourcesPanel apenas se showResourcesPanel for true */}
          {showResourcesPanel && (
            <ResourcesPanel
              componentsList={componentsList}
              showLabels={showResourceLabels}
              setShowLabels={setShowResourceLabels}
            />
          )}
        {/* Renderize o painel de estado apenas se statePanelVisible for true */}
      {statePanelVisible && (
        <StatePanel />
        )}
        {configPanelNodeId && (
          <ResourceConfigPanel
            nodeId={configPanelNodeId}
            onClose={() => setConfigPanelNodeId(null)}
            tabs={tabs} 
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
    </div>
  );
}
