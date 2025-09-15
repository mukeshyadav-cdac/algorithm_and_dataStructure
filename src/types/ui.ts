import { AnimationState } from './core';

/**
 * Theme configuration
 * ISP: Dedicated to theming
 */
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
}

/**
 * Grid visualization configuration
 * ISP: Grid-specific settings
 */
export interface GridConfig {
  cellSize: number;
  gap: number;
  showLabels: boolean;
  showGrid: boolean;
  colorScheme: 'default' | 'colorblind' | 'high_contrast';
  borderRadius: number;
}

/**
 * Modal state management
 * ISP: Focused on modal interactions
 */
export interface ModalState {
  isOpen: boolean;
  title: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
}

/**
 * Notification message
 * ISP: Single notification definition
 */
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

/**
 * Loading states for different components
 * ISP: Loading state management
 */
export interface LoadingState {
  algorithms: boolean;
  visualization: boolean;
  codeExecution: boolean;
  tests: boolean;
}

/**
 * User preferences
 * ISP: User configuration management
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  animationSpeed: number;
  gridConfig: GridConfig;
  defaultLanguage: string;
  showHints: boolean;
  autoRunTests: boolean;
}

/**
 * Application state
 * Template Method Pattern: Defines overall app state structure
 */
export interface AppState {
  animation: AnimationState;
  loading: LoadingState;
  notifications: Notification[];
  modal: ModalState | null;
  preferences: UserPreferences;
  selectedAlgorithm: string | null;
  selectedLanguage: string;
}
