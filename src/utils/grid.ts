import { Cell, PathCell } from '@/types';

// Grid utilities following Single Responsibility Principle (SRP)

/**
 * Grid color schemes for accessibility
 * SRP: Only manages color schemes
 */
export const colorSchemes = {
  default: {
    visited: 'bg-blue-200 border-blue-300',
    current: 'bg-yellow-300 border-yellow-400',
    path: 'bg-green-200 border-green-300',
    highlighted: 'bg-red-200 border-red-300',
    unvisited: 'bg-gray-100 border-gray-200',
  },
  colorblind: {
    visited: 'bg-blue-200 border-blue-400',
    current: 'bg-orange-300 border-orange-400',
    path: 'bg-blue-300 border-blue-400',
    highlighted: 'bg-purple-200 border-purple-300',
    unvisited: 'bg-gray-100 border-gray-300',
  },
  high_contrast: {
    visited: 'bg-black text-white border-gray-800',
    current: 'bg-yellow-400 text-black border-yellow-600',
    path: 'bg-blue-600 text-white border-blue-800',
    highlighted: 'bg-red-600 text-white border-red-800',
    unvisited: 'bg-white text-black border-gray-400',
  },
};

/**
 * Cell color determination
 * SRP: Only determines cell colors based on state
 */
export const getCellColor = (
  cell: Cell | PathCell,
  scheme: keyof typeof colorSchemes = 'default'
): string => {
  const colors = colorSchemes[scheme];
  
  if (cell.highlighted) return colors.highlighted;
  if ('isCurrentPath' in cell && cell.isCurrentPath) return colors.current;
  if ('isPath' in cell && cell.isPath) return colors.path;
  if (cell.visited) return colors.visited;
  
  return colors.unvisited;
};

/**
 * Cell value formatting
 * SRP: Only handles value display formatting
 */
export const formatCellValue = (value: number | string): string => {
  if (typeof value === 'number') {
    if (value === Infinity) return '∞';
    if (value === -Infinity) return '-∞';
    if (Number.isInteger(value)) return value.toString();
    return Number(value).toFixed(2);
  }
  return value.toString();
};

/**
 * Grid initialization utilities
 * SRP: Only creates and initializes grids
 */
export const gridInitializers = {
  /**
   * Create empty grid
   */
  createEmpty: (rows: number, cols: number): Cell[][] => {
    return Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        value: 0,
        visited: false,
        highlighted: false,
      }))
    );
  },

  /**
   * Create path grid
   */
  createPath: (rows: number, cols: number): PathCell[][] => {
    return Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        value: 0,
        visited: false,
        highlighted: false,
        isPath: false,
        isCurrentPath: false,
      }))
    );
  },

  /**
   * Create grid with initial values
   */
  createWithValues: (values: (number | string)[][]): Cell[][] => {
    return values.map(row =>
      row.map(value => ({
        value,
        visited: false,
        highlighted: false,
      }))
    );
  },

  /**
   * Create 1D array as single-row grid
   */
  create1D: (size: number, initialValue: number | string = 0): Cell[][] => {
    return [Array(size).fill(null).map(() => ({
      value: initialValue,
      visited: false,
      highlighted: false,
    }))];
  },
};

/**
 * Grid manipulation utilities
 * SRP: Only handles grid transformations
 */
export const gridOperations = {
  /**
   * Deep clone a grid
   */
  clone: <T extends Cell>(grid: T[][]): T[][] => {
    return grid.map(row => row.map(cell => ({ ...cell })));
  },

  /**
   * Reset grid to initial state
   */
  reset: <T extends Cell>(grid: T[][]): T[][] => {
    return grid.map(row =>
      row.map(cell => ({
        ...cell,
        visited: false,
        highlighted: false,
        ...(('isPath' in cell) && { isPath: false, isCurrentPath: false }),
      }))
    );
  },

  /**
   * Get grid dimensions
   */
  getDimensions: (grid: Cell[][]): { rows: number; cols: number } => {
    return {
      rows: grid.length,
      cols: grid[0]?.length || 0,
    };
  },

  /**
   * Check if coordinates are valid
   */
  isValidCoordinate: (grid: Cell[][], row: number, col: number): boolean => {
    return row >= 0 && row < grid.length && col >= 0 && col < (grid[row]?.length || 0);
  },

  /**
   * Get neighboring cells (4-directional)
   */
  getNeighbors: (grid: Cell[][], row: number, col: number): Array<{ row: number; col: number; cell: Cell }> => {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const neighbors = [];

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (gridOperations.isValidCoordinate(grid, newRow, newCol)) {
        neighbors.push({
          row: newRow,
          col: newCol,
          cell: grid[newRow][newCol],
        });
      }
    }

    return neighbors;
  },

  /**
   * Find cells matching a condition
   */
  findCells: <T extends Cell>(
    grid: T[][],
    predicate: (cell: T, row: number, col: number) => boolean
  ): Array<{ row: number; col: number; cell: T }> => {
    const found = [];
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (predicate(grid[row][col], row, col)) {
          found.push({ row, col, cell: grid[row][col] });
        }
      }
    }
    
    return found;
  },
};

/**
 * Grid validation utilities
 * SRP: Only validates grid properties
 */
export const gridValidation = {
  /**
   * Check if grid is rectangular
   */
  isRectangular: (grid: Cell[][]): boolean => {
    if (grid.length === 0) return true;
    const firstRowLength = grid[0].length;
    return grid.every(row => row.length === firstRowLength);
  },

  /**
   * Check if grid is within size limits
   */
  isValidSize: (grid: Cell[][], maxRows = 50, maxCols = 50): boolean => {
    return grid.length <= maxRows && grid.every(row => row.length <= maxCols);
  },

  /**
   * Validate grid structure
   */
  validate: (grid: Cell[][]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!grid || grid.length === 0) {
      errors.push('Grid is empty');
    } else {
      if (!gridValidation.isRectangular(grid)) {
        errors.push('Grid is not rectangular');
      }
      
      if (!gridValidation.isValidSize(grid)) {
        errors.push('Grid exceeds maximum size limits');
      }
    }

    return { valid: errors.length === 0, errors };
  },
};
