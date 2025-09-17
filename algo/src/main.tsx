import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import UniquePathsVisualization from './pages/UniquePathsVisualization.tsx'
import MultiLangUniquePaths from './pages/MultiLangUniquePaths.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/unique-paths-visualization" element={<UniquePathsVisualization />} />
        <Route path="/unique-paths-multilang" element={<MultiLangUniquePaths />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
