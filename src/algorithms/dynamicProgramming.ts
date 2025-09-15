import React from 'react';
import { Grid3X3, Coins, TrendingUp, Calculator, Target } from 'lucide-react';
import { Algorithm, VisualizationStrategy, ExecutionStrategy, EducationalContent } from '../types';
import { delay } from '../utils';

/**
 * Dynamic Programming Algorithms
 * Using composition pattern for modular algorithm definitions
 */

// Visualization Strategy for DP Grid Problems
const createGridVisualization = (
  setupFn: (rows: number, cols: number, params: any) => any[][],
  animateFn: (context: any, setGrid: any) => Promise<void>
): VisualizationStrategy => ({
  id: 'dp-grid',
  name: 'Dynamic Programming Grid',
  description: 'Visualizes DP problems using 2D grids',
  setup: setupFn,
  animate: animateFn,
  getStepCount: (params) => (params.m || 5) * (params.n || 5)
});

// JavaScript Execution Strategy
const createJSExecution = (code: string): ExecutionStrategy => ({
  language: 'JavaScript',
  extension: 'js',
  code,
  execute: async (code, testCases) => {
    const results = [];
    for (const testCase of testCases) {
      try {
        const func = new Function('input', `'use strict';\n${code}\nreturn solve(input);`);
        const startTime = performance.now();
        const actual = func(testCase.input);
        const endTime = performance.now();
        results.push({
          passed: JSON.stringify(actual) === JSON.stringify(testCase.expected),
          expected: testCase.expected,
          actual,
          description: testCase.description,
          executionTime: endTime - startTime
        });
      } catch (error) {
        results.push({
          passed: false,
          expected: testCase.expected,
          actual: null,
          description: testCase.description,
          error: error.message
        });
      }
    }
    return results;
  },
  runtimeStatus: 'ready'
});

