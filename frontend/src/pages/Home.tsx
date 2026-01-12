import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Truck, Shield, RefreshCw } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => {
        setProducts([
          { id: 1, name: 'Midnight Velvet Blazer', price: 299.99, image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop', description: 'Premium velvet tailoring.' },
          { id: 2, name: 'Golden Silk Evening Gown', price: 899.99, image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop', description: 'Floor-length elegance.' },
          { id: 3, name: 'Artisan Leather Chelsea Boots', price: 249.99, image_url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop', description: 'Hand-crafted luxury.' },
          { id: 4, name: 'Pearl White Cashmere Sweater', price: 189.99, image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop', description: 'Ultra-soft comfort.' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        {/* Hero Skeleton */}
        <div className="relative h-[90vh] bg-primary/5">
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
            <Skeleton className="h-8 w-48 rounded-full" />
            <Skeleton className="h-24 w-3/4 max-w-4xl" />
            <Skeleton className="h-6 w-1/2 max-w-2xl" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>

        {/* Collections Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex justify-between items-end mb-12">
             <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-64" />
             </div>
             <Skeleton className="h-6 w-40 hidden sm:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Skeleton className="h-[400px] w-full" />
             <Skeleton className="h-[400px] w-full" />
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-24">
           <Skeleton className="h-10 w-64 mb-16" />
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(4)].map((_, i) => (
                 <div key={i} className="space-y-4">
                    <Skeleton className="aspect-3/4 w-full rounded-sm" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/4" />
                 </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=2070&auto=format&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-primary/60 via-primary/40 to-primary" />
        </div>

        <div className="relative z-10 text-center max-w-5xl px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="badge-accent mb-6"
          >
            New Collection 2026
          </motion.span>

          <motion.h1
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-serif font-semibold mb-6 tracking-tight leading-[0.9]"
          >
            Redefine Your
            <br />
            <span className="text-accent italic">Elegance</span>
          </motion.h1>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-text-secondary font-light mb-10 max-w-2xl mx-auto tracking-wide"
          >
            Discover curated luxury fashion that transcends seasons.
            Timeless pieces crafted for the discerning individual.
          </motion.p>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/collections" className="btn-primary">
              Shop Collections
            </Link>
            <Link to="/products" className="btn-outline">
              View All Products
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border border-text/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-accent rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center">
                <Truck className="w-5 h-5 text-accent" />
              </div>
              <h5 className="text-text-secondary">Complimentary Shipping</h5>
              <p className="text-sm text-muted">On orders above $200</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <h5 className="text-text-secondary">Authenticity Guaranteed</h5>
              <p className="text-sm text-muted">100% genuine products</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-accent" />
              </div>
              <h5 className="text-text-secondary">Easy Returns</h5>
              <p className="text-sm text-muted">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
             <div>
                <h5 className="text-accent mb-2">Curated For You</h5>
                <h2 className="text-4xl font-serif">Featured Collections</h2>
             </div>
             <Link to="/collections" className="link-underline hidden sm:block">View All Collections</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <motion.div
               whileHover={{ scale: 0.98 }}
               className="relative h-[400px] group overflow-hidden cursor-pointer"
             >
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop"
                  alt="Summer Essentials"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                   <h3 className="text-3xl font-serif text-white mb-2">Summer Essentials</h3>
                   <Link to="/products?collection=1" className="btn-outline border-white text-white hover:bg-white hover:text-black">
                      Shop Now
                   </Link>
                </div>
             </motion.div>

             <motion.div
               whileHover={{ scale: 0.98 }}
               className="relative h-[400px] group overflow-hidden cursor-pointer"
             >
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"
                  alt="Modern Tailoring"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                   <h3 className="text-3xl font-serif text-white mb-2">Modern Tailoring</h3>
                   <Link to="/products?collection=2" className="btn-outline border-white text-white hover:bg-white hover:text-black">
                      Shop Now
                   </Link>
                </div>
             </motion.div>
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/collections" className="btn-outline w-full">View All Collections</Link>
          </div>
        </div>
      </section>

      {/* Seasonal Favorites - Carousel */}
      <section className="py-20 overflow-hidden bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <h5 className="text-accent mb-2">This Season</h5>
          <h2 className="text-4xl font-serif text-white">Seasonal Favorites</h2>
        </div>

        <div className="flex">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear",
            }}
          >
            {[...Array(4)].map((_, setIndex) => (
               // Repeating the set 4 times to ensure smooth loop on wide screens
               [1, 2, 3, 4].map((item, i) => (
              <motion.div
                key={`${setIndex}-${i}`}
                className="min-w-[280px] sm:min-w-[320px] relative aspect-3/4 group overflow-hidden rounded-sm"
                whileHover={{ scale: 0.98 }}
              >
                 <img
                    src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1483985988355-763728e1935b' : '1549439602-43ebca2327af'}?q=80&w=1000&auto=format&fit=crop`}
                    alt="Seasonal Item"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent">
                    <h4 className="text-white font-serif text-xl">Autumn Breeze {item}</h4>
                    <p className="text-white/80 text-sm">$129.00</p>
                  </div>
              </motion.div>
            ))
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="shop" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-16">
          <div>
            <h5 className="text-accent mb-2">Curated Selection</h5>
            <h2 className="text-4xl sm:text-5xl font-serif">Latest Arrivals</h2>
          </div>
          <Link to="/products" className="link-underline text-text-secondary hover:text-accent transition-colors">
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.slice(0, 8).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="product-card aspect-3/4 mb-4 relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-card-image"
                />

                {/* Wishlist Button */}
                <button
                  onClick={(e) => handleWishlistToggle(e, product)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-accent hover:scale-110 z-10"
                >
                  <Heart
                    size={18}
                    className={isInWishlist(product.id) ? 'fill-accent text-accent' : 'text-text'}
                  />
                </button>

                {/* Overlay with Quick Add */}
                <div className="product-card-overlay flex items-end justify-center pb-6">
                  <button
                    onClick={(e) => { e.preventDefault(); addToCart(product); }}
                    className="btn-primary flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <ShoppingBag size={16} />
                    Add to Bag
                  </button>
                </div>
              </div>

              <Link to={`/product/${product.id}`} className="block group/link">
                <div className="space-y-2">
                  <h3 className="font-medium text-text group-hover/link:text-accent transition-colors duration-200">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted line-clamp-1">{product.description}</p>
                  <p className="text-lg font-serif text-accent">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-4xl font-serif text-center mb-16">Shop by Occasion</h2>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Party Wear', image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000&auto=format&fit=crop' },
                { title: 'Office Chic', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop' },
                { title: 'Casual Weekend', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop' }
              ].map((occasion, idx) => (
                <Link key={idx} to="/products?tag=occasion" className="group relative h-[500px] overflow-hidden block">
                  <img
                    src={occasion.image}
                    alt={occasion.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-3xl font-serif text-white border-b-2 border-transparent group-hover:border-white transition-all pb-1">
                      {occasion.title}
                    </h3>
                  </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* The Festival Edit Banner */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2074&auto=format&fit=crop"
            alt="Festival"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center max-w-2xl px-4 text-white">
          <h5 className="text-accent-light mb-4 tracking-widest uppercase text-sm">Limited Edition</h5>
          <h2 className="text-5xl md:text-7xl font-serif mb-8">The Festival Edit</h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 font-light">
            Vibrant colors, bold patterns, and exquisite details for your most joyful celebrations.
          </p>
          <Link to="/products?collection=festival" className="btn-primary bg-white text-black hover:bg-accent hover:text-white border-none">
            Explore the Edit
          </Link>
        </div>
      </section>

      {/* Modern Wardrobe */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1485230946086-1d99d52571eb?q=80&w=1000&auto=format&fit=crop"
                alt="Modern Wardrobe"
                className="w-full h-[600px] object-cover rounded-sm shadow-xl"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h5 className="text-accent tracking-widest uppercase text-sm">Essentials</h5>
              <h2 className="text-5xl font-serif leading-tight">The Modern <br/> Wardrobe</h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                Clean lines, neutral tones, and versatile pieces that form the foundation of a sophisticated closet.
                Discover the art of dressing with intention.
              </p>
              <Link to="/products?tag=modern-wardrobe" className="btn-primary inline-block">
                Shop the Essentials
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Clothing - Editorial Slider (SSENSE Inspired) */}
      <section className="py-24 bg-secondary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
              {/* Sticky Header */}
              <div className="w-full md:w-48 md:shrink-0">
                 <div className="sticky top-24">
                    <h5 className="text-accent tracking-widest uppercase text-xs mb-4">The Edit</h5>
                    <h2 className="text-3xl md:text-4xl font-serif text-text mb-6 leading-tight">
                       Modern <br className="hidden md:block" /> Clothing
                    </h2>
                    <p className="text-text-secondary text-sm mb-8 leading-relaxed max-w-xs">
                       A curated selection of high-end streetwear and essentials for the contemporary wardrobe.
                    </p>
                    <div className="flex gap-4">
                       <button className="w-10 h-10 rounded-full border border-glass-border flex items-center justify-center text-text hover:bg-white hover:text-black transition-colors">
                          <span className="sr-only">Previous</span>
                          ←
                       </button>
                       <button className="w-10 h-10 rounded-full border border-glass-border flex items-center justify-center text-text hover:bg-white hover:text-black transition-colors">
                          <span className="sr-only">Next</span>
                          →
                       </button>
                    </div>
                 </div>
              </div>

              {/* Draggable Slider */}
              <div className="flex-1 overflow-visible">
                 <motion.div
                    className="flex gap-6 cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ right: 0, left: -600 }}
                 >
                    {[
                      { name: "Urban Bomber", price: 189, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop" },
                      { name: "Tech Fleece", price: 145, img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop" },
                      { name: "Oversized Tee", price: 45, img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop" },
                      { name: "Cargo Pants", price: 98, img: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000&auto=format&fit=crop" },
                      { name: "Minimal Hoodie", price: 89, img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop" },
                    ].map((item, i) => (
                       <div key={i} className="min-w-[260px] md:min-w-[300px] group relative">
                          <div className="aspect-3/4 overflow-hidden rounded-sm mb-4 relative bg-tertiary">
                             <img
                               src={item.img}
                               alt={item.name}
                               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                             />
                             {/* Minimal Quick Add */}
                             <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                <ShoppingBag size={14} />
                             </button>
                          </div>
                          <div className="flex flex-col gap-1">
                             <h4 className="font-sans text-sm tracking-wide uppercase text-text">{item.name}</h4>
                             <p className="font-serif text-accent text-lg italic">${item.price}</p>
                          </div>
                       </div>
                    ))}
                 </motion.div>
              </div>
           </div>
        </div>
      </section>

      {/* Modern Aesthetics - Bento Grid (Farfetch/High-Fashion Inspired) */}
      <section className="py-24 bg-primary relative">
         {/* Noise Texture Overlay */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png")' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="mb-12 text-center relative z-10">
              <h5 className="text-accent tracking-[0.2em] mb-2 text-xs">VISUAL NARRATIVE</h5>
              <h2 className="text-4xl md:text-5xl font-serif text-white">Modern Aesthetics</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[900px]">
              {/* Main Feature - Large */}
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6 }}
                 className="col-span-1 md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-sm"
              >
                 <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-105" alt="Aesthetic 1" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-6xl md:text-8xl font-serif text-white mix-blend-overlay opacity-80 tracking-tighter">MINIMAL</h3>
                    <p className="mt-4 text-white/90 font-light tracking-widest uppercase text-sm border-b border-white/30 pb-1">Shop The Look</p>
                 </div>
              </motion.div>

              {/* Secondary Feature - Top Right */}
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.1 }}
                 className="col-span-1 md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-sm bg-tertiary"
              >
                  <div className="absolute inset-0 flex">
                     <div className="w-1/2 overflow-hidden relative">
                         <img src="https://images.unsplash.com/photo-1529139574466-a302c27560a3?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Detail 1" />
                     </div>
                     <div className="w-1/2 overflow-hidden relative">
                         <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Detail 2" />
                         <div className="absolute inset-0 bg-accent/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                     <span className="bg-black/80 backdrop-blur-md text-white px-6 py-3 font-serif italic text-xl">Street & Culture</span>
                  </div>
              </motion.div>

              {/* Tertiary Features - Bottom Right Split */}
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.2 }}
                 className="col-span-1 md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-sm"
              >
                 <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Texture" />
                 <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-sans text-xs uppercase tracking-wider">Accessories</p>
                 </div>
              </motion.div>

              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.3 }}
                 className="col-span-1 md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-sm bg-accent flex items-center justify-center text-center p-6"
              >
                 <div className="border border-primary/20 p-8 w-full h-full flex flex-col items-center justify-center relative z-10 hover:bg-black/5 transition-colors cursor-pointer">
                    <h4 className="font-serif text-3xl text-primary mb-2">New <br/>Arrivals</h4>
                    <span className="w-8 h-px bg-primary my-4"></span>
                    <p className="font-sans text-primary/80 text-xs uppercase tracking-widest">Explore Now</p>
                 </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Old Money - Classic Banner */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
           <img
             src="https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1000&auto=format&fit=crop"
             alt="Old Money"
             className="w-full h-full object-cover grayscale-30 contrast-125"
           />
           <div className="absolute inset-0 bg-black/30" />
           {/* Grain Overlay */}
           <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png")' }}></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
           <h5 className="font-serif italic text-2xl mb-4 text-white/90">The Heritage Collection</h5>
           <h2 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter mb-8 text-white drop-shadow-lg">
              OLD MONEY
           </h2>
           <p className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto leading-relaxed">
              Timeless elegance. Quiet luxury. The unspoken code of sophistication.
           </p>
           <Link to="/products?tag=old-money" className="px-10 py-4 bg-white text-black font-serif text-lg tracking-widest hover:bg-neutral-200 transition-colors uppercase">
              View the Collection
           </Link>
        </div>
      </section>



      {/* CTA Banner */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
            alt="Banner"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/90 to-primary/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h5 className="text-accent mb-4">Exclusive Membership</h5>
          <h2 className="text-4xl sm:text-5xl font-serif mb-6">
            Join the Inner Circle
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto">
            Be the first to access new collections, exclusive offers, and personalized styling advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
            />
            <button className="btn-accent whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
