import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Sparkles, Terminal, Cpu } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete?: () => void;
  errorSnippetPreview?: string;
}

interface StepItem {
  id: number;
  label: string;
  detail: string;
  leoThought: string;
}

const INVESTIGATION_STEPS: StepItem[] = [
  { 
    id: 0, 
    label: 'Reading error message & runtime signature', 
    detail: 'Parsing raw exception token and syntax markers',
    leoThought: 'Scanning the exception headers and environment metadata...'
  },
  { 
    id: 1, 
    label: 'Identifying error type & classification', 
    detail: 'Mapping to language fault hierarchy and taxonomy',
    leoThought: 'Classifying the error pattern against known crash profiles...'
  },
  { 
    id: 2, 
    label: 'Inspecting stack trace & source frames', 
    detail: 'Resolving file locations, line indices, and caller chains',
    leoThought: 'Following the call stack down to the origin file and line...'
  },
  { 
    id: 3, 
    label: 'Finding probable root cause', 
    detail: 'Evaluating variable states, unhandled promises, and invariants',
    leoThought: 'Found the suspicious branch condition! Isolating why it broke...'
  },
  { 
    id: 4, 
    label: 'Preparing debugging steps & suggested fix', 
    detail: 'Generating verified step-by-step remediation path',
    leoThought: 'Synthesizing the clean before/after fix and verification steps...'
  },
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ errorSnippetPreview }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const intervals = [350, 450, 500, 500, 400];
    let currentIndex = 0;

    const advanceStep = () => {
      if (currentIndex < INVESTIGATION_STEPS.length - 1) {
        currentIndex += 1;
        setActiveStep(currentIndex);
        timer = setTimeout(advanceStep, intervals[currentIndex] || 400);
      }
    };

    let timer = setTimeout(advanceStep, intervals[0]);
    return () => clearTimeout(timer);
  }, []);

  const currentStepData = INVESTIGATION_STEPS[activeStep];

  return (
    <div className="w-full max-w-3xl mx-auto my-6 p-6 sm:p-8 rounded-2xl bg-[#0d1117] border border-[#1e2633] shadow-2xl relative overflow-hidden">
      {/* Laser Scanning Effect */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent animate-laser shadow-[0_0_12px_#00f0ff]" />

      {/* Header with Leo Mascot Avatar */}
      <div className="flex items-center justify-between pb-5 border-b border-[#1e2633]">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#00f0ff] bg-[#161b22] shadow-[0_0_20px_rgba(0,240,255,0.25)]">
              <img
                src="/developer_avatar.jpg"
                alt="Leo Investigating"
                className="w-full h-full object-cover animate-pulse"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
            </span>
          </div>

          <div>
            <div className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>LEO IS INVESTIGATING...</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20">
                AI SCANNING
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>Analyzing stack frame tokens &amp; call trees</span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400 bg-[#12171f] px-3 py-1.5 rounded-lg border border-[#1e2633]">
          <Cpu className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Stage {activeStep + 1}/{INVESTIGATION_STEPS.length}</span>
        </div>
      </div>

      {/* Leo Live Thought Balloon */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="my-4 p-3 rounded-xl bg-[#121824] border border-[#1e2d42] flex items-center gap-2.5 text-xs font-mono text-slate-300 shadow-inner"
      >
        <Sparkles className="w-4 h-4 text-[#00f0ff] shrink-0 animate-spin" />
        <div>
          <span className="text-[#00f0ff] font-bold">Leo's Thought: </span>
          <span>{currentStepData.leoThought}</span>
        </div>
      </motion.div>

      {/* Progressive Step Sequence */}
      <div className="py-3 space-y-3">
        {INVESTIGATION_STEPS.map((step) => {
          const isDone = activeStep > step.id;
          const isCurrent = activeStep === step.id;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3.5 p-3 rounded-xl font-mono text-xs transition-all ${
                isCurrent
                  ? 'bg-[#12171f] border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.06)]'
                  : isDone
                  ? 'bg-[#0a0d12] border border-[#1e2633]/50 text-slate-400'
                  : 'text-slate-600 border border-transparent'
              }`}
            >
              {/* Step Status Icon */}
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] text-slate-600">
                    ○
                  </div>
                )}
              </div>

              {/* Step Label & Detail */}
              <div className="flex-1 min-w-0">
                <div className={`font-semibold flex items-center gap-2 ${
                  isCurrent ? 'text-[#00f0ff]' : isDone ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  <span>{step.label}</span>
                </div>
                {isCurrent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[11px] text-slate-400 mt-1 font-mono tracking-tight"
                  >
                    ↳ {step.detail}...
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Target Preview Snippet */}
      {errorSnippetPreview && (
        <div className="pt-4 border-t border-[#1e2633] flex items-center gap-2 text-xs font-mono text-slate-500">
          <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">Target: {errorSnippetPreview.slice(0, 75)}...</span>
        </div>
      )}
    </div>
  );
};
