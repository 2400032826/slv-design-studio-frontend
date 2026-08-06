import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Scissors, Shirt, Gem, Gift, Printer } from 'lucide-react'

const services = [
  {
    icon: Sparkles,
    name: 'Computerized Embroidery',
    tag: 'Signature Atelier',
    items: ['Bridal Maggam Work', 'Zardosi & Cutdana Embroidery', 'School & Corporate Logos', 'Custom Saree Borders'],
    link: '/services',
  },
  {
    icon: Printer,
    name: 'Digital Fabric Printing',
    tag: 'Textile Printing',
    items: ['High-Definition DTF Printing', 'Screen Printing', 'Silk Dupatta Printing', 'Custom T-Shirts'],
    link: '/services',
  },
  {
    icon: Scissors,
    name: 'Blouse Stitching & Tailoring',
    tag: 'Bespoke Fits',
    items: ['Deep Neck Designer Blouses', 'Tassel Tie-Back Fits', 'Maggam Work Alignment', 'Padded Couture Blouses'],
    link: '/services',
  },
  {
    icon: Shirt,
    name: 'Custom Kurtis & Dresses',
    tag: 'Women\'s Fashion',
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
    name: 'Customized Gifts & Packaging',
    tag: 'Corporate & Gifts',
    items: ['Customized Photo Gifts', 'Bulk School Uniforms', 'Corporate Merchandise', 'Custom Gift Boxes'],
    link: '/services',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-20 bg-[#F8F8F8] dark:bg-black border-y border-[#EAEAEA] dark:border-charcoal-800">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="section-subtitle">Craftsmanship & Atelier</span>
          <h2 className="section-title text-[#111111] dark:text-white">
            Bespoke <span className="text-gold-500">Services</span>
          </h2>
          <div className="h-px bg-[#EAEAEA] dark:bg-charcoal-800 max-w-xs mx-auto my-4" />
          <p className="text-[#666666] dark:text-charcoal-300 text-sm font-sans leading-relaxed">
            From royal bridal embroidery to digital textile printing — combining heritage craftsmanship with modern fashion tailoring.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.name}
                className="service-card flex flex-col justify-between bg-white dark:bg-charcoal-900 border border-[#EAEAEA] dark:border-charcoal-800 p-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-black text-gold-500 flex items-center justify-center border border-black">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="badge-gold text-[10px] font-bold tracking-widest">{service.tag}</span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-[#111111] dark:text-white mb-4">
                    {service.name}
                  </h3>

                  <ul className="space-y-2 mb-6">
                    {service.items.map((item) => (
                      <li key={item} className="text-[#666666] dark:text-charcoal-300 text-xs flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={service.link}
                  className="inline-flex items-center gap-2 text-black dark:text-white text-xs uppercase tracking-widest font-bold hover:text-gold-500 transition-colors pt-4 border-t border-[#EAEAEA] dark:border-charcoal-800"
                >
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link to="/services" className="btn-outline text-xs uppercase tracking-wider px-8 py-3.5">
            View All Services & Pricing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
