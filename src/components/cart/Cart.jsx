import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  removeFromCart, updateQuantity, closeCart, clearCart,
  selectCartTotal, selectCartCount
} from '../../store/slices/cartSlice'
import { showLogin } from '../../store/slices/authSlice'
import { getImageUrl } from '../../utils/imageUtils'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, isOpen } = useSelector((s) => s.cart)
  const total = useSelector(selectCartTotal)
  const count = useSelector(selectCartCount)
  const { isAuthenticated } = useSelector((s) => s.auth)

  const handleCheckout = () => {
    if (!isAuthenticated) {
      dispatch(showLogin())
      return
    }
    dispatch(closeCart())
    navigate('/checkout')
  }

  const shipping = total >= 500 ? 0 : 50

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            onClick={() => dispatch(closeCart())}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-[91] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-hero">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-gold-400" />
                <h2 className="font-display text-xl font-bold text-white">Your Cart</h2>
                {count > 0 && (
                  <span className="w-6 h-6 bg-white/20 text-white text-xs rounded-full flex items-center justify-center font-bold">{count}</span>
                )}
              </div>
              <button onClick={() => dispatch(closeCart())} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free shipping banner */}
            {total > 0 && total < 500 && (
              <div className="bg-gold-50 dark:bg-gold-900/20 border-b border-gold-200 dark:border-gold-800 px-5 py-2.5">
                <p className="text-xs text-gold-700 dark:text-gold-400 flex items-center gap-1.5">
                  <Tag className="w-3 h-3" />
                  Add ₹{500 - total} more for FREE delivery!
                </p>
              </div>
            )}
            {total >= 500 && (
              <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 px-5 py-2.5">
                <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1.5">
                  ✓ You've unlocked FREE delivery!
                </p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-1">Discover our beautiful collection</p>
                  <button onClick={() => { dispatch(closeCart()); navigate('/products') }} className="btn-primary mt-6">
                    Shop Now
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item, index) => {
                    const cartImg = getImageUrl(item.product.images?.[0])
                    return (
                      <motion.div
                        key={`${item.product._id}-${index}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                          {cartImg ? (
                            <img src={cartImg} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                              <span className="text-2xl">👗</span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">{item.product.name}</h4>
                          {item.size && <p className="text-xs text-gray-400 mt-0.5">Size: {item.size}</p>}
                          {item.color && <p className="text-xs text-gray-400">Color: {item.color}</p>}
                          <p className="text-gold-500 font-bold text-sm mt-1">
                            ₹{((item.product.offerPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                          </p>

                          {/* Quantity */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity - 1 }))}
                              className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity + 1 }))}
                              className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => dispatch(removeFromCart(index))}
                              className="ml-auto w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-5 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Subtotal ({count} items)</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-500' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2">
                    <span>Total Estimated</span>
                    <span>₹{(total + shipping).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button onClick={handleCheckout} className="w-full btn-primary py-4 text-base">
                  Proceed to Booking <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => dispatch(clearCart())} className="w-full text-sm text-gray-400 hover:text-red-500 transition-colors py-1">
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
