import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Upload, Image, X, Sparkles, Tag, Edit2, Check, Menu } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'
import { getImageUrl } from '../../utils/imageUtils'
import {
  getUnifiedGalleryItems,
  addGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
} from '../../utils/galleryService'

const CATEGORIES = ['all', 'embroidery', 'printing', 'stitching', 'wedding', 'bridal', 'jewellery', 'other']

export default function AdminGallery() {
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'embroidery', files: null })
  const [editingItem, setEditingItem] = useState(null)
  const [editCategory, setEditCategory] = useState('')
  const [editTitle, setEditTitle] = useState('')

  const queryClient = useQueryClient()

  // Query unified gallery data
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-gallery', activeCategory],
    queryFn: () => getUnifiedGalleryItems(activeCategory),
    staleTime: 1 * 60 * 1000,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteGalleryItem(id),
    onSuccess: () => {
      toast.success('Gallery item deleted from portfolio & public gallery! 🗑️')
      queryClient.invalidateQueries(['admin-gallery'])
      queryClient.invalidateQueries(['gallery'])
    },
    onError: (err) => toast.error('Failed to delete item: ' + err.message),
  })

  // Update category / title mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateGalleryItem(id, updates),
    onSuccess: () => {
      toast.success('Gallery category updated successfully! ✨')
      setEditingItem(null)
      queryClient.invalidateQueries(['admin-gallery'])
      queryClient.invalidateQueries(['gallery'])
    },
    onError: (err) => toast.error('Failed to update: ' + err.message),
  })

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!form.files || form.files.length === 0) return toast.error('Please select at least one image')
    setUploading(true)
    try {
      const fileList = Array.from(form.files)
      for (const file of fileList) {
        await addGalleryItem({
          title: form.title.trim() || 'Atelier Masterwork',
          category: form.category,
          file,
        })
      }
      toast.success(`Successfully added ${fileList.length} item(s) to lookbook & public gallery! 🎉`)
      setForm({ title: '', category: 'embroidery', files: null })
      queryClient.invalidateQueries(['admin-gallery'])
      queryClient.invalidateQueries(['gallery'])
    } catch (err) {
      toast.error('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const startEdit = (item) => {
    setEditingItem(item._id)
    setEditCategory(item.category || 'embroidery')
    setEditTitle(item.title || '')
  }

  const saveEdit = (id) => {
    updateMutation.mutate({
      id,
      updates: { category: editCategory, title: editTitle },
    })
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]/50 dark:bg-[#111827] flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 min-w-0 transition-all duration-300 ml-0 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="sticky top-0 z-30 bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#F5F7FA] rounded-xl border border-[#E5E7EB] text-[#64748B] transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-base sm:text-xl font-bold text-[#1F2937] dark:text-white">Portfolio Lookbook</h1>
              <p className="text-[11px] text-[#64748B] mt-0.5 hidden sm:block">Manage the live portfolio displayed on the public Customer Gallery</p>
            </div>
          </div>
          <span className="badge badge-soft text-xs font-bold">{items.length} Items</span>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl">
          {/* Upload Form */}
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card">
            <h2 className="font-display text-base font-bold text-[#1F2937] dark:text-white mb-5 flex items-center gap-2">
              <Upload className="w-4 h-4 text-pink-500" /> Upload New Portfolio Media
            </h2>
            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Title (optional)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field text-xs"
                  placeholder="e.g. Royal Bridal Embroidery"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-field text-xs capitalize"
                >
                  {CATEGORIES.filter((c) => c !== 'all').map((c) => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Select File(s)</label>
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#E5E7EB] hover:border-pink-500 rounded-xl cursor-pointer transition-colors text-xs font-bold text-[#1F2937] bg-[#F5F7FA]">
                    <Image className="w-4 h-4 text-pink-500" />
                    <span className="truncate">{form.files && form.files.length > 0 ? `${form.files.length} file(s)` : 'Choose Files'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => setForm({ ...form, files: e.target.files })}
                    />
                  </label>
                  <button type="submit" disabled={uploading} className="btn-primary px-6 py-2.5 text-xs font-bold flex-shrink-0 shadow-soft">
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Upload Media'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#64748B] mr-2">Filter View:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all ${
                  activeCategory === cat
                    ? 'btn-primary text-white shadow-soft'
                    : 'bg-white dark:bg-[#1F2937] text-[#64748B] border border-[#E5E7EB] hover:border-pink-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isLoading ? (
              Array(12).fill(null).map((_, i) => <div key={i} className="skeleton aspect-square rounded-2xl" />)
            ) : items.map((item) => {
              const imgUrl = getImageUrl(item.url || item)
              const isEditing = editingItem === item._id

              return (
                <div key={item._id} className="relative group aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-charcoal-700 shadow-soft flex flex-col justify-between">
                  {imgUrl ? (
                    <img src={imgUrl} alt={item.title || 'Gallery'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-[#FFF5F9] flex items-center justify-center">
                      <Image className="w-6 h-6 text-pink-300" />
                    </div>
                  )}

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 bg-white/90 hover:bg-white text-[#1F2937] rounded-lg shadow transition-colors"
                        title="Edit category or title"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-pink-600" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${item.title || 'this item'}" from both Admin and Customer Gallery?`)) {
                            deleteMutation.mutate(item._id)
                          }
                        }}
                        className="p-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-white transition-colors shadow"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-left text-white">
                      <p className="text-xs font-bold truncate">{item.title}</p>
                      <p className="text-[10px] text-pink-300 uppercase tracking-widest">{item.category}</p>
                    </div>
                  </div>

                  {/* Category Pill */}
                  {item.category && (
                    <div className="absolute bottom-2 left-2 text-[9px] uppercase font-bold tracking-wider bg-white/90 text-[#1F2937] border border-[#E5E7EB] px-2 py-0.5 rounded-full shadow-soft backdrop-blur-sm pointer-events-none">
                      {item.category}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {items.length === 0 && !isLoading && (
            <div className="text-center py-16 bg-white dark:bg-[#1F2937] rounded-3xl border border-[#E5E7EB] dark:border-charcoal-700">
              <Image className="w-12 h-12 mx-auto mb-3 opacity-30 text-pink-400" />
              <p className="text-sm font-semibold text-[#64748B]">No gallery items in "{activeCategory}" category</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">Upload new images above to populate this section</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="font-display font-bold text-base text-[#1F2937] dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-pink-500" /> Edit Portfolio Item
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-xs text-[#64748B] hover:text-black font-bold">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] mb-1">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] mb-1">Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="input-field text-xs capitalize"
              >
                {CATEGORIES.filter((c) => c !== 'all').map((c) => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="btn-secondary text-xs px-4 py-2 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveEdit(editingItem)}
                className="btn-primary text-xs px-5 py-2 font-bold flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

