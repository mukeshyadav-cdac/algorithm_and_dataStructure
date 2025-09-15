import { Grid3X3 } from 'lucide-react';
import type { Algorithm, Cell, TestCase } from '../../types/algorithm';
import type { AlgorithmSolution } from '../../types/complexity';
import { sleep } from '../../utils/animationUtils';

/**
 * Unique Paths Algorithm with Multiple Solutions
 * Demonstrates different approaches to solving the classic DP problem
 */

// Test cases for unique paths
const uniquePathsTestCases: TestCase[] = [
  { input: { m: 3, n: 7 }, expected: 28, description: "3x7 grid" },
  { input: { m: 3, n: 2 }, expected: 3, description: "3x2 grid" },
  { input: { m: 7, n: 3 }, expected: 28, description: "7x3 grid" },
  { input: { m: 3, n: 3 }, expected: 6, description: "3x3 grid" },
  { input: { m: 1, n: 1 }, expected: 1, description: "1x1 grid" },
  { input: { m: 4, n: 4 }, expected: 20, description: "4x4 grid" },
];

// Solution 1: Recursive (Brute Force)
const recursiveSolution: AlgorithmSolution = {
  id: 'uniquePaths-recursive',
  name: 'Recursive (Brute Force)',
  approach: 'recursive',
  description: 'Simple recursive solution that explores all possible paths. Highly intuitive but exponentially slow.',
  difficulty: 'beginner',
  complexity: {
    time: {
      best: 'O(2^(m+n))',
      average: 'O(2^(m+n))',
      worst: 'O(2^(m+n))',
      explanation: 'Each cell has 2 choices (right/down), leading to exponential branching',
      variables: { 'm': 'number of rows', 'n': 'number of columns' }
    },
    space: {
      complexity: 'O(m+n)',
      explanation: 'Recursion stack depth equals the path length',
      auxiliary: 'O(m+n) for call stack',
      inPlace: true
    },
    characteristics: ['Recursive', 'Exponential Time', 'Simple Logic', 'Stack Heavy'],
    tradeoffs: ['Readable and intuitive', 'Extremely slow for large inputs', 'No optimization']
  },
  code: {
    javascript: `
function uniquePaths(m, n) {
    // Base case: if we're at the edge, there's only one way
    if (m === 1 || n === 1) {
        return 1;
    }
    
    // Recursive case: sum of paths from top and left
    return uniquePaths(m - 1, n) + uniquePaths(m, n - 1);
}`,
    python: `
def unique_paths(m, n):
    """Recursive solution - explores all possible paths"""
    # Base case: edge of grid has only one path
    if m == 1 or n == 1:
        return 1
    
    # Recursive case: paths from above + paths from left
    return unique_paths(m - 1, n) + unique_paths(m, n - 1)`,
    java: `
public static int uniquePaths(int m, int n) {
    // Base case: if we're at the edge, there's only one way
    if (m == 1 || n == 1) {
        return 1;
    }
    
    // Recursive case: sum of paths from top and left
    return uniquePaths(m - 1, n) + uniquePaths(m, n - 1);
}`,
    go: `
func uniquePaths(m, n int) int {
    // Base case: edge of grid
    if m == 1 || n == 1 {
        return 1
    }
    
    // Recursive case: sum paths from top and left
    return uniquePaths(m-1, n) + uniquePaths(m, n-1)
}`,
    ruby: `
def unique_paths(m, n)
  # Base case: edge of grid has only one path
  return 1 if m == 1 || n == 1
  
  # Recursive case: paths from above + paths from left
  unique_paths(m - 1, n) + unique_paths(m, n - 1)
end`,
    typescript: `
function uniquePaths(m: number, n: number): number {
    // Base case: if we're at the edge, there's only one way
    if (m === 1 || n === 1) {
        return 1;
    }
    
    // Recursive case: sum of paths from top and left
    return uniquePaths(m - 1, n) + uniquePaths(m, n - 1);
}`
  },
  pros: [
    'Extremely readable and intuitive',
    'Direct translation of problem definition',
    'Easy to understand for beginners',
    'No additional space for data structures'
  ],
  cons: [
    'Exponential time complexity - unusable for large inputs',
    'Recalculates same subproblems many times',
    'Stack overflow risk for large grids',
    'No practical value beyond education'
  ],
  whenToUse: 'Only for educational purposes to understand the problem structure. Never use in production.',
  steps: [
    { title: 'Base Case', description: 'If we are at the edge (m=1 or n=1), there is only one path' },
    { title: 'Recursive Case', description: 'Total paths = paths from above + paths from left' },
    { title: 'Branching', description: 'Each call spawns two more calls, creating exponential growth' }
  ],
  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const { m, n } = testCase.input;
    const grid: Cell[][] = Array(m).fill(null).map(() => 
      Array(n).fill(null).map(() => ({
        value: 0,
        isPath: false,
        isCurrentPath: false,
        visited: false,
        highlighted: false
      }))
    );

    let operations = 0;
    let recursionDepth = 0;
    let maxRecursionDepth = 0;

    const solve = async (row: number, col: number): Promise<number> => {
      operations++;
      recursionDepth++;
      maxRecursionDepth = Math.max(maxRecursionDepth, recursionDepth);
      
      // Highlight current cell
      if (row < m && col < n) {
        grid[row][col].isCurrentPath = true;
        grid[row][col].visited = true;
        updateGrid([...grid]);
        await sleep(50); // Slow animation to show exponential calls
      }
      
      onMetrics?.({
        executionTime: 0,
        memoryUsage: recursionDepth * 64, // Estimate stack frame size
        operations,
        comparisons: operations,
        assignments: 0,
        recursionDepth,
        spaceUsed: recursionDepth * 64,
        inputSize: m * n
      });

      // Base case
      if (row === 0 || col === 0) {
        if (row < m && col < n) {
          grid[row][col].value = 1;
          grid[row][col].isCurrentPath = false;
          updateGrid([...grid]);
        }
        recursionDepth--;
        return 1;
      }

      // Recursive calls
      const fromTop = await solve(row - 1, col);
      const fromLeft = await solve(row, col - 1);
      const result = fromTop + fromLeft;

      if (row < m && col < n) {
        grid[row][col].value = result;
        grid[row][col].isCurrentPath = false;
        updateGrid([...grid]);
      }
      
      recursionDepth--;
      return result;
    };

    const result = await solve(m - 1, n - 1);
    return result;
  }
};

