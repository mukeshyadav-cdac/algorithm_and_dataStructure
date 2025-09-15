import { Coins } from 'lucide-react';
import type { Algorithm, AlgorithmSolution, TestCase } from '@/types';
import { sleep } from '@/utils';

// Test cases for Coin Change algorithm
const coinChangeTestCases: TestCase[] = [
  { input: { coins: [1, 2, 5], amount: 11 }, expected: 3, description: 'Amount 11 needs 3 coins: [5,5,1]' },
  { input: { coins: [2], amount: 3 }, expected: -1, description: 'Amount 3 cannot be made with coin [2]' },
  { input: { coins: [1], amount: 0 }, expected: 0, description: 'Amount 0 needs 0 coins' },
  { input: { coins: [1, 3, 4], amount: 6 }, expected: 2, description: 'Amount 6 needs 2 coins: [3,3]' },
  { input: { coins: [1, 2, 5], amount: 7 }, expected: 2, description: 'Amount 7 needs 2 coins: [5,2]' }
];

/**
 * Recursive Solution (Brute Force)
 * Strategy Pattern: Implements recursive strategy exploring all combinations
 */
const recursiveSolution: AlgorithmSolution = {
  id: 'coinchange-recursive',
  name: 'Recursive (Brute Force)',
  description: 'Explores all possible coin combinations recursively - exponential time complexity',
  approach: 'recursive',
  difficulty: 'beginner',

  complexity: {
    time: {
      best: 'O(amount^coins)',
      average: 'O(amount^coins)',
      worst: 'O(amount^coins)',
      explanation: 'Each recursive call branches into |coins| possibilities, creating exponential tree'
    },
    space: {
      complexity: 'O(amount)',
      explanation: 'Maximum recursion depth equals the target amount (worst case with coin=1)'
    },
    characteristics: ['Exponential Time', 'Deep Recursion', 'Simple Logic', 'Educational']
  },

  code: {
    javascript: `
function coinChange(coins, amount) {
    if (amount === 0) return 0;
    if (amount < 0) return -1;
    
    let minCoins = Infinity;
    
    for (const coin of coins) {
        const subResult = coinChange(coins, amount - coin);
        if (subResult !== -1) {
            minCoins = Math.min(minCoins, subResult + 1);
        }
    }
    
    return minCoins === Infinity ? -1 : minCoins;
}`,

    python: `
def coin_change(coins, amount):
    if amount == 0:
        return 0
    if amount < 0:
        return -1
    
    min_coins = float('inf')
    
    for coin in coins:
        sub_result = coin_change(coins, amount - coin)
        if sub_result != -1:
            min_coins = min(min_coins, sub_result + 1)
    
    return -1 if min_coins == float('inf') else min_coins`,

    java: `
public static int coinChange(int[] coins, int amount) {
    if (amount == 0) return 0;
    if (amount < 0) return -1;
    
    int minCoins = Integer.MAX_VALUE;
    
    for (int coin : coins) {
        int subResult = coinChange(coins, amount - coin);
        if (subResult != -1) {
            minCoins = Math.min(minCoins, subResult + 1);
        }
    }
    
    return minCoins == Integer.MAX_VALUE ? -1 : minCoins;
}`
  },

  whenToUse: 'Understanding the problem structure and recursive thinking. Excellent for educational purposes.',
  
  pros: [
    'Extremely simple and intuitive logic',
    'Direct translation of the problem statement',
    'Easy to understand the recursive breakdown',
    'Great for learning recursive problem-solving'
  ],
  
  cons: [
    'Exponential time complexity',
    'Stack overflow for large amounts',
    'Recomputes same subproblems many times',
    'Completely impractical for real use'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;
    const { amount } = testCase as { amount: number };

    // Create 1D visualization array
    const grid = Array(1).fill(null).map(() => 
      Array(amount + 1).fill(null).map((_, i) => ({
        value: i === 0 ? 0 : '?',
        visited: i === 0,
        highlighted: false
      }))
    );

    updateGrid(grid);
    await sleep(500);

    // Simulate exponential exploration
    for (let i = 1; i <= amount; i++) {
      operations++;
      grid[0][i].highlighted = true;
      updateGrid([...grid]);
      await sleep(300);
      
      grid[0][i].value = 'Computing...';
      updateGrid([...grid]);
      await sleep(200);
      
      // Simulate multiple recursive calls
      for (let j = 0; j < Math.min(3, i); j++) {
        await sleep(100);
        operations++;
      }
      
      grid[0][i].highlighted = false;
      grid[0][i].visited = true;
      updateGrid([...grid]);
      await sleep(150);
    }

    const endTime = performance.now();
    onMetrics({
      executionTime: endTime - startTime,
      operations,
      memoryUsed: amount * 64, // Recursion stack estimation
      comparisons: operations * 3 // Average coin comparisons
    });
  }
};

