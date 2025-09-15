import { Cell } from '../types';

/**
 * Grid utility functions for dynamic programming visualization
 */

/**
 * Creates an empty grid with default cell values
 * @param rows - Number of rows
 * @param cols - Number of columns
 * @returns Initialized grid
 */
export const createEmptyGrid = (rows: number, cols: number): Cell[][] => {
  return Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map((): Cell => ({
      value: 0,
      isPath: false,
      isCurrentPath: false,
      visited: false,
      highlighted: false
    }))
  );
};

/**
 * Validates grid dimensions
 * @param rows - Number of rows
 * @param cols - Number of columns
 * @returns Validation result with constraints applied
 */
export const validateGridDimensions = (rows: number, cols: number): { rows: number; cols: number } => {
  const MIN_SIZE = 2;
  const MAX_SIZE = 10;
  
  return {
    rows: Math.max(MIN_SIZE, Math.min(MAX_SIZE, rows)),
    cols: Math.max(MIN_SIZE, Math.min(MAX_SIZE, cols))
  };
};

/**
 * Deep clones a grid to prevent mutation issues
 * @param grid - Grid to clone
 * @returns Cloned grid
 */
export const cloneGrid = (grid: Cell[][]): Cell[][] => {
  return grid.map(row => 
    row.map(cell => ({ ...cell }))
  );
};

/**
 * Resets all cells in a grid to default state
 * @param grid - Grid to reset
 * @returns Reset grid
 */
export const resetGrid = (grid: Cell[][]): Cell[][] => {
  return grid.map(row =>
    row.map(cell => ({
      ...cell,
      isPath: false,
      isCurrentPath: false,
      visited: false,
      highlighted: false
    }))
  );
};

/**
 * Gets cell color class based on cell state
 * @param cell - Cell to get color for
 * @returns CSS class string
 */
export const getCellColorClass = (cell: Cell): string => {
  if (cell.isCurrentPath) return 'bg-yellow-400 border-yellow-600 shadow-lg';
  if (cell.highlighted) return 'bg-purple-300 border-purple-500';
  if (cell.isPath) return 'bg-green-400 border-green-600';
  if (cell.visited) return 'bg-blue-100 border-blue-300';
  return 'bg-gray-50 border-gray-200';
};

/**
 * Checks if coordinates are within grid bounds
 * @param row - Row index
 * @param col - Column index
 * @param grid - Grid to check bounds against
 * @returns True if coordinates are valid
 */
export const isValidCoordinate = (row: number, col: number, grid: Cell[][]): boolean => {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
};

/**
 * Gets all neighboring cells (4-directional)
 * @param row - Current row
 * @param col - Current column
 * @param grid - Grid to search
 * @returns Array of neighboring cells with their coordinates
 */
export const getNeighbors = (
  row: number, 
  col: number, 
  grid: Cell[][]
): Array<{ cell: Cell; row: number; col: number }> => {
  const neighbors = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (isValidCoordinate(newRow, newCol, grid)) {
      neighbors.push({
        cell: grid[newRow][newCol],
        row: newRow,
        col: newCol
      });
    }
  }
  
  return neighbors;
};

/**
 * Calculates grid statistics
 * @param grid - Grid to analyze
 * @returns Grid statistics
 */
export const getGridStats = (grid: Cell[][]) => {
  let visitedCount = 0;
  let pathCount = 0;
  let highlightedCount = 0;
  
  for (const row of grid) {
    for (const cell of row) {
      if (cell.visited) visitedCount++;
      if (cell.isPath) pathCount++;
      if (cell.highlighted) highlightedCount++;
    }
  }
  
  return {
    totalCells: grid.length * (grid[0]?.length || 0),
    visitedCount,
    pathCount,
    highlightedCount,
    unvisitedCount: (grid.length * (grid[0]?.length || 0)) - visitedCount
  };
};
