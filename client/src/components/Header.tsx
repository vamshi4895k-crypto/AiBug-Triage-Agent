import React from 'react';
import { ShieldCheck, Cpu, RotateCcw } from 'lucide-react';
import { SystemStatus } from '../types/triage';

interface HeaderProps {
  systemStatus: SystemStatus | null;
  isAnalyzing: boolean;
  onClearSession: () => void;
  hasDiagnosis: boolean;
  onBackToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  systemStatus,
  isAnalyzing,
  onClearSession,
  hasDiagnosis,
  onBackToLanding,
}) => {
  return (
    <header className="w-full bg-[#0d1117]/90 backdrop-blur-md border-b border-[#1e2633] sticky top-0 z-40 px-4 lg:px-8 py-3.5 select-none transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand / Console Identity */}
        <div 
          className={`flex items-center gap-3.5 ${onBackToLanding ? 'cursor-pointer group' : ''}`}
          onClick={onBackToLanding}
          title={onBackToLanding ? 'Return to Landing Page' : undefined}
        >
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#00f0ff]/40 bg-[#161b22] shadow-[0_0_15px_rgba(0,240,255,0.15)] group-hover:scale-105 transition-transform">
              <img
                src="/developer_avatar.jpg"
                alt="AI Bug Triage Agent Mascot"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0d1117]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
                AI BUG TRIAGE AGENT
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e2633] text-[#00f0ff] border border-[#2d3748]">
                v1.0-PROD
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span>Meet <strong className="text-slate-200 font-semibold">Leo</strong> • Autonomous Bug Triage &amp; Root Cause Diagnostic System</span>
            </div>
          </div>
        </div>

        {/* Center/Right: Status Telemetry & Actions */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4">
          {/* Agent Status Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#12171f] border border-[#1e2633] text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${
              isAnalyzing 
                ? 'bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]' 
                : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
            }`} />
            <span className="text-slate-300 font-semibold tracking-wide">
              {isAnalyzing ? 'INVESTIGATING...' : 'AGENT READY'}
            </span>
          </div>

          {/* Model Status */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#12171f] border border-[#1e2633] text-xs font-mono text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>MODEL ONLINE</span>
            <span className="text-[10px] text-slate-500 font-normal">
              [{systemStatus?.model || 'gemini-2.0-flash'}]
            </span>
          </div>

          {/* Engine Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#12171f] border border-[#1e2633] text-xs font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>ANALYSIS ENGINE READY</span>
          </div>

          {/* Activity / Reset Button */}
          {hasDiagnosis && (
            <button
              onClick={onClearSession}
              title="Clear active session (Esc)"
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-slate-400 hover:text-slate-200 bg-[#161b22] hover:bg-[#1e2633] border border-[#30363d] rounded-lg transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Session</span>
              <kbd className="hidden sm:inline-block text-[10px] px-1 bg-[#0d1117] text-slate-500 rounded border border-[#30363d]">
                Esc
              </kbd>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
