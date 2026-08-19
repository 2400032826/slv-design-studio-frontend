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
      className="relative w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
      style={{
        backgroundColor: isDark ? '#1F2937' : '#FFF5F9',
        border: '1px solid #E5E7EB',
      }}
      whileTap={{ scale: 0.95 }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        className="w-4 h-4 rounded-full flex items-center justify-center bg-gradient-to-tr from-pink-500 to-fuchsia-600 shadow-soft"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? <Moon className="w-2.5 h-2.5 text-white" /> : <Sun className="w-2.5 h-2.5 text-white" />}
      </motion.div>
    </motion.button>
  )
}
