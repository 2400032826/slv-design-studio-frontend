import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Package, Star, X, Upload, Check, Image as ImageIcon } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">Products Management</h1>
          <button onClick={handleOpenAddModal} className="btn-primary text-sm py-2.5 px-5">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        <div className="p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name..."
              className="pl-10 pr-4 py-2.5 w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          {/* Products Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {isLoading ? (
                    Array(5).fill(null).map((_, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3"><div className="skeleton h-4 w-32" /></td>
                        <td className="px-4 py-3"><div className="skeleton h-4 w-20" /></td>
                        <td className="px-4 py-3"><div className="skeleton h-4 w-12" /></td>
                        <td className="px-4 py-3"><div className="skeleton h-4 w-16" /></td>
                        <td className="px-4 py-3"><div className="skeleton h-4 w-20" /></td>
                        <td className="px-4 py-3"><div className="skeleton h-4 w-24" /></td>
                      </tr>
                    ))
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">
                        <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        No products found. Click "Add Product" to create one!
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                              {getImageUrl(product.images?.[0]) ? (
                                <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center text-xs text-white">👗</div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                              <p className="text-xs text-gray-400">{product.category?.name || 'Uncategorized'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-gold-500">₹{(product.offerPrice || product.price)?.toLocaleString('en-IN')}</p>
                          {product.mrp && <p className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${product.stock <= 5 ? 'text-red-500' : product.stock <= 20 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {product.stock || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{product.rating?.toFixed(1) || '—'}</span>
                            <span className="text-xs text-gray-400">({product.numReviews || 0})</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {product.isFeatured && (
                            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 font-medium">Featured</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleOpenEditModal(product)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors" title="Edit Product">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => { if (window.confirm(`Delete "${product.name}"?`)) deleteMutation.mutate(product._id) }}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete Product">
                              <Trash2 className="w-4 h-4" />
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 mb-6">
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Designer Embroidered Silk Blouse"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input-field"
                      placeholder="1499"
                      required
                    />
                  </div>

                  {/* Offer Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Price (₹)</label>
                    <input
                      type="number"
                      value={formData.offerPrice}
                      onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                      className="input-field"
                      placeholder="1299 (optional)"
                    />
                  </div>

                  {/* MRP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      className="input-field"
                      placeholder="1999 (optional)"
                    />
                  </div>

                  {/* Fabric / Material */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Material / Fabric</label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Raw Silk, Pure Cotton"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field resize-none"
                      placeholder="Write product specifications and details..."
                    />
                  </div>

                  {/* Image Files */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Images</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center hover:border-gold-500 transition-colors cursor-pointer">
                      <label className="cursor-pointer flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {formData.files && formData.files.length > 0
                            ? `${formData.files.length} file(s) selected`
                            : 'Click to select product images'}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP allowed</span>
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
                  <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {[
                      { key: 'isFeatured', label: 'Featured' },
                      { key: 'isNewArrival', label: 'New Arrival' },
                      { key: 'isBestseller', label: 'Bestseller' },
                      { key: 'isCustomizable', label: 'Customizable' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <input
                          type="checkbox"
                          checked={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                          className="accent-gold-500 w-4 h-4"
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 btn-primary py-3 text-sm"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
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
