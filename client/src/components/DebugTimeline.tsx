import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  Terminal, 
  Copy, 
  Check, 
  Compass, 
  ListChecks 
} from 'lucide-react';
import { DebugStep } from '../types/triage';
import { useToast } from './Toast';

interface DebugTimelineProps {
  steps: DebugStep[];
}

export const DebugTimeline: React.FC<DebugTimelineProps> = ({ steps }) => {
  const { showToast } = useToast();
  // Expanded step IDs (open by default first 2 steps)
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1, 2]);
  // Completed step checklist tracking
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  // Copied command tracker
  const [copiedCommandStep, setCopiedCommandStep] = useState<number | null>(null);

  const toggleExpand = (stepNumber: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const toggleComplete = (stepNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSteps((prev) => {
      const isDone = prev.includes(stepNumber);
      const updated = isDone ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber];
      if (!isDone) {
        showToast('success', `Step 0${stepNumber} marked complete`, 'Debugging progress updated');
      }
      return updated;
    });
  };

  const handleCopyCommand = (command: string, stepNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(command);
    setCopiedCommandStep(stepNumber);
    showToast('info', 'Command copied', command);
    setTimeout(() => setCopiedCommandStep(null), 2000);
  };

  const progressPercent = Math.round(
    steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0
  );

  return (
    <div className="rounded-xl bg-[#0d1117] border border-[#1e2633] p-5 sm:p-6 shadow-2xl relative overflow-hidden group hover:border-[#2d3748] transition-all">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#1e2633]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#161b22] border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase">
                Interactive Debugging Timeline
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1e2633] text-[#00f0ff] border border-[#2d3748]">
                {steps.length} STEPS
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
              Follow chronological investigation path • Click to expand details
            </p>
          </div>
        </div>

        {/* Completion Progress Badge */}
        <div className="flex items-center gap-2 bg-[#12171f] px-3 py-1.5 rounded-lg border border-[#1e2633]">
          <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-mono text-slate-300">
            {completedSteps.length}/{steps.length} Complete
          </span>
          <div className="w-12 bg-[#1c2430] h-1.5 rounded-full overflow-hidden ml-1">
            <div
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-6">
        {/* Continuous Connecting Line */}
        <div className="absolute top-3 bottom-3 left-[15px] sm:left-[19px] w-[2px] bg-gradient-to-b from-[#00f0ff]/60 via-[#1e2633] to-emerald-500/60" />

        {steps.map((step) => {
          const isExpanded = expandedSteps.includes(step.step);
          const isCompleted = completedSteps.includes(step.step);
          const stepPrefix = step.step < 10 ? `0${step.step}` : `${step.step}`;

          return (
            <div key={step.step} className="relative group/step">
              {/* Timeline Node Icon / Checkbox */}
              <button
                onClick={(e) => toggleComplete(step.step, e)}
                title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                className={`absolute -left-[27px] sm:-left-[31px] top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all z-10 ${
                  isCompleted
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_#10b981]'
                    : 'bg-[#12171f] border border-[#30363d] text-slate-500 hover:border-[#00f0ff] hover:text-[#00f0ff]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span className="text-[10px] font-mono font-bold">{stepPrefix}</span>
                )}
              </button>

              {/* Step Card Container */}
              <div
                onClick={() => toggleExpand(step.step)}
                className={`rounded-lg border transition-all cursor-pointer p-4 ${
                  isCompleted
                    ? 'bg-[#0d1117]/80 border-emerald-500/20 opacity-85'
                    : isExpanded
                    ? 'bg-[#12171f] border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.04)]'
                    : 'bg-[#0d1117] border-[#1e2633] hover:border-[#2d3748]'
                }`}
              >
                {/* Step Title Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-[#00f0ff]">
                      {stepPrefix} ──
                    </span>
                    <h4
                      className={`text-sm font-mono font-bold ${
                        isCompleted
                          ? 'text-slate-400 line-through'
                          : 'text-slate-100 group-hover/step:text-[#00f0ff] transition-colors'
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {step.command && (
                      <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161b22] text-slate-400 border border-[#30363d]">
                        CLI
                      </span>
                    )}
                    <span className="text-slate-500">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-[#1e2633]/60 space-y-3"
                    >
                      <p className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Debug Command / Terminal Code */}
                      {step.command && (
                        <div className="bg-[#090b0e] border border-[#1e2633] rounded-lg p-2.5 flex items-center justify-between gap-3 font-mono text-xs text-[#00f0ff] group/cmd">
                          <div className="flex items-center gap-2 overflow-x-auto">
                            <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <code className="whitespace-pre">{step.command}</code>
                          </div>
                          <button
                            onClick={(e) => handleCopyCommand(step.command!, step.step, e)}
                            className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-[#161b22] transition-colors shrink-0"
                            title="Copy command"
                          >
                            {copiedCommandStep === step.step ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
