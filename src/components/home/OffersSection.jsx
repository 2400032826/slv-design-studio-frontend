import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Tag, Sparkles, Copy, Check } from 'lucide-react'
import api from '../../api/axios'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function OffersSection() {
  const [copiedCode, setCopiedCode] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['public-coupons'],
    queryFn: () => api.get('/coupons/public').then((r) => r.data.coupons),
    staleTime: 5 * 60 * 1000,
  })

  const fallbackCoupons = [
    { code: 'WELCOME10', type: 'percentage', value: 10, description: '10% off on your first bespoke blouse tailoring or custom embroidery order.', minOrderAmount: 500 },
    { code: 'BRIDAL500', type: 'fixed', value: 500, description: 'Flat ₹500 off on bridal Maggam blouses and wedding ensembles.', minOrderAmount: 2500 },
    { code: 'STUDIOFREE', type: 'fixed', value: 50, description: 'Complimentary shipping & doorstep delivery across all tailoring orders.', minOrderAmount: 499 },
  ]

  const activeCoupons = coupons.length > 0 ? coupons : fallbackCoupons

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Coupon code ${code} copied! 🎉`)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  return (
    <section className="py-20 bg-[#FFF5F9] dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-slate-800">
      <div className="section-container">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="section-subtitle">Special Promotions</span>
          <h2 className="section-title text-[#1F2937] dark:text-white">
            Exclusive <span className="text-gradient-pink">Offers & Coupons</span>
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto my-4 rounded-full" />
          <p className="text-[#64748B] dark:text-slate-300 text-sm max-w-md mx-auto">Apply active boutique discount vouchers on your next order!</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeCoupons.map((coupon, i) => (
              <motion.div
                key={coupon._id || coupon.code}
                className="bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-card hover:shadow-card-hover hover:border-pink-300 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-soft">
                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#FFF5F9] dark:bg-pink-950/30 flex items-center justify-center text-pink-600 mb-4">
                  <Tag className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1F2937] dark:text-white mb-1">{coupon.code}</h3>
                <p className="text-[#64748B] dark:text-slate-300 text-xs mb-5">
                  {coupon.description || `Get ${coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`} off on orders${coupon.minOrderAmount ? ` above ₹${coupon.minOrderAmount}` : ''}!`}
                </p>
                <div className="flex items-center justify-between bg-[#F5F7FA] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-3 mb-4">
                  <div>
                    <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Coupon Code</p>
                    <p className="text-pink-600 dark:text-pink-400 font-mono font-bold tracking-widest text-base">{coupon.code}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="p-2 rounded-lg bg-white dark:bg-[#1F2937] border border-[#E5E7EB] text-[#64748B] hover:text-pink-600 hover:border-pink-300 transition-colors"
                    title="Copy code"
                  >
                    {copiedCode === coupon.code ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <Link to="/products" className="inline-flex items-center gap-1.5 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider hover:text-pink-700 transition-colors">
                  Shop Products & Apply <Sparkles className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
