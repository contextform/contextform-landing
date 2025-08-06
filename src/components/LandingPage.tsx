import { useState, useEffect } from 'react';
import React from 'react';
import '../animations.css';

interface LandingPageProps {
  onConnect?: (credentials: UserCredentials) => void;
  onNavigateToAbout?: () => void;
}

interface UserCredentials {
  email: string;
  name: string;
}

export default function LandingPage({ onConnect, onNavigateToAbout }: LandingPageProps) {
  const [credentials, setCredentials] = useState<UserCredentials>({
    email: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    <div className="min-h-screen bg-black">
      {/* Top Navigation Bar */}
      <nav className="bg-black border-b border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => window.location.reload()}
                className="text-2xl font-bold text-white hover:text-gray-300 transition-all duration-300 hover:scale-105"
              >
                contextform
              </button>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={() => onNavigateToAbout?.()}
                className="text-gray-400 hover:text-white font-medium transition-all duration-300 hover:scale-105"
              >
                About
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="relative">
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Main content section */}
            <div className="mb-16">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-white tracking-tight mb-6">
                    AI that learns from your CAD work
                    <br />
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
                      Generate new designs based on how you model
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Contextform is your CAD agent that learns from your modeling patterns. It works with you to iterate designs, catch DFM issues early, and adapt based on your changes - helping you reach manufacturing-ready parts 10x faster.
                  </p>
                </div>
                
                {/* How it works */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">How it works:</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-hover transition-all duration-300">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <span className="text-gray-300">Model as you normally do - AI learns your patterns</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-hover transition-all duration-300">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <span className="text-gray-300">Your CAD agent iterates with you based on design changes</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-hover transition-all duration-300">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <span className="text-gray-300">Get manufacturing-ready parts with automatic DFM checks</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Video demo section - full width */}
            <div className="mb-16">
              <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-900 hover:shadow-2xl transition-shadow duration-500">
                <video 
                  className="w-full aspect-video hover:scale-[1.02] transition-transform duration-500"
                  controls
                  poster="/assets/contextform_v0_poster.jpg"
                >
                  <source src="/assets/contextform_v0.mp4" type="video/mp4" />
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-gray-900 text-2xl">▶</span>
                      </div>
                      <p className="text-white text-lg font-medium">See how it eliminates design-manufacturing loops</p>
                      <p className="text-gray-300 mt-1">Connected CAD and DFM checking working together</p>
                    </div>
                  </div>
                </video>
              </div>
            </div>
            
            {/* Memory explanation section */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-6">
                  LLMs are getting smarter. Your CAD tools should too.
                  <br />
                  <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    We're building the memory infrastructure that lets AI understand how engineers design.
                  </span>
                </h2>
              </div>
              
              <div className="max-w-6xl mx-auto mb-8">
                <div className="space-y-6">
                <div className="flex items-start space-x-4 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                  <div className="w-8 h-8 bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse-hover">
                    <span className="text-green-400 text-lg">🧠</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">AI that remembers your design</h3>
                    <p className="text-gray-400">
                      Understands how you built your 3D model and why so it can help you improve it
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                  <div className="w-8 h-8 bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse-hover">
                    <span className="text-green-400 text-lg">🔗</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">All your tools connected</h3>
                    <p className="text-gray-400">
                      Visual canvas connects CAD and manufacturing workflows.
                      <br />
                      AI automatically identifies DFM issues and suggests manufacturing-ready solutions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                  <div className="w-8 h-8 bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse-hover">
                    <span className="text-green-400 text-lg">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Build hardware 10x faster</h3>
                    <p className="text-gray-400">
                      Skip endless design-manufacturing loops. Get from idea to production-ready parts faster
                    </p>
                  </div>
                </div>
              </div>
              </div>
              
              {/* CAD Memory Flow Diagram */}
              <div className="mb-8">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-4">
                    
                    {/* Step 1: CAD Features */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">🔧</span>
                      </div>
                      <h5 className="font-semibold text-white mb-2">CAD Features</h5>
                      <p className="text-sm text-gray-400 max-w-32">
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
                      <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <h5 className="font-semibold text-white mb-2">Memory Layer</h5>
                      <p className="text-sm text-gray-400 max-w-32">
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
                      <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <h5 className="font-semibold text-white mb-2">AI Understanding</h5>
                      <p className="text-sm text-gray-400 max-w-32">
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
                      <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">🏭</span>
                      </div>
                      <h5 className="font-semibold text-white mb-2">DFM Checks</h5>
                      <p className="text-sm text-gray-400 max-w-32">
                        Manufacturing validation and design optimization
                      </p>
                    </div>
                    
                  </div>
                  
                  {/* Bottom explanation */}
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <p className="text-center text-sm text-gray-400">
                      <span className="font-medium">Unlike traditional CAD tools</span>, contextform captures the "why" behind every modeling decision,
                      <br />
                      enabling AI to provide contextual suggestions and automate DFM validation based on your design intent.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group cursor-pointer">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:animate-pulse">
                      <span className="text-red-400 text-xl">✗</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white">Regular CAD AI</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-gray-300">Sees shapes, not intent</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-gray-300">Can't understand your design choices</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-gray-300">Manufacturing issues found too late</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group cursor-pointer">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:animate-pulse">
                      <span className="text-green-400 text-xl">✓</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white">contextform AI</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-300">Remembers why you made each feature</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-300">Suggests improvements based on your goals</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-300">Identifies DFM issues early in design</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 contextform | All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}