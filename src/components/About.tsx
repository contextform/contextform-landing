
interface AboutProps {
  onNavigateToHome?: () => void;
}

export default function About({ onNavigateToHome }: AboutProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation Bar */}
      <nav className="bg-black border-b border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={onNavigateToHome}
                className="text-2xl font-bold text-white hover:text-gray-300 transition-colors"
              >
                contextform
              </button>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={onNavigateToHome}
                className="text-gray-400 hover:text-white font-medium"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="relative">
          <div className="max-w-4xl mx-auto px-6 py-16">
            
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                contextform accelerates hardware development by building the memory layer for AI in CAD workflows. 
                We enable AI to understand design intent and context, helping engineering teams iterate faster 
                from concept to manufacturing-ready products.
              </p>
              
              <p className="text-lg text-gray-300">
                Built by <a href="https://www.linkedin.com/in/josephwuu/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Joseph</a> and <a href="https://www.linkedin.com/in/k-yr-k/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Kenny</a>.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
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