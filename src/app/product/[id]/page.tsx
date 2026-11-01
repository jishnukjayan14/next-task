"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { CustomizerPreview } from "@/components/CustomizerPreview";
import { Sparkles, Download, Package, ArrowLeft, Check, ShoppingBag, Zap, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { downloadPrintableDocument } from "@/utils/generatePdf";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products, addToCart } = useStore();

  const product = products.find((p) => p.id === params.id) || products[0];

  const allImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const [activeImage, setActiveImage] = useState(allImages[0]);

  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    product.coverColors && product.coverColors[0] ? product.coverColors[0].name : "Obsidian Black"
  );
  const [customError, setCustomError] = useState(false);

  const handleAddToCart = (buyNow = false) => {
    if (product.allowsPersonalization && !customText.trim()) {
      setCustomError(true);
      return;
    }
    setCustomError(false);
    addToCart(product, quantity, customText.trim() || undefined, selectedColor);

    if (buyNow) {
      router.push("/checkout");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-3">
          {/* Main Large Image */}
          <div className="rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 aspect-4/3 relative shadow-xs">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                {product.badge}
              </span>
            )}
          </div>

          {/* Multiple Image Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img ? "border-black ring-1 ring-black" : "border-neutral-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Digital Preview trigger if printable */}
          {product.type === "DIGITAL" && (
            <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Download className="w-5 h-5 text-black" />
                <div>
                  <h4 className="text-xs font-bold text-black uppercase">Sample Preview</h4>
                  <p className="text-[11px] text-neutral-500">ഫ്രീ പ്രിവ്യൂ ഷീറ്റ് ഡൗൺലോഡ് ചെയ്തു പരിശോധിക്കാം</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => downloadPrintableDocument(product.title, "preview")}
                className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Download Preview
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Details & Customizer */}
        <div className="lg:col-span-6 space-y-5">
          
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
              {product.category}
            </div>
            <h1 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
              {product.title}
            </h1>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              {product.subtitle}
            </p>
          </div>

          {/* Price Bar */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-mono font-bold text-2xl text-black">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-400 line-through font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
              {product.type}
            </span>
          </div>

          {/* Color Selection if available */}
          {product.coverColors && product.coverColors.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                കവർ കളർ: <span className="font-normal text-neutral-500">{selectedColor}</span>
              </label>
              <div className="flex gap-2">
                {product.coverColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      selectedColor === color.name
                        ? "border-black bg-neutral-100 text-black font-bold ring-1 ring-black"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: color.hex }} />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customizer Component */}
          {product.allowsPersonalization && (
            <div className="space-y-2">
              <CustomizerPreview
                customText={customText}
                onTextChange={(t) => {
                  setCustomText(t);
                  if (customError && t.trim()) setCustomError(false);
                }}
                selectedColor={selectedColor}
                placeholder={product.personalizationPlaceholder}
                category={product.category}
              />
              {customError && (
                <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-lg border border-red-200">
                  ⚠️ ദയവായി കവറിൽ പ്രിന്റ് ചെയ്യേണ്ട പേര് നൽകുക.
                </p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">Quantity:</span>
            <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-neutral-600 hover:bg-neutral-100 text-xs font-bold"
              >
                -
              </button>
              <span className="px-3 text-xs font-bold text-black font-mono">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-neutral-600 hover:bg-neutral-100 text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleAddToCart(false)}
              className="py-3 px-4 bg-white hover:bg-neutral-50 text-black border-2 border-black rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddToCart(true)}
              className="py-3 px-4 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Features */}
          <div className="pt-4 border-t border-neutral-200 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Product Details:
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {product.description}
            </p>
            <ul className="space-y-1.5 pt-1">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-neutral-600">
                  <Check className="w-3.5 h-3.5 text-black shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
