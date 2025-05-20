import { v4 as uuid} from 'uuid'

export const onDragStart = (
    event: DragEvent,
    type,
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
    event: DragEvent,
    reactFlowInstance
) => {

    event.preventDefault();

    if (!reactFlowInstance) return

    // Recupera o tipo do nó do dataTransfer
    const type = event.dataTransfer.getData("application/reactflow");

    // Verifica se o tipo é válido
    // if (!type || !nodeTypes[type]) {
    //     console.error(`Node type "${type}" não está registrado no nodeTypes.`);
    //     return;
    // }
    const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
    });
    const newNode: Node = {
        id: uuid(),
        type: type,
        position,
        data: { label: `${type} node`, value: 1, type: type },
    };

    return newNode;


};