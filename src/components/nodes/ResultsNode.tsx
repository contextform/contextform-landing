import { Handle, Position } from 'reactflow';
import { useState } from 'react';

interface ResultsNodeProps {
  data: {
    hasResults: boolean;
    maxStress: number;
    safetyFactor: number;
    maxDisplacement: number;
  };
}

export default function ResultsNode({ data }: ResultsNodeProps) {
  const [selectedView, setSelectedView] = useState('stress');
  
  const { hasResults, maxStress = 45.2, safetyFactor = 2.1, maxDisplacement = 0.15 } = data;
  
  const views = [
    { value: 'stress', label: 'Von Mises Stress', icon: '🔥' },
    { value: 'displacement', label: 'Displacement', icon: '📏' },
    { value: 'safety', label: 'Safety Factor', icon: '🛡️' }
  ];

  const getStressColor = (stress: number) => {
    if (stress < 30) return 'text-green-600';
    if (stress < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSafetyColor = (factor: number) => {
    if (factor > 2.0) return 'text-green-600';
    if (factor > 1.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-blue-300 p-4 min-w-[280px]">
      <Handle type="target" position={Position.Left} />
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📊</span>
        <h3 className="font-semibold text-gray-800">Results</h3>
      </div>
      
      {!hasResults ? (
        <div className="text-center py-6 text-gray-500">
          <div className="text-4xl mb-2">⏳</div>
          <div className="text-sm">Run analysis to see results</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">View</label>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {views.map((view) => (
                <option key={view.value} value={view.value}>
                  {view.icon} {view.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Mock stress visualization */}
          <div className="bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 h-20 rounded border-2 border-gray-200 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                Stress Visualization
              </div>
            </div>
            {/* Mock stress concentration point */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          </div>
          
          {/* Results summary */}
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Max Stress:</span>
              <span className={`font-bold ${getStressColor(maxStress)}`}>
                {maxStress} MPa
              </span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Safety Factor:</span>
              <span className={`font-bold ${getSafetyColor(safetyFactor)}`}>
                {safetyFactor}x
              </span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Max Displacement:</span>
              <span className="font-bold text-blue-600">
                {maxDisplacement} mm
              </span>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="text-center">
            {safetyFactor > 2.0 ? (
              <div className="text-green-700 text-xs">
                ✅ Design is safe with good margin
              </div>
            ) : safetyFactor > 1.5 ? (
              <div className="text-yellow-700 text-xs">
                ⚠️ Design is acceptable but close to limit
              </div>
            ) : (
              <div className="text-red-700 text-xs">
                ❌ Design may fail - increase material or reduce load
              </div>
            )}
          </div>
        </div>
      )}
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
}