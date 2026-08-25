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
 * Normalizes a category name for comparison
 */
function normalizeCatName(str) {
  if (!str) return ''
  return String(str)
    .replace(/^cat_/, '')
    .replace(/_/g, ' ')
    .trim()
    .toLowerCase()
}

/**
 * Ensures all studio categories are present in the backend database.
 * If any standard category is missing and admin token is available, creates it in MongoDB.
 */
export async function syncAndFetchCategories(existingCategories = []) {
  const adminToken = localStorage.getItem('slv_admin_token')
  let currentList = Array.isArray(existingCategories) ? [...existingCategories] : []

  // If no categories passed, fetch from backend
  if (currentList.length === 0) {
    try {
      const res = await api.get('/categories')
      if (res.data?.categories && Array.isArray(res.data.categories)) {
        currentList = res.data.categories
      }
    } catch (e) {
      console.warn('Could not fetch categories from server:', e.message)
    }
  }

  const existingNames = new Set(
    currentList
      .filter((c) => /^[0-9a-fA-F]{24}$/.test(c?._id))
      .map((c) => normalizeCatName(c?.name))
  )

  if (adminToken) {
    for (const std of STUDIO_CATEGORIES) {
      const norm = normalizeCatName(std.name)
      if (!existingNames.has(norm)) {
        try {
          const res = await api.post(
            '/categories',
            { name: std.name, description: std.description },
            { headers: { Authorization: `Bearer ${adminToken}` } }
          )
          if (res.data?.category?._id) {
            currentList.push(res.data.category)
            existingNames.add(norm)
          }
        } catch (err) {
          // If category already exists or duplicate slug error, re-fetch categories to get its _id
          try {
            const refreshRes = await api.get('/categories')
            if (refreshRes.data?.categories) {
              const matched = refreshRes.data.categories.find(
                (c) => normalizeCatName(c.name) === norm
              )
              if (matched && /^[0-9a-fA-F]{24}$/.test(matched._id)) {
                currentList.push(matched)
                existingNames.add(norm)
              }
            }
          } catch (e) {}
        }
      }
    }
  }

  // Add client-side visual fallback with accurate name if anything was unable to sync
  const finalList = []
  const addedNames = new Set()

  // First add all valid MongoDB categories
  for (const cat of currentList) {
    const norm = normalizeCatName(cat.name)
    if (!addedNames.has(norm)) {
      finalList.push(cat)
      addedNames.add(norm)
    }
  }

  // Then add any missing standard categories
  for (const std of STUDIO_CATEGORIES) {
    const norm = normalizeCatName(std.name)
    if (!addedNames.has(norm)) {
      finalList.push({
        _id: 'cat_' + std.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
        name: std.name,
        description: std.description,
        isFallback: true,
      })
      addedNames.add(norm)
    }
  }

  return finalList
}

/**
 * Ensures a category exists in the backend DB before product creation.
 * Returns the permanent MongoDB _id.
 */
export async function resolveCategoryId(categoryInput, categoriesList = []) {
  if (!categoryInput) return ''

  // 1. If already a valid 24-hex MongoDB ObjectId
  if (/^[0-9a-fA-F]{24}$/.test(categoryInput)) {
    return categoryInput
  }

  const inputNorm = normalizeCatName(categoryInput)

  // 2. Search in current memory categories list
  const found = (categoriesList || []).find(
    (c) =>
      c._id === categoryInput ||
      normalizeCatName(c.name) === inputNorm ||
      normalizeCatName(c._id) === inputNorm
  )

  if (found && /^[0-9a-fA-F]{24}$/.test(found._id)) {
    return found._id
  }

  // 3. Query backend /categories to check if it's already in DB
  try {
    const res = await api.get('/categories')
    const dbCats = res.data?.categories || []
    const dbMatch = dbCats.find(
      (c) =>
        normalizeCatName(c.name) === inputNorm ||
        c._id === categoryInput ||
        (c.slug && c.slug.toLowerCase() === inputNorm)
    )
    if (dbMatch && /^[0-9a-fA-F]{24}$/.test(dbMatch._id)) {
      return dbMatch._id
    }
  } catch (err) {
    console.warn('Could not query categories during resolution:', err.message)
  }

  // 4. If not found in DB, auto-create it now using admin credentials
  const adminToken = localStorage.getItem('slv_admin_token')
  const std = STUDIO_CATEGORIES.find((s) => normalizeCatName(s.name) === inputNorm)
  const categoryName = std ? std.name : (found?.name || categoryInput.replace(/^cat_/, '').replace(/_/g, ' '))
  const description = std ? std.description : `${categoryName} Collection`

  if (adminToken) {
    try {
      const createRes = await api.post(
        '/categories',
        { name: categoryName, description },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      )
      if (createRes.data?.category?._id && /^[0-9a-fA-F]{24}$/.test(createRes.data.category._id)) {
        return createRes.data.category._id
      }
    } catch (createErr) {
      // If error was duplicate key or race condition, query DB once more
      try {
        const finalRes = await api.get('/categories')
        const finalCats = finalRes.data?.categories || []
        const finalMatch = finalCats.find((c) => normalizeCatName(c.name) === inputNorm)
        if (finalMatch && /^[0-9a-fA-F]{24}$/.test(finalMatch._id)) {
          return finalMatch._id
        }
      } catch (e) {}
    }
  }

  // If all resolution fails, try returning the first valid category ID from DB or list
  const fallbackCat = (categoriesList || []).find((c) => /^[0-9a-fA-F]{24}$/.test(c?._id))
  if (fallbackCat) return fallbackCat._id

  return /^[0-9a-fA-F]{24}$/.test(categoryInput) ? categoryInput : ''
}
