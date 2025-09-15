import { TestCase, TestResult } from '../../types';
import { BaseTestRunner } from './BaseTestRunner';

/**
 * Opal.js Ruby Test Runner
 * Enables real Ruby execution in the browser using Opal.js
 */
export class OpalTestRunner extends BaseTestRunner {
  private opalInstance: any = null;
  private isLoaded = false;

  constructor(algorithmId: string) {
    super('Ruby', algorithmId);
  }

  canExecute(): boolean {
    return this.isLoaded && this.opalInstance !== null;
  }

  getLanguageName(): string {
    return 'Ruby (Opal.js)';
  }

  /**
   * Initializes Opal.js runtime
   */
  private async loadOpal(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Check if Opal is available globally
      if (!(window as any).Opal) {
        throw new Error('Opal.js not loaded. Please include: <script src="https://cdn.opalrb.com/opal/current/opal.min.js"></script>');
      }

      console.log('Initializing Opal.js...');
      this.opalInstance = (window as any).Opal;
      
      // Load core Ruby libraries
      if (this.opalInstance.require) {
        try {
          this.opalInstance.require('opal');
          this.opalInstance.require('native');
        } catch (e) {
          console.warn('Could not load additional Opal libraries:', e);
        }
      }

      this.isLoaded = true;
      console.log('Opal.js initialized successfully!');
    } catch (error) {
      console.error('Failed to load Opal.js:', error);
      throw error;
    }
  }

  protected async prepareCode(code: string): Promise<string> {
    await this.loadOpal();
    
    // Basic Ruby code validation
    if (!code.includes('def ')) {
      throw new Error('Ruby code must contain a method definition');
    }

    // Wrap the code to make it executable
    const wrappedCode = `
${code}

# Make functions available globally
define_method :execute_algorithm do |*args|
  case '${this.algorithmId}'
  when 'uniquePaths'
    unique_paths(*args)
  when 'coinChange'
    coin_change(*args)
  when 'lis'
    length_of_lis(*args)
  when 'knapsack'
    knapsack(*args)
  when 'minPathSum'
    min_path_sum(*args)
  else
    raise "Unknown algorithm: ${this.algorithmId}"
  end
end
    `;

    return wrappedCode;
  }

  protected async executeTestCase(preparedCode: string, testCase: TestCase): Promise<TestResult> {
    const startTime = performance.now();

    try {
      // Compile and execute Ruby code
      const compiledCode = this.opalInstance.compile(preparedCode);
      eval(compiledCode);

      // Get the Ruby execution context
      const rubyContext = this.opalInstance.top;
      let actual: any;

      // Execute based on algorithm type with proper argument conversion
      switch (this.algorithmId) {
        case 'uniquePaths':
          actual = rubyContext.$execute_algorithm(testCase.input.m, testCase.input.n);
          break;

        case 'coinChange':
          const coinsArray = this.opalInstance.hash2(testCase.input.coins);
          actual = rubyContext.$execute_algorithm(coinsArray, testCase.input.amount);
          break;

        case 'lis':
          const numsArray = this.opalInstance.hash2(testCase.input.nums);
          actual = rubyContext.$execute_algorithm(numsArray);
          break;

        case 'knapsack':
          const weightsArray = this.opalInstance.hash2(testCase.input.weights);
          const valuesArray = this.opalInstance.hash2(testCase.input.values);
          actual = rubyContext.$execute_algorithm(weightsArray, valuesArray, testCase.input.capacity);
          break;

        case 'minPathSum':
          // Convert 2D array to Ruby format
          const gridArray = this.opalInstance.hash2(testCase.input.grid.map((row: any) => this.opalInstance.hash2(row)));
          actual = rubyContext.$execute_algorithm(gridArray);
          break;

        default:
          throw new Error(`Unsupported algorithm: ${this.algorithmId}`);
      }

      // Convert Ruby result to JavaScript
      const jsResult = this.rubyToJs(actual);
      const executionTime = performance.now() - startTime;

      return this.createSuccessfulResult(testCase, jsResult, executionTime);

    } catch (error: any) {
      return this.createFailedResult(testCase, `Ruby execution error: ${error.message}`);
    }
  }

  /**
   * Converts Ruby values to JavaScript values
   */
  private rubyToJs(rubyValue: any): any {
    if (rubyValue === null || rubyValue === undefined) return null;
    
    // Handle Ruby numbers
    if (typeof rubyValue === 'number') return rubyValue;
    
    // Handle Ruby strings
    if (typeof rubyValue === 'string') return rubyValue;
    
    // Handle Ruby objects with value methods
    if (rubyValue && typeof rubyValue.$to_i === 'function') {
      return rubyValue.$to_i();
    }
    
    if (rubyValue && typeof rubyValue.$to_s === 'function') {
      return rubyValue.$to_s();
    }
    
    // Handle Ruby arrays
    if (rubyValue && typeof rubyValue.$to_a === 'function') {
      const array = rubyValue.$to_a();
      return array.map((item: any) => this.rubyToJs(item));
    }
    
    return rubyValue;
  }

  /**
   * Get Opal.js installation instructions
   */
  static getInstallationInstructions(): string {
    return `
To enable Ruby execution with Opal.js, add this to your HTML:

<script src="https://cdn.opalrb.com/opal/current/opal.min.js"></script>
<script src="https://cdn.opalrb.com/opal/current/native.min.js"></script>

Or install via npm:
npm install opal-runtime

Then include the runtime in your application before using Ruby algorithms.
    `.trim();
  }

  /**
   * Check if Opal.js is available
   */
  static isAvailable(): boolean {
    return typeof (window as any).Opal !== 'undefined';
  }
}
