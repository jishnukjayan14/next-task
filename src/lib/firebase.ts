import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs
} from "firebase/firestore";
import { Product, INITIAL_PRODUCTS } from "@/data/products";
import { Order } from "@/context/StoreContext";

// User's Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMxP9HTz3ssYJ52MCFnL4wl6S7fVsOpu4",
  authDomain: "next-tasks-tore.firebaseapp.com",
  projectId: "next-tasks-tore",
  storageBucket: "next-tasks-tore.firebasestorage.app",
  messagingSenderId: "408012096918",
  appId: "1:408012096918:web:ad906c764dba6b8bec49b7",
  measurementId: "G-MHP2YH3VYH"
};

// Initialize Firebase app once safely across SSR & Client
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Real-time listener for Products collection
 */
export const subscribeToProducts = (onProducts: (products: Product[]) => void) => {
  try {
    const colRef = collection(db, "products");
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore is empty, seed with initial products
          seedInitialProducts();
          onProducts(INITIAL_PRODUCTS);
          return;
        }

        const loaded: Product[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push(docSnap.data() as Product);
        });

        // Ensure we preserve order or fallback
        if (loaded.length > 0) {
          onProducts(loaded);
        } else {
          onProducts(INITIAL_PRODUCTS);
        }
      },
      (err) => {
        console.warn("Firestore products sync note (using fallback):", err.message);
      }
    );
  } catch (err) {
    console.warn("Could not initialize products snapshot listener:", err);
    return () => {};
  }
};

/**
 * Seed initial catalog if empty
 */
export const seedInitialProducts = async () => {
  try {
    const colRef = collection(db, "products");
    const existing = await getDocs(colRef);
    if (!existing.empty) return;

    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, "products", prod.id), prod);
    }
  } catch (err) {
    console.warn("Initial products seeding note:", err);
  }
};

/**
 * Save / Update product in Firestore
 */
export const saveProductToFirestore = async (product: Product) => {
  try {
    await setDoc(doc(db, "products", product.id), product);
  } catch (err) {
    console.error("Error saving product to Firestore:", err);
  }
};

/**
 * Delete product from Firestore
 */
export const removeProductFromFirestore = async (productId: string) => {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (err) {
    console.error("Error deleting product from Firestore:", err);
  }
};

/**
 * Real-time listener for Orders collection
 */
export const subscribeToOrders = (onOrders: (orders: Order[]) => void) => {
  try {
    const colRef = collection(db, "orders");
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Order[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as Order);
          });
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          onOrders(loaded);
        }
      },
      (err) => {
        console.warn("Firestore orders sync note (using fallback):", err.message);
      }
    );
  } catch (err) {
    console.warn("Could not initialize orders snapshot listener:", err);
    return () => {};
  }
};

/**
 * Save new order to Firestore
 */
export const saveOrderToFirestore = async (order: Order) => {
  try {
    await setDoc(doc(db, "orders", order.id), order);
  } catch (err) {
    console.error("Error saving order to Firestore:", err);
  }
};

/**
 * Update order status in Firestore
 */
export const updateOrderStatusInFirestore = async (
  orderId: string,
  status: Order["fulfillmentStatus"]
) => {
  try {
    await updateDoc(doc(db, "orders", orderId), { fulfillmentStatus: status });
  } catch (err) {
    console.error("Error updating order status in Firestore:", err);
  }
};
