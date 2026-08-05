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
    <aside className={`fixed left-0 top-0 h-full z-40 bg-charcoal-950 border-r border-charcoal-800 transition-all duration-300 flex flex-col ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-5 border-b border-charcoal-800 flex items-center gap-3.5">
        <div className="w-10 h-10 bg-gradient-maroon rounded-2xl flex items-center justify-center flex-shrink-0 border border-gold-500/30 shadow-maroon">
          <span className="text-gold-300 font-display font-bold text-lg">S</span>
        </div>
        {isOpen && (
          <div className="min-w-0">
            <p className="text-white font-display font-bold text-base truncate">SLV Atelier</p>
            <p className="text-gold-400 text-[10px] uppercase tracking-widest font-bold">Admin Portal</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3">
        {sidebarLinks.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path
          return (
            <Link key={path} to={path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all text-xs uppercase tracking-wider font-semibold ${
                isActive ? 'bg-gradient-maroon text-white shadow-maroon' : 'text-beige-300/70 hover:text-white hover:bg-charcoal-900'
              } ${!isOpen && 'justify-center'}`}
              title={!isOpen ? label : ''}
            >
              <Icon className="w-4 h-4 flex-shrink-0 text-gold-400" />
              {isOpen && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-charcoal-800 space-y-2">
        {isOpen && (
          <div className="px-2 py-1.5 bg-charcoal-900 rounded-2xl border border-charcoal-800">
            <p className="text-white text-xs font-semibold truncate">{admin?.name || 'Super Admin'}</p>
            <p className="text-beige-300/60 text-[10px] truncate">{admin?.email || 'admin@email.com'}</p>
          </div>
        )}
        <button onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-maroon-300 hover:text-maroon-100 hover:bg-maroon-900/30 transition-colors text-xs uppercase tracking-wider font-bold ${!isOpen && 'justify-center'}`}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

function StatCard({ title, value, icon: Icon, gradient }) {
  return (
    <motion.div className={`${gradient} rounded-3xl p-6 text-white shadow-luxury border border-gold-500/20`} whileHover={{ y: -3 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-beige-100/80 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
          <Icon className="w-5 h-5 text-gold-300" />
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
    order_received: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    accepted: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
    delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    cancelled: 'bg-maroon-100 dark:bg-maroon-900/30 text-maroon-800 dark:text-maroon-300',
    shipped: 'bg-gold-100 dark:bg-gold-900/30 text-gold-800 dark:text-gold-300',
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-charcoal-950 flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-xl border-b border-beige-200 dark:border-charcoal-800 px-8 py-5 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 rounded-2xl hover:bg-beige-100 dark:hover:bg-charcoal-800 transition-colors">
            <Menu className="w-5 h-5 text-charcoal-700 dark:text-beige-200" />
          </button>
          <h1 className="font-display text-2xl font-bold text-charcoal-900 dark:text-white">Executive Dashboard</h1>
        </div>

        <div className="p-8 space-y-8 max-w-7xl">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} icon={DollarSign} gradient="bg-gradient-maroon" />
            <StatCard title="Total Orders" value={stats.totalOrders || 0} icon={ShoppingCart} gradient="bg-gradient-to-br from-charcoal-900 to-maroon-950" />
            <StatCard title="Total Customers" value={stats.totalUsers || 0} icon={Users} gradient="bg-gradient-to-br from-charcoal-800 to-charcoal-900" />
            <StatCard title="Active Catalog" value={stats.totalProducts || 0} icon={Package} gradient="bg-gradient-gold text-maroon-950" />
            <StatCard title="Pending Confirmation" value={stats.pendingOrders || 0} icon={Clock} gradient="bg-gradient-to-br from-gold-600 to-gold-700" />
            <StatCard title="Completed Orders" value={stats.completedOrders || 0} icon={CheckCircle} gradient="bg-gradient-to-br from-emerald-800 to-emerald-950" />
            <StatCard title="Cancelled Orders" value={stats.cancelledOrders || 0} icon={XCircle} gradient="bg-gradient-to-br from-maroon-800 to-maroon-950" />
            <StatCard title="Today's Orders" value={stats.todayOrders || 0} icon={TrendingUp} gradient="bg-gradient-rosegold text-maroon-950" />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-charcoal-900 rounded-3xl p-8 border border-beige-200 dark:border-charcoal-800 shadow-luxury">
            <h2 className="font-display font-bold text-xl text-charcoal-900 dark:text-white mb-6">Revenue Analytics (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ borderRadius: '16px', background: '#1A1A1A', color: '#FFF', border: '1px solid #D4AF37' }} />
                <Bar dataKey="revenue" fill="#D4AF37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white dark:bg-charcoal-900 rounded-3xl p-8 border border-beige-200 dark:border-charcoal-800 shadow-luxury">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display font-bold text-xl text-charcoal-900 dark:text-white">Recent Orders</h2>
                <Link to="/admin/orders" className="text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider hover:underline">View All</Link>
              </div>
              <div className="space-y-3.5">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 rounded-2xl bg-beige-50 dark:bg-charcoal-800/60 border border-beige-200/50 dark:border-charcoal-700/50">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-charcoal-900 dark:text-white">#{order.orderNumber}</p>
                      <p className="text-xs text-charcoal-500 dark:text-beige-300">{order.user?.name || 'Customer'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gold-600 dark:text-gold-400 price-tag">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && <p className="text-charcoal-400 text-sm text-center py-6">No recent orders found</p>}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white dark:bg-charcoal-900 rounded-3xl p-8 border border-beige-200 dark:border-charcoal-800 shadow-luxury">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 text-maroon-600" />
                <h2 className="font-display font-bold text-xl text-charcoal-900 dark:text-white">Inventory Alerts</h2>
              </div>
              <div className="space-y-3.5">
                {lowStock.map((product) => (
                  <div key={product._id} className="flex items-center gap-4 p-3.5 rounded-2xl bg-maroon-50 dark:bg-maroon-950/30 border border-maroon-200 dark:border-maroon-800/40">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-beige-100 dark:bg-charcoal-800 flex-shrink-0 border border-maroon-200">
                      {product.images?.[0]?.url && <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-charcoal-900 dark:text-white truncate">{product.name}</p>
                      <p className="text-xs text-maroon-600 dark:text-maroon-400 font-semibold">Only {product.stock} units remaining</p>
                    </div>
                    <Link to="/admin/products" className="btn-outline text-[11px] px-3.5 py-1.5">Restock</Link>
                  </div>
                ))}
                {lowStock.length === 0 && <p className="text-charcoal-500 dark:text-beige-300 text-sm text-center py-6">✓ All catalog items are fully stocked</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
