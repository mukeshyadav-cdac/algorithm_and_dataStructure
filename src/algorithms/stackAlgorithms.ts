import React from 'react';
import { Layers, Parentheses, BarChart3, ArrowUp, Calculator } from 'lucide-react';
import { Algorithm, VisualizationStrategy, ExecutionStrategy } from '../types';
import { delay } from '../utils';

/**
 * Stack Algorithms with Visual Stack Operations
 * Composition pattern for stack-based problem solving
 */

// Stack visualization strategy
const createStackVisualization = (
  setupFn: (rows: number, cols: number, params: any) => any[][],
  animateFn: (context: any, setGrid: any) => Promise<void>
): VisualizationStrategy => ({
  id: 'stack-visualization',
  name: 'Stack Visualization',
  description: 'Visualizes stack operations with push/pop animations',
  setup: setupFn,
  animate: animateFn,
  getStepCount: (params) => (params.input?.length || 10) * 2
});

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

// 1. VALID PARENTHESES
export const validParenthesesAlgorithm: Algorithm = {
  id: 'validParentheses',
  name: 'Valid Parentheses',
  category: { id: 'stack', name: 'Stack Algorithms', description: '', icon: React.createElement(Layers), color: 'orange', gradient: 'from-orange-500 to-red-600' },
  difficulty: 'easy',
  icon: React.createElement(Parentheses, { className: "h-6 w-6" }),
  tags: ['Stack', 'String Processing', 'Parsing', 'Brackets'],
  
  visualization: createStackVisualization(
    (rows, cols, params) => {
      const input = params?.input || '()[]{}';
      const maxStack = 10;
      // Create a vertical stack visualization
      return Array(maxStack).fill(null).map((_, i) => [
        { value: '', visited: false, highlighted: false, isActive: false },
        { value: i === maxStack - 1 ? 'STACK' : '', visited: false, highlighted: false, isActive: false },
        { value: i < input.length ? input[i] : '', visited: false, highlighted: false, isActive: false }
      ]);
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const input = params.input as string || '()[]{}';
      const stack = [];
      const matchingPairs = { ')': '(', ']': '[', '}': '{' };
      const maxStack = grid.length;
      let stackTop = maxStack - 2; // Start below "STACK" label
      let valid = true;
      
      // Process each character
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        
        // Highlight current character being processed
        grid[maxStack - 1][2] = { value: 'INPUT', visited: false, highlighted: false, isActive: false };
        for (let j = 0; j < maxStack - 1; j++) {
          if (j < input.length) {
            grid[j][2] = { 
              value: input[j], 
              visited: j < i, 
              highlighted: j === i, 
              isActive: false 
            };
          }
        }
        setGrid([...grid]);
        await delay(context.speed);
        
        if (['(', '[', '{'].includes(char)) {
          // Push to stack
          if (stackTop >= 0) {
            grid[stackTop][0] = { value: char, visited: false, highlighted: true, isActive: true };
            stack.push(char);
            stackTop--;
            setGrid([...grid]);
            await delay(context.speed);
          } else {
            valid = false;
            break;
          }
        } else if ([')', ']', '}'].includes(char)) {
          // Pop from stack and check matching
          if (stack.length === 0 || stack[stack.length - 1] !== matchingPairs[char]) {
            valid = false;
            // Highlight error
            grid[i % (maxStack - 1)][2] = { ...grid[i % (maxStack - 1)][2], highlighted: true };
            setGrid([...grid]);
            await delay(context.speed);
            break;
          } else {
            // Valid match - pop from stack
            stackTop++;
            grid[stackTop][0] = { value: '', visited: true, highlighted: false, isActive: false };
            stack.pop();
            setGrid([...grid]);
            await delay(context.speed);
          }
        }
        
        // Remove highlight from current character
        grid[i % (maxStack - 1)][2] = { ...grid[i % (maxStack - 1)][2], highlighted: false, visited: true };
        setGrid([...grid]);
        await delay(context.speed / 2);
      }
      
      // Final result visualization
      const resultRow = Math.floor(maxStack / 2);
      grid[resultRow][1] = { 
        value: valid && stack.length === 0 ? '✓ VALID' : '✗ INVALID', 
        visited: false, 
        highlighted: true, 
        isActive: false 
      };
      setGrid([...grid]);
      await delay(context.speed);
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const s = input.s;
  const stack = [];
  const matchingPairs = { ')': '(', ']': '[', '}': '{' };
  
  for (let char of s) {
    if (['(', '[', '{'].includes(char)) {
      stack.push(char);
    } else if ([')', ']', '}'].includes(char)) {
      if (stack.length === 0 || stack.pop() !== matchingPairs[char]) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}`)
  ],
  
  education: {
    overview: 'The Valid Parentheses problem uses a stack to ensure that brackets are properly matched and nested. This is fundamental for parsing expressions and validating syntax.',
    keyInsights: [
      'Stack naturally handles nested structures with LIFO property',
      'Opening brackets are pushed, closing brackets must match the top',
      'Empty stack at the end indicates all brackets were matched',
      'Classic example of using stack for parsing problems'
    ],
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n)',
      worst: 'O(n)',
      explanation: 'We process each character exactly once'
    },
    spaceComplexity: {
      value: 'O(n)',
      explanation: 'Stack can grow to size n in worst case (all opening brackets)'
    },
    whenToUse: [
      'Validating nested structures (HTML, XML, JSON)',
      'Expression parsing and evaluation',
      'Checking balanced delimiters in code',
      'Any problem requiring matching pairs'
    ],
    commonPitfalls: [
      'Not handling empty string case',
      'Forgetting to check if stack is empty when popping',
      'Not clearing stack completely at the end',
      'Mixing up opening and closing bracket matching'
    ],
    realWorldApplications: [
      {
        title: 'Code Editor Validation',
        description: 'Check balanced brackets in programming languages',
        industry: 'Software Development'
      },
      {
        title: 'HTML/XML Parser',
        description: 'Validate properly nested tags',
        industry: 'Web Development'
      },
      {
        title: 'Mathematical Expression Parser',
        description: 'Validate parentheses in mathematical formulas',
        industry: 'Education Technology'
      }
    ]
  },
  
  testCases: [
    { input: { s: '()' }, expected: true, description: 'Simple pair of parentheses' },
    { input: { s: '()[]{}' }, expected: true, description: 'Multiple types of brackets' },
    { input: { s: '(]' }, expected: false, description: 'Mismatched bracket types' },
    { input: { s: '([)]' }, expected: false, description: 'Incorrectly nested brackets' },
    { input: { s: '{[]}' }, expected: true, description: 'Properly nested brackets' },
    { input: { s: '' }, expected: true, description: 'Empty string is valid' }
  ],
  
  defaultParams: { input: '()[]{}' },
  paramControls: [
    { name: 'input', type: 'string', label: 'Bracket String', default: '()[]{}', description: 'String containing brackets to validate' }
  ],
  
  estimatedTimeMinutes: 10,
  prerequisites: ['Stack Data Structure', 'String Processing'],
  relatedAlgorithms: ['expressionEvaluation', 'nextGreaterElement', 'stockSpan']
};

// 2. STOCK SPAN PROBLEM
export const stockSpanAlgorithm: Algorithm = {
  id: 'stockSpan',
  name: 'Stock Span Problem',
  category: { id: 'stack', name: 'Stack Algorithms', description: '', icon: React.createElement(Layers), color: 'orange', gradient: 'from-orange-500 to-red-600' },
  difficulty: 'medium',
  icon: React.createElement(BarChart3, { className: "h-6 w-6" }),
  tags: ['Stack', 'Array', 'Monotonic Stack', 'Financial'],
  
  visualization: createStackVisualization(
    (rows, cols, params) => {
      const prices = params?.prices || [100, 80, 60, 70, 60, 75, 85];
      const maxHeight = 8;
      return Array(maxHeight).fill(null).map((_, i) => 
        prices.map((price, j) => ({
          value: i === maxHeight - 1 ? price : (i === 0 ? 0 : ''), // Show prices at bottom, spans at top
          visited: false,
          highlighted: false,
          isPath: false,
          price: price
        }))
      );
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const prices = params.prices as number[] || [100, 80, 60, 70, 60, 75, 85];
      const stack = []; // Stack stores indices
      const spans = Array(prices.length).fill(0);
      const maxHeight = grid.length;
      
      for (let i = 0; i < prices.length; i++) {
        // Highlight current day
        for (let row = 0; row < maxHeight; row++) {
          grid[row][i] = { ...grid[row][i], highlighted: true };
        }
        setGrid([...grid]);
        await delay(context.speed);
        
        // Pop from stack while current price is greater than price at stack top
        while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
          const poppedIdx = stack.pop();
          
          // Show popping animation
          for (let row = 1; row < maxHeight - 1; row++) {
            if (poppedIdx !== undefined) {
              grid[row][poppedIdx] = { ...grid[row][poppedIdx], visited: true };
            }
          }
          setGrid([...grid]);
          await delay(context.speed / 2);
        }
        
        // Calculate span
        spans[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];
        
        // Show span result
        grid[0][i] = { ...grid[0][i], value: spans[i], isPath: true };
        setGrid([...grid]);
        await delay(context.speed);
        
        // Push current index to stack
        stack.push(i);
        
        // Visualize stack state
        for (let row = 1; row < maxHeight - 1; row++) {
          grid[row][i] = { ...grid[row][i], visited: false, isPath: true };
        }
        setGrid([...grid]);
        await delay(context.speed);
        
        // Remove highlighting
        for (let row = 0; row < maxHeight; row++) {
          grid[row][i] = { ...grid[row][i], highlighted: false };
        }
        setGrid([...grid]);
        await delay(context.speed / 2);
      }
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const prices = input.prices;
  const stack = []; // Stack stores indices
  const spans = [];
  
  for (let i = 0; i < prices.length; i++) {
    // Pop from stack while current price >= price at stack top
    while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
      stack.pop();
    }
    
    // Calculate span
    spans[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];
    
    // Push current index
    stack.push(i);
  }
  
  return spans;
}`)
  ],
  
  education: {
    overview: 'The Stock Span problem calculates how many consecutive days before each day had stock prices less than or equal to the current day\'s price.',
    keyInsights: [
      'Monotonic stack keeps indices of days with higher prices',
      'When current price is higher, pop lower prices from stack',
      'Span is distance from current day to nearest higher price day',
      'Efficient O(n) solution vs naive O(n²) approach'
    ],
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n)',
      worst: 'O(n)',
      explanation: 'Each element is pushed and popped at most once'
    },
    spaceComplexity: {
      value: 'O(n)',
      explanation: 'Stack can store at most n indices'
    },
    whenToUse: [
      'Financial analysis and trend detection',
      'Finding previous/next greater/smaller elements',
      'Histogram problems and area calculations',
      'Any problem requiring range queries with constraints'
    ],
    commonPitfalls: [
      'Forgetting to handle the first day (span is always 1)',
      'Using prices instead of indices in the stack',
      'Not understanding when to pop from stack',
      'Confusing span calculation formula'
    ],
    realWorldApplications: [
      {
        title: 'Financial Trading',
        description: 'Analyze bullish periods in stock trading',
        industry: 'Finance'
      },
      {
        title: 'Weather Analysis',
        description: 'Find periods of consecutive temperature increases',
        industry: 'Meteorology'
      },
      {
        title: 'Performance Metrics',
        description: 'Track consecutive periods of improvement',
        industry: 'Business Analytics'
      }
    ]
  },
  
  testCases: [
    { 
      input: { prices: [100, 80, 60, 70, 60, 75, 85] }, 
      expected: [1, 1, 1, 2, 1, 4, 6], 
      description: 'Stock prices with varying spans' 
    },
    { 
      input: { prices: [10, 4, 5, 90, 120, 80] }, 
      expected: [1, 1, 2, 4, 5, 1], 
      description: 'Mixed price movements' 
    },
    { 
      input: { prices: [85, 90, 95, 100] }, 
      expected: [1, 2, 3, 4], 
      description: 'Continuously increasing prices' 
    }
  ],
  
  defaultParams: { prices: [100, 80, 60, 70, 60, 75, 85] },
  paramControls: [
    { name: 'prices', type: 'array', label: 'Stock Prices', default: [100, 80, 60, 70, 60, 75, 85], description: 'Array of daily stock prices' }
  ],
  
  estimatedTimeMinutes: 20,
  prerequisites: ['Stack Data Structure', 'Array Processing', 'Monotonic Stack'],
  relatedAlgorithms: ['nextGreaterElement', 'largestRectangleHistogram', 'validParentheses']
};

