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
    subtitle: "നിങ്ങളുടെ പേര് സിൽവർ / ഗോൾഡൻ ഫോയിലിൽ പ്രിന്റ് ചെയ്തു നൽകുന്ന ലക്ഷ്വറി ഡയറി",
    price: 499,
    originalPrice: 799,
    type: "CUSTOM_PHYSICAL",
    category: "Diaries",
    badge: "Custom Made",
    description: "പ്രീമിയം 100 GSM അൺറൂൾഡ് പേപ്പറുകൾ അടങ്ങിയ ലക്ഷ്വറി വീഗൻ ലെതർ ഡയറി. നിങ്ങളുടെ പേരോ നിങ്ങൾ നൽകുന്ന പ്രിയപ്പെട്ട വാക്കോ ഇതിന്റെ കവറിൽ മനോഹരമായി എംബോസ് ചെയ്ത് പ്രിന്റ് ചെയ്ത് നൽകുന്നു.",
    features: [
      "Custom Name Embossing in Metallic Silver / Gold / Blind Deboss",
      "192 Pages of 100 GSM Acid-Free Ivory Paper",
      "Black Silk Ribbon Bookmark & Elastic Band",
      "Pen Loop & Expandable Inner Pocket"
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
    personalizationPlaceholder: "ഉദാഹരണത്തിന്: Rahul K. / My Daily Thoughts"
  },
  {
    id: "prod-2",
    title: "Minimalist Daily Planner & Habit Tracker (PDF)",
    subtitle: "ഇൻസ്റ്റന്റ് ഡൗൺലോഡ് - പ്രിന്റ് ചെയ്യാവുന്ന ബ്ലാക്ക് & വൈറ്റ് ഡോക്യുമെന്റ്",
    price: 99,
    originalPrice: 249,
    type: "DIGITAL",
    category: "Planners",
    badge: "Instant Download",
    description: "നിങ്ങളുടെ ദൈനംദിന ഷെഡ്യൂളുകളും ടാസ്കുകളും ചിട്ടപ്പെടുത്താൻ സഹായിക്കുന്ന ക്ലീൻ മിനിമലിസ്റ്റിക് ബ്ലാക്ക് & വൈറ്റ് ഡിജിറ്റൽ പ്ലാനർ. വാങ്ങിയ ഉടൻ തന്നെ ഉയർന്ന ക്വാളിറ്റി PDF ആയി ഡൗൺലോഡ് ചെയ്യാം.",
    features: [
      "ഉടൻ തന്നെ PDF ഡൗൺലോഡ് ചെയ്യാം (Instant Download)",
      "Daily, Weekly & Monthly Goal Planning Sheets",
      "Habit Tracker & Mood Tracker Templates",
      "A4, A5 & US Letter സൈസുകളിൽ പ്രിന്റ് ചെയ്യാൻ അനുയോജ്യം",
      "GoodNotes, Notability ആപ്പുകളിൽ ഉപയോഗിക്കാം"
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
    subtitle: "കസ്റ്റം പേരും ക്വോട്ടും കൊത്തിയ പ്രീമിയം ബുക്ക്മാർക്ക്",
    price: 199,
    originalPrice: 299,
    type: "CUSTOM_PHYSICAL",
    category: "Bookmarks",
    badge: "Handcrafted",
    description: "പുസ്തകപ്രേമികൾക്കായി പ്രത്യേകമായി നിർമ്മിക്കുന്ന പ്രീമിയം മിനിമലിസ്റ്റ് ബുക്ക്മാർക്ക്. നിങ്ങളുടെ പേരും നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട പുസ്തക വരികളും ലേസർ എൻഗ്രേവിംഗ് ചെയ്ത് നൽകുന്നു.",
    features: [
      "Precision Laser Engraved Custom Name & Quote",
      "Black Silk Tassel included",
      "Durable Matte Finish",
      "വായനക്കാർക്ക് സമ്മാനം നൽകാൻ ഏറ്റവും മികച്ച ചോയ്‌സ്"
    ],
    rating: 5.0,
    reviewsCount: 88,
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
    ],
    allowsPersonalization: true,
    personalizationPlaceholder: "പേര് നൽകുക (ഉദാ: Ananya / Read & Conquer)"
  },
  {
    id: "prod-4",
    title: "Daily Task Priority Desk Pad (Ready Stock)",
    subtitle: "റെഡി സ്റ്റോക്ക് - 50 ഷീറ്റുകൾ അടങ്ങിയ പ്രീമിയം ടിയർ-ഓഫ് പാഡ്",
    price: 149,
    originalPrice: 199,
    type: "READY_STOCK",
    category: "To-Do Lists",
    stock: 25,
    badge: "Ready to Ship",
    description: "ദിവസേനയുള്ള ജോലികൾ മുൻഗണനാക്രമത്തിൽ രേഖപ്പെടുത്താൻ സഹായിക്കുന്ന ക്ലീൻ ബ്ലാക്ക് & വൈറ്റ് മിനിമലിസ്റ്റിക് ടൂ-ഡൂ ലിസ്റ്റ് പാഡ്. 50 കട്ടിയുള്ള ഷീറ്റുകൾ.",
    features: [
      "Ready to Ship immediately",
      "Top Priority Tasks Section",
      "Water Intake & Health Tracker",
      "100 GSM bleed-resistant paper",
      "50 Tear-off Sheets"
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
    subtitle: "കസ്റ്റം ടൂ-ഡൂ നോട്ട്ബുക്ക് - കവറിൽ നിങ്ങളുടെ പേര് നൽകി നിർമ്മിക്കുന്നു",
    price: 349,
    originalPrice: 499,
    type: "CUSTOM_PHYSICAL",
    category: "To-Do Lists",
    badge: "Custom Made",
    description: "നിങ്ങളുടെ പേര് കവറിൽ പ്രിന്റ് ചെയ്തുകൊണ്ടുള്ള ഹാർഡ്ബൗണ്ട് ഡെയ്‌ലി ടാസ്ക് നോട്ട്ബുക്ക്. ദിവസം തുടങ്ങുമ്പോൾ നിങ്ങളുടെ പേര് കണ്ട് കൃത്യമായി പ്ലാൻ ചെയ്യാം.",
    features: [
      "Custom Name Printed on Hardcover",
      "120 Pages of Structured To-Do Layouts",
      "Black Spiral Binding",
      "Durable Matte Laminated Finish"
    ],
    rating: 4.9,
    reviewsCount: 51,
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80"
    ],
    allowsPersonalization: true,
    personalizationPlaceholder: "കവറിൽ പ്രിന്റ് ചെയ്യേണ്ട പേര്"
  },
  {
    id: "prod-6",
    title: "Monochrome 30-Day Habit Tracker Bundle (PDF)",
    subtitle: "ഇൻസ്റ്റന്റ് ഡൗൺലോഡ് - 5 മിനിമൽ ലേഔട്ടുകൾ",
    price: 79,
    originalPrice: 149,
    type: "DIGITAL",
    category: "Trackers",
    badge: "Instant Download",
    description: "ശീലങ്ങൾ വളർത്തിയെടുക്കാൻ സഹായിക്കുന്ന ബ്ലാക്ക് & വൈറ്റ് പ്രിന്റബിൾ ഹാബിറ്റ് ട്രാക്കർ ടെംപ്ലേറ്റുകൾ. 5 വ്യത്യസ്ത മിനിമലിസ്റ്റിക് ലേഔട്ടുകളിൽ ലഭിക്കുന്നു.",
    features: [
      "ഉടൻ തന്നെ ഡൗൺലോഡ് ചെയ്യാം",
      "Clean Aesthetic Black & White Layouts",
      "Weekly & Monthly Tracker Grids",
      "A4/A5 Printable PDF files"
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
