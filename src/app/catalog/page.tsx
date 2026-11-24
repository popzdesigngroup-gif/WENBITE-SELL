"use client";

import { useState } from "react";
import { INITIAL_VIDEOS, CATEGORIES } from "@/lib/mock-data";
import { VideoCard } from "@/components/VideoCard";
import { Search, Filter, SlidersHorizontal, Film } from "lucide-react";

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedResolution, setSelectedResolution] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  // Filtering logic
  const filteredVideos = INITIAL_VIDEOS.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      video.prompt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      video.category?.slug === selectedCategory ||
      video.category_id === selectedCategory;

    const matchesResolution =
      selectedResolution === "all" || video.resolution === selectedResolution;

    return matchesSearch && matchesCategory && matchesResolution;
  }).sort((a, b) => {
    if (sortBy === "popular") return b.downloads_count - a.downloads_count;
    if (sortBy === "price-low") return (a.sale_price || a.price) - (b.sale_price || b.price);
    if (sortBy === "price-high") return (b.sale_price || b.price) - (a.sale_price || a.price);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
          <Film className="w-8 h-8 text-emerald-400" />
          Browse AI Video Footage
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Filter through pristine uncompressed master shots, cinematic B-roll, and looping VFX assets.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-[#11131a] p-4 sm:p-6 rounded-2xl border border-white/10 shadow-lg">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by keywords, tags, or prompt (e.g. 'cyberpunk', 'aurora', 'macro')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181a24] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#181a24] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#11131a] rounded-2xl border border-white/10">
          <p className="text-gray-400 text-base">No AI video assets match your search criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
