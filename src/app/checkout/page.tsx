"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, ShippingAddress } from "@/context/StoreContext";
import { RazorpayModal } from "@/components/RazorpayModal";
import { ArrowLeft, ArrowRight, Lock, Truck, Download } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, hasPhysicalInCart, customer, createOrder } = useStore();

  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: customer?.name || "",
    phone: "9846012345",
    addressLine: "TC 24/1102, Skyline Avenue",
    city: "Kochi",
    state: "Kerala",
    pincode: "682001",
  });

  const [customerEmail, setCustomerEmail] = useState(customer?.email || "customer@example.com");
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [addressErrors, setAddressErrors] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-bold text-xl text-black uppercase">കാർട്ടിൽ സാധനങ്ങൾ ഒന്നുമില്ല</h2>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-black text-white rounded text-xs font-bold uppercase tracking-wider"
        >
          തിരികെ സ്റ്റോറിലേക്ക്
        </Link>
      </div>
    );
  }

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasPhysicalInCart) {
      if (!shipping.fullName || !shipping.phone || !shipping.addressLine || !shipping.pincode) {
        setAddressErrors("ദയവായി ഷിപ്പിംഗ് അഡ്രസ്സിലെ എല്ലാ വിവരങ്ങളും നൽകുക.");
        return;
      }
    }
    setAddressErrors(null);
    setIsRazorpayOpen(true);
  };

  const handleRazorpaySuccess = (paymentId: string) => {
    const newOrder = createOrder(hasPhysicalInCart ? shipping : undefined, paymentId);
    setIsRazorpayOpen(false);
    router.push(`/order-success?orderId=${newOrder.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Checkout Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleStartPayment} className="space-y-6">
            
            {/* Contact */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-xs space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                1. Contact Details
              </h3>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Email Address (ഇമെയിൽ)*
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Shipping Address */}
            {hasPhysicalInCart ? (
              <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-black flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>2. Delivery Address</span>
                  </h3>
                  <span className="text-[10px] bg-neutral-100 text-black px-2 py-0.5 rounded font-mono uppercase">
                    Free Courier
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        required
                        value={shipping.fullName}
                        onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Mobile Number*
                      </label>
                      <input
                        type="tel"
                        required
                        value={shipping.phone}
                        onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Address Line*
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={shipping.addressLine}
                      onChange={(e) => setShipping({ ...shipping, addressLine: e.target.value })}
                      className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        City*
                      </label>
                      <input
                        type="text"
                        required
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        State*
                      </label>
                      <input
                        type="text"
                        required
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Pincode*
                      </label>
                      <input
                        type="text"
                        required
                        value={shipping.pincode}
                        onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                        className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-4 flex items-center gap-2.5 text-xs text-neutral-700">
                <Download className="w-5 h-5 text-black shrink-0" />
                <span>ഡിജിറ്റൽ ഡൗൺലോഡ് മാത്രമായതിനാൽ ഷിപ്പിംഗ് വിലാസം ആവശ്യമില്ല.</span>
              </div>
            )}

            {addressErrors && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
                {addressErrors}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Pay ₹{cartTotal} via Razorpay (റേസർപേ വഴി അടയ്ക്കുക)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Review */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-black pb-2 border-b border-neutral-100">
              Review Order
            </h3>

            <div className="space-y-3 max-h-[360px] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 pb-3 border-b border-neutral-100 last:border-b-0">
                  <div className="w-12 h-12 rounded bg-neutral-100 overflow-hidden shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-black truncate">{item.product.title}</h4>
                    <div className="text-[11px] text-neutral-500 font-mono">Qty: {item.quantity} × ₹{item.product.price}</div>
                    {item.customText && (
                      <div className="text-[10px] bg-neutral-100 text-black px-1.5 py-0.5 rounded mt-1 inline-block">
                        Print: <strong>&ldquo;{item.customText}&rdquo;</strong>
                      </div>
                    )}
                  </div>
                  <div className="font-mono font-bold text-xs text-black">
                    ₹{item.product.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-base text-black">
              <span>Total Payable:</span>
              <span className="font-mono">₹{cartTotal}</span>
            </div>
          </div>
        </div>

      </div>

      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={cartTotal}
        customerName={shipping.fullName}
        customerEmail={customerEmail}
        customerPhone={shipping.phone}
        onSuccess={handleRazorpaySuccess}
      />

    </div>
  );
}
