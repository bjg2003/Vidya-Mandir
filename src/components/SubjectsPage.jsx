import { useState, useEffect } from 'react'
import { api } from '../data/data'
import Toast from './Toast'

const SUBJECT_META = {
  'Mathematics':    { bg: '#dbeafe', color: '#1d4ed8', icon: '∑' },
  'Science':        { bg: '#dcfce7', color: '#166534', icon: '⚗' },
  'English':        { bg: '#fef3c7', color: '#92400e', icon: 'A' },
  'Hindi':          { bg: '#ede9fe', color: '#5b21b6', icon: 'अ' },
  'Social Studies': { bg: '#fee2e2', color: '#991b1b', icon: '🌍' },
  'Computer':       { bg: '#f0fdf4', color: '#166534', icon: '⌨' },
}

function SubjectsPage() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [apiError, setApiError] = useState('')
  const [toast, setToast]       = useState(null)

  useEffect(() => {
    api.getSubjects()
      .then(setSubjects)
      .catch(() => setApiError('Failed to load subjects. Is your backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const assigned   = subjects.filter(s => s.teachers && s.teachers.length > 0).length
  const unassigned = subjects.length - assigned

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        <div className="stat-card c-navy">
          <div className="stat-icon navy">◈</div>
          <div className="stat-label">Total Subjects</div>
          <div className="stat-value">{subjects.length}</div>
          <div className="stat-sub">Core curriculum</div>
        </div>
        <div className="stat-card c-gold">
          <div className="stat-icon gold">◎</div>
          <div className="stat-label">Assigned</div>
          <div className="stat-value">{assigned}</div>
          <div className="stat-sub">With a teacher assigned</div>
        </div>
        <div className="stat-card c-green">
          <div className="stat-icon green" style={{ fontSize: 14 }}>⚠</div>
          <div className="stat-label">Unassigned</div>
          <div className="stat-value">{unassigned}</div>
          <div className="stat-sub">Need a teacher</div>
        </div>
      </div>

      {apiError && (
        <div style={{
          padding: '14px 18px', background: '#fee2e2', color: '#dc2626',
          borderRadius: 10, fontSize: 13, marginBottom: 20,
        }}>
          ⚠ {apiError}
        </div>
      )}

      {/* Subject cards */}
      {loading ? (
        <div className="empty-state">
          <div className="loading-dots"><span /><span /><span /></div>
          <div className="empty-sub" style={{ marginTop: 12 }}>Loading subjects…</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 28 }}>
            {subjects.map(sub => {
              const meta = SUBJECT_META[sub.subject_name] || { bg: '#f1f5f9', color: '#475569', icon: '📚' }
              return (
                <div key={sub.subject_id} className="section-card">
                  <div style={{ padding: '20px 22px' }}>
                    {/* Subject icon + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: meta.bg, color: meta.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, fontWeight: 700, flexShrink: 0,
                      }}>
                        {meta.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--navy)' }}>
                          {sub.subject_name}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                          {(!sub.teachers || sub.teachers.length === 0)
                            ? 'No teacher assigned'
                            : `${sub.teachers.length} teacher${sub.teachers.length > 1 ? 's' : ''}`
                          }
                        </div>
                      </div>
                    </div>

                    {/* Teacher list */}
                    {(!sub.teachers || sub.teachers.length === 0) ? (
                      <div style={{
                        background: '#fef2f2', color: '#dc2626', fontSize: 12,
                        padding: '8px 12px', borderRadius: 8, border: '1px dashed #fca5a5',
                      }}>
                        ⚠ No teacher assigned yet
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {sub.teachers.map(t => (
                          <div key={t.teacher_id} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: 'var(--gray-50)', borderRadius: 8,
                            padding: '8px 12px', border: '1px solid var(--gray-200)',
                          }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: '50%',
                              background: 'var(--navy)', flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, fontWeight: 700, color: 'var(--gold)',
                            }}>
                              {t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{t.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary table */}
          <div className="section-card">
            <div className="section-header">
              <div>
                <div className="section-title">Subject — Teacher Assignment</div>
                <div className="section-sub">Each teacher can teach a maximum of 2 subjects</div>
              </div>
            </div>
            <table>
              <thead>
                <tr><th>Subject</th><th>Assigned Teacher(s)</th><th>Status</th></tr>
              </thead>
              <tbody>
                {subjects.map(sub => {
                  const meta = SUBJECT_META[sub.subject_name] || { bg: '#f1f5f9', color: '#475569', icon: '📚' }
                  return (
                    <tr key={sub.subject_id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: meta.bg, color: meta.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, fontWeight: 700,
                          }}>
                            {meta.icon}
                          </div>
                          <span style={{ fontWeight: 500 }}>{sub.subject_name}</span>
                        </div>
                      </td>
                      <td>
                        {(!sub.teachers || sub.teachers.length === 0)
                          ? <span style={{ color: 'var(--gray-400)', fontSize: 13 }}>—</span>
                          : sub.teachers.map(t => t.name).join(', ')
                        }
                      </td>
                      <td>
                        {(!sub.teachers || sub.teachers.length === 0)
                          ? <span className="badge badge-red">Unassigned</span>
                          : <span className="badge badge-green">Assigned</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default SubjectsPage
