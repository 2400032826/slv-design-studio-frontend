import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Scissors, Shirt, Gem, Gift, Printer } from 'lucide-react'

const services = [
  {
    icon: Sparkles,
    name: 'Computerized Embroidery',
    tag: 'Bridal Atelier',
    items: ['Bridal Maggam Work', 'Zardosi & Cutdana Embroidery', 'Corporate & School Logos', 'Custom Saree Borders'],
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
    items: ['Deep Neck Designer Blouses', 'Tassel Tie-Back Fits', 'Maggam Work Alignment', 'Padded Bridal Blouses'],
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
    tag: 'Accessories',
    items: ['Bridal Necklace Sets', 'Antique Temple Jewellery', 'Earrings & Jhumkas', 'Kangan & Bangles'],
    link: '/services',
  },
  {
    icon: Gift,
    name: 'Customized Gifts & Packaging',
    tag: 'Gifts & Corporate',
    items: ['Customized Photo Gifts', 'Bulk Uniforms', 'Corporate Merchandise', 'Custom Gift Boxes'],
    link: '/services',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-20 bg-[#F5F7FA] dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-slate-800">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="section-subtitle">Craftsmanship & Atelier</span>
          <h2 className="section-title text-[#1F2937] dark:text-white">
            Bespoke <span className="text-gradient-pink">Services</span>
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto my-4 rounded-full" />
          <p className="text-[#64748B] dark:text-slate-300 text-sm font-sans leading-relaxed">
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
                className="service-card flex flex-col justify-between bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-7 hover:border-pink-400 hover:shadow-card-hover transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 bg-[#FFF5F9] dark:bg-slate-800 text-pink-500 rounded-xl flex items-center justify-center border border-pink-100 dark:border-slate-700 group-hover:bg-gradient-to-tr group-hover:from-pink-500 group-hover:to-fuchsia-600 group-hover:text-white transition-all shadow-subtle">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="badge-soft text-[10px]">{service.tag}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#1F2937] dark:text-white mb-3 group-hover:text-pink-600 transition-colors">
                    {service.name}
                  </h3>

                  <ul className="space-y-2 mb-6">
                    {service.items.map((item) => (
                      <li key={item} className="text-[#64748B] dark:text-slate-300 text-xs flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={service.link}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 hover:text-pink-700 group-hover:translate-x-1 transition-all pt-4 border-t border-[#E5E7EB] dark:border-slate-800"
                >
                  Explore Service <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link to="/services" className="btn-primary text-xs tracking-wider font-bold">
            View Complete Atelier Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
