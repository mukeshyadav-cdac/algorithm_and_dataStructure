import { Coins } from 'lucide-react';
import type { Algorithm, Cell, TestCase } from '../../types/algorithm';
import type { AlgorithmSolution } from '../../types/complexity';
import { sleep } from '../../utils/animationUtils';

// Test cases for Coin Change
const coinChangeTestCases: TestCase[] = [
  { input: { coins: [1, 2, 5], amount: 11 }, expected: 3, description: 'Amount 11 needs 3 coins: [5,5,1]' },
  { input: { coins: [2], amount: 3 }, expected: -1, description: 'Amount 3 cannot be made with coin [2]' },
  { input: { coins: [1], amount: 0 }, expected: 0, description: 'Amount 0 needs 0 coins' },
  { input: { coins: [1, 3, 4], amount: 6 }, expected: 2, description: 'Amount 6 needs 2 coins: [3,3]' }
];

// Recursive Solution with Memoization
const recursiveSolution: AlgorithmSolution = {
  id: 'coinchange-recursive',
  name: 'Recursive (Brute Force)',
  description: 'Explores all possible combinations recursively - exponential time complexity',
  approach: 'recursive',
  difficulty: 'beginner',
  
  complexity: {
    time: {
      best: 'O(amount^coins)',
      average: 'O(amount^coins)',
      worst: 'O(amount^coins)',
      explanation: 'Each recursive call explores all coin options, creating exponential branching'
    },
    space: {
      complexity: 'O(amount)',
      explanation: 'Maximum recursion depth is the target amount'
    },
    characteristics: ['Exponential Time', 'Deep Recursion', 'Simple Logic']
  },

  code: {
    javascript: `
function coinChange(coins, amount) {
    if (amount === 0) return 0;
    if (amount < 0) return -1;
    
    let minCoins = Infinity;
    
    for (const coin of coins) {
        const result = coinChange(coins, amount - coin);
        if (result !== -1) {
            minCoins = Math.min(minCoins, result + 1);
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
        result = coin_change(coins, amount - coin)
        if result != -1:
            min_coins = min(min_coins, result + 1)
    
    return -1 if min_coins == float('inf') else min_coins`,
    java: `
public static int coinChange(int[] coins, int amount) {
    if (amount == 0) return 0;
    if (amount < 0) return -1;
    
    int minCoins = Integer.MAX_VALUE;
    
    for (int coin : coins) {
        int result = coinChange(coins, amount - coin);
        if (result != -1) {
            minCoins = Math.min(minCoins, result + 1);
        }
    }
    
    return minCoins == Integer.MAX_VALUE ? -1 : minCoins;
}`,
    typescript: `
function coinChange(coins: number[], amount: number): number {
    if (amount === 0) return 0;
    if (amount < 0) return -1;
    
    let minCoins = Infinity;
    
    for (const coin of coins) {
        const result = coinChange(coins, amount - coin);
        if (result !== -1) {
            minCoins = Math.min(minCoins, result + 1);
        }
    }
    
    return minCoins === Infinity ? -1 : minCoins;
}`,
    go: `
func coinChange(coins []int, amount int) int {
    if amount == 0 {
        return 0
    }
    if amount < 0 {
        return -1
    }
    
    minCoins := math.MaxInt32
    
    for _, coin := range coins {
        result := coinChange(coins, amount - coin)
        if result != -1 {
            minCoins = min(minCoins, result + 1)
        }
    }
    
    if minCoins == math.MaxInt32 {
        return -1
    }
    return minCoins
}`,
    ruby: `
def coin_change(coins, amount)
  return 0 if amount == 0
  return -1 if amount < 0
  
  min_coins = Float::INFINITY
  
  coins.each do |coin|
    result = coin_change(coins, amount - coin)
    if result != -1
      min_coins = [min_coins, result + 1].min
    end
  end
  
  min_coins == Float::INFINITY ? -1 : min_coins
end`
  },

  whenToUse: 'Understanding the problem structure and recursive thinking',
  pros: [
    'Simple and intuitive approach',
    'Easy to understand the problem breakdown',
    'Direct translation of the problem statement'
  ],
  cons: [
    'Exponential time complexity',
    'Stack overflow for large inputs',
    'Recomputes same subproblems multiple times'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;

    // Simple visualization for recursive approach
    const { coins, amount } = testCase;
    const grid = Array(1).fill(null).map(() => 
      Array(amount + 1).fill(null).map((_, i) => ({
        value: i === 0 ? 0 : '?',
        isPath: false,
        isCurrentPath: false,
        visited: i === 0,
        highlighted: false
      }))
    );

    updateGrid(grid);
    await sleep(500);

    // Simulate exponential exploration
    for (let i = 1; i <= amount; i++) {
      operations++;
      grid[0][i].isCurrentPath = true;
      updateGrid(grid);
      await sleep(200);
      
      grid[0][i].value = 'Computing...';
      updateGrid(grid);
      await sleep(300);
      
      grid[0][i].isCurrentPath = false;
      grid[0][i].visited = true;
      updateGrid(grid);
      await sleep(100);
    }

    const endTime = performance.now();
    onMetrics({
      executionTime: endTime - startTime,
      operations,
      memoryUsed: amount * 32, // Rough estimate
      comparisons: operations * coins.length
    });
  }
};

