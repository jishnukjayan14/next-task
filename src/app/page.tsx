"use client";

import React, { useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { Search, X } from "lucide-react";

export default function Home() {
  const {
    products,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery
  } = useStore();

  const categories = ["ALL", "Diaries", "Planners", "Trackers", "Bookmarks", "To-Do Lists"];

  // Filter products based on global navbar filter + search + sub-category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Type match (from Navbar)
      const matchesType =
        filterType === "ALL" ||
        (filterType === "CUSTOM" && p.type === "CUSTOM_PHYSICAL") ||
        (filterType === "DIGITAL" && p.type === "DIGITAL") ||
        (filterType === "READY" && p.type === "READY_STOCK");

      // Category match
      const matchesCategory =
        filterCategory === "ALL" || p.category === filterCategory;

      // Search match
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesCategory && matchesSearch;
    });
  }, [products, filterType, filterCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Search & Category Filter Header (Clean & Minimalist) */}
      <div className="space-y-4">
        
        {/* Search Bar & Active Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Active filter text indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-black">
              {filterType === "ALL" && filterCategory === "ALL" && "All Products"}
              {filterType === "CUSTOM" && "Custom Made (Diaries & Bookmarks)"}
              {filterType === "DIGITAL" && "Digital Printables (Instant Download)"}
              {filterType === "READY" && "Ready Stock Essentials"}
              {filterCategory !== "ALL" && ` • ${filterCategory}`}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              ({filteredProducts.length} items)
            </span>

            {/* Clear filters button if filtered */}
            {(filterType !== "ALL" || filterCategory !== "ALL" || searchQuery) && (
              <button
                onClick={() => {
                  setFilterType("ALL");
                  setFilterCategory("ALL");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-black underline cursor-pointer ml-2"
              >
                <X className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search diaries, planners, bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-neutral-100 pb-3">
          <span className="text-neutral-400 font-mono text-[10px] uppercase mr-1">Categories:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-md whitespace-nowrap text-[11px] font-semibold transition-colors cursor-pointer ${
                filterCategory === cat
                  ? "bg-black text-white font-bold"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {cat === "ALL" ? "All" : cat}
            </button>
          ))}
        </div>

      </div>

      {/* Main Direct Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-xl border border-neutral-200 p-8 space-y-3">
          <p className="text-neutral-500 text-xs">
            No products found matching your current filter.
          </p>
          <button
            onClick={() => {
              setFilterType("ALL");
              setFilterCategory("ALL");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
