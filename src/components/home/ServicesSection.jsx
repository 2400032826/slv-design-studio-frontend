import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const services = [
  { icon: '🧵', name: 'Computer Embroidery', items: ['Name Embroidery', 'Logo Embroidery', 'School Uniform', 'Corporate Uniform'], color: 'from-purple-900/60 to-pink-900/60', border: 'border-pink-500/30' },
  { icon: '🖨️', name: 'Custom Printing', items: ['DTF Printing', 'Screen Printing', 'Photo Printing', 'T-Shirt Printing'], color: 'from-gold-900/40 to-purple-900/60', border: 'border-gold-500/30' },
  { icon: '✂️', name: 'Blouse Stitching', items: ['Wedding Blouse', 'Designer Blouse', 'Bridal Blouse', 'Simple Blouse'], color: 'from-pink-900/60 to-purple-900/60', border: 'border-purple-500/30' },
  { icon: '👔', name: 'Tailoring', items: ['Men\'s Shirt', 'Pant Stitching', 'Kurti Stitching', 'Chudidar'], color: 'from-purple-900/60 to-gold-900/40', border: 'border-gold-500/20' },
  { icon: '💍', name: '1 Gram Gold Jewellery', items: ['Necklaces', 'Earrings', 'Bangles', 'Bridal Sets'], color: 'from-gold-900/50 to-pink-900/50', border: 'border-pink-500/20' },
  { icon: '🎁', name: 'Customized Gifts', items: ['Photo Gifts', 'Logo Gifts', 'Corporate Gifts', 'Custom Packaging'], color: 'from-pink-900/50 to-purple-900/60', border: 'border-purple-500/20' },
]

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="section-container">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-pink-500 text-sm font-semibold uppercase tracking-widest">What We Offer</span>
          <h2 className="section-title text-gray-900 dark:text-white mt-2">
            Our <span className="text-gradient-royal">Services</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">From intricate embroidery to elegant tailoring — we bring art and fashion together.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              className={`bg-gradient-to-br ${service.color} border ${service.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group cursor-pointer`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="font-display text-xl font-bold text-white mb-3">{service.name}</h3>
              <ul className="space-y-1 mb-4">
                {service.items.map((item) => (
                  <li key={item} className="text-white/70 text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold-400 rounded-full" />{item}
                  </li>
                ))}
              </ul>
              <Link to="/services" className="inline-flex items-center gap-1 text-gold-400 text-sm font-medium hover:gap-2 transition-all group-hover:text-gold-300">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/services" className="btn-primary inline-flex">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
