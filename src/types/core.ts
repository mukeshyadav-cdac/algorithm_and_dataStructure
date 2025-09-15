// Core base types following Interface Segregation Principle (ISP)

/**
 * Base cell structure for grid-based visualizations
 * ISP: Only contains essential cell properties
 */
export interface Cell {
  value: number | string;
  visited: boolean;
  highlighted: boolean;
}

/**
 * Extended cell for path-finding algorithms
 * ISP: Separate interface for path-specific properties
 */
export interface PathCell extends Cell {
  isPath: boolean;
  isCurrentPath: boolean;
}

/**
 * Test case structure for algorithm validation
 * ISP: Focused only on testing concerns
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
 * Animation step control
 * ISP: Focused only on animation state
 */
export interface AnimationState {
  isAnimating: boolean;
  isPaused: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
}

/**
 * Performance metrics interface
 * ISP: Dedicated to performance measurement
 */
export interface PerformanceMetrics {
  executionTime: number;
  operations: number;
  memoryUsed: number;
  comparisons: number;
}

/**
 * Generic parameter control definition
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
