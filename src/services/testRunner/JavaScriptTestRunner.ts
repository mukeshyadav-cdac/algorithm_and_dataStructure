import { TestCase, TestResult } from '@/types';
import { BaseTestRunner } from './BaseTestRunner';

/**
 * JavaScript test runner implementation
 * Strategy Pattern: Specific strategy for JavaScript code execution
 * Single Responsibility: Only handles JavaScript code execution
 */
export class JavaScriptTestRunner extends BaseTestRunner {
  /**
   * Validate JavaScript code syntax and safety
   * SRP: Only validates JavaScript-specific concerns
   */
  protected async validateCode(code: string): Promise<{ valid: boolean; error?: string }> {
    try {
      // Basic syntax validation using Function constructor
      new Function(code);
      
      // Check for dangerous patterns
      const dangerousPatterns = [
        /eval\s*\(/,
        /Function\s*\(/,
        /window\./,
        /document\./,
        /global\./,
        /process\./,
        /require\s*\(/,
        /import\s+/,
        /export\s+/,
      ];
      
      for (const pattern of dangerousPatterns) {
        if (pattern.test(code)) {
          return {
            valid: false,
            error: `Potentially unsafe code detected: ${pattern.source}`,
          };
        }
      }
      
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Syntax error',
      };
    }
  }

  /**
   * Prepare JavaScript execution context
   * SRP: Only sets up JavaScript execution environment
   */
  protected async prepareExecutionContext(code: string): Promise<Function> {
    try {
      // Create a safe execution context
      const wrappedCode = this.wrapCode(code);
      const compiledFunction = new Function('testInput', wrappedCode);
      return compiledFunction;
    } catch (error) {
      throw new Error(`Failed to prepare execution context: ${error}`);
    }
  }

  /**
   * Execute a single JavaScript test case
   * SRP: Only handles JavaScript test case execution
   */
  protected async executeTestCase(context: Function, testCase: TestCase): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      const result = await this.withTimeout(
        this.executeWithContext(context, testCase.input),
        this.timeout
      );
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      const passed = this.compareResults(testCase.expected, result);
      
      return {
        passed,
        expected: testCase.expected,
        actual: result,
        description: testCase.description,
        executionTime,
      };
    } catch (error) {
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      return {
        passed: false,
        expected: testCase.expected,
        actual: null,
        description: testCase.description,
        executionTime,
        error: error instanceof Error ? error.message : 'Execution error',
      };
    }
  }

  /**
   * Cleanup JavaScript execution context
   * SRP: Only handles JavaScript context cleanup
   */
  protected async cleanupExecutionContext(_context: Function): Promise<void> {
    // No cleanup needed for JavaScript functions
  }

  /**
   * Execute code with specific input in a controlled context
   * SRP: Only handles the actual code execution
   */
  private async executeWithContext(compiledFunction: Function, input: Record<string, unknown>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        // Set up execution timeout
        const timeoutId = setTimeout(() => {
          reject(new Error('Execution timed out'));
        }, this.maxExecutionTime);

        // Execute the function
        const result = compiledFunction(input);
        
        clearTimeout(timeoutId);
        
        // Handle both sync and async results
        if (result instanceof Promise) {
          result.then(resolve).catch(reject);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Wrap user code in a safe execution wrapper
   * SRP: Only handles code wrapping logic
   */
  private wrapCode(code: string): string {
    // Extract function name from different patterns
    const functionPatterns = [
      /function\s+(\w+)/,
      /const\s+(\w+)\s*=/,
      /let\s+(\w+)\s*=/,
      /var\s+(\w+)\s*=/,
    ];
    
    let functionName = null;
    for (const pattern of functionPatterns) {
      const match = code.match(pattern);
      if (match) {
        functionName = match[1];
        break;
      }
    }
    
    if (!functionName) {
      // Try to detect arrow function assignment
      const arrowMatch = code.match(/(\w+)\s*=\s*\([^)]*\)\s*=>/);
      if (arrowMatch) {
        functionName = arrowMatch[1];
      }
    }
    
    if (!functionName) {
      throw new Error('Could not detect function name. Please define your function with a clear name.');
    }
    
    // Wrap the code to make it executable with test input
    return `
      ${code}
      
      // Extract parameters from testInput and call the function
      const params = Object.values(testInput);
      return ${functionName}.apply(null, params);
    `;
  }

  /**
   * Static factory method for creating JavaScript test runner
   * Factory Pattern: Creates instances with proper configuration
   */
  static create(): JavaScriptTestRunner {
    return new JavaScriptTestRunner(5000, 1000);
  }
}

/**
 * Factory function for JavaScript test runner
 * Factory Pattern: Provides a simple creation interface
 */
export const createJavaScriptTestRunner = (): JavaScriptTestRunner => {
  return JavaScriptTestRunner.create();
};
