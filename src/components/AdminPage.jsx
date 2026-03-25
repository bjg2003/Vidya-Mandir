import { useState } from 'react'
import { authApi } from '../data/data'
import Toast from './Toast'

function AdminPage({ user }) {
  const [tab, setTab] = useState('profile')
  const [toast, setToast] = useState(null)

  const [profile, setProfile] = useState({
    name:   user?.name  || 'Administrator',
    email:  user?.email || 'admin@school.com',
    phone:  '9876500000',
    role:   'Administrator',
    school: 'Vidya Mandir',
  })

  const [pwForm, setPwForm]   = useState({ current: '', newPw: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const showToast = (message, type = 'success') => setToast({ message, type })

  // ── Profile save (local only — no backend route needed) ──
  const handleProfileSave = (e) => {
    e.preventDefault()
    showToast('Profile updated successfully')
  }

  // ── Change Password → calls real backend ─────────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwError('')

    if (!pwForm.current)              return setPwError('Current password is required')
    if (pwForm.newPw.length < 6)      return setPwError('New password must be at least 6 characters')
    if (pwForm.newPw !== pwForm.confirm) return setPwError('Passwords do not match')

    setPwLoading(true)
    try {
      await authApi.changePassword(pwForm.current, pwForm.newPw)
      showToast('Password changed successfully')
      setPwForm({ current: '', newPw: '', confirm: '' })
    } catch (err) {
      setPwError(err.message || 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  // Password strength
  const calcStrength = (pw) =>
    (pw.length >= 6 ? 1 : 0) + (pw.length >= 10 ? 1 : 0) +
    (/\d/.test(pw) ? 1 : 0) + (/[!@#$%^&*]/.test(pw) ? 1 : 0)
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e']
  const strengthLabels = ['', 'Weak', 'Medium', 'Good', 'Strong']
  const strength = calcStrength(pwForm.newPw)

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="section-card" style={{ marginBottom: 24, overflow: 'visible' }}>

        {/* Profile Hero */}
        <div style={{
          background: 'var(--navy)', padding: '32px 28px',
          display: 'flex', alignItems: 'center', gap: 22,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 700, color: 'var(--navy)', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#fff', marginBottom: 4 }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
              {profile.email}
            </div>
            <span style={{
              background: 'rgba(240,165,0,0.18)', color: 'var(--gold)',
              fontSize: 11, fontWeight: 600, letterSpacing: '1px',
              padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase',
            }}>
              {profile.role}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)' }}>
          {[
            { id: 'profile',  label: '👤 Edit Profile' },
            { id: 'password', label: '🔒 Change Password' },
            { id: 'info',     label: 'ℹ School Info' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setPwError('') }}
              style={{
                flex: 1, padding: '14px', fontSize: 13,
                fontWeight: tab === t.id ? 500 : 400,
                fontFamily: 'DM Sans, sans-serif', background: 'none',
                border: 'none', cursor: 'pointer',
                color: tab === t.id ? 'var(--navy)' : 'var(--gray-400)',
                borderBottom: tab === t.id ? '2px solid var(--navy)' : '2px solid transparent',
                transition: 'all 0.15s', marginBottom: -1,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Profile */}
        {tab === 'profile' && (
          <form onSubmit={handleProfileSave} style={{ padding: '26px 28px' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <input className="form-input" value={profile.role} disabled
                  style={{ background: 'var(--gray-50)', color: 'var(--gray-400)' }} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" value={profile.email}
                  onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">School Name</label>
              <input className="form-input" value={profile.school}
                onChange={e => setProfile(p => ({ ...p, school: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary">Save Profile</button>
          </form>
        )}

        {/* Tab: Change Password (real API) */}
        {tab === 'password' && (
          <form onSubmit={handlePasswordChange} style={{ padding: '26px 28px' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password"
                placeholder="Enter current password"
                value={pwForm.current}
                onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password"
                placeholder="Min. 6 characters"
                value={pwForm.newPw}
                onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))} />
            </div>

            {/* Strength bar */}
            {pwForm.newPw && (
              <div style={{ marginTop: -8, marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 99,
                      background: i <= strength ? strengthColors[strength - 1] : 'var(--gray-200)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: strengthColors[strength - 1] || 'var(--gray-400)' }}>
                  {strengthLabels[strength] || 'Too short'}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password"
                placeholder="Re-enter new password"
                value={pwForm.confirm}
                onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
            </div>

            {pwError && (
              <div style={{
                background: '#fee2e2', color: '#dc2626',
                borderLeft: '3px solid #dc2626',
                fontSize: 13, padding: '10px 14px',
                borderRadius: 8, marginBottom: 16,
              }}>
                {pwError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={pwLoading}>
              {pwLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}

        {/* Tab: School Info */}
        {tab === 'info' && (
          <div style={{ padding: '26px 28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'School Name',    value: 'Vidya Mandir' },
                { label: 'Academic Year',  value: '2026–2027' },
                { label: 'Total Classes',  value: '10 (Class 1–5, Sec A & B)' },
                { label: 'Total Subjects', value: '6 Core Subjects' },
                { label: 'Backend',        value: 'Node.js + Express' },
                { label: 'Database',       value: 'MySQL' },
                { label: 'Auth',           value: 'JWT (24h expiry)' },
                { label: 'Last Login',     value: new Date().toLocaleString('en-IN') },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                  borderRadius: 10, padding: '14px 16px',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--navy)' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-600)', marginBottom: 10 }}>
              Admin Permissions
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Add Students','Edit Students','Delete Students','Add Teachers','Edit Teachers','Delete Teachers','View Reports','Manage Subjects'].map(p => (
                <span key={p} style={{
                  background: '#dcfce7', color: '#166534',
                  fontSize: 12, padding: '5px 12px', borderRadius: 20, fontWeight: 500,
                }}>
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AdminPage
