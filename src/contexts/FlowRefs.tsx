import type { ReactFlowInstance, Node } from '@xyflow/react';

export const flowRefs = {
  reactFlowInstance: null as ReactFlowInstance | null,
  setNodes: null as React.Dispatch<React.SetStateAction<Node[]>> | null,
  nodeTypes: null as any,
};