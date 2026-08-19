import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, Heart, ShoppingBag, Star, ArrowRight, Clock, Scissors, Sparkles } from 'lucide-react'
import api from '../../api/axios'

export default function DashboardHome() {
  const { user } = useSelector((s) => s.auth)
  const wishlist = useSelector((s) => s.wishlist.items)

  const { data: ordersData } = useQuery({
    queryKey: ['my-orders-summary'],
    queryFn: () => api.get('/orders/my?limit=3').then((r) => r.data),
  })

  const orders = ordersData?.orders || []
  const totalOrders = ordersData?.total || 0

  const statusColors = {
    order_received: 'bg-blue-50 text-blue-700 border border-blue-200',
    accepted: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    in_production: 'bg-pink-50 text-pink-700 border border-pink-200',
    delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
    shipped: 'bg-amber-50 text-amber-700 border border-amber-200',
  }

  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: Package, color: 'bg-gradient-to-tr from-pink-500 to-fuchsia-600', link: '/dashboard/orders' },
    { label: 'Saved In Wishlist', value: wishlist.length, icon: Heart, color: 'bg-gradient-to-tr from-rose-500 to-pink-500', link: '/dashboard/wishlist' },
    { label: 'Active In Production', value: orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length, icon: Clock, color: 'bg-gradient-to-tr from-purple-500 to-pink-500', link: '/dashboard/orders' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-2xl p-6 text-white shadow-soft"
      >
        <h2 className="font-display text-xl sm:text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! ✨</h2>
        <p className="text-pink-100 text-xs sm:text-sm mt-1">Here is a summary of your recent orders, custom tailoring, and saved designs.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link to={stat.link} className="block bg-white dark:bg-[#1F2937] rounded-2xl p-5 border border-[#E5E7EB] dark:border-charcoal-800 hover:border-pink-300 shadow-soft hover:shadow-card transition-all group">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-soft`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#1F2937] dark:text-white price-tag">{stat.value}</p>
              <p className="text-xs text-[#64748B] dark:text-charcoal-400 mt-0.5 font-medium">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E7EB]">
          <h3 className="font-display text-base font-bold text-[#1F2937] dark:text-white">Recent Orders</h3>
          <Link to="/dashboard/orders" className="text-pink-600 font-bold text-xs hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingBag className="w-12 h-12 text-pink-300 mx-auto mb-3" />
            <p className="text-[#64748B] text-xs">No bookings or orders placed yet.</p>
            <Link to="/products" className="btn-primary mt-4 inline-flex text-xs py-2 px-6">Explore Products</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link key={order._id} to={`/dashboard/orders/${order._id}`}
                className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[#E5E7EB] dark:border-charcoal-800 hover:bg-[#F5F7FA] dark:hover:bg-charcoal-800 transition-colors group">
                <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-fuchsia-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-soft">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-[#1F2937] dark:text-white">Order #{order.orderNumber}</p>
                  <p className="text-[11px] text-[#64748B]">{order.items?.length} item(s) • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-pink-600 dark:text-pink-400 text-xs price-tag">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-[#FFF5F9] text-pink-700'}`}>
                    {order.status?.replace(/_/g, ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/products" className="bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-charcoal-800 rounded-2xl p-5 hover:border-pink-300 shadow-soft transition-all flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm text-[#1F2937] dark:text-white block">Browse Catalog</span>
            <span className="text-[11px] text-[#64748B]">Explore new arrivals & blouses</span>
          </div>
        </Link>
        <Link to="/customize" className="bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-charcoal-800 rounded-2xl p-5 hover:border-pink-300 shadow-soft transition-all flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm text-[#1F2937] dark:text-white block">Custom Studio</span>
            <span className="text-[11px] text-[#64748B]">Book embroidery & tailoring</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
