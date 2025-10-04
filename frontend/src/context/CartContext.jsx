import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const storageKey = user ? `cart:${user.id || user._id}` : 'cart:guest';
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });

  // Persist per-user cart locally
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  // When user changes, load from appropriate storage and sync from backend if authenticated
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setItems(Array.isArray(saved) ? saved : []);
    } catch {
      setItems([]);
    }
    const hydrateFromBackend = async () => {
      if (!user) return;
      try {
        const { data } = await api.get('/cart');
        const products = data?.cart?.products || [];
        // Hydrate product details
        const fetched = await Promise.all(products.map(async (entry) => {
          try {
            const { data: prod } = await api.get(`/products/${entry.productId}`);
            return { product: prod, quantity: entry.quantity };
          } catch {
            return null;
          }
        }));
        const hydrated = fetched.filter(Boolean);
        if (hydrated.length) setItems(hydrated);
      } catch {
        // ignore
      }
    };
    hydrateFromBackend();
  }, [user, storageKey]);

  const addItem = async (product, quantity = 1) => {
    setItems(prev => {
      const pid = product.id || product._id;
      const existing = prev.find(i => (i.product.id || i.product._id) === pid);
      if (existing) {
        return prev.map(i => ((i.product.id || i.product._id) === pid) ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, quantity }];
    });
    if (user) {
      const productId = product._id || product.id;
      try { await api.post('/cart', { productId, quantity }); } catch { /* ignore */ }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setItems(prev => prev.map(i => ((i.product.id || i.product._id) === productId) ? { ...i, quantity } : i));
    if (user) {
      const pid = productId;
      try { await api.put(`/cart/${pid}`, { quantity }); } catch { /* ignore */ }
    }
  };

  const removeItem = async (productId) => {
    setItems(prev => prev.filter(i => (i.product.id || i.product._id) !== productId));
    if (user) {
      const pid = productId;
      try { await api.delete(`/cart/${pid}`); } catch { /* ignore */ }
    }
  };

  const clear = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, clear, subtotal }), [items, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}


