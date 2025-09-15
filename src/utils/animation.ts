// Animation utilities following Single Responsibility Principle (SRP)

/**
 * Sleep utility for animation delays
 * SRP: Only responsible for creating delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Easing functions for smooth animations
 * SRP: Only handles easing calculations
 */
export const easing = {
  linear: (t: number): number => t,
  easeIn: (t: number): number => t * t,
  easeOut: (t: number): number => t * (2 - t),
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
};

/**
 * Animation speed calculator
 * SRP: Only converts speed to delay
 */
export const calculateDelay = (speed: number): number => {
  // Convert speed (1-10) to delay (1000-100ms)
  return Math.max(100, 1100 - speed * 100);
};

/**
 * Frame-based animation controller
 * SRP: Only manages animation frames
 */
export class AnimationController {
  private animationId: number | null = null;
  private startTime: number = 0;
  private isPaused: boolean = false;

  start(callback: (progress: number) => void, duration: number): void {
    this.startTime = Date.now();
    this.isPaused = false;
    
    const animate = () => {
      if (!this.isPaused) {
        const elapsed = Date.now() - this.startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        callback(progress);
        
        if (progress < 1) {
          this.animationId = requestAnimationFrame(animate);
        } else {
          this.stop();
        }
      } else {
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isPaused = false;
  }

  isRunning(): boolean {
    return this.animationId !== null;
  }
}
