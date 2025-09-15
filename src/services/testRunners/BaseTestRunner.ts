import { TestCase, TestResult, ITestRunner } from '../../types';

/**
 * Abstract base class for test runners implementing Template Method pattern
 */
export abstract class BaseTestRunner implements ITestRunner {
  protected languageName: string;
  protected algorithmId: string;

  constructor(languageName: string, algorithmId: string) {
    this.languageName = languageName;
    this.algorithmId = algorithmId;
  }

  /**
   * Template method that defines the test execution workflow
   */
  async execute(code: string, testCases: TestCase[]): Promise<TestResult[]> {
    this.validateInput(code, testCases);
    
    const results: TestResult[] = [];
    
    try {
      const preparedCode = await this.prepareCode(code);
      
      for (const testCase of testCases) {
        const result = await this.executeTestCase(preparedCode, testCase);
        results.push(result);
      }
    } catch (error: any) {
      // If code preparation fails, mark all tests as failed
      testCases.forEach(testCase => {
        results.push(this.createFailedResult(testCase, error.message));
      });
    }
    
    return results;
  }

  /**
   * Validates input parameters
   */
  protected validateInput(code: string, testCases: TestCase[]): void {
    if (!code || code.trim().length === 0) {
      throw new Error('Code cannot be empty');
    }
    
    if (!testCases || testCases.length === 0) {
      throw new Error('Test cases cannot be empty');
    }
  }

  /**
   * Creates a failed test result
   */
  protected createFailedResult(testCase: TestCase, error: string): TestResult {
    return {
      passed: false,
      actual: null,
      expected: testCase.expected,
      error
    };
  }

  /**
   * Creates a successful test result
   */
  protected createSuccessfulResult(
    testCase: TestCase, 
    actual: any, 
    executionTime?: number
  ): TestResult {
    return {
      passed: JSON.stringify(actual) === JSON.stringify(testCase.expected),
      actual,
      expected: testCase.expected,
      executionTime
    };
  }

  // Abstract methods to be implemented by concrete classes
  abstract canExecute(): boolean;
  abstract getLanguageName(): string;
  protected abstract prepareCode(code: string): Promise<string>;
  protected abstract executeTestCase(preparedCode: string, testCase: TestCase): Promise<TestResult>;
}