/**
 * Memoization Solution (Top-down DP)
 * Strategy Pattern: Implements memoized recursive strategy
 */
const memoizationSolution: AlgorithmSolution = {
  id: 'coinchange-memoization',
  name: 'Memoization (Top-down)',
  description: 'Recursive approach with memoization to cache and reuse computed results',
  approach: 'memoization',
  difficulty: 'intermediate',

  complexity: {
    time: {
      best: 'O(amount × coins)',
      average: 'O(amount × coins)',
      worst: 'O(amount × coins)',
      explanation: 'Each amount from 0 to target is computed once and cached'
    },
    space: {
      complexity: 'O(amount)',
      explanation: 'Memo array of size amount + recursion stack depth'
    },
    characteristics: ['Polynomial Time', 'Top-down DP', 'Caching', 'Recursive Structure']
  },

  code: {
    javascript: `
function coinChange(coins, amount, memo = new Array(amount + 1).fill(-2)) {
    if (amount === 0) return 0;
    if (amount < 0) return -1;
    if (memo[amount] !== -2) return memo[amount];
    
    let minCoins = Infinity;
    
    for (const coin of coins) {
        const subResult = coinChange(coins, amount - coin, memo);
        if (subResult !== -1) {
            minCoins = Math.min(minCoins, subResult + 1);
        }
    }
    
    memo[amount] = minCoins === Infinity ? -1 : minCoins;
    return memo[amount];
}`,

    python: `
def coin_change(coins, amount, memo=None):
    if memo is None:
        memo = [-2] * (amount + 1)
    
    if amount == 0:
        return 0
    if amount < 0:
        return -1
    if memo[amount] != -2:
        return memo[amount]
    
    min_coins = float('inf')
    
    for coin in coins:
        sub_result = coin_change(coins, amount - coin, memo)
        if sub_result != -1:
            min_coins = min(min_coins, sub_result + 1)
    
    memo[amount] = -1 if min_coins == float('inf') else min_coins
    return memo[amount]`
  },

  whenToUse: 'When you want to maintain recursive thinking but need much better performance.',
  
  pros: [
    'Maintains intuitive recursive structure',
    'Dramatically improves performance over pure recursion',
    'Each subproblem solved only once',
    'Natural extension from recursive solution'
  ],
  
  cons: [
    'Still uses recursion stack space',
    'Can cause stack overflow for very large amounts',
    'Memory overhead for memoization array',
    'Slightly more complex than pure recursion'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;
    const { amount } = testCase as { amount: number };

    const grid = Array(1).fill(null).map(() => 
      Array(amount + 1).fill(null).map((_, i) => ({
        value: i === 0 ? 0 : '?',
        visited: i === 0,
        highlighted: false
      }))
    );

    updateGrid(grid);
    await sleep(500);

    // Simulate memoized computation (each subproblem solved once)
    for (let i = 1; i <= amount; i++) {
      operations++;
      grid[0][i].highlighted = true;
      updateGrid([...grid]);
      await sleep(200);
      
      // Simulate checking memo and computation
      grid[0][i].value = 'Memo check';
      updateGrid([...grid]);
      await sleep(150);
      
      // Set final value
      grid[0][i].value = Math.ceil(Math.random() * 5);
      grid[0][i].visited = true;
      grid[0][i].highlighted = false;
      updateGrid([...grid]);
      await sleep(100);
    }

    const endTime = performance.now();
    onMetrics({
      executionTime: endTime - startTime,
      operations,
      memoryUsed: amount * 32 + operations * 32, // Memo + recursion
      comparisons: operations * 2
    });
  }
};

/**
 * Tabulation Solution (Bottom-up DP)
 * Strategy Pattern: Implements iterative tabulation strategy
 */
