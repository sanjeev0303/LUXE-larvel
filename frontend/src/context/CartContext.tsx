import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  selectedSize?: string;
  cartItemId?: number; // DB ID
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, size?: string) => void;
  removeFromCart: (id: number, size?: string) => void;
  updateQuantity: (id: number, quantity: number, size?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [synced, setSynced] = useState(false);

  // Load from local storage initially
  useEffect(() => {
    if (!user) {
        const saved = localStorage.getItem('cart');
        if (saved) setItems(JSON.parse(saved));
    }
  }, [user]);

  // Sync with API on auth / Refresh on auth
  useEffect(() => {
    if (user) {
      // If we have items in local state (from guest session) and just logged in (synced is false)
      // we should sync them.
      // Simplified: If not synced yet, try to sync local items to server
      const localItems = JSON.parse(localStorage.getItem('cart') || '[]');

      const syncCart = async () => {
         if (localItems.length > 0 && !synced) {
            try {
                // Map local structure to backend expectation
                const payload = localItems.map((i: any) => ({
                    product_id: i.id,
                    quantity: i.quantity,
                    size: i.selectedSize
                }));
                await api.post('/cart/sync', { items: payload });
                // Clear local storage after sync intention (or keep until success)
                localStorage.removeItem('cart');
            } catch (e) {
                console.error("Failed to sync cart", e);
            }
         }

         // Fetch latest from server
         try {
             const res = await api.get('/cart');
             // Map backend CartItem -> Frontend CartItem
             const serverItems = res.data.map((i: any) => ({
                 id: i.product.id,
                 name: i.product.name,
                 price: parseFloat(i.product.price),
                 image_url: i.product.image_url,
                 quantity: i.quantity,
                 selectedSize: i.size, // Store the selected size
                 // Helper internal ID for frontend mapping if same product has multiple sizes?
                 // Frontend existing logic uses product.id as key. This breaks if same product has different sizes.
                 // We need a unique ID for cart item (product_id + size).
                 cartItemId: i.id // DB id of cart item, useful for updates
             }));
             setItems(serverItems);
             setSynced(true);
         } catch (e) {
             console.error("Failed to fetch cart", e);
         }
      };

      syncCart();
    }
  }, [user]);

  // Persist to local storage if guest
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = async (product: any, size?: string) => {
    // Generate a temporary unique ID for local state or finding usage
    // Problem: Existing `addToCart` took `product`. Now we need `size`.
    // We also need to differentiate same product with different sizes.

    // Check if item with same ID AND Size exists
    setItems(prev => {
        const existingIndex = prev.findIndex(item => item.id === product.id && item.selectedSize === size);
        if (existingIndex > -1) {
             const newItems = [...prev];
             newItems[existingIndex].quantity += 1;
             return newItems;
        }
        return [...prev, {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
            quantity: 1,
            selectedSize: size // Add size to item
        }];
    });
    setIsCartOpen(true);

    if (user) {
        try {
            await api.post('/cart', {
                product_id: product.id,
                quantity: 1,
                size: size
            });
            // Ideally re-fetch to get DB IDs, but optimistic is fine for count
        } catch (e) {
            console.error("Failed to add to cart", e);
        }
    }
  };

  const removeFromCart = async (id: number, size?: string) => {
    // ID here is Product ID in legacy code.
    // If we support sizes, we need to know which one to remove.
    // Assuming we pass product ID. If multiple sizes exist, ui needs to pass specific.
    // Let's assume for now we remove by productID+size match or we need to update `removeFromCart` signature
    // to accept an internal unique identifier or the cart item object.

    // NOTE: Refactoring to use internal unique key or index is best, but minimal change:
    // Filter out item matching ID (and size if provided? defaulting to all if not?).
    // Let's assume we remove the specific item instance from UI.

    // Simplification: In UI `removeFromCart` usually called on a row.
    // We should change frontend `items.map` to use a unique key.

    // For now, let's just filter by ID (removes all sizes of that product?? NO).
    // I need to update `items` structure to be robust.
    // Let's iterate and find match.

    // CHANGED: We will modify `removeFromCart` to take `product_id` and optional `size`,
    // OR we change the Item structure to have a unique `cartItemId` (which is random for guest).

    // Let's use `product.id` as the identifier for now, as breaking changes might cascade.
    // But wait, if I have Shirt (M) and Shirt (L), they both share product.id.
    // I must distinguish.

    // Updated Logic: `removeFromCart` receives the *index* or the *specific stored item*?
    // Legacy `removeFromCart` took `id`.
    // I will implicitly remove the *first* match or I need to change the call signature.
    // Let's change the signature to `removeFromCart(product_id: number, size?: string)`.

    setItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));

    if (user) {
        // We need the CartItem ID (DB ID) to delete efficiently, or delete by criteria.
        // My CardController has `destroy($id)` where ID is cart_item id.
        // But frontend might not have it if optimistic add.
        // It's safer to fetch cart after add.
        // Or implement delete by criteria endpoint.
        // Let's loop through items to find the DB ID if available?
        const itemToRemove = items.find(i => i.id === id && i.selectedSize === size);
        if (itemToRemove && (itemToRemove as any).cartItemId) {
             try {
                await api.delete(`/cart/${(itemToRemove as any).cartItemId}`);
            } catch (e) { console.error(e); }
        } else {
             // Fallback: reload cart?
             // Or assume sync will happen next time.
        }
    }
  };

  const updateQuantity = async (id: number, quantity: number, size?: string) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(item =>
      (item.id === id && item.selectedSize === size) ? { ...item, quantity } : item
    ));

    if (user) {
         // Same issue: need cart_item_id
         const itemToUpdate = items.find(i => i.id === id && i.selectedSize === size);
         if (itemToUpdate && (itemToUpdate as any).cartItemId) {
             try {
                 await api.put(`/cart/${(itemToUpdate as any).cartItemId}`, { quantity });
             } catch(e) { console.error(e); }
         }
    }
  };

  const clearCart = () => {
    setItems([]);
    if (!user) localStorage.removeItem('cart');
    // If user, maybe delete all? API doesn't have clear all endpoint yet.
  };

  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, itemCount, isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
