import React from 'react';
import { Layers, Navigation, Network, Zap, MapPin } from 'lucide-react';
import { Algorithm, VisualizationStrategy, ExecutionStrategy } from '../types';
import { delay } from '../utils';

/**
 * Graph Algorithms with Advanced Visualizations
 * Composition pattern for flexible graph representations
 */

// Graph visualization strategy
const createGraphVisualization = (
  setupFn: (rows: number, cols: number, params: any) => any[][],
  animateFn: (context: any, setGrid: any) => Promise<void>
): VisualizationStrategy => ({
  id: 'graph-visualization',
  name: 'Graph Visualization',
  description: 'Visualizes graph algorithms using adjacency matrix or grid representation',
  setup: setupFn,
  animate: animateFn,
  getStepCount: (params) => (params.nodes || 6) * (params.nodes || 6)
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

// 1. BREADTH-FIRST SEARCH (BFS)
export const bfsAlgorithm: Algorithm = {
  id: 'breadthFirstSearch',
  name: 'Breadth-First Search',
  category: { id: 'graph', name: 'Graph Algorithms', description: '', icon: React.createElement(Layers), color: 'purple', gradient: 'from-purple-500 to-pink-600' },
  difficulty: 'medium',
  icon: React.createElement(Network, { className: "h-6 w-6" }),
  tags: ['Graph', 'Traversal', 'Queue', 'Level Order'],
  
  visualization: createGraphVisualization(
    (rows, cols, params) => {
      const nodes = params?.nodes || 6;
      return Array(nodes).fill(null).map((_, i) => 
        Array(nodes).fill(null).map((_, j) => ({
          value: i === j ? 0 : (Math.random() > 0.7 ? 1 : 0),
          visited: false,
          highlighted: false,
          isPath: false,
          distance: i === 0 ? 0 : Infinity
        }))
      );
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const start = params.start as number || 0;
      const nodes = grid.length;
      const visited = Array(nodes).fill(false);
      const queue = [start];
      const distances = Array(nodes).fill(Infinity);
      distances[start] = 0;
      
      // Mark start node
      for (let j = 0; j < nodes; j++) {
        if (j === start) {
          grid[start][j] = { ...grid[start][j], highlighted: true, distance: 0 };
        }
      }
      setGrid([...grid]);
      await delay(context.speed);
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        visited[current] = true;
        
        // Highlight current node being processed
        for (let j = 0; j < nodes; j++) {
          grid[current][j] = { ...grid[current][j], visited: true };
        }
        setGrid([...grid]);
        await delay(context.speed);
        
        // Explore neighbors
        for (let neighbor = 0; neighbor < nodes; neighbor++) {
          if (grid[current][neighbor].value === 1 && !visited[neighbor] && distances[neighbor] === Infinity) {
            distances[neighbor] = distances[current] + 1;
            queue.push(neighbor);
            
            // Highlight edge and neighbor
            grid[current][neighbor] = { ...grid[current][neighbor], isPath: true };
            grid[neighbor][current] = { ...grid[neighbor][current], isPath: true };
            
            for (let j = 0; j < nodes; j++) {
              if (j === neighbor) {
                grid[neighbor][j] = { ...grid[neighbor][j], highlighted: true, distance: distances[neighbor] };
              }
            }
            setGrid([...grid]);
            await delay(context.speed);
          }
        }
        
        // Remove highlight from current
        for (let j = 0; j < nodes; j++) {
          if (j === current) {
            grid[current][j] = { ...grid[current][j], highlighted: false };
          }
        }
        setGrid([...grid]);
        await delay(context.speed / 2);
      }
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const { graph, start } = input;
  const n = graph.length;
  const visited = Array(n).fill(false);
  const result = [];
  const queue = [start];
  
  while (queue.length > 0) {
    const node = queue.shift();
    if (!visited[node]) {
      visited[node] = true;
      result.push(node);
      
      for (let i = 0; i < n; i++) {
        if (graph[node][i] === 1 && !visited[i]) {
          queue.push(i);
        }
      }
    }
  }
  
  return result;
}`)
  ],
  
  education: {
    overview: 'BFS explores a graph level by level, visiting all neighbors before moving to the next level. It guarantees the shortest path in unweighted graphs.',
    keyInsights: [
      'Uses a queue (FIFO) data structure for traversal',
      'Guarantees shortest path in unweighted graphs',
      'Explores nodes level by level from the source',
      'Time complexity is O(V + E) for adjacency list representation'
    ],
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
      explanation: 'V is vertices, E is edges. We visit each vertex and edge once'
    },
    spaceComplexity: {
      value: 'O(V)',
      explanation: 'Queue can store at most all vertices, plus visited array'
    },
    whenToUse: [
      'Finding shortest path in unweighted graphs',
      'Level-order traversal of trees',
      'Finding connected components',
      'Web crawling (exploring web pages level by level)'
    ],
    commonPitfalls: [
      'Using stack instead of queue (that would be DFS)',
      'Not marking nodes as visited when adding to queue',
      'Forgetting to handle disconnected graphs',
      'Not considering the starting node in the result'
    ],
    realWorldApplications: [
      {
        title: 'Social Network Analysis',
        description: 'Find degrees of separation between users',
        industry: 'Social Media'
      },
      {
        title: 'GPS Navigation',
        description: 'Find shortest route between locations',
        industry: 'Transportation'
      },
      {
        title: 'Network Broadcasting',
        description: 'Spread information through computer networks',
        industry: 'Telecommunications'
      }
    ]
  },
  
  testCases: [
    { 
      input: { 
        graph: [[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]], 
        start: 0 
      }, 
      expected: [0, 1, 2, 3], 
      description: 'BFS from node 0 in a 4-node graph' 
    },
    { 
      input: { 
        graph: [[0,1,0],[1,0,1],[0,1,0]], 
        start: 1 
      }, 
      expected: [1, 0, 2], 
      description: 'BFS from node 1 in a linear graph' 
    }
  ],
  
  defaultParams: { nodes: 6, start: 0 },
  paramControls: [
    { name: 'nodes', type: 'number', label: 'Number of Nodes', min: 3, max: 8, default: 6, description: 'Graph size' },
    { name: 'start', type: 'number', label: 'Start Node', min: 0, max: 7, default: 0, description: 'Starting vertex for BFS' }
  ],
  
  estimatedTimeMinutes: 20,
  prerequisites: ['Queue Data Structure', 'Graph Representation'],
  relatedAlgorithms: ['depthFirstSearch', 'dijkstra', 'shortestPath']
};

// 2. DEPTH-FIRST SEARCH (DFS)
export const dfsAlgorithm: Algorithm = {
  id: 'depthFirstSearch',
  name: 'Depth-First Search',
  category: { id: 'graph', name: 'Graph Algorithms', description: '', icon: React.createElement(Layers), color: 'purple', gradient: 'from-purple-500 to-pink-600' },
  difficulty: 'medium',
  icon: React.createElement(Zap, { className: "h-6 w-6" }),
  tags: ['Graph', 'Traversal', 'Stack', 'Recursion'],
  
  visualization: createGraphVisualization(
    (rows, cols, params) => {
      const nodes = params?.nodes || 6;
      return Array(nodes).fill(null).map((_, i) => 
        Array(nodes).fill(null).map((_, j) => ({
          value: i === j ? 0 : (Math.random() > 0.7 ? 1 : 0),
          visited: false,
          highlighted: false,
          isPath: false,
          order: -1
        }))
      );
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const start = params.start as number || 0;
      const nodes = grid.length;
      const visited = Array(nodes).fill(false);
      const stack = [start];
      let order = 0;
      
      while (stack.length > 0) {
        const current = stack.pop()!;
        
        if (!visited[current]) {
          visited[current] = true;
          
          // Highlight current node
          for (let j = 0; j < nodes; j++) {
            if (j === current) {
              grid[current][j] = { ...grid[current][j], highlighted: true, visited: true, order: order++ };
            }
          }
          setGrid([...grid]);
          await delay(context.speed);
          
          // Add unvisited neighbors to stack (in reverse order for left-to-right processing)
          for (let neighbor = nodes - 1; neighbor >= 0; neighbor--) {
            if (grid[current][neighbor].value === 1 && !visited[neighbor]) {
              stack.push(neighbor);
              
              // Highlight the edge
              grid[current][neighbor] = { ...grid[current][neighbor], isPath: true };
              grid[neighbor][current] = { ...grid[neighbor][current], isPath: true };
              setGrid([...grid]);
              await delay(context.speed / 2);
            }
          }
          
          // Remove highlight
          for (let j = 0; j < nodes; j++) {
            if (j === current) {
              grid[current][j] = { ...grid[current][j], highlighted: false };
            }
          }
          setGrid([...grid]);
          await delay(context.speed / 2);
        }
      }
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const { graph, start } = input;
  const n = graph.length;
  const visited = Array(n).fill(false);
  const result = [];
  
  function dfs(node) {
    visited[node] = true;
    result.push(node);
    
    for (let i = 0; i < n; i++) {
      if (graph[node][i] === 1 && !visited[i]) {
        dfs(i);
      }
    }
  }
  
  dfs(start);
  return result;
}`)
  ],
  
  education: {
    overview: 'DFS explores a graph by going as deep as possible before backtracking. It uses a stack (or recursion) to remember where to backtrack to.',
    keyInsights: [
      'Uses a stack (LIFO) or recursion for traversal',
      'Goes deep before exploring siblings',
      'Good for detecting cycles and finding paths',
      'Can be implemented recursively or iteratively'
    ],
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
      explanation: 'We visit each vertex and edge exactly once'
    },
    spaceComplexity: {
      value: 'O(V)',
      explanation: 'Stack space for recursion or explicit stack, plus visited array'
    },
    whenToUse: [
      'Detecting cycles in graphs',
      'Finding connected components',
      'Topological sorting',
      'Maze solving and pathfinding'
    ],
    commonPitfalls: [
      'Stack overflow with deep recursion',
      'Using queue instead of stack (that would be BFS)',
      'Not handling disconnected components',
      'Infinite recursion without visited check'
    ],
    realWorldApplications: [
      {
        title: 'Maze Solving',
        description: 'Find paths through mazes and labyrinths',
        industry: 'Gaming & Entertainment'
      },
      {
        title: 'Dependency Resolution',
        description: 'Resolve dependencies in package managers',
        industry: 'Software Development'
      },
      {
        title: 'Circuit Analysis',
        description: 'Analyze electrical circuits and connections',
        industry: 'Electronics Engineering'
      }
    ]
  },
  
  testCases: [
    { 
      input: { 
        graph: [[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]], 
        start: 0 
      }, 
      expected: [0, 1, 3, 2], 
      description: 'DFS from node 0 goes deep first' 
    },
    { 
      input: { 
        graph: [[0,1,0],[1,0,1],[0,1,0]], 
        start: 0 
      }, 
      expected: [0, 1, 2], 
      description: 'DFS in linear graph' 
    }
  ],
  
  defaultParams: { nodes: 6, start: 0 },
  paramControls: [
    { name: 'nodes', type: 'number', label: 'Number of Nodes', min: 3, max: 8, default: 6, description: 'Graph size' },
    { name: 'start', type: 'number', label: 'Start Node', min: 0, max: 7, default: 0, description: 'Starting vertex for DFS' }
  ],
  
  estimatedTimeMinutes: 20,
  prerequisites: ['Stack Data Structure', 'Recursion', 'Graph Representation'],
  relatedAlgorithms: ['breadthFirstSearch', 'topologicalSort', 'cycleDetection']
};

