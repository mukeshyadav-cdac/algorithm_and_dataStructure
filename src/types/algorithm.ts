import { ReactNode } from 'react';
import { AlgorithmSolution, ComplexityInsights, TutorialStep } from './complexity';

// Grid cell interface for visualization
export interface Cell {
  value: number | string;
  isPath: boolean;
  isCurrentPath: boolean;
  visited: boolean;
  highlighted: boolean;
  color?: string;
}

// Test case definition for algorithm validation
export interface TestCase {
  input: any;
  expected: any;
  description: string;
}

// Test execution result
export interface TestResult {
  passed: boolean;
  actual: any;
  expected: any;
  error?: string;
  executionTime?: number;
}

// Programming language support definition
export interface Language {
  name: string;
  code: string;
  extension: string;
  testRunner: (code: string, testCases: TestCase[]) => Promise<TestResult[]>;
  runtimeStatus: 'loading' | 'ready' | 'error';
}

// Parameter control configuration for algorithm customization
export interface ParameterControl {
  name: string;
  type: 'number' | 'array' | 'string';
  min?: number;
  max?: number;
  default: any;
  description: string;
}

// Algorithm complexity information
export interface AlgorithmComplexity {
  time: string;
  space: string;
}

// Main algorithm definition interface with multiple solutions support
export interface Algorithm {
  id: string;
  name: string;
  description: string;
  category: 'dynamic_programming' | 'graph' | 'array' | 'string' | 'tree' | 'sorting' | 'searching';
  difficulty: 'easy' | 'medium' | 'hard';
  icon: React.ComponentType<any> | ReactNode;
  
  // Legacy single complexity (deprecated)
  complexity?: AlgorithmComplexity;
  
  // Multiple solutions with detailed analysis
  solutions: AlgorithmSolution[];
  defaultSolutionId: string;
  
  // Educational content
  concepts: string[];              // Key concepts this algorithm teaches
  relatedAlgorithms: string[];     // IDs of related algorithms
  realWorldApplications: string[]; // Where this is used in practice
  prerequisites: string[];         // Concepts student should know first
  
  // Test cases and validation
  testCases: TestCase[];
  
  // Grid-based visualization
  gridSetup: (rows: number, cols: number, params?: any) => Cell[][];
  
  // Legacy animation function (deprecated in favor of solution-specific visualizers)
  animate?: (grid: Cell[][], setGrid: (grid: Cell[][]) => void, params: any, animationSpeed: number) => Promise<void>;
  
  // Legacy language support (deprecated in favor of solution-specific code)
  languages?: Language[];
  
  // Parameters
  defaultParams: any;
  paramControls: ParameterControl[];
  
  // Interactive tutorial
  tutorial?: TutorialStep[];
  
  // Generated insights from complexity analysis
  insights?: ComplexityInsights;
  
  // Metadata
  tags: string[];                  // Search tags
  estimatedTime: number;           // Minutes to understand
  practiceLevel: 'theory' | 'implementation' | 'optimization';
}

// Animation configuration
export interface AnimationConfig {
  speed: number;
  isPlaying: boolean;
  isPaused: boolean;
}

// Grid configuration
export interface GridConfig {
  rows: number;
  cols: number;
  maxRows: number;
  maxCols: number;
  minRows: number;
  minCols: number;
}

// Algorithm execution context
export interface AlgorithmExecutionContext {
  algorithm: Algorithm;
  language: Language;
  params: any;
  grid: Cell[][];
  animationConfig: AnimationConfig;
  gridConfig: GridConfig;
}
