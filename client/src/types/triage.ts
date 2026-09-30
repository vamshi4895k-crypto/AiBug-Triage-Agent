export interface TriageRequest {
  errorText: string;
  stackTrace?: string;
  codeSnippet?: string;
  logs?: string;
  screenshotDescription?: string;
  screenshotPreviewUrl?: string;
}

export interface CodeSnippet {
  fileName: string;
  startLine: number;
  highlightLine: number;
  code: string;
  annotation: string;
}

export interface SuggestedFix {
  before: string;
  after: string;
  fullCode: string;
  notes?: string;
}

export interface DebugStep {
  step: number;
  title: string;
  description: string;
  command?: string;
}

export interface TriageDiagnosis {
  errorType: string;
  summary: string;
  likelyCause: string;
  location: string;
  language: string;
  confidence: number;
  confidenceReason: string;
  codeSnippet: CodeSnippet;
  suggestedFix: SuggestedFix;
  debuggingSteps: DebugStep[];
  whyItHappened: string;
}

export interface TriageResult {
  diagnosis: TriageDiagnosis;
  provider: string;
  model: string;
  executionTimeMs: number;
}

export type AnalysisStage =
  | 'idle'
  | 'reading_error'
  | 'identifying_type'
  | 'inspecting_stack'
  | 'finding_cause'
  | 'preparing_steps'
  | 'complete'
  | 'error';

export interface SystemStatus {
  status: string;
  agent: string;
  engineReady: boolean;
  provider: string;
  model: string;
  liveAIConfigured: boolean;
  timestamp: string;
}

export interface ExamplePreset {
  id: string;
  label: string;
  tag: string;
  errorText: string;
  stackTrace: string;
  codeSnippet: string;
  logs: string;
}
