import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  ShoppingCart, Heart, Search, Menu, X, User, Sun, Moon,
  ChevronDown, Phone, Mail, Star, LogOut, Settings, Package
} from 'lucide-react'
import { toggleCart, openCart, selectCartCount } from '../../store/slices/cartSlice'
import { logout, showLogin } from '../../store/slices/authSlice'
import { toggleTheme } from '../../store/slices/themeSlice'
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
  const { mode } = useSelector((state) => state.theme)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
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
      {/* Top bar */}
      <div className="hidden md:block bg-purple-950 text-white/80 text-xs py-2">
        <div className="section-container flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+919731912413" className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
              <Phone className="w-3 h-3" /> +91 9731912413
            </a>
            <a href="mailto:slvdesignstudio@gmail.com" className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
              <Mail className="w-3 h-3" /> slvdesignstudio@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gold-400">
              <Star className="w-3 h-3 fill-gold-400" /> Premium Boutique & Embroidery
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-lg border-b border-gold-200/30'
            : 'bg-white dark:bg-gray-950'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-royal rounded-xl flex items-center justify-center shadow-pink group-hover:shadow-gold transition-all duration-300">
                  <span className="text-white font-display font-bold text-lg">S</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-500 rounded-full border-2 border-white dark:border-gray-950" />
              </div>
              <div>
                <p className="font-display font-bold text-lg md:text-xl text-purple-900 dark:text-white leading-tight">
                  SLV Design
                </p>
                <p className="text-xs text-gold-500 font-semibold tracking-wider uppercase">Studio</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-gold-600 bg-gold-50 dark:bg-gold-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              <DarkModeToggle />

              {/* Wishlist */}
              <Link to="/dashboard/wishlist" className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Wishlist">
                <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-royal text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-royal rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                  </button>

                  <AnimatePresence>
                    {userDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-hero">
                          <p className="text-white font-semibold">{user?.name}</p>
                          <p className="text-white/60 text-xs">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <User className="w-4 h-4" /> My Dashboard
                          </Link>
                          <Link to="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <Package className="w-4 h-4" /> My Orders
                          </Link>
                          <Link to="/dashboard/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <Heart className="w-4 h-4" /> Wishlist
                          </Link>
                          <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <Settings className="w-4 h-4" /> Profile Settings
                          </Link>
                          <hr className="my-1 border-gray-100 dark:border-gray-800" />
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => dispatch(showLogin())}
                  className="hidden sm:flex btn-primary text-sm px-4 py-2"
                >
                  <User className="w-4 h-4" /> Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden"
            >
              <div className="section-container py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl font-medium text-sm ${
                      location.pathname === link.path
                        ? 'bg-gradient-royal text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <button
                    onClick={() => dispatch(showLogin())}
                    className="w-full btn-primary mt-4"
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
