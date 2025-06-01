import React, { useState, useRef } from "react";

const menuBarStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: 36,
  background: "#f8f8f8",
  borderBottom: "1px solid #ddd",
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  fontSize: 14,
  userSelect: "none",
};

const menuStyle = {
  position: "relative",
  marginRight: 24,
};

const dropdownStyle = {
  position: "absolute",
  top: 28,
  left: 0,
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 4,
  boxShadow: "0 2px 8px #0002",
  minWidth: 160,
  zIndex: 2100,
};

// const dropdownItemStyle = {
//   padding: "8px 16px",
//   cursor: "pointer",
//   whiteSpace: "nowrap",
//   fontSize: 13,
// };

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
  onExportJPG: () => void;
  onExportMermaid: () => void;
  onExportAllMermaid: () => void;
}

const dropdownItemHoverStyle = {
  background: "#e0e7ff",
};

const dropdownItemStyle = {
  padding: "6px 16px",
  cursor: "pointer",
  border: "none",
  background: "none",
  width: "100%",
  textAlign: "left" as const,
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
  onExportJPG,
  onExportMermaid,
  onExportAllMermaid,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const menuTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMenuEnter = (menu: string) => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setOpenMenu(menu);
  };

  const handleMenuLeave = () => {
    menuTimeout.current = setTimeout(() => setOpenMenu(null), 200);
  };

  return (
    <div style={menuBarStyle}>
      {/* File Menu */}
      <div
        style={menuStyle}
        onMouseEnter={() => handleMenuEnter("file")}
        onMouseLeave={handleMenuLeave}
      >
        <span style={{ cursor: "pointer", fontWeight: 500 }}>File</span>
        {openMenu === "file" && (
          <div style={dropdownStyle}>
            <div style={dropdownItemStyle} onClick={onSave}>Salvar</div>
            <div style={dropdownItemStyle} onClick={onExportAllTabs}>Exportar abas</div>
            <div style={dropdownItemStyle} onClick={onImportAllTabs}>Importar abas</div>
            <div style={dropdownItemStyle} onClick={onExport}>Exportar</div>
            <div style={dropdownItemStyle} onClick={onImport}>Importar</div>
            <div style={dropdownItemStyle} onClick={onExportDrawio}>Exportar aba para draw.io</div>
            <div style={dropdownItemStyle} onClick={onExportAllDrawio}>Exportar todas abas para draw.io</div>
            <div style={dropdownItemStyle} onClick={onExample}>Exemplos</div>
          </div>
        )}
      </div>

      {/* Edit Menu */}
      <div
        style={menuStyle}
        onMouseEnter={() => handleMenuEnter("edit")}
        onMouseLeave={handleMenuLeave}
      >
        <span style={{ cursor: "pointer", fontWeight: 500 }}>Edit</span>
        {openMenu === "edit" && (
          <div style={dropdownStyle}>
            {/* <div style={dropdownItemStyle} onClick={onToggleLabels}>
              {labelsVisible ? "Ocultar nomes" : "Exibir nomes"}
            </div>
            <div style={dropdownItemStyle} onClick={onTogglePanels}>
              {panelsVisible ? "Ocultar painéis" : "Exibir painéis"}
            </div> */}
            <div style={dropdownItemStyle} onClick={onToggleIcons}>
          {iconsVisible ? "Ocultar ícones de alerta" : "Exibir ícones de alerta"}
        </div>
          </div>
        )}
      </div>

      {/* Menu Exportação */}
      <div
        style={{ position: "relative" }}
        onMouseEnter={() => setOpenMenu("export")}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <span style={{ cursor: "pointer", fontWeight: 500 }}>Exportar</span>
        {openMenu === "export" && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "#fff",
            border: "1px solid #ccc",
            minWidth: 180,
            zIndex: 10,
            boxShadow: "0 2px 8px #0002"
          }}>
            <div
              style={{
                ...dropdownItemStyle,
                ...(hovered === "svg" ? dropdownItemHoverStyle : {})
              }}
              onMouseEnter={() => setHovered("svg")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportSVG}
            >Exportar SVG (aba)</div>
            <div
              style={{
                ...dropdownItemStyle,
                ...(hovered === "jpg" ? dropdownItemHoverStyle : {})
              }}
              onMouseEnter={() => setHovered("jpg")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportJPG}
            >Exportar JPG (aba)</div>
            <div
              style={{
                ...dropdownItemStyle,
                ...(hovered === "mermaid" ? dropdownItemHoverStyle : {})
              }}
              onMouseEnter={() => setHovered("mermaid")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportMermaid}
            >Exportar Mermaid (aba)</div>
            <div
              style={{
                ...dropdownItemStyle,
                ...(hovered === "allmermaid" ? dropdownItemHoverStyle : {})
              }}
              onMouseEnter={() => setHovered("allmermaid")}
              onMouseLeave={() => setHovered(null)}
              onClick={onExportAllMermaid}
            >Exportar Mermaid (todas abas)</div>
            {/* Inclua aqui os outros formatos, como draw.io, se desejar */}
          </div>
        )}
      </div>

      {/* Menu Importação */}
      <div
        style={{ position: "relative" }}
        onMouseEnter={() => setOpenMenu("import")}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <span style={{ cursor: "pointer", fontWeight: 500 }}>Importar</span>
        {openMenu === "import" && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "#fff",
            border: "1px solid #ccc",
            minWidth: 180,
            zIndex: 10,
            boxShadow: "0 2px 8px #0002"
          }}>
            {/* Adicione aqui os itens de importação */}
            <div
              style={{
                ...dropdownItemStyle,
                ...(hovered === "importjson" ? dropdownItemHoverStyle : {})
              }}
              onMouseEnter={() => setHovered("importjson")}
              onMouseLeave={() => setHovered(null)}
              // onClick={/* sua função de importação */}
            >Importar JSON</div>
            {/* Outros formatos de importação */}
          </div>
        )}
      </div>
    </div>
  );
}

export default TopMenuBar;