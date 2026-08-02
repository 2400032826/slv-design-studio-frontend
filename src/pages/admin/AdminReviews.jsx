import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, Check, X, MessageSquare } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'

export default function AdminReviews() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">Reviews</h1>
        </div>

        <div className="p-6 space-y-4">
          {reviews.length === 0 && !isLoading ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
              <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-royal rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {review.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{review.user?.name}</p>
                      <p className="text-xs text-gray-400">{review.user?.email}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${review.isApproved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    {!review.isApproved && (
                      <button onClick={() => approveMutation.mutate(review._id)}
                        className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => { if (window.confirm('Delete this review?')) deleteMutation.mutate(review._id) }}
                      className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 ml-13">{review.comment}</p>
                {review.product?.name && (
                  <p className="mt-2 text-xs text-gray-400">Product: <span className="text-gold-500">{review.product.name}</span></p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
