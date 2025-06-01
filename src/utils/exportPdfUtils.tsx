import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

// Exporta o fluxo atual como PDF (imagem)
export async function exportCurrentFlowToPDF(flowArea: HTMLElement, filename = "flow-export.pdf") {
  try {
    // Gera uma imagem PNG da área do fluxo
    const dataUrl = await htmlToImage.toPng(flowArea, { backgroundColor: "#fff" });
    const img = new window.Image();
    img.src = dataUrl;
    img.onload = () => {
      const pdf = new jsPDF({
        orientation: img.width > img.height ? "landscape" : "portrait",
        unit: "px",
        format: [img.width, img.height]
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
      pdf.save(filename);
    };
  } catch (error) {
    alert("Erro ao exportar PDF: " + error);
  }
}

// Exporta todas as abas como PDF (imagem, um PDF por aba)
export async function exportAllTabsToPDF(tabs: any[], flowArea: HTMLElement) {
  for (const tab of tabs) {
    // Atenção: isso exporta apenas o fluxo atualmente visível!
    await exportCurrentFlowToPDF(flowArea, `${tab.name || tab.id}.pdf`);
  }
}