// Solution 2: Memoization (Top-down DP)
const memoizationSolution: AlgorithmSolution = {
  id: 'uniquePaths-memoization',
  name: 'Memoization (Top-down DP)',
  approach: 'memoization',
  description: 'Recursive solution with caching to avoid recalculating subproblems. Optimal time with manageable space.',
  difficulty: 'intermediate',
  complexity: {
    time: {
      best: 'O(m × n)',
      average: 'O(m × n)',
      worst: 'O(m × n)',
      explanation: 'Each cell is calculated exactly once and cached for future use',
      variables: { 'm': 'number of rows', 'n': 'number of columns' }
    },
    space: {
      complexity: 'O(m × n)',
      explanation: 'Memo table stores result for each cell plus recursion stack',
      auxiliary: 'O(m × n) for memoization + O(m + n) for recursion stack',
      inPlace: false
    },
    characteristics: ['Top-down', 'Cached Results', 'Recursive', 'Optimal Time'],
    tradeoffs: ['Fast execution after first calculation', 'Uses extra memory for cache', 'Still has recursion overhead']
  },
  code: {
    javascript: `
function uniquePaths(m, n) {
    // Create memoization table
    const memo = new Map();
    
    function dp(row, col) {
        // Base case
        if (row === 1 || col === 1) {
            return 1;
        }
        
        // Check memo
        const key = \`\${row},\${col}\`;
        if (memo.has(key)) {
            return memo.get(key);
        }
        
        // Calculate and memoize
        const result = dp(row - 1, col) + dp(row, col - 1);
        memo.set(key, result);
        return result;
    }
    
    return dp(m, n);
}`,
    python: `
def unique_paths(m, n):
    """Memoized solution - caches calculated results"""
    memo = {}
    
    def dp(row, col):
        # Base case
        if row == 1 or col == 1:
            return 1
        
        # Check cache
        if (row, col) in memo:
            return memo[(row, col)]
        
        # Calculate and cache
        result = dp(row - 1, col) + dp(row, col - 1)
        memo[(row, col)] = result
        return result
    
    return dp(m, n)`,
    java: `
public static int uniquePaths(int m, int n) {
    Map<String, Integer> memo = new HashMap<>();
    
    return dp(m, n, memo);
}

private static int dp(int row, int col, Map<String, Integer> memo) {
    // Base case
    if (row == 1 || col == 1) {
        return 1;
    }
    
    // Check memo
    String key = row + "," + col;
    if (memo.containsKey(key)) {
        return memo.get(key);
    }
    
    // Calculate and memoize
    int result = dp(row - 1, col, memo) + dp(row, col - 1, memo);
    memo.put(key, result);
    return result;
}`,
    typescript: `
function uniquePaths(m: number, n: number): number {
    // Create memoization table
    const memo = new Map<string, number>();
    
    function dp(row: number, col: number): number {
        // Base case
        if (row === 1 || col === 1) {
            return 1;
        }
        
        // Check memo
        const key = \`\${row},\${col}\`;
        if (memo.has(key)) {
            return memo.get(key)!;
        }
        
        // Calculate and memoize
        const result = dp(row - 1, col) + dp(row, col - 1);
        memo.set(key, result);
        return result;
    }
    
    return dp(m, n);
}`
  },
  pros: [
    'Optimal O(m×n) time complexity',
    'Each subproblem solved exactly once',
    'Natural recursive structure',
    'Easy to convert from naive recursion'
  ],
  cons: [
    'O(m×n) space for memoization table',
    'Still has recursion stack overhead',
    'Hash map operations have some overhead',
    'Not as space-efficient as tabulation'
  ],
  whenToUse: 'When you prefer top-down thinking and have sufficient memory. Good for sparse subproblem spaces.',
  steps: [
    { title: 'Memoization Setup', description: 'Create a cache (Map/dictionary) to store calculated results' },
    { title: 'Base Case Check', description: 'Return 1 for edge cases (row=1 or col=1)' },
    { title: 'Cache Lookup', description: 'Check if result already exists in memo table' },
    { title: 'Recursive Calculation', description: 'If not cached, calculate recursively and store result' }
  ],
  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const { m, n } = testCase.input;
    const grid: Cell[][] = Array(m).fill(null).map(() => 
      Array(n).fill(null).map(() => ({
        value: 0,
        isPath: false,
        isCurrentPath: false,
        visited: false,
        highlighted: false
      }))
    );

    const memo = new Map<string, number>();
    let operations = 0;
    let cacheHits = 0;
    let cacheMisses = 0;

    const solve = async (row: number, col: number): Promise<number> => {
      operations++;
      
      // Highlight current cell
      if (row > 0 && col > 0 && row <= m && col <= n) {
        grid[row-1][col-1].isCurrentPath = true;
        updateGrid([...grid]);
        await sleep(100);
      }
      
      // Base case
      if (row === 1 || col === 1) {
        if (row > 0 && col > 0 && row <= m && col <= n) {
          grid[row-1][col-1].value = 1;
          grid[row-1][col-1].visited = true;
          grid[row-1][col-1].isCurrentPath = false;
          updateGrid([...grid]);
        }
        return 1;
      }

      // Check memo
      const key = `${row},${col}`;
      if (memo.has(key)) {
        cacheHits++;
        if (row > 0 && col > 0 && row <= m && col <= n) {
          grid[row-1][col-1].highlighted = true; // Show cache hit
          grid[row-1][col-1].isCurrentPath = false;
          updateGrid([...grid]);
        }
        
        onMetrics?.({
          executionTime: 0,
          memoryUsage: memo.size * 64,
          operations,
          comparisons: operations,
          assignments: memo.size,
          cacheHits,
          cacheMisses,
          spaceUsed: memo.size * 64,
          inputSize: m * n
        });
        
        return memo.get(key)!;
      }

      cacheMisses++;
      
      // Calculate and memoize
      const fromTop = await solve(row - 1, col);
      const fromLeft = await solve(row, col - 1);
      const result = fromTop + fromLeft;
      
      memo.set(key, result);
      
      if (row > 0 && col > 0 && row <= m && col <= n) {
        grid[row-1][col-1].value = result;
        grid[row-1][col-1].visited = true;
        grid[row-1][col-1].isCurrentPath = false;
        updateGrid([...grid]);
      }
      
      onMetrics?.({
        executionTime: 0,
        memoryUsage: memo.size * 64,
        operations,
        comparisons: operations,
        assignments: memo.size,
        cacheHits,
        cacheMisses,
        spaceUsed: memo.size * 64,
        inputSize: m * n
      });

      return result;
    };

    const result = await solve(m, n);
    return result;
  }
};

