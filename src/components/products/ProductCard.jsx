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
      <div
        className="product-card h-full flex flex-col justify-between"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Product Image Frame */}
        <div className="relative overflow-hidden aspect-[3/4] bg-[#F8F8F8] dark:bg-charcoal-800">
          {activeImg ? (
            <img
              src={activeImg}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 ease-out"
              style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80';
              }}
            />
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <span className="text-gold-500 font-display text-3xl opacity-40">✨</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.isNewArrival && (
              <span className="badge-gold">New</span>
            )}
            {product.isBestseller && (
              <span className="badge bg-black text-white">Bestseller</span>
            )}
            {discount > 0 && (
              <span className="badge bg-black text-white">{discount}% OFF</span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 z-10 transition-opacity duration-200 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 bg-white dark:bg-black border border-[#EAEAEA] flex items-center justify-center hover:border-black transition-colors ${
                inWishlist ? 'text-black' : 'text-charcoal-500'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-black text-black' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 bg-white dark:bg-black border border-[#EAEAEA] flex items-center justify-center hover:border-black transition-colors text-charcoal-500"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add to Bag Button */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 z-10 transition-all duration-200 ${
              hovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary text-[10px] uppercase tracking-widest font-bold py-3"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
            </button>
          </div>
        </div>

        {/* Details Container */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-gold-500 uppercase tracking-widest font-bold mb-1">
              {product.category?.name || 'Boutique Collection'}
            </p>
            <h3 className="font-display font-semibold text-[#111111] dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors">
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
                          : 'text-[#EAEAEA] dark:text-charcoal-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-[#666666]">({product.numReviews})</span>
              </div>
            )}

            {/* Pricing */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-bold text-base text-[#111111] dark:text-white price-tag">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > price && (
                <span className="text-xs text-[#666666] line-through price-tag">
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
