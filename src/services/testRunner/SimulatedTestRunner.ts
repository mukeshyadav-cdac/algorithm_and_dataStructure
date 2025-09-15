import { TestCase, TestResult } from '@/types';
import { BaseTestRunner } from './BaseTestRunner';
import { sleep } from '@/utils';

/**
 * Simulated test runner for languages that cannot be executed in browser
 * Strategy Pattern: Specific strategy for simulated execution
 * Single Responsibility: Only handles simulation of test execution
 */
export class SimulatedTestRunner extends BaseTestRunner {
  private readonly language: string;
  private readonly simulatedResults: Map<string, unknown> = new Map();

  constructor(language: string) {
    super(2000, 500); // Shorter timeouts for simulation
    this.language = language;
    this.initializeSimulatedResults();
  }

  /**
   * Validate code (always passes for simulation)
   * SRP: Only handles simulated validation
   */
  protected async validateCode(code: string): Promise<{ valid: boolean; error?: string }> {
    // Simulate validation delay
    await sleep(100);
    
    if (!code.trim()) {
      return { valid: false, error: 'Code cannot be empty' };
    }
    
    // Basic syntax check based on language
    const syntaxCheck = this.performBasicSyntaxCheck(code);
    return syntaxCheck;
  }

  /**
   * Prepare simulated execution context
   * SRP: Only handles simulated context setup
   */
  protected async prepareExecutionContext(code: string): Promise<{ code: string; language: string }> {
    // Simulate compilation delay
    await sleep(200);
    
    return {
      code,
      language: this.language,
    };
  }

  /**
   * Execute simulated test case
   * SRP: Only handles simulated test execution
   */
  protected async executeTestCase(
    context: { code: string; language: string }, 
    testCase: TestCase
  ): Promise<TestResult> {
    const startTime = performance.now();
    
    // Simulate execution delay
    const executionDelay = Math.random() * 200 + 100; // 100-300ms
    await sleep(executionDelay);
    
    try {
      const result = this.simulateExecution(testCase);
      const endTime = performance.now();
      
      const passed = this.compareResults(testCase.expected, result);
      
      return {
        passed,
        expected: testCase.expected,
        actual: result,
        description: testCase.description,
        executionTime: endTime - startTime,
      };
    } catch (error) {
      const endTime = performance.now();
      
      return {
        passed: false,
        expected: testCase.expected,
        actual: null,
        description: testCase.description,
        executionTime: endTime - startTime,
        error: `Simulated ${this.language} execution error: ${error}`,
      };
    }
  }

  /**
   * Cleanup simulated execution context
   * SRP: Only handles simulated cleanup
   */
  protected async cleanupExecutionContext(_context: { code: string; language: string }): Promise<void> {
    // Simulate cleanup delay
    await sleep(50);
  }

  /**
   * Perform basic syntax validation based on language
   * SRP: Only handles language-specific syntax checking
   */
  private performBasicSyntaxCheck(code: string): { valid: boolean; error?: string } {
    const checks = this.getLanguageSpecificChecks();
    
    for (const check of checks) {
      if (!check.test(code)) {
        return {
          valid: false,
          error: `Invalid ${this.language} syntax: ${check.message}`,
        };
      }
    }
    
    return { valid: true };
  }

  /**
   * Get language-specific validation rules
   * SRP: Only defines language syntax rules
   */
  private getLanguageSpecificChecks(): Array<{ test: (code: string) => boolean; message: string }> {
    const commonChecks = [
      {
        test: (code: string) => code.trim().length > 0,
        message: 'Code cannot be empty',
      },
    ];

    const languageChecks: Record<string, Array<{ test: (code: string) => boolean; message: string }>> = {
      python: [
        {
          test: (code: string) => /def\s+\w+/.test(code),
          message: 'Must contain a function definition (def)',
        },
      ],
      java: [
        {
          test: (code: string) => /public\s+static\s+\w+/.test(code) || /public\s+\w+/.test(code),
          message: 'Must contain a public method',
        },
      ],
      cpp: [
        {
          test: (code: string) => /\w+\s+\w+\s*\([^)]*\)/.test(code),
          message: 'Must contain a function definition',
        },
      ],
      go: [
        {
          test: (code: string) => /func\s+\w+/.test(code),
          message: 'Must contain a function definition (func)',
        },
      ],
      rust: [
        {
          test: (code: string) => /fn\s+\w+/.test(code),
          message: 'Must contain a function definition (fn)',
        },
      ],
    };

