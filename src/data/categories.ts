import React from 'react';
import { 
  TrendingUp, 
  Layers, 
  TreePine, 
  MousePointer2, 
  Grid3X3, 
  Type, 
  Zap,
  Binary,
  Hash
} from 'lucide-react';
import { AlgorithmCategory } from '../types';

/**
 * Comprehensive algorithm categories with beautiful design
 * Using composition pattern for flexible categorization
 */
export const algorithmCategories: AlgorithmCategory[] = [
  {
    id: 'dynamic_programming',
    name: 'Dynamic Programming',
    description: 'Master the art of breaking complex problems into simpler subproblems. Build solutions bottom-up and avoid redundant calculations.',
    icon: React.createElement(TrendingUp, { className: "h-6 w-6" }),
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'graph',
    name: 'Graph Algorithms',
    description: 'Explore connected data structures. Navigate networks, find shortest paths, and solve connectivity problems.',
    icon: React.createElement(Layers, { className: "h-6 w-6" }),
    color: 'purple', 
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'tree',
    name: 'Tree Algorithms',
    description: 'Navigate hierarchical data structures. Master tree traversals, balancing, and search operations.',
    icon: React.createElement(TreePine, { className: "h-6 w-6" }),
    color: 'green',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'stack',
    name: 'Stack Algorithms',
    description: 'Leverage LIFO data structures. Solve parsing, evaluation, and bracketing problems with stack-based approaches.',
    icon: React.createElement(Layers, { className: "h-6 w-6" }),
    color: 'orange',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'two_pointer',
    name: 'Two Pointer Techniques',
    description: 'Efficient array and string manipulation using multiple pointers. Solve problems with optimal space complexity.',
    icon: React.createElement(MousePointer2, { className: "h-6 w-6" }),
    color: 'cyan',
    gradient: 'from-cyan-500 to-teal-600'
  },
  {
    id: 'array',
    name: 'Array Algorithms',
    description: 'Master fundamental array operations. Sorting, searching, and manipulation techniques for sequential data.',
    icon: React.createElement(Grid3X3, { className: "h-6 w-6" }),
    color: 'yellow',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'string',
    name: 'String Algorithms',
    description: 'Pattern matching, text processing, and string manipulation. From basic operations to advanced algorithms.',
    icon: React.createElement(Type, { className: "h-6 w-6" }),
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600'
  },
  {
    id: 'greedy',
    name: 'Greedy Algorithms',
    description: 'Make locally optimal choices. Solve optimization problems with simple, intuitive approaches.',
    icon: React.createElement(Zap, { className: "h-6 w-6" }),
    color: 'lime',
    gradient: 'from-lime-500 to-green-500'
  },
  {
    id: 'binary_search',
    name: 'Binary Search',
    description: 'Divide and conquer sorted data. Master the art of logarithmic time complexity searches.',
    icon: React.createElement(Binary, { className: "h-6 w-6" }),
    color: 'slate',
    gradient: 'from-slate-500 to-gray-600'
  },
  {
    id: 'hashing',
    name: 'Hashing Techniques',
    description: 'Leverage hash tables for fast lookups. Solve frequency, mapping, and caching problems efficiently.',
    icon: React.createElement(Hash, { className: "h-6 w-6" }),
    color: 'violet',
    gradient: 'from-violet-500 to-purple-600'
  }
];

/**
 * Get category by ID with composition support
 */
export const getCategoryById = (id: string): AlgorithmCategory | undefined => {
  return algorithmCategories.find(category => category.id === id);
};

/**
 * Get categories by color theme
 */
export const getCategoriesByColor = (color: string): AlgorithmCategory[] => {
  return algorithmCategories.filter(category => category.color === color);
};

/**
 * Get featured categories (for home page display)
 */
export const getFeaturedCategories = (): AlgorithmCategory[] => {
  return algorithmCategories.slice(0, 5); // Show first 5 categories as featured
};

/**
 * Category metadata for enhanced UI
 */
export const categoryMetadata = {
  dynamic_programming: {
    learningPath: ['uniquePaths', 'coinChange', 'longestIncreasingSubsequence', 'editDistance'],
    difficulty: 'Advanced',
    estimatedHours: 8,
    prerequisites: ['Recursion', 'Mathematical Thinking']
  },
  graph: {
    learningPath: ['bfs', 'dfs', 'dijkstra', 'floydWarshall'],
    difficulty: 'Intermediate',
    estimatedHours: 6,
    prerequisites: ['Data Structures', 'Trees']
  },
  tree: {
    learningPath: ['binaryTreeTraversal', 'bst', 'avlTree', 'trie'],
    difficulty: 'Intermediate', 
    estimatedHours: 5,
    prerequisites: ['Recursion', 'Basic Data Structures']
  },
  stack: {
    learningPath: ['validParentheses', 'stockSpan', 'nextGreaterElement', 'largestRectangle'],
    difficulty: 'Beginner',
    estimatedHours: 3,
    prerequisites: ['Basic Data Structures']
  },
  two_pointer: {
    learningPath: ['twoSum', 'removeDuplicates', 'palindromeCheck', 'containerWithMostWater'],
    difficulty: 'Beginner',
    estimatedHours: 2,
    prerequisites: ['Array Basics']
  }
};