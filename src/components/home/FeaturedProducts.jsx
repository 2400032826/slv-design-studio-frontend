import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import api from '../../api/axios'
import ProductCard from '../products/ProductCard'

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products/featured').then((r) => r.data.products),
  })

  const skeleton = Array(4).fill(null)

  return (
    <section className="py-20 bg-warmwhite dark:bg-charcoal-950">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="section-subtitle">Curated Showcase</span>
            <h2 className="section-title">
              Featured <span className="text-burgundy-700 dark:text-gold-400">Collections</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex items-center gap-2 text-burgundy-700 dark:text-gold-400 font-semibold text-xs uppercase tracking-widest hover:gap-3 transition-all"
          >
            View Entire Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? skeleton.map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-cardbg dark:bg-charcoal-900 border border-subtleborder dark:border-charcoal-800 p-4">
                  <div className="skeleton h-72 rounded-xl mb-4" />
                  <div className="space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                  </div>
                </div>
              ))
            : (data || []).map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link to="/products" className="btn-primary text-xs uppercase tracking-wider">
            View Entire Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
