import React from 'react';
import { TreePine, Search, RotateCcw, GitBranch, Shuffle } from 'lucide-react';
import { Algorithm, VisualizationStrategy, ExecutionStrategy } from '../types';
import { delay } from '../utils';

/**
 * Tree Algorithms with Visual Binary Tree Representations
 * Composition pattern for flexible tree visualizations
 */

// Tree visualization strategy
const createTreeVisualization = (
  setupFn: (rows: number, cols: number, params: any) => any[][],
  animateFn: (context: any, setGrid: any) => Promise<void>
): VisualizationStrategy => ({
  id: 'tree-visualization',
  name: 'Tree Visualization',
  description: 'Visualizes tree algorithms using hierarchical node representation',
  setup: setupFn,
  animate: animateFn,
  getStepCount: (params) => (params.nodes?.length || 7) * 2
});

const createJSExecution = (code: string): ExecutionStrategy => ({
  language: 'JavaScript',
  extension: 'js',
  code,
  execute: async (code, testCases) => {
    const results = [];
    for (const testCase of testCases) {
      try {
        const func = new Function('input', `'use strict';\n${code}\nreturn solve(input);`);
        const startTime = performance.now();
        const actual = func(testCase.input);
        const endTime = performance.now();
        results.push({
          passed: JSON.stringify(actual) === JSON.stringify(testCase.expected),
          expected: testCase.expected,
          actual,
          description: testCase.description,
          executionTime: endTime - startTime
        });
      } catch (error) {
        results.push({
          passed: false,
          expected: testCase.expected,
          actual: null,
          description: testCase.description,
          error: error.message
        });
      }
    }
    return results;
  },
  runtimeStatus: 'ready'
});

