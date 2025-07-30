import { useState, useEffect } from 'react';
import { DocumentIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface Document {
  id: string;
  name: string;
  createdAt?: string;
  modifiedAt?: string;
}

interface DocumentPickerProps {
  credentials: {
    accessKey: string;
    secretKey: string;
  };
  onDocumentSelect: (document: Document) => void;
  onBack: () => void;
  onNavigateToHome?: () => void;
}

export default function DocumentPicker({ credentials, onDocumentSelect, onBack, onNavigateToHome }: DocumentPickerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call your backend to fetch documents using user's credentials
      const response = await fetch('http://localhost:3000/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessKey: credentials.accessKey,
          secretKey: credentials.secretKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform Onshape response to our Document format
      const docs: Document[] = data.items?.map((item: any) => ({
        id: item.id,
        name: item.name,
        createdAt: new Date(item.createdAt).toLocaleDateString(),
        modifiedAt: new Date(item.modifiedAt).toLocaleDateString(),
      })) || [];
      
      setDocuments(docs);
    } catch (err: any) {
      console.error('Document fetch error:', err);
      
      // Provide specific error messages based on the error
      let errorMessage = 'Failed to fetch documents. ';
      
      if (err.message?.includes('401')) {
        errorMessage += 'Invalid API credentials. Please check your access and secret keys.';
      } else if (err.message?.includes('403')) {
        errorMessage += 'Access denied. Your API credentials may not have the required permissions.';
      } else if (err.message?.includes('429')) {
        errorMessage += 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (err.message?.includes('500')) {
        errorMessage += 'Onshape server error. Please try again later.';
      } else if (err.message?.includes('Failed to fetch')) {
        errorMessage += 'Network error. Please check your internet connection.';
      } else {
        errorMessage += 'Please check your API credentials and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSelect = () => {
    if (selectedDoc) {
      onDocumentSelect(selectedDoc);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={onNavigateToHome}
                className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
              >
                contextform
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center p-4" style={{minHeight: 'calc(100vh - 64px)'}}>
      <div className="max-w-lg w-full bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
            <DocumentIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-black mb-2">
            Select Your CAD Document
          </h2>
          <p className="text-gray-600 text-sm">
            Choose a document to start designing with AI memory
          </p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading your documents...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchDocuments}
              className="text-black hover:text-gray-800 text-sm font-medium mt-2 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && documents.length > 0 && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Documents
              </label>
              <div className="relative">
                <select
                  value={selectedDoc?.id || ''}
                  onChange={(e) => {
                    const doc = documents.find(d => d.id === e.target.value);
                    setSelectedDoc(doc || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                >
                  <option value="">Select a document...</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {selectedDoc && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-1">{selectedDoc.name}</h3>
                <p className="text-sm text-gray-600">
                  Created: {selectedDoc.createdAt} • Modified: {selectedDoc.modifiedAt}
                </p>
              </div>
            )}

            <button
              onClick={handleDocumentSelect}
              disabled={!selectedDoc}
              className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Start Designing with AI Memory
            </button>
          </>
        )}

        {!loading && !error && documents.length === 0 && (
          <div className="text-center py-8">
            <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No documents found</p>
            <p className="text-sm text-gray-500">
              Create a blank document in Onshape first, then refresh here.
            </p>
            <button
              onClick={fetchDocuments}
              className="text-black hover:text-gray-800 text-sm font-medium mt-2 underline"
            >
              Refresh documents
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-black font-medium"
          >
            ← Back to connection
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}