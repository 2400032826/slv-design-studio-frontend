import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye, Phone, MessageCircle, Printer, Trash2, X, FileText, Download, Sparkles, Menu, Ban } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'
import { getImageUrl } from '../../utils/imageUtils'
import CancelOrderModal from '../../components/orders/CancelOrderModal'

const ORDER_STATUSES = [
  'Pending Confirmation',
  'accepted',
  'in_production',
  'embroidery_started',
  'printing_started',
  'stitching_started',
  'quality_check',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
]

const statusColors = {
  'Pending Confirmation': 'bg-amber-50 text-amber-700 border-amber-200',
  order_received: 'bg-blue-50 text-blue-700 border-blue-200',
  accepted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  in_production: 'bg-purple-50 text-purple-700 border-purple-200',
  embroidery_started: 'bg-pink-50 text-pink-700 border-pink-200',
  printing_started: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  stitching_started: 'bg-teal-50 text-teal-700 border-teal-200',
  quality_check: 'bg-amber-50 text-amber-800 border-amber-200',
  packed: 'bg-orange-50 text-orange-700 border-orange-200',
  shipped: 'bg-blue-100 text-blue-800 border-blue-300',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function AdminOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [cancellingOrder, setCancellingOrder] = useState(null)
  const queryClient = useQueryClient()

  const adminHeaders = { headers: { Authorization: `Bearer ${localStorage.getItem('slv_admin_token')}` } }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', search, statusFilter, page],
    queryFn: async () => {
      try {
        const res = await api.get(`/admin/orders?search=${encodeURIComponent(search)}&status=${statusFilter}&page=${page}`, adminHeaders)
        return res.data
      } catch (err) {
        const fallback = await api.get(`/orders?search=${encodeURIComponent(search)}&status=${statusFilter}&page=${page}`, adminHeaders)
        return fallback.data
      }
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      try {
        return await api.put(`/admin/orders/${id}/status`, { status }, adminHeaders)
      } catch (e) {
        return await api.put(`/orders/${id}/status`, { status }, adminHeaders)
      }
    },
    onSuccess: () => {
      toast.success('Production status updated')
      queryClient.invalidateQueries(['admin-orders'])
      queryClient.invalidateQueries(['admin-dashboard'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update status'),
  })

  const deleteOrderMutation = useMutation({
    mutationFn: async (id) => {
      try {
        return await api.delete(`/admin/orders/${id}`, adminHeaders)
      } catch (e) {
        return await api.delete(`/orders/${id}`, adminHeaders)
      }
    },
    onSuccess: () => {
      toast.success('Order deleted')
      queryClient.invalidateQueries(['admin-orders'])
      queryClient.invalidateQueries(['admin-dashboard'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete order'),
  })

  const orders = data?.orders || []
  const totalPages = data?.totalPages || 1

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus })
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]/50 dark:bg-[#111827] flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 min-w-0 transition-all duration-300 ml-0 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="sticky top-0 z-30 bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-slate-800 rounded-xl border border-[#E5E7EB] dark:border-slate-700 text-[#64748B] md:hidden transition-colors"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display text-base sm:text-xl font-bold text-[#1F2937] dark:text-white truncate">Orders & Bookings</h1>
          </div>
          <span className="badge badge-soft text-xs font-bold">{data?.total || 0} Total Orders</span>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order # or client name..."
                className="input-field pl-10 py-2 w-full text-xs shadow-soft"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field py-2 text-xs shadow-soft w-full sm:w-auto"
            >
              <option value="">All Production Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Desktop Orders Table */}
          <div className="hidden md:block bg-white dark:bg-[#1F2937] rounded-3xl border border-[#E5E7EB] dark:border-charcoal-800 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F7FA] dark:bg-charcoal-800 border-b border-[#E5E7EB]">
                  <tr>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Order ID</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Customer</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Est.</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Production Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Booked Date</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-charcoal-700">
                  {isLoading ? (
                    Array(8).fill(null).map((_, i) => (
                      <tr key={i}>
                        {Array(6).fill(null).map((_, j) => (
                          <td key={j} className="px-5 py-4"><div className="skeleton h-4 w-full rounded-lg" /></td>
                        ))}
                      </tr>
                    ))
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-[#94A3B8]">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-30 text-pink-400" />
                        <p className="text-sm font-semibold text-[#64748B]">No booking orders found</p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const custPhone = order.shippingAddress?.phone || order.user?.phone || ''
                      const cleanPhone = custPhone.replace(/[^0-9]/g, '')
                      const orderSubtotal = order.itemsPrice || order.items?.reduce((acc, it) => acc + ((it.price || 0) * (it.quantity || 1)), 0) || 0
                      const orderTrueTotal = Math.max(0, orderSubtotal + (order.shippingCharge || 0) + (order.expressCharge || 0) + (order.giftWrapCharge || 0) - (order.couponDiscount || 0))
                      return (
                        <tr key={order._id} className="hover:bg-[#F5F7FA]/60 dark:hover:bg-charcoal-800/40 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-mono text-xs font-bold text-pink-600 dark:text-pink-400">#{order.orderNumber}</p>
                            <p className="text-[11px] text-[#94A3B8]">{order.items?.length} item(s)</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-xs sm:text-sm font-bold text-[#1F2937] dark:text-white">{order.shippingAddress?.fullName || order.user?.name || 'Customer'}</p>
                            <p className="text-[11px] text-[#64748B]">{order.shippingAddress?.phone || order.user?.email}</p>
                          </td>
                          <td className="px-5 py-4">
                            {orderTrueTotal === 0 ? (
                              <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded-full border border-pink-200">
                                Quote to Confirm
                              </span>
                            ) : (
                              <p className="font-bold text-xs sm:text-sm text-pink-600 dark:text-pink-400 price-tag">
                                ₹{orderTrueTotal.toLocaleString('en-IN')}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`text-[10px] sm:text-xs px-2.5 py-1.5 rounded-full border font-bold cursor-pointer focus:outline-none ${statusColors[order.status] || 'bg-[#F5F7FA] text-gray-700 border-[#E5E7EB]'}`}
                            >
                              {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-4 text-xs text-[#64748B]">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setSelectedOrder(order)}
                                className="p-2 rounded-xl bg-[#F5F7FA] hover:bg-pink-50 text-pink-600 border border-[#E5E7EB] transition-colors" title="View Booking Details">
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {custPhone && (
                                <a href={`tel:${custPhone}`} className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors" title="Call Customer">
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors"
                                  title="WhatsApp Chat"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}

                              <button
                                onClick={() => { if (window.confirm(`Delete booking order #${order.orderNumber}?`)) deleteOrderMutation.mutate(order._id) }}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Orders Card List */}
          <div className="md:hidden space-y-3">
            {isLoading ? (
              Array(4).fill(null).map((_, i) => (
                <div key={i} className="p-4 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-slate-800 animate-pulse space-y-3">
                  <div className="h-4 w-1/3 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-1/2 bg-gray-100 dark:bg-slate-800 rounded" />
                </div>
              ))
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] p-4 text-[#94A3B8]">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30 text-pink-400" />
                <p className="text-sm font-semibold text-[#64748B]">No booking orders found</p>
              </div>
            ) : (
              orders.map((order) => {
                const custPhone = order.shippingAddress?.phone || order.user?.phone || ''
                const cleanPhone = custPhone.replace(/[^0-9]/g, '')
                return (
                  <div key={order._id} className="p-4 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-xs font-bold text-pink-600 dark:text-pink-400">#{order.orderNumber}</p>
                        <p className="text-sm font-bold text-[#1F2937] dark:text-white mt-0.5">
                          {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                        </p>
                        <p className="text-[11px] text-[#64748B]">{custPhone}</p>
                      </div>
                      <div className="text-right">
                        {order.totalPrice === 0 || !order.totalPrice ? (
                          <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                            Quote to Confirm
                          </span>
                        ) : (
                          <p className="font-bold text-sm text-pink-600 dark:text-pink-400 price-tag">
                            ₹{order.totalPrice.toLocaleString('en-IN')}
                          </p>
                        )}
                        <p className="text-[10px] text-[#94A3B8] mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#E5E7EB] dark:border-slate-800">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`flex-1 text-[11px] px-2.5 py-1.5 rounded-xl border font-bold focus:outline-none ${statusColors[order.status] || 'bg-[#F5F7FA] text-gray-700 border-[#E5E7EB]'}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>

                      <button onClick={() => setSelectedOrder(order)} className="p-2 rounded-xl bg-[#F5F7FA] text-pink-600 border border-[#E5E7EB]">
                        <Eye className="w-4 h-4" />
                      </button>

                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    p === page ? 'btn-primary text-white shadow-soft' : 'bg-white dark:bg-gray-800 text-[#64748B] border border-[#E5E7EB] hover:bg-[#F5F7FA]'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E5E7EB] dark:border-charcoal-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-charcoal-800 mb-5">
                <div>
                  <span className="badge badge-soft text-[10px] uppercase font-bold tracking-wider mb-1 inline-block">Order Dossier</span>
                  <h3 className="font-display text-xl font-bold text-[#1F2937] dark:text-white">Booking #{selectedOrder.orderNumber}</h3>
                  <p className="text-xs text-[#64748B]">Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => window.print()} className="p-2 rounded-xl border border-[#E5E7EB] text-[#64748B] hover:bg-[#F5F7FA] transition-colors" title="Print Invoice / Order">
                    <Printer className="w-4 h-4" />
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full hover:bg-[#F5F7FA] text-[#64748B]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Cancellation Reason Notice if Cancelled */}
              {selectedOrder.status === 'cancelled' && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-4 mb-5 space-y-1.5 text-rose-900 dark:text-rose-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-600 dark:text-rose-400">
                    <X className="w-4 h-4" /> Order Cancelled
                  </div>
                  {selectedOrder.cancellationReason && (
                    <p className="text-xs">
                      <span className="font-bold">Cancellation Reason:</span> {selectedOrder.cancellationReason}
                      {selectedOrder.cancellationDetails && ` — "${selectedOrder.cancellationDetails}"`}
                    </p>
                  )}
                  {selectedOrder.cancelledAt && (
                    <p className="text-[11px] text-rose-700 dark:text-rose-400">
                      Cancelled on: {new Date(selectedOrder.cancelledAt).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              )}

              {/* Customer & Quick Action Bar */}
              <div className="bg-[#F5F7FA] dark:bg-charcoal-800 rounded-2xl p-4 mb-5 flex flex-wrap items-center justify-between gap-3 border border-[#E5E7EB] dark:border-charcoal-700">
                <div>
                  <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-bold">Client Contact</p>
                  <p className="font-bold text-xs sm:text-sm text-[#1F2937] dark:text-white">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}</p>
                  <p className="text-xs text-[#64748B]">{selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone || 'No phone'} | {selectedOrder.user?.email}</p>
                </div>
                <div className="flex gap-2">
                  {(selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone) && (
                    <>
                      <a
                        href={`tel:${selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone}`}
                        className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5 font-bold"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a
                        href={`https://wa.me/91${(selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone).replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-soft"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" /> WhatsApp
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Booked Items & Price Snapshots</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, i) => {
                    const itemImg = getImageUrl(item.image || item.product?.images?.[0])
                    return (
                      <div key={i} className="p-3.5 bg-[#F5F7FA] dark:bg-charcoal-800/50 rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-700 overflow-hidden flex-shrink-0 border border-[#E5E7EB]">
                          {itemImg ? (
                            <img src={itemImg} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#FFF5F9] flex items-center justify-center text-sm">👗</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-[#1F2937] dark:text-white">{item.name || item.product?.name}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#64748B] mt-0.5">
                            <span>Qty: <strong className="text-[#1F2937] dark:text-white">{item.quantity}</strong></span>
                            <span>Purchase Price: <strong className="text-pink-600 dark:text-pink-400">₹{(item.price || 0).toLocaleString('en-IN')}</strong></span>
                            {item.product?.price && item.product.price !== item.price && (
                              <span className="text-[11px] text-[#94A3B8]">(Catalog: ₹{item.product.price})</span>
                            )}
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                          {/* Customization Details */}
                          {item.customization && Object.keys(item.customization).length > 0 && (
                            <div className="mt-2 text-xs bg-white dark:bg-pink-950/20 p-2.5 rounded-xl border border-pink-200 text-pink-800 dark:text-pink-300 space-y-1">
                              <p className="font-bold text-pink-900 dark:text-pink-200">Customization Specifications:</p>
                              {item.customization.fabricType && <p>• Fabric: {item.customization.fabricType}</p>}
                              {item.customization.embroideryType && <p>• Embroidery: {item.customization.embroideryType}</p>}
                              {item.customization.specialInstructions && <p>• Notes: {item.customization.specialInstructions}</p>}
                              {item.customization.referenceImages?.length > 0 && (
                                <div className="flex gap-1.5 pt-1">
                                  {item.customization.referenceImages.map((refImg, rIdx) => (
                                    <a key={rIdx} href={getImageUrl(refImg)} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg overflow-hidden border border-pink-300">
                                      <img src={getImageUrl(refImg)} alt="design" className="w-full h-full object-cover" />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {item.customization?.isPriceToConfirm || !item.price || item.price === 0 ? (
                          <span className="font-bold text-xs text-pink-600 dark:text-pink-400 max-w-[140px] text-right">
                            Price: To be confirmed by Studio
                          </span>
                        ) : (
                          <p className="font-bold text-xs sm:text-sm text-pink-600 dark:text-pink-400 price-tag">
                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Financial & Price Summary */}
              {(() => {
                const subtotal = selectedOrder.itemsPrice || selectedOrder.items?.reduce((acc, it) => acc + ((it.price || 0) * (it.quantity || 1)), 0) || 0;
                const shipping = selectedOrder.shippingCharge || 0;
                const express = selectedOrder.expressCharge || 0;
                const giftWrap = selectedOrder.giftWrapCharge || 0;
                const discount = selectedOrder.couponDiscount || 0;
                const trueTotal = Math.max(0, subtotal + shipping + express + giftWrap - discount);

                return (
                  <div className="mb-5 bg-[#F5F7FA] dark:bg-charcoal-800/60 p-4 rounded-2xl border border-[#E5E7EB] dark:border-charcoal-700 space-y-2">
                    <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Price Breakdown</h4>
                    <div className="flex justify-between text-xs text-[#64748B] dark:text-gray-400">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-[#1F2937] dark:text-white">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {shipping > 0 ? (
                      <div className="flex justify-between text-xs text-[#64748B] dark:text-gray-400">
                        <span>Shipping & Delivery</span>
                        <span className="font-semibold text-[#1F2937] dark:text-white">₹{shipping}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-xs text-[#64748B] dark:text-gray-400">
                        <span>Shipping & Delivery</span>
                        <span className="font-semibold text-emerald-600">FREE</span>
                      </div>
                    )}
                    {express > 0 && (
                      <div className="flex justify-between text-xs text-[#64748B] dark:text-gray-400">
                        <span>Express Crafting</span>
                        <span className="font-semibold text-[#1F2937] dark:text-white">₹{express}</span>
                      </div>
                    )}
                    {giftWrap > 0 && (
                      <div className="flex justify-between text-xs text-[#64748B] dark:text-gray-400">
                        <span>Gift Packaging</span>
                        <span className="font-semibold text-[#1F2937] dark:text-white">₹{giftWrap}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-xs text-pink-600 font-semibold">
                        <span>Coupon Discount</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-[#1F2937] dark:text-white pt-2 border-t border-[#E5E7EB] dark:border-charcoal-700">
                      <span>Total Order Amount</span>
                      <span className="text-pink-600 dark:text-pink-400 price-tag">₹{trueTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Shipping Address */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Delivery Destination</h4>
                <p className="text-xs text-[#1F2937] dark:text-gray-300 bg-[#F5F7FA] dark:bg-charcoal-800 p-3.5 rounded-2xl border border-[#E5E7EB] dark:border-charcoal-700 leading-relaxed">
                  {selectedOrder.shippingAddress?.fullName}<br />
                  {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}<br />
                  Phone: {selectedOrder.shippingAddress?.phone}
                </p>
              </div>

              {/* Order Status Action */}
              <div className="pt-4 border-t border-[#E5E7EB] dark:border-charcoal-800 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#64748B]">Update State:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-bold ${statusColors[selectedOrder.status] || 'bg-gray-100'}`}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                    <button
                      onClick={() => setCancellingOrder(selectedOrder)}
                      className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-amber-200 dark:border-amber-900/40"
                    >
                      <Ban className="w-3.5 h-3.5" /> Cancel Order
                    </button>
                  )}

                  <button
                    onClick={() => { if (window.confirm('Delete this order permanently from records?')) deleteOrderMutation.mutate(selectedOrder._id) }}
                    className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Record
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Order Confirmation Modal */}
      <CancelOrderModal
        isOpen={!!cancellingOrder}
        onClose={() => setCancellingOrder(null)}
        order={cancellingOrder}
        onSuccess={(updatedOrder) => {
          if (selectedOrder && (selectedOrder._id === updatedOrder?._id || selectedOrder._id === cancellingOrder?._id)) {
            setSelectedOrder((prev) => ({
              ...prev,
              ...(updatedOrder || {}),
              status: 'cancelled',
            }))
          }
          queryClient.invalidateQueries(['admin-orders'])
          queryClient.invalidateQueries(['admin-dashboard'])
          queryClient.invalidateQueries(['order'])
        }}
      />
    </div>
  )
}
