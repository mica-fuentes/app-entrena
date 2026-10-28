import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './app.css'
import App from './App.jsx'
import { APP_NAME } from './brand'

document.title = `${APP_NAME} · prototipo`

// En pantallas grandes el teléfono (410 × 864) se escala para entrar entero en la ventana
function fit() {
  const w = window.innerWidth, h = window.innerHeight
  const k = w >= 520 ? Math.min(1, (h - 48) / 864, (w - 48) / 410) : 1
  document.documentElement.style.setProperty('--fit', String(Math.max(0.5, k)))
}
fit()
window.addEventListener('resize', fit)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
