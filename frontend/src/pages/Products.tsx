import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCollections } from '../hooks/useCollections';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Filter, Search, X, ChevronDown, Check } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category?: string;
  collection_id?: number;
  colors?: string[];
  sizes?: string[];
}

const COLORS = [
  { name: 'Black', class: 'bg-black' },
  { name: 'White', class: 'bg-white border border-gray-200' },
  { name: 'Gray', class: 'bg-gray-500' },
  { name: 'Beige', class: 'bg-[#F5F5DC]' },
  { name: 'Brown', class: 'bg-[#8B4513]' },
  { name: 'Gold', class: 'bg-[#D4AF37]' },
  { name: 'Silver', class: 'bg-[#C0C0C0]' },
  { name: 'Navy', class: 'bg-blue-900' },
  { name: 'Blue', class: 'bg-blue-500' },
  { name: 'Red', class: 'bg-red-900' },
  { name: 'Green', class: 'bg-green-800' },
  { name: 'Pink', class: 'bg-pink-400' },
];


// Enrich data with mock fields only if missing
const enrichProduct = (product: any): Product => {
  const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
  return {
    ...product,
    // Only mock colors if not present (backend might default to null/empty)
    colors: product.colors || [random(COLORS).name, random(COLORS).name],
    // sizes are now in backend, but fallback just in case
    sizes: product.sizes || ['S', 'M', 'L'],
  };
};

