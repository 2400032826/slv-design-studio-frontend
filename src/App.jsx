import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

// Layout components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import WhatsAppButton from './components/common/WhatsAppButton'
import FloatingCallButton from './components/common/FloatingCallButton'
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute'
import LoginModal from './components/auth/LoginModal'
import Cart from './components/cart/Cart'
import { ErrorBoundary } from './components/common/ErrorBoundary'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Services from './pages/Services'
import Customize from './pages/Customize'
import Gallery from './pages/Gallery'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'

// Dashboard pages
import CustomerDashboard from './pages/dashboard/CustomerDashboard'
import DashboardHome from './pages/dashboard/DashboardHome'
import Orders from './pages/dashboard/Orders'
import OrderTracking from './pages/dashboard/OrderTracking'
import Profile from './pages/dashboard/Profile'
import Wishlist from './pages/dashboard/Wishlist'
import SavedAddresses from './pages/dashboard/SavedAddresses'
import Measurements from './pages/dashboard/Measurements'
import Notifications from './pages/dashboard/Notifications'

// Admin pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminGallery from './pages/admin/AdminGallery'
import AdminOffers from './pages/admin/AdminOffers'
import AdminReviews from './pages/admin/AdminReviews'
import AdminSettings from './pages/admin/AdminSettings'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function useIsAdminPage() {
  const { pathname } = useLocation()
  return pathname.startsWith('/admin')
}

function MainLayout({ children }) {
  const isAdmin = useIsAdminPage()
  if (isAdmin) return children
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
      <FloatingCallButton />
      <LoginModal />
      <Cart />
    </>
  )
}

export default function App() {
  const { mode } = useSelector((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')

    const params = new URLSearchParams(window.location.search)
    if (params.get('blocked') === 'true') {
      toast.error('Your account has been blocked. Please contact the administrator.', { duration: 6000 })
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [mode])

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <MainLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected routes */}
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />

          {/* Customer Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute><CustomerDashboard /></ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderTracking />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="addresses" element={<SavedAddresses />} />
            <Route path="measurements" element={<Measurements />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
          <Route path="/admin/gallery" element={<AdminRoute><AdminGallery /></AdminRoute>} />
          <Route path="/admin/offers" element={<AdminRoute><AdminOffers /></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
              <div className="text-center">
                <p className="text-8xl font-display font-bold text-gold-400 mb-4">404</p>
                <h1 className="text-3xl font-display text-white mb-4">Page Not Found</h1>
                <a href="/" className="btn-primary inline-flex">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </MainLayout>
    </ErrorBoundary>
  )
}
