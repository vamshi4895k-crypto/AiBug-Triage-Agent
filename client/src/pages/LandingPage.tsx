import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Terminal, 
  ArrowRight, 
  Bug, 
  Code2, 
  CheckCircle2, 
  Zap, 
  Coffee, 
  Cpu, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  FileText, 
  Clock, 
  Globe, 
  GitBranch, 
  Search,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onLaunchLab: (presetId?: string) => void;
}

const LEO_THOUGHTS = [
  "Take a sip of coffee ☕ and let me handle the stack traces.",
  "Found a sneaky TypeError in auth.js! Want me to patch it?",
  "Scanning 12 stack frames... Isolating the root cause...",
  "AST heuristic engine is 100% online and ready for bugs!",
  "Zero cloud lock-in. 100% private local code triage."
];

const FAQ_ITEMS = [
  {
    q: 'Do I need a paid API key to use AI Bug Triage Agent?',
    a: 'No! The application comes with a built-in Heuristic AST Diagnostic Engine that works 100% offline with zero API keys required. You can also optionally connect Google Gemini (gemini-2.0-flash) or OpenAI in your .env file for live multi-turn cloud LLM triage.'
  },
  {
    q: 'What types of errors can Leo analyze?',
    a: 'Leo handles all major runtime exceptions, unhandled promise rejections, type errors, null/nil pointer dereferences, dictionary/key lookups, database pool exhaustion, syntax errors, and backend HTTP 500 crashes across JavaScript, TypeScript, Python, Go, and more.'
  },
  {
    q: 'Is my source code stored or sent to third parties?',
    a: 'Your error snippets and source traces are strictly processed in your local browser and local Node.js server. If using the offline heuristic engine, zero data leaves your machine.'
  },
  {
    q: 'How does the Before vs After diff verification work?',
    a: 'Leo parses your code AST, isolates the faulty statement or variable dereference, constructs the safe equivalent (such as optional chaining, defensive nil checks, or fallback handlers), and formats a clean diff you can copy into your editor in 1 click.'
  },
  {
    q: 'Can I export reports for Jira or GitHub issues?',
    a: 'Yes! Every triage result includes an instant "Export Report" button that copies a structured, GitHub-flavored Markdown post-mortem with root cause analysis, error location, and remediation steps.'
  }
];

const PREVIEWS = {
  javascript: {
    title: 'JavaScript TypeError',
    error: "TypeError: Cannot read properties of undefined (reading 'email')",
    location: 'auth.js:42:21',
    cause: "Attempting to access user.email when user payload is undefined due to missing API response data.",
    fixBefore: "console.log(user.email);",
    fixAfter: "console.log(user?.email || 'N/A');",
    category: 'Frontend & Node.js'
  },
  python: {
    title: 'Python KeyError',
    error: "KeyError: 'user_id' in process_payment",
    location: 'billing.py:87',
    cause: "Direct dictionary lookup payload['user_id'] failed because incoming schema used 'id' key.",
    fixBefore: "account_id = user_info['user_id']",
    fixAfter: "account_id = user_info.get('user_id') or user_info.get('id')",
    category: 'Backend & Data Pipelines'
  },
  api: {
    title: 'Backend HTTP 500 Panic',
    error: "runtime error: invalid memory address or nil pointer dereference",
    location: 'gateway.go:84',
    cause: "defer conn.Release() called immediately after failed dbPool.Acquire() where conn was nil.",
    fixBefore: "conn, err := dbPool.Acquire(ctx)\ndefer conn.Release()",
    fixAfter: "conn, err := dbPool.Acquire(ctx)\nif err != nil {\n    return nil, err\n}\ndefer conn.Release()",
    category: 'Microservices & DB'
  }
};

