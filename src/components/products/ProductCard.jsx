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
    toast.success(`${product.name} added to bag! 🛍️`)
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
      toast.success('Link copied!')
    }
  }

  return (
    <Link to={`/products/${product.slug || product._id}`}>
      <motion.div
        className="product-card h-full flex flex-col justify-between"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {/* Product Image Container */}
        <div className="relative overflow-hidden aspect-[3/4] bg-warmwhite dark:bg-charcoal-800">
          {activeImg ? (
            <motion.img
              src={activeImg}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
              animate={{ scale: hovered ? 1.05 : 1 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80';
              }}
            />
          ) : (
            <div className="w-full h-full bg-burgundy-700 flex items-center justify-center">
              <span className="text-gold-400 font-display text-4xl opacity-30">✨</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNewArrival && (
              <span className="badge-gold">New</span>
            )}
            {product.isBestseller && (
              <span className="badge bg-burgundy-700 text-white font-bold">Bestseller</span>
            )}
            {discount > 0 && (
              <span className="badge-maroon">{discount}% OFF</span>
            )}
          </div>

          {/* Quick Action Overlay Buttons */}
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 z-10 transition-opacity duration-300 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-full bg-white dark:bg-charcoal-900 shadow-subtle flex items-center justify-center hover:scale-110 transition-transform ${
                inWishlist ? 'text-burgundy-700' : 'text-charcoal-600 dark:text-warmwhite'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-burgundy-700 text-burgundy-700' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white dark:bg-charcoal-900 shadow-subtle flex items-center justify-center hover:scale-110 transition-transform text-charcoal-600 dark:text-warmwhite"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add to Cart Button */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 z-10 transition-all duration-300 ${
              hovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary text-[11px] uppercase tracking-widest font-bold py-3 rounded-xl shadow-subtle"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-bronze-600 dark:text-gold-400 uppercase tracking-widest font-bold mb-1">
              {product.category?.name || 'Boutique Collection'}
            </p>
            <h3 className="font-display font-semibold text-charcoal-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-burgundy-700 transition-colors">
              {product.name}
            </h3>
          </div>

          <div>
            {/* Rating Stars */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.round(product.rating)
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-subtleborder dark:text-charcoal-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-charcoal-500 dark:text-charcoal-400">({product.numReviews})</span>
              </div>
            )}

            {/* Price Display */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-bold text-base text-burgundy-700 dark:text-gold-400 price-tag">
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
