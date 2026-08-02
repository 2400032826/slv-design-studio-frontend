import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const popularSearches = ['Designer Blouse', 'Bridal Collection', 'Embroidery', 'Kurti', 'Wedding']

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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
              <Search className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products, services..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && query && handleSearch(query)}
                className="flex-1 text-lg bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 rounded-full border-2 border-purple-900/30 border-t-gold-500 animate-spin" />
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-2 mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Products</p>
                  {results.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => { navigate(`/products/${product.slug || product._id}`); onClose() }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-left group"
                    >
                      {product.images?.[0] && (
                        <img src={product.images[0].url} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-gold-500 font-semibold text-sm">₹{product.offerPrice || product.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!query && (
                <>
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Recent
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((s) => (
                          <button key={s} onClick={() => handleSearch(s)}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gold-100 hover:text-gold-700 transition-colors">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> Popular
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((s) => (
                        <button key={s} onClick={() => handleSearch(s)}
                          className="px-3 py-1.5 border border-gold-300 text-gold-600 rounded-full text-sm hover:bg-gold-50 transition-colors">
                          {s}
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
