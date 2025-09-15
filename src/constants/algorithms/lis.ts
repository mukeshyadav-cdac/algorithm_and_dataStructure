import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Algorithm } from '../../types';

export const lisAlgorithm: Algorithm = {
  id: 'lis',
  name: 'Longest Increasing Subsequence',
  description: 'Find the length of the longest increasing subsequence',
  icon: React.createElement(TrendingUp, { className: "h-5 w-5" }),
  complexity: { time: 'O(n²)', space: 'O(n)' },
  defaultParams: { nums: [10, 9, 2, 5, 3, 7, 101, 18] },
  paramControls: [
    { name: 'nums', type: 'array' as const, default: [10, 9, 2, 5, 3, 7, 101, 18], description: 'Input array' }
  ],
  testCases: [
    { input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, expected: 4, description: "nums=[10,9,2,5,3,7,101,18]" },
    { input: { nums: [0, 1, 0, 3, 2, 3] }, expected: 4, description: "nums=[0,1,0,3,2,3]" },
    { input: { nums: [7, 7, 7, 7, 7, 7, 7] }, expected: 1, description: "all same elements" }
  ],
  gridSetup: () => [], // TODO: Extract from App.tsx
  animate: async () => {}, // TODO: Extract from App.tsx  
  languages: [] // TODO: Extract from App.tsx
};