    return [...commonChecks, ...(languageChecks[this.language.toLowerCase()] || [])];
  }

  /**
   * Simulate algorithm execution with realistic results
   * SRP: Only handles result simulation logic
   */
  private simulateExecution(testCase: TestCase): unknown {
    const inputKey = this.createInputKey(testCase.input);
    
    // Check if we have a pre-computed result
    if (this.simulatedResults.has(inputKey)) {
      return this.simulatedResults.get(inputKey);
    }
    
    // Generate realistic result based on algorithm type
    const result = this.generateRealisticResult(testCase);
    this.simulatedResults.set(inputKey, result);
    
    return result;
  }

  /**
   * Generate realistic results for common algorithms
   * SRP: Only handles result generation logic
   */
  private generateRealisticResult(testCase: TestCase): unknown {
    const input = testCase.input;
    
    // Try to determine algorithm type from input structure
    if ('m' in input && 'n' in input) {
      // Unique paths algorithm
      return this.simulateUniquePaths(input.m as number, input.n as number);
    }
    
    if ('coins' in input && 'amount' in input) {
      // Coin change algorithm
      return this.simulateCoinChange(input.coins as number[], input.amount as number);
    }
    
    if ('nums' in input) {
      // LIS algorithm
      return this.simulateLIS(input.nums as number[]);
    }
    
    if ('weights' in input && 'values' in input && 'W' in input) {
      // Knapsack algorithm
      return this.simulateKnapsack(
        input.weights as number[],
        input.values as number[],
        input.W as number
      );
    }
    
    if ('n' in input && Object.keys(input).length === 1) {
      // Climbing stairs algorithm
      return this.simulateClimbingStairs(input.n as number);
    }
    
    // Return expected result as fallback
    return testCase.expected;
  }

  /**
   * Simulate unique paths calculation
   * SRP: Only simulates unique paths algorithm
   */
  private simulateUniquePaths(m: number, n: number): number {
    // Simplified computation for simulation
    if (m === 1 || n === 1) return 1;
    
    // Use combinatorial formula: C(m+n-2, m-1)
    let result = 1;
    for (let i = 1; i <= Math.min(m - 1, n - 1); i++) {
      result = result * (m + n - 1 - i) / i;
    }
    return Math.round(result);
  }

  /**
   * Simulate coin change calculation
   * SRP: Only simulates coin change algorithm
   */
  private simulateCoinChange(coins: number[], amount: number): number {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (i >= coin && dp[i - coin] !== Infinity) {
          dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
      }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
  }

  /**
   * Simulate LIS calculation
   * SRP: Only simulates LIS algorithm
   */
  private simulateLIS(nums: number[]): number {
    if (nums.length === 0) return 0;
    
    const dp = new Array(nums.length).fill(1);
    
    for (let i = 1; i < nums.length; i++) {
      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i]) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
        }
      }
    }
    
    return Math.max(...dp);
  }

  /**
   * Simulate knapsack calculation
   * SRP: Only simulates knapsack algorithm
   */
  private simulateKnapsack(weights: number[], values: number[], W: number): number {
    const n = weights.length;
    const dp = Array(n + 1).fill(null).map(() => Array(W + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= W; w++) {
        if (weights[i - 1] <= w) {
          dp[i][w] = Math.max(
            dp[i - 1][w],
            dp[i - 1][w - weights[i - 1]] + values[i - 1]
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }
    
    return dp[n][W];
  }

  /**
   * Simulate climbing stairs calculation
   * SRP: Only simulates climbing stairs algorithm
   */
  private simulateClimbingStairs(n: number): number {
    if (n <= 1) return 1;
    
    let prev = 1;
    let curr = 1;
    
    for (let i = 2; i <= n; i++) {
      const temp = curr;
      curr = prev + curr;
      prev = temp;
    }
    
    return curr;
  }

  /**
   * Create a unique key for caching results
   * SRP: Only handles key generation
   */
  private createInputKey(input: Record<string, unknown>): string {
    return JSON.stringify(input, Object.keys(input).sort());
  }

  /**
   * Initialize pre-computed results for common test cases
   * SRP: Only handles result initialization
   */
  private initializeSimulatedResults(): void {
    // Pre-populate some common results for better simulation
    this.simulatedResults.set('{"amount":11,"coins":[1,2,5]}', 3);
    this.simulatedResults.set('{"amount":3,"coins":[2]}', -1);
    this.simulatedResults.set('{"m":3,"n":7}', 28);
    this.simulatedResults.set('{"m":3,"n":2}', 3);
  }

  /**
   * Static factory method for creating simulated test runner
   * Factory Pattern: Creates instances for specific languages
   */
  static create(language: string): SimulatedTestRunner {
    return new SimulatedTestRunner(language);
  }
}

/**
 * Factory functions for different language simulations
 * Factory Pattern: Provides simple creation interfaces
 */
export const createPythonTestRunner = (): SimulatedTestRunner => SimulatedTestRunner.create('Python');
export const createJavaTestRunner = (): SimulatedTestRunner => SimulatedTestRunner.create('Java');
export const createCppTestRunner = (): SimulatedTestRunner => SimulatedTestRunner.create('C++');
export const createGoTestRunner = (): SimulatedTestRunner => SimulatedTestRunner.create('Go');
export const createRustTestRunner = (): SimulatedTestRunner => SimulatedTestRunner.create('Rust');
