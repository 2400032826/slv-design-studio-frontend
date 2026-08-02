import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="skeleton h-72 w-full" />
      <div className="section-container py-10 max-w-3xl space-y-4">
        <div className="skeleton h-10 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    </div>
  )

  if (!blog) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">📄</p>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Article not found</h2>
        <button onClick={() => navigate('/blog')} className="btn-primary mt-4">Back to Blog</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-gradient-hero overflow-hidden">
        {blog.image && <img src={blog.image} alt={blog.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative section-container h-full flex flex-col justify-end pb-10">
          {blog.category && (
            <span className="inline-block bg-gold-500 text-purple-900 text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">{blog.category}</span>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight max-w-3xl">{blog.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-white/60 text-sm flex-wrap">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {blog.author?.name || 'SLV Team'}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            {blog.readTime && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {blog.readTime} min read</span>}
          </div>
        </div>
      </div>

      <div className="section-container py-10 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-gray-500 hover:text-gold-500 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 text-gray-500 hover:text-gold-500 transition-colors text-sm">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>

        {blog.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-300 font-light italic border-l-4 border-gold-500 pl-6 mb-8">{blog.excerpt}</p>
        )}

        <div
          className="prose prose-lg prose-gray dark:prose-invert max-w-none prose-headings:font-display prose-a:text-gold-500 prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: blog.content || '<p>Content not available.</p>' }}
        />

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 mb-3">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
