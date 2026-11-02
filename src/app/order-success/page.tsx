"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import { CheckCircle2, Download, Package, ArrowRight, FileText } from "lucide-react";
import { downloadPrintableDocument } from "@/utils/generatePdf";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { orders } = useStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Order not found.</h2>
        <Link href="/" className="mt-4 inline-block text-xs text-black underline">
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      
      {/* Success Card Header */}
      <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm text-center space-y-3">
        <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-black px-2.5 py-1 rounded">
            Razorpay Verified ({order.razorpayPaymentId})
          </span>
          <h1 className="font-sans font-black text-2xl uppercase tracking-wider text-black mt-3">
            Order Confirmed!
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Order Number: <span className="font-mono font-bold text-black">{order.orderNumber}</span>
          </p>
        </div>

        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 max-w-md mx-auto text-xs text-neutral-600">
          Order confirmation has been sent to <strong>{order.customerEmail}</strong>.
        </div>
      </div>

      {/* Digital Downloads */}
      {order.hasDigitalItems && (
        <div className="bg-neutral-50 rounded-2xl p-6 border border-black space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-base uppercase tracking-wider text-black">
                Instant Digital Downloads
              </h2>
              <p className="text-xs text-neutral-500">
                Click below to download your high-resolution printable PDF files immediately:
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {order.items
              .filter((i) => i.product.type === "DIGITAL")
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-black" />
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-black">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        Print-ready PDF Template
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadPrintableDocument(item.product.title, "purchased")}
                    className="w-full sm:w-auto px-4 py-2 bg-black hover:bg-neutral-800 text-white font-bold rounded text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Physical Items */}
      {order.hasPhysicalItems && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Package className="w-5 h-5 text-black" />
              <div>
                <h2 className="font-bold text-sm uppercase tracking-wider text-black">
                  Fulfillment Status
                </h2>
                <p className="text-xs text-neutral-500">
                  Status: <span className="font-bold text-black">{order.fulfillmentStatus}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {order.items
              .filter((i) => i.product.type !== "DIGITAL")
              .map((item) => (
                <div key={item.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex gap-3">
                  <div className="w-12 h-12 rounded bg-white overflow-hidden shrink-0 border border-neutral-200">
                    <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-black truncate">{item.product.title}</h4>
                    <div className="text-[11px] text-neutral-500">Qty: {item.quantity}</div>
                    {item.customText && (
                      <div className="mt-1 text-[11px] bg-black text-white px-2 py-0.5 rounded inline-block font-serif font-bold">
                        Print Name: &ldquo;{item.customText}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
        <Link
          href="/my-orders"
          className="px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider text-center transition-all"
        >
          View All Orders
        </Link>
        <Link
          href="/"
          className="px-6 py-3 bg-white hover:bg-neutral-100 text-black border border-black rounded-lg text-xs font-bold uppercase tracking-wider text-center transition-all"
        >
          Back to Store
        </Link>
      </div>

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
