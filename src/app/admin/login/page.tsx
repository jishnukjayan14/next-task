"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Shield, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, isAdminLoggedIn } = useStore();
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState(false);

  // If already logged in, redirect to admin
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      router.push("/admin");
    }
  }, [isAdminLoggedIn, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(adminKey);
    if (success) {
      setError(false);
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-neutral-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-black/10 p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="font-sans font-black text-2xl uppercase tracking-wider text-black">
            Next Task Admin Portal
          </h2>
          <p className="text-xs text-neutral-500">
            സ്റ്റോർ അഡ്മിൻമാർക്ക് മാത്രമുള്ള സെപ്പറേറ്റ് ലോഗിൻ
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold text-center">
            തെറ്റായ പാസ്‌വേഡ്! (Default Passcode: admin123)
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              അഡ്മിൻ പാസ്‌വേഡ് (Admin Passcode)*
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full text-xs px-3.5 py-3 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-black text-black"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute right-3 top-3.5" />
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Default password: <code className="bg-neutral-100 px-1 py-0.5 rounded">admin123</code>
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>Admin Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-100">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-black"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>കസ്റ്റമർ സ്റ്റോറിലേക്ക് തിരികെ പോകുക</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
