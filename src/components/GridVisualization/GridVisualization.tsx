import React from 'react';
import type { Cell, PathCell, GridVisualizationConfig } from '@/types';
import { getCellColor, formatCellValue } from '@/utils';

/**
 * Grid Visualization Props following ISP
 * ISP: Separates grid data from visualization configuration
 */
interface BaseGridProps {
  grid: Cell[][];
  className?: string;
}

interface ConfigurableGridProps extends BaseGridProps {
  config?: Partial<GridVisualizationConfig>;
  onCellClick?: (row: number, col: number, cell: Cell) => void;
  onCellHover?: (row: number, col: number, cell: Cell | null) => void;
}

interface AnimatedGridProps extends ConfigurableGridProps {
  isAnimating?: boolean;
  showLabels?: boolean;
  highlightPath?: boolean;
}

export interface GridVisualizationProps extends AnimatedGridProps {}

/**
 * Individual Grid Cell Component
 * Single Responsibility: Renders a single cell with all its states
 */
interface GridCellProps {
  cell: Cell;
  row: number;
  col: number;
  config: GridVisualizationConfig;
  onClick?: (row: number, col: number, cell: Cell) => void;
  onHover?: (row: number, col: number, cell: Cell | null) => void;
  isAnimating?: boolean;
}

const GridCell: React.FC<GridCellProps> = ({
  cell,
  row,
  col,
  config,
  onClick,
  onHover,
  isAnimating = false,
}) => {
  const cellColor = getCellColor(cell, config.colorScheme);
  const formattedValue = formatCellValue(cell.value);
  
  const animationClasses = isAnimating ? 'transition-all duration-300 ease-in-out' : '';
  const hoverClasses = onClick ? 'hover:scale-105 cursor-pointer' : '';
  
  const cellStyles = {
    width: `${config.cellSize}px`,
    height: `${config.cellSize}px`,
    fontSize: `${Math.max(10, config.cellSize * 0.25)}px`,
  };

  const handleClick = () => {
    if (onClick) {
      onClick(row, col, cell);
    }
  };

  const handleMouseEnter = () => {
    if (onHover) {
      onHover(row, col, cell);
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      onHover(row, col, null);
    }
  };

  return (
    <div
      className={`
        flex items-center justify-center border-2 font-mono font-semibold text-center
        ${cellColor} ${animationClasses} ${hoverClasses}
      `}
      style={cellStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={onClick ? 'button' : 'cell'}
      tabIndex={onClick ? 0 : -1}
      aria-label={`Cell at row ${row}, column ${col}, value ${formattedValue}`}
    >
      {config.showLabels && (
        <span className="select-none truncate px-1">
          {formattedValue}
        </span>
      )}
    </div>
  );
};

/**
 * Grid Row Component
 * Single Responsibility: Renders a single row of cells
 */
interface GridRowProps {
  row: Cell[];
  rowIndex: number;
  config: GridVisualizationConfig;
  onCellClick?: (row: number, col: number, cell: Cell) => void;
  onCellHover?: (row: number, col: number, cell: Cell | null) => void;
  isAnimating?: boolean;
}

const GridRow: React.FC<GridRowProps> = ({
  row,
  rowIndex,
  config,
  onCellClick,
  onCellHover,
  isAnimating,
}) => {
  const rowStyle = {
    gap: `${config.gap}px`,
  };

  return (
    <div 
      className="flex" 
      style={rowStyle}
      role="row"
    >
      {row.map((cell, colIndex) => (
        <GridCell
          key={`${rowIndex}-${colIndex}`}
          cell={cell}
          row={rowIndex}
          col={colIndex}
          config={config}
          onClick={onCellClick}
          onHover={onCellHover}
          isAnimating={isAnimating}
        />
      ))}
    </div>
  );
};

/**
 * Path Visualization Component
 * Single Responsibility: Overlays path information on the grid
 */
interface PathOverlayProps {
  grid: (Cell | PathCell)[][];
  config: GridVisualizationConfig;
}

const PathOverlay: React.FC<PathOverlayProps> = ({ grid, config }) => {
  const pathCells = [];
  
  // Extract path cells for overlay
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      if ('isPath' in cell && cell.isPath) {
        pathCells.push({ row, col });
      }
    }
  }

  if (pathCells.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* SVG path overlay could be added here for connecting path cells */}
      <svg className="w-full h-full">
        {pathCells.map((cell) => (
          <circle
            key={`path-${cell.row}-${cell.col}`}
            cx={cell.col * (config.cellSize + config.gap) + config.cellSize / 2}
            cy={cell.row * (config.cellSize + config.gap) + config.cellSize / 2}
            r="3"
            fill="rgba(59, 130, 246, 0.6)"
            className="animate-pulse"
          />
        ))}
      </svg>
    </div>
  );
};

