import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://slv-design-studio-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

api.interceptors.request.use(
  (config) => {
    // If Authorization header is already explicitly provided, respect it
    if (config.headers.Authorization) {
      return config
    }

    const adminToken = localStorage.getItem('slv_admin_token')
    const userToken = localStorage.getItem('slv_token')

    // Attach admin token ONLY for admin-specific endpoints (/admin/...)
    if (config.url.startsWith('/admin') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
    } else if (userToken) {
      // For all customer endpoints, attach customer userToken
      config.headers.Authorization = `Bearer ${userToken}`
    } else if (adminToken && !config.url.startsWith('/orders/my')) {
      // Fallback for admin actions on products/gallery if userToken is not present
      config.headers.Authorization = `Bearer ${adminToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isBlocked =
      error.response?.status === 403 &&
      (error.response?.data?.isBlocked || error.response?.data?.message?.toLowerCase().includes('blocked'))

    if (isBlocked) {
      // CRITICAL SECURITY ACTION: Clear local credentials & force redirect to login
      localStorage.removeItem('slv_token')
      localStorage.removeItem('slv_user')

      // Redirect immediately to clear session state
      if (!window.location.pathname.startsWith('/admin')) {
        window.location.href = '/?blocked=true'
      }
    } else if (error.response?.status === 401 && !error.config?.url?.includes('/auth/admin-login')) {
      if (error.config?.url?.startsWith('/admin')) {
        localStorage.removeItem('slv_admin_token')
        localStorage.removeItem('slv_admin')
      } else {
        localStorage.removeItem('slv_token')
        localStorage.removeItem('slv_user')
      }
    }
    return Promise.reject(error)
  }
)

export default api
