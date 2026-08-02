import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Tag, Sparkles } from 'lucide-react'
import api from '../../api/axios'

export default function OffersSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-coupons'],
    queryFn: () => api.get('/coupons/public').then((r) => r.data.coupons),
    staleTime: 5 * 60 * 1000,
  })

  const coupons = data || []

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="section-container">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-pink-500 text-sm font-semibold uppercase tracking-widest">Special Offers</span>
          <h2 className="section-title text-gray-900 dark:text-white mt-2">Exclusive <span className="text-gradient-gold">Deals</span></h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Active coupon codes for your bookings!</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-gray-700 dark:text-gray-300">No offers available</h3>
            <p className="text-gray-400 text-sm mt-1">Check back soon for new discounts and boutique deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.map((coupon, i) => (
              <motion.div
                key={coupon._id || coupon.code}
                className="bg-gradient-to-br from-purple-900 to-pink-900 border border-gold-500/40 rounded-2xl p-6 relative overflow-hidden group shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute top-4 right-4">
                  <span className="bg-gold-500 text-purple-900 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                  </span>
                </div>
                <Tag className="w-8 h-8 text-gold-400 mb-4" />
                <h3 className="font-display text-xl font-bold text-white mb-1">{coupon.code}</h3>
                <p className="text-white/70 text-sm mb-4">
                  {coupon.description || `Get ${coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`} off on orders${coupon.minOrderAmount ? ` above ₹${coupon.minOrderAmount}` : ''}!`}
                </p>
                <div className="bg-white/10 border border-white/20 rounded-xl p-3 mb-4">
                  <p className="text-xs text-white/50 mb-0.5">Use Code:</p>
                  <p className="text-gold-400 font-mono font-bold tracking-widest text-lg">{coupon.code}</p>
                </div>
                <Link to="/products" className="inline-flex items-center gap-2 text-white text-sm font-medium hover:text-gold-400 transition-colors">
                  Shop & Apply Code <Sparkles className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