// 3. NEXT GREATER ELEMENT
export const nextGreaterElementAlgorithm: Algorithm = {
  id: 'nextGreaterElement',
  name: 'Next Greater Element',
  category: { id: 'stack', name: 'Stack Algorithms', description: '', icon: React.createElement(Layers), color: 'orange', gradient: 'from-orange-500 to-red-600' },
  difficulty: 'medium',
  icon: React.createElement(ArrowUp, { className: "h-6 w-6" }),
  tags: ['Stack', 'Array', 'Monotonic Stack', 'Next Greater'],
  
  visualization: createStackVisualization(
    (rows, cols, params) => {
      const nums = params?.nums || [4, 5, 2, 25];
      const maxHeight = 6;
      return Array(maxHeight).fill(null).map((_, i) => 
        nums.map((num, j) => ({
          value: i === maxHeight - 1 ? num : (i === 0 ? -1 : ''), // Input at bottom, result at top
          visited: false,
          highlighted: false,
          isActive: false
        }))
      );
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const nums = params.nums as number[] || [4, 5, 2, 25];
      const stack = [];
      const result = Array(nums.length).fill(-1);
      const maxHeight = grid.length;
      
      // Process from right to left for next greater element
      for (let i = nums.length - 1; i >= 0; i--) {
        // Highlight current element
        for (let row = 0; row < maxHeight; row++) {
          grid[row][i] = { ...grid[row][i], highlighted: true };
        }
        setGrid([...grid]);
        await delay(context.speed);
        
        // Pop elements from stack that are smaller than current element
        while (stack.length > 0 && stack[stack.length - 1] <= nums[i]) {
          stack.pop();
          
          // Visual feedback for popping
          for (let row = 1; row < maxHeight - 1; row++) {
            for (let col = 0; col < nums.length; col++) {
              if (grid[row][col].isActive) {
                grid[row][col] = { ...grid[row][col], visited: true, isActive: false };
              }
            }
          }
          setGrid([...grid]);
          await delay(context.speed / 3);
        }
        
        // The next greater element is the top of stack (if exists)
        if (stack.length > 0) {
          result[i] = stack[stack.length - 1];
        }
        
        // Show result
        grid[0][i] = { ...grid[0][i], value: result[i] };
        setGrid([...grid]);
        await delay(context.speed);
        
        // Push current element to stack
        stack.push(nums[i]);
        
        // Visual representation of stack
        const stackRow = Math.min(stack.length, maxHeight - 2);
        grid[stackRow][i] = { ...grid[stackRow][i], isActive: true };
        setGrid([...grid]);
        await delay(context.speed);
        
        // Remove highlighting
        for (let row = 0; row < maxHeight; row++) {
          grid[row][i] = { ...grid[row][i], highlighted: false };
        }
        setGrid([...grid]);
        await delay(context.speed / 2);
      }
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const nums = input.nums;
  const stack = [];
  const result = Array(nums.length).fill(-1);
  
  // Process from right to left
  for (let i = nums.length - 1; i >= 0; i--) {
    // Pop elements smaller than current
    while (stack.length > 0 && stack[stack.length - 1] <= nums[i]) {
      stack.pop();
    }
    
    // Next greater element is at top of stack
    if (stack.length > 0) {
      result[i] = stack[stack.length - 1];
    }
    
    // Push current element
    stack.push(nums[i]);
  }
  
  return result;
}`)
  ],
  
  education: {
    overview: 'Find the next greater element for each element in an array. Uses a monotonic decreasing stack to efficiently find the nearest larger element to the right.',
    keyInsights: [
      'Process array from right to left for "next" greater element',
      'Stack maintains elements in decreasing order',
      'Pop smaller elements as they can\'t be NGE for future elements',
      'Stack top always contains the next greater element'
    ],
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n)',
      worst: 'O(n)',
      explanation: 'Each element is pushed and popped at most once'
    },
    spaceComplexity: {
      value: 'O(n)',
      explanation: 'Stack space and result array'
    },
    whenToUse: [
      'Finding next/previous greater/smaller elements',
      'Building monotonic sequences',
      'Temperature and weather analysis',
      'Histogram and bar chart problems'
    ],
    commonPitfalls: [
      'Processing array in wrong direction',
      'Not maintaining monotonic property of stack',
      'Forgetting to handle elements with no next greater element',
      'Using wrong comparison operator (< vs <=)'
    ],
    realWorldApplications: [
      {
        title: 'Temperature Prediction',
        description: 'Find next day with higher temperature',
        industry: 'Weather Services'
      },
      {
        title: 'Stock Analysis',
        description: 'Find next day with higher stock price',
        industry: 'Finance'
      },
      {
        title: 'Performance Monitoring',
        description: 'Identify next milestone in metrics',
        industry: 'Software Analytics'
      }
    ]
  },
  
  testCases: [
    { input: { nums: [4, 5, 2, 25] }, expected: [5, 25, 25, -1], description: 'Basic next greater element example' },
    { input: { nums: [13, 7, 6, 12] }, expected: [-1, 12, 12, -1], description: 'Mixed array with some no next greater' },
    { input: { nums: [1, 2, 3, 4] }, expected: [2, 3, 4, -1], description: 'Increasing sequence' },
    { input: { nums: [4, 3, 2, 1] }, expected: [-1, -1, -1, -1], description: 'Decreasing sequence (no next greater)' }
  ],
  
  defaultParams: { nums: [4, 5, 2, 25] },
  paramControls: [
    { name: 'nums', type: 'array', label: 'Input Array', default: [4, 5, 2, 25], description: 'Array to find next greater elements for' }
  ],
  
  estimatedTimeMinutes: 20,
  prerequisites: ['Stack Data Structure', 'Monotonic Stack', 'Array Processing'],
  relatedAlgorithms: ['stockSpan', 'largestRectangleHistogram', 'dailyTemperatures']
};

export const stackAlgorithms = [
  validParenthesesAlgorithm,
  stockSpanAlgorithm,
  nextGreaterElementAlgorithm
];
