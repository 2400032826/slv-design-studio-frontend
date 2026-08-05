import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-6 h-6 border-2', md: 'w-12 h-12 border-3', lg: 'w-20 h-20 border-4' }
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative">
        <motion.div
          className={`${sizes[size]} rounded-full border-gold-500/20 border-t-gold-500 shadow-gold`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
        </div>
      </div>
      {text && <p className="text-gold-600 dark:text-gold-400 font-semibold text-xs uppercase tracking-widest animate-pulse">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(212,175,55,0.6) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="text-center relative z-10 px-4">
        <div className="relative inline-block mb-6">
          <motion.div
            className="w-20 h-20 rounded-2xl bg-gradient-maroon border border-gold-500/40 flex items-center justify-center mx-auto shadow-gold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-gold-300 font-display font-bold text-3xl">S</span>
          </motion.div>
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold-500 rounded-full animate-ping opacity-75" />
        </div>

        <motion.h2
          className="text-gradient-gold font-display text-2xl font-bold tracking-wide mb-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SLV Women's Fashion Studio
        </motion.h2>
        <p className="text-beige-200/70 text-xs uppercase tracking-[0.25em] font-medium">Crafting Bespoke Couture...</p>
      </div>
    </div>
  )
}
