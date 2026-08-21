import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  MapPin, Check, Tag, ShoppingBag, MessageCircle, PhoneCall, Sparkles, ShieldCheck,
  AlertTriangle, AlertCircle, Trash2
} from 'lucide-react'
import api from '../api/axios'
import {
  clearCart, removeFromCart, setCartValidation, setIsValidating,
  selectValidCartTotal, selectValidCartCount, selectHasInvalidCartItems
} from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { getImageUrl } from '../utils/imageUtils'
import { validateCartItems } from '../utils/cartValidator'

const DELIVERY_CHARGE = 50
const FREE_DELIVERY_THRESHOLD = 500
const BUSINESS_PHONE = '919731912413'

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, validationMap, isValidating } = useSelector((s) => s.cart)
  const { user } = useSelector((s) => s.auth)
  const subtotal = useSelector(selectValidCartTotal)
  const hasInvalidItems = useSelector(selectHasInvalidCartItems)
  const validCount = useSelector(selectValidCartCount)

  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(null)
  const [whatsappUrl, setWhatsappUrl] = useState('')

  // Validate cart against remote database on checkout load
  useEffect(() => {
    let isCancelled = false

    async function checkAvailability() {
      if (items.length === 0) return
      dispatch(setIsValidating(true))
      try {
        const { validationMap: map } = await validateCartItems(items)
        if (!isCancelled) {
          dispatch(setCartValidation(map))
        }
      } catch (e) {
        console.warn('Checkout validation error:', e)
      } finally {
        if (!isCancelled) dispatch(setIsValidating(false))
      }
    }

    checkAvailability()

    return () => {
      isCancelled = true
    }
  }, [items, dispatch])

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: '',
      city: '',
      state: 'Karnataka',
      pincode: '',
    }
  })

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_CHARGE
  const discount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0
  const total = subtotal + delivery - discount

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, orderAmount: subtotal })
      setCoupon(data.coupon)
      toast.success(`Coupon applied! ${data.coupon.discountPercent}% off`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code')
    } finally {
      setCouponLoading(false)
    }
  }

  const onSubmit = async (address) => {
    if (items.length === 0) return toast.error('Your bag is empty')
    
    setLoading(true)
    try {
      // 1. Real-time validation against live remote production database before booking
      const { validationMap: liveMap, hasInvalidItems: invalid } = await validateCartItems(items)
      dispatch(setCartValidation(liveMap))

      if (invalid) {
        setLoading(false)
        return toast.error('Some items in your bag are out of stock or no longer available. Please remove them to proceed.')
      }

      // Filter only available items
      const validItems = items.filter((item, idx) => {
        const key = item.product?._id || item.product?.id || `cart_item_${idx}`
        const val = liveMap[key]
        return !val || (val.status !== 'OUT_OF_STOCK' && val.status !== 'NO_LONGER_AVAILABLE')
      })

      if (validItems.length === 0) {
        setLoading(false)
        return toast.error('No available items in bag to place order.')
      }

      const orderData = {
        items: validItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.offerPrice || item.product.price,
          size: item.size,
          color: item.color,
          customization: item.customization,
        })),
        shippingAddress: address,
        couponCode: coupon?.code,
        subtotal,
        deliveryCharge: delivery,
        discount,
        totalPrice: total,
      }

      const { data } = await api.post('/orders', orderData)
      const bookedOrder = data.order

      dispatch(clearCart())
      setOrderPlaced(bookedOrder)
      toast.success('Order booked successfully! 🎉')

      // Build WhatsApp message
      const firstItem = validItems[0]
      const productName = firstItem?.product?.name || 'Boutique Custom Wear'
      const qty = validItems.reduce((acc, i) => acc + i.quantity, 0)
      const hasCustomService = validItems.some((i) => i.product?.customization?.isPriceToConfirm || i.product?.isCustomQuote || i.product?.price === 0)
      const priceText = hasCustomService && subtotal === 0
        ? 'Price: To be confirmed by SLV Fashion Studio'
        : `Total: ₹${total.toLocaleString('en-IN')}`

      const waMessage = `Hello SLV Women's Fashion Studio,
I have submitted a new ${hasCustomService ? 'custom design / service request' : 'order'}.

Order ID: ${bookedOrder.orderNumber || 'SLV-' + Date.now()}
Name: ${address.name}
Phone: ${address.phone}
Product / Service: ${productName}
Quantity: ${qty}
${priceText}

${hasCustomService ? 'Please review my design requirements, photos, and measurements, and let me know the final exact price.' : 'Please confirm my order.'}`

      const waUrl = `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(waMessage)}`
      setWhatsappUrl(waUrl)

      try {
        window.open(waUrl, '_blank')
      } catch (e) {
        console.warn('Popup blocked, user can click button:', e)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111827] flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 sm:p-10 shadow-card border border-[#E5E7EB] dark:border-charcoal-800">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring' }}
              className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-soft"
            >
              <Check className="w-8 h-8" />
            </motion.div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-white mb-2">
              Your order has been booked! 🎉
            </h2>
            <p className="text-[#64748B] dark:text-charcoal-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Our boutique master will connect with you shortly on WhatsApp to confirm tailoring measurements and finishing details.
            </p>

            {/* Order Details Card */}
            <div className="bg-[#F5F7FA] dark:bg-charcoal-800 rounded-2xl p-5 mb-6 text-left space-y-2 border border-[#E5E7EB] dark:border-charcoal-700">
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E5E7EB] dark:border-charcoal-700">
                <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">Booking ID</span>
                <span className="font-bold text-pink-600 dark:text-pink-400 text-sm">#{orderPlaced.orderNumber}</span>
              </div>
              <p className="text-xs text-[#64748B]"><span className="text-[#94A3B8]">Customer:</span> <span className="font-bold text-[#1F2937] dark:text-white">{orderPlaced.shippingAddress?.fullName || user?.name}</span></p>
              <p className="text-xs text-[#64748B]"><span className="text-[#94A3B8]">Phone:</span> <span className="font-bold text-[#1F2937] dark:text-white">{orderPlaced.shippingAddress?.phone || user?.phone}</span></p>
              <p className="text-xs text-[#64748B]"><span className="text-[#94A3B8]">Total Estimated:</span> <span className="font-bold text-pink-600 dark:text-pink-400 price-tag">₹{orderPlaced.totalPrice?.toLocaleString('en-IN')}</span></p>
              <p className="text-xs text-[#64748B]"><span className="text-[#94A3B8]">Status:</span> <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">Pending Confirmation</span></p>
            </div>

            {/* WhatsApp CTA */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-soft transition-all mb-4 text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" /> Open WhatsApp Chat Confirmation
              </a>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => navigate('/dashboard/orders')} className="btn-primary flex-1 py-3 text-xs font-bold">
                Track Order
              </button>
              <button onClick={() => navigate('/products')} className="btn-secondary flex-1 py-3 text-xs font-bold">
                Browse More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111827] flex items-center justify-center p-4">
        <div className="text-center p-8 bg-[#F5F7FA] dark:bg-[#1F2937] rounded-3xl border border-[#E5E7EB] max-w-sm">
          <ShoppingBag className="w-14 h-14 text-pink-400 mx-auto mb-3" />
          <h2 className="text-xl font-display font-bold text-[#1F2937] dark:text-white">Your bag is empty</h2>
          <p className="text-xs text-[#64748B] mt-1 mb-5">Add some beautiful designer blouses to your bag first.</p>
          <button onClick={() => navigate('/products')} className="btn-primary w-full text-xs py-2.5">Browse Catalog</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      {/* Header */}
      <div className="bg-[#F5F7FA] dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 py-10">
        <div className="section-container">
          <span className="badge badge-soft text-[10px] mb-2 inline-block">Secure Checkout</span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white">Book Your Custom Order</h1>
          <p className="text-[#64748B] dark:text-charcoal-400 text-xs mt-1">Provide your delivery address to submit your tailor booking.</p>
        </div>
      </div>

      <div className="section-container py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Address */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
                <h2 className="font-display text-base font-bold text-[#1F2937] dark:text-white mb-5 flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
                  <MapPin className="w-4 h-4 text-pink-600" /> Delivery Address & Contact
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Full Name *</label>
                    <input {...register('name', { required: 'Name required' })} className="input-field" placeholder="Full Name" />
                    {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Phone Number *</label>
                    <input {...register('phone', { required: 'Phone number required' })} className="input-field" placeholder="+91 9876543210" />
                    {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Email Address *</label>
                    <input {...register('email', { required: 'Email required' })} className="input-field" placeholder="your@email.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Shipping Street Address *</label>
                    <textarea {...register('address', { required: 'Address required' })} rows={2} className="input-field resize-none" placeholder="Door / Flat no., Street, Landmark" />
                    {errors.address && <p className="text-rose-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">City *</label>
                    <input {...register('city', { required: 'City required' })} className="input-field" placeholder="Bengaluru" />
                    {errors.city && <p className="text-rose-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Pincode *</label>
                    <input {...register('pincode', { required: 'Pincode required', pattern: { value: /^\d{6}$/, message: '6-digit pincode' } })} className="input-field" placeholder="560001" />
                    {errors.pincode && <p className="text-rose-500 text-xs mt-1">{errors.pincode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">State</label>
                    <input {...register('state')} className="input-field" defaultValue="Karnataka" />
                  </div>
                </div>
              </div>

              {/* Direct Studio Booking Notice */}
              <div className="bg-[#F5F7FA] dark:bg-pink-950/20 border border-[#E5E7EB] dark:border-pink-900/40 rounded-2xl p-5 flex items-center gap-4 shadow-soft">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 text-white shadow-soft">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2937] dark:text-white text-xs sm:text-sm">Direct Atelier Booking (Zero Upfront Pay)</h3>
                  <p className="text-[11px] text-[#64748B] dark:text-charcoal-300 mt-0.5 leading-relaxed">
                    No online payment required now! Once you click <strong>Book Custom Order</strong>, our boutique master connects with you on WhatsApp to finalize measurement specs and fabric selection.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-[#1F2937] rounded-2xl p-6 border border-[#E5E7EB] dark:border-charcoal-800 space-y-4 shadow-card">
                <h2 className="font-display text-sm font-bold text-[#1F2937] dark:text-white flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-charcoal-800">
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-pink-600" /> Order Summary ({items.length})
                  </span>
                  {isValidating && <span className="text-[10px] text-pink-600 animate-pulse font-normal">Validating stock...</span>}
                </h2>

                {/* Stock notice banner if any item is out of stock or deleted */}
                {hasInvalidItems && (
                  <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
                      Some items are out of stock or no longer available. Please remove them below to proceed.
                    </p>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {items.map((item, i) => {
                    const prod = item.product || {}
                    const key = prod._id || prod.id || `cart_item_${i}`
                    const itemValidation = validationMap[key] || { status: 'AVAILABLE' }
                    const isOutOfStock = itemValidation.status === 'OUT_OF_STOCK'
                    const isNoLongerAvailable = itemValidation.status === 'NO_LONGER_AVAILABLE'
                    const isInvalid = isOutOfStock || isNoLongerAvailable
                    const itemImg = getImageUrl(prod.images?.[0])

                    return (
                      <div
                        key={i}
                        className={`flex gap-3 items-center p-2.5 rounded-xl border transition-all ${
                          isInvalid
                            ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60'
                            : 'bg-[#F5F7FA]/50 dark:bg-charcoal-800/40 border-[#E5E7EB] dark:border-charcoal-800'
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-charcoal-800 flex-shrink-0 border border-[#E5E7EB]">
                          {itemImg ? (
                            <img src={itemImg} alt="" className={`w-full h-full object-cover ${isInvalid ? 'grayscale opacity-60' : ''}`} />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-pink-500/10 to-fuchsia-500/10 flex items-center justify-center text-lg">👗</div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${isInvalid ? 'text-rose-900 dark:text-rose-200 line-through' : 'text-[#1F2937] dark:text-white'}`}>
                            {prod.name}
                          </p>

                          {/* Status Badges */}
                          {isOutOfStock && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                              <AlertCircle className="w-2 h-2" /> OUT OF STOCK
                            </span>
                          )}
                          {isNoLongerAvailable && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                              <AlertCircle className="w-2 h-2" /> NO LONGER AVAILABLE
                            </span>
                          )}
                          {!isInvalid && (
                            <p className="text-[10px] text-[#64748B]">Qty: {item.quantity} {item.size ? `• ${item.size}` : ''}</p>
                          )}
                        </div>

                        <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                          {prod.customization?.isPriceToConfirm || prod.isCustomQuote || prod.price === 0 ? (
                            <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 max-w-[130px] leading-tight text-right">
                              Price: To be confirmed
                            </span>
                          ) : (
                            <p className={`text-xs font-bold price-tag ${isInvalid ? 'text-gray-400 line-through' : 'text-pink-600 dark:text-pink-400'}`}>
                              ₹{((itemValidation.currentPrice || prod.offerPrice || prod.price || 0) * item.quantity).toLocaleString('en-IN')}
                            </p>
                          )}
                          {isInvalid && (
                            <button
                              type="button"
                              onClick={() => dispatch(removeFromCart(i))}
                              className="text-[10px] text-white bg-rose-600 hover:bg-rose-700 px-2 py-0.5 rounded font-bold transition-colors"
                              title="Remove unavailable item"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-[#E5E7EB] dark:border-charcoal-800 pt-3 space-y-1.5 text-xs text-[#64748B] dark:text-charcoal-400">
                  {subtotal === 0 && items.some((i) => i.product?.customization?.isPriceToConfirm || i.product?.isCustomQuote) ? (
                    <div className="p-3 bg-pink-50 dark:bg-pink-950/30 rounded-xl border border-pink-200 dark:border-pink-900/40 text-center space-y-1">
                      <p className="text-xs font-bold text-pink-700 dark:text-pink-300">
                        Price: To be confirmed by SLV Fashion Studio
                      </p>
                      <p className="text-[10px] text-[#64748B] dark:text-slate-400">
                        Zero upfront payment. Final quotation will be provided after manual review.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Available Items Subtotal</span>
                        <span className="font-semibold text-[#1F2937] dark:text-white price-tag">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Boutique Delivery</span>
                        <span className={delivery === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-[#1F2937] dark:text-white'}>
                          {delivery === 0 ? 'FREE' : `₹${delivery}`}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Promo Coupon</span><span>-₹{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-sm text-[#1F2937] dark:text-white border-t border-[#E5E7EB] dark:border-charcoal-800 pt-2">
                        <span>Total Estimated</span>
                        <span className="text-pink-600 dark:text-pink-400 price-tag text-base">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Coupon */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="input-field flex-1 py-2 text-xs"
                    placeholder="Enter Coupon (e.g. SLV50)"
                    disabled={!!coupon || hasInvalidItems}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim() || !!coupon || hasInvalidItems}
                    className="px-3.5 py-2 btn-primary text-xs font-bold disabled:opacity-50"
                  >
                    <Tag className="w-3.5 h-3.5" />
                  </button>
                </div>
                {coupon && (
                  <p className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> {coupon.code} applied! ({coupon.discountPercent}% off)
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || hasInvalidItems || items.length === 0 || isValidating}
                  className={`w-full py-3.5 text-xs font-bold rounded-xl shadow-pink-glow mt-2 transition-all ${
                    hasInvalidItems || items.length === 0
                      ? 'bg-gray-300 dark:bg-charcoal-700 text-gray-500 cursor-not-allowed shadow-none'
                      : 'btn-primary'
                  }`}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : hasInvalidItems ? (
                    'Remove Unavailable Items to Book'
                  ) : (
                    'Book Custom Order'
                  )}
                </button>
                <div className="flex items-center justify-center gap-1 text-[10px] text-[#64748B] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
                  <span>No payment required now — confirmed on WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