// Solution 3: Tabulation (Bottom-up DP)
const tabulationSolution: AlgorithmSolution = {
  id: 'uniquePaths-tabulation',
  name: 'Tabulation (Bottom-up DP)',
  approach: 'tabulation',
  description: 'Iterative bottom-up approach that fills a DP table. Most common and efficient DP solution.',
  difficulty: 'intermediate',
  complexity: {
    time: {
      best: 'O(m × n)',
      average: 'O(m × n)',
      worst: 'O(m × n)',
      explanation: 'Single pass through all cells in the grid',
      variables: { 'm': 'number of rows', 'n': 'number of columns' }
    },
    space: {
      complexity: 'O(m × n)',
      explanation: 'DP table stores the number of paths to each cell',
      auxiliary: 'O(m × n) for the DP table',
      inPlace: false
    },
    characteristics: ['Bottom-up', 'Iterative', 'No Recursion', 'Cache Friendly'],
    tradeoffs: ['No recursion overhead', 'Better cache locality', 'Easy to optimize space', 'Slightly more complex logic']
  },
  code: {
    javascript: `
function uniquePaths(m, n) {
    // Create DP table
    const dp = Array(m).fill(null).map(() => Array(n).fill(0));
    
    // Initialize first row and column
    for (let i = 0; i < m; i++) dp[i][0] = 1;
    for (let j = 0; j < n; j++) dp[0][j] = 1;
    
    // Fill the table
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}`,
    python: `
def unique_paths(m, n):
    """Tabulation solution - builds table bottom-up"""
    # Create DP table
    dp = [[0] * n for _ in range(m)]
    
    # Initialize first row and column
    for i in range(m):
        dp[i][0] = 1
    for j in range(n):
        dp[0][j] = 1
    
    # Fill the table
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]`,
    java: `
public static int uniquePaths(int m, int n) {
    // Create DP table
    int[][] dp = new int[m][n];
    
    // Initialize first row and column
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;
    
    // Fill the table
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}`,
    typescript: `
function uniquePaths(m: number, n: number): number {
    // Create DP table
    const dp: number[][] = Array(m).fill(null).map(() => Array(n).fill(0));
    
    // Initialize first row and column
    for (let i = 0; i < m; i++) dp[i][0] = 1;
    for (let j = 0; j < n; j++) dp[0][j] = 1;
    
    // Fill the table
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}`
  },
  pros: [
    'Optimal O(m×n) time complexity',
    'No recursion stack overhead',
    'Better cache locality than recursion',
    'Easy to optimize space further',
    'Most common DP approach'
  ],
  cons: [
    'O(m×n) space for DP table',
    'Less intuitive than recursive approach',
    'Need to think about iteration order',
    'Harder to optimize for sparse problems'
  ],
  whenToUse: 'Default choice for DP problems. Use when you need optimal time complexity without recursion overhead.',
  steps: [
    { title: 'Create DP Table', description: 'Initialize m×n table to store subproblem results' },
    { title: 'Base Cases', description: 'Fill first row and column with 1s (only one path along edges)' },
    { title: 'Fill Table', description: 'For each cell, sum the values from top and left neighbors' },
    { title: 'Return Result', description: 'Bottom-right cell contains the total number of paths' }
  ],
  visualizer: async (testCase, updateGrid, setStep, onMetrics) => {
    const { m, n } = testCase.input;
    const grid: Cell[][] = Array(m).fill(null).map(() => 
      Array(n).fill(null).map(() => ({
        value: 0,
        isPath: false,
        isCurrentPath: false,
        visited: false,
        highlighted: false
      }))
    );

    let operations = 0;
    let assignments = 0;

    // Initialize first row
    setStep(0);
    for (let j = 0; j < n; j++) {
      grid[0][j].value = 1;
      grid[0][j].visited = true;
      grid[0][j].highlighted = true;
      assignments++;
      updateGrid([...grid]);
      await sleep(200);
    }

    // Initialize first column
    setStep(1);
    for (let i = 0; i < m; i++) {
      grid[i][0].value = 1;
      grid[i][0].visited = true;
      grid[i][0].highlighted = true;
      assignments++;
      updateGrid([...grid]);
      await sleep(200);
    }

    // Clear highlights
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        grid[i][j].highlighted = false;
      }
    }
    updateGrid([...grid]);

    // Fill the table
    setStep(2);
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        operations++;
        
        // Highlight current cell and dependencies
        grid[i][j].isCurrentPath = true;
        grid[i-1][j].highlighted = true; // Top
        grid[i][j-1].highlighted = true; // Left
        updateGrid([...grid]);
        await sleep(300);
        
        // Calculate value
        const fromTop = grid[i-1][j].value as number;
        const fromLeft = grid[i][j-1].value as number;
        grid[i][j].value = fromTop + fromLeft;
        grid[i][j].visited = true;
        assignments++;
        
        // Clear highlights
        grid[i][j].isCurrentPath = false;
        grid[i-1][j].highlighted = false;
        grid[i][j-1].highlighted = false;
        
        updateGrid([...grid]);
        
        onMetrics?.({
          executionTime: 0,
          memoryUsage: m * n * 32, // 32 bits per integer
          operations,
          comparisons: 0,
          assignments,
          spaceUsed: m * n * 32,
          inputSize: m * n
        });
      }
    }

    setStep(3);
    // Highlight final result
    grid[m-1][n-1].highlighted = true;
    updateGrid([...grid]);
    
    return grid[m-1][n-1].value;
  }
};

