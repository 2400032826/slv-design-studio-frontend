import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../store/slices/themeSlice'

export default function DarkModeToggle() {
  const dispatch = useDispatch()
  const { mode } = useSelector((state) => state.theme)
  const isDark = mode === 'dark'

  return (
    <motion.button
      onClick={() => dispatch(toggleTheme())}
      className="relative w-14 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
      style={{ backgroundColor: isDark ? '#2D1B69' : '#f3f4f6', border: '2px solid rgba(201,168,76,0.4)' }}
      whileTap={{ scale: 0.95 }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        className="w-5 h-5 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#C9A84C' }}
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? <Moon className="w-3 h-3 text-purple-900" /> : <Sun className="w-3 h-3 text-purple-900" />}
      </motion.div>
    </motion.button>
  )
}
