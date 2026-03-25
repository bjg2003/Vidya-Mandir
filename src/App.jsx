import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import { getToken, getUser, saveToken, saveUser, removeToken, removeUser } from './data/data'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [checking, setChecking] = useState(true)

  // On load: restore session from localStorage
  useEffect(() => {
    const token = getToken()
    const user  = getUser()
    if (token && user) {
      setCurrentUser(user)
      setIsLoggedIn(true)
    }
    setChecking(false)
  }, [])

  const handleLogin = (user, token) => {
    saveToken(token)
    saveUser(user)
    setCurrentUser(user)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    removeToken()
    removeUser()
    setCurrentUser(null)
    setIsLoggedIn(false)
  }

  if (checking) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', fontFamily: 'sans-serif', color: '#94a3b8', fontSize: 14,
      }}>
        Loading...
      </div>
    )
  }

  return (
    <>
      {!isLoggedIn
        ? <LoginPage onLogin={handleLogin} />
        : <Dashboard user={currentUser} onLogout={handleLogout} />
      }
    </>
  )
}

export default App
