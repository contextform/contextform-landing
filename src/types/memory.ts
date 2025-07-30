export interface DesignChange {
    id: string;
    change: string;
    reason: string;
    timestamp: string;
    confidence: 'user_confirmed' | 'ai_suggested' | 'inferred';
    previousValue?: string;
    newValue?: string;
    impact?: string[];
  }
  
  export interface DesignIntent {
    purpose: string;
    constraints: string[];
    designDecisions: DesignChange[];
    relationships: string[];
  }
  
  export interface ParameterInfo {
    id: string;
    name: string;
    value: string;
    unit?: string;
    modifiable: boolean;
    constraintType?: 'LENGTH' | 'DEPTH' | 'RADIUS' | 'ANGLE';
  }
  
  export interface SmartFeature {
    id: string;
    type: string;
    name: string;
    currentState: {
      parameters: ParameterInfo[];
      lastModified: string;
      status: 'active' | 'suppressed' | 'error';
    };
    designIntent: DesignIntent;
    onshapeData: {
      featureId: string;
      parameterIds: Record<string, string>; // parameter name -> onshape parameter ID
    };
  }
  
  export interface SmartMemory {
    documentId: string;
    lastUpdated: string;
    features: SmartFeature[];
    globalConstraints: string[];
    designContext: {
      projectType: string;
      requirements: string[];
      assumptions: string[];
    };
  }
  
  export interface ModificationRequest {
    featureId: string;
    parameterName: string;
    newValue: string;
    reason: string;
    userConfirmed: boolean;
  }
  
  // Legacy types for compatibility
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