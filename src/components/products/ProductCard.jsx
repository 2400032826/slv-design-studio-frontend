import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, Share2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { toggleWishlistItem } from '../../store/slices/wishlistSlice'
import { showLogin } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../utils/imageUtils'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const wishlist = useSelector((s) => s.wishlist.items)
  const [hovered, setHovered] = useState(false)
  const inWishlist = wishlist.some((p) => p._id === product._id)

  const price = product.offerPrice || product.price
  const discount = product.mrp ? Math.round(((product.mrp - price) / product.mrp) * 100) : 0

  const primaryImg = getImageUrl(product.images?.[0])
  const secondaryImg = getImageUrl(product.images?.[1])
  const activeImg = (hovered && secondaryImg) ? secondaryImg : primaryImg

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success(`${product.name} added to cart!`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    if (!isAuthenticated) { dispatch(showLogin()); return }
    dispatch(toggleWishlistItem(product))
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  const handleShare = (e) => {
    e.preventDefault()
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.origin + `/products/${product.slug || product._id}` })
    } else {
      navigator.clipboard.writeText(window.location.origin + `/products/${product.slug || product._id}`)
      toast.success('Link copied!')
    }
  }

  return (
    <Link to={`/products/${product.slug || product._id}`}>
      <motion.div
        className="product-card h-full"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4 }}
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 dark:bg-gray-800">
          {activeImg ? (
            <motion.img
              src={activeImg}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
              animate={{ scale: hovered ? 1.05 : 1 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
              <span className="text-white/30 text-4xl">👗</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNewArrival && <span className="badge bg-green-500 text-white">New</span>}
            {product.isBestseller && <span className="badge bg-gold-500 text-purple-900">Bestseller</span>}
            {discount > 0 && <span className="badge bg-pink-500 text-white">{discount}% OFF</span>}
          </div>

          {/* Action buttons */}
          <motion.div
            className="absolute top-3 right-3 flex flex-col gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 20 }}
            transition={{ duration: 0.2 }}
          >
            <button onClick={handleWishlist}
              className={`w-8 h-8 rounded-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-center hover:scale-110 transition-transform ${
                inWishlist ? 'text-pink-500' : 'text-gray-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-pink-500' : ''}`} />
            </button>
            <button onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-center hover:scale-110 transition-transform text-gray-500">
              <Share2 className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Quick add to cart */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: hovered ? 0 : 60, opacity: hovered ? 1 : 0 }}
          >
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary text-sm py-2.5 rounded-xl"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{product.category?.name || ''}</p>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-gold-600">
            {product.name}
          </h3>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.numReviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 dark:text-white price-tag">₹{price.toLocaleString('en-IN')}</span>
            {product.mrp && product.mrp > price && (
              <span className="text-xs text-gray-400 line-through price-tag">₹{product.mrp.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
