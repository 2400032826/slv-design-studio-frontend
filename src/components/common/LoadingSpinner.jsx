import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-6 h-6 border-2', md: 'w-12 h-12 border-3', lg: 'w-16 h-16 border-4' }
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative">
        <motion.div
          className={`${sizes[size]} rounded-full border-pink-200 border-t-pink-600 shadow-soft`}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
        </div>
      </div>
      {text && <p className="text-pink-600 dark:text-pink-400 font-semibold text-xs uppercase tracking-wider animate-pulse">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#111827] text-[#1F2937] dark:text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(rgba(236,72,153,0.3) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="text-center relative z-10 px-4">
        <div className="relative inline-block mb-6">
          <motion.div
            className="w-20 h-20 rounded-full mx-auto shadow-pink-glow overflow-hidden"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img
              src="/slv-logo.png"
              alt="SLV Women's Fashion Studio"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        <motion.h2
          className="text-gradient-pink font-display text-2xl font-bold tracking-tight mb-2"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SLV Women's Fashion Studio
        </motion.h2>
        <p className="text-[#64748B] dark:text-pink-200 text-xs uppercase tracking-[0.2em] font-semibold">Loading Bespoke Boutique...</p>
      </div>
    </div>
  )
}

/**
 * Lightweight shimmer skeleton for single Product Card
 */
export function ProductCardSkeleton() {
  return (
    <div className="product-card h-full flex flex-col justify-between border border-[#E5E7EB] dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#1F2937] animate-pulse">
      {/* Image frame */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-pink-50/70 via-gray-100 to-pink-50/40 dark:from-slate-800 dark:via-pink-950/20 dark:to-slate-800 animate-shimmer" />

      {/* Details */}
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-20 bg-pink-100 dark:bg-pink-900/30 rounded-full" />
        <div className="h-4 w-4/5 bg-gray-200 dark:bg-slate-700 rounded-md" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-16 bg-pink-200 dark:bg-pink-900/40 rounded-md" />
          <div className="h-8 w-8 rounded-xl bg-pink-100 dark:bg-pink-900/30" />
        </div>
      </div>
    </div>
  )
}

/**
 * Grid of product card skeletons for Catalog & Category listing
 */
export function CatalogGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  )
}

/**
 * Shimmer skeleton for Product Detail Page
 */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111827] py-6 animate-pulse">
      <div className="section-container">
        {/* Breadcrumb */}
        <div className="h-4 w-48 bg-gray-200 dark:bg-slate-800 rounded-md mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Main image frame */}
          <div>
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-pink-50 via-gray-100 to-pink-50/50 dark:from-slate-800 dark:via-pink-950/20 dark:to-slate-800 animate-shimmer mb-4 border border-[#E5E7EB] dark:border-slate-800" />
            <div className="flex gap-2.5">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-slate-800 flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-6">
            <div className="h-3 w-28 bg-pink-200 dark:bg-pink-900/40 rounded-full" />
            <div className="h-7 w-3/4 bg-gray-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-6 w-32 bg-pink-100 dark:bg-pink-900/30 rounded-lg" />
            <div className="space-y-2 pt-4">
              <div className="h-3.5 w-full bg-gray-100 dark:bg-slate-800 rounded" />
              <div className="h-3.5 w-5/6 bg-gray-100 dark:bg-slate-800 rounded" />
              <div className="h-3.5 w-4/6 bg-gray-100 dark:bg-slate-800 rounded" />
            </div>
            <div className="flex gap-4 pt-6">
              <div className="h-12 flex-1 rounded-xl bg-pink-200 dark:bg-pink-900/40" />
              <div className="h-12 flex-1 rounded-xl bg-gray-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
