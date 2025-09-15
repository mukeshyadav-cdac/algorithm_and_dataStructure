import { Algorithm, Cell, TestResult } from '../types';
import { RuntimeTestRunnerFactory } from './testRunners';
import { sleep } from '../utils';

/**
 * Service class for managing algorithm operations
 * Implements Service Layer pattern
 */
export class AlgorithmService {
  private testRunnerFactory: RuntimeTestRunnerFactory;

  constructor() {
    this.testRunnerFactory = RuntimeTestRunnerFactory.getInstance();
  }

  /**
   * Executes tests for an algorithm with specific language implementation
   */
  async runTests(
    algorithm: Algorithm,
    languageName: string,
    customCode: string
  ): Promise<TestResult[]> {
    const testRunner = this.testRunnerFactory.createRunner(languageName, algorithm.id);
    return await testRunner.execute(customCode, algorithm.testCases);
  }

  /**
   * Initializes grid for algorithm visualization
   */
  initializeGrid(
    algorithm: Algorithm,
    rows: number,
    cols: number,
    params: any = {}
  ): Cell[][] {
    const mergedParams = { ...algorithm.defaultParams, ...params, rows, cols };
    return algorithm.gridSetup(rows, cols, mergedParams);
  }

  /**
   * Animates algorithm execution on grid
   */
  async animateAlgorithm(
    algorithm: Algorithm,
    grid: Cell[][],
    setGrid: (grid: Cell[][]) => void,
    params: any,
    animationSpeed: number
  ): Promise<void> {
    await algorithm.animate(grid, setGrid, params, animationSpeed);
  }

  /**
   * Validates algorithm parameters
   */
  validateParameters(algorithm: Algorithm, params: any): {
    isValid: boolean;
    errors: string[];
    correctedParams: any;
  } {
    const errors: string[] = [];
    const correctedParams = { ...params };

    algorithm.paramControls.forEach(control => {
      const value = params[control.name];

      switch (control.type) {
        case 'number':
          if (typeof value !== 'number' || isNaN(value)) {
            errors.push(`${control.name} must be a valid number`);
            correctedParams[control.name] = control.default;
          } else if (control.min !== undefined && value < control.min) {
            errors.push(`${control.name} must be at least ${control.min}`);
            correctedParams[control.name] = control.min;
          } else if (control.max !== undefined && value > control.max) {
            errors.push(`${control.name} must be at most ${control.max}`);
            correctedParams[control.name] = control.max;
          }
          break;

        case 'array':
          if (!Array.isArray(value)) {
            errors.push(`${control.name} must be an array`);
            correctedParams[control.name] = control.default;
          } else if (value.length === 0) {
            errors.push(`${control.name} cannot be empty`);
            correctedParams[control.name] = control.default;
          }
          break;

        case 'string':
          if (typeof value !== 'string' || value.trim().length === 0) {
            errors.push(`${control.name} must be a non-empty string`);
            correctedParams[control.name] = control.default;
          }
          break;
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      correctedParams
    };
  }

  /**
   * Gets algorithm by ID
   */
  getAlgorithmById(algorithms: Algorithm[], id: string): Algorithm | undefined {
    return algorithms.find(algo => algo.id === id);
  }

  /**
   * Gets supported languages for an algorithm
   */
  getSupportedLanguages(algorithm: Algorithm): {
    executable: string[];
    simulated: string[];
  } {
    const executable: string[] = [];
    const simulated: string[] = [];

    algorithm.languages.forEach(lang => {
      if (this.testRunnerFactory.canExecuteLanguage(lang.name)) {
        executable.push(lang.name);
      } else {
        simulated.push(lang.name);
      }
    });

    return { executable, simulated };
  }

  /**
   * Estimates algorithm execution time based on input size
   */
  estimateExecutionTime(algorithm: Algorithm, params: any): {
    estimatedMs: number;
    complexity: string;
    inputSize: number;
  } {
    let inputSize = 1;
    
    // Calculate input size based on algorithm type
    switch (algorithm.id) {
      case 'uniquePaths':
      case 'minPathSum':
        inputSize = params.rows * params.cols;
        break;
      case 'coinChange':
        inputSize = params.amount * (params.coins?.length || 1);
        break;
      case 'lis':
        inputSize = Math.pow(params.nums?.length || 1, 2);
        break;
      case 'knapsack':
        inputSize = (params.weights?.length || 1) * params.capacity;
        break;
      default:
        inputSize = 100; // Default estimate
    }

    // Simple execution time estimation (very rough)
    const baseTimeMs = 0.01; // Base time per operation
    const estimatedMs = Math.max(10, inputSize * baseTimeMs);

    return {
      estimatedMs,
      complexity: algorithm.complexity.time,
      inputSize
    };
  }

  /**
   * Checks if animation should be cancelled
   */
  async checkAnimationCancellation(
    shouldCancel: () => boolean,
    delay: number = 100
  ): Promise<boolean> {
    await sleep(delay);
    return shouldCancel();
  }

  /**
   * Gets algorithm statistics
   */
  getAlgorithmStats(algorithms: Algorithm[]): {
    totalAlgorithms: number;
    totalLanguages: number;
    executableLanguages: number;
    averageTestCases: number;
    complexityDistribution: Record<string, number>;
  } {
    const totalAlgorithms = algorithms.length;
    
    const allLanguages = new Set<string>();
    let totalTestCases = 0;
    const complexities: Record<string, number> = {};

    algorithms.forEach(algorithm => {
      algorithm.languages.forEach(lang => allLanguages.add(lang.name));
      totalTestCases += algorithm.testCases.length;
      
      const timeComplexity = algorithm.complexity.time;
      complexities[timeComplexity] = (complexities[timeComplexity] || 0) + 1;
    });

    const executableLanguages = this.testRunnerFactory.getExecutableLanguages().length;

    return {
      totalAlgorithms,
      totalLanguages: allLanguages.size,
      executableLanguages,
      averageTestCases: Math.round(totalTestCases / totalAlgorithms),
      complexityDistribution: complexities
    };
  }
}
