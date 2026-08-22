import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, Check, X, MessageSquare, Sparkles, Menu } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'

export default function AdminReviews() {
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false)
  const queryClient = useQueryClient()

  const adminHeaders = { headers: { Authorization: `Bearer ${localStorage.getItem('slv_admin_token')}` } }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => api.get('/admin/reviews', adminHeaders).then((r) => r.data),
  })

  const approveMutation = useMutation({
    mutationFn: (id) => api.put(`/reviews/${id}/approve`, {}, adminHeaders),
    onSuccess: () => { toast.success('Review approved'); queryClient.invalidateQueries(['admin-reviews']) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/reviews/${id}`, adminHeaders),
    onSuccess: () => { toast.success('Review deleted'); queryClient.invalidateQueries(['admin-reviews']) },
  })

  const reviews = data?.reviews || []

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
            <h1 className="font-display text-base sm:text-xl font-bold text-[#1F2937] dark:text-white truncate">Client Reviews & Testimonials</h1>
          </div>
          <span className="badge badge-soft text-xs font-bold">{reviews.length} Total Feedback</span>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-4 max-w-5xl">
          {reviews.length === 0 && !isLoading ? (
            <div className="text-center py-20 bg-white dark:bg-[#1F2937] rounded-3xl border border-[#E5E7EB]">
              <MessageSquare className="w-12 h-12 text-pink-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#64748B]">No customer reviews yet</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 border border-[#E5E7EB] dark:border-charcoal-800 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-soft flex-shrink-0">
                      {review.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-[#1F2937] dark:text-white">{review.user?.name}</p>
                      <p className="text-[11px] text-[#64748B]">{review.user?.email}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-pink-500 text-pink-500' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${review.isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {review.isApproved ? 'Approved' : 'Pending Review'}
                    </span>
                    {!review.isApproved && (
                      <button onClick={() => approveMutation.mutate(review._id)}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors" title="Approve">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => { if (window.confirm('Delete this review?')) deleteMutation.mutate(review._id) }}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors" title="Delete">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="mt-3.5 text-xs sm:text-sm text-[#1F2937] dark:text-gray-300 leading-relaxed bg-[#F5F7FA] dark:bg-charcoal-800 p-3.5 rounded-2xl border border-[#E5E7EB]">{review.comment}</p>
                {review.product?.name && (
                  <p className="mt-2.5 text-[11px] text-[#64748B]">Product: <span className="font-bold text-pink-600 dark:text-pink-400">{review.product.name}</span></p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
