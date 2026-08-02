import { createSlice } from '@reduxjs/toolkit'

const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('slv_token')
    const user = localStorage.getItem('slv_user')
    return { token: token || null, user: user ? JSON.parse(user) : null }
  } catch {
    return { token: null, user: null }
  }
}

const { token, user } = getStoredAuth()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token,
    user,
    isAuthenticated: !!token,
    loading: false,
    showLoginModal: false,
    adminToken: localStorage.getItem('slv_admin_token') || null,
    admin: JSON.parse(localStorage.getItem('slv_admin') || 'null'),
    isAdminAuthenticated: !!localStorage.getItem('slv_admin_token'),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      state.showLoginModal = false
      localStorage.setItem('slv_token', action.payload.token)
      localStorage.setItem('slv_user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('slv_token')
      localStorage.removeItem('slv_user')
    },
    adminLoginSuccess: (state, action) => {
      state.adminToken = action.payload.token
      state.admin = action.payload.admin
      state.isAdminAuthenticated = true
      localStorage.setItem('slv_admin_token', action.payload.token)
      localStorage.setItem('slv_admin', JSON.stringify(action.payload.admin))
    },
    adminLogout: (state) => {
      state.adminToken = null
      state.admin = null
      state.isAdminAuthenticated = false
      localStorage.removeItem('slv_admin_token')
      localStorage.removeItem('slv_admin')
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('slv_user', JSON.stringify(state.user))
    },
    showLogin: (state) => { state.showLoginModal = true },
    hideLogin: (state) => { state.showLoginModal = false },
    setLoading: (state, action) => { state.loading = action.payload },
  },
})

export const { loginSuccess, logout, adminLoginSuccess, adminLogout, updateUser, showLogin, hideLogin, setLoading } = authSlice.actions
export default authSlice.reducer
