"use client";

import { useState } from "react";
import Link from "next/link";
import { VideoItem } from "@/types";
import {
  Download,
  Share2,
  Check,
  ShieldCheck,
  Sparkles,
  Info,
  Clock,
  Layers,
  Sliders,
  Copy,
  ShoppingBag,
} from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { VideoCard } from "@/components/VideoCard";

interface Props {
  video: VideoItem;
  relatedVideos: VideoItem[];
}

export function VideoDetailClient({ video, relatedVideos }: Props) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<"standard" | "extended">("standard");
  const { addToCart, cart } = useCart();

  const isPurchasedInCart = cart.some((c) => c.id === video.id);

  const price = selectedLicense === "standard" 
    ? (video.sale_price || video.price)
    : (video.sale_price || video.price) * 2.5;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(video.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleAddToCart = () => {
    addToCart({
      id: video.id,
      type: "video",
      title: video.title,
      thumbnail: video.thumbnail_url,
      price: price,
      resolution: video.resolution,
      license_type: selectedLicense === "standard" ? "commercial" : "extended",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 flex items-center gap-2">
        <Link href="/" className="hover:text-emerald-400">Home</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-emerald-400">Catalog</Link>
        <span>/</span>
        <span className="text-gray-200">{video.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Video Player & Info (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Player Container */}
          <div 
            className="relative rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl select-none protected-watermark-grid"
            onContextMenu={(e) => e.preventDefault()}
          >
            <video
              src={video.preview_url}
              controls
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture
              autoPlay
              loop
              muted
              playsInline
              onContextMenu={(e) => e.preventDefault()}
              className="w-full aspect-video object-contain pointer-events-auto"
            />
            {/* Watermark Overlay Tag */}
            <div className="absolute top-4 right-4 pointer-events-none opacity-40 select-none bg-black/60 px-3 py-1 rounded text-xs font-mono font-bold tracking-widest text-emerald-400 border border-emerald-500/30">
              VIPER.AI WATERMARKED PREVIEW
            </div>
          </div>

          {/* Video Metadata Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {video.category?.name || "AI Visual"}
              </span>
              <span className="text-xs text-gray-400">{video.model_used}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {video.title}
            </h1>
            <p className="text-gray-300 text-sm mt-3 leading-relaxed">
              {video.description}
            </p>
          </div>

          {/* AI Generation Prompt Card */}
          <div className="p-5 rounded-2xl bg-[#11131a] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> AI Engineering Prompt
              </span>
              <button
                onClick={handleCopyPrompt}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Prompt
                  </>
                )}
              </button>
            </div>
            <p className="text-xs font-mono text-gray-300 leading-relaxed bg-[#090a0f] p-3.5 rounded-xl border border-white/5 select-all">
              {video.prompt}
            </p>
          </div>

          {/* Technical Specifications */}
          <div className="p-5 rounded-2xl bg-[#11131a] border border-white/10">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-gray-400 block mb-1">Master Resolution</span>
                <span className="text-white font-bold text-sm">{video.resolution} UHD (3840x2160)</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-gray-400 block mb-1">Framerate</span>
                <span className="text-white font-bold text-sm">{video.fps} FPS</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-gray-400 block mb-1">Duration</span>
                <span className="text-white font-bold text-sm">{formatDuration(video.duration)}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-gray-400 block mb-1">Master File Size</span>
                <span className="text-white font-bold text-sm">~{video.r2_master_file_size_mb} MB (ProRes)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Checkout Sidebar (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#11131a] border border-emerald-500/30 shadow-xl space-y-6 sticky top-24">
            {/* Price display */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">
                  {formatCurrency(price)}
                </span>
                {video.sale_price && selectedLicense === "standard" && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(video.price)}
                  </span>
                )}
              </div>
              <span className="text-xs text-emerald-400 font-medium block mt-1">
                Instant Cloudflare R2 Master Download Unlock
              </span>
            </div>

            {/* License Option Selector */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                Select License Tier
              </span>

              {/* Standard Commercial */}
              <div
                onClick={() => setSelectedLicense("standard")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedLicense === "standard"
                    ? "bg-emerald-500/10 border-emerald-500 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Commercial License</span>
                  <span className="text-xs font-bold text-emerald-400">Included</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                  Commercial YouTube, social ads, website backgrounds, client projects. Unlimited views.
                </p>
              </div>

              {/* Extended Resell License */}
              <div
                onClick={() => setSelectedLicense("extended")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedLicense === "extended"
                    ? "bg-emerald-500/10 border-emerald-500 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Extended / Broadcast</span>
                  <span className="text-xs font-bold text-emerald-400">+150%</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                  National TV broadcast, theatrical release, digital templates, and merch resale.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isPurchasedInCart
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25 hover:scale-[1.02]"
                }`}
              >
                {isPurchasedInCart ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Cart & Checkout
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="w-full py-3 rounded-xl font-semibold text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center"
              >
                View Cart & Complete Purchase
              </Link>
            </div>

            {/* Guarantees */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted Razorpay Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant High-Speed R2 Master Download</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Videos */}
      {relatedVideos.length > 0 && (
        <div className="pt-12 border-t border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">More from this Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedVideos.map((item) => (
              <VideoCard key={item.id} video={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
