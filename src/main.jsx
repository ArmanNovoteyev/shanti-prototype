import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ShantiSpaApp from './ShantiSpaApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShantiSpaApp />
  </StrictMode>,
)