// Solution 4: Space Optimized (1D DP)
const spaceOptimizedSolution: AlgorithmSolution = {
  id: 'uniquePaths-spaceOptimized',
  name: 'Space Optimized (1D DP)',
  approach: 'optimized',
  description: 'Space-optimized tabulation using only O(n) space. Optimal for memory-constrained environments.',
  difficulty: 'advanced',
  complexity: {
    time: {
      best: 'O(m × n)',
      average: 'O(m × n)',
      worst: 'O(m × n)',
      explanation: 'Still need to process each cell once, but with constant row operations',
      variables: { 'm': 'number of rows', 'n': 'number of columns' }
    },
    space: {
      complexity: 'O(min(m, n))',
      explanation: 'Only need to store one row/column at a time',
      auxiliary: 'O(min(m, n)) for the DP array',
      inPlace: false
    },
    characteristics: ['Space Optimized', 'Iterative', 'Memory Efficient', 'In-place Updates'],
    tradeoffs: ['Minimal memory usage', 'Same time complexity', 'More complex to understand', 'Harder to debug']
  },
  code: {
    javascript: `
function uniquePaths(m, n) {
    // Use the smaller dimension for the DP array
    const [rows, cols] = m < n ? [m, n] : [n, m];
    
    // DP array represents one row/column
    const dp = new Array(rows).fill(1);
    
    // Process each column
    for (let j = 1; j < cols; j++) {
        for (let i = 1; i < rows; i++) {
            dp[i] += dp[i-1];
        }
    }
    
    return dp[rows-1];
}`,
    python: `
def unique_paths(m, n):
    """Space optimized - uses only O(min(m,n)) space"""
    # Use smaller dimension for DP array
    rows, cols = (m, n) if m < n else (n, m)
    
    # DP array represents one row/column  
    dp = [1] * rows
    
    # Process each column
    for j in range(1, cols):
        for i in range(1, rows):
            dp[i] += dp[i-1]
    
    return dp[rows-1]`,
    typescript: `
function uniquePaths(m: number, n: number): number {
    // Use the smaller dimension for the DP array
    const [rows, cols] = m < n ? [m, n] : [n, m];
    
    // DP array represents one row/column
    const dp: number[] = new Array(rows).fill(1);
    
    // Process each column
    for (let j = 1; j < cols; j++) {
        for (let i = 1; i < rows; i++) {
            dp[i] += dp[i-1];
        }
    }
    
    return dp[rows-1];
}`
  },
  pros: [
    'Minimal O(min(m,n)) space complexity',
    'Same optimal time complexity',
    'Great for memory-constrained systems',
    'Still iterative with no recursion'
  ],
  cons: [
    'More complex to understand and implement',
    'Harder to debug and trace',
    'Less intuitive than 2D approach',
    'Cannot easily reconstruct the path'
  ],
  whenToUse: 'When memory is very limited or for very large grids. Production systems with strict memory requirements.',
  steps: [
    { title: 'Choose Smaller Dimension', description: 'Use min(m,n) to minimize space usage' },
    { title: 'Initialize 1D Array', description: 'Create array of size min(m,n) filled with 1s' },
    { title: 'Process Columns', description: 'For each column, update array in-place by adding previous values' },
    { title: 'Return Final Result', description: 'Last element contains the total number of paths' }
  ],
  visualizer: async (testCase, updateGrid, setStep, onMetrics) => {
    const { m, n } = testCase.input;
    const [rows, cols] = m < n ? [m, n] : [n, m];
    
    // Create visual grid
    const grid: Cell[][] = Array(m).fill(null).map(() => 
      Array(n).fill(null).map(() => ({
        value: 0,
        isPath: false,
        isCurrentPath: false,
        visited: false,
        highlighted: false
      }))
    );

    // Initialize the DP array visualization
    const dp = new Array(rows).fill(1);
    let operations = 0;

    // Show initial state
    for (let i = 0; i < Math.min(m, rows); i++) {
      for (let j = 0; j < Math.min(n, 1); j++) {
        grid[i][j].value = 1;
        grid[i][j].visited = true;
      }
    }
    updateGrid([...grid]);
    await sleep(500);

    // Process each column
    for (let j = 1; j < cols; j++) {
      setStep(j);
      
      for (let i = 1; i < rows; i++) {
        operations++;
        
        // Highlight current calculation
        const visualRow = m < n ? i : j;
        const visualCol = m < n ? j : i;
        
        if (visualRow < m && visualCol < n) {
          grid[visualRow][visualCol].isCurrentPath = true;
          updateGrid([...grid]);
          await sleep(300);
          
          dp[i] += dp[i-1];
          grid[visualRow][visualCol].value = dp[i];
          grid[visualRow][visualCol].visited = true;
          grid[visualRow][visualCol].isCurrentPath = false;
          
          updateGrid([...grid]);
        }
        
        onMetrics?.({
          executionTime: 0,
          memoryUsage: rows * 32, // Only one array
          operations,
          comparisons: 0,
          assignments: operations,
          spaceUsed: rows * 32,
          inputSize: m * n
        });
      }
    }

    return dp[rows-1];
  }
};

