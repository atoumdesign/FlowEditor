import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FlowEditor from './FlowEditor.tsx'
import './index.css'
import { LayoutDashboard, Square } from 'lucide-react'

const initialState = {
  nodes: [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  ],
  edges: [{ id: 'e1-2', source: '1', target: '2' }]
}

const componentsList = [
    {
        category: 'Generals',
        components: [
            {
                type: 'input',
                label: 'input node',
                category: 'general',
                icon: <Square size={32}/>,
                disabled: false
            },
            {
                type: 'default',
                label: 'default node',
                category: 'general',
                icon: <Square size={32}/>,
                disabled: true
            },
            {
                type: 'output',
                label: 'output node',
                category: 'general',
                icon: <Square size={32}/>,
                disabled: false
            },
        ]
    },
    {
        category: 'Others',
        components: [
            {
                type: 'default',
                label: 'Group',
                category: 'Others',
                icon: <LayoutDashboard size={32}/>,
                disabled: false
            },
            {
                type: 'default',
                label: 'VPC',
                category: 'Others',
                icon: <LayoutDashboard size={32} />,
                disabled: false
            },
            {
                type: 'default',
                label: 'Subnet',
                category: 'Others',
                icon: <LayoutDashboard size={32} />,
                disabled: false
            },
            {
                type: 'default',
                label: 'Account',
                category: 'Others',
                icon: <LayoutDashboard size={32} />,
                disabled: false
            },
            {
                type: 'default',
                label: 'generic resize Node',
                category: 'Others',
                icon: <LayoutDashboard size={32} />,
                disabled: false
            },
            {
                type: 'default',
                label: 'vpc Group',
                category: 'Others',
                icon: <LayoutDashboard size={32} />,
                disabled: false
            },
            {
                type: 'default',
                label: 'Database Schema',
                category: 'Others',
                icon: <LayoutDashboard size={32} />,
                disabled: false
            }
        ]
    }
]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FlowEditor initialState={initialState} componentsList={componentsList} />
  </StrictMode>,
)
