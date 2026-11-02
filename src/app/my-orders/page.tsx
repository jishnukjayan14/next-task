"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import { Package, Download, Sparkles } from "lucide-react";
import { downloadPrintableDocument } from "@/utils/generatePdf";

export default function MyOrdersPage() {
  const { orders, customer } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h1 className="font-sans font-black text-3xl uppercase tracking-wider text-black">
            My Orders
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Track your shipments and access your instant digital printable downloads
          </p>
        </div>

        {customer && (
          <div className="text-xs bg-neutral-100 text-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-200">
            Customer: <strong className="text-black font-mono">{customer.email}</strong>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200 space-y-3">
          <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base uppercase tracking-wider text-black">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Order your personalized diaries, notebooks, and productivity trackers today!
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="px-5 py-2.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider inline-block"
            >
              Shop Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase font-mono tracking-widest">
                    ORDER NO
                  </span>
                  <span className="font-mono font-bold text-black text-sm">
                    {order.orderNumber}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase font-mono tracking-widest">
                    DATE
                  </span>
                  <span className="text-neutral-700 font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase font-mono tracking-widest">
                    TOTAL
                  </span>
                  <span className="font-mono font-bold text-black text-sm">
                    ₹{order.totalAmount}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded font-bold">
                    PAID (Razorpay)
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="p-5 divide-y divide-neutral-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-black truncate">
                          {item.product.title}
                        </h4>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          Qty: {item.quantity} • ₹{item.product.price}
                        </div>

                        {item.customText && (
                          <div className="text-xs bg-neutral-100 text-black px-2 py-0.5 rounded border border-neutral-300 inline-flex items-center gap-1.5 font-serif font-bold">
                            <span>Personalized Name: <strong>&ldquo;{item.customText}&rdquo;</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {item.product.type === "DIGITAL" ? (
                        <button
                          onClick={() => downloadPrintableDocument(item.product.title, "re-download")}
                          className="w-full sm:w-auto px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-neutral-100 text-black border border-neutral-300 px-2.5 py-1 rounded">
                          {order.fulfillmentStatus}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {order.shippingAddress && (
                <div className="p-3.5 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-600 flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <span className="font-bold text-black">Shipping to: </span>
                    {order.shippingAddress.fullName}, {order.shippingAddress.addressLine}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                  </div>
                  <div className="text-neutral-500 font-mono">
                    Phone: {order.shippingAddress.phone}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
