// Mapeamento dos tipos do FlowEditor para shapes do draw.io
const typeToDrawioShape: Record<string, string> = {
  account: 'mxgraph.aws4.group',
  vpc: 'mxgraph.aws4.group',
  subnetprivate: 'mxgraph.aws4.group',
  subnetpublic: 'mxgraph.aws4.group',
  lambdafunction: 'mxgraph.aws4.lambda_function',
  bucket: 'mxgraph.aws4.bucket',
  instance: 'mxgraph.aws4.instance2',
  mariadbinstance: 'mxgraph.aws4.rds_mariadb_instance',
  mysqlinstance: 'mxgraph.aws4.rds_mysql_instance',
  postgresqlinstance: 'mxgraph.aws4.rds_postgresql_instance',
  // Adicione variações se necessário
};

function escapeXml(unsafe: string) {
  return (unsafe || '').replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
    return c;
  });
}

function isRealNode(node: any) {
  return node && typeof node.id === 'string' && !node.id.startsWith('xy-edge') && !node.id.startsWith('reactflow__edge');
}

// Garante que pais são exportados antes dos filhos
function sortNodesByHierarchy(nodes: any[]) {
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const sorted: any[] = [];
  const visited = new Set();

  function visit(node: any) {
    if (visited.has(node.id)) return;
    if (node.parentId && nodeMap[node.parentId]) {
      visit(nodeMap[node.parentId]);
    }
    visited.add(node.id);
    sorted.push(node);
  }

  nodes.forEach(visit);
  return sorted;
}

function nodeToDrawioCell(node: any, parent: string = "1") {
  const shape = typeToDrawioShape[(node.type || '').toLowerCase()] || 'rectangle';
  const label = escapeXml(node.data?.label || node.type || '');
  const style = `sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#ED7100;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;shape=${shape};html=1;`;
  const width = node.style?.width || 80;
  const height = node.style?.height || 60;
  const parentId = node.parentId || parent;

  // sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#ED7100;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;

  return `
    <mxCell id="${node.id}" value="${label}" style="${style}" vertex="1" parent="${parentId}">
      <mxGeometry x="${node.position?.x || 0}" y="${node.position?.y || 0}" width="${width}" height="${height}" as="geometry"/>
      
    </mxCell>
  `;
}

function edgeToDrawioCell(edge: any) {
  return `
    <mxCell id="${edge.id}" edge="1" source="${edge.source}" target="${edge.target}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" parent="1">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  `;
}

function tabToDrawioXml(tab: any) {
  const rootId = "1";
  // Filtra apenas nodes reais
  const sortedNodes = sortNodesByHierarchy((tab.nodes || []).filter(isRealNode));
  const nodeIds = new Set(sortedNodes.map((n: any) => n.id));
  // Filtra edges que só conectam nodes existentes
  const validEdges = (tab.edges || []).filter(
    (edge: any) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net">
  <diagram name="${escapeXml(tab.name)}">
    <mxGraphModel dx="1000" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100">
      <root>
        <mxCell id="0"/>
        <mxCell id="${rootId}" parent="0"/>
        ${sortedNodes.map((node: any) => nodeToDrawioCell(node, rootId)).join('\n')}
        ${validEdges.map((edge: any) => edgeToDrawioCell(edge)).join('\n')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
`;
}

function allTabsToDrawioXml(tabs: any[]) {
  const diagrams = tabs.map(tab => {
    const rootId = "1";
    const sortedNodes = sortNodesByHierarchy((tab.nodes || []).filter(isRealNode));
    const nodeIds = new Set(sortedNodes.map((n: any) => n.id));
    const validEdges = (tab.edges || []).filter(
      (edge: any) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );
    return `
  <diagram name="${escapeXml(tab.name)}">
    <mxGraphModel dx="1000" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100">
      <root>
        <mxCell id="0"/>
        <mxCell id="${rootId}" parent="0"/>
        ${sortedNodes.map((node: any) => nodeToDrawioCell(node, rootId)).join('\n')}
        ${validEdges.map((edge: any) => edgeToDrawioCell(edge)).join('\n')}
      </root>
    </mxGraphModel>
  </diagram>
    `;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net">
  ${diagrams}
</mxfile>`;
}

export function exportTabToDrawioXml(tab: any, filename = "flow-tab.drawio.xml") {
  const xml = tabToDrawioXml(tab);
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAllTabsToDrawioXml(tabs: any[], filename = "flow-multitabs.drawio.xml") {
  const xml = allTabsToDrawioXml(tabs);
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}