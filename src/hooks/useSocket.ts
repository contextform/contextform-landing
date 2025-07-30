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
      
      // Request features when connected
      newSocket.emit('get_current_features');
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

    newSocket.on('bot_response', (data: { message: string; timestamp: string; features?: Feature[] }) => {
      // Clear thinking timeout since we got a response
      if (thinkingTimeout) {
        clearTimeout(thinkingTimeout);
        setThinkingTimeout(null);
      }
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: data.message,
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

    newSocket.on('modification_success', (data: { modification: Modification; features: Feature[]; message: string }) => {
      setModificationProgress('');
      setModifications(prev => [...prev, data.modification]);
      setFeatures(data.features);
      
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

  return {
    connected,
    messages,
    features,
    isThinking,
    modifications,
    modificationProgress,
    sendMessage,
    refreshFeatures,
    modifyParameter,
    getDesignMemory,
  };
};