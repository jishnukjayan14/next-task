# NEXT TASK — Handcrafted Stationery & Digital Productivity Platform

**NEXT TASK** is a specialized e-commerce web platform for handcrafted stationery, custom personalized diaries/bookmarks, ready-stock essentials, and instant downloadable productivity printables (habit trackers, daily planners, to-do lists).

---

## ✨ Features

- **Monochrome Minimalist Aesthetic:** Black and white high-contrast editorial look with Brittany Signature typography and botanical branding.
- **Dual Fulfillment Flow:**
  - **Physical Handcrafted Products:** Diaries, notebooks, and bookmarks with live custom name preview, font style selection, and gold foil embossing options. Requires delivery address.
  - **Instant Digital Downloads:** Printable planners and trackers available immediately post-payment and accessible through customer order history with instant PDF generator.
- **Dedicated Dual Authentication:**
  - **Customer Login:** Secure email sign-in with order tracking and past purchase download access.
  - **Admin Portal:** Separate, password-protected management dashboard (`admin123`) to process orders, update statuses, and perform product CRUD operations.
- **Payment Integration:**
  - Mock Razorpay gateway with support for UPI (GPay, PhonePe, Paytm), QR code, Cards, and Netbanking.
- **Admin Management Dashboard:**
  - Real-time order queue with personalized text highlights.
  - Order status workflow updater (Order Placed -> Printing & Crafting -> Dispatched -> Delivered).
  - Product catalog manager: Add new products, edit details, update stock, delete products, and manage multiple product images.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide React icons
- **State Management:** React Context API with LocalStorage persistence
- **PDF Generation:** Dynamic browser canvas & print rendering

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/jishnukjayan14/next-task.git
cd next-task
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Credentials for Demo

- **Customer:** Any email address (e.g. `customer@example.com`)
- **Admin Portal:** Accessible via `/admin` or navbar Login > Admin tab with password `admin123`
