import React from 'react';
import { MousePointer2, Target, ArrowLeftRight, Move, Waves } from 'lucide-react';
import { Algorithm, VisualizationStrategy, ExecutionStrategy } from '../types';
import { delay } from '../utils';

/**
 * Two Pointer Algorithms with Interactive Pointer Movements
 * Composition pattern for efficient array manipulation techniques
 */

// Two pointer visualization strategy
const createTwoPointerVisualization = (
  setupFn: (rows: number, cols: number, params: any) => any[][],
  animateFn: (context: any, setGrid: any) => Promise<void>
): VisualizationStrategy => ({
  id: 'two-pointer-visualization',
  name: 'Two Pointer Visualization',
  description: 'Visualizes two pointer technique with dynamic pointer movements',
  setup: setupFn,
  animate: animateFn,
  getStepCount: (params) => (params.array?.length || 8) * 2
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

// 1. TWO SUM (Two Pointer Approach)
export const twoSumAlgorithm: Algorithm = {
  id: 'twoSum',
  name: 'Two Sum (Two Pointer)',
  category: { id: 'two_pointer', name: 'Two Pointer Techniques', description: '', icon: React.createElement(MousePointer2), color: 'cyan', gradient: 'from-cyan-500 to-teal-600' },
  difficulty: 'easy',
  icon: React.createElement(Target, { className: "h-6 w-6" }),
  tags: ['Two Pointer', 'Array', 'Search', 'Sorted Array'],
  
  visualization: createTwoPointerVisualization(
    (rows, cols, params) => {
      const nums = params?.nums || [2, 7, 11, 15];
      const target = params?.target || 9;
      return [
        // Array values
        nums.map(num => ({ value: num, visited: false, highlighted: false, isLeft: false, isRight: false })),
        // Pointer indicators
        nums.map(() => ({ value: '', visited: false, highlighted: false, isLeft: false, isRight: false })),
        // Sum display
        [{ value: `Target: ${target}`, visited: false, highlighted: false, isLeft: false, isRight: false }, ...Array(nums.length - 1).fill({ value: '', visited: false, highlighted: false, isLeft: false, isRight: false })]
      ];
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const nums = params.nums as number[] || [2, 7, 11, 15];
      const target = params.target as number || 9;
      let left = 0;
      let right = nums.length - 1;
      
      while (left < right) {
        // Update pointer positions
        for (let i = 0; i < nums.length; i++) {
          grid[0][i] = { ...grid[0][i], isLeft: i === left, isRight: i === right };
          grid[1][i] = { 
            value: i === left ? '👆L' : i === right ? '👆R' : '',
            visited: false,
            highlighted: false,
            isLeft: i === left,
            isRight: i === right
          };
        }
        
        const currentSum = nums[left] + nums[right];
        
        // Update sum display
        grid[2][1] = { 
          value: `${nums[left]} + ${nums[right]} = ${currentSum}`,
          visited: false,
          highlighted: currentSum === target,
          isLeft: false,
          isRight: false
        };
        
        // Highlight current elements
        grid[0][left] = { ...grid[0][left], highlighted: true };
        grid[0][right] = { ...grid[0][right], highlighted: true };
        
        setGrid([...grid]);
        await delay(context.speed);
        
        if (currentSum === target) {
          // Found the answer
          grid[2][2] = { 
            value: `✓ Found: [${left}, ${right}]`,
            visited: false,
            highlighted: true,
            isLeft: false,
            isRight: false
          };
          setGrid([...grid]);
          await delay(context.speed * 2);
          break;
        } else if (currentSum < target) {
          // Sum too small, move left pointer right
          grid[0][left] = { ...grid[0][left], highlighted: false };
          left++;
        } else {
          // Sum too large, move right pointer left
          grid[0][right] = { ...grid[0][right], highlighted: false };
          right--;
        }
        
        setGrid([...grid]);
        await delay(context.speed);
      }
      
      if (left >= right) {
        grid[2][2] = { 
          value: '✗ No solution found',
          visited: false,
          highlighted: true,
          isLeft: false,
          isRight: false
        };
        setGrid([...grid]);
      }
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const { nums, target } = input;
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [-1, -1]; // No solution found
}`)
  ],
  
  education: {
    overview: 'Find two numbers in a sorted array that add up to a target sum using two pointers from opposite ends. This approach is efficient for sorted arrays.',
    keyInsights: [
      'Requires sorted array for two-pointer approach to work',
      'Move left pointer right when sum is too small',
      'Move right pointer left when sum is too large',
      'O(1) space complexity compared to hash table approach'
    ],
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n)',
      worst: 'O(n)',
      explanation: 'We traverse the array at most once with two pointers'
    },
    spaceComplexity: {
      value: 'O(1)',
      explanation: 'Only use two pointer variables, no extra data structures'
    },
    whenToUse: [
      'Finding pairs with specific sum in sorted arrays',
      'When space complexity is critical',
      '3Sum and other multi-sum problems',
      'Sorted array optimization problems'
    ],
    commonPitfalls: [
      'Using on unsorted arrays (must sort first)',
      'Not handling duplicate values correctly',
      'Forgetting to check array bounds',
      'Returning values instead of indices when asked for indices'
    ],
    realWorldApplications: [
      {
        title: 'Financial Portfolio Balancing',
        description: 'Find investment pairs that sum to target allocation',
        industry: 'Finance'
      },
      {
        title: 'Resource Allocation',
        description: 'Pair resources that meet combined requirements',
        industry: 'Operations Management'
      },
      {
        title: 'Chemical Formula Balancing',
        description: 'Find compounds that balance chemical equations',
        industry: 'Chemistry & Research'
      }
    ]
  },
  
  testCases: [
    { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1], description: 'Classic two sum example' },
    { input: { nums: [2, 3, 4], target: 6 }, expected: [0, 2], description: 'Non-adjacent elements' },
    { input: { nums: [-1, 0], target: -1 }, expected: [0, 1], description: 'Array with negative numbers' },
    { input: { nums: [1, 2, 3, 4], target: 10 }, expected: [-1, -1], description: 'No valid pair exists' }
  ],
  
  defaultParams: { nums: [2, 7, 11, 15], target: 9 },
  paramControls: [
    { name: 'nums', type: 'array', label: 'Sorted Array', default: [2, 7, 11, 15], description: 'Sorted array to search in' },
    { name: 'target', type: 'number', label: 'Target Sum', min: 1, max: 30, default: 9, description: 'Target sum to find' }
  ],
  
  estimatedTimeMinutes: 15,
  prerequisites: ['Array Basics', 'Two Pointer Technique'],
  relatedAlgorithms: ['threeSum', 'removeDuplicates', 'containerWithMostWater']
};

// 2. REMOVE DUPLICATES FROM SORTED ARRAY
export const removeDuplicatesAlgorithm: Algorithm = {
  id: 'removeDuplicates',
  name: 'Remove Duplicates from Sorted Array',
  category: { id: 'two_pointer', name: 'Two Pointer Techniques', description: '', icon: React.createElement(MousePointer2), color: 'cyan', gradient: 'from-cyan-500 to-teal-600' },
  difficulty: 'easy',
  icon: React.createElement(ArrowLeftRight, { className: "h-6 w-6" }),
  tags: ['Two Pointer', 'Array', 'In-place', 'Duplicates'],
  
  visualization: createTwoPointerVisualization(
    (rows, cols, params) => {
      const nums = params?.nums || [1, 1, 2, 2, 2, 3, 3];
      return [
        // Original array
        nums.map(num => ({ value: num, visited: false, highlighted: false, isUnique: false, isDuplicate: false })),
        // Pointer indicators  
        nums.map(() => ({ value: '', visited: false, highlighted: false, isLeft: false, isRight: false })),
        // Result array
        nums.map(() => ({ value: '', visited: false, highlighted: false, isResult: false }))
      ];
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const nums = params.nums as number[] || [1, 1, 2, 2, 2, 3, 3];
      let writeIndex = 1; // Index where to write next unique element
      
      // First element is always unique
      grid[2][0] = { value: nums[0], visited: false, highlighted: false, isResult: true };
      grid[1][0] = { value: '📝', visited: false, highlighted: false, isLeft: false, isRight: false };
      setGrid([...grid]);
      await delay(context.speed);
      
      for (let readIndex = 1; readIndex < nums.length; readIndex++) {
        // Highlight current reading position
        grid[0][readIndex] = { ...grid[0][readIndex], highlighted: true };
        grid[1][readIndex] = { value: '👁️', visited: false, highlighted: false, isLeft: false, isRight: false };
        setGrid([...grid]);
        await delay(context.speed);
        
        if (nums[readIndex] !== nums[readIndex - 1]) {
          // Found unique element, write it
          grid[0][readIndex] = { ...grid[0][readIndex], isUnique: true };
          grid[2][writeIndex] = { value: nums[readIndex], visited: false, highlighted: true, isResult: true };
          grid[1][writeIndex] = { value: '📝', visited: false, highlighted: false, isLeft: false, isRight: false };
          writeIndex++;
        } else {
          // Duplicate element
          grid[0][readIndex] = { ...grid[0][readIndex], isDuplicate: true };
        }
        
        setGrid([...grid]);
        await delay(context.speed);
        
        // Clear highlighting
        grid[0][readIndex] = { ...grid[0][readIndex], highlighted: false };
        grid[1][readIndex] = { value: '', visited: false, highlighted: false, isLeft: false, isRight: false };
        grid[2][writeIndex - 1] = { ...grid[2][writeIndex - 1], highlighted: false };
        setGrid([...grid]);
        await delay(context.speed / 2);
      }
      
      // Show final result length
      grid[1][Math.floor(nums.length / 2)] = { 
        value: `Length: ${writeIndex}`, 
        visited: false, 
        highlighted: true, 
        isLeft: false, 
        isRight: false 
      };
      setGrid([...grid]);
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const nums = input.nums.slice(); // Make a copy to avoid modifying input
  if (nums.length === 0) return 0;
  
  let writeIndex = 1;
  
  for (let readIndex = 1; readIndex < nums.length; readIndex++) {
    if (nums[readIndex] !== nums[readIndex - 1]) {
      nums[writeIndex] = nums[readIndex];
      writeIndex++;
    }
  }
  
  return writeIndex;
}`)
  ],
  
  education: {
    overview: 'Remove duplicates from a sorted array in-place, returning the length of the array with unique elements. Uses two pointers: one for reading, one for writing.',
    keyInsights: [
      'Write pointer only advances when unique element is found',
      'Read pointer scans through entire array',
      'Works because array is sorted (duplicates are adjacent)',
      'Modifies array in-place with O(1) extra space'
    ],
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n)',
      worst: 'O(n)',
      explanation: 'Single pass through the array with read pointer'
    },
    spaceComplexity: {
      value: 'O(1)',
      explanation: 'Only use two pointer variables, modify array in-place'
    },
    whenToUse: [
      'Removing duplicates from sorted arrays in-place',
      'When space complexity must be O(1)',
      'Processing sorted data streams',
      'Array compaction problems'
    ],
    commonPitfalls: [
      'Not handling empty array case',
      'Confusing read and write pointer roles',
      'Trying to use on unsorted arrays',
      'Not returning the correct new length'
    ],
    realWorldApplications: [
      {
        title: 'Data Deduplication',
        description: 'Remove duplicate records from sorted datasets',
        industry: 'Data Processing'
      },
      {
        title: 'Log File Processing',
        description: 'Remove duplicate entries from sorted log files',
        industry: 'System Administration'
      },
      {
        title: 'Inventory Management',
        description: 'Consolidate duplicate item entries',
        industry: 'Retail & Logistics'
      }
    ]
  },
  
  testCases: [
    { input: { nums: [1, 1, 2] }, expected: 2, description: 'Simple case with one duplicate' },
    { input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, expected: 5, description: 'Multiple duplicates' },
    { input: { nums: [1] }, expected: 1, description: 'Single element array' },
    { input: { nums: [1, 2, 3, 4, 5] }, expected: 5, description: 'No duplicates (all unique)' }
  ],
  
  defaultParams: { nums: [1, 1, 2, 2, 2, 3, 3] },
  paramControls: [
    { name: 'nums', type: 'array', label: 'Sorted Array', default: [1, 1, 2, 2, 2, 3, 3], description: 'Sorted array with duplicates' }
  ],
  
  estimatedTimeMinutes: 12,
  prerequisites: ['Array Basics', 'Two Pointer Technique', 'In-place Algorithms'],
  relatedAlgorithms: ['twoSum', 'moveZeroes', 'reverseArray']
};

