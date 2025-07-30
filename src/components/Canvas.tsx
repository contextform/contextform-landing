import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import ChatPanel from './ChatPanel';
import { 
  MaterialNode, 
  ConstraintsNode, 
  LoadNode, 
  FEASolverNode, 
  ResultsNode 
} from './nodes';

interface UserCredentials {
  email: string;
  name: string;
  accessKey: string;
  secretKey: string;
}

interface Document {
  id: string;
  name: string;
  createdAt?: string;
  modifiedAt?: string;
}

interface CanvasProps {
  userCredentials: UserCredentials;
  selectedDocument: Document;
  onBack: () => void;
  onNavigateToHome?: () => void;
}

// Define custom node types
const nodeTypes = {
  materialNode: MaterialNode,
  constraintsNode: ConstraintsNode,
  loadNode: LoadNode,
  feaSolverNode: FEASolverNode,
  resultsNode: ResultsNode,
};

const Canvas = ({ userCredentials, selectedDocument, onBack, onNavigateToHome }: CanvasProps) => {
  const [simulationResults, setSimulationResults] = useState({
    hasResults: false,
    maxStress: 45.2,
    safetyFactor: 2.1,
    maxDisplacement: 0.15
  });

  const [isGeneratingFEA, setIsGeneratingFEA] = useState(false);
  const [showFEAWorkflow, setShowFEAWorkflow] = useState(false);

  // Start with just the CAD geometry node
  const getInitialNodes = (): Node[] => {
    const baseNodes = [
      {
        id: 'geometry-1',
        type: 'default',
        position: { x: 250, y: 150 },
        data: { 
          label: `📦 ${selectedDocument.name}\nCAD Geometry` 
        },
        style: { 
          background: '#f0f9ff', 
          border: '2px solid #0ea5e9',
          borderRadius: '8px',
          minWidth: '150px',
          textAlign: 'center'
        }
      },
      {
        id: 'generate-fea',
        type: 'default',
        position: { x: 500, y: 150 },
        data: { 
          label: isGeneratingFEA ? "🔄 Generating FEA simulation..." : "⚡ Start Generate FEA simulation!" 
        },
        style: { 
          background: isGeneratingFEA ? '#fef3c7' : '#dcfce7', 
          border: isGeneratingFEA ? '2px solid #f59e0b' : '2px solid #16a34a',
          borderRadius: '8px',
          minWidth: '180px',
          textAlign: 'center',
          cursor: isGeneratingFEA ? 'wait' : 'pointer'
        }
      }
    ];

    // Only show close button when FEA workflow is expanded
    if (showFEAWorkflow) {
      baseNodes.push({
        id: 'close-fea',
        type: 'default',
        position: { x: 1500, y: 50 },
        data: { 
          label: "❌ Collapse Workflow" 
        },
        style: { 
          background: '#fef2f2', 
          border: '2px solid #ef4444',
          borderRadius: '8px',
          minWidth: '140px',
          textAlign: 'center',
          cursor: 'pointer'
        }
      });
    }

    return baseNodes;
  };

  const getInitialEdges = (): Edge[] => {
    const baseEdges = [
      { id: 'e1-gen', source: 'geometry-1', target: 'generate-fea' }
    ];

    // No edge to close button - it's independent when workflow is expanded
    return baseEdges;
  };

  const initialNodes: Node[] = getInitialNodes();
  const initialEdges: Edge[] = getInitialEdges();

  // Function to generate FEA nodes
  const generateFEANodes = async () => {
    setIsGeneratingFEA(true);
    
    // Update the generator node
    setNodes((nds) =>
      nds.map((node) =>
        node.id === 'generate-fea'
          ? { 
              ...node, 
              data: { label: "🔄 Generating FEA simulation..." },
              style: { 
                ...node.style,
                background: '#fef3c7',
                border: '2px solid #f59e0b',
                cursor: 'wait'
              }
            }
          : node
      )
    );

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add FEA nodes
    const feaNodes: Node[] = [
      {
        id: 'material-1',
        type: 'materialNode',
        position: { x: 300, y: 50 },
        data: {
          material: 'steel',
          onMaterialChange: (material: string) => {
            console.log('Material changed to:', material);
          }
        }
      },
      {
        id: 'constraints-1',
        type: 'constraintsNode',
        position: { x: 300, y: 250 },
        data: {
          constraint: 'fixed',
          onConstraintChange: (constraint: string) => {
            console.log('Constraint changed to:', constraint);
          }
        }
      },
      {
        id: 'load-1',
        type: 'loadNode',
        position: { x: 650, y: 150 },
        data: {
          loadType: 'force',
          magnitude: 100,
          direction: 'y',
          onLoadChange: (loadType: string, magnitude: number, direction: string) => {
            console.log('Load changed:', { loadType, magnitude, direction });
          }
        }
      },
      {
        id: 'solver-1',
        type: 'feaSolverNode',
        position: { x: 950, y: 150 },
        data: {
          isRunning: false,
          onSolve: () => {
            console.log('Starting FEA analysis...');
            setTimeout(() => {
              setSimulationResults({
                hasResults: true,
                maxStress: 42.8 + Math.random() * 10,
                safetyFactor: 1.8 + Math.random() * 0.6,
                maxDisplacement: 0.12 + Math.random() * 0.08
              });
            }, 4000);
          }
        }
      },
      {
        id: 'results-1',
        type: 'resultsNode',
        position: { x: 1250, y: 150 },
        data: simulationResults
      }
    ];

    const feaEdges: Edge[] = [
      { id: 'e1-2', source: 'geometry-1', target: 'material-1' },
      { id: 'e1-3', source: 'geometry-1', target: 'constraints-1' },
      { id: 'e2-4', source: 'material-1', target: 'solver-1' },
      { id: 'e3-4', source: 'constraints-1', target: 'solver-1' },
      { id: 'e4-5', source: 'load-1', target: 'solver-1' },
      { id: 'e5-6', source: 'solver-1', target: 'results-1' }
    ];

    // Remove the generator node and add FEA nodes
    setNodes((nds) => [
      ...nds.filter(node => node.id !== 'generate-fea'),
      ...feaNodes
    ]);

    setEdges((eds) => [
      ...eds.filter(edge => edge.id !== 'e1-gen'),
      ...feaEdges
    ]);

    setIsGeneratingFEA(false);
    setShowFEAWorkflow(true);
  };

  // Function to close/collapse FEA workflow
  const closeFEAWorkflow = () => {
    // Reset to initial simple view
    const resetNodes: Node[] = [
      {
        id: 'geometry-1',
        type: 'default',
        position: { x: 250, y: 150 },
        data: { 
          label: `📦 ${selectedDocument.name}\nCAD Geometry` 
        },
        style: { 
          background: '#f0f9ff', 
          border: '2px solid #0ea5e9',
          borderRadius: '8px',
          minWidth: '150px',
          textAlign: 'center'
        }
      },
      {
        id: 'generate-fea',
        type: 'default',
        position: { x: 500, y: 150 },
        data: { 
          label: "⚡ Start Generate FEA simulation!" 
        },
        style: { 
          background: '#dcfce7', 
          border: '2px solid #16a34a',
          borderRadius: '8px',
          minWidth: '180px',
          textAlign: 'center',
          cursor: 'pointer'
        }
      },
      {
        id: 'close-fea',
        type: 'default',
        position: { x: 750, y: 150 },
        data: { 
          label: "❌ Close FEA Workflow" 
        },
        style: { 
          background: '#fef2f2', 
          border: '2px solid #ef4444',
          borderRadius: '8px',
          minWidth: '160px',
          textAlign: 'center',
          cursor: 'pointer'
        }
      }
    ];

    const resetEdges: Edge[] = [
      { id: 'e1-gen', source: 'geometry-1', target: 'generate-fea' },
      { id: 'e1-close', source: 'geometry-1', target: 'close-fea' }
    ];

    setNodes(resetNodes);
    setEdges(resetEdges);
    
    // Reset states
    setShowFEAWorkflow(false);
    setSimulationResults({
      hasResults: false,
      maxStress: 45.2,
      safetyFactor: 2.1,
      maxDisplacement: 0.15
    });
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update results node when simulation results change
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === 'results-1'
          ? { ...node, data: { ...node.data, ...simulationResults } }
          : node
      )
    );
  }, [simulationResults, setNodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node clicks
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.id === 'generate-fea' && !isGeneratingFEA) {
      generateFEANodes();
    } else if (node.id === 'close-fea') {
      closeFEAWorkflow();
    }
  }, [isGeneratingFEA]);

  return (
    <div className="h-screen w-full relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button 
              onClick={onNavigateToHome}
              className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              contextform
            </button>
            <div className="h-4 w-px bg-gray-300"></div>
            <button 
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              ← Back to Documents
            </button>
            <div className="h-4 w-px bg-gray-300"></div>
            <div>
              <h1 className="font-semibold text-gray-900">{selectedDocument.name}</h1>
              <p className="text-xs text-gray-500">Connected to {userCredentials.email}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            AI Memory Active
          </div>
        </div>
      </div>

      <div className="pt-16 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
          selectionOnDrag
          multiSelectionKeyCode="Shift"
          deleteKeyCode="Delete"
          selectNodesOnDrag={false}
        >
          <Background 
            color="#9ca3af" 
            gap={20} 
            size={1}
            variant={BackgroundVariant.Dots}
          />
          <Controls 
            className="bg-white shadow-lg border border-gray-200 rounded-lg"
            position="bottom-left"
          />
        </ReactFlow>
        
        {/* Chat Panel floating in center */}
        <ChatPanel 
          userCredentials={userCredentials}
          selectedDocument={selectedDocument}
        />
      </div>
    </div>
  );
};

const CanvasWrapper = (props: CanvasProps) => (
  <ReactFlowProvider>
    <Canvas {...props} />
  </ReactFlowProvider>
);

export default CanvasWrapper;