// Animation utility functions

/**
 * Creates a delay for animation timing
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the specified time
 */
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculates animation speed based on user preference
 * @param baseSpeed - Base animation speed in milliseconds
 * @param speedMultiplier - Speed multiplier (1 = normal, 0.5 = half speed, 2 = double speed)
 * @returns Adjusted animation speed
 */
export const calculateAnimationSpeed = (baseSpeed: number, speedMultiplier: number = 1): number => {
  return Math.max(50, baseSpeed / speedMultiplier); // Minimum 50ms
};

/**
 * Validates animation speed range
 * @param speed - Speed to validate
 * @returns Valid speed within acceptable range
 */
export const validateAnimationSpeed = (speed: number): number => {
  const MIN_SPEED = 50;
  const MAX_SPEED = 2000;
  return Math.max(MIN_SPEED, Math.min(MAX_SPEED, speed));
};

/**
 * Animation state management
 */
export class AnimationController {
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private cancelToken: boolean = false;

  start(): void {
    this.isRunning = true;
    this.isPaused = false;
    this.cancelToken = false;
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  stop(): void {
    this.isRunning = false;
    this.isPaused = false;
    this.cancelToken = true;
  }

  reset(): void {
    this.stop();
  }

  get status() {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      isCancelled: this.cancelToken
    };
  }

  shouldContinue(): boolean {
    return this.isRunning && !this.cancelToken;
  }

  async waitIfPaused(): Promise<void> {
    while (this.isPaused && this.shouldContinue()) {
      await sleep(100);
    }
  }
}
