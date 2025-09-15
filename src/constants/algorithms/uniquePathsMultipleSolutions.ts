import { Grid3X3 } from 'lucide-react';
import type { Algorithm, AlgorithmSolution, TestCase } from '@/types';
import { sleep } from '@/utils';

// Test cases for Unique Paths algorithm
const uniquePathsTestCases: TestCase[] = [
  { input: { m: 3, n: 2 }, expected: 3, description: '3x2 grid has 3 unique paths' },
  { input: { m: 3, n: 7 }, expected: 28, description: '3x7 grid has 28 unique paths' },
  { input: { m: 1, n: 1 }, expected: 1, description: '1x1 grid has 1 unique path' },
  { input: { m: 2, n: 2 }, expected: 2, description: '2x2 grid has 2 unique paths' },
];

/**
 * Recursive Solution (Brute Force)
 * Strategy Pattern: Implements recursive strategy for solving unique paths
 */
const recursiveSolution: AlgorithmSolution = {
  id: 'uniquepaths-recursive',
  name: 'Recursive (Brute Force)',
  description: 'Pure recursive solution exploring all possible paths - exponential time complexity',
  approach: 'recursive',
  difficulty: 'beginner',

  complexity: {
    time: {
      best: 'O(2^(m+n))',
      average: 'O(2^(m+n))',
      worst: 'O(2^(m+n))',
      explanation: 'Each cell explores 2 directions, creating exponential branching'
    },
    space: {
      complexity: 'O(m+n)',
      explanation: 'Maximum recursion depth is m+n for the path length'
    },
    characteristics: ['Exponential Time', 'Deep Recursion', 'Simple Logic', 'Educational']
  },

  code: {
    javascript: `
function uniquePaths(m, n) {
    // Base case: reached destination
    if (m === 1 || n === 1) {
        return 1;
    }
    
    // Two choices: go right or go down
    return uniquePaths(m - 1, n) + uniquePaths(m, n - 1);
}`,
    
    python: `
def unique_paths(m, n):
    # Base case: reached destination
    if m == 1 or n == 1:
        return 1
    
    # Two choices: go right or go down
    return unique_paths(m - 1, n) + unique_paths(m, n - 1)`,
    
    java: `
public static int uniquePaths(int m, int n) {
    // Base case: reached destination
    if (m == 1 || n == 1) {
        return 1;
    }
    
    // Two choices: go right or go down
    return uniquePaths(m - 1, n) + uniquePaths(m, n - 1);
}`,

    typescript: `
function uniquePaths(m: number, n: number): number {
    // Base case: reached destination
    if (m === 1 || n === 1) {
        return 1;
    }
    
    // Two choices: go right or go down
    return uniquePaths(m - 1, n) + uniquePaths(m, n - 1);
}`,

    go: `
func uniquePaths(m, n int) int {
    // Base case: reached destination
    if m == 1 || n == 1 {
        return 1
    }
    
    // Two choices: go right or go down
    return uniquePaths(m-1, n) + uniquePaths(m, n-1)
}`,

    rust: `
fn unique_paths(m: usize, n: usize) -> usize {
    // Base case: reached destination
    if m == 1 || n == 1 {
        return 1;
    }
    
    // Two choices: go right or go down
    unique_paths(m - 1, n) + unique_paths(m, n - 1)
}`
  },

  whenToUse: 'Understanding the problem structure and recursive thinking. Best for educational purposes to grasp the fundamental approach.',
  
  pros: [
    'Extremely simple and intuitive logic',
    'Direct translation of problem statement',
    'Easy to understand and implement',
    'Great for learning recursive thinking'
  ],
  
  cons: [
    'Exponential time complexity O(2^(m+n))',
    'Stack overflow for large inputs',
    'Recomputes same subproblems multiple times',
    'Impractical for real-world use'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;
    const { m, n } = testCase as { m: number; n: number };

    // Create visualization grid
    const grid = Array(m).fill(null).map(() => 
      Array(n).fill(null).map(() => ({
        value: 0,
        visited: false,
        highlighted: false
      }))
    );

    updateGrid(grid);
    await sleep(500);

    // Simulate recursive exploration (simplified for visualization)
    const simulateRecursion = async (row: number, col: number, depth: number): Promise<number> => {
      operations++;
      
      if (row >= m || col >= n) return 0;
      if (row === m - 1 && col === n - 1) return 1;

      // Highlight current position
      if (grid[row] && grid[row][col]) {
        grid[row][col].highlighted = true;
        updateGrid([...grid]);
        await sleep(200);
        grid[row][col].highlighted = false;
      }

      // Explore paths (simplified)
      const paths = await simulateRecursion(row + 1, col, depth + 1) +
                   await simulateRecursion(row, col + 1, depth + 1);
      
      return paths;
    };

    await simulateRecursion(0, 0, 0);

    const endTime = performance.now();
    onMetrics({
      executionTime: endTime - startTime,
      operations,
      memoryUsed: operations * 64, // Rough estimate for recursion stack
      comparisons: operations
    });
  }
};

