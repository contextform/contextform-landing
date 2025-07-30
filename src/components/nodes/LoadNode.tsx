import { Handle, Position } from 'reactflow';
import { useState } from 'react';

interface LoadNodeProps {
  data: {
    loadType: string;
    magnitude: number;
    direction: string;
    onLoadChange: (loadType: string, magnitude: number, direction: string) => void;
  };
}

const loadTypes = [
  { value: 'force', label: 'Point Force', icon: '⚡', unit: 'N' },
  { value: 'pressure', label: 'Pressure', icon: '🌊', unit: 'Pa' },
  { value: 'moment', label: 'Moment', icon: '🔄', unit: 'N⋅m' },
  { value: 'gravity', label: 'Gravity', icon: '⬇️', unit: 'g' }
];

const directions = [
  { value: 'x', label: 'X-Direction', icon: '➡️' },
  { value: 'y', label: 'Y-Direction', icon: '⬆️' },
  { value: 'z', label: 'Z-Direction', icon: '↗️' },
  { value: 'normal', label: 'Surface Normal', icon: '⊥' }
];

export default function LoadNode({ data }: LoadNodeProps) {
  const [loadType, setLoadType] = useState(data.loadType || 'force');
  const [magnitude, setMagnitude] = useState(data.magnitude || 100);
  const [direction, setDirection] = useState(data.direction || 'y');
  
  const currentLoad = loadTypes.find(l => l.value === loadType);
  const currentDirection = directions.find(d => d.value === direction);

  const handleChange = () => {
    data.onLoadChange(loadType, magnitude, direction);
  };

  const handleLoadTypeChange = (newLoadType: string) => {
    setLoadType(newLoadType);
    handleChange();
  };

  const handleMagnitudeChange = (newMagnitude: number) => {
    setMagnitude(newMagnitude);
    handleChange();
  };

  const handleDirectionChange = (newDirection: string) => {
    setDirection(newDirection);
    handleChange();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-red-300 p-4 min-w-[220px]">
      <Handle type="target" position={Position.Left} />
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{currentLoad?.icon}</span>
        <h3 className="font-semibold text-gray-800">Loads</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
          <select
            value={loadType}
            onChange={(e) => handleLoadTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            {loadTypes.map((load) => (
              <option key={load.value} value={load.value}>
                {load.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Magnitude ({currentLoad?.unit})
          </label>
          <input
            type="number"
            value={magnitude}
            onChange={(e) => handleMagnitudeChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            placeholder="100"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Direction</label>
          <select
            value={direction}
            onChange={(e) => handleDirectionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            {directions.map((dir) => (
              <option key={dir.value} value={dir.value}>
                {dir.icon} {dir.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-3 text-xs">
        <div className="flex items-center gap-1 text-red-700">
          <span>⚡</span>
          <span>{magnitude} {currentLoad?.unit} {currentDirection?.label}</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
}