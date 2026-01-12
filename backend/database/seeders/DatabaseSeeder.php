<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'is_admin' => true,
            ]
        );

        // extensive collection list
        $collectionsData = [
            ['name' => 'Summer Essentials', 'slug' => 'summer-essentials', 'img' => 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b'],
            ['name' => 'Modern Tailoring', 'slug' => 'modern-tailoring', 'img' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf'],
            ['name' => 'Evening Wear', 'slug' => 'evening-wear', 'img' => 'https://images.unsplash.com/photo-1566174053879-31528523f8ae'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'img' => 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd'],
            ['name' => 'Seasonal Favorites', 'slug' => 'seasonal-favorites', 'img' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b'],
            ['name' => 'The Festival Edit', 'slug' => 'festival', 'img' => 'https://images.unsplash.com/photo-1514933651103-005eec06c04b'],
            ['name' => 'The Modern Wardrobe', 'slug' => 'modern-wardrobe', 'img' => 'https://images.unsplash.com/photo-1485230946086-1d99d52571eb'],
            ['name' => 'Modern Clothing', 'slug' => 'modern-clothing', 'img' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea'],
            ['name' => 'Minimal Aesthetics', 'slug' => 'minimal', 'img' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'],
            ['name' => 'Heritage Collection', 'slug' => 'old-money', 'img' => 'https://images.unsplash.com/photo-1548690312-e3b507d8c110'],
            ['name' => 'Party Wear', 'slug' => 'party-wear', 'img' => 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d'],
            ['name' => 'Office Chic', 'slug' => 'office-chic', 'img' => 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2'],
            ['name' => 'Casual Weekend', 'slug' => 'casual-weekend', 'img' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b'],
            // 5 Extra
            ['name' => 'Bohemian Rhapsody', 'slug' => 'boho', 'img' => 'https://images.unsplash.com/photo-1469334031218-e382a71b716b'],
            ['name' => 'Vintage Revival', 'slug' => 'vintage', 'img' => 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8'],
            ['name' => 'Athleisure', 'slug' => 'athleisure', 'img' => 'https://images.unsplash.com/photo-1518310383802-640c2de311b2'],
            ['name' => 'Sustainable Basics', 'slug' => 'sustainable', 'img' => 'https://images.unsplash.com/photo-1503342394128-c104d54dba01'],
            ['name' => 'Avant-Garde', 'slug' => 'avant-garde', 'img' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'],
        ];

        $imagePool = [
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1485230946086-1d99d52571eb?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1529139574466-a302c27560a3?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop',
             'https://images.unsplash.com/photo-1496747611176-665a3c2605f1?q=80&w=1000&auto=format&fit=crop',
             'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
             'https://images.unsplash.com/photo-1508499877772-2771d6d67417?q=80&w=1000&auto=format&fit=crop',
             'https://images.unsplash.com/photo-1543087903-1ac30d0925d7?q=80&w=1000&auto=format&fit=crop'
        ];

        $adjectives = ['Premium', 'Luxury', 'Classic', 'Modern', 'Urban', 'Elegant', 'Timeless', 'Chic', 'Essential', 'Artisan'];
        $nouns = ['Jacket', 'Blazer', 'Dress', 'Trousers', 'Shirt', 'Blouse', 'Coat', 'Scarf', 'Boots', 'Heels', 'Sweater', 'Tee', 'Handbag', 'Watch'];

        foreach ($collectionsData as $index => $colData) {
            // Use updateOrCreate to avoid duplicates and ensure idempotency
            // We can incorrectly rely on ID only if we force it, but generally reliance on name/slug is better.
            // However, Home.tsx relies on IDs 1 and 2. updateOrCreate might assign new IDs if deleted.
            // Since we use migrate:fresh, IDs start at 1.

            $collection = \App\Models\Collection::updateOrCreate(
                ['slug' => $colData['slug']],
                [
                    'name' => $colData['name'],
                    'description' => 'A curated collection of ' . strtolower($colData['name']) . '.',
                    'image_url' => $colData['img'] . '?q=80&w=1000&auto=format&fit=crop',
                ]
            );

            echo "Seeding Collection: {$collection->name} (ID: {$collection->id})\n";

            // Create products for each collection
            $currentCount = $collection->products()->count();
            if ($currentCount < 20) {
                for ($i = $currentCount; $i < 20; $i++) {
                    $mainImage = $imagePool[array_rand($imagePool)];
                    $galleryImages = [];
                    for($j=0; $j<5; $j++) $galleryImages[] = $imagePool[array_rand($imagePool)];

                    $productName = $adjectives[array_rand($adjectives)] . ' ' . $nouns[array_rand($nouns)];

                    try {
                         \App\Models\Product::create([
                            'collection_id' => $collection->id,
                            'name' => $productName . ' ' . rand(1000, 99999),
                            'description' => 'A detailed description of this wonderful product. Crafted with care and designed for the modern lifestyle. Features high-quality materials and exceptional attention to detail.',
                            'price' => rand(50, 500) + 0.99,
                            'stock' => rand(0, 50),
                            'image_url' => $mainImage,
                            'images' => $galleryImages,
                            'sizes' => ['S', 'M', 'L', 'XL'],
                        ]);
                        echo ".";
                    } catch (\Exception $e) {
                        echo "\nError creating product: " . $e->getMessage() . "\n";
                    }
                }
                echo "\n";
            }
        }
    }
}
