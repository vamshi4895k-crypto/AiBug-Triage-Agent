import React, { useState, useRef, useCallback } from 'react';
import { 
  Terminal, 
  Code, 
  FileText, 
  Image as ImageIcon, 
  UploadCloud, 
  ArrowRight, 
  Sparkles, 
  X, 
  Check, 
  Trash2
} from 'lucide-react';
import { TriageRequest, ExamplePreset } from '../types/triage';
import { useToast } from './Toast';

export const EXAMPLE_PRESETS: ExamplePreset[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    tag: 'TypeError',
    errorText: `TypeError: Cannot read properties of undefined (reading 'email')
    at loginUser (auth.js:42:21)
    at processLogin (app.js:18:9)
    at HTMLButtonElement.dispatch (jquery.js:5429:27)`,
    stackTrace: `auth.js:42:21 - TypeError: Cannot read properties of undefined (reading 'email')
app.js:18:9 - processLogin()
index.js:5:1 - run()`,
    codeSnippet: `// auth.js
async function loginUser(credentials) {
  const response = await api.post('/auth/session', credentials);
  const user = response.data;

  // Accessing email before verifying payload
  console.log(user.email);
  return user;
}`,
    logs: `[10:42:01] POST /auth/session 200 OK
[10:42:01] Warning: Response payload missing data object
[10:42:02] Uncaught TypeError: Cannot read properties of undefined (reading 'email')`
  },
  {
    id: 'python',
    label: 'Python',
    tag: 'KeyError',
    errorText: `Traceback (most recent call last):
  File "billing.py", line 87, in process_payment
    account_id = user_info["user_id"]
KeyError: 'user_id'`,
    stackTrace: `File "server.py", line 45, in handle_checkout
  process_payment(payload)
File "billing.py", line 87, in process_payment
  account_id = user_info["user_id"]`,
    codeSnippet: `# billing.py
def process_payment(payload: dict):
    validated = validate_request(payload)
    user_info = validated["user"]

    account_id = user_info["user_id"]
    return charge_account(account_id)`,
    logs: `INFO:root:Incoming payment request id=req_9921
DEBUG:root:Validated schema keys: ['user', 'amount', 'currency']
DEBUG:root:user keys present: ['id', 'username', 'email']
ERROR:root:Exception during transaction: KeyError 'user_id'`
  },
  {
    id: 'api',
    label: 'API Backend',
    tag: 'HTTP 500',
    errorText: `HTTP 500 Internal Server Error
Response body: {"error": "DB connection pool exhausted", "status": 500, "code": "POOL_TIMEOUT"}`,
    stackTrace: `gateway.go:124: dbPool.Acquire() timeout after 5000ms
gateway.go:89: handleStreamRequest()
router.go:34: ServeHTTP()`,
    codeSnippet: `// gateway.go
func handleStreamRequest(w http.ResponseWriter, r *http.Request) {
    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()

    conn, err := dbPool.Acquire(ctx)
    if err != nil {
        log.Printf("acquire error: %v", err)
    }
    defer conn.Release() // PANIC if conn is nil

    return conn.QueryRow(ctx, "SELECT ...")
}`,
    logs: `[2026-09-26 11:42:15] WARN Active DB connections: 50/50 (100% capacity)
[2026-09-26 11:42:19] ERROR Context deadline exceeded while acquiring DB connection
[2026-09-26 11:42:19] CRITICAL panic: runtime error: invalid memory address or nil pointer dereference`
  }
];

interface ErrorInputProps {
  onAnalyze: (request: TriageRequest) => void;
  isAnalyzing: boolean;
  initialPresetId?: string;
}

