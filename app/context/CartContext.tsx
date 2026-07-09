"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;          // unique cart item key = productId + sizeId
  productId: string;
  productSlug: string;
  productTitle: string;
  productImage: string;
  construction: string;
  material: string;
  sizeLabel: string;
  sqft: number;
  unitPrice: number;   // final price per item (after discount)
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QTY"; payload: { id: string; qty: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD":
      return { items: action.payload };
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case "UPDATE_QTY":
      if (action.payload.qty < 1) {
        return { items: state.items.filter((i) => i.id !== action.payload.id) };
      }
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.qty } : i
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fairrugs_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) dispatch({ type: "LOAD", payload: parsed });
      }
    } catch {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("fairrugs_cart", JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, totalItems, subtotal, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
