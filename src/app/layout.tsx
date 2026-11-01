import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "NEXT TASK | Personalized Diaries, Planners & Digital Printables",
  description: "NEXT TASK - ഹാൻഡ്ക്രാഫ്റ്റഡ് കസ്റ്റം ഡയറികൾ, ഡിജിറ്റൽ പ്രിന്റബിൾ പ്ലാനറുകൾ, ഹാബിറ്റ് ട്രാക്കേഴ്സ് എന്നിവ ഓൺലൈനായി വാങ്ങാം. Razorpay UPI സപ്പോർട്ട്.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
        <StoreProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
