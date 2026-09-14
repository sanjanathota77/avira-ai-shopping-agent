'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0] || '');
  const [isAdded, setIsAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, product.availableColors[0], 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-950">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.tag && (
            <span className="text-[10px] uppercase font-bold tracking-wider bg-stone-950/80 backdrop-blur-sm text-amber-300 px-2.5 py-1 rounded-md border border-stone-700/80 shadow">
              {product.tag}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-900'
          }`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="bg-stone-900/90 hover:bg-stone-900 text-stone-100 text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 border border-stone-700 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-stone-400">
            <span className="font-semibold text-amber-400">{product.brand}</span>
            <span>{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg font-bold text-white mt-1 group-hover:text-amber-200 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Price & Rating */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-lg font-extrabold text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <div className="flex items-center space-x-1 text-xs text-amber-400 font-semibold bg-stone-800/80 px-2 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Sizes Selection */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5">
            <span>Sizes:</span>
            <span className="text-stone-300 font-medium">Selected: {selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.availableSizes.map(sz => (
              <button
                key={sz}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(sz);
                }}
                className={`text-xs px-2 py-1 rounded border font-medium transition-all ${
                  selectedSize === sz
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-stone-800/80 flex items-center gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={product.stockQuantity === 0}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              product.stockQuantity === 0
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/10'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : product.stockQuantity === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
