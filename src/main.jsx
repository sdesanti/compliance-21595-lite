import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  document.getElementById('root').innerHTML =
    '<div style="font-family:monospace;padding:32px;color:#c0392b">Falta VITE_CLERK_PUBLISHABLE_KEY en .env.local<br>Reinicia el servidor tras agregar la key.</div>'
  throw new Error('Falta VITE_CLERK_PUBLISHABLE_KEY en .env.local')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
)
