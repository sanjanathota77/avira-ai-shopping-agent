'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import ProductGrid from '@/components/ProductGrid';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import ProductDetailModal from '@/components/ProductDetailModal';
import AIAgentChat from '@/components/AIAgentChat';
import AgentFloatingButton from '@/components/AgentFloatingButton';
import AuthModal from '@/components/AuthModal';
import { products } from '@/data/products';
import { Product, ProductCategory } from '@/types';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [agentPrompt, setAgentPrompt] = useState<string>('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenAgentWithPrompt = (promptText?: string) => {
    if (promptText) {
      setAgentPrompt(promptText);
    }
    setIsAgentOpen(true);
  };

  const handleSelectCategory = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToShop = () => {
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchClick = () => {
    handleScrollToShop();
    const searchInput = document.querySelector('input[placeholder*="Search sneakers"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF1E8] text-[#292326] flex flex-col selection:bg-[#FFF1E8] selection:text-[#292326]">
      {/* Navigation */}
      <Navbar
        onOpenAgent={() => handleOpenAgentWithPrompt()}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSearchClick={handleSearchClick}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenAgent={() => handleOpenAgentWithPrompt()}
          onExploreShop={handleScrollToShop}
        />

        {/* Categories Section */}
        <CategorySection onSelectCategory={handleSelectCategory} />

        {/* Product Catalog Grid */}
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onViewDetails={setActiveProductModal}
          onOpenAgent={() => handleOpenAgentWithPrompt()}
          searchQueryProp={searchQuery}
        />

        {/* About Section */}
        <AboutSection onOpenAgent={() => handleOpenAgentWithPrompt()} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <CartDrawer onOpenAgent={() => handleOpenAgentWithPrompt()} />
      <WishlistDrawer />

      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onAskAIAboutProduct={(pName) => handleOpenAgentWithPrompt(pName)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* AI Shopping Agent Interactive Chat Panel */}
      <AIAgentChat
        isOpen={isAgentOpen}
        onClose={() => setIsAgentOpen(false)}
        onViewProduct={(p) => setActiveProductModal(p)}
        initialPrompt={agentPrompt}
      />

      {/* Floating Bottom-Right Launcher Badge */}
      <AgentFloatingButton
        isOpen={isAgentOpen}
        onClick={() => handleOpenAgentWithPrompt()}
      />
    </div>
  );
}
