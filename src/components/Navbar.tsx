"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { ShoppingBag, User as UserIcon, LogIn, LogOut, X, Menu } from "lucide-react";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    cartCount,
    setIsCartOpen,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    setSearchQuery,
    customer,
    loginCustomer,
    logoutCustomer
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Customer form state
  const [custEmail, setCustEmail] = useState("");
  const [custName, setCustName] = useState("");

  const handleNavClick = (type: string, category: string = "ALL") => {
    setFilterType(type);
    setFilterCategory(category);
    setSearchQuery("");
    setMobileMenuOpen(false);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custEmail.trim()) return;
    loginCustomer(custEmail, custName);
    setShowAuthModal(false);
  };

  return (
    <div className="w-full bg-white border-b border-black/10 sticky top-0 z-40">
      
      {/* 1. TOP BRAND BANNER: GRAND BLACK BANNER, LARGE ROUND LOGO (NEARLY FULL HEIGHT), CENTERED WHITE SIGNATURE */}
      <div className="w-full bg-black text-white py-4 sm:py-6 md:py-7 px-4 sm:px-8 lg:px-12 border-b border-neutral-800 relative flex items-center justify-between min-h-[135px] sm:min-h-[175px] md:min-h-[195px] overflow-hidden">
        
        {/* Left: LARGE ROUND LOGO (Nearly filling the banner height for maximum visibility) */}
        <div className="z-10 flex items-center">
          <button
            onClick={() => handleNavClick("ALL", "ALL")}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-38 md:h-38 rounded-full bg-white p-2.5 sm:p-3 shadow-2xl flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-white/80 shrink-0 overflow-hidden"
            title="Next Task Home"
          >
            <img
              src="/logo.jpg"
              alt="Next Task Logo"
              className="w-full h-full object-contain"
            />
          </button>
        </div>

        {/* Center: "next task" SIGNATURE IN PURE WHITE (Exact Image, Dead Centered) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <button
            onClick={() => handleNavClick("ALL", "ALL")}
            className="pointer-events-auto cursor-pointer group flex items-center justify-center max-h-full py-1"
            title="Next Task"
          >
            <img
              src="/next-task-white.png"
              alt="next task"
              className="h-28 sm:h-36 md:h-44 lg:h-50 w-auto max-w-[80vw] sm:max-w-[70vw] md:max-w-[580px] object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_4px_24px_rgba(255,255,255,0.35)] select-none"
            />
          </button>
        </div>

        {/* Right: Optical balance space for perfectly centered logo & signature */}
        <div className="z-10 w-24 sm:w-32 md:w-38 shrink-0 hidden sm:block pointer-events-none" />

      </div>

      {/* 2. LOWER NAVIGATION BAR */}
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-8 lg:px-12 h-14 flex items-center justify-between">
        
        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider uppercase text-neutral-700">
          
          <button
            onClick={() => handleNavClick("ALL", "ALL")}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              pathname === "/" && filterType === "ALL" && filterCategory === "ALL"
                ? "text-black border-black font-black"
                : "border-transparent text-neutral-600 hover:text-black"
            }`}
          >
            Shop All
          </button>

          <button
            onClick={() => handleNavClick("CUSTOM", "Diaries")}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              pathname === "/" && (filterCategory === "Diaries" || filterType === "CUSTOM")
                ? "text-black border-black font-black"
                : "border-transparent text-neutral-600 hover:text-black"
            }`}
          >
            Custom Diaries
          </button>

          <button
            onClick={() => handleNavClick("DIGITAL", "ALL")}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              pathname === "/" && filterType === "DIGITAL"
                ? "text-black border-black font-black"
                : "border-transparent text-neutral-600 hover:text-black"
            }`}
          >
            Digital Printables
          </button>

          <button
            onClick={() => handleNavClick("READY", "ALL")}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              pathname === "/" && filterType === "READY"
                ? "text-black border-black font-black"
                : "border-transparent text-neutral-600 hover:text-black"
            }`}
          >
            Ready Stock
          </button>

          <Link
            href="/my-orders"
            className={`transition-colors pb-1 border-b-2 ${
              pathname === "/my-orders"
                ? "text-black border-black font-black"
                : "border-transparent text-neutral-600 hover:text-black"
            }`}
          >
            My Orders
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-black hover:bg-neutral-100 rounded-lg cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Right Actions: Login & Cart */}
        <div className="flex items-center gap-3">
          
          {/* Customer Status or Sign In Button */}
          {customer ? (
            <div className="flex items-center gap-2">
              <Link
                href="/my-orders"
                className="flex items-center gap-1.5 text-xs text-black border border-black/20 px-3 py-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-black" />
                <span className="font-mono text-[11px] max-w-[120px] truncate">{customer.email}</span>
              </Link>
              <button
                onClick={logoutCustomer}
                title="Customer Sign out"
                className="p-1.5 text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-black border border-black px-3.5 py-1.5 rounded-full hover:bg-black hover:text-white transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full bg-black text-white hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black border border-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/10 px-4 py-4 space-y-2 bg-neutral-50 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => handleNavClick("ALL", "ALL")}
            className="w-full text-left py-2 text-black border-b border-black/5"
          >
            Shop All
          </button>
          <button
            onClick={() => handleNavClick("CUSTOM", "Diaries")}
            className="w-full text-left py-2 text-black border-b border-black/5"
          >
            Custom Diaries
          </button>
          <button
            onClick={() => handleNavClick("DIGITAL", "ALL")}
            className="w-full text-left py-2 text-black border-b border-black/5"
          >
            Digital Printables
          </button>
          <button
            onClick={() => handleNavClick("READY", "ALL")}
            className="w-full text-left py-2 text-black border-b border-black/5"
          >
            Ready Stock
          </button>
          <Link
            href="/my-orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-black border-b border-black/5"
          >
            My Orders
          </Link>
        </div>
      )}

      {/* CUSTOMER AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-black/10 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="space-y-5 pt-2">
              <div className="text-center">
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-lg text-black">
                  Customer Sign In
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Enter your email to track your orders and digital downloads
                </p>
              </div>

              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-black text-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Rahul"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-black text-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
