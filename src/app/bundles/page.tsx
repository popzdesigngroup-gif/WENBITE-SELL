import { INITIAL_BUNDLES } from "@/lib/mock-data";
import { BundleCard } from "@/components/BundleCard";
import { Layers, Sparkles, ShieldCheck } from "lucide-react";

export default function BundlesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" /> High-Value Packs
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
          <Layers className="w-8 h-8 text-emerald-400" />
          Curated Video Bundles & Vaults
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-2xl">
          Save over 50% on thematic packs. Each bundle includes multiple matching 4K ProRes shots ready for cinematic trailers, commercial spots, and web design.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {INITIAL_BUNDLES.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>
    </div>
  );
}
