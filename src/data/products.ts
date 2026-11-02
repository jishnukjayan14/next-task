export interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  type: 'DIGITAL' | 'READY_STOCK' | 'CUSTOM_PHYSICAL';
  category: 'Planners' | 'Diaries' | 'Trackers' | 'Bookmarks' | 'To-Do Lists';
  description: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  stock?: number;
  imageUrl: string;
  images?: string[]; // Multiple images support
  coverColors?: { name: string; hex: string; class: string }[];
  allowsPersonalization: boolean;
  personalizationPlaceholder?: string;
  downloadFileName?: string;
  badge?: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "Personalized Matte Black Leather Diary",
    subtitle: "Custom gold or silver foil embossed name on luxury vegan leather",
    price: 499,
    originalPrice: 799,
    type: "CUSTOM_PHYSICAL",
    category: "Diaries",
    badge: "Custom Made",
    description: "A luxury vegan leather diary featuring 192 pages of premium 100 GSM ivory unruled paper. Beautifully customized with your name or favorite word foil-embossed on the cover.",
    features: [
      "Custom Name Embossing in Metallic Silver / Gold / Blind Deboss",
      "192 Pages of 100 GSM Acid-Free Ivory Paper",
      "Black Silk Ribbon Bookmark & Elastic Closure Band",
      "Integrated Pen Loop & Expandable Inner Document Pocket"
    ],
    rating: 4.9,
    reviewsCount: 142,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80"
    ],
    coverColors: [
      { name: "Obsidian Black", hex: "#111111", class: "bg-black" },
      { name: "Slate Grey", hex: "#374151", class: "bg-slate-700" },
      { name: "Chalk White", hex: "#f3f4f6", class: "bg-stone-100" }
    ],
    allowsPersonalization: true,
    personalizationPlaceholder: "e.g., Rahul K. / Next Task"
  },
  {
    id: "prod-2",
    title: "Minimalist Daily Planner & Habit Tracker (PDF)",
    subtitle: "Instant Download — High-Resolution Printable Black & White Document",
    price: 99,
    originalPrice: 249,
    type: "DIGITAL",
    category: "Planners",
    badge: "Instant Download",
    description: "A clean, functional black-and-white daily planner designed to bring clarity and structure to your routine. Available for instant download in ultra-sharp PDF format upon purchase.",
    features: [
      "Instant PDF Download Available Immediately After Payment",
      "Daily, Weekly & Monthly Goal Planning Sheets",
      "Habit Tracker & Focus Session Layouts",
      "Optimized for A4, A5, and US Letter Printing",
      "Fully Compatible with GoodNotes, Notability & iPad Apps"
    ],
    rating: 4.8,
    reviewsCount: 230,
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"
    ],
    allowsPersonalization: false,
    downloadFileName: "NextTask_Daily_Planner_Printable.pdf"
  },
  {
    id: "prod-3",
    title: "Monochrome Engraved Bookmark (Personalized)",
    subtitle: "Custom laser-engraved name & literary quote with silk tassel",
    price: 199,
    originalPrice: 299,
    type: "CUSTOM_PHYSICAL",
    category: "Bookmarks",
    badge: "Handcrafted",
    description: "An elegant, handcrafted bookmark crafted for avid readers and book collectors. Precision laser-engraved with your custom name or favorite literary quotation.",
    features: [
      "Precision Laser Engraved Custom Name & Quote",
      "Premium Black Silk Tassel Included",
      "Durable Scratch-Resistant Matte Finish",
      "Perfect Keepsake Gift for Book Enthusiasts"
    ],
    rating: 5.0,
    reviewsCount: 88,
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
    ],
    allowsPersonalization: true,
    personalizationPlaceholder: "Enter custom name or quote (e.g., Read & Conquer)"
  },
  {
    id: "prod-4",
    title: "Daily Task Priority Desk Pad (Ready Stock)",
    subtitle: "Ready to Ship — 50 Tear-off Sheets of 100 GSM Bleed-Proof Paper",
    price: 149,
    originalPrice: 199,
    type: "READY_STOCK",
    category: "To-Do Lists",
    stock: 25,
    badge: "Ready to Ship",
    description: "A clean, distraction-free desktop notepad engineered for maximum daily productivity. Features organized sections for top priority tasks, secondary goals, and notes.",
    features: [
      "Ready to Dispatch within 24 Hours",
      "Dedicated Top 3 Priorities Section",
      "Hourly Schedule & Water Intake Tracker",
      "100 GSM Smooth Bleed-Resistant White Paper",
      "50 Premium Glued Tear-Off Sheets"
    ],
    rating: 4.7,
    reviewsCount: 64,
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80"
    ],
    allowsPersonalization: false
  },
  {
    id: "prod-5",
    title: "Custom Hardcover To-Do Journal",
    subtitle: "Handcrafted Wire-Bound Notebook with Custom Name Cover Printing",
    price: 349,
    originalPrice: 499,
    type: "CUSTOM_PHYSICAL",
    category: "To-Do Lists",
    badge: "Custom Made",
    description: "Start each morning with focus and intention. Your custom name printed cleanly on the matte-laminated rigid hardcover with 120 pages of structured to-do checklists.",
    features: [
      "Personalized Name Printed on Hardcover",
      "120 Pages of Structured To-Do Checklists",
      "Sturdy Black Double-Wire Spiral Binding",
      "Durable Matte Scratch-Proof Lamination"
    ],
    rating: 4.9,
    reviewsCount: 51,
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80"
    ],
    allowsPersonalization: true,
    personalizationPlaceholder: "Name to print on the cover"
  },
  {
    id: "prod-6",
    title: "Monochrome 30-Day Habit Tracker Bundle (PDF)",
    subtitle: "Instant Digital Download — 5 Minimalist Aesthetic Layouts",
    price: 79,
    originalPrice: 149,
    type: "DIGITAL",
    category: "Trackers",
    badge: "Instant Download",
    description: "Build lasting habits and track consistency with our monochrome aesthetic 30-day habit tracking collection. Includes 5 distinct minimalist layout options ready to print.",
    features: [
      "Instant PDF Download Access Post-Checkout",
      "Clean Aesthetic Black & White Layouts",
      "Weekly & Monthly Tracker Grids",
      "Printable in standard A4 and A5 Sizes"
    ],
    rating: 4.8,
    reviewsCount: 95,
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"
    ],
    allowsPersonalization: false,
    downloadFileName: "NextTask_30_Day_Habit_Tracker.pdf"
  }
];