export const ErrorInput: React.FC<ErrorInputProps> = ({ onAnalyze, isAnalyzing, initialPresetId }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [errorText, setErrorText] = useState('');
  const [showStackTrace, setShowStackTrace] = useState(false);
  const [stackTrace, setStackTrace] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Quick preset loader
  const handleLoadPreset = (preset: ExamplePreset) => {
    setErrorText(preset.errorText);
    setStackTrace(preset.stackTrace);
    setShowStackTrace(true);
    setCodeSnippet(preset.codeSnippet);
    setShowCode(true);
    setLogs(preset.logs);
    setShowLogs(true);
    setScreenshotPreview(null);
    showToast('info', `Loaded ${preset.label} sample`, preset.tag);
  };

  React.useEffect(() => {
    if (initialPresetId) {
      const match = EXAMPLE_PRESETS.find(p => p.id === initialPresetId);
      if (match) {
        handleLoadPreset(match);
      }
    }
  }, [initialPresetId]);

  const handleClearAll = () => {
    setErrorText('');
    setStackTrace('');
    setShowStackTrace(false);
    setCodeSnippet('');
    setShowCode(false);
    setLogs('');
    setShowLogs(false);
    setScreenshotPreview(null);
  };

  // Drag & Drop File Handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const processFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotPreview(reader.result as string);
        showToast('success', 'Screenshot attached', file.name);
      };
      reader.readAsDataURL(file);
      return;
    }

    // Text / log / code file
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      if (!errorText.trim()) {
        setErrorText(content);
      } else if (!logs.trim()) {
        setLogs(content);
        setShowLogs(true);
      } else {
        setCodeSnippet(content);
        setShowCode(true);
      }
      showToast('success', 'File imported', `${file.name} (${Math.round(file.size / 1024)} KB)`);
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Submit Form
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!errorText.trim()) {
      showToast('error', 'Empty Input', 'Please paste an error message, stack trace, or drop a log file.');
      return;
    }

    onAnalyze({
      errorText: errorText.trim(),
      stackTrace: showStackTrace && stackTrace.trim() ? stackTrace.trim() : undefined,
      codeSnippet: showCode && codeSnippet.trim() ? codeSnippet.trim() : undefined,
      logs: showLogs && logs.trim() ? logs.trim() : undefined,
      screenshotPreviewUrl: screenshotPreview || undefined,
      screenshotDescription: screenshotPreview ? 'Screenshot attached illustrating client runtime error' : undefined
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">
      {/* Preset Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
            Try an Example:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {EXAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className="px-2.5 py-1 rounded bg-[#12171f] hover:bg-[#1c2430] border border-[#1e2633] hover:border-[#30363d] text-xs font-mono text-slate-300 hover:text-[#00f0ff] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>{preset.label}</span>
                <span className="text-[10px] text-slate-500 px-1 py-0.2 rounded bg-[#0d1117] border border-[#1e2633]">
                  {preset.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {errorText && (
          <button
            onClick={handleClearAll}
            className="text-xs font-mono text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Main Error Drop Zone Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl bg-[#0d1117] border transition-all duration-200 overflow-hidden shadow-2xl ${
          isDragging
            ? 'border-[#00f0ff] bg-[#00f0ff]/5 shadow-[0_0_25px_rgba(0,240,255,0.15)] ring-2 ring-[#00f0ff]/30'
            : 'border-[#1e2633] hover:border-[#2d3748]'
        }`}
      >
        {/* Terminal Window Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#12171f] border-b border-[#1e2633] select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono text-slate-400 ml-2">
              ERROR_DROP_ZONE.log
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline-block">
              UTF-8 • AUTO-DETECT
            </span>
          </div>
        </div>

        {/* Primary Input Textarea */}
        <div className="p-4 sm:p-5">
          <textarea
            value={errorText}
            onChange={(e) => setErrorText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={5}
            placeholder={`Paste your error, stack trace, logs or code here...\n\nTypeError: Cannot read properties of undefined\n    at loginUser (auth.js:42)\n    at processLogin (app.js:18)`}
            className="w-full bg-transparent font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-y min-h-[130px] leading-relaxed selection:bg-[#00f0ff]/20"
          />

          {/* Screenshot Preview if uploaded */}
          {screenshotPreview && (
            <div className="mt-3 p-3 rounded-lg bg-[#12171f] border border-[#1e2633] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={screenshotPreview}
                  alt="Error Screenshot"
                  className="w-16 h-12 object-cover rounded border border-[#2d3748]"
                />
                <div>
                  <div className="text-xs font-mono font-medium text-slate-300">
                    Screenshot Attached
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Visual diagnostic context enabled
                  </div>
                </div>
              </div>
              <button
                onClick={() => setScreenshotPreview(null)}
                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-[#1c2430] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Collapsible Sections (Stack Trace, Code, Logs) */}
          {showStackTrace && (
            <div className="mt-4 pt-4 border-t border-[#1e2633]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Stack Trace:
                </span>
                <button
                  onClick={() => {
                    setShowStackTrace(false);
                    setStackTrace('');
                  }}
                  className="text-[11px] font-mono text-slate-500 hover:text-rose-400"
                >
                  Remove
                </button>
              </div>
              <textarea
                value={stackTrace}
                onChange={(e) => setStackTrace(e.target.value)}
                rows={3}
                placeholder="Paste full call stack or traceback..."
                className="w-full bg-[#12171f] border border-[#1e2633] rounded p-3 font-mono text-xs text-slate-300 focus:outline-none focus:border-[#00f0ff]/50 leading-relaxed"
              />
            </div>
          )}

          {showCode && (
            <div className="mt-4 pt-4 border-t border-[#1e2633]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  Code Context:
                </span>
                <button
                  onClick={() => {
                    setShowCode(false);
                    setCodeSnippet('');
                  }}
                  className="text-[11px] font-mono text-slate-500 hover:text-rose-400"
                >
                  Remove
                </button>
              </div>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={4}
                placeholder="// Paste surrounding function or component source code..."
                className="w-full bg-[#12171f] border border-[#1e2633] rounded p-3 font-mono text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 leading-relaxed"
              />
            </div>
          )}

          {showLogs && (
            <div className="mt-4 pt-4 border-t border-[#1e2633]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Application Logs:
                </span>
                <button
                  onClick={() => {
                    setShowLogs(false);
                    setLogs('');
                  }}
                  className="text-[11px] font-mono text-slate-500 hover:text-rose-400"
                >
                  Remove
                </button>
              </div>
              <textarea
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
                rows={3}
                placeholder="[timestamp] level: debug logs, telemetry..."
                className="w-full bg-[#12171f] border border-[#1e2633] rounded p-3 font-mono text-xs text-slate-300 focus:outline-none focus:border-amber-500/50 leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Action Toolbar & Input Chips */}
        <div className="px-4 py-3 bg-[#12171f]/80 border-t border-[#1e2633] flex flex-wrap items-center justify-between gap-3">
          {/* Quick Input Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowStackTrace(!showStackTrace)}
              className={`px-2.5 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                showStackTrace
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40'
                  : 'bg-[#161b22] text-slate-400 hover:text-slate-200 border border-[#30363d]'
              }`}
            >
              {showStackTrace ? <Check className="w-3.5 h-3.5" /> : <span>+</span>}
              <span>Stack Trace</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className={`px-2.5 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                showCode
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                  : 'bg-[#161b22] text-slate-400 hover:text-slate-200 border border-[#30363d]'
              }`}
            >
              {showCode ? <Check className="w-3.5 h-3.5" /> : <span>+</span>}
              <span>Code Snippet</span>
            </button>

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className={`px-2.5 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                screenshotPreview
                  ? 'bg-violet-500/15 text-violet-400 border border-violet-500/40'
                  : 'bg-[#161b22] text-slate-400 hover:text-slate-200 border border-[#30363d]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{screenshotPreview ? 'Screenshot Added' : '+ Screenshot'}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded text-xs font-mono bg-[#161b22] hover:bg-[#1f2633] text-slate-400 hover:text-slate-200 border border-[#30363d] transition-all flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>+ Log / File</span>
            </button>

            {/* Hidden native file inputs */}
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".log,.txt,.js,.ts,.tsx,.py,.go,.rs,.json,.html"
              className="hidden"
            />
          </div>

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isAnalyzing || !errorText.trim()}
            className={`px-5 py-2 rounded-lg font-mono text-xs font-semibold tracking-wide transition-all flex items-center gap-2 shadow-lg ${
              isAnalyzing || !errorText.trim()
                ? 'bg-[#1e2633] text-slate-500 cursor-not-allowed border border-[#30363d]'
                : 'bg-[#00f0ff] hover:bg-[#38f8ff] text-[#080a0d] shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] active:scale-95'
            }`}
          >
            <span>{isAnalyzing ? 'Investigating...' : 'Analyze Error'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block text-[10px] opacity-70 border-l border-black/20 pl-1.5 ml-1">
              Ctrl+↵
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
