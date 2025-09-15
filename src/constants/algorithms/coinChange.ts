import React from 'react';
import { Calculator } from 'lucide-react';
import { Algorithm } from '../../types';
// TODO: Extract full algorithm definition from App.tsx
// This is a stub - will be completed in next iteration

export const coinChangeAlgorithm: Algorithm = {
  id: 'coinChange',
  name: 'Coin Change',
  description: 'Find minimum coins needed to make a target amount',
  icon: React.createElement(Calculator, { className: "h-5 w-5" }),
  complexity: { time: 'O(amount×coins)', space: 'O(amount)' },
  defaultParams: { coins: [1, 3, 4], amount: 6 },
  paramControls: [
    { name: 'coins', type: 'array' as const, default: [1, 3, 4], description: 'Available coin denominations' },
    { name: 'amount', type: 'number' as const, min: 1, max: 20, default: 6, description: 'Target amount' }
  ],
  testCases: [
    { input: { coins: [1, 3, 4], amount: 6 }, expected: 2, description: "coins=[1,3,4], amount=6" },
    { input: { coins: [2], amount: 3 }, expected: -1, description: "coins=[2], amount=3" },
    { input: { coins: [1], amount: 0 }, expected: 0, description: "amount=0" }
  ],
  gridSetup: () => [], // TODO: Extract from App.tsx
  animate: async () => {}, // TODO: Extract from App.tsx
  languages: [] // TODO: Extract from App.tsx
};
