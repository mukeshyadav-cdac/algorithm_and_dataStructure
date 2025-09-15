import { useCallback, useEffect } from 'react';
import { Algorithm } from '../types';
import { useAlgorithmState } from './useAlgorithmState';
import { useGridAnimation } from './useGridAnimation';
import { useTestRunner } from './useTestRunner';
import { formatCellValue, getCellColorClass } from '../utils';

/**
 * Main custom hook that orchestrates all algorithm visualization functionality
 * Implements Facade pattern to provide a simple interface to complex subsystems
 */
export const useAlgorithmVisualizer = (algorithms: Algorithm[]) => {
  // Combine all state management hooks
  const algorithmState = useAlgorithmState(algorithms);
  const gridAnimation = useGridAnimation();
  const testRunner = useTestRunner();

  const {
    selectedAlgorithm,
    selectedLanguage,
    currentAlgorithm,
    currentLanguage,
    algorithmParams,
    rows,
    cols,
    grid,
    isAnimating,
    animationSpeed,
    setGrid,
    setIsAnimating,
    setTestResults,
    setIsRunningTests,
    setShowTests
  } = algorithmState;

  /**
   * Initialize grid when algorithm or parameters change
   */
  const initializeVisualization = useCallback(() => {
    if (currentAlgorithm) {
      const params = { ...currentAlgorithm.defaultParams, ...algorithmParams, rows, cols };
      const newGrid = gridAnimation.initializeGrid(currentAlgorithm, rows, cols, params);
      setGrid(newGrid);
    }
  }, [currentAlgorithm, algorithmParams, rows, cols, gridAnimation, setGrid]);

  /**
   * Start algorithm animation
   */
  const startVisualization = useCallback(async () => {
    if (!currentAlgorithm || isAnimating) return;

    setIsAnimating(true);

    try {
      const params = { ...currentAlgorithm.defaultParams, ...algorithmParams, rows, cols };
      
      await gridAnimation.startAnimation(
        currentAlgorithm,
        grid,
        setGrid,
        params,
        animationSpeed,
        () => {
          // Animation completed successfully
          console.log('Animation completed');
        },
        (error) => {
          // Animation failed
          console.error('Animation failed:', error);
        }
      );
    } finally {
      setIsAnimating(false);
    }
  }, [
    currentAlgorithm,
    isAnimating,
    algorithmParams,
    rows,
    cols,
    grid,
    animationSpeed,
    gridAnimation,
    setGrid,
    setIsAnimating
  ]);

  /**
   * Stop current animation
   */
  const stopVisualization = useCallback(() => {
    gridAnimation.stopAnimation();
    setIsAnimating(false);
  }, [gridAnimation, setIsAnimating]);

  /**
   * Reset visualization to initial state
   */
  const resetVisualization = useCallback(() => {
    stopVisualization();
    initializeVisualization();
  }, [stopVisualization, initializeVisualization]);

  /**
   * Run tests for current algorithm and language
   */
  const runAlgorithmTests = useCallback(async () => {
    if (!currentAlgorithm || !currentLanguage || testRunner.isRunning) return;

    setIsRunningTests(true);

    await testRunner.runTests(
      currentAlgorithm,
      currentLanguage,
      algorithmState.customCode,
      (current, total) => {
        // Progress callback
        console.log(`Test progress: ${current}/${total}`);
      },
      (results) => {
        // Completion callback
        setTestResults(results);
        setShowTests(true);
      },
      (error) => {
        // Error callback
        console.error('Test execution failed:', error);
      }
    );

    setIsRunningTests(false);
  }, [
    currentAlgorithm,
    currentLanguage,
    algorithmState.customCode,
    testRunner,
    setIsRunningTests,
    setTestResults,
    setShowTests
  ]);

  /**
   * Format cell value for display
   */
  const formatCellValueForDisplay = useCallback((value: number | string) => {
    return formatCellValue(value);
  }, []);

  /**
   * Get cell color class
   */
  const getCellColor = useCallback((cell: any) => {
    return getCellColorClass(cell);
  }, []);

  /**
   * Validate current state
   */
  const validateCurrentState = useCallback(() => {
    const stateValidation = algorithmState.validateState();
    const animationValidation = gridAnimation.validateAnimationParams(
      currentAlgorithm!,
      grid,
      algorithmParams
    );

    return {
      isValid: stateValidation.isValid && animationValidation.isValid,
      errors: [...stateValidation.errors, ...animationValidation.errors]
    };
  }, [algorithmState, gridAnimation, currentAlgorithm, grid, algorithmParams]);

  /**
   * Get visualization statistics
   */
  const getVisualizationStats = useCallback(() => {
    const testStats = testRunner.getTestStats();
    const animationEstimate = currentAlgorithm
      ? gridAnimation.estimateAnimationDuration(currentAlgorithm, algorithmParams, animationSpeed)
      : null;

    return {
      algorithm: {
        name: currentAlgorithm?.name || 'Unknown',
        complexity: currentAlgorithm?.complexity || { time: 'Unknown', space: 'Unknown' }
      },
      grid: {
        dimensions: `${rows} × ${cols}`,
        totalCells: rows * cols
      },
      animation: {
        speed: animationSpeed,
        isRunning: isAnimating,
        estimatedDuration: animationEstimate?.estimatedMs || 0
      },
      tests: testStats
    };
  }, [
    testRunner,
    currentAlgorithm,
    algorithmParams,
    animationSpeed,
    rows,
    cols,
    isAnimating,
    gridAnimation
  ]);

  /**
   * Initialize visualization when algorithm changes
   */
  useEffect(() => {
    initializeVisualization();
  }, [initializeVisualization]);

  /**
   * Update custom code when language changes
   */
  useEffect(() => {
    if (currentLanguage) {
      algorithmState.setCustomCode(currentLanguage.code);
    }
  }, [currentLanguage, algorithmState.setCustomCode]);

  // Return complete interface
  return {
    // State from useAlgorithmState
    ...algorithmState,

    // Animation functions
    startVisualization,
    stopVisualization,
    resetVisualization,
    initializeVisualization,

    // Test functions
    runAlgorithmTests,
    testRunner,

    // Utility functions
    formatCellValueForDisplay,
    getCellColor,
    validateCurrentState,
    getVisualizationStats,

    // Animation status
    animationController: gridAnimation
  };
};
