import { motion } from 'framer-motion'
import { ShieldCheck, Clock, Star, Heart, Award, Truck, Sparkles } from 'lucide-react'

const luxuryPillars = [
  {
    icon: Award,
    title: 'Haute Couture Quality',
    desc: 'Only authentic silks, premium Zardosi, and fine threadwork are used in every piece.',
  },
  {
    icon: Star,
    title: 'Master Atelier Craftsmanship',
    desc: 'Over 10+ years of dedicated expertise in Indian bridal wear and embroidery.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery Guarantee',
    desc: 'Punctual order completions to ensure your outfits are ready for your special events.',
  },
  {
    icon: Heart,
    title: 'Bespoke Customization',
    desc: '100% personalized fits, custom embroidery patterns, and custom fabric prints.',
  },
  {
    icon: ShieldCheck,
    title: 'Flawless Fit Guarantee',
    desc: 'Free alterations within 7 days to guarantee the perfect silhouette.',
  },
  {
    icon: Truck,
    title: 'Express Doorstep Delivery',
    desc: 'Free insured shipping across service locations on all orders above ₹500.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden text-white">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(212,175,55,0.6) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-2 block">The Boutique Standard</span>
          <h2 className="section-title text-white">
            Crafted with <span className="text-gradient-gold">Passion & Excellence</span>
          </h2>
          <div className="gold-divider max-w-xs mx-auto my-4" />
          <p className="text-beige-200/70 text-sm leading-relaxed">
            We transform fine fabrics into luxury wearable art with uncompromising quality and attention to detail.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {luxuryPillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                className="glass-dark p-8 rounded-3xl group border border-gold-500/20 hover:border-gold-500/50 transition-all duration-500 hover:-translate-y-1.5 shadow-luxury"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-maroon flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform duration-500 border border-gold-500/30 shadow-maroon">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-gold-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-beige-200/70 text-xs leading-relaxed font-light">
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
