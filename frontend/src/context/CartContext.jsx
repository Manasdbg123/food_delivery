import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { findCoupon, priceBill } from '../lib/pricing';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const STORAGE_KEY = 'foodiehub_cart_v2';
const EMPTY = { restaurant: null, items: [], couponCode: '' };

const readStored = () => {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }; } catch { return EMPTY; }
};

export const CartProvider = ({ children }) => {
  const [state, setState] = useState(readStored);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const api = useMemo(() => {
    const { restaurant, items, couponCode } = state;
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

    return {
      restaurant,
      items,
      itemCount,
      subtotal,
      couponCode,
      bill: priceBill(subtotal, findCoupon(couponCode)),
      quantityOf: (itemId) => items.find((i) => i.id === itemId)?.qty || 0,

      // Returns 'added', or 'conflict' when the cart holds another restaurant's items.
      add(item, fromRestaurant) {
        if (restaurant && items.length && restaurant.id !== fromRestaurant.id) return 'conflict';
        setState((prev) => {
          const existing = prev.items.find((i) => i.id === item.id);
          return {
            ...prev,
            restaurant: pickRestaurant(fromRestaurant),
            items: existing
              ? prev.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
              : [...prev.items, { id: item.id, name: item.name, price: item.price, isVeg: item.isVeg, qty: 1 }],
          };
        });
        return 'added';
      },
      replaceWith(item, fromRestaurant) {
        setState({
          restaurant: pickRestaurant(fromRestaurant),
          items: [{ id: item.id, name: item.name, price: item.price, isVeg: item.isVeg, qty: 1 }],
          couponCode: '',
        });
      },
      setQty(itemId, qty) {
        setState((prev) => {
          const next = prev.items
            .map((i) => (i.id === itemId ? { ...i, qty: Math.max(0, Math.min(20, qty)) } : i))
            .filter((i) => i.qty > 0);
          return next.length ? { ...prev, items: next } : EMPTY;
        });
      },
      // Load a whole previous order at once (reorder), replacing whatever is in the cart.
      loadOrder(fromRestaurant, orderItems) {
        setState({
          restaurant: pickRestaurant(fromRestaurant),
          items: orderItems.map((i) => ({ id: i.id, name: i.name, price: i.price, isVeg: i.isVeg, qty: Math.max(1, Math.min(20, i.qty)) })),
          couponCode: '',
        });
      },
      applyCoupon: (code) => setState((prev) => ({ ...prev, couponCode: (code || '').trim().toUpperCase() })),
      clear: () => setState(EMPTY),
    };
  }, [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
};

const pickRestaurant = (r) => ({
  id: r.id, name: r.name, area: r.area, city: r.city, imageUrl: r.imageUrl,
  avgDeliveryTimeMinutes: r.avgDeliveryTimeMinutes,
});
