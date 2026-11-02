"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { Sparkles, Download, Package, ArrowUpRight, Image as ImageIcon } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.type === "CUSTOM_PHYSICAL") {
      window.location.href = `/product/${product.id}`;
      return;
    }
    addToCart(product, 1);
  };

  return (
    <div className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-black transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image & Badges */}
        <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-neutral-100">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Type Badge */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            {product.type === "CUSTOM_PHYSICAL" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded shadow-xs">
                <Sparkles className="w-2.5 h-2.5" />
                Custom Name
              </span>
            )}
            {product.type === "DIGITAL" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded shadow-xs">
                <Download className="w-2.5 h-2.5" />
                Instant PDF
              </span>
            )}
            {product.type === "READY_STOCK" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white text-black border border-black px-2 py-0.5 rounded shadow-xs">
                <Package className="w-2.5 h-2.5" />
                Ready Stock
              </span>
            )}
          </div>

          {/* Multiple Photos indicator badge */}
          {product.images && product.images.length > 1 && (
            <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-neutral-300" />
              <span>{product.images.length} Photos</span>
            </div>
          )}

          <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white p-2 rounded-lg shadow-sm">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
            {product.category}
          </div>

          <Link href={`/product/${product.id}`} className="block hover:underline">
            <h3 className="font-sans font-bold text-sm text-black line-clamp-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>
        </div>
      </div>

      {/* Footer / Price & CTA */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div>
            <span className="text-base font-bold text-black font-mono">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through ml-1.5 font-mono">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {product.type === "CUSTOM_PHYSICAL" ? (
            <Link
              href={`/product/${product.id}`}
              className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>Customize</span>
            </Link>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-black hover:text-white text-black rounded text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              {product.type === "DIGITAL" ? "Download" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
