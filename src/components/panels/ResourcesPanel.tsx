import { Panel } from "@xyflow/react"
import { onDragStart } from "./DragAndDrop"
import { Accordion }  from '@blendmesh/components-ui'
import React, { useRef, useState } from "react"

export default function ResourcesPanel({componentsList, showLabels, setShowLabels}) {
    const panelRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(150)
    const minWidth = 220
    const maxWidth = 350
    const resizing = useRef(false)
    const startX = useRef(0)
    const startWidth = useRef(width)
    // const [showLabels, setShowLabels] = useState(true)

    const onMouseDown = (e: React.MouseEvent) => {
        resizing.current = true
        startX.current = e.clientX
        startWidth.current = width
        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
        if (!resizing.current) return
        let newWidth = startWidth.current + (e.clientX - startX.current)
        if (newWidth < minWidth) newWidth = minWidth
        if (newWidth > maxWidth) newWidth = maxWidth
        setWidth(newWidth)
    }

    const onMouseUp = () => {
        resizing.current = false
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
    }

    // Monta os itens do Accordion a partir de COMPONENTS
    const accordionItems = componentsList.map((group) => ({
        title: group.category,
        content: (
            <div className="flex flex-wrap">
                {group.components.map((component) => (
                    <div
                        key={component.label}
                        draggable={!component.disabled}
                        onDragStart={component.disabled ? undefined : (event) => onDragStart(event, component.type)}
                        title={component.label}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            margin: 4,
                            opacity: component.disabled ? 0.4 : 1,
                            cursor: component.disabled ? "not-allowed" : "grab",
                            pointerEvents: component.disabled ? "none" : "auto"
                        }}
                    >
                        {component.icon}
                        {showLabels && (
                            <span
                                style={{
                                    fontSize: 8,
                                    color: "#888",
                                    maxWidth: 32,
                                    width: "100%",
                                    textAlign: "center",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    display: "block",
                                    userSelect: "none"
                                }}
                                title={component.label}
                            >
                                {component.label}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        )
    }));

    return (
        <Panel
            position='top-left'
            style={{
                borderRadius: '0px',
                width: width,
                background: 'transparent',
                minWidth: minWidth,
                maxWidth: maxWidth
            }}
        >
            {/* <div 
                ref={panelRef} 
                style={{ 
                    width: "100%", 
                    height: "100%" 
                    }}> */}
                
                <Accordion
                    items={accordionItems}
                    defaultOpenIndexes={[0,2]}
                    scrollable={true} 
                    // maxHeight={250}   // altura máxima do conteúdo aberto (opcional)
                />
                {/* Barra de resize */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 8,
                        height: '350px',
                        cursor: "ew-resize",
                        zIndex: 10,
                        userSelect: "none"
                    }}
                    onMouseDown={onMouseDown}
                />
            {/* </div> */}
        </Panel>
    )
}