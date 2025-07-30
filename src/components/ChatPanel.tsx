import { useState, useRef, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import FeaturesList from './FeaturesList';
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

interface ChatPanelProps {
  userCredentials: UserCredentials;
  selectedDocument: Document;
}

const ChatPanel = ({ userCredentials, selectedDocument }: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState('');
  const [leftWidth, setLeftWidth] = useState(280); // Features panel width
  const [rightWidth, setRightWidth] = useState(450); // 3D preview panel width
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [previewGeometry, setPreviewGeometry] = useState<{current?: string, proposed?: string}>({
    current: 'placeholder_current',
    proposed: undefined
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    connected, 
    messages, 
    features, 
    isThinking, 
    modificationProgress, 
    pendingModification,
    currentGeometry,
    sendMessage, 
    refreshFeatures,
    refreshModelData,
    get3DGeometry,
    approvePendingModification,
    rejectPendingModification
  } = useSocket({
    userCredentials,
    selectedDocument
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit' 
    });
  };

  // Resizing handlers for left divider
  const handleLeftMouseDown = (e: React.MouseEvent) => {
    setIsResizingLeft(true);
    e.preventDefault();
  };

  const handleLeftMouseMove = (e: MouseEvent) => {
    if (!isResizingLeft) return;
    
    const panel = document.querySelector('.chat-panel-container') as HTMLElement;
    if (!panel) return;
    
    const panelRect = panel.getBoundingClientRect();
    const newLeftWidth = e.clientX - panelRect.left;
    
    const minWidth = 200;
    const maxWidth = 400;
    const constrainedWidth = Math.min(Math.max(newLeftWidth, minWidth), maxWidth);
    
    setLeftWidth(constrainedWidth);
  };

  // Resizing handlers for right divider
  const handleRightMouseDown = (e: React.MouseEvent) => {
    setIsResizingRight(true);
    e.preventDefault();
  };

  const handleRightMouseMove = (e: MouseEvent) => {
    if (!isResizingRight) return;
    
    const panel = document.querySelector('.chat-panel-container') as HTMLElement;
    if (!panel) return;
    
    const panelRect = panel.getBoundingClientRect();
    const newRightWidth = panelRect.right - e.clientX;
    
    const minWidth = 350;
    const maxWidth = 600;
    const constrainedWidth = Math.min(Math.max(newRightWidth, minWidth), maxWidth);
    
    setRightWidth(constrainedWidth);
  };

  const handleMouseUp = () => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  };

  useEffect(() => {
    const isResizing = isResizingLeft || isResizingRight;
    
    if (isResizing) {
      if (isResizingLeft) {
        document.addEventListener('mousemove', handleLeftMouseMove);
      }
      if (isResizingRight) {
        document.addEventListener('mousemove', handleRightMouseMove);
      }
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleLeftMouseMove);
      document.removeEventListener('mousemove', handleRightMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleLeftMouseMove);
      document.removeEventListener('mousemove', handleRightMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingLeft, isResizingRight]);


  return (
    <div className="chat-panel-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[700px] bg-white shadow-2xl border border-gray-200 rounded-lg flex z-40">
      {/* Left Section - Current Model Features */}
      <div 
        className="border-r border-gray-200 flex flex-col"
        style={{ width: `${leftWidth}px` }}
      >
        {/* Features Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-lg">📦</span>
            Current Model Features
          </h3>
        </div>
        
        {/* Features List */}
        <div className="flex-1 overflow-y-auto p-4">
          <FeaturesList features={features} onRefresh={refreshModelData} />
        </div>
      </div>

      {/* Left Resizable Divider */}
      <div 
        className={`w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize transition-colors relative group ${
          isResizingLeft ? 'bg-blue-400' : ''
        }`}
        onMouseDown={handleLeftMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        </div>
      </div>

      {/* Middle Section - Chat Interface */}
      <div 
        className="flex flex-col"
        style={{ width: `calc(100% - ${leftWidth}px - ${rightWidth}px - 2px)` }}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-black text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <h2 className="font-semibold">CAD AI Assistant</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">{connected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 chat-scroll">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.sender === 'ai' && (
                      <span className="font-semibold">AI Assistant: </span>
                    )}
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="thinking-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modification progress indicator */}
            {modificationProgress && (
              <div className="flex justify-start">
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-700">{modificationProgress}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me to modify your CAD model... (e.g., 'change width to 120mm')"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                disabled={!connected || isThinking}
              />
              <button
                type="submit"
                disabled={!connected || isThinking || !inputValue.trim()}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {isThinking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <span className="text-lg">➤</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Resizable Divider */}
      <div 
        className={`w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize transition-colors relative group ${
          isResizingRight ? 'bg-blue-400' : ''
        }`}
        onMouseDown={handleRightMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        </div>
      </div>

      {/* Right Section - 3D Preview */}
      <div 
        className="flex flex-col"
        style={{ width: `${rightWidth}px` }}
      >
        <PreviewPanel 
          currentGeometry={currentGeometry}
          proposedGeometry={pendingModification ? 'proposed_geometry_placeholder' : undefined}
          pendingModification={pendingModification}
          onApplyChanges={() => {
            if (pendingModification) {
              approvePendingModification();
            }
          }}
          onRejectChanges={() => {
            if (pendingModification) {
              rejectPendingModification();
            }
          }}
          onRequestGeometry={refreshModelData}
        />
      </div>
    </div>
  );
};

export default ChatPanel;