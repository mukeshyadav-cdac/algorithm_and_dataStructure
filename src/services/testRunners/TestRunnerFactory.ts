import { ITestRunner, ITestRunnerFactory } from '../../types';
import { JavaScriptTestRunner } from './JavaScriptTestRunner';
import { TypeScriptTestRunner } from './TypeScriptTestRunner';
import { SimulatedTestRunner } from './SimulatedTestRunner';

/**
 * Factory for creating test runners based on language and algorithm
 * Implements Factory Pattern
 */
export class TestRunnerFactory implements ITestRunnerFactory {
  private static instance: TestRunnerFactory;
  
  // Registry of supported languages and their runner types
  private readonly supportedLanguages: Record<string, 'executable' | 'simulated'> = {
    'JavaScript': 'executable',
    'TypeScript': 'executable',
    'Python': 'simulated',
    'Java': 'simulated',
    'Go': 'simulated',
    'Ruby': 'simulated',
    'C++': 'simulated',
    'Rust': 'simulated'
  };

  /**
   * Singleton pattern implementation
   */
  static getInstance(): TestRunnerFactory {
    if (!TestRunnerFactory.instance) {
      TestRunnerFactory.instance = new TestRunnerFactory();
    }
    return TestRunnerFactory.instance;
  }

  private constructor() {}

  /**
   * Creates appropriate test runner based on language
   */
  createRunner(languageName: string, algorithmId: string): ITestRunner {
    const runnerType = this.supportedLanguages[languageName];
    
    if (!runnerType) {
      throw new Error(`Unsupported language: ${languageName}`);
    }

    switch (runnerType) {
      case 'executable':
        return this.createExecutableRunner(languageName, algorithmId);
      case 'simulated':
        return new SimulatedTestRunner(languageName, algorithmId);
      default:
        throw new Error(`Unknown runner type for language: ${languageName}`);
    }
  }

  /**
   * Creates executable test runner for supported languages
   */
  private createExecutableRunner(languageName: string, algorithmId: string): ITestRunner {
    switch (languageName) {
      case 'JavaScript':
        return new JavaScriptTestRunner(algorithmId);
      case 'TypeScript':
        return new TypeScriptTestRunner(algorithmId);
      default:
        throw new Error(`No executable runner available for: ${languageName}`);
    }
  }

  /**
   * Gets list of all supported languages
   */
  getSupportedLanguages(): string[] {
    return Object.keys(this.supportedLanguages);
  }

  /**
   * Gets list of executable languages
   */
  getExecutableLanguages(): string[] {
    return Object.entries(this.supportedLanguages)
      .filter(([, type]) => type === 'executable')
      .map(([language]) => language);
  }

  /**
   * Gets list of simulated (display-only) languages
   */
  getSimulatedLanguages(): string[] {
    return Object.entries(this.supportedLanguages)
      .filter(([, type]) => type === 'simulated')
      .map(([language]) => language);
  }

  /**
   * Checks if a language is supported
   */
  isLanguageSupported(languageName: string): boolean {
    return languageName in this.supportedLanguages;
  }

  /**
   * Checks if a language can be executed (not just displayed)
   */
  canExecuteLanguage(languageName: string): boolean {
    return this.supportedLanguages[languageName] === 'executable';
  }

  /**
   * Gets language capabilities
   */
  getLanguageCapabilities(languageName: string): {
    canExecute: boolean;
    runnerType: 'executable' | 'simulated' | 'unknown';
    features: string[];
  } {
    const runnerType = this.supportedLanguages[languageName] || 'unknown';
    const canExecute = runnerType === 'executable';
    
    const features: string[] = [];
    if (canExecute) {
      features.push('Real-time execution', 'Performance metrics', 'Error reporting');
    } else {
      features.push('Syntax display', 'Educational examples', 'Code comparison');
    }

    return {
      canExecute,
      runnerType,
      features
    };
  }

  /**
   * Registers a new language (for future extensibility)
   */
  registerLanguage(
    languageName: string, 
    runnerType: 'executable' | 'simulated',
    runnerFactory?: (algorithmId: string) => ITestRunner
  ): void {
    if (this.isLanguageSupported(languageName)) {
      console.warn(`Language ${languageName} is already registered. Overwriting...`);
    }
    
    this.supportedLanguages[languageName] = runnerType;
    
    if (runnerFactory && runnerType === 'executable') {
      // In a more advanced implementation, we could store custom factory functions
      console.log(`Registered custom runner factory for ${languageName}`);
    }
  }
}
