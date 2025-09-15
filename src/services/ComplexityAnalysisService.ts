import { 
  BenchmarkConfig, 
  BenchmarkResult, 
  SolutionComparison, 
  ComplexityVisualizationData,
  PerformanceMetrics,
  AlgorithmSolution,
} from '@/types';
import { sleep } from '@/utils';

/**
 * Complexity Analysis Service
 * Single Responsibility: Only handles algorithm performance analysis and benchmarking
 * Singleton Pattern: Single instance manages all complexity analysis
 */
export class ComplexityAnalysisService {
  private static instance: ComplexityAnalysisService;
  private benchmarkHistory: Map<string, BenchmarkResult[]> = new Map();
  private readonly colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];

  private constructor() {}

  /**
   * Singleton instance getter
   * Singleton Pattern: Ensures single instance
   */
  static getInstance(): ComplexityAnalysisService {
    if (!this.instance) {
      this.instance = new ComplexityAnalysisService();
    }
    return this.instance;
  }

  /**
   * Run benchmarks for a solution across different input sizes
   * SRP: Only handles benchmark execution
   */
  async runBenchmark(
    solution: AlgorithmSolution,
    testData: Record<string, unknown>[],
    config: BenchmarkConfig
  ): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];
    
    for (const data of testData) {
      const inputSize = this.calculateInputSize(data);
      
      // Warmup runs
      for (let i = 0; i < config.warmupRuns; i++) {
        await this.runSingleBenchmark(solution, data, config.timeout);
      }
      
      // Actual benchmark runs
      const iterationResults: PerformanceMetrics[] = [];
      
      for (let i = 0; i < config.iterations; i++) {
        try {
          const metrics = await this.runSingleBenchmark(solution, data, config.timeout);
          iterationResults.push(metrics);
        } catch (error) {
          console.warn(`Benchmark iteration ${i + 1} failed:`, error);
        }
      }
      
      if (iterationResults.length > 0) {
        const avgMetrics = this.calculateAverageMetrics(iterationResults);
        
        const result: BenchmarkResult = {
          solutionId: solution.id,
          inputSize,
          metrics: avgMetrics,
          timestamp: Date.now(),
          iterations: iterationResults.length,
        };
        
        results.push(result);
      }
    }
    
    // Store in history
    const key = solution.id;
    if (!this.benchmarkHistory.has(key)) {
      this.benchmarkHistory.set(key, []);
    }
    this.benchmarkHistory.get(key)!.push(...results);
    
    return results;
  }

  /**
   * Compare multiple solutions with comprehensive analysis
   * SRP: Only handles solution comparison logic
   */
  async compareSolutions(
    algorithmName: string,
    solutions: AlgorithmSolution[],
    testData: Record<string, unknown>[],
    config: BenchmarkConfig
  ): Promise<SolutionComparison> {
    const benchmarkResults: BenchmarkResult[] = [];
    
    // Run benchmarks for all solutions
    for (const solution of solutions) {
      const results = await this.runBenchmark(solution, testData, config);
      benchmarkResults.push(...results);
    }
    
    // Analyze results
    const recommendations = this.generateRecommendations(solutions, benchmarkResults);
    const analysis = this.performDetailedAnalysis(solutions, benchmarkResults);
    
    return {
      algorithm: algorithmName,
      solutions,
      benchmarkResults,
      recommendations,
      analysis,
    };
  }

  /**
   * Create visualization data for complexity charts
   * SRP: Only handles data transformation for visualization
   */
  createVisualizationData(
    benchmarkResults: BenchmarkResult[],
    metricType: 'time' | 'space' | 'operations' = 'time'
  ): ComplexityVisualizationData {
    // Group results by solution
    const solutionGroups = new Map<string, BenchmarkResult[]>();
    benchmarkResults.forEach(result => {
      if (!solutionGroups.has(result.solutionId)) {
        solutionGroups.set(result.solutionId, []);
      }
      solutionGroups.get(result.solutionId)!.push(result);
    });
    
    // Extract input sizes (sorted)
    const inputSizes = Array.from(
      new Set(benchmarkResults.map(r => r.inputSize))
    ).sort((a, b) => a - b);
    
    // Create datasets for each solution
    const datasets = Array.from(solutionGroups.entries()).map(([solutionId, results], index) => {
      const data = inputSizes.map(size => {
        const result = results.find(r => r.inputSize === size);
        if (!result) return 0;
        
        switch (metricType) {
          case 'time':
            return result.metrics.executionTime;
          case 'space':
            return result.metrics.memoryUsed;
          case 'operations':
            return result.metrics.operations;
          default:
            return result.metrics.executionTime;
        }
      });
      
      return {
        label: solutionId.replace(/^\w+-/, '').replace(/([A-Z])/g, ' $1').trim(),
        solutionId,
        data,
        color: this.colors[index % this.colors.length],
        approach: this.extractApproachFromId(solutionId),
      };
    });
    
    return {
      inputSizes,
      datasets,
      metrics: {
        type: metricType,
        unit: this.getMetricUnit(metricType),
        scale: this.shouldUseLogScale(benchmarkResults, metricType) ? 'logarithmic' : 'linear',
      },
    };
  }

  /**
   * Get benchmark history for a solution
   * SRP: Only handles history retrieval
   */
  getBenchmarkHistory(solutionId: string): BenchmarkResult[] {
    return this.benchmarkHistory.get(solutionId) || [];
  }

  /**
   * Clear benchmark history
   * SRP: Only handles history management
   */
  clearBenchmarkHistory(solutionId?: string): void {
    if (solutionId) {
      this.benchmarkHistory.delete(solutionId);
    } else {
      this.benchmarkHistory.clear();
    }
  }

  /**
   * Run a single benchmark iteration
   * SRP: Only handles single benchmark execution
   */
  private async runSingleBenchmark(
    solution: AlgorithmSolution,
    testData: Record<string, unknown>,
    timeout: number
  ): Promise<PerformanceMetrics> {
    const mockGrid = [[{ value: 0, visited: false, highlighted: false }]];
    let operationCount = 0;
    let memoryUsage = 0;
    
    const mockUpdateGrid = (_grid: unknown) => {
      operationCount++;
      memoryUsage += 32; // Rough estimate per grid update
    };
    
    const mockSetStep = (_step: number) => {
      operationCount++;
    };
    
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Benchmark timed out after ${timeout}ms`));
      }, timeout);
      
      solution.visualizer(
        testData,
        mockUpdateGrid,
        mockSetStep,
        (metrics) => {
          clearTimeout(timeoutId);
          resolve(metrics);
        }
      ).catch(error => {
        clearTimeout(timeoutId);
        
        // Fallback metrics if visualizer fails
        const endTime = performance.now();
        const fallbackMetrics: PerformanceMetrics = {
          executionTime: endTime - startTime,
          operations: operationCount,
          memoryUsed: memoryUsage,
          comparisons: Math.floor(operationCount * 0.7), // Estimate
        };
        
        resolve(fallbackMetrics);
      });
    });
  }

  /**
   * Calculate input size from test data
   * SRP: Only handles input size calculation
   */
  private calculateInputSize(data: Record<string, unknown>): number {
    // Common patterns for input size calculation
    if ('m' in data && 'n' in data) {
      return (data.m as number) * (data.n as number);
    }
    
    if ('amount' in data) {
      return data.amount as number;
    }
    
    if ('n' in data) {
      return data.n as number;
    }
    
    if ('nums' in data && Array.isArray(data.nums)) {
      return data.nums.length;
    }
    
    if ('sequence' in data && Array.isArray(data.sequence)) {
      return data.sequence.length;
    }
    
    if ('weights' in data && Array.isArray(data.weights)) {
      return data.weights.length;
    }
    
    // Default size estimation
    return Object.keys(data).length;
  }

  /**
   * Calculate average metrics across iterations
   * SRP: Only handles metric averaging
   */
  private calculateAverageMetrics(metrics: PerformanceMetrics[]): PerformanceMetrics {
    if (metrics.length === 0) {
      return {
        executionTime: 0,
        operations: 0,
        memoryUsed: 0,
        comparisons: 0,
      };
    }
    
    const totals = metrics.reduce(
      (acc, metric) => ({
        executionTime: acc.executionTime + metric.executionTime,
        operations: acc.operations + metric.operations,
        memoryUsed: acc.memoryUsed + metric.memoryUsed,
        comparisons: acc.comparisons + metric.comparisons,
      }),
      { executionTime: 0, operations: 0, memoryUsed: 0, comparisons: 0 }
    );
    
    const count = metrics.length;
    
    return {
      executionTime: totals.executionTime / count,
      operations: totals.operations / count,
      memoryUsed: totals.memoryUsed / count,
      comparisons: totals.comparisons / count,
    };
  }

  /**
   * Generate recommendations based on benchmark results
   * SRP: Only handles recommendation generation
   */
  private generateRecommendations(
    solutions: AlgorithmSolution[],
    results: BenchmarkResult[]
  ): SolutionComparison['recommendations'] {
    const solutionPerformance = new Map<string, {
      avgTime: number;
      avgSmallInput: number;
      avgLargeInput: number;
      educational: number;
    }>();
    
    // Calculate performance metrics
    solutions.forEach(solution => {
      const solutionResults = results.filter(r => r.solutionId === solution.id);
      if (solutionResults.length === 0) return;
      
      const avgTime = solutionResults.reduce((sum, r) => sum + r.metrics.executionTime, 0) / solutionResults.length;
      const smallInputResults = solutionResults.filter(r => r.inputSize <= 10);
      const largeInputResults = solutionResults.filter(r => r.inputSize > 10);
      
      const avgSmallInput = smallInputResults.length > 0 
        ? smallInputResults.reduce((sum, r) => sum + r.metrics.executionTime, 0) / smallInputResults.length 
        : avgTime;
      
      const avgLargeInput = largeInputResults.length > 0
        ? largeInputResults.reduce((sum, r) => sum + r.metrics.executionTime, 0) / largeInputResults.length
        : avgTime;
      
      // Educational score based on approach
      const educationalScore = this.calculateEducationalScore(solution.approach);
      
      solutionPerformance.set(solution.id, {
        avgTime,
        avgSmallInput,
        avgLargeInput,
        educational: educationalScore,
      });
    });
    
    // Find best solutions
    const bestOverall = this.findBestSolution(solutionPerformance, 'avgTime');
    const bestForSmallInput = this.findBestSolution(solutionPerformance, 'avgSmallInput');
    const bestForLargeInput = this.findBestSolution(solutionPerformance, 'avgLargeInput');
    const mostEducational = this.findBestSolution(solutionPerformance, 'educational');
    
    return {
      bestOverall,
      bestForSmallInput,
      bestForLargeInput,
      mostEducational,
    };
  }

  /**
   * Perform detailed analysis of solutions
   * SRP: Only handles detailed analysis generation
   */
  private performDetailedAnalysis(
    solutions: AlgorithmSolution[],
    results: BenchmarkResult[]
  ): SolutionComparison['analysis'] {
    const summary = this.generateAnalysisSummary(solutions, results);
    const tradeoffs = this.identifyTradeoffs(solutions, results);
    const useCases = this.generateUseCases(solutions, results);
    
    return {
      summary,
      tradeoffs,
      useCases,
    };
  }

  /**
   * Generate analysis summary
   * SRP: Only handles summary generation
   */
  private generateAnalysisSummary(solutions: AlgorithmSolution[], results: BenchmarkResult[]): string {
    const approachCounts = new Map<string, number>();
    solutions.forEach(solution => {
      approachCounts.set(solution.approach, (approachCounts.get(solution.approach) || 0) + 1);
    });
    
    const approaches = Array.from(approachCounts.keys()).join(', ');
    const totalBenchmarks = results.length;
    
    return `Analysis of ${solutions.length} solutions using ${approaches} approaches across ${totalBenchmarks} benchmark runs.`;
  }

  /**
   * Identify tradeoffs between solutions
   * SRP: Only handles tradeoff identification
   */
  private identifyTradeoffs(solutions: AlgorithmSolution[], _results: BenchmarkResult[]): string[] {
    const tradeoffs = new Set<string>();
    
    // Common tradeoffs based on approaches
    const hasRecursive = solutions.some(s => s.approach === 'recursive');
    const hasMemoization = solutions.some(s => s.approach === 'memoization');
    const hasTabulation = solutions.some(s => s.approach === 'tabulation');
    const hasSpaceOptimized = solutions.some(s => s.approach === 'space_optimized');
    
    if (hasRecursive && (hasMemoization || hasTabulation)) {
      tradeoffs.add('Recursive solutions are simpler to understand but have exponential time complexity');
    }
    
    if (hasMemoization && hasTabulation) {
      tradeoffs.add('Memoization uses recursion stack space while tabulation is iterative');
    }
    
    if (hasSpaceOptimized && hasTabulation) {
      tradeoffs.add('Space optimization reduces memory usage but may increase code complexity');
    }
    
    return Array.from(tradeoffs);
  }

  /**
   * Generate use cases for different solutions
   * SRP: Only handles use case generation
   */
  private generateUseCases(solutions: AlgorithmSolution[], _results: BenchmarkResult[]): SolutionComparison['analysis']['useCases'] {
    const useCases = [];
    
    solutions.forEach(solution => {
      switch (solution.approach) {
        case 'recursive':
          useCases.push({
            scenario: 'Educational purposes and understanding problem structure',
            recommendedSolution: solution.id,
            reasoning: 'Recursive solution clearly shows the problem breakdown and base cases',
          });
          break;
        case 'memoization':
          useCases.push({
            scenario: 'When recursion depth is manageable and you want to maintain recursive structure',
            recommendedSolution: solution.id,
            reasoning: 'Memoization preserves intuitive recursive thinking while improving performance',
          });
          break;
        case 'tabulation':
          useCases.push({
            scenario: 'Production systems with large inputs requiring optimal performance',
            recommendedSolution: solution.id,
            reasoning: 'Tabulation avoids recursion stack overflow and provides consistent performance',
          });
          break;
        case 'space_optimized':
          useCases.push({
            scenario: 'Memory-constrained environments or very large problem sizes',
            recommendedSolution: solution.id,
            reasoning: 'Space optimization minimizes memory footprint while maintaining optimal time complexity',
          });
          break;
      }
    });
    
    return useCases;
  }

  /**
   * Helper methods for analysis calculations
   */
  private calculateEducationalScore(approach: string): number {
    const scores: Record<string, number> = {
      recursive: 90,
      memoization: 80,
      tabulation: 70,
      space_optimized: 60,
      greedy: 85,
      divide_conquer: 85,
    };
    return scores[approach] || 50;
  }

  private findBestSolution(
    performance: Map<string, Record<string, number>>,
    metric: string
  ): string {
    let bestSolution = '';
    let bestValue = metric === 'educational' ? 0 : Infinity;
    
    performance.forEach((metrics, solutionId) => {
      const value = metrics[metric];
      if (metric === 'educational' ? value > bestValue : value < bestValue) {
        bestValue = value;
        bestSolution = solutionId;
      }
    });
    
    return bestSolution;
  }

  private extractApproachFromId(solutionId: string): string {
    const parts = solutionId.split('-');
    return parts[parts.length - 1] || 'unknown';
  }

  private getMetricUnit(metricType: 'time' | 'space' | 'operations'): string {
    switch (metricType) {
      case 'time': return 'ms';
      case 'space': return 'bytes';
      case 'operations': return 'ops';
      default: return '';
    }
  }

  private shouldUseLogScale(results: BenchmarkResult[], metricType: 'time' | 'space' | 'operations'): boolean {
    const values = results.map(r => {
      switch (metricType) {
        case 'time': return r.metrics.executionTime;
        case 'space': return r.metrics.memoryUsed;
        case 'operations': return r.metrics.operations;
        default: return r.metrics.executionTime;
      }
    });
    
    const max = Math.max(...values);
    const min = Math.min(...values.filter(v => v > 0));
    
    return max / min > 100; // Use log scale if range spans more than 2 orders of magnitude
  }
}
