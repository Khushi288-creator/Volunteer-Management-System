import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { VolunteerAuthProvider } from './context/VolunteerAuthContext'
import './index.css'
import './App.css'
import './styles/Admin.css'
import './styles/Volunteer.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VolunteerAuthProvider>
          <App />
        </VolunteerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
