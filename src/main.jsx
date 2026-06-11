/**
 * Application entry point.
 *
 * Standard React 18 bootstrap: create a root on the #root div (from
 * index.html) and render the App component into it.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Tailwind + global theme — imported once here, applies app-wide

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode runs extra dev-only checks (double-invokes effects, warns on
  // unsafe patterns). It has zero effect on the production build.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
