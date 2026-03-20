import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((i) => i.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload
      const item = state.items.find((i) => i.id === id)
      if (item) {
        item.quantity = quantity
      }
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
