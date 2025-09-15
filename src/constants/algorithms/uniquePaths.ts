import React from 'react';
import { Grid3X3 } from 'lucide-react';
import { Algorithm, Cell } from '../../types';
import { RuntimeTestRunnerFactory } from '../../services/testRunners';
import { sleep } from '../../utils';

const testRunnerFactory = RuntimeTestRunnerFactory.getInstance();

/**
 * Creates test runners for different languages
 */
const createTestRunners = (algorithmId: string) => ({
  createJavaScriptTestRunner: () => testRunnerFactory.createRunner('JavaScript', algorithmId),
  createTypeScriptTestRunner: () => testRunnerFactory.createRunner('TypeScript', algorithmId),
  createSimulatedTestRunner: (languageName: string) => testRunnerFactory.createRunner(languageName, algorithmId),
});

const testRunners = createTestRunners('uniquePaths');

/**
 * Unique Paths Algorithm Definition
 */
export const uniquePathsAlgorithm: Algorithm = {
  id: 'uniquePaths',
  name: 'Unique Paths',
  description: 'Find number of unique paths from top-left to bottom-right in a grid',
  icon: React.createElement(Grid3X3, { className: "h-5 w-5" }),
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
      testRunner: (code, testCases) => testRunners.createJavaScriptTestRunner().execute(code, testCases),
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
      testRunner: (code, testCases) => testRunners.createTypeScriptTestRunner().execute(code, testCases),
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
      testRunner: (code, testCases) => testRunners.createSimulatedTestRunner('Python').execute(code, testCases),
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
      testRunner: (code, testCases) => testRunners.createSimulatedTestRunner('Java').execute(code, testCases),
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
      testRunner: (code, testCases) => testRunners.createSimulatedTestRunner('Go').execute(code, testCases),
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
      testRunner: (code, testCases) => testRunners.createSimulatedTestRunner('Ruby').execute(code, testCases),
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
};
