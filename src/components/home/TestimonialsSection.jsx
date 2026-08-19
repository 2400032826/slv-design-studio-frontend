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
    <section className="py-20 bg-[#F5F7FA] dark:bg-[#111827] relative overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="section-subtitle">Client Stories</span>
          <h2 className="section-title text-[#1F2937] dark:text-white">What Our <span className="text-gradient-pink">Clients Say</span></h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto my-4 rounded-full" />
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#1F2937] p-8 md:p-10 text-center rounded-3xl border border-[#E5E7EB] dark:border-slate-800 shadow-card"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5F9] dark:bg-pink-950/30 flex items-center justify-center mx-auto mb-6 text-pink-500">
                <Quote className="w-6 h-6" />
              </div>
              <p className="text-[#1F2937] dark:text-slate-100 text-base md:text-lg leading-relaxed font-normal italic mb-8">
                "{testimonials[current].text}"
              </p>
              <div className="flex justify-center mb-5 gap-1">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-tr from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-soft">
                  {testimonials[current].avatar}
                </div>
                <div className="text-left">
                  <p className="text-[#1F2937] dark:text-white font-bold text-sm">{testimonials[current].name}</p>
                  <p className="text-[#64748B] dark:text-slate-400 text-xs">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-center text-[#1F2937] dark:text-white hover:text-pink-600 hover:border-pink-300 shadow-soft transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current ? 'w-6 h-2 bg-gradient-to-r from-pink-500 to-fuchsia-600' : 'w-2 h-2 bg-[#E5E7EB] dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-xl bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-center text-[#1F2937] dark:text-white hover:text-pink-600 hover:border-pink-300 shadow-soft transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
