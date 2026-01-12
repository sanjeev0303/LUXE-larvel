import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/ui/Skeleton';

interface Collection {
  id: number;
  name: string;
  image_url: string;
  description: string;
  slug: string;
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/collections')
      .then(res => {
        console.log("Fetched collections:", res.data);
        if (Array.isArray(res.data)) {
          setCollections(res.data);
        } else {
          console.error("API response is not an array:", res.data);
          setCollections([]);
        }
      })
      .catch((error) => console.error("Failed to fetch collections", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-64 mx-auto mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[500px] w-full rounded-sm" />
           ))}
        </div>
      </div>
    );
  }

  // Fallback mock data if API returns empty (for demo)
  const displayCollections = collections.length > 0 ? collections : [
    { id: 1, name: 'Summer Essentials', slug: 'summer-essentials', image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop', description: 'Curated pieces for the warmer days ahead.' },
    { id: 2, name: 'Modern Tailoring', slug: 'modern-tailoring', image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', description: 'Sharp silhouettes for the contemporary professional.' },
    { id: 3, name: 'Evening Wear', slug: 'evening-wear', image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop', description: 'Elegant attire for your most memorable nights.' },
    { id: 4, name: 'Accessories', slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=1000&auto=format&fit=crop', description: 'The finishing touches that make the outfit.' },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-20">
          <h5 className="text-accent mb-3">Curated Selection</h5>
          <h1 className="text-5xl font-serif font-semibold mb-6">Our Collections</h1>
          <p className="text-text-secondary leading-relaxed">
            Explore our thoughtfully designed collections, each telling a unique story of style, quality, and craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[500px] overflow-hidden rounded-sm bg-gray-100"
            >
              <img
                src={collection.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop'}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-4xl font-serif text-white mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {collection.name}
                </h2>
                <p className="text-white/80 max-w-md mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {collection.description}
                </p>
                <Link
                  to={`/products?collection=${collection.id}`}
                  className="btn-outline border-white text-white hover:bg-white hover:text-black hover:border-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200"
                >
                  Explore Collection
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
