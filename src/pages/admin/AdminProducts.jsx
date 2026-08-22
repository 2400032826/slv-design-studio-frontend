import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Package, Star, X, Upload, Check, Image as ImageIcon, Sparkles, Filter } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { AdminSidebar } from './AdminDashboard'
import { getImageUrl, getProductImage, getCategoryFallbackImage } from '../../utils/imageUtils'
import { syncAndFetchCategories, resolveCategoryId, STUDIO_CATEGORIES } from '../../utils/categoryHelper'

export default function AdminProducts() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
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
    imageUrl: '',
    existingImages: [],
    isFeatured: false,
    isNewArrival: false,
    isBestseller: false,
    isCustomizable: false,
    files: [],
  })

  // Fetch & Auto-Sync all studio categories with remote database
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await api.get('/categories')
        const cats = res.data?.categories || []
        return await syncAndFetchCategories(cats)
      } catch (err) {
        return await syncAndFetchCategories([])
      }
    },
    staleTime: 60000,
  })

  const categories = categoriesData && categoriesData.length > 0
    ? categoriesData
    : STUDIO_CATEGORIES.map((c) => ({ _id: `cat_${c.name.toLowerCase().replace(/\s+/g, '_')}`, name: c.name, description: c.description }))

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
      category: categories[0]?._id || categories[0]?.name || '',
      price: '',
      mrp: '',
      offerPrice: '',
      stock: '10',
      description: '',
      material: '',
      embroideryType: '',
      imageUrl: '',
      existingImages: [],
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
    const productCat = product.category?._id || product.category?.id || (typeof product.category === 'string' ? product.category : '') || categories[0]?._id || ''
    const currentImgUrl = (typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url) || product.image || product.imageUrl || ''
    setFormData({
      name: product.name || '',
      category: productCat,
      price: product.price || '',
      mrp: product.mrp || '',
      offerPrice: product.offerPrice || '',
      stock: product.stock !== undefined ? product.stock.toString() : '10',
      description: product.description || '',
      material: product.material || '',
      embroideryType: product.embroideryType || '',
      imageUrl: currentImgUrl,
      existingImages: product.images || [],
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
    if (!formData.category) return toast.error('Please select a category')

    setSubmitting(true)
    try {
      // Resolve category to permanent MongoDB ObjectId
      const resolvedCatId = await resolveCategoryId(formData.category, categories)

      const dataPayload = new FormData()
      dataPayload.append('name', formData.name.trim())
      if (resolvedCatId) dataPayload.append('category', resolvedCatId)
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
      } else if (formData.imageUrl && formData.imageUrl.trim()) {
        dataPayload.append('imageUrl', formData.imageUrl.trim())
      } else if (editingProduct && formData.existingImages && formData.existingImages.length > 0) {
        dataPayload.append('images', JSON.stringify(formData.existingImages))
      } else {
        const autoFallback = getCategoryFallbackImage(formData.category || formData.name)
        dataPayload.append('imageUrl', autoFallback)
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
      queryClient.invalidateQueries(['categories'])
      setShowForm(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  const rawProducts = data?.products || []
  const products = rawProducts.filter((product) => {
    if (categoryFilter === 'all') return true
    const productCatId = product.category?._id || product.category?.id || (typeof product.category === 'string' ? product.category : '')
    const productCatName = product.category?.name || (typeof product.category === 'string' ? product.category : '')
    return (
      productCatId === categoryFilter ||
      productCatName.toLowerCase() === categoryFilter.toLowerCase()
    )
  })

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
          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalog by title, material..."
                className="input-field pl-10 py-2.5 w-full text-xs shadow-soft"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field py-2.5 text-xs font-semibold w-auto cursor-pointer shadow-soft"
              >
                <option value="all">All Categories ({categories.length})</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.name} value={cat._id || cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
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
                        <p className="text-xs text-[#94A3B8] mt-0.5">
                          {categoryFilter !== 'all' ? 'No products in this category' : 'Click "Add Design / Product" above to create one'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="hover:bg-[#F5F7FA]/60 dark:hover:bg-charcoal-800/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F7FA] dark:bg-gray-800 flex-shrink-0 border border-[#E5E7EB]">
                              <img
                                src={getProductImage(product, 0)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = getCategoryFallbackImage(product);
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-bold text-xs sm:text-sm text-[#1F2937] dark:text-white line-clamp-1">{product.name}</p>
                              <span className="inline-block mt-0.5 text-[10px] font-semibold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded-full border border-pink-200 dark:border-pink-900/40">
                                {product.category?.name || (typeof product.category === 'string' ? product.category : 'Bespoke Atelier')}
                              </span>
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="p-2 rounded-xl text-[#64748B] hover:text-pink-600 hover:bg-[#FFF5F9] dark:hover:bg-charcoal-700 transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                  deleteMutation.mutate(product._id)
                                }
                              }}
                              className="p-2 rounded-xl text-[#64748B] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              title="Delete product"
                            >
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field text-xs font-medium cursor-pointer"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id || cat.name} value={cat._id || cat.name}>
                          {cat.name}
                        </option>
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

                  {/* Image Files & Direct URL */}
                  <div className="sm:col-span-2 space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-300">Design Photos & Images</label>
                    <div className="border-2 border-dashed border-[#E5E7EB] hover:border-pink-500 rounded-2xl p-5 text-center transition-colors cursor-pointer bg-[#F5F7FA]">
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

                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] dark:text-gray-400 mb-1">Or Direct Web Image URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="input-field text-xs"
                        placeholder="https://... Cloudinary or Web URL"
                      />
                    </div>

                    {/* Previews */}
                    {(formData.files?.length > 0 || formData.imageUrl || (formData.existingImages?.length > 0)) && (
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {formData.files && formData.files.length > 0 && Array.from(formData.files).map((file, idx) => (
                          <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-pink-500 flex-shrink-0">
                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 right-0 bg-pink-600 text-white text-[8px] px-1 font-bold">New</span>
                          </div>
                        ))}
                        {formData.imageUrl && (!formData.files || formData.files.length === 0) && (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-pink-500 flex-shrink-0">
                            <img src={formData.imageUrl} alt="url preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                            <span className="absolute bottom-0 right-0 bg-fuchsia-600 text-white text-[8px] px-1 font-bold">URL</span>
                          </div>
                        )}
                        {(!formData.files || formData.files.length === 0) && !formData.imageUrl && formData.existingImages?.map((img, idx) => (
                          <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                            <img src={getImageUrl(img)} alt="saved" className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 right-0 bg-gray-700 text-white text-[8px] px-1 font-bold">Saved</span>
                          </div>
                        ))}
                      </div>
                    )}
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
