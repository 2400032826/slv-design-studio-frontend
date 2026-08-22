import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Tag, Edit2, Check, X, ToggleLeft, ToggleRight, Calendar, Percent, Sparkles, Menu } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'

export default function AdminOffers() {
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false)
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
            <h1 className="font-display text-base sm:text-xl font-bold text-[#1F2937] dark:text-white truncate">Coupons & Offers</h1>
          </div>
          <span className="badge badge-soft text-xs font-bold">{coupons.length} Active Codes</span>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl">
          {/* Create / Edit Coupon Form */}
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
            <h2 className="font-display text-base font-bold text-[#1F2937] dark:text-white mb-5 flex items-center gap-2">
              <Tag className="w-4 h-4 text-pink-500" /> {editingCoupon ? 'Edit Discount Voucher' : 'Issue New Studio Promo Code'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="input-field py-2 text-xs font-mono font-bold text-pink-600 uppercase"
                    placeholder="e.g. SLVFEST20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="input-field py-2 text-xs"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Fixed Amount (₹ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="input-field py-2 text-xs"
                    placeholder={form.type === 'percentage' ? '20' : '200'}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    className="input-field py-2 text-xs"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Redeem Limit</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    className="input-field py-2 text-xs"
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="input-field py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="btn-primary py-2.5 px-6 text-xs font-bold shadow-soft"
                >
                  {editingCoupon ? 'Update Promo Code' : 'Create Promo Code'}
                </button>

                {editingCoupon && (
                  <button type="button" onClick={handleCancelEdit} className="btn-secondary py-2.5 px-4 text-xs font-bold">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Coupons Table */}
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl border border-[#E5E7EB] dark:border-charcoal-800 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F7FA] dark:bg-charcoal-800 border-b border-[#E5E7EB]">
                  <tr>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Coupon Code</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Discount</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Min Booking</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Usage count</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Valid Till</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-charcoal-700">
                  {isLoading ? (
                    Array(5).fill(null).map((_, i) => (
                      <tr key={i}>
                        {Array(7).fill(null).map((_, j) => (
                          <td key={j} className="px-5 py-4"><div className="skeleton h-4 w-full rounded-lg" /></td>
                        ))}
                      </tr>
                    ))
                  ) : coupons.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-[#94A3B8]">
                        <Tag className="w-12 h-12 mx-auto mb-2 opacity-30 text-pink-400" />
                        <p className="text-sm font-semibold text-[#64748B]">No promo codes created yet</p>
                      </td>
                    </tr>
                  ) : (
                    coupons.map((coupon) => {
                      const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date()
                      return (
                        <tr key={coupon._id} className="hover:bg-[#F5F7FA]/60 dark:hover:bg-charcoal-800/40 transition-colors">
                          <td className="px-5 py-4">
                            <span className="font-mono font-bold text-pink-600 dark:text-pink-400 text-xs bg-[#FFF5F9] dark:bg-pink-950/30 px-2.5 py-1 rounded-lg border border-pink-200">
                              {coupon.code}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                            {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                          </td>
                          <td className="px-5 py-4 text-xs font-semibold text-[#1F2937] dark:text-gray-300">₹{coupon.minOrderAmount || 0}</td>
                          <td className="px-5 py-4 text-xs text-[#64748B]">
                            {coupon.usedCount || 0} / {coupon.usageLimit || '∞'}
                          </td>
                          <td className="px-5 py-4 text-xs text-[#64748B]">
                            {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never expires'}
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => toggleMutation.mutate(coupon._id)}
                              className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border flex items-center gap-1 transition-colors ${
                                isExpired
                                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                                  : coupon.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-gray-100 text-gray-500 border-gray-200'
                              }`}
                            >
                              {coupon.isActive ? <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> : <ToggleLeft className="w-3.5 h-3.5 text-gray-400" />}
                              {isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Disabled'}
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditClick(coupon)}
                                className="p-2 rounded-xl bg-[#F5F7FA] hover:bg-pink-50 text-pink-600 border border-[#E5E7EB] transition-colors"
                                title="Edit Coupon"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => { if (window.confirm(`Delete coupon ${coupon.code}?`)) deleteMutation.mutate(coupon._id) }}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
                                title="Delete Coupon"
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
        </div>
      </div>
    </div>
  )
}
