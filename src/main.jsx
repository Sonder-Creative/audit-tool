import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './theme/ThemeProvider.jsx'
import './index.css'

// Apply saved theme as early as possible to avoid a flash of the wrong mode.
try {
  const saved = localStorage.getItem('sonder-theme')
  if (saved === 'dark') document.documentElement.classList.add('dark')
} catch (_) {
  /* localStorage unavailable — fall back to light */
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
