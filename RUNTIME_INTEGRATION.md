# Runtime Integration Guide 🚀

The Dynamic Programming Algorithm Visualizer now supports **real code execution** in multiple languages through runtime integrations! Here's how to enable each language:

## 🐍 **Python - Pyodide Integration**

### What it is
- **Pyodide** brings the full Python scientific stack to the browser
- Real Python execution with NumPy, SciPy, and more
- Zero server setup required

### How to Enable

#### Option 1: CDN (Quickest)
Add to your `index.html`:
```html
<script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></script>
```

#### Option 2: NPM Installation  
```bash
npm install pyodide
```

Then in your app:
```javascript
import { loadPyodide } from 'pyodide';
window.loadPyodide = loadPyodide;
```

### Features When Enabled ✅
- ✅ **Real Python execution** with full error reporting
- ✅ **Performance metrics** and timing
- ✅ **Scientific libraries** (NumPy, etc.)
- ✅ **Interactive debugging** in browser console

---

## 💎 **Ruby - Opal.js Integration**

### What it is
- **Opal.js** compiles Ruby to JavaScript
- Elegant Ruby syntax running in the browser
- Access to Ruby's powerful features

### How to Enable

#### CDN Setup
Add to your `index.html`:
```html
<script src="https://cdn.opalrb.com/opal/current/opal.min.js"></script>
<script src="https://cdn.opalrb.com/opal/current/native.min.js"></script>
```

#### NPM Installation
```bash
npm install opal-runtime
```

### Features When Enabled ✅
- ✅ **Real Ruby execution** with blocks and iterators
- ✅ **Ruby idioms** like `each`, `map`, `select`
- ✅ **Object-oriented features** 
- ✅ **Error handling** with Ruby stack traces

---

## 🚀 **Go - TinyGo WASM Integration**

### What it is
- **TinyGo** compiles Go to WebAssembly
- Near-native performance in the browser
- Full Go language features

### How to Enable

#### Step 1: Install TinyGo
```bash
# macOS
brew tap tinygo-org/tools
brew install tinygo

# Linux/Windows: https://tinygo.org/getting-started/install/
```

#### Step 2: Compile Algorithms to WASM
```bash
# Create algorithm implementations
mkdir public/wasm

# Compile each algorithm
tinygo build -o public/wasm/uniquePaths.wasm -target wasm ./go/uniquePaths.go
tinygo build -o public/wasm/coinChange.wasm -target wasm ./go/coinChange.go
```

#### Step 3: Add WASM Runtime
Add to your `index.html`:
```html
<script src="https://cdn.jsdelivr.net/gh/tinygo-org/tinygo@v0.30.0/targets/wasm_exec.js"></script>
```

#### Go Algorithm Template
```go
package main

//go:export uniquePaths
func uniquePaths(m, n int32) int32 {
    dp := make([][]int32, m)
    for i := range dp {
        dp[i] = make([]int32, n)
    }
    
    // Initialize first row and column
    for i := int32(0); i < m; i++ {
        dp[i][0] = 1
    }
    for j := int32(0); j < n; j++ {
        dp[0][j] = 1
    }
    
    // Fill DP table
    for i := int32(1); i < m; i++ {
        for j := int32(1); j < n; j++ {
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
        }
    }
    
    return dp[m-1][n-1]
}

func main() {} // Required for TinyGo
```

### Features When Enabled ✅
- ✅ **Near-native performance** through WebAssembly
- ✅ **Full Go language** features and syntax
- ✅ **Memory safety** and garbage collection
- ✅ **Concurrent programming** with goroutines

---

## ⚡ **C# - Blazor WASM Integration**

### What it is
- **Blazor WebAssembly** runs .NET in the browser
- Full C# language features and .NET libraries
- Strong typing and excellent tooling

### How to Enable

#### Step 1: Create Blazor WASM Project
```bash
dotnet new blazorwasm -n AlgorithmVisualizer.Algorithms
cd AlgorithmVisualizer.Algorithms
```

#### Step 2: Create Algorithm Service
```csharp
using Microsoft.JSInterop;

public static class AlgorithmService
{
    [JSInvokable]
    public static int UniquePaths(int m, int n)
    {
        var dp = new int[m, n];
        
        // Initialize first row and column
        for (int i = 0; i < m; i++) dp[i, 0] = 1;
        for (int j = 0; j < n; j++) dp[0, j] = 1;
        
        // Fill DP table
        for (int i = 1; i < m; i++)
        {
            for (int j = 1; j < n; j++)
            {
                dp[i, j] = dp[i-1, j] + dp[i, j-1];
            }
        }
        
        return dp[m-1, n-1];
    }
}
```

