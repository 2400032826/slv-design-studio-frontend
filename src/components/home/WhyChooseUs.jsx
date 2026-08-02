import { motion } from 'framer-motion'
import { Shield, Clock, Star, Heart, Award, Truck } from 'lucide-react'

const reasons = [
  { icon: Award, title: 'Premium Quality', desc: 'Only the finest materials and threads used in every design', color: 'text-gold-500' },
  { icon: Star, title: 'Expert Craftsmanship', desc: '10+ years of experience in embroidery and fashion design', color: 'text-pink-500' },
  { icon: Clock, title: 'Timely Delivery', desc: 'We respect your time with on-schedule order completion', color: 'text-purple-400' },
  { icon: Heart, title: 'Custom Designs', desc: 'Fully personalized creations tailored to your vision', color: 'text-red-400' },
  { icon: Shield, title: 'Quality Guarantee', desc: '100% satisfaction guarantee on every order', color: 'text-green-400' },
  { icon: Truck, title: 'Free Delivery', desc: 'Free home delivery on orders above ₹500', color: 'text-blue-400' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(rgba(201,168,76,0.8) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="section-container relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">Why Choose Us</span>
          <h2 className="section-title text-white mt-2">
            Crafted with <span className="text-gradient-gold">Passion</span>
          </h2>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">We bring your fashion dreams to life with unmatched quality and personalized service.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              className="glass-card p-6 group hover:border-gold-500/40 transition-all duration-300 cursor-default"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${reason.color}`}>
                <reason.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">{reason.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
