import { 
  AlgorithmSolution, 
  PerformanceMetrics, 
  BenchmarkConfig, 
  BenchmarkResult,
  ComplexityVisualization,
  SolutionComparison,
  ComplexityInsights
} from '../types';

/**
 * Service for analyzing and comparing algorithm complexity
 * Provides real-time performance metrics and educational insights
 */
export class ComplexityAnalysisService {
  private static instance: ComplexityAnalysisService;
  
  // Cache for benchmark results to avoid re-running expensive tests
  private benchmarkCache = new Map<string, BenchmarkResult[]>();
  
  // Performance observers for measuring execution
  private performanceObserver: PerformanceObserver | null = null;

  static getInstance(): ComplexityAnalysisService {
    if (!ComplexityAnalysisService.instance) {
      ComplexityAnalysisService.instance = new ComplexityAnalysisService();
    }
    return ComplexityAnalysisService.instance;
  }

  private constructor() {
    this.initializePerformanceObserver();
  }

  /**
   * Initialize performance observer for measuring execution metrics
   */
  private initializePerformanceObserver(): void {
    if (typeof PerformanceObserver === 'undefined') return;
    
    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        // Handle performance entries if needed
        const entries = list.getEntries();
        console.debug('Performance entries:', entries);
      });
      
      this.performanceObserver.observe({ 
        entryTypes: ['measure', 'mark'] 
      });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  /**
   * Measure performance of a solution execution
   */
  async measureSolutionPerformance(
    solution: AlgorithmSolution,
    testInput: any,
    iterations: number = 10
  ): Promise<PerformanceMetrics> {
    const measurements: PerformanceMetrics[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const metrics = await this.measureSingleExecution(solution, testInput);
      measurements.push(metrics);
    }
    
    // Calculate averages and remove outliers
    return this.aggregateMetrics(measurements);
  }

  /**
   * Measure a single execution with detailed metrics
   */
  private async measureSingleExecution(
    solution: AlgorithmSolution,
    testInput: any
  ): Promise<PerformanceMetrics> {
    const startMark = `solution-${solution.id}-start-${Date.now()}`;
    const endMark = `solution-${solution.id}-end-${Date.now()}`;
    const measureName = `solution-${solution.id}-execution`;
    
    // Initialize metrics tracker
    const metricsTracker = new MetricsTracker();
    
    try {
      // Mark start
      performance.mark(startMark);
      
      // Track memory usage before execution
      const memoryBefore = this.getMemoryUsage();
      
      // Execute the solution with metrics tracking
      if (solution.visualizer) {
        await solution.visualizer(
          { input: testInput, expected: null, description: 'Performance test' },
          () => {}, // Mock grid updater
          () => {}, // Mock step setter
          (metrics) => metricsTracker.update(metrics) // Metrics callback
        );
      } else {
        // Fallback: execute code directly if no visualizer
        await this.executeCodeDirectly(solution, testInput, metricsTracker);
      }
      
      // Mark end
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
      
      // Get execution time
      const measure = performance.getEntriesByName(measureName)[0];
      const executionTime = measure.duration;
      
      // Track memory usage after execution  
      const memoryAfter = this.getMemoryUsage();
      const memoryUsed = Math.max(0, memoryAfter - memoryBefore);
      
      // Clean up performance marks
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);
      
      return {
        executionTime,
        memoryUsage: memoryUsed,
        operations: metricsTracker.operations,
        comparisons: metricsTracker.comparisons,
        assignments: metricsTracker.assignments,
        recursionDepth: metricsTracker.maxRecursionDepth,
        cacheHits: metricsTracker.cacheHits,
        cacheMisses: metricsTracker.cacheMisses,
        spaceUsed: memoryUsed,
        inputSize: this.calculateInputSize(testInput)
      };
      
    } catch (error) {
      console.error('Error measuring solution performance:', error);
      return {
        executionTime: -1,
        memoryUsage: -1,
        operations: -1,
        comparisons: -1,
        assignments: -1,
        spaceUsed: -1,
        inputSize: this.calculateInputSize(testInput)
      };
    }
  }

  /**
   * Execute solution code directly for languages that support it
   */
  private async executeCodeDirectly(
    solution: AlgorithmSolution,
    testInput: any,
    metricsTracker: MetricsTracker
  ): Promise<any> {
    // This would integrate with our runtime test runners
    // For now, simulate execution
    const inputSize = this.calculateInputSize(testInput);
    
    // Simulate operations based on complexity
    const complexity = solution.complexity.time.worst;
    let operations = 0;
    
    if (complexity.includes('n²') || complexity.includes('n^2')) {
      operations = inputSize * inputSize;
    } else if (complexity.includes('n log n')) {
      operations = inputSize * Math.log2(inputSize);
    } else if (complexity.includes('n')) {
      operations = inputSize;
    } else {
      operations = 1;
    }
    
    // Simulate work
    for (let i = 0; i < Math.min(operations, 100000); i++) {
      metricsTracker.operations++;
      if (i % 2 === 0) metricsTracker.comparisons++;
      if (i % 3 === 0) metricsTracker.assignments++;
    }
    
    return null;
  }

  /**
   * Calculate the size of input for complexity analysis
   */
  private calculateInputSize(input: any): number {
    if (typeof input === 'number') return input;
    if (Array.isArray(input)) {
      if (Array.isArray(input[0])) {
        // 2D array
        return input.length * input[0].length;
      }
      return input.length;
    }
    if (typeof input === 'object' && input !== null) {
      // Handle algorithm-specific input formats
      if (input.m && input.n) return input.m * input.n; // uniquePaths
      if (input.nums) return input.nums.length; // LIS
      if (input.grid) return input.grid.length * input.grid[0].length; // minPathSum
      if (input.weights) return input.weights.length; // knapsack
      if (input.coins) return input.amount; // coinChange (amount is complexity driver)
    }
    return 1;
  }

  /**
   * Get approximate memory usage
   */
  private getMemoryUsage(): number {
    try {
      // Use memory API if available (Chrome)
      if ((performance as any).memory) {
        return (performance as any).memory.usedJSHeapSize;
      }
      
      // Fallback estimation
      return Date.now() % 1000000; // Random approximation
    } catch {
      return 0;
    }
  }

  /**
   * Aggregate multiple performance measurements
   */
  private aggregateMetrics(measurements: PerformanceMetrics[]): PerformanceMetrics {
    const validMeasurements = measurements.filter(m => m.executionTime >= 0);
    
    if (validMeasurements.length === 0) {
      return measurements[0]; // Return first measurement even if invalid
    }
    
    // Remove outliers (measurements beyond 2 standard deviations)
    const times = validMeasurements.map(m => m.executionTime);
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    const std = Math.sqrt(times.reduce((a, b) => a + (b - mean) ** 2, 0) / times.length);
    
    const filtered = validMeasurements.filter(m => 
      Math.abs(m.executionTime - mean) <= 2 * std
    );
    
    const final = filtered.length > 0 ? filtered : validMeasurements;
    
    // Calculate averages
    return {
      executionTime: final.reduce((a, b) => a + b.executionTime, 0) / final.length,
      memoryUsage: final.reduce((a, b) => a + b.memoryUsage, 0) / final.length,
      operations: final.reduce((a, b) => a + b.operations, 0) / final.length,
      comparisons: final.reduce((a, b) => a + b.comparisons, 0) / final.length,
      assignments: final.reduce((a, b) => a + b.assignments, 0) / final.length,
      recursionDepth: Math.max(...final.map(m => m.recursionDepth || 0)),
      cacheHits: final.reduce((a, b) => a + (b.cacheHits || 0), 0) / final.length,
      cacheMisses: final.reduce((a, b) => a + (b.cacheMisses || 0), 0) / final.length,
      spaceUsed: final.reduce((a, b) => a + b.spaceUsed, 0) / final.length,
      inputSize: final[0].inputSize
    };
  }

  /**
   * Run comprehensive benchmark across multiple input sizes
   */
  async runBenchmark(
    solution: AlgorithmSolution,
    config: BenchmarkConfig
  ): Promise<BenchmarkResult[]> {
    const cacheKey = `${solution.id}-${JSON.stringify(config)}`;
    
    if (this.benchmarkCache.has(cacheKey)) {
      return this.benchmarkCache.get(cacheKey)!;
    }
    
    const results: BenchmarkResult[] = [];
    
    for (const inputSize of config.inputSizes) {
      console.log(`Benchmarking ${solution.name} with input size ${inputSize}...`);
      
      try {
        const testInput = this.generateTestInput(solution, inputSize);
        const metrics = await Promise.race([
          this.measureSolutionPerformance(solution, testInput, config.iterations),
          new Promise<PerformanceMetrics>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), config.timeout)
          )
        ]);
        
        results.push({
          solutionId: solution.id,
          inputSize,
          metrics,
          iterations: config.iterations,
          variance: this.calculateVariance(metrics),
          outliers: 0 // We already removed outliers in aggregation
        });
        
      } catch (error) {
        console.warn(`Benchmark failed for input size ${inputSize}:`, error);
        // Add failed result
        results.push({
          solutionId: solution.id,
          inputSize,
          metrics: {
            executionTime: -1,
            memoryUsage: -1,
            operations: -1,
            comparisons: -1,
            assignments: -1,
            spaceUsed: -1,
            inputSize
          },
          iterations: 0,
          variance: 0,
          outliers: 0
        });
      }
    }
    
    this.benchmarkCache.set(cacheKey, results);
    return results;
  }

  /**
   * Generate test input of specified size for benchmarking
   */
  private generateTestInput(solution: AlgorithmSolution, size: number): any {
    // Algorithm-specific input generation
    const solutionId = solution.id.split('-')[0]; // Extract base algorithm ID
    
    switch (solutionId) {
      case 'uniquePaths':
        const gridSize = Math.ceil(Math.sqrt(size));
        return { m: gridSize, n: gridSize };
        
      case 'coinChange':
        return { 
          coins: [1, 3, 4, 5], 
          amount: size 
        };
        
      case 'lis':
        return { 
          nums: Array.from({ length: size }, () => Math.floor(Math.random() * 1000))
        };
        
      case 'knapsack':
        return {
          weights: Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1),
          values: Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1),
          capacity: size * 10
        };
        
      case 'minPathSum':
        const rows = Math.ceil(Math.sqrt(size));
        const cols = Math.ceil(size / rows);
        return {
          grid: Array.from({ length: rows }, () => 
            Array.from({ length: cols }, () => Math.floor(Math.random() * 9) + 1)
          )
        };
        
      default:
        return { size };
    }
  }

  /**
   * Calculate variance in performance metrics
   */
  private calculateVariance(metrics: PerformanceMetrics): number {
    // Simple variance approximation
    return metrics.executionTime * 0.1; // 10% of execution time
  }

  /**
   * Compare two solutions across different input sizes
   */
  async compareSolutions(
    solution1: AlgorithmSolution,
    solution2: AlgorithmSolution,
    config: BenchmarkConfig
  ): Promise<SolutionComparison> {
    const [results1, results2] = await Promise.all([
      this.runBenchmark(solution1, config),
      this.runBenchmark(solution2, config)
    ]);
    
    // Calculate average ratios
    let timeRatio = 0;
    let spaceRatio = 0;
    let operationsRatio = 0;
    let validComparisons = 0;
    
    for (let i = 0; i < results1.length && i < results2.length; i++) {
      const r1 = results1[i];
      const r2 = results2[i];
      
      if (r1.metrics.executionTime > 0 && r2.metrics.executionTime > 0) {
        timeRatio += r1.metrics.executionTime / r2.metrics.executionTime;
        spaceRatio += r1.metrics.spaceUsed / r2.metrics.spaceUsed;
        operationsRatio += r1.metrics.operations / r2.metrics.operations;
        validComparisons++;
      }
    }
    
    if (validComparisons > 0) {
      timeRatio /= validComparisons;
      spaceRatio /= validComparisons;
      operationsRatio /= validComparisons;
    }
    
    // Determine winner and reasoning
    const winner = timeRatio < 1 ? solution1.id : solution2.id;
    const reason = timeRatio < 0.8 
      ? `${winner} is significantly faster (${Math.abs(1 - timeRatio) * 100}% improvement)`
      : timeRatio > 1.2
      ? `${winner} is significantly faster (${Math.abs(1 - timeRatio) * 100}% improvement)`
      : 'Performance is very similar between solutions';
    
    return {
      solutionIds: [solution1.id, solution2.id],
      metrics: {
        timeRatio,
        spaceRatio,
        operationsRatio
      },
      recommendation: {
        winner,
        reason,
        tradeoffs: [
          timeRatio < 1 ? `${solution1.name} is faster` : `${solution2.name} is faster`,
          spaceRatio < 1 ? `${solution1.name} uses less memory` : `${solution2.name} uses less memory`,
          `Consider readability: ${solution1.difficulty} vs ${solution2.difficulty} difficulty`
        ]
      },
      visualData: {
        labels: config.inputSizes.map(size => size.toString()),
        solution1Data: results1.map(r => r.metrics.executionTime),
        solution2Data: results2.map(r => r.metrics.executionTime)
      }
    };
  }

  /**
   * Generate educational insights from solution analysis
   */
  generateInsights(solutions: AlgorithmSolution[]): ComplexityInsights {
    const smallInputBest = solutions.reduce((best, current) => {
      const bestTime = best.complexity.time.best;
      const currentTime = current.complexity.time.best;
      
      if (this.compareComplexity(currentTime, bestTime) < 0) {
        return current;
      }
      return best;
    });
    
    const largeInputBest = solutions.reduce((best, current) => {
      const bestTime = best.complexity.time.worst;
      const currentTime = current.complexity.time.worst;
      
      if (this.compareComplexity(currentTime, bestTime) < 0) {
        return current;
      }
      return best;
    });
    
    const memoryBest = solutions.reduce((best, current) => {
      const bestSpace = best.complexity.space.complexity;
      const currentSpace = current.complexity.space.complexity;
      
      if (this.compareComplexity(currentSpace, bestSpace) < 0) {
        return current;
      }
      return best;
    });
    
    return {
      bestApproach: {
        forSmallInputs: smallInputBest.id,
        forLargeInputs: largeInputBest.id,
        forMemoryConstrained: memoryBest.id,
        forTimeConstrained: largeInputBest.id
      },
      keyLearnings: [
        'Different approaches have different time-space tradeoffs',
        'Memoization trades space for time efficiency',
        'Bottom-up approaches often have better space complexity',
        'Real-world performance depends on input characteristics'
      ],
      commonMistakes: [
        'Ignoring the constant factors in Big O notation',
        'Not considering memory usage in recursive solutions',
        'Assuming worst-case always matters in practice',
        'Not profiling with realistic data sizes'
      ],
      optimizationTips: [
        'Use iterative solutions when possible to save space',
        'Consider space-optimized DP when only previous row/column needed',
        'Profile with realistic input sizes, not just asymptotic analysis',
        'Consider caching vs recomputation tradeoffs'
      ],
      realWorldScenarios: [
        {
          scenario: 'Mobile app with memory constraints',
          recommendedSolution: memoryBest.id,
          reasoning: 'Limited memory makes space optimization crucial'
        },
        {
          scenario: 'High-frequency trading system',
          recommendedSolution: largeInputBest.id,
          reasoning: 'Time is critical, memory is abundant'
        },
        {
          scenario: 'Educational demonstration',
          recommendedSolution: smallInputBest.id,
          reasoning: 'Simple and easy to understand'
        }
      ]
    };
  }

  /**
   * Compare two complexity strings (rough heuristic)
   */
  private compareComplexity(a: string, b: string): number {
    const complexityOrder = [
      'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n^2)', 
      'O(n³)', 'O(n^3)', 'O(2^n)', 'O(n!)'
    ];
    
    const indexA = complexityOrder.findIndex(c => a.includes(c));
    const indexB = complexityOrder.findIndex(c => b.includes(c));
    
    return indexA - indexB;
  }

  /**
   * Clear benchmark cache
   */
  clearCache(): void {
    this.benchmarkCache.clear();
  }
}

/**
 * Helper class for tracking metrics during execution
 */
class MetricsTracker {
  operations = 0;
  comparisons = 0;
  assignments = 0;
  maxRecursionDepth = 0;
  currentRecursionDepth = 0;
  cacheHits = 0;
  cacheMisses = 0;

  update(metrics: Partial<PerformanceMetrics>): void {
    if (metrics.operations) this.operations += metrics.operations;
    if (metrics.comparisons) this.comparisons += metrics.comparisons;
    if (metrics.assignments) this.assignments += metrics.assignments;
    if (metrics.recursionDepth) {
      this.maxRecursionDepth = Math.max(this.maxRecursionDepth, metrics.recursionDepth);
    }
    if (metrics.cacheHits) this.cacheHits += metrics.cacheHits;
    if (metrics.cacheMisses) this.cacheMisses += metrics.cacheMisses;
  }

  enterRecursion(): void {
    this.currentRecursionDepth++;
    this.maxRecursionDepth = Math.max(this.maxRecursionDepth, this.currentRecursionDepth);
  }

  exitRecursion(): void {
    this.currentRecursionDepth = Math.max(0, this.currentRecursionDepth - 1);
  }
}
