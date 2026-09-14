'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-extrabold tracking-[0.25em] text-white uppercase">
                Avira
              </span>
              <span className="block text-[9px] tracking-[0.35em] text-stone-400 uppercase -mt-0.5">
                Luxury & Lifestyle
              </span>
            </Link>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Contemporary Indian luxury fashion house. Engineered footwear, tailored silhouettes, and an autonomous AI personal shopping concierge.
            </p>
            <div className="pt-2 text-stone-500 text-[11px]">
              <span>Currency: </span>
              <strong className="text-amber-400">Indian Rupee (₹ INR)</strong>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">
              Collections
            </h4>
            <ul className="space-y-2">
              <li><a href="#shop" className="hover:text-amber-300 transition-colors">Urban Footwear</a></li>
              <li><a href="#shop" className="hover:text-amber-300 transition-colors">Men's Tailoring</a></li>
              <li><a href="#shop" className="hover:text-amber-300 transition-colors">Women's Atelier</a></li>
              <li><a href="#shop" className="hover:text-amber-300 transition-colors">Fine Accessories</a></li>
            </ul>
          </div>

          {/* Col 3: Assistance */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">
              Client Care
            </h4>
            <ul className="space-y-2">
              <li><span className="hover:text-amber-300 cursor-pointer">Complimentary Shipping</span></li>
              <li><span className="hover:text-amber-300 cursor-pointer">Returns & Exchanges</span></li>
              <li><span className="hover:text-amber-300 cursor-pointer">Atelier Sizing Guide</span></li>
              <li><span className="hover:text-amber-300 cursor-pointer">AI Agent Protocol</span></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">
              Newsletter
            </h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              Receive private preview invitations and seasonal lookbooks.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-stone-900 border border-stone-800 rounded-l-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 w-full"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-2 rounded-r-lg transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed to VIP lookbook!</span>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Avira Fashion & Lifestyle Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Powered by Next.js & OpenAI Function Calling Agent Architecture
          </p>
        </div>
      </div>
    </footer>
  );
}
