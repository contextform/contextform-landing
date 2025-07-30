import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import ChatPanel from './ChatPanel';
import PreviewPanel from './PreviewPanel';

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

const Canvas = ({ userCredentials, selectedDocument, onBack, onNavigateToHome }: CanvasProps) => {
  const [previewWidth, setPreviewWidth] = useState(450);
  const [isResizingPreview, setIsResizingPreview] = useState(false);
  const [chatPanelWidth, setChatPanelWidth] = useState(1000);
  const [previewGeometry, setPreviewGeometry] = useState<{current?: string, proposed?: string}>({
    current: 'placeholder_current',
    proposed: undefined
  });

  // Empty canvas - no nodes at all
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Preview resize handlers
  const handlePreviewResizeStart = (e: React.MouseEvent) => {
    setIsResizingPreview(true);
    e.preventDefault();
  };

  const handlePreviewResizeMove = (e: MouseEvent) => {
    if (!isResizingPreview) return;
    
    const viewportWidth = window.innerWidth;
    const newPreviewWidth = viewportWidth - e.clientX - 16; // 16px for right margin
    
    const minPreviewWidth = 300;
    const maxPreviewWidth = 800;
    const minChatWidth = 600;
    const gap = 20; // Minimum gap between panels
    const leftMargin = 16; // Chat panel left margin
    
    // Calculate maximum allowed preview width to maintain gap
    const maxAllowedPreviewWidth = viewportWidth - leftMargin - minChatWidth - gap - 16;
    
    // Constrain preview width
    const constrainedPreviewWidth = Math.min(
      Math.max(newPreviewWidth, minPreviewWidth), 
      Math.min(maxPreviewWidth, maxAllowedPreviewWidth)
    );
    
    // Calculate new chat panel width to fill the space
    const newChatWidth = viewportWidth - leftMargin - constrainedPreviewWidth - gap - 16;
    
    setPreviewWidth(constrainedPreviewWidth);
    setChatPanelWidth(Math.max(newChatWidth, minChatWidth));
  };

  const handlePreviewResizeEnd = () => {
    setIsResizingPreview(false);
  };

  useEffect(() => {
    if (isResizingPreview) {
      document.addEventListener('mousemove', handlePreviewResizeMove);
      document.addEventListener('mouseup', handlePreviewResizeEnd);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handlePreviewResizeMove);
      document.removeEventListener('mouseup', handlePreviewResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handlePreviewResizeMove);
      document.removeEventListener('mouseup', handlePreviewResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingPreview]);

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
        
        {/* Unified Three-Column Panel */}
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