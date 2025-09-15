import { Algorithm } from '../types';

// Import all algorithm categories
import { dynamicProgrammingAlgorithms } from '../algorithms/dynamicProgramming';
import { graphAlgorithms } from '../algorithms/graphAlgorithms';
import { treeAlgorithms } from '../algorithms/treeAlgorithms';
import { stackAlgorithms } from '../algorithms/stackAlgorithms';
import { twoPointerAlgorithms } from '../algorithms/twoPointerAlgorithms';

/**
 * Comprehensive Algorithm Collection
 * Uses composition pattern to organize algorithms by category
 */

// Consolidate all algorithms into a single collection
export const algorithms: Algorithm[] = [
  // Dynamic Programming Algorithms (3 algorithms)
  ...dynamicProgrammingAlgorithms,
  
  // Graph Algorithms (3 algorithms) 
  ...graphAlgorithms,
  
  // Tree Algorithms (2 algorithms)
  ...treeAlgorithms,
  
  // Stack Algorithms (3 algorithms)
  ...stackAlgorithms,
  
  // Two Pointer Algorithms (3 algorithms)
  ...twoPointerAlgorithms
];

/**
 * Get algorithm by ID
 */
export const getAlgorithmById = (id: string): Algorithm | undefined => {
  return algorithms.find(algorithm => algorithm.id === id);
};

/**
 * Get algorithms by category
 */
export const getAlgorithmsByCategory = (categoryId: string): Algorithm[] => {
  return algorithms.filter(algorithm => algorithm.category.id === categoryId);
};

/**
 * Get algorithms by difficulty
 */
export const getAlgorithmsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Algorithm[] => {
  return algorithms.filter(algorithm => algorithm.difficulty === difficulty);
};

/**
 * Search algorithms by name or description
 */
export const searchAlgorithms = (query: string): Algorithm[] => {
  const lowerQuery = query.toLowerCase();
  return algorithms.filter(algorithm => 
    algorithm.name.toLowerCase().includes(lowerQuery) ||
    algorithm.education.overview.toLowerCase().includes(lowerQuery) ||
    algorithm.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Get featured algorithms for homepage
 */
export const getFeaturedAlgorithms = (): Algorithm[] => {
  return [
    getAlgorithmById('uniquePaths'),
    getAlgorithmById('breadthFirstSearch'),
    getAlgorithmById('binaryTreeTraversal'),
    getAlgorithmById('validParentheses'),
    getAlgorithmById('twoSum')
  ].filter(Boolean) as Algorithm[];
};

// Export constants
export const TOTAL_ALGORITHMS = algorithms.length;
export const DEFAULT_ALGORITHM = algorithms[0];