// 1. BINARY TREE TRAVERSAL (In-order, Pre-order, Post-order)
export const binaryTreeTraversalAlgorithm: Algorithm = {
  id: 'binaryTreeTraversal',
  name: 'Binary Tree Traversal',
  category: { id: 'tree', name: 'Tree Algorithms', description: '', icon: React.createElement(TreePine), color: 'green', gradient: 'from-green-500 to-emerald-600' },
  difficulty: 'medium',
  icon: React.createElement(TreePine, { className: "h-6 w-6" }),
  tags: ['Tree', 'Traversal', 'Recursion', 'DFS'],
  
  visualization: createTreeVisualization(
    (rows, cols, params) => {
      // Create visual representation of binary tree
      // Row 0: Root (index 0)
      // Row 1: Level 1 nodes (indices 1, 2)  
      // Row 2: Level 2 nodes (indices 3, 4, 5, 6)
      const nodes = params?.nodes || [4, 2, 6, 1, 3, 5, 7];
      const treeGrid = [
        [{ value: '', visited: false, highlighted: false }, { value: nodes[0] || null, visited: false, highlighted: false }, { value: '', visited: false, highlighted: false }],
        [{ value: nodes[1] || null, visited: false, highlighted: false }, { value: '', visited: false, highlighted: false }, { value: nodes[2] || null, visited: false, highlighted: false }],
        [{ value: nodes[3] || null, visited: false, highlighted: false }, { value: nodes[4] || null, visited: false, highlighted: false }, { value: nodes[5] || null, visited: false, highlighted: false }, { value: nodes[6] || null, visited: false, highlighted: false }]
      ];
      return treeGrid;
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const traversalType = params.traversalType as string || 'inorder';
      const result = [];
      
      // Simulate tree traversal
      const traverse = async (row: number, col: number, type: string) => {
        if (!grid[row] || !grid[row][col] || grid[row][col].value === null || grid[row][col].value === '') {
          return;
        }
        
        // Highlight current node
        grid[row][col] = { ...grid[row][col], highlighted: true };
        setGrid([...grid]);
        await delay(context.speed);
        
        if (type === 'preorder') {
          // Visit root first
          grid[row][col] = { ...grid[row][col], visited: true, highlighted: false };
          result.push(grid[row][col].value);
          setGrid([...grid]);
          await delay(context.speed);
        }
        
        // Traverse left subtree
        if (row === 0) {
          await traverse(1, 0, type); // Left child of root
        } else if (row === 1 && col === 0) {
          await traverse(2, 0, type); // Left child of left child
        } else if (row === 1 && col === 2) {
          await traverse(2, 2, type); // Left child of right child
        }
        
        if (type === 'inorder') {
          // Visit root between left and right
          grid[row][col] = { ...grid[row][col], visited: true, highlighted: false };
          result.push(grid[row][col].value);
          setGrid([...grid]);
          await delay(context.speed);
        }
        
        // Traverse right subtree
        if (row === 0) {
          await traverse(1, 2, type); // Right child of root
        } else if (row === 1 && col === 0) {
          await traverse(2, 1, type); // Right child of left child
        } else if (row === 1 && col === 2) {
          await traverse(2, 3, type); // Right child of right child
        }
        
        if (type === 'postorder') {
          // Visit root after children
          grid[row][col] = { ...grid[row][col], visited: true, highlighted: false };
          result.push(grid[row][col].value);
          setGrid([...grid]);
          await delay(context.speed);
        }
      };
      
      await traverse(0, 1, traversalType); // Start from root
    }
  ),
  
  execution: [
    createJSExecution(`
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function solve(input) {
  const { nodes, traversalType } = input;
  
  // Build tree from array
  if (!nodes || nodes.length === 0) return [];
  
  const root = new TreeNode(nodes[0]);
  const queue = [root];
  let i = 1;
  
  while (queue.length && i < nodes.length) {
    const node = queue.shift();
    if (i < nodes.length && nodes[i] !== null) {
      node.left = new TreeNode(nodes[i]);
      queue.push(node.left);
    }
    i++;
    if (i < nodes.length && nodes[i] !== null) {
      node.right = new TreeNode(nodes[i]);
      queue.push(node.right);
    }
    i++;
  }
  
  const result = [];
  
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    result.push(node.val);
    inorder(node.right);
  }
  
  function preorder(node) {
    if (!node) return;
    result.push(node.val);
    preorder(node.left);
    preorder(node.right);
  }
  
  function postorder(node) {
    if (!node) return;
    postorder(node.left);
    postorder(node.right);
    result.push(node.val);
  }
  
  if (traversalType === 'inorder') inorder(root);
  else if (traversalType === 'preorder') preorder(root);
  else if (traversalType === 'postorder') postorder(root);
  
  return result;
}`)
  ],
  
  education: {
    overview: 'Binary tree traversal algorithms visit each node in a tree exactly once. The three main depth-first traversals are inorder, preorder, and postorder.',
    keyInsights: [
      'Inorder: Left → Root → Right (gives sorted order for BST)',
      'Preorder: Root → Left → Right (good for copying/serializing tree)',
      'Postorder: Left → Right → Root (good for deleting/calculating tree)',
      'All traversals have O(n) time complexity'
    ],
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n)',
      worst: 'O(n)',
      explanation: 'We must visit each node exactly once'
    },
    spaceComplexity: {
      value: 'O(h)',
      explanation: 'h is the height of tree - space used by recursion stack'
    },
    whenToUse: [
      'Inorder: Get sorted values from BST',
      'Preorder: Copy or serialize tree structure',
      'Postorder: Delete tree or calculate aggregations',
      'Any operation requiring visiting all nodes'
    ],
    commonPitfalls: [
      'Mixing up the order of recursive calls',
      'Not handling null nodes properly',
      'Stack overflow with very deep trees',
      'Confusing tree traversal with graph traversal'
    ],
    realWorldApplications: [
      {
        title: 'File System Navigation',
        description: 'Traverse directory structures',
        industry: 'Operating Systems'
      },
      {
        title: 'Expression Tree Evaluation',
        description: 'Parse and evaluate mathematical expressions',
        industry: 'Compilers & Interpreters'
      },
      {
        title: 'Decision Tree Analysis',
        description: 'Navigate decision trees in AI/ML applications',
        industry: 'Machine Learning'
      }
    ]
  },
  
  testCases: [
    { 
      input: { nodes: [4, 2, 6, 1, 3, 5, 7], traversalType: 'inorder' }, 
      expected: [1, 2, 3, 4, 5, 6, 7], 
      description: 'Inorder traversal gives sorted sequence for BST' 
    },
    { 
      input: { nodes: [4, 2, 6, 1, 3, 5, 7], traversalType: 'preorder' }, 
      expected: [4, 2, 1, 3, 6, 5, 7], 
      description: 'Preorder traversal visits root first' 
    },
    { 
      input: { nodes: [4, 2, 6, 1, 3, 5, 7], traversalType: 'postorder' }, 
      expected: [1, 3, 2, 5, 7, 6, 4], 
      description: 'Postorder traversal visits root last' 
    }
  ],
  
  defaultParams: { nodes: [4, 2, 6, 1, 3, 5, 7], traversalType: 'inorder' },
  paramControls: [
    { name: 'nodes', type: 'array', label: 'Tree Nodes', default: [4, 2, 6, 1, 3, 5, 7], description: 'Binary tree nodes in level order' },
    { name: 'traversalType', type: 'string', label: 'Traversal Type', default: 'inorder', description: 'Type of traversal (inorder, preorder, postorder)' }
  ],
  
  estimatedTimeMinutes: 15,
  prerequisites: ['Recursion', 'Binary Trees'],
  relatedAlgorithms: ['binarySearchTree', 'levelOrderTraversal']
};

