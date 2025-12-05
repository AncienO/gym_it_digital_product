import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/ToastProvider";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "gym-it | Digital Fitness Products",
  description: "Premium digital fitness products for your journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Paystack Inline Script */}
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </head>
      <body className={`${inter.className} min-h-screen bg-black text-white antialiased flex flex-col`}>
        <ToastProvider />
        <CartProvider>
          <ConditionalNavbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
