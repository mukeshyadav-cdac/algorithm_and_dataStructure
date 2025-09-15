import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Code, ChevronDown, TestTube, CheckCircle, XCircle, Clock, Grid3X3, Calculator, Coins, TrendingUp, Package, Home } from 'lucide-react';

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
}

interface Language {
  name: string;
  extension: string;
  runtimeStatus: 'ready' | 'loading' | 'error' | 'not_supported';
  code: string;
  testRunner: (code: string, testCases: TestCase[]) => Promise<TestResult[]>;
}

interface Algorithm {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  complexity: { time: string; space: string };
  defaultParams: any;
  paramControls: Array<{
    name: string;
    type: 'number' | 'array' | 'select';
    label: string;
    min?: number;
    max?: number;
    default: any;
    options?: Array<{ label: string; value: any }>;
  }>;
  testCases: TestCase[];
  gridSetup: (rows: number, cols: number, params?: any) => Cell[][];
  animate: (grid: Cell[][], setGrid: (grid: Cell[][]) => void, params: any, animationSpeed: number) => Promise<void>;
  languages: Language[];
}

// Utility function for animation delays
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// JavaScript test runner (executes actual code)
const createJavaScriptTestRunner = (algorithmId: string) => {
  return async (code: string, testCases: TestCase[]): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    
    try {
      // Create a safe execution context
      const func = new Function('return ' + code)();
      
      for (const testCase of testCases) {
        try {
          const actual = func(...Object.values(testCase.input));
          const passed = JSON.stringify(actual) === JSON.stringify(testCase.expected);
          
          results.push({
            passed,
            actual,
            expected: testCase.expected,
            error: passed ? undefined : `Expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`
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
    paramControls: [
      { name: 'rows', type: 'number', label: 'Rows', min: 1, max: 10, default: 4 },
      { name: 'cols', type: 'number', label: 'Columns', min: 1, max: 10, default: 4 }
    ],
    testCases: [
      { input: { m: 3, n: 2 }, expected: 3, description: '3x2 grid has 3 unique paths' },
      { input: { m: 3, n: 7 }, expected: 28, description: '3x7 grid has 28 unique paths' }
    ],
    gridSetup: (rows: number, cols: number) => {
      return Array(rows).fill(null).map(() => 
        Array(cols).fill(null).map(() => ({
          value: 0,
          isPath: false,
          isCurrentPath: false,
          visited: false,
          highlighted: false
        }))
      );
    },
    animate: async (grid, setGrid, params, animationSpeed) => {
      const { rows, cols } = params;
      
      // Initialize first row and column
      for (let i = 0; i < rows; i++) {
        grid[i][0].value = 1;
        grid[i][0].visited = true;
      }
      
      for (let j = 0; j < cols; j++) {
        grid[0][j].value = 1;
        grid[0][j].visited = true;
      }
      
      setGrid([...grid]);
      await sleep(animationSpeed);

      // Fill the DP table
      for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
          grid[i][j].isCurrentPath = true;
          setGrid([...grid]);
          await sleep(animationSpeed);

          grid[i][j].value = (grid[i-1][j].value as number) + (grid[i][j-1].value as number);
          grid[i][j].visited = true;
          grid[i][j].isCurrentPath = false;
          
          setGrid([...grid]);
          await sleep(animationSpeed);
        }
      }

      // Highlight the final result
      grid[rows-1][cols-1].highlighted = true;
      setGrid([...grid]);
    },
    languages: [
      {
        name: 'JavaScript',
        extension: 'js',
        runtimeStatus: 'ready',
        testRunner: createJavaScriptTestRunner('uniquePaths'),
        code: `function uniquePaths(m, n) {
  // Create DP table
  const dp = Array(m).fill(null).map(() => Array(n).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;
  
  // Fill the DP table
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
  // Create DP table
  const dp: number[][] = Array(m).fill(null).map(() => Array(n).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;
  
  // Fill the DP table
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
        code: `def unique_paths(m, n):
    # Create DP table
    dp = [[0 for _ in range(n)] for _ in range(m)]
    
    # Initialize first row and column
    for i in range(m):
        dp[i][0] = 1
    for j in range(n):
        dp[0][j] = 1
    
    # Fill the DP table
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]`
      }
    ]
  },
  {
    id: 'coinChange',
    name: 'Coin Change',
    description: 'Find minimum number of coins needed to make a target amount',
    icon: <Coins className="h-5 w-5" />,
    complexity: { time: 'O(amount×coins)', space: 'O(amount)' },
    defaultParams: { amount: 11, coins: [1, 2, 5] },
    paramControls: [
      { name: 'amount', type: 'number', label: 'Target Amount', min: 1, max: 20, default: 11 },
      { name: 'coins', type: 'array', label: 'Coin Values', default: [1, 2, 5] }
    ],
    testCases: [
      { input: { coins: [1, 2, 5], amount: 11 }, expected: 3, description: 'Amount 11 needs 3 coins: [5,5,1]' },
      { input: { coins: [2], amount: 3 }, expected: -1, description: 'Amount 3 cannot be made with coin [2]' }
    ],
    gridSetup: (rows: number, cols: number, params?: any) => {
      const { amount = 11 } = params || {};
      const validAmount = Math.max(1, Math.min(amount, 20)); // Ensure valid array length
      return Array(1).fill(null).map(() => 
        Array(validAmount + 1).fill(null).map((_, index) => ({
          value: index === 0 ? 0 : Infinity,
          isPath: false,
          isCurrentPath: false,
          visited: index === 0,
          highlighted: false
        }))
      );
    },
    animate: async (grid, setGrid, params, animationSpeed) => {
      const { amount, coins } = params;
      
      // Initialize DP array
      for (let i = 1; i <= amount; i++) {
        grid[0][i].value = Infinity;
        grid[0][i].visited = false;
      }
      grid[0][0].value = 0;
      grid[0][0].visited = true;
      setGrid([...grid]);
      await sleep(animationSpeed);

      // Fill DP table
      for (let i = 1; i <= amount; i++) {
        grid[0][i].isCurrentPath = true;
        setGrid([...grid]);
        await sleep(animationSpeed);

        let minCoins = Infinity;
        
        for (const coin of coins) {
          if (i >= coin && grid[0][i - coin].value !== Infinity) {
            minCoins = Math.min(minCoins, grid[0][i - coin].value + 1);
          }
        }
        
        grid[0][i].value = minCoins === Infinity ? -1 : minCoins;
        grid[0][i].visited = true;
        grid[0][i].isCurrentPath = false;
        
        setGrid([...grid]);
        await sleep(animationSpeed);
      }

      // Highlight final result
      grid[0][amount].highlighted = true;
      setGrid([...grid]);
    },
    languages: [
      {
        name: 'JavaScript',
        extension: 'js',
        runtimeStatus: 'ready',
        testRunner: createJavaScriptTestRunner('coinChange'),
        code: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
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
        code: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if i >= coin:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return -1 if dp[amount] == float('inf') else dp[amount]`
      }
    ]
  },
  {
    id: 'longestIncreasingSubsequence',
    name: 'Longest Increasing Subsequence',
    description: 'Find the length of the longest increasing subsequence in an array',
    icon: <TrendingUp className="h-5 w-5" />,
    complexity: { time: 'O(n²)', space: 'O(n)' },
    defaultParams: { sequence: [10, 9, 2, 5, 3, 7, 101, 18] },
    paramControls: [
      { name: 'sequence', type: 'array', label: 'Number Sequence', default: [10, 9, 2, 5, 3, 7, 101, 18] }
    ],
    testCases: [
      { input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, expected: 4, description: 'LIS: [2,3,7,18] has length 4' },
      { input: { nums: [0, 1, 0, 3, 2, 3] }, expected: 4, description: 'LIS: [0,1,2,3] has length 4' }
    ],
    gridSetup: (rows: number, cols: number, params?: any) => {
      const { sequence = [10, 9, 2, 5, 3, 7, 101, 18] } = params || {};
      const validSequence = Array.isArray(sequence) && sequence.length > 0 ? sequence : [10, 9, 2, 5, 3, 7, 101, 18];
      return Array(2).fill(null).map((_, rowIndex) => 
        Array(validSequence.length).fill(null).map((_, colIndex) => ({
          value: rowIndex === 0 ? validSequence[colIndex] : 1,
          isPath: false,
          isCurrentPath: false,
          visited: false,
          highlighted: false
        }))
      );
    },
    animate: async (grid, setGrid, params, animationSpeed) => {
      const { sequence } = params;
      const n = sequence.length;
      
      // Initialize DP array (second row)
      for (let i = 0; i < n; i++) {
        grid[0][i].value = sequence[i]; // Original sequence
        grid[1][i].value = 1; // LIS length ending at i
        grid[1][i].visited = true;
      }
      setGrid([...grid]);
      await sleep(animationSpeed);

      // Fill DP table
      for (let i = 1; i < n; i++) {
        grid[1][i].isCurrentPath = true;
        setGrid([...grid]);
        await sleep(animationSpeed);

        for (let j = 0; j < i; j++) {
          if (sequence[j] < sequence[i]) {
            grid[1][j].highlighted = true;
            setGrid([...grid]);
            await sleep(animationSpeed / 2);
            
            grid[1][i].value = Math.max(grid[1][i].value, grid[1][j].value + 1);
            setGrid([...grid]);
            await sleep(animationSpeed / 2);
            
            grid[1][j].highlighted = false;
          }
        }
        
        grid[1][i].isCurrentPath = false;
        setGrid([...grid]);
        await sleep(animationSpeed);
      }

      // Highlight maximum LIS length
      const maxLIS = Math.max(...grid[1].map(cell => cell.value as number));
      for (let i = 0; i < n; i++) {
        if (grid[1][i].value === maxLIS) {
          grid[1][i].highlighted = true;
        }
      }
      setGrid([...grid]);
    },
    languages: [
      {
        name: 'JavaScript',
        extension: 'js',
        runtimeStatus: 'ready',
        testRunner: createJavaScriptTestRunner('longestIncreasingSubsequence'),
        code: `function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  
  const dp = new Array(nums.length).fill(1);
  
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}`
      }
    ]
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    description: 'Maximize value of items in a knapsack with weight constraint',
    icon: <Package className="h-5 w-5" />,
    complexity: { time: 'O(n×W)', space: 'O(n×W)' },
    defaultParams: { capacity: 4, weights: [1, 3, 4, 5], values: [1, 4, 5, 7] },
    paramControls: [
      { name: 'capacity', type: 'number', label: 'Knapsack Capacity', min: 1, max: 10, default: 4 },
      { name: 'weights', type: 'array', label: 'Item Weights', default: [1, 3, 4, 5] },
      { name: 'values', type: 'array', label: 'Item Values', default: [1, 4, 5, 7] }
    ],
    testCases: [
      { input: { weights: [1, 3, 4, 5], values: [1, 4, 5, 7], W: 7 }, expected: 9, description: 'Items with weights [3,4] and values [4,5]' }
    ],
    gridSetup: (rows: number, cols: number, params?: any) => {
      const { capacity = 4, weights = [1, 3, 4, 5] } = params || {};
      const validCapacity = Math.max(1, Math.min(capacity, 20));
      const validWeights = Array.isArray(weights) && weights.length > 0 ? weights : [1, 3, 4, 5];
      const n = validWeights.length;
      return Array(n + 1).fill(null).map(() => 
        Array(validCapacity + 1).fill(null).map(() => ({
          value: 0,
          isPath: false,
          isCurrentPath: false,
          visited: false,
          highlighted: false
        }))
      );
    },
    animate: async (grid, setGrid, params, animationSpeed) => {
      const { capacity, weights, values } = params;
      const n = weights.length;
      
      // Initialize first row and column
      for (let i = 0; i <= n; i++) {
        grid[i][0].visited = true;
      }
      for (let j = 0; j <= capacity; j++) {
        grid[0][j].visited = true;
      }
      setGrid([...grid]);
      await sleep(animationSpeed);

      // Fill DP table
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
            const includeValue = grid[i-1][w-weight].value + value;
            grid[i][w].value = Math.max(grid[i][w].value, includeValue);
          }
          
          grid[i][w].visited = true;
          grid[i][w].isCurrentPath = false;
          setGrid([...grid]);
          await sleep(animationSpeed);
        }
      }

      // Highlight optimal value
      grid[n][capacity].highlighted = true;
      setGrid([...grid]);
    },
    languages: [
      {
        name: 'JavaScript',
        extension: 'js',
        runtimeStatus: 'ready',
        testRunner: createJavaScriptTestRunner('knapsack'),
        code: `function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null).map(() => Array(W + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(
          dp[i-1][w],
          dp[i-1][w-weights[i-1]] + values[i-1]
        );
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  
  return dp[n][W];
}`
      }
    ]
  },
  {
    id: 'climbingStairs',
    name: 'Climbing Stairs',
    description: 'Count number of ways to climb n stairs (1 or 2 steps at a time)',
    icon: <TrendingUp className="h-5 w-5" />,
    complexity: { time: 'O(n)', space: 'O(n)' },
    defaultParams: { n: 5 },
    paramControls: [
      { name: 'n', type: 'number', label: 'Number of Stairs', min: 1, max: 15, default: 5 }
    ],
    testCases: [
      { input: { n: 2 }, expected: 2, description: '2 stairs: [1,1] or [2]' },
      { input: { n: 3 }, expected: 3, description: '3 stairs: [1,1,1], [1,2], or [2,1]' }
    ],
    gridSetup: (rows: number, cols: number, params?: any) => {
      const { n = 5 } = params || {};
      const validN = Math.max(1, Math.min(n, 20)); // Ensure valid array length
      return Array(1).fill(null).map(() => 
        Array(validN + 1).fill(null).map((_, index) => ({
          value: index <= 1 ? 1 : 0,
          isPath: false,
          isCurrentPath: false,
          visited: index <= 1,
          highlighted: false
        }))
      );
    },
    animate: async (grid, setGrid, params, animationSpeed) => {
      const { n } = params;
      
      if (n <= 1) {
        grid[0][n].highlighted = true;
        setGrid([...grid]);
        return;
      }

      // Fill DP array
      for (let i = 2; i <= n; i++) {
        grid[0][i].isCurrentPath = true;
        setGrid([...grid]);
        await sleep(animationSpeed);
        
        grid[0][i].value = grid[0][i-1].value + grid[0][i-2].value;
        grid[0][i].visited = true;
        grid[0][i].isCurrentPath = false;
        
        setGrid([...grid]);
        await sleep(animationSpeed);
      }

      // Highlight result
      grid[0][n].highlighted = true;
      setGrid([...grid]);
    },
    languages: [
      {
        name: 'JavaScript',
        extension: 'js',
        runtimeStatus: 'ready',
        testRunner: createJavaScriptTestRunner('climbingStairs'),
        code: `function climbStairs(n) {
  if (n <= 1) return 1;
  
  const dp = new Array(n + 1);
  dp[0] = 1;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  
  return dp[n];
}`
      }
    ]
  }
];

