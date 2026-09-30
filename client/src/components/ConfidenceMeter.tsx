import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfidenceMeterProps {
  confidence: number;
  confidenceReason?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  confidenceReason,
}) => {
  const percentage = Math.min(100, Math.max(0, confidence));

  const getConfidenceLevel = (val: number) => {
    if (val >= 85) return { label: 'High Confidence', color: 'text-emerald-400', barColor: 'bg-emerald-500', glow: 'shadow-[0_0_12px_#10b981]' };
    if (val >= 60) return { label: 'Moderate Confidence', color: 'text-amber-400', barColor: 'bg-amber-500', glow: 'shadow-[0_0_12px_#f59e0b]' };
    return { label: 'Low / Exploratory', color: 'text-rose-400', barColor: 'bg-rose-500', glow: 'shadow-[0_0_12px_#f43f5e]' };
  };

  const level = getConfidenceLevel(percentage);

  // Generate ASCII-style bar indicator like ██████████████████░░
  const totalBlocks = 20;
  const filledBlocks = Math.round((percentage / 100) * totalBlocks);
  const asciiBar = '█'.repeat(filledBlocks) + '░'.repeat(totalBlocks - filledBlocks);

  return (
    <div className="rounded-xl bg-[#0d1117] border border-[#1e2633] p-5 shadow-xl group hover:border-[#2d3748] transition-all">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
            Analysis Confidence
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold ${level.color}`}>
            {level.label}
          </span>
          <span className="text-sm font-mono font-bold text-slate-100 bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-[#161b22] h-2 rounded-full overflow-hidden border border-[#2d3748]/60 my-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${level.barColor} ${level.glow}`}
        />
      </div>

      {/* ASCII Terminal Representation */}
      <div className="hidden sm:block text-[11px] font-mono text-slate-500 tracking-wider select-none my-1">
        [{asciiBar}] {percentage}%
      </div>

      {/* Confidence Reason */}
      {confidenceReason && (
        <div className="mt-3 pt-3 border-t border-[#1e2633] flex items-start gap-2 text-xs font-mono text-slate-400 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>{confidenceReason}</span>
        </div>
      )}
    </div>
  );
};
