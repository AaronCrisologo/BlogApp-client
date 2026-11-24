import axios from 'axios'
import { ref } from 'vue'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// The API expects a Bearer token on every protected route.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Login returns { access, user }, so the user comes straight from the response.
// It is also kept in localStorage so a refresh does not log the user out.
export const token = ref(localStorage.getItem('token') || '')
export const currentUser = ref(JSON.parse(localStorage.getItem('user') || 'null'))

export function setSession(access, user) {
  token.value = access
  currentUser.value = user
  localStorage.setItem('token', access)
  localStorage.setItem('user', JSON.stringify(user))
}

export function clearSession() {
  token.value = ''
  currentUser.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// True when the logged-in user may edit or delete this post.
export function canManage(post) {
  if (!currentUser.value || !post) return false
  if (currentUser.value.isAdmin === true) return true
  return String(post.author?._id) === String(currentUser.value._id)
}

// True when the logged-in user owns the post (used to pick the right endpoint).
export function isOwner(post) {
  if (!currentUser.value || !post) return false
  return String(post.author?._id) === String(currentUser.value._id)
}

// Turns an axios / network failure into one readable line.
export function apiError(err) {
  const data = err?.response?.data
  if (data?.error?.message) return data.error.message
  if (data?.message) return data.message
  if (data) return JSON.stringify(data)
  return err?.message || 'Something went wrong'
}

// "2026-11-23T05:38:44.581Z" -> "Nov 23, 2026"
export function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default api