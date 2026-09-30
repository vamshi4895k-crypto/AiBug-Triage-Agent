import React from 'react';
import { motion } from 'framer-motion';
import { Bug, Sparkles, Compass, ArrowDown, Binary, Check, Coffee, Zap, ShieldCheck, Code2 } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center select-none text-center gap-8 py-2">
      {/* Hero Showcase Card featuring 3D Developer Character */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-5xl rounded-2xl bg-gradient-to-br from-[#0e131b] via-[#0b0e14] to-[#07090c] border border-[#1e2633] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden text-left"
      >
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text / Info Column */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161f2c] border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono w-fit shadow-[0_0_15px_rgba(0,240,255,0.08)]">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping inline-block" />
              <span className="font-semibold tracking-wide">MEET YOUR AI TRIAGE PARTNER</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
              Debug errors in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-sky-300 to-indigo-300">seconds</span>, not hours.
            </h1>

            {/* Description */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Paste your raw stack trace, unhandled promise, or failing snippet. 
              <strong className="text-slate-200"> Leo</strong> analyzes the execution flow, pinpoints the suspicious line in your code, and delivers verified before-and-after fixes with full architectural reasoning.
            </p>

            {/* Mascot Interactive Speech Bubble */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-1 p-3.5 rounded-xl bg-[#121824]/90 border border-[#222e42] flex items-center gap-3 shadow-lg"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#00f0ff]/40 shadow-sm">
                <img src="/developer_avatar.jpg" alt="Leo" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs font-mono text-slate-300">
                <span className="text-[#00f0ff] font-semibold">Leo:</span> "Grab a coffee ☕, drop your error log below, and let's get your build back to green!"
              </div>
            </motion.div>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0e141f] border border-[#1c2636] text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Instant Root Cause</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0e141f] border border-[#1c2636] text-slate-300">
                <Code2 className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
                <span>Fault Line Marker</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0e141f] border border-[#1c2636] text-slate-300 col-span-2 sm:col-span-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified 1-Click Fix</span>
              </div>
            </div>
          </div>

          {/* Right 3D Character Showcase Frame */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
            >
              {/* Image Frame */}
              <div className="aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden bg-[#0d1117] flex items-center justify-center relative">
                <img
                  src="/developer_mascot.jpg"
                  alt="Leo 3D Pixar Developer Mascot working on laptop with coffee"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080a0d] via-transparent to-transparent opacity-60" />
              </div>

              {/* Character Floating Card */}
              <div className="p-3.5 bg-[#0e131b]/95 border-t border-[#1e2633] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                  <div className="text-left">
                    <div className="text-xs font-mono font-bold text-slate-100 flex items-center gap-1.5">
                      <span>Leo • Autonomous Dev Agent</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Single-Agent Triage • Ready for analysis
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
                  <Coffee className="w-3 h-3" />
                  <span>Coffee: Hot</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 3-Step Node Pipeline Animation */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-4xl px-4">
        {/* Node 1: Drop Error */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 w-full md:w-auto p-4 rounded-xl bg-[#0d1117] border border-[#1e2633] flex flex-col items-center relative group hover:border-[#30363d] transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center text-rose-400 mb-2 shadow-inner group-hover:scale-105 transition-transform">
            <Bug className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-200 tracking-wide">
            01. DROP AN ERROR
          </span>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Stack trace, log file, code or screenshot
          </p>
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          </div>
        </motion.div>

        {/* Connector 1 */}
        <div className="flex flex-col items-center justify-center text-slate-600">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="md:-rotate-90 text-[#00f0ff]"
          >
            <ArrowDown className="w-5 h-5 opacity-70" />
          </motion.div>
        </div>

        {/* Node 2: AI Investigates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex-1 w-full md:w-auto p-4 rounded-xl bg-[#0d1117] border border-[#1e2633] flex flex-col items-center relative group hover:border-[#00f0ff]/40 transition-all shadow-[0_0_15px_rgba(0,240,255,0.03)]"
        >
          <div className="w-10 h-10 rounded-lg bg-[#161b22] border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] mb-2 shadow-inner group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-200 tracking-wide">
            02. AI INVESTIGATES
          </span>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Parses stack trace, isolates root cause
          </p>
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/50 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
          </div>
        </motion.div>

        {/* Connector 2 */}
        <div className="flex flex-col items-center justify-center text-slate-600">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
            className="md:-rotate-90 text-emerald-400"
          >
            <ArrowDown className="w-5 h-5 opacity-70" />
          </motion.div>
        </div>

        {/* Node 3: Debugging Path */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex-1 w-full md:w-auto p-4 rounded-xl bg-[#0d1117] border border-[#1e2633] flex flex-col items-center relative group hover:border-emerald-500/40 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-[#161b22] border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 shadow-inner group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-200 tracking-wide">
            03. GET DEBUGGING PATH
          </span>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Interactive steps, suspicious line &amp; fix
          </p>
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
            <Check className="w-2 h-2 text-emerald-400" />
          </div>
        </motion.div>
      </div>

      {/* Subtle Terminal Prompt Line */}
      <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
        <Binary className="w-3.5 h-3.5 text-[#00f0ff]" />
        <span>Ready for input • Paste error or load demo preset below</span>
      </div>
    </div>
  );
};
