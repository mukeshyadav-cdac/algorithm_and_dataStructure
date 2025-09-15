import React from 'react';
import { useAlgorithmContext } from '../../context';
import { Header, Layout } from '../UI';
import { RuntimeStatus } from '../RuntimeStatus';

/**
 * Main Algorithm Visualizer Component
 * This is a simplified version showing the new architecture
 * TODO: Extract full implementation from original App.tsx
 */
export const AlgorithmVisualizer: React.FC = () => {
  const {
    currentAlgorithm,
    currentLanguage,
    grid,
    isAnimating,
    startVisualization,
    resetVisualization,
    runAlgorithmTests,
    getCellColor,
    formatCellValueForDisplay
  } = useAlgorithmContext();

  return (
    <Layout>
      <Header />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Control Panel - TODO: Extract to ControlPanel component */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentAlgorithm?.name || 'Select Algorithm'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {currentAlgorithm?.description}
            </p>
            
            <div className="space-y-2">
              <button
                onClick={startVisualization}
                disabled={isAnimating}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all"
              >
                {isAnimating ? 'Running...' : 'Start Visualization'}
              </button>
              
              <button
                onClick={resetVisualization}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              
              <button
                onClick={runAlgorithmTests}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Run Tests
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Language</h3>
            <p className="text-sm text-gray-600">
              {currentLanguage?.name || 'None'}
              {currentLanguage?.runtimeStatus === 'ready' ? ' ✅' : ' 📚'}
            </p>
          </div>

          {/* Runtime Status */}
          <RuntimeStatus />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Grid Visualization - TODO: Extract to GridVisualization component */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentAlgorithm?.name} Visualization
            </h3>
            
            <div className="flex justify-center">
              <div 
                className="grid gap-2 p-4"
                style={{ 
                  gridTemplateColumns: `repeat(${grid[0]?.length || 1}, minmax(0, 1fr))`,
                  maxWidth: '800px'
                }}
              >
                {grid.map((row, i) =>
                  row.map((cell, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`
                        w-16 h-16 border-2 rounded-lg flex items-center justify-center
                        font-bold text-sm transition-all duration-300 transform
                        ${getCellColor(cell)}
                        ${cell.isCurrentPath ? 'scale-110' : ''}
                      `}
                    >
                      {formatCellValueForDisplay(cell.value)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Test Results - TODO: Extract to TestResults component */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Results</h3>
            <p className="text-gray-600">Test results will appear here...</p>
          </div>

          {/* Code Display - TODO: Extract to CodeDisplay component */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Code Implementation
            </h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{currentLanguage?.code || 'No code available'}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
