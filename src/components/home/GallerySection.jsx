import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Image } from 'lucide-react'
import api from '../../api/axios'
import { getImageUrl } from '../../utils/imageUtils'

const sampleGallery = [
  { id: 1, category: 'embroidery', gradient: 'from-pink-500/20 to-fuchsia-600/20' },
  { id: 2, category: 'stitching', gradient: 'from-rose-500/20 to-pink-500/20' },
  { id: 3, category: 'printing', gradient: 'from-purple-500/20 to-pink-500/20' },
  { id: 4, category: 'wedding', gradient: 'from-pink-500/20 to-amber-500/20' },
  { id: 5, category: 'bridal', gradient: 'from-fuchsia-500/20 to-rose-500/20' },
  { id: 6, category: 'jewellery', gradient: 'from-amber-500/20 to-pink-500/20' },
]

export default function GallerySection() {
  const { data } = useQuery({
    queryKey: ['gallery-featured'],
    queryFn: () => api.get('/gallery?featured=true&limit=6').then((r) => r.data.items),
    staleTime: 10 * 60 * 1000,
  })

  const items = data || []

  return (
    <section className="py-20 bg-[#F8F9FB] dark:bg-[#111827] border-b border-[#E8EAF0] dark:border-slate-800">
      <div className="section-container">
        <motion.div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div>
            <span className="section-subtitle">Visual Lookbook</span>
            <h2 className="section-title text-[#252A34] dark:text-white">Our Atelier <span className="text-gradient-pink">Work</span></h2>
          </div>
          <Link to="/gallery" className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400 font-bold text-xs uppercase tracking-wider hover:text-pink-700 transition-colors">
            View All Work <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(items.length > 0 ? items : sampleGallery).map((item, i) => {
            const imgUrl = getImageUrl(item.url || item)
            return (
              <motion.div
                key={item._id || item.id}
                className={`relative rounded-2xl overflow-hidden aspect-square group cursor-pointer border border-[#E8EAF0] dark:border-slate-800 shadow-card ${!imgUrl ? `bg-gradient-to-br ${item.gradient}` : ''}`}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.02 }}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={item.title || 'Gallery'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-10 h-10 text-pink-400 opacity-60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-semibold text-xs tracking-wider uppercase capitalize">{item.category || item.title || 'Custom Stitching'}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
