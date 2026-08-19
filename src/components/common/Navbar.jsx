import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  ShoppingCart, Heart, Search, Menu, X, User,
  ChevronDown, Phone, Mail, Sparkles, LogOut, Settings, Package
} from 'lucide-react'
import { openCart, selectCartCount } from '../../store/slices/cartSlice'
import { logout, showLogin } from '../../store/slices/authSlice'
import SearchModal from './SearchModal'
import DarkModeToggle from './DarkModeToggle'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Services', path: '/services' },
  { label: 'Customize', path: '/customize' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const cartCount = useSelector(selectCartCount)
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserDropdown(false)
  }, [location])

  const handleCartClick = () => dispatch(openCart())
  const handleLogout = () => { dispatch(logout()); navigate('/') }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#F5F7FA] dark:bg-[#1F2937] text-[#64748B] dark:text-slate-300 text-xs py-2 border-b border-[#E5E7EB] dark:border-slate-800">
        <div className="section-container flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+919731912413" className="flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium">
              <Phone className="w-3.5 h-3.5 text-pink-500" /> +91 9731912413
            </a>
            <a href="mailto:slvdesignstudio@gmail.com" className="hidden sm:flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium">
              <Mail className="w-3.5 h-3.5 text-pink-500" /> slvdesignstudio@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5 fill-pink-500 text-pink-500" /> Custom Tailoring & Bridal Embroidery Studio
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md shadow-soft border-b border-[#E5E7EB] dark:border-slate-800'
            : 'bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-slate-800'
        }`}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                  <span className="text-white font-display font-bold text-xl">S</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-pink-500 rounded-full border-2 border-white dark:border-[#111827]" />
              </div>
              <div>
                <p className="font-display font-bold text-lg md:text-xl text-[#1F2937] dark:text-white leading-tight tracking-tight">
                  SLV Women's
                </p>
                <p className="text-[10px] text-pink-600 dark:text-pink-400 font-bold tracking-[0.2em] uppercase">Fashion Studio</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-pink-600 dark:text-pink-400 font-bold'
                        : 'text-[#1F2937] dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-[#FFF5F9] dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#1F2937] dark:text-white hover:bg-[#FFF5F9] dark:hover:bg-slate-800 hover:text-pink-600 transition-colors"
                title="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              <DarkModeToggle />

              {/* Wishlist Link */}
              <Link
                to="/dashboard/wishlist"
                className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-[#1F2937] dark:text-white hover:bg-[#FFF5F9] dark:hover:bg-slate-800 hover:text-pink-600 transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart Drawer Button */}
              <button
                onClick={handleCartClick}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[#1F2937] dark:text-white hover:bg-[#FFF5F9] dark:hover:bg-slate-800 hover:text-pink-600 transition-colors"
                title="Shopping Bag"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold shadow-soft">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* User Session Handler */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 hover:border-pink-300 hover:bg-[#FFF5F9] transition-all"
                  >
                    <div className="w-7 h-7 bg-gradient-to-tr from-pink-500 to-fuchsia-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-soft">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748B] dark:text-white hidden sm:block mr-1" />
                  </button>

                  <AnimatePresence>
                    {userDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#1F2937] rounded-2xl shadow-card-hover border border-[#E5E7EB] dark:border-slate-800 overflow-hidden z-50"
                      >
                        <div className="p-4 bg-gradient-to-br from-[#F5F7FA] to-[#FFF5F9] dark:from-slate-800 dark:to-slate-900 border-b border-[#E5E7EB] dark:border-slate-700">
                          <p className="font-display font-bold text-sm text-[#1F2937] dark:text-white">{user?.name}</p>
                          <p className="text-pink-600 dark:text-pink-400 text-xs mt-0.5 truncate">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#1F2937] dark:text-white hover:bg-[#FFF5F9] dark:hover:bg-slate-800 hover:text-pink-600 transition-colors">
                            <User className="w-4 h-4 text-pink-500" /> My Dashboard
                          </Link>
                          <Link to="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#1F2937] dark:text-white hover:bg-[#FFF5F9] dark:hover:bg-slate-800 hover:text-pink-600 transition-colors">
                            <Package className="w-4 h-4 text-pink-500" /> My Orders
                          </Link>
                          <Link to="/dashboard/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#1F2937] dark:text-white hover:bg-[#FFF5F9] dark:hover:bg-slate-800 hover:text-pink-600 transition-colors">
                            <Heart className="w-4 h-4 text-pink-500" /> Wishlist
                          </Link>
                          <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#1F2937] dark:text-white hover:bg-[#FFF5F9] dark:hover:bg-slate-800 hover:text-pink-600 transition-colors">
                            <Settings className="w-4 h-4 text-pink-500" /> Profile Settings
                          </Link>
                          <hr className="my-1 border-[#E5E7EB] dark:border-slate-700" />
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors">
                            <LogOut className="w-4 h-4 text-rose-500" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => dispatch(showLogin())}
                  className="hidden sm:flex btn-primary text-xs px-5 py-2.5 shadow-card"
                >
                  <User className="w-4 h-4" /> Login
                </button>
              )}

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[#1F2937] dark:text-white hover:bg-[#FFF5F9] transition-colors"
                title="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-card"
            >
              <div className="section-container py-5 space-y-1.5">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-4 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-soft font-bold'
                          : 'text-[#1F2937] dark:text-white hover:bg-[#FFF5F9] dark:hover:bg-slate-800'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
                {!isAuthenticated && (
                  <button
                    onClick={() => dispatch(showLogin())}
                    className="w-full btn-primary mt-4 text-xs tracking-wider"
                  >
                    <User className="w-4 h-4" /> Login / Register
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
