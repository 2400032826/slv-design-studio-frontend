import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'
import api from '../api/axios'

const serviceCategories = [
  {
    id: 'embroidery', name: 'Computer Embroidery', emoji: '🧵', color: 'from-purple-900/80 to-pink-900/80', border: 'border-pink-500/40',
    services: ['Customized Name Embroidery', 'Logo Embroidery', 'School Uniform Embroidery', 'Corporate Uniform Embroidery']
  },
  {
    id: 'printing', name: 'Custom Printing', emoji: '🖨️', color: 'from-gold-900/60 to-purple-900/80', border: 'border-gold-500/40',
    services: ['DTF Printing', 'Screen Printing', 'Photo Printing', 'T-Shirt Printing', 'Custom Printing']
  },
  {
    id: 'stitching', name: 'Blouse Stitching', emoji: '👗', color: 'from-pink-900/80 to-purple-900/60', border: 'border-purple-500/40',
    services: ['Wedding Blouse Stitching', 'Designer Blouse Stitching', 'Simple Blouse Stitching', 'Bridal Blouse Stitching']
  },
  {
    id: 'tailoring', name: "Men's & Women's Tailoring", emoji: '✂️', color: 'from-purple-900/70 to-gold-900/60', border: 'border-gold-500/30',
    services: ["Men's Shirt Stitching", 'Pant Stitching', 'Kurti Stitching', 'Chudidar Stitching', 'Kids Dress Stitching', 'Lehenga Stitching']
  },
  {
    id: 'alterations', name: 'Alterations & More', emoji: '⚙️', color: 'from-pink-900/60 to-purple-900/80', border: 'border-pink-500/30',
    services: ['Saree Fall Pico', 'Alterations', 'Custom Logo Creation', 'Customized Gifts', '1 Gram Gold Jewellery']
  },
]

export default function Services() {
  const { data } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then((r) => r.data.services),
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-hero py-16">
        <div className="section-container text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold-400 text-sm font-semibold uppercase tracking-widest">
            What We Offer
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-white mt-2">
            Our <span className="text-gradient-gold">Services</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/60 mt-3 max-w-xl mx-auto">
            From premium embroidery to expert tailoring — we craft your fashion dreams with artisanal precision.
          </motion.p>
        </div>
      </div>

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category, i) => (
            <motion.div
              key={category.id}
              className={`bg-gradient-to-br ${category.color} border ${category.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl mb-4">{category.emoji}</div>
              <h2 className="font-display text-xl font-bold text-white mb-4">{category.name}</h2>
              <ul className="space-y-2 mb-6">
                {category.services.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <Link to="/customize" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
                Get a Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center bg-gradient-royal rounded-2xl p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to Start Your Custom Order?</h2>
          <p className="text-white/70 mb-6">Contact us today or use our customization tool to design your perfect piece.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/customize" className="btn-gold">Start Customizing</Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-purple-900">Contact Us</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
