import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { OriginalVisualizerRoute, MultipleSolutionsRoute } from './routes';

/**
 * Main App Component with Router Support
 * Provides navigation between Original Visualizer and Multiple Solutions views
 */
const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Logo/Title */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                Dynamic Programming Visualizer
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Interactive algorithm learning platform
              </p>
            </div>
            
            {/* Navigation Links */}
            <div className="flex justify-center items-center gap-4">
              <Link
                to="/original"
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  location.pathname === '/original'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Original Visualizer (5 Problems)
              </Link>

              <Link
                to="/multiple-solutions"
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  location.pathname === '/multiple-solutions'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Multiple Solutions & Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Route Content */}
      <Routes>
        {/* Default redirect to original visualizer */}
        <Route path="/" element={<Navigate to="/original" replace />} />
        
        {/* Original Algorithm Visualizer */}
        <Route path="/original" element={<OriginalVisualizerRoute />} />
        
        {/* Multiple Solutions & Complexity Analysis */}
        <Route path="/multiple-solutions" element={<MultipleSolutionsRoute />} />
        
        {/* Fallback for unmatched routes */}
        <Route path="*" element={<Navigate to="/original" replace />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>Dynamic Programming Algorithm Visualizer</strong> - 
              Interactive learning platform for algorithm visualization and analysis
            </p>
            <div className="flex justify-center items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Interactive Visualizations</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Complexity Analysis</span>
              </div>
              <div>
                <span>Multi-Language Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
