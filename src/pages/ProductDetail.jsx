import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  ShoppingCart, Heart, Share2, Star, ChevronLeft, ChevronRight,
  ZoomIn, Truck, Shield, RefreshCw, Award, Plus, Minus, Check
} from 'lucide-react'
import api from '../api/axios'
import { addToCart } from '../store/slices/cartSlice'
import { toggleWishlistItem } from '../store/slices/wishlistSlice'
import { showLogin } from '../store/slices/authSlice'
import { openCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import ProductCard from '../components/products/ProductCard'
import { getImageUrl } from '../utils/imageUtils'

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
    queryFn: () => api.get(`/products/${id}`).then((r) => r.data.product),
  })

  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', data?.category?._id],
    queryFn: () => api.get(`/products?category=${data.category._id}&limit=4`).then((r) => r.data.products),
    enabled: !!data?.category?._id,
  })

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="section-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-6 w-1/2" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn-primary mt-4">Browse Products</button>
      </div>
    </div>
  )

  const inWishlist = wishlist.some((p) => p._id === data._id)
  const price = data.offerPrice || data.price
  const discount = data.mrp ? Math.round(((data.mrp - price) / data.mrp) * 100) : 0

  const mainImgUrl = getImageUrl(data.images?.[selectedImage])

  const handleAddToCart = () => {
    if (data.sizes?.length > 0 && !selectedSize) return toast.error('Please select a size')
    dispatch(addToCart({ product: data, quantity, size: selectedSize, color: selectedColor }))
    dispatch(openCart())
    toast.success('Added to cart!')
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="section-container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-gold-500 transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-gold-500 transition-colors">Products</button>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate">{data.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            {/* Main image */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4 cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
            >
              {mainImgUrl ? (
                <motion.img
                  key={selectedImage}
                  src={mainImgUrl}
                  alt={data.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                  <span className="text-6xl">👗</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {discount}% OFF
                </div>
              )}
              {/* Nav arrows */}
              {data.images?.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p - 1 + data.images.length) % data.images.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p + 1) % data.images.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {data.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {data.images.map((img, i) => {
                  const thumbUrl = getImageUrl(img)
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === selectedImage ? 'border-gold-500' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
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
              <p className="text-sm text-gold-500 font-semibold uppercase tracking-wider">{data.category?.name}</p>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mt-1">{data.name}</h1>
              {data.numReviews > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(data.rating) ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({data.numReviews} reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{price.toLocaleString('en-IN')}</span>
              {data.mrp && data.mrp > price && (
                <span className="text-lg text-gray-400 line-through">₹{data.mrp.toLocaleString('en-IN')}</span>
              )}
              {discount > 0 && (
                <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>
              )}
            </div>

            {/* Sizes */}
            {data.sizes?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Size: <span className="font-normal text-gray-500">{selectedSize || 'Select'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.sizes.map((size) => (
                    <button key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gold-300'
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
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Color: <span className="font-normal text-gray-500">{selectedColor || 'Select'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.colors.map((color) => (
                    <button key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-full border-2 text-sm transition-all flex items-center gap-1.5 ${
                        selectedColor === color ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {selectedColor === color && <Check className="w-3 h-3 text-gold-600" />}
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-gray-900 dark:text-white text-lg">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(data.stock || 99, q + 1))}
                  className="w-10 h-10 rounded-xl border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
                {data.stock !== undefined && (
                  <span className={`text-sm ${data.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {data.stock > 0 ? `${data.stock} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleAddToCart} disabled={data.stock === 0} className="btn-primary flex-1 py-4">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={data.stock === 0} className="btn-gold flex-1 py-4">
                Buy Now
              </button>
              <button onClick={handleWishlist}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                  inWishlist ? 'border-pink-500 bg-pink-50 text-pink-500' : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-pink-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-pink-500' : ''}`} />
              </button>
              <button onClick={handleShare}
                className="w-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {[
                { icon: Truck, text: 'Free delivery on ₹500+' },
                { icon: Shield, text: '100% Quality Guarantee' },
                { icon: RefreshCw, text: 'Easy Returns & Alterations' },
                { icon: Award, text: 'Premium Craftsmanship' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Icon className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 mb-10">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {['description', 'reviews', 'shipping'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'text-gold-600 border-b-2 border-gold-500 -mb-px'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab} {tab === 'reviews' && data.numReviews > 0 && `(${data.numReviews})`}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {data.description || 'No description available.'}
                </p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                {data.reviews?.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  <div className="space-y-4">
                    {data.reviews?.map((review) => (
                      <div key={review._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-royal rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {review.user?.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">{review.user?.name}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>✓ Free delivery on orders above ₹500</p>
                <p>✓ Standard delivery: 5-7 business days</p>
                <p>✓ Express delivery available: 2-3 business days (+₹200)</p>
                <p>✓ Free alterations within 7 days of delivery</p>
                <p>✓ Contact us on WhatsApp for urgent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div>
            <h2 className="section-title text-gray-900 dark:text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.filter((p) => p._id !== data._id).slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && mainImgUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <img src={mainImgUrl} alt="" className="max-w-3xl max-h-[90vh] object-contain rounded-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
