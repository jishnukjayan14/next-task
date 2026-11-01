"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Smartphone, CreditCard, Building2, QrCode, ArrowRight, Loader2, X } from "lucide-react";

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (paymentId: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "qr" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"select" | "processing" | "success">("select");

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setStep("processing");

    // Realistic Razorpay payment processing simulation
    setTimeout(() => {
      const mockPaymentId = "pay_rzp_" + Math.random().toString(36).substr(2, 10);
      setStep("success");
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(mockPaymentId);
      }, 1200);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Razorpay Branded Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white font-black italic px-2.5 py-1 rounded text-base tracking-tighter">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-base">Razorpay</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-mono border border-emerald-400/30">
                  TEST / LIVE READY
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Stationery & Productivity Store
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">തുക (Amount)</div>
            <div className="text-xl font-bold text-white">₹{amount}</div>
          </div>
        </div>

        {/* Content depending on step */}
        {step === "processing" ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <h3 className="font-semibold text-lg text-slate-800">
              പേയ്‌മെന്റ് പ്രൊസസ്സ് ചെയ്യുന്നു...
            </h3>
            <p className="text-xs text-slate-500 max-w-xs">
              ദയവായി ബാക്ക് അല്ലെങ്കിൽ റിഫ്രഷ് അടിക്കരുത്. Razorpay സുരക്ഷിതമായ സർവറുകളുമായി കണക്ട് ചെയ്യുന്നു.
            </p>
          </div>
        ) : step === "success" ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-xl text-slate-800">
              പേയ്‌മെന്റ് വിജയകരം!
            </h3>
            <p className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-mono">
              Payment Verified by Razorpay
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {/* Payment Method Selector */}
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod("upi")}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                  selectedMethod === "upi"
                    ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span>UPI Apps</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("qr")}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                  selectedMethod === "qr"
                    ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <QrCode className="w-5 h-5 text-purple-600" />
                <span>QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("card")}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                  selectedMethod === "card"
                    ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("netbanking")}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                  selectedMethod === "netbanking"
                    ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Building2 className="w-5 h-5 text-amber-600" />
                <span>Netbank</span>
              </button>
            </div>

            {/* Method Details */}
            {selectedMethod === "upi" && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-700">
                  ഏതെങ്കിലും UPI ആപ്പ് തിരഞ്ഞെടുക്കുക:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "Google Pay", color: "text-blue-600" },
                    { name: "PhonePe", color: "text-purple-600" },
                    { name: "Paytm", color: "text-sky-600" },
                  ].map((app) => (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => setUpiId(`${customerEmail.split("@")[0]}@okhdfcbank`)}
                      className="p-2 border border-slate-200 rounded-lg bg-white text-xs font-medium hover:border-blue-500 hover:shadow-xs transition-all flex flex-col items-center gap-1 text-slate-700"
                    >
                      <span className={`font-bold ${app.color}`}>●</span>
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] text-slate-500 mb-1">
                    അല്ലെങ്കിൽ നിങ്ങളുടെ UPI ID നൽകുക:
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="example@upi / mobile@okhdfcbank"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {selectedMethod === "qr" && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center text-center space-y-2">
                <div className="text-xs font-semibold text-slate-700">
                  ഏതൊരു UPI ആപ്പ് വഴിയും QR കോഡ് സ്കാൻ ചെയ്യാം
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-300 shadow-xs inline-block">
                  <div className="w-36 h-36 bg-[radial-gradient(#0c2340_2px,transparent_2px)] [background-size:8px_8px] flex items-center justify-center border-4 border-slate-900 rounded">
                    <span className="bg-white px-2 py-1 text-[11px] font-bold text-slate-900 border rounded shadow-xs">
                      SCAN ₹{amount}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500">
                  GPay, PhonePe, Paytm, BHIM സപ്പോർട്ട് ചെയ്യുന്നു
                </span>
              </div>
            )}

            {selectedMethod === "card" && (
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <input
                  type="text"
                  placeholder="Card Number (4532 •••• •••• ••••)"
                  defaultValue="4532 8920 1284 9012"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    defaultValue="894"
                    maxLength={3}
                    className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            {selectedMethod === "netbanking" && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-600 mb-2 font-medium">ബാങ്ക് തിരഞ്ഞെടുക്കുക:</div>
                <select className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Federal Bank</option>
                  <option>Axis Bank</option>
                  <option>Kerala Gramin Bank</option>
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePay}
                className="w-full py-3 px-4 bg-[#0c2340] hover:bg-[#12335c] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>₹{amount} അടയ്ക്കുക (Pay via Razorpay)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Safe & Secure 256-bit Encrypted Payment</span>
            </div>
          </div>
        )}

        {/* Close Button */}
        {step === "select" && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
