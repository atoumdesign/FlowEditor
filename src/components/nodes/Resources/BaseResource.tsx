import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertCircle, MessageSquare, Link2Off, Link } from 'lucide-react'; // Exemplo de ícones, ajuste conforme sua lib

const ICON_SIZE = 12;

const BaseResource = ({
  data,
  isConnectable,
  icon: Icon,
  label,
  alertType,
  alertColor = "#e53935",
  commentIconVisible,
  commentColor = "#1976d2",
  noInputIconVisible,
  noOutputIconVisible,
  iconVisibility = true,
}) => {
  const [showHandles, setShowHandles] = useState(false);
  return (
    <div
      style={{
        height: 32,
        width: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // position: 'relative',
      }}
      onMouseEnter={() => setShowHandles(true)}
      onMouseLeave={() => setShowHandles(false)}
    >
      {/* Ícone de alerta no topo direito */}
      {iconVisibility && (
        <div style={{
          position: "absolute",
          top: 2,
          right: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 2,
          zIndex: 10,
        }}>
          {/* Alerta de configuração */}
          {alertType === "error" && (
            <AlertCircle size={ICON_SIZE} color={alertColor} title="Configuração inválida" />
          )}
          {/* Comentário relevante */}
          {commentIconVisible && (
            <span title={comment || "Comentário relevante"}>
              <MessageSquare size={ICON_SIZE} color={commentColor} />
            </span>
          )}
          {/* Sem conexão de entrada */}
          {noInputIconVisible && (
            <Link2Off size={ICON_SIZE} color="#ff9800" title="Sem conexão de entrada" />
          )}
          {/* Sem conexão de saída */}
          {noOutputIconVisible && (
            <Link size={ICON_SIZE} color="#ff9800" style={{ transform: "rotate(180deg)" }} title="Sem conexão de saída" />
          )}
        </div>
      )}


      {/* Ícone centralizado */}
      <div>
        {Icon && <Icon size={32} />}
      </div>

      {/* Label com quebra de linha */}
      <div
        className="text-xs text-center"
        style={{
          marginTop: 4,
          textAlign: 'center',
          // wordBreak: 'break-word',
          maxWidth: 120,
          // whiteSpace: 'pre-line',
        }}
      >
        {label || data?.label || 'Custom Node\nLabel'}
      </div>

      {/* Handler de saída (direita) */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          top: '50%',
          background: '#555',
          opacity: showHandles ? 1 : 0,
          transition: 'opacity 0.2s',
          pointerEvents: showHandles ? 'auto' : 'none',
        }}
        isConnectable={isConnectable}
      />

      {/* Handler de entrada (esquerda) */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          top: '50%',
          background: '#555',
          opacity: showHandles ? 1 : 0,
          transition: 'opacity 0.2s',
          pointerEvents: showHandles ? 'auto' : 'none',
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(BaseResource);