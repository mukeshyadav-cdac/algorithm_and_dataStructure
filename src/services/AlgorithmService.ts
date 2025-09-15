import { Algorithm, AlgorithmSolution, AlgorithmCategory } from '@/types';
import { validateAlgorithmParams, ValidationResult } from '@/utils';

/**
 * Algorithm Service
 * Single Responsibility: Only handles algorithm-related operations
 * Repository Pattern: Manages algorithm data and operations
 */
export class AlgorithmService {
  private algorithms: Map<string, Algorithm> = new Map();
  private categories: Map<string, AlgorithmCategory> = new Map();

  /**
   * Register an algorithm
   * SRP: Only handles algorithm registration
   */
  registerAlgorithm(algorithm: Algorithm): void {
    // Validate algorithm structure
    const validation = this.validateAlgorithm(algorithm);
    if (!validation.valid) {
      throw new Error(`Invalid algorithm: ${validation.errors.join(', ')}`);
    }

    this.algorithms.set(algorithm.id, algorithm);
  }

  /**
   * Get algorithm by ID
   * SRP: Only handles algorithm retrieval
   */
  getAlgorithm(id: string): Algorithm | undefined {
    return this.algorithms.get(id);
  }

  /**
   * Get all algorithms
   * SRP: Only handles algorithm collection retrieval
   */
  getAllAlgorithms(): Algorithm[] {
    return Array.from(this.algorithms.values());
  }

  /**
   * Get algorithms by category
   * SRP: Only handles category-based filtering
   */
  getAlgorithmsByCategory(category: string): Algorithm[] {
    return Array.from(this.algorithms.values())
      .filter(algorithm => algorithm.category === category);
  }

  /**
   * Get algorithms by difficulty
   * SRP: Only handles difficulty-based filtering
   */
  getAlgorithmsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Algorithm[] {
    return Array.from(this.algorithms.values())
      .filter(algorithm => algorithm.difficulty === difficulty);
  }

  /**
   * Search algorithms by tags
   * SRP: Only handles tag-based searching
   */
  searchAlgorithmsByTags(tags: string[]): Algorithm[] {
    return Array.from(this.algorithms.values())
      .filter(algorithm => 
        tags.some(tag => algorithm.tags.includes(tag.toLowerCase()))
      );
  }

  /**
   * Get solution by ID
   * SRP: Only handles solution retrieval
   */
  getSolution(algorithmId: string, solutionId: string): AlgorithmSolution | undefined {
    const algorithm = this.getAlgorithm(algorithmId);
    if (!algorithm) return undefined;
    
    return algorithm.solutions.find(solution => solution.id === solutionId);
  }

  /**
   * Get all solutions for an algorithm
   * SRP: Only handles solution collection retrieval
   */
  getSolutions(algorithmId: string): AlgorithmSolution[] {
    const algorithm = this.getAlgorithm(algorithmId);
    return algorithm?.solutions || [];
  }

  /**
   * Get solutions by approach
   * SRP: Only handles approach-based filtering
   */
  getSolutionsByApproach(algorithmId: string, approach: string): AlgorithmSolution[] {
    const solutions = this.getSolutions(algorithmId);
    return solutions.filter(solution => solution.approach === approach);
  }

  /**
   * Validate algorithm parameters
   * SRP: Only handles parameter validation for algorithms
   */
  validateParameters(algorithmId: string, params: Record<string, unknown>): ValidationResult {
    const algorithm = this.getAlgorithm(algorithmId);
    if (!algorithm) {
      return { valid: false, errors: ['Algorithm not found'] };
    }

    // Use algorithm-specific validation
    switch (algorithmId) {
      case 'uniquePaths':
        return validateAlgorithmParams.uniquePaths(
          params.m as number || 0,
          params.n as number || 0
        );
      
      case 'coinChange':
        return validateAlgorithmParams.coinChange(
          params.coins as number[] || [],
          params.amount as number || 0
        );
      
      case 'knapsack':
        return validateAlgorithmParams.knapsack(
          params.weights as number[] || [],
          params.values as number[] || [],
          params.capacity as number || 0
        );
      
      case 'climbingStairs':
        return validateAlgorithmParams.climbingStairs(
          params.n as number || 0
        );
      
      default:
        // Generic validation for unknown algorithms
        return this.validateGenericParameters(algorithm, params);
    }
  }

  /**
   * Get learning path for algorithms
   * SRP: Only handles learning path generation
   */
  getLearningPath(targetAlgorithmId: string): Algorithm[] {
    const targetAlgorithm = this.getAlgorithm(targetAlgorithmId);
    if (!targetAlgorithm) return [];

    const path: Algorithm[] = [];
    const visited = new Set<string>();

    // Add prerequisite algorithms
    const addPrerequisites = (algorithm: Algorithm) => {
      if (visited.has(algorithm.id)) return;
      visited.add(algorithm.id);

      // Find algorithms that match prerequisites
      algorithm.prerequisites.forEach(prereq => {
        const prerequisiteAlg = Array.from(this.algorithms.values())
          .find(alg => alg.concepts.some(concept => 
            concept.toLowerCase().includes(prereq.toLowerCase())
          ));
        
        if (prerequisiteAlg && !visited.has(prerequisiteAlg.id)) {
          addPrerequisites(prerequisiteAlg);
        }
      });

      path.push(algorithm);
    };

    addPrerequisites(targetAlgorithm);
    return path;
  }