// 1. UNIQUE PATHS
export const uniquePathsAlgorithm: Algorithm = {
  id: 'uniquePaths',
  name: 'Unique Paths',
  category: { id: 'dynamic_programming', name: 'Dynamic Programming', description: '', icon: React.createElement(Grid3X3), color: 'blue', gradient: 'from-blue-500 to-indigo-600' },
  difficulty: 'medium',
  icon: React.createElement(Grid3X3, { className: "h-6 w-6" }),
  tags: ['Dynamic Programming', 'Grid', 'Path Counting'],
  
  visualization: createGridVisualization(
    (rows, cols) => Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({
        value: 0,
        visited: false,
        highlighted: false
      }))
    ),
    async (context, setGrid) => {
      const { grid, params } = context;
      const m = params.m as number || grid.length;
      const n = params.n as number || grid[0]?.length;
      const dp = Array(m).fill(null).map(() => Array(n).fill(0));
      
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          grid[i][j] = { ...grid[i][j], highlighted: true };
          setGrid([...grid]);
          await delay(context.speed);
          
          if (i === 0 || j === 0) {
            dp[i][j] = 1;
          } else {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
          }
          
          grid[i][j] = {
            value: dp[i][j],
            visited: true,
            highlighted: false
          };
          setGrid([...grid]);
          await delay(context.speed);
        }
      }
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const { m, n } = input;
  const dp = Array(m).fill(null).map(() => Array(n).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;
  
  // Fill the dp table
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i-1][j] + dp[i][j-1];
    }
  }
  
  return dp[m-1][n-1];
}`)
  ],
  
  education: {
    overview: 'The Unique Paths problem demonstrates fundamental dynamic programming concepts. We need to find the number of unique paths from top-left to bottom-right corner of a grid, moving only right or down.',
    keyInsights: [
      'Each cell depends only on the cell above and to the left',
      'Base cases are the first row and column (all have 1 path)',
      'The final answer is built up from smaller subproblems',
      'This is a classic example of optimal substructure'
    ],
    timeComplexity: {
      best: 'O(m × n)',
      average: 'O(m × n)',
      worst: 'O(m × n)',
      explanation: 'We visit each cell exactly once to compute the number of unique paths'
    },
    spaceComplexity: {
      value: 'O(m × n)',
      explanation: 'We need a 2D table to store the number of paths to each cell'
    },
    whenToUse: [
      'Grid-based path counting problems',
      'When you need to count ways to reach a destination',
      'Problems with movement restrictions (only right/down)',
      'Building up solutions from smaller subproblems'
    ],
    commonPitfalls: [
      'Forgetting to initialize base cases properly',
      'Not handling edge cases (1x1 grid)',
      'Confusing path counting with path finding',
      'Using recursion without memoization (exponential time)'
    ],
    realWorldApplications: [
      {
        title: 'Robot Path Planning',
        description: 'Calculate possible paths for robots in warehouse automation',
        industry: 'Robotics & Automation'
      },
      {
        title: 'Circuit Board Layout',
        description: 'Determine routing paths for electrical connections',
        industry: 'Electronics Manufacturing'
      },
      {
        title: 'Game Level Design',
        description: 'Calculate movement possibilities in tile-based games',
        industry: 'Game Development'
      }
    ]
  },
  
  testCases: [
    { input: { m: 3, n: 2 }, expected: 3, description: '3×2 grid should have 3 unique paths' },
    { input: { m: 3, n: 7 }, expected: 28, description: '3×7 grid should have 28 unique paths' },
    { input: { m: 1, n: 1 }, expected: 1, description: 'Edge case: 1×1 grid has 1 path' },
    { input: { m: 4, n: 4 }, expected: 20, description: '4×4 grid should have 20 paths' }
  ],
  
  defaultParams: { m: 4, n: 4 },
  paramControls: [
    { name: 'm', type: 'number', label: 'Rows', min: 1, max: 8, default: 4, description: 'Number of rows in the grid' },
    { name: 'n', type: 'number', label: 'Columns', min: 1, max: 8, default: 4, description: 'Number of columns in the grid' }
  ],
  
  estimatedTimeMinutes: 15,
  prerequisites: ['Basic Recursion', 'Mathematical Thinking'],
  relatedAlgorithms: ['coinChange', 'longestIncreasingSubsequence', 'editDistance']
};

// 2. COIN CHANGE
export const coinChangeAlgorithm: Algorithm = {
  id: 'coinChange',
  name: 'Coin Change',
  category: { id: 'dynamic_programming', name: 'Dynamic Programming', description: '', icon: React.createElement(Coins), color: 'blue', gradient: 'from-blue-500 to-indigo-600' },
  difficulty: 'medium',
  icon: React.createElement(Coins, { className: "h-6 w-6" }),
  tags: ['Dynamic Programming', 'Optimization', 'Greedy vs DP'],
  
  visualization: createGridVisualization(
    (rows, cols, params) => {
      const amount = params?.amount || 11;
      const coins = params?.coins || [1, 2, 5];
      return Array(coins.length + 1).fill(null).map(() => 
        Array(amount + 1).fill(null).map(() => ({
          value: Infinity,
          visited: false,
          highlighted: false
        }))
      );
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const amount = params.amount as number || 11;
      const coins = params.coins as number[] || [1, 2, 5];
      
      // Initialize first column (amount 0 needs 0 coins)
      for (let i = 0; i <= coins.length; i++) {
        grid[i][0] = { value: 0, visited: true, highlighted: false };
      }
      setGrid([...grid]);
      await delay(context.speed);
      
      for (let i = 1; i <= coins.length; i++) {
        for (let j = 1; j <= amount; j++) {
          grid[i][j] = { ...grid[i][j], highlighted: true };
          setGrid([...grid]);
          await delay(context.speed);
          
          // Don't use current coin
          let minCoins = grid[i-1][j].value;
          
          // Use current coin if possible
          if (j >= coins[i-1] && grid[i][j - coins[i-1]].value !== Infinity) {
            minCoins = Math.min(minCoins, grid[i][j - coins[i-1]].value + 1);
          }
          
          grid[i][j] = {
            value: minCoins === Infinity ? '∞' : minCoins,
            visited: true,
            highlighted: false
          };
          setGrid([...grid]);
          await delay(context.speed);
        }
      }
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const { coins, amount } = input;
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`)
  ],
  
  education: {
    overview: 'The Coin Change problem asks for the minimum number of coins needed to make a specific amount. This classic DP problem demonstrates optimal substructure and overlapping subproblems.',
    keyInsights: [
      'Each amount can be made by adding one coin to a smaller amount',
      'We need to try all possible coins and pick the minimum',
      'Base case: 0 coins needed to make amount 0',
      'Greedy approach doesn\'t always work (e.g., coins [1,3,4], amount 6)'
    ],
    timeComplexity: {
      best: 'O(amount × coins)',
      average: 'O(amount × coins)',
      worst: 'O(amount × coins)',
      explanation: 'For each amount, we check all possible coins'
    },
    spaceComplexity: {
      value: 'O(amount)',
      explanation: 'We only need to store the minimum coins for each amount'
    },
    whenToUse: [
      'Making change with minimum coins',
      'Resource optimization problems',
      'When greedy approach fails',
      'Unbounded knapsack variations'
    ],
    commonPitfalls: [
      'Using greedy approach (doesn\'t always work)',
      'Not handling impossible cases (return -1)',
      'Integer overflow with large amounts',
      'Forgetting to sort coins for optimization'
    ],
    realWorldApplications: [
      {
        title: 'ATM Cash Dispensing',
        description: 'Minimize the number of bills dispensed',
        industry: 'Banking & Finance'
      },
      {
        title: 'Inventory Management',
        description: 'Optimize stock levels for manufacturing',
        industry: 'Supply Chain'
      },
      {
        title: 'Resource Allocation',
        description: 'Minimize resources while meeting requirements',
        industry: 'Project Management'
      }
    ]
  },
  
  testCases: [
    { input: { coins: [1, 2, 5], amount: 11 }, expected: 3, description: 'Amount 11 with coins [1,2,5] needs 3 coins (5+5+1)' },
    { input: { coins: [2], amount: 3 }, expected: -1, description: 'Impossible to make amount 3 with only coin 2' },
    { input: { coins: [1], amount: 0 }, expected: 0, description: 'Amount 0 needs 0 coins' },
    { input: { coins: [1, 3, 4], amount: 6 }, expected: 2, description: 'Amount 6 with coins [1,3,4] needs 2 coins (3+3)' }
  ],
  
  defaultParams: { coins: [1, 2, 5], amount: 11 },
  paramControls: [
    { name: 'coins', type: 'array', label: 'Coin Denominations', default: [1, 2, 5], description: 'Available coin values' },
    { name: 'amount', type: 'number', label: 'Target Amount', min: 0, max: 20, default: 11, description: 'Amount to make change for' }
  ],
  
  estimatedTimeMinutes: 20,
  prerequisites: ['Dynamic Programming Basics', 'Optimization Concepts'],
  relatedAlgorithms: ['uniquePaths', 'knapsack', 'longestIncreasingSubsequence']
};

