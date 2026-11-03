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
    deleteProduct,
    categories,
    addCategory
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

  // Category Modal state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryFeedback, setCategoryFeedback] = useState<string | null>(null);

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

  // Handle adding new custom category
  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    addCategory(trimmed);
    setNewCategory(trimmed);
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, category: trimmed });
    }
    setCategoryFeedback(`Category "${trimmed}" successfully added!`);
    setTimeout(() => {
      setCategoryFeedback(null);
      setShowAddCategoryModal(false);
      setNewCategoryName("");
    }, 1000);
  };

  // Live offer discount calculation for create form
  const numNewPrice = parseFloat(newPrice) || 0;
  const numNewOriginalPrice = parseFloat(newOriginalPrice) || 0;
  const hasNewDiscount = numNewOriginalPrice > numNewPrice && numNewPrice > 0;
  const newDiscountPercent = hasNewDiscount ? Math.round(((numNewOriginalPrice - numNewPrice) / numNewOriginalPrice) * 100) : 0;
  const newSavingsAmount = hasNewDiscount ? (numNewOriginalPrice - numNewPrice) : 0;

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Active Store Products ({products.length})
              </h3>
              <p className="text-xs text-neutral-400">
                Manage stock, prices, categories and offers across your catalog
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Category</span>
              </button>
              <button
                onClick={() => setActiveTab("add_product")}
                className="px-3.5 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mr-1">
              Store Categories ({categories.length}):
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-1 bg-neutral-100 text-black text-xs font-semibold rounded-full border border-neutral-200"
              >
                {cat}
              </span>
            ))}
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="text-[11px] font-bold text-black hover:underline flex items-center gap-1 px-2 py-0.5 ml-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => {
              const pHasDiscount = Boolean(p.originalPrice && p.originalPrice > p.price);
              const pDiscountPercent = pHasDiscount
                ? Math.round((((p.originalPrice || 0) - p.price) / (p.originalPrice || 1)) * 100)
                : 0;

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs p-4 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 relative mb-3">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        {p.type}
                      </span>
                      {pHasDiscount && (
                        <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs tracking-wider">
                          {pDiscountPercent}% OFF
                        </span>
                      )}
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
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-base text-black font-mono">₹{p.price}</span>
                          {pHasDiscount && (
                            <span className="text-xs text-neutral-400 line-through font-mono">
                              ₹{p.originalPrice}
                            </span>
                          )}
                        </div>
                        {pHasDiscount && (
                          <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 border border-emerald-200">
                            Offer: Save {pDiscountPercent}% (₹{(p.originalPrice || 0) - p.price})
                          </span>
                        )}
                      </div>
                      <span className="text-neutral-600 font-mono text-[11px] bg-neutral-100 px-2 py-1 rounded">
                        {p.category}
                      </span>
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
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ADD NEW PRODUCT (WITH MULTI-IMAGE SUPPORT & LIVE PREVIEW) */}
      {activeTab === "add_product" && (
        <div className="max-w-6xl mx-auto space-y-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
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
                      Offer / Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="399"
                      className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black font-mono font-bold"
                    />
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">Price customer pays</span>
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
                      className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black font-mono"
                    />
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">Strikethrough MRP rate</span>
                  </div>
                </div>

                {/* Real-time Discount Feedback */}
                {hasNewDiscount && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white font-black text-[11px] px-2 py-0.5 rounded shadow-xs tracking-wider">
                        {newDiscountPercent}% OFF
                      </span>
                      <span className="text-emerald-800 font-bold">
                        Special Offer Active: Customer saves ₹{newSavingsAmount}!
                      </span>
                    </div>
                    <span className="text-emerald-700 font-mono text-[11px] hidden sm:inline">
                      ₹{numNewOriginalPrice} → ₹{numNewPrice}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                        Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAddCategoryModal(true)}
                        className="text-[10px] font-bold text-black hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ New</span>
                      </button>
                    </div>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black font-medium"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
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
                        Product Photos ({newImages.length})
                      </label>
                      <p className="text-[11px] text-neutral-500">
                        Upload photos from your computer or phone. First photo is the main storefront cover.
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
                      Select 1 or multiple photos from your device (JPG, PNG, WEBP).
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

                  {/* PREVIEW GALLERY WITH MAIN COVER PROMINENT */}
                  {newImages.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row gap-3.5 p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl items-start">
                        <div className="w-32 sm:w-36 aspect-[4/5] rounded-xl overflow-hidden border-2 border-black relative shrink-0 shadow-xs">
                          <img src={newImages[0]} alt="main-cover" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 inset-x-1 bg-black text-white text-[9px] font-bold text-center py-0.5 rounded shadow-xs uppercase tracking-wider">
                            ★ Main Cover
                          </span>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-black uppercase tracking-wider">
                              Additional Views ({newImages.length - 1})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(0)}
                              className="text-[10px] text-red-600 hover:underline font-semibold cursor-pointer"
                            >
                              Remove Main Photo
                            </button>
                          </div>
                          <p className="text-[11px] text-neutral-500">
                            These appear inside the product detail page. Click &quot;Make Main&quot; to switch any photo to the front cover.
                          </p>

                          {newImages.length > 1 ? (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {newImages.slice(1).map((img, i) => {
                                const actualIdx = i + 1;
                                return (
                                  <div
                                    key={actualIdx}
                                    className="relative w-20 h-24 rounded-lg overflow-hidden border border-neutral-300 group shadow-2xs"
                                  >
                                    <img src={img} alt={`sec-${actualIdx}`} className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(actualIdx)}
                                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-0.5 transition-colors cursor-pointer"
                                      title="Delete photo"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSetMainImage(actualIdx)}
                                      className="absolute bottom-1 inset-x-1 bg-white/95 hover:bg-white text-black text-[8px] font-bold text-center py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                                    >
                                      Make Main
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-[11px] text-neutral-400 italic pt-1">
                              No additional gallery photos yet. You can upload more photos to show inside the product page.
                            </p>
                          )}
                        </div>
                      </div>
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

            {/* Live Storefront Card Preview Column */}
            <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Live Store Card Preview</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                This is exactly how your product card and main photo will look to customers on the website:
              </p>

              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-md max-w-sm mx-auto">
                {/* Image */}
                <div className="block relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <img
                    src={newImages[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />

                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded shadow-xs">
                      {newType === "CUSTOM_PHYSICAL" ? "Custom Name" : newType === "DIGITAL" ? "Instant PDF" : "Ready Stock"}
                    </span>
                  </div>

                  {hasNewDiscount && (
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded shadow-md">
                        {newDiscountPercent}% OFF
                      </span>
                    </div>
                  )}

                  {newImages.length > 1 && (
                    <div className={`absolute ${hasNewDiscount ? "bottom-2.5" : "top-2.5"} right-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1`}>
                      <ImageIcon className="w-3 h-3 text-neutral-300" />
                      <span>{newImages.length} Photos</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                    {newCategory}
                  </div>
                  <h4 className="font-sans font-bold text-sm text-black line-clamp-1">
                    {newTitle || "Product Title Preview"}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {newSubtitle || "Subtitle or product description will be displayed here."}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-black font-mono">
                          ₹{newPrice || "0"}
                        </span>
                        {hasNewDiscount && (
                          <span className="text-xs text-neutral-400 line-through font-mono">
                            ₹{newOriginalPrice}
                          </span>
                        )}
                      </div>
                      {hasNewDiscount && (
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          Save {newDiscountPercent}% (₹{newSavingsAmount})
                        </div>
                      )}
                    </div>
                    <span className="px-3 py-1.5 bg-black text-white rounded text-[11px] font-bold uppercase tracking-wider">
                      {newType === "CUSTOM_PHYSICAL" ? "Customize" : newType === "DIGITAL" ? "Download" : "Add to Cart"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[11px] text-neutral-600 space-y-1">
                <div className="font-bold text-black flex items-center gap-1">
                  <span>💡 Note for Multi-Photo Products:</span>
                </div>
                <p>
                  Only this <strong>Main Cover Photo</strong> is shown on the storefront card. When customers click to open the product page, all <strong>{newImages.length || 1} photos</strong> will be presented in an interactive high-resolution gallery!
                </p>
              </div>
            </div>

          </div>
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
                    Offer / Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black font-mono font-bold"
                  />
                  <span className="text-[10px] text-neutral-400">Customer pays this rate</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) || undefined })}
                    className="w-full text-xs px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black font-mono"
                  />
                  <span className="text-[10px] text-neutral-400">Strikethrough reference rate</span>
                </div>
              </div>

              {/* Edit Modal Discount Preview */}
              {Boolean(editingProduct.originalPrice && editingProduct.originalPrice > editingProduct.price) && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded shadow-xs tracking-wider">
                      {Math.round((((editingProduct.originalPrice || 0) - editingProduct.price) / (editingProduct.originalPrice || 1)) * 100)}% OFF
                    </span>
                    <span className="text-emerald-800 font-bold text-[11px]">
                      Offer Discount: Customer saves ₹{(editingProduct.originalPrice || 0) - editingProduct.price}!
                    </span>
                  </div>
                  <span className="text-emerald-700 font-mono text-[10px]">
                    MRP: ₹{editingProduct.originalPrice} → Offer: ₹{editingProduct.price}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddCategoryModal(true)}
                      className="text-[10px] font-bold text-black hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ New</span>
                    </button>
                  </div>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full text-xs p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-black font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
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
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                  {(editingProduct.images || [editingProduct.imageUrl]).map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 bg-neutral-100 group shadow-xs ${
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
                        <span className="absolute bottom-1 inset-x-1 bg-black text-white text-[9px] font-bold text-center py-0.5 rounded uppercase">
                          ★ Main Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetEditMainImage(idx)}
                          className="absolute bottom-1 inset-x-1 bg-white/95 hover:bg-white text-black text-[9px] font-bold text-center py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
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

      {/* ADD NEW CATEGORY MODAL */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-bold text-sm text-black uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Add New Category</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setCategoryFeedback(null);
                }}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Create a new product category. It will instantly sync to Firebase and appear in both the admin selector and the customer storefront filter.
            </p>

            {categoryFeedback && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold text-center">
                ✅ {categoryFeedback}
              </div>
            )}

            <form onSubmit={handleAddNewCategory} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Desk Mats, Wall Calendars, Pens"
                  className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-black focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-xs uppercase rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
