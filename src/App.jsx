import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

// Layout components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import MobileBottomNav from './components/common/MobileBottomNav'
import WhatsAppButton from './components/common/WhatsAppButton'
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute'
import LoginModal from './components/auth/LoginModal'
import Cart from './components/cart/Cart'
import { ErrorBoundary } from './components/common/ErrorBoundary'

// Core Pages (Fast load)
import Home from './pages/Home'

// Lazy-loaded Pages (Code Splitting for Fast Initial Load)
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Services = lazy(() => import('./pages/Services'))
const Customize = lazy(() => import('./pages/Customize'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contact = lazy(() => import('./pages/Contact'))
const Checkout = lazy(() => import('./pages/Checkout'))

// Lazy-loaded Customer Dashboard
const CustomerDashboard = lazy(() => import('./pages/dashboard/CustomerDashboard'))
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'))
const Orders = lazy(() => import('./pages/dashboard/Orders'))
const OrderTracking = lazy(() => import('./pages/dashboard/OrderTracking'))
const Profile = lazy(() => import('./pages/dashboard/Profile'))
const Wishlist = lazy(() => import('./pages/dashboard/Wishlist'))
const SavedAddresses = lazy(() => import('./pages/dashboard/SavedAddresses'))
const Measurements = lazy(() => import('./pages/dashboard/Measurements'))
const Notifications = lazy(() => import('./pages/dashboard/Notifications'))

// Lazy-loaded Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'))
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'))
const AdminOffers = lazy(() => import('./pages/admin/AdminOffers'))
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 border-3 border-pink-500/20 border-t-pink-600 rounded-full animate-spin mb-3" />
      <p className="text-xs text-[#64748B] font-semibold tracking-wider uppercase animate-pulse">Loading Studio Atelier...</p>
    </div>
  )
}

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
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <Footer />
      <WhatsAppButton />
      <MobileBottomNav />
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
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/customize" element={<Customize />} />
            <Route path="/customize/:id" element={<Customize />} />
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
        </Suspense>
      </MainLayout>
    </ErrorBoundary>
  )
}
