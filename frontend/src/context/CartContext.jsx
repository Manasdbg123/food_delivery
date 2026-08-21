import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const STORAGE_KEY = 'foodiehub_cart';

const readStoredCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { restaurantId: null, restaurantName: null, items: [] };
  } catch {
    return { restaurantId: null, restaurantName: null, items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState(() => readStoredCart().restaurantId);
  const [restaurantName, setRestaurantName] = useState(() => readStoredCart().restaurantName);
  const [items, setItems] = useState(() => readStoredCart().items);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ restaurantId, restaurantName, items }));
  }, [restaurantId, restaurantName, items]);

  // Returns 'added' | 'conflict' — caller decides how to surface a conflict
  const addToCart = (item, fromRestaurantId, fromRestaurantName) => {
    if (restaurantId && fromRestaurantId && restaurantId !== fromRestaurantId && items.length > 0) {
      return 'conflict';
    }
    setRestaurantId(fromRestaurantId ?? restaurantId);
    setRestaurantName(fromRestaurantName ?? restaurantName);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    return 'added';
  };

  const replaceCart = (item, fromRestaurantId, fromRestaurantName) => {
    setRestaurantId(fromRestaurantId);
    setRestaurantName(fromRestaurantName);
    setItems([{ ...item, qty: 1 }]);
  };

  const updateQty = (itemId, delta) => {
    setItems((prev) => {
      const next = prev
        .map((i) => (i.id === itemId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0);
      if (next.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
      }
      return next;
    });
  };

  const removeItem = (itemId) => updateQty(itemId, -Infinity);

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
  };

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart: items,
        restaurantId,
        restaurantName,
        itemCount,
        subtotal,
        addToCart,
        replaceCart,
        updateQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
