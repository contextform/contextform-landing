import { Handle, Position } from 'reactflow';
import { useState } from 'react';

interface MaterialNodeProps {
  data: {
    material: string;
    onMaterialChange: (material: string) => void;
  };
}

const materials = [
  { value: 'steel', label: 'Steel (200 GPa)', color: 'bg-gray-600' },
  { value: 'aluminum', label: 'Aluminum (70 GPa)', color: 'bg-blue-500' },
  { value: 'plastic', label: 'ABS Plastic (2.3 GPa)', color: 'bg-yellow-500' },
  { value: 'titanium', label: 'Titanium (110 GPa)', color: 'bg-purple-500' }
];

export default function MaterialNode({ data }: MaterialNodeProps) {
  const [selectedMaterial, setSelectedMaterial] = useState(data.material || 'steel');
  
  const currentMaterial = materials.find(m => m.value === selectedMaterial);

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material);
    data.onMaterialChange(material);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300 p-4 min-w-[200px]">
      <Handle type="target" position={Position.Left} />
      
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-4 h-4 rounded ${currentMaterial?.color}`}></div>
        <h3 className="font-semibold text-gray-800">Material</h3>
      </div>
      
      <select
        value={selectedMaterial}
        onChange={(e) => handleMaterialChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        {materials.map((material) => (
          <option key={material.value} value={material.value}>
            {material.label}
          </option>
        ))}
      </select>
      
      <div className="mt-2 text-xs text-gray-600">
        Young's Modulus: {currentMaterial?.label.match(/\(([^)]+)\)/)?.[1] || '200 GPa'}
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
}