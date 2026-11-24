import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { ContentProtection } from "@/components/ContentProtection";

export const metadata: Metadata = {
  title: "Viper AI Studio – Premium AI Video Marketplace",
  description: "Discover, download, and license production-ready 4K AI-generated videos and visual effects for creators, brands, and storytellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#090a0f] text-gray-100 antialiased">
        <ContentProtection />
        <CartProvider>
          <Suspense fallback={<div className="h-16 bg-[#090a0f]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
