"use client";

import Link from "next/link";
import { INITIAL_VIDEOS } from "@/lib/mock-data";
import { Download, Film, Key, ShieldCheck, Play } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export default function LibraryPage() {
  // Demo customer purchased library
  const purchasedVideos = INITIAL_VIDEOS.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
          <Film className="w-8 h-8 text-emerald-400" />
          My Creator Vault
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          All your purchased AI video licenses, uncompressed 4K master files, and cryptographic license certificates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedVideos.map((video, idx) => (
          <div
            key={video.id}
            className="p-5 rounded-2xl bg-[#11131a] border border-white/10 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all shadow-lg"
          >
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[11px] font-mono bg-black/80 text-white">
                  {formatDuration(video.duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  COMMERCIAL LICENSE
                </span>
                <span className="text-xs text-gray-400 font-mono">{video.resolution}</span>
              </div>

              <h3 className="font-bold text-white text-base line-clamp-1">{video.title}</h3>

              <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1 text-xs">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3 text-emerald-400" /> License ID:
                  </span>
                  <span className="font-mono text-gray-300">VPR-LIC-{9823 + idx * 47}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Cloudflare R2:</span>
                  <span className="text-emerald-400 font-medium">Ready ({video.r2_master_file_size_mb} MB)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={`/api/downloads/${video.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" /> Download 4K Master
              </a>
              <Link
                href={`/video/${video.slug}`}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
                title="View preview details"
              >
                <Play className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
