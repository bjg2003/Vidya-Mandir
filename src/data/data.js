// ── API helper — talks to your real Node.js backend ──────────
const BASE_URL = 'http://localhost:3000/api'

// ── Token helpers ─────────────────────────────────────────
export const saveToken   = (token) => localStorage.setItem('school_token', token)
export const getToken    = ()      => localStorage.getItem('school_token')
export const removeToken = ()      => localStorage.removeItem('school_token')
export const saveUser    = (user)  => localStorage.setItem('school_user', JSON.stringify(user))
export const getUser     = ()      => JSON.parse(localStorage.getItem('school_user') || 'null')
export const removeUser  = ()      => localStorage.removeItem('school_user')

// ── Core fetch wrapper ─────────────────────────────────────
async function request(endpoint, method = 'GET', body = null) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  const res  = await fetch(`${BASE_URL}${endpoint}`, options)
  const data = await res.json()

  if (res.status === 401) {
    removeToken(); removeUser()
    window.location.reload()
    return
  }
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

// ── Auth API ───────────────────────────────────────────────
export const authApi = {
  login:          (email, password)              => request('/auth/login', 'POST', { email, password }),
  changePassword: (currentPassword, newPassword) => request('/auth/change-password', 'POST', { currentPassword, newPassword }),
  getMe:          ()                             => request('/auth/me'),
}

// ── Students + Teachers + Subjects API ────────────────────
export const api = {
  getStudents:   ()         => request('/students'),
  addStudent:    (data)     => request('/students', 'POST', data),
  updateStudent: (id, data) => request(`/students/${id}`, 'PUT', data),
  deleteStudent: (id)       => request(`/students/${id}`, 'DELETE'),

  getTeachers:   ()         => request('/teachers'),
  addTeacher:    (data)     => request('/teachers', 'POST', data),
  updateTeacher: (id, data) => request(`/teachers/${id}`, 'PUT', data),
  deleteTeacher: (id)       => request(`/teachers/${id}`, 'DELETE'),

  getSubjects:   ()         => request('/subjects'),
}

// ── Constants ──────────────────────────────────────────────
export const CLASSES  = [1, 2, 3, 4, 5]
export const SECTIONS = ['A', 'B']
export const SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer']
