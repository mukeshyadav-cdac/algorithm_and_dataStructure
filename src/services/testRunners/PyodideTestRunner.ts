import { TestCase, TestResult } from '../../types';
import { BaseTestRunner } from './BaseTestRunner';

/**
 * Pyodide Python Test Runner
 * Enables real Python execution in the browser using Pyodide
 */
export class PyodideTestRunner extends BaseTestRunner {
  private pyodideInstance: any = null;
  private isLoading = false;

  constructor(algorithmId: string) {
    super('Python', algorithmId);
  }

  canExecute(): boolean {
    return this.pyodideInstance !== null || this.isLoading;
  }

  getLanguageName(): string {
    return 'Python (Pyodide)';
  }

  /**
   * Loads Pyodide runtime if not already loaded
   */
  private async loadPyodide(): Promise<void> {
    if (this.pyodideInstance) return;
    if (this.isLoading) {
      // Wait for loading to complete
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.isLoading = true;
    
    try {
      // Check if Pyodide is available globally
      if (!(window as any).loadPyodide) {
        throw new Error('Pyodide not loaded. Please include: <script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></script>');
      }

      console.log('Loading Pyodide...');
      this.pyodideInstance = await (window as any).loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
      });

      // Install common packages that might be useful
      await this.pyodideInstance.loadPackage(['numpy']);
      
      console.log('Pyodide loaded successfully!');
    } catch (error) {
      console.error('Failed to load Pyodide:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  protected async prepareCode(code: string): Promise<string> {
    await this.loadPyodide();
    
    // Validate Python syntax
    try {
      this.pyodideInstance.runPython(`
import ast
import sys
try:
    ast.parse('''${code.replace(/'/g, "\\'")}''')
except SyntaxError as e:
    raise SyntaxError(f"Python syntax error: {e}")
      `);
    } catch (error: any) {
      throw new Error(`Python syntax validation failed: ${error.message}`);
    }

    return code;
  }

  protected async executeTestCase(preparedCode: string, testCase: TestCase): Promise<TestResult> {
    const startTime = performance.now();

    try {
      // Setup the Python environment
      this.pyodideInstance.runPython(`
import json
import sys
from io import StringIO

# Define the algorithm function
${preparedCode}
      `);

      let actual: any;

      // Execute based on algorithm type
      switch (this.algorithmId) {
        case 'uniquePaths':
          actual = this.pyodideInstance.runPython(`
result = unique_paths(${testCase.input.m}, ${testCase.input.n})
result
          `);
          break;

        case 'coinChange':
          const coinsStr = JSON.stringify(testCase.input.coins);
          actual = this.pyodideInstance.runPython(`
result = coin_change(${coinsStr}, ${testCase.input.amount})
result
          `);
          break;

        case 'lis':
          const numsStr = JSON.stringify(testCase.input.nums);
          actual = this.pyodideInstance.runPython(`
result = length_of_lis(${numsStr})
result
          `);
          break;

        case 'knapsack':
          const weightsStr = JSON.stringify(testCase.input.weights);
          const valuesStr = JSON.stringify(testCase.input.values);
          actual = this.pyodideInstance.runPython(`
result = knapsack(${weightsStr}, ${valuesStr}, ${testCase.input.capacity})
result
          `);
          break;

        case 'minPathSum':
          const gridStr = JSON.stringify(testCase.input.grid);
          actual = this.pyodideInstance.runPython(`
result = min_path_sum(${gridStr})
result
          `);
          break;

        default:
          throw new Error(`Unsupported algorithm: ${this.algorithmId}`);
      }

      const executionTime = performance.now() - startTime;
      return this.createSuccessfulResult(testCase, actual, executionTime);

    } catch (error: any) {
      return this.createFailedResult(testCase, `Python execution error: ${error.message}`);
    }
  }

  /**
   * Get Pyodide installation instructions
   */
  static getInstallationInstructions(): string {
    return `
To enable Python execution with Pyodide, add this to your HTML:

<script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></script>

Or install via npm:
npm install pyodide

Then load it in your application before using Python algorithms.
    `.trim();
  }

  /**
   * Check if Pyodide is available
   */
  static isAvailable(): boolean {
    return typeof (window as any).loadPyodide !== 'undefined';
  }
}
