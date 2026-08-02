import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, ZoomIn } from 'lucide-react'
import api from '../api/axios'
import { getImageUrl } from '../utils/imageUtils'

const categories = ['all', 'embroidery', 'printing', 'stitching', 'wedding', 'bridal', 'jewellery', 'other']

const fallbackGallery = [
  { id: 1, category: 'embroidery', gradient: 'from-purple-900 to-pink-900', emoji: '🧵' },
  { id: 2, category: 'stitching', gradient: 'from-gold-900/80 to-purple-900', emoji: '👗' },
  { id: 3, category: 'printing', gradient: 'from-pink-900 to-purple-900', emoji: '🖨️' },
  { id: 4, category: 'wedding', gradient: 'from-purple-900 to-gold-900/80', emoji: '💍' },
  { id: 5, category: 'bridal', gradient: 'from-pink-900/80 to-purple-950', emoji: '👰' },
  { id: 6, category: 'jewellery', gradient: 'from-gold-900/60 to-pink-900/80', emoji: '💎' },
  { id: 7, category: 'embroidery', gradient: 'from-purple-900/80 to-pink-900', emoji: '✨' },
  { id: 8, category: 'stitching', gradient: 'from-pink-900 to-gold-900/60', emoji: '🎀' },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selected, setSelected] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', activeCategory],
    queryFn: () => api.get(`/gallery?${activeCategory !== 'all' ? `category=${activeCategory}&` : ''}limit=50`).then((r) => r.data.items),
    staleTime: 5 * 60 * 1000,
  })

  const items = data?.length > 0 ? data : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-hero py-16">
        <div className="section-container text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold-400 text-sm font-semibold uppercase tracking-widest">
            Portfolio
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-white mt-2">
            Our <span className="text-gradient-gold">Gallery</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/60 mt-3 max-w-xl mx-auto">
            Explore our stunning collection of handcrafted designs, embroidery, and fashion creations
          </motion.p>
        </div>
      </div>

      <div className="section-container py-10">
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-royal text-white shadow-pink'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gold-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(12).fill(null).map((_, i) => <div key={i} className="skeleton aspect-square rounded-2xl" />)}
          </div>
        ) : (
          <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {(items.length > 0 ? items : fallbackGallery).map((item, i) => {
              const imgUrl = getImageUrl(item.url || item)
              return (
                <motion.div
                  key={item._id || item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group mb-4 break-inside-avoid ${
                    !imgUrl ? `bg-gradient-to-br ${item.gradient}` : ''
                  }`}
                  style={{ aspectRatio: i % 3 === 0 ? '1/1.3' : i % 3 === 1 ? '1/0.8' : '1/1' }}
                  onClick={() => imgUrl && setSelected({ ...item, resolvedUrl: imgUrl })}
                >
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={item.title || 'Gallery'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6">
                      <span className="text-5xl mb-3">{item.emoji}</span>
                      <p className="text-white/60 text-sm capitalize font-medium">{item.category}</p>
                    </div>
                  )}
                  {imgUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      {item.type === 'video' ? <Play className="w-10 h-10 text-white" /> : <ZoomIn className="w-8 h-8 text-white" />}
                    </div>
                  )}
                  {item.category && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full capitalize opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.category}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {items.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🖼️</p>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Gallery is being updated.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon for our latest work!</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden"
            >
              {selected.type === 'video' ? (
                <video src={selected.resolvedUrl || getImageUrl(selected.url)} controls className="w-full h-full" autoPlay />
              ) : (
                <img src={selected.resolvedUrl || getImageUrl(selected.url)} alt={selected.title} className="w-full h-full object-contain" />
              )}
            </motion.div>
            {selected.title && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-6 py-2">
                <p className="text-white text-sm">{selected.title}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
