import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  ShoppingCart, Heart, Share2, Star, ChevronLeft, ChevronRight,
  ZoomIn, Truck, Shield, RefreshCw, Award, Plus, Minus, Check, Sparkles,
  Info, Palette
} from 'lucide-react'
import api from '../api/axios'
import { addToCart } from '../store/slices/cartSlice'
import { toggleWishlistItem } from '../store/slices/wishlistSlice'
import { showLogin } from '../store/slices/authSlice'
import { openCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import ProductCard from '../components/products/ProductCard'
import { getImageUrl, getProductImage, getCategoryFallbackImage } from '../utils/imageUtils'
import { getUnifiedGalleryItems } from '../utils/galleryService'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const wishlist = useSelector((s) => s.wishlist.items)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null

      // 1. Direct Remote API product fetch by ID
      const isHexId = /^[0-9a-fA-F]{24}$/.test(id)
      if (isHexId) {
        try {
          const res = await api.get(`/products/${id}`)
          if (res.data?.product) return res.data.product
        } catch (err) {
          console.warn('Direct product ID fetch error:', err.message)
        }
      }

      // 2. Fetch from full remote catalog to resolve by slug, id, or title
      try {
        const res = await api.get('/products?limit=100')
        const products = res.data?.products || []
        const matched = products.find(
          (p) =>
            p._id === id ||
            p.slug === id ||
            (p.name && p.name.toLowerCase() === id.toLowerCase()) ||
            (p.slug && p.slug.toLowerCase() === id.toLowerCase())
        )
        if (matched) return matched
      } catch (err) {
        console.warn('Catalog list fetch error:', err.message)
      }

      // 3. Fallback search via backend search API
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(id)}`)
        const products = res.data?.products || []
        const matched = products.find(
          (p) =>
            p._id === id ||
            p.slug === id ||
            (p.name && p.name.toLowerCase() === id.toLowerCase()) ||
            (p.slug && p.slug.toLowerCase() === id.toLowerCase())
        )
        if (matched) return matched
      } catch (err) {}

      // 4. Check Unified Gallery / Lookbook items
      try {
        const galleryItems = await getUnifiedGalleryItems('all')
        const match = galleryItems.find((item) => String(item._id) === id || String(item.id) === id)
        if (match) {
          return {
            _id: match._id || match.id,
            name: match.title || 'Handcrafted Design Piece',
            description: match.description || 'Exclusive designer collection piece from SLV Women’s Fashion Studio.',
            price: 1499,
            offerPrice: 1299,
            mrp: 1899,
            images: [{ url: match.url, alt: match.title }],
            category: { _id: match.category, name: (match.category || 'Embroidery').toUpperCase() },
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Fit'],
            colors: ['Antique Gold & Pink', 'Royal Navy', 'Crimson Red', 'Emerald Green', 'Custom Fabric'],
            stock: 10,
            isCustomizable: true,
          }
        }
      } catch (err) {
        console.warn('Gallery lookup error:', err)
      }

      // 5. Check persistent Cart items
      try {
        const cart = JSON.parse(localStorage.getItem('slv_cart') || '[]')
        const cartMatch = cart.find((item) => String(item.product?._id) === id || String(item.product?.slug) === id)
        if (cartMatch?.product) return cartMatch.product
      } catch (err) {
        console.warn('Cart lookup error:', err)
      }

      return null
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', data?.category?._id],
    queryFn: () => api.get(`/products?category=${data.category._id}&limit=4`).then((r) => r.data.products),
    enabled: !!data?.category?._id,
  })

  if (isLoading) return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      <div className="section-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded-xl" />
            <div className="skeleton h-6 w-1/2 rounded-xl" />
            <div className="skeleton h-24 w-full rounded-xl" />
            <div className="skeleton h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#111827] px-4">
      <div className="text-center p-8 bg-[#F5F7FA] dark:bg-[#1F2937] rounded-3xl border border-[#E5E7EB] dark:border-charcoal-700 max-w-md shadow-card">
        <div className="w-16 h-16 bg-[#FFF5F9] dark:bg-pink-950/40 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
          👗
        </div>
        <h2 className="text-xl font-display font-bold text-[#1F2937] dark:text-white mb-2">Design Not Found</h2>
        <p className="text-xs text-[#64748B] dark:text-charcoal-400 mb-6 leading-relaxed">
          The requested design could not be loaded or was part of a previous session. You can browse our active collection or launch the customizer studio to create your own style.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/products')} className="btn-primary text-xs py-2.5 px-5 font-bold shadow-soft">
            Browse Catalog
          </button>
          <button onClick={() => navigate('/customize')} className="btn-secondary text-xs py-2.5 px-5 font-bold">
            Launch Customizer
          </button>
        </div>
      </div>
    </div>
  )

  const inWishlist = wishlist.some((p) => p._id === data._id)
  const price = data.offerPrice || data.price
  const discount = data.mrp ? Math.round(((data.mrp - price) / data.mrp) * 100) : 0

  const fallbackImg = getCategoryFallbackImage(data)
  const mainImgUrl = getProductImage(data, selectedImage) || fallbackImg

  const handleAddToCart = () => {
    if (data.sizes?.length > 0 && !selectedSize) return toast.error('Please select a size')
    dispatch(addToCart({ product: data, quantity, size: selectedSize, color: selectedColor }))
    dispatch(openCart())
    toast.success('Added to shopping bag!')
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) { dispatch(showLogin()); return }
    if (data.sizes?.length > 0 && !selectedSize) return toast.error('Please select a size')
    dispatch(addToCart({ product: data, quantity, size: selectedSize, color: selectedColor }))
    navigate('/checkout')
  }

  const handleWishlist = () => {
    if (!isAuthenticated) { dispatch(showLogin()); return }
    dispatch(toggleWishlistItem(data))
    toast(inWishlist ? 'Removed from wishlist' : '❤️ Added to wishlist!')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: data.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      <div className="section-container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-charcoal-400 mb-6 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-pink-600 transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-pink-600 transition-colors">Catalog</button>
          <span>/</span>
          <span className="text-[#1F2937] dark:text-white font-semibold truncate">{data.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            {/* Main image */}
            <div
              className="relative aspect-square rounded-3xl overflow-hidden bg-[#F5F7FA] dark:bg-[#1F2937] mb-4 cursor-zoom-in group border border-[#E5E7EB] dark:border-charcoal-800 shadow-card"
              onClick={() => setLightboxOpen(true)}
            >
              <motion.img
                key={selectedImage}
                src={mainImgUrl}
                alt={data.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImg;
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-soft">
                  {discount}% OFF
                </div>
              )}
              {/* Nav arrows */}
              {data.images?.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p - 1 + data.images.length) % data.images.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-[#1F2937]/90 rounded-full flex items-center justify-center shadow-soft hover:bg-white text-[#1F2937] transition-colors border border-[#E5E7EB]">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p + 1) % data.images.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-[#1F2937]/90 rounded-full flex items-center justify-center shadow-soft hover:bg-white text-[#1F2937] transition-colors border border-[#E5E7EB]">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {data.images?.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {data.images.map((img, i) => {
                  const thumbUrl = getImageUrl(img)
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === selectedImage ? 'border-pink-500 shadow-soft' : 'border-[#E5E7EB] dark:border-charcoal-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <p className="text-xs text-pink-600 dark:text-pink-400 font-bold uppercase tracking-wider">{data.category?.name || 'Designer Blouse'}</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white mt-1 leading-snug">{data.name}</h1>
              {data.numReviews > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(data.rating) ? 'fill-amber-400 text-amber-400' : 'text-[#E5E7EB]'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-[#64748B] font-medium">({data.numReviews} boutique reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#1F2937] dark:text-white price-tag">₹{price.toLocaleString('en-IN')}</span>
              {data.mrp && data.mrp > price && (
                <span className="text-base text-[#64748B] line-through price-tag">₹{data.mrp.toLocaleString('en-IN')}</span>
              )}
              {discount > 0 && (
                <span className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200">{discount}% OFF</span>
              )}
            </div>

            {/* Sizes */}
            {data.sizes?.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-200 mb-2">
                  Size: <span className="font-semibold text-pink-600">{selectedSize || 'Select Option'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.sizes.map((size) => (
                    <button key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'border-pink-500 bg-[#F5F7FA] dark:bg-pink-950/20 text-pink-700 dark:text-pink-300 shadow-soft'
                          : 'border-[#E5E7EB] dark:border-charcoal-700 text-[#64748B] dark:text-charcoal-400 hover:border-pink-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {data.colors?.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-200 mb-2">
                  Color Shade: <span className="font-semibold text-pink-600">{selectedColor || 'Select Option'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.colors.map((color) => (
                    <button key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-1.5 rounded-full border-2 text-xs font-medium transition-all flex items-center gap-1.5 ${
                        selectedColor === color
                          ? 'border-pink-500 bg-[#F5F7FA] dark:bg-pink-950/20 text-pink-700 dark:text-pink-300 shadow-soft'
                          : 'border-[#E5E7EB] dark:border-charcoal-700 text-[#64748B]'
                      }`}
                    >
                      {selectedColor === color && <Check className="w-3 h-3 text-pink-600" />}
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-200 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#F5F7FA] dark:bg-charcoal-800 rounded-xl p-1 border border-[#E5E7EB]">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-[#64748B] transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-[#1F2937] dark:text-white text-sm">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(data.stock || 99, q + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-[#64748B] transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {data.stock !== undefined && (
                  <span className={`text-xs font-semibold ${data.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {data.stock > 0 ? `✓ ${data.stock} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleAddToCart} disabled={data.stock === 0} className="btn-primary flex-1 py-3.5 text-xs font-bold shadow-pink-glow">
                  <ShoppingCart className="w-4 h-4" /> Add to Shopping Bag
                </button>
                <button onClick={handleBuyNow} disabled={data.stock === 0} className="btn-secondary flex-1 py-3.5 text-xs font-bold shadow-soft">
                  Book Fit & Order
                </button>
                <div className="flex gap-2">
                  <button onClick={handleWishlist}
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                      inWishlist ? 'border-pink-500 bg-[#FFF5F9] text-pink-600' : 'border-[#E5E7EB] dark:border-charcoal-700 text-[#64748B] hover:border-pink-300'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-pink-500 text-pink-500' : ''}`} />
                  </button>
                  <button onClick={handleShare}
                    className="w-11 h-11 rounded-xl border border-[#E5E7EB] dark:border-charcoal-700 flex items-center justify-center text-[#64748B] hover:border-pink-300 transition-all"
                    title="Share Design"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Direct Studio Customizer Link */}
              <button
                onClick={() => navigate(`/customize?service=${data.category?.name?.toLowerCase() || 'blouse'}&design=${data._id}`)}
                className="w-full py-2.5 px-4 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-[#FFF5F9] dark:bg-pink-950/20 text-pink-700 dark:text-pink-300 hover:bg-pink-100 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Palette className="w-4 h-4 text-pink-500" />
                Customize / Alter This Design in Studio
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E5E7EB] dark:border-charcoal-700">
              {[
                { icon: Truck, text: 'Free delivery on ₹500+' },
                { icon: Shield, text: '100% Quality Guarantee' },
                { icon: RefreshCw, text: 'Alterations Guaranteed' },
                { icon: Award, text: 'Haute Craftsmanship' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-[#64748B] dark:text-charcoal-300">
                  <Icon className="w-4 h-4 text-pink-600 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-soft mb-12">
          <div className="flex border-b border-[#E5E7EB] dark:border-charcoal-700 overflow-x-auto">
            {['description', 'reviews', 'shipping'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'text-pink-600 border-b-2 border-pink-500 -mb-px bg-[#F5F7FA]/50'
                    : 'text-[#64748B] hover:text-[#1F2937]'
                }`}
              >
                {tab} {tab === 'reviews' && data.numReviews > 0 && `(${data.numReviews})`}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-[#64748B] dark:text-charcoal-300 text-sm leading-relaxed">
                  {data.description || 'Custom tailored with handcrafted zardosi and machine embroidery.'}
                </p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                {data.reviews?.length === 0 ? (
                  <p className="text-[#64748B] text-center text-xs py-8">No reviews yet for this design. Be the first to review!</p>
                ) : (
                  <div className="space-y-3">
                    {data.reviews?.map((review) => (
                      <div key={review._id} className="p-4 bg-[#F5F7FA] dark:bg-[#111827] rounded-xl border border-[#E5E7EB]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {review.user?.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-[#1F2937] dark:text-white">{review.user?.name}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-[#E5E7EB]'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-charcoal-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-2 text-xs text-[#64748B] dark:text-charcoal-300">
                <p>✓ Free delivery on orders above ₹500</p>
                <p>✓ Standard boutique delivery: 5-7 business days</p>
                <p>✓ Express custom delivery available: 2-3 business days (+₹200)</p>
                <p>✓ Free alterations within 7 days of delivery</p>
                <p>✓ Direct WhatsApp updates for tracking and measurements</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div>
            <h2 className="section-title text-[#1F2937] dark:text-white mb-6">Similar <span className="text-gradient-pink">Designs</span></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.filter((p) => p._id !== data._id).slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-lg border-t border-[#E5E7EB] dark:border-slate-800 p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#64748B] block font-bold uppercase">Total Price</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-lg text-[#1F2937] dark:text-white">₹{(price * quantity).toLocaleString('en-IN')}</span>
            {discount > 0 && <span className="text-[10px] text-rose-600 font-bold bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">{discount}% OFF</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end max-w-xs">
          <button
            onClick={handleAddToCart}
            disabled={data.stock === 0}
            className="btn-secondary text-xs px-3.5 py-2.5 font-bold flex-1 justify-center whitespace-nowrap"
          >
            Add to Bag
          </button>
          <button
            onClick={handleBuyNow}
            disabled={data.stock === 0}
            className="btn-primary text-xs px-4 py-2.5 font-bold flex-1 justify-center whitespace-nowrap shadow-soft"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && mainImgUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#1F2937]/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <img src={mainImgUrl} alt="" className="max-w-3xl max-h-[90vh] object-contain rounded-2xl shadow-card-hover" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
