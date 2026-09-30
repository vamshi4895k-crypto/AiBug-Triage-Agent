import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Coffee, 
  HelpCircle, 
  Lightbulb, 
  Code2
} from 'lucide-react';

interface QuickTip {
  title: string;
  desc: string;
  category: string;
}

const QUICK_TIPS: QuickTip[] = [
  {
    title: 'Optional Chaining (?.)',
    desc: 'Prevents "Cannot read properties of undefined" on nested payloads: use user?.profile?.email',
    category: 'JavaScript'
  },
  {
    title: 'dict.get(key, default)',
    desc: 'Avoids KeyError in Python when accessing dictionary keys that might be missing.',
    category: 'Python'
  },
  {
    title: 'Defer Cleanup & Contexts',
    desc: 'Always defer conn.Release() or response.Body.Close() only after verifying nil err.',
    category: 'Go / Backend'
  },
  {
    title: 'Unhandled Promise Traps',
    desc: 'Wrap async operations in try/catch or chain .catch() to avoid Node uncaught exception exits.',
    category: 'Async Flow'
  }
];

export const TriageBuddyCompanion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tips' | 'about'>('tips');

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="fixed bottom-5 right-5 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#121824]/95 hover:bg-[#182232] border border-[#00f0ff]/40 text-slate-100 shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md group transition-all"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#00f0ff] shadow-sm">
              <img src="/developer_avatar.jpg" alt="Leo" className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0d1117]" />
          </div>

          <div className="text-left font-mono">
            <div className="text-xs font-bold text-[#00f0ff] flex items-center gap-1">
              <span>Leo's Tips</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Coffee className="w-2.5 h-2.5 text-amber-400" />
              <span>Triage Companion</span>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Companion Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg bg-[#0d1117] border border-[#1e2633] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Top Bar */}
              <div className="p-4 bg-[#121824] border-b border-[#1e2633] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#00f0ff]/40 shadow-inner">
                    <img src="/developer_avatar.jpg" alt="Leo Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <span>Leo • AI Triage Companion</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">ONLINE</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Debug advice, crash taxonomy &amp; quick tips
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#161b22] hover:bg-[#1e2633] border border-[#30363d] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Character Intro Banner */}
              <div className="p-4 bg-gradient-to-r from-[#121824] to-[#0d1117] border-b border-[#1e2633] flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-white/5">
                  <img src="/developer_mascot.jpg" alt="Leo at Work" className="w-full h-full object-cover object-center" />
                </div>
                <div className="text-xs font-mono text-slate-300">
                  <p className="font-semibold text-slate-100 mb-1">"Every bug has a story."</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Paste any error code or stack trace into the main input, or review the common developer traps below while sipping coffee.
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#1e2633] bg-[#0a0d12] text-xs font-mono">
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`flex-1 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === 'tips' ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] bg-[#121824]/50' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Debugging Cheatsheet</span>
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === 'about' ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] bg-[#121824]/50' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>How Leo Works</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 overflow-y-auto space-y-3 font-mono text-xs flex-1">
                {activeTab === 'tips' ? (
                  QUICK_TIPS.map((tip, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#12171f] border border-[#1e2633] hover:border-[#30363d] transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                          <Code2 className="w-3 h-3 text-[#00f0ff]" />
                          {tip.title}
                        </span>
                        <span className="text-[10px] text-slate-500 bg-[#0d1117] px-1.5 py-0.5 rounded border border-[#1e2633]">
                          {tip.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {tip.desc}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="space-y-3 text-slate-300 text-xs">
                    <div className="p-3 rounded-xl bg-[#12171f] border border-[#1e2633]">
                      <h4 className="font-bold text-[#00f0ff] mb-1">1. Heuristic &amp; AST Analysis</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Leo first scans syntax markers, stack frame file paths, and unhandled exception signatures to build an execution timeline.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#12171f] border border-[#1e2633]">
                      <h4 className="font-bold text-[#00f0ff] mb-1">2. Fault Line Isolation</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        The exact faulty expression is pinpointed in an IDE code frame with suspicious gutter markers (`^^^^^ POSSIBLE ISSUE`).
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#12171f] border border-[#1e2633]">
                      <h4 className="font-bold text-[#00f0ff] mb-1">3. Verified Code Diff</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        A clean BEFORE vs AFTER diff is generated with one-click clipboard copy to apply directly to your editor.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action */}
              <div className="p-3 bg-[#0a0d12] border-t border-[#1e2633] flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#161b22] hover:bg-[#1e2633] border border-[#30363d] text-xs font-mono text-slate-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
