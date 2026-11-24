"use client";

import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Download,
  Users,
  Video,
  Layers,
  Plus,
  CloudUpload,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { INITIAL_VIDEOS, INITIAL_BUNDLES } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const REVENUE_DATA = [
  { name: "Mon", revenue: 14200, orders: 18 },
  { name: "Tue", revenue: 21800, orders: 27 },
  { name: "Wed", revenue: 18400, orders: 22 },
  { name: "Thu", revenue: 29500, orders: 36 },
  { name: "Fri", revenue: 38200, orders: 49 },
  { name: "Sat", revenue: 47600, orders: 62 },
  { name: "Sun", revenue: 54100, orders: 74 },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "videos" | "bundles" | "upload">("overview");
  const [videoList, setVideoList] = useState(INITIAL_VIDEOS);
  const [bundlesList, setBundlesList] = useState(INITIAL_BUNDLES);

  // New video form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Cyberpunk & Sci-Fi");
  const [newPrice, setNewPrice] = useState("599");
  const [newPrompt, setNewPrompt] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newVideo = {
      id: `vid-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      description: `Newly published cinematic AI shot generated with prompt: "${newPrompt.slice(0, 50)}..."`,
      category_id: "cat-1",
      category: {
        id: "cat-1",
        name: newCategory,
        slug: "cyberpunk-sci-fi",
        description: "",
      },
      prompt: newPrompt || "Cinematic 4K render",
      model_used: "Runway Gen-3 Alpha",
      duration: 10,
      resolution: "4K" as const,
      fps: 60,
      aspect_ratio: "16:9" as const,
      preview_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      r2_master_key: `masters/${newTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-4k.mov`,
      r2_master_file_size_mb: 210.0,
      price: parseFloat(newPrice) || 499,
      tags: ["AI", "4K", newCategory],
      downloads_count: 0,
      views_count: 1,
      created_at: new Date().toISOString(),
    };

    setVideoList([newVideo, ...videoList]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setNewTitle("");
      setNewPrompt("");
      setActiveTab("videos");
    }, 1200);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("Are you sure you want to delete this asset from catalog?")) {
      setVideoList(videoList.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Studio Command Center
          </span>
          <h1 className="text-3xl font-extrabold text-white">Admin Management Dashboard</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#11131a] p-1.5 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "overview" ? "bg-emerald-500 text-black shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "videos" ? "bg-emerald-500 text-black shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            Videos ({videoList.length})
          </button>
          <button
            onClick={() => setActiveTab("bundles")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "bundles" ? "bg-emerald-500 text-black shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            Bundles ({bundlesList.length})
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              activeTab === "upload" ? "bg-emerald-500 text-black shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Upload Video
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#11131a] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{formatCurrency(223800)}</div>
              <span className="text-xs text-emerald-400 font-medium">↑ +24% vs last week</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#11131a] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Downloads</span>
                <Download className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white">2,344</div>
              <span className="text-xs text-emerald-400 font-medium">↑ +18% 4K master uncompressed</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#11131a] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Live Assets</span>
                <Video className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{videoList.length}</div>
              <span className="text-xs text-gray-400">Across 5 main categories</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#11131a] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Paying Customers</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">582</div>
              <span className="text-xs text-emerald-400 font-medium">↑ 92% retention rate</span>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="p-6 rounded-2xl bg-[#11131a] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Weekly Revenue Trajectory</h3>
                <p className="text-xs text-gray-400">Verified Razorpay transactions in INR</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                LIVE SYNC
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#11131a",
                      borderColor: "#232738",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VIDEOS LIST & MANAGEMENT */}
      {activeTab === "videos" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Video Asset Catalog</h2>
            <button
              onClick={() => setActiveTab("upload")}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Video
            </button>
          </div>

          <div className="rounded-2xl bg-[#11131a] border border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Video Asset</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Quality</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {videoList.map((video) => (
                  <tr key={video.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-14 h-9 rounded object-cover bg-black"
                      />
                      <div>
                        <span className="font-bold text-white text-sm block line-clamp-1">
                          {video.title}
                        </span>
                        <span className="text-[11px] text-gray-500 font-mono">
                          {video.r2_master_key}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">{video.category?.name || "General"}</td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">{video.resolution} @ {video.fps}fps</td>
                    <td className="p-4">{video.downloads_count}</td>
                    <td className="p-4 font-bold text-white">{formatCurrency(video.sale_price || video.price)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5"
                        title="Delete asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BUNDLES MANAGEMENT */}
      {activeTab === "bundles" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Active Curated Bundles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bundlesList.map((bundle) => (
              <div
                key={bundle.id}
                className="p-5 rounded-2xl bg-[#11131a] border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      {bundle.badge}
                    </span>
                    <span className="text-gray-400 font-mono">
                      Includes {(bundle.video_ids || []).length} Clips
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base">{bundle.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{bundle.description}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-white">
                      {formatCurrency(bundle.price)}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      {formatCurrency(bundle.regular_price)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    Active on Storefront
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: UPLOAD NEW VIDEO */}
      {activeTab === "upload" && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#11131a] border border-emerald-500/30 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CloudUpload className="w-5 h-5 text-emerald-400" /> Upload New 4K AI Video Asset
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Direct master video file upload configured with Cloudflare R2 bucket storage.
            </p>
          </div>

          {uploadSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Asset successfully published to Viper AI Studio marketplace!</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Video Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Cyber Hologram Tokyo Rain"
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#181a24] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Cyberpunk & Sci-Fi">Cyberpunk & Sci-Fi</option>
                  <option value="Cinematic Nature">Cinematic Nature</option>
                  <option value="Dark Fantasy & Magic">Dark Fantasy & Magic</option>
                  <option value="Abstract & Liquid Motion">Abstract & Liquid Motion</option>
                  <option value="Urban & Fashion">Urban & Fashion</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Price (INR) *</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-[#181a24] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Generation AI Prompt</label>
              <textarea
                rows={3}
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Prompt utilized to generate this shot (e.g. Runway Gen-3 / Sora parameters)..."
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Drag & Drop Simulation */}
            <div className="border-2 border-dashed border-white/10 hover:border-emerald-500/50 rounded-2xl p-6 text-center space-y-2 cursor-pointer bg-white/5">
              <CloudUpload className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-xs font-medium text-white">
                Drag and drop 4K ProRes Master (.MOV or .MP4)
              </div>
              <p className="text-[11px] text-gray-500">
                Up to 2GB per asset. Automatic watermarked web preview generation enabled.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Publish Video to Marketplace
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
