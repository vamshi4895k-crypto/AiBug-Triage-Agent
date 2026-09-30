import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

interface WhyItHappenedProps {
  explanation: string;
}

export const WhyItHappened: React.FC<WhyItHappenedProps> = ({ explanation }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl bg-[#0d1117] border border-[#1e2633] overflow-hidden shadow-xl transition-all hover:border-[#2d3748]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-[#12171f] hover:bg-[#161c24] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-[#161b22] border border-[#30363d] flex items-center justify-center text-amber-400">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              Why did this happen?
            </span>
            <span className="text-[11px] font-mono text-slate-500 ml-2">
              (Architectural Context)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            {isOpen ? 'Collapse' : 'Explain Concept'}
          </span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5 sm:p-6 bg-[#0d1117] border-t border-[#1e2633]"
          >
            <div className="text-sm font-sans text-slate-300 leading-relaxed max-w-3xl">
              {explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
