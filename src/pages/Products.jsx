import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Grid3X3, List, ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/products/ProductCard'
import { PageLoader } from '../components/common/LoadingSpinner'

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

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data.categories),
    staleTime: Infinity,
  })

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="section-container">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-white">
            Our <span className="text-gradient-gold">Products</span>
          </motion.h1>
          <p className="text-white/60 mt-2">{data?.total || 0} products available</p>
        </div>
      </div>

      <div className="section-container py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:border-gold-400 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {Object.values(filters).some(Boolean) && (
              <span className="w-2 h-2 bg-pink-500 rounded-full" />
            )}
          </button>

          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field py-2 text-sm w-auto"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search bar */}
        {filters.search && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Searching for:</span>
            <span className="badge badge-purple">{filters.search}</span>
            <button onClick={() => updateFilter('search', '')} className="text-gray-400 hover:text-red-500">
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                    <button onClick={clearFilters} className="text-xs text-pink-500 hover:underline">Clear All</button>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h4>
                    <div className="space-y-2">
                      {(categories || []).map((cat) => (
                        <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="category"
                            value={cat._id}
                            checked={filters.category === cat._id}
                            onChange={(e) => updateFilter('category', e.target.value)}
                            className="accent-gold-500"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gold-600">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="price"
                            checked={filters.minPrice === String(range.min) && filters.maxPrice === String(range.max)}
                            onChange={() => { updateFilter('minPrice', String(range.min)); updateFilter('maxPrice', String(range.max)) }}
                            className="accent-gold-500"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gold-600">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Min Rating</h4>
                    {[4, 3, 2].map((r) => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer mb-2">
                        <input type="radio" name="rating" value={r} checked={filters.rating === String(r)} onChange={(e) => updateFilter('rating', e.target.value)} className="accent-gold-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{r}+ Stars</span>
                      </label>
                    ))}
                  </div>

                  {/* Stock */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters.inStock === 'true'} onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')} className="accent-gold-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">In Stock Only</span>
                  </label>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(12).fill(null).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <div className="skeleton aspect-[3/4]" />
                    <div className="p-4 space-y-2"><div className="skeleton h-4 w-3/4" /><div className="skeleton h-4 w-1/2" /></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🛒</p>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No products found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product, i) => (
                  <motion.div key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <ProductCard product={product} />
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
                    className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${
                      p === page ? 'bg-gradient-royal text-white shadow-pink' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gold-50'
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
