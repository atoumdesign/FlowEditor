import React, { useState } from "react";
import { togglePanelsAndGrid } from "@/utils/togglePanelsAndGrid";

interface TopMenuBarProps {
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  onExample: () => void;
  onToggleIcons: () => void;
  iconsVisible: boolean;
  onExportAllTabs: () => void;
  onImportAllTabs: () => void;
  onExportDrawio: () => void;
  onExportAllDrawio: () => void;
  onExportSVG: () => void;
  onExportPNG: () => void;
  onExportJPG: () => void;
  onExportPDF: () => void; // NOVO
  onExportAllPDF: () => void; // NOVO
  onExportMermaid: () => void;
  onExportAllMermaid: () => void;
  onToggleResourcesPanel: () => void;
  resourcesPanelVisible: boolean;
  onToggleResourceLabels: () => void;
  resourceLabelsVisible: boolean;
  handleTogglePanelsAndGrid: () => void;
  panelsHidden: boolean;
  onToggleStatePanel: () => void;
  statePanelVisible: boolean;
}

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: 28,
  left: 0,
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 4,
  boxShadow: "0 2px 8px #0002",
  minWidth: 180,
  zIndex: 2100,
};

const dropdownItemStyle: React.CSSProperties = {
  padding: "8px 16px",
  cursor: "pointer",
  whiteSpace: "nowrap",
  fontSize: 13,
  border: "none",
  background: "none",
  width: "100%",
  textAlign: "left",
};

const dropdownItemHoverStyle: React.CSSProperties = {
  ...dropdownItemStyle,
  background: "#e0e7ff",
};

const menuBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 24,
  background: "#f8fafc",
  borderBottom: "1px solid #e5e7eb",
  padding: "0 16px",
  height: 32,
  position: "relative",
  zIndex: 2000,
  userSelect: "none",
};

const menuStyle: React.CSSProperties = {
  position: "relative",
  padding: "0 8px",
  height: "100%",
  display: "flex",
  alignItems: "center",
};

