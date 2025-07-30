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
  const [currentGeometry, setCurrentGeometry] = useState<any>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    
    newSocket.on('connect', () => {
      setConnected(true);
      console.log('🔌 Connected to server');
      
      // Send user credentials and document info to server
      newSocket.emit('user_connected', {
        userCredentials,
        selectedDocument
      });
      
      // Request both features and geometry in one call (50% fewer API calls)
      newSocket.emit('get_model_data');
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

    // Handle combined model data response
    newSocket.on('model_data_update', (data: { features: Feature[]; geometry: any; timestamp: string }) => {
      console.log('📦 Received combined model data update');
      setFeatures(data.features);
      if (data.geometry) {
        console.log('🔄 Updating geometry from combined model data');
        setCurrentGeometry(data.geometry);
      }
    });

    newSocket.on('model_data_error', (error: string) => {
      console.error('Model data error:', error);
      setFeatures([]);
      setCurrentGeometry(null);
    });

    // Legacy handler for backward compatibility
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
      currentGeometry?: any;
      originalState?: any;
      applied?: boolean;
    }) => {
      console.log('📨 Received modification_preview:', data.message);
      console.log('📐 Preview has geometry:', data.currentGeometry ? 'YES' : 'NO');
      
      // Update geometry if included in preview
      if (data.currentGeometry) {
        console.log('🔄 Updating geometry from modification preview');
        setCurrentGeometry(data.currentGeometry);
      }
      
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

    newSocket.on('modification_success', (data: { modification: Modification; features: Feature[]; geometry?: any; message: string }) => {
      setModificationProgress('');
      setModifications(prev => [...prev, data.modification]);
      setFeatures(data.features);
      setPendingModification(null); // Clear pending modification
      
      // Update 3D geometry if included
      if (data.geometry) {
        console.log('🔄 Updating 3D geometry after modification success');
        setCurrentGeometry(data.geometry);
      }
      
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
    newSocket.on('onshape_changed', (data: { event: any; features: Feature[]; geometry?: any; timestamp: string }) => {
      console.log('📡 Onshape changed externally:', data.event);
      setFeatures(data.features);
      
      // Update 3D geometry if included
      if (data.geometry) {
        console.log('🔄 Updating 3D geometry from change detection');
        setCurrentGeometry(data.geometry);
      }
      
      // Add a system message about the external change
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        content: '🔄 Model updated externally in Onshape',
        sender: 'system' as 'ai',
        timestamp: data.timestamp,
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    // Listen for 3D geometry updates
    newSocket.on('3d_geometry_update', (geometry: any) => {
      console.log('📐 Received 3D geometry update:', geometry);
      setCurrentGeometry(geometry);
    });

    newSocket.on('3d_geometry_error', (error: string) => {
      console.error('❌ 3D geometry error:', error);
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

  const refreshModelData = () => {
    if (socket) {
      console.log('🔄 Refreshing complete model data...');
      socket.emit('get_model_data');
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

  const get3DGeometry = () => {
    if (socket) {
      socket.emit('get_3d_geometry');
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
    currentGeometry,
    sendMessage,
    refreshFeatures,
    refreshModelData,
    modifyParameter,
    getDesignMemory,
    get3DGeometry,
    approvePendingModification,
    rejectPendingModification,
  };
};