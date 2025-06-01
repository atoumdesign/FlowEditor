// Exporta nodes e edges do fluxo atual
export function exportFlowState(nodes: any[], edges: any[], filename = "flow-export.json") {
  const exportData = { nodes, edges };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Importa nodes e edges para o fluxo atual
export function importFlowState(setNodes: (nodes: any[]) => void, setEdges: (edges: any[]) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt: any) => {
      try {
        const json = JSON.parse(evt.target.result);
        if (json.nodes && json.edges) {
          setNodes(json.nodes);
          setEdges(json.edges);
        } else {
          alert("Arquivo inválido: não contém nodes e edges.");
        }
      } catch (err: any) {
        alert("Erro ao importar arquivo: " + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Exporta todas as abas
export function exportAllTabs(tabs: any[], filename = "flow-multi-tabs-export.json") {
  const exportData = tabs.map(tab => ({
    id: tab.id,
    name: tab.name,
    nodes: tab.nodes,
    edges: tab.edges,
  }));
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Importa várias abas
export function importAllTabs(
  setTabs: (tabs: any[]) => void,
  setActiveTabId: (id: string) => void
) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt: any) => {
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
      } catch (err: any) {
        alert("Erro ao importar arquivo: " + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}