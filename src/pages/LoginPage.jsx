import { useState } from 'react'
import { authApi } from '../data/data'
import './LoginPage.css'

function LoginPage({ onLogin }) {
  const [tab, setTab] = useState('login')

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')

  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirm: '' })
  const [signupError, setSignupError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState(false)

  const [loading, setLoading] = useState(false)

  // ── Login: calls real backend ──────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)

    try {
      const res = await authApi.login(loginData.email, loginData.password)
      // res = { token, admin: { id, name, email } }
      onLogin(res.admin, res.token)
    } catch (err) {
      setLoginError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  // ── Signup: validates then shows success ───────────────
  // (In a real app you'd call POST /api/auth/register)
  const handleSignup = (e) => {
    e.preventDefault()
    setSignupError('')

    if (!signupData.name.trim())          return setSignupError('Name is required')
    if (!signupData.email.includes('@'))  return setSignupError('Enter a valid email')
    if (signupData.password.length < 6)  return setSignupError('Password must be at least 6 characters')
    if (signupData.password !== signupData.confirm) return setSignupError('Passwords do not match')

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSignupSuccess(true)
      setTimeout(() => {
        setTab('login')
        setSignupSuccess(false)
        setLoginData({ email: signupData.email, password: '' })
      }, 2000)
    }, 800)
  }

  return (
    <div className="auth-root">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="school-badge">Admin Portal</div>
          <h1 className="school-name">Vidya<br />Mandir</h1>
          <p className="school-tagline">School Management System</p>
          <div className="auth-features">
            {[
              { icon: '◉', text: 'Manage Students & Records' },
              { icon: '◎', text: 'Track Teachers & Subjects' },
              { icon: '▦', text: 'Classes 1–5, Sections A & B' },
              { icon: '◈', text: 'Full CRUD Dashboard' },
            ].map(f => (
              <div key={f.text} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-left-footer">© 2026 Vidya Mandir · All rights reserved</div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'login'  ? 'active' : ''}`} onClick={() => { setTab('login');  setLoginError('') }}>Login</button>
            <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setSignupError('') }}>Sign Up</button>
          </div>

          {/* Login Form */}
          {tab === 'login' && (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-header">
                <h2>Welcome back</h2>
                <p>Sign in to your admin account</p>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="admin@school.com"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  required />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter your password"
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  required />
              </div>

              {loginError && <div className="auth-error">{loginError}</div>}

              <div className="auth-hint">
                <span>Demo: </span>
                <code>admin@school.com</code> / <code>admin123</code>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Sign In →'}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {tab === 'signup' && (
            <form className="auth-form" onSubmit={handleSignup}>
              <div className="form-header">
                <h2>Create account</h2>
                <p>Register as a new admin</p>
              </div>

              {signupSuccess ? (
                <div className="auth-success">✓ Account created! Redirecting to login...</div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="e.g. Rakesh Kumar"
                      value={signupData.name}
                      onChange={e => setSignupData({ ...signupData, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="you@school.com"
                      value={signupData.email}
                      onChange={e => setSignupData({ ...signupData, email: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="Min. 6 characters"
                      value={signupData.password}
                      onChange={e => setSignupData({ ...signupData, password: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Re-enter password"
                      value={signupData.confirm}
                      onChange={e => setSignupData({ ...signupData, confirm: e.target.value })} required />
                  </div>
                  {signupError && <div className="auth-error">{signupError}</div>}
                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? <span className="spinner" /> : 'Create Account →'}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
