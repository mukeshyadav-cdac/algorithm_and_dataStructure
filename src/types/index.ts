// Type definitions barrel export
// Following Barrel Pattern for clean imports

// Core types
export type {
  Cell,
  PathCell,
  TestCase,
  TestResult,
  AnimationState,
  ParameterControl,
  AlgorithmContext,
} from './core';

// Algorithm types
export type {
  VisualizationStrategy,
  ExecutionStrategy,
  EducationalContent,
  Algorithm,
  AlgorithmCategory,
  AlgorithmFactory,
  AlgorithmConfig,
  VisualizationType,
  PerformanceMetrics,
  ExecutionStep,
} from './algorithm';

// UI types
export type {
  Theme,
  GridConfig,
  ModalState,
  Notification,
  LoadingState,
  UserPreferences,
  AppState,
} from './ui';
