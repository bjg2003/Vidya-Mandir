const NAV = [
  { id: 'dashboard', icon: '◈', label: 'Dashboard', group: 'overview' },
  { id: 'students',  icon: '◉', label: 'Students',  group: 'manage' },
  { id: 'teachers',  icon: '◎', label: 'Teachers',  group: 'manage' },
  { id: 'classes',   icon: '▦', label: 'Classes',   group: 'manage' },
  { id: 'subjects',  icon: '✦', label: 'Subjects',  group: 'manage' },
]

function Sidebar({ activePage, onNavigate, onLogout, isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">V</div>
        {isOpen && (
          <div className="brand-text">
            <div className="brand-name">Vidya Mandir</div>
            <div className="brand-sub">SCHOOL MANAGEMENT</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {['overview', 'manage'].map(group => (
          <div key={group}>
            <div className="nav-section-label">{group}</div>
            {NAV.filter(n => n.group === group).map(item => (
              <button
                key={item.id}
                className={`nav-btn ${activePage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={!isOpen ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && <span className="nav-label">{item.label}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="nav-btn" onClick={onLogout} title={!isOpen ? 'Logout' : ''}>
          <span className="nav-icon">⇒</span>
          {isOpen && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
