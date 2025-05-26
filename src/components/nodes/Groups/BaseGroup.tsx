import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';

const BaseGroup = ({ data, selected, borderColor, backgroundColor, Icon, label }) => {
  return (
    <div
      className="w-full h-full relative"
      style={{
        backgroundColor: backgroundColor || 'transparent',
        border: `2px solid ${borderColor || 'none'}`,
        borderRadius: 4,
        boxSizing: 'border-box',
        minWidth: 200,
        minHeight: 100,
      }}
    >
      <NodeResizer
        color={borderColor || '#333'}
        minWidth={200}
        minHeight={100}
        isVisible={selected}
      />
      <div className="flex flex-row gap-2">
        {Icon && <Icon size="24px" />}
        <span
          style={{
            fontSize: '12px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {data?.label || label || 'Default Node'}
        </span>
      </div>
    </div>
  );
};

export default memo(BaseGroup);