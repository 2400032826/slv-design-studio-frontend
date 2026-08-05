import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Scissors, Shirt, Sparkle, Gem, Gift, Printer } from 'lucide-react'

const services = [
  {
    icon: Sparkles,
    name: 'Computerized Embroidery',
    tag: 'Signature Couture',
    items: ['Bridal Maggam Work', 'Zardosi & Cutdana', 'School & Corporate Logos', 'Custom Saree Borders'],
    link: '/services',
  },
  {
    icon: Printer,
    name: 'Digital Fabric Printing',
    tag: 'Vibrant Textiles',
    items: ['High-Definition DTF Printing', 'Screen Printing', 'Silk Dupatta Printing', 'Custom T-Shirts'],
    link: '/services',
  },
  {
    icon: Scissors,
    name: 'Bridal Blouse Stitching',
    tag: 'Tailored Perfection',
    items: ['Deep Neck Designer Cuts', 'Tassel Tie-Back Blouses', 'Magam Work Fitting', 'Padded Couture Blouses'],
    link: '/services',
  },
  {
    icon: Shirt,
    name: 'Custom Tailoring & Kurtis',
    tag: 'Personalized Fits',
    items: ['Designer Kurtis & Anarkalis', 'Lehenga Choli Tailoring', 'Saree Fall & Pico', 'Custom Alterations'],
    link: '/services',
  },
  {
    icon: Gem,
    name: '1-Gram Gold Jewellery',
    tag: 'Luxury Accessories',
    items: ['Bridal Necklace Sets', 'Antique Temple Jewellery', 'Earrings & Jhumkas', 'Kangan & Bangles'],
    link: '/services',
  },
  {
    icon: Gift,
    name: 'Bespoke Gifts & Uniforms',
    tag: 'Corporate & Celebrations',
    items: ['Customized Photo Gifts', 'Bulk School Uniforms', 'Corporate Merchandise', 'Custom Gift Boxes'],
    link: '/services',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-24 bg-white dark:bg-charcoal-900 relative overflow-hidden">
      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-subtitle">Craftsmanship & Atelier Services</span>
          <h2 className="section-title text-charcoal-900 dark:text-white">
            Our Specialty <span className="text-gradient-gold">Services</span>
          </h2>
          <div className="gold-divider max-w-xs mx-auto my-4" />
          <p className="text-charcoal-600 dark:text-beige-300 text-sm leading-relaxed">
            From royal bridal embroidery to digital textile printing — we combine traditional heritage with modern fashion design.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.name}
                className="glass-card p-8 hover:border-gold-500/50 transition-all duration-500 group flex flex-col justify-between hover:shadow-card-hover border border-beige-200 dark:border-charcoal-800"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-maroon rounded-2xl flex items-center justify-center text-gold-300 shadow-maroon group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="badge-gold text-[10px] font-bold tracking-widest">{service.tag}</span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-charcoal-900 dark:text-white mb-4 group-hover:text-gold-600 transition-colors">
                    {service.name}
                  </h3>

                  <ul className="space-y-2.5 mb-6">
                    {service.items.map((item) => (
                      <li key={item} className="text-charcoal-600 dark:text-beige-300 text-xs flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={service.link}
                  className="inline-flex items-center gap-2 text-gold-600 dark:text-gold-400 text-xs uppercase tracking-widest font-bold hover:gap-3 transition-all pt-4 border-t border-beige-200/60 dark:border-charcoal-800"
                >
                  Explore Atelier Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Action CTA */}
        <div className="text-center mt-14">
          <Link to="/services" className="btn-gold uppercase tracking-wider text-xs px-8 py-4">
            View All Services & Pricing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
