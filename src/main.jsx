import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import { PostHogProvider } from 'posthog-js/react'

inject()
injectSpeedInsights()

const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  persistence: 'memory',
  autocapture: false,
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={posthogOptions}
    >
      <App />
    </PostHogProvider>
  </React.StrictMode>
)
