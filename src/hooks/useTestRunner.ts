import { useState, useCallback } from 'react';
import { Algorithm, TestResult, Language } from '../types';
import { AlgorithmService } from '../services/AlgorithmService';

/**
 * Custom hook for managing test execution
 * Implements Observer pattern for test result updates
 */
export const useTestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<number>(-1);
  const [error, setError] = useState<string | null>(null);

  const algorithmService = new AlgorithmService();

  /**
   * Runs tests for an algorithm
   */
  const runTests = useCallback(async (
    algorithm: Algorithm,
    language: Language,
    customCode: string,
    onProgress?: (current: number, total: number) => void,
    onComplete?: (results: TestResult[]) => void,
    onError?: (error: Error) => void
  ) => {
    setIsRunning(true);
    setError(null);
    setTestResults([]);
    setCurrentTest(0);

    try {
      // Validate inputs
      if (!algorithm || !language || !customCode.trim()) {
        throw new Error('Invalid test parameters');
      }

      onProgress?.(0, algorithm.testCases.length);

      // Run tests through the service
      const results = await algorithmService.runTests(
        algorithm,
        language.name,
        customCode
      );

      setTestResults(results);
      setCurrentTest(-1);
      onProgress?.(algorithm.testCases.length, algorithm.testCases.length);
      onComplete?.(results);

    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    } finally {
      setIsRunning(false);
    }
  }, [algorithmService]);

  /**
   * Runs a single test case
   */
  const runSingleTest = useCallback(async (
    algorithm: Algorithm,
    language: Language,
    customCode: string,
    testIndex: number
  ): Promise<TestResult | null> => {
    if (testIndex < 0 || testIndex >= algorithm.testCases.length) {
      return null;
    }

    try {
      setCurrentTest(testIndex);
      
      // Create a single test case array
      const singleTestCase = [algorithm.testCases[testIndex]];
      
      const results = await algorithmService.runTests(
        algorithm,
        language.name,
        customCode
      );

      return results[0] || null;
    } catch (error) {
      return {
        passed: false,
        actual: null,
        expected: algorithm.testCases[testIndex].expected,
        error: (error as Error).message
      };
    } finally {
      setCurrentTest(-1);
    }
  }, [algorithmService]);

  /**
   * Validates code before running tests
   */
  const validateCode = useCallback(async (
    code: string,
    language: Language
  ): Promise<{ isValid: boolean; errors: string[] }> => {
    const errors: string[] = [];

    // Basic validation
    if (!code || code.trim().length === 0) {
      errors.push('Code cannot be empty');
    }

    // Language-specific validation
    switch (language.name) {
      case 'JavaScript':
        if (!code.includes('function') && !code.includes('=>')) {
          errors.push('JavaScript code must contain a function');
        }
        // Try to create function to check syntax
        try {
          new Function('return ' + code);
        } catch (error) {
          errors.push(`JavaScript syntax error: ${(error as Error).message}`);
        }
        break;

      case 'TypeScript':
        if (!code.includes('function') && !code.includes('=>')) {
          errors.push('TypeScript code must contain a function');
        }
        // Basic TypeScript validation could be added here
        break;

      default:
        // For simulated languages, just check basic structure
        if (code.length < 10) {
          errors.push('Code appears too short to be a valid implementation');
        }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  /**
   * Gets test execution statistics
   */
  const getTestStats = useCallback(() => {
    const totalTests = testResults.length;
    const passedTests = testResults.filter(result => result.passed).length;
    const failedTests = totalTests - passedTests;
    
    const avgExecutionTime = testResults
      .filter(result => result.executionTime !== undefined)
      .reduce((sum, result) => sum + (result.executionTime || 0), 0) / totalTests;

    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      passRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
      avgExecutionTime: avgExecutionTime || 0
    };
  }, [testResults]);

  /**
   * Filters test results by status
   */
  const filterTestResults = useCallback((
    status: 'all' | 'passed' | 'failed'
  ) => {
    switch (status) {
      case 'passed':
        return testResults.filter(result => result.passed);
      case 'failed':
        return testResults.filter(result => !result.passed);
      default:
        return testResults;
    }
  }, [testResults]);

  /**
   * Clears test results
   */
  const clearResults = useCallback(() => {
    setTestResults([]);
    setError(null);
    setCurrentTest(-1);
  }, []);

  /**
   * Cancels running tests (if possible)
   */
  const cancelTests = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      setCurrentTest(-1);
      setError('Test execution was cancelled');
    }
  }, [isRunning]);

  /**
   * Exports test results in various formats
   */
  const exportResults = useCallback((
    format: 'json' | 'csv' | 'text' = 'json'
  ) => {
    const stats = getTestStats();
    
    switch (format) {
      case 'json':
        return JSON.stringify({
          statistics: stats,
          results: testResults,
          timestamp: new Date().toISOString()
        }, null, 2);

      case 'csv':
        const headers = 'Test,Status,Expected,Actual,Error,ExecutionTime';
        const rows = testResults.map((result, index) => 
          `Test${index + 1},${result.passed ? 'PASS' : 'FAIL'},${JSON.stringify(result.expected)},${JSON.stringify(result.actual)},${result.error || ''},${result.executionTime || ''}`
        );
        return [headers, ...rows].join('\n');

      case 'text':
        return `Test Results Summary
Total Tests: ${stats.total}
Passed: ${stats.passed}
Failed: ${stats.failed}
Pass Rate: ${stats.passRate.toFixed(1)}%
Average Execution Time: ${stats.avgExecutionTime.toFixed(2)}ms

${testResults.map((result, index) => 
  `Test ${index + 1}: ${result.passed ? 'PASS' : 'FAIL'} - Expected: ${JSON.stringify(result.expected)}, Actual: ${JSON.stringify(result.actual)}`
).join('\n')}`;

      default:
        return '';
    }
  }, [testResults, getTestStats]);

  return {
    // State
    isRunning,
    testResults,
    currentTest,
    error,

    // Core functions
    runTests,
    runSingleTest,
    validateCode,
    clearResults,
    cancelTests,

    // Utilities
    getTestStats,
    filterTestResults,
    exportResults
  };
};
