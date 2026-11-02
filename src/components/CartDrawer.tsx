"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Download, Package } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-neutral-200">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-sans font-bold text-base uppercase tracking-wider text-black">Shopping Cart</h2>
                <p className="text-[11px] text-neutral-500">{cartCount} items</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-black uppercase">Your Cart is Empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Discover handcrafted diaries and productivity planners to get started!
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200 flex gap-3 relative"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-black truncate">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.customText && (
                        <div className="mt-1.5 text-[11px] bg-white border border-black/20 rounded px-2 py-0.5 text-black">
                          <span className="text-[9px] uppercase tracking-wider text-neutral-500 block font-bold">
                            Print Name:
                          </span>
                          <span className="font-serif font-bold text-black">
                            &ldquo;{item.customText}&rdquo;
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200">
                      <div className="font-bold font-mono text-xs text-black">
                        ₹{item.product.price * item.quantity}
                      </div>

                      <div className="flex items-center border border-neutral-300 rounded bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-black font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-neutral-200 space-y-3">
              <div className="flex justify-between text-xs text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-bold font-mono text-black">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-black pt-2 border-t border-neutral-100">
                <span>Total:</span>
                <span className="font-mono text-base">₹{cartTotal}</span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
