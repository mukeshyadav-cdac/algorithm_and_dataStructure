import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Application entry point following Single Responsibility
// Only responsible for initializing and rendering the React app

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
