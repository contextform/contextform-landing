import LandingPageRedesign from './components/LandingPageRedesign';
import About from './components/About';
import DocumentPicker from './components/DocumentPicker';
import Canvas from './components/Canvas';
import { useState } from 'react';
import './index.css';

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

type AppState = 'landing' | 'about' | 'document-picker' | 'canvas';

function LandingOnly() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleConnect = async (credentials: UserCredentials) => {
    // Store credentials
    setUserCredentials(credentials);
    
    // Move to document picker
    setAppState('document-picker');
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setAppState('canvas');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
    setUserCredentials(null);
    setSelectedDocument(null);
  };

  const handleBackToDocumentPicker = () => {
    setAppState('document-picker');
    setSelectedDocument(null);
  };

  const handleNavigateToAbout = () => {
    setAppState('about');
  };

  const handleNavigateToHome = () => {
    setAppState('landing');
  };

  if (appState === 'about') {
    return <About onNavigateToHome={handleNavigateToHome} />;
  }

  if (appState === 'document-picker' && userCredentials) {
    return (
      <DocumentPicker
        credentials={{
          accessKey: userCredentials.accessKey,
          secretKey: userCredentials.secretKey,
        }}
        onDocumentSelect={handleDocumentSelect}
        onBack={handleBackToLanding}
        onNavigateToHome={handleBackToLanding}
      />
    );
  }

  if (appState === 'canvas' && selectedDocument && userCredentials) {
    return (
      <div className="w-full h-screen">
        <Canvas 
          userCredentials={userCredentials}
          selectedDocument={selectedDocument}
          onBack={handleBackToDocumentPicker}
          onNavigateToHome={handleBackToLanding}
        />
      </div>
    );
  }

  return <LandingPageRedesign onConnect={handleConnect} onNavigateToAbout={handleNavigateToAbout} />;
}

export default LandingOnly;