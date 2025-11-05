import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@config/init'
import { AppProviders } from '@config/providers'
import { initSentry } from '@shared/lib/sentry'
// Styles
import './styles/index.css'

// Initialize Sentry as early as possible
initSentry()

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>
  )
}
