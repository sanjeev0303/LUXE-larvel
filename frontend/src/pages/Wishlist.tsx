import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Skeleton } from '../components/ui/Skeleton';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Heart, ArrowRight } from 'lucide-react';

export default function Wishlist() {
  const { addToCart } = useCart();
  const { items, removeFromWishlist, wishlistCount } = useWishlist();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleMoveToBag = (item: any) => {
    addToCart(item);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(item.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center md:text-left">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-12 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="aspect-3/4 w-full rounded-sm" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h5 className="text-accent mb-2">Saved Items</h5>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold">
            Your Wishlist <span className="text-muted text-2xl font-sans font-normal ml-2">({wishlistCount})</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
              <Heart size={32} className="text-muted" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Your wishlist is empty</h2>
            <p className="text-muted mb-8 max-w-md">
              Save items you love here to review later. Start browsing our collection to find your new favorites.
            </p>
            <Link to="/products" className="btn-primary flex items-center gap-2">
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-secondary border border-glass-border rounded-sm overflow-hidden flex flex-col"
                >
                  <div className="aspect-3/4 relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 bg-primary/80 backdrop-blur-sm rounded-full text-muted hover:text-error hover:bg-white transition-colors z-10 opactiy-0 md:opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>

                    {/* Quick Move Button Overlay (visible on hover) */}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  <div className="p-5 flex flex-col grow">
                    <Link to={`/product/${item.id}`} className="block grow">
                      <h3 className="font-medium text-lg mb-1 hover:text-accent transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xl font-serif text-accent mb-4">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </Link>

                    <button
                      onClick={() => handleMoveToBag(item)}
                      className="btn-outline w-full flex items-center justify-center gap-2 hover:bg-accent hover:border-accent hover:text-primary"
                    >
                      <ShoppingBag size={16} />
                      Add to Bag
                    </button>

                     {/* Mobile Remove Button (visible always on mobile) */}
                     <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="md:hidden text-xs text-muted mt-4 underline self-center"
                      >
                        Remove from Wishlist
                      </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
