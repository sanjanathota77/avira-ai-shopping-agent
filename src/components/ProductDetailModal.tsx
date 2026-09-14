'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { X, Star, Heart, ShoppingBag, Check, Shield, Truck, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAskAIAboutProduct?: (productName: string) => void;
}

export default function ProductDetailModal({ product, onClose, onAskAIAboutProduct }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>(product?.availableSizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product?.availableColors[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  // Sync state if product changes
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.availableSizes[0] || '');
      setSelectedColor(product.availableColors[0] || '');
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-950/70 text-stone-300 hover:text-white hover:bg-stone-950 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full min-h-[350px] bg-stone-950">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 z-10 text-xs font-bold uppercase tracking-widest bg-stone-950/80 backdrop-blur-md text-amber-300 px-3 py-1.5 rounded-md border border-stone-700">
                {product.tag}
              </span>
            )}
          </div>

          {/* Right: Product Meta & Purchase */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand & Category */}
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-stone-400">
                <span className="font-bold text-amber-400">{product.brand}</span>
                <span className="bg-stone-800 px-2.5 py-0.5 rounded-full">{product.category}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {product.name}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-sm">{product.rating}</span>
                </div>
                <span className="text-stone-500">•</span>
                <span className="text-xs text-stone-400">{product.reviewCount} customer reviews</span>
                <span className="text-stone-500">•</span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{product.stockQuantity} in stock</span>
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 pt-1">
                <span className="text-3xl font-extrabold text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-400">Inclusive of all taxes</span>
              </div>

              {/* Description */}
              <p className="text-sm text-stone-300 leading-relaxed">
                {product.description}
              </p>

              {/* Bullet Details */}
              {product.details && product.details.length > 0 && (
                <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80 space-y-1.5">
                  <span className="text-xs font-bold text-stone-200 uppercase tracking-wider block">
                    Product Highlights:
                  </span>
                  <ul className="text-xs text-stone-400 space-y-1 list-disc list-inside">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Color Selection */}
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-2 uppercase tracking-wider">
                  Color: <span className="text-amber-400">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.availableColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedColor === color
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                          : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                    Size: <span className="text-amber-400">{selectedSize}</span>
                  </label>
                  {onAskAIAboutProduct && (
                    <button
                      onClick={() => {
                        onClose();
                        onAskAIAboutProduct(`What sizes are available for ${product.name}?`);
                      }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 underline"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Check sizing with AI</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`text-xs min-w-[40px] px-3 py-2 rounded-lg border font-semibold transition-all ${
                        selectedSize === sz
                          ? 'border-amber-500 bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                          : 'border-stone-800 bg-stone-950 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-3">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center border border-stone-800 rounded-lg overflow-hidden bg-stone-950">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-stone-400 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-white min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3 py-1.5 text-stone-400 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-stone-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
                    product.stockQuantity === 0
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      : isAdded
                      ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    isFavorite
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-white hover:border-stone-700'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-around text-[11px] text-stone-400 pt-2">
                <div className="flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Authenticity Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
