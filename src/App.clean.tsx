import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { MultipleSolutionsDemo } from './components/MultipleSolutionsDemo';

// Simple App component with clear navigation
const App: React.FC = () => {
  const [showMultipleSolutions, setShowMultipleSolutions] = useState(true); // Default to showing solutions

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with toggle buttons */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-center items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 mr-8">
              Dynamic Programming Visualizer
            </h1>
            
            <button
              onClick={() => setShowMultipleSolutions(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !showMultipleSolutions
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Original View
            </button>

            <button
              onClick={() => setShowMultipleSolutions(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                showMultipleSolutions
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Multiple Solutions & Complexity Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {showMultipleSolutions ? (
          <MultipleSolutionsDemo />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Original Algorithm Visualizer
            </h2>
            <p className="text-gray-600 mb-6">
              The original single-algorithm visualizer view would go here.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                🚀 Try the New Features!
              </h3>
              <p className="text-blue-700 mb-4">
                Click "Multiple Solutions & Complexity Analysis" above to explore:
              </p>
              <ul className="text-left text-blue-700 space-y-2">
                <li>• 4 different algorithmic approaches</li>
                <li>• Interactive performance analysis</li>
                <li>• Side-by-side solution comparison</li>
                <li>• Real-time complexity visualization</li>
                <li>• Educational insights and learning paths</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
