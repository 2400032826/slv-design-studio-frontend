import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star, ChevronDown, Award, ShieldCheck } from 'lucide-react'

const heroSlides = [
  {
    title: 'Exquisite Computer Embroidery',
    subtitle: 'Bespoke Maggam, Zardosi & Threadwork Tailored to Perfection',
    tag: 'Haute Couture 2024',
    bgImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600',
    primaryCta: 'Explore Collections',
    primaryLink: '/products',
  },
  {
    title: 'Bridal Blouse & Lehenga Tailoring',
    subtitle: 'Timeless Elegance & Custom Fits for Your Most Magical Occasions',
    tag: 'Royal Bridal Edition',
    bgImage: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1600',
    primaryCta: 'View Bridal Gallery',
    primaryLink: '/gallery',
  },
  {
    title: 'High-Definition Fabric Printing',
    subtitle: 'Vibrant DTF & Digital Textile Prints on Pure Silk, Organza & Velvet',
    tag: 'Bespoke Printing',
    bgImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1600',
    primaryCta: 'Start Customizing',
    primaryLink: '/customize',
  },
]

const animatedWords = ['Boutique', 'Embroidery', 'Stitching', 'Printing', 'Couture']

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const slideTimer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 7000)
    return () => clearInterval(slideTimer)
  }, [])

  useEffect(() => {
    const wordTimer = setInterval(() => setWordIndex((prev) => (prev + 1) % animatedWords.length), 3000)
    return () => clearInterval(wordTimer)
  }, [])

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-charcoal-950">
      {/* Background High-Fashion Image Carousel with Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.bgImage}
            alt={slide.title}
            className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-maroon-950/70 to-charcoal-950/80" />
        </motion.div>
      </AnimatePresence>

      {/* Ambient Radial Glowing Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20 bg-gold-500"
          style={{ top: '10%', right: '10%' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full blur-3xl opacity-20 bg-maroon-600"
          style={{ bottom: '10%', left: '5%' }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Floating Gold Sparkle Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-gold-400/80 rounded-full z-10 pointer-events-none"
          style={{ left: `${Math.random() * 90 + 5}%`, top: `${Math.random() * 85 + 10}%` }}
          animate={{ y: [0, -35, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
        />
      ))}

      <div className="relative z-10 section-container text-center py-24 md:py-32">
        {/* Luxury Tag Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide + 'tag'}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500/10 border border-gold-500/30 rounded-full text-gold-400 text-xs font-semibold uppercase tracking-[0.25em] mb-8 backdrop-blur-md shadow-gold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {slide.tag}
          </motion.div>
        </AnimatePresence>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="block"
          >
            Customize Your Style
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="block italic font-normal text-beige-100"
          >
            with Luxury{' '}
            <span className="relative font-bold not-italic">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="text-gradient-gold inline-block"
                  initial={{ opacity: 0, y: 20, rotateX: 90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: -90 }}
                  transition={{ duration: 0.5 }}
                >
                  {animatedWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.span>
        </h1>

        {/* Subtitle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentSlide + 'sub'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-beige-200/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          >
            {slide.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* Star Rating Trust Bar */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
            ))}
          </div>
          <span className="text-beige-200/70 text-xs font-semibold uppercase tracking-wider">
            Rated 4.9/5 by 500+ Happy Customers
          </span>
        </motion.div>

        {/* Luxury CTA Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to={slide.primaryLink} className="btn-gold text-sm tracking-wider uppercase font-bold px-8 py-4 group shadow-gold">
            {slide.primaryCta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/customize" className="btn-primary text-sm tracking-wider uppercase font-bold px-8 py-4">
            <Sparkles className="w-4 h-4" /> Book Custom Fitting
          </Link>
          <Link to="/contact" className="btn-outline border-beige-300/40 text-beige-100 hover:bg-beige-100 hover:text-maroon-950 text-sm tracking-wider uppercase px-7 py-4">
            Contact Boutique
          </Link>
        </motion.div>

        {/* Key Metrics Bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20 p-6 rounded-3xl glass-dark border border-gold-500/20 shadow-luxury"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {[
            { value: '500+', label: 'Delighted Clients' },
            { value: '10+', label: 'Years Master Crafting' },
            { value: '1000+', label: 'Custom Designs Handcrafted' },
            { value: '100%', label: 'Quality Guarantee' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-2">
              <p className="font-display text-2xl md:text-3xl font-bold text-gradient-gold">{value}</p>
              <p className="text-beige-200/60 text-xs uppercase tracking-wider font-semibold mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2.5 mt-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-500 rounded-full ${
                i === currentSlide ? 'w-8 h-2 bg-gold-500 shadow-gold' : 'w-2 h-2 bg-beige-100/30 hover:bg-beige-100/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-5 h-5 text-gold-400" />
      </motion.div>
    </section>
  )
}
