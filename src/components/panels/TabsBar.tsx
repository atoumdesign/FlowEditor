import React from "react";
import Styles from "@/styles";

interface TabType {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
}

interface TabsBarProps {
  tabs: TabType[];
  activeTabId: string;
  editingTabId: string | null;
  editingTabName: string;
  onTabClick: (tabId: string) => void;
  onTabDoubleClick: (tabId: string, tabName: string) => void;
  onTabClose: (tabId: string) => void;
  onAddTab: () => void;
  onExportAllTabs: () => void;
  onImportAllTabs: () => void;
  onEditTabNameChange: (name: string) => void;
  onSaveTabName: () => void;
  onCancelEditTab: () => void;
}

const TabsBar: React.FC<TabsBarProps> = ({
  tabs,
  activeTabId,
  editingTabId,
  editingTabName,
  onTabClick,
  onTabDoubleClick,
  onTabClose,
  onAddTab,
  onExportAllTabs,
  onImportAllTabs,
  onEditTabNameChange,
  onSaveTabName,
  onCancelEditTab,
}) => (
  <div style={Styles.Global.TabsBar}>
    {tabs.map(tab => (
      <div
        key={tab.id}
        style={{
          ...Styles.Global.Tab,
          background: tab.id === activeTabId ? "#fff" : "#eee",
          border: tab.id === activeTabId ? "1px solid #bbb" : "1px solid #ddd",
          borderBottom: tab.id === activeTabId ? "none" : "1px solid #ddd",
          fontWeight: tab.id === activeTabId ? 600 : 400,
        }}
        onClick={() => onTabClick(tab.id)}
        onDoubleClick={e => {
          e.stopPropagation();
          onTabDoubleClick(tab.id, tab.name);
        }}
      >
        {editingTabId === tab.id ? (
          <input
            autoFocus
            value={editingTabName}
            onChange={e => onEditTabNameChange(e.target.value)}
            onBlur={onSaveTabName}
            onKeyDown={e => {
              if (e.key === "Enter") onSaveTabName();
              if (e.key === "Escape") onCancelEditTab();
            }}
            style={Styles.Global.TabName}
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
              onTabClose(tab.id);
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
      onClick={onAddTab}
      title="Nova aba"
    >+</button>
    {/* <button
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
      onClick={onExportAllTabs}
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
      onClick={onImportAllTabs}
      title="Importar abas"
    >Importar abas</button> */}
  </div>
);

export default TabsBar;