import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Scissors, Shirt, Gem, Gift, Printer } from 'lucide-react'

const services = [
  {
    icon: Sparkles,
    name: 'Computerized Embroidery',
    tag: 'Bridal Maggam',
    desc: 'Handcrafted Zardosi, stone work, and high-precision computerized embroidery for bridal wear.',
    chips: ['Maggam & Zardosi', 'Saree Borders'],
    iconBg: 'bg-[#FFF1F6] dark:bg-pink-950/30',
    iconColor: 'text-[#E83E8C]',
    borderColor: 'border-pink-200 dark:border-pink-900/40',
    chipBg: 'bg-[#FFF1F6] text-[#C52E74] dark:bg-pink-950/40 dark:text-pink-300',
    link: '/services',
  },
  {
    icon: Printer,
    name: 'Digital Fabric & DTF Printing',
    tag: 'Textile Atelier',
    desc: 'Vibrant direct-to-film printing, silk dupatta custom prints, and customized event merchandise.',
    chips: ['HD DTF Printing', 'Silk Dupattas'],
    iconBg: 'bg-[#F5F3FF] dark:bg-purple-950/30',
    iconColor: 'text-[#7C3AED]',
    borderColor: 'border-purple-200 dark:border-purple-900/40',
    chipBg: 'bg-[#F5F3FF] text-[#6D28D9] dark:bg-purple-950/40 dark:text-purple-300',
    link: '/services',
  },
  {
    icon: Scissors,
    name: 'Blouse Stitching & Tailoring',
    tag: 'Bespoke Fit',
    desc: 'Designer bridal blouse tailoring with padded lining, deep neck patterns, and tassel back-ties.',
    chips: ['Padded Bridal Fit', 'Designer Cuts'],
    iconBg: 'bg-[#FFF7ED] dark:bg-orange-950/30',
    iconColor: 'text-[#F97316]',
    borderColor: 'border-orange-200 dark:border-orange-900/40',
    chipBg: 'bg-[#FFF7ED] text-[#C2410C] dark:bg-orange-950/40 dark:text-orange-300',
    link: '/customize',
  },
  {
    icon: Shirt,
    name: 'Custom Kurtis & Dresses',
    tag: 'Women\'s Fashion',
    desc: 'Bespoke Anarkalis, lehenga cholis, designer ethnic kurtis, and expert garment alterations.',
    chips: ['Designer Kurtis', 'Lehenga Tailoring'],
    iconBg: 'bg-[#FFE4E6] dark:bg-rose-950/30',
    iconColor: 'text-[#E11D48]',
    borderColor: 'border-rose-200 dark:border-rose-900/40',
    chipBg: 'bg-[#FFE4E6] text-[#BE123C] dark:bg-rose-950/40 dark:text-rose-300',
    link: '/services',
  },
  {
    icon: Gem,
    name: '1-Gram Gold Jewellery',
    tag: 'Bridal Accessories',
    desc: 'Antique temple necklace sets, bridal chokers, jhumkas, and premium gold-plated bangles.',
    chips: ['Temple Jewellery', 'Bridal Sets'],
    iconBg: 'bg-[#FEF3C7] dark:bg-amber-950/30',
    iconColor: 'text-[#D97706]',
    borderColor: 'border-amber-200 dark:border-amber-900/40',
    chipBg: 'bg-[#FEF3C7] text-[#B45309] dark:bg-amber-950/40 dark:text-amber-300',
    link: '/products',
  },
  {
    icon: Gift,
    name: 'Customized Gifts & Packaging',
    tag: 'Festive & Trousseau',
    desc: 'Custom photo gifts, personalized bridal trousseau packaging, and festive bulk gift boxes.',
    chips: ['Photo Gifts', 'Trousseau Boxes'],
    iconBg: 'bg-[#FDF2F8] dark:bg-fuchsia-950/30',
    iconColor: 'text-[#8B5CF6]',
    borderColor: 'border-fuchsia-200 dark:border-fuchsia-900/40',
    chipBg: 'bg-[#FDF2F8] text-[#7E22CE] dark:bg-fuchsia-950/40 dark:text-fuchsia-300',
    link: '/services',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white dark:bg-[#111827] border-b border-[#E8EAF0] dark:border-slate-800">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="section-subtitle">Craftsmanship & Atelier</span>
          <h2 className="section-title text-[#252A34] dark:text-white">
            Bespoke <span className="text-gradient-pink">Services</span>
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto my-4 rounded-full" />
          <p className="text-[#64707D] dark:text-slate-300 text-sm font-sans leading-relaxed">
            Heritage craftsmanship meets modern fashion precision — tailored to your exact style and celebrations.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.name}
                className="service-card flex flex-col justify-between bg-white dark:bg-[#1F2937] border border-[#E8EAF0] dark:border-slate-800 rounded-2xl p-7 hover:border-pink-400 hover:shadow-card-hover transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div>
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-14 h-14 ${service.iconBg} ${service.iconColor} rounded-2xl flex items-center justify-center border ${service.borderColor} group-hover:scale-105 transition-transform shadow-subtle`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="badge-soft text-[10px] font-bold tracking-wider uppercase">
                      {service.tag}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="font-display font-bold text-lg text-[#252A34] dark:text-white mb-2 group-hover:text-pink-600 transition-colors">
                    {service.name}
                  </h3>

                  {/* Short 1-Line Description */}
                  <p className="text-[#64707D] dark:text-slate-300 text-xs font-sans leading-relaxed mb-5">
                    {service.desc}
                  </p>

                  {/* Visual Feature Chips (Max 2, No Long Bullet Lists!) */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.chips.map((chip) => (
                      <span
                        key={chip}
                        className={`text-[11px] font-semibold px-3 py-1 rounded-full ${service.chipBg}`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Action */}
                <Link
                  to={service.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400 group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors uppercase tracking-wider pt-3 border-t border-[#E8EAF0] dark:border-slate-800"
                >
                  Explore Service <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