// Memoization Solution (Top-down DP)
const memoizationSolution: AlgorithmSolution = {
  id: 'coinchange-memoization',
  name: 'Memoization (Top-down)',
  description: 'Recursive approach enhanced with memoization to avoid recomputation',
  approach: 'memoization',
  difficulty: 'intermediate',
  
  complexity: {
    time: {
      best: 'O(amount × coins)',
      average: 'O(amount × coins)',
      worst: 'O(amount × coins)',
      explanation: 'Each amount is computed once and stored in memo table'
    },
    space: {
      complexity: 'O(amount)',
      explanation: 'Memo table stores results for each amount + recursion stack'
    },
    characteristics: ['Optimal Substructure', 'Overlapping Subproblems', 'Top-down']
  },

  code: {
    javascript: `
function coinChange(coins, amount, memo = {}) {
    if (amount === 0) return 0;
    if (amount < 0) return -1;
    if (memo[amount] !== undefined) return memo[amount];
    
    let minCoins = Infinity;
    
    for (const coin of coins) {
        const result = coinChange(coins, amount - coin, memo);
        if (result !== -1) {
            minCoins = Math.min(minCoins, result + 1);
        }
    }
    
    memo[amount] = minCoins === Infinity ? -1 : minCoins;
    return memo[amount];
}`,
    python: `
def coin_change(coins, amount, memo={}):
    if amount == 0:
        return 0
    if amount < 0:
        return -1
    if amount in memo:
        return memo[amount]
    
    min_coins = float('inf')
    
    for coin in coins:
        result = coin_change(coins, amount - coin, memo)
        if result != -1:
            min_coins = min(min_coins, result + 1)
    
    memo[amount] = -1 if min_coins == float('inf') else min_coins
    return memo[amount]`
  },

  whenToUse: 'When you want to maintain recursive structure but need better performance',
  pros: [
    'Maintains intuitive recursive structure',
    'Significantly better than pure recursion',
    'Easy to implement from recursive solution'
  ],
  cons: [
    'Still uses recursion stack space',
    'Can cause stack overflow for very large inputs',
    'Slightly more complex than tabulation'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;

    const { coins, amount } = testCase;
    const grid = Array(1).fill(null).map(() => 
      Array(amount + 1).fill(null).map((_, i) => ({
        value: i === 0 ? 0 : '?',
        isPath: false,
        isCurrentPath: false,
        visited: i === 0,
        highlighted: false
      }))
    );

    updateGrid(grid);
    await sleep(500);

    // Simulate memoized computation
    for (let i = 1; i <= amount; i++) {
      operations++;
      grid[0][i].isCurrentPath = true;
      updateGrid(grid);
      await sleep(150);
      
      // Simulate checking memo
      grid[0][i].value = 'Memo check';
      updateGrid(grid);
      await sleep(200);
      
      grid[0][i].value = Math.ceil(Math.random() * 5);
      grid[0][i].isCurrentPath = false;
      grid[0][i].visited = true;
      updateGrid(grid);
      await sleep(100);
    }

    const endTime = performance.now();
    onMetrics({
      executionTime: endTime - startTime,
      operations,
      memoryUsed: amount * 64, // Memo table + recursion
      comparisons: operations * coins.length
    });
  }
};

