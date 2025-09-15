import { AnimationState } from './core';

/**
 * UI Theme configuration
 * ISP: Dedicated to theming concerns
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
  animation: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: string;
  };
}

/**
 * Modal/Dialog state management
 * ISP: Focused on dialog interactions
 */
export interface DialogState {
  isOpen: boolean;
  title: string;
  content?: React.ReactNode;
  actions?: Array<{
    label: string;
    action: () => void;
    variant: 'primary' | 'secondary' | 'danger';
  }>;
}

/**
 * Notification/Toast message
 * ISP: Single responsibility for notifications
 */
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

/**
 * Grid visualization configuration
 * ISP: Grid-specific UI settings
 */
export interface GridVisualizationConfig {
  cellSize: number;
  gap: number;
  showLabels: boolean;
  showGrid: boolean;
  colorScheme: 'default' | 'colorblind' | 'high_contrast';
  animationSpeed: number;
}

/**
 * Code editor configuration
 * ISP: Editor-specific settings
 */
export interface CodeEditorConfig {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  showLineNumbers: boolean;
  wordWrap: boolean;
  language: string;
  readOnly: boolean;
}

/**
 * Navigation state
 * ISP: Navigation-specific state
 */
export interface NavigationState {
  currentPath: string;
  breadcrumbs: Array<{
    label: string;
    path: string;
  }>;
  sidebarOpen: boolean;
  activeSection: string;
}

/**
 * Loading states for different UI components
 * ISP: Loading state management
 */
export interface LoadingState {
  algorithms: boolean;
  solutions: boolean;
  benchmarks: boolean;
  codeExecution: boolean;
  visualization: boolean;
}

/**
 * User preferences and settings
 * ISP: User configuration management
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  animationSpeed: number;
  defaultLanguage: string;
  showTooltips: boolean;
  autoRunTests: boolean;
  gridConfig: GridVisualizationConfig;
  editorConfig: CodeEditorConfig;
  notifications: {
    enabled: boolean;
    types: ('info' | 'success' | 'warning' | 'error')[];
  };
}

/**
 * Application state interface
 * Template Method Pattern: Defines overall app state structure
 */
export interface AppState {
  navigation: NavigationState;
  animation: AnimationState;
  loading: LoadingState;
  notifications: Notification[];
  dialog: DialogState | null;
  preferences: UserPreferences;
  session: {
    startTime: Date;
    algorithmsViewed: string[];
    solutionsCompared: string[];
    totalInteractions: number;
  };
}
