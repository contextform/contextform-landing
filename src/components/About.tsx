
interface AboutProps {
  onNavigateToHome?: () => void;
}

export default function About({ onNavigateToHome }: AboutProps) {
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
            
            <div className="flex items-center">
              <button 
                onClick={onNavigateToHome}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        <div className="relative">
          <div className="max-w-4xl mx-auto px-6 py-16">
            
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                contextform accelerates hardware development by building the memory layer for AI in CAD workflows. 
                We enable AI to understand design intent and context, helping engineering teams iterate faster 
                from concept to manufacturing-ready products.
              </p>
              
              <p className="text-lg text-gray-700">
                Built by <a href="https://www.linkedin.com/in/josephwuu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Joseph</a>, <a href="https://www.linkedin.com/in/k-yr-k/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Kenny</a>, <a href="https://www.linkedin.com/in/ib-ibrahim/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Ibrahim</a>.
              </p>
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