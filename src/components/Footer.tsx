"use client";

import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-14 pb-10 border-t border-neutral-800">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        
        {/* Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg p-1 overflow-hidden shrink-0">
                <img src="/logo.jpg" alt="Next Task Logo" className="w-full h-full object-contain" />
              </div>
              <img
                src="/next-task-white.png"
                alt="next task"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
              A premium minimalist stationery studio crafting personalized diaries, planners, to-do lists, and productivity printables.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link href="/?category=Diaries" className="hover:text-white transition-colors">Custom Leather Diaries</Link></li>
              <li><Link href="/?category=Planners" className="hover:text-white transition-colors">Daily & Goal Planners</Link></li>
              <li><Link href="/?type=DIGITAL" className="hover:text-white transition-colors">Instant Printable PDFs</Link></li>
              <li><Link href="/?category=Bookmarks" className="hover:text-white transition-colors">Engraved Bookmarks</Link></li>
              <li><Link href="/?type=READY_STOCK" className="hover:text-white transition-colors">Ready Stock Desk Pads</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link href="/my-orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><span className="text-neutral-500">Shipping & Delivery Info</span></li>
              <li><span className="text-neutral-500">Privacy Policy</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3">
              Store Support
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <p>Email: contact@nexttask.in</p>
              <p>Kerala, India</p>
              <p className="text-neutral-500">Razorpay UPI & Cards Secured</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-mono">
          <div>
            © {new Date().getFullYear()} NEXT TASK. All rights reserved.
          </div>
          <div>
            Handcrafted with care in India
          </div>
        </div>

      </div>
    </footer>
  );
};