// Main algorithm definition with multiple solutions
export const uniquePathsMultipleSolutions: Algorithm = {
  id: 'uniquePaths',
  name: 'Unique Paths',
  description: 'Find the number of unique paths from top-left to bottom-right in a grid, moving only right or down.',
  category: 'dynamic_programming',
  difficulty: 'medium',
  icon: Grid3X3,
  
  solutions: [
    recursiveSolution,
    memoizationSolution,
    tabulationSolution,
    spaceOptimizedSolution
  ],
  defaultSolutionId: 'uniquePaths-tabulation',
  
  concepts: [
    'Dynamic Programming', 'Memoization', 'Tabulation', 'Space Optimization',
    'Recursion', 'Grid Traversal', 'Combinatorics'
  ],
  relatedAlgorithms: ['uniquePathsII', 'minPathSum', 'pathSum'],
  realWorldApplications: [
    'Robot path planning',
    'Game level design (movement constraints)',
    'Network routing optimization',
    'Image processing (pixel traversal patterns)'
  ],
  prerequisites: ['Basic Recursion', 'Arrays/Matrices', 'Dynamic Programming Basics'],
  
  testCases: uniquePathsTestCases,
  
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
  
  defaultParams: { m: 3, n: 7 },
  paramControls: [
    {
      name: 'rows (m)',
      type: 'number',
      min: 1,
      max: 10,
      default: 3,
      description: 'Number of rows in the grid'
    },
    {
      name: 'cols (n)',
      type: 'number', 
      min: 1,
      max: 10,
      default: 7,
      description: 'Number of columns in the grid'
    }
  ],
  
  tags: ['dynamic-programming', 'recursion', 'memoization', 'grid', 'paths', 'optimization'],
  estimatedTime: 25,
  practiceLevel: 'implementation',
  
  insights: {
    bestApproach: {
      forSmallInputs: 'uniquePaths-recursive',
      forLargeInputs: 'uniquePaths-tabulation', 
      forMemoryConstrained: 'uniquePaths-spaceOptimized',
      forTimeConstrained: 'uniquePaths-tabulation'
    },
    keyLearnings: [
      'Recursive solutions can often be optimized with memoization',
      'Bottom-up DP usually has better space locality than top-down',
      'Space optimization often comes at the cost of code complexity',
      'The same problem can have vastly different performance profiles'
    ],
    commonMistakes: [
      'Forgetting to initialize base cases in tabulation',
      'Not considering space optimization opportunities',
      'Using recursion without memoization for large inputs',
      'Assuming recursive solutions are always slower'
    ],
    optimizationTips: [
      'Use the smaller dimension for space-optimized solutions',
      'Consider iterative solutions to avoid recursion overhead',
      'Memoization works well when subproblems have overlap',
      'Profile different approaches with your specific input sizes'
    ],
    realWorldScenarios: [
      {
        scenario: 'Mobile robot navigation',
        recommendedSolution: 'uniquePaths-spaceOptimized',
        reasoning: 'Memory is limited on embedded systems'
      },
      {
        scenario: 'Interview coding challenge',
        recommendedSolution: 'uniquePaths-tabulation', 
        reasoning: 'Standard DP approach, balances efficiency and readability'
      },
      {
        scenario: 'Teaching dynamic programming',
        recommendedSolution: 'uniquePaths-memoization',
        reasoning: 'Shows natural progression from recursion to optimization'
      }
    ]
  }
};
