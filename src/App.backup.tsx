import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Code, ChevronDown, TestTube, CheckCircle, XCircle, Clock, Grid3X3, Calculator, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { MultipleSolutionsDemo } from './components/MultipleSolutionsDemo';

interface Cell {
  value: number | string;
  isPath: boolean;
  isCurrentPath: boolean;
  visited: boolean;
  highlighted: boolean;
  color?: string;
}

interface TestCase {
  input: any;
  expected: any;
  description: string;
}

interface TestResult {
  passed: boolean;
  actual: any;
  expected: any;
  error?: string;
  executionTime?: number;
}

interface Language {
  name: string;
  code: string;
  extension: string;
  testRunner: (code: string, testCases: TestCase[]) => Promise<TestResult[]>;
  runtimeStatus: 'loading' | 'ready' | 'error';
}

interface Algorithm {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  complexity: { time: string; space: string };
  testCases: TestCase[];
  gridSetup: (rows: number, cols: number, params?: any) => Cell[][];
  animate: (grid: Cell[][], setGrid: (grid: Cell[][]) => void, params: any, animationSpeed: number) => Promise<void>;
  languages: Language[];
  defaultParams: any;
  paramControls: Array<{
    name: string;
    type: 'number' | 'array' | 'string';
    min?: number;
    max?: number;
    default: any;
    description: string;
  }>;
}

// Helper functions
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced multi-language test runner system
const createJavaScriptTestRunner = (algorithmId: string) => {
  return async (code: string, testCases: TestCase[]): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    
    try {
      // Enhanced JavaScript execution with better error handling
      const func = new Function('return ' + code)();
      
      for (const testCase of testCases) {
        const startTime = performance.now();
        try {
          let actual;
          if (algorithmId === 'uniquePaths') {
            actual = func(testCase.input.m, testCase.input.n);
          } else if (algorithmId === 'coinChange') {
            actual = func(testCase.input.coins, testCase.input.amount);
          } else if (algorithmId === 'lis') {
            actual = func(testCase.input.nums);
          } else if (algorithmId === 'knapsack') {
            actual = func(testCase.input.weights, testCase.input.values, testCase.input.capacity);
          } else if (algorithmId === 'minPathSum') {
            actual = func(testCase.input.grid);
          } else {
            actual = func(...Object.values(testCase.input));
          }
          
          const executionTime = performance.now() - startTime;
          
          results.push({
            passed: JSON.stringify(actual) === JSON.stringify(testCase.expected),
            actual,
            expected: testCase.expected,
            executionTime
          });
        } catch (error: any) {
          results.push({
            passed: false,
            actual: null,
            expected: testCase.expected,
            error: error.message
          });
        }
      }
    } catch (error: any) {
      testCases.forEach(testCase => {
        results.push({
          passed: false,
          actual: null,
          expected: testCase.expected,
          error: `Code compilation error: ${error.message}`
        });
      });
    }
    
    return results;
  };
};

// TypeScript test runner (transpiles to JavaScript)
const createTypeScriptTestRunner = (algorithmId: string) => {
  return async (code: string, testCases: TestCase[]): Promise<TestResult[]> => {
    // For now, treat TypeScript like JavaScript (in real implementation, you'd transpile)
    const jsCode = code.replace(/: \w+/g, '').replace(/\w+:/g, ''); // Basic type removal
    return createJavaScriptTestRunner(algorithmId)(jsCode, testCases);
  };
};

// Simulated test runner for display-only languages
const createSimulatedTestRunner = (languageName: string) => {
  return async (_code: string, testCases: TestCase[]): Promise<TestResult[]> => {
    // Simulate test execution for educational purposes
    return testCases.map((testCase) => ({
      passed: false,
      actual: null,
      expected: testCase.expected,
      error: `${languageName} execution not supported in browser. This is for educational display only.`
    }));
  };
};

