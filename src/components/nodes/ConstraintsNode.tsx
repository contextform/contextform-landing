import { Handle, Position } from 'reactflow';
import { useState } from 'react';

interface ConstraintsNodeProps {
  data: {
    constraint: string;
    onConstraintChange: (constraint: string) => void;
  };
}

const constraints = [
  { value: 'fixed', label: 'Fixed Support', icon: '📌', description: 'No translation or rotation' },
  { value: 'pinned', label: 'Pinned Support', icon: '📍', description: 'No translation, free rotation' },
  { value: 'roller', label: 'Roller Support', icon: '🎢', description: 'One direction constrained' },
  { value: 'hinge', label: 'Hinge', icon: '🔗', description: 'Connected rotation joint' }
];

export default function ConstraintsNode({ data }: ConstraintsNodeProps) {
  const [selectedConstraint, setSelectedConstraint] = useState(data.constraint || 'fixed');
  
  const currentConstraint = constraints.find(c => c.value === selectedConstraint);

  const handleConstraintChange = (constraint: string) => {
    setSelectedConstraint(constraint);
    data.onConstraintChange(constraint);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-green-300 p-4 min-w-[220px]">
      <Handle type="target" position={Position.Left} />
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{currentConstraint?.icon}</span>
        <h3 className="font-semibold text-gray-800">Constraints</h3>
      </div>
      
      <select
        value={selectedConstraint}
        onChange={(e) => handleConstraintChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
      >
        {constraints.map((constraint) => (
          <option key={constraint.value} value={constraint.value}>
            {constraint.label}
          </option>
        ))}
      </select>
      
      <div className="mt-2 text-xs text-gray-600">
        {currentConstraint?.description}
      </div>
      
      <div className="mt-3 text-xs">
        <div className="flex items-center gap-1 text-green-700">
          <span>✓</span>
          <span>Applied to base geometry</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
}