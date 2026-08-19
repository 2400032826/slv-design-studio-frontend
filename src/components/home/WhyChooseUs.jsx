import { motion } from 'framer-motion'
import { ShieldCheck, Clock, Star, Heart, Award, Truck } from 'lucide-react'

const pillars = [
  {
    icon: Award,
    title: 'Haute Couture Quality',
    desc: 'Only authentic fabrics, fine threads, and genuine Zardosi embroidery are crafted into your garments.',
  },
  {
    icon: Star,
    title: '10+ Years Craftsmanship',
    desc: 'Over a decade of dedicated expertise in South Indian bridal blouses and designer tailored wear.',
  },
  {
    icon: Clock,
    title: 'Punctual Completion',
    desc: 'We respect your event schedule and deliver custom stitching and embroidery right on time.',
  },
  {
    icon: Heart,
    title: 'Bespoke Personalization',
    desc: 'Fully custom fits, specialized sleeve cuts, neck alignments, and fabric print selections.',
  },
  {
    icon: ShieldCheck,
    title: 'Alteration Guarantee',
    desc: 'Free alterations within 7 days of delivery to guarantee a flawless fit and silhouette.',
  },
  {
    icon: Truck,
    title: 'Doorstep Delivery',
    desc: 'Insured delivery across all service locations with free delivery on orders above ₹500.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-slate-800">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="section-subtitle">The Boutique Standard</span>
          <h2 className="section-title text-[#1F2937] dark:text-white">
            Why Choose <span className="text-gradient-pink">SLV Women's</span>
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto my-4 rounded-full" />
          <p className="text-[#64748B] dark:text-slate-300 text-sm font-sans leading-relaxed">
            We transform fine fabrics into luxury wearable art with uncompromising quality, custom fittings, and dedicated attention.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                className="bg-[#F5F7FA] dark:bg-[#1F2937] p-8 rounded-2xl border border-[#E5E7EB] dark:border-slate-800 shadow-subtle hover:bg-white dark:hover:bg-slate-800 hover:shadow-card hover:border-pink-300 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-pink-500 group-hover:to-fuchsia-600 group-hover:text-white transition-all shadow-subtle">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#1F2937] dark:text-white mb-2 group-hover:text-pink-600 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-[#64748B] dark:text-slate-300 text-xs font-sans leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
