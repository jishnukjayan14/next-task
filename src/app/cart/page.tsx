"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, Sparkles, Download, Package } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, hasPhysicalInCart, hasDigitalInCart } = useStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-sans font-black text-2xl uppercase tracking-wider text-black">
          Shopping Cart is Empty
        </h1>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Explore our handcrafted diaries, planners, and stationery essentials to get started.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
        <div>
          <h1 className="font-sans font-black text-3xl uppercase tracking-wider text-black">
            Shopping Cart
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Review your selected items, personalization details, and quantities
          </p>
        </div>
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-5 border border-neutral-200 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              <div className="flex gap-4 items-center min-w-0">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 space-y-1">
                  <h3 className="font-bold text-sm text-black truncate">
                    {item.product.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-neutral-100 text-black border border-neutral-300 px-2 py-0.5 rounded font-mono uppercase font-bold">
                      {item.product.type}
                    </span>
                  </div>

                  {item.customText && (
                    <div className="text-xs bg-neutral-50 border border-black/20 rounded p-1.5 text-black">
                      <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">
                        Personalized Name to Print:
                      </span>
                      <span className="font-serif font-bold text-black text-sm">
                        &ldquo;{item.customText}&rdquo;
                      </span>
                    </div>
                  )}

                  {item.selectedColor && (
                    <div className="text-[11px] text-neutral-500">
                      Color: <span className="font-semibold text-black">{item.selectedColor}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity & Price */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                <div className="text-right">
                  <div className="font-mono font-bold text-base text-black">
                    ₹{item.product.price * item.quantity}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    (₹{item.product.price} / each)
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-300 rounded bg-white overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 text-xs font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-black font-mono">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-neutral-200 shadow-sm space-y-4">
          <h2 className="font-sans font-bold text-base uppercase tracking-wider text-black pb-3 border-b border-neutral-100">
            Order Summary
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-bold font-mono text-black">₹{cartTotal}</span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>Shipping Fee:</span>
              <span className="font-bold text-black uppercase text-[10px]">FREE</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-black pt-3 border-t border-neutral-200">
              <span>Total:</span>
              <span className="font-mono text-lg">₹{cartTotal}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 px-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}
