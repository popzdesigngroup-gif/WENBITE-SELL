import Link from "next/link";
import { INITIAL_VIDEOS, INITIAL_BUNDLES, CATEGORIES } from "@/lib/mock-data";
import { VideoCard } from "@/components/VideoCard";
import { BundleCard } from "@/components/BundleCard";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Film,
  Download,
  Flame,
  Search,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const featuredVideos = INITIAL_VIDEOS.filter((v) => v.is_featured);
  const bestSellers = [...INITIAL_VIDEOS].sort((a, b) => b.downloads_count - a.downloads_count);
  const recentUploads = [...INITIAL_VIDEOS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12">
        {/* Subtle Background Glows & Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#090a0f] to-[#090a0f] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Next-Gen Cinema: Sora, Runway Gen-3 & Kling 4K Masters</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Discover. Download.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Create.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 leading-relaxed font-light">
            Premium AI-generated videos for creators, brands, and storytellers. Uncompressed 4K master ProRes downloads with instant commercial licenses.
          </p>

          {/* CTA & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/catalog"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>Explore 4K Vault</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/bundles"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-base transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Browse Bundles (50% Off)</span>
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs sm:text-sm text-gray-400">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">4K & 60 FPS</span>
              <span className="text-gray-400 text-xs">Uncompressed Masters</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">100% Commercial</span>
              <span className="text-gray-400 text-xs">Royalty-Free Licensing</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">Cloudflare R2</span>
              <span className="text-gray-400 text-xs">High-Speed Downloads</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">Razorpay Secure</span>
              <span className="text-gray-400 text-xs">Instant Checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <Film className="w-6 h-6 text-emerald-400" />
              Browse by Aesthetic
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Curated collections engineered for filmmakers and motion designers
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.slug}`}
              className="group p-5 rounded-2xl bg-[#11131a] border border-white/10 hover:border-emerald-500/50 hover:bg-[#151824] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white mt-4 group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                  {cat.description}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 mt-4 flex items-center gap-1">
                Explore footage →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED AI VIDEOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Staff Picks
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured 4K Releases</h2>
          </div>
          <Link
            href="/catalog?filter=featured"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      {/* 4. VALUE BUNDLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#0e111a] to-[#0e111a] border border-emerald-500/20 p-8 sm:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIMITED RUN VAULT PACKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
                Bulk Bundles & Creator Kits
              </h2>
              <p className="text-gray-400 text-sm mt-1 max-w-xl">
                Get full series of matching aesthetic clips with one-click commercial licenses at up to 55% off individual asset prices.
              </p>
            </div>
            <Link
              href="/bundles"
              className="mt-4 md:mt-0 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 flex items-center gap-1.5 w-fit"
            >
              All Bundles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {INITIAL_BUNDLES.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. BEST-SELLING VIDEOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5" /> High Demand
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Best-Selling Videos</h2>
          </div>
          <Link
            href="/catalog?sort=downloads"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Top Charts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.slice(0, 3).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      {/* 6. RECENTLY UPLOADED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Fresh Drops</h2>
            <p className="text-sm text-gray-400 mt-1">Recently generated and cataloged master shots</p>
          </div>
          <Link
            href="/catalog?sort=newest"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Explore All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentUploads.slice(0, 3).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
