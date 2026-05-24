import { reactive } from 'vue'
import { api } from '../api/client.js'

const saved = localStorage.getItem('auth')
const parsed = saved ? JSON.parse(saved) : null

export const authStore = reactive({
  user: parsed?.user || null,
  token: parsed?.token || null,

  get isLoggedIn() {
    return !!this.token
  },

  async login(email, password) {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.user = data.user
    this.token = data.token
    localStorage.setItem('auth', JSON.stringify({ user: data.user, token: data.token }))
  },

  async register(username, email, password) {
    const data = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    })
    this.user = data.user
    this.token = data.token
    localStorage.setItem('auth', JSON.stringify({ user: data.user, token: data.token }))
  },

  logout() {
    this.user = null
    this.token = null
    localStorage.removeItem('auth')
  },

  async fetchMe() {
    if (!this.token) return
    try {
      this.user = await api('/auth/me')
      localStorage.setItem('auth', JSON.stringify({ user: this.user, token: this.token }))
    } catch {
      this.logout()
    }
  },
})