// 3. PALINDROME CHECK
export const palindromeCheckAlgorithm: Algorithm = {
  id: 'palindromeCheck',
  name: 'Palindrome Check',
  category: { id: 'two_pointer', name: 'Two Pointer Techniques', description: '', icon: React.createElement(MousePointer2), color: 'cyan', gradient: 'from-cyan-500 to-teal-600' },
  difficulty: 'easy',
  icon: React.createElement(Move, { className: "h-6 w-6" }),
  tags: ['Two Pointer', 'String', 'Palindrome', 'Character Comparison'],
  
  visualization: createTwoPointerVisualization(
    (rows, cols, params) => {
      const str = params?.str || 'racecar';
      const chars = str.toLowerCase().split('');
      return [
        // String characters
        chars.map(char => ({ value: char, visited: false, highlighted: false, isMatch: false, isMismatch: false })),
        // Pointer indicators
        chars.map(() => ({ value: '', visited: false, highlighted: false, isLeft: false, isRight: false })),
        // Comparison result
        [{ value: 'Checking...', visited: false, highlighted: false, isResult: false }, ...Array(chars.length - 1).fill({ value: '', visited: false, highlighted: false })]
      ];
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const str = params.str as string || 'racecar';
      const chars = str.toLowerCase().split('');
      let left = 0;
      let right = chars.length - 1;
      let isPalindrome = true;
      
      while (left < right) {
        // Update pointer positions
        for (let i = 0; i < chars.length; i++) {
          grid[1][i] = { 
            value: i === left ? '👈' : i === right ? '👉' : '',
            visited: false,
            highlighted: false,
            isLeft: i === left,
            isRight: i === right
          };
        }
        
        // Highlight current comparison
        grid[0][left] = { ...grid[0][left], highlighted: true };
        grid[0][right] = { ...grid[0][right], highlighted: true };
        
        setGrid([...grid]);
        await delay(context.speed);
        
        if (chars[left] === chars[right]) {
          // Characters match
          grid[0][left] = { ...grid[0][left], isMatch: true, highlighted: false };
          grid[0][right] = { ...grid[0][right], isMatch: true, highlighted: false };
          grid[2][0] = { 
            value: `'${chars[left]}' == '${chars[right]}' ✓`,
            visited: false,
            highlighted: false,
            isResult: false
          };
          left++;
          right--;
        } else {
          // Characters don't match
          grid[0][left] = { ...grid[0][left], isMismatch: true, highlighted: false };
          grid[0][right] = { ...grid[0][right], isMismatch: true, highlighted: false };
          grid[2][0] = { 
            value: `'${chars[left]}' != '${chars[right]}' ✗`,
            visited: false,
            highlighted: true,
            isResult: false
          };
          isPalindrome = false;
          setGrid([...grid]);
          await delay(context.speed * 2);
          break;
        }
        
        setGrid([...grid]);
        await delay(context.speed);
      }
      
      // Final result
      grid[2][0] = { 
        value: isPalindrome ? '✅ IS PALINDROME!' : '❌ NOT PALINDROME!',
        visited: false,
        highlighted: true,
        isResult: true
      };
      
      // Clear pointer indicators
      for (let i = 0; i < chars.length; i++) {
        grid[1][i] = { value: '', visited: false, highlighted: false, isLeft: false, isRight: false };
      }
      
      setGrid([...grid]);
      await delay(context.speed * 2);
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const s = input.str.toLowerCase().replace(/[^a-z0-9]/g, ''); // Clean string
  let left = 0;
  let right = s.length - 1;
  
  while (left < right) {
    if (s[left] !== s[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}`)
  ],
  
  education: {
    overview: 'Check if a string reads the same forwards and backwards using two pointers moving from opposite ends toward the center.',
    keyInsights: [
      'Compare characters from outside moving inward',
      'Stop as soon as any mismatch is found',
      'Only need to check half the string (pointers meet in middle)',
      'Can handle both odd and even length strings'
    ],
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n)',
      worst: 'O(n)',
      explanation: 'In worst case, check all n/2 pairs of characters'
    },
    spaceComplexity: {
      value: 'O(1)',
      explanation: 'Only use two pointer variables, no extra storage needed'
    },
    whenToUse: [
      'Validating palindromes in strings or arrays',
      'String symmetry problems',
      'Checking if sequences are mirror images',
      'Input validation for palindromic constraints'
    ],
    commonPitfalls: [
      'Not handling case sensitivity (convert to lowercase)',
      'Not ignoring non-alphanumeric characters',
      'Off-by-one errors with pointer boundaries',
      'Not handling empty string edge case'
    ],
    realWorldApplications: [
      {
        title: 'DNA Sequence Analysis',
        description: 'Check for palindromic DNA sequences (restriction sites)',
        industry: 'Bioinformatics'
      },
      {
        title: 'Text Processing',
        description: 'Validate palindromic words in word games',
        industry: 'Gaming & Entertainment'
      },
      {
        title: 'Data Validation',
        description: 'Ensure data integrity with palindromic checksums',
        industry: 'Data Processing'
      }
    ]
  },
  
  testCases: [
    { input: { str: 'racecar' }, expected: true, description: 'Classic palindrome example' },
    { input: { str: 'A man a plan a canal Panama' }, expected: true, description: 'Palindrome with spaces and capitals' },
    { input: { str: 'race a car' }, expected: false, description: 'Not a palindrome when cleaned' },
    { input: { str: 'a' }, expected: true, description: 'Single character is palindrome' },
    { input: { str: '' }, expected: true, description: 'Empty string is considered palindrome' }
  ],
  
  defaultParams: { str: 'racecar' },
  paramControls: [
    { name: 'str', type: 'string', label: 'Input String', default: 'racecar', description: 'String to check for palindrome' }
  ],
  
  estimatedTimeMinutes: 10,
  prerequisites: ['String Manipulation', 'Two Pointer Technique'],
  relatedAlgorithms: ['twoSum', 'reverseString', 'longestPalindrome']
};

export const twoPointerAlgorithms = [
  twoSumAlgorithm,
  removeDuplicatesAlgorithm,
  palindromeCheckAlgorithm
];
