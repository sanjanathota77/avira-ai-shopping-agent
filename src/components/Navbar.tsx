'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingBag, Heart, Search, User, Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenAgent: () => void;
  onOpenAuth: () => void;
  onSearchClick: () => void;
}

export default function Navbar({ onOpenAgent, onOpenAuth, onSearchClick }: NavbarProps) {
  const { totalCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 text-amber-200/90 text-xs py-1.5 px-4 text-center border-b border-amber-900/20 font-medium tracking-wide flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Try our intelligent AI Shopping Agent for instant sizes, stock, and smart recommendations.</span>
        <button
          onClick={onOpenAgent}
          className="underline hover:text-amber-300 font-semibold cursor-pointer ml-1"
        >
          Ask Avira AI
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-white group-hover:text-amber-300 transition-colors uppercase">
                Avira
              </span>
              <span className="block text-[9px] tracking-[0.35em] text-stone-400 font-sans uppercase -mt-1 group-hover:text-stone-300 transition-colors">
                Luxury & Lifestyle
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide text-stone-300">
            <Link href="/" className="hover:text-amber-300 transition-colors">
              Home
            </Link>
            <a href="#shop" className="hover:text-amber-300 transition-colors">
              Shop
            </a>
            <a href="#categories" className="hover:text-amber-300 transition-colors">
              Categories
            </a>
            <a href="#about" className="hover:text-amber-300 transition-colors">
              About
            </a>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* AI Agent Trigger Pill */}
            <button
              onClick={onOpenAgent}
              className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 hover:from-amber-500/20 hover:to-amber-500/30 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:shadow transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>AI Stylist</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>

            {/* Search Button */}
            <button
              onClick={onSearchClick}
              className="p-2 text-stone-300 hover:text-amber-300 rounded-full hover:bg-stone-800 transition-colors"
              aria-label="Search catalog"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-stone-300 hover:text-amber-300 rounded-full hover:bg-stone-800 transition-colors"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-300 hover:text-amber-300 rounded-full hover:bg-stone-800 transition-colors"
              aria-label="Shopping Cart"
              title="View cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Login / Profile Button */}
            <button
              onClick={onOpenAuth}
              className="p-2 text-stone-300 hover:text-amber-300 rounded-full hover:bg-stone-800 transition-colors"
              aria-label="Account Login"
              title="Sign in"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-3 text-base font-medium text-stone-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 transition-colors"
            >
              Home
            </Link>
            <a
              href="#shop"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 transition-colors"
            >
              Shop All
            </a>
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 transition-colors"
            >
              Categories
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 transition-colors"
            >
              About Avira
            </a>
          </nav>

          <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAgent();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-amber-500 text-stone-950 font-semibold py-2.5 rounded-lg text-sm"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Launch Avira AI Agent</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
