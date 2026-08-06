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
  Settings, Tag, Image, MessageSquare, LogOut, Menu
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
    <aside className={`fixed left-0 top-0 h-full z-40 bg-black text-white transition-all duration-200 flex flex-col ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-5 border-b border-charcoal-800 flex items-center gap-3.5">
        <div className="w-10 h-10 bg-black border border-charcoal-700 flex items-center justify-center flex-shrink-0">
          <span className="text-gold-500 font-display font-bold text-lg">S</span>
        </div>
        {isOpen && (
          <div className="min-w-0">
            <p className="text-white font-display font-bold text-base truncate">SLV Atelier</p>
            <p className="text-gold-500 text-[10px] uppercase tracking-widest font-bold">Admin Portal</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3">
        {sidebarLinks.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path
          return (
            <Link key={path} to={path}
              className={`flex items-center gap-3.5 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all ${
                isActive ? 'bg-white text-black border-l-4 border-gold-500' : 'text-white/70 hover:text-white hover:bg-charcoal-900'
              } ${!isOpen && 'justify-center'}`}
              title={!isOpen ? label : ''}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-black' : 'text-gold-500'}`} />
              {isOpen && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-charcoal-800 space-y-2">
        {isOpen && (
          <div className="px-3 py-2 bg-charcoal-900 border border-charcoal-800">
            <p className="text-white text-xs font-semibold truncate">{admin?.name || 'Super Admin'}</p>
            <p className="text-gold-500 text-[10px] truncate">{admin?.email || 'admin@email.com'}</p>
          </div>
        )}
        <button onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-3 w-full text-white/80 hover:text-white hover:bg-charcoal-900 transition-colors text-xs uppercase tracking-wider font-bold ${!isOpen && 'justify-center'}`}>
          <LogOut className="w-4 h-4 text-gold-500 flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

function StatCard({ title, value, icon: Icon, bgClass }) {
  return (
    <motion.div className={`${bgClass} p-6 text-white shadow-subtle border border-[#EAEAEA] dark:border-charcoal-800`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <div className="w-8 h-8 bg-white/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gold-500" />
        </div>
      </div>
      <p className="text-3xl font-bold font-display text-white">{value}</p>
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
    order_received: 'bg-black text-white',
    accepted: 'bg-black text-white',
    delivered: 'bg-gold-500 text-black',
    cancelled: 'bg-red-600 text-white',
    shipped: 'bg-black text-white',
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 transition-all duration-200 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-black border-b border-[#EAEAEA] dark:border-charcoal-800 px-8 py-5 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 hover:text-gold-500 transition-colors">
            <Menu className="w-5 h-5 text-black dark:text-white" />
          </button>
          <h1 className="font-display text-2xl font-bold text-black dark:text-white">Executive Dashboard</h1>
        </div>

        <div className="p-8 space-y-8 max-w-7xl">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} icon={DollarSign} bgClass="bg-black" />
            <StatCard title="Total Orders" value={stats.totalOrders || 0} icon={ShoppingCart} bgClass="bg-black" />
            <StatCard title="Total Customers" value={stats.totalUsers || 0} icon={Users} bgClass="bg-black" />
            <StatCard title="Active Catalog" value={stats.totalProducts || 0} icon={Package} bgClass="bg-black" />
            <StatCard title="Pending Orders" value={stats.pendingOrders || 0} icon={Clock} bgClass="bg-black" />
            <StatCard title="Delivered Orders" value={stats.completedOrders || 0} icon={CheckCircle} bgClass="bg-black" />
            <StatCard title="Cancelled Orders" value={stats.cancelledOrders || 0} icon={XCircle} bgClass="bg-black" />
            <StatCard title="Today's Orders" value={stats.todayOrders || 0} icon={TrendingUp} bgClass="bg-black" />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-charcoal-900 p-6 border border-[#EAEAEA] dark:border-charcoal-800 shadow-subtle">
            <h2 className="font-display font-bold text-xl text-black dark:text-white mb-6">Revenue Analytics (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ background: '#000', color: '#FFF' }} />
                <Bar dataKey="revenue" fill="#D4AF37" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white dark:bg-charcoal-900 p-6 border border-[#EAEAEA] dark:border-charcoal-800 shadow-subtle">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display font-bold text-xl text-black dark:text-white">Recent Orders</h2>
                <Link to="/admin/orders" className="text-black dark:text-white text-xs font-bold uppercase tracking-wider hover:text-gold-500">View All</Link>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3.5 bg-[#F8F8F8] dark:bg-charcoal-800 border border-[#EAEAEA] dark:border-charcoal-700">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-black dark:text-white">#{order.orderNumber}</p>
                      <p className="text-xs text-[#666666]">{order.user?.name || 'Customer'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-black dark:text-white price-tag">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                      <span className={`text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider ${statusColors[order.status] || 'bg-black text-white'}`}>
                        {order.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && <p className="text-[#666666] text-sm text-center py-4">No recent orders found</p>}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white dark:bg-charcoal-900 p-6 border border-[#EAEAEA] dark:border-charcoal-800 shadow-subtle">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 text-gold-500" />
                <h2 className="font-display font-bold text-xl text-black dark:text-white">Low Stock Items</h2>
              </div>
              <div className="space-y-3">
                {lowStock.map((product) => (
                  <div key={product._id} className="flex items-center gap-3.5 p-3 bg-[#F8F8F8] dark:bg-charcoal-800 border border-[#EAEAEA] dark:border-charcoal-700">
                    <div className="w-10 h-10 bg-white flex-shrink-0 border border-[#EAEAEA]">
                      {product.images?.[0]?.url && <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-black dark:text-white truncate">{product.name}</p>
                      <p className="text-xs text-gold-500 font-semibold">Only {product.stock} left in stock</p>
                    </div>
                    <Link to="/admin/products" className="btn-outline text-[10px] px-3 py-1">Restock</Link>
                  </div>
                ))}
                {lowStock.length === 0 && <p className="text-[#666666] text-sm text-center py-4">✓ All catalog items are well stocked</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
