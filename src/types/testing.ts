import { TestCase, TestResult } from './algorithm';

// Test runner interface following Strategy Pattern
export interface ITestRunner {
  execute(code: string, testCases: TestCase[]): Promise<TestResult[]>;
  canExecute(): boolean;
  getLanguageName(): string;
}

// Test runner factory interface
export interface ITestRunnerFactory {
  createRunner(languageName: string, algorithmId: string): ITestRunner;
  getSupportedLanguages(): string[];
}

// Test execution context
export interface TestExecutionContext {
  algorithmId: string;
  languageName: string;
  code: string;
  testCases: TestCase[];
  timeout?: number;
}

// Test runner configuration
export interface TestRunnerConfig {
  timeout: number;
  maxRetries: number;
  enablePerformanceTracking: boolean;
}

// Performance metrics for test execution
export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage?: number;
  cpuUsage?: number;
}
