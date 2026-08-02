import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, User, Clock, ArrowRight, BookOpen } from 'lucide-react'
import api from '../api/axios'

export default function Blog() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => api.get('/blogs?published=true&limit=12').then((r) => r.data.blogs),
    staleTime: 10 * 60 * 1000,
  })

  const blogs = data || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-hero py-16">
        <div className="section-container text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold-400 text-sm font-semibold uppercase tracking-widest">
            Fashion & Style
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-white mt-2">
            Our <span className="text-gradient-gold">Blog</span>
          </motion.h1>
          <p className="text-white/60 mt-3">Tips, trends, and inspiration from our design experts</p>
        </div>
      </div>

      <div className="section-container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <div className="skeleton h-48" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">Blog coming soon</h3>
            <p className="text-gray-400 mt-2">We're working on some great content for you!</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {blogs[0] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Link to={`/blog/${blogs[0].slug || blogs[0]._id}`}
                  className="group grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gold-300 transition-all shadow-sm hover:shadow-md">
                  <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-purple-900 to-pink-900 relative overflow-hidden">
                    {blogs[0].image ? (
                      <img src={blogs[0].image} alt={blogs[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-7xl">📝</div>
                    )}
                    <div className="absolute top-4 left-4 bg-gold-500 text-purple-900 text-xs font-bold px-3 py-1 rounded-full">Featured</div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="text-gold-500 text-xs font-semibold uppercase tracking-widest mb-2">{blogs[0].category}</span>
                    <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-gold-600 transition-colors">{blogs[0].title}</h2>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">{blogs[0].excerpt || blogs[0].content?.slice(0, 200)}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blogs[0].author?.name || 'SLV Team'}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(blogs[0].createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {blogs[0].readTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blogs[0].readTime} min read</span>}
                    </div>
                    <span className="inline-flex items-center gap-2 text-gold-500 font-medium text-sm group-hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Blog grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.slice(1).map((blog, i) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/blog/${blog.slug || blog._id}`}
                    className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gold-300 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                    <div className="aspect-video bg-gradient-to-br from-purple-900 to-pink-900 relative overflow-hidden">
                      {blog.image ? (
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl">📝</div>
                      )}
                      {blog.category && (
                        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{blog.category}</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">{blog.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">{blog.excerpt || blog.content?.slice(0, 150)}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        {blog.readTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime} min</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
