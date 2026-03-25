import { useState } from 'react'
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
      />
      <div className="dashboard-main">
        <Topbar
          title={PAGE_TITLES[activePage]}
          user={user}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          onAdminClick={() => setActivePage('admin')}
        />
        <div className="dashboard-content">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
