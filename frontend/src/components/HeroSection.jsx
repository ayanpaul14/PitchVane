import React, { useMemo } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';
import { motion } from 'framer-motion';
import { Play, FileText, ShieldCheck, Lock, Sparkles, Activity, Layers, Database, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

const DARK_SHADER_COLORS = ['#030712', '#083344', '#0e7490', '#164e63', '#ea580c'];
const LIGHT_SHADER_COLORS = ['#f8fafc', '#38bdf8', '#818cf8', '#c084fc', '#fb923c'];

const KEY_METRICS = [
  {
    title: 'Execution Speed',
    value: '118.4s',
    subtext: 'Full 18-page verdict memo',
    icon: Activity,
    color: 'text-cyan-500 dark:text-cyan-400',
    borderGlow: 'from-cyan-400 to-blue-500',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    title: 'Vector Grounding',
    value: '100%',
    subtext: 'Document Accuracy > 98%',
    icon: Database,
    color: 'text-emerald-500 dark:text-emerald-400',
    borderGlow: 'from-emerald-400 to-teal-500',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    title: 'Discrepancy Engine',
    value: 'Dual-Pass',
    subtext: 'Cross-agent contradiction test',
    icon: Layers,
    color: 'text-orange-500 dark:text-orange-400',
    borderGlow: 'from-orange-400 to-rose-500',
    iconBg: 'bg-orange-500/10 border-orange-500/20',
  },
  {
    title: 'Live Web Grounding',
    value: 'Live Web',
    subtext: 'Zero synthetic hallucinations',
    icon: Compass,
    color: 'text-violet-500 dark:text-cyan-300',
    borderGlow: 'from-cyan-500 to-violet-600',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
  },
];

const AGENTS = [
  { id: 'market', title: 'Market Analyst', desc: 'TAM sizing & growth modeling', stat: '94% Match', icon: Compass, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-950/40' },
  { id: 'competitor', title: 'Competitor Scout', desc: 'Moat analysis & direct rivals', stat: '89% Moat', icon: Layers, color: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-950/40' },
  { id: 'financial', title: 'Financial Modeler', desc: 'Unit economics & runway test', stat: '71% Margin', icon: Database, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-950/40' },
  { id: 'risk', title: 'Risk Assessor', desc: 'Regulatory & key-person audit', stat: 'Low Risk', icon: ShieldCheck, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/40' },
];

// Stagger container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 220,
    },
  },
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.35,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 22,
      stiffness: 200,
    },
  },
};

export function HeroSection({ onStartCaseClick, onLoadSampleClick }) {
  const { isDark } = useTheme();

  const shaderColors = useMemo(() => {
    return isDark ? DARK_SHADER_COLORS : LIGHT_SHADER_COLORS;
  }, [isDark]);

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center overflow-hidden pb-14 isolate">
      {/* Hardware-accelerated stabilized shader background */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden opacity-40 dark:opacity-55 will-change-transform"
        style={{
          contain: 'paint size layout',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        <MeshGradient
          className="absolute inset-0 w-full h-full"
          colors={shaderColors}
          speed={0.14}
          distortion={0.55}
          swirl={0.22}
          backgroundColor="transparent"
        />
        {/* Soft radial backdrop to smooth lighting transitions and prevent contrast flicker */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f8fafc] dark:to-[#030712] pointer-events-none" />
      </div>

      {/* Inner padded content area with smooth entry orchestration */}
      <motion.div 
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Centered headline block */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Status Pill */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-slate-200/80 dark:border-white/20 shadow-md shadow-cyan-500/5 whitespace-nowrap">
              <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-telemetry-sm text-[11px] font-bold tracking-wider uppercase text-slate-800 dark:text-white whitespace-nowrap">
                Autonomous AI Diligence
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="font-display-lg text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
              Autonomous Startup Diligence in{' '}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 dark:from-white dark:via-cyan-400 dark:to-orange-400 inline-block pb-1"
                style={{
                  WebkitBackgroundClip: 'text',
                  transform: 'translate3d(0, 0, 0)',
                  backfaceVisibility: 'hidden',
                }}
              >
                120 Seconds Flat
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-normal text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Four specialized AI agents conduct comprehensive market, competitor, financial, and risk due diligence simultaneously — synthesizing institutional-grade investment committee memos in minutes.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <motion.button
              type="button"
              onClick={onStartCaseClick}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 dark:from-cyan-500 dark:to-orange-500 text-white font-bold text-sm tracking-wide uppercase shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-105 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Live Diligence Case</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={onLoadSampleClick}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/90 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-semibold text-sm transition-all backdrop-blur-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
              <span>Browse Sample Memo</span>
            </motion.button>
          </motion.div>

          {/* Institutional Trust Badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3.5 pt-1 text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              SOC2 Type II Certified
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-2xs">
              <Lock className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              Strict Privacy
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-orange-400" />
              Zero Data Retention
            </span>
          </motion.div>
        </div>

        {/* 4 Specialized Agents Showcase Strip with Stagger */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={cardContainerVariants}
        >
          {AGENTS.map((agent) => {
            const IconComp = agent.icon;
            return (
              <motion.div
                key={agent.id}
                variants={cardItemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-4 rounded-2xl bg-white/80 dark:bg-[#060b19]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl flex items-center justify-between gap-3 group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${agent.bg} ${agent.border} border flex items-center justify-center shrink-0`}>
                    <IconComp className={`w-5 h-5 ${agent.color}`} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-headline-sm text-xs font-bold text-slate-900 dark:text-white truncate">
                      {agent.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {agent.desc}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30 px-2 py-0.5 rounded-full shrink-0">
                  {agent.stat}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 4 Key Metric Tiles with Stagger */}
        <motion.div 
          id="metrics" 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left"
          variants={cardContainerVariants}
        >
          {KEY_METRICS.map((metric, idx) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={idx}
                variants={cardItemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-5 bg-white/85 dark:bg-[#060b19]/85 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metric.borderGlow}`}></div>
                <div className="flex items-center justify-between pb-2">
                  <span className="font-telemetry-sm text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {metric.title}
                  </span>
                  <div className={`w-7 h-7 rounded-lg ${metric.iconBg} border flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 ${metric.color}`} />
                  </div>
                </div>
                <div className="font-headline-md text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {metric.value}
                </div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                  {metric.subtext}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
