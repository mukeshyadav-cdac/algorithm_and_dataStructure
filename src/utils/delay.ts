/**
 * Animation utilities for algorithm visualization
 */

/**
 * Simple delay function for animation timing
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Sleep function (alias for delay)
 */
export const sleep = delay;
