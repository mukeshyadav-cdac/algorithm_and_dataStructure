// UI component props and state interfaces

export interface HeaderProps {
  title: string;
  subtitle: string;
}

export interface ControlPanelProps {
  selectedAlgorithm: number;
  onAlgorithmChange: (index: number) => void;
  selectedLanguage: number;
  onLanguageChange: (index: number) => void;
  rows: number;
  cols: number;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  showSettings: boolean;
  onToggleSettings: () => void;
  isAnimating: boolean;
  onStartAnimation: () => void;
  onResetVisualization: () => void;
  onToggleCode: () => void;
  onRunTests: () => void;
  isRunningTests: boolean;
  showCode: boolean;
  algorithmParams: any;
  onParamUpdate: (paramName: string, value: any) => void;
}

export interface GridVisualizationProps {
  grid: any[][];
  algorithmName: string;
  cols: number;
  getCellColor: (cell: any) => string;
  formatCellValue: (value: number | string) => string;
}

export interface TestResultsProps {
  testResults: any[];
  isVisible: boolean;
  algorithmTestCases: any[];
}

export interface CodeDisplayProps {
  isVisible: boolean;
  currentLanguage: any;
  customCode: string;
  onCodeChange: (code: string) => void;
}

export interface LegendProps {
  items: Array<{
    color: string;
    label: string;
  }>;
}

// Component state interfaces
export interface AlgorithmVisualizerState {
  selectedAlgorithm: number;
  rows: number;
  cols: number;
  grid: any[][];
  isAnimating: boolean;
  selectedLanguage: number;
  showCode: boolean;
  animationSpeed: number;
  showSettings: boolean;
  testResults: any[];
  isRunningTests: boolean;
  showTests: boolean;
  customCode: string;
  algorithmParams: any;
}