// Algorithm definitions
const algorithms: Algorithm[] = [
  {
    id: 'uniquePaths',
    name: 'Unique Paths',
    description: 'Find number of unique paths from top-left to bottom-right in a grid',
    icon: <Grid3X3 className="h-5 w-5" />,
    complexity: { time: 'O(m×n)', space: 'O(m×n)' },
    defaultParams: { rows: 4, cols: 4 },
    paramControls: [],
    testCases: [
      { input: { m: 3, n: 7 }, expected: 28, description: "3×7 grid" },
      { input: { m: 3, n: 2 }, expected: 3, description: "3×2 grid" },
      { input: { m: 1, n: 1 }, expected: 1, description: "1×1 grid" }
    ],
    gridSetup: (rows: number, cols: number) => {
      const grid: Cell[][] = Array(rows).fill(null).map(() =>
        Array(cols).fill(null).map(() => ({
          value: 0,
          isPath: false,
          isCurrentPath: false,
          visited: false,
          highlighted: false
        }))
      );

      for (let i = 0; i < rows; i++) {
        grid[i][0].value = 1;
        grid[i][0].visited = true;
      }
      for (let j = 0; j < cols; j++) {
        grid[0][j].value = 1;
        grid[0][j].visited = true;
      }

      return grid;
    },
    animate: async (grid, setGrid, params, animationSpeed) => {
      const { rows, cols } = params;
      
      for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
          grid[i][j].isCurrentPath = true;
          setGrid([...grid]);
          await sleep(animationSpeed);

          grid[i][j].value = (grid[i-1][j].value as number) + (grid[i][j-1].value as number);
          grid[i][j].visited = true;
          grid[i][j].isCurrentPath = false;
          
          setGrid([...grid]);
          await sleep(animationSpeed / 2);
        }
      }
    },
    languages: [
      {
        name: 'JavaScript',
        extension: 'js',
        runtimeStatus: 'ready',
        testRunner: createJavaScriptTestRunner('uniquePaths'),
        code: `function uniquePaths(m, n) {
    // Initialize DP table
    const dp = Array(m).fill().map(() => Array(n).fill(0));
    
    // Base cases: first row and column
    for (let i = 0; i < m; i++) dp[i][0] = 1;
    for (let j = 0; j < n; j++) dp[0][j] = 1;
    
    // Fill DP table
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}`
      },
      {
        name: 'TypeScript',
        extension: 'ts',
        runtimeStatus: 'ready',
        testRunner: createTypeScriptTestRunner('uniquePaths'),
        code: `function uniquePaths(m: number, n: number): number {
    // Initialize DP table
    const dp: number[][] = Array(m).fill(null).map(() => Array(n).fill(0));
    
    // Base cases: first row and column
    for (let i = 0; i < m; i++) dp[i][0] = 1;
    for (let j = 0; j < n; j++) dp[0][j] = 1;
    
    // Fill DP table
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}`
      },
      {
        name: 'Python',
        extension: 'py',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Python'),
        code: `def unique_paths(m: int, n: int) -> int:
    """
    Find number of unique paths from top-left to bottom-right in grid.
    
    Args:
        m: Number of rows
        n: Number of columns
    
    Returns:
        Number of unique paths
    """
    # Initialize DP table
    dp = [[0] * n for _ in range(m)]
    
    # Base cases: first row and column
    for i in range(m): 
        dp[i][0] = 1
    for j in range(n): 
        dp[0][j] = 1
    
    # Fill DP table
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]`
      },
      {
        name: 'Java',
        extension: 'java',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Java'),
        code: `public class Solution {
    /**
     * Find number of unique paths from top-left to bottom-right in grid.
     * 
     * @param m Number of rows
     * @param n Number of columns
     * @return Number of unique paths
     */
    public int uniquePaths(int m, int n) {
        // Initialize DP table
        int[][] dp = new int[m][n];
        
        // Base cases: first row and column
        for (int i = 0; i < m; i++) dp[i][0] = 1;
        for (int j = 0; j < n; j++) dp[0][j] = 1;
        
        // Fill DP table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
        
        return dp[m-1][n-1];
    }
}`
      },
      {
        name: 'Go',
        extension: 'go',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Go'),
        code: `package main

// uniquePaths finds number of unique paths from top-left to bottom-right in grid
func uniquePaths(m int, n int) int {
    // Initialize DP table
    dp := make([][]int, m)
    for i := range dp {
        dp[i] = make([]int, n)
    }
    
    // Base cases: first row and column
    for i := 0; i < m; i++ {
        dp[i][0] = 1
    }
    for j := 0; j < n; j++ {
        dp[0][j] = 1
    }
    
    // Fill DP table
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
        }
    }
    
    return dp[m-1][n-1]
}`
      },
      {
        name: 'Ruby',
        extension: 'rb',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Ruby'),
        code: `# Find number of unique paths from top-left to bottom-right in grid
#
# @param m [Integer] Number of rows
# @param n [Integer] Number of columns
# @return [Integer] Number of unique paths
def unique_paths(m, n)
  # Initialize DP table
  dp = Array.new(m) { Array.new(n, 0) }
  
  # Base cases: first row and column
  (0...m).each { |i| dp[i][0] = 1 }
  (0...n).each { |j| dp[0][j] = 1 }
  
  # Fill DP table
  (1...m).each do |i|
    (1...n).each do |j|
      dp[i][j] = dp[i-1][j] + dp[i][j-1]
    end
  end
  
  dp[m-1][n-1]
end`
      }
    ]
  },
  {
    id: 'coinChange',
    name: 'Coin Change',
    description: 'Find minimum coins needed to make a target amount',
    icon: <Calculator className="h-5 w-5" />,
    complexity: { time: 'O(amount×coins)', space: 'O(amount)' },
    defaultParams: { coins: [1, 3, 4], amount: 6 },
    paramControls: [
      { name: 'coins', type: 'array' as const, default: [1, 3, 4], description: 'Available coin denominations' },
      { name: 'amount', type: 'number' as const, min: 1, max: 20, default: 6, description: 'Target amount' }
    ],
    testCases: [
      { input: { coins: [1, 3, 4], amount: 6 }, expected: 2, description: "coins=[1,3,4], amount=6" },
      { input: { coins: [2], amount: 3 }, expected: -1, description: "coins=[2], amount=3" },
      { input: { coins: [1], amount: 0 }, expected: 0, description: "amount=0" }
    ],
    gridSetup: (_rows: number, _cols: number, params: any) => {
      const { amount, coins } = params;
      const grid: Cell[][] = Array(coins.length + 1).fill(null).map(() =>
        Array(amount + 1).fill(null).map(() => ({
          value: Infinity,
          isPath: false,
          isCurrentPath: false,
          visited: false,
          highlighted: false
        }))
      );

      // Initialize base case
      for (let i = 0; i <= coins.length; i++) {
        grid[i][0].value = 0;
        grid[i][0].visited = true;
      }

      return grid;
    },
    animate: async (grid, setGrid, params, animationSpeed) => {
      const { coins, amount } = params;
      
      for (let i = 1; i <= coins.length; i++) {
        for (let j = 1; j <= amount; j++) {
          grid[i][j].isCurrentPath = true;
          setGrid([...grid]);
          await sleep(animationSpeed);

          const coin = coins[i-1];
          grid[i][j].value = grid[i-1][j].value;
          
          if (j >= coin) {
            const useThisCoin = (grid[i][j-coin].value as number) + 1;
            if (useThisCoin < (grid[i][j].value as number)) {
              grid[i][j].value = useThisCoin;
            }
          }
          
          if (grid[i][j].value === Infinity) {
            grid[i][j].value = -1;
          }
          
          grid[i][j].visited = true;
          grid[i][j].isCurrentPath = false;
          
          setGrid([...grid]);
          await sleep(animationSpeed / 2);
        }
      }
    },
    languages: [
      {
        name: 'JavaScript',
        extension: 'js',
        runtimeStatus: 'ready',
        testRunner: createJavaScriptTestRunner('coinChange'),
        code: `function coinChange(coins, amount) {
    // Initialize DP array with Infinity (impossible values)
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // Base case: 0 coins needed for amount 0
    
    // For each coin denomination
    for (const coin of coins) {
        // Update all amounts that can be made with this coin
        for (let i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}`
      },
      {
        name: 'TypeScript',
        extension: 'ts',
        runtimeStatus: 'ready',
        testRunner: createTypeScriptTestRunner('coinChange'),
        code: `function coinChange(coins: number[], amount: number): number {
    // Initialize DP array with Infinity (impossible values)
    const dp: number[] = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // Base case: 0 coins needed for amount 0
    
    // For each coin denomination
    for (const coin of coins) {
        // Update all amounts that can be made with this coin
        for (let i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}`
      },
      {
        name: 'Python',
        extension: 'py',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Python'),
        code: `def coin_change(coins: list[int], amount: int) -> int:
    """
    Find minimum coins needed to make a target amount.
    
    Args:
        coins: List of coin denominations
        amount: Target amount to make
    
    Returns:
        Minimum number of coins needed, or -1 if impossible
    """
    # Initialize DP array with infinity (impossible values)
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins needed for amount 0
    
    # For each coin denomination
    for coin in coins:
        # Update all amounts that can be made with this coin
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1`
      },
      {
        name: 'Java',
        extension: 'java',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Java'),
        code: `public class Solution {
    /**
     * Find minimum coins needed to make a target amount.
     * 
     * @param coins Array of coin denominations
     * @param amount Target amount to make
     * @return Minimum number of coins needed, or -1 if impossible
     */
    public int coinChange(int[] coins, int amount) {
        // Initialize DP array with max value (impossible values)
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0; // Base case: 0 coins needed for amount 0
        
        // For each coin denomination
        for (int coin : coins) {
            // Update all amounts that can be made with this coin
            for (int i = coin; i <= amount; i++) {
                if (dp[i - coin] != Integer.MAX_VALUE) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }
}`
      },
      {
        name: 'Go',
        extension: 'go',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Go'),
        code: `package main

import "math"

// coinChange finds minimum coins needed to make a target amount
func coinChange(coins []int, amount int) int {
    // Initialize DP array with infinity (impossible values)
    dp := make([]int, amount+1)
    for i := range dp {
        dp[i] = math.MaxInt32
    }
    dp[0] = 0 // Base case: 0 coins needed for amount 0
    
    // For each coin denomination
    for _, coin := range coins {
        // Update all amounts that can be made with this coin
        for i := coin; i <= amount; i++ {
            if dp[i-coin] != math.MaxInt32 {
                dp[i] = min(dp[i], dp[i-coin]+1)
            }
        }
    }
    
    if dp[amount] == math.MaxInt32 {
        return -1
    }
    return dp[amount]
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}`
      },
      {
        name: 'Ruby',
        extension: 'rb',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Ruby'),
        code: `# Find minimum coins needed to make a target amount
#
# @param coins [Array<Integer>] List of coin denominations
# @param amount [Integer] Target amount to make
# @return [Integer] Minimum number of coins needed, or -1 if impossible
def coin_change(coins, amount)
  # Initialize DP array with infinity (impossible values)
  dp = Array.new(amount + 1, Float::INFINITY)
  dp[0] = 0  # Base case: 0 coins needed for amount 0
  
  # For each coin denomination
  coins.each do |coin|
    # Update all amounts that can be made with this coin
    (coin..amount).each do |i|
      dp[i] = [dp[i], dp[i - coin] + 1].min
    end
  end
  
  dp[amount] == Float::INFINITY ? -1 : dp[amount]
end`
      }
    ]
  },
  {
    id: 'lis',
    name: 'Longest Increasing Subsequence',
    description: 'Find the length of the longest increasing subsequence',
    icon: <TrendingUp className="h-5 w-5" />,
    complexity: { time: 'O(n²)', space: 'O(n)' },
    defaultParams: { nums: [10, 9, 2, 5, 3, 7, 101, 18] },
    paramControls: [
      { name: 'nums', type: 'array' as const, default: [10, 9, 2, 5, 3, 7, 101, 18], description: 'Input array' }
    ],
    testCases: [
      { input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, expected: 4, description: "nums=[10,9,2,5,3,7,101,18]" },
      { input: { nums: [0, 1, 0, 3, 2, 3] }, expected: 4, description: "nums=[0,1,0,3,2,3]" },
      { input: { nums: [7, 7, 7, 7, 7, 7, 7] }, expected: 1, description: "all same elements" }
    ],
    gridSetup: (_rows: number, _cols: number, params: any) => {
      const { nums } = params;
      const n = nums.length;
      const grid: Cell[][] = Array(2).fill(null).map(() =>
        Array(n).fill(null).map(() => ({
          value: 0,
          isPath: false,
          isCurrentPath: false,
          visited: false,
          highlighted: false
        }))
      );

      // First row: original array
      for (let j = 0; j < n; j++) {
        grid[0][j].value = nums[j];
        grid[0][j].visited = true;
      }
      
      // Second row: DP values (initialize to 1)
      for (let j = 0; j < n; j++) {
        grid[1][j].value = 1;
      }

      return grid;
    },
    animate: async (grid, setGrid, params, animationSpeed) => {
      const { nums } = params;
      const n = nums.length;
      
      for (let i = 1; i < n; i++) {
        grid[1][i].isCurrentPath = true;
        setGrid([...grid]);
        await sleep(animationSpeed);
        
        for (let j = 0; j < i; j++) {
          grid[1][j].highlighted = true;
          setGrid([...grid]);
          await sleep(animationSpeed / 3);
          
          if (nums[i] > nums[j]) {
            grid[1][i].value = Math.max(grid[1][i].value as number, (grid[1][j].value as number) + 1);
            setGrid([...grid]);
          }
          
          grid[1][j].highlighted = false;
        }
        
        grid[1][i].visited = true;
        grid[1][i].isCurrentPath = false;
        setGrid([...grid]);
        await sleep(animationSpeed / 2);
      }
    },
    languages: [
      {
        name: 'JavaScript',
        extension: 'js',
        runtimeStatus: 'ready',
        testRunner: createJavaScriptTestRunner('lis'),
        code: `function lengthOfLIS(nums) {
    if (nums.length === 0) return 0;
    
    // Initialize DP array: dp[i] = length of LIS ending at index i
    const dp = new Array(nums.length).fill(1);
    
    // For each position, check all previous positions
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            // If current element is larger, we can extend the subsequence
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return Math.max(...dp);
}`
      },
      {
        name: 'TypeScript',
        extension: 'ts',
        runtimeStatus: 'ready',
        testRunner: createTypeScriptTestRunner('lis'),
        code: `function lengthOfLIS(nums: number[]): number {
    if (nums.length === 0) return 0;
    
    // Initialize DP array: dp[i] = length of LIS ending at index i
    const dp: number[] = new Array(nums.length).fill(1);
    
    // For each position, check all previous positions
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            // If current element is larger, we can extend the subsequence
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return Math.max(...dp);
}`
      },
      {
        name: 'Python',
        extension: 'py',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Python'),
        code: `def length_of_lis(nums: list[int]) -> int:
    """
    Find the length of the longest increasing subsequence.
    
    Args:
        nums: List of integers
    
    Returns:
        Length of the longest increasing subsequence
    """
    if not nums:
        return 0
    
    # Initialize DP array: dp[i] = length of LIS ending at index i
    dp = [1] * len(nums)
    
    # For each position, check all previous positions
    for i in range(1, len(nums)):
        for j in range(i):
            # If current element is larger, we can extend the subsequence
            if nums[i] > nums[j]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)`
      },
      {
        name: 'Java',
        extension: 'java',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Java'),
        code: `public class Solution {
    /**
     * Find the length of the longest increasing subsequence.
     * 
     * @param nums Array of integers
     * @return Length of the longest increasing subsequence
     */
    public int lengthOfLIS(int[] nums) {
        if (nums.length == 0) return 0;
        
        // Initialize DP array: dp[i] = length of LIS ending at index i
        int[] dp = new int[nums.length];
        Arrays.fill(dp, 1);
        
        // For each position, check all previous positions
        for (int i = 1; i < nums.length; i++) {
            for (int j = 0; j < i; j++) {
                // If current element is larger, we can extend the subsequence
                if (nums[i] > nums[j]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
        }
        
        return Arrays.stream(dp).max().orElse(1);
    }
}`
      },
      {
        name: 'Go',
        extension: 'go',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Go'),
        code: `package main

// lengthOfLIS finds the length of the longest increasing subsequence
func lengthOfLIS(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    
    // Initialize DP array: dp[i] = length of LIS ending at index i
    dp := make([]int, len(nums))
    for i := range dp {
        dp[i] = 1
    }
    
    // For each position, check all previous positions
    for i := 1; i < len(nums); i++ {
        for j := 0; j < i; j++ {
            // If current element is larger, we can extend the subsequence
            if nums[i] > nums[j] {
                dp[i] = max(dp[i], dp[j]+1)
            }
        }
    }
    
    result := 1
    for _, val := range dp {
        if val > result {
            result = val
        }
    }
    return result
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}`
      },
      {
        name: 'Ruby',
        extension: 'rb',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Ruby'),
        code: `# Find the length of the longest increasing subsequence
#
# @param nums [Array<Integer>] List of integers
# @return [Integer] Length of the longest increasing subsequence
def length_of_lis(nums)
  return 0 if nums.empty?
  
  # Initialize DP array: dp[i] = length of LIS ending at index i
  dp = Array.new(nums.length, 1)
  
  # For each position, check all previous positions
  (1...nums.length).each do |i|
    (0...i).each do |j|
      # If current element is larger, we can extend the subsequence
      if nums[i] > nums[j]
        dp[i] = [dp[i], dp[j] + 1].max
      end
    end
  end
  
  dp.max
end`
      }
    ]
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    description: 'Maximize value within weight capacity',
    icon: <Target className="h-5 w-5" />,
    complexity: { time: 'O(n×W)', space: 'O(n×W)' },
    defaultParams: { weights: [1, 3, 4, 5], values: [1, 4, 5, 7], capacity: 7 },
    paramControls: [
      { name: 'weights', type: 'array' as const, default: [1, 3, 4, 5], description: 'Item weights' },
      { name: 'values', type: 'array' as const, default: [1, 4, 5, 7], description: 'Item values' },
      { name: 'capacity', type: 'number' as const, min: 1, max: 15, default: 7, description: 'Knapsack capacity' }
    ],
    testCases: [
      { input: { weights: [1, 3, 4, 5], values: [1, 4, 5, 7], capacity: 7 }, expected: 9, description: "weights=[1,3,4,5], values=[1,4,5,7], capacity=7" },
      { input: { weights: [2, 1, 3], values: [2, 1, 3], capacity: 4 }, expected: 4, description: "weights=[2,1,3], values=[2,1,3], capacity=4" }
    ],
    gridSetup: (_rows: number, _cols: number, params: any) => {
      const { weights, capacity } = params;
      const n = weights.length;
      const grid: Cell[][] = Array(n + 1).fill(null).map(() =>
        Array(capacity + 1).fill(null).map(() => ({
          value: 0,
          isPath: false,
          isCurrentPath: false,
          visited: false,
          highlighted: false
        }))
      );

      // Initialize first row and column
      for (let i = 0; i <= n; i++) {
        grid[i][0].visited = true;
      }
      for (let j = 0; j <= capacity; j++) {
        grid[0][j].visited = true;
      }

      return grid;
    },
    animate: async (grid, setGrid, params, animationSpeed) => {
      const { weights, values, capacity } = params;
      const n = weights.length;
      
      for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
          grid[i][w].isCurrentPath = true;
          setGrid([...grid]);
          await sleep(animationSpeed);

          const weight = weights[i-1];
          const value = values[i-1];
          
          // Can't include this item
          grid[i][w].value = grid[i-1][w].value;
          
          // Can include this item
          if (weight <= w) {
            const includeValue = (grid[i-1][w-weight].value as number) + value;
            if (includeValue > (grid[i][w].value as number)) {
              grid[i][w].value = includeValue;
            }
          }
          
          grid[i][w].visited = true;
          grid[i][w].isCurrentPath = false;
          
          setGrid([...grid]);
          await sleep(animationSpeed / 2);
        }
      }
    },
    languages: [
      {
        name: 'JavaScript',
        extension: 'js',
        runtimeStatus: 'ready',
        testRunner: createJavaScriptTestRunner('knapsack'),
        code: `function knapsack(weights, values, capacity) {
    const n = weights.length;
    // Create DP table: dp[i][w] = max value using first i items with weight limit w
    const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    
    // Fill DP table
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            const weight = weights[i-1];
            const value = values[i-1];
            
            dp[i][w] = dp[i-1][w]; // Don't take current item
            
            // If current item fits, consider taking it
            if (weight <= w) {
                dp[i][w] = Math.max(dp[i][w], dp[i-1][w-weight] + value);
            }
        }
    }
    
    return dp[n][capacity];
}`
      },
      {
        name: 'TypeScript',
        extension: 'ts',
        runtimeStatus: 'ready',
        testRunner: createTypeScriptTestRunner('knapsack'),
        code: `function knapsack(weights: number[], values: number[], capacity: number): number {
    const n = weights.length;
    // Create DP table: dp[i][w] = max value using first i items with weight limit w
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    
    // Fill DP table
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            const weight = weights[i-1];
            const value = values[i-1];
            
            dp[i][w] = dp[i-1][w]; // Don't take current item
            
            // If current item fits, consider taking it
            if (weight <= w) {
                dp[i][w] = Math.max(dp[i][w], dp[i-1][w-weight] + value);
            }
        }
    }
    
    return dp[n][capacity];
}`
      },
      {
        name: 'Python',
        extension: 'py',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Python'),
        code: `def knapsack(weights: list[int], values: list[int], capacity: int) -> int:
    """
    Solve 0/1 Knapsack problem to maximize value within weight capacity.
    
    Args:
        weights: List of item weights
        values: List of item values
        capacity: Maximum weight capacity
    
    Returns:
        Maximum value that can be obtained
    """
    n = len(weights)
    # Create DP table: dp[i][w] = max value using first i items with weight limit w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    # Fill DP table
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            weight = weights[i-1]
            value = values[i-1]
            
            dp[i][w] = dp[i-1][w]  # Don't take current item
            
            # If current item fits, consider taking it
            if weight <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w-weight] + value)
    
    return dp[n][capacity]`
      },
      {
        name: 'Java',
        extension: 'java',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Java'),
        code: `public class Solution {
    /**
     * Solve 0/1 Knapsack problem to maximize value within weight capacity.
     * 
     * @param weights Array of item weights
     * @param values Array of item values
     * @param capacity Maximum weight capacity
     * @return Maximum value that can be obtained
     */
    public int knapsack(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        // Create DP table: dp[i][w] = max value using first i items with weight limit w
        int[][] dp = new int[n + 1][capacity + 1];
        
        // Fill DP table
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                int weight = weights[i-1];
                int value = values[i-1];
                
                dp[i][w] = dp[i-1][w]; // Don't take current item
                
                // If current item fits, consider taking it
                if (weight <= w) {
                    dp[i][w] = Math.max(dp[i][w], dp[i-1][w-weight] + value);
                }
            }
        }
        
        return dp[n][capacity];
    }
}`
      },
      {
        name: 'Go',
        extension: 'go',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Go'),
        code: `package main

// knapsack solves 0/1 Knapsack problem to maximize value within weight capacity
func knapsack(weights []int, values []int, capacity int) int {
    n := len(weights)
    // Create DP table: dp[i][w] = max value using first i items with weight limit w
    dp := make([][]int, n+1)
    for i := range dp {
        dp[i] = make([]int, capacity+1)
    }
    
    // Fill DP table
    for i := 1; i <= n; i++ {
        for w := 1; w <= capacity; w++ {
            weight := weights[i-1]
            value := values[i-1]
            
            dp[i][w] = dp[i-1][w] // Don't take current item
            
            // If current item fits, consider taking it
            if weight <= w {
                dp[i][w] = max(dp[i][w], dp[i-1][w-weight]+value)
            }
        }
    }
    
    return dp[n][capacity]
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}`
      },
      {
        name: 'Ruby',
        extension: 'rb',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Ruby'),
        code: `# Solve 0/1 Knapsack problem to maximize value within weight capacity
#
# @param weights [Array<Integer>] List of item weights
# @param values [Array<Integer>] List of item values
# @param capacity [Integer] Maximum weight capacity
# @return [Integer] Maximum value that can be obtained
def knapsack(weights, values, capacity)
  n = weights.length
  # Create DP table: dp[i][w] = max value using first i items with weight limit w
  dp = Array.new(n + 1) { Array.new(capacity + 1, 0) }
  
  # Fill DP table
  (1..n).each do |i|
    (1..capacity).each do |w|
      weight = weights[i-1]
      value = values[i-1]
      
      dp[i][w] = dp[i-1][w]  # Don't take current item
      
      # If current item fits, consider taking it
      if weight <= w
        dp[i][w] = [dp[i][w], dp[i-1][w-weight] + value].max
      end
    end
  end
  
  dp[n][capacity]
end`
      }
    ]
  },
  {
    id: 'minPathSum',
    name: 'Minimum Path Sum',
    description: 'Find minimum sum path from top-left to bottom-right',
    icon: <ArrowRight className="h-5 w-5" />,
    complexity: { time: 'O(m×n)', space: 'O(m×n)' },
    defaultParams: { gridData: [[1,3,1],[1,5,1],[4,2,1]] },
    paramControls: [
      { name: 'gridData', type: 'array' as const, default: [[1,3,1],[1,5,1],[4,2,1]], description: 'Grid with costs' }
    ],
    testCases: [
      { input: { grid: [[1,3,1],[1,5,1],[4,2,1]] }, expected: 7, description: "3x3 grid" },
      { input: { grid: [[1,2,3],[4,5,6]] }, expected: 12, description: "2x3 grid" }
    ],
    gridSetup: (_rows: number, _cols: number, params: any) => {
      const { gridData } = params;
      const m = gridData.length;
      const n = gridData[0].length;
      
      const grid: Cell[][] = Array(m).fill(null).map(() =>
        Array(n).fill(null).map(() => ({
          value: 0,
          isPath: false,
          isCurrentPath: false,
          visited: false,
          highlighted: false
        }))
      );

      // Initialize with grid costs and first row/column
      grid[0][0].value = gridData[0][0];
      grid[0][0].visited = true;
      
      for (let i = 1; i < m; i++) {
        grid[i][0].value = (grid[i-1][0].value as number) + gridData[i][0];
        grid[i][0].visited = true;
      }
      for (let j = 1; j < n; j++) {
        grid[0][j].value = (grid[0][j-1].value as number) + gridData[0][j];
        grid[0][j].visited = true;
      }

      return grid;
    },
    animate: async (grid, setGrid, params, animationSpeed) => {
      const { gridData } = params;
      const m = gridData.length;
      const n = gridData[0].length;
      
      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
          grid[i][j].isCurrentPath = true;
          setGrid([...grid]);
          await sleep(animationSpeed);

          const fromTop = grid[i-1][j].value as number;
          const fromLeft = grid[i][j-1].value as number;
          grid[i][j].value = Math.min(fromTop, fromLeft) + gridData[i][j];
          grid[i][j].visited = true;
          grid[i][j].isCurrentPath = false;
          
          setGrid([...grid]);
          await sleep(animationSpeed / 2);
        }
      }
    },
    languages: [
      {
        name: 'JavaScript',
        extension: 'js',
        runtimeStatus: 'ready',
        testRunner: createJavaScriptTestRunner('minPathSum'),
        code: `function minPathSum(grid) {
    const m = grid.length;
    const n = grid[0].length;
    // Create DP table same size as grid
    const dp = Array(m).fill(null).map(() => Array(n).fill(0));
    
    // Initialize starting point
    dp[0][0] = grid[0][0];
    
    // Fill first column (can only come from above)
    for (let i = 1; i < m; i++) {
        dp[i][0] = dp[i-1][0] + grid[i][0];
    }
    
    // Fill first row (can only come from left)
    for (let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j-1] + grid[0][j];
    }
    
    // Fill rest of DP table
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
        }
    }
    
    return dp[m-1][n-1];
}`
      },
      {
        name: 'TypeScript',
        extension: 'ts',
        runtimeStatus: 'ready',
        testRunner: createTypeScriptTestRunner('minPathSum'),
        code: `function minPathSum(grid: number[][]): number {
    const m = grid.length;
    const n = grid[0].length;
    // Create DP table same size as grid
    const dp: number[][] = Array(m).fill(null).map(() => Array(n).fill(0));
    
    // Initialize starting point
    dp[0][0] = grid[0][0];
    
    // Fill first column (can only come from above)
    for (let i = 1; i < m; i++) {
        dp[i][0] = dp[i-1][0] + grid[i][0];
    }
    
    // Fill first row (can only come from left)
    for (let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j-1] + grid[0][j];
    }
    
    // Fill rest of DP table
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
        }
    }
    
    return dp[m-1][n-1];
}`
      },
      {
        name: 'Python',
        extension: 'py',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Python'),
        code: `def min_path_sum(grid: list[list[int]]) -> int:
    """
    Find minimum sum path from top-left to bottom-right.
    
    Args:
        grid: 2D grid of non-negative integers
    
    Returns:
        Minimum sum of path from top-left to bottom-right
    """
    m, n = len(grid), len(grid[0])
    # Create DP table same size as grid
    dp = [[0] * n for _ in range(m)]
    
    # Initialize starting point
    dp[0][0] = grid[0][0]
    
    # Fill first column (can only come from above)
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    
    # Fill first row (can only come from left)
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    
    # Fill rest of DP table
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
    
    return dp[m-1][n-1]`
      },
      {
        name: 'Java',
        extension: 'java',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Java'),
        code: `public class Solution {
    /**
     * Find minimum sum path from top-left to bottom-right.
     * 
     * @param grid 2D grid of non-negative integers
     * @return Minimum sum of path from top-left to bottom-right
     */
    public int minPathSum(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        // Create DP table same size as grid
        int[][] dp = new int[m][n];
        
        // Initialize starting point
        dp[0][0] = grid[0][0];
        
        // Fill first column (can only come from above)
        for (int i = 1; i < m; i++) {
            dp[i][0] = dp[i-1][0] + grid[i][0];
        }
        
        // Fill first row (can only come from left)
        for (int j = 1; j < n; j++) {
            dp[0][j] = dp[0][j-1] + grid[0][j];
        }
        
        // Fill rest of DP table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
            }
        }
        
        return dp[m-1][n-1];
    }
}`
      },
      {
        name: 'Go',
        extension: 'go',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Go'),
        code: `package main

// minPathSum finds minimum sum path from top-left to bottom-right
func minPathSum(grid [][]int) int {
    m, n := len(grid), len(grid[0])
    // Create DP table same size as grid
    dp := make([][]int, m)
    for i := range dp {
        dp[i] = make([]int, n)
    }
    
    // Initialize starting point
    dp[0][0] = grid[0][0]
    
    // Fill first column (can only come from above)
    for i := 1; i < m; i++ {
        dp[i][0] = dp[i-1][0] + grid[i][0]
    }
    
    // Fill first row (can only come from left)
    for j := 1; j < n; j++ {
        dp[0][j] = dp[0][j-1] + grid[0][j]
    }
    
    // Fill rest of DP table
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
        }
    }
    
    return dp[m-1][n-1]
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}`
      },
      {
        name: 'Ruby',
        extension: 'rb',
        runtimeStatus: 'error',
        testRunner: createSimulatedTestRunner('Ruby'),
        code: `# Find minimum sum path from top-left to bottom-right
#
# @param grid [Array<Array<Integer>>] 2D grid of non-negative integers
# @return [Integer] Minimum sum of path from top-left to bottom-right
def min_path_sum(grid)
  m, n = grid.length, grid[0].length
  # Create DP table same size as grid
  dp = Array.new(m) { Array.new(n, 0) }
  
  # Initialize starting point
  dp[0][0] = grid[0][0]
  
  # Fill first column (can only come from above)
  (1...m).each do |i|
    dp[i][0] = dp[i-1][0] + grid[i][0]
  end
  
  # Fill first row (can only come from left)
  (1...n).each do |j|
    dp[0][j] = dp[0][j-1] + grid[0][j]
  end
  
  # Fill rest of DP table
  (1...m).each do |i|
    (1...n).each do |j|
      dp[i][j] = [dp[i-1][j], dp[i][j-1]].min + grid[i][j]
    end
  end
  
  dp[m-1][n-1]
end`
      }
    ]
  }
];

