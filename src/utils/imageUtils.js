/**
 * Helper to resolve complete image URLs for Cloudinary and local disk uploads.
 * Ensures images load properly in production and development environments.
 */
export const getImageUrl = (image) => {
  if (!image) return null;

  let url = '';
  if (typeof image === 'string') {
    url = image;
  } else if (typeof image === 'object' && image !== null) {
    url = image.url || image.path || '';
  }

  if (!url || typeof url !== 'string') return null;

  const RENDER_BACKEND_HOST = 'https://slv-design-studio-backend.onrender.com';

  // Cloudinary or external absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If an image URL stored in DB contains localhost:5000, rewrite it to Render backend host
    if (url.includes('localhost:5000') || url.includes('127.0.0.1:5000')) {
      return url.replace(/https?:\/\/(localhost|127\.0\.0\.1):5000/, RENDER_BACKEND_HOST);
    }
    return url;
  }

  // Ensure leading slash for relative upload paths
  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  // Resolve backend origin dynamically
  let apiUrl = import.meta.env.VITE_API_URL;
  const isProductionHost =
    import.meta.env.PROD ||
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

  if (isProductionHost || !apiUrl || apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
    apiUrl = `${RENDER_BACKEND_HOST}/api`;
  }

  const baseHost = apiUrl.replace(/\/api\/?$/, '');

  return `${baseHost}${cleanPath}`;
};
