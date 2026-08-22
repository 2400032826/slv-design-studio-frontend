import { useState, useEffect } from 'react'
import { DEFAULT_PRODUCT_FALLBACK, optimizeImageUrl } from '../../utils/imageUtils'

/**
 * Premium OptimizedImage component
 * - Shimmer skeleton placeholder matching exact frame dimensions
 * - Progressive compression & modern WebP/AVIF auto-formatting
 * - Native lazy loading with async decoding
 * - Smooth fade-in transition once loaded
 * - Graceful fallback on load error without broken image icons or white space
 */
export default function OptimizedImage({
  src,
  alt = 'Product image',
  className = 'w-full h-full object-cover',
  fallbackSrc = DEFAULT_PRODUCT_FALLBACK,
  priority = false,
  width = 600,
  quality = 75,
  style = {},
  onLoad,
  onError,
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')

  useEffect(() => {
    setIsLoaded(false)
    setHasError(false)
    const optimized = optimizeImageUrl(src || fallbackSrc, { width, quality })
    setCurrentSrc(optimized)
  }, [src, fallbackSrc, width, quality])

  const handleImageLoad = (e) => {
    setIsLoaded(true)
    if (onLoad) onLoad(e)
  }

  const handleImageError = (e) => {
    if (!hasError) {
      setHasError(true)
      const fallbackOptimized = optimizeImageUrl(fallbackSrc, { width, quality })
      setCurrentSrc(fallbackOptimized)
    }
    setIsLoaded(true)
    if (onError) onError(e)
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Shimmer loading skeleton */}
      {!isLoaded && (
        <div
          className="absolute inset-0 z-0 bg-gradient-to-br from-[#F5F7FA] via-pink-50/50 to-[#F5F7FA] dark:from-[#1F2937] dark:via-pink-950/20 dark:to-[#1F2937] animate-shimmer"
          aria-hidden="true"
        />
      )}

      {/* Actual image */}
      <img
        src={currentSrc || fallbackSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`${className} transition-opacity duration-300 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={style}
      />
    </div>
  )
}