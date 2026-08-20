import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-6 h-6 border-2', md: 'w-12 h-12 border-3', lg: 'w-16 h-16 border-4' }
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative">
        <motion.div
          className={`${sizes[size]} rounded-full border-pink-200 border-t-pink-600 shadow-soft`}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
        </div>
      </div>
      {text && <p className="text-pink-600 dark:text-pink-400 font-semibold text-xs uppercase tracking-wider animate-pulse">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#111827] text-[#1F2937] dark:text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(rgba(236,72,153,0.3) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="text-center relative z-10 px-4">
        <div className="relative inline-block mb-6">
          <motion.div
            className="w-20 h-20 rounded-full mx-auto shadow-pink-glow overflow-hidden"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img
              src="/slv-logo.png"
              alt="SLV Women's Fashion Studio"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        <motion.h2
          className="text-gradient-pink font-display text-2xl font-bold tracking-tight mb-2"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SLV Women's Fashion Studio
        </motion.h2>
        <p className="text-[#64748B] dark:text-pink-200 text-xs uppercase tracking-[0.2em] font-semibold">Loading Bespoke Boutique...</p>
      </div>
    </div>
  )
}
