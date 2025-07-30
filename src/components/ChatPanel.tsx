import { useState, useRef, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import FeaturesList from './FeaturesList';

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
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { connected, messages, features, isThinking, modificationProgress, sendMessage, refreshFeatures } = useSocket({
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
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Floating AI Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-24 w-14 h-14 bg-black text-white rounded-full shadow-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center z-50 group ${
          isOpen ? 'right-[420px]' : 'right-6'
        }`}
        title="AI Assistant"
      >
        <span className="text-xl">🤖</span>
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
        
        {/* Tooltip */}
        <div className={`absolute top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${
          isOpen ? 'left-16' : 'right-16'
        }`}>
          AI Assistant {connected ? '(Connected)' : '(Connecting...)'}
        </div>
      </button>

      {/* Right Side Panel */}
      <div className={`fixed top-20 right-0 w-[400px] bg-white shadow-2xl border-l border-gray-200 flex flex-col transition-transform duration-300 ease-in-out transform z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`} style={{ height: 'calc(100vh - 80px)' }}>
        {/* Header */}
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

        {/* Content */}

        {/* Features Panel */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <FeaturesList features={features} onRefresh={refreshFeatures} />
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
                  <div className={`text-xs mt-1 ${
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
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
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
    </>
  );
};

export default ChatPanel;