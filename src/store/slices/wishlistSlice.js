import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: JSON.parse(localStorage.getItem('slv_wishlist') || '[]'),
  },
  reducers: {
    toggleWishlistItem: (state, action) => {
      const product = action.payload
      const index = state.items.findIndex((p) => p._id === product._id)
      if (index >= 0) {
        state.items.splice(index, 1)
      } else {
        state.items.push(product)
      }
      localStorage.setItem('slv_wishlist', JSON.stringify(state.items))
    },
    setWishlist: (state, action) => {
      state.items = action.payload
      localStorage.setItem('slv_wishlist', JSON.stringify(state.items))
    },
    clearWishlist: (state) => {
      state.items = []
      localStorage.removeItem('slv_wishlist')
    },
  },
})

export const { toggleWishlistItem, setWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
