import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-12 h-12', lg: 'w-20 h-20' }
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${sizes[size]} rounded-full border-4 border-purple-900/30 border-t-gold-500`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="text-gold-500 font-medium animate-pulse">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center">
        <motion.div
          className="w-20 h-20 rounded-full border-4 border-purple-900/30 border-t-gold-500 mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.p
          className="text-gold-500 font-display text-xl font-semibold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SLV Design Studio
        </motion.p>
        <p className="text-white/60 text-sm mt-2">Loading premium experience...</p>
      </div>
    </div>
  )
}
