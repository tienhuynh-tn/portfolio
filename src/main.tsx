import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { getMetadata } from './seo/metadata'
import './styles/global.css'
import './index.css'

const rootElement = document.getElementById('root')

if (rootElement) {
  const app = (
    <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </StrictMode>
  )
  const serverPath = rootElement.dataset.renderPath
  const matchesPage = serverPath !== undefined &&
    getMetadata(serverPath).canonical === getMetadata(window.location.pathname).canonical
  if (rootElement.dataset.prerendered === 'true' && matchesPage) hydrateRoot(rootElement, app)
  else {
    // Preview servers can fall back to homepage HTML for unknown URLs.
    // Discard that page's metadata before mounting the actual route.
    if (serverPath !== undefined) {
      document.querySelectorAll('title, meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]').forEach((node) => node.remove())
    }
    createRoot(rootElement).render(app)
  }
}
