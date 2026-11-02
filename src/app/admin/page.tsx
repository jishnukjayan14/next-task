"use client";

import React, { useState } from "react";
import { useStore, Order } from "@/context/StoreContext";
import {
  Shield,
  Sparkles,
  Package,
  Trash2,
  Edit3,
  Plus,
  LogOut,
  Check,
  X,
  Image as ImageIcon,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Printer,
  QrCode as QrIcon,
  Upload,
  Loader2,
  Sparkles as SparklesIcon
} from "lucide-react";
import Link from "next/link";
import { Product } from "@/data/products";
import { ShippingLabelModal } from "@/components/ShippingLabelModal";
import { processImageFiles } from "@/utils/imageUpload";

export default function AdminPage() {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    orders,
    updateOrderStatus,
    products,
    addProduct,
    updateProduct,
    deleteProduct
  } = useStore();

  // Inline Admin Login State if not logged in
  const [inlinePassword, setInlinePassword] = useState("");
  const [inlineError, setInlineError] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "add_product">("orders");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Editing modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Shipping Label modal state
  const [selectedLabelOrder, setSelectedLabelOrder] = useState<Order | null>(null);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);

  // New Product Form state
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newOriginalPrice, setNewOriginalPrice] = useState("");
  const [newCategory, setNewCategory] = useState<Product["category"]>("Diaries");
  const [newType, setNewType] = useState<Product["type"]>("CUSTOM_PHYSICAL");
  const [newStock, setNewStock] = useState("20");
  const [newDescription, setNewDescription] = useState("");
  const [newImages, setNewImages] = useState<string[]>([]);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingEditImages, setIsUploadingEditImages] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // If not logged in, show inline secure login card right here
  if (!isAdminLoggedIn) {
    const handleInlineLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const success = loginAdmin(inlinePassword);
      if (success) {
        setInlineError(false);
      } else {
        setInlineError(true);
      }
    };

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-neutral-100">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-neutral-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="font-sans font-black text-2xl uppercase tracking-wider text-black">
              Next Task Admin Portal
            </h2>
            <p className="text-xs text-neutral-500">
              Restricted administrative portal for store owners and fulfillment staff
            </p>
          </div>

          {inlineError && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold text-center">
              Incorrect passcode! (Default Password: admin123)
            </div>
          )}

          <form onSubmit={handleInlineLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Admin Passcode *
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={inlinePassword}
                  onChange={(e) => setInlinePassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full text-xs px-3.5 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-black"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Default password: <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">admin123</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-neutral-100">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-black"
            >
              ← Return to Customer Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle Add Image via URL in Create Form
  const handleAddImage = () => {
    if (tempImageUrl.trim()) {
      setNewImages([...newImages, tempImageUrl.trim()]);
      setTempImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setNewImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  // Device upload for new product
  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingImages(true);
      const optimizedUrls = await processImageFiles(files);
      if (optimizedUrls.length > 0) {
        setNewImages((prev) => [...prev, ...optimizedUrls]);
      }
    } catch (err) {
      console.error("Error processing images:", err);
      alert("Failed to process one or more images from device. Please try again.");
    } finally {
      setIsUploadingImages(false);
      e.target.value = "";
    }
  };

  // Device upload for edit product modal
  const handleEditDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    try {
      setIsUploadingEditImages(true);
      const optimizedUrls = await processImageFiles(files);
      if (optimizedUrls.length > 0) {
        const existing = editingProduct.images && editingProduct.images.length > 0
          ? editingProduct.images
          : [editingProduct.imageUrl];
        const updated = [...existing, ...optimizedUrls];
        setEditingProduct({
          ...editingProduct,
          images: updated,
          imageUrl: updated[0] || editingProduct.imageUrl
        });
      }
    } catch (err) {
      console.error("Error processing edit images:", err);
      alert("Failed to process one or more images from device. Please try again.");
    } finally {
      setIsUploadingEditImages(false);
      e.target.value = "";
    }
  };

  const handleSetEditMainImage = (index: number) => {
    if (!editingProduct || index === 0) return;
    const currentImgs = editingProduct.images && editingProduct.images.length > 0
      ? editingProduct.images
      : [editingProduct.imageUrl];
    const selected = currentImgs[index];
    const rest = currentImgs.filter((_, i) => i !== index);
    const updated = [selected, ...rest];
    setEditingProduct({
      ...editingProduct,
      images: updated,
      imageUrl: updated[0]
    });
  };

  // Handle Create Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    if (newImages.length === 0) {
      alert("Please add at least 1 image for the product using 'Choose Photos from Device' or by URL.");
      return;
    }

    addProduct({
      id: "prod-" + Date.now(),
      title: newTitle,
      subtitle: newSubtitle,
      price: parseFloat(newPrice),
      originalPrice: newOriginalPrice ? parseFloat(newOriginalPrice) : undefined,
      category: newCategory,
      type: newType,
      stock: newType === "READY_STOCK" ? parseInt(newStock) || 0 : undefined,
      description: newDescription,
      features: [
        "100 GSM Premium Paper",
        "Handcrafted Finish",
        "Quality Inspected by Next Task"
      ],
      rating: 5.0,
      reviewsCount: 1,
      imageUrl: newImages[0],
      images: newImages,
      allowsPersonalization: newType === "CUSTOM_PHYSICAL",
      personalizationPlaceholder: newType === "CUSTOM_PHYSICAL" ? "Custom name to emboss on cover" : undefined,
      badge: newType === "CUSTOM_PHYSICAL" ? "Custom Made" : newType === "DIGITAL" ? "Instant Download" : "Ready to Ship"
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab("products");
    }, 1200);

    // Reset fields
    setNewTitle("");
    setNewSubtitle("");
    setNewPrice("");
    setNewOriginalPrice("");
    setNewDescription("");
    setNewImages([]);
  };

  // Handle Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  // Handle Delete Product
  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}" from the store catalog?`)) {
      deleteProduct(id);
    }
  };

  // Filter Orders
  const filteredOrders = filterStatus === "ALL"
    ? orders
    : orders.filter((o) => o.fulfillmentStatus === filterStatus);

  return (
    <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-black text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-black text-2xl uppercase tracking-wider">
                Next Task Admin Dashboard
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE ADMIN
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Order processing queue, custom name embossing details, shipping labels & catalog management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-white font-medium flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Customer Store</span>
          </Link>
          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-800/50 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Admin Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 gap-4 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "orders"
              ? "border-black text-black font-black"
              : "border-transparent text-neutral-400 hover:text-black"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders & Custom Printing ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "products"
              ? "border-black text-black font-black"
              : "border-transparent text-neutral-400 hover:text-black"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("add_product")}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "add_product"
              ? "border-black text-black font-black"
              : "border-transparent text-neutral-400 hover:text-black"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* TAB 1: ORDERS LIST (WITH CUSTOM PRINT NAME HIGHLIGHT & SHIPPING LABEL PRINT) */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-neutral-400 font-semibold uppercase text-[10px]">Filter Status:</span>
            {["ALL", "MAKING", "READY_TO_SHIP", "SHIPPED", "COMPLETED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  filterStatus === st
                    ? "bg-black text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {st === "ALL" ? "All Orders" : st.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-500">
              No orders found in this category.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden"
                >
                  {/* Order Head */}
                  <div className="p-4 sm:p-5 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-black text-sm">{ord.orderNumber}</span>
                        <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded font-bold">
                          PAID • {ord.razorpayPaymentId}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {new Date(ord.createdAt).toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-700">Workflow Status:</span>
                      <select
                        value={ord.fulfillmentStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className="text-xs font-bold py-1.5 px-3 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
                      >
                        <option value="MAKING">🔨 In Making / Crafting</option>
                        <option value="READY_TO_SHIP">📦 Packed & Ready to Ship</option>
                        <option value="SHIPPED">🚚 Shipped / In Transit</option>
                        <option value="COMPLETED">✅ Delivered to Customer</option>
                      </select>
                    </div>
                  </div>

                  {/* Body: Items & Custom Names to Print */}
                  <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Items */}
                    <div className="lg:col-span-7 space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Order Items ({ord.items.length})
                      </h4>

                      {ord.items.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-xl border ${
                            item.customText ? "bg-neutral-50 border-black" : "bg-white border-neutral-200"
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                              <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-xs text-black truncate">{item.product.title}</h5>
                              <div className="text-[11px] text-neutral-500 font-mono">Qty: {item.quantity} • ₹{item.product.price}</div>

                              {/* CRITICAL: Custom Name Highlight for Owner to Print */}
                              {item.customText && (
                                <div className="mt-2 p-3 bg-black text-white rounded-lg">
                                  <span className="text-[10px] uppercase tracking-widest text-neutral-300 block font-bold">
                                    ✦ NAME TO EMBOSS / PRINT ON COVER:
                                  </span>
                                  <span className="font-serif text-base font-bold text-white block mt-1 tracking-wider">
                                    &ldquo;{item.customText}&rdquo;
                                  </span>
                                  {item.selectedColor && (
                                    <span className="text-[10px] text-neutral-400 mt-1 block">
                                      Cover Color: <strong>{item.selectedColor}</strong>
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Customer & Shipping Details & Label Printing */}
                    <div className="lg:col-span-5 bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3 text-xs">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Customer & Shipping Information
                      </h4>

                      <div className="font-bold text-black text-sm">{ord.customerName}</div>
                      <div className="flex items-center gap-1.5 text-neutral-600">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{ord.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-600">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{ord.customerPhone}</span>
                      </div>

                      {ord.shippingAddress && (
                        <div className="pt-2 border-t border-neutral-200 text-neutral-700 space-y-0.5">
                          <div className="font-semibold text-black flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Delivery Address:</span>
                          </div>
                          <p>{ord.shippingAddress.addressLine}</p>
                          <p>{ord.shippingAddress.city}, {ord.shippingAddress.state} - <strong className="text-black font-mono">{ord.shippingAddress.pincode}</strong></p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-black">
                        <span>Total Paid (Online):</span>
                        <span className="font-mono text-sm">₹{ord.totalAmount}</span>
                      </div>

                      {/* PRINT SHIPPING LABEL BUTTON (WITH QR CODE) */}
                      {ord.shippingAddress ? (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLabelOrder(ord);
                              setIsLabelModalOpen(true);
                            }}
                            className="w-full py-2.5 px-3 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Shipping Label (with QR Code)</span>
                          </button>
                        </div>
                      ) : (
                        <div className="pt-2 text-[11px] text-neutral-500 italic bg-white p-2 rounded border border-neutral-200 text-center">
                          Instant Digital Download (No shipping required)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS CATALOG (WITH EDIT & DELETE) */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Active Store Products ({products.length})
            </h3>
            <button
              onClick={() => setActiveTab("add_product")}
              className="px-3.5 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs p-4 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="aspect-4/3 rounded-xl overflow-hidden bg-neutral-100 relative mb-3">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {p.type}
                    </span>
                    {p.images && p.images.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-white/90 text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {p.images.length} images
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-black line-clamp-1">{p.title}</h4>
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{p.subtitle}</p>

                  <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-neutral-100">
                    <span className="font-bold text-base text-black font-mono">₹{p.price}</span>
                    <span className="text-neutral-500 font-mono text-[11px]">{p.category}</span>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setEditingProduct({ ...p, images: p.images || [p.imageUrl] })}
                    className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-red-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ADD NEW PRODUCT (WITH MULTI-IMAGE SUPPORT) */}
      {activeTab === "add_product" && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="font-sans font-black text-xl text-black uppercase tracking-wider">
              Add New Product to Store
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Publish custom diaries, desk pads, bookmarks, or downloadable printables
            </p>
          </div>

          {formSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold text-center">
              ✅ Product successfully added to catalog!
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Custom Minimal Daily Diary"
                className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="Handcrafted Leather Diary with Custom Name Embossing"
                className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="399"
                  className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Original MRP (₹)
                </label>
                <input
                  type="number"
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(e.target.value)}
                  placeholder="599"
                  className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
                >
                  <option value="Diaries">Diaries</option>
                  <option value="Planners">Planners</option>
                  <option value="Trackers">Trackers</option>
                  <option value="Bookmarks">Bookmarks</option>
                  <option value="To-Do Lists">To-Do Lists</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Product Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
                >
                  <option value="CUSTOM_PHYSICAL">✨ Custom Physical (With Name Embossing)</option>
                  <option value="READY_STOCK">📦 Ready Stock (Instant Dispatch)</option>
                  <option value="DIGITAL">⚡ Digital (Instant Printable PDF)</option>
                </select>
              </div>
            </div>

            {newType === "READY_STOCK" && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Available Stock Count
                </label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
                />
              </div>
            )}

            {/* MULTIPLE IMAGES SECTION */}
            <div className="space-y-3 pt-3 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800">
                    Product Images ({newImages.length})
                  </label>
                  <p className="text-[11px] text-neutral-500">
                    Upload photos directly from your phone or computer. The first image will be the main display cover.
                  </p>
                </div>
                {newImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setNewImages([])}
                    className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
                  >
                    Clear All Photos
                  </button>
                )}
              </div>

              {/* DEVICE UPLOAD BUTTON / DROPZONE */}
              <div className="border-2 border-dashed border-neutral-300 hover:border-black rounded-xl p-4 text-center transition-colors bg-neutral-50/60">
                <input
                  type="file"
                  id="new-product-file-upload"
                  accept="image/*"
                  multiple
                  onChange={handleDeviceUpload}
                  className="hidden"
                />
                <label
                  htmlFor="new-product-file-upload"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs"
                >
                  {isUploadingImages ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Processing Photos...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-white" />
                      <span>Choose Photos from Device</span>
                    </>
                  )}
                </label>
                <p className="text-[10px] text-neutral-500 mt-2">
                  Select 1 or multiple images from your device (JPG, PNG, WEBP). Photos are automatically optimized.
                </p>
              </div>

              {/* OR PASTE URL COLLAPSIBLE / SECONDARY */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="url"
                  placeholder="Or paste an image web URL..."
                  value={tempImageUrl}
                  onChange={(e) => setTempImageUrl(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3.5 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  + Add URL
                </button>
              </div>

              {/* PREVIEW GALLERY */}
              {newImages.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                  {newImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-neutral-100 group shadow-xs ${
                        idx === 0 ? "border-black ring-2 ring-black/20" : "border-neutral-200"
                      }`}
                    >
                      <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                      
                      {/* Top Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 transition-colors cursor-pointer"
                        title="Delete photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Main Cover Badge or Set As Main Button */}
                      {idx === 0 ? (
                        <span className="absolute bottom-1 inset-x-1 bg-black text-white text-[9px] font-bold text-center py-0.5 rounded shadow-xs uppercase tracking-wider">
                          Main Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(idx)}
                          className="absolute bottom-1 inset-x-1 bg-white/95 hover:bg-white text-black text-[9px] font-bold text-center py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
                        >
                          Set as Main
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-lg text-xs text-neutral-600 text-center">
                  📸 No photos added yet. Click <strong>&quot;Choose Photos from Device&quot;</strong> above to upload images for this product.
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Product description, material details, and features..."
                className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            >
              Publish Product to Store
            </button>
          </form>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="font-bold text-base text-black uppercase tracking-wider">
                Edit Product Details
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingProduct.subtitle}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) || undefined })}
                    className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full text-xs p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
                  >
                    <option value="Diaries">Diaries</option>
                    <option value="Planners">Planners</option>
                    <option value="Trackers">Trackers</option>
                    <option value="Bookmarks">Bookmarks</option>
                    <option value="To-Do Lists">To-Do Lists</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Product Type
                  </label>
                  <select
                    value={editingProduct.type}
                    onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value as any, allowsPersonalization: e.target.value === "CUSTOM_PHYSICAL" })}
                    className="w-full text-xs p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
                  >
                    <option value="CUSTOM_PHYSICAL">✨ Custom Physical (With Name Embossing)</option>
                    <option value="READY_STOCK">📦 Ready Stock (Instant Dispatch)</option>
                    <option value="DIGITAL">⚡ Digital (Instant Printable PDF)</option>
                  </select>
                </div>
              </div>

              {editingProduct.type === "READY_STOCK" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Available Stock Count
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black font-mono"
                  />
                </div>
              )}

              {/* Edit Images List */}
              <div className="space-y-3 pt-3 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800">
                      Product Images ({(editingProduct.images || [editingProduct.imageUrl]).length})
                    </label>
                    <p className="text-[10px] text-neutral-500">
                      First image is the main store cover photo
                    </p>
                  </div>
                </div>

                {/* Device Upload for Edit */}
                <div className="border border-dashed border-neutral-300 hover:border-black rounded-xl p-3 text-center bg-neutral-50/60">
                  <input
                    type="file"
                    id="edit-product-file-upload"
                    accept="image/*"
                    multiple
                    onChange={handleEditDeviceUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-product-file-upload"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs"
                  >
                    {isUploadingEditImages ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Processing Photos...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-white" />
                        <span>Upload Photos from Device</span>
                      </>
                    )}
                  </label>
                  <p className="text-[10px] text-neutral-500 mt-1.5">
                    Select new photos from your phone/computer to add to this product.
                  </p>
                </div>

                {/* Optional URL input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or add image URL..."
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    className="flex-1 text-xs px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempImageUrl.trim()) {
                        const updatedImgs = [...(editingProduct.images || [editingProduct.imageUrl]), tempImageUrl.trim()];
                        setEditingProduct({ ...editingProduct, images: updatedImgs, imageUrl: updatedImgs[0] });
                        setTempImageUrl("");
                      }
                    }}
                    className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    + Add URL
                  </button>
                </div>

                {/* Preview Cards with Make Main and Delete */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                  {(editingProduct.images || [editingProduct.imageUrl]).map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 bg-neutral-100 group shadow-xs ${
                        idx === 0 ? "border-black ring-1 ring-black/20" : "border-neutral-200"
                      }`}
                    >
                      <img src={img} alt="edit-preview" className="w-full h-full object-cover" />
                      
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingProduct.images || [editingProduct.imageUrl]).filter((_, i) => i !== idx);
                          setEditingProduct({
                            ...editingProduct,
                            images: updated,
                            imageUrl: updated[0] || ""
                          });
                        }}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 transition-colors cursor-pointer"
                        title="Delete photo"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {idx === 0 ? (
                        <span className="absolute bottom-0.5 inset-x-0.5 bg-black text-white text-[8px] font-bold text-center py-0.5 rounded uppercase">
                          Main
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetEditMainImage(idx)}
                          className="absolute bottom-0.5 inset-x-0.5 bg-white/95 hover:bg-white text-black text-[8px] font-bold text-center py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                        >
                          Make Main
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-xs uppercase rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHIPPING LABEL MODAL (COMPACT A6/4x6 WITH REAL-TIME QR CODE) */}
      <ShippingLabelModal
        order={selectedLabelOrder}
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
      />

    </div>
  );
}
