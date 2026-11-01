"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { ShoppingBag, User as UserIcon, LogIn, LogOut, X, Menu, Shield, Lock, Eye, EyeOff } from "lucide-react";

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
    logoutCustomer,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    orders
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"customer" | "admin">("customer");

  // Customer form state
  const [custEmail, setCustEmail] = useState("");
  const [custName, setCustName] = useState("");

  // Admin form state
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(adminPassword);
    if (success) {
      setAdminError(false);
      setShowAuthModal(false);
      router.push("/admin");
    } else {
      setAdminError(true);
    }
  };

  return (
    <div className="w-full bg-white border-b border-black/10 sticky top-0 z-40">
      
      {/* 1. TOP BRAND BANNER: GRAND BLACK BANNER, LARGE ROUND LOGO (NEARLY FULL HEIGHT), CENTERED WHITE SIGNATURE */}
      <div className="w-full bg-black text-white py-4 sm:py-6 md:py-7 px-4 sm:px-8 border-b border-neutral-800 relative flex items-center justify-between min-h-[135px] sm:min-h-[175px] md:min-h-[195px] overflow-hidden">
        
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

        {/* Right: Quick Admin Access pill */}
        <div className="z-10 flex items-center">
          {isAdminLoggedIn ? (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-mono border border-neutral-700 transition-all shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Admin Active</span>
              <span className="bg-white text-black font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {orders.length}
              </span>
            </Link>
          ) : (
            <button
              onClick={() => {
                setAuthTab("admin");
                setShowAuthModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white text-[11px] font-mono border border-neutral-700 transition-all cursor-pointer"
              title="Store Owner Portal"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Admin Access</span>
            </button>
          )}
        </div>

      </div>

      {/* 2. LOWER NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
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
            Shop All (എല്ലാം)
          </button>

          <button
            onClick={() => handleNavClick("CUSTOM", "Diaries")}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              pathname === "/" && (filterCategory === "Diaries" || filterType === "CUSTOM")
                ? "text-black border-black font-black"
                : "border-transparent text-neutral-600 hover:text-black"
            }`}
          >
            Custom Diaries (കസ്റ്റം ഡയറികൾ)
          </button>

          <button
            onClick={() => handleNavClick("DIGITAL", "ALL")}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              pathname === "/" && filterType === "DIGITAL"
                ? "text-black border-black font-black"
                : "border-transparent text-neutral-600 hover:text-black"
            }`}
          >
            Digital Printables (ഡൗൺലോഡുകൾ)
          </button>

          <button
            onClick={() => handleNavClick("READY", "ALL")}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              pathname === "/" && filterType === "READY"
                ? "text-black border-black font-black"
                : "border-transparent text-neutral-600 hover:text-black"
            }`}
          >
            Ready Stock (റെഡി സ്റ്റോക്ക്)
          </button>

          <Link
            href="/my-orders"
            className={`transition-colors pb-1 border-b-2 ${
              pathname === "/my-orders"
                ? "text-black border-black font-black"
                : "border-transparent text-neutral-600 hover:text-black"
            }`}
          >
            My Orders (ഓർഡറുകൾ)
          </Link>

          {/* If Admin is logged in, show dedicated Admin Dashboard link */}
          {isAdminLoggedIn && (
            <Link
              href="/admin"
              className="bg-black text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Panel ({orders.length} Orders)</span>
            </Link>
          )}
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
          
          {/* Customer / Admin Status or Sign In Button */}
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
              onClick={() => {
                setAuthTab("customer");
                setShowAuthModal(true);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-black border border-black px-3.5 py-1.5 rounded-full hover:bg-black hover:text-white transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In (ലോഗിൻ)</span>
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
            Shop All (എല്ലാം)
          </button>
          <button
            onClick={() => handleNavClick("CUSTOM", "Diaries")}
            className="w-full text-left py-2 text-black border-b border-black/5"
          >
            Custom Diaries (കസ്റ്റം ഡയറികൾ)
          </button>
          <button
            onClick={() => handleNavClick("DIGITAL", "ALL")}
            className="w-full text-left py-2 text-black border-b border-black/5"
          >
            Digital Printables (ഡൗൺലോഡുകൾ)
          </button>
          <button
            onClick={() => handleNavClick("READY", "ALL")}
            className="w-full text-left py-2 text-black border-b border-black/5"
          >
            Ready Stock (റെഡി സ്റ്റോക്ക്)
          </button>
          <Link
            href="/my-orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-black border-b border-black/5"
          >
            My Orders (എന്റെ ഓർഡറുകൾ)
          </Link>

          {/* Admin link on mobile */}
          <div className="pt-2">
            {isAdminLoggedIn ? (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 bg-black text-white rounded-lg font-bold"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Admin Dashboard ({orders.length} Orders)</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthTab("admin");
                  setShowAuthModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-black rounded-lg text-black font-bold cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login (സ്റ്റോർ മാനേജ്‌മെന്റ്)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* COMBINED AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-black/10 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* TAB SELECTOR */}
            <div className="flex border-b border-neutral-200 mb-5">
              <button
                type="button"
                onClick={() => setAuthTab("customer")}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  authTab === "customer"
                    ? "border-black text-black font-black"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                }`}
              >
                Customer Login
              </button>

              <button
                type="button"
                onClick={() => setAuthTab("admin")}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authTab === "admin"
                    ? "border-black text-black font-black"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Admin Login 🔒</span>
              </button>
            </div>

            {/* TAB 1: CUSTOMER SIGN IN */}
            {authTab === "customer" && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-sans font-bold text-base text-black">
                    കസ്റ്റമർ ലോഗിൻ
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    ഓർഡറുകൾ ചെയ്യാനും PDF ഡൗൺലോഡ് ചെയ്യാനും ഇമെയിൽ നൽകുക
                  </p>
                </div>

                <form onSubmit={handleCustomerSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      ഇമെയിൽ വിലാസം (Email ID)*
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
                      പേര് (Your Name)
                    </label>
                    <input
                      type="text"
                      placeholder="ഉദാ: Rahul"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-black text-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Continue as Customer
                  </button>
                </form>

                <div className="pt-2 text-center border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setAuthTab("admin")}
                    className="text-[11px] text-neutral-500 hover:text-black flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>സ്റ്റോർ ഉടമയാണോ? <strong>Admin Login</strong> ഇവിടെ ചെയ്യാം</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SECURE STORE ADMIN LOGIN */}
            {authTab === "admin" && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-black">
                    സ്റ്റോർ അഡ്മിൻ പോർട്ടൽ
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    കസ്റ്റമർ ഓർഡറുകൾ കാണാനും മാനേജ് ചെയ്യാനും പാസ്‌വേഡ് നൽകുക
                  </p>
                </div>

                {adminError && (
                  <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold text-center">
                    തെറ്റായ പാസ്‌വേഡ്! (Password: admin123)
                  </div>
                )}

                <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      അഡ്മിൻ പാസ്‌വേഡ് (Admin Passcode)*
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter admin password"
                        className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-black text-black"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-neutral-400 hover:text-black cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Default password: <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">admin123</code>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Login to Admin Dashboard</span>
                  </button>
                </form>

                <div className="pt-2 text-center border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setAuthTab("customer")}
                    className="text-[11px] text-neutral-500 hover:text-black cursor-pointer"
                  >
                    ← തിരികെ കസ്റ്റമർ ലോഗിനിലേക്ക്
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
