import { useParams, useNavigate } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, CheckCircle, Clock, Truck, Home, XCircle, Phone } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../utils/imageUtils'

const statusSteps = [
  { key: 'Pending Confirmation', label: 'Pending Confirmation', icon: Clock },
  { key: 'order_received', label: 'Order Received', icon: Package },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle },
  { key: 'in_production', label: 'In Production', icon: Clock },
  { key: 'quality_check', label: 'Quality Check', icon: CheckCircle },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
]

export default function OrderTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then((r) => r.data.order),
  })

  const cancelMutation = useMutation({
    mutationFn: () => api.patch(`/orders/${id}/cancel`),
    onSuccess: () => {
      toast.success('Order booking cancelled successfully')
      queryClient.invalidateQueries(['order', id])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Cannot cancel this order'),
  })

  if (isLoading) return (
    <div className="space-y-4">
      <div className="skeleton h-40 rounded-2xl" />
      <div className="skeleton h-60 rounded-2xl" />
    </div>
  )

  if (!order) return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">🔍</p>
      <p className="text-gray-500 font-medium">Booking order not found</p>
      <button onClick={() => navigate('/dashboard/orders')} className="btn-primary mt-4">Back to Bookings</button>
    </div>
  )

  const currentStatusIndex = statusSteps.findIndex((s) => s.key === order.status)
  const isCancelled = order.status === 'cancelled'
  const canCancel = ['Pending Confirmation', 'order_received', 'accepted'].includes(order.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/dashboard/orders')} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Booking #{order.orderNumber}</h2>
      </div>

      {/* Status Tracker */}
      {!isCancelled && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Booking Status Tracker</h3>
          <div className="relative">
            {statusSteps.map((step, i) => {
              const isCompleted = i <= (currentStatusIndex >= 0 ? currentStatusIndex : 0)
              const isCurrent = i === currentStatusIndex || (currentStatusIndex === -1 && i === 0)
              return (
                <div key={step.key} className="flex items-start gap-4 mb-4 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted ? 'bg-gradient-royal shadow-pink' : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      <step.icon className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${i < currentStatusIndex ? 'bg-gradient-royal' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    )}
                  </div>
                  <div className={`pb-4 ${isCurrent ? 'opacity-100' : isCompleted ? 'opacity-80' : 'opacity-40'}`}>
                    <p className={`font-semibold text-sm ${isCurrent ? 'text-gold-500' : 'text-gray-900 dark:text-white'}`}>
                      {step.label} {isCurrent && '✓'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-5 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-600 dark:text-red-400">Booking Cancelled</p>
            <p className="text-sm text-red-500">This order booking has been cancelled.</p>
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Booked Items</h3>
        <div className="space-y-3">
          {order.items?.map((item, i) => {
            const itemImg = getImageUrl(item.image || item.product?.images?.[0])
            return (
              <div key={i} className="flex gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                  {itemImg ? (
                    <img src={itemImg} alt={item.name || item.product?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center text-xl">👗</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{item.name || item.product?.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                  <p className="text-gold-500 font-bold text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Items Total</span><span>₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
          </div>
          {order.shippingCharge > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery</span><span>₹{order.shippingCharge}</span>
            </div>
          )}
          {order.couponDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-500">
              <span>Discount</span><span>-₹{order.couponDiscount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 dark:text-white">
            <span>Total Estimated</span><span>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Delivery Details</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {order.shippingAddress?.fullName || order.shippingAddress?.name}<br />
          {order.shippingAddress?.address}, {order.shippingAddress?.city}<br />
          {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
          <span className="flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {order.shippingAddress?.phone}</span>
        </p>
      </div>

      {/* Cancel button */}
      {canCancel && (
        <button
          onClick={() => { if (window.confirm('Cancel this order booking?')) cancelMutation.mutate() }}
          disabled={cancelMutation.isLoading}
          className="w-full py-3 border-2 border-red-400 text-red-500 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          {cancelMutation.isLoading ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      )}

      {/* Contact for help */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 text-center">
        <p className="text-sm text-gray-500 mb-2">Need help with your booking?</p>
        <a href="https://wa.me/919731912413" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-500 font-medium text-sm hover:underline">
          <Phone className="w-4 h-4" /> WhatsApp: +91 9731912413
        </a>
      </div>
    </div>
  )
}
