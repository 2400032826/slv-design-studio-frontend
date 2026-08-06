import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star, ChevronDown } from 'lucide-react'

const heroSlides = [
  {
    title: 'Computer Embroidery & Maggam Work',
    subtitle: 'Handcrafted Zardosi, Cutdana & Machine Embroidery',
    tag: 'Signature Collection 2024',
    bgImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600',
    primaryCta: 'Explore Products',
    primaryLink: '/products',
  },
  {
    title: 'Bridal Blouse Tailoring',
    subtitle: 'Bespoke Fits & Designer Cuts Tailored For Your Special Occasions',
    tag: 'Royal Bridal Edition',
    bgImage: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1600',
    primaryCta: 'View Portfolio',
    primaryLink: '/gallery',
  },
  {
    title: 'Digital Fabric Printing',
    subtitle: 'High Definition DTF & Custom Silk Dupatta Printing',
    tag: 'Custom Fabric Printing',
    bgImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1600',
    primaryCta: 'Start Customizing',
    primaryLink: '/customize',
  },
]

const wordHighlights = ['Boutique', 'Embroidery', 'Stitching', 'Printing', 'Fashion']

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
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Banner Image with Dark Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.bgImage}
            alt={slide.title}
            className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 section-container text-center py-20 md:py-28">
        {/* Category Tag */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide + 'tag'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/60 border border-gold-500/40 text-gold-500 text-xs font-semibold uppercase tracking-[0.25em] mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {slide.tag}
          </motion.div>
        </AnimatePresence>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.15] tracking-tight max-w-5xl mx-auto">
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
            className="block italic font-normal text-white/90"
          >
            with Bespoke{' '}
            <span className="relative font-bold not-italic text-gold-500">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
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
            className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-sans font-light leading-relaxed"
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
              <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
            ))}
          </div>
          <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">
            Rated 4.9/5 by 500+ Boutique Clients
          </span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link to={slide.primaryLink} className="btn-primary text-xs uppercase tracking-widest px-8 py-4 font-bold group">
            {slide.primaryCta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/customize" className="btn-gold text-xs uppercase tracking-widest px-8 py-4 font-bold">
            <Sparkles className="w-4 h-4" /> Book Custom Fitting
          </Link>
          <Link to="/contact" className="btn-outline border-white/40 text-white hover:bg-white hover:text-black text-xs uppercase tracking-widest px-7 py-4">
            Contact Boutique
          </Link>
        </motion.div>

        {/* Metric Bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16 p-6 bg-black/70 border border-charcoal-800"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { value: '500+', label: 'Happy Customers' },
            { value: '10+', label: 'Years Craftsmanship' },
            { value: '1000+', label: 'Custom Outfits' },
            { value: '100%', label: 'Quality Guarantee' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-2">
              <p className="font-display text-2xl md:text-3xl font-bold text-gold-500">{value}</p>
              <p className="text-white/60 text-[11px] uppercase tracking-wider font-medium mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 ${
                i === currentSlide ? 'w-8 h-1 bg-gold-500' : 'w-2 h-1 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-5 h-5 text-gold-500" />
      </motion.div>
    </section>
  )
}
