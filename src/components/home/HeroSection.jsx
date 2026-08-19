import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star, Scissors, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react'

const fashionShowcase = [
  {
    id: 'maggam',
    title: 'Bridal Maggam & Zardosi',
    tag: 'Handcrafted Heritage',
    description: 'Intricate gold zari needlework, cutdana & stone detailing for wedding blouses.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000',
    badge: '100% Handcrafted',
    link: '/products',
  },
  {
    id: 'blouse',
    title: 'Designer Blouse Tailoring',
    tag: 'Perfect Silhouette',
    description: 'Custom padded fits, deep necklines, and tassel tie-backs crafted by master tailors.',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000',
    badge: 'Custom Measurement Fit',
    link: '/customize',
  },
  {
    id: 'embroidery',
    title: 'Computer Embroidery Atelier',
    tag: 'Modern Precision',
    description: 'High-speed multi-thread computerized embroidery for sarees, dupattas & logos.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000',
    badge: 'Fast Delivery Option',
    link: '/services',
  },
]

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState(0)
  const currentItem = fashionShowcase[activeTab]

  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#111827] border-b border-[#E8EAF0] dark:border-slate-800">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Pink Radial Glow */}
        <div className="absolute -top-32 right-0 w-[550px] h-[550px] bg-[#FFF1F6] dark:bg-pink-950/20 rounded-full blur-3xl opacity-80" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-[#F7F8FA] dark:bg-slate-900/40 rounded-full blur-2xl opacity-60" />

        {/* Delicate Decorative SVG Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern id="embroidery-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="#C52E74" />
              <path d="M 0 20 L 40 20 M 20 0 L 20 40" stroke="#C52E74" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#embroidery-grid)" />
        </svg>
      </div>

      <div className="relative z-10 section-container py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT SIDE: Content & Hierarchy ================= */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Small Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF1F6] dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/50 text-[#C52E74] dark:text-pink-300 text-xs font-bold uppercase tracking-widest rounded-full mb-5 shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              <span>SLV FASHION STUDIO</span>
            </motion.div>

            {/* Headline - Unified Single Dark Color */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-bold text-[#1F2937] dark:text-white leading-[1.18] tracking-tight mb-5"
            >
              Fashion, Customisation & More — All in One Place.
            </motion.h1>

            {/* Natural Human Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-[#64748B] dark:text-slate-300 text-sm sm:text-base max-w-xl mb-6 font-sans leading-relaxed"
            >
              From bridal blouses, sarees and Maggam work to custom embroidery, personalised garments, jewellery and gifts — find everything for your special style in one place.
            </motion.p>

            {/* Service Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-[#64748B] dark:text-slate-300 mb-8 pb-6 border-b border-[#E8EAF0] dark:border-slate-800 w-full max-w-xl"
            >
              <span>Sarees</span>
              <span className="text-pink-400">•</span>
              <span>Bridal & Fashion Wear</span>
              <span className="text-pink-400">•</span>
              <span>Embroidery</span>
              <span className="text-pink-400">•</span>
              <span>Custom Printing</span>
              <span className="text-pink-400">•</span>
              <span>1 Gram Gold Jewellery</span>
              <span className="text-pink-400">•</span>
              <span>Personalised Gifts</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 w-full sm:w-auto"
            >
              <Link
                to="/products"
                className="btn-primary text-xs tracking-wider px-6 py-3.5 font-bold shadow-card group text-center justify-center"
              >
                Explore Our Products & Services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/customize"
                className="btn-secondary text-xs tracking-wider px-6 py-3.5 font-bold flex items-center justify-center gap-2 text-center"
              >
                <Scissors className="w-4 h-4 text-pink-500" />
                Customize Your Design
              </Link>
              <Link
                to="/contact"
                className="btn-outline text-xs tracking-wider px-5 py-3.5 font-bold text-center justify-center"
              >
                Contact Us
              </Link>
            </motion.div>

            {/* Pillar Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 max-w-lg w-full"
            >
              <div className="flex items-center gap-2 text-xs sm:text-[11px] text-[#64748B] dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-pink-500 flex-shrink-0" />
                <span>Handcrafted Maggam</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-[11px] text-[#64748B] dark:text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-pink-500 flex-shrink-0" />
                <span>Perfect Fit Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-[11px] text-[#64748B] dark:text-slate-300 font-medium">
                <HeartHandshake className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-pink-500 flex-shrink-0" />
                <span>Express Stitching</span>
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT SIDE: Layered Fashion Composition ================= */}
          <div className="lg:col-span-5 relative">
            {/* Fashion Showcase Interactive Tabs */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {fashionShowcase.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === idx
                      ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-soft'
                      : 'bg-white dark:bg-[#1F2937] text-[#64707D] dark:text-slate-300 border border-[#E8EAF0] hover:border-pink-300'
                  }`}
                >
                  {item.title.split(' ')[0]} {item.title.split(' ')[1] || ''}
                </button>
              ))}
            </div>

            {/* Main Visual Image Card */}
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#1F2937] border border-[#E8EAF0] dark:border-slate-800 shadow-card p-3 group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F7F8FA] dark:bg-slate-900">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentItem.id}
                    src={currentItem.image}
                    alt={currentItem.title}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'
                    }}
                  />
                </AnimatePresence>

                {/* Floating Pill Top Left: Bridal Special */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="badge bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-md text-[#C52E74] dark:text-pink-300 border border-pink-200 dark:border-pink-900/50 text-[11px] font-bold shadow-soft px-3 py-1">
                    👑 Bridal Special
                  </span>
                </div>

                {/* Floating Pill Top Right: 100% Handcrafted */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="badge bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-md text-[#252A34] dark:text-white border border-[#E8EAF0] dark:border-slate-700 text-[11px] font-bold shadow-soft px-3 py-1">
                    ✨ 100% Handcrafted
                  </span>
                </div>

                {/* Floating Pill Bottom Left: Premium Zardosi */}
                <div className="absolute bottom-3.5 left-3.5 z-10">
                  <span className="badge bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-md text-[#252A34] dark:text-white border border-[#E8EAF0] dark:border-slate-700 text-[11px] font-bold shadow-soft px-3 py-1">
                    🧵 Premium Zardosi & Maggam
                  </span>
                </div>

                {/* Floating Pill Bottom Right: Perfect Fit */}
                <div className="absolute bottom-3.5 right-3.5 z-10">
                  <span className="badge bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-md text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-900/50 text-[11px] font-bold shadow-soft px-3 py-1">
                    👗 Perfect Fit Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

