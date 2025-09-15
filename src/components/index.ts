// Components barrel export
// Following Barrel Pattern for clean imports

// UI Components
export * from './ui';

// Main Application Components
export { default as GridVisualization } from './GridVisualization/GridVisualization';
export { default as AlgorithmSelector } from './AlgorithmSelector/AlgorithmSelector';

// Export component props for external use
export type { GridVisualizationProps } from './GridVisualization/GridVisualization';
export type { AlgorithmSelectorProps } from './AlgorithmSelector/AlgorithmSelector';
