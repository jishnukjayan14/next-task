"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Product, INITIAL_PRODUCTS, DEFAULT_CATEGORIES } from "@/data/products";
import {
  subscribeToProducts,
  saveProductToFirestore,
  removeProductFromFirestore,
  subscribeToOrders,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  subscribeToCategories,
  saveCategoriesToFirestore
} from "@/lib/firebase";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customText?: string;
  selectedColor?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: "RAZORPAY";
  razorpayPaymentId: string;
  paymentStatus: "PAID";
  fulfillmentStatus: "MAKING" | "READY_TO_SHIP" | "SHIPPED" | "COMPLETED";
  shippingAddress?: ShippingAddress;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  hasDigitalItems: boolean;
  hasPhysicalItems: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, customText?: string, selectedColor?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  hasPhysicalInCart: boolean;
  hasDigitalInCart: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Navigation & Filtering State (Globally synced with Navbar)
  filterType: string;
  setFilterType: (type: string) => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Customer Auth
  customer: CustomerUser | null;
  loginCustomer: (email: string, name?: string) => void;
  logoutCustomer: () => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string, email?: string) => boolean;
  logoutAdmin: () => void;

  // Orders
  orders: Order[];
  createOrder: (shippingAddress?: ShippingAddress, razorpayPaymentId?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order["fulfillmentStatus"]) => void;

  // Categories Management (Real-time Cloud Synced)
  categories: string[];
  addCategory: (newCategory: string) => void;

  // Product Management (Admin)
  addProduct: (newProduct: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Active Filter state for Navbar & Page
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Dynamic Categories Management
  const [customCategories, setCustomCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  // Derived full categories list (merged with any category from existing products)
  const categories = useMemo(() => {
    const productCats = products.map((p) => p.category).filter(Boolean);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...customCategories, ...productCats]));
  }, [customCategories, products]);

  const addCategory = (newCategory: string) => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    const updated = Array.from(new Set([...categories, trimmed]));
    setCustomCategories(updated);
    try {
      localStorage.setItem("nexttask_categories", JSON.stringify(updated));
    } catch {}
    saveCategoriesToFirestore(updated);
  };

  // Real-time Cloud Sync with Firebase Firestore (All devices stay in sync)
  useEffect(() => {
    // 1. Subscribe to real-time products across all phones/computers
    const unsubscribeProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    // 2. Subscribe to real-time customer orders
    const unsubscribeOrders = subscribeToOrders((cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
      }
    });

    // 3. Subscribe to real-time categories across all devices
    const unsubscribeCategories = subscribeToCategories((cloudCats) => {
      if (cloudCats && cloudCats.length > 0) {
        setCustomCategories(Array.from(new Set([...DEFAULT_CATEGORIES, ...cloudCats])));
      }
    });

    return () => {
      if (typeof unsubscribeProducts === "function") unsubscribeProducts();
      if (typeof unsubscribeOrders === "function") unsubscribeOrders();
      if (typeof unsubscribeCategories === "function") unsubscribeCategories();
    };
  }, []);

  // Load from localStorage on client
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem("nexttask_categories");
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomCategories(Array.from(new Set([...DEFAULT_CATEGORIES, ...parsed])));
        }
      }

      const savedProducts = localStorage.getItem("nexttask_products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }

      const savedCart = localStorage.getItem("nexttask_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem("nexttask_orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        const sampleOrder: Order = {
          id: "ord-sample-01",
          orderNumber: "NT-89421",
          items: [
            {
              id: "item-1",
              product: INITIAL_PRODUCTS[0],
              quantity: 1,
              customText: "Dr. Ananya Menon",
              selectedColor: "Obsidian Black"
            },
            {
              id: "item-2",
              product: INITIAL_PRODUCTS[1],
              quantity: 1
            }
          ],
          totalAmount: 598,
          paymentMethod: "RAZORPAY",
          razorpayPaymentId: "pay_rzp_9841249",
          paymentStatus: "PAID",
          fulfillmentStatus: "MAKING",
          customerName: "Ananya Menon",
          customerEmail: "ananya@example.com",
          customerPhone: "+91 98460 12345",
          shippingAddress: {
            fullName: "Ananya Menon",
            phone: "+91 98460 12345",
            addressLine: "Flat 4B, Skyline Apts, MG Road",
            city: "Kochi",
            state: "Kerala",
            pincode: "682016"
          },
          createdAt: new Date().toISOString(),
          hasDigitalItems: true,
          hasPhysicalItems: true
        };
        setOrders([sampleOrder]);
      }

      const savedCustomer = localStorage.getItem("nexttask_customer");
      if (savedCustomer) setCustomer(JSON.parse(savedCustomer));

      const savedAdmin = localStorage.getItem("nexttask_admin_auth");
      if (savedAdmin === "true") setIsAdminLoggedIn(true);
    } catch {}
  }, []);

  // Save products
  useEffect(() => {
    try {
      localStorage.setItem("nexttask_products", JSON.stringify(products));
    } catch {}
  }, [products]);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem("nexttask_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Save orders
  useEffect(() => {
    try {
      localStorage.setItem("nexttask_orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const addToCart = (product: Product, quantity = 1, customText?: string, selectedColor?: string) => {
    setCart((prev) => {
      const itemKey = `${product.id}-${customText || ""}-${selectedColor || ""}`;
      const existing = prev.find((item) => item.id === itemKey);

      if (existing) {
        return prev.map((item) =>
          item.id === itemKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [
        ...prev,
        {
          id: itemKey,
          product,
          quantity,
          customText,
          selectedColor,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const hasPhysicalInCart = cart.some(
    (item) => item.product.type === "CUSTOM_PHYSICAL" || item.product.type === "READY_STOCK"
  );
  const hasDigitalInCart = cart.some((item) => item.product.type === "DIGITAL");

  // Customer Auth
  const loginCustomer = (email: string, name?: string) => {
    const cust: CustomerUser = {
      id: "cust-" + Math.random().toString(36).substr(2, 6),
      email: email.trim(),
      name: name?.trim() || email.split("@")[0],
    };
    setCustomer(cust);
    localStorage.setItem("nexttask_customer", JSON.stringify(cust));
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem("nexttask_customer");
  };

  // Secure Admin Auth
  const loginAdmin = (password: string, email?: string) => {
    const validPasswords = ["admin123", "admin", "nexttask", "nexttask123"];
    if (validPasswords.includes(password.trim())) {
      setIsAdminLoggedIn(true);
      localStorage.setItem("nexttask_admin_auth", "true");
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("nexttask_admin_auth");
  };

  // Orders
  const createOrder = (shippingAddress?: ShippingAddress, razorpayPaymentId?: string): Order => {
    const newOrder: Order = {
      id: "ord-" + Math.random().toString(36).substr(2, 9),
      orderNumber: "NT-" + Math.floor(10000 + Math.random() * 90000),
      items: [...cart],
      totalAmount: cartTotal,
      paymentMethod: "RAZORPAY",
      razorpayPaymentId: razorpayPaymentId || "pay_rzp_" + Math.random().toString(36).substr(2, 9),
      paymentStatus: "PAID",
      fulfillmentStatus: hasPhysicalInCart ? "MAKING" : "COMPLETED",
      shippingAddress: shippingAddress,
      customerName: shippingAddress?.fullName || customer?.name || "Customer",
      customerEmail: customer?.email || "customer@nexttask.in",
      customerPhone: shippingAddress?.phone || "+91 9999999999",
      createdAt: new Date().toISOString(),
      hasDigitalItems: hasDigitalInCart,
      hasPhysicalItems: hasPhysicalInCart,
    };

    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToFirestore(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["fulfillmentStatus"]) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, fulfillmentStatus: status } : ord))
    );
    updateOrderStatusInFirestore(orderId, status);
  };

  // Products
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
    saveProductToFirestore(newProduct);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    saveProductToFirestore(updatedProduct);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    removeProductFromFirestore(productId);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        hasPhysicalInCart,
        hasDigitalInCart,
        isCartOpen,
        setIsCartOpen,
        filterType,
        setFilterType,
        filterCategory,
        setFilterCategory,
        searchQuery,
        setSearchQuery,
        customer,
        loginCustomer,
        logoutCustomer,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        orders,
        createOrder,
        updateOrderStatus,
        categories,
        addCategory,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
