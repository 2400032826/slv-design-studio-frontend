import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, User, Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import api from '../api/axios'

export default function Blog() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => api.get('/blogs?published=true&limit=12').then((r) => r.data.blogs),
    staleTime: 10 * 60 * 1000,
  })

  const blogs = data || []

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      {/* Header */}
      <div className="bg-[#F5F7FA] dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 py-16 text-center">
        <div className="section-container max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 badge badge-soft text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Fashion & Styling Journal</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white">
            Atelier <span className="text-gradient-pink">Stories & Trends</span>
          </motion.h1>
          <p className="text-[#64748B] dark:text-charcoal-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Inspiration, embroidery guides, blouse neck trends, and styling tips from our master craftsmen.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#1F2937] rounded-2xl overflow-hidden border border-[#E5E7EB]">
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
          <div className="text-center py-20 bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB]">
            <BookOpen className="w-14 h-14 text-pink-300 mx-auto mb-3" />
            <h3 className="text-lg font-display font-bold text-[#1F2937] dark:text-white">Articles Coming Soon</h3>
            <p className="text-[#64748B] text-xs mt-1">We are crafting exciting fashion design guides for you!</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {blogs[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Link to={`/blog/${blogs[0].slug || blogs[0]._id}`}
                  className="group grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-[#1F2937] rounded-3xl overflow-hidden border border-[#E5E7EB] dark:border-charcoal-800 hover:border-pink-300 transition-all shadow-card hover:shadow-card-hover">
                  <div className="aspect-video lg:aspect-auto bg-[#F5F7FA] relative overflow-hidden">
                    {blogs[0].image ? (
                      <img src={blogs[0].image} alt={blogs[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-7xl">📝</div>
                    )}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-soft">Featured Story</div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">{blogs[0].category || 'Haute Couture'}</span>
                    <h2 className="font-display text-2xl font-bold text-[#1F2937] dark:text-white mb-3 group-hover:text-pink-600 transition-colors leading-snug">{blogs[0].title}</h2>
                    <p className="text-[#64748B] dark:text-charcoal-300 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3">{blogs[0].excerpt || blogs[0].content?.slice(0, 200)}</p>
                    <div className="flex items-center gap-4 text-xs text-[#94A3B8] mb-5">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-pink-500" /> {blogs[0].author?.name || 'SLV Atelier'}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-pink-500" /> {new Date(blogs[0].createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {blogs[0].readTime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-pink-500" /> {blogs[0].readTime} min read</span>}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-pink-600 font-bold text-xs group-hover:gap-2.5 transition-all">
                      Read Full Article <ArrowRight className="w-4 h-4" />
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
                  transition={{ delay: i * 0.08 }}
                >
                  <Link to={`/blog/${blog.slug || blog._id}`}
                    className="group block bg-white dark:bg-[#1F2937] rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-charcoal-800 hover:border-pink-300 transition-all shadow-soft hover:shadow-card hover:-translate-y-1">
                    <div className="aspect-video bg-[#F5F7FA] relative overflow-hidden border-b border-[#E5E7EB]">
                      {blog.image ? (
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl">📝</div>
                      )}
                      {blog.category && (
                        <div className="absolute top-3 left-3 bg-white/90 text-[#1F2937] border border-[#E5E7EB] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-soft">{blog.category}</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-base font-bold text-[#1F2937] dark:text-white mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">{blog.title}</h3>
                      <p className="text-[#64748B] dark:text-charcoal-400 text-xs line-clamp-2 mb-4 leading-relaxed">{blog.excerpt || blog.content?.slice(0, 150)}</p>
                      <div className="flex items-center justify-between text-xs text-[#94A3B8] border-t border-[#E5E7EB] pt-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-pink-500" /> {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        {blog.readTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-pink-500" /> {blog.readTime} min read</span>}
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
