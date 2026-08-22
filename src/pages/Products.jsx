import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Grid3X3, List, ChevronDown, X, SlidersHorizontal, Sparkles } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/products/ProductCard'
import { PageLoader, CatalogGridSkeleton } from '../components/common/LoadingSpinner'
import { STUDIO_CATEGORIES } from '../utils/categoryHelper'

const sortOptions = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Best Rating', value: '-rating' },
  { label: 'Most Popular', value: '-soldCount' },
]

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2500', min: 1000, max: 2500 },
  { label: '₹2500 - ₹5000', min: 2500, max: 5000 },
  { label: 'Above ₹5000', min: 5000, max: 99999 },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    featured: searchParams.get('featured') || '',
    inStock: '',
  })

  const queryString = Object.entries({ ...filters, sort, page, limit: 12 })
    .filter(([, v]) => v !== '')
    .map(([k, v]) => `${k}=${v}`)
    .join('&')

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', queryString],
    queryFn: () => api.get(`/products?${queryString}`).then((r) => r.data),
    keepPreviousData: true,
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await api.get('/categories')
        const serverCats = res.data?.categories || []
        const names = new Set(serverCats.map((c) => (c?.name || '').toLowerCase()))
        const combined = [...serverCats]
        for (const std of STUDIO_CATEGORIES) {
          if (!names.has(std.name.toLowerCase())) {
            combined.push({ _id: `cat_${std.name.toLowerCase().replace(/\s+/g, '_')}`, name: std.name, description: std.description })
            names.add(std.name.toLowerCase())
          }
        }
        return combined
      } catch (e) {
        return STUDIO_CATEGORIES.map((std) => ({ _id: `cat_${std.name.toLowerCase().replace(/\s+/g, '_')}`, name: std.name }))
      }
    },
    staleTime: 60000,
  })

  const categories = categoriesData && categoriesData.length > 0
    ? categoriesData
    : STUDIO_CATEGORIES.map((std) => ({ _id: `cat_${std.name.toLowerCase().replace(/\s+/g, '_')}`, name: std.name }))

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', rating: '', featured: '', inStock: '' })
    setPage(1)
  }

  const totalPages = data?.totalPages || 1
  const products = data?.products || []

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      {/* Header */}
      <div className="bg-[#F5F7FA] dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 py-12">
        <div className="section-container text-center">
          <span className="section-subtitle">Atelier Catalog</span>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="section-title text-[#1F2937] dark:text-white">
            Designer <span className="text-gradient-pink">Collection</span>
          </motion.h1>
          <div className="h-0.5 w-16 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto my-3 rounded-full" />
          <p className="text-[#64748B] dark:text-charcoal-300 text-sm max-w-md mx-auto">
            Explore {data?.total || products.length || 0} handcrafted bridal blouses, sarees, custom embroidery outfits, and luxury fabrics.
          </p>
        </div>
      </div>

      <div className="section-container py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-charcoal-700 rounded-xl text-xs font-bold text-[#1F2937] dark:text-white hover:border-pink-300 shadow-soft transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-pink-500" /> Filters
            {Object.values(filters).some(Boolean) && (
              <span className="w-2 h-2 bg-pink-500 rounded-full" />
            )}
          </button>

          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field py-2 text-xs font-semibold w-auto cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search bar tag */}
        {filters.search && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-[#64748B]">Searching for:</span>
            <span className="badge badge-soft text-xs">{filters.search}</span>
            <button onClick={() => updateFilter('search', '')} className="text-[#64748B] hover:text-rose-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-5 border border-[#E5E7EB] dark:border-charcoal-800 shadow-card space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-charcoal-700">
                    <h3 className="font-display font-bold text-sm text-[#1F2937] dark:text-white">Filters</h3>
                    <button onClick={clearFilters} className="text-xs text-pink-600 font-bold hover:underline">Clear All</button>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-200 mb-3">Category</h4>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value=""
                          checked={!filters.category}
                          onChange={() => updateFilter('category', '')}
                          className="accent-pink-600"
                        />
                        <span className={`text-xs font-medium transition-colors ${!filters.category ? 'text-pink-600 font-bold' : 'text-[#64748B] dark:text-charcoal-300 group-hover:text-pink-600'}`}>
                          All Categories
                        </span>
                      </label>
                      {(categories || []).map((cat) => (
                        <label key={cat._id || cat.name} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="category"
                            value={cat._id || cat.name}
                            checked={filters.category === cat._id || filters.category === cat.name}
                            onChange={(e) => updateFilter('category', e.target.value)}
                            className="accent-pink-600"
                          />
                          <span className={`text-xs font-medium transition-colors ${filters.category === cat._id || filters.category === cat.name ? 'text-pink-600 font-bold' : 'text-[#64748B] dark:text-charcoal-300 group-hover:text-pink-600'}`}>
                            {cat.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-200 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="price"
                            checked={filters.minPrice === String(range.min) && filters.maxPrice === String(range.max)}
                            onChange={() => { updateFilter('minPrice', String(range.min)); updateFilter('maxPrice', String(range.max)) }}
                            className="accent-pink-600"
                          />
                          <span className="text-xs font-medium text-[#64748B] dark:text-charcoal-300 group-hover:text-pink-600 transition-colors">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-200 mb-3">Min Rating</h4>
                    {[4, 3, 2].map((r) => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer mb-2 group">
                        <input type="radio" name="rating" value={r} checked={filters.rating === String(r)} onChange={(e) => updateFilter('rating', e.target.value)} className="accent-pink-600" />
                        <span className="text-xs font-medium text-[#64748B] dark:text-charcoal-300 group-hover:text-pink-600 transition-colors">{r}+ Stars</span>
                      </label>
                    ))}
                  </div>

                  {/* Stock */}
                  <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-[#E5E7EB]">
                    <input type="checkbox" checked={filters.inStock === 'true'} onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')} className="accent-pink-600" />
                    <span className="text-xs font-medium text-[#1F2937] dark:text-white">In Stock Only</span>
                  </label>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <CatalogGridSkeleton count={12} />
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-[#F5F7FA] dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800">
                <p className="text-4xl mb-3">👗</p>
                <h3 className="text-lg font-display font-bold text-[#1F2937] dark:text-white">No products found</h3>
                <p className="text-[#64748B] text-xs mt-1">Try resetting or adjusting your filter criteria</p>
                <button onClick={clearFilters} className="btn-primary mt-4 text-xs py-2.5">Clear All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product, i) => (
                  <motion.div key={product._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <ProductCard product={product} priority={i < 4} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                      p === page
                        ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-soft'
                        : 'bg-white dark:bg-[#1F2937] text-[#64748B] dark:text-charcoal-300 border border-[#E5E7EB] hover:border-pink-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
