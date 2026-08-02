import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star, ChevronDown } from 'lucide-react'

const slides = [
  {
    title: 'Premium Computer Embroidery',
    subtitle: 'Stunning designs stitched with precision',
    tag: 'New Collection 2024',
    cta: 'Explore Designs',
    ctaLink: '/products',
    gradient: 'from-purple-950 via-purple-900/90 to-pink-900/80',
  },
  {
    title: 'Bridal & Wedding Blouses',
    subtitle: 'Crafted with love for your special day',
    tag: 'Wedding Special',
    cta: 'View Bridal Collection',
    ctaLink: '/products?category=bridal',
    gradient: 'from-gray-950 via-purple-950/90 to-purple-900/80',
  },
  {
    title: 'Custom Design & Printing',
    subtitle: 'Your vision, our expertise',
    tag: 'Customize Now',
    cta: 'Start Customizing',
    ctaLink: '/customize',
    gradient: 'from-purple-950 via-pink-900/80 to-gray-950',
  },
]

const words = ['Embroidery', 'Printing', 'Stitching', 'Fashion', 'Design']

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const slideTimer = setInterval(() => setCurrentSlide((p) => (p + 1) % slides.length), 6000)
    return () => clearInterval(slideTimer)
  }, [])

  useEffect(() => {
    const wordTimer = setInterval(() => setWordIndex((p) => (p + 1) % words.length), 2500)
    return () => clearInterval(wordTimer)
  }, [])

  const slide = slides[currentSlide]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', top: '10%', right: '15%' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(233,30,140,0.12) 0%, transparent 70%)', bottom: '20%', left: '10%' }}
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(45,27,105,0.3) 0%, transparent 70%)', top: '50%', left: '50%' }}
          animate={{ scale: [1, 1.5, 1], x: [-50, 50, -50] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gold-500 rounded-full"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
        />
      ))}

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      <div className="relative z-10 section-container text-center py-20">
        {/* Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/30 rounded-full text-gold-400 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            {slide.tag}
          </motion.div>
        </AnimatePresence>

        {/* Main heading */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="block"
          >
            Customize Your Style
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="block"
          >
            with Premium{' '}
            <span className="relative">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="text-gradient-gold inline-block"
                  initial={{ opacity: 0, y: 20, rotateX: 90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: -90 }}
                  transition={{ duration: 0.5 }}
                >
                  {words[wordIndex]}
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
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            {slide.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* Rating */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
            ))}
          </div>
          <span className="text-white/60 text-sm">500+ Happy Customers</span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/products" className="btn-primary text-base px-8 py-4 text-lg font-semibold group">
            Order Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/customize" className="btn-gold text-base px-8 py-4 text-lg font-semibold">
            <Sparkles className="w-5 h-5" /> Customize Design
          </Link>
          <Link to="/contact" className="btn-outline text-base px-8 py-4 text-lg">
            Contact Us
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[
            { value: '500+', label: 'Happy Customers' },
            { value: '10+', label: 'Years Experience' },
            { value: '25+', label: 'Services' },
            { value: '1000+', label: 'Designs Created' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-3xl font-bold text-gold-400">{value}</p>
              <p className="text-white/50 text-sm mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentSlide ? 'w-8 h-2 bg-gold-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-gold-400" />
      </motion.div>
    </section>
  )
}
