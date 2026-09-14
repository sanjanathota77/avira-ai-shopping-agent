'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  onOpenAgent: () => void;
}

export default function CartDrawer({ onOpenAgent }: CartDrawerProps) {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AVIRA10') {
      setDiscountPercent(10);
      setPromoError('');
    } else if (promoCode.trim().toUpperCase() === 'FIRSTVIP') {
      setDiscountPercent(15);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "AVIRA10" for 10% off');
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      clearCart();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-xl font-bold text-white">Your Shopping Bag</h2>
              <span className="text-xs bg-stone-800 text-amber-400 font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {checkoutSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">Order Confirmed!</h3>
                <p className="text-sm text-stone-300 max-w-xs mx-auto">
                  Thank you for shopping with Avira. Your bespoke order has been received and is being prepared for express delivery.
                </p>
                <button
                  onClick={() => {
                    setCheckoutSuccess(false);
                    setIsCartOpen(false);
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm"
                >
                  Continue Browsing
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-medium text-stone-300">Your bag is currently empty.</p>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Ask our AI Shopping Agent to find products and add them directly to your bag!
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      onOpenAgent();
                    }}
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Try: "Add Urban Black Sneakers to cart"</span>
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="inline-block px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
                  >
                    Browse Catalog
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex space-x-4 bg-stone-950/60 p-3.5 rounded-xl border border-stone-800"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-800">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm font-bold text-white line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5 space-x-2">
                          <span>Size: <strong className="text-stone-300">{item.size}</strong></span>
                          <span>•</span>
                          <span>Color: <strong className="text-stone-300">{item.color}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-stone-800 rounded-md bg-stone-900">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-stone-400 hover:text-white text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-stone-400 hover:text-white text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-extrabold text-amber-300">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="pt-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (e.g. AVIRA10)"
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-400 mt-1">{promoError}</p>
                  )}
                  {discountPercent > 0 && (
                    <p className="text-[11px] text-emerald-400 mt-1">
                      {discountPercent}% discount applied!
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && !checkoutSuccess && (
            <div className="p-6 border-t border-stone-800 bg-stone-950/80 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-stone-200">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-stone-200">
                    {shipping === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-stone-800 pt-2 flex justify-between text-base font-bold text-white">
                  <span>Grand Total</span>
                  <span className="text-amber-400">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
              >
                {isCheckingOut ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-stone-400">
                Encrypted 256-Bit SSL Checkout • Free Indian returns
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
