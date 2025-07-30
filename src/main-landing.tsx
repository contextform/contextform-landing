import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LandingOnly from './LandingOnly'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingOnly />
  </StrictMode>,
)