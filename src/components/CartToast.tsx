'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';

export default function CartToast() {
  const { toast, dismissToast, setIsCartOpen } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-stone-900 text-white p-4 rounded-xl shadow-2xl border border-amber-600/30 flex items-center space-x-4 animate-slide-up">
      {toast.image ? (
        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-800">
          <Image
            src={toast.image}
            alt={toast.productName}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-6 h-6" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Added to Bag</span>
        </div>
        <p className="text-sm font-semibold truncate text-white mt-0.5">{toast.productName}</p>
        <p className="text-xs text-stone-300 truncate">{toast.message}</p>
      </div>

      <div className="flex flex-col items-center space-y-1 flex-shrink-0">
        <button
          onClick={() => {
            dismissToast();
            setIsCartOpen(true);
          }}
          className="text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-2.5 py-1 rounded transition-colors"
        >
          View Bag
        </button>
        <button
          onClick={dismissToast}
          className="text-stone-400 hover:text-white p-1 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
