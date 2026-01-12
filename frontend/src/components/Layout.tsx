import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingBag, X, Heart, Plus, Minus, Truck } from 'lucide-react';
import UserButton from './UserButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const { user } = useAuth();
  const {
    itemCount,
    setIsCartOpen,
    isCartOpen,
    items,
    removeFromCart,
    cartTotal,
    updateQuantity
  } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const shippingThreshold = 200;
  const shippingProgress = Math.min((cartTotal / shippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(shippingThreshold - cartTotal, 0);

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-primary/90 backdrop-blur-lg border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="text-2xl font-serif font-semibold tracking-tight">
              LUXE<span className="text-accent">.</span>
            </Link>

            <div className="flex items-center gap-4">
              {user ? (
                <UserButton />
              ) : (
                <Link to="/login" className="btn-ghost">
                  Sign In
                </Link>
              )}

              {!isAdminPage && (
                <>
                  {/* Wishlist Icon */}
                  <Link
                    to="/wishlist"
                    className="relative p-2.5 hover:bg-glass rounded-full transition-colors"
                  >
                    <Heart size={20} className="text-text" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-accent text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Cart Icon */}
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2.5 hover:bg-glass rounded-full transition-colors"
                  >
                    <ShoppingBag size={20} className="text-text" />
                    {itemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-accent text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-glass-border py-16 mt-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-4">
                LUXE<span className="text-accent">.</span>
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Curated luxury fashion for the modern individual.
                Timeless elegance, exceptional quality.
              </p>
            </div>
            <div>
              <h5 className="text-text-secondary mb-4">Shop</h5>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/" className="hover:text-accent transition-colors">New Arrivals</Link></li>
                <li><Link to="/" className="hover:text-accent transition-colors">Best Sellers</Link></li>
                <li><Link to="/" className="hover:text-accent transition-colors">Collections</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-text-secondary mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="#" className="hover:text-accent transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-text-secondary mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-glass-border pt-8 text-center">
            <p className="text-muted text-sm">© 2026 LUXE Fashion. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-60"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-secondary border-l border-glass-border z-70 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-glass-border">
                <h2 className="text-xl font-serif font-semibold">Shopping Bag</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-glass rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free Shipping Progress */}
              {items.length > 0 && (
                <div className="px-6 py-4 bg-glass border-b border-glass-border">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Truck size={16} className="text-accent" />
                    {remainingForFreeShipping > 0 ? (
                      <span className="text-text-secondary">
                        Add <span className="text-accent font-medium">${remainingForFreeShipping.toFixed(2)}</span> for free shipping
                      </span>
                    ) : (
                      <span className="text-success">You've unlocked free shipping!</span>
                    )}
                  </div>
                  <div className="h-1 bg-tertiary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingProgress}%` }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Cart Items */}
              <div className="grow overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag size={48} className="mx-auto text-muted mb-4" />
                    <p className="text-muted">Your bag is empty</p>
                    <button
                      onClick={() => { setIsCartOpen(false); navigate('/'); }}
                      className="mt-4 btn-ghost text-accent"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4"
                    >
                      <div className="w-20 h-24 bg-tertiary rounded overflow-hidden shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grow min-w-0">
                        <h3 className="font-medium text-text truncate">{item.name}</h3>
                        <p className="text-accent font-serif mt-1">${Number(item.price).toFixed(2)}</p>

                        <div className="flex justify-between items-center mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-tertiary rounded">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1.5 hover:bg-glass rounded transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-glass rounded transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-muted hover:text-error transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-glass-border bg-tertiary">
                  <div className="flex justify-between text-lg font-serif mb-4">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                    className="w-full btn-accent"
                  >
                    Checkout
                  </button>
                  <p className="text-center text-xs text-muted mt-4">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
