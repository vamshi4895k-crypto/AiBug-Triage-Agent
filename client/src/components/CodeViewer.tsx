import React, { useState } from 'react';
import { FileCode2, Sparkles, Copy, Check } from 'lucide-react';
import { CodeSnippet } from '../types/triage';
import { useToast } from './Toast';

interface CodeViewerProps {
  codeSnippet: CodeSnippet;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ codeSnippet }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet.code);
    setCopied(true);
    showToast('success', 'Code copied', 'Snippet copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const rawLines = codeSnippet.code.split('\n');

  return (
    <div className="rounded-xl bg-[#0d1117] border border-[#1e2633] overflow-hidden shadow-2xl group hover:border-[#2d3748] transition-all">
      {/* IDE Topbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#12171f] border-b border-[#1e2633] select-none">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-xs font-mono font-medium text-slate-200">
            {codeSnippet.fileName || 'source_inspection.ts'}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1e2633] text-slate-400 border border-[#2d3748]">
            Line {codeSnippet.highlightLine || 'Target'}
          </span>
        </div>

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 bg-[#161b22] hover:bg-[#1e2633] px-2.5 py-1 rounded border border-[#30363d] transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display Area */}
      <div className="p-4 bg-[#090b0e] overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-slate-300">
        <div className="min-w-[480px]">
          {rawLines.map((line, idx) => {
            // Check if line contains line numbers or if highlightLine matches
            const isHighlight =
              line.includes(` ${codeSnippet.highlightLine} `) ||
              line.startsWith(`${codeSnippet.highlightLine} `) ||
              line.includes('POSSIBLE ISSUE') ||
              idx === Math.max(0, rawLines.length - 2);

            return (
              <div
                key={idx}
                className={`flex items-stretch py-0.5 rounded px-2 -mx-2 transition-colors ${
                  isHighlight
                    ? 'bg-rose-500/10 border-l-2 border-rose-500 text-rose-200'
                    : 'hover:bg-[#12171f]'
                }`}
              >
                <div className="w-8 shrink-0 text-slate-600 select-none text-right pr-3 font-mono text-xs">
                  {codeSnippet.startLine ? codeSnippet.startLine + idx : idx + 1}
                </div>
                <div className="flex-1 whitespace-pre font-mono">
                  {line}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insight Callout Banner */}
      {codeSnippet.annotation && (
        <div className="px-4 py-3 bg-[#12171f] border-t border-[#1e2633] flex items-start gap-3">
          <div className="w-6 h-6 rounded bg-[#161b22] border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00f0ff] flex items-center gap-1.5">
              <span>AI INSIGHT</span>
            </div>
            <div className="text-xs font-mono text-slate-300 mt-0.5 leading-relaxed">
              {codeSnippet.annotation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
