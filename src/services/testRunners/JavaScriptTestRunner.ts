import { TestCase, TestResult } from '../../types';
import { BaseTestRunner } from './BaseTestRunner';

/**
 * JavaScript test runner that can actually execute JavaScript code
 */
export class JavaScriptTestRunner extends BaseTestRunner {
  constructor(algorithmId: string) {
    super('JavaScript', algorithmId);
  }

  canExecute(): boolean {
    return true;
  }

  getLanguageName(): string {
    return this.languageName;
  }

  protected async prepareCode(code: string): Promise<string> {
    // Validate JavaScript syntax by trying to create a function
    try {
      new Function('return ' + code);
      return code;
    } catch (error: any) {
      throw new Error(`JavaScript syntax error: ${error.message}`);
    }
  }

  protected async executeTestCase(preparedCode: string, testCase: TestCase): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      // Create and execute the function
      const func = new Function('return ' + preparedCode)();
      
      let actual;
      
      // Call function based on algorithm type
      switch (this.algorithmId) {
        case 'uniquePaths':
          actual = func(testCase.input.m, testCase.input.n);
          break;
        case 'coinChange':
          actual = func(testCase.input.coins, testCase.input.amount);
          break;
        case 'lis':
          actual = func(testCase.input.nums);
          break;
        case 'knapsack':
          actual = func(testCase.input.weights, testCase.input.values, testCase.input.capacity);
          break;
        case 'minPathSum':
          actual = func(testCase.input.grid);
          break;
        default:
          // Generic fallback - spread all input values as arguments
          actual = func(...Object.values(testCase.input));
          break;
      }
      
      const executionTime = performance.now() - startTime;
      
      return this.createSuccessfulResult(testCase, actual, executionTime);
      
    } catch (error: any) {
      return this.createFailedResult(testCase, `Runtime error: ${error.message}`);
    }
  }

  /**
   * Validates that the code contains a function
   */
  protected validateFunctionCode(code: string): void {
    if (!code.includes('function') && !code.includes('=>')) {
      throw new Error('Code must contain a function definition');
    }
  }
}