/**
 * Grid Visualization Legend
 * Single Responsibility: Provides visual legend for grid states
 */
interface GridLegendProps {
  config: GridVisualizationConfig;
  className?: string;
}

const GridLegend: React.FC<GridLegendProps> = ({ config, className = '' }) => {
  const legendItems = [
    { label: 'Unvisited', class: getCellColor({ value: 0, visited: false, highlighted: false }, config.colorScheme) },
    { label: 'Visited', class: getCellColor({ value: 1, visited: true, highlighted: false }, config.colorScheme) },
    { label: 'Current', class: getCellColor({ value: 1, visited: false, highlighted: false, isCurrentPath: true } as PathCell, config.colorScheme) },
    { label: 'Highlighted', class: getCellColor({ value: 1, visited: true, highlighted: true }, config.colorScheme) },
  ];

  return (
    <div className={`flex flex-wrap gap-4 text-sm ${className}`}>
      {legendItems.map(item => (
        <div key={item.label} className="flex items-center gap-2">
          <div 
            className={`w-4 h-4 border ${item.class} rounded`}
            style={{ minWidth: '16px', minHeight: '16px' }}
          />
          <span className="text-gray-700">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * Main Grid Visualization Component
 * Template Method Pattern: Defines the overall structure with customizable rendering
 */
const GridVisualization: React.FC<GridVisualizationProps> = ({
  grid,
  config: customConfig = {},
  onCellClick,
  onCellHover,
  isAnimating = false,
  showLabels = true,
  highlightPath = false,
  className = '',
}) => {
  // Default configuration with overrides
  const defaultConfig: GridVisualizationConfig = {
    cellSize: 60,
    gap: 2,
    showLabels: showLabels,
    showGrid: true,
    colorScheme: 'default',
    animationSpeed: 300,
  };

  const config = { ...defaultConfig, ...customConfig };

  // Memoize grid dimensions for performance
  const { rows, cols } = React.useMemo(() => ({
    rows: grid.length,
    cols: grid[0]?.length || 0,
  }), [grid]);

  const gridStyle = {
    gap: `${config.gap}px`,
  };

  if (rows === 0 || cols === 0) {
    return (
      <div className={`flex items-center justify-center p-8 text-gray-500 ${className}`}>
        <div className="text-center">
          <p className="text-lg font-medium">No Data</p>
          <p className="text-sm">Grid is empty or invalid</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid-visualization ${className}`}>
      {/* Main Grid Container */}
      <div className="relative inline-block">
        <div 
          className="flex flex-col relative"
          style={gridStyle}
          role="grid"
          aria-label={`${rows}x${cols} algorithm visualization grid`}
        >
          {grid.map((row, rowIndex) => (
            <GridRow
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              config={config}
              onCellClick={onCellClick}
              onCellHover={onCellHover}
              isAnimating={isAnimating}
            />
          ))}
        </div>
        
        {/* Path Overlay */}
        {highlightPath && (
          <PathOverlay grid={grid} config={config} />
        )}
      </div>

      {/* Grid Information */}
      <div className="mt-4 text-sm text-gray-600">
        <p>Grid Size: {rows} × {cols}</p>
        {isAnimating && (
          <p className="text-blue-600 font-medium">Animation in progress...</p>
        )}
      </div>

      {/* Legend */}
      <GridLegend config={config} className="mt-4" />
    </div>
  );
};

export default GridVisualization;
