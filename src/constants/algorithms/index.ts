import { Algorithm } from '../../types';
import { uniquePathsAlgorithm } from './uniquePaths';
import { coinChangeAlgorithm } from './coinChange';
import { lisAlgorithm } from './lis';
import { knapsackAlgorithm } from './knapsack';
import { minPathSumAlgorithm } from './minPathSum';

/**
 * All available algorithms for dynamic programming visualization
 */
export const algorithms: Algorithm[] = [
  uniquePathsAlgorithm,
  coinChangeAlgorithm,
  lisAlgorithm,
  knapsackAlgorithm,
  minPathSumAlgorithm
];

/**
 * Get algorithm by ID
 */
export const getAlgorithmById = (id: string): Algorithm | undefined => {
  return algorithms.find(algo => algo.id === id);
};

/**
 * Get all algorithm IDs
 */
export const getAllAlgorithmIds = (): string[] => {
  return algorithms.map(algo => algo.id);
};

/**
 * Export individual algorithms
 */
export {
  uniquePathsAlgorithm,
  coinChangeAlgorithm,
  lisAlgorithm,
  knapsackAlgorithm,
  minPathSumAlgorithm
};
