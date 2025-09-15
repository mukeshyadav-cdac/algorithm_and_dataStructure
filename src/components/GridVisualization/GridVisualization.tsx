import React from 'react';
import { GridVisualizationProps } from '../../types';

/**
 * Grid Visualization Component
 * TODO: Extract full implementation from original App.tsx
 */
export const GridVisualization: React.FC<GridVisualizationProps> = ({
  grid,
  algorithmName,
  cols,
  getCellColor,
  formatCellValue
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {algorithmName} Visualization
      </h3>
      
      {/* TODO: Implement full grid visualization */}
      <div className="flex justify-center">
        <p className="text-sm text-gray-600">Grid visualization will be implemented here...</p>
      </div>
    </div>
  );
};
