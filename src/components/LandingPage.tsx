import { useState } from 'react';
import React from 'react';

interface LandingPageProps {
  onConnect?: (credentials: UserCredentials) => void;
  onNavigateToAbout?: () => void;
}

interface UserCredentials {
  email: string;
  name: string;
  platform: string;
  accessKey: string;
  secretKey: string;
}

export default function LandingPage({ onConnect, onNavigateToAbout }: LandingPageProps) {
  const [credentials, setCredentials] = useState<UserCredentials>({
    email: '',
    name: '',
    platform: 'onshape',
    accessKey: '',
    secretKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user has saved credentials on component mount
  React.useEffect(() => {
    const savedCredentials = localStorage.getItem('contextform_auth');
    if (savedCredentials) {
      try {
        const parsedCredentials = JSON.parse(savedCredentials);
        setCredentials(parsedCredentials);
      } catch (error) {
        // If credentials are invalid, remove them
        localStorage.removeItem('contextform_auth');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Save credentials to localStorage first
      localStorage.setItem('contextform_auth', JSON.stringify(credentials));
      
      // Show coming soon message for landing page mode
      if (!onConnect) {
        setError('🚀 Thanks for your interest! The full application is coming soon. We\'ll notify you when it\'s ready.');
        return;
      }
      
      // Then use app navigation
      await onConnect(credentials);
    } catch (error) {
      console.error('Connection failed:', error);
      setError('🚀 Thanks for your interest! The full application is coming soon. We\'ll notify you when it\'s ready.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) {
      setError(null);
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
                onClick={() => window.location.reload()}
                className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
              >
                contextform
              </button>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={() => onNavigateToAbout?.()}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                About
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        <div className="relative">
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Two-panel section */}
            <div className="grid lg:grid-cols-10 gap-16 items-start mb-16">
              {/* Left side content - spans 6 columns (60%) */}
              <div className="lg:col-span-6 space-y-8">
                <div>
                  <h1 className="text-6xl font-bold text-gray-900 tracking-tight mb-6">
                    Your AI Product Engineer
                    <br />
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                      for faster CAD-manufacturing workflows
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    AI learns your design as you model, performs DFM checks, and works with you to iterate the design until it's manufacturing ready.
                  </p>
                </div>
                
                {/* How it works */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works:</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <span className="text-gray-700">Connect your CAD platform to contextform</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <span className="text-gray-700">Start modeling normally, AI learns how you design</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <span className="text-gray-700">AI performs DFM checks and helps iterate for manufacturing readiness</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side form - spans 4 columns (40%) */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Skip Manual Design Iteration
                        <br />
                        For Free
                      </h2>
                      <p className="text-gray-600 flex items-center justify-center space-x-2">
                        <img src="/onshape-logo.png" alt="Onshape" className="h-6 w-auto" />
                        <span>available now</span>
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <p className="text-red-700 text-sm">{error}</p>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CAD Platform
                        </label>
                        <select
                          value={credentials.platform}
                          onChange={(e) => handleInputChange('platform', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                        >
                          <option value="onshape">Onshape</option>
                          <option value="solidworks" disabled className="text-gray-400">SolidWorks (Coming Soon)</option>
                          <option value="fusion360" disabled className="text-gray-400">Fusion 360 (Coming Soon)</option>
                          <option value="inventor" disabled className="text-gray-400">Inventor (Coming Soon)</option>
                          <option value="nx" disabled className="text-gray-400">NX (Coming Soon)</option>
                          <option value="rhinoceros" disabled className="text-gray-400">Rhinoceros (Coming Soon)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={credentials.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                          placeholder="m@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {credentials.platform === 'onshape' ? 'Onshape Access Key' : 
                           credentials.platform === 'solidworks' ? 'SolidWorks API Key' :
                           credentials.platform === 'fusion360' ? 'Fusion 360 API Key' :
                           credentials.platform === 'inventor' ? 'Inventor API Key' :
                           credentials.platform === 'rhinoceros' ? 'Rhinoceros API Key' :
                           'NX API Key'}
                        </label>
                        <input
                          type="text"
                          required
                          value={credentials.accessKey}
                          onChange={(e) => handleInputChange('accessKey', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                          placeholder={credentials.platform === 'onshape' ? 'Your access key' : 'Coming soon...'}
                          disabled={credentials.platform !== 'onshape'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {credentials.platform === 'onshape' ? 'Onshape Secret Key' :
                           credentials.platform === 'solidworks' ? 'SolidWorks Secret Key' :
                           credentials.platform === 'fusion360' ? 'Fusion 360 Secret Key' :
                           credentials.platform === 'inventor' ? 'Inventor Secret Key' :
                           credentials.platform === 'rhinoceros' ? 'Rhinoceros Secret Key' :
                           'NX Secret Key'}
                        </label>
                        <input
                          type="password"
                          required
                          value={credentials.secretKey}
                          onChange={(e) => handleInputChange('secretKey', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                          placeholder={credentials.platform === 'onshape' ? 'Your secret key' : 'Coming soon...'}
                          disabled={credentials.platform !== 'onshape'}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading || credentials.platform !== 'onshape'}
                        className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors flex items-center justify-center"
                      >
                        {loading && (
                          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                        )}
                        {loading ? 'Connecting...' : 'Get Started For Free'}
                      </button>
                    </form>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        {credentials.platform === 'onshape' ? (
                          <>
                            Need API keys?{' '}
                            <a href="https://dev-portal.onshape.com/" target="_blank" className="text-blue-600 hover:text-blue-700 font-medium">
                              Get them from Onshape →
                            </a>
                          </>
                        ) : (
                          <span className="text-gray-400">
                            {credentials.platform === 'solidworks' ? 'SolidWorks' : 
                             credentials.platform === 'fusion360' ? 'Fusion 360' :
                             credentials.platform === 'inventor' ? 'Inventor' :
                             credentials.platform === 'rhinoceros' ? 'Rhinoceros' :
                             'NX'} integration coming soon
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video demo section - full width */}
            <div className="mb-16">
              <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-900">
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-900 text-2xl">▶</span>
                    </div>
                    <p className="text-white text-lg font-medium">See how it eliminates design-manufacturing loops</p>
                    <p className="text-gray-300 mt-1">Connected CAD and DFM checking working together</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Memory explanation section */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  LLMs are getting smarter. Your CAD tools should too.
                  <br />
                  <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    We're building the memory infrastructure that lets AI understand how engineers design.
                  </span>
                </h2>
              </div>
              
              <div className="max-w-6xl mx-auto mb-8">
                <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-lg">🧠</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">AI that remembers your design</h3>
                    <p className="text-gray-600">
                      Understands how you built your 3D model and why so it can help you improve it
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-lg">🔗</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">All your tools connected</h3>
                    <p className="text-gray-600">
                      Visual canvas connects CAD and manufacturing workflows.
                      <br />
                      AI automatically identifies DFM issues and suggests manufacturing-ready solutions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-lg">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Build hardware 10x faster</h3>
                    <p className="text-gray-600">
                      Skip endless design-manufacturing loops. Get from idea to production-ready parts faster
                    </p>
                  </div>
                </div>
              </div>
              </div>
              
              {/* CAD Memory Flow Diagram */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mb-8">
                <div className="bg-white rounded-xl p-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-4">
                    
                    {/* Step 1: CAD Features */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-2xl">🔧</span>
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">CAD Features</h5>
                      <p className="text-sm text-gray-600 max-w-32">
                        Sketches, extrudes, fillets, constraints
                      </p>
                    </div>
                    
                    {/* Arrow 1 */}
                    <div className="flex items-center">
                      <div className="hidden lg:block w-8 h-0.5 bg-gradient-to-r from-blue-400 to-green-400"></div>
                      <div className="lg:hidden h-8 w-0.5 bg-gradient-to-b from-blue-400 to-green-400"></div>
                      <div className="w-3 h-3 bg-green-400 rotate-45 transform lg:ml-2 lg:mt-0 -mt-1"></div>
                    </div>
                    
                    {/* Step 2: Memory Layer */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">Memory Layer</h5>
                      <p className="text-sm text-gray-600 max-w-32">
                        Captures intent, parameters, relationships
                      </p>
                    </div>
                    
                    {/* Arrow 2 */}
                    <div className="flex items-center">
                      <div className="hidden lg:block w-8 h-0.5 bg-gradient-to-r from-green-400 to-purple-400"></div>
                      <div className="lg:hidden h-8 w-0.5 bg-gradient-to-b from-green-400 to-purple-400"></div>
                      <div className="w-3 h-3 bg-purple-400 rotate-45 transform lg:ml-2 lg:mt-0 -mt-1"></div>
                    </div>
                    
                    {/* Step 3: AI Understanding */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">AI Understanding</h5>
                      <p className="text-sm text-gray-600 max-w-32">
                        Contextual reasoning and suggestions
                      </p>
                    </div>
                    
                    {/* Arrow 3 */}
                    <div className="flex items-center">
                      <div className="hidden lg:block w-8 h-0.5 bg-gradient-to-r from-purple-400 to-orange-400"></div>
                      <div className="lg:hidden h-8 w-0.5 bg-gradient-to-b from-purple-400 to-orange-400"></div>
                      <div className="w-3 h-3 bg-orange-400 rotate-45 transform lg:ml-2 lg:mt-0 -mt-1"></div>
                    </div>
                    
                    {/* Step 4: DFM Checks */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-2xl">🏭</span>
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">DFM Checks</h5>
                      <p className="text-sm text-gray-600 max-w-32">
                        Manufacturing validation and design optimization
                      </p>
                    </div>
                    
                  </div>
                  
                  {/* Bottom explanation */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600">
                      <span className="font-medium">Unlike traditional CAD tools</span>, contextform captures the "why" behind every modeling decision,
                      <br />
                      enabling AI to provide contextual suggestions and automate DFM validation based on your design intent.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-red-600 text-xl">✗</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Regular CAD AI</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-gray-700">Sees shapes, not intent</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-gray-700">Can't understand your design choices</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-gray-700">Manufacturing issues found too late</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 text-xl">✓</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">contextform AI</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-700">Remembers why you made each feature</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-700">Suggests improvements based on your goals</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-700">Identifies DFM issues early in design</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2025 contextform | All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}