import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bug, 
  MapPin, 
  Code2, 
  Sparkles, 
  RotateCcw, 
  Share2, 
  Layers, 
  ArrowLeft,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { TriageResult } from '../types/triage';
import { RootCause } from './RootCause';
import { DebugTimeline } from './DebugTimeline';
import { CodeViewer } from './CodeViewer';
import { FixComparison } from './FixComparison';
import { ConfidenceMeter } from './ConfidenceMeter';
import { WhyItHappened } from './WhyItHappened';
import { useToast } from './Toast';

interface DiagnosisProps {
  result: TriageResult;
  onAnalyzeAnother: () => void;
  onClearSession: () => void;
}

export const Diagnosis: React.FC<DiagnosisProps> = ({
  result,
  onAnalyzeAnother,
  onClearSession,
}) => {
  const { showToast } = useToast();
  const { diagnosis, provider, model, executionTimeMs } = result;

  const handleCopyMarkdownReport = () => {
    const report = `# [Bug Triage Report] ${diagnosis.errorType}
**Summary:** ${diagnosis.summary}
**Location:** \`${diagnosis.location}\`
**Language:** ${diagnosis.language}
**Confidence:** ${diagnosis.confidence}%
**Model / Engine:** ${provider} (${model})

## Likely Root Cause
${diagnosis.likelyCause}

## Debugging Path
${diagnosis.debuggingSteps.map((s) => `${s.step}. **${s.title}**: ${s.description} ${s.command ? `\n   \`${s.command}\`` : ''}`).join('\n')}

## Suggested Fix
\`\`\`
${diagnosis.suggestedFix.fullCode || diagnosis.suggestedFix.after}
\`\`\`

## Why It Happened
${diagnosis.whyItHappened}
`;
    navigator.clipboard.writeText(report);
    showToast('success', 'Report copied to clipboard', 'Full Markdown triage diagnosis exported');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-16"
    >
      {/* Top Banner: Error Detection & Telemetry */}
      <div className="rounded-2xl bg-[#0d1117] border border-[#1e2633] p-5 sm:p-6 lg:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
          {/* Left: Error Badge & Type */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#161b22] border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
              <Bug className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  ERROR DETECTED
                </span>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {executionTimeMs}ms triage latency
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-mono font-bold text-slate-100 tracking-tight">
                {diagnosis.errorType}
              </h2>
              <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1 leading-relaxed">
                {diagnosis.summary}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopyMarkdownReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#161b22] hover:bg-[#1e2633] border border-[#30363d] text-xs font-mono text-slate-300 hover:text-[#00f0ff] transition-all"
              title="Export Markdown Triage Report"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            <button
              onClick={onAnalyzeAnother}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#38f8ff] text-[#080a0d] font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Analyze Another Error</span>
            </button>
          </div>
        </div>

        {/* Leo's Assessment Card */}
        <div className="mt-5 p-4 rounded-xl bg-[#121824] border border-[#222e42] flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-emerald-400/50 shadow-md">
            <img src="/developer_avatar.jpg" alt="Leo" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-xs font-mono">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-[#00f0ff]">Leo's Triage Verdict:</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                <CheckCircle2 className="w-3 h-3" /> Solvable Fix Ready
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              "I isolated the faulty line at <code className="text-amber-300 bg-amber-400/10 px-1 py-0.5 rounded">{diagnosis.location}</code>. Check the step-by-step resolution plan and verified code diff below!"
            </p>
          </div>
        </div>

        {/* Metadata Badges Bar */}
        <div className="mt-5 pt-4 border-t border-[#1e2633] flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12171f] border border-[#1e2633] text-slate-300">
            <Code2 className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="text-slate-500">Language:</span>
            <span className="font-semibold text-slate-200">{diagnosis.language}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12171f] border border-[#1e2633] text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-slate-500">Location:</span>
            <span className="font-semibold text-slate-200">{diagnosis.location}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12171f] border border-[#1e2633] text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-500">Confidence:</span>
            <span className="font-semibold text-emerald-400">{diagnosis.confidence}%</span>
          </div>

          <div className="ml-auto hidden md:flex items-center gap-1.5 text-[11px] text-slate-500">
            <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Diagnosed by: {provider} [{model}]</span>
          </div>
        </div>
      </div>

      {/* Grid: Likely Cause & Confidence Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RootCause likelyCause={diagnosis.likelyCause} />
        </div>
        <div className="lg:col-span-1">
          <ConfidenceMeter
            confidence={diagnosis.confidence}
            confidenceReason={diagnosis.confidenceReason}
          />
        </div>
      </div>

      {/* Primary Section: Interactive Debugging Timeline */}
      <div>
        <DebugTimeline steps={diagnosis.debuggingSteps} />
      </div>

      {/* Code Viewer (IDE Style) */}
      {diagnosis.codeSnippet && diagnosis.codeSnippet.code && (
        <div>
          <CodeViewer codeSnippet={diagnosis.codeSnippet} />
        </div>
      )}

      {/* Suggested Fix (Before vs After Diff) */}
      {diagnosis.suggestedFix && (
        <div>
          <FixComparison suggestedFix={diagnosis.suggestedFix} />
        </div>
      )}

      {/* Why This Happened (Expandable Deep Dive) */}
      {diagnosis.whyItHappened && (
        <div>
          <WhyItHappened explanation={diagnosis.whyItHappened} />
        </div>
      )}

      {/* Bottom Try Again & Clear Session Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0d1117] border border-[#1e2633]">
        <div className="text-xs font-mono text-slate-400">
          Triage session active • All findings saved in local session
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClearSession}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Session</span>
          </button>

          <button
            onClick={onAnalyzeAnother}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00f0ff] hover:bg-[#38f8ff] text-[#080a0d] font-mono text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Analyze Another Error</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
