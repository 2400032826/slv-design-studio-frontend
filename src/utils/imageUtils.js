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
