"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, ArrowRight, ShieldCheck, Film } from "lucide-react";
import { INITIAL_VIDEOS } from "@/lib/mock-data";

export function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "ORD-DEMO-9481";
  const email = searchParams.get("email") || "creator@studio.com";

  // Pick first 2 mock videos for demonstration download
  const purchasedVideos = INITIAL_VIDEOS.slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-center">
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Payment Confirmed!</h1>
        <p className="text-gray-300 mt-2 text-sm sm:text-base">
          Thank you for choosing Viper AI Studio. Your commercial license keys and master 4K files are unlocked.
        </p>
        <p className="text-xs text-gray-500 mt-1 font-mono">
          Order ID: {orderId} • Delivered to: {email}
        </p>
      </div>

      {/* Instant Downloads Card */}
      <div className="p-6 rounded-2xl bg-[#11131a] border border-white/10 text-left space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="font-bold text-white text-sm flex items-center gap-2">
            <Film className="w-4 h-4 text-emerald-400" /> Unlocked Master Files
          </span>
          <span className="text-xs text-emerald-400 font-semibold">
            Cloudflare R2 High-Speed Server
          </span>
        </div>

        <div className="space-y-3">
          {purchasedVideos.map((video) => (
            <div
              key={video.id}
              className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-16 h-11 rounded-lg object-cover bg-black"
                />
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{video.title}</h4>
                  <span className="text-xs text-gray-400 font-mono">
                    {video.resolution} • ProRes ~{video.r2_master_file_size_mb} MB
                  </span>
                </div>
              </div>

              <a
                href={`/api/downloads/${video.id}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <Download className="w-3.5 h-3.5" /> Download Master
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/library"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 flex items-center justify-center gap-2"
        >
          <span>Go to My Vault</span>
        </Link>
        <Link
          href="/catalog"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