const tabulationSolution: AlgorithmSolution = {
  id: 'coinchange-tabulation',
  name: 'Tabulation (Bottom-up)',
  description: 'Iterative DP approach building solution from smaller subproblems upwards',
  approach: 'tabulation',
  difficulty: 'intermediate',

  complexity: {
    time: {
      best: 'O(amount × coins)',
      average: 'O(amount × coins)',
      worst: 'O(amount × coins)',
      explanation: 'Nested loops: amount iterations × coins iterations per amount'
    },
    space: {
      complexity: 'O(amount)',
      explanation: 'DP array of size amount + 1'
    },
    characteristics: ['Polynomial Time', 'Bottom-up DP', 'Iterative', 'No Recursion']
  },

  code: {
    javascript: `
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i && dp[i - coin] !== Infinity) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}`,

    python: `
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return -1 if dp[amount] == float('inf') else dp[amount]`
  },

  whenToUse: 'Standard production implementation. Most commonly used and recommended approach.',
  
  pros: [
    'No recursion stack overflow risk',
    'Clear iterative logic',
    'Standard DP pattern',
    'Predictable performance',
    'Easy to understand once learned'
  ],
  
  cons: [
    'Less intuitive than recursive approach',
    'Requires understanding DP table construction',
    'Bottom-up thinking can be challenging initially'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;
    const { amount, coins } = testCase as { amount: number; coins: number[] };

    const grid = Array(1).fill(null).map(() => 
      Array(amount + 1).fill(null).map((_, i) => ({
        value: i === 0 ? 0 : '∞',
        visited: i === 0,
        highlighted: false
      }))
    );

    updateGrid(grid);
    await sleep(500);

    // Tabulation: build from bottom up
    for (let i = 1; i <= amount; i++) {
      grid[0][i].highlighted = true;
      updateGrid([...grid]);
      await sleep(200);

      let minCoins = Infinity;
      for (const coin of coins) {
        operations++;
        if (coin <= i && grid[0][i - coin].value !== '∞') {
          const coinValue = typeof grid[0][i - coin].value === 'number' ? 
            grid[0][i - coin].value : parseInt(grid[0][i - coin].value as string);
          minCoins = Math.min(minCoins, coinValue + 1);
        }
      }
      
      grid[0][i].value = minCoins === Infinity ? -1 : minCoins;
      grid[0][i].visited = true;
      grid[0][i].highlighted = false;
      
      updateGrid([...grid]);
      await sleep(150);
    }

    const endTime = performance.now();
    onMetrics({
      executionTime: endTime - startTime,
      operations,
      memoryUsed: (amount + 1) * 32,
      comparisons: operations
    });
  }
};

/**
 * Space Optimized Solution
 * Strategy Pattern: Implements space-efficient strategy
 */
const spaceOptimizedSolution: AlgorithmSolution = {
  id: 'coinchange-optimized',
  name: 'Space Optimized',
  description: 'Optimized tabulation using coin-first iteration for better cache locality',
  approach: 'space_optimized',
  difficulty: 'advanced',

  complexity: {
    time: {
      best: 'O(amount × coins)',
      average: 'O(amount × coins)',
      worst: 'O(amount × coins)',
      explanation: 'Same time complexity but better cache performance'
    },
    space: {
      complexity: 'O(amount)',
      explanation: 'Single DP array with optimal memory access patterns'
    },
    characteristics: ['Space Optimal', 'Cache Friendly', 'Production Ready']
  },

  code: {
    javascript: `
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    // Process coins first for better cache locality
    for (const coin of coins) {
        for (let i = coin; i <= amount; i++) {
            if (dp[i - coin] !== Infinity) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}`,

    python: `
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    # Process coins first for better cache locality
    for coin in coins:
        for i in range(coin, amount + 1):
            if dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return -1 if dp[amount] == float('inf') else dp[amount]`
  },

  whenToUse: 'High-performance systems where cache efficiency matters and memory access patterns are optimized.',
  
  pros: [
    'Better cache locality',
    'Same time and space complexity',
    'More memory-efficient access patterns',
    'Production-optimized implementation'
  ],
  
  cons: [
    'Different iteration order can be confusing',
    'Less intuitive than amount-first approach',
    'Harder to trace execution step by step'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;
    const { amount, coins } = testCase as { amount: number; coins: number[] };

    const grid = Array(1).fill(null).map(() => 
      Array(amount + 1).fill(null).map((_, i) => ({
        value: i === 0 ? 0 : '∞',
        visited: i === 0,
        highlighted: false
      }))
    );

    updateGrid(grid);
    await sleep(500);

    // Process coins first (space optimized approach)
    for (const coin of coins) {
      for (let i = coin; i <= amount; i++) {
        operations++;
        grid[0][i].highlighted = true;
        updateGrid([...grid]);
        await sleep(100);

        if (grid[0][i - coin].value !== '∞') {
          const prevValue = typeof grid[0][i - coin].value === 'number' ? 
            grid[0][i - coin].value : parseInt(grid[0][i - coin].value as string);
          const currentValue = grid[0][i].value === '∞' ? Infinity : 
            (typeof grid[0][i].value === 'number' ? grid[0][i].value : parseInt(grid[0][i].value as string));
          
          const newValue = Math.min(currentValue, prevValue + 1);
          grid[0][i].value = newValue === Infinity ? '∞' : newValue;
        }
        
        grid[0][i].visited = true;
        grid[0][i].highlighted = false;
        updateGrid([...grid]);
        await sleep(50);
      }
    }

    const endTime = performance.now();
    onMetrics({
      executionTime: endTime - startTime,
      operations,
      memoryUsed: (amount + 1) * 32,
      comparisons: operations
    });
  }
};

