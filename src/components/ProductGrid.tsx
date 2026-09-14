'use client';

import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '@/types';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: ProductCategory | 'All';
  onCategoryChange: (cat: ProductCategory | 'All') => void;
  onViewDetails: (product: Product) => void;
  onOpenAgent: () => void;
  searchQueryProp?: string;
}

export default function ProductGrid({
  products,
  selectedCategory,
  onCategoryChange,
  onViewDetails,
  onOpenAgent,
  searchQueryProp = ''
}: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState(searchQueryProp);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Synchronize when parent passes searchQuery
  React.useEffect(() => {
    if (searchQueryProp) {
      setSearchQuery(searchQueryProp);
    }
  }, [searchQueryProp]);

  // Unique colors in catalog
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.availableColors.forEach(c => set.add(c)));
    return Array.from(set).slice(0, 7);
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Max Price
    if (maxPrice !== null) {
      result = result.filter(p => p.price <= maxPrice);
    }

    // Color
    if (selectedColor !== null) {
      result = result.filter(p =>
        p.availableColors.some(c => c.toLowerCase() === selectedColor.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchQuery, maxPrice, selectedColor, sortBy]);

  const categories: Array<ProductCategory | 'All'> = ['All', 'Men', 'Women', 'Shoes', 'Accessories'];

  const resetAllFilters = () => {
    onCategoryChange('All');
    setSearchQuery('');
    setMaxPrice(null);
    setSelectedColor(null);
    setSortBy('featured');
  };

  return (
    <section id="shop" className="py-16 bg-stone-950 text-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-stone-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 block mb-2">
              The Catalog
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Curated Ready-to-Wear
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3 text-xs text-stone-400">
            <span>Showing <strong className="text-amber-300">{filteredProducts.length}</strong> items</span>
            <span>•</span>
            <button
              onClick={onOpenAgent}
              className="inline-flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Agent to filter</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-10">
          {/* Top Row: Search & Category Pills */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                      : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sneakers, dresses, blazers..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/80 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Secondary Filters (Price, Color, Sorting) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-stone-500 font-medium flex items-center space-x-1">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Price:</span>
              </span>
              {[
                { label: 'All', value: null },
                { label: 'Under ₹2,000', value: 2000 },
                { label: 'Under ₹3,000', value: 3000 },
                { label: 'Under ₹5,000', value: 5000 }
              ].map(p => (
                <button
                  key={p.label}
                  onClick={() => setMaxPrice(p.value)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    maxPrice === p.value
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}

              {/* Color filter */}
              <div className="hidden sm:flex items-center space-x-1.5 ml-2">
                <span className="text-stone-500 font-medium">Color:</span>
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                    className={`px-2 py-1 rounded border text-[11px] ${
                      selectedColor === color
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 ml-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-900 border border-stone-800 text-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 text-xs"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-stone-900/40 border border-stone-800 rounded-3xl p-8 space-y-4">
            <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">No products found</h3>
            <p className="text-sm text-stone-400 max-w-md mx-auto">
              We couldn't find any products matching your specific filters or search keywords.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
              >
                Reset All Filters
              </button>
              <button
                onClick={onOpenAgent}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ask AI Agent for help</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
