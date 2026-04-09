function Topbar({ title, user, onToggleSidebar, onAdminClick, darkMode, onToggleTheme }) {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AD'

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="toggle-btn" onClick={onToggleSidebar} title="Toggle sidebar">
          ☰
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">

        {/* ── Dark Mode Toggle ── */}
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle dark mode"
        >
          {/* Sun icon (shown in dark mode to switch to light) */}
          {darkMode ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1"  x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1"  y1="12" x2="3"  y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            /* Moon icon (shown in light mode to switch to dark) */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
          <span className="theme-toggle-label">
            {darkMode ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* ── Admin chip ── */}
        <button
          className="admin-chip"
          onClick={onAdminClick}
          title="View profile"
        >
          <div className="admin-avatar">{initials}</div>
          <span className="admin-name">{user?.name || 'Administrator'}</span>
        </button>

      </div>
    </header>
  )
}

export default Topbar
