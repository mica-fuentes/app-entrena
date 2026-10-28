import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './app.css'
import App from './App.jsx'
import { APP_NAME } from './brand'

document.title = `${APP_NAME} · prototipo`

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
