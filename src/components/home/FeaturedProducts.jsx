import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import api from '../../api/axios'
import ProductCard from '../products/ProductCard'
import { ProductCardSkeleton } from '../common/LoadingSpinner'

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      let products = []
      try {
        const res = await api.get('/products/featured')
        products = res.data?.products || []
      } catch (err) {
        console.warn('Featured fetch fallback:', err)
      }
      if (!products || products.length === 0) {
        try {
          const fallbackRes = await api.get('/products?limit=8')
          products = fallbackRes.data?.products || fallbackRes.data || []
        } catch (err) {
          products = []
        }
      }
      if (products.length > 0) {
        try {
          localStorage.setItem('slv_featured_cache', JSON.stringify(products))
        } catch (e) {
          console.warn('Cache write warning:', e)
        }
      }
      return products
    },
    initialData: () => {
      try {
        const cached = localStorage.getItem('slv_featured_cache')
        return cached ? JSON.parse(cached) : undefined
      } catch {
        return undefined
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  if (!isLoading && (!data || data.length === 0)) {
    return null
  }

  const showSkeleton = isLoading && (!data || data.length === 0)

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-slate-800">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="section-subtitle">Curated Atelier Collection</span>
            <h2 className="section-title text-[#1F2937] dark:text-white">
              Our Latest <span className="text-gradient-pink">Designs</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-xs uppercase tracking-wider hover:text-pink-700 transition-colors"
          >
            View Entire Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showSkeleton
            ? Array(4).fill(null).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : (data || []).map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ProductCard product={product} priority={i < 4} />
                </motion.div>
              ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link to="/products" className="btn-primary text-xs w-full py-3">
            View Entire Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
