import { useState, useEffect } from 'react'
import { api, SUBJECTS } from '../data/data'
import Toast from './Toast'

// ── Teacher Modal ──────────────────────────────────────────
function TeacherModal({ teacher, allSubjects, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    teacher
      ? {
          name:        teacher.name,
          email:       teacher.email,
          phone:       teacher.phone,
          subject_ids: teacher.subject_ids || [],
        }
      : { name: '', email: '', phone: '', subject_ids: [] }
  )
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleSubject = (id) => {
    setForm(f => {
      if (f.subject_ids.includes(id))
        return { ...f, subject_ids: f.subject_ids.filter(s => s !== id) }
      if (f.subject_ids.length >= 2) return f   // max 2
      return { ...f, subject_ids: [...f.subject_ids, id] }
    })
  }

  const handleSubmit = () => {
    if (!form.name.trim())  return setError('Name is required')
    if (!form.email.trim()) return setError('Email is required')
    if (!form.phone.trim()) return setError('Phone is required')
    if (!form.email.includes('@')) return setError('Enter a valid email')
    setError('')
    onSave(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span className="modal-head-title">{teacher ? 'Edit Teacher' : 'Add Teacher'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Dr. Rakesh Kumar" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="teacher@school.edu" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="9876543210" />
            </div>
          </div>

          {/* Subject selector */}
          <div className="form-group">
            <label className="form-label">
              Subjects&nbsp;
              <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(max 2)</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {allSubjects.map(sub => {
                const selected = form.subject_ids.includes(sub.subject_id)
                const disabled = !selected && form.subject_ids.length >= 2
                return (
                  <button key={sub.subject_id}
                    type="button"
                    onClick={() => !disabled && toggleSubject(sub.subject_id)}
                    style={{
                      padding: '6px 14px', borderRadius: 20, border: 'none',
                      fontSize: 12, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
                      fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                      opacity: disabled ? 0.4 : 1,
                      background: selected ? 'var(--navy)' : 'var(--gray-100)',
                      color:      selected ? '#fff'        : 'var(--gray-600)',
                    }}>
                    {sub.subject_name}
                  </button>
                )
              })}
            </div>
            {form.subject_ids.length >= 2 && (
              <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 6 }}>
                Maximum 2 subjects per teacher
              </p>
            )}
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: 8, fontSize: 13 }}>
              {error}
            </div>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : teacher ? 'Save Changes' : 'Add Teacher'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Teachers Page ──────────────────────────────────────────
function TeachersPage() {
  const [teachers, setTeachers]   = useState([])
  const [subjects, setSubjects]   = useState([])   // from /api/subjects
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [modal, setModal]         = useState(null)
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState(null)
  const [apiError, setApiError]   = useState('')

  const showToast = (message, type = 'success') => setToast({ message, type })

  const fetchAll = async () => {
    try {
      setApiError('')
      const [t, s] = await Promise.all([api.getTeachers(), api.getSubjects()])
      setTeachers(t)
      setSubjects(s)
    } catch (err) {
      setApiError('Failed to load data. Is your backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const filtered = teachers.filter(t =>
    !search ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async (form) => {
    setSaving(true)
    try {
      if (modal.teacher) {
        const updated = await api.updateTeacher(modal.teacher.teacher_id, form)
        setTeachers(prev =>
          prev.map(t => t.teacher_id === modal.teacher.teacher_id ? updated : t)
        )
        showToast('Teacher updated successfully')
      } else {
        const created = await api.addTeacher(form)
        setTeachers(prev => [...prev, created])
        showToast('Teacher added successfully')
      }
      setModal(null)
    } catch (err) {
      showToast(err.message || 'Failed to save teacher', 'danger')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (teacher) => {
    if (!confirm(`Delete "${teacher.name}"? This cannot be undone.`)) return
    try {
      await api.deleteTeacher(teacher.teacher_id)
      setTeachers(prev => prev.filter(t => t.teacher_id !== teacher.teacher_id))
      showToast('Teacher removed', 'danger')
    } catch (err) {
      showToast(err.message || 'Failed to delete teacher', 'danger')
    }
  }

  return (
    <div className="section-card">
      <div className="section-header">
        <div>
          <div className="section-title">Teachers</div>
          <div className="section-sub">{teachers.length} faculty members</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ teacher: null })}>
          + Add Teacher
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <span style={{ color: 'var(--gray-400)' }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…" />
        </div>
        {search && (
          <button className="btn btn-ghost btn-sm" onClick={() => setSearch('')}>Clear</button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--gray-400)' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {apiError && (
        <div style={{
          margin: 20, padding: '14px 18px', background: '#fee2e2',
          color: '#dc2626', borderRadius: 10, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>⚠ {apiError}</span>
          <button className="btn btn-ghost btn-sm" onClick={fetchAll}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <div className="loading-dots"><span /><span /><span /></div>
          <div className="empty-sub" style={{ marginTop: 12 }}>Loading teachers…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <div className="empty-title">No teachers found</div>
          <div className="empty-sub">
            {search ? 'Try a different search' : 'Add your first teacher using the button above'}
          </div>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Subjects</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.teacher_id}>
                <td style={{ color: 'var(--gray-400)', fontSize: 12 }}>#{t.teacher_id}</td>
                <td style={{ fontWeight: 500 }}>{t.name}</td>
                <td style={{ color: 'var(--info)', fontSize: 13 }}>{t.email}</td>
                <td style={{ fontSize: 13 }}>{t.phone}</td>
                <td>
                  <div className="subject-tags">
                    {(!t.subjects || t.subjects.length === 0)
                      ? <span style={{ color: 'var(--gray-400)', fontSize: 12 }}>None assigned</span>
                      : t.subjects.map(sub => (
                          <span key={sub} className="subject-tag">{sub}</span>
                        ))
                    }
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm"
                      onClick={() => setModal({ teacher: t })}>✎ Edit</button>
                    <button className="btn btn-danger-soft btn-sm"
                      onClick={() => handleDelete(t)}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal && (
        <TeacherModal
          teacher={modal.teacher}
          allSubjects={subjects}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}

export default TeachersPage
