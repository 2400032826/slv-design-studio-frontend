import api from '../api/axios'

export const MASTER_INITIAL_GALLERY = [
  {
    _id: 'gallery_init_1',
    title: 'Bridal Maggam Design',
    category: 'embroidery',
    description: 'Heavy peacock motif embroidery with stone work',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800',
    isFeatured: true,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'gallery_init_2',
    title: 'Custom Fabric Printing Showcase',
    category: 'printing',
    description: 'High resolution digital silk dupatta printing',
    url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800',
    isFeatured: true,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'gallery_init_3',
    title: 'Designer Velvet Blouse Stitching',
    category: 'stitching',
    description: 'Deep back designer cut with padded lining',
    url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800',
    isFeatured: true,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'gallery_init_4',
    title: 'South Indian Silk Zari Saree',
    category: 'wedding',
    description: 'Grand Kanjivaram zari borders and customized tasseling',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800',
    isFeatured: true,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'gallery_init_5',
    title: 'Gold Zardosi Bridal Needlework',
    category: 'bridal',
    description: '3D gold zardosi with cutdana and stone accents',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800',
    isFeatured: true,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'gallery_init_6',
    title: '1-Gram Gold Bridal Choker Set',
    category: 'jewellery',
    description: 'Traditional temple jewelry collection for weddings',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800',
    isFeatured: true,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'gallery_init_7',
    title: 'Royal Wedding Lehenga Ensemble',
    category: 'bridal',
    description: 'Heavy flared lehenga with hand-embroidered Maggam motifs',
    url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=800',
    isFeatured: true,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'gallery_init_8',
    title: 'Custom Apparel Logo Embroidery & DTF',
    category: 'printing',
    description: 'High definition heat-press transfers and brand embroidery',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800',
    isFeatured: true,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
]

const STORAGE_KEYS = {
  LOCAL_ITEMS: 'slv_local_gallery_items',
  DELETED_IDS: 'slv_deleted_gallery_ids',
  UPDATES: 'slv_gallery_item_updates',
}

const getStored = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage error:', e)
  }
}

/**
 * Fetch and merge all gallery items from API + Baseline master collection + Local persistent additions
 */
export async function getUnifiedGalleryItems(categoryFilter = 'all') {
  let serverItems = []
  try {
    const res = await api.get('/gallery?limit=100')
    if (res.data && Array.isArray(res.data.items)) {
      serverItems = res.data.items
    }
  } catch (err) {
    console.warn('Could not fetch server gallery:', err.message)
  }

  const localItems = getStored(STORAGE_KEYS.LOCAL_ITEMS, [])
  const deletedIds = new Set(getStored(STORAGE_KEYS.DELETED_IDS, []))
  const updates = getStored(STORAGE_KEYS.UPDATES, {})

  const map = new Map()

  // 1. Add baseline collection
  MASTER_INITIAL_GALLERY.forEach((item) => {
    map.set(item._id, { ...item })
  })

  // 2. Merge server items
  serverItems.forEach((item) => {
    let matchedId = item._id
    for (const [key, existing] of map.entries()) {
      if (existing.url && item.url && existing.url.split('?')[0] === item.url.split('?')[0]) {
        matchedId = key
        break
      }
    }
    map.set(matchedId, { ...map.get(matchedId), ...item, _id: item._id })
  })

  // 3. Merge custom local uploads
  localItems.forEach((item) => {
    map.set(item._id, { ...item })
  })

  // 4. Filter deleted and apply updates
  const result = []
  for (const [id, item] of map.entries()) {
    if (deletedIds.has(id) || deletedIds.has(item._id)) {
      continue
    }

    const itemUpdate = updates[id] || updates[item._id] || {}
    const merged = { ...item, ...itemUpdate }

    if (categoryFilter === 'all' || merged.category?.toLowerCase() === categoryFilter.toLowerCase()) {
      result.push(merged)
    }
  }

  return result
}

/**
 * Add a newly uploaded image to the gallery
 */
export async function addGalleryItem({ title, category, file, fileUrl }) {
  const adminToken = localStorage.getItem('slv_admin_token')
  let uploadedServerItem = null

  if (file && adminToken) {
    try {
      const formData = new FormData()
      formData.append('media', file)
      formData.append('category', category)
      if (title) formData.append('title', title)

      const res = await api.post('/gallery', formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      if (res.data?.items?.[0]) {
        uploadedServerItem = res.data.items[0]
      }
    } catch (err) {
      console.warn('Server upload error:', err.message)
    }
  }

  const newItem = uploadedServerItem || {
    _id: `custom_gal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    title: title || 'Custom Atelier Creation',
    category: category || 'embroidery',
    url: fileUrl || (file ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'),
    type: 'image',
    createdAt: new Date().toISOString(),
  }

  const localItems = getStored(STORAGE_KEYS.LOCAL_ITEMS, [])
  setStored(STORAGE_KEYS.LOCAL_ITEMS, [newItem, ...localItems])

  return newItem
}

/**
 * Delete a gallery item
 */
export async function deleteGalleryItem(id) {
  const adminToken = localStorage.getItem('slv_admin_token')
  if (adminToken && !id.startsWith('gallery_init_') && !id.startsWith('custom_gal_')) {
    try {
      await api.delete(`/gallery/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
    } catch (err) {
      console.warn('Server delete error:', err.message)
    }
  }

  const deletedIds = getStored(STORAGE_KEYS.DELETED_IDS, [])
  if (!deletedIds.includes(id)) {
    setStored(STORAGE_KEYS.DELETED_IDS, [...deletedIds, id])
  }

  const localItems = getStored(STORAGE_KEYS.LOCAL_ITEMS, []).filter((item) => item._id !== id)
  setStored(STORAGE_KEYS.LOCAL_ITEMS, localItems)
}

/**
 * Update an item's category or title
 */
export async function updateGalleryItem(id, updates) {
  const adminToken = localStorage.getItem('slv_admin_token')
  if (adminToken && !id.startsWith('gallery_init_') && !id.startsWith('custom_gal_')) {
    try {
      await api.put(`/gallery/${id}`, updates, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
    } catch (err) {
      console.warn('Server update error:', err.message)
    }
  }

  const currentUpdates = getStored(STORAGE_KEYS.UPDATES, {})
  currentUpdates[id] = { ...(currentUpdates[id] || {}), ...updates }
  setStored(STORAGE_KEYS.UPDATES, currentUpdates)
}