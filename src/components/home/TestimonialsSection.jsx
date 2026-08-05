import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  { name: 'Priya Sharma', role: 'Bride, Bangalore', rating: 5, text: "SLV Women's Fashion Studio created the most beautiful bridal blouse for my wedding. The embroidery work was exquisite and exactly what I envisioned. Highly recommended!", avatar: 'PS' },
  { name: 'Anitha Reddy', role: 'Fashion Enthusiast', rating: 5, text: 'I ordered customized kurti stitching and printing from them. The quality exceeded my expectations! Will definitely order again.', avatar: 'AR' },
  { name: 'Sunita Nair', role: 'Regular Customer', rating: 5, text: 'The school uniform embroidery they did for my kids was perfect. Logo embroidery was crisp and durable even after many washes.', avatar: 'SN' },
  { name: 'Meena Krishnan', role: 'Business Owner', rating: 5, text: 'Ordered corporate uniform embroidery for my entire team. Professional finish, on-time delivery, and competitive pricing. Excellent work!', avatar: 'MK' },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const next = () => setCurrent((p) => (p + 1) % testimonials.length)
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="section-container relative z-10">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">Testimonials</span>
          <h2 className="section-title text-white mt-2">What Our <span className="text-gradient-gold">Customers Say</span></h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-card p-8 md:p-10 text-center"
            >
              <Quote className="w-10 h-10 text-gold-500/50 mx-auto mb-6" />
              <p className="text-white/90 text-lg md:text-xl leading-relaxed font-light italic mb-8">
                "{testimonials[current].text}"
              </p>
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-royal rounded-full flex items-center justify-center text-white font-bold">
                  {testimonials[current].avatar}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">{testimonials[current].name}</p>
                  <p className="text-white/50 text-sm">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center gap-6 mt-8">
            <button onClick={prev} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current ? 'w-6 h-2 bg-gold-500' : 'w-2 h-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