/**
 * Memoization Solution (Top-down DP)
 * Strategy Pattern: Implements memoized recursive strategy
 */
const memoizationSolution: AlgorithmSolution = {
  id: 'uniquepaths-memoization',
  name: 'Memoization (Top-down)',
  description: 'Recursive approach enhanced with memoization to cache computed results',
  approach: 'memoization',
  difficulty: 'intermediate',

  complexity: {
    time: {
      best: 'O(m×n)',
      average: 'O(m×n)',
      worst: 'O(m×n)',
      explanation: 'Each subproblem (m,n) is computed once and cached'
    },
    space: {
      complexity: 'O(m×n)',
      explanation: 'Memo table of size m×n plus recursion stack of depth m+n'
    },
    characteristics: ['Polynomial Time', 'Top-down DP', 'Recursive Structure', 'Caching']
  },

  code: {
    javascript: `
function uniquePaths(m, n, memo = new Map()) {
    const key = m + ',' + n;
    
    // Check memo cache
    if (memo.has(key)) {
        return memo.get(key);
    }
    
    // Base case
    if (m === 1 || n === 1) {
        memo.set(key, 1);
        return 1;
    }
    
    // Compute and cache result
    const result = uniquePaths(m - 1, n, memo) + uniquePaths(m, n - 1, memo);
    memo.set(key, result);
    return result;
}`,

    python: `
def unique_paths(m, n, memo=None):
    if memo is None:
        memo = {}
    
    key = (m, n)
    
    # Check memo cache
    if key in memo:
        return memo[key]
    
    # Base case
    if m == 1 or n == 1:
        memo[key] = 1
        return 1
    
    # Compute and cache result
    result = unique_paths(m - 1, n, memo) + unique_paths(m, n - 1, memo)
    memo[key] = result
    return result`
  },

  whenToUse: 'When you want to maintain recursive structure but need much better performance than pure recursion.',
  
  pros: [
    'Maintains intuitive recursive structure',
    'Dramatically better performance than pure recursion',
    'Easy to implement from recursive solution',
    'Good balance of clarity and efficiency'
  ],
  
  cons: [
    'Still uses recursion stack space',
    'Can cause stack overflow for very large inputs',
    'Slightly more complex than pure recursion',
    'Memory overhead for memoization table'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;
    const { m, n } = testCase as { m: number; n: number };

    const grid = Array(m).fill(null).map(() => 
      Array(n).fill(null).map(() => ({
        value: 0,
        visited: false,
        highlighted: false
      }))
    );

    updateGrid(grid);
    await sleep(500);

    // Simulate memoized computation
    const memo = new Map();
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        operations++;
        const key = `${m-i},${n-j}`;
        
        if (!memo.has(key)) {
          grid[i][j].highlighted = true;
          updateGrid([...grid]);
          await sleep(150);
          
          // Calculate value
          if (i === m-1 || j === n-1) {
            grid[i][j].value = 1;
          } else {
            const right = memo.get(`${m-i-1},${n-j}`) || 0;
            const down = memo.get(`${m-i},${n-j-1}`) || 0;
            grid[i][j].value = right + down;
          }
          
          memo.set(key, grid[i][j].value);
          grid[i][j].visited = true;
          grid[i][j].highlighted = false;
          updateGrid([...grid]);
          await sleep(100);
        }
      }
    }

    const endTime = performance.now();
    onMetrics({
      executionTime: endTime - startTime,
      operations,
      memoryUsed: m * n * 32 + operations * 32,
      comparisons: operations
    });
  }
};

/**
 * Tabulation Solution (Bottom-up DP)
 * Strategy Pattern: Implements iterative tabulation strategy
 */
