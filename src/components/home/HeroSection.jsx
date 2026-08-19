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
              <span>Signature Bridal & Fashion Atelier</span>
            </motion.div>

            {/* Headline - Refined & Balanced */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-bold text-[#252A34] dark:text-white leading-[1.18] tracking-tight mb-5"
            >
              Custom Embroidery. <br />
              <span className="font-normal italic text-[#64707D] dark:text-slate-300">
                Tailored for Your
              </span>{' '}
              <span className="text-gradient-pink font-bold not-italic">
                Grand Moments.
              </span>
            </motion.h1>

            {/* Short Professional Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-[#64707D] dark:text-slate-300 text-sm sm:text-base max-w-xl mb-6 font-sans leading-relaxed"
            >
              Specializing in bespoke bridal blouses, authentic South Indian Maggam & Zardosi work, and precision computer embroidery tailored to your exact measurements.
            </motion.p>

            {/* Social Proof / Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-8 pb-6 border-b border-[#E8EAF0] dark:border-slate-800 w-full max-w-lg"
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#252A34] dark:text-slate-200">
                4.9 / 5.0 Rating
              </span>
              <span className="text-xs text-[#64707D] dark:text-slate-400">
                • Trusted by 500+ Brides & Boutiques
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3.5 mb-8"
            >
              <Link
                to="/products"
                className="btn-primary text-xs tracking-wider px-7 py-3.5 font-bold shadow-card group"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/customize"
                className="btn-secondary text-xs tracking-wider px-7 py-3.5 font-bold flex items-center gap-2"
              >
                <Scissors className="w-4 h-4 text-pink-500" />
                Customize Design
              </Link>
              <Link
                to="/contact"
                className="btn-outline text-xs tracking-wider px-6 py-3.5 font-bold"
              >
                Contact Boutique
              </Link>
            </motion.div>

            {/* Pillar Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="grid grid-cols-3 gap-3 max-w-lg w-full"
            >
              <div className="flex items-center gap-2 text-[11px] text-[#64707D] dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                <span>Handcrafted Maggam</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#64707D] dark:text-slate-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                <span>Perfect Fit Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#64707D] dark:text-slate-300 font-medium">
                <HeartHandshake className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
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
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#1F2937] border border-[#E8EAF0] dark:border-slate-800 shadow-card p-2.5 group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F7F8FA] dark:bg-slate-900">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentItem.id}
                    src={currentItem.image}
                    alt={currentItem.title}
                    initial={{ opacity: 0, scale: 1.05 }}
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

                {/* Subtle Gradient Shade on Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937]/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="badge bg-white/20 backdrop-blur-md text-white text-[10px] uppercase font-bold self-start mb-1.5 border border-white/30">
                    {currentItem.tag}
                  </span>
                  <h3 className="font-display font-bold text-lg leading-tight mb-1">
                    {currentItem.title}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-2">
                    {currentItem.description}
                  </p>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <motion.div
                className="absolute top-6 right-6 bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-md border border-[#E8EAF0] dark:border-slate-700 rounded-xl px-3.5 py-2 shadow-card flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F6] text-pink-600 flex items-center justify-center font-bold text-xs">
                  ✨
                </div>
                <div>
                  <p className="text-[10px] text-[#64707D] uppercase font-bold tracking-wider">Atelier Craft</p>
                  <p className="text-xs font-bold text-[#252A34] dark:text-white">{currentItem.badge}</p>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom Left */}
              <motion.div
                className="absolute -bottom-3 -left-3 bg-white dark:bg-[#1F2937] border border-[#E8EAF0] dark:border-slate-700 rounded-2xl p-3.5 shadow-card-hover flex items-center gap-3 hidden sm:flex"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-fuchsia-600 flex items-center justify-center text-white shadow-soft font-display font-bold text-sm">
                  10+
                </div>
                <div>
                  <p className="text-xs font-bold text-[#252A34] dark:text-white">Years of Master Tailoring</p>
                  <p className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold">Over 1,000+ Fits Delivered</p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

