import React, { useState } from 'react';
import { AlgorithmSolution, SolutionApproach } from '../../types';
import { 
  Zap, Clock, MemoryStick, TrendingUp, TrendingDown, 
  BookOpen, ChevronDown, ChevronRight, Info, Play,
  BarChart3, Target, Brain, Lightbulb 
} from 'lucide-react';

interface SolutionPickerProps {
  solutions: AlgorithmSolution[];
  selectedSolutionId: string;
  onSolutionChange: (solutionId: string) => void;
  onBenchmark?: (solutionId: string) => void;
  onCompare?: (solutionIds: [string, string]) => void;
  showComplexityDetails?: boolean;
  compactMode?: boolean;
}

/**
 * Solution Picker Component
 * Allows users to select between different algorithm solutions and compare them
 */
export const SolutionPicker: React.FC<SolutionPickerProps> = ({
  solutions,
  selectedSolutionId,
  onSolutionChange,
  onBenchmark,
  onCompare,
  showComplexityDetails = true,
  compactMode = false
}) => {
  const [expandedSolution, setExpandedSolution] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  const selectedSolution = solutions.find(s => s.id === selectedSolutionId);

  const getApproachIcon = (approach: SolutionApproach) => {
    switch (approach) {
      case 'brute_force': return <Target className="h-4 w-4" />;
      case 'memoization': return <Brain className="h-4 w-4" />;
      case 'tabulation': return <BarChart3 className="h-4 w-4" />;
      case 'optimized': return <Zap className="h-4 w-4" />;
      case 'recursive': return <TrendingUp className="h-4 w-4" />;
      case 'iterative': return <TrendingDown className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getApproachColor = (approach: SolutionApproach) => {
    switch (approach) {
      case 'brute_force': return 'text-red-600 bg-red-50 border-red-200';
      case 'memoization': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'tabulation': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'optimized': return 'text-green-600 bg-green-50 border-green-200';
      case 'recursive': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'iterative': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800 border-green-200',
      intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      advanced: 'bg-orange-100 text-orange-800 border-orange-200',
      expert: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${colors[difficulty as keyof typeof colors] || colors.beginner}`}>
        {difficulty.toUpperCase()}
      </span>
    );
  };

  const handleComparisonToggle = (solutionId: string) => {
    if (selectedForComparison.includes(solutionId)) {
      setSelectedForComparison(prev => prev.filter(id => id !== solutionId));
    } else if (selectedForComparison.length < 2) {
      setSelectedForComparison(prev => [...prev, solutionId]);
    }
  };

  const handleCompare = () => {
    if (selectedForComparison.length === 2 && onCompare) {
      onCompare([selectedForComparison[0], selectedForComparison[1]]);
    }
  };

  if (compactMode) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Solution Approach
          </label>
          <select
            value={selectedSolutionId}
            onChange={(e) => onSolutionChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {solutions.map(solution => (
              <option key={solution.id} value={solution.id}>
                {solution.name} - {solution.complexity.time.worst}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Solution Approaches
            </h3>
            <p className="text-sm text-gray-600">
              {solutions.length} different implementations available
            </p>
          </div>
          
          {solutions.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  compareMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {compareMode ? 'Exit Compare' : 'Compare'}
              </button>
              
              {compareMode && selectedForComparison.length === 2 && (
                <button
                  onClick={handleCompare}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Run Comparison
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Solutions List */}
      <div className="p-4 space-y-3">
        {solutions.map(solution => (
          <SolutionCard
            key={solution.id}
            solution={solution}
            isSelected={solution.id === selectedSolutionId}
            isExpanded={expandedSolution === solution.id}
            isCompareMode={compareMode}
            isSelectedForComparison={selectedForComparison.includes(solution.id)}
            showComplexityDetails={showComplexityDetails}
            onSelect={() => onSolutionChange(solution.id)}
            onExpand={() => setExpandedSolution(
              expandedSolution === solution.id ? null : solution.id
            )}
            onBenchmark={onBenchmark}
            onComparisonToggle={() => handleComparisonToggle(solution.id)}
            getApproachIcon={getApproachIcon}
            getApproachColor={getApproachColor}
            getDifficultyBadge={getDifficultyBadge}
          />
        ))}
      </div>

      {/* Selected Solution Summary */}
      {selectedSolution && !compareMode && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 mb-1">
                Currently Selected: {selectedSolution.name}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {selectedSolution.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Time: {selectedSolution.complexity.time.worst}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MemoryStick className="h-3 w-3" />
                  <span>Space: {selectedSolution.complexity.space.complexity}</span>
                </div>
                {getDifficultyBadge(selectedSolution.difficulty)}
              </div>
            </div>
            
            {onBenchmark && (
              <button
                onClick={() => onBenchmark(selectedSolution.id)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <BarChart3 className="h-3 w-3" />
                Benchmark
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Individual Solution Card Component
 */
const SolutionCard: React.FC<{
  solution: AlgorithmSolution;
  isSelected: boolean;
  isExpanded: boolean;
  isCompareMode: boolean;
  isSelectedForComparison: boolean;
  showComplexityDetails: boolean;
  onSelect: () => void;
  onExpand: () => void;
  onBenchmark?: (solutionId: string) => void;
  onComparisonToggle: () => void;
  getApproachIcon: (approach: SolutionApproach) => React.ReactNode;
  getApproachColor: (approach: SolutionApproach) => string;
  getDifficultyBadge: (difficulty: string) => React.ReactNode;
}> = ({
  solution,
  isSelected,
  isExpanded,
  isCompareMode,
  isSelectedForComparison,
  showComplexityDetails,
  onSelect,
  onExpand,
  onBenchmark,
  onComparisonToggle,
  getApproachIcon,
  getApproachColor,
  getDifficultyBadge
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  return (
    <div className={`border rounded-lg transition-all ${
      isSelected 
        ? 'border-blue-500 bg-blue-50 shadow-md' 
        : isSelectedForComparison 
        ? 'border-green-500 bg-green-50 shadow-md'
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}>
      {/* Card Header */}
      <div 
        className="p-3 cursor-pointer"
        onClick={isCompareMode ? onComparisonToggle : onSelect}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isCompareMode && (
              <input
                type="checkbox"
                checked={isSelectedForComparison}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            )}
            
            <div className={`p-2 rounded-lg border ${getApproachColor(solution.approach)}`}>
              {getApproachIcon(solution.approach)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-800">
                  {solution.name}
                </h4>
                {getDifficultyBadge(solution.difficulty)}
              </div>
              
              <p className="text-sm text-gray-600">
                {solution.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showComplexityDetails && (
              <div className="text-right text-xs text-gray-500">
                <div>O: {solution.complexity.time.worst}</div>
                <div>S: {solution.complexity.space.complexity}</div>
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t">
          {/* Complexity Details */}
          {showComplexityDetails && (
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <h5 className="font-medium text-gray-700 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Time Complexity
                </h5>
                <div className="text-sm space-y-1">
                  <div>Best: <code className="bg-gray-100 px-1 rounded">{solution.complexity.time.best}</code></div>
                  <div>Average: <code className="bg-gray-100 px-1 rounded">{solution.complexity.time.average}</code></div>
                  <div>Worst: <code className="bg-gray-100 px-1 rounded">{solution.complexity.time.worst}</code></div>
                </div>
                <p className="text-xs text-gray-600">
                  {solution.complexity.time.explanation}
                </p>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-gray-700 flex items-center gap-1">
                  <MemoryStick className="h-4 w-4" />
                  Space Complexity
                </h5>
                <div className="text-sm">
                  <div>Space: <code className="bg-gray-100 px-1 rounded">{solution.complexity.space.complexity}</code></div>
                  <div className="text-xs text-gray-600 mt-1">
                    {solution.complexity.space.explanation}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {solution.complexity.characteristics.map(char => (
                    <span key={char} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Code Implementation */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-700 flex items-center gap-1 mb-2">
              <BookOpen className="h-4 w-4" />
              Code Implementation
            </h5>
            
            {/* Language tabs */}
            <div className="flex flex-wrap gap-1 mb-2">
              {Object.keys(solution.code).map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Code display */}
            <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-gray-800 text-xs text-gray-400">
                {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Implementation
              </div>
              <pre className="p-3 overflow-x-auto text-sm">
                <code>{solution.code[selectedLanguage] || '// Code not available for this language'}</code>
              </pre>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="font-medium text-green-700 mb-2">✅ Pros</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {solution.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-green-500 mt-0.5">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-red-700 mb-2">❌ Cons</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {solution.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-red-500 mt-0.5">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* When to Use */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Info className="h-4 w-4" />
              When to Use
            </h5>
            <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
              {solution.whenToUse}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {!isCompareMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Play className="h-3 w-3" />
                Select & Run
              </button>
            )}
            
            {onBenchmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBenchmark(solution.id);
                }}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1"
              >
                <BarChart3 className="h-3 w-3" />
                Benchmark
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
