import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { EmptyState } from '../components/EmptyState';
import { ErrorInput } from '../components/ErrorInput';
import { AnalysisProgress } from '../components/AnalysisProgress';
import { Diagnosis } from '../components/Diagnosis';
import { ErrorState } from '../components/ErrorState';
import { submitBugTriage, fetchSystemStatus } from '../services/api';
import { TriageRequest, TriageResult, SystemStatus } from '../types/triage';
import { TriageBuddyCompanion } from '../components/TriageBuddyCompanion';
import { useToast } from '../components/Toast';

interface DebugLabProps {
  onBackToLanding?: () => void;
  initialPresetId?: string;
}

export const DebugLab: React.FC<DebugLabProps> = ({ onBackToLanding, initialPresetId }) => {
  const { showToast } = useToast();

  // App State
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<TriageRequest | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<TriageResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch initial telemetry
  useEffect(() => {
    fetchSystemStatus().then((status) => {
      setSystemStatus(status);
    });
  }, []);

  // Handle Analysis Trigger
  const handleAnalyze = async (request: TriageRequest) => {
    setIsAnalyzing(true);
    setCurrentRequest(request);
    setErrorMessage(null);
    setDiagnosisResult(null);

    try {
      // Call backend API
      const result = await submitBugTriage(request);

      // Ensure minimum investigation animation time so user sees the high-tech scanner
      setTimeout(() => {
        setDiagnosisResult(result);
        setIsAnalyzing(false);
        showToast('success', 'Diagnosis Complete', `${result.diagnosis.errorType} analyzed successfully`);
      }, 1200);
    } catch (err: any) {
      setTimeout(() => {
        setIsAnalyzing(false);
        setErrorMessage(err?.message || 'Failed to communicate with the triage engine.');
        showToast('error', 'Analysis Interrupted', err?.message || 'Network timeout or engine fault.');
      }, 800);
    }
  };

  const handleRetry = () => {
    if (currentRequest) {
      handleAnalyze(currentRequest);
    }
  };

  const handleAnalyzeAnother = () => {
    setDiagnosisResult(null);
    setErrorMessage(null);
    setIsAnalyzing(false);
  };

  const handleClearSession = () => {
    setDiagnosisResult(null);
    setErrorMessage(null);
    setIsAnalyzing(false);
    setCurrentRequest(null);
    showToast('info', 'Session Cleared', 'Ready for a new error triage');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080a0d] text-slate-200 scanlines">
      {/* Top Console Navigation */}
      <Header
        systemStatus={systemStatus}
        isAnalyzing={isAnalyzing}
        onClearSession={handleClearSession}
        hasDiagnosis={Boolean(diagnosisResult)}
        onBackToLanding={onBackToLanding}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {/* 1. Analyzing Stage */}
          {isAnalyzing && (
            <motion.div
              key="investigating"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="my-auto py-8"
            >
              <AnalysisProgress errorSnippetPreview={currentRequest?.errorText} />
            </motion.div>
          )}

          {/* 2. Error / Interrupted Stage */}
          {!isAnalyzing && errorMessage && (
            <motion.div
              key="error-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorState
                errorMessage={errorMessage}
                onRetry={handleRetry}
                onReset={handleAnalyzeAnother}
              />
            </motion.div>
          )}

          {/* 3. Diagnosis Stage */}
          {!isAnalyzing && diagnosisResult && (
            <motion.div
              key="diagnosis-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Diagnosis
                result={diagnosisResult}
                onAnalyzeAnother={handleAnalyzeAnother}
                onClearSession={handleClearSession}
              />
            </motion.div>
          )}

          {/* 4. Default / Input Stage */}
          {!isAnalyzing && !diagnosisResult && !errorMessage && (
            <motion.div
              key="dropzone-input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Empty State Flow Graphic */}
              <EmptyState />

              {/* Main Central Error Drop Zone */}
              <ErrorInput 
                onAnalyze={handleAnalyze} 
                isAnalyzing={isAnalyzing} 
                initialPresetId={initialPresetId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Interactive 3D Developer Companion Floating Trigger */}
      <TriageBuddyCompanion />

      {/* Footer Technical Bar */}
      <footer className="border-t border-[#1e2633] bg-[#0d1117]/80 px-4 py-3 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>AI BUG TRIAGE AGENT • PROD v1.0</span>
          <span className="hidden sm:inline-block">Shortcuts: [Ctrl + Enter] Analyze • [Esc] Clear</span>
          <span className="text-[#00f0ff]">STATUS: READY</span>
        </div>
      </footer>
    </div>
  );
};
