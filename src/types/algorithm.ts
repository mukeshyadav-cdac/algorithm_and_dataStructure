import { ReactNode } from 'react';
import { Cell, TestCase, TestResult, ParameterControl } from './core';

/**
 * Algorithm execution context
 * Composition Pattern: Encapsulates execution state
 */
export interface AlgorithmContext {
  grid: Cell[][];
  params: Record<string, unknown>;
  speed: number;
  isRunning: boolean;
  currentStep: number;
  totalSteps: number;
}

/**
 * Algorithm visualization strategy
 * Strategy Pattern: Different visualization approaches
 */
export interface VisualizationStrategy {
  id: string;
  name: string;
  description: string;
  setup: (rows: number, cols: number, params?: Record<string, unknown>) => Cell[][];
  animate: (context: AlgorithmContext, setGrid: (grid: Cell[][]) => void) => Promise<void>;
  getStepCount: (params: Record<string, unknown>) => number;
}

/**
 * Code execution strategy  
 * Strategy Pattern: Different language execution
 */
export interface ExecutionStrategy {
  language: string;
  extension: string;
  code: string;
  execute: (code: string, testCases: TestCase[]) => Promise<TestResult[]>;
  runtimeStatus: 'ready' | 'loading' | 'error';
}

/**
 * Educational content provider
 * Composition Pattern: Separates educational concerns
 */
export interface EducationalContent {
  overview: string;
  keyInsights: string[];
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
    explanation: string;
  };
  spaceComplexity: {
    value: string;
    explanation: string;
  };
  whenToUse: string[];
  commonPitfalls: string[];
  realWorldApplications: Array<{
    title: string;
    description: string;
    industry: string;
  }>;
}

/**
 * Algorithm interface using Composition Pattern
 * Composes different strategies and content providers
 */
export interface Algorithm {
  // Core identification
  id: string;
  name: string;
  category: AlgorithmCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: ReactNode;
  tags: string[];
  
  // Composed strategies
  visualization: VisualizationStrategy;
  execution: ExecutionStrategy[];
  education: EducationalContent;
  
  // Configuration
  testCases: TestCase[];
  defaultParams: Record<string, unknown>;
  paramControls: ParameterControl[];
  
  // Metadata
  estimatedTimeMinutes: number;
  prerequisites: string[];
  relatedAlgorithms: string[];
}

/**
 * Algorithm category
 * Strategy Pattern: Different grouping strategies
 */
export interface AlgorithmCategory {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  color: string;
  gradient: string;
}

/**
 * Algorithm factory interface
 * Factory Pattern: Creates algorithms with proper composition
 */
export interface AlgorithmFactory {
  createAlgorithm(config: AlgorithmConfig): Algorithm;
  createVisualization(type: VisualizationType): VisualizationStrategy;
  createExecution(language: string): ExecutionStrategy;
  createEducationalContent(algorithmId: string): EducationalContent;
}

/**
 * Configuration for algorithm creation
 */
export interface AlgorithmConfig {
  id: string;
  name: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  visualizationType: VisualizationType;
  supportedLanguages: string[];
  customParams?: Record<string, unknown>;
}

/**
 * Visualization types
 */
export type VisualizationType = 
  | 'grid' 
  | 'tree' 
  | 'graph' 
  | 'array' 
  | 'stack' 
  | 'queue' 
  | 'linkedList';

/**
 * Algorithm performance metrics
 */
export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  iterationCount: number;
  comparisonCount: number;
  swapCount?: number;
  recursionDepth?: number;
}

/**
 * Step-by-step execution trace
 */
export interface ExecutionStep {
  stepNumber: number;
  description: string;
  state: Record<string, unknown>;
  highlightedElements: number[];
  metrics: Partial<PerformanceMetrics>;
}