import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, Github } from 'lucide-react';

// Components
import { 
  AlgorithmSelector, 
  GridVisualization, 
  Card, 
  CardContent, 
  Button, 
  ButtonGroup,
  Badge,
  DifficultyBadge 
} from './components';

// Constants and Services
import { 
  getAllAlgorithms, 
  ALGORITHM_CATEGORIES 
} from './constants';

// Types
import type { Algorithm, Cell, AlgorithmSolution } from './types';

// Utils

/**
 * Main Algorithm Visualizer Page
 * Template Method Pattern: Defines the overall visualization workflow
 */
const AlgorithmVisualizerPage: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [selectedSolution, setSelectedSolution] = useState<AlgorithmSolution | null>(null);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(300);
  const [algorithmParams, setAlgorithmParams] = useState<Record<string, unknown>>({});

  const algorithms = getAllAlgorithms();

  // Initialize algorithm selection
  const handleAlgorithmSelect = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setSelectedSolution(algorithm.solutions[0] || null);
    setAlgorithmParams(algorithm.defaultParams);
    
    // Initialize grid
    const newGrid = algorithm.gridSetup(5, 5, algorithm.defaultParams);
    setGrid(newGrid);
  };

  // Handle solution selection
  const handleSolutionSelect = (solution: AlgorithmSolution) => {
    setSelectedSolution(solution);
  };

  // Run visualization
  const runVisualization = async () => {
    if (!selectedSolution || !selectedAlgorithm) return;

    setIsAnimating(true);

    try {
      // Reset grid
      const newGrid = selectedAlgorithm.gridSetup(
        algorithmParams.m as number || 5, 
        algorithmParams.n as number || 5, 
        algorithmParams
      );
      setGrid([...newGrid]);

      // Run the visualization
      await selectedSolution.visualizer(
        algorithmParams,
        (updatedGrid: Cell[][]) => setGrid([...updatedGrid]),
        (_step: number) => {}, // Step callback
        (_metrics) => {} // Metrics callback
      );
    } catch (error) {
      console.error('Visualization error:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Algorithm Selection Sidebar */}
          <div className="lg:col-span-1">
            <AlgorithmSelector
              algorithms={algorithms}
              categories={ALGORITHM_CATEGORIES}
              selectedAlgorithm={selectedAlgorithm || undefined}
              onAlgorithmSelect={handleAlgorithmSelect}
              layout="list"
              showCategories={false}
            />
          </div>

          {/* Main Visualization Area */}
          <div className="lg:col-span-2">
            {selectedAlgorithm ? (
              <div className="space-y-6">
                {/* Algorithm Header */}
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {React.createElement(selectedAlgorithm.icon, { 
                          className: "h-8 w-8 text-blue-600" 
                        })}
                        <h1 className="text-2xl font-bold text-gray-900">
                          {selectedAlgorithm.name}
                        </h1>
                      </div>
                      
                      <div className="flex gap-2">
                        <DifficultyBadge difficulty={selectedAlgorithm.difficulty} />
                        <Badge variant="secondary">
                          {selectedAlgorithm.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {selectedAlgorithm.description}
                    </p>

                    {/* Solution Selection */}
                    {selectedAlgorithm.solutions.length > 1 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Solutions</h3>
                        <ButtonGroup>
                          {selectedAlgorithm.solutions.map(solution => (
                            <Button
                              key={solution.id}
                              variant={selectedSolution?.id === solution.id ? 'primary' : 'outline'}
                              size="sm"
                              onClick={() => handleSolutionSelect(solution)}
                            >
                              {solution.name}
                            </Button>
                          ))}
                        </ButtonGroup>
                      </div>
                    )}

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <label className="text-sm text-gray-700">
                          Speed:
                          <input
                            type="range"
                            min="100"
                            max="1000"
                            value={animationSpeed}
                            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                            className="ml-2 w-24"
                          />
                          {animationSpeed}ms
                        </label>
                      </div>
                      
                      <Button
                        onClick={runVisualization}
                        disabled={isAnimating}
                        loading={isAnimating}
                        loadingText="Running..."
                      >
                        Run Visualization
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Grid Visualization */}
                <Card variant="elevated">
                  <CardContent className="p-6 flex justify-center">
                    <GridVisualization
                      grid={grid}
                      isAnimating={isAnimating}
                      showLabels={true}
                      config={{
                        cellSize: 60,
                        gap: 4,
                        colorScheme: 'default',
                        showLabels: true,
                        showGrid: true,
                        animationSpeed: animationSpeed,
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Solution Details */}
                {selectedSolution && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">
                        {selectedSolution.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {selectedSolution.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">When to Use</h4>
                          <p className="text-sm text-gray-600">{selectedSolution.whenToUse}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Complexity</h4>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-mono">Time: {selectedSolution.complexity.time.average}</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-mono">Space: {selectedSolution.complexity.space.complexity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              // Welcome State
              <Card variant="elevated" className="h-96 flex items-center justify-center">
                <CardContent className="text-center p-8">
                  <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to Algorithm Visualizer
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Select an algorithm from the left sidebar to start exploring different 
                    solution approaches with interactive visualizations.
                  </p>
                  <div className="text-sm text-gray-500">
                    {algorithms.length} algorithms available with {' '}
                    {algorithms.reduce((sum, alg) => sum + alg.solutions.length, 0)} total solutions
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Navigation Header Component
 * Single Responsibility: Provides consistent navigation across routes
 */
const NavigationHeader: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Algorithm Visualizer
              </h1>
              <p className="text-xs text-gray-600">
                Interactive Learning Platform
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-4">
            <Link
              to="/visualizer"
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                location.pathname === '/visualizer' || location.pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Visualizer
            </Link>
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

/**
 * Main App Component with Routing
 * Template Method Pattern: Defines overall app structure with routing
 */
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/visualizer" replace />} />
            <Route path="/visualizer" element={<AlgorithmVisualizerPage />} />
            <Route path="*" element={<Navigate to="/visualizer" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                <strong>Dynamic Programming Algorithm Visualizer</strong>
              </p>
              <p className="text-sm">
                Built with React, TypeScript, and Tailwind CSS • 
                Following SOLID principles and design patterns
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
