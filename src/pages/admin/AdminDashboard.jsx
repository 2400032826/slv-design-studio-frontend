import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../api/axios'
import { adminLogout } from '../../store/slices/authSlice'
import {
  Package, Users, ShoppingCart, TrendingUp, DollarSign,
  AlertCircle, Clock, CheckCircle, XCircle, Home,
  Grid, Settings, Tag, Image, MessageSquare, Bell, LogOut, Menu, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

const sidebarLinks = [
  { label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Gallery', icon: Image, path: '/admin/gallery' },
  { label: 'Offers', icon: Tag, path: '/admin/offers' },
  { label: 'Reviews', icon: MessageSquare, path: '/admin/reviews' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
]

export function AdminSidebar({ isOpen, onToggle }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { admin } = useSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(adminLogout())
    navigate('/admin/login')
    toast.success('Logged out')
  }

  return (
    <aside className={`fixed left-0 top-0 h-full z-40 bg-gray-950 border-r border-gray-800 transition-all duration-300 flex flex-col ${isOpen ? 'w-60' : 'w-16'}`}>
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-royal rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        {isOpen && (
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">SLV Studio</p>
            <p className="text-gold-400 text-xs">Admin Panel</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 px-2">
        {sidebarLinks.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path
          return (
            <Link key={path} to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                isActive ? 'bg-gradient-royal text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              } ${!isOpen && 'justify-center'}`}
              title={!isOpen ? label : ''}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {isOpen && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-800 space-y-2">
        {isOpen && (
          <div className="px-2 py-1">
            <p className="text-white text-xs font-medium truncate">{admin?.name || 'Admin'}</p>
            <p className="text-gray-500 text-xs truncate">{admin?.email}</p>
          </div>
        )}
        <button onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl w-full text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors text-sm ${!isOpen && 'justify-center'}`}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

function StatCard({ title, value, icon: Icon, gradient }) {
  return (
    <motion.div className={`${gradient} rounded-2xl p-5 text-white`} whileHover={{ y: -2 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/70 text-sm">{title}</p>
        <Icon className="w-5 h-5 text-white/80" />
      </div>
      <p className="text-3xl font-bold font-display">{value}</p>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard', { headers: { Authorization: `Bearer ${localStorage.getItem('slv_admin_token')}` } }).then((r) => r.data),
  })

  const stats = data?.stats || {}
  const recentOrders = data?.recentOrders || []
  const revenueChart = data?.revenueChart || []
  const lowStock = data?.lowStockProducts || []

  const chartData = revenueChart.map((item) => ({
    name: new Date(2024, (item._id?.month || 1) - 1).toLocaleString('default', { month: 'short' }),
    revenue: item.revenue || 0,
    orders: item.orders || 0,
  }))

  const statusColors = {
    order_received: 'bg-blue-100 text-blue-700',
    accepted: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    shipped: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} icon={DollarSign} gradient="bg-gradient-royal" />
            <StatCard title="Total Orders" value={stats.totalOrders || 0} icon={ShoppingCart} gradient="bg-gradient-to-br from-green-600 to-green-700" />
            <StatCard title="Customers" value={stats.totalUsers || 0} icon={Users} gradient="bg-gradient-to-br from-blue-600 to-blue-700" />
            <StatCard title="Products" value={stats.totalProducts || 0} icon={Package} gradient="bg-gradient-to-br from-gold-600 to-gold-700" />
            <StatCard title="Pending" value={stats.pendingOrders || 0} icon={Clock} gradient="bg-gradient-to-br from-yellow-600 to-orange-600" />
            <StatCard title="Delivered" value={stats.completedOrders || 0} icon={CheckCircle} gradient="bg-gradient-to-br from-green-500 to-teal-600" />
            <StatCard title="Cancelled" value={stats.cancelledOrders || 0} icon={XCircle} gradient="bg-gradient-to-br from-red-600 to-red-700" />
            <StatCard title="Today" value={stats.todayOrders || 0} icon={TrendingUp} gradient="bg-gradient-to-br from-purple-600 to-pink-600" />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Revenue (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ borderRadius: '12px' }} />
                <Bar dataKey="revenue" fill="#C9A84C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
                <Link to="/admin/orders" className="text-gold-500 text-sm hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{order.user?.name}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm text-gold-500">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No recent orders</p>}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Low Stock Alert</h2>
              </div>
              <div className="space-y-3">
                {lowStock.map((product) => (
                  <div key={product._id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                      {product.images?.[0]?.url && <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{product.name}</p>
                      <p className="text-xs text-red-500 font-medium">Only {product.stock} left</p>
                    </div>
                    <Link to="/admin/products" className="text-xs text-gold-500 hover:underline">Update</Link>
                  </div>
                ))}
                {lowStock.length === 0 && <p className="text-gray-400 text-sm text-center py-4">✓ All products well stocked</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
