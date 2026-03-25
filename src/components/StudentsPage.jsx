import { useState, useEffect } from 'react'
import { api, CLASSES, SECTIONS } from '../data/data'
import Toast from './Toast'

const BADGE = ['badge-blue', 'badge-gold', 'badge-green', 'badge-purple', 'badge-gray']

// ── Student Modal ──────────────────────────────────────────
function StudentModal({ student, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    student
      ? { name: student.name, class: student.class, section: student.section, age: student.age }
      : { name: '', class: 1, section: 'A', age: '' }
  )
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.name.trim()) return setError('Name is required')
    if (!form.age || form.age < 4 || form.age > 18) return setError('Age must be between 4 and 18')
    setError('')
    onSave(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span className="modal-head-title">{student ? 'Edit Student' : 'Add Student'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Aarav Sharma" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Class</label>
              <select className="form-select" value={form.class}
                onChange={e => set('class', parseInt(e.target.value))}>
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Section</label>
              <select className="form-select" value={form.section}
                onChange={e => set('section', e.target.value)}>
                {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Age</label>
            <input className="form-input" type="number" min="4" max="18"
              value={form.age}
              onChange={e => set('age', parseInt(e.target.value))}
              placeholder="e.g. 9" />
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
            {saving ? 'Saving...' : student ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Students Page ──────────────────────────────────────────
function StudentsPage() {
  const [students, setStudents]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filterClass, setFClass]  = useState('')
  const [filterSec, setFSec]      = useState('')
  const [modal, setModal]         = useState(null)
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState(null)
  const [apiError, setApiError]   = useState('')

  const showToast = (message, type = 'success') => setToast({ message, type })

  // ── Fetch all students from backend ─────────────────────
  const fetchStudents = async () => {
    try {
      setApiError('')
      const data = await api.getStudents()
      setStudents(data)
    } catch (err) {
      setApiError('Failed to load students. Is your backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  // ── Filter logic ─────────────────────────────────────────
  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    return (
      (!q || s.name.toLowerCase().includes(q)) &&
      (!filterClass || s.class === parseInt(filterClass)) &&
      (!filterSec   || s.section === filterSec)
    )
  })

  // ── Add or Edit ──────────────────────────────────────────
  const handleSave = async (form) => {
    setSaving(true)
    try {
      if (modal.student) {
        // Edit: PUT /api/students/:id
        const updated = await api.updateStudent(modal.student.student_id, form)
        setStudents(prev =>
          prev.map(s => s.student_id === modal.student.student_id ? updated : s)
        )
        showToast('Student updated successfully')
      } else {
        // Add: POST /api/students
        const created = await api.addStudent(form)
        setStudents(prev => [...prev, created])
        showToast('Student added successfully')
      }
      setModal(null)
    } catch (err) {
      showToast(err.message || 'Failed to save student', 'danger')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ───────────────────────────────────────────────
  const handleDelete = async (student) => {
    if (!confirm(`Delete "${student.name}"? This cannot be undone.`)) return
    try {
      await api.deleteStudent(student.student_id)
      setStudents(prev => prev.filter(s => s.student_id !== student.student_id))
      showToast('Student deleted', 'danger')
    } catch (err) {
      showToast(err.message || 'Failed to delete student', 'danger')
    }
  }

  const clearFilters = () => { setSearch(''); setFClass(''); setFSec('') }
  const hasFilters   = search || filterClass || filterSec

  return (
    <div className="section-card">
      {/* Header */}
      <div className="section-header">
        <div>
          <div className="section-title">Students</div>
          <div className="section-sub">{students.length} total enrolled</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ student: null })}>
          + Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrap">
          <span style={{ color: 'var(--gray-400)' }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name…" />
        </div>
        <select className="filter-select" value={filterClass}
          onChange={e => setFClass(e.target.value)}>
          <option value="">All Classes</option>
          {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
        </select>
        <select className="filter-select" value={filterSec}
          onChange={e => setFSec(e.target.value)}>
          <option value="">All Sections</option>
          {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
        </select>
        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear</button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--gray-400)' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* API Error */}
      {apiError && (
        <div style={{
          margin: 20, padding: '14px 18px', background: '#fee2e2',
          color: '#dc2626', borderRadius: 10, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>⚠ {apiError}</span>
          <button className="btn btn-ghost btn-sm" onClick={fetchStudents}>Retry</button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="empty-state">
          <div className="loading-dots">
            <span /><span /><span />
          </div>
          <div className="empty-sub" style={{ marginTop: 12 }}>Loading students…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◉</div>
          <div className="empty-title">No students found</div>
          <div className="empty-sub">
            {hasFilters ? 'Try adjusting your filters' : 'Add your first student using the button above'}
          </div>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Class</th><th>Section</th><th>Age</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
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
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm"
                      onClick={() => setModal({ student: s })}>
                      ✎ Edit
                    </button>
                    <button className="btn btn-danger-soft btn-sm"
                      onClick={() => handleDelete(s)}>
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal && (
        <StudentModal
          student={modal.student}
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

export default StudentsPage
