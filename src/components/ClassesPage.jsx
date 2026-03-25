import { useState, useEffect } from 'react'
import { api, CLASSES } from '../data/data'

const BADGE = ['badge-blue', 'badge-gold', 'badge-green', 'badge-purple', 'badge-gray']

function ClassesPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filterSec, setFilterSec] = useState('all')
  const [apiError, setApiError]   = useState('')

  useEffect(() => {
    api.getStudents()
      .then(setStudents)
      .catch(() => setApiError('Failed to load students. Is your backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const visibleStudents = students
    .filter(s => filterSec === 'all' || s.section === filterSec)
    .sort((a, b) => a.class - b.class || a.section.localeCompare(b.section))

  return (
    <div>
      {/* Section filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: 'var(--gray-600)', fontWeight: 500 }}>Show:</span>
        {['all', 'A', 'B'].map(s => (
          <button key={s} onClick={() => setFilterSec(s)}
            style={{
              padding: '7px 18px', borderRadius: 9, border: 'none',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
              background: filterSec === s ? 'var(--navy)' : 'var(--gray-100)',
              color:      filterSec === s ? '#fff'        : 'var(--gray-600)',
            }}>
            {s === 'all' ? 'All Sections' : `Section ${s}`}
          </button>
        ))}
      </div>

      {apiError && (
        <div style={{
          padding: '14px 18px', background: '#fee2e2', color: '#dc2626',
          borderRadius: 10, fontSize: 13, marginBottom: 20,
        }}>
          ⚠ {apiError}
        </div>
      )}

      {/* Class overview cards */}
      <div className="section-card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <div>
            <div className="section-title">Class Overview</div>
            <div className="section-sub">Student count per class and section</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>
            Total: <strong style={{ color: 'var(--navy)' }}>{visibleStudents.length}</strong> students
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loading-dots"><span /><span /><span /></div>
            <div className="empty-sub" style={{ marginTop: 12 }}>Loading…</div>
          </div>
        ) : (
          <div className="class-grid">
            {CLASSES.map(c => {
              const secA = students.filter(s => s.class === c && s.section === 'A').length
              const secB = students.filter(s => s.class === c && s.section === 'B').length
              return (
                <div key={c} className="class-card">
                  <div className="class-card-top">
                    <div className="class-num">{c}</div>
                    <div className="class-lbl">Standard</div>
                  </div>
                  <div className="class-body">
                    {(filterSec === 'all' || filterSec === 'A') && (
                      <div className="class-row">
                        <span className="class-sec-name">Section A</span>
                        <span className="class-count">{secA}</span>
                      </div>
                    )}
                    {(filterSec === 'all' || filterSec === 'B') && (
                      <div className="class-row">
                        <span className="class-sec-name">Section B</span>
                        <span className="class-count">{secB}</span>
                      </div>
                    )}
                    {filterSec === 'all' && (
                      <div className="class-total">
                        <span>Total</span>
                        <span>{secA + secB}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Student list table */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <div className="section-title">
              {filterSec === 'all' ? 'All Students' : `Section ${filterSec} Students`}
            </div>
            <div className="section-sub">{visibleStudents.length} students shown</div>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loading-dots"><span /><span /><span /></div>
          </div>
        ) : visibleStudents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▦</div>
            <div className="empty-title">No students in this section</div>
            <div className="empty-sub">Add students from the Students page</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Class</th><th>Section</th><th>Age</th></tr>
            </thead>
            <tbody>
              {visibleStudents.map(s => (
                <tr key={s.student_id}>
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

export default ClassesPage
