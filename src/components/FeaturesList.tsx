import type { Feature } from '../types';

interface FeaturesListProps {
  features: Feature[];
  onRefresh: () => void;
}

const FeaturesList = ({ features, onRefresh }: FeaturesListProps) => {
  const getFeatureIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sketch':
      case 'newsketch':
        return '📐';
      case 'extrude':
        return '📦';
      case 'fillet':
        return '🔄';
      case 'revolve':
        return '🌀';
      case 'hole':
        return '⚫';
      case 'pattern':
        return '🔢';
      default:
        return '🔧';
    }
  };

  const getFeatureDetails = (feature: Feature) => {
    const details = [];
    
    if (feature.dimensions && feature.dimensions.length > 0) {
      details.push(`📏 ${feature.dimensions.join(' × ')}`);
    }
    
    if (feature.depth) {
      details.push(`📏 Depth: ${feature.depth}`);
    }
    
    return details.length > 0 ? details.join(' | ') : 'No parameters';
  };

  if (features.length === 0) {
    return (
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Model Features</h3>
        <div className="text-xs text-gray-500 mb-3">Loading features...</div>
        <button
          onClick={onRefresh}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Current Model Features</h3>
        <button
          onClick={onRefresh}
          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          title="Refresh features"
        >
          🔄
        </button>
      </div>
      
      <div className="space-y-2 max-h-32 overflow-y-auto chat-scroll">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-lg p-2 border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start gap-2">
              <span className="text-sm">{getFeatureIcon(feature.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900 truncate">
                    {feature.name || 'Unnamed'}
                  </span>
                  <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded uppercase font-mono">
                    {feature.type}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {getFeatureDetails(feature)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        {features.length} feature{features.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
};

export default FeaturesList;