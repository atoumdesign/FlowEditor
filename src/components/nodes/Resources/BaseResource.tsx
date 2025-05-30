import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const BaseResource = ({ data, isConnectable, icon: Icon, label }) => {
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