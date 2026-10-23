import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, Scissors, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react'

const fashionShowcase = [
  {
    id: 'maggam',
    title: 'Bridal Maggam & Zari',
    description: 'Gold zari needlework, stone detailing & custom fit for wedding blouses.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=75',
    badge: '👑 Bridal Special',
  },
  {
    id: 'blouse',
    title: 'Designer Blouse Tailoring',
    description: 'Custom padded fits, deep necklines & tassel tie-backs by master tailors.',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=700&q=75',
    badge: '✂️ Custom Fit',
  },
  {
    id: 'embroidery',
    title: 'Computer Embroidery Atelier',
    description: 'Multi-thread computer embroidery for sarees, dupattas, and logos.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=75',
    badge: '🧵 Precision Work',
  },
]

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState(0)
  const currentItem = fashionShowcase[activeTab]

  const scrollToProducts = () => {
    const el = document.getElementById('featured-designs')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#111827] border-b border-[#E8EAF0] dark:border-slate-800">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 w-[420px] h-[420px] bg-[#FFF1F6] dark:bg-pink-950/20 rounded-full blur-3xl opacity-80" />
        <div className="absolute bottom-0 -left-16 w-[320px] h-[320px] bg-[#F7F8FA] dark:bg-slate-900/40 rounded-full blur-2xl opacity-60" />
      </div>

      <div className="relative z-10 section-container py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* ================= LEFT: Compact Business Introduction ================= */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Small Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF1F6] dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/50 text-[#C52E74] dark:text-pink-300 text-[11px] font-bold uppercase tracking-wider rounded-full mb-3 shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              <span>SLV Women's Fashion Studio • Custom Tailoring & Embroidery</span>
            </motion.div>

            {/* Headline - Punchy & Impactful */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-[#1F2937] dark:text-white leading-[1.2] tracking-tight mb-3"
            >
              Bespoke <span className="text-gradient-pink">Embroidery & Fashion</span> Crafted for Elegance
            </motion.h1>

            {/* Natural Human Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-[#64748B] dark:text-slate-300 text-xs sm:text-sm max-w-xl mb-4 font-sans leading-relaxed"
            >
              Bridal blouses, designer Maggam work, custom computer embroidery, sarees, and 1 gram gold jewellery with artisanal precision and fast delivery.
            </motion.p>

            {/* Quick Category Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#64748B] dark:text-slate-300 mb-5 pb-3 border-b border-[#E8EAF0] dark:border-slate-800 w-full max-w-xl"
            >
              <span className="text-pink-600 dark:text-pink-400">Bridal Blouses</span>
              <span>•</span>
              <span>Maggam Work</span>
              <span>•</span>
              <span>Computer Embroidery</span>
              <span>•</span>
              <span>1 Gram Gold Jewellery</span>
              <span>•</span>
              <span>Custom Printing</span>
            </motion.div>

            {/* CTA Buttons — Product-First Trigger */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-wrap items-center gap-2.5 mb-5 w-full sm:w-auto"
            >
              <button
                onClick={scrollToProducts}
                className="btn-primary text-xs tracking-wider px-5 py-2.5 font-bold shadow-card flex items-center justify-center gap-2 group"
              >
                <span>View Products Below</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <Link
                to="/customize"
                className="btn-secondary text-xs tracking-wider px-5 py-2.5 font-bold flex items-center justify-center gap-2"
              >
                <Scissors className="w-4 h-4 text-pink-500" />
                <span>Custom Stitching</span>
              </Link>

              <a
                href="https://wa.me/919731912413"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-xs tracking-wider px-4 py-2.5 font-bold flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                <span>WhatsApp Us</span>
              </a>
            </motion.div>

            {/* Pillar Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center gap-4 text-[11px] text-[#64748B] dark:text-slate-300 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                <span>Handcrafted Maggam</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                <span>Perfect Fit Guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                <span>Zero Hidden Tax / Free Delivery</span>
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT: Sleek Compact Fashion Preview ================= */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            {/* Fashion Showcase Interactive Tabs */}
            <div className="flex gap-1.5 mb-2.5 overflow-x-auto pb-1">
              {fashionShowcase.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(idx)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    activeTab === idx
                      ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-soft'
                      : 'bg-white dark:bg-[#1F2937] text-[#64707D] dark:text-slate-300 border border-[#E8EAF0] dark:border-slate-800 hover:border-pink-300'
                  }`}
                >
                  {item.title.split(' ')[0]} {item.title.split(' ')[1] || ''}
                </button>
              ))}
            </div>

            {/* Main Visual Image Card - Compact 16:9 / 4:3 Ratio */}
            <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#1F2937] border border-[#E8EAF0] dark:border-slate-800 shadow-card p-2 group">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-[#F7F8FA] dark:bg-slate-900">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentItem.id}
                    src={currentItem.image}
                    alt={currentItem.title}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=75'
                    }}
                  />
                </AnimatePresence>

                {/* Floating Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="badge bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-md text-[#C52E74] dark:text-pink-300 border border-pink-200 dark:border-pink-900/50 text-[10px] font-bold shadow-soft px-2.5 py-0.5">
                    {currentItem.badge}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 z-10">
                  <span className="badge bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-md text-[#1F2937] dark:text-white border border-[#E8EAF0] dark:border-slate-700 text-[10px] font-bold shadow-soft px-2.5 py-0.5">
                    ✨ Premium Quality
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