  /**
   * Get related algorithms
   * SRP: Only handles related algorithm discovery
   */
  getRelatedAlgorithms(algorithmId: string): Algorithm[] {
    const algorithm = this.getAlgorithm(algorithmId);
    if (!algorithm) return [];

    const related: Algorithm[] = [];
    
    // Find explicitly related algorithms
    algorithm.relatedAlgorithms.forEach(relatedId => {
      const relatedAlg = this.getAlgorithm(relatedId);
      if (relatedAlg) {
        related.push(relatedAlg);
      }
    });

    // Find algorithms with similar concepts
    const similarConcepts = Array.from(this.algorithms.values())
      .filter(alg => 
        alg.id !== algorithmId &&
        alg.concepts.some(concept => algorithm.concepts.includes(concept))
      )
      .slice(0, 5); // Limit to 5 similar algorithms

    related.push(...similarConcepts);

    // Remove duplicates and return
    return Array.from(new Map(related.map(alg => [alg.id, alg])).values());
  }

  /**
   * Register algorithm category
   * SRP: Only handles category registration
   */
  registerCategory(category: AlgorithmCategory): void {
    this.categories.set(category.id, category);
  }

  /**
   * Get all categories
   * SRP: Only handles category collection retrieval
   */
  getAllCategories(): AlgorithmCategory[] {
    return Array.from(this.categories.values());
  }

  /**
   * Get category by ID
   * SRP: Only handles category retrieval
   */
  getCategory(id: string): AlgorithmCategory | undefined {
    return this.categories.get(id);
  }

  /**
   * Get algorithm statistics
   * SRP: Only handles statistical analysis
   */
  getStatistics(): {
    totalAlgorithms: number;
    algorithmsByCategory: Record<string, number>;
    algorithmsByDifficulty: Record<string, number>;
    totalSolutions: number;
    solutionsByApproach: Record<string, number>;
  } {
    const algorithms = this.getAllAlgorithms();
    
    const algorithmsByCategory: Record<string, number> = {};
    const algorithmsByDifficulty: Record<string, number> = {};
    const solutionsByApproach: Record<string, number> = {};
    let totalSolutions = 0;

    algorithms.forEach(algorithm => {
      // Count by category
      algorithmsByCategory[algorithm.category] = 
        (algorithmsByCategory[algorithm.category] || 0) + 1;
      
      // Count by difficulty
      algorithmsByDifficulty[algorithm.difficulty] = 
        (algorithmsByDifficulty[algorithm.difficulty] || 0) + 1;
      
      // Count solutions by approach
      algorithm.solutions.forEach(solution => {
        totalSolutions++;
        solutionsByApproach[solution.approach] = 
          (solutionsByApproach[solution.approach] || 0) + 1;
      });
    });

    return {
      totalAlgorithms: algorithms.length,
      algorithmsByCategory,
      algorithmsByDifficulty,
      totalSolutions,
      solutionsByApproach,
    };
  }

  /**
   * Private method to validate algorithm structure
   * SRP: Only handles algorithm validation
   */
  private validateAlgorithm(algorithm: Algorithm): ValidationResult {
    const errors: string[] = [];

    // Required fields
    if (!algorithm.id) errors.push('Algorithm ID is required');
    if (!algorithm.name) errors.push('Algorithm name is required');
    if (!algorithm.description) errors.push('Algorithm description is required');
    if (!algorithm.category) errors.push('Algorithm category is required');
    if (!algorithm.difficulty) errors.push('Algorithm difficulty is required');
    if (!algorithm.solutions || algorithm.solutions.length === 0) {
      errors.push('Algorithm must have at least one solution');
    }

    // Validate solutions
    algorithm.solutions?.forEach((solution, index) => {
      if (!solution.id) errors.push(`Solution ${index} is missing ID`);
      if (!solution.name) errors.push(`Solution ${index} is missing name`);
      if (!solution.approach) errors.push(`Solution ${index} is missing approach`);
      if (!solution.complexity) errors.push(`Solution ${index} is missing complexity information`);
    });

    // Validate default solution exists
    if (algorithm.defaultSolutionId && 
        !algorithm.solutions?.some(s => s.id === algorithm.defaultSolutionId)) {
      errors.push('Default solution ID does not match any solution');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Generic parameter validation for unknown algorithms
   * SRP: Only handles generic validation
   */
  private validateGenericParameters(
    algorithm: Algorithm, 
    params: Record<string, unknown>
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if all required parameters are provided
    algorithm.paramControls.forEach(control => {
      if (!(control.name in params)) {
        errors.push(`Missing required parameter: ${control.name}`);
        return;
      }

      const value = params[control.name];
      
      // Type validation
      switch (control.type) {
        case 'number':
          if (typeof value !== 'number' || isNaN(value)) {
            errors.push(`Parameter ${control.name} must be a number`);
          } else {
            if (control.min !== undefined && value < control.min) {
              errors.push(`Parameter ${control.name} must be at least ${control.min}`);
            }
            if (control.max !== undefined && value > control.max) {
              errors.push(`Parameter ${control.name} must be at most ${control.max}`);
            }
          }
          break;
        
        case 'array':
          if (!Array.isArray(value)) {
            errors.push(`Parameter ${control.name} must be an array`);
          }
          break;
        
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`Parameter ${control.name} must be a string`);
          }
          break;
        
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`Parameter ${control.name} must be a boolean`);
          }
          break;
      }
    });

    return { valid: errors.length === 0, errors, warnings };
  }
}