// 3. DIJKSTRA'S ALGORITHM
export const dijkstraAlgorithm: Algorithm = {
  id: 'dijkstra',
  name: "Dijkstra's Shortest Path",
  category: { id: 'graph', name: 'Graph Algorithms', description: '', icon: React.createElement(Layers), color: 'purple', gradient: 'from-purple-500 to-pink-600' },
  difficulty: 'hard',
  icon: React.createElement(Navigation, { className: "h-6 w-6" }),
  tags: ['Graph', 'Shortest Path', 'Greedy', 'Priority Queue'],
  
  visualization: createGraphVisualization(
    (rows, cols, params) => {
      const nodes = params?.nodes || 5;
      return Array(nodes).fill(null).map((_, i) => 
        Array(nodes).fill(null).map((_, j) => {
          if (i === j) return { value: 0, visited: false, highlighted: false, distance: i === 0 ? 0 : Infinity };
          return { 
            value: Math.random() > 0.6 ? Math.floor(Math.random() * 10) + 1 : 0, 
            visited: false, 
            highlighted: false, 
            distance: Infinity,
            isPath: false 
          };
        })
      );
    },
    async (context, setGrid) => {
      const { grid, params } = context;
      const start = params.start as number || 0;
      const nodes = grid.length;
      const distances = Array(nodes).fill(Infinity);
      const visited = Array(nodes).fill(false);
      const previous = Array(nodes).fill(null);
      distances[start] = 0;
      
      // Initialize distances in grid
      for (let i = 0; i < nodes; i++) {
        grid[i][i] = { ...grid[i][i], distance: distances[i] };
      }
      setGrid([...grid]);
      await delay(context.speed);
      
      for (let count = 0; count < nodes; count++) {
        // Find minimum distance unvisited vertex
        let u = -1;
        for (let v = 0; v < nodes; v++) {
          if (!visited[v] && (u === -1 || distances[v] < distances[u])) {
            u = v;
          }
        }
        
        if (u === -1 || distances[u] === Infinity) break;
        
        visited[u] = true;
        
        // Highlight current node
        grid[u][u] = { ...grid[u][u], highlighted: true, visited: true };
        setGrid([...grid]);
        await delay(context.speed);
        
        // Update distances to neighbors
        for (let v = 0; v < nodes; v++) {
          if (!visited[v] && grid[u][v].value > 0) {
            const newDist = distances[u] + grid[u][v].value;
            if (newDist < distances[v]) {
              distances[v] = newDist;
              previous[v] = u;
              
              // Highlight edge and update distance
              grid[u][v] = { ...grid[u][v], isPath: true };
              grid[v][v] = { ...grid[v][v], distance: newDist };
              setGrid([...grid]);
              await delay(context.speed / 2);
            }
          }
        }
        
        // Remove highlight
        grid[u][u] = { ...grid[u][u], highlighted: false };
        setGrid([...grid]);
        await delay(context.speed / 2);
      }
    }
  ),
  
  execution: [
    createJSExecution(`
function solve(input) {
  const { graph, start } = input;
  const n = graph.length;
  const distances = Array(n).fill(Infinity);
  const visited = Array(n).fill(false);
  distances[start] = 0;
  
  for (let count = 0; count < n - 1; count++) {
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!visited[v] && (u === -1 || distances[v] < distances[u])) {
        u = v;
      }
    }
    
    if (distances[u] === Infinity) break;
    visited[u] = true;
    
    for (let v = 0; v < n; v++) {
      if (!visited[v] && graph[u][v] > 0) {
        distances[v] = Math.min(distances[v], distances[u] + graph[u][v]);
      }
    }
  }
  
  return distances;
}`)
  ],
  
  education: {
    overview: "Dijkstra's algorithm finds the shortest paths from a source vertex to all other vertices in a weighted graph with non-negative weights.",
    keyInsights: [
      'Greedy approach: always pick the closest unvisited vertex',
      'Maintains shortest distances and updates them when better paths are found',
      'Cannot handle negative weights (use Bellman-Ford instead)',
      'Time complexity can be improved with priority queue to O(E log V)'
    ],
    timeComplexity: {
      best: 'O(V²)',
      average: 'O(V²)',
      worst: 'O(V²)',
      explanation: 'With adjacency matrix. Can be O(E log V) with priority queue'
    },
    spaceComplexity: {
      value: 'O(V)',
      explanation: 'Arrays for distances, visited status, and previous vertices'
    },
    whenToUse: [
      'Finding shortest paths in road networks',
      'Network routing protocols',
      'GPS navigation systems',
      'Any weighted graph shortest path problem'
    ],
    commonPitfalls: [
      'Using with negative weights (incorrect results)',
      'Not initializing distances properly',
      'Forgetting to mark vertices as visited',
      'Using wrong data structure (should use priority queue for efficiency)'
    ],
    realWorldApplications: [
      {
        title: 'GPS Navigation',
        description: 'Find shortest routes between locations',
        industry: 'Transportation'
      },
      {
        title: 'Network Routing',
        description: 'Route data packets through computer networks',
        industry: 'Telecommunications'
      },
      {
        title: 'Flight Planning',
        description: 'Find cheapest flight routes',
        industry: 'Aviation'
      }
    ]
  },
  
  testCases: [
    { 
      input: { 
        graph: [[0,4,0,0,0,0,0,8,0],[4,0,8,0,0,0,0,11,0],[0,8,0,7,0,4,0,0,2],[0,0,7,0,9,14,0,0,0],[0,0,0,9,0,10,0,0,0],[0,0,4,14,10,0,2,0,0],[0,0,0,0,0,2,0,1,6],[8,11,0,0,0,0,1,0,7],[0,0,2,0,0,0,6,7,0]], 
        start: 0 
      }, 
      expected: [0, 4, 12, 19, 21, 11, 9, 8, 14], 
      description: 'Shortest distances from vertex 0 in a 9-vertex graph' 
    }
  ],
  
  defaultParams: { nodes: 5, start: 0 },
  paramControls: [
    { name: 'nodes', type: 'number', label: 'Number of Nodes', min: 4, max: 7, default: 5, description: 'Graph size' },
    { name: 'start', type: 'number', label: 'Start Node', min: 0, max: 6, default: 0, description: 'Source vertex' }
  ],
  
  estimatedTimeMinutes: 30,
  prerequisites: ['Graph Theory', 'Greedy Algorithms', 'Priority Queue'],
  relatedAlgorithms: ['bellmanFord', 'floydWarshall', 'breadthFirstSearch']
};

export const graphAlgorithms = [
  bfsAlgorithm,
  dfsAlgorithm,
  dijkstraAlgorithm
];
