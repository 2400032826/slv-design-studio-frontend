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
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="section-container">
        <motion.div className="flex items-end justify-between mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div>
            <span className="text-gold-500 text-sm font-semibold uppercase tracking-widest">Featured</span>
            <h2 className="section-title text-gray-900 dark:text-white mt-1">Latest <span className="text-gradient-royal">Designs</span></h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 text-gold-500 font-medium hover:gap-3 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading
            ? skeleton.map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton h-64" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                  </div>
                </div>
              ))
            : (data || []).map((product, i) => (
                <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link to="/products" className="btn-primary">View All Products</Link>
        </div>
      </div>
    </section>
  )
}
