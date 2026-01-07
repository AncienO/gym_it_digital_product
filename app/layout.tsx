import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/ToastProvider";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { ConditionalNotice } from "@/components/ConditionalNotice";

import { CurrencyProvider } from "@/context/CurrencyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "gym-it | Digital Fitness Products",
  description: "Premium digital fitness products for your journey.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  // Fetch the most recent active notice
  const { data: notice } = await supabase
    .from('notices')
    .select('id, content')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Paystack Inline Script */}
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </head>
      <body className={`${inter.className} min-h-screen bg-black text-white antialiased flex flex-col`}>
        <ToastProvider />
        <CurrencyProvider>
          <CartProvider>
            <div className="sticky top-0 z-50 w-full">
              <ConditionalNavbar />
              <ConditionalNotice notice={notice} />
            </div>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
