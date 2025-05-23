import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FlowEditor from './FlowEditor.tsx'
import './index.css'
import { LayoutDashboard, Square } from 'lucide-react'

const initialState = {
 nodes: [
    {
    id: 'A',
    type: 'group',
    data: { label: null },
    position: { x: 0, y: 0 },
    style: {
      width: 170,
      height: 140,
    },
  },
  {
    id: 'B',
    type: 'input',
    data: { label: 'child node 1' },
    position: { x: 10, y: 10 },
    parentId: 'A',
    extent: 'parent',
  },
  {
    id: 'C',
    data: { label: 'child node 2' },
    position: { x: 10, y: 90 },
    parentId: 'A',
    extent: 'parent',
  },
  ],
  edges: [],
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
                type: 'group',
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
