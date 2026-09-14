'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface HeroProps {
  onOpenAgent: () => void;
  onExploreShop: () => void;
}

export default function Hero({ onOpenAgent, onExploreShop }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white overflow-hidden pt-6 pb-16 lg:py-20 border-b border-stone-800">
      {/* Subtle Luxury Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-stone-800/80 border border-stone-700/80 rounded-full px-3.5 py-1.5 text-xs text-amber-300 font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Autumn / Winter 2026 Ready-To-Wear</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-50 leading-[1.12]">
              Elevate Your Everyday <br className="hidden sm:inline" />
              <span className="italic font-normal bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500">
                Signature Style.
              </span>
            </h1>

            <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Curated luxury apparel and contemporary footwear tailored for discerning individuals.
              Explore our boutique collection or let our autonomous <strong>AI Shopping Agent</strong> curate the perfect ensemble in seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreShop}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenAgent}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-amber-200 border border-amber-500/30 font-semibold text-sm tracking-wide transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ask AI Shopping Agent</span>
              </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-1">
                <Truck className="w-5 h-5 text-amber-400/90" />
                <span className="text-xs font-semibold text-stone-200">Express Delivery</span>
                <span className="text-[11px] text-stone-400">All orders across India</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-1">
                <ShieldCheck className="w-5 h-5 text-amber-400/90" />
                <span className="text-xs font-semibold text-stone-200">100% Authentic</span>
                <span className="text-[11px] text-stone-400">Atelier verified fabrics</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-1">
                <RefreshCw className="w-5 h-5 text-amber-400/90" />
                <span className="text-xs font-semibold text-stone-200">Easy Returns</span>
                <span className="text-[11px] text-stone-400">15-day complimentary</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fashion Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Main Fashion Hero Image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-stone-800 group">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
                  alt="Avira Luxury Fashion"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {/* Floating Interactive Badge inside Hero */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-700/80 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                      AI Powered Recommendation
                    </span>
                    <p className="text-xs font-semibold text-stone-100">Urban Black Sneakers</p>
                    <p className="text-xs font-bold text-amber-300">₹1,899 • Sizes 6-10 In Stock</p>
                  </div>
                  <button
                    onClick={onOpenAgent}
                    className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition-colors flex items-center space-x-1"
                    title="Check sizing with AI"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Check AI</span>
                  </button>
                </div>
              </div>

              {/* Decorative accent card */}
              <div className="absolute -top-4 -right-4 w-28 h-28 bg-stone-800/90 border border-stone-700 rounded-xl p-3 shadow-xl hidden sm:flex flex-col justify-center items-center text-center">
                <span className="font-serif text-2xl font-bold text-amber-400">4.9 ★</span>
                <span className="text-[10px] text-stone-300 tracking-tight">Verified Buyer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
