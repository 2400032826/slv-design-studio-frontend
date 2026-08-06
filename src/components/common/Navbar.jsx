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
      {/* Top Luxury Announcement Bar */}
      <div className="bg-burgundy-700 text-white text-xs py-2.5 border-b border-burgundy-800">
        <div className="section-container flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+919731912413" className="flex items-center gap-1.5 hover:text-gold-300 transition-colors">
              <Phone className="w-3.5 h-3.5 text-gold-400" /> +91 9731912413
            </a>
            <a href="mailto:slvdesignstudio@gmail.com" className="hidden sm:flex items-center gap-1.5 hover:text-gold-300 transition-colors">
              <Mail className="w-3.5 h-3.5 text-gold-400" /> slvdesignstudio@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gold-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 fill-gold-400 text-gold-400" /> SLV Women's Fashion Studio • Custom Tailoring & Embroidery
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-warmwhite/95 dark:bg-charcoal-950/95 backdrop-blur-md shadow-card border-b border-subtleborder dark:border-charcoal-800'
            : 'bg-warmwhite dark:bg-charcoal-950 border-b border-subtleborder dark:border-charcoal-800'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="relative">
                <div className="w-11 h-11 bg-burgundy-700 rounded-xl flex items-center justify-center shadow-subtle group-hover:bg-burgundy-800 transition-all duration-300 border border-burgundy-800">
                  <span className="text-gold-400 font-display font-bold text-xl">S</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold-500 rounded-full border-2 border-warmwhite dark:border-charcoal-950" />
              </div>
              <div>
                <p className="font-display font-bold text-lg md:text-xl text-charcoal-900 dark:text-white leading-tight tracking-tight">
                  SLV Women's
                </p>
                <p className="text-[10px] text-bronze-600 dark:text-gold-400 font-bold tracking-[0.2em] uppercase">Fashion Studio</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-burgundy-700 dark:text-gold-400 bg-burgundy-50 dark:bg-burgundy-900/30'
                      : 'text-charcoal-700 dark:text-charcoal-200 hover:text-burgundy-700 dark:hover:text-gold-400 hover:bg-bronze-50 dark:hover:bg-charcoal-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-bronze-50 dark:hover:bg-charcoal-800 transition-colors text-charcoal-700 dark:text-warmwhite"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <DarkModeToggle />

              {/* Wishlist Icon */}
              <Link
                to="/dashboard/wishlist"
                className="hidden sm:flex p-2.5 rounded-full hover:bg-bronze-50 dark:hover:bg-charcoal-800 transition-colors text-charcoal-700 dark:text-warmwhite"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 hover:text-burgundy-700 transition-colors" />
              </Link>

              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="relative p-2.5 rounded-full hover:bg-bronze-50 dark:hover:bg-charcoal-800 transition-colors text-charcoal-700 dark:text-warmwhite"
                title="Shopping Bag"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-burgundy-700 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-subtle border border-warmwhite dark:border-charcoal-950">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* User Session Handler */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-full border border-subtleborder dark:border-charcoal-700 hover:bg-bronze-50 dark:hover:bg-charcoal-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-burgundy-700 rounded-full flex items-center justify-center text-gold-400 text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-charcoal-600 dark:text-charcoal-300 hidden sm:block mr-1" />
                  </button>

                  <AnimatePresence>
                    {userDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-60 bg-cardbg dark:bg-charcoal-900 rounded-2xl shadow-card border border-subtleborder dark:border-charcoal-800 overflow-hidden"
                      >
                        <div className="p-4 border-b border-subtleborder dark:border-charcoal-800 bg-burgundy-700 text-white">
                          <p className="font-display font-semibold text-sm">{user?.name}</p>
                          <p className="text-warmwhite/70 text-xs mt-0.5">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link to="/dashboard" className="flex items-center gap-3 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-charcoal-700 dark:text-warmwhite hover:bg-bronze-50 dark:hover:bg-charcoal-800 hover:text-burgundy-700">
                            <User className="w-4 h-4 text-bronze-600" /> My Dashboard
                          </Link>
                          <Link to="/dashboard/orders" className="flex items-center gap-3 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-charcoal-700 dark:text-warmwhite hover:bg-bronze-50 dark:hover:bg-charcoal-800 hover:text-burgundy-700">
                            <Package className="w-4 h-4 text-bronze-600" /> My Orders
                          </Link>
                          <Link to="/dashboard/wishlist" className="flex items-center gap-3 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-charcoal-700 dark:text-warmwhite hover:bg-bronze-50 dark:hover:bg-charcoal-800 hover:text-burgundy-700">
                            <Heart className="w-4 h-4 text-bronze-600" /> Wishlist
                          </Link>
                          <Link to="/dashboard/profile" className="flex items-center gap-3 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-charcoal-700 dark:text-warmwhite hover:bg-bronze-50 dark:hover:bg-charcoal-800 hover:text-burgundy-700">
                            <Settings className="w-4 h-4 text-bronze-600" /> Profile Settings
                          </Link>
                          <hr className="my-1 border-subtleborder dark:border-charcoal-800" />
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-xs uppercase tracking-wider font-bold text-burgundy-700 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20">
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
                  className="hidden sm:flex btn-primary text-xs tracking-wider uppercase px-5 py-2.5"
                >
                  <User className="w-4 h-4" /> Login
                </button>
              )}

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-bronze-50 dark:hover:bg-charcoal-800 transition-colors"
              >
                {mobileOpen ? <X className="w-6 h-6 text-charcoal-900 dark:text-white" /> : <Menu className="w-6 h-6 text-charcoal-900 dark:text-white" />}
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
              className="lg:hidden border-t border-subtleborder dark:border-charcoal-800 bg-warmwhite dark:bg-charcoal-950 overflow-hidden shadow-card"
            >
              <div className="section-container py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-widest ${
                      location.pathname === link.path
                        ? 'bg-burgundy-700 text-white'
                        : 'text-charcoal-800 dark:text-warmwhite hover:bg-bronze-50 dark:hover:bg-charcoal-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <button
                    onClick={() => dispatch(showLogin())}
                    className="w-full btn-primary mt-6 text-xs uppercase tracking-widest"
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
