import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Package, Star, X, Upload, Check, Image as ImageIcon, Sparkles } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'
import { getImageUrl } from '../../utils/imageUtils'

export default function AdminProducts() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const adminHeaders = { headers: { Authorization: `Bearer ${localStorage.getItem('slv_admin_token')}` } }

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    mrp: '',
    offerPrice: '',
    stock: '10',
    description: '',
    material: '',
    embroideryType: '',
    isFeatured: false,
    isNewArrival: false,
    isBestseller: false,
    isCustomizable: false,
    files: [],
  })

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data.categories),
  })

  const categories = categoriesData || []

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search],
    queryFn: () => api.get(`/products?search=${search}&limit=100`, adminHeaders).then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`, adminHeaders),
    onSuccess: () => {
      toast.success('Product deleted successfully')
      queryClient.invalidateQueries(['admin-products'])
      queryClient.invalidateQueries(['products'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete product'),
  })

  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      category: categories[0]?._id || '',
      price: '',
      mrp: '',
      offerPrice: '',
      stock: '10',
      description: '',
      material: '',
      embroideryType: '',
      isFeatured: false,
      isNewArrival: false,
      isBestseller: false,
      isCustomizable: false,
      files: [],
    })
    setShowForm(true)
  }

  const handleOpenEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      category: product.category?._id || product.category || categories[0]?._id || '',
      price: product.price || '',
      mrp: product.mrp || '',
      offerPrice: product.offerPrice || '',
      stock: product.stock !== undefined ? product.stock.toString() : '10',
      description: product.description || '',
      material: product.material || '',
      embroideryType: product.embroideryType || '',
      isFeatured: !!product.isFeatured,
      isNewArrival: !!product.isNewArrival,
      isBestseller: !!product.isBestseller,
      isCustomizable: !!product.isCustomizable,
      files: [],
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return toast.error('Product name is required')
    if (!formData.price) return toast.error('Price is required')

    setSubmitting(true)
    try {
      const dataPayload = new FormData()
      dataPayload.append('name', formData.name.trim())
      if (formData.category) dataPayload.append('category', formData.category)
      dataPayload.append('price', formData.price)
      if (formData.mrp) dataPayload.append('mrp', formData.mrp)
      if (formData.offerPrice) dataPayload.append('offerPrice', formData.offerPrice)
      dataPayload.append('stock', formData.stock || '10')
      if (formData.description) dataPayload.append('description', formData.description)
      if (formData.material) dataPayload.append('material', formData.material)
      if (formData.embroideryType) dataPayload.append('embroideryType', formData.embroideryType)
      dataPayload.append('isFeatured', formData.isFeatured)
      dataPayload.append('isNewArrival', formData.isNewArrival)
      dataPayload.append('isBestseller', formData.isBestseller)
      dataPayload.append('isCustomizable', formData.isCustomizable)

      if (formData.files && formData.files.length > 0) {
        Array.from(formData.files).forEach((file) => {
          dataPayload.append('images', file)
        })
      }

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('slv_admin_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, dataPayload, config)
        toast.success('Product updated successfully! 🎉')
      } else {
        await api.post('/products', dataPayload, config)
        toast.success('New product created successfully! 🎉')
      }

      queryClient.invalidateQueries(['admin-products'])
      queryClient.invalidateQueries(['products'])
      setShowForm(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  const products = data?.products || []

  return (
    <div className="min-h-screen bg-[#F5F7FA]/50 dark:bg-[#111827] flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 px-8 py-4 flex items-center justify-between shadow-soft">
          <h1 className="font-display text-xl font-bold text-[#1F2937] dark:text-white">Products Catalog Management</h1>
          <button onClick={handleOpenAddModal} className="btn-primary text-xs py-2.5 px-5 font-bold shadow-soft">
            <Plus className="w-3.5 h-3.5" /> Add Design / Product
          </button>
        </div>

        <div className="p-8 space-y-6 max-w-7xl">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalog by title, material..."
              className="input-field pl-10 py-2.5 w-full max-w-md text-xs shadow-soft"
            />
          </div>

          {/* Products Table */}
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl border border-[#E5E7EB] dark:border-charcoal-800 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F7FA] dark:bg-charcoal-800 border-b border-[#E5E7EB]">
                  <tr>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Product</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Pricing</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Stock</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Reviews</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-charcoal-700">
                  {isLoading ? (
                    Array(5).fill(null).map((_, i) => (
                      <tr key={i}>
                        <td className="px-5 py-4"><div className="skeleton h-4 w-32 rounded-lg" /></td>
                        <td className="px-5 py-4"><div className="skeleton h-4 w-20 rounded-lg" /></td>
                        <td className="px-5 py-4"><div className="skeleton h-4 w-12 rounded-lg" /></td>
                        <td className="px-5 py-4"><div className="skeleton h-4 w-16 rounded-lg" /></td>
                        <td className="px-5 py-4"><div className="skeleton h-4 w-20 rounded-lg" /></td>
                        <td className="px-5 py-4"><div className="skeleton h-4 w-24 rounded-lg" /></td>
                      </tr>
                    ))
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-[#94A3B8]">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-30 text-pink-400" />
                        <p className="text-sm font-semibold text-[#64748B]">No products found</p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">Click "Add Design / Product" above to create one</p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="hover:bg-[#F5F7FA]/60 dark:hover:bg-charcoal-800/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F7FA] dark:bg-gray-800 flex-shrink-0 border border-[#E5E7EB]">
                              {getImageUrl(product.images?.[0]) ? (
                                <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-[#FFF5F9] flex items-center justify-center text-sm text-pink-500">👗</div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-xs sm:text-sm text-[#1F2937] dark:text-white line-clamp-1">{product.name}</p>
                              <p className="text-[11px] text-[#64748B]">{product.category?.name || 'Uncategorized'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs sm:text-sm font-bold text-pink-600 dark:text-pink-400 price-tag">₹{(product.offerPrice || product.price)?.toLocaleString('en-IN')}</p>
                          {product.mrp && <p className="text-[11px] text-[#94A3B8] line-through">₹{product.mrp.toLocaleString('en-IN')}</p>}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold ${product.stock <= 5 ? 'text-rose-500' : product.stock <= 20 ? 'text-amber-500' : 'text-emerald-600'}`}>
                            {product.stock || 0} in stock
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                            <span className="text-xs font-bold text-[#1F2937] dark:text-white">{product.rating?.toFixed(1) || '—'}</span>
                            <span className="text-[10px] text-[#94A3B8]">({product.numReviews || 0})</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                            product.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {product.isFeatured && (
                            <span className="ml-1.5 text-[10px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 font-bold border border-pink-200">Featured</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleOpenEditModal(product)}
                              className="p-2 rounded-xl bg-[#F5F7FA] hover:bg-pink-50 text-pink-600 border border-[#E5E7EB] transition-colors" title="Edit Product">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => { if (window.confirm(`Delete "${product.name}"?`)) deleteMutation.mutate(product._id) }}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors" title="Delete Product">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E5E7EB] dark:border-charcoal-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-charcoal-800 mb-6">
                <div>
                  <span className="badge badge-soft text-[10px] uppercase font-bold tracking-wider mb-1 inline-block">Catalog Editor</span>
                  <h2 className="font-display text-xl font-bold text-[#1F2937] dark:text-white">
                    {editingProduct ? 'Edit Catalog Design' : 'Add New Atelier Design'}
                  </h2>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-[#F5F7FA] text-[#64748B] hover:text-[#1F2937]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Design / Product Title *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field text-xs"
                      placeholder="e.g. Royal Maggam Work Silk Blouse"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field text-xs"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Stock Units</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="input-field text-xs"
                      min="0"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input-field text-xs"
                      placeholder="1499"
                      required
                    />
                  </div>

                  {/* Offer Price */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Special Offer Price (₹)</label>
                    <input
                      type="number"
                      value={formData.offerPrice}
                      onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                      className="input-field text-xs"
                      placeholder="1299 (optional)"
                    />
                  </div>

                  {/* MRP */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">MRP Strikethrough (₹)</label>
                    <input
                      type="number"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      className="input-field text-xs"
                      placeholder="1999 (optional)"
                    />
                  </div>

                  {/* Fabric / Material */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Material / Fabric</label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="input-field text-xs"
                      placeholder="e.g. Raw Silk, Pure Kanjeevaram"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Description & Crafting Details</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field text-xs resize-none"
                      placeholder="Specify embroidery styles, back hook, padding inclusion..."
                    />
                  </div>

                  {/* Image Files */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Design Photos</label>
                    <div className="border-2 border-dashed border-[#E5E7EB] hover:border-pink-500 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-[#F5F7FA]">
                      <label className="cursor-pointer flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 text-pink-400 mb-2" />
                        <span className="text-xs font-bold text-[#1F2937]">
                          {formData.files && formData.files.length > 0
                            ? `${formData.files.length} file(s) selected`
                            : 'Click to upload design photographs'}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] mt-0.5">JPG, PNG, WebP supported</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setFormData({ ...formData, files: e.target.files })}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Flags */}
                  <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    {[
                      { key: 'isFeatured', label: 'Featured' },
                      { key: 'isNewArrival', label: 'New Arrival' },
                      { key: 'isBestseller', label: 'Bestseller' },
                      { key: 'isCustomizable', label: 'Customizable' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] hover:bg-pink-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                          className="accent-pink-500 w-4 h-4"
                        />
                        <span className="text-xs font-bold text-[#1F2937]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 btn-secondary py-3 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 btn-primary py-3 text-xs font-bold shadow-soft"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      <>{editingProduct ? 'Save Changes' : 'Create Product'}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
