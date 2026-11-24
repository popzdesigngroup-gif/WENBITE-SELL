"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, ShoppingBag, ShieldCheck, Film, LayoutDashboard, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090a0f]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#090a0f] rounded-[10px] flex items-center justify-center">
              <Play className="w-5 h-5 text-emerald-400 fill-emerald-400 ml-0.5" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-wider text-white">
            VIPER<span className="text-emerald-400">.AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/catalog"
            className={`transition-colors hover:text-emerald-400 ${
              pathname === "/catalog" ? "text-emerald-400" : "text-gray-300"
            }`}
          >
            Explore Catalog
          </Link>
          <Link
            href="/bundles"
            className={`transition-colors hover:text-emerald-400 ${
              pathname === "/bundles" ? "text-emerald-400" : "text-gray-300"
            }`}
          >
            Bundles <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full ml-1 font-semibold">SAVE 50%</span>
          </Link>
          <Link
            href="/licensing"
            className={`transition-colors hover:text-emerald-400 ${
              pathname === "/licensing" ? "text-emerald-400" : "text-gray-300"
            }`}
          >
            Licenses
          </Link>
          <Link
            href="/library"
            className={`transition-colors hover:text-emerald-400 ${
              pathname === "/library" ? "text-emerald-400" : "text-gray-300"
            }`}
          >
            My Vault
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg transition-all hover:border-emerald-500/40"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Studio Admin</span>
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-black text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
