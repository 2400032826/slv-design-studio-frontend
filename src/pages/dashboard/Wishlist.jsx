import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { toggleWishlistItem } from '../../store/slices/wishlistSlice'
import { addToCart, openCart } from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../utils/imageUtils'

export default function Wishlist() {
  const dispatch = useDispatch()
  const { items } = useSelector((s) => s.wishlist)

  const handleRemove = (product) => {
    dispatch(toggleWishlistItem(product))
    toast('Removed from wishlist')
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }))
    dispatch(openCart())
    toast.success(`${product.name} added to bag!`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E5E7EB]">
        <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white">
          Saved Wishlist <span className="text-[#64748B] text-sm font-normal">({items.length} items)</span>
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF5F9] dark:bg-pink-950/30 flex items-center justify-center mx-auto mb-4 text-pink-400">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-display font-bold text-[#1F2937] dark:text-white">Your wishlist is empty</h3>
          <p className="text-[#64748B] text-xs mt-1">Explore our catalog and save designs you adore.</p>
          <Link to="/products" className="btn-primary mt-6 inline-flex text-xs py-2.5 px-6">Explore Catalog</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 overflow-hidden flex flex-col shadow-soft hover:shadow-card group"
            >
              <Link to={`/products/${product.slug || product._id}`}>
                <div className="aspect-[4/3] bg-[#F5F7FA] dark:bg-charcoal-800 overflow-hidden border-b border-[#E5E7EB]">
                  {getImageUrl(product.images?.[0]) ? (
                    <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-pink-500/10 to-fuchsia-500/10 flex items-center justify-center text-4xl">👗</div>
                  )}
                </div>
              </Link>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-[10px] text-pink-600 dark:text-pink-400 font-bold uppercase tracking-wider">{product.category?.name || 'Designer Blouse'}</p>
                <Link to={`/products/${product.slug || product._id}`}>
                  <h3 className="font-bold text-[#1F2937] dark:text-white text-xs mt-0.5 mb-2 line-clamp-1 hover:text-pink-600 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-pink-600 dark:text-pink-400 font-bold text-sm mt-auto price-tag">₹{(product.offerPrice || product.price)?.toLocaleString('en-IN')}</p>
                <div className="flex gap-2 mt-3 pt-3 border-t border-[#E5E7EB]">
                  <button onClick={() => handleAddToCart(product)} className="btn-primary flex-1 text-xs py-2">
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                  </button>
                  <button onClick={() => handleRemove(product)}
                    className="w-9 h-9 rounded-xl border border-[#E5E7EB] flex items-center justify-center text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
