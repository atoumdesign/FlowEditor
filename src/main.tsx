import { createRoot } from 'react-dom/client'
import { ReactFlowProvider } from '@xyflow/react';
import FlowEditor from './FlowEditor.tsx'
import './index.css'
import { LayoutDashboard, Square } from 'lucide-react'
import { AWS } from '@blendmesh/icons';

const initialState = {
 nodes: [
    {
    id: 'account',
    type: 'account',
    data: { label: 'account' },
    position: { x: 0, y: 0 },
    style: {
      width: 1000,
      height: 500,
    },
  },
    {
    id: 'vpc',
    type: 'vpc',
    data: { label: 'vpc' },
    position: { x: 40, y: 40 },
    style: {
      width: 800,
      height: 450,
    },
    parentId: 'account',
    extent: 'parent',
  },
      {
    id: 'subnetprivate',
    type: 'subnetprivate',
    data: { label: 'subnet privada' },
    position: { x: 40, y: 40 },
    style: {
      width: 350,
      height: 400,
    },
    parentId: 'vpc',
    extent: 'parent',
  },
        {
    id: 'subnetpublic',
    type: 'subnetpublic',
    data: { label: 'subnet pública' },
    position: { x: 420, y: 40 },
    style: {
      width: 350,
      height: 400,
    },
    parentId: 'vpc',
    extent: 'parent',
  },

  {
    id: 'B',
    type: 'instance',
    data: { label: 'instance node 1' },
    position: { x: 40, y: 40 },
    parentId: 'subnetprivate',
    extent: 'parent',
  },
  {
    id: 'C',
    type: 'instance',
    data: { label: 'instance node 2' },
    position: { x: 40, y: 40 },
    parentId: 'subnetpublic',
    extent: 'parent',
  },
  ],
  edges: [],
}

const componentsList = [
      {
        category: 'Compute',
        components: [
            {
                type: 'lambdaFunction',
                label: 'Lambda function',
                category: 'compute',
                icon: <AWS.LambdaFunction size={32}/>,
                disabled: false
            },
            {
                type: 'instance',
                label: 'Instance',
                category: 'compute',
                icon: <AWS.Instance size={32}/>,
                disabled: false
            }
        ]
    },
    {
        category: 'Storage',
        components: [
            {
                type: 'bucket',
                label: 'Bucket',
                category: 'storage',
                icon: <AWS.Bucket size={32}/>,
                disabled: false
            }
        ]
    },
        {
        category: 'Database',
        components: [
            {
                type: 'mySQLInstance',
                label: 'MySQL Instance',
                category: 'database',
                icon: <AWS.MySQLInstance size={32}/>,
                disabled: false
            },
            {
                type: 'mariaDBInstance',
                label: 'MariaDB Instance',
                category: 'database',
                icon: <AWS.MariaDBInstance size={32}/>,
                disabled: false
            },
            {
                type: 'postgreSQLInstance',
                label: 'PostgreSQL Instance',
                category: 'database',
                icon: <AWS.PostgreSQLInstance size={32}/>,
                disabled: false
            },
        ]
    },
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
                type: 'account',
                label: 'AWS Account',
                category: 'Others',
                icon: <AWS.Account size={32} />,
                disabled: false
            },
            {
                type: 'vpc',
                label: 'Virtual Private Cloud',
                category: 'Others',
                icon: <AWS.VPCGroup size={32} />,
                disabled: false
            },
            {
                type: 'subnetprivate',
                label: 'Subnet Private',
                category: 'Others',
                icon: <AWS.PrivateSubnet size={32} />,
                disabled: false
            },
            {
                type: 'subnetpublic',
                label: 'Subnet Public',
                category: 'Others',
                icon: <AWS.PublicSubnet size={32} />,
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
    <ReactFlowProvider>
      <FlowEditor initialState={initialState} componentsList={componentsList} />
    </ReactFlowProvider>
)
