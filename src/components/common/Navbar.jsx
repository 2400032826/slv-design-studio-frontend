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
      {/* Top Black Announcement Bar */}
      <div className="bg-black text-white text-xs py-2.5 border-b border-charcoal-800">
        <div className="section-container flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+919731912413" className="flex items-center gap-1.5 hover:text-gold-500 transition-colors">
              <Phone className="w-3.5 h-3.5 text-gold-500" /> +91 9731912413
            </a>
            <a href="mailto:slvdesignstudio@gmail.com" className="hidden sm:flex items-center gap-1.5 hover:text-gold-500 transition-colors">
              <Mail className="w-3.5 h-3.5 text-gold-500" /> slvdesignstudio@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gold-500 font-medium">
              <Sparkles className="w-3.5 h-3.5 fill-gold-500 text-gold-500" /> SLV Women's Fashion Studio • Custom Tailoring & Embroidery
            </span>
          </div>
        </div>
      </div>

      {/* Main White Navigation Bar */}
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-subtle border-b border-[#EAEAEA] dark:border-charcoal-800'
            : 'bg-white dark:bg-black border-b border-[#EAEAEA] dark:border-charcoal-800'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="relative">
                <div className="w-10 h-10 bg-black rounded-none flex items-center justify-center border border-black">
                  <span className="text-gold-500 font-display font-bold text-lg">S</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-500 rounded-full" />
              </div>
              <div>
                <p className="font-display font-bold text-lg md:text-xl text-[#111111] dark:text-white leading-tight tracking-tight uppercase">
                  SLV Women's
                </p>
                <p className="text-[10px] text-gold-500 font-bold tracking-[0.25em] uppercase">Fashion Studio</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-black dark:text-white border-b-2 border-gold-500 font-bold'
                      : 'text-[#666666] dark:text-charcoal-300 hover:text-black dark:hover:text-white'
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
                className="p-2.5 hover:text-gold-500 transition-colors text-[#111111] dark:text-white"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <DarkModeToggle />

              {/* Wishlist Icon */}
              <Link
                to="/dashboard/wishlist"
                className="hidden sm:flex p-2.5 hover:text-gold-500 transition-colors text-[#111111] dark:text-white"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="relative p-2.5 hover:text-gold-500 transition-colors text-[#111111] dark:text-white"
                title="Shopping Bag"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gold-500 text-black text-[9px] rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* User Session Handler */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 p-1.5 border border-[#EAEAEA] dark:border-charcoal-700 hover:border-black transition-colors"
                  >
                    <div className="w-7 h-7 bg-black rounded-none flex items-center justify-center text-gold-500 text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#111111] dark:text-white hidden sm:block mr-1" />
                  </button>

                  <AnimatePresence>
                    {userDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-charcoal-900 shadow-card border border-[#EAEAEA] dark:border-charcoal-800 overflow-hidden"
                      >
                        <div className="p-4 border-b border-[#EAEAEA] dark:border-charcoal-800 bg-black text-white">
                          <p className="font-display font-semibold text-sm">{user?.name}</p>
                          <p className="text-gold-500 text-xs mt-0.5">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#111111] dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-charcoal-800 hover:text-gold-500">
                            <User className="w-4 h-4 text-gold-500" /> My Dashboard
                          </Link>
                          <Link to="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#111111] dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-charcoal-800 hover:text-gold-500">
                            <Package className="w-4 h-4 text-gold-500" /> My Orders
                          </Link>
                          <Link to="/dashboard/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#111111] dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-charcoal-800 hover:text-gold-500">
                            <Heart className="w-4 h-4 text-gold-500" /> Wishlist
                          </Link>
                          <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#111111] dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-charcoal-800 hover:text-gold-500">
                            <Settings className="w-4 h-4 text-gold-500" /> Profile Settings
                          </Link>
                          <hr className="my-1 border-[#EAEAEA] dark:border-charcoal-800" />
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-black dark:text-white hover:bg-[#F8F8F8]">
                            <LogOut className="w-4 h-4 text-gold-500" /> Logout
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
                className="lg:hidden p-2.5 hover:text-gold-500 transition-colors text-[#111111] dark:text-white"
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
              className="lg:hidden border-t border-[#EAEAEA] dark:border-charcoal-800 bg-white dark:bg-black overflow-hidden shadow-subtle"
            >
              <div className="section-container py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 font-semibold text-xs uppercase tracking-widest ${
                      location.pathname === link.path
                        ? 'bg-black text-white'
                        : 'text-[#111111] dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-charcoal-900'
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
