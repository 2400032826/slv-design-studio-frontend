import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, Heart, MapPin, Bell, Ruler, LogOut, ChevronRight, Home, Menu, X, Sparkles } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'
import { useState } from 'react'

const dashboardLinks = [
  { label: 'Overview', icon: Home, path: '/dashboard' },
  { label: 'My Orders & Bookings', icon: Package, path: '/dashboard/orders' },
  { label: 'Saved Wishlist', icon: Heart, path: '/dashboard/wishlist' },
  { label: 'Profile Settings', icon: User, path: '/dashboard/profile' },
  { label: 'Saved Addresses', icon: MapPin, path: '/dashboard/addresses' },
  { label: 'Body Measurements', icon: Ruler, path: '/dashboard/measurements' },
  { label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
]

export default function CustomerDashboard() {
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    toast.success('Logged out successfully')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      {/* Header */}
      <div className="bg-[#F5F7FA] dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 py-8">
        <div className="section-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl shadow-soft">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl font-bold text-[#1F2937] dark:text-white">{user?.name || 'Customer'}</h1>
                  <span className="badge badge-soft text-[10px]">Client</span>
                </div>
                <p className="text-[#64748B] dark:text-charcoal-400 text-xs font-medium">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] rounded-xl flex items-center justify-center text-[#1F2937] dark:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-card overflow-hidden">
              {dashboardLinks.map(({ label, icon: Icon, path }) => {
                const isActive = path === '/dashboard' ? location.pathname === path : location.pathname.startsWith(path)
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 border-b border-[#E5E7EB] dark:border-charcoal-800 last:border-0 transition-colors group ${
                      isActive
                        ? 'bg-[#FFF5F9] dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 font-bold border-l-4 border-l-pink-500'
                        : 'text-[#64748B] dark:text-charcoal-300 hover:bg-[#F5F7FA] dark:hover:bg-charcoal-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-pink-600' : 'text-[#64748B]'}`} />
                      <span className="text-xs font-semibold">{label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-[#94A3B8] group-hover:translate-x-0.5 transition-transform ${isActive ? 'text-pink-600' : ''}`} />
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
