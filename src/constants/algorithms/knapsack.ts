import React from 'react';
import { Target } from 'lucide-react';
import { Algorithm } from '../../types';

export const knapsackAlgorithm: Algorithm = {
  id: 'knapsack',
  name: '0/1 Knapsack',
  description: 'Maximize value within weight capacity',
  icon: React.createElement(Target, { className: "h-5 w-5" }),
  complexity: { time: 'O(n×W)', space: 'O(n×W)' },
  defaultParams: { weights: [1, 3, 4, 5], values: [1, 4, 5, 7], capacity: 7 },
  paramControls: [
    { name: 'weights', type: 'array' as const, default: [1, 3, 4, 5], description: 'Item weights' },
    { name: 'values', type: 'array' as const, default: [1, 4, 5, 7], description: 'Item values' },
    { name: 'capacity', type: 'number' as const, min: 1, max: 15, default: 7, description: 'Knapsack capacity' }
  ],
  testCases: [
    { input: { weights: [1, 3, 4, 5], values: [1, 4, 5, 7], capacity: 7 }, expected: 9, description: "weights=[1,3,4,5], values=[1,4,5,7], capacity=7" },
    { input: { weights: [2, 1, 3], values: [2, 1, 3], capacity: 4 }, expected: 4, description: "weights=[2,1,3], values=[2,1,3], capacity=4" }
  ],
  gridSetup: () => [], // TODO: Extract from App.tsx
  animate: async () => {}, // TODO: Extract from App.tsx
  languages: [] // TODO: Extract from App.tsx
};
