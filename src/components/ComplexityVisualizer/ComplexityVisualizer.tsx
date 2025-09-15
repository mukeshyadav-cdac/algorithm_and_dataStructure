import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ScatterChart, Scatter, ResponsiveContainer,
  ReferenceLine, Area, AreaChart
} from 'recharts';
import { 
  AlgorithmSolution, 
  BenchmarkResult, 
  ComplexityChartConfig,
  SolutionComparison,
  PerformanceMetrics
} from '../../types';
import { 
  TrendingUp, BarChart3, Activity, Zap, MemoryStick, 
  Clock, Target, Settings, RefreshCw, Download, Eye, EyeOff
} from 'lucide-react';

interface ComplexityVisualizerProps {
  solutions: AlgorithmSolution[];
  benchmarkResults?: BenchmarkResult[];
  comparison?: SolutionComparison;
  isLoading?: boolean;
  onConfigChange?: (config: ComplexityChartConfig) => void;
  onBenchmark?: (solutionIds: string[], inputSizes: number[]) => void;
  onExportData?: () => void;
}

/**
 * Interactive Complexity Visualizer Component
 * Shows real-time performance metrics and theoretical complexity analysis
 */
export const ComplexityVisualizer: React.FC<ComplexityVisualizerProps> = ({
  solutions,
  benchmarkResults = [],
  comparison,
  isLoading = false,
  onConfigChange,
  onBenchmark,
  onExportData
}) => {
  const [config, setConfig] = useState<ComplexityChartConfig>({
    type: 'time',
    showProjected: true,
    showActual: true,
    logScale: false,
    maxInputSize: 1000,
    samplePoints: 10,
    selectedSolutions: solutions.slice(0, 2).map(s => s.id)
  });

  const [activeMetric, setActiveMetric] = useState<'time' | 'space' | 'operations'>('time');
  const [showTheoretical, setShowTheoretical] = useState(true);
  const [animateChart, setAnimateChart] = useState(true);

  // Generate theoretical complexity data
  const theoreticalData = useMemo(() => {
    const inputSizes = Array.from({ length: config.samplePoints }, (_, i) => 
      Math.floor((i + 1) * config.maxInputSize / config.samplePoints)
    );

    return inputSizes.map(n => {
      const point: any = { inputSize: n };
      
      solutions.forEach(solution => {
        if (config.selectedSolutions.includes(solution.id)) {
          // Generate theoretical values based on complexity
          const complexity = solution.complexity.time.worst;
          let theoreticalValue = 0;
          
          if (complexity.includes('n²') || complexity.includes('n^2')) {
            theoreticalValue = n * n / 10000; // Normalize for visualization
          } else if (complexity.includes('n log n')) {
            theoreticalValue = n * Math.log2(n) / 1000;
          } else if (complexity.includes('n³') || complexity.includes('n^3')) {
            theoreticalValue = Math.pow(n, 3) / 1000000;
          } else if (complexity.includes('2^n')) {
            theoreticalValue = Math.pow(2, Math.min(n, 20)) / 1000; // Cap exponential
          } else if (complexity.includes('n')) {
            theoreticalValue = n / 100;
          } else {
            theoreticalValue = 1; // O(1)
          }
          
          point[`${solution.id}_theoretical`] = Math.max(0.1, theoreticalValue);
        }
      });
      
      return point;
    });
  }, [solutions, config]);

  // Combine actual and theoretical data
  const chartData = useMemo(() => {
    const actualData = new Map<number, any>();
    
    // Process actual benchmark results
    benchmarkResults.forEach(result => {
      if (!actualData.has(result.inputSize)) {
        actualData.set(result.inputSize, { inputSize: result.inputSize });
      }
      
      const point = actualData.get(result.inputSize)!;
      const solutionName = solutions.find(s => s.id === result.solutionId)?.name || result.solutionId;
      
      switch (activeMetric) {
        case 'time':
          point[`${result.solutionId}_actual`] = result.metrics.executionTime;
          break;
        case 'space':
          point[`${result.solutionId}_actual`] = result.metrics.spaceUsed / 1024; // Convert to KB
          break;
        case 'operations':
          point[`${result.solutionId}_actual`] = result.metrics.operations;
          break;
      }
    });
    
    // Merge with theoretical data
    const mergedData = theoreticalData.map(theoretical => {
      const actual = actualData.get(theoretical.inputSize) || {};
      return { ...theoretical, ...actual };
    });
    
    return mergedData.sort((a, b) => a.inputSize - b.inputSize);
  }, [benchmarkResults, theoreticalData, activeMetric, solutions]);

  const handleConfigChange = (newConfig: Partial<ComplexityChartConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    onConfigChange?.(updatedConfig);
  };

  const getMetricLabel = () => {
    switch (activeMetric) {
      case 'time': return 'Execution Time (ms)';
      case 'space': return 'Memory Usage (KB)';
      case 'operations': return 'Operations Count';
      default: return 'Value';
    }
  };

  const getMetricIcon = () => {
    switch (activeMetric) {
      case 'time': return <Clock className="h-4 w-4" />;
      case 'space': return <MemoryStick className="h-4 w-4" />;
      case 'operations': return <Activity className="h-4 w-4" />;
    }
  };

  const solutionColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ];

  const runBenchmark = () => {
    const inputSizes = Array.from({ length: 5 }, (_, i) => (i + 1) * 100);
    onBenchmark?.(config.selectedSolutions, inputSizes);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Complexity Analysis
            </h3>
            <p className="text-sm text-gray-600">
              Interactive performance visualization and comparison
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {onExportData && (
              <button
                onClick={onExportData}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                Export
              </button>
            )}
            
            {onBenchmark && (
              <button
                onClick={runBenchmark}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-1"
              >
                {isLoading ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <BarChart3 className="h-3 w-3" />
                )}
                Benchmark
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Metric Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Metric
            </label>
            <div className="flex gap-1">
              {(['time', 'space', 'operations'] as const).map(metric => (
                <button
                  key={metric}
                  onClick={() => setActiveMetric(metric)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                    activeMetric === metric
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border hover:bg-gray-50'
                  }`}
                >
                  {metric === 'time' && <Clock className="h-3 w-3" />}
                  {metric === 'space' && <MemoryStick className="h-3 w-3" />}
                  {metric === 'operations' && <Activity className="h-3 w-3" />}
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Solution Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solutions
            </label>
            <select
              multiple
              value={config.selectedSolutions}
              onChange={(e) => handleConfigChange({
                selectedSolutions: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full p-1 text-xs border border-gray-300 rounded-md"
              size={3}
            >
              {solutions.map(solution => (
                <option key={solution.id} value={solution.id}>
                  {solution.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chart Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display
            </label>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={showTheoretical}
                  onChange={(e) => setShowTheoretical(e.target.checked)}
                  className="w-3 h-3"
                />
                Theoretical O(n)
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={config.logScale}
                  onChange={(e) => handleConfigChange({ logScale: e.target.checked })}
                  className="w-3 h-3"
                />
                Log Scale
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={animateChart}
                  onChange={(e) => setAnimateChart(e.target.checked)}
                  className="w-3 h-3"
                />
                Animation
              </label>
            </div>
          </div>

          {/* Input Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Input Size Range
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={config.maxInputSize}
              onChange={(e) => handleConfigChange({ maxInputSize: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 flex justify-between">
              <span>100</span>
              <span>{config.maxInputSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="inputSize" 
                scale={config.logScale ? 'log' : 'linear'}
                domain={config.logScale ? ['dataMin', 'dataMax'] : undefined}
                label={{ value: 'Input Size', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                scale={config.logScale ? 'log' : 'linear'}
                domain={config.logScale ? ['dataMin', 'dataMax'] : undefined}
                label={{ value: getMetricLabel(), angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toFixed(2) : value,
                  name.replace(/_/g, ' ').replace('actual', '(actual)').replace('theoretical', '(theoretical)')
                ]}
                labelFormatter={(label) => `Input Size: ${label}`}
              />
              <Legend />
              
              {/* Actual Performance Lines */}
              {config.selectedSolutions.map((solutionId, index) => {
                const solution = solutions.find(s => s.id === solutionId);
                if (!solution) return null;
                
                return (
                  <Line
                    key={`${solutionId}_actual`}
                    type="monotone"
                    dataKey={`${solutionId}_actual`}
                    stroke={solutionColors[index * 2]}
                    strokeWidth={3}
                    dot={{ fill: solutionColors[index * 2], strokeWidth: 2, r: 4 }}
                    name={`${solution.name} (Actual)`}
                    connectNulls={false}
                    animationDuration={animateChart ? 1000 : 0}
                  />
                );
              })}
              
              {/* Theoretical Complexity Lines */}
              {showTheoretical && config.selectedSolutions.map((solutionId, index) => {
                const solution = solutions.find(s => s.id === solutionId);
                if (!solution) return null;
                
                return (
                  <Line
                    key={`${solutionId}_theoretical`}
                    type="monotone"
                    dataKey={`${solutionId}_theoretical`}
                    stroke={solutionColors[index * 2 + 1]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name={`${solution.name} (${solution.complexity.time.worst})`}
                    animationDuration={animateChart ? 1000 : 0}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Summary */}
      {comparison && (
        <div className="p-4 border-t bg-blue-50">
          <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Solution Comparison
          </h4>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(comparison.metrics.timeRatio).toFixed(2)}x
              </div>
              <div className="text-sm text-gray-600">Time Ratio</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(comparison.metrics.spaceRatio).toFixed(2)}x
              </div>
              <div className="text-sm text-gray-600">Space Ratio</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(comparison.metrics.operationsRatio).toFixed(2)}x
              </div>
              <div className="text-sm text-gray-600">Operations Ratio</div>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-white rounded border">
            <strong>Recommendation:</strong> {comparison.recommendation.reason}
          </div>
        </div>
      )}

      {/* Complexity Insights */}
      {config.selectedSolutions.length > 0 && (
        <div className="p-4 border-t">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Performance Insights
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            {config.selectedSolutions.slice(0, 2).map(solutionId => {
              const solution = solutions.find(s => s.id === solutionId);
              if (!solution) return null;
              
              return (
                <div key={solutionId} className="bg-gray-50 rounded-lg p-3">
                  <h5 className="font-medium text-gray-700 mb-2">{solution.name}</h5>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Time Complexity:</span>
                      <code className="bg-white px-1 rounded">{solution.complexity.time.worst}</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Space Complexity:</span>
                      <code className="bg-white px-1 rounded">{solution.complexity.space.complexity}</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Approach:</span>
                      <span className="capitalize">{solution.approach.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      {solution.complexity.time.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
