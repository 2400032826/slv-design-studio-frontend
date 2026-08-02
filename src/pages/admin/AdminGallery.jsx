import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Upload, Image, X } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'
import { getImageUrl } from '../../utils/imageUtils'

const CATEGORIES = ['embroidery', 'printing', 'stitching', 'wedding', 'bridal', 'jewellery', 'other']

export default function AdminGallery() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'embroidery', files: null })
  const queryClient = useQueryClient()

  const adminHeaders = { headers: { Authorization: `Bearer ${localStorage.getItem('slv_admin_token')}` } }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: () => api.get('/gallery?limit=100', adminHeaders).then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/gallery/${id}`, adminHeaders),
    onSuccess: () => {
      toast.success('Gallery item deleted')
      queryClient.invalidateQueries(['admin-gallery'])
      queryClient.invalidateQueries(['gallery'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete item'),
  })

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!form.files || form.files.length === 0) return toast.error('Please select at least one image or video')
    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(form.files).forEach((file) => formData.append('media', file))
      formData.append('category', form.category)
      if (form.title.trim()) formData.append('title', form.title.trim())

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('slv_admin_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data: resData } = await api.post('/gallery', formData, config)
      toast.success(`Successfully uploaded ${resData.items?.length || 1} gallery item(s)! 🎉`)
      setForm({ title: '', category: 'embroidery', files: null })
      queryClient.invalidateQueries(['admin-gallery'])
      queryClient.invalidateQueries(['gallery'])
    } catch (e) {
      toast.error(e.response?.data?.message || 'Upload failed. Check server logs.')
    } finally {
      setUploading(false)
    }
  }

  const items = data?.items || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">Gallery Portfolio Management</h1>
          <span className="text-xs text-gray-400 font-medium">{items.length} total items</span>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-gold-500" /> Upload New Media
            </h2>
            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title (optional)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Royal Bridal Embroidery"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-field capitalize"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Select File(s)</label>
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-gold-500 transition-colors text-sm text-gray-600 dark:text-gray-300">
                    <Image className="w-4 h-4 text-gold-500" />
                    <span className="truncate">{form.files && form.files.length > 0 ? `${form.files.length} file(s)` : 'Choose Files'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => setForm({ ...form, files: e.target.files })}
                    />
                  </label>
                  <button type="submit" disabled={uploading} className="btn-primary px-6 py-3 text-sm flex-shrink-0">
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Upload'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isLoading ? (
              Array(12).fill(null).map((_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)
            ) : items.map((item) => {
              const imgUrl = getImageUrl(item.url || item)
              return (
                <div key={item._id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                  {imgUrl ? (
                    <img src={imgUrl} alt={item.title || 'Gallery'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                      <Image className="w-6 h-6 text-white/40" />
                    </div>
                  )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => { if (window.confirm('Delete this gallery item?')) deleteMutation.mutate(item._id) }}
                    className="p-2 bg-red-500 rounded-xl text-white hover:bg-red-600 transition-colors shadow-lg"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {item.category && (
                  <div className="absolute bottom-1.5 left-1.5 text-[10px] uppercase font-bold tracking-wider bg-black/70 text-gold-400 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {item.category}
                  </div>
                )}
              </div>
            )})}
          </div>

          {items.length === 0 && !isLoading && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <Image className="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-400" />
              <p className="text-gray-500 font-medium">Gallery is empty</p>
              <p className="text-gray-400 text-sm mt-1">Select image or video files above and click Upload!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
