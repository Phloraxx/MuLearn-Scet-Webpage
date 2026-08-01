import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { routeKeyForPath, routeModules } from './routeModules'

const root = document.getElementById('root')
const routeKey = routeKeyForPath(window.location.pathname)

routeModules[routeKey]().catch(() => null).finally(() => {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
