function Topbar({ title, user, onToggleSidebar, onAdminClick }) {
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
        {/* Clickable admin chip → goes to Admin Profile page */}
        <button
          className="admin-chip"
          onClick={onAdminClick}
          title="View profile"
          style={{
            background: 'var(--gray-100)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 9,
            borderRadius: 24, padding: '5px 14px 5px 5px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-200)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--gray-100)'}
        >
          <div className="admin-avatar">{initials}</div>
          <span className="admin-name">{user?.name || 'Administrator'}</span>
        </button>
      </div>
    </header>
  )
}

export default Topbar
