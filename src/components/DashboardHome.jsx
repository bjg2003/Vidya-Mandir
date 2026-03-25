import { useState, useEffect } from 'react'
import { api, CLASSES } from '../data/data'

const BADGE = ['badge-blue', 'badge-gold', 'badge-green', 'badge-purple', 'badge-gray']

function DashboardHome({ onNavigate }) {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([api.getStudents(), api.getTeachers(), api.getSubjects()])
      .then(([s, t, sub]) => { setStudents(s); setTeachers(t); setSubjects(sub) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { id: 'students', icon: '◉', iconClass: 'navy', cardClass: 'c-navy', label: 'Total Students', value: students.length, sub: 'Across 5 classes',         page: 'students' },
    { id: 'teachers', icon: '◎', iconClass: 'gold', cardClass: 'c-gold', label: 'Total Teachers', value: teachers.length, sub: 'Active faculty',            page: 'teachers' },
    { id: 'classes',  icon: '▦', iconClass: 'green', cardClass: 'c-green', label: 'Total Classes', value: 10,             sub: 'Classes 1–5, Sections A & B', page: 'classes'  },
    { id: 'subjects', icon: '◈', iconClass: 'info',  cardClass: 'c-info',  label: 'Subjects Offered', value: subjects.length, sub: 'Core curriculum',       page: 'subjects' },
  ]

  return (
    <div>
      {/* Welcome */}
      <div className="welcome-banner">
        <h2 className="welcome-title">Welcome to Vidya Mandir 🎓</h2>
        <p className="welcome-sub">Here's a quick overview of your school today.</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {statCards.map(card => (
          <div key={card.id}
            className={`stat-card ${card.cardClass} stat-card-clickable`}
            onClick={() => onNavigate(card.page)}
            title={`Go to ${card.label}`}
          >
            <div className={`stat-icon ${card.iconClass}`}>{card.icon}</div>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">
              {loading ? <span style={{ fontSize: 24, color: 'var(--gray-200)' }}>—</span> : card.value}
            </div>
            <div className="stat-sub">{card.sub}</div>
            <div className="stat-card-arrow">→</div>
          </div>
        ))}
      </div>

      {/* Recent Students — full width */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <div className="section-title">Recent Students</div>
            <div className="section-sub">Latest additions to the school</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('students')}>
            View All →
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loading-dots"><span /><span /><span /></div>
            <div className="empty-sub" style={{ marginTop: 12 }}>Loading…</div>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◉</div>
            <div className="empty-title">No students yet</div>
            <div className="empty-sub">
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('students')}>
                Add your first student →
              </button>
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>#</th><th>Name</th><th>Class</th><th>Section</th><th>Age</th></tr>
            </thead>
            <tbody>
              {[...students].reverse().slice(0, 8).map(s => (
                <tr key={s.student_id}>
                  <td style={{ color: 'var(--gray-400)', fontSize: 12 }}>#{s.student_id}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>
                    <span className={`badge ${BADGE[(s.class - 1) % BADGE.length]}`}>
                      Class {s.class}
                    </span>
                  </td>
                  <td><span className="badge badge-gold">Section {s.section}</span></td>
                  <td>{s.age} yrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default DashboardHome
