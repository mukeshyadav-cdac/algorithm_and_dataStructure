import { TestCase, TestResult } from '../../types';
import { BaseTestRunner } from './BaseTestRunner';

/**
 * TinyGo WASM Test Runner
 * Enables real Go execution in the browser using TinyGo compiled to WebAssembly
 */
export class TinyGoWasmTestRunner extends BaseTestRunner {
  private wasmModule: WebAssembly.Module | null = null;
  private wasmInstance: WebAssembly.Instance | null = null;
  private isLoaded = false;

  constructor(algorithmId: string) {
    super('Go', algorithmId);
  }

  canExecute(): boolean {
    return this.isLoaded && this.wasmInstance !== null;
  }

  getLanguageName(): string {
    return 'Go (TinyGo WASM)';
  }

  /**
   * Loads pre-compiled WASM module for the algorithm
   */
  private async loadWasm(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Load the WASM file for the specific algorithm
      const wasmPath = `/wasm/${this.algorithmId}.wasm`;
      
      console.log(`Loading TinyGo WASM module: ${wasmPath}`);
      
      const response = await fetch(wasmPath);
      if (!response.ok) {
        throw new Error(`Failed to load WASM file: ${wasmPath}. Status: ${response.status}`);
      }

      const wasmBytes = await response.arrayBuffer();
      this.wasmModule = await WebAssembly.compile(wasmBytes);

      // Create WASM instance with Go runtime support
      const go = new (window as any).Go(); // TinyGo's Go class
      this.wasmInstance = await WebAssembly.instantiate(this.wasmModule, go.importObject);

      // Initialize the Go runtime
      go.run(this.wasmInstance);

      this.isLoaded = true;
      console.log('TinyGo WASM module loaded successfully!');
    } catch (error) {
      console.error('Failed to load TinyGo WASM:', error);
      throw new Error(`TinyGo WASM loading failed: ${error}. Make sure the WASM file exists and TinyGo runtime is available.`);
    }
  }

  protected async prepareCode(_code: string): Promise<string> {
    // For WASM, the code is already compiled
    // We just need to ensure the WASM module is loaded
    await this.loadWasm();
    return 'WASM_MODULE_LOADED';
  }

  protected async executeTestCase(_preparedCode: string, testCase: TestCase): Promise<TestResult> {
    const startTime = performance.now();

    try {
      if (!this.wasmInstance) {
        throw new Error('WASM module not loaded');
      }

      // Get the exported function from WASM
      const exports = this.wasmInstance.exports as any;
      let actual: any;

      // Execute the appropriate WASM function based on algorithm
      switch (this.algorithmId) {
        case 'uniquePaths':
          if (!exports.uniquePaths) {
            throw new Error('uniquePaths function not exported from WASM module');
          }
          actual = exports.uniquePaths(testCase.input.m, testCase.input.n);
          break;

        case 'coinChange':
          if (!exports.coinChange) {
            throw new Error('coinChange function not exported from WASM module');
          }
          // For arrays, we need to pass them through memory
          actual = this.callWasmWithArray(exports.coinChange, testCase.input.coins, testCase.input.amount);
          break;

        case 'lis':
          if (!exports.lengthOfLIS) {
            throw new Error('lengthOfLIS function not exported from WASM module');
          }
          actual = this.callWasmWithArray(exports.lengthOfLIS, testCase.input.nums);
          break;

        case 'knapsack':
          if (!exports.knapsack) {
            throw new Error('knapsack function not exported from WASM module');
          }
          actual = this.callWasmWithTwoArraysAndInt(
            exports.knapsack, 
            testCase.input.weights, 
            testCase.input.values, 
            testCase.input.capacity
          );
          break;

        case 'minPathSum':
          if (!exports.minPathSum) {
            throw new Error('minPathSum function not exported from WASM module');
          }
          actual = this.callWasmWith2DArray(exports.minPathSum, testCase.input.grid);
          break;

        default:
          throw new Error(`Unsupported algorithm: ${this.algorithmId}`);
      }

      const executionTime = performance.now() - startTime;
      return this.createSuccessfulResult(testCase, actual, executionTime);

    } catch (error: any) {
      return this.createFailedResult(testCase, `Go WASM execution error: ${error.message}`);
    }
  }

  /**
   * Helper to call WASM function with array parameter
   */
  private callWasmWithArray(wasmFunc: Function, array: number[], ...otherArgs: any[]): any {
    // Allocate memory in WASM for the array
    const memory = this.wasmInstance!.exports.memory as WebAssembly.Memory;
    const malloc = this.wasmInstance!.exports.malloc as Function;
    const free = this.wasmInstance!.exports.free as Function;

    const arrayPtr = malloc(array.length * 4); // 4 bytes per int32
    const arrayView = new Int32Array(memory.buffer, arrayPtr, array.length);
    arrayView.set(array);

    try {
      return wasmFunc(arrayPtr, array.length, ...otherArgs);
    } finally {
      free(arrayPtr);
    }
  }

  /**
   * Helper to call WASM function with two arrays and an integer
   */
  private callWasmWithTwoArraysAndInt(wasmFunc: Function, arr1: number[], arr2: number[], intVal: number): any {
    const memory = this.wasmInstance!.exports.memory as WebAssembly.Memory;
    const malloc = this.wasmInstance!.exports.malloc as Function;
    const free = this.wasmInstance!.exports.free as Function;

    const arr1Ptr = malloc(arr1.length * 4);
    const arr2Ptr = malloc(arr2.length * 4);
    
    const arr1View = new Int32Array(memory.buffer, arr1Ptr, arr1.length);
    const arr2View = new Int32Array(memory.buffer, arr2Ptr, arr2.length);
    
    arr1View.set(arr1);
    arr2View.set(arr2);

    try {
      return wasmFunc(arr1Ptr, arr1.length, arr2Ptr, arr2.length, intVal);
    } finally {
      free(arr1Ptr);
      free(arr2Ptr);
    }
  }

  /**
   * Helper to call WASM function with 2D array
   */
  private callWasmWith2DArray(wasmFunc: Function, grid: number[][]): any {
    const memory = this.wasmInstance!.exports.memory as WebAssembly.Memory;
    const malloc = this.wasmInstance!.exports.malloc as Function;
    const free = this.wasmInstance!.exports.free as Function;

    const rows = grid.length;
    const cols = grid[0].length;
    const totalSize = rows * cols;
    
    const gridPtr = malloc(totalSize * 4);
    const gridView = new Int32Array(memory.buffer, gridPtr, totalSize);
    
    // Flatten 2D array to 1D for WASM
    let index = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        gridView[index++] = grid[i][j];
      }
    }

    try {
      return wasmFunc(gridPtr, rows, cols);
    } finally {
      free(gridPtr);
    }
  }

  /**
   * Get TinyGo WASM setup instructions
   */
  static getInstallationInstructions(): string {
    return `
To enable Go execution with TinyGo WASM:

1. Install TinyGo: https://tinygo.org/getting-started/install/

2. Compile your Go algorithms to WASM:
   tinygo build -o public/wasm/uniquePaths.wasm -target wasm ./algorithms/uniquePaths.go
   tinygo build -o public/wasm/coinChange.wasm -target wasm ./algorithms/coinChange.go
   # ... etc for each algorithm

3. Include TinyGo's WASM support in your HTML:
   <script src="https://cdn.jsdelivr.net/gh/tinygo-org/tinygo@v0.30.0/targets/wasm_exec.js"></script>

4. Place compiled .wasm files in public/wasm/ directory

Go Algorithm Template:
//go:export algorithmFunction
func algorithmFunction(params...) result {
    // Your algorithm implementation
    return result
}

func main() {} // Required for TinyGo
    `.trim();
  }

  /**
   * Check if TinyGo WASM runtime is available
   */
  static isAvailable(): boolean {
    return typeof (window as any).Go !== 'undefined';
  }

  /**
   * Generate Go source template for algorithm
   */
  static generateGoTemplate(algorithmId: string): string {
    const templates: Record<string, string> = {
      uniquePaths: `
package main

//go:export uniquePaths
func uniquePaths(m, n int32) int32 {
    dp := make([][]int32, m)
    for i := range dp {
        dp[i] = make([]int32, n)
    }
    
    for i := int32(0); i < m; i++ {
        dp[i][0] = 1
    }
    for j := int32(0); j < n; j++ {
        dp[0][j] = 1
    }
    
    for i := int32(1); i < m; i++ {
        for j := int32(1); j < n; j++ {
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
        }
    }
    
    return dp[m-1][n-1]
}

func main() {}
      `,
      // Add other algorithm templates as needed
    };

    return templates[algorithmId] || `
package main

//go:export ${algorithmId}
func ${algorithmId}(/* parameters */) /* return type */ {
    // Implement ${algorithmId} algorithm here
    return /* result */
}

func main() {}
    `;
  }
}
