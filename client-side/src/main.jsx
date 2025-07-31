import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DonationProvider } from './DonationContext';


createRoot(document.getElementById('root')).render(
  

<DonationProvider>
  <App />
</DonationProvider>

)
