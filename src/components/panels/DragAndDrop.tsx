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
    event: React.DragEvent
) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
};

export function useOnDrop() {

    // const flowContext = useFlowContext();

    return (event: React.DragEvent | DragEvent) => {
        event.preventDefault();

        const reactFlowInstance = flowRefs.reactFlowInstance;
        const setNodes = flowRefs.setNodes;
        const nodeTypes = flowRefs.nodeTypes;

        if (!reactFlowInstance || !setNodes) {
            console.warn('Refs não disponíveis no drop.');
            return;
        }
        // Para garantir compatibilidade, converta para DragEvent se necessário
        const clientX = 'clientX' in event ? event.clientX : (event as any).clientX;
        const clientY = 'clientY' in event ? event.clientY : (event as any).clientY;

        // Recupera o tipo do nó do dataTransfer
        const type = (event as any).dataTransfer.getData("application/reactflow");

        // // Verifica se o tipo é válido
        // if (!type || !flowContext.nodeTypes || !flowContext.nodeTypes[type]) {
        //   console.error(`Node type "${type}" não está registrado no nodeTypes.`);
        //   return;
        // }

        // Se for um grupo, defina um tamanho padrão
        // let style = undefined;
        // if (type === 'group') {
        //     style = { width: 300, height: 200 };
        // }

        const position = reactFlowInstance.screenToFlowPosition({
            x: clientX,
            y: clientY,
        });
        const newNode: Node = {
            id: uuid(),
            type: type,
            position,
            data: { label: `${type} node`, value: 1, type: type },
            // ...(style ? { style } : {}),
        };

        // Adiciona o novo nó diretamente usando setNodes do contexto
        setNodes((nds) => nds.concat(newNode));
    }
};