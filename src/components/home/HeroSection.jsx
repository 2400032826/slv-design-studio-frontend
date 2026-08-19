import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star, ChevronDown, Scissors } from 'lucide-react'

const heroSlides = [
  {
    title: 'Computer Embroidery & Maggam Work',
    subtitle: 'Handcrafted Zardosi, Cutdana & High-Precision Machine Embroidery',
    tag: 'Signature Bridal Collection',
    bgImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600',
    primaryCta: 'Explore Collection',
    primaryLink: '/products',
  },
  {
    title: 'Bridal Blouse Tailoring',
    subtitle: 'Bespoke Fits & Designer Cuts Tailored For Your Grand Celebrations',
    tag: 'Royal Bridal Edition',
    bgImage: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1600',
    primaryCta: 'View Portfolio',
    primaryLink: '/gallery',
  },
  {
    title: 'Digital Fabric & DTF Printing',
    subtitle: 'High Definition DTF & Custom Silk Dupatta Printing',
    tag: 'Custom Textile Atelier',
    bgImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1600',
    primaryCta: 'Start Customizing',
    primaryLink: '/customize',
  },
]

const wordHighlights = ['Bespoke Blouses', 'Maggam Work', 'Embroidery', 'DTF Printing', 'Royal Couture']

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const slideTimer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 7000)
    return () => clearInterval(slideTimer)
  }, [])

  useEffect(() => {
    const wordTimer = setInterval(() => setWordIndex((prev) => (prev + 1) % wordHighlights.length), 3000)
    return () => clearInterval(wordTimer)
  }, [])

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F5F7FA] to-[#FFF5F9] dark:from-[#111827] dark:via-[#1F2937] dark:to-[#111827]">
      {/* Background Decorative Soft Tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-100/40 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 section-container text-center py-16 md:py-24">
        {/* Category Tag */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide + 'tag'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-[#1F2937] border border-pink-200 dark:border-pink-900/40 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-6 shadow-subtle"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            {slide.tag}
          </motion.div>
        </AnimatePresence>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-[#1F2937] dark:text-white mb-6 leading-[1.12] tracking-tight max-w-5xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="block"
          >
            Customize Your Style
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="block italic font-normal text-[#64748B] dark:text-slate-300 mt-1"
          >
            with Premium{' '}
            <span className="relative font-bold not-italic text-gradient-pink">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {wordHighlights[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.span>
        </h1>

        {/* Subtitle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentSlide + 'sub'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[#64748B] dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-sans font-normal leading-relaxed"
          >
            {slide.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* Ratings Bar */}
        <motion.div
          className="flex items-center justify-center gap-2.5 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[#64748B] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Rated 4.9/5 by 500+ Boutique Clients
          </span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3.5 justify-center items-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link to={slide.primaryLink} className="btn-primary text-xs tracking-wider px-8 py-3.5 font-bold group shadow-card">
            {slide.primaryCta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/customize" className="btn-secondary text-xs tracking-wider px-8 py-3.5 font-bold">
            <Scissors className="w-4 h-4 text-pink-500" /> Customize Design
          </Link>
          <Link to="/contact" className="btn-outline text-xs tracking-wider px-7 py-3.5 font-bold">
            Contact Boutique
          </Link>
        </motion.div>

        {/* Metric Stats Bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 p-6 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-slate-800 shadow-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { value: '500+', label: 'Happy Clients' },
            { value: '10+', label: 'Years Experience' },
            { value: '1000+', label: 'Custom Fits Delivered' },
            { value: '100%', label: 'Quality Guarantee' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-2">
              <p className="font-display text-2xl md:text-3xl font-bold text-gradient-pink">{value}</p>
              <p className="text-[#64748B] dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentSlide ? 'w-8 h-1.5 bg-gradient-to-r from-pink-500 to-fuchsia-600' : 'w-2.5 h-1.5 bg-[#E5E7EB] hover:bg-pink-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-5 h-5 text-pink-400" />
      </motion.div>
    </section>
  )
}
