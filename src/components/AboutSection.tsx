'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Compass, Gem, Bot } from 'lucide-react';

interface AboutSectionProps {
  onOpenAgent: () => void;
}

export default function AboutSection({ onOpenAgent }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80"
                alt="Avira Atelier Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-stone-950/80 backdrop-blur-md border border-stone-800">
                <p className="font-serif text-base font-bold text-white">The Avira Atelier Standard</p>
                <p className="text-xs text-stone-300 mt-1">
                  Hand-selected Italian silks, virgin wools, and vulcanized performance soles.
                </p>
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 block">
              Craft & Intelligence
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Where Bespoke Fashion Meets <br className="hidden sm:inline" />
              Autonomous AI Assistance.
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Avira was founded with a singular conviction: luxury e-commerce should not feel like navigating a cold catalog grid.
              By fusing thoughtful sartorial tailoring with an autonomous <strong>AI Shopping Agent</strong>, we bring the intuitive care of a private atelier concierge straight to your browser.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-sm font-bold text-white">Autonomous Agent Tools</h4>
                <p className="text-xs text-stone-400 leading-normal">
                  Our agent uses true function calling to cross-reference sizes, inventory, and budgets in milliseconds.
                </p>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Gem className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-sm font-bold text-white">Zero Compromise Fabrics</h4>
                <p className="text-xs text-stone-400 leading-normal">
                  100% natural fibers, ethically audited mills, and timeless silhouettes crafted to endure seasons.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAgent}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs tracking-wider uppercase transition-all inline-flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Experience Avira AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
