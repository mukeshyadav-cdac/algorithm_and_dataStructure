import React, { useState } from 'react';
import { uniquePathsMultipleSolutions } from '../../constants/algorithms/uniquePathsMultipleSolutions';
import { coinChangeMultipleSolutions } from '../../constants/algorithms/coinChangeMultipleSolutions';
import { ComplexityAnalysisService } from '../../services';
import { SolutionPicker } from '../SolutionPicker';
import { ComplexityVisualizer } from '../ComplexityVisualizer';
import { SolutionComparison } from '../SolutionComparison';
import { 
  AlgorithmSolution, 
  BenchmarkResult, 
  SolutionComparison as ComparisonData,
  BenchmarkConfig 
} from '../../types';
import { 
  BookOpen, BarChart3, Play, RefreshCw, 
  Award, Lightbulb, Target, Activity,
  ChevronDown
} from 'lucide-react';

/**
 * Multiple Solutions Demo Component
 * Comprehensive demo showcasing multiple algorithm solutions with interactive complexity analysis
 */
// Available algorithms with multiple solutions
const availableAlgorithms = [
  uniquePathsMultipleSolutions,
  coinChangeMultipleSolutions
];

export const MultipleSolutionsDemo: React.FC = () => {
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState(0);
  const [selectedSolutionId, setSelectedSolutionId] = useState(availableAlgorithms[0].defaultSolutionId);
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'picker' | 'visualizer' | 'comparison' | 'insights'>('picker');
  const [testInput, setTestInput] = useState(availableAlgorithms[0].defaultParams);

  const complexityService = ComplexityAnalysisService.getInstance();
  const algorithm = availableAlgorithms[selectedAlgorithmId];
  const selectedSolution = algorithm.solutions.find(s => s.id === selectedSolutionId);


  // Default benchmark configuration
  const benchmarkConfig: BenchmarkConfig = {
    inputSizes: [10, 50, 100, 200],
    iterations: 5,
    timeout: 5000,
    memoryLimit: 100 * 1024 * 1024, // 100MB
    includeWarmup: true
  };

  const handleSolutionChange = (solutionId: string) => {
    setSelectedSolutionId(solutionId);
  };

  const handleBenchmark = async (solutionIds: string[]) => {
    setIsLoading(true);
    try {
      const results: BenchmarkResult[] = [];
      
      for (const solutionId of solutionIds) {
        const solution = algorithm.solutions.find(s => s.id === solutionId);
        if (solution) {
          console.log(`Benchmarking ${solution.name}...`);
          const solutionResults = await complexityService.runBenchmark(solution, benchmarkConfig);
          results.push(...solutionResults);
        }
      }
      
      setBenchmarkResults(results);
    } catch (error) {
      console.error('Benchmark failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComparison = async (solutionIds: [string, string]) => {
    setIsLoading(true);
    try {
      const solution1 = algorithm.solutions.find(s => s.id === solutionIds[0]);
      const solution2 = algorithm.solutions.find(s => s.id === solutionIds[1]);
      
      if (solution1 && solution2) {
        console.log(`Comparing ${solution1.name} vs ${solution2.name}...`);
        const comparison = await complexityService.compareSolutions(
          solution1, 
          solution2, 
          benchmarkConfig
        );
        
        setComparisonData(comparison);
        setActiveTab('comparison');
        
        // Also update benchmark results with comparison data
        const results1 = await complexityService.runBenchmark(solution1, benchmarkConfig);
        const results2 = await complexityService.runBenchmark(solution2, benchmarkConfig);
        setBenchmarkResults([...results1, ...results2]);
      }
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickBenchmark = async () => {
    if (selectedSolution) {
      await handleBenchmark([selectedSolution.id]);
    }
  };

  const handleRunSolution = async () => {
    if (selectedSolution && selectedSolution.visualizer) {
      console.log(`Running ${selectedSolution.name} with input:`, testInput);
      
      const startTime = performance.now();
      
      try {
        const result = await selectedSolution.visualizer(
          { input: testInput, expected: null, description: 'Demo run' },
          () => {}, // Mock grid updater
          () => {}, // Mock step setter
          (metrics) => {
            console.log('Performance metrics:', metrics);
          }
        );
        
        const endTime = performance.now();
        console.log(`Result: ${result}, Time: ${(endTime - startTime).toFixed(2)}ms`);
      } catch (error) {
        console.error('Solution execution failed:', error);
      }
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'picker':
        return (
          <SolutionPicker
            solutions={algorithm.solutions}
            selectedSolutionId={selectedSolutionId}
            onSolutionChange={handleSolutionChange}
            onBenchmark={(solutionId) => handleBenchmark([solutionId])}
            onCompare={handleComparison}
            showComplexityDetails={true}
          />
        );
      
      case 'visualizer':
        return (
          <ComplexityVisualizer
            solutions={algorithm.solutions}
            benchmarkResults={benchmarkResults}
            comparison={comparisonData}
            isLoading={isLoading}
            onBenchmark={handleBenchmark}
          />
        );
      
      case 'comparison':
        return (
          <SolutionComparison
            solutions={algorithm.solutions}
            comparisonData={comparisonData}
            benchmarkResults={benchmarkResults}
            isLoading={isLoading}
            onRunComparison={handleComparison}
            onClose={() => setActiveTab('picker')}
          />
        );
      
      case 'insights':
        return (
          <AlgorithmInsights 
            algorithm={algorithm}
            selectedSolution={selectedSolution}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {React.createElement(algorithm.icon as React.ComponentType<any>, { className: "h-6 w-6" })}
                </div>
                {algorithm.name} - Multiple Solutions Demo
              </h1>
              <p className="text-gray-600 mt-2">
                Interactive comparison of {algorithm.solutions.length} different approaches with real-time complexity analysis
              </p>
              
              {/* Algorithm Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Algorithm:
                </label>
                <div className="relative">
                  <select
                    value={selectedAlgorithmId}
                    onChange={(e) => {
                      const newAlgorithmId = parseInt(e.target.value);
                      setSelectedAlgorithmId(newAlgorithmId);
                      setSelectedSolutionId(availableAlgorithms[newAlgorithmId].defaultSolutionId);
                      setTestInput(availableAlgorithms[newAlgorithmId].defaultParams);
                      setBenchmarkResults([]);
                      setComparisonData(undefined);
                    }}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {availableAlgorithms.map((alg, index) => (
                      <option key={alg.id} value={index}>
                        {alg.name} - {alg.solutions.length} solutions
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                algorithm.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                algorithm.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {algorithm.difficulty.toUpperCase()}
              </span>
              
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {algorithm.category.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'picker', label: 'Solution Picker', icon: Target },
              { id: 'visualizer', label: 'Complexity Analysis', icon: BarChart3 },
              { id: 'comparison', label: 'Solution Comparison', icon: Activity },
              { id: 'insights', label: 'Learning Insights', icon: Lightbulb }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Test Input Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Grid Size:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={testInput.m}
                  onChange={(e) => setTestInput((prev: any) => ({ ...prev, m: parseInt(e.target.value) || 1 }))}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="Rows"
                />
                <span className="text-gray-500">×</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={testInput.n}
                  onChange={(e) => setTestInput((prev: any) => ({ ...prev, n: parseInt(e.target.value) || 1 }))}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="Cols"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                Expected paths: <span className="font-mono font-bold">
                  {/* Simple combinatorial formula for unique paths: C(m+n-2, m-1) */}
                  Calculate to see
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {selectedSolution && (
                <button
                  onClick={handleRunSolution}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Run {selectedSolution.name}
                </button>
              )}
              
              <button
                onClick={handleQuickBenchmark}
                disabled={isLoading || !selectedSolution}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <BarChart3 className="h-4 w-4" />
                )}
                Benchmark
              </button>
              
              <button
                onClick={() => {
                  setBenchmarkResults([]);
                  setComparisonData(undefined);
                  complexityService.clearCache();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {getTabContent()}
      </div>

      {/* Footer Stats */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{algorithm.solutions.length}</div>
              <div className="text-sm text-gray-600">Different Solutions</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-green-600">{benchmarkResults.length}</div>
              <div className="text-sm text-gray-600">Benchmark Results</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-purple-600">{algorithm.concepts.length}</div>
              <div className="text-sm text-gray-600">Key Concepts</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-orange-600">{algorithm.estimatedTime}min</div>
              <div className="text-sm text-gray-600">Estimated Study Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Algorithm Insights Component
 */
const AlgorithmInsights: React.FC<{
  algorithm: typeof uniquePathsMultipleSolutions;
  selectedSolution?: AlgorithmSolution;
}> = ({ algorithm, selectedSolution }) => {
  return (
    <div className="space-y-6">
      {/* Algorithm Overview */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Algorithm Overview
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Problem Description</h4>
            <p className="text-gray-600 mb-4">{algorithm.description}</p>
            
            <h4 className="font-semibold text-gray-700 mb-3">Key Concepts</h4>
            <div className="flex flex-wrap gap-2">
              {algorithm.concepts.map(concept => (
                <span key={concept} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {concept}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Real-World Applications</h4>
            <ul className="space-y-2">
              {algorithm.realWorldApplications.map((app, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="text-green-500 mt-1">•</span>
                  {app}
                </li>
              ))}
            </ul>
            
            <h4 className="font-semibold text-gray-700 mb-3 mt-4">Prerequisites</h4>
            <ul className="space-y-1">
              {algorithm.prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  {prereq}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Solutions Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-600" />
          Solutions Comparison
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold text-gray-700">Solution</th>
                <th className="text-left py-3 font-semibold text-gray-700">Time</th>
                <th className="text-left py-3 font-semibold text-gray-700">Space</th>
                <th className="text-left py-3 font-semibold text-gray-700">Difficulty</th>
                <th className="text-left py-3 font-semibold text-gray-700">Best For</th>
              </tr>
            </thead>
            <tbody>
              {algorithm.solutions.map((solution, _index) => (
                <tr key={solution.id} className={`border-b ${selectedSolution?.id === solution.id ? 'bg-blue-50' : ''}`}>
                  <td className="py-3">
                    <div className="font-medium text-gray-800">{solution.name}</div>
                    <div className="text-gray-500 text-xs">{solution.approach.replace('_', ' ')}</div>
                  </td>
                  <td className="py-3">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {solution.complexity.time.worst}
                    </code>
                  </td>
                  <td className="py-3">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {solution.complexity.space.complexity}
                    </code>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      solution.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      solution.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      solution.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {solution.difficulty}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600 text-xs max-w-xs">
                    {solution.whenToUse}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Learning Insights */}
      {algorithm.insights && (
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Learning Insights
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 text-green-700">✅ Key Learnings</h4>
              <ul className="space-y-2">
                {algorithm.insights.keyLearnings.map((learning, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-green-500 mt-1">•</span>
                    {learning}
                  </li>
                ))}
              </ul>
              
              <h4 className="font-semibold text-gray-700 mb-3 mt-6 text-blue-700">💡 Optimization Tips</h4>
              <ul className="space-y-2">
                {algorithm.insights.optimizationTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-blue-500 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 text-red-700">❌ Common Mistakes</h4>
              <ul className="space-y-2">
                {algorithm.insights.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-red-500 mt-1">•</span>
                    {mistake}
                  </li>
                ))}
              </ul>
              
              <h4 className="font-semibold text-gray-700 mb-3 mt-6 text-purple-700">🎯 Real-World Scenarios</h4>
              <div className="space-y-3">
                {algorithm.insights.realWorldScenarios.map((scenario, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-700 text-sm">{scenario.scenario}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      <strong>Recommended:</strong> {scenario.recommendedSolution}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{scenario.reasoning}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
