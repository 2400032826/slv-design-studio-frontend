import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, Clock, Search } from 'lucide-react'
import api from '../../api/axios'
import { useState } from 'react'

const statusColors = {
  'Pending Confirmation': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  order_received: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  accepted: 'bg-indigo-100 text-indigo-700',
  in_production: 'bg-purple-100 text-purple-700',
  embroidery_started: 'bg-pink-100 text-pink-700',
  quality_check: 'bg-yellow-100 text-yellow-700',
  packed: 'bg-orange-100 text-orange-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  out_for_delivery: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/my').then((r) => r.data),
  })

  const orders = (data?.orders || []).filter((o) =>
    search === '' || o.orderNumber.includes(search) || o.status.includes(search.toLowerCase())
  )

  if (isLoading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">My Bookings & Orders</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <Package className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No bookings found</p>
          <Link to="/products" className="btn-primary mt-4 inline-flex">Explore Collection</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/dashboard/orders/${order._id}`}
                className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-gold-300 transition-all group shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-gradient-royal rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 dark:text-white">#{order.orderNumber}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Booked on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.items?.length} item(s) · Direct Studio Booking</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gold-500 text-lg">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                  <ChevronRight className="w-5 h-5 text-gray-400 mt-1 group-hover:translate-x-1 transition-transform ml-auto" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
