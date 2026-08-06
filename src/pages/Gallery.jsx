import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import api from '../api/axios'
import { getImageUrl } from '../utils/imageUtils'

const categories = ['all', 'embroidery', 'printing', 'stitching', 'wedding', 'bridal', 'jewellery', 'other']

const fallbackGallery = [
  { id: 1, category: 'embroidery', title: 'Royal Bridal Maggam Work', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800' },
  { id: 2, category: 'stitching', title: 'Designer Velvet Blouse', url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800' },
  { id: 3, category: 'printing', title: 'Digital Silk Dupatta Print', url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800' },
  { id: 4, category: 'wedding', title: 'South Indian Silk Zari Saree', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800' },
  { id: 5, category: 'bridal', title: 'Gold Zardosi Embroidery', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800' },
  { id: 6, category: 'jewellery', title: '1-Gram Gold Bridal Choker', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800' },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selected, setSelected] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', activeCategory],
    queryFn: () => api.get(`/gallery?${activeCategory !== 'all' ? `category=${activeCategory}&` : ''}limit=50`).then((r) => r.data.items),
    staleTime: 5 * 60 * 1000,
  })

  const items = data?.length > 0 ? data : fallbackGallery

  return (
    <div className="min-h-screen bg-warmwhite dark:bg-charcoal-950">
      {/* Header Banner */}
      <div className="bg-burgundy-700 py-16 text-center text-white">
        <div className="section-container">
          <span className="text-gold-300 text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Atelier Showcase
          </span>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="section-title text-white">
            Our Portfolio & <span className="text-gold-300">Gallery</span>
          </motion.h1>
          <div className="h-px bg-white/20 max-w-xs mx-auto my-4" />
          <p className="text-warmwhite/80 text-sm max-w-xl mx-auto font-light font-sans">
            Handcrafted embroidery, tailored bridal blouses, and custom digital fabric prints created at SLV Women's Studio.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-burgundy-700 text-white shadow-subtle'
                  : 'bg-cardbg dark:bg-charcoal-900 text-charcoal-700 dark:text-warmwhite border border-subtleborder dark:border-charcoal-800 hover:border-burgundy-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Masonry Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div layout className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {items.map((item, i) => {
              const imgUrl = getImageUrl(item.url || item)
              return (
                <motion.div
                  key={item._id || item.id || i}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group break-inside-avoid shadow-subtle bg-cardbg dark:bg-charcoal-900 border border-subtleborder dark:border-charcoal-800"
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
                  <div className="absolute inset-0 bg-charcoal-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <span className="badge-gold text-[9px] font-bold tracking-widest uppercase mb-1 self-start">
                      {item.category || 'Atelier Creation'}
                    </span>
                    <h3 className="text-white font-display font-semibold text-sm leading-snug">
                      {item.title || 'Handcrafted Design'}
                    </h3>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-charcoal-950/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-card bg-charcoal-900 border border-charcoal-800"
            >
              <img
                src={selected.resolvedUrl || getImageUrl(selected.url)}
                alt={selected.title}
                className="w-full h-full max-h-[78vh] object-contain mx-auto"
              />
              {selected.title && (
                <div className="p-4 bg-burgundy-700 text-center">
                  <p className="font-display font-semibold text-white text-sm">{selected.title}</p>
                  <span className="text-gold-300 text-xs uppercase tracking-widest">{selected.category}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
