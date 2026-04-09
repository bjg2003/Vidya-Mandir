import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import DashboardHome from '../components/DashboardHome'
import StudentsPage from '../components/StudentsPage'
import TeachersPage from '../components/TeachersPage'
import ClassesPage from '../components/ClassesPage'
import SubjectsPage from '../components/SubjectsPage'
import AdminPage from '../components/AdminPage'
import './Dashboard.css'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  students:  'Students',
  teachers:  'Teachers',
  classes:   'Classes & Sections',
  subjects:  'Subjects',
  admin:     'My Profile',
}

function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage]   = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // ── Dark mode state ────────────────────────────────────────
  // Read saved preference from localStorage on first load
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('school_theme') === 'dark'
  })

  // Apply / remove dark class on <html> whenever darkMode changes
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.setAttribute('data-theme', 'dark')
      localStorage.setItem('school_theme', 'dark')
    } else {
      root.setAttribute('data-theme', 'light')
      localStorage.setItem('school_theme', 'light')
    }
  }, [darkMode])

  const toggleTheme = () => setDarkMode(prev => !prev)

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardHome onNavigate={setActivePage} />
      case 'students':  return <StudentsPage />
      case 'teachers':  return <TeachersPage />
      case 'classes':   return <ClassesPage />
      case 'subjects':  return <SubjectsPage />
      case 'admin':     return <AdminPage user={user} />
      default:          return <DashboardHome onNavigate={setActivePage} />
    }
  }

  return (
    <div className={`dashboard-root ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        darkMode={darkMode}
      />
      <div className="dashboard-main">
        <Topbar
          title={PAGE_TITLES[activePage]}
          user={user}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          onAdminClick={() => setActivePage('admin')}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
        />
        <div className="dashboard-content">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
