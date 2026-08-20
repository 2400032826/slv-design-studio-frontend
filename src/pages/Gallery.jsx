import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, Sparkles } from 'lucide-react'
import api from '../api/axios'
import { getImageUrl } from '../utils/imageUtils'
import { getUnifiedGalleryItems } from '../utils/galleryService'

const categories = ['all', 'embroidery', 'printing', 'stitching', 'wedding', 'bridal', 'jewellery', 'other']

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selected, setSelected] = useState(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['gallery', activeCategory],
    queryFn: () => getUnifiedGalleryItems(activeCategory),
    staleTime: 1 * 60 * 1000,
  })

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      {/* Header Banner */}
      <div className="bg-[#F5F7FA] dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-charcoal-800 py-16 text-center">
        <div className="section-container max-w-2xl mx-auto">
          <span className="badge badge-soft text-[10px] uppercase font-bold tracking-widest mb-2 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-500" />
            Atelier Lookbook
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white mt-1">
            Masterwork <span className="text-gradient-pink">Lookbook & Gallery</span>
          </h1>
          <p className="text-[#64748B] dark:text-charcoal-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Handcrafted embroidery, tailored bridal blouses, and custom digital fabric prints created at SLV Women's Studio.
          </p>
        </div>
      </div>

      <div className="section-container py-8 sm:py-12">
        {/* Category Filters - Horizontal swipe on mobile, wrap on desktop */}
        <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center gap-2 pb-2 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-full whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeCategory === cat
                  ? 'btn-primary text-white shadow-soft'
                  : 'bg-white dark:bg-[#1F2937] text-[#64748B] border border-[#E5E7EB] dark:border-charcoal-700 hover:border-pink-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Masonry Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-5 space-y-3 sm:space-y-5">
            {items.map((item, i) => {
              const imgUrl = getImageUrl(item.url || item)
              return (
                <motion.div
                  key={item._id || item.id || i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative overflow-hidden cursor-pointer group break-inside-avoid bg-[#F5F7FA] dark:bg-charcoal-900 border border-[#E5E7EB] dark:border-charcoal-800 rounded-2xl shadow-soft hover:shadow-card"
                  onClick={() => imgUrl && setSelected({ ...item, resolvedUrl: imgUrl })}
                >
                  <img
                    src={imgUrl}
                    alt={item.title || 'Gallery showcase'}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                    <span className="badge bg-pink-500 text-white text-[9px] font-bold tracking-widest uppercase mb-1 self-start shadow-soft">
                      {item.category || 'Atelier Creation'}
                    </span>
                    <h3 className="text-white font-display font-semibold text-xs leading-snug">
                      {item.title || 'Handcrafted Design'}
                    </h3>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full text-[#1F2937] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center shadow-soft border border-[#E5E7EB]">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full max-h-[85vh] overflow-hidden bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-charcoal-800 shadow-card"
            >
              <img
                src={selected.resolvedUrl || getImageUrl(selected.url)}
                alt={selected.title}
                className="w-full h-full max-h-[75vh] object-contain mx-auto"
              />
              {selected.title && (
                <div className="p-4 bg-[#F5F7FA] dark:bg-[#1F2937] text-center border-t border-[#E5E7EB] dark:border-charcoal-800 space-y-2">
                  <div>
                    <p className="font-display font-bold text-[#1F2937] dark:text-white text-sm">{selected.title}</p>
                    <span className="text-pink-600 text-xs font-bold uppercase tracking-wider">{selected.category}</span>
                  </div>
                  <div>
                    <Link
                      to={`/customize?service=${selected.category || 'embroidery'}&design=${selected._id || selected.id}`}
                      className="btn-primary text-xs font-bold py-2 px-5 inline-flex items-center gap-1.5 shadow-soft"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Customize This Lookbook Design
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
