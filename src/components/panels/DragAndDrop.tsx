import { v4 as uuid } from 'uuid'
import { flowRefs } from '@/contexts/FlowRefs';
import type { Node } from '@xyflow/react';
import React from 'react';


export const onDragStart = (
    event: React.DragEvent,
    type: string,
) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
};

export const onDragOver = (
  event: DragEvent
) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};


 export const onDrop = (
  event: DragEvent
) => {
    event.preventDefault();

    const reactFlowInstance = flowRefs.reactFlowInstance;
    const setNodes = flowRefs.setNodes;

    if (reactFlowInstance) {
      const type = event.dataTransfer.getData('application/reactflow');
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: Node = {
        id: uuid(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    }
  };
