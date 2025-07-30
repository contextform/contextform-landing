import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingOnly from './LandingOnly.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingOnly />
  </StrictMode>,
)
