import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star, Share2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { toggleWishlistItem } from '../../store/slices/wishlistSlice'
import { showLogin } from '../../store/slices/authSlice'
import { getImageUrl, getProductImage, getCategoryFallbackImage } from '../../utils/imageUtils'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)
  const wishlist = useSelector((s) => s.wishlist.items)
  const [hovered, setHovered] = useState(false)
  const inWishlist = wishlist.some((p) => p._id === product._id)

  const price = product.offerPrice || product.price
  const discount = product.mrp ? Math.round(((product.mrp - price) / product.mrp) * 100) : 0

  const fallbackImg = getCategoryFallbackImage(product)
  const primaryImg = getProductImage(product, 0)
  const secondaryImg = (product.images && product.images.length > 1) ? getProductImage(product, 1) : primaryImg
  const activeImg = (hovered && secondaryImg) ? secondaryImg : (primaryImg || fallbackImg)

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
    const url = window.location.origin + `/products/${product._id || product.slug}`
    if (navigator.share) {
      navigator.share({ title: product.name, url })
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied!')
    }
  }

  return (
    <Link to={`/products/${product._id || product.slug}`} className="block h-full group">
      <div
        className="product-card h-full flex flex-col justify-between"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Product Image Frame */}
        <div className="relative overflow-hidden aspect-[3/4] bg-[#F5F7FA] dark:bg-[#111827]">
          <img
            src={activeImg || fallbackImg}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImg;
            }}
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.isNewArrival && (
              <span className="badge bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-soft text-[10px]">
                New
              </span>
            )}
            {product.isBestseller && (
              <span className="badge bg-[#1F2937] text-white shadow-soft text-[10px]">
                Bestseller
              </span>
            )}
            {discount > 0 && (
              <span className="badge bg-rose-500 text-white shadow-soft text-[10px]">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Floating Action Buttons */}
          <div
            className={`absolute top-2 right-2 flex flex-col gap-1.5 z-10 transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100`}
          >
            <button
              onClick={handleWishlist}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 dark:bg-[#1F2937]/95 border border-[#E5E7EB] dark:border-slate-700 shadow-soft flex items-center justify-center hover:border-pink-400 transition-colors ${
                inWishlist ? 'text-pink-500' : 'text-[#64748B]'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-pink-500 text-pink-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 dark:bg-[#1F2937]/95 border border-[#E5E7EB] dark:border-slate-700 shadow-soft flex items-center justify-center hover:border-pink-400 transition-colors text-[#64748B]"
              title="Share"
            >
              <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

          {/* Quick Add to Bag Button (Desktop Hover) */}
          <div
            className={`hidden sm:block absolute bottom-0 left-0 right-0 p-3 z-10 transition-all duration-200 ${
              hovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary text-[10px] py-2.5 shadow-card font-bold"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
            </button>
          </div>
        </div>

        {/* Details Container */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white dark:bg-[#1F2937]">
          <div>
            <p className="text-[9px] sm:text-[10px] text-pink-600 dark:text-pink-400 uppercase tracking-wider font-bold mb-0.5 sm:mb-1">
              {product.category?.name || 'Designer Collection'}
            </p>
            <h3 className="font-display font-semibold text-[#1F2937] dark:text-white text-xs sm:text-sm leading-snug mb-1 sm:mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
              {product.name}
            </h3>
          </div>

          <div>
            {/* Rating Stars */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-[#E5E7EB] dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-[#64748B] font-medium">({product.numReviews})</span>
              </div>
            )}

            {/* Pricing */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-bold text-base text-[#1F2937] dark:text-white price-tag">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > price && (
                <span className="text-xs text-[#64748B] line-through price-tag">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