export default function Products() {
  const { data: rawProducts = [], isLoading: loadingProducts } = useProducts();
  const { data: collections = [], isLoading: loadingCollections } = useCollections();

  const loading = loadingProducts || loadingCollections;

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollections, setSelectedCollections] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Enrich data with mock fields for demo purposes
  const products = useMemo(() => {
     if (!rawProducts) return [];
     return rawProducts.map(enrichProduct);
  }, [rawProducts]);

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      // Search
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      // Collections
      if (selectedCollections.length > 0 && !selectedCollections.includes(product.collection_id!)) return false;

      // Colors (if product has ANY of the selected colors)
      if (selectedColors.length > 0 && !product.colors?.some((c: string) => selectedColors.includes(c))) return false;

      // Price
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

      return true;
    }).sort((a: Product, b: Product) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return b.id - a.id;
      return 0; // Featured (default order)
    });
  }, [products, searchTerm, selectedCollections, selectedColors, priceRange, sortBy]);

  const FilterSection = ({ title, isOpen = true, children }: { title: string, isOpen?: boolean, children: React.ReactNode }) => {
    const [open, setOpen] = useState(isOpen);
    return (
      <div className="border-b border-glass-border py-4">
        <button
          onClick={() => setOpen(!open)}
          className="flex justify-between items-center w-full mb-2 group"
        >
          <span className="font-serif font-medium text-lg">{title}</span>
          <ChevronDown size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-2 space-y-2">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif">Filters</h3>
        {(selectedCollections.length > 0 || selectedColors.length > 0) && (
          <button
            onClick={() => { setSelectedCollections([]); setSelectedColors([]); }}
            className="text-xs text-muted hover:text-accent underline"
          >
            Clear All
          </button>
        )}
      </div>

      <FilterSection title="Collections">
        {collections.map((col: any) => (
          <label key={col.id} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 border border-glass-border rounded flex items-center justify-center transition-colors ${selectedCollections.includes(col.id) ? 'bg-accent border-accent' : 'group-hover:border-accent'}`}>
              {selectedCollections.includes(col.id) && <Check size={10} className="text-primary" />}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={selectedCollections.includes(col.id)}
              onChange={(e) => {
                if(e.target.checked) setSelectedCollections([...selectedCollections, col.id]);
                else setSelectedCollections(selectedCollections.filter(c => c !== col.id));
              }}
            />
            <span className={`text-sm ${selectedCollections.includes(col.id) ? 'text-text' : 'text-muted'} group-hover:text-text transition-colors`}>{col.name}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="px-2">
           <div className="flex justify-between text-xs text-muted mb-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
           </div>
           <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full h-1 bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent"
           />
        </div>
      </FilterSection>

      <FilterSection title="Colors">
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map(color => (
            <button
              key={color.name}
              onClick={() => {
                if (selectedColors.includes(color.name)) setSelectedColors(selectedColors.filter(c => c !== color.name));
                else setSelectedColors([...selectedColors, color.name]);
              }}
              className={`w-6 h-6 rounded-full ${color.class} flex items-center justify-center transition-transform hover:scale-110 ${selectedColors.includes(color.name) ? 'ring-2 ring-offset-2 ring-offset-primary ring-accent' : ''}`}
              title={color.name}
            >
              {selectedColors.includes(color.name) && <Check size={10} className={(color.name === 'White' || color.name === 'Beige' || color.name === 'Silver') ? 'text-black' : 'text-white'} />}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Skeleton */}
           <div className="hidden lg:block space-y-6">
              <Skeleton className="h-64 w-full rounded-sm" />
           </div>

           {/* Grid Skeleton */}
           <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                       <Skeleton className="aspect-3/4 w-full rounded-sm" />
                       <Skeleton className="h-6 w-3/4" />
                       <Skeleton className="h-4 w-1/3" />
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-60 lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 h-full w-80 bg-secondary border-r border-glass-border z-70 p-6 overflow-y-auto lg:hidden"
              >
                 <div className="flex justify-end mb-4">
                   <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
                 </div>
                 <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div>
            <h5 className="text-accent mb-2">The Collection</h5>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold">
              All Products <span className="text-xl text-muted font-sans font-normal ml-2">({filteredProducts.length})</span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-glass-border pb-6">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 btn-outline py-2 px-4 w-full md:w-auto justify-center"
            >
              <Filter size={16} /> Filters
            </button>

            {/* Search */}
             <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="input-field pl-10 py-2.5 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort */}
             <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm text-muted whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-text text-sm font-medium focus:ring-0 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
            </div>
          </div>
        </div>

        <div className="flex gap-12">
           {/* Desktop Sidebar */}
           <div className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
              <SidebarContent />
           </div>

           {/* Product Grid */}
           <div className="grow">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                  {filteredProducts.map((product: Product, index: number) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="group"
                    >
                      <div className="product-card aspect-3/4 mb-4 relative">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="product-card-image"
                        />

                        <button
                          onClick={(e) => handleWishlistToggle(e, product)}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-accent hover:scale-110 z-10"
                        >
                          <Heart
                            size={18}
                            className={isInWishlist(product.id) ? 'fill-accent text-accent' : 'text-text'}
                          />
                        </button>

                        <div className="product-card-overlay flex items-end justify-center pb-6">
                          <button
                            onClick={() => addToCart(product)}
                            className="btn-primary flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                          >
                            <ShoppingBag size={16} />
                            Add to Bag
                          </button>
                        </div>
                      </div>

                      <Link to={`/product/${product.id}`} className="block group/link">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                             <h3 className="font-medium text-text group-hover/link:text-accent transition-colors duration-200 line-clamp-1">
                               {product.name}
                             </h3>
                             <p className="text-lg font-serif text-accent whitespace-nowrap ml-4">
                              ${Number(product.price).toFixed(2)}
                            </p>
                          </div>
                          <p className="text-xs text-muted">{product.collection_id ? collections.find((c: any) => c.id === product.collection_id)?.name : 'Collection'}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border border-dashed border-glass-border rounded-lg">
                  <Filter size={48} className="mx-auto text-muted mb-4 opacity-20" />
                  <p className="text-lg text-text-secondary mb-2">No products found</p>
                  <p className="text-sm text-muted mb-6">Try adjusting your filters or search terms.</p>
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedCollections([]); setSelectedColors([]); setPriceRange([0, 1000]); }}
                    className="btn-outline"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
