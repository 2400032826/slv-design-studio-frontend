import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, Heart, ShoppingBag, Star, ArrowRight, Clock } from 'lucide-react'
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
    order_received: 'bg-blue-100 text-blue-700',
    accepted: 'bg-indigo-100 text-indigo-700',
    in_production: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    shipped: 'bg-yellow-100 text-yellow-700',
  }

  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: Package, color: 'bg-gradient-royal', link: '/dashboard/orders' },
    { label: 'Wishlist Items', value: wishlist.length, icon: Heart, color: 'bg-pink-500', link: '/dashboard/wishlist' },
    { label: 'Pending Orders', value: orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length, icon: Clock, color: 'bg-gold-500', link: '/dashboard/orders' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-royal rounded-2xl p-6 text-white">
        <h2 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-white/70 mt-1">Here's what's happening with your orders</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={stat.link} className="block bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:border-gold-300 transition-all group">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
          <Link to="/dashboard/orders" className="text-gold-500 text-sm hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingBag className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No orders yet</p>
            <Link to="/products" className="btn-primary mt-4 inline-flex text-sm py-2">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link key={order._id} to={`/dashboard/orders/${order._id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                <div className="w-10 h-10 bg-gradient-royal rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{order.items?.length} item(s)</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gold-500 text-sm">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status?.replace(/_/g, ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/products" className="bg-gradient-royal rounded-2xl p-5 text-white hover:opacity-90 transition-opacity flex items-center gap-3">
          <ShoppingBag className="w-6 h-6" />
          <span className="font-semibold">Browse Products</span>
        </Link>
        <Link to="/customize" className="bg-gradient-gold rounded-2xl p-5 text-purple-900 hover:opacity-90 transition-opacity flex items-center gap-3">
          <Star className="w-6 h-6" />
          <span className="font-semibold">Customize Design</span>
        </Link>
      </div>
    </div>
  )
}
