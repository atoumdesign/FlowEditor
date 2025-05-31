import { v4 as uuid } from 'uuid'
import { flowRefs } from '@/contexts/FlowRefs';
import type { Node } from '@xyflow/react';
import React from 'react';
import { defaultEC2InstanceProperties, defaultLambdaProperties, defaultS3BucketProperties, defaultAccountProperties, defaultVPCProperties, defaultRDSMariaDBInstanceProperties, defaultRDSMySQLInstanceProperties, defaultRDSPostgresInstanceProperties, defaultPrivateSubnetProperties, defaultPublicSubnetProperties } from '@/constants'


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
  const nodeTypes = flowRefs.nodeTypes;

  if (reactFlowInstance && setNodes && nodeTypes) {
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !nodeTypes[type]) {
      return; // Não cria node default se não encontrar o tipo
    }

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const defaultPropertiesMap: Record<string, any> = {
      lambdaFunction: defaultLambdaProperties,
      instance: defaultEC2InstanceProperties,
      bucket: defaultS3BucketProperties,
      account: defaultAccountProperties,
      vpc: defaultVPCProperties,
      subnetprivate: defaultPrivateSubnetProperties,
      subnetpublic: defaultPublicSubnetProperties,
      mariaDBInstance: defaultRDSMariaDBInstanceProperties,
      mySQLInstance: defaultRDSMySQLInstanceProperties,
      postgreSQLInstance: defaultRDSPostgresInstanceProperties
    };

    const newNode: Node = {
      id: uuid(),
      type,
      position,
      data: {
        label: `${type} node`,
        ...(defaultPropertiesMap[type] && { Properties: defaultPropertiesMap[type] })
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }
};
