import * as htmlToImage from 'html-to-image';

export function getMainSVG(flowArea: HTMLElement): SVGSVGElement | null {
  // Busca o SVG com mais filhos (normalmente o principal do React Flow)
  const svgs = flowArea.querySelectorAll("svg");
  if (!svgs.length) return null;
  return Array.from(svgs).reduce((max, curr) =>
    curr.childElementCount > max.childElementCount ? curr : max,
    svgs[0]
  ) as SVGSVGElement;
}

// Exporta PNG da área do fluxo (wrapper .flow-area)
export function exportFlowToPNG(flowWrapper: HTMLElement, filename = "flow-export.png") {
  htmlToImage.toPng(flowWrapper)
    .then((dataUrl: string) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch((error: any) => {
      alert('Erro ao exportar imagem: ' + error);
    });
}

// Exporta JPG da área do fluxo (wrapper .flow-area)
export function exportFlowToJPG(flowWrapper: HTMLElement, filename = "flow-export.jpg") {
  htmlToImage.toJpeg(flowWrapper, { quality: 1.0, backgroundColor: "#fff"  })
    .then((dataUrl: string) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch((error: any) => {
      alert('Erro ao exportar imagem: ' + error);
    });
}

// Exporta SVG da área do fluxo (wrapper .flow-area)
export function exportFlowToSVG(flowWrapper: HTMLElement, filename = "flow-export.svg") {
  htmlToImage.toSvg(flowWrapper)
    .then((dataUrl: string) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch((error: any) => {
      alert('Erro ao exportar SVG: ' + error);
    });
}

// Exporta Mermaid do fluxo atual
export function exportFlowToMermaid(nodes: any[], edges: any[], filename = "flow-export.mmd") {
  let mermaid = "graph TD\n";
  nodes.forEach((node: any) => {
    mermaid += `  ${node.id}["${node.data?.label || node.type || node.id}"]\n`;
  });
  edges.forEach((edge: any) => {
    mermaid += `  ${edge.source} --> ${edge.target}\n`;
  });
  const blob = new Blob([mermaid], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Exporta Mermaid de todas as abas
export function exportAllTabsToMermaid(tabs: any[], filename = "flow-multitabs.mmd") {
  let mermaid = "";
  tabs.forEach((tab: any, idx: number) => {
    mermaid += `%% Aba: ${tab.name}\ngraph TD\n`;
    (tab.nodes || []).forEach((node: any) => {
      mermaid += `  ${node.id}["${node.data?.label || node.type || node.id}"]\n`;
    });
    (tab.edges || []).forEach((edge: any) => {
      mermaid += `  ${edge.source} --> ${edge.target}\n`;
    });
    mermaid += "\n";
  });
  const blob = new Blob([mermaid], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}