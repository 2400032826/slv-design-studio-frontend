import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star, Share2 } from 'lucide-react'
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
    toast.success(`${product.name} added to cart! 🛍️`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    if (!isAuthenticated) { dispatch(showLogin()); return }
    dispatch(toggleWishlistItem(product))
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist! ❤️')
  }

  const handleShare = (e) => {
    e.preventDefault()
    const url = window.location.origin + `/products/${product.slug || product._id}`
    if (navigator.share) {
      navigator.share({ title: product.name, url })
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Product link copied!')
    }
  }

  return (
    <Link to={`/products/${product.slug || product._id}`}>
      <motion.div
        className="product-card h-full flex flex-col justify-between"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
      >
        {/* Product Image Frame */}
        <div className="relative overflow-hidden aspect-[3/4] bg-beige-100 dark:bg-charcoal-800">
          {activeImg ? (
            <motion.img
              src={activeImg}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
              animate={{ scale: hovered ? 1.08 : 1 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-maroon flex items-center justify-center">
              <span className="text-gold-300 font-display text-5xl opacity-40">✨</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNewArrival && (
              <span className="badge-gold shadow-sm">New</span>
            )}
            {product.isBestseller && (
              <span className="badge bg-gradient-gold text-maroon-950 font-bold shadow-sm">Bestseller</span>
            )}
            {discount > 0 && (
              <span className="badge-maroon shadow-sm">{discount}% OFF</span>
            )}
          </div>

          {/* Quick Action Overlay Buttons */}
          <motion.div
            className="absolute top-3 right-3 flex flex-col gap-2 z-10"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 15 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-full bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md shadow-md flex items-center justify-center hover:scale-110 transition-transform ${
                inWishlist ? 'text-maroon-600' : 'text-charcoal-600 dark:text-beige-200'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-maroon-600 text-maroon-600' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md shadow-md flex items-center justify-center hover:scale-110 transition-transform text-charcoal-600 dark:text-beige-200"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Slide-Up Quick Add to Cart Button */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3 z-10"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: hovered ? 0 : 60, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleAddToCart}
              className="w-full btn-gold text-xs uppercase tracking-wider font-bold py-3 rounded-2xl shadow-gold"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
          </motion.div>
        </div>

        {/* Product Details Info */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[11px] text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold mb-1">
              {product.category?.name || 'Bespoke Collection'}
            </p>
            <h3 className="font-display font-semibold text-charcoal-900 dark:text-beige-50 text-base leading-snug mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors">
              {product.name}
            </h3>
          </div>

          <div>
            {/* Rating Stars */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(product.rating)
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-beige-300 dark:text-charcoal-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-charcoal-500 dark:text-beige-400">({product.numReviews})</span>
              </div>
            )}

            {/* Pricing */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-bold text-lg text-maroon-900 dark:text-gold-400 price-tag">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > price && (
                <span className="text-xs text-charcoal-400 line-through price-tag">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
