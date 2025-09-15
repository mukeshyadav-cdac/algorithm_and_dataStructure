import { TestCase, TestResult } from '../../types';
import { BaseTestRunner } from './BaseTestRunner';

/**
 * Simulated test runner for display-only languages (Python, Java, Go, Ruby)
 */
export class SimulatedTestRunner extends BaseTestRunner {
  constructor(languageName: string, algorithmId: string) {
    super(languageName, algorithmId);
  }

  canExecute(): boolean {
    return false; // Cannot actually execute code
  }

  getLanguageName(): string {
    return this.languageName;
  }

  protected async prepareCode(code: string): Promise<string> {
    // No actual preparation needed for simulated execution
    return code;
  }

  protected async executeTestCase(_preparedCode: string, testCase: TestCase): Promise<TestResult> {
    // Simulate a test execution result
    return this.createFailedResult(
      testCase, 
      `${this.languageName} execution not supported in browser. This is for educational display only.`
    );
  }

  /**
   * Simulate test execution with educational information
   */
  async execute(code: string, testCases: TestCase[]): Promise<TestResult[]> {
    this.validateInput(code, testCases);
    
    // Return educational results for all test cases
    return testCases.map(testCase => ({
      passed: false,
      actual: null,
      expected: testCase.expected,
      error: this.getEducationalMessage()
    }));
  }

  /**
   * Gets language-specific educational message
   */
  private getEducationalMessage(): string {
    const baseMessage = `${this.languageName} execution not supported in browser.`;
    
    const languageSpecificMessages: Record<string, string> = {
      'Python': 'To run Python code, you would need a Python interpreter. Consider using Pyodide for browser-based Python execution.',
      'Java': 'Java requires compilation and a JVM. Consider using services like Judge0 API for server-side execution.',
      'Go': 'Go requires compilation. You could use Go Playground API or compile to WebAssembly.',
      'Ruby': 'Ruby requires a Ruby interpreter. Consider using Opal.rb for browser-based Ruby execution.',
      'C++': 'C++ requires compilation. Consider using Emscripten to compile to WebAssembly.',
      'Rust': 'Rust requires compilation. Consider using wasm-pack to compile to WebAssembly.'
    };

    const specificMessage = languageSpecificMessages[this.languageName];
    return specificMessage ? `${baseMessage} ${specificMessage}` : `${baseMessage} This is for educational display only.`;
  }

  /**
   * Provides information about how to enable execution for this language
   */
  getExecutionInfo(): string {
    return this.getEducationalMessage();
  }

  /**
   * Simulates execution metrics for educational purposes
   */
  getSimulatedMetrics(): {
    estimatedComplexity: string;
    languageNotes: string;
  } {
    const complexityNotes: Record<string, { complexity: string; notes: string }> = {
      'Python': {
        complexity: 'Similar to JavaScript but potentially slower due to interpretation',
        notes: 'Python offers clean syntax and rich data structures, but may have higher memory usage.'
      },
      'Java': {
        complexity: 'Generally faster than interpreted languages after JIT compilation',
        notes: 'Java provides strong typing and memory management but requires more verbose syntax.'
      },
      'Go': {
        complexity: 'Compiled language with good performance characteristics',
        notes: 'Go offers fast compilation and execution with built-in concurrency features.'
      },
      'Ruby': {
        complexity: 'Interpreted language, similar performance to Python',
        notes: 'Ruby emphasizes developer happiness with elegant syntax but may be slower for CPU-intensive tasks.'
      }
    };

    const info = complexityNotes[this.languageName] || {
      complexity: 'Performance characteristics vary by implementation',
      notes: 'Each language has its own trade-offs in terms of performance, readability, and ecosystem.'
    };

    return {
      estimatedComplexity: info.complexity,
      languageNotes: info.notes
    };
  }
}
