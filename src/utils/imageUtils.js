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

  // Cloudinary or external absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Ensure leading slash for relative upload paths
  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  // Resolve backend origin
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const backendBase = apiUrl.replace(/\/api\/?$/, '');

  return `${backendBase}${cleanPath}`;
};