// 3. LONGEST INCREASING SUBSEQUENCE  
export const lisAlgorithm: Algorithm = {
  id: 'longestIncreasingSubsequence',
  name: 'Longest Increasing Subsequence',
  category: { id: 'dynamic_programming', name: 'Dynamic Programming', description: '', icon: React.createElement(TrendingUp), color: 'blue', gradient: 'from-blue-500 to-indigo-600' },
  difficulty: 'medium',
  icon: React.createElement(TrendingUp, { className: "h-6 w-6" }),
  tags: ['Dynamic Programming', 'Sequence', 'Binary Search'],
  
  visualization: createGridVisualization(
    (rows, cols, params) => {
      const arr = params?.array || [10, 9, 2, 5, 3, 7, 101, 18];
      return [arr.map((val, idx) => ({
        value: `${val}`,
        visited: false,
        highlighted: false,
        isPath: false
      })), Array(arr.length).fill(null).map(() => ({
        value: 1,
        visited: false,
        highlighted: false
      }))];
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const arr = params.array as number[] || [10, 9, 2, 5, 3, 7, 101, 18];
      const dp = Array(arr.length).fill(1);
      const n = arr.length;
      
      // Initialize DP array visualization
      for (let i = 0; i < n; i++) {
        grid[1][i] = { value: 1, visited: true, highlighted: false };
      }
      setGrid([...grid]);
      await delay(context.speed);
      
      for (let i = 1; i < n; i++) {
        grid[0][i] = { ...grid[0][i], highlighted: true };
        setGrid([...grid]);
        await delay(context.speed);
        
        for (let j = 0; j < i; j++) {
          if (arr[j] < arr[i]) {
            dp[i] = Math.max(dp[i], dp[j] + 1);
            grid[0][j] = { ...grid[0][j], isPath: true };
            setGrid([...grid]);
            await delay(context.speed / 2);
            grid[0][j] = { ...grid[0][j], isPath: false };
          }
        }
        
        grid[1][i] = { value: dp[i], visited: true, highlighted: false };
        grid[0][i] = { ...grid[0][i], highlighted: false };
        setGrid([...grid]);
        await delay(context.speed);
      }
      
      // Highlight the maximum LIS length
      const maxLen = Math.max(...dp);
      const maxIdx = dp.findIndex(len => len === maxLen);
      grid[1][maxIdx] = { ...grid[1][maxIdx], highlighted: true };
      setGrid([...grid]);
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const { array } = input;
  const n = array.length;
  const dp = Array(n).fill(1);
  
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (array[j] < array[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}`)
  ],
  
  education: {
    overview: 'Find the length of the longest increasing subsequence in an array. This problem showcases how DP can solve sequence-based optimization problems efficiently.',
    keyInsights: [
      'For each element, check all previous smaller elements',
      'LIS ending at position i depends on LIS at all previous positions',
      'Can be optimized to O(n log n) using binary search',
      'Classic example of optimal substructure in sequences'
    ],
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      explanation: 'Nested loop to check all previous elements for each position'
    },
    spaceComplexity: {
      value: 'O(n)',
      explanation: 'DP array to store LIS length ending at each position'
    },
    whenToUse: [
      'Finding longest increasing patterns in data',
      'Stock price analysis (longest upward trend)',
      'Sequence optimization problems',
      'Building optimal subsequences'
    ],
    commonPitfalls: [
      'Confusing subsequence with substring (elements don\'t need to be contiguous)',
      'Not considering empty array edge case',
      'Mixing up increasing vs non-decreasing',
      'Forgetting to track actual subsequence if needed'
    ],
    realWorldApplications: [
      {
        title: 'Stock Market Analysis',
        description: 'Find longest periods of increasing stock prices',
        industry: 'Finance'
      },
      {
        title: 'Quality Control',
        description: 'Track longest periods of improving metrics',
        industry: 'Manufacturing'
      },
      {
        title: 'Performance Monitoring',
        description: 'Identify sustained improvement periods in systems',
        industry: 'Software Engineering'
      }
    ]
  },
  
  testCases: [
    { input: { array: [10, 9, 2, 5, 3, 7, 101, 18] }, expected: 4, description: 'LIS is [2,3,7,18] or [2,5,7,18] with length 4' },
    { input: { array: [0, 1, 0, 3, 2, 3] }, expected: 4, description: 'LIS is [0,1,2,3] with length 4' },
    { input: { array: [7, 7, 7, 7, 7, 7, 7] }, expected: 1, description: 'All elements same, LIS length is 1' },
    { input: { array: [1, 2, 3, 4, 5] }, expected: 5, description: 'Already increasing, LIS is entire array' }
  ],
  
  defaultParams: { array: [10, 9, 2, 5, 3, 7, 101, 18] },
  paramControls: [
    { name: 'array', type: 'array', label: 'Input Array', default: [10, 9, 2, 5, 3, 7, 101, 18], description: 'Array to find LIS in' }
  ],
  
  estimatedTimeMinutes: 25,
  prerequisites: ['Dynamic Programming', 'Array Manipulation'],
  relatedAlgorithms: ['uniquePaths', 'coinChange', 'editDistance']
};

export const dynamicProgrammingAlgorithms = [
  uniquePathsAlgorithm,
  coinChangeAlgorithm, 
  lisAlgorithm
];
