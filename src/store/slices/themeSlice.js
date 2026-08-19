import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem('slv_theme')
    if (stored === 'dark') return 'dark'
    if (stored === 'light') return 'light'
  } catch (e) {
    // fallback
  }
  // Default to light mode for all new visitors
  return 'light'
}

const initialMode = getInitialTheme()
if (typeof document !== 'undefined') {
  document.documentElement.classList.toggle('dark', initialMode === 'dark')
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: initialMode,
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem('slv_theme', state.mode)
      } catch (e) {}
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', state.mode === 'dark')
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload === 'dark' ? 'dark' : 'light'
      try {
        localStorage.setItem('slv_theme', state.mode)
      } catch (e) {}
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', state.mode === 'dark')
      }
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer

