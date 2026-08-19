import { useParams, useNavigate } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, CheckCircle, Clock, Truck, Home, XCircle, Phone, Sparkles } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../utils/imageUtils'

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
  const canCancel = ['Pending Confirmation', 'order_received', 'accepted'].includes(order.status)

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

      {/* Order Details */}
      <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
        <h3 className="font-display font-bold text-sm text-[#1F2937] dark:text-white mb-4 pb-2 border-b border-[#E5E7EB]">Booked Items</h3>
        <div className="space-y-3">
          {order.items?.map((item, i) => {
            const itemImg = getImageUrl(item.image || item.product?.images?.[0])
            return (
              <div key={i} className="flex gap-3.5 p-3 rounded-xl bg-[#F5F7FA]/50 dark:bg-charcoal-800 border border-[#E5E7EB]">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-gray-700 flex-shrink-0 border border-[#E5E7EB]">
                  {itemImg ? (
                    <img src={itemImg} alt={item.name || item.product?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-pink-500/10 to-fuchsia-500/10 flex items-center justify-center text-xl">👗</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-[#1F2937] dark:text-white line-clamp-1">{item.name || item.product?.name}</p>
                  <p className="text-[11px] text-[#64748B]">Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''} {item.color ? `• Color: ${item.color}` : ''}</p>
                  <p className="text-pink-600 dark:text-pink-400 font-bold text-xs mt-0.5 price-tag">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t border-[#E5E7EB] mt-4 pt-4 space-y-1.5 text-xs text-[#64748B]">
          <div className="flex justify-between">
            <span>Items Total</span><span className="font-semibold text-[#1F2937] dark:text-white price-tag">₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
          </div>
          {order.shippingCharge > 0 && (
            <div className="flex justify-between">
              <span>Boutique Delivery</span><span className="font-semibold text-[#1F2937] dark:text-white price-tag">₹{order.shippingCharge}</span>
            </div>
          )}
          {order.couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Promo Discount</span><span>-₹{order.couponDiscount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-sm text-[#1F2937] dark:text-white border-t border-[#E5E7EB] pt-2">
            <span>Total Estimated</span><span className="text-pink-600 dark:text-pink-400 price-tag">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
        <h3 className="font-display font-bold text-sm text-[#1F2937] dark:text-white mb-2">Delivery Details</h3>
        <p className="text-xs text-[#64748B] dark:text-charcoal-400 leading-relaxed">
          <span className="font-bold text-[#1F2937] dark:text-white">{order.shippingAddress?.fullName || order.shippingAddress?.name}</span><br />
          {order.shippingAddress?.address}, {order.shippingAddress?.city}<br />
          {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
          <span className="flex items-center gap-1 mt-1 font-semibold text-[#1F2937] dark:text-white"><Phone className="w-3 h-3 text-pink-500" /> {order.shippingAddress?.phone}</span>
        </p>
      </div>

      {/* Cancel button */}
      {canCancel && (
        <button
          onClick={() => { if (window.confirm('Cancel this order booking?')) cancelMutation.mutate() }}
          disabled={cancelMutation.isLoading}
          className="w-full py-3 border border-rose-300 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
        >
          {cancelMutation.isLoading ? 'Cancelling...' : 'Cancel Order Booking'}
        </button>
      )}

      {/* Contact for help */}
      <div className="bg-[#F5F7FA] dark:bg-[#1F2937] border border-[#E5E7EB] rounded-2xl p-4 text-center">
        <p className="text-xs text-[#64748B] mb-1.5">Need assistance or measurement alterations for this order?</p>
        <a href="https://wa.me/919731912413" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs hover:underline">
          <Phone className="w-3.5 h-3.5" /> WhatsApp Atelier: +91 9731912413
        </a>
      </div>
    </div>
  )
}