const AlgorithmVisualizer: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(0);
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(300);
  const [showSettings, setShowSettings] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [algorithmParams, setAlgorithmParams] = useState<any>({});
  const [showMultipleSolutions, setShowMultipleSolutions] = useState(false);

  const currentAlgorithm = algorithms[selectedAlgorithm];
  const currentLanguage = currentAlgorithm.languages[selectedLanguage] || currentAlgorithm.languages[0];

  const initializeGrid = useCallback(() => {
    const params = { ...currentAlgorithm.defaultParams, ...algorithmParams, rows, cols };
    const newGrid = currentAlgorithm.gridSetup(rows, cols, params);
    setGrid(newGrid);
  }, [currentAlgorithm, rows, cols, algorithmParams]);

  useEffect(() => {
    initializeGrid();
    setCustomCode(currentLanguage.code);
    setAlgorithmParams(currentAlgorithm.defaultParams);
    setSelectedLanguage(0);
  }, [selectedAlgorithm, initializeGrid, currentLanguage.code]);

  const animateAlgorithm = async () => {
    setIsAnimating(true);
    initializeGrid();
    await sleep(animationSpeed);

    const params = { ...currentAlgorithm.defaultParams, ...algorithmParams, rows, cols };
    const newGrid = currentAlgorithm.gridSetup(rows, cols, params);
    setGrid(newGrid);
    
    await currentAlgorithm.animate(newGrid, setGrid, params, animationSpeed);
    setIsAnimating(false);
  };

  const resetVisualization = () => {
    setIsAnimating(false);
    initializeGrid();
  };

  const runTests = async () => {
    setIsRunningTests(true);
    try {
      const results = await currentLanguage.testRunner(customCode, currentAlgorithm.testCases);
      setTestResults(results);
      setShowTests(true);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getCellColor = (cell: Cell) => {
    if (cell.isCurrentPath) return 'bg-yellow-400 border-yellow-600 shadow-lg';
    if (cell.highlighted) return 'bg-purple-300 border-purple-500';
    if (cell.isPath) return 'bg-green-400 border-green-600';
    if (cell.visited) return 'bg-blue-100 border-blue-300';
    return 'bg-gray-50 border-gray-200';
  };

  const formatCellValue = (value: number | string) => {
    if (typeof value === 'number') {
      return value === Infinity ? '∞' : value.toString();
    }
    return value;
  };

  const updateParam = (paramName: string, value: any) => {
    setAlgorithmParams((prev: any) => ({
      ...prev,
      [paramName]: value
    }));
  };

  const parseArrayInput = (input: string) => {
    try {
      return JSON.parse(input);
    } catch {
      return input.split(',').map(x => {
        const num = parseFloat(x.trim());
        return isNaN(num) ? x.trim() : num;
      });
    }
  };

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;

  // If multiple solutions mode is enabled, show the new demo
  if (showMultipleSolutions) {
    return <MultipleSolutionsDemo />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dynamic Programming Algorithm Visualizer
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Interactive visualization of classic DP algorithms with multi-language support
          </p>
          
          {/* View Toggle */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setShowMultipleSolutions(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !showMultipleSolutions 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Original View
            </button>
            
            <button
              onClick={() => setShowMultipleSolutions(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                showMultipleSolutions 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Multiple Solutions & Complexity Analysis
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Controls Panel */}
          <div className="lg:w-80 space-y-6">
            {/* Algorithm Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm</h3>
              <div className="relative">
                <select
                  value={selectedAlgorithm}
                  onChange={(e) => setSelectedAlgorithm(Number(e.target.value))}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {algorithms.map((algorithm, index) => (
                    <option key={index} value={index}>
                      {algorithm.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  {currentAlgorithm.icon}
                  <div>
                    <p className="text-sm font-medium text-blue-900">{currentAlgorithm.name}</p>
                    <p className="text-xs text-blue-700 mt-1">{currentAlgorithm.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Algorithm Parameters */}
            {currentAlgorithm.paramControls.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Parameters</h3>
                <div className="space-y-4">
                  {currentAlgorithm.paramControls.map((control, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {control.name}: {control.description}
                      </label>
                      {control.type === 'number' ? (
                        <input
                          type="number"
                          min={control.min}
                          max={control.max}
                          value={algorithmParams[control.name] || control.default}
                          onChange={(e) => updateParam(control.name, Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <input
                          type="text"
                          value={JSON.stringify(algorithmParams[control.name] || control.default)}
                          onChange={(e) => updateParam(control.name, parseArrayInput(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          placeholder={JSON.stringify(control.default)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid Settings */}
            {['uniquePaths', 'minPathSum'].includes(currentAlgorithm.id) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Grid Settings</h3>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rows: {rows}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={rows}
                      onChange={(e) => setRows(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Columns: {cols}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={cols}
                      onChange={(e) => setCols(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {showSettings && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Animation Speed: {animationSpeed}ms
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="1000"
                        step="50"
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Controls</h3>
              <div className="space-y-3">
                <button
                  onClick={animateAlgorithm}
                  disabled={isAnimating}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isAnimating ? 'Running...' : 'Start Visualization'}
                </button>
                
                <button
                  onClick={resetVisualization}
                  className="w-full bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Code className="h-4 w-4" />
                  {showCode ? 'Hide Code' : 'Show Code'}
                </button>

                <button
                  onClick={runTests}
                  disabled={isRunningTests}
                  className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isRunningTests ? <Clock className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                  {isRunningTests ? 'Running Tests...' : 'Run Tests'}
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Language</h3>
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(Number(e.target.value))}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currentAlgorithm.languages.map((lang, index) => (
                    <option key={index} value={index}>
                      {lang.name} {lang.runtimeStatus === 'ready' ? '✅ Executable' : lang.runtimeStatus === 'error' ? '📚 Display Only' : '⏳ Loading'}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Time Complexity:</strong> {currentAlgorithm.complexity.time}</p>
                <p><strong>Space Complexity:</strong> {currentAlgorithm.complexity.space}</p>
                {testResults.length > 0 && (
                  <p><strong>Tests:</strong> {passedTests}/{totalTests} passed</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Grid Visualization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {currentAlgorithm.name} Visualization
              </h3>
              
              <div className="flex justify-center">
                <div 
                  className="grid gap-2 p-4"
                  style={{ 
                    gridTemplateColumns: `repeat(${Math.max(cols, grid[0]?.length || 1)}, minmax(0, 1fr))`,
                    maxWidth: '800px'
                  }}
                >
                  {grid.map((row, i) =>
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={`
                          w-16 h-16 border-2 rounded-lg flex items-center justify-center
                          font-bold text-sm transition-all duration-300 transform
                          ${getCellColor(cell)}
                          ${cell.isCurrentPath ? 'scale-110' : ''}
                        `}
                      >
                        {formatCellValue(cell.value)}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                  <span>Unvisited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                  <span>Computed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 rounded"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-300 border border-purple-500 rounded"></div>
                  <span>Highlighted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 border border-green-600 rounded"></div>
                  <span>Path</span>
                </div>
              </div>
            </div>

            {/* Test Results */}
            {showTests && testResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  Test Results 
                  <span className={`text-sm px-2 py-1 rounded ${passedTests === totalTests ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {passedTests}/{totalTests}
                  </span>
                </h3>
                
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${result.passed ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {result.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-medium">
                          {currentAlgorithm.testCases[index].description}
                        </span>
                        {result.executionTime && (
                          <span className="text-xs text-gray-500">
                            {result.executionTime.toFixed(2)}ms
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div>Expected: {JSON.stringify(result.expected)}</div>
                        <div>Actual: {JSON.stringify(result.actual)}</div>
                        {result.error && (
                          <div className="text-red-600 mt-1">Error: {result.error}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code Display */}
            {showCode && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Implementation in {currentLanguage.name}
                  <span className={`ml-2 text-sm px-2 py-1 rounded ${currentLanguage.runtimeStatus === 'ready' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                    {currentLanguage.runtimeStatus}
                  </span>
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edit Code:
                  </label>
                  <textarea
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="Enter your code here..."
                  />
                </div>
                
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Original Code:</span>
                    <span className={`text-xs px-2 py-1 rounded ${currentLanguage.runtimeStatus === 'ready' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                      {currentLanguage.runtimeStatus === 'ready' ? 'Can Execute' : 'Simulated'}
                    </span>
                  </div>
                  <pre className="text-sm">
                    <code>{currentLanguage.code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;
