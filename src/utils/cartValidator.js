import api from '../api/axios'
import { getUnifiedGalleryItems } from './galleryService'

/**
 * Validates cart items against the current live remote production API database.
 * Returns an object mapping item key / ID to validation status:
 * - 'AVAILABLE'
 * - 'OUT_OF_STOCK'
 * - 'NO_LONGER_AVAILABLE'
 */
export async function validateCartItems(items = []) {
  if (!items || items.length === 0) {
    return { validationMap: {}, hasInvalidItems: false, validTotal: 0 }
  }

  // 1. Fetch current live catalog from remote database
  let remoteProducts = []
  try {
    const res = await api.get('/products?limit=100')
    remoteProducts = res.data?.products || []
  } catch (err) {
    console.warn('Cart validator: failed to fetch live catalog:', err.message)
  }

  // 2. Fetch lookbook items as fallback for lookbook custom pieces
  let galleryItems = []
  try {
    galleryItems = await getUnifiedGalleryItems('all')
  } catch (e) {}

  const validationMap = {}
  let hasInvalidItems = false
  let validTotal = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const prod = item.product || {}
    const prodId = prod._id || prod.id
    const key = prodId || `cart_item_${i}`

    // Bespoke customized fitting orders without standard catalog ID
    if (prod.customization && !prodId) {
      validationMap[key] = {
        status: 'AVAILABLE',
        stock: 99,
        message: 'Bespoke custom fitting',
      }
      validTotal += (prod.offerPrice || prod.price || 0) * (item.quantity || 1)
      continue
    }

    // 1. Find product in remote database products
    let remoteMatch = remoteProducts.find(
      (p) =>
        p._id === prodId ||
        p.slug === prodId ||
        p.slug === prod.slug ||
        (p.name && prod.name && p.name.toLowerCase() === prod.name.toLowerCase())
    )

    // If not found in batch list and prodId is a valid ObjectId, try direct GET /products/:id
    if (!remoteMatch && prodId && /^[0-9a-fA-F]{24}$/.test(prodId)) {
      try {
        const directRes = await api.get(`/products/${prodId}`)
        if (directRes.data?.product) {
          remoteMatch = directRes.data.product
        }
      } catch (err) {
        // Direct API returned 404 or error
      }
    }

    if (remoteMatch) {
      const stock = remoteMatch.stock !== undefined ? Number(remoteMatch.stock) : 10
      const isAvailable = remoteMatch.isAvailable !== false

      if (stock <= 0 || !isAvailable) {
        validationMap[key] = {
          status: 'OUT_OF_STOCK',
          stock: 0,
          message: 'Item is currently out of stock',
          product: remoteMatch,
        }
        hasInvalidItems = true
      } else {
        const currentPrice = remoteMatch.offerPrice || remoteMatch.price || prod.offerPrice || prod.price
        validationMap[key] = {
          status: 'AVAILABLE',
          stock,
          currentPrice,
          product: remoteMatch,
        }
        validTotal += currentPrice * (item.quantity || 1)
      }
      continue
    }

    // 2. Check if it's a Lookbook Gallery piece
    const galleryMatch = galleryItems.find((g) => String(g._id) === String(prodId) || String(g.id) === String(prodId))
    if (galleryMatch) {
      validationMap[key] = {
        status: 'AVAILABLE',
        stock: 10,
        message: 'Lookbook bespoke piece',
      }
      validTotal += (prod.offerPrice || prod.price || 1299) * (item.quantity || 1)
      continue
    }

    // 3. Not found in database or gallery => NO_LONGER_AVAILABLE
    validationMap[key] = {
      status: 'NO_LONGER_AVAILABLE',
      stock: 0,
      message: 'Product is no longer available in the catalog',
    }
    hasInvalidItems = true
  }

  return { validationMap, hasInvalidItems, validTotal }
}
