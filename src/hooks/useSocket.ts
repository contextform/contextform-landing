import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message, Feature, Modification, DesignMemory } from '../types';

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

interface UseSocketProps {
  userCredentials: UserCredentials;
  selectedDocument: Document;
}

export const useSocket = ({ userCredentials, selectedDocument }: UseSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I can help you modify your Onshape CAD model. Try asking me to change dimensions, add features, or ask about your current model.',
      sender: 'ai',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [modifications, setModifications] = useState<Modification[]>([]);
  const [modificationProgress, setModificationProgress] = useState<string>('');
  const [thinkingTimeout, setThinkingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [pendingModification, setPendingModification] = useState<{
    featureId: string;
    parameterId: string;
    oldValue: string;
    newValue: string;
    intent: string;
    originalState?: any;
    applied?: boolean;
  } | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    
    newSocket.on('connect', () => {
      setConnected(true);
      console.log('🔌 Connected to server');
      console.log('👤 UserCredentials:', userCredentials ? 'present' : 'missing');
      console.log('📄 SelectedDocument:', selectedDocument ? selectedDocument.name : 'missing');
      
      // Send user credentials and document info to server
      console.log('📤 Emitting user_connected event...');
      newSocket.emit('user_connected', {
        userCredentials,
        selectedDocument
      });
      
      // Features will be fetched automatically when user_connected is processed
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('🔌 Disconnected from server');
    });

    newSocket.on('bot_thinking', (thinking: boolean) => {
      setIsThinking(thinking);
      
      // Clear any existing timeout
      if (thinkingTimeout) {
        clearTimeout(thinkingTimeout);
        setThinkingTimeout(null);
      }
      
      // If AI starts thinking, set a timeout to reset after 30 seconds
      if (thinking) {
        const timeout = setTimeout(() => {
          setIsThinking(false);
          const timeoutMessage: Message = {
            id: Date.now().toString(),
            content: '⚠️ I\'m having trouble processing your request. Please try again or rephrase your question.',
            sender: 'ai',
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, timeoutMessage]);
        }, 30000); // 30 second timeout
        
        setThinkingTimeout(timeout);
      }
    });

    newSocket.on('bot_response', (data: { 
      message: string; 
      timestamp: string; 
      features?: Feature[];
      memoryContext?: {
        found: number;
        summary: string[];
      };
      memoryEntry?: string;
    }) => {
      // Clear thinking timeout since we got a response
      if (thinkingTimeout) {
        clearTimeout(thinkingTimeout);
        setThinkingTimeout(null);
      }
      
      let messageContent = data.message;
      
      // Add memory context visualization if available
      if (data.memoryContext && data.memoryContext.found > 0) {
        const memoryNote = `\n\n💭 *Based on ${data.memoryContext.found} similar past decision${data.memoryContext.found > 1 ? 's' : ''}:*\n${data.memoryContext.summary.map(s => `• ${s}`).join('\n')}`;
        messageContent += memoryNote;
      }
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: messageContent,
        sender: 'ai',
        timestamp: data.timestamp,
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      if (data.features) {
        setFeatures(data.features);
      }
    });

    newSocket.on('current_features', (newFeatures: Feature[]) => {
      setFeatures(newFeatures);
    });

    newSocket.on('features_error', (error: string) => {
      console.error('Features error:', error);
    });

    // Handle general chat errors
    newSocket.on('chat_error', (error: string) => {
      console.error('Chat error:', error);
      
      // Clear thinking timeout since there was an error
      if (thinkingTimeout) {
        clearTimeout(thinkingTimeout);
        setThinkingTimeout(null);
      }
      
      setIsThinking(false);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `❌ Error: ${error}. Please try again.`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    });

    newSocket.on('modification_progress', (message: string) => {
      setModificationProgress(message);
    });

    // Handle modification preview
    newSocket.on('modification_preview', (data: {
      featureId: string;
      parameterId: string;
      oldValue: string;
      newValue: string;
      intent: string;
      message: string;
      currentFeature: any;
      originalState?: any;
      applied?: boolean;
    }) => {
      console.log('📨 Received modification_preview:', data.message);
      
      setPendingModification({
        featureId: data.featureId,
        parameterId: data.parameterId,
        oldValue: data.oldValue,
        newValue: data.newValue,
        intent: data.intent,
        originalState: data.originalState,
        applied: data.applied
      });
      
      const previewMessage: Message = {
        id: Date.now().toString(),
        content: data.applied 
          ? `🔄 ${data.message}\n\nChanges are now visible in your 3D model. Click "Keep Changes" to confirm, or "Revert" to undo.`
          : `🔍 ${data.message}\n\nClick "Approve" in the 3D preview to apply this change, or "Reject" to cancel.`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, previewMessage]);
    });

    newSocket.on('modification_success', (data: { modification: Modification; features: Feature[]; message: string }) => {
      setModificationProgress('');
      setModifications(prev => [...prev, data.modification]);
      setFeatures(data.features);
      setPendingModification(null); // Clear pending modification
      
      
      const successMessage: Message = {
        id: Date.now().toString(),
        content: `✅ ${data.message}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, successMessage]);
    });

    newSocket.on('modification_error', (data: { message: string; error: string }) => {
      setModificationProgress('');
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `❌ ${data.message}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    });

    newSocket.on('design_memory', (memory: DesignMemory) => {
      setModifications(memory.modifications);
    });

    // Listen for Onshape changes (from other sources)
    newSocket.on('onshape_changed', (data: { event: any; features: Feature[]; timestamp: string }) => {
      console.log('📡 Onshape changed externally:', data.event);
      setFeatures(data.features);
      
      
      // Add a system message about the external change
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        content: '🔄 Model updated externally in Onshape',
        sender: 'system' as 'ai',
        timestamp: data.timestamp,
      };
      setMessages(prev => [...prev, systemMessage]);
    });


    setSocket(newSocket);

    return () => {
      // Clean up timeout on unmount
      if (thinkingTimeout) {
        clearTimeout(thinkingTimeout);
      }
      newSocket.close();
    };
  }, [userCredentials, selectedDocument]);

  const sendMessage = (content: string) => {
    if (!socket || !content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    socket.emit('chat_message', { message: content });
  };

  const refreshFeatures = () => {
    if (socket) {
      socket.emit('get_current_features');
    }
  };

  const modifyParameter = (featureId: string, parameterId: string, newValue: string, intent?: string) => {
    if (socket) {
      socket.emit('modify_parameter', { featureId, parameterId, newValue, intent });
    }
  };

  const getDesignMemory = () => {
    if (socket) {
      socket.emit('get_design_memory');
    }
  };


  const approvePendingModification = () => {
    if (socket && pendingModification) {
      socket.emit('approve_modification', pendingModification);
    }
  };

  const rejectPendingModification = () => {
    if (socket && pendingModification) {
      if (pendingModification.applied && pendingModification.originalState) {
        // Revert the changes
        socket.emit('revert_modification', {
          featureId: pendingModification.featureId,
          parameterId: pendingModification.parameterId,
          originalValue: pendingModification.originalState.originalValue,
          newValue: pendingModification.newValue
        });
      } else {
        // Just cancel the preview
        setPendingModification(null);
        const rejectMessage: Message = {
          id: Date.now().toString(),
          content: '❌ Modification cancelled.',
          sender: 'system' as 'ai',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, rejectMessage]);
      }
    }
  };

  return {
    connected,
    messages,
    features,
    isThinking,
    modifications,
    modificationProgress,
    pendingModification,
    sendMessage,
    refreshFeatures,
    modifyParameter,
    getDesignMemory,
    approvePendingModification,
    rejectPendingModification,
  };
};