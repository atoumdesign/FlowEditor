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

// export const onDrop = (
//   event: DragEvent
// ) => {
//     event.preventDefault();

//     const reactFlowInstance = flowRefs.reactFlowInstance;
//     const setNodes = flowRefs.setNodes;

//     if (reactFlowInstance && setNodes) {
//       const type = event.dataTransfer.getData('application/reactflow');
//       const position = reactFlowInstance.screenToFlowPosition({
//         x: event.clientX,
//         y: event.clientY,
//       });

//       // Verifica se está sobre um node do tipo basegroup
//       const nodes = reactFlowInstance.getNodes ? reactFlowInstance.getNodes() : [];
//       const groupNode = nodes.find(
//         (n) =>
//           (n.type === 'account' ||
//            n.type === 'vpc' ||
//            n.type === 'subnetprivate' ||
//            n.type === 'subnetpublic') && // tipos basegroup
//           n.position &&
//           n.style &&
//           position.x >= n.position.x &&
//           position.x <= n.position.x + (n.style.width || 0) &&
//           position.y >= n.position.y &&
//           position.y <= n.position.y + (n.style.height || 0)
//       );

//       const newNode: Node = {
//         id: uuid(),
//         type,
//         position: groupNode
//           ? {
//               x: position.x - groupNode.position.x,
//               y: position.y - groupNode.position.y,
//             }
//           : position,
//         data: { label: `${type} node` },
//         ...(groupNode ? { parentId: groupNode.id, extent: 'parent' } : {}),
//       };

//       setNodes((nds) => nds.concat(newNode));
//     }
// };