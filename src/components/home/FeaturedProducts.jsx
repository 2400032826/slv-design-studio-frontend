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
    <section className="py-20 bg-white dark:bg-black">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="section-subtitle">Curated Collection</span>
            <h2 className="section-title">
              Featured <span className="text-gold-500">Couture</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex items-center gap-2 text-black dark:text-white font-semibold text-xs uppercase tracking-widest hover:text-gold-500 transition-colors"
          >
            View Entire Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? skeleton.map((_, i) => (
                <div key={i} className="bg-white dark:bg-charcoal-900 border border-[#EAEAEA] dark:border-charcoal-800 p-4">
                  <div className="skeleton h-72 rounded-none mb-4" />
                  <div className="space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                  </div>
                </div>
              ))
            : (data || []).map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
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
