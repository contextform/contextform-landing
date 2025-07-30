export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: string;
}
  
export interface Feature {
    id: string;
    type: string;
    name: string;
    dimensions?: string[];
    depth?: string;
}
  
export interface Modification {
    id: string;
    timestamp: string;
    featureId: string;
    parameterId: string;
    oldValue: string;
    newValue: string;
    intent: string;
}

export interface DesignMemory {
    modifications: Modification[];
    intents: Record<string, string>;
    parameters: Record<string, string>;
}

export interface SocketEvents {
    chat_message: (data: { message: string }) => void;
    get_current_features: () => void;
    modify_parameter: (data: { featureId: string; parameterId: string; newValue: string; intent?: string }) => void;
    get_design_memory: () => void;
    
    bot_thinking: (isThinking: boolean) => void;
    bot_response: (data: { message: string; timestamp: string; features?: Feature[] }) => void;
    current_features: (features: Feature[]) => void;
    features_error: (error: string) => void;
    modification_progress: (message: string) => void;
    modification_success: (data: { modification: Modification; features: Feature[]; message: string }) => void;
    modification_error: (data: { message: string; error: string }) => void;
    design_memory: (memory: DesignMemory) => void;
}