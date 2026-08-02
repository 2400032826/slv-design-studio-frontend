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
      state.items = state.items.filter((_, i) => i !== action.payload)
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
      localStorage.removeItem('slv_cart')
    },
    toggleCart: (state) => { state.isOpen = !state.isOpen },
    openCart: (state) => { state.isOpen = true },
    closeCart: (state) => { state.isOpen = false },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } = cartSlice.actions
export default cartSlice.reducer

export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => {
    const price = item.product.offerPrice || item.product.price
    return total + price * item.quantity
  }, 0)

export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0)
