// Core types following Interface Segregation Principle (ISP)

/**
 * Basic cell structure for grid visualization
 * ISP: Contains only essential cell properties
 */
export interface Cell {
  value: number | string;
  visited: boolean;
  highlighted: boolean;
}

/**
 * Extended cell for pathfinding algorithms
 * ISP: Separate interface for path-specific properties
 */
export interface PathCell extends Cell {
  isPath: boolean;
  isCurrentPath: boolean;
}

/**
 * Test case structure
 * ISP: Focused only on test definition
 */
export interface TestCase {
  input: Record<string, unknown>;
  expected: unknown;
  description: string;
}

/**
 * Test execution result
 * ISP: Separate from test definition
 */
export interface TestResult {
  passed: boolean;
  expected: unknown;
  actual: unknown;
  description: string;
  executionTime?: number;
  error?: string;
}

/**
 * Animation control state
 * ISP: Focused only on animation
 */
export interface AnimationState {
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
}

/**
 * Parameter control definition
 * ISP: UI-specific parameter interface
 */
export interface ParameterControl {
  name: string;
  type: 'number' | 'array' | 'string' | 'boolean';
  label: string;
  min?: number;
  max?: number;
  default: unknown;
  description?: string;
}

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
