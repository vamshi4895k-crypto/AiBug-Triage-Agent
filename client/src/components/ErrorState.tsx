import React from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
  onReset: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, onRetry, onReset }) => {
  return (
    <div className="w-full max-w-xl mx-auto my-8 p-6 sm:p-8 rounded-xl bg-[#0d1117] border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)] text-center">
      <div className="w-12 h-12 rounded-xl bg-[#161b22] border border-rose-500/50 text-rose-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-1">
        ANALYSIS INTERRUPTED
      </div>

      <h3 className="text-lg font-mono font-bold text-slate-100 mb-2">
        Diagnosis Could Not Complete
      </h3>

      <p className="text-xs sm:text-sm font-mono text-slate-400 mb-6 leading-relaxed max-w-md mx-auto">
        {errorMessage || 'The AI triage engine encountered an unexpected network disruption or parsing issue. Check your connection or verify input format.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center gap-2 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Analysis</span>
        </button>

        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-[#161b22] hover:bg-[#1e2633] text-slate-300 font-mono text-xs border border-[#30363d] transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Input</span>
        </button>
      </div>
    </div>
  );
};
