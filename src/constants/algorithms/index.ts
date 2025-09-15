// Algorithm definitions export
// Following Barrel Pattern for clean imports

export { uniquePathsMultipleSolutions } from './uniquePathsMultipleSolutions';
export { coinChangeMultipleSolutions } from './coinChangeMultipleSolutions';

// Algorithm registry for easy access
import { uniquePathsMultipleSolutions } from './uniquePathsMultipleSolutions';
import { coinChangeMultipleSolutions } from './coinChangeMultipleSolutions';
import type { Algorithm, AlgorithmCategory } from '@/types';
import { Grid3X3, Coins, TrendingUp, Package } from 'lucide-react';

/**
 * Main algorithm registry
 * Repository Pattern: Central registry for all available algorithms
 */
export const ALGORITHM_REGISTRY = new Map<string, Algorithm>([
  ['uniquePaths', uniquePathsMultipleSolutions],
  ['coinChange', coinChangeMultipleSolutions],
]);

/**
 * Algorithm categories for organization
 * Strategy Pattern: Different categories group related algorithms
 */
export const ALGORITHM_CATEGORIES: AlgorithmCategory[] = [
  {
    id: 'dynamic_programming',
    name: 'Dynamic Programming',
    description: 'Algorithms that solve problems by breaking them down into overlapping subproblems',
    algorithms: ['uniquePaths', 'coinChange'],
    color: '#3b82f6',
    icon: TrendingUp,
  },
  {
    id: 'grid_problems',
    name: 'Grid Problems',
    description: 'Problems involving 2D grids and path finding',
    algorithms: ['uniquePaths'],
    color: '#10b981',
    icon: Grid3X3,
  },
  {
    id: 'optimization',
    name: 'Optimization',
    description: 'Problems focused on finding optimal solutions with constraints',
    algorithms: ['coinChange'],
    color: '#f59e0b',
    icon: Coins,
  },
  {
    id: 'combinatorics',
    name: 'Combinatorics',
    description: 'Problems involving counting and combinatorial structures',
    algorithms: ['uniquePaths'],
    color: '#8b5cf6',
    icon: Package,
  },
];

/**
 * Get all available algorithms
 * Repository Pattern: Provides access to all algorithms
 */
export const getAllAlgorithms = (): Algorithm[] => {
  return Array.from(ALGORITHM_REGISTRY.values());
};

/**
 * Get algorithm by ID
 * Repository Pattern: Provides lookup by identifier
 */
export const getAlgorithmById = (id: string): Algorithm | undefined => {
  return ALGORITHM_REGISTRY.get(id);
};

/**
 * Get algorithms by category
 * Strategy Pattern: Filter algorithms by category strategy
 */
export const getAlgorithmsByCategory = (categoryId: string): Algorithm[] => {
  const category = ALGORITHM_CATEGORIES.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  return category.algorithms
    .map(algId => ALGORITHM_REGISTRY.get(algId))
    .filter((alg): alg is Algorithm => alg !== undefined);
};

/**
 * Search algorithms by tags or name
 * Strategy Pattern: Text-based search strategy
 */
export const searchAlgorithms = (query: string): Algorithm[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllAlgorithms().filter(algorithm =>
    algorithm.name.toLowerCase().includes(lowercaseQuery) ||
    algorithm.description.toLowerCase().includes(lowercaseQuery) ||
    algorithm.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    algorithm.concepts.some(concept => concept.toLowerCase().includes(lowercaseQuery))
  );
};

/**
 * Get featured algorithms (for homepage or recommendations)
 * Strategy Pattern: Featured content selection strategy
 */
export const getFeaturedAlgorithms = (): Algorithm[] => {
  // Return algorithms sorted by educational value and popularity
  return getAllAlgorithms()
    .sort((a, b) => {
      // Prioritize by estimated time (shorter = more accessible)
      const timeScore = (a.estimatedTime - b.estimatedTime) * 0.1;
      
      // Prioritize by difficulty (easier first)
      const difficultyScore = {
        'easy': 0,
        'medium': 1,
        'hard': 2
      }[a.difficulty] - {
        'easy': 0,
        'medium': 1,
        'hard': 2
      }[b.difficulty];
      
      return timeScore + difficultyScore;
    });
};

/**
 * Get learning path recommendations
 * Template Method Pattern: Defines learning progression algorithm
 */
export const getLearningPath = (): Algorithm[] => {
  const algorithms = getAllAlgorithms();
  
  // Sort by learning progression (simple to complex)
  return algorithms.sort((a, b) => {
    // First, sort by prerequisites (fewer = easier to start)
    const prereqDiff = a.prerequisites.length - b.prerequisites.length;
    if (prereqDiff !== 0) return prereqDiff;
    
    // Then by difficulty
    const difficultyOrder = { 'easy': 0, 'medium': 1, 'hard': 2 };
    const difficultyDiff = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    if (difficultyDiff !== 0) return difficultyDiff;
    
    // Finally by estimated time
    return a.estimatedTime - b.estimatedTime;
  });
};

/**
 * Algorithm statistics for analytics
 * Observer Pattern: Could notify analytics systems
 */
export const getAlgorithmStatistics = () => {
  const algorithms = getAllAlgorithms();
  
  return {
    totalAlgorithms: algorithms.length,
    totalSolutions: algorithms.reduce((sum, alg) => sum + alg.solutions.length, 0),
    categoryCounts: ALGORITHM_CATEGORIES.reduce((acc, category) => {
      acc[category.id] = category.algorithms.length;
      return acc;
    }, {} as Record<string, number>),
    difficultyCounts: algorithms.reduce((acc, alg) => {
      acc[alg.difficulty] = (acc[alg.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    averageEstimatedTime: algorithms.reduce((sum, alg) => sum + alg.estimatedTime, 0) / algorithms.length,
    totalConcepts: new Set(algorithms.flatMap(alg => alg.concepts)).size,
  };
};
