import { TestCase, TestResult } from '../../types';
import { BaseTestRunner } from './BaseTestRunner';

/**
 * Blazor WASM Test Runner
 * Enables real C# execution in the browser using Blazor WebAssembly
 */
export class BlazorWasmTestRunner extends BaseTestRunner {
  private blazorRuntime: any = null;
  private isLoaded = false;
  private dotnetRuntime: any = null;

  constructor(algorithmId: string) {
    super('C#', algorithmId);
  }

  canExecute(): boolean {
    return this.isLoaded && this.dotnetRuntime !== null;
  }

  getLanguageName(): string {
    return 'C# (Blazor WASM)';
  }

  /**
   * Loads Blazor WASM runtime
   */
  private async loadBlazorRuntime(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Check if .NET runtime is available
      if (!(window as any).getDotnetRuntime) {
        throw new Error('Blazor WASM runtime not available. Please ensure Blazor WASM is properly configured.');
      }

      console.log('Loading Blazor WASM runtime...');
      
      // Get the .NET runtime
      this.dotnetRuntime = await (window as any).getDotnetRuntime(0);
      
      // Load the algorithm assembly
      const assemblyName = 'AlgorithmVisualizer.Algorithms';
      await this.dotnetRuntime.runMain(assemblyName, []);
      
      this.blazorRuntime = this.dotnetRuntime;
      this.isLoaded = true;
      
      console.log('Blazor WASM runtime loaded successfully!');
    } catch (error) {
      console.error('Failed to load Blazor WASM runtime:', error);
      throw error;
    }
  }

  protected async prepareCode(code: string): Promise<string> {
    await this.loadBlazorRuntime();
    
    // For Blazor WASM, the code is already compiled into the assembly
    // We just validate that the runtime is ready
    if (!this.dotnetRuntime) {
      throw new Error('Blazor WASM runtime not initialized');
    }

    return 'BLAZOR_RUNTIME_READY';
  }

  protected async executeTestCase(_preparedCode: string, testCase: TestCase): Promise<TestResult> {
    const startTime = performance.now();

    try {
      if (!this.dotnetRuntime) {
        throw new Error('Blazor WASM runtime not loaded');
      }

      // Get the algorithm service from the .NET runtime
      const algorithmService = await this.dotnetRuntime.getAssemblyExports('AlgorithmVisualizer.Algorithms');
      let actual: any;

      // Execute the appropriate C# method based on algorithm
      switch (this.algorithmId) {
        case 'uniquePaths':
          actual = algorithmService.AlgorithmService.UniquePaths(testCase.input.m, testCase.input.n);
          break;

        case 'coinChange':
          // Convert JS array to .NET array
          const coinsArray = this.dotnetRuntime.js_to_mono_obj(testCase.input.coins);
          actual = algorithmService.AlgorithmService.CoinChange(coinsArray, testCase.input.amount);
          break;

        case 'lis':
          const numsArray = this.dotnetRuntime.js_to_mono_obj(testCase.input.nums);
          actual = algorithmService.AlgorithmService.LengthOfLIS(numsArray);
          break;

        case 'knapsack':
          const weightsArray = this.dotnetRuntime.js_to_mono_obj(testCase.input.weights);
          const valuesArray = this.dotnetRuntime.js_to_mono_obj(testCase.input.values);
          actual = algorithmService.AlgorithmService.Knapsack(weightsArray, valuesArray, testCase.input.capacity);
          break;

        case 'minPathSum':
          const gridArray = this.convert2DArrayToMono(testCase.input.grid);
          actual = algorithmService.AlgorithmService.MinPathSum(gridArray);
          break;

        default:
          throw new Error(`Unsupported algorithm: ${this.algorithmId}`);
      }

      // Convert .NET result back to JavaScript
      const jsResult = this.monoToJs(actual);
      const executionTime = performance.now() - startTime;

      return this.createSuccessfulResult(testCase, jsResult, executionTime);

    } catch (error: any) {
      return this.createFailedResult(testCase, `C# execution error: ${error.message}`);
    }
  }

  /**
   * Converts 2D JavaScript array to .NET array
   */
  private convert2DArrayToMono(jsArray: number[][]): any {
    if (!this.dotnetRuntime) return null;
    
    // Convert each row to .NET array, then create array of arrays
    const monoRows = jsArray.map(row => this.dotnetRuntime.js_to_mono_obj(row));
    return this.dotnetRuntime.js_to_mono_obj(monoRows);
  }

  /**
   * Converts .NET/Mono object to JavaScript
   */
  private monoToJs(monoObj: any): any {
    if (!this.dotnetRuntime) return monoObj;
    
    try {
      return this.dotnetRuntime.mono_obj_to_js(monoObj);
    } catch {
      // If conversion fails, return as-is
      return monoObj;
    }
  }

  /**
   * Get Blazor WASM setup instructions
   */
  static getInstallationInstructions(): string {
    return `
To enable C# execution with Blazor WASM:

1. Create a new Blazor WASM project:
   dotnet new blazorwasm -n AlgorithmVisualizer.Algorithms

2. Add algorithm implementations to a C# class:

   public static class AlgorithmService
   {
       [JSInvokable]
       public static int UniquePaths(int m, int n)
       {
           var dp = new int[m, n];
           
           for (int i = 0; i < m; i++) dp[i, 0] = 1;
           for (int j = 0; j < n; j++) dp[0, j] = 1;
           
           for (int i = 1; i < m; i++)
           {
               for (int j = 1; j < n; j++)
               {
                   dp[i, j] = dp[i-1, j] + dp[i, j-1];
               }
           }
           
           return dp[m-1, n-1];
       }
       
       // Add other algorithm methods...
   }

3. Configure Program.cs:
   builder.Services.AddSingleton<AlgorithmService>();

4. Build the project:
   dotnet publish -c Release

5. Include the generated files in your web app:
   - _framework/blazor.webassembly.js
   - _framework/dotnet.*.wasm
   - _framework/AlgorithmVisualizer.Algorithms.dll

6. Initialize in your HTML:
   <script src="_framework/blazor.webassembly.js"></script>
   
   <script>
     window.getDotnetRuntime = async () => {
       await Blazor.start();
       return window.DotNet;
     };
   </script>

Alternative: Use .NET 8 WASM without Blazor for lighter runtime.
    `.trim();
  }

  /**
   * Check if Blazor WASM runtime is available
   */
  static isAvailable(): boolean {
    return typeof (window as any).getDotnetRuntime !== 'undefined' ||
           typeof (window as any).Blazor !== 'undefined';
  }

  /**
   * Generate C# source template for algorithm
   */
  static generateCSharpTemplate(algorithmId: string): string {
    const templates: Record<string, string> = {
      uniquePaths: `
using System;
using Microsoft.JSInterop;

public static class AlgorithmService
{
    [JSInvokable]
    public static int UniquePaths(int m, int n)
    {
        var dp = new int[m, n];
        
        // Initialize first row and column
        for (int i = 0; i < m; i++) dp[i, 0] = 1;
        for (int j = 0; j < n; j++) dp[0, j] = 1;
        
        // Fill DP table
        for (int i = 1; i < m; i++)
        {
            for (int j = 1; j < n; j++)
            {
                dp[i, j] = dp[i-1, j] + dp[i, j-1];
            }
        }
        
        return dp[m-1, n-1];
    }
}
      `,
      coinChange: `
using System;
using Microsoft.JSInterop;

public static class AlgorithmService
{
    [JSInvokable]
    public static int CoinChange(int[] coins, int amount)
    {
        var dp = new int[amount + 1];
        Array.Fill(dp, int.MaxValue);
        dp[0] = 0;
        
        foreach (var coin in coins)
        {
            for (int i = coin; i <= amount; i++)
            {
                if (dp[i - coin] != int.MaxValue)
                {
                    dp[i] = Math.Min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        
        return dp[amount] == int.MaxValue ? -1 : dp[amount];
    }
}
      `
    };

    return templates[algorithmId] || `
using System;
using Microsoft.JSInterop;

public static class AlgorithmService
{
    [JSInvokable]
    public static /* ReturnType */ ${algorithmId}(/* parameters */)
    {
        // Implement ${algorithmId} algorithm here
        throw new NotImplementedException("Algorithm not implemented");
    }
}
    `;
  }
}
