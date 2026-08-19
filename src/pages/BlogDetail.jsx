import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, User, Clock, ArrowLeft, Share2, Sparkles } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function BlogDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.get(`/blogs/${slug}`).then((r) => r.data.blog),
  })

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  if (isLoading) return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      <div className="skeleton h-72 w-full" />
      <div className="section-container py-10 max-w-3xl space-y-4">
        <div className="skeleton h-10 w-3/4 rounded-xl" />
        <div className="skeleton h-4 w-full rounded-xl" />
        <div className="skeleton h-4 w-full rounded-xl" />
        <div className="skeleton h-4 w-2/3 rounded-xl" />
      </div>
    </div>
  )

  if (!blog) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#111827]">
      <div className="text-center p-8 bg-[#F5F7FA] dark:bg-[#1F2937] rounded-3xl border border-[#E5E7EB]">
        <p className="text-4xl mb-3">📄</p>
        <h2 className="text-xl font-display font-bold text-[#1F2937] dark:text-white">Article not found</h2>
        <button onClick={() => navigate('/blog')} className="btn-primary mt-4 text-xs py-2.5 px-6">Back to Blog</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      {/* Hero Header */}
      <div className="relative h-72 md:h-96 bg-[#1F2937] overflow-hidden">
        {blog.image && <img src={blog.image} alt={blog.title} className="absolute inset-0 w-full h-full object-cover opacity-35" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-[#1F2937]/40 to-transparent" />
        <div className="relative section-container h-full flex flex-col justify-end pb-10">
          {blog.category && (
            <span className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 w-fit shadow-soft uppercase tracking-wider">{blog.category}</span>
          )}
          <h1 className="font-display text-2xl md:text-4xl font-bold text-white leading-snug max-w-3xl">{blog.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-pink-100 text-xs flex-wrap">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-pink-400" /> {blog.author?.name || 'SLV Atelier'}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-pink-400" /> {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            {blog.readTime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-pink-400" /> {blog.readTime} min read</span>}
          </div>
        </div>
      </div>

      <div className="section-container py-10 max-w-3xl">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E5E7EB]">
          <button onClick={() => navigate('/blog')} className="flex items-center gap-1.5 text-[#64748B] hover:text-pink-600 transition-colors text-xs font-bold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 text-[#64748B] hover:text-pink-600 transition-colors text-xs font-bold border border-[#E5E7EB] px-3 py-1.5 rounded-xl hover:bg-[#F5F7FA]">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>

        {blog.excerpt && (
          <p className="text-base text-[#1F2937] dark:text-gray-200 font-serif italic border-l-4 border-pink-500 pl-4 py-1 mb-8 bg-[#F5F7FA] dark:bg-pink-950/20 rounded-r-xl">{blog.excerpt}</p>
        )}

        <div
          className="prose prose-pink dark:prose-invert max-w-none text-[#1F2937] dark:text-charcoal-200 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content || '<p>Content not available.</p>' }}
        />

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[#E5E7EB] dark:border-charcoal-700">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2.5">Topic Tags:</p>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-[#F5F7FA] dark:bg-charcoal-800 text-pink-600 dark:text-pink-400 border border-[#E5E7EB] text-xs font-medium rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
