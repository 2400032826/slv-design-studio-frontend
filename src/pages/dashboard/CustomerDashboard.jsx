import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, Heart, MapPin, Bell, Ruler, LogOut, ChevronRight, Home, Menu, X } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'
import { useState } from 'react'

const dashboardLinks = [
  { label: 'Overview', icon: Home, path: '/dashboard' },
  { label: 'My Orders', icon: Package, path: '/dashboard/orders' },
  { label: 'Wishlist', icon: Heart, path: '/dashboard/wishlist' },
  { label: 'Profile', icon: User, path: '/dashboard/profile' },
  { label: 'Saved Addresses', icon: MapPin, path: '/dashboard/addresses' },
  { label: 'Measurements', icon: Ruler, path: '/dashboard/measurements' },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-hero py-8">
        <div className="section-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-gold rounded-2xl flex items-center justify-center text-purple-900 font-display font-bold text-2xl shadow-gold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-white">{user?.name}</h1>
                <p className="text-white/60 text-sm">{user?.email}</p>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              {dashboardLinks.map(({ label, icon: Icon, path }) => {
                const isActive = path === '/dashboard' ? location.pathname === path : location.pathname.startsWith(path)
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors group ${
                      isActive
                        ? 'bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform ${isActive ? 'text-gold-500' : ''}`} />
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
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
