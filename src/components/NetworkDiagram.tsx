'use client';

interface NetworkDiagramProps {
  className?: string;
}

export default function NetworkDiagram({ className = '' }: NetworkDiagramProps) {
  const stages = [
    { id: 'farmer', label: 'Farmer', icon: '🌾', color: 'bg-green-500' },
    { id: 'collector', label: 'Collector', icon: '🚚', color: 'bg-blue-500' },
    { id: 'processor', label: 'Processor', icon: '🏭', color: 'bg-purple-500' },
    { id: 'manufacturer', label: 'Manufacturer', icon: '⚗️', color: 'bg-orange-500' },
    { id: 'consumer', label: 'Consumer', icon: '🛒', color: 'bg-red-500' }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
        Supply Chain Network
      </h3>
      
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex flex-col items-center">
            <div className={`w-12 h-12 ${stage.color} rounded-full flex items-center justify-center text-white text-xl shadow-lg`}>
              {stage.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 mt-2 text-center">
              {stage.label}
            </span>
            
            {index < stages.length - 1 && (
              <div className="hidden sm:block absolute top-6 left-1/2 transform translate-x-6">
                <svg className="w-8 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 4">
                  <path d="M0 2h20l-4-2 4-2v4z"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs text-gray-600">
        <div className="text-center">
          <div className="font-medium">Harvest & Track</div>
          <div>IoT sensors, photos, location data</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Collection</div>
          <div>Quality check, batch grouping</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Processing</div>
          <div>Drying, grinding, storage</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Manufacturing</div>
          <div>Product creation, packaging</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Distribution</div>
          <div>Retail, consumer access</div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Blockchain Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Quality Tested</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Regulatory Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
