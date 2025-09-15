import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cell, PathCell, GridConfig } from '../types';
import { getCellColor, formatCellValue } from '../utils';

// Grid Visualization following Single Responsibility and Composition patterns
// SRP: Only responsible for rendering the algorithm grid

interface GridVisualizationProps {
  grid: Cell[][];
  config?: Partial<GridConfig>;
  isAnimating?: boolean;
  onCellClick?: (row: number, col: number) => void;
  className?: string;
}

interface GridCellProps {
  cell: Cell | PathCell;
  row: number;
  col: number;
  config: GridConfig;
  isAnimating: boolean;
  onClick?: (row: number, col: number) => void;
}

const GridCell: React.FC<GridCellProps> = ({
  cell,
  row,
  col,
  config,
  isAnimating,
  onClick
}) => {
  const cellColor = getCellColor(cell, config.colorScheme);
  const formattedValue = formatCellValue(cell.value);
  
  const cellStyle = {
    width: config.cellSize,
    height: config.cellSize,
    fontSize: Math.max(10, config.cellSize * 0.25),
    borderRadius: config.borderRadius
  };

  const handleClick = () => {
    if (onClick) {
      onClick(row, col);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotate: cell.highlighted ? [0, 5, -5, 0] : 0
      }}
      transition={{ 
        duration: 0.3, 
        delay: isAnimating ? (row + col) * 0.05 : 0,
        rotate: { duration: 0.6, repeat: cell.highlighted ? Infinity : 0 }
      }}
      whileHover={{ 
        scale: onClick ? 1.1 : 1.05,
        zIndex: 10
      }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center justify-center font-mono font-bold
        border-2 transition-all duration-300 cursor-pointer
        relative overflow-hidden
        ${cellColor}
        ${onClick ? 'hover:shadow-lg' : ''}
      `}
      style={cellStyle}
      onClick={handleClick}
    >
      {/* Background animation for current path */}
      {'isCurrentPath' in cell && cell.isCurrentPath && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      
      {/* Value display */}
      <span className="relative z-10 select-none">
        {config.showLabels ? formattedValue : ''}
      </span>
      
      {/* Path indicator */}
      {'isPath' in cell && cell.isPath && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"
        />
      )}
      
      {/* Visited indicator */}
      {cell.visited && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-green-500 rounded-full"
        />
      )}
    </motion.div>
  );
};

const GridVisualization: React.FC<GridVisualizationProps> = ({
  grid,
  config: customConfig = {},
  isAnimating = false,
  onCellClick,
  className = ''
}) => {
  // Default configuration with overrides
  const defaultConfig: GridConfig = {
    cellSize: 64,
    gap: 4,
    showLabels: true,
    showGrid: true,
    colorScheme: 'default',
    borderRadius: 8
  };

  const config = { ...defaultConfig, ...customConfig };

  const gridStyle = {
    gap: config.gap,
    gridTemplateRows: `repeat(${grid.length}, ${config.cellSize}px)`,
    gridTemplateColumns: `repeat(${grid[0]?.length || 0}, ${config.cellSize}px)`
  };

  if (!grid.length || !grid[0]?.length) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">No Grid Data</div>
          <div className="text-sm">Initialize an algorithm to see the visualization</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid-visualization ${className}`}>
      {/* Grid Container */}
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-grid"
          style={gridStyle}
        >
          <AnimatePresence>
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <GridCell
                  key={`${rowIndex}-${colIndex}`}
                  cell={cell}
                  row={rowIndex}
                  col={colIndex}
                  config={config}
                  isAnimating={isAnimating}
                  onClick={onCellClick}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Grid Information */}
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600">
            Grid Size: {grid.length} × {grid[0].length}
          </div>
          
          {isAnimating && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-blue-600 font-medium text-sm"
            >
              🎯 Animation in progress...
            </motion.div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span>Unvisited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span>Result</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridVisualization;
