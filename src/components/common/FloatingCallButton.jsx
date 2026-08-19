import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'

export default function FloatingCallButton() {
  return (
    <motion.a
      href="tel:+919731912413"
      className="floating-btn bottom-36 right-4 md:bottom-6 md:right-6 z-30"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.8, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title="Call Atelier Direct"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-pink-500 rounded-full animate-ping opacity-30" />
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-pink-glow border border-white/20">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
        </div>
      </div>
    </motion.a>
  )
}