// 2. BINARY SEARCH TREE OPERATIONS
export const bstAlgorithm: Algorithm = {
  id: 'binarySearchTree',
  name: 'Binary Search Tree',
  category: { id: 'tree', name: 'Tree Algorithms', description: '', icon: React.createElement(TreePine), color: 'green', gradient: 'from-green-500 to-emerald-600' },
  difficulty: 'medium',
  icon: React.createElement(Search, { className: "h-6 w-6" }),
  tags: ['BST', 'Search', 'Insert', 'Delete'],
  
  visualization: createTreeVisualization(
    (rows, cols, params) => {
      const nodes = [null]; // Will be built dynamically
      return [
        [{ value: '', visited: false, highlighted: false }, { value: null, visited: false, highlighted: false }, { value: '', visited: false, highlighted: false }],
        [{ value: null, visited: false, highlighted: false }, { value: '', visited: false, highlighted: false }, { value: null, visited: false, highlighted: false }],
        [{ value: null, visited: false, highlighted: false }, { value: null, visited: false, highlighted: false }, { value: null, visited: false, highlighted: false }, { value: null, visited: false, highlighted: false }]
      ];
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const operations = params.operations as Array<{op: string, value: number}> || [
        {op: 'insert', value: 4},
        {op: 'insert', value: 2},
        {op: 'insert', value: 6},
        {op: 'insert', value: 1},
        {op: 'search', value: 2}
      ];
      
      let root = null;
      const treeNodes = new Map(); // Track node positions
      
      for (const operation of operations) {
        if (operation.op === 'insert') {
          // Simulate BST insertion
          if (root === null) {
            root = operation.value;
            grid[0][1] = { value: operation.value, visited: false, highlighted: true };
            treeNodes.set(operation.value, {row: 0, col: 1});
          } else {
            // Find insertion point
            let current = root;
            let row = 0, col = 1;
            let found = false;
            
            grid[row][col] = { ...grid[row][col], highlighted: true };
            setGrid([...grid]);
            await delay(context.speed);
            
            while (!found) {
              if (operation.value < current) {
                // Go left
                if (row === 0 && col === 1) { row = 1; col = 0; }
                else if (row === 1 && col === 0) { row = 2; col = 0; }
                else if (row === 1 && col === 2) { row = 2; col = 2; }
                
                if (grid[row][col].value === null) {
                  grid[row][col] = { value: operation.value, visited: false, highlighted: true };
                  treeNodes.set(operation.value, {row, col});
                  found = true;
                } else {
                  current = grid[row][col].value;
                  grid[row][col] = { ...grid[row][col], highlighted: true };
                  setGrid([...grid]);
                  await delay(context.speed);
                }
              } else {
                // Go right
                if (row === 0 && col === 1) { row = 1; col = 2; }
                else if (row === 1 && col === 0) { row = 2; col = 1; }
                else if (row === 1 && col === 2) { row = 2; col = 3; }
                
                if (grid[row][col].value === null) {
                  grid[row][col] = { value: operation.value, visited: false, highlighted: true };
                  treeNodes.set(operation.value, {row, col});
                  found = true;
                } else {
                  current = grid[row][col].value;
                  grid[row][col] = { ...grid[row][col], highlighted: true };
                  setGrid([...grid]);
                  await delay(context.speed);
                }
              }
            }
          }
        } else if (operation.op === 'search') {
          // Simulate BST search
          const target = operation.value;
          const pos = treeNodes.get(target);
          if (pos) {
            grid[pos.row][pos.col] = { ...grid[pos.row][pos.col], highlighted: true, visited: true };
          }
        }
        
        setGrid([...grid]);
        await delay(context.speed);
        
        // Clear highlights
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = { ...grid[i][j], highlighted: false };
          }
        }
        setGrid([...grid]);
        await delay(context.speed / 2);
      }
    }
  ),
  
  execution: [
    createJSExecution(`
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  
  insert(val) {
    this.root = this._insertRec(this.root, val);
  }
  
  _insertRec(node, val) {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = this._insertRec(node.left, val);
    else if (val > node.val) node.right = this._insertRec(node.right, val);
    return node;
  }
  
  search(val) {
    return this._searchRec(this.root, val);
  }
  
  _searchRec(node, val) {
    if (!node || node.val === val) return node !== null;
    if (val < node.val) return this._searchRec(node.left, val);
    return this._searchRec(node.right, val);
  }
  
  inorder() {
    const result = [];
    this._inorderRec(this.root, result);
    return result;
  }
  
  _inorderRec(node, result) {
    if (node) {
      this._inorderRec(node.left, result);
      result.push(node.val);
      this._inorderRec(node.right, result);
    }
  }
}

function solve(input) {
  const { operations } = input;
  const bst = new BST();
  const results = [];
  
  for (const op of operations) {
    if (op.op === 'insert') {
      bst.insert(op.value);
      results.push('inserted');
    } else if (op.op === 'search') {
      results.push(bst.search(op.value));
    } else if (op.op === 'inorder') {
      results.push(bst.inorder());
    }
  }
  
  return results;
}`)
  ],
  
  education: {
    overview: 'A Binary Search Tree (BST) maintains the property that left subtree values are less than root, and right subtree values are greater than root.',
    keyInsights: [
      'BST property enables efficient O(log n) operations',
      'Inorder traversal gives sorted sequence',
      'Can degenerate to O(n) in worst case (becomes linked list)',
      'Self-balancing variants (AVL, Red-Black) maintain O(log n)'
    ],
    timeComplexity: {
      best: 'O(log n)',
      average: 'O(log n)',
      worst: 'O(n)',
      explanation: 'O(log n) for balanced tree, O(n) for skewed tree'
    },
    spaceComplexity: {
      value: 'O(n)',
      explanation: 'Space for storing n nodes, plus O(log n) recursion stack'
    },
    whenToUse: [
      'Need sorted data with frequent insertions/deletions',
      'Range queries and finding kth smallest element',
      'Implementing symbol tables and databases',
      'When you need both search and sort functionality'
    ],
    commonPitfalls: [
      'Not handling duplicate values consistently',
      'Tree becoming unbalanced (use AVL/Red-Black instead)',
      'Not updating parent pointers in deletion',
      'Confusing BST property with heap property'
    ],
    realWorldApplications: [
      {
        title: 'Database Indexing',
        description: 'Fast lookups in database tables',
        industry: 'Database Management'
      },
      {
        title: 'File Systems',
        description: 'Directory structure organization',
        industry: 'Operating Systems'
      },
      {
        title: 'Expression Parsing',
        description: 'Parse mathematical and logical expressions',
        industry: 'Compilers'
      }
    ]
  },
  
  testCases: [
    { 
      input: { 
        operations: [
          {op: 'insert', value: 4},
          {op: 'insert', value: 2},
          {op: 'insert', value: 6},
          {op: 'search', value: 2},
          {op: 'search', value: 5}
        ] 
      }, 
      expected: ['inserted', 'inserted', 'inserted', true, false], 
      description: 'Insert nodes and search for existing/non-existing values' 
    },
    { 
      input: { 
        operations: [
          {op: 'insert', value: 5},
          {op: 'insert', value: 3},
          {op: 'insert', value: 7},
          {op: 'insert', value: 1},
          {op: 'inorder'}
        ] 
      }, 
      expected: ['inserted', 'inserted', 'inserted', 'inserted', [1, 3, 5, 7]], 
      description: 'Build BST and get inorder traversal (sorted)' 
    }
  ],
  
  defaultParams: { 
    operations: [
      {op: 'insert', value: 4},
      {op: 'insert', value: 2},
      {op: 'insert', value: 6},
      {op: 'insert', value: 1},
      {op: 'search', value: 2}
    ]
  },
  paramControls: [
    { name: 'operations', type: 'array', label: 'BST Operations', default: [], description: 'Sequence of insert/search operations' }
  ],
  
  estimatedTimeMinutes: 25,
  prerequisites: ['Binary Trees', 'Recursion', 'Tree Traversals'],
  relatedAlgorithms: ['binaryTreeTraversal', 'avlTree', 'heapOperations']
};

export const treeAlgorithms = [
  binaryTreeTraversalAlgorithm,
  bstAlgorithm
];
