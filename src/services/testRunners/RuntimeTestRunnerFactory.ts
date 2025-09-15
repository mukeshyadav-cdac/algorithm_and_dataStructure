import { ITestRunner, ITestRunnerFactory } from '../../types';
import { JavaScriptTestRunner } from './JavaScriptTestRunner';
import { TypeScriptTestRunner } from './TypeScriptTestRunner';
import { SimulatedTestRunner } from './SimulatedTestRunner';
import { PyodideTestRunner } from './PyodideTestRunner';
import { OpalTestRunner } from './OpalTestRunner';
import { TinyGoWasmTestRunner } from './TinyGoWasmTestRunner';
import { BlazorWasmTestRunner } from './BlazorWasmTestRunner';

/**
 * Enhanced Test Runner Factory with Runtime Detection
 * Automatically detects available runtimes and creates appropriate runners
 */
export class RuntimeTestRunnerFactory implements ITestRunnerFactory {
  private static instance: RuntimeTestRunnerFactory;
  private runtimeCache = new Map<string, boolean>();

  // Language configurations with runtime requirements
  private readonly languageConfigs: Record<string, {
    preferred: 'executable' | 'simulated';
    runtimeChecker: () => boolean;
    executableRunner: (algorithmId: string) => ITestRunner;
    fallbackRunner: (algorithmId: string) => ITestRunner;
  }> = {
    'JavaScript': {
      preferred: 'executable',
      runtimeChecker: () => true, // Always available
      executableRunner: (id) => new JavaScriptTestRunner(id),
      fallbackRunner: (id) => new SimulatedTestRunner('JavaScript', id)
    },
    'TypeScript': {
      preferred: 'executable', 
      runtimeChecker: () => true, // Always available (transpiled to JS)
      executableRunner: (id) => new TypeScriptTestRunner(id),
      fallbackRunner: (id) => new SimulatedTestRunner('TypeScript', id)
    },
    'Python': {
      preferred: 'executable',
      runtimeChecker: () => PyodideTestRunner.isAvailable(),
      executableRunner: (id) => new PyodideTestRunner(id),
      fallbackRunner: (id) => new SimulatedTestRunner('Python', id)
    },
    'Ruby': {
      preferred: 'executable',
      runtimeChecker: () => OpalTestRunner.isAvailable(),
      executableRunner: (id) => new OpalTestRunner(id),
      fallbackRunner: (id) => new SimulatedTestRunner('Ruby', id)
    },
    'Go': {
      preferred: 'executable',
      runtimeChecker: () => TinyGoWasmTestRunner.isAvailable(),
      executableRunner: (id) => new TinyGoWasmTestRunner(id),
      fallbackRunner: (id) => new SimulatedTestRunner('Go', id)
    },
    'C#': {
      preferred: 'executable',
      runtimeChecker: () => BlazorWasmTestRunner.isAvailable(),
      executableRunner: (id) => new BlazorWasmTestRunner(id),
      fallbackRunner: (id) => new SimulatedTestRunner('C#', id)
    },
    'Java': {
      preferred: 'simulated', // No Java WASM runtime implemented yet
      runtimeChecker: () => false,
      executableRunner: (id) => new SimulatedTestRunner('Java', id),
      fallbackRunner: (id) => new SimulatedTestRunner('Java', id)
    }
  };

  /**
   * Singleton pattern implementation
   */
  static getInstance(): RuntimeTestRunnerFactory {
    if (!RuntimeTestRunnerFactory.instance) {
      RuntimeTestRunnerFactory.instance = new RuntimeTestRunnerFactory();
    }
    return RuntimeTestRunnerFactory.instance;
  }

  private constructor() {
    this.detectAvailableRuntimes();
  }

  /**
   * Creates appropriate test runner based on language and runtime availability
   */
  createRunner(languageName: string, algorithmId: string): ITestRunner {
    const config = this.languageConfigs[languageName];
    
    if (!config) {
      throw new Error(`Unsupported language: ${languageName}`);
    }

    // Check if runtime is available (with caching)
    const isRuntimeAvailable = this.isRuntimeAvailable(languageName);
    
    if (config.preferred === 'executable' && isRuntimeAvailable) {
      console.log(`✅ Creating executable runner for ${languageName}`);
      return config.executableRunner(algorithmId);
    } else {
      console.log(`📚 Creating simulated runner for ${languageName}${config.preferred === 'executable' ? ' (runtime not available)' : ''}`);
      return config.fallbackRunner(algorithmId);
    }
  }

  /**
   * Checks if runtime is available for a language (with caching)
   */
  private isRuntimeAvailable(languageName: string): boolean {
    if (this.runtimeCache.has(languageName)) {
      return this.runtimeCache.get(languageName)!;
    }

    const config = this.languageConfigs[languageName];
    if (!config) return false;

    const isAvailable = config.runtimeChecker();
    this.runtimeCache.set(languageName, isAvailable);
    return isAvailable;
  }

