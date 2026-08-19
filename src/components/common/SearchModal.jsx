import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const popularSearches = ['Designer Blouse', 'Bridal Collection', 'Embroidery', 'Kurti', 'Wedding', 'Maggam Work']

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem('slv_recent_searches') || '[]')
  )
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/products/search?q=${query}&limit=6`)
        setResults(data.products || [])
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = (q) => {
    const searches = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5)
    setRecentSearches(searches)
    localStorage.setItem('slv_recent_searches', JSON.stringify(searches))
    navigate(`/products?search=${q}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-[#1F2937]/60 backdrop-blur-sm" />
          <motion.div
            className="relative w-full max-w-2xl bg-white dark:bg-[#1F2937] rounded-2xl shadow-card-hover border border-[#E5E7EB] dark:border-charcoal-800 overflow-hidden"
            initial={{ y: -40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 p-4 border-b border-[#E5E7EB] dark:border-charcoal-800 bg-[#F5F7FA] dark:bg-[#1F2937]">
              <Search className="w-5 h-5 text-pink-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search bridal blouses, custom embroidery, dresses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && query && handleSearch(query)}
                className="flex-1 text-base bg-transparent outline-none text-[#1F2937] dark:text-white placeholder-[#94A3B8]"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 hover:bg-[#FFF5F9] dark:hover:bg-charcoal-800 rounded-full text-[#64748B]">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-1.5 hover:bg-[#FFF5F9] dark:hover:bg-charcoal-800 rounded-xl text-[#64748B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 rounded-full border-2 border-pink-200 border-t-pink-500 animate-spin" />
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-2">Matching Products</p>
                  {results.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => { navigate(`/products/${product.slug || product._id}`); onClose() }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F5F7FA] dark:hover:bg-[#1F2937] border border-transparent hover:border-[#E5E7EB] text-left group transition-all"
                    >
                      {product.images?.[0] && (
                        <img src={product.images[0].url} alt={product.name} className="w-12 h-12 object-cover rounded-xl border border-[#E5E7EB]" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#1F2937] dark:text-white truncate group-hover:text-pink-600 transition-colors">{product.name}</p>
                        <p className="text-pink-600 dark:text-pink-400 font-bold text-xs mt-0.5">₹{(product.offerPrice || product.price)?.toLocaleString('en-IN')}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!query && (
                <>
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-bold text-[#64748B] dark:text-charcoal-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-pink-500" /> Recent Searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((s) => (
                          <button key={s} onClick={() => handleSearch(s)}
                            className="px-3 py-1.5 bg-[#F5F7FA] dark:bg-charcoal-800 text-[#1F2937] dark:text-white border border-[#E5E7EB] dark:border-charcoal-700 rounded-full text-xs font-medium hover:border-pink-300 hover:text-pink-600 transition-colors">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-[#64748B] dark:text-charcoal-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-pink-500" /> Trending Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((s) => (
                        <button key={s} onClick={() => handleSearch(s)}
                          className="px-3 py-1.5 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] text-pink-600 dark:text-pink-400 rounded-full text-xs font-medium hover:bg-[#FFF5F9] transition-colors flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-pink-400" /> {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
