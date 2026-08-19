import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import api from '../api/axios'

const serviceCategories = [
  {
    id: 'embroidery', name: 'Computerized Embroidery', emoji: '🧵',
    services: ['Customized Name & Monogram', 'Corporate & School Logo Embroidery', 'Maggam-Style Zari Patterns', 'Saree & Dupatta Border Work']
  },
  {
    id: 'printing', name: 'Digital & DTF Apparel Printing', emoji: '🖨️',
    services: ['High-Definition DTF Printing', 'Direct Heat Press Application', 'Custom T-Shirt & Hoodie Graphics', 'Silk Dupatta Textile Printing']
  },
  {
    id: 'stitching', name: 'Designer Blouse Stitching', emoji: '👗',
    services: ['Bridal Maggam Blouse Stitching', 'Designer Padded Blouses', 'Traditional Kanjivaram Cuts', 'Deep Neck & Tassel Tie-Backs']
  },
  {
    id: 'mens-customization', name: "Men's Garment Customization", emoji: '👔',
    services: ['Logo & Name Embroidery on Shirts', 'Artwork & Graphic Heat Transfer', 'Corporate & Event Garment Branding', 'Kurta & Jacket Monogramming']
  },
  {
    id: 'tailoring', name: "Women's Ethnic Tailoring", emoji: '✂️',
    services: ['Bridal Lehenga Choli Tailoring', 'Designer Kurtis & Anarkalis', 'Chudidar & Salwar Suits', 'Saree Fall, Pico & Kuchu Tassels']
  },
  {
    id: 'jewellery-gifts', name: 'Jewellery & Customized Gifts', emoji: '💎',
    services: ['1-Gram Gold Temple Jewellery', 'Bridal Chokers & Jhumkas', 'Personalized Photo Gifts', 'Bespoke Trousseau Gift Boxes']
  },
]

export default function Services() {
  const { data } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then((r) => r.data.services),
  })

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      {/* Hero Header */}
      <div className="bg-[#F5F7FA] dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 py-16">
        <div className="section-container text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 badge badge-soft text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Atelier & Tailoring Services</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white">
            Boutique Services & <span className="text-gradient-pink">Craftsmanship</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[#64748B] dark:text-charcoal-400 text-xs sm:text-sm mt-3 leading-relaxed">
            From haute bridal computer embroidery to customized couture stitching — we bring precision, elegance, and perfect fit to every garment.
          </motion.p>
        </div>
      </div>

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category, i) => (
            <motion.div
              key={category.id}
              className="bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-charcoal-800 rounded-3xl p-6 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5F9] dark:bg-pink-950/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {category.emoji}
              </div>
              <h2 className="font-display text-lg font-bold text-[#1F2937] dark:text-white mb-4">{category.name}</h2>
              <ul className="space-y-2.5 mb-6 flex-1">
                {category.services.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-[#64748B] dark:text-charcoal-300 text-xs">
                    <CheckCircle className="w-4 h-4 text-pink-500 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <Link to="/customize" className="btn-secondary w-full text-xs font-bold py-2.5 justify-center mt-auto">
                Get a Quote <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center bg-[#F5F7FA] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-charcoal-800 rounded-3xl p-8 sm:p-12 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="badge badge-soft text-[10px] mb-3 inline-block">Direct Booking</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white mb-2">Ready for a Bespoke Fitting?</h2>
          <p className="text-[#64748B] dark:text-charcoal-400 text-xs sm:text-sm max-w-lg mx-auto mb-6">Connect directly with our master tailor or use our online studio to upload your ideas.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/customize" className="btn-primary text-xs py-3 px-8 font-bold">Launch Studio Customizer</Link>
            <Link to="/contact" className="btn-secondary text-xs py-3 px-8 font-bold">Contact Our Studio</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
