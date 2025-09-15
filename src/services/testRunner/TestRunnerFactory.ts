import { BaseTestRunner } from './BaseTestRunner';
import { JavaScriptTestRunner } from './JavaScriptTestRunner';
import { SimulatedTestRunner } from './SimulatedTestRunner';

/**
 * Test runner factory following Factory Pattern and Strategy Pattern
 * Factory Pattern: Creates test runners based on language
 * Strategy Pattern: Different test runners are different strategies
 * Single Responsibility: Only responsible for creating test runners
 */
export class TestRunnerFactory {
  private static readonly supportedLanguages = new Map<string, () => BaseTestRunner>([
    ['javascript', () => JavaScriptTestRunner.create()],
    ['js', () => JavaScriptTestRunner.create()],
    ['typescript', () => JavaScriptTestRunner.create()], // TypeScript can run as JS
    ['ts', () => JavaScriptTestRunner.create()],
    ['python', () => SimulatedTestRunner.create('Python')],
    ['py', () => SimulatedTestRunner.create('Python')],
    ['java', () => SimulatedTestRunner.create('Java')],
    ['cpp', () => SimulatedTestRunner.create('C++')],
    ['c++', () => SimulatedTestRunner.create('C++')],
    ['go', () => SimulatedTestRunner.create('Go')],
    ['rust', () => SimulatedTestRunner.create('Rust')],
    ['rs', () => SimulatedTestRunner.create('Rust')],
  ]);

  /**
   * Create test runner for specific language
   * Factory Method: Creates appropriate test runner based on language
   */
  static createRunner(language: string): BaseTestRunner {
    const normalizedLanguage = language.toLowerCase().trim();
    const factory = this.supportedLanguages.get(normalizedLanguage);
    
    if (!factory) {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    return factory();
  }

  /**
   * Check if language is supported
   * SRP: Only checks language support
   */
  static isLanguageSupported(language: string): boolean {
    const normalizedLanguage = language.toLowerCase().trim();
    return this.supportedLanguages.has(normalizedLanguage);
  }

  /**
   * Get all supported languages
   * SRP: Only returns supported languages list
   */
  static getSupportedLanguages(): string[] {
    return Array.from(this.supportedLanguages.keys());
  }

  /**
   * Get language capabilities
   * SRP: Only provides language capability information
   */
  static getLanguageCapabilities(language: string): {
    canExecute: boolean;
    runtimeStatus: 'ready' | 'simulated' | 'not_supported';
    description: string;
  } {
    const normalizedLanguage = language.toLowerCase().trim();
    
    if (!this.supportedLanguages.has(normalizedLanguage)) {
      return {
        canExecute: false,
        runtimeStatus: 'not_supported',
        description: 'Language not supported',
      };
    }
    
    // JavaScript and TypeScript can be executed
    if (['javascript', 'js', 'typescript', 'ts'].includes(normalizedLanguage)) {
      return {
        canExecute: true,
        runtimeStatus: 'ready',
        description: 'Fully executable in browser',
      };
    }
    
    // Other languages are simulated
    return {
      canExecute: false,
      runtimeStatus: 'simulated',
      description: 'Simulated execution with realistic results',
    };
  }

  /**
   * Register a new language support
   * Open/Closed Principle: Open for extension without modifying existing code
   */
  static registerLanguage(language: string, runnerFactory: () => BaseTestRunner): void {
    const normalizedLanguage = language.toLowerCase().trim();
    this.supportedLanguages.set(normalizedLanguage, runnerFactory);
  }

  /**
   * Remove language support
   * SRP: Only handles language removal
   */
  static unregisterLanguage(language: string): boolean {
    const normalizedLanguage = language.toLowerCase().trim();
    return this.supportedLanguages.delete(normalizedLanguage);
  }
}

/**
 * Convenience function for creating test runners
 * Facade Pattern: Provides simple interface to the factory
 */
export const createTestRunner = (language: string): BaseTestRunner => {
  return TestRunnerFactory.createRunner(language);
};

/**
 * Type guard for test runner validation
 * SRP: Only handles type validation
 */
export const isValidTestRunner = (runner: unknown): runner is BaseTestRunner => {
  return runner instanceof BaseTestRunner;
};

/**
 * Language runtime information interface
 * ISP: Separate interface for runtime information
 */
export interface LanguageRuntimeInfo {
  name: string;
  extensions: string[];
  canExecute: boolean;
  runtimeStatus: 'ready' | 'simulated' | 'not_supported';
  description: string;
  features: string[];
}

/**
 * Get comprehensive runtime information for all languages
 * SRP: Only provides runtime information
 */
export const getLanguageRuntimeInfo = (): LanguageRuntimeInfo[] => {
  const languages: LanguageRuntimeInfo[] = [
    {
      name: 'JavaScript',
      extensions: ['js'],
      canExecute: true,
      runtimeStatus: 'ready',
      description: 'Fully executable JavaScript with real-time testing',
      features: ['Real execution', 'Syntax validation', 'Performance measurement'],
    },
    {
      name: 'TypeScript',
      extensions: ['ts'],
      canExecute: true,
      runtimeStatus: 'ready',
      description: 'TypeScript transpiled to JavaScript for execution',
      features: ['Type checking', 'Real execution', 'ES6+ features'],
    },
    {
      name: 'Python',
      extensions: ['py'],
      canExecute: false,
      runtimeStatus: 'simulated',
      description: 'Simulated Python execution with algorithm-specific logic',
      features: ['Syntax validation', 'Realistic results', 'Algorithm simulation'],
    },
    {
      name: 'Java',
      extensions: ['java'],
      canExecute: false,
      runtimeStatus: 'simulated',
      description: 'Simulated Java execution with object-oriented patterns',
      features: ['Basic syntax validation', 'Realistic results', 'OOP examples'],
    },
    {
      name: 'C++',
      extensions: ['cpp', 'cc', 'cxx'],
      canExecute: false,
      runtimeStatus: 'simulated',
      description: 'Simulated C++ execution with performance-oriented examples',
      features: ['Memory management examples', 'STL usage', 'Performance patterns'],
    },
    {
      name: 'Go',
      extensions: ['go'],
      canExecute: false,
      runtimeStatus: 'simulated',
      description: 'Simulated Go execution with concurrent programming patterns',
      features: ['Goroutine examples', 'Channel usage', 'Performance focus'],
    },
    {
      name: 'Rust',
      extensions: ['rs'],
      canExecute: false,
      runtimeStatus: 'simulated',
      description: 'Simulated Rust execution with memory safety examples',
      features: ['Memory safety', 'Zero-cost abstractions', 'Performance'],
    },
  ];

  return languages;
};
