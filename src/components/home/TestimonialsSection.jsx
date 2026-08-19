import { motion } from 'framer-motion'
import { Quote, MessageCircleHeart } from 'lucide-react'

const authenticTestimonials = [
  {
    id: 1,
    name: 'Anitha K.',
    service: 'Bridal Blouse Customization',
    feedback: 'Got my blouse work customized exactly the way I wanted. The embroidery detailing was beautiful and the fitting was very neat.',
    initials: 'AK',
    bgTone: 'bg-[#FFF1F6] text-[#C52E74] dark:bg-pink-950/40 dark:text-pink-300',
  },
  {
    id: 2,
    name: 'Priyanka R.',
    service: 'Computer Embroidery & Kurti',
    feedback: 'Good service and the team explained the customization options clearly. Very happy with the final thread finish and on-time delivery.',
    initials: 'PR',
    bgTone: 'bg-[#F5F3FF] text-[#7C3AED] dark:bg-purple-950/40 dark:text-purple-300',
  },
  {
    id: 3,
    name: 'Sowmya M.',
    service: 'Saree Kuchu & Tassels',
    feedback: 'Sent them my design idea and they helped customize it nicely. The work looked very good for our family celebration.',
    initials: 'SM',
    bgTone: 'bg-[#FEF3C7] text-[#D97706] dark:bg-amber-950/40 dark:text-amber-300',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-[#111827] border-b border-[#E8EAF0] dark:border-slate-800">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="section-subtitle">Customer Experiences</span>
          <h2 className="section-title text-[#252A34] dark:text-white">
            Client <span className="text-gradient-pink">Feedback</span>
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto my-4 rounded-full" />
          <p className="text-[#64707D] dark:text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
            Genuine notes from clients who tailored their bridal blouses, embroidery, and festive wear with our atelier.
          </p>
        </div>

        {/* 3 Authentic Customer Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {authenticTestimonials.map((item, i) => (
            <motion.div
              key={item.id}
              className="bg-[#F8F9FB] dark:bg-[#1F2937] p-7 rounded-3xl border border-[#E8EAF0] dark:border-slate-800 shadow-card hover:border-pink-300 transition-all flex flex-col justify-between"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-[#E8EAF0] dark:border-slate-700 flex items-center justify-center text-pink-500 mb-4 shadow-subtle">
                  <Quote className="w-4 h-4" />
                </div>
                <p className="text-[#252A34] dark:text-slate-200 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  "{item.feedback}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#E8EAF0] dark:border-slate-800">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${item.bgTone}`}>
                  {item.initials}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#252A34] dark:text-white leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[#64707D] dark:text-slate-400">
                    {item.service}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