interface FloatingBug {
  id: number;
  x: number;
  y: number;
  icon: string;
  label: string;
  isSquashed: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchLab }) => {
  const [selectedPreview, setSelectedPreview] = useState<'javascript' | 'python' | 'api'>('javascript');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [squashedCount, setSquashedCount] = useState(0);

  // Floating cartoon bugs interactive mini-state
  const [floatingBugs, setFloatingBugs] = useState<FloatingBug[]>([
    { id: 1, x: 12, y: 18, icon: '🐞', label: 'TypeError', isSquashed: false },
    { id: 2, x: 82, y: 22, icon: '🐛', label: 'KeyError', isSquashed: false },
    { id: 3, x: 88, y: 72, icon: '🪲', label: 'NilPointer', isSquashed: false },
    { id: 4, x: 8, y: 68, icon: '⚡', label: '500 Panic', isSquashed: false },
  ]);

  // Rotate Leo's speech thoughts
  useEffect(() => {
    const timer = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % LEO_THOUGHTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleSquashBug = (id: number) => {
    setFloatingBugs(prev => prev.map(b => b.id === id ? { ...b, isSquashed: true } : b));
    setSquashedCount(prev => prev + 1);
    setTimeout(() => {
      setFloatingBugs(prev => prev.map(b => b.id === id ? { ...b, isSquashed: false } : b));
    }, 2500);
  };

  const preview = PREVIEWS[selectedPreview];

  return (
    <div className="min-h-screen bg-[#080a0d] text-slate-200 selection:bg-[#00f0ff]/30 selection:text-white relative overflow-hidden font-sans">
      {/* Background Animated Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#00f0ff]/15 via-purple-600/10 to-transparent blur-[130px]" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Floating Interactive Cartoon Bugs */}
      {floatingBugs.map((bug) => (
        <motion.div
          key={bug.id}
          style={{ top: `${bug.y}%`, left: `${bug.x}%` }}
          className="fixed z-20 cursor-pointer select-none hidden md:block"
          animate={{
            y: [0, -14, 0],
            x: [0, 8, 0],
            rotate: bug.isSquashed ? [0, 360] : [0, 5, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + bug.id,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.25 }}
          onClick={() => handleSquashBug(bug.id)}
          title="Click to squash bug!"
        >
          {bug.isSquashed ? (
            <motion.div
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold shadow-[0_0_15px_#10b981]"
            >
              <span>✨ Fixed!</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121824]/90 border border-rose-500/40 text-rose-300 text-xs font-mono shadow-[0_0_15px_rgba(244,63,94,0.2)] backdrop-blur-md group hover:border-rose-400">
              <span className="text-base group-hover:animate-bug-wiggle">{bug.icon}</span>
              <span className="text-[11px] font-semibold">{bug.label}</span>
            </div>
          )}
        </motion.div>
      ))}

      {/* Floating Mini Score Badge (Cartoon Bug Smasher) */}
      <div className="fixed bottom-5 left-5 z-40 hidden sm:block">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121824]/90 border border-[#1e2633] backdrop-blur-md shadow-lg text-xs font-mono text-slate-400">
          <span className="text-amber-400">🪲 Bugs Squashed:</span>
          <span className="text-[#00f0ff] font-bold">{squashedCount + 42}</span>
          <span className="text-[10px] text-emerald-400 font-semibold">• Live AI</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080a0d]/85 border-b border-[#1e2633]/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border border-[#00f0ff]/50 bg-[#161b22] shadow-[0_0_20px_rgba(0,240,255,0.25)] group-hover:scale-105 transition-transform duration-300">
                <img src="/developer_avatar.jpg" alt="Leo Avatar" className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#080a0d] shadow-[0_0_8px_#10b981]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm sm:text-base text-white tracking-wider">AI BUG TRIAGE</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161f2c] text-[#00f0ff] border border-[#00f0ff]/30 font-bold">
                  v1.0-PROD
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:block">
                Meet <strong className="text-slate-200 font-semibold">Leo</strong> • 3D Autonomous AI Developer Partner
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-300">
            <a href="#features" className="hover:text-[#00f0ff] transition-colors">Features</a>
            <a href="#scanner" className="hover:text-[#00f0ff] transition-colors">Bug Scanner</a>
            <a href="#demo" className="hover:text-[#00f0ff] transition-colors">Interactive Demo</a>
            <a href="#how-it-works" className="hover:text-[#00f0ff] transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-[#00f0ff] transition-colors">FAQ</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onLaunchLab('javascript')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono text-slate-300 hover:text-white bg-[#121824] hover:bg-[#182232] border border-[#222e42] rounded-xl transition-all"
            >
              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Quick Demo</span>
            </button>

            <button
              onClick={() => onLaunchLab()}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b8ff] hover:from-[#38f8ff] hover:to-[#00f0ff] text-[#080a0d] text-xs sm:text-sm font-mono font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] active:scale-95"
            >
              <span>Launch Debug Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Landing Content */}
      <main className="relative z-10">
        {/* HERO SECTION WITH ANIMATED 3D CARTOON DEVELOPER */}
        <section className="pt-10 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-left">
              {/* Animated Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121824] border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono w-fit shadow-[0_0_20px_rgba(0,240,255,0.15)]"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
                <span className="font-semibold tracking-wide">3D CARTOON AI DEVELOPER AGENT</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
              >
                Turn cryptic crashes into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-sky-300 to-indigo-300">
                  verified 1-click fixes.
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl font-normal"
              >
                Drop your raw crash logs, unhandled exceptions, or failing snippets. <strong className="text-slate-100">Leo</strong> investigates the syntax tree, pinpoints the faulty line in your code, and delivers verified before-and-after diffs over coffee.
              </motion.p>

              {/* Dynamic Cartoon Speech Bubble from Leo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="p-4 rounded-2xl bg-[#0f141f]/95 border border-[#00f0ff]/30 flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden"
              >
                {/* Steam & Coffee particles */}
                <div className="absolute top-2 right-4 flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  <Coffee className="w-3 h-3 text-amber-400" />
                  <span>Coffee: Hot ☕</span>
                </div>

                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#00f0ff] shadow-md animate-float-slow">
                  <img src="/developer_avatar.jpg" alt="Leo Mascot" className="w-full h-full object-cover" />
                </div>

                <div className="text-xs font-mono text-slate-300 pr-16 sm:pr-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[#00f0ff] font-bold">Leo:</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.2 rounded border border-emerald-400/20 font-semibold">
                      Online &amp; Debugging
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={thoughtIndex}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="text-slate-200 font-medium"
                    >
                      "{LEO_THOUGHTS[thoughtIndex]}"
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* CTA Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-1"
              >
                <button
                  onClick={() => onLaunchLab()}
                  className="flex items-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b8ff] hover:from-[#38f8ff] hover:to-[#00f0ff] text-[#080a0d] font-mono text-sm sm:text-base font-bold transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] active:scale-95"
                >
                  <Terminal className="w-5 h-5" />
                  <span>Start Triaging Bugs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#scanner"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#121824] hover:bg-[#182232] border border-[#222e42] text-slate-300 hover:text-white font-mono text-sm transition-all"
                >
                  <Search className="w-4 h-4 text-[#00f0ff]" />
                  <span>Interactive Scanner</span>
                </a>
              </motion.div>

              {/* Metrics / Trust Bar */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1e2633]/60 text-left font-mono">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">&lt; 1,200ms</div>
                  <div className="text-[11px] text-slate-500">Triage Latency</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400">100% Offline</div>
                  <div className="text-[11px] text-slate-500">Heuristic AST Engine</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#00f0ff]">1-Click</div>
                  <div className="text-[11px] text-slate-500">Diff &amp; Code Patch</div>
                </div>
              </div>
            </div>

            {/* Right Character 3D Hero Frame (Animated Pixar Render) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 flex flex-col items-center justify-center relative"
            >
              {/* Floating Code Tokens surrounding Leo */}
              <motion.div
                animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-4 -left-4 z-20 px-3 py-1.5 rounded-xl bg-[#121824]/90 border border-rose-500/40 text-rose-300 text-xs font-mono shadow-xl backdrop-blur-md hidden sm:flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>TypeError: undefined</span>
              </motion.div>

              <motion.div
                animate={{ y: [8, -8, 8], rotate: [2, -2, 2] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="absolute -bottom-4 -right-4 z-20 px-3 py-1.5 rounded-xl bg-[#121824]/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-xl backdrop-blur-md hidden sm:flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fix: user?.email</span>
              </motion.div>

              {/* Main 3D Card */}
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] group animate-float-slow">
                {/* 3D Character Scene */}
                <div className="aspect-[16/11] w-full overflow-hidden bg-[#0d1117] relative flex items-center justify-center">
                  <img
                    src="/developer_mascot.jpg"
                    alt="Leo 3D Pixar Developer Mascot working on laptop with coffee"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080a0d] via-transparent to-transparent opacity-60" />

                  {/* Coffee Steam Animation */}
                  <div className="absolute top-12 left-[54%] w-4 h-8 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 absolute animate-steam" style={{ animationDelay: '0s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 absolute left-2 animate-steam" style={{ animationDelay: '0.8s' }} />
                  </div>
                </div>

                {/* Floating Showcase Footer */}
                <div className="p-4 bg-[#0e131b]/95 border-t border-[#1e2633] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                    <div>
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <span>Leo • Autonomous Dev Agent</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Station: Ready for triage logs
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onLaunchLab('javascript')}
                    className="flex items-center gap-1 text-xs font-mono text-[#00f0ff] bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 px-3 py-1.5 rounded-lg border border-[#00f0ff]/30 transition-colors font-bold"
                  >
                    <span>Try Preset</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* INTERACTIVE CARTOON BUG SCANNER SECTION */}
        <section id="scanner" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1e2633]/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: 3D Character Inspecting Bug Pose */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 flex flex-col items-center justify-center"
            >
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-[#00f0ff]/30 bg-[#0d1117] shadow-[0_20px_50px_rgba(0,240,255,0.15)] group animate-float-reverse">
                <div className="aspect-square w-full overflow-hidden relative">
                  <img
                    src="/developer_inspecting.jpg"
                    alt="Leo inspecting glowing cartoon bug with magnifying glass"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-70" />
                </div>

                <div className="p-4 bg-[#0e131b] border-t border-[#1e2633] text-left font-mono">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-[#00f0ff]" />
                      <span>Leo's AST Lens</span>
                    </span>
                    <span className="text-[10px] text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded border border-[#00f0ff]/20">
                      SCANNING CULPRIT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    "I zoom into the caller frame, detect uninitialized pointers, and isolate why the runtime crashed."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: How the Cartoon Scanning Works */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121824] border border-[#1e2633] text-xs font-mono text-[#00f0ff] w-fit">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>DEEP AST HEURISTICS</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Inspect every stack frame with surgical precision.
              </h2>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
                Most AI tools just hallucinate generic advice. Leo inspects the exact file paths, line indices, syntax trees, and variable boundaries to tell you what failed, where it failed, and how to fix it cleanly.
              </p>

              {/* 3 Step Interactive Cartoon Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-[#12171f] border border-[#1e2633] hover:border-rose-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-2">
                    <Bug className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-200">1. Spot Glitch</div>
                  <p className="text-[11px] text-slate-400 mt-1">Parses tokens &amp; call trees</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#12171f] border border-[#1e2633] hover:border-[#00f0ff]/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] flex items-center justify-center mb-2">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-200">2. Isolate Line</div>
                  <p className="text-[11px] text-slate-400 mt-1">Highlights fault gutter</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#12171f] border border-[#1e2633] hover:border-emerald-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-2">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-200">3. Apply Diff</div>
                  <p className="text-[11px] text-slate-400 mt-1">1-click safe code patch</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DEMO SANDBOX PREVIEW */}
        <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1e2633]/60">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121824] border border-[#1e2633] text-xs font-mono text-slate-400 mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>LIVE TRIAGE SIMULATOR</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Test Leo in Action.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Select an error category below to preview instant root cause isolation and verified code patches.
            </p>

            {/* Category Selectors */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setSelectedPreview('javascript')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  selectedPreview === 'javascript'
                    ? 'bg-[#00f0ff] text-[#080a0d] font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-[#121824] text-slate-400 hover:text-white border border-[#1e2633]'
                }`}
              >
                <span>JavaScript (TypeError)</span>
              </button>
              <button
                onClick={() => setSelectedPreview('python')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  selectedPreview === 'python'
                    ? 'bg-[#00f0ff] text-[#080a0d] font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-[#121824] text-slate-400 hover:text-white border border-[#1e2633]'
                }`}
              >
                <span>Python (KeyError)</span>
              </button>
              <button
                onClick={() => setSelectedPreview('api')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  selectedPreview === 'api'
                    ? 'bg-[#00f0ff] text-[#080a0d] font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-[#121824] text-slate-400 hover:text-white border border-[#1e2633]'
                }`}
              >
                <span>Go / Backend (HTTP 500)</span>
              </button>
            </div>
          </div>

          {/* Interactive Preview Card */}
          <div className="max-w-5xl mx-auto rounded-2xl bg-[#0d1117] border border-[#1e2633] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Animated Laser Scanning Sweep */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent animate-laser-sweep shadow-[0_0_15px_#00f0ff]" />

            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#1e2633]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-rose-400 font-semibold">{preview.title}</div>
                  <div className="text-sm font-mono font-bold text-white">{preview.error}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 bg-[#12171f] px-2.5 py-1 rounded border border-[#1e2633]">
                  Location: <code className="text-slate-200">{preview.location}</code>
                </span>
                <button
                  onClick={() => onLaunchLab(selectedPreview)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-[#38f8ff] text-[#080a0d] font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] active:scale-95"
                >
                  <span>Open in Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              {/* Left Root Cause Analysis */}
              <div className="lg:col-span-6 p-4 rounded-xl bg-[#12171f] border border-[#1e2633] flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#00f0ff] flex items-center gap-1.5 mb-2">
                    <Search className="w-3.5 h-3.5" />
                    <span>Likely Root Cause</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 leading-relaxed">
                    {preview.cause}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e2633] flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confidence: 96% • Verified remediation steps ready</span>
                </div>
              </div>

              {/* Right Diff Fix Preview */}
              <div className="lg:col-span-6 p-4 rounded-xl bg-[#0a0d12] border border-[#1e2633] font-mono text-xs">
                <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
                  <span>Suggested Fix (Diff)</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.2 rounded border border-emerald-400/20 font-bold">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    <span className="text-rose-500 font-bold mr-2">- BEFORE:</span>
                    <pre className="inline text-[11px]">{preview.fixBefore}</pre>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="text-emerald-400 font-bold mr-2">+ AFTER:</span>
                    <pre className="inline text-[11px]">{preview.fixAfter}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES GRID */}
        <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1e2633]/60">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121824] border border-[#1e2633] text-xs font-mono text-[#00f0ff] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>POWERED BY ADVANCED AGENTIC REASONING</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Engineered for developer productivity.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Everything you need to understand, isolate, and repair broken code in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-[#0d1117] border border-[#1e2633] hover:border-[#00f0ff]/40 transition-all group shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-[#161b22] border border-[#30363d] text-[#00f0ff] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-mono font-bold text-white mb-2">IDE Fault Line Marker</h3>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Highlights the exact line of failure in an IDE-style code container with error gutter markers and AI insight annotations.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-[#0d1117] border border-[#1e2633] hover:border-[#00f0ff]/40 transition-all group shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-[#161b22] border border-[#30363d] text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-mono font-bold text-white mb-2">Before &amp; After Diffs</h3>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Generates instant, drop-in replacement diffs. Copy the fix with one click and apply it directly in VS Code or JetBrains.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-[#0d1117] border border-[#1e2633] hover:border-[#00f0ff]/40 transition-all group shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-[#161b22] border border-[#30363d] text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-mono font-bold text-white mb-2">100% Offline Engine</h3>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Built-in heuristic AST classifier guarantees offline uptime without requiring API tokens or external cloud dependencies.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-[#0d1117] border border-[#1e2633] hover:border-[#00f0ff]/40 transition-all group shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-[#161b22] border border-[#30363d] text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-mono font-bold text-white mb-2">Step-by-Step Debug Path</h3>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Numbered diagnosis steps with interactive completion checkboxes and terminal CLI copy shortcuts for reproducible debugging.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-[#0d1117] border border-[#1e2633] hover:border-[#00f0ff]/40 transition-all group shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-[#161b22] border border-[#30363d] text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-mono font-bold text-white mb-2">Export Markdown Reports</h3>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                One-click full post-mortem export formatted in clean GitHub Markdown, ready to paste into Jira tickets or GitHub PRs.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-[#0d1117] border border-[#1e2633] hover:border-[#00f0ff]/40 transition-all group shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-[#161b22] border border-[#30363d] text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-mono font-bold text-white mb-2">Multi-Modal Drop Zone</h3>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Paste raw text, drag and drop .log files, or upload error screenshots directly into the high-tech terminal drop zone.
              </p>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1e2633]/60">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121824] border border-[#1e2633] text-xs font-mono text-slate-400 mb-3">
              <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>THE 4-STAGE TRIAGE PIPELINE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              From raw stack trace to verified fix.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#1e2633] relative">
              <div className="text-xs font-mono font-bold text-[#00f0ff] mb-2">01. INGEST</div>
              <h4 className="text-sm font-mono font-bold text-white mb-1">Drop Error Log</h4>
              <p className="text-[11px] font-mono text-slate-400">
                Accepts stack traces, code snippets, log files, and screenshots.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#1e2633] relative">
              <div className="text-xs font-mono font-bold text-[#00f0ff] mb-2">02. CLASSIFY</div>
              <h4 className="text-sm font-mono font-bold text-white mb-1">AST Token Scan</h4>
              <p className="text-[11px] font-mono text-slate-400">
                Maps error signatures against language fault taxonomy and caller frames.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#1e2633] relative">
              <div className="text-xs font-mono font-bold text-[#00f0ff] mb-2">03. ISOLATE</div>
              <h4 className="text-sm font-mono font-bold text-white mb-1">Locate Culprit Line</h4>
              <p className="text-[11px] font-mono text-slate-400">
                Pinpoints the exact faulty expression in the syntax tree with confidence scores.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#1e2633] relative">
              <div className="text-xs font-mono font-bold text-emerald-400 mb-2">04. PATCH</div>
              <h4 className="text-sm font-mono font-bold text-white mb-1">Verified Code Diff</h4>
              <p className="text-[11px] font-mono text-slate-400">
                Generates a clean BEFORE vs AFTER patch with verified step-by-step guidance.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#1e2633]/60">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Everything you need to know about the AI Bug Triage Agent.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#0d1117] border border-[#1e2633] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-slate-200 font-bold hover:text-[#00f0ff] transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#00f0ff] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 text-slate-400 text-[11px] leading-relaxed border-t border-[#1e2633]/50 pt-3"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-[#0f1522] via-[#0d1117] to-[#121824] border border-[#00f0ff]/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#00f0ff]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto flex flex-col items-center gap-5 relative z-10">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.4)] animate-float-slow">
                <img src="/developer_avatar.jpg" alt="Leo" className="w-full h-full object-cover" />
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Ready to stop hunting bugs in the dark?
              </h2>

              <p className="text-slate-400 text-sm sm:text-base font-mono">
                Launch the Debug Lab workspace and let Leo triage your next error in seconds.
              </p>

              <button
                onClick={() => onLaunchLab()}
                className="mt-2 flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b8ff] hover:from-[#38f8ff] hover:to-[#00f0ff] text-[#080a0d] font-mono text-sm sm:text-base font-bold transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] active:scale-95"
              >
                <Terminal className="w-5 h-5" />
                <span>Launch Debug Lab Workspace</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e2633] bg-[#07090c] px-4 sm:px-8 py-8 font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-bold">AI BUG TRIAGE AGENT</span>
            <span>•</span>
            <span>Autonomous Error Triage System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              System Online
            </span>
            <span>Keyboard Shortcuts: [Ctrl+Enter] Analyze • [Esc] Clear</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
