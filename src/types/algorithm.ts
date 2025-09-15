import { Cell, TestCase, ParameterControl, PerformanceMetrics } from './core';

/**
 * Language runtime status
 * ISP: Focused on language execution capabilities
 */
export interface LanguageRuntime {
  name: string;
  extension: string;
  runtimeStatus: 'ready' | 'loading' | 'error' | 'not_supported';
  code: string;
  testRunner: (code: string, testCases: TestCase[]) => Promise<unknown[]>;
}

/**
 * Algorithm complexity information
 * ISP: Dedicated to complexity analysis
 */
export interface AlgorithmComplexity {
  time: {
    best: string;
    average: string;
    worst: string;
    explanation: string;
  };
  space: {
    complexity: string;
    explanation: string;
  };
  characteristics: string[];
}

/**
 * Solution approach types using Strategy Pattern
 * ISP: Clear separation of solution strategies
 */
export type SolutionApproach = 'recursive' | 'memoization' | 'tabulation' | 'space_optimized' | 'greedy' | 'divide_conquer';

/**
 * Individual algorithm solution
 * Strategy Pattern: Each solution is a strategy for solving the problem
 */
export interface AlgorithmSolution {
  id: string;
  name: string;
  description: string;
  approach: SolutionApproach;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  complexity: AlgorithmComplexity;
  code: Record<string, string>; // language -> code mapping
  
  // Educational content
  whenToUse: string;
  pros: string[];
  cons: string[];
  
  // Visualization function
  visualizer: (
    testCase: unknown, 
    updateGrid: (grid: Cell[][]) => void,
    setStep: (step: number) => void,
    onMetrics: (metrics: PerformanceMetrics) => void
  ) => Promise<void>;
}

/**
 * Main algorithm definition
 * Template Method Pattern: Defines algorithm structure with customizable parts
 */
export interface Algorithm {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: React.ComponentType<{ className?: string }>;
  
  // Multiple solutions support
  solutions: AlgorithmSolution[];
  defaultSolutionId: string;
  
  // Educational metadata
  concepts: string[];
  relatedAlgorithms: string[];
  realWorldApplications: string[];
  prerequisites: string[];
  
  // Testing and parameters
  testCases: TestCase[];
  defaultParams: Record<string, unknown>;
  paramControls: ParameterControl[];
  
  // Grid setup for visualization
  gridSetup: (rows: number, cols: number, params?: Record<string, unknown>) => Cell[][];
  
  // Metadata
  tags: string[];
  estimatedTime: number; // minutes
  practiceLevel: 'conceptual' | 'implementation' | 'optimization';
  
  // Learning insights
  insights?: {
    keyLearnings: string[];
    optimizationTips: string[];
    commonMistakes: string[];
    realWorldScenarios: Array<{
      title: string;
      description: string;
      complexity?: string;
    }>;
  };
}

/**
 * Algorithm category grouping
 * ISP: Separate interface for categorization
 */
export interface AlgorithmCategory {
  id: string;
  name: string;
  description: string;
  algorithms: string[]; // algorithm IDs
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}