export const OriginalVisualizerRoute: React.FC = () => {
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

  const currentAlgorithm = algorithms[selectedAlgorithm];
  const currentLanguage = currentAlgorithm.languages[selectedLanguage] || currentAlgorithm.languages[0];

  const initializeGrid = useCallback(() => {
    const newGrid = currentAlgorithm.gridSetup(rows, cols, algorithmParams);
    setGrid(newGrid);
  }, [currentAlgorithm, rows, cols, algorithmParams]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  useEffect(() => {
    setAlgorithmParams(currentAlgorithm.defaultParams);
    setRows(currentAlgorithm.defaultParams.rows || 4);
    setCols(currentAlgorithm.defaultParams.cols || 4);
    setCustomCode(currentLanguage?.code || '');
  }, [selectedAlgorithm, currentAlgorithm, currentLanguage]);

  const startVisualization = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    initializeGrid();
    
    try {
      await currentAlgorithm.animate(grid, setGrid, { rows, cols, ...algorithmParams }, animationSpeed);
    } catch (error) {
      console.error('Animation failed:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const resetVisualization = () => {
    setIsAnimating(false);
    initializeGrid();
  };

  const runTests = async () => {
    if (!currentLanguage) return;
    
    setIsRunningTests(true);
    setShowTests(true);
    
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

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;

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
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Algorithm Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Algorithm</h3>
              
              <div className="space-y-2">
                {algorithms.map((algorithm, index) => (
                  <button
                    key={algorithm.id}
                    onClick={() => setSelectedAlgorithm(index)}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                      selectedAlgorithm === index
                        ? 'bg-blue-50 border-blue-300 shadow-md'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {algorithm.icon}
                      <div>
                        <div className="font-medium text-gray-800">{algorithm.name}</div>
                        <div className="text-sm text-gray-600">{algorithm.complexity.time}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Parameters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Parameters</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={rows}
                      onChange={(e) => setRows(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={cols}
                      onChange={(e) => setCols(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Controls</h3>
              
              <div className="space-y-3">
                <button
                  onClick={startVisualization}
                  disabled={isAnimating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isAnimating ? 'Running...' : 'Start Visualization'}
                </button>
                
                <button
                  onClick={resetVisualization}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>

              {showSettings && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Animation Speed: {animationSpeed}ms
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Visualization */}
          <div className="lg:col-span-2 space-y-4">
            {/* Grid */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Visualization Grid</h3>
                <div className="text-sm text-gray-600">
                  {rows} × {cols} grid
                </div>
              </div>
              
              <div className="flex justify-center">
                <div 
                  className="grid gap-1 p-4"
                  style={{ 
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    maxWidth: '600px'
                  }}
                >
                  {grid.flat().map((_cell, index) => {
                    const row = Math.floor(index / cols);
                    const col = index % cols;
                    const cell = grid[row]?.[col];
                    
                    if (!cell) return null;
                    
                    return (
                      <div
                        key={index}
                        className={`
                          w-12 h-12 border-2 rounded-lg flex items-center justify-center
                          text-sm font-semibold transition-all duration-200
                          ${getCellColor(cell)}
                        `}
                      >
                        {formatCellValue(cell.value)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Language & Code Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Implementation</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1"
                  >
                    <Code className="h-4 w-4" />
                    {showCode ? 'Hide' : 'Show'} Code
                  </button>
                  
                  <button
                    onClick={runTests}
                    disabled={isRunningTests || !currentLanguage}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center gap-1"
                  >
                    <TestTube className="h-4 w-4" />
                    {isRunningTests ? 'Running...' : 'Test'}
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Programming Language</label>
                <div className="flex flex-wrap gap-2">
                  {currentAlgorithm.languages.map((language, index) => (
                    <button
                      key={language.name}
                      onClick={() => setSelectedLanguage(index)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                        selectedLanguage === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {language.name}
                      <span className={`w-2 h-2 rounded-full ${
                        language.runtimeStatus === 'ready' ? 'bg-green-400' :
                        language.runtimeStatus === 'loading' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Display/Editor */}
              {showCode && (
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
              )}

              {/* Original Code Display */}
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Original Code:</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    currentLanguage.runtimeStatus === 'ready' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'
                  }`}>
                    {currentLanguage.runtimeStatus === 'ready' ? 'Can Execute' : 'Simulated'}
                  </span>
                </div>
                <pre className="text-sm">
                  <code>{currentLanguage.code}</code>
                </pre>
              </div>

              {/* Test Results */}
              {showTests && testResults.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">Test Results</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        passedTests === totalTests ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {passedTests}/{totalTests} passed
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 rounded bg-white">
                        {result.passed ? 
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" /> :
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        }
                        <div className="flex-1">
                          <div className="text-sm">
                            <span className="font-medium">Test {index + 1}:</span>
                            <span className="ml-2">{currentAlgorithm.testCases[index]?.description}</span>
                          </div>
                          {!result.passed && result.error && (
                            <div className="text-xs text-red-600 mt-1">{result.error}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
