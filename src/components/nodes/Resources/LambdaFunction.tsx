import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AWS } from '@blendmesh/icons'; // Substitua pelo seu ícone desejado

const LambdaFunction = ({ data, isConnectable }) => {
  return (
    <div
      className='w-8 h-8 items-center'
      style={{
        minWidth: 32,
        minHeight: 32,
        maxWidth: 48,
        maxHeight: 48,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Ícone centralizado */}
      <div >
        <AWS.LambdaFunction size={32} />
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
        {data?.label || 'Custom Node\nLabel'}
      </div>

      {/* Handler de saída (direita) */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '50%', background: '#555' }}
        isConnectable={isConnectable}
      />

      {/* Handler de entrada (esquerda) */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '50%', background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(LambdaFunction);