const tabulationSolution: AlgorithmSolution = {
  id: 'uniquepaths-tabulation',
  name: 'Tabulation (Bottom-up)',
  description: 'Iterative dynamic programming building up from base cases to final solution',
  approach: 'tabulation',
  difficulty: 'intermediate',

  complexity: {
    time: {
      best: 'O(m×n)',
      average: 'O(m×n)',
      worst: 'O(m×n)',
      explanation: 'Nested loops iterate through all m×n cells once'
    },
    space: {
      complexity: 'O(m×n)',
      explanation: '2D DP table of size m×n'
    },
    characteristics: ['Polynomial Time', 'Bottom-up DP', 'Iterative', 'No Recursion']
  },

  code: {
    javascript: `
function uniquePaths(m, n) {
    // Create DP table
    const dp = Array(m).fill(null).map(() => Array(n).fill(0));
    
    // Initialize first row and column
    for (let i = 0; i < m; i++) {
        dp[i][0] = 1;
    }
    for (let j = 0; j < n; j++) {
        dp[0][j] = 1;
    }
    
    // Fill DP table
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}`,

    python: `
def unique_paths(m, n):
    # Create DP table
    dp = [[0] * n for _ in range(m)]
    
    # Initialize first row and column
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

  whenToUse: 'Standard production implementation. Best balance of clarity, performance, and reliability.',
  
  pros: [
    'No recursion stack overflow risk',
    'Clear iterative logic',
    'Standard DP pattern that\'s widely understood',
    'Predictable memory usage',
    'Easy to optimize further'
  ],
  
  cons: [
    'Less intuitive than recursive approaches',
    'Requires understanding of DP table construction',
    'Uses O(m×n) space even when optimization is possible'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;
    const { m, n } = testCase as { m: number; n: number };

    const grid = Array(m).fill(null).map(() => 
      Array(n).fill(null).map(() => ({
        value: 0,
        visited: false,
        highlighted: false
      }))
    );

    // Initialize first row and column
    for (let i = 0; i < m; i++) {
      grid[i][0].value = 1;
      grid[i][0].visited = true;
    }
    for (let j = 0; j < n; j++) {
      grid[0][j].value = 1;
      grid[0][j].visited = true;
    }
    
    updateGrid([...grid]);
    await sleep(500);

    // Fill DP table
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        operations++;
        
        grid[i][j].highlighted = true;
        updateGrid([...grid]);
        await sleep(200);
        
        grid[i][j].value = grid[i-1][j].value + grid[i][j-1].value;
        grid[i][j].visited = true;
        grid[i][j].highlighted = false;
        
        updateGrid([...grid]);
        await sleep(150);
      }
    }

    const endTime = performance.now();
    onMetrics({
      executionTime: endTime - startTime,
      operations,
      memoryUsed: m * n * 32,
      comparisons: operations * 2 // Each cell reads from 2 neighbors
    });
  }
};

/**
 * Space Optimized Solution
 * Strategy Pattern: Implements space-optimized iterative strategy
 */
const spaceOptimizedSolution: AlgorithmSolution = {
  id: 'uniquepaths-optimized',
  name: 'Space Optimized',
  description: 'Space-efficient solution using only O(min(m,n)) space while maintaining optimal time complexity',
  approach: 'space_optimized',
  difficulty: 'advanced',

  complexity: {
    time: {
      best: 'O(m×n)',
      average: 'O(m×n)',
      worst: 'O(m×n)',
      explanation: 'Same time complexity as tabulation'
    },
    space: {
      complexity: 'O(min(m,n))',
      explanation: 'Only store one row/column of the DP table at a time'
    },
    characteristics: ['Space Optimal', 'Production Ready', 'Memory Efficient', 'Advanced']
  },

  code: {
    javascript: `
function uniquePaths(m, n) {
    // Use smaller dimension for space optimization
    if (m > n) {
        return uniquePaths(n, m);
    }
    
    // Only need to store one row
    let dp = Array(m).fill(1);
    
    // Process column by column
    for (let j = 1; j < n; j++) {
        for (let i = 1; i < m; i++) {
            dp[i] += dp[i-1];
        }
    }
    
    return dp[m-1];
}`,

    python: `
def unique_paths(m, n):
    # Use smaller dimension for space optimization
    if m > n:
        return unique_paths(n, m)
    
    # Only need to store one row
    dp = [1] * m
    
    # Process column by column
    for j in range(1, n):
        for i in range(1, m):
            dp[i] += dp[i-1]
    
    return dp[m-1]`
  },

  whenToUse: 'Production systems with memory constraints or when processing very large grids.',
  
  pros: [
    'Optimal space complexity O(min(m,n))',
    'Same time complexity as standard DP',
    'Memory-efficient for large inputs',
    'No recursion overhead',
    'Production-ready performance'
  ],
  
  cons: [
    'More complex to understand',
    'Less intuitive than 2D DP table approach',
    'Harder to debug and visualize',
    'Requires careful handling of array updates'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;
    const { m, n } = testCase as { m: number; n: number };

    // For visualization, we'll show the optimization process
    let actualM = m, actualN = n;
    if (m > n) {
      actualM = n;
      actualN = m;
    }

    // Create a single row for visualization
    const grid = Array(1).fill(null).map(() => 
      Array(actualM).fill(null).map(() => ({
        value: 1,
        visited: true,
        highlighted: false
      }))
    );

    updateGrid(grid);
    await sleep(500);

    // Simulate space-optimized computation
    for (let j = 1; j < actualN; j++) {
      for (let i = 1; i < actualM; i++) {
        operations++;
        
        grid[0][i].highlighted = true;
        updateGrid([...grid]);
        await sleep(200);
        
        grid[0][i].value += grid[0][i-1].value;
        grid[0][i].highlighted = false;
        
        updateGrid([...grid]);
        await sleep(150);
      }
    }

    const endTime = performance.now();
    onMetrics({
      executionTime: endTime - startTime,
      operations,
      memoryUsed: Math.min(m, n) * 32, // Optimal space usage
      comparisons: operations
    });
  }
};

/**
 * Main Unique Paths Algorithm Definition
 * Template Method Pattern: Defines the overall structure with multiple solution strategies
 */
export const uniquePathsMultipleSolutions: Algorithm = {
  id: 'uniquePaths',
  name: 'Unique Paths',
  description: 'Find the number of unique paths from top-left to bottom-right corner of a grid, moving only right or down.',
  category: 'dynamic_programming',
  difficulty: 'medium',
  icon: Grid3X3,

  solutions: [
    recursiveSolution,
    memoizationSolution,
    tabulationSolution,
    spaceOptimizedSolution
  ],
  defaultSolutionId: 'uniquepaths-tabulation',

  concepts: [
    'Dynamic Programming',
    'Memoization', 
    'Tabulation',
    'Space Optimization',
    'Recursion',
    'Grid Traversal',
    'Combinatorics'
  ],
  relatedAlgorithms: ['coinChange', 'minPathSum', 'robotPaths', 'pascalTriangle'],
  realWorldApplications: [
    'Robot navigation and path planning',
    'Network routing optimization',
    'Game AI pathfinding',
    'Logistics and delivery route optimization',
    'VLSI chip design and routing'
  ],
  prerequisites: ['Basic Recursion', '2D Arrays', 'Mathematical Induction'],

  testCases: uniquePathsTestCases,
  defaultParams: { m: 4, n: 4 },
  paramControls: [
    { name: 'm', type: 'number', label: 'Grid Height (m)', min: 1, max: 15, default: 4 },
    { name: 'n', type: 'number', label: 'Grid Width (n)', min: 1, max: 15, default: 4 }
  ],

  gridSetup: (rows: number, cols: number, params?: Record<string, unknown>) => {
    const { m = rows, n = cols } = params || {};
    return Array(m).fill(null).map(() => 
      Array(n).fill(null).map(() => ({
        value: 0,
        visited: false,
        highlighted: false
      }))
    );
  },

  tags: ['dynamic-programming', 'grid', 'combinatorics', 'optimization'],
  estimatedTime: 30,
  practiceLevel: 'implementation',

  insights: {
    keyLearnings: [
      'Dynamic Programming can transform exponential problems into polynomial ones',
      'Memoization maintains recursive structure while adding efficiency',
      'Bottom-up DP avoids recursion stack limitations',
      'Space optimization can reduce memory usage without sacrificing time complexity',
      'The problem has a beautiful combinatorial solution: C(m+n-2, m-1)'
    ],
    optimizationTips: [
      'Always use the smaller dimension for space optimization',
      'Consider the mathematical formula for very large inputs',
      'Memoization works well when the recursion tree has overlapping subproblems',
      'Tabulation is generally preferred for production code due to predictable performance'
    ],
    commonMistakes: [
      'Forgetting to handle base cases (m=1 or n=1)',
      'Off-by-one errors in array indexing',
      'Not initializing the DP table properly',
      'Confusing the direction of traversal in space optimization'
    ],
    realWorldScenarios: [
      {
        title: 'Robot Path Planning',
        description: 'Autonomous robots use similar algorithms to find optimal paths in grid-based environments',
        complexity: 'Extended with obstacles and weighted paths'
      },
      {
        title: 'Network Routing',
        description: 'Internet packet routing uses DP principles to find optimal paths through network topology',
        complexity: 'Considers network congestion and link costs'
      }
    ]
  }
};