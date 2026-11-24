"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { VideoItem } from "@/types";
import { Play, Sparkles, Download, Eye, ShoppingBag, Check } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface VideoCardProps {
  video: VideoItem;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addToCart, cart } = useCart();

  const isPurchasedInCart = cart.some((c) => c.id === video.id);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: video.id,
      type: "video",
      title: video.title,
      thumbnail: video.thumbnail_url,
      price: video.sale_price || video.price,
      resolution: video.resolution,
      license_type: "commercial",
    });
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl overflow-hidden bg-[#11131a] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 flex flex-col shadow-lg hover:shadow-emerald-500/10"
    >
      {/* Video / Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/60 protected-watermark-grid">
        {/* Poster Image */}
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Dynamic Video Hover Preview with Watermark & Security */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={video.preview_url}
            muted
            loop
            playsInline
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none select-none ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Transparent click shield overlay so video cannot be saved or right-clicked */}
          <div className="absolute inset-0 z-[5] select-none pointer-events-auto" onContextMenu={(e) => e.preventDefault()} />
        </div>

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            {video.resolution}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/70 backdrop-blur-md text-gray-300 border border-white/10">
            {video.fps} FPS
          </span>
        </div>

        {/* Right Corner Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {video.is_trending && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md">
              HOT
            </span>
          )}
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[11px] font-mono bg-black/80 backdrop-blur-md text-white border border-white/10 z-10">
          {formatDuration(video.duration)}
        </div>

        {/* Center Hover Play Icon */}
        <Link
          href={`/video/${video.slug}`}
          className={`absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-opacity duration-200 z-10 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-black flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </Link>
      </div>

      {/* Video Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="text-emerald-400 font-medium">
              {video.category?.name || "AI Generated"}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" /> {video.downloads_count}
            </span>
          </div>

          <Link href={`/video/${video.slug}`}>
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 text-base">
              {video.title}
            </h3>
          </Link>

          <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white">
                {formatCurrency(video.sale_price || video.price)}
              </span>
              {video.sale_price && (
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(video.price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
              Commercial License
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
              isPurchasedInCart
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-white/10 hover:bg-emerald-500 text-white hover:text-black border border-white/10"
            }`}
            title={isPurchasedInCart ? "In Cart" : "Add to Cart"}
          >
            {isPurchasedInCart ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
