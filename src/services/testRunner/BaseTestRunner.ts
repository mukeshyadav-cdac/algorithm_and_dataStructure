import { TestCase, TestResult } from '@/types';

/**
 * Abstract base class for test runners
 * Template Method Pattern: Defines the algorithm structure with customizable parts
 * Single Responsibility: Only handles test execution logic
 */
export abstract class BaseTestRunner {
  protected timeout: number;
  protected maxExecutionTime: number;

  constructor(timeout = 5000, maxExecutionTime = 1000) {
    this.timeout = timeout;
    this.maxExecutionTime = maxExecutionTime;
  }

  /**
   * Template method that defines the test execution algorithm
   * SRP: Coordinates the test execution process
   */
  async runTests(code: string, testCases: TestCase[]): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // Validate code before execution
    const codeValidation = await this.validateCode(code);
    if (!codeValidation.valid) {
      return testCases.map(testCase => ({
        passed: false,
        expected: testCase.expected,
        actual: null,
        description: testCase.description,
        error: codeValidation.error,
      }));
    }

    // Prepare the execution environment
    const context = await this.prepareExecutionContext(code);

    // Execute each test case
    for (const testCase of testCases) {
      try {
        const result = await this.executeTestCase(context, testCase);
        results.push(result);
      } catch (error) {
        results.push({
          passed: false,
          expected: testCase.expected,
          actual: null,
          description: testCase.description,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Cleanup execution context
    await this.cleanupExecutionContext(context);

    return results;
  }

  /**
   * Validate code syntax and safety
   * SRP: Only handles code validation
   */
  protected abstract validateCode(code: string): Promise<{ valid: boolean; error?: string }>;

  /**
   * Prepare execution context for the code
   * SRP: Only handles context setup
   */
  protected abstract prepareExecutionContext(code: string): Promise<unknown>;

  /**
   * Execute a single test case
   * SRP: Only handles single test execution
   */
  protected abstract executeTestCase(context: unknown, testCase: TestCase): Promise<TestResult>;

  /**
   * Cleanup execution context
   * SRP: Only handles context cleanup
   */
  protected abstract cleanupExecutionContext(context: unknown): Promise<void>;

  /**
   * Compare expected and actual results
   * SRP: Only handles result comparison logic
   */
  protected compareResults(expected: unknown, actual: unknown): boolean {
    // Deep comparison for objects and arrays
    if (typeof expected === 'object' && typeof actual === 'object') {
      if (expected === null && actual === null) return true;
      if (expected === null || actual === null) return false;
      
      if (Array.isArray(expected) && Array.isArray(actual)) {
        return this.compareArrays(expected, actual);
      }
      
      return JSON.stringify(expected) === JSON.stringify(actual);
    }
    
    // Special handling for numeric comparisons with floating point tolerance
    if (typeof expected === 'number' && typeof actual === 'number') {
      const tolerance = 1e-9;
      return Math.abs(expected - actual) < tolerance;
    }
    
    return expected === actual;
  }

  /**
   * Compare arrays with deep comparison
   * SRP: Only handles array comparison
   */
  private compareArrays(expected: unknown[], actual: unknown[]): boolean {
    if (expected.length !== actual.length) return false;
    
    for (let i = 0; i < expected.length; i++) {
      if (!this.compareResults(expected[i], actual[i])) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Measure execution time
   * SRP: Only handles timing measurement
   */
  protected async measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; executionTime: number }> {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    
    return {
      result,
      executionTime: endTime - startTime,
    };
  }

  /**
   * Create timeout wrapper for execution
   * SRP: Only handles timeout management
   */
  protected withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Execution timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      promise
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }
}
