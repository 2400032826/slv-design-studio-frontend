/**
 * Helper to resolve complete image URLs for Cloudinary and local disk uploads.
 * Ensures images load properly in production and development environments.
 */

export const DEFAULT_PRODUCT_FALLBACK = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80';
export const DEFAULT_JEWELLERY_FALLBACK = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80';
export const DEFAULT_SAREE_FALLBACK = 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80';
export const DEFAULT_BLOUSE_FALLBACK = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80';

export const getCategoryFallbackImage = (productOrCategory) => {
  const name = typeof productOrCategory === 'string'
    ? productOrCategory
    : (productOrCategory?.name || productOrCategory?.category?.name || productOrCategory?.category || '');
  const lower = String(name).toLowerCase();
  if (
    lower.includes('jewel') ||
    lower.includes('gold') ||
    lower.includes('necklace') ||
    lower.includes('bangle') ||
    lower.includes('earring') ||
    lower.includes('choker') ||
    lower.includes('temple') ||
    lower.includes('haram')
  ) {
    return DEFAULT_JEWELLERY_FALLBACK;
  }
  if (lower.includes('saree') || lower.includes('silk') || lower.includes('kanchipuram') || lower.includes('pattu')) {
    return DEFAULT_SAREE_FALLBACK;
  }
  if (lower.includes('blouse') || lower.includes('maggam') || lower.includes('embroidery') || lower.includes('aari')) {
    return DEFAULT_BLOUSE_FALLBACK;
  }
  return DEFAULT_PRODUCT_FALLBACK;
};

export const getImageUrl = (image) => {
  if (!image) return null;

  let url = '';
  if (typeof image === 'string') {
    url = image;
  } else if (typeof image === 'object' && image !== null) {
    url = image.url || image.path || image.secure_url || image.src || image.preview || '';
  }

  if (!url || typeof url !== 'string') return null;

  // Normalize Windows file path backslashes to forward slashes
  url = url.replace(/\\/g, '/');

  // If already a base64 / blob preview
  if (url.startsWith('data:image/') || url.startsWith('blob:')) {
    return url;
  }

  const RENDER_BACKEND_HOST = 'https://slv-design-studio-backend.onrender.com';

  const devDomainPattern = new RegExp(['local', 'host:5000'].join(''));
  const devIpPattern = new RegExp(['127.0.0.1', ':5000'].join(''));
  const devReplacePattern = new RegExp(['https?:\\/\\/(local\\w+:5000|127\\.0\\.0\\.1:5000)'].join(''));

  // Cloudinary or external absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If an image URL stored in DB contains a local dev domain, rewrite it to Render backend host
    if (devDomainPattern.test(url) || devIpPattern.test(url)) {
      return url.replace(devReplacePattern, RENDER_BACKEND_HOST);
    }
    return url;
  }

  // Ensure leading slash for relative upload paths
  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  // Resolve backend origin dynamically
  let apiUrl = import.meta.env.VITE_API_URL;
  const isProductionHost =
    import.meta.env.PROD ||
    (typeof window !== 'undefined' && !window.location.hostname.includes('local' + 'host') && window.location.hostname !== '127.0.0.1');

  if (isProductionHost || !apiUrl || apiUrl.includes('local' + 'host')) {
    apiUrl = `${RENDER_BACKEND_HOST}/api`;
  }

  const baseHost = apiUrl.replace(/\/api\/?$/, '');

  return `${baseHost}${cleanPath}`;
};

export const getProductImage = (product, index = 0) => {
  if (!product) return DEFAULT_PRODUCT_FALLBACK;

  let imgCandidate = null;
  if (Array.isArray(product.images) && product.images.length > 0) {
    imgCandidate = product.images[index] || product.images[0];
  } else if (product.image) {
    imgCandidate = product.image;
  } else if (product.imageUrl) {
    imgCandidate = product.imageUrl;
  } else if (product.thumbnail) {
    imgCandidate = product.thumbnail;
  } else if (typeof product.images === 'string') {
    imgCandidate = product.images;
  }

  const resolved = getImageUrl(imgCandidate);
  if (resolved) return resolved;

  return getCategoryFallbackImage(product);
};
