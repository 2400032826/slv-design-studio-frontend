import { createSlice } from '@reduxjs/toolkit'

const getStoredCart = () => {
  try {
    const cart = localStorage.getItem('slv_cart')
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getStoredCart(),
    isOpen: false,
    validationMap: {},
    isValidating: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, size, color, customization } = action.payload
      const existingIndex = state.items.findIndex(
        (item) => item.product._id === product._id && item.size === size && item.color === color
      )
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity
      } else {
        state.items.push({ product, quantity, size, color, customization })
      }
      localStorage.setItem('slv_cart', JSON.stringify(state.items))
    },
    removeFromCart: (state, action) => {
      const removedItem = state.items[action.payload]
      state.items = state.items.filter((_, i) => i !== action.payload)
      if (removedItem?.product?._id) {
        delete state.validationMap[removedItem.product._id]
      }
      localStorage.setItem('slv_cart', JSON.stringify(state.items))
    },
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload
      if (quantity <= 0) {
        state.items.splice(index, 1)
      } else {
        state.items[index].quantity = quantity
      }
      localStorage.setItem('slv_cart', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      state.validationMap = {}
      localStorage.removeItem('slv_cart')
    },
    setCartValidation: (state, action) => {
      state.validationMap = action.payload || {}
    },
    setIsValidating: (state, action) => {
      state.isValidating = !!action.payload
    },
    toggleCart: (state) => { state.isOpen = !state.isOpen },
    openCart: (state) => { state.isOpen = true },
    closeCart: (state) => { state.isOpen = false },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartValidation,
  setIsValidating,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions

export default cartSlice.reducer

// Cart total for ONLY valid & available products
export const selectValidCartTotal = (state) => {
  const { items, validationMap } = state.cart
  return items.reduce((total, item, idx) => {
    const key = item.product?._id || item.product?.id || `cart_item_${idx}`
    const val = validationMap[key]
    if (val && (val.status === 'OUT_OF_STOCK' || val.status === 'NO_LONGER_AVAILABLE')) {
      return total
    }
    const price = val?.currentPrice || item.product.offerPrice || item.product.price || 0
    return total + price * item.quantity
  }, 0)
}

// Fallback all items total
export const selectCartTotal = (state) => selectValidCartTotal(state)

export const selectValidCartCount = (state) => {
  const { items, validationMap } = state.cart
  return items.reduce((count, item, idx) => {
    const key = item.product?._id || item.product?.id || `cart_item_${idx}`
    const val = validationMap[key]
    if (val && (val.status === 'OUT_OF_STOCK' || val.status === 'NO_LONGER_AVAILABLE')) {
      return count
    }
    return count + item.quantity
  }, 0)
}

export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0)

export const selectHasInvalidCartItems = (state) => {
  const { items, validationMap } = state.cart
  return items.some((item, idx) => {
    const key = item.product?._id || item.product?.id || `cart_item_${idx}`
    const val = validationMap[key]
    return val && (val.status === 'OUT_OF_STOCK' || val.status === 'NO_LONGER_AVAILABLE')
  })
}

