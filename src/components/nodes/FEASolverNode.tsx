import { Handle, Position } from 'reactflow';
import { useState } from 'react';

interface FEASolverNodeProps {
  data: {
    isRunning: boolean;
    onSolve: () => void;
  };
}

export default function FEASolverNode({ data }: FEASolverNodeProps) {
  const [isRunning, setIsRunning] = useState(data.isRunning || false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Ready to solve');

  const handleSolve = async () => {
    setIsRunning(true);
    setStatus('Initializing...');
    setProgress(0);

    // Mock solver progress
    const steps = [
      { progress: 15, status: 'Generating simulation...' },
      { progress: 30, status: 'Meshing geometry...' },
      { progress: 50, status: 'Assembling stiffness matrix...' },
      { progress: 70, status: 'Applying boundary conditions...' },
      { progress: 90, status: 'Solving linear system...' },
      { progress: 100, status: 'Analysis complete!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.progress);
      setStatus(step.status);
    }

    setTimeout(() => {
      setIsRunning(false);
      data.onSolve();
    }, 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-purple-300 p-4 min-w-[220px]">
      <Handle type="target" position={Position.Left} />
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔍</span>
        <h3 className="font-semibold text-gray-800">FEA Solver</h3>
      </div>
      
      <div className="space-y-3">
        <div className="text-center">
          <button
            onClick={handleSolve}
            disabled={isRunning}
            className={`w-full px-4 py-2 rounded text-white font-medium transition-colors ${
              isRunning 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isRunning ? 'Solving...' : 'Run Analysis'}
          </button>
        </div>
        
        {isRunning && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 text-center">
              {progress}% - {status}
            </div>
          </div>
        )}
        
        {!isRunning && progress > 0 && (
          <div className="text-xs text-center">
            <div className="flex items-center justify-center gap-1 text-green-700">
              <span>✅</span>
              <span>Analysis completed successfully</span>
            </div>
            <div className="text-gray-600 mt-1">
              Elements: 15,847 | Nodes: 3,291
            </div>
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
}