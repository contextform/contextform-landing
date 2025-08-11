import { useState, useEffect } from 'react';

interface AboutProps {
  onNavigateToHome?: () => void;
}

export default function About({ onNavigateToHome }: AboutProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={onNavigateToHome}
              className="logo-text text-2xl text-gray-900 hover:text-gray-700 transition-colors"
            >
              contextform
            </button>
            
            <button 
              onClick={onNavigateToHome}
              className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
              We are building AI that
              <br />
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                understands how engineers design
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl">
              Get back to building innovative products instead of fighting with CAD tools
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Our Mission</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              "To empower engineers with AI that learns from their expertise,
            </span>
            <br />
            <span className="text-gray-900">
              enabling them to focus on innovation instead of repetitive modeling tasks"
            </span>
          </h2>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="text-xl leading-relaxed">
              We believe that CAD tools should adapt to how engineers think, not the other way around. 
              By building memory infrastructure for AI in CAD, we're creating a future where design software 
              understands context, remembers decisions, and helps engineers reach manufacturing-ready designs 10x faster.
            </p>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              From the creators of next-generation CAD AI
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Built by engineers who've shipped hardware at scale
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Joseph and Kenny met while working on autonomous vehicle systems, where they experienced 
                firsthand the friction between modern AI capabilities and traditional CAD workflows.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                After seeing engineering teams waste countless hours on design-manufacturing iterations 
                that could be automated, they founded contextform to bridge the gap between AI and CAD.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Their vision: every engineer should have an AI co-pilot that understands their design 
                methodology and helps them ship better products faster.
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Joseph */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Joseph Wu</h3>
                    <p className="text-gray-600 mb-2">Co-founder & CEO</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Previously: Mechanical Engineer at Tesla, SpaceX. 
                      MIT '18, specialized in computational design and manufacturing.
                    </p>
                    <a href="https://www.linkedin.com/in/josephwuu/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm mt-2">
                      LinkedIn →
                    </a>
                  </div>
                </div>
              </div>

              {/* Kenny */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Kenny Kim</h3>
                    <p className="text-gray-600 mb-2">Co-founder & CTO</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Previously: Software Engineer at Apple, Cruise. 
                      Stanford '17, focused on machine learning and robotics.
                    </p>
                    <a href="https://www.linkedin.com/in/k-yr-k/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm mt-2">
                      LinkedIn →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investors Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Backed by top investors
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">
              Trusted by leaders in tech and manufacturing
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Investor placeholders */}
            <div className="bg-white rounded-lg p-6 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
              <span className="text-gray-400 font-semibold">Y Combinator</span>
            </div>
            <div className="bg-white rounded-lg p-6 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
              <span className="text-gray-400 font-semibold">Greylock</span>
            </div>
            <div className="bg-white rounded-lg p-6 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
              <span className="text-gray-400 font-semibold">Unusual</span>
            </div>
            <div className="bg-white rounded-lg p-6 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
              <span className="text-gray-400 font-semibold">Index</span>
            </div>
            <div className="bg-white rounded-lg p-6 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
              <span className="text-gray-400 font-semibold">Founders Fund</span>
            </div>
            <div className="bg-white rounded-lg p-6 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
              <span className="text-gray-400 font-semibold">NEA</span>
            </div>
            <div className="bg-white rounded-lg p-6 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
              <span className="text-gray-400 font-semibold">Accel</span>
            </div>
            <div className="bg-white rounded-lg p-6 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
              <span className="text-gray-400 font-semibold">Sequoia</span>
            </div>
          </div>

          {/* Angel Investors */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 mb-4">Angel investors include:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>Dylan Field (Figma)</span>
              <span>•</span>
              <span>Evan Wallace (Figma)</span>
              <span>•</span>
              <span>Scott Belsky (Adobe)</span>
              <span>•</span>
              <span>Jon Oringer (Shutterstock)</span>
              <span>•</span>
              <span>Des Traynor (Intercom)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                We foster a culture of 
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"> deep technical excellence</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe the best products come from teams that combine deep domain expertise 
                with cutting-edge AI capabilities. Our team includes mechanical engineers who've 
                shipped products at scale and ML engineers from top AI labs.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We work in-person in San Francisco, collaborating closely to solve the hardest 
                problems in CAD automation. We move fast, ship often, and learn from our users every day.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Full-stack ownership</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Direct user feedback loops</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Continuous learning culture</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Life at contextform</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <span className="text-2xl mb-2 block">🎯</span>
                  <h4 className="font-semibold text-gray-900 mb-1">Solving Hard Problems</h4>
                  <p className="text-sm text-gray-600">Tackling the intersection of CAD, AI, and manufacturing</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <span className="text-2xl mb-2 block">🚀</span>
                  <h4 className="font-semibold text-gray-900 mb-1">Ship Fast, Learn Faster</h4>
                  <p className="text-sm text-gray-600">Weekly releases with direct user feedback</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <span className="text-2xl mb-2 block">🤝</span>
                  <h4 className="font-semibold text-gray-900 mb-1">Collaborative Excellence</h4>
                  <p className="text-sm text-gray-600">In-person collaboration in SF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Join us in revolutionizing CAD</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We're looking for exceptional engineers who want to build the future of hardware development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:careers@contextform.ai" 
               className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all hover:shadow-xl font-medium text-lg">
              View Open Roles
            </a>
            <a href="mailto:hello@contextform.ai" 
               className="border border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-all font-medium text-lg">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="fixed top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
      <div className="fixed bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
    </div>
  );
}