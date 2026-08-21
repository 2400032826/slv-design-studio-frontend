import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  removeFromCart, updateQuantity, closeCart, clearCart,
  setCartValidation, setIsValidating,
  selectValidCartTotal, selectValidCartCount, selectHasInvalidCartItems,
  selectCartTotal, selectCartCount
} from '../../store/slices/cartSlice'
import { showLogin } from '../../store/slices/authSlice'
import { getImageUrl } from '../../utils/imageUtils'
import { validateCartItems } from '../../utils/cartValidator'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, isOpen, validationMap, isValidating } = useSelector((s) => s.cart)
  const total = useSelector(selectValidCartTotal)
  const count = useSelector(selectValidCartCount)
  const hasInvalidItems = useSelector(selectHasInvalidCartItems)
  const { isAuthenticated } = useSelector((s) => s.auth)

  // Real-time remote validation against live backend database
  useEffect(() => {
    let isCancelled = false
    if (!isOpen && items.length === 0) return

    async function performValidation() {
      dispatch(setIsValidating(true))
      try {
        const { validationMap: map } = await validateCartItems(items)
        if (!isCancelled) {
          dispatch(setCartValidation(map))
        }
      } catch (err) {
        console.warn('Cart validation error:', err)
      } finally {
        if (!isCancelled) dispatch(setIsValidating(false))
      }
    }

    performValidation()

    return () => {
      isCancelled = true
    }
  }, [isOpen, items, dispatch])

  const handleCheckout = () => {
    if (hasInvalidItems) return
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
                  <p className="text-[11px] text-[#64748B] dark:text-charcoal-400 font-medium">
                    {count} {count === 1 ? 'item' : 'items'} available {isValidating && '(checking stock...)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="w-8 h-8 rounded-full bg-white dark:bg-[#374151] border border-[#E5E7EB] dark:border-charcoal-700 flex items-center justify-center text-[#64748B] hover:text-pink-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invalid items warning banner */}
            {hasInvalidItems && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900/60 px-5 py-3 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
                  <strong>Stock Notice:</strong> Some items in your bag are out of stock or no longer available. Please remove them to proceed to checkout.
                </div>
              </div>
            )}

            {/* Free shipping banner */}
            {!hasInvalidItems && total > 0 && total < 500 && (
              <div className="bg-[#FFF5F9] dark:bg-pink-950/20 border-b border-[#E5E7EB] dark:border-charcoal-800 px-5 py-2.5">
                <p className="text-xs text-pink-700 dark:text-pink-300 font-medium flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-pink-500" />
                  Add <span className="font-bold">₹{500 - total}</span> more to unlock <span className="font-bold">FREE Delivery</span>!
                </p>
              </div>
            )}
            {!hasInvalidItems && total >= 500 && (
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
                    const prod = item.product || {}
                    const key = prod._id || prod.id || `cart_item_${index}`
                    const itemValidation = validationMap[key] || { status: 'AVAILABLE' }
                    const isOutOfStock = itemValidation.status === 'OUT_OF_STOCK'
                    const isNoLongerAvailable = itemValidation.status === 'NO_LONGER_AVAILABLE'
                    const isInvalid = isOutOfStock || isNoLongerAvailable
                    const cartImg = getImageUrl(prod.images?.[0])

                    return (
                      <motion.div
                        key={`${prod._id || index}-${index}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        className={`flex gap-3.5 p-3.5 rounded-2xl border transition-all shadow-soft ${
                          isInvalid
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60'
                            : 'bg-white dark:bg-[#111827] border-[#E5E7EB] dark:border-charcoal-800'
                        }`}
                      >
                        {/* Image */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F5F7FA] dark:bg-charcoal-800 flex-shrink-0 border border-[#E5E7EB]">
                          {cartImg ? (
                            <img
                              src={cartImg}
                              alt={prod.name}
                              className={`w-full h-full object-cover ${isInvalid ? 'grayscale opacity-60' : ''}`}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-pink-500/10 to-fuchsia-500/10 flex items-center justify-center">
                              <span className="text-2xl">👗</span>
                            </div>
                          )}
                          {isInvalid && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-center">
                              <span className="text-[9px] font-bold text-white uppercase leading-tight">
                                {isOutOfStock ? 'Out of Stock' : 'Unavailable'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className={`font-semibold text-xs line-clamp-1 ${isInvalid ? 'text-rose-900 dark:text-rose-200 line-through' : 'text-[#1F2937] dark:text-white'}`}>
                                {prod.name}
                              </h4>
                            </div>

                            {/* Status Badges */}
                            {isOutOfStock && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 px-1.5 py-0.5 rounded mt-0.5">
                                <AlertCircle className="w-2.5 h-2.5" /> OUT OF STOCK
                              </span>
                            )}
                            {isNoLongerAvailable && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 border border-rose-300 px-1.5 py-0.5 rounded mt-0.5">
                                <AlertCircle className="w-2.5 h-2.5" /> NO LONGER AVAILABLE
                              </span>
                            )}
                            {!isInvalid && prod.customization && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 px-1.5 py-0.5 rounded mt-0.5">
                                ✨ {prod.customization.serviceName || 'Bespoke Fitting'}
                              </span>
                            )}

                            {item.size && <p className="text-[11px] text-[#64748B] mt-0.5">Size: {item.size}</p>}
                            {item.color && <p className="text-[11px] text-[#64748B]">Color: {item.color}</p>}
                            
                            {prod.customization?.isPriceToConfirm || prod.isCustomQuote || prod.price === 0 ? (
                              <p className="font-bold text-xs mt-1 text-pink-600 dark:text-pink-400">
                                Price: To be confirmed by SLV Fashion Studio
                              </p>
                            ) : (
                              <p className={`font-bold text-sm mt-0.5 price-tag ${isInvalid ? 'text-gray-400 line-through' : 'text-pink-600 dark:text-pink-400'}`}>
                                ₹{((itemValidation.currentPrice || prod.offerPrice || prod.price || 0) * item.quantity).toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>

                          {/* Quantity Controls & Remove */}
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E5E7EB] dark:border-charcoal-800">
                            {isInvalid ? (
                              <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                                <span>Item Unavailable</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 bg-[#F5F7FA] dark:bg-charcoal-800 rounded-lg p-0.5 border border-[#E5E7EB]">
                                <button
                                  onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity - 1 }))}
                                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-[#64748B] transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold text-[#1F2937] dark:text-white w-5 text-center">{item.quantity}</span>
                                <button
                                  disabled={isInvalid || (itemValidation.stock && item.quantity >= itemValidation.stock)}
                                  onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity + 1 }))}
                                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-[#64748B] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            <button
                              onClick={() => dispatch(removeFromCart(index))}
                              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                                isInvalid
                                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-soft'
                                  : 'text-[#64748B] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                              }`}
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Remove</span>
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
                  {total === 0 && items.some((i) => i.product?.customization?.isPriceToConfirm || i.product?.isCustomQuote) ? (
                    <div className="p-3 bg-pink-50 dark:bg-pink-950/30 rounded-xl border border-pink-200 dark:border-pink-900/40 text-center space-y-1">
                      <p className="text-xs font-bold text-pink-700 dark:text-pink-300">
                        Price: To be confirmed by SLV Fashion Studio
                      </p>
                      <p className="text-[10px] text-[#64748B] dark:text-slate-400">
                        Zero upfront payment. Final exact price confirmed by master artisan after reviewing requirements.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Available Items Subtotal ({count} items)</span>
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
                        <span className="text-pink-600 dark:text-pink-400 price-tag">₹{(total + (count > 0 ? shipping : 0)).toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}
                </div>

                <button
                  disabled={hasInvalidItems || isValidating || count === 0}
                  onClick={handleCheckout}
                  className={`w-full py-3.5 text-xs font-bold rounded-xl shadow-card transition-all flex items-center justify-center gap-2 ${
                    hasInvalidItems || count === 0
                      ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 cursor-not-allowed opacity-90'
                      : 'btn-primary'
                  }`}
                >
                  {hasInvalidItems
                    ? 'Remove Unavailable Items to Checkout'
                    : count === 0
                    ? 'No Available Items'
                    : total === 0 && items.some((i) => i.product?.customization?.isPriceToConfirm || i.product?.isCustomQuote)
                    ? 'Submit Custom Request Booking'
                    : 'Proceed to Checkout'}
                  {!hasInvalidItems && count > 0 && <ArrowRight className="w-4 h-4" />}
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

