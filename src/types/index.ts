// Central export point for all types
// Following Barrel Pattern for clean imports

// Core types
export type {
  Cell,
  PathCell,
  TestCase,
  TestResult,
  AnimationState,
  PerformanceMetrics,
  ParameterControl,
} from './core';

// Algorithm types
export type {
  LanguageRuntime,
  AlgorithmComplexity,
  SolutionApproach,
  AlgorithmSolution,
  Algorithm,
  AlgorithmCategory,
} from './algorithm';

// Analysis types
export type {
  BenchmarkConfig,
  BenchmarkResult,
  SolutionComparison,
  ComplexityVisualizationData,
  LearningProgress,
  AnalysisSession,
} from './analysis';

// UI types
export type {
  Theme,
  DialogState,
  Notification,
  GridVisualizationConfig,
  CodeEditorConfig,
  NavigationState,
  LoadingState,
  UserPreferences,
  AppState,
} from './ui';
