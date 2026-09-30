import React from 'react';
import { Target } from 'lucide-react';

interface RootCauseProps {
  likelyCause: string;
}

export const RootCause: React.FC<RootCauseProps> = ({ likelyCause }) => {
  // Helper to format inline backtick code snippets
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const token = part.slice(1, -1);
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-[#161b22] text-[#00f0ff] border border-[#30363d] font-mono text-xs font-semibold shadow-inner"
          >
            {token}
          </code>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="rounded-xl bg-[#0d1117] border border-[#1e2633] p-5 sm:p-6 shadow-xl relative overflow-hidden group hover:border-[#2d3748] transition-all">
      {/* Decorative indicator accent */}
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#00f0ff] to-cyan-700" />

      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-6 h-6 rounded bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#00f0ff]">
          <Target className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
          Likely Cause
        </h3>
      </div>

      <div className="text-sm sm:text-[15px] font-sans text-slate-200 leading-relaxed pl-1">
        {renderFormattedText(likelyCause)}
      </div>
    </div>
  );
};