const TopMenuBar: React.FC<TopMenuBarProps> = ({
  onSave,
  onExport,
  onImport,
  onExample,
  onToggleIcons,
  iconsVisible,
  onExportAllTabs,
  onImportAllTabs,
  onExportDrawio,
  onExportAllDrawio,
  onExportSVG,
  onExportPNG,
  onExportJPG,
  onExportPDF,
  onExportAllPDF,
  onExportMermaid,
  onExportAllMermaid,
  onToggleResourcesPanel,
  resourcesPanelVisible,
  onToggleResourceLabels,
  resourceLabelsVisible,
  onToggleStatePanel,
  statePanelVisible,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const [panelsHidden, setPanelsHidden] = useState(false);

  function handleTogglePanelsAndGrid() {
    togglePanelsAndGrid(!panelsHidden);
    setPanelsHidden(h => !h);
  }

  return (
    <div style={menuBarStyle}>
      {/* File Menu */}
      <div
        style={menuStyle}
        onMouseEnter={() => setOpenMenu("file")}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <span style={{ cursor: "pointer", fontWeight: 500 }}>Arquivo</span>
        {openMenu === "file" && (
          <div style={dropdownStyle}>
            <div
              style={hovered === "save" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("save")}
              onMouseLeave={() => setHovered(null)}
              onClick={onSave}
            >Salvar</div>
            <div
              style={hovered === "example" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("example")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExample}
            >Exemplos</div>
          </div>
        )}
      </div>

      {/* Export Menu */}
      <div
        style={menuStyle}
        onMouseEnter={() => setOpenMenu("export")}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <span style={{ cursor: "pointer", fontWeight: 500 }}>Exportar</span>
        {openMenu === "export" && (
          <div style={dropdownStyle}>
            <div
              style={hovered === "svg" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("svg")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportSVG}
            >SVG (aba)</div>
            <div
              style={hovered === "jpg" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("jpg")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportJPG}
            >JPG (aba)</div>
            <div
              style={hovered === "png" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("png")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportPNG}
            >PNG (aba)</div>
            <div
              style={hovered === "pdf" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("pdf")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportPDF}
            >PDF (aba)</div>
            <div
              style={hovered === "allpdf" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("allpdf")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportAllPDF}
            >PDF (todas abas)</div>
            <div
              style={hovered === "mermaid" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("mermaid")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportMermaid}
            >Mermaid (aba)</div>
            <div
              style={hovered === "allmermaid" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("allmermaid")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportAllMermaid}
            >Mermaid (todas abas)</div>
            <div
              style={hovered === "drawio" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("drawio")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportDrawio}
            >Draw.io (aba)</div>
            <div
              style={hovered === "alldrawio" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("alldrawio")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportAllDrawio}
            >Draw.io (todas abas)</div>
            <div
              style={hovered === "json" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("json")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportAllTabs}
            >JSON (todas abas)</div>
            <div
              style={hovered === "jsonsingle" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("jsonsingle")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExport}
            >JSON (aba)</div>
          </div>
        )}
      </div>

      {/* Import Menu */}
      <div
        style={menuStyle}
        onMouseEnter={() => setOpenMenu("import")}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <span style={{ cursor: "pointer", fontWeight: 500 }}>Importar</span>
        {openMenu === "import" && (
          <div style={dropdownStyle}>
            <div
              style={hovered === "importjson" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("importjson")}
              onMouseLeave={() => setHovered(null)}
              onClick={onImport}
            >JSON (aba)</div>
            <div
              style={hovered === "importall" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("importall")}
              onMouseLeave={() => setHovered(null)}
              onClick={onImportAllTabs}
            >JSON (todas abas)</div>
          </div>
        )}
      </div>

      {/* Exibir Menu */}
      <div
        style={menuStyle}
        onMouseEnter={() => setOpenMenu("view")}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <span style={{ cursor: "pointer", fontWeight: 500 }}>Exibir</span>
        {openMenu === "view" && (
          <div style={dropdownStyle}>
            <div
              style={hovered === "icons" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("icons")}
              onMouseLeave={() => setHovered(null)}
              onClick={onToggleIcons}
              title={iconsVisible ? "Ocultar ícones de alerta" : "Mostrar ícones de alerta"}
            >
              {iconsVisible ? "🔔 Ocultar ícones de alerta" : "🔕 Mostrar ícones de alerta"}
            </div>
            <div
              style={hovered === "panels" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("panels")}
              onMouseLeave={() => setHovered(null)}
              onClick={handleTogglePanelsAndGrid}
              title={panelsHidden ? "Mostrar painéis e grid" : "Ocultar painéis e grid"}
            >
              {panelsHidden ? "Mostrar painéis e grid" : "Ocultar painéis e grid"}
            </div>
            <div
              style={hovered === "resources" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("resources")}
              onMouseLeave={() => setHovered(null)}
              onClick={onToggleResourcesPanel}
              title={resourcesPanelVisible ? "Ocultar painel de recursos" : "Mostrar painel de recursos"}
            >
              {resourcesPanelVisible ? "Ocultar painel de recursos" : "Mostrar painel de recursos"}
            </div>
            <div
              style={hovered === "statepanel" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("statepanel")}
              onMouseLeave={() => setHovered(null)}
              onClick={onToggleStatePanel}
              title={statePanelVisible ? "Ocultar painel de estado" : "Mostrar painel de estado"}
            >
              {statePanelVisible ? "Ocultar painel de estado" : "Mostrar painel de estado"}
            </div>
            <div
              style={hovered === "labels" ? dropdownItemHoverStyle : dropdownItemStyle}
              onMouseEnter={() => setHovered("labels")}
              onMouseLeave={() => setHovered(null)}
              onClick={onToggleResourceLabels}
              title={resourceLabelsVisible ? "Ocultar nomes dos ícones" : "Mostrar nomes dos ícones"}
            >
              {resourceLabelsVisible ? "Ocultar nomes dos ícones" : "Mostrar nomes dos ícones"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMenuBar;