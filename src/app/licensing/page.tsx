import { ShieldCheck, Check, Sparkles } from "lucide-react";

export default function LicensingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" /> Clear & Transparent Terms
        </div>
        <h1 className="text-4xl font-extrabold text-white">Commercial Licensing Guide</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          All videos on Viper AI Studio are released with clear, legally vetted rights so you can publish with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Commercial License */}
        <div className="p-8 rounded-3xl bg-[#11131a] border border-emerald-500/40 space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Default License</span>
            <h2 className="text-2xl font-bold text-white">Standard Commercial</h2>
            <p className="text-sm text-gray-400">Included with every individual video and bundle.</p>
          </div>

          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>YouTube monetization & social media advertisements</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Client video editing & commercial agency productions</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Website backgrounds, apps, SaaS landing pages</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Worldwide rights in perpetuity with unlimited impressions</span>
            </li>
          </ul>
        </div>

        {/* Extended License */}
        <div className="p-8 rounded-3xl bg-[#11131a] border border-white/10 space-y-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Enterprise & Broadcast</span>
            <h2 className="text-2xl font-bold text-white">Extended Broadcast</h2>
            <p className="text-sm text-gray-400">For national television and resale distributions.</p>
          </div>

          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>National & global television commercials & cable broadcast</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Theatrical films, Netflix/streaming series releases</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Digital templates (Premiere / After Effects templates for resale)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Includes full indemnification protection</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
