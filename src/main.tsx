import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactLenis from 'lenis/react'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ReactLenis root>
        <App />
      </ReactLenis>
    </ErrorBoundary>
  </StrictMode>,
)
