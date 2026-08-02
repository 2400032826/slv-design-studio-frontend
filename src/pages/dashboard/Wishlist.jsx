import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
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
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Wishlist <span className="text-gray-400 text-lg font-normal">({items.length})</span>
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <Heart className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Your wishlist is empty</p>
          <p className="text-gray-400 text-sm mt-1">Save items you love for later</p>
          <Link to="/products" className="btn-primary mt-6 inline-flex">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group"
            >
              <Link to={`/products/${product.slug || product._id}`}>
                <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  {getImageUrl(product.images?.[0]) ? (
                    <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center text-4xl">👗</div>
                  )}
                </div>
              </Link>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{product.category?.name}</p>
                <Link to={`/products/${product.slug || product._id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5 mb-2 line-clamp-2 hover:text-gold-600 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-gold-500 font-bold mt-auto">₹{(product.offerPrice || product.price)?.toLocaleString('en-IN')}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleAddToCart(product)} className="btn-primary flex-1 text-sm py-2.5">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <button onClick={() => handleRemove(product)}
                    className="w-10 h-10 rounded-xl border border-red-200 dark:border-red-900/30 flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
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
