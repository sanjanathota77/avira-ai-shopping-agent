'use client';

import React from 'react';
import Image from 'next/image';
import { ProductCategory } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface CategorySectionProps {
  onSelectCategory: (category: ProductCategory) => void;
}

const categoriesData: Array<{
  category: ProductCategory;
  title: string;
  subtitle: string;
  itemCount: string;
  image: string;
}> = [
  {
    category: 'Men',
    title: 'Men’s Collection',
    subtitle: 'Tailored blazers, luxury knits & relaxed linen',
    itemCount: '24 Styles',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
  },
  {
    category: 'Women',
    title: 'Women’s Atelier',
    subtitle: 'Crimson midi dresses, trench coats & evening silk',
    itemCount: '32 Styles',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
  },
  {
    category: 'Shoes',
    title: 'Footwear & Sneakers',
    subtitle: 'Urban black sneakers, runners & artisan boots',
    itemCount: '18 Styles',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'
  },
  {
    category: 'Accessories',
    title: 'Fine Accessories',
    subtitle: 'Italian leather bags, silk twill & polarized shades',
    itemCount: '16 Styles',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
  }
];

export default function CategorySection({ onSelectCategory }: CategorySectionProps) {
  return (
    <section id="categories" className="py-16 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 block mb-2">
              Curated Departures
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Shop by Category
            </h2>
          </div>
          <p className="text-sm text-stone-400 max-w-md mt-2 md:mt-0 font-normal">
            Explore meticulously tailored essentials across men’s tailoring, women’s couture, performance footwear, and handcrafted accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesData.map(cat => (
            <div
              key={cat.category}
              onClick={() => onSelectCategory(cat.category)}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer border border-stone-800 shadow-xl transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1"
            >
              {/* Image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold tracking-widest uppercase bg-stone-900/80 backdrop-blur-sm text-amber-300 px-3 py-1 rounded-full border border-stone-700">
                    {cat.itemCount}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-stone-900/80 text-stone-300 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2">
                    {cat.subtitle}
                  </p>
                  <span className="inline-block mt-3 text-xs font-semibold text-amber-400 group-hover:underline">
                    View Category &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
