import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/products/ProductCard'
import { CatalogGridSkeleton } from '../components/common/LoadingSpinner'
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
  const initialPage = parseInt(searchParams.get('page'), 10) || 1
  const [page, setPage] = useState(initialPage)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    featured: searchParams.get('featured') || '',
    inStock: '',
  })

  // Keep page in sync if URL search params change
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page'), 10) || 1
    if (pageFromUrl !== page) {
      setPage(pageFromUrl)
    }
  }, [searchParams])

  // Prevent background scrolling on mobile when filters drawer is open
  useEffect(() => {
    if (filtersOpen && typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 1024
      if (isMobile) {
        document.body.style.overflow = 'hidden'
      }
    } else if (typeof window !== 'undefined') {
      document.body.style.overflow = ''
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }, [filtersOpen])

  const queryString = Object.entries({ ...filters, sort, page, limit: 12 })
    .filter(([, v]) => v !== '')
    .map(([k, v]) => `${k}=${v}`)
    .join('&')

  const { data, isLoading } = useQuery({
    queryKey: ['products', queryString],
    queryFn: () => api.get(`/products?${queryString}`).then((r) => r.data),
    placeholderData: (previousData) => previousData,
    staleTime: 3 * 60 * 1000,
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
      } catch {
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
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)
      updated.delete('page')
      return updated
    })
  }

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', rating: '', featured: '', inStock: '' })
    setPage(1)
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)
      updated.delete('page')
      return updated
    })
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (data?.totalPages && newPage > data.totalPages) || newPage === page) return
    setPage(newPage)
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)
      if (newPage > 1) {
        updated.set('page', newPage.toString())
      } else {
        updated.delete('page')
      }
      return updated
    })

    // Scroll smoothly to top of product catalog section
    const catalogElement = document.getElementById('catalog-products')
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 180, behavior: 'smooth' })
    }
  }

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => Boolean(v) && k !== 'search').length

  const totalPages = data?.totalPages || 1
  const products = data?.products || []

  // Reusable filter inputs block
  const FilterContent = ({ isMobile = false }) => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-200 mb-3">Category</h4>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
            <input
              type="radio"
              name={`category-${isMobile ? 'm' : 'd'}`}
              value=""
              checked={!filters.category}
              onChange={() => updateFilter('category', '')}
              className="accent-pink-600 w-4 h-4"
            />
            <span className={`text-xs font-medium transition-colors ${!filters.category ? 'text-pink-600 font-bold' : 'text-[#64748B] dark:text-slate-300 group-hover:text-pink-600'}`}>
              All Categories
            </span>
          </label>
          {(categories || []).map((cat) => (
            <label key={cat._id || cat.name} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
              <input
                type="radio"
                name={`category-${isMobile ? 'm' : 'd'}`}
                value={cat._id || cat.name}
                checked={filters.category === cat._id || filters.category === cat.name}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="accent-pink-600 w-4 h-4"
              />
              <span className={`text-xs font-medium transition-colors ${filters.category === cat._id || filters.category === cat.name ? 'text-pink-600 font-bold' : 'text-[#64748B] dark:text-slate-300 group-hover:text-pink-600'}`}>
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
            <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
              <input
                type="radio"
                name={`price-${isMobile ? 'm' : 'd'}`}
                checked={filters.minPrice === String(range.min) && filters.maxPrice === String(range.max)}
                onChange={() => { updateFilter('minPrice', String(range.min)); updateFilter('maxPrice', String(range.max)) }}
                className="accent-pink-600 w-4 h-4"
              />
              <span className={`text-xs font-medium transition-colors ${filters.minPrice === String(range.min) && filters.maxPrice === String(range.max) ? 'text-pink-600 font-bold' : 'text-[#64748B] dark:text-slate-300 group-hover:text-pink-600'}`}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-gray-200 mb-3">Customer Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
              <input
                type="radio"
                name={`rating-${isMobile ? 'm' : 'd'}`}
                value={r}
                checked={filters.rating === String(r)}
                onChange={(e) => updateFilter('rating', e.target.value)}
                className="accent-pink-600 w-4 h-4"
              />
              <span className={`text-xs font-medium transition-colors ${filters.rating === String(r) ? 'text-pink-600 font-bold' : 'text-[#64748B] dark:text-slate-300 group-hover:text-pink-600'}`}>
                {r}★ & Above
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pt-2 border-t border-[#E5E7EB] dark:border-slate-700">
        <label className="flex items-center gap-2.5 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
            className="accent-pink-600 w-4 h-4 rounded"
          />
          <span className="text-xs font-semibold text-[#1F2937] dark:text-white">In Stock Items Only</span>
        </label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      {/* Header Banner */}
      <div className="bg-[#F5F7FA] dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-slate-800 py-6 sm:py-10">
        <div className="section-container text-center">
          <span className="section-subtitle">Atelier Catalog</span>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F2937] dark:text-white">
            Designer <span className="text-gradient-pink">Collection</span>
          </motion.h1>
          <div className="h-0.5 w-12 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto my-2 rounded-full" />
          <p className="text-[#64748B] dark:text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Explore {data?.total || products.length || 0} handcrafted bridal blouses, sarees, custom embroidery outfits, and luxury fabrics.
          </p>
        </div>
      </div>

      <div className="section-container py-6 pb-24 md:pb-12">
        {/* Toolbar Controls */}
        <div id="catalog-products" className="flex flex-wrap items-center justify-between gap-3 mb-6 scroll-mt-24">
          {/* Mobile & Desktop Filter Button */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-slate-700 rounded-xl text-xs font-bold text-[#1F2937] dark:text-white hover:border-pink-300 shadow-soft transition-colors active:scale-95"
            aria-label="Toggle Filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-pink-500" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 bg-pink-500 text-white rounded-full text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-[#64748B] dark:text-slate-300 font-medium flex-items-center gap-1">
              <ArrowUpDown className="w-3 h-3 inline" /> Sort:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-slate-700 rounded-xl text-xs font-semibold text-[#1F2937] dark:text-white focus:outline-none focus:border-pink-500 cursor-pointer shadow-soft"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Query Active Tag */}
        {filters.search && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-[#64748B]">Searching:</span>
            <span className="badge badge-soft text-xs">{filters.search}</span>
            <button onClick={() => updateFilter('search', '')} className="text-[#64748B] hover:text-rose-500" title="Clear search">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex items-start gap-6">
          {/* ================= DESKTOP INLINE SIDEBAR (Hidden on mobile) ================= */}
          <div className="hidden lg:block">
            <AnimatePresence>
              {filtersOpen && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 260, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex-shrink-0 overflow-hidden"
                >
                  <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-5 border border-[#E5E7EB] dark:border-slate-800 shadow-card">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-slate-700 mb-4">
                      <h3 className="font-display font-bold text-sm text-[#1F2937] dark:text-white">Filters</h3>
                      <button onClick={clearFilters} className="text-xs text-pink-600 font-bold hover:underline">
                        Clear All
                      </button>
                    </div>
                    <FilterContent isMobile={false} />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>

          {/* ================= MOBILE BOTTOM SHEET / SLIDE-UP DRAWER ================= */}
          <AnimatePresence>
            {filtersOpen && (
              <div className="lg:hidden fixed inset-0 z-[100] flex flex-col justify-end">
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setFiltersOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                  aria-hidden="true"
                />

                {/* Bottom Sheet Modal Container */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="relative z-10 w-full max-h-[85vh] bg-white dark:bg-[#1F2937] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-[#E5E7EB] dark:border-slate-700"
                >
                  {/* Drawer Handle & Header */}
                  <div className="p-4 pb-3 border-b border-[#E5E7EB] dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="w-10 h-1 bg-gray-300 dark:bg-slate-600 rounded-full mx-auto mb-2.5" />
                      <h3 className="font-display font-bold text-base text-[#1F2937] dark:text-white flex items-center gap-2">
                        <span>Filters & Sorting</span>
                        {activeFilterCount > 0 && (
                          <span className="text-[10px] bg-pink-500 text-white font-bold px-2 py-0.5 rounded-full">
                            {activeFilterCount} Active
                          </span>
                        )}
                      </h3>
                    </div>

                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-[#1F2937] dark:text-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                      aria-label="Close filters drawer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Scrollable Filters Content */}
                  <div className="flex-1 overflow-y-auto px-5 py-4 overscroll-contain">
                    <FilterContent isMobile={true} />
                  </div>

                  {/* Sticky Mobile Actions Bar */}
                  <div className="p-4 bg-white dark:bg-[#1F2937] border-t border-[#E5E7EB] dark:border-slate-700 flex items-center gap-3 safe-area-pb">
                    <button
                      onClick={clearFilters}
                      className="flex-1 py-3 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-[#1F2937] dark:text-white text-xs font-bold rounded-xl transition-colors text-center"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="flex-1 btn-primary py-3 px-4 text-xs font-bold text-center justify-center shadow-card"
                    >
                      Apply Filters ({products.length})
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* ================= PRODUCTS GRID (2 columns on mobile, 4 on desktop) ================= */}
          <div className="flex-1 w-full min-w-0">
            {isLoading ? (
              <CatalogGridSkeleton count={12} />
            ) : products.length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#F5F7FA] dark:bg-[#1F2937] rounded-3xl border border-[#E5E7EB] dark:border-slate-800 shadow-soft">
                <div className="w-16 h-16 bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  👗
                </div>
                <h3 className="text-lg font-display font-bold text-[#1F2937] dark:text-white">
                  No products found
                </h3>
                <p className="text-[#64748B] text-xs mt-1 max-w-md mx-auto leading-relaxed">
                  Try adjusting or clearing your filters to see more handcrafted designs.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                  <button onClick={clearFilters} className="btn-secondary text-xs py-2 px-4">
                    Clear Filters
                  </button>
                  <a href="/customize" className="btn-primary text-xs py-2 px-5">
                    Request Custom Tailoring →
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                {products.map((product, i) => (
                  <motion.div key={product._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                    <ProductCard product={product} priority={i < 4} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {/* Previous Page Button */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                    page <= 1
                      ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-[#1F2937] text-[#64748B]'
                      : 'bg-white dark:bg-[#1F2937] text-[#1F2937] dark:text-white border border-[#E5E7EB] dark:border-slate-700 hover:border-pink-300 shadow-soft active:scale-95'
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                      p === page
                        ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-soft ring-2 ring-pink-300 dark:ring-pink-800'
                        : 'bg-white dark:bg-[#1F2937] text-[#64748B] dark:text-slate-300 border border-[#E5E7EB] dark:border-slate-700 hover:border-pink-300'
                    }`}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ))}

                {/* Next Page Button */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                    page >= totalPages
                      ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-[#1F2937] text-[#64748B]'
                      : 'bg-white dark:bg-[#1F2937] text-[#1F2937] dark:text-white border border-[#E5E7EB] dark:border-slate-700 hover:border-pink-300 shadow-soft active:scale-95'
                  }`}
                  aria-label="Next Page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
