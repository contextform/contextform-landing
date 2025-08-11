import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import '../animations.css';

interface LandingPageProps {
  onConnect?: (credentials: UserCredentials) => void;
  onNavigateToAbout?: () => void;
}

interface UserCredentials {
  email: string;
  name: string;
  accessKey: string;
  secretKey: string;
}

export default function LandingPageRedesign({ onNavigateToAbout }: LandingPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentIcons, setCurrentIcons] = useState({
    input: 0,
    memory: 0,
    llm: 0,
    output: 0
  });

  const workflowIcons = {
    input: ['/text-icon.svg', '/image-icon.svg', '/link-icon.svg'],
    memory: ['🧠', '💾', '📊', '🔍'],
    llm: ['/anthropic.svg', '/openai.svg'],
    output: ['📦', '🛠️', '📐', '⚙️']
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Simple interval - change all icons every 3 seconds
    const interval = setInterval(() => {
      setCurrentIcons(prev => ({
        input: (prev.input + 1) % workflowIcons.input.length,
        memory: (prev.memory + 1) % workflowIcons.memory.length,
        llm: (prev.llm + 1) % workflowIcons.llm.length,
        output: (prev.output + 1) % workflowIcons.output.length
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [workflowIcons]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="font-sans text-2xl font-medium text-foreground hover:text-foreground/70 transition-colors"
              >
                contextform
              </button>
              <div className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('demo')}
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  How it works
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              <Button 
                onClick={() => setShowModal(true)}
                className="px-6 py-[1.125rem] font-medium hover:scale-105 transition-all"
              >
                Get a Demo
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-10 px-6 overflow-hidden">
        {/* Grid Cross Pattern Background */}
        <div 
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M29 26h2v6h6v2h-6v6h-2v-6h-6v-2h6v-6z' fill='%23000'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className={`text-center space-y-8 transition-all duration-1000 bg-background/95 backdrop-blur-sm rounded-3xl p-12 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[2.5rem]'}`}>
            {/* Main Headline */}
            <h1 className="font-sans text-6xl md:text-8xl text-foreground font-medium" style={{lineHeight: '1.2'}}>
              AI Agents for
              <br />
              <span className="text-foreground">
                CAD Models
              </span>
            </h1>

            {/* Subheadline */}
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Capture Modeling Memory. Generate CAD. Iterate at Speed.
              <br />
              AI agents that learn from your CAD engineering process.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                onClick={() => setShowModal(true)}
                size="lg"
                className="text-xl px-10 py-7 hover:scale-105 transition-all"
              >
                Get a Demo
              </Button>
              <Button 
                variant="secondary"
                onClick={() => scrollToSection('demo')}
                size="lg"
                className="text-xl px-10 py-7 hover:scale-105 transition-all"
              >
                Watch Video
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Workflow Visualization */}
      <section className="relative pt-0 pb-32 px-6 overflow-hidden">
        {/* Grid Cross Pattern Background */}
        <div 
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M29 26h2v6h6v2h-6v6h-2v-6h-6v-2h6v-6z' fill='%23000'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 -20px'
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            {/* Input */}
            <div className="flex flex-col items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-sm">Input</Badge>
              <Card className="w-36 h-28 flex items-center justify-center border border-muted-foreground/20 bg-background shadow-lg">
                <CardContent className="p-0 relative w-8 h-8">
                  {workflowIcons.input.map((icon, index) => (
                    <img 
                      key={icon}
                      src={icon}
                      alt="Input Icon"
                      className="absolute inset-0 w-8 h-8 object-contain grayscale"
                      style={{
                        opacity: index === currentIcons.input ? 0.4 : 0,
                        transition: 'opacity 0.6s ease-in-out'
                      }}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <span className="text-gray-400 text-xl self-center mt-6">→</span>
            
            {/* CAD Memory */}
            <div className="flex flex-col items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 rounded-sm">CAD Memory</Badge>
              <Card className="w-36 h-28 flex items-center justify-center border border-muted-foreground/20 bg-background shadow-lg">
                <CardContent className="p-0">
                  <img 
                    src="/memory-icon.svg"
                    alt="CAD Memory Icon"
                    className="w-24 h-24 object-contain grayscale opacity-40"
                  />
                </CardContent>
              </Card>
            </div>
            
            <span className="text-gray-400 text-xl self-center mt-6">→</span>
            
            {/* LLM */}
            <div className="flex flex-col items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 rounded-sm">LLM</Badge>
              <Card className="w-36 h-28 flex items-center justify-center border border-muted-foreground/20 bg-background shadow-lg">
                <CardContent className="p-0 relative w-8 h-8">
                  {workflowIcons.llm.map((icon, index) => (
                    <img 
                      key={icon}
                      src={icon}
                      alt="AI Logo"
                      className="absolute inset-0 w-8 h-8 object-contain grayscale"
                      style={{
                        opacity: index === currentIcons.llm ? 0.4 : 0,
                        transition: 'opacity 0.6s ease-in-out'
                      }}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <span className="text-gray-400 text-xl self-center mt-6">→</span>
            
            {/* CAD Model */}
            <div className="flex flex-col items-center gap-2">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-sm">CAD Model</Badge>
              <Card className="w-36 h-28 flex items-center justify-center border border-muted-foreground/20 bg-background shadow-lg">
                <CardContent className="p-0">
                  <img 
                    src="/cad-icon.svg"
                    alt="CAD Icon"
                    className="w-8 h-8 object-contain grayscale opacity-40"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section id="demo" className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-sans text-4xl text-foreground mb-4 font-semibold">See it in action</h2>
            <p className="text-xl text-muted-foreground">Watch how contextform transforms your CAD workflow</p>
          </div>
          
          <div className="relative rounded-[calc(var(--radius)+1rem)] overflow-hidden shadow-lg bg-muted/20">
            <div className="aspect-video flex items-center justify-center">
              <video 
                className="w-full h-full object-cover"
                controls
                poster="/assets/contextform_v0_poster.jpg"
              >
                <source src="/assets/contextform_v0.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground">10x</div>
              <div className="text-muted-foreground mt-2">Faster to production</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground">85%</div>
              <div className="text-muted-foreground mt-2">Fewer DFM iterations</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground">3min</div>
              <div className="text-muted-foreground mt-2">Average setup time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Built for modern engineering teams
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features that integrate seamlessly with your existing CAD tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/20 rounded-[var(--radius)] flex items-center justify-center mb-6">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="font-sans text-xl font-semibold text-foreground mb-3">
                  Learns Your Patterns
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI that understands your design methodology and adapts to your specific engineering requirements.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/20 rounded-[var(--radius)] flex items-center justify-center mb-6">
                  <span className="text-2xl">🏭</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Real-time DFM Checks
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Catch manufacturing issues before they become expensive problems. Get instant feedback on design decisions.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/20 rounded-[var(--radius)] flex items-center justify-center mb-6">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Iterative Design Memory
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Remembers why you made changes and suggests improvements based on past design decisions.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/20 rounded-[var(--radius)] flex items-center justify-center mb-6">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Natural Language Control
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Simply describe what you want to change. No complex commands or menu navigation required.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/20 rounded-[var(--radius)] flex items-center justify-center mb-6">
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  CAD Tool Integration
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Works with Onshape, SolidWorks, Fusion 360, and more. Seamless integration with your existing workflow.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/20 rounded-[var(--radius)] flex items-center justify-center mb-6">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Design Analytics
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track design iterations, identify bottlenecks, and optimize your engineering process with data insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>





      {/* Demo Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-card rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-foreground">Book a demo</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              />
              <textarea
                placeholder="Message (Optional)"
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground resize-none"
              />
              <Button
                type="submit"
                className="w-full py-3 font-medium"
              >
                Book demo
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}