// Tabulation Solution (Bottom-up DP)
const tabulationSolution: AlgorithmSolution = {
  id: 'coinchange-tabulation',
  name: 'Tabulation (Bottom-up)',
  description: 'Iterative DP approach building up from smaller subproblems',
  approach: 'tabulation',
  difficulty: 'intermediate',
  
  complexity: {
    time: {
      best: 'O(amount × coins)',
      average: 'O(amount × coins)',
      worst: 'O(amount × coins)',
      explanation: 'Nested loops: amount iterations × coins iterations'
    },
    space: {
      complexity: 'O(amount)',
      explanation: 'DP array of size amount + 1'
    },
    characteristics: ['Bottom-up', 'Iterative', 'No Recursion']
  },

  code: {
    javascript: `
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (i >= coin && dp[i - coin] !== Infinity) {
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
            if i >= coin and dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return -1 if dp[amount] == float('inf') else dp[amount]`
  },

  whenToUse: 'Standard DP implementation - most common and recommended approach',
  pros: [
    'No recursion stack overflow',
    'Clear iterative logic',
    'Standard DP pattern',
    'Easy to optimize space'
  ],
  cons: [
    'Less intuitive than recursive approach',
    'Requires understanding of DP table',
    'Bottom-up thinking needed'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;

    const { coins, amount } = testCase;
    const grid = Array(1).fill(null).map(() => 
      Array(amount + 1).fill(null).map((_, i) => ({
        value: i === 0 ? 0 : '∞',
        isPath: false,
        isCurrentPath: false,
        visited: i === 0,
        highlighted: false
      }))
    );

    updateGrid(grid);
    await sleep(500);

    // Tabulation animation
    for (let i = 1; i <= amount; i++) {
      grid[0][i].isCurrentPath = true;
      updateGrid(grid);
      await sleep(200);

      let minCoins = Infinity;
      for (const coin of coins) {
        operations++;
        if (i >= coin && grid[0][i - coin].value !== '∞') {
          minCoins = Math.min(minCoins, grid[0][i - coin].value + 1);
        }
      }
      
      grid[0][i].value = minCoins === Infinity ? -1 : minCoins;
      grid[0][i].visited = true;
      grid[0][i].isCurrentPath = false;
      updateGrid(grid);
      await sleep(300);
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

// Space Optimized Solution
const spaceOptimizedSolution: AlgorithmSolution = {
  id: 'coinchange-optimized',
  name: 'Space Optimized',
  description: 'Optimized tabulation using only necessary space',
  approach: 'space_optimized',
  difficulty: 'advanced',
  
  complexity: {
    time: {
      best: 'O(amount × coins)',
      average: 'O(amount × coins)',
      worst: 'O(amount × coins)',
      explanation: 'Same time complexity as tabulation'
    },
    space: {
      complexity: 'O(amount)',
      explanation: 'Single DP array, optimal space usage'
    },
    characteristics: ['Space Optimal', 'In-place Updates', 'Production Ready']
  },

  code: {
    javascript: `
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    // Process coins one by one
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
    
    for coin in coins:
        for i in range(coin, amount + 1):
            if dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return -1 if dp[amount] == float('inf') else dp[amount]`
  },

  whenToUse: 'Production systems where memory efficiency is critical',
  pros: [
    'Minimal space usage',
    'Cache-friendly access patterns',
    'Production-ready efficiency',
    'Easy to understand once learned'
  ],
  cons: [
    'Different iteration order',
    'Slightly less intuitive',
    'Harder to debug step-by-step'
  ],

  visualizer: async (testCase, updateGrid, _setStep, onMetrics) => {
    const startTime = performance.now();
    let operations = 0;

    const { coins, amount } = testCase;
    const grid = Array(1).fill(null).map(() => 
      Array(amount + 1).fill(null).map((_, i) => ({
        value: i === 0 ? 0 : '∞',
        isPath: false,
        isCurrentPath: false,
        visited: i === 0,
        highlighted: false
      }))
    );

    updateGrid(grid);
    await sleep(500);

    // Space optimized animation
    for (const coin of coins) {
      for (let i = coin; i <= amount; i++) {
        operations++;
        grid[0][i].isCurrentPath = true;
        updateGrid(grid);
        await sleep(150);

        if (grid[0][i - coin].value !== '∞') {
          const newVal = grid[0][i - coin].value + 1;
          if (grid[0][i].value === '∞' || newVal < grid[0][i].value) {
            grid[0][i].value = newVal;
          }
        }
        
        grid[0][i].visited = true;
        grid[0][i].isCurrentPath = false;
        updateGrid(grid);
        await sleep(100);
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

// Main algorithm definition
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
    'Dynamic Programming', 'Memoization', 'Tabulation', 'Greedy vs Optimal',
    'Recursion', 'Space Optimization', 'Bottom-up vs Top-down'
  ],
  relatedAlgorithms: ['unboundedKnapsack', 'coinChangeII', 'minimumPathSum'],
  realWorldApplications: [
    'Currency exchange optimization',
    'Vending machine change calculation',
    'Resource allocation with constraints',
    'Budget planning and optimization'
  ],
  prerequisites: ['Basic Recursion', 'Arrays', 'Dynamic Programming Basics'],
  
  testCases: coinChangeTestCases,
  
  gridSetup: (rows: number, cols: number, params?: any) => {
    const { amount = 11 } = params || {};
    return Array(1).fill(null).map(() => 
      Array(amount + 1).fill(null).map((_, i) => ({
        value: i === 0 ? 0 : '∞',
        isPath: false,
        isCurrentPath: false,
        visited: i === 0,
        highlighted: false
      }))
    );
  },

  defaultParams: { amount: 11, coins: [1, 2, 5] },
  paramControls: [
    { name: 'amount', type: 'number', label: 'Target Amount', min: 1, max: 20, default: 11 },
    { name: 'coins', type: 'array', label: 'Coin Denominations', default: [1, 2, 5] }
  ],

  tags: ['dynamic-programming', 'optimization', 'greedy', 'recursion'],
  estimatedTime: 25,
  practiceLevel: 'implementation',

  insights: {
    keyLearnings: [
      'Greedy approach doesn\'t always work for coin change',
      'Memoization transforms exponential to polynomial time',
      'Space optimization can reduce memory usage significantly',
      'Bottom-up DP avoids recursion stack issues'
    ],
    optimizationTips: [
      'Use space-optimized version for large amounts',
      'Sort coins in descending order for slight performance improvement',
      'Consider early termination if current path exceeds known minimum',
      'For specific coin systems, greedy might work (e.g., standard currency)'
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
        description: 'ATMs use coin change algorithms to dispense minimum number of bills',
        complexity: 'Usually greedy works due to currency design'
      },
      {
        title: 'Resource Allocation',
        description: 'Allocating limited resources (bandwidth, CPU) optimally',
        complexity: 'Dynamic programming ensures optimal allocation'
      }
    ]
  }
};
