# Dynamic Programming Algorithm Visualizer

An interactive React-based web application for learning and understanding dynamic programming algorithms through step-by-step visualizations.

## Features

- **5 Classic DP Algorithms**: Unique Paths, Coin Change, Longest Increasing Subsequence, 0/1 Knapsack, and Minimum Path Sum
- **Interactive Visualizations**: Step-by-step animated execution with color-coded cells
- **Enhanced Multi-language Support**: 6 programming languages with comprehensive implementations
  - ✅ **JavaScript & TypeScript**: Fully executable with real testing
  - 📚 **Python, Java, Go, Ruby**: Educational display with proper syntax and documentation
- **Live Code Testing**: Built-in test cases with performance timing for executable languages
- **Improved Code Quality**: Enhanced comments, documentation, and error handling
- **Customizable Parameters**: Adjust algorithm inputs and animation settings
- **Modern UI**: Clean, responsive design using Tailwind CSS with better language indicators

## Installation

1. **Clone or download the project files**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check for code issues

## How to Use

1. **Select an Algorithm**: Choose from the dropdown in the left panel
2. **Adjust Parameters**: Modify algorithm inputs (coins, arrays, etc.)
3. **Configure Grid**: Set grid size and animation speed
4. **Start Visualization**: Click "Start Visualization" to see the algorithm in action
5. **View Code**: Click "Show Code" to see implementations
6. **Run Tests**: Click "Run Tests" to validate your code modifications

## Supported Algorithms

### 1. Unique Paths
- **Problem**: Find number of unique paths from top-left to bottom-right in a grid
- **Complexity**: Time O(m×n), Space O(m×n)
- **Use Case**: Robot path counting, combinatorics

### 2. Coin Change
- **Problem**: Find minimum coins needed to make a target amount
- **Complexity**: Time O(amount×coins), Space O(amount)
- **Use Case**: Currency exchange, optimization problems

### 3. Longest Increasing Subsequence
- **Problem**: Find length of the longest increasing subsequence
- **Complexity**: Time O(n²), Space O(n)
- **Use Case**: Data analysis, sequence optimization

### 4. 0/1 Knapsack
- **Problem**: Maximize value within weight capacity constraints
- **Complexity**: Time O(n×W), Space O(n×W)
- **Use Case**: Resource allocation, optimization

### 5. Minimum Path Sum
- **Problem**: Find minimum sum path from top-left to bottom-right
- **Complexity**: Time O(m×n), Space O(m×n)
- **Use Case**: Route optimization, cost minimization

## Multi-Language Support

### Executable Languages ✅
- **JavaScript**: Full execution with real-time testing and performance metrics
- **TypeScript**: Full execution with type checking (transpiled to JavaScript)

### Educational Languages 📚
- **Python**: Complete implementations with proper docstrings and Pythonic syntax
- **Java**: Object-oriented implementations with JavaDoc comments
- **Go**: Idiomatic Go code with proper error handling
- **Ruby**: Ruby-style implementations with proper documentation

### Language Features
- **Syntax Highlighting**: Clean, readable code display for all languages
- **Documentation**: Comprehensive comments and docstrings explaining algorithms
- **Consistent Structure**: All implementations follow the same logical structure
- **Educational Value**: Compare different programming paradigms and syntax styles

### Future Enhancements
- Server-side execution for Python, Java, Go, and Ruby
- WebAssembly support for compiled languages
- Interactive code editing with syntax validation
- Performance comparisons between languages

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Project Structure

```
├── src/
│   ├── App.tsx          # Main visualizer component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md           # This file
```

## Contributing

Feel free to contribute by:
- Adding new algorithms
- Implementing additional language support
- Improving the UI/UX
- Adding more test cases
- Optimizing performance

## License

This project is open source and available under the MIT License.