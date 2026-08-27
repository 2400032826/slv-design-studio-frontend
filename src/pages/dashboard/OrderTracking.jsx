import { useState } from 'react'
import { useParams, useNavigate } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, CheckCircle, Clock, Truck, Home, XCircle, Phone, Sparkles, Star, MessageCircle } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../utils/imageUtils'
import ReviewModal from '../../components/reviews/ReviewModal'
import CancelOrderModal from '../../components/orders/CancelOrderModal'

const statusSteps = [
  { key: 'Pending Confirmation', label: 'Pending Confirmation', icon: Clock },
  { key: 'order_received', label: 'Order Received', icon: Package },
  { key: 'accepted', label: 'Accepted by Atelier', icon: CheckCircle },
  { key: 'in_production', label: 'In Tailoring / Embroidery', icon: Clock },
  { key: 'quality_check', label: 'Quality Check & Finish', icon: CheckCircle },
  { key: 'packed', label: 'Packed in Boutique Box', icon: Package },
  { key: 'shipped', label: 'Shipped / Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
]

export default function OrderTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [reviewProduct, setReviewProduct] = useState(null)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)

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
    <div className="text-center py-20 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB]">
      <p className="text-4xl mb-3">🔍</p>
      <p className="text-[#64748B] font-semibold text-sm">Booking order not found</p>
      <button onClick={() => navigate('/dashboard/orders')} className="btn-primary mt-4 text-xs py-2 px-6">Back to Bookings</button>
    </div>
  )

  const currentStatusIndex = statusSteps.findIndex((s) => s.key === order.status)
  const isCancelled = order.status === 'cancelled'
  const isDelivered = order.status === 'delivered' || order.status === 'completed'
  const canCancel = ['Pending Confirmation', 'order_received', 'accepted'].includes(order.status)

  const firstItem = order.items?.[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
        <button onClick={() => navigate('/dashboard/orders')} className="p-2 rounded-xl hover:bg-[#F5F7FA] border border-[#E5E7EB] text-[#64748B] transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-display text-lg font-bold text-[#1F2937] dark:text-white">Order Tracking #{order.orderNumber}</h2>
          <p className="text-[11px] text-[#64748B]">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Review Request Card when Delivered */}
      {isDelivered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 sm:p-6 bg-gradient-to-r from-pink-50 via-fuchsia-50 to-rose-50 dark:from-pink-950/40 dark:via-charcoal-800 dark:to-rose-950/40 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-soft"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-soft flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="badge badge-soft text-[10px] font-bold uppercase tracking-wider mb-1">Delivered</span>
                <h4 className="font-display text-sm sm:text-base font-bold text-[#1F2937] dark:text-white">
                  Your order has been delivered! How was your experience{firstItem ? ` with ${firstItem.name || firstItem.product?.name}` : ''}?
                </h4>
                <p className="text-xs text-[#64748B] dark:text-gray-300 mt-0.5">
                  Share your verified feedback to help other boutique clients.
                </p>
              </div>
            </div>
            {firstItem && (
              <button
                onClick={() => setReviewProduct(firstItem.product || firstItem)}
                className="btn-primary py-2.5 px-5 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-soft self-start sm:self-auto"
              >
                <Star className="w-4 h-4 fill-white" /> Rate your experience
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Status Tracker */}
      {!isCancelled && (
        <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
          <h3 className="font-display font-bold text-sm text-[#1F2937] dark:text-white mb-6">Atelier Progress Timeline</h3>
          <div className="relative">
            {statusSteps.map((step, i) => {
              const isCompleted = i <= (currentStatusIndex >= 0 ? currentStatusIndex : 0)
              const isCurrent = i === currentStatusIndex || (currentStatusIndex === -1 && i === 0)
              return (
                <div key={step.key} className="flex items-start gap-4 mb-4 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-soft' : 'bg-[#F5F7FA] dark:bg-charcoal-800 border border-[#E5E7EB] text-[#94A3B8]'
                    }`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${i < currentStatusIndex ? 'bg-gradient-to-b from-pink-500 to-fuchsia-600' : 'bg-[#E5E7EB] dark:bg-charcoal-700'}`} />
                    )}
                  </div>
                  <div className={`pb-4 ${isCurrent ? 'opacity-100' : isCompleted ? 'opacity-90' : 'opacity-40'}`}>
                    <p className={`font-bold text-xs ${isCurrent ? 'text-pink-600 dark:text-pink-400' : 'text-[#1F2937] dark:text-white'}`}>
                      {step.label} {isCurrent && '— Current Stage'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl p-5 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-xs text-rose-600 dark:text-rose-400">Booking Cancelled</p>
            <p className="text-[11px] text-rose-500">This order booking has been cancelled.</p>
          </div>
        </div>
      )}

      {/* Order Details & Booked Items */}
      <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
        <h3 className="font-display font-bold text-sm text-[#1F2937] dark:text-white mb-4 pb-2 border-b border-[#E5E7EB]">Booked Items & Purchase Snapshot</h3>
        <div className="space-y-3">
          {order.items?.map((item, i) => {
            const itemImg = getImageUrl(item.image || item.product?.images?.[0])
            return (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3.5 rounded-2xl bg-[#F5F7FA]/70 dark:bg-charcoal-800 border border-[#E5E7EB] dark:border-charcoal-700">
                <div className="flex gap-3.5 items-center">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-gray-700 flex-shrink-0 border border-[#E5E7EB]">
                    {itemImg ? (
                      <img src={itemImg} alt={item.name || item.product?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-pink-500/10 to-fuchsia-500/10 flex items-center justify-center text-xl">👗</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-[#1F2937] dark:text-white line-clamp-1">{item.name || item.product?.name}</p>
                    <p className="text-[11px] text-[#64748B]">Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''} {item.color ? `• Color: ${item.color}` : ''}</p>
                    <p className="text-pink-600 dark:text-pink-400 font-bold text-xs mt-0.5 price-tag">
                      Purchase Price: ₹{(item.price || 0).toLocaleString('en-IN')} {item.quantity > 1 ? `(Subtotal: ₹${((item.price || 0) * item.quantity).toLocaleString('en-IN')})` : ''}
                    </p>
                  </div>
                </div>

                {isDelivered && (
                  <button
                    onClick={() => setReviewProduct(item.product || item)}
                    className="btn-secondary py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 self-start sm:self-center border-pink-200 text-pink-600 hover:bg-pink-50"
                  >
                    <Star className="w-3.5 h-3.5 fill-pink-500 text-pink-500" /> Write Review
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Pricing Breakdown Snapshot */}
        <div className="border-t border-[#E5E7EB] dark:border-charcoal-700 mt-5 pt-4 space-y-2 text-xs text-[#64748B] dark:text-gray-400">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span className="font-semibold text-[#1F2937] dark:text-white price-tag">
              ₹{(order.itemsPrice || order.items?.reduce((acc, it) => acc + ((it.price || 0) * (it.quantity || 1)), 0) || order.totalPrice || 0).toLocaleString('en-IN')}
            </span>
          </div>
          {order.shippingCharge > 0 ? (
            <div className="flex justify-between">
              <span>Boutique Delivery</span><span className="font-semibold text-[#1F2937] dark:text-white price-tag">₹{order.shippingCharge}</span>
            </div>
          ) : (
            <div className="flex justify-between">
              <span>Boutique Delivery</span><span className="font-semibold text-emerald-600">FREE</span>
            </div>
          )}
          {order.expressCharge > 0 && (
            <div className="flex justify-between">
              <span>Express Crafting</span><span className="font-semibold text-[#1F2937] dark:text-white price-tag">₹{order.expressCharge}</span>
            </div>
          )}
          {order.giftWrapCharge > 0 && (
            <div className="flex justify-between">
              <span>Gift Packaging</span><span className="font-semibold text-[#1F2937] dark:text-white price-tag">₹{order.giftWrapCharge}</span>
            </div>
          )}
          {order.couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Promo Discount</span><span>-₹{order.couponDiscount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-sm text-[#1F2937] dark:text-white border-t border-[#E5E7EB] dark:border-charcoal-700 pt-3">
            <span>Final Order Total</span>
            <span className="text-pink-600 dark:text-pink-400 price-tag text-base">₹{(order.totalPrice || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={!!reviewProduct}
        onClose={() => setReviewProduct(null)}
        product={reviewProduct}
        orderId={order._id}
        orderNumber={order.orderNumber}
        onSuccess={() => {
          queryClient.invalidateQueries(['order', id])
          queryClient.invalidateQueries(['my-orders'])
        }}
      />

      {/* Cancellation Banner if Cancelled */}
      {isCancelled && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-xs text-rose-600 dark:text-rose-400">Booking Cancelled</p>
              <p className="text-[11px] text-rose-500">
                This order was cancelled on {order.cancelledAt ? new Date(order.cancelledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(order.updatedAt).toLocaleDateString('en-IN')}.
              </p>
            </div>
          </div>
          {order.cancellationReason && (
            <div className="pt-2 border-t border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300">
              <span className="font-bold">Cancellation Reason:</span> {order.cancellationReason}
              {order.cancellationDetails && ` — "${order.cancellationDetails}"`}
            </div>
          )}
        </div>
      )}

      {/* Cancel Order Button */}
      {canCancel && (
        <button
          onClick={() => setCancelModalOpen(true)}
          className="w-full py-3.5 border border-rose-300 dark:border-rose-900/50 bg-rose-50/50 hover:bg-rose-100/70 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-soft"
        >
          <XCircle className="w-4 h-4" /> Cancel Order Booking
        </button>
      )}

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        order={order}
        onSuccess={() => {
          queryClient.invalidateQueries(['order', id])
          queryClient.invalidateQueries(['my-orders'])
          queryClient.invalidateQueries(['admin-orders'])
          queryClient.invalidateQueries(['admin-dashboard'])
        }}
      />

      {/* WhatsApp Atelier Consultation */}
      <div className="bg-[#F5F7FA] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-charcoal-800 rounded-2xl p-4 text-center">
        <p className="text-xs text-[#64748B] dark:text-gray-300 mb-2">Need assistance or custom alterations for this order?</p>
        <a
          href={`https://wa.me/919731912413?text=${encodeURIComponent(`Hello SLV Fashion Studio, I have a query regarding my order #${order.orderNumber}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-soft"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp Atelier: +91 9731912413
        </a>
      </div>
    </div>
  )
}