/**
 * Main Coin Change Algorithm Definition
 * Template Method Pattern: Defines algorithm structure with multiple solution strategies
 */
export const coinChangeMultipleSolutions: Algorithm = {
  id: 'coinChange',
  name: 'Coin Change',
  description: 'Find the minimum number of coins needed to make a target amount using given coin denominations.',
  category: 'dynamic_programming',
  difficulty: 'medium',
  icon: Coins,

  solutions: [
    recursiveSolution,
    memoizationSolution,
    tabulationSolution,
    spaceOptimizedSolution
  ],
  defaultSolutionId: 'coinchange-tabulation',

  concepts: [
    'Dynamic Programming',
    'Memoization',
    'Tabulation',
    'Greedy vs Optimal',
    'Optimization Problems',
    'Space Optimization'
  ],
  relatedAlgorithms: ['unboundedKnapsack', 'coinChangeII', 'minimumPathSum'],
  realWorldApplications: [
    'Currency exchange optimization',
    'Vending machine change calculation',
    'Resource allocation with constraints',
    'Budget optimization and planning',
    'ATM cash dispensing algorithms'
  ],
  prerequisites: ['Basic Recursion', 'Arrays', 'Dynamic Programming Basics'],

  testCases: coinChangeTestCases,
  defaultParams: { amount: 11, coins: [1, 2, 5] },
  paramControls: [
    { name: 'amount', type: 'number', label: 'Target Amount', min: 0, max: 50, default: 11 },
    { name: 'coins', type: 'array', label: 'Coin Denominations', default: [1, 2, 5] }
  ],

  gridSetup: (rows: number, cols: number, params?: Record<string, unknown>) => {
    const { amount = 11 } = params || {};
    const validAmount = Math.max(1, Math.min(amount as number, 50));
    return Array(1).fill(null).map(() => 
      Array(validAmount + 1).fill(null).map((_, i) => ({
        value: i === 0 ? 0 : '∞',
        visited: i === 0,
        highlighted: false
      }))
    );
  },

  tags: ['dynamic-programming', 'optimization', 'greedy', 'recursion'],
  estimatedTime: 25,
  practiceLevel: 'implementation',

  insights: {
    keyLearnings: [
      'Greedy approach doesn\'t always work for coin change',
      'DP transforms exponential problem into polynomial time',
      'Memoization preserves recursive structure while adding efficiency',
      'Different iteration orders can affect cache performance'
    ],
    optimizationTips: [
      'Use coin-first iteration for better cache locality',
      'Sort coins in descending order for slight performance improvement',
      'Consider early termination if current path exceeds known minimum',
      'For specific coin systems (like standard currency), greedy might work'
    ],
    commonMistakes: [
      'Assuming greedy approach always works',
      'Not handling the case where change cannot be made',
      'Off-by-one errors in array indexing',
      'Forgetting to initialize base case (amount = 0)'
    ],
    realWorldScenarios: [
      {
        title: 'ATM Cash Dispensing',
        description: 'ATMs use coin change algorithms to minimize the number of bills dispensed',
        complexity: 'Usually greedy works due to currency design'
      },
      {
        title: 'Resource Allocation',
        description: 'Optimal allocation of limited resources with different unit costs',
        complexity: 'DP ensures globally optimal solutions'
      }
    ]
  }
};
