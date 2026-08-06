import { motion } from 'framer-motion'
import { ShieldCheck, Clock, Star, Heart, Award, Truck } from 'lucide-react'

const pillars = [
  {
    icon: Award,
    title: 'Haute Couture Quality',
    desc: 'Only authentic fabrics, fine threads, and genuine Zardosi work are crafted into your garments.',
  },
  {
    icon: Star,
    title: '10+ Years Master Craftsmanship',
    desc: 'Over a decade of dedicated expertise in South Indian bridal blouses and designer wear.',
  },
  {
    icon: Clock,
    title: 'Punctual Order Completion',
    desc: 'We respect your schedule and complete stitching and embroidery right on time for your events.',
  },
  {
    icon: Heart,
    title: 'Bespoke Personalization',
    desc: 'Fully custom fits, specialized sleeve cuts, neck alignments, and fabric print selections.',
  },
  {
    icon: ShieldCheck,
    title: 'Fit Alteration Guarantee',
    desc: 'Free alterations within 7 days of delivery to guarantee a flawless silhouette.',
  },
  {
    icon: Truck,
    title: 'Doorstep Delivery',
    desc: 'Insured delivery across all service locations on orders above ₹500.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.25em] mb-2 block">The Boutique Standard</span>
          <h2 className="section-title text-white">
            Why Choose <span className="text-gold-500">SLV Women's</span>
          </h2>
          <div className="h-px bg-charcoal-800 max-w-xs mx-auto my-4" />
          <p className="text-white/70 text-sm font-sans font-light leading-relaxed">
            We transform fine fabrics into luxury wearable art with uncompromising quality and personalized attention.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                className="bg-charcoal-900 p-8 border border-charcoal-800 hover:border-gold-500 transition-all duration-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-12 h-12 bg-black border border-charcoal-800 flex items-center justify-center text-gold-500 mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-white/60 text-xs font-sans font-light leading-relaxed">
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
