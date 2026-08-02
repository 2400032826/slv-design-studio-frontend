import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Tag, Edit2, Check, X, ToggleLeft, ToggleRight, Calendar, Percent } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'

export default function AdminOffers() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editingCoupon, setEditingCoupon] = useState(null)

  const defaultForm = {
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '0',
    usageLimit: '',
    expiresAt: '',
  }

  const [form, setForm] = useState(defaultForm)
  const queryClient = useQueryClient()

  const adminHeaders = { headers: { Authorization: `Bearer ${localStorage.getItem('slv_admin_token')}` } }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => api.get('/coupons', adminHeaders).then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (couponData) => api.post('/coupons', couponData, adminHeaders),
    onSuccess: () => {
      toast.success('Coupon created successfully! 🎉')
      queryClient.invalidateQueries(['admin-coupons'])
      setForm(defaultForm)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create coupon'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/coupons/${id}`, data, adminHeaders),
    onSuccess: () => {
      toast.success('Coupon updated successfully!')
      queryClient.invalidateQueries(['admin-coupons'])
      setEditingCoupon(null)
      setForm(defaultForm)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update coupon'),
  })

  const toggleMutation = useMutation({
    mutationFn: (id) => api.patch(`/coupons/${id}/toggle`, {}, adminHeaders),
    onSuccess: () => {
      toast.success('Coupon status updated!')
      queryClient.invalidateQueries(['admin-coupons'])
    },
    onError: () => toast.error('Failed to toggle coupon status'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/coupons/${id}`, adminHeaders),
    onSuccess: () => {
      toast.success('Coupon deleted successfully')
      queryClient.invalidateQueries(['admin-coupons'])
    },
    onError: () => toast.error('Failed to delete coupon'),
  })

  const coupons = data?.coupons || []

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.code.trim()) return toast.error('Coupon code is required')
    if (!form.value) return toast.error('Discount value is required')

    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount || 0),
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      expiresAt: form.expiresAt || undefined,
    }

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon._id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon)
    setForm({
      code: coupon.code,
      type: coupon.type || 'percentage',
      value: coupon.value || '',
      minOrderAmount: coupon.minOrderAmount || '0',
      usageLimit: coupon.usageLimit || '',
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
    })
  }

  const handleCancelEdit = () => {
    setEditingCoupon(null)
    setForm(defaultForm)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">Offers & Coupon Management</h1>
          <span className="text-xs text-gray-400">{coupons.length} coupons configured</span>
        </div>

        <div className="p-6 space-y-6">
          {/* Create / Edit Coupon Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-gold-500" /> {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="input-field py-2 text-sm font-mono font-bold"
                    placeholder="e.g. SLV20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="input-field py-2 text-sm"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="input-field py-2 text-sm"
                    placeholder={form.type === 'percentage' ? '20%' : '200'}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    className="input-field py-2 text-sm"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    className="input-field py-2 text-sm"
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="input-field py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="btn-primary py-2.5 px-6 text-sm"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>

                {editingCoupon && (
                  <button type="button" onClick={handleCancelEdit} className="btn-ghost py-2.5 px-4 text-sm">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Coupons Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Discount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Min Order</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Usage</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Expires</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {isLoading ? (
                    Array(5).fill(null).map((_, i) => (
                      <tr key={i}>
                        {Array(7).fill(null).map((_, j) => (
                          <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-full" /></td>
                        ))}
                      </tr>
                    ))
                  ) : coupons.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400">
                        <Tag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        No coupons created yet
                      </td>
                    </tr>
                  ) : (
                    coupons.map((coupon) => {
                      const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date()
                      return (
                        <tr key={coupon._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono font-bold text-gold-600 dark:text-gold-400 text-sm bg-gold-50 dark:bg-gold-900/20 px-2.5 py-1 rounded-lg border border-gold-300">
                              {coupon.code}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-green-600 dark:text-green-400 text-sm">
                            {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">₹{coupon.minOrderAmount || 0}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {coupon.usedCount || 0} / {coupon.usageLimit || '∞'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">
                            {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleMutation.mutate(coupon._id)}
                              className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1 transition-colors ${
                                isExpired
                                  ? 'bg-red-100 text-red-600 border-red-200'
                                  : coupon.isActive
                                  ? 'bg-green-100 text-green-700 border-green-300'
                                  : 'bg-gray-100 text-gray-500 border-gray-300'
                              }`}
                            >
                              {coupon.isActive ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                              {isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Disabled'}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditClick(coupon)}
                                className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors"
                                title="Edit Coupon"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { if (window.confirm(`Delete coupon ${coupon.code}?`)) deleteMutation.mutate(coupon._id) }}
                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                                title="Delete Coupon"
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
        </div>
      </div>
    </div>
  )
}
