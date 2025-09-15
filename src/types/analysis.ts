import { PerformanceMetrics, AlgorithmSolution } from './core';

/**
 * Benchmarking configuration
 * ISP: Focused only on benchmark settings
 */
export interface BenchmarkConfig {
  iterations: number;
  inputSizes: number[];
  timeout: number;
  warmupRuns: number;
}

/**
 * Individual benchmark result
 * ISP: Single benchmark execution result
 */
export interface BenchmarkResult {
  solutionId: string;
  inputSize: number;
  metrics: PerformanceMetrics;
  timestamp: number;
  iterations: number;
}

/**
 * Comparative analysis between solutions
 * ISP: Dedicated to solution comparison
 */
export interface SolutionComparison {
  algorithm: string;
  solutions: AlgorithmSolution[];
  benchmarkResults: BenchmarkResult[];
  recommendations: {
    bestOverall: string;
    bestForSmallInput: string;
    bestForLargeInput: string;
    mostEducational: string;
  };
  analysis: {
    summary: string;
    tradeoffs: string[];
    useCases: Array<{
      scenario: string;
      recommendedSolution: string;
      reasoning: string;
    }>;
  };
}

/**
 * Complexity visualization data
 * ISP: Data structure for complexity charts
 */
export interface ComplexityVisualizationData {
  inputSizes: number[];
  datasets: Array<{
    label: string;
    solutionId: string;
    data: number[];
    color: string;
    approach: string;
  }>;
  metrics: {
    type: 'time' | 'space' | 'operations';
    unit: string;
    scale: 'linear' | 'logarithmic';
  };
}

/**
 * Learning progress tracking
 * ISP: Separate concern for user progress
 */
export interface LearningProgress {
  userId?: string;
  algorithmsCompleted: string[];
  solutionsExplored: string[];
  conceptsLearned: string[];
  totalTimeSpent: number;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt: Date;
  }>;
}

/**
 * Interactive analysis session
 * ISP: Session state management
 */
export interface AnalysisSession {
  id: string;
  algorithmId: string;
  selectedSolutions: string[];
  benchmarkConfig: BenchmarkConfig;
  results: BenchmarkResult[];
  notes: string;
  createdAt: Date;
  lastModified: Date;
}
