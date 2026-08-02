import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Image } from 'lucide-react'
import api from '../../api/axios'
import { getImageUrl } from '../../utils/imageUtils'

const sampleGallery = [
  { id: 1, category: 'embroidery', gradient: 'from-purple-900 to-pink-900' },
  { id: 2, category: 'stitching', gradient: 'from-gold-900/80 to-purple-900' },
  { id: 3, category: 'printing', gradient: 'from-pink-900 to-purple-900' },
  { id: 4, category: 'wedding', gradient: 'from-purple-900 to-gold-900/80' },
  { id: 5, category: 'bridal', gradient: 'from-pink-900/80 to-purple-950' },
  { id: 6, category: 'jewellery', gradient: 'from-gold-900/60 to-pink-900/80' },
]

export default function GallerySection() {
  const { data } = useQuery({
    queryKey: ['gallery-featured'],
    queryFn: () => api.get('/gallery?featured=true&limit=6').then((r) => r.data.items),
    staleTime: 10 * 60 * 1000,
  })

  const items = data || []

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="section-container">
        <motion.div className="flex items-end justify-between mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div>
            <span className="text-purple-500 text-sm font-semibold uppercase tracking-widest">Gallery</span>
            <h2 className="section-title text-gray-900 dark:text-white mt-1">Our <span className="text-gradient-gold">Work</span></h2>
          </div>
          <Link to="/gallery" className="flex items-center gap-2 text-gold-500 font-medium hover:gap-3 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(items.length > 0 ? items : sampleGallery).map((item, i) => {
            const imgUrl = getImageUrl(item.url || item)
            return (
              <motion.div
                key={item._id || item.id}
                className={`relative rounded-2xl overflow-hidden aspect-square group cursor-pointer ${!imgUrl ? `bg-gradient-to-br ${item.gradient}` : ''}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02 }}
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
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-12 h-12 text-white/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium capitalize">{item.category}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
