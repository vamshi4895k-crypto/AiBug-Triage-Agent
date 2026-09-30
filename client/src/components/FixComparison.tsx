import React, { useState } from 'react';
import { Copy, Check, Wrench, Sparkles } from 'lucide-react';
import { SuggestedFix } from '../types/triage';
import { useToast } from './Toast';

interface FixComparisonProps {
  suggestedFix: SuggestedFix;
}

export const FixComparison: React.FC<FixComparisonProps> = ({ suggestedFix }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'full'>('split');

  const handleCopy = () => {
    const textToCopy = suggestedFix.fullCode || suggestedFix.after;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('success', 'Fix copied to clipboard', 'Ready to paste into your codebase');
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="rounded-xl bg-[#0d1117] border border-[#1e2633] overflow-hidden shadow-2xl group hover:border-[#2d3748] transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#12171f] border-b border-[#1e2633]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#161b22] border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wrench className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                Suggested Fix
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PROPOSED REMEDY
              </span>
            </div>
          </div>
        </div>

        {/* View Toggle & Copy Button */}
        <div className="flex items-center gap-2">
          {suggestedFix.fullCode && (
            <div className="flex items-center bg-[#161b22] rounded p-0.5 border border-[#30363d] text-[11px] font-mono">
              <button
                onClick={() => setViewMode('split')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  viewMode === 'split' ? 'bg-[#1e2633] text-slate-200 font-medium' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Diff
              </button>
              <button
                onClick={() => setViewMode('full')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  viewMode === 'full' ? 'bg-[#1e2633] text-slate-200 font-medium' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Full Block
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Fix</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diff View Comparison */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1e2633] bg-[#090b0e]">
          {/* Before */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                BEFORE (BUGGY)
              </span>
            </div>
            <div className="bg-[#12171f]/80 rounded-lg p-3 border border-rose-500/20 font-mono text-xs sm:text-sm text-rose-200 whitespace-pre overflow-x-auto">
              {suggestedFix.before || 'user.email'}
            </div>
          </div>

          {/* After */}
          <div className="p-4 bg-emerald-500/[0.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                AFTER (CORRECTED)
              </span>
            </div>
            <div className="bg-[#12171f]/80 rounded-lg p-3 border border-emerald-500/30 font-mono text-xs sm:text-sm text-emerald-300 whitespace-pre overflow-x-auto shadow-inner">
              {suggestedFix.after || 'user?.email'}
            </div>
          </div>
        </div>
      ) : (
        /* Full Block View */
        <div className="p-4 bg-[#090b0e]">
          <div className="mb-2 text-[11px] font-mono text-slate-400">
            Replacement function / component block:
          </div>
          <pre className="bg-[#12171f] rounded-lg p-4 border border-[#1e2633] font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
            <code>{suggestedFix.fullCode}</code>
          </pre>
        </div>
      )}

      {/* Fix Footnote / Disclaimer */}
      <div className="px-4 py-2.5 bg-[#12171f] border-t border-[#1e2633] flex items-center justify-between text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          {suggestedFix.notes || 'Review against existing business logic before applying.'}
        </span>
        <span className="hidden sm:inline-block text-[10px] text-slate-600">
          Suggested Fix • Verify In Context
        </span>
      </div>
    </div>
  );
};
