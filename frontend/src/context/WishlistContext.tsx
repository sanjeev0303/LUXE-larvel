import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  wishlistCount: number;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load initial state based on auth
  useEffect(() => {
    if (user) {
      // Fetch from API
      api.get('/wishlist')
        .then(res => {
            // Map backend structure (wishlist item -> product) to frontend structure
            // Backend returns Wishlist objects with 'product'.
            // Frontend expects WishlistItem (which looks like a product).
            const mappedItems = res.data.map((w: any) => ({
                id: w.product.id,
                name: w.product.name,
                price: parseFloat(w.product.price),
                image_url: w.product.image_url,
                description: w.product.description
            }));
            setItems(mappedItems);
        })
        .catch(console.error);
    } else {
        // Load from local storage
        const saved = localStorage.getItem('wishlist');
        if (saved) setItems(JSON.parse(saved));
        else setItems([]);
    }
  }, [user]); // Re-run when auth state changes

  // Persist to local storage only if guest
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  }, [items, user]);

  const addToWishlist = async (item: WishlistItem) => {
    // Optimistic update
    const alreadyExists = items.find((i) => i.id === item.id);
    if (alreadyExists) return;

    const newItems = [...items, item];
    setItems(newItems);

    if (user) {
        try {
            await api.post('/wishlist/toggle', { product_id: item.id });
        } catch (e) {
            console.error("Failed to sync wishlist", e);
            // Revert on failure? For now, let's just keep UI state.
        }
    }
  };

  const removeFromWishlist = async (id: number) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);

    if (user) {
        try {
            await api.post('/wishlist/toggle', { product_id: id });
        } catch (e) {
            console.error("Failed to remove from wishlist", e);
        }
    }
  };

  const isInWishlist = (id: number) => {
    return items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setItems([]);
    if (!user) localStorage.removeItem('wishlist');
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: items.length,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
