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
  Settings, Tag, Image, MessageSquare, LogOut, Menu, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

const sidebarLinks = [
  { label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
  { label: 'Products Catalog', icon: Package, path: '/admin/products' },
  { label: 'Orders & Bookings', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Portfolio Lookbook', icon: Image, path: '/admin/gallery' },
  { label: 'Coupons & Offers', icon: Tag, path: '/admin/offers' },
  { label: 'Client Reviews', icon: MessageSquare, path: '/admin/reviews' },
  { label: 'Studio Settings', icon: Settings, path: '/admin/settings' },
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
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full z-50 bg-[#1F2937] text-white transition-all duration-200 flex flex-col ${
          isOpen
            ? 'w-64 translate-x-0 shadow-2xl'
            : '-translate-x-full md:translate-x-0 md:w-20'
        }`}
      >
        <div className="p-4 sm:p-5 border-b border-slate-700/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/slv-logo.png"
              alt="SLV Women's Fashion Studio"
              className="w-10 h-10 rounded-full object-contain flex-shrink-0 shadow-soft"
            />
            {(isOpen || typeof window !== 'undefined' && window.innerWidth < 768) && (
              <div className="min-w-0">
                <p className="text-white font-display font-bold text-sm truncate">SLV Design Studio</p>
                <p className="text-pink-400 text-[10px] uppercase tracking-widest font-bold">Admin Portal</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3">
          {sidebarLinks.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                onClick={() => {
                  if (window.innerWidth < 768 && onToggle) onToggle()
                }}
                className={`flex items-center gap-3.5 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                  isActive ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-soft font-bold' : 'text-white/70 hover:text-white hover:bg-white/5'
                } ${!isOpen && 'md:justify-center'}`}
                title={!isOpen ? label : ''}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-pink-400'}`} />
                {(isOpen || (typeof window !== 'undefined' && window.innerWidth < 768)) && <span className="truncate">{label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50 space-y-2">
          {isOpen && (
            <div className="px-3 py-2 bg-slate-800/80 rounded-xl border border-white/5">
              <p className="text-white text-xs font-semibold truncate">{admin?.name || 'Super Admin'}</p>
              <p className="text-pink-400 text-[10px] truncate">{admin?.email || 'admin@slvstudio.com'}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 w-full text-rose-400 hover:text-rose-300 hover:bg-white/5 transition-colors text-xs font-bold rounded-xl ${!isOpen && 'md:justify-center'}`}
          >
            <LogOut className="w-4 h-4 text-rose-400 flex-shrink-0" />
            {(isOpen || (typeof window !== 'undefined' && window.innerWidth < 768)) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

function StatCard({ title, value, icon: Icon, gradient = 'from-pink-500 to-fuchsia-600' }) {
  return (
    <motion.div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-soft hover:shadow-card transition-all" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#64748B] dark:text-charcoal-400 text-xs font-bold uppercase tracking-wider">{title}</p>
        <div className={`w-9 h-9 bg-gradient-to-tr ${gradient} rounded-xl flex items-center justify-center text-white shadow-soft`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold font-display text-[#1F2937] dark:text-white price-tag">{value}</p>
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
    order_received: 'bg-blue-50 text-blue-700 border border-blue-200',
    accepted: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
    shipped: 'bg-amber-50 text-amber-700 border border-amber-200',
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]/50 dark:bg-[#111827] flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 transition-all duration-200 ml-0 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-[#F5F7FA] rounded-xl border border-[#E5E7EB] text-[#64748B] transition-colors">
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="font-display text-base sm:text-xl font-bold text-[#1F2937] dark:text-white truncate">Executive Atelier Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-soft text-[10px] hidden sm:inline-flex">Realtime Synced</span>
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-6 max-w-7xl">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} icon={DollarSign} gradient="from-pink-500 to-rose-500" />
            <StatCard title="Total Orders" value={stats.totalOrders || 0} icon={ShoppingCart} gradient="from-fuchsia-500 to-purple-600" />
            <StatCard title="Registered Clients" value={stats.totalUsers || 0} icon={Users} gradient="from-pink-500 to-fuchsia-600" />
            <StatCard title="Active Catalog" value={stats.totalProducts || 0} icon={Package} gradient="from-rose-500 to-pink-500" />
            <StatCard title="Pending Orders" value={stats.pendingOrders || 0} icon={Clock} gradient="from-amber-500 to-orange-500" />
            <StatCard title="Completed Orders" value={stats.completedOrders || 0} icon={CheckCircle} gradient="from-emerald-500 to-teal-500" />
            <StatCard title="Cancelled Bookings" value={stats.cancelledOrders || 0} icon={XCircle} gradient="from-rose-500 to-red-600" />
            <StatCard title="Today's Orders" value={stats.todayOrders || 0} icon={TrendingUp} gradient="from-pink-500 to-fuchsia-600" />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
            <h2 className="font-display font-bold text-base text-[#1F2937] dark:text-white mb-6">Revenue Analytics (Recent Months)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ background: '#1F2937', color: '#FFF', borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="revenue" fill="#EC4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#E5E7EB]">
                <h2 className="font-display font-bold text-sm text-[#1F2937] dark:text-white">Recent Orders</h2>
                <Link to="/admin/orders" className="text-pink-600 text-xs font-bold hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5F7FA] dark:bg-charcoal-800 border border-[#E5E7EB] dark:border-charcoal-700">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#1F2937] dark:text-white">#{order.orderNumber}</p>
                      <p className="text-[11px] text-[#64748B]">{order.user?.name || 'Customer'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xs text-pink-600 dark:text-pink-400 price-tag">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                      <span className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-full ${statusColors[order.status] || 'bg-white text-[#1F2937]'}`}>
                        {order.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && <p className="text-[#64748B] text-xs text-center py-4">No recent bookings found</p>}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E5E7EB]">
                <AlertCircle className="w-4 h-4 text-pink-600" />
                <h2 className="font-display font-bold text-sm text-[#1F2937] dark:text-white">Low Stock Monitor</h2>
              </div>
              <div className="space-y-3">
                {lowStock.map((product) => (
                  <div key={product._id} className="flex items-center gap-3.5 p-3 rounded-xl bg-[#F5F7FA] dark:bg-charcoal-800 border border-[#E5E7EB] dark:border-charcoal-700">
                    <div className="w-10 h-10 bg-white rounded-lg flex-shrink-0 border border-[#E5E7EB] overflow-hidden">
                      {product.images?.[0]?.url && <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-[#1F2937] dark:text-white truncate">{product.name}</p>
                      <p className="text-[11px] text-rose-500 font-semibold">Only {product.stock} units left</p>
                    </div>
                    <Link to="/admin/products" className="btn-secondary text-[10px] px-3 py-1 font-bold">Restock</Link>
                  </div>
                ))}
                {lowStock.length === 0 && <p className="text-[#64748B] text-xs text-center py-4">✓ All catalog items are well stocked</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
