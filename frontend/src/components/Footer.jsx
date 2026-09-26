import { Layers, Mail, ShieldCheck, Lock } from 'lucide-react';

export function Footer({ onNavigate }) {
  return (
    <footer className="print:hidden relative z-10 bg-white/90 dark:bg-[#040814]/95 border-t border-slate-200 dark:border-white/10 mt-20 backdrop-blur-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Top Grid: Brand + Nav Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-100 dark:border-white/10">
          
          {/* Column 1: Brand & Mission (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-orange-500 p-[1px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-headline-lg text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Pitch<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-orange-500">vane</span>
              </span>
              <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                v2.4 Core
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              Autonomous multi-agent due diligence system for venture capitalists, angels, and syndicate leads. Synthesizes institutional investment committee memos in 120 seconds.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Zero Data Retention
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <Lock className="w-3.5 h-3.5 text-cyan-500" />
                256-Bit TLS
              </span>
            </div>
          </div>

          {/* Column 2: Platform Engine (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-headline-sm text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('warroom')}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Live War Room
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('dealflow')}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Deal Flow Pipeline
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('dossiers')}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  IC Dossiers & Reports
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('compare')}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Deal Battle Comparator
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: AI Specialist Swarm (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-headline-sm text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Agent Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>Market Analyst (TAM & Market Sizing)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span>Competitor Scout (Moat & Defensibility)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Financial Modeler (Unit Economics & Runway)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>Risk Assessor (Volatility & Red Flags)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright + Ayan Paul details/links + Telemetry */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Left: Copyright */}
          <div className="text-slate-500 dark:text-slate-400 font-light text-center md:text-left">
            © {new Date().getFullYear()} <span className="font-semibold text-slate-700 dark:text-slate-300">PitchVane Intelligence Corp</span>. All rights reserved.
          </div>

          {/* Center: Ayan Paul Creator Profile & Socials */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-xs">Engineered by</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs">
              <span className="font-bold">Ayan Paul</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <a
                href="https://github.com/ayanpaul14"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 font-semibold transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <a
                href="mailto:ayanpaul626@gmail.com"
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 font-semibold transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-500" />
                <span>Contact</span>
              </a>
            </div>
          </div>

          {/* Right: Operational Status */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span>Mesh: 100% Operational</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
