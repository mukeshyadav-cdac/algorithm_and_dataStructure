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
 * SRP: Only handles animation easing calculations
 */
export const easing = {
  linear: (t: number): number => t,
  easeIn: (t: number): number => t * t,
  easeOut: (t: number): number => t * (2 - t),
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};

/**
 * Animation speed calculator
 * SRP: Only converts speed settings to milliseconds
 */
export const calculateAnimationDelay = (speed: number): number => {
  // Convert speed (1-10) to delay (1000-100ms)
  return Math.max(100, 1100 - speed * 100);
};

/**
 * Frame-based animation controller
 * SRP: Only manages animation frames and timing
 */
export class AnimationController {
  private animationId: number | null = null;
  private startTime: number = 0;
  private pausedTime: number = 0;
  private isPaused: boolean = false;

  start(callback: (progress: number) => void, duration: number): void {
    this.startTime = Date.now();
    this.pausedTime = 0;
    this.isPaused = false;
    
    const animate = () => {
      if (!this.isPaused) {
        const elapsed = Date.now() - this.startTime - this.pausedTime;
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
    if (!this.isPaused) {
      this.isPaused = true;
      this.pausedTime = Date.now() - this.startTime;
    }
  }

  resume(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.startTime = Date.now() - this.pausedTime;
    }
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

  isPausedState(): boolean {
    return this.isPaused;
  }
}

/**
 * CSS animation utility
 * SRP: Only handles CSS animation class management
 */
export const cssAnimations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  pulse: 'animate-pulse-slow',
  
  apply: (element: HTMLElement, animation: string, duration?: number): Promise<void> => {
    return new Promise((resolve) => {
      const animationClass = animation;
      element.classList.add(animationClass);
      
      const handleAnimationEnd = () => {
        element.classList.remove(animationClass);
        element.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      };
      
      element.addEventListener('animationend', handleAnimationEnd);
      
      // Fallback timeout
      if (duration) {
        setTimeout(() => {
          if (element.classList.contains(animationClass)) {
            element.classList.remove(animationClass);
            resolve();
          }
        }, duration);
      }
    });
  },
};
