import React, { useState, useCallback, useEffect } from 'react';
import { 
  BookOpen, 
  Code2, 
  Sparkles, 
  Github, 
  Heart,
  Lightbulb,
  Target,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Settings
} from 'lucide-react';

// Components
import AlgorithmSelector from './components/AlgorithmSelector';
import GridVisualization from './components/GridVisualization';
import { Card, CardHeader, CardContent } from './components/ui/Card';
import Button from './components/ui/Button';
import Badge, { DifficultyBadge } from './components/ui/Badge';

// Data and Types
import { algorithms, getFeaturedAlgorithms } from './data/algorithms';
import { algorithmCategories } from './data/categories';
import { Algorithm, Cell, AlgorithmContext } from './types';

/**
 * Main App Component with Beautiful Modern Design
 * Uses composition pattern for flexible, maintainable architecture
 */

const App: React.FC = () => {
  // Core state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(algorithms[0] || null);
  const [selectedLanguage, setSelectedLanguage] = useState(0);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [parameters, setParameters] = useState<Record<string, unknown>>({});
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(300);
  const [totalSteps, setTotalSteps] = useState(0);
  
  // UI state
  const [showCode, setShowCode] = useState(false);

  // Initialize grid when algorithm or parameters change
  useEffect(() => {
    if (selectedAlgorithm) {
      setParameters(selectedAlgorithm.defaultParams);
      const initialGrid = selectedAlgorithm.visualization.setup(8, 8, selectedAlgorithm.defaultParams);
      setGrid(initialGrid);
      setTotalSteps(selectedAlgorithm.visualization.getStepCount(selectedAlgorithm.defaultParams));
    }
  }, [selectedAlgorithm]);

  // Recreate grid when parameters change
  useEffect(() => {
    if (selectedAlgorithm) {
      const newGrid = selectedAlgorithm.visualization.setup(8, 8, parameters);
      setGrid(newGrid);
      setTotalSteps(selectedAlgorithm.visualization.getStepCount(parameters));
    }
  }, [parameters, selectedAlgorithm]);

  // Algorithm selection handler
  const handleAlgorithmSelect = useCallback((algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setSelectedLanguage(0);
    setIsAnimating(false);
  }, []);

  // Animation control
  const handleStartAnimation = useCallback(async () => {
    if (!selectedAlgorithm || isAnimating) return;
    
    setIsAnimating(true);
    
    try {
      const context: AlgorithmContext = {
        grid: grid.map(row => row.map(cell => ({ ...cell }))), // Deep copy
        params: parameters,
        speed: animationSpeed,
        isRunning: true,
        currentStep: 0,
        totalSteps
      };
      
      await selectedAlgorithm.visualization.animate(context, setGrid);
    } catch (error) {
      console.error('Animation error:', error);
    } finally {
      setIsAnimating(false);
    }
  }, [selectedAlgorithm, grid, parameters, animationSpeed, totalSteps, isAnimating]);

  const handleResetAnimation = useCallback(() => {
    if (selectedAlgorithm) {
      setIsAnimating(false);
      const resetGrid = selectedAlgorithm.visualization.setup(8, 8, parameters);
      setGrid(resetGrid);
    }
  }, [selectedAlgorithm, parameters]);

  const handleParameterChange = useCallback((name: string, value: unknown) => {
    setParameters(prev => ({ ...prev, [name]: value }));
  }, []);


  const featuredAlgorithms = getFeaturedAlgorithms();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Beautiful Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Algorithm Visualizer
                </h1>
                <p className="text-sm text-gray-600">Interactive Learning Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learn
              </Button>
              <Button variant="ghost" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Practice  
              </Button>
              <Button variant="ghost" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Algorithm Selector */}
          <div className="xl:col-span-1">
            <AlgorithmSelector
              algorithms={algorithms}
              categories={algorithmCategories}
              selectedAlgorithm={selectedAlgorithm || undefined}
              onAlgorithmSelect={handleAlgorithmSelect}
            />
          </div>

          {/* Main Visualization Area */}
          <div className="xl:col-span-2 space-y-6">
            {selectedAlgorithm ? (
              <>
                {/* Algorithm Info Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedAlgorithm.category.gradient} text-white shadow-lg`}>
                        {selectedAlgorithm.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">{selectedAlgorithm.name}</h2>
                          <DifficultyBadge difficulty={selectedAlgorithm.difficulty} />
                          <Badge variant="info" className="text-xs">
                            {selectedAlgorithm.estimatedTimeMinutes} min
                          </Badge>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {selectedAlgorithm.education.overview}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            Time: {selectedAlgorithm.education.timeComplexity.average}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="h-4 w-4" />
                            Space: {selectedAlgorithm.education.spaceComplexity.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Visualization */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Visualization</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCode(!showCode)}
                          className="flex items-center gap-2"
                        >
                          <Code2 className="h-4 w-4" />
                          {showCode ? 'Hide Code' : 'Show Code'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
                      <GridVisualization grid={grid} />
                    </div>
                  </CardContent>
                </Card>

                {/* Code Display */}
                {showCode && selectedAlgorithm.execution[selectedLanguage] && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">
                          Implementation ({selectedAlgorithm.execution[selectedLanguage].language})
                        </h3>
                        <div className="flex items-center gap-2">
                          {selectedAlgorithm.execution.map((exec, index) => (
                            <Button
                              key={exec.language}
                              variant={selectedLanguage === index ? "primary" : "outline"}
                              size="sm"
                              onClick={() => setSelectedLanguage(index)}
                            >
                              {exec.language}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <pre className="bg-gray-900 text-gray-50 p-4 rounded-b-xl overflow-x-auto">
                        <code>{selectedAlgorithm.execution[selectedLanguage].code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              /* Welcome Screen */
              <Card>
                <CardContent className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full inline-block mb-6">
                      <Lightbulb className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Welcome to Algorithm Visualizer
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Select an algorithm from the sidebar to begin your interactive learning journey.
                    </p>
                    
                    {/* Featured Algorithms */}
                    <div className="grid gap-3">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Featured Algorithms</h3>
                      {featuredAlgorithms.slice(0, 3).map(algorithm => (
                        <Button
                          key={algorithm.id}
                          variant="outline"
                          className="w-full justify-start text-left"
                          onClick={() => handleAlgorithmSelect(algorithm)}
                        >
                          <div className="flex items-center gap-3">
                            {algorithm.icon}
                            <div>
                              <div className="font-medium">{algorithm.name}</div>
                              <div className="text-xs text-gray-500">{algorithm.category.name}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Control Panel */}
          <div className="xl:col-span-1">
            {selectedAlgorithm && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Controls
                  </h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Animation Controls */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Animation</h4>
                    <div className="space-y-3">
                      <Button
                        onClick={handleStartAnimation}
                        disabled={isAnimating}
                        className="w-full"
                        variant="primary"
                        size="lg"
                      >
                        {isAnimating ? (
                          <>
                            <Pause className="h-5 w-5 mr-2" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="h-5 w-5 mr-2" />
                            Start Visualization
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={handleResetAnimation}
                        className="w-full"
                        variant="outline"
                        size="lg"
                      >
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Speed Control */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animation Speed: {animationSpeed}ms
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={animationSpeed}
                      onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Parameters */}
                  {selectedAlgorithm.paramControls.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Parameters</h4>
                      <div className="space-y-4">
                        {selectedAlgorithm.paramControls.map(control => (
                          <div key={control.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {control.label}: {String(parameters[control.name])}
                            </label>
                            {control.type === 'number' && (
                              <input
                                type="range"
                                min={control.min}
                                max={control.max}
                                value={parameters[control.name] as number}
                                onChange={(e) => handleParameterChange(control.name, Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              />
                            )}
                            {control.type === 'array' && (
                              <input
                                type="text"
                                value={JSON.stringify(parameters[control.name])}
                                onChange={(e) => {
                                  try {
                                    const parsed = JSON.parse(e.target.value);
                                    handleParameterChange(control.name, parsed);
                                  } catch (err) {
                                    // Invalid JSON, ignore
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                placeholder={JSON.stringify(control.default)}
                              />
                            )}
                            <p className="text-xs text-gray-500 mt-1">{control.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Algorithm Insights */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Key Insights</h4>
                    <ul className="space-y-2">
                      {selectedAlgorithm.education.keyInsights.slice(0, 3).map((insight, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Beautiful Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-red-500 fill-current" />
              <span className="text-gray-600">Built with passion for algorithmic learning</span>
            </div>
            <p className="text-sm text-gray-500">
              Interactive Algorithm Visualizer - Making complex algorithms beautiful and understandable
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;