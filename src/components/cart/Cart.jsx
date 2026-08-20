import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles } from 'lucide-react'
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
            className="fixed inset-0 z-[90] bg-[#1F2937]/60 backdrop-blur-sm"
            onClick={() => dispatch(closeCart())}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#1F2937] z-[91] shadow-card-hover flex flex-col border-l border-[#E5E7EB] dark:border-charcoal-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] dark:border-charcoal-800 bg-[#F5F7FA] dark:bg-[#1F2937]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-fuchsia-600 flex items-center justify-center shadow-soft">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-[#1F2937] dark:text-white">Shopping Bag</h2>
                  <p className="text-[11px] text-[#64748B] dark:text-charcoal-400 font-medium">{count} {count === 1 ? 'item' : 'items'} selected</p>
                </div>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="w-8 h-8 rounded-full bg-white dark:bg-[#374151] border border-[#E5E7EB] dark:border-charcoal-700 flex items-center justify-center text-[#64748B] hover:text-pink-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free shipping banner */}
            {total > 0 && total < 500 && (
              <div className="bg-[#FFF5F9] dark:bg-pink-950/20 border-b border-[#E5E7EB] dark:border-charcoal-800 px-5 py-2.5">
                <p className="text-xs text-pink-700 dark:text-pink-300 font-medium flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-pink-500" />
                  Add <span className="font-bold">₹{500 - total}</span> more to unlock <span className="font-bold">FREE Delivery</span>!
                </p>
              </div>
            )}
            {total >= 500 && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-200 dark:border-emerald-900/30 px-5 py-2.5">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> You've unlocked FREE Boutique Delivery!
                </p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-2xl bg-[#F5F7FA] dark:bg-charcoal-800 border border-[#E5E7EB] flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-10 h-10 text-pink-400" />
                  </div>
                  <h3 className="text-[#1F2937] dark:text-white font-display text-lg font-bold">Your bag is empty</h3>
                  <p className="text-[#64748B] text-xs mt-1 max-w-xs mx-auto">Explore our bridal blouses, custom embroidery, and designer collections.</p>
                  <button onClick={() => { dispatch(closeCart()); navigate('/products') }} className="btn-primary mt-6 text-xs">
                    Start Shopping
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        className="flex gap-3.5 p-3.5 bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-soft"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F5F7FA] dark:bg-charcoal-800 flex-shrink-0 border border-[#E5E7EB]">
                          {cartImg ? (
                            <img src={cartImg} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-pink-500/10 to-fuchsia-500/10 flex items-center justify-center">
                              <span className="text-2xl">👗</span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-[#1F2937] dark:text-white text-xs line-clamp-1">{item.product.name}</h4>
                            {item.product.customization && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 px-1.5 py-0.5 rounded mt-0.5">
                                ✨ {item.product.customization.serviceName || 'Bespoke Fitting'}
                              </span>
                            )}
                            {item.size && <p className="text-[11px] text-[#64748B] mt-0.5">Size: {item.size}</p>}
                            {item.color && <p className="text-[11px] text-[#64748B]">Color: {item.color}</p>}
                            <p className="text-pink-600 dark:text-pink-400 font-bold text-sm mt-0.5 price-tag">
                              ₹{((item.product.offerPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E5E7EB] dark:border-charcoal-800">
                            <div className="flex items-center gap-2 bg-[#F5F7FA] dark:bg-charcoal-800 rounded-lg p-0.5 border border-[#E5E7EB]">
                              <button
                                onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity - 1 }))}
                                className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-[#64748B] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-[#1F2937] dark:text-white w-5 text-center">{item.quantity}</span>
                              <button
                                onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity + 1 }))}
                                className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-[#64748B] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => dispatch(removeFromCart(index))}
                              className="w-7 h-7 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center justify-center transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
              <div className="border-t border-[#E5E7EB] dark:border-charcoal-800 p-5 bg-[#F5F7FA] dark:bg-[#1F2937] space-y-3">
                <div className="space-y-1.5 text-xs text-[#64748B] dark:text-charcoal-300">
                  <div className="flex justify-between">
                    <span>Subtotal ({count} items)</span>
                    <span className="font-semibold text-[#1F2937] dark:text-white price-tag">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-[#1F2937] dark:text-white'}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-[#1F2937] dark:text-white border-t border-[#E5E7EB] dark:border-charcoal-700 pt-2">
                    <span>Total Amount</span>
                    <span className="text-pink-600 dark:text-pink-400 price-tag">₹{(total + shipping).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button onClick={handleCheckout} className="w-full btn-primary py-3.5 text-xs font-bold shadow-card">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => dispatch(clearCart())} className="w-full text-xs text-[#94A3B8] hover:text-rose-600 transition-colors py-1">
                  Clear Shopping Bag
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
