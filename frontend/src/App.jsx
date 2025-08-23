import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Proposals from './pages/Proposals'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Clients from './pages/Clients'
import Employees from './pages/Employees'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import { initializeDefaultData } from './utils/storage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Initialize default data
    initializeDefaultData()
    
    // Check if user is logged in (check localStorage or session)
    const token = localStorage.getItem('clientcore_token')
    const userData = localStorage.getItem('clientcore_user')
    
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
    // No automatic login - user must authenticate properly
  }, [])

  // Force Profile component to re-render when user changes
  useEffect(() => {
    if (user) {
      console.log('App: User effect triggered, user:', user)
      // This will force the Profile component to re-render with new user data
    }
  }, [user])

  // Handle redirect after authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('App: User just authenticated, ensuring redirect to dashboard')
      // The redirect will happen automatically through the Routes configuration
      // But we can also check if we're already on the dashboard
      const currentPath = window.location.pathname
      if (currentPath === '/' || currentPath === '/dashboard') {
        console.log('App: Already on dashboard or root, no redirect needed')
      } else {
        console.log('App: Redirecting from', currentPath, 'to dashboard')
        // Force a redirect by updating the URL
        window.history.replaceState(null, '', '/dashboard')
      }
    }
  }, [isAuthenticated, user])

  const login = (userData, token) => {
    console.log('App: Login function called with:', userData)
    
    // Clear any existing profile data from previous users
    localStorage.removeItem('clientcore_profile_data')
    localStorage.removeItem('clientcore_profile_picture')
    
    // Store user data and token
    localStorage.setItem('clientcore_token', token)
    localStorage.setItem('clientcore_user', JSON.stringify(userData))
    
    console.log('App: Stored user data in localStorage')
    
    // Update state - this will trigger re-render and redirect to dashboard
    setIsAuthenticated(true)
    setUser(userData)
    
    console.log('App: State updated - isAuthenticated:', true, 'user:', userData)
  }

  const logout = () => {
    localStorage.removeItem('clientcore_token')
    localStorage.removeItem('clientcore_user')
    localStorage.removeItem('clientcore_profile_data')
    localStorage.removeItem('clientcore_profile_picture')
    localStorage.removeItem('clientcore_notifications')
    localStorage.removeItem('clientcore_proposals')
    localStorage.removeItem('clientcore_projects')
    localStorage.removeItem('clientcore_tasks')
    localStorage.removeItem('clientcore_clients')
    localStorage.removeItem('clientcore_employees')
    setIsAuthenticated(false)
    setUser(null)
  }



  if (!isAuthenticated) {
    console.log('App: User not authenticated, showing Login component')
    return <Login onLogin={login} />
  }

  console.log('App: User authenticated, showing Layout with Routes. Current user:', user)
  return (
    <Layout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/profile" element={<Profile key={`${user?.id}-${user?.email}`} user={user} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App