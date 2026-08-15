import type { ProductResponseDto } from "@/types/product.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export interface CartItem {
  product: ProductResponseDto;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  storeId: string | null;
}

function loadCartFromStorage(): CartState {
  try {
    const savedItems = localStorage.getItem("cart_items");
    const savedStoreId = localStorage.getItem("cart_store_id");
    const items: CartItem[] = savedItems ? JSON.parse(savedItems) : [];
    return {
      items,
      storeId: savedStoreId || (items.length > 0 ? items[0].product.storeId : null),
    };
  } catch {
    return {
      items: [],
      storeId: null,
    };
  }
}

const initialState: CartState = loadCartFromStorage();

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: ProductResponseDto; quantity?: number }>
    ) => {
      const { product, quantity = 1 } = action.payload;

      // If cart has items from a different store, reset cart to new store
      if (state.storeId && state.storeId !== product.storeId && state.items.length > 0) {
        state.items = [{ product, quantity }];
        state.storeId = product.storeId;
      } else {
        state.storeId = product.storeId;
        const existingItem = state.items.find((item) => item.product.id === product.id);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          state.items.push({ product, quantity });
        }
      }

      localStorage.setItem("cart_items", JSON.stringify(state.items));
      if (state.storeId) {
        localStorage.setItem("cart_store_id", state.storeId);
      }
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const existingItem = state.items.find((item) => item.product.id === productId);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.product.id !== productId);
        }
      }

      if (state.items.length === 0) {
        state.storeId = null;
        localStorage.removeItem("cart_store_id");
      }

      localStorage.setItem("cart_items", JSON.stringify(state.items));
    },

    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== productId);
      } else {
        const item = state.items.find((i) => i.product.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }

      if (state.items.length === 0) {
        state.storeId = null;
        localStorage.removeItem("cart_store_id");
      }

      localStorage.setItem("cart_items", JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      if (state.items.length === 0) {
        state.storeId = null;
        localStorage.removeItem("cart_store_id");
      }
      localStorage.setItem("cart_items", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.storeId = null;
      localStorage.removeItem("cart_items");
      localStorage.removeItem("cart_store_id");
    },
  },
});

export const { addToCart, decreaseQuantity, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStoreId = (state: RootState) => state.cart.storeId;
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

export default cartSlice.reducer;
