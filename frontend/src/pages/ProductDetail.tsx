import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'framer-motion';
import { Heart, Truck, Shield, RefreshCw, Minus, Plus, ChevronDown } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  stock: number;
  sizes?: string[]; // Array of size strings
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('details');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data);
      setLoading(false);
    }).catch(() => {
      setProduct({
        id: Number(id),
        name: 'Midnight Velvet Blazer',
        price: 299.99,
        description: 'Crafted from the finest Italian velvet, this blazer embodies timeless sophistication. The slim-fit silhouette is meticulously tailored to create a flattering shape, while the deep midnight blue hue adds an air of mystery and elegance. Perfect for evening events, gallery openings, or making a statement at any occasion.',
        image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
        stock: 12
      });
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    // Check if sizes are available but not selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        alert('Please select a size'); // Ideally use a toast or UI error state
        return;
    }

    for (let i = 0; i < quantity; i++) {
        // Only pass selectedSize if it exists, otherwise undefined (which is optional in hook)
        addToCart(product, selectedSize || undefined);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Skeleton */}
            <Skeleton className="aspect-3/4 w-full rounded-sm h-[600px]" />

            {/* Details Skeleton */}
            <div className="space-y-8">
               <div className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-8 w-32" />
               </div>
               <Skeleton className="h-32 w-full" />
               <div className="flex gap-4">
                  <Skeleton className="h-12 w-1/3" />
                  <Skeleton className="h-12 w-2/3" />
               </div>
            </div>
         </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product!.id);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-muted">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link to="/" className="hover:text-accent transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-text">{product!.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div
              className={`relative aspect-3/4 bg-secondary overflow-hidden cursor-zoom-in ${isImageZoomed ? 'cursor-zoom-out' : ''}`}
              onClick={() => setIsImageZoomed(!isImageZoomed)}
            >
              <motion.img
                src={product!.image_url}
                alt={product!.name}
                className="w-full h-full object-cover"
                animate={{ scale: isImageZoomed ? 1.5 : 1 }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-center text-xs text-muted mt-4">Click to zoom</p>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <span className="badge-accent mb-4">New Arrival</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold mb-4 tracking-tight">
                {product!.name}
              </h1>
              <p className="text-2xl sm:text-3xl text-accent font-serif">
                ${Number(product!.price).toFixed(2)}
              </p>
            </div>

            <p className="text-text-secondary leading-relaxed mb-8">
              {product!.description}
            </p>

            {/* Size Selector */}
            {product?.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-muted uppercase tracking-wider">Size</label>
                        <span className="text-xs text-muted hover:text-text cursor-pointer">Size Guide</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`min-w-12 h-10 px-3 rounded flex items-center justify-center border text-sm font-medium transition-all ${
                                    selectedSize === size
                                        ? 'bg-text text-secondary border-text'
                                        : 'bg-transparent border-glass-border hover:border-text text-text'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm text-muted mb-2 uppercase tracking-wider">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-secondary rounded border border-glass-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-glass transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product!.stock, quantity + 1))}
                    className="p-3 hover:bg-glass transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-muted">
                  {product!.stock > 0 ? `${product!.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product!.stock === 0}
                className="flex-1 btn-accent"
              >
                Add to Bag
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-4 border rounded transition-all duration-300 ${
                  inWishlist
                    ? 'bg-accent-light border-accent text-accent'
                    : 'border-glass-border hover:border-accent hover:text-accent'
                }`}
              >
                <Heart size={20} className={inWishlist ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-glass-border mb-8">
              <div className="text-center">
                <Truck size={20} className="mx-auto text-accent mb-2" />
                <p className="text-xs text-muted">Free Shipping</p>
              </div>
              <div className="text-center">
                <RefreshCw size={20} className="mx-auto text-accent mb-2" />
                <p className="text-xs text-muted">30-Day Returns</p>
              </div>
              <div className="text-center">
                <Shield size={20} className="mx-auto text-accent mb-2" />
                <p className="text-xs text-muted">Authentic</p>
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-4">
              {['details', 'shipping', 'care'].map((section) => (
                <div key={section} className="border-b border-glass-border">
                  <button
                    onClick={() => setExpandedSection(expandedSection === section ? null : section)}
                    className="w-full flex justify-between items-center py-4 text-left"
                  >
                    <span className="font-medium capitalize">{section === 'care' ? 'Care Instructions' : section}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${expandedSection === section ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: expandedSection === section ? 'auto' : 0, opacity: expandedSection === section ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 text-sm text-muted leading-relaxed">
                      {section === 'details' && (
                        <ul className="space-y-2">
                          <li>• Premium Italian velvet</li>
                          <li>• Slim-fit tailored silhouette</li>
                          <li>• Single-button closure</li>
                          <li>• Fully lined interior</li>
                          <li>• Made in Italy</li>
                        </ul>
                      )}
                      {section === 'shipping' && (
                        <p>
                          Complimentary standard shipping on orders over $200. Express shipping available at checkout.
                          International shipping to over 100 countries.
                        </p>
                      )}
                      {section === 'care' && (
                        <p>
                          Dry clean only. Store in a cool, dry place. Use a padded hanger to maintain shape.
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
