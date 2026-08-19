import { motion } from 'framer-motion'
import { ShieldCheck, Clock, Star, Heart, Award, Truck } from 'lucide-react'

const pillars = [
  {
    icon: Award,
    title: 'Haute Couture Quality',
    desc: 'Authentic pure zari threads, fine fabrics, and master-crafted needlework in every fit.',
    iconBg: 'bg-[#FEF3C7] dark:bg-amber-950/30',
    iconColor: 'text-[#D97706]',
    border: 'border-amber-200 dark:border-amber-900/40',
  },
  {
    icon: Star,
    title: 'Master Tailor Expertise',
    desc: 'Specialized craftsmanship in South Indian bridal Maggam work, precision zari needlework, and bespoke silhouettes.',
    iconBg: 'bg-[#FFF1F6] dark:bg-pink-950/30',
    iconColor: 'text-[#E83E8C]',
    border: 'border-pink-200 dark:border-pink-900/40',
  },
  {
    icon: Clock,
    title: 'Punctual Event Delivery',
    desc: 'Strict timeline tracking ensuring your bridal blouses and outfits arrive ready for celebrations.',
    iconBg: 'bg-[#F5F3FF] dark:bg-purple-950/30',
    iconColor: 'text-[#7C3AED]',
    border: 'border-purple-200 dark:border-purple-900/40',
  },
  {
    icon: Heart,
    title: 'Bespoke Personalization',
    desc: 'Personalized neckline cuts, armhole comfort, padding, and custom thread color alignments.',
    iconBg: 'bg-[#FFF7ED] dark:bg-orange-950/30',
    iconColor: 'text-[#F97316]',
    border: 'border-orange-200 dark:border-orange-900/40',
  },
  {
    icon: ShieldCheck,
    title: 'Alteration Guarantee',
    desc: 'Complimentary alteration support within 7 days of delivery for a 100% flawless silhouette.',
    iconBg: 'bg-[#ECFDF5] dark:bg-emerald-950/30',
    iconColor: 'text-[#059669]',
    border: 'border-emerald-200 dark:border-emerald-900/40',
  },
  {
    icon: Truck,
    title: 'Insured Doorstep Delivery',
    desc: 'Safe doorstep delivery across all locations with free shipping on orders above ₹500.',
    iconBg: 'bg-[#FDF2F8] dark:bg-fuchsia-950/30',
    iconColor: 'text-[#8B5CF6]',
    border: 'border-fuchsia-200 dark:border-fuchsia-900/40',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#F8F9FB] dark:bg-[#111827] border-b border-[#E8EAF0] dark:border-slate-800">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="section-subtitle">The Boutique Standard</span>
          <h2 className="section-title text-[#252A34] dark:text-white">
            Why Choose <span className="text-gradient-pink">SLV Women's</span>
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto my-4 rounded-full" />
          <p className="text-[#64707D] dark:text-slate-300 text-sm font-sans leading-relaxed">
            Delivering fine fabrics into luxury wearable art with uncompromising quality and perfect fittings.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                className="bg-white dark:bg-[#1F2937] p-7 rounded-2xl border border-[#E8EAF0] dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-pink-300 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  className={`w-13 h-13 ${pillar.iconBg} ${pillar.iconColor} border ${pillar.border} rounded-2xl flex items-center justify-center p-3 mb-5 group-hover:scale-105 transition-transform shadow-subtle`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-base font-bold text-[#252A34] dark:text-white mb-2 group-hover:text-pink-600 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-[#64707D] dark:text-slate-300 text-xs font-sans leading-relaxed">
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

