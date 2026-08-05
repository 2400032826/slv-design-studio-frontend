import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, ZoomIn, Sparkles, Filter } from 'lucide-react'
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
  { id: 7, category: 'embroidery', title: 'Custom Peacock Motif Embroidery', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800' },
  { id: 8, category: 'stitching', title: 'Tailored Anarkali Suit', url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800' },
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
    <div className="min-h-screen bg-beige-50 dark:bg-charcoal-950">
      {/* Hero Banner */}
      <div className="bg-gradient-hero py-20 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(212,175,55,0.6) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="section-container relative z-10">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Atelier Portfolio
          </span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-white">
            Our Luxury <span className="text-gradient-gold">Gallery</span>
          </motion.h1>
          <div className="gold-divider max-w-xs mx-auto my-4" />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-beige-200/80 text-sm max-w-xl mx-auto font-light">
            Explore our bespoke collection of handcrafted embroidery, tailored bridal blouses, and custom digital fabric prints.
          </motion.p>
        </div>
      </div>

      <div className="section-container py-14">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-gold text-maroon-950 shadow-gold scale-105'
                  : 'bg-white dark:bg-charcoal-900 text-charcoal-700 dark:text-beige-200 border border-beige-200/80 dark:border-charcoal-800 hover:border-gold-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Portfolio Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] rounded-3xl" />
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative rounded-3xl overflow-hidden cursor-pointer group break-inside-avoid shadow-luxury bg-white dark:bg-charcoal-900 border border-beige-200/60 dark:border-charcoal-800"
                  onClick={() => imgUrl && setSelected({ ...item, resolvedUrl: imgUrl })}
                >
                  <img
                    src={imgUrl}
                    alt={item.title || 'Gallery item'}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <span className="badge-gold text-[10px] font-bold tracking-widest uppercase mb-1.5 self-start">
                      {item.category || 'Atelier Work'}
                    </span>
                    <h3 className="text-white font-display font-semibold text-base leading-snug">
                      {item.title || 'Custom Fashion Creation'}
                    </h3>
                  </div>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
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
            className="fixed inset-0 z-[200] bg-charcoal-950/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-luxury relative border border-gold-500/30 bg-charcoal-900"
            >
              <img
                src={selected.resolvedUrl || getImageUrl(selected.url)}
                alt={selected.title}
                className="w-full h-full max-h-[80vh] object-contain mx-auto"
              />
              {selected.title && (
                <div className="p-4 bg-gradient-maroon text-center border-t border-gold-500/20">
                  <p className="font-display font-semibold text-white text-base">{selected.title}</p>
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
