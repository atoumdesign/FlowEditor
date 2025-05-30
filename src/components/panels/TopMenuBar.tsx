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

const dropdownItemStyle = {
  padding: "8px 16px",
  cursor: "pointer",
  whiteSpace: "nowrap",
  fontSize: 13,
};

export default function TopMenuBar({
  onSave,
  onExport,
  onImport,
  onExample,
  onToggleLabels,
  labelsVisible,
  onTogglePanels,
  panelsVisible,
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
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
            <div style={dropdownItemStyle} onClick={onExport}>Exportar</div>
            <div style={dropdownItemStyle} onClick={onImport}>Importar</div>
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
            <div style={dropdownItemStyle} onClick={onToggleLabels}>
              {labelsVisible ? "Ocultar nomes" : "Exibir nomes"}
            </div>
            <div style={dropdownItemStyle} onClick={onTogglePanels}>
              {panelsVisible ? "Ocultar painéis" : "Exibir painéis"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}