import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Algorithm } from '../../types';

export const minPathSumAlgorithm: Algorithm = {
  id: 'minPathSum',
  name: 'Minimum Path Sum',
  description: 'Find minimum sum path from top-left to bottom-right',
  icon: React.createElement(ArrowRight, { className: "h-5 w-5" }),
  complexity: { time: 'O(m×n)', space: 'O(m×n)' },
  defaultParams: { gridData: [[1,3,1],[1,5,1],[4,2,1]] },
  paramControls: [
    { name: 'gridData', type: 'array' as const, default: [[1,3,1],[1,5,1],[4,2,1]], description: 'Grid with costs' }
  ],
  testCases: [
    { input: { grid: [[1,3,1],[1,5,1],[4,2,1]] }, expected: 7, description: "3x3 grid" },
    { input: { grid: [[1,2,3],[4,5,6]] }, expected: 12, description: "2x3 grid" }
  ],
  gridSetup: () => [], // TODO: Extract from App.tsx
  animate: async () => {}, // TODO: Extract from App.tsx
  languages: [] // TODO: Extract from App.tsx
};
