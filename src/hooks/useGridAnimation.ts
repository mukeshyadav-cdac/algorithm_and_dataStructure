import { useCallback, useRef } from 'react';
import { Algorithm, Cell } from '../types';
import { AlgorithmService } from '../services/AlgorithmService';
import { AnimationController } from '../utils';

/**
 * Custom hook for managing grid animation
 * Implements Command pattern for animation control
 */
export const useGridAnimation = () => {
  const algorithmService = new AlgorithmService();
  const animationController = useRef(new AnimationController());

  /**
   * Initializes grid for visualization
   */
  const initializeGrid = useCallback((
    algorithm: Algorithm,
    rows: number,
    cols: number,
    params: any = {}
  ): Cell[][] => {
    return algorithmService.initializeGrid(algorithm, rows, cols, params);
  }, [algorithmService]);

  /**
   * Starts algorithm animation
   */
  const startAnimation = useCallback(async (
    algorithm: Algorithm,
    grid: Cell[][],
    setGrid: (grid: Cell[][]) => void,
    params: any,
    animationSpeed: number,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ) => {
    try {
      animationController.current.start();
      
      // Reset grid to initial state
      const initialGrid = algorithmService.initializeGrid(
        algorithm, 
        grid.length, 
        grid[0]?.length || 0, 
        params
      );
      setGrid(initialGrid);

      // Run animation
      await algorithmService.animateAlgorithm(
        algorithm,
        initialGrid,
        setGrid,
        params,
        animationSpeed
      );

      if (animationController.current.shouldContinue()) {
        onComplete?.();
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      animationController.current.stop();
    }
  }, [algorithmService]);

  /**
   * Pauses current animation
   */
  const pauseAnimation = useCallback(() => {
    animationController.current.pause();
  }, []);

  /**
   * Resumes paused animation
   */
  const resumeAnimation = useCallback(() => {
    animationController.current.resume();
  }, []);

  /**
   * Stops current animation
   */
  const stopAnimation = useCallback(() => {
    animationController.current.stop();
  }, []);

  /**
   * Resets animation controller
   */
  const resetAnimation = useCallback(() => {
    animationController.current.reset();
  }, []);

  /**
   * Gets animation status
   */
  const getAnimationStatus = useCallback(() => {
    return animationController.current.status;
  }, []);

  /**
   * Checks if animation should continue
   */
  const shouldContinueAnimation = useCallback(() => {
    return animationController.current.shouldContinue();
  }, []);

  /**
   * Waits if animation is paused
   */
  const waitIfPaused = useCallback(async () => {
    await animationController.current.waitIfPaused();
  }, []);

  /**
   * Steps through animation frame by frame (for debugging)
   */
  const stepAnimation = useCallback(async (
    algorithm: Algorithm,
    grid: Cell[][],
    setGrid: (grid: Cell[][]) => void,
    params: any,
    step: number = 1
  ) => {
    // Implementation for step-by-step animation
    // This would require modifying the algorithm animate functions
    // to support step-wise execution
    console.log('Step animation not yet implemented', { algorithm, grid, params, step });
  }, []);

  /**
   * Estimates animation duration
   */
  const estimateAnimationDuration = useCallback((
    algorithm: Algorithm,
    params: any,
    animationSpeed: number
  ) => {
    const estimation = algorithmService.estimateExecutionTime(algorithm, params);
    const animationFactor = animationSpeed / 100; // Rough estimation factor
    
    return {
      estimatedMs: estimation.estimatedMs * animationFactor,
      steps: estimation.inputSize,
      complexity: estimation.complexity
    };
  }, [algorithmService]);

  /**
   * Validates animation parameters
   */
  const validateAnimationParams = useCallback((
    algorithm: Algorithm,
    grid: Cell[][],
    params: any
  ) => {
    const validation = algorithmService.validateParameters(algorithm, params);
    const gridValid = grid.length > 0 && grid[0].length > 0;
    
    return {
      isValid: validation.isValid && gridValid,
      errors: [
        ...validation.errors,
        ...(gridValid ? [] : ['Grid must have valid dimensions'])
      ],
      correctedParams: validation.correctedParams
    };
  }, [algorithmService]);

  /**
   * Creates animation configuration object
   */
  const createAnimationConfig = useCallback((
    speed: number,
    autoStart: boolean = false,
    loop: boolean = false
  ) => ({
    speed: Math.max(50, Math.min(2000, speed)),
    autoStart,
    loop,
    pauseOnError: true,
    showProgress: true
  }), []);

  return {
    // Core animation functions
    initializeGrid,
    startAnimation,
    pauseAnimation,
    resumeAnimation,
    stopAnimation,
    resetAnimation,
    stepAnimation,

    // Status and validation
    getAnimationStatus,
    shouldContinueAnimation,
    waitIfPaused,
    validateAnimationParams,
    estimateAnimationDuration,

    // Utilities
    createAnimationConfig
  };
};
