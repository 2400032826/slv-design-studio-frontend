import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'

export default function FloatingCallButton() {
  return (
    <motion.a
      href="tel:+919731912413"
      className="floating-btn bottom-6 right-6"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.8, type: 'spring' }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      title="Call Us"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-royal rounded-full animate-ping opacity-40" />
        <div className="relative w-14 h-14 bg-gradient-royal rounded-full flex items-center justify-center shadow-pink">
          <Phone className="w-6 h-6 text-white" fill="white" />
        </div>
      </div>
    </motion.a>
  )
}
