import { ReactNode } from 'react';

// Detailed complexity analysis for each solution
export interface ComplexityAnalysis {
  time: {
    best: string;      // O(1), O(log n), etc.
    average: string;   // Most common case
    worst: string;     // Worst case scenario
    explanation: string;
    variables?: Record<string, string>; // n = input size, k = unique elements, etc.
  };
  space: {
    complexity: string;
    explanation: string;
    auxiliary: string; // Extra space beyond input
    inPlace: boolean;  // Whether algorithm modifies input in-place
  };
  characteristics: string[];  // ["Stable", "In-place", "Adaptive", etc.]
  tradeoffs: string[];        // What you gain/lose with this approach
}

// Performance metrics captured during execution
export interface PerformanceMetrics {
  executionTime: number;     // milliseconds
  memoryUsage: number;       // approximate bytes used
  operations: number;        // total operations performed
  comparisons: number;       // comparison operations
  assignments: number;       // assignment operations
  recursionDepth?: number;   // max recursion depth
  cacheHits?: number;        // for memoization
  cacheMisses?: number;      // for memoization
  spaceUsed: number;         // actual space used
  inputSize: number;         // size of input for normalization
}

// Real-time complexity visualization data
export interface ComplexityVisualization {
  inputSizes: number[];      // [10, 100, 1000, ...]
  timeComplexity: number[];  // actual execution times
  spaceComplexity: number[]; // actual memory usage
  operationCounts: number[]; // operation counts per input size
  projectedTime: number[];   // theoretical O(n) projections
  projectedSpace: number[];  // theoretical space projections
}

// Different solution approaches
export type SolutionApproach = 
  | 'brute_force'
  | 'memoization' 
  | 'tabulation'
  | 'optimized'
  | 'recursive'
  | 'iterative'
  | 'greedy'
  | 'divide_conquer'
  | 'backtracking'
  | 'two_pointer'
  | 'sliding_window';

// Solution difficulty levels
export type SolutionDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Individual algorithm solution with complexity analysis
export interface AlgorithmSolution {
  id: string;
  name: string;
  approach: SolutionApproach;
  description: string;
  complexity: ComplexityAnalysis;
  
  // Multi-language code implementations
  code: Record<string, string>; // language -> code implementation
  
  // Educational content
  pros: string[];
  cons: string[];
  whenToUse: string;
  difficulty: SolutionDifficulty;
  
  // Step-by-step explanation
  steps: Array<{
    title: string;
    description: string;
    codeSnippet?: string;
  }>;
  
  // Visualization function with metrics callback
  visualizer?: (
    testCase: any,
    updateGrid: (grid: any[][]) => void,
    setStep: (step: number) => void,
    onMetrics?: (metrics: PerformanceMetrics) => void,
    onProgress?: (progress: { current: number; total: number }) => void
  ) => Promise<any>;
  
  // Custom parameters for this solution
  parameters?: Record<string, {
    type: 'number' | 'boolean' | 'string';
    default: any;
    min?: number;
    max?: number;
    description: string;
  }>;
}

// Comparison result between two solutions
export interface SolutionComparison {
  solutionIds: [string, string];
  metrics: {
    timeRatio: number;      // solution1Time / solution2Time
    spaceRatio: number;     // solution1Space / solution2Space  
    operationsRatio: number; // solution1Ops / solution2Ops
  };
  recommendation: {
    winner: string;
    reason: string;
    tradeoffs: string[];
  };
  visualData: {
    labels: string[];
    solution1Data: number[];
    solution2Data: number[];
  };
}

// Interactive complexity chart configuration
export interface ComplexityChartConfig {
  type: 'time' | 'space' | 'operations' | 'comparison';
  showProjected: boolean;    // Show theoretical O(n) curves
  showActual: boolean;       // Show actual measured data
  logScale: boolean;         // Use logarithmic scale
  maxInputSize: number;      // Maximum input size to test
  samplePoints: number;      // Number of data points
  selectedSolutions: string[]; // Which solutions to compare
}

// Benchmark test configuration
export interface BenchmarkConfig {
  inputSizes: number[];
  iterations: number;        // Runs per input size
  timeout: number;          // Max time per test (ms)
  memoryLimit: number;      // Max memory per test (bytes)
  includeWarmup: boolean;   // Include JIT warmup runs
}

// Benchmark results
export interface BenchmarkResult {
  solutionId: string;
  inputSize: number;
  metrics: PerformanceMetrics;
  iterations: number;
  variance: number;         // Performance variance across runs
  outliers: number;         // Number of outlier results removed
}

// Educational insights generated from complexity analysis
export interface ComplexityInsights {
  bestApproach: {
    forSmallInputs: string;   // Solution ID
    forLargeInputs: string;   // Solution ID
    forMemoryConstrained: string;
    forTimeConstrained: string;
  };
  keyLearnings: string[];
  commonMistakes: string[];
  optimizationTips: string[];
  realWorldScenarios: Array<{
    scenario: string;
    recommendedSolution: string;
    reasoning: string;
  }>;
}

// Interactive tutorial step
export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  codeHighlight?: {
    lines: number[];
    explanation: string;
  };
  visualization?: {
    grid?: any[][];
    highlight?: Array<{ row: number; col: number; color: string }>;
    annotation?: Array<{ x: number; y: number; text: string }>;
  };
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}