#### Step 3: Build and Integrate
```bash
# Build the project
dotnet publish -c Release

# Copy files to your web app
cp bin/Release/net8.0/publish/wwwroot/_framework/* public/_framework/
```

#### Step 4: Initialize Runtime
Add to your `index.html`:
```html
<script src="_framework/blazor.webassembly.js"></script>
<script>
  window.getDotnetRuntime = async () => {
    await Blazor.start();
    return window.DotNet;
  };
</script>
```

### Features When Enabled ✅
- ✅ **Full .NET ecosystem** and libraries
- ✅ **Strong typing** and compile-time checking
- ✅ **LINQ** and advanced data processing
- ✅ **Excellent debugging** with browser dev tools

---

## 🎯 **Quick Setup Guide**

### For Development (All Languages)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Algorithm Visualizer</title>
</head>
<body>
    <div id="root"></div>
    
    <!-- Python Support -->
    <script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></script>
    
    <!-- Ruby Support -->
    <script src="https://cdn.opalrb.com/opal/current/opal.min.js"></script>
    
    <!-- Go WASM Support -->
    <script src="https://cdn.jsdelivr.net/gh/tinygo-org/tinygo@v0.30.0/targets/wasm_exec.js"></script>
    
    <!-- C# Blazor Support -->
    <script src="_framework/blazor.webassembly.js"></script>
    
    <!-- Your React app -->
    <script src="/src/main.tsx"></script>
</body>
</html>
```

### Runtime Status Component
The app includes a **Runtime Status** component that shows:
- ✅ Which languages are **executable**
- 📚 Which languages are **simulated** (display-only)
- 🔧 **Setup instructions** for each language
- 🔄 **Refresh** button to re-detect runtimes

---

## 🏗️ **Architecture Benefits**

### Extensible Design
- **Factory Pattern** automatically detects available runtimes
- **Strategy Pattern** switches between executable and simulated runners
- **Template Method** provides consistent test execution workflow

### Runtime Detection
```typescript
// Automatic runtime detection
const factory = RuntimeTestRunnerFactory.getInstance();
const status = factory.getRuntimeStatus();

// Check what's available
console.table(status);
// JavaScript ✅ Executable
// Python    ⚠️  Runtime Missing  
// Ruby      📚 Display Only
// Go        ✅ Executable
// C#        📚 Display Only
```

### Adding New Languages
```typescript
// Easy to extend with new runtimes
factory.registerLanguage('Rust', 'executable', wasmRunnerFactory);
```

---

## 🚦 **Language Status**

| Language   | Status | Runtime | Performance | Setup |
|------------|--------|---------|-------------|--------|
| JavaScript | ✅ Ready | Native | Fast | None |
| TypeScript | ✅ Ready | Transpiled | Fast | None |
| Python     | 🔄 Optional | Pyodide | Medium | 1 script tag |
| Ruby       | 🔄 Optional | Opal.js | Medium | 1 script tag |
| Go         | 🔄 Optional | TinyGo WASM | Very Fast | Compile step |
| C#         | 🔄 Optional | Blazor WASM | Fast | Build step |
| Java       | 📚 Display Only | - | - | Not implemented |

---

## 📚 **Learning Benefits**

### For Students
- **Compare syntax** across multiple languages
- **See performance differences** between interpreted and compiled
- **Experience different paradigms** (functional, OOP, procedural)
- **Learn best practices** for each language

### For Educators  
- **Demonstrate concepts** in students' preferred languages
- **Show language evolution** and design decisions
- **Compare algorithm implementations** side by side
- **Provide interactive examples** that actually execute

---

## 🎉 **Getting Started**

1. **Choose your languages**: Start with Python (easiest setup)
2. **Add runtime scripts**: Copy the CDN links to your HTML
3. **Test the integration**: Check the Runtime Status component
4. **Write algorithms**: Use the provided templates
5. **Enjoy real execution**: See your code actually run in the browser!

The beauty of this architecture is that languages gracefully fall back to **display-only mode** if runtimes aren't available, so your app always works regardless of setup! 🎯
