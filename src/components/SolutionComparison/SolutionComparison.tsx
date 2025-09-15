import React, { useState } from 'react';
import { AlgorithmSolution, SolutionComparison as ComparisonData, BenchmarkResult } from '../../types';
import { ComplexityVisualizer } from '../ComplexityVisualizer';
import { 
  Clock, MemoryStick, Activity, TrendingUp, TrendingDown,
  Target, Award, AlertTriangle, Lightbulb, BookOpen,
  BarChart3, ArrowLeftRight, Trophy, Star
} from 'lucide-react';

interface SolutionComparisonProps {
  solutions: AlgorithmSolution[];
  comparisonData?: ComparisonData;
  benchmarkResults?: BenchmarkResult[];
  isLoading?: boolean;
  onClose?: () => void;
  onRunComparison?: (solutionIds: [string, string]) => void;
}

/**
 * Side-by-side Solution Comparison Component
 * Provides detailed analysis and performance comparison between algorithms
 */
export const SolutionComparison: React.FC<SolutionComparisonProps> = ({
  solutions,
  comparisonData,
  benchmarkResults = [],
  isLoading = false,
  onClose,
  onRunComparison
}) => {
  const [showCodeComparison, setShowCodeComparison] = useState(false);

  // Get the two solutions being compared
  const solution1 = solutions.find(s => s.id === comparisonData?.solutionIds[0]);
  const solution2 = solutions.find(s => s.id === comparisonData?.solutionIds[1]);

  if (!solution1 || !solution2) {
    return (
      <div className="bg-white rounded-xl shadow-lg border p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Comparison Data</h3>
        <p className="text-gray-600 mb-4">
          Please select two solutions to compare their performance and characteristics.
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  const getWinnerIcon = (metric: 'timeRatio' | 'spaceRatio' | 'operationsRatio') => {
    if (!comparisonData) return null;
    
    const ratio = comparisonData.metrics[metric];
    const advantage = Math.abs(1 - ratio);
    
    if (advantage < 0.1) return <Target className="h-4 w-4 text-gray-500" />; // Too close to call
    if (advantage < 0.3) return <Star className="h-4 w-4 text-yellow-500" />; // Slight advantage
    return <Trophy className="h-4 w-4 text-green-500" />; // Clear winner
  };


  return (
    <div className="bg-white rounded-xl shadow-lg border">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ArrowLeftRight className="h-6 w-6 text-purple-600" />
              Solution Comparison
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <span className="font-medium text-blue-600">{solution1.name}</span>
              <span>vs</span>
              <span className="font-medium text-purple-600">{solution2.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onRunComparison && (
              <button
                onClick={() => onRunComparison([solution1.id, solution2.id])}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 transition-colors flex items-center gap-1"
              >
                <BarChart3 className="h-3 w-3" />
                {isLoading ? 'Running...' : 'Re-run Comparison'}
              </button>
            )}
            
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                ✕ Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics Overview */}
      {comparisonData && (
        <div className="p-4 bg-gray-50 border-b">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Performance Summary
          </h4>
          
          <div className="grid md:grid-cols-3 gap-4">
            <MetricComparisonCard
              title="Execution Time"
              icon={<Clock className="h-5 w-5" />}
              ratio={comparisonData.metrics.timeRatio}
              solution1Name={solution1.name}
              solution2Name={solution2.name}
              winnerIcon={getWinnerIcon('timeRatio')}
            />
            
            <MetricComparisonCard
              title="Memory Usage"
              icon={<MemoryStick className="h-5 w-5" />}
              ratio={comparisonData.metrics.spaceRatio}
              solution1Name={solution1.name}
              solution2Name={solution2.name}
              winnerIcon={getWinnerIcon('spaceRatio')}
            />
            
            <MetricComparisonCard
              title="Operations Count"
              icon={<Activity className="h-5 w-5" />}
              ratio={comparisonData.metrics.operationsRatio}
              solution1Name={solution1.name}
              solution2Name={solution2.name}
              winnerIcon={getWinnerIcon('operationsRatio')}
            />
          </div>
          
          {/* Winner Declaration */}
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-gray-800">Recommendation</span>
            </div>
            <p className="text-gray-700">
              <span className="font-medium text-green-600">{comparisonData.recommendation.winner}</span>{' '}
              - {comparisonData.recommendation.reason}
            </p>
            
            <div className="mt-2">
              <div className="text-sm text-gray-600 font-medium mb-1">Key Tradeoffs:</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {comparisonData.recommendation.tradeoffs.map((tradeoff, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <span className="text-blue-500">•</span>
                    {tradeoff}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side Solution Details */}
      <div className="p-4">
        <div className="grid md:grid-cols-2 gap-6">
          <SolutionDetailCard 
            solution={solution1}
            color="blue"
            isWinner={comparisonData?.recommendation.winner === solution1.name}
          />
          
          <SolutionDetailCard 
            solution={solution2}
            color="purple"
            isWinner={comparisonData?.recommendation.winner === solution2.name}
          />
        </div>
      </div>

      {/* Complexity Visualization */}
      <div className="p-4 border-t">
        <ComplexityVisualizer
          solutions={[solution1, solution2]}
          benchmarkResults={benchmarkResults}
          comparison={comparisonData}
          isLoading={isLoading}
        />
      </div>

      {/* Code Comparison (Optional) */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Implementation Comparison
          </h4>
          
          <button
            onClick={() => setShowCodeComparison(!showCodeComparison)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {showCodeComparison ? 'Hide Code' : 'Show Code'}
          </button>
        </div>
        
        {showCodeComparison && (
          <div className="grid md:grid-cols-2 gap-4">
            <CodeComparisonCard 
              solution={solution1}
              language="javascript"
              title={`${solution1.name} - JavaScript`}
            />
            
            <CodeComparisonCard 
              solution={solution2}
              language="javascript"
              title={`${solution2.name} - JavaScript`}
            />
          </div>
        )}
      </div>

      {/* Educational Insights */}
      <div className="p-4 border-t bg-blue-50">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Learning Insights
        </h4>
        
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">When to choose {solution1.name}:</h5>
            <p className="text-sm text-gray-600">{solution1.whenToUse}</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">When to choose {solution2.name}:</h5>
            <p className="text-sm text-gray-600">{solution2.whenToUse}</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">Key Learning Points:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Different approaches have different time-space tradeoffs</li>
              <li>• Real-world performance depends on input size and characteristics</li>
              <li>• Consider both theoretical complexity and practical implementation details</li>
              <li>• Choose based on your specific constraints (memory, time, readability)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Metric Comparison Card Component
 */
const MetricComparisonCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  ratio: number;
  solution1Name: string;
  solution2Name: string;
  winnerIcon?: React.ReactNode;
}> = ({ title, icon, ratio, solution1Name, solution2Name, winnerIcon }) => {
  const performance = getPerformanceIndicator(ratio);
  const PerformanceIcon = performance.icon;

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          {icon}
          {title}
        </div>
        {winnerIcon}
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800 mb-1">
          {ratio.toFixed(2)}x
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {solution1Name} vs {solution2Name}
        </div>
        
        <div className={`flex items-center justify-center gap-1 text-sm ${performance.color}`}>
          <PerformanceIcon className="h-4 w-4" />
          {performance.text}
        </div>
      </div>
    </div>
  );
};

/**
 * Solution Detail Card Component
 */
const SolutionDetailCard: React.FC<{
  solution: AlgorithmSolution;
  color: 'blue' | 'purple';
  isWinner?: boolean;
}> = ({ solution, color, isWinner = false }) => {
  const borderColor = color === 'blue' ? 'border-blue-200' : 'border-purple-200';
  const bgColor = color === 'blue' ? 'bg-blue-50' : 'bg-purple-50';
  const textColor = color === 'blue' ? 'text-blue-800' : 'text-purple-800';

  return (
    <div className={`border-2 rounded-lg ${isWinner ? 'border-green-400 bg-green-50' : borderColor + ' ' + bgColor}`}>
      {isWinner && (
        <div className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-t-md flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          Recommended Solution
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className={`font-bold text-lg ${textColor}`}>
            {solution.name}
          </h4>
          <div className={`px-2 py-1 text-xs rounded-full border ${
            solution.difficulty === 'beginner' ? 'bg-green-100 text-green-800 border-green-200' :
            solution.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
            solution.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800 border-orange-200' :
            'bg-red-100 text-red-800 border-red-200'
          }`}>
            {solution.difficulty.toUpperCase()}
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-4">{solution.description}</p>
        
        {/* Complexity Info */}
        <div className="space-y-3">
          <div>
            <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Time Complexity
            </h5>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Best:</span>
                <code className="bg-white px-2 py-1 rounded text-xs">{solution.complexity.time.best}</code>
              </div>
              <div className="flex justify-between">
                <span>Average:</span>
                <code className="bg-white px-2 py-1 rounded text-xs">{solution.complexity.time.average}</code>
              </div>
              <div className="flex justify-between">
                <span>Worst:</span>
                <code className="bg-white px-2 py-1 rounded text-xs">{solution.complexity.time.worst}</code>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
              <MemoryStick className="h-4 w-4" />
              Space Complexity
            </h5>
            <code className="bg-white px-2 py-1 rounded text-sm">
              {solution.complexity.space.complexity}
            </code>
          </div>
        </div>
        
        {/* Pros and Cons */}
        <div className="mt-4 grid grid-cols-1 gap-3">
          <div>
            <h6 className="font-medium text-green-700 mb-1 text-sm">✅ Pros</h6>
            <ul className="text-xs text-gray-600 space-y-1">
              {solution.pros.slice(0, 3).map((pro, index) => (
                <li key={index}>• {pro}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h6 className="font-medium text-red-700 mb-1 text-sm">❌ Cons</h6>
            <ul className="text-xs text-gray-600 space-y-1">
              {solution.cons.slice(0, 3).map((con, index) => (
                <li key={index}>• {con}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Code Comparison Card Component
 */
const CodeComparisonCard: React.FC<{
  solution: AlgorithmSolution;
  language: string;
  title: string;
}> = ({ solution, language, title }) => {
  const code = solution.code[language] || '// Code not available for this language';

  return (
    <div className="border rounded-lg">
      <div className="px-3 py-2 bg-gray-100 border-b">
        <h5 className="font-medium text-gray-800 text-sm">{title}</h5>
      </div>
      
      <div className="p-3">
        <pre className="text-xs font-mono bg-gray-50 p-3 rounded overflow-x-auto max-h-64">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

// Helper function to get performance indicators
const getPerformanceIndicator = (ratio: number) => {
  if (ratio < 0.8) return { color: 'text-green-600', icon: TrendingUp, text: 'Much Better' };
  if (ratio < 0.95) return { color: 'text-green-500', icon: TrendingUp, text: 'Better' };
  if (ratio < 1.05) return { color: 'text-gray-600', icon: Target, text: 'Similar' };
  if (ratio < 1.2) return { color: 'text-red-500', icon: TrendingDown, text: 'Worse' };
  return { color: 'text-red-600', icon: TrendingDown, text: 'Much Worse' };
};
