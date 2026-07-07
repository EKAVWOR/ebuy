// src/store/slices/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  platformFee: 0,
  total: 0,
  loading: false
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      const { cart, summary } = action.payload;
      state.items = cart?.items || [];
      state.itemCount = summary?.itemCount || 0;
      state.subtotal = summary?.subtotal || 0;
      state.platformFee = summary?.platformFee || 0;
      state.total = summary?.total || 0;
    },
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.subtotal = 0;
      state.platformFee = 0;
      state.total = 0;
    },
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setCart, clearCart, setCartLoading } = cartSlice.actions;
export default cartSlice.reducer;