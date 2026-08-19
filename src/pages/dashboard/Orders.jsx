import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, Clock, Search } from 'lucide-react'
import api from '../../api/axios'
import { useState } from 'react'

const statusColors = {
  'Pending Confirmation': 'bg-amber-50 text-amber-800 border border-amber-200',
  order_received: 'bg-blue-50 text-blue-700 border border-blue-200',
  accepted: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  in_production: 'bg-pink-50 text-pink-700 border border-pink-200',
  embroidery_started: 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200',
  quality_check: 'bg-amber-50 text-amber-700 border border-amber-200',
  packed: 'bg-orange-50 text-orange-700 border border-orange-200',
  shipped: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
  out_for_delivery: 'bg-blue-50 text-blue-700 border border-blue-200',
  delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
}

export default function Orders() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/my').then((r) => r.data),
  })

  const orders = (data?.orders || []).filter((o) =>
    search === '' || o.orderNumber?.toLowerCase().includes(search.toLowerCase()) || o.status?.includes(search.toLowerCase())
  )

  if (isLoading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
    </div>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-3 border-b border-[#E5E7EB] gap-3">
        <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white">My Orders & Custom Bookings</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order number..."
            className="pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-charcoal-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF5F9] dark:bg-pink-950/30 flex items-center justify-center mx-auto mb-4 text-pink-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-display font-bold text-[#1F2937] dark:text-white">No orders found</h3>
          <p className="text-[#64748B] text-xs mt-1">Check out our boutique catalog to book bespoke tailoring.</p>
          <Link to="/products" className="btn-primary mt-6 inline-flex text-xs py-2.5 px-6">Explore Products</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link to={`/dashboard/orders/${order._id}`}
                className="flex items-center gap-4 p-4 sm:p-5 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 hover:border-pink-300 transition-all group shadow-soft hover:shadow-card">
                <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-fuchsia-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-soft">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-xs sm:text-sm text-[#1F2937] dark:text-white">#{order.orderNumber}</p>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${statusColors[order.status] || 'bg-[#FFF5F9] text-pink-700'}`}>
                      {order.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Booked on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">{order.items?.length} item(s) • Custom Atelier Booking</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-pink-600 dark:text-pink-400 text-sm sm:text-base price-tag">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] mt-1 group-hover:translate-x-1 transition-transform ml-auto" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
