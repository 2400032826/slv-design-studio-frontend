import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye, Phone, MessageCircle, Printer, Trash2, X, FileText, Download } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'
import { getImageUrl } from '../../utils/imageUtils'

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
  'Pending Confirmation': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  order_received: 'bg-blue-100 text-blue-700 border-blue-300',
  accepted: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  in_production: 'bg-purple-100 text-purple-700 border-purple-300',
  embroidery_started: 'bg-pink-100 text-pink-700 border-pink-300',
  printing_started: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  stitching_started: 'bg-teal-100 text-teal-700 border-teal-300',
  quality_check: 'bg-amber-100 text-amber-800 border-amber-300',
  packed: 'bg-orange-100 text-orange-700 border-orange-300',
  shipped: 'bg-blue-200 text-blue-800 border-blue-400',
  delivered: 'bg-green-100 text-green-700 border-green-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
}

export default function AdminOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const queryClient = useQueryClient()

  const adminHeaders = { headers: { Authorization: `Bearer ${localStorage.getItem('slv_admin_token')}` } }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', search, statusFilter, page],
    queryFn: () => api.get(`/orders?search=${search}&status=${statusFilter}&page=${page}&limit=50`, adminHeaders).then((r) => r.data),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/orders/${id}/status`, { status }, adminHeaders),
    onSuccess: () => {
      toast.success('Order status updated!')
      queryClient.invalidateQueries(['admin-orders'])
      if (selectedOrder) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: prev._newStatus || prev.status } : null))
      }
    },
    onError: () => toast.error('Failed to update order status'),
  })

  const deleteOrderMutation = useMutation({
    mutationFn: (id) => api.delete(`/orders/${id}`, adminHeaders),
    onSuccess: () => {
      toast.success('Order deleted successfully')
      queryClient.invalidateQueries(['admin-orders'])
      setSelectedOrder(null)
    },
    onError: () => toast.error('Failed to delete order'),
  })

  const orders = data?.orders || []
  const totalPages = data?.totalPages || 1

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">Booking & Orders Management</h1>
          <span className="text-xs text-gray-400 font-medium">{data?.total || 0} total bookings</span>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order # or customer name..."
                className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm w-72 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm mb-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Est.</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking Date</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {isLoading ? (
                    Array(8).fill(null).map((_, i) => (
                      <tr key={i}>
                        {Array(6).fill(null).map((_, j) => (
                          <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-full" /></td>
                        ))}
                      </tr>
                    ))
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">No booking orders found</td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const custPhone = order.shippingAddress?.phone || order.user?.phone || ''
                      const cleanPhone = custPhone.replace(/[^0-9]/g, '')
                      return (
                        <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-mono text-sm font-bold text-gray-900 dark:text-white">#{order.orderNumber}</p>
                            <p className="text-xs text-gray-400">{order.items?.length} item(s)</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{order.shippingAddress?.fullName || order.user?.name || 'Customer'}</p>
                            <p className="text-xs text-gray-400">{order.shippingAddress?.phone || order.user?.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-gold-500">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`text-xs px-2.5 py-1.5 rounded-full border font-semibold cursor-pointer focus:outline-none ${statusColors[order.status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}
                            >
                              {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {/* View Details */}
                              <button onClick={() => setSelectedOrder(order)}
                                className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors" title="View Booking Details">
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Call Customer */}
                              {custPhone && (
                                <a href={`tel:${custPhone}`} className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500 transition-colors" title="Call Customer">
                                  <Phone className="w-4 h-4" />
                                </a>
                              )}

                              {/* WhatsApp Chat */}
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 transition-colors"
                                  title="WhatsApp Chat"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                              )}

                              {/* Delete Order */}
                              <button
                                onClick={() => { if (window.confirm(`Delete booking order #${order.orderNumber}?`)) deleteOrderMutation.mutate(order._id) }}
                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                    p === page ? 'bg-gradient-royal text-white' : 'bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100'
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 mb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">Booking #{selectedOrder.orderNumber}</h3>
                  <p className="text-xs text-gray-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => window.print()} className="btn-ghost p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white" title="Print Invoice / Order">
                    <Printer className="w-5 h-5" />
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Customer & Quick Action Bar */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-5 flex flex-wrap items-center justify-between gap-3 border border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Customer</p>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}</p>
                  <p className="text-xs text-gray-500">{selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone || 'No phone'} | {selectedOrder.user?.email}</p>
                </div>
                <div className="flex gap-2">
                  {(selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone) && (
                    <>
                      <a
                        href={`tel:${selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone}`}
                        className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a
                        href={`https://wa.me/91${(selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone).replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 text-xs rounded-full flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" /> WhatsApp
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Booked Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, i) => {
                    const itemImg = getImageUrl(item.image || item.product?.images?.[0])
                    return (
                      <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                          {itemImg ? (
                            <img src={itemImg} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center text-sm">👗</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.name || item.product?.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''} {item.color ? `| Color: ${item.color}` : ''}</p>
                          {/* Customization Details */}
                          {item.customization && Object.keys(item.customization).length > 0 && (
                            <div className="mt-2 text-xs bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg border border-purple-100 dark:border-purple-900/30 text-purple-800 dark:text-purple-300 space-y-1">
                              <p className="font-semibold text-purple-900 dark:text-purple-200">Customization Details:</p>
                              {item.customization.fabricType && <p>• Fabric: {item.customization.fabricType}</p>}
                              {item.customization.embroideryType && <p>• Embroidery: {item.customization.embroideryType}</p>}
                              {item.customization.specialInstructions && <p>• Notes: {item.customization.specialInstructions}</p>}
                              {item.customization.referenceImages?.length > 0 && (
                                <div className="flex gap-1.5 pt-1">
                                  {item.customization.referenceImages.map((refImg, rIdx) => (
                                    <a key={rIdx} href={getImageUrl(refImg)} target="_blank" rel="noreferrer" className="w-8 h-8 rounded overflow-hidden border border-purple-300">
                                      <img src={getImageUrl(refImg)} alt="design" className="w-full h-full object-cover" />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="font-bold text-sm text-gold-500">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Delivery Address</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  {selectedOrder.shippingAddress?.fullName}<br />
                  {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}<br />
                  Phone: {selectedOrder.shippingAddress?.phone}
                </p>
              </div>

              {/* Order Status Action */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-xs text-gray-400 block">Order Status</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className={`text-sm px-3 py-1.5 rounded-xl border font-bold ${statusColors[selectedOrder.status] || 'bg-gray-100'}`}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => { if (window.confirm('Delete this order?')) deleteOrderMutation.mutate(selectedOrder._id) }}
                  className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Delete Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