  /**
   * Detects all available runtimes on initialization
   */
  private detectAvailableRuntimes(): void {
    console.log('🔍 Detecting available language runtimes...');
    
    const runtimeStatus: Record<string, { available: boolean; status: string }> = {};
    
    Object.keys(this.languageConfigs).forEach(language => {
      const isAvailable = this.isRuntimeAvailable(language);
      const config = this.languageConfigs[language];
      
      runtimeStatus[language] = {
        available: isAvailable,
        status: isAvailable ? 
          '✅ Executable' : 
          (config.preferred === 'executable' ? '📚 Simulated (Runtime not available)' : '📚 Display Only')
      };
    });

    console.table(runtimeStatus);
    return;
  }

  /**
   * Gets runtime status for all languages
   */
  getRuntimeStatus(): Record<string, {
    available: boolean;
    canExecute: boolean;
    status: string;
    installInstructions?: string;
  }> {
    const status: Record<string, any> = {};
    
    Object.keys(this.languageConfigs).forEach(language => {
      const config = this.languageConfigs[language];
      const isAvailable = this.isRuntimeAvailable(language);
      const canExecute = config.preferred === 'executable' && isAvailable;
      
      status[language] = {
        available: isAvailable,
        canExecute,
        status: canExecute ? 
          '✅ Executable' : 
          (config.preferred === 'executable' ? '⚠️ Runtime Missing' : '📚 Display Only'),
        installInstructions: this.getInstallInstructions(language)
      };
    });
    
    return status;
  }

  /**
   * Gets installation instructions for a language runtime
   */
  private getInstallInstructions(languageName: string): string | undefined {
    switch (languageName) {
      case 'Python':
        return PyodideTestRunner.getInstallationInstructions();
      case 'Ruby':
        return OpalTestRunner.getInstallationInstructions();
      case 'Go':
        return TinyGoWasmTestRunner.getInstallationInstructions();
      case 'C#':
        return BlazorWasmTestRunner.getInstallationInstructions();
      default:
        return undefined;
    }
  }

  /**
   * Forces runtime detection refresh
   */
  refreshRuntimeDetection(): void {
    this.runtimeCache.clear();
    this.detectAvailableRuntimes();
  }

  /**
   * Gets list of all supported languages
   */
  getSupportedLanguages(): string[] {
    return Object.keys(this.languageConfigs);
  }

  /**
   * Gets list of languages that can execute (not just display)
   */
  getExecutableLanguages(): string[] {
    return Object.keys(this.languageConfigs).filter(language => {
      const config = this.languageConfigs[language];
      return config.preferred === 'executable' && this.isRuntimeAvailable(language);
    });
  }

  /**
   * Gets list of simulated (display-only) languages
   */
  getSimulatedLanguages(): string[] {
    return Object.keys(this.languageConfigs).filter(language => {
      const config = this.languageConfigs[language];
      return config.preferred === 'simulated' || !this.isRuntimeAvailable(language);
    });
  }

  /**
   * Checks if a language is supported
   */
  isLanguageSupported(languageName: string): boolean {
    return languageName in this.languageConfigs;
  }

  /**
   * Checks if a language can be executed (not just displayed)
   */
  canExecuteLanguage(languageName: string): boolean {
    const config = this.languageConfigs[languageName];
    return config?.preferred === 'executable' && this.isRuntimeAvailable(languageName);
  }

  /**
   * Gets language capabilities with detailed information
   */
  getLanguageCapabilities(languageName: string): {
    canExecute: boolean;
    runnerType: 'executable' | 'simulated' | 'unknown';
    runtimeStatus: 'available' | 'missing' | 'not_required';
    features: string[];
    installInstructions?: string;
  } {
    const config = this.languageConfigs[languageName];
    
    if (!config) {
      return {
        canExecute: false,
        runnerType: 'unknown',
        runtimeStatus: 'missing',
        features: []
      };
    }

    const isAvailable = this.isRuntimeAvailable(languageName);
    const canExecute = config.preferred === 'executable' && isAvailable;
    
    const features: string[] = [];
    if (canExecute) {
      features.push('Real-time execution', 'Performance metrics', 'Error reporting', 'Interactive debugging');
    } else {
      features.push('Syntax highlighting', 'Educational examples', 'Code comparison', 'Best practices');
    }

    return {
      canExecute,
      runnerType: canExecute ? 'executable' : 'simulated',
      runtimeStatus: config.preferred === 'executable' ? 
        (isAvailable ? 'available' : 'missing') : 'not_required',
      features,
      installInstructions: this.getInstallInstructions(languageName)
    };
  }

  /**
   * Enables runtime for a language (for dynamic loading)
   */
  async enableRuntime(languageName: string): Promise<boolean> {
    const config = this.languageConfigs[languageName];
    if (!config) return false;

    // Clear cache and re-check
    this.runtimeCache.delete(languageName);
    const isAvailable = this.isRuntimeAvailable(languageName);
    
    if (isAvailable) {
      console.log(`✅ Runtime enabled for ${languageName}`);
      return true;
    }
    
    console.warn(`⚠️ Runtime still not available for ${languageName}`);
    return false;
  }
}
