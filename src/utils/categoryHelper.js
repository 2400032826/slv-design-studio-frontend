import api from '../api/axios'

export const STUDIO_CATEGORIES = [
  { name: 'Bridal Embroidery', description: 'Handcrafted premium bridal blouse & saree embroidery' },
  { name: 'Sarees', description: 'Silk, designer, and festive traditional sarees' },
  { name: 'Blouses', description: 'Custom tailored & designer bridal blouses' },
  { name: 'Custom Embroidery', description: 'Personalized multi-thread and computer embroidery' },
  { name: 'Maggam Work', description: 'Authentic handmade Zari, Aari & Maggam craft' },
  { name: 'Bridal & Fashion Wear', description: 'Lehengas, kurtis, gowns, and wedding ensembles' },
  { name: 'Custom Printing', description: 'DTF, heat press, and digital apparel printing' },
  { name: '1 Gram Gold Jewellery', description: 'Bridal & traditional 1 gram gold fashion jewelry' },
  { name: 'Personalised Gifts', description: 'Custom printed & embroidered gifts and accessories' },
]

/**
 * Ensures all studio categories are present in the backend database.
 * If any standard category is missing and admin token is available, creates it in MongoDB.
 */
export async function syncAndFetchCategories(existingCategories = []) {
  const adminToken = localStorage.getItem('slv_admin_token')
  let currentList = Array.isArray(existingCategories) ? [...existingCategories] : []

  const existingNames = new Set(currentList.map((c) => (c?.name || '').trim().toLowerCase()))

  if (adminToken) {
    for (const std of STUDIO_CATEGORIES) {
      if (!existingNames.has(std.name.toLowerCase())) {
        try {
          const res = await api.post(
            '/categories',
            { name: std.name, description: std.description },
            { headers: { Authorization: Bearer  } }
          )
          if (res.data?.category) {
            currentList.push(res.data.category)
            existingNames.add(std.name.toLowerCase())
          }
        } catch (err) {
          console.warn('Category sync notice for \"' + std.name + '\":', err.response?.data?.message || err.message)
        }
      }
    }
  }

  for (const std of STUDIO_CATEGORIES) {
    if (!existingNames.has(std.name.toLowerCase())) {
      currentList.push({
        _id: 'cat_' + std.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
        name: std.name,
        description: std.description,
        isFallback: true,
      })
      existingNames.add(std.name.toLowerCase())
    }
  }

  return currentList
}

/**
 * Ensures a category exists in the backend DB before product creation.
 * Returns the permanent MongoDB _id.
 */
export async function resolveCategoryId(categoryInput, categoriesList = []) {
  if (!categoryInput) return ''

  if (/^[0-9a-fA-F]{24}$/.test(categoryInput)) {
    return categoryInput
  }

  const found = categoriesList.find(
    (c) => c._id === categoryInput || (c.name && c.name.toLowerCase() === categoryInput.toLowerCase())
  )

  if (found && /^[0-9a-fA-F]{24}$/.test(found._id)) {
    return found._id
  }

  const categoryName = found?.name || categoryInput
  const adminToken = localStorage.getItem('slv_admin_token')

  if (adminToken) {
    try {
      const std = STUDIO_CATEGORIES.find((s) => s.name.toLowerCase() === categoryName.toLowerCase())
      const res = await api.post(
        '/categories',
        {
          name: categoryName,
          description: std?.description || categoryName + ' Collection',
        },
        { headers: { Authorization: Bearer  } }
      )
      if (res.data?.category?._id) {
        return res.data.category._id
      }
    } catch (err) {
      console.warn('Could not auto-create category in DB:', err)
    }
  }

  return categoryInput
}
