import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  MapPin, Check, Tag, ShoppingBag, MessageCircle, PhoneCall, Calendar
} from 'lucide-react'
import api from '../api/axios'
import { clearCart, selectCartTotal } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { getImageUrl } from '../utils/imageUtils'

const DELIVERY_CHARGE = 50
const FREE_DELIVERY_THRESHOLD = 500
const BUSINESS_PHONE = '919731912413'

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items } = useSelector((s) => s.cart)
  const { user } = useSelector((s) => s.auth)
  const subtotal = useSelector(selectCartTotal)

  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(null)
  const [whatsappUrl, setWhatsappUrl] = useState('')

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

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE
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
    if (items.length === 0) return toast.error('Your cart is empty')
    setLoading(true)
    try {
      const orderData = {
        items: items.map((item) => ({
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
      const firstItem = items[0]
      const productName = firstItem?.product?.name || 'Boutique Custom Wear'
      const qty = items.reduce((acc, i) => acc + i.quantity, 0)

      const waMessage = `Hello SLV Women's Fashion Studio,
I have placed a new order.

Order ID: ${bookedOrder.orderNumber}
Name: ${address.name}
Phone: ${address.phone}
Product: ${productName}
Quantity: ${qty}

Please contact me regarding my order.`

      const waUrl = `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(waMessage)}`
      setWhatsappUrl(waUrl)

      // Automatically open WhatsApp in new tab
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

  // Order Success Screen (No payment details)
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100 dark:border-gray-700">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
            >
              <Check className="w-10 h-10 text-green-500" />
            </motion.div>

            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your order has been received successfully! 🎉
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Our team will contact you shortly to confirm your customization and delivery schedule.
            </p>

            {/* Order Details Card */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 mb-6 text-left space-y-2 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Booking Order ID</span>
                <span className="font-bold text-gold-600 text-base">#{orderPlaced.orderNumber}</span>
              </div>
              <p className="text-sm"><span className="text-gray-400">Customer:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{orderPlaced.shippingAddress?.fullName || user?.name}</span></p>
              <p className="text-sm"><span className="text-gray-400">Phone:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{orderPlaced.shippingAddress?.phone || user?.phone}</span></p>
              <p className="text-sm"><span className="text-gray-400">Total Estimated:</span> <span className="font-bold text-gold-500">₹{orderPlaced.totalPrice?.toLocaleString('en-IN')}</span></p>
              <p className="text-sm"><span className="text-gray-400">Status:</span> <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending Confirmation</span></p>
            </div>

            {/* WhatsApp CTA */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all mb-4"
              >
                <MessageCircle className="w-5 h-5 fill-white" /> Open WhatsApp Chat
              </a>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => navigate('/dashboard/orders')} className="btn-primary flex-1 py-3 text-sm">
                Track Booking
              </button>
              <button onClick={() => navigate('/products')} className="btn-outline flex-1 py-3 text-sm">
                Shop More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Cart is empty</h2>
          <button onClick={() => navigate('/products')} className="btn-primary mt-4">Browse Products</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-hero py-10">
        <div className="section-container">
          <h1 className="font-display text-3xl font-bold text-white">Book Your Order</h1>
          <p className="text-white/70 text-sm mt-1">Fill in your delivery address to submit your order booking request</p>
        </div>
      </div>

      <div className="section-container py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Address */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold-500" /> Delivery Address & Contact
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                    <input {...register('name', { required: 'Name required' })} className="input-field" placeholder="Full Name" />
                    {errors.name && <p className="text-pink-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                    <input {...register('phone', { required: 'Phone number required' })} className="input-field" placeholder="+91 9876543210" />
                    {errors.phone && <p className="text-pink-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                    <input {...register('email', { required: 'Email required' })} className="input-field" placeholder="your@email.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Address *</label>
                    <textarea {...register('address', { required: 'Address required' })} rows={2} className="input-field resize-none" placeholder="House no., Street, Area" />
                    {errors.address && <p className="text-pink-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                    <input {...register('city', { required: 'City required' })} className="input-field" placeholder="City" />
                    {errors.city && <p className="text-pink-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode *</label>
                    <input {...register('pincode', { required: 'Pincode required', pattern: { value: /^\d{6}$/, message: '6-digit pincode' } })} className="input-field" placeholder="560001" />
                    {errors.pincode && <p className="text-pink-500 text-xs mt-1">{errors.pincode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                    <input {...register('state')} className="input-field" defaultValue="Karnataka" />
                  </div>
                </div>
              </div>

              {/* No Payment Notice */}
              <div className="bg-gradient-to-r from-purple-900/10 to-pink-900/10 border border-gold-500/30 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center flex-shrink-0 shadow-gold">
                  <PhoneCall className="w-6 h-6 text-purple-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">Direct Studio Booking</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                    No online payment required now! Once you click <strong>Book Order</strong>, your details will be sent directly to our studio team. We will call you & connect on WhatsApp to confirm your order details.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
                <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold-500" /> Order Items ({items.length})
                </h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item, i) => {
                    const itemImg = getImageUrl(item.product.images?.[0])
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                          {itemImg ? (
                            <img src={itemImg} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center text-lg">👗</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity} {item.size ? `| ${item.size}` : ''}</p>
                        </div>
                        <p className="text-sm font-bold text-gold-500">₹{((item.product.offerPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? 'text-green-500 font-semibold' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-500">
                      <span>Coupon Discount</span><span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base border-t border-gray-200 dark:border-gray-700 pt-2">
                    <span>Total Estimated</span><span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="input-field flex-1 py-2 text-sm"
                    placeholder="Coupon code"
                    disabled={!!coupon}
                  />
                  <button type="button" onClick={handleApplyCoupon} disabled={couponLoading || !!coupon}
                    className="px-3 py-2 bg-gradient-royal text-white text-sm font-medium rounded-xl disabled:opacity-50">
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
                {coupon && (
                  <p className="text-green-500 text-xs flex items-center gap-1">
                    <Check className="w-3 h-3" /> {coupon.code} applied! {coupon.discountPercent}% off
                  </p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full btn-gold py-4 text-base font-bold shadow-gold mt-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    'Book Order'
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center">No payment required now — studio team will confirm on WhatsApp</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
