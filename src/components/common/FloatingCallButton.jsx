import { Phone } from 'lucide-react'

export default function FloatingCallButton() {
  return (
    <a
      href="tel:+919731912413"
      className="fixed right-4 bottom-[132px] md:bottom-[78px] md:right-6 z-30 w-[50px] h-[50px] md:w-12 md:h-12 bg-gradient-to-tr from-pink-600 to-fuchsia-600 text-white rounded-full flex items-center justify-center shadow-md hover:scale-[1.03] active:scale-95 transition-transform duration-150 border border-white/20"
      title="Call Atelier Direct"
      aria-label="Call Atelier Direct"
    >
      <Phone className="w-5 h-5 md:w-4 md:h-4 text-white" fill="white" aria-hidden="true" />
    </a>
  )
}
