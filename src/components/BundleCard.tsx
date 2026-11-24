"use client";

import Link from "next/link";
import { BundleItem } from "@/types";
import { Layers, ShoppingBag, Sparkles, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface BundleCardProps {
  bundle: BundleItem;
}

export function BundleCard({ bundle }: BundleCardProps) {
  const { addToCart, cart } = useCart();
  const inCart = cart.some((c) => c.id === bundle.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: bundle.id,
      type: "bundle",
      title: bundle.title,
      thumbnail: bundle.cover_url,
      price: bundle.price,
      license_type: "commercial",
    });
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#181a24] to-[#10121a] border border-emerald-500/30 p-6 flex flex-col justify-between group shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
      {/* Glow Effect */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-emerald-500 text-black shadow-md shadow-emerald-500/30 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {bundle.badge || "SPECIAL VALUE"}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Includes {(bundle.video_ids || []).length || 3} Master Videos
          </span>
        </div>

        {/* Thumbnail Preview Banner */}
        <div className="relative aspect-[16/8] w-full rounded-xl overflow-hidden mb-4 border border-white/10">
          <img
            src={bundle.cover_url}
            alt={bundle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-xs font-semibold text-emerald-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-emerald-500/20">
              Instant Master Unlocks
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
          {bundle.title}
        </h3>

        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          {bundle.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {formatCurrency(bundle.price)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(bundle.regular_price)}
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-medium">
            Commercial & Resell Safe
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
            inCart
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
          }`}
        >
          {inCart ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Claim Bundle
            </>
          )}
        </button>
      </div>
    </div>
  );
}
