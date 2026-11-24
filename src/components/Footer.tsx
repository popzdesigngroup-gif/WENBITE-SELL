import Link from "next/link";
import { Play, Shield, Sparkles, Zap, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07080b] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-[#090a0f] rounded-[6px] flex items-center justify-center">
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400 ml-0.5" />
              </div>
            </div>
            <span className="font-bold text-lg text-white tracking-wider">
              VIPER<span className="text-emerald-400">.AI</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            The next-generation digital marketplace for creator-grade, uncompressed AI cinematic stock video footage and VFX loops.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Marketplace</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/catalog" className="hover:text-emerald-400 transition-colors">All AI Footage</Link></li>
            <li><Link href="/catalog?category=cyberpunk-sci-fi" className="hover:text-emerald-400 transition-colors">Cyberpunk & Sci-Fi</Link></li>
            <li><Link href="/catalog?category=cinematic-nature" className="hover:text-emerald-400 transition-colors">Cinematic Nature</Link></li>
            <li><Link href="/catalog?category=abstract-motion" className="hover:text-emerald-400 transition-colors">Abstract Loops</Link></li>
            <li><Link href="/bundles" className="hover:text-emerald-400 transition-colors">Curated Video Vaults</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Legal & Trust</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/licensing" className="hover:text-emerald-400 transition-colors">Commercial Licensing</Link></li>
            <li><Link href="/licensing" className="hover:text-emerald-400 transition-colors">Resell Rights Policy</Link></li>
            <li><Link href="/licensing" className="hover:text-emerald-400 transition-colors">Master 4K Downloads</Link></li>
            <li><Link href="/licensing" className="hover:text-emerald-400 transition-colors">Privacy & Security</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Cloud Security</h4>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Protected with Cloudflare R2 presigned delivery and encrypted Razorpay transactions.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Instant Digital Delivery</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <p>© 2026 Viper AI Studio. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Engineered for high-performing video creators & filmmakers.
        </p>
      </div>
    </footer>
  );
}
