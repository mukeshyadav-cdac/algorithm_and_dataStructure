import { Cell, PathCell } from '../types';

// Grid utilities following Single Responsibility Principle (SRP)

/**
 * Color schemes for different accessibility needs
 * SRP: Only manages color schemes
 */
export const colorSchemes = {
  default: {
    visited: 'bg-blue-100 border-blue-200 text-blue-800',
    current: 'bg-yellow-200 border-yellow-300 text-yellow-900',
    path: 'bg-green-100 border-green-200 text-green-800',
    highlighted: 'bg-red-100 border-red-200 text-red-800',
    unvisited: 'bg-gray-50 border-gray-200 text-gray-600',
  },
  colorblind: {
    visited: 'bg-blue-100 border-blue-300 text-blue-900',
    current: 'bg-orange-200 border-orange-300 text-orange-900',
    path: 'bg-blue-200 border-blue-400 text-blue-900',
    highlighted: 'bg-purple-100 border-purple-200 text-purple-800',
    unvisited: 'bg-gray-50 border-gray-300 text-gray-700',
  },
  high_contrast: {
    visited: 'bg-black text-white border-gray-800',
    current: 'bg-yellow-400 text-black border-yellow-600',
    path: 'bg-blue-600 text-white border-blue-800',
    highlighted: 'bg-red-600 text-white border-red-800',
    unvisited: 'bg-white text-black border-gray-800',
  },
};

/**
 * Determine cell color based on state
 * SRP: Only handles color determination
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
 * Format cell value for display
 * SRP: Only handles value formatting
 */
export const formatCellValue = (value: number | string): string => {
  if (typeof value === 'number') {
    if (value === Infinity) return '∞';
    if (value === -Infinity) return '-∞';
    if (Number.isInteger(value)) return value.toString();
    return Number(value).toFixed(1);
  }
  return value.toString();
};

/**
 * Create empty grid
 * SRP: Only creates grids
 */
export const createGrid = (rows: number, cols: number): Cell[][] => {
  return Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({
      value: 0,
      visited: false,
      highlighted: false,
    }))
  );
};

/**
 * Create path grid
 * SRP: Only creates path grids
 */
export const createPathGrid = (rows: number, cols: number): PathCell[][] => {
  return Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({
      value: 0,
      visited: false,
      highlighted: false,
      isPath: false,
      isCurrentPath: false,
    }))
  );
};

/**
 * Deep clone grid
 * SRP: Only handles grid cloning
 */
export const cloneGrid = <T extends Cell>(grid: T[][]): T[][] => {
  return grid.map(row => row.map(cell => ({ ...cell })));
};

/**
 * Reset grid to initial state
 * SRP: Only resets grid state
 */
export const resetGrid = <T extends Cell>(grid: T[][]): T[][] => {
  return grid.map(row =>
    row.map(cell => ({
      ...cell,
      visited: false,
      highlighted: false,
      ...(('isPath' in cell) && { isPath: false, isCurrentPath: false }),
    }))
  );
};

/**
 * Get grid neighbors (4-directional)
 * SRP: Only finds neighbors
 */
export const getNeighbors = (
  grid: Cell[][], 
  row: number, 
  col: number
): Array<{ row: number; col: number; cell: Cell }> => {
  const neighbors = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < grid.length && 
        newCol >= 0 && newCol < grid[0].length) {
      neighbors.push({
        row: newRow,
        col: newCol,
        cell: grid[newRow][newCol],
      });
    }
  }
  
  return neighbors